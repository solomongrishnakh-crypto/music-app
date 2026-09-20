import type { LocalizedText } from "@/lib/i18n";

/**
 * Nutzerwunsch 20.09.2026: "erstelle so ein box mit solarsystem oben ...
 * realistische bewegungen von planeten. alle planeten sollen enthalten
 * sein ... sehr realistische umlaufbahnen und abstände" — echte
 * astronomische Werte (AU, Tage, km), keine erfundenen Zahlen. Für die
 * Darstellung werden Abstände/Größen skaliert (siehe SolarSystem.tsx),
 * die REIHENFOLGE und relativen Verhältnisse bleiben aber echt.
 *
 * Nutzerwunsch 20.09.2026 (dritte Runde): "alles soll auf anderen sprache
 * sein also jedes text und details" — Name, Fakten und Beschreibung sind
 * jetzt LocalizedText (Deutsch + Englisch vollständig; weitere Sprachen
 * fallen bis zur Übersetzung auf Englisch zurück, siehe lib/i18n.ts).
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
    name: { de: "Merkur", en: "Mercury" },
    distanceAu: 0.387,
    periodDays: 88,
    diameterKm: 4879,
    color: "#b8ada0",
    glowColor: "rgba(184,173,160,0.5)",
    facts: {
      distance: { de: "0,39 AE (≈ 58 Mio. km)", en: "0.39 AU (≈ 58 million km)" },
      period: { de: "88 Tage", en: "88 days" },
      diameter: { de: "4.879 km", en: "4,879 km" },
      moons: { de: "0", en: "0" },
    },
    description: {
      de: "Merkur ist der sonnennächste und kleinste Planet. Ohne nennenswerte Atmosphäre schwanken die Temperaturen extrem — bis zu 430 °C tagsüber, bis zu −180 °C nachts.",
      en: "Mercury is the closest planet to the Sun and the smallest. With almost no atmosphere, temperatures swing wildly — up to 430°C during the day and down to −180°C at night.",
    },
    image: commonsFile("Mercury_in_color_-_Prockter07-edit1.jpg"),
  },
  {
    id: "venus",
    name: { de: "Venus", en: "Venus" },
    distanceAu: 0.723,
    periodDays: 224.7,
    diameterKm: 12104,
    color: "#e8c98a",
    glowColor: "rgba(232,201,138,0.5)",
    facts: {
      distance: { de: "0,72 AE (≈ 108 Mio. km)", en: "0.72 AU (≈ 108 million km)" },
      period: { de: "225 Tage", en: "225 days" },
      diameter: { de: "12.104 km", en: "12,104 km" },
      moons: { de: "0", en: "0" },
    },
    description: {
      de: "Venus ist durch ihre extrem dichte CO₂-Atmosphäre und den daraus resultierenden Treibhauseffekt der heißeste Planet im Sonnensystem — heißer als Merkur, trotz größerer Sonnenentfernung.",
      en: "Venus, with its extremely dense CO₂ atmosphere and resulting greenhouse effect, is the hottest planet in the Solar System — hotter than Mercury despite being farther from the Sun.",
    },
    image: commonsFile("Venus-real_color.jpg"),
  },
  {
    id: "earth",
    name: { de: "Erde", en: "Earth" },
    distanceAu: 1,
    periodDays: 365.25,
    diameterKm: 12742,
    color: "#4f8fd6",
    glowColor: "rgba(79,143,214,0.55)",
    facts: {
      distance: { de: "1 AE (≈ 150 Mio. km)", en: "1 AU (≈ 150 million km)" },
      period: { de: "365,25 Tage", en: "365.25 days" },
      diameter: { de: "12.742 km", en: "12,742 km" },
      moons: { de: "1 (Mond)", en: "1 (the Moon)" },
    },
    description: {
      de: "Unser Heimatplanet — der einzige bekannte Ort im Universum mit bestätigtem Leben. Flüssiges Wasser an der Oberfläche und eine schützende Atmosphäre machen das möglich.",
      en: "Our home planet — the only known place in the universe with confirmed life. Liquid water on the surface and a protective atmosphere make it possible.",
    },
    image: commonsFile("The_Blue_Marble_(remastered).jpg"),
  },
  {
    id: "mars",
    name: { de: "Mars", en: "Mars" },
    distanceAu: 1.524,
    periodDays: 687,
    diameterKm: 6779,
    color: "#c1543a",
    glowColor: "rgba(193,84,58,0.5)",
    facts: {
      distance: { de: "1,52 AE (≈ 228 Mio. km)", en: "1.52 AU (≈ 228 million km)" },
      period: { de: "687 Tage", en: "687 days" },
      diameter: { de: "6.779 km", en: "6,779 km" },
      moons: { de: "2 (Phobos, Deimos)", en: "2 (Phobos, Deimos)" },
    },
    description: {
      de: "Der 'Rote Planet' verdankt seine Farbe eisenoxidhaltigem Staub. Er beherbergt den größten bekannten Vulkan des Sonnensystems, Olympus Mons, und ist Ziel zukünftiger bemannter Missionen.",
      en: "The 'Red Planet' owes its colour to iron-oxide dust. It hosts the largest known volcano in the Solar System, Olympus Mons, and is a target for future crewed missions.",
    },
    image: commonsFile("OSIRIS_Mars_true_color.jpg"),
  },
  {
    id: "jupiter",
    name: { de: "Jupiter", en: "Jupiter" },
    distanceAu: 5.204,
    periodDays: 4333,
    diameterKm: 139820,
    color: "#d9b28c",
    glowColor: "rgba(217,178,140,0.5)",
    facts: {
      distance: { de: "5,20 AE (≈ 778 Mio. km)", en: "5.20 AU (≈ 778 million km)" },
      period: { de: "≈ 11,86 Jahre", en: "≈ 11.86 years" },
      diameter: { de: "139.820 km", en: "139,820 km" },
      moons: { de: "95 bekannte", en: "95 known" },
    },
    description: {
      de: "Jupiter ist der größte Planet — mehr als doppelt so massereich wie alle anderen Planeten zusammen. Der Große Rote Fleck ist ein Sturm, größer als die Erde, der seit Jahrhunderten wütet.",
      en: "Jupiter is the largest planet — more than twice as massive as all other planets combined. The Great Red Spot is a storm larger than Earth that has raged for centuries.",
    },
    image: commonsFile("Jupiter_by_Cassini-Huygens.jpg"),
  },
  {
    id: "saturn",
    name: { de: "Saturn", en: "Saturn" },
    distanceAu: 9.583,
    periodDays: 10759,
    diameterKm: 116460,
    color: "#e3d1a3",
    glowColor: "rgba(227,209,163,0.5)",
    hasRings: true,
    facts: {
      distance: { de: "9,58 AE (≈ 1,43 Mrd. km)", en: "9.58 AU (≈ 1.43 billion km)" },
      period: { de: "≈ 29,4 Jahre", en: "≈ 29.4 years" },
      diameter: { de: "116.460 km", en: "116,460 km" },
      moons: { de: "146 bekannte", en: "146 known" },
    },
    description: {
      de: "Saturn ist berühmt für sein ausgedehntes, spektakuläres Ringsystem aus Eis- und Gesteinspartikeln. Mit der geringsten Dichte aller Planeten würde er theoretisch auf Wasser schwimmen.",
      en: "Saturn is famous for its vast, spectacular ring system made of ice and rock particles. With the lowest density of any planet, it would theoretically float on water.",
    },
    image: commonsFile("Saturn_during_Equinox.jpg"),
  },
  {
    id: "uranus",
    name: { de: "Uranus", en: "Uranus" },
    distanceAu: 19.2,
    periodDays: 30687,
    diameterKm: 50724,
    color: "#9fd6d6",
    glowColor: "rgba(159,214,214,0.5)",
    facts: {
      distance: { de: "19,2 AE (≈ 2,87 Mrd. km)", en: "19.2 AU (≈ 2.87 billion km)" },
      period: { de: "≈ 84 Jahre", en: "≈ 84 years" },
      diameter: { de: "50.724 km", en: "50,724 km" },
      moons: { de: "28 bekannte", en: "28 known" },
    },
    description: {
      de: "Uranus rotiert extrem geneigt — praktisch 'auf der Seite liegend' mit ~98° Achsneigung, vermutlich Folge einer gewaltigen Kollision in der Frühzeit des Sonnensystems.",
      en: "Uranus rotates at an extreme tilt — essentially 'lying on its side' with an axial tilt of ~98°, likely the result of a massive collision early in the Solar System's history.",
    },
    image: commonsFile("Uranus2.jpg"),
  },
  {
    id: "neptune",
    name: { de: "Neptun", en: "Neptune" },
    distanceAu: 30.05,
    periodDays: 60190,
    diameterKm: 49244,
    color: "#5470d6",
    glowColor: "rgba(84,112,214,0.55)",
    facts: {
      distance: { de: "30,05 AE (≈ 4,50 Mrd. km)", en: "30.05 AU (≈ 4.50 billion km)" },
      period: { de: "≈ 165 Jahre", en: "≈ 165 years" },
      diameter: { de: "49.244 km", en: "49,244 km" },
      moons: { de: "16 bekannte", en: "16 known" },
    },
    description: {
      de: "Neptun ist der äußerste bekannte Planet und hat mit bis zu 2.100 km/h die stärksten gemessenen Winde im Sonnensystem. Seit seiner Entdeckung 1846 hat er noch keine volle Umrundung der Sonne vollendet.",
      en: "Neptune is the outermost known planet and has the strongest measured winds in the Solar System, reaching up to 2,100 km/h. Since its discovery in 1846 it has not yet completed a full orbit of the Sun.",
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
    name: { de: "Ceres", en: "Ceres" },
    distanceAu: 2.77,
    periodDays: 1682,
    diameterKm: 940,
    color: "#a89f92",
    glowColor: "rgba(168,159,146,0.4)",
    kind: "dwarf",
    facts: {
      distance: { de: "2,77 AE (≈ 414 Mio. km)", en: "2.77 AU (≈ 414 million km)" },
      period: { de: "≈ 4,6 Jahre", en: "≈ 4.6 years" },
      diameter: { de: "940 km", en: "940 km" },
      moons: { de: "0", en: "0" },
    },
    description: {
      de: "Ceres ist der größte Körper im Asteroidengürtel zwischen Mars und Jupiter und der einzige Zwergplanet im inneren Sonnensystem — sie macht rund ein Drittel der Gesamtmasse des gesamten Gürtels aus. Unter ihrer Oberfläche vermutet man eine Schicht aus Wassereis oder sogar einen flüssigen Ozean, und helle Flecken im Occator-Krater bestehen aus Salzablagerungen. Die Raumsonde Dawn umkreiste Ceres von 2015 bis 2018 und lieferte die bislang detailliertesten Aufnahmen.",
      en: "Ceres is the largest body in the asteroid belt between Mars and Jupiter and the only dwarf planet in the inner Solar System — it accounts for about a third of the belt's total mass. Scientists suspect a layer of water ice beneath its surface, possibly even a liquid ocean, and the bright spots in Occator crater are salt deposits. The Dawn spacecraft orbited Ceres from 2015 to 2018, capturing the most detailed images to date.",
    },
    image: commonsFile("PIA19562-Ceres-DwarfPlanet-Dawn-RC3-image19-20150506.jpg"),
  },
  {
    id: "pluto",
    name: { de: "Pluto", en: "Pluto" },
    distanceAu: 39.48,
    periodDays: 90560,
    diameterKm: 2377,
    color: "#c9b29a",
    glowColor: "rgba(201,178,154,0.4)",
    kind: "dwarf",
    facts: {
      distance: { de: "39,48 AE (≈ 5,9 Mrd. km)", en: "39.48 AU (≈ 5.9 billion km)" },
      period: { de: "≈ 248 Jahre", en: "≈ 248 years" },
      diameter: { de: "2.377 km", en: "2,377 km" },
      moons: { de: "5 (u. a. Charon)", en: "5 (incl. Charon)" },
    },
    description: {
      de: "Pluto galt bis 2006 als neunter Planet und wurde dann als Zwergplanet neu eingestuft, nachdem klar wurde, dass es im Kuipergürtel viele ähnliche Objekte gibt. Sein größter Mond Charon ist halb so groß wie Pluto selbst — beide umkreisen einen gemeinsamen Schwerpunkt außerhalb Plutos, weshalb man sie manchmal als Doppel-Zwergplanet bezeichnet. Die NASA-Sonde New Horizons flog 2015 als bislang einzige Mission an Pluto vorbei und entdeckte u. a. das herzförmige Gletschergebiet Tombaugh Regio.",
      en: "Pluto was considered the ninth planet until 2006, when it was reclassified as a dwarf planet once it became clear the Kuiper Belt holds many similar objects. Its largest moon, Charon, is half Pluto's size — the two orbit a shared centre of gravity outside Pluto itself, which is why they're sometimes called a double dwarf planet. NASA's New Horizons probe flew past Pluto in 2015, the only mission to do so, and discovered the heart-shaped glacial plain Tombaugh Regio, among other features.",
    },
    image: commonsFile("Pluto_in_True_Color_-_High-Res.jpg"),
  },
  {
    id: "haumea",
    name: { de: "Haumea", en: "Haumea" },
    distanceAu: 43.13,
    periodDays: 103800,
    diameterKm: 1600,
    color: "#d8e6ea",
    glowColor: "rgba(216,230,234,0.4)",
    kind: "dwarf",
    facts: {
      distance: { de: "43,1 AE (≈ 6,5 Mrd. km)", en: "43.1 AU (≈ 6.5 billion km)" },
      period: { de: "≈ 284 Jahre", en: "≈ 284 years" },
      diameter: { de: "≈ 1.600 km", en: "≈ 1,600 km" },
      moons: { de: "2", en: "2" },
    },
    description: {
      de: "Haumea rotiert so schnell (in nur 4 Stunden), dass sie zu einer stark abgeflachten, eiförmigen Form verzerrt ist — einzigartig unter den bekannten Zwergplaneten. Sie besitzt zwei kleine Monde (Hiʻiaka und Namaka) sowie ein dünnes Ringsystem, das 2017 entdeckt wurde — der erste bekannte Ring um ein Objekt jenseits des Neptun. Vermutlich entstand ihre ungewöhnliche Form durch eine gewaltige Kollision in der Frühzeit des Sonnensystems.",
      en: "Haumea spins so fast (once every 4 hours) that it's distorted into a strongly flattened, egg-like shape — unique among known dwarf planets. It has two small moons (Hiʻiaka and Namaka) and a thin ring system discovered in 2017, the first known ring around a trans-Neptunian object. Its unusual shape likely resulted from a massive collision early in the Solar System's history.",
    },
    image: commonsFile("Haumea_Hubble.png"),
  },
  {
    id: "makemake",
    name: { de: "Makemake", en: "Makemake" },
    distanceAu: 45.79,
    periodDays: 111000,
    diameterKm: 1430,
    color: "#b56b4a",
    glowColor: "rgba(181,107,74,0.4)",
    kind: "dwarf",
    facts: {
      distance: { de: "45,8 AE (≈ 6,9 Mrd. km)", en: "45.8 AU (≈ 6.9 billion km)" },
      period: { de: "≈ 305 Jahre", en: "≈ 305 years" },
      diameter: { de: "≈ 1.430 km", en: "≈ 1,430 km" },
      moons: { de: "1", en: "1" },
    },
    description: {
      de: "Makemake ist nach dem Schöpfergott der Rapa Nui (Osterinsel) benannt und einer der größten bekannten Kuipergürtel-Objekte nach Pluto. Seine sehr helle, rötliche Oberfläche besteht vermutlich aus gefrorenem Methan und Ethan — ähnlich wie bei Pluto. Erst 2016 entdeckte das Hubble-Weltraumteleskop seinen einzigen bekannten Mond, inoffiziell 'MK 2' genannt.",
      en: "Makemake is named after the creator deity of the Rapa Nui (Easter Island) and is one of the largest known Kuiper Belt objects after Pluto. Its very bright, reddish surface is likely made of frozen methane and ethane, similar to Pluto. Its only known moon, informally nicknamed 'MK 2', wasn't discovered until 2016 by the Hubble Space Telescope.",
    },
    image: commonsFile("Makemake_and_its_moon.jpg"),
  },
  {
    id: "eris",
    name: { de: "Eris", en: "Eris" },
    distanceAu: 67.78,
    periodDays: 203830,
    diameterKm: 2326,
    color: "#d9d9d9",
    glowColor: "rgba(217,217,217,0.4)",
    kind: "dwarf",
    facts: {
      distance: { de: "67,8 AE (≈ 10,1 Mrd. km)", en: "67.8 AU (≈ 10.1 billion km)" },
      period: { de: "≈ 558 Jahre", en: "≈ 558 years" },
      diameter: { de: "2.326 km", en: "2,326 km" },
      moons: { de: "1 (Dysnomia)", en: "1 (Dysnomia)" },
    },
    description: {
      de: "Eris ist fast so groß wie Pluto, aber deutlich massereicher, und war 2005 der Auslöser für die Debatte, die zur Neudefinition von 'Planet' und Plutos Herabstufung führte. Ihr Name stammt von der griechischen Göttin der Zwietracht — passend zu der Kontroverse, die sie auslöste. Eris liegt auf einer stark elliptischen, geneigten Umlaufbahn und war zum Entdeckungszeitpunkt eines der am weitesten entfernten je beobachteten Objekte im Sonnensystem.",
      en: "Eris is nearly as large as Pluto but considerably more massive, and its discovery in 2005 sparked the debate that led to the redefinition of 'planet' and Pluto's demotion. Its name comes from the Greek goddess of strife and discord — fitting for the controversy it caused. Eris follows a strongly elliptical, tilted orbit and was, at the time of its discovery, one of the most distant objects ever observed in the Solar System.",
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
  name: { de: "Voyager 1", en: "Voyager 1" },
  distanceAu: 167,
  periodDays: 0,
  diameterKm: 5,
  color: "#f2f2f0",
  glowColor: "rgba(242,242,240,0.5)",
  kind: "probe",
  factLabels: [
    { de: "Entfernung (ca., Stand 2026)", en: "Distance (approx., 2026)" },
    { de: "Gestartet", en: "Launched" },
    { de: "Antennendurchmesser", en: "Antenna diameter" },
    { de: "Geschwindigkeit", en: "Speed" },
  ],
  facts: {
    distance: { de: "≈ 167 AE (≈ 25 Mrd. km)", en: "≈ 167 AU (≈ 25 billion km)" },
    period: { de: "5. September 1977", en: "September 5, 1977" },
    diameter: { de: "3,7 m (Antenne)", en: "3.7 m (antenna)" },
    moons: { de: "≈ 17 km/s relativ zur Sonne", en: "≈ 17 km/s relative to the Sun" },
  },
  image: commonsFile("Voyager.jpg"),
  description: {
    de: "Voyager 1 ist das am weitesten von der Erde entfernte von Menschen gebaute Objekt. Seit dem 25. August 2012 befindet sie sich im interstellaren Raum, außerhalb der Heliosphäre der Sonne — als erste Sonde überhaupt. An Bord befindet sich die 'Golden Record', eine vergoldete Schallplatte mit Klängen, Musik und Grüßen der Erde für den Fall, dass die Sonde eines Tages von außerirdischer Intelligenz gefunden wird. Ihre drei Radioisotopengeneratoren liefern noch genug Strom, um einige Instrumente bis etwa 2025–2030 zu betreiben; danach wird die Sonde stumm weiterfliegen. Ein Funksignal braucht inzwischen über 23 Stunden für die einfache Strecke zur Erde. Die Position hier ist ein Näherungswert — die Sonde entfernt sich stetig weiter (~3,6 AE pro Jahr).",
    en: "Voyager 1 is the most distant human-made object from Earth. Since August 25, 2012, it has been in interstellar space, beyond the Sun's heliosphere — the first probe ever to get there. Onboard is the 'Golden Record', a gold-plated phonograph record carrying sounds, music and greetings from Earth, in case the probe is ever found by extraterrestrial intelligence. Its three radioisotope generators still supply enough power to run some instruments until roughly 2025–2030, after which the probe will fly on in silence. A radio signal now takes over 23 hours for the one-way trip to Earth. The position shown here is approximate — the probe keeps moving farther away (~3.6 AU per year).",
  },
};

/**
 * Die Sonne selbst — anklickbar für ein Info-Panel mit echtem Foto
 * (Nutzerwunsch 20.09.2026: "mehr infos mit echten bildern bei planeten
 * und sonne").
 */
export const SUN: PlanetData = {
  id: "sun",
  name: { de: "Sonne", en: "Sun" },
  distanceAu: 0,
  periodDays: 0,
  diameterKm: 1391000,
  color: "#ffcf6b",
  glowColor: "rgba(255,196,110,0.6)",
  kind: "star",
  factLabels: [
    { de: "Abstand zur Erde", en: "Distance from Earth" },
    { de: "Rotationsdauer (Äquator)", en: "Rotation period (equator)" },
    { de: "Durchmesser", en: "Diameter" },
    { de: "Oberflächentemperatur", en: "Surface temperature" },
  ],
  facts: {
    distance: { de: "≈ 149,6 Mio. km (1 AE)", en: "≈ 149.6 million km (1 AU)" },
    period: { de: "≈ 27 Tage", en: "≈ 27 days" },
    diameter: { de: "≈ 1,39 Mio. km", en: "≈ 1.39 million km" },
    moons: { de: "≈ 5.500 °C", en: "≈ 5,500°C" },
  },
  image: commonsFile(
    "The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA's_Solar_Dynamics_Observatory_-_20100819.jpg"
  ),
  description: {
    de: "Die Sonne enthält rund 99,86 % der gesamten Masse des Sonnensystems. In ihrem Kern wandelt Kernfusion bei etwa 15 Millionen °C Wasserstoff in Helium um — die Energiequelle für alles Leben auf der Erde.",
    en: "The Sun contains about 99.86% of the Solar System's total mass. In its core, nuclear fusion at around 15 million °C converts hydrogen into helium — the energy source for all life on Earth.",
  },
};

export const ALL_BODIES: PlanetData[] = [...PLANETS, ...DWARF_PLANETS, VOYAGER1];
