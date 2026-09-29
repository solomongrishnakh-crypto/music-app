/**
 * Zweiter Weg zu den Reich-Infos: direkt aus dem Browser bei Wikipedia
 * nachfragen, wenn /api/empires/info nichts gefunden hat.
 *
 * Nutzerkorrektur 29.09.2026 ("manche Imperien haben keine Infos"): Der
 * Server auf Vercel teilt sich seine IP-Adressen mit vielen anderen Seiten
 * und bekam von Wikipedia oft HTTP 429 ("zu viele Anfragen") — selbst für
 * eindeutige Artikel wie "Goryeo". Aus dem Browser kommt die Anfrage von
 * der IP des Besuchers und wird praktisch nie gedrosselt. Wikipedias
 * REST- und Such-API erlauben das ausdrücklich (CORS, origin=*).
 *
 * Bewusst dieselben vorsichtigen Regeln wie auf dem Server: keine
 * Begriffsklärungsseiten, das blanke Kernwort ("Byzantine") wird nicht
 * direkt abgefragt, und bei der Suche müssen alle Wörter im Titel stehen.
 */

import { wikiLookupName } from "@/data/empireWikiAliases";

export interface ClientWikiInfo {
  found: true;
  title: string;
  extract: string;
  thumbnail: string | null;
  pageUrl: string | null;
  language: null;
  lang: string;
  source: "wikipedia";
}

const SUPPORTED = ["de", "en", "hi", "zh", "ko", "ja", "es", "fr", "tr", "ru", "pt", "ar", "el"];

const GENERIC_TYPE_WORDS = new Set([
  "empire", "emirate", "emirates", "kingdom", "dynasty", "khanate", "khaganate",
  "kaganate", "caliphate", "sultanate", "tribe", "tribes", "culture", "cultures",
  "peoples", "people", "confederation", "federation", "republic", "horde",
  "shogunate", "period", "era", "city-states", "states", "state", "occupation",
]);

interface Summary {
  type?: string;
  description?: string;
  title?: string;
  extract?: string;
  thumbnail?: { source?: string };
  content_urls?: { desktop?: { page?: string } };
}

async function summary(lang: string, title: string): Promise<Summary | null> {
  try {
    const res = await fetch(
      `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
    );
    if (!res.ok) return null;
    const data: Summary = await res.json();
    if (data.type === "disambiguation" || !data.extract) return null;
    return data;
  } catch {
    return null;
  }
}

async function searchTitles(lang: string, words: string[]): Promise<string[]> {
  if (words.length === 0) return [];
  try {
    const query = words.map((w) => `intitle:${w}`).join(" ");
    const res = await fetch(
      `https://${lang}.wikipedia.org/w/api.php?action=query&list=search` +
        `&srsearch=${encodeURIComponent(query)}&srlimit=5&format=json&origin=*`
    );
    if (!res.ok) return [];
    const data = await res.json();
    const results: { title?: string }[] = data?.query?.search ?? [];
    const maxWords = Math.max(words.length * 2, words.length + 3);
    return results
      .map((r) => r.title)
      .filter((t): t is string => typeof t === "string")
      .filter((t) => words.every((w) => t.toLowerCase().includes(w.toLowerCase())))
      .filter((t) => t.split(/\s+/).length <= maxWords);
  } catch {
    return [];
  }
}

function candidates(name: string): string[] {
  const list = [name];
  const core = name
    .split(/\s+/)
    .filter((w) => w && !GENERIC_TYPE_WORDS.has(w.toLowerCase()))
    .join(" ");
  if (core && core !== name) {
    list.push(`${core} dynasty`);
    if (!core.toLowerCase().endsWith("s")) list.push(`${core}s`);
  }
  return list;
}

function toInfo(lang: string, s: Summary): ClientWikiInfo {
  return {
    found: true,
    title: s.title ?? "",
    extract: s.extract ?? "",
    thumbnail: s.thumbnail?.source ?? null,
    pageUrl: s.content_urls?.desktop?.page ?? null,
    language: null,
    lang,
    source: "wikipedia",
  };
}

async function langLinkTitle(fromLang: string, title: string, toLang: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://${fromLang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}` +
        `&redirects=1&prop=langlinks&lllang=${toLang}&format=json&origin=*`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data?.query?.pages ?? {};
    const page = Object.values(pages)[0] as { langlinks?: { "*"?: string }[] } | undefined;
    const t = page?.langlinks?.[0]?.["*"];
    return typeof t === "string" ? t : null;
  } catch {
    return null;
  }
}

// Für abgeleitete Titel ("Small Horde" → "Smalls") und Suchtreffer muss die
// Kurzbeschreibung nach etwas Historischem klingen — sonst landet man bei
// Bands, Firmen usw. Nur für die englische Wikipedia, deren Kurz-
// beschreibungen (Wikidata) fast immer gesetzt sind.
const HISTORICAL_HINT =
  /\b(dynasty|empire|kingdom|state|polity|sultanate|khanate|khaganate|caliphate|emirate|country|people|peoples|civili[sz]ation|ethnic|nomadic|culture|century|centuries|historical|historic|former|confederation|confederacy|principality|duchy|county|republic|tribe|monarchy|realm|region|bc|bce|ad|ce|ruler|rulers|chiefdom|city-state|shogunate|horde|colony|colonies)\b/i;

function looksHistorical(lang: string, s: Summary): boolean {
  if (lang !== "en" || !s.description) return true;
  return HISTORICAL_HINT.test(s.description);
}

// Beziehungs-/Listen-Artikel sind nie das gesuchte Reich selbst.
const BAD_TITLE = /(\brelations\b|^list of\b|^timeline of\b|\bbibliography\b)/i;

/**
 * derived=false: nur der exakte Name und Suchtreffer (für die UI-Sprache,
 * deren Artikel keine verlässliche Kurzbeschreibung haben — dort landete
 * "Mongol Khanate" → "Mongols" sonst bei einem Motorradclub).
 */
async function findIn(lang: string, name: string, derived = true): Promise<Summary | null> {
  const titles = derived ? candidates(name) : [name];
  for (let i = 0; i < titles.length; i++) {
    const s = await summary(lang, titles[i]);
    if (s && (i === 0 || looksHistorical(lang, s))) return s;
  }
  const words = name.split(/\s+/).filter((w) => w.length >= 3);
  for (const title of await searchTitles(lang, words)) {
    if (BAD_TITLE.test(title)) continue;
    const s = await summary(lang, title);
    if (s && looksHistorical(lang, s)) return s;
  }
  return null;
}

/**
 * Die Namen im Kartendatensatz sind englisch → zuerst auf der englischen
 * Wikipedia suchen und dann über den Sprachlink zum Artikel in der
 * UI-Sprache springen (wie der Server). Erst wenn es englisch nichts gibt,
 * direkt in der UI-Sprache suchen (z.B. bei Herrschernamen aus dem Suchfeld).
 */
export async function lookupWikiInBrowser(rawName: string, uiLang: string): Promise<ClientWikiInfo | null> {
  const ui = SUPPORTED.includes(uiLang) ? uiLang : "en";
  const name = wikiLookupName(rawName);
  const en = await findIn("en", name);
  if (en) {
    if (ui !== "en" && en.title) {
      const uiTitle = await langLinkTitle("en", en.title, ui);
      const local = uiTitle ? await summary(ui, uiTitle) : null;
      if (local) return toInfo(ui, local);
    }
    return toInfo("en", en);
  }
  if (ui !== "en") {
    const local = await findIn(ui, name, false);
    if (local) return toInfo(ui, local);
  }
  return null;
}
