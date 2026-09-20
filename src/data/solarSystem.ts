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
  /** Siderische Umlaufzeit in Erdtagen — echter Wert. */
  periodDays: number;
  /** Äquatordurchmesser in km — echter Wert. */
  diameterKm: number;
  color: string;
  glowColor: string;
  hasRings?: boolean;
  facts: {
    distance: string;
    period: string;
    diameter: string;
    moons: string;
  };
  description: string;
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
  },
];
