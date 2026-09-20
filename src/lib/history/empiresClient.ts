/**
 * Löst das eigentliche Problem hinter "das mit laden wurde nicht behoben,
 * hab ca. 5 minuten gewartet" (Nutzerkorrektur 20.09.2026): vorher lud
 * JEDE Server-Funktion (/api/empires/index UND /api/empires/borders,
 * jeweils als eigene, isolierte Vercel-Serverless-Funktion kompiliert)
 * unabhängig voneinander das komplette Cliopatria-ZIP (~42 MB) herunter,
 * entpackte es (~165 MB JSON) und parste es neu — der modul-weite Cache in
 * cliopatria.ts wurde zwischen den beiden Routen nie geteilt, dadurch
 * passierte die teure Arbeit mehrfach pro Seitenaufruf, auf Vercels
 * Hobby-Plan (begrenztes Funktions-Memory/CPU) besonders langsam.
 *
 * Jetzt liegt der (vorab gefilterte, auf Name/Von-/Bis-Jahr/Geometrie
 * reduzierte und geometrisch vereinfachte) Datensatz als statische Datei
 * unter /public/data/ — wird vom Browser direkt über Vercels CDN geladen
 * (komprimiert, gecacht), kein Serverless-Umweg, kein ZIP-Entpacken zur
 * Laufzeit mehr nötig. Gefiltert wird jetzt direkt im Browser, pro Jahr —
 * das ist bei ~13.000 Einträgen in wenigen Millisekunden erledigt.
 *
 * "-v1" im Dateinamen: bei einer künftigen Aktualisierung des Datensatzes
 * bitte die Zahl hochzählen (siehe next.config.ts, Cache-Control für
 * /data/ ist bewusst auf "immutable" gesetzt) statt dieselbe Datei zu
 * überschreiben, sonst liefern Browser mit noch warmen Cache weiter die
 * alte Version aus.
 */

const DATA_URL = "/data/empires-v1.json";

interface RawEmpireEntry {
  n: string; // Name
  f: number; // FromYear
  t: number; // ToYear
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  g: any; // geometry (GeoJSON Polygon/MultiPolygon)
}

export interface EmpiresYearRange {
  minYear: number;
  maxYear: number;
}

export interface EmpireGeojsonFeature {
  type: "Feature";
  properties: { NAME: string; SUBJECTO: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geometry: any;
}

export interface EmpireFeatureCollection {
  type: "FeatureCollection";
  features: EmpireGeojsonFeature[];
}

let cachedEntriesPromise: Promise<RawEmpireEntry[]> | null = null;

function loadEntries(): Promise<RawEmpireEntry[]> {
  if (!cachedEntriesPromise) {
    cachedEntriesPromise = fetch(DATA_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Datensatz-Fehler (Status ${res.status})`);
        return res.json();
      })
      .then((data) => (Array.isArray(data) ? (data as RawEmpireEntry[]) : []));
    cachedEntriesPromise.catch(() => {
      cachedEntriesPromise = null;
    });
  }
  return cachedEntriesPromise;
}

/** Einmalig im Hintergrund vorladen, sobald die Karten-Seite mountet. */
export function preloadEmpiresData(): void {
  void loadEntries();
}

export async function getEmpiresYearRange(): Promise<EmpiresYearRange> {
  const entries = await loadEntries();
  let minYear = Infinity;
  let maxYear = -Infinity;
  for (const e of entries) {
    if (typeof e.f === "number" && e.f < minYear) minYear = e.f;
    if (typeof e.t === "number" && e.t > maxYear) maxYear = e.t;
  }
  if (!isFinite(minYear) || !isFinite(maxYear)) {
    throw new Error("Zeitleiste leer.");
  }
  return { minYear, maxYear };
}

export async function getEmpiresForYear(year: number): Promise<EmpireFeatureCollection> {
  const entries = await loadEntries();
  const features: EmpireGeojsonFeature[] = [];
  for (const e of entries) {
    if (
      typeof e.f === "number" &&
      typeof e.t === "number" &&
      e.f <= year &&
      year <= e.t &&
      typeof e.n === "string" &&
      e.n.trim().length > 0
    ) {
      features.push({
        type: "Feature",
        properties: { NAME: e.n, SUBJECTO: "" },
        geometry: e.g,
      });
    }
  }
  return { type: "FeatureCollection", features };
}
