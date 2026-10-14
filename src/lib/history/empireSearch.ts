import type { Lang } from "@/contexts/LanguageContext";
import { getEmpireSpans } from "@/lib/history/empiresClient";

/**
 * Reichs-Suche für die Geschichtskarte (Nutzerwunsch 15.10.2026): Die Suche
 * versteht alle 13 Sprachen, findet auch Sammelbegriffe ("Perserreich" →
 * Meder, Achämeniden, Parther, Sassaniden, Safawiden, Kadscharen …) und
 * liefert die echten Namen aus dem Kartendatensatz zurück, damit die Karte
 * genau diese Reiche hervorheben kann. Läuft komplett im Browser.
 */
export interface EmpireHit {
  name: string; // Name im Kartendatensatz (englisch)
  label: string; // Anzeigename in der Sprache der Seite
  from: number;
  to: number;
  year: number; // sinnvolles Jahr zum Anzeigen (größte Ausdehnung bzw. Mitte)
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’'`´]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const CJK = /[぀-ヿ㐀-鿿가-힯]/;

interface Group {
  keys: string[];
  names: string[]; // in zeitlicher Reihenfolge
}

/** Sammelbegriffe: Suchwörter in allen Sprachen → Reiche des Kartendatensatzes. */
const GROUPS: Group[] = [
  {
    keys: [
      "perser", "perserreich", "persisches reich", "persien", "persische reiche", "iran", "altpersisch",
      "persian", "persians", "persian empire", "persian empires", "persia", "iranian",
      "imperio persa", "persas", "persia", "empire perse", "perses", "perse", "irán",
      "império persa", "pérsia", "irã", "pers imparatorlugu", "pers", "persler", "acemler", "iran tarihi",
      "персия", "персидская империя", "персы", "иран",
      "περσία", "περσική αυτοκρατορία", "πέρσες", "ιράν",
      "بلاد فارس", "الإمبراطورية الفارسية", "فارس", "الفرس", "إيران",
      "फ़ारस", "फारस", "पर्शिया", "फ़ारसी साम्राज्य", "फारसी साम्राज्य", "ईरान",
      "波斯", "波斯帝国", "伊朗",
      "ペルシア", "ペルシャ", "ペルシア帝国", "ペルシャ帝国", "イラン",
      "페르시아", "페르시아 제국", "이란",
    ],
    names: [
      "Median Kingdom", "Achaemenid Empire", "Parthian Empire", "Sasanian Empire", "Dabuyid Dynasty",
      "Saffarid Dynasty", "Samanid Empire", "Buyid Dynasty", "Safavid Dynasty", "Hotaki Dynasty",
      "Afsharid Iran", "Zand Dynasty", "Qajar Dynasty", "Pahlavi Dynasty", "Islamic Republic of Iran",
    ],
  },
  {
    keys: [
      "römisches reich", "römer", "rom", "antikes rom", "roemisches reich", "römische reiche",
      "roman empire", "romans", "rome", "ancient rome", "roman", "roman empires",
      "imperio romano", "romanos", "roma", "empire romain", "romains", "rome antique", "império romano",
      "roma imparatorlugu", "romalilar", "римская империя", "римляне", "рим",
      "ρωμαϊκή αυτοκρατορία", "ρωμαίοι", "ρώμη", "الإمبراطورية الرومانية", "الرومان", "روما",
      "रोमन साम्राज्य", "रोम", "罗马帝国", "罗马", "ローマ帝国", "ローマ", "로마 제국", "로마",
    ],
    names: [
      "Roman Kingdom", "Roman Republic", "Roman Empire", "Western Roman Empire", "Eastern Roman Empire", "Byzantine Empire",
    ],
  },
  {
    keys: [
      "china", "chinesisches reich", "chinesische dynastien", "chinesen", "chinesische reiche", "kaiserliches china",
      "chinese empire", "chinese dynasties", "chinese", "imperial china", "imperio chino", "chinos", "china imperial",
      "empire chinois", "chine", "chinois", "império chinês", "chineses", "çin", "çin imparatorlugu", "çin hanedanlari",
      "китай", "китайская империя", "китайские династии", "κίνα", "κινεζική αυτοκρατορία", "κινεζικές δυναστείες",
      "الصين", "الإمبراطورية الصينية", "الأسر الصينية", "चीन", "चीनी साम्राज्य", "中国", "中華", "中国王朝", "中国历代王朝",
      "中国", "中国の王朝", "중국", "중국 왕조",
    ],
    names: [
      "Shang Dynasty", "Zhou Dynasty", "Warring States China", "Qin Dynasty", "Han Dynasty", "Xin Dynasty", "Western Jin",
      "Sui Dynasty", "Tang Dynasty", "Liao Dynasty", "Northern Song", "Great Jin", "Southern Song", "Yuan Dynasty",
      "Ming Dynasty", "Qing Dynasty", "Republic of China", "People's Republic of China",
    ],
  },
  {
    keys: [
      "mongolen", "mongolenreich", "mongolisches reich", "mongolei", "mongols", "mongol", "mongol empire", "mongolia",
      "mongoles", "imperio mongol", "mongols", "empire mongol", "mongóis", "império mongol", "moğollar", "moğol", "moğol imparatorlugu",
      "монголы", "монгольская империя", "монголия", "μογγόλοι", "μογγολική αυτοκρατορία", "المغول", "الإمبراطورية المغولية", "منغوليا",
      "मंगोल", "मंगोल साम्राज्य", "蒙古", "蒙古帝国", "モンゴル", "モンゴル帝国", "몽골", "몽골 제국",
    ],
    names: [
      "Mongol Empire", "Yuan Dynasty", "Golden Horde", "Ilkhanate", "Chagatai Khanate", "White Horde", "Blue Horde", "Northern Yuan",
    ],
  },
  {
    keys: [
      "kalifat", "kalifate", "arabisches reich", "araber", "islamische reiche", "arabische reiche",
      "caliphate", "caliphates", "arab empire", "arabs", "islamic empires", "califato", "califatos", "califat", "califats",
      "halifelik", "halifelikler", "arap imparatorlugu", "халифат", "халифаты", "арабский халифат", "χαλιφάτο", "χαλιφάτα",
      "خلافة", "الخلافة", "الخلافات", "الدولة العربية", "खिलाफत", "ख़िलाफ़त", "哈里发", "哈里发国", "阿拉伯帝国", "カリフ", "カリフ制", "칼리프", "칼리프국",
    ],
    names: [
      "Rashidun Caliphate", "Umayyad Caliphate", "Abbasid Caliphate", "Aghlabid Dynasty", "Fatimid Caliphate",
      "Caliphate of Córdoba", "Ayyubid Sultanate", "Almoravid Dynasty", "Almohad Caliphate", "Mamluk Sultanate",
    ],
  },
  {
    keys: [
      "ägypten", "altes ägypten", "pharaonenreich", "pharaonen", "ägyptisches reich", "egypt", "ancient egypt", "egyptian", "pharaohs",
      "egipto", "antiguo egipto", "egipcio", "égypte", "égypte antique", "egito", "egito antigo", "mısır", "eski mısır", "firavunlar",
      "египет", "древний египет", "фараоны", "αίγυπτος", "αρχαία αίγυπτος", "مصر", "مصر القديمة", "الفراعنة",
      "मिस्र", "प्राचीन मिस्र", "埃及", "古埃及", "エジプト", "古代エジプト", "이집트", "고대 이집트",
    ],
    names: [
      "Early Dynastic Period of Egypt", "Old Kingdom of Egypt", "Middle Kingdom of Egypt", "New Kingdom of Egypt",
      "Kingdom of Kush", "Ptolemaic Kingdom", "Mamluk Sultanate", "Kingdom of Egypt", "Arab Republic of Egypt",
    ],
  },
  {
    keys: [
      "mesopotamien", "babylon", "babylonier", "assyrer", "sumerer", "zweistromland", "mesopotamia", "babylonians", "assyrians", "sumerians",
      "mesopotamie", "mesopotâmia", "mezopotamya", "месопотамия", "вавилон", "ассирия", "μεσοποταμία", "βαβυλώνα",
      "بلاد الرافدين", "بابل", "آشور", "मेसोपोटामिया", "美索不达米亚", "メソポタミア", "메소포타미아",
    ],
    names: [
      "Sumerian City-States", "Akkadian Empire", "Assyria", "Babylonia", "Hittites", "Neo-Assyrian Empire", "Neo-Babylonian Empire", "Elam",
    ],
  },
  {
    keys: [
      "indien", "indische reiche", "indische dynastien", "india", "indian empires", "indian dynasties", "imperios de la india",
      "inde", "empires indiens", "índia", "hindistan", "hint imparatorluklari", "индия", "индийские империи", "ινδία", "ινδικές αυτοκρατορίες",
      "الهند", "الإمبراطوريات الهندية", "भारत", "भारतीय साम्राज्य", "印度", "印度帝国", "インド", "インド帝国", "인도", "인도 제국",
    ],
    names: [
      "Maurya Empire", "Gupta Empire", "Chola Empire", "Delhi Sultanate", "Mughal Empire", "Maratha Empire", "Sikh Empire", "British Raj", "Republic of India",
    ],
  },
  {
    keys: [
      "türken", "türkei", "türkische reiche", "turks", "turkey", "turkish empires", "turcos", "turquía", "turquie", "turcs", "turquia",
      "türkiye", "türk", "türkler", "турция", "турки", "τουρκία", "τούρκοι", "تركيا", "الأتراك", "तुर्की", "土耳其", "突厥", "トルコ", "터키", "튀르키예",
    ],
    names: ["Great Seljuk Empire", "Sultanate of Rum", "Ottoman Empire", "Republic of Turkey"],
  },
  {
    keys: [
      "griechenland", "griechen", "griechische reiche", "antikes griechenland", "greece", "greeks", "greek", "ancient greece",
      "grecia", "griegos", "grèce", "grecs", "grécia", "gregos", "yunanistan", "yunan", "греция", "греки", "ελλάδα", "έλληνες", "αρχαία ελλάδα",
      "اليونان", "الإغريق", "यूनान", "ग्रीस", "希腊", "ギリシャ", "그리스",
    ],
    names: ["Greek City-States", "Macedonian Empire", "Seleucid Empire", "Indo-Greeks", "Byzantine Empire", "First Hellenic Republic", "Third Hellenic Republic"],
  },
  {
    keys: [
      "deutschland", "deutsche reiche", "germany", "german empires", "alemania", "allemagne", "alemanha", "almanya", "германия", "γερμανία",
      "ألمانيا", "जर्मनी", "德国", "ドイツ", "독일",
    ],
    names: [
      "Kingdom of the Franks", "Kingdom of Germany", "Holy Roman Empire", "Kingdom of Prussia", "German Confederation", "German Empire", "Nazi Germany", "Federal Republic of Germany",
    ],
  },
  {
    keys: [
      "russland", "russische reiche", "russia", "russian empires", "rusia", "russie", "rússia", "rusya", "россия", "ρωσία", "روسيا", "रूस", "俄罗斯", "ロシア", "러시아",
    ],
    names: [
      "Kievan Rus'", "Grand Principality of Moscow", "Tsardom of Russia", "Russian Empire", "Union of Soviet Socialist Republics", "Russian Federation",
    ],
  },
  {
    keys: [
      "england", "großbritannien", "grossbritannien", "britische reiche", "britain", "great britain", "british empires", "united kingdom", "inglaterra", "gran bretaña",
      "angleterre", "grande-bretagne", "inglaterra", "grã-bretanha", "ingiltere", "britanya", "англия", "великобритания", "αγγλία", "βρετανία",
      "بريطانيا", "إنجلترا", "ब्रिटेन", "英国", "英國", "イギリス", "영국",
    ],
    names: ["Anglo-Saxon England", "Kingdom of England", "Kingdom of Great Britain", "British Colonial Empire", "British Empire"],
  },
  {
    keys: [
      "spanien", "spanische reiche", "spain", "spanish empires", "españa", "espagne", "espanha", "ispanya", "испания", "ισπανία", "إسبانيا", "स्पेन", "西班牙", "スペイン", "스페인",
    ],
    names: ["Visigothic Kingdom", "Caliphate of Córdoba", "Crown of Castile", "Crown of Aragon", "Spanish Empire", "Portuguese Empire"],
  },
  {
    keys: [
      "frankreich", "französische reiche", "france", "french empires", "francia", "frança", "fransa", "франция", "γαλλία", "فرنسا", "फ्रांस", "法国", "フランス", "프랑스",
    ],
    names: ["Kingdom of the Franks", "Kingdom of France", "Bourbon Kingdom of France", "New France"],
  },
];

/** Häufige Schreibweisen/Beinamen für einzelne Reiche (zusätzlich zu den Übersetzungen). */
const ALIAS: Record<string, string[]> = {
  "Sasanian Empire": ["sassaniden", "sasaniden", "sassanidenreich", "sasanidenreich", "sassanids", "sasanians", "sassanid empire", "sassanide", "sasanian", "ساسانيون"],
  "Achaemenid Empire": ["achämeniden", "achaemeniden", "achämenidenreich", "achaemenids", "achaemenid persian empire", "aquemenidas", "achéménides", "ahameniler", "ахемениды", "αχαιμενίδες", "هخامنشیان", "阿契美尼德", "アケメネス朝", "아케메네스"],
  "Safavid Dynasty": ["safawiden", "safaviden", "safawidenreich", "safavids", "safavid empire", "safavid", "safavidas", "safavides", "safeviler", "сефевиды", "σαφαβίδες"],
  "Parthian Empire": ["parther", "partherreich", "parthians", "arsakiden", "arsacid", "partos", "parthes", "partlar", "парфяне", "πάρθοι"],
  "Median Kingdom": ["meder", "medien", "mederreich", "medes", "medos", "medler", "мидяне", "μήδοι"],
  "Qajar Dynasty": ["kadscharen", "qajaren", "kadscharendynastie", "qajars", "qajar", "kajar", "cajares", "kadjars", "kaçarlar", "каджары"],
  "Afsharid Iran": ["afschariden", "afsharid", "afsharids", "afscharidendynastie", "nader shah", "nadir schah"],
  "Zand Dynasty": ["zand", "zand-dynastie", "zands", "sanden"],
  "Buyid Dynasty": ["buyiden", "buwayhiden", "buyids", "buyid", "bouyides", "büveyhiler"],
  "Samanid Empire": ["samaniden", "samanids", "samanid", "samanides", "samaniler"],
  "Saffarid Dynasty": ["saffariden", "saffarids", "saffarid"],
  "Pahlavi Dynasty": ["pahlavi", "pahlewi", "pahlavis"],
  "Ghaznavid Empire": ["ghaznawiden", "ghaznaviden", "ghaznavids", "gaznevi", "gaznewiden"],
  "Great Seljuk Empire": ["seldschuken", "seljuks", "seljuk", "seldschukenreich", "selçuklu", "seljouks", "сельджуки", "σελτζούκοι"],
  "Ottoman Empire": ["osmanen", "osmanisches reich", "ottomans", "osmanli", "osmanlı", "ottoman", "otomano", "османы", "οθωμανοί"],
  "Mamluk Sultanate": ["mamluken", "mamelucken", "mamelukken", "mamluks", "mamelouks", "mamelucos"],
  "Abbasid Caliphate": ["abbasiden", "abbasids", "abasíes", "abbassides"],
  "Umayyad Caliphate": ["omaijaden", "umayyaden", "umayyads", "omeyas", "omeyyades", "emeviler"],
  "Fatimid Caliphate": ["fatimiden", "fatimids", "fatimíes", "fatimides"],
  "Ayyubid Sultanate": ["ayyubiden", "ayyubids", "ayubíes", "ayyoubides"],
  "Mughal Empire": ["moguln", "mogulreich", "mughals", "moguls", "mogoles", "moghols", "babürlüler"],
  "Holy Roman Empire": ["heiliges römisches reich", "hrr", "deutsche nation", "holy roman", "sacro imperio"],
  "German Empire": ["kaiserreich", "deutsches kaiserreich", "second reich", "zweites reich"],
  "Nazi Germany": ["drittes reich", "third reich", "nazideutschland", "ns-deutschland", "nationalsozialismus"],
  "Kingdom of the Franks": ["franken", "fränkisches reich", "frankenreich", "merowinger", "karolinger", "franks", "carolingian"],
  "Kingdom of Prussia": ["preußen", "preussen", "prussia"],
  "Byzantine Empire": ["byzanz", "oströmisches reich", "byzantiner", "byzantines"],
  "Kievan Rus'": ["kiewer rus", "kiewer russland", "kyivan rus", "kiev rus"],
  "Songhai Empire": ["songhai", "songhay", "songhaireich"],
  "Inca Empire": ["inka", "inkareich", "incas", "incan empire"],
  "Aztec Empire": ["azteken", "aztekenreich", "aztecs", "aztecas"],
};

const NOISE = /^(Allegiance|Vassalage|Alliance|Personal union|Protectorate|Union of)\b/;

interface Loaded {
  spans: Map<string, { from: number; to: number; mid: number }>;
  idx: Map<string, { de: string | null; peak: number }>;
  nameL: (en: string, lang: Lang, de: string | null) => string;
  all: (en: string) => string[];
}

let cache: Promise<Loaded> | null = null;

function load(): Promise<Loaded> {
  if (!cache) {
    cache = Promise.all([import("@/data/reiche/index.json"), import("@/lib/history/reicheNames"), getEmpireSpans()]).then(
      ([index, names, spans]) => {
        const idx = new Map<string, { de: string | null; peak: number }>();
        for (const r of index.default as unknown as { en: string; de: string | null; peakYear: number }[]) {
          idx.set(r.en, { de: r.de, peak: r.peakYear });
        }
        return { spans, idx, nameL: names.reichNameL, all: names.reichAllNames };
      }
    );
    cache.catch(() => {
      cache = null;
    });
  }
  return cache;
}

function keyMatches(q: string, k: string): boolean {
  if (q === k) return true;
  const cj = CJK.test(q);
  if (q.length >= (cj ? 2 : 3) && k.startsWith(q)) return true;
  if (k.length >= (cj ? 2 : 4) && q.length > k.length && q.startsWith(k)) return true;
  return false;
}

function strScore(q: string, cands: string[]): number {
  const cj = CJK.test(q);
  let best = 0;
  for (const c of cands) {
    const x = norm(c);
    if (!x) continue;
    if (x === q) return 100;
    if (x.startsWith(q)) best = Math.max(best, 80);
    else if (x.split(/[\s\-/,]/).some((w) => w.startsWith(q))) best = Math.max(best, 60);
    else if ((cj || q.length >= 5) && x.includes(q)) best = Math.max(best, 40);
    else if (alias5(q, x)) best = Math.max(best, 70);
  }
  return best;
}

/** Suchbegriff enthält ein ganzes Alias-Wort ("sassanidenreich" ⊃ "sassaniden"). */
function alias5(q: string, x: string): boolean {
  return x.length >= 6 && q.length > x.length && q.startsWith(x) && !CJK.test(x);
}

export async function searchEmpires(query: string, lang: Lang): Promise<EmpireHit[]> {
  const q = norm(query);
  if (q.length < (CJK.test(q) ? 1 : 2)) return [];
  const d = await load();
  const exact = new Map<string, number>();
  const direct = new Map<string, number>();

  // 1) einzelne Reiche: englischer Name, deutscher Name, Übersetzungen, Beinamen
  for (const name of d.spans.keys()) {
    if (NOISE.test(name)) continue;
    const cands = [name, d.idx.get(name)?.de ?? "", ...d.all(name), ...(ALIAS[name] ?? [])];
    const s = strScore(q, cands);
    if (s >= 100) exact.set(name, s);
    if (s > 0) direct.set(name, s);
  }

  // 2) Sammelbegriffe ("Perserreich", "Chinese dynasties" …)
  const picked: string[] = [];
  for (const g of GROUPS) {
    if (!g.keys.some((k) => keyMatches(q, norm(k)))) continue;
    for (const n of g.names) if (d.spans.has(n) && !picked.includes(n)) picked.push(n);
  }

  let order: string[];
  if (picked.length) {
    const extra = [...exact.keys()].filter((n) => !picked.includes(n));
    order = [...picked, ...extra];
  } else {
    order = [...direct.entries()]
      .sort((a, b) => b[1] - a[1] || (d.spans.get(a[0])?.from ?? 0) - (d.spans.get(b[0])?.from ?? 0))
      .map(([n]) => n)
      .slice(0, 30);
  }

  return order.map((name) => {
    const sp = d.spans.get(name)!;
    const ix = d.idx.get(name);
    const year = ix && ix.peak >= sp.from && ix.peak <= sp.to ? ix.peak : sp.mid;
    return { name, label: d.nameL(name, lang, ix?.de ?? null), from: sp.from, to: sp.to, year };
  });
}
