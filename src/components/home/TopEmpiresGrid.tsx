"use client";

import { useState } from "react";
import Typewriter from "@/components/ui/Typewriter";
import DetailModal from "@/components/ui/DetailModal";
import { useInView } from "@/hooks/useInView";
import { TOP_EMPIRES } from "@/data/topEmpires";

interface RevealCardProps {
  children: (inView: boolean) => React.ReactNode;
  className?: string;
  onClick?: () => void;
}

function RevealCard({ children, className, onClick }: RevealCardProps) {
  const { ref, inView } = useInView<HTMLButtonElement>();
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`group text-left transition-colors ${className ?? ""}`}
    >
      {children(inView)}
    </button>
  );
}

/**
 * Die "01–04"-Box "Große Imperien der Geschichte" — ausgelagert aus
 * FactsSection.tsx, damit sie sowohl auf der Startseite als auch unten auf
 * der /imperien-Kartenseite angezeigt werden kann (Nutzerwunsch 19.09.2026:
 * "nimm diese box mit großen imperien füge es in die seite unten wo karte
 * ist").
 */
export default function TopEmpiresGrid() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
        {TOP_EMPIRES.map((empire, i) => (
          <RevealCard
            key={empire.name}
            className="glass-card p-6"
            onClick={() => setSelectedIndex(i)}
          >
            {(inView) => (
              <>
                <div className="mb-3 flex items-baseline justify-between">
                  <p className="font-display text-2xl font-bold text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="label-mono text-[11px] uppercase">{empire.peak}</p>
                </div>
                <p className="min-h-[1.4em] text-sm font-semibold uppercase tracking-wide text-foreground">
                  <Typewriter text={empire.name} active={inView} speed={16} />
                </p>
                <p className="mt-2 min-h-[3.5em] text-xs leading-relaxed text-muted">
                  <Typewriter
                    text={empire.text}
                    active={inView}
                    speed={5}
                    delay={empire.name.length * 16 + 200}
                  />
                </p>
                <p className="label-mono mt-3 text-[10px] uppercase opacity-0 transition-opacity group-hover:opacity-100">
                  // mehr erfahren
                </p>
              </>
            )}
          </RevealCard>
        ))}
      </div>

      {selectedIndex !== null && (
        <DetailModal
          eyebrow="// Große Imperien der Geschichte"
          title={TOP_EMPIRES[selectedIndex].name}
          meta={TOP_EMPIRES[selectedIndex].peak}
          paragraphs={TOP_EMPIRES[selectedIndex].details}
          imageUrl={TOP_EMPIRES[selectedIndex].image}
          imageAlt={TOP_EMPIRES[selectedIndex].name}
          imageCredit="Bild: Wikimedia Commons"
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </div>
  );
}
