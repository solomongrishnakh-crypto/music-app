package space.centaurian.app

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties

private val UAccent = Color(0xFFFF5A4D)
private val UTextMain = Color(0xFFF0E4E2)
private val UTextMuted = Color(0xFFB49A96)
private val UMono = FontFamily.SansSerif

/** Update-Fenster: schlicht, mit grossem Prozentwert und dünnem Balken. Zustände: bereit, lädt, geladen, Fehler. */
@Composable
fun UpdateDialog(lang: String) {
    val ctx = LocalContext.current
    val upd = Updater.avail ?: return
    if (Updater.dismissed) return
    val de = lang == "de"
    fun s(d: String, e: String) = if (de) d else Tr.t(lang, e)

    val busy = Updater.progress >= 0
    val failed = Updater.msg == "!" && !busy
    val ready = Updater.ready && !busy
    val pct = if (ready) 100 else maxOf(Updater.progress, Updater.pct).coerceIn(0, 100)
    val showBar = busy || ready || failed

    val title = when {
        busy -> s("Update wird geladen", "Downloading update")
        ready -> s("Update bereit", "Update ready")
        failed -> s("Download fehlgeschlagen", "Download failed")
        else -> s("Update verfügbar", "Update available")
    }
    val note = when {
        busy -> s("Du kannst die App währenddessen verlassen.", "You can leave the app meanwhile.")
        ready -> s("Das Update ist geladen und geprüft.", "The update is downloaded and verified.")
        failed -> s("Der Download wird beim nächsten Versuch fortgesetzt.", "The download resumes on the next try.")
        else -> s("Die App lädt das Update und startet die Installation.", "The app downloads the update and starts the installation.")
    }
    val status = when {
        busy -> s("Lädt", "Downloading")
        ready -> s("Fertig", "Done")
        else -> s("Abgebrochen", "Interrupted")
    }
    val primary = when {
        busy -> s("Lädt …", "Loading …")
        ready -> s("INSTALLIEREN", "INSTALL")
        failed -> s("NOCHMAL VERSUCHEN", "TRY AGAIN")
        else -> s("JETZT AKTUALISIEREN", "UPDATE NOW")
    }
    val fill by animateFloatAsState(pct / 100f, label = "upd")
    val shape = RoundedCornerShape(14.dp)

    Dialog(
        onDismissRequest = { if (!busy) Updater.dismissed = true },
        properties = DialogProperties(dismissOnClickOutside = !busy),
    ) {
        Column(
            Modifier.fillMaxWidth().clip(shape).background(Color(0xF2100A0C)).border(1.dp, Color(0x1AFFFFFF), shape).padding(18.dp),
        ) {
            Text(title, color = UTextMain, fontSize = 18.sp, fontWeight = FontWeight.SemiBold)
            Spacer(Modifier.height(6.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(Updater.installedName(ctx), color = UTextMuted, fontFamily = UMono, fontSize = 12.sp)
                Text("  →  ", color = UAccent, fontFamily = UMono, fontSize = 12.sp)
                Text(upd.name, color = UTextMain, fontFamily = UMono, fontSize = 12.sp, fontWeight = FontWeight.Bold)
            }
            Spacer(Modifier.height(14.dp))
            if (showBar) {
                Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.Bottom, horizontalArrangement = Arrangement.SpaceBetween) {
                    Row(verticalAlignment = Alignment.Bottom) {
                        Text("$pct", color = UTextMain, fontFamily = UMono, fontSize = 28.sp, fontWeight = FontWeight.SemiBold)
                        Text("%", color = UTextMuted, fontFamily = UMono, fontSize = 14.sp, modifier = Modifier.padding(start = 2.dp, bottom = 3.dp))
                    }
                    Text(status.uppercase(), color = UTextMuted, fontFamily = UMono, fontSize = 10.sp, letterSpacing = 1.6.sp, modifier = Modifier.padding(bottom = 4.dp))
                }
                Spacer(Modifier.height(8.dp))
                Box(Modifier.fillMaxWidth().height(4.dp).clip(RoundedCornerShape(2.dp)).background(Color(0x12FFFFFF))) {
                    Box(
                        Modifier.fillMaxHeight().fillMaxWidth(fill).background(
                            Brush.horizontalGradient(
                                if (ready) listOf(Color(0xFF1F8F5B), Color(0xFF4BE08F))
                                else listOf(Color(0xFFB3281F), UAccent, Color(0xFFFFC2B8)),
                            ),
                        ),
                    )
                }
                Spacer(Modifier.height(10.dp))
            }
            Text(note, color = if (failed) Color(0xFFFF8F80) else UTextMuted, fontSize = 12.sp, lineHeight = 18.sp)
            Spacer(Modifier.height(14.dp))
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                if (!busy) Btn(s("SPÄTER", "LATER"), 1f, false, true) { Updater.dismissed = true }
                Btn(primary, if (busy) 1f else 1.7f, true, !busy) { Updater.start(ctx) }
            }
        }
    }
}

@Composable
private fun androidx.compose.foundation.layout.RowScope.Btn(text: String, weight: Float, primary: Boolean, enabled: Boolean, onClick: () -> Unit) {
    val shape = RoundedCornerShape(6.dp)
    Box(
        Modifier.weight(weight).height(44.dp).clip(shape)
            .background(if (primary) Color(0x47FF5A4D) else Color.Transparent)
            .border(1.dp, if (primary) Color(0x99FF785C) else Color(0x47FF5A4D), shape)
            .clickable(enabled = enabled) { onClick() },
        contentAlignment = Alignment.Center,
    ) {
        Text(
            text, color = if (primary) Color.White else UTextMuted, fontFamily = UMono, fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold, letterSpacing = 1.2.sp,
            modifier = Modifier.padding(horizontal = 6.dp),
        )
    }
}
