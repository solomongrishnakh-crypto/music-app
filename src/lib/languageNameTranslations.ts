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

/**
 * Übersetzt eine deutsche Sprach-Angabe wortweise ins Englische. Wörter
 * ohne Eintrag im Wörterbuch (z.B. Satzzeichen, unbekannte Fachbegriffe)
 * bleiben unveraendert stehen, statt die ganze Zeile zu verwerfen.
 */
export function translateLanguageValue(value: string, targetLang: string): string {
  if (targetLang !== "en") return value;
  return value.replace(/[A-Za-zÀ-ÿ'ʻ.]+/g, (word) => {
    const clean = word.replace(/\.$/, "");
    const withDot = LANGUAGE_WORD_EN[word];
    if (withDot) return withDot;
    const plain = LANGUAGE_WORD_EN[clean];
    if (plain) return word.endsWith(".") ? `${plain}.` : plain;
    return word;
  });
}
