"use client";

import { useEffect, useState } from "react";
import SolarSystem from "./SolarSystem";
import type { PlanetData } from "@/data/solarSystem";

interface SolarSystemModalProps {
  onClose: () => void;
}

/**
 * Vollbild-Ansicht des Sonnensystems (Nutzerwunsch 20.09.2026: "wenn ich
 * auf dem box drücke dann soll was ähnliches kommen aber mit
 * vollbildbfenster mit X button ... wenn man auf ein planet drückt soll
 * man dann infos über dem ausgewählten planet sehen"). Gleicher Aufbau wie
 * DetailModal (Escape schließt, Body-Scroll gesperrt), aber eigenständig,
 * weil hier zusätzlich die Canvas-Visualisierung + Planeten-Klick-Panel
 * reinpassen müssen.
 */
export default function SolarSystemModal({ onClose }: SolarSystemModalProps) {
  const [selected, setSelected] = useState<PlanetData | null>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (selected) {
        setSelected(null);
      } else {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, selected]);

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
        <div>
          <p className="label-mono text-xs uppercase text-accent">// Sonnensystem</p>
          <p className="font-display text-sm font-bold text-foreground sm:text-base">
            Auf einen Planeten tippen für Details
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Schließen"
          title="Schließen"
          className="flex h-9 w-9 shrink-0 items-center justify-center border border-border text-muted transition-colors hover:border-accent hover:text-accent"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="relative min-h-0 flex-1">
        <SolarSystem mode="full" onSelectPlanet={setSelected} selectedId={selected?.id ?? null} />

        {selected && (
          <div className="absolute inset-x-0 bottom-0 max-h-[55%] overflow-y-auto border-t border-border bg-background/95 p-5 backdrop-blur-sm sm:p-6">
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Info schließen"
              className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center border border-border text-muted transition-colors hover:border-accent hover:text-accent"
            >
              ×
            </button>
            <p className="label-mono text-xs uppercase" style={{ color: selected.color }}>
              // Planet
            </p>
            <h3 className="font-display mt-1 text-xl font-bold uppercase tracking-tight text-foreground sm:text-2xl">
              {selected.name}
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] uppercase tracking-wide text-muted sm:grid-cols-4 sm:text-xs">
              <div>
                <p className="text-muted">Abstand zur Sonne</p>
                <p className="mt-0.5 font-semibold text-foreground">{selected.facts.distance}</p>
              </div>
              <div>
                <p className="text-muted">Umlaufzeit</p>
                <p className="mt-0.5 font-semibold text-foreground">{selected.facts.period}</p>
              </div>
              <div>
                <p className="text-muted">Durchmesser</p>
                <p className="mt-0.5 font-semibold text-foreground">{selected.facts.diameter}</p>
              </div>
              <div>
                <p className="text-muted">Monde</p>
                <p className="mt-0.5 font-semibold text-foreground">{selected.facts.moons}</p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-foreground sm:text-sm">
              {selected.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
