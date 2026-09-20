"use client";

import { useMemo } from "react";

/**
 * Nutzerwunsch 20.09.2026: "kannst du ähnliche bewegung oder loop erstellen
 * es soll hintergrund von box 'Weltgeschichte entdecken' sein ... futuristisch
 * ... im box passen" — als Vorlage diente ein Stock-Video mit einer sich
 * spiralförmig ins Bild drehenden Uhr über Wolken ("Zeitreise"-Optik). Das
 * Video selbst ist lizenzierte iStock-Ware und wird NICHT übernommen/
 * nachgebaut — stattdessen ein eigener, rein CSS-animierter "Zeittunnel":
 * mehrere ring-/uhrenartige Kreise (mit einem dünnen Zeiger-Strich statt
 * echter Zifferblatt-Grafik) fliegen endlos aus der Mitte auf den Betrachter
 * zu und drehen sich dabei, in den Farben der Seite (Akzent-Rot/Orange statt
 * Sonnenuntergangs-Foto) — dieselbe "durch die Zeit fliegen"-Bewegung, aber
 * eigenständig gestaltet und leichtgewichtig genug für eine kleine Box.
 */
export default function TimeTunnelBackground({
  rings = 5,
  className = "",
}: {
  rings?: number;
  className?: string;
}) {
  const ringConfigs = useMemo(() => {
    const duration = 5.5;
    return Array.from({ length: rings }, (_, i) => ({
      delay: (-(i * duration)) / rings,
      duration,
      spin: i % 2 === 0 ? "animate-tunnel-spin" : "animate-tunnel-spin-reverse",
    }));
  }, [rings]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Warmer Lichtschein aus der Mitte, wie die Sonne im Vorbild-Video */}
      <div className="absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 animate-tunnel-glow rounded-full bg-accent/25 blur-2xl" />

      {ringConfigs.map((cfg, i) => (
        <div
          key={i}
          className="animate-tunnel-ring absolute left-1/2 top-1/2 aspect-square w-[38%] rounded-full border border-accent/70"
          style={{ animationDelay: `${cfg.delay}s`, animationDuration: `${cfg.duration}s` }}
        >
          {/* Zeiger-artiger Strich statt Zifferblatt — genug, um an eine Uhr
              zu erinnern, ohne die Vorlage nachzubauen. */}
          <span
            className={`absolute left-1/2 top-1/2 h-[46%] w-px origin-bottom bg-accent/60 ${cfg.spin}`}
          />
        </div>
      ))}
    </div>
  );
}
