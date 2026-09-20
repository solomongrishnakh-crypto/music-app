"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent, type WheelEvent } from "react";
import { PLANETS, ALL_BODIES, SUN, type PlanetData } from "@/data/solarSystem";

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
 * Zeichnet das Sonnensystem auf einem <canvas> — echte relative Abstände
 * (AE) und Größen (km), aber für die Darstellung auf Wurzel-Skala gestaucht
 * (Nutzerwunsch 20.09.2026: "sehr realistische umlaufbahnen und abstände"
 * — Reihenfolge/Verhältnisse bleiben astronomisch korrekt). Umlaufgeschwin-
 * digkeiten sind proportional zur echten Umlaufzeit (Kepler), nur zeitlich
 * gerafft.
 *
 * Nutzerwunsch 20.09.2026 (zweite Runde): Zwergplaneten (Pluto, Haumea,
 * Makemake, Eris, Ceres) und Voyager 1 als feste Sonde ohne Umlaufbahn
 * ergänzt (nur im "full"-Modus, damit die kompakte Vorschau übersichtlich
 * bleibt) — sowie Maussteuerung: Ziehen dreht die Ansicht (horizontal) und
 * neigt sie (vertikal, wie eine Kamera, die sich hebt/senkt), Scrollen/
 * Pinch zoomt.
 */
export default function SolarSystem({
  mode = "full",
  onSelectPlanet,
  selectedId,
  className = "",
}: SolarSystemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawnRef = useRef<DrawnPlanet[]>([]);
  const angleRef = useRef<number[]>(ALL_BODIES.map((_, i) => (i / ALL_BODIES.length) * Math.PI * 2));
  const rafRef = useRef<number>(0);
  const [size, setSize] = useState({ w: 300, h: 300 });

  const interactive = mode === "full";
  const bodies = useMemo(() => (mode === "compact" ? PLANETS : ALL_BODIES), [mode]);

  // Kamera-Zustand als Ref statt State: wird pro Frame im rAF-Loop gelesen,
  // ein Re-Render pro Mausbewegung wäre unnötig teuer.
  const zoomRef = useRef(1);
  const rotateRef = useRef(0); // zusätzliche Drehung der Ansicht (Radiant)
  const tiltRef = useRef(0.94); // vertikale Stauchung: 1 = von oben, 0.25 = fast von der Seite
  const dragRef = useRef<{ x: number; y: number; dragged: boolean } | null>(null);

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

    const cx = size.w / 2;
    const cy = size.h / 2;
    const baseMaxOrbitR = Math.min(size.w, size.h) / 2 - (mode === "compact" ? 4 : 26);
    const sunR = mode === "compact" ? 6 : 16;

    const orbitBodies = bodies.filter((b) => b.kind !== "probe");
    const minAu = Math.sqrt(Math.min(...orbitBodies.map((b) => b.distanceAu)));
    const maxAu = Math.sqrt(Math.max(...bodies.map((b) => b.distanceAu)));
    const minDiam = Math.sqrt(Math.min(...orbitBodies.map((b) => b.diameterKm)));
    const maxDiam = Math.sqrt(Math.max(...orbitBodies.map((b) => b.diameterKm)));

    let lastTime = performance.now();

    function orbitRadius(distanceAu: number, maxOrbitR: number) {
      const t = (Math.sqrt(distanceAu) - minAu) / (maxAu - minAu);
      return sunR + 10 + t * (maxOrbitR - sunR - 10);
    }

    function planetRadius(diameterKm: number, kind: PlanetData["kind"]) {
      if (kind === "dwarf") {
        const t = (Math.sqrt(diameterKm) - minDiam) / (maxDiam - minDiam || 1);
        const min = mode === "compact" ? 1 : 1.6;
        const max = mode === "compact" ? 2 : 4.5;
        return min + t * (max - min);
      }
      const t = (Math.sqrt(diameterKm) - minDiam) / (maxDiam - minDiam || 1);
      const min = mode === "compact" ? 1.3 : 3;
      const max = mode === "compact" ? 4 : 12;
      return min + t * (max - min);
    }

    function draw(now: number) {
      const dtMs = now - lastTime;
      lastTime = now;

      const maxOrbitR = baseMaxOrbitR * zoomRef.current;
      const tilt = tiltRef.current;
      const rot = rotateRef.current;

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
      const sunGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunR * 3.2);
      sunGlow.addColorStop(0, "rgba(255,196,110,0.55)");
      sunGlow.addColorStop(1, "rgba(255,196,110,0)");
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, sunR * 3.2, 0, Math.PI * 2);
      ctx.fill();

      const sunBody = ctx.createRadialGradient(
        cx - sunR * 0.3,
        cy - sunR * 0.3,
        sunR * 0.1,
        cx,
        cy,
        sunR
      );
      sunBody.addColorStop(0, "#fff3d6");
      sunBody.addColorStop(0.5, "#ffcf6b");
      sunBody.addColorStop(1, "#ff9a3c");
      ctx.fillStyle = sunBody;
      ctx.beginPath();
      ctx.arc(cx, cy, sunR, 0, Math.PI * 2);
      ctx.fill();

      const drawn: DrawnPlanet[] = [];
      if (interactive) {
        drawn.push({ planet: SUN, x: cx, y: cy, r: sunR });
      }

      // Nutzerwunsch 20.09.2026 ("bei mobile ansicht ist alles dicht"):
      // Auf schmalen Canvas-Breiten kleinere Schrift + Labels, die sich zu
      // nah kämen, werden übersprungen (der Punkt bleibt aber sichtbar).
      const smallCanvas = size.w < 420;
      const minLabelGap = smallCanvas ? 24 : 15;
      const labelRects: { x: number; y: number }[] = [];
      function drawLabel(text: string, x: number, y: number, color: string, font: string, force = false) {
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

      bodies.forEach((planet, i) => {
        const isDwarf = planet.kind === "dwarf";
        const isProbe = planet.kind === "probe";
        const orbitR = orbitRadius(planet.distanceAu, maxOrbitR);

        if (isProbe) {
          // Sonde: keine Umlaufbahn, fester Winkel + gestrichelte Linie nach außen.
          const angle = -0.61 + rot;
          const x = cx + Math.cos(angle) * orbitR;
          const y = cy + Math.sin(angle) * orbitR * tilt;
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
              planet.name,
              x,
              y - pr - 6,
              isSelectedProbe ? "#ff5a4d" : "rgba(242,242,240,0.65)",
              smallCanvas ? "8px var(--font-mono, monospace)" : "9px var(--font-mono, monospace)",
              true
            );
          }

          drawn.push({ planet, x, y, r: pr + 4 });
          return;
        }

        // Umlaufbahn-Linie
        ctx.beginPath();
        ctx.ellipse(cx, cy, orbitR, orbitR * tilt, 0, 0, Math.PI * 2);
        if (isDwarf) {
          ctx.setLineDash([2, 3]);
          ctx.strokeStyle = "rgba(255,255,255,0.08)";
        } else {
          ctx.setLineDash([]);
          ctx.strokeStyle = "rgba(255,255,255,0.12)";
        }
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);

        // Winkelgeschwindigkeit proportional zur echten (Kepler-)Umlaufzeit,
        // aber zeitlich gerafft.
        const visualPeriodMs = Math.sqrt(planet.periodDays) * 900;
        const angularSpeed = (Math.PI * 2) / visualPeriodMs;
        angleRef.current[i] += angularSpeed * dtMs;

        const angle = angleRef.current[i] + rot;
        const x = cx + Math.cos(angle) * orbitR;
        const y = cy + Math.sin(angle) * orbitR * tilt;
        const pr = planetRadius(planet.diameterKm, planet.kind);

        drawn.push({ planet, x, y, r: pr });

        const isSelected = interactive && selectedId === planet.id;

        // Saturn-Ringe
        if (planet.hasRings) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(-0.35);
          ctx.strokeStyle = "rgba(227,209,163,0.55)";
          ctx.lineWidth = mode === "compact" ? 1 : 1.6;
          ctx.beginPath();
          ctx.ellipse(0, 0, pr * 1.9, pr * 0.7, 0, 0, Math.PI * 2);
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
        const glow = ctx.createRadialGradient(x, y, 0, x, y, pr * 2.4);
        glow.addColorStop(0, planet.glowColor);
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, pr * 2.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = planet.color;
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
          drawLabel(planet.name, x, y - pr - 6, color, font, isSelected);
        }
      });

      drawnRef.current = drawn;
      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, mode, selectedId, stars, bodies, interactive]);

  function handlePointerDown(e: PointerEvent<HTMLCanvasElement>) {
    if (!interactive) return;
    dragRef.current = { x: e.clientX, y: e.clientY, dragged: false };
    canvasRef.current?.setPointerCapture(e.pointerId);
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
  }

  function handlePointerMove(e: PointerEvent<HTMLCanvasElement>) {
    if (!interactive || !dragRef.current) return;
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
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    // Klick nur werten, wenn nicht gezogen wurde.
    if (dragRef.current && !dragRef.current.dragged) {
      selectFromPoint(e.clientX, e.clientY);
    }
    dragRef.current = null;
  }

  function handleWheel(e: WheelEvent<HTMLCanvasElement>) {
    if (!interactive) return;
    e.preventDefault();
    zoomRef.current = Math.min(4.5, Math.max(0.5, zoomRef.current * (1 - e.deltaY * 0.0012)));
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
        onWheel={handleWheel}
        className={interactive ? "cursor-grab touch-none" : ""}
        aria-label="Sonnensystem-Visualisierung"
      />
    </div>
  );
}
