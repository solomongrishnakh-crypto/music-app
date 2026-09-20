import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/contexts/PlayerContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import PersistentPlayerBar from "@/components/player/PersistentPlayerBar";

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

export const metadata: Metadata = {
  title: "CENTAURIAN",
  description: "Song suchen, direkt im Browser hören.",
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
      </body>
    </html>
  );
}
