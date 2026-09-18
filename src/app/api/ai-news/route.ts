import { NextRequest, NextResponse } from "next/server";
import { getClientIp, isRateLimited } from "@/lib/security/rateLimit";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;

/**
 * GET /api/ai-news
 *
 * Echte, aktuelle KI-Nachrichten — aus dem öffentlichen RSS-Feed von
 * TechCrunch (Kategorie "Artificial Intelligence"), kein API-Key nötig.
 * Läuft serverseitig (kein CORS-Problem, kein Key im Browser). Ergebnis
 * wird kurz zwischengespeichert (10 Minuten).
 */

interface AiNewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  imageUrl: string;
  source: string;
  publishedAt: string;
  author: string;
  categories: string[];
}

function extractTag(block: string, tag: string): string {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  if (!match) return "";
  let val = match[1].trim();
  const cdata = val.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  if (cdata) val = cdata[1].trim();
  return val;
}

function extractAllTags(block: string, tag: string): string[] {
  const matches = block.matchAll(
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi")
  );
  const values: string[] = [];
  for (const m of matches) {
    let val = m[1].trim();
    const cdata = val.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
    if (cdata) val = cdata[1].trim();
    val = decodeEntities(val);
    if (val && !values.includes(val)) values.push(val);
  }
  return values;
}

function extractSelfClosingAttr(
  block: string,
  tag: string,
  attr: string
): string {
  const match = block.match(
    new RegExp(`<${tag}[^>]*${attr}=["']([^"']+)["'][^>]*/?>`, "i")
  );
  return match ? match[1] : "";
}

function decodeEntities(input: string): string {
  return input
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    )
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripHtml(input: string): string {
  return decodeEntities(input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ")).trim();
}

// Der TechCrunch-RSS-Feed liefert selbst KEIN Bild mit (kein media:content,
// kein enclosure, kein <img> in der description) — deshalb wird das
// Vorschaubild (og:image) direkt von der Artikelseite nachgeladen. Läuft
// serverseitig parallel für alle Artikel, mit kurzem Timeout pro Anfrage,
// damit ein einzelner langsamer/fehlender Artikel den ganzen Abruf nicht
// blockiert — fehlt ein Bild trotzdem, bleibt die Karte einfach ohne Bild
// (CardThumbnail im Frontend blendet das dann aus).
async function fetchOgImage(articleUrl: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(articleUrl, {
      signal: controller.signal,
      next: { revalidate: 600 },
    });
    clearTimeout(timeout);
    if (!res.ok) return "";
    const html = await res.text();
    const match = html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
    );
    return match?.[1] ?? "";
  } catch {
    return "";
  }
}

function parseRssItem(block: string): AiNewsArticle | null {
  const title = decodeEntities(stripHtml(extractTag(block, "title")));
  const link = extractTag(block, "link").trim();
  if (!title || !link) return null;

  const pubDate = extractTag(block, "pubDate");
  const rawDescription =
    extractTag(block, "description") || extractTag(block, "content:encoded");
  const summary = stripHtml(rawDescription).slice(0, 320);

  let imageUrl =
    extractSelfClosingAttr(block, "media:content", "url") ||
    extractSelfClosingAttr(block, "enclosure", "url");
  if (!imageUrl) {
    const imgMatch = rawDescription.match(/<img[^>]*src=["']([^"']+)["']/i);
    if (imgMatch) imageUrl = imgMatch[1];
  }

  const author = decodeEntities(
    stripHtml(extractTag(block, "dc:creator") || extractTag(block, "author"))
  );
  const categories = extractAllTags(block, "category").slice(0, 4);

  return {
    id: link,
    title,
    summary,
    url: link,
    imageUrl,
    source: "TechCrunch",
    publishedAt: pubDate ? new Date(pubDate).toISOString() : "",
    author,
    categories,
  };
}

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(`ai-news:${ip}`, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS)) {
    return NextResponse.json(
      { error: "Zu viele Anfragen, bitte kurz warten." },
      { status: 429 }
    );
  }

  try {
    const res = await fetch(
      "https://techcrunch.com/category/artificial-intelligence/feed/",
      { next: { revalidate: 600 } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `KI-News-Feed Fehler (Status ${res.status})` },
        { status: 502 }
      );
    }

    const xml = await res.text();
    const itemBlocks = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? [];
    const news = itemBlocks
      .map(parseRssItem)
      .filter((a): a is AiNewsArticle => a !== null)
      .slice(0, 24);

    // Bilder für alle Artikel parallel nachladen (siehe fetchOgImage oben).
    const withImages = await Promise.all(
      news.map(async (item) => ({
        ...item,
        imageUrl: item.imageUrl || (await fetchOgImage(item.url)),
      }))
    );

    return NextResponse.json({ news: withImages });
  } catch (err) {
    console.error("KI-News-Abruf fehlgeschlagen:", err);
    return NextResponse.json(
      { error: "KI-News konnten nicht geladen werden." },
      { status: 502 }
    );
  }
}
