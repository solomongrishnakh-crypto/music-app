"use client";

import { useMemo } from "react";

interface Star {
  left: string;
  top: string;
  size: number;
  delay: string;
  duration: string;
}

/**
 * Nutzerwunsch 20.09.2026: "füge im box 'universum kennenlernen' statische
 * sterne die blinken dann dunkeler werden" — im Unterschied zum ständig
 * driftenden Partikel-Hintergrund (SiteBackground) bleiben diese Punkte an
 * FESTEN Positionen (kein Treiben/Bewegen), sie werden nur per CSS-Opacity
 * heller und wieder dunkler ("blinken"). Positionen/Timing werden einmalig
 * zufällig erzeugt und bleiben für die Lebensdauer der Komponente stabil
 * (useMemo), damit sie beim Neu-Rendern nicht umherspringen.
 */
export default function TwinkleStars({
  count = 18,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: count }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() < 0.75 ? 1.5 : 2.5,
      delay: `${(Math.random() * 5).toFixed(2)}s`,
      duration: `${(2.2 + Math.random() * 2.6).toFixed(2)}s`,
    }));
  }, [count]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {stars.map((star, i) => (
        <span
          key={i}
          className="animate-twinkle absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </div>
  );
}
