import { NextRequest, NextResponse } from "next/server";
import { getClientIp, isRateLimited } from "@/lib/security/rateLimit";

/**
 * GET /api/playlist?list=PL...
 * Holt eine öffentliche YouTube-Playlist über die offizielle YouTube Data API
 * (serverseitig, der Key bleibt geheim). Max. 200 Titel.
 */
const ID_RE = /^[A-Za-z0-9_-]{10,60}$/;

interface Item {
  snippet?: {
    title?: string;
    videoOwnerChannelTitle?: string;
    channelTitle?: string;
    resourceId?: { videoId?: string };
    thumbnails?: { high?: { url?: string }; medium?: { url?: string }; default?: { url?: string } };
  };
}

function decode(t: string) {
  return t
    .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(Number(c)))
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

export async function GET(req: NextRequest) {
  if (isRateLimited(`playlist:${getClientIp(req)}`, 60_000, 20)) {
    return NextResponse.json({ error: "rate" }, { status: 429 });
  }
  const list = req.nextUrl.searchParams.get("list")?.trim() ?? "";
  if (!ID_RE.test(list)) return NextResponse.json({ error: "bad id" }, { status: 400 });
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return NextResponse.json({ error: "not configured" }, { status: 500 });

  try {
    const songs: { id: string; title: string; artist: string; coverUrl: string }[] = [];
    let page = "";
    for (let i = 0; i < 4; i++) {
      const p = new URLSearchParams({ part: "snippet", maxResults: "50", playlistId: list, key });
      if (page) p.set("pageToken", page);
      const r = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${p.toString()}`, { next: { revalidate: 300 } });
      const d = await r.json();
      if (!r.ok) return NextResponse.json({ error: "not found" }, { status: r.status === 404 ? 404 : 502 });
      for (const it of (d.items ?? []) as Item[]) {
        const s = it.snippet;
        const id = s?.resourceId?.videoId;
        const title = s?.title ?? "";
        if (!id || /^(private|deleted) video$/i.test(title)) continue;
        songs.push({
          id,
          title: decode(title),
          artist: decode((s?.videoOwnerChannelTitle ?? s?.channelTitle ?? "").replace(/ - Topic$/, "")),
          coverUrl: s?.thumbnails?.high?.url ?? s?.thumbnails?.medium?.url ?? s?.thumbnails?.default?.url ?? "",
        });
      }
      page = d.nextPageToken ?? "";
      if (!page) break;
    }
    let name = "";
    try {
      const r = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${list}&key=${key}`, { next: { revalidate: 300 } });
      const d = await r.json();
      name = decode(d.items?.[0]?.snippet?.title ?? "");
    } catch {
      /* Name optional */
    }
    if (songs.length === 0) return NextResponse.json({ error: "empty" }, { status: 404 });
    return NextResponse.json({ name, songs });
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 502 });
  }
}
