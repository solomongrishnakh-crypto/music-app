import { NextResponse } from "next/server";

/**
 * GET /api/exo
 *
 * Exoplaneten-Sterne ohne Kepler (Nutzerwunsch 23.10.2026: "mehr Exoplaneten
 * versteckt einbauen"). Quelle: NASA Exoplanet Archive (TAP, Tabelle pscomppars,
 * bestätigte Planeten). Gleiches Zeilenformat wie /kepler-data.json, plus
 * Entdeckungs-Einrichtung als 9. Planeten-Feld. Serverseitig, 24 h gecacht.
 */
export const revalidate = 86400;

const Q =
  "select hostname,ra,dec,sy_dist,sy_vmag,sy_gaiamag,st_teff,st_rad,st_mass,pl_name,pl_letter,pl_rade,pl_orbper,pl_orbsmax,pl_eqt,pl_bmasse,disc_year,disc_facility " +
  "from pscomppars where disc_facility<>'Kepler'";

const r = (v: unknown, d: number) => (typeof v === "number" && isFinite(v) ? Math.round(v * 10 ** d) / 10 ** d : null);

export async function GET() {
  try {
    const url = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?format=json&query=" + encodeURIComponent(Q);
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error("tap " + res.status);
    const rows = (await res.json()) as Record<string, unknown>[];
    const by = new Map<string, unknown[]>();
    for (const x of rows) {
      const host = String(x.hostname || "");
      if (!host || typeof x.ra !== "number" || typeof x.dec !== "number") continue;
      let e = by.get(host);
      if (!e) {
        const vm = typeof x.sy_vmag === "number" ? x.sy_vmag : typeof x.sy_gaiamag === "number" ? x.sy_gaiamag : null;
        e = [host, host, r(x.ra, 3), r(x.dec, 3), r(x.sy_dist, 1), r(vm, 1), r(x.st_teff, -1), r(x.st_rad, 2), r(x.st_mass, 2), []];
        by.set(host, e);
      }
      (e[9] as unknown[]).push([
        String(x.pl_name || ""), String(x.pl_letter || ""), r(x.pl_rade, 2), r(x.pl_orbper, 3), r(x.pl_orbsmax, 3),
        r(x.pl_eqt, 0), r(x.pl_bmasse, 1), typeof x.disc_year === "number" ? x.disc_year : null, String(x.disc_facility || ""),
      ]);
    }
    return NextResponse.json([...by.values()], { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } });
  } catch {
    return NextResponse.json([], { status: 502 });
  }
}
