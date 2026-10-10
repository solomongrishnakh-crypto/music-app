/**
 * Himmelsrechnung für „Himmel heute“ (Nutzerwunsch 09.10.2026).
 *
 * Sonne, Mond und Planeten nach den Bahnformeln von Paul Schlyter
 * ("How to compute planetary positions"), inkl. der wichtigsten Störungen
 * von Mond, Jupiter, Saturn und Uranus. Genauigkeit: ca. 1–2 Bogenminuten
 * (Mond wenige Bogenminuten) – für „was sehe ich heute am Himmel“ und für
 * Ereignis-Termine (auf wenige Minuten genau) mehr als ausreichend.
 *
 * Alle Winkel in Grad, Zeiten als Julianisches Datum (UT).
 * Keine Abhängigkeiten – läuft gleich auf dem Server und im Browser.
 */
import BOUNDS from "@/data/eclipticBounds.json";

const DEG = Math.PI / 180;
const sin = (x: number) => Math.sin(x * DEG);
const cos = (x: number) => Math.cos(x * DEG);
const atan2 = (y: number, x: number) => Math.atan2(y, x) / DEG;
export const rev = (x: number) => ((x % 360) + 360) % 360;
/** auf (−180, 180] */
export const wrap180 = (x: number) => {
  const r = rev(x);
  return r > 180 ? r - 360 : r;
};

export const PLANET_IDS = ["mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune"] as const;
export type PlanetId = (typeof PLANET_IDS)[number];

export const jdOf = (ms: number) => ms / 86400000 + 2440587.5;
export const msOf = (jd: number) => (jd - 2440587.5) * 86400000;
/** Schlyters Tageszahl (0.0 = 31.12.1999 0 h UT) */
const dayNum = (jd: number) => jd - 2451543.5;

type Elements = { N: number; i: number; w: number; a: number; e: number; M: number };

function elements(id: PlanetId, d: number): Elements {
  switch (id) {
    case "mercury":
      return { N: 48.3313 + 3.24587e-5 * d, i: 7.0047 + 5.0e-8 * d, w: 29.1241 + 1.01444e-5 * d, a: 0.387098, e: 0.205635 + 5.59e-10 * d, M: 168.6562 + 4.0923344368 * d };
    case "venus":
      return { N: 76.6799 + 2.4659e-5 * d, i: 3.3946 + 2.75e-8 * d, w: 54.891 + 1.38374e-5 * d, a: 0.72333, e: 0.006773 - 1.302e-9 * d, M: 48.0052 + 1.6021302244 * d };
    case "mars":
      return { N: 49.5574 + 2.11081e-5 * d, i: 1.8497 - 1.78e-8 * d, w: 286.5016 + 2.92961e-5 * d, a: 1.523688, e: 0.093405 + 2.516e-9 * d, M: 18.6021 + 0.5240207766 * d };
    case "jupiter":
      return { N: 100.4542 + 2.76854e-5 * d, i: 1.303 - 1.557e-7 * d, w: 273.8777 + 1.64505e-5 * d, a: 5.20256, e: 0.048498 + 4.469e-9 * d, M: 19.895 + 0.0830853001 * d };
    case "saturn":
      return { N: 113.6634 + 2.3898e-5 * d, i: 2.4886 - 1.081e-7 * d, w: 339.3939 + 2.97661e-5 * d, a: 9.55475, e: 0.055546 - 9.499e-9 * d, M: 316.967 + 0.0334442282 * d };
    case "uranus":
      return { N: 74.0005 + 1.3978e-5 * d, i: 0.7733 + 1.9e-8 * d, w: 96.6612 + 3.0565e-5 * d, a: 19.18171 - 1.55e-8 * d, e: 0.047318 + 7.45e-9 * d, M: 142.5905 + 0.011725806 * d };
    case "neptune":
      return { N: 131.7806 + 3.0173e-5 * d, i: 1.77 - 2.55e-7 * d, w: 272.8461 - 6.027e-6 * d, a: 30.05826 + 3.313e-8 * d, e: 0.008606 + 2.15e-9 * d, M: 260.2471 + 0.005995147 * d };
  }
}

/** Kepler-Gleichung, M und Ergebnis in Grad */
function eccentricAnomaly(M: number, e: number): number {
  const m = rev(M) * DEG;
  let E = m + e * Math.sin(m) * (1 + e * Math.cos(m));
  for (let k = 0; k < 30; k++) {
    const dE = (E - e * Math.sin(E) - m) / (1 - e * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < 1e-12) break;
  }
  return E / DEG;
}

/** Ort in der Bahn → ekliptikale Länge/Breite (Grad) und Abstand */
function orbitLonLat(el: Elements): { lon: number; lat: number; r: number } {
  const E = eccentricAnomaly(el.M, el.e);
  const xv = el.a * (cos(E) - el.e);
  const yv = el.a * Math.sqrt(1 - el.e * el.e) * sin(E);
  const v = atan2(yv, xv);
  const r = Math.hypot(xv, yv);
  const vw = v + el.w;
  const x = r * (cos(el.N) * cos(vw) - sin(el.N) * sin(vw) * cos(el.i));
  const y = r * (sin(el.N) * cos(vw) + cos(el.N) * sin(vw) * cos(el.i));
  const z = r * sin(vw) * sin(el.i);
  return { lon: rev(atan2(y, x)), lat: atan2(z, Math.hypot(x, y)), r };
}

export type SunPos = { lon: number; r: number; M: number; L: number };
/** Sonne (geozentrisch, Ekliptik des Datums) */
export function sunPos(jd: number): SunPos {
  const d = dayNum(jd);
  const w = 282.9404 + 4.70935e-5 * d;
  const e = 0.016709 - 1.151e-9 * d;
  const M = rev(356.047 + 0.9856002585 * d);
  const E = eccentricAnomaly(M, e);
  const xv = cos(E) - e;
  const yv = Math.sqrt(1 - e * e) * sin(E);
  return { lon: rev(atan2(yv, xv) + w), r: Math.hypot(xv, yv), M, L: rev(M + w) };
}

export type MoonPos = { lon: number; lat: number; distKm: number };
/** Mond (geozentrisch, Ekliptik des Datums) mit den Hauptstörungen */
export function moonPos(jd: number): MoonPos {
  const d = dayNum(jd);
  const el: Elements = { N: 125.1228 - 0.0529538083 * d, i: 5.1454, w: 318.0634 + 0.1643573223 * d, a: 60.2666, e: 0.0549, M: 115.3654 + 13.0649929509 * d };
  const p = orbitLonLat(el);
  const s = sunPos(jd);
  const Ms = s.M, Mm = rev(el.M), Lm = rev(el.N + el.w + el.M);
  const D = Lm - s.L, F = Lm - el.N;
  const lon = p.lon
    - 1.274 * sin(Mm - 2 * D) + 0.658 * sin(2 * D) - 0.186 * sin(Ms) - 0.059 * sin(2 * Mm - 2 * D)
    - 0.057 * sin(Mm - 2 * D + Ms) + 0.053 * sin(Mm + 2 * D) + 0.046 * sin(2 * D - Ms) + 0.041 * sin(Mm - Ms)
    - 0.035 * sin(D) - 0.031 * sin(Mm + Ms) - 0.015 * sin(2 * F - 2 * D) + 0.011 * sin(Mm - 4 * D);
  const lat = p.lat
    - 0.173 * sin(F - 2 * D) - 0.055 * sin(Mm - F - 2 * D) - 0.046 * sin(Mm + F - 2 * D)
    + 0.033 * sin(F + 2 * D) + 0.017 * sin(2 * Mm + F);
  const rEarthRadii = p.r - 0.58 * cos(Mm - 2 * D) - 0.46 * cos(2 * D);
  return { lon: rev(lon), lat, distKm: rEarthRadii * 6371 };
}

export type PlanetPos = {
  id: PlanetId;
  lon: number; lat: number; // geozentrisch, Ekliptik des Datums
  dist: number; // Abstand zur Erde (AE)
  r: number; // Abstand zur Sonne (AE)
  elong: number; // Winkelabstand zur Sonne (Grad, >0 östlich = Abendhimmel)
  mag: number; // scheinbare Helligkeit
};

export function planetPos(id: PlanetId, jd: number): PlanetPos {
  const d = dayNum(jd);
  const h = orbitLonLat(elements(id, d));
  let { lon, lat } = h;
  const r = h.r;
  if (id === "jupiter" || id === "saturn" || id === "uranus") {
    const Mj = rev(19.895 + 0.0830853001 * d), Ms = rev(316.967 + 0.0334442282 * d), Mu = rev(142.5905 + 0.011725806 * d);
    if (id === "jupiter") {
      lon += -0.332 * sin(2 * Mj - 5 * Ms - 67.6) - 0.056 * sin(2 * Mj - 2 * Ms + 21) + 0.042 * sin(3 * Mj - 5 * Ms + 21)
        - 0.036 * sin(Mj - 2 * Ms) + 0.022 * cos(Mj - Ms) + 0.023 * sin(2 * Mj - 3 * Ms + 52) - 0.016 * sin(Mj - 5 * Ms - 69);
    } else if (id === "saturn") {
      lon += 0.812 * sin(2 * Mj - 5 * Ms - 67.6) - 0.229 * cos(2 * Mj - 4 * Ms - 2) + 0.119 * sin(Mj - 2 * Ms - 3)
        + 0.046 * sin(2 * Mj - 6 * Ms - 69) + 0.014 * sin(Mj - 3 * Ms + 32);
      lat += -0.02 * cos(2 * Mj - 4 * Ms - 2) + 0.018 * sin(2 * Mj - 6 * Ms - 49);
    } else {
      lon += 0.04 * sin(Ms - 2 * Mu + 6) + 0.035 * sin(Ms - 3 * Mu + 33) - 0.015 * sin(Mj - Mu + 20);
    }
  }
  const s = sunPos(jd);
  const xs = s.r * cos(s.lon), ys = s.r * sin(s.lon);
  const xh = r * cos(lat) * cos(lon), yh = r * cos(lat) * sin(lon), zh = r * sin(lat);
  const xg = xh + xs, yg = yh + ys, zg = zh;
  const dist = Math.sqrt(xg * xg + yg * yg + zg * zg);
  const glon = rev(atan2(yg, xg)), glat = atan2(zg, Math.hypot(xg, yg));
  const sep = Math.acos(Math.max(-1, Math.min(1, cos(glat) * cos(glon - s.lon)))) / DEG;
  const elong = wrap180(glon - s.lon) >= 0 ? sep : -sep;
  // Phasenwinkel und Helligkeit (Schlyter)
  const cfv = (r * r + dist * dist - s.r * s.r) / (2 * r * dist);
  const FV = Math.acos(Math.max(-1, Math.min(1, cfv))) / DEG;
  const lg = 5 * Math.log10(r * dist);
  let mag: number;
  switch (id) {
    case "mercury": mag = -0.36 + lg + 0.027 * FV + 2.2e-13 * FV ** 6; break;
    case "venus": mag = -4.34 + lg + 0.013 * FV + 4.2e-7 * FV ** 3; break;
    case "mars": mag = -1.51 + lg + 0.016 * FV; break;
    case "jupiter": mag = -9.25 + lg + 0.014 * FV; break;
    case "saturn": {
      const ir = 28.06, Nr = 169.51 + 3.82e-5 * d;
      const B = Math.asin(sin(ir) * cos(glat) * sin(glon - Nr) - cos(ir) * sin(glat));
      mag = -9.0 + lg + 0.044 * FV - 2.6 * Math.abs(Math.sin(B)) + 1.2 * Math.sin(B) ** 2;
      break;
    }
    case "uranus": mag = -7.15 + lg + 0.001 * FV; break;
    default: mag = -6.9 + lg + 0.001 * FV;
  }
  return { id, lon: glon, lat: glat, dist, r, elong, mag };
}

/** Schiefe der Ekliptik des Datums */
const obliquity = (jd: number) => 23.4393 - 3.563e-7 * dayNum(jd);

/** Ekliptik → Äquator (beide in Grad); RA 0…360 */
export function eclToEq(lon: number, lat: number, eps: number): { ra: number; dec: number } {
  const x = cos(lat) * cos(lon), y = cos(lat) * sin(lon), z = sin(lat);
  const ye = y * cos(eps) - z * sin(eps), ze = y * sin(eps) + z * cos(eps);
  return { ra: rev(atan2(ye, x)), dec: atan2(ze, Math.hypot(x, ye)) };
}

/** RA/Dec des Datums für Sonne, Mond oder Planet */
export function eqOfDate(id: PlanetId | "sun" | "moon", jd: number): { ra: number; dec: number } {
  const eps = obliquity(jd);
  if (id === "sun") return eclToEq(sunPos(jd).lon, 0, eps);
  if (id === "moon") { const m = moonPos(jd); return eclToEq(m.lon, m.lat, eps); }
  const p = planetPos(id, jd);
  return eclToEq(p.lon, p.lat, eps);
}

// ---------- Mond: Phase ----------
export type MoonPhaseKey = "new" | "waxCres" | "firstQ" | "waxGib" | "full" | "wanGib" | "lastQ" | "wanCres";
export type MoonInfo = MoonPos & { age: number; illum: number; phase: MoonPhaseKey; waxing: boolean };

export function moonInfo(jd: number): MoonInfo {
  const m = moonPos(jd), s = sunPos(jd);
  const D = rev(m.lon - s.lon); // 0 = Neumond, 180 = Vollmond
  const el = Math.acos(Math.max(-1, Math.min(1, cos(m.lat) * cos(m.lon - s.lon)))) / DEG;
  const illum = (1 - cos(el)) / 2;
  const phase: MoonPhaseKey =
    D < 12 || D >= 348 ? "new" : D < 78 ? "waxCres" : D < 102 ? "firstQ" : D < 168 ? "waxGib"
      : D < 192 ? "full" : D < 258 ? "wanGib" : D < 282 ? "lastQ" : "wanCres";
  return { ...m, age: D, illum, phase, waxing: D < 180 };
}

// ---------- Nullstellen / Extremwerte ----------
/** Sucht in [jd0, jd1] mit Schrittweite step die Vorzeichenwechsel von f (nur „echte“, |f| < 90) */
function findCrossings(f: (jd: number) => number, jd0: number, jd1: number, step: number): number[] {
  const out: number[] = [];
  let a = jd0, fa = f(a);
  for (let b = jd0 + step; b <= jd1 + 1e-9; b += step) {
    const fb = f(b);
    if (fa === 0) out.push(a);
    else if (fa * fb < 0 && Math.abs(fa) < 90 && Math.abs(fb) < 90) {
      let lo = a, hi = b, flo = fa;
      for (let k = 0; k < 40 && hi - lo > 1e-5; k++) {
        const mid = (lo + hi) / 2, fm = f(mid);
        if (flo * fm <= 0) hi = mid; else { lo = mid; flo = fm; }
      }
      out.push((lo + hi) / 2);
    }
    a = b; fa = fb;
  }
  return out;
}

/** lokale Maxima von g in [jd0, jd1] (Abtastung step, dann Goldener Schnitt) */
function findMaxima(g: (jd: number) => number, jd0: number, jd1: number, step: number): { jd: number; v: number }[] {
  const out: { jd: number; v: number }[] = [];
  let p0 = g(jd0 - step), p1 = g(jd0);
  for (let t = jd0; t <= jd1; t += step) {
    const p2 = g(t + step);
    if (p1 >= p0 && p1 > p2) {
      let lo = t - step, hi = t + step;
      const gr = (Math.sqrt(5) - 1) / 2;
      for (let k = 0; k < 60 && hi - lo > 1e-4; k++) {
        const c = hi - gr * (hi - lo), dd = lo + gr * (hi - lo);
        if (g(c) > g(dd)) hi = dd; else lo = c;
      }
      const jd = (lo + hi) / 2;
      out.push({ jd, v: g(jd) });
    }
    p0 = p1; p1 = p2;
  }
  return out;
}

export type MoonPhaseEvent = { kind: "new" | "firstQ" | "full" | "lastQ"; jd: number };
/** Hauptphasen des Mondes zwischen jd0 und jd0+days */
export function moonPhases(jd0: number, days: number): MoonPhaseEvent[] {
  const out: MoonPhaseEvent[] = [];
  const kinds: [MoonPhaseEvent["kind"], number][] = [["new", 0], ["firstQ", 90], ["full", 180], ["lastQ", 270]];
  for (const [kind, target] of kinds) {
    const f = (jd: number) => wrap180(moonPos(jd).lon - sunPos(jd).lon - target);
    for (const jd of findCrossings(f, jd0, jd0 + days, 0.5)) out.push({ kind, jd });
  }
  return out.sort((x, y) => x.jd - y.jd);
}

/** Oppositionen (Planet der Sonne gegenüber) der äußeren Planeten */
export function oppositions(jd0: number, days: number): { id: PlanetId; jd: number; mag: number }[] {
  const out: { id: PlanetId; jd: number; mag: number }[] = [];
  for (const id of ["mars", "jupiter", "saturn", "uranus", "neptune"] as PlanetId[]) {
    const f = (jd: number) => wrap180(planetPos(id, jd).lon - sunPos(jd).lon - 180);
    for (const jd of findCrossings(f, jd0, jd0 + days, 2)) out.push({ id, jd, mag: planetPos(id, jd).mag });
  }
  return out;
}

/** größte östliche/westliche Elongation von Merkur und Venus */
export function greatestElongations(jd0: number, days: number): { id: PlanetId; jd: number; deg: number; east: boolean }[] {
  const out: { id: PlanetId; jd: number; deg: number; east: boolean }[] = [];
  for (const id of ["mercury", "venus"] as PlanetId[]) {
    for (const east of [true, false]) {
      const g = (jd: number) => { const e = planetPos(id, jd).elong; return east ? e : -e; };
      for (const m of findMaxima(g, jd0, jd0 + days, 1)) if (m.v > 10) out.push({ id, jd: m.jd, deg: m.v, east });
    }
  }
  return out;
}

/** enge Begegnungen heller Planeten (Abstand < maxDeg) */
export function planetPairs(jd0: number, days: number, maxDeg = 3): { a: PlanetId; b: PlanetId; jd: number; deg: number }[] {
  const ids: PlanetId[] = ["mercury", "venus", "mars", "jupiter", "saturn"];
  const out: { a: PlanetId; b: PlanetId; jd: number; deg: number }[] = [];
  for (let i = 0; i < ids.length; i++) for (let k = i + 1; k < ids.length; k++) {
    const a = ids[i], b = ids[k];
    const sep = (jd: number) => {
      const p = planetPos(a, jd), q = planetPos(b, jd);
      const c = sin(p.lat) * sin(q.lat) + cos(p.lat) * cos(q.lat) * cos(p.lon - q.lon);
      return Math.acos(Math.max(-1, Math.min(1, c))) / DEG;
    };
    for (const m of findMaxima((jd) => -sep(jd), jd0, jd0 + days, 1)) {
      const deg = -m.v;
      // nur sichtbar, wenn nicht zu nah an der Sonne
      if (deg < maxDeg && Math.abs(planetPos(a, m.jd).elong) > 15) out.push({ a, b, jd: m.jd, deg });
    }
  }
  return out;
}

// ---------- Auf- und Untergang ----------
function gmst(jd: number): number {
  const d = jd - 2451545.0, T = d / 36525;
  return rev(280.46061837 + 360.98564736629 * d + 0.000387933 * T * T);
}
/** Höhe über dem Horizont (Grad) */
export function altitude(id: PlanetId | "sun" | "moon", jd: number, lat: number, lon: number): number {
  const q = eqOfDate(id, jd);
  const H = gmst(jd) + lon - q.ra;
  return Math.asin(sin(lat) * sin(q.dec) + cos(lat) * cos(q.dec) * cos(H)) / DEG;
}
/**
 * Nächster Auf- und Untergang ab jd (innerhalb von 24 h). Normhöhen:
 * Sonne −0,833° (Refraktion + Sonnenradius), Mond +0,125°, Planeten −0,567°.
 * null = passiert in den nächsten 24 h nicht.
 */
export function riseSet(id: PlanetId | "sun" | "moon", jd: number, lat: number, lon: number): { rise: number | null; set: number | null; up: boolean } {
  const h0 = id === "sun" ? -0.833 : id === "moon" ? 0.125 : -0.567;
  const f = (t: number) => altitude(id, t, lat, lon) - h0;
  let rise: number | null = null, set: number | null = null;
  const step = 10 / 1440;
  let a = jd, fa = f(a);
  const up = fa > 0;
  for (let b = jd + step; b <= jd + 1 + 1e-9 && (rise === null || set === null); b += step) {
    const fb = f(b);
    if (fa * fb < 0) {
      let lo = a, hi = b, flo = fa;
      for (let k = 0; k < 20; k++) { const mid = (lo + hi) / 2, fm = f(mid); if (flo * fm <= 0) hi = mid; else { lo = mid; flo = fm; } }
      const t = (lo + hi) / 2;
      if (fa < 0 && rise === null) rise = t;
      if (fa > 0 && set === null) set = t;
    }
    a = b; fa = fb;
  }
  return { rise, set, up };
}

// ---------- Sternbild ----------
type Poly = [string, [number, number][]];
const POLYS = BOUNDS as unknown as Poly[];
const POLY_C = POLYS.map(([, poly]) => {
  const c = [0, 0, 0];
  for (const [x, y] of poly) { c[0] += cos(y) * cos(x); c[1] += cos(y) * sin(x); c[2] += sin(y); }
  return c;
});
/**
 * IAU-Sternbild an einer ekliptikalen Position des Datums (nur Gegend um die
 * Ekliptik – genügt für Mond und Planeten). Grenzen: J2000 (d3-celestial).
 */
export function constellationAtEcl(lonOfDate: number, lat: number, jd: number): string | null {
  const T = (jd - 2451545) / 36525;
  const q = eclToEq(lonOfDate - 1.396971 * T, lat, 23.4392911); // Präzession → J2000
  const ra = q.ra * DEG, dec = q.dec * DEG;
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
      if (prev !== null) { let dd = br - prev; while (dd > Math.PI) dd -= 2 * Math.PI; while (dd < -Math.PI) dd += 2 * Math.PI; tot += dd; }
      prev = br;
    }
    if (Math.abs(tot) > Math.PI) return id;
  }
  return null;
}
