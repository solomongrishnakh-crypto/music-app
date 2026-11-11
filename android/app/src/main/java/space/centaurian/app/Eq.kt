package space.centaurian.app

import android.content.Context
import android.media.audiofx.BassBoost
import android.media.audiofx.Equalizer
import android.media.audiofx.LoudnessEnhancer
import org.json.JSONObject

/** Klang-Einstellungen fuer die Musik: Equalizer (Bass/Mitten/Hoehen), Bass-Boost und Lautstaerke-Verstaerker auf dem globalen Audio-Ausgang. */
object Eq {
    private var eq: Equalizer? = null
    private var bb: BassBoost? = null
    private var le: LoudnessEnhancer? = null
    @Volatile var supported = true

    private fun sp(c: Context) = c.getSharedPreferences("cn", Context.MODE_PRIVATE)

    @Synchronized fun release() {
        try { eq?.release() } catch (_: Exception) { }
        try { bb?.release() } catch (_: Exception) { }
        try { le?.release() } catch (_: Exception) { }
        eq = null; bb = null; le = null
    }

    /** Wendet die gespeicherten Werte an. Alles auf 0 = Effekte ganz aus. */
    @Synchronized fun apply(c: Context) {
        val p = sp(c)
        val b = p.getInt("eq_b", 0); val m = p.getInt("eq_m", 0); val t = p.getInt("eq_t", 0); val l = p.getBoolean("eq_l", false)
        if (b == 0 && m == 0 && t == 0 && !l) { release(); return }
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
            if (bb == null) bb = BassBoost(0, 0)
            val x = bb!!
            if (x.strengthSupported) { x.setStrength((b.coerceAtLeast(0) * 100).coerceIn(0, 1000).toShort()); x.enabled = b > 0 }
            if (le == null) le = LoudnessEnhancer(0)
            le!!.setTargetGain(if (l) 600 else 0); le!!.enabled = l
            supported = true
        } catch (_: Throwable) {
            supported = false
            release()
        }
    }

    /** Bei jedem Musikstart: Effekte wieder anlegen, falls das System sie in der Zwischenzeit entfernt hat. */
    @Synchronized fun ensure(c: Context) { if (eq == null && supported) apply(c) }

    fun set(c: Context, b: Int, m: Int, t: Int, l: Boolean) {
        sp(c).edit().putInt("eq_b", b.coerceIn(-10, 10)).putInt("eq_m", m.coerceIn(-10, 10)).putInt("eq_t", t.coerceIn(-10, 10)).putBoolean("eq_l", l).apply()
        // Nur anwenden, solange die App-Musik spielt: die Effekte liegen auf dem globalen
        // Ausgang und wuerden sonst auch Spotify & Co. veraendern/daempfen.
        if (MusicBridge.playing) apply(c) else release()
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
