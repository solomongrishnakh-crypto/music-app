/**
 * Nutzerwunsch 20.09.2026: "erstelle so ein box mit solarsystem oben ...
 * realistische bewegungen von planeten. alle planeten sollen enthalten
 * sein ... sehr realistische umlaufbahnen und abstände" — echte
 * astronomische Werte (AU, Tage, km), keine erfundenen Zahlen. Für die
 * Darstellung werden Abstände/Größen skaliert (siehe SolarSystem.tsx),
 * die REIHENFOLGE und relativen Verhältnisse bleiben aber echt.
 */
export interface PlanetData {
  id: string;
  name: string;
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
  factLabels?: [string, string, string, string];
  facts: {
    distance: string;
    period: string;
    diameter: string;
    moons: string;
  };
  description: string;
  /** Echtes Foto (Nutzerwunsch 20.09.2026: "mehr infos mit echten bildern bei planeten und sonne"). */
  image?: string;
}

function commonsFile(filename: string): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=700`;
}

export const PLANETS: PlanetData[] = [
  {
    id: "mercury",
    name: "Merkur",
    distanceAu: 0.387,
    periodDays: 88,
    diameterKm: 4879,
    color: "#b8ada0",
    glowColor: "rgba(184,173,160,0.5)",
    facts: {
      distance: "0,39 AE (≈ 58 Mio. km)",
      period: "88 Tage",
      diameter: "4.879 km",
      moons: "0",
    },
    description:
      "Merkur ist der sonnennächste und kleinste Planet. Ohne nennenswerte Atmosphäre schwanken die Temperaturen extrem — bis zu 430 °C tagsüber, bis zu −180 °C nachts.",
    image: commonsFile("Mercury_in_color_-_Prockter07-edit1.jpg"),
  },
  {
    id: "venus",
    name: "Venus",
    distanceAu: 0.723,
    periodDays: 224.7,
    diameterKm: 12104,
    color: "#e8c98a",
    glowColor: "rgba(232,201,138,0.5)",
    facts: {
      distance: "0,72 AE (≈ 108 Mio. km)",
      period: "225 Tage",
      diameter: "12.104 km",
      moons: "0",
    },
    description:
      "Venus ist durch ihre extrem dichte CO₂-Atmosphäre und den daraus resultierenden Treibhauseffekt der heißeste Planet im Sonnensystem — heißer als Merkur, trotz größerer Sonnenentfernung.",
    image: commonsFile("Venus-real_color.jpg"),
  },
  {
    id: "earth",
    name: "Erde",
    distanceAu: 1,
    periodDays: 365.25,
    diameterKm: 12742,
    color: "#4f8fd6",
    glowColor: "rgba(79,143,214,0.55)",
    facts: {
      distance: "1 AE (≈ 150 Mio. km)",
      period: "365,25 Tage",
      diameter: "12.742 km",
      moons: "1 (Mond)",
    },
    description:
      "Unser Heimatplanet — der einzige bekannte Ort im Universum mit bestätigtem Leben. Flüssiges Wasser an der Oberfläche und eine schützende Atmosphäre machen das möglich.",
    image: commonsFile("The_Blue_Marble_(remastered).jpg"),
  },
  {
    id: "mars",
    name: "Mars",
    distanceAu: 1.524,
    periodDays: 687,
    diameterKm: 6779,
    color: "#c1543a",
    glowColor: "rgba(193,84,58,0.5)",
    facts: {
      distance: "1,52 AE (≈ 228 Mio. km)",
      period: "687 Tage",
      diameter: "6.779 km",
      moons: "2 (Phobos, Deimos)",
    },
    description:
      "Der 'Rote Planet' verdankt seine Farbe eisenoxidhaltigem Staub. Er beherbergt den größten bekannten Vulkan des Sonnensystems, Olympus Mons, und ist Ziel zukünftiger bemannter Missionen.",
    image: commonsFile("OSIRIS_Mars_true_color.jpg"),
  },
  {
    id: "jupiter",
    name: "Jupiter",
    distanceAu: 5.204,
    periodDays: 4333,
    diameterKm: 139820,
    color: "#d9b28c",
    glowColor: "rgba(217,178,140,0.5)",
    facts: {
      distance: "5,20 AE (≈ 778 Mio. km)",
      period: "≈ 11,86 Jahre",
      diameter: "139.820 km",
      moons: "95 bekannte",
    },
    description:
      "Jupiter ist der größte Planet — mehr als doppelt so massereich wie alle anderen Planeten zusammen. Der Große Rote Fleck ist ein Sturm, größer als die Erde, der seit Jahrhunderten wütet.",
    image: commonsFile("Jupiter_by_Cassini-Huygens.jpg"),
  },
  {
    id: "saturn",
    name: "Saturn",
    distanceAu: 9.583,
    periodDays: 10759,
    diameterKm: 116460,
    color: "#e3d1a3",
    glowColor: "rgba(227,209,163,0.5)",
    hasRings: true,
    facts: {
      distance: "9,58 AE (≈ 1,43 Mrd. km)",
      period: "≈ 29,4 Jahre",
      diameter: "116.460 km",
      moons: "146 bekannte",
    },
    description:
      "Saturn ist berühmt für sein ausgedehntes, spektakuläres Ringsystem aus Eis- und Gesteinspartikeln. Mit der geringsten Dichte aller Planeten würde er theoretisch auf Wasser schwimmen.",
    image: commonsFile("Saturn_during_Equinox.jpg"),
  },
  {
    id: "uranus",
    name: "Uranus",
    distanceAu: 19.2,
    periodDays: 30687,
    diameterKm: 50724,
    color: "#9fd6d6",
    glowColor: "rgba(159,214,214,0.5)",
    facts: {
      distance: "19,2 AE (≈ 2,87 Mrd. km)",
      period: "≈ 84 Jahre",
      diameter: "50.724 km",
      moons: "28 bekannte",
    },
    description:
      "Uranus rotiert extrem geneigt — praktisch 'auf der Seite liegend' mit ~98° Achsneigung, vermutlich Folge einer gewaltigen Kollision in der Frühzeit des Sonnensystems.",
    image: commonsFile("Uranus2.jpg"),
  },
  {
    id: "neptune",
    name: "Neptun",
    distanceAu: 30.05,
    periodDays: 60190,
    diameterKm: 49244,
    color: "#5470d6",
    glowColor: "rgba(84,112,214,0.55)",
    facts: {
      distance: "30,05 AE (≈ 4,50 Mrd. km)",
      period: "≈ 165 Jahre",
      diameter: "49.244 km",
      moons: "16 bekannte",
    },
    description:
      "Neptun ist der äußerste bekannte Planet und hat mit bis zu 2.100 km/h die stärksten gemessenen Winde im Sonnensystem. Seit seiner Entdeckung 1846 hat er noch keine volle Umrundung der Sonne vollendet.",
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
    name: "Ceres",
    distanceAu: 2.77,
    periodDays: 1682,
    diameterKm: 940,
    color: "#a89f92",
    glowColor: "rgba(168,159,146,0.4)",
    kind: "dwarf",
    facts: {
      distance: "2,77 AE (≈ 414 Mio. km)",
      period: "≈ 4,6 Jahre",
      diameter: "940 km",
      moons: "0",
    },
    description:
      "Ceres ist der größte Körper im Asteroidengürtel zwischen Mars und Jupiter und der einzige Zwergplanet im inneren Sonnensystem — sie macht rund ein Drittel der Gesamtmasse des gesamten Gürtels aus. Unter ihrer Oberfläche vermutet man eine Schicht aus Wassereis oder sogar einen flüssigen Ozean, und helle Flecken im Occator-Krater bestehen aus Salzablagerungen. Die Raumsonde Dawn umkreiste Ceres von 2015 bis 2018 und lieferte die bislang detailliertesten Aufnahmen.",
    image: commonsFile("PIA19562-Ceres-DwarfPlanet-Dawn-RC3-image19-20150506.jpg"),
  },
  {
    id: "pluto",
    name: "Pluto",
    distanceAu: 39.48,
    periodDays: 90560,
    diameterKm: 2377,
    color: "#c9b29a",
    glowColor: "rgba(201,178,154,0.4)",
    kind: "dwarf",
    facts: {
      distance: "39,48 AE (≈ 5,9 Mrd. km)",
      period: "≈ 248 Jahre",
      diameter: "2.377 km",
      moons: "5 (u. a. Charon)",
    },
    description:
      "Pluto galt bis 2006 als neunter Planet und wurde dann als Zwergplanet neu eingestuft, nachdem klar wurde, dass es im Kuipergürtel viele ähnliche Objekte gibt. Sein größter Mond Charon ist halb so groß wie Pluto selbst — beide umkreisen einen gemeinsamen Schwerpunkt außerhalb Plutos, weshalb man sie manchmal als Doppel-Zwergplanet bezeichnet. Die NASA-Sonde New Horizons flog 2015 als bislang einzige Mission an Pluto vorbei und entdeckte u. a. das herzförmige Gletschergebiet Tombaugh Regio.",
    image: commonsFile("Pluto.jpg"),
  },
  {
    id: "haumea",
    name: "Haumea",
    distanceAu: 43.13,
    periodDays: 103800,
    diameterKm: 1600,
    color: "#d8e6ea",
    glowColor: "rgba(216,230,234,0.4)",
    kind: "dwarf",
    facts: {
      distance: "43,1 AE (≈ 6,5 Mrd. km)",
      period: "≈ 284 Jahre",
      diameter: "≈ 1.600 km",
      moons: "2",
    },
    description:
      "Haumea rotiert so schnell (in nur 4 Stunden), dass sie zu einer stark abgeflachten, eiförmigen Form verzerrt ist — einzigartig unter den bekannten Zwergplaneten. Sie besitzt zwei kleine Monde (Hiʻiaka und Namaka) sowie ein dünnes Ringsystem, das 2017 entdeckt wurde — der erste bekannte Ring um ein Objekt jenseits des Neptun. Vermutlich entstand ihre ungewöhnliche Form durch eine gewaltige Kollision in der Frühzeit des Sonnensystems.",
    image: commonsFile("Haumea_Hubble.png"),
  },
  {
    id: "makemake",
    name: "Makemake",
    distanceAu: 45.79,
    periodDays: 111000,
    diameterKm: 1430,
    color: "#b56b4a",
    glowColor: "rgba(181,107,74,0.4)",
    kind: "dwarf",
    facts: {
      distance: "45,8 AE (≈ 6,9 Mrd. km)",
      period: "≈ 305 Jahre",
      diameter: "≈ 1.430 km",
      moons: "1",
    },
    description:
      "Makemake ist nach dem Schöpfergott der Rapa Nui (Osterinsel) benannt und einer der größten bekannten Kuipergürtel-Objekte nach Pluto. Seine sehr helle, rötliche Oberfläche besteht vermutlich aus gefrorenem Methan und Ethan — ähnlich wie bei Pluto. Erst 2016 entdeckte das Hubble-Weltraumteleskop seinen einzigen bekannten Mond, inoffiziell 'MK 2' genannt.",
    image: commonsFile("Makemake_and_its_moon.jpg"),
  },
  {
    id: "eris",
    name: "Eris",
    distanceAu: 67.78,
    periodDays: 203830,
    diameterKm: 2326,
    color: "#d9d9d9",
    glowColor: "rgba(217,217,217,0.4)",
    kind: "dwarf",
    facts: {
      distance: "67,8 AE (≈ 10,1 Mrd. km)",
      period: "≈ 558 Jahre",
      diameter: "2.326 km",
      moons: "1 (Dysnomia)",
    },
    description:
      "Eris ist fast so groß wie Pluto, aber deutlich massereicher, und war 2005 der Auslöser für die Debatte, die zur Neudefinition von 'Planet' und Plutos Herabstufung führte. Ihr Name stammt von der griechischen Göttin der Zwietracht — passend zu der Kontroverse, die sie auslöste. Eris liegt auf einer stark elliptischen, geneigten Umlaufbahn und war zum Entdeckungszeitpunkt eines der am weitesten entfernten je beobachteten Objekte im Sonnensystem.",
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
  name: "Voyager 1",
  distanceAu: 167,
  periodDays: 0,
  diameterKm: 5,
  color: "#f2f2f0",
  glowColor: "rgba(242,242,240,0.5)",
  kind: "probe",
  factLabels: ["Entfernung (ca., Stand 2026)", "Gestartet", "Antennendurchmesser", "Geschwindigkeit"],
  facts: {
    distance: "≈ 167 AE (≈ 25 Mrd. km)",
    period: "5. September 1977",
    diameter: "3,7 m (Antenne)",
    moons: "≈ 17 km/s relativ zur Sonne",
  },
  image: commonsFile("Voyager.jpg"),
  description:
    "Voyager 1 ist das am weitesten von der Erde entfernte von Menschen gebaute Objekt. Seit dem 25. August 2012 befindet sie sich im interstellaren Raum, außerhalb der Heliosphäre der Sonne — als erste Sonde überhaupt. An Bord befindet sich die 'Golden Record', eine vergoldete Schallplatte mit Klängen, Musik und Grüßen der Erde für den Fall, dass die Sonde eines Tages von außerirdischer Intelligenz gefunden wird. Ihre drei Radioisotopengeneratoren liefern noch genug Strom, um einige Instrumente bis etwa 2025–2030 zu betreiben; danach wird die Sonde stumm weiterfliegen. Ein Funksignal braucht inzwischen über 23 Stunden für die einfache Strecke zur Erde. Die Position hier ist ein Näherungswert — die Sonde entfernt sich stetig weiter (~3,6 AE pro Jahr).",
};

/**
 * Die Sonne selbst — anklickbar für ein Info-Panel mit echtem Foto
 * (Nutzerwunsch 20.09.2026: "mehr infos mit echten bildern bei planeten
 * und sonne").
 */
export const SUN: PlanetData = {
  id: "sun",
  name: "Sonne",
  distanceAu: 0,
  periodDays: 0,
  diameterKm: 1391000,
  color: "#ffcf6b",
  glowColor: "rgba(255,196,110,0.6)",
  kind: "star",
  factLabels: ["Abstand zur Erde", "Rotationsdauer (Äquator)", "Durchmesser", "Oberflächentemperatur"],
  facts: {
    distance: "≈ 149,6 Mio. km (1 AE)",
    period: "≈ 27 Tage",
    diameter: "≈ 1,39 Mio. km",
    moons: "≈ 5.500 °C",
  },
  image: commonsFile(
    "The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA's_Solar_Dynamics_Observatory_-_20100819.jpg"
  ),
  description:
    "Die Sonne enthält rund 99,86 % der gesamten Masse des Sonnensystems. In ihrem Kern wandelt Kernfusion bei etwa 15 Millionen °C Wasserstoff in Helium um — die Energiequelle für alles Leben auf der Erde.",
};

export const ALL_BODIES: PlanetData[] = [...PLANETS, ...DWARF_PLANETS, VOYAGER1];
