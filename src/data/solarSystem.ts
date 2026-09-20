import type { LocalizedText } from "@/lib/i18n";

/**
 * Nutzerwunsch 20.09.2026: "erstelle so ein box mit solarsystem oben ...
 * realistische bewegungen von planeten. alle planeten sollen enthalten
 * sein ... sehr realistische umlaufbahnen und abstände" — echte
 * astronomische Werte (AU, Tage, km), keine erfundenen Zahlen. Für die
 * Darstellung werden Abstände/Größen skaliert (siehe SolarSystem.tsx),
 * die REIHENFOLGE und relativen Verhältnisse bleiben aber echt.
 *
 * Nutzerwunsch 20.09.2026 (vierte Runde): "alles soll auf anderen sprache
 * sein also jedes text und details" — Name, Fakten und Beschreibung sind
 * jetzt für ALLE 13 Sprachen vollständig übersetzt (nicht mehr nur
 * Deutsch+Englisch mit Fallback).
 */
export interface PlanetData {
  id: string;
  name: LocalizedText;
  /** Große Halbachse in AE (Astronomische Einheiten) — echter Wert. */
  distanceAu: number;
  /** Siderische Umlaufzeit in Erdtagen — echter Wert (bei der Sonde ungenutzt). */
  periodDays: number;
  /** Äquatordurchmesser in km — echter Wert (bei der Sonde nur symbolisch, s. u.). */
  diameterKm: number;
  color: string;
  glowColor: string;
  hasRings?: boolean;
  /** "planet" (Standard) | "dwarf" (Zwergplanet) | "probe" (Raumsonde, kreist nicht) | "star" (die Sonne). */
  kind?: "planet" | "dwarf" | "probe" | "star";
  /** Überschreibt die Standard-Labels im Info-Panel (Reihenfolge: Abstand/Umlauf/Größe/Extra). */
  factLabels?: [LocalizedText, LocalizedText, LocalizedText, LocalizedText];
  facts: {
    distance: LocalizedText;
    period: LocalizedText;
    diameter: LocalizedText;
    moons: LocalizedText;
  };
  description: LocalizedText;
  /** Echtes Foto (Nutzerwunsch 20.09.2026: "mehr infos mit echten bildern bei planeten und sonne"). */
  image?: string;
}

function commonsFile(filename: string): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=700`;
}

export const PLANETS: PlanetData[] = [
  {
    id: "mercury",
    name: {
      de: "Merkur", en: "Mercury", hi: "बुध", zh: "水星", ko: "수성", ja: "水星",
      es: "Mercurio", fr: "Mercure", tr: "Merkür", ru: "Меркурий", pt: "Mercúrio", ar: "عطارد", el: "Ερμής",
    },
    distanceAu: 0.387,
    periodDays: 88,
    diameterKm: 4879,
    color: "#b8ada0",
    glowColor: "rgba(184,173,160,0.5)",
    facts: {
      distance: {
        de: "0,39 AE (≈ 58 Mio. km)", en: "0.39 AU (≈ 58 million km)", hi: "0.39 AU (≈ 58 मिलियन किमी)", zh: "0.39 天文单位（约5,800万公里）", ko: "0.39 AU (약 5,800만 km)", ja: "0.39 AU（約5,800万km）",
        es: "0,39 UA (≈ 58 millones de km)", fr: "0,39 ua (≈ 58 millions de km)", tr: "0,39 AB (≈ 58 milyon km)", ru: "0,39 а.е. (≈ 58 млн км)", pt: "0,39 UA (≈ 58 milhões de km)", ar: "0.39 و.ف (≈ 58 مليون كم)", el: "0,39 AU (≈ 58 εκατ. χλμ.)",
      },
      period: {
        de: "88 Tage", en: "88 days", hi: "88 दिन", zh: "88 天", ko: "88일", ja: "88日",
        es: "88 días", fr: "88 jours", tr: "88 gün", ru: "88 дней", pt: "88 dias", ar: "88 يومًا", el: "88 ημέρες",
      },
      diameter: {
        de: "4.879 km", en: "4,879 km", hi: "4,879 किमी", zh: "4,879 公里", ko: "4,879km", ja: "4,879km",
        es: "4.879 km", fr: "4 879 km", tr: "4.879 km", ru: "4879 км", pt: "4.879 km", ar: "4879 كم", el: "4.879 χλμ.",
      },
      moons: {
        de: "0", en: "0", hi: "0", zh: "0", ko: "0", ja: "0",
        es: "0", fr: "0", tr: "0", ru: "0", pt: "0", ar: "0", el: "0",
      },
    },
    description: {
      de: "Merkur ist der sonnennächste und kleinste Planet. Ohne nennenswerte Atmosphäre schwanken die Temperaturen extrem — bis zu 430 °C tagsüber, bis zu −180 °C nachts.",
      en: "Mercury is the closest planet to the Sun and the smallest. With almost no atmosphere, temperatures swing wildly — up to 430°C during the day and down to −180°C at night.",
      hi: "बुध सूर्य के सबसे निकट और सबसे छोटा ग्रह है। लगभग कोई वायुमंडल न होने के कारण तापमान में भारी उतार-चढ़ाव होता है — दिन में 430°C तक और रात में −180°C तक।",
      zh: "水星是离太阳最近、也是最小的行星。由于几乎没有大气层，温度波动极大——白天高达430°C，夜晚可降至−180°C。",
      ko: "수성은 태양에서 가장 가까운, 가장 작은 행성입니다. 대기가 거의 없어 온도 변화가 극심합니다 — 낮에는 430°C까지, 밤에는 −180°C까지 떨어집니다.",
      ja: "水星は太陽に最も近く、最も小さな惑星です。大気がほとんどないため気温差が激しく、昼は430°C、夜は−180°Cまで下がります。",
      es: "Mercurio es el planeta más cercano al Sol y el más pequeño. Con una atmósfera casi inexistente, las temperaturas varían enormemente: hasta 430 °C de día y −180 °C de noche.",
      fr: "Mercure est la planète la plus proche du Soleil et la plus petite. Avec une atmosphère quasi inexistante, les températures varient énormément — jusqu'à 430 °C le jour et −180 °C la nuit.",
      tr: "Merkür, Güneş'e en yakın ve en küçük gezegendir. Neredeyse hiç atmosferi olmadığından sıcaklıklar aşırı değişir — gündüz 430°C'ye, gece −180°C'ye kadar.",
      ru: "Меркурий — ближайшая к Солнцу и самая маленькая планета. Из-за почти полного отсутствия атмосферы температура колеблется чрезвычайно сильно — до 430°C днём и до −180°C ночью.",
      pt: "Mercúrio é o planeta mais próximo do Sol e o menor. Com uma atmosfera quase inexistente, as temperaturas variam drasticamente — até 430°C de dia e −180°C à noite.",
      ar: "عطارد هو أقرب كوكب إلى الشمس وأصغرها. مع غياب شبه تام للغلاف الجوي، تتقلب درجات الحرارة بشدة — حتى 430 درجة مئوية نهارًا وحتى −180 درجة مئوية ليلاً.",
      el: "Ο Ερμής είναι ο πλησιέστερος στον Ήλιο και ο μικρότερος πλανήτης. Με σχεδόν ανύπαρκτη ατμόσφαιρα, οι θερμοκρασίες κυμαίνονται ακραία — έως 430°C την ημέρα και έως −180°C τη νύχτα.",
    },
    image: commonsFile("Mercury_in_color_-_Prockter07-edit1.jpg"),
  },
  {
    id: "venus",
    name: {
      de: "Venus", en: "Venus", hi: "शुक्र", zh: "金星", ko: "금성", ja: "金星",
      es: "Venus", fr: "Vénus", tr: "Venüs", ru: "Венера", pt: "Vénus", ar: "الزهرة", el: "Αφροδίτη",
    },
    distanceAu: 0.723,
    periodDays: 224.7,
    diameterKm: 12104,
    color: "#e8c98a",
    glowColor: "rgba(232,201,138,0.5)",
    facts: {
      distance: {
        de: "0,72 AE (≈ 108 Mio. km)", en: "0.72 AU (≈ 108 million km)", hi: "0.72 AU (≈ 108 मिलियन किमी)", zh: "0.72 天文单位（约1.08亿公里）", ko: "0.72 AU (약 1억 800만 km)", ja: "0.72 AU（約1億800万km）",
        es: "0,72 UA (≈ 108 millones de km)", fr: "0,72 ua (≈ 108 millions de km)", tr: "0,72 AB (≈ 108 milyon km)", ru: "0,72 а.е. (≈ 108 млн км)", pt: "0,72 UA (≈ 108 milhões de km)", ar: "0.72 و.ف (≈ 108 مليون كم)", el: "0,72 AU (≈ 108 εκατ. χλμ.)",
      },
      period: {
        de: "225 Tage", en: "225 days", hi: "225 दिन", zh: "225 天", ko: "225일", ja: "225日",
        es: "225 días", fr: "225 jours", tr: "225 gün", ru: "225 дней", pt: "225 dias", ar: "225 يومًا", el: "225 ημέρες",
      },
      diameter: {
        de: "12.104 km", en: "12,104 km", hi: "12,104 किमी", zh: "12,104 公里", ko: "12,104km", ja: "12,104km",
        es: "12.104 km", fr: "12 104 km", tr: "12.104 km", ru: "12 104 км", pt: "12.104 km", ar: "12104 كم", el: "12.104 χλμ.",
      },
      moons: {
        de: "0", en: "0", hi: "0", zh: "0", ko: "0", ja: "0",
        es: "0", fr: "0", tr: "0", ru: "0", pt: "0", ar: "0", el: "0",
      },
    },
    description: {
      de: "Venus ist durch ihre extrem dichte CO₂-Atmosphäre und den daraus resultierenden Treibhauseffekt der heißeste Planet im Sonnensystem — heißer als Merkur, trotz größerer Sonnenentfernung.",
      en: "Venus, with its extremely dense CO₂ atmosphere and resulting greenhouse effect, is the hottest planet in the Solar System — hotter than Mercury despite being farther from the Sun.",
      hi: "शुक्र अपने अत्यंत घने CO₂ वायुमंडल और उससे उत्पन्न ग्रीनहाउस प्रभाव के कारण सौर मंडल का सबसे गर्म ग्रह है — सूर्य से अधिक दूर होने के बावजूद बुध से भी अधिक गर्म।",
      zh: "金星因其极其浓密的二氧化碳大气层及由此产生的温室效应，是太阳系中最热的行星——尽管离太阳更远，却比水星更热。",
      ko: "금성은 극도로 짙은 이산화탄소 대기와 그로 인한 온실 효과 때문에 태양계에서 가장 뜨거운 행성입니다 — 태양에서 더 멀리 있음에도 수성보다 뜨겁습니다.",
      ja: "金星は非常に濃いCO₂大気とその温室効果により、太陽系で最も暑い惑星です — 太陽からより遠いにもかかわらず、水星よりも高温です。",
      es: "Venus, con su atmósfera de CO₂ extremadamente densa y el consiguiente efecto invernadero, es el planeta más caliente del sistema solar, más caliente que Mercurio pese a estar más lejos del Sol.",
      fr: "Vénus, avec son atmosphère de CO₂ extrêmement dense et l'effet de serre qui en résulte, est la planète la plus chaude du système solaire — plus chaude que Mercure malgré son éloignement plus grand du Soleil.",
      tr: "Venüs, son derece yoğun CO₂ atmosferi ve buna bağlı sera etkisi nedeniyle Güneş Sistemi'ndeki en sıcak gezegendir — Güneş'e daha uzak olmasına rağmen Merkür'den daha sıcaktır.",
      ru: "Венера благодаря чрезвычайно плотной атмосфере из CO₂ и вызванному ею парниковому эффекту является самой горячей планетой Солнечной системы — горячее Меркурия, несмотря на бо́льшую удалённость от Солнца.",
      pt: "Vénus, com a sua atmosfera de CO₂ extremamente densa e o efeito de estufa resultante, é o planeta mais quente do sistema solar — mais quente que Mercúrio apesar de estar mais longe do Sol.",
      ar: "الزهرة، بغلافها الجوي الكثيف جدًا من ثاني أكسيد الكربون وتأثير الاحتباس الحراري الناتج عنه، هي أشد كواكب المجموعة الشمسية حرارة — أشد حرارة من عطارد رغم بعدها الأكبر عن الشمس.",
      el: "Η Αφροδίτη, με την εξαιρετικά πυκνή ατμόσφαιρα CO₂ και το προκύπτον φαινόμενο θερμοκηπίου, είναι ο θερμότερος πλανήτης του ηλιακού συστήματος — θερμότερος από τον Ερμή παρά τη μεγαλύτερη απόστασή της από τον Ήλιο.",
    },
    image: commonsFile("Venus-real_color.jpg"),
  },
  {
    id: "earth",
    name: {
      de: "Erde", en: "Earth", hi: "पृथ्वी", zh: "地球", ko: "지구", ja: "地球",
      es: "Tierra", fr: "Terre", tr: "Dünya", ru: "Земля", pt: "Terra", ar: "الأرض", el: "Γη",
    },
    distanceAu: 1,
    periodDays: 365.25,
    diameterKm: 12742,
    color: "#4f8fd6",
    glowColor: "rgba(79,143,214,0.55)",
    facts: {
      distance: {
        de: "1 AE (≈ 150 Mio. km)", en: "1 AU (≈ 150 million km)", hi: "1 AU (≈ 150 मिलियन किमी)", zh: "1 天文单位（约1.5亿公里）", ko: "1 AU (약 1억 5,000만 km)", ja: "1 AU（約1億5,000万km）",
        es: "1 UA (≈ 150 millones de km)", fr: "1 ua (≈ 150 millions de km)", tr: "1 AB (≈ 150 milyon km)", ru: "1 а.е. (≈ 150 млн км)", pt: "1 UA (≈ 150 milhões de km)", ar: "1 و.ف (≈ 150 مليون كم)", el: "1 AU (≈ 150 εκατ. χλμ.)",
      },
      period: {
        de: "365,25 Tage", en: "365.25 days", hi: "365.25 दिन", zh: "365.25 天", ko: "365.25일", ja: "365.25日",
        es: "365,25 días", fr: "365,25 jours", tr: "365,25 gün", ru: "365,25 дня", pt: "365,25 dias", ar: "365.25 يومًا", el: "365,25 ημέρες",
      },
      diameter: {
        de: "12.742 km", en: "12,742 km", hi: "12,742 किमी", zh: "12,742 公里", ko: "12,742km", ja: "12,742km",
        es: "12.742 km", fr: "12 742 km", tr: "12.742 km", ru: "12 742 км", pt: "12.742 km", ar: "12742 كم", el: "12.742 χλμ.",
      },
      moons: {
        de: "1 (Mond)", en: "1 (the Moon)", hi: "1 (चंद्रमा)", zh: "1（月球）", ko: "1개（달）", ja: "1個（月）",
        es: "1 (la Luna)", fr: "1 (la Lune)", tr: "1 (Ay)", ru: "1 (Луна)", pt: "1 (a Lua)", ar: "1 (القمر)", el: "1 (η Σελήνη)",
      },
    },
    description: {
      de: "Unser Heimatplanet — der einzige bekannte Ort im Universum mit bestätigtem Leben. Flüssiges Wasser an der Oberfläche und eine schützende Atmosphäre machen das möglich.",
      en: "Our home planet — the only known place in the universe with confirmed life. Liquid water on the surface and a protective atmosphere make it possible.",
      hi: "हमारा गृह ग्रह — ब्रह्मांड में पुष्ट जीवन वाला एकमात्र ज्ञात स्थान। सतह पर तरल पानी और एक सुरक्षात्मक वायुमंडल इसे संभव बनाते हैं।",
      zh: "我们的家园星球——宇宙中唯一确认存在生命的已知地方。地表液态水和保护性大气层使之成为可能。",
      ko: "우리의 고향 행성 — 우주에서 생명체가 확인된 유일하게 알려진 곳입니다. 표면의 액체 물과 보호막 역할을 하는 대기가 이를 가능하게 합니다.",
      ja: "私たちの故郷の惑星 — 生命の存在が確認されている宇宙で唯一知られている場所です。表面の液体の水と保護的な大気がそれを可能にしています。",
      es: "Nuestro planeta natal, el único lugar conocido del universo con vida confirmada. El agua líquida en la superficie y una atmósfera protectora lo hacen posible.",
      fr: "Notre planète natale — le seul endroit connu de l'univers où la vie est confirmée. De l'eau liquide en surface et une atmosphère protectrice rendent cela possible.",
      tr: "Ana gezegenimiz — evrende doğrulanmış yaşamın bilinen tek yeri. Yüzeydeki sıvı su ve koruyucu bir atmosfer bunu mümkün kılıyor.",
      ru: "Наша родная планета — единственное известное место во Вселенной с подтверждённой жизнью. Жидкая вода на поверхности и защитная атмосфера делают это возможным.",
      pt: "O nosso planeta natal — o único local conhecido no universo com vida confirmada. Água líquida na superfície e uma atmosfera protetora tornam isso possível.",
      ar: "كوكبنا الأم — المكان الوحيد المعروف في الكون الذي تم تأكيد وجود الحياة فيه. الماء السائل على السطح والغلاف الجوي الواقي يجعلان ذلك ممكنًا.",
      el: "Ο πλανήτης-πατρίδα μας — το μόνο γνωστό μέρος στο σύμπαν με επιβεβαιωμένη ζωή. Το υγρό νερό στην επιφάνεια και μια προστατευτική ατμόσφαιρα το καθιστούν δυνατό.",
    },
    image: commonsFile("The_Blue_Marble_(remastered).jpg"),
  },
  {
    id: "mars",
    name: {
      de: "Mars", en: "Mars", hi: "मंगल", zh: "火星", ko: "화성", ja: "火星",
      es: "Marte", fr: "Mars", tr: "Mars", ru: "Марс", pt: "Marte", ar: "المريخ", el: "Άρης",
    },
    distanceAu: 1.524,
    periodDays: 687,
    diameterKm: 6779,
    color: "#c1543a",
    glowColor: "rgba(193,84,58,0.5)",
    facts: {
      distance: {
        de: "1,52 AE (≈ 228 Mio. km)", en: "1.52 AU (≈ 228 million km)", hi: "1.52 AU (≈ 228 मिलियन किमी)", zh: "1.52 天文单位（约2.28亿公里）", ko: "1.52 AU (약 2억 2,800만 km)", ja: "1.52 AU（約2億2,800万km）",
        es: "1,52 UA (≈ 228 millones de km)", fr: "1,52 ua (≈ 228 millions de km)", tr: "1,52 AB (≈ 228 milyon km)", ru: "1,52 а.е. (≈ 228 млн км)", pt: "1,52 UA (≈ 228 milhões de km)", ar: "1.52 و.ف (≈ 228 مليون كم)", el: "1,52 AU (≈ 228 εκατ. χλμ.)",
      },
      period: {
        de: "687 Tage", en: "687 days", hi: "687 दिन", zh: "687 天", ko: "687일", ja: "687日",
        es: "687 días", fr: "687 jours", tr: "687 gün", ru: "687 дней", pt: "687 dias", ar: "687 يومًا", el: "687 ημέρες",
      },
      diameter: {
        de: "6.779 km", en: "6,779 km", hi: "6,779 किमी", zh: "6,779 公里", ko: "6,779km", ja: "6,779km",
        es: "6.779 km", fr: "6 779 km", tr: "6.779 km", ru: "6779 км", pt: "6.779 km", ar: "6779 كم", el: "6.779 χλμ.",
      },
      moons: {
        de: "2 (Phobos, Deimos)", en: "2 (Phobos, Deimos)", hi: "2 (फोबोस, डीमोस)", zh: "2（火卫一、火卫二）", ko: "2개（포보스, 데이모스）", ja: "2個（フォボス、ダイモス）",
        es: "2 (Fobos, Deimos)", fr: "2 (Phobos, Déimos)", tr: "2 (Phobos, Deimos)", ru: "2 (Фобос, Деймос)", pt: "2 (Fobos, Deimos)", ar: "2 (فوبوس وديموس)", el: "2 (Φόβος, Δείμος)",
      },
    },
    description: {
      de: "Der 'Rote Planet' verdankt seine Farbe eisenoxidhaltigem Staub. Er beherbergt den größten bekannten Vulkan des Sonnensystems, Olympus Mons, und ist Ziel zukünftiger bemannter Missionen.",
      en: "The 'Red Planet' owes its colour to iron-oxide dust. It hosts the largest known volcano in the Solar System, Olympus Mons, and is a target for future crewed missions.",
      hi: "'लाल ग्रह' अपना रंग आयरन-ऑक्साइड युक्त धूल से पाता है। यहाँ सौर मंडल का सबसे बड़ा ज्ञात ज्वालामुखी, ओलंपस मॉन्स स्थित है, और यह भविष्य के मानव मिशनों का लक्ष्य है।",
      zh: "「红色星球」的颜色源于富含氧化铁的尘埃。这里坐落着太阳系已知最大的火山——奥林帕斯山，也是未来载人任务的目标。",
      ko: "'붉은 행성'은 산화철이 함유된 먼지 때문에 붉은색을 띱니다. 태양계에서 가장 큰 것으로 알려진 화산 올림푸스 몬스가 있으며, 향후 유인 임무의 목표지입니다.",
      ja: "「赤い惑星」はその色を酸化鉄を含む塵に由来します。太陽系最大の火山として知られるオリンポス山があり、将来の有人ミッションの目標でもあります。",
      es: "El 'planeta rojo' debe su color al polvo con óxido de hierro. Alberga el volcán más grande conocido del sistema solar, el Monte Olimpo, y es objetivo de futuras misiones tripuladas.",
      fr: "La 'planète rouge' doit sa couleur à la poussière d'oxyde de fer. Elle abrite le plus grand volcan connu du système solaire, Olympus Mons, et est une cible pour de futures missions habitées.",
      tr: "'Kızıl Gezegen', rengini demir oksit içeren tozdan alır. Güneş Sistemi'ndeki en büyük bilinen yanardağ olan Olympus Mons'a ev sahipliği yapar ve gelecekteki insanlı görevlerin hedefidir.",
      ru: "«Красная планета» обязана своим цветом пыли, содержащей оксид железа. На ней находится крупнейший известный вулкан Солнечной системы — гора Олимп, и она является целью будущих пилотируемых миссий.",
      pt: "O 'planeta vermelho' deve a sua cor ao pó rico em óxido de ferro. Alberga o maior vulcão conhecido do sistema solar, o Monte Olimpo, e é alvo de futuras missões tripuladas.",
      ar: "يدين 'الكوكب الأحمر' بلونه إلى الغبار الغني بأكسيد الحديد. يضم أكبر بركان معروف في المجموعة الشمسية، أوليمبوس مونس، وهو هدف للبعثات المأهولة المستقبلية.",
      el: "Ο «Κόκκινος Πλανήτης» οφείλει το χρώμα του στη σκόνη με οξείδιο του σιδήρου. Φιλοξενεί το μεγαλύτερο γνωστό ηφαίστειο του ηλιακού συστήματος, το Όλυμπος Μονς, και αποτελεί στόχο μελλοντικών επανδρωμένων αποστολών.",
    },
    image: commonsFile("OSIRIS_Mars_true_color.jpg"),
  },
  {
    id: "jupiter",
    name: {
      de: "Jupiter", en: "Jupiter", hi: "बृहस्पति", zh: "木星", ko: "목성", ja: "木星",
      es: "Júpiter", fr: "Jupiter", tr: "Jüpiter", ru: "Юпитер", pt: "Júpiter", ar: "المشتري", el: "Δίας",
    },
    distanceAu: 5.204,
    periodDays: 4333,
    diameterKm: 139820,
    color: "#d9b28c",
    glowColor: "rgba(217,178,140,0.5)",
    facts: {
      distance: {
        de: "5,20 AE (≈ 778 Mio. km)", en: "5.20 AU (≈ 778 million km)", hi: "5.20 AU (≈ 778 मिलियन किमी)", zh: "5.20 天文单位（约7.78亿公里）", ko: "5.20 AU (약 7억 7,800만 km)", ja: "5.20 AU（約7億7,800万km）",
        es: "5,20 UA (≈ 778 millones de km)", fr: "5,20 ua (≈ 778 millions de km)", tr: "5,20 AB (≈ 778 milyon km)", ru: "5,20 а.е. (≈ 778 млн км)", pt: "5,20 UA (≈ 778 milhões de km)", ar: "5.20 و.ف (≈ 778 مليون كم)", el: "5,20 AU (≈ 778 εκατ. χλμ.)",
      },
      period: {
        de: "≈ 11,86 Jahre", en: "≈ 11.86 years", hi: "≈ 11.86 वर्ष", zh: "约11.86年", ko: "약 11.86년", ja: "約11.86年",
        es: "≈ 11,86 años", fr: "≈ 11,86 ans", tr: "≈ 11,86 yıl", ru: "≈ 11,86 года", pt: "≈ 11,86 anos", ar: "≈ 11.86 سنة", el: "≈ 11,86 έτη",
      },
      diameter: {
        de: "139.820 km", en: "139,820 km", hi: "139,820 किमी", zh: "139,820 公里", ko: "139,820km", ja: "139,820km",
        es: "139.820 km", fr: "139 820 km", tr: "139.820 km", ru: "139 820 км", pt: "139.820 km", ar: "139820 كم", el: "139.820 χλμ.",
      },
      moons: {
        de: "95 bekannte", en: "95 known", hi: "95 ज्ञात", zh: "已知95颗", ko: "알려진 95개", ja: "既知95個",
        es: "95 conocidas", fr: "95 connues", tr: "bilinen 95", ru: "95 известных", pt: "95 conhecidas", ar: "95 معروفًا", el: "95 γνωστοί",
      },
    },
    description: {
      de: "Jupiter ist der größte Planet — mehr als doppelt so massereich wie alle anderen Planeten zusammen. Der Große Rote Fleck ist ein Sturm, größer als die Erde, der seit Jahrhunderten wütet.",
      en: "Jupiter is the largest planet — more than twice as massive as all other planets combined. The Great Red Spot is a storm larger than Earth that has raged for centuries.",
      hi: "बृहस्पति सबसे बड़ा ग्रह है — यह अन्य सभी ग्रहों के संयुक्त द्रव्यमान से दोगुने से भी अधिक विशाल है। ग्रेट रेड स्पॉट पृथ्वी से भी बड़ा एक तूफान है जो सदियों से चल रहा है।",
      zh: "木星是最大的行星——质量超过所有其他行星总和的两倍以上。大红斑是一个比地球还大的风暴，已肆虐数百年。",
      ko: "목성은 가장 큰 행성입니다 — 다른 모든 행성을 합친 것보다 두 배 이상 무겁습니다. 대적점은 지구보다 큰 폭풍으로 수 세기 동안 계속되고 있습니다.",
      ja: "木星は最大の惑星です — 他のすべての惑星を合わせた質量の2倍以上あります。大赤斑は地球より大きな嵐で、何世紀も荒れ狂っています。",
      es: "Júpiter es el planeta más grande, con más del doble de masa que todos los demás planetas juntos. La Gran Mancha Roja es una tormenta más grande que la Tierra que lleva siglos activa.",
      fr: "Jupiter est la plus grande planète — plus de deux fois plus massive que toutes les autres planètes réunies. La Grande Tache rouge est une tempête plus grande que la Terre qui fait rage depuis des siècles.",
      tr: "Jüpiter en büyük gezegendir — diğer tüm gezegenlerin toplamından iki kattan fazla ağırdır. Büyük Kırmızı Leke, yüzyıllardır süren, Dünya'dan daha büyük bir fırtınadır.",
      ru: "Юпитер — самая большая планета, более чем вдвое массивнее всех остальных планет вместе взятых. Большое красное пятно — это буря крупнее Земли, бушующая уже несколько столетий.",
      pt: "Júpiter é o maior planeta — com mais do dobro da massa de todos os outros planetas juntos. A Grande Mancha Vermelha é uma tempestade maior que a Terra que já dura séculos.",
      ar: "المشتري هو أكبر كوكب — كتلته أكثر من ضعف كتلة جميع الكواكب الأخرى مجتمعة. البقعة الحمراء الكبرى هي عاصفة أكبر من الأرض تهب منذ قرون.",
      el: "Ο Δίας είναι ο μεγαλύτερος πλανήτης — έχει πάνω από διπλάσια μάζα από όλους τους άλλους πλανήτες μαζί. Η Μεγάλη Κόκκινη Κηλίδα είναι μια καταιγίδα μεγαλύτερη από τη Γη που μαίνεται εδώ και αιώνες.",
    },
    image: commonsFile("Jupiter_by_Cassini-Huygens.jpg"),
  },
  {
    id: "saturn",
    name: {
      de: "Saturn", en: "Saturn", hi: "शनि", zh: "土星", ko: "토성", ja: "土星",
      es: "Saturno", fr: "Saturne", tr: "Satürn", ru: "Сатурн", pt: "Saturno", ar: "زحل", el: "Κρόνος",
    },
    distanceAu: 9.583,
    periodDays: 10759,
    diameterKm: 116460,
    color: "#e3d1a3",
    glowColor: "rgba(227,209,163,0.5)",
    hasRings: true,
    facts: {
      distance: {
        de: "9,58 AE (≈ 1,43 Mrd. km)", en: "9.58 AU (≈ 1.43 billion km)", hi: "9.58 AU (≈ 1.43 अरब किमी)", zh: "9.58 天文单位（约14.3亿公里）", ko: "9.58 AU (약 14.3억 km)", ja: "9.58 AU（約14.3億km）",
        es: "9,58 UA (≈ 1,43 mil millones de km)", fr: "9,58 ua (≈ 1,43 milliard de km)", tr: "9,58 AB (≈ 1,43 milyar km)", ru: "9,58 а.е. (≈ 1,43 млрд км)", pt: "9,58 UA (≈ 1,43 mil milhões de km)", ar: "9.58 و.ف (≈ 1.43 مليار كم)", el: "9,58 AU (≈ 1,43 δισ. χλμ.)",
      },
      period: {
        de: "≈ 29,4 Jahre", en: "≈ 29.4 years", hi: "≈ 29.4 वर्ष", zh: "约29.4年", ko: "약 29.4년", ja: "約29.4年",
        es: "≈ 29,4 años", fr: "≈ 29,4 ans", tr: "≈ 29,4 yıl", ru: "≈ 29,4 года", pt: "≈ 29,4 anos", ar: "≈ 29.4 سنة", el: "≈ 29,4 έτη",
      },
      diameter: {
        de: "116.460 km", en: "116,460 km", hi: "116,460 किमी", zh: "116,460 公里", ko: "116,460km", ja: "116,460km",
        es: "116.460 km", fr: "116 460 km", tr: "116.460 km", ru: "116 460 км", pt: "116.460 km", ar: "116460 كم", el: "116.460 χλμ.",
      },
      moons: {
        de: "146 bekannte", en: "146 known", hi: "146 ज्ञात", zh: "已知146颗", ko: "알려진 146개", ja: "既知146個",
        es: "146 conocidas", fr: "146 connues", tr: "bilinen 146", ru: "146 известных", pt: "146 conhecidas", ar: "146 معروفًا", el: "146 γνωστοί",
      },
    },
    description: {
      de: "Saturn ist berühmt für sein ausgedehntes, spektakuläres Ringsystem aus Eis- und Gesteinspartikeln. Mit der geringsten Dichte aller Planeten würde er theoretisch auf Wasser schwimmen.",
      en: "Saturn is famous for its vast, spectacular ring system made of ice and rock particles. With the lowest density of any planet, it would theoretically float on water.",
      hi: "शनि अपने विशाल, शानदार वलय तंत्र के लिए प्रसिद्ध है जो बर्फ और चट्टान के कणों से बना है। सभी ग्रहों में सबसे कम घनत्व के साथ, यह सैद्धांतिक रूप से पानी पर तैर सकता है।",
      zh: "土星以其由冰和岩石颗粒组成的庞大而壮观的光环系统而闻名。它是所有行星中密度最低的，理论上可以漂浮在水面上。",
      ko: "토성은 얼음과 암석 입자로 이루어진 광대하고 장관인 고리 시스템으로 유명합니다. 모든 행성 중 밀도가 가장 낮아 이론적으로 물에 뜰 수 있습니다.",
      ja: "土星は氷と岩石の粒子でできた広大で壮観な環系で有名です。全惑星の中で密度が最も低く、理論上は水に浮くことができます。",
      es: "Saturno es famoso por su vasto y espectacular sistema de anillos formado por partículas de hielo y roca. Con la densidad más baja de todos los planetas, teóricamente flotaría en el agua.",
      fr: "Saturne est célèbre pour son vaste et spectaculaire système d'anneaux composé de particules de glace et de roche. Avec la densité la plus faible de toutes les planètes, elle flotterait théoriquement sur l'eau.",
      tr: "Satürn, buz ve kaya parçacıklarından oluşan geniş, muhteşem halka sistemiyle ünlüdür. Tüm gezegenler arasında en düşük yoğunluğa sahip olduğundan teorik olarak suda yüzebilir.",
      ru: "Сатурн знаменит своей обширной, впечатляющей системой колец из частиц льда и камня. Обладая самой низкой плотностью среди всех планет, он теоретически мог бы плавать в воде.",
      pt: "Saturno é famoso pelo seu vasto e espetacular sistema de anéis, feito de partículas de gelo e rocha. Com a menor densidade de todos os planetas, flutuaria teoricamente na água.",
      ar: "يشتهر زحل بنظامه الحلقي الواسع والمذهل المكوّن من جزيئات الجليد والصخور. بأقل كثافة بين جميع الكواكب، يمكنه نظريًا أن يطفو على الماء.",
      el: "Ο Κρόνος είναι διάσημος για το εκτεταμένο, εντυπωσιακό σύστημα δακτυλίων του, φτιαγμένο από σωματίδια πάγου και βράχου. Με τη χαμηλότερη πυκνότητα από όλους τους πλανήτες, θεωρητικά θα επέπλεε στο νερό.",
    },
    image: commonsFile("Saturn_during_Equinox.jpg"),
  },
  {
    id: "uranus",
    name: {
      de: "Uranus", en: "Uranus", hi: "अरुण", zh: "天王星", ko: "천왕성", ja: "天王星",
      es: "Urano", fr: "Uranus", tr: "Uranüs", ru: "Уран", pt: "Urano", ar: "أورانوس", el: "Ουρανός",
    },
    distanceAu: 19.2,
    periodDays: 30687,
    diameterKm: 50724,
    color: "#9fd6d6",
    glowColor: "rgba(159,214,214,0.5)",
    facts: {
      distance: {
        de: "19,2 AE (≈ 2,87 Mrd. km)", en: "19.2 AU (≈ 2.87 billion km)", hi: "19.2 AU (≈ 2.87 अरब किमी)", zh: "19.2 天文单位（约28.7亿公里）", ko: "19.2 AU (약 28.7억 km)", ja: "19.2 AU（約28.7億km）",
        es: "19,2 UA (≈ 2,87 mil millones de km)", fr: "19,2 ua (≈ 2,87 milliards de km)", tr: "19,2 AB (≈ 2,87 milyar km)", ru: "19,2 а.е. (≈ 2,87 млрд км)", pt: "19,2 UA (≈ 2,87 mil milhões de km)", ar: "19.2 و.ف (≈ 2.87 مليار كم)", el: "19,2 AU (≈ 2,87 δισ. χλμ.)",
      },
      period: {
        de: "≈ 84 Jahre", en: "≈ 84 years", hi: "≈ 84 वर्ष", zh: "约84年", ko: "약 84년", ja: "約84年",
        es: "≈ 84 años", fr: "≈ 84 ans", tr: "≈ 84 yıl", ru: "≈ 84 года", pt: "≈ 84 anos", ar: "≈ 84 سنة", el: "≈ 84 έτη",
      },
      diameter: {
        de: "50.724 km", en: "50,724 km", hi: "50,724 किमी", zh: "50,724 公里", ko: "50,724km", ja: "50,724km",
        es: "50.724 km", fr: "50 724 km", tr: "50.724 km", ru: "50 724 км", pt: "50.724 km", ar: "50724 كم", el: "50.724 χλμ.",
      },
      moons: {
        de: "28 bekannte", en: "28 known", hi: "28 ज्ञात", zh: "已知28颗", ko: "알려진 28개", ja: "既知28個",
        es: "28 conocidas", fr: "28 connues", tr: "bilinen 28", ru: "28 известных", pt: "28 conhecidas", ar: "28 معروفًا", el: "28 γνωστοί",
      },
    },
    description: {
      de: "Uranus rotiert extrem geneigt — praktisch 'auf der Seite liegend' mit ~98° Achsneigung, vermutlich Folge einer gewaltigen Kollision in der Frühzeit des Sonnensystems.",
      en: "Uranus rotates at an extreme tilt — essentially 'lying on its side' with an axial tilt of ~98°, likely the result of a massive collision early in the Solar System's history.",
      hi: "अरुण अत्यधिक झुकाव के साथ घूमता है — लगभग 98° की अक्षीय झुकाव के साथ 'अपनी करवट लेटा हुआ', संभवतः सौर मंडल के आरंभिक काल में हुई एक विशाल टक्कर का परिणाम।",
      zh: "天王星以极端倾斜的方式自转——轴倾角约98°，几乎是「侧躺」着的，这很可能是太阳系早期一次巨大碰撞的结果。",
      ko: "천왕성은 극도로 기울어져 자전합니다 — 축 기울기가 약 98°로 사실상 '옆으로 누워' 있으며, 이는 태양계 초기의 거대한 충돌의 결과로 추정됩니다.",
      ja: "天王星は極端に傾いて自転しています — 軸の傾きは約98°でほぼ「横倒し」の状態であり、太陽系初期の巨大衝突の結果と考えられています。",
      es: "Urano gira con una inclinación extrema, prácticamente 'tumbado de lado' con una inclinación axial de ~98°, probablemente a causa de una colisión masiva en los primeros tiempos del sistema solar.",
      fr: "Uranus tourne avec une inclinaison extrême, pratiquement 'couchée sur le côté' avec une inclinaison axiale de ~98°, probablement à la suite d'une collision massive aux débuts du système solaire.",
      tr: "Uranüs aşırı bir eğimle döner — ~98° eksen eğimiyle neredeyse 'yan yatmış' durumdadır, muhtemelen Güneş Sistemi'nin erken döneminde yaşanan devasa bir çarpışmanın sonucudur.",
      ru: "Уран вращается с экстремальным наклоном — фактически «лёжа на боку» с наклоном оси ~98°, вероятно, в результате мощного столкновения на заре Солнечной системы.",
      pt: "Urano roda com uma inclinação extrema — praticamente 'deitado de lado' com uma inclinação axial de ~98°, provavelmente resultado de uma colisão massiva no início da história do sistema solar.",
      ar: "يدور أورانوس بميل شديد — 'مستلقٍ على جانبه' عمليًا بميل محوري يبلغ حوالي 98 درجة، على الأرجح نتيجة اصطدام هائل في بدايات المجموعة الشمسية.",
      el: "Ο Ουρανός περιστρέφεται με ακραία κλίση — ουσιαστικά «ξαπλωμένος στο πλάι» με αξονική κλίση ~98°, πιθανώς αποτέλεσμα μιας τεράστιας σύγκρουσης στα πρώτα χρόνια του ηλιακού συστήματος.",
    },
    image: commonsFile("Uranus2.jpg"),
  },
  {
    id: "neptune",
    name: {
      de: "Neptun", en: "Neptune", hi: "वरुण", zh: "海王星", ko: "해왕성", ja: "海王星",
      es: "Neptuno", fr: "Neptune", tr: "Neptün", ru: "Нептун", pt: "Neptuno", ar: "نبتون", el: "Ποσειδώνας",
    },
    distanceAu: 30.05,
    periodDays: 60190,
    diameterKm: 49244,
    color: "#5470d6",
    glowColor: "rgba(84,112,214,0.55)",
    facts: {
      distance: {
        de: "30,05 AE (≈ 4,50 Mrd. km)", en: "30.05 AU (≈ 4.50 billion km)", hi: "30.05 AU (≈ 4.50 अरब किमी)", zh: "30.05 天文单位（约45.0亿公里）", ko: "30.05 AU (약 45.0억 km)", ja: "30.05 AU（約45.0億km）",
        es: "30,05 UA (≈ 4,50 mil millones de km)", fr: "30,05 ua (≈ 4,50 milliards de km)", tr: "30,05 AB (≈ 4,50 milyar km)", ru: "30,05 а.е. (≈ 4,50 млрд км)", pt: "30,05 UA (≈ 4,50 mil milhões de km)", ar: "30.05 و.ف (≈ 4.50 مليار كم)", el: "30,05 AU (≈ 4,50 δισ. χλμ.)",
      },
      period: {
        de: "≈ 165 Jahre", en: "≈ 165 years", hi: "≈ 165 वर्ष", zh: "约165年", ko: "약 165년", ja: "約165年",
        es: "≈ 165 años", fr: "≈ 165 ans", tr: "≈ 165 yıl", ru: "≈ 165 лет", pt: "≈ 165 anos", ar: "≈ 165 سنة", el: "≈ 165 έτη",
      },
      diameter: {
        de: "49.244 km", en: "49,244 km", hi: "49,244 किमी", zh: "49,244 公里", ko: "49,244km", ja: "49,244km",
        es: "49.244 km", fr: "49 244 km", tr: "49.244 km", ru: "49 244 км", pt: "49.244 km", ar: "49244 كم", el: "49.244 χλμ.",
      },
      moons: {
        de: "16 bekannte", en: "16 known", hi: "16 ज्ञात", zh: "已知16颗", ko: "알려진 16개", ja: "既知16個",
        es: "16 conocidas", fr: "16 connues", tr: "bilinen 16", ru: "16 известных", pt: "16 conhecidas", ar: "16 معروفًا", el: "16 γνωστοί",
      },
    },
    description: {
      de: "Neptun ist der äußerste bekannte Planet und hat mit bis zu 2.100 km/h die stärksten gemessenen Winde im Sonnensystem. Seit seiner Entdeckung 1846 hat er noch keine volle Umrundung der Sonne vollendet.",
      en: "Neptune is the outermost known planet and has the strongest measured winds in the Solar System, reaching up to 2,100 km/h. Since its discovery in 1846 it has not yet completed a full orbit of the Sun.",
      hi: "वरुण सबसे बाहरी ज्ञात ग्रह है और सौर मंडल में सबसे तेज़ मापी गई हवाओं का घर है, जो 2,100 किमी/घंटा तक पहुँचती हैं। 1846 में इसकी खोज के बाद से इसने अभी तक सूर्य की एक भी पूर्ण परिक्रमा पूरी नहीं की है।",
      zh: "海王星是已知最外层的行星，拥有太阳系中测得的最强风速，可达每小时2,100公里。自1846年被发现以来，它尚未完成一整圈的太阳公转。",
      ko: "해왕성은 알려진 가장 바깥쪽 행성으로, 태양계에서 측정된 가장 강한 바람(시속 최대 2,100km)을 가지고 있습니다. 1846년 발견된 이후 아직 태양을 한 바퀴도 완전히 돌지 못했습니다.",
      ja: "海王星は最も外側の既知の惑星で、太陽系で観測された最強の風（時速最大2,100km）を持ちます。1846年の発見以来、まだ太陽を一周していません。",
      es: "Neptuno es el planeta conocido más externo y tiene los vientos más fuertes medidos en el sistema solar, de hasta 2.100 km/h. Desde su descubrimiento en 1846 aún no ha completado una órbita completa alrededor del Sol.",
      fr: "Neptune est la planète connue la plus éloignée et possède les vents les plus forts jamais mesurés dans le système solaire, atteignant jusqu'à 2 100 km/h. Depuis sa découverte en 1846, elle n'a pas encore achevé une orbite complète autour du Soleil.",
      tr: "Neptün, bilinen en dış gezegendir ve Güneş Sistemi'nde ölçülen en güçlü rüzgarlara sahiptir, saatte 2.100 km'ye ulaşır. 1846'daki keşfinden bu yana Güneş etrafında henüz tam bir tur tamamlamamıştır.",
      ru: "Нептун — самая удалённая из известных планет, с самыми сильными зафиксированными ветрами в Солнечной системе, достигающими 2100 км/ч. С момента своего открытия в 1846 году он ещё не совершил полный оборот вокруг Солнца.",
      pt: "Neptuno é o planeta conhecido mais exterior e tem os ventos mais fortes já medidos no sistema solar, atingindo até 2.100 km/h. Desde a sua descoberta em 1846, ainda não completou uma órbita completa ao redor do Sol.",
      ar: "نبتون هو أبعد كوكب معروف، ولديه أقوى الرياح المُقاسة في المجموعة الشمسية، تصل إلى 2100 كم/ساعة. منذ اكتشافه عام 1846 لم يُكمل بعد دورة كاملة حول الشمس.",
      el: "Ο Ποσειδώνας είναι ο πιο απομακρυσμένος γνωστός πλανήτης και έχει τους ισχυρότερους μετρημένους ανέμους στο ηλιακό σύστημα, φτάνοντας έως και 2.100 χλμ./ώρα. Από την ανακάλυψή του το 1846 δεν έχει ακόμη ολοκληρώσει μια πλήρη περιφορά γύρω από τον Ήλιο.",
    },
    image: commonsFile("Neptune_Full.jpg"),
  },
];

/**
 * Zwergplaneten (Nutzerwunsch 20.09.2026: "adde plotu anderen kleine
 * zwergplaneten die fast außerhalb sonnensystem sind auch"). Nur im
 * "full"-Modus sichtbar, damit die kompakte Vorschau übersichtlich bleibt.
 */
export const DWARF_PLANETS: PlanetData[] = [
  {
    id: "ceres",
    name: {
      de: "Ceres", en: "Ceres", hi: "सेरेस", zh: "谷神星", ko: "세레스", ja: "ケレス",
      es: "Ceres", fr: "Cérès", tr: "Ceres", ru: "Церера", pt: "Ceres", ar: "سيريس", el: "Δήμητρα",
    },
    distanceAu: 2.77,
    periodDays: 1682,
    diameterKm: 940,
    color: "#a89f92",
    glowColor: "rgba(168,159,146,0.4)",
    kind: "dwarf",
    facts: {
      distance: {
        de: "2,77 AE (≈ 414 Mio. km)", en: "2.77 AU (≈ 414 million km)", hi: "2.77 AU (≈ 414 मिलियन किमी)", zh: "2.77 天文单位（约4.14亿公里）", ko: "2.77 AU (약 4.14억 km)", ja: "2.77 AU（約4.14億km）",
        es: "2,77 UA (≈ 414 millones de km)", fr: "2,77 ua (≈ 414 millions de km)", tr: "2,77 AB (≈ 414 milyon km)", ru: "2,77 а.е. (≈ 414 млн км)", pt: "2,77 UA (≈ 414 milhões de km)", ar: "2.77 و.ف (≈ 414 مليون كم)", el: "2,77 AU (≈ 414 εκατ. χλμ.)",
      },
      period: {
        de: "≈ 4,6 Jahre", en: "≈ 4.6 years", hi: "≈ 4.6 वर्ष", zh: "约4.6年", ko: "약 4.6년", ja: "約4.6年",
        es: "≈ 4,6 años", fr: "≈ 4,6 ans", tr: "≈ 4,6 yıl", ru: "≈ 4,6 года", pt: "≈ 4,6 anos", ar: "≈ 4.6 سنة", el: "≈ 4,6 έτη",
      },
      diameter: {
        de: "940 km", en: "940 km", hi: "940 किमी", zh: "940 公里", ko: "940km", ja: "940km",
        es: "940 km", fr: "940 km", tr: "940 km", ru: "940 км", pt: "940 km", ar: "940 كم", el: "940 χλμ.",
      },
      moons: {
        de: "0", en: "0", hi: "0", zh: "0", ko: "0", ja: "0",
        es: "0", fr: "0", tr: "0", ru: "0", pt: "0", ar: "0", el: "0",
      },
    },
    description: {
      de: "Ceres ist der größte Körper im Asteroidengürtel zwischen Mars und Jupiter und der einzige Zwergplanet im inneren Sonnensystem — sie macht rund ein Drittel der Gesamtmasse des gesamten Gürtels aus. Unter ihrer Oberfläche vermutet man eine Schicht aus Wassereis oder sogar einen flüssigen Ozean, und helle Flecken im Occator-Krater bestehen aus Salzablagerungen. Die Raumsonde Dawn umkreiste Ceres von 2015 bis 2018 und lieferte die bislang detailliertesten Aufnahmen.",
      en: "Ceres is the largest body in the asteroid belt between Mars and Jupiter and the only dwarf planet in the inner Solar System — it accounts for about a third of the belt's total mass. Scientists suspect a layer of water ice beneath its surface, possibly even a liquid ocean, and the bright spots in Occator crater are salt deposits. The Dawn spacecraft orbited Ceres from 2015 to 2018, capturing the most detailed images to date.",
      hi: "सेरेस मंगल और बृहस्पति के बीच क्षुद्रग्रह बेल्ट में सबसे बड़ा पिंड है और आंतरिक सौर मंडल का एकमात्र बौना ग्रह है — यह पूरी बेल्ट के कुल द्रव्यमान का लगभग एक तिहाई हिस्सा है। वैज्ञानिकों को इसकी सतह के नीचे जल-बर्फ की एक परत, संभवतः एक तरल महासागर होने का संदेह है, और ओकेटर क्रेटर के चमकीले धब्बे नमक के जमाव हैं। डॉन अंतरिक्ष यान ने 2015 से 2018 तक सेरेस की परिक्रमा की और अब तक की सबसे विस्तृत तस्वीरें प्रदान कीं।",
      zh: "谷神星是火星与木星之间小行星带中最大的天体，也是内太阳系唯一的矮行星——它约占整个小行星带总质量的三分之一。科学家怀疑其表面下存在一层水冰，甚至可能是液态海洋，而奥克塔陨石坑中的亮斑是盐类沉积物。「黎明号」探测器于2015年至2018年环绕谷神星运行，拍摄了迄今最详细的图像。",
      ko: "세레스는 화성과 목성 사이 소행성대에서 가장 큰 천체이자 내태양계 유일의 왜소행성입니다 — 전체 소행성대 질량의 약 3분의 1을 차지합니다. 과학자들은 표면 아래에 물 얼음층, 어쩌면 액체 바다까지 있을 것으로 추정하며, 옥카토르 크레이터의 밝은 반점은 염분 퇴적물입니다. 돈 탐사선이 2015년부터 2018년까지 세레스를 공전하며 지금까지 가장 상세한 이미지를 촬영했습니다.",
      ja: "ケレスは火星と木星の間の小惑星帯にある最大の天体で、内太陽系唯一の準惑星です — 小惑星帯全体の質量の約3分の1を占めます。表面下には氷の層、あるいは液体の海さえあるのではと考えられており、オッカトルクレーターの明るい斑点は塩の堆積物です。探査機ドーンは2015年から2018年までケレスを周回し、これまでで最も詳細な画像を撮影しました。",
      es: "Ceres es el cuerpo más grande del cinturón de asteroides entre Marte y Júpiter, y el único planeta enano del sistema solar interior; representa aproximadamente un tercio de la masa total del cinturón. Se sospecha que bajo su superficie hay una capa de hielo de agua, posiblemente incluso un océano líquido, y las manchas brillantes del cráter Occator son depósitos de sal. La sonda Dawn orbitó Ceres entre 2015 y 2018, capturando las imágenes más detalladas hasta la fecha.",
      fr: "Cérès est le plus grand corps de la ceinture d'astéroïdes entre Mars et Jupiter, et la seule planète naine du système solaire interne — elle représente environ un tiers de la masse totale de la ceinture. On soupçonne une couche de glace d'eau sous sa surface, voire un océan liquide, et les taches claires du cratère Occator sont des dépôts de sel. La sonde Dawn a orbité autour de Cérès de 2015 à 2018, capturant les images les plus détaillées à ce jour.",
      tr: "Ceres, Mars ile Jüpiter arasındaki asteroid kuşağındaki en büyük cisim ve iç Güneş Sistemi'ndeki tek cüce gezegendir — kuşağın toplam kütlesinin yaklaşık üçte birini oluşturur. Yüzeyinin altında bir su buzu tabakası, hatta sıvı bir okyanus olabileceğinden şüpheleniliyor; Occator kraterindeki parlak lekeler tuz birikintileridir. Dawn uzay aracı 2015'ten 2018'e kadar Ceres'in yörüngesinde dönerek bugüne kadarki en ayrıntılı görüntüleri elde etti.",
      ru: "Церера — крупнейшее тело в поясе астероидов между Марсом и Юпитером и единственная карликовая планета внутренней Солнечной системы — она составляет около трети общей массы пояса. Учёные предполагают наличие слоя водяного льда под её поверхностью, возможно, даже жидкого океана, а яркие пятна в кратере Оккатор — это отложения солей. Зонд Dawn находился на орбите Цереры с 2015 по 2018 год, получив самые детальные снимки на сегодняшний день.",
      pt: "Ceres é o maior corpo do cinturão de asteroides entre Marte e Júpiter e o único planeta anão no sistema solar interior — representa cerca de um terço da massa total do cinturão. Suspeita-se de uma camada de gelo de água sob a sua superfície, possivelmente até um oceano líquido, e as manchas brilhantes na cratera Occator são depósitos de sal. A sonda Dawn orbitou Ceres entre 2015 e 2018, capturando as imagens mais detalhadas até à data.",
      ar: "سيريس هو أكبر جسم في حزام الكويكبات بين المريخ والمشتري، والكوكب القزم الوحيد في المجموعة الشمسية الداخلية — يشكل نحو ثلث الكتلة الإجمالية للحزام. يشتبه العلماء في وجود طبقة من الجليد المائي تحت سطحه، وربما محيط سائل، والبقع اللامعة في فوهة أوكاتور هي رواسب ملحية. دار المسبار داون حول سيريس من 2015 إلى 2018، والتقط أكثر الصور تفصيلاً حتى الآن.",
      el: "Η Δήμητρα είναι το μεγαλύτερο σώμα στη ζώνη αστεροειδών μεταξύ Άρη και Δία και ο μόνος νάνος πλανήτης στο εσωτερικό ηλιακό σύστημα — αντιπροσωπεύει περίπου το ένα τρίτο της συνολικής μάζας της ζώνης. Οι επιστήμονες υποπτεύονται ένα στρώμα πάγου νερού κάτω από την επιφάνειά της, ίσως και έναν υγρό ωκεανό, ενώ οι φωτεινές κηλίδες στον κρατήρα Occator είναι εναποθέσεις αλατιού. Το σκάφος Dawn περιφέρθηκε γύρω από τη Δήμητρα από το 2015 έως το 2018, καταγράφοντας τις πιο λεπτομερείς εικόνες μέχρι σήμερα.",
    },
    image: commonsFile("PIA19562-Ceres-DwarfPlanet-Dawn-RC3-image19-20150506.jpg"),
  },
  {
    id: "pluto",
    name: {
      de: "Pluto", en: "Pluto", hi: "प्लूटो", zh: "冥王星", ko: "명왕성", ja: "冥王星",
      es: "Plutón", fr: "Pluton", tr: "Plüton", ru: "Плутон", pt: "Plutão", ar: "بلوتو", el: "Πλούτωνας",
    },
    distanceAu: 39.48,
    periodDays: 90560,
    diameterKm: 2377,
    color: "#c9b29a",
    glowColor: "rgba(201,178,154,0.4)",
    kind: "dwarf",
    facts: {
      distance: {
        de: "39,48 AE (≈ 5,9 Mrd. km)", en: "39.48 AU (≈ 5.9 billion km)", hi: "39.48 AU (≈ 5.9 अरब किमी)", zh: "39.48 天文单位（约59.0亿公里）", ko: "39.48 AU (약 59.0억 km)", ja: "39.48 AU（約59.0億km）",
        es: "39,48 UA (≈ 5,9 mil millones de km)", fr: "39,48 ua (≈ 5,9 milliards de km)", tr: "39,48 AB (≈ 5,9 milyar km)", ru: "39,48 а.е. (≈ 5,9 млрд км)", pt: "39,48 UA (≈ 5,9 mil milhões de km)", ar: "39.48 و.ف (≈ 5.9 مليار كم)", el: "39,48 AU (≈ 5,9 δισ. χλμ.)",
      },
      period: {
        de: "≈ 248 Jahre", en: "≈ 248 years", hi: "≈ 248 वर्ष", zh: "约248年", ko: "약 248년", ja: "約248年",
        es: "≈ 248 años", fr: "≈ 248 ans", tr: "≈ 248 yıl", ru: "≈ 248 лет", pt: "≈ 248 anos", ar: "≈ 248 سنة", el: "≈ 248 έτη",
      },
      diameter: {
        de: "2.377 km", en: "2,377 km", hi: "2,377 किमी", zh: "2,377 公里", ko: "2,377km", ja: "2,377km",
        es: "2.377 km", fr: "2 377 km", tr: "2.377 km", ru: "2377 км", pt: "2.377 km", ar: "2377 كم", el: "2.377 χλμ.",
      },
      moons: {
        de: "5 (u. a. Charon)", en: "5 (incl. Charon)", hi: "5 (कैरन सहित)", zh: "5（含冥卫一卡戎）", ko: "5개（카론 포함）", ja: "5個（カロンほか）",
        es: "5 (incl. Caronte)", fr: "5 (dont Charon)", tr: "5 (Charon dahil)", ru: "5 (в т.ч. Харон)", pt: "5 (incl. Caronte)", ar: "5 (بما فيها شارون)", el: "5 (μεταξύ αυτών ο Χάρων)",
      },
    },
    description: {
      de: "Pluto galt bis 2006 als neunter Planet und wurde dann als Zwergplanet neu eingestuft, nachdem klar wurde, dass es im Kuipergürtel viele ähnliche Objekte gibt. Sein größter Mond Charon ist halb so groß wie Pluto selbst — beide umkreisen einen gemeinsamen Schwerpunkt außerhalb Plutos, weshalb man sie manchmal als Doppel-Zwergplanet bezeichnet. Die NASA-Sonde New Horizons flog 2015 als bislang einzige Mission an Pluto vorbei und entdeckte u. a. das herzförmige Gletschergebiet Tombaugh Regio.",
      en: "Pluto was considered the ninth planet until 2006, when it was reclassified as a dwarf planet once it became clear the Kuiper Belt holds many similar objects. Its largest moon, Charon, is half Pluto's size — the two orbit a shared centre of gravity outside Pluto itself, which is why they're sometimes called a double dwarf planet. NASA's New Horizons probe flew past Pluto in 2015, the only mission to do so, and discovered the heart-shaped glacial plain Tombaugh Regio, among other features.",
      hi: "2006 तक प्लूटो को नौवां ग्रह माना जाता था, फिर जब यह स्पष्ट हो गया कि क्विपर बेल्ट में कई समान वस्तुएं हैं, तो इसे बौने ग्रह के रूप में पुनर्वर्गीकृत किया गया। इसका सबसे बड़ा चंद्रमा कैरन, प्लूटो के आधे आकार का है — दोनों प्लूटो के बाहर एक साझा गुरुत्वाकर्षण केंद्र की परिक्रमा करते हैं, इसीलिए उन्हें कभी-कभी दोहरा बौना ग्रह कहा जाता है। नासा के न्यू होराइज़न्स यान ने 2015 में प्लूटो के पास से उड़ान भरी — अब तक की एकमात्र मिशन — और दिल के आकार के हिमनद क्षेत्र टॉमबॉ रीजियो की खोज की।",
      zh: "冥王星在2006年之前被视为第九大行星，随后由于人们发现柯伊伯带中有许多类似天体，它被重新归类为矮行星。其最大的卫星卡戎大小约为冥王星的一半——两者围绕位于冥王星之外的共同质心运转，因此有时被称为双矮行星系统。美国宇航局的「新视野号」探测器于2015年飞掠冥王星，这是迄今唯一一次任务，并发现了心形冰川区域「汤博region」等特征。",
      ko: "명왕성은 2006년까지 아홉 번째 행성으로 여겨졌으나, 카이퍼 벨트에 비슷한 천체가 많다는 사실이 밝혀지면서 왜소행성으로 재분류되었습니다. 가장 큰 위성인 카론은 명왕성 크기의 절반으로, 둘은 명왕성 바깥의 공통 질량 중심을 공전하기 때문에 때때로 '이중 왜소행성'이라 불립니다. NASA의 뉴호라이즌스 탐사선은 2015년 명왕성을 근접 비행한 유일한 임무로, 하트 모양의 빙하 지역인 톰보 레지오 등을 발견했습니다.",
      ja: "冥王星は2006年まで第9惑星とされていましたが、カイパーベルトに似た天体が多数あることが判明し、準惑星に再分類されました。最大の衛星カロンは冥王星の半分の大きさで、両者は冥王星の外側にある共通重心を周回しており、そのため「二重準惑星」と呼ばれることもあります。NASAのニューホライズンズ探査機は2015年、唯一のミッションとして冥王星をフライバイし、ハート形の氷河地域トンボー地域などを発見しました。",
      es: "Plutón fue considerado el noveno planeta hasta 2006, cuando fue reclasificado como planeta enano tras confirmarse que el cinturón de Kuiper alberga muchos objetos similares. Su luna más grande, Caronte, tiene la mitad del tamaño de Plutón; ambos orbitan un centro de gravedad compartido fuera de Plutón, por lo que a veces se les llama planeta enano doble. La sonda New Horizons de la NASA sobrevoló Plutón en 2015, la única misión en hacerlo, y descubrió la llanura glacial en forma de corazón Tombaugh Regio, entre otros rasgos.",
      fr: "Pluton était considérée comme la neuvième planète jusqu'en 2006, date à laquelle elle a été reclassée comme planète naine après qu'il est devenu clair que la ceinture de Kuiper abrite de nombreux objets similaires. Sa plus grande lune, Charon, fait la moitié de la taille de Pluton ; les deux orbitent autour d'un centre de gravité commun situé hors de Pluton, d'où leur surnom occasionnel de planète naine double. La sonde New Horizons de la NASA a survolé Pluton en 2015, seule mission à l'avoir fait, découvrant notamment la plaine glaciaire en forme de cœur Tombaugh Regio.",
      tr: "Plüton, 2006 yılına kadar dokuzuncu gezegen olarak kabul ediliyordu; Kuiper Kuşağı'nda birçok benzer cismin bulunduğu anlaşılınca cüce gezegen olarak yeniden sınıflandırıldı. En büyük uydusu Charon, Plüton'un yarısı büyüklüğündedir — ikisi Plüton'un dışında ortak bir ağırlık merkezi etrafında döner, bu yüzden bazen çift cüce gezegen olarak anılırlar. NASA'nın New Horizons sondası 2015'te Plüton'un yanından geçen tek görev oldu ve kalp şeklindeki buzul bölgesi Tombaugh Regio'yu keşfetti.",
      ru: "Плутон считался девятой планетой до 2006 года, когда его переклассифицировали в карликовую планету после того, как выяснилось, что в поясе Койпера есть много похожих объектов. Его крупнейший спутник Харон вдвое меньше самого Плутона — оба вращаются вокруг общего центра масс за пределами Плутона, поэтому их иногда называют двойной карликовой планетой. Зонд NASA New Horizons пролетел мимо Плутона в 2015 году — единственная подобная миссия — и обнаружил, среди прочего, сердцевидную ледниковую равнину Томбо.",
      pt: "Plutão foi considerado o nono planeta até 2006, quando foi reclassificado como planeta anão depois de ficar claro que a Cintura de Kuiper contém muitos objetos semelhantes. A sua maior lua, Caronte, tem metade do tamanho de Plutão — ambos orbitam um centro de gravidade partilhado fora de Plutão, razão pela qual às vezes são chamados de planeta anão duplo. A sonda New Horizons da NASA passou por Plutão em 2015, a única missão a fazê-lo, e descobriu a planície glacial em forma de coração Tombaugh Regio, entre outras características.",
      ar: "كان بلوتو يُعتبر الكوكب التاسع حتى عام 2006، عندما أُعيد تصنيفه ككوكب قزم بعد أن اتضح أن حزام كايبر يحتوي على أجسام مشابهة كثيرة. أكبر أقماره، شارون، يبلغ نصف حجم بلوتو — يدوران حول مركز ثقل مشترك خارج بلوتو نفسه، ولهذا يُطلق عليهما أحيانًا الكوكب القزم المزدوج. حلّق مسبار نيو هورايزونز التابع لناسا بجانب بلوتو عام 2015، وهي المهمة الوحيدة حتى الآن، واكتشف من بين ما اكتشفه السهل الجليدي على شكل قلب المسمى تومبو ريجيو.",
      el: "Ο Πλούτωνας θεωρούνταν ο ένατος πλανήτης μέχρι το 2006, όταν αναταξινομήθηκε ως νάνος πλανήτης όταν έγινε σαφές ότι η Ζώνη Κάιπερ φιλοξενεί πολλά παρόμοια αντικείμενα. Ο μεγαλύτερος δορυφόρος του, ο Χάρων, έχει το μισό μέγεθος του Πλούτωνα — και οι δύο περιφέρονται γύρω από κοινό κέντρο βάρους εκτός του Πλούτωνα, γι' αυτό μερικές φορές αποκαλούνται διπλός νάνος πλανήτης. Το σκάφος New Horizons της NASA πέταξε δίπλα από τον Πλούτωνα το 2015, η μοναδική αποστολή που το έκανε, και ανακάλυψε μεταξύ άλλων την καρδιόσχημη παγετώδη πεδιάδα Tombaugh Regio.",
    },
    image: commonsFile("Pluto_in_True_Color_-_High-Res.jpg"),
  },
  {
    id: "haumea",
    name: {
      de: "Haumea", en: "Haumea", hi: "हौमेआ", zh: "妊神星", ko: "하우메아", ja: "ハウメア",
      es: "Haumea", fr: "Hauméa", tr: "Haumea", ru: "Хаумеа", pt: "Haumeia", ar: "هاوميا", el: "Χαουμέα",
    },
    distanceAu: 43.13,
    periodDays: 103800,
    diameterKm: 1600,
    color: "#d8e6ea",
    glowColor: "rgba(216,230,234,0.4)",
    kind: "dwarf",
    facts: {
      distance: {
        de: "43,1 AE (≈ 6,5 Mrd. km)", en: "43.1 AU (≈ 6.5 billion km)", hi: "43.1 AU (≈ 6.5 अरब किमी)", zh: "43.1 天文单位（约65.0亿公里）", ko: "43.1 AU (약 65.0억 km)", ja: "43.1 AU（約65.0億km）",
        es: "43,1 UA (≈ 6,5 mil millones de km)", fr: "43,1 ua (≈ 6,5 milliards de km)", tr: "43,1 AB (≈ 6,5 milyar km)", ru: "43,1 а.е. (≈ 6,5 млрд км)", pt: "43,1 UA (≈ 6,5 mil milhões de km)", ar: "43.1 و.ف (≈ 6.5 مليار كم)", el: "43,1 AU (≈ 6,5 δισ. χλμ.)",
      },
      period: {
        de: "≈ 284 Jahre", en: "≈ 284 years", hi: "≈ 284 वर्ष", zh: "约284年", ko: "약 284년", ja: "約284年",
        es: "≈ 284 años", fr: "≈ 284 ans", tr: "≈ 284 yıl", ru: "≈ 284 года", pt: "≈ 284 anos", ar: "≈ 284 سنة", el: "≈ 284 έτη",
      },
      diameter: {
        de: "≈ 1.600 km", en: "≈ 1,600 km", hi: "≈ 1,600 किमी", zh: "约1,600公里", ko: "약 1,600km", ja: "約1,600km",
        es: "≈ 1.600 km", fr: "≈ 1 600 km", tr: "≈ 1.600 km", ru: "≈ 1600 км", pt: "≈ 1.600 km", ar: "≈ 1600 كم", el: "≈ 1.600 χλμ.",
      },
      moons: {
        de: "2", en: "2", hi: "2", zh: "2", ko: "2", ja: "2",
        es: "2", fr: "2", tr: "2", ru: "2", pt: "2", ar: "2", el: "2",
      },
    },
    description: {
      de: "Haumea rotiert so schnell (in nur 4 Stunden), dass sie zu einer stark abgeflachten, eiförmigen Form verzerrt ist — einzigartig unter den bekannten Zwergplaneten. Sie besitzt zwei kleine Monde (Hiʻiaka und Namaka) sowie ein dünnes Ringsystem, das 2017 entdeckt wurde — der erste bekannte Ring um ein Objekt jenseits des Neptun. Vermutlich entstand ihre ungewöhnliche Form durch eine gewaltige Kollision in der Frühzeit des Sonnensystems.",
      en: "Haumea spins so fast (once every 4 hours) that it's distorted into a strongly flattened, egg-like shape — unique among known dwarf planets. It has two small moons (Hiʻiaka and Namaka) and a thin ring system discovered in 2017, the first known ring around a trans-Neptunian object. Its unusual shape likely resulted from a massive collision early in the Solar System's history.",
      hi: "हौमेआ इतनी तेज़ी से घूमती है (केवल 4 घंटे में एक बार) कि यह एक अत्यधिक चपटे, अंडाकार रूप में विकृत हो गई है — ज्ञात बौने ग्रहों में अद्वितीय। इसके दो छोटे चंद्रमा (हियाका और नमाका) हैं, साथ ही 2017 में खोजा गया एक पतला वलय तंत्र — नेप्च्यून से परे किसी वस्तु के चारों ओर पहला ज्ञात वलय। इसका असामान्य आकार संभवतः सौर मंडल के आरंभिक काल में हुई एक विशाल टक्कर से उत्पन्न हुआ।",
      zh: "妊神星自转极快（仅需4小时一周），因此被拉伸成高度扁平的蛋形——在已知矮行星中独一无二。它拥有两颗小卫星（希亚卡和娜玛卡），以及2017年发现的一个稀薄光环系统——这是首个在海王星轨道外天体周围发现的光环。其不寻常的形状很可能源于太阳系早期的一次剧烈碰撞。",
      ko: "하우메아는 매우 빠르게 자전하여(4시간마다 한 바퀴) 심하게 납작한 계란 모양으로 변형되었습니다 — 알려진 왜소행성 중 유일합니다. 두 개의 작은 위성(히이아카와 나마카)과 2017년 발견된 얇은 고리계를 가지고 있으며, 이는 해왕성 바깥 천체 주위에서 발견된 최초의 고리입니다. 이 독특한 형태는 태양계 초기의 거대한 충돌로 생긴 것으로 추정됩니다.",
      ja: "ハウメアは非常に速く自転する（わずか4時間で1周）ため、強く扁平な卵形に歪んでいます — 既知の準惑星の中で唯一です。2つの小さな衛星（ヒイアカとナマカ）と、2017年に発見された薄い環系を持ち、これは海王星以遠天体の周りで発見された初の環です。その珍しい形は、太陽系初期の巨大衝突によるものと考えられています。",
      es: "Haumea gira tan rápido (una vez cada 4 horas) que está distorsionada en una forma fuertemente aplanada y ovoide, única entre los planetas enanos conocidos. Tiene dos pequeñas lunas (Hiʻiaka y Namaka) y un delgado sistema de anillos descubierto en 2017, el primer anillo conocido alrededor de un objeto transneptuniano. Su forma inusual probablemente se debió a una colisión masiva en los primeros tiempos del sistema solar.",
      fr: "Hauméa tourne si vite (une fois toutes les 4 heures) qu'elle est déformée en une forme ovoïde fortement aplatie, unique parmi les planètes naines connues. Elle possède deux petites lunes (Hiʻiaka et Namaka) ainsi qu'un fin système d'anneaux découvert en 2017, le premier anneau connu autour d'un objet transneptunien. Sa forme inhabituelle résulte probablement d'une collision massive aux débuts du système solaire.",
      tr: "Haumea o kadar hızlı döner (her 4 saatte bir) ki güçlü şekilde basıklaşmış, yumurta benzeri bir şekle bürünmüştür — bilinen cüce gezegenler arasında benzersizdir. İki küçük uydusu (Hiʻiaka ve Namaka) ve 2017'de keşfedilen ince bir halka sistemi vardır; bu, Neptün ötesi bir cismin etrafında bilinen ilk halkadır. Olağandışı şekli muhtemelen Güneş Sistemi'nin erken döneminde yaşanan devasa bir çarpışmadan kaynaklanmıştır.",
      ru: "Хаумеа вращается настолько быстро (один оборот каждые 4 часа), что искажена в сильно сплюснутую, яйцевидную форму — уникальную среди известных карликовых планет. У неё два маленьких спутника (Хииака и Намака) и тонкая система колец, обнаруженная в 2017 году — первое известное кольцо вокруг транснептунового объекта. Её необычная форма, вероятно, стала результатом мощного столкновения на заре Солнечной системы.",
      pt: "Haumeia gira tão rapidamente (uma vez a cada 4 horas) que está distorcida numa forma fortemente achatada, semelhante a um ovo — única entre os planetas anões conhecidos. Tem duas pequenas luas (Hiʻiaka e Namaka) e um fino sistema de anéis descoberto em 2017, o primeiro anel conhecido ao redor de um objeto transnetuniano. A sua forma incomum resultou provavelmente de uma colisão massiva no início da história do sistema solar.",
      ar: "تدور هاوميا بسرعة كبيرة (مرة كل 4 ساعات) لدرجة أنها تشوهت إلى شكل بيضاوي مسطح بشدة — فريد بين الكواكب القزمة المعروفة. لديها قمران صغيران (هيʻياكا وناماكا) ونظام حلقي رفيع اكتُشف عام 2017، وهو أول حلقة معروفة حول جسم يقع خلف نبتون. من المرجح أن شكلها غير المعتاد نتج عن اصطدام هائل في بدايات المجموعة الشمسية.",
      el: "Η Χαουμέα περιστρέφεται τόσο γρήγορα (μία φορά κάθε 4 ώρες) που παραμορφώνεται σε ένα έντονα πεπλατυσμένο, αυγοειδές σχήμα — μοναδικό μεταξύ των γνωστών νάνων πλανητών. Έχει δύο μικρούς δορυφόρους (Hiʻiaka και Namaka) και ένα λεπτό σύστημα δακτυλίων που ανακαλύφθηκε το 2017, ο πρώτος γνωστός δακτύλιος γύρω από ένα διανεπτούνιο αντικείμενο. Το ασυνήθιστο σχήμα της προήλθε πιθανώς από μια τεράστια σύγκρουση στα πρώτα χρόνια του ηλιακού συστήματος.",
    },
    image: commonsFile("Haumea_Hubble.png"),
  },
  {
    id: "makemake",
    name: {
      de: "Makemake", en: "Makemake", hi: "मेकमेक", zh: "鸟神星", ko: "마케마케", ja: "マケマケ",
      es: "Makemake", fr: "Makémaké", tr: "Makemake", ru: "Макемаке", pt: "Makemake", ar: "ماكيماكي", el: "Μακεμάκε",
    },
    distanceAu: 45.79,
    periodDays: 111000,
    diameterKm: 1430,
    color: "#b56b4a",
    glowColor: "rgba(181,107,74,0.4)",
    kind: "dwarf",
    facts: {
      distance: {
        de: "45,8 AE (≈ 6,9 Mrd. km)", en: "45.8 AU (≈ 6.9 billion km)", hi: "45.8 AU (≈ 6.9 अरब किमी)", zh: "45.8 天文单位（约69.0亿公里）", ko: "45.8 AU (약 69.0억 km)", ja: "45.8 AU（約69.0億km）",
        es: "45,8 UA (≈ 6,9 mil millones de km)", fr: "45,8 ua (≈ 6,9 milliards de km)", tr: "45,8 AB (≈ 6,9 milyar km)", ru: "45,8 а.е. (≈ 6,9 млрд км)", pt: "45,8 UA (≈ 6,9 mil milhões de km)", ar: "45.8 و.ف (≈ 6.9 مليار كم)", el: "45,8 AU (≈ 6,9 δισ. χλμ.)",
      },
      period: {
        de: "≈ 305 Jahre", en: "≈ 305 years", hi: "≈ 305 वर्ष", zh: "约305年", ko: "약 305년", ja: "約305年",
        es: "≈ 305 años", fr: "≈ 305 ans", tr: "≈ 305 yıl", ru: "≈ 305 лет", pt: "≈ 305 anos", ar: "≈ 305 سنة", el: "≈ 305 έτη",
      },
      diameter: {
        de: "≈ 1.430 km", en: "≈ 1,430 km", hi: "≈ 1,430 किमी", zh: "约1,430公里", ko: "약 1,430km", ja: "約1,430km",
        es: "≈ 1.430 km", fr: "≈ 1 430 km", tr: "≈ 1.430 km", ru: "≈ 1430 км", pt: "≈ 1.430 km", ar: "≈ 1430 كم", el: "≈ 1.430 χλμ.",
      },
      moons: {
        de: "1", en: "1", hi: "1", zh: "1", ko: "1", ja: "1",
        es: "1", fr: "1", tr: "1", ru: "1", pt: "1", ar: "1", el: "1",
      },
    },
    description: {
      de: "Makemake ist nach dem Schöpfergott der Rapa Nui (Osterinsel) benannt und einer der größten bekannten Kuipergürtel-Objekte nach Pluto. Seine sehr helle, rötliche Oberfläche besteht vermutlich aus gefrorenem Methan und Ethan — ähnlich wie bei Pluto. Erst 2016 entdeckte das Hubble-Weltraumteleskop seinen einzigen bekannten Mond, inoffiziell 'MK 2' genannt.",
      en: "Makemake is named after the creator deity of the Rapa Nui (Easter Island) and is one of the largest known Kuiper Belt objects after Pluto. Its very bright, reddish surface is likely made of frozen methane and ethane, similar to Pluto. Its only known moon, informally nicknamed 'MK 2', wasn't discovered until 2016 by the Hubble Space Telescope.",
      hi: "मेकमेक का नाम रापा नुई (ईस्टर द्वीप) के सृष्टिकर्ता देवता के नाम पर रखा गया है और यह प्लूटो के बाद ज्ञात सबसे बड़े क्विपर बेल्ट पिंडों में से एक है। इसकी बहुत चमकीली, लालिमायुक्त सतह संभवतः जमे हुए मीथेन और एथेन से बनी है — प्लूटो के समान। हबल स्पेस टेलीस्कोप ने 2016 में ही इसके एकमात्र ज्ञात चंद्रमा की खोज की, जिसे अनौपचारिक रूप से 'MK 2' कहा जाता है।",
      zh: "鸟神星以拉帕努伊岛（复活节岛）的创世神命名，是冥王星之后已知最大的柯伊伯带天体之一。其明亮的红色表面很可能由冻结的甲烷和乙烷组成，与冥王星相似。直到2016年，哈勃太空望远镜才发现它唯一已知的卫星，非正式昵称为「MK 2」。",
      ko: "마케마케는 라파누이(이스터섬)의 창조신의 이름을 따서 명명되었으며, 명왕성 다음으로 알려진 가장 큰 카이퍼 벨트 천체 중 하나입니다. 매우 밝고 붉은 표면은 명왕성과 마찬가지로 얼어붙은 메탄과 에탄으로 이루어진 것으로 추정됩니다. 2016년이 되어서야 허블 우주망원경이 비공식적으로 'MK 2'라 불리는 유일하게 알려진 위성을 발견했습니다.",
      ja: "マケマケはラパ・ヌイ（イースター島）の創造神にちなんで命名され、冥王星に次いで知られる最大級のカイパーベルト天体の一つです。その非常に明るい赤みを帯びた表面は、冥王星と同様に凍ったメタンとエタンでできていると考えられています。唯一知られている衛星（非公式に「MK 2」と呼ばれる）は2016年になってようやくハッブル宇宙望遠鏡によって発見されました。",
      es: "Makemake recibe su nombre de la deidad creadora de los rapanui (Isla de Pascua) y es uno de los mayores objetos conocidos del cinturón de Kuiper después de Plutón. Su superficie muy brillante y rojiza probablemente está hecha de metano y etano congelados, similar a Plutón. Su única luna conocida, apodada informalmente 'MK 2', no se descubrió hasta 2016 con el telescopio espacial Hubble.",
      fr: "Makémaké tire son nom de la divinité créatrice des Rapa Nui (île de Pâques) et est l'un des plus grands objets connus de la ceinture de Kuiper après Pluton. Sa surface très brillante et rougeâtre est probablement composée de méthane et d'éthane gelés, comme sur Pluton. Son unique lune connue, surnommée officieusement 'MK 2', n'a été découverte qu'en 2016 par le télescope spatial Hubble.",
      tr: "Makemake, Rapa Nui'nin (Paskalya Adası) yaratıcı tanrısının adını taşır ve Plüton'dan sonra bilinen en büyük Kuiper Kuşağı cisimlerinden biridir. Çok parlak, kızılımsı yüzeyi muhtemelen Plüton'a benzer şekilde donmuş metan ve etandan oluşur. Resmi olmayan adıyla 'MK 2' olarak bilinen tek uydusu ancak 2016'da Hubble Uzay Teleskobu tarafından keşfedildi.",
      ru: "Макемаке назван в честь бога-творца народа рапануи (остров Пасхи) и является одним из крупнейших известных объектов пояса Койпера после Плутона. Его очень яркая, красноватая поверхность, вероятно, состоит из замёрзшего метана и этана — как у Плутона. Его единственный известный спутник, неофициально названный «MK 2», был обнаружен телескопом «Хаббл» только в 2016 году.",
      pt: "Makemake tem o nome da divindade criadora dos Rapa Nui (Ilha de Páscoa) e é um dos maiores objetos conhecidos da Cintura de Kuiper depois de Plutão. A sua superfície muito brilhante e avermelhada é provavelmente feita de metano e etano congelados, semelhante a Plutão. A sua única lua conhecida, apelidada informalmente de 'MK 2', só foi descoberta em 2016 pelo Telescópio Espacial Hubble.",
      ar: "سُمّي ماكيماكي على اسم إله الخلق لدى شعب رابا نوي (جزيرة إيستر)، وهو أحد أكبر أجسام حزام كايبر المعروفة بعد بلوتو. سطحه اللامع جدًا والمائل إلى الحمرة يتكون على الأرجح من الميثان والإيثان المتجمدين، مشابهًا لبلوتو. لم يُكتشف قمره الوحيد المعروف، الملقب بشكل غير رسمي 'MK 2'، إلا عام 2016 بواسطة تلسكوب هابل الفضائي.",
      el: "Ο Μακεμάκε πήρε το όνομά του από τη θεότητα-δημιουργό των Ραπανουί (Νήσος του Πάσχα) και είναι ένα από τα μεγαλύτερα γνωστά αντικείμενα της Ζώνης Κάιπερ μετά τον Πλούτωνα. Η πολύ φωτεινή, κοκκινωπή επιφάνειά του αποτελείται πιθανώς από παγωμένο μεθάνιο και αιθάνιο, όπως και ο Πλούτωνας. Ο μοναδικός γνωστός δορυφόρος του, ανεπίσημα ονομαζόμενος «MK 2», ανακαλύφθηκε μόλις το 2016 από το Διαστημικό Τηλεσκόπιο Hubble.",
    },
    image: commonsFile("Makemake_and_its_moon.jpg"),
  },
  {
    id: "eris",
    name: {
      de: "Eris", en: "Eris", hi: "एरिस", zh: "阋神星", ko: "에리스", ja: "エリス",
      es: "Eris", fr: "Éris", tr: "Eris", ru: "Эрида", pt: "Éris", ar: "إريس", el: "Έρις",
    },
    distanceAu: 67.78,
    periodDays: 203830,
    diameterKm: 2326,
    color: "#d9d9d9",
    glowColor: "rgba(217,217,217,0.4)",
    kind: "dwarf",
    facts: {
      distance: {
        de: "67,8 AE (≈ 10,1 Mrd. km)", en: "67.8 AU (≈ 10.1 billion km)", hi: "67.8 AU (≈ 10.1 अरब किमी)", zh: "67.8 天文单位（约101.0亿公里）", ko: "67.8 AU (약 101.0억 km)", ja: "67.8 AU（約101.0億km）",
        es: "67,8 UA (≈ 10,1 mil millones de km)", fr: "67,8 ua (≈ 10,1 milliards de km)", tr: "67,8 AB (≈ 10,1 milyar km)", ru: "67,8 а.е. (≈ 10,1 млрд км)", pt: "67,8 UA (≈ 10,1 mil milhões de km)", ar: "67.8 و.ف (≈ 10.1 مليار كم)", el: "67,8 AU (≈ 10,1 δισ. χλμ.)",
      },
      period: {
        de: "≈ 558 Jahre", en: "≈ 558 years", hi: "≈ 558 वर्ष", zh: "约558年", ko: "약 558년", ja: "約558年",
        es: "≈ 558 años", fr: "≈ 558 ans", tr: "≈ 558 yıl", ru: "≈ 558 лет", pt: "≈ 558 anos", ar: "≈ 558 سنة", el: "≈ 558 έτη",
      },
      diameter: {
        de: "2.326 km", en: "2,326 km", hi: "2,326 किमी", zh: "2,326 公里", ko: "2,326km", ja: "2,326km",
        es: "2.326 km", fr: "2 326 km", tr: "2.326 km", ru: "2326 км", pt: "2.326 km", ar: "2326 كم", el: "2.326 χλμ.",
      },
      moons: {
        de: "1 (Dysnomia)", en: "1 (Dysnomia)", hi: "1 (डिस्नोमिया)", zh: "1（阋卫一）", ko: "1개（디스노미아）", ja: "1個（ディスノミア）",
        es: "1 (Disnomia)", fr: "1 (Dysnomie)", tr: "1 (Dysnomia)", ru: "1 (Дисномия)", pt: "1 (Disnómia)", ar: "1 (ديسنوميا)", el: "1 (Δυσνομία)",
      },
    },
    description: {
      de: "Eris ist fast so groß wie Pluto, aber deutlich massereicher, und war 2005 der Auslöser für die Debatte, die zur Neudefinition von 'Planet' und Plutos Herabstufung führte. Ihr Name stammt von der griechischen Göttin der Zwietracht — passend zu der Kontroverse, die sie auslöste. Eris liegt auf einer stark elliptischen, geneigten Umlaufbahn und war zum Entdeckungszeitpunkt eines der am weitesten entfernten je beobachteten Objekte im Sonnensystem.",
      en: "Eris is nearly as large as Pluto but considerably more massive, and its discovery in 2005 sparked the debate that led to the redefinition of 'planet' and Pluto's demotion. Its name comes from the Greek goddess of strife and discord — fitting for the controversy it caused. Eris follows a strongly elliptical, tilted orbit and was, at the time of its discovery, one of the most distant objects ever observed in the Solar System.",
      hi: "एरिस लगभग प्लूटो जितनी बड़ी है लेकिन काफी अधिक द्रव्यमान वाली है, और 2005 में इसकी खोज ने उस बहस को जन्म दिया जिसने 'ग्रह' की पुनर्परिभाषा और प्लूटो की पदावनति का कारण बना। इसका नाम कलह और विवाद की ग्रीक देवी से आया है — उस विवाद के अनुरूप जो इसने उत्पन्न किया। एरिस एक अत्यधिक अंडाकार, झुकी हुई कक्षा का अनुसरण करती है और अपनी खोज के समय सौर मंडल में देखी गई सबसे दूर की वस्तुओं में से एक थी।",
      zh: "阋神星几乎与冥王星一样大，但质量明显更大，其2005年的发现引发了关于重新定义「行星」以及冥王星降级的争论。它的名字来自希腊纷争与不和女神——恰如其分地对应了它引发的争议。阋神星沿着高度椭圆、倾斜的轨道运行，在被发现时是太阳系中观测到的最遥远天体之一。",
      ko: "에리스는 명왕성과 거의 비슷한 크기지만 훨씬 더 무거우며, 2005년 발견은 '행성'의 재정의와 명왕성의 강등으로 이어진 논쟁을 촉발했습니다. 이름은 불화와 다툼의 그리스 여신에서 유래했는데, 이는 에리스가 일으킨 논란에 어울립니다. 에리스는 매우 타원형이고 기울어진 궤도를 따라 돌며, 발견 당시 태양계에서 관측된 가장 먼 천체 중 하나였습니다.",
      ja: "エリスは冥王星とほぼ同じ大きさですが、はるかに質量が大きく、2005年の発見が「惑星」の再定義と冥王星の降格につながった議論の引き金となりました。その名はギリシャの不和と争いの女神に由来し、それが引き起こした論争にふさわしいものです。エリスは強く楕円形で傾いた軌道をたどり、発見当時は太陽系で観測された中で最も遠い天体の一つでした。",
      es: "Eris es casi tan grande como Plutón, pero considerablemente más masiva, y su descubrimiento en 2005 desencadenó el debate que llevó a la redefinición de 'planeta' y a la degradación de Plutón. Su nombre proviene de la diosa griega de la discordia, apropiado para la controversia que provocó. Eris sigue una órbita muy elíptica e inclinada, y en el momento de su descubrimiento fue uno de los objetos más lejanos jamás observados en el sistema solar.",
      fr: "Éris est presque aussi grande que Pluton, mais bien plus massive, et sa découverte en 2005 a déclenché le débat qui a conduit à la redéfinition du mot 'planète' et à la rétrogradation de Pluton. Son nom vient de la déesse grecque de la discorde, à l'image de la controverse qu'elle a suscitée. Éris suit une orbite fortement elliptique et inclinée et était, au moment de sa découverte, l'un des objets les plus lointains jamais observés dans le système solaire.",
      tr: "Eris, Plüton'a neredeyse eşit büyüklükte ama çok daha ağırdır ve 2005'teki keşfi, 'gezegen' tanımının yeniden yapılmasına ve Plüton'un statüsünün düşürülmesine yol açan tartışmayı başlattı. Adını, neden olduğu tartışmaya uygun şekilde Yunan çekişme ve nifak tanrıçasından alır. Eris, güçlü elips biçimli, eğik bir yörünge izler ve keşfedildiği dönemde Güneş Sistemi'nde gözlemlenen en uzak nesnelerden biriydi.",
      ru: "Эрида почти так же велика, как Плутон, но значительно массивнее, и её открытие в 2005 году вызвало дискуссию, которая привела к переопределению понятия «планета» и понижению статуса Плутона. Её имя происходит от греческой богини раздора — подходящее для вызванной ею полемики. Эрида движется по сильно вытянутой, наклонённой орбите и на момент открытия была одним из самых удалённых когда-либо наблюдавшихся объектов Солнечной системы.",
      pt: "Éris é quase tão grande quanto Plutão, mas consideravelmente mais massiva, e a sua descoberta em 2005 desencadeou o debate que levou à redefinição de 'planeta' e ao rebaixamento de Plutão. O seu nome vem da deusa grega da discórdia — adequado para a controvérsia que causou. Éris segue uma órbita fortemente elíptica e inclinada e era, na altura da sua descoberta, um dos objetos mais distantes já observados no sistema solar.",
      ar: "إريس تقارب حجم بلوتو لكنها أكثر كتلة بكثير، وأثار اكتشافها عام 2005 النقاش الذي أدى إلى إعادة تعريف 'الكوكب' وخفض مرتبة بلوتو. يأتي اسمها من إلهة الخلاف والنزاع الإغريقية — بما يناسب الجدل الذي أثارته. يتبع إريس مدارًا إهليلجيًا شديد الميل، وكان وقت اكتشافه أحد أبعد الأجسام التي رُصدت في المجموعة الشمسية.",
      el: "Η Έρις είναι σχεδόν τόσο μεγάλη όσο ο Πλούτωνας, αλλά σημαντικά πιο μαζική, και η ανακάλυψή της το 2005 πυροδότησε τη συζήτηση που οδήγησε στον επαναπροσδιορισμό του «πλανήτη» και στον υποβιβασμό του Πλούτωνα. Το όνομά της προέρχεται από την ελληνική θεά της έριδας — ταιριαστό για την αντιπαράθεση που προκάλεσε. Η Έρις ακολουθεί μια έντονα ελλειπτική, κεκλιμένη τροχιά και ήταν, τη στιγμή της ανακάλυψής της, ένα από τα πιο απομακρυσμένα αντικείμενα που παρατηρήθηκαν ποτέ στο ηλιακό σύστημα.",
    },
    image: commonsFile("Eris_and_dysnomia2.jpg"),
  },
];

/**
 * Voyager 1 — kein Himmelskörper, sondern eine Raumsonde, die das
 * Sonnensystem verlässt (Nutzerwunsch: "adde mal voyager 1 abstand auch").
 * Feste Position, kein Orbit. Die Entfernung wächst real ständig weiter
 * (~3,6 AE/Jahr) — hier ein näherungsweiser Stand für 2026, nicht live
 * nachverfolgt.
 */
export const VOYAGER1: PlanetData = {
  id: "voyager1",
  name: {
    de: "Voyager 1", en: "Voyager 1", hi: "वॉयजर 1", zh: "旅行者1号", ko: "보이저 1호", ja: "ボイジャー1号",
    es: "Voyager 1", fr: "Voyager 1", tr: "Voyager 1", ru: "Вояджер-1", pt: "Voyager 1", ar: "فوييجر 1", el: "Voyager 1",
  },
  distanceAu: 167,
  periodDays: 0,
  diameterKm: 5,
  color: "#f2f2f0",
  glowColor: "rgba(242,242,240,0.5)",
  kind: "probe",
  factLabels: [
    {
      de: "Entfernung (ca., Stand 2026)", en: "Distance (approx., 2026)", hi: "दूरी (लगभग, 2026)", zh: "距离（约，2026年）", ko: "거리 (약, 2026년 기준)", ja: "距離（概算、2026年時点）",
      es: "Distancia (aprox., 2026)", fr: "Distance (env., 2026)", tr: "Mesafe (yakl., 2026)", ru: "Расстояние (прибл., 2026)", pt: "Distância (aprox., 2026)", ar: "المسافة (تقريبًا، 2026)", el: "Απόσταση (περίπου, 2026)",
    },
    {
      de: "Gestartet", en: "Launched", hi: "प्रक्षेपण", zh: "发射日期", ko: "발사일", ja: "打ち上げ",
      es: "Lanzamiento", fr: "Lancement", tr: "Fırlatma", ru: "Запуск", pt: "Lançamento", ar: "الإطلاق", el: "Εκτόξευση",
    },
    {
      de: "Antennendurchmesser", en: "Antenna diameter", hi: "एंटीना व्यास", zh: "天线直径", ko: "안테나 지름", ja: "アンテナ直径",
      es: "Diámetro de antena", fr: "Diamètre de l'antenne", tr: "Anten çapı", ru: "Диаметр антенны", pt: "Diâmetro da antena", ar: "قطر الهوائي", el: "Διάμετρος κεραίας",
    },
    {
      de: "Geschwindigkeit", en: "Speed", hi: "गति", zh: "速度", ko: "속도", ja: "速度",
      es: "Velocidad", fr: "Vitesse", tr: "Hız", ru: "Скорость", pt: "Velocidade", ar: "السرعة", el: "Ταχύτητα",
    },
  ],
  facts: {
    distance: {
      de: "≈ 167 AE (≈ 25 Mrd. km)", en: "≈ 167 AU (≈ 25 billion km)", hi: "≈ 167 AU (≈ 25 अरब किमी)", zh: "约167天文单位（约250亿公里）", ko: "약 167 AU (약 250억 km)", ja: "約167 AU（約250億km）",
      es: "≈ 167 UA (≈ 25 mil millones de km)", fr: "≈ 167 ua (≈ 25 milliards de km)", tr: "≈ 167 AB (≈ 25 milyar km)", ru: "≈ 167 а.е. (≈ 25 млрд км)", pt: "≈ 167 UA (≈ 25 mil milhões de km)", ar: "≈ 167 و.ف (≈ 25 مليار كم)", el: "≈ 167 AU (≈ 25 δισ. χλμ.)",
    },
    period: {
      de: "5. September 1977", en: "September 5, 1977", hi: "5 सितंबर 1977", zh: "1977年9月5日", ko: "1977년 9월 5일", ja: "1977年9月5日",
      es: "5 de septiembre de 1977", fr: "5 septembre 1977", tr: "5 Eylül 1977", ru: "5 сентября 1977", pt: "5 de setembro de 1977", ar: "5 سبتمبر 1977", el: "5 Σεπτεμβρίου 1977",
    },
    diameter: {
      de: "3,7 m (Antenne)", en: "3.7 m (antenna)", hi: "3.7 मी (एंटीना)", zh: "3.7米（天线）", ko: "3.7m（안테나）", ja: "3.7m（アンテナ）",
      es: "3,7 m (antena)", fr: "3,7 m (antenne)", tr: "3,7 m (anten)", ru: "3,7 м (антенна)", pt: "3,7 m (antena)", ar: "3.7 م (الهوائي)", el: "3,7 μ. (κεραία)",
    },
    moons: {
      de: "≈ 17 km/s relativ zur Sonne", en: "≈ 17 km/s relative to the Sun", hi: "सूर्य के सापेक्ष ≈ 17 किमी/सेकंड", zh: "相对太阳约17公里/秒", ko: "태양 기준 약 17km/s", ja: "太陽に対して約17km/秒",
      es: "≈ 17 km/s respecto al Sol", fr: "≈ 17 km/s par rapport au Soleil", tr: "Güneş'e göre ≈ 17 km/sn", ru: "≈ 17 км/с относительно Солнца", pt: "≈ 17 km/s em relação ao Sol", ar: "≈ 17 كم/ث بالنسبة للشمس", el: "≈ 17 χλμ./δευτ. ως προς τον Ήλιο",
    },
  },
  image: commonsFile("Voyager.jpg"),
  description: {
    de: "Voyager 1 ist das am weitesten von der Erde entfernte von Menschen gebaute Objekt. Seit dem 25. August 2012 befindet sie sich im interstellaren Raum, außerhalb der Heliosphäre der Sonne — als erste Sonde überhaupt. An Bord befindet sich die 'Golden Record', eine vergoldete Schallplatte mit Klängen, Musik und Grüßen der Erde für den Fall, dass die Sonde eines Tages von außerirdischer Intelligenz gefunden wird. Ihre drei Radioisotopengeneratoren liefern noch genug Strom, um einige Instrumente bis etwa 2025–2030 zu betreiben; danach wird die Sonde stumm weiterfliegen. Ein Funksignal braucht inzwischen über 23 Stunden für die einfache Strecke zur Erde. Die Position hier ist ein Näherungswert — die Sonde entfernt sich stetig weiter (~3,6 AE pro Jahr).",
    en: "Voyager 1 is the most distant human-made object from Earth. Since August 25, 2012, it has been in interstellar space, beyond the Sun's heliosphere — the first probe ever to get there. Onboard is the 'Golden Record', a gold-plated phonograph record carrying sounds, music and greetings from Earth, in case the probe is ever found by extraterrestrial intelligence. Its three radioisotope generators still supply enough power to run some instruments until roughly 2025–2030, after which the probe will fly on in silence. A radio signal now takes over 23 hours for the one-way trip to Earth. The position shown here is approximate — the probe keeps moving farther away (~3.6 AU per year).",
    hi: "वॉयजर 1 पृथ्वी से सबसे दूर स्थित मानव निर्मित वस्तु है। 25 अगस्त 2012 से यह इंटरस्टेलर स्पेस में है, सूर्य के हेलियोस्फियर से बाहर — ऐसा करने वाला पहला यान। इसमें 'गोल्डन रिकॉर्ड' है, एक सुनहरी ग्रामोफोन रिकॉर्ड जिसमें पृथ्वी की ध्वनियाँ, संगीत और अभिवादन हैं, यदि यह कभी किसी बाह्यग्रही बुद्धिमत्ता द्वारा पाया जाए। इसके तीन रेडियोआइसोटोप जनरेटर अभी भी लगभग 2025–2030 तक कुछ उपकरणों को चलाने के लिए पर्याप्त बिजली प्रदान करते हैं, उसके बाद यान चुपचाप उड़ता रहेगा। एक रेडियो संकेत को अब पृथ्वी तक एकतरफा यात्रा में 23 घंटे से अधिक समय लगता है। यहाँ दिखाई गई स्थिति अनुमानित है — यान लगातार और दूर जा रहा है (लगभग 3.6 AU प्रति वर्ष)।",
    zh: "旅行者1号是距离地球最远的人造物体。自2012年8月25日起，它已进入星际空间，超出太阳的日球层——是首个抵达此处的探测器。它携带着「金唱片」，一张镀金的唱片，记录了地球的声音、音乐和问候，以备有朝一日被外星智慧发现。其三个放射性同位素发电机仍能提供足够电力运行部分仪器至2025至2030年左右，此后探测器将默默继续飞行。如今，无线电信号单程传到地球需要超过23小时。这里显示的位置为近似值——探测器仍在持续远离（每年约3.6天文单位）。",
    ko: "보이저 1호는 지구에서 가장 멀리 떨어진 인간이 만든 물체입니다. 2012년 8월 25일부터 태양의 태양권 밖 성간 공간에 있으며 — 그곳에 도달한 최초의 탐사선입니다. 탑재된 '골든 레코드'는 금도금된 음반으로, 지구의 소리, 음악, 인사말을 담고 있어 언젠가 외계 지적 생명체가 발견할 경우를 대비합니다. 세 개의 방사성 동위원소 발전기는 대략 2025~2030년까지 일부 기기를 작동시킬 만큼의 전력을 공급하며, 이후 탐사선은 조용히 계속 비행합니다. 현재 전파 신호가 지구까지 편도로 가는 데 23시간 이상 걸립니다. 여기 표시된 위치는 근사치이며 — 탐사선은 매년 약 3.6 AU씩 계속 멀어지고 있습니다.",
    ja: "ボイジャー1号は地球から最も遠くにある人工物です。2012年8月25日以来、太陽のヘリオスフィアを超えた恒星間空間に存在しており — そこに到達した初の探査機です。搭載されている「ゴールデンレコード」は金メッキされたレコードで、地球の音や音楽、挨拶を収録しており、いつか地球外知的生命体に発見された場合に備えています。3基の放射性同位体発電機は2025〜2030年頃まで一部の機器を稼働させるだけの電力を供給し続け、その後探査機は静かに飛行を続けます。電波信号が地球まで片道で届くのに現在23時間以上かかります。ここに示す位置は概算です — 探査機は年間約3.6 AUずつ遠ざかり続けています。",
    es: "Voyager 1 es el objeto artificial más alejado de la Tierra. Desde el 25 de agosto de 2012 se encuentra en el espacio interestelar, más allá de la heliosfera del Sol, la primera sonda en lograrlo. A bordo lleva el 'Disco de Oro', un disco fonográfico bañado en oro con sonidos, música y saludos de la Tierra, por si algún día es hallada por una inteligencia extraterrestre. Sus tres generadores de radioisótopos todavía suministran energía suficiente para algunos instrumentos hasta aproximadamente 2025-2030, tras lo cual la sonda seguirá volando en silencio. Una señal de radio tarda ahora más de 23 horas en llegar a la Tierra en un solo sentido. La posición aquí mostrada es aproximada: la sonda sigue alejándose (~3,6 UA por año).",
    fr: "Voyager 1 est l'objet fabriqué par l'homme le plus éloigné de la Terre. Depuis le 25 août 2012, elle se trouve dans l'espace interstellaire, au-delà de l'héliosphère du Soleil — la première sonde à y parvenir. Elle transporte le 'Disque d'or', un disque phonographique plaqué or contenant des sons, de la musique et des salutations de la Terre, au cas où la sonde serait un jour découverte par une intelligence extraterrestre. Ses trois générateurs à radioisotopes fournissent encore assez d'énergie pour alimenter certains instruments jusqu'à environ 2025-2030, après quoi la sonde continuera de voler en silence. Un signal radio met désormais plus de 23 heures pour atteindre la Terre en aller simple. La position indiquée ici est approximative — la sonde continue de s'éloigner (~3,6 ua par an).",
    tr: "Voyager 1, Dünya'dan en uzak insan yapımı nesnedir. 25 Ağustos 2012'den beri, Güneş'in helyosferinin ötesinde yıldızlararası uzaydadır — bunu başaran ilk sondadır. İçinde, bir gün dünya dışı zeka tarafından bulunması ihtimaline karşı Dünya'nın seslerini, müziklerini ve selamlarını taşıyan altın kaplama bir plak olan 'Altın Plak' bulunur. Üç radyoizotop jeneratörü, yaklaşık 2025-2030'a kadar bazı cihazları çalıştıracak kadar enerji sağlamaya devam ediyor; bundan sonra sonda sessizce uçmaya devam edecek. Bir radyo sinyalinin Dünya'ya tek yönlü ulaşması artık 23 saatten fazla sürüyor. Buradaki konum yaklaşık bir değerdir — sonda sürekli uzaklaşmaya devam ediyor (yılda ~3,6 AB).",
    ru: "Вояджер-1 — самый удалённый от Земли объект, созданный человеком. С 25 августа 2012 года он находится в межзвёздном пространстве, за пределами гелиосферы Солнца — первый зонд, достигший этого. На борту находится «Золотая пластинка» — позолоченная грампластинка со звуками, музыкой и приветствиями Земли на случай, если зонд однажды найдёт внеземной разум. Три радиоизотопных генератора всё ещё обеспечивают достаточно энергии для работы некоторых приборов примерно до 2025–2030 годов, после чего зонд будет лететь молча. Радиосигналу теперь требуется более 23 часов, чтобы преодолеть путь до Земли в одну сторону. Указанное здесь положение приблизительное — зонд продолжает удаляться (~3,6 а.е. в год).",
    pt: "A Voyager 1 é o objeto feito pelo homem mais distante da Terra. Desde 25 de agosto de 2012, encontra-se no espaço interestelar, além da heliosfera do Sol — a primeira sonda a chegar lá. A bordo está o 'Disco de Ouro', um disco fonográfico banhado a ouro com sons, música e saudações da Terra, caso a sonda seja um dia encontrada por uma inteligência extraterrestre. Os seus três geradores de radioisótopos ainda fornecem energia suficiente para alimentar alguns instrumentos até cerca de 2025-2030, após o que a sonda continuará a voar em silêncio. Um sinal de rádio demora agora mais de 23 horas para chegar à Terra numa só direção. A posição aqui apresentada é aproximada — a sonda continua a afastar-se (~3,6 UA por ano).",
    ar: "فوييجر 1 هو أبعد جسم من صنع الإنسان عن الأرض. منذ 25 أغسطس 2012، يقع في الفضاء بين النجمي، خارج الغلاف الشمسي — أول مسبار يصل إلى هناك. يحمل على متنه 'السجل الذهبي'، وهو أسطوانة مذهبة تحمل أصواتًا وموسيقى وتحيات من الأرض، تحسبًا لأن يُعثر عليه يومًا ما من قبل ذكاء خارج كوكب الأرض. لا تزال مولداته النظائرية المشعة الثلاثة توفر طاقة كافية لتشغيل بعض الأجهزة حتى حوالي 2025-2030، وبعد ذلك سيواصل المسبار طيرانه صامتًا. تستغرق الإشارة اللاسلكية الآن أكثر من 23 ساعة للوصول إلى الأرض في اتجاه واحد. الموضع الموضح هنا تقريبي — يستمر المسبار في الابتعاد (نحو 3.6 و.ف سنويًا).",
    el: "Το Voyager 1 είναι το πιο απομακρυσμένο ανθρωπογενές αντικείμενο από τη Γη. Από τις 25 Αυγούστου 2012, βρίσκεται στο διαστρικό διάστημα, πέρα από την ηλιόσφαιρα του Ήλιου — το πρώτο σκάφος που το κατάφερε. Στο εσωτερικό του φέρει τον «Χρυσό Δίσκο», έναν επιχρυσωμένο δίσκο γραμμοφώνου με ήχους, μουσική και χαιρετισμούς από τη Γη, σε περίπτωση που το σκάφος βρεθεί κάποτε από εξωγήινη νοημοσύνη. Οι τρεις ραδιοϊσοτοπικές γεννήτριές του παρέχουν ακόμη αρκετή ενέργεια για τη λειτουργία ορισμένων οργάνων έως περίπου το 2025-2030, μετά το οποίο το σκάφος θα συνεχίσει να πετά σιωπηλά. Ένα ραδιοσήμα χρειάζεται πλέον πάνω από 23 ώρες για τη μονόδρομη διαδρομή προς τη Γη. Η θέση που εμφανίζεται εδώ είναι κατά προσέγγιση — το σκάφος συνεχίζει να απομακρύνεται (~3,6 AU ετησίως).",
  },
};

/**
 * Die Sonne selbst — anklickbar für ein Info-Panel mit echtem Foto
 * (Nutzerwunsch 20.09.2026: "mehr infos mit echten bildern bei planeten
 * und sonne").
 */
export const SUN: PlanetData = {
  id: "sun",
  name: {
    de: "Sonne", en: "Sun", hi: "सूर्य", zh: "太阳", ko: "태양", ja: "太陽",
    es: "Sol", fr: "Soleil", tr: "Güneş", ru: "Солнце", pt: "Sol", ar: "الشمس", el: "Ήλιος",
  },
  distanceAu: 0,
  periodDays: 0,
  diameterKm: 1391000,
  color: "#ffcf6b",
  glowColor: "rgba(255,196,110,0.6)",
  kind: "star",
  factLabels: [
    {
      de: "Abstand zur Erde", en: "Distance from Earth", hi: "पृथ्वी से दूरी", zh: "与地球的距离", ko: "지구까지 거리", ja: "地球からの距離",
      es: "Distancia a la Tierra", fr: "Distance à la Terre", tr: "Dünya'ya uzaklık", ru: "Расстояние до Земли", pt: "Distância à Terra", ar: "المسافة من الأرض", el: "Απόσταση από τη Γη",
    },
    {
      de: "Rotationsdauer (Äquator)", en: "Rotation period (equator)", hi: "घूर्णन अवधि (भूमध्य रेखा)", zh: "自转周期（赤道）", ko: "자전 주기（적도）", ja: "自転周期（赤道）",
      es: "Período de rotación (ecuador)", fr: "Période de rotation (équateur)", tr: "Dönüş süresi (ekvator)", ru: "Период вращения (экватор)", pt: "Período de rotação (equador)", ar: "فترة الدوران (خط الاستواء)", el: "Περίοδος περιστροφής (ισημερινός)",
    },
    {
      de: "Durchmesser", en: "Diameter", hi: "व्यास", zh: "直径", ko: "지름", ja: "直径",
      es: "Diámetro", fr: "Diamètre", tr: "Çap", ru: "Диаметр", pt: "Diâmetro", ar: "القطر", el: "Διάμετρος",
    },
    {
      de: "Oberflächentemperatur", en: "Surface temperature", hi: "सतह का तापमान", zh: "表面温度", ko: "표면 온도", ja: "表面温度",
      es: "Temperatura superficial", fr: "Température de surface", tr: "Yüzey sıcaklığı", ru: "Температура поверхности", pt: "Temperatura da superfície", ar: "درجة حرارة السطح", el: "Θερμοκρασία επιφάνειας",
    },
  ],
  facts: {
    distance: {
      de: "≈ 149,6 Mio. km (1 AE)", en: "≈ 149.6 million km (1 AU)", hi: "≈ 149.6 मिलियन किमी (1 AU)", zh: "约1.496亿公里（1天文单位）", ko: "약 1억 4,960만 km (1 AU)", ja: "約1億4,960万km（1 AU）",
      es: "≈ 149,6 millones de km (1 UA)", fr: "≈ 149,6 millions de km (1 ua)", tr: "≈ 149,6 milyon km (1 AB)", ru: "≈ 149,6 млн км (1 а.е.)", pt: "≈ 149,6 milhões de km (1 UA)", ar: "≈ 149.6 مليون كم (1 و.ف)", el: "≈ 149,6 εκατ. χλμ. (1 AU)",
    },
    period: {
      de: "≈ 27 Tage", en: "≈ 27 days", hi: "≈ 27 दिन", zh: "约27天", ko: "약 27일", ja: "約27日",
      es: "≈ 27 días", fr: "≈ 27 jours", tr: "≈ 27 gün", ru: "≈ 27 дней", pt: "≈ 27 dias", ar: "≈ 27 يومًا", el: "≈ 27 ημέρες",
    },
    diameter: {
      de: "≈ 1,39 Mio. km", en: "≈ 1.39 million km", hi: "≈ 1.39 मिलियन किमी", zh: "约139.0万公里", ko: "약 139.0만 km", ja: "約139.0万km",
      es: "≈ 1,39 millones de km", fr: "≈ 1,39 million de km", tr: "≈ 1,39 milyon km", ru: "≈ 1,39 млн км", pt: "≈ 1,39 milhões de km", ar: "≈ 1.39 مليون كم", el: "≈ 1,39 εκατ. χλμ.",
    },
    moons: {
      de: "≈ 5.500 °C", en: "≈ 5,500°C", hi: "≈ 5,500°C", zh: "约5,500°C", ko: "약 5,500°C", ja: "約5,500°C",
      es: "≈ 5.500 °C", fr: "≈ 5 500 °C", tr: "≈ 5.500 °C", ru: "≈ 5500 °C", pt: "≈ 5.500 °C", ar: "≈ 5500 درجة مئوية", el: "≈ 5.500 °C",
    },
  },
  image: commonsFile(
    "The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA's_Solar_Dynamics_Observatory_-_20100819.jpg"
  ),
  description: {
    de: "Die Sonne enthält rund 99,86 % der gesamten Masse des Sonnensystems. In ihrem Kern wandelt Kernfusion bei etwa 15 Millionen °C Wasserstoff in Helium um — die Energiequelle für alles Leben auf der Erde.",
    en: "The Sun contains about 99.86% of the Solar System's total mass. In its core, nuclear fusion at around 15 million °C converts hydrogen into helium — the energy source for all life on Earth.",
    hi: "सूर्य सौर मंडल के कुल द्रव्यमान का लगभग 99.86% धारण करता है। इसके क्रोड में लगभग 15 मिलियन °C पर परमाणु संलयन हाइड्रोजन को हीलियम में बदलता है — पृथ्वी पर सभी जीवन के लिए ऊर्जा का स्रोत।",
    zh: "太阳包含太阳系总质量的约99.86%。在其核心，约1500万°C的核聚变将氢转化为氦——这是地球上所有生命的能量来源。",
    ko: "태양은 태양계 전체 질량의 약 99.86%를 차지합니다. 중심핵에서는 약 1,500만°C의 핵융합 반응으로 수소가 헬륨으로 변환되며, 이는 지구의 모든 생명체에게 에너지원이 됩니다.",
    ja: "太陽は太陽系全質量の約99.86%を占めます。その中心核では約1,500万°Cで核融合が起こり、水素をヘリウムに変換しています — これが地球上のすべての生命のエネルギー源です。",
    es: "El Sol contiene aproximadamente el 99,86 % de la masa total del sistema solar. En su núcleo, la fusión nuclear a unos 15 millones de °C convierte el hidrógeno en helio, la fuente de energía de toda la vida en la Tierra.",
    fr: "Le Soleil contient environ 99,86 % de la masse totale du système solaire. Dans son noyau, la fusion nucléaire à environ 15 millions de °C convertit l'hydrogène en hélium — la source d'énergie de toute vie sur Terre.",
    tr: "Güneş, Güneş Sistemi'nin toplam kütlesinin yaklaşık %99,86'sını oluşturur. Çekirdeğinde, yaklaşık 15 milyon °C'de gerçekleşen nükleer füzyon hidrojeni helyuma dönüştürür — Dünya'daki tüm yaşamın enerji kaynağıdır.",
    ru: "Солнце содержит около 99,86% всей массы Солнечной системы. В его ядре при температуре около 15 миллионов °C термоядерный синтез превращает водород в гелий — источник энергии для всей жизни на Земле.",
    pt: "O Sol contém cerca de 99,86% da massa total do sistema solar. No seu núcleo, a fusão nuclear a cerca de 15 milhões de °C converte hidrogénio em hélio — a fonte de energia para toda a vida na Terra.",
    ar: "تحتوي الشمس على نحو 99.86% من إجمالي كتلة المجموعة الشمسية. في نواتها، يحوّل الاندماج النووي عند حوالي 15 مليون درجة مئوية الهيدروجين إلى هيليوم — مصدر الطاقة لكل حياة على الأرض.",
    el: "Ο Ήλιος περιέχει περίπου το 99,86% της συνολικής μάζας του ηλιακού συστήματος. Στον πυρήνα του, η πυρηνική σύντηξη στους περίπου 15 εκατομμύρια °C μετατρέπει το υδρογόνο σε ήλιο — η πηγή ενέργειας για κάθε ζωή στη Γη.",
  },
};

export const ALL_BODIES: PlanetData[] = [...PLANETS, ...DWARF_PLANETS, VOYAGER1];
