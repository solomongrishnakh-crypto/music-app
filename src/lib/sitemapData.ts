import type { Lang } from "@/contexts/LanguageContext";
import { REICHE_INDEX } from "@/lib/history/reiche";
import { ALL_LANGS, BASE_URL, hreflang, langPath } from "@/lib/seoI18n";
import { SPACE_BODIES } from "@/components/space/bodies";
import { SKY_ENTRIES } from "@/lib/skyPosData";
import { TOPICS } from "@/lib/probeTopics";
import { CONSTELLATIONS } from "@/components/space/ConstView";
import { FAMOUS } from "@/lib/famousObjects";
import { STARS } from "@/lib/starPages";
import { REL_KEYS, REL_SLUG } from "@/lib/religion/text";
import { DESTS, VEHICLES, travelPath } from "@/lib/travelTime";

/**
 * Sitemap in Bereichen (12.11.2026, für mehr Reichweite):
 * /sitemap.xml ist ein Index, jeder Bereich hat eine eigene Datei unter
 * /sitemaps/<bereich>.xml. Vorteile: die Search Console zeigt die
 * Indexierung pro Bereich, und keine Datei kommt mehr in die Nähe der
 * Größengrenze (vorher eine Datei mit 15 MB).
 *
 * lastmod: echte Daten aus dem Git-Verlauf, nicht „heute“ — Google nutzt
 * lastmod nur, wenn es stimmt. Bei einer inhaltlichen Änderung an einem
 * Bereich das passende Datum hier nachtragen.
 *
 * priority/changefreq entfallen: Google ignoriert beide.
 */
const D = (s: string) => new Date(s + "T00:00:00Z");
const LAUNCH = D("2026-10-07"); // alle 15 Sprachen online
const SKY_UPDATED = D("2026-10-22"); // Kepler, Venus, berühmte Objekte
const CONST_UPDATED = D("2026-10-18"); // Sternbild-Seiten überarbeitet
const BODIES_UPDATED = D("2026-10-23"); // New Horizons, Pioneer 10/11
const STARS_ADDED = D("2026-10-27"); // 165 Sterne mit eigenem Text
const RELIGIONS_ADDED = D("2026-10-30"); // Religionskarte + 12 Seiten
const EMPIRES_UPDATED = D("2026-11-05"); // Abschnitte Vergleich + Häufige Fragen
const SKYPOS_ADDED = D("2026-11-05"); // Himmelsposition, Schallplatte, Plakette

export type SitemapEntry = { url: string; lastModified: Date; alternates: Record<string, string> };

/** Seite in allen 15 Sprachen, jeweils mit Verweis auf die anderen (hreflang). */
function withLangs(path: string, lastModified: Date): SitemapEntry[] {
  const alternates: Record<string, string> = {};
  for (const [k, v] of Object.entries(hreflang(path))) alternates[k] = BASE_URL + v;
  return ALL_LANGS.map((l: Lang) => ({ url: BASE_URL + langPath(path, l), lastModified, alternates }));
}

/** Nur Deutsch + Englisch (diese Seiten gibt es nicht in allen 15 Sprachen). */
function deEn(path: string, lastModified: Date): SitemapEntry[] {
  const alternates = { de: BASE_URL + langPath(path, "de"), en: BASE_URL + langPath(path, "en"), "x-default": BASE_URL + langPath(path, "en") };
  return (["de", "en"] as const).map((l) => ({ url: BASE_URL + langPath(path, l), lastModified, alternates }));
}

function today(): Date {
  return D(new Date().toISOString().slice(0, 10));
}

/** Die Bereiche — zusammen genau dieselben Adressen wie die frühere eine Sitemap. */
export const SITEMAP_SECTIONS: Record<string, () => SitemapEntry[]> = {
  seiten: () => [
    ...withLangs("/", SKY_UPDATED),
    ...withLangs("/universum", LAUNCH),
    ...withLangs("/sternenhimmel", SKY_UPDATED),
    ...withLangs("/himmel-heute", today()),
    ...withLangs("/imperien", LAUNCH),
    ...withLangs("/imperien/reiche", LAUNCH),
    ...withLangs("/imperien/werkzeuge", LAUNCH),
    ...withLangs("/religionen", RELIGIONS_ADDED),
    ...withLangs("/sonnensystem", LAUNCH),
    ...withLangs("/groessenvergleich", LAUNCH),
    ...withLangs("/weltraum-rechner", LAUNCH),
    ...withLangs("/geburtstag", LAUNCH),
    ...withLangs("/app", LAUNCH),
    ...withLangs("/musik", LAUNCH),
    ...withLangs("/maschine-der-ewigkeit", LAUNCH),
  ],
  imperien: () => REICHE_INDEX.flatMap((r) => withLangs(`/imperien/reich/${r.slug}`, EMPIRES_UPDATED)),
  religionen: () => REL_KEYS.flatMap((k) => deEn(`/religionen/${REL_SLUG[k]}`, RELIGIONS_ADDED)),
  themen: () => TOPICS.flatMap((t) => deEn(t.path, SKYPOS_ADDED)),
  himmelsposition: () => [
    ...deEn("/himmelsposition", SKYPOS_ADDED),
    ...SKY_ENTRIES.flatMap((e) => deEn(`/himmelsposition/${e.id}`, SKYPOS_ADDED)),
  ],
  sonnensystem: () => SPACE_BODIES.flatMap((b) => withLangs(`/sonnensystem/${b.id}`, BODIES_UPDATED)),
  reisezeit: () => DESTS.flatMap((d) => VEHICLES.flatMap((v) => withLangs(travelPath(d, v), LAUNCH))),
  objekte: () => [...deEn("/objekte", SKY_UPDATED), ...FAMOUS.flatMap((o) => deEn(`/objekte/${o.id}`, SKY_UPDATED))],
  sterne: () => [...deEn("/sterne", STARS_ADDED), ...STARS.flatMap((s) => deEn(`/sterne/${s[0]}`, STARS_ADDED))],
  sternbilder: () => [
    ...withLangs("/sternbilder", CONST_UPDATED),
    ...CONSTELLATIONS.flatMap((c) => withLangs(`/sternbilder/${c.slug}`, CONST_UPDATED)),
  ],
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
const day = (d: Date) => d.toISOString().slice(0, 10);

/** Eine Bereichs-Sitemap als XML (mit hreflang-Verweisen). */
export function urlsetXml(entries: SitemapEntry[]): string {
  const rows = entries.map((e) => {
    const alts = Object.entries(e.alternates)
      .map(([l, href]) => `<xhtml:link rel="alternate" hreflang="${esc(l)}" href="${esc(href)}" />`)
      .join("");
    return `<url><loc>${esc(e.url)}</loc>${alts}<lastmod>${day(e.lastModified)}</lastmod></url>`;
  });
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    rows.join("\n") +
    `\n</urlset>\n`
  );
}

/** Der Index (/sitemap.xml): eine Zeile pro Bereich, lastmod = neueste Seite darin. */
export function indexXml(): string {
  const rows = Object.entries(SITEMAP_SECTIONS).map(([name, build]) => {
    const last = build().reduce((m, e) => (e.lastModified > m ? e.lastModified : m), new Date(0));
    return `<sitemap><loc>${BASE_URL}/sitemaps/${name}.xml</loc><lastmod>${day(last)}</lastmod></sitemap>`;
  });
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    rows.join("\n") +
    `\n</sitemapindex>\n`
  );
}

export const XML_HEADERS = { "Content-Type": "application/xml; charset=utf-8" };