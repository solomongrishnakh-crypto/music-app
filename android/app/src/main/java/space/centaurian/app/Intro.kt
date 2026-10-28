package space.centaurian.app

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.withFrameNanos
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import kotlin.math.cos
import kotlin.math.max
import kotlin.math.min
import kotlin.math.sin
import kotlin.random.Random

/** Wird pro App-Start nur einmal gezeigt (nicht bei Drehen des Bildschirms). */
object IntroState { var shown = false }

private fun smooth(t: Float): Float { val x = t.coerceIn(0f, 1f); return x * x * (3f - 2f * x) }

private val STAR_COLORS = arrayOf(
    Color(0xFF9BB0FF), Color(0xFFAABFFF), Color(0xFFCAD7FF), Color(0xFFF8F7FF),
    Color(0xFFFFF4EA), Color(0xFFFFE2BE), Color(0xFFFFD2A1), Color(0xFFFFBE82),
)

/**
 * App-Start: Tausende feine Sternteilchen in echten Sternfarben kreisen in die Mitte, formen die flache
 * Scheibe des Logos und gehen weich in das Logo über. Antippen überspringt. Spart-Modus: nur das Logo.
 */
@Composable
fun StartIntro(saver: Boolean, onDone: () -> Unit) {
    val n = if (saver) 0 else 1100
    val rnd = remember { Random(7) }
    val pa = remember { FloatArray(n) { rnd.nextFloat() * 6.2832f } }
    val r0 = remember { FloatArray(n) { 60f + rnd.nextFloat() * 140f } }
    val fin = remember { FloatArray(n) { 15f + Math.pow(rnd.nextDouble(), 0.8).toFloat() * 40f } }
    val pw = remember { FloatArray(n) { 0.6f + rnd.nextFloat() * 1.2f } }
    val pb = remember { FloatArray(n) { 0.15f + 0.85f * Math.pow(rnd.nextDouble(), 3.0).toFloat() } }
    val pt = remember { FloatArray(n) { rnd.nextFloat() * 6.2832f } }
    val pc = remember { IntArray(n) { rnd.nextInt(STAR_COLORS.size) } }
    var tick by remember { mutableLongStateOf(0L) }
    var e by remember { mutableLongStateOf(0L) } // Millisekunden
    LaunchedEffect(Unit) {
        var t0 = 0L
        var last = 0L
        while (true) {
            val now = withFrameNanos { it }
            if (t0 == 0L) { t0 = now; last = now }
            val dt = ((now - last) / 1_000_000_000f).coerceIn(0f, 0.05f)
            last = now
            val sec = (now - t0) / 1_000_000_000f
            val k = min(1f, sec / 2.1f)
            val ease = smooth(k)
            for (i in 0 until n) {
                val r = r0[i] + (fin[i] - r0[i]) * ease
                val sp = (1.2f + ease * 2.6f) * pw[i] * (1f / (0.3f + r / 90f))
                pa[i] += sp * 0.012f * dt * 60f
            }
            e = (sec * 1000f).toLong()
            tick++
            if (sec >= 4.1f) { onDone(); break }
        }
    }
    val sec = e / 1000f
    val out = ((sec - 3.55f) / 0.55f).coerceIn(0f, 1f)
    val logoA = smooth((sec - 1.55f) / 1.3f)
    Box(
        Modifier.fillMaxSize().background(Color(0xFF000000)).graphicsLayer { alpha = 1f - out }
            .pointerInput(Unit) { detectTapGestures { onDone() } },
        contentAlignment = Alignment.Center,
    ) {
        Canvas(Modifier.fillMaxSize()) {
            tick // Neuzeichnen pro Bild
            val d = density
            val cx = size.width / 2f
            val cy = size.height / 2f
            val k = min(1f, sec / 2.1f)
            val ease = smooth(k)
            val gone = smooth((sec - 1.75f) / 0.85f)
            val px0 = min(d, 2f)
            for (i in 0 until n) {
                val r = (r0[i] + (fin[i] - r0[i]) * ease) * d
                val a = pa[i]
                val x = cx + cos(a) * r
                val y = cy + sin(a) * r * (0.16f + 0.84f * (1f - ease))
                val al = (0.25f + 0.75f * ease) * pb[i] * (0.85f + 0.15f * sin(sec * 5f + pt[i])) * (1f - gone) * min(1f, sec * 1.4f)
                if (al < 0.02f) continue
                val sz = (0.5f + pb[i] * 0.9f) * px0 * (if (pb[i] > 0.7f) 1.3f else 1f)
                drawRect(STAR_COLORS[pc[i]].copy(alpha = min(1f, al)), Offset(x - sz / 2f, y - sz / 2f), Size(sz, sz))
            }
            val ga = 0.12f * ease * (1f - gone)
            if (ga > 0.005f) {
                drawCircle(
                    Brush.radialGradient(listOf(Color(0xFFFFE1C8).copy(alpha = ga), Color(0x00FFE1C8)), center = Offset(cx, cy), radius = 55f * d),
                    radius = 55f * d, center = Offset(cx, cy),
                )
            }
        }
        if (logoA > 0f) {
            Image(
                painterResource(R.drawable.intro_logo), contentDescription = null,
                modifier = Modifier.size(112.dp).offset(y = 6.dp).graphicsLayer {
                    alpha = logoA
                    val s = 0.8f + 0.2f * logoA
                    scaleX = s; scaleY = s
                },
            )
        }
    }
}

/**
 * Seitenwechsel: dünne Lichtlinie wächst aus der Mitte, ein Lichtpunkt gleitet immer wieder hindurch.
 * Blendet erst nach kurzer Verzögerung ein, damit schnelle Seiten gar nichts davon zeigen.
 */
@Composable
fun LineLoader(modifier: Modifier = Modifier) {
    var t by remember { mutableLongStateOf(0L) }
    LaunchedEffect(Unit) {
        var t0 = 0L
        while (true) {
            val now = withFrameNanos { it }
            if (t0 == 0L) t0 = now
            t = (now - t0) / 1_000_000L
        }
    }
    val sec = t / 1000f
    val fade = ((sec - 0.12f) / 0.2f).coerceIn(0f, 1f)
    Canvas(modifier) {
        if (fade <= 0f) return@Canvas
        val d = density
        val cx = size.width / 2f
        val cy = size.height / 2f
        val grow = 1f - Math.pow((1f - min(1f, (sec - 0.12f) / 0.35f)).toDouble(), 3.0).toFloat()
        val hw = 46f * d * max(grow, 0f)
        if (hw < 1f) return@Canvas
        val red = Color(0xFFFF5A4D)
        // weicher Schein (flach gedrückt)
        drawContext.canvas.save()
        drawContext.canvas.translate(cx, cy)
        drawContext.canvas.scale(1f, 0.3f)
        drawCircle(
            Brush.radialGradient(listOf(red.copy(alpha = 0.2f * fade), red.copy(alpha = 0f)), center = Offset.Zero, radius = hw),
            radius = hw, center = Offset.Zero,
        )
        drawContext.canvas.restore()
        // Linie
        drawRect(
            Brush.horizontalGradient(
                listOf(red.copy(alpha = 0f), Color(0xFFFF826E).copy(alpha = 0.8f * fade), red.copy(alpha = 0f)),
                startX = cx - hw, endX = cx + hw,
            ),
            topLeft = Offset(cx - hw, cy - 0.7f * d), size = Size(2f * hw, 1.4f * d),
        )
        // gleitender Lichtpunkt
        val cyc = ((sec - 0.2f) % 1.1f) / 0.8f
        if (sec > 0.2f && cyc in 0f..1.05f) {
            val sx = cx - hw + 2f * hw * min(1f, cyc)
            val al = min(1f, cyc * 4f) * (1f - max(0f, cyc - 0.8f) * 5f) * fade
            if (al > 0f) {
                drawCircle(
                    Brush.radialGradient(listOf(Color(0xFFFFF0E6).copy(alpha = 0.95f * al), Color(0x00FF7864)), center = Offset(sx, cy), radius = 9f * d),
                    radius = 9f * d, center = Offset(sx, cy),
                )
            }
        }
    }
}
