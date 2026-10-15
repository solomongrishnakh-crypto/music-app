import type { Lang } from "@/contexts/LanguageContext";

type Tx = Record<Lang, string>;

/**
 * Zusatz-Ziele für den Reisezeit-Rechner — nur über die kleine Suchbox zu finden
 * (Nutzerwunsch 16.10.2026: mehr Sterne, Nebel, Galaxien, Quasare, aber versteckt).
 * Entfernungen sind gerundete Näherungen (Lichtjahre, bei Quasaren Lichtlaufzeit).
 */
export const LY_KM = 9.4607304725808e12;
const AU = 149597870.7;

export type Kind = "star" | "planet" | "nebula" | "cluster" | "galaxy" | "quasar" | "compact";

export type Extra = { id: string; km: number; name: string; de: string; kind: Kind; color: string; alias: string };

// [id, Entfernung, Einheit (ly | au), englischer Name, deutscher Name, Art, Farbe, weitere Suchbegriffe]
const RAW: [string, number, "ly" | "au", string, string, Kind, string, string][] = [
  ["mercury", 0.9, "au", "", "", "planet", "#b5b0a8", ""],
  ["venus", 0.7, "au", "", "", "planet", "#e8cda0", ""],
  ["saturn", 9.6, "au", "", "", "planet", "#e3cf9c", ""],
  ["uranus", 19.2, "au", "", "", "planet", "#9fe0e8", ""],
  ["pluto", 39.5, "au", "", "", "planet", "#d2b79b", ""],
  ["alphacen", 4.37, "ly", "Alpha Centauri", "Alpha Centauri", "star", "#ffe8a8", "rigil kentaurus"],
  ["barnard", 5.96, "ly", "Barnard's Star", "Barnards Pfeilstern", "star", "#ff7a55", "barnard"],
  ["wolf359", 7.86, "ly", "Wolf 359", "Wolf 359", "star", "#ff6a4a", ""],
  ["procyon", 11.46, "ly", "Procyon", "Procyon", "star", "#fff4d6", ""],
  ["taucet", 11.9, "ly", "Tau Ceti", "Tau Ceti", "star", "#ffe9b0", ""],
  ["altair", 16.7, "ly", "Altair", "Altair", "star", "#eef2ff", ""],
  ["vega", 25.05, "ly", "Vega", "Wega", "star", "#cfe0ff", "wega"],
  ["fomalhaut", 25.1, "ly", "Fomalhaut", "Fomalhaut", "star", "#e8eeff", ""],
  ["arcturus", 36.7, "ly", "Arcturus", "Arktur", "star", "#ffb870", "arktur"],
  ["trappist", 40.7, "ly", "TRAPPIST-1", "TRAPPIST-1", "star", "#ff5a3a", "trappist 1"],
  ["capella", 42.9, "ly", "Capella", "Kapella", "star", "#ffe9a8", "kapella"],
  ["aldebaran", 65, "ly", "Aldebaran", "Aldebaran", "star", "#ff9a5a", ""],
  ["hyades", 153, "ly", "Hyades", "Hyaden", "cluster", "#cfe0ff", "hyaden"],
  ["canopus", 310, "ly", "Canopus", "Canopus", "star", "#fff6e0", ""],
  ["polaris", 433, "ly", "Polaris", "Polarstern", "star", "#fff1c8", "nordstern north star"],
  ["pleiades", 444, "ly", "Pleiades", "Plejaden", "cluster", "#9cc4ff", "plejaden siebengestirn m45 seven sisters"],
  ["antares", 550, "ly", "Antares", "Antares", "star", "#ff5a3c", ""],
  ["helix", 650, "ly", "Helix Nebula", "Helixnebel", "nebula", "#6fd0d8", "helixnebel ngc 7293"],
  ["rigel", 860, "ly", "Rigel", "Rigel", "star", "#b8d0ff", ""],
  ["gaiabh3", 1926, "ly", "Gaia BH3", "Gaia BH3", "compact", "#b36bff", "schwarzes loch black hole"],
  ["orionneb", 1344, "ly", "Orion Nebula", "Orionnebel", "nebula", "#ff8fb0", "orionnebel m42 messier 42"],
  ["horsehead", 1375, "ly", "Horsehead Nebula", "Pferdekopfnebel", "nebula", "#c95a4a", "pferdekopfnebel barnard 33"],
  ["dumbbell", 1360, "ly", "Dumbbell Nebula", "Hantelnebel", "nebula", "#7fe0c0", "hantelnebel m27 messier 27"],
  ["ring", 2300, "ly", "Ring Nebula", "Ringnebel", "nebula", "#7fb8ff", "ringnebel m57 messier 57"],
  ["deneb", 2600, "ly", "Deneb", "Deneb", "star", "#e8eeff", ""],
  ["vycma", 3000, "ly", "VY Canis Majoris", "VY Canis Majoris", "star", "#ff4a30", "vy grosser hund hypergigant"],
  ["catseye", 3300, "ly", "Cat's Eye Nebula", "Katzenaugennebel", "nebula", "#5fd0e0", "katzenaugennebel ngc 6543"],
  ["lagoon", 4100, "ly", "Lagoon Nebula", "Lagunennebel", "nebula", "#ff7aa0", "lagunennebel m8 messier 8"],
  ["crabnebula", 6500, "ly", "Crab Nebula", "Krebsnebel", "nebula", "#ff9a6a", "krebsnebel m1 messier 1 supernova"],
  ["crabpulsar", 6500, "ly", "Crab Pulsar", "Krebs-Pulsar", "compact", "#8fd3ff", "pulsar neutronenstern neutron star"],
  ["pillars", 7000, "ly", "Pillars of Creation", "Säulen der Schöpfung", "nebula", "#e8a060", "saeulen der schoepfung eagle nebula adlernebel m16 messier 16"],
  ["cygx1", 7200, "ly", "Cygnus X-1", "Cygnus X-1", "compact", "#b36bff", "schwarzes loch black hole schwan"],
  ["etacar", 7500, "ly", "Eta Carinae", "Eta Carinae", "star", "#ffb070", "eta carina"],
  ["carina", 8500, "ly", "Carina Nebula", "Carinanebel", "nebula", "#ff8a70", "carinanebel kielnebel"],
  ["omegacen", 17000, "ly", "Omega Centauri", "Omega Centauri", "cluster", "#ffe2b0", "kugelsternhaufen globular"],
  ["lmc", 163000, "ly", "Large Magellanic Cloud", "Große Magellansche Wolke", "galaxy", "#d8e2ff", "grosse magellansche wolke lmc"],
  ["tarantula", 160000, "ly", "Tarantula Nebula", "Tarantelnebel", "nebula", "#ff7a90", "tarantelnebel 30 doradus"],
  ["smc", 200000, "ly", "Small Magellanic Cloud", "Kleine Magellansche Wolke", "galaxy", "#d8e2ff", "kleine magellansche wolke smc"],
  ["triangulum", 2.73e6, "ly", "Triangulum Galaxy", "Dreiecksgalaxie", "galaxy", "#c8d8ff", "dreiecksgalaxie m33 messier 33"],
  ["m81", 11.8e6, "ly", "Bode's Galaxy", "Bodes Galaxie", "galaxy", "#ffe2c0", "m81 messier 81"],
  ["m82", 12e6, "ly", "Cigar Galaxy", "Zigarrengalaxie", "galaxy", "#ffb0a0", "zigarrengalaxie m82 messier 82"],
  ["cena", 13e6, "ly", "Centaurus A", "Centaurus A", "galaxy", "#ffd0a0", "ngc 5128"],
  ["m101", 21e6, "ly", "Pinwheel Galaxy", "Feuerradgalaxie", "galaxy", "#c8d8ff", "feuerradgalaxie m101 messier 101"],
  ["m51", 23e6, "ly", "Whirlpool Galaxy", "Whirlpool-Galaxie", "galaxy", "#c8d8ff", "whirlpool strudelgalaxie m51 messier 51"],
  ["m104", 29e6, "ly", "Sombrero Galaxy", "Sombrero-Galaxie", "galaxy", "#ffe2c0", "sombrerogalaxie m104 messier 104"],
  ["antennae", 45e6, "ly", "Antennae Galaxies", "Antennengalaxien", "galaxy", "#c0d0ff", "antennengalaxien ngc 4038"],
  ["m87", 53.5e6, "ly", "Messier 87", "Messier 87", "galaxy", "#ffe8c8", "m87 virgo jungfrau schwarzes loch black hole"],
  ["coma", 320e6, "ly", "Coma Cluster", "Coma-Haufen", "galaxy", "#ffe0b8", "galaxienhaufen galaxy cluster"],
  ["cartwheel", 500e6, "ly", "Cartwheel Galaxy", "Wagenradgalaxie", "galaxy", "#a0c8ff", "wagenradgalaxie"],
  ["3c273", 2.4e9, "ly", "3C 273", "3C 273", "quasar", "#9fd8ff", "quasar"],
  ["oj287", 3.5e9, "ly", "OJ 287", "OJ 287", "quasar", "#ffb0e0", "quasar blazar"],
  ["ton618", 10.4e9, "ly", "TON 618", "TON 618", "quasar", "#d08cff", "quasar schwarzes loch black hole"],
  ["apm08279", 12e9, "ly", "APM 08279+5255", "APM 08279+5255", "quasar", "#ffa070", "quasar"],
  ["ulas1342", 13.1e9, "ly", "ULAS J1342+0928", "ULAS J1342+0928", "quasar", "#ff80a0", "quasar"],
];

export const EXTRA: Extra[] = RAW.map(([id, v, u, en, de, kind, color, alias]) => ({
  id,
  km: v * (u === "ly" ? LY_KM : AU),
  name: en,
  de,
  kind,
  color,
  alias,
}));

export const KIND_TX: Record<Kind, Tx> = {
  star: { de: "Stern", en: "Star", hi: "तारा", zh: "恒星", ko: "별", ja: "恒星", es: "Estrella", fr: "Étoile", tr: "Yıldız", ru: "Звезда", pt: "Estrela", ar: "نجم", el: "Άστρο" },
  planet: { de: "Planet", en: "Planet", hi: "ग्रह", zh: "行星", ko: "행성", ja: "惑星", es: "Planeta", fr: "Planète", tr: "Gezegen", ru: "Планета", pt: "Planeta", ar: "كوكب", el: "Πλανήτης" },
  nebula: { de: "Nebel", en: "Nebula", hi: "नीहारिका", zh: "星云", ko: "성운", ja: "星雲", es: "Nebulosa", fr: "Nébuleuse", tr: "Bulutsu", ru: "Туманность", pt: "Nebulosa", ar: "سديم", el: "Νεφέλωμα" },
  cluster: { de: "Sternhaufen", en: "Star cluster", hi: "तारा समूह", zh: "星团", ko: "성단", ja: "星団", es: "Cúmulo", fr: "Amas d'étoiles", tr: "Yıldız kümesi", ru: "Скопление", pt: "Aglomerado", ar: "عنقود نجمي", el: "Σμήνος" },
  galaxy: { de: "Galaxie", en: "Galaxy", hi: "आकाशगंगा", zh: "星系", ko: "은하", ja: "銀河", es: "Galaxia", fr: "Galaxie", tr: "Gökada", ru: "Галактика", pt: "Galáxia", ar: "مجرة", el: "Γαλαξίας" },
  quasar: { de: "Quasar", en: "Quasar", hi: "क्वासर", zh: "类星体", ko: "퀘이사", ja: "クエーサー", es: "Cuásar", fr: "Quasar", tr: "Kuasar", ru: "Квазар", pt: "Quasar", ar: "كوازار", el: "Κβάζαρ" },
  compact: {
    de: "Neutronenstern / Schwarzes Loch", en: "Neutron star / black hole", hi: "न्यूट्रॉन तारा / ब्लैक होल", zh: "中子星 / 黑洞", ko: "중성자별 / 블랙홀", ja: "中性子星 / ブラックホール",
    es: "Estrella de neutrones / agujero negro", fr: "Étoile à neutrons / trou noir", tr: "Nötron yıldızı / kara delik", ru: "Нейтронная звезда / чёрная дыра", pt: "Estrela de nêutrons / buraco negro", ar: "نجم نيوتروني / ثقب أسود", el: "Αστέρας νετρονίων / μαύρη τρύπα",
  },
};

export const SEARCH_TX: { ph: Tx; none: Tx; ly: Tx } = {
  ph: {
    de: "Mehr suchen: Sterne, Nebel, Galaxien …", en: "Search more: stars, nebulae, galaxies …", hi: "और खोजें: तारे, नीहारिकाएँ, आकाशगंगाएँ …", zh: "搜索更多：恒星、星云、星系…", ko: "더 찾기: 별, 성운, 은하 …", ja: "もっと探す：恒星、星雲、銀河…",
    es: "Buscar más: estrellas, nebulosas, galaxias …", fr: "Chercher plus : étoiles, nébuleuses, galaxies …", tr: "Daha fazla ara: yıldız, bulutsu, gökada …", ru: "Искать ещё: звёзды, туманности, галактики …", pt: "Procurar mais: estrelas, nebulosas, galáxias …", ar: "ابحث عن المزيد: نجوم، سدم، مجرات …", el: "Αναζήτηση: άστρα, νεφελώματα, γαλαξίες …",
  },
  none: {
    de: "Nichts gefunden", en: "Nothing found", hi: "कुछ नहीं मिला", zh: "没有找到", ko: "결과 없음", ja: "見つかりません",
    es: "Sin resultados", fr: "Aucun résultat", tr: "Sonuç yok", ru: "Ничего не найдено", pt: "Nada encontrado", ar: "لا نتائج", el: "Δεν βρέθηκε",
  },
  ly: {
    de: "Lichtjahre", en: "light years", hi: "प्रकाश-वर्ष", zh: "光年", ko: "광년", ja: "光年",
    es: "años luz", fr: "années-lumière", tr: "ışık yılı", ru: "св. лет", pt: "anos-luz", ar: "سنة ضوئية", el: "έτη φωτός",
  },
};

export function normSearch(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ß/g, "ss");
}
