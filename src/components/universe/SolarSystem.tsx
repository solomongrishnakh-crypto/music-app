"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { PLANETS, ALL_BODIES, SUN, type PlanetData } from "@/data/solarSystem";
import { useLanguage } from "@/contexts/LanguageContext";
import { localize } from "@/lib/i18n";
import { bodyPosition, dateToJd, jdToDate, orbitPath, SUN_RADIUS_AU, type Vec3 } from "@/lib/astro/orbits";

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
const SPEEDS = [1, 10, 100, 1000] as const; // Tage pro Sekunde
const DEFAULT_SPEED_INDEX = 1;

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
  const dragRef = useRef<{ x: number; y: number; dragged: boolean } | null>(null);
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
    zoomLimitsRef.current = scaleMode === "real" ? [0.15, 3000] : [0.5, 60];
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
    const compactSunR = mode === "compact" ? 6 : smallCanvas ? 11 : 16;
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
      return zoomNow * (compactSunR + 10 + t * (baseMaxOrbitR - compactSunR - 10));
    }

    // Größen (Durchmesser in km) — "kompakt": gemäßigt gestaucht
    // (Exponent 0.6 statt der alten Wurzel, Jupiter wirkt dadurch deutlich
    // größer als die Erde, wie in echt ~11×).
    const EARTH_KM = 12742;
    const JUPITER_KM = 139820;
    function compactPlanetRadius(diameterKm: number): number {
      const base = mode === "compact" ? 1.1 : smallCanvas ? 2.2 : 3.1;
      return Math.max(mode === "compact" ? 0.9 : 1.2, base * Math.pow(diameterKm / EARTH_KM, 0.6));
    }

    let lastTime = performance.now();
    let lastDateKey = "";
    const dateFmt = new Intl.DateTimeFormat(lang, { year: "numeric", month: "short", day: "numeric" });

    function draw(now: number) {
      const dtMs = Math.min(100, now - lastTime);
      lastTime = now;
      jdRef.current += (speedRef.current * dtMs) / 1000;
      const jd = jdRef.current;

      if (dateLabelRef.current) {
        const key = Math.floor(jd).toString();
        if (key !== lastDateKey) {
          lastDateKey = key;
          dateLabelRef.current.textContent = dateFmt.format(jdToDate(jd));
        }
      }

      // Sonne = Bildmitte + Verschiebung (beim Zoomen auf einen Punkt)
      const cx = size.w / 2 + panRef.current.x;
      const cy = size.h / 2 + panRef.current.y;
      const zoom = zoomRef.current;
      const maxOrbitR = baseMaxOrbitR * zoom;
      const tilt = tiltRef.current;
      const side = Math.sqrt(Math.max(0, 1 - tilt * tilt));
      const rot = rotateRef.current;
      const cosR = Math.cos(rot);
      const sinR = Math.sin(rot);

      // Echter Maßstab: Neptuns Bahn füllt bei Zoom 1 den Rahmen.
      const pxPerAu = maxOrbitR / 30.4;
      const sunR = realMode ? Math.max(2.5, SUN_RADIUS_AU * pxPerAu) : compactSunR;
      // Planetengröße im echten Maßstab: echtes Verhältnis untereinander,
      // Jupiter wächst beim Reinzoomen mit (bis 40 px).
      const jupiterPx = Math.min(120, (smallCanvas ? 7 : 9) * Math.sqrt(zoom));

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

      function bodyRadius(planet: PlanetData): number {
        if (realMode) return Math.max(1.2, (planet.diameterKm / JUPITER_KM) * jupiterPx);
        // Beim Reinzoomen wachsen die Planeten mit (gedämpft), sonst blieben
        // sie auch bei 60× Zoom winzige Punkte.
        return Math.min(70, compactPlanetRadius(planet.diameterKm) * Math.sqrt(Math.max(1, zoom)));
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

      // Sonne (mit Glühen)
      const glowR = realMode ? Math.max(sunR * 3.2, 14) : sunR * 3.2;
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
        path.forEach((p, k) => {
          const [x, y] = project(p);
          if (k === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
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

      // 2) Himmelskörper an ihrer echten Position zum simulierten Datum
      for (const planet of bodies) {
        const pos = bodyPosition(planet.id, jd);
        if (!pos) continue;
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
        const glowMult = smallCanvas ? 1.5 : 2.4;
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

      drawnRef.current = drawn;
      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, mode, selectedId, stars, bodies, interactive, lang, scaleMode, orbitPaths]);

  function handlePointerDown(e: PointerEvent<HTMLCanvasElement>) {
    if (!interactive) return;
    canvasRef.current?.setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size >= 2) {
      // Zweiter Finger kam dazu → ab jetzt Pinch-Zoom statt Dreh-Geste.
      dragRef.current = null;
      const pts = Array.from(pointersRef.current.values());
      pinchStartDistRef.current = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      pinchStartZoomRef.current = zoomRef.current;
      pinchCenterRef.current = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
    } else {
      dragRef.current = { x: e.clientX, y: e.clientY, dragged: false };
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
      const ratio = dist / pinchStartDistRef.current;
      const c = pinchCenterRef.current ?? { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
      zoomAt(pinchStartZoomRef.current * ratio, c.x, c.y);
      return;
    }

    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) dragRef.current.dragged = true;
    rotateRef.current += dx * 0.006;
    tiltRef.current = Math.min(1, Math.max(0.22, tiltRef.current - dy * 0.003));
    dragRef.current.x = e.clientX;
    dragRef.current.y = e.clientY;
  }

  function handlePointerUp(e: PointerEvent<HTMLCanvasElement>) {
    if (!interactive) return;
    canvasRef.current?.releasePointerCapture(e.pointerId);
    pointersRef.current.delete(e.pointerId);

    if (pointersRef.current.size < 2) {
      pinchStartDistRef.current = null;
    }

    if (pointersRef.current.size === 0) {
      if (canvasRef.current) canvasRef.current.style.cursor = "grab";
      // Klick nur werten, wenn nicht gezogen/gepincht wurde.
      if (dragRef.current && !dragRef.current.dragged) {
        selectFromPoint(e.clientX, e.clientY);
      }
      dragRef.current = null;
    } else if (pointersRef.current.size === 1) {
      // Nach dem Pinch bleibt ein Finger übrig — Dreh-Geste neu ansetzen,
      // ohne dass es als Klick zählt.
      const remaining = Array.from(pointersRef.current.values())[0];
      dragRef.current = { x: remaining.x, y: remaining.y, dragged: true };
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
    // multiplikativ, damit auch sehr hohe Zoomstufen in vernünftig vielen Schritten erreichbar sind
    const factor = Math.exp(-Math.max(-200, Math.min(200, e.deltaY)) * 0.0018);
    zoomAt(zoomRef.current * factor, e.clientX, e.clientY);
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
      // Bei Zoom ≤ 1 (alles sichtbar) die Sonne wieder in die Mitte holen
      if (newZoom <= 1) panRef.current = { x: 0, y: 0 };
    }
    zoomRef.current = newZoom;
  }

  function zoomByButton(factor: number) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    zoomAt(zoomRef.current * factor, rect.left + rect.width / 2, rect.top + rect.height / 2);
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
        className={interactive ? "cursor-grab touch-none" : ""}
        aria-label={t("solarSystemVisAria")}
      />
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
              {SPEEDS[speedIndex]} {t("solarDaysPerSecond")}
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
