"use client";

import { useEffect, useRef } from "react";
import { startSmokePortrait } from "./smokePortraitEngine";

/**
 * Lebendiges Porträt für "Über die Webseite" (Nutzerwunsch 28.09.2026:
 * "das Bild lebendiger machen … Partikel bewegen sich nach hinten und
 * verschwinden wie Rauch").
 *
 * Aufbau:
 *   - Unten das Standbild (<img>, object-cover) — sofort sichtbar, auch
 *     ohne JavaScript/WebGL.
 *   - Darüber WebGL: das Bild "strömt" — Haar- und Lichtfäden fließen
 *     endlos nach hinten, das Gesicht bleibt ruhig (Details in
 *     smokePortraitEngine.ts). Sobald das läuft, wird das Standbild
 *     ausgeblendet.
 *   - Ganz oben ein 2D-Canvas mit Funken und Rauchschwaden, die sich aus
 *     den hellen Fäden lösen, nach hinten driften und verglühen.
 *
 * Läuft nur, solange der Bereich sichtbar ist (IntersectionObserver), und
 * bleibt bei "Bewegung reduzieren" (prefers-reduced-motion) statisch.
 */

interface SmokePortraitProps {
  src: string;
  alt: string;
  /** Bildausschnitt wie CSS object-position, 0..1 (Standard: Gesicht im Blick) */
  focusX?: number;
  focusY?: number;
}

export default function SmokePortrait({ src, alt, focusX = 0.75, focusY = 0.45 }: SmokePortraitProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const glCanvas = glRef.current;
    if (!wrap || !canvas || !glCanvas) return;
    // Sobald das fließende WebGL-Bild läuft, das Standbild ausblenden
    const onGLReady = () => {
      glCanvas.style.opacity = "1";
      if (imgRef.current) imgRef.current.style.opacity = "0";
    };
    return startSmokePortrait(wrap, glCanvas, canvas, src, focusX, focusY, onGLReady);
  }, [src, focusX, focusY]);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: `${focusX * 100}% ${focusY * 100}%` }}
        loading="lazy"
        decoding="async"
      />
      <canvas ref={glRef} className="absolute inset-0 h-full w-full opacity-0" aria-hidden="true" />
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />
    </div>
  );
}
