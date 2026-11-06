package space.centaurian.app

import android.content.Context
import android.content.Intent
import android.media.audiofx.Virtualizer
import android.net.Uri
import android.os.Handler
import android.os.HandlerThread
import android.os.SystemClock
import android.provider.Settings
import org.json.JSONObject

/** 8D-Sound: schiebt die Lautsprecher-Balance sanft von links nach rechts (Ton wandert durch die Ohren), dazu Raumklang (Virtualizer). */
object Pan {
    private var thread: HandlerThread? = null
    private var h: Handler? = null
    private var running = false
    private var virt: Virtualizer? = null
    private var ctx: Context? = null

    private fun sp(c: Context) = c.getSharedPreferences("cn", Context.MODE_PRIVATE)
    fun canWrite(c: Context) = Settings.System.canWrite(c)

    private fun setBalance(c: Context, v: Float) {
        try { Settings.System.putFloat(c.contentResolver, "master_balance", v.coerceIn(-1f, 1f)) } catch (_: Throwable) { }
    }

    private val tick = object : Runnable {
        override fun run() {
            val c = ctx ?: return
            if (!running) return
            val sec = 15f - sp(c).getInt("pan_s", 5) * 1.2f // 1 = langsam (~14 s), 10 = schnell (~3 s)
            val v = Math.sin(2 * Math.PI * (SystemClock.elapsedRealtime() % 600000) / (sec * 1000.0)).toFloat() * 0.9f
            setBalance(c, v)
            h?.postDelayed(this, 66)
        }
    }

    @Synchronized private fun stopLoop(c: Context) {
        val was = running
        running = false
        h?.removeCallbacks(tick)
        if (was || sp(c).getBoolean("pan_dirty", false)) {
            setBalance(c, 0f)
            sp(c).edit().putBoolean("pan_dirty", false).commit()
        }
    }

    @Synchronized private fun virtualizer(c: Context, on: Boolean) {
        if (!on) { try { virt?.release() } catch (_: Exception) { }; virt = null; return }
        try {
            if (virt == null) virt = Virtualizer(0, 0)
            val v = virt!!
            val r = sp(c).getInt("pan_r", 6)
            if (v.strengthSupported) v.setStrength((r * 100).coerceIn(0, 1000).toShort())
            v.enabled = r > 0
        } catch (_: Throwable) { virt = null }
    }

    /** Je nach Zustand (8D an + Musik laeuft) Wandern und Raumklang starten oder sauber stoppen. */
    @Synchronized fun sync(c: Context, playing: Boolean) {
        ctx = c.applicationContext
        val on = sp(c).getBoolean("pan_on", false) && canWrite(c)
        virtualizer(c, on)
        if (on && playing) {
            if (running) return
            if (thread == null) { thread = HandlerThread("pan").also { it.start() }; h = Handler(thread!!.looper) }
            sp(c).edit().putBoolean("pan_dirty", true).commit()
            running = true
            h?.post(tick)
        } else stopLoop(c)
    }

    /** Beim App-Start/Beenden: Balance sicher auf Mitte. */
    fun reset(c: Context) { try { ctx = c.applicationContext; stopLoop(c) } catch (_: Throwable) { } }

    fun set(c: Context, on: Boolean, speed: Int, room: Int, playing: Boolean): String {
        val p = sp(c)
        var perm = false
        var want = on
        if (on && !canWrite(c)) {
            perm = true; want = false
            try {
                c.startActivity(Intent(Settings.ACTION_MANAGE_WRITE_SETTINGS, Uri.parse("package:" + c.packageName)).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
            } catch (_: Exception) { }
        }
        p.edit().putBoolean("pan_on", want).putInt("pan_s", speed.coerceIn(1, 10)).putInt("pan_r", room.coerceIn(0, 10)).apply()
        sync(c, playing)
        return state(c, perm)
    }

    fun state(c: Context, perm: Boolean = false): String {
        val p = sp(c)
        return JSONObject().put("on", p.getBoolean("pan_on", false)).put("s", p.getInt("pan_s", 5)).put("r", p.getInt("pan_r", 6)).put("perm", perm).toString()
    }

    fun texts(c: Context): String {
        val lang = sp(c).getString("lang", "de") ?: "de"
        val de = lang == "de"
        fun s(d: String, en: String) = if (de) d else Tr.t(lang, en)
        return JSONObject()
            .put("title", s("8D-Sound", "8D sound"))
            .put("speed", s("Tempo", "Speed"))
            .put("room", s("Raum", "Room"))
            .put("hint", s("Am besten mit Kopfhörern", "Best with headphones"))
            .put("perm", s("Erlaube „Systemeinstellungen ändern“ und schalte 8D danach erneut an", "Allow modify system settings, then switch 8D on again"))
            .toString()
    }
}
