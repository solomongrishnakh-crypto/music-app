"use client";

interface EqualizerVisualizerProps {
  isPlaying: boolean;
  className?: string;
}

// Höhe + Timing für jeden Balken, bewusst unregelmäßig (nicht alle gleich),
// damit es nicht wie ein starres Metronom aussieht.
const BARS = [
  { delay: "0ms", duration: "620ms" },
  { delay: "120ms", duration: "740ms" },
  { delay: "60ms", duration: "560ms" },
  { delay: "200ms", duration: "680ms" },
  { delay: "40ms", duration: "820ms" },
  { delay: "160ms", duration: "600ms" },
  { delay: "90ms", duration: "700ms" },
];

/**
 * Musik-Visualizer / Equalizer (Nutzerwunsch 19.09.2026: "adde Musik-
 * Visualizer: Live-Equalizer/Wellenform, die auf die gerade laufende Musik
 * reagiert").
 *
 * Wichtiger Hinweis zur Ehrlichkeit: Eine ECHTE Frequenzanalyse des Tons
 * ist hier technisch nicht möglich — der Ton kommt aus einem eingebetteten,
 * fremden YouTube-iframe (anderer Ursprung/Origin), auf dessen Audiodaten
 * die Web Audio API keinen Zugriff hat (Cross-Origin-Beschränkung des
 * Browsers, nicht umgehbar). Dieser Equalizer ist deshalb eine simulierte
 * Animation: Die Balken bewegen sich nur, SOLANGE isPlaying wahr ist (reagiert
 * also auf "läuft gerade Musik?"), aber nicht auf die tatsächliche Lautstärke
 * oder Frequenz des aktuellen Songs.
 */
export default function EqualizerVisualizer({
  isPlaying,
  className,
}: EqualizerVisualizerProps) {
  return (
    <div
      className={`flex h-8 items-end justify-center gap-1 ${className ?? ""}`}
      aria-hidden="true"
    >
      {BARS.map((bar, i) => (
        <span
          key={i}
          className="w-1 rounded-full bg-accent"
          style={{
            height: isPlaying ? undefined : "4px",
            animation: isPlaying
              ? `eq-bounce ${bar.duration} ease-in-out ${bar.delay} infinite alternate`
              : "none",
            opacity: isPlaying ? 0.9 : 0.35,
            transition: "opacity 300ms ease",
          }}
        />
      ))}
      <style>{`
        @keyframes eq-bounce {
          0% { height: 4px; }
          100% { height: 28px; }
        }
      `}</style>
    </div>
  );
}
