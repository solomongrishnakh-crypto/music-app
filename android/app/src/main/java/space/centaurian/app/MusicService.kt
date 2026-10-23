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
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.webkit.JavascriptInterface
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

    /** Wird von der Seite aufgerufen (auch im Hintergrund): meldet Titel/Status und holt Befehle ab. */
    class Js {
        @JavascriptInterface fun update(t: String, a: String, p: Boolean) {
            title = t; artist = a; playing = p; stamp = System.currentTimeMillis()
        }
        @JavascriptInterface fun cmd(): String { val c = cmd; cmd = ""; return c }
    }

    private const val STATE_JS =
        "(function(){try{var t='',a='';" +
            "var b=document.querySelector('button.min-w-0.flex-1');" +
            "if(b){var ps=b.querySelectorAll('p');if(ps[0])t=ps[0].textContent||'';if(ps[1])a=ps[1].textContent||'';}" +
            "if(!t||/^\\s*$/.test(t)){var m=navigator.mediaSession;var md=m&&m.metadata;if(md){t=md.title||'';a=md.artist||'';}}" +
            "var p=window.__cenPlaying===true;" +
            "return JSON.stringify({t:t.trim(),a:a.trim(),p:p});}catch(e){return '';}})()"

    fun click(kind: String) {
        val sel = when (kind) {
            "prev" -> "path[d^=\\\"M6 6h2v12H6z\\\"]"
            "next" -> "path[d^=\\\"M16 6h2v12h-2z\\\"]"
            else -> "path[d^=\\\"M6 5h4v14h\\\"],path[d^=\\\"M8 5v14l11-7z\\\"]"
        }
        val js = "(function(){try{var ps=document.querySelectorAll(\"$sel\");for(var i=0;i<ps.length;i++){var b=ps[i].closest('button');if(b&&b.offsetParent!==null){b.click();break;}}}catch(e){}})()"
        val w = web ?: return
        cmd = kind
        // Falls die Seite den Befehl nicht innerhalb von 1,5 s abholt: direkt klicken.
        w.postDelayed({ if (cmd == kind) { cmd = ""; w.evaluateJavascript(js, null) } }, 1500)
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

    private val tick = object : Runnable {
        override fun run() {
            if (MusicBridge.title.isNotBlank() && System.currentTimeMillis() - MusicBridge.stamp < 6000) {
                val t = MusicBridge.title; val a = MusicBridge.artist; val p = MusicBridge.playing
                if (t != title || a != artist || p != playing) { title = t; artist = a; playing = p; refresh() }
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
            if (quiet >= 150) {
                stopForeground(STOP_FOREGROUND_REMOVE)
                stopSelf()
                return
            }
            handler.postDelayed(this, 2000)
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
            this, 0, Intent(this, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
        )
        val b = if (Build.VERSION.SDK_INT >= 26) Notification.Builder(this, "music") else @Suppress("DEPRECATION") Notification.Builder(this)
        b.setSmallIcon(android.R.drawable.ic_media_play)
            .setContentTitle(title)
            .setContentText(if (artist.isNotBlank()) artist else "Centaurian")
            .setContentIntent(open)
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

    private fun refresh() {
        session?.let { s ->
            s.setMetadata(MediaMetadata.Builder().putString(MediaMetadata.METADATA_KEY_TITLE, title).putString(MediaMetadata.METADATA_KEY_ARTIST, artist).build())
            s.setPlaybackState(
                PlaybackState.Builder()
                    .setActions(PlaybackState.ACTION_PLAY or PlaybackState.ACTION_PAUSE or PlaybackState.ACTION_SKIP_TO_NEXT or PlaybackState.ACTION_SKIP_TO_PREVIOUS)
                    .setState(if (playing) PlaybackState.STATE_PLAYING else PlaybackState.STATE_PAUSED, PlaybackState.PLAYBACK_POSITION_UNKNOWN, 1f)
                    .build(),
            )
        }
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
                    override fun onPlay() = MusicBridge.click("pp")
                    override fun onPause() = MusicBridge.click("pp")
                    override fun onSkipToNext() = MusicBridge.click("next")
                    override fun onSkipToPrevious() = MusicBridge.click("prev")
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
        quiet = 0
        refresh()
        handler.removeCallbacks(tick)
        handler.post(tick)
        return START_NOT_STICKY
    }

    override fun onDestroy() {
        handler.removeCallbacks(tick)
        session?.release()
        session = null
        super.onDestroy()
    }
}
