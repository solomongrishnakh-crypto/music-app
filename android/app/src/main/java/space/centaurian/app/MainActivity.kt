package space.centaurian.app

import android.Manifest
import android.os.Build
import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.ViewGroup
import android.view.WindowManager
import android.webkit.CookieManager
import android.webkit.GeolocationPermissions
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebStorage
import android.webkit.WebView
import android.webkit.WebResourceResponse
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.gestures.detectHorizontalDragGestures
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.material.icons.filled.Search
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalDrawerSheet
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.Text
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.animation.core.animateFloat
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.withStyle
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import kotlinx.coroutines.launch
import java.util.Locale

// ---------------------------------------------------------------- Farben
private val BgDark = Color(0xFF060203)
private val Surface1 = Color(0xFF140A0A)
private val Accent = Color(0xFFFF5A4D)
private val TextMain = Color(0xFFF0E4E2)
private val TextMuted = Color(0xFFB49A96)
private val LineSoft = Color(0x33FF5A4D)

private val Corner = Color(0x99FF5A4D)
private val Mono = FontFamily.SansSerif

/** Rote Eck-Klammern wie bei den HUD-Karten der Webseite (7 x 1 px). */
private fun Modifier.hudCorners(len: Float = 7f): Modifier = this.drawBehind {
    val d = density
    val l0 = len * d
    val st = 1f * d
    val w = size.width
    val h = size.height
    fun l(a: Offset, b: Offset) = drawLine(Corner, a, b, strokeWidth = st)
    l(Offset(0f, st / 2), Offset(l0, st / 2)); l(Offset(st / 2, 0f), Offset(st / 2, l0))
    l(Offset(w, st / 2), Offset(w - l0, st / 2)); l(Offset(w - st / 2, 0f), Offset(w - st / 2, l0))
    l(Offset(0f, h - st / 2), Offset(l0, h - st / 2)); l(Offset(st / 2, h), Offset(st / 2, h - l0))
    l(Offset(w, h - st / 2), Offset(w - l0, h - st / 2)); l(Offset(w - st / 2, h), Offset(w - st / 2, h - l0))
}

/** Milchglas-Box wie .hud-card der Webseite: Glanz oben links, roter Unterglanz, helle Kante, rote Ecken. */
private fun Modifier.glassBox(): Modifier = this
    .drawBehind {
        drawRect(Color(0x6108070C))
    }
    .drawBehind {
        drawRect(
            androidx.compose.ui.graphics.Brush.linearGradient(
                0f to Color(0x1AFFFFFF), 0.38f to Color(0x05FFFFFF), 0.6f to Color(0x00FFFFFF),
                start = Offset(0f, 0f), end = Offset(size.width, size.height),
            ),
        )
        drawRect(
            androidx.compose.ui.graphics.Brush.radialGradient(
                listOf(Color(0x1AFF5A4D), Color(0x00FF5A4D)),
                center = Offset(size.width / 2f, size.height * 1.2f), radius = size.width * 0.6f,
            ),
        )
        drawLine(Color(0x29FFFFFF), Offset(0f, 0.5f), Offset(size.width, 0.5f), strokeWidth = 1f)
        drawLine(Color(0x2EFF5A4D), Offset(0f, size.height - 0.5f), Offset(size.width, size.height - 0.5f), strokeWidth = 1f)
    }
    .border(BorderStroke(1.dp, Color(0x1CFFFFFF)))
    .hudCorners()

/** Animierte Partikel mit Verbindungslinien wie der Hintergrund der Webseite. */
private class Particle(val x0: Float, val y0: Float, val vx: Float, val vy: Float, val r: Float, val a: Float)

@Composable
private fun ParticleBackground(modifier: Modifier = Modifier) {
    val parts = remember {
        val r = java.util.Random(11)
        List(48) {
            Particle(r.nextFloat(), r.nextFloat(), (r.nextFloat() - 0.5f) * 0.012f, (r.nextFloat() - 0.5f) * 0.012f, 0.8f + r.nextFloat() * 1.6f, 0.2f + r.nextFloat() * 0.6f)
        }
    }
    var t by remember { mutableStateOf(0f) }
    LaunchedEffect(Unit) {
        var last = 0L
        while (true) {
            androidx.compose.runtime.withFrameNanos { n ->
                if (last != 0L) t += (n - last) / 1_000_000_000f
                last = n
            }
        }
    }
    Canvas(modifier) {
        val w = size.width
        val h = size.height
        val pts = parts.map {
            val x = (((it.x0 + it.vx * t) % 1f) + 1f) % 1f * w
            val y = (((it.y0 + it.vy * t) % 1f) + 1f) % 1f * h
            Offset(x, y)
        }
        val maxD = 150.dp.toPx()
        for (i in pts.indices) {
            for (j in i + 1 until pts.size) {
                val dx = pts[i].x - pts[j].x
                val dy = pts[i].y - pts[j].y
                val d = kotlin.math.sqrt(dx * dx + dy * dy)
                if (d < maxD) {
                    drawLine(Accent.copy(alpha = 0.22f * (1f - d / maxD)), pts[i], pts[j], strokeWidth = 1f)
                }
            }
        }
        for (i in pts.indices) {
            drawCircle(Color.White.copy(alpha = parts[i].a), radius = parts[i].r.dp.toPx() * 0.7f, center = pts[i])
        }
    }
}

@Composable
private fun SearchBar(query: String, hint: String, onChange: (String) -> Unit, modifier: Modifier = Modifier, onSearch: ((String) -> Unit)? = null) {
    Row(
        modifier
            .fillMaxWidth()
            .glassBox()
            .padding(horizontal = 12.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(Icons.Default.Search, contentDescription = null, tint = Accent, modifier = Modifier.size(18.dp))
        Spacer(Modifier.size(10.dp))
        Box(Modifier.weight(1f)) {
            if (query.isEmpty()) Text(hint.uppercase(), color = TextMuted.copy(alpha = 0.7f), fontSize = 11.sp, fontFamily = Mono, letterSpacing = 2.sp)
            BasicTextField(
                value = query,
                onValueChange = onChange,
                singleLine = true,
                textStyle = androidx.compose.ui.text.TextStyle(color = TextMain, fontSize = 13.sp, fontFamily = Mono),
                cursorBrush = SolidColor(Accent),
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
                keyboardActions = KeyboardActions(onSearch = { if (query.isNotBlank()) onSearch?.invoke(query.trim()) }),
                modifier = Modifier.fillMaxWidth(),
            )
        }
        if (query.isNotEmpty()) {
            Text("✕", color = TextMuted, fontSize = 14.sp, modifier = Modifier.clickable { onChange("") }.padding(start = 8.dp))
        }
    }
}

private fun matches(s: Section, q: String): Boolean {
    val k = q.trim().lowercase()
    return k.isEmpty() || s.de.lowercase().contains(k) || s.en.lowercase().contains(k) ||
        s.descDe.lowercase().contains(k) || s.descEn.lowercase().contains(k)
}

private const val BASE = "https://centaurianspace.com"

// ---------------------------------------------------------------- Daten
private data class Section(
    val path: String,
    val de: String,
    val en: String,
    val descDe: String = "",
    val descEn: String = "",
)

private val SKY = listOf(
    Section("/sternenhimmel", "Sternenhimmel", "Live sky", "Halte dein Handy in den Himmel", "Hold your phone up to the sky"),
    Section("/sonnensystem", "Sonnensystem", "Solar system", "Live mit echten Positionen", "Live with real positions"),
    Section("/sternbilder", "Sternbilder", "Constellations", "Alle 88 Sternbilder", "All 88 constellations"),
    Section("/himmel-heute", "Himmel heute", "Sky today"),
)
private val HISTORY = listOf(
    Section("/imperien", "Weltgeschichte", "World history", "Imperien von 3400 v. Chr. bis heute", "Empires from 3400 BC to today"),
)
private val NEWS = listOf(
    Section("/universum#space-news", "Weltraum-News", "Space news", "Aktuelle News aus Raumfahrt und Astronomie", "Latest space and astronomy news"),
)
private val TOOLS = listOf(
    Section("/groessenvergleich", "Größenvergleich", "Size comparison", "Vom Neutronenstern bis zum Universum", "From neutron stars to the universe"),
    Section("/weltraum-rechner", "Rechner", "Calculator", "Gewicht, Alter und Entfernungen im All", "Weight, age and distances in space"),
    Section("/reisezeit/saturn/auto", "Reisezeit", "Travel time", "Wie lange dauert die Reise zu einem Planeten?", "How long does a trip to a planet take?"),
    Section("/geburtstag", "Geburtstag", "Birthday", "Dein Geburtstag im Universum", "Your birthday in the universe"),
    Section("/universum#maschine", "Maschine der Ewigkeit", "Machine of eternity", "Zahnräder, die seit dem Urknall laufen", "Gears running since the big bang"),
)
private val UNI = listOf(
    Section("/universum", "Universum", "Universe", "Fakten und Zahlen aus dem All", "Facts and numbers from space"),
) + SKY + TOOLS
private val EXPLORE = UNI + HISTORY + NEWS

private val SLUGS = listOf(
    "/imperien/reiche" to "/empires/list",
    "/imperien/werkzeuge" to "/empires/tools",
    "/imperien/reich" to "/empires/empire",
    "/imperien" to "/empires",
    "/sonnensystem" to "/solar-system",
    "/sternbilder" to "/constellations",
    "/objekte" to "/objects",
    "/datenschutz" to "/privacy",
    "/sternenhimmel" to "/night-sky",
    "/universum" to "/universe",
    "/geburtstag" to "/birthday",
    "/groessenvergleich" to "/size-comparison",
    "/himmel-heute" to "/sky-today",
    "/weltraum-rechner" to "/space-calculator",
    "/maschine-der-ewigkeit" to "/eternity-machine",
    "/reisezeit" to "/travel-time",
)

private val BARE = listOf("/sternenhimmel", "/sternbilder", "/himmel-heute")
private val BARE_ALL = BARE + listOf("/night-sky", "/constellations", "/sky-today")

private fun isBarePath(p: String): Boolean =
    BARE_ALL.any { p == it || p.endsWith(it) || p.startsWith("$it/") || p.contains("$it/") }

private val START_OPTS = listOf(
    "home" to ("Startseite" to "Home"),
    "/sternenhimmel" to ("Sternenhimmel" to "Live sky"),
    "/universum" to ("Universum" to "Universe"),
    "/sonnensystem" to ("Sonnensystem" to "Solar system"),
    "/imperien" to ("Weltgeschichte" to "World history"),
)

private fun startScreenFor(ctx: Context, de: Boolean): Screen {
    val st = ctx.getSharedPreferences("cn", Context.MODE_PRIVATE).getString("start", "home") ?: "home"
    val o = START_OPTS.firstOrNull { it.first == st && it.first != "home" } ?: return Screen.Home
    return Screen.Web(o.first, if (de) o.second.first else o.second.second)
}

private data class Lng(val code: String, val flag: String, val name: String)

private val LANGS = listOf(
    Lng("de", "🇩🇪", "Deutsch"), Lng("en", "🇬🇧", "English"), Lng("es", "🇪🇸", "Español"),
    Lng("fr", "🇫🇷", "Français"), Lng("pt", "🇵🇹", "Português"), Lng("tr", "🇹🇷", "Türkçe"),
    Lng("ru", "🇷🇺", "Русский"), Lng("el", "🇬🇷", "Ελληνικά"), Lng("ar", "🇸🇦", "العربية"),
    Lng("hi", "🇮🇳", "हिन्दी"), Lng("zh", "🇨🇳", "中文"), Lng("ja", "🇯🇵", "日本語"),
    Lng("ko", "🇰🇷", "한국어"), Lng("id", "🇮🇩", "Bahasa Indonesia"), Lng("fa", "🇮🇷", "فارسی"),
)

private val SOURCES = listOf(
    "Cliopatria (Seshat Global History Databank)" to "CC BY 4.0",
    "Historical Basemaps (A. Ourednik)" to "GPL-3.0",
    "Esri World Imagery" to "Map tiles",
    "NASA JPL Horizons" to "Positions",
    "NASA Exoplanet Archive" to "Exoplanets",
    "Wikipedia & Wikimedia Commons" to "CC BY-SA",
)

private fun offlinePages(lang: String): List<String> {
    val base = listOf("/sternenhimmel", "/universum", "/sonnensystem", "/groessenvergleich", "/reisezeit")
    val out = LinkedHashSet<String>()
    base.forEach { out.add(siteUrl(it, "de").substringBefore("?")) }
    if (lang != "de") base.forEach { out.add(siteUrl(it, lang).substringBefore("?")) }
    return out.toList()
}

private sealed interface Screen {
    data object Home : Screen
    data class Web(val path: String, val title: String, val afterJs: String? = null) : Screen
    data object Settings : Screen
    data object Tools : Screen
    data class Info(val title: String, val body: String, val backTo: Screen = Settings) : Screen
}

// ---------------------------------------------------------------- Hilfen
private fun siteUrl(path: String, lang: String): String {
    val hash = if (path.contains("#")) "#" + path.substringAfter("#") else ""
    var p = path.substringBefore("#")
    if (lang != "de") {
        for ((de, intl) in SLUGS) {
            if (p == de || p.startsWith("$de/")) {
                p = intl + p.substring(de.length)
                break
            }
        }
        p = if (p == "/") "/$lang" else "/$lang$p"
    }
    return BASE + p + (if (p.contains("?")) "&" else "?") + "app=1" + hash
}

private fun initialLang(ctx: Context): String {
    val saved = ctx.getSharedPreferences("cn", Context.MODE_PRIVATE).getString("lang", null)
    if (saved != null && LANGS.any { it.code == saved }) return saved
    val sys = Locale.getDefault().language
    return if (LANGS.any { it.code == sys }) sys else "en"
}

/** JS-Schnipsel: kleines schwebendes Feedback-Symbol der Webseite ausblenden. */
private const val HIDE_FB_JS =
    "var bt=document.querySelectorAll('button');for(var q=0;q<bt.length;q++){var cn=bt[q].className;" +
        "if(typeof cn==='string'&&cn.indexOf('z-[3100]')>=0&&cn.indexOf('fixed')>=0&&cn.indexOf('rounded-full')>=0)" +
        "bt[q].style.setProperty('display','none','important');}"

private fun nativeJs(hideNews: Boolean, anim: Boolean): String =
    "(function(){var css='html{background-color:#060203!important}body{background-color:transparent!important}.app-fab,.app-drawer,.app-scrim,#langBox,#langStrip,#fbLink,#newsLink{display:none!important}" +
        "button[aria-haspopup=listbox]{display:none!important}';" +
        "css+='#menuSheet{width:min(430px,calc(100% - 24px))!important;padding:10px!important;background:rgba(8,10,22,0.8)!important;backdrop-filter:blur(18px)!important;-webkit-backdrop-filter:blur(18px)!important}#menuSheet .row{gap:5px!important}#menuSheet button.chip,#menuSheet a.chip{font-size:11.5px!important;padding:7px 11px!important;border-radius:10px!important;letter-spacing:0.02em!important;background:rgba(255,255,255,0.05)!important;border-color:rgba(210,222,255,0.14)!important}#menuSheet button.chip[aria-pressed=true]{color:#fff!important;border-color:rgba(255,90,77,0.65)!important;background:linear-gradient(135deg,rgba(255,90,77,0.3),rgba(255,90,77,0.08))!important;box-shadow:0 0 12px -4px rgba(255,90,77,0.75)!important}#menuSheet #fbLink{padding:8px 11px!important}#menuSheet #sizeLink,#menuSheet #backLink{order:8!important}#menuSheet .note{order:9!important;font-size:9.5px!important;line-height:1.3!important;opacity:0.55!important;margin:2px 0 0!important}';" +
        "css+='" + PLAYER_CSS + "';" +
        "if((location.hash||'')==='#space-news'){css+='#space-news .grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important;background:transparent!important}" +
        "#space-news .grid>*{padding:10px!important;border-radius:12px!important;background:rgba(255,255,255,0.04)!important}" +
        "#space-news .grid p.label-mono{font-size:11px!important;margin-top:6px!important}" +
        "#space-news .grid p.line-clamp-3{font-size:14px!important;line-height:1.35!important;-webkit-line-clamp:5!important;min-height:0!important;text-transform:none!important;letter-spacing:0!important}" +
        "#space-news>button{padding-bottom:14px!important;pointer-events:none!important}" +
        "#space-news>button span[aria-hidden]{display:none!important}" +
        "html,body{background-color:#000!important}canvas{display:none!important}';}" +
        "function inj(d){try{if(!d||!d.head||d.getElementById('cn-native'))return;var s=d.createElement('style');" +
        "s.id='cn-native';s.textContent=css;d.head.appendChild(s);}catch(e){}}" +
        "function all(){inj(document);var f=document.querySelectorAll('iframe');" +
        "for(var i=0;i<f.length;i++){try{inj(f[i].contentDocument);}catch(e){}}}" +
        "function bk(){try{var a=document.querySelectorAll('a,button');for(var i=0;i<a.length;i++){var t=(a[i].textContent||'').trim();" +
        "if(t.length<24&&(t.charAt(0)==='\u2190'||t.charAt(0)==='\u2039')){a[i].style.setProperty('display','none','important');}}" +
        HIDE_FB_JS +
        "var hh=(location.hash||'').replace('#','');if(hh==='space-news'||hh==='maschine'){var el=document.getElementById(hh);if(el){for(var p=el;p&&p!==document.body;p=p.parentElement){var ch=p.parentElement?p.parentElement.children:[];for(var k=0;k<ch.length;k++){var c=ch[k];if(c===p||c.tagName==='SCRIPT'||c.tagName==='STYLE'||c.tagName==='CANVAS')continue;if(getComputedStyle(c).position==='fixed')continue;c.style.setProperty('display','none','important');}}el.style.setProperty('margin-top','8px','important');}}" +
        (if (hideNews) "var nw=document.getElementById('space-news');if(nw)nw.style.setProperty('display','none','important');" else "") +
        "}catch(e){}}" +
        animJs(anim) + ";all();bk();var n=0;var iv=setInterval(function(){all();bk();if(++n>500)clearInterval(iv);},500);})()"

// ---------------------------------------------------------------- Activity
class MainActivity : ComponentActivity() {
    private var pendingGeo: (() -> Unit)? = null
    private val locationLauncher =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
            if (granted) pendingGeo?.invoke()
            pendingGeo = null
        }

    fun withLocationPermission(onGranted: () -> Unit) {
        val ok = checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
        if (ok) {
            onGranted()
        } else {
            pendingGeo = onGranted
            locationLauncher.launch(Manifest.permission.ACCESS_FINE_LOCATION)
        }
    }

    fun setKeepOn(on: Boolean) {
        if (on) window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON) else window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
    }

    private val notifLauncher = registerForActivityResult(ActivityResultContracts.RequestPermission()) { }
    val micGranted = mutableStateOf(false)
    private val micLauncher = registerForActivityResult(ActivityResultContracts.RequestPermission()) { micGranted.value = it }
    fun askMic() {
        if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED) micGranted.value = true
        else micLauncher.launch(Manifest.permission.RECORD_AUDIO)
    }

    override fun onPause() {
        super.onPause()
        MusicBridge.log("App in background")
        MusicBridge.fg = false
        // Spielt Musik, dann Vordergrund-Dienst starten, damit der Ton im Hintergrund weiterlaeuft.
        try {
            val am = getSystemService(Context.AUDIO_SERVICE) as android.media.AudioManager
            MusicBridge.web?.evaluateJavascript("try{var c=window.__cenCtx&&window.__cenCtx();if(c&&c.currentSong&&window.CenNative)CenNative.update2(c.currentSong.title||'',c.currentSong.artist||'',!!c.isPlaying,c.currentSong.coverUrl||'',c.currentTime||0,c.duration||0);}catch(e){}", null)
            if (am.isMusicActive) startForegroundService(Intent(this, MusicService::class.java))
        } catch (_: Exception) { }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        if (intent.getBooleanExtra("np", false)) { intent.removeExtra("np"); MusicBridge.openReq.intValue = MusicBridge.openReq.intValue + 1 }
    }

    override fun onTrimMemory(level: Int) {
        super.onTrimMemory(level)
        MusicBridge.log("Memory warning level $level")
    }

    override fun onResume() {
        super.onResume()
        MusicBridge.log("App in foreground")
        MusicBridge.fg = true
        Updater.check(this, false)
        OfflineStore.autoUpdate(applicationContext, offlinePages(getSharedPreferences("cn", Context.MODE_PRIVATE).getString("lang", "de") ?: "de"))
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        MusicBridge.appCtx = applicationContext
        ClickSound.init(applicationContext)
        Offline.start(applicationContext)
        try {
            @Suppress("DEPRECATION")
            val best = windowManager.defaultDisplay.supportedModes.maxByOrNull { it.refreshRate }
            if (best != null) { val lp = window.attributes; lp.preferredDisplayModeId = best.modeId; window.attributes = lp }
        } catch (_: Exception) { }
        OfflineStore.init(applicationContext)
        if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            notifLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
        }
        val sp = getSharedPreferences("cn", Context.MODE_PRIVATE)
        micGranted.value = checkSelfPermission(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED
        if (sp.getBoolean("keepon", false)) setKeepOn(true)
        enableEdgeToEdge()
        setContent {
            MaterialTheme(
                colorScheme = darkColorScheme(
                    primary = Accent,
                    background = BgDark,
                    surface = Surface1,
                    onSurface = TextMain,
                    onBackground = TextMain,
                ),
            ) {
                var intro by remember { mutableStateOf(!IntroState.shown) }
                SideEffect { IntroState.shown = true }
                Box(Modifier.fillMaxSize().imePadding()) {
                    AppRoot()
                    if (intro) StartIntro(saver = sp.getBoolean("saver", false), onDone = { intro = false })
                }
            }
        }
    }
}

/** Zur Startseite wechseln, ohne die Seite neu zu laden - sonst ist die laufende Musik weg. */
private fun softHome(w: WebView, url: String) {
    val path = try { Uri.parse(url).path ?: "/" } catch (_: Exception) { "/" }
    w.evaluateJavascript("(function(){try{var r=window.next&&window.next.router;if(r&&r.push){r.push('" + path + "');return 'ok';}}catch(e){}return 'no';})()") { res ->
        if (res?.contains("ok") != true) w.loadUrl(url)
    }
}

/** Warum wurde die App zuletzt beendet? (Android 11+) Hilft zu finden, wenn die Musik ploetzlich stoppt. */
private fun lastExits(ctx: Context): String {
    if (android.os.Build.VERSION.SDK_INT < 30) return "-"
    return try {
        val am = ctx.getSystemService(Context.ACTIVITY_SERVICE) as android.app.ActivityManager
        val names = mapOf(1 to "SELF", 2 to "SIGNALED", 3 to "LOW_MEMORY", 4 to "CRASH", 5 to "CRASH_NATIVE", 6 to "ANR", 9 to "RESOURCE", 10 to "USER", 11 to "USER_STOPPED", 12 to "DEP_DIED", 13 to "OTHER", 14 to "FREEZER", 16 to "UPDATED")
        val l = am.getHistoricalProcessExitReasons(ctx.packageName, 0, 3)
        if (l.isEmpty()) "-" else l.joinToString("\n") {
            val min = (System.currentTimeMillis() - it.timestamp) / 60000
            (names[it.reason] ?: it.reason.toString()) + " · " + min + " min" + (if (!it.description.isNullOrBlank()) " · " + it.description else "")
        }
    } catch (_: Exception) { "-" }
}

// ---------------------------------------------------------------- Wurzel
@Composable
private fun AppRoot() {
    val ctx = LocalContext.current
    val prefs = remember { ctx.getSharedPreferences("cn", Context.MODE_PRIVATE) }
    var lang by remember { mutableStateOf(initialLang(ctx)) }
    var screen by remember { mutableStateOf<Screen>(Screen.Home) }
    var webBack by remember { mutableStateOf<Screen>(Screen.Home) }
    var returnTo by remember { mutableStateOf<Screen?>(null) }
    var anim by remember { mutableStateOf(!prefs.getBoolean("saver", false)) }
    val drawer = rememberDrawerState(DrawerValue.Closed)
    val scope = rememberCoroutineScope()
    val de = lang == "de"

    fun go(s: Screen) {
        returnTo = null
        webBack = Screen.Home
        screen = s
        scope.launch { drawer.close() }
    }

    fun openSection(it: Section) {
        val js = if (it.path.contains("#")) "var e=document.getElementById('" + it.path.substringAfter("#") + "');if(e)e.scrollIntoView()" else null
        go(Screen.Web(it.path, if (de) it.de else it.en, js))
    }

    BackHandler(enabled = screen != Screen.Home) {
        ClickSound.play(true)
        val cur = screen
        screen = if (cur is Screen.Info) cur.backTo else Screen.Home
    }

    val openReq = MusicBridge.openReq.intValue
    LaunchedEffect(openReq) {
        if (openReq > 0) {
            if (screen != Screen.Home) returnTo = screen
            screen = Screen.Home
            drawer.close()
            kotlinx.coroutines.delay(350)
            MusicBridge.web?.evaluateJavascript("var b=document.querySelector('div.fixed.bottom-0 button.min-w-0.flex-1');if(b)b.click();", null)
        }
    }
    val backReq = MusicBridge.backReq.intValue
    LaunchedEffect(backReq) {
        val r = returnTo
        if (backReq > 0 && r != null && screen == Screen.Home) { returnTo = null; screen = r }
    }
    var homeBare by remember { mutableStateOf(false) }
    var webBare by remember { mutableStateOf(false) }
    var searchReq by remember { mutableStateOf<Pair<Int, String>?>(null) }
    fun homeCmd(arg: String) {
        searchReq = Pair((searchReq?.first ?: 0) + 1, arg)
        screen = Screen.Home
        scope.launch { drawer.close() }
    }
    val showBg = screen is Screen.Settings || screen is Screen.Info || screen is Screen.Tools
    Box(Modifier.fillMaxSize().background(BgDark)) {
        if (showBg && anim) ParticleBackground(Modifier.fillMaxSize())
        ModalNavigationDrawer(
            drawerState = drawer,
            gesturesEnabled = drawer.currentValue == DrawerValue.Open || drawer.targetValue == DrawerValue.Open,
            drawerContent = {
                ModalDrawerSheet(modifier = Modifier.width(300.dp), drawerContainerColor = Color(0xFF060203)) {
                    DrawerContent(
                        lang,
                        anim,
                        onHome = { homeCmd("!home") },
                        onOpen = { openSection(it) },
                        onTools = { go(Screen.Tools) },
                        onSettings = { go(Screen.Settings) },
                        onSiteSearch = { q -> homeCmd(q) },
                        onFeedback = { homeCmd("!fb") },
                        onPrivacy = { go(Screen.Info(if (de) "Datenschutz" else Tr.t(lang, "Privacy"), Tr.privacy(lang), Screen.Home)) },
                        onAbout = { go(Screen.Info(aboutTitle(de, lang), aboutBody(lang), Screen.Home)) },
                        active = drawer.targetValue == DrawerValue.Open,
                    )
                }
            },
        ) {
            Box(Modifier.fillMaxSize()) {
            Box(Modifier.then(if (screen == Screen.Home) Modifier.fillMaxSize() else Modifier.size(0.dp)).clipToBounds()) {
                HomeWebLayer(lang, screen == Screen.Home, searchReq, anim, onBare = { homeBare = it }, onMenu = { scope.launch { drawer.open() } })
            }
            when (val s = screen) {
                is Screen.Home -> {}
                is Screen.Web -> androidx.compose.runtime.key(s.path) { WebScreen(s, lang, anim, onBare = { webBare = it }, onHome = { screen = Screen.Home }, onBack = { screen = webBack }) }
                is Screen.Settings -> SettingsScreen(
                    lang,
                    anim = anim,
                    onBack = { screen = Screen.Home },
                    onLang = { code ->
                        prefs.edit().putString("lang", code).apply()
                        lang = code
                    },
                    onAnim = { on -> anim = on; prefs.edit().putBoolean("saver", !on).apply() },
                    onFeedback = { homeCmd("!fb") },
                    onOpen = { webBack = Screen.Settings; screen = it },
                )
                is Screen.Tools -> ToolsHub(de, lang, onBack = { screen = Screen.Home }, onOpen = { sec ->
                    webBack = Screen.Tools
                    screen = Screen.Web(sec.path, if (de) sec.de else sec.en)
                })
                is Screen.Info -> InfoScreen(s.title, s.body, onBack = { screen = s.backTo })
            }
            val cur = screen
            if ((cur is Screen.Web && (cur.path in BARE || webBare)) || (cur == Screen.Home && homeBare)) {
                Box(
                    Modifier.align(Alignment.CenterStart).width(30.dp).fillMaxHeight().pointerInput(Unit) {
                        var total = 0f
                        detectHorizontalDragGestures(onDragStart = { total = 0f }, onDragEnd = { total = 0f }) { _, dx ->
                            total += dx
                            if (total > 36f) { total = 0f; scope.launch { drawer.open() } }
                        }
                    },
                )
            }
            }
        }
    }
    BackHandler(enabled = returnTo != null && screen == Screen.Home) {
        ClickSound.play(true)
        MusicBridge.web?.evaluateJavascript("var b=document.querySelector('div.mx-auto.max-w-2xl.flex-col.items-center button.self-start');if(b)b.click();", null)
        val r = returnTo
        returnTo = null
        if (r != null) screen = r
    }

    LaunchedEffect(Unit) { Updater.check(ctx, false) }
    val upd = Updater.avail
    if (upd != null) {
        AlertDialog(
            onDismissRequest = { if (Updater.progress < 0) Updater.avail = null },
            containerColor = Color(0xFF14090B),
            title = { Text(if (de) "Update verfügbar" else Tr.t(lang, "Update available"), color = TextMain, fontFamily = Mono, fontSize = 15.sp) },
            text = {
                Column {
                    Text(
                        (if (de) "Neue Version " else Tr.t(lang, "New version ")) + upd.name +
                            (if (de) ". Die App lädt das Update und startet die Installation." else Tr.t(lang, ". The app downloads the update and starts the installation.")),
                        color = TextMuted, fontSize = 13.sp,
                    )
                    if (Updater.progress >= 0) {
                        Spacer(Modifier.height(10.dp))
                        LinearProgressIndicator(progress = { Updater.progress / 100f }, modifier = Modifier.fillMaxWidth().height(3.dp), color = Accent, trackColor = LineSoft)
                    }
                    if (Updater.msg == "!") {
                        Spacer(Modifier.height(8.dp))
                        Text(if (de) "Download fehlgeschlagen. Versuch es nochmal." else Tr.t(lang, "Download failed. Try again."), color = Accent, fontSize = 12.sp)
                    }
                }
            },
            confirmButton = {
                Text(
                    if (Updater.progress >= 0) "…" else if (de) "JETZT AKTUALISIEREN" else Tr.t(lang, "UPDATE NOW"),
                    color = Accent, fontFamily = Mono, fontSize = 12.sp, fontWeight = FontWeight.Bold,
                    modifier = Modifier.clickable(enabled = Updater.progress < 0) { Updater.msg = ""; Updater.start(ctx) }.padding(12.dp),
                )
            },
            dismissButton = {
                if (Updater.progress < 0) Text(
                    if (de) "SPÄTER" else Tr.t(lang, "LATER"), color = TextMuted, fontFamily = Mono, fontSize = 12.sp,
                    modifier = Modifier.clickable { Updater.avail = null }.padding(12.dp),
                )
            },
        )
    }
    BackHandler(enabled = drawer.currentValue == DrawerValue.Open) { ClickSound.play(true); scope.launch { drawer.close() } }
}

// ---------------------------------------------------------------- Startseite = echte Webseite
private fun animJs(on: Boolean): String =
    "(function(){try{window.__cnAnim=" + on + ";" +
        "var kp=function(){return /sternenhimmel|night-sky|sternbilder|constellations|himmel-heute|sky-today|sonnensystem|solar-system/.test(location.pathname);};var keep=kp();" +
        "var f=function(){var on=window.__cnAnim;var keep=kp();var de=document.documentElement;var c=document.querySelectorAll('canvas');for(var i=0;i<c.length;i++){var e=c[i];" +
        "if(e.dataset.cnh){if(on||keep){e.style.removeProperty('display');delete e.dataset.cnh;}continue;}" +
        "if(on||keep)continue;var cs=getComputedStyle(e);var big=e.offsetWidth>=innerWidth*0.9&&e.offsetHeight>=innerHeight*0.6;" +
        "var fx=cs.position==='fixed';for(var p=e.parentElement;!fx&&p&&p!==document.body;p=p.parentElement){if(getComputedStyle(p).position==='fixed')fx=true;}" +
        "if(cs.position==='fixed'||(fx&&big)||(cs.pointerEvents==='none'&&big)){e.style.setProperty('display','none','important');e.dataset.cnh='1';}}" +
        "var st=document.getElementById('cn-still');" +
        "if(!on&&!keep){if(!de.dataset.bgpause){de.dataset.bgpause='freeze';window.__cnFz=1;}" +
        "var cc=document.querySelectorAll('canvas'),fresh=false;for(var j=0;j<cc.length;j++){var r=cc[j].getBoundingClientRect();" +
        "if(r.width>0&&r.bottom>0&&r.top<innerHeight){var sn=cc[j].dataset.cnSeen;if(sn==='1')continue;fresh=true;cc[j].dataset.cnSeen=(sn==='0')?'1':'0';}}" +
        "if(fresh||document.getElementById('maschine')){if(window.__cnOv){delete de.dataset.overlay;window.__cnOv=0;}}else if(de.dataset.overlay!=='1'){de.dataset.overlay='1';window.__cnOv=1;}" +
        "if(!st){st=document.createElement('style');st.id='cn-still';st.textContent='*:not([class*=spin]),*:not([class*=spin])::before,*:not([class*=spin])::after{animation:none!important}';(document.head||de).appendChild(st);}}" +
        "else{if(window.__cnFz){delete de.dataset.bgpause;window.__cnFz=0;}if(window.__cnOv){delete de.dataset.overlay;window.__cnOv=0;}if(st)st.remove();}};" +
        "f();if(!window.__cnAnimIv)window.__cnAnimIv=setInterval(f,700);" +
        "if(!window.__cnClick){window.__cnClick=1;document.addEventListener('click',function(e){try{var t=e.target&&e.target.closest&&e.target.closest('a,button,[role=button],summary,label,input,select');if(t&&window.CenNative){var tx=(t.textContent||'').trim();var bk=t.getAttribute('aria-expanded')==='true'||(tx.length<24&&(tx.charAt(0)==='\u2190'||tx.charAt(0)==='\u2039'));if(bk&&CenNative.clickBack)CenNative.clickBack();else if(CenNative.click)CenNative.click();}}catch(x){}},true);}" +
        "var o=document.getElementById('cn-anim');if(o)o.remove();" +
        (if (on) "" else "if(!keep){var s=document.createElement('style');s.id='cn-anim';s.textContent='html,body{background:#000!important}';(document.head||document.documentElement).appendChild(s);}") +
        "}catch(e){}})()"

/** Kompakte, futuristische Suchergebnisse (Zeilen statt grosser Kacheln) - nur in der App. */
private const val RESULTS_CSS =
    "div.mt-10>h2.label-mono{font-size:10px!important;letter-spacing:3px!important;color:#ff5a4d!important;margin:14px 0 8px!important}" +
        "div.mt-10>h2.label-mono+div.grid.gap-px{grid-template-columns:1fr!important;gap:6px!important;background:transparent!important}" +
        "div.mt-10>h2.label-mono+div.grid.gap-px>div.group{flex-direction:row!important;align-items:center!important;gap:12px!important;padding:8px 6px 8px 8px!important;" +
        "border:1px solid rgba(255,90,77,0.25)!important;border-left:3px solid #ff5a4d!important;border-radius:10px!important;background:linear-gradient(90deg,rgba(255,90,77,0.10),rgba(255,255,255,0.02))!important;position:relative!important}" +
        "div.mt-10>h2.label-mono+div.grid.gap-px>div.group>div.relative{display:contents!important}" +
        "div.mt-10>h2.label-mono+div.grid.gap-px>div.group>div.relative>*{display:none!important}" +
        "div.mt-10>h2.label-mono+div.grid.gap-px>div.group>div.relative>*:first-child{display:block!important;position:relative!important;inset:auto!important;order:0!important;flex:0 0 auto!important;width:58px!important;height:58px!important;border-radius:8px!important;overflow:hidden!important;border:1px solid rgba(255,90,77,0.45)!important}" +
        "div.mt-10>h2.label-mono+div.grid.gap-px>div.group>div.relative>button[class*=right-1]{display:flex!important;order:3!important;position:static!important;width:32px!important;height:32px!important;background:transparent!important}" +
        "div.mt-10>h2.label-mono+div.grid.gap-px>div.group>div.flex-1{order:1!important;flex:1 1 auto!important;padding:0!important;min-width:0!important}" +
        "div.mt-10>h2.label-mono+div.grid.gap-px>div.group>div.flex-1>p:first-child{white-space:normal!important;display:-webkit-box!important;-webkit-line-clamp:2!important;-webkit-box-orient:vertical!important;font-size:13px!important;line-height:1.25!important}" +
        "div.mt-10>h2.label-mono+div.grid.gap-px>div.group>div.flex-1>p:last-child{font-size:10px!important;letter-spacing:1.5px!important;text-transform:uppercase!important;color:#ff8a80!important;margin-top:2px!important}"

private const val RESULTS_JS =
    "try{if(!window.__cnRows){window.__cnRows=1;document.addEventListener('click',function(e){var t=e.target;if(!t||!t.closest)return;" +
        "var row=t.closest('div.group');if(!row||!row.parentElement||!row.parentElement.matches('div.grid.gap-px'))return;if(t.closest('button'))return;" +
        "var b=row.querySelector('div.relative>button');if(b)b.click();},true);}}catch(e){}"

/** Staub-Effekt im Cover der Play-Seite; reagiert auf den Bass (CenNative.level) oder einen simulierten Takt. */
private const val FX_JS = """
if(!window.__cenFx){window.__cenFx=function(){try{
var host=document.querySelector('div.mx-auto.flex.w-full.max-w-2xl.flex-col.items-center .aspect-square');
if(!host)return;if(host.querySelector('#cn-fx'))return;
var cv=document.createElement('canvas');cv.id='cn-fx';
cv.style.cssText='position:absolute;left:0;top:0;width:100%;height:100%;z-index:5;background:#050304';
host.style.position='relative';host.appendChild(cv);
var ctx=cv.getContext('2d'),W=0,H=0,P=[],t0=performance.now(),last=0;
function rnd(a,b){return a+Math.random()*(b-a);}
function sprite(core,mid){var c=document.createElement('canvas');c.width=c.height=64;var x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);
g.addColorStop(0,'rgba(255,238,222,1)');g.addColorStop(core,'rgba(255,200,170,.7)');g.addColorStop(mid,'rgba(255,130,100,.16)');g.addColorStop(1,'rgba(255,90,77,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return c;}
var SHARP=sprite(.22,.55),BLUR=sprite(.05,.45);
function mkp(init){var z=Math.pow(Math.random(),1.5);return {x:rnd(0,W),y:init?rnd(0,H):-12,z:z,r:.6+z*2.4,ph:rnd(0,6.28),rot:rnd(0,6.28),rs:rnd(-1.6,1.6),sp:rnd(.7,1.3),vx:0,vy:0,hot:0,fc:Math.random()<.18};}
function size(){var r=cv.getBoundingClientRect();if(!r.width)return;var d=Math.min(window.devicePixelRatio||1,2);W=r.width;H=r.height;cv.width=Math.round(W*d);cv.height=Math.round(H*d);ctx.setTransform(d,0,0,d,0,0);P=[];for(var i=0;i<280;i++)P.push(mkp(true));}
var L=0,prev=0,kick=0,flash=0;
function frame(now){requestAnimationFrame(frame);
if(!document.getElementById('cn-fx'))return;
if(!window.CenNative||!CenNative.shown())return;
if(now-last<33)return;last=now;
var r=cv.getBoundingClientRect();if(r.bottom<0||r.top>window.innerHeight||!r.width)return;
if(Math.abs(r.width-W)>1||!P.length)size();
var t=(now-t0)/1000,pl=CenNative.playing(),raw=CenNative.level();
if(raw<0){raw=pl?Math.pow(1-((t*1.6)%1),3):0.0;}
else if(!pl)raw=0;
L+=(raw-L)*(raw>L?0.65:0.18);
if(raw-prev>0.22&&raw>0.45){kick=1;flash=1;}
prev=raw;kick*=0.88;flash*=0.8;
ctx.globalCompositeOperation='source-over';ctx.fillStyle='#050304';ctx.fillRect(0,0,W,H);
ctx.globalCompositeOperation='lighter';
var hz=ctx.createLinearGradient(0,0,0,H);hz.addColorStop(0,'rgba(255,100,70,'+(.07+L*.08)+')');hz.addColorStop(1,'rgba(255,90,77,0)');ctx.fillStyle=hz;ctx.fillRect(0,0,W,H);
var i,p;
for(i=0;i<P.length;i++){p=P[i];
p.vx+=(Math.sin(t*.3*p.sp+p.y*.012+p.ph)*.05+Math.sin(t*.9+p.x*.02)*.02-p.vx)*.05;
p.vy+=((.12+p.z*.75)*p.sp*(1+kick*.5)-p.vy)*.06;
p.x+=p.vx+(Math.random()-.5)*.06;p.y+=p.vy+(Math.random()-.5)*.06;p.rot+=p.rs*.02;
if(p.y>H+14){p=P[i]=mkp(false);}
if(p.x<-14)p.x=W+14;else if(p.x>W+14)p.x=-14;
var hot=flash*(.35+p.z*.65)*(p.fc?1.4:1);
p.hot+=(hot-p.hot)*(hot>p.hot?.7:.12);
var gl=Math.pow(Math.max(0,Math.sin(p.rot*2+p.ph)),8);
var a=(.2+p.z*.42)*(.6+gl)+p.hot*.9+L*.05;
var rr=p.r*(1+p.hot*1.6+gl*.5);
if(p.z>.72){ctx.globalAlpha=Math.min(1,a*.5);rr*=2.2;ctx.drawImage(BLUR,p.x-rr*1.8,p.y-rr*1.8,rr*3.6,rr*3.6);}
else{ctx.globalAlpha=Math.min(1,a);ctx.drawImage(SHARP,p.x-rr*1.7,p.y-rr*1.7,rr*3.4,rr*3.4);}}
ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
var cx=W/2,cy=H/2,vg=ctx.createRadialGradient(cx,cy,W*.25,cx,cy,W*.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);}
size();requestAnimationFrame(frame);
}catch(e){}};}
"""

private const val PLAYER_CSS =
    "div.fixed.inset-x-0.bottom-0.z-20{left:8px!important;right:8px!important;bottom:calc(8px + env(safe-area-inset-bottom,0px))!important;border:1px solid rgba(255,90,77,0.45)!important;border-radius:16px!important;background:linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0) 45%),linear-gradient(90deg,rgba(255,90,77,0.14),rgba(10,6,8,0.78) 60%)!important;-webkit-backdrop-filter:blur(8px) saturate(1.3)!important;backdrop-filter:blur(8px) saturate(1.3)!important;box-shadow:0 0 22px rgba(255,90,77,0.22),0 6px 20px rgba(0,0,0,0.55),inset 0 1px 0 rgba(255,255,255,0.14)!important;overflow:hidden}div.fixed.inset-x-0.bottom-0.z-20>div{padding:7px 12px 8px!important;gap:5px!important}div.fixed.inset-x-0.bottom-0.z-20 p.truncate:first-child{font-size:12px!important;letter-spacing:0.1em!important;text-shadow:0 0 10px rgba(255,90,77,0.55)}div.fixed.inset-x-0.bottom-0.z-20 p.truncate+p{font-size:9.5px!important;letter-spacing:0.22em!important;text-transform:uppercase!important;color:#ff8a80!important}div.fixed.inset-x-0.bottom-0.z-20 .flex.items-center.gap-3>button:not(:first-child){width:32px!important;height:32px!important;border-radius:999px!important;border:1px solid rgba(255,90,77,0.4)!important;background:rgba(255,90,77,0.07)!important;color:#fff!important}div.fixed.inset-x-0.bottom-0.z-20 .flex.items-center.gap-3>button:nth-child(3){width:38px!important;height:38px!important;background:#ff5a4d!important;border-color:#ff5a4d!important;color:#0a0a0a!important;box-shadow:0 0 18px rgba(255,90,77,0.75)!important}div.fixed.inset-x-0.bottom-0.z-20 .flex.items-center.gap-3>button:last-child{border-color:transparent!important;background:transparent!important;color:rgba(255,255,255,0.55)!important;width:28px!important}div.fixed.inset-x-0.bottom-0.z-20 input[type=range]{height:3px!important;border-radius:3px!important;box-shadow:0 0 8px rgba(255,90,77,0.6)}div.fixed.inset-x-0.bottom-0.z-20 span.tabular-nums{font-size:9.5px!important;letter-spacing:0.1em!important;color:#ff8a80!important}div.mt-10.grid.gap-px.bg-border{grid-template-columns:1fr!important;gap:6px!important;background:transparent!important;margin-top:14px!important}div.mt-10.grid.gap-px.bg-border>div.animate-pulse{aspect-ratio:auto!important;height:44px!important;border:1px solid rgba(255,90,77,0.22)!important;border-left:3px solid #ff5a4d!important;border-radius:10px!important;background:linear-gradient(90deg,rgba(255,90,77,0.16),rgba(255,255,255,0.03) 60%,rgba(255,90,77,0.08))!important;animation:cnPulse 1.3s ease-in-out infinite!important}div.mt-10.grid.gap-px.bg-border>div.animate-pulse:nth-child(n+5){display:none!important}@keyframes cnPulse{0%,100%{opacity:0.45}50%{opacity:1}}div.mt-10.border.text-center{margin-top:14px!important;padding:14px 12px!important;border:1px solid rgba(255,90,77,0.3)!important;border-radius:10px!important;background:rgba(255,90,77,0.05)!important;font-size:10.5px!important;letter-spacing:0.18em!important;text-transform:uppercase!important;color:#ff8a80!important}"

private const val SIZECARD_CSS =
    "a.feat-card[href*=groessenvergleich],a.feat-card[href*=size-comparison]{background-image:linear-gradient(90deg,rgba(14,6,8,0.92) 0%,rgba(14,6,8,0.55) 52%,rgba(14,6,8,0.05) 100%),url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNjAgMTMwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWF4WU1pZCBtZWV0Ij48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImciIGN4PSIzOCUiIGN5PSIzMiUiIHI9Ijc1JSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmY4YTc4IiBzdG9wLW9wYWNpdHk9Ii41NSIvPjxzdG9wIG9mZnNldD0iLjU1IiBzdG9wLWNvbG9yPSIjZmY1YTRkIiBzdG9wLW9wYWNpdHk9Ii4xNiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmNWE0ZCIgc3RvcC1vcGFjaXR5PSIuMDMiLz48L3JhZGlhbEdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0ibCIgeDE9IjAiIHgyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZjVhNGQiIHN0b3Atb3BhY2l0eT0iMCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmNWE0ZCIgc3RvcC1vcGFjaXR5PSIuNyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxsaW5lIHgxPSIxMjAiIHkxPSIxMTIiIHgyPSIzNjAiIHkyPSIxMTIiIHN0cm9rZT0idXJsKCNsKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PGcgc3Ryb2tlPSIjZmY1YTRkIiBzdHJva2Utb3BhY2l0eT0iLjQ1IiBzdHJva2Utd2lkdGg9IjEiPjxwYXRoIGQ9Ik0xMzAgMTEydjRNMTUwIDExMnYzTTE3MCAxMTJ2NE0xOTAgMTEydjNNMjEwIDExMnY0TTIzMCAxMTJ2M00yNTAgMTEydjRNMjcwIDExMnYzTTI5MCAxMTJ2NE0zMTAgMTEydjNNMzMwIDExMnY0TTM1MCAxMTJ2MyIvPjwvZz48ZyBzdHJva2U9IiNmZjdhNjgiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0idXJsKCNnKSI+PGNpcmNsZSBjeD0iMTQ2IiBjeT0iMTA3IiByPSIzIiBmaWxsPSIjZmY4YTc4IiBzdHJva2U9Im5vbmUiLz48Y2lyY2xlIGN4PSIxNzAiIGN5PSIxMDMiIHI9IjciLz48Y2lyY2xlIGN4PSIyMDgiIGN5PSI5NCIgcj0iMTYiLz48Y2lyY2xlIGN4PSIyNjIiIGN5PSI4MCIgcj0iMzAiLz48Y2lyY2xlIGN4PSIzMzgiIGN5PSI1NiIgcj0iNTIiIHN0cm9rZS1vcGFjaXR5PSIuODUiLz48L2c+PGcgc3Ryb2tlPSIjZmY1YTRkIiBzdHJva2Utb3BhY2l0eT0iLjI4IiBzdHJva2UtZGFzaGFycmF5PSIyIDMiIHN0cm9rZS13aWR0aD0iMSI+PHBhdGggZD0iTTE0NiAxMDRIMzYwTTE3MCA5NkgzNjBNMjA4IDc4SDM2ME0yNjIgNTBIMzYwTTMzOCA0SDM2MCIvPjwvZz48Y2lyY2xlIGN4PSIyNjIiIGN5PSI4MCIgcj0iNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmNWE0ZCIgc3Ryb2tlLW9wYWNpdHk9Ii4xMiIvPjxjaXJjbGUgY3g9IjMzOCIgY3k9IjU2IiByPSI2NCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmY1YTRkIiBzdHJva2Utb3BhY2l0eT0iLjEwIi8+PC9zdmc+),radial-gradient(90% 140% at 100% 40%,rgba(255,90,77,0.20),rgba(20,8,10,0.4) 70%)!important;background-repeat:no-repeat!important;background-position:0 0,right 6px center,0 0!important;background-size:100% 100%,auto 92%,100% 100%!important}" +
        "a.feat-card[href*=groessenvergleich] .feat-go,a.feat-card[href*=size-comparison] .feat-go{z-index:2}"

private const val PLAYLIST_CSS =
    "section.mx-auto.mt-3.w-full.max-w-2xl[aria-label]{margin-top:4px!important}" +
        "section.mx-auto.mt-3.w-full.max-w-2xl[aria-label]>div.mb-2{margin-bottom:6px!important}" +
        "section.mx-auto.mt-3.w-full.max-w-2xl[aria-label]>div.mb-2 h2{font-size:10px!important;letter-spacing:0.28em!important}" +
        "section.mx-auto.mt-3.w-full.max-w-2xl[aria-label]>div.mb-2 button{padding:4px 10px!important;font-size:10px!important;letter-spacing:0.12em!important;border-radius:999px!important;border-color:rgba(255,90,77,0.45)!important;background:rgba(255,90,77,0.07)!important}" +
        "section.mx-auto.mt-3.w-full.max-w-2xl[aria-label] .overflow-x-auto{gap:10px!important;padding-bottom:0!important}" +
        "section.mx-auto.mt-3.w-full.max-w-2xl[aria-label] .group{width:112px!important}" +
        "section.mx-auto.mt-3.w-full.max-w-2xl[aria-label] .group span[aria-hidden=true]{display:none!important}" +
        "section.mx-auto.mt-3.w-full.max-w-2xl[aria-label] .group .aspect-video{border-radius:12px!important;border:1px solid rgba(255,255,255,0.16)!important;box-shadow:0 4px 14px rgba(0,0,0,0.45)!important}" +
        "section.mx-auto.mt-3.w-full.max-w-2xl[aria-label] .group .aspect-video>span.absolute.inset-y-0{width:28%!important;background:rgba(0,0,0,0.5)!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important}" +
        "section.mx-auto.mt-3.w-full.max-w-2xl[aria-label] .group .truncate{margin-top:5px!important;font-size:10.5px!important;letter-spacing:0.03em!important}" +
        "section.mx-auto.mt-3.w-full.max-w-2xl[aria-label] .group .text-muted{font-size:9.5px!important;opacity:0.75}"

private fun homeJs(anim: Boolean): String =
    "(function(){var css='html{background-color:#060203!important}body{background-color:transparent!important}.app-fab,.app-drawer,.app-scrim{display:none!important}" +
        "button[aria-haspopup=listbox]{display:none!important}a[href\$=apk]{display:none!important}" +
        RESULTS_CSS +
        PLAYER_CSS +
        PLAYLIST_CSS +
        SIZECARD_CSS +
        "span.relative.inline-block>button.rounded-full.h-5.w-5{display:none!important}form[role=search]>div.group{padding:9px 13px!important;gap:9px!important;border:1px solid rgba(220,228,255,0.14)!important;border-radius:2px!important;background:linear-gradient(#ff5a4d,#ff5a4d) 0 0/9px 1px no-repeat,linear-gradient(#ff5a4d,#ff5a4d) 0 0/1px 9px no-repeat,linear-gradient(#ff5a4d,#ff5a4d) 100% 0/9px 1px no-repeat,linear-gradient(#ff5a4d,#ff5a4d) 100% 0/1px 9px no-repeat,linear-gradient(#ff5a4d,#ff5a4d) 0 100%/9px 1px no-repeat,linear-gradient(#ff5a4d,#ff5a4d) 0 100%/1px 9px no-repeat,linear-gradient(#ff5a4d,#ff5a4d) 100% 100%/9px 1px no-repeat,linear-gradient(#ff5a4d,#ff5a4d) 100% 100%/1px 9px no-repeat,linear-gradient(90deg,rgba(255,90,77,0.18),rgba(255,255,255,0.04) 55%,rgba(255,90,77,0.07))!important;-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);box-shadow:inset 0 1px 0 rgba(255,255,255,0.09),0 0 18px -8px rgba(255,90,77,0.75)!important}form[role=search]>div.group:focus-within{border-color:rgba(255,90,77,0.65)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,0.12),0 0 22px -4px rgba(255,90,77,0.8)!important}form[role=search]>div.group>svg:first-child{color:#ff5a4d!important}form[role=search] input::placeholder{text-transform:uppercase!important;letter-spacing:2px!important;font-size:11px!important;opacity:0.6!important}form[role=search] input{letter-spacing:0.6px!important}form[role=search] svg{width:17px!important;height:17px!important}form[role=search] input{font-size:14px!important;line-height:1.2!important;padding:3px 0!important}form[role=search] button{padding:2px!important}" +
        "#cn-save{margin-top:14px;display:flex;align-items:center;gap:8px;padding:9px 18px;border:1px solid rgba(255,90,77,0.55);border-radius:999px;background:rgba(255,90,77,0.08);color:#fff;font-size:12px;letter-spacing:0.2em;font-family:inherit;text-transform:uppercase;box-shadow:0 0 14px rgba(255,90,77,0.25)}#cn-save.on{background:#ff5a4d;color:#0a0a0a}div.fixed.bottom-1.right-1{width:480px!important;height:270px!important;opacity:0!important;pointer-events:none!important;z-index:-1!important}" +
        "div.mx-auto.flex.w-full.max-w-2xl.flex-col.items-center{position:relative;padding:10px 12px 12px;margin-top:6px;margin-bottom:18px;border:1px solid rgba(255,120,100,0.45);border-radius:18px;background:linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0) 30%),radial-gradient(120% 60% at 50% 0%,rgba(255,90,77,0.10),rgba(10,8,12,0.10) 62%);-webkit-backdrop-filter:blur(3px) saturate(1.3);backdrop-filter:blur(3px) saturate(1.3);box-shadow:0 0 28px rgba(255,90,77,0.18),inset 0 1px 0 rgba(255,255,255,0.20),inset 0 0 40px rgba(255,90,77,0.05)}div.mx-auto.flex.w-full.max-w-2xl.flex-col.items-center .aspect-square>:not(#cn-fx){visibility:hidden!important}div.mx-auto.flex.w-full.max-w-2xl.flex-col.items-center .aspect-square{width:58%!important;max-width:58%!important;margin-left:auto!important;margin-right:auto!important;border:1px solid #ff5a4d!important;border-radius:14px;box-shadow:0 0 0 4px rgba(255,90,77,0.10),0 0 34px rgba(255,90,77,0.45);overflow:hidden}div.mx-auto.flex.w-full.max-w-2xl.flex-col.items-center p.font-display{font-size:19px;letter-spacing:0.12em;text-shadow:0 0 14px rgba(255,90,77,0.7)}div.mx-auto.flex.w-full.max-w-2xl.flex-col.items-center p.label-mono{letter-spacing:0.35em;color:#ff5a4d}div.mx-auto.flex.w-full.max-w-2xl.flex-col.items-center div.justify-center.gap-4 button{border-radius:999px;border:1px solid rgba(255,90,77,0.55);background:rgba(255,90,77,0.08);box-shadow:0 0 14px rgba(255,90,77,0.25)}div.mx-auto.flex.w-full.max-w-2xl.flex-col.items-center div.justify-center.gap-4 button.border-accent{background:#ff5a4d;color:#0a0a0a;box-shadow:0 0 26px rgba(255,90,77,0.8)}div.mx-auto.flex.w-full.max-w-2xl.flex-col.items-center button.self-start{border-radius:999px;border-color:rgba(255,90,77,0.5)}" +
        "';" +
        "try{Object.defineProperty(document,'hidden',{get:function(){return false;},configurable:true});Object.defineProperty(document,'visibilityState',{get:function(){return 'visible';},configurable:true});document.addEventListener('visibilitychange',function(e){e.stopImmediatePropagation();},true);}catch(x){}" +
        RESULTS_JS +
        "if(!window.__cenRaf){window.__cenRaf=1;var oR=window.requestAnimationFrame.bind(window),oC=window.cancelAnimationFrame.bind(window),mp={},nn=0,lt=-1000;window.requestAnimationFrame=function(cb){var id=++nn;var step=function(t){if(!mp[id])return;if(t!==lt&&t-lt<14.5){mp[id]=oR(step);}else{delete mp[id];lt=t;cb(t);}};mp[id]=oR(step);return id;};window.cancelAnimationFrame=function(id){if(mp[id]){oC(mp[id]);delete mp[id];}else{oC(id);}};}" +
        "if(!window.__cenBackL){window.__cenBackL=1;document.addEventListener('click',function(e){try{var b=e.target.closest&&e.target.closest('div.mx-auto.max-w-2xl.flex-col.items-center button.self-start');if(b&&window.CenNative)CenNative.heroBack();}catch(x){}},true);}" +
        "window.__cenCtx=function(){try{var c=['main','#__next','body > div'];for(var i=0;i<c.length;i++){var n=document.querySelector(c[i]);if(!n)continue;var k=null;for(var x in n){if(x.indexOf('__reactFiber')===0){k=x;break;}}if(!k)continue;var f=n[k];while(f){var p=f.memoizedProps;if(p&&p.value&&typeof p.value.toggleFavorite==='function')return p.value;f=f.return;}}}catch(e){}return null;};" +
        "if(!window.__cenPoll){window.__cenPoll=1;setInterval(function(){try{var c=window.__cenCtx();if(!window.CenNative)return;if(c&&c.currentSong)CenNative.update2(c.currentSong.title||'',c.currentSong.artist||'',!!c.isPlaying,c.currentSong.coverUrl||'',c.currentTime||0,c.duration||0);if(c&&c.currentSong&&CenNative.resume()&&!c.isPlaying&&Date.now()-(window.__cenRes||0)>2500){window.__cenRes=Date.now();c.togglePlayback();}if(!c)return;var m=CenNative.cmd();if(!m)return;if(m==='next')c.next();else if(m==='prev')c.previous();else if(m==='pause'){if(c.isPlaying)c.togglePlayback();}else if(m==='play'){if(!c.isPlaying)c.togglePlayback();}else if(m==='pp')c.togglePlayback();else if(m.indexOf('seek:')===0)c.seekTo(parseFloat(m.substring(5)));}catch(e){}},500);}" +
        FX_JS.replace("\n", " ") +
        "window.__cenSave=function(){try{var b=document.getElementById('cn-save');if(!b)return;var c=window.__cenCtx();var on=!!(c&&c.currentSong&&c.isFavorite(c.currentSong.id));var de=(document.documentElement.lang||'').indexOf('de')===0;b.className=on?'on':'';b.textContent=on?(de?'★ GESPEICHERT':'★ SAVED'):(de?'☆ SPEICHERN':'☆ SAVE');}catch(e){}};" +
        "var n=0;function run(){try{if(window.__cenFx)window.__cenFx();if(!document.getElementById('cn-native')&&document.head){var s=document.createElement('style');" +
        "s.id='cn-native';s.textContent=css;document.head.appendChild(s);}" +
        "var hr=document.querySelector('div.mx-auto.max-w-2xl.flex-col.items-center');if(hr){var sb=document.getElementById('cn-save');if(!sb){sb=document.createElement('button');sb.id='cn-save';sb.type='button';sb.addEventListener('click',function(){var cc=window.__cenCtx();if(cc&&cc.currentSong)cc.toggleFavorite(cc.currentSong);setTimeout(window.__cenSave,200);});hr.appendChild(sb);}window.__cenSave();}" +
        "var kk=document.getElementById('kontakte');if(kk)kk.style.setProperty('display','none','important');" +
        "var im=document.querySelector('img[src*=\"branding/logo.jpg\"]');if(im){var sc=im.closest('section');if(sc)sc.style.setProperty('display','none','important');}" +
        "var fo=document.querySelectorAll('footer');for(var j=0;j<fo.length;j++){fo[j].style.setProperty('display','none','important');}" +
        "var d=document.querySelectorAll('.dl-pill');for(var i=0;i<d.length;i++){var q=d[i].parentElement||d[i];q.style.setProperty('display','none','important');}" +
        HIDE_FB_JS + "}catch(x){}}" +
        "run();var iv=setInterval(function(){run();if(++n>60)clearInterval(iv);},500);" +
        animJs(anim) + ";" +
        "var tm=null;try{new MutationObserver(function(){if(tm)return;tm=setTimeout(function(){tm=null;run();},200);}).observe(document.documentElement,{childList:true,subtree:true});}catch(x){}})()"

/** Offline: ohne Netz werden bereits besuchte Seiten aus dem Zwischenspeicher gezeigt (Musik braucht weiterhin Netz). */
object Offline {
    private val views: MutableSet<WebView> = java.util.Collections.newSetFromMap(java.util.WeakHashMap<WebView, Boolean>())
    @Volatile var online = true

    fun check(ctx: Context): Boolean {
        val cm = ctx.getSystemService(Context.CONNECTIVITY_SERVICE) as android.net.ConnectivityManager
        val n = cm.activeNetwork ?: return false
        val c = cm.getNetworkCapabilities(n) ?: return false
        return c.hasCapability(android.net.NetworkCapabilities.NET_CAPABILITY_INTERNET) && c.hasCapability(android.net.NetworkCapabilities.NET_CAPABILITY_VALIDATED)
    }

    private fun mode() = if (online) android.webkit.WebSettings.LOAD_DEFAULT else android.webkit.WebSettings.LOAD_CACHE_ELSE_NETWORK

    fun register(w: WebView) {
        synchronized(views) { views.add(w) }
        w.settings.cacheMode = mode()
    }

    private fun set(v: Boolean) {
        if (online == v) return
        online = v
        android.os.Handler(android.os.Looper.getMainLooper()).post {
            synchronized(views) { views.forEach { try { it.settings.cacheMode = mode() } catch (_: Exception) { } } }
        }
    }

    fun start(ctx: Context) {
        online = try { check(ctx) } catch (_: Exception) { true }
        try {
            val cm = ctx.getSystemService(Context.CONNECTIVITY_SERVICE) as android.net.ConnectivityManager
            cm.registerDefaultNetworkCallback(object : android.net.ConnectivityManager.NetworkCallback() {
                override fun onCapabilitiesChanged(network: android.net.Network, caps: android.net.NetworkCapabilities) {
                    set(caps.hasCapability(android.net.NetworkCapabilities.NET_CAPABILITY_VALIDATED))
                }
                override fun onLost(network: android.net.Network) { set(false) }
            })
        } catch (_: Exception) { }
    }

    /** Ladefehler der Hauptseite: ohne Netz einmal aus dem Zwischenspeicher versuchen. Gibt true zurueck, wenn neu geladen wird. */
    fun retryFromCache(view: WebView?): Boolean {
        if (view == null || view.settings.cacheMode == android.webkit.WebSettings.LOAD_CACHE_ELSE_NETWORK) return false
        if (check(view.context)) return false
        view.settings.cacheMode = android.webkit.WebSettings.LOAD_CACHE_ELSE_NETWORK
        view.reload()
        return true
    }
}

/** WebView, die beim Verlassen der App nicht als "unsichtbar" gemeldet wird - so laeuft die Musik im Hintergrund weiter. */
private class KeepAliveWebView(c: Context) : WebView(c) {
    override fun onWindowVisibilityChanged(visibility: Int) {
        if (visibility != android.view.View.GONE && visibility != android.view.View.INVISIBLE) super.onWindowVisibilityChanged(visibility)
    }
}

/** Die Startseite der Webseite 1:1 (Design, Suche, Musik) in der App. Bleibt am Leben, damit Musik weiterlaeuft. */
@SuppressLint("SetJavaScriptEnabled")
@Composable
private fun HomeWebLayer(lang: String, visible: Boolean, searchReq: Pair<Int, String>?, anim: Boolean, onBare: (Boolean) -> Unit, onMenu: () -> Unit) {
    val homeActivity = LocalContext.current as MainActivity
    SideEffect { MusicBridge.guard = !visible }
    var web by remember { mutableStateOf<WebView?>(null) }
    var canBack by remember { mutableStateOf(false) }
    var bareNow by remember { mutableStateOf(false) }
    var progress by remember { mutableStateOf(0) }
    var failed by remember { mutableStateOf(false) }
    var loading by remember { mutableStateOf(true) }
    var attempt by remember { mutableStateOf(0) }
    var loadedLang by remember { mutableStateOf(lang) }
    val de = lang == "de"
    val langNow by rememberUpdatedState(lang)
    val animNow by rememberUpdatedState(anim)
    // Sprachwechsel: erst neu laden, wenn die Startseite sichtbar ist (im versteckten Zustand hat die WebView Groesse 0 und rendert kaputt)
    LaunchedEffect(lang, visible, web) {
        val w = web
        if (w != null && visible && loadedLang != lang) {
            loadedLang = lang; attempt = 0; loading = true
            w.loadUrl(siteUrl("/", lang))
        }
    }
    LaunchedEffect(loading, attempt) {
        if (loading) {
            kotlinx.coroutines.delay(15000)
            if (loading) {
                if (attempt == 0) { attempt = 1; web?.stopLoading(); web?.reload() } else { loading = false; failed = true }
            }
        }
    }
    LaunchedEffect(anim) { web?.evaluateJavascript(animJs(anim), null) }
    BackHandler(enabled = visible && canBack) { ClickSound.play(true); web?.goBack() }
    LaunchedEffect(searchReq) {
        val r = searchReq ?: return@LaunchedEffect
        val w = web ?: return@LaunchedEffect
        if (r.second == "!home") {
            val p0 = try { Uri.parse(w.url ?: "").path ?: "/" } catch (_: Exception) { "/" }
            if (p0 == "/" || (p0.length <= 3 && p0.startsWith("/"))) w.evaluateJavascript("window.scrollTo({top:0,behavior:'smooth'})", null)
            else softHome(w, siteUrl("/", lang))
            return@LaunchedEffect
        }
        if (r.second == "!fb") {
            kotlinx.coroutines.delay(300)
            w.evaluateJavascript("window.postMessage({centaurianFeedback:true},location.origin)", null)
            return@LaunchedEffect
        }
        val path = try { Uri.parse(w.url ?: "").path ?: "/" } catch (_: Exception) { "/" }
        val isHome = path == "/" || path.length <= 3 && path.startsWith("/")
        if (!isHome) {
            softHome(w, siteUrl("/", lang))
            kotlinx.coroutines.delay(2500)
        } else {
            kotlinx.coroutines.delay(300)
        }
        val q = org.json.JSONObject.quote(r.second)
        w.evaluateJavascript(
            "(function(q){window.scrollTo(0,0);var l=document.querySelectorAll('input');var i=null;" +
                "for(var k=0;k<l.length;k++){var t=l[k].type;if(t==='text'||t==='search'||!t){i=l[k];break;}}" +
                "if(!i)return;var set=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;" +
                "set.call(i,q);i.dispatchEvent(new Event('input',{bubbles:true}));i.focus();})($q)",
            null,
        )
    }
    Column(Modifier.fillMaxSize().background(BgDark)) {
        if (bareNow) Box(Modifier.fillMaxWidth().statusBarsPadding())
        else TopBar("Centaurian", { Icon(Icons.Default.Menu, contentDescription = "Menu", tint = TextMain) }, onMenu, onTitle = {
            val w = web
            val path = try { Uri.parse(w?.url ?: "").path ?: "/" } catch (_: Exception) { "/" }
            if (w != null) {
                if (path == "/" || (path.length <= 3 && path.startsWith("/"))) w.evaluateJavascript("window.scrollTo({top:0,behavior:'smooth'})", null)
                else softHome(w, siteUrl("/", lang))
            }
        })
        if (progress in 1..99) {
            LinearProgressIndicator(progress = { progress / 100f }, modifier = Modifier.fillMaxWidth().height(2.dp), color = Accent, trackColor = Color.Transparent)
        }
        Box(Modifier.fillMaxSize().navigationBarsPadding()) {
            run {
                AndroidView(
                    modifier = Modifier.fillMaxSize(),
                    factory = { c ->
                        KeepAliveWebView(c).apply {
                            layoutParams = ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
                            setBackgroundColor(android.graphics.Color.parseColor("#060203"))
                            settings.javaScriptEnabled = true
                            settings.domStorageEnabled = true
                            settings.allowFileAccess = false
                            settings.allowContentAccess = false
                            settings.javaScriptCanOpenWindowsAutomatically = false
                            settings.mediaPlaybackRequiresUserGesture = false
                            Offline.register(this)
                            CookieManager.getInstance().setAcceptCookie(true)
                            settings.setGeolocationEnabled(true)
                            webChromeClient = object : WebChromeClient() {
                                override fun onProgressChanged(view: WebView?, newProgress: Int) {
                                    progress = newProgress
                                }

                                override fun onGeolocationPermissionsShowPrompt(origin: String?, callback: GeolocationPermissions.Callback?) {
                                    homeActivity.withLocationPermission { callback?.invoke(origin, true, false) }
                                }
                            }
                            webViewClient = object : WebViewClient() {
                                override fun shouldInterceptRequest(view: WebView?, request: WebResourceRequest?): WebResourceResponse? {
                                    val r = request ?: return null
                                    return try { OfflineStore.serve(c, r) } catch (_: Exception) { null }
                                }

                                override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                                    val uri = request?.url ?: return false
                                    val host = uri.host ?: return false
                                    if (host == "centaurianspace.com" || host.endsWith(".centaurianspace.com")) return false
                                    try {
                                        c.startActivity(Intent(Intent.ACTION_VIEW, uri))
                                    } catch (_: Exception) {
                                    }
                                    return true
                                }

                                override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                                    failed = false
                                    loading = true
                                    view?.evaluateJavascript("try{localStorage.setItem('centaurian-lang','$langNow');}catch(e){}", null)
                                }

                                override fun doUpdateVisitedHistory(view: WebView?, url: String?, isReload: Boolean) {
                                    canBack = view?.canGoBack() == true
                                    val b = isBarePath(try { Uri.parse(url ?: "").path ?: "" } catch (_: Exception) { "" })
                                    bareNow = b
                                    onBare(b)
                                }

                                override fun onPageFinished(view: WebView?, url: String?) {
                                    view?.evaluateJavascript(homeJs(animNow), null)
                                    loading = false
                                }

                                override fun onRenderProcessGone(view: WebView?, detail: android.webkit.RenderProcessGoneDetail?): Boolean {
                                    MusicBridge.log("Home: render process gone" + (if (detail?.didCrash() == true) " (crash)" else " (vom System beendet)"))
                                    failed = true
                                    return true
                                }

                                override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                                    if (request?.isForMainFrame == true && !Offline.retryFromCache(view)) failed = true
                                }
                            }
                            visibility = android.view.View.VISIBLE
                            alpha = if (visible) 1f else 0f
                            MusicBridge.web = this
                            addJavascriptInterface(MusicBridge.Js(), "CenNative")
                            loadUrl(siteUrl("/", lang))
                            web = this
                        }
                    },
                    update = { v -> v.visibility = android.view.View.VISIBLE; v.alpha = if (visible) 1f else 0f },
                )
            }
            if (loading && !failed) LoadingCover(lang)
            if (failed) {
                Column(
                    Modifier.fillMaxSize().background(BgDark).padding(32.dp),
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    Text(if (de) "Keine Verbindung" else Tr.t(lang, "No connection"), color = TextMain, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Box(
                        Modifier.padding(top = 20.dp).clip(RoundedCornerShape(8.dp)).border(BorderStroke(1.dp, Accent), RoundedCornerShape(8.dp))
                            .clickable { failed = false; loading = true; attempt = 0; web?.reload() }.padding(horizontal = 22.dp, vertical = 10.dp),
                    ) { Text((if (de) "Erneut versuchen" else Tr.t(lang, "Retry")).uppercase(), color = Accent, fontSize = 12.sp, letterSpacing = 2.sp) }
                }
            }
        }
    }
}

// ---------------------------------------------------------------- Bausteine
@Composable
private fun LoadingCover(lang: String) {
    // Seitenwechsel: dünne Lichtlinie (Nutzerwunsch 28.10.2026); blendet erst nach ~0,1 s ein
    Box(Modifier.fillMaxSize().background(BgDark).pointerInput(Unit) { }) { LineLoader(Modifier.fillMaxSize()) }
}

@Composable
private fun TopBar(title: String, icon: @Composable () -> Unit, onIcon: () -> Unit, onTitle: (() -> Unit)? = null, back: Boolean = false) {
    Row(
        Modifier.fillMaxWidth().background(Color(0xB3030206)).statusBarsPadding().height(48.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(Modifier.size(48.dp).clickable(back = back) { onIcon() }, contentAlignment = Alignment.Center) { icon() }
        Text(
            title.uppercase(),
            color = TextMain,
            fontSize = 12.sp,
            fontFamily = Mono,
            fontWeight = FontWeight.Bold,
            letterSpacing = 3.sp,
            modifier = if (onTitle != null) Modifier.clickable { onTitle() }.padding(end = 16.dp, top = 12.dp, bottom = 12.dp) else Modifier,
        )
    }
    Box(Modifier.fillMaxWidth().height(1.dp).background(LineSoft))
}

@Composable
private fun NumberedCard(index: Int, title: String, desc: String, onClick: () -> Unit) {
    Row(
        Modifier
            .fillMaxWidth()
            .padding(horizontal = 14.dp, vertical = 3.dp)
            .glassBox()
            .clickable { onClick() }
            .padding(horizontal = 14.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text("%02d".format(index), color = Accent, fontSize = 10.sp, fontFamily = Mono, letterSpacing = 1.sp)
        Spacer(Modifier.size(12.dp))
        Column(Modifier.weight(1f)) {
            Text(title.uppercase(), color = TextMain, fontSize = 12.sp, fontFamily = Mono, fontWeight = FontWeight.Medium, letterSpacing = 2.sp)
            if (desc.isNotEmpty()) {
                Text(desc, color = TextMuted, fontSize = 11.sp, modifier = Modifier.padding(top = 2.dp))
            }
        }
        Text("›", color = Accent, fontSize = 18.sp)
    }
}

@Composable
private fun ToolTile(index: Int, title: String, modifier: Modifier, onClick: () -> Unit) {
    Column(
        modifier
            .glassBox()
            .clickable { onClick() }
            .padding(horizontal = 12.dp, vertical = 10.dp),
    ) {
        Text("%02d".format(index), color = Accent, fontSize = 9.sp, fontFamily = Mono)
        Text(title.uppercase(), color = TextMain, fontSize = 11.sp, fontFamily = Mono, letterSpacing = 1.sp, modifier = Modifier.padding(top = 3.dp), maxLines = 2)
    }
}

@Composable
private fun GroupTitle(text: String) {
    Row(Modifier.fillMaxWidth().padding(start = 18.dp, end = 18.dp, top = 12.dp, bottom = 4.dp), verticalAlignment = Alignment.CenterVertically) {
        Text(text.uppercase(), color = Accent, fontSize = 10.sp, fontFamily = Mono, letterSpacing = 3.sp)
        Spacer(Modifier.size(10.dp))
        Box(Modifier.weight(1f).height(1.dp).background(androidx.compose.ui.graphics.Brush.horizontalGradient(listOf(Accent.copy(alpha = 0.7f), Color(0x00FFFFFF)))))
    }
}

// ---------------------------------------------------------------- Start
@Composable
private fun HomeScreen(lang: String, onMenu: () -> Unit, onOpen: (Section) -> Unit) {
    val de = lang == "de"
    var query by remember { mutableStateOf("") }
    Box(Modifier.fillMaxSize()) {
    Column(Modifier.fillMaxSize()) {
        TopBar("Centaurian", { Icon(Icons.Default.Menu, contentDescription = "Menu", tint = TextMain) }, onMenu)
        LazyColumn(Modifier.fillMaxSize().navigationBarsPadding()) {
            item {
                Row(Modifier.fillMaxWidth().padding(horizontal = 18.dp, vertical = 12.dp), verticalAlignment = Alignment.CenterVertically) {
                    Image(painterResource(R.mipmap.ic_launcher_foreground), contentDescription = null, modifier = Modifier.size(64.dp))
                    Spacer(Modifier.size(10.dp))
                    Column {
                        Text("CENTAURIAN", color = TextMain, fontSize = 18.sp, fontFamily = Mono, fontWeight = FontWeight.Bold, letterSpacing = 5.sp)
                        Text(
                            if (de) "Universum & Weltgeschichte" else Tr.t(lang, "Universe & world history"),
                            color = TextMuted, fontSize = 11.sp, letterSpacing = 1.sp,
                            modifier = Modifier.padding(top = 3.dp),
                        )
                    }
                }
            }
            item { SearchBar(query, if (de) "Suchen…" else Tr.t(lang, "Search…"), { query = it }, Modifier.padding(horizontal = 14.dp, vertical = 4.dp)) }
            val ex = EXPLORE.filter { matches(it, query) }
            val tl = TOOLS.filter { matches(it, query) }
            if (ex.isEmpty() && tl.isEmpty()) {
                item { Text(if (de) "Nichts gefunden" else Tr.t(lang, "Nothing found"), color = TextMuted, fontSize = 12.sp, fontFamily = Mono, modifier = Modifier.padding(24.dp)) }
            }
            if (ex.isNotEmpty()) item { GroupTitle(if (de) "Entdecken" else Tr.t(lang, "Explore")) }
            items(ex.size) { i ->
                val s = ex[i]
                NumberedCard(EXPLORE.indexOf(s) + 1, if (de) s.de else s.en, if (de) s.descDe else s.descEn) { onOpen(s) }
            }
            if (tl.isNotEmpty()) item { GroupTitle(if (de) "Werkzeuge" else Tr.t(lang, "Tools")) }
            items(tl.chunked(2).size) { r ->
                val pair = tl.chunked(2)[r]
                Row(Modifier.fillMaxWidth().padding(horizontal = 14.dp, vertical = 3.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    pair.forEachIndexed { k, s ->
                        ToolTile(EXPLORE.size + TOOLS.indexOf(s) + 1, if (de) s.de else s.en, Modifier.weight(1f).height(64.dp)) { onOpen(s) }
                    }
                    if (pair.size == 1) Spacer(Modifier.weight(1f))
                }
            }
            item { Spacer(Modifier.height(20.dp)) }
        }
    }
    }
}

// ---------------------------------------------------------------- Menue
@Composable
private fun DrawerContent(
    lang: String,
    anim: Boolean,
    onHome: () -> Unit,
    onOpen: (Section) -> Unit,
    onTools: () -> Unit,
    onSettings: () -> Unit,
    onSiteSearch: (String) -> Unit,
    onFeedback: () -> Unit,
    onPrivacy: () -> Unit,
    onAbout: () -> Unit,
    active: Boolean = true,
) {
    val de = lang == "de"
    var q by remember { mutableStateOf("") }
    val inf = androidx.compose.animation.core.rememberInfiniteTransition(label = "menu")
    val pulse by inf.animateFloat(0f, 1f, androidx.compose.animation.core.infiniteRepeatable(androidx.compose.animation.core.tween(1800, easing = androidx.compose.animation.core.FastOutSlowInEasing), androidx.compose.animation.core.RepeatMode.Reverse), label = "pulse")
    Box(Modifier.fillMaxSize()) {
        if (anim) StarDust(active, Modifier.fillMaxSize())
        Column(Modifier.fillMaxSize().statusBarsPadding().navigationBarsPadding().verticalScroll(rememberScrollState()).padding(bottom = 12.dp)) {
            Row(Modifier.fillMaxWidth().clickable { onHome() }.padding(horizontal = 18.dp, vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                Box(
                    Modifier.size(38.dp).drawBehind {
                        drawCircle(Accent.copy(alpha = 0.10f + 0.22f * pulse), radius = size.minDimension / 2f * (0.85f + 0.2f * pulse))
                    },
                    contentAlignment = Alignment.Center,
                ) { Image(painterResource(R.mipmap.ic_launcher_foreground), contentDescription = null, modifier = Modifier.size(32.dp)) }
                Spacer(Modifier.size(8.dp))
                Column {
                    Text("CENTAURIAN", color = TextMain, fontSize = 13.sp, fontWeight = FontWeight.Bold, letterSpacing = 5.sp)
                }
            }
            SearchBar(q, if (de) "Planeten, Songs, Reiche…" else Tr.t(lang, "Planets, songs, empires…"), { q = it }, Modifier.padding(horizontal = 14.dp, vertical = 2.dp), onSearch = { onSiteSearch(it) })
            if (q.isNotBlank()) {
                DrawerRow("⌕", (if (de) "„" else Tr.t(lang, "\"")) + q.trim() + (if (de) "“ auf der Webseite suchen" else Tr.t(lang, "\" – search everything")), false) { onSiteSearch(q.trim()) }
            }
            val groups = listOf(
                (if (de) "Universum & Himmel" else Tr.t(lang, "Universe & sky")) to UNI,
                (if (de) "Geschichte" else Tr.t(lang, "History")) to HISTORY,
                "News" to NEWS,
            )
            val all = UNI + HISTORY + NEWS
            var openGroup by remember { mutableStateOf<String?>(null) }
            Spacer(Modifier.height(6.dp))
            groups.forEach { (title, list) ->
                val f = list.filter { matches(it, q) }
                if (f.isNotEmpty()) {
                    val isOpen = q.isNotBlank() || openGroup == title
                    Row(
                        Modifier.fillMaxWidth().padding(horizontal = 14.dp, vertical = 2.dp).clip(RoundedCornerShape(10.dp))
                            .background(androidx.compose.ui.graphics.Brush.horizontalGradient(if (isOpen) listOf(Color(0x44FF5A4D), Color(0x0FFF5A4D)) else listOf(Color(0x1AFFFFFF), Color(0x05FFFFFF))))
                            .border(BorderStroke(1.dp, if (isOpen) Accent.copy(alpha = 0.35f + 0.45f * pulse) else LineSoft), RoundedCornerShape(10.dp))
                            .clickable(back = isOpen) { if (q.isBlank()) openGroup = if (isOpen) null else title }
                            .padding(horizontal = 14.dp, vertical = 11.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text(title.uppercase(), color = if (isOpen) Color.White else TextMain, fontSize = 11.sp, fontFamily = Mono, letterSpacing = 2.sp, fontWeight = FontWeight.Medium, modifier = Modifier.weight(1f))
                        Text("${f.size}", color = TextMuted, fontSize = 10.sp, fontFamily = Mono)
                        Spacer(Modifier.size(10.dp))
                        Text(if (isOpen) "–" else "+", color = Accent, fontSize = 15.sp, fontFamily = Mono)
                    }
                    androidx.compose.animation.AnimatedVisibility(
                        visible = isOpen,
                        enter = androidx.compose.animation.expandVertically() + androidx.compose.animation.fadeIn(),
                        exit = androidx.compose.animation.shrinkVertically() + androidx.compose.animation.fadeOut(),
                    ) {
                        Column {
                            f.forEach { sec -> DrawerRow("%02d".format(all.indexOf(sec) + 1), if (de) sec.de else sec.en, false) { onOpen(sec) } }
                            Spacer(Modifier.height(4.dp))
                        }
                    }
                }
            }
            if (q.isBlank()) {
                Spacer(Modifier.height(10.dp))
                Row(
                    Modifier.fillMaxWidth().padding(horizontal = 14.dp, vertical = 2.dp).glassBox().clickable { onFeedback() }.padding(horizontal = 14.dp, vertical = 11.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Text("✉", color = Accent, fontSize = 14.sp)
                    Spacer(Modifier.size(12.dp))
                    Text("FEEDBACK", color = TextMain, fontSize = 11.sp, fontFamily = Mono, letterSpacing = 3.sp, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f))
                    Text("›", color = Accent, fontSize = 16.sp)
                }
                Row(Modifier.fillMaxWidth().padding(horizontal = 14.dp, vertical = 6.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    listOf(
                        Triple("§", if (de) "Datenschutz" else Tr.t(lang, "Privacy"), onPrivacy),
                        Triple("i", if (de) "Infos" else Tr.t(lang, "About"), onAbout),
                        Triple("⚙", if (de) "Einstellungen" else Tr.t(lang, "Settings"), onSettings),
                    ).forEach { (ic, label, act) ->
                        Column(
                            Modifier.weight(1f).clip(RoundedCornerShape(10.dp)).background(Color(0x0DFFFFFF))
                                .border(BorderStroke(1.dp, LineSoft), RoundedCornerShape(10.dp)).clickable { act() }.padding(vertical = 10.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                        ) {
                            Text(ic, color = Accent, fontSize = 15.sp)
                            Text(label.uppercase(), color = TextMuted, fontSize = 8.sp, fontFamily = Mono, letterSpacing = 1.sp, maxLines = 1, modifier = Modifier.padding(top = 3.dp))
                        }
                    }
                }
            }
        }
    }
}

/** Funkelnde Sterne und wenige Staubkoernchen, die treiben und kurz aufleuchten. Laeuft nur bei offenem Menue, ca. 30 Bilder pro Sekunde. */
@Composable
private fun StarDust(active: Boolean, modifier: Modifier = Modifier) {
    val stars = remember {
        val r = java.util.Random(7)
        List(70) { floatArrayOf(r.nextFloat(), r.nextFloat(), 0.3f + r.nextFloat() * r.nextFloat() * 0.7f, r.nextFloat() * 6.28f, 0.5f + r.nextFloat() * 1.8f, r.nextFloat()) }
    }
    val dust = remember {
        val r = java.util.Random(9)
        List(12) { floatArrayOf(r.nextFloat(), r.nextFloat(), (r.nextFloat() - 0.5f) * 0.02f, 0.004f + r.nextFloat() * 0.012f, 0.5f + r.nextFloat() * 0.5f, r.nextFloat() * 6.28f, 3f + r.nextFloat() * 4f) }
    }
    var t by remember { mutableStateOf(0f) }
    LaunchedEffect(active) {
        if (!active) return@LaunchedEffect
        var last = 0L
        while (true) {
            androidx.compose.runtime.withFrameNanos { n ->
                if (last == 0L) last = n
                else if (n - last >= 33_000_000L) { t += (n - last) / 1_000_000_000f; last = n }
            }
        }
    }
    Canvas(modifier) {
        val w = size.width
        val h = size.height
        val d = density
        for (s in stars) {
            val k = 0.5f + 0.5f * kotlin.math.sin(t * s[4] + s[3])
            val a = (0.10f + 0.80f * k * k) * (0.5f + 0.5f * s[2] / 1.0f).coerceAtMost(1f)
            val tint = if (s[5] < 0.25f) Color(0xFFCFE0FF) else if (s[5] > 0.8f) Color(0xFFFFE2CF) else Color.White
            drawCircle(tint.copy(alpha = a), radius = s[2] * d, center = Offset(s[0] * w, s[1] * h))
        }
        for (p in dust) {
            val x = ((((p[0] + p[2] * t) % 1f) + 1f) % 1f) * w
            val y = ((((p[1] + p[3] * t) % 1f) + 1f) % 1f) * h
            val f = kotlin.math.sin(t * 6.283f / p[6] + p[5]).coerceAtLeast(0f).let { it * it * it * it * it * it }
            drawCircle(Color(0xFFFFD9CC).copy(alpha = 0.22f + 0.78f * f), radius = p[4] * d * (1f + 0.5f * f), center = Offset(x, y))
        }
    }
}

@Composable
private fun DrawerRow(tag: String, title: String, active: Boolean, onClick: () -> Unit) {
    val src = remember { androidx.compose.foundation.interaction.MutableInteractionSource() }
    val pressed by src.collectIsPressedAsState()
    Row(
        Modifier
            .fillMaxWidth()
            .padding(horizontal = 14.dp, vertical = 1.dp)
            .clip(RoundedCornerShape(8.dp))
            .background(if (pressed) Color(0x33FF5A4D) else Color.Transparent)
            .clickable(interactionSource = src, indication = null) { onClick() }
            .padding(horizontal = 12.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(Modifier.width(3.dp).height(if (pressed) 20.dp else 14.dp).background(if (active || pressed) Accent else Accent.copy(alpha = 0.35f)))
        Spacer(Modifier.size(8.dp))
        Text(tag, color = Accent, fontSize = 10.sp, fontFamily = Mono, modifier = Modifier.width(24.dp))
        Text(title.uppercase(), color = if (active) Color.White else TextMain, fontSize = 12.sp, fontFamily = Mono, letterSpacing = 2.sp, fontWeight = if (active) FontWeight.Bold else FontWeight.Normal)
    }
}

// ---------------------------------------------------------------- Web-Ansicht
@SuppressLint("SetJavaScriptEnabled")
@Composable
private fun WebScreen(s: Screen.Web, lang: String, anim: Boolean, onBare: (Boolean) -> Unit, onHome: () -> Unit, onBack: () -> Unit) {
    val ctx = LocalContext.current
    val activity = ctx as MainActivity
    val skyPage = BARE_ALL.any { s.path.startsWith(it) }
    androidx.compose.runtime.DisposableEffect(skyPage) { ClickSound.muted = skyPage; onDispose { ClickSound.muted = false } }
    var progress by remember { mutableStateOf(0) }
    var failed by remember { mutableStateOf(false) }
    var web by remember { mutableStateOf<WebView?>(null) }
    var canGoBack by remember { mutableStateOf(false) }
    var loading by remember { mutableStateOf(true) }
    var attempt by remember { mutableStateOf(0) }
    val de = lang == "de"
    LaunchedEffect(loading, attempt) {
        if (loading) {
            kotlinx.coroutines.delay(15000)
            if (loading) {
                if (attempt == 0) { attempt = 1; web?.stopLoading(); web?.reload() } else { loading = false; failed = true }
            }
        }
    }

    BackHandler(enabled = true) {
        ClickSound.play(true)
        val w = web
        if (w != null && w.canGoBack()) w.goBack() else onBack()
    }

    var bareNow by remember { mutableStateOf(s.path in BARE) }
    val bare = bareNow
    LaunchedEffect(bare) { onBare(bare) }
    androidx.compose.runtime.DisposableEffect(Unit) { onDispose { onBare(false) } }
    Column(Modifier.fillMaxSize().background(BgDark)) {
        if (bare) {
            Box(Modifier.fillMaxWidth().statusBarsPadding())
        } else {
            TopBar(s.title, { Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = TextMain) }, {
                val w = web
                if (w != null && w.canGoBack()) w.goBack() else onBack()
            }, onTitle = onHome, back = true)
        }
        if (progress in 1..99) {
            LinearProgressIndicator(progress = { progress / 100f }, modifier = Modifier.fillMaxWidth().height(2.dp), color = Accent, trackColor = Color.Transparent)
        }
        Box(Modifier.fillMaxSize().navigationBarsPadding()) {
            AndroidView(
                modifier = Modifier.fillMaxSize(),
                factory = { c ->
                    WebView(c).apply {
                        layoutParams = ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
                        setBackgroundColor(android.graphics.Color.parseColor("#060203"))
                        settings.javaScriptEnabled = true
                        settings.domStorageEnabled = true
                            settings.allowFileAccess = false
                            settings.allowContentAccess = false
                            settings.javaScriptCanOpenWindowsAutomatically = false
                        settings.mediaPlaybackRequiresUserGesture = false
                        Offline.register(this)
                        settings.setGeolocationEnabled(true)
                        CookieManager.getInstance().setAcceptCookie(true)
                        webChromeClient = object : WebChromeClient() {
                            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                                progress = newProgress
                            }

                            override fun onGeolocationPermissionsShowPrompt(origin: String?, callback: GeolocationPermissions.Callback?) {
                                activity.withLocationPermission { callback?.invoke(origin, true, false) }
                            }
                        }
                        webViewClient = object : WebViewClient() {
                            override fun shouldInterceptRequest(view: WebView?, request: WebResourceRequest?): WebResourceResponse? {
                                val r = request ?: return null
                                return try { OfflineStore.serve(c, r) } catch (_: Exception) { null }
                            }

                            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                                val uri = request?.url ?: return false
                                val host = uri.host ?: return false
                                if (host == "centaurianspace.com" || host.endsWith(".centaurianspace.com")) return false
                                try {
                                    c.startActivity(Intent(Intent.ACTION_VIEW, uri))
                                } catch (_: Exception) {
                                }
                                return true
                            }

                            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                                failed = false
                                loading = true
                            }

                            override fun doUpdateVisitedHistory(view: WebView?, url: String?, isReload: Boolean) {
                                canGoBack = view?.canGoBack() == true
                                bareNow = isBarePath(try { Uri.parse(url ?: "").path ?: "" } catch (_: Exception) { "" })
                            }

                            override fun onPageFinished(view: WebView?, url: String?) {
                                canGoBack = view?.canGoBack() == true
                                loading = false
                                view?.evaluateJavascript(
                                    "try{localStorage.setItem('centaurian-lang','$lang');localStorage.setItem('cn_app_mode','1');}catch(e){}",
                                    null,
                                )
                                view?.evaluateJavascript(nativeJs(s.path == "/universum", anim), null)
                                view?.evaluateJavascript("if(!window.__cenDuck){window.__cenDuck=1;setInterval(function(){try{window.__cenPlaying=CenNative.want();}catch(e){}},500);}", null)
                                val js = s.afterJs
                                if (js != null) {
                                    Handler(Looper.getMainLooper()).postDelayed({ view?.evaluateJavascript(js, null) }, 1500)
                                }
                            }

                            override fun onRenderProcessGone(view: WebView?, detail: android.webkit.RenderProcessGoneDetail?): Boolean {
                                MusicBridge.log("Page: render process gone" + (if (detail?.didCrash() == true) " (crash)" else " (vom System beendet)"))
                                failed = true
                                return true
                            }

                            override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                                if (request?.isForMainFrame == true && !Offline.retryFromCache(view)) failed = true
                            }
                        }
                        addJavascriptInterface(MusicBridge.Js(), "CenNative")
                        MusicBridge.log("Page opened: " + s.path)
                        loadUrl(siteUrl(s.path, lang))
                        web = this
                    }
                },
                onRelease = { v -> MusicBridge.log("Page closed"); try { v.stopLoading(); v.loadUrl("about:blank"); v.destroy() } catch (_: Exception) { } },
            )
            if (loading && !failed) LoadingCover(lang)
            if (failed) {
                Column(
                    Modifier.fillMaxSize().background(BgDark).padding(32.dp),
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    Text(if (de) "Keine Verbindung" else Tr.t(lang, "No connection"), color = TextMain, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Text(
                        if (de) "Bitte Internet prüfen und erneut versuchen." else Tr.t(lang, "Please check your internet and try again."),
                        color = TextMuted, fontSize = 13.sp, textAlign = TextAlign.Center, modifier = Modifier.padding(top = 8.dp, bottom = 20.dp),
                    )
                    Box(
                        Modifier.clip(RoundedCornerShape(8.dp)).border(BorderStroke(1.dp, Accent), RoundedCornerShape(8.dp))
                            .clickable { failed = false; web?.reload() }.padding(horizontal = 22.dp, vertical = 10.dp),
                    ) { Text((if (de) "Erneut versuchen" else Tr.t(lang, "Retry")).uppercase(), color = Accent, fontSize = 12.sp, letterSpacing = 2.sp) }
                }
            }
        }
    }
}

private fun aboutTitle(de: Boolean, lang: String) = if (de) "Über Centaurian" else Tr.t(lang, "About Centaurian")

private fun aboutBody(lang: String): String = Tr.about(lang)

// ---------------------------------------------------------------- Einstellungen
@Composable
private fun SettingsRow(title: String, sub: String = "", trailing: String = "›", onClick: (() -> Unit)? = null) {
    Row(
        Modifier.fillMaxWidth().then(if (onClick != null) Modifier.clickable { onClick() } else Modifier).padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(Modifier.weight(1f)) {
            Text(title, color = TextMain, fontSize = 14.sp)
            if (sub.isNotEmpty()) Text(sub, color = TextMuted, fontSize = 11.sp, modifier = Modifier.padding(top = 2.dp))
        }
        Text(trailing, color = if (trailing == "›" || trailing == "↗") Accent else TextMuted, fontSize = 16.sp)
    }
}

@Composable
private fun Card(content: @Composable () -> Unit) {
    Column(
        Modifier.fillMaxWidth().padding(horizontal = 14.dp)
            .glassBox(),
    ) { content() }
}

@Composable
private fun SetIcon(kind: String, sz: androidx.compose.ui.unit.Dp = 22.dp) {
    androidx.compose.foundation.Canvas(Modifier.size(sz)) {
        val w = size.width
        val h = size.height
        val sw = 1.8.dp.toPx()
        val st = androidx.compose.ui.graphics.drawscope.Stroke(width = sw, cap = androidx.compose.ui.graphics.StrokeCap.Round, join = androidx.compose.ui.graphics.StrokeJoin.Round)
        val c = Accent
        fun o(x: Float, y: Float) = androidx.compose.ui.geometry.Offset(x * w, y * h)
        fun line(x1: Float, y1: Float, x2: Float, y2: Float) = drawLine(c, o(x1, y1), o(x2, y2), sw, androidx.compose.ui.graphics.StrokeCap.Round)
        fun poly(close: Boolean, vararg p: Float) {
            val path = androidx.compose.ui.graphics.Path()
            path.moveTo(p[0] * w, p[1] * h)
            var i = 2
            while (i < p.size) { path.lineTo(p[i] * w, p[i + 1] * h); i += 2 }
            if (close) path.close()
            drawPath(path, c, style = st)
        }
        fun box(x1: Float, y1: Float, x2: Float, y2: Float, r: Float) =
            drawRoundRect(c, o(x1, y1), androidx.compose.ui.geometry.Size((x2 - x1) * w, (y2 - y1) * h), androidx.compose.ui.geometry.CornerRadius(r * w, r * w), style = st)
        when (kind) {
            "lang" -> {
                drawCircle(c, radius = 0.42f * w, center = o(0.5f, 0.5f), style = st)
                drawOval(c, o(0.32f, 0.08f), androidx.compose.ui.geometry.Size(0.36f * w, 0.84f * h), style = st)
                line(0.08f, 0.5f, 0.92f, 0.5f)
            }
            "screen" -> { box(0.1f, 0.16f, 0.9f, 0.68f, 0.08f); line(0.5f, 0.68f, 0.5f, 0.84f); line(0.3f, 0.86f, 0.7f, 0.86f) }
            "update" -> { line(0.5f, 0.1f, 0.5f, 0.62f); poly(false, 0.3f, 0.44f, 0.5f, 0.64f, 0.7f, 0.44f); poly(false, 0.14f, 0.72f, 0.14f, 0.9f, 0.86f, 0.9f, 0.86f, 0.72f) }
            "share" -> {
                drawCircle(c, 0.11f * w, o(0.24f, 0.5f), style = st); drawCircle(c, 0.11f * w, o(0.76f, 0.2f), style = st); drawCircle(c, 0.11f * w, o(0.76f, 0.8f), style = st)
                line(0.34f, 0.45f, 0.66f, 0.25f); line(0.34f, 0.55f, 0.66f, 0.75f)
            }
            "clean" -> poly(true, 0.5f, 0.08f, 0.6f, 0.4f, 0.92f, 0.5f, 0.6f, 0.6f, 0.5f, 0.92f, 0.4f, 0.6f, 0.08f, 0.5f, 0.4f, 0.4f)
            "lock" -> {
                box(0.2f, 0.46f, 0.8f, 0.88f, 0.08f)
                drawArc(c, 180f, 180f, false, o(0.32f, 0.12f), androidx.compose.ui.geometry.Size(0.36f * w, 0.4f * h), style = st)
                line(0.32f, 0.32f, 0.32f, 0.46f); line(0.68f, 0.32f, 0.68f, 0.46f)
                drawCircle(c, 0.04f * w, o(0.5f, 0.66f))
            }
            "chat" -> { box(0.1f, 0.14f, 0.9f, 0.68f, 0.14f); poly(false, 0.3f, 0.68f, 0.26f, 0.88f, 0.52f, 0.68f); drawCircle(c, 0.035f * w, o(0.32f, 0.41f)); drawCircle(c, 0.035f * w, o(0.5f, 0.41f)); drawCircle(c, 0.035f * w, o(0.68f, 0.41f)) }
            "info" -> { drawCircle(c, 0.42f * w, o(0.5f, 0.5f), style = st); line(0.5f, 0.46f, 0.5f, 0.72f); drawCircle(c, 0.04f * w, o(0.5f, 0.3f)) }
            "plane" -> { poly(true, 0.1f, 0.46f, 0.9f, 0.12f, 0.62f, 0.88f, 0.46f, 0.58f); line(0.46f, 0.58f, 0.9f, 0.12f) }
            "x" -> { line(0.2f, 0.2f, 0.8f, 0.8f); line(0.8f, 0.2f, 0.2f, 0.8f) }
            "shield" -> { poly(true, 0.5f, 0.08f, 0.86f, 0.22f, 0.84f, 0.52f, 0.5f, 0.92f, 0.16f, 0.52f, 0.14f, 0.22f); poly(false, 0.34f, 0.5f, 0.46f, 0.62f, 0.68f, 0.38f) }
            "layers" -> { poly(true, 0.5f, 0.1f, 0.9f, 0.3f, 0.5f, 0.5f, 0.1f, 0.3f); poly(false, 0.1f, 0.5f, 0.5f, 0.7f, 0.9f, 0.5f); poly(false, 0.1f, 0.7f, 0.5f, 0.9f, 0.9f, 0.7f) }
            "sound" -> {
                poly(true, 0.12f, 0.4f, 0.3f, 0.4f, 0.52f, 0.2f, 0.52f, 0.8f, 0.3f, 0.6f, 0.12f, 0.6f)
                drawArc(c, -45f, 90f, false, o(0.34f, 0.3f), androidx.compose.ui.geometry.Size(0.4f * w, 0.4f * h), style = st)
                drawArc(c, -45f, 90f, false, o(0.22f, 0.12f), androidx.compose.ui.geometry.Size(0.64f * w, 0.76f * h), style = st)
            }
            else -> drawCircle(c, 0.3f * w, o(0.5f, 0.5f), style = st)
        }
    }
}

@Composable
private fun SetGroup(content: @Composable () -> Unit) {
    Column(
        Modifier.fillMaxWidth().padding(horizontal = 14.dp, vertical = 3.dp)
            .clip(RoundedCornerShape(14.dp))
            .background(androidx.compose.ui.graphics.Brush.linearGradient(listOf(Color(0x1FFF5A4D), Color(0x0DFFFFFF))))
            .border(BorderStroke(1.dp, Accent.copy(alpha = 0.28f)), RoundedCornerShape(14.dp)),
    ) { content() }
}

@Composable
private fun SetCard(
    icon: String,
    title: String,
    sub: String = "",
    onClick: (() -> Unit)? = null,
    trailing: @Composable () -> Unit = { Text("›", color = Accent, fontSize = 20.sp) },
    extra: (@Composable () -> Unit)? = null,
    first: Boolean = false,
    closing: Boolean = false,
) {
    Column(Modifier.fillMaxWidth()) {
        if (!first) Box(Modifier.fillMaxWidth().padding(start = 56.dp).height(1.dp).background(Accent.copy(alpha = 0.14f)))
        Row(
            Modifier.fillMaxWidth().then(if (onClick != null) Modifier.clickable(back = closing) { onClick() } else Modifier).padding(horizontal = 12.dp, vertical = 9.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(
                Modifier.size(32.dp).clip(RoundedCornerShape(10.dp)).background(Accent.copy(alpha = 0.16f))
                    .border(BorderStroke(1.dp, Accent.copy(alpha = 0.4f)), RoundedCornerShape(10.dp)),
                contentAlignment = Alignment.Center,
            ) { SetIcon(icon, 18.dp) }
            Spacer(Modifier.size(12.dp))
            Column(Modifier.weight(1f)) {
                Text(title, color = TextMain, fontSize = 14.sp, fontWeight = FontWeight.Medium)
                if (sub.isNotEmpty()) Text(sub, color = TextMuted, fontSize = 11.sp, lineHeight = 15.sp, modifier = Modifier.padding(top = 1.dp))
            }
            trailing()
        }
        extra?.invoke()
    }
}

@Composable
private fun SetSwitch(on: Boolean) {
    Box(
        Modifier.width(46.dp).height(26.dp).clip(RoundedCornerShape(50))
            .background(if (on) Accent else Color(0x33FFFFFF)).padding(3.dp),
        contentAlignment = if (on) Alignment.CenterEnd else Alignment.CenterStart,
    ) { Box(Modifier.size(20.dp).clip(RoundedCornerShape(50)).background(Color.White)) }
}

@Composable
private fun SettingsScreen(lang: String, anim: Boolean, onBack: () -> Unit, onLang: (String) -> Unit, onAnim: (Boolean) -> Unit, onFeedback: () -> Unit, onOpen: (Screen) -> Unit) {
    val ctx = LocalContext.current
    val de = lang == "de"
    var langOpen by remember { mutableStateOf(false) }
    val prefs = remember { ctx.getSharedPreferences("cn", Context.MODE_PRIVATE) }
    var keepOn by remember { mutableStateOf(prefs.getBoolean("keepon", false)) }
    var bassOn by remember { mutableStateOf(prefs.getBoolean("bass", true)) }
    var clickOn by remember { mutableStateOf(prefs.getBoolean("click", false)) }
    val cur = LANGS.first { it.code == lang }
    val version = try { ctx.packageManager.getPackageInfo(ctx.packageName, 0).versionName ?: "" } catch (_: Exception) { "" }

    fun open(url: String) {
        try { ctx.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url))) } catch (_: Exception) { }
    }

    Box(Modifier.fillMaxSize().background(BgDark)) {
    Column(Modifier.fillMaxSize()) {
        TopBar(if (de) "Einstellungen" else Tr.t(lang, "Settings"), { Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = TextMain) }, onBack, back = true)
        Column(Modifier.fillMaxSize().navigationBarsPadding().verticalScroll(rememberScrollState())) {
            Row(Modifier.fillMaxWidth().padding(horizontal = 18.dp, vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                Image(painterResource(R.mipmap.ic_launcher_foreground), contentDescription = null, modifier = Modifier.size(44.dp))
                Spacer(Modifier.size(10.dp))
                Column {
                    Text("CENTAURIAN", color = TextMain, fontSize = 16.sp, fontFamily = Mono, fontWeight = FontWeight.Bold, letterSpacing = 4.sp)
                    Text("Version $version", color = TextMuted, fontSize = 11.sp, fontFamily = Mono, modifier = Modifier.padding(top = 3.dp))
                }
            }

            GroupTitle(if (de) "Darstellung & Sprache" else Tr.t(lang, "Appearance & language"))
            SetGroup {
                SetCard(
                    "lang", if (de) "Sprache" else Tr.t(lang, "Language"), cur.name,
                    onClick = { langOpen = !langOpen },
                closing = langOpen,
                    trailing = { Text(if (langOpen) "−" else "+", color = Accent, fontSize = 20.sp) },
                    extra = if (langOpen) ({
                        Column(Modifier.padding(start = 10.dp, end = 10.dp, bottom = 12.dp)) {
                            LANGS.chunked(3).forEach { rowItems ->
                                Row(Modifier.fillMaxWidth().padding(vertical = 3.dp), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                    rowItems.forEach { l ->
                                        Box(
                                            Modifier.weight(1f).clip(RoundedCornerShape(10.dp))
                                                .background(if (l.code == lang) Accent.copy(alpha = 0.22f) else Color.Transparent)
                                                .border(BorderStroke(1.dp, if (l.code == lang) Accent else LineSoft), RoundedCornerShape(10.dp))
                                                .clickable { onLang(l.code); langOpen = false }.padding(vertical = 9.dp),
                                            contentAlignment = Alignment.Center,
                                        ) { Text(l.name, color = if (l.code == lang) Color.White else TextMuted, fontSize = 11.sp, maxLines = 1) }
                                    }
                                    repeat(3 - rowItems.size) { Spacer(Modifier.weight(1f)) }
                                }
                            }
                        }
                    }) else null,
                    first = true,
                )
                SetCard(
                    "screen", if (de) "Akkusparmodus" else Tr.t(lang, "Battery saver"),
                    if (de) "Keine Partikel, überall einfacher schwarzer Hintergrund" else Tr.t(lang, "No particles, plain black background everywhere"),
                    onClick = { onAnim(!anim) },
                    trailing = { SetSwitch(!anim) },
                )
                SetCard(
                    "sound", if (de) "Klick-Sound" else Tr.t(lang, "Click sound"),
                    if (de) "Kurzer Signalton bei Antippen (nicht im Sternenhimmel)" else Tr.t(lang, "Short signal sound on taps (not in the night sky)"),
                    onClick = {
                        clickOn = !clickOn
                        prefs.edit().putBoolean("click", clickOn).apply()
                        ClickSound.enabled = clickOn
                    if (clickOn) ClickSound.play()
                    },
                    trailing = { SetSwitch(clickOn) },
                )
            }
            GroupTitle(if (de) "Wiedergabe" else Tr.t(lang, "Playback"))
            SetGroup {
                SetCard(
                    "screen", if (de) "Bildschirm anlassen" else Tr.t(lang, "Keep screen on"),
                    if (de) "Display geht in der App nicht aus" else Tr.t(lang, "The display stays on while the app is open"),
                    onClick = {
                        keepOn = !keepOn
                        prefs.edit().putBoolean("keepon", keepOn).apply()
                        (ctx as? MainActivity)?.setKeepOn(keepOn)
                    },
                    trailing = { SetSwitch(keepOn) },
                    first = true,
                )
                SetCard(
                    "screen", if (de) "Bass-Reaktion im Cover" else Tr.t(lang, "Bass reaction in cover"),
                    if (de) "Partikel reagieren auf die Musik (braucht Audio-Erlaubnis, nimmt nichts auf)" else Tr.t(lang, "Particles react to the music (needs audio permission, records nothing)"),
                    onClick = {
                        val on = !(bassOn && (ctx as? MainActivity)?.micGranted?.value == true)
                        bassOn = on
                        prefs.edit().putBoolean("bass", on).apply()
                        if (on) (ctx as? MainActivity)?.askMic()
                        if (!on) MusicBridge.vizSync(false)
                    },
                    trailing = { SetSwitch(bassOn && (ctx as? MainActivity)?.micGranted?.value == true) },
                )
            }
            GroupTitle(if (de) "Daten & Speicher" else Tr.t(lang, "Data & storage"))
            SetGroup {
                run {
                    val offBusy = OfflineStore.busy
                    var offWifi by remember { mutableStateOf(prefs.getBoolean("off_wifi", true)) }
                    val mb = "%.1f MB".format(OfflineStore.bytes / 1048576.0)
                    val sub = when {
                        offBusy -> (if (de) "Lädt" else Tr.t(lang, "Downloading")) + " … ${OfflineStore.pct}%"
                        OfflineStore.failed -> if (de) "Fehlgeschlagen, tippen für neuen Versuch" else Tr.t(lang, "Failed, tap to retry")
                        OfflineStore.ready -> (if (de) "Bereit" else Tr.t(lang, "Ready")) + " · $mb · v${prefs.getInt("off_pack", 1)}" + (prefs.getInt("off_miss", 0).let { if (it > 0) " · ⚠$it" else "" })
                        else -> if (de) "Sternenhimmel funktioniert ohne Internet" else Tr.t(lang, "Night sky works without internet")
                    }
                    SetCard(
                        "info", if (de) "Offline-Inhalte" else Tr.t(lang, "Offline content"), sub,
                        onClick = {
                            if (!offBusy && !OfflineStore.ready) {
                                if (!Offline.online) {
                                    Toast.makeText(ctx, if (de) "Kein Internet" else Tr.t(lang, "No connection"), Toast.LENGTH_SHORT).show()
                                } else if (offWifi && !OfflineStore.isUnmetered(ctx)) {
                                    Toast.makeText(ctx, if (de) "Erst mit WLAN verbinden oder „Nur WLAN“ ausschalten" else Tr.t(lang, "Connect to Wi-Fi first, or switch off Wi-Fi only"), Toast.LENGTH_LONG).show()
                                } else {
                                    OfflineStore.update(ctx, offlinePages(lang)) { ok ->
                                        if (ok) Toast.makeText(ctx, if (de) "Offline-Inhalte bereit" else Tr.t(lang, "Offline content is ready"), Toast.LENGTH_SHORT).show()
                                    }
                                }
                            }
                        },
                        trailing = { if (offBusy) CircularProgressIndicator(Modifier.size(20.dp), color = Accent, strokeWidth = 2.dp) else Text(if (OfflineStore.ready) "✓" else "↓", color = Accent, fontSize = 20.sp) },
                        extra = {
                            Row(Modifier.fillMaxWidth().padding(start = 14.dp, end = 14.dp, bottom = 12.dp), verticalAlignment = Alignment.CenterVertically) {
                                Row(Modifier.weight(1f).clickable { offWifi = !offWifi; prefs.edit().putBoolean("off_wifi", offWifi).apply() }, verticalAlignment = Alignment.CenterVertically) {
                                    SetSwitch(offWifi)
                                    Spacer(Modifier.size(8.dp))
                                    Text(if (de) "Nur WLAN" else Tr.t(lang, "Wi-Fi only"), color = TextMuted, fontSize = 12.sp)
                                }
                                if (OfflineStore.ready && !offBusy) {
                                    Text(if (de) "Löschen" else Tr.t(lang, "Delete"), color = Accent, fontSize = 13.sp, modifier = Modifier.clickable { OfflineStore.delete(ctx) }.padding(8.dp))
                                }
                            }
                        },
                        first = true,
                    )
                }
                SetCard(
                    "clean", if (de) "Zwischenspeicher leeren" else Tr.t(lang, "Clear cache"),
                    if (de) "Gespeicherte Daten der Ansichten löschen" else Tr.t(lang, "Delete saved data of the views"),
                    onClick = {
                        try { WebView(ctx).apply { clearCache(true); destroy() } } catch (_: Exception) { }
                        Toast.makeText(ctx, if (de) "Gelöscht" else Tr.t(lang, "Cleared"), Toast.LENGTH_SHORT).show()
                    },
                )
            }
            GroupTitle("App")
            SetGroup {
                SetCard(
                    "update", if (de) "Nach Updates suchen" else Tr.t(lang, "Check for updates"),
                    when (Updater.msg) {
                        "…" -> if (de) "Suche läuft …" else Tr.t(lang, "Checking …")
                        "ok" -> if (de) "Du hast die neueste Version" else Tr.t(lang, "You have the latest version")
                        "?" -> if (de) "Keine Verbindung" else Tr.t(lang, "No connection")
                        else -> "Version $version"
                    },
                    onClick = { Updater.check(ctx, true) },
                    first = true,
                )
                SetCard(
                    "share", if (de) "App teilen" else Tr.t(lang, "Share app"), if (de) "Link an Freunde schicken" else Tr.t(lang, "Send the link to friends"),
                    onClick = {
                        val i = Intent(Intent.ACTION_SEND).apply { type = "text/plain"; putExtra(Intent.EXTRA_TEXT, BASE) }
                        ctx.startActivity(Intent.createChooser(i, "Centaurian"))
                    },
                    trailing = { Text("↗", color = Accent, fontSize = 18.sp) },
                )
                SetCard(
                    "lock", if (de) "Berechtigungen" else Tr.t(lang, "Permissions"),
                    if (de) "Standort & Benachrichtigungen in Android" else Tr.t(lang, "Location and notifications in Android"),
                    onClick = {
                        try {
                            ctx.startActivity(Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + ctx.packageName)))
                        } catch (_: Exception) { }
                    },
                    trailing = { Text("↗", color = Accent, fontSize = 18.sp) },
                )
            }
            GroupTitle(if (de) "Hilfe & Support" else Tr.t(lang, "Help & support"))
            SetGroup {
                SetCard(
                    "chat", if (de) "Feedback senden" else Tr.t(lang, "Send feedback"),
                    if (de) "Fehler melden oder Ideen schicken" else Tr.t(lang, "Report a bug or share an idea"),
                    onClick = { onFeedback() },
                    first = true,
                )
                SetCard(
                    "info", if (de) "Über die App" else Tr.t(lang, "About the app"),
                    if (de) "Was dich hier erwartet" else Tr.t(lang, "What to expect here"),
                    onClick = { onOpen(Screen.Info(aboutTitle(de, lang), aboutBody(lang))) },
                )
                var diagOpen by remember { mutableStateOf(false) }
                SetCard(
                    "chat", "Diagnostics",
                    if (diagOpen) lastExits(ctx) + "\n" + MusicBridge.logText() else "",
                    onClick = { diagOpen = !diagOpen },
                closing = diagOpen,
                    trailing = { Text(if (diagOpen) "▴" else "▾", color = Accent, fontSize = 16.sp) },
                )
            }
            GroupTitle(if (de) "Kontakt" else Tr.t(lang, "Contact"))
            Row(Modifier.fillMaxWidth().padding(horizontal = 14.dp, vertical = 4.dp), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                listOf("plane" to "https://t.me/Perseus641", "x" to "https://x.com/capone_835").forEach { (ic, url) ->
                    Box(
                        Modifier.weight(1f).height(46.dp).clip(RoundedCornerShape(16.dp))
                            .background(androidx.compose.ui.graphics.Brush.linearGradient(listOf(Color(0x1FFF5A4D), Color(0x0DFFFFFF))))
                            .border(BorderStroke(1.dp, Accent.copy(alpha = 0.28f)), RoundedCornerShape(16.dp))
                            .clickable { open(url) },
                        contentAlignment = Alignment.Center,
                    ) {
                        Box(
                            Modifier.size(32.dp).clip(RoundedCornerShape(10.dp)).background(Accent.copy(alpha = 0.16f))
                                .border(BorderStroke(1.dp, Accent.copy(alpha = 0.4f)), RoundedCornerShape(10.dp)),
                            contentAlignment = Alignment.Center,
                        ) { SetIcon(ic, 18.dp) }
                    }
                }
            }

            GroupTitle(if (de) "Rechtliches" else Tr.t(lang, "Legal"))
            SetGroup {
                SetCard(
                    "shield", if (de) "Datenschutzerklärung" else Tr.t(lang, "Privacy policy"),
                    onClick = { onOpen(Screen.Info(if (de) "Datenschutz" else Tr.t(lang, "Privacy"), Tr.privacy(lang))) },
                    first = true,
                )
                SetCard(
                    "layers", if (de) "Quellen & Lizenzen" else Tr.t(lang, "Sources & licenses"),
                    onClick = {
                        onOpen(
                            Screen.Info(
                                if (de) "Quellen & Lizenzen" else Tr.t(lang, "Sources & licenses"),
                                (if (de) "Alle Daten stammen aus offenen, öffentlich dokumentierten Quellen:\n\n" else Tr.t(lang, "All data comes from open, publicly documented sources:\n\n")) +
                                    SOURCES.joinToString("\n") { "• ${it.first} — ${it.second}" },
                            ),
                        )
                    },
                )
            }

            Text(
                "CENTAURIAN · centaurianspace.com",
                color = TextMuted.copy(alpha = 0.6f), fontSize = 10.sp, letterSpacing = 3.sp,
                textAlign = TextAlign.Center, modifier = Modifier.fillMaxWidth().padding(vertical = 26.dp),
            )
        }
    }
    }
}

@Composable
private fun ToolsHub(de: Boolean, lang: String, onBack: () -> Unit, onOpen: (Section) -> Unit) {
    Column(Modifier.fillMaxSize()) {
        TopBar(if (de) "Werkzeuge" else Tr.t(lang, "Tools"), { Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = TextMain) }, onBack, back = true)
        Column(Modifier.fillMaxSize().navigationBarsPadding().verticalScroll(rememberScrollState()).padding(top = 10.dp, bottom = 20.dp)) {
            TOOLS.forEachIndexed { i, sec ->
                NumberedCard(i + 1, if (de) sec.de else sec.en, if (de) sec.descDe else sec.descEn) { onOpen(sec) }
            }
        }
    }
}

@Composable
private fun InfoScreen(title: String, body: String, onBack: () -> Unit) {
    val styled = remember(body) {
        buildAnnotatedString {
            val lines = body.split("\n")
            lines.forEachIndexed { i, line ->
                val colon = line.indexOf(':')
                val isHead = line.length in 3..40 && line == line.uppercase() && line.any { it.isLetter() }
                when {
                    isHead -> withStyle(SpanStyle(color = Accent, fontWeight = FontWeight.Bold, letterSpacing = 1.sp, fontSize = 12.sp)) { append(line) }
                    colon in 2..24 && !line.substring(0, colon).contains('.') -> {
                        withStyle(SpanStyle(color = Accent, fontWeight = FontWeight.Bold)) { append(line.substring(0, colon + 1)) }
                        append(line.substring(colon + 1))
                    }
                    else -> append(line)
                }
                if (i < lines.lastIndex) append("\n")
            }
        }
    }
    Column(Modifier.fillMaxSize()) {
        TopBar(title, { Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = TextMain) }, onBack, back = true)
        Text(
            styled,
            color = TextMain, fontSize = 15.sp, lineHeight = 24.sp,
            modifier = Modifier.fillMaxSize().navigationBarsPadding().verticalScroll(rememberScrollState()).padding(20.dp),
        )
    }
}
