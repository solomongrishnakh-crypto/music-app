package space.centaurian.app

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.graphics.drawable.Icon
import android.media.AudioManager
import android.media.MediaMetadata
import android.media.session.MediaSession
import android.media.session.PlaybackState
import android.os.Build
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.webkit.JavascriptInterface
import androidx.compose.runtime.mutableIntStateOf
import android.webkit.WebView
import org.json.JSONObject
import org.json.JSONTokener

/** Verbindung zum Player der Webseite (in der Startseiten-WebView): Knoepfe klicken und Titel lesen. */
object MusicBridge {
    @Volatile var web: WebView? = null
    @Volatile var title = ""
    @Volatile var artist = ""
    @Volatile var playing = false
    @Volatile var stamp = 0L
    @Volatile var cmd = ""
    @Volatile var guard = false
    @Volatile var fg = true
    @Volatile var appCtx: Context? = null
    @Volatile var serviceUp = false
    @Volatile private var lastStart = 0L
    private val events = java.util.ArrayDeque<String>()
    /** Kurzes Ereignis-Protokoll fuer die Diagnose (die letzten 14 Eintraege). */
    fun log(msg: String) {
        synchronized(events) {
            val t = java.text.SimpleDateFormat("HH:mm:ss", java.util.Locale.GERMANY).format(java.util.Date())
            events.addLast("$t $msg")
            while (events.size > 14) events.removeFirst()
        }
    }
    fun logText(): String = synchronized(events) { events.joinToString("\n") }

    /** Startet die Benachrichtigung, sobald Musik laeuft (auch bei geoeffneter App). */
    fun ensureService() {
        val c = appCtx ?: return
        val now = System.currentTimeMillis()
        if (serviceUp || now - lastStart < 4000) return
        lastStart = now
        Handler(Looper.getMainLooper()).post {
            try { c.startForegroundService(Intent(c, MusicService::class.java)) } catch (_: Exception) { }
        }
    }
    val openReq = mutableIntStateOf(0)
    val backReq = mutableIntStateOf(0)
    @Volatile var want = false
    /** Nutzer hat selbst pausiert (Benachrichtigung/Kopfhoerer): die Auto-Fortsetzung darf dann nicht wieder starten. */
    @Volatile var userPaused = false
    @Volatile var userPausedAt = 0L
    @Volatile var cover = ""
    @Volatile var pos = 0.0
    @Volatile var dur = 0.0
    @Volatile var seekAt = 0L
    @Volatile var seekPos = 0.0

    /** Bass-Pegel 0..1 aus dem Audio-Ausgang (Visualizer), -1 = nicht verfuegbar. */
    @Volatile var level = -1f
    private var viz: android.media.audiofx.Visualizer? = null
    private var vizMax = 40f

    @Synchronized fun vizSync(on: Boolean) {
        val c = appCtx ?: return
        if (!on) {
            try { viz?.enabled = false; viz?.release() } catch (_: Exception) { }
            viz = null; level = -1f; return
        }
        if (viz != null) return
        val sp = c.getSharedPreferences("cn", android.content.Context.MODE_PRIVATE)
        if (sp.contains("bass") && !sp.getBoolean("bass", true)) return
        if (c.checkSelfPermission(android.Manifest.permission.RECORD_AUDIO) != android.content.pm.PackageManager.PERMISSION_GRANTED) return
        try {
            val v = android.media.audiofx.Visualizer(0)
            v.captureSize = android.media.audiofx.Visualizer.getCaptureSizeRange()[0].coerceAtLeast(256)
            v.setDataCaptureListener(object : android.media.audiofx.Visualizer.OnDataCaptureListener {
                override fun onWaveFormDataCapture(vis: android.media.audiofx.Visualizer?, w: ByteArray?, r: Int) { }
                override fun onFftDataCapture(vis: android.media.audiofx.Visualizer?, f: ByteArray?, r: Int) {
                    if (f == null || f.size < 12) return
                    var e = 0f
                    for (i in 1..4) { val re = f[2 * i].toFloat(); val im = f[2 * i + 1].toFloat(); e += Math.sqrt((re * re + im * im).toDouble()).toFloat() }
                    vizMax = maxOf(e, vizMax * 0.995f, 20f)
                    level = (e / vizMax).coerceIn(0f, 1f)
                }
            }, android.media.audiofx.Visualizer.getMaxCaptureRate(), false, true)
            v.enabled = true
            viz = v
        } catch (_: Exception) { viz = null; level = -1f }
    }

    /** Aktuelle Position in ms, auf "jetzt" hochgerechnet (die Seite meldet nur alle 0,5 s). */
    fun positionMs(): Long {
        val now = System.currentTimeMillis()
        val base = if (now - seekAt < 3000) (seekPos * 1000) + (now - seekAt) else (pos * 1000) + (if (playing) (now - stamp).coerceIn(0, 1500) else 0)
        val max = if (dur > 0) (dur * 1000).toLong() else Long.MAX_VALUE
        return base.toLong().coerceIn(0, max)
    }

    /** Wird von der Seite aufgerufen (auch im Hintergrund): meldet Titel/Status und holt Befehle ab. */
    class Js {
        @JavascriptInterface fun update(t: String, a: String, p: Boolean) {
            title = t; artist = a; playing = p; stamp = System.currentTimeMillis()
            vizSync(p)
        }
        @JavascriptInterface fun update2(t: String, a: String, p: Boolean, c: String, cur: Double, d: Double) {
            if (playing != p) MusicBridge.log("Musik " + (if (p) "spielt" else "pausiert") + (if (guard) " (andere Seite offen)" else ""))
            // Livestreams melden eine absurde, staendig wachsende Laenge (Tausende Minuten): als "ohne Laenge" behandeln,
            // sonst wird die Benachrichtigung jede Sekunde neu gebaut und die App haengt.
            val live = d > 21600.0
            title = t; artist = a; playing = p; cover = c; pos = if (live) 0.0 else cur; dur = if (live) 0.0 else d; stamp = System.currentTimeMillis()
            vizSync(p)
            if (userPaused && p && System.currentTimeMillis() - userPausedAt > 4000) userPaused = false
            if (p) { if (!userPaused) want = true; ensureService() } else if (!guard) want = false
        }
        @JavascriptInterface fun shown(): Boolean = !MusicBridge.guard && MusicBridge.fg
        @JavascriptInterface fun level(): Float = MusicBridge.level
        @JavascriptInterface fun heroBack() { backReq.intValue = backReq.intValue + 1 }
        @JavascriptInterface fun playing(): Boolean = MusicBridge.playing
        @JavascriptInterface fun want(): Boolean = MusicBridge.want
        @JavascriptInterface fun resume(): Boolean = MusicBridge.want && MusicBridge.guard && !MusicBridge.userPaused
        @JavascriptInterface fun cmd(): String { val c = cmd; cmd = ""; return c }
    }

    private const val STATE_JS =
        "(function(){try{var t='',a='';" +
            "var b=document.querySelector('div.fixed.bottom-0 button.min-w-0.flex-1');" +
            "if(b){var ps=b.querySelectorAll('p');if(ps[0])t=ps[0].textContent||'';if(ps[1])a=ps[1].textContent||'';}" +
            "if(!t||/^\\s*$/.test(t)){var m=navigator.mediaSession;var md=m&&m.metadata;if(md){t=md.title||'';a=md.artist||'';}}" +
            "var p=window.__cenPlaying===true;" +
            "return JSON.stringify({t:t.trim(),a:a.trim(),p:p});}catch(e){return '';}})()"

    fun click(kind0: String) {
        // Play/Pause immer eindeutig (nie "umschalten"): doppelte Signale (Benachrichtigung + Kopfhoerer) heben sich sonst gegenseitig auf.
        val kind = if (kind0 == "pp") (if (playing) "pause" else "play") else kind0
        val sel = when (kind) {
            "prev" -> "path[d^=\\\"M6 6h2v12H6z\\\"]"
            "next" -> "path[d^=\\\"M16 6h2v12h-2z\\\"]"
            "pause" -> "path[d^=\\\"M6 5h4v14h\\\"]"
            else -> "path[d^=\\\"M8 5v14l11-7z\\\"]"
        }
        val btn = "(function(){try{var ps=document.querySelectorAll(\"$sel\");for(var i=0;i<ps.length;i++){var b=ps[i].closest('button');if(b&&b.offsetParent!==null){b.click();return 'btn';}}}catch(e){}return 'none';})()"
        val w = web ?: return
        log("Befehl: $kind" + (if (kind0 != kind) " (aus $kind0)" else ""))
        if (kind == "pause") { want = false; userPaused = true; userPausedAt = System.currentTimeMillis() }
        if (kind == "play") { userPaused = false }
        val act = when (kind) {
            "pause" -> "if(c.isPlaying)c.togglePlayback();"
            "play" -> "if(!c.isPlaying)c.togglePlayback();"
            "next" -> "c.next();"
            "prev" -> "c.previous();"
            else -> ""
        }
        // Sofort und direkt auf der Haupt-Seite ausfuehren (nicht erst auf deren Abfrage warten, die bei verdeckter Seite hakt).
        val direct = "(function(){try{var c=window.__cenCtx&&window.__cenCtx();if(!c)return 'noctx';$act return 'ok';}catch(e){return 'err';}})()"
        w.post {
            w.evaluateJavascript(direct) { r ->
                if (r == null || !r.contains("ok")) {
                    log("Direkt fehlgeschlagen ($r), klicke Knopf")
                    w.evaluateJavascript(btn, null)
                }
            }
        }
        // Nach 3 s Kontrolle bei Play/Pause: hat es nicht geklappt, den passenden Knopf klicken (Knopf zeigt nur das richtige Symbol, kein Hin und Her).
        if (kind == "pause" || kind == "play") w.postDelayed({
            val stuck = if (kind == "pause") playing else !playing
            if (stuck) { log("Nach 3 s noch nicht erledigt, klicke Knopf"); w.evaluateJavascript(btn, null) }
        }, 3000)
    }

    fun state(cb: (String, String, Boolean) -> Unit) {
        val w = web ?: return
        w.post {
            w.evaluateJavascript(STATE_JS) { raw ->
                try {
                    val s = JSONTokener(raw ?: "").nextValue() as? String ?: ""
                    if (s.isNotEmpty()) {
                        val o = JSONObject(s)
                        cb(o.optString("t"), o.optString("a"), o.optBoolean("p"))
                    }
                } catch (_: Exception) { }
            }
        }
    }
}

/**
 * Haelt die App im Hintergrund am Leben, solange Musik spielt, und zeigt eine Medien-Benachrichtigung
 * mit Zurueck / Pause / Weiter. Beendet sich nach laengerer Stille selbst.
 */
class MusicService : Service() {
    private val handler = Handler(Looper.getMainLooper())
    private var quiet = 0
    private var session: MediaSession? = null
    private var title = "Centaurian"
    private var artist = ""
    private var playing = true
    private var art: Bitmap? = null
    private var artUrl = ""
    private var lastDur = 0.0

    private val tick = object : Runnable {
        override fun run() {
            if (MusicBridge.title.isNotBlank() && System.currentTimeMillis() - MusicBridge.stamp < 6000) {
                val t = MusicBridge.title; val a = MusicBridge.artist; val p = MusicBridge.playing
                val c = MusicBridge.cover
                if (c.isNotBlank() && c != artUrl) {
                    artUrl = c
                    Thread {
                        try {
                            val bm = cropCover(java.net.URL(c).openStream().use { BitmapFactory.decodeStream(it) })
                            handler.post { art = bm; refresh() }
                        } catch (_: Exception) { }
                    }.start()
                }
                if (t != title || a != artist || p != playing || Math.abs(MusicBridge.dur - lastDur) > 1) { title = t; artist = a; playing = p; lastDur = MusicBridge.dur; refresh() } else updateState()
            } else MusicBridge.state { t, a, p ->
                handler.post {
                    val changed = t != title || a != artist || p != playing
                    title = if (t.isNotBlank()) t else title
                    artist = a
                    playing = p
                    if (changed) refresh()
                }
            }
            val am = getSystemService(Context.AUDIO_SERVICE) as AudioManager
            if (playing || am.isMusicActive) quiet = 0 else quiet++
            if (quiet >= 300) {
                stopForeground(STOP_FOREGROUND_REMOVE)
                stopSelf()
                return
            }
            handler.postDelayed(this, 1000)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun action(name: String, icon: Int, label: String): Notification.Action {
        val pi = PendingIntent.getService(
            this, name.hashCode(), Intent(this, MusicService::class.java).setAction(name),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
        )
        return Notification.Action.Builder(Icon.createWithResource(this, icon), label, pi).build()
    }

    private fun build(): Notification {
        val open = PendingIntent.getActivity(
            this, 0, Intent(this, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP).putExtra("np", true),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
        )
        val b = if (Build.VERSION.SDK_INT >= 26) Notification.Builder(this, "music") else @Suppress("DEPRECATION") Notification.Builder(this)
        b.setSmallIcon(android.R.drawable.ic_media_play)
            .setContentTitle(title)
            .setContentText(if (artist.isNotBlank()) artist else "Centaurian")
            .setContentIntent(open)
            .setLargeIcon(art)
            .setOngoing(playing)
            .setVisibility(Notification.VISIBILITY_PUBLIC)
            .addAction(action("prev", android.R.drawable.ic_media_previous, "Zurück"))
            .addAction(action("pp", if (playing) android.R.drawable.ic_media_pause else android.R.drawable.ic_media_play, if (playing) "Pause" else "Play"))
            .addAction(action("next", android.R.drawable.ic_media_next, "Weiter"))
        val st = Notification.MediaStyle().setShowActionsInCompactView(0, 1, 2)
        session?.let { st.setMediaSession(it.sessionToken) }
        b.setStyle(st)
        return b.build()
    }

    /** YouTube-Vorschaubilder (4:3) haben oben/unten schwarze Balken: abschneiden und mittig quadratisch zuschneiden. */
    private fun cropCover(src: Bitmap): Bitmap {
        var y = 0
        var h = src.height
        val ratio = src.width.toFloat() / src.height
        if (ratio in 1.28f..1.38f) { y = (src.height * 0.125f).toInt(); h = (src.height * 0.75f).toInt() }
        val side = minOf(src.width, h)
        val x = (src.width - side) / 2
        val yy = y + (h - side) / 2
        return Bitmap.createBitmap(src, x, yy, side, side)
    }

    private fun updateState() {
        session?.setPlaybackState(
            PlaybackState.Builder()
                .setActions(PlaybackState.ACTION_PLAY or PlaybackState.ACTION_PAUSE or PlaybackState.ACTION_SKIP_TO_NEXT or PlaybackState.ACTION_SKIP_TO_PREVIOUS or PlaybackState.ACTION_SEEK_TO)
                .setState(if (playing) PlaybackState.STATE_PLAYING else PlaybackState.STATE_PAUSED, MusicBridge.positionMs(), 1f)
                .build(),
        )
    }

    private fun refresh() {
        session?.let { s ->
            val md = MediaMetadata.Builder().putString(MediaMetadata.METADATA_KEY_TITLE, title).putString(MediaMetadata.METADATA_KEY_ARTIST, artist)
                .putLong(MediaMetadata.METADATA_KEY_DURATION, (MusicBridge.dur * 1000).toLong())
            art?.let { md.putBitmap(MediaMetadata.METADATA_KEY_ALBUM_ART, it) }
            s.setMetadata(md.build())
        }
        updateState()
        (getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager).notify(7, build())
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            "prev" -> { MusicBridge.click("prev"); return START_NOT_STICKY }
            "next" -> { MusicBridge.click("next"); return START_NOT_STICKY }
            "pp" -> { MusicBridge.click("pp"); return START_NOT_STICKY }
        }
        val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (Build.VERSION.SDK_INT >= 26) {
            nm.createNotificationChannel(NotificationChannel("music", "Musik", NotificationManager.IMPORTANCE_LOW))
        }
        if (session == null) {
            session = MediaSession(this, "Centaurian").apply {
                setCallback(object : MediaSession.Callback() {
                    override fun onPlay() = MusicBridge.click("play")
                    override fun onPause() = MusicBridge.click("pause")
                    override fun onSkipToNext() = MusicBridge.click("next")
                    override fun onSkipToPrevious() = MusicBridge.click("prev")
                    override fun onSeekTo(pos: Long) { MusicBridge.cmd = "seek:" + (pos / 1000.0); MusicBridge.seekPos = pos / 1000.0; MusicBridge.seekAt = System.currentTimeMillis(); updateState() }
                })
                isActive = true
            }
        }
        val n = build()
        try {
            if (Build.VERSION.SDK_INT >= 29) startForeground(7, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK) else startForeground(7, n)
        } catch (_: Exception) {
            stopSelf()
            return START_NOT_STICKY
        }
        MusicBridge.serviceUp = true
        quiet = 0
        refresh()
        handler.removeCallbacks(tick)
        handler.post(tick)
        return START_NOT_STICKY
    }

    override fun onDestroy() {
        MusicBridge.serviceUp = false
        handler.removeCallbacks(tick)
        session?.release()
        session = null
        super.onDestroy()
    }
}
