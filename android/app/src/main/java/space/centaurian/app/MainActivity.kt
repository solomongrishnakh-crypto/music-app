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
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.BasicTextField
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
private fun SearchBar(query: String, hint: String, onChange: (String) -> Unit, modifier: Modifier = Modifier) {
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
)
private val TOOLS = listOf(
    Section("/groessenvergleich", "Größenvergleich", "Size comparison"),
    Section("/weltraum-rechner", "Rechner", "Calculator"),
    Section("/reisezeit", "Reisezeit", "Travel time"),
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
    data class Info(val title: String, val body: String) : Screen
}

// ---------------------------------------------------------------- Hilfen
private fun siteUrl(path: String, lang: String): String {
    var p = path
    if (lang != "de") {
        for ((de, intl) in SLUGS) {
            if (p == de || p.startsWith("$de/")) {
                p = intl + p.substring(de.length)
                break
            }
        }
        p = if (p == "/") "/$lang" else "/$lang$p"
    }
    return BASE + p + (if (p.contains("?")) "&" else "?") + "app=1"
}

private fun initialLang(ctx: Context): String {
    val saved = ctx.getSharedPreferences("cn", Context.MODE_PRIVATE).getString("lang", null)
    if (saved != null && LANGS.any { it.code == saved }) return saved
    val sys = Locale.getDefault().language
    return if (LANGS.any { it.code == sys }) sys else "en"
}

private val NATIVE_CSS_JS =
    "(function(){var css='.app-fab,.app-drawer,.app-scrim,#langBox,#langStrip{display:none!important}" +
        "button[aria-haspopup=listbox]{display:none!important}';" +
        "function inj(d){try{if(!d||!d.head||d.getElementById('cn-native'))return;var s=d.createElement('style');" +
        "s.id='cn-native';s.textContent=css;d.head.appendChild(s);}catch(e){}}" +
        "function all(){inj(document);var f=document.querySelectorAll('iframe');" +
        "for(var i=0;i<f.length;i++){try{inj(f[i].contentDocument);}catch(e){}}}" +
        "all();var n=0;var iv=setInterval(function(){all();if(++n>30)clearInterval(iv);},400);})()"

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

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
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
    var lang by remember { mutableStateOf(initialLang(ctx)) }
    var screen by remember { mutableStateOf<Screen>(Screen.Home) }
    var webBack by remember { mutableStateOf<Screen>(Screen.Home) }
    val drawer = rememberDrawerState(DrawerValue.Closed)
    val scope = rememberCoroutineScope()
    val de = lang == "de"

    fun go(s: Screen) {
        webBack = Screen.Home
        screen = s
        scope.launch { drawer.close() }
    }

    BackHandler(enabled = screen != Screen.Home) {
        screen = if (screen is Screen.Info) Screen.Settings else Screen.Home
    }

    val showBg = screen is Screen.Settings || screen is Screen.Info
    Box(Modifier.fillMaxSize().background(BgDark)) {
        if (showBg) ParticleBackground(Modifier.fillMaxSize())
        ModalNavigationDrawer(
            drawerState = drawer,
            gesturesEnabled = screen == Screen.Home,
            drawerContent = {
                ModalDrawerSheet(drawerContainerColor = Color(0xFF0C0506)) {
                    DrawerContent(lang, onOpen = { go(Screen.Web(it.path, if (de) it.de else it.en)) }, onSettings = { go(Screen.Settings) })
                }
            },
        ) {
            Box(Modifier.fillMaxSize()) {
            Box(Modifier.fillMaxSize().then(if (screen == Screen.Home) Modifier else Modifier.size(0.dp))) {
                HomeWebLayer(lang, screen == Screen.Home, onMenu = { scope.launch { drawer.open() } })
            }
            when (val s = screen) {
                is Screen.Home -> {}
                is Screen.Web -> WebScreen(s, lang, onBack = { screen = webBack })
                is Screen.Settings -> SettingsScreen(
                    lang,
                    onBack = { screen = Screen.Home },
                    onLang = { code ->
                        ctx.getSharedPreferences("cn", Context.MODE_PRIVATE).edit().putString("lang", code).apply()
                        lang = code
                    },
                    onOpen = { webBack = Screen.Settings; screen = it },
                )
                is Screen.Info -> InfoScreen(s.title, s.body, onBack = { screen = Screen.Settings })
            }
            }
        }
    }
}

// ---------------------------------------------------------------- Startseite = echte Webseite
private val HOME_CSS_JS =
    "(function(){var css='.app-fab,.app-drawer,.app-scrim{display:none!important}" +
        "button[aria-haspopup=listbox]{display:none!important}a[href*=\\'Centaurian.apk\\']{display:none!important}';" +
        "var n=0;function run(){try{if(!document.getElementById('cn-native')&&document.head){var s=document.createElement('style');" +
        "s.id='cn-native';s.textContent=css;document.head.appendChild(s);}" +
        "var l=document.querySelectorAll('a[href*=\\"Centaurian.apk\\"]');for(var i=0;i<l.length;i++){l[i].style.setProperty('display','none','important');}}catch(x){}}" +
        "run();var iv=setInterval(function(){run();if(++n>40)clearInterval(iv);},500);})()"

/** Die Startseite der Webseite 1:1 (Design, Suche, Musik) in der App. Bleibt am Leben, damit Musik weiterlaeuft. */
@SuppressLint("SetJavaScriptEnabled")
@Composable
private fun HomeWebLayer(lang: String, visible: Boolean, onMenu: () -> Unit) {
    var web by remember { mutableStateOf<WebView?>(null) }
    var canBack by remember { mutableStateOf(false) }
    var progress by remember { mutableStateOf(0) }
    var failed by remember { mutableStateOf(false) }
    val de = lang == "de"
    BackHandler(enabled = visible && canBack) { web?.goBack() }
    Column(Modifier.fillMaxSize().background(BgDark)) {
        TopBar("Centaurian", { Icon(Icons.Default.Menu, contentDescription = "Menu", tint = TextMain) }, onMenu)
        if (progress in 1..99) {
            LinearProgressIndicator(progress = { progress / 100f }, modifier = Modifier.fillMaxWidth().height(2.dp), color = Accent, trackColor = Color.Transparent)
        }
        Box(Modifier.fillMaxSize().navigationBarsPadding()) {
            androidx.compose.runtime.key(lang) {
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
                                    view?.evaluateJavascript(HOME_CSS_JS, null)
                                }

                                override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                                    if (request?.isForMainFrame == true) failed = true
                                }
                            }
                            loadUrl(siteUrl("/", lang))
                            web = this
                        }
                    },
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
private fun DrawerContent(lang: String, onOpen: (Section) -> Unit, onSettings: () -> Unit) {
    val de = lang == "de"
    var q by remember { mutableStateOf("") }
    Column(Modifier.fillMaxSize().statusBarsPadding().navigationBarsPadding().verticalScroll(rememberScrollState())) {
        Text("CENTAURIAN", color = TextMain, fontSize = 15.sp, fontWeight = FontWeight.Bold, letterSpacing = 6.sp, modifier = Modifier.padding(20.dp))
        SearchBar(q, if (de) "Suchen…" else "Search…", { q = it }, Modifier.padding(horizontal = 16.dp, vertical = 4.dp))
        val ex = EXPLORE.filter { matches(it, q) }
        val tl = TOOLS.filter { matches(it, q) }
        if (ex.isNotEmpty()) GroupTitle(if (de) "Entdecken" else "Explore")
        ex.forEach { s -> DrawerItem(EXPLORE.indexOf(s) + 1, if (de) s.de else s.en) { onOpen(s) } }
        if (tl.isNotEmpty()) GroupTitle(if (de) "Werkzeuge" else "Tools")
        tl.forEach { s -> DrawerItem(EXPLORE.size + TOOLS.indexOf(s) + 1, if (de) s.de else s.en) { onOpen(s) } }
        if (ex.isEmpty() && tl.isEmpty()) Text(if (de) "Nichts gefunden" else "Nothing found", color = TextMuted, fontSize = 12.sp, fontFamily = Mono, modifier = Modifier.padding(20.dp))
        Spacer(Modifier.height(20.dp))
        Row(
            Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp)
                .clip(RoundedCornerShape(8.dp))
                .border(BorderStroke(1.dp, LineSoft), RoundedCornerShape(8.dp))
                .clickable { onSettings() }
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(Icons.Default.Settings, contentDescription = null, tint = Accent, modifier = Modifier.size(18.dp))
            Spacer(Modifier.size(12.dp))
            Text((if (de) "Einstellungen" else "Settings").uppercase(), color = TextMain, fontSize = 12.sp, letterSpacing = 2.sp)
        }
    }
}

@Composable
private fun DrawerItem(n: Int, title: String, onClick: () -> Unit) {
    Row(Modifier.fillMaxWidth().clickable { onClick() }.padding(horizontal = 20.dp, vertical = 9.dp), verticalAlignment = Alignment.CenterVertically) {
        Text("%02d".format(n), color = Accent.copy(alpha = 0.6f), fontSize = 10.sp)
        Spacer(Modifier.size(14.dp))
        Text(title.uppercase(), color = TextMain, fontSize = 12.sp, fontFamily = Mono, letterSpacing = 2.sp)
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

    val bare = s.path in listOf("/sternenhimmel", "/sternbilder", "/himmel-heute")
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
                                view?.evaluateJavascript(NATIVE_CSS_JS, null)
                                val js = s.afterJs
                                if (js != null) {
                                    Handler(Looper.getMainLooper()).postDelayed({ view?.evaluateJavascript(js, null) }, 1500)
                                }
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
private fun SettingsScreen(lang: String, onBack: () -> Unit, onLang: (String) -> Unit, onOpen: (Screen) -> Unit) {
    val ctx = LocalContext.current
    val de = lang == "de"
    var langOpen by remember { mutableStateOf(false) }
    val cur = LANGS.first { it.code == lang }
    val version = try { ctx.packageManager.getPackageInfo(ctx.packageName, 0).versionName ?: "" } catch (_: Exception) { "" }

    fun open(url: String) {
        try { ctx.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url))) } catch (_: Exception) { }
    }

    Box(Modifier.fillMaxSize()) {
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

            GroupTitle("Feedback")
            Card {
                SettingsRow(
                    if (de) "Feedback senden" else "Send feedback",
                    if (de) "Fehler melden oder Ideen schicken" else "Report a bug or share an idea",
                ) { onOpen(Screen.Web("/", "Feedback", "window.postMessage({centaurianFeedback:true},location.origin)")) }
            }

            GroupTitle(if (de) "Über Centaurian" else "About Centaurian")
            Card {
                SettingsRow(
                    if (de) "Über die App" else "About the app",
                    if (de) "Was dich hier erwartet" else "What to expect here",
                ) {
                    onOpen(
                        Screen.Info(
                            if (de) "Über Centaurian" else "About Centaurian",
                            if (de)
                                "Centaurian zeigt das Universum live und die Weltgeschichte aller Imperien.\n\n" +
                                    "Universum: Fakten, Zahlen und Live-News aus dem All.\n" +
                                    "Sternenhimmel: Echte Sterne und Planeten für deinen Ort.\n" +
                                    "Sonnensystem: Planeten und Raumsonden live in 3D.\n" +
                                    "Weltgeschichte: Grenzen von Imperien von 3400 v. Chr. bis heute.\n\n" +
                                    "Ein privates Hobby-Projekt. Es werden ausschließlich offizielle, öffentlich dokumentierte Schnittstellen genutzt."
                            else
                                "Centaurian shows the universe live and the world history of all empires.\n\n" +
                                    "Universe: facts, numbers and live news from space.\n" +
                                    "Live sky: real stars and planets for your location.\n" +
                                    "Solar system: planets and space probes live in 3D.\n" +
                                    "World history: empire borders from 3400 BC to today.\n\n" +
                                    "A private hobby project. Only official, publicly documented interfaces are used.",
                        ),
                    )
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
                        CookieManager.getInstance().removeAllCookies(null)
                        WebStorage.getInstance().deleteAllData()
                    } catch (_: Exception) { }
                    Toast.makeText(ctx, if (de) "Gelöscht" else "Cleared", Toast.LENGTH_SHORT).show()
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
