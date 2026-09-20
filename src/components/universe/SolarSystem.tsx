"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { PLANETS, type PlanetData } from "@/data/solarSystem";

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

const MIN_AU = Math.sqrt(PLANETS[0].distanceAu);
const MAX_AU = Math.sqrt(PLANETS[PLANETS.length - 1].distanceAu);
const MIN_DIAM = Math.sqrt(Math.min(...PLANETS.map((p) => p.diameterKm)));
const MAX_DIAM = Math.sqrt(Math.max(...PLANETS.map((p) => p.diameterKm)));

/**
 * Zeichnet das Sonnensystem auf einem <canvas> — echte relative Abstände
 * (AE) und Größen (km), aber für die Darstellung auf Wurzel-Skala gestaucht
 * (Nutzerwunsch 20.09.2026: "sehr realistische umlaufbahnen und abstände"
 * — Reihenfolge/Verhältnisse bleiben astronomisch korrekt, sonst wäre bei
 * echtem 1:1-Maßstab Merkur unsichtbar nah an der Sonne und Neptun weit
 * außerhalb des Bildschirms). Umlaufgeschwindigkeiten sind ebenfalls
 * proportional zur echten Umlaufzeit (Kepler), nur zeitlich gerafft, damit
 * man die Bewegung überhaupt sieht statt 165 Jahre auf Neptun zu warten.
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
  const angleRef = useRef<number[]>(PLANETS.map((_, i) => (i / PLANETS.length) * Math.PI * 2));
  const rafRef = useRef<number>(0);
  const [size, setSize] = useState({ w: 300, h: 300 });

  const interactive = mode === "full";

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
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    canvas.width = size.w * dpr;
    canvas.height = size.h * dpr;
    canvas.style.width = `${size.w}px`;
    canvas.style.height = `${size.h}px`;
    ctx.scale(dpr, dpr);

    const cx = size.w / 2;
    const cy = size.h / 2;
    const maxOrbitR = Math.min(size.w, size.h) / 2 - (mode === "compact" ? 4 : 26);
    const sunR = mode === "compact" ? 6 : 16;

    let lastTime = performance.now();

    function orbitRadius(distanceAu: number) {
      const t = (Math.sqrt(distanceAu) - MIN_AU) / (MAX_AU - MIN_AU);
      return sunR + 10 + t * (maxOrbitR - sunR - 10);
    }

    function planetRadius(diameterKm: number) {
      const t = (Math.sqrt(diameterKm) - MIN_DIAM) / (MAX_DIAM - MIN_DIAM);
      const min = mode === "compact" ? 1.3 : 3;
      const max = mode === "compact" ? 4 : 12;
      return min + t * (max - min);
    }

    function draw(now: number) {
      const dtMs = now - lastTime;
      lastTime = now;

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

      PLANETS.forEach((planet, i) => {
        const orbitR = orbitRadius(planet.distanceAu);

        // Umlaufbahn-Linie
        ctx.beginPath();
        ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.12)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Winkelgeschwindigkeit proportional zur echten (Kepler-)Umlaufzeit,
        // aber zeitlich gerafft: sqrt(periodDays) legt die sichtbare Dauer
        // fest, damit alle Planeten in überschaubarer Zeit sichtbar
        // umlaufen, ihre RELATIVE Geschwindigkeit zueinander aber stimmt.
        const visualPeriodMs = Math.sqrt(planet.periodDays) * 900;
        const angularSpeed = (Math.PI * 2) / visualPeriodMs;
        angleRef.current[i] += angularSpeed * dtMs;

        const angle = angleRef.current[i];
        const x = cx + Math.cos(angle) * orbitR;
        const y = cy + Math.sin(angle) * orbitR * 0.94; // leichte Ellipse statt perfektem Kreis
        const pr = planetRadius(planet.diameterKm);

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

        if (mode === "full") {
          ctx.font = "10px var(--font-mono, monospace)";
          ctx.fillStyle = isSelected ? "#ff5a4d" : "rgba(242,242,240,0.75)";
          ctx.textAlign = "center";
          ctx.fillText(planet.name, x, y - pr - 6);
        }
      });

      drawnRef.current = drawn;
      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, mode, selectedId, stars]);

  function handleClick(e: MouseEvent<HTMLCanvasElement>) {
    if (!interactive || !onSelectPlanet) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

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
        onClick={handleClick}
        className={interactive ? "cursor-pointer" : ""}
        aria-label="Sonnensystem-Visualisierung"
      />
    </div>
  );
}
