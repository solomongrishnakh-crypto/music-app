import { Song } from "@/types/music";

/**
 * YouTube liefert Titel/Kanalnamen mit HTML-Entities (z. B. &#39; statt ',
 * &amp; statt &) — dekodiert sie zu normalem Text, damit der Titel 1:1
 * wie auf YouTube selbst angezeigt wird.
 */
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

interface YoutubeSearchItem {
  id?: { videoId?: string };
  snippet?: {
    title?: string;
    channelTitle?: string;
    thumbnails?: {
      high?: { url?: string };
      medium?: { url?: string };
      default?: { url?: string };
    };
  };
}

interface YoutubeSearchResponse {
  items?: YoutubeSearchItem[];
  error?: { message?: string };
}

interface YoutubeVideosItem {
  id?: string;
  statistics?: { viewCount?: string };
}

interface YoutubeVideosResponse {
  items?: YoutubeVideosItem[];
  error?: { message?: string };
}

/**
 * Holt für eine Liste von Video-IDs die Aufrufzahlen (views.list unterstützt
 * bis zu 50 IDs pro Aufruf, kostet nur 1 Quota-Einheit — sehr günstig).
 * Fehler hier sind nicht kritisch: Ohne Aufrufzahlen wird einfach nicht
 * sortiert, die Suche funktioniert trotzdem.
 */
async function fetchViewCounts(
  videoIds: string[],
  apiKey: string
): Promise<Map<string, number>> {
  if (videoIds.length === 0) return new Map();

  const params = new URLSearchParams({
    part: "statistics",
    id: videoIds.join(","),
    key: apiKey,
  });

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?${params.toString()}`,
    { next: { revalidate: 60 } }
  );

  const data: YoutubeVideosResponse = await res.json();
  if (!res.ok) return new Map();

  const counts = new Map<string, number>();
  for (const item of data.items ?? []) {
    if (item.id) {
      counts.set(item.id, Number(item.statistics?.viewCount ?? 0));
    }
  }
  return counts;
}

/**
 * Ruft serverseitig die offizielle YouTube Data API v3 auf (kostenlos im
 * Rahmen des Standardkontingents) und liefert eine normalisierte Song-Liste
 * zurück. Wird NUR aus der API-Route (`src/app/api/search/route.ts`)
 * aufgerufen, damit der API-Key niemals ans Frontend gelangt.
 *
 * Die Ergebnisse werden anschließend nach Aufrufzahlen (meiste zuerst)
 * sortiert, damit populärere Songs oben stehen.
 *
 * Doku: https://developers.google.com/youtube/v3/docs/search/list
 */
export async function searchYoutubeMusic(
  query: string,
  apiKey: string
): Promise<Song[]> {
  const params = new URLSearchParams({
    part: "snippet",
    type: "video",
    videoCategoryId: "10", // offizielle YouTube-Kategorie "Musik"
    maxResults: "20",
    q: query,
    key: apiKey,
  });

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?${params.toString()}`,
    { next: { revalidate: 60 } }
  );

  const data: YoutubeSearchResponse = await res.json();

  if (!res.ok) {
    throw new Error(
      data.error?.message ?? `YouTube API Fehler (Status ${res.status})`
    );
  }

  const songs = (data.items ?? [])
    .filter((item) => item.id?.videoId)
    .map((item) => ({
      id: item.id!.videoId!,
      title: decodeHtmlEntities(item.snippet?.title ?? "Unbekannter Titel"),
      artist: decodeHtmlEntities(item.snippet?.channelTitle ?? "Unbekannter Künstler"),
      coverUrl:
        item.snippet?.thumbnails?.high?.url ??
        item.snippet?.thumbnails?.medium?.url ??
        item.snippet?.thumbnails?.default?.url ??
        "",
    }));

  const viewCounts = await fetchViewCounts(
    songs.map((s) => s.id),
    apiKey
  );

  return [...songs].sort(
    (a, b) => (viewCounts.get(b.id) ?? 0) - (viewCounts.get(a.id) ?? 0)
  );
}
