import { NextRequest, NextResponse } from "next/server";
import { getClientIp, isRateLimited } from "@/lib/security/rateLimit";
import { getEmpireFallback } from "@/data/empireFallbacks";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 60;

/**
 * GET /api/empires/info?name=Mongol%20Empire
 *
 * Liefert einen echten Info-Text (Wikipedia-Zusammenfassung + Bild + Sprache
 * über Wikidata) zu einem auf der /imperien-Karte angeklickten Gebiet/Reich
 * (Nutzerwunsch 18.09.2026: "wenn ich auf ein imperium drücke dann soll
 * ganze information davon kommen", später ergänzt um "bei allen imperiums
 * soll ein kleine text ... sprache von dem imperium auch dabei"). Nutzt
 * ausschließlich echte, öffentliche APIs (Wikipedia REST-Summary + Wikidata
 * P37/P2936) — keine Fantasie-Texte. Läuft serverseitig, damit kein
 * CORS/CSP-Problem im Browser entsteht.
 */

interface WikiSummary {
  type?: string;
  title?: string;
  extract?: string;
  thumbnail?: { source?: string };
  content_urls?: { desktop?: { page?: string } };
}

// Alle 13 vom Frontend unterstützten Sprachen entsprechen direkt gültigen
// Wikipedia-Sprachcodes (de.wikipedia.org, hi.wikipedia.org, ...). Nutzerwunsch
// 20.09.2026: "wenn auf anderen sprache gibt dann mach wenn zb manche sprache
// nicht existieren dann immer englisch" — Artikel wird zuerst in der aktuell
// gewählten UI-Sprache gesucht, bei Nichtfund (kein Artikel / kein Extract)
// automatisch auf Englisch zurückgefallen, und erst danach auf die
// redaktionelle Fallback-Beschreibung (siehe empireFallbacks.ts).
const SUPPORTED_WIKI_LANGS = [
  "de", "en", "hi", "zh", "ko", "ja", "es", "fr", "tr", "ru", "pt", "ar", "el",
] as const;
type WikiLang = (typeof SUPPORTED_WIKI_LANGS)[number];

function parseWikiLang(value: string | null): WikiLang {
  if (value && (SUPPORTED_WIKI_LANGS as readonly string[]).includes(value)) {
    return value as WikiLang;
  }
  return "en";
}

const FETCH_HEADERS = { "User-Agent": "Centaurian/1.0 (privates Hobby-Projekt)" };

// Wikipedia/Wikidata antworten unter kurzzeitiger Last mit 429 ("zu viele
// Anfragen") — ein einzelner Klick auf der Karte löst mehrere Anfragen
// nacheinander aus, das kann knapp reichen, um das auszulösen. Ein
// einmaliger kurzer Retry reicht in der Praxis, um das abzufangen, statt
// faelschlich "keine Beschreibung gefunden" zu zeigen.
async function fetchWithRetry(url: string): Promise<Response | null> {
  try {
    let res = await fetch(url, { next: { revalidate: 86400 }, headers: FETCH_HEADERS });
    let wait = 500;
    for (let attempt = 0; attempt < 3 && res.status === 429; attempt++) {
      await new Promise((r) => setTimeout(r, wait));
      wait *= 2;
      res = await fetch(url, { next: { revalidate: 86400 }, headers: FETCH_HEADERS });
    }
    return res;
  } catch {
    return null;
  }
}

async function fetchSummary(
  lang: WikiLang,
  title: string,
  debugTrace?: string[]
): Promise<WikiSummary | null> {
  const res = await fetchWithRetry(
    `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
  );
  if (!res) {
    debugTrace?.push(`fetchSummary:${lang}:${title} -> EXC`);
    return null;
  }
  if (!res.ok) {
    debugTrace?.push(`fetchSummary:${lang}:${title} -> HTTP ${res.status}`);
    return null;
  }
  try {
    const data: WikiSummary = await res.json();
    return data;
  } catch (e) {
    debugTrace?.push(`fetchSummary:${lang}:${title} -> PARSE_EXC ${String(e)}`);
    return null;
  }
}

// Viele Namen aus dem Geodaten-Set ("historical-basemaps") hängen ein
// generisches "Typ-Wort" an (Empire/Emirate/Khanate/Dynasty/Tribes/...),
// das im tatsächlichen Wikipedia-Artikeltitel oft fehlt oder anders lautet
// (z.B. "Ghaznavid Emirate" im Datenset, aber "Ghaznavids" oder "Ghaznavid
// dynasty" auf Wikipedia) — Nutzerkorrektur 18.09.2026: "es gibt bei vielen
// imperien keine infos". Diese Wörter werden deshalb beim Bilden von
// Alternativ-Suchbegriffen abgetrennt.
const GENERIC_TYPE_WORDS = new Set([
  "empire", "emirate", "emirates", "kingdom", "dynasty", "khanate", "khaganate",
  "kaganate", "caliphate", "sultanate", "tribe", "tribes", "culture", "cultures",
  "peoples", "people", "nomadic", "hunter-gatherers", "hunter", "gatherers",
  "farmers", "city-states", "states", "state", "confederation", "federation",
  "republic", "horde", "shogunate", "period", "era",
]);

function coreWords(name: string): string[] {
  return name
    .split(/\s+/)
    .filter((w) => w.length > 0 && !GENERIC_TYPE_WORDS.has(w.toLowerCase()));
}

// Mehrere plausible Artikeltitel-Varianten durchprobieren, bevor aufgegeben
// wird — der volle Name, der Name ohne generisches Typ-Wort, und dessen
// Plural- bzw. "dynasty"-Form (auf Wikipedia übliche Titelmuster für
// Herrscherhäuser).
function titleCandidates(name: string): string[] {
  const candidates = new Set<string>();
  candidates.add(name);
  const core = coreWords(name).join(" ");
  // Das BLOSSE Kernwort (z.B. nur "Byzantine") wird bewusst NICHT direkt
  // abgefragt — zu kurze/generische Titel treffen sonst leicht einen
  // völlig unrelated echten Artikel (Nutzerkorrektur 18.09.2026: "Byzantine
  // Empire" landete so bei einer US-Metal-Band namens "Byzantine"). Nur die
  // spezifischeren "Kern + dynasty/Plural"-Varianten werden direkt probiert.
  if (core && core !== name) {
    candidates.add(`${core} dynasty`);
    if (!core.toLowerCase().endsWith("s")) candidates.add(`${core}s`);
  }
  return Array.from(candidates);
}

async function searchTitle(lang: WikiLang, words: string[]): Promise<string | null> {
  if (words.length === 0) return null;
  try {
    // "intitle:" vor jedem Wort erzwingt, dass ALLE diese Wörter im
    // Artikeltitel vorkommen — eine normale Volltextsuche fand sonst auch
    // Artikel, die den Namen nur beiläufig im Fließtext erwähnen (z.B.
    // landete "West African Cereal Farmers" bei einem Schmetterlingsartikel,
    // "Byzantine Empire" bei einer US-Metal-Band namens "Byzantine" — beides
    // falsche Treffer). Lieber "keine Beschreibung gefunden" als eine falsche.
    const query = words.map((w) => `intitle:${w}`).join(" ");
    const url =
      `https://${lang}.wikipedia.org/w/api.php?action=query&list=search` +
      `&srsearch=${encodeURIComponent(query)}&srlimit=1&format=json&origin=*`;
    const res = await fetchWithRetry(url);
    if (!res || !res.ok) return null;
    const data = await res.json();
    const title = data?.query?.search?.[0]?.title;
    if (typeof title !== "string") return null;
    const titleLower = title.toLowerCase();
    const allPresent = words.every((w) => titleLower.includes(w.toLowerCase()));
    return allPresent ? title : null;
  } catch {
    return null;
  }
}

// Wikipedia-interne Weiterleitungen können einen abgeleiteten Titel
// (Plural-/"dynasty"-Variante, oder ein Suchtreffer) auf einen völlig
// unrelated Artikel umlenken, dessen Titel nur zufällig gleich lautet
// (Nutzerkorrektur 18.09.2026: "Mongols" landete bei "Mongols MC", einem
// Motorradclub, statt beim Mongolenreich). Für jeden Treffer, der NICHT der
// exakte, unveränderte Name aus den Kartendaten ist, wird deshalb über
// Wikidata (P31 "ist ein(e)") gegengeprüft, dass es sich nicht um eine
// bekannte falsche Kategorie handelt (Verein, Band, Film, ...). Lieber
// "keine Beschreibung gefunden" als ein falscher Treffer.
const BAD_INSTANCE_WORDS = [
  "motorcycle club", "outlaw motorcycle club", "biker gang", "gang",
  "band", "musical group", "rock band", "record label", "album", "song",
  "football club", "sports club", "sports team",
  "film", "television series", "web series", "video game", "novel", "comic",
  "company", "business", "corporation", "brand",
  "professional wrestling", "wrestler",
];

async function isPlausibleHistoricalEntity(
  lang: WikiLang,
  title: string,
  debugTrace?: string[]
): Promise<boolean> {
  const qid = await fetchWikidataId(lang, title);
  if (!qid) return true; // keine Wikidata-Daten -> nichts, was dagegen spricht
  const instanceLabels = await fetchInstanceOfLabels(qid);
  const bad = instanceLabels.find((label) =>
    BAD_INSTANCE_WORDS.some((word) => label.includes(word))
  );
  debugTrace?.push(`p31-check:${title} -> [${instanceLabels.join(", ")}]${bad ? " REJECTED:" + bad : ""}`);
  return !bad;
}

async function resolveSummary(
  lang: WikiLang,
  name: string,
  debugTrace?: string[]
): Promise<WikiSummary | null> {
  // 1) Direkte Treffer über mehrere plausible Titel-Varianten. Der erste
  //    Kandidat ist immer der unveränderte Original-Name — der wird
  //    vertraut. Abgeleitete Varianten (dynasty/Plural) werden zusätzlich
  //    über Wikidata gegengeprüft (siehe isPlausibleHistoricalEntity oben).
  const candidates = titleCandidates(name);
  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    const direct = await fetchSummary(lang, candidate, debugTrace);
    debugTrace?.push(
      `direct:${candidate} -> ${direct ? direct.title + " (" + direct.type + ")" : "null"}`
    );
    if (direct && direct.type !== "disambiguation" && direct.extract) {
      if (i === 0 || !direct.title) return direct;
      if (await isPlausibleHistoricalEntity(lang, direct.title, debugTrace)) return direct;
    }
  }
  // 2) Titel-Suche mit allen aussagekräftigen Wörtern (>=4 Zeichen) —
  //    ALLE müssen im Titel vorkommen (siehe intitle:-Kommentar in
  //    searchTitle). Bewusst KEIN Fallback mehr auf ein einzelnes
  //    "Kern"-Wort: das traf zuverlässig völlig unrelated Artikel (z.B.
  //    "Byzantine Empire" -> "Byzantine", eine US-Metal-Band, weil die
  //    Suche nach nur "Byzantine" den falschen, aber ähnlich benannten
  //    Artikel zuerst brachte). Lieber "keine Beschreibung gefunden" als
  //    ein falscher Treffer (Nutzerpräferenz: Antworten müssen geprüft/
  //    korrekt sein).
  const meaningfulWords = name.split(/\s+/).filter((w) => w.length >= 4);
  if (meaningfulWords.length >= 2) {
    const foundTitle = await searchTitle(lang, meaningfulWords);
    debugTrace?.push(`search:${meaningfulWords.join(",")} -> ${foundTitle ?? "null"}`);
    if (foundTitle) {
      const viaSearch = await fetchSummary(lang, foundTitle);
      if (
        viaSearch &&
        viaSearch.type !== "disambiguation" &&
        viaSearch.extract &&
        viaSearch.title &&
        (await isPlausibleHistoricalEntity(lang, viaSearch.title, debugTrace))
      ) {
        return viaSearch;
      }
    }
  }
  return null;
}

// Sprache(n) des Reichs über Wikidata (P37 "Amtssprache", ersatzweise P2936
// "verwendete Sprache") — Nutzerwunsch 18.09.2026: "bei allen imperiums soll
// ein kleine text neben stehen 'Sprache: ...'". Echte, strukturierte Daten
// statt Vermutung; bleibt leer, wenn Wikidata dazu nichts hat.
async function fetchWikidataId(lang: WikiLang, title: string): Promise<string | null> {
  try {
    const url =
      `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}` +
      `&prop=pageprops&ppprop=wikibase_item&format=json&origin=*`;
    const res = await fetchWithRetry(url);
    if (!res || !res.ok) return null;
    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return null;
    const page = Object.values(pages)[0] as { pageprops?: { wikibase_item?: string } } | undefined;
    return page?.pageprops?.wikibase_item ?? null;
  } catch {
    return null;
  }
}

// P31 ("ist ein(e)") in Kleinbuchstaben, englisch — nur für den
// Fehltreffer-Check in isPlausibleHistoricalEntity oben, nicht für die
// Anzeige.
async function fetchInstanceOfLabels(qid: string): Promise<string[]> {
  try {
    const claimsUrl =
      `https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${qid}` +
      `&property=P31&format=json&origin=*`;
    const claimsRes = await fetchWithRetry(claimsUrl);
    if (!claimsRes || !claimsRes.ok) return [];
    const claimsData = await claimsRes.json();
    const claims = claimsData?.claims?.P31;
    if (!Array.isArray(claims) || claims.length === 0) return [];
    const ids = claims
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((c: any) => c?.mainsnak?.datavalue?.value?.id)
      .filter((v: unknown): v is string => typeof v === "string");
    if (ids.length === 0) return [];
    const labelsUrl =
      `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${ids.join("|")}` +
      `&props=labels&languages=en&format=json&origin=*`;
    const labelsRes = await fetchWithRetry(labelsUrl);
    if (!labelsRes || !labelsRes.ok) return [];
    const labelsData = await labelsRes.json();
    return ids
      .map((id: string) => labelsData?.entities?.[id]?.labels?.en?.value)
      .filter((v: unknown): v is string => typeof v === "string")
      .map((v: string) => v.toLowerCase());
  } catch {
    return [];
  }
}

async function fetchLanguageLabels(
  qids: string[],
  lang: WikiLang
): Promise<string | null> {
  if (qids.length === 0) return null;
  try {
    const url =
      `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${qids.join("|")}` +
      `&props=labels&languages=${lang}|en&format=json&origin=*`;
    const res = await fetchWithRetry(url);
    if (!res || !res.ok) return null;
    const data = await res.json();
    const labels = qids
      .map((id) => {
        const entity = data?.entities?.[id];
        return entity?.labels?.[lang]?.value ?? entity?.labels?.en?.value ?? null;
      })
      .filter((v): v is string => Boolean(v));
    return labels.length > 0 ? labels.slice(0, 3).join(", ") : null;
  } catch {
    return null;
  }
}

async function fetchLanguage(qid: string, lang: WikiLang): Promise<string | null> {
  try {
    for (const property of ["P37", "P2936"]) {
      const url =
        `https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${qid}` +
        `&property=${property}&format=json&origin=*`;
      const res = await fetchWithRetry(url);
      if (!res || !res.ok) continue;
      const data = await res.json();
      const claims = data?.claims?.[property];
      if (!Array.isArray(claims) || claims.length === 0) continue;
      const qids = claims
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((c: any) => c?.mainsnak?.datavalue?.value?.id)
        .filter((v: unknown): v is string => typeof v === "string");
      const label = await fetchLanguageLabels(qids, lang);
      if (label) return label;
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(`empires-info:${ip}`, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS)) {
    return NextResponse.json(
      { error: "Zu viele Anfragen, bitte kurz warten." },
      { status: 429 }
    );
  }

  const name = req.nextUrl.searchParams.get("name")?.trim();
  if (!name) {
    return NextResponse.json({ error: "Kein Name angegeben." }, { status: 400 });
  }

  const debug = req.nextUrl.searchParams.get("debug") === "1";
  const trace: string[] = [];

  // Nutzerwunsch 20.09.2026: "wenn auf anderen sprache gibt dann mach wenn
  // zb manche sprache nicht existieren dann immer englisch" — zuerst in der
  // aktuell gewählten UI-Sprache suchen (?lang=…), sonst direkt Englisch.
  const uiLang = parseWikiLang(req.nextUrl.searchParams.get("lang"));

  let data = await resolveSummary(uiLang, name, debug ? trace : undefined);
  let lang: WikiLang = uiLang;

  if ((!data || !data.extract) && uiLang !== "en") {
    const enData = await resolveSummary("en", name, debug ? trace : undefined);
    if (enData && enData.extract) {
      data = enData;
      lang = "en";
    }
  }

  if (!data || !data.extract) {
    // Kein Wikipedia-Artikel gefunden — fuer einige bedeutende Reiche gibt
    // es eine redaktionell verfasste Kurzbeschreibung als Fallback (siehe
    // src/data/empireFallbacks.ts), z.B. weil der Name im Kartendatenset
    // vom echten Wikipedia-Titel abweicht.
    const fallback = getEmpireFallback(name);
    if (fallback) {
      return NextResponse.json({
        found: true,
        title: fallback.title,
        extract: fallback.extract,
        thumbnail: null,
        pageUrl: null,
        language: fallback.language,
        lang: "de",
        source: "editorial",
        ...(debug ? { trace } : {}),
      });
    }
    return NextResponse.json({ found: false, ...(debug ? { trace } : {}) });
  }

  let language: string | null = null;
  let debugQid: string | null = null;
  if (data.title) {
    debugQid = await fetchWikidataId(lang, data.title);
    if (debugQid) language = await fetchLanguage(debugQid, lang);
  }

  return NextResponse.json({
    found: true,
    title: data.title ?? name,
    extract: data.extract,
    thumbnail: data.thumbnail?.source ?? null,
    pageUrl: data.content_urls?.desktop?.page ?? null,
    language,
    lang,
    ...(debug ? { trace, debugQid } : {}),
  });
}
