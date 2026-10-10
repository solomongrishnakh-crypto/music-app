import type { MetadataRoute } from "next";
import { REICHE_INDEX } from "@/lib/history/reiche";
import { ALL_LANGS, BASE_URL, hreflang } from "@/lib/seoI18n";
import { SPACE_BODIES } from "@/components/space/bodies";
import { CONSTELLATIONS } from "@/components/space/ConstView";

/**
 * sitemap.xml — alle Seiten in allen 13 Sprachen (Deutsch ohne Präfix,
 * sonst /en/…, /es/… usw.), jeweils mit Verweis auf die anderen
 * Sprachversionen (hreflang). Nutzerwunsch 07.10.2026: internationale Besucher.
 */
type Entry = MetadataRoute.Sitemap[number];

function withLangs(path: string, priority: number, changeFrequency: Entry["changeFrequency"]): Entry[] {
  const now = new Date();
  const languages: Record<string, string> = {};
  for (const [k, v] of Object.entries(hreflang(path))) languages[k] = BASE_URL + v;
  return ALL_LANGS.map((l) => ({
    url: BASE_URL + (l === "de" ? path : path === "/" ? `/${l}` : `/${l}${path}`),
    lastModified: now,
    changeFrequency,
    priority: l === "de" || l === "en" ? priority : Math.max(0.3, priority - 0.1),
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...withLangs("/", 1, "weekly"),
    ...withLangs("/universum", 0.8, "monthly"),
    ...withLangs("/sternenhimmel", 0.8, "monthly"),
    ...withLangs("/himmel-heute", 0.8, "daily"),
    ...withLangs("/imperien", 0.8, "monthly"),
    ...withLangs("/imperien/reiche", 0.7, "monthly"),
    ...REICHE_INDEX.flatMap((r) => withLangs(`/imperien/reich/${r.slug}`, 0.6, "yearly")),
    ...withLangs("/sonnensystem", 0.7, "monthly"),
    ...SPACE_BODIES.flatMap((b) => withLangs(`/sonnensystem/${b.id}`, 0.6, "monthly")),
    ...withLangs("/maschine-der-ewigkeit", 0.7, "yearly"),
    ...withLangs("/sternbilder", 0.7, "monthly"),
    ...CONSTELLATIONS.flatMap((c) => withLangs(`/sternbilder/${c.slug}`, 0.6, "yearly")),
  ];
}
