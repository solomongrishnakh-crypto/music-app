import TunnelBackground from "./TunnelBackground";

/**
 * SiteBackground: Partikel-Tunnel mit Reise zum Schwarzen Loch (siehe TunnelBackground.tsx).
 * Genutzt auf Universum und Geschichte; die Startseite bindet TunnelBackground direkt ein.
 */
export default function SiteBackground() {
  return (
    <div className="fixed inset-x-0 top-0 -z-10 h-[100lvh] overflow-hidden bg-background">
      <TunnelBackground />
    </div>
  );
}
