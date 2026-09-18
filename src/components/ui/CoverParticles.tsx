"use client";

import { useEffect, useRef } from "react";

interface FlowParticle {
  angle: number;
  distance: number;
  speed: number;
  radius: number;
  alpha: number;
}

/**
 * CoverParticles
 * ---------------------------------------------------------------------------
 * Canvas-Overlay über dem Titelbild: kleine, rötlich-weiße Partikel starten
 * nahe der Mitte und wandern ständig nach außen/hinten (wachsende Distanz,
 * schrumpfende/verblassende Größe), bevor sie erneut in der Mitte starten —
 * simuliert einen endlosen "Partikel strömen nach hinten"-Effekt, passend
 * zum Bildmotiv. Liegt per mix-blend-mode über dem statischen Bild.
 */
export default function CoverParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animationId: number;
    let particles: FlowParticle[] = [];

    const COUNT = 36;
    const MAX_DISTANCE_FACTOR = 0.62; // Anteil der halben Diagonale

    function resetParticle(p: FlowParticle) {
      p.angle = Math.random() * Math.PI * 2;
      p.distance = Math.random() * 10;
      p.speed = 0.35 + Math.random() * 0.5;
      p.radius = 0.6 + Math.random() * 1.4;
      p.alpha = 0.5 + Math.random() * 0.4;
    }

    function resize() {
      if (!canvas) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = rect?.width ?? canvas.clientWidth;
      height = rect?.height ?? canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = Array.from({ length: COUNT }, () => {
        const p: FlowParticle = { angle: 0, distance: 0, speed: 0, radius: 0, alpha: 0 };
        resetParticle(p);
        p.distance = Math.random() * Math.hypot(width, height) * 0.5 * MAX_DISTANCE_FACTOR;
        return p;
      });
    }

    function step() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const maxDist = Math.hypot(width, height) * 0.5 * MAX_DISTANCE_FACTOR;

      for (const p of particles) {
        p.distance += p.speed;
        if (p.distance > maxDist) {
          resetParticle(p);
          continue;
        }

        const progress = p.distance / maxDist; // 0 (Mitte) .. 1 (Rand)
        const x = cx + Math.cos(p.angle) * p.distance;
        const y = cy + Math.sin(p.angle) * p.distance * 0.85;
        const size = p.radius * (1 - progress * 0.6);
        const alpha = p.alpha * (1 - progress);

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 5);
        gradient.addColorStop(0, `rgba(255, 130, 120, ${alpha})`);
        gradient.addColorStop(1, "rgba(255, 130, 120, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size * 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 235, 230, ${Math.min(1, alpha + 0.2)})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(step);
    }

    resize();
    animationId = requestAnimationFrame(step);

    const observer = new ResizeObserver(resize);
    if (canvas.parentElement) observer.observe(canvas.parentElement);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen"
      aria-hidden="true"
    />
  );
}
