import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const securityHeaders = [
  // Verhindert, dass die Seite in einem fremden iframe eingebettet wird
  // (Clickjacking-Schutz).
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Browser lässt sich nicht mehr vom deklarierten Content-Type abbringen
  // (schützt u. a. vor MIME-Sniffing-Angriffen).
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Schickt keine volle URL als Referrer an fremde Seiten weiter.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Deaktiviert Browser-Funktionen, die die Seite nicht braucht.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // Erzwingt HTTPS bei allen zukünftigen Aufrufen (nur wirksam, sobald
  // die Seite tatsächlich per HTTPS ausgeliefert wird).
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  // Isoliert die Seite von fremden Fenstern/Tabs (Schutz vor bestimmten
  // Seitenkanal-Angriffen wie Spectre über gemeinsam genutzte Prozesse).
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Eigene Ressourcen (Bilder/Videos/Skripte) sind nur von der eigenen
  // Seite aus einbettbar, nicht von fremden Seiten.
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  // Unterbindet DNS-Prefetching auf Links zu fremden Domains (kleines
  // Privacy-/Tracking-Leck weniger).
  { key: "X-DNS-Prefetch-Control", value: "off" },
  // Erlaubt Skripte/Styles/Bilder/Frames nur von den tatsächlich
  // genutzten, vertrauenswürdigen Quellen (eigene Seite + YouTube-Player).
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // 'unsafe-eval' wird nur im Dev-Modus gebraucht (Next.js Hot-Reload
      // nutzt intern eval()) — im Produktivbetrieb (npm run build/start)
      // ist es automatisch draußen, dann ist die Policy strenger.
      `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval' " : ""}https://www.youtube.com https://s.ytimg.com https://unpkg.com`,
      "style-src 'self' 'unsafe-inline' https://unpkg.com",
      "img-src 'self' data: https:",
      "media-src 'self'",
      "connect-src 'self' https://www.googleapis.com https://api.spaceflightnewsapi.net https://techcrunch.com https://unpkg.com",
      "frame-src 'self' https://www.youtube.com",
      "font-src 'self' data:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Verrät nicht mehr per "X-Powered-By"-Header, dass die Seite mit
  // Next.js läuft — macht gezielte, framework-spezifische Angriffe
  // etwas schwerer zu planen.
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      // Der vorab gefilterte/vereinfachte Cliopatria-Datensatz für die
      // /imperien-Karte (siehe src/lib/history/empiresClient.ts) ändert
      // sich praktisch nie — "immutable" heißt: der Browser fragt nach dem
      // ersten Laden nie wieder nach, spätere Kartenaufrufe brauchen dann
      // gar keinen Netzwerk-Request mehr für die Grenzdaten. Bei einer
      // künftigen Aktualisierung bitte den Dateinamen hochzählen
      // (empires-v2.json etc.), sonst liefern Browser mit warmem Cache
      // weiter die alte Version aus.
      {
        source: "/data/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
