package space.centaurian.app

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.media.AudioManager
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper

/**
 * Haelt die App im Hintergrund am Leben, solange Musik spielt (Vordergrund-Dienst mit Benachrichtigung),
 * damit Android den Ton nicht abdreht, wenn man zu einer anderen App wechselt.
 * Beendet sich selbst, sobald keine Musik mehr laeuft.
 */
class MusicService : Service() {
    private val handler = Handler(Looper.getMainLooper())
    private var quiet = 0

    private val check = object : Runnable {
        override fun run() {
            val am = getSystemService(Context.AUDIO_SERVICE) as AudioManager
            if (am.isMusicActive) quiet = 0 else quiet++
            if (quiet >= 4) {
                stopForeground(STOP_FOREGROUND_REMOVE)
                stopSelf()
                return
            }
            handler.postDelayed(this, 5000)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (Build.VERSION.SDK_INT >= 26) {
            nm.createNotificationChannel(NotificationChannel("music", "Musik", NotificationManager.IMPORTANCE_LOW))
        }
        val open = PendingIntent.getActivity(
            this, 0, Intent(this, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
        )
        val n = (if (Build.VERSION.SDK_INT >= 26) Notification.Builder(this, "music") else @Suppress("DEPRECATION") Notification.Builder(this))
            .setSmallIcon(android.R.drawable.ic_media_play)
            .setContentTitle("Centaurian")
            .setContentText("Musik läuft im Hintergrund")
            .setContentIntent(open)
            .setOngoing(true)
            .build()
        try {
            if (Build.VERSION.SDK_INT >= 29) startForeground(7, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK) else startForeground(7, n)
        } catch (_: Exception) {
            stopSelf()
            return START_NOT_STICKY
        }
        quiet = 0
        handler.removeCallbacks(check)
        handler.postDelayed(check, 5000)
        return START_NOT_STICKY
    }

    override fun onDestroy() {
        handler.removeCallbacks(check)
        super.onDestroy()
    }
}
