import { NextRequest, NextResponse } from "next/server";
import { searchYoutubeMusic } from "@/lib/youtube/search";

/**
 * GET /api/search?q=...
 *
 * Serverseitige Such-Route. Der YouTube-API-Key liegt ausschließlich in der
 * Server-Umgebungsvariable YOUTUBE_API_KEY und wird nie an den Browser
 * ausgeliefert — das Frontend ruft immer nur diese Route auf, nie die
 * Google-API direkt.
 */

// Sehr einfaches In-Memory-Rate-Limiting pro IP, um das kostenlose
// API-Kontingent vor Missbrauch zu schützen. Für Produktionsbetrieb mit
// mehreren Server-Instanzen sollte das durch einen externen Store (z. B.
// Redis) ersetzt werden.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Zu viele Anfragen, bitte kurz warten." },
      { status: 429 }
    );
  }

  const query = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!query) {
    return NextResponse.json({ songs: [] });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "YOUTUBE_API_KEY ist nicht gesetzt. Siehe README für die Einrichtung.",
      },
      { status: 500 }
    );
  }

  try {
    const songs = await searchYoutubeMusic(query, apiKey);
    return NextResponse.json({ songs });
  } catch (err) {
    console.error("YouTube-Suche fehlgeschlagen:", err);
    return NextResponse.json(
      { error: "Suche fehlgeschlagen. Bitte später erneut versuchen." },
      { status: 502 }
    );
  }
}
