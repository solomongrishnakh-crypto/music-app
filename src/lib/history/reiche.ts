import INDEX from "@/data/reiche/index.json";
import ALLE from "@/data/reiche/alle.json";

/**
 * Daten für die Einzelseiten /imperien/reich/[slug] (Nutzerwunsch 07.10.2026:
 * mehr Besucher über Google — z. B. bei "Römisches Reich Karte").
 *
 * Erzeugt aus den Cliopatria-Kartendaten (Seshat Global History Databank,
 * CC BY 4.0), die auch die interaktive Karte nutzt: die 300 größten bzw.
 * langlebigsten historischen Reiche. Pro Reich: Zeitraum, größte Ausdehnung
 * (Fläche auf der Kugel aus den Grenzen berechnet), Karte dieser Ausdehnung
 * als SVG, Flächenverlauf, Vorgänger/Nachfolger (welche Reiche dasselbe
 * Gebiet direkt davor/danach beherrschten) und zeitgleiche Nachbarn.
 * Alle Seiten werden beim Build fest erzeugt — zur Laufzeit wird nichts
 * gelesen oder berechnet.
 */
export interface ReichRef {
  n: string; // englischer Name aus dem Datensatz
  de: string | null;
  s: string | null; // Slug, falls es eine eigene Seite gibt
}

export interface ReichIndexEntry {
  slug: string;
  en: string;
  de: string | null;
  from: number;
  to: number;
  peakYear: number;
  peakArea: number; // km²
}

export interface Reich extends ReichIndexEntry {
  map: { w: number; h: number; land: string; shape: string };
  series: [number, number][]; // [Jahr, Fläche km²]
  pred: ReichRef[];
  succ: ReichRef[];
  cont: ReichRef[];
}

export const REICHE_INDEX = INDEX as unknown as ReichIndexEntry[];

// Alle Reich-Daten liegen in EINER Datei (ca. 15 MB). Sie wird fest in den
// Server-Code eingebunden (nicht ins Browser-Bundle) — so funktionieren auch
// die Sprachversionen, die erst beim ersten Aufruf erzeugt werden.
const ALLE_MAP = ALLE as unknown as Record<string, Reich>;

export async function loadReich(slug: string): Promise<Reich | null> {
  return ALLE_MAP[slug] ?? null;
}

export function reichName(r: { de: string | null; en?: string; n?: string }): string {
  return r.de ?? r.en ?? r.n ?? "";
}

export function formatJahr(y: number): string {
  return y < 0 ? `${-y} v. Chr.` : `${y} n. Chr.`;
}

/** Dauer in Jahren (es gibt kein Jahr 0). */
export function dauer(from: number, to: number): number {
  return to - from - (from < 0 && to > 0 ? 1 : 0);
}

export function formatFlaeche(km2: number): string {
  if (km2 >= 1_000_000) {
    return `${(km2 / 1_000_000).toLocaleString("de-DE", { maximumFractionDigits: 1 })} Mio. km²`;
  }
  return `${(Math.round(km2 / 1000) * 1000).toLocaleString("de-DE")} km²`;
}

/** Vergleich mit Deutschland (357.600 km²) — macht die Zahl greifbar. */
export function vergleichDeutschland(km2: number): string | null {
  const x = km2 / 357_600;
  if (x >= 1.5) return `rund ${Math.round(x).toLocaleString("de-DE")}-mal so groß wie das heutige Deutschland`;
  if (x >= 0.75) return "etwa so groß wie das heutige Deutschland";
  if (x >= 0.1) return `etwa ${Math.round(x * 100)} % der Fläche des heutigen Deutschlands`;
  return null;
}

export function epoche(year: number): string {
  if (year < 500) return "Altertum";
  if (year < 1500) return "Mittelalter";
  if (year < 1800) return "Frühe Neuzeit";
  return "Moderne";
}

/** Vorschaubild (fertig in public/og/imperien/, alle 50 Jahre). */
export function ogBildJahr(y: number): number {
  if (y >= 2012) return 2024;
  return Math.min(2000, Math.max(-3400, Math.round(y / 50) * 50));
}
