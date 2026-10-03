import type { Metadata } from "next";
import { EMPIRES_KEYWORDS } from "@/lib/seoKeywords";

// Eigene Suchmaschinen-Angaben für /imperien (Client-Seite → metadata hier).
// Nutzerwunsch 30.09.2026: Seite soll z.B. bei "Weltgeschichte Karte"
// gefunden werden → Titel/Beschreibung enthalten die Begriffe, nach denen
// Leute tatsächlich suchen (Weltgeschichte, historische Karte, Weltkarte,
// Reiche/Imperien, Grenzen, Zeitleiste) — auf Deutsch und Englisch.
const TITLE = "Weltgeschichte Karte — interaktive historische Weltkarte";
const DESCRIPTION =
  "Interaktive Weltgeschichte-Karte: alle Reiche, Imperien und Grenzen von 3400 v. Chr. bis heute, Jahr für Jahr auf einer Zeitleiste. Kostenlos, mit Infos zu jedem Reich. World history map with empires and borders.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: EMPIRES_KEYWORDS,
  alternates: { canonical: "/imperien" },
  openGraph: { url: "/imperien", title: `${TITLE} | CENTAURIAN`, description: DESCRIPTION },
  twitter: { title: `${TITLE} | CENTAURIAN`, description: DESCRIPTION },
};

// Strukturierte Daten: Google versteht die Seite als interaktive Karte/
// Web-Anwendung zum Thema Weltgeschichte.
const JSON_LD = {
  "@context": "https://schema.org",
  keywords: EMPIRES_KEYWORDS.join(", "),
  "@type": "WebApplication",
  name: "Weltgeschichte Karte — Centaurian",
  alternateName: ["Interaktive historische Weltkarte", "World History Map"],
  url: "https://centaurian.vercel.app/imperien",
  description: DESCRIPTION,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  inLanguage: ["de", "en", "es", "fr", "tr", "ru", "pt", "ar", "el", "hi", "zh", "ko", "ja"],
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  about: ["Weltgeschichte", "Historische Karte", "Imperien", "Historische Grenzen"],
  temporalCoverage: "-3400/2024",
  isPartOf: { "@type": "WebSite", name: "Centaurian", url: "https://centaurian.vercel.app" },
};

export default function ImperienLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      {children}
    </>
  );
}
