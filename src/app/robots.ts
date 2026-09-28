import type { MetadataRoute } from "next";

/**
 * robots.txt — erlaubt Suchmaschinen ausdrücklich das Crawlen der ganzen
 * Seite (außer den internen API-Routen) und verweist auf die Sitemap.
 * Nutzerwunsch 28.09.2026: "meine Webseite ist nicht bei der Suche sichtbar".
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: "https://centaurian.vercel.app/sitemap.xml",
    host: "https://centaurian.vercel.app",
  };
}
