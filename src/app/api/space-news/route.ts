import { NextRequest, NextResponse } from "next/server";
import { getClientIp, isRateLimited } from "@/lib/security/rateLimit";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;

/**
 * GET /api/space-news
 *
 * Echtzeit-Raumfahrt-News über die freie, kostenlose Spaceflight News API
 * (von "The Space Devs", kein API-Key nötig — https://api.spaceflightnewsapi.net).
 * Läuft serverseitig, damit der Browser nicht direkt gegen eine fremde API
 * spricht. Ergebnis wird kurz zwischengespeichert (10 Minuten), damit die
 * Seite trotzdem schnell lädt.
 */
interface SpaceflightNewsArticle {
  id: number;
  title: string;
  summary: string;
  url: string;
  image_url: string;
  news_site: string;
  published_at: string;
  authors?: { name: string }[];
  launches?: { name?: string }[];
  events?: { name?: string }[];
}

interface SpaceflightNewsResponse {
  results?: SpaceflightNewsArticle[];
}

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(`space-news:${ip}`, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS)) {
    return NextResponse.json(
      { error: "Zu viele Anfragen, bitte kurz warten." },
      { status: 429 }
    );
  }

  try {
    const res = await fetch(
      "https://api.spaceflightnewsapi.net/v4/articles/?limit=32&ordering=-published_at",
      { next: { revalidate: 600 } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `Spaceflight News API Fehler (Status ${res.status})` },
        { status: 502 }
      );
    }

    const data: SpaceflightNewsResponse = await res.json();

    const news = (data.results ?? []).map((a) => ({
      id: a.id,
      title: a.title,
      summary: a.summary,
      url: a.url,
      imageUrl: a.image_url,
      newsSite: a.news_site,
      publishedAt: a.published_at,
      authors: (a.authors ?? []).map((au) => au.name).filter(Boolean),
      launch: a.launches?.[0]?.name ?? null,
      event: a.events?.[0]?.name ?? null,
    }));

    return NextResponse.json({ news });
  } catch (err) {
    console.error("Space-News-Abruf fehlgeschlagen:", err);
    return NextResponse.json(
      { error: "Space News konnten nicht geladen werden." },
      { status: 502 }
    );
  }
}
