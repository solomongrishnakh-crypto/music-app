import type { Lang } from "@/contexts/LanguageContext";

/**
 * Texte für die Weltraum-Rechner (Universum) und den Kosmischen Kalender
 * (Geschichte). Nutzerwunsch 15.10.2026. Alle 13 Sprachen.
 */
export type Tx = Record<Lang, string>;

export const TOOLS_HEAD: Tx = {
  de: "Weltraum-Rechner", en: "Space calculators", hi: "अंतरिक्ष कैलकुलेटर", zh: "太空计算器", ko: "우주 계산기", ja: "宇宙の計算機",
  es: "Calculadoras espaciales", fr: "Calculateurs spatiaux", tr: "Uzay hesaplayıcıları", ru: "Космические калькуляторы", pt: "Calculadoras espaciais", ar: "حاسبات الفضاء", el: "Υπολογιστές διαστήματος",
};

export const PLANET_TX = {
  title: {
    de: "Gewicht & Alter auf anderen Welten", en: "Weight & Age on Other Worlds", hi: "दूसरी दुनिया में आपका वज़न और उम्र", zh: "你在其他星球上的体重与年龄", ko: "다른 천체에서의 몸무게와 나이", ja: "他の天体での体重と年齢",
    es: "Peso y edad en otros mundos", fr: "Poids et âge sur d'autres mondes", tr: "Başka Dünyalarda Kilo ve Yaş", ru: "Вес и возраст на других мирах", pt: "Peso e idade em outros mundos", ar: "وزنك وعمرك على عوالم أخرى", el: "Βάρος και ηλικία σε άλλους κόσμους",
  } as Tx,
  weight: {
    de: "Dein Gewicht (kg)", en: "Your weight (kg)", hi: "आपका वज़न (किग्रा)", zh: "你的体重（公斤）", ko: "몸무게 (kg)", ja: "体重（kg）",
    es: "Tu peso (kg)", fr: "Ton poids (kg)", tr: "Kilonuz (kg)", ru: "Ваш вес (кг)", pt: "Seu peso (kg)", ar: "وزنك (كغ)", el: "Το βάρος σου (kg)",
  } as Tx,
  birth: {
    de: "Dein Geburtsdatum", en: "Your date of birth", hi: "आपकी जन्म तिथि", zh: "你的出生日期", ko: "생년월일", ja: "生年月日",
    es: "Tu fecha de nacimiento", fr: "Ta date de naissance", tr: "Doğum tarihiniz", ru: "Дата рождения", pt: "Sua data de nascimento", ar: "تاريخ ميلادك", el: "Η ημερομηνία γέννησής σου",
  } as Tx,
  wCol: {
    de: "Gewicht", en: "Weight", hi: "वज़न", zh: "体重", ko: "몸무게", ja: "体重",
    es: "Peso", fr: "Poids", tr: "Kilo", ru: "Вес", pt: "Peso", ar: "الوزن", el: "Βάρος",
  } as Tx,
  aCol: {
    de: "Alter", en: "Age", hi: "उम्र", zh: "年龄", ko: "나이", ja: "年齢",
    es: "Edad", fr: "Âge", tr: "Yaş", ru: "Возраст", pt: "Idade", ar: "العمر", el: "Ηλικία",
  } as Tx,
  moon: {
    de: "Mond", en: "Moon", hi: "चंद्रमा", zh: "月球", ko: "달", ja: "月",
    es: "Luna", fr: "Lune", tr: "Ay", ru: "Луна", pt: "Lua", ar: "القمر", el: "Σελήνη",
  } as Tx,
  note: {
    de: "Gewicht = was eine Waage dort anzeigen würde. Bei Gasplaneten gilt die 1-bar-Schicht am Äquator. Alter = deine gelebten Tage ÷ Dauer eines Planetenjahres. Quelle: NASA Planetary Fact Sheet.",
    en: "Weight = what a scale would show there. For gas giants, the 1-bar level at the equator. Age = days you have lived ÷ length of one planetary year. Source: NASA Planetary Fact Sheet.",
    hi: "वज़न = वहाँ तराज़ू जो दिखाएगा। गैस ग्रहों के लिए भूमध्य रेखा पर 1-बार की परत। उम्र = आपके जिए गए दिन ÷ ग्रह के एक वर्ष की लंबाई। स्रोत: NASA Planetary Fact Sheet।",
    zh: "体重 = 那里的秤会显示的数值。气态行星取赤道 1 巴气压处。年龄 = 你活过的天数 ÷ 该行星一年的长度。数据来源：NASA Planetary Fact Sheet。",
    ko: "몸무게 = 그곳에서 저울이 가리킬 값입니다. 가스 행성은 적도의 1바 기압면 기준입니다. 나이 = 살아온 날수 ÷ 그 행성의 1년 길이. 출처: NASA Planetary Fact Sheet.",
    ja: "体重＝そこで体重計が示す値です。ガス惑星は赤道の1気圧面での値。年齢＝生きてきた日数÷その惑星の1年の長さ。出典：NASA Planetary Fact Sheet。",
    es: "Peso = lo que marcaría una báscula allí. En los gigantes gaseosos, el nivel de 1 bar en el ecuador. Edad = días vividos ÷ duración de un año del planeta. Fuente: NASA Planetary Fact Sheet.",
    fr: "Poids = ce qu'afficherait une balance là-bas. Pour les géantes gazeuses : niveau de 1 bar à l'équateur. Âge = jours vécus ÷ durée d'une année de la planète. Source : NASA Planetary Fact Sheet.",
    tr: "Kilo = orada bir tartının göstereceği değer. Gaz devlerinde ekvatorda 1 bar seviyesi geçerlidir. Yaş = yaşadığın gün sayısı ÷ gezegenin bir yılının uzunluğu. Kaynak: NASA Planetary Fact Sheet.",
    ru: "Вес — это то, что показали бы там весы. Для газовых гигантов — уровень 1 бар на экваторе. Возраст = прожитые дни ÷ длительность года на планете. Источник: NASA Planetary Fact Sheet.",
    pt: "Peso = o que uma balança mostraria lá. Nos gigantes gasosos, o nível de 1 bar no equador. Idade = dias vividos ÷ duração de um ano do planeta. Fonte: NASA Planetary Fact Sheet.",
    ar: "الوزن = ما ستُظهره الميزان هناك. في الكواكب الغازية يُؤخذ مستوى ضغط 1 بار عند خط الاستواء. العمر = الأيام التي عشتها ÷ طول سنة الكوكب. المصدر: NASA Planetary Fact Sheet.",
    el: "Βάρος = ό,τι θα έδειχνε εκεί μια ζυγαριά. Στους αέριους γίγαντες ισχύει το επίπεδο 1 bar στον ισημερινό. Ηλικία = ημέρες που έζησες ÷ διάρκεια ενός έτους του πλανήτη. Πηγή: NASA Planetary Fact Sheet.",
  } as Tx,
};

export const TRAVEL_TX = {
  title: {
    de: "Reisezeit-Rechner", en: "Travel Time Calculator", hi: "यात्रा-समय कैलकुलेटर", zh: "旅行时间计算器", ko: "여행 시간 계산기", ja: "旅行時間計算機",
    es: "Calculadora de tiempo de viaje", fr: "Calculateur de temps de trajet", tr: "Yolculuk Süresi Hesaplayıcı", ru: "Калькулятор времени полёта", pt: "Calculadora de tempo de viagem", ar: "حاسبة زمن الرحلة", el: "Υπολογιστής χρόνου ταξιδιού",
  } as Tx,
  dest: {
    de: "Ziel", en: "Destination", hi: "गंतव्य", zh: "目的地", ko: "목적지", ja: "目的地",
    es: "Destino", fr: "Destination", tr: "Hedef", ru: "Пункт назначения", pt: "Destino", ar: "الوجهة", el: "Προορισμός",
  } as Tx,
  dist: {
    de: "Entfernung", en: "Distance", hi: "दूरी", zh: "距离", ko: "거리", ja: "距離",
    es: "Distancia", fr: "Distance", tr: "Mesafe", ru: "Расстояние", pt: "Distância", ar: "المسافة", el: "Απόσταση",
  } as Tx,
  milky: {
    de: "Zentrum der Milchstraße", en: "Milky Way center", hi: "आकाशगंगा का केंद्र", zh: "银河系中心", ko: "은하수 중심", ja: "天の川銀河の中心",
    es: "Centro de la Vía Láctea", fr: "Centre de la Voie lactée", tr: "Samanyolu'nun merkezi", ru: "Центр Млечного Пути", pt: "Centro da Via Láctea", ar: "مركز درب التبانة", el: "Κέντρο του Γαλαξία",
  } as Tx,
  andromeda: {
    de: "Andromeda-Galaxie", en: "Andromeda Galaxy", hi: "एंड्रोमेडा आकाशगंगा", zh: "仙女座星系", ko: "안드로메다 은하", ja: "アンドロメダ銀河",
    es: "Galaxia de Andrómeda", fr: "Galaxie d'Andromède", tr: "Andromeda Galaksisi", ru: "Галактика Андромеды", pt: "Galáxia de Andrômeda", ar: "مجرة المرأة المسلسلة", el: "Γαλαξίας της Ανδρομέδας",
  } as Tx,
  walk: {
    de: "Zu Fuß", en: "On foot", hi: "पैदल", zh: "步行", ko: "도보", ja: "徒歩",
    es: "A pie", fr: "À pied", tr: "Yürüyerek", ru: "Пешком", pt: "A pé", ar: "سيرًا على الأقدام", el: "Με τα πόδια",
  } as Tx,
  car: {
    de: "Auto", en: "Car", hi: "कार", zh: "汽车", ko: "자동차", ja: "車",
    es: "Coche", fr: "Voiture", tr: "Araba", ru: "Автомобиль", pt: "Carro", ar: "سيارة", el: "Αυτοκίνητο",
  } as Tx,
  plane: {
    de: "Flugzeug", en: "Airliner", hi: "विमान", zh: "客机", ko: "여객기", ja: "旅客機",
    es: "Avión", fr: "Avion de ligne", tr: "Uçak", ru: "Самолёт", pt: "Avião", ar: "طائرة ركاب", el: "Αεροπλάνο",
  } as Tx,
  light: {
    de: "Licht", en: "Light", hi: "प्रकाश", zh: "光", ko: "빛", ja: "光",
    es: "Luz", fr: "Lumière", tr: "Işık", ru: "Свет", pt: "Luz", ar: "الضوء", el: "Φως",
  } as Tx,
  note: {
    de: "Gerade Strecke bei konstanter Höchstgeschwindigkeit – ohne Beschleunigen, Bremsen oder Umwege. Planeten: geringster Abstand zur Erde.",
    en: "Straight line at constant top speed – no acceleration, braking or detours. Planets: closest distance to Earth.",
    hi: "सीधा रास्ता, स्थिर अधिकतम गति पर – बिना तेज़ करने, रुकने या मोड़ के। ग्रह: पृथ्वी से सबसे कम दूरी।",
    zh: "按恒定最高速度走直线——不含加速、减速或绕行。行星距离取离地球最近时。",
    ko: "일정한 최고 속도로 직선 이동 — 가속, 감속, 우회는 고려하지 않았습니다. 행성은 지구와 가장 가까울 때의 거리입니다.",
    ja: "一定の最高速度で一直線に進む想定です。加速・減速・寄り道は考慮していません。惑星は地球に最も近づいたときの距離です。",
    es: "Línea recta a velocidad máxima constante, sin aceleración, frenado ni desvíos. Planetas: distancia mínima a la Tierra.",
    fr: "Ligne droite à vitesse maximale constante, sans accélération, freinage ni détour. Planètes : distance minimale à la Terre.",
    tr: "Sabit azami hızla düz yol – hızlanma, frenleme veya dolambaç yok. Gezegenler: Dünya'ya en yakın mesafe.",
    ru: "Прямая линия на постоянной максимальной скорости — без разгона, торможения и объездов. Планеты: минимальное расстояние до Земли.",
    pt: "Linha reta em velocidade máxima constante, sem aceleração, frenagem ou desvios. Planetas: menor distância até a Terra.",
    ar: "خط مستقيم بسرعة قصوى ثابتة، دون تسارع أو فرملة أو التفاف. الكواكب: أقرب مسافة إلى الأرض.",
    el: "Ευθεία διαδρομή με σταθερή μέγιστη ταχύτητα – χωρίς επιτάχυνση, πέδηση ή παρακάμψεις. Πλανήτες: ελάχιστη απόσταση από τη Γη.",
  } as Tx,
};

export const CAL_TX = {
  title: {
    de: "Kosmischer Kalender", en: "Cosmic Calendar", hi: "ब्रह्मांडीय कैलेंडर", zh: "宇宙历", ko: "우주 달력", ja: "宇宙カレンダー",
    es: "Calendario cósmico", fr: "Calendrier cosmique", tr: "Kozmik Takvim", ru: "Космический календарь", pt: "Calendário cósmico", ar: "التقويم الكوني", el: "Κοσμικό ημερολόγιο",
  } as Tx,
  intro: {
    de: "Stell dir die gesamte Geschichte des Universums (13,8 Milliarden Jahre) als ein einziges Jahr vor: Der Urknall ist am 1. Januar um 0:00 Uhr, heute ist Silvester um Mitternacht.",
    en: "Imagine the entire history of the universe (13.8 billion years) squeezed into a single year: the Big Bang happens on 1 January at 00:00, and today is New Year's Eve at midnight.",
    hi: "ब्रह्मांड के पूरे इतिहास (13.8 अरब वर्ष) को एक ही साल में समेटकर देखें: महाविस्फोट 1 जनवरी को 00:00 बजे होता है और आज 31 दिसंबर की आधी रात है।",
    zh: "把宇宙的全部历史（138 亿年）压缩成一年：大爆炸发生在 1 月 1 日 0 点，而今天是除夕的午夜。",
    ko: "우주의 모든 역사(138억 년)를 단 1년으로 압축해 보세요. 빅뱅은 1월 1일 0시에 일어나고, 오늘은 12월 31일 자정입니다.",
    ja: "宇宙の全歴史（138億年）を1年に縮めてみましょう。ビッグバンは1月1日0時、そして今日は12月31日の真夜中です。",
    es: "Imagina toda la historia del universo (13.800 millones de años) comprimida en un solo año: el Big Bang ocurre el 1 de enero a las 00:00 y hoy es Nochevieja a medianoche.",
    fr: "Imagine toute l'histoire de l'univers (13,8 milliards d'années) comprimée en une seule année : le Big Bang a lieu le 1er janvier à 00 h 00, et nous sommes aujourd'hui le 31 décembre à minuit.",
    tr: "Evrenin tüm tarihini (13,8 milyar yıl) tek bir yıla sığdırdığını düşün: Büyük Patlama 1 Ocak'ta saat 00:00'da olur, bugün ise 31 Aralık gece yarısıdır.",
    ru: "Представьте всю историю Вселенной (13,8 млрд лет) сжатой в один год: Большой взрыв происходит 1 января в 00:00, а сегодня — полночь 31 декабря.",
    pt: "Imagine toda a história do universo (13,8 bilhões de anos) comprimida em um único ano: o Big Bang acontece em 1.º de janeiro às 00:00 e hoje é 31 de dezembro à meia-noite.",
    ar: "تخيّل تاريخ الكون كله (13.8 مليار سنة) مضغوطًا في سنة واحدة: يحدث الانفجار العظيم في 1 يناير عند الساعة 00:00، واليوم هو منتصف ليل 31 ديسمبر.",
    el: "Φαντάσου όλη την ιστορία του σύμπαντος (13,8 δισ. έτη) συμπιεσμένη σε ένα μόνο έτος: η Μεγάλη Έκρηξη γίνεται την 1η Ιανουαρίου στις 00:00 και σήμερα είναι παραμονή Πρωτοχρονιάς, μεσάνυχτα.",
  } as Tx,
  year: {
    de: "Ganzes Jahr", en: "Whole year", hi: "पूरा साल", zh: "全年", ko: "1년 전체", ja: "1年間",
    es: "Año completo", fr: "Année entière", tr: "Tüm yıl", ru: "Весь год", pt: "Ano inteiro", ar: "السنة كاملة", el: "Ολόκληρο έτος",
  } as Tx,
  day: {
    de: "Letzter Tag", en: "Last day", hi: "आख़िरी दिन", zh: "最后一天", ko: "마지막 날", ja: "最後の1日",
    es: "Último día", fr: "Dernier jour", tr: "Son gün", ru: "Последний день", pt: "Último dia", ar: "اليوم الأخير", el: "Τελευταία μέρα",
  } as Tx,
  minute: {
    de: "Letzte Minute", en: "Last minute", hi: "आख़िरी मिनट", zh: "最后一分钟", ko: "마지막 1분", ja: "最後の1分",
    es: "Último minuto", fr: "Dernière minute", tr: "Son dakika", ru: "Последняя минута", pt: "Último minuto", ar: "الدقيقة الأخيرة", el: "Τελευταίο λεπτό",
  } as Tx,
  today: {
    de: "Heute", en: "Today", hi: "आज", zh: "今天", ko: "오늘", ja: "今日",
    es: "Hoy", fr: "Aujourd'hui", tr: "Bugün", ru: "Сегодня", pt: "Hoje", ar: "اليوم", el: "Σήμερα",
  } as Tx,
  life: {
    de: "Ein Menschenleben von 80 Jahren dauert in diesem Kalender nur {s} Sekunden.",
    en: "A human life of 80 years lasts only {s} seconds in this calendar.",
    hi: "इस कैलेंडर में 80 साल का एक मानव-जीवन केवल {s} सेकंड का होता है।",
    zh: "在这个日历中，80 年的人生只有 {s} 秒。",
    ko: "이 달력에서 80년의 인생은 겨우 {s}초입니다.",
    ja: "このカレンダーでは、80年の人生はわずか{s}秒です。",
    es: "En este calendario, una vida humana de 80 años dura solo {s} segundos.",
    fr: "Dans ce calendrier, une vie humaine de 80 ans ne dure que {s} seconde.",
    tr: "Bu takvimde 80 yıllık bir insan ömrü yalnızca {s} saniye sürer.",
    ru: "В этом календаре человеческая жизнь в 80 лет длится всего {s} секунды.",
    pt: "Neste calendário, uma vida humana de 80 anos dura apenas {s} segundo.",
    ar: "في هذا التقويم، تستغرق حياة الإنسان البالغة 80 عامًا نحو {s} ثانية فقط.",
    el: "Σε αυτό το ημερολόγιο, μια ανθρώπινη ζωή 80 ετών διαρκεί μόλις {s} δευτερόλεπτα.",
  } as Tx,
  note: {
    de: "Zeitangaben sind gerundete Näherungen nach heutigem Forschungsstand.",
    en: "Dates are rounded approximations based on current research.",
    hi: "तिथियाँ वर्तमान शोध पर आधारित अनुमानित और पूर्णांकित हैं।",
    zh: "日期为根据当前研究得出的近似值。",
    ko: "날짜는 현재 연구를 바탕으로 한 대략적인 값입니다.",
    ja: "日付は現在の研究に基づく概算値です。",
    es: "Las fechas son aproximaciones redondeadas según la investigación actual.",
    fr: "Les dates sont des approximations arrondies selon l'état actuel de la recherche.",
    tr: "Tarihler, güncel araştırmalara dayanan yuvarlanmış yaklaşık değerlerdir.",
    ru: "Даты — округлённые приближения по современным данным науки.",
    pt: "As datas são aproximações arredondadas, segundo a pesquisa atual.",
    ar: "التواريخ تقريبية ومقرّبة وفق أحدث الأبحاث.",
    el: "Οι ημερομηνίες είναι στρογγυλεμένες προσεγγίσεις με βάση τη σύγχρονη έρευνα.",
  } as Tx,
};

/** Ereignisse des Kosmischen Kalenders: ago = Jahre vor heute. */
export const CAL_EVENTS: { ago: number; n: Tx }[] = [
  { ago: 13.8e9, n: { de: "Urknall", en: "Big Bang", hi: "महाविस्फोट (बिग बैंग)", zh: "宇宙大爆炸", ko: "빅뱅", ja: "ビッグバン", es: "Big Bang", fr: "Big Bang", tr: "Büyük Patlama", ru: "Большой взрыв", pt: "Big Bang", ar: "الانفجار العظيم", el: "Μεγάλη Έκρηξη" } },
  { ago: 13.6e9, n: { de: "Erste Sterne leuchten", en: "The first stars ignite", hi: "पहले तारे जगमगाते हैं", zh: "第一批恒星点亮", ko: "첫 별이 빛나기 시작함", ja: "最初の星が輝く", es: "Se encienden las primeras estrellas", fr: "Les premières étoiles s'allument", tr: "İlk yıldızlar parlar", ru: "Загораются первые звёзды", pt: "As primeiras estrelas se acendem", ar: "تتوهج أولى النجوم", el: "Ανάβουν τα πρώτα άστρα" } },
  { ago: 4.57e9, n: { de: "Sonne und Erde entstehen", en: "Sun and Earth form", hi: "सूर्य और पृथ्वी बनते हैं", zh: "太阳和地球形成", ko: "태양과 지구의 탄생", ja: "太陽と地球の誕生", es: "Se forman el Sol y la Tierra", fr: "Formation du Soleil et de la Terre", tr: "Güneş ve Dünya oluşur", ru: "Рождение Солнца и Земли", pt: "Formam-se o Sol e a Terra", ar: "تتشكّل الشمس والأرض", el: "Σχηματίζονται ο Ήλιος και η Γη" } },
  { ago: 3.8e9, n: { de: "Erste Spuren von Leben", en: "First traces of life", hi: "जीवन के पहले निशान", zh: "最早的生命痕迹", ko: "생명의 첫 흔적", ja: "生命の最初の痕跡", es: "Primeras huellas de vida", fr: "Premières traces de vie", tr: "Yaşamın ilk izleri", ru: "Первые следы жизни", pt: "Primeiros vestígios de vida", ar: "أولى آثار الحياة", el: "Τα πρώτα ίχνη ζωής" } },
  { ago: 2.4e9, n: { de: "Sauerstoff reichert sich in der Luft an", en: "Oxygen builds up in the air", hi: "हवा में ऑक्सीजन बढ़ती है", zh: "大气中氧气积累", ko: "대기에 산소가 쌓임", ja: "大気に酸素がたまる", es: "El oxígeno se acumula en el aire", fr: "L'oxygène s'accumule dans l'air", tr: "Havada oksijen birikir", ru: "В атмосфере накапливается кислород", pt: "O oxigênio se acumula no ar", ar: "يتراكم الأكسجين في الهواء", el: "Συσσωρεύεται οξυγόνο στην ατμόσφαιρα" } },
  { ago: 1.8e9, n: { de: "Zellen mit Zellkern", en: "Cells with a nucleus", hi: "केंद्रक वाली कोशिकाएँ", zh: "出现有细胞核的细胞", ko: "세포핵을 가진 세포 등장", ja: "核をもつ細胞の出現", es: "Células con núcleo", fr: "Cellules à noyau", tr: "Çekirdekli hücreler", ru: "Клетки с ядром", pt: "Células com núcleo", ar: "خلايا ذات نواة", el: "Κύτταρα με πυρήνα" } },
  { ago: 6e8, n: { de: "Erste vielzellige Tiere", en: "First multicellular animals", hi: "पहले बहुकोशिकीय जानवर", zh: "最早的多细胞动物", ko: "최초의 다세포 동물", ja: "最初の多細胞動物", es: "Primeros animales pluricelulares", fr: "Premiers animaux pluricellulaires", tr: "İlk çok hücreli hayvanlar", ru: "Первые многоклеточные животные", pt: "Primeiros animais multicelulares", ar: "أولى الحيوانات متعددة الخلايا", el: "Τα πρώτα πολυκύτταρα ζώα" } },
  { ago: 5.39e8, n: { de: "Kambrische Explosion", en: "Cambrian explosion", hi: "कैम्ब्रियन विस्फोट", zh: "寒武纪生命大爆发", ko: "캄브리아기 대폭발", ja: "カンブリア爆発", es: "Explosión cámbrica", fr: "Explosion cambrienne", tr: "Kambriyen patlaması", ru: "Кембрийский взрыв", pt: "Explosão Cambriana", ar: "الانفجار الكمبري", el: "Καμβριανή έκρηξη" } },
  { ago: 2.3e8, n: { de: "Dinosaurier erscheinen", en: "Dinosaurs appear", hi: "डायनासोर प्रकट होते हैं", zh: "恐龙出现", ko: "공룡의 등장", ja: "恐竜の登場", es: "Aparecen los dinosaurios", fr: "Apparition des dinosaures", tr: "Dinozorlar ortaya çıkar", ru: "Появляются динозавры", pt: "Surgem os dinossauros", ar: "ظهور الديناصورات", el: "Εμφανίζονται οι δεινόσαυροι" } },
  { ago: 6.6e7, n: { de: "Dinosaurier sterben aus", en: "Dinosaurs go extinct", hi: "डायनासोर विलुप्त होते हैं", zh: "恐龙灭绝", ko: "공룡 멸종", ja: "恐竜の絶滅", es: "Se extinguen los dinosaurios", fr: "Extinction des dinosaures", tr: "Dinozorlar yok olur", ru: "Вымирание динозавров", pt: "Extinção dos dinossauros", ar: "انقراض الديناصورات", el: "Εξαφανίζονται οι δεινόσαυροι" } },
  { ago: 2.8e6, n: { de: "Erste Menschen der Gattung Homo", en: "First humans of the genus Homo", hi: "होमो वंश के पहले मनुष्य", zh: "最早的人属（Homo）成员", ko: "호모속 최초의 인류", ja: "ヒト属（ホモ）の最初の人類", es: "Primeros humanos del género Homo", fr: "Premiers humains du genre Homo", tr: "Homo cinsinin ilk insanları", ru: "Первые люди рода Homo", pt: "Primeiros humanos do gênero Homo", ar: "أوائل البشر من جنس هومو", el: "Οι πρώτοι άνθρωποι του γένους Homo" } },
  { ago: 3e5, n: { de: "Der moderne Mensch (Homo sapiens)", en: "Modern humans (Homo sapiens)", hi: "आधुनिक मानव (होमो सेपियन्स)", zh: "现代人（智人）", ko: "현생인류 (호모 사피엔스)", ja: "現生人類（ホモ・サピエンス）", es: "El ser humano moderno (Homo sapiens)", fr: "L'être humain moderne (Homo sapiens)", tr: "Modern insan (Homo sapiens)", ru: "Современный человек (Homo sapiens)", pt: "O ser humano moderno (Homo sapiens)", ar: "الإنسان الحديث (هومو سابينس)", el: "Ο σύγχρονος άνθρωπος (Homo sapiens)" } },
  { ago: 1.2e4, n: { de: "Landwirtschaft beginnt", en: "Farming begins", hi: "खेती की शुरुआत", zh: "农业开始", ko: "농업의 시작", ja: "農業の始まり", es: "Comienza la agricultura", fr: "Début de l'agriculture", tr: "Tarım başlar", ru: "Начало земледелия", pt: "Começa a agricultura", ar: "بداية الزراعة", el: "Αρχίζει η γεωργία" } },
  { ago: 5200, n: { de: "Erste Schrift", en: "First writing", hi: "पहली लिखावट", zh: "最早的文字", ko: "최초의 문자", ja: "最初の文字", es: "Primera escritura", fr: "Première écriture", tr: "İlk yazı", ru: "Первая письменность", pt: "Primeira escrita", ar: "أولى الكتابات", el: "Η πρώτη γραφή" } },
  { ago: 4600, n: { de: "Pyramiden von Gizeh", en: "Pyramids of Giza", hi: "गीज़ा के पिरामिड", zh: "吉萨金字塔", ko: "기자의 피라미드", ja: "ギザのピラミッド", es: "Pirámides de Guiza", fr: "Pyramides de Gizeh", tr: "Giza Piramitleri", ru: "Пирамиды Гизы", pt: "Pirâmides de Gizé", ar: "أهرامات الجيزة", el: "Οι πυραμίδες της Γκίζας" } },
  { ago: 2000, n: { de: "Beginn unserer Zeitrechnung", en: "Start of the common era", hi: "सामान्य युग की शुरुआत", zh: "公元纪年开始", ko: "서기 시작", ja: "西暦の始まり", es: "Inicio de la era común", fr: "Début de l'ère commune", tr: "Ortak çağın başlangıcı", ru: "Начало нашей эры", pt: "Início da era comum", ar: "بداية التقويم الميلادي", el: "Αρχή της κοινής χρονολόγησης" } },
  { ago: 575, n: { de: "Gutenbergs Buchdruck", en: "Gutenberg's printing press", hi: "गुटेनबर्ग का छापाखाना", zh: "古腾堡印刷术", ko: "구텐베르크의 인쇄술", ja: "グーテンベルクの印刷術", es: "La imprenta de Gutenberg", fr: "L'imprimerie de Gutenberg", tr: "Gutenberg'in matbaası", ru: "Печатный станок Гутенберга", pt: "A prensa de Gutenberg", ar: "مطبعة غوتنبرغ", el: "Το τυπογραφείο του Γουτεμβέργιου" } },
  { ago: 57, n: { de: "Erste Mondlandung", en: "First Moon landing", hi: "पहली चंद्र लैंडिंग", zh: "首次登月", ko: "첫 달 착륙", ja: "初の月面着陸", es: "Primer alunizaje", fr: "Premier alunissage", tr: "İlk Ay'a iniş", ru: "Первая высадка на Луну", pt: "Primeira alunissagem", ar: "أول هبوط على القمر", el: "Η πρώτη προσελήνωση" } },
];

/** Live-Reise im Reisezeit-Rechner (Nutzerwunsch 15.10.2026). */
export const JOURNEY_TX = {
  start: {
    de: "Reise starten", en: "Start journey", hi: "यात्रा शुरू करें", zh: "开始旅行", ko: "여행 시작", ja: "旅を始める",
    es: "Iniciar viaje", fr: "Démarrer le voyage", tr: "Yolculuğu başlat", ru: "Начать полёт", pt: "Iniciar viagem", ar: "ابدأ الرحلة", el: "Έναρξη ταξιδιού",
  } as Tx,
  stop: {
    de: "Stopp", en: "Stop", hi: "रोकें", zh: "停止", ko: "정지", ja: "停止",
    es: "Detener", fr: "Arrêter", tr: "Durdur", ru: "Стоп", pt: "Parar", ar: "إيقاف", el: "Διακοπή",
  } as Tx,
  reset: {
    de: "Zurücksetzen", en: "Reset", hi: "रीसेट", zh: "重置", ko: "초기화", ja: "リセット",
    es: "Reiniciar", fr: "Réinitialiser", tr: "Sıfırla", ru: "Сбросить", pt: "Reiniciar", ar: "إعادة ضبط", el: "Επαναφορά",
  } as Tx,
  custom: {
    de: "Eigene Geschwindigkeit", en: "Custom speed", hi: "अपनी गति", zh: "自定义速度", ko: "직접 입력한 속도", ja: "好きな速度",
    es: "Velocidad propia", fr: "Vitesse personnalisée", tr: "Özel hız", ru: "Своя скорость", pt: "Velocidade própria", ar: "سرعة مخصصة", el: "Δική σου ταχύτητα",
  } as Tx,
  traveled: {
    de: "Zurückgelegt", en: "Travelled", hi: "तय की गई दूरी", zh: "已行进", ko: "이동 거리", ja: "進んだ距離",
    es: "Recorrido", fr: "Parcouru", tr: "Alınan yol", ru: "Пройдено", pt: "Percorrido", ar: "المسافة المقطوعة", el: "Διανύθηκαν",
  } as Tx,
  remaining: {
    de: "Verbleibend", en: "Remaining", hi: "शेष दूरी", zh: "剩余", ko: "남은 거리", ja: "残り",
    es: "Restante", fr: "Restant", tr: "Kalan", ru: "Осталось", pt: "Restante", ar: "المتبقي", el: "Απομένουν",
  } as Tx,
  elapsed: {
    de: "Reisezeit", en: "Travel time", hi: "यात्रा का समय", zh: "旅行时间", ko: "경과 시간", ja: "経過時間",
    es: "Tiempo de viaje", fr: "Durée du trajet", tr: "Yolculuk süresi", ru: "Время в пути", pt: "Tempo de viagem", ar: "زمن الرحلة", el: "Χρόνος ταξιδιού",
  } as Tx,
  lapse: {
    de: "Zeitraffer", en: "Time-lapse", hi: "टाइम-लैप्स", zh: "快进", ko: "배속", ja: "早送り",
    es: "Aceleración", fr: "Accéléré", tr: "Hızlandırma", ru: "Ускорение", pt: "Aceleração", ar: "تسريع الوقت", el: "Επιτάχυνση",
  } as Tx,
  arrived: {
    de: "Angekommen!", en: "Arrived!", hi: "पहुँच गए!", zh: "已抵达！", ko: "도착!", ja: "到着！",
    es: "¡Llegaste!", fr: "Arrivé !", tr: "Vardınız!", ru: "Прибыли!", pt: "Chegou!", ar: "وصلت!", el: "Φτάσατε!",
  } as Tx,
  speed: {
    de: "Geschwindigkeit", en: "Speed", hi: "गति", zh: "速度", ko: "속도", ja: "速度",
    es: "Velocidad", fr: "Vitesse", tr: "Hız", ru: "Скорость", pt: "Velocidade", ar: "السرعة", el: "Ταχύτητα",
  } as Tx,
};
