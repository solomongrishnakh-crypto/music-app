/**
 * Nutzerkorrektur 20.09.2026: "nimm kleine bewegliche uhr für
 * weltgeschichte, es gefällt mir nicht" — der große "Zeittunnel"-Loop-
 * Hintergrund wird durch eine kleine, echte tickende Uhr ersetzt (dünne
 * Zeiger, die sich per CSS endlos drehen) statt eines raumfüllenden
 * Effekts. Reines SVG + CSS, keine Bilder/Videos nötig.
 */
export default function SmallClock({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`relative h-10 w-10 shrink-0 sm:h-12 sm:w-12 ${className}`}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="currentColor"
          className="text-accent/50"
          strokeWidth="3"
        />
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = 50 + Math.sin(angle) * 38;
          const y1 = 50 - Math.cos(angle) * 38;
          const x2 = 50 + Math.sin(angle) * 44;
          const y2 = 50 - Math.cos(angle) * 44;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              className="text-accent/40"
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      {/* Stundenzeiger — eine volle Umdrehung in 12s (statt 12h), damit die
          Bewegung überhaupt sichtbar ist. Die Grundposition (translate
          -50%/-100%) steckt bewusst IM Keyframe selbst statt in einer
          Tailwind-transform-Klasse — sonst würde die rotate-Animation die
          Verschiebung beim Animieren überschreiben. */}
      <span className="animate-clock-hour absolute left-1/2 top-1/2 h-[26%] w-[7%] origin-bottom rounded-full bg-foreground" />
      {/* Minutenzeiger — eine Umdrehung in 3s. */}
      <span className="animate-clock-minute absolute left-1/2 top-1/2 h-[36%] w-[5%] origin-bottom rounded-full bg-foreground" />
      {/* Sekundenzeiger — eine Umdrehung in 1s, dünn und in Akzentfarbe. */}
      <span className="animate-clock-second absolute left-1/2 top-1/2 h-[40%] w-[2.5%] origin-bottom rounded-full bg-accent" />
      <span className="absolute left-1/2 top-1/2 h-[8%] w-[8%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
    </div>
  );
}
