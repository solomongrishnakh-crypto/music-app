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
    "(function(){var s=document.getElementById('cn-native');if(!s){s=document.createElement('style');" +
        "s.id='cn-native';s.textContent='.app-fab,.app-drawer,.app-scrim{display:none!important}';" +
        "document.head.appendChild(s);}})()"

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

    Box(Modifier.fillMaxSize().background(BgDark)) {
        ModalNavigationDrawer(
            drawerState = drawer,
            gesturesEnabled = screen == Screen.Home,
            drawerContent = {
                ModalDrawerSheet(drawerContainerColor = Color(0xFF0C0506)) {
                    DrawerContent(lang, onOpen = { go(Screen.Web(it.path, if (de) it.de else it.en)) }, onSettings = { go(Screen.Settings) })
                }
            },
        ) {
            when (val s = screen) {
                is Screen.Home -> HomeScreen(
                    lang,
                    onMenu = { scope.launch { drawer.open() } },
                    onOpen = { go(Screen.Web(it.path, if (de) it.de else it.en)) },
                )
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

// ---------------------------------------------------------------- Bausteine
@Composable
private fun TopBar(title: String, icon: @Composable () -> Unit, onIcon: () -> Unit) {
    Row(
        Modifier.fillMaxWidth().background(BgDark).statusBarsPadding().height(56.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(Modifier.size(56.dp).clickable { onIcon() }, contentAlignment = Alignment.Center) { icon() }
        Text(
            title.uppercase(),
            color = TextMain,
            fontSize = 14.sp,
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
            .padding(horizontal = 16.dp, vertical = 5.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(Accent.copy(alpha = 0.05f))
            .border(BorderStroke(1.dp, LineSoft), RoundedCornerShape(12.dp))
            .clickable { onClick() }
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text("%02d".format(index), color = Accent.copy(alpha = 0.7f), fontSize = 11.sp, letterSpacing = 1.sp)
        Spacer(Modifier.size(14.dp))
        Column(Modifier.weight(1f)) {
            Text(title.uppercase(), color = TextMain, fontSize = 14.sp, fontWeight = FontWeight.Medium, letterSpacing = 2.sp)
            if (desc.isNotEmpty()) {
                Text(desc, color = TextMuted, fontSize = 12.sp, modifier = Modifier.padding(top = 3.dp))
            }
        }
        Text("›", color = Accent, fontSize = 22.sp)
    }
}

@Composable
private fun GroupTitle(text: String) {
    Text(
        text.uppercase(),
        color = Accent,
        fontSize = 10.sp,
        letterSpacing = 4.sp,
        modifier = Modifier.padding(start = 20.dp, top = 22.dp, bottom = 6.dp),
    )
}

// ---------------------------------------------------------------- Start
@Composable
private fun HomeScreen(lang: String, onMenu: () -> Unit, onOpen: (Section) -> Unit) {
    val de = lang == "de"
    Column(Modifier.fillMaxSize().background(BgDark)) {
        TopBar("Centaurian", { Icon(Icons.Default.Menu, contentDescription = "Menu", tint = TextMain) }, onMenu)
        LazyColumn(Modifier.fillMaxSize().navigationBarsPadding()) {
            item {
                Column(Modifier.fillMaxWidth().padding(top = 24.dp, bottom = 6.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    Image(painterResource(R.mipmap.ic_launcher_foreground), contentDescription = null, modifier = Modifier.size(140.dp))
                    Text("CENTAURIAN", color = TextMain, fontSize = 22.sp, fontWeight = FontWeight.Bold, letterSpacing = 8.sp)
                    Text(
                        if (de) "Universum & Weltgeschichte" else "Universe & world history",
                        color = TextMuted, fontSize = 12.sp, letterSpacing = 2.sp, textAlign = TextAlign.Center,
                        modifier = Modifier.padding(top = 6.dp),
                    )
                }
            }
            item { GroupTitle(if (de) "Entdecken" else "Explore") }
            items(EXPLORE.size) { i ->
                val s = EXPLORE[i]
                NumberedCard(i + 1, if (de) s.de else s.en, if (de) s.descDe else s.descEn) { onOpen(s) }
            }
            item { GroupTitle(if (de) "Werkzeuge" else "Tools") }
            items(TOOLS.size) { i ->
                val s = TOOLS[i]
                NumberedCard(EXPLORE.size + i + 1, if (de) s.de else s.en, if (de) s.descDe else s.descEn) { onOpen(s) }
            }
            item { Spacer(Modifier.height(28.dp)) }
        }
    }
}

// ---------------------------------------------------------------- Menue
@Composable
private fun DrawerContent(lang: String, onOpen: (Section) -> Unit, onSettings: () -> Unit) {
    val de = lang == "de"
    var n = 0
    Column(Modifier.fillMaxSize().statusBarsPadding().navigationBarsPadding().verticalScroll(rememberScrollState())) {
        Text("CENTAURIAN", color = TextMain, fontSize = 15.sp, fontWeight = FontWeight.Bold, letterSpacing = 6.sp, modifier = Modifier.padding(20.dp))
        GroupTitle(if (de) "Entdecken" else "Explore")
        EXPLORE.forEach { s -> n++; DrawerItem(n, if (de) s.de else s.en) { onOpen(s) } }
        GroupTitle(if (de) "Werkzeuge" else "Tools")
        TOOLS.forEach { s -> n++; DrawerItem(n, if (de) s.de else s.en) { onOpen(s) } }
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
    Row(Modifier.fillMaxWidth().clickable { onClick() }.padding(horizontal = 20.dp, vertical = 13.dp), verticalAlignment = Alignment.CenterVertically) {
        Text("%02d".format(n), color = Accent.copy(alpha = 0.6f), fontSize = 10.sp)
        Spacer(Modifier.size(14.dp))
        Text(title.uppercase(), color = TextMain, fontSize = 14.sp, letterSpacing = 2.sp)
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

    Column(Modifier.fillMaxSize().background(BgDark)) {
        TopBar(s.title, { Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = TextMain) }, {
            val w = web
            if (w != null && w.canGoBack()) w.goBack() else onBack()
        })
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
        Modifier.fillMaxWidth().padding(horizontal = 16.dp).clip(RoundedCornerShape(12.dp))
            .background(Accent.copy(alpha = 0.05f)).border(BorderStroke(1.dp, LineSoft), RoundedCornerShape(12.dp)),
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

    Column(Modifier.fillMaxSize().background(BgDark)) {
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

@Composable
private fun InfoScreen(title: String, body: String, onBack: () -> Unit) {
    Column(Modifier.fillMaxSize().background(BgDark)) {
        TopBar(title, { Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = TextMain) }, onBack)
        Text(
            body,
            color = TextMain, fontSize = 14.sp, lineHeight = 22.sp,
            modifier = Modifier.fillMaxSize().navigationBarsPadding().verticalScroll(rememberScrollState()).padding(20.dp),
        )
    }
}
