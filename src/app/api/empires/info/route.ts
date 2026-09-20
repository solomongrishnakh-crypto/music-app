import { NextRequest, NextResponse } from "next/server";
import { getClientIp, isRateLimited } from "@/lib/security/rateLimit";
import { getEmpireFallback, getEmpireLanguage } from "@/data/empireFallbacks";

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
    // Nutzerkorrektur 20.09.2026 ("such alles durch und fixier es" /
    // wiederholt "es lädt immer noch lang") — Next.js' Data-Cache
    // speicherte JEDE Antwort inkl. Fehlschlaegen (429/Timeout) fuer volle
    // 24h ("next: { revalidate: 86400 }"), sodass ein einmaliger
    // Netzwerk-Hänger ein Reich einen ganzen Tag lang faelschlich auf
    // "keine Beschreibung gefunden" festnagelte — auch nach Redeploys.
    // Erfolgreiche Treffer werden weiterhin kurz gecacht (Performance),
    // aber deutlich kuerzer, damit ein schlechter Treffer sich schnell
    // selbst heilt; Retry-Versuche umgehen den Cache komplett.
    let res = await fetch(url, { next: { revalidate: 900 }, headers: FETCH_HEADERS });
    let wait = 500;
    for (let attempt = 0; attempt < 3 && res.status === 429; attempt++) {
      await new Promise((r) => setTimeout(r, wait));
      wait *= 2;
      res = await fetch(url, { cache: "no-store", headers: FETCH_HEADERS });
    }
    return res;
  } catch {
    // Nutzerkorrektur 20.09.2026 ("ungenaue beschreibung" — "Roman Empire"
    // landete bei einem unrelated Nachschlagewerk-Artikel): ein einmaliger
    // Netzwerk-Fehler (Exception, nicht 429) liess den DIREKTEN
    // Exakt-Namen-Treffer zuvor sofort aufgeben und in die deutlich
    // unsicherere Volltextsuche abrutschen, statt es einfach nochmal zu
    // versuchen. Ein einziger stiller Retry hier verhindert genau das.
    try {
      return await fetch(url, { cache: "no-store", headers: FETCH_HEADERS });
    } catch {
      return null;
    }
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
    if (!allPresent) return null;
    // Nutzerkorrektur 20.09.2026 ("ungenaue beschreibung" — "Roman Empire"
    // landete bei "The Prosopography of the Later Roman Empire", einem
    // akademischen Nachschlagewerk ÜBER das Römische Reich, nicht dem Reich
    // selbst — enthielt zufaellig alle gesuchten Wörter im Titel). Zwei
    // zusaetzliche Filter: (1) Nachschlagewerk-/Meta-Titel explizit
    // ausschliessen, (2) ein Titel, der mehr als doppelt so viele Wörter hat
    // wie die Originalsuche, ist so gut wie nie der gesuchte Artikel selbst,
    // sondern ein Artikel, der das Thema nur ausfuehrlich im Titel erwaehnt.
    if (isReferenceWorkTitle(title)) return null;
    if (title.split(/\s+/).length > words.length * 2) return null;
    return title;
  } catch {
    return null;
  }
}

// Siehe Kommentar in searchTitle oben.
const REFERENCE_WORK_PATTERN =
  /^(the\s+)?(prosopography|bibliography|historiography|encyclopedia|encyclopaedia|dictionary|glossary|index|catalogue|catalog|timeline|chronology|list|who'?s who|database)\b|\bbibliography of\b|\bdictionary of\b|\bencyclopedia of\b/i;

function isReferenceWorkTitle(title: string): boolean {
  return REFERENCE_WORK_PATTERN.test(title);
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
  // Nutzerkorrektur 20.09.2026 ("ungenaue beschreibung") — akademische
  // Nachschlagewerke UEBER ein Reich (Buecher, Datenbanken, Journale)
  // werden sonst faelschlich als der Artikel ÜBER das Reich selbst
  // akzeptiert.
  "book", "reference work", "academic journal", "scholarly journal",
  "encyclopedia", "database", "bibliography", "prosopography",
  "biographical dictionary", "monograph",
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
  // Nutzerwunsch 20.09.2026 ("es ladet sehr langsam") — die bis zu 3
  // Titel-Kandidaten UND die Volltextsuche liefen vorher alle NACHEINANDER
  // (bis zu 4-5 Anfragen in Reihe), bevor bei einem Reich ohne Artikel
  // aufgegeben wurde. Jetzt parallel abgefeuert: die Gesamtwartezeit ist
  // dann nur noch die langsamste einzelne Anfrage statt die Summe aller.
  const candidates = titleCandidates(name);
  const meaningfulWords = name.split(/\s+/).filter((w) => w.length >= 4);
  const [directResults, foundTitle] = await Promise.all([
    Promise.all(candidates.map((c) => fetchSummary(lang, c, debugTrace))),
    meaningfulWords.length >= 2 ? searchTitle(lang, meaningfulWords) : Promise.resolve(null),
  ]);

  // 1) Direkte Treffer über mehrere plausible Titel-Varianten. Der erste
  //    Kandidat ist immer der unveränderte Original-Name — der wird
  //    vertraut. Abgeleitete Varianten (dynasty/Plural) werden zusätzlich
  //    über Wikidata gegengeprüft (siehe isPlausibleHistoricalEntity oben).
  for (let i = 0; i < candidates.length; i++) {
    const direct = directResults[i];
    debugTrace?.push(
      `direct:${candidates[i]} -> ${direct ? direct.title + " (" + direct.type + ")" : "null"}`
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
  debugTrace?.push(`search:${meaningfulWords.join(",")} -> ${foundTitle ?? "null"}`);
  if (foundTitle) {
    const viaSearch = await fetchSummary(lang, foundTitle, debugTrace);
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
  return null;
}

// Sprache(n) des Reichs über Wikidata (P37 "Amtssprache", ersatzweise P2936
// "verwendete Sprache") — Nutzerwunsch 18.09.2026: "bei allen imperiums soll
// ein kleine text neben stehen 'Sprache: ...'". Echte, strukturierte Daten
// statt Vermutung; bleibt leer, wenn Wikidata dazu nichts hat.
async function fetchWikidataId(lang: WikiLang, title: string): Promise<string | null> {
  try {
    // Nutzerwunsch 20.09.2026: "sprache soll hier bekannt sein" — ohne
    // redirects=1 lieferte die Query-API keine Wikidata-ID, wenn der Titel
    // (z.B. ein über die Volltextsuche gefundener) intern eine Weiterleitung
    // ist, statt automatisch zur Zielseite aufzulösen.
    const url =
      `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}` +
      `&redirects=1&prop=pageprops&ppprop=wikibase_item&format=json&origin=*`;
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

// Nutzerwunsch 20.09.2026: "kann diese fenster auch übersetzt werden?" — der
// Info-Text im Detailfenster blieb bei manchen Reichen Englisch, obwohl es
// durchaus einen Artikel in der UI-Sprache gibt (z.B. "Seljuk Empire" vs.
// deutsch "Seldschuken") — die reine Titel-Rateunion in titleCandidates()
// findet solche abweichend benannten Artikel nicht. Über Wikidata (Q-ID des
// bereits gefundenen Artikels) lässt sich der ECHTE Artikeltitel in jeder
// anderen Sprache nachschlagen (sitelinks), statt weiter zu raten.
async function fetchSitelinkTitle(qid: string, lang: WikiLang): Promise<string | null> {
  try {
    const site = `${lang}wiki`;
    const url =
      `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${qid}` +
      `&props=sitelinks&sitefilter=${site}&format=json&origin=*`;
    const res = await fetchWithRetry(url);
    if (!res || !res.ok) return null;
    const data = await res.json();
    const title = data?.entities?.[qid]?.sitelinks?.[site]?.title;
    return typeof title === "string" ? title : null;
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
    // Nutzerwunsch 20.09.2026 ("es ladet immer noch lang") — statt P37,
    // P2936 und P103 in drei GETRENNTEN Anfragen nacheinander abzufragen,
    // holt EIN Aufruf ohne "&property=" ALLE Claims der Q-ID auf einmal;
    // die drei Sprach-Eigenschaften werden danach nur noch lokal aus der
    // bereits geladenen Antwort herausgefiltert — spart 2 Netzwerk-Runden.
    const claimsUrl =
      `https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${qid}&format=json&origin=*`;
    const claimsRes = await fetchWithRetry(claimsUrl);
    if (!claimsRes || !claimsRes.ok) return null;
    const data = await claimsRes.json();
    // P37 "Amtssprache", P2936 "verwendete Sprache", P103 "Muttersprache",
    // P1412 "gesprochene/geschriebene Sprache(n)" (bei historischen
    // Dynastien oft die einzige gepflegte Angabe von allen vieren).
    for (const property of ["P37", "P2936", "P103", "P1412"]) {
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

  // Nutzerwunsch 20.09.2026 ("es ladet sehr langsam") — Zielsprache UND
  // Englisch (als Fallback) werden IMMER gleichzeitig abgefragt statt erst
  // die Zielsprache zu Ende zu versuchen und danach separat Englisch zu
  // starten. Das braucht bei Erfolg in der Zielsprache zwar eine unnötige
  // Anfrage mehr, macht aber den "nicht gefunden"-Fall (beide schlagen
  // fehl) doppelt so schnell, weil beide Versuche parallel statt
  // nacheinander laufen.
  const [uiResult, enPreload] =
    uiLang === "en"
      ? [await resolveSummary("en", name, debug ? trace : undefined), null]
      : await Promise.all([
          resolveSummary(uiLang, name, debug ? trace : undefined),
          resolveSummary("en", name, debug ? trace : undefined),
        ]);

  let data = uiResult;
  let lang: WikiLang = uiLang;
  let resolvedQid: string | null = null;

  if ((!data || !data.extract) && uiLang !== "en") {
    const enData = enPreload;
    if (enData && enData.extract) {
      // Nutzerwunsch 20.09.2026: "kann diese fenster auch übersetzt werden?"
      // — bevor auf Englisch zurückgefallen wird, über Wikidata prüfen, ob
      // es unter einem ANDEREN Titel doch einen Artikel in der UI-Sprache
      // gibt (z.B. "Seljuk Empire" -> QID -> deutscher Sitelink "Seldschuken",
      // den die reine Titel-Rateunion oben nicht finden konnte).
      let uiLangData: WikiSummary | null = null;
      let enQid: string | null = null;
      if (enData.title) {
        enQid = await fetchWikidataId("en", enData.title);
        if (enQid) {
          const uiTitle = await fetchSitelinkTitle(enQid, uiLang);
          if (debug) trace.push(`sitelink:${enQid}:${uiLang} -> ${uiTitle ?? "null"}`);
          if (uiTitle) {
            uiLangData = await fetchSummary(uiLang, uiTitle, debug ? trace : undefined);
          }
        }
      }
      if (uiLangData && uiLangData.extract) {
        data = uiLangData;
        lang = uiLang;
        // Nutzerwunsch 20.09.2026: "sprache soll hier bekannt sein" — die
        // Q-ID kennen wir hier schon (aus dem Sitelink-Schritt) und müssen
        // sie NICHT nochmal über den (ggf. leicht abweichenden) Titel in
        // der UI-Sprache neu auflösen, was zuvor manchmal fehlschlug.
        resolvedQid = enQid;
      } else {
        data = enData;
        lang = "en";
        resolvedQid = enQid;
      }
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

  // Nutzerkorrektur 20.09.2026 ("keine bekannte sprache bei ... byzantine
  // und viele andere ... jede imperium soll bekannte sprache angezeigt
  // werden") — die kuratierte Sprach-Liste (empireFallbacks.ts) wird JETZT
  // ZUERST geprueft, nicht erst als Rueckfallebene nach einer Wikidata-
  // Anfrage: fuer sehr viele historische Dynastien/Sultanate hat Wikidata
  // ohnehin keine strukturierten Sprachdaten, sodass die Anfrage nur Zeit
  // kostet, bevor doch die kuratierte Angabe verwendet wird. Das macht den
  // haeufigen Fall (Sprache ist kuratiert bekannt) sowohl schneller als
  // auch zuverlaessiger.
  let language: string | null = getEmpireLanguage(name);
  let debugQid: string | null = resolvedQid;
  if (!language) {
    if (!debugQid && data.title) {
      debugQid = await fetchWikidataId(lang, data.title);
    }
    if (debugQid) language = await fetchLanguage(debugQid, lang);
  }
  if (!language) {
    language = getEmpireFallback(name)?.language ?? null;
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
