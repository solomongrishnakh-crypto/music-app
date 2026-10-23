/**
 * Kartennamen, die auf Wikipedia mehrdeutig sind → eindeutiger
 * Artikeltitel (englische Wikipedia). Nutzerkorrektur 29.09.2026 ("manche
 * Imperien haben keine Infos"): Cliopatria benennt z.B. die Staaten der
 * Zhou-Zeit nur "Qi", "Song", "Wei" — "Song" landete dadurch beim Artikel
 * über Musikstücke, "Qi" bei einer Begriffsklärung. Nur Einträge, bei denen
 * Zeitraum im Datensatz und Artikel eindeutig zusammenpassen
 * (alle Titel am 29.09.2026 gegen die englische Wikipedia geprüft).
 */
export const EMPIRE_WIKI_ALIASES: Record<string, string> = {
  // Staaten der Zhou-Zeit (Frühlings- und Herbstannalen / Streitende Reiche)
  Cai: "Cai (state)",
  Cao: "Cao (state)",
  Chen: "Chen (state)",
  Chu: "Chu (state)",
  Han: "Han (Warring States)",
  Jin: "Jin (Chinese state)",
  Lu: "Lu (state)",
  Qi: "Qi (state)",
  Qin: "Qin (state)",
  Song: "Song (state)",
  Teng: "Teng (state)",
  Wei: "Wei (state)",
  Wey: "Wey (state)",
  Wu: "Wu (state)",
  Xu: "Xu (state)",
  Yan: "Yan (state)",
  Yue: "Yue (state)",
  Zhao: "Zhao (state)",
  Zheng: "Zheng (state)",
  Zhongshan: "Zhongshan (state)",
  // spätere Reiche mit sehr kurzen Namen
  Min: "Min (Ten Kingdoms)",
  Xia: "Xia (Sixteen Kingdoms)",
  Norse: "Norsemen",
  // sonst Straße von Kertsch / "Armenia–United Kingdom relations" / Rockerclub
  "Cimmerian Bosporus": "Bosporan Kingdom",
  "Kingdom of Armenia": "Kingdom of Armenia (antiquity)",
  "Mongol Khanate": "Northern Yuan",
  // lieferte den Artikel der Staatsreederei IRISL statt des Landes
  "Islamic Republic of Iran": "Iran",
  // lieferte "Russians" (Lied von Sting)
  // Heutige Länder, bei denen die Suche den falschen/keinen Artikel lieferte
  // (alle 190 Namen des Jahres 2024 am 23.10.2026 gegen die Live-Seite geprüft)
  "Communist Laos": "Laos",
  "Estado Novo": "Estado Novo (Portugal)",
  "Federated Republic of Germany": "Germany",
  "Second Republic of Austria": "Austria",
  "Sultanate of Brunei": "Brunei",
  "Union of Myanmar": "Myanmar",
  "People's Republic of Angola": "Angola",
  Micronesia: "Federated States of Micronesia",
  "Saint Kitts": "Saint Kitts and Nevis",
  "Russian Federation": "Russia",
  "(Russian Federation)": "Russia",
};

export function wikiLookupName(name: string): string {
  return EMPIRE_WIKI_ALIASES[name] ?? name;
}
