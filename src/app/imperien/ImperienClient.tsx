"use client";

import Link from "next/link";
import type { FormEvent, KeyboardEvent, PointerEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import SiteBackground from "@/components/particles/SiteBackground";
import ImperienIntro from "@/components/history/ImperienIntro";
import CosmicCalendar from "@/components/history/CosmicCalendar";
import REICH_SLUGS from "@/data/reiche/slugs.json";
import Spinner from "@/components/ui/Spinner";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { toolTexts } from "@/lib/history/toolsText";
import { useLanguage, type Lang } from "@/contexts/LanguageContext";
import type { TranslationKey } from "@/lib/translations";
import { translateLanguageValue } from "@/lib/languageNameTranslations";
import { searchEmpires, type EmpireHit } from "@/lib/history/empireSearch";
import { SEARCH_TEXT } from "@/lib/history/empireSearchText";
import {
  getAllEmpireNames,
  getBoundsForNames,
  getEmpiresForYear,
  getEmpiresYearRange,
  preloadEmpiresData,
} from "@/lib/history/empiresClient";
import { lookupWikiInBrowser } from "@/lib/history/wikiClientLookup";
import { wikiLookupName } from "@/data/empireWikiAliases";
import { reichNameL } from "@/lib/history/reicheNames";
import reicheIndex from "@/data/reiche/index.json";
import { SEAS, SEAS_ANCIENT } from "@/data/seas";
import { decodeRing } from "@/lib/history/empiresClient";
import {
  PREHIST_COLORS,
  PREHIST_ERAS,
  fetchPrehistInfo,
  prehistActive,
  prehistBlob,
  prehistName,
} from "@/data/prehistory";

const LEAFLET_CSS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

// Basiskarte: echtes Satellitenbild (Esri World Imagery) — Gebirge, Wüsten,
// Wälder und Küsten wie in echt, ohne heutige Grenzen oder Ortsnamen
// (sonst stünde auf einer Karte von 700 v. Chr. "Uzbekistan",
// Nutzerkorrektur 18.09.2026). Nutzerwunsch 29.09.2026: "mach die Karte
// realistischer" — vorher Esris flache Ozean-Basiskarte. Kostenlos ohne
// API-Key; Esri nutzt {z}/{y}/{x} (nicht {x}/{y}).
const TILE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

// Abspielgeschwindigkeiten fürs Durchspulen der Zeitleiste (ms pro Jahr).
const PLAY_SPEEDS = [1600, 900, 450] as const;
const PLAY_SPEED_LABELS = ["1×", "2×", "4×"] as const;

interface YearRange {
  minYear: number;
  maxYear: number;
}

interface SelectedFeature {
  name: string;
  subjectTo: string;
  isEmpire: boolean;
  // Nutzerwunsch 21.09.2026 ("option ... das man imperien oder herrscher
  // sucht") — true wenn die Auswahl ueber das freie Suchfeld kam statt
  // per Klick auf die Karte. Dann ergibt "Angezeigtes Jahr: <Regler-Jahr>"
  // keinen Sinn (die Suche ist nicht an das aktuell eingestellte Karten-
  // jahr gebunden) und wird in der Info-Box ausgeblendet.
  viaSearch?: boolean;
  // Urzeit-/Steinzeit-Kultur (Nutzerwunsch 05.10.2026), siehe data/prehistory.ts
  prehistoric?: boolean;
  wiki?: string;
  period?: string;
}

interface EmpireInfo {
  found: boolean;
  title?: string;
  extract?: string;
  thumbnail?: string | null;
  pageUrl?: string | null;
  language?: string | null;
  lang?: string;
  source?: "wikipedia" | "editorial";
}

// Grosse Reiche werden per Namens-Schluesselwort erkannt, nicht per fester
// Laenderliste: das Datenset ("historical-basemaps") benennt historische
// Grossreiche im NAME-Feld tatsaechlich meist explizit so ("Roman Empire",
// "Inca Empire", "Mongol Empire", "Ottoman Empire", ...) - moderne Laender
// heissen dagegen einfach nur beim Landesnamen, ohne so ein Wort. Dadurch
// bleiben Fehltreffer bei heutigen Staaten selten, ohne dass jedes Reich
// von Hand aufgelistet werden muss.
const EMPIRE_NAME_KEYWORDS = [
  "empire",
  "caliphate",
  "khanate",
  "sultanate",
  "dynasty",
  "shogunate",
  "horde",
];

function isEmpireName(name: string): boolean {
  const lower = name.toLowerCase();
  // 27.10.2026: Sammelgebiete wie "Holy Roman Empire Minor States" (viele kleine
  // Fürstentümer) sind kein "Großes Imperium", auch wenn "Empire" im Namen steht.
  if (/minor states|\bstatelets?\b|principalities/.test(lower)) return false;
  return EMPIRE_NAME_KEYWORDS.some((kw) => lower.includes(kw));
}

// Nutzerkorrektur 21.09.2026 ("wieso steht da wieder texte auf deutsch zb
// ... n chr") — "v. Chr."/"n. Chr." war fest verdrahtet statt uebersetzt.
// formatYear() braucht jetzt die t()-Funktion der aktuellen UI-Sprache.
function formatYear(year: number | undefined, t: (key: TranslationKey) => string): string {
  if (year === undefined) return "";
  const abs = Math.abs(year);
  const absText = abs >= 10000 ? abs.toLocaleString() : String(abs);
  return year < 0
    ? `${absText} ${t("empiresEraBC")}`
    : `${year} ${t("empiresEraAD")}`;
}

// Jedes Gebiet bekommt eine eigene Farbe statt eines Einheitsbreis.
//
// Nutzerkorrektur 20.09.2026: "mach mehr farben das man viele verschiedene
// imperien kennt" — 18 Farbtöne x 2 Helligkeitsstufen ergeben 36 klar
// unterscheidbare Farben statt vorher nur 24, damit auch bei vielen
// gleichzeitig existierenden Reichen (Cliopatria zeigt oft deutlich mehr
// Gebiete gleichzeitig als der alte Datensatz) genug wirklich verschiedene
// Farben zur Verfügung stehen.
const COLOR_PALETTE = (() => {
  const hues = Array.from({ length: 18 }, (_, i) => i * 20);
  const lightnesses = [40, 56];
  const palette: string[] = [];
  for (const light of lightnesses) {
    for (const hue of hues) {
      palette.push(`hsl(${hue}, 55%, ${light}%)`);
    }
  }
  return palette;
})();

// Nutzerkorrektur 20.09.2026: "viele imperien ändern ständig nach jahren
// die farbe. jede imperium eine feste farbe" — die vorherige Graphenfärbung
// (siehe Git-Historie) hat die Farbe pro Kartenstand NEU berechnet, je
// nachdem, welche Nachbarn gerade zufällig mitgeladen waren. Dieselbe
// Cliopatria-Fläche konnte dadurch beim Weiterklicken durch die Jahre die
// Farbe wechseln, obwohl es dasselbe Reich ist. Jetzt bekommt jeder Name
// EIN EINZIGES Mal eine Farbe zugewiesen (deterministisch aus dem Namen
// berechnet + in diesem Cache gemerkt) und behält sie für die gesamte
// Sitzung, unabhängig vom Jahr oder von Nachbarn.
const stableColorByName = new Map<string, string>();

// Schwache Geräte (Handy/Touch, kleiner Bildschirm, wenig Kerne): leichtere
// Karte — Canvas statt SVG, keine Küsten-Beschneidung, ungeglättete Linien,
// weniger feste Beschriftungen (Nutzerhinweis 15.10.2026: zu laggy).
let liteCache: boolean | null = null;
// Lange Lehns-/Bündnis-Namen ("Allegiance of X to Y") auf den eigentlichen Namen
// kürzen, damit sie keine großen Reiche verdecken (Nutzerhinweis 17.10.2026).
function labelText(name: string): string {
  const m = name.match(/^(?:allegiance|vassalage|suzerainty|protectorate|tribute)\s+of\s+(.+?)\s+to\s+.+$/i);
  return m ? m[1] : name;
}

// Namen der Reiche in der gewählten Sprache (Nutzerwunsch 17.10.2026): die
// Daten haben nur englische Namen. Die Übersetzung holt der Browser bei
// Wikipedia (Sprachlinks des englischen Artikels), merkt sie sich im
// Browser-Speicher und fällt sonst auf den englischen Namen zurück.
const nameCache = new Map<string, string>();
const nameStoreLoaded = new Set<string>();
function loadNameStore(lang: string) {
  if (nameStoreLoaded.has(lang)) return;
  nameStoreLoaded.add(lang);
  try {
    const raw = localStorage.getItem("cn_names_v1_" + lang);
    if (raw) {
      const o = JSON.parse(raw) as Record<string, string>;
      for (const k of Object.keys(o)) nameCache.set(lang + "|" + k, o[k]);
    }
  } catch {
    /* Speicher nicht verfügbar */
  }
}
// Geprüfte Namen aus der eigenen Namensliste (ca. 300 bekannte Reiche).
const DE_NAMES = new Map<string, string>();
for (const r of reicheIndex as unknown as { en: string; de: string | null }[]) {
  if (r.de) DE_NAMES.set(r.en, r.de);
}
function curatedName(base: string, lang: string): string {
  if (lang === "en") return "";
  if (lang === "de") return DE_NAMES.get(base) ?? "";
  const v = reichNameL(base, lang as Lang, null);
  return v !== base ? v : "";
}
// Übersetzter Name oder "" (keine Übersetzung bekannt).
function translatedName(name: string, lang: string): string {
  if (lang === "en") return "";
  const base = labelText(name);
  const c = curatedName(base, lang);
  if (c) return c;
  loadNameStore(lang);
  return nameCache.get(lang + "|" + name) ?? "";
}
function dispName(name: string, lang: string): string {
  return translatedName(name, lang) || labelText(name);
}
async function fetchNames(lang: string, names: string[]): Promise<boolean> {
  if (lang === "en") return false;
  loadNameStore(lang);
  const todo = [...new Set(names)].filter((n) => !nameCache.has(lang + "|" + n) && !curatedName(labelText(n), lang));
  let got = false;
  for (let i = 0; i < todo.length; i += 40) {
    const chunk = todo.slice(i, i + 40);
    const titles = chunk.map((n) => wikiLookupName(labelText(n)));
    try {
      const url =
        "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1&prop=langlinks&lllimit=500&lllang=" +
        encodeURIComponent(lang) +
        "&titles=" +
        encodeURIComponent(titles.join("|"));
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      const q = data?.query ?? {};
      const norm = new Map<string, string>();
      for (const x of q.normalized ?? []) norm.set(x.from, x.to);
      const redir = new Map<string, string>();
      for (const x of q.redirects ?? []) redir.set(x.from, x.to);
      const byTitle = new Map<string, string>();
      for (const pg of Object.values(q.pages ?? {}) as { title?: string; langlinks?: { "*"?: string }[] }[]) {
        const raw = pg.langlinks?.[0]?.["*"] ?? "";
        byTitle.set(pg.title ?? "", raw.replace(/\s*[（(][^)）]*[)）]\s*$/, ""));
      }
      chunk.forEach((n, k) => {
        let t = titles[k];
        if (norm.has(t)) t = norm.get(t) as string;
        if (redir.has(t)) t = redir.get(t) as string;
        const tr = byTitle.get(t) ?? "";
        nameCache.set(lang + "|" + n, tr);
        if (tr) got = true;
      });
    } catch {
      /* offline o. ä.: später erneut versuchen */
    }
  }
  if (got) {
    try {
      const o: Record<string, string> = {};
      for (const [k, v] of nameCache) if (v && k.startsWith(lang + "|")) o[k.slice(lang.length + 1)] = v;
      localStorage.setItem("cn_names_v1_" + lang, JSON.stringify(o));
    } catch {
      /* ignorieren */
    }
  }
  return got;
}


function isLite(): boolean {
  if (liteCache === null) {
    liteCache =
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches ||
        window.innerWidth < 820 ||
        (navigator.hardwareConcurrency ?? 8) <= 4);
  }
  return liteCache;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

// Nutzerwunsch 17.10.2026: "keine grenze mit ähnlichen farben" — grenzen zwei
// Reiche aneinander und haben ähnliche Farben, bekommt das kleinere (spätere)
// eine deutlich andere. Sonst bleibt die feste Namensfarbe.
const colorOverride = new Map<string, string>();
const PALETTE_HL = COLOR_PALETTE.map((c) => {
  const m = /hsl\((\d+), 55%, (\d+)%\)/.exec(c);
  return { h: m ? +m[1] : 0, l: m ? +m[2] : 50 };
});
function colorDist(a: number, b: number): number {
  const A = PALETTE_HL[a];
  const B = PALETTE_HL[b];
  let dh = Math.abs(A.h - B.h);
  if (dh > 180) dh = 360 - dh;
  return dh + Math.abs(A.l - B.l) * 1.2;
}
const bboxCache = new WeakMap<object, number[]>();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function geomBBox(g: any): number[] {
  const c = bboxCache.get(g);
  if (c) return c;
  let x0 = 180, y0 = 90, x1 = -180, y1 = -90;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const walk = (a: any) => {
    if (!Array.isArray(a)) return;
    if (typeof a[0] === "number") {
      if (a[0] < x0) x0 = a[0];
      if (a[0] > x1) x1 = a[0];
      if (a[1] < y0) y0 = a[1];
      if (a[1] > y1) y1 = a[1];
    } else for (const b of a) walk(b);
  };
  walk(g?.coordinates);
  const r = [x0, y0, x1, y1];
  bboxCache.set(g, r);
  return r;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assignColors(feats: any[]) {
  colorOverride.clear();
  const N = COLOR_PALETTE.length;
  const placed: { box: number[]; idx: number; name: string }[] = [];
  const done = new Map<string, number>();
  for (const f of feats) {
    const name: string = f.properties.NAME;
    const box = geomBBox(f.geometry);
    let idx = done.get(name);
    if (idx === undefined) {
      const nb: number[] = [];
      for (const p of placed) {
        if (p.name !== name && p.box[0] <= box[2] + 0.5 && p.box[2] >= box[0] - 0.5 && p.box[1] <= box[3] + 0.5 && p.box[3] >= box[1] - 0.5) nb.push(p.idx);
      }
      const base = hashString(name) % N;
      idx = base;
      if (nb.length && Math.min(...nb.map((n) => colorDist(base, n))) < 60) {
        let bestScore = -1;
        for (let k = 0; k < N; k++) {
          const c = (base + k) % N;
          const s = Math.min(...nb.map((n) => colorDist(c, n)));
          if (s > bestScore + 0.01) { bestScore = s; idx = c; }
          if (s >= 90) break;
        }
      }
      done.set(name, idx);
      if (idx !== base) colorOverride.set(name, COLOR_PALETTE[idx]);
    }
    placed.push({ box, idx, name });
  }
}

function getStableColor(name: string): string {
  const o = colorOverride.get(name);
  if (o) return o;
  const existing = stableColorByName.get(name);
  if (existing) return existing;
  const color = COLOR_PALETTE[hashString(name) % COLOR_PALETTE.length];
  stableColorByName.set(name, color);
  return color;
}

// Chaikin-Corner-Cutting: rundet die Ecken eines Koordinatenrings ab, statt
// die scharfen Originalknicke der Geodaten 1:1 zu zeichnen (Nutzerwunsch
// 18.09.2026: "die grenzen sollen nicht kantig sein"). Ein Durchlauf ersetzt
// jede Kante durch zwei neue Punkte bei 25%/75% ihrer Länge — daraus ergibt
// sich eine sanft geschwungene statt eckige Linie, ohne dass die grobe Form
// verloren geht. Sehr kurze Ringe (Dreiecke etc.) werden übersprungen, sehr
// lange auf eine sinnvolle Punktzahl vorab reduziert, damit das bei
// hunderten Gebieten pro Jahr nicht spürbar langsam wird.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function chaikinSmooth(ring: any[], iterations = 2): any[] {
  if (!Array.isArray(ring) || ring.length < 5) return ring;
  let points = ring;
  // Sehr detailreiche Ringe vorab ausdünnen (jeden n-ten Punkt behalten),
  // sonst wird die Glättung bei komplexen Küstenlinien zu teuer. Schwelle
  // angehoben (Nutzerwunsch 20.09.2026: "mach grafik von karte und
  // teritorium höher . sowohl grenzen") — mehr Originalpunkte bleiben
  // erhalten, Grenzen wirken dadurch feiner statt grob vereinfacht.
  if (points.length > 900) {
    const step = Math.ceil(points.length / 900);
    points = points.filter((_, i) => i % step === 0);
  }
  const isClosed =
    points.length > 2 &&
    points[0][0] === points[points.length - 1][0] &&
    points[0][1] === points[points.length - 1][1];

  for (let iter = 0; iter < iterations; iter++) {
    const next: number[][] = [];
    const count = points.length;
    const limit = isClosed ? count - 1 : count - 1;
    for (let i = 0; i < limit; i++) {
      const [x0, y0] = points[i];
      const [x1, y1] = points[i + 1];
      next.push([x0 + (x1 - x0) * 0.25, y0 + (y1 - y0) * 0.25]);
      next.push([x0 + (x1 - x0) * 0.75, y0 + (y1 - y0) * 0.75]);
    }
    if (!isClosed) {
      next.unshift(points[0]);
      next.push(points[count - 1]);
    } else {
      next.push(next[0]);
    }
    points = next;
  }
  return points;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function smoothGeometry(geometry: any): any {
  if (!geometry?.coordinates) return geometry;
  if (geometry.type === "Polygon") {
    return {
      ...geometry,
      coordinates: geometry.coordinates.map((ring: number[][]) => chaikinSmooth(ring, 1)),
    };
  }
  if (geometry.type === "MultiPolygon") {
    return {
      ...geometry,
      coordinates: geometry.coordinates.map((poly: number[][][]) =>
        poly.map((ring) => chaikinSmooth(ring, 1))
      ),
    };
  }
  return geometry;
}

function ringArea(ring: number[][]): number {
  let area = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    area += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
  }
  return Math.abs(area) / 2;
}

// Echte Flächenberechnung (Shoelace-Formel, Löcher werden abgezogen) statt
// der groben Bounding-Box-Fläche oben. Nutzerkorrektur 20.09.2026: "es ist
// zu dicht" — mit der Bounding-Box-Fläche wurden viele kleine, aber lang
// gestreckte Gebiete (schmale Grafschaften etc.) stark überschätzt und
// bekamen dadurch fälschlich eine dauerhafte Beschriftung. Die echte Fläche
// ist die verlässlichere Grundlage dafür, welche Gebiete "groß" sind.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function polygonArea(geometry: any): number {
  if (!geometry?.coordinates) return 0;
  if (geometry.type === "Polygon") {
    const rings = geometry.coordinates as number[][][];
    if (!rings.length) return 0;
    let area = ringArea(rings[0]);
    for (let i = 1; i < rings.length; i++) area -= ringArea(rings[i]);
    return Math.max(0, area);
  }
  if (geometry.type === "MultiPolygon") {
    let total = 0;
    for (const part of geometry.coordinates as number[][][][]) {
      if (!part.length) continue;
      let area = ringArea(part[0]);
      for (let i = 1; i < part.length; i++) area -= ringArea(part[i]);
      total += Math.max(0, area);
    }
    return total;
  }
  return 0;
}

// Nutzerkorrektur 20.09.2026: "die imperiennamen sind nicht in der mitte
// des terrirorium" — Leaflets Standard-Tooltip-Position (direction:
// "center") setzt einfach die Mitte der BOUNDING BOX an, nicht die
// tatsächliche Mitte der Fläche. Bei länglichen, gebogenen oder
// L-förmigen Reichen (z.B. das Partherreich) landet das dadurch sichtbar
// neben der eigentlichen Farbfläche. Die Funktionen unten berechnen
// stattdessen einen "Pole of Inaccessibility" — den Punkt IM Gebiet, der
// am weitesten von jedem Rand entfernt liegt (dieselbe Technik, die auch
// Kartendienste wie Mapbox für Beschriftungen nutzen) — über eine grobe,
// dann verfeinerte Gitter-Suche. Das ist kein exakter Flächenschwerpunkt,
// reicht aber zuverlässig, um den Namen sichtbar INNERHALB der Fläche zu
// platzieren statt daneben.
function pointInRings(pt: [number, number], rings: number[][][]): boolean {
  let inside = false;
  for (let r = 0; r < rings.length; r++) {
    const ring = rings[r];
    let c = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0];
      const yi = ring[i][1];
      const xj = ring[j][0];
      const yj = ring[j][1];
      const intersects =
        yi > pt[1] !== yj > pt[1] &&
        pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi || 1e-12) + xi;
      if (intersects) c = !c;
    }
    if (r === 0) inside = c;
    else if (c) inside = false;
  }
  return inside;
}

function pointToSegmentDist(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  let t = lenSq === 0 ? 0 : ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const cx = x1 + t * dx;
  const cy = y1 + t * dy;
  return Math.hypot(px - cx, py - cy);
}

function distToRingsBoundary(pt: [number, number], rings: number[][][]): number {
  let min = Infinity;
  for (const ring of rings) {
    for (let i = 0; i < ring.length - 1; i++) {
      const d = pointToSegmentDist(pt[0], pt[1], ring[i][0], ring[i][1], ring[i + 1][0], ring[i + 1][1]);
      if (d < min) min = d;
    }
  }
  return min;
}

function signedDistToRings(pt: [number, number], rings: number[][][]): number {
  const d = distToRingsBoundary(pt, rings);
  return pointInRings(pt, rings) ? d : -d;
}

interface PoleCell {
  x: number;
  y: number;
  h: number;
  d: number;
  max: number;
}

function makePoleCell(x: number, y: number, h: number, rings: number[][][]): PoleCell {
  const d = signedDistToRings([x, y], rings);
  return { x, y, h, d, max: d + h * Math.SQRT2 };
}

// Nutzerkorrektur 20.09.2026 (x2): das feste 13x13-Gitter oben hat bei
// großen, verwinkelten/konkaven Flächen (z.B. ein Reich, das sich nur als
// schmaler Streifen um ein Meer zieht, wie Rom ums Mittelmeer) die
// eigentlich "fetteste" Region (z.B. Gallien) verfehlt, weil die
// Bounding-Box riesig ist, aber nur ein winziger Bruchteil davon
// tatsächlich innerhalb der Fläche liegt — kaum ein Gitterpunkt trifft
// also überhaupt hinein. Ersetzt durch den echten "polylabel"-Algorithmus
// (wie ihn z.B. Mapbox für genau dieses Problem verwendet): eine
// Prioritäts-Suche, die das Gebiet in Quadrate zerlegt und gezielt die
// Quadrate mit dem größten möglichen Gewinn weiter verfeinert — dadurch
// werden auch dünne/konkave/ringförmige Flächen zuverlässig erfasst, statt
// nur ein festes Gitter stumpf abzutasten.
function poleOfInaccessibility(rings: number[][][]): [number, number] {
  return poleOfInaccessibilityWithDist(rings).point;
}

function poleOfInaccessibilityWithDist(rings: number[][][]): { point: [number, number]; dist: number } {
  const outer = rings[0];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of outer) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  const width = maxX - minX;
  const height = maxY - minY;
  if (!(width > 0) || !(height > 0)) {
    let sx = 0;
    let sy = 0;
    for (const [x, y] of outer) {
      sx += x;
      sy += y;
    }
    return { point: [sx / outer.length, sy / outer.length], dist: 0 };
  }

  const cellSize = Math.min(width, height);
  const h0 = cellSize / 2;

  const cellQueue: PoleCell[] = [];
  for (let x = minX; x < maxX; x += cellSize) {
    for (let y = minY; y < maxY; y += cellSize) {
      cellQueue.push(makePoleCell(x + h0, y + h0, h0, rings));
    }
  }

  // Bbox-Mitte als Startkandidat (bei einfachen konvexen Formen oft schon
  // sehr gut, und ein sicherer Fallback falls die Suche nichts Besseres
  // findet).
  let best = makePoleCell(minX + width / 2, minY + height / 2, 0, rings);

  // Präzision grob genug für Beschriftungszwecke (kein exakter
  // Flächenschwerpunkt nötig) — hält die Anzahl der Verfeinerungsschritte
  // klein, damit das bei hunderten Features pro Kartenansicht schnell
  // bleibt.
  const precision = Math.max(width, height) / 300;
  const MAX_ITER = 400;

  let iterations = 0;
  while (cellQueue.length && iterations < MAX_ITER) {
    iterations++;
    let bi = 0;
    for (let i = 1; i < cellQueue.length; i++) {
      if (cellQueue[i].max > cellQueue[bi].max) bi = i;
    }
    const cell = cellQueue[bi];
    cellQueue[bi] = cellQueue[cellQueue.length - 1];
    cellQueue.pop();

    if (cell.d > best.d) best = cell;

    // Dieses Quadrat kann den bisher besten Punkt nicht mehr um mehr als
    // die gewünschte Präzision übertreffen — nicht weiter verfeinern.
    if (cell.max - best.d <= precision) continue;

    const half = cell.h / 2;
    cellQueue.push(makePoleCell(cell.x - half, cell.y - half, half, rings));
    cellQueue.push(makePoleCell(cell.x + half, cell.y - half, half, rings));
    cellQueue.push(makePoleCell(cell.x - half, cell.y + half, half, rings));
    cellQueue.push(makePoleCell(cell.x + half, cell.y + half, half, rings));
  }

  return { point: [best.x, best.y], dist: best.d };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function geometryLabelPoint(geometry: any): [number, number] | null {
  if (!geometry?.coordinates) return null;
  if (geometry.type === "Polygon") {
    return poleOfInaccessibility(geometry.coordinates);
  }
  if (geometry.type === "MultiPolygon") {
    // Nutzerkorrektur 20.09.2026 (x3): weder die Bounding-Box-Fläche noch
    // die echte Ringfläche sind hier der richtige Maßstab. Ein Reich wie
    // Rom besteht oft aus mehreren getrennten Teilflächen — z.B. einem
    // kompakten "Klotz" wie Gallien/Britannien UND einem langen, aber
    // dünnen Küstenstreifen quer durchs ganze Mittelmeer (Spanien-Italien-
    // Balkan-Anatolien-Levante-Ägypten). Dieser Streifen kann in reiner
    // Fläche sogar GRÖSSER sein als der kompakte Klotz, obwohl er überall
    // schmal und damit für eine Beschriftung ungeeignet ist ("die name von
    // den imperien soll immer in der mitte sein"). Der richtige Maßstab
    // ist deshalb, für JEDEN Teil den "Pole of Inaccessibility" (= Radius
    // des größten einbeschriebenen Kreises) zu berechnen und den Teil mit
    // dem GRÖSSTEN Radius zu wählen — das ist genau die visuell "fetteste",
    // am ehesten als Blickfang wahrgenommene Region, unabhängig davon, wie
    // lang ein dünnerer Streifen anderswo ist.
    let bestPoint: [number, number] | null = null;
    let bestDist = -Infinity;
    for (const part of geometry.coordinates as number[][][][]) {
      const { point, dist } = poleOfInaccessibilityWithDist(part);
      if (dist > bestDist) {
        bestDist = dist;
        bestPoint = point;
      }
    }
    return bestPoint;
  }
  return null;
}

/**
 * "Große Imperien" — interaktive Weltkarte mit Jahres-Regler, inspiriert
 * von oldmapsonline.org/en/history/regions (Nutzeranfrage 18.09.2026).
 * Eigene Seite in Centaurian (Nutzerentscheidung: "Neue Seite in
 * Centaurian" statt eigenes Projekt, "Jahres-Regler wie die Vorlage").
 *
 * Update 18.09.2026 (mehrere Runden):
 * - Echte Kartenkacheln (Esri, siehe TILE_URL) statt leerer Fläche.
 * - Jedes Gebiet in eigener Farbe (hashColor), große Reiche in Rot mit
 *   dauerhafter Beschriftung direkt auf der Karte, andere Gebiete zeigen
 *   ihren Namen beim Hover.
 * - Gebiete werden nach Bounding-Box-Fläche sortiert gezeichnet (große
 *   zuerst/unten, kleine zuletzt/oben) — verhindert, dass große Reiche
 *   kleine eingeschlossene Staaten komplett verdecken ("realistischer mit
 *   territoriums und größe"). Reiche werden zusätzlich immer nach vorne
 *   geholt, damit sie trotzdem gut sichtbar bleiben.
 * - Klick auf ein Gebiet lädt eine echte Wikipedia-Zusammenfassung (+Bild)
 *   über /api/empires/info nach ("ganze information davon") statt nur
 *   Name + Zugehörigkeit.
 * - Abspiel-Steuerung unter der Zeitleiste (Play/Pause, Sprung zu
 *   Anfang/Ende, Geschwindigkeit 1×/2×/4×) zum automatischen Durchspulen
 *   der Jahre ("zahnrad ... durch zeit besser vorspulen").
 *
 * Ein Pixel-für-Pixel-Klon der Vorlage ist damit NICHT erreicht (andere
 * Kartendaten, eigene Aufmachung) — aber die gleichen Kernbausteine:
 * Zeitleiste, farbige Gebiete mit Namen, Klick für Details.
 *
 * Datenquelle (seit 20.09.2026): Cliopatria (Seshat Global History
 * Databank, github.com/Seshat-Global-History-Databank/cliopatria, CC BY
 * 4.0) — jedes Reich traegt ein echtes Von-/Bis-Jahr statt weniger fixer
 * Kartenstaende, dadurch aendert sich die Karte fuer wirklich jedes Jahr
 * (Nutzerkorrektur 20.09.2026: "fast jedes jahr aendert sich die
 * territoriums"), auch sehr kurzlebige Reiche werden dadurch exakt sichtbar.
 * Vorher: historical-basemaps (GPL-3.0), nur alle paar Jahrzehnte ein
 * fester Kartenstand. Seit 20.09.2026 kommt der (vorab gefilterte und
 * geometrisch vereinfachte) Datensatz als statische Datei direkt vom
 * Browser, siehe src/lib/history/empiresClient.ts — kein Server-seitiges
 * Entpacken/Parsen des ~165 MB Rohdatensatzes mehr pro Anfrage (das war
 * die Ursache der zuvor minutenlangen Ladezeit).
 *
 * Leaflet wird bewusst per CDN-<script>/<link> geladen statt per npm
 * (im Entwicklungs-Sandbox-Netz war der npm-Registry-Zugriff blockiert;
 * ausserdem spart das ein zusaetzliches Build-Dependency).
 */
// Nutzerhinweis 07.10.2026 ("wieso ist es so laggy" beim Ziehen der
// Zeitleiste): Glätten, Fläche, Namens-Mittelpunkt und Leaflet-Koordinaten
// wurden bisher bei JEDEM Jahr für JEDES Gebiet neu berechnet (die Fläche
// sogar mehrfach pro Gebiet im Sortier-Vergleich). Die Geometrie-Objekte
// aus empiresClient bleiben über alle Jahre dieselben → einmal rechnen,
// danach aus dem Speicher.
/* eslint-disable @typescript-eslint/no-explicit-any */
const smoothCache = new WeakMap<object, any>();
const areaCache = new WeakMap<object, number>();
const labelPointCache = new WeakMap<object, [number, number] | null>();
const latLngCache = new WeakMap<object, any>();
function cachedSmooth(g: any): any {
  let s = smoothCache.get(g);
  if (s === undefined) {
    s = isLite() ? g : smoothGeometry(g);
    smoothCache.set(g, s);
  }
  return s;
}
function cachedArea(g: any): number {
  let a = areaCache.get(g);
  if (a === undefined) {
    a = polygonArea(g);
    areaCache.set(g, a);
  }
  return a;
}
function cachedLabelPoint(g: any): [number, number] | null {
  if (!labelPointCache.has(g)) labelPointCache.set(g, geometryLabelPoint(cachedSmooth(g)));
  return labelPointCache.get(g) ?? null;
}
function cachedLatLngs(L: any, g: any): any {
  let ll = latLngCache.get(g);
  if (ll === undefined) {
    const s = cachedSmooth(g);
    ll = L.GeoJSON.coordsToLatLngs(s.coordinates, s.type === "MultiPolygon" ? 2 : 1);
    latLngCache.set(g, ll);
  }
  return ll;
}
// Rahmen (minLng, minLat, maxLng, maxLat) des Teilstücks, in dem der Name
// steht (kleinster Rahmen, der den Namenspunkt enthält) — danach richtet sich
// die Schriftgröße, nicht nach dem Gesamtgebiet mit entfernten Inseln.
const mainBoxCache = new WeakMap<object, number[] | null>();
function cachedMainBox(g: any, point: number[] | null): number[] | null {
  let box = mainBoxCache.get(g);
  if (box === undefined) {
    const sm = cachedSmooth(g);
    const polys: any[] = sm.type === "MultiPolygon" ? sm.coordinates : [sm.coordinates];
    let best: number[] | null = null;
    let bestArea = Infinity;
    let biggest: number[] | null = null;
    let biggestArea = -1;
    for (const poly of polys) {
      const ring = poly && poly[0];
      if (!ring || !ring.length) continue;
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const pt of ring) {
        if (pt[0] < x0) x0 = pt[0];
        if (pt[0] > x1) x1 = pt[0];
        if (pt[1] < y0) y0 = pt[1];
        if (pt[1] > y1) y1 = pt[1];
      }
      const ar = (x1 - x0) * (y1 - y0);
      if (ar > biggestArea) {
        biggestArea = ar;
        biggest = [x0, y0, x1, y1];
      }
      if (point && point[0] >= x0 && point[0] <= x1 && point[1] >= y0 && point[1] <= y1 && ar < bestArea) {
        bestArea = ar;
        best = [x0, y0, x1, y1];
      }
    }
    box = best || biggest;
    mainBoxCache.set(g, box);
  }
  return box;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// Nutzerhinweis 05.10.2026 ("Grenzen sehen nicht realistisch aus"): Flächen,
// Grenzlinien und Urzeit-Gebiete werden an der echten Küstenlinie
// abgeschnitten (Natural Earth 1:10 Mio., gemeinfrei) — nichts ragt mehr
// ins Meer, die Küsten passen genau zum Satellitenbild. Technik: das Land
// wird als unsichtbarer Pfad in dieselbe SVG-Ebene gelegt und in ein
// <clipPath> verschoben; Leaflet aktualisiert ihn beim Zoomen/Verschieben
// selbst weiter.
let landRingsPromise: Promise<number[][][]> | null = null;
function loadLandRings(): Promise<number[][][]> {
  if (!landRingsPromise) {
    landRingsPromise = fetch("/data/land-10m.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((rings: number[][]) =>
        rings.map((d) => decodeRing(d).map(([lng, lat]) => [lat, lng]))
      )
      .catch(() => {
        landRingsPromise = null;
        return [];
      });
  }
  return landRingsPromise;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyLandClip(L: any, map: any, renderer: any, id: string) {
  loadLandRings().then((rings) => {
    if (!rings.length || !renderer) return;
    const land = L.polygon(
      rings.map((ring) => [ring]),
      { renderer, interactive: false, stroke: false, fill: true, fillOpacity: 0, smoothFactor: 0.6 }
    ).addTo(map);
    const svg: SVGSVGElement | undefined = renderer._container;
    const root: SVGGElement | undefined = renderer._rootGroup;
    const path: SVGPathElement | undefined = land._path;
    if (!svg || !root || !path) return;
    const NS = "http://www.w3.org/2000/svg";
    let defs = svg.querySelector("defs");
    if (!defs) {
      defs = document.createElementNS(NS, "defs");
      svg.insertBefore(defs, svg.firstChild);
    }
    const clip = document.createElementNS(NS, "clipPath");
    clip.setAttribute("id", id);
    clip.setAttribute("clipPathUnits", "userSpaceOnUse");
    path.setAttribute("clip-rule", "evenodd");
    clip.appendChild(path);
    defs.appendChild(clip);
    root.setAttribute("clip-path", `url(#${id})`);
  });
}

export default function ImperienClient() {
  const { t, lang, localePath } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // Gezeichnete Gebiete bleiben über Jahre hinweg bestehen (Schlüssel =
  // Geometrie-Objekt); pro Jahr werden nur verschwundene entfernt und neue
  // hinzugefügt statt alles neu aufzubauen (Nutzerhinweis 07.10.2026: laggy).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const territoryRef = useRef<{ fill: any; border: any; entries: Map<object, any> } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fillRendererRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const borderRendererRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prehistRendererRef = useRef<any>(null);
  // Gesuchte Reiche (Nutzerwunsch 15.10.2026): nur diese bleiben auf der Karte
  // voll sichtbar, alle anderen werden abgeblendet.
  const highlightRef = useRef<Set<string> | null>(null);
  const blinkPendingRef = useRef(false);
  // true, solange Lineal gezogen oder abgespielt wird (Hintergrund gedrosselt)
  const pauseWantedRef = useRef(false);
  const rulerRef = useRef<HTMLDivElement>(null);
  const rulerDragRef = useRef<{ startX: number; startYear: number; moved: boolean } | null>(
    null
  );

  const [leafletReady, setLeafletReady] = useState(false);
  const [yearRange, setYearRange] = useState<YearRange | null>(null);
  // sliderYear ist jetzt das ECHTE angezeigte Jahr — seit dem Wechsel auf
  // den Cliopatria-Datensatz (Nutzerkorrektur 20.09.2026: "kannst du diese
  // jahresraster fixieren ... fast jedes jahr ändert sich die territoriums")
  // trägt jedes Reich ein echtes Von-/Bis-Jahr statt weniger fixer
  // Kartenstände alle paar Jahrzehnte — der Server filtert bei jedem Jahr
  // neu, ein "nächstgelegener Kartenstand" wird nicht mehr gebraucht.
  const [sliderYear, setSliderYear] = useState(1200);
  const [isLoadingBorders, setIsLoadingBorders] = useState(false);
  // Nutzerkorrektur 20.09.2026: "es ladet sekunden bis imperien angezeigt
  // werden nach dem ich die seite geöffnet hab" — die Ladeanzeige (Spinner)
  // war so gebaut, dass sie verschwand, sobald der Jahresbereich (yearRange)
  // geladen war, obwohl DANACH noch der eigentliche Grenzen-Fetch für das
  // erste Jahr läuft (der Cliopatria-Datensatz ist groß, das dauert ein
  // paar Sekunden) — in dieser Lücke sah die Karte leer/leblos aus, ganz
  // ohne Hinweis, dass noch geladen wird. Dieser Zustand merkt sich, ob
  // schon mindestens einmal wirklich Grenzen gezeichnet wurden, damit der
  // Spinner genau bis dahin sichtbar bleibt (und danach beim normalen
  // Jahre-Scrubben nicht mehr störend aufblitzt).
  const [hasRenderedBorders, setHasRenderedBorders] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selected, setSelected] = useState<SelectedFeature | null>(null);
  const [info, setInfo] = useState<EmpireInfo | null>(null);
  const [infoLoading, setInfoLoading] = useState(false);

  // Nutzerwunsch 21.09.2026: "option erstellen das man imperien oder
  // herrscher sucht und infos bekommt" — freies Textfeld oberhalb der
  // Karte. empireNames dient nur als <datalist>-Autovorschlag fuer echte
  // Reichsnamen aus dem Datenset; die Suche selbst funktioniert mit JEDEM
  // Text (auch Herrschernamen wie "Karl der Große"), weil derselbe
  // /api/empires/info-Endpunkt genutzt wird wie beim Kartenklick — der
  // macht ohnehin eine echte Wikipedia-Suche, keine feste Namensliste.
  const [searchQuery, setSearchQuery] = useState("");
  const [empireNames, setEmpireNames] = useState<string[]>([]);
  const [nameTick, setNameTick] = useState(0);
  // Vorschläge in der gewählten Sprache; zurück auf den Datensatz-Namen übersetzt.
  const suggestionMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const n of empireNames) {
      const d = translatedName(n, lang) || n;
      if (!m.has(d)) m.set(d, n);
    }
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empireNames, lang, nameTick]);

  // Eigene Vorschlagsliste (Nutzerhinweis 17.10.2026: auf dem Handy zeigte
  // <datalist> keine Vorschläge): erscheint sofort beim Tippen.
  const [searchFocus, setSearchFocus] = useState(false);
  const searchFormRef = useRef<HTMLFormElement>(null);
  const searchSuggestions = useMemo(() => {
    const nz = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const q = nz(searchQuery.trim());
    if (q.length < 1) return [] as string[];
    const starts: string[] = [];
    const inc: string[] = [];
    for (const d of suggestionMap.keys()) {
      const x = nz(d);
      if (x === q) continue;
      if (/^(personal union|allegiance|alliance)/.test(x)) continue;
      if (x.startsWith(q)) starts.push(d);
      else if (x.split(/[\s\-']+/).some((w) => w.startsWith(q)) || (q.length >= 3 && x.includes(q))) inc.push(d);
    }
    return [...starts, ...inc].slice(0, 8);
  }, [searchQuery, suggestionMap]);

  useEffect(() => {
    let cancelled = false;
    getAllEmpireNames()
      .then((names) => {
        if (!cancelled) setEmpireNames(names);
      })
      .catch(() => {
        /* Autovorschlaege sind nur ein Komfort-Extra, kein Fehler wert */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const st = SEARCH_TEXT[lang] ?? SEARCH_TEXT.en;
  const [hits, setHits] = useState<EmpireHit[] | null>(null);
  const [activeHit, setActiveHit] = useState<string | null>(null);

  // Hervorhebung neu zeichnen (ohne Jahreswechsel).
  function refreshHighlight() {
    const y = lastRenderedYearRef.current;
    const cached = y !== null ? bordersCacheRef.current.get(y) : null;
    if (cached) renderBordersGeojsonRef.current(cached);
  }

  // Karte auf ein gesuchtes Reich setzen: passendes Jahr, Ausschnitt, alle
  // Treffer hervorgehoben.
  async function focusHit(h: EmpireHit, all: EmpireHit[]) {
    setActiveHit(h.name);
    highlightRef.current = new Set(all.map((x) => x.name));
    blinkPendingRef.current = true;
    setIsPlaying(false);
    setPreYear(null);
    const y = clampYear(h.year);
    let bounds: [number, number, number, number] | null = null;
    try {
      bounds = await getBoundsForNames(new Set([h.name]), y);
    } catch {
      bounds = null;
    }
    if (y === Math.round(sliderYear)) refreshHighlight();
    else setSliderYear(y);
    const map = mapRef.current;
    if (map && bounds) {
      map.fitBounds(
        [
          [bounds[0], bounds[1]],
          [bounds[2], bounds[3]],
        ],
        { maxZoom: 5, padding: [20, 20], animate: !isLite() }
      );
    }
  }

  function clearSearch() {
    setHits(null);
    setActiveHit(null);
    highlightRef.current = null;
    refreshHighlight();
  }

  async function handleSearchSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const typed = searchQuery.trim();
    const query = suggestionMap.get(typed) ?? typed;
    if (!query) return;
    let found: EmpireHit[] = [];
    try {
      found = await searchEmpires(query, lang);
    } catch {
      found = [];
    }
    if (found.length === 0) {
      // Nichts im Kartendatensatz (z. B. ein Herrscher): Wikipedia-Info wie bisher
      setHits([]);
      setActiveHit(null);
      highlightRef.current = null;
      refreshHighlight();
      setSelected({ name: query, subjectTo: "", isEmpire: true, viaSearch: true });
      return;
    }
    setHits(found);
    setSelected(null);
    void focusHit(found[0], found);
  }

  const [isPlaying, setIsPlaying] = useState(false);
  const [isDraggingRuler, setIsDraggingRuler] = useState(false);
  const [speedStep, setSpeedStep] = useState(0);
  // Nutzerwunsch 20.09.2026: "option hinzufügen das man auch manuel das
  // jahr eingeben kann" — eigenes Eingabefeld neben der Jahresanzeige statt
  // nur über das Lineal zu ziehen. Eigener lokaler Text-State, damit
  // Tippen nicht durch jede sliderYear-Änderung überschrieben wird; der
  // Effekt unten hält das Feld nur synchron, wenn sich sliderYear von
  // AUSSEN ändert (Lineal, Buttons, Abspielen).
  const [yearInputText, setYearInputText] = useState("1200");
  // Nutzerwunsch 05.10.2026: Urzeit & Steinzeit — eigenes Jahr VOR dem
  // Beginn der Reichs-Daten (3400 v. Chr.). null = normale Zeitleiste.
  const [preYear, setPreYear] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prehistLayerRef = useRef<any>(null);
  const prehistKeyRef = useRef("");

  // Leaflet einmalig per CDN nachladen (CSS + JS)
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).L) {
      setLeafletReady(true);
      return;
    }

    if (!document.querySelector(`link[href="${LEAFLET_CSS_URL}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = LEAFLET_CSS_URL;
      document.head.appendChild(link);
    }

    const existingScript = document.querySelector(
      `script[src="${LEAFLET_JS_URL}"]`
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => setLeafletReady(true));
      return;
    }

    const script = document.createElement("script");
    script.src = LEAFLET_JS_URL;
    script.async = true;
    script.onload = () => setLeafletReady(true);
    script.onerror = () =>
      setErrorMessage("Kartenbibliothek konnte nicht geladen werden.");
    document.body.appendChild(script);
  }, []);

  // Karte einmalig initialisieren, sobald Leaflet bereit ist
  useEffect(() => {
    if (!leafletReady || !mapContainerRef.current || mapRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const L = (window as any).L;
    const map = L.map(mapContainerRef.current, {
      center: [25, 15],
      zoom: 2,
      minZoom: 1,
      maxZoom: 7,
      worldCopyJump: true,
      fadeAnimation: false,
      markerZoomAnimation: false,
    });

    L.tileLayer(TILE_URL, {
      attribution:
        '&copy; <a href="https://www.esri.com" target="_blank" rel="noopener noreferrer">Esri</a>',
      maxZoom: 16,
    }).addTo(map);

    // Nutzerkorrektur 29.09.2026 ("die Territorien sind überlagert"): Flächen
    // und Grenzlinien liegen in zwei eigenen Ebenen. Die Flächen werden darin
    // VOLL deckend gezeichnet (kleinere/verschachtelte Gebiete zuletzt, also
    // oben) und erst die GANZE Ebene wird halbtransparent über das
    // Satellitenbild gelegt. Dadurch mischen sich überlappende Gebiete nicht
    // mehr zu Matschfarben — das obere Gebiet deckt das untere sauber ab,
    // wie in einem gedruckten Atlas. Die Grenzlinien liegen darüber in voller
    // Stärke und fangen keine Klicks ab.
    const fillPane = map.createPane("territoryFill");
    fillPane.style.zIndex = "400";
    fillPane.style.opacity = "0.5";
    const borderPane = map.createPane("territoryBorder");
    borderPane.style.zIndex = "410";
    borderPane.style.pointerEvents = "none";
    // Schwache Geräte: Canvas statt SVG und keine Küsten-Beschneidung
    // (der riesige Clip-Pfad war der Hauptgrund fürs Ruckeln am Handy).
    const lite = isLite();
    const mkRenderer = (pane: string) =>
      lite ? L.canvas({ pane, padding: 0.3 }) : L.svg({ pane, padding: 0.5 });
    fillRendererRef.current = mkRenderer("territoryFill");
    borderRendererRef.current = mkRenderer("territoryBorder");
    const prehistPane = map.createPane("prehistory");
    prehistPane.style.zIndex = "420";
    prehistRendererRef.current = mkRenderer("prehistory");
    if (!lite) {
      applyLandClip(L, map, fillRendererRef.current, "land-clip-fill");
      applyLandClip(L, map, borderRendererRef.current, "land-clip-border");
      applyLandClip(L, map, prehistRendererRef.current, "land-clip-prehist");
    }

    mapRef.current = map;

    // Handy (Canvas): Die oberste Canvas-Ebene fängt alle Klicks ab, die
    // Reichsflächen darunter bekommen sie nie. Deshalb den Klick selbst auf
    // der Karte auswerten und das kleinste getroffene Gebiet öffnen.
    if (lite) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map.on("click", (ev: any) => {
        const terr = territoryRef.current;
        if (!terr) return;
        const lp = map.latLngToLayerPoint(ev.latlng);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let hitE: any = null;
        let hitA = Infinity;
        for (const en of terr.entries.values()) {
          let inside = false;
          try { inside = !!en.fill._containsPoint(lp); } catch { inside = false; }
          if (!inside) continue;
          const ar = cachedArea(en.geom);
          if (ar < hitA) { hitA = ar; hitE = en; }
        }
        if (hitE) hitE.fill.fire("click");
      });
    }

    // Nutzerkorrektur 20.09.2026: "es ist zu dicht ... kleine imperien
    // name nicht angezeigt wird bis du mehr reinzoomst" — beim Reinzoomen
    // dieselben (bereits geladenen) Grenzen einfach neu zeichnen, damit
    // die Größenschwelle für dauerhafte Beschriftungen (siehe
    // renderBordersGeojson) den neuen Zoomstand berücksichtigt. Kein
    // Netzwerk-Request nötig, das Jahr bleibt ja gleich.
    // Beim Bewegen der Karte läuft der 3D-Hintergrund gedrosselt weiter
    // (nicht eingefroren), danach wieder voll.
    const docEl = document.documentElement;
    map.on("movestart zoomstart", () => {
      docEl.dataset.bgpause = "1";
    });
    map.on("moveend zoomend", () => {
      if (!pauseWantedRef.current) delete docEl.dataset.bgpause;
    });
    // Nach dem Verschieben: neu sichtbare Gebiete bekommen ihren Namen.
    let moveT: number | undefined;
    map.on("moveend", () => {
      layoutLabelsRef.current();
      window.clearTimeout(moveT);
      moveT = window.setTimeout(() => {
        const year = lastRenderedYearRef.current;
        if (year === null) return;
        const cached = bordersCacheRef.current.get(year);
        if (cached) renderBordersGeojsonRef.current(cached);
      }, 200);
    });
    map.on("zoomend", () => {
      const year = lastRenderedYearRef.current;
      if (year === null) return;
      const cached = bordersCacheRef.current.get(year);
      if (cached) renderBordersGeojsonRef.current(cached);
    });
  }, [leafletReady]);

  // Verfuegbaren Jahresbereich einmalig laden (Cliopatria deckt 3400 v.
  // Chr. bis 2024 n. Chr. ab, jedes Jahr dazwischen ist gueltig). Seit
  // 20.09.2026 kommt der komplette Datensatz als EINE statische Datei
  // direkt vom Browser (siehe empiresClient.ts) — kein Server-Umweg mehr,
  // der das ~165 MB Cliopatria-Archiv erst live entpacken müsste (das war
  // die eigentliche Ursache für die minutenlange Wartezeit).
  useEffect(() => {
    let cancelled = false;
    preloadEmpiresData();
    getEmpiresYearRange()
      .then((range) => {
        if (!cancelled) setYearRange(range);
      })
      .catch(() => {
        if (!cancelled) setErrorMessage("Zeitleiste konnte nicht geladen werden.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const currentYear = Math.round(sliderYear);

  // Client-seitiger Cache: einmal geladene/gezeichnete Jahre werden nicht
  // erneut angefragt, wenn man beim Ziehen des Lineals darüber zurück-
  // oder wieder vorspult (Nutzerkorrektur 20.09.2026: "wenn ich durch die
  // zeit swipe wird nichts an karte geändert bis ich stoppe ... fixen so
  // das alles flüssig wird").
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bordersCacheRef = useRef<Map<number, any>>(new Map());
  const lastRenderedYearRef = useRef<number | null>(null);
  const lastDrawTimeRef = useRef(0);
  const pendingDrawTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderBordersGeojsonRef = useRef<(geojson: any) => void>(() => {});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wantLabelRef = useRef<any[]>([]);
  const layoutLabelsRef = useRef<() => void>(() => {});

  // Namen passend zur Größe des Reichs: Schrift richtet sich nach dem sichtbaren
  // Teil des größten Gebietsstücks, der Name bleibt im Kartenausschnitt (auch
  // am Rand) und überlappt keinen bereits gesetzten Namen. Passt er nicht,
  // wird er ausgeblendet (Nutzerhinweis 17.10.2026).
  function layoutLabels() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const L = (window as any).L;
    const map = mapRef.current;
    const list = wantLabelRef.current;
    if (!map || !L || !list.length) return;
    const size = map.getSize();
    const W = size.x;
    const H = size.y;
    const minFs = 7;
    const maxFs = 12.5;
    const pad = 3;
    const placed: number[][] = [];
    const shownTexts = new Set<string>();
    const hit = (l: number, t: number, r: number, b: number) =>
      placed.some((p) => l - pad < p[2] && r + pad > p[0] && t - pad < p[3] && b + pad > p[1]);
    const order = list
      .map((_, i) => i)
      .sort((a, b) => Number(labelText(list[a].name) !== list[a].name) - Number(labelText(list[b].name) !== list[b].name) || a - b);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const plan: { e: any; f: number; cx: number; cy: number; tw: number; th: number }[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hide: any[] = [];
    for (const i of order) {
      const e = list[i];
      const bb = e.geom ? cachedMainBox(e.geom, e.point) : null;
      if (!bb || !e.point) { hide.push(e); continue; }
      const p1 = map.latLngToContainerPoint([bb[3], bb[0]]);
      const p2 = map.latLngToContainerPoint([bb[1], bb[2]]);
      const vl = Math.max(p1.x, 0), vr = Math.min(p2.x, W);
      const vt = Math.max(p1.y, 0), vb = Math.min(p2.y, H);
      const vw = vr - vl, vh = vb - vt;
      if (vw <= 0 || vh <= 0) { hide.push(e); continue; }
      const text = dispName(e.name, lang);
      if (shownTexts.has(text)) { hide.push(e); continue; }
      const wide = (c: string) => /[\u2e80-\u9fff\uac00-\ud7af\uff00-\uffef]/.test(c);
      const cjk = wide(text);
      const toks = cjk ? Array.from(text) : text.split(" ");
      const gap = cjk ? 0 : 0.62;
      const emOf = (tk: string) => Array.from(tk).reduce((a, c) => a + (wide(c) ? 1.02 : 0.62), 0);
      // Zeilenumbruch wie im Browser: so wird der Name auch in schmalen
      // Reichen groß genug und bleibt darin (CJK: jedes Zeichen 1 em breit).
      const tryFit = (f: number) => {
        const maxEm = (vw * 0.94) / f;
        const lines: number[] = [];
        let cur = 0;
        for (const tk of toks) {
          const w1 = emOf(tk);
          if (w1 > maxEm) return null;
          if (cur === 0) cur = w1;
          else if (cur + gap + w1 <= maxEm) cur += gap + w1;
          else { lines.push(cur); cur = w1; }
        }
        lines.push(cur);
        if (lines.length > 2) return null;
        const th = lines.length * f * 1.15;
        if (th > vh * 0.85) return null;
        return { f, tw: Math.max(...lines) * f + f * 0.7, th };
      };
      let base: { f: number; tw: number; th: number } | null = null;
      for (let f = maxFs; f >= minFs; f -= 0.5) {
        base = tryFit(f);
        if (base) break;
      }
      if (!base) { hide.push(e); continue; }
      const pt = map.latLngToContainerPoint([e.point[1], e.point[0]]);
      let ok = false;
      for (const k of [1, 0.85, 0.72]) {
        const c = k === 1 ? base : base.f * k >= minFs ? tryFit(base.f * k) : null;
        if (!c) continue;
        const cx = Math.min(Math.max(pt.x, vl + c.tw / 2), Math.max(vr - c.tw / 2, vl + c.tw / 2));
        const cy = Math.min(Math.max(pt.y, vt + c.th / 2), Math.max(vb - c.th / 2, vt + c.th / 2));
        if (!hit(cx - c.tw / 2, cy - c.th / 2, cx + c.tw / 2, cy + c.th / 2)) {
          placed.push([cx - c.tw / 2, cy - c.th / 2, cx + c.tw / 2, cy + c.th / 2]);
          plan.push({ e, f: c.f, cx, cy, tw: c.tw, th: c.th });
          shownTexts.add(text);
          ok = true;
          break;
        }
      }
      if (!ok) hide.push(e);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const elOf = (e: any): HTMLElement | undefined => e.fill.getTooltip?.()?.getElement?.();
    for (const e of hide) { const el = elOf(e); if (el) el.style.display = "none"; }
    for (const q of plan) {
      const el = elOf(q.e);
      if (!el) continue;
      el.style.display = "";
      el.style.fontSize = q.f.toFixed(1) + "px";
      el.style.letterSpacing = lang === "ar" ? "0" : "0.01em";
      el.style.whiteSpace = "normal";
      el.style.textAlign = "center";
      el.style.padding = "0";
      el.style.lineHeight = "1.15";
      el.style.width = Math.ceil(q.tw) + "px";
    }
    for (const q of plan) {
      const ll = map.containerPointToLatLng([q.cx, q.cy]);
      q.e.labelLL = ll;
      q.e.fill.getTooltip?.()?.setLatLng?.(ll);
    }
  }
  layoutLabelsRef.current = layoutLabels;

  // Übersetzte Namen in die Beschriftungen übernehmen (nur wenn sich Text ändert).
  const applyNamesRef = useRef<() => void>(() => {});
  function applyNames() {
    const list = wantLabelRef.current;
    for (const e of list) {
      const txt = dispName(e.name, lang);
      if (e.shownText === txt) continue;
      e.shownText = txt;
      e.fill.getTooltip?.()?.setContent?.(txt);
    }
    layoutLabels();
  }

  applyNamesRef.current = applyNames;

  // Sprachwechsel: Beschriftungen sofort neu setzen (kuratierte/zwischengespeicherte
  // Namen sofort, fehlende danach von Wikipedia nachladen).
  useEffect(() => {
    if (!leafletReady) return;
    applyNamesRef.current();
    const list = wantLabelRef.current;
    let cancelled = false;
    fetchNames(lang, list.map((e) => e.name)).then((changed) => {
      if (changed && !cancelled) {
        applyNamesRef.current();
        setNameTick((x) => x + 1);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, leafletReady]);

  // Zeichnet ein bereits geladenes GeoJSON auf die Karte — ausgelagert aus
  // dem Lade-Effekt, damit sowohl ein frischer Server-Fetch als auch ein
  // Cache-Treffer denselben Zeichen-Code nutzen.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function renderBordersGeojson(geojson: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const L = (window as any).L;
    const map = mapRef.current;
    if (!map || !L) return;
    if (!territoryRef.current) {
      territoryRef.current = {
        fill: L.layerGroup().addTo(map),
        border: L.layerGroup().addTo(map),
        entries: new Map(),
      };
    }
    const terr = territoryRef.current;

    // Jedes benannte Gebiet wird gezeichnet (Nutzerkorrektur 18.09.2026: "es
    // soll alle imperiums da sein"), große zuerst/unten, kleine zuletzt/oben,
    // damit eingeschlossene Gebiete nicht verdeckt werden.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const features: any[] = Array.isArray(geojson.features) ? geojson.features : [];
    const sortedFeatures = features
      .filter((f) => f?.geometry && (f?.properties?.NAME ?? "").trim().length > 0)
      .sort((a, b) => cachedArea(b.geometry) - cachedArea(a.geometry));
    assignColors(sortedFeatures);

    // Nur eine mit dem Zoom wachsende Anzahl der (nach echter Fläche)
    // größten Gebiete bekommt eine feste Beschriftung (Nutzerkorrekturen
    // 20.09.2026: "zu dicht" / "namen sollen früher sichtbar sein").
    // Nutzerwunsch 22.10.2026: Namen nach dem SICHTBAREN Ausschnitt wählen
    // (nicht die weltweit größten N), sonst fehlen Namen im gezoomten Bild.
    // Wer auf dem Bildschirm zu klein ist oder überlappt, fliegt im Layout raus.
    const lite = isLite();
    const hl = highlightRef.current;
    const vp = map.getSize();
    const budget = lite ? 80 : 150;
    const permanentLabelNames = new Set<string>();
    for (const f of sortedFeatures) {
      if (permanentLabelNames.size >= budget) break;
      const nm = f.properties?.NAME as string;
      if (permanentLabelNames.has(nm)) continue;
      const bb = cachedMainBox(f.geometry, cachedLabelPoint(f.geometry));
      if (!bb) continue;
      const p1 = map.latLngToContainerPoint([bb[3], bb[0]]);
      const p2 = map.latLngToContainerPoint([bb[1], bb[2]]);
      const vw = Math.min(p2.x, vp.x) - Math.max(p1.x, 0);
      const vh = Math.min(p2.y, vp.y) - Math.max(p1.y, 0);
      if (vw >= 28 && vh >= 11) permanentLabelNames.add(nm);
    }
    // Beschriftungsgröße wie im Atlas: die größten Reiche etwas größer.
    const bigLabelNames = new Set(sortedFeatures.slice(0, 6).map((f) => f.properties?.NAME));

    // Feste, namensbasierte Farben (Nutzerkorrektur 20.09.2026).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function borderStyle(name: string, isMajor: boolean): any {
      return {
        color: getStableColor(name),
        weight: isMajor ? 1.4 : 0.7,
        opacity: isMajor ? 0.95 : 0.75,
        fill: false,
        lineJoin: "round",
        lineCap: "round",
      };
    }
    // Mit Reichs-Suche: nicht gesuchte Gebiete werden abgeblendet.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function bs(name: string, isMajor: boolean): any {
      const h = highlightRef.current;
      const st = borderStyle(name, isMajor);
      return h && !h.has(name) ? { ...st, opacity: 0.55 } : st;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function setLabel(e: any, permanent: boolean, className: string) {
      e.fill.unbindTooltip();
      e.shownText = dispName(e.name, lang);
      e.fill.bindTooltip(e.shownText, { permanent, direction: "center", className, opacity: 0.95 });
      if (e.point) e.fill.getTooltip?.()?.setLatLng?.(L.latLng(e.point[1], e.point[0]));
      e.labeled = permanent;
      e.labelClass = className;
    }

    const seen = new Set<object>();
    const labeledNames = new Set<string>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wantLabel: any[] = [];
    let added = false;

    for (const feature of sortedFeatures) {
      const key = feature.geometry as object;
      const name: string = feature.properties.NAME;
      seen.add(key);
      const isMajor = hl ? hl.has(name) || permanentLabelNames.has(name) : permanentLabelNames.has(name);
      // Sammel-Umriss und Kern tragen denselben Namen — nur das GRÖSSTE
      // Teil bekommt die feste Beschriftung, sonst stünde der Name doppelt.
      const wants = isMajor && !labeledNames.has(name);
      if (wants) labeledNames.add(name);
      const labelClass = (hl ? hl.has(name) : bigLabelNames.has(name)) ? "empire-label empire-label-big" : "empire-label";

      let e = terr.entries.get(key);
      if (e && e.name !== name) {
        terr.fill.removeLayer(e.fill);
        terr.border.removeLayer(e.border);
        terr.entries.delete(key);
        e = undefined;
      }
      if (!e) {
        const latlngs = cachedLatLngs(L, feature.geometry);
        const c = getStableColor(name);
        // Volle Deckkraft INNERHALB der Flächen-Ebene; die Ebene selbst ist
        // halbtransparent. Kontur in Flächenfarbe (4 px) schließt Lücken zur
        // Küste — das Meer schneidet der Küsten-Clip ab (05.10.2026).
        const fill = L.polygon(latlngs, {
          renderer: fillRendererRef.current ?? undefined,
          pane: "territoryFill",
          smoothFactor: isLite() ? 1.8 : 1.1,
          stroke: true,
          color: c,
          weight: feature.properties?.UMB ? 1 : 3,
          opacity: hl && !hl.has(name) ? 0.5 : 1,
          fillColor: c,
          fillOpacity: feature.properties?.UMB ? 0 : hl && !hl.has(name) ? 0.5 : 1,
        });
        const border = L.polygon(latlngs, {
          renderer: borderRendererRef.current ?? undefined,
          pane: "territoryBorder",
          interactive: false,
          smoothFactor: isLite() ? 1.8 : 1.1,
          ...bs(name, isMajor),
          ...(feature.properties?.UMB ? { dashArray: "5 4", weight: 1.1, opacity: 0.7 } : {}),
        });
        const point = cachedLabelPoint(feature.geometry);
        const subjectTo: string = feature.properties?.SUBJECTO ?? "";
        e = { fill, border, name, geom: feature.geometry, labelLL: null, isMajor, labeled: false, labelClass: "", point, color: c, styleKey: `${!hl || hl.has(name)}|${isMajor}` };
        const entry = e;
        // Name in die echte Mitte der Fläche ("Pole of Inaccessibility") —
        // bei JEDEM Öffnen gesetzt, Leaflet springt sonst zum ersten Teilstück.
        if (point) {
          const labelLatLng = L.latLng(point[1], point[0]);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          fill.on("tooltipopen", (ev: any) => ev.tooltip?.setLatLng?.(entry.labelLL || labelLatLng));
        }
        fill.on({
          mouseover: () => entry.border.setStyle({ weight: 2.6, opacity: 1, color: "#ffffff" }),
          mouseout: () => entry.border.setStyle(bs(entry.name, entry.isMajor)),
          click: () => setSelected({ name, subjectTo, isEmpire: isEmpireName(name) }),
        });
        setLabel(e, wants, labelClass);
        terr.fill.addLayer(fill);
        terr.border.addLayer(border);
        terr.entries.set(key, e);
        added = true;
      } else {
        e.isMajor = isMajor;
        const nc = getStableColor(name);
        if (e.color !== nc) {
          e.color = nc;
          e.fill.setStyle({ color: nc, fillColor: nc });
          e.border.setStyle(bs(name, isMajor));
        }
        const sk = `${!hl || hl.has(name)}|${isMajor}`;
        if (e.styleKey !== sk) {
          e.styleKey = sk;
          const on = !hl || hl.has(name);
          e.fill.setStyle({ fillOpacity: feature.properties?.UMB ? 0 : on ? 1 : 0.5, opacity: on ? 1 : 0.5 });
          e.border.setStyle(bs(name, isMajor));
        }
        if (e.labeled !== wants || (wants && e.labelClass !== labelClass)) {
          setLabel(e, wants, labelClass);
        }
      }
      if (wants) wantLabel.push(e);
    }

    // Gebiete, die es im neuen Jahr nicht mehr gibt, entfernen.
    for (const [key, e] of terr.entries) {
      if (seen.has(key)) continue;
      terr.fill.removeLayer(e.fill);
      terr.border.removeLayer(e.border);
      terr.entries.delete(key);
    }

    // Neue Gebiete hängen zunächst ganz oben — Zeichenreihenfolge (groß
    // unten, klein oben) nur dann wiederherstellen, wenn etwas dazukam.
    if (added) {
      for (const feature of sortedFeatures) {
        const e = terr.entries.get(feature.geometry);
        if (!e) continue;
        e.fill.bringToFront();
        e.border.bringToFront();
      }
    }

    wantLabelRef.current = wantLabel;
    applyNames();
    fetchNames(lang, wantLabel.map((e) => e.name)).then((changed) => {
      if (changed) {
        applyNamesRef.current();
        setNameTick((x) => x + 1);
      }
    });

    setErrorMessage(null);
    setHasRenderedBorders(true);

    // Nutzerwunsch 15.10.2026: gesuchte Reiche blinken zweimal leicht, alle
    // anderen bleiben sichtbar.
    if (blinkPendingRef.current && hl) {
      blinkPendingRef.current = false;
      const targets = [...terr.entries.values()].filter((x) => hl.has(x.name));
      const steps = [0.2, 1, 0.2, 1];
      steps.forEach((o, i) => {
        window.setTimeout(() => {
          for (const x of targets) {
            x.fill.setStyle({ fillOpacity: o, opacity: o });
            x.border.setStyle({ weight: o < 1 ? 3 : x.isMajor ? 1.4 : 0.7, color: o < 1 ? "#ffffff" : getStableColor(x.name) });
          }
        }, 250 + i * 330);
      });
    }
  }
  renderBordersGeojsonRef.current = renderBordersGeojson;

  // Grenzen fuer das aktuell gewaehlte Jahr laden und auf der Karte
  // zeichnen. Vorher ein reiner Debounce ("warte bis 150ms Ruhe ist") —
  // bei durchgehendem Ziehen des Lineals feuern Pointer-Events aber
  // schneller als alle 150ms nacheinander, der Timer wurde also bei jeder
  // Bewegung neu gestartet und NIE wirklich ausgeführt, bis losgelassen
  // wurde (Nutzerkorrektur 20.09.2026: "wenn ich durch die zeit swipe wird
  // nichts an karte geändert bis ich stoppe"). Jetzt ein echtes Throttle:
  // ist seit dem letzten tatsächlichen Zeichnen schon genug Zeit vergangen,
  // wird SOFORT neu gezeichnet (kein Warten) — dadurch aktualisiert sich
  // die Karte laufend WÄHREND man zieht, etwa alle 180ms, plus ein
  // abschließendes Zeichnen für das exakte Jahr beim Loslassen. Bereits
  // gesehene Jahre kommen aus dem Cache und werden ohne Netzwerk-Anfrage
  // sofort gezeichnet.
  useEffect(() => {
    if (!leafletReady || !mapRef.current || !yearRange) return;
    if (preYear !== null) {
      // Urzeit: keine Reichsgrenzen (gab es noch nicht)
      if (territoryRef.current) {
        territoryRef.current.fill.clearLayers();
        territoryRef.current.border.clearLayers();
        territoryRef.current.entries.clear();
      }
      lastRenderedYearRef.current = null;
      return;
    }
    if (lastRenderedYearRef.current === currentYear) return;

    let cancelled = false;
    const THROTTLE_MS = 180;

    if (pendingDrawTimeoutRef.current) {
      clearTimeout(pendingDrawTimeoutRef.current);
      pendingDrawTimeoutRef.current = null;
    }

    function draw(year: number) {
      lastRenderedYearRef.current = year;
      lastDrawTimeRef.current = Date.now();
      const cached = bordersCacheRef.current.get(year);
      if (cached) {
        renderBordersGeojsonRef.current(cached);
        return;
      }
      setIsLoadingBorders(true);
      getEmpiresForYear(year)
        .then((geojson) => {
          if (cancelled) return;
          bordersCacheRef.current.set(year, geojson);
          renderBordersGeojsonRef.current(geojson);
        })
        .catch(() => {
          if (!cancelled) {
            setErrorMessage("Grenzen für dieses Jahr konnten nicht geladen werden.");
          }
        })
        .finally(() => {
          if (!cancelled) setIsLoadingBorders(false);
        });
    }

    // Bereits gecachte Jahre sofort zeichnen, ohne jede Wartezeit — macht
    // das Zurück-/Vor-Scrubben über bereits besuchte Jahre spürbar
    // flüssiger.
    if (bordersCacheRef.current.has(currentYear)) {
      draw(currentYear);
      return () => {
        cancelled = true;
      };
    }

    const elapsed = Date.now() - lastDrawTimeRef.current;
    if (elapsed >= THROTTLE_MS) {
      draw(currentYear);
    } else {
      pendingDrawTimeoutRef.current = setTimeout(() => draw(currentYear), THROTTLE_MS - elapsed);
    }

    return () => {
      cancelled = true;
      if (pendingDrawTimeoutRef.current) {
        clearTimeout(pendingDrawTimeoutRef.current);
        pendingDrawTimeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leafletReady, yearRange, currentYear, preYear]);

  // Während man das Lineal zieht, pausiert der animierte 3D-Hintergrund —
  // Handy-Grafikchip und Prozessor bleiben frei für die Karte
  // (Nutzerhinweis 07.10.2026: "wieso ist es so laggy").
  useEffect(() => {
    const el = document.documentElement;
    pauseWantedRef.current = isDraggingRuler || isPlaying;
    if (pauseWantedRef.current) el.dataset.bgpause = "1";
    else delete el.dataset.bgpause;
    return () => {
      delete el.dataset.bgpause;
    };
  }, [isDraggingRuler, isPlaying]);

  // Teilen-Links (Nutzerwunsch 07.10.2026: mehr Besucher): /imperien?jahr=1200
  // öffnet die Karte direkt in diesem Jahr. Die Adresszeile folgt dem
  // gewählten Jahr, damit auch ein einfach kopierter Link das Jahr enthält.
  const urlYearRef = useRef<number | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("jahr");
    const y = raw === null || raw.trim() === "" ? NaN : Math.round(Number(raw));
    if (Number.isFinite(y)) {
      const clamped = Math.min(2024, Math.max(-3400, y));
      urlYearRef.current = clamped;
      setSliderYear(clamped);
    } else {
      urlYearRef.current = 1200;
    }
  }, []);
  useEffect(() => {
    if (urlYearRef.current === null || urlYearRef.current === currentYear) return;
    const id = setTimeout(() => {
      urlYearRef.current = currentYear;
      const url = new URL(window.location.href);
      url.searchParams.set("jahr", String(currentYear));
      window.history.replaceState(window.history.state, "", url.toString());
    }, 500);
    return () => clearTimeout(id);
  }, [currentYear]);

  async function handleShare() {
    const url = `${window.location.origin}${window.location.pathname}?jahr=${currentYear}`;
    const title = `${t("empiresShareTitle")} ${formatYear(currentYear, t)} | CENTAURIAN`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
      } catch {
        /* abgebrochen */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      window.prompt(t("empiresShare"), url);
    }
  }

  // Zeitleiste bewegt (Lineal, Abspielen, Eingabe) → Urzeit-Ansicht verlassen
  useEffect(() => {
    setPreYear(null);
  }, [sliderYear]);

  // Urzeit-/Steinzeit-Kulturen als weiche, gestrichelte Flächen. In der
  // Urzeit-Ansicht für das gewählte Urzeit-Jahr, sonst zusätzlich zu den
  // Reichen alle Kulturen, die im eingestellten Jahr noch bestehen (z. B.
  // Jōmon bis 300 v. Chr., Stonehenge bis 1500 v. Chr.).
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const L = (window as any).L;
    if (!leafletReady || !mapRef.current || !L) return;
    const map = mapRef.current;
    const year = preYear ?? currentYear;
    const list = prehistActive(year);
    // Beim Ziehen der Zeitleiste nur neu aufbauen, wenn sich die Menge der
    // Kulturen wirklich ändert (Nutzerhinweis 07.10.2026: laggy).
    const key = `${preYear !== null}|${lang}|${list.map((c) => c.id).join(",")}`;
    if (key === prehistKeyRef.current && (prehistLayerRef.current || !list.length)) return;
    prehistKeyRef.current = key;
    if (prehistLayerRef.current) {
      map.removeLayer(prehistLayerRef.current);
      prehistLayerRef.current = null;
    }
    if (!list.length) return;
    const group = L.layerGroup();
    for (const c of list) {
      const col = PREHIST_COLORS[c.kind];
      const name = prehistName(c.n, lang);
      const poly = L.polygon(prehistBlob(c), {
        pane: "prehistory",
        renderer: prehistRendererRef.current ?? undefined,
        color: col,
        weight: 1.4,
        dashArray: "5 5",
        fillColor: col,
        fillOpacity: preYear !== null ? 0.28 : 0.18,
        opacity: 0.9,
      });
      poly.bindTooltip(name, {
        // kleine Orte nur beim Antippen/Hover beschriften, sonst überlappen Namen
        permanent: c.rx >= 3 || c.id === "gobekli" || c.id === "catalhoyuk" || c.id === "stonehenge",
        direction: "center",
        className: "empire-label prehist-label",
        opacity: 0.95,
      });
      poly.on("click", () => {
        setSelected({
          name,
          subjectTo: "",
          isEmpire: false,
          prehistoric: true,
          wiki: c.wiki,
          period: `${formatYear(c.from, t)} – ${formatYear(c.to, t)}`,
        });
      });
      poly.addTo(group);
    }
    group.addTo(map);
    prehistLayerRef.current = group;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leafletReady, preYear, currentYear, lang]);

  // Bis 500 n. Chr. tragen die Meere ihre antiken Namen.
  const antikSeas = (preYear ?? currentYear) <= 500;
  // Meere/Ozeane: Name anklicken -> Herkunft des Namens (Nutzerwunsch 23.10.2026).
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const L = (window as any).L;
    if (!leafletReady || !mapRef.current || !L) return;
    const map = mapRef.current;
    if (!map.getPane("seas")) {
      const sp = map.createPane("seas");
      sp.style.zIndex = "450";
    }
    const group = L.layerGroup().addTo(map);
    const esc = (x: string) => x.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
    const minZ = [1, 3, 4];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const markers = SEAS.map((s: any) => {
      const anc = SEAS_ANCIENT[s.id];
      const modern = lang === "de" ? s.de : s.en;
      const name = antikSeas && anc ? anc.n : modern;
      const ancLine = anc
        ? `<br><br><b>${lang === "de" ? "In der Antike" : "In ancient times"}:</b> ${esc(anc.n)} – ${esc(lang === "de" ? anc.d : anc.e)}`
        : "";
      const modLine = antikSeas && anc ? `<br><i>${lang === "de" ? "Heute" : "Today"}: ${esc(modern)}</i>` : "";
      const text = (lang === "de" ? s.tde : s.ten);
      const m = L.marker([s.lat, s.lng], {
        pane: "seas",
        icon: L.divIcon({ className: `sea-label sea-r${s.rank}`, html: `<span>${esc(name)}</span>`, iconSize: [0, 0] }),
      });
      m.bindPopup(`<b>${esc(name)}</b>${modLine}<br>${esc(text)}${ancLine}`, { maxWidth: 280 });
      return { m, rank: s.rank as number };
    });
    const sync = () => {
      const z = map.getZoom();
      for (const { m, rank } of markers) {
        const on = z >= minZ[rank];
        if (on && !group.hasLayer(m)) group.addLayer(m);
        else if (!on && group.hasLayer(m)) group.removeLayer(m);
      }
    };
    sync();
    map.on("zoomend", sync);
    return () => {
      map.off("zoomend", sync);
      map.removeLayer(group);
    };
  }, [leafletReady, lang, antikSeas]);

  // Ausführliche Info (Wikipedia) nachladen, sobald ein Gebiet angeklickt wurde.
  useEffect(() => {
    if (!selected) {
      setInfo(null);
      return;
    }
    let cancelled = false;
    setInfoLoading(true);
    setInfo(null);
    if (selected.prehistoric && selected.wiki) {
      fetchPrehistInfo(selected.wiki, lang)
        .then((data) => {
          if (!cancelled) setInfo(data);
        })
        .finally(() => {
          if (!cancelled) setInfoLoading(false);
        });
      return () => {
        cancelled = true;
      };
    }
    fetch(
      `/api/empires/info?name=${encodeURIComponent(selected.name)}&lang=${encodeURIComponent(lang)}`
    )
      .then((res) => res.json())
      // Nutzerkorrektur 29.09.2026: Findet der Server nichts (oft wegen
      // Wikipedia-Drosselung der Vercel-IPs), fragt der Browser selbst nach.
      .then(async (data) => {
        if (data?.found) return data;
        return (await lookupWikiInBrowser(selected.name, lang)) ?? data;
      })
      .catch(() => lookupWikiInBrowser(selected.name, lang))
      .then((data) => {
        if (!cancelled) setInfo(data ?? { found: false });
      })
      .catch(() => {
        if (!cancelled) setInfo({ found: false });
      })
      .finally(() => {
        if (!cancelled) setInfoLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selected, lang]);

  // Automatisches Durchspulen der Zeitleiste (Play-Button unten) — springt
  // jetzt echt Kalenderjahr für Kalenderjahr (seit dem Wechsel auf
  // Cliopatria hat jedes Jahr eigene Daten, ein Sprung von Kartenstand zu
  // Kartenstand ist nicht mehr nötig).
  useEffect(() => {
    if (!isPlaying || !yearRange) return;
    const id = setInterval(() => {
      setSliderYear((prevYear) => {
        if (prevYear >= yearRange.maxYear) {
          setIsPlaying(false);
          return prevYear;
        }
        return prevYear + 1;
      });
    }, PLAY_SPEEDS[speedStep]);
    return () => clearInterval(id);
  }, [isPlaying, speedStep, yearRange]);

  // Regler läuft über den vollen echten Kalenderjahr-Bereich der
  // Cliopatria-Daten (3400 v. Chr. bis 2024 n. Chr.) — jedes einzelne
  // Jahr ist ansteuerbar UND zeigt echte, für dieses Jahr gültige Grenzen
  // (Nutzerkorrektur 20.09.2026: "fast jedes jahr ändert sich die
  // territoriums").
  const minYear = yearRange?.minYear ?? 0;
  const maxYear = yearRange?.maxYear ?? 0;

  function clampYear(y: number): number {
    return Math.min(maxYear, Math.max(minYear, y));
  }

  // Feld für die manuelle Jahreseingabe synchron halten, wenn sich das Jahr
  // durch etwas ANDERES als Tippen ändert (Lineal ziehen, Buttons,
  // Abspielen).
  useEffect(() => {
    setYearInputText(String(Math.round(sliderYear)));
  }, [sliderYear]);

  function submitYearInput() {
    const parsed = Math.round(Number(yearInputText));
    if (Number.isFinite(parsed)) {
      setIsPlaying(false);
      setSliderYear(clampYear(parsed));
    } else {
      // Ungültige Eingabe (z.B. leer oder Text) — auf das aktuelle Jahr
      // zurücksetzen statt eines Fehlerzustands.
      setYearInputText(String(Math.round(sliderYear)));
    }
  }

  // Das Lineal aus dem Vorbild-Video: die Mitte steht fest, das Lineal
  // scrollt beim Ziehen darunter durch. PX_PER_YEAR bestimmt den "Zoom"
  // (wie viele Bildschirmpixel einem Kalenderjahr entsprechen).
  const PX_PER_YEAR = 6;
  const RULER_HALF_YEARS = 160;

  const rulerCenterYear = Math.round(sliderYear);
  const rulerTicks: {
    year: number;
    leftPx: number;
    isMajor: boolean;
  }[] = [];
  for (let offset = -RULER_HALF_YEARS; offset <= RULER_HALF_YEARS; offset++) {
    const year = rulerCenterYear + offset;
    if (year < minYear || year > maxYear) continue;
    rulerTicks.push({
      year,
      leftPx: offset * PX_PER_YEAR,
      isMajor: year % 10 === 0,
    });
  }

  function handleRulerPointerDown(e: PointerEvent<HTMLDivElement>) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    rulerDragRef.current = { startX: e.clientX, startYear: sliderYear, moved: false };
    setIsPlaying(false);
    setIsDraggingRuler(true);
  }

  function handleRulerPointerMove(e: PointerEvent<HTMLDivElement>) {
    const drag = rulerDragRef.current;
    if (!drag) return;
    const deltaX = e.clientX - drag.startX;
    if (Math.abs(deltaX) > 2) drag.moved = true;
    const deltaYears = Math.round(deltaX / PX_PER_YEAR);
    setSliderYear(clampYear(drag.startYear - deltaYears));
  }

  function handleRulerPointerUp(e: PointerEvent<HTMLDivElement>) {
    const drag = rulerDragRef.current;
    rulerDragRef.current = null;
    setIsDraggingRuler(false);
    // Kein echtes Ziehen, nur ein Tipp/Klick auf eine Stelle des Lineals:
    // direkt zu dem dort angezeigten Jahr springen (wie ein Klick auf das
    // Vorbild-Lineal).
    if (drag && !drag.moved && rulerRef.current) {
      const rect = rulerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const clickedYear = Math.round(
        drag.startYear + (e.clientX - centerX) / PX_PER_YEAR
      );
      setSliderYear(clampYear(clickedYear));
    }
  }

  function handleRulerKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowLeft") {
      setIsPlaying(false);
      setSliderYear((y) => clampYear(y - 1));
    } else if (e.key === "ArrowRight") {
      setIsPlaying(false);
      setSliderYear((y) => clampYear(y + 1));
    } else if (e.key === "PageDown") {
      setIsPlaying(false);
      setSliderYear((y) => clampYear(y - 10));
    } else if (e.key === "PageUp") {
      setIsPlaying(false);
      setSliderYear((y) => clampYear(y + 10));
    } else if (e.key === "Home") {
      setIsPlaying(false);
      setSliderYear(minYear);
    } else if (e.key === "End") {
      setIsPlaying(false);
      setSliderYear(maxYear);
    } else {
      return;
    }
    e.preventDefault();
  }

  return (
    <main className="relative min-h-screen">
      <SiteBackground lite />
      <ImperienIntro />

      {/* Leaflet-Standardsteuerelemente (Zoom +/-) an den dunklen Seitenstil
          angepasst - sonst weiss/hell und ein Stilbruch. Beschriftungen
          (empire-label) bekommen einen Textschatten statt eines weißen
          Sprechblasen-Hintergrunds, damit sie direkt über der Karte lesbar
          sind, wie bei einem gedruckten historischen Atlas. */}
      <style>{`
        .leaflet-container { background: #030303; }
        /* Satellitenbild leicht abgedunkelt, passend zum dunklen Seitenstil;
           Wasser, Wüsten und Gebirge bleiben klar erkennbar. Die
           Reich-Flächen liegen in eigenen Ebenen und werden davon nicht
           mit verdunkelt. */
        .leaflet-tile-pane { filter: brightness(0.62) saturate(0.9) contrast(1.08); }
        .leaflet-control-zoom a {
          background: #111111 !important;
          color: #f2f2f0 !important;
          border-color: #232320 !important;
        }
        .leaflet-control-zoom a:hover { background: #1a1a18 !important; }
        .leaflet-control-attribution {
          background: rgba(3, 3, 3, 0.7) !important;
          color: rgba(242, 242, 240, 0.55) !important;
        }
        .leaflet-control-attribution a { color: rgba(242, 242, 240, 0.75) !important; }

        .leaflet-tooltip.empire-label {
          background: transparent;
          border: none;
          box-shadow: none;
          pointer-events: none;
          font-family: var(--font-mono, monospace);
          color: #f2f2f0;
          font-weight: 700;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          text-shadow: 0 1px 2px #000, 0 0 6px #000, 0 0 12px #000;
        }
        .sea-label { pointer-events: auto; cursor: pointer; }
        .sea-label span {
          position: absolute; left: 0; top: 0; display: inline-block; transform: translate(-50%, -50%); white-space: nowrap;
          font-family: var(--font-mono, monospace); font-style: italic;
          color: #cfe8ff; letter-spacing: 0.08em;
          text-shadow: 0 1px 2px #000, 0 0 6px #000, 0 0 10px #000;
        }
        .sea-r0 span { font-size: 8px; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.85; }
        .sea-r1 span { font-size: 7px; letter-spacing: 0.05em; opacity: 0.85; }
        .sea-r2 span { font-size: 6.5px; letter-spacing: 0.02em; opacity: 0.85; }
        .leaflet-tooltip.prehist-label {
          font-size: 10px;
          font-style: italic;
          text-transform: none;
          letter-spacing: 0.02em;
          color: #fde7c4;
        }
        .leaflet-tooltip.empire-label-sm {
          font-size: 9px;
          letter-spacing: 0.03em;
        }
        .leaflet-tooltip.empire-label-big {
          font-size: 13px;
          letter-spacing: 0.14em;
        }
        .leaflet-tooltip-top:before,
        .leaflet-tooltip-bottom:before,
        .leaflet-tooltip-left:before,
        .leaflet-tooltip-right:before {
          display: none;
        }

        /* Zeitleiste als "Zähne"/Kamm statt einer schmucklosen Linie
           (Nutzerwunsch 18.09.2026) — das eigentliche <input type=range>
           bleibt für die Bedienung erhalten, ist aber unsichtbar und liegt
           über den sichtbaren Zahn-Balken. */
        .timeline-native-range {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
        }
        .timeline-native-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 1px;
          height: 1px;
          background: transparent;
        }
        .timeline-native-range::-moz-range-thumb {
          width: 1px;
          height: 1px;
          background: transparent;
          border: none;
        }
        .timeline-native-range::-moz-range-track {
          background: transparent;
        }
      `}</style>

      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-12 pt-6 sm:px-8 sm:pt-8">
        <div className="mb-4 flex items-center justify-between">
          <Link
            href={localePath("/")}
            className="label-mono inline-flex w-fit items-center gap-2 text-xs uppercase text-muted transition-colors hover:text-accent"
          >
            ← {t("back")}
          </Link>
          <LanguageSwitcher />
        </div>

        <header className="mb-4 border-b border-border pb-4">
          <p className="label-mono text-xs uppercase text-muted">{t("navEmpiresLabel")}</p>
          <h1 className="font-display mt-2 text-2xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
            {t("empiresTitle")}
          </h1>
          <p className="label-mono mt-2 text-[11px] uppercase tracking-wide text-accent sm:text-xs">
            {t("empiresSeoTagline")}
          </p>
          <p className="mt-2 max-w-2xl text-[11px] leading-relaxed text-muted sm:text-xs">
            {t("empiresIntroPrefix")}{" "}
            <a
              href="https://github.com/Seshat-Global-History-Databank/cliopatria"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-dotted hover:text-accent"
            >
              Cliopatria
            </a>{" "}
            (Seshat Global History Databank, CC BY 4.0),{" "}
            <a
              href="https://github.com/aourednik/historical-basemaps"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-dotted hover:text-accent"
            >
              Historical Basemaps
            </a>{" "}
            (A. Ourednik, GPL-3.0), {t("empiresTiles")}:{" "}
            <a
              href="https://www.esri.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-dotted hover:text-accent"
            >
              Esri
            </a>
            , {t("empiresDescriptions")}: Wikipedia.
          </p>


          <form
            ref={searchFormRef}
            onSubmit={handleSearchSubmit}
            className="relative mt-3 flex max-w-md items-center gap-2"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => window.setTimeout(() => setSearchFocus(false), 180)}
              autoComplete="off"
              enterKeyHint="search"
              placeholder={t("empiresSearchPlaceholder")}
              className="label-mono w-full border border-border bg-surface-elevated px-3 py-2 text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none sm:text-sm"
            />
            {searchFocus && searchSuggestions.length > 0 && (
              <ul
                role="listbox"
                className="absolute left-0 top-full z-[2000] mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-accent/40 bg-background/95 py-1 shadow-xl backdrop-blur"
              >
                {searchSuggestions.map((s) => (
                  <li key={s} role="option" aria-selected="false">
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setSearchQuery(s);
                        setSearchFocus(false);
                        window.setTimeout(() => searchFormRef.current?.requestSubmit(), 60);
                      }}
                      className="label-mono block w-full px-3 py-2 text-start text-xs text-foreground transition-colors hover:bg-accent/15 hover:text-accent sm:text-sm"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="submit"
              className="label-mono shrink-0 border border-border bg-background px-3 py-2 text-xs uppercase text-muted transition-colors hover:border-accent hover:text-accent sm:text-sm"
            >
              {t("empiresSearchButton")}
            </button>
          </form>

          {hits && hits.length > 0 && (
            <div className="mt-3 max-w-3xl">
              <p className="label-mono text-[11px] uppercase tracking-wide text-accent">
                {st.found.replace("{n}", String(hits.length))}
              </p>
              <p className="mt-1 text-[11px] text-muted">{st.hint}</p>
              <div className="mt-2 flex max-h-40 flex-wrap gap-1.5 overflow-y-auto pr-1">
                {hits.map((h) => (
                  <span key={h.name} className="inline-flex">
                    <button
                      type="button"
                      onClick={() => void focusHit(h, hits)}
                      className={
                        "border px-2 py-1 text-left text-[11px] transition-colors hover:border-accent " +
                        (activeHit === h.name ? "border-accent text-accent" : "border-border text-foreground")
                      }
                    >
                      <span className="font-semibold">{h.label}</span>
                      <span className="ml-1.5 text-[10px] text-muted">
                        {formatYear(h.from, t)} – {formatYear(h.to, t)}
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label={st.info}
                      title={st.info}
                      onClick={() => setSelected({ name: h.name, subjectTo: "", isEmpire: true, viaSearch: true })}
                      className="border border-l-0 border-border px-2 py-1 text-[11px] text-muted transition-colors hover:border-accent hover:text-accent"
                    >
                      i
                    </button>
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={clearSearch}
                className="label-mono mt-2 text-[10px] uppercase text-muted underline decoration-dotted hover:text-accent"
              >
                {st.clear}
              </button>
            </div>
          )}
        </header>

        {errorMessage && (
          <p className="mb-4 text-xs text-muted">{errorMessage}</p>
        )}

        {/* Nutzerkorrektur 20.09.2026: "minimiere die fenster von karte
            sodas man vorspulen auch sieht" — die Karte war so hoch
            (70-80vh), dass Jahres-Regler und Abspiel-Buttons erst nach dem
            Scrollen sichtbar wurden. Jetzt deutlich kompakter, damit beides
            ohne Scrollen auf den Bildschirm passt. */}
        <div className="relative h-[44vh] min-h-[280px] max-h-[460px] w-full overflow-hidden border border-border bg-surface-elevated sm:h-[56vh] sm:max-h-[620px]">
          <div ref={mapContainerRef} className="absolute inset-0" />
          {(!leafletReady || (isLoadingBorders && !hasRenderedBorders)) && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70">
              <Spinner />
            </div>
          )}

          {/* Info-Box liegt ÜBER der Karte, mittig statt unten rechts
              (Nutzerwunsch 18.09.2026: "die box ... soll in der mitte
              sein"), im breiten 16:9-Format statt hochkant und insgesamt
              kompakter/kleiner. */}
          {selected && (
            // Nutzerkorrektur 20.09.2026: "zurückbutton ist wieder nicht
            // sichtbar und man kann auch nicht scrollen" — der eigentliche
            // Grund war, dass dieses Overlay mit "absolute" INNERHALB des
            // Karten-Containers positioniert wurde, der selbst
            // "overflow-hidden" und eine feste, auf Handys sehr kleine
            // Höhe (aspect-[16/10]) hat. Dadurch wurde die Box vom
            // Kartenrahmen abgeschnitten, egal wie hoch ihr eigenes
            // max-h/overflow-y-auto war. Jetzt "fixed inset-0" — das legt
            // die Box über die GESAMTE Bildschirmhöhe, unabhängig vom
            // Kartenrahmen, Schließen-Button und Scrollen funktionieren
            // dadurch zuverlässig.
            <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 p-3">
              <div className="hud-card relative max-h-[85vh] w-full max-w-md overflow-y-auto border border-border p-4 pt-10 sm:max-w-lg sm:p-5 sm:pt-5">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label={t("closeInfo")}
                  title={t("close")}
                  className="absolute right-2 top-2 z-10 border border-border bg-background px-2.5 py-1 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  × {t("close")}
                </button>
                {info?.thumbnail && (
                  // Querformat-Box bleibt (Nutzerkorrektur 18.09.2026: "bei
                  // allen wird bilder länglich gezeigt ich will quer"), aber
                  // "object-cover" schnitt bei hochformatigen Portraits
                  // (Herrscher-Suche, Nutzerkorrektur 21.09.2026: "man sieht
                  // nicht mal gesamtes bild") Kopf/Teile des Bildes ab, um
                  // die Breitbild-Box randlos zu füllen. Jetzt
                  // "object-contain": das GANZE Bild bleibt sichtbar
                  // (zentriert, ggf. mit schmalen Balken links/rechts statt
                  // oben/unten abgeschnitten).
                  <div className="flex h-36 w-full shrink-0 items-center justify-center overflow-hidden border border-border bg-black/40 sm:h-40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={info.thumbnail}
                      alt={selected.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
                <div className="mt-3">
                  <p className="label-mono text-xs uppercase text-accent">
                    {selected.prehistoric
                      ? t("prehistResult")
                      : selected.viaSearch
                      ? t("empiresResultSearch")
                      : selected.isEmpire
                        ? t("empiresResultGreatEmpire")
                        : t("empiresResultSelected")}
                  </p>
                  <p className="font-display mt-1 text-base font-bold text-foreground sm:text-lg">
                    {info?.title ?? selected.name}
                  </p>
                  {selected.subjectTo && selected.subjectTo !== selected.name && (
                    <p className="mt-1 text-xs text-muted">
                      {t("empiresSubjectTo")} {selected.subjectTo}
                    </p>
                  )}
                  {selected.prehistoric && selected.period && (
                    <p className="mt-1 text-xs text-muted">
                      {t("prehistPeriod")} {selected.period}
                    </p>
                  )}
                  {!selected.viaSearch && !selected.prehistoric && (
                    <p className="mt-1 text-xs text-muted">
                      {t("empiresYearShown")} {formatYear(currentYear, t)}
                    </p>
                  )}
                  {/* Sprache des Reichs neben den anderen Kurzinfos
                      (Nutzerwunsch 18.09.2026: "bei allen imperiums soll
                      ein kleine text neben stehen 'Sprache : latein'") —
                      echte Wikidata-Angabe (P37/P2936), kein Rateergebnis;
                      wird erst nach dem Laden der übrigen Info gezeigt,
                      damit hier nicht schon während des Ladens "unbekannt"
                      aufblitzt. */}
                  {!infoLoading && info?.found && !selected.prehistoric && (
                    <p className="mt-1 text-xs text-muted">
                      {t("empiresLanguageLabel")}{" "}
                      {info.language
                        ? translateLanguageValue(
                            // Abbasiden: Arabisch blieb Sprache von Verwaltung und
                            // Wissenschaft; als Literatursprache entsteht Neupersisch
                            // im Osten (Samaniden, ab ca. 9./10. Jh.) — daher erst ab 900.
                            selected.name === "Abbasid Caliphate" && currentYear >= 900
                              ? "Arabisch, Persisch (Literatur)"
                              : info.language,
                            lang
                          )
                        : t("empiresLanguageUnknown")}
                    </p>
                  )}

                  {/* Eigene Seite zum Reich (Karte der größten Ausdehnung,
                      Vorgänger/Nachfolger) — Nutzerwunsch 07.10.2026 */}
                  {!selected.prehistoric && (REICH_SLUGS as Record<string, string>)[selected.name] && (
                    <Link
                      href={localePath(`/imperien/reich/${(REICH_SLUGS as Record<string, string>)[selected.name]}`)}
                      className="label-mono mt-2 inline-flex items-center gap-1 text-xs uppercase text-accent hover:underline"
                    >
                      ▤ {t("empiresOwnPage")}
                    </Link>
                  )}
                  <div className="mt-3">
                    {infoLoading && <Spinner />}
                    {!infoLoading && info?.found && (
                      <>
                        <p className="text-xs leading-relaxed text-foreground sm:text-sm">
                          {info.extract}
                        </p>
                        {info.pageUrl && (
                          <a
                            href={info.pageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="label-mono mt-3 inline-flex items-center gap-2 text-xs uppercase text-accent hover:underline"
                          >
                            {t("empiresMoreOnWikipedia")}
                          </a>
                        )}
                        {/* Kein Wikipedia-Artikel gefunden, aber eine
                            redaktionell verfasste Beschreibung vorhanden
                            (siehe src/data/empireFallbacks.ts) — das wird
                            transparent gekennzeichnet statt als
                            Wikipedia-Quelle auszugeben. */}
                        {!info.pageUrl && info.source === "editorial" && (
                          <p className="label-mono mt-3 text-[10px] uppercase text-muted">
                            {t("empiresEditorialSource")}
                          </p>
                        )}
                      </>
                    )}
                    {!infoLoading && info && !info.found && (
                      <p className="text-xs text-muted">
                        {t("empiresNoDescription")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Legenden-Text unter der Karte entfernt (Nutzerwunsch 03.10.2026) */}

        {/* Nutzerwunsch 21.09.2026: "bring diese regler bisschen nach oben"
            — Abstand zur Karte verkleinert (mt-6 -> mt-3), damit die
            Zeitleiste/Abspiel-Regler näher an der Karte sitzen und weniger
            gescrollt werden muss. */}
        <div className="hud-card mt-2 border border-border p-3 sm:p-4">
          {/* Fix 28.09.2026 (Bildschirmvideo vom Nutzer): Beim Abspielen
              sprang die Box auf dem Handy ständig hoch und runter — die
              Jahreszahl ist je nach Ziffern unterschiedlich breit, dadurch
              rutschte "Jahr" mal in dieselbe Zeile, mal darüber. Jetzt steht
              "Jahr" am Handy immer oben, und die Jahreszahl hat eine feste
              Mindestbreite → nichts verschiebt sich mehr. */}
          <div className="mb-2 flex flex-row items-center justify-between gap-2 sm:gap-3">
            <p className="label-mono text-xs uppercase text-muted">{t("empiresYearWord")}</p>
            <div className="flex items-center gap-3">
              {/* Nutzerwunsch 20.09.2026: "option hinzufügen das man auch
                  manuel das jahr eingeben kann" — Zahl eintippen und mit
                  Enter oder dem Los-Button direkt zu diesem Jahr springen. */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitYearInput();
                }}
                className="flex items-center gap-1.5"
              >
                <input
                  type="number"
                  inputMode="numeric"
                  value={yearInputText}
                  onChange={(e) => setYearInputText(e.target.value)}
                  onBlur={submitYearInput}
                  aria-label={t("empiresYearInput")}
                  className="w-20 border border-border bg-black/30 px-2 py-1 text-xs text-foreground focus:border-accent focus:outline-none sm:w-24"
                />
                <button
                  type="submit"
                  className="border border-border px-2.5 py-1 text-[11px] uppercase text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  {t("empiresGoWord")}
                </button>
              </form>
              <p className="whitespace-nowrap text-right font-display text-sm font-bold tabular-nums text-accent sm:min-w-[11rem] sm:text-xl">
                {formatYear(preYear ?? currentYear, t)}
              </p>
            </div>
          </div>

          {/* Zeitleiste als ziehbares Lineal, 1:1 nach Video-Vorlage
              (Nutzerwunsch 18.09.2026: "mach 1 zu 1 ähnliche"): die aktuelle
              Position bleibt fest in der Mitte stehen (heller, dickerer
              Zahn + Jahres-Chip darüber), und das Lineal mit den dünnen
              Strichen scrollt beim Ziehen darunter durch — nicht wie ein
              klassischer Schieberegler, bei dem sich der Zeiger bewegt.
              Jeder einzelne Kalenderjahr-Schritt ist dadurch erreichbar und
              zeigt echte, für genau dieses Jahr gültige Grenzen
              (Cliopatria-Datensatz, siehe Kopf der Seite). */}
          <div
            ref={rulerRef}
            role="slider"
            tabIndex={0}
            aria-label={t("empiresYearSelect")}
            aria-valuemin={minYear}
            aria-valuemax={maxYear}
            aria-valuenow={sliderYear}
            aria-valuetext={formatYear(sliderYear, t)}
            onPointerDown={handleRulerPointerDown}
            onPointerMove={handleRulerPointerMove}
            onPointerUp={handleRulerPointerUp}
            onPointerCancel={handleRulerPointerUp}
            onKeyDown={handleRulerKeyDown}
            className="relative h-12 touch-none select-none overflow-hidden rounded-sm border border-border bg-black/30 focus:outline-none focus-visible:border-accent"
            style={{ cursor: isDraggingRuler ? "grabbing" : "grab" }}
          >
            {/* Grundlinie wie beim Vorbild — ein dünner Strich, auf dem die
                Zähne "stehen". */}
            <div className="pointer-events-none absolute inset-x-0 bottom-3 h-px bg-border/60" />

            <div aria-hidden className="pointer-events-none absolute inset-0">
              {rulerTicks.map(({ year, leftPx, isMajor }) => (
                <span
                  key={year}
                  style={{ left: `calc(50% + ${leftPx}px)` }}
                  className={`absolute bottom-3 w-px -translate-x-1/2 rounded-full transition-colors ${
                    isMajor ? "h-5 bg-accent/70" : "h-2.5 bg-foreground/25"
                  }`}
                />
              ))}
            </div>

            {/* Fixierte Mitte: dicker heller Zahn + Jahres-Chip darüber,
                bewegt sich nie — genau wie im Vorbild-Video. */}
            <div className="pointer-events-none absolute bottom-3 left-1/2 h-7 w-[3px] -translate-x-1/2 rounded-full bg-accent shadow-[0_0_8px_rgba(0,0,0,0.6)]" />
            <div className="pointer-events-none absolute left-1/2 top-1.5 -translate-x-1/2 whitespace-nowrap rounded-sm bg-accent px-2.5 py-1 text-xs font-bold text-background shadow-md">
              {formatYear(sliderYear, t)}
            </div>
          </div>

          {/* Abspiel-Steuerung: automatisch durch die Jahre vorspulen statt
              jedes Jahr einzeln per Hand zu ziehen (Nutzerwunsch
              18.09.2026, "durch zeit besser vorspulen"). */}
          <div className="mt-2 flex flex-nowrap items-center justify-between gap-1.5">
            <div className="flex min-w-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setSliderYear(minYear);
                }}
                disabled={!yearRange}
                className="border border-border px-2.5 py-1.5 text-xs text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
                aria-label={t("empiresJumpStart")}
                title={t("empiresJumpStart")}
              >
                ⏮
              </button>
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                disabled={!yearRange}
                className="min-w-0 truncate border border-border px-2 py-1.5 text-[10px] uppercase tracking-wide text-foreground sm:px-3 sm:text-xs transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
                aria-label={isPlaying ? t("empiresPause") : t("empiresPlay")}
                title={isPlaying ? t("empiresPause") : t("empiresPlay")}
              >
                {isPlaying ? `⏸ ${t("empiresPause")}` : `▶ ${t("empiresPlay")}`}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setSliderYear(maxYear);
                }}
                disabled={!yearRange}
                className="border border-border px-2.5 py-1.5 text-xs text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
                aria-label={t("empiresJumpEnd")}
                title={t("empiresJumpEnd")}
              >
                ⏭
              </button>
            </div>

            <button
              type="button"
              onClick={() => setSpeedStep((s) => (s + 1) % PLAY_SPEEDS.length)}
              className="label-mono flex shrink-0 items-center gap-1 border border-border px-2 py-1.5 text-[10px] uppercase text-foreground transition-colors hover:border-accent hover:text-accent"
              aria-label={t("empiresSpeed")}
              title={t("empiresSpeed")}
            >
              ⚙ {PLAY_SPEED_LABELS[speedStep]}
            </button>
            <button
              type="button"
              onClick={handleShare}
              disabled={!yearRange}
              className="label-mono flex shrink-0 items-center gap-1 border border-border px-2 py-1.5 text-[10px] uppercase text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
              aria-label={t("empiresShare")}
              title={t("empiresShare")}
            >
              {shareCopied ? `✓ ${t("empiresLinkCopied")}` : (
                <>
                  ↗<span className="hidden sm:inline"> {t("empiresShare")}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Urzeit & Steinzeit (Nutzerwunsch 05.10.2026): Sprungmarken vor
            den ersten Reichen. Ein Tipp zeigt Menschenarten, Steinzeit-
            Kulturen und frühe Siedlungen dieser Zeit auf der Karte; das
            Lineal oben bringt einen zurück zu den Reichen. */}
        <div className="hud-card mt-2 border border-border p-3 sm:p-4">
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <p className="label-mono text-xs uppercase text-accent">{t("prehistTitle")}</p>
            {preYear !== null && (
              <button
                type="button"
                onClick={() => {
                  setPreYear(null);
                  setSliderYear(minYear);
                }}
                className="label-mono shrink-0 text-[11px] uppercase text-muted transition-colors hover:text-accent"
              >
                {t("prehistBack")} →
              </button>
            )}
          </div>
          <p className="mb-2 text-[11px] leading-relaxed text-muted">{t("prehistHint")}</p>
          <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
            {PREHIST_ERAS.map((era) => {
              const active = preYear === era.year;
              return (
                <button
                  key={era.year}
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setPreYear(era.year);
                    setSelected(null);
                    mapRef.current?.setView([25, 30], 2);
                  }}
                  className={`flex shrink-0 flex-col items-start border px-2.5 py-1.5 text-left transition-colors ${
                    active
                      ? "border-accent bg-accent/15 text-foreground"
                      : "border-border text-muted hover:border-accent hover:text-foreground"
                  }`}
                >
                  <span className="font-display text-[11px] font-bold tabular-nums text-accent">
                    {formatYear(era.year, t)}
                  </span>
                  <span className="max-w-[9.5rem] text-[10px] leading-snug">{prehistName(era.n, lang)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <CosmicCalendar index="01" />

        {/* Nutzerwunsch 17.10.2026: Geschichts-Werkzeuge direkt unter dem Kosmischen Kalender */}
      <Link
        href={localePath("/imperien/werkzeuge")}
        className="group relative mt-6 block max-w-2xl overflow-hidden rounded-xl border border-accent/40 bg-gradient-to-br from-accent/15 via-surface-elevated to-transparent p-4 shadow-[0_0_30px_-10px_var(--accent)] backdrop-blur transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-[0_0_40px_-8px_var(--accent)] sm:p-5"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="label-mono text-[10px] uppercase tracking-widest text-accent">NEU</p>
            <p className="font-display mt-1 text-base font-bold uppercase tracking-tight text-foreground sm:text-lg">
              {t("empiresTools")}
            </p>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-accent/60 text-accent transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">→</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {[toolTexts(lang).tCompare, toolTexts(lang).tRecords, toolTexts(lang).tYear, toolTexts(lang).tQuiz].map((x, i) => (
            <span key={i} className="label-mono rounded-full border border-border bg-background/40 px-3 py-1 text-[10px] uppercase tracking-wide text-foreground sm:text-xs">{x}</span>
          ))}
        </div>
      </Link>

        {/* Nutzerwunsch 14.10.2026: Die deutsche "01-04"-Imperien-Box ist
            entfernt (steht schon in der Karte); nur der Link zur
            Reichs-Liste bleibt. */}
        <div className="mt-16 border-t border-border pt-10">
          <Link
            href={localePath("/imperien/reiche")}
            className="label-mono mt-8 inline-block border border-border px-4 py-2.5 text-xs uppercase tracking-wide text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            {t("empiresAllEmpires")} →
          </Link>
          <Link
            href={localePath("/imperien/werkzeuge")}
            className="label-mono ms-3 mt-8 inline-block border border-border px-4 py-2.5 text-xs uppercase tracking-wide text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            {t("empiresTools")} →
          </Link>
        </div>
      </div>
    </main>
  );
}
