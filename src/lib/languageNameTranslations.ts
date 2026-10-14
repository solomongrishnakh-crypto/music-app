/**
 * Nutzerkorrektur 21.09.2026 ("wieso steht da wieder texte auf deutsch zb
 * language : persisch") — die kuratierten Sprach-Angaben in
 * src/data/empireFallbacks.ts (FALLBACKS/LANGUAGE_ONLY) sind als
 * Fließtext auf Deutsch verfasst ("Persisch (Hof), Turksprachen"), nicht
 * als strukturierte Daten. Eine VOLLSTÄNDIGE Übersetzung all dieser ~330
 * Werte in alle 13 UI-Sprachen von Hand ist nicht seriös leistbar (siehe
 * "keine Vermutungen" in der Datei selbst).
 *
 * Pragmatischer Mittelweg: die deutschen WÖRTER, aus denen sich diese
 * Werte zusammensetzen (Sprachnamen wie "Persisch", "Griechisch", plus
 * ein paar Konnektoren wie "Hof", "später", "und"), werden hier einzeln
 * uebersetzt und beim Anzeigen wortweise ersetzt (siehe translateLanguageValue
 * unten). Bisher nur Englisch vollständig gepflegt — weitere Sprachen
 * können bei Bedarf ergänzt werden, bis dahin bleibt in den anderen 11
 * Sprachen der deutsche Text stehen (kein falscher Text, nur unübersetzt).
 */

export const LANGUAGE_WORD_EN: Record<string, string> = {
  Akan: "Akan", Akkadisch: "Akkadian", Altbulgarisch: "Old Bulgarian", Altchinesisch: "Old Chinese",
  Altenglisch: "Old English", Altfranzösisch: "Old French", Altfränkisch: "Old Frankish",
  Altgujarati: "Old Gujarati", Altkirchenslawisch: "Old Church Slavonic", Altmakedonisch: "Old Macedonian",
  Altmalaiisch: "Old Malay", Altnordisch: "Old Norse", Altostslawisch: "Old East Slavic",
  Altpersisch: "Old Persian", Altrajasthani: "Old Rajasthani", Alttibetisch: "Old Tibetan",
  Alttürkisch: "Old Turkic", Altägyptisch: "Old Egyptian", Amharisch: "Amharic",
  Amtssprache: "official language", Arabisch: "Arabic", Aramäisch: "Aramaic",
  Aserbaidschanisch: "Azerbaijani", Bambara: "Bambara", Banjaresisch: "Banjarese", Bengalisch: "Bengali",
  Berberisch: "Berber", Bima: "Bima", Birmanisch: "Burmese", Buginesisch: "Buginese",
  Bulgarisch: "Bulgarian", Baktrisch: "Bactrian", Chasarisch: "Khazar", Chinesisch: "Chinese",
  Dari: "Dari", Deutsch: "German", Dialekt: "dialect", Dialekte: "dialects", Elamisch: "Elamite",
  Englisch: "English", Französisch: "French", Fulfulde: "Fulfulde", Fur: "Fur", "Ge'ez": "Ge'ez",
  Gotisch: "Gothic", Griechisch: "Greek", Haitianisches: "Haitian", Harari: "Harari", Hausa: "Hausa",
  Hindavi: "Hindavi", Hindi: "Hindi", Hof: "court", Hofsprache: "court language", Hurritisch: "Hurrian",
  Indus: "Indus", Japanisch: "Japanese", Javanisch: "Javanese", "Jh.": "century", Kannada: "Kannada",
  Kanuri: "Kanuri", Karachanidisch: "Qarakhanid", Kasachisch: "Kazakh", Kaschmiri: "Kashmiri",
  Kaukasussprachen: "Caucasian languages", Khitanisch: "Khitan", Khmer: "Khmer", Kikongo: "Kikongo",
  Kiptschakisch: "Kipchak", Kirchensprache: "liturgical language", Klassisches: "Classical",
  Koine: "Koine", Koreanisch: "Korean", Kreol: "Creole", Krimtatarisch: "Crimean Tatar",
  Kultur: "culture", Kumanisch: "Cuman", Kurdisch: "Kurdish", Kutai: "Kutai", Latein: "Latin",
  Maba: "Maba", Maguindanaon: "Maguindanaon", Makassarisch: "Makassarese", Malaiisch: "Malay",
  Mandinka: "Mandinka", Mandschurisch: "Manchu", Marathi: "Marathi", Maya: "Mayan",
  Meroitisch: "Meroitic", Mittelchinesisch: "Middle Chinese", Mittelenglisch: "Middle English",
  Mittelpersisch: "Middle Persian", Mittelägyptisch: "Middle Egyptian", Mongolisch: "Mongolian",
  Nahuatl: "Nahuatl", Neuägyptisch: "Late Egyptian", Nogaiisch: "Nogai", Nubisch: "Nubian",
  Oghusisch: "Oghuz", "Oghusisch-Türkisch": "Oghuz Turkic", Oiratisch: "Oirat", Oromo: "Oromo",
  Osmanisch: "Ottoman", "Osmanisch-Türkisch": "Ottoman Turkish", Osten: "East", Parthisch: "Parthian",
  Paschtu: "Pashto", Persisch: "Persian", Phönizisch: "Phoenician", Portugiesisch: "Portuguese",
  Prakrit: "Prakrit", Punjabi: "Punjabi", Quechua: "Quechua", Regionalsprachen: "regional languages",
  Romanische: "Romance", Russisch: "Russian", Ryukyuanisch: "Ryukyuan", Sanskrit: "Sanskrit",
  Schrift: "script", Schwedisch: "Swedish", Serbisch: "Serbian", Sibirtatarisch: "Siberian Tatar",
  Sindhi: "Sindhi", Skythisch: "Scythian", Somali: "Somali", Songhai: "Songhai", Soninke: "Soninke",
  Spanisch: "Spanish", Sprache: "language", Sprachen: "languages", Sumerisch: "Sumerian",
  Sundanesisch: "Sundanese", Swahili: "Swahili", Tabaristan: "Tabaristan", Tamil: "Tamil",
  Tatarisch: "Tatar", Tausug: "Tausug", Telugu: "Telugu", Tocharisch: "Tocharian",
  Tongaisch: "Tongan", Tschagataisch: "Chagatai", Turkmenisch: "Turkmen", Turksprache: "Turkic language",
  Turksprachen: "Turkic languages", Twi: "Twi", Türkisch: "Turkish", Uigurisch: "Uyghur",
  Urdu: "Urdu", Usbekisch: "Uzbek", Verwaltung: "administration", Verwaltungssprache: "administrative language",
  Vietnamesisch: "Vietnamese", Volkssprachen: "vernacular languages", Westen: "West", Xiongnu: "Xiongnu",
  Yoruba: "Yoruba", ab: "from", assyrischer: "Assyrian", babylonischer: "Babylonian",
  bezeugt: "attested", dem: "the", entziffert: "deciphered", hunnisch: "Hunnic",
  indoeuropäisch: "Indo-European", iranische: "Iranian", kaum: "barely", klassifiziert: "classified",
  liturgisch: "liturgical", meroitisches: "Meroitic", mongolisch: "Mongolian", nicht: "not",
  para: "para", regionale: "regional", schlecht: "poorly", sicher: "certainly", spaeter: "later",
  später: "later", sumerisch: "Sumerian", "u.a.": "among others", unbekannt: "unknown", und: "and",
  unklar: "unclear", vermutlich: "presumably", vor: "pre-", weitere: "further", wie: "such as",
  zahlreiche: "numerous", zuvor: "previously",
};

// Moderne Sprachen: deutsches Wort → ISO-Code, der Name kommt dann aus dem
// Browser (Intl.DisplayNames) in der gewählten Sprache — kein Raten.
const WORD_ISO: Record<string, string> = {
  Arabisch: "ar", Persisch: "fa", Griechisch: "el", Latein: "la", Türkisch: "tr", Chinesisch: "zh",
  Japanisch: "ja", Koreanisch: "ko", Hindi: "hi", Urdu: "ur", Russisch: "ru", Deutsch: "de",
  Englisch: "en", Französisch: "fr", Spanisch: "es", Portugiesisch: "pt", Sanskrit: "sa",
  Mongolisch: "mn", Bengalisch: "bn", Tamil: "ta", Telugu: "te", Marathi: "mr", Punjabi: "pa",
  Kannada: "kn", Swahili: "sw", Amharisch: "am", Hausa: "ha", Yoruba: "yo", Somali: "so",
  Oromo: "om", Vietnamesisch: "vi", Khmer: "km", Birmanisch: "my", Malaiisch: "ms",
  Javanisch: "jv", Sundanesisch: "su", Kurdisch: "ku", Paschtu: "ps", Usbekisch: "uz",
  Kasachisch: "kk", Turkmenisch: "tk", Aserbaidschanisch: "az", Tatarisch: "tt",
  Bulgarisch: "bg", Serbisch: "sr", Schwedisch: "sv", Quechua: "qu", Sindhi: "sd",
};

// Verbindungswörter (Reihenfolge: es, fr, pt, tr, ru, el, ar, hi, zh, ja, ko)
const CONN_ORDER = ["es", "fr", "pt", "tr", "ru", "el", "ar", "hi", "zh", "ja", "ko"];
const CONN: Record<string, string[]> = {
  Hof: ["corte", "cour", "corte", "saray", "двор", "αυλή", "البلاط", "दरबार", "宫廷", "宮廷", "궁정"],
  Hofsprache: ["lengua cortesana", "langue de cour", "língua da corte", "saray dili", "придворный язык", "γλώσσα της αυλής", "لغة البلاط", "दरबारी भाषा", "宫廷语言", "宮廷語", "궁정어"],
  Turksprache: ["lengua túrquica", "langue turque", "língua túrquica", "Türk dili", "тюркский язык", "τουρκική γλώσσα", "لغة تركية", "तुर्क भाषा", "突厥语", "テュルク語", "튀르크어"],
  Turksprachen: ["lenguas túrquicas", "langues turques", "línguas túrquicas", "Türk dilleri", "тюркские языки", "τουρκικές γλώσσες", "اللغات التركية", "तुर्क भाषाएँ", "突厥语族", "テュルク諸語", "튀르크어족"],
  und: ["y", "et", "e", "ve", "и", "και", "و", "और", "和", "と", "및"],
  später: ["posterior", "plus tard", "depois", "daha sonra", "позднее", "αργότερα", "لاحقًا", "बाद में", "后来", "後に", "이후"],
  Dialekt: ["dialecto", "dialecte", "dialeto", "lehçe", "диалект", "διάλεκτος", "لهجة", "बोली", "方言", "方言", "방언"],
  Dialekte: ["dialectos", "dialectes", "dialetos", "lehçeler", "диалекты", "διάλεκτοι", "لهجات", "बोलियाँ", "方言", "諸方言", "방언"],
  Amtssprache: ["lengua oficial", "langue officielle", "língua oficial", "resmî dil", "официальный язык", "επίσημη γλώσσα", "لغة رسمية", "राजभाषा", "官方语言", "公用語", "공용어"],
  Verwaltungssprache: ["lengua administrativa", "langue administrative", "língua administrativa", "idarî dil", "административный язык", "διοικητική γλώσσα", "لغة إدارية", "प्रशासनिक भाषा", "行政语言", "行政言語", "행정 언어"],
  Kirchensprache: ["lengua litúrgica", "langue liturgique", "língua litúrgica", "ayin dili", "литургический язык", "λειτουργική γλώσσα", "لغة طقسية", "धार्मिक भाषा", "礼拜语言", "典礼言語", "전례 언어"],
  unbekannt: ["desconocido", "inconnu", "desconhecido", "bilinmiyor", "неизвестно", "άγνωστο", "غير معروف", "अज्ञात", "未知", "不明", "알 수 없음"],
  "Jh.": ["siglo", "siècle", "século", "yüzyıl", "в.", "αι.", "قرن", "सदी", "世纪", "世紀", "세기"],
};

const displayNamesCache: Record<string, Intl.DisplayNames | null> = {};
function isoName(code: string, lang: string): string | null {
  try {
    if (!(lang in displayNamesCache)) {
      displayNamesCache[lang] = new Intl.DisplayNames([lang], { type: "language" });
    }
    const n = displayNamesCache[lang]?.of(code);
    return n && n.toLowerCase() !== code ? n : null;
  } catch {
    return null;
  }
}

/**
 * Übersetzt eine deutsche Sprach-Angabe wortweise in die gewählte Sprache:
 * 1) Deutsch bleibt, 2) Sprachnamen kommen aus dem Browser (Intl), 3)
 * Verbindungswörter aus der Tabelle oben, 4) alte/seltene Sprachen aus dem
 * englischen Wörterbuch. Wörter ohne Eintrag bleiben unverändert stehen.
 */
export function translateLanguageValue(value: string, targetLang: string): string {
  if (targetLang === "de") return value;
  const ci = CONN_ORDER.indexOf(targetLang);
  return value.replace(/[A-Za-zÀ-ÿ'ʻ.]+/g, (word) => {
    const clean = word.replace(/\.$/, "");
    const dot = word.endsWith(".") && clean !== word;
    const key = LANGUAGE_WORD_EN[word] !== undefined || CONN[word] ? word : clean;
    if (ci >= 0 && CONN[key]) return CONN[key][ci] + (dot && key === clean ? "." : "");
    if (targetLang !== "en" && WORD_ISO[key]) {
      const n = isoName(WORD_ISO[key], targetLang);
      if (n) return n + (dot ? "." : "");
    }
    const en = LANGUAGE_WORD_EN[key];
    if (en) return en + (dot && key === clean ? "." : "");
    return word;
  });
}
