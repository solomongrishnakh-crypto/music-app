/**
 * Wörterbuch der wiederkehrenden UI-Textbausteine (Menüs, Buttons,
 * Überschriften, Hinweistexte, aria-labels) in allen 13 unterstützten
 * Sprachen (Nutzerwunsch 20.09.2026: "füge mehr sprachen wie hindi,
 * chinesich, koreanisch, japanisch, spanisch, französich, türkisch,
 * russisch, portuguiesich, arabisch, griechisch").
 *
 * Lange, individuelle Inhalte (Planetenbeschreibungen, Universum-Fakten)
 * werden separat in src/data/solarSystem.ts und src/app/universum/page.tsx
 * lokalisiert (LocalizedText, siehe lib/i18n.ts) — dort ist aktuell
 * Deutsch+Englisch vollständig, die übrigen Sprachen fallen bis zur
 * weiteren Übersetzung auf Englisch zurück.
 */
// Bei 13 Sprachen x ~30 Schlüsseln wird die von `as const` erzeugte
// Literal-Typ-Union beim generischen Indexzugriff (TRANSLATIONS[key]?.[lang]
// in LanguageContext.tsx) zu komplex und TypeScript kollabiert sie zu
// `never` ("Property 'de' does not exist on type 'never'", Vercel-Build-
// Fehler 20.09.2026). Fix: fester Werttyp TranslationEntry statt `as const`-
// Literalinferenz pro Eintrag — hält die Objekt-Keys weiterhin als Literal-
// Union (für TranslationKey/Autovervollständigung), aber jeder Eintrag hat
// denselben, einfachen Werttyp.
interface TranslationEntry {
  de: string;
  en: string;
  hi: string;
  zh: string;
  ko: string;
  ja: string;
  es: string;
  fr: string;
  tr: string;
  ru: string;
  pt: string;
  ar: string;
  el: string;
}

const TRANSLATIONS_SOURCE = {
  // Navbar
  navMusic: {
    de: "Musik", en: "Music", hi: "संगीत", zh: "音乐", ko: "음악", ja: "音楽",
    es: "Música", fr: "Musique", tr: "Müzik", ru: "Музыка", pt: "Música", ar: "الموسيقى", el: "Μουσική",
  },
  navAiNews: {
    de: "AI News", en: "AI News", hi: "AI समाचार", zh: "AI新闻", ko: "AI 뉴스", ja: "AIニュース",
    es: "Noticias IA", fr: "Actu IA", tr: "AI Haberleri", ru: "Новости ИИ", pt: "Notícias IA", ar: "أخبار الذكاء الاصطناعي", el: "Νέα AI",
  },
  navContacts: {
    de: "Kontakte", en: "Contact", hi: "संपर्क", zh: "联系方式", ko: "연락처", ja: "連絡先",
    es: "Contacto", fr: "Contact", tr: "İletişim", ru: "Контакты", pt: "Contato", ar: "اتصل بنا", el: "Επικοινωνία",
  },

  // Allgemein
  back: {
    de: "Zurück", en: "Back", hi: "वापस", zh: "返回", ko: "뒤로", ja: "戻る",
    es: "Atrás", fr: "Retour", tr: "Geri", ru: "Назад", pt: "Voltar", ar: "رجوع", el: "Πίσω",
  },
  close: {
    de: "Schließen", en: "Close", hi: "बंद करें", zh: "关闭", ko: "닫기", ja: "閉じる",
    es: "Cerrar", fr: "Fermer", tr: "Kapat", ru: "Закрыть", pt: "Fechar", ar: "إغلاق", el: "Κλείσιμο",
  },

  // Suche
  searchPlaceholder: {
    de: "Künstler, Songs oder Alben suchen …", en: "Search artists, songs or albums …",
    hi: "कलाकार, गाने या एल्बम खोजें …", zh: "搜索艺人、歌曲或专辑…", ko: "아티스트, 곡, 앨범 검색…", ja: "アーティスト、曲、アルバムを検索…",
    es: "Buscar artistas, canciones o álbumes…", fr: "Rechercher artistes, titres ou albums…",
    tr: "Sanatçı, şarkı veya albüm ara…", ru: "Поиск артистов, песен или альбомов…",
    pt: "Buscar artistas, músicas ou álbuns…", ar: "ابحث عن فنانين أو أغانٍ أو ألبومات…", el: "Αναζήτηση καλλιτεχνών, τραγουδιών ή άλμπουμ…",
  },
  searchAriaLabel: {
    de: "Musiksuche", en: "Music search", hi: "संगीत खोज", zh: "音乐搜索", ko: "음악 검색", ja: "音楽検索",
    es: "Búsqueda de música", fr: "Recherche musicale", tr: "Müzik arama", ru: "Поиск музыки", pt: "Busca de música", ar: "بحث الموسيقى", el: "Αναζήτηση μουσικής",
  },

  // Player
  playerPlay: {
    de: "Abspielen", en: "Play", hi: "चलाएं", zh: "播放", ko: "재생", ja: "再生",
    es: "Reproducir", fr: "Lecture", tr: "Oynat", ru: "Воспроизвести", pt: "Reproduzir", ar: "تشغيل", el: "Αναπαραγωγή",
  },
  playerPause: {
    de: "Pause", en: "Pause", hi: "रोकें", zh: "暂停", ko: "일시정지", ja: "一時停止",
    es: "Pausa", fr: "Pause", tr: "Duraklat", ru: "Пауза", pt: "Pausar", ar: "إيقاف مؤقت", el: "Παύση",
  },
  playerNext: {
    de: "Nächster Titel", en: "Next track", hi: "अगला ट्रैक", zh: "下一曲", ko: "다음 트랙", ja: "次の曲",
    es: "Siguiente pista", fr: "Piste suivante", tr: "Sonraki parça", ru: "Следующий трек", pt: "Próxima faixa", ar: "المقطع التالي", el: "Επόμενο κομμάτι",
  },
  playerPrevious: {
    de: "Vorheriger Titel", en: "Previous track", hi: "पिछला ट्रैक", zh: "上一曲", ko: "이전 트랙", ja: "前の曲",
    es: "Pista anterior", fr: "Piste précédente", tr: "Önceki parça", ru: "Предыдущий трек", pt: "Faixa anterior", ar: "المقطع السابق", el: "Προηγούμενο κομμάτι",
  },

  // Universum-Seite
  universeLabel: {
    de: "// Universum", en: "// Universe", hi: "// ब्रह्मांड", zh: "// 宇宙", ko: "// 우주", ja: "// 宇宙",
    es: "// Universo", fr: "// Univers", tr: "// Evren", ru: "// Вселенная", pt: "// Universo", ar: "// الكون", el: "// Σύμπαν",
  },
  universeTitle: {
    de: "Universum kennenlernen", en: "Explore the Universe", hi: "ब्रह्मांड को जानें", zh: "探索宇宙", ko: "우주 알아보기", ja: "宇宙を知る",
    es: "Descubre el Universo", fr: "Découvrir l'Univers", tr: "Evreni Keşfet", ru: "Познакомьтесь со Вселенной", pt: "Conheça o Universo", ar: "تعرف على الكون", el: "Γνωρίστε το Σύμπαν",
  },
  universeInNumbers: {
    de: "// Universum in Zahlen", en: "// Universe in Numbers", hi: "// आंकड़ों में ब्रह्मांड", zh: "// 数字中的宇宙", ko: "// 숫자로 보는 우주", ja: "// 数字で見る宇宙",
    es: "// El Universo en cifras", fr: "// L'Univers en chiffres", tr: "// Rakamlarla Evren", ru: "// Вселенная в цифрах", pt: "// O Universo em números", ar: "// الكون بالأرقام", el: "// Το Σύμπαν σε αριθμούς",
  },
  solarSystemLabel: {
    de: "// Sonnensystem", en: "// Solar System", hi: "// सौर मंडल", zh: "// 太阳系", ko: "// 태양계", ja: "// 太陽系",
    es: "// Sistema Solar", fr: "// Système Solaire", tr: "// Güneş Sistemi", ru: "// Солнечная система", pt: "// Sistema Solar", ar: "// النظام الشمسي", el: "// Ηλιακό Σύστημα",
  },
  liveExplore: {
    de: "Live erkunden", en: "Explore live", hi: "लाइव देखें", zh: "实时探索", ko: "실시간 탐험", ja: "ライブで探索",
    es: "Explorar en vivo", fr: "Explorer en direct", tr: "Canlı keşfet", ru: "Исследовать вживую", pt: "Explorar ao vivo", ar: "استكشف مباشرة", el: "Εξερεύνηση ζωντανά",
  },
  universeIntro: {
    de: "Zahlen und Fakten zum Kosmos — vom Alter des Universums über Dunkle Materie bis zu Schwarzen Löchern. Auf eine Karte klicken für eine ausführlichere Erklärung. Dazu aktuelle Live-News aus der Raumfahrt.",
    en: "Numbers and facts about the cosmos — from the age of the universe to dark matter and black holes. Click a card for a more detailed explanation. Plus live space news.",
    hi: "ब्रह्मांड के बारे में आंकड़े और तथ्य — ब्रह्मांड की आयु से लेकर डार्क मैटर और ब्लैक होल तक। विस्तृत जानकारी के लिए किसी कार्ड पर क्लिक करें। साथ ही अंतरिक्ष की ताज़ा खबरें।",
    zh: "关于宇宙的数字与事实——从宇宙的年龄到暗物质与黑洞。点击卡片查看详细说明。此外还有航天领域的实时新闻。",
    ko: "우주에 관한 숫자와 사실 — 우주의 나이부터 암흑 물질, 블랙홀까지. 카드를 클릭하면 더 자세한 설명을 볼 수 있습니다. 실시간 우주 뉴스도 함께 제공됩니다.",
    ja: "宇宙に関する数字と事実 — 宇宙の年齢からダークマター、ブラックホールまで。カードをクリックすると詳しい説明が表示されます。最新の宇宙ニュースも。",
    es: "Números y datos sobre el cosmos: desde la edad del universo hasta la materia oscura y los agujeros negros. Haz clic en una tarjeta para ver una explicación más detallada. Además, noticias espaciales en vivo.",
    fr: "Chiffres et faits sur le cosmos — de l'âge de l'univers à la matière noire et aux trous noirs. Cliquez sur une carte pour une explication plus détaillée. Avec en plus l'actualité spatiale en direct.",
    tr: "Kozmosla ilgili sayılar ve gerçekler — evrenin yaşından karanlık maddeye ve kara deliklere kadar. Daha ayrıntılı bir açıklama için bir karta tıklayın. Ayrıca canlı uzay haberleri.",
    ru: "Цифры и факты о космосе — от возраста Вселенной до тёмной материи и чёрных дыр. Нажмите на карточку, чтобы узнать подробнее. А также свежие новости космонавтики.",
    pt: "Números e fatos sobre o cosmos — da idade do universo à matéria escura e buracos negros. Clique num cartão para uma explicação mais detalhada. Além de notícias espaciais ao vivo.",
    ar: "أرقام وحقائق عن الكون — من عمر الكون إلى المادة المظلمة والثقوب السوداء. انقر على بطاقة للحصول على شرح أكثر تفصيلاً. بالإضافة إلى أخبار الفضاء المباشرة.",
    el: "Αριθμοί και στοιχεία για το σύμπαν — από την ηλικία του σύμπαντος μέχρι τη σκοτεινή ύλη και τις μαύρες τρύπες. Κάντε κλικ σε μια κάρτα για πιο αναλυτική εξήγηση. Επιπλέον, ζωντανά νέα από το διάστημα.",
  },

  // Sonnensystem-Modal
  solarSystemTapHint: {
    de: "Planet tippen für Details", en: "Tap a planet for details", hi: "विवरण के लिए ग्रह पर टैप करें", zh: "点击行星查看详情", ko: "행성을 탭하면 자세히 보기", ja: "惑星をタップして詳細を表示",
    es: "Toca un planeta para más detalles", fr: "Touchez une planète pour les détails", tr: "Ayrıntılar için gezegene dokunun", ru: "Нажмите на планету для подробностей", pt: "Toque num planeta para detalhes", ar: "اضغط على كوكب لعرض التفاصيل", el: "Πατήστε έναν πλανήτη για λεπτομέρειες",
  },
  solarSystemDragHint: {
    de: "Ziehen: drehen & neigen · Scrollen: zoomen", en: "Drag: rotate & tilt · Scroll: zoom",
    hi: "खींचें: घुमाएं और झुकाएं · स्क्रॉल: ज़ूम करें", zh: "拖动：旋转与倾斜 · 滚动：缩放", ko: "드래그: 회전 및 기울이기 · 스크롤: 확대/축소", ja: "ドラッグ：回転・傾き · スクロール：ズーム",
    es: "Arrastrar: rotar e inclinar · Desplazar: zoom", fr: "Glisser : pivoter et incliner · Défiler : zoom",
    tr: "Sürükle: döndür ve eğ · Kaydır: yakınlaştır", ru: "Перетаскивание: вращение и наклон · Прокрутка: масштаб",
    pt: "Arrastar: girar e inclinar · Rolar: zoom", ar: "اسحب: تدوير وإمالة · مرر: تكبير", el: "Σύρετε: περιστροφή & κλίση · Κύλιση: ζουμ",
  },
  kindStar: {
    de: "Stern", en: "Star", hi: "तारा", zh: "恒星", ko: "항성", ja: "恒星",
    es: "Estrella", fr: "Étoile", tr: "Yıldız", ru: "Звезда", pt: "Estrela", ar: "نجم", el: "Αστέρι",
  },
  kindDwarf: {
    de: "Zwergplanet", en: "Dwarf planet", hi: "बौना ग्रह", zh: "矮行星", ko: "왜소행성", ja: "準惑星",
    es: "Planeta enano", fr: "Planète naine", tr: "Cüce gezegen", ru: "Карликовая планета", pt: "Planeta anão", ar: "كوكب قزم", el: "Πλανήτης νάνος",
  },
  kindProbe: {
    de: "Raumsonde", en: "Probe", hi: "अंतरिक्ष यान", zh: "探测器", ko: "탐사선", ja: "探査機",
    es: "Sonda espacial", fr: "Sonde spatiale", tr: "Uzay sondası", ru: "Космический зонд", pt: "Sonda espacial", ar: "مسبار فضائي", el: "Διαστημικός ανιχνευτής",
  },
  kindPlanet: {
    de: "Planet", en: "Planet", hi: "ग्रह", zh: "行星", ko: "행성", ja: "惑星",
    es: "Planeta", fr: "Planète", tr: "Gezegen", ru: "Планета", pt: "Planeta", ar: "كوكب", el: "Πλανήτης",
  },
  distanceToSun: {
    de: "Abstand zur Sonne", en: "Distance from Sun", hi: "सूर्य से दूरी", zh: "与太阳的距离", ko: "태양까지 거리", ja: "太陽からの距離",
    es: "Distancia al Sol", fr: "Distance au Soleil", tr: "Güneş'e uzaklık", ru: "Расстояние до Солнца", pt: "Distância ao Sol", ar: "المسافة من الشمس", el: "Απόσταση από τον Ήλιο",
  },
  orbitalPeriod: {
    de: "Umlaufzeit", en: "Orbital period", hi: "परिक्रमा अवधि", zh: "公转周期", ko: "공전 주기", ja: "公転周期",
    es: "Período orbital", fr: "Période orbitale", tr: "Yörünge periyodu", ru: "Период обращения", pt: "Período orbital", ar: "الفترة المدارية", el: "Περίοδος περιφοράς",
  },
  diameter: {
    de: "Durchmesser", en: "Diameter", hi: "व्यास", zh: "直径", ko: "지름", ja: "直径",
    es: "Diámetro", fr: "Diamètre", tr: "Çap", ru: "Диаметр", pt: "Diâmetro", ar: "القطر", el: "Διάμετρος",
  },
  moons: {
    de: "Monde", en: "Moons", hi: "उपग्रह", zh: "卫星数量", ko: "위성 수", ja: "衛星数",
    es: "Lunas", fr: "Lunes", tr: "Uydular", ru: "Спутники", pt: "Luas", ar: "الأقمار", el: "Δορυφόροι",
  },
  closeInfo: {
    de: "Info schließen", en: "Close info", hi: "जानकारी बंद करें", zh: "关闭信息", ko: "정보 닫기", ja: "情報を閉じる",
    es: "Cerrar información", fr: "Fermer les infos", tr: "Bilgiyi kapat", ru: "Закрыть информацию", pt: "Fechar informação", ar: "إغلاق المعلومات", el: "Κλείσιμο πληροφοριών",
  },

  // Imperien-Karte
  empiresBack: {
    de: "Zurück", en: "Back", hi: "वापस", zh: "返回", ko: "뒤로", ja: "戻る",
    es: "Atrás", fr: "Retour", tr: "Geri", ru: "Назад", pt: "Voltar", ar: "رجوع", el: "Πίσω",
  },
  empiresPlay: {
    de: "Durch die Jahre abspielen", en: "Play through the years", hi: "वर्षों के माध्यम से चलाएं", zh: "按年份播放", ko: "연도별로 재생", ja: "年代を再生",
    es: "Reproducir a través de los años", fr: "Lire à travers les années", tr: "Yıllar boyunca oynat", ru: "Воспроизвести по годам", pt: "Reproduzir ao longo dos anos", ar: "تشغيل عبر السنوات", el: "Αναπαραγωγή στα χρόνια",
  },
  empiresPause: {
    de: "Pause", en: "Pause", hi: "रोकें", zh: "暂停", ko: "일시정지", ja: "一時停止",
    es: "Pausa", fr: "Pause", tr: "Duraklat", ru: "Пауза", pt: "Pausar", ar: "إيقاف مؤقت", el: "Παύση",
  },
  empiresJumpStart: {
    de: "Zum Anfang springen", en: "Jump to start", hi: "शुरुआत पर जाएं", zh: "跳到开头", ko: "처음으로 이동", ja: "最初に移動",
    es: "Ir al inicio", fr: "Aller au début", tr: "Başa git", ru: "К началу", pt: "Ir para o início", ar: "الانتقال إلى البداية", el: "Μετάβαση στην αρχή",
  },
  empiresJumpEnd: {
    de: "Zum Ende springen", en: "Jump to end", hi: "अंत पर जाएं", zh: "跳到结尾", ko: "끝으로 이동", ja: "最後に移動",
    es: "Ir al final", fr: "Aller à la fin", tr: "Sona git", ru: "К концу", pt: "Ir para o fim", ar: "الانتقال إلى النهاية", el: "Μετάβαση στο τέλος",
  },
  empiresSpeed: {
    de: "Abspielgeschwindigkeit ändern", en: "Change playback speed", hi: "प्लेबैक गति बदलें", zh: "更改播放速度", ko: "재생 속도 변경", ja: "再生速度を変更",
    es: "Cambiar velocidad de reproducción", fr: "Changer la vitesse de lecture", tr: "Oynatma hızını değiştir", ru: "Изменить скорость воспроизведения", pt: "Alterar velocidade de reprodução", ar: "تغيير سرعة التشغيل", el: "Αλλαγή ταχύτητας αναπαραγωγής",
  },
  empiresYearInput: {
    de: "Jahr eingeben", en: "Enter year", hi: "वर्ष दर्ज करें", zh: "输入年份", ko: "연도 입력", ja: "年を入力",
    es: "Introducir año", fr: "Saisir l'année", tr: "Yıl girin", ru: "Введите год", pt: "Inserir ano", ar: "أدخل السنة", el: "Εισαγωγή έτους",
  },
  empiresYearSelect: {
    de: "Jahr auswählen", en: "Select year", hi: "वर्ष चुनें", zh: "选择年份", ko: "연도 선택", ja: "年を選択",
    es: "Seleccionar año", fr: "Sélectionner l'année", tr: "Yıl seçin", ru: "Выберите год", pt: "Selecionar ano", ar: "اختر السنة", el: "Επιλογή έτους",
  },
  navEmpiresLabel: {
    de: "Große Imperien", en: "Great Empires", hi: "महान साम्राज्य", zh: "伟大帝国", ko: "위대한 제국", ja: "大帝国",
    es: "Grandes Imperios", fr: "Grands Empires", tr: "Büyük İmparatorluklar", ru: "Великие империи", pt: "Grandes Impérios", ar: "الإمبراطوريات العظيمة", el: "Μεγάλες Αυτοκρατορίες",
  },

  empiresTitle: {
    de: "Die Welt durch die Jahrhunderte", en: "The World Through the Centuries",
    hi: "सदियों से होकर दुनिया", zh: "穿越世纪的世界", ko: "세기를 통과한 세계", ja: "世紀を超える世界",
    es: "El mundo a través de los siglos", fr: "Le monde à travers les siècles", tr: "Yüzyıllar Boyunca Dünya",
    ru: "Мир сквозь века", pt: "O mundo através dos séculos", ar: "العالم عبر القرون", el: "Ο κόσμος μέσα από τους αιώνες",
  },
  empiresIntroPrefix: {
    de: "Historische Grenzen von der Antike bis heute — große Reiche (rot, mit Namen auf der Karte) auf einer echten Zeitleiste. Auf ein Gebiet klicken für eine ausführliche Beschreibung. Datenquelle:",
    en: "Historical borders from antiquity to today — major empires (red, labeled on the map) on a real timeline. Click a territory for a detailed description. Data source:",
    hi: "प्राचीन काल से आज तक की ऐतिहासिक सीमाएं — बड़े साम्राज्य (लाल, मानचित्र पर नामांकित) एक वास्तविक समयरेखा पर। विस्तृत विवरण के लिए किसी क्षेत्र पर क्लिक करें। डेटा स्रोत:",
    zh: "从古代到今天的历史边界——大帝国（红色，地图上标注名称）呈现在真实的时间线上。点击某个地区查看详细说明。数据来源：",
    ko: "고대부터 오늘날까지의 역사적 국경 — 실제 타임라인 위에 표시된 주요 제국(빨간색, 지도에 이름 표시). 자세한 설명을 보려면 지역을 클릭하세요. 데이터 출처:",
    ja: "古代から現代までの歴史的国境 — 実際の年表上に表示される主要な帝国（赤色、地図上に名前表示）。詳しい説明を見るには地域をクリックしてください。データ出典：",
    es: "Fronteras históricas desde la Antigüedad hasta hoy — grandes imperios (en rojo, con nombre en el mapa) en una línea temporal real. Haz clic en un territorio para una descripción detallada. Fuente de datos:",
    fr: "Frontières historiques de l'Antiquité à aujourd'hui — grands empires (en rouge, nommés sur la carte) sur une véritable chronologie. Cliquez sur un territoire pour une description détaillée. Source des données :",
    tr: "Antik çağdan günümüze tarihi sınırlar — gerçek bir zaman çizelgesinde büyük imparatorluklar (kırmızı, haritada adlandırılmış). Ayrıntılı açıklama için bir bölgeye tıklayın. Veri kaynağı:",
    ru: "Исторические границы от античности до наших дней — крупные империи (красным, с названиями на карте) на настоящей временной шкале. Нажмите на territoriю для подробного описания. Источник данных:",
    pt: "Fronteiras históricas da Antiguidade até hoje — grandes impérios (a vermelho, com nome no mapa) numa linha do tempo real. Clique num território para uma descrição detalhada. Fonte dos dados:",
    ar: "الحدود التاريخية من العصور القديمة حتى اليوم — الإمبراطوريات الكبرى (باللون الأحمر، مع أسمائها على الخريطة) على جدول زمني حقيقي. انقر على منطقة للحصول على وصف مفصل. مصدر البيانات:",
    el: "Ιστορικά σύνορα από την αρχαιότητα μέχρι σήμερα — μεγάλες αυτοκρατορίες (κόκκινο, με ονόματα στον χάρτη) σε πραγματική χρονογραμμή. Κάντε κλικ σε μια περιοχή για αναλυτική περιγραφή. Πηγή δεδομένων:",
  },
  empiresTiles: {
    de: "Kartenkacheln", en: "Map tiles", hi: "मानचित्र टाइलें", zh: "地图图块", ko: "지도 타일", ja: "地図タイル",
    es: "Teselas del mapa", fr: "Tuiles cartographiques", tr: "Harita kareleri", ru: "Тайлы карты", pt: "Blocos do mapa", ar: "بلاطات الخريطة", el: "Πλακίδια χάρτη",
  },
  empiresDescriptions: {
    de: "Beschreibungen", en: "Descriptions", hi: "विवरण", zh: "描述", ko: "설명", ja: "説明",
    es: "Descripciones", fr: "Descriptions", tr: "Açıklamalar", ru: "Описания", pt: "Descrições", ar: "الأوصاف", el: "Περιγραφές",
  },

  // Sprachumschalter
  languageMenuLabel: {
    de: "Sprache", en: "Language", hi: "भाषा", zh: "语言", ko: "언어", ja: "言語",
    es: "Idioma", fr: "Langue", tr: "Dil", ru: "Язык", pt: "Idioma", ar: "اللغة", el: "Γλώσσα",
  },
} as const satisfies Record<string, TranslationEntry>;

export const TRANSLATIONS: Record<keyof typeof TRANSLATIONS_SOURCE, TranslationEntry> = TRANSLATIONS_SOURCE;

export type TranslationKey = keyof typeof TRANSLATIONS_SOURCE;
