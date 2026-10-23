package space.centaurian.app

import android.Manifest
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
import androidx.compose.foundation.clickable
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
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.Settings
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
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.text.font.FontFamily
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

private val EXPLORE = listOf(
    Section("/universum", "Universum", "Universe", "Fakten, Zahlen und Live-News aus dem All", "Facts, numbers and live news from space"),
    Section("/sternenhimmel", "Sternenhimmel", "Live sky", "Halte dein Handy in den Himmel", "Hold your phone up to the sky"),
    Section("/sonnensystem", "Sonnensystem", "Solar system", "Live mit echten Positionen", "Live with real positions"),
    Section("/imperien", "Weltgeschichte", "World history", "Imperien von 3400 v. Chr. bis heute", "Empires from 3400 BC to today"),
    Section("/sternbilder", "Sternbilder", "Constellations", "Alle 88 Sternbilder", "All 88 constellations"),
    Section("/himmel-heute", "Himmel heute", "Sky today"),
    Section("/universum#space-news", "Weltraum-News", "Space news", "Aktuelle News aus Raumfahrt und Astronomie", "Latest space and astronomy news"),
)
private val TOOLS = listOf(
    Section("/groessenvergleich", "Größenvergleich", "Size comparison"),
    Section("/weltraum-rechner", "Rechner", "Calculator"),
    Section("/reisezeit/saturn/auto", "Reisezeit", "Travel time"),
    Section("/geburtstag", "Geburtstag", "Birthday"),
    Section("/maschine-der-ewigkeit", "Maschine der Ewigkeit", "Machine of eternity"),
)

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
    Lng("ko", "🇰🇷", "한국어"), Lng("id", "🇮🇩", "Indonesia"), Lng("fa", "🇮🇷", "فارسی"),
)

private val SOURCES = listOf(
    "Cliopatria (Seshat Global History Databank)" to "CC BY 4.0",
    "Historical Basemaps (A. Ourednik)" to "GPL-3.0",
    "Esri World Imagery" to "Map tiles",
    "NASA JPL Horizons" to "Positions",
    "NASA Exoplanet Archive" to "Exoplanets",
    "Wikipedia & Wikimedia Commons" to "CC BY-SA",
)

private sealed interface Screen {
    data object Home : Screen
    data class Web(val path: String, val title: String, val afterJs: String? = null) : Screen
    data object Settings : Screen
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

private fun nativeJs(hideNews: Boolean): String =
    "(function(){var css='.app-fab,.app-drawer,.app-scrim,#langBox,#langStrip,#fbLink,#newsLink{display:none!important}" +
        "button[aria-haspopup=listbox]{display:none!important}';" +
        "function inj(d){try{if(!d||!d.head||d.getElementById('cn-native'))return;var s=d.createElement('style');" +
        "s.id='cn-native';s.textContent=css;d.head.appendChild(s);}catch(e){}}" +
        "function all(){inj(document);var f=document.querySelectorAll('iframe');" +
        "for(var i=0;i<f.length;i++){try{inj(f[i].contentDocument);}catch(e){}}}" +
        "function bk(){try{var a=document.querySelectorAll('a,button');for(var i=0;i<a.length;i++){var t=(a[i].textContent||'').trim();" +
        "if(t.length<24&&(t.charAt(0)==='\u2190'||t.charAt(0)==='\u2039')){a[i].style.setProperty('display','none','important');}}" +
        HIDE_FB_JS +
        (if (hideNews) "var nw=document.getElementById('space-news');if(nw)nw.style.setProperty('display','none','important');" else "") +
        "}catch(e){}}" +
        "all();bk();var n=0;var iv=setInterval(function(){all();bk();if(++n>30)clearInterval(iv);},400);})()"

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

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (getSharedPreferences("cn", Context.MODE_PRIVATE).getBoolean("keepon", false)) setKeepOn(true)
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
            ) { AppRoot() }
        }
    }
}

// ---------------------------------------------------------------- Wurzel
@Composable
private fun AppRoot() {
    val ctx = LocalContext.current
    val prefs = remember { ctx.getSharedPreferences("cn", Context.MODE_PRIVATE) }
    var lang by remember { mutableStateOf(initialLang(ctx)) }
    var screen by remember { mutableStateOf<Screen>(startScreenFor(ctx, initialLang(ctx) == "de")) }
    var webBack by remember { mutableStateOf<Screen>(Screen.Home) }
    var anim by remember { mutableStateOf(prefs.getBoolean("anim", true)) }
    val drawer = rememberDrawerState(DrawerValue.Closed)
    val scope = rememberCoroutineScope()
    val de = lang == "de"

    fun go(s: Screen) {
        webBack = Screen.Home
        screen = s
        scope.launch { drawer.close() }
    }

    fun openSection(it: Section) {
        val js = if (it.path.contains("#")) "var e=document.getElementById('" + it.path.substringAfter("#") + "');if(e)e.scrollIntoView()" else null
        go(Screen.Web(it.path, if (de) it.de else it.en, js))
    }

    BackHandler(enabled = screen != Screen.Home) {
        val cur = screen
        screen = if (cur is Screen.Info) cur.backTo else Screen.Home
    }

    var searchReq by remember { mutableStateOf<Pair<Int, String>?>(null) }
    fun homeCmd(arg: String) {
        searchReq = Pair((searchReq?.first ?: 0) + 1, arg)
        screen = Screen.Home
        scope.launch { drawer.close() }
    }
    val showBg = screen is Screen.Settings || screen is Screen.Info
    Box(Modifier.fillMaxSize().background(BgDark)) {
        if (showBg) ParticleBackground(Modifier.fillMaxSize())
        ModalNavigationDrawer(
            drawerState = drawer,
            gesturesEnabled = drawer.currentValue == DrawerValue.Open || drawer.targetValue == DrawerValue.Open,
            drawerContent = {
                ModalDrawerSheet(drawerContainerColor = Color(0xFF060203)) {
                    DrawerContent(
                        lang,
                        onHome = { screen = Screen.Home; scope.launch { drawer.close() } },
                        onOpen = { openSection(it) },
                        onSettings = { go(Screen.Settings) },
                        onSiteSearch = { q -> homeCmd(q) },
                        onFeedback = { homeCmd("!fb") },
                        onPrivacy = { go(Screen.Web("/datenschutz", if (de) "Datenschutz" else "Privacy")) },
                        onAbout = { go(Screen.Info(aboutTitle(de), aboutBody(de), Screen.Home)) },
                    )
                }
            },
        ) {
            Box(Modifier.fillMaxSize()) {
            Box(Modifier.then(if (screen == Screen.Home) Modifier.fillMaxSize() else Modifier.size(0.dp)).clipToBounds()) {
                HomeWebLayer(lang, screen == Screen.Home, searchReq, anim, onMenu = { scope.launch { drawer.open() } })
            }
            when (val s = screen) {
                is Screen.Home -> {}
                is Screen.Web -> androidx.compose.runtime.key(s.path) { WebScreen(s, lang, onBack = { screen = webBack }) }
                is Screen.Settings -> SettingsScreen(
                    lang,
                    anim = anim,
                    onBack = { screen = Screen.Home },
                    onLang = { code ->
                        prefs.edit().putString("lang", code).apply()
                        lang = code
                    },
                    onAnim = { v -> prefs.edit().putBoolean("anim", v).apply(); anim = v },
                    onFeedback = { homeCmd("!fb") },
                    onOpen = { webBack = Screen.Settings; screen = it },
                )
                is Screen.Info -> InfoScreen(s.title, s.body, onBack = { screen = s.backTo })
            }
            val cur = screen
            if (cur is Screen.Web && cur.path in BARE) {
                Row(Modifier.align(Alignment.TopStart).statusBarsPadding().padding(8.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    listOf("‹" to { screen = Screen.Home }, "≡" to { scope.launch { drawer.open() } }).forEach { (t, a) ->
                        Box(
                            Modifier.size(38.dp).clip(RoundedCornerShape(8.dp)).background(Color(0xAA060203))
                                .border(BorderStroke(1.dp, LineSoft), RoundedCornerShape(8.dp)).clickable { a() },
                            contentAlignment = Alignment.Center,
                        ) { Text(t, color = TextMain, fontSize = 20.sp) }
                    }
                }
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
}

// ---------------------------------------------------------------- Startseite = echte Webseite
private fun homeJs(anim: Boolean): String =
    "(function(){var css='.app-fab,.app-drawer,.app-scrim{display:none!important}" +
        "button[aria-haspopup=listbox]{display:none!important}a[href\$=apk]{display:none!important}" +
        (if (anim) "" else "canvas{display:none!important}") + "';" +
        "var n=0;function run(){try{if(!document.getElementById('cn-native')&&document.head){var s=document.createElement('style');" +
        "s.id='cn-native';s.textContent=css;document.head.appendChild(s);}" +
        "var im=document.querySelector('img[src*=\"branding/logo.jpg\"]');if(im){var sc=im.closest('section');if(sc)sc.style.setProperty('display','none','important');}" +
        "var fo=document.querySelectorAll('footer');for(var j=0;j<fo.length;j++){fo[j].style.setProperty('display','none','important');}" +
        "var d=document.querySelectorAll('.dl-pill');for(var i=0;i<d.length;i++){var q=d[i].parentElement||d[i];q.style.setProperty('display','none','important');}" +
        HIDE_FB_JS + "}catch(x){}}" +
        "run();var iv=setInterval(function(){run();if(++n>60)clearInterval(iv);},500);})()"

/** Die Startseite der Webseite 1:1 (Design, Suche, Musik) in der App. Bleibt am Leben, damit Musik weiterlaeuft. */
@SuppressLint("SetJavaScriptEnabled")
@Composable
private fun HomeWebLayer(lang: String, visible: Boolean, searchReq: Pair<Int, String>?, anim: Boolean, onMenu: () -> Unit) {
    var web by remember { mutableStateOf<WebView?>(null) }
    var canBack by remember { mutableStateOf(false) }
    var progress by remember { mutableStateOf(0) }
    var failed by remember { mutableStateOf(false) }
    val de = lang == "de"
    BackHandler(enabled = visible && canBack) { web?.goBack() }
    LaunchedEffect(searchReq) {
        val r = searchReq ?: return@LaunchedEffect
        val w = web ?: return@LaunchedEffect
        if (r.second == "!fb") {
            kotlinx.coroutines.delay(300)
            w.evaluateJavascript("window.postMessage({centaurianFeedback:true},location.origin)", null)
            return@LaunchedEffect
        }
        val path = try { Uri.parse(w.url ?: "").path ?: "/" } catch (_: Exception) { "/" }
        val isHome = path == "/" || path.length <= 3 && path.startsWith("/")
        if (!isHome) {
            w.loadUrl(siteUrl("/", lang))
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
        TopBar("Centaurian", { Icon(Icons.Default.Menu, contentDescription = "Menu", tint = TextMain) }, onMenu)
        if (progress in 1..99) {
            LinearProgressIndicator(progress = { progress / 100f }, modifier = Modifier.fillMaxWidth().height(2.dp), color = Accent, trackColor = Color.Transparent)
        }
        Box(Modifier.fillMaxSize().navigationBarsPadding()) {
            androidx.compose.runtime.key(lang, anim) {
                AndroidView(
                    modifier = Modifier.fillMaxSize(),
                    factory = { c ->
                        WebView(c).apply {
                            layoutParams = ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
                            setBackgroundColor(android.graphics.Color.parseColor("#060203"))
                            settings.javaScriptEnabled = true
                            settings.domStorageEnabled = true
                            settings.mediaPlaybackRequiresUserGesture = false
                            CookieManager.getInstance().setAcceptCookie(true)
                            webChromeClient = object : WebChromeClient() {
                                override fun onProgressChanged(view: WebView?, newProgress: Int) {
                                    progress = newProgress
                                }
                            }
                            webViewClient = object : WebViewClient() {
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
                                    view?.evaluateJavascript("try{localStorage.setItem('centaurian-lang','$lang');}catch(e){}", null)
                                }

                                override fun doUpdateVisitedHistory(view: WebView?, url: String?, isReload: Boolean) {
                                    canBack = view?.canGoBack() == true
                                }

                                override fun onPageFinished(view: WebView?, url: String?) {
                                    view?.evaluateJavascript(homeJs(anim), null)
                                }

                                override fun onRenderProcessGone(view: WebView?, detail: android.webkit.RenderProcessGoneDetail?): Boolean {
                                    failed = true
                                    return true
                                }

                                override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                                    if (request?.isForMainFrame == true) failed = true
                                }
                            }
                            visibility = if (visible) android.view.View.VISIBLE else android.view.View.INVISIBLE
                            loadUrl(siteUrl("/", lang))
                            web = this
                        }
                    },
                    update = { v -> v.visibility = if (visible) android.view.View.VISIBLE else android.view.View.INVISIBLE },
                )
            }
            if (failed) {
                Column(
                    Modifier.fillMaxSize().background(BgDark).padding(32.dp),
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    Text(if (de) "Keine Verbindung" else "No connection", color = TextMain, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Box(
                        Modifier.padding(top = 20.dp).clip(RoundedCornerShape(8.dp)).border(BorderStroke(1.dp, Accent), RoundedCornerShape(8.dp))
                            .clickable { failed = false; web?.reload() }.padding(horizontal = 22.dp, vertical = 10.dp),
                    ) { Text((if (de) "Erneut versuchen" else "Retry").uppercase(), color = Accent, fontSize = 12.sp, letterSpacing = 2.sp) }
                }
            }
        }
    }
}

// ---------------------------------------------------------------- Bausteine
@Composable
private fun TopBar(title: String, icon: @Composable () -> Unit, onIcon: () -> Unit) {
    Row(
        Modifier.fillMaxWidth().background(Color(0xB3030206)).statusBarsPadding().height(48.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(Modifier.size(48.dp).clickable { onIcon() }, contentAlignment = Alignment.Center) { icon() }
        Text(
            title.uppercase(),
            color = TextMain,
            fontSize = 12.sp,
            fontFamily = Mono,
            fontWeight = FontWeight.Bold,
            letterSpacing = 3.sp,
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
    Row(Modifier.fillMaxWidth().padding(start = 18.dp, end = 18.dp, top = 16.dp, bottom = 6.dp), verticalAlignment = Alignment.CenterVertically) {
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
                            if (de) "Universum & Weltgeschichte" else "Universe & world history",
                            color = TextMuted, fontSize = 11.sp, letterSpacing = 1.sp,
                            modifier = Modifier.padding(top = 3.dp),
                        )
                    }
                }
            }
            item { SearchBar(query, if (de) "Suchen…" else "Search…", { query = it }, Modifier.padding(horizontal = 14.dp, vertical = 4.dp)) }
            val ex = EXPLORE.filter { matches(it, query) }
            val tl = TOOLS.filter { matches(it, query) }
            if (ex.isEmpty() && tl.isEmpty()) {
                item { Text(if (de) "Nichts gefunden" else "Nothing found", color = TextMuted, fontSize = 12.sp, fontFamily = Mono, modifier = Modifier.padding(24.dp)) }
            }
            if (ex.isNotEmpty()) item { GroupTitle(if (de) "Entdecken" else "Explore") }
            items(ex.size) { i ->
                val s = ex[i]
                NumberedCard(EXPLORE.indexOf(s) + 1, if (de) s.de else s.en, if (de) s.descDe else s.descEn) { onOpen(s) }
            }
            if (tl.isNotEmpty()) item { GroupTitle(if (de) "Werkzeuge" else "Tools") }
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
    onHome: () -> Unit,
    onOpen: (Section) -> Unit,
    onSettings: () -> Unit,
    onSiteSearch: (String) -> Unit,
    onFeedback: () -> Unit,
    onPrivacy: () -> Unit,
    onAbout: () -> Unit,
) {
    val de = lang == "de"
    var q by remember { mutableStateOf("") }
    Box(Modifier.fillMaxSize()) {
        ParticleBackground(Modifier.fillMaxSize())
        Column(Modifier.fillMaxSize().statusBarsPadding().navigationBarsPadding().verticalScroll(rememberScrollState()).padding(bottom = 12.dp)) {
            Row(Modifier.fillMaxWidth().clickable { onHome() }.padding(horizontal = 18.dp, vertical = 16.dp), verticalAlignment = Alignment.CenterVertically) {
                Image(painterResource(R.mipmap.ic_launcher_foreground), contentDescription = null, modifier = Modifier.size(40.dp))
                Spacer(Modifier.size(8.dp))
                Text("CENTAURIAN", color = TextMain, fontSize = 15.sp, fontWeight = FontWeight.Bold, letterSpacing = 5.sp)
            }
            SearchBar(q, if (de) "Planeten, Songs, Reiche…" else "Planets, songs, empires…", { q = it }, Modifier.padding(horizontal = 14.dp, vertical = 2.dp), onSearch = { onSiteSearch(it) })
            if (q.isNotBlank()) {
                DrawerRow("⌕", (if (de) "„" else "\"") + q.trim() + (if (de) "“ auf der Webseite suchen" else "\" – search everything"), false) { onSiteSearch(q.trim()) }
            }
            val ex = EXPLORE.filter { matches(it, q) }
            val tl = TOOLS.filter { matches(it, q) }
            if (ex.isNotEmpty()) GroupTitle(if (de) "Entdecken" else "Explore")
            ex.forEach { s -> DrawerRow("%02d".format(EXPLORE.indexOf(s) + 1), if (de) s.de else s.en, false) { onOpen(s) } }
            if (tl.isNotEmpty()) GroupTitle(if (de) "Werkzeuge" else "Tools")
            tl.forEach { s -> DrawerRow("%02d".format(EXPLORE.size + TOOLS.indexOf(s) + 1), if (de) s.de else s.en, false) { onOpen(s) } }
            if (q.isBlank()) {
                Spacer(Modifier.height(14.dp))
                Row(
                    Modifier.fillMaxWidth().padding(horizontal = 14.dp, vertical = 4.dp).glassBox().clickable { onFeedback() }.padding(horizontal = 16.dp, vertical = 14.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Text("✉", color = Accent, fontSize = 15.sp)
                    Spacer(Modifier.size(14.dp))
                    Column(Modifier.weight(1f)) {
                        Text("FEEDBACK", color = TextMain, fontSize = 12.sp, fontFamily = Mono, letterSpacing = 3.sp, fontWeight = FontWeight.Bold)
                        Text(if (de) "Fehler melden oder Ideen schicken" else "Report a bug or share an idea", color = TextMuted, fontSize = 11.sp, modifier = Modifier.padding(top = 2.dp))
                    }
                }
                Spacer(Modifier.height(6.dp))
                DrawerRow("§", if (de) "Datenschutz" else "Privacy", false) { onPrivacy() }
                DrawerRow("i", if (de) "Infos" else "About", false) { onAbout() }
                DrawerRow("⚙", if (de) "Einstellungen" else "Settings", false) { onSettings() }
            }
        }
    }
}

@Composable
private fun DrawerRow(tag: String, title: String, active: Boolean, onClick: () -> Unit) {
    Row(
        Modifier
            .fillMaxWidth()
            .padding(horizontal = 14.dp, vertical = 3.dp)
            .clickable { onClick() }
            .padding(horizontal = 12.dp, vertical = 11.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(Modifier.width(3.dp).height(16.dp).background(if (active) Accent else Color.Transparent))
        Spacer(Modifier.size(10.dp))
        Text(tag, color = Accent, fontSize = 11.sp, fontFamily = Mono, modifier = Modifier.width(26.dp))
        Text(title.uppercase(), color = if (active) Color.White else TextMain, fontSize = 12.sp, fontFamily = Mono, letterSpacing = 2.sp, fontWeight = if (active) FontWeight.Bold else FontWeight.Normal)
    }
}

// ---------------------------------------------------------------- Web-Ansicht
@SuppressLint("SetJavaScriptEnabled")
@Composable
private fun WebScreen(s: Screen.Web, lang: String, onBack: () -> Unit) {
    val ctx = LocalContext.current
    val activity = ctx as MainActivity
    var progress by remember { mutableStateOf(0) }
    var failed by remember { mutableStateOf(false) }
    var web by remember { mutableStateOf<WebView?>(null) }
    var canGoBack by remember { mutableStateOf(false) }
    val de = lang == "de"

    BackHandler(enabled = true) {
        val w = web
        if (w != null && w.canGoBack()) w.goBack() else onBack()
    }

    val bare = s.path in BARE
    Column(Modifier.fillMaxSize().background(BgDark)) {
        if (bare) {
            Box(Modifier.fillMaxWidth().statusBarsPadding())
        } else {
            TopBar(s.title, { Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = TextMain) }, {
                val w = web
                if (w != null && w.canGoBack()) w.goBack() else onBack()
            })
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
                        settings.mediaPlaybackRequiresUserGesture = false
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
                            }

                            override fun onPageFinished(view: WebView?, url: String?) {
                                canGoBack = view?.canGoBack() == true
                                view?.evaluateJavascript(
                                    "try{localStorage.setItem('centaurian-lang','$lang');localStorage.setItem('cn_app_mode','1');}catch(e){}",
                                    null,
                                )
                                view?.evaluateJavascript(nativeJs(s.path == "/universum"), null)
                                val js = s.afterJs
                                if (js != null) {
                                    Handler(Looper.getMainLooper()).postDelayed({ view?.evaluateJavascript(js, null) }, 1500)
                                }
                            }

                            override fun onRenderProcessGone(view: WebView?, detail: android.webkit.RenderProcessGoneDetail?): Boolean {
                                failed = true
                                return true
                            }

                            override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                                if (request?.isForMainFrame == true) failed = true
                            }
                        }
                        loadUrl(siteUrl(s.path, lang))
                        web = this
                    }
                },
            )
            if (failed) {
                Column(
                    Modifier.fillMaxSize().background(BgDark).padding(32.dp),
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    Text(if (de) "Keine Verbindung" else "No connection", color = TextMain, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Text(
                        if (de) "Bitte Internet prüfen und erneut versuchen." else "Please check your internet and try again.",
                        color = TextMuted, fontSize = 13.sp, textAlign = TextAlign.Center, modifier = Modifier.padding(top = 8.dp, bottom = 20.dp),
                    )
                    Box(
                        Modifier.clip(RoundedCornerShape(8.dp)).border(BorderStroke(1.dp, Accent), RoundedCornerShape(8.dp))
                            .clickable { failed = false; web?.reload() }.padding(horizontal = 22.dp, vertical = 10.dp),
                    ) { Text((if (de) "Erneut versuchen" else "Retry").uppercase(), color = Accent, fontSize = 12.sp, letterSpacing = 2.sp) }
                }
            }
        }
    }
}

private fun aboutTitle(de: Boolean) = if (de) "Über Centaurian" else "About Centaurian"

private fun aboutBody(de: Boolean): String =
if (de)
                                "Centaurian ist ein privates Hobby-Projekt: ein kleiner Ort, um Musik zu hören und unsere Welt und das Universum zu entdecken – kostenlos, ohne Anmeldung, ohne Werbung.\n\n" +
                                    "Musik: Songs suchen und direkt hören, über den offiziellen YouTube-Player.\n" +
                                    "Universum: Fakten, Zahlen und Live-News aus dem All.\n" +
                                    "Sternenhimmel: Echte Sterne und Planeten für deinen Ort.\n" +
                                    "Sonnensystem: Planeten und Raumsonden live in 3D.\n" +
                                    "Weltgeschichte: Grenzen von Imperien von 3400 v. Chr. bis heute.\n\n" +
                                    "Alles läuft über offizielle, öffentlich dokumentierte Schnittstellen (YouTube, NASA/JPL, Wikipedia). Nichts wird heruntergeladen oder auf dieser Seite gespeichert."
                            else
                                "Centaurian is a private hobby project: a small place to listen to music and explore our world and the universe – free, no sign-up, no ads.\n\n" +
                                    "Music: search songs and play them directly via the official YouTube player.\n" +
                                    "Universe: facts, numbers and live news from space.\n" +
                                    "Live sky: real stars and planets for your location.\n" +
                                    "Solar system: planets and space probes live in 3D.\n" +
                                    "World history: empire borders from 3400 BC to today.\n\n" +
                                    "Everything runs through official, publicly documented interfaces (YouTube, NASA/JPL, Wikipedia). Nothing is downloaded or stored on this site."

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
private fun SettingsScreen(lang: String, anim: Boolean, onBack: () -> Unit, onLang: (String) -> Unit, onAnim: (Boolean) -> Unit, onFeedback: () -> Unit, onOpen: (Screen) -> Unit) {
    val ctx = LocalContext.current
    val de = lang == "de"
    var langOpen by remember { mutableStateOf(false) }
    val prefs = remember { ctx.getSharedPreferences("cn", Context.MODE_PRIVATE) }
    var startKey by remember { mutableStateOf(prefs.getString("start", "home") ?: "home") }
    var keepOn by remember { mutableStateOf(prefs.getBoolean("keepon", false)) }
    val cur = LANGS.first { it.code == lang }
    val version = try { ctx.packageManager.getPackageInfo(ctx.packageName, 0).versionName ?: "" } catch (_: Exception) { "" }

    fun open(url: String) {
        try { ctx.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url))) } catch (_: Exception) { }
    }

    Box(Modifier.fillMaxSize().background(BgDark)) {
    Column(Modifier.fillMaxSize()) {
        TopBar(if (de) "Einstellungen" else "Settings", { Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = TextMain) }, onBack)
        Column(Modifier.fillMaxSize().navigationBarsPadding().verticalScroll(rememberScrollState())) {
            GroupTitle(if (de) "Sprache" else "Language")
            Card {
                SettingsRow("${cur.flag}  ${cur.name}", trailing = if (langOpen) "−" else "+") { langOpen = !langOpen }
                if (langOpen) {
                    LANGS.chunked(3).forEach { rowItems ->
                        Row(Modifier.fillMaxWidth().padding(horizontal = 10.dp, vertical = 3.dp), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            rowItems.forEach { l ->
                                Box(
                                    Modifier.weight(1f).clip(RoundedCornerShape(6.dp))
                                        .border(BorderStroke(1.dp, if (l.code == lang) Accent else LineSoft), RoundedCornerShape(6.dp))
                                        .clickable { onLang(l.code); langOpen = false }.padding(vertical = 8.dp),
                                    contentAlignment = Alignment.Center,
                                ) { Text("${l.flag} ${l.name}", color = if (l.code == lang) Color.White else TextMuted, fontSize = 11.sp, maxLines = 1) }
                            }
                            repeat(3 - rowItems.size) { Spacer(Modifier.weight(1f)) }
                        }
                    }
                    Spacer(Modifier.height(8.dp))
                }
            }

            GroupTitle(if (de) "Anzeige & Start" else "Display & start")
            Card {
                val so = START_OPTS.firstOrNull { it.first == startKey } ?: START_OPTS[0]
                SettingsRow(
                    if (de) "Startbereich" else "Start area",
                    if (de) "Was beim Öffnen der App zuerst erscheint" else "What opens first when you start the app",
                    if (de) so.second.first else so.second.second,
                ) {
                    val i = START_OPTS.indexOfFirst { it.first == startKey }
                    startKey = START_OPTS[(i + 1) % START_OPTS.size].first
                    prefs.edit().putString("start", startKey).apply()
                }
                SettingsRow(
                    if (de) "Hintergrund-Animation" else "Background animation",
                    if (de) "Aus spart Akku und läuft flüssiger" else "Off saves battery and runs smoother",
                    if (anim) (if (de) "AN" else "ON") else (if (de) "AUS" else "OFF"),
                ) { onAnim(!anim) }
                SettingsRow(
                    if (de) "Bildschirm anlassen" else "Keep screen on",
                    if (de) "Display geht in der App nicht aus" else "The display stays on while the app is open",
                    if (keepOn) (if (de) "AN" else "ON") else (if (de) "AUS" else "OFF"),
                ) {
                    keepOn = !keepOn
                    prefs.edit().putBoolean("keepon", keepOn).apply()
                    (ctx as? MainActivity)?.setKeepOn(keepOn)
                }
            }

            GroupTitle("Feedback")
            Card {
                SettingsRow(
                    if (de) "Feedback senden" else "Send feedback",
                    if (de) "Fehler melden oder Ideen schicken" else "Report a bug or share an idea",
                ) { onFeedback() }
            }

            GroupTitle(if (de) "Über Centaurian" else "About Centaurian")
            Card {
                SettingsRow(
                    if (de) "Über die App" else "About the app",
                    if (de) "Was dich hier erwartet" else "What to expect here",
                ) {
                    onOpen(
                        Screen.Info(aboutTitle(de), aboutBody(de)))
                }
            }

            GroupTitle(if (de) "Kontakt" else "Contact")
            Card {
                SettingsRow("Telegram", trailing = "↗") { open("https://t.me/Perseus641") }
                SettingsRow("X", trailing = "↗") { open("https://x.com/capone_835") }
            }

            GroupTitle(if (de) "Rechtliches" else "Legal")
            Card {
                SettingsRow(if (de) "Datenschutzerklärung" else "Privacy policy") {
                    onOpen(Screen.Web("/datenschutz", if (de) "Datenschutz" else "Privacy"))
                }
                SettingsRow(if (de) "Quellen & Lizenzen" else "Sources & licenses") {
                    onOpen(
                        Screen.Info(
                            if (de) "Quellen & Lizenzen" else "Sources & licenses",
                            (if (de) "Alle Daten stammen aus offenen, öffentlich dokumentierten Quellen:\n\n" else "All data comes from open, publicly documented sources:\n\n") +
                                SOURCES.joinToString("\n") { "• ${it.first} — ${it.second}" },
                        ),
                    )
                }
            }

            GroupTitle("App")
            Card {
                SettingsRow(if (de) "App teilen" else "Share app", if (de) "Link an Freunde schicken" else "Send the link to friends", "↗") {
                    val i = Intent(Intent.ACTION_SEND).apply { type = "text/plain"; putExtra(Intent.EXTRA_TEXT, BASE) }
                    ctx.startActivity(Intent.createChooser(i, "Centaurian"))
                }
                SettingsRow(
                    if (de) "Zwischenspeicher leeren" else "Clear cache",
                    if (de) "Gespeicherte Daten der Ansichten löschen" else "Delete saved data of the views",
                ) {
                    try {
                        WebView(ctx).clearCache(true)
                    } catch (_: Exception) { }
                    Toast.makeText(ctx, if (de) "Gelöscht" else "Cleared", Toast.LENGTH_SHORT).show()
                }
                SettingsRow(
                    if (de) "Berechtigungen" else "Permissions",
                    if (de) "Standort & Co. in den Android-Einstellungen" else "Location and more in Android settings",
                    "↗",
                ) {
                    try {
                        ctx.startActivity(Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + ctx.packageName)))
                    } catch (_: Exception) { }
                }
                SettingsRow(if (de) "Version" else "Version", trailing = version)
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
private fun InfoScreen(title: String, body: String, onBack: () -> Unit) {
    Column(Modifier.fillMaxSize()) {
        TopBar(title, { Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = TextMain) }, onBack)
        Text(
            body,
            color = TextMain, fontSize = 14.sp, lineHeight = 22.sp,
            modifier = Modifier.fillMaxSize().navigationBarsPadding().verticalScroll(rememberScrollState()).padding(20.dp),
        )
    }
}
