package space.centaurian.app

import android.content.Context
import android.media.audiofx.AudioEffect
import android.media.audiofx.BassBoost
import android.media.audiofx.Equalizer
import android.media.audiofx.LoudnessEnhancer
import android.os.Handler
import android.os.Looper
import android.os.SystemClock
import org.json.JSONObject
import java.util.concurrent.Executors
import java.util.concurrent.atomic.AtomicBoolean

/** Klang-Einstellungen fuer die Musik: Equalizer (Bass/Mitten/Hoehen), Bass-Boost und Lautstaerke-Verstaerker auf dem globalen Audio-Ausgang. */
object Eq {
    private var eq: Equalizer? = null
    private var bb: BassBoost? = null
    private var le: LoudnessEnhancer? = null
    @Volatile var supported = true
    private var fails = 0
    private var lastCheck = 0L
    /** Zaehlt jede Aenderung der Regler; so merkt ensure(), dass neue Werte noch nicht angewendet wurden. */
    private var ver = 0
    private var appliedVer = -1
    private var releasePending = false
    private val main = Handler(Looper.getMainLooper())
    private val worker = Executors.newSingleThreadExecutor()
    private val queued = AtomicBoolean(false)
    private val rel = Runnable { fireRelease() }

    private fun sp(c: Context) = c.getSharedPreferences("cn", Context.MODE_PRIVATE)

    @Synchronized private fun bump() { ver++ }

    /** Alle Effekte sofort freigeben (z. B. App wird geschlossen). */
    @Synchronized fun release() {
        if (releasePending) { main.removeCallbacks(rel); releasePending = false }
        try { eq?.release() } catch (_: Exception) { }
        try { bb?.release() } catch (_: Exception) { }
        try { le?.release() } catch (_: Exception) { }
        eq = null; bb = null; le = null
    }

    @Synchronized private fun fireRelease() {
        releasePending = false
        release()
        // Beim naechsten Musikstart frisch und ohne Wartezeit versuchen.
        lastCheck = 0L; fails = 0; supported = true
    }

    /** Nach einer Pause erst nach 4 s freigeben: kurze Aussetzer (Songwechsel, Laden) duerfen den Klang nicht zuruecksetzen. */
    @Synchronized fun releaseSoon() {
        if (releasePending) return
        releasePending = true
        main.postDelayed(rel, 4000)
    }

    @Synchronized private fun cancelRelease() {
        if (releasePending) { main.removeCallbacks(rel); releasePending = false }
    }

    private fun disableAll() {
        try { eq?.enabled = false } catch (_: Throwable) { }
        try { bb?.enabled = false } catch (_: Throwable) { }
        try { le?.enabled = false } catch (_: Throwable) { }
    }

    private fun drop(e: AudioEffect?) { try { e?.release() } catch (_: Throwable) { } }

    /** Wendet die gespeicherten Werte an. Alles auf 0 = Effekte aus. Jeder Effekt einzeln: faellt einer aus, laufen die anderen weiter. */
    @Synchronized fun apply(c: Context) {
        appliedVer = ver
        val p = sp(c)
        val b = p.getInt("eq_b", 0); val m = p.getInt("eq_m", 0); val t = p.getInt("eq_t", 0); val l = p.getBoolean("eq_l", false)
        if (b == 0 && m == 0 && t == 0 && !l) { disableAll(); return }
        try {
            if (eq == null) eq = Equalizer(0, 0)
            val e = eq!!
            val r = e.bandLevelRange
            for (i in 0 until e.numberOfBands) {
                val hz = e.getCenterFreq(i.toShort()) / 1000
                val g = if (hz < 250) b else if (hz <= 3500) m else t
                e.setBandLevel(i.toShort(), (g * 100).coerceIn(r[0].toInt(), r[1].toInt()).toShort())
            }
            e.enabled = true
        } catch (_: Throwable) { drop(eq); eq = null }
        try {
            if (bb == null) bb = BassBoost(0, 0)
            val x = bb!!
            if (x.strengthSupported) { x.setStrength((b.coerceAtLeast(0) * 100).coerceIn(0, 1000).toShort()); x.enabled = b > 0 }
        } catch (_: Throwable) { drop(bb); bb = null }
        try {
            if (le == null) le = LoudnessEnhancer(0)
            le!!.setTargetGain(if (l) 600 else 0); le!!.enabled = l
        } catch (_: Throwable) { drop(le); le = null }
        if (eq != null || bb != null || le != null) { supported = true; fails = 0 }
        else { fails++; if (fails >= 3) supported = false }
    }

    private fun healthy(): Boolean {
        if (eq == null && bb == null && le == null) return false
        return try {
            (eq?.let { it.enabled && it.hasControl() } ?: true) && (bb?.hasControl() ?: true) && (le?.hasControl() ?: true)
        } catch (_: Throwable) { false }
    }

    /**
     * Wird waehrend der Wiedergabe etwa alle 0,5 s aufgerufen: neue Reglerwerte anwenden und alle 2 s pruefen, ob die Effekte noch
     * wirken (das System oder eine andere App kann sie entziehen). Ist ein Handy zeitweise nicht bereit, wird spaeter neu versucht.
     */
    @Synchronized fun ensure(c: Context) {
        cancelRelease()
        if (ver != appliedVer) { apply(c); return }
        val p = sp(c)
        if (p.getInt("eq_b", 0) == 0 && p.getInt("eq_m", 0) == 0 && p.getInt("eq_t", 0) == 0 && !p.getBoolean("eq_l", false)) return
        val now = SystemClock.elapsedRealtime()
        if (now - lastCheck < (if (supported) 2000L else 15000L)) return
        lastCheck = now
        if (!healthy()) { release(); apply(c) }
    }

    /** Regler wurden bewegt: speichern, dann im Hintergrund anwenden (die Seite wartet nicht auf die Audio-Anfragen). */
    fun set(c: Context, b: Int, m: Int, t: Int, l: Boolean) {
        sp(c).edit().putInt("eq_b", b.coerceIn(-10, 10)).putInt("eq_m", m.coerceIn(-10, 10)).putInt("eq_t", t.coerceIn(-10, 10)).putBoolean("eq_l", l).apply()
        bump()
        // Nur anwenden, solange die App-Musik spielt: die Effekte liegen auf dem globalen
        // Ausgang und wuerden sonst auch Spotify & Co. veraendern/daempfen. Sonst holt ensure() es beim Start nach.
        if (!MusicBridge.playing) return
        if (queued.compareAndSet(false, true)) {
            worker.execute {
                queued.set(false)
                try { apply(c) } catch (_: Throwable) { }
            }
        }
    }

    fun state(c: Context): String {
        val p = sp(c)
        return JSONObject().put("ok", supported).put("b", p.getInt("eq_b", 0)).put("m", p.getInt("eq_m", 0)).put("t", p.getInt("eq_t", 0)).put("l", p.getBoolean("eq_l", false)).toString()
    }

    fun texts(c: Context): String {
        val lang = sp(c).getString("lang", "de") ?: "de"
        val de = lang == "de"
        fun s(d: String, en: String) = if (de) d else Tr.t(lang, en)
        return JSONObject()
            .put("title", s("Equalizer", "Equalizer"))
            .put("bass", s("Bass", "Bass"))
            .put("mid", s("Mitten", "Mids"))
            .put("treble", s("Höhen", "Treble"))
            .put("loud", s("Mehr Lautstärke", "Volume boost"))
            .put("normal", s("Normal", "Normal"))
            .put("vocal", s("Gesang", "Vocal"))
            .put("nosup", s("Dieses Handy erlaubt keine Audio-Effekte", "This phone does not allow audio effects"))
            .toString()
    }
}
