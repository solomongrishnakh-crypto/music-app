import type { MetadataRoute } from "next";

/**
 * Web-App-Manifest: Name, Farben und App-Icons, damit die Seite auf dem
 * Handy wie eine richtige App auf dem Startbildschirm liegt
 * (Nutzerwunsch 28.09.2026: Icon soll wie andere App-Logos aussehen, nicht
 * wie ein Bild mit schwarzem Kasten). Die "any"-Icons haben einen
 * durchsichtigen Hintergrund; das "maskable"-Icon ist für installierte
 * Apps, bei denen Android selbst die Form (rund/abgerundet) ausschneidet.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Centaurian",
    short_name: "Centaurian",
    description: "Songs suchen und direkt hören, das Universum entdecken und die Geschichte großer Imperien erleben.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
