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
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [selected]);

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
      <div className="flex items-center justify-between border-b border-border px-3 py-2 sm:px-6 sm:py-3">
        <div className="min-w-0">
          <p className="label-mono text-[10px] uppercase text-accent sm:text-xs">// Sonnensystem</p>
          <p className="font-display truncate text-xs font-bold text-foreground sm:text-base">
            Planet tippen für Details
          </p>
          <p className="mt-0.5 text-[9px] uppercase tracking-wide text-muted sm:text-xs">
            Ziehen: drehen &amp; neigen · Scrollen: zoomen
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Schließen"
          title="Schließen"
          className="flex h-7 w-7 shrink-0 items-center justify-center border border-border text-muted transition-colors hover:border-accent hover:text-accent sm:h-9 sm:w-9"
        >
          <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="relative min-h-0 flex-1">
        <SolarSystem mode="full" onSelectPlanet={setSelected} selectedId={selected?.id ?? null} />

        {selected && (
          <div className="absolute inset-x-0 bottom-0 max-h-[68%] overflow-y-auto border-t border-border bg-background/95 p-3 backdrop-blur-sm sm:max-h-[55%] sm:p-6">
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Info schließen"
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center border border-border text-muted transition-colors hover:border-accent hover:text-accent sm:right-3 sm:top-3 sm:h-7 sm:w-7"
            >
              ×
            </button>
            <p className="label-mono text-[10px] uppercase sm:text-xs" style={{ color: selected.color }}>
              // {selected.kind === "star" ? "Stern" : selected.kind === "dwarf" ? "Zwergplanet" : selected.kind === "probe" ? "Raumsonde" : "Planet"}
            </p>
            <h3 className="font-display mt-0.5 text-base font-bold uppercase tracking-tight text-foreground sm:mt-1 sm:text-2xl">
              {selected.name}
            </h3>
            {selected.image && !imageFailed && (
              <div className="mt-1.5 aspect-[16/9] max-h-32 w-full overflow-hidden rounded border border-border bg-black sm:mt-2 sm:max-h-56">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selected.image}
                  alt={selected.name}
                  className="h-full w-full object-contain"
                  loading="lazy"
                  onError={() => setImageFailed(true)}
                />
              </div>
            )}
            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px] uppercase tracking-wide text-muted sm:mt-3 sm:grid-cols-4 sm:gap-x-4 sm:gap-y-2 sm:text-xs">
              <div>
                <p className="text-muted">{selected.factLabels?.[0] ?? "Abstand zur Sonne"}</p>
                <p className="mt-0.5 font-semibold text-foreground">{selected.facts.distance}</p>
              </div>
              <div>
                <p className="text-muted">{selected.factLabels?.[1] ?? "Umlaufzeit"}</p>
                <p className="mt-0.5 font-semibold text-foreground">{selected.facts.period}</p>
              </div>
              <div>
                <p className="text-muted">{selected.factLabels?.[2] ?? "Durchmesser"}</p>
                <p className="mt-0.5 font-semibold text-foreground">{selected.facts.diameter}</p>
              </div>
              <div>
                <p className="text-muted">{selected.factLabels?.[3] ?? "Monde"}</p>
                <p className="mt-0.5 font-semibold text-foreground">{selected.facts.moons}</p>
              </div>
            </div>
            <p className="mt-2.5 text-[11px] leading-relaxed text-foreground sm:mt-4 sm:text-sm">
              {selected.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
