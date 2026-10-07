import type { MetadataRoute } from "next";
import { REICHE_INDEX } from "@/lib/history/reiche";

/**
 * sitemap.xml — Liste aller Seiten für Google & Co., damit sie gefunden
 * und schneller aufgenommen werden. Neue Seiten hier ergänzen.
 */
const BASE = "https://centaurian.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE + "/", lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: BASE + "/universum", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: BASE + "/sternenhimmel", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: BASE + "/imperien", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: BASE + "/imperien/reiche", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    // eine Seite pro Reich (Nutzerwunsch 07.10.2026: mehr Besucher über Google)
    ...REICHE_INDEX.map((r) => ({
      url: `${BASE}/imperien/reich/${r.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
