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

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  url: string;
  imageUrl: string;
  newsSite: string;
  publishedAt: string;
  authors: string[];
  launch: string | null;
  event: string | null;
}

function xmlTag(block: string, name: string): string {
  const m = block.match(new RegExp("<" + name + "[^>]*>([^]*?)</" + name + ">"));
  if (!m) return "";
  return m[1].replace("<![CDATA[", "").replace("]]>", "").trim();
}

function decodeEntities(s: string): string {
  return s
    .replace(/&#([0-9]+);/g, (_m, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, String.fromCharCode(34))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

/**
 * Astronomie-News (Nutzerwunsch 17.10.2026: Astronomie- und Space-News in einem Thema).
 * Quelle: offizieller RSS-Feed von Universe Today. Schlägt der Abruf fehl,
 * bleiben einfach nur die Raumfahrt-News übrig.
 */
async function fetchAstronomyNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch("https://www.universetoday.com/feed", { next: { revalidate: 600 } });
    if (!res.ok) return [];
    const xml = await res.text();
    const out: NewsItem[] = [];
    for (const block of xml.split("<item>").slice(1, 21)) {
      const title = decodeEntities(xmlTag(block, "title"));
      const url = xmlTag(block, "link");
      const date = new Date(xmlTag(block, "pubDate"));
      if (!title || !url || isNaN(date.getTime())) continue;
      const desc = xmlTag(block, "description");
      const img = desc.match(/<img[^>]+src="([^"]+)"/);
      const text = decodeEntities(desc.replace(/<img[^>]*>/g, " ").replace(/<[^>]*>/g, " ")).split(/ +/).join(" ").trim();
      let h = 0;
      for (let i = 0; i < url.length; i++) h = (h * 31 + url.charCodeAt(i)) | 0;
      const author = decodeEntities(xmlTag(block, "dc:creator"));
      out.push({
        id: -Math.abs(h) - 1,
        title,
        summary: text.slice(0, 400),
        url,
        imageUrl: img ? img[1] : "",
        newsSite: "Universe Today",
        publishedAt: date.toISOString(),
        authors: author ? [author] : [],
        launch: null,
        event: null,
      });
    }
    return out;
  } catch {
    return [];
  }
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

    const astro = await fetchAstronomyNews();
    const merged = [...news, ...astro]
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
      .slice(0, 40);
    return NextResponse.json({ news: merged });
  } catch (err) {
    console.error("Space-News-Abruf fehlgeschlagen:", err);
    return NextResponse.json(
      { error: "Space News konnten nicht geladen werden." },
      { status: 502 }
    );
  }
}
