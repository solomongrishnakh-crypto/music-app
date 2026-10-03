import type { Metadata } from "next";
import { UNIVERSE_KEYWORDS } from "@/lib/seoKeywords";

// Eigene Suchmaschinen-Angaben für /universum (die Seite selbst ist eine
// Client-Komponente und kann deshalb kein metadata exportieren).
// Nutzerwunsch 30.09.2026: auch bei Suchen nach der Zahnrad-Maschine
// ("Maschine der Ewigkeit", "Zahnrad 13,8 Milliarden Jahre", engl. "gear
// machine") und nach dem Sonnensystem (live, echte Positionen) gefunden
// werden — deshalb stehen genau diese Begriffe in Titel und Beschreibung.
const TITLE = "Sonnensystem live & Maschine der Ewigkeit — Universum entdecken";
const DESCRIPTION =
  "Interaktives Sonnensystem mit echten Planeten-Positionen (NASA-Daten), echtem Maßstab und Zoom. Dazu die Maschine der Ewigkeit: Zahnräder, deren letztes sich erst in 13,8 Milliarden Jahren einmal dreht — plus Alter des Universums live. Solar system live, eternity gear machine.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: UNIVERSE_KEYWORDS,
  alternates: { canonical: "/universum" },
  openGraph: { url: "/universum", title: `${TITLE} | CENTAURIAN`, description: DESCRIPTION },
  twitter: { title: `${TITLE} | CENTAURIAN`, description: DESCRIPTION },
};

// Strukturierte Daten: interaktive Lern-Anwendung zu Sonnensystem & Kosmos
const JSON_LD = {
  "@context": "https://schema.org",
  keywords: UNIVERSE_KEYWORDS.join(", "),
  "@type": "WebApplication",
  name: "Sonnensystem live & Maschine der Ewigkeit — Centaurian",
  alternateName: ["Interaktives Sonnensystem", "Maschine der Ewigkeit", "Interactive Solar System", "Eternity Gear Machine"],
  url: "https://centaurian.vercel.app/universum",
  description: DESCRIPTION,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  inLanguage: ["de", "en", "es", "fr", "tr", "ru", "pt", "ar", "el", "hi", "zh", "ko", "ja"],
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  about: ["Sonnensystem", "Planeten", "Universum", "Astronomie"],
  isPartOf: { "@type": "WebSite", name: "Centaurian", url: "https://centaurian.vercel.app" },
};

export default function UniversumLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      {children}
    </>
  );
}
