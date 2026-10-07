import type { Lang } from "@/contexts/LanguageContext";

/**
 * Texte der Sternbild-Seiten (/sternbilder/orion …) in 13 Sprachen —
 * Nutzerwunsch 07.10.2026: auch der Sternenhimmel soll international bei
 * Google gefunden werden.
 */
export interface ConstTexts {
  crumbHome: string;
  crumbSky: string;
  title: string; // {name}
  desc: string; // {name} {month} {star}
  kind: string;
  latin: string;
  abbr: string;
  best: string;
  bestVal: string; // {month}
  visible: string;
  brightest: string;
  nakedEye: string;
  intro: string; // {name} {la} {month} {north} {south}
  introStar: string; // {star} {mag} {ly}
  starsH2: string;
  colStar: string;
  colDes: string;
  colMag: string;
  colDist: string;
  ly: string;
  openSky: string;
  figCaption: string; // {name}
  others: string;
  indexTitle: string;
  indexDesc: string;
  indexIntro: string;
  credit: string;
  fullyAll: string; // überall sichtbar
}

const T: Record<Lang, ConstTexts> = {
  de: {
    crumbHome: "Centaurian", crumbSky: "Sternbilder", title: "Sternbild {name} — Sterne, Sternkarte & wann man es sieht",
    desc: "Sternbild {name}: am besten zu sehen im {month} am Abendhimmel, hellster Stern {star}. Mit Sternkarte, Sternen und Live-Ansicht für deinen Ort.",
    kind: "Sternbild", latin: "Lateinischer Name", abbr: "Abkürzung", best: "Beste Sichtbarkeit", bestVal: "abends im {month}",
    visible: "Ganz sichtbar zwischen", brightest: "Hellster Stern", nakedEye: "Sterne mit bloßem Auge",
    intro: "{name} ({la}) steht am Abendhimmel (gegen 21 Uhr) im {month} am höchsten. Das ganze Sternbild geht zwischen {north} und {south} über den Horizont.",
    introStar: "Der hellste Stern ist {star} mit {mag} mag — rund {ly} Lichtjahre entfernt.",
    starsH2: "Die hellsten Sterne", colStar: "Stern", colDes: "Bezeichnung", colMag: "Helligkeit (mag)", colDist: "Entfernung", ly: "Lj.",
    openSky: "Live am Himmel ansehen", figCaption: "Sternkarte {name} mit Sternbildlinien und Grenzen", others: "Weitere Sternbilder",
    indexTitle: "Alle 88 Sternbilder — Sternkarten, Sterne & Sichtbarkeit", indexDesc: "Alle 88 Sternbilder mit Sternkarte, hellsten Sternen und wann sie am besten zu sehen sind — plus Live-Sternenhimmel für deinen Ort.",
    indexIntro: "Alle 88 offiziellen Sternbilder mit Sternkarte, hellsten Sternen und bester Beobachtungszeit.", credit: "Sterndaten: HYG-Datenbank. Sternbildgrenzen: IAU.", fullyAll: "überall auf der Erde",
  },
  en: {
    crumbHome: "Centaurian", crumbSky: "Constellations", title: "{name} Constellation — Stars, Star Map & When to See It",
    desc: "The constellation {name}: best seen in the evening sky in {month}, brightest star {star}. With a star map, its stars and a live sky view for your location.",
    kind: "Constellation", latin: "Latin name", abbr: "Abbreviation", best: "Best visibility", bestVal: "evenings in {month}",
    visible: "Fully visible between", brightest: "Brightest star", nakedEye: "Naked-eye stars",
    intro: "{name} ({la}) is highest in the evening sky (around 9 pm) in {month}. The whole constellation rises above the horizon between {north} and {south}.",
    introStar: "Its brightest star is {star} at magnitude {mag} — about {ly} light-years away.",
    starsH2: "The brightest stars", colStar: "Star", colDes: "Designation", colMag: "Magnitude", colDist: "Distance", ly: "ly",
    openSky: "See it live in the sky", figCaption: "Star map of {name} with constellation lines and borders", others: "More constellations",
    indexTitle: "All 88 Constellations — Star Maps, Stars & Visibility", indexDesc: "All 88 constellations with a star map, their brightest stars and when to see them — plus a live night sky for your location.",
    indexIntro: "All 88 official constellations with star maps, brightest stars and the best time to observe them.", credit: "Star data: HYG database. Constellation borders: IAU.", fullyAll: "everywhere on Earth",
  },
  es: {
    crumbHome: "Centaurian", crumbSky: "Constelaciones", title: "Constelación {name}: estrellas, mapa y cuándo verla",
    desc: "La constelación {name}: se ve mejor al anochecer en {month}, estrella más brillante {star}. Con mapa estelar, sus estrellas y vista del cielo en vivo para tu ubicación.",
    kind: "Constelación", latin: "Nombre latino", abbr: "Abreviatura", best: "Mejor visibilidad", bestVal: "al anochecer en {month}",
    visible: "Visible por completo entre", brightest: "Estrella más brillante", nakedEye: "Estrellas a simple vista",
    intro: "{name} ({la}) está más alta en el cielo de la noche (hacia las 21 h) en {month}. Toda la constelación sale sobre el horizonte entre {north} y {south}.",
    introStar: "Su estrella más brillante es {star}, de magnitud {mag}, a unos {ly} años luz.",
    starsH2: "Las estrellas más brillantes", colStar: "Estrella", colDes: "Designación", colMag: "Magnitud", colDist: "Distancia", ly: "a. l.",
    openSky: "Verla en vivo en el cielo", figCaption: "Mapa estelar de {name} con líneas y límites de la constelación", others: "Más constelaciones",
    indexTitle: "Las 88 constelaciones: mapas, estrellas y visibilidad", indexDesc: "Las 88 constelaciones con mapa estelar, sus estrellas más brillantes y cuándo verlas, además del cielo nocturno en vivo para tu ubicación.",
    indexIntro: "Las 88 constelaciones oficiales con mapa estelar, estrellas más brillantes y el mejor momento para observarlas.", credit: "Datos estelares: base de datos HYG. Límites: UAI.", fullyAll: "en toda la Tierra",
  },
  fr: {
    crumbHome: "Centaurian", crumbSky: "Constellations", title: "Constellation {name} : étoiles, carte du ciel et quand l'observer",
    desc: "La constellation {name} : mieux visible le soir en {month}, étoile la plus brillante {star}. Avec carte du ciel, ses étoiles et vue en direct pour ta position.",
    kind: "Constellation", latin: "Nom latin", abbr: "Abréviation", best: "Meilleure visibilité", bestVal: "le soir en {month}",
    visible: "Entièrement visible entre", brightest: "Étoile la plus brillante", nakedEye: "Étoiles à l'œil nu",
    intro: "{name} ({la}) est au plus haut dans le ciel du soir (vers 21 h) en {month}. Toute la constellation se lève au-dessus de l'horizon entre {north} et {south}.",
    introStar: "Son étoile la plus brillante est {star}, de magnitude {mag}, à environ {ly} années-lumière.",
    starsH2: "Les étoiles les plus brillantes", colStar: "Étoile", colDes: "Désignation", colMag: "Magnitude", colDist: "Distance", ly: "a.l.",
    openSky: "La voir en direct dans le ciel", figCaption: "Carte du ciel de {name} avec lignes et limites de la constellation", others: "Autres constellations",
    indexTitle: "Les 88 constellations : cartes, étoiles et visibilité", indexDesc: "Les 88 constellations avec carte du ciel, étoiles les plus brillantes et période d'observation — plus le ciel en direct pour ta position.",
    indexIntro: "Les 88 constellations officielles avec carte du ciel, étoiles les plus brillantes et meilleure période d'observation.", credit: "Données stellaires : base HYG. Limites : UAI.", fullyAll: "partout sur Terre",
  },
  pt: {
    crumbHome: "Centaurian", crumbSky: "Constelações", title: "Constelação {name}: estrelas, mapa e quando ver",
    desc: "A constelação {name}: melhor vista no céu da noite em {month}, estrela mais brilhante {star}. Com mapa estelar, suas estrelas e visão do céu ao vivo para sua localização.",
    kind: "Constelação", latin: "Nome latino", abbr: "Abreviação", best: "Melhor visibilidade", bestVal: "à noite em {month}",
    visible: "Totalmente visível entre", brightest: "Estrela mais brilhante", nakedEye: "Estrelas a olho nu",
    intro: "{name} ({la}) fica mais alta no céu da noite (por volta das 21 h) em {month}. Toda a constelação nasce acima do horizonte entre {north} e {south}.",
    introStar: "Sua estrela mais brilhante é {star}, de magnitude {mag}, a cerca de {ly} anos-luz.",
    starsH2: "As estrelas mais brilhantes", colStar: "Estrela", colDes: "Designação", colMag: "Magnitude", colDist: "Distância", ly: "a.l.",
    openSky: "Ver ao vivo no céu", figCaption: "Mapa estelar de {name} com linhas e limites da constelação", others: "Mais constelações",
    indexTitle: "As 88 constelações: mapas, estrelas e visibilidade", indexDesc: "As 88 constelações com mapa estelar, estrelas mais brilhantes e quando vê-las — e o céu noturno ao vivo para sua localização.",
    indexIntro: "As 88 constelações oficiais com mapa estelar, estrelas mais brilhantes e a melhor época para observar.", credit: "Dados estelares: base HYG. Limites: UAI.", fullyAll: "em toda a Terra",
  },
  tr: {
    crumbHome: "Centaurian", crumbSky: "Takımyıldızlar", title: "{name} takımyıldızı: yıldızlar, gök haritası ve ne zaman görülür",
    desc: "{name} takımyıldızı: en iyi {month} akşamlarında görülür, en parlak yıldızı {star}. Gök haritası, yıldızları ve konumun için canlı gökyüzü ile.",
    kind: "Takımyıldız", latin: "Latince adı", abbr: "Kısaltma", best: "En iyi görünürlük", bestVal: "{month} akşamları",
    visible: "Tamamen görülebildiği enlemler", brightest: "En parlak yıldız", nakedEye: "Çıplak gözle görülen yıldızlar",
    intro: "{name} ({la}) akşam gökyüzünde (saat 21 civarı) en yükseğe {month} ayında çıkar. Takımyıldızın tamamı {north} ile {south} arasında ufkun üzerine yükselir.",
    introStar: "En parlak yıldızı {star}: parlaklığı {mag} kadir, uzaklığı yaklaşık {ly} ışık yılı.",
    starsH2: "En parlak yıldızlar", colStar: "Yıldız", colDes: "Gösterim", colMag: "Parlaklık (kadir)", colDist: "Uzaklık", ly: "ışık yılı",
    openSky: "Gökyüzünde canlı gör", figCaption: "{name} gök haritası, takımyıldız çizgileri ve sınırlarıyla", others: "Diğer takımyıldızlar",
    indexTitle: "88 takımyıldızın tamamı: haritalar, yıldızlar ve görünürlük", indexDesc: "Gök haritası, en parlak yıldızları ve ne zaman görülecekleriyle 88 takımyıldız — ayrıca konumun için canlı gece gökyüzü.",
    indexIntro: "Gök haritası, en parlak yıldızlar ve en iyi gözlem zamanıyla 88 resmi takımyıldız.", credit: "Yıldız verileri: HYG veritabanı. Sınırlar: IAU.", fullyAll: "Dünya'nın her yerinde",
  },
  ru: {
    crumbHome: "Centaurian", crumbSky: "Созвездия", title: "Созвездие {name}: звёзды, карта и когда его видно",
    desc: "Созвездие {name}: лучше всего видно вечером в {month}, ярчайшая звезда — {star}. С картой звёздного неба, звёздами и живым небом для твоего места.",
    kind: "Созвездие", latin: "Латинское название", abbr: "Сокращение", best: "Лучшая видимость", bestVal: "вечером, {month}",
    visible: "Полностью видно между", brightest: "Ярчайшая звезда", nakedEye: "Звёзд, видимых глазом",
    intro: "{name} ({la}) выше всего на вечернем небе (около 21 часа) в месяце: {month}. Созвездие целиком восходит над горизонтом между {north} и {south}.",
    introStar: "Ярчайшая звезда — {star}, блеск {mag}m, расстояние около {ly} световых лет.",
    starsH2: "Самые яркие звёзды", colStar: "Звезда", colDes: "Обозначение", colMag: "Блеск (m)", colDist: "Расстояние", ly: "св. лет",
    openSky: "Смотреть вживую на небе", figCaption: "Карта созвездия {name} с линиями и границами", others: "Другие созвездия",
    indexTitle: "Все 88 созвездий — карты, звёзды и видимость", indexDesc: "Все 88 созвездий с картой, ярчайшими звёздами и временем наблюдения — и звёздное небо онлайн для твоего места.",
    indexIntro: "Все 88 официальных созвездий с картой, ярчайшими звёздами и лучшим временем для наблюдения.", credit: "Данные о звёздах: база HYG. Границы: МАС.", fullyAll: "по всей Земле",
  },
  el: {
    crumbHome: "Centaurian", crumbSky: "Αστερισμοί", title: "Αστερισμός {name}: αστέρια, χάρτης και πότε φαίνεται",
    desc: "Ο αστερισμός {name}: φαίνεται καλύτερα το βράδυ τον {month}, λαμπρότερο αστέρι {star}. Με χάρτη, τα αστέρια του και ζωντανό ουρανό για την τοποθεσία σου.",
    kind: "Αστερισμός", latin: "Λατινική ονομασία", abbr: "Συντομογραφία", best: "Καλύτερη ορατότητα", bestVal: "βράδια, {month}",
    visible: "Πλήρως ορατός μεταξύ", brightest: "Λαμπρότερο αστέρι", nakedEye: "Αστέρια με γυμνό μάτι",
    intro: "{name} ({la}): βρίσκεται ψηλότερα στον βραδινό ουρανό (γύρω στις 9 μ.μ.) τον μήνα {month}. Ολόκληρος ο αστερισμός ανατέλλει πάνω από τον ορίζοντα μεταξύ {north} και {south}.",
    introStar: "Το λαμπρότερο αστέρι του είναι ο {star}, μεγέθους {mag}, σε απόσταση περίπου {ly} ετών φωτός.",
    starsH2: "Τα λαμπρότερα αστέρια", colStar: "Αστέρι", colDes: "Ονομασία", colMag: "Μέγεθος", colDist: "Απόσταση", ly: "έ.φ.",
    openSky: "Δες τον ζωντανά στον ουρανό", figCaption: "Χάρτης του αστερισμού {name} με γραμμές και όρια", others: "Άλλοι αστερισμοί",
    indexTitle: "Και οι 88 αστερισμοί — χάρτες, αστέρια και ορατότητα", indexDesc: "Και οι 88 αστερισμοί με χάρτη, λαμπρότερα αστέρια και πότε φαίνονται — και ζωντανός ουρανός για την τοποθεσία σου.",
    indexIntro: "Και οι 88 επίσημοι αστερισμοί με χάρτη, λαμπρότερα αστέρια και την καλύτερη εποχή παρατήρησης.", credit: "Δεδομένα αστεριών: βάση HYG. Όρια: IAU.", fullyAll: "παντού στη Γη",
  },
  ar: {
    crumbHome: "Centaurian", crumbSky: "الكوكبات", title: "كوكبة {name} — النجوم والخريطة ومتى تُرى",
    desc: "كوكبة {name}: أفضل رؤية لها مساءً في {month}، وألمع نجومها {star}. مع خريطة النجوم ونجومها وعرض مباشر للسماء من موقعك.",
    kind: "كوكبة", latin: "الاسم اللاتيني", abbr: "الاختصار", best: "أفضل رؤية", bestVal: "مساءً في {month}",
    visible: "مرئية بالكامل بين", brightest: "ألمع نجم", nakedEye: "نجوم تُرى بالعين المجردة",
    intro: "كوكبة {name} ({la}) تكون في أعلى السماء مساءً (نحو الساعة 9 ليلاً) في {month}. تشرق الكوكبة كاملةً فوق الأفق بين {north} و{south}.",
    introStar: "ألمع نجومها {star} بقدر {mag}، على بُعد نحو {ly} سنة ضوئية.",
    starsH2: "ألمع النجوم", colStar: "النجم", colDes: "التسمية", colMag: "القدر", colDist: "المسافة", ly: "س.ض",
    openSky: "شاهدها مباشرة في السماء", figCaption: "خريطة كوكبة {name} مع خطوطها وحدودها", others: "كوكبات أخرى",
    indexTitle: "الكوكبات الـ88 — خرائط ونجوم ووقت الرؤية", indexDesc: "كل الكوكبات الـ88 مع خريطة النجوم وألمع نجومها ومتى تُرى — وسماء الليل مباشرة لموقعك.",
    indexIntro: "كل الكوكبات الرسمية الـ88 مع خريطة النجوم وألمع النجوم وأفضل وقت للرصد.", credit: "بيانات النجوم: قاعدة HYG. الحدود: الاتحاد الفلكي الدولي.", fullyAll: "في كل مكان على الأرض",
  },
  hi: {
    crumbHome: "Centaurian", crumbSky: "तारामंडल", title: "{name} तारामंडल — तारे, नक्शा और कब दिखता है",
    desc: "{name} तारामंडल: {month} में शाम को सबसे अच्छा दिखता है, सबसे चमकीला तारा {star}। तारा नक्शा, इसके तारे और आपकी जगह के लिए लाइव आसमान के साथ।",
    kind: "तारामंडल", latin: "लैटिन नाम", abbr: "संक्षिप्त नाम", best: "सबसे अच्छी दृश्यता", bestVal: "{month} में शाम को",
    visible: "पूरा दिखता है", brightest: "सबसे चमकीला तारा", nakedEye: "नंगी आँखों से दिखने वाले तारे",
    intro: "{name} ({la}) {month} में शाम (लगभग रात 9 बजे) के आसमान में सबसे ऊँचा होता है। पूरा तारामंडल {north} और {south} के बीच क्षितिज के ऊपर आता है।",
    introStar: "इसका सबसे चमकीला तारा {star} है — कांतिमान {mag}, लगभग {ly} प्रकाश-वर्ष दूर।",
    starsH2: "सबसे चमकीले तारे", colStar: "तारा", colDes: "पदनाम", colMag: "कांतिमान", colDist: "दूरी", ly: "प्र.व.",
    openSky: "आसमान में लाइव देखें", figCaption: "{name} का तारा नक्शा, रेखाओं और सीमाओं के साथ", others: "अन्य तारामंडल",
    indexTitle: "सभी 88 तारामंडल — नक्शे, तारे और दृश्यता", indexDesc: "सभी 88 तारामंडल तारा नक्शे, सबसे चमकीले तारों और कब दिखते हैं के साथ — और आपकी जगह के लिए लाइव रात का आसमान।",
    indexIntro: "सभी 88 आधिकारिक तारामंडल — तारा नक्शे, सबसे चमकीले तारे और देखने का सबसे अच्छा समय।", credit: "तारा डेटा: HYG डेटाबेस। सीमाएँ: IAU।", fullyAll: "पृथ्वी पर हर जगह",
  },
  zh: {
    crumbHome: "Centaurian", crumbSky: "星座", title: "{name}——恒星、星图与观测时间",
    desc: "{name}：{month}的傍晚最适合观测，最亮的星是{star}。附星图、主要恒星以及你所在位置的实时星空。",
    kind: "星座", latin: "拉丁名", abbr: "缩写", best: "最佳观测", bestVal: "{month}傍晚",
    visible: "整个星座可见的纬度", brightest: "最亮的星", nakedEye: "肉眼可见的恒星",
    intro: "{name}（{la}）在{month}的傍晚（约晚上9点）升到最高。整个星座在{north}至{south}之间都能升到地平线以上。",
    introStar: "最亮的星是{star}，星等{mag}，距离约{ly}光年。",
    starsH2: "最亮的恒星", colStar: "恒星", colDes: "名称", colMag: "星等", colDist: "距离", ly: "光年",
    openSky: "在实时星空中查看", figCaption: "{name}星图（含连线与边界）", others: "更多星座",
    indexTitle: "全部88个星座——星图、恒星与观测时间", indexDesc: "全部88个星座的星图、最亮的恒星和最佳观测时间——以及你所在位置的实时星空。",
    indexIntro: "全部88个官方星座，附星图、最亮恒星和最佳观测时间。", credit: "恒星数据：HYG数据库。星座边界：国际天文学联合会。", fullyAll: "地球上任何地方",
  },
  ja: {
    crumbHome: "Centaurian", crumbSky: "星座", title: "{name}——星・星図・見頃",
    desc: "{name}：{month}の夕方が見頃、最も明るい星は{star}。星図、主な星、そしてあなたの場所のリアルタイム星空付き。",
    kind: "星座", latin: "ラテン語名", abbr: "略符", best: "見頃", bestVal: "{month}の夕方",
    visible: "全体が見える緯度", brightest: "最も明るい星", nakedEye: "肉眼で見える星",
    intro: "{name}（{la}）は{month}の夕方（午後9時頃）に最も高くなります。星座全体が地平線上に昇るのは{north}から{south}の間です。",
    introStar: "最も明るい星は{star}で、等級{mag}、距離は約{ly}光年です。",
    starsH2: "明るい星", colStar: "星", colDes: "符号", colMag: "等級", colDist: "距離", ly: "光年",
    openSky: "リアルタイムの空で見る", figCaption: "{name}の星図（星座線と境界）", others: "ほかの星座",
    indexTitle: "全88星座——星図・星・見頃", indexDesc: "全88星座の星図、明るい星、見頃——そしてあなたの場所のリアルタイム星空。",
    indexIntro: "全88の公式星座を、星図・明るい星・見頃とともに。", credit: "恒星データ：HYGデータベース。境界：IAU。", fullyAll: "地球上のどこでも",
  },
  ko: {
    crumbHome: "Centaurian", crumbSky: "별자리", title: "{name} — 별, 성도, 관측 시기",
    desc: "{name}: {month} 저녁에 가장 잘 보이며, 가장 밝은 별은 {star}. 성도, 주요 별, 내 위치의 실시간 밤하늘 포함.",
    kind: "별자리", latin: "라틴어 이름", abbr: "약자", best: "관측 적기", bestVal: "{month} 저녁",
    visible: "전체가 보이는 위도", brightest: "가장 밝은 별", nakedEye: "맨눈으로 보이는 별",
    intro: "{name}({la})는 {month} 저녁(오후 9시경)에 가장 높이 뜹니다. 별자리 전체가 지평선 위로 떠오르는 곳은 {north}에서 {south} 사이입니다.",
    introStar: "가장 밝은 별은 {star}로, 등급 {mag}, 약 {ly}광년 떨어져 있습니다.",
    starsH2: "가장 밝은 별", colStar: "별", colDes: "기호", colMag: "등급", colDist: "거리", ly: "광년",
    openSky: "실시간 하늘에서 보기", figCaption: "{name} 성도 (별자리 선과 경계)", others: "다른 별자리",
    indexTitle: "88개 별자리 전체 — 성도, 별, 관측 시기", indexDesc: "88개 별자리 전체의 성도, 가장 밝은 별, 관측 적기 — 그리고 내 위치의 실시간 밤하늘.",
    indexIntro: "88개 공식 별자리 — 성도, 가장 밝은 별, 관측 적기와 함께.", credit: "별 데이터: HYG 데이터베이스. 경계: IAU.", fullyAll: "지구 어디에서나",
  },
};

export function constTexts(lang: Lang): ConstTexts {
  return T[lang];
}

/** Breitengrad lesbar: 79° N / 67° S in der jeweiligen Sprache */
export function formatLat(lat: number, lang: Lang): string {
  const a = Math.round(Math.abs(lat));
  if (a === 0) return "0°";
  const n = lat > 0;
  switch (lang) {
    case "tr": return `${a}° ${n ? "K" : "G"}`;
    case "ru": return `${a}° ${n ? "с. ш." : "ю. ш."}`;
    case "el": return `${a}° ${n ? "Β" : "Ν"}`;
    case "ar": return `${a}° ${n ? "شمالاً" : "جنوباً"}`;
    case "hi": return `${a}° ${n ? "उत्तर" : "दक्षिण"}`;
    case "zh": return `${n ? "北纬" : "南纬"}${a}°`;
    case "ja": return `${n ? "北緯" : "南緯"}${a}°`;
    case "ko": return `${n ? "북위" : "남위"} ${a}°`;
    default: return `${a}° ${n ? "N" : "S"}`;
  }
}
