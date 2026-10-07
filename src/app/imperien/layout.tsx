import type { Metadata } from "next";
import { EMPIRES_KEYWORDS } from "@/lib/seoKeywords";
import { hreflang } from "@/lib/seoI18n";

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
  alternates: { canonical: "/imperien", languages: hreflang("/imperien") },
  openGraph: {
    type: "website",
    siteName: "Centaurian",
    url: "/imperien",
    title: `${TITLE} | CENTAURIAN`,
    description: DESCRIPTION,
    images: [{ url: "/og/imperien/1200.jpg", width: 1200, height: 630, alt: "Weltkarte der Reiche um 1200 n. Chr." }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | CENTAURIAN`,
    description: DESCRIPTION,
    images: ["/og/imperien/1200.jpg"],
  },
};

export default function ImperienLayout({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
  );
}
