package space.centaurian.app

import android.content.Context
import android.os.Handler
import android.os.Looper
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import org.json.JSONObject
import java.io.ByteArrayInputStream
import java.io.File
import java.io.FileInputStream
import java.io.InputStream
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest

/**
 * Offline-Inhalte: Die App merkt sich die Dateien einer Seite (z.B. Sternenhimmel) im
 * App-Speicher und liefert sie ohne Netz selbst aus. Die Webseite bleibt unveraendert.
 * Aufbau: files/offline/cur (aktiv) – neue Daten werden in files/offline/tmp geladen
 * und erst am Ende in einem Schritt zu "cur" gemacht (nie halb fertig).
 */
object OfflineStore {
    private const val HOST = "centaurianspace.com"
    private val PAGES = listOf("https://centaurianspace.com/sternenhimmel", "https://centaurianspace.com/night-sky")

    class Entry(val file: String, val mime: String, val etag: String, val lm: String, val size: Long)

    @Volatile private var idx: Map<String, Entry>? = null
    @Volatile private var loadedFor: File? = null

    var busy by mutableStateOf(false)
    var pct by mutableIntStateOf(0)
    var failed by mutableStateOf(false)
    var bytes by mutableStateOf(0L)
    var ready by mutableStateOf(false)

    private fun root(ctx: Context) = File(ctx.filesDir, "offline")
    private fun cur(ctx: Context) = File(root(ctx), "cur")

    fun init(ctx: Context) {
        val m = load(ctx)
        ready = m.isNotEmpty()
        bytes = m.values.sumOf { it.size }
    }

    private fun load(ctx: Context): Map<String, Entry> {
        val c = cur(ctx)
        idx?.let { if (loadedFor == c) return it }
        val m = HashMap<String, Entry>()
        try {
            val f = File(c, "index.json")
            if (f.exists()) {
                val o = JSONObject(f.readText())
                o.keys().forEach { k ->
                    val e = o.getJSONObject(k)
                    m[k] = Entry(e.getString("f"), e.optString("m", "application/octet-stream"), e.optString("e"), e.optString("l"), e.optLong("s"))
                }
            }
        } catch (_: Exception) { m.clear() }
        idx = m; loadedFor = c
        return m
    }

    fun lastUpdate(ctx: Context): Long = File(cur(ctx), "index.json").lastModified()

    fun keyOf(host: String, path: String) = host + path

    private fun sha(s: String): String = MessageDigest.getInstance("SHA-1").digest(s.toByteArray()).joinToString("") { "%02x".format(it) }

    private fun allowed(host: String, path: String): Boolean {
        if (host == HOST || host == "www.$HOST") return !path.startsWith("/api/")
        return host == "cdn.eso.org" && path.startsWith("/images/")
    }

    // ---------------- Ausliefern (ohne Netz) ----------------

    fun serve(ctx: Context, req: WebResourceRequest): WebResourceResponse? {
        if (Offline.online) return null
        if (!req.method.equals("GET", true)) return null
        val u = req.url
        val host = u.host ?: return null
        val path = u.path ?: "/"
        if (host != HOST && host != "www.$HOST" && host != "cdn.eso.org") return null
        val m = load(ctx)
        if (m.isEmpty()) return null
        // Seiten-Wechsel per Next.js-Datenabruf: fehlschlagen lassen, dann laedt Next die Seite komplett neu
        if (u.getQueryParameter("_rsc") != null || req.requestHeaders["RSC"] != null || req.requestHeaders["rsc"] != null) {
            if (m.containsKey(keyOf(HOST, path)) || m.keys.any { it.startsWith(HOST) }) {
                return WebResourceResponse("text/plain", "utf-8", 503, "Offline", mapOf("Access-Control-Allow-Origin" to "*"), ByteArrayInputStream(ByteArray(0)))
            }
            return null
        }
        val e = m[keyOf(host, path)] ?: m[keyOf(host, path.trimEnd('/'))] ?: return null
        val f = File(cur(ctx), e.file)
        if (!f.exists()) return null
        val total = f.length()
        val hdr = HashMap<String, String>()
        hdr["Access-Control-Allow-Origin"] = "*"
        hdr["Accept-Ranges"] = "bytes"
        hdr["Cache-Control"] = "no-store"
        val mime = e.mime.substringBefore(';').trim().ifEmpty { "application/octet-stream" }
        val enc = if (mime.startsWith("text/") || mime.contains("json") || mime.contains("javascript") || mime.contains("xml")) "utf-8" else null
        val range = req.requestHeaders["Range"] ?: req.requestHeaders["range"]
        if (range != null && range.startsWith("bytes=")) {
            try {
                val p = range.removePrefix("bytes=").split("-")
                var a = p[0].toLongOrNull() ?: 0L
                var b = p.getOrNull(1)?.toLongOrNull() ?: (total - 1)
                if (p[0].isEmpty()) { val n = p[1].toLong(); a = maxOf(0, total - n); b = total - 1 }
                if (b >= total) b = total - 1
                if (a > b || a >= total) {
                    hdr["Content-Range"] = "bytes */$total"
                    return WebResourceResponse(mime, enc, 416, "Range Not Satisfiable", hdr, ByteArrayInputStream(ByteArray(0)))
                }
                val len = b - a + 1
                hdr["Content-Range"] = "bytes $a-$b/$total"
                hdr["Content-Length"] = len.toString()
                val fis = FileInputStream(f)
                fis.skip(a)
                return WebResourceResponse(mime, enc, 206, "Partial Content", hdr, LimitedStream(fis, len))
            } catch (_: Exception) { }
        }
        hdr["Content-Length"] = total.toString()
        return WebResourceResponse(mime, enc, 200, "OK", hdr, FileInputStream(f))
    }

    private class LimitedStream(private val s: InputStream, private var left: Long) : InputStream() {
        override fun read(): Int { if (left <= 0) return -1; val r = s.read(); if (r >= 0) left--; return r }
        override fun read(b: ByteArray, off: Int, len: Int): Int {
            if (left <= 0) return -1
            val r = s.read(b, off, minOf(len.toLong(), left).toInt())
            if (r > 0) left -= r
            return r
        }
        override fun close() = s.close()
    }

    // ---------------- Lernen / Aktualisieren ----------------

    private class Job(val ctx: Context, val tmp: File, val old: Map<String, Entry>, val oldDir: File) {
        val out = HashMap<String, Entry>()
        @Volatile var lastReq = System.currentTimeMillis()
        @Volatile var mainOk = 0
        @Volatile var extraFail = 0
        var total = 0L

        /** Datei holen (mit Nachfrage "geaendert?") und ablegen. Gibt true bei Erfolg. */
        fun fetch(url: String, headers: Map<String, String>? = null): Boolean {
            val u = Uri(url)
            val key = keyOf(u.host, u.path)
            synchronized(out) { if (out.containsKey(key)) return true }
            val o = old[key]
            var conn: HttpURLConnection? = null
            try {
                conn = URL(url).openConnection() as HttpURLConnection
                conn.connectTimeout = 15000; conn.readTimeout = 30000
                conn.instanceFollowRedirects = true
                headers?.forEach { (k, v) -> if (k.lowercase() in listOf("user-agent", "accept", "accept-language", "referer")) conn.setRequestProperty(k, v) }
                if (o != null && File(oldDir, o.file).exists()) {
                    if (o.etag.isNotEmpty()) conn.setRequestProperty("If-None-Match", o.etag)
                    if (o.lm.isNotEmpty()) conn.setRequestProperty("If-Modified-Since", o.lm)
                }
                val code = conn.responseCode
                val name = sha(key)
                val dst = File(tmp, name)
                if (code == 304 && o != null) {
                    File(oldDir, o.file).copyTo(dst, true)
                    synchronized(out) { out[key] = Entry(name, o.mime, o.etag, o.lm, dst.length()) }
                    return true
                }
                if (code != 200) return false
                conn.inputStream.use { ins -> dst.outputStream().use { ins.copyTo(it) } }
                val e = Entry(name, conn.contentType ?: "application/octet-stream", conn.getHeaderField("ETag") ?: "", conn.getHeaderField("Last-Modified") ?: "", dst.length())
                synchronized(out) { out[key] = e }
                return true
            } catch (_: Exception) {
                return false
            } finally {
                try { conn?.disconnect() } catch (_: Exception) { }
            }
        }

        fun response(url: String): WebResourceResponse? {
            val u = Uri(url)
            val e = synchronized(out) { out[keyOf(u.host, u.path)] } ?: return null
            val f = File(tmp, e.file)
            val mime = e.mime.substringBefore(';').trim().ifEmpty { "application/octet-stream" }
            val enc = if (mime.startsWith("text/") || mime.contains("json") || mime.contains("javascript")) "utf-8" else null
            return WebResourceResponse(mime, enc, 200, "OK", mapOf("Access-Control-Allow-Origin" to "*"), FileInputStream(f))
        }
    }

    private class Uri(url: String) {
        val host: String
        val path: String
        init {
            val u = URL(url)
            host = u.host; path = if (u.path.isEmpty()) "/" else u.path
        }
    }

    @Volatile private var running = false

    /** Laedt/aktualisiert die Offline-Inhalte. Laeuft im Hintergrund; Fortschritt ueber busy/pct. */
    fun update(ctx0: Context, onDone: ((Boolean) -> Unit)? = null) {
        val ctx = ctx0.applicationContext
        if (running) return
        running = true
        val main = Handler(Looper.getMainLooper())
        main.post { busy = true; failed = false; pct = 1 }
        Thread {
            var ok = false
            try {
                val tmp = File(root(ctx), "tmp")
                tmp.deleteRecursively(); tmp.mkdirs()
                val old = load(ctx)
                val job = Job(ctx, tmp, old, cur(ctx))
                // 1) Seiten im unsichtbaren Browser laden, dabei jede Datei mitnehmen
                for ((i, page) in PAGES.withIndex()) {
                    runPage(ctx, job, page)
                    main.post { pct = 5 + (i + 1) * 35 }
                }
                // 2) feste Liste (Bilder, Daten, Musik …)
                val list = try { ctx.assets.open("offline_sky.txt").bufferedReader().readLines().map { it.trim() }.filter { it.isNotEmpty() && !it.startsWith("#") } } catch (_: Exception) { emptyList() }
                var n = 0
                for (p in list) {
                    if (!job.fetch("https://$HOST$p")) job.extraFail++
                    n++
                    val pp = 5 + 70 + (n * 25 / maxOf(1, list.size))
                    main.post { pct = pp }
                }
                // 3) pruefen: Hauptseiten da, nichts Wichtiges fehlt
                val keys = job.out.keys
                val haveSky = keys.contains(keyOf(HOST, "/sternenhimmel")) && keys.contains(keyOf(HOST, "/sternenhimmel.html")) && keys.contains(keyOf(HOST, "/sky-audio/music.mp3")) && keys.contains(keyOf(HOST, "/sky-data/stars.bin"))
                if (haveSky && job.extraFail <= list.size / 20) {
                    val o = JSONObject()
                    job.out.forEach { (k, e) ->
                        o.put(k, JSONObject().put("f", e.file).put("m", e.mime).put("e", e.etag).put("l", e.lm).put("s", e.size))
                    }
                    File(tmp, "index.json").writeText(o.toString())
                    // atomar umschalten
                    val curD = cur(ctx)
                    val oldD = File(root(ctx), "old")
                    oldD.deleteRecursively()
                    if (curD.exists()) curD.renameTo(oldD)
                    if (tmp.renameTo(curD)) {
                        idx = null
                        oldD.deleteRecursively()
                        ok = true
                    } else if (oldD.exists()) oldD.renameTo(curD)
                } else tmp.deleteRecursively()
            } catch (_: Exception) { ok = false }
            running = false
            main.post {
                init(ctx)
                busy = false; pct = 0; failed = !ok
                onDone?.invoke(ok)
            }
        }.start()
    }

    private fun runPage(ctx: Context, job: Job, page: String) {
        val main = Handler(Looper.getMainLooper())
        val done = java.util.concurrent.CountDownLatch(1)
        var wv: WebView? = null
        main.post {
            try {
                val w = WebView(ctx)
                wv = w
                w.settings.javaScriptEnabled = true
                w.settings.domStorageEnabled = true
                w.settings.mediaPlaybackRequiresUserGesture = true
                w.settings.cacheMode = WebSettings.LOAD_NO_CACHE
                w.webViewClient = object : WebViewClient() {
                    override fun shouldInterceptRequest(view: WebView?, request: WebResourceRequest?): WebResourceResponse? {
                        val r = request ?: return null
                        if (!r.method.equals("GET", true)) return null
                        val u = r.url
                        val h = u.host ?: return null
                        val p = u.path ?: "/"
                        if (u.scheme != "https" || !allowed(h, p)) return null
                        if (u.getQueryParameter("_rsc") != null) return null
                        job.lastReq = System.currentTimeMillis()
                        val isMain = r.isForMainFrame
                        val ok = job.fetch(u.toString(), r.requestHeaders)
                        if (isMain && ok) job.mainOk++
                        return if (ok) job.response(u.toString()) else null
                    }
                }
                w.loadUrl(page)
            } catch (_: Exception) { done.countDown() }
        }
        // warten bis ca. 12 s lang nichts Neues kam (max. 80 s)
        val start = System.currentTimeMillis()
        job.lastReq = start
        while (System.currentTimeMillis() - start < 80000) {
            Thread.sleep(500)
            if (System.currentTimeMillis() - job.lastReq > 12000 && System.currentTimeMillis() - start > 15000) break
        }
        main.post {
            try { wv?.stopLoading(); wv?.destroy() } catch (_: Exception) { }
            done.countDown()
        }
        done.await(5, java.util.concurrent.TimeUnit.SECONDS)
    }

    fun delete(ctx: Context) {
        idx = null
        File(root(ctx), "tmp").deleteRecursively()
        File(root(ctx), "old").deleteRecursively()
        cur(ctx).deleteRecursively()
        ready = false; bytes = 0
    }

    fun isUnmetered(ctx: Context): Boolean {
        val cm = ctx.getSystemService(Context.CONNECTIVITY_SERVICE) as android.net.ConnectivityManager
        val n = cm.activeNetwork ?: return false
        val c = cm.getNetworkCapabilities(n) ?: return false
        return c.hasCapability(android.net.NetworkCapabilities.NET_CAPABILITY_NOT_METERED)
    }

    /** Taeglich leise aktualisieren, nur im WLAN. */
    fun autoUpdate(ctx: Context) {
        try {
            val prefs = ctx.getSharedPreferences("cn", Context.MODE_PRIVATE)
            if (!ready || busy || !Offline.online) return
            if (!prefs.getBoolean("off_auto", true)) return
            if (System.currentTimeMillis() - lastUpdate(ctx) < 24L * 3600 * 1000) return
            if (prefs.getBoolean("off_wifi", true) && !isUnmetered(ctx)) return
            update(ctx)
        } catch (_: Exception) { }
    }
}
