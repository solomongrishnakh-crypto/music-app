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
  "w-full border border-border bg-background/60 px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent";

export default function SpaceCalculators({ index = "05" }: { index?: string }) {
  const { lang } = useLanguage();
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

  return (
    <section className="mb-10">
      <SectionHeading index={index} label={localize(TOOLS_HEAD, lang)} />
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* Gewicht & Alter */}
        <div className="hud-card p-4">
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-foreground">{localize(PLANET_TX.title, lang)}</h3>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="block">
              <span className="label-mono mb-1 block text-[10px] uppercase text-muted">{localize(PLANET_TX.weight, lang)}</span>
              <input className={INPUT} type="number" inputMode="decimal" min={1} max={999} step="any" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </label>
            <label className="block">
              <span className="label-mono mb-1 block text-[10px] uppercase text-muted">{localize(PLANET_TX.birth, lang)}</span>
              <input className={INPUT} style={{ colorScheme: "dark" }} type="date" value={birth} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setBirth(e.target.value)} />
            </label>
          </div>
          <div className="label-mono mt-4 grid grid-cols-[1fr_5.5rem_7rem] gap-2 border-b border-border pb-1 text-[10px] uppercase text-muted">
            <span />
            <span className="text-end">{localize(PLANET_TX.wCol, lang)}</span>
            <span className="text-end">{localize(PLANET_TX.aCol, lang)}</span>
          </div>
          <ul className="divide-y divide-border/60">
            {WORLDS.map((o) => {
              const info = worldInfo(o.id, lang);
              const wt = wOk ? (w * o.g) / G_EARTH : NaN;
              const age = aOk && o.p > 0 ? days / o.p : NaN;
              return (
                <li key={o.id} className="grid grid-cols-[1fr_5.5rem_7rem] items-center gap-2 py-1.5 text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: info.color }} />
                    <span className="truncate text-foreground">{info.name}</span>
                  </span>
                  <span className="text-end tabular-nums text-accent">
                    {Number.isFinite(wt) ? nf(lang, { maximumFractionDigits: wt < 10 ? 1 : 0 }, wt) + " kg" : "–"}
                  </span>
                  <span className="text-end text-xs tabular-nums text-muted">
                    {Number.isFinite(age) ? nf(lang, { style: "unit", unit: "year", unitDisplay: "long", maximumFractionDigits: age < 10 ? 2 : 1 }, age) : "–"}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-[10px] leading-relaxed text-muted">{localize(PLANET_TX.note, lang)}</p>
        </div>

        {/* Reisezeit */}
        <div className="hud-card p-4">
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-foreground">{localize(TRAVEL_TX.title, lang)}</h3>
          <label className="mt-3 block">
            <span className="label-mono mb-1 block text-[10px] uppercase text-muted">{localize(TRAVEL_TX.dest, lang)}</span>
            <select className={INPUT} value={dest} onChange={(e) => setDest(e.target.value)}>
              {DESTS.map((x) => (
                <option key={x.id} value={x.id} className="bg-background text-foreground">
                  {destName(x)}
                </option>
              ))}
            </select>
          </label>
          <p className="mt-3 text-xs text-muted">
            {localize(TRAVEL_TX.dist, lang)}:{" "}
            <span className="tabular-nums text-accent">
              ≈ {nf(lang, { notation: d.km >= 1e9 ? "compact" : "standard", compactDisplay: "long", maximumFractionDigits: d.km >= 1e9 ? 1 : 0 }, d.km)} km
            </span>
          </p>
          <ul className="mt-2 divide-y divide-border/60">
            {VEHICLES.map((v) => {
              const sec = (d.km / v.kmh) * 3600;
              return (
                <li key={v.id} className="grid grid-cols-[1fr_auto] items-baseline gap-x-3 py-1.5">
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-foreground">{typeof v.name === "string" ? v.name : localize(v.name, lang)}</span>
                    <span className="block text-[10px] tabular-nums text-muted">
                      {nf(lang, { notation: v.kmh >= 1e7 ? "compact" : "standard", compactDisplay: "short", maximumFractionDigits: 1 }, v.kmh)} km/h
                    </span>
                  </span>
                  <span className="text-end text-sm tabular-nums text-accent">{fmtDur(sec, lang)}</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-[10px] leading-relaxed text-muted">{localize(TRAVEL_TX.note, lang)}</p>
        </div>
      </div>
    </section>
  );
}
