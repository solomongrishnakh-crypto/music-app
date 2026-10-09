"use client";

import { useMemo, useState } from "react";

/**
 * Zahnrad-Rechner (Nutzerwunsch 09.10.2026: Seite soll auch bei Suchen wie
 * "Übersetzung berechnen" / "gear ratio calculator" gefunden werden).
 * Rechnet: Umdrehungszeit des letzten Rads = erstes Rad × Untersetzung^(n−1).
 */
const AGE_UNIVERSE_S = 13.797e9 * 31_557_600;

export interface GearCalcLabels {
  first: string;
  ratio: string;
  gears: string;
  last: string;
  total: string;
  ageOfUniverse: string; // {x}
  units: { sec: string; min: string; hours: string; days: string; years: string; thousandYears: string; millionYears: string; billionYears: string };
}

function fmtDuration(sec: number, L: GearCalcLabels, locale: string): string {
  const f = (n: number) => n.toLocaleString(locale, { maximumFractionDigits: n < 10 ? 2 : 0 });
  const y = sec / 31_557_600;
  if (!isFinite(sec)) return "∞";
  if (sec < 120) return `${f(sec)} ${L.units.sec}`;
  if (sec < 7200) return `${f(sec / 60)} ${L.units.min}`;
  if (sec < 172_800) return `${f(sec / 3600)} ${L.units.hours}`;
  if (y < 2) return `${f(sec / 86400)} ${L.units.days}`;
  if (y < 10_000) return `${f(y)} ${L.units.years}`;
  if (y < 1e6) return `${f(y / 1000)} ${L.units.thousandYears}`;
  if (y < 1e9) return `${f(y / 1e6)} ${L.units.millionYears}`;
  if (y < 1e15) return `${f(y / 1e9)} ${L.units.billionYears}`;
  return `${y.toExponential(2)} ${L.units.years}`;
}

export default function GearCalculator({ labels, locale }: { labels: GearCalcLabels; locale: string }) {
  const [first, setFirst] = useState(3.31);
  const [ratio, setRatio] = useState(6);
  const [gears, setGears] = useState(23);
  const res = useMemo(() => {
    const total = Math.pow(ratio, Math.max(0, gears - 1));
    const last = first * total;
    return { total, last, uni: last / AGE_UNIVERSE_S };
  }, [first, ratio, gears]);
  const input = "w-full border border-border bg-black/40 px-3 py-2 text-foreground focus:border-accent focus:outline-none";
  return (
    <div className="hud-card mt-4 border border-border p-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-xs text-muted">
          {labels.first}
          <input type="number" min={0.001} step="any" value={first} onChange={(e) => setFirst(Math.max(0.001, Number(e.target.value) || 0.001))} className={`mt-1 ${input}`} />
        </label>
        <label className="text-xs text-muted">
          {labels.ratio}
          <input type="number" min={1} max={1000} step="any" value={ratio} onChange={(e) => setRatio(Math.min(1000, Math.max(1, Number(e.target.value) || 1)))} className={`mt-1 ${input}`} />
        </label>
        <label className="text-xs text-muted">
          {labels.gears}
          <input type="number" min={1} max={200} step={1} value={gears} onChange={(e) => setGears(Math.min(200, Math.max(1, Math.round(Number(e.target.value) || 1))))} className={`mt-1 ${input}`} />
        </label>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className="border border-accent/60 p-3">
          <p className="label-mono text-[10px] uppercase text-accent">{labels.last}</p>
          <p className="mt-1 text-lg text-foreground">{fmtDuration(res.last, labels, locale)}</p>
          <p className="text-[11px] text-muted">
            {labels.ageOfUniverse.replace(
              "{x}",
              res.uni >= 0.01 ? res.uni.toLocaleString(locale, { maximumFractionDigits: 2 }) : res.uni.toExponential(1)
            )}
          </p>
        </div>
        <div className="border border-border p-3">
          <p className="label-mono text-[10px] uppercase text-muted">{labels.total}</p>
          <p className="mt-1 text-lg text-foreground">
            1 : {res.total < 1e15 ? res.total.toLocaleString(locale, { maximumFractionDigits: 0 }) : res.total.toExponential(3)}
          </p>
        </div>
      </div>
    </div>
  );
}
