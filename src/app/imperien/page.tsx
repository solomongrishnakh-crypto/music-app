import type { Metadata } from "next";
import ImperienClient from "./ImperienClient";
import { EMPIRES_KEYWORDS } from "@/lib/seoKeywords";

const DESCRIPTION =
  "Interaktive Weltgeschichte-Karte: alle Reiche, Imperien und Grenzen von 3400 v. Chr. bis heute, Jahr für Jahr auf einer Zeitleiste. Kostenlos, mit Infos zu jedem Reich. World history map with empires and borders.";

// Strukturierte Daten (nur auf der Karte selbst, nicht auf den Reich-Seiten): Google versteht die Seite als interaktive Karte/
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



/**
 * /imperien — die eigentliche Karte steckt in ImperienClient (läuft im
 * Browser). Diese Server-Hülle gibt geteilten Links wie /imperien?jahr=1200
 * eine eigene Vorschau (Titel + Kartenbild "Die Welt um 1200 n. Chr.") für
 * WhatsApp, X, Telegram & Co. (Nutzerwunsch 07.10.2026: mehr Besucher).
 * Die Vorschaubilder liegen fertig in public/og/imperien/ (alle 50 Jahre,
 * 3400 v. Chr. bis 2000, dazu 2024).
 */
type Props = { searchParams: Promise<{ jahr?: string | string[] }> };

function parseYear(raw: string | string[] | undefined): number | null {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v === undefined || v.trim() === "") return null;
  const y = Math.round(Number(v));
  if (!Number.isFinite(y)) return null;
  return Math.min(2024, Math.max(-3400, y));
}

function ogImageYear(y: number): number {
  if (y >= 2012) return 2024;
  return Math.min(2000, Math.max(-3400, Math.round(y / 50) * 50));
}

function formatYearDe(y: number): string {
  return y < 0 ? `${-y} v. Chr.` : `${y} n. Chr.`;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const year = parseYear((await searchParams).jahr);
  if (year === null) return {};
  const label = formatYearDe(year);
  const title = `Die Welt im Jahr ${label} — Weltgeschichte Karte`;
  const description = `So sah die Welt im Jahr ${label} aus: alle Reiche, Imperien und Grenzen auf der interaktiven Weltgeschichte-Karte. Kostenlos durch jedes Jahr von 3400 v. Chr. bis heute spulen.`;
  const image = {
    url: `/og/imperien/${ogImageYear(year)}.jpg`,
    width: 1200,
    height: 630,
    alt: `Weltkarte der Reiche um ${label}`,
  };
  return {
    title,
    description,
    // Suchmaschinen sollen nur EINE Kartenseite führen, nicht 5000 Jahres-Varianten
    alternates: { canonical: "/imperien" },
    openGraph: {
      type: "website",
      siteName: "Centaurian",
      url: `/imperien?jahr=${year}`,
      title: `${title} | CENTAURIAN`,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | CENTAURIAN`,
      description,
      images: [image.url],
    },
  };
}

export default function ImperienPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <ImperienClient />
    </>
  );
}
