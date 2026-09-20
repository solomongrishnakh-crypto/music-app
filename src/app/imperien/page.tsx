"use client";

import Link from "next/link";
import type { KeyboardEvent, PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import SiteBackground from "@/components/particles/SiteBackground";
import TopEmpiresGrid from "@/components/home/TopEmpiresGrid";
import Spinner from "@/components/ui/Spinner";

const LEAFLET_CSS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

// Ozean-Basiskarte (Wasser sichtbar in Blau, Land als Relief) von Esri —
// bewusst OHNE heutige Landesgrenzen und -namen (sonst stünde auf einer
// Karte von 700 v. Chr. "Uzbekistan", Nutzerkorrektur 18.09.2026) und
// kostenlos ohne API-Key nutzbar (CARTOs frühere anonyme dark_all-Kacheln
// verlangen inzwischen einen Account/Key, deshalb hier bewusst Esri statt
// CARTO). Vorher wurde reines Hillshade (nur Grautöne, kein Wasser/Land-
// Unterschied) genutzt — Nutzerkorrektur 18.09.2026: "man sieht kein
// wasser". Achtung: Esri nutzt {z}/{y}/{x} (nicht {x}/{y} wie das übliche
// Slippy-Map-Schema).
const TILE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}";

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
}

interface EmpireInfo {
  found: boolean;
  title?: string;
  extract?: string;
  thumbnail?: string | null;
  pageUrl?: string | null;
  language?: string | null;
  lang?: "de" | "en";
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

function formatYear(year: number | undefined): string {
  if (year === undefined) return "";
  return year < 0 ? `${Math.abs(year)} v. Chr.` : `${year} n. Chr.`;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assignDistinctColors(features: any[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const f of features) {
    const name: string = f.properties?.NAME ?? "";
    map.set(name, getStableColor(name));
  }
  return map;
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
      coordinates: geometry.coordinates.map((ring: number[][]) => chaikinSmooth(ring)),
    };
  }
  if (geometry.type === "MultiPolygon") {
    return {
      ...geometry,
      coordinates: geometry.coordinates.map((poly: number[][][]) =>
        poly.map((ring) => chaikinSmooth(ring))
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
 * fester Kartenstand. Geladen ueber /api/empires/index (liefert nur noch
 * den Jahresbereich) + /api/empires/borders?year=... (liefert die fuer
 * genau dieses Jahr gueltigen Gebiete), siehe src/lib/history/cliopatria.ts.
 *
 * Leaflet wird bewusst per CDN-<script>/<link> geladen statt per npm
 * (im Entwicklungs-Sandbox-Netz war der npm-Registry-Zugriff blockiert;
 * ausserdem spart das ein zusaetzliches Build-Dependency).
 */
export default function ImperienPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const geoLayerRef = useRef<any>(null);
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selected, setSelected] = useState<SelectedFeature | null>(null);
  const [info, setInfo] = useState<EmpireInfo | null>(null);
  const [infoLoading, setInfoLoading] = useState(false);

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
  // Chr. bis 2024 n. Chr. ab, jedes Jahr dazwischen ist gueltig).
  useEffect(() => {
    let cancelled = false;
    fetch("/api/empires/index")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error || typeof data.minYear !== "number" || typeof data.maxYear !== "number") {
          setErrorMessage(data.error ?? "Zeitleiste konnte nicht geladen werden.");
          return;
        }
        setYearRange({ minYear: data.minYear, maxYear: data.maxYear });
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
    if (!mapRef.current || !L) return;
    if (geoLayerRef.current) {
      mapRef.current.removeLayer(geoLayerRef.current);
    }

    // Jedes benannte Gebiet wird gezeichnet — nicht nur die, deren Name
    // Wörter wie "Empire"/"Khanate" enthält (Nutzerkorrektur 18.09.2026:
    // "es soll nicht alles um großen mächte gehen, es soll alle imperiums
    // da sein"). Gebiete werden nach Bounding-Box-Fläche sortiert
    // gezeichnet (große zuerst/unten, kleine zuletzt/oben), damit ein
    // kleines eingeschlossenes Gebiet nicht komplett von einem großen
    // Nachbarn verdeckt wird. JEDES benannte Gebiet bekommt außerdem eine
    // dauerhafte Beschriftung (Nutzerkorrektur 20.09.2026: "manche
    // imperien haben kein name auf territorium").
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const features: any[] = Array.isArray(geojson.features) ? geojson.features : [];
    const namedFeatures = features
      .filter((f) => (f?.properties?.NAME ?? "").trim().length > 0)
      .map((f) => ({ ...f, geometry: smoothGeometry(f.geometry) }));
    const sortedFeatures = [...namedFeatures].sort(
      (a, b) => polygonArea(b.geometry) - polygonArea(a.geometry)
    );
    const sortedGeojson = { ...geojson, features: sortedFeatures };

    // Nutzerkorrektur 20.09.2026 (x2): "es ist zu dicht ... kleine imperien
    // name nicht angezeigt wird bis du mehr reinzoomst" — der erste Versuch
    // (fester Pixel-Flächen-Schwellwert über die Bounding-Box) hat bei
    // vielen kleinen, aber lang gestreckten Gebieten (schmale Grafschaften
    // etc.) immer noch viel zu großzügig Beschriftungen erlaubt, weil eine
    // Bounding-Box deren Fläche stark überschätzt. Jetzt stattdessen: nur
    // eine feste RANGLISTEN-Anzahl der (nach echter Fläche) größten Gebiete
    // bekommt beim aktuellen Zoomstand eine dauerhafte Beschriftung — das
    // Limit wächst mit dem Zoom, sodass beim Reinzoomen nach und nach mehr
    // (auch kleinere) Namen sichtbar werden, ganz ohne die Karte neu zu
    // laden (siehe "zoomend"-Listener oben).
    const zoom = mapRef.current.getZoom?.() ?? 2;
    let labelLimit: number;
    if (zoom <= 2) labelLimit = 6;
    else if (zoom === 3) labelLimit = 10;
    else if (zoom === 4) labelLimit = 18;
    else if (zoom === 5) labelLimit = 32;
    else if (zoom === 6) labelLimit = 55;
    else labelLimit = Infinity;
    const permanentLabelNames = new Set(
      sortedFeatures.slice(0, labelLimit).map((f) => f.properties?.NAME)
    );

    // Farben pro Gebiet: feste, namensbasierte Farbe statt Graphenfärbung
    // (Nutzerkorrektur 20.09.2026, siehe getStableColor/assignDistinctColors
    // oben — Farben dürfen sich nicht mehr je nach Jahr/Nachbarn ändern).
    const colorByName = assignDistinctColors(sortedFeatures);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const layer = L.geoJSON(sortedGeojson, {
      // Leaflet vereinfacht/rundet Linien beim Zeichnen zusätzlich zur
      // eigenen Chaikin-Glättung oben — niedrigerer Wert = weniger
      // Vereinfachung = feinere Grenzen (Nutzerwunsch 20.09.2026: "mach
      // grafik ... höher . sowohl grenzen").
      smoothFactor: 1.1,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      style: (feature: any) => {
        const name: string = feature?.properties?.NAME ?? "";
        const c = colorByName.get(name) ?? "hsl(0, 0%, 50%)";
        return {
          color: c,
          weight: 1.6,
          fillColor: c,
          fillOpacity: 0.42,
          // Runde statt spitze Ecken an den Grenzlinien — wirkt weniger
          // "kantig" (Nutzerwunsch 18.09.2026), auch wenn die zugrunde
          // liegenden Geodaten selbst nicht glatter werden.
          lineJoin: "round",
          lineCap: "round",
        };
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onEachFeature: (feature: any, lyr: any) => {
        const name: string = feature?.properties?.NAME ?? "";
        const subjectTo: string = feature?.properties?.SUBJECTO ?? "";
        if (!name) return;

        const isMajor = permanentLabelNames.has(name);
        lyr.bindTooltip(name, {
          permanent: isMajor,
          direction: "center",
          className: "empire-label",
          opacity: isMajor ? 0.95 : 0.9,
        });

        // Nutzerkorrektur 20.09.2026: "die imperiennamen sind nicht in der
        // mitte des terrirorium" — Tooltip-Position explizit auf den
        // berechneten "Pole of Inaccessibility" setzen statt Leaflets
        // Standard (Bounding-Box-Mitte, siehe geometryLabelPoint oben).
        const labelPoint = geometryLabelPoint(feature.geometry);
        if (labelPoint) {
          const tooltip = lyr.getTooltip?.();
          tooltip?.setLatLng?.(L.latLng(labelPoint[1], labelPoint[0]));
        }

        lyr.on({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          mouseover: (e: any) => {
            e.target.setStyle({ weight: 2.6 });
            e.target.bringToFront?.();
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          mouseout: (e: any) => {
            e.target.setStyle({ weight: 1.4 });
          },
          click: () => {
            setSelected({ name, subjectTo, isEmpire: isEmpireName(name) });
          },
        });
      },
    }).addTo(mapRef.current);

    geoLayerRef.current = layer;
    setErrorMessage(null);
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
      fetch(`/api/empires/borders?year=${year}`)
        .then((res) => res.json())
        .then((geojson) => {
          if (cancelled) return;
          if (geojson.error) {
            setErrorMessage(geojson.error);
            return;
          }
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
  }, [leafletReady, yearRange, currentYear]);

  // Ausführliche Info (Wikipedia) nachladen, sobald ein Gebiet angeklickt wurde.
  useEffect(() => {
    if (!selected) {
      setInfo(null);
      return;
    }
    let cancelled = false;
    setInfoLoading(true);
    setInfo(null);
    fetch(`/api/empires/info?name=${encodeURIComponent(selected.name)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setInfo(data);
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
  }, [selected]);

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
        /* Die Esri-Ozeankarte ist von Haus aus hell/bunt — hier abgedunkelt,
           damit sie zum dunklen Seitenstil passt, aber Wasser (blau) weiter
           klar von Land (Relief) zu unterscheiden bleibt (Nutzerkorrektur
           18.09.2026: "man sieht kein wasser" beim reinen Hillshade). Die
           Reich-Flächen liegen in einer eigenen Ebene und werden davon
           nicht mit verdunkelt. */
        .leaflet-tile-pane { filter: brightness(0.4) saturate(1.3) contrast(1.05); }
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
        <Link
          href="/"
          className="label-mono mb-8 inline-flex w-fit items-center gap-2 text-xs uppercase text-muted transition-colors hover:text-accent"
        >
          ← Zurück
        </Link>

        <header className="mb-8 border-b border-border pb-6">
          <p className="label-mono text-xs uppercase text-muted">// Große Imperien</p>
          <h1 className="font-display mt-2 text-2xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
            Die Welt durch die Jahrhunderte
          </h1>
          <p className="mt-3 max-w-2xl text-xs leading-relaxed text-muted sm:text-sm">
            Historische Grenzen von der Antike bis heute — große Reiche
            (rot, mit Namen auf der Karte) auf einer echten Zeitleiste. Auf
            ein Gebiet klicken für eine ausführliche Beschreibung.
            Datenquelle:{" "}
            <a
              href="https://github.com/Seshat-Global-History-Databank/cliopatria"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-dotted hover:text-accent"
            >
              Cliopatria
            </a>{" "}
            (Seshat Global History Databank, CC BY 4.0), Kartenkacheln:{" "}
            <a
              href="https://www.esri.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-dotted hover:text-accent"
            >
              Esri
            </a>
            , Beschreibungen: Wikipedia.
          </p>
        </header>

        {errorMessage && (
          <p className="mb-4 text-xs text-muted">{errorMessage}</p>
        )}

        {/* Nutzerwunsch 20.09.2026: "mach grafik von karte und teritorium
            höher" — deutlich mehr Bildschirmhöhe statt fixem 16:10/16:8-
            Seitenverhältnis, damit Grenzen/Beschriftungen mehr Platz haben. */}
        <div className="relative h-[70vh] min-h-[420px] w-full overflow-hidden border border-border bg-surface-elevated sm:h-[80vh]">
          <div ref={mapContainerRef} className="absolute inset-0" />
          {(!leafletReady || (isLoadingBorders && !yearRange)) && (
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
              <div className="relative max-h-[85vh] w-full max-w-md overflow-y-auto border border-border bg-background/95 p-4 pt-10 backdrop-blur-sm sm:max-w-lg sm:p-5 sm:pt-5">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Info schließen"
                  title="Schließen"
                  className="absolute right-2 top-2 z-10 border border-border bg-background px-2.5 py-1 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  × Schließen
                </button>
                {info?.thumbnail && (
                  // Querformat statt hochkant (Nutzerkorrektur 18.09.2026:
                  // "bei allen wird bilder länglich gezeigt ich will quer")
                  // — Banner in voller Breite über dem Text statt schmalem
                  // Streifen daneben, object-cover schneidet das (oft
                  // hochformatige) Wikipedia-Bild passend auf Breitbild zu.
                  <div className="h-36 w-full shrink-0 overflow-hidden border border-border sm:h-40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={info.thumbnail}
                      alt={selected.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="mt-3">
                  <p className="label-mono text-xs uppercase text-accent">
                    // {selected.isEmpire ? "Großes Imperium" : "Ausgewählt"}
                  </p>
                  <p className="font-display mt-1 text-base font-bold text-foreground sm:text-lg">
                    {info?.title ?? selected.name}
                  </p>
                  {selected.subjectTo && selected.subjectTo !== selected.name && (
                    <p className="mt-1 text-xs text-muted">
                      Teil von / Kolonialmacht: {selected.subjectTo}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-muted">
                    Angezeigtes Jahr: {formatYear(currentYear)}
                  </p>
                  {/* Sprache des Reichs neben den anderen Kurzinfos
                      (Nutzerwunsch 18.09.2026: "bei allen imperiums soll
                      ein kleine text neben stehen 'Sprache : latein'") —
                      echte Wikidata-Angabe (P37/P2936), kein Rateergebnis;
                      wird erst nach dem Laden der übrigen Info gezeigt,
                      damit hier nicht schon während des Ladens "unbekannt"
                      aufblitzt. */}
                  {!infoLoading && info?.found && (
                    <p className="mt-1 text-xs text-muted">
                      Sprache: {info.language ?? "nicht bekannt"}
                    </p>
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
                            Mehr auf Wikipedia ↗
                          </a>
                        )}
                        {/* Kein Wikipedia-Artikel gefunden, aber eine
                            redaktionell verfasste Beschreibung vorhanden
                            (siehe src/data/empireFallbacks.ts) — das wird
                            transparent gekennzeichnet statt als
                            Wikipedia-Quelle auszugeben. */}
                        {!info.pageUrl && info.source === "editorial" && (
                          <p className="label-mono mt-3 text-[10px] uppercase text-muted">
                            // Quelle: redaktionell (kein Wikipedia-Artikel gefunden)
                          </p>
                        )}
                      </>
                    )}
                    {!infoLoading && info && !info.found && (
                      <p className="text-xs text-muted">
                        Keine ausführliche Beschreibung gefunden — für dieses
                        Gebiet gibt es (noch) keinen passenden
                        Wikipedia-Artikel.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-4 text-[10px] uppercase text-muted">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 border border-accent bg-accent/50" />
            Alle Reiche &amp; Königreiche — jede Farbe eigenständig, große Gebiete mit Namen auf der Karte, kleine bei Hover
          </span>
        </div>

        <div className="mt-6 border border-border bg-surface-elevated p-5 sm:p-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
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
                  aria-label="Jahr eingeben"
                  className="w-24 border border-border bg-black/30 px-2 py-1 text-xs text-foreground focus:border-accent focus:outline-none"
                />
                <button
                  type="submit"
                  className="border border-border px-2.5 py-1 text-[11px] uppercase text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  Los
                </button>
              </form>
              <p className="font-display text-lg font-bold text-accent sm:text-xl">
                {formatYear(currentYear)}
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
            aria-label="Jahr auswählen"
            aria-valuemin={minYear}
            aria-valuemax={maxYear}
            aria-valuenow={sliderYear}
            aria-valuetext={formatYear(sliderYear)}
            onPointerDown={handleRulerPointerDown}
            onPointerMove={handleRulerPointerMove}
            onPointerUp={handleRulerPointerUp}
            onPointerCancel={handleRulerPointerUp}
            onKeyDown={handleRulerKeyDown}
            className="relative h-14 touch-none select-none overflow-hidden rounded-sm border border-border bg-black/30 focus:outline-none focus-visible:border-accent"
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
              {formatYear(sliderYear)}
            </div>
          </div>

          {/* Abspiel-Steuerung: automatisch durch die Jahre vorspulen statt
              jedes Jahr einzeln per Hand zu ziehen (Nutzerwunsch
              18.09.2026, "durch zeit besser vorspulen"). */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setSliderYear(minYear);
                }}
                disabled={!yearRange}
                className="border border-border px-2.5 py-1.5 text-xs text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
                aria-label="Zum Anfang springen"
                title="Zum Anfang springen"
              >
                ⏮
              </button>
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                disabled={!yearRange}
                className="border border-border px-3 py-1.5 text-xs uppercase tracking-wide text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
                aria-label={isPlaying ? "Pause" : "Abspielen"}
                title={isPlaying ? "Pause" : "Durch die Jahre abspielen"}
              >
                {isPlaying ? "⏸ Pause" : "▶ Abspielen"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setSliderYear(maxYear);
                }}
                disabled={!yearRange}
                className="border border-border px-2.5 py-1.5 text-xs text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
                aria-label="Zum Ende springen"
                title="Zum Ende springen"
              >
                ⏭
              </button>
            </div>

            <button
              type="button"
              onClick={() => setSpeedStep((s) => (s + 1) % PLAY_SPEEDS.length)}
              className="label-mono flex items-center gap-1.5 border border-border px-2.5 py-1.5 text-[11px] uppercase text-foreground transition-colors hover:border-accent hover:text-accent"
              aria-label="Abspielgeschwindigkeit ändern"
              title="Abspielgeschwindigkeit ändern"
            >
              ⚙ {PLAY_SPEED_LABELS[speedStep]}
            </button>
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
        </div>
      </div>
    </main>
  );
}
