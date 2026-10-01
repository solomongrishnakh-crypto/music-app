/**
 * Echte Bahnen und Positionen für das Sonnensystem auf /universum
 * (Nutzerwunsch 29.09.2026: "realistischer machen mit Größe, Abstand und
 * so was").
 *
 * Quelle: NASA/JPL Horizons, oskulierende heliozentrische Bahnelemente
 * (Ekliptik J2000) zur Epoche 2026-09-29 00:00 TDB (JD 2461312.5), am
 * 29.09.2026 direkt über die Horizons-API abgefragt. Daraus wird für jedes
 * Datum die Position über die Kepler-Gleichung berechnet — für ein paar
 * Jahrzehnte um 2026 auf wenige Grad genau (Bahnstörungen durch andere
 * Planeten werden vernachlässigt), für die Darstellung mehr als genug.
 *
 * Voyager 1: Position + Geschwindigkeit aus Horizons (fliegt geradlinig
 * weiter, die Sonnenanziehung ist in dieser Entfernung vernachlässigbar).
 */

export const EPOCH_JD = 2461312.5;
const KM_PER_AU = 149597870.7;
const DEG = Math.PI / 180;

export interface OrbitElements {
  /** große Halbachse in AE */
  a: number;
  /** Exzentrizität */
  e: number;
  /** Bahnneigung (°) */
  i: number;
  /** Länge des aufsteigenden Knotens Ω (°) */
  om: number;
  /** Argument des Perihels ω (°) */
  w: number;
  /** mittlere Anomalie zur Epoche (°) */
  ma: number;
  /** mittlere Bewegung (°/Tag) */
  n: number;
}

// Horizons liefert A in km und N in °/s → hier umgerechnet (A/KM_PER_AU, N·86400).
function el(aKm: number, e: number, i: number, om: number, w: number, ma: number, nDegPerSec: number): OrbitElements {
  return { a: aKm / KM_PER_AU, e, i, om, w, ma, n: nDegPerSec * 86400 };
}

export const ORBITS: Record<string, OrbitElements> = {
  mercury: el(5.790892608014207e7, 2.056390807114914e-1, 7.003375512042178, 48.29731374175106, 29.20132402630943, 186.6732727962756, 4.736529199846262e-5),
  venus: el(1.082099670987079e8, 6.76395972818758e-3, 3.394337735756523, 76.605544058096, 54.91995313839145, 219.2641257005602, 1.85429182455275e-5),
  earth: el(1.494787157574844e8, 1.655588719177615e-2, 4.36016418287394e-3, 174.6469262207971, 291.1225081929034, 261.6051400408361, 1.142115603143966e-5),
  mars: el(2.279368616847293e8, 9.341742203413425e-2, 1.84745454179536, 49.48090771932242, 286.6374353116366, 97.82930901051819, 6.065361257399823e-6),
  jupiter: el(7.783568681960579e8, 4.818936015331411e-2, 1.303467182845052, 100.514663047018, 273.6367618935393, 111.8166015674367, 9.616510168575347e-7),
  saturn: el(1.42661217794534e9, 5.520455046815995e-2, 2.487169556698396, 113.5571802124799, 339.2442542027684, 284.1709291201881, 3.874196229546265e-7),
  uranus: el(2.881674875002003e9, 4.751913332590814e-2, 0.7740047534570682, 73.99767192886111, 92.55676404345037, 261.4041839530843, 1.349337094066862e-7),
  neptune: el(4.497418879937421e9, 9.870568762484096e-3, 1.771041211374972, 131.8188357570264, 282.6356276069623, 309.0800591682799, 6.920613966870631e-8),
  ceres: el(4.137872277436259e8, 7.976334651245402e-2, 10.58738725213349, 80.24896888786917, 73.19180483442622, 298.5253425343523, 2.479778141765618e-6),
  pluto: el(5.86909110426568e9, 2.493629025085499e-1, 17.38435799033674, 110.5163773574233, 111.9718561755553, 54.98896415339033, 4.642182119052547e-8),
  haumea: el(6.445619044608049e9, 1.938726667595587e-1, 28.20846762001525, 121.786820788763, 240.571751411483, 223.7185890041049, 4.033494775442732e-8),
  makemake: el(6.820991370595171e9, 1.582485191628396e-1, 29.02506027992908, 79.310836292327, 297.0630510569194, 170.329214182891, 3.705161983356512e-8),
  eris: el(1.015851774403129e10, 4.387596436614445e-1, 43.95235539265882, 35.99442820538744, 150.8348327274567, 211.9313385863969, 2.038604291889204e-8),
};

// Voyager 1 (Horizons, heliozentrisch, Ekliptik J2000, AE bzw. AE/Tag)
const VOYAGER_POS = [-32.16063166073721, -136.8088759764654, 98.98387558141307] as const;
const VOYAGER_VEL = [-1.19548863719881e-3, -7.861182549675848e-3, 5.678441447426493e-3] as const;

export type Vec3 = [number, number, number];

export function dateToJd(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

export function jdToDate(jd: number): Date {
  return new Date((jd - 2440587.5) * 86400000);
}

function solveKepler(M: number, e: number): number {
  let E = e < 0.8 ? M : Math.PI;
  for (let k = 0; k < 12; k++) {
    const d = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= d;
    if (Math.abs(d) < 1e-10) break;
  }
  return E;
}

/** Punkt auf der Bahn für eine exzentrische Anomalie E → heliozentrisch (AE). */
function pointFromEccentricAnomaly(o: OrbitElements, E: number): Vec3 {
  const xv = o.a * (Math.cos(E) - o.e);
  const yv = o.a * Math.sqrt(1 - o.e * o.e) * Math.sin(E);
  const w = o.w * DEG;
  const om = o.om * DEG;
  const inc = o.i * DEG;
  const cw = Math.cos(w), sw = Math.sin(w);
  const co = Math.cos(om), so = Math.sin(om);
  const ci = Math.cos(inc), si = Math.sin(inc);
  // Bahnebene → Ekliptik: R_z(Ω) · R_x(i) · R_z(ω)
  const x1 = xv * cw - yv * sw;
  const y1 = xv * sw + yv * cw;
  return [x1 * co - y1 * ci * so, x1 * so + y1 * ci * co, y1 * si];
}

/** Heliozentrische Position (AE, Ekliptik J2000) zum Julianischen Datum jd. */
export function bodyPosition(id: string, jd: number): Vec3 | null {
  if (id === "voyager1") {
    const dt = jd - EPOCH_JD;
    return [
      VOYAGER_POS[0] + VOYAGER_VEL[0] * dt,
      VOYAGER_POS[1] + VOYAGER_VEL[1] * dt,
      VOYAGER_POS[2] + VOYAGER_VEL[2] * dt,
    ];
  }
  const o = ORBITS[id];
  if (!o) return null;
  let M = (o.ma + o.n * (jd - EPOCH_JD)) % 360;
  if (M < 0) M += 360;
  return pointFromEccentricAnomaly(o, solveKepler(M * DEG, o.e));
}

/** Punkt auf der Bahn von `id` zur exzentrischen Anomalie E (rad), heliozentrisch in AE. */
export function orbitPointAtE(id: string, E: number): Vec3 | null {
  const o = ORBITS[id];
  return o ? pointFromEccentricAnomaly(o, E) : null;
}

/** Die ganze Bahnellipse als Punktfolge (für die Bahnlinie). */
export function orbitPath(id: string, segments = 160): Vec3[] {
  const o = ORBITS[id];
  if (!o) return [];
  const pts: Vec3[] = [];
  for (let k = 0; k <= segments; k++) {
    pts.push(pointFromEccentricAnomaly(o, (k / segments) * Math.PI * 2));
  }
  return pts;
}

export const SUN_RADIUS_AU = 695700 / KM_PER_AU;

/** Abstand zweier Körper in AE zum Datum jd. */
export function distanceAu(a: string, b: string, jd: number): number | null {
  const pa = bodyPosition(a, jd);
  const pb = bodyPosition(b, jd);
  if (!pa || !pb) return null;
  return Math.hypot(pa[0] - pb[0], pa[1] - pb[1], pa[2] - pb[2]);
}

/**
 * Nächste größte Annäherung von `id` an die Erde ab Datum jd (Nutzerwunsch
 * 01.10.2026: "wann kommt Mars nah"). Sucht in Tagesschritten das nächste
 * lokale Minimum des Abstands und verfeinert es auf ~1 Stunde. Gibt null
 * zurück, wenn im Suchzeitraum keins liegt (Pluto & Co. schwanken kaum).
 */
export function nextClosestApproach(
  id: string,
  jd: number,
  maxDays = 1200
): { jd: number; au: number } | null {
  const d = (t: number) => distanceAu(id, "earth", t) ?? Infinity;
  let prev = d(jd);
  let cur = d(jd + 1);
  // Steht der Planet gerade im Minimum bzw. kommt näher, ab jetzt suchen
  for (let day = 1; day < maxDays; day++) {
    const next = d(jd + day + 1);
    if (cur <= prev && cur < next) {
      // Feinsuche (Goldener Schnitt) im Intervall [day-1, day+1]
      let lo = jd + day - 1;
      let hi = jd + day + 1;
      for (let k = 0; k < 40; k++) {
        const m1 = lo + (hi - lo) * 0.382;
        const m2 = lo + (hi - lo) * 0.618;
        if (d(m1) < d(m2)) hi = m2;
        else lo = m1;
      }
      const t = (lo + hi) / 2;
      return { jd: t, au: d(t) };
    }
    prev = cur;
    cur = next;
  }
  return null;
}

export const KM_PER_AU_EXPORT = KM_PER_AU;
