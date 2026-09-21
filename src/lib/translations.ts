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
  // Nutzerwunsch 21.09.2026: "kannst du auch option erstellen das man
  // imperien oder herrscher sucht und infos bekommt" — freie Textsuche
  // oberhalb der Karte (nutzt denselben /api/empires/info-Endpunkt wie ein
  // Klick auf die Karte, funktioniert daher auch fuer Herrschernamen, die
  // gar nicht im Geodatenset stehen, z.B. "Karl der Große").
  empiresSearchPlaceholder: {
    de: "Reich oder Herrscher suchen …", en: "Search an empire or ruler …", hi: "साम्राज्य या शासक खोजें …", zh: "搜索帝国或统治者……", ko: "제국 또는 통치자 검색…", ja: "帝国または統治者を検索…",
    es: "Buscar un imperio o gobernante…", fr: "Rechercher un empire ou un souverain…", tr: "Bir imparatorluk veya hükümdar ara…", ru: "Поиск империи или правителя…", pt: "Pesquisar um império ou governante…", ar: "ابحث عن إمبراطورية أو حاكم…", el: "Αναζήτηση αυτοκρατορίας ή ηγεμόνα…",
  },
  empiresSearchButton: {
    de: "Suchen", en: "Search", hi: "खोजें", zh: "搜索", ko: "검색", ja: "検索",
    es: "Buscar", fr: "Rechercher", tr: "Ara", ru: "Искать", pt: "Pesquisar", ar: "بحث", el: "Αναζήτηση",
  },

  // Nutzerkorrektur 21.09.2026 ("hab sprache auf englisch aber diese
  // kleine infos da steht auf deutsch") — die Kurzinfos in der Info-Box
  // (Sprache/Jahr/Quelle-Labels) waren fest auf Deutsch verdrahtet statt
  // über t() übersetzt zu werden, obwohl die restliche Seite (Titel,
  // Buttons, Suchfeld) schon in allen 13 Sprachen lief.
  empiresResultSearch: {
    de: "Suchergebnis", en: "Search result", hi: "खोज परिणाम", zh: "搜索结果", ko: "검색 결과", ja: "検索結果",
    es: "Resultado de búsqueda", fr: "Résultat de recherche", tr: "Arama sonucu", ru: "Результат поиска", pt: "Resultado da pesquisa", ar: "نتيجة البحث", el: "Αποτέλεσμα αναζήτησης",
  },
  empiresResultGreatEmpire: {
    de: "Großes Imperium", en: "Great empire", hi: "महान साम्राज्य", zh: "伟大帝国", ko: "위대한 제국", ja: "大帝国",
    es: "Gran imperio", fr: "Grand empire", tr: "Büyük imparatorluk", ru: "Великая империя", pt: "Grande império", ar: "إمبراطورية عظيمة", el: "Μεγάλη αυτοκρατορία",
  },
  empiresResultSelected: {
    de: "Ausgewählt", en: "Selected", hi: "चयनित", zh: "已选择", ko: "선택됨", ja: "選択済み",
    es: "Seleccionado", fr: "Sélectionné", tr: "Seçildi", ru: "Выбрано", pt: "Selecionado", ar: "محدد", el: "Επιλεγμένο",
  },
  empiresSubjectTo: {
    de: "Teil von / Kolonialmacht:", en: "Part of / colonial power:", hi: "भाग / औपनिवेशिक शक्ति:", zh: "所属 / 殖民宗主国：", ko: "소속 / 식민 종주국:", ja: "所属／宗主国：",
    es: "Parte de / potencia colonial:", fr: "Partie de / puissance coloniale :", tr: "Parçası / sömürge gücü:", ru: "Часть / колониальная держава:", pt: "Parte de / potência colonial:", ar: "جزء من / القوة الاستعمارية:", el: "Μέρος / αποικιακή δύναμη:",
  },
  empiresYearShown: {
    de: "Angezeigtes Jahr:", en: "Year shown:", hi: "दिखाया गया वर्ष:", zh: "显示年份：", ko: "표시된 연도:", ja: "表示中の年：",
    es: "Año mostrado:", fr: "Année affichée :", tr: "Gösterilen yıl:", ru: "Показанный год:", pt: "Ano exibido:", ar: "السنة المعروضة:", el: "Έτος που εμφανίζεται:",
  },
  empiresLanguageLabel: {
    de: "Sprache:", en: "Language:", hi: "भाषा:", zh: "语言：", ko: "언어:", ja: "言語：",
    es: "Idioma:", fr: "Langue :", tr: "Dil:", ru: "Язык:", pt: "Idioma:", ar: "اللغة:", el: "Γλώσσα:",
  },
  empiresLanguageUnknown: {
    de: "nicht bekannt", en: "not known", hi: "अज्ञात", zh: "未知", ko: "알 수 없음", ja: "不明",
    es: "desconocido", fr: "inconnue", tr: "bilinmiyor", ru: "неизвестен", pt: "desconhecido", ar: "غير معروفة", el: "άγνωστη",
  },
  empiresMoreOnWikipedia: {
    de: "Mehr auf Wikipedia ↗", en: "More on Wikipedia ↗", hi: "विकिपीडिया पर और देखें ↗", zh: "在维基百科了解更多 ↗", ko: "위키백과에서 더 보기 ↗", ja: "Wikipediaで詳しく見る ↗",
    es: "Más en Wikipedia ↗", fr: "Plus sur Wikipédia ↗", tr: "Wikipedia'da devamı ↗", ru: "Подробнее в Википедии ↗", pt: "Mais na Wikipédia ↗", ar: "المزيد على ويكيبيديا ↗", el: "Περισσότερα στη Wikipedia ↗",
  },
  empiresEditorialSource: {
    de: "// Quelle: redaktionell (kein Wikipedia-Artikel gefunden)", en: "// Source: editorial (no Wikipedia article found)", hi: "// स्रोत: संपादकीय (कोई विकिपीडिया लेख नहीं मिला)", zh: "// 来源：编辑撰写（未找到维基百科文章）", ko: "// 출처: 편집팀 작성 (위키백과 문서 없음)", ja: "// 出典：編集部作成（Wikipedia記事なし）",
    es: "// Fuente: editorial (no se encontró artículo en Wikipedia)", fr: "// Source : rédactionnelle (aucun article Wikipédia trouvé)", tr: "// Kaynak: editoryal (Wikipedia makalesi bulunamadı)", ru: "// Источник: редакционный (статья в Википедии не найдена)", pt: "// Fonte: editorial (nenhum artigo da Wikipédia encontrado)", ar: "// المصدر: تحريري (لم يتم العثور على مقالة ويكيبيديا)", el: "// Πηγή: συντακτική (δεν βρέθηκε άρθρο Wikipedia)",
  },
  empiresNoDescription: {
    de: "Keine ausführliche Beschreibung gefunden — für dieses Gebiet gibt es (noch) keinen passenden Wikipedia-Artikel.",
    en: "No detailed description found — there is (not yet) a matching Wikipedia article for this.",
    hi: "कोई विस्तृत विवरण नहीं मिला — इसके लिए (अभी तक) कोई उपयुक्त विकिपीडिया लेख नहीं है।",
    zh: "未找到详细描述——目前还没有对应的维基百科文章。",
    ko: "자세한 설명을 찾을 수 없습니다 — 아직 해당하는 위키백과 문서가 없습니다.",
    ja: "詳しい説明が見つかりません — 対応するWikipedia記事は（まだ）ありません。",
    es: "No se encontró una descripción detallada; (todavía) no existe un artículo de Wikipedia correspondiente.",
    fr: "Aucune description détaillée trouvée — il n'existe pas (encore) d'article Wikipédia correspondant.",
    tr: "Ayrıntılı bir açıklama bulunamadı — bunun için (henüz) uygun bir Wikipedia makalesi yok.",
    ru: "Подробное описание не найдено — подходящей статьи в Википедии (пока) нет.",
    pt: "Nenhuma descrição detalhada encontrada — (ainda) não existe um artigo correspondente na Wikipédia.",
    ar: "لم يتم العثور على وصف مفصل — لا توجد (بعد) مقالة ويكيبيديا مطابقة لهذا.",
    el: "Δεν βρέθηκε λεπτομερής περιγραφή — δεν υπάρχει (ακόμη) αντίστοιχο άρθρο Wikipedia.",
  },
  empiresTiles: {
    de: "Kartenkacheln", en: "Map tiles", hi: "मानचित्र टाइलें", zh: "地图图块", ko: "지도 타일", ja: "地図タイル",
    es: "Teselas del mapa", fr: "Tuiles cartographiques", tr: "Harita kareleri", ru: "Тайлы карты", pt: "Blocos do mapa", ar: "بلاطات الخريطة", el: "Πλακίδια χάρτη",
  },
  empiresDescriptions: {
    de: "Beschreibungen", en: "Descriptions", hi: "विवरण", zh: "描述", ko: "설명", ja: "説明",
    es: "Descripciones", fr: "Descriptions", tr: "Açıklamalar", ru: "Описания", pt: "Descrições", ar: "الأوصاف", el: "Περιγραφές",
  },

  // Startseite: Header/Info/Copyright
  homeSubtitle: {
    de: "Song suchen und direkt hier abspielen.", en: "Search a song and play it right here.",
    hi: "गाना खोजें और सीधे यहीं चलाएं।", zh: "搜索歌曲，直接在这里播放。", ko: "곡을 검색하고 바로 여기서 재생하세요.", ja: "曲を検索してここで再生。",
    es: "Busca una canción y reprodúcela aquí mismo.", fr: "Recherchez un titre et écoutez-le ici.", tr: "Bir şarkı ara ve doğrudan burada çal.",
    ru: "Найдите песню и слушайте прямо здесь.", pt: "Procure uma música e reproduza aqui mesmo.", ar: "ابحث عن أغنية وشغّلها هنا مباشرة.", el: "Αναζητήστε ένα τραγούδι και ακούστε το εδώ.",
  },
  infoLabel: {
    de: "// Info", en: "// Info", hi: "// जानकारी", zh: "// 信息", ko: "// 정보", ja: "// 情報",
    es: "// Info", fr: "// Infos", tr: "// Bilgi", ru: "// Инфо", pt: "// Info", ar: "// معلومات", el: "// Πληροφορίες",
  },
  infoText: {
    de: "Musik, KI-News und mehr — alles auf einer Seite. Kein Login, kein Abo.",
    en: "Music, AI news and more — all on one page. No login, no subscription.",
    hi: "संगीत, AI समाचार और भी बहुत कुछ — सब एक ही पेज पर। कोई लॉगिन नहीं, कोई सदस्यता नहीं।",
    zh: "音乐、AI 新闻等等——都在一个页面上。无需登录，无需订阅。",
    ko: "음악, AI 뉴스 등 모든 것을 한 페이지에서. 로그인도, 구독도 필요 없습니다.",
    ja: "音楽、AIニュースなど — すべて1つのページで。ログイン不要、登録不要。",
    es: "Música, noticias de IA y más, todo en una sola página. Sin inicio de sesión, sin suscripción.",
    fr: "Musique, actualités IA et plus encore — tout sur une seule page. Sans connexion, sans abonnement.",
    tr: "Müzik, yapay zeka haberleri ve daha fazlası — hepsi tek bir sayfada. Giriş yok, abonelik yok.",
    ru: "Музыка, новости ИИ и многое другое — всё на одной странице. Без входа, без подписки.",
    pt: "Música, notícias de IA e muito mais — tudo numa só página. Sem login, sem assinatura.",
    ar: "الموسيقى وأخبار الذكاء الاصطناعي والمزيد — كل ذلك في صفحة واحدة. بدون تسجيل دخول، بدون اشتراك.",
    el: "Μουσική, νέα AI και άλλα — όλα σε μία σελίδα. Χωρίς σύνδεση, χωρίς συνδρομή.",
  },
  copyrightLabel: {
    de: "// Copyright", en: "// Copyright", hi: "// कॉपीराइट", zh: "// 版权", ko: "// 저작권", ja: "// 著作権",
    es: "// Copyright", fr: "// Copyright", tr: "// Telif Hakkı", ru: "// Авторское право", pt: "// Direitos autorais", ar: "// حقوق النشر", el: "// Πνευματικά δικαιώματα",
  },
  infoHintNote1: {
    de: "Hinweis: Gemerkte Songs werden lokal in diesem Browser gespeichert — im privaten/Inkognito-Fenster gehen sie beim Schließen verloren.",
    en: "Note: saved songs are stored locally in this browser — in a private/incognito window they're lost when you close it.",
    hi: "नोट: सहेजे गए गाने इस ब्राउज़र में स्थानीय रूप से संग्रहीत होते हैं — गुप्त/इनकॉग्निटो विंडो में बंद करने पर ये खो जाते हैं।",
    zh: "提示：收藏的歌曲会保存在本浏览器本地——在隐身/无痕窗口中关闭后会丢失。",
    ko: "참고: 저장된 곡은 이 브라우저에 로컬로 저장됩니다 — 시크릿/비공개 창에서는 창을 닫으면 사라집니다.",
    ja: "注意：保存した曲はこのブラウザにローカル保存されます — シークレット/プライベートウィンドウでは閉じると消えます。",
    es: "Nota: las canciones guardadas se almacenan localmente en este navegador; en una ventana privada/incógnito se pierden al cerrarla.",
    fr: "Remarque : les titres enregistrés sont stockés localement dans ce navigateur — en navigation privée, ils sont perdus à la fermeture.",
    tr: "Not: kaydedilen şarkılar bu tarayıcıda yerel olarak saklanır — gizli/özel pencerede kapatınca kaybolurlar.",
    ru: "Примечание: сохранённые песни хранятся локально в этом браузере — в приватном/инкогнито-окне они теряются при закрытии.",
    pt: "Nota: as músicas guardadas ficam armazenadas localmente neste navegador — numa janela privada/anónima perdem-se ao fechar.",
    ar: "ملاحظة: يتم حفظ الأغاني المحفوظة محليًا في هذا المتصفح — في نافذة التصفح الخاص تُفقد عند الإغلاق.",
    el: "Σημείωση: τα αποθηκευμένα τραγούδια αποθηκεύονται τοπικά σε αυτό το πρόγραμμα περιήγησης — σε ιδιωτικό παράθυρο χάνονται όταν κλείσει.",
  },
  infoHintNote2: {
    de: "Manche Browser (z.B. Safari auf dem iPhone) pausieren die Wiedergabe im Hintergrund, wenn die Seite verlassen oder das Gerät gesperrt wird.",
    en: "Some browsers (e.g. Safari on iPhone) pause background playback when you leave the page or lock the device.",
    hi: "कुछ ब्राउज़र (जैसे iPhone पर Safari) पेज छोड़ने या डिवाइस लॉक होने पर बैकग्राउंड में प्लेबैक रोक देते हैं।",
    zh: "某些浏览器（如 iPhone 上的 Safari）在离开页面或锁屏时会暂停后台播放。",
    ko: "일부 브라우저(예: iPhone의 Safari)는 페이지를 벗어나거나 기기가 잠기면 백그라운드 재생을 일시 정지합니다.",
    ja: "一部のブラウザ（iPhoneのSafariなど）は、ページを離れたり端末がロックされるとバックグラウンド再生を一時停止します。",
    es: "Algunos navegadores (p. ej. Safari en iPhone) pausan la reproducción en segundo plano al salir de la página o bloquear el dispositivo.",
    fr: "Certains navigateurs (par ex. Safari sur iPhone) mettent la lecture en pause en arrière-plan si vous quittez la page ou verrouillez l'appareil.",
    tr: "Bazı tarayıcılar (ör. iPhone'da Safari), sayfadan ayrıldığınızda veya cihaz kilitlendiğinde arka planda oynatmayı duraklatır.",
    ru: "Некоторые браузеры (например, Safari на iPhone) приостанавливают фоновое воспроизведение при уходе со страницы или блокировке устройства.",
    pt: "Alguns navegadores (p. ex. Safari no iPhone) pausam a reprodução em segundo plano ao sair da página ou bloquear o dispositivo.",
    ar: "بعض المتصفحات (مثل Safari على iPhone) توقف التشغيل في الخلفية مؤقتًا عند مغادرة الصفحة أو قفل الجهاز.",
    el: "Ορισμένα προγράμματα περιήγησης (π.χ. Safari σε iPhone) θέτουν σε παύση την αναπαραγωγή στο παρασκήνιο όταν φύγετε από τη σελίδα ή κλειδώσει η συσκευή.",
  },
  infoHintAriaLabel: {
    de: "Hinweise anzeigen", en: "Show hints", hi: "संकेत दिखाएं", zh: "显示提示", ko: "안내 표시", ja: "ヒントを表示",
    es: "Mostrar avisos", fr: "Afficher les infos", tr: "İpuçlarını göster", ru: "Показать подсказки", pt: "Mostrar avisos", ar: "عرض الملاحظات", el: "Εμφάνιση συμβουλών",
  },
  favoritesLabel: {
    de: "// Gemerkte Musics", en: "// Saved songs", hi: "// सहेजे गए गाने", zh: "// 已收藏歌曲", ko: "// 저장된 곡", ja: "// 保存した曲",
    es: "// Canciones guardadas", fr: "// Titres enregistrés", tr: "// Kaydedilen şarkılar", ru: "// Сохранённые песни", pt: "// Músicas guardadas", ar: "// الأغاني المحفوظة", el: "// Αποθηκευμένα τραγούδια",
  },
  shufflePlay: {
    de: "Zufällig abspielen", en: "Shuffle play", hi: "बेतरतीब चलाएं", zh: "随机播放", ko: "무작위 재생", ja: "シャッフル再生",
    es: "Reproducción aleatoria", fr: "Lecture aléatoire", tr: "Karışık çal", ru: "Случайное воспроизведение", pt: "Reprodução aleatória", ar: "تشغيل عشوائي", el: "Τυχαία αναπαραγωγή",
  },
  shufflePlayAria: {
    de: "Gemerkte Musics zufällig abspielen", en: "Shuffle play saved songs", hi: "सहेजे गए गाने बेतरतीब चलाएं", zh: "随机播放收藏歌曲", ko: "저장된 곡 무작위 재생", ja: "保存した曲をシャッフル再生",
    es: "Reproducir canciones guardadas al azar", fr: "Lecture aléatoire des titres enregistrés", tr: "Kaydedilen şarkıları karışık çal", ru: "Случайно воспроизвести сохранённые песни", pt: "Reproduzir músicas guardadas aleatoriamente", ar: "تشغيل الأغاني المحفوظة عشوائيًا", el: "Τυχαία αναπαραγωγή αποθηκευμένων τραγουδιών",
  },
  favoritesCompactLabel: {
    de: "// Gemerkt", en: "// Saved", hi: "// सहेजा गया", zh: "// 已收藏", ko: "// 저장됨", ja: "// 保存済み",
    es: "// Guardado", fr: "// Enregistré", tr: "// Kaydedildi", ru: "// Сохранено", pt: "// Guardado", ar: "// محفوظ", el: "// Αποθηκευμένο",
  },
  moreShow: {
    de: "mehr anzeigen", en: "show more", hi: "और दिखाएं", zh: "显示更多", ko: "더 보기", ja: "もっと見る",
    es: "mostrar más", fr: "afficher plus", tr: "daha fazla göster", ru: "показать ещё", pt: "mostrar mais", ar: "عرض المزيد", el: "εμφάνιση περισσότερων",
  },
  searchFailed: {
    de: "Suche fehlgeschlagen.", en: "Search failed.", hi: "खोज विफल रही।", zh: "搜索失败。", ko: "검색에 실패했습니다.", ja: "検索に失敗しました。",
    es: "La búsqueda falló.", fr: "La recherche a échoué.", tr: "Arama başarısız oldu.", ru: "Поиск не удался.", pt: "A pesquisa falhou.", ar: "فشل البحث.", el: "Η αναζήτηση απέτυχε.",
  },
  searchFailedConn: {
    de: "Suche fehlgeschlagen. Bitte Internetverbindung prüfen.", en: "Search failed. Please check your internet connection.",
    hi: "खोज विफल रही। कृपया इंटरनेट कनेक्शन जांचें।", zh: "搜索失败。请检查网络连接。", ko: "검색에 실패했습니다. 인터넷 연결을 확인해 주세요.", ja: "検索に失敗しました。インターネット接続を確認してください。",
    es: "La búsqueda falló. Comprueba tu conexión a internet.", fr: "La recherche a échoué. Vérifiez votre connexion internet.",
    tr: "Arama başarısız oldu. Lütfen internet bağlantınızı kontrol edin.", ru: "Поиск не удался. Проверьте подключение к интернету.",
    pt: "A pesquisa falhou. Verifique a sua ligação à internet.", ar: "فشل البحث. يرجى التحقق من اتصال الإنترنت.", el: "Η αναζήτηση απέτυχε. Ελέγξτε τη σύνδεσή σας στο διαδίκτυο.",
  },
  noResultsFor: {
    de: "Keine Ergebnisse für", en: "No results for", hi: "इसके लिए कोई परिणाम नहीं", zh: "没有找到相关结果：", ko: "다음에 대한 결과 없음:", ja: "検索結果がありません：",
    es: "Sin resultados para", fr: "Aucun résultat pour", tr: "Şunun için sonuç yok:", ru: "Нет результатов для", pt: "Sem resultados para", ar: "لا توجد نتائج لـ", el: "Κανένα αποτέλεσμα για",
  },
  searchPrompt: {
    de: "Suche nach einem Song oder Künstler.", en: "Search for a song or artist.", hi: "किसी गाने या कलाकार को खोजें।", zh: "搜索歌曲或艺人。", ko: "곡 또는 아티스트를 검색하세요.", ja: "曲またはアーティストを検索してください。",
    es: "Busca una canción o artista.", fr: "Recherchez un titre ou un artiste.", tr: "Bir şarkı veya sanatçı arayın.", ru: "Найдите песню или исполнителя.", pt: "Procure uma música ou artista.", ar: "ابحث عن أغنية أو فنان.", el: "Αναζητήστε ένα τραγούδι ή καλλιτέχνη.",
  },
  resultsFor: {
    de: "Ergebnisse für", en: "Results for", hi: "इसके परिणाम", zh: "搜索结果：", ko: "검색 결과:", ja: "検索結果：",
    es: "Resultados para", fr: "Résultats pour", tr: "Sonuçlar:", ru: "Результаты для", pt: "Resultados para", ar: "نتائج لـ", el: "Αποτελέσματα για",
  },
  resultsLabel: {
    de: "Ergebnisse", en: "Results", hi: "परिणाम", zh: "结果", ko: "결과", ja: "検索結果",
    es: "Resultados", fr: "Résultats", tr: "Sonuçlar", ru: "Результаты", pt: "Resultados", ar: "النتائج", el: "Αποτελέσματα",
  },
  featuresLabel: {
    de: "// Was dich erwartet", en: "// What's here", hi: "// आपके लिए क्या है", zh: "// 你将获得", ko: "// 무엇이 있나요", ja: "// ここでできること",
    es: "// Lo que te espera", fr: "// Ce qui t'attend", tr: "// Seni neler bekliyor", ru: "// Что тебя ждёт", pt: "// O que te espera", ar: "// ما الذي ينتظرك", el: "// Τι σε περιμένει",
  },
  featureMusicTitle: {
    de: "Musik", en: "Music", hi: "संगीत", zh: "音乐", ko: "음악", ja: "音楽",
    es: "Música", fr: "Musique", tr: "Müzik", ru: "Музыка", pt: "Música", ar: "الموسيقى", el: "Μουσική",
  },
  featureMusicText: {
    de: "Song suchen und direkt hier hören — über den offiziellen YouTube-Katalog, kein Login, kein Download.",
    en: "Search a song and listen right here — via the official YouTube catalog, no login, no download.",
    hi: "गाना खोजें और सीधे यहीं सुनें — आधिकारिक YouTube कैटलॉग के जरिए, कोई लॉगिन नहीं, कोई डाउनलोड नहीं।",
    zh: "搜索歌曲并直接在此收听——通过官方 YouTube 目录，无需登录，无需下载。",
    ko: "곡을 검색하고 바로 여기서 들으세요 — 공식 YouTube 카탈로그를 통해, 로그인도 다운로드도 필요 없습니다.",
    ja: "曲を検索してここで直接視聴 — 公式YouTubeカタログ経由、ログイン不要、ダウンロード不要。",
    es: "Busca una canción y escúchala aquí mismo, a través del catálogo oficial de YouTube, sin inicio de sesión ni descargas.",
    fr: "Recherchez un titre et écoutez-le ici même, via le catalogue officiel YouTube, sans connexion ni téléchargement.",
    tr: "Bir şarkı ara ve doğrudan burada dinle — resmi YouTube kataloğu üzerinden, giriş yok, indirme yok.",
    ru: "Найдите песню и слушайте прямо здесь — через официальный каталог YouTube, без входа и загрузки.",
    pt: "Procure uma música e ouça aqui mesmo — através do catálogo oficial do YouTube, sem login, sem download.",
    ar: "ابحث عن أغنية واستمع إليها هنا مباشرة — عبر كتالوج يوتيوب الرسمي، بدون تسجيل دخول أو تنزيل.",
    el: "Αναζητήστε ένα τραγούδι και ακούστε το εδώ — μέσω του επίσημου καταλόγου YouTube, χωρίς σύνδεση ή λήψη.",
  },
  featureUniverseTitle: {
    de: "Universum", en: "Universe", hi: "ब्रह्मांड", zh: "宇宙", ko: "우주", ja: "宇宙",
    es: "Universo", fr: "Univers", tr: "Evren", ru: "Вселенная", pt: "Universo", ar: "الكون", el: "Σύμπαν",
  },
  featureUniverseText: {
    de: "Zahlen, Fakten und ein interaktives Sonnensystem zum Erkunden — vom Urknall bis zu Voyager 1.",
    en: "Numbers, facts, and an interactive solar system to explore — from the Big Bang to Voyager 1.",
    hi: "आंकड़े, तथ्य और खोजने के लिए एक इंटरैक्टिव सौर मंडल — बिग बैंग से लेकर वॉयजर 1 तक।",
    zh: "数字、事实，以及可探索的互动太阳系——从大爆炸到旅行者1号。",
    ko: "숫자, 사실, 탐험할 수 있는 인터랙티브 태양계 — 빅뱅부터 보이저 1호까지.",
    ja: "数字、事実、探索できるインタラクティブな太陽系 — ビッグバンからボイジャー1号まで。",
    es: "Números, datos y un sistema solar interactivo para explorar, desde el Big Bang hasta la Voyager 1.",
    fr: "Chiffres, faits et un système solaire interactif à explorer — du Big Bang à Voyager 1.",
    tr: "Sayılar, gerçekler ve keşfedilecek etkileşimli bir güneş sistemi — Büyük Patlama'dan Voyager 1'e kadar.",
    ru: "Цифры, факты и интерактивная солнечная система для изучения — от Большого взрыва до «Вояджера-1».",
    pt: "Números, factos e um sistema solar interativo para explorar — do Big Bang à Voyager 1.",
    ar: "أرقام وحقائق ونظام شمسي تفاعلي لاستكشافه — من الانفجار العظيم إلى فوييجر 1.",
    el: "Αριθμοί, στοιχεία και ένα διαδραστικό ηλιακό σύστημα για εξερεύνηση — από τη Μεγάλη Έκρηξη μέχρι το Voyager 1.",
  },
  featureHistoryTitle: {
    de: "Geschichte", en: "History", hi: "इतिहास", zh: "历史", ko: "역사", ja: "歴史",
    es: "Historia", fr: "Histoire", tr: "Tarih", ru: "История", pt: "História", ar: "التاريخ", el: "Ιστορία",
  },
  featureHistoryText: {
    de: "Große Reiche auf einer Zeitleiste von der Antike bis heute, mit Jahres-Regler zum Durchspielen.",
    en: "Great empires on a timeline from antiquity to today, with a year slider to play through.",
    hi: "प्राचीन काल से आज तक की समयरेखा पर महान साम्राज्य, चलाने के लिए वर्ष स्लाइडर के साथ।",
    zh: "从古代到今天的时间线上的伟大帝国，配有可播放的年份滑块。",
    ko: "고대부터 오늘날까지의 타임라인 위 위대한 제국들, 재생할 수 있는 연도 슬라이더 포함.",
    ja: "古代から現代までの年表上の大帝国、再生できる年スライダー付き。",
    es: "Grandes imperios en una línea temporal desde la Antigüedad hasta hoy, con un control deslizante de años para reproducir.",
    fr: "Grands empires sur une chronologie de l'Antiquité à aujourd'hui, avec un curseur d'années à faire défiler.",
    tr: "Antik çağdan günümüze zaman çizelgesinde büyük imparatorluklar, oynatılabilir bir yıl kaydırıcısıyla.",
    ru: "Великие империи на временной шкале от античности до наших дней, с ползунком по годам для воспроизведения.",
    pt: "Grandes impérios numa linha do tempo da Antiguidade até hoje, com um controlo deslizante de anos para reproduzir.",
    ar: "إمبراطوريات عظيمة على جدول زمني من العصور القديمة حتى اليوم، مع شريط تمرير للسنوات للتشغيل.",
    el: "Μεγάλες αυτοκρατορίες σε χρονογραμμή από την αρχαιότητα μέχρι σήμερα, με ρυθμιστικό έτους για αναπαραγωγή.",
  },
  discoverUniverseText: {
    de: "Zahlen und Fakten zum Kosmos — vom Alter des Universums über Dunkle Materie bis zu Schwarzen Löchern, dazu aktuelle Live-News aus der Raumfahrt.",
    en: "Numbers and facts about the cosmos — from the age of the universe to dark matter and black holes, plus live space news.",
    hi: "ब्रह्मांड के बारे में आंकड़े और तथ्य — ब्रह्मांड की आयु से लेकर डार्क मैटर और ब्लैक होल तक, साथ ही अंतरिक्ष की ताज़ा खबरें।",
    zh: "关于宇宙的数字与事实——从宇宙的年龄到暗物质与黑洞，还有航天实时新闻。",
    ko: "우주에 관한 숫자와 사실 — 우주의 나이부터 암흑 물질, 블랙홀까지, 실시간 우주 뉴스도 함께.",
    ja: "宇宙に関する数字と事実 — 宇宙の年齢からダークマター、ブラックホールまで、最新の宇宙ニュースも。",
    es: "Números y datos sobre el cosmos: desde la edad del universo hasta la materia oscura y los agujeros negros, más noticias espaciales en vivo.",
    fr: "Chiffres et faits sur le cosmos — de l'âge de l'univers à la matière noire et aux trous noirs, avec l'actualité spatiale en direct.",
    tr: "Kozmosla ilgili sayılar ve gerçekler — evrenin yaşından karanlık maddeye ve kara deliklere kadar, ayrıca canlı uzay haberleri.",
    ru: "Цифры и факты о космосе — от возраста Вселенной до тёмной материи и чёрных дыр, а также новости космонавтики.",
    pt: "Números e factos sobre o cosmos — da idade do universo à matéria escura e buracos negros, mais notícias espaciais ao vivo.",
    ar: "أرقام وحقائق عن الكون — من عمر الكون إلى المادة المظلمة والثقوب السوداء، بالإضافة إلى أخبار الفضاء المباشرة.",
    el: "Αριθμοί και στοιχεία για το σύμπαν — από την ηλικία του σύμπαντος μέχρι τη σκοτεινή ύλη και τις μαύρες τρύπες, καθώς και ζωντανά νέα από το διάστημα.",
  },
  discoverCta: {
    de: "Entdecken", en: "Explore", hi: "खोजें", zh: "探索", ko: "탐험하기", ja: "探索する",
    es: "Descubrir", fr: "Découvrir", tr: "Keşfet", ru: "Исследовать", pt: "Descobrir", ar: "استكشف", el: "Ανακαλύψτε",
  },
  historyTitle: {
    de: "Weltgeschichte entdecken", en: "Explore World History", hi: "विश्व इतिहास खोजें", zh: "探索世界历史", ko: "세계 역사 탐험하기", ja: "世界史を探索する",
    es: "Descubre la historia mundial", fr: "Découvrir l'histoire du monde", tr: "Dünya Tarihini Keşfet", ru: "Исследуйте всемирную историю", pt: "Descobre a história mundial", ar: "اكتشف تاريخ العالم", el: "Ανακαλύψτε την παγκόσμια ιστορία",
  },
  historyText: {
    de: "Historische Weltkarte mit Jahres-Regler — von der Antike bis heute, große Reiche wie Rom, die Mongolen oder das British Empire farblich hervorgehoben.",
    en: "Historical world map with a year slider — from antiquity to today, major empires like Rome, the Mongols, or the British Empire highlighted in color.",
    hi: "वर्ष स्लाइडर के साथ ऐतिहासिक विश्व मानचित्र — प्राचीन काल से आज तक, रोम, मंगोल या ब्रिटिश साम्राज्य जैसे बड़े साम्राज्य रंग में हाइलाइट किए गए।",
    zh: "带年份滑块的历史世界地图——从古代到今天，罗马、蒙古或大英帝国等大帝国以颜色突出显示。",
    ko: "연도 슬라이더가 있는 역사 세계 지도 — 고대부터 오늘날까지, 로마, 몽골, 대영 제국 같은 대제국이 색으로 강조 표시됩니다.",
    ja: "年スライダー付きの歴史的世界地図 — 古代から現代まで、ローマ、モンゴル、大英帝国などの大帝国を色分け表示。",
    es: "Mapa mundial histórico con control deslizante de años — desde la Antigüedad hasta hoy, con grandes imperios como Roma, los mongoles o el Imperio británico resaltados en color.",
    fr: "Carte du monde historique avec curseur d'années — de l'Antiquité à aujourd'hui, grands empires comme Rome, les Mongols ou l'Empire britannique mis en couleur.",
    tr: "Yıl kaydırıcılı tarihi dünya haritası — antik çağdan günümüze, Roma, Moğollar veya İngiliz İmparatorluğu gibi büyük imparatorluklar renkle vurgulanmış.",
    ru: "Историческая карта мира с ползунком по годам — от античности до наших дней, крупные империи, такие как Рим, монголы или Британская империя, выделены цветом.",
    pt: "Mapa-múndi histórico com controlo deslizante de anos — da Antiguidade até hoje, grandes impérios como Roma, os mongóis ou o Império Britânico destacados a cores.",
    ar: "خريطة عالمية تاريخية مع شريط تمرير للسنوات — من العصور القديمة حتى اليوم، مع تمييز الإمبراطوريات الكبرى مثل روما والمغول أو الإمبراطورية البريطانية بالألوان.",
    el: "Ιστορικός παγκόσμιος χάρτης με ρυθμιστικό έτους — από την αρχαιότητα μέχρι σήμερα, με μεγάλες αυτοκρατορίες όπως η Ρώμη, οι Μογγόλοι ή η Βρετανική Αυτοκρατορία τονισμένες με χρώμα.",
  },
  viewMapCta: {
    de: "Karte ansehen", en: "View map", hi: "मानचित्र देखें", zh: "查看地图", ko: "지도 보기", ja: "地図を見る",
    es: "Ver mapa", fr: "Voir la carte", tr: "Haritayı görüntüle", ru: "Смотреть карту", pt: "Ver mapa", ar: "عرض الخريطة", el: "Προβολή χάρτη",
  },
  aiNewsHeroTitle: {
    de: "Was gerade in der KI passiert", en: "What's happening in AI right now", hi: "AI में अभी क्या हो रहा है", zh: "AI 领域的最新动态", ko: "지금 AI에서 일어나는 일", ja: "今、AIで起きていること",
    es: "Lo que está pasando ahora en la IA", fr: "Ce qui se passe en ce moment dans l'IA", tr: "Yapay zekada şu anda neler oluyor", ru: "Что сейчас происходит в мире ИИ", pt: "O que está a acontecer agora na IA", ar: "ما الذي يحدث الآن في الذكاء الاصطناعي", el: "Τι συμβαίνει τώρα στην τεχνητή νοημοσύνη",
  },
  aiNewsHeroText: {
    de: "Aktuelle Schlagzeilen rund um künstliche Intelligenz — live geladen, keine erfundenen Meldungen.",
    en: "Current headlines about artificial intelligence — loaded live, no made-up stories.",
    hi: "कृत्रिम बुद्धिमत्ता से जुड़ी ताज़ा सुर्खियाँ — लाइव लोड की गई, कोई गढ़ी हुई खबर नहीं।",
    zh: "关于人工智能的最新头条——实时加载，绝无捏造内容。",
    ko: "인공지능에 관한 최신 헤드라인 — 실시간으로 불러오며, 꾸며낸 소식은 없습니다.",
    ja: "人工知能に関する最新見出し — リアルタイム取得、捏造記事なし。",
    es: "Titulares actuales sobre inteligencia artificial, cargados en vivo, sin noticias inventadas.",
    fr: "Titres d'actualité sur l'intelligence artificielle — chargés en direct, aucune info inventée.",
    tr: "Yapay zeka hakkında güncel başlıklar — canlı yüklenir, uydurma haber yok.",
    ru: "Актуальные заголовки об искусственном интеллекте — загружаются в реальном времени, никаких выдуманных новостей.",
    pt: "Manchetes atuais sobre inteligência artificial — carregadas em direto, sem notícias inventadas.",
    ar: "عناوين حالية حول الذكاء الاصطناعي — محمّلة مباشرة، بدون أخبار ملفقة.",
    el: "Τρέχοντες τίτλοι ειδήσεων για την τεχνητή νοημοσύνη — φορτώνονται ζωντανά, χωρίς επινοημένες ειδήσεις.",
  },
  collapse: {
    de: "Einklappen", en: "Collapse", hi: "संक्षिप्त करें", zh: "收起", ko: "접기", ja: "折りたたむ",
    es: "Contraer", fr: "Réduire", tr: "Daralt", ru: "Свернуть", pt: "Recolher", ar: "طي", el: "Σύμπτυξη",
  },
  showAllNews: {
    de: "Alle News anzeigen", en: "Show all news", hi: "सभी समाचार दिखाएं", zh: "显示所有新闻", ko: "모든 뉴스 보기", ja: "すべてのニュースを表示",
    es: "Mostrar todas las noticias", fr: "Afficher toutes les actualités", tr: "Tüm haberleri göster", ru: "Показать все новости", pt: "Mostrar todas as notícias", ar: "عرض جميع الأخبار", el: "Εμφάνιση όλων των ειδήσεων",
  },
  readArticle: {
    de: "Artikel lesen", en: "Read article", hi: "लेख पढ़ें", zh: "阅读文章", ko: "기사 읽기", ja: "記事を読む",
    es: "Leer artículo", fr: "Lire l'article", tr: "Makaleyi oku", ru: "Читать статью", pt: "Ler artigo", ar: "قراءة المقال", el: "Ανάγνωση άρθρου",
  },
  noNewsAvailable: {
    de: "Aktuell keine News verfügbar", en: "No news available right now", hi: "अभी कोई समाचार उपलब्ध नहीं", zh: "目前没有可用新闻", ko: "현재 이용 가능한 뉴스가 없습니다", ja: "現在ニュースはありません",
    es: "Actualmente no hay noticias disponibles", fr: "Aucune actualité disponible pour le moment", tr: "Şu anda haber yok", ru: "Сейчас новостей нет", pt: "Atualmente sem notícias disponíveis", ar: "لا توجد أخبار متاحة حاليًا", el: "Δεν υπάρχουν διαθέσιμα νέα αυτή τη στιγμή",
  },
  aiNewsLoadError: {
    de: "KI-News konnten nicht geladen werden.", en: "AI news could not be loaded.", hi: "AI समाचार लोड नहीं हो सके।", zh: "无法加载 AI 新闻。", ko: "AI 뉴스를 불러올 수 없습니다.", ja: "AIニュースを読み込めませんでした。",
    es: "No se pudieron cargar las noticias de IA.", fr: "Impossible de charger les actualités IA.", tr: "AI haberleri yüklenemedi.", ru: "Не удалось загрузить новости ИИ.", pt: "Não foi possível carregar as notícias de IA.", ar: "تعذر تحميل أخبار الذكاء الاصطناعي.", el: "Δεν ήταν δυνατή η φόρτωση των νέων AI.",
  },
  aboutLabel: {
    de: "// Über die Webseite", en: "// About this site", hi: "// इस वेबसाइट के बारे में", zh: "// 关于本站", ko: "// 이 사이트에 대해", ja: "// このサイトについて",
    es: "// Sobre este sitio", fr: "// À propos du site", tr: "// Bu site hakkında", ru: "// Об этом сайте", pt: "// Sobre este site", ar: "// حول هذا الموقع", el: "// Σχετικά με τον ιστότοπο",
  },
  aboutText: {
    de: "Centaurian ist ein privates, nicht-kommerzielles Hobby-Projekt — kein offizieller Dienst, ohne Werbe-Tracking-Schnickschnack und ohne aufgeblähtes Interface. Mehr als nur Musik: Neben Suche und Wiedergabe gehören eine interaktive Weltkarte zum Erkunden der Geschichte und eine Übersicht zum Kennenlernen des Universums dazu — Centaurian als kleiner Ort, um Wissen über die Existenz zu entdecken. Die Musik-Suche und Wiedergabe laufen ausschließlich über die offizielle YouTube Data API und den offiziellen YouTube-Player; es wird nichts heruntergeladen, kopiert oder auf dieser Seite gespeichert. Da nur öffentlich dokumentierte, offizielle Schnittstellen genutzt werden, ist die Nutzung dieser Seite legal.",
    en: "Centaurian is a private, non-commercial hobby project — not an official service, with no ad-tracking clutter and no bloated interface. More than just music: alongside search and playback, it includes an interactive world map for exploring history and an overview for getting to know the universe — Centaurian as a small place to discover knowledge about existence. Music search and playback run exclusively through the official YouTube Data API and the official YouTube player; nothing is downloaded, copied, or stored on this site. Since only publicly documented, official interfaces are used, using this site is legal.",
    hi: "Centaurian एक निजी, गैर-व्यावसायिक शौक परियोजना है — यह कोई आधिकारिक सेवा नहीं है, बिना विज्ञापन-ट्रैकिंग झंझट और बिना फूले हुए इंटरफेस के। सिर्फ संगीत से कहीं ज़्यादा: खोज और प्लेबैक के साथ-साथ, इसमें इतिहास खोजने के लिए एक इंटरैक्टिव विश्व मानचित्र और ब्रह्मांड को जानने के लिए एक अवलोकन शामिल है। संगीत खोज और प्लेबैक केवल आधिकारिक YouTube Data API और आधिकारिक YouTube प्लेयर के माध्यम से चलते हैं; इस साइट पर कुछ भी डाउनलोड, कॉपी या संग्रहीत नहीं किया जाता। चूंकि केवल सार्वजनिक रूप से प्रलेखित, आधिकारिक इंटरफेस का उपयोग किया जाता है, इस साइट का उपयोग कानूनी है।",
    zh: "Centaurian 是一个私人、非商业的兴趣项目——不是官方服务，没有广告追踪的杂乱内容，也没有臃肿的界面。不仅仅是音乐：除了搜索和播放，还包含一个用于探索历史的互动世界地图，以及一个了解宇宙的概览——Centaurian 是一个发现关于存在之知识的小天地。音乐搜索和播放完全通过官方 YouTube Data API 和官方 YouTube 播放器运行；本站不下载、不复制、不存储任何内容。由于仅使用公开文档化的官方接口，使用本站是合法的。",
    ko: "Centaurian은 개인적이고 비상업적인 취미 프로젝트입니다 — 공식 서비스가 아니며, 광고 추적 같은 번잡함이나 비대한 인터페이스가 없습니다. 단순한 음악 그 이상: 검색과 재생 외에도 역사를 탐험할 수 있는 인터랙티브 세계 지도와 우주를 알아가는 개요가 포함되어 있습니다 — Centaurian은 존재에 관한 지식을 발견하는 작은 공간입니다. 음악 검색과 재생은 오직 공식 YouTube Data API와 공식 YouTube 플레이어를 통해서만 이루어지며, 이 사이트에서는 아무것도 다운로드, 복사, 저장되지 않습니다. 공개적으로 문서화된 공식 인터페이스만 사용하므로 이 사이트의 이용은 합법입니다.",
    ja: "Centaurianは個人の非営利な趣味プロジェクトです — 公式サービスではなく、広告トラッキングの煩わしさも肥大化したインターフェースもありません。音楽だけではありません：検索と再生に加え、歴史を探索できるインタラクティブな世界地図や、宇宙について知るための概観も含まれています — Centaurianは存在についての知識を発見する小さな場所です。音楽の検索と再生は公式YouTube Data APIと公式YouTubeプレーヤーのみを通じて行われ、このサイトでは何もダウンロード、コピー、保存されません。公開文書化された公式インターフェースのみを使用しているため、このサイトの利用は合法です。",
    es: "Centaurian es un proyecto de afición privado y no comercial — no es un servicio oficial, sin publicidad de rastreo ni interfaz sobrecargada. Más que solo música: además de la búsqueda y reproducción, incluye un mapa mundial interactivo para explorar la historia y una vista general para conocer el universo — Centaurian como un pequeño lugar para descubrir conocimiento sobre la existencia. La búsqueda y reproducción de música funcionan exclusivamente a través de la API oficial de YouTube Data y el reproductor oficial de YouTube; nada se descarga, copia ni almacena en este sitio. Dado que solo se usan interfaces oficiales y públicamente documentadas, el uso de este sitio es legal.",
    fr: "Centaurian est un projet personnel, non commercial et amateur — ce n'est pas un service officiel, sans pub ni traqueurs, sans interface surchargée. Plus que de la musique : en plus de la recherche et de la lecture, il comprend une carte du monde interactive pour explorer l'histoire et un aperçu pour découvrir l'univers — Centaurian comme un petit lieu pour découvrir des connaissances sur l'existence. La recherche et la lecture de musique passent exclusivement par l'API officielle YouTube Data et le lecteur YouTube officiel ; rien n'est téléchargé, copié ou stocké sur ce site. Comme seules des interfaces officielles et documentées publiquement sont utilisées, l'utilisation de ce site est légale.",
    tr: "Centaurian özel, ticari olmayan bir hobi projesidir — resmi bir hizmet değildir, reklam takibi karmaşası veya şişirilmiş bir arayüz içermez. Sadece müzikten fazlası: arama ve oynatmanın yanı sıra, tarihi keşfetmek için etkileşimli bir dünya haritası ve evreni tanımak için bir genel bakış içerir — Centaurian, varoluş hakkında bilgi keşfetmek için küçük bir yer olarak. Müzik arama ve oynatma yalnızca resmi YouTube Data API'si ve resmi YouTube oynatıcısı üzerinden çalışır; bu sitede hiçbir şey indirilmez, kopyalanmaz veya saklanmaz. Yalnızca kamuya açık, resmi olarak belgelenmiş arayüzler kullanıldığından, bu sitenin kullanımı yasaldır.",
    ru: "Centaurian — это частный некоммерческий любительский проект, не официальный сервис, без рекламного трекинга и перегруженного интерфейса. Больше, чем просто музыка: помимо поиска и воспроизведения, здесь есть интерактивная карта мира для изучения истории и обзор для знакомства со Вселенной — Centaurian как небольшое место для открытия знаний о бытии. Поиск и воспроизведение музыки работают исключительно через официальный YouTube Data API и официальный плеер YouTube; на этом сайте ничего не скачивается, не копируется и не хранится. Поскольку используются только публично задокументированные, официальные интерфейсы, использование этого сайта законно.",
    pt: "Centaurian é um projeto pessoal e não comercial — não é um serviço oficial, sem rastreamento publicitário nem interface sobrecarregada. Mais do que apenas música: além da pesquisa e reprodução, inclui um mapa-múndi interativo para explorar a história e uma visão geral para conhecer o universo — Centaurian como um pequeno lugar para descobrir conhecimento sobre a existência. A pesquisa e reprodução de música funcionam exclusivamente através da API oficial do YouTube Data e do leitor oficial do YouTube; nada é descarregado, copiado ou armazenado neste site. Como só são usadas interfaces oficiais e publicamente documentadas, o uso deste site é legal.",
    ar: "Centaurian هو مشروع هواية خاص وغير تجاري — ليس خدمة رسمية، بدون فوضى تتبع الإعلانات وبدون واجهة متضخمة. أكثر من مجرد موسيقى: إلى جانب البحث والتشغيل، يتضمن خريطة عالمية تفاعلية لاستكشاف التاريخ ونظرة عامة للتعرف على الكون — Centaurian كمكان صغير لاكتشاف المعرفة حول الوجود. يعمل البحث عن الموسيقى وتشغيلها حصريًا عبر واجهة YouTube Data الرسمية ومشغل يوتيوب الرسمي؛ لا يتم تنزيل أو نسخ أو تخزين أي شيء على هذا الموقع. وبما أنه يتم استخدام واجهات رسمية موثقة علنًا فقط، فإن استخدام هذا الموقع قانوني.",
    el: "Το Centaurian είναι ένα ιδιωτικό, μη εμπορικό ερασιτεχνικό έργο — όχι επίσημη υπηρεσία, χωρίς θόρυβο διαφημιστικής παρακολούθησης και χωρίς φουσκωμένο περιβάλλον. Περισσότερο από απλή μουσική: εκτός από αναζήτηση και αναπαραγωγή, περιλαμβάνει έναν διαδραστικό παγκόσμιο χάρτη για εξερεύνηση της ιστορίας και μια επισκόπηση για γνωριμία με το σύμπαν — το Centaurian ως ένας μικρός χώρος για ανακάλυψη γνώσης για την ύπαρξη. Η αναζήτηση και αναπαραγωγή μουσικής λειτουργούν αποκλειστικά μέσω του επίσημου YouTube Data API και του επίσημου YouTube player· τίποτα δεν κατεβάζεται, αντιγράφεται ή αποθηκεύεται σε αυτόν τον ιστότοπο. Καθώς χρησιμοποιούνται μόνο δημόσια τεκμηριωμένες, επίσημες διεπαφές, η χρήση αυτού του ιστότοπου είναι νόμιμη.",
  },
  contactsLabel: {
    de: "// Kontakte", en: "// Contact", hi: "// संपर्क", zh: "// 联系方式", ko: "// 연락처", ja: "// 連絡先",
    es: "// Contacto", fr: "// Contact", tr: "// İletişim", ru: "// Контакты", pt: "// Contato", ar: "// اتصل بنا", el: "// Επικοινωνία",
  },
  nowPlayingLabel: {
    de: "// Now Playing", en: "// Now Playing", hi: "// अभी चल रहा है", zh: "// 正在播放", ko: "// 재생 중", ja: "// 再生中",
    es: "// Reproduciendo", fr: "// Lecture en cours", tr: "// Şimdi Çalıyor", ru: "// Сейчас играет", pt: "// A reproduzir", ar: "// قيد التشغيل الآن", el: "// Αναπαράγεται τώρα",
  },
  lastSongAria: {
    de: "Letzter Song", en: "Previous song", hi: "पिछला गाना", zh: "上一首歌曲", ko: "이전 곡", ja: "前の曲",
    es: "Canción anterior", fr: "Titre précédent", tr: "Önceki şarkı", ru: "Предыдущая песня", pt: "Música anterior", ar: "الأغنية السابقة", el: "Προηγούμενο τραγούδι",
  },
  nextSongAria: {
    de: "Nächster Song", en: "Next song", hi: "अगला गाना", zh: "下一首歌曲", ko: "다음 곡", ja: "次の曲",
    es: "Siguiente canción", fr: "Titre suivant", tr: "Sonraki şarkı", ru: "Следующая песня", pt: "Próxima música", ar: "الأغنية التالية", el: "Επόμενο τραγούδι",
  },
  playbackPositionAria: {
    de: "Wiedergabeposition", en: "Playback position", hi: "प्लेबैक स्थिति", zh: "播放进度", ko: "재생 위치", ja: "再生位置",
    es: "Posición de reproducción", fr: "Position de lecture", tr: "Oynatma konumu", ru: "Позиция воспроизведения", pt: "Posição de reprodução", ar: "موضع التشغيل", el: "Θέση αναπαραγωγής",
  },
  backToHomeAria: {
    de: "Zurück zur Startseite", en: "Back to home", hi: "होम पर वापस जाएं", zh: "返回主页", ko: "홈으로 돌아가기", ja: "ホームに戻る",
    es: "Volver al inicio", fr: "Retour à l'accueil", tr: "Ana sayfaya dön", ru: "Назад на главную", pt: "Voltar ao início", ar: "العودة إلى الصفحة الرئيسية", el: "Επιστροφή στην αρχική",
  },
  shuffleWord: {
    de: "Zufällig", en: "Shuffle", hi: "शफल", zh: "随机", ko: "무작위", ja: "シャッフル",
    es: "Aleatorio", fr: "Aléatoire", tr: "Karışık", ru: "Случайно", pt: "Aleatório", ar: "عشوائي", el: "Τυχαία",
  },

  solarSystemVisAria: {
    de: "Sonnensystem-Visualisierung", en: "Solar system visualization", hi: "सौर मंडल दृश्यीकरण", zh: "太阳系可视化", ko: "태양계 시각화", ja: "太陽系ビジュアライゼーション",
    es: "Visualización del sistema solar", fr: "Visualisation du système solaire", tr: "Güneş sistemi görselleştirmesi", ru: "Визуализация солнечной системы", pt: "Visualização do sistema solar", ar: "تصور النظام الشمسي", el: "Οπτικοποίηση ηλιακού συστήματος",
  },
  clearSearchAria: {
    de: "Suche zurücksetzen", en: "Clear search", hi: "खोज साफ़ करें", zh: "清除搜索", ko: "검색 지우기", ja: "検索をクリア",
    es: "Borrar búsqueda", fr: "Effacer la recherche", tr: "Aramayı temizle", ru: "Очистить поиск", pt: "Limpar pesquisa", ar: "مسح البحث", el: "Καθαρισμός αναζήτησης",
  },
  noSongSelected: {
    de: "Kein Song ausgewählt", en: "No song selected", hi: "कोई गाना चयनित नहीं", zh: "未选择歌曲", ko: "선택된 곡 없음", ja: "曲が選択されていません",
    es: "Ninguna canción seleccionada", fr: "Aucun titre sélectionné", tr: "Şarkı seçilmedi", ru: "Песня не выбрана", pt: "Nenhuma música selecionada", ar: "لم يتم اختيار أغنية", el: "Δεν επιλέχθηκε τραγούδι",
  },
  playerCloseAria: {
    de: "Player schließen", en: "Close player", hi: "प्लेयर बंद करें", zh: "关闭播放器", ko: "플레이어 닫기", ja: "プレーヤーを閉じる",
    es: "Cerrar reproductor", fr: "Fermer le lecteur", tr: "Oynatıcıyı kapat", ru: "Закрыть плеер", pt: "Fechar reprodutor", ar: "إغلاق المشغل", el: "Κλείσιμο player",
  },
  spaceNewsLabel: {
    de: "Space News", en: "Space News", hi: "स्पेस न्यूज़", zh: "航天新闻", ko: "우주 뉴스", ja: "宇宙ニュース",
    es: "Noticias espaciales", fr: "Actu spatiale", tr: "Uzay Haberleri", ru: "Космоновости", pt: "Notícias espaciais", ar: "أخبار الفضاء", el: "Νέα Διαστήματος",
  },
  liveLabel: {
    de: "Live", en: "Live", hi: "लाइव", zh: "实时", ko: "실시간", ja: "ライブ",
    es: "En vivo", fr: "En direct", tr: "Canlı", ru: "Прямой эфир", pt: "Ao vivo", ar: "مباشر", el: "Ζωντανά",
  },
  spaceNewsLoadError: {
    de: "Space News konnten nicht geladen werden.", en: "Space news could not be loaded.", hi: "स्पेस न्यूज़ लोड नहीं हो सकीं।", zh: "无法加载航天新闻。", ko: "우주 뉴스를 불러올 수 없습니다.", ja: "宇宙ニュースを読み込めませんでした。",
    es: "No se pudieron cargar las noticias espaciales.", fr: "Impossible de charger l'actualité spatiale.", tr: "Uzay haberleri yüklenemedi.", ru: "Не удалось загрузить космоновости.", pt: "Não foi possível carregar as notícias espaciais.", ar: "تعذر تحميل أخبار الفضاء.", el: "Δεν ήταν δυνατή η φόρτωση των νέων διαστήματος.",
  },
  byAuthor: {
    de: "Von", en: "By", hi: "द्वारा", zh: "作者：", ko: "작성자:", ja: "著者：",
    es: "Por", fr: "Par", tr: "Yazan:", ru: "Автор:", pt: "Por", ar: "بواسطة", el: "Από",
  },
  missionLabel: {
    de: "Mission", en: "Mission", hi: "मिशन", zh: "任务", ko: "미션", ja: "ミッション",
    es: "Misión", fr: "Mission", tr: "Görev", ru: "Миссия", pt: "Missão", ar: "المهمة", el: "Αποστολή",
  },
  eventLabel: {
    de: "Event", en: "Event", hi: "इवेंट", zh: "事件", ko: "이벤트", ja: "イベント",
    es: "Evento", fr: "Événement", tr: "Etkinlik", ru: "Событие", pt: "Evento", ar: "الحدث", el: "Εκδήλωση",
  },

  // Sprachumschalter
  languageMenuLabel: {
    de: "Sprache", en: "Language", hi: "भाषा", zh: "语言", ko: "언어", ja: "言語",
    es: "Idioma", fr: "Langue", tr: "Dil", ru: "Язык", pt: "Idioma", ar: "اللغة", el: "Γλώσσα",
  },
} as const satisfies Record<string, TranslationEntry>;

export const TRANSLATIONS: Record<keyof typeof TRANSLATIONS_SOURCE, TranslationEntry> = TRANSLATIONS_SOURCE;

export type TranslationKey = keyof typeof TRANSLATIONS_SOURCE;
