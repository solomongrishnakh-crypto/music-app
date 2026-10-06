import { NextRequest, NextResponse } from "next/server";
import { getClientIp, isRateLimited } from "@/lib/security/rateLimit";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;

/**
 * GET /api/iss?t=<Unix-Sekunden>
 *
 * Positionen der Internationalen Raumstation für den Sternenhimmel
 * (Nutzerwunsch 06.10.2026: "kannst du ISS auch hinzufügen"). Quelle: die
 * freie "Where the ISS at?"-API (https://wheretheiss.at, kein API-Key), die
 * aus den aktuellen NORAD-Bahndaten rechnet. Geliefert werden 20 Punkte im
 * 5-Minuten-Abstand rund um die gewünschte Zeit (−50 … +45 min) — daraus
 * berechnet die Seite die genaue Position am Himmel und die Bahn.
 * Läuft serverseitig (kein CORS-Problem, Zwischenspeicher 2 Minuten).
 */
interface IssPosition {
  latitude: number;
  longitude: number;
  altitude: number; // km
  velocity: number; // km/h
  visibility: string; // "daylight" | "eclipsed"
  timestamp: number;
}

const STEP_S = 300;

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(`iss:${ip}`, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS)) {
    return NextResponse.json({ error: "Zu viele Anfragen, bitte kurz warten." }, { status: 429 });
  }
  const tParam = Number(req.nextUrl.searchParams.get("t"));
  const now = Math.floor(Date.now() / 1000);
  // auf 2 Minuten runden → gleiche Anfragen teilen sich den Zwischenspeicher
  const center = Math.round((Number.isFinite(tParam) && tParam > 0 ? tParam : now) / 120) * 120;
  const stamps = Array.from({ length: 20 }, (_, i) => center + (i - 10) * STEP_S);
  try {
    const parts: IssPosition[] = [];
    for (const chunk of [stamps.slice(0, 10), stamps.slice(10)]) {
      const res = await fetch(
        `https://api.wheretheiss.at/v1/satellites/25544/positions?timestamps=${chunk.join(",")}&units=kilometers`,
        { next: { revalidate: 120 }, headers: { "User-Agent": "Centaurian/1.0 (https://centaurian.vercel.app/)" } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      parts.push(...((await res.json()) as IssPosition[]));
    }
    const points = parts
      .filter((p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude))
      .map((p) => ({
        t: p.timestamp,
        lat: p.latitude,
        lon: p.longitude,
        alt: p.altitude,
        v: p.velocity,
        lit: p.visibility === "daylight",
      }))
      .sort((a, b) => a.t - b.t);
    return NextResponse.json(
      { points },
      { headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300" } }
    );
  } catch {
    return NextResponse.json({ points: [], error: "ISS-Daten gerade nicht erreichbar." }, { status: 502 });
  }
}
