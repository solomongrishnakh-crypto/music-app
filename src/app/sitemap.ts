import type { MetadataRoute } from "next";

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
    { url: BASE + "/imperien", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];
}
