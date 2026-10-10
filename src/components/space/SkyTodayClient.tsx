"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Lang } from "@/contexts/LanguageContext";
import {
  PLANET_IDS, type PlanetId, constellationAtEcl, greatestElongations, jdOf, moonInfo, moonPhases, msOf,
  oppositions, planetPairs, planetPos, riseSet,
} from "@/lib/astro/ephemeris";
import { fill, type MeteorId, type SkyTodayText } from "@/lib/skyTodayText";

/**
 * „Himmel heute“: Mond, sichtbare Planeten, Zeiten für den eigenen Ort und
 * die nächsten Ereignisse. Der Server rendert alles schon einmal (für Google,
 * Zeitzone UTC); im Browser wird mit der echten Uhrzeit und der eigenen
 * Zeitzone neu gerechnet.
 */
export type ConstRef = { name: string; slug: string };

type Props = {
  lang: Lang;
  locale: string;
  serverNow: number;
  T: SkyTodayText;
  planetNames: Record<PlanetId, string>;
  consts: Record<string, ConstRef>;
  skyHref: string; // /sternenhimmel bzw. /en/sternenhimmel
  constBase: string; // /sternbilder bzw. /en/sternbilder
};

// Mindestabstand zur Sonne (Grad), ab dem ein Planet in der Dämmerung zu sehen ist
const MIN_ELONG: Record<PlanetId, number> = { mercury: 15, venus: 10, mars: 20, jupiter: 15, saturn: 18, uranus: 25, neptune: 25 };
const TELESCOPE: PlanetId[] = ["uranus", "neptune"];

// Meteorströme: Nacht des Höhepunkts (Monat 0-basiert, Tag) und ZHR
// (Quelle: IMO-Kalender / spaceinformer.com, Stand 2026–2027)
const METEORS: { id: MeteorId; m: number; d: number; zhr: number }[] = [
  { id: "QUA", m: 0, d: 3, zhr: 120 },
  { id: "LYR", m: 3, d: 21, zhr: 20 },
  { id: "ETA", m: 4, d: 5, zhr: 60 },
  { id: "PER", m: 7, d: 12, zhr: 100 },
  { id: "ORI", m: 9, d: 21, zhr: 25 },
  { id: "LEO", m: 10, d: 17, zhr: 15 },
  { id: "GEM", m: 11, d: 13, zhr: 150 },
];
// Sonnenfinsternisse (NASA, eclipse.gsfc.nasa.gov – Zeit = größte Finsternis, UT)
const ECLIPSES: { ms: number; kind: "total" | "ann"; key: "ecl2027aug" | "ecl2027feb" }[] = [
  { ms: Date.UTC(2027, 1, 6, 16, 0), kind: "ann", key: "ecl2027feb" },
  { ms: Date.UTC(2027, 7, 2, 10, 7), kind: "total", key: "ecl2027aug" },
];

type Status = "stEveLow" | "stEve" | "stAll" | "stMorn" | "stMornLow" | "stNone";
function status(id: PlanetId, elong: number): Status {
  const a = Math.abs(elong);
  if (a < MIN_ELONG[id]) return "stNone";
  if (a >= 135) return "stAll";
  if (elong > 0) return a < 45 ? "stEveLow" : "stEve";
  return a < 45 ? "stMornLow" : "stMorn";
}

type Ev = { ms: number; text: string; sub?: string; withTime: boolean };

function ymd(ms: number, tz: string | undefined): number {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(ms));
  const g = (t: string) => Number(p.find((x) => x.type === t)?.value);
  return Date.UTC(g("year"), g("month") - 1, g("day")) / 86400000;
}

export default function SkyTodayClient({ lang, locale, serverNow, T, planetNames, consts, skyHref, constBase }: Props) {
  // erst wie der Server (gleiches Ergebnis → kein Hydration-Fehler), dann echte Zeit + eigene Zeitzone
  const [now, setNow] = useState(serverNow);
  const [tz, setTz] = useState<string | undefined>("UTC");
  useEffect(() => {
    setTz(undefined);
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 10 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const hourKey = Math.floor(now / 3600000);
  const data = useMemo(() => {
    const jd = jdOf(now);
    const moon = moonInfo(jd);
    const planets = PLANET_IDS.map((id) => {
      const p = planetPos(id, jd);
      return { ...p, st: status(id, p.elong), cst: constellationAtEcl(p.lon, p.lat, jd) };
    });
    const phases = moonPhases(jd, 35);
    const nextFull = phases.find((p) => p.kind === "full");
    const nextNew = phases.find((p) => p.kind === "new");

    const ev: Ev[] = [];
    for (const p of phases) if (p.kind === "full" || p.kind === "new") ev.push({ ms: msOf(p.jd), text: p.kind === "full" ? T.evFull : T.evNew, withTime: true });
    for (const o of oppositions(jd, 365)) ev.push({ ms: msOf(o.jd), text: fill(T.evOpp, { p: planetNames[o.id] }), withTime: false });
    for (const g of greatestElongations(jd, 250)) ev.push({ ms: msOf(g.jd), text: fill(g.east ? T.evElE : T.evElW, { p: planetNames[g.id], d: Math.round(g.deg) }), withTime: false });
    for (const c of planetPairs(jd, 200, 2)) ev.push({ ms: msOf(c.jd), text: fill(T.evPair, { a: planetNames[c.a], b: planetNames[c.b], d: new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(c.deg) }), withTime: false });
    const y = new Date(now).getUTCFullYear();
    for (const m of METEORS) for (const yy of [y, y + 1]) {
      const peak = Date.UTC(yy, m.m, m.d, 23);
      if (peak + 12 * 3600000 > now && peak < now + 365 * 86400000) {
        const lit = Math.round(moonInfo(jdOf(peak)).illum * 100);
        ev.push({ ms: peak, text: fill(T.evMeteor, { n: T.meteors[m.id], z: m.zhr }), sub: fill(T.meteorMoon, { pct: lit }), withTime: false });
      }
    }
    for (const e of ECLIPSES) if (e.ms > now - 6 * 3600000) {
      const [central, partial] = T[e.key];
      ev.push({ ms: e.ms, text: fill(e.kind === "total" ? T.evSolarTotal : T.evSolarAnn, { r: central }), sub: fill(T.partialIn, { r: partial }), withTime: true });
    }
    ev.sort((a, b) => a.ms - b.ms);
    // die ersten 16 Termine; Sonnenfinsternisse immer zeigen, auch wenn sie später sind
    return { jd, moon, moonCst: constellationAtEcl(moon.lon, moon.lat, jd), planets, nextFull, nextNew, events: [...ev.slice(0, 16), ...ev.slice(16).filter((e) => e.sub && e.withTime)] };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hourKey, lang]);

  const fmt = (ms: number, withTime: boolean) =>
    new Intl.DateTimeFormat(locale, {
      timeZone: tz, day: "numeric", month: "long",
      ...(new Date(ms).getUTCFullYear() !== new Date(now).getUTCFullYear() ? { year: "numeric" } : {}),
      ...(withTime ? { hour: "2-digit", minute: "2-digit", timeZoneName: "short" } : {}),
    }).format(new Date(ms));
  const fmtTime = (ms: number) => new Intl.DateTimeFormat(locale, { timeZone: tz, hour: "2-digit", minute: "2-digit" }).format(new Date(ms));
  const rel = (ms: number) => {
    const d = ymd(ms, tz) - ymd(now, tz);
    return d <= 0 ? T.today : d === 1 ? T.tomorrow : fill(T.inDays, { n: d });
  };
  const constLink = (abbr: string | null) => {
    const c = abbr ? consts[abbr] : null;
    if (!c) return null;
    return (
      <Link href={`${constBase}/${c.slug}`} className="text-accent hover:underline">{c.name}</Link>
    );
  };
  const pctFmt = (x: number) => Math.round(x * 100);
  const magFmt = (m: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(m);

  // ---- Zeiten für den eigenen Ort ----
  const [pos, setPos] = useState<{ lat: number; lon: number } | null>(null);
  const [geoErr, setGeoErr] = useState(false);
  const askGeo = () => {
    setGeoErr(false);
    if (!navigator.geolocation) { setGeoErr(true); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => setPos({ lat: p.coords.latitude, lon: p.coords.longitude }),
      () => setGeoErr(true),
      { maximumAge: 3600000, timeout: 15000 },
    );
  };
  const localRows = useMemo(() => {
    if (!pos) return null;
    const jd = jdOf(now);
    const ids: ("sun" | "moon" | PlanetId)[] = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn"];
    return ids.map((id) => ({ id, ...riseSet(id, jd, pos.lat, pos.lon) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos, Math.floor(now / 600000)]);

  const moonEmoji = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"][["new", "waxCres", "firstQ", "waxGib", "full", "wanGib", "lastQ", "wanCres"].indexOf(data.moon.phase)];
  const phaseIdx = ["new", "waxCres", "firstQ", "waxGib", "full", "wanGib", "lastQ", "wanCres"].indexOf(data.moon.phase);
  const visible = [...data.planets].sort((a, b) => (a.st === "stNone" ? 1 : 0) - (b.st === "stNone" ? 1 : 0) || a.mag - b.mag);

  return (
    <div className="mt-6 space-y-10">
      <p suppressHydrationWarning className="label-mono text-xs uppercase text-muted">{fill(T.asOf, { time: fmt(now, true) })}</p>

      {/* Mond */}
      <section aria-labelledby="h-moon">
        <h2 id="h-moon" className="font-display text-xl font-bold text-foreground sm:text-2xl">{T.h2Moon}</h2>
        <div className="hud-card mt-3 flex flex-col gap-4 border border-border p-4 sm:flex-row sm:items-center">
          <span aria-hidden="true" className="text-6xl leading-none">{moonEmoji}</span>
          <div className="space-y-1 text-sm">
            <p className="text-lg text-foreground">{T.phases[phaseIdx]}</p>
            <p className="text-muted">{fill(T.illum, { pct: pctFmt(data.moon.illum) })}</p>
            {data.moonCst && consts[data.moonCst] && <p className="text-muted">{T.constLabel}: {constLink(data.moonCst)}</p>}
          </div>
          <dl className="grid grid-cols-1 gap-2 text-sm sm:ms-auto sm:text-end">
            {data.nextFull && (
              <div>
                <dt className="label-mono text-[11px] uppercase text-muted">{T.nextFull}</dt>
                <dd suppressHydrationWarning className="text-foreground">{fmt(msOf(data.nextFull.jd), true)} <span className="text-muted">· {rel(msOf(data.nextFull.jd))}</span></dd>
              </div>
            )}
            {data.nextNew && (
              <div>
                <dt className="label-mono text-[11px] uppercase text-muted">{T.nextNew}</dt>
                <dd suppressHydrationWarning className="text-foreground">{fmt(msOf(data.nextNew.jd), true)} <span className="text-muted">· {rel(msOf(data.nextNew.jd))}</span></dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      {/* Planeten */}
      <section aria-labelledby="h-planets">
        <h2 id="h-planets" className="font-display text-xl font-bold text-foreground sm:text-2xl">{T.h2Planets}</h2>
        <p className="mt-1 text-sm text-muted">{T.planetsNote}</p>
        <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {visible.map((p) => (
            <li key={p.id} className={`hud-card border p-3 ${p.st === "stNone" ? "border-border opacity-60" : "border-border"}`}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-base text-foreground">{planetNames[p.id]}</span>
                {p.st !== "stNone" && (
                  <span className="label-mono text-[10px] uppercase text-muted">{TELESCOPE.includes(p.id) ? T.eyeAid : T.eyeNaked}</span>
                )}
              </div>
              <p className={`mt-1 text-sm ${p.st === "stNone" ? "text-muted" : "text-accent"}`}>{T[p.st]}</p>
              <p className="mt-1 text-xs text-muted">
                {p.cst && consts[p.cst] ? <>{T.constLabel}: {constLink(p.cst)} · </> : null}
                {fill(T.brightness, { m: magFmt(p.mag) })}
              </p>
              {p.st !== "stNone" && (
                <a href={`${skyHref}?p=${p.id}`} className="mt-2 inline-block text-xs uppercase tracking-wide text-accent hover:underline">▶ {T.showSky}</a>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Eigener Ort */}
      <section aria-labelledby="h-local">
        <h2 id="h-local" className="font-display text-xl font-bold text-foreground sm:text-2xl">{T.h2Local}</h2>
        {!localRows && (
          <button type="button" onClick={askGeo} className="mt-3 border border-accent px-4 py-2.5 text-sm uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-black">
            📍 {T.localBtn}
          </button>
        )}
        <p className="mt-2 text-xs text-muted">{T.localHint}</p>
        {geoErr && <p className="mt-2 text-sm text-red-400">{T.localDenied}</p>}
        {localRows && (
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="label-mono text-[11px] uppercase text-muted">
                <th className="py-1 text-start font-normal" />
                <th className="py-1 text-start font-normal">{T.rise}</th>
                <th className="py-1 text-start font-normal">{T.set}</th>
              </tr>
            </thead>
            <tbody>
              {localRows.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="py-1.5 text-foreground">{r.id === "sun" ? T.sun : r.id === "moon" ? T.moon : planetNames[r.id]}</td>
                  <td className="py-1.5 text-foreground">{r.rise !== null ? fmtTime(msOf(r.rise)) : T.none}</td>
                  <td className="py-1.5 text-foreground">{r.set !== null ? fmtTime(msOf(r.set)) : r.up && r.rise === null ? T.upAllDay : T.none}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Ereignisse */}
      <section aria-labelledby="h-events">
        <h2 id="h-events" className="font-display text-xl font-bold text-foreground sm:text-2xl">{T.h2Events}</h2>
        <ol className="mt-3 space-y-2">
          {data.events.map((e, i) => (
            <li key={i} className="hud-card border border-border p-3">
              <p suppressHydrationWarning className="label-mono text-[11px] uppercase text-muted">{fmt(e.ms, e.withTime)} · {rel(e.ms)}</p>
              <p className="mt-1 text-sm text-foreground">{e.text}</p>
              {e.sub && <p className="mt-0.5 text-xs text-muted">{e.sub}</p>}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
