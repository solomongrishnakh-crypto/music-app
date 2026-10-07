"use client";

import Link from "next/link";
import type { FormEvent, KeyboardEvent, PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import SiteBackground from "@/components/particles/SiteBackground";
import TopEmpiresGrid from "@/components/home/TopEmpiresGrid";
import REICH_SLUGS from "@/data/reiche/slugs.json";
import Spinner from "@/components/ui/Spinner";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TranslationKey } from "@/lib/translations";
import { translateLanguageValue } from "@/lib/languageNameTranslations";
import {
  getAllEmpireNames,
  getEmpiresForYear,
  getEmpiresYearRange,
  preloadEmpiresData,
} from "@/lib/history/empiresClient";
import { lookupWikiInBrowser } from "@/lib/history/wikiClientLookup";
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

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function getStableColor(name: string): string {
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
    s = smoothGeometry(g);
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
  const { t, lang } = useLanguage();
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

  function handleSearchSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setSelected({ name: query, subjectTo: "", isEmpire: true, viaSearch: true });
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
    fillRendererRef.current = L.svg({ pane: "territoryFill", padding: 0.5 });
    borderRendererRef.current = L.svg({ pane: "territoryBorder", padding: 0.5 });
    const prehistPane = map.createPane("prehistory");
    prehistPane.style.zIndex = "420";
    prehistRendererRef.current = L.svg({ pane: "prehistory", padding: 0.5 });
    applyLandClip(L, map, fillRendererRef.current, "land-clip-fill");
    applyLandClip(L, map, borderRendererRef.current, "land-clip-border");
    applyLandClip(L, map, prehistRendererRef.current, "land-clip-prehist");

    mapRef.current = map;

    // Nutzerkorrektur 20.09.2026: "es ist zu dicht ... kleine imperien
    // name nicht angezeigt wird bis du mehr reinzoomst" — beim Reinzoomen
    // dieselben (bereits geladenen) Grenzen einfach neu zeichnen, damit
    // die Größenschwelle für dauerhafte Beschriftungen (siehe
    // renderBordersGeojson) den neuen Zoomstand berücksichtigt. Kein
    // Netzwerk-Request nötig, das Jahr bleibt ja gleich.
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

    // Nur eine mit dem Zoom wachsende Anzahl der (nach echter Fläche)
    // größten Gebiete bekommt eine feste Beschriftung (Nutzerkorrekturen
    // 20.09.2026: "zu dicht" / "namen sollen früher sichtbar sein").
    const zoom = map.getZoom?.() ?? 2;
    let labelLimit: number;
    if (zoom <= 2) labelLimit = 20;
    else if (zoom === 3) labelLimit = 35;
    else if (zoom === 4) labelLimit = 60;
    else if (zoom === 5) labelLimit = 100;
    else if (zoom === 6) labelLimit = 150;
    else labelLimit = Infinity;
    const permanentLabelNames = new Set(
      sortedFeatures.slice(0, labelLimit).map((f) => f.properties?.NAME)
    );
    // Beschriftungsgröße wie im Atlas: die größten Reiche etwas größer.
    const bigLabelNames = new Set(sortedFeatures.slice(0, 6).map((f) => f.properties?.NAME));

    // Feste, namensbasierte Farben (Nutzerkorrektur 20.09.2026).
    function borderStyle(name: string, isMajor: boolean) {
      return {
        color: getStableColor(name),
        weight: isMajor ? 1.4 : 0.7,
        opacity: isMajor ? 0.95 : 0.75,
        fill: false,
        lineJoin: "round",
        lineCap: "round",
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function setLabel(e: any, permanent: boolean, className: string) {
      e.fill.unbindTooltip();
      e.fill.bindTooltip(e.name, { permanent, direction: "center", className, opacity: 0.95 });
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
      const isMajor = permanentLabelNames.has(name);
      // Sammel-Umriss und Kern tragen denselben Namen — nur das GRÖSSTE
      // Teil bekommt die feste Beschriftung, sonst stünde der Name doppelt.
      const wants = isMajor && !labeledNames.has(name);
      if (wants) labeledNames.add(name);
      const labelClass = bigLabelNames.has(name) ? "empire-label empire-label-big" : "empire-label";

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
          smoothFactor: 1.1,
          stroke: true,
          color: c,
          weight: 4,
          opacity: 1,
          fillColor: c,
          fillOpacity: 1,
        });
        const border = L.polygon(latlngs, {
          renderer: borderRendererRef.current ?? undefined,
          pane: "territoryBorder",
          interactive: false,
          smoothFactor: 1.1,
          ...borderStyle(name, isMajor),
        });
        const point = cachedLabelPoint(feature.geometry);
        const subjectTo: string = feature.properties?.SUBJECTO ?? "";
        e = { fill, border, name, isMajor, labeled: false, labelClass: "", point };
        const entry = e;
        // Name in die echte Mitte der Fläche ("Pole of Inaccessibility") —
        // bei JEDEM Öffnen gesetzt, Leaflet springt sonst zum ersten Teilstück.
        if (point) {
          const labelLatLng = L.latLng(point[1], point[0]);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          fill.on("tooltipopen", (ev: any) => ev.tooltip?.setLatLng?.(labelLatLng));
        }
        fill.on({
          mouseover: () => entry.border.setStyle({ weight: 2.6, opacity: 1, color: "#ffffff" }),
          mouseout: () => entry.border.setStyle(borderStyle(entry.name, entry.isMajor)),
          click: () => setSelected({ name, subjectTo, isEmpire: isEmpireName(name) }),
        });
        setLabel(e, wants, labelClass);
        terr.fill.addLayer(fill);
        terr.border.addLayer(border);
        terr.entries.set(key, e);
        added = true;
      } else {
        if (e.isMajor !== isMajor) {
          e.isMajor = isMajor;
          e.border.setStyle(borderStyle(name, isMajor));
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

    // Nutzerkorrektur 29.09.2026: überlappende Namen — nach Wichtigkeit
    // durchgehen; überschneidet sich ein Name mit einem bereits platzierten,
    // wird er nur beim Antippen gezeigt. Erst ALLE Positionen lesen, dann
    // ändern (sonst rechnet der Browser das Layout pro Name neu).
    const rects = wantLabel.map((e) => {
      const el: HTMLElement | undefined = e.fill.getTooltip?.()?.getElement?.();
      return el ? el.getBoundingClientRect() : null;
    });
    const placedRects: DOMRect[] = [];
    const pad = 3;
    wantLabel.forEach((e, i) => {
      const r = rects[i];
      if (!r) return;
      const collides = placedRects.some(
        (p) =>
          r.left - pad < p.right &&
          r.right + pad > p.left &&
          r.top - pad < p.bottom &&
          r.bottom + pad > p.top
      );
      if (!collides) placedRects.push(r);
      else setLabel(e, false, e.labelClass);
    });

    setErrorMessage(null);
    setHasRenderedBorders(true);
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
        renderBordersGeojson(cached);
        return;
      }
      setIsLoadingBorders(true);
      getEmpiresForYear(year)
        .then((geojson) => {
          if (cancelled) return;
          bordersCacheRef.current.set(year, geojson);
          renderBordersGeojson(geojson);
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
    if (isDraggingRuler) el.dataset.bgpause = "1";
    else delete el.dataset.bgpause;
    return () => {
      delete el.dataset.bgpause;
    };
  }, [isDraggingRuler]);

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
    const url = `${window.location.origin}/imperien?jahr=${currentYear}`;
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
      <SiteBackground />

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
        .leaflet-tooltip.prehist-label {
          font-size: 10px;
          font-style: italic;
          text-transform: none;
          letter-spacing: 0.02em;
          color: #fde7c4;
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

      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-20 pt-10 sm:px-8 sm:pt-14">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="label-mono inline-flex w-fit items-center gap-2 text-xs uppercase text-muted transition-colors hover:text-accent"
          >
            ← {t("back")}
          </Link>
          <LanguageSwitcher />
        </div>

        <header className="mb-8 border-b border-border pb-6">
          <p className="label-mono text-xs uppercase text-muted">// {t("navEmpiresLabel")}</p>
          <h1 className="font-display mt-2 text-2xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
            {t("empiresTitle")}
          </h1>
          <p className="label-mono mt-2 text-[11px] uppercase tracking-wide text-accent sm:text-xs">
            {t("empiresSeoTagline")}
          </p>
          <p className="mt-3 max-w-2xl text-xs leading-relaxed text-muted sm:text-sm">
            {t("empiresIntroPrefix")}{" "}
            <a
              href="https://github.com/Seshat-Global-History-Databank/cliopatria"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-dotted hover:text-accent"
            >
              Cliopatria
            </a>{" "}
            (Seshat Global History Databank, CC BY 4.0), {t("empiresTiles")}:{" "}
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
            onSubmit={handleSearchSubmit}
            className="mt-4 flex max-w-md items-center gap-2"
          >
            <input
              type="text"
              list="empire-name-suggestions"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("empiresSearchPlaceholder")}
              className="label-mono w-full border border-border bg-surface-elevated px-3 py-2 text-xs text-foreground placeholder:text-muted focus:border-accent focus:outline-none sm:text-sm"
            />
            <datalist id="empire-name-suggestions">
              {empireNames.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
            <button
              type="submit"
              className="label-mono shrink-0 border border-border bg-background px-3 py-2 text-xs uppercase text-muted transition-colors hover:border-accent hover:text-accent sm:text-sm"
            >
              {t("empiresSearchButton")}
            </button>
          </form>
        </header>

        {errorMessage && (
          <p className="mb-4 text-xs text-muted">{errorMessage}</p>
        )}

        {/* Nutzerkorrektur 20.09.2026: "minimiere die fenster von karte
            sodas man vorspulen auch sieht" — die Karte war so hoch
            (70-80vh), dass Jahres-Regler und Abspiel-Buttons erst nach dem
            Scrollen sichtbar wurden. Jetzt deutlich kompakter, damit beides
            ohne Scrollen auf den Bildschirm passt. */}
        <div className="relative h-[42vh] min-h-[280px] max-h-[440px] w-full overflow-hidden border border-border bg-surface-elevated sm:h-[52vh] sm:max-h-[520px]">
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
                  × Schließen
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
                    // {selected.prehistoric
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
                        ? translateLanguageValue(info.language, lang)
                        : t("empiresLanguageUnknown")}
                    </p>
                  )}

                  {/* Eigene Seite zum Reich (Karte der größten Ausdehnung,
                      Vorgänger/Nachfolger) — Nutzerwunsch 07.10.2026 */}
                  {!selected.prehistoric && (REICH_SLUGS as Record<string, string>)[selected.name] && (
                    <Link
                      href={`/imperien/reich/${(REICH_SLUGS as Record<string, string>)[selected.name]}`}
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
            <p className="label-mono text-xs uppercase text-muted">Jahr</p>
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
                  Los
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
            <p className="label-mono text-xs uppercase text-accent">// {t("prehistTitle")}</p>
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

        {/* Nutzerwunsch 19.09.2026: "nimm diese box mit großen imperien
            füge es in die seite unten wo karte ist" — dieselbe "01-04"-Box
            wie auf der Startseite, hier unterhalb der Karte/Zeitleiste. */}
        <div className="mt-16 border-t border-border pt-10">
          <div className="mb-8">
            <p className="label-mono text-xs uppercase text-muted">
              // Größte Imperien der Geschichte
            </p>
          </div>
          <TopEmpiresGrid />
          <Link
            href="/imperien/reiche"
            className="label-mono mt-8 inline-block border border-border px-4 py-2.5 text-xs uppercase tracking-wide text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            {t("empiresAllEmpires")} →
          </Link>
        </div>
      </div>
    </main>
  );
}
