import type { MetadataRoute } from "next";
import { REICHE_INDEX } from "@/lib/history/reiche";
import { ALL_LANGS, BASE_URL, hreflang, langPath } from "@/lib/seoI18n";
import { SPACE_BODIES } from "@/components/space/bodies";
import { CONSTELLATIONS } from "@/components/space/ConstView";
import { FAMOUS } from "@/lib/famousObjects";
import { STARS } from "@/lib/starPages";
import { DESTS, VEHICLES, travelPath } from "@/lib/travelTime";

/**
 * sitemap.xml — alle Seiten in allen 13 Sprachen (Deutsch ohne Präfix,
 * sonst /en/…, /es/… usw.), jeweils mit Verweis auf die anderen
 * Sprachversionen (hreflang). Nutzerwunsch 07.10.2026: internationale Besucher.
 */
type Entry = MetadataRoute.Sitemap[number];

/**
 * lastmod: echte, stabile Daten statt „jetzt bei jedem Build“ — Google
 * ignoriert lastmod, wenn es immer sich selbst ändert. Nur Seiten, die sich
 * wirklich geändert haben, bekommen ein neueres Datum.
 */
const LAUNCH = new Date("2026-10-07T00:00:00Z"); // alle 15 Sprachen online
const SKY_UPDATED = new Date("2026-10-22T00:00:00Z"); // Kepler, Venus, berühmte Objekte
const FRESH = new Set(["/", "/sternenhimmel"]);

function withLangs(path: string, priority: number, changeFrequency: Entry["changeFrequency"]): Entry[] {
  const now = path === "/himmel-heute" ? new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z") : FRESH.has(path) ? SKY_UPDATED : LAUNCH;
  const languages: Record<string, string> = {};
  for (const [k, v] of Object.entries(hreflang(path))) languages[k] = BASE_URL + v;
  return ALL_LANGS.map((l) => ({
    url: BASE_URL + langPath(path, l),
    lastModified: now,
    changeFrequency,
    priority: l === "de" || l === "en" ? priority : Math.max(0.3, priority - 0.1),
    alternates: { languages },
  }));
}

/** Nur Deutsch + Englisch (diese Seiten gibt es nicht in allen 15 Sprachen). */
function deEn(path: string, priority: number): Entry[] {
  const languages = { de: BASE_URL + langPath(path, "de"), en: BASE_URL + langPath(path, "en"), "x-default": BASE_URL + langPath(path, "en") };
  return (["de", "en"] as const).map((l) => ({ url: BASE_URL + langPath(path, l), lastModified: SKY_UPDATED, changeFrequency: "monthly" as const, priority, alternates: { languages } }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...withLangs("/", 1, "weekly"),
    ...withLangs("/universum", 0.8, "monthly"),
    ...withLangs("/sternenhimmel", 0.8, "monthly"),
    ...withLangs("/himmel-heute", 0.8, "daily"),
    ...withLangs("/imperien", 0.8, "monthly"),
    ...withLangs("/imperien/reiche", 0.7, "monthly"),
    ...withLangs("/imperien/werkzeuge", 0.7, "monthly"),
    ...REICHE_INDEX.flatMap((r) => withLangs(`/imperien/reich/${r.slug}`, 0.6, "yearly")),
    ...withLangs("/sonnensystem", 0.7, "monthly"),
    ...SPACE_BODIES.flatMap((b) => withLangs(`/sonnensystem/${b.id}`, 0.6, "monthly")),
    ...withLangs("/groessenvergleich", 0.9, "monthly"),
    ...withLangs("/weltraum-rechner", 0.9, "monthly"),
    ...withLangs("/geburtstag", 0.8, "monthly"),
    ...DESTS.flatMap((d) => VEHICLES.flatMap((v) => withLangs(travelPath(d, v), 0.6, "yearly"))),
    ...withLangs("/app", 0.8, "monthly"),
    ...withLangs("/musik", 0.9, "monthly"),
    ...withLangs("/maschine-der-ewigkeit", 0.7, "yearly"),
    ...deEn("/objekte", 0.8),
    ...FAMOUS.flatMap((o) => deEn(`/objekte/${o.id}`, 0.8)),
    ...deEn("/sterne", 0.8),
    ...STARS.flatMap((s) => deEn(`/sterne/${s[0]}`, 0.7)),
    ...withLangs("/sternbilder", 0.7, "monthly"),
    ...CONSTELLATIONS.flatMap((c) => withLangs(`/sternbilder/${c.slug}`, 0.6, "yearly")),
  ];
}
