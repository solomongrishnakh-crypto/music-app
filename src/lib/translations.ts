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
  // Sichtbare Unterzeile mit Suchbegriffen (Nutzerwunsch 30.09.2026)
  universeSeoTagline: {
    de: "Sonnensystem live mit echten Positionen · Maschine der Ewigkeit · Alter des Universums", en: "Live solar system with real positions · Machine of Eternity · age of the universe",
    hi: "वास्तविक स्थितियों के साथ लाइव सौर मंडल · अनंतता की मशीन · ब्रह्मांड की आयु", zh: "真实位置的实时太阳系 · 永恒之机 · 宇宙年龄", ko: "실제 위치의 실시간 태양계 · 영원의 기계 · 우주의 나이", ja: "実際の位置によるライブ太陽系 · 永遠の機械 · 宇宙の年齢",
    es: "Sistema solar en vivo con posiciones reales · Máquina de la eternidad · edad del universo", fr: "Système solaire en direct aux positions réelles · Machine de l'éternité · âge de l'univers",
    tr: "Gerçek konumlarla canlı Güneş Sistemi · Sonsuzluk Makinesi · evrenin yaşı", ru: "Солнечная система в реальном времени · Машина вечности · возраст Вселенной",
    pt: "Sistema solar ao vivo com posições reais · Máquina da eternidade · idade do universo", ar: "النظام الشمسي مباشرةً بمواقع حقيقية · آلة الأبدية · عمر الكون", el: "Ζωντανό ηλιακό σύστημα με πραγματικές θέσεις · Μηχανή της αιωνιότητας · ηλικία του σύμπαντος",
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

  // Alters-Ticker (Nutzerwunsch 27.09.2026: "kannst ein timer hier oben
  // hinzufüge. quasi wie und des universum. sekunden,stundenjahre monate
  // alles am weiter ticken") — live weiterlaufender Schätzwert des
  // Universums-Alters direkt über den Fakten-Karten.
  universeAgeTickerLabel: {
    de: "// Alter des Universums · live", en: "// Age of the Universe · live", hi: "// ब्रह्मांड की आयु · लाइव", zh: "// 宇宙的年龄 · 实时", ko: "// 우주의 나이 · 실시간", ja: "// 宇宙の年齢・ライブ",
    es: "// Edad del Universo · en vivo", fr: "// Âge de l'Univers · en direct", tr: "// Evrenin Yaşı · canlı", ru: "// Возраст Вселенной · в реальном времени", pt: "// Idade do Universo · ao vivo", ar: "// عمر الكون · مباشر", el: "// Ηλικία του Σύμπαντος · ζωντανά",
  },
  ageYears: {
    de: "Jahre", en: "Years", hi: "वर्ष", zh: "年", ko: "년", ja: "年",
    es: "Años", fr: "Années", tr: "Yıl", ru: "Лет", pt: "Anos", ar: "سنوات", el: "Έτη",
  },
  ageMonths: {
    de: "Monate", en: "Months", hi: "महीने", zh: "月", ko: "개월", ja: "ヶ月",
    es: "Meses", fr: "Mois", tr: "Ay", ru: "Месяцев", pt: "Meses", ar: "أشهر", el: "Μήνες",
  },
  ageDays: {
    de: "Tage", en: "Days", hi: "दिन", zh: "天", ko: "일", ja: "日",
    es: "Días", fr: "Jours", tr: "Gün", ru: "Дней", pt: "Dias", ar: "أيام", el: "Ημέρες",
  },
  ageHours: {
    de: "Stunden", en: "Hours", hi: "घंटे", zh: "小时", ko: "시간", ja: "時間",
    es: "Horas", fr: "Heures", tr: "Saat", ru: "Часов", pt: "Horas", ar: "ساعات", el: "Ώρες",
  },
  ageMinutes: {
    de: "Minuten", en: "Minutes", hi: "मिनट", zh: "分钟", ko: "분", ja: "分",
    es: "Minutos", fr: "Minutes", tr: "Dakika", ru: "Минут", pt: "Minutos", ar: "دقائق", el: "Λεπτά",
  },
  ageSeconds: {
    de: "Sekunden", en: "Seconds", hi: "सेकंड", zh: "秒", ko: "초", ja: "秒",
    es: "Segundos", fr: "Secondes", tr: "Saniye", ru: "Секунд", pt: "Segundos", ar: "ثوانٍ", el: "Δευτερόλεπτα",
  },
  universeAgeTickerFootnote: {
    de: "Basierend auf ≈ 13,797 Mrd. Jahren (Planck-Messung); Monate/Tage sind Kalender-Näherungswerte, keine exakte kosmologische Größe.",
    en: "Based on ≈ 13.797 billion years (Planck measurement); months/days are calendar approximations, not an exact cosmological quantity.",
    hi: "≈ 13.797 अरब वर्ष (प्लैंक माप) पर आधारित; महीने/दिन कैलेंडर-अनुमान हैं, कोई सटीक ब्रह्मांडीय मान नहीं।",
    zh: "基于约137.97亿年(普朗克测量值);月/天为日历近似值,并非精确的宇宙学数值。",
    ko: "약 137억 9,700만 년(플랑크 측정치)을 기준으로 함. 월/일은 달력상의 근사치이며 정확한 우주론적 수치가 아님.",
    ja: "約137億9700万年(プランクの測定値)に基づく。月・日はカレンダー上の近似値であり、正確な宇宙論的数値ではない。",
    es: "Basado en ≈ 13.797 millones de años (medición de Planck); los meses/días son aproximaciones de calendario, no una cifra cosmológica exacta.",
    fr: "Basé sur ≈ 13,797 milliards d'années (mesure Planck) ; les mois/jours sont des approximations calendaires, pas une valeur cosmologique exacte.",
    tr: "≈ 13,797 milyar yıla (Planck ölçümü) dayanır; ay/gün takvim yaklaşık değerleridir, kesin bir kozmolojik değer değildir.",
    ru: "На основе ≈ 13,797 млрд лет (измерение «Планка»); месяцы/дни — календарные приближения, а не точная космологическая величина.",
    pt: "Baseado em ≈ 13,797 bilhões de anos (medição do Planck); meses/dias são aproximações de calendário, não um valor cosmológico exato.",
    ar: "استنادًا إلى ≈ 13.797 مليار سنة (قياس بلانك)؛ الأشهر/الأيام تقريبات تقويمية وليست قيمة كونية دقيقة.",
    el: "Βασισμένο σε ≈ 13,797 δισ. έτη (μέτρηση Planck)· οι μήνες/ημέρες είναι ημερολογιακές προσεγγίσεις, όχι ακριβές κοσμολογικό μέγεθος.",
  },

  gearLabel: {
    de: "Die Maschine der Ewigkeit", en: "The Machine of Eternity", hi: "अनंतता की मशीन", zh: "永恒之机", ko: "영원의 기계", ja: "永遠の機械",
    es: "La máquina de la eternidad", fr: "La machine de l'éternité", tr: "Sonsuzluk Makinesi", ru: "Машина вечности", pt: "A máquina da eternidade", ar: "آلة الأبدية", el: "Η μηχανή της αιωνιότητας",
  },
  gearCaption: {
    de: "Diese Maschine läuft seit dem Urknall. Jedes Zahnrad dreht das nächste an, aber sechsmal langsamer. Das erste schafft eine Runde in drei Sekunden, das zweite in zwanzig, das dritte in zwei Minuten. So wird es von Rad zu Rad langsamer, bis zum letzten: Es braucht für eine einzige Runde 13,8 Milliarden Jahre, so lange, wie es das Universum schon gibt. Keiner von uns wird es sich bewegen sehen, aber es dreht sich trotzdem. Die rote Markierung zeigt, wie weit.",
    en: "This machine has been running since the Big Bang. Each gear turns the next one, but six times slower. The first completes a turn in three seconds, the second in twenty, the third in two minutes. It gets slower from gear to gear, all the way to the last: it needs 13.8 billion years for a single turn, as long as the universe has existed. None of us will ever see it move, but it keeps turning anyway. The red mark shows how far.",
    hi: "यह मशीन बिग बैंग से चल रही है। हर गियर अगले को घुमाता है, लेकिन छह गुना धीमा। पहला तीन सेकंड में एक चक्कर लगाता है, दूसरा बीस में, तीसरा दो मिनट में। इस तरह हर गियर पिछले से धीमा होता जाता है, आखिरी तक: उसे एक चक्कर के लिए 13.8 अरब वर्ष चाहिए, उतना ही जितना ब्रह्मांड पुराना है। हममें से कोई उसे हिलते नहीं देखेगा, फिर भी वह घूम रहा है। लाल निशान दिखाता है कि कितना।",
    zh: "这台机器从宇宙大爆炸起就在运转。每个齿轮带动下一个,但慢六倍。第一个三秒转一圈,第二个二十秒,第三个两分钟。就这样一个比一个慢,直到最后一个:它转一圈需要138亿年,正好是宇宙存在的时间。我们谁都看不到它动,但它依然在转。红色标记显示它转了多远。",
    ko: "이 기계는 빅뱅 때부터 돌아가고 있다. 각 기어는 다음 기어를 돌리지만 여섯 배 느리다. 첫 번째는 3초에 한 바퀴, 두 번째는 20초, 세 번째는 2분이 걸린다. 이렇게 기어마다 느려져 마지막 기어는 한 바퀴에 138억 년이 걸린다. 우주가 존재해 온 시간만큼이다. 우리 중 누구도 그것이 움직이는 걸 보지 못하겠지만, 그래도 돌고 있다. 빨간 표시가 얼마나 돌았는지 보여준다.",
    ja: "この機械はビッグバンからずっと動いている。どの歯車も次の歯車を回すが、6倍遅くなる。1つ目は3秒で1回転、2つ目は20秒、3つ目は2分。こうして歯車ごとに遅くなり、最後の歯車は1回転に138億年かかる。宇宙が存在してきたのと同じ長さだ。誰もそれが動くのを見ることはないが、それでも回り続けている。赤い印がどこまで回ったかを示している。",
    es: "Esta máquina funciona desde el Big Bang. Cada engranaje mueve al siguiente, pero seis veces más despacio. El primero da una vuelta en tres segundos, el segundo en veinte, el tercero en dos minutos. Así va cada vez más lento, hasta el último: necesita 13.800 millones de años para una sola vuelta, tanto como existe el universo. Ninguno de nosotros lo verá moverse, pero aun así gira. La marca roja muestra cuánto.",
    fr: "Cette machine tourne depuis le Big Bang. Chaque engrenage entraîne le suivant, mais six fois plus lentement. Le premier fait un tour en trois secondes, le deuxième en vingt, le troisième en deux minutes. Ça ralentit ainsi d'engrenage en engrenage, jusqu'au dernier : il lui faut 13,8 milliards d'années pour un seul tour, l'âge de l'univers. Aucun de nous ne le verra bouger, mais il tourne quand même. La marque rouge montre jusqu'où.",
    tr: "Bu makine Büyük Patlama'dan beri çalışıyor. Her dişli bir sonrakini döndürüyor, ama altı kat daha yavaş. İlki üç saniyede bir tur atıyor, ikincisi yirmi saniyede, üçüncüsü iki dakikada. Böylece dişliden dişliye yavaşlıyor, sonuncusuna kadar: tek bir tur için 13,8 milyar yıl gerekiyor, evren var olduğundan beri geçen süre kadar. Hiçbirimiz onun hareket ettiğini görmeyeceğiz, ama yine de dönüyor. Kırmızı işaret ne kadar döndüğünü gösteriyor.",
    ru: "Эта машина работает с Большого взрыва. Каждая шестерня вращает следующую, но в шесть раз медленнее. Первая делает оборот за три секунды, вторая за двадцать, третья за две минуты. Так от шестерни к шестерне всё медленнее, вплоть до последней: ей нужно 13,8 млрд лет на один оборот — столько, сколько существует Вселенная. Никто из нас не увидит, как она движется, но она всё равно вращается. Красная метка показывает, насколько.",
    pt: "Esta máquina funciona desde o Big Bang. Cada engrenagem gira a seguinte, mas seis vezes mais devagar. A primeira dá uma volta em três segundos, a segunda em vinte, a terceira em dois minutos. Assim fica mais lenta de engrenagem em engrenagem, até a última: ela precisa de 13,8 bilhões de anos para uma única volta, o tempo que o universo existe. Nenhum de nós a verá se mover, mas ela continua girando. A marca vermelha mostra quanto.",
    ar: "تعمل هذه الآلة منذ الانفجار العظيم. كل ترس يدير الذي يليه، لكن أبطأ بست مرات. الأول يكمل دورة في ثلاث ثوانٍ، والثاني في عشرين، والثالث في دقيقتين. وهكذا يبطؤ من ترس إلى ترس حتى الأخير: يحتاج إلى 13.8 مليار سنة لدورة واحدة، بقدر عمر الكون. لن يراه أحد منا يتحرك، لكنه يدور رغم ذلك. العلامة الحمراء تُظهر إلى أي حد.",
    el: "Αυτή η μηχανή λειτουργεί από τη Μεγάλη Έκρηξη. Κάθε γρανάζι γυρίζει το επόμενο, αλλά έξι φορές πιο αργά. Το πρώτο κάνει μια στροφή σε τρία δευτερόλεπτα, το δεύτερο σε είκοσι, το τρίτο σε δύο λεπτά. Έτσι γίνεται όλο και πιο αργό, μέχρι το τελευταίο: χρειάζεται 13,8 δισ. χρόνια για μία μόνο στροφή, όσο υπάρχει το σύμπαν. Κανείς μας δεν θα το δει να κινείται, αλλά γυρίζει παρ' όλα αυτά. Το κόκκινο σημάδι δείχνει πόσο.",
  },
  // Rad-für-Rad-Navigation der Zahnrad-Maschine
  gearNavPrev: {
    de: "Vorheriges Rad", en: "Previous gear", hi: "पिछला गियर", zh: "上一个齿轮", ko: "이전 기어", ja: "前の歯車",
    es: "Engranaje anterior", fr: "Engrenage précédent", tr: "Önceki dişli", ru: "Предыдущая шестерня", pt: "Engrenagem anterior", ar: "الترس السابق", el: "Προηγούμενο γρανάζι",
  },
  gearNavNext: {
    de: "Nächstes Rad", en: "Next gear", hi: "अगला गियर", zh: "下一个齿轮", ko: "다음 기어", ja: "次の歯車",
    es: "Siguiente engranaje", fr: "Engrenage suivant", tr: "Sonraki dişli", ru: "Следующая шестерня", pt: "Próxima engrenagem", ar: "الترس التالي", el: "Επόμενο γρανάζι",
  },
  gearNavOverview: {
    de: "Übersicht", en: "Overview", hi: "अवलोकन", zh: "总览", ko: "전체 보기", ja: "全体",
    es: "Vista general", fr: "Vue d'ensemble", tr: "Genel görünüm", ru: "Обзор", pt: "Visão geral", ar: "نظرة عامة", el: "Επισκόπηση",
  },
  gearNavGear: {
    de: "Rad {n} von {total}", en: "Gear {n} of {total}", hi: "गियर {n} / {total}", zh: "第 {n} 个齿轮(共 {total} 个)", ko: "{total}개 중 {n}번 기어", ja: "歯車 {n} / {total}",
    es: "Engranaje {n} de {total}", fr: "Engrenage {n} sur {total}", tr: "Dişli {n} / {total}", ru: "Шестерня {n} из {total}", pt: "Engrenagem {n} de {total}", ar: "الترس {n} من {total}", el: "Γρανάζι {n} από {total}",
  },
  gearNavPeriod: {
    de: "1 Umdrehung: {t}", en: "1 rotation: {t}", hi: "1 चक्कर: {t}", zh: "转一圈:{t}", ko: "1회전: {t}", ja: "1回転:{t}",
    es: "1 vuelta: {t}", fr: "1 tour : {t}", tr: "1 tur: {t}", ru: "1 оборот: {t}", pt: "1 volta: {t}", ar: "دورة واحدة: {t}", el: "1 περιστροφή: {t}",
  },
  gearNavAngle: {
    de: "Stellung jetzt", en: "Position now", hi: "अभी की स्थिति", zh: "当前角度", ko: "현재 위치", ja: "現在の角度",
    es: "Posición actual", fr: "Position actuelle", tr: "Şu anki konum", ru: "Положение сейчас", pt: "Posição atual", ar: "الموضع الآن", el: "Θέση τώρα",
  },
  gearNavHint: {
    de: "Wischen oder ◀ ▶ – Rad für Rad bis zum letzten", en: "Swipe or ◀ ▶ – gear by gear to the last one", hi: "स्वाइप करें या ◀ ▶ – गियर-दर-गियर आखिरी तक", zh: "滑动或 ◀ ▶ —— 逐个查看直到最后一个齿轮", ko: "스와이프 또는 ◀ ▶ – 마지막 기어까지 하나씩", ja: "スワイプまたは ◀ ▶ ― 最後の歯車まで1つずつ",
    es: "Desliza o ◀ ▶ – engranaje a engranaje hasta el último", fr: "Balayez ou ◀ ▶ – engrenage par engrenage jusqu'au dernier", tr: "Kaydır veya ◀ ▶ – sonuncuya kadar dişli dişli", ru: "Свайп или ◀ ▶ — шестерня за шестернёй до последней", pt: "Deslize ou ◀ ▶ – engrenagem a engrenagem até a última", ar: "اسحب أو ◀ ▶ – ترسًا ترسًا حتى الأخير", el: "Σύρετε ή ◀ ▶ – γρανάζι-γρανάζι μέχρι το τελευταίο",
  },

  // Sonnensystem-Modal
  solarSystemTapHint: {
    de: "Planet tippen für Details", en: "Tap a planet for details", hi: "विवरण के लिए ग्रह पर टैप करें", zh: "点击行星查看详情", ko: "행성을 탭하면 자세히 보기", ja: "惑星をタップして詳細を表示",
    es: "Toca un planeta para más detalles", fr: "Touchez une planète pour les détails", tr: "Ayrıntılar için gezegene dokunun", ru: "Нажмите на планету для подробностей", pt: "Toque num planeta para detalhes", ar: "اضغط على كوكب لعرض التفاصيل", el: "Πατήστε έναν πλανήτη για λεπτομέρειες",
  },
  // Nutzerwunsch 29.09.2026 ("realistischer mit Größe, Abstand"): Umschalter
  // echter Maßstab / kompakt, Zeitraffer und Datum im Sonnensystem.
  solarScaleReal: {
    de: "Echter Maßstab", en: "True scale", hi: "वास्तविक पैमाना", zh: "真实比例", ko: "실제 축척", ja: "実寸スケール",
    es: "Escala real", fr: "Échelle réelle", tr: "Gerçek ölçek", ru: "Реальный масштаб", pt: "Escala real", ar: "المقياس الحقيقي", el: "Πραγματική κλίμακα",
  },
  solarScaleCompact: {
    de: "Kompakt", en: "Compact", hi: "संक्षिप्त", zh: "紧凑", ko: "간략", ja: "コンパクト",
    es: "Compacto", fr: "Compact", tr: "Kompakt", ru: "Компактно", pt: "Compacto", ar: "مضغوط", el: "Συμπαγές",
  },
  solarScaleRealNote: {
    de: "Alles maßstabsgetreu: Abstände, Sonne & Planeten · Winzige als Punkt", en: "Everything to scale: distances, Sun & planets · tiny ones as dots",
    hi: "सब कुछ वास्तविक पैमाने पर: दूरियाँ, सूर्य और ग्रह · बहुत छोटे बिंदु के रूप में", zh: "全部按真实比例：距离、太阳和行星 · 过小的显示为点", ko: "모두 실제 비율: 거리, 태양, 행성 · 아주 작은 것은 점으로", ja: "すべて実寸：距離・太陽・惑星 · 小さすぎるものは点で表示",
    es: "Todo a escala: distancias, Sol y planetas · los diminutos como puntos", fr: "Tout à l'échelle : distances, Soleil et planètes · les minuscules en points",
    tr: "Her şey ölçekli: mesafeler, Güneş ve gezegenler · çok küçükler nokta olarak", ru: "Всё в масштабе: расстояния, Солнце и планеты · крошечные — точками",
    pt: "Tudo à escala: distâncias, Sol e planetas · os minúsculos como pontos", ar: "كل شيء بالمقياس الحقيقي: المسافات والشمس والكواكب · الصغيرة جدًا كنقاط", el: "Όλα σε κλίμακα: αποστάσεις, Ήλιος & πλανήτες · οι μικροσκοπικοί ως τελείες",
  },
  solarScaleCompactNote: {
    de: "Abstände gestaucht · ab 3× Zoom Größen echt im Verhältnis zur Sonne", en: "Distances compressed · from 3× zoom, sizes true relative to the Sun",
    hi: "दूरियाँ संकुचित · 3× ज़ूम से आकार सूर्य के अनुपात में वास्तविक", zh: "距离已压缩 · 放大3倍起，大小与太阳的比例真实", ko: "거리 압축 · 3배 확대부터 크기가 태양 대비 실제 비율", ja: "距離は圧縮 · 3倍ズーム以上で太陽との大きさの比が実寸",
    es: "Distancias comprimidas · desde zoom 3×, tamaños reales respecto al Sol", fr: "Distances compressées · dès le zoom 3×, tailles réelles par rapport au Soleil",
    tr: "Mesafeler sıkıştırılmış · 3× yakınlaştırmadan itibaren boyutlar Güneş'e göre gerçek", ru: "Расстояния сжаты · с 3× размеры реальны относительно Солнца",
    pt: "Distâncias comprimidas · a partir de zoom 3×, tamanhos reais em relação ao Sol", ar: "المسافات مضغوطة · من تكبير 3× الأحجام حقيقية نسبةً إلى الشمس", el: "Συμπιεσμένες αποστάσεις · από ζουμ 3× μεγέθη πραγματικά σε σχέση με τον Ήλιο",
  },
  solarDaysPerSecond: {
    de: "Tage/s", en: "days/s", hi: "दिन/से", zh: "天/秒", ko: "일/초", ja: "日/秒",
    es: "días/s", fr: "jours/s", tr: "gün/sn", ru: "дн./с", pt: "dias/s", ar: "يوم/ث", el: "ημέρες/δ",
  },
  // Nutzerwunsch 01.10.2026: Live-Bewegung + "wann kommt Mars nah"
  solarLive: {
    de: "Live", en: "Live", hi: "लाइव", zh: "实时", ko: "실시간", ja: "ライブ",
    es: "En vivo", fr: "En direct", tr: "Canlı", ru: "Онлайн", pt: "Ao vivo", ar: "مباشر", el: "Ζωντανά",
  },
  // Nutzerwunsch 01.10.2026: "schreib, dass es echte Rotation ist"
  solarRealMotionLive: {
    de: "Echte Bewegung in Echtzeit · Positionen aus NASA/JPL-Bahndaten", en: "Real motion in real time · positions from NASA/JPL orbital data",
    hi: "वास्तविक समय में वास्तविक गति · NASA/JPL कक्षीय डेटा से स्थितियाँ", zh: "实时的真实运动 · 位置来自NASA/JPL轨道数据", ko: "실시간 실제 움직임 · NASA/JPL 궤도 데이터 기반 위치", ja: "リアルタイムの実際の動き · NASA/JPL軌道データによる位置",
    es: "Movimiento real en tiempo real · posiciones de datos orbitales de NASA/JPL", fr: "Mouvement réel en temps réel · positions d'après les données orbitales NASA/JPL",
    tr: "Gerçek zamanlı gerçek hareket · konumlar NASA/JPL yörünge verilerinden", ru: "Реальное движение в реальном времени · положения по орбитальным данным NASA/JPL",
    pt: "Movimento real em tempo real · posições de dados orbitais da NASA/JPL", ar: "حركة حقيقية في الوقت الفعلي · المواقع من بيانات مدارات NASA/JPL", el: "Πραγματική κίνηση σε πραγματικό χρόνο · θέσεις από τροχιακά δεδομένα NASA/JPL",
  },
  solarRealMotionFast: {
    de: "Echte Bahnen & Geschwindigkeiten im Zeitraffer · NASA/JPL-Bahndaten", en: "Real orbits & speeds in time-lapse · NASA/JPL orbital data",
    hi: "टाइम-लैप्स में वास्तविक कक्षाएँ और गति · NASA/JPL कक्षीय डेटा", zh: "延时播放的真实轨道与速度 · NASA/JPL轨道数据", ko: "타임랩스로 보는 실제 궤도와 속도 · NASA/JPL 궤도 데이터", ja: "タイムラプスで見る実際の軌道と速度 · NASA/JPL軌道データ",
    es: "Órbitas y velocidades reales en cámara rápida · datos orbitales de NASA/JPL", fr: "Orbites et vitesses réelles en accéléré · données orbitales NASA/JPL",
    tr: "Hızlandırılmış gerçek yörüngeler ve hızlar · NASA/JPL yörünge verileri", ru: "Реальные орбиты и скорости в ускоренном режиме · данные NASA/JPL",
    pt: "Órbitas e velocidades reais em time-lapse · dados orbitais da NASA/JPL", ar: "مدارات وسرعات حقيقية بتسريع زمني · بيانات مدارات NASA/JPL", el: "Πραγματικές τροχιές & ταχύτητες σε επιτάχυνση · τροχιακά δεδομένα NASA/JPL",
  },
  solarGoToDate: {
    de: "Datum wählen", en: "Choose date", hi: "तिथि चुनें", zh: "选择日期", ko: "날짜 선택", ja: "日付を選択",
    es: "Elegir fecha", fr: "Choisir une date", tr: "Tarih seç", ru: "Выбрать дату", pt: "Escolher data", ar: "اختر التاريخ", el: "Επιλογή ημερομηνίας",
  },
  solarJumpToDate: {
    de: "Zu diesem Datum springen", en: "Jump to this date", hi: "इस तिथि पर जाएँ", zh: "跳转到此日期", ko: "이 날짜로 이동", ja: "この日付へ移動",
    es: "Ir a esta fecha", fr: "Aller à cette date", tr: "Bu tarihe git", ru: "Перейти к этой дате", pt: "Ir para esta data", ar: "الانتقال إلى هذا التاريخ", el: "Μετάβαση σε αυτή την ημερομηνία",
  },
  solarDistances: {
    de: "Abstand zur Erde", en: "Distance from Earth", hi: "पृथ्वी से दूरी", zh: "与地球的距离", ko: "지구와의 거리", ja: "地球からの距離",
    es: "Distancia a la Tierra", fr: "Distance à la Terre", tr: "Dünya'ya uzaklık", ru: "Расстояние до Земли", pt: "Distância da Terra", ar: "المسافة عن الأرض", el: "Απόσταση από τη Γη",
  },
  solarNow: {
    de: "Jetzt", en: "Now", hi: "अभी", zh: "现在", ko: "지금", ja: "現在",
    es: "Ahora", fr: "Maintenant", tr: "Şimdi", ru: "Сейчас", pt: "Agora", ar: "الآن", el: "Τώρα",
  },
  solarNextClosest: {
    de: "Nächste Annäherung", en: "Next closest approach", hi: "अगला निकटतम दृष्टिकोण", zh: "下次最接近", ko: "다음 최근접", ja: "次の最接近",
    es: "Próxima máxima aproximación", fr: "Prochain rapprochement", tr: "Sonraki en yakın yaklaşım", ru: "Следующее сближение", pt: "Próxima aproximação máxima", ar: "أقرب اقتراب قادم", el: "Επόμενη μέγιστη προσέγγιση",
  },
  solarMillionKm: {
    de: "Mio. km", en: "million km", hi: "मिलियन किमी", zh: "百万公里", ko: "백만 km", ja: "百万km",
    es: "mill. km", fr: "millions km", tr: "milyon km", ru: "млн км", pt: "milhões km", ar: "مليون كم", el: "εκατ. χλμ.",
  },
  solarLightMinutes: {
    de: "Licht-Min.", en: "light-min", hi: "प्रकाश-मिनट", zh: "光分", ko: "광분", ja: "光分",
    es: "min-luz", fr: "min-lumière", tr: "ışık-dk", ru: "свет. мин", pt: "min-luz", ar: "دقيقة ضوئية", el: "λεπτά φωτός",
  },
  solarDistanceNote: {
    de: "Berechnet aus NASA/JPL-Bahndaten zum angezeigten Datum.", en: "Calculated from NASA/JPL orbital data for the date shown.",
    hi: "दिखाई गई तिथि के लिए NASA/JPL कक्षीय डेटा से गणना।", zh: "根据NASA/JPL轨道数据按所示日期计算。", ko: "표시된 날짜 기준 NASA/JPL 궤도 데이터로 계산.", ja: "表示日付のNASA/JPL軌道データから計算。",
    es: "Calculado con datos orbitales de NASA/JPL para la fecha mostrada.", fr: "Calculé à partir des données orbitales NASA/JPL pour la date affichée.",
    tr: "Gösterilen tarih için NASA/JPL yörünge verilerinden hesaplandı.", ru: "Рассчитано по орбитальным данным NASA/JPL на показанную дату.",
    pt: "Calculado a partir de dados orbitais da NASA/JPL para a data mostrada.", ar: "محسوب من بيانات مدارات NASA/JPL للتاريخ المعروض.", el: "Υπολογισμένο από τροχιακά δεδομένα NASA/JPL για την εμφανιζόμενη ημερομηνία.",
  },
  solarToday: {
    de: "Heute", en: "Today", hi: "आज", zh: "今天", ko: "오늘", ja: "今日",
    es: "Hoy", fr: "Aujourd'hui", tr: "Bugün", ru: "Сегодня", pt: "Hoje", ar: "اليوم", el: "Σήμερα",
  },
  skyLinkLabel: {
    de: "Sternenhimmel live", en: "Night sky live", hi: "रात्रि आकाश लाइव", zh: "实时星空", ko: "실시간 밤하늘", ja: "ライブ星空",
    es: "Cielo nocturno en vivo", fr: "Ciel nocturne en direct", tr: "Canlı gece gökyüzü", ru: "Звёздное небо онлайн", pt: "Céu noturno ao vivo", ar: "سماء الليل مباشرة", el: "Νυχτερινός ουρανός ζωντανά",
  },
  skyLinkTitle: {
    de: "Welche Sterne siehst du gerade? Halte dein Handy in den Himmel", en: "Which stars can you see right now? Hold your phone up to the sky",
    hi: "अभी कौन से तारे दिख रहे हैं? अपना फ़ोन आकाश की ओर करें", zh: "现在能看到哪些星星？把手机对准天空", ko: "지금 어떤 별이 보일까요? 휴대폰을 하늘로 향하세요", ja: "今どの星が見える？スマホを空にかざそう",
    es: "¿Qué estrellas ves ahora? Apunta tu móvil al cielo", fr: "Quelles étoiles voyez-vous maintenant ? Pointez votre téléphone vers le ciel",
    tr: "Şu an hangi yıldızları görüyorsun? Telefonunu gökyüzüne tut", ru: "Какие звёзды видны сейчас? Наведите телефон на небо",
    pt: "Quais estrelas você vê agora? Aponte o celular para o céu", ar: "ما النجوم التي تراها الآن؟ وجّه هاتفك نحو السماء", el: "Ποια αστέρια βλέπεις τώρα; Στρέψε το κινητό στον ουρανό",
  },
  solarSystemDragHint: {
    de: "Ziehen: drehen · Rechtsklick / 2 Finger: verschieben · Mausrad / Pinch: zoomen · Doppelklick: hinfliegen", en: "Drag: orbit · Right-drag / 2 fingers: pan · Scroll / pinch: zoom · Double-click: fly to",
    hi: "खींचें: घुमाएं · राइट-ड्रैग / 2 उंगलियां: खिसकाएं · स्क्रॉल / पिंच: ज़ूम · डबल-क्लिक: वहां जाएं", zh: "拖动：环绕旋转 · 右键 / 双指：平移 · 滚轮 / 双指捏合：缩放 · 双击：飞往", ko: "드래그: 회전 · 우클릭 / 두 손가락: 이동 · 스크롤 / 핀치: 확대/축소 · 더블클릭: 날아가기", ja: "ドラッグ：回転 · 右ドラッグ / 2本指：移動 · ホイール / ピンチ：ズーム · ダブルクリック：移動",
    es: "Arrastrar: girar · Clic derecho / 2 dedos: mover · Rueda / pellizcar: zoom · Doble clic: volar hasta", fr: "Glisser : pivoter · Clic droit / 2 doigts : déplacer · Molette / pincer : zoom · Double-clic : s'y rendre",
    tr: "Sürükle: döndür · Sağ tık / 2 parmak: kaydır · Tekerlek / iki parmak: yakınlaştır · Çift tık: oraya uç", ru: "Перетаскивание: вращение · Правая кнопка / 2 пальца: сдвиг · Колесо / щипок: масштаб · Двойной клик: перелёт",
    pt: "Arrastar: girar · Botão direito / 2 dedos: mover · Roda / pinça: zoom · Duplo clique: voar até", ar: "اسحب: تدوير · زر يمين / إصبعان: تحريك · العجلة / القرص: تكبير · نقرتان: الانتقال إليه", el: "Σύρετε: περιστροφή · Δεξί κλικ / 2 δάχτυλα: μετακίνηση · Ροδέλα / τσίμπημα: ζουμ · Διπλό κλικ: μετάβαση",
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
  // Sichtbare Unterzeile mit den Suchbegriffen (Nutzerwunsch 30.09.2026:
  // bei "Weltgeschichte Karte" gefunden werden)
  empiresSeoTagline: {
    de: "Interaktive Weltgeschichte-Karte · alle Reiche von 3400 v. Chr. bis heute", en: "Interactive world history map · every empire from 3400 BC to today",
    hi: "इंटरैक्टिव विश्व इतिहास मानचित्र · 3400 ई.पू. से आज तक सभी साम्राज्य", zh: "互动世界历史地图 · 从公元前3400年至今的所有帝国", ko: "인터랙티브 세계사 지도 · 기원전 3400년부터 오늘날까지 모든 제국", ja: "インタラクティブ世界史マップ · 紀元前3400年から現在までのすべての帝国",
    es: "Mapa interactivo de historia mundial · todos los imperios desde el 3400 a. C. hasta hoy", fr: "Carte interactive de l'histoire du monde · tous les empires de 3400 av. J.-C. à aujourd'hui",
    tr: "Etkileşimli dünya tarihi haritası · MÖ 3400'den bugüne tüm imparatorluklar", ru: "Интерактивная карта всемирной истории · все империи с 3400 г. до н. э. до наших дней",
    pt: "Mapa interativo da história mundial · todos os impérios de 3400 a.C. até hoje", ar: "خريطة تفاعلية لتاريخ العالم · كل الإمبراطوريات من 3400 ق.م حتى اليوم", el: "Διαδραστικός χάρτης παγκόσμιας ιστορίας · όλες οι αυτοκρατορίες από το 3400 π.Χ. έως σήμερα",
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
  // Nutzerkorrektur 21.09.2026 ("wieso steht da wieder texte auf deutsch
  // zb ... n chr") — formatYear() haengte bisher IMMER "v. Chr."/"n. Chr."
  // an, unabhaengig von der UI-Sprache.
  prehistTitle: {
    de: "Urzeit & Steinzeit",
    en: "Prehistory & Stone Age",
    hi: "प्रागैतिहासिक काल और पाषाण युग",
    zh: "史前与石器时代",
    ko: "선사 시대와 석기 시대",
    ja: "先史時代と石器時代",
    es: "Prehistoria y Edad de Piedra",
    fr: "Préhistoire et âge de pierre",
    tr: "Tarih öncesi ve Taş Devri",
    ru: "Доисторическая эпоха и каменный век",
    pt: "Pré-história e Idade da Pedra",
    ar: "ما قبل التاريخ والعصر الحجري",
    el: "Προϊστορία και Λίθινη Εποχή",
  },
  prehistHint: {
    de: "Vor den ersten Reichen: Menschenarten, Jäger und Sammler, erste Bauern und Dörfer. Zeitpunkt antippen, dann ein Gebiet für Infos.",
    en: "Before the first empires: human species, hunter-gatherers, first farmers and villages. Tap a moment, then an area for info.",
    hi: "पहले साम्राज्यों से पहले: मानव प्रजातियाँ, शिकारी-संग्राहक, पहले किसान और गाँव। कोई समय चुनें, फिर जानकारी के लिए कोई क्षेत्र।",
    zh: "最早的帝国之前：人类物种、狩猎采集者、最早的农民和村落。先点选一个时间，再点一个区域查看信息。",
    ko: "최초의 제국 이전: 인류 종, 수렵채집인, 최초의 농부와 마을. 시점을 누른 뒤 지역을 눌러 정보를 보세요.",
    ja: "最初の帝国より前：人類の種、狩猟採集民、最初の農民と村。時代をタップし、地域をタップすると情報が出ます。",
    es: "Antes de los primeros imperios: especies humanas, cazadores-recolectores, primeros agricultores y aldeas. Toca una época y luego una zona para ver información.",
    fr: "Avant les premiers empires : espèces humaines, chasseurs-cueilleurs, premiers agriculteurs et villages. Touchez une époque, puis une zone pour en savoir plus.",
    tr: "İlk imparatorluklardan önce: insan türleri, avcı-toplayıcılar, ilk çiftçiler ve köyler. Bir zamana, sonra bilgi için bir bölgeye dokun.",
    ru: "До первых империй: виды людей, охотники-собиратели, первые земледельцы и деревни. Выберите эпоху, затем область для информации.",
    pt: "Antes dos primeiros impérios: espécies humanas, caçadores-coletores, primeiros agricultores e aldeias. Toque numa época e depois numa área para ver informações.",
    ar: "قبل أولى الإمبراطوريات: أنواع البشر والصيادون الجامعون وأوائل المزارعين والقرى. اختر زمنًا ثم منطقة لمعرفة المزيد.",
    el: "Πριν από τις πρώτες αυτοκρατορίες: είδη ανθρώπων, κυνηγοί-τροφοσυλλέκτες, πρώτοι γεωργοί και χωριά. Πάτησε μια εποχή και μετά μια περιοχή για πληροφορίες.",
  },
  prehistBack: {
    de: "Zu den Reichen",
    en: "To the empires",
    hi: "साम्राज्यों पर",
    zh: "回到帝国",
    ko: "제국으로",
    ja: "帝国へ",
    es: "A los imperios",
    fr: "Vers les empires",
    tr: "İmparatorluklara",
    ru: "К империям",
    pt: "Para os impérios",
    ar: "إلى الإمبراطوريات",
    el: "Στις αυτοκρατορίες",
  },
  prehistResult: {
    de: "Urzeit-Kultur",
    en: "Prehistoric culture",
    hi: "प्रागैतिहासिक संस्कृति",
    zh: "史前文化",
    ko: "선사 문화",
    ja: "先史文化",
    es: "Cultura prehistórica",
    fr: "Culture préhistorique",
    tr: "Tarih öncesi kültür",
    ru: "Доисторическая культура",
    pt: "Cultura pré-histórica",
    ar: "ثقافة ما قبل التاريخ",
    el: "Προϊστορικός πολιτισμός",
  },
  prehistPeriod: {
    de: "Zeitraum (ungefähr):",
    en: "Period (approx.):",
    hi: "काल (लगभग):",
    zh: "时期（约）：",
    ko: "시기 (대략):",
    ja: "時期（おおよそ）:",
    es: "Período (aprox.):",
    fr: "Période (env.) :",
    tr: "Dönem (yaklaşık):",
    ru: "Период (примерно):",
    pt: "Período (aprox.):",
    ar: "الفترة (تقريبًا):",
    el: "Περίοδος (περίπου):",
  },
  linkAllPlanets: {
    de: "Alle Planeten & Fakten", en: "All planets & facts", hi: "सभी ग्रह और तथ्य", zh: "所有行星与资料", ko: "모든 행성과 정보", ja: "すべての惑星とデータ",
    es: "Todos los planetas y datos", fr: "Toutes les planètes et infos", tr: "Tüm gezegenler ve bilgiler", ru: "Все планеты и факты", pt: "Todos os planetas e fatos", ar: "كل الكواكب وحقائقها", el: "Όλοι οι πλανήτες και στοιχεία",
  },
  linkMachine: {
    de: "Maschine der Ewigkeit erklärt", en: "The eternity machine explained", hi: "अनंत काल की मशीन समझें", zh: "永恒机器详解", ko: "영원의 기계 설명", ja: "永遠のマシンの解説",
    es: "La máquina de la eternidad explicada", fr: "La machine de l'éternité expliquée", tr: "Sonsuzluk makinesi nasıl çalışır", ru: "Как работает машина вечности", pt: "A máquina da eternidade explicada", ar: "شرح آلة الأبدية", el: "Η μηχανή της αιωνιότητας εξηγείται",
  },
  linkSkyToday: {
    de: "Himmel heute", en: "Sky tonight", hi: "आज रात का आसमान", zh: "今晚星空", ko: "오늘 밤 하늘", ja: "今夜の空",
    es: "El cielo esta noche", fr: "Le ciel ce soir", tr: "Bu gece gökyüzü", ru: "Небо сегодня", pt: "O céu hoje à noite", ar: "السماء الليلة", el: "Ο ουρανός απόψε",
  },
  linkConstellations: {
    de: "Alle 88 Sternbilder", en: "All 88 constellations", hi: "सभी 88 तारामंडल", zh: "全部88个星座", ko: "88개 별자리 전체", ja: "全88星座",
    es: "Las 88 constelaciones", fr: "Les 88 constellations", tr: "88 takımyıldızın tamamı", ru: "Все 88 созвездий", pt: "As 88 constelações", ar: "الكوكبات الـ88", el: "Και οι 88 αστερισμοί",
  },
  empiresOwnPage: {
    de: "Seite zu diesem Reich", en: "Page about this empire", hi: "इस साम्राज्य का पेज", zh: "该帝国的专页", ko: "이 제국 페이지", ja: "この帝国のページ",
    es: "Página de este imperio", fr: "Page de cet empire", tr: "Bu imparatorluğun sayfası", ru: "Страница этой державы", pt: "Página deste império", ar: "صفحة هذه الإمبراطورية", el: "Σελίδα αυτής της αυτοκρατορίας",
  },
  empiresAllEmpires: {
    de: "Alle Reiche von A–Z", en: "All empires A–Z", hi: "सभी साम्राज्य A–Z", zh: "所有帝国一览", ko: "모든 제국 목록", ja: "すべての帝国一覧",
    es: "Todos los imperios A–Z", fr: "Tous les empires de A à Z", tr: "Tüm imparatorluklar A–Z", ru: "Все державы от А до Я", pt: "Todos os impérios A–Z", ar: "كل الإمبراطوريات", el: "Όλες οι αυτοκρατορίες Α–Ω",
  },
  empiresShare: {
    de: "Teilen", en: "Share", hi: "साझा करें", zh: "分享", ko: "공유", ja: "共有",
    es: "Compartir", fr: "Partager", tr: "Paylaş", ru: "Поделиться", pt: "Compartilhar", ar: "مشاركة", el: "Κοινοποίηση",
  },
  empiresLinkCopied: {
    de: "Link kopiert", en: "Link copied", hi: "लिंक कॉपी हुआ", zh: "链接已复制", ko: "링크 복사됨", ja: "リンクをコピーしました",
    es: "Enlace copiado", fr: "Lien copié", tr: "Bağlantı kopyalandı", ru: "Ссылка скопирована", pt: "Link copiado", ar: "تم نسخ الرابط", el: "Ο σύνδεσμος αντιγράφηκε",
  },
  empiresShareTitle: {
    de: "Die Welt im Jahr", en: "The world in", hi: "दुनिया, वर्ष", zh: "世界地图：", ko: "세계 지도:", ja: "世界地図：",
    es: "El mundo en el año", fr: "Le monde en", tr: "Dünya, yıl", ru: "Мир в", pt: "O mundo no ano", ar: "العالم في عام", el: "Ο κόσμος το",
  },
  empiresEraBC: {
    de: "v. Chr.", en: "BC", hi: "ईसा पूर्व", zh: "公元前", ko: "기원전", ja: "紀元前",
    es: "a. C.", fr: "av. J.-C.", tr: "MÖ", ru: "до н. э.", pt: "a.C.", ar: "ق.م.", el: "π.Χ.",
  },
  empiresEraAD: {
    de: "n. Chr.", en: "AD", hi: "ईसवी", zh: "公元", ko: "기원후", ja: "紀元後",
    es: "d. C.", fr: "apr. J.-C.", tr: "MS", ru: "н. э.", pt: "d.C.", ar: "م.", el: "μ.Χ.",
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
    de: "KI-News", en: "AI News", hi: "AI समाचार", zh: "AI 新闻", ko: "AI 뉴스", ja: "AIニュース",
    es: "Noticias de IA", fr: "Actus IA", tr: "Yapay Zekâ Haberleri", ru: "Новости ИИ", pt: "Notícias de IA", ar: "أخبار الذكاء الاصطناعي", el: "Νέα AI",
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
  aboutLead: {
    de: "Centaurian ist ein privates Hobby-Projekt: ein kleiner Ort, um Musik zu hören und unsere Welt und das Universum zu entdecken — kostenlos, ohne Anmeldung, ohne Werbung.",
    en: "Centaurian is a private hobby project: a small place to listen to music and explore our world and the universe — free, no sign-up, no ads.",
    hi: "Centaurian एक निजी शौक परियोजना है: संगीत सुनने और हमारी दुनिया व ब्रह्मांड को खोजने की एक छोटी-सी जगह — मुफ़्त, बिना साइन-अप, बिना विज्ञापन।",
    zh: "Centaurian 是一个私人兴趣项目：一个听音乐、探索我们的世界和宇宙的小地方——免费、无需注册、没有广告。",
    ko: "Centaurian은 개인 취미 프로젝트입니다. 음악을 듣고 우리 세계와 우주를 탐험하는 작은 공간 — 무료, 가입 불필요, 광고 없음.",
    ja: "Centaurianは個人の趣味プロジェクトです。音楽を聴き、私たちの世界と宇宙を探検する小さな場所 — 無料、登録不要、広告なし。",
    es: "Centaurian es un proyecto personal: un pequeño lugar para escuchar música y explorar nuestro mundo y el universo — gratis, sin registro y sin anuncios.",
    fr: "Centaurian est un projet personnel : un petit lieu pour écouter de la musique et explorer notre monde et l'univers — gratuit, sans inscription, sans publicité.",
    tr: "Centaurian kişisel bir hobi projesidir: müzik dinlemek, dünyamızı ve evreni keşfetmek için küçük bir yer — ücretsiz, kayıt yok, reklam yok.",
    ru: "Centaurian — частный хобби-проект: небольшое место, чтобы слушать музыку и открывать наш мир и Вселенную — бесплатно, без регистрации и без рекламы.",
    pt: "Centaurian é um projeto pessoal: um pequeno lugar para ouvir música e explorar o nosso mundo e o universo — grátis, sem registo e sem anúncios.",
    ar: "Centaurian مشروع هواية خاص: مكان صغير للاستماع إلى الموسيقى واستكشاف عالمنا والكون — مجاني، بدون تسجيل، وبدون إعلانات.",
    el: "Το Centaurian είναι ένα ιδιωτικό χόμπι: ένας μικρός χώρος για να ακούς μουσική και να εξερευνάς τον κόσμο μας και το σύμπαν — δωρεάν, χωρίς εγγραφή, χωρίς διαφημίσεις.",
  },
  aboutF1: {
    de: "Musik — Songs suchen und direkt hören, über den offiziellen YouTube-Player.",
    en: "Music — search songs and play them right here via the official YouTube player.",
    hi: "संगीत — गाने खोजें और आधिकारिक YouTube प्लेयर से सीधे यहीं सुनें।",
    zh: "音乐——搜索歌曲，通过官方 YouTube 播放器直接收听。",
    ko: "음악 — 곡을 검색하고 공식 YouTube 플레이어로 바로 들어보세요.",
    ja: "音楽 — 曲を検索して、公式YouTubeプレーヤーでそのまま再生。",
    es: "Música — busca canciones y escúchalas aquí con el reproductor oficial de YouTube.",
    fr: "Musique — cherchez des titres et écoutez-les ici via le lecteur YouTube officiel.",
    tr: "Müzik — şarkı ara ve resmi YouTube oynatıcısıyla doğrudan burada dinle.",
    ru: "Музыка — ищите песни и слушайте прямо здесь через официальный плеер YouTube.",
    pt: "Música — pesquise músicas e ouça aqui mesmo pelo leitor oficial do YouTube.",
    ar: "الموسيقى — ابحث عن الأغاني واستمع إليها هنا مباشرة عبر مشغل يوتيوب الرسمي.",
    el: "Μουσική — αναζήτησε τραγούδια και άκουσέ τα εδώ μέσω του επίσημου YouTube player.",
  },
  aboutF2: {
    de: "Sternenhimmel — 108.000 echte Sterne, Sternbilder und Planeten live für deinen Ort.",
    en: "Night sky — 108,000 real stars, constellations and planets live for your location.",
    hi: "तारों भरा आकाश — आपकी जगह के लिए 1,08,000 असली तारे, तारामंडल और ग्रह लाइव।",
    zh: "星空——为你的位置实时显示 108,000 颗真实恒星、星座和行星。",
    ko: "밤하늘 — 내 위치에서 보이는 실제 별 108,000개, 별자리와 행성을 실시간으로.",
    ja: "星空 — あなたの場所の実際の星108,000個、星座、惑星をリアルタイムで。",
    es: "Cielo nocturno — 108.000 estrellas reales, constelaciones y planetas en vivo para tu ubicación.",
    fr: "Ciel étoilé — 108 000 vraies étoiles, constellations et planètes en direct pour votre lieu.",
    tr: "Gece gökyüzü — konumun için 108.000 gerçek yıldız, takımyıldızlar ve gezegenler canlı.",
    ru: "Звёздное небо — 108 000 настоящих звёзд, созвездия и планеты в реальном времени для вашего места.",
    pt: "Céu noturno — 108.000 estrelas reais, constelações e planetas ao vivo para a sua localização.",
    ar: "سماء الليل — 108٬000 نجم حقيقي وأبراج وكواكب مباشرة لموقعك.",
    el: "Νυχτερινός ουρανός — 108.000 πραγματικά αστέρια, αστερισμοί και πλανήτες ζωντανά για την τοποθεσία σου.",
  },
  aboutF3: {
    de: "Universum — Sonnensystem in 3D mit echten Positionen, Fakten und Weltraum-News.",
    en: "Universe — a 3D solar system with real positions, facts and space news.",
    hi: "ब्रह्मांड — असली स्थितियों वाला 3D सौर मंडल, तथ्य और अंतरिक्ष समाचार।",
    zh: "宇宙——真实位置的 3D 太阳系、知识和太空新闻。",
    ko: "우주 — 실제 위치의 3D 태양계, 사실과 우주 뉴스.",
    ja: "宇宙 — 実際の位置を再現した3D太陽系、豆知識、宇宙ニュース。",
    es: "Universo — sistema solar en 3D con posiciones reales, datos y noticias del espacio.",
    fr: "Univers — système solaire en 3D aux positions réelles, faits et actualités spatiales.",
    tr: "Evren — gerçek konumlarla 3B güneş sistemi, bilgiler ve uzay haberleri.",
    ru: "Вселенная — 3D-модель Солнечной системы с реальными позициями, факты и новости космоса.",
    pt: "Universo — sistema solar em 3D com posições reais, factos e notícias do espaço.",
    ar: "الكون — نظام شمسي ثلاثي الأبعاد بمواقع حقيقية وحقائق وأخبار الفضاء.",
    el: "Σύμπαν — ηλιακό σύστημα σε 3D με πραγματικές θέσεις, γεγονότα και διαστημικά νέα.",
  },
  aboutF4: {
    de: "Geschichte — alle großen Reiche von 3400 v. Chr. bis heute auf einer Weltkarte.",
    en: "History — every major empire from 3400 BC to today on one world map.",
    hi: "इतिहास — 3400 ई.पू. से आज तक के सभी बड़े साम्राज्य एक विश्व मानचित्र पर।",
    zh: "历史——从公元前 3400 年至今的所有大帝国，尽在一张世界地图上。",
    ko: "역사 — 기원전 3400년부터 오늘날까지의 모든 주요 제국을 하나의 세계 지도에.",
    ja: "歴史 — 紀元前3400年から現代までの主要な帝国を1枚の世界地図で。",
    es: "Historia — todos los grandes imperios desde el 3400 a. C. hasta hoy en un mapa mundial.",
    fr: "Histoire — tous les grands empires de 3400 av. J.-C. à aujourd'hui sur une carte du monde.",
    tr: "Tarih — MÖ 3400'den bugüne tüm büyük imparatorluklar tek bir dünya haritasında.",
    ru: "История — все великие империи с 3400 г. до н. э. до наших дней на одной карте мира.",
    pt: "História — todos os grandes impérios de 3400 a.C. até hoje num mapa-múndi.",
    ar: "التاريخ — كل الإمبراطوريات الكبرى من 3400 ق.م حتى اليوم على خريطة عالمية واحدة.",
    el: "Ιστορία — όλες οι μεγάλες αυτοκρατορίες από το 3400 π.Χ. έως σήμερα σε έναν παγκόσμιο χάρτη.",
  },
  aboutLegal: {
    de: "Alles läuft über offizielle, öffentlich dokumentierte Schnittstellen (YouTube, NASA/JPL, Wikipedia). Nichts wird heruntergeladen oder auf dieser Seite gespeichert.",
    en: "Everything runs through official, publicly documented interfaces (YouTube, NASA/JPL, Wikipedia). Nothing is downloaded or stored on this site.",
    hi: "सब कुछ आधिकारिक, सार्वजनिक रूप से प्रलेखित इंटरफ़ेस (YouTube, NASA/JPL, विकिपीडिया) से चलता है। इस साइट पर कुछ भी डाउनलोड या संग्रहीत नहीं होता।",
    zh: "一切都通过官方、公开文档化的接口运行（YouTube、NASA/JPL、维基百科）。本站不下载也不存储任何内容。",
    ko: "모든 기능은 공식적으로 공개 문서화된 인터페이스(YouTube, NASA/JPL, 위키백과)를 통해 작동합니다. 이 사이트에서는 아무것도 다운로드하거나 저장하지 않습니다.",
    ja: "すべて公式に公開・文書化されたインターフェース（YouTube、NASA/JPL、ウィキペディア）を通じて動作します。このサイトでは何もダウンロード・保存しません。",
    es: "Todo funciona mediante interfaces oficiales y documentadas públicamente (YouTube, NASA/JPL, Wikipedia). Nada se descarga ni se guarda en este sitio.",
    fr: "Tout passe par des interfaces officielles et documentées publiquement (YouTube, NASA/JPL, Wikipédia). Rien n'est téléchargé ni stocké sur ce site.",
    tr: "Her şey resmi ve kamuya açık belgelenmiş arayüzler (YouTube, NASA/JPL, Vikipedi) üzerinden çalışır. Bu sitede hiçbir şey indirilmez veya saklanmaz.",
    ru: "Всё работает через официальные, публично документированные интерфейсы (YouTube, NASA/JPL, Википедия). На этом сайте ничего не скачивается и не хранится.",
    pt: "Tudo funciona através de interfaces oficiais e publicamente documentadas (YouTube, NASA/JPL, Wikipédia). Nada é descarregado nem guardado neste site.",
    ar: "يعمل كل شيء عبر واجهات رسمية موثقة علنًا (يوتيوب، ناسا/JPL، ويكيبيديا). لا يتم تنزيل أو تخزين أي شيء على هذا الموقع.",
    el: "Όλα λειτουργούν μέσω επίσημων, δημόσια τεκμηριωμένων διεπαφών (YouTube, NASA/JPL, Βικιπαίδεια). Τίποτα δεν κατεβαίνει ούτε αποθηκεύεται σε αυτόν τον ιστότοπο.",
  },
  appTopBtn: {
    de: "App herunterladen",
    en: "Download app",
    hi: "ऐप डाउनलोड",
    zh: "下载应用",
    ko: "앱 다운로드",
    ja: "アプリをダウンロード",
    es: "Descargar app",
    fr: "Télécharger l'appli",
    tr: "Uygulamayı indir",
    ru: "Скачать приложение",
    pt: "Baixar app",
    ar: "تنزيل التطبيق",
    el: "Λήψη εφαρμογής",
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
