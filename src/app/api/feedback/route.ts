// Feedback-Box (Nutzerwunsch 17.10.2026): Feedback ohne Anmeldung.
// POST speichert eine Nachricht privat in Vercel Blob, GET/DELETE nur mit Admin-Passwort.
import { NextRequest, NextResponse } from "next/server";
import { put, list, get, del } from "@vercel/blob";
import { createHash, timingSafeEqual } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TYPES = ["bug", "idea", "other"];
const PREFIX = "feedback/";
const postHits = new Map<string, number[]>();
const authFails = new Map<string, number[]>();

function clientIp(req: NextRequest): string {
  return (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
}

// Sliding-Window-Limit (pro Serverinstanz, reicht gegen einfachen Spam)
function limited(map: Map<string, number[]>, key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const arr = (map.get(key) || []).filter((t) => now - t < windowMs);
  if (arr.length >= max) {
    map.set(key, arr);
    return true;
  }
  arr.push(now);
  map.set(key, arr);
  if (map.size > 2000) map.clear();
  return false;
}

function adminOk(req: NextRequest): boolean {
  const secret = process.env.FEEDBACK_ADMIN_KEY || "";
  const given = req.headers.get("x-admin-key") || "";
  if (!secret || !given) return false;
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(secret).digest();
  return timingSafeEqual(a, b);
}

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: NextRequest) {
  const len = Number(req.headers.get("content-length") || "0");
  if (len > 10000) return NextResponse.json({ error: "too large" }, { status: 413 });
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  // Honeypot gefuellt oder in unter 2 Sekunden abgeschickt -> Bot: stillschweigend "ok"
  const elapsed = typeof body.t === "number" ? body.t : 99999;
  if (clean(body.hp, 50) || elapsed < 2000) return NextResponse.json({ ok: true });
  const message = clean(body.message, 2000);
  if (message.length < 5) return NextResponse.json({ error: "too short" }, { status: 400 });
  const name = clean(body.name, 40);
  if (name.length < 2) return NextResponse.json({ error: "name required" }, { status: 400 });
  if (limited(postHits, clientIp(req), 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "rate limit" }, { status: 429 });
  }
  const type = TYPES.includes(String(body.type)) ? String(body.type) : "other";
  let email = clean(body.email, 120);
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) email = "";
  const entry = {
    ts: new Date().toISOString(),
    type,
    name,
    message,
    email,
    page: clean(body.page, 200),
    lang: clean(body.lang, 8),
    ua: (req.headers.get("user-agent") || "").slice(0, 200),
  };
  try {
    await put(PREFIX + Date.now() + ".json", JSON.stringify(entry), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: true,
    });
  } catch {
    return NextResponse.json({ error: "storage" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  if (!process.env.FEEDBACK_ADMIN_KEY) return NextResponse.json({ error: "not configured" }, { status: 503 });
  const ip = clientIp(req);
  if (!adminOk(req)) {
    limited(authFails, ip, 1000, 10 * 60 * 1000);
    if ((authFails.get(ip) || []).length > 10) return NextResponse.json({ error: "rate limit" }, { status: 429 });
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const blobs: { pathname: string; uploadedAt: Date }[] = [];
  let cursor: string | undefined;
  for (let i = 0; i < 5; i++) {
    const res = await list({ prefix: PREFIX, cursor, limit: 200 });
    for (const b of res.blobs) blobs.push({ pathname: b.pathname, uploadedAt: new Date(b.uploadedAt) });
    if (!res.hasMore) break;
    cursor = res.cursor;
  }
  blobs.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
  const top = blobs.slice(0, 200);
  const items: Record<string, unknown>[] = [];
  for (let i = 0; i < top.length; i += 20) {
    const part = await Promise.all(
      top.slice(i, i + 20).map(async (b) => {
        try {
          const r = await get(b.pathname, { access: "private" });
          if (!r || r.statusCode !== 200 || !r.stream) return null;
          const data = JSON.parse(await new Response(r.stream).text()) as Record<string, unknown>;
          return { id: b.pathname, ...data };
        } catch {
          return null;
        }
      })
    );
    for (const p of part) if (p) items.push(p);
  }
  return NextResponse.json({ items, total: blobs.length });
}

export async function DELETE(req: NextRequest) {
  if (!adminOk(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let id = "";
  try {
    id = clean(((await req.json()) as Record<string, unknown>).id, 200);
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (!id.startsWith(PREFIX) || id.includes("..")) return NextResponse.json({ error: "bad id" }, { status: 400 });
  await del(id);
  return NextResponse.json({ ok: true });
}
