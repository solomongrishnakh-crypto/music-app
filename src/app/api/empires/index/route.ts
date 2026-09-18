import { NextResponse } from "next/server";

/**
 * GET /api/empires/index
 *
 * Liefert die Liste aller Jahre, fuer die es historische Weltgrenzen gibt —
 * aus dem freien, offenen Datenset "historical-basemaps"
 * (github.com/aourednik/historical-basemaps, GPL-3.0), ueber jsDelivr als
 * CDN vor GitHub geladen (schneller, mit eigenem Cache). Deckt die Antike
 * (123000 v. Chr.) bis in die Neuzeit ab. Jeder Eintrag nennt Jahr +
 * zugehoerigen Dateinamen — die Dateinamen folgen KEINEM einfachen Muster
 * (z.B. "world_bc3000.geojson" fuer -3000, "world_1900.geojson" fuer 1900),
 * deshalb wird hier bewusst nichts selbst zusammengebaut, sondern immer der
 * Dateiname aus dieser Liste verwendet (siehe /api/empires/borders).
 * Wird 24h zwischengespeichert — historische Daten aendern sich nicht.
 *
 * Achtung: index.json ist KEIN flaches Array, sondern ein Objekt der Form
 * { "years": [ { "year": ..., "filename": ..., "countries": [...] }, ... ] }.
 */

const INDEX_URL =
  "https://cdn.jsdelivr.net/gh/aourednik/historical-basemaps@master/index.json";

interface RawIndexEntry {
  year?: unknown;
  filename?: unknown;
}

interface RawIndexResponse {
  years?: unknown;
}

export async function GET() {
  try {
    const res = await fetch(INDEX_URL, { next: { revalidate: 86400 } });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Zeitleiste-Fehler (Status ${res.status})` },
        { status: 502 }
      );
    }

    const data: unknown = await res.json();
    // Das echte Format ist { years: [...] } — kein flaches Array.
    const rawList: RawIndexEntry[] = Array.isArray(data)
      ? data
      : Array.isArray((data as RawIndexResponse)?.years)
        ? ((data as RawIndexResponse).years as RawIndexEntry[])
        : [];

    const years = rawList
      .filter(
        (entry): entry is { year: number; filename: string } =>
          typeof entry?.year === "number" && typeof entry?.filename === "string"
      )
      .map((entry) => ({ year: entry.year, filename: entry.filename }))
      .sort((a, b) => a.year - b.year);

    return NextResponse.json({ years });
  } catch (err) {
    console.error("Zeitleiste-Abruf fehlgeschlagen:", err);
    return NextResponse.json(
      { error: "Zeitleiste konnte nicht geladen werden." },
      { status: 502 }
    );
  }
}
