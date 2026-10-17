import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/contexts/PlayerContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import LangRedirect from "@/components/LangRedirect";
import ScrollKeeper from "@/components/ScrollKeeper";
import FeedbackBox from "@/components/FeedbackBox";
import PersistentPlayerBar from "@/components/player/PersistentPlayerBar";
import { HOME_KEYWORDS } from "@/lib/seoKeywords";
import Script from "next/script";
import { PAGE_SEO, hreflang } from "@/lib/seoI18n";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
});

// Futuristischer, geometrischer Sci-Fi-Font für Titel/Überschriften
// (Wordmark, "Now Playing", Sektions-Headlines) — Fließtext bleibt Mono.
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700", "900"],
});

// Suchmaschinen-Angaben (Nutzerwunsch 28.09.2026: Seite soll bei der
// Suche auftauchen). metadataBase macht alle Links/Bilder absolut; der
// Titel-Template hängt auf Unterseiten " | CENTAURIAN" an.
export const metadata: Metadata = {
  metadataBase: new URL("https://centaurianspace.com"),
  title: {
    default: "CENTAURIAN — Universum & Weltgeschichte",
    template: "%s | CENTAURIAN",
  },
  description: PAGE_SEO.home.de.description,
  applicationName: "Centaurian",
  keywords: HOME_KEYWORDS,
  alternates: { canonical: "/", languages: hreflang("/") },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Centaurian",
    title: "CENTAURIAN — Universum & Weltgeschichte",
    description: PAGE_SEO.home.de.description,
    images: [{ url: "/branding/og-image.jpg", width: 1200, height: 630, alt: "Centaurian Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CENTAURIAN — Universum & Weltgeschichte",
    description: "Das Universum live entdecken und die Weltgeschichte aller Imperien erleben — nebenbei auch Musik.",
    images: ["/branding/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  // Besitznachweis für die Google Search Console (HTML-Tag-Methode)
  verification: { google: ["qrhceuDz1zuZMNrlVjkiybQo6epyEYiL-2UkmQJI5AY", "vdypSkBZIwT8t0TWz288f1_dx6NjdPLCIw3FKlpwXi0"] },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`dark ${jetbrainsMono.variable} ${orbitron.variable}`}>
      <body className="antialiased min-h-screen bg-background font-mono text-foreground selection:bg-accent/40 selection:text-white">
        {/* Strukturierte Daten für Suchmaschinen/KI: Name der Seite und
            offizielle Kontakt-Profile (Telegram, X) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Centaurian",
              keywords: HOME_KEYWORDS.join(", "),
              url: "https://centaurianspace.com",
              alternateName: ["Centaurian", "CENTAURIAN", "CENTAURIAN — Universe & World History"],
              description: PAGE_SEO.home.de.description,
              publisher: {
                "@type": "Organization",
                name: "Centaurian",
                url: "https://centaurianspace.com",
                logo: "https://centaurianspace.com/icon.png",
                sameAs: ["https://t.me/Perseus641", "https://x.com/capone_835"],
              },
            }),
          }}
        />
        {/* Unsichtbarer SVG-Filter für den "Glas"-Verzerrungseffekt der
            Info-Boxen (glass-card in globals.css) — verzerrt/streckt, was
            im Hintergrund (Partikel/Linien/Galaxie) durchscheint, wie bei
            echtem Milchglas. */}
        <svg
          width="0"
          height="0"
          className="absolute"
          aria-hidden="true"
          focusable="false"
        >
          <filter id="glass-distortion">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.012"
              numOctaves="2"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="26"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
        {/* PlayerProvider + der eigentliche Player leben hier im
            Root-Layout statt auf der Startseite — dadurch überlebt die
            Musikwiedergabe einen Seitenwechsel (z.B. zur /imperien-Karte),
            statt beim Verlassen der Startseite abzubrechen (Nutzerwunsch
            18.09.2026: "music soll auch hier gespielt werden nicht
            abbrechen wenn ich die karte oder was anderes ... öffne"). */}
        <LanguageProvider>
          <PlayerProvider>
            <LangRedirect />
            <ScrollKeeper />
            {children}
            <PersistentPlayerBar />
            <FeedbackBox />
          </PlayerProvider>
        </LanguageProvider>
        {/* Besucherzahlen (Vercel Web Analytics, ohne Cookies): wirkt, sobald
            "Analytics" im Vercel-Dashboard des Projekts eingeschaltet ist */}
        <Script src="/_vercel/insights/script.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
