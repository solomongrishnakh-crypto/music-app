"use client";

import { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { findBody } from "@/components/space/bodies";
import { useLanguage, type Lang } from "@/contexts/LanguageContext";
import { localize } from "@/lib/i18n";
import { PLANET_TX, TOOLS_HEAD, TRAVEL_TX, type Tx } from "@/lib/toolsText";

/**
 * Weltraum-Rechner (Nutzerwunsch 15.10.2026): Gewicht & Alter auf anderen Welten
 * und Reisezeit-Rechner. Werte: NASA Planetary Fact Sheet (Schwerkraft am Äquator,
 * bei Gasplaneten auf der 1-bar-Schicht), siderische Umlaufzeiten in Erdtagen.
 */

const G_EARTH = 9.8;
const WORLDS: { id: string; g: number; p: number }[] = [
  { id: "mercury", g: 3.7, p: 87.969 },
  { id: "venus", g: 8.9, p: 224.701 },
  { id: "earth", g: 9.8, p: 365.256 },
  { id: "moon", g: 1.62, p: 0 },
  { id: "mars", g: 3.7, p: 686.98 },
  { id: "jupiter", g: 23.1, p: 4332.589 },
  { id: "saturn", g: 9.0, p: 10759.22 },
  { id: "uranus", g: 8.7, p: 30688.5 },
  { id: "neptune", g: 11.0, p: 60182 },
  { id: "pluto", g: 0.62, p: 90560 },
];

const LY = 9.4607304725808e12; // km pro Lichtjahr
const DESTS: { id: string; km: number; name: Tx | string }[] = [
  { id: "moon", km: 384400, name: PLANET_TX.moon },
  { id: "sun", km: 149.6e6, name: "" },
  { id: "mars", km: 54.6e6, name: "" },
  { id: "jupiter", km: 588.5e6, name: "" },
  { id: "neptune", km: 4.305e9, name: "" },
  { id: "proxima", km: 4.2465 * LY, name: "Proxima Centauri" },
  { id: "milky", km: 26700 * LY, name: TRAVEL_TX.milky },
  { id: "andromeda", km: 2.537e6 * LY, name: TRAVEL_TX.andromeda },
];
const VEHICLES: { id: string; kmh: number; name: Tx | string }[] = [
  { id: "walk", kmh: 5, name: TRAVEL_TX.walk },
  { id: "car", kmh: 100, name: TRAVEL_TX.car },
  { id: "plane", kmh: 900, name: TRAVEL_TX.plane },
  { id: "voyager", kmh: 17 * 3600, name: "Voyager 1" },
  { id: "parker", kmh: 192.22 * 3600, name: "Parker Solar Probe" },
  { id: "light", kmh: 299792.458 * 3600, name: TRAVEL_TX.light },
];

function nf(lang: Lang, opts: Intl.NumberFormatOptions, v: number): string {
  try {
    return new Intl.NumberFormat(lang, opts).format(v);
  } catch {
    return String(Math.round(v * 100) / 100);
  }
}

function fmtDur(sec: number, lang: Lang): string {
  const Y = 31557600;
  let v = sec;
  let unit = "second";
  if (sec >= 2 * Y) { v = sec / Y; unit = "year"; }
  else if (sec >= 86400) { v = sec / 86400; unit = "day"; }
  else if (sec >= 3600) { v = sec / 3600; unit = "hour"; }
  else if (sec >= 60) { v = sec / 60; unit = "minute"; }
  const big = unit === "year" && v >= 1000;
  const frac = v < 10 ? 2 : v < 100 ? 1 : 0;
  return nf(lang, { style: "unit", unit, unitDisplay: "long", notation: big ? "compact" : "standard", compactDisplay: "long", maximumFractionDigits: big ? 1 : frac }, v);
}

function worldInfo(id: string, lang: Lang): { name: string; color: string } {
  if (id === "moon") return { name: localize(PLANET_TX.moon, lang), color: "#a9a9a6" };
  const b = findBody(id);
  return { name: b ? localize(b.name, lang) : id, color: b?.color ?? "#aaaaaa" };
}

const INPUT =
  "h-9 w-full border border-white/15 bg-black/40 px-2.5 text-xs text-foreground outline-none transition-colors focus:border-accent";
const TILE = "relative overflow-hidden border border-white/10 bg-black/35 px-2.5 pb-2.5 pt-2";

export default function SpaceCalculators({ index = "03" }: { index?: string }) {
  const { lang } = useLanguage();
  const [tab, setTab] = useState<"w" | "t">("w");
  const [weight, setWeight] = useState("70");
  const [birth, setBirth] = useState("");
  const [dest, setDest] = useState("mars");

  const w = parseFloat(weight.replace(",", "."));
  const wOk = Number.isFinite(w) && w > 0 && w < 1000;
  const bt = birth ? new Date(birth + "T00:00:00").getTime() : NaN;
  const days = (Date.now() - bt) / 86400000;
  const aOk = Number.isFinite(days) && days >= 0 && days < 365.25 * 130;

  const d = DESTS.find((x) => x.id === dest) ?? DESTS[0];
  const destName = (x: (typeof DESTS)[number]) =>
    typeof x.name === "string" ? (x.name || worldInfo(x.id, lang).name) : localize(x.name, lang);
  const tabs: { id: "w" | "t"; label: string }[] = [
    { id: "w", label: localize(PLANET_TX.wCol, lang) + " & " + localize(PLANET_TX.aCol, lang) },
    { id: "t", label: localize(TRAVEL_TX.title, lang) },
  ];

  return (
    <section className="mb-10">
      <SectionHeading index={index} label={localize(TOOLS_HEAD, lang)} />
      <div className="hud-card feat-card overflow-hidden p-3 sm:p-4">
        <div className="relative z-[1]">
          <div role="tablist" className="mb-3 flex gap-1 border-b border-white/10">
            {tabs.map((x) => (
              <button
                key={x.id}
                type="button"
                role="tab"
                aria-selected={tab === x.id}
                onClick={() => setTab(x.id)}
                className={
                  "label-mono -mb-px border-b-2 px-3 py-2 text-[10px] uppercase tracking-wider transition-colors " +
                  (tab === x.id ? "border-accent text-foreground" : "border-transparent text-muted hover:text-foreground")
                }
              >
                {x.label}
              </button>
            ))}
          </div>

          {tab === "w" ? (
            <div>
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="label-mono mb-1 block text-[9px] uppercase tracking-wider text-muted">{localize(PLANET_TX.weight, lang)}</span>
                  <input className={INPUT} type="number" inputMode="decimal" min={1} max={999} step="any" value={weight} onChange={(e) => setWeight(e.target.value)} />
                </label>
                <label className="block">
                  <span className="label-mono mb-1 block text-[9px] uppercase tracking-wider text-muted">{localize(PLANET_TX.birth, lang)}</span>
                  <input className={INPUT} style={{ colorScheme: "dark" }} type="date" value={birth} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setBirth(e.target.value)} />
                </label>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-5">
                {WORLDS.map((o) => {
                  const info = worldInfo(o.id, lang);
                  const wt = wOk ? (w * o.g) / G_EARTH : NaN;
                  const age = aOk && o.p > 0 ? days / o.p : NaN;
                  return (
                    <div key={o.id} className={TILE}>
                      <div className="flex items-center gap-1.5">
                        <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ background: info.color, boxShadow: "0 0 8px " + info.color }} />
                        <span className="label-mono truncate text-[10px] uppercase tracking-wide text-muted">{info.name}</span>
                      </div>
                      <p className="font-display mt-1 text-lg font-bold leading-none tabular-nums text-foreground">
                        {Number.isFinite(wt) ? nf(lang, { maximumFractionDigits: wt < 10 ? 1 : 0 }, wt) : "–"}
                        <span className="ml-1 text-[10px] font-normal text-muted">kg</span>
                      </p>
                      <p className="mt-1 h-3 truncate text-[10px] tabular-nums text-accent">
                        {Number.isFinite(age) ? nf(lang, { style: "unit", unit: "year", unitDisplay: "long", maximumFractionDigits: age < 10 ? 2 : 1 }, age) : " "}
                      </p>
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 h-[2px]"
                        style={{ width: Math.min(100, (o.g / 23.1) * 100) + "%", background: info.color, boxShadow: "0 0 8px " + info.color }}
                      />
                    </div>
                  );
                })}
              </div>
              <p className="mt-2 text-[9px] leading-relaxed text-muted">{localize(PLANET_TX.note, lang)}</p>
            </div>
          ) : (
            <div>
              <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
                {DESTS.map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    onClick={() => setDest(x.id)}
                    aria-pressed={dest === x.id}
                    className={
                      "label-mono shrink-0 border px-2.5 py-1.5 text-[10px] uppercase tracking-wide transition-colors " +
                      (dest === x.id ? "border-accent bg-accent/15 text-foreground" : "border-white/15 text-muted hover:border-accent hover:text-foreground")
                    }
                  >
                    {destName(x)}
                  </button>
                ))}
              </div>
              <p className="label-mono mt-2 text-[10px] uppercase tracking-wider text-muted">
                {localize(TRAVEL_TX.dist, lang)}{" "}
                <span className="tabular-nums text-accent">
                  ≈ {nf(lang, { notation: d.km >= 1e9 ? "compact" : "standard", compactDisplay: "long", maximumFractionDigits: d.km >= 1e9 ? 1 : 0 }, d.km)} km
                </span>
              </p>
              <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                {VEHICLES.map((v, i) => {
                  const sec = (d.km / v.kmh) * 3600;
                  return (
                    <div key={v.id} className={TILE}>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="label-mono truncate text-[10px] uppercase tracking-wide text-muted">{typeof v.name === "string" ? v.name : localize(v.name, lang)}</span>
                        <span className="shrink-0 text-[9px] tabular-nums text-muted/70">
                          {nf(lang, { notation: v.kmh >= 1e7 ? "compact" : "standard", compactDisplay: "short", maximumFractionDigits: 1 }, v.kmh)} km/h
                        </span>
                      </div>
                      <p className="font-display mt-1 truncate text-base font-bold leading-tight tabular-nums text-accent">{fmtDur(sec, lang)}</p>
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 h-[2px] bg-accent"
                        style={{ width: ((i + 1) / VEHICLES.length) * 100 + "%", boxShadow: "0 0 8px rgb(var(--hud-accent))", opacity: 0.8 }}
                      />
                    </div>
                  );
                })}
              </div>
              <p className="mt-2 text-[9px] leading-relaxed text-muted">{localize(TRAVEL_TX.note, lang)}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
