import ThreeBackground from "./ThreeBackground";

/**
 * SiteBackground
 * ---------------------------------------------------------------------------
 * Reines Schwarz + die 3D-Partikel-/Netzszene (Three.js), inklusive einer
 * kleinen, echten 3D-Spiralgalaxie im Zentrum (siehe ThreeBackground.tsx).
 * Kein externes Bild/GIF mehr — alles läuft als eigene 3D-Geometrie.
 */
export default function SiteBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      <ThreeBackground />
    </div>
  );
}
