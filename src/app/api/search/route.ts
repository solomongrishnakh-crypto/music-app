import { NextRequest, NextResponse } from "next/server";
import { searchYoutubeMusic } from "@/lib/youtube/search";
import { getClientIp, isRateLimited } from "@/lib/security/rateLimit";

/**
 * GET /api/search?q=...
 *
 * Serverseitige Such-Route. Der YouTube-API-Key liegt ausschließlich in der
 * Server-Umgebungsvariable YOUTUBE_API_KEY und wird nie an den Browser
 * ausgeliefert — das Frontend ruft immer nur diese Route auf, nie die
 * Google-API direkt.
 */

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 60;
const MAX_QUERY_LENGTH = 100;

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);

  if (isRateLimited(`search:${ip}`, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS)) {
    return NextResponse.json(
      { error: "Zu viele Anfragen, bitte kurz warten." },
      { status: 429 }
    );
  }

  let query = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!query) {
    return NextResponse.json({ songs: [] });
  }
  // Verhindert übergroße/missbräuchliche Suchanfragen an die YouTube-API.
  if (query.length > MAX_QUERY_LENGTH) {
    query = query.slice(0, MAX_QUERY_LENGTH);
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
