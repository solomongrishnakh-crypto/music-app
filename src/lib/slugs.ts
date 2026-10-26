/**
 * Adressen pro Sprache. Deutsch bleibt bei den deutschen Namen (/imperien),
 * alle anderen Sprachen bekommen englische Adressen (/en/empires, /fr/empires …).
 * Die Seiten selbst liegen weiter unter den deutschen Ordnernamen; next.config.ts
 * schreibt die englischen Adressen intern darauf um und leitet alte Adressen
 * (/en/imperien) dauerhaft auf die neuen weiter.
 * Reihenfolge wichtig: längere Pfade zuerst.
 */
export const SLUG_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ["/imperien/reiche", "/empires/list"],
  ["/imperien/werkzeuge", "/empires/tools"],
  ["/imperien/reich", "/empires/empire"],
  ["/imperien", "/empires"],
  ["/sonnensystem", "/solar-system"],
  ["/sternbilder", "/constellations"],
  ["/objekte", "/objects"],
  ["/sterne", "/stars"],
  ["/datenschutz", "/privacy"],
  ["/sternenhimmel", "/night-sky"],
  ["/universum", "/universe"],
  ["/geburtstag", "/birthday"],
  ["/groessenvergleich", "/size-comparison"],
  ["/himmel-heute", "/sky-today"],
  ["/weltraum-rechner", "/space-calculator"],
  ["/maschine-der-ewigkeit", "/eternity-machine"],
  ["/reisezeit", "/travel-time"],
  ["/musik", "/music"],
];

function swap(path: string, from: 0 | 1): string {
  const to = from === 0 ? 1 : 0;
  for (const pair of SLUG_PAIRS) {
    const a = pair[from];
    if (path.startsWith(a)) {
      const next = path.charAt(a.length);
      if (next === "" || next === "/" || next === "?" || next === "#") return pair[to] + path.slice(a.length);
    }
  }
  return path;
}

/** Deutscher Pfad → Pfad ohne Sprachpräfix, wie er in anderen Sprachen heißt. */
export const toIntlSlugs = (path: string) => swap(path, 0);
/** Englische Adresse → deutscher Pfad. */
export const toDeSlugs = (path: string) => swap(path, 1);
