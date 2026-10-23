package space.centaurian.app

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.provider.Settings
import androidx.core.content.FileProvider
import android.os.Handler
import android.os.Looper
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import org.json.JSONObject
import java.io.File
import java.net.HttpURLConnection
import java.net.URL

/** App-Updates: prueft eine Versionsdatei im GitHub-Release "app-latest", laedt die APK und startet die Installation. */
object Updater {
    private const val BASE = "https://github.com/solomongrishnakh-crypto/music-app/releases/download/app-latest/"

    data class Info(val code: Int, val name: String)

    var avail by mutableStateOf<Info?>(null)
    var progress by mutableIntStateOf(-1)
    var msg by mutableStateOf("")
    private val main = Handler(Looper.getMainLooper())

    fun check(ctx: Context, manual: Boolean) {
        val app = ctx.applicationContext
        if (manual) msg = "…"
        Thread {
            val i = fetch()
            main.post {
                if (i == null) { if (manual) msg = "?" }
                else if (i.code > installedCode(app)) { avail = i; msg = "" }
                else if (manual) msg = "ok"
            }
        }.start()
    }

    fun start(ctx: Context) {
        val app = ctx.applicationContext
        if (progress >= 0) return
        progress = 0
        Thread {
            val f = download(app) { p -> main.post { progress = p } }
            main.post {
                progress = -1
                if (f == null) msg = "!"
                else if (install(app, f)) avail = null
            }
        }.start()
    }

    fun installedCode(ctx: Context): Int =
        try {
            @Suppress("DEPRECATION")
            ctx.packageManager.getPackageInfo(ctx.packageName, 0).versionCode
        } catch (_: Exception) { Int.MAX_VALUE }

    private fun open(path: String): HttpURLConnection {
        val c = URL(BASE + path + "?t=" + System.currentTimeMillis()).openConnection() as HttpURLConnection
        c.connectTimeout = 10000
        c.readTimeout = 20000
        c.instanceFollowRedirects = true
        return c
    }

    /** Blockierend - in einem Hintergrund-Thread aufrufen. */
    fun fetch(): Info? = try {
        val txt = open("version.json").inputStream.bufferedReader().use { it.readText() }
        val o = JSONObject(txt)
        Info(o.getInt("code"), o.optString("name"))
    } catch (_: Exception) { null }

    /** Blockierend. Gibt die geladene APK zurueck oder null. */
    fun download(ctx: Context, onProgress: (Int) -> Unit): File? = try {
        val dir = File(ctx.cacheDir, "updates").apply { mkdirs() }
        val f = File(dir, "Centaurian.apk")
        val c = open("Centaurian.apk")
        val total = c.contentLength.toLong()
        c.inputStream.use { input ->
            f.outputStream().use { out ->
                val buf = ByteArray(64 * 1024)
                var done = 0L
                var last = -1
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
        if (f.length() > 1_000_000) f else null
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
