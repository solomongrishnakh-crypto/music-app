import type { Metadata } from "next";

/**
 * Sternenhimmel (Nutzerwunsch 01.10.2026: "wie Star Walk 2").
 *
 * Die eigentliche Ansicht ist eine eigenständige Seite in
 * public/sternenhimmel.html (Canvas + WebGL, ohne React — so läuft sie
 * flüssig und unabhängig vom Rest der Webseite). Hier wird sie bildschirm-
 * füllend eingebettet; diese Datei liefert Titel/Beschreibung für Google.
 * "allow" erlaubt Standort und Lagesensor (Handy in den Himmel halten).
 */
const TITLE = "Sternenhimmel live — welche Sterne siehst du gerade?";
const DESCRIPTION =
  "Interaktive Sternkarte für deinen Ort: echte Sterne, Sternbilder, Planeten, Mond und Milchstraße — live oder zu jeder Uhrzeit. Handy in den Himmel halten, Sterne antippen und Entfernung, Typ und Temperatur sehen. Night sky map, star finder.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Sternenhimmel heute",
    "Sternenhimmel live",
    "Sternkarte",
    "welcher Stern ist das",
    "Sternbilder finden",
    "Planeten am Himmel heute",
    "Milchstraße sehen",
    "night sky map",
    "star finder",
    "star map live",
  ],
  alternates: { canonical: "/sternenhimmel" },
  openGraph: { url: "/sternenhimmel", title: `${TITLE} | CENTAURIAN`, description: DESCRIPTION },
  twitter: { title: `${TITLE} | CENTAURIAN`, description: DESCRIPTION },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Sternenhimmel live — Centaurian",
  alternateName: ["Sternkarte", "Night Sky Map", "Star Finder"],
  url: "https://centaurian.vercel.app/sternenhimmel",
  description: DESCRIPTION,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  inLanguage: ["de", "en", "es", "fr", "tr", "ru", "pt", "ar", "el", "hi", "zh", "ko", "ja"],
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  about: ["Sternenhimmel", "Sterne", "Sternbilder", "Planeten", "Milchstraße", "Astronomie"],
  isPartOf: { "@type": "WebSite", name: "Centaurian", url: "https://centaurian.vercel.app" },
};

export default function SternenhimmelPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <h1 className="sr-only">{TITLE}</h1>
      <iframe
        src="/sternenhimmel.html"
        title="Sternenhimmel"
        allow="geolocation; accelerometer; gyroscope; magnetometer; fullscreen"
        className="fixed inset-0 z-[3000] h-[100dvh] w-full border-0 bg-[#06082a]"
      />
    </>
  );
}
