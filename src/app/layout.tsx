import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/contexts/PlayerContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import PersistentPlayerBar from "@/components/player/PersistentPlayerBar";
import { HOME_KEYWORDS } from "@/lib/seoKeywords";
import Script from "next/script";
import { hreflang } from "@/lib/seoI18n";

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
  metadataBase: new URL("https://centaurian.vercel.app"),
  title: {
    default: "CENTAURIAN — Musik, Universum & Geschichte",
    template: "%s | CENTAURIAN",
  },
  description:
    "Centaurian: Songs suchen und direkt im Browser hören, das Sonnensystem interaktiv entdecken und auf einer Weltgeschichte-Karte alle Imperien von 3400 v. Chr. bis heute erleben — kostenlos, ohne Anmeldung.",
  applicationName: "Centaurian",
  keywords: HOME_KEYWORDS,
  alternates: { canonical: "/", languages: hreflang("/") },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Centaurian",
    title: "CENTAURIAN — Musik, Universum & Geschichte",
    description:
      "Songs suchen und direkt hören, das Universum entdecken und die Geschichte großer Imperien erleben — kostenlos, ohne Anmeldung.",
    images: [{ url: "/branding/og-image.jpg", width: 1200, height: 630, alt: "Centaurian Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CENTAURIAN — Musik, Universum & Geschichte",
    description: "Songs suchen und direkt hören, das Universum entdecken und die Geschichte großer Imperien erleben.",
    images: ["/branding/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  // Besitznachweis für die Google Search Console (HTML-Tag-Methode)
  verification: { google: "qrhceuDz1zuZMNrlVjkiybQo6epyEYiL-2UkmQJI5AY" },
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
              url: "https://centaurian.vercel.app",
              description: "Songs suchen und direkt hören, das Universum entdecken und die Geschichte großer Imperien erleben.",
              publisher: {
                "@type": "Organization",
                name: "Centaurian",
                url: "https://centaurian.vercel.app",
                logo: "https://centaurian.vercel.app/branding/logo.jpg",
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
            {children}
            <PersistentPlayerBar />
          </PlayerProvider>
        </LanguageProvider>
        {/* Besucherzahlen (Vercel Web Analytics, ohne Cookies): wirkt, sobald
            "Analytics" im Vercel-Dashboard des Projekts eingeschaltet ist */}
        <Script src="/_vercel/insights/script.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
