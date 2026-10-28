package space.centaurian.app

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Handler
import android.os.Looper
import android.provider.Settings
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.core.content.FileProvider
import org.json.JSONObject
import java.io.File
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest

/**
 * App-Updates: prueft eine Versionsdatei im GitHub-Release "app-latest", laedt die APK und startet die Installation.
 * Der Stand wird gespeichert: eine fertig geladene, geprueft APK wird nicht noch einmal geladen, ein abgebrochener
 * Download setzt an der alten Stelle fort, und das bereitliegende Update bleibt auch nach Verlassen der App bekannt.
 */
object Updater {
    private const val BASE = "https://github.com/solomongrishnakh-crypto/music-app/releases/download/app-latest/"
    private const val MIN_SIZE = 1_000_000L

    data class Info(val code: Int, val name: String, val sha: String = "")

    var avail by mutableStateOf<Info?>(null)
    var progress by mutableIntStateOf(-1)   // -1 = kein Download aktiv, sonst 0..100
    var pct by mutableIntStateOf(0)         // letzter bekannter Fortschritt (auch nach Abbruch)
    var ready by mutableStateOf(false)      // fertig geladen und geprueft
    var dismissed by mutableStateOf(false)  // "Spaeter" gedrueckt (nur bis zum naechsten App-Start / manueller Suche)
    var msg by mutableStateOf("")
    private val main = Handler(Looper.getMainLooper())

    @Volatile private var lastAuto = 0L
    private var restored = false

    private fun prefs(c: Context) = c.getSharedPreferences("cn_upd", Context.MODE_PRIVATE)
    private fun dir(c: Context) = File(c.cacheDir, "updates").apply { mkdirs() }
    private fun apk(c: Context) = File(dir(c), "Centaurian.apk")
    private fun part(c: Context) = File(dir(c), "Centaurian.apk.part")

    private fun wipe(c: Context) {
        File(c.cacheDir, "updates").deleteRecursively()
        prefs(c).edit().clear().apply()
        ready = false; pct = 0
    }

    /** Gemerktes Update wiederherstellen (einmal pro Prozess, im Hauptthread). */
    private fun restore(c: Context) {
        if (restored) return
        restored = true
        val p = prefs(c)
        val code = p.getInt("code", 0)
        if (code <= 0) return
        if (code <= installedCode(c)) { wipe(c); return } // schon installiert: Reste aufraeumen
        avail = Info(code, p.getString("name", "") ?: "", p.getString("sha", "") ?: "")
        ready = p.getBoolean("ready", false) && apk(c).length() > MIN_SIZE
        pct = if (ready) 100 else 0
    }

    fun check(ctx: Context, manual: Boolean) {
        val app = ctx.applicationContext
        restore(app)
        if (!manual) {
            val n = System.currentTimeMillis()
            if (n - lastAuto < 5 * 60 * 1000) return
            lastAuto = n
        } else { msg = "…"; dismissed = false }
        Thread {
            val i = fetch()
            main.post {
                when {
                    i == null -> if (manual) msg = "?"
                    i.code > installedCode(app) -> {
                        if (avail?.code != i.code) { // neue Version: alte Reste verwerfen
                            if (progress < 0) wipe(app)
                            prefs(app).edit().putInt("code", i.code).putString("name", i.name).putString("sha", i.sha).apply()
                            ready = false; pct = 0; dismissed = false
                        }
                        avail = i
                        if (manual) msg = ""
                    }
                    else -> { if (avail != null) { wipe(app); avail = null }; if (manual) msg = "ok" }
                }
            }
        }.start()
    }

    /** "Jetzt aktualisieren": fertige Datei sofort installieren, sonst (weiter) laden. */
    fun start(ctx: Context) {
        val app = ctx.applicationContext
        val info = avail ?: return
        if (progress >= 0) return
        msg = ""
        if (ready && apk(app).length() > MIN_SIZE) { install(app, apk(app)); return }
        progress = 0
        Thread {
            val f = download(app, info) { p -> main.post { progress = p; pct = p } }
            main.post {
                progress = -1
                if (f == null) msg = "!"
                else {
                    ready = true; pct = 100
                    prefs(app).edit().putBoolean("ready", true).apply()
                    install(app, f)
                }
            }
        }.start()
    }

    fun installedCode(ctx: Context): Int =
        try {
            @Suppress("DEPRECATION")
            ctx.packageManager.getPackageInfo(ctx.packageName, 0).versionCode
        } catch (_: Exception) { Int.MAX_VALUE }

    fun installedName(ctx: Context): String =
        try { ctx.packageManager.getPackageInfo(ctx.packageName, 0).versionName ?: "" } catch (_: Exception) { "" }

    private fun open(path: String, from: Long = 0L): HttpURLConnection {
        val c = URL(BASE + path + "?t=" + System.currentTimeMillis()).openConnection() as HttpURLConnection
        c.connectTimeout = 10000
        c.readTimeout = 20000
        c.instanceFollowRedirects = true
        if (from > 0) c.setRequestProperty("Range", "bytes=$from-")
        return c
    }

    /** Blockierend - in einem Hintergrund-Thread aufrufen. */
    fun fetch(): Info? = try {
        val txt = open("version.json").inputStream.bufferedReader().use { it.readText() }
        val o = JSONObject(txt)
        Info(o.getInt("code"), o.optString("name"), o.optString("sha256").lowercase())
    } catch (_: Exception) { null }

    private fun sha256(f: File): String {
        val md = MessageDigest.getInstance("SHA-256")
        f.inputStream().use { input ->
            val buf = ByteArray(64 * 1024)
            while (true) { val n = input.read(buf); if (n < 0) break; md.update(buf, 0, n) }
        }
        return md.digest().joinToString("") { "%02x".format(it) }
    }

    /**
     * Blockierend. Laedt in eine .part-Datei und setzt einen abgebrochenen Download per Range-Anfrage fort.
     * Gibt die fertige, geprueft APK zurueck oder null (die .part-Datei bleibt dann zum Fortsetzen liegen).
     */
    fun download(ctx: Context, info: Info, onProgress: (Int) -> Unit): File? = try {
        val part = part(ctx)
        val have = if (part.exists()) part.length() else 0L
        val c = open("Centaurian.apk", have)
        val code = c.responseCode
        if (code != 200 && code != 206) { if (code == 416) part.delete(); null }
        else {
            val append = code == 206
            val total = (if (append) have else 0L) + c.contentLengthLong
            var done = if (append) have else 0L
            var last = -1
            c.inputStream.use { input ->
                java.io.FileOutputStream(part, append).use { out ->
                    val buf = ByteArray(64 * 1024)
                    while (true) {
                        val n = input.read(buf)
                        if (n < 0) break
                        out.write(buf, 0, n)
                        done += n
                        if (total > 0) {
                            val p = (done * 100 / total).toInt()
                            if (p != last) { last = p; onProgress(p) }
                        }
                    }
                }
            }
            // Pruefsumme aus version.json muss stimmen, sonst wird die Datei verworfen (Schutz vor manipulierten Downloads)
            val f = apk(ctx)
            if (part.length() > MIN_SIZE && (info.sha.isEmpty() || info.sha == sha256(part))) {
                f.delete()
                if (part.renameTo(f)) f else null
            } else { part.delete(); null }
        }
    } catch (_: Exception) { null }

    /** false, wenn erst die Erlaubnis "Apps installieren" erteilt werden muss (Einstellungen wurden geoeffnet). */
    fun install(ctx: Context, f: File): Boolean {
        if (!ctx.packageManager.canRequestPackageInstalls()) {
            try {
                ctx.startActivity(
                    Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:" + ctx.packageName)).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK),
                )
            } catch (_: Exception) { }
            return false
        }
        val uri = FileProvider.getUriForFile(ctx, "space.centaurian.app.files", f)
        ctx.startActivity(
            Intent(Intent.ACTION_VIEW)
                .setDataAndType(uri, "application/vnd.android.package-archive")
                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_ACTIVITY_NEW_TASK),
        )
        return true
    }
}
