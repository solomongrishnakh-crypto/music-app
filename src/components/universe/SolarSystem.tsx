"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { PLANETS, ALL_BODIES, SUN, type PlanetData } from "@/data/solarSystem";
import { useLanguage } from "@/contexts/LanguageContext";
import { localize } from "@/lib/i18n";
import {
  bodyPosition,
  dateToJd,
  distanceAu,
  jdToDate,
  nextClosestApproach,
  orbitPath,
  SUN_RADIUS_AU,
  type Vec3,
} from "@/lib/astro/orbits";

interface DrawnPlanet {
  planet: PlanetData;
  x: number;
  y: number;
  r: number;
}

interface SolarSystemProps {
  /** "compact" für die kleine Vorschau-Box, "full" für die Vollbildansicht. */
  mode?: "compact" | "full";
  /** Nur im "full"-Modus relevant: Klick auf einen Planeten. */
  onSelectPlanet?: (planet: PlanetData | null) => void;
  selectedId?: string | null;
  className?: string;
}

/**
 * Zeichnet das Sonnensystem auf einem <canvas>.
 *
 * Nutzerwunsch 29.09.2026 ("realistischer machen mit Größe, Abstand und so
 * was") — seitdem:
 *  - ECHTE Positionen zum heutigen Datum und echte Bahnellipsen (mit
 *    Exzentrizität und Neigung, Sonne im Brennpunkt), berechnet aus
 *    NASA/JPL-Horizons-Bahnelementen (siehe lib/astro/orbits.ts). Plutos
 *    Bahn kreuzt dadurch sichtbar die von Neptun, Eris' Bahn ist stark
 *    gestreckt und geneigt.
 *  - Echte relative Geschwindigkeiten (Kepler): Zeitraffer in Tagen pro
 *    Sekunde, mit Datumsanzeige.
 *  - Umschalter "Echter Maßstab": Abstände und Sonnengröße linear und
 *    maßstabsgetreu (die inneren Planeten kleben dann eng an der Sonne —
 *    reinzoomen, bis zu 400×). Planeten müssen dabei vergrößert werden
 *    (in echter Größe wären sie unsichtbar klein), ihre Größen UNTEREINANDER
 *    bleiben aber im echten Verhältnis. "Kompakt" staucht die Abstände
 *    (innen Wurzel-, außen lineare Skala) wie bisher, damit alles auf
 *    einmal sichtbar ist.
 *
 * Maussteuerung: Ziehen dreht die Ansicht und neigt sie (von oben bis fast
 * von der Seite), Scrollen/Pinch zoomt.
 */
type ScaleMode = "compact" | "real";
// Tage pro Sekunde; 0 = Pause (nötig bei starkem Zoom, sonst fliegt der
// Planet in Sekundenbruchteilen aus dem Bild)
// LIVE = echte Zeit (1 Sekunde = 1 Sekunde); Nutzerwunsch 01.10.2026
// ("realistischer mit Live-Bewegung") → Standard beim Öffnen.
const LIVE = 1 / 86400;
const SPEEDS = [0, LIVE, 1, 10, 100, 1000] as const;
const DEFAULT_SPEED_INDEX = 1;
const KM_PER_AU = 149597870.7;
const LIGHT_KM_PER_MIN = 299792.458 * 60;

export default function SolarSystem({
  mode = "full",
  onSelectPlanet,
  selectedId,
  className = "",
}: SolarSystemProps) {
  const { lang, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dateLabelRef = useRef<HTMLSpanElement>(null);
  const drawnRef = useRef<DrawnPlanet[]>([]);
  const rafRef = useRef<number>(0);
  const [size, setSize] = useState({ w: 300, h: 300 });

  const interactive = mode === "full";
  const bodies = useMemo(() => (mode === "compact" ? PLANETS : ALL_BODIES), [mode]);

  // Simulierte Zeit (Julianisches Datum) — startet bei "jetzt".
  const jdRef = useRef(dateToJd(new Date()));
  const [scaleMode, setScaleMode] = useState<ScaleMode>("compact");
  const [speedIndex, setSpeedIndex] = useState(DEFAULT_SPEED_INDEX);
  const speedRef = useRef<number>(SPEEDS[DEFAULT_SPEED_INDEX]);
  useEffect(() => {
    speedRef.current = SPEEDS[speedIndex];
  }, [speedIndex]);

  // Live-Abstände zur Erde + nächste größte Annäherung (Nutzerwunsch
  // 01.10.2026: "ich will wissen, wann Mars nah wird"). Abstände jede
  // Sekunde neu, die (teurere) Annäherungs-Suche nur, wenn sich das
  // angezeigte Datum um mehr als einen Tag geändert hat.
  const [showDistances, setShowDistances] = useState(false);
  const [distanceRows, setDistanceRows] = useState<
    { planet: PlanetData; nowKm: number; next: { jd: number; au: number } | null }[]
  >([]);
  const approachCacheRef = useRef<{ jd: number; map: Map<string, { jd: number; au: number } | null> } | null>(null);
  useEffect(() => {
    if (!showDistances) return;
    function update() {
      const jd = jdRef.current;
      let cache = approachCacheRef.current;
      if (!cache || Math.abs(cache.jd - jd) > 1) {
        const map = new Map<string, { jd: number; au: number } | null>();
        for (const b of ALL_BODIES) {
          if (b.id !== "earth") map.set(b.id, b.kind === "probe" ? null : nextClosestApproach(b.id, jd));
        }
        cache = { jd, map };
        approachCacheRef.current = cache;
      }
      const rows = ALL_BODIES.filter((b) => b.id !== "earth").map((planet) => {
        const au = distanceAu(planet.id, "earth", jd) ?? 0;
        const next = cache!.map.get(planet.id) ?? null;
        // vergangene Annäherungen (bei schnellem Zeitraffer) nicht anzeigen
        return { planet, nowKm: au * KM_PER_AU, next: next && next.jd >= jd ? next : null };
      });
      setDistanceRows(rows);
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [showDistances]);
  const numFmt = useMemo(() => new Intl.NumberFormat(lang, { maximumFractionDigits: 1, minimumFractionDigits: 1 }), [lang]);
  const lightFmt = useMemo(() => new Intl.NumberFormat(lang, { maximumFractionDigits: 1 }), [lang]);
  const shortDateFmt = useMemo(
    () => new Intl.DateTimeFormat(lang, { year: "numeric", month: "short", day: "numeric" }),
    [lang]
  );

  // Bahnellipsen einmalig als 3D-Punktfolgen (AE) vorberechnen.
  const orbitPaths = useMemo(() => {
    const m = new Map<string, Vec3[]>();
    for (const b of bodies) if (b.kind !== "probe") m.set(b.id, orbitPath(b.id));
    return m;
  }, [bodies]);

  // Kamera-Zustand als Ref statt State: wird pro Frame im rAF-Loop gelesen,
  // ein Re-Render pro Mausbewegung wäre unnötig teuer.
  const zoomRef = useRef(1);
  const rotateRef = useRef(0); // zusätzliche Drehung der Ansicht (Radiant)
  const tiltRef = useRef(0.94); // 1 = senkrecht von oben, 0.22 = fast von der Seite
  const dragRef = useRef<{ x: number; y: number; dragged: boolean; pan: boolean; t: number } | null>(null);
  const stepMotionRef = useRef<(dtMs: number) => void>(() => {});
  // Nutzerwunsch 20.09.2026 ("man kann auch nicht zoomen"): Wheel (Desktop)
  // reicht nicht — auf dem Handy braucht es Pinch-Zoom über zwei Touch-Punkte.
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStartDistRef = useRef<number | null>(null);
  const pinchStartZoomRef = useRef(1);
  // Nutzerwunsch 29.09.2026 ("man sollte mehr zoomen können"): deutlich
  // höhere Grenzen + Zoom auf den Punkt unter Maus/Fingern statt immer auf
  // die Sonne (panRef = Verschiebung der Sonne gegenüber der Bildmitte).
  const zoomLimitsRef = useRef<[number, number]>([0.5, 60]);
  const panRef = useRef({ x: 0, y: 0 });
  const pinchCenterRef = useRef<{ x: number; y: number } | null>(null);
  // Angeklickten Körper mitverfolgen — aus, sobald man selbst verschiebt
  const followRef = useRef(true);
  useEffect(() => {
    followRef.current = true;
  }, [selectedId]);

  // Sehr wenige, sehr dezente Hintergrundsterne (Nutzerwunsch: "sterne im
  // hintergrund soll kaum sehbar sein") — fest generiert, kein Funkeln,
  // damit sie nicht von den Planeten ablenken.
  const stars = useMemo(
    () =>
      Array.from({ length: mode === "compact" ? 25 : 90 }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() < 0.85 ? 0.6 : 1,
        a: 0.08 + Math.random() * 0.14,
      })),
    [mode]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize({ w: Math.max(1, width), h: Math.max(1, height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Beim Umschalten des Maßstabs Zoom zurücksetzen und Zoom-Grenzen anpassen
  // (im echten Maßstab muss man sehr weit reinzoomen können, um Merkur bis
  // Mars überhaupt getrennt zu sehen).
  useEffect(() => {
    zoomRef.current = 1;
    panRef.current = { x: 0, y: 0 };
    zoomLimitsRef.current = scaleMode === "real" ? [0.15, 100000] : [0.5, 60];
  }, [scaleMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;
    const ctx = ctx2d;

    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    canvas.width = size.w * dpr;
    canvas.height = size.h * dpr;
    canvas.style.width = `${size.w}px`;
    canvas.style.height = `${size.h}px`;
    ctx.scale(dpr, dpr);

    const smallCanvas = size.w < 420;
    const pad = mode === "compact" ? 4 : smallCanvas ? 18 : 26;
    const baseMaxOrbitR = Math.min(size.w, size.h) / 2 - pad;
    const compactSunR = mode === "compact" ? 7 : smallCanvas ? 13 : 19;
    const realMode = scaleMode === "real" && interactive;

    // --- Kompakt-Skala (wie bisher): innen Wurzel, jenseits Neptun linear ---
    const NEPTUNE_AU = 30.05;
    const MIN_AU_SQRT = Math.sqrt(0.3); // ≈ Merkurs Perihel
    const INNER_FRACTION = 0.42;
    const OUTER_MAX_AU = mode === "compact" ? NEPTUNE_AU : 175; // ≈ Voyager 1
    function compactRadius(rAu: number, maxOrbitR: number): number {
      let t: number;
      if (rAu <= NEPTUNE_AU || mode === "compact") {
        t =
          (Math.max(0, Math.sqrt(rAu) - MIN_AU_SQRT) / (Math.sqrt(NEPTUNE_AU) - MIN_AU_SQRT)) *
          (mode === "compact" ? 1 : INNER_FRACTION);
      } else {
        t = INNER_FRACTION + ((rAu - NEPTUNE_AU) / (OUTER_MAX_AU - NEPTUNE_AU)) * (1 - INNER_FRACTION);
      }
      // Bahnradien wachsen exakt proportional zum Zoom (die Sonne bleibt
      // gleich groß) — nur so bleibt beim Zoomen der Punkt unter der Maus
      // wirklich an seiner Stelle.
      const zoomNow = maxOrbitR / baseMaxOrbitR;
      // Merkurs Bahn beginnt erst bei ~2,5 Sonnenradien — sonst wirkt die
      // Sonne in der Schrägansicht so groß, dass die inneren Planeten
      // ständig vor/hinter ihr durchlaufen (Nutzerkorrektur 29.09.2026).
      const inner = compactSunR * 2 + 14;
      return zoomNow * (inner + t * (baseMaxOrbitR - inner));
    }

    // Größen — Nutzerwunsch 29.09.2026 ("wenn man zoomt, soll die Größe der
    // Planeten im Vergleich zur Sonne realistisch sein"): Sonne und Planeten
    // teilen sich EINEN Größenmaßstab (Durchmesser in km × Pixel pro km).
    //  - Kompakt: in der Gesamtansicht sind die Planeten gegenüber der Sonne
    //    noch vergrößert (sonst wären Erde & Co. unsichtbar), dieser Faktor
    //    schrumpft beim Reinzoomen und ist ab 3× Zoom exakt 1 — dann stimmt
    //    das Verhältnis zur Sonne (Jupiter = 1/10, Erde = 1/109).
    //  - Echter Maßstab: alles exakt — Abstände, Sonne und Planeten.
    // Zu kleine Körper werden als Mindest-Punkt gezeichnet, damit man sie
    // überhaupt findet.
    const SUN_KM = 1392700;
    const KM_PER_AU = 149597870.7;
    // Nutzerkorrektur 29.09.2026 ("wieso sehen Planeten größer als die Sonne
    // aus"): mit Faktor 8 war Jupiter in der Gesamtansicht fast so groß wie
    // die Sonne. Jetzt nur noch ×3 — die Sonne bleibt klar am größten, ab 3×
    // Zoom stimmt das Verhältnis exakt.
    const OVERVIEW_ENLARGE = 3;
    const minDot = mode === "compact" ? 0.9 : smallCanvas ? 1.3 : 1.6;

    let lastTime = performance.now();
    const followStart = performance.now();
    let lastDateKey = "";
    const dateFmt = new Intl.DateTimeFormat(lang, { year: "numeric", month: "short", day: "numeric" });
    const dateTimeFmt = new Intl.DateTimeFormat(lang, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    function draw(now: number) {
      const dtMs = Math.min(100, now - lastTime);
      lastTime = now;
      if (speedRef.current === LIVE) {
        // Live: exakt die echte Uhrzeit, keine aufsummierte Abweichung
        jdRef.current = dateToJd(new Date());
      } else {
        jdRef.current += (speedRef.current * dtMs) / 1000;
      }
      stepMotionRef.current(dtMs);
      const jd = jdRef.current;

      if (dateLabelRef.current) {
        const live = speedRef.current === LIVE;
        const key = live ? Math.floor(jd * 86400).toString() : Math.floor(jd).toString();
        if (key !== lastDateKey) {
          lastDateKey = key;
          dateLabelRef.current.textContent = (live ? dateTimeFmt : dateFmt).format(jdToDate(jd));
        }
      }

      // Sonne = Bildmitte + Verschiebung (beim Zoomen auf einen Punkt)
      let cx = size.w / 2 + panRef.current.x;
      let cy = size.h / 2 + panRef.current.y;
      const zoom = zoomRef.current;
      const maxOrbitR = baseMaxOrbitR * zoom;
      const tilt = tiltRef.current;
      const side = Math.sqrt(Math.max(0, 1 - tilt * tilt));
      const rot = rotateRef.current;
      const cosR = Math.cos(rot);
      const sinR = Math.sin(rot);

      // Echter Maßstab: Neptuns Bahn füllt bei Zoom 1 den Rahmen.
      const pxPerAu = maxOrbitR / 30.4;
      const sunR = realMode ? Math.max(2.5, SUN_RADIUS_AU * pxPerAu) : compactSunR * zoom;
      function project(p: Vec3): [number, number] {
        let k: number;
        if (realMode) {
          k = pxPerAu;
        } else {
          const r = Math.hypot(p[0], p[1], p[2]) || 1e-9;
          k = compactRadius(r, maxOrbitR) / r;
        }
        const X = p[0] * k;
        const Y = p[1] * k;
        const Z = p[2] * k;
        const xr = X * cosR - Y * sinR;
        const yr = X * sinR + Y * cosR;
        // Blick von "Norden": Umlauf gegen den Uhrzeigersinn wie in echt.
        return [cx + xr, cy - yr * tilt - Z * side];
      }

      /** Entfernung von der Kamera relativ zur Sonne (> 0 = hinter der Sonne). */
      function depthOf(p: Vec3): number {
        const yr = p[0] * sinR + p[1] * cosR;
        return yr * side - p[2] * tilt;
      }

      function bodyRadius(planet: PlanetData): number {
        if (realMode) {
          return Math.max(minDot, (planet.diameterKm / 2 / KM_PER_AU) * pxPerAu);
        }
        const enlarge = Math.max(1, OVERVIEW_ENLARGE / zoom);
        return Math.max(minDot, sunR * (planet.diameterKm / SUN_KM) * enlarge);
      }

      // Angeklickten Körper beim Zoomen in der Bildmitte halten ("mitfliegen"),
      // damit man z.B. die Erde neben der Sonne in echter Größe ansehen
      // kann, ohne dass sie aus dem Bild läuft.
      if (interactive && selectedId && zoom > 1.5 && followRef.current) {
        const fp: Vec3 | null = selectedId === "sun" ? [0, 0, 0] : bodyPosition(selectedId, jd);
        if (fp) {
          const [sx, sy] = project(fp);
          const f = now - followStart < 600 ? 0.15 : 1;
          panRef.current = {
            x: panRef.current.x + (size.w / 2 - sx) * f,
            y: panRef.current.y + (size.h / 2 - sy) * f,
          };
          cx = size.w / 2 + panRef.current.x;
          cy = size.h / 2 + panRef.current.y;
        }
      }

      ctx.clearRect(0, 0, size.w, size.h);

      // Hintergrundsterne
      ctx.save();
      for (const s of stars) {
        ctx.globalAlpha = s.a;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(s.x * size.w, s.y * size.h, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Sonne (mit Glühen) — wird erst in der Tiefen-Reihenfolge unten
      // gezeichnet, damit Planeten HINTER der Sonne verdeckt werden und
      // Planeten DAVOR sie verdecken (Nutzerkorrektur 29.09.2026: "wieso
      // laufen Planeten über die Sonne").
      function drawSun() {
        const glowR = sunR + Math.max(10, Math.min(sunR * 2.2, 60));
        const sunGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
        sunGlow.addColorStop(0, "rgba(255,196,110,0.55)");
        sunGlow.addColorStop(1, "rgba(255,196,110,0)");
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
        ctx.fill();

        const sunBody = ctx.createRadialGradient(cx - sunR * 0.3, cy - sunR * 0.3, sunR * 0.1, cx, cy, sunR);
        sunBody.addColorStop(0, "#fff3d6");
        sunBody.addColorStop(0.5, "#ffcf6b");
        sunBody.addColorStop(1, "#ff9a3c");
        ctx.fillStyle = sunBody;
        ctx.beginPath();
        ctx.arc(cx, cy, sunR, 0, Math.PI * 2);
        ctx.fill();
      }

      const drawn: DrawnPlanet[] = [];
      if (interactive) {
        drawn.push({ planet: SUN, x: cx, y: cy, r: Math.max(sunR, 8) });
      }

      // Nutzerwunsch 20.09.2026 ("bei mobile ansicht ist alles dicht"):
      // Auf schmalen Canvas-Breiten kleinere Schrift + Labels, die sich zu
      // nah kämen, werden übersprungen (der Punkt bleibt aber sichtbar).
      const minLabelGap = smallCanvas ? 24 : 15;
      const labelRects: { x: number; y: number }[] = [];
      function drawLabel(text: string, x: number, y: number, color: string, font: string, force = false) {
        if (x < -40 || x > size.w + 40 || y < -20 || y > size.h + 20) return;
        if (!force) {
          for (const r of labelRects) {
            if (Math.abs(r.x - x) < minLabelGap && Math.abs(r.y - y) < 11) return;
          }
        }
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.fillText(text, x, y);
        labelRects.push({ x, y });
      }

      // 1) Alle Bahnlinien zuerst (echte Ellipsen, 3D-geneigt)
      for (const planet of bodies) {
        const path = orbitPaths.get(planet.id);
        if (!path || path.length < 2) continue;
        const isDwarf = planet.kind === "dwarf";
        ctx.beginPath();
        if (realMode) {
          // Im echten Maßstab ist die Projektion linear → die Bahn ist eine
          // exakte Ellipse. Als echte Kurve gezeichnet (statt Streckenzug),
          // damit sie auch bei extremem Zoom genau durch den Planeten läuft.
          const n = path.length - 1; // Punkte bei E = 0, π/2, π (Segmente durch 4 teilbar)
          const p0 = project(path[0]);
          const pHalf = project(path[n / 2]);
          const pQuarter = project(path[n / 4]);
          const c: [number, number] = [(p0[0] + pHalf[0]) / 2, (p0[1] + pHalf[1]) / 2];
          ctx.save();
          ctx.transform(p0[0] - c[0], p0[1] - c[1], pQuarter[0] - c[0], pQuarter[1] - c[1], c[0], c[1]);
          ctx.arc(0, 0, 1, 0, Math.PI * 2);
          ctx.restore();
        } else {
          path.forEach((p, k) => {
            const [x, y] = project(p);
            if (k === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
        }
        if (isDwarf) {
          ctx.setLineDash([2, 3]);
          ctx.strokeStyle = "rgba(255,255,255,0.08)";
        } else {
          ctx.setLineDash([]);
          ctx.strokeStyle = "rgba(255,255,255,0.12)";
        }
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // 2) Himmelskörper an ihrer echten Position zum simulierten Datum,
      //    von hinten nach vorne gezeichnet (Sonne an ihrer Tiefe dazwischen)
      const items: { planet: PlanetData; pos: Vec3; depth: number }[] = [];
      for (const planet of bodies) {
        const pos = bodyPosition(planet.id, jd);
        if (pos) items.push({ planet, pos, depth: depthOf(pos) });
      }
      items.sort((a, b) => b.depth - a.depth);
      let sunDrawn = false;
      for (const { planet, pos, depth } of items) {
        if (!sunDrawn && depth <= 0) {
          drawSun();
          sunDrawn = true;
        }
        const isDwarf = planet.kind === "dwarf";
        const isProbe = planet.kind === "probe";
        const [x, y] = project(pos);

        if (isProbe) {
          // Sonde: fliegt geradlinig hinaus, gestrichelte Linie von der Sonne.
          const pr = 3;
          ctx.save();
          ctx.setLineDash([3, 4]);
          ctx.strokeStyle = "rgba(255,255,255,0.25)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.restore();

          const isSelectedProbe = interactive && selectedId === planet.id;
          if (isSelectedProbe) {
            ctx.beginPath();
            ctx.arc(x, y, pr + 6, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(255,90,77,0.9)";
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = planet.color;
          ctx.fillRect(-pr, -pr, pr * 2, pr * 2);
          ctx.restore();

          if (mode === "full") {
            drawLabel(
              localize(planet.name, lang),
              x,
              y - pr - 6,
              isSelectedProbe ? "#ff5a4d" : "rgba(242,242,240,0.65)",
              smallCanvas ? "8px var(--font-mono, monospace)" : "9px var(--font-mono, monospace)",
              true
            );
          }

          drawn.push({ planet, x, y, r: pr + 4 });
          continue;
        }

        const pr = bodyRadius(planet);
        drawn.push({ planet, x, y, r: pr });

        const isSelected = interactive && selectedId === planet.id;

        // Saturn-Ringe (Ringebene ~27° gegen die Bahn geneigt)
        if (planet.hasRings) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(-0.35);
          ctx.strokeStyle = "rgba(227,209,163,0.55)";
          ctx.lineWidth = mode === "compact" ? 1 : Math.max(1, pr * 0.25);
          ctx.beginPath();
          ctx.ellipse(0, 0, pr * 2.1, pr * 0.75, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        if (isSelected) {
          ctx.beginPath();
          ctx.arc(x, y, pr + 5, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255,90,77,0.9)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        ctx.globalAlpha = isDwarf ? 0.85 : 1;
        // dezenter Schein, damit er den Planeten nicht optisch aufbläht
        const glowMult = 1.6;
        const glowR = Math.max(pr * glowMult, 3);
        const glow = ctx.createRadialGradient(x, y, 0, x, y, glowR);
        glow.addColorStop(0, planet.glowColor);
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, glowR, 0, Math.PI * 2);
        ctx.fill();

        // Tag-/Nachtseite: zur Sonne hin hell, abgewandt dunkler
        const toSunX = cx - x;
        const toSunY = cy - y;
        const len = Math.hypot(toSunX, toSunY) || 1;
        const lit = ctx.createRadialGradient(
          x + (toSunX / len) * pr * 0.45,
          y + (toSunY / len) * pr * 0.45,
          pr * 0.1,
          x,
          y,
          pr * 1.05
        );
        lit.addColorStop(0, planet.color);
        lit.addColorStop(0.7, planet.color);
        lit.addColorStop(1, "rgba(0,0,0,0.85)");
        ctx.fillStyle = pr >= 3 ? lit : planet.color;
        ctx.beginPath();
        ctx.arc(x, y, pr, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        if (mode === "full") {
          const font = isDwarf
            ? smallCanvas
              ? "7px var(--font-mono, monospace)"
              : "9px var(--font-mono, monospace)"
            : smallCanvas
              ? "8px var(--font-mono, monospace)"
              : "10px var(--font-mono, monospace)";
          const color = isSelected
            ? "#ff5a4d"
            : isDwarf
              ? "rgba(242,242,240,0.5)"
              : "rgba(242,242,240,0.75)";
          drawLabel(localize(planet.name, lang), x, y - pr - 6, color, font, isSelected);
        }
      }
      if (!sunDrawn) drawSun();

      drawnRef.current = drawn;
      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, mode, selectedId, stars, bodies, interactive, lang, scaleMode, orbitPaths]);

  // ------------------------------------------------------------------
  // Steuerung wie in 3D-Apps/Spielen (Nutzerwunsch 30.09.2026: "wie in
  // einem Videospiel … als ob man ein 3D-Objekt bewegt"):
  //  - 1 Finger / linke Maustaste: Orbit (drehen + neigen), mit Schwung —
  //    nach dem Loslassen dreht die Ansicht sanft aus.
  //  - 2 Finger: Pinch = Zoom um die Fingermitte, gemeinsam bewegen =
  //    verschieben, Finger drehen = Ansicht drehen (alles gleichzeitig).
  //  - Mausrad / +/−: weicher Zoom auf den Mauszeiger.
  //  - Rechte Maustaste oder Shift + Ziehen: verschieben.
  //  - Doppeltippen / Doppelklick: auf die Stelle heranzoomen.
  // ------------------------------------------------------------------
  const velRef = useRef({ rot: 0, tilt: 0 }); // rad pro ms (Schwung)
  const zoomGoalRef = useRef<{ z: number; x: number; y: number } | null>(null);
  const pinchAngleRef = useRef<number | null>(null);
  const lastTapRef = useRef<{ t: number; x: number; y: number } | null>(null);
  const TILT_MIN = 0.06;

  /** Wird in jedem Frame aus der Zeichenschleife aufgerufen. */
  function stepMotion(dtMs: number) {
    const dragging = dragRef.current !== null || pointersRef.current.size > 0;
    const v = velRef.current;
    if (!dragging && (Math.abs(v.rot) > 1e-6 || Math.abs(v.tilt) > 1e-6)) {
      rotateRef.current += v.rot * dtMs;
      tiltRef.current = Math.min(1, Math.max(TILT_MIN, tiltRef.current + v.tilt * dtMs));
      const decay = Math.exp(-dtMs / 320);
      v.rot *= decay;
      v.tilt *= decay;
    }
    const goal = zoomGoalRef.current;
    if (goal) {
      const f = 1 - Math.exp(-dtMs / 90);
      const next = zoomRef.current * Math.pow(goal.z / zoomRef.current, f);
      zoomAt(next, goal.x, goal.y);
      if (Math.abs(Math.log(goal.z / zoomRef.current)) < 0.002) zoomGoalRef.current = null;
    }
  }
  stepMotionRef.current = stepMotion;

  function smoothZoom(factor: number, clientX: number, clientY: number) {
    const [zMin, zMax] = zoomLimitsRef.current;
    const base = zoomGoalRef.current ? zoomGoalRef.current.z : zoomRef.current;
    zoomGoalRef.current = { z: Math.min(zMax, Math.max(zMin, base * factor)), x: clientX, y: clientY };
  }

  function startPinch() {
    const pts = Array.from(pointersRef.current.values());
    pinchStartDistRef.current = Math.max(1, Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y));
    pinchStartZoomRef.current = zoomRef.current;
    pinchCenterRef.current = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
    pinchAngleRef.current = Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x);
  }

  function handlePointerDown(e: PointerEvent<HTMLCanvasElement>) {
    if (!interactive) return;
    canvasRef.current?.setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    velRef.current = { rot: 0, tilt: 0 };
    zoomGoalRef.current = null;

    if (pointersRef.current.size >= 2) {
      // Zweiter Finger → Pinch/Drehen/Verschieben statt Orbit
      dragRef.current = null;
      startPinch();
    } else {
      const pan = e.button === 2 || e.shiftKey;
      dragRef.current = { x: e.clientX, y: e.clientY, dragged: false, pan, t: performance.now() };
    }
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
  }

  function handlePointerMove(e: PointerEvent<HTMLCanvasElement>) {
    if (!interactive) return;
    if (pointersRef.current.has(e.pointerId)) {
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    if (pointersRef.current.size >= 2 && pinchStartDistRef.current) {
      const pts = Array.from(pointersRef.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
      // 1) Zoom um die aktuelle Fingermitte
      zoomAt(pinchStartZoomRef.current * (dist / pinchStartDistRef.current), mid.x, mid.y);
      // 2) Verschieben mit beiden Fingern
      const prev = pinchCenterRef.current;
      if (prev) {
        panRef.current = {
          x: panRef.current.x + (mid.x - prev.x),
          y: panRef.current.y + (mid.y - prev.y),
        };
        if (Math.hypot(mid.x - prev.x, mid.y - prev.y) > 0.5) followRef.current = false;
      }
      pinchCenterRef.current = mid;
      // 3) Drehen mit zwei Fingern (um die Fingermitte)
      const ang = Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x);
      if (pinchAngleRef.current !== null) {
        let d = ang - pinchAngleRef.current;
        if (d > Math.PI) d -= Math.PI * 2;
        if (d < -Math.PI) d += Math.PI * 2;
        if (Math.abs(d) > 0.002) {
          rotateRef.current -= d;
          const rect = canvasRef.current?.getBoundingClientRect();
          if (rect) {
            const mx = mid.x - rect.left - rect.width / 2;
            const my = mid.y - rect.top - rect.height / 2;
            const vx = panRef.current.x - mx;
            const vy = panRef.current.y - my;
            const c = Math.cos(d);
            const s = Math.sin(d);
            panRef.current = { x: mx + vx * c - vy * s, y: my + vx * s + vy * c };
          }
        }
      }
      pinchAngleRef.current = ang;
      return;
    }

    const drag = dragRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) drag.dragged = true;
    const now = performance.now();
    const dt = Math.max(1, now - drag.t);
    if (drag.pan) {
      panRef.current = { x: panRef.current.x + dx, y: panRef.current.y + dy };
      followRef.current = false;
    } else {
      // Nutzerwunsch 29.09.2026 ("Sensitivity zu hoch"): gedämpfte Werte
      const dRot = dx * 0.003;
      const dTilt = -dy * 0.0015;
      rotateRef.current += dRot;
      tiltRef.current = Math.min(1, Math.max(TILT_MIN, tiltRef.current + dTilt));
      // Schwung aus den letzten Bewegungen (geglättet)
      velRef.current = {
        rot: velRef.current.rot * 0.6 + (dRot / dt) * 0.4,
        tilt: velRef.current.tilt * 0.6 + (dTilt / dt) * 0.4,
      };
    }
    drag.x = e.clientX;
    drag.y = e.clientY;
    drag.t = now;
  }

  function handlePointerUp(e: PointerEvent<HTMLCanvasElement>) {
    if (!interactive) return;
    try {
      canvasRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* Pointer war nicht (mehr) gefangen — egal */
    }
    const wasTracked = pointersRef.current.delete(e.pointerId);
    // pointerleave/-cancel NACH pointerup (bei Touch normal) nicht nochmal
    // auswerten — sonst würde der Schwung sofort wieder genullt.
    if (!wasTracked) return;

    if (pointersRef.current.size < 2) {
      pinchStartDistRef.current = null;
      pinchCenterRef.current = null;
      pinchAngleRef.current = null;
    }

    if (pointersRef.current.size === 0) {
      if (canvasRef.current) canvasRef.current.style.cursor = "grab";
      const drag = dragRef.current;
      // Kein Schwung, wenn der Finger vor dem Loslassen stillstand
      if (!drag || performance.now() - drag.t > 80) velRef.current = { rot: 0, tilt: 0 };
      // Tippen/Klicken ohne Ziehen: auswählen, Doppeltippen: heranzoomen
      if (drag && !drag.dragged) {
        selectFromPoint(e.clientX, e.clientY);
        const now = performance.now();
        const last = lastTapRef.current;
        if (last && now - last.t < 320 && Math.hypot(last.x - e.clientX, last.y - e.clientY) < 30) {
          smoothZoom(2.5, e.clientX, e.clientY);
          lastTapRef.current = null;
        } else {
          lastTapRef.current = { t: now, x: e.clientX, y: e.clientY };
        }
      }
      dragRef.current = null;
    } else if (pointersRef.current.size === 1) {
      // Nach dem Pinch bleibt ein Finger übrig — Orbit neu ansetzen,
      // ohne dass es als Klick zählt und ohne Sprung.
      const remaining = Array.from(pointersRef.current.values())[0];
      dragRef.current = { x: remaining.x, y: remaining.y, dragged: true, pan: false, t: performance.now() };
      velRef.current = { rot: 0, tilt: 0 };
    }
  }

  // Wheel als nativer Listener mit passive:false — Reacts onWheel ist
  // passiv, preventDefault() wurde dort ignoriert und die Seite scrollte
  // beim Zoomen mit (29.09.2026 im Test gefunden).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !interactive) return;
    const onWheel = (e: globalThis.WheelEvent) => handleWheel(e);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive]);

  function handleWheel(e: globalThis.WheelEvent) {
    if (!interactive) return;
    e.preventDefault();
    // ~10 % pro Mausrad-Raste, weich animiert; Touchpad-Pinch (ctrlKey) feiner
    const k = e.ctrlKey ? 0.01 : 0.001;
    const factor = Math.exp(-Math.max(-100, Math.min(100, e.deltaY)) * k);
    smoothZoom(factor, e.clientX, e.clientY);
  }

  /** Zoomt so, dass der Punkt unter (clientX, clientY) an seiner Stelle bleibt. */
  function zoomAt(targetZoom: number, clientX: number, clientY: number) {
    const [zMin, zMax] = zoomLimitsRef.current;
    const oldZoom = zoomRef.current;
    const newZoom = Math.min(zMax, Math.max(zMin, targetZoom));
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const px = clientX - rect.left - rect.width / 2;
      const py = clientY - rect.top - rect.height / 2;
      const k = newZoom / oldZoom;
      panRef.current = {
        x: px - (px - panRef.current.x) * k,
        y: py - (py - panRef.current.y) * k,
      };
      // Ganz herausgezoomt: Sonne sanft zurück in die Mitte
      if (newZoom <= 1) {
        panRef.current = { x: panRef.current.x * 0.85, y: panRef.current.y * 0.85 };
      }
    }
    zoomRef.current = newZoom;
  }

  function zoomByButton(factor: number) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    smoothZoom(factor, rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  function selectFromPoint(clientX: number, clientY: number) {
    if (!onSelectPlanet) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    let closest: DrawnPlanet | null = null;
    let closestDist = Infinity;
    for (const d of drawnRef.current) {
      const dist = Math.hypot(d.x - x, d.y - y);
      const hitR = d.r + 10;
      if (dist <= hitR && dist < closestDist) {
        closest = d;
        closestDist = dist;
      }
    }
    onSelectPlanet(closest ? closest.planet : null);
  }

  return (
    <div ref={containerRef} className={`relative h-full w-full ${className}`}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        // Bricht der Browser eine Touch-Geste ab (pointercancel), blieben
        // Finger sonst als "noch aufgelegt" hängen → Pinch spielte verrückt.
        onPointerCancel={handlePointerUp}
        onContextMenu={(e) => e.preventDefault()}
        className={interactive ? "cursor-grab touch-none" : ""}
        aria-label={t("solarSystemVisAria")}
      />
      {interactive && showDistances && (
        <div className="absolute inset-x-2 top-2 z-10 max-h-[55%] overflow-y-auto border border-border bg-background/90 p-3 backdrop-blur-sm sm:left-auto sm:right-3 sm:top-3 sm:w-[25rem]">
          <p className="label-mono text-[10px] uppercase text-accent">{t("solarDistances")}</p>
          <table className="mt-2 w-full border-collapse text-left text-[11px]">
            <thead>
              <tr className="label-mono text-[9px] uppercase text-muted">
                <th className="pb-1 pr-2 font-normal" />
                <th className="pb-1 pr-2 font-normal">{t("solarNow")}</th>
                <th className="pb-1 font-normal">{t("solarNextClosest")}</th>
              </tr>
            </thead>
            <tbody>
              {distanceRows.map((row) => (
                <tr
                  key={row.planet.id}
                  className={`cursor-pointer border-t border-border/60 align-top hover:bg-accent/10 ${
                    selectedId === row.planet.id ? "text-accent" : "text-foreground"
                  }`}
                  onClick={() => onSelectPlanet?.(row.planet)}
                >
                  <td className="py-1 pr-2">
                    <span className="mr-1.5 inline-block h-2 w-2 rounded-full" style={{ background: row.planet.color }} />
                    {localize(row.planet.name, lang)}
                  </td>
                  <td className="py-1 pr-2 tabular-nums">
                    {numFmt.format(row.nowKm / 1e6)} {t("solarMillionKm")}
                    <span className="block text-[9px] text-muted">
                      {lightFmt.format(row.nowKm / LIGHT_KM_PER_MIN)} {t("solarLightMinutes")}
                    </span>
                  </td>
                  <td className="py-1 tabular-nums">
                    {row.next ? (
                      <>
                        {shortDateFmt.format(jdToDate(row.next.jd))}
                        <span className="block text-[9px] text-muted">
                          {numFmt.format((row.next.au * KM_PER_AU) / 1e6)} {t("solarMillionKm")}
                        </span>
                      </>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-[9px] text-muted">{t("solarDistanceNote")}</p>
        </div>
      )}
      {interactive && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-2 p-2 sm:p-3">
          <div className="label-mono text-[10px] uppercase text-muted">
            <span ref={dateLabelRef} className="text-foreground" />
            <span className="block text-[9px] normal-case opacity-70">
              {scaleMode === "real" ? t("solarScaleRealNote") : t("solarScaleCompactNote")}
            </span>
          </div>
          <div className="pointer-events-auto flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => zoomByButton(1 / 1.8)}
              aria-label="−"
              className="label-mono border border-border bg-background/80 whitespace-nowrap px-2 py-1 text-[10px] uppercase text-muted transition-colors hover:border-accent hover:text-accent"
            >
              −
            </button>
            <button
              type="button"
              onClick={() => zoomByButton(1.8)}
              aria-label="+"
              className="label-mono border border-border bg-background/80 whitespace-nowrap px-2 py-1 text-[10px] uppercase text-muted transition-colors hover:border-accent hover:text-accent"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => {
                jdRef.current = dateToJd(new Date());
              }}
              className="label-mono border border-border bg-background/80 whitespace-nowrap px-2 py-1 text-[10px] uppercase text-muted transition-colors hover:border-accent hover:text-accent"
            >
              {t("solarToday")}
            </button>
            <button
              type="button"
              onClick={() => setSpeedIndex((i) => (i + 1) % SPEEDS.length)}
              className="label-mono border border-border bg-background/80 whitespace-nowrap px-2 py-1 text-[10px] uppercase text-muted transition-colors hover:border-accent hover:text-accent"
            >
              {SPEEDS[speedIndex] === 0
                ? "❚❚"
                : SPEEDS[speedIndex] === LIVE
                  ? `● ${t("solarLive")}`
                  : `${SPEEDS[speedIndex]} ${t("solarDaysPerSecond")}`}
            </button>
            <button
              type="button"
              onClick={() => setShowDistances((v) => !v)}
              aria-pressed={showDistances}
              className={`label-mono border whitespace-nowrap px-2 py-1 text-[10px] uppercase transition-colors ${
                showDistances
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border bg-background/80 text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {t("solarDistances")}
            </button>
            <button
              type="button"
              onClick={() => setScaleMode((m) => (m === "real" ? "compact" : "real"))}
              aria-pressed={scaleMode === "real"}
              className={`label-mono border whitespace-nowrap px-2 py-1 text-[10px] uppercase transition-colors ${
                scaleMode === "real"
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border bg-background/80 text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {scaleMode === "real" ? t("solarScaleCompact") : t("solarScaleReal")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
