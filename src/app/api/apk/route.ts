// APK-Download mit Zaehler (Nutzerwunsch 12.11.2026): zaehlt jeden Abruf als kleine
// Datei in Vercel Blob (apk-dl/) und leitet dann auf die APK bei GitHub weiter.
// Gezaehlt wird nur, wenn es kein Bot ist. Auslesen: Admin-Seite (Feedback).
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const APK_URL = "https://github.com/solomongrishnakh-crypto/music-app/releases/download/app-latest/Centaurian-web.apk";
const BOT = /bot|crawl|spider|slurp|preview|curl|wget|python|http-client|facebookexternalhit|headless/i;

export async function GET(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";
  if (ua && !BOT.test(ua)) {
    try {
      await put("apk-dl/d.txt", "1", { access: "private", contentType: "text/plain", addRandomSuffix: true });
    } catch {
      /* Zaehlen darf den Download nie blockieren */
    }
  }
  return NextResponse.redirect(APK_URL, 302);
}
