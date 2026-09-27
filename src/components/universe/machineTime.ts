/**
 * Ewige Zahnrad-Maschine: Stellung aller Räder aus der absoluten Zeit.
 *
 * Nutzerwunsch 27.09.2026: "ich will das es für alle live ist. wenn ich
 * nach millionen jahre die webseite sehen will dann sollen räder sich auch
 * bewegen. quasi wie ein virtuelles ewiges rad. anfang wurde schon
 * gestartet und es wird nie enden"
 *
 * Die Maschine läuft seit dem Urknall. Ihr Alter ist identisch mit dem
 * Universums-Alter im UniverseAgeTicker (13,797 Mrd. Jahre am 27.09.2026,
 * danach läuft die echte Uhr weiter). Die Stellung jedes Rads hängt nur von
 * der aktuellen Uhrzeit ab — nicht davon, wann jemand die Seite öffnet —
 * und ist damit für alle Besucher im selben Moment gleich, egal ob heute
 * oder in Millionen Jahren.
 *
 * Genauigkeit: Das Alter in Millisekunden (~4,35 × 10^20) passt nicht
 * exakt in eine normale JavaScript-Zahl. Deshalb wird mit BigInt exakt
 * gerechnet: Welle i macht pro Umdrehung des letzten Rads genau
 * 6^(22−i) Umdrehungen, also ist ihr Drehanteil
 *   frac = (Alter · 6^(22−i)) mod Periode_letztes_Rad  /  Periode_letztes_Rad
 * — exakt, ohne Rundungsfehler, für beliebig große Zeiten.
 */

export const AXLE_COUNT = 23;
export const RATIO = 6; // 60 : 10 Zähne pro Stufe

const SECONDS_PER_YEAR = 31_557_600; // 365,25 × 86400 (exakt)
const PERIOD_LAST_YEARS = 13_797_000_000; // Umdrehungszeit des letzten Rads

// BigInt(...) statt 123n-Literalen (Projekt-Target ES2017)
const PERIOD_LAST_MS = BigInt(PERIOD_LAST_YEARS) * BigInt(SECONDS_PER_YEAR) * BigInt(1000);
const PERIOD_LAST_MS_NUM = Number(PERIOD_LAST_MS);

// Alter des Universums am Referenzdatum = 13,797 Mrd. Jahre (wie im Ticker)
const AGE_AT_EPOCH_MS = BigInt(PERIOD_LAST_YEARS) * BigInt(SECONDS_PER_YEAR) * BigInt(1000);
const EPOCH_MS = Date.UTC(2026, 8, 27, 0, 0, 0);

// Umdrehungen pro Umdrehung des letzten Rads: Welle i → 6^(22−i), Motor → 6^23
const TURN_FACTORS: bigint[] = [];
for (let i = 0; i < AXLE_COUNT; i++) {
  let f = BigInt(1);
  for (let k = 0; k < AXLE_COUNT - 1 - i; k++) f *= BigInt(RATIO);
  TURN_FACTORS.push(f);
}
const MOTOR_FACTOR = TURN_FACTORS[0] * BigInt(RATIO);

/** Umdrehungszeit des ersten Rads in Sekunden (≈ 3,31 s). */
export const PERIOD_FIRST_SECONDS = PERIOD_LAST_MS_NUM / 1000 / Number(TURN_FACTORS[0]);

const TWO_PI = Math.PI * 2;

function angle(ageMs: bigint, subMs: number, factor: bigint, sign: number): number {
  const rem = (ageMs * factor) % PERIOD_LAST_MS;
  const frac = Number(rem) / PERIOD_LAST_MS_NUM + (Number(factor) * subMs) / PERIOD_LAST_MS_NUM;
  return sign * TWO_PI * (frac % 1);
}

/**
 * Drehwinkel (rad) aller Wellen und des Motors zum Zeitpunkt `nowMs`
 * (Unix-Millisekunden, darf Nachkommastellen haben).
 * Richtungen wechseln von Stufe zu Stufe; der Motor dreht gegen Rad 1.
 */
export function machineAngles(nowMs: number): { axles: number[]; motor: number } {
  const whole = Math.floor(nowMs);
  const subMs = nowMs - whole;
  const ageMs = AGE_AT_EPOCH_MS + BigInt(whole - EPOCH_MS);
  return {
    axles: TURN_FACTORS.map((f, i) => angle(ageMs, subMs, f, i % 2 === 0 ? 1 : -1)),
    motor: angle(ageMs, subMs, MOTOR_FACTOR, -1),
  };
}

/** Aktuelle Zeit mit Bruchteilen einer Millisekunde (für ruckelfreie schnelle Räder). */
export function preciseNow(): number {
  if (typeof performance !== "undefined" && typeof performance.timeOrigin === "number") {
    return performance.timeOrigin + performance.now();
  }
  return Date.now();
}

/** Umdrehungszeit von Rad i (0-basiert) in Sekunden. */
export function gearPeriodSeconds(i: number): number {
  return PERIOD_LAST_MS_NUM / 1000 / Number(TURN_FACTORS[i]);
}

/**
 * Nachkommastellen für die Stellungsanzeige von Rad i: so viele, dass sich
 * die letzte Stelle etwa jede Sekunde ändert — so sieht man auch beim
 * letzten Rad (≈ 8 × 10⁻¹⁶ Grad pro Sekunde), dass es sich bewegt.
 */
export function angleDecimals(i: number): number {
  const degPerSecond = 360 / gearPeriodSeconds(i);
  return Math.min(Math.max(Math.ceil(-Math.log10(degPerSecond)), 2), 16);
}

/**
 * Aktuelle Stellung von Rad i in Grad (0 … 360) als exakter Text mit
 * `decimals` Nachkommastellen — mit BigInt gerechnet, weil normale
 * Zahlen bei 16 Nachkommastellen nur noch Rundungsrauschen zeigen würden.
 */
export function gearAngleText(i: number, nowMs: number, decimals: number, decimalSeparator = "."): string {
  const whole = Math.floor(nowMs);
  const ageMs = AGE_AT_EPOCH_MS + BigInt(whole - EPOCH_MS);
  const rem = (ageMs * TURN_FACTORS[i]) % PERIOD_LAST_MS;
  let scale = BigInt(1);
  for (let k = 0; k < decimals; k++) scale *= BigInt(10);
  const scaled = (rem * BigInt(360) * scale) / PERIOD_LAST_MS;
  const digits = scaled.toString().padStart(decimals + 1, "0");
  const intPart = digits.slice(0, digits.length - decimals);
  const fracPart = digits.slice(digits.length - decimals);
  return decimals > 0 ? intPart + decimalSeparator + fracPart : intPart;
}
