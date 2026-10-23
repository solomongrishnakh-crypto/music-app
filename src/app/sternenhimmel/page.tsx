import type { Metadata } from "next";
import Link from "next/link";
import { SKY_KEYWORDS } from "@/lib/seoKeywords";
import { hreflang } from "@/lib/seoI18n";

/**
 * Sternenhimmel (Nutzerwunsch 01.10.2026: "wie Star Walk 2").
 *
 * Die eigentliche Ansicht ist eine eigenständige Seite in
 * public/sternenhimmel.html (Canvas + WebGL, ohne React — so läuft sie
 * flüssig und unabhängig vom Rest der Webseite). Hier wird sie bildschirm-
 * füllend eingebettet; diese Datei liefert Titel/Beschreibung für Google.
 * "allow" erlaubt Standort und Lagesensor (Handy in den Himmel halten).
 */
const TITLE = "Sternenhimmel live – wo stehen Sterne & Planeten gerade?";
const DESCRIPTION =
  "Halte dein Handy in den Himmel und sieh sofort, welcher Stern oder Planet das ist – live für deinen Ort, am Handy oder PC. Kostenlos, ohne App: 108.000 Sterne, Mond, ISS.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: SKY_KEYWORDS,
  alternates: { canonical: "/sternenhimmel", languages: hreflang("/sternenhimmel") },
  openGraph: {
    type: "website",
    siteName: "Centaurian",
    url: "/sternenhimmel",
    title: `${TITLE} | CENTAURIAN`,
    description: DESCRIPTION,
    images: [{ url: "/og/sternenhimmel.jpg", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: "summary_large_image", title: `${TITLE} | CENTAURIAN`, description: DESCRIPTION, images: ["/og/sternenhimmel.jpg"] },
};

const JSON_LD = {
  "@context": "https://schema.org",
  keywords: SKY_KEYWORDS.join(", "),
  "@type": "WebApplication",
  name: "Sternenhimmel live — Centaurian",
  alternateName: ["Sternkarte", "Night Sky Map", "Star Finder"],
  url: "https://centaurianspace.com/sternenhimmel",
  description: DESCRIPTION,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  inLanguage: ["de", "en", "es", "fr", "tr", "ru", "pt", "ar", "el", "hi", "zh", "ko", "ja", "id", "fa"],
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
  isPartOf: { "@type": "WebSite", name: "Centaurian", url: "https://centaurianspace.com" },
};

type Props = { searchParams: Promise<{ c?: string | string[]; p?: string | string[]; d?: string | string[]; g?: string | string[] }> };

/** ?c=Ori (Link von einer Sternbild-Seite) → an die Ansicht weitergeben */
function constParam(raw: string | string[] | undefined): string {
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v && /^[A-Za-z]{3}$/.test(v) ? `?c=${v}` : "";
}

/** ?p=jupiter (Link von „Himmel heute“) → Planet auswählen */
const PLANET_PARAM = /^(mercury|venus|mars|jupiter|saturn|uranus|neptune|moon)$/;
function planetParam(raw: string | string[] | undefined, sep: string): string {
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v && PLANET_PARAM.test(v) ? `${sep}p=${v}` : "";
}

/** ?d=M31 (Link aus der Suche) → Galaxie/Nebel/Sternhaufen auswählen */
function dsoParam(raw: string | string[] | undefined, sep: string): string {
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v && /^[A-Za-z0-9 ]{1,12}$/.test(v) ? `${sep}d=${encodeURIComponent(v)}` : "";
}

export default async function SternenhimmelPage({ searchParams }: Props) {
  const sp = await searchParams;
  const c0 = constParam(sp.c);
  const c1 = c0 + planetParam(sp.p, c0 ? "&" : "?");
  const c2 = c1 + dsoParam(sp.d, c1 ? "&" : "?");
  // ?g=1 (Link aus dem Sonnensystem) → Lagesensor automatisch starten
  const c = c2 + (sp.g === "1" ? `${c2 ? "&" : "?"}g=1` : "");
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
          <li>
            Berühmte Objekte: Sagittarius A* (das Schwarze Loch der Milchstraße), TON 618, UY Scuti, VY Canis Majoris,
            Eta Carinae, R136a1, Cygnus X-1, Proxima Centauri, Andromeda-Galaxie, Orionnebel, Plejaden, Krebsnebel,
            Antennen-Galaxien, Stephans Quintett, Hoags Objekt und viele mehr, mit echten Fotos von NASA, ESA und Hubble.
          </li>
          <li>Kepler-Exoplaneten: über 2.700 bestätigte Planeten bei fast 2.000 Sternen, an der echten Position am Himmel.</li>
          <li>Venus mit Originalfotos der sowjetischen Venera-Sonden, von Magellan und Akatsuki.</li>
          <li>In 13 Sprachen verfügbar, ohne Anmeldung und ohne App-Installation.</li>
        </ul>
        <p>
          <Link href="/objekte">Berühmte Objekte: Schwarze Löcher, Riesensterne und Nebel mit Fakten und Fotos</Link>
        </p>
        <p>
          <Link href="/himmel-heute">Himmel heute: welche Planeten man heute Nacht sieht, Mondphase und nächste Ereignisse</Link>
        </p>
      </section>
      <iframe
        src={`/sternenhimmel.html${c}`}
        title="Sternenhimmel"
        allow="geolocation; accelerometer; gyroscope; magnetometer; fullscreen; autoplay; encrypted-media"
        className="fixed inset-0 z-[3000] h-[100dvh] w-full border-0 bg-black"
      />
    </>
  );
}
