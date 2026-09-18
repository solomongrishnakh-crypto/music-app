import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/empires/borders?filename=world_1900.geojson
 *
 * Liefert die historischen Weltgrenzen fuer ein bestimmtes Jahr — als
 * Proxy vor dem freien "historical-basemaps"-Datenset (GPL-3.0, siehe
 * /api/empires/index/route.ts), damit der Browser nicht direkt gegen
 * jsDelivr/GitHub spricht (CORS, Attribution serverseitig) und damit der
 * Dateiname serverseitig geprueft werden kann, bevor er in eine URL
 * eingesetzt wird.
 *
 * `filename` kommt vom Client, aber NUR Werte, die exakt wie
 * "world_<etwas>.geojson" aussehen, werden akzeptiert (siehe
 * FILENAME_PATTERN) — verhindert, dass ueber diesen Parameter beliebige
 * Pfade/URLs erzwungen werden koennten. Die eigentliche Zuordnung
 * Jahr -> Dateiname kommt immer aus /api/empires/index, nie selbst
 * zusammengebaut.
 */

const BASE_URL =
  "https://cdn.jsdelivr.net/gh/aourednik/historical-basemaps@master/geojson/";

const FILENAME_PATTERN = /^world_[a-z0-9]+\.geojson$/i;

export async function GET(request: NextRequest) {
  const filename = request.nextUrl.searchParams.get("filename") ?? "";

  if (!FILENAME_PATTERN.test(filename)) {
    return NextResponse.json({ error: "Ungültiger Dateiname." }, { status: 400 });
  }

  try {
    const res = await fetch(`${BASE_URL}${filename}`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Grenzen-Fehler (Status ${res.status})` },
        { status: 502 }
      );
    }

    const geojson = await res.json();
    return NextResponse.json(geojson);
  } catch (err) {
    console.error("Grenzen-Abruf fehlgeschlagen:", err);
    return NextResponse.json(
      { error: "Grenzen konnten nicht geladen werden." },
      { status: 502 }
    );
  }
}
