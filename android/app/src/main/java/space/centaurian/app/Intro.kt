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
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.withTransform
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
 * App-Start: ein kleines rotes Raumschiff fliegt von unten durch die Mitte nach oben aus dem Bild: erst ruhig,
 * in der Bildmitte am langsamsten, dann beschleunigt es. Fahrtwind-Linien laufen kompakt um das Schiff.
 * Laeuft bewusst ueber withFrameNanos (nicht ueber Animator-Dauer), damit es auch im Akkusparmodus
 * oder bei ausgeschalteten System-Animationen gleich abspielt. Antippen ueberspringt.
 */
@Composable
fun StartIntro(saver: Boolean, onDone: () -> Unit) {
    val dur = 2.8f
    val rnd = remember { Random(11) }
    val sx = remember { FloatArray(16) { (rnd.nextFloat() - 0.5f) * 2f } }
    val sy = remember { FloatArray(16) { rnd.nextFloat() } }
    val sp = remember { FloatArray(16) { 0.7f + rnd.nextFloat() * 0.9f } }
    val sl = remember { FloatArray(16) { rnd.nextFloat() } }
    // Tempo je Wegstrecke q (0..1): sanfter Start, langsamster Punkt in der Mitte, dann schnell
    val tab = remember {
        val n = 600
        val t = FloatArray(n + 1)
        for (i in 1..n) t[i] = t[i - 1] + 1f / n / introSpeed(i.toFloat() / n)
        t
    }
    var tick by remember { mutableLongStateOf(0L) }
    var e by remember { mutableLongStateOf(0L) }
    LaunchedEffect(Unit) {
        var t0 = 0L
        while (true) {
            val now = withFrameNanos { it }
            if (t0 == 0L) t0 = now
            val sec = (now - t0) / 1_000_000_000f
            e = (sec * 1000f).toLong()
            tick++
            if (sec >= dur + 0.35f) { onDone(); break }
        }
    }
    val sec = e / 1000f
    val out = ((sec - dur) / 0.3f).coerceIn(0f, 1f)
    val red = Color(0xFFFF4637)
    Box(
        Modifier.fillMaxSize().background(Color(0xFF000000)).graphicsLayer { alpha = 1f - out }
            .pointerInput(Unit) { detectTapGestures { onDone() } },
    ) {
        Canvas(Modifier.fillMaxSize()) {
            tick // Neuzeichnen pro Bild
            val u = size.width / 540f
            val cx = size.width / 2f
            val ph = size.height
            // Position q aus der Zeit
            val total = tab[tab.size - 1]
            val target = (min(sec, dur) / dur) * total
            var lo = 0
            var hi = tab.size - 1
            while (hi - lo > 1) { val m = (lo + hi) ushr 1; if (tab[m] <= target) lo = m else hi = m }
            val q = min(1f, (lo + (target - tab[lo]) / (tab[lo + 1] - tab[lo])) / (tab.size - 1))
            val v = introSpeed(q)
            val env = min(1f, v / 2.3f)
            // Fahrtwind
            val span = ph + 200f * u
            for (i in 0 until 16) {
                val yy = ((sy[i] * span + q * 1300f * sp[i] * u) % span) - 100f * u
                val ev = sin(Math.PI.toFloat() * (yy + 100f * u) / span)
                if (ev <= 0f) continue
                val xx = cx + sx[i] * 85f * u
                val len = (12f + env * (30f + sl[i] * 30f)) * u
                val al = ev * (0.5f + 0.5f * env) * (1f - kotlin.math.abs(sx[i]) * 0.5f)
                drawLine(
                    Brush.verticalGradient(listOf(red.copy(alpha = 0f), red.copy(alpha = al.coerceIn(0f, 1f))), startY = yy - len, endY = yy),
                    Offset(xx, yy - len), Offset(xx, yy), strokeWidth = 1.3f * u, cap = StrokeCap.Round,
                )
            }
            // Schiff
            val y = (ph + 120f * u) - (ph + 260f * u) * q
            withTransform({ translate(cx, y); scale(1.15f * u, 1.15f * u, Offset.Zero) }) {
                val k = env
                val tl = 40f + 70f * k
                val trail = Path().apply { moveTo(-5f, 12f); lineTo(5f, 12f); lineTo(1.2f, 12f + tl); lineTo(-1.2f, 12f + tl); close() }
                drawPath(trail, Brush.verticalGradient(listOf(red.copy(alpha = 0.75f), red.copy(alpha = 0f)), startY = 10f, endY = 10f + tl))
                drawCircle(
                    Brush.radialGradient(listOf(red.copy(alpha = 0.45f), red.copy(alpha = 0f)), center = Offset(0f, 8f), radius = 46f),
                    radius = 46f, center = Offset(0f, 8f),
                )
                val hull = Path().apply {
                    moveTo(0f, -34f); lineTo(8f, -6f); lineTo(22f, 16f); lineTo(8f, 10f); lineTo(5f, 16f)
                    lineTo(-5f, 16f); lineTo(-8f, 10f); lineTo(-22f, 16f); lineTo(-8f, -6f); close()
                }
                drawPath(hull, red.copy(alpha = 0.14f))
                drawPath(hull, red, style = Stroke(width = 1.8f, join = StrokeJoin.Round))
                drawLine(Color(0xFFFFAA9B).copy(alpha = 0.9f), Offset(0f, -22f), Offset(0f, -6f), strokeWidth = 1.4f)
                val fl = 16f + 8f + 6f * k + 1.5f * sin(sec * 60f)
                val flame = Path().apply { moveTo(-3f, 16f); lineTo(3f, 16f); lineTo(0f, fl); close() }
                drawPath(flame, Color(0xFFFFC8B4).copy(alpha = 0.95f))
            }
        }
    }
}

private fun introSpeed(q: Float): Float =
    if (q < 0.45f) 0.8f - 0.45f * smooth(q / 0.45f) else 0.35f + 2.0f * smooth((q - 0.45f) / 0.55f)

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
