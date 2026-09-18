"use client";

import Typewriter from "@/components/ui/Typewriter";
import { useInView } from "@/hooks/useInView";

/**
 * Kleiner, futuristischer Schriftzug in der leeren Fläche zwischen den
 * Sektionen — tippt sich langsam selbst ein, sobald er ins Blickfeld
 * scrollt, mit einem leichten Glühen (wie aus Licht/Partikeln geformt).
 */
export default function UniverseTypewriter() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className="mb-10 mt-16 flex justify-center sm:mb-14 sm:mt-24">
      <p
        className="font-display min-h-[1.5em] text-xs uppercase tracking-[0.35em] text-foreground/90 sm:text-sm"
        style={{ textShadow: "0 0 12px rgba(255, 242, 238, 0.5)" }}
      >
        <Typewriter text="Understand The Universe" active={inView} speed={160} />
      </p>
    </div>
  );
}
