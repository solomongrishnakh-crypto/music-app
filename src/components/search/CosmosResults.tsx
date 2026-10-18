"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { homeText } from "@/lib/homeText";
import type { CosmosHit, CosmosKind } from "@/lib/cosmosSearch";

const ICON: Record<CosmosKind, string> = {
  planet: "🪐", dwarf: "🌑", sun: "☀️", probe: "🛰️", constellation: "✨", star: "⭐", empire: "🏛️", dso: "🌌", fact: "📊",
};

const yr = (y: number) => (y < 0 ? `−${-y}` : `${y}`);

/** Treffer aus Planeten, Sternen, Sternbildern und Imperien als Karten. */
export default function CosmosResults({ hits }: { hits: CosmosHit[] }) {
  const { lang, localePath } = useLanguage();
  const h = homeText(lang);
  if (hits.length === 0) return null;

  function sub(x: CosmosHit): string {
    if (x.kind === "dso" || x.kind === "fact") return x.sub ?? "";
    const label = h[x.kind === "constellation" ? "constellation" : x.kind];
    if (x.kind === "star") return `${label} · ${x.mag?.toFixed(1)} mag · ${x.ly} ${h.ly} · ${h.inConst} ${x.inConst}`;
    if (x.kind === "empire" && x.from !== undefined && x.to !== undefined) return `${label} · ${yr(x.from)} – ${yr(x.to)}`;
    return label;
  }

  return (
    <div className="mx-auto mt-6 grid w-full max-w-2xl grid-cols-1 gap-2.5 sm:grid-cols-2">
      {hits.map((x) => (
        <Link key={x.key} href={localePath(x.href)} className="hud-card group relative flex items-center gap-3 overflow-hidden p-3">
          <span className="text-2xl" aria-hidden="true">{ICON[x.kind]}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-display text-sm font-bold uppercase tracking-wide text-foreground">{x.title}</span>
            <span className="block truncate text-[11px] text-muted">{sub(x)}</span>
          </span>
          <span className="feat-go" aria-hidden="true">↗</span>
        </Link>
      ))}
    </div>
  );
}
