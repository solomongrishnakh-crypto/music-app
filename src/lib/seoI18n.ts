/**
 * Internationale Adressen und Suchmaschinen-Texte (Nutzerwunsch 07.10.2026:
 * "fokus liegt an internationale zuschauer").
 *
 * Jede Seite gibt es auf Deutsch ohne Präfix (/imperien) und in 12 weiteren
 * Sprachen mit Präfix (/en/imperien, /es/imperien, …). Über hreflang-Angaben
 * erfährt Google, welche Adresse zu welcher Sprache gehört, und zeigt
 * Nutzern weltweit die passende Version an.
 */
import type { Lang } from "@/contexts/LanguageContext";

export const BASE_URL = "https://centaurian.vercel.app";

/** Sprachen mit eigenem URL-Präfix (Deutsch liegt ohne Präfix im Stamm). */
export const PREFIXED_LANGS = ["en", "es", "fr", "pt", "tr", "ru", "el", "ar", "hi", "zh", "ja", "ko"] as const;
export type PrefixedLang = (typeof PREFIXED_LANGS)[number];
export const ALL_LANGS: Lang[] = ["de", ...PREFIXED_LANGS];

export function isPrefixedLang(v: string): v is PrefixedLang {
  return (PREFIXED_LANGS as readonly string[]).includes(v);
}

/** Pfad in einer Sprache: ("/imperien", "en") → "/en/imperien"; Deutsch ohne Präfix. */
export function langPath(path: string, lang: Lang): string {
  if (lang === "de") return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

/** hreflang-Liste für eine Seite (alle 13 Sprachen + x-default = Englisch). */
export function hreflang(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of ALL_LANGS) out[l] = langPath(path, l);
  out["x-default"] = langPath(path, "en");
  return out;
}

/** Sprachcode → Locale für og:locale */
export const OG_LOCALE: Record<Lang, string> = {
  de: "de_DE", en: "en_US", es: "es_ES", fr: "fr_FR", pt: "pt_BR", tr: "tr_TR", ru: "ru_RU",
  el: "el_GR", ar: "ar_AR", hi: "hi_IN", zh: "zh_CN", ja: "ja_JP", ko: "ko_KR",
};

/** Jahreszahl mit Epochen-Angabe in der jeweiligen Sprache (es gibt kein Jahr 0). */
export function formatYearL(y: number, lang: Lang): string {
  if (y === 0) y = 1;
  const n = Math.abs(y);
  const bc = y < 0;
  switch (lang) {
    case "de": return bc ? `${n} v. Chr.` : `${n} n. Chr.`;
    case "en": return bc ? `${n} BC` : `AD ${n}`;
    case "es": return bc ? `${n} a. C.` : `${n} d. C.`;
    case "fr": return bc ? `${n} av. J.-C.` : `${n} apr. J.-C.`;
    case "pt": return bc ? `${n} a.C.` : `${n} d.C.`;
    case "tr": return bc ? `MÖ ${n}` : `MS ${n}`;
    case "ru": return bc ? `${n} до н. э.` : `${n} н. э.`;
    case "el": return bc ? `${n} π.Χ.` : `${n} μ.Χ.`;
    case "ar": return bc ? `${n} ق.م` : `${n} م`;
    case "hi": return bc ? `${n} ईसा पूर्व` : `${n} ई.`;
    case "zh": return bc ? `公元前${n}年` : `公元${n}年`;
    case "ja": return bc ? `紀元前${n}年` : `${n}年`;
    case "ko": return bc ? `기원전 ${n}년` : `${n}년`;
  }
}

const NUM_LOCALE: Record<Lang, string> = {
  de: "de-DE", en: "en-US", es: "es-ES", fr: "fr-FR", pt: "pt-BR", tr: "tr-TR", ru: "ru-RU",
  el: "el-GR", ar: "ar", hi: "hi-IN", zh: "zh-CN", ja: "ja-JP", ko: "ko-KR",
};

export function formatNumberL(n: number, lang: Lang, maxFrac = 0, grouping = true): string {
  return n.toLocaleString(NUM_LOCALE[lang], { maximumFractionDigits: maxFrac, useGrouping: grouping });
}

/** Fläche lesbar: "5,3 Mio. km²", "5.3 million km²", "530万平方公里" … */
export function formatAreaL(km2: number, lang: Lang): string {
  if (lang === "zh" || lang === "ja" || lang === "ko") {
    const wan = km2 / 10_000;
    const v = formatNumberL(wan >= 100 ? Math.round(wan) : Math.round(wan * 10) / 10, lang, 1, false);
    if (lang === "zh") return `${v}万平方公里`;
    if (lang === "ja") return `${v}万km²`;
    return `${v}만 km²`;
  }
  if (km2 >= 1_000_000) {
    const v = formatNumberL(km2 / 1_000_000, lang, 1);
    const unit: Record<string, string> = {
      de: "Mio. km²", en: "million km²", es: "millones de km²", fr: "millions de km²", pt: "milhões de km²",
      tr: "milyon km²", ru: "млн км²", el: "εκατ. km²", ar: "مليون كم²", hi: "मिलियन वर्ग किमी",
    };
    return `${v} ${unit[lang]}`;
  }
  const v = formatNumberL(Math.round(km2 / 1000) * 1000, lang);
  return lang === "ar" ? `${v} كم²` : lang === "hi" ? `${v} वर्ग किमी` : `${v} km²`;
}

type PageKey = "home" | "universum" | "sternenhimmel" | "imperien" | "reiche";
type PageText = { title: string; description: string };

/** Titel und Beschreibung je Seite und Sprache (für Google & Link-Vorschauen). */
export const PAGE_SEO: Record<PageKey, Record<Lang, PageText>> = {
  home: {
    de: { title: "CENTAURIAN — Musik, Universum & Geschichte", description: "Songs suchen und direkt im Browser hören, das Sonnensystem interaktiv entdecken, den Sternenhimmel live sehen und auf einer Weltgeschichte-Karte alle Imperien von 3400 v. Chr. bis heute erleben — kostenlos, ohne Anmeldung." },
    en: { title: "CENTAURIAN — Music, Universe & World History", description: "Search songs and play them in your browser, explore a live 3D solar system, see tonight's night sky and scrub through every empire in history on an interactive world map from 3400 BC to today — free, no sign-up." },
    es: { title: "CENTAURIAN — Música, universo e historia mundial", description: "Busca canciones y escúchalas en el navegador, explora el sistema solar en 3D en vivo, mira el cielo nocturno de hoy y recorre todos los imperios de la historia en un mapa interactivo desde el 3400 a. C. hasta hoy. Gratis y sin registro." },
    fr: { title: "CENTAURIAN — Musique, univers et histoire du monde", description: "Cherche des chansons et écoute-les dans le navigateur, explore le système solaire en 3D en direct, observe le ciel de ce soir et parcours tous les empires de l'histoire sur une carte interactive de 3400 av. J.-C. à aujourd'hui. Gratuit, sans inscription." },
    pt: { title: "CENTAURIAN — Música, universo e história mundial", description: "Pesquise músicas e ouça no navegador, explore o sistema solar em 3D ao vivo, veja o céu desta noite e percorra todos os impérios da história num mapa interativo de 3400 a.C. até hoje. Grátis e sem cadastro." },
    tr: { title: "CENTAURIAN — Müzik, evren ve dünya tarihi", description: "Şarkı ara ve tarayıcıda dinle, canlı 3B güneş sistemini keşfet, bu geceki gökyüzünü gör ve MÖ 3400'den bugüne tarihteki tüm imparatorlukları etkileşimli bir haritada incele. Ücretsiz, kayıt gerekmez." },
    ru: { title: "CENTAURIAN — музыка, Вселенная и мировая история", description: "Ищи песни и слушай их прямо в браузере, исследуй Солнечную систему в 3D в реальном времени, смотри звёздное небо сегодня и листай все империи истории на интерактивной карте с 3400 г. до н. э. до наших дней. Бесплатно и без регистрации." },
    el: { title: "CENTAURIAN — Μουσική, σύμπαν και παγκόσμια ιστορία", description: "Βρες τραγούδια και άκουσέ τα στον browser, εξερεύνησε ζωντανά το ηλιακό σύστημα σε 3D, δες τον αποψινό ουρανό και όλες τις αυτοκρατορίες της ιστορίας σε διαδραστικό χάρτη από το 3400 π.Χ. έως σήμερα. Δωρεάν, χωρίς εγγραφή." },
    ar: { title: "CENTAURIAN — موسيقى وكون وتاريخ العالم", description: "ابحث عن الأغاني واستمع إليها في المتصفح، واستكشف المجموعة الشمسية ثلاثية الأبعاد مباشرة، وشاهد سماء الليلة، وتصفّح كل إمبراطوريات التاريخ على خريطة تفاعلية من 3400 ق.م حتى اليوم. مجاناً ودون تسجيل." },
    hi: { title: "CENTAURIAN — संगीत, ब्रह्मांड और विश्व इतिहास", description: "गाने खोजें और ब्राउज़र में सुनें, लाइव 3D सौरमंडल देखें, आज रात का आसमान देखें और 3400 ईसा पूर्व से आज तक इतिहास के सभी साम्राज्यों को इंटरैक्टिव नक्शे पर देखें — मुफ़्त, बिना साइन-अप।" },
    zh: { title: "CENTAURIAN — 音乐、宇宙与世界历史", description: "搜索歌曲并在浏览器中直接播放，实时探索3D太阳系，查看今晚的星空，并在互动地图上浏览从公元前3400年至今历史上的所有帝国。免费，无需注册。" },
    ja: { title: "CENTAURIAN — 音楽・宇宙・世界史", description: "曲を検索してブラウザで再生、リアルタイムの3D太陽系を探検、今夜の星空を表示、そして紀元前3400年から現在までの歴史上すべての帝国をインタラクティブな地図でたどれます。無料・登録不要。" },
    ko: { title: "CENTAURIAN — 음악, 우주, 세계사", description: "노래를 검색해 브라우저에서 바로 듣고, 실시간 3D 태양계를 탐험하고, 오늘 밤하늘을 보고, 기원전 3400년부터 오늘까지 역사 속 모든 제국을 인터랙티브 지도로 살펴보세요. 무료, 가입 불필요." },
  },
  universum: {
    de: { title: "Sonnensystem live & Maschine der Ewigkeit — Universum entdecken", description: "Interaktives Sonnensystem mit echten Planeten-Positionen (NASA-Daten), echtem Maßstab und Zoom. Dazu die Maschine der Ewigkeit: Zahnräder, deren letztes sich erst in 13,8 Milliarden Jahren einmal dreht — plus Alter des Universums live." },
    en: { title: "Live Solar System 3D & Eternity Gear Machine — Explore the Universe", description: "Interactive 3D solar system with the real current positions of all planets (NASA/JPL data), true scale and zoom. Plus the eternity machine: a chain of gears whose last one turns once every 13.8 billion years — and the age of the universe, live." },
    es: { title: "Sistema solar en vivo 3D y máquina de la eternidad — Explora el universo", description: "Sistema solar 3D interactivo con las posiciones reales de los planetas (datos de la NASA/JPL), escala real y zoom. Además, la máquina de la eternidad: engranajes cuyo último gira una vez cada 13 800 millones de años, y la edad del universo en vivo." },
    fr: { title: "Système solaire en direct 3D et machine de l'éternité — Explorer l'univers", description: "Système solaire 3D interactif avec les positions réelles des planètes (données NASA/JPL), échelle réelle et zoom. Et la machine de l'éternité : des engrenages dont le dernier fait un tour tous les 13,8 milliards d'années — plus l'âge de l'univers en direct." },
    pt: { title: "Sistema solar ao vivo 3D e máquina da eternidade — Explore o universo", description: "Sistema solar 3D interativo com as posições reais dos planetas (dados NASA/JPL), escala real e zoom. Mais a máquina da eternidade: engrenagens cuja última dá uma volta a cada 13,8 bilhões de anos — e a idade do universo ao vivo." },
    tr: { title: "Canlı 3B Güneş Sistemi ve Sonsuzluk Makinesi — Evreni keşfet", description: "Gezegenlerin gerçek konumlarıyla (NASA/JPL verileri) etkileşimli 3B güneş sistemi, gerçek ölçek ve yakınlaştırma. Ayrıca sonsuzluk makinesi: son dişlisi 13,8 milyar yılda bir döner — ve evrenin yaşı canlı." },
    ru: { title: "Солнечная система онлайн в 3D и машина вечности — исследуй Вселенную", description: "Интерактивная 3D-модель Солнечной системы с реальными положениями планет (данные NASA/JPL), настоящим масштабом и зумом. А также машина вечности: шестерни, последняя из которых делает один оборот за 13,8 млрд лет, и возраст Вселенной в реальном времени." },
    el: { title: "Ηλιακό σύστημα ζωντανά σε 3D & Μηχανή της Αιωνιότητας", description: "Διαδραστικό ηλιακό σύστημα 3D με τις πραγματικές θέσεις των πλανητών (δεδομένα NASA/JPL), πραγματική κλίμακα και zoom. Και η μηχανή της αιωνιότητας: γρανάζια, το τελευταίο των οποίων κάνει μία στροφή κάθε 13,8 δισ. χρόνια." },
    ar: { title: "المجموعة الشمسية مباشرة ثلاثية الأبعاد وآلة الأبدية — استكشف الكون", description: "مجموعة شمسية تفاعلية ثلاثية الأبعاد بالمواقع الحقيقية للكواكب (بيانات ناسا/JPL) وبمقياس حقيقي وتكبير. بالإضافة إلى آلة الأبدية: تروس يدور آخرها مرة واحدة كل 13.8 مليار سنة، وعمر الكون مباشرة." },
    hi: { title: "लाइव 3D सौरमंडल और अनंत काल की मशीन — ब्रह्मांड की खोज", description: "ग्रहों की असली मौजूदा स्थिति (NASA/JPL डेटा), असली पैमाने और ज़ूम के साथ इंटरैक्टिव 3D सौरमंडल। साथ में अनंत काल की मशीन: गियर जिनका आख़िरी गियर 13.8 अरब साल में एक चक्कर लगाता है — और ब्रह्मांड की उम्र लाइव।" },
    zh: { title: "实时3D太阳系与永恒齿轮机 — 探索宇宙", description: "互动3D太阳系，显示行星的真实当前位置（NASA/JPL数据），支持真实比例和缩放。还有永恒齿轮机：最后一个齿轮每138亿年才转一圈——以及实时的宇宙年龄。" },
    ja: { title: "リアルタイム3D太陽系と永遠の歯車マシン — 宇宙を探検", description: "惑星の実際の現在位置（NASA/JPLデータ）を表示するインタラクティブな3D太陽系。実寸スケールとズーム対応。さらに最後の歯車が138億年に一回転する「永遠のマシン」と、宇宙の年齢をリアルタイムで。" },
    ko: { title: "실시간 3D 태양계와 영원의 기어 머신 — 우주 탐험", description: "행성의 실제 현재 위치(NASA/JPL 데이터)를 보여주는 인터랙티브 3D 태양계, 실제 축척과 확대 지원. 마지막 톱니바퀴가 138억 년에 한 번 도는 영원의 기계와 실시간 우주 나이까지." },
  },
  sternenhimmel: {
    de: { title: "Sternenhimmel live — welche Sterne siehst du gerade?", description: "Interaktive Sternkarte für deinen Ort: 108.000 echte Sterne in Teleskop-Farben, Sternbilder, Planeten, Mond, ISS und Milchstraße — live oder zu jeder Uhrzeit. Handy in den Himmel halten, Sterne antippen und mehr erfahren." },
    en: { title: "Night Sky Map Live — Which Stars Can You See Right Now?", description: "Free interactive star map for your location: 108,000 real stars in telescope colours, constellations, planets, Moon, ISS and the Milky Way — live or at any time. Point your phone at the sky, tap a star and learn about it. No app needed." },
    es: { title: "Mapa del cielo en vivo — ¿qué estrellas ves ahora?", description: "Mapa estelar interactivo y gratuito para tu ubicación: 108 000 estrellas reales, constelaciones, planetas, Luna, ISS y Vía Láctea, en vivo o a cualquier hora. Apunta el móvil al cielo y toca una estrella. Sin instalar nada." },
    fr: { title: "Carte du ciel en direct — quelles étoiles vois-tu maintenant ?", description: "Carte des étoiles interactive et gratuite pour ta position : 108 000 vraies étoiles, constellations, planètes, Lune, ISS et Voie lactée, en direct ou à toute heure. Pointe ton téléphone vers le ciel et touche une étoile. Sans application." },
    pt: { title: "Mapa do céu ao vivo — que estrelas você vê agora?", description: "Mapa estelar interativo e grátis para sua localização: 108.000 estrelas reais, constelações, planetas, Lua, ISS e Via Láctea, ao vivo ou a qualquer hora. Aponte o celular para o céu e toque numa estrela. Sem instalar app." },
    tr: { title: "Canlı gökyüzü haritası — şu an hangi yıldızları görüyorsun?", description: "Konumun için ücretsiz etkileşimli yıldız haritası: 108.000 gerçek yıldız, takımyıldızlar, gezegenler, Ay, ISS ve Samanyolu — canlı ya da istediğin saatte. Telefonu gökyüzüne tut, bir yıldıza dokun. Uygulama gerekmez." },
    ru: { title: "Карта звёздного неба онлайн — какие звёзды видны сейчас?", description: "Бесплатная интерактивная карта звёздного неба для твоего места: 108 000 настоящих звёзд, созвездия, планеты, Луна, МКС и Млечный Путь — сейчас или в любое время. Наведи телефон на небо и коснись звезды. Без установки." },
    el: { title: "Χάρτης ουρανού ζωντανά — ποια αστέρια βλέπεις τώρα;", description: "Δωρεάν διαδραστικός χάρτης αστεριών για την τοποθεσία σου: 108.000 πραγματικά αστέρια, αστερισμοί, πλανήτες, Σελήνη, ISS και Γαλαξίας — ζωντανά ή οποιαδήποτε ώρα. Στρέψε το κινητό στον ουρανό. Χωρίς εφαρμογή." },
    ar: { title: "خريطة السماء مباشرة — ما النجوم التي تراها الآن؟", description: "خريطة نجوم تفاعلية مجانية لموقعك: 108,000 نجم حقيقي، والأبراج، والكواكب، والقمر، ومحطة الفضاء الدولية، ودرب التبانة — مباشرة أو في أي وقت. وجّه هاتفك نحو السماء والمس نجماً. دون تطبيق." },
    hi: { title: "लाइव तारामंडल नक्शा — अभी आपको कौन-से तारे दिख रहे हैं?", description: "आपकी जगह के लिए मुफ़्त इंटरैक्टिव तारा नक्शा: 1,08,000 असली तारे, तारामंडल, ग्रह, चाँद, ISS और आकाशगंगा — लाइव या किसी भी समय। फ़ोन आसमान की ओर करें और किसी तारे को छुएँ। कोई ऐप नहीं।" },
    zh: { title: "实时星空图 — 你现在能看到哪些星星？", description: "免费互动星图，适用于你的位置：10.8万颗真实恒星、星座、行星、月球、国际空间站和银河——实时或任意时间。把手机对准天空，点击星星了解更多。无需安装应用。" },
    ja: { title: "リアルタイム星空マップ — 今見えている星は？", description: "あなたの場所の無料インタラクティブ星図：10万8千個の実在の星、星座、惑星、月、ISS、天の川をリアルタイムまたは好きな時刻で。スマホを空にかざして星をタップ。アプリ不要。" },
    ko: { title: "실시간 밤하늘 지도 — 지금 어떤 별이 보일까?", description: "내 위치를 위한 무료 인터랙티브 별자리 지도: 실제 별 10만 8천 개, 별자리, 행성, 달, ISS, 은하수를 실시간 또는 원하는 시간에. 휴대폰을 하늘로 향하고 별을 터치하세요. 앱 설치 불필요." },
  },
  imperien: {
    de: { title: "Weltgeschichte Karte — interaktive historische Weltkarte", description: "Interaktive Weltgeschichte-Karte: alle Reiche, Imperien und Grenzen von 3400 v. Chr. bis heute, Jahr für Jahr auf einer Zeitleiste. Kostenlos, mit Infos zu jedem Reich." },
    en: { title: "World History Map — Every Empire from 3400 BC to Today", description: "Interactive world history map: every empire, kingdom and border from 3400 BC to today, year by year on a timeline. Free, with information on every empire. Watch empires rise and fall." },
    es: { title: "Mapa de la historia mundial — todos los imperios desde el 3400 a. C.", description: "Mapa interactivo de la historia mundial: todos los imperios, reinos y fronteras desde el 3400 a. C. hasta hoy, año por año. Gratis y con información de cada imperio." },
    fr: { title: "Carte de l'histoire du monde — tous les empires depuis 3400 av. J.-C.", description: "Carte interactive de l'histoire du monde : tous les empires, royaumes et frontières de 3400 av. J.-C. à aujourd'hui, année par année. Gratuit, avec des infos sur chaque empire." },
    pt: { title: "Mapa da história mundial — todos os impérios desde 3400 a.C.", description: "Mapa interativo da história mundial: todos os impérios, reinos e fronteiras de 3400 a.C. até hoje, ano a ano. Grátis e com informações sobre cada império." },
    tr: { title: "Dünya tarihi haritası — MÖ 3400'den bugüne tüm imparatorluklar", description: "Etkileşimli dünya tarihi haritası: MÖ 3400'den bugüne tüm imparatorluklar, krallıklar ve sınırlar, yıl yıl bir zaman çizelgesinde. Ücretsiz, her imparatorluk hakkında bilgiyle." },
    ru: { title: "Карта мировой истории — все империи с 3400 г. до н. э.", description: "Интерактивная карта мировой истории: все империи, царства и границы с 3400 г. до н. э. до наших дней, год за годом на шкале времени. Бесплатно, с описанием каждой державы." },
    el: { title: "Χάρτης παγκόσμιας ιστορίας — όλες οι αυτοκρατορίες από το 3400 π.Χ.", description: "Διαδραστικός χάρτης παγκόσμιας ιστορίας: όλες οι αυτοκρατορίες, τα βασίλεια και τα σύνορα από το 3400 π.Χ. έως σήμερα, χρονιά προς χρονιά. Δωρεάν, με πληροφορίες για κάθε αυτοκρατορία." },
    ar: { title: "خريطة تاريخ العالم — كل الإمبراطوريات منذ 3400 ق.م", description: "خريطة تفاعلية لتاريخ العالم: كل الإمبراطوريات والممالك والحدود من 3400 ق.م حتى اليوم، عاماً بعد عام على خط زمني. مجانية مع معلومات عن كل إمبراطورية." },
    hi: { title: "विश्व इतिहास का नक्शा — 3400 ईसा पूर्व से आज तक सभी साम्राज्य", description: "इंटरैक्टिव विश्व इतिहास नक्शा: 3400 ईसा पूर्व से आज तक सभी साम्राज्य, राज्य और सीमाएँ, साल-दर-साल टाइमलाइन पर। मुफ़्त, हर साम्राज्य की जानकारी के साथ।" },
    zh: { title: "世界历史地图 — 从公元前3400年至今的所有帝国", description: "互动世界历史地图：从公元前3400年至今所有的帝国、王国和疆界，按时间轴逐年浏览。免费，并附每个帝国的介绍。" },
    ja: { title: "世界史地図 — 紀元前3400年から現在までのすべての帝国", description: "インタラクティブな世界史地図：紀元前3400年から現在までのすべての帝国・王国・国境を年表で一年ずつ表示。無料で各帝国の解説付き。" },
    ko: { title: "세계사 지도 — 기원전 3400년부터 오늘까지 모든 제국", description: "인터랙티브 세계사 지도: 기원전 3400년부터 오늘까지 모든 제국, 왕국, 국경을 타임라인에서 한 해씩 살펴보세요. 무료, 각 제국 정보 포함." },
  },
  reiche: {
    de: { title: "Alle Reiche & Imperien der Weltgeschichte — Liste mit Karten", description: "300 historische Reiche und Imperien von der Antike bis zur Moderne: Zeitraum, größte Ausdehnung und Karte — vom Römischen Reich über das Mongolische Reich bis zum Britischen Weltreich." },
    en: { title: "List of Empires in History — Maps, Size & Dates", description: "300 historical empires from antiquity to modern times: dates, maximum extent and a map of each — from the Roman Empire and the Mongol Empire to the British Empire." },
    es: { title: "Lista de imperios de la historia — mapas, tamaño y fechas", description: "300 imperios históricos de la Antigüedad a la época moderna: fechas, máxima extensión y mapa de cada uno, del Imperio romano al Imperio mongol y al Imperio británico." },
    fr: { title: "Liste des empires de l'histoire — cartes, superficie et dates", description: "300 empires historiques de l'Antiquité à l'époque moderne : dates, extension maximale et carte de chacun — de l'Empire romain à l'Empire mongol et à l'Empire britannique." },
    pt: { title: "Lista de impérios da história — mapas, tamanho e datas", description: "300 impérios históricos da Antiguidade à era moderna: datas, extensão máxima e mapa de cada um — do Império Romano ao Império Mongol e ao Império Britânico." },
    tr: { title: "Tarihteki imparatorluklar listesi — haritalar, büyüklük ve tarihler", description: "Antik çağdan modern zamanlara 300 tarihi imparatorluk: tarihleri, en geniş sınırları ve haritaları — Roma İmparatorluğu'ndan Moğol İmparatorluğu'na ve Britanya İmparatorluğu'na." },
    ru: { title: "Список империй в истории — карты, площадь и даты", description: "300 исторических держав от древности до Нового времени: даты, максимальная территория и карта каждой — от Римской империи и Монгольской империи до Британской империи." },
    el: { title: "Λίστα αυτοκρατοριών της ιστορίας — χάρτες, έκταση και χρονολογίες", description: "300 ιστορικές αυτοκρατορίες από την αρχαιότητα έως τη σύγχρονη εποχή: χρονολογίες, μέγιστη έκταση και χάρτης — από τη Ρωμαϊκή και τη Μογγολική έως τη Βρετανική Αυτοκρατορία." },
    ar: { title: "قائمة إمبراطوريات التاريخ — خرائط ومساحات وتواريخ", description: "300 إمبراطورية تاريخية من العصور القديمة حتى العصر الحديث: التواريخ وأقصى امتداد وخريطة لكل منها — من الإمبراطورية الرومانية والمغولية إلى البريطانية." },
    hi: { title: "इतिहास के साम्राज्यों की सूची — नक्शे, क्षेत्रफल और तिथियाँ", description: "प्राचीन काल से आधुनिक काल तक 300 ऐतिहासिक साम्राज्य: तिथियाँ, अधिकतम विस्तार और हर एक का नक्शा — रोमन साम्राज्य और मंगोल साम्राज्य से लेकर ब्रिटिश साम्राज्य तक।" },
    zh: { title: "历史帝国列表 — 地图、面积与年代", description: "从古代到近现代的300个历史帝国：年代、最大疆域以及每个帝国的地图——从罗马帝国、蒙古帝国到大英帝国。" },
    ja: { title: "歴史上の帝国一覧 — 地図・面積・年代", description: "古代から近代までの300の歴史的帝国：年代、最大版図、それぞれの地図——ローマ帝国やモンゴル帝国から大英帝国まで。" },
    ko: { title: "역사 속 제국 목록 — 지도, 면적, 연대", description: "고대부터 근현대까지 300개 역사 제국: 연대, 최대 영토, 각 제국의 지도 — 로마 제국과 몽골 제국부터 대영 제국까지." },
  },
};

/** Vorschau-Titel für geteilte Jahres-Links (/imperien?jahr=1200). */
export const YEAR_SHARE: Record<Lang, { title: (y: string) => string; description: (y: string) => string }> = {
  de: { title: (y) => `Die Welt im Jahr ${y} — Weltgeschichte Karte`, description: (y) => `So sah die Welt im Jahr ${y} aus: alle Reiche, Imperien und Grenzen auf der interaktiven Weltgeschichte-Karte.` },
  en: { title: (y) => `The World in ${y} — World History Map`, description: (y) => `What the world looked like in ${y}: every empire, kingdom and border on the interactive world history map.` },
  es: { title: (y) => `El mundo en el año ${y} — Mapa de la historia`, description: (y) => `Así era el mundo en el año ${y}: todos los imperios, reinos y fronteras en el mapa interactivo de la historia.` },
  fr: { title: (y) => `Le monde en ${y} — Carte de l'histoire`, description: (y) => `À quoi ressemblait le monde en ${y} : tous les empires, royaumes et frontières sur la carte interactive de l'histoire.` },
  pt: { title: (y) => `O mundo no ano ${y} — Mapa da história`, description: (y) => `Como era o mundo no ano ${y}: todos os impérios, reinos e fronteiras no mapa interativo da história.` },
  tr: { title: (y) => `${y} yılında dünya — Dünya tarihi haritası`, description: (y) => `${y} yılında dünya nasıl görünüyordu: etkileşimli tarih haritasında tüm imparatorluklar, krallıklar ve sınırlar.` },
  ru: { title: (y) => `Мир в ${y} — Карта мировой истории`, description: (y) => `Каким был мир в ${y}: все империи, царства и границы на интерактивной карте истории.` },
  el: { title: (y) => `Ο κόσμος το ${y} — Χάρτης ιστορίας`, description: (y) => `Πώς ήταν ο κόσμος το ${y}: όλες οι αυτοκρατορίες, τα βασίλεια και τα σύνορα στον διαδραστικό χάρτη.` },
  ar: { title: (y) => `العالم في عام ${y} — خريطة تاريخ العالم`, description: (y) => `هكذا كان العالم في عام ${y}: كل الإمبراطوريات والممالك والحدود على الخريطة التفاعلية.` },
  hi: { title: (y) => `${y} में दुनिया — विश्व इतिहास नक्शा`, description: (y) => `${y} में दुनिया कैसी थी: इंटरैक्टिव नक्शे पर सभी साम्राज्य, राज्य और सीमाएँ।` },
  zh: { title: (y) => `${y}的世界 — 世界历史地图`, description: (y) => `${y}的世界是什么样子：互动地图上的所有帝国、王国和疆界。` },
  ja: { title: (y) => `${y}の世界 — 世界史地図`, description: (y) => `${y}の世界の姿：インタラクティブ地図ですべての帝国・王国・国境を表示。` },
  ko: { title: (y) => `${y}의 세계 — 세계사 지도`, description: (y) => `${y}의 세계 모습: 인터랙티브 지도에서 모든 제국, 왕국, 국경을 확인하세요.` },
};

/** Vorschaubild-Satz: Deutsch eigene Bilder, alle anderen Sprachen die englischen. */
export function ogImage(year: number, lang: Lang): string {
  const y = year >= 2012 ? 2024 : Math.min(2000, Math.max(-3400, Math.round(year / 50) * 50));
  return lang === "de" ? `/og/imperien/${y}.jpg` : `/og/imperien/en/${y}.jpg`;
}
