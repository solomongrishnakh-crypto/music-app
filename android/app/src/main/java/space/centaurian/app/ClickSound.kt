package space.centaurian.app

import android.content.Context
import android.media.AudioAttributes
import android.media.SoundPool
import androidx.compose.foundation.Indication
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.ui.Modifier
import androidx.compose.foundation.clickable as foundationClickable

/** Kurzer Signalton bei Taps (Einstellung "Klick-Sound"). Im Sternenhimmel stumm (muted). */
object ClickSound {
    @Volatile var enabled = true
    @Volatile var muted = false
    private var pool: SoundPool? = null
    private var id = 0
    private var idBack = 0
    private val ready = java.util.Collections.synchronizedSet(HashSet<Int>())
    private var last = 0L

    fun init(ctx: Context) {
        if (pool != null) return
        try {
            enabled = ctx.getSharedPreferences("cn", Context.MODE_PRIVATE).getBoolean("click", false)
            val attrs = AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_ASSISTANCE_SONIFICATION)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build()
            val p = SoundPool.Builder().setMaxStreams(2).setAudioAttributes(attrs).build()
            p.setOnLoadCompleteListener { _, sampleId, status -> if (status == 0) ready.add(sampleId) }
            id = p.load(ctx.applicationContext, R.raw.click_signal, 1)
            idBack = p.load(ctx.applicationContext, R.raw.click_back, 1)
            pool = p
        } catch (_: Exception) { }
    }

    fun play(back: Boolean = false) {
        val sid = if (back) idBack else id
        if (!enabled || muted || !ready.contains(sid)) return
        val now = System.currentTimeMillis()
        if (now - last < 60) return
        last = now
        try { pool?.play(sid, 0.5f, 0.5f, 1, 0, 1f) } catch (_: Exception) { }
    }
}

/** Wie clickable, spielt aber zusaetzlich den Klick-Sound. */
fun Modifier.clickable(enabled: Boolean = true, back: Boolean = false, onClick: () -> Unit): Modifier =
    this.foundationClickable(enabled = enabled) { ClickSound.play(back); onClick() }

fun Modifier.clickable(interactionSource: MutableInteractionSource?, indication: Indication?, enabled: Boolean = true, onClick: () -> Unit): Modifier =
    this.foundationClickable(interactionSource = interactionSource, indication = indication, enabled = enabled) { ClickSound.play(); onClick() }
