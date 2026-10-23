"use client";

import { PLANETS } from "@/data/solarSystem";
import { useLanguage } from "@/contexts/LanguageContext";
import { localize } from "@/lib/i18n";

/**
 * Nutzerwunsch 23.10.2026: "mach diese Sonnensystem-Box nicht live oder Loop,
 * nur wie ein Bild, mit den Namen der großen Planeten, kompakt". Ein festes
 * SVG-Bild (keine Animation, kein WebGL) — die Box öffnet weiterhin das echte
 * 3D-Sonnensystem.
 */
const CX = 200;
const CY = 98;
const TILT = 0.34; // Neigung der Ansicht (Ellipsen-Höhe / Breite)

// id, Bahnradius, Winkel (°), Punktgröße, Farbe, Beschriftung
const ORBITS: { id: string; r: number; a: number; s: number; c: string; label?: boolean }[] = [
  { id: "mercury", r: 22, a: 200, s: 1.4, c: "#b8b0a4" },
  { id: "venus", r: 32, a: 320, s: 2, c: "#e8c98a" },
  { id: "earth", r: 44, a: 60, s: 2.2, c: "#5d9bff" },
  { id: "mars", r: 56, a: 150, s: 1.8, c: "#e0714f" },
  { id: "jupiter", r: 90, a: 235, s: 5, c: "#e2b98a", label: true },
  { id: "saturn", r: 124, a: 20, s: 4.4, c: "#e6d29a", label: true },
  { id: "uranus", r: 156, a: 300, s: 3.2, c: "#8fe0e6", label: true },
  { id: "neptune", r: 186, a: 130, s: 3.2, c: "#5a78ff", label: true },
];

export default function SolarSystemStill({ className = "" }: { className?: string }) {
  const { lang } = useLanguage();
  const rad = (d: number) => (d * Math.PI) / 180;
  return (
    <svg
      viewBox="0 0 400 200"
      preserveAspectRatio="xMidYMid slice"
      className={`h-full w-full ${className}`}
      role="img"
      aria-label="Solar system"
    >
      <defs>
        <radialGradient id="ssSun">
          <stop offset="0" stopColor="#fff6d8" />
          <stop offset="0.35" stopColor="#ffc15a" />
          <stop offset="1" stopColor="#ffa02800" />
        </radialGradient>
      </defs>
      {ORBITS.map((o) => (
        <ellipse key={o.id} cx={CX} cy={CY} rx={o.r} ry={o.r * TILT} fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="0.6" />
      ))}
      <circle cx={CX} cy={CY} r="15" fill="url(#ssSun)" />
      <circle cx={CX} cy={CY} r="4.5" fill="#fff0c0" />
      {ORBITS.map((o) => {
        const x = CX + o.r * Math.cos(rad(o.a));
        const y = CY + o.r * TILT * Math.sin(rad(o.a));
        const p = PLANETS.find((b) => b.id === o.id);
        const name = p ? localize(p.name, lang) : o.id;
        const below = Math.sin(rad(o.a)) > 0;
        return (
          <g key={o.id}>
            <circle cx={x} cy={y} r={o.s} fill={o.c} />
            {o.id === "saturn" && (
              <ellipse cx={x} cy={y} rx={o.s * 2.1} ry={o.s * 0.7} fill="none" stroke="#e6d29a" strokeWidth="0.8" opacity="0.8" />
            )}
            {o.label && (
              <text
                x={x}
                y={below ? y + o.s + 9 : y - o.s - 4}
                textAnchor="middle"
                fontSize="8.5"
                fill="rgba(255,255,255,0.82)"
                style={{ fontFamily: "var(--font-mono, monospace)", letterSpacing: "0.04em" }}
              >
                {name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
