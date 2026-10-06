import type { Metadata } from "next";
import { SKY_KEYWORDS } from "@/lib/seoKeywords";

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
  "Interaktive Sternkarte für deinen Ort: 108.000 echte Sterne in Teleskop-Farben, Sternbilder, Planeten, Mond und Milchstraße — live oder zu jeder Uhrzeit. Handy in den Himmel halten (Gyro), Sterne antippen und Entfernung, Typ, Temperatur und Wissen dazu sehen. Night sky map, star finder.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: SKY_KEYWORDS,
  alternates: { canonical: "/sternenhimmel" },
  openGraph: { url: "/sternenhimmel", title: `${TITLE} | CENTAURIAN`, description: DESCRIPTION },
  twitter: { title: `${TITLE} | CENTAURIAN`, description: DESCRIPTION },
};

const JSON_LD = {
  "@context": "https://schema.org",
  keywords: SKY_KEYWORDS.join(", "),
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
  featureList: [
    "108.000 echte Sterne in Teleskop-Farben",
    "88 Sternbilder mit Linien und Figuren",
    "Planeten, Mond und Sonne mit Entfernung zur Erde",
    "Handy-Sensor (Gyro und Kompass)",
    "Infos und Wikipedia-Wissen beim Antippen",
    "13 Sprachen",
  ],
  isPartOf: { "@type": "WebSite", name: "Centaurian", url: "https://centaurian.vercel.app" },
};

export default function SternenhimmelPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <h1 className="sr-only">{TITLE}</h1>
      {/* Beschreibender Text für Suchmaschinen und Screenreader (die Ansicht
          selbst ist eine Grafik im iframe und für Google kaum lesbar) */}
      <section className="sr-only">
        <h2>Interaktive Sternkarte — kostenlos im Browser</h2>
        <p>
          Sieh dir den Sternenhimmel für deinen Ort an, live oder zu jeder Uhrzeit: über 108.000 echte Sterne in
          ihren Teleskop-Farben, alle 88 Sternbilder mit Linien und Figuren, Planeten, Mond, Sonne, Milchstraße,
          Galaxien und Nebel.
        </p>
        <ul>
          <li>Handy in den Himmel halten: die Karte folgt Kompass und Lagesensor wie ein echtes Gyroskop.</li>
          <li>Stern, Planet oder Sternbild antippen: Entfernung, Lichtlaufzeit, Sterntyp, Temperatur, Helligkeit und Wissen aus Wikipedia.</li>
          <li>Planeten mit Abstand zur Erde, Phase, Auf- und Untergang.</li>
          <li>Suche nach Sternen, Planeten und Sternbildern, weltweite Ortswahl und Zeitreise.</li>
          <li>In 13 Sprachen verfügbar, ohne Anmeldung und ohne App-Installation.</li>
        </ul>
      </section>
      <iframe
        src="/sternenhimmel.html"
        title="Sternenhimmel"
        allow="geolocation; accelerometer; gyroscope; magnetometer; fullscreen; autoplay; encrypted-media"
        className="fixed inset-0 z-[3000] h-[100dvh] w-full border-0 bg-[#06082a]"
      />
    </>
  );
}
