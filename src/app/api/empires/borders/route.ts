import { NextRequest, NextResponse } from "next/server";
import { loadCliopatriaFeatures } from "@/lib/history/cliopatria";

// Siehe /api/empires/index/route.ts — derselbe Grund (großer Datensatz,
// erster Aufruf lädt/entpackt ~165 MB).
export const maxDuration = 60;

/**
 * GET /api/empires/borders?year=1200
 *
 * Liefert alle Gebiete/Reiche, deren Von-/Bis-Jahr (FromYear/ToYear) das
 * angefragte Kalenderjahr einschließt — aus dem Cliopatria-Datensatz
 * (Seshat Global History Databank, CC BY 4.0). Ersetzt seit 20.09.2026 den
 * bisherigen Parameter "filename" (fixe Kartenstand-Datei alle paar
 * Jahrzehnte aus dem alten historical-basemaps-Datensatz) komplett — jedes
 * einzelne Jahr liefert jetzt echte, für genau dieses Jahr gültige Grenzen
 * (Nutzerkorrektur 20.09.2026: "fast jedes jahr ändert sich die
 * territoriums", "es fehlt auch imperium namen über territorium").
 *
 * Die Antwort wird auf das GeoJSON-Property-Schema abgebildet, das die
 * /imperien-Seite erwartet (NAME, SUBJECTO) — Cliopatria kennt keine
 * "Kolonialmacht/Teil von"-Angabe wie das alte Datenset, SUBJECTO bleibt
 * deshalb leer statt erfunden zu werden.
 */
export async function GET(request: NextRequest) {
  const yearParam = request.nextUrl.searchParams.get("year");
  const year = yearParam !== null ? Number(yearParam) : NaN;

  if (!Number.isFinite(year) || !Number.isInteger(year)) {
    return NextResponse.json({ error: "Ungültiges Jahr." }, { status: 400 });
  }

  try {
    const features = await loadCliopatriaFeatures();

    const matching = features.filter((f) => {
      const from = f.properties?.FromYear;
      const to = f.properties?.ToYear;
      return (
        typeof from === "number" &&
        typeof to === "number" &&
        from <= year &&
        year <= to &&
        typeof f.properties?.Name === "string" &&
        f.properties.Name.trim().length > 0
      );
    });

    const geojson = {
      type: "FeatureCollection",
      features: matching.map((f) => ({
        type: "Feature",
        properties: {
          NAME: f.properties.Name,
          SUBJECTO: "",
        },
        geometry: f.geometry,
      })),
    };

    return NextResponse.json(geojson);
  } catch (err) {
    console.error("Cliopatria-Grenzen fehlgeschlagen:", err);
    return NextResponse.json(
      { error: "Grenzen für dieses Jahr konnten nicht geladen werden." },
      { status: 502 }
    );
  }
}
