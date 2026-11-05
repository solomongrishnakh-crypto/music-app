import BOUNDS from "@/data/constBounds.json";
import { bodyPosition, dateToJd } from "@/lib/astro/orbits";

/**
 * Position am Himmel (Rektaszension/Deklination, J2000) für die Seiten
 * /himmelsposition/… — aus den Bahndaten der Planeten und Raumsonden
 * (orbits.ts) bzw. festen Katalogwerten für Sterne und Nebel.
 */
const DEG = Math.PI / 180;
const OBLIQUITY = 23.4392911 * DEG;

type Poly = [string, [number, number][]];
const POLYS = BOUNDS as unknown as Poly[];
const POLY_C = POLYS.map(([, poly]) => {
  const c = [0, 0, 0];
  for (const [x, y] of poly) {
    c[0] += Math.cos(y * DEG) * Math.cos(x * DEG);
    c[1] += Math.cos(y * DEG) * Math.sin(x * DEG);
    c[2] += Math.sin(y * DEG);
  }
  return c;
});

/** IAU-Sternbild (Kürzel wie "Oph") an einer Position (Grad, J2000) oder null. */
export function constellationAtEq(raDeg: number, decDeg: number): string | null {
  const ra = raDeg * DEG, dec = decDeg * DEG;
  const cp = Math.cos(dec), sp = Math.sin(dec);
  const pv = [cp * Math.cos(ra), cp * Math.sin(ra), sp];
  for (let k = 0; k < POLYS.length; k++) {
    const [id, poly] = POLYS[k], c = POLY_C[k];
    if (pv[0] * c[0] + pv[1] * c[1] + pv[2] * c[2] <= 0) continue;
    let tot = 0, prev: number | null = null;
    for (let i = 0; i <= poly.length; i++) {
      const [x, y] = poly[i % poly.length];
      const l2 = x * DEG, p2 = y * DEG, dl = l2 - ra;
      const br = Math.atan2(Math.sin(dl) * Math.cos(p2), cp * Math.sin(p2) - sp * Math.cos(p2) * Math.cos(dl));
      if (prev !== null) {
        let dd = br - prev;
        while (dd > Math.PI) dd -= 2 * Math.PI;
        while (dd < -Math.PI) dd += 2 * Math.PI;
        tot += dd;
      }
      prev = br;
    }
    if (Math.abs(tot) > Math.PI) return id;
  }
  return null;
}

export interface SkyPos {
  raDeg: number;
  decDeg: number;
  /** Abstand zur Erde in AE (nur bei Körpern im Sonnensystem) */
  au?: number;
}

/** Geozentrische Position eines Körpers im Sonnensystem (id wie in SPACE_BODIES). */
export function bodySkyPos(id: string, date: Date): SkyPos | null {
  const jd = dateToJd(date);
  const e = bodyPosition("earth", jd);
  if (!e) return null;
  const b = id === "sun" ? ([0, 0, 0] as [number, number, number]) : bodyPosition(id, jd);
  if (!b) return null;
  const x = b[0] - e[0], y = b[1] - e[1], z = b[2] - e[2];
  const au = Math.hypot(x, y, z);
  const ye = y * Math.cos(OBLIQUITY) - z * Math.sin(OBLIQUITY);
  const ze = y * Math.sin(OBLIQUITY) + z * Math.cos(OBLIQUITY);
  let ra = Math.atan2(ye, x) / DEG;
  if (ra < 0) ra += 360;
  return { raDeg: ra, decDeg: Math.atan2(ze, Math.hypot(x, ye)) / DEG, au };
}

/** "17h 15m" */
export function fmtRa(raDeg: number): string {
  const h = raDeg / 15;
  let hh = Math.floor(h);
  let mm = Math.round((h - hh) * 60);
  if (mm === 60) { hh = (hh + 1) % 24; mm = 0; }
  return `${hh}h ${String(mm).padStart(2, "0")}m`;
}

/** "+12.1°" */
export function fmtDec(decDeg: number): string {
  const s = decDeg < 0 ? "−" : "+";
  return `${s}${Math.abs(decDeg).toFixed(1)}°`;
}

/** Höchste Höhe über dem Horizont (°) für Breite lat (z. B. 51° N Deutschland); ≤ 0 = geht nie auf. */
export function maxAltitude(decDeg: number, latDeg = 51): number {
  return Math.round(90 - Math.abs(latDeg - decDeg));
}
