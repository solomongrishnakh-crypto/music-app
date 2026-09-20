import { NextResponse } from "next/server";
import { loadCliopatriaFeatures } from "@/lib/history/cliopatria";

// Das Cliopatria-ZIP ist ~42 MB (entpackt ~165 MB) — Herunterladen +
// Entpacken kann beim ersten (kalten) Aufruf länger als die Standard-10s
// dauern, deshalb das Funktions-Zeitlimit hier explizit anheben.
export const maxDuration = 60;

/**
 * GET /api/empires/index
 *
 * Liefert seit 20.09.2026 nur noch den verfügbaren Jahresbereich (min/max)
 * aus dem Cliopatria-Datensatz — NICHT mehr eine feste Liste von
 * "Kartenständen" alle paar Jahrzehnte wie beim alten historical-basemaps-
 * Datensatz. Jedes Reich trägt jetzt ein echtes Von-/Bis-Jahr, der Client
 * muss also nicht mehr "nächstgelegenes Jahr" raten und kann für JEDES
 * Kalenderjahr im Bereich /api/empires/borders?year=... aufrufen
 * (Nutzerkorrektur 20.09.2026: "fast jedes jahr ändert sich die
 * territoriums").
 */
export async function GET() {
  try {
    const features = await loadCliopatriaFeatures();

    let minYear = Infinity;
    let maxYear = -Infinity;
    for (const f of features) {
      const from = f.properties?.FromYear;
      const to = f.properties?.ToYear;
      if (typeof from === "number" && from < minYear) minYear = from;
      if (typeof to === "number" && to > maxYear) maxYear = to;
    }

    if (!isFinite(minYear) || !isFinite(maxYear)) {
      return NextResponse.json({ error: "Zeitleiste leer." }, { status: 502 });
    }

    return NextResponse.json({ minYear, maxYear });
  } catch (err) {
    console.error("Cliopatria-Zeitbereich fehlgeschlagen:", err);
    return NextResponse.json(
      { error: "Zeitleiste konnte nicht geladen werden." },
      { status: 502 }
    );
  }
}
