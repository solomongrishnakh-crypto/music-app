import type { Lang } from "@/contexts/LanguageContext";

/**
 * Reisezeit-Seiten /reisezeit/[ziel]/[fahrzeug] (Nutzerwunsch 16.10.2026:
 * SEO-Seiten für Suchen wie "Wie lange dauert es mit dem Auto zum Saturn?").
 *
 * Entfernungen von der Erde (km): Mond Perigäum/Mittel/Apogäum, Planeten bei
 * Opposition/Mittel (≈ Bahnradius bzw. für Mars der übliche Mittelwert
 * 225 Mio. km)/Konjunktion, Sonne Perihel/AE/Aphel. Proxima Centauri
 * 4,2465 Lj, Andromeda 2,5 Mio. Lj (1 Lj = 9,4607 Bio. km).
 * Reisezeit = Entfernung ÷ Geschwindigkeit, konstantes Tempo, gerade Linie.
 */
export const LY_KM = 9.4607e12;
export const HOURS_PER_YEAR = 8766; // 365,25 Tage

export const DESTS = ["mond", "mars", "sonne", "jupiter", "saturn", "neptun", "proxima-centauri", "andromeda"] as const;
export type DestId = (typeof DESTS)[number];

export const VEHICLES = ["auto", "flugzeug", "rakete", "lichtgeschwindigkeit"] as const;
export type VehicleId = (typeof VEHICLES)[number];

export interface DestData {
  mean: number;
  min?: number;
  max?: number;
  /** Entfernung in Lichtjahren (nur Sterne/Galaxien) */
  ly?: number;
  /** Seite /sonnensystem/[id], falls vorhanden */
  bodyId?: string;
}

export const DEST_DATA: Record<DestId, DestData> = {
  mond: { min: 356_400, mean: 384_400, max: 406_700 },
  mars: { min: 54.6e6, mean: 225e6, max: 401e6, bodyId: "mars" },
  sonne: { min: 147.1e6, mean: 149.6e6, max: 152.1e6, bodyId: "sun" },
  jupiter: { min: 588e6, mean: 778e6, max: 968e6, bodyId: "jupiter" },
  saturn: { min: 1.2e9, mean: 1.43e9, max: 1.66e9, bodyId: "saturn" },
  neptun: { min: 4.3e9, mean: 4.5e9, max: 4.69e9, bodyId: "neptune" },
  "proxima-centauri": { mean: 4.2465 * LY_KM, ly: 4.2465 },
  andromeda: { mean: 2.5e6 * LY_KM, ly: 2.5e6 },
};

/** km/h — Rakete: Tempo von Voyager 1 (≈ 17 km/s) */
export const SPEED: Record<VehicleId, number> = {
  auto: 100,
  flugzeug: 900,
  rakete: 61_000,
  lichtgeschwindigkeit: 1_079_252_849,
};

export function isDest(v: string): v is DestId {
  return (DESTS as readonly string[]).includes(v);
}
export function isVehicle(v: string): v is VehicleId {
  return (VEHICLES as readonly string[]).includes(v);
}

export function travelPath(d: DestId, v: VehicleId): string {
  return `/reisezeit/${d}/${v}`;
}

export function travelHours(km: number, v: VehicleId): number {
  return km / SPEED[v];
}

const NUM_LOCALE: Record<Lang, string> = {
  de: "de-DE", en: "en-US", es: "es-ES", fr: "fr-FR", pt: "pt-BR", tr: "tr-TR", ru: "ru-RU",
  el: "el-GR", ar: "ar", hi: "hi-IN", zh: "zh-CN", ja: "ja-JP", ko: "ko-KR",
};

/** Spanisch/Französisch/Portugiesisch brauchen "de"/"d'" zwischen "Millionen" und Einheit. */
function connector(lang: Lang, word: string): string {
  if (lang === "es" || lang === "pt") return " de ";
  if (lang === "fr") return /^[aeiouyéèh]/i.test(word) ? " d'" : " de ";
  return " ";
}

function compact(n: number, lang: Lang, sig: number): string {
  return new Intl.NumberFormat(NUM_LOCALE[lang], {
    notation: "compact",
    compactDisplay: "long",
    maximumSignificantDigits: sig,
  }).format(n);
}

const KM: Record<Lang, string> = {
  de: "km", en: "km", es: "km", fr: "km", pt: "km", tr: "km", ru: "км", el: "km",
  ar: "كم", hi: "किमी", zh: "公里", ja: "km", ko: "km",
};
const KMH: Record<Lang, string> = {
  de: "km/h", en: "km/h", es: "km/h", fr: "km/h", pt: "km/h", tr: "km/sa", ru: "км/ч", el: "km/h",
  ar: "كم/س", hi: "किमी/घंटा", zh: "公里/小时", ja: "km/h", ko: "km/h",
};
const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";

/** Entfernung lesbar: "384.400 km", "1,43 Milliarden km", "2,37 × 10¹⁹ km" */
export function fmtDist(km: number, lang: Lang): string {
  const unit = KM[lang];
  const sep = lang === "zh" ? "" : " ";
  if (km >= 1e15) {
    const exp = Math.floor(Math.log10(km));
    const mant = (km / 10 ** exp).toLocaleString(NUM_LOCALE[lang], { maximumFractionDigits: 2 });
    const e = String(exp).split("").map((c) => SUP[Number(c)]).join("");
    return `${mant} × 10${e} ${unit}`;
  }
  if (km >= 1e9) {
    const c = compact(km, lang, 3);
    return lang === "es" || lang === "pt" || lang === "fr" ? c + connector(lang, unit) + unit : c + sep + unit;
  }
  return km.toLocaleString(NUM_LOCALE[lang]) + sep + unit;
}

export function fmtSpeed(v: VehicleId, lang: Lang): string {
  return `${SPEED[v].toLocaleString(NUM_LOCALE[lang])} ${KMH[lang]}`;
}

/** Lichtjahre kurz: "4,25 Lj", "2,5 Mio. Lj" */
const LY_ABBR: Record<Lang, string> = {
  de: "Lj", en: "ly", es: "a. l.", fr: "al", pt: "a.l.", tr: "ışık yılı", ru: "св. лет", el: "έτη φωτός",
  ar: "سنة ضوئية", hi: "प्रकाश वर्ष", zh: "光年", ja: "光年", ko: "광년",
};
export function fmtLy(ly: number, lang: Lang): string {
  const n = new Intl.NumberFormat(NUM_LOCALE[lang], { notation: "compact", maximumFractionDigits: 2 }).format(ly);
  return lang === "zh" || lang === "ja" ? n + LY_ABBR[lang] : `${n} ${LY_ABBR[lang]}`;
}

type Unit = "second" | "minute" | "hour" | "day" | "year";
const YEARS_WORD: Partial<Record<Lang, string>> = { es: "años", fr: "années", pt: "anos" };

/**
 * Reisedauer lesbar in der jeweiligen Sprache: Sekunden bis Billionen Jahre.
 * Unter 20 eine Nachkommastelle (12,5 Minuten), sonst 2 gültige Stellen
 * (1.600 Jahre, 46 Millionen Jahre).
 */
export function fmtDuration(hours: number, lang: Lang): string {
  const s = hours * 3600;
  let n: number;
  let unit: Unit;
  if (s < 90) [n, unit] = [s, "second"];
  else if (s / 60 < 90) [n, unit] = [s / 60, "minute"];
  else if (hours < 48) [n, unit] = [hours, "hour"];
  else if (hours / 24 < 365) [n, unit] = [hours / 24, "day"];
  else [n, unit] = [hours / HOURS_PER_YEAR, "year"];

  if (n >= 1e6 && YEARS_WORD[lang]) {
    const w = YEARS_WORD[lang]!;
    return compact(n, lang, 2) + connector(lang, w) + w;
  }
  const opts: Intl.NumberFormatOptions =
    n < 20 ? { maximumFractionDigits: 1 } : { maximumSignificantDigits: 2 };
  return new Intl.NumberFormat(NUM_LOCALE[lang], {
    style: "unit",
    unit,
    unitDisplay: "long",
    notation: n >= 1e6 ? "compact" : "standard",
    compactDisplay: "long",
    ...opts,
  }).format(n);
}

/** Platzhalter {name} in Vorlagen ersetzen */
export function tpl(s: string, vars: Record<string, string>): string {
  return s.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? "");
}

export function capFirst(s: string, lang: Lang): string {
  return s.charAt(0).toLocaleUpperCase(NUM_LOCALE[lang]) + s.slice(1);
}
