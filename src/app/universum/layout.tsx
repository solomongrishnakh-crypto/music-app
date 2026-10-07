import type { Metadata } from "next";
import { UNIVERSE_KEYWORDS } from "@/lib/seoKeywords";
import { hreflang } from "@/lib/seoI18n";

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
  alternates: { canonical: "/universum", languages: hreflang("/universum") },
  openGraph: {
    type: "website",
    siteName: "Centaurian",
    url: "/universum",
    title: `${TITLE} | CENTAURIAN`,
    description: DESCRIPTION,
    images: [{ url: "/branding/og-image.jpg", width: 1200, height: 630, alt: "Centaurian" }],
  },
  twitter: { card: "summary_large_image", title: `${TITLE} | CENTAURIAN`, description: DESCRIPTION, images: ["/branding/og-image.jpg"] },
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

// Fragen & Antworten für Google und KI-Assistenten (Nutzerwunsch 03.10.2026:
// "KI soll alle Tools und Details auslesen können") — die 3D-Ansichten selbst
// sind Grafik und für Maschinen nicht lesbar.
const FAQ_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Was ist die Maschine der Ewigkeit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Eine 3D-Zahnrad-Maschine, die symbolisch seit dem Urknall läuft. Jedes Zahnrad treibt das nächste an, aber sechsmal langsamer: das erste dreht sich in etwa 3 Sekunden, das zweite in etwa 20 Sekunden, das dritte in etwa 2 Minuten. Das letzte Zahnrad braucht für eine einzige Umdrehung 13,8 Milliarden Jahre – so lange, wie das Universum existiert. Eine rote Markierung zeigt, wie weit sich jedes Rad seit dem Urknall gedreht hat.",
      },
    },
    {
      "@type": "Question",
      name: "What is the eternity machine (gear machine)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A 3D chain of gears that has symbolically been running since the Big Bang. Each gear turns the next one six times slower; the last gear needs 13.8 billion years – the age of the universe – for a single turn.",
      },
    },
    {
      "@type": "Question",
      name: "Was zeigt das Sonnensystem live?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Eine echte 3D-Ansicht des Sonnensystems mit den aktuellen Positionen aller Planeten aus NASA/JPL-Bahndaten, Zwergplaneten und Raumsonden wie Voyager 1. Die Planeten bewegen sich in Echtzeit, das Datum ist frei wählbar, Abstände zur Erde und echter Maßstab lassen sich anzeigen. Ein Planet antippen zeigt seinen Steckbrief.",
      },
    },
    {
      "@type": "Question",
      name: "Was ist Universum in Zahlen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ein Live-Zähler für das Alter des Universums (etwa 13,797 Milliarden Jahre nach der Planck-Messung) und Fakten-Karten mit Erklärungen: beobachtbares Universum (etwa 93 Milliarden Lichtjahre), Anzahl der Galaxien, Dunkle Materie, Dunkle Energie, Schwarze Löcher, Exoplaneten und mehr.",
      },
    },
  ],
};

export default function UniversumLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }} />
      {children}
    </>
  );
}
