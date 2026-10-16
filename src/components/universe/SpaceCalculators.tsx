"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { findBody } from "@/components/space/bodies";
import { useLanguage, type Lang } from "@/contexts/LanguageContext";
import { localize } from "@/lib/i18n";
import { bodyPosition, dateToJd } from "@/lib/astro/orbits";
import { moonPos } from "@/lib/astro/ephemeris";
import { EXTRA, KIND_TX, LY_KM, SEARCH_TX, normSearch } from "@/lib/deepSky";
import { JOURNEY2_TX, JOURNEY_TX, PLANET_TX, TOOLS_HEAD, TRAVEL_TX, type Tx } from "@/lib/toolsText";

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
type Dest = { id: string; km: number; name: Tx | string; color: string; de?: string; kind?: keyof typeof KIND_TX; alias?: string };
const DESTS: Dest[] = [
  { id: "moon", km: 384400, name: PLANET_TX.moon, color: "#a9a9a6" },
  { id: "sun", km: 149.6e6, name: "", color: "#ffd166" },
  { id: "mars", km: 54.6e6, name: "", color: "#c1623f" },
  { id: "jupiter", km: 588.5e6, name: "", color: "#c9a27c" },
  { id: "neptune", km: 4.305e9, name: "", color: "#3d5fd6" },
  { id: "proxima", km: 4.2465 * LY, name: "Proxima Centauri", color: "#ff6b3d" },
  { id: "sirius", km: 8.611 * LY, name: JOURNEY2_TX.sirius, color: "#bcd4ff" },
  { id: "betel", km: 550 * LY, name: JOURNEY2_TX.betel, color: "#ff7a45" },
  { id: "neutron", km: 510 * LY, name: JOURNEY2_TX.neutron, color: "#8fd3ff" },
  { id: "bh", km: 1560 * LY, name: JOURNEY2_TX.bh, color: "#b36bff" },
  { id: "milky", km: 26700 * LY, name: TRAVEL_TX.milky, color: "#ffe2b0" },
  { id: "andromeda", km: 2.537e6 * LY, name: TRAVEL_TX.andromeda, color: "#ffd9c0" },
];
const ALL_DESTS: Dest[] = [...DESTS, ...EXTRA.map((e) => ({ id: e.id, km: e.km, name: e.name, color: e.color, de: e.de, kind: e.kind, alias: e.alias }))];
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

const cm = (f: string) => "https://commons.wikimedia.org/wiki/Special:FilePath/" + f + "?width=240";
const IMG: Record<string, string> = {
  mercury: cm("Mercury_in_color_-_Prockter07-edit1.jpg"),
  venus: cm("Venus-real_color.jpg"),
  earth: cm("The_Blue_Marble_(remastered).jpg"),
  moon: cm("FullMoon2010.jpg"),
  mars: cm("OSIRIS_Mars_true_color.jpg"),
  jupiter: cm("Jupiter_by_Cassini-Huygens.jpg"),
  saturn: cm("Saturn_during_Equinox.jpg"),
  uranus: cm("Uranus2.jpg"),
  neptune: cm("Neptune_Full.jpg"),
  pluto: cm("Pluto_in_True_Color_-_High-Res.jpg"),
  sun: cm("The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA's_Solar_Dynamics_Observatory_-_20100819.jpg"),
  proxima: cm("New_shot_of_Proxima_Centauri,_our_nearest_neighbour.jpg"),
  sirius: cm("Sirius_A_and_B_Hubble_photo.jpg"),
  betel: cm("Betelgeuse_captured_by_ALMA.jpg"),
  bh: cm("Black_hole_-_Messier_87_crop_max_res.jpg"),
  milky: cm("Milky_Way_Galaxy.jpg"),
  andromeda: cm("Andromeda_Galaxy_(with_h-alpha).jpg"),
};

function Thumb({ id, size, color }: { id: string; size: number; color: string }) {
  const [bad, setBad] = useState(false);
  const src = IMG[id];
  if (!src || bad) {
    const bh = id === "bh";
    const dia = size * 0.6;
    return (
      <span className="flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
        <span
          aria-hidden="true"
          className="block rounded-full"
          style={{
            width: dia,
            height: dia,
            background: bh ? "#000" : "radial-gradient(circle at 35% 35%, #ffffff, " + color + " 60%)",
            border: bh ? "3px solid " + color : undefined,
            boxShadow: "0 0 " + (bh ? 14 : 10) + "px " + color,
          }}
        />
      </span>
    );
  }
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => setBad(true)}
      className="shrink-0 object-contain"
      style={{ width: size, height: size, filter: "drop-shadow(0 0 6px " + color + ")" }}
    />
  );
}

const C_KMH = 299792.458 * 3600;
const ROUTE_TX: Tx = {
  de: "Route", en: "Route", es: "Ruta", fr: "Itinéraire", pt: "Rota", tr: "Rota", ru: "Маршрут", el: "Διαδρομή",
  ar: "المسار", hi: "मार्ग", zh: "航线", ja: "航路", ko: "항로",
};
const LIMIT_TX: Tx = {
  de: "Schneller als Licht geht nichts – gerechnet mit Lichtgeschwindigkeit.", en: "Nothing travels faster than light – calculated at light speed.",
  es: "Nada viaja más rápido que la luz: calculado a la velocidad de la luz.", fr: "Rien ne va plus vite que la lumière : calcul à la vitesse de la lumière.",
  pt: "Nada viaja mais rápido que a luz: calculado à velocidade da luz.", tr: "Işıktan hızlı hiçbir şey yoktur: ışık hızıyla hesaplandı.",
  ru: "Ничто не движется быстрее света: расчёт при скорости света.", el: "Τίποτα δεν κινείται ταχύτερα από το φως: υπολογισμός με την ταχύτητα του φωτός.",
  ar: "لا شيء أسرع من الضوء — الحساب بسرعة الضوء.", hi: "प्रकाश से तेज़ कुछ नहीं चलता – गणना प्रकाश की गति पर की गई है।",
  zh: "没有什么比光更快——已按光速计算。", ja: "光より速いものはありません。光速で計算しています。", ko: "빛보다 빠른 것은 없습니다. 광속으로 계산했습니다.",
};
const KM_AU = 149597870.7;
// Aktueller Abstand Erde → Ziel aus den Bahndaten (wie im 3D-Sonnensystem); Sterne und Galaxien bleiben fest
function liveKm(id: string, fixed: number): number {
  try {
    const jd = dateToJd(new Date());
    if (id === "moon") return moonPos(jd).distKm;
    const e = bodyPosition("earth", jd);
    const b = id === "sun" ? ([0, 0, 0] as [number, number, number]) : bodyPosition(id, jd);
    if (!e || !b) return fixed;
    return Math.hypot(b[0] - e[0], b[1] - e[1], b[2] - e[2]) * KM_AU;
  } catch {
    return fixed;
  }
}

function fmtKm(km: number, lang: Lang): string {
  const big = km >= 1e9;
  return nf(lang, { notation: big ? "compact" : "standard", compactDisplay: "long", maximumFractionDigits: big ? 1 : km < 100 ? 2 : 0 }, km) + " km";
}

function worldInfo(id: string, lang: Lang): { name: string; color: string } {
  if (id === "moon") return { name: localize(PLANET_TX.moon, lang), color: "#a9a9a6" };
  const b = findBody(id);
  return { name: b ? localize(b.name, lang) : id, color: b?.color ?? "#aaaaaa" };
}

const INPUT =
  "h-9 w-full border border-white/15 bg-black/40 px-2.5 text-xs text-foreground outline-none transition-colors focus:border-accent";
const LBL = "label-mono text-[10px] uppercase tracking-wider text-muted";
const TILE = "relative overflow-hidden border border-white/10 bg-black/35 px-2.5 pb-2.5 pt-2";

export default function SpaceCalculators({ index = "03" }: { index?: string }) {
  const { lang } = useLanguage();
  const [tab, setTab] = useState<"w" | "t">("t");
  const [weight, setWeight] = useState("70");
  const [birth, setBirth] = useState("");
  const [dest, setDest] = useState("mars");
  const [sel, setSel] = useState("car");
  const [cust, setCust] = useState("1000");
  const [cunit, setCunit] = useState<"kmh" | "kms" | "c">("kmh");
  const [run, setRun] = useState(false);
  const [simT, setSimT] = useState(0);
  const [now, setNow] = useState(0);
  const base = useRef(0);
  const anchor = useRef(0);
  const lapseRef = useRef(1);
  const startedRef = useRef(false);
  const pendingGo = useRef(false);

  const w = parseFloat(weight.replace(",", "."));
  const wOk = Number.isFinite(w) && w > 0 && w < 1000;
  const bt = birth ? new Date(birth + "T00:00:00").getTime() : NaN;
  const days = (Date.now() - bt) / 86400000;
  const aOk = Number.isFinite(days) && days >= 0 && days < 365.25 * 130;

  const [tick, setTick] = useState(0);
  const dBase = ALL_DESTS.find((x) => x.id === dest) ?? DESTS[0];
  const kmNow = useMemo(() => (tick > 0 ? liveKm(dBase.id, dBase.km) : dBase.km), [tick, dBase.id, dBase.km]);
  const d = { ...dBase, km: kmNow };
  const destName = (x: Dest) =>
    typeof x.name === "string" ? (lang === "de" && x.de ? x.de : x.name || worldInfo(x.id, lang).name) : localize(x.name, lang);
  const [q, setQ] = useState("");
  const hits = useMemo(() => {
    const k = normSearch(q.trim());
    if (!k) return [];
    return ALL_DESTS.filter((x) => {
      const hay = [destName(x), typeof x.name === "string" ? x.name : "", x.de ?? "", x.alias ?? "", x.kind ? localize(KIND_TX[x.kind], lang) : "", x.kind ? KIND_TX[x.kind].en : ""].map(normSearch).join(" ");
      return hay.includes(k);
    }).slice(0, 8);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, lang]);
  const tabs: { id: "w" | "t"; label: string }[] = [
    { id: "t", label: localize(TRAVEL_TX.title, lang) },
    { id: "w", label: localize(PLANET_TX.wCol, lang) + " & " + localize(PLANET_TX.aCol, lang) },
  ];

  // Geschwindigkeit: Fahrzeug oder eigene Eingabe (höchstens Lichtgeschwindigkeit)
  const cv = parseFloat(cust.replace(",", "."));
  const custKmh = !Number.isFinite(cv) || cv <= 0 ? NaN : Math.min(C_KMH, cunit === "kmh" ? cv : cunit === "kms" ? cv * 3600 : (cv / 100) * C_KMH);
  const custCapped = Number.isFinite(cv) && cv > 0 && (cunit === "kmh" ? cv : cunit === "kms" ? cv * 3600 : (cv / 100) * C_KMH) > C_KMH;
  const veh = VEHICLES.find((v) => v.id === sel);
  const speedKmh = sel === "custom" ? custKmh : veh ? veh.kmh : NaN;
  const speedKms = speedKmh / 3600;
  const totalS = Number.isFinite(speedKmh) ? (d.km / speedKmh) * 3600 : NaN;
  const traveled = Number.isFinite(speedKms) ? Math.min(d.km, speedKms * simT) : 0;
  const prog = d.km > 0 ? traveled / d.km : 0;
  const pct = Math.round(Math.min(1, Math.max(0, prog)) * 100);
  const fmtKm = (km: number) =>
    km >= LY_KM / 10
      ? nf(lang, { notation: "compact", compactDisplay: "short", maximumFractionDigits: 2 }, km / LY_KM) + " " + localize(SEARCH_TX.ly, lang)
      : nf(lang, { notation: "compact", compactDisplay: "short", maximumFractionDigits: 1 }, km) + " km";
  const arrived = Number.isFinite(totalS) && simT >= totalS;

  // Abstand regelmäßig aktualisieren (nur solange keine Reise läuft oder pausiert ist)
  useEffect(() => {
    setTick(1);
    const t = setInterval(() => {
      if (!startedRef.current) setTick((n) => n + 1);
    }, 30000);
    return () => clearInterval(t);
  }, []);

  // Reise zurücksetzen, wenn Ziel oder Geschwindigkeit wechseln
  useEffect(() => {
    setRun(false);
    setSimT(0);
    base.current = 0;
    if (pendingGo.current) {
      pendingGo.current = false;
      anchor.current = performance.now();
      lapseRef.current = 1;
      setRun(true);
    }
  }, [dest, sel, speedKmh]);

  // Live-Animation der Reise
  useEffect(() => {
    if (!run || !Number.isFinite(totalS)) return;
    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      if (t - last > 33) {
        last = t;
        const st = base.current + ((t - anchor.current) / 1000) * lapseRef.current;
        if (st >= totalS) {
          setSimT(totalS);
          base.current = totalS;
          setRun(false);
          return;
        }
        setSimT(st);
        setNow(t);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [run, totalS]);

  function startStop() {
    if (run) {
      setRun(false);
      return;
    }
    if (!Number.isFinite(totalS)) return;
    if (arrived) {
      base.current = 0;
      setSimT(0);
    } else {
      base.current = simT;
    }
    anchor.current = performance.now();
    lapseRef.current = 1; // Echtzeit
    setRun(true);
  }
  // "Los": Reise sofort mit der eingegebenen Geschwindigkeit starten
  function goCustom() {
    if (!Number.isFinite(custKmh)) return;
    if (sel === "custom") {
      base.current = 0;
      setSimT(0);
      anchor.current = performance.now();
      lapseRef.current = 1;
      setRun(true);
    } else {
      pendingGo.current = true;
      setSel("custom");
    }
  }
  function resetTrip() {
    setRun(false);
    setSimT(0);
    base.current = 0;
  }
  // Ankunftsdatum bei Start jetzt (bei sehr langen Reisen kein Datum)
  const arriveTxt = (() => {
    if (tick === 0 || !Number.isFinite(totalS) || totalS / 31557600 > 7000) return "–";
    try {
      const o: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
      if (totalS < 86400) {
        o.hour = "2-digit";
        o.minute = "2-digit";
      }
      return new Intl.DateTimeFormat(lang, o).format(new Date(Date.now() + totalS * 1000));
    } catch {
      return "–";
    }
  })();

  const earth = worldInfo("earth", lang);
  const started = run || simT > 0;
  startedRef.current = started;

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
                    <div key={o.id} className={TILE + " flex items-center gap-2"}>
                      <Thumb id={o.id} size={36} color={info.color} />
                      <div className="min-w-0 flex-1">
                        <span className="label-mono block truncate text-[10px] uppercase tracking-wide text-muted">{info.name}</span>
                        <p className="font-display mt-0.5 text-lg font-bold leading-none tabular-nums text-foreground">
                          {Number.isFinite(wt) ? nf(lang, { maximumFractionDigits: wt < 10 ? 1 : 0 }, wt) : "–"}
                          <span className="ml-1 text-[10px] font-normal text-muted">kg</span>
                        </p>
                        <p className="mt-1 min-h-[12px] truncate text-[10px] tabular-nums text-accent">
                          {Number.isFinite(age) ? nf(lang, { style: "unit", unit: "year", unitDisplay: "long", maximumFractionDigits: age < 10 ? 2 : 1 }, age) : ""}
                        </p>
                      </div>
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
              <p className={LBL}>{localize(JOURNEY2_TX.s1, lang)}</p>
              <div className="mt-1.5 grid grid-cols-4 gap-1.5 sm:grid-cols-6">
                {DESTS.map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    onClick={() => setDest(x.id)}
                    aria-pressed={dest === x.id}
                    className={
                      "flex flex-col items-center gap-1 border px-1 py-1.5 transition-colors " +
                      (dest === x.id ? "border-accent bg-accent/15 text-foreground" : "border-white/10 text-muted hover:border-accent hover:text-foreground")
                    }
                  >
                    <Thumb id={x.id} size={30} color={x.color} />
                    <span className="label-mono w-full break-words text-center text-[8px] uppercase leading-tight tracking-wide">{destName(x)}</span>
                  </button>
                ))}
              </div>
              <div className="mt-1.5">
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={localize(SEARCH_TX.ph, lang)}
                  aria-label={localize(SEARCH_TX.ph, lang)}
                  className={INPUT}
                />
                {q.trim() !== "" && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {hits.length === 0 && <span className="text-[10px] text-muted">{localize(SEARCH_TX.none, lang)}</span>}
                    {hits.map((x) => (
                      <button
                        key={x.id}
                        type="button"
                        onClick={() => { setDest(x.id); setQ(""); }}
                        className="flex items-center gap-1.5 border border-white/10 px-2 py-1 text-left text-muted transition-colors hover:border-accent hover:text-foreground"
                      >
                        <Thumb id={x.id} size={18} color={x.color} />
                        <span className="text-[10px] text-foreground">{destName(x)}</span>
                        {x.kind && <span className="label-mono text-[8px] uppercase">{localize(KIND_TX[x.kind], lang)}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="label-mono mt-2 text-[10px] uppercase tracking-wider text-muted">
                {destName(d)} · {localize(TRAVEL_TX.dist, lang)} <span className="tabular-nums text-accent">≈ {d.km >= 1e15 ? "" : fmtKm(d.km, lang)}</span>
                {d.km >= LY_KM / 2 && (
                  <span className={"normal-case" + (d.km >= 1e15 ? " tabular-nums text-accent" : "")}> {d.km >= 1e15 ? "" : "("}{nf(lang, { notation: "compact", compactDisplay: "long", maximumFractionDigits: d.km / LY_KM < 10 ? 2 : 1 }, d.km / LY_KM)} {localize(SEARCH_TX.ly, lang)}{d.km >= 1e15 ? "" : ")"}</span>
                )}
              </p>

              <p className={LBL + " mt-4"}>{localize(JOURNEY2_TX.s2, lang)}</p>
              <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                {VEHICLES.map((v) => {
                  const sec = (d.km / v.kmh) * 3600;
                  const on = sel === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSel(v.id)}
                      aria-pressed={on}
                      className={TILE + " text-left transition-colors " + (on ? "border-accent bg-accent/10" : "hover:border-white/30")}
                    >
                      <span className="label-mono block truncate text-[9px] uppercase tracking-wide text-muted">{typeof v.name === "string" ? v.name : localize(v.name, lang)}</span>
                      <p className="font-display mt-0.5 break-words text-sm font-bold leading-tight tabular-nums text-accent">{fmtDur(sec, lang)}</p>
                    </button>
                  );
                })}
                <div
                  className={TILE + " col-span-3 transition-colors " + (sel === "custom" ? "border-accent bg-accent/10" : "")}
                  onClick={() => setSel("custom")}
                >
                  <span className="label-mono block truncate text-[9px] uppercase tracking-wide text-muted">{localize(JOURNEY_TX.custom, lang)}</span>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <input
                      className="h-7 w-24 min-w-0 border border-white/15 bg-black/40 px-2 text-xs tabular-nums text-foreground outline-none focus:border-accent"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="any"
                      value={cust}
                      onFocus={() => setSel("custom")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") goCustom();
                      }}
                      onChange={(e) => {
                        setCust(e.target.value);
                        setSel("custom");
                      }}
                    />
                    {(["kmh", "kms", "c"] as const).map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => {
                          setCunit(u);
                          setSel("custom");
                        }}
                        aria-pressed={cunit === u}
                        className={
                          "label-mono h-7 border px-1.5 text-[9px] uppercase transition-colors " +
                          (cunit === u ? "border-accent text-foreground" : "border-white/15 text-muted hover:text-foreground")
                        }
                      >
                        {u === "kmh" ? "km/h" : u === "kms" ? "km/s" : "% c"}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={goCustom}
                      disabled={!Number.isFinite(custKmh)}
                      className="label-mono ml-auto h-7 border border-accent bg-accent/20 px-3 text-[10px] uppercase tracking-wider text-foreground transition-colors hover:bg-accent/35 disabled:opacity-40"
                    >
                      ▶ {localize(JOURNEY_TX.go, lang)}
                    </button>
                  </div>
                  {sel === "custom" && custCapped && <p className="mt-1.5 text-[10px] leading-snug text-accent">{localize(LIMIT_TX, lang)}</p>}
                </div>
              </div>

              <div className={"mt-4 border bg-black/40 p-3 transition-colors " + (arrived ? "border-accent" : "border-white/10")}>
                <div className="grid grid-cols-2 gap-x-3">
                  <div>
                    <span className="label-mono block text-[9px] uppercase tracking-wider text-muted">{localize(JOURNEY_TX.duration, lang)}</span>
                    <span className="font-display block break-words text-base font-bold leading-tight tabular-nums text-accent">{Number.isFinite(totalS) ? fmtDur(totalS, lang) : "–"}</span>
                  </div>
                  <div>
                    <span className="label-mono block text-[9px] uppercase tracking-wider text-muted">{localize(JOURNEY_TX.arrival, lang)}</span>
                    <span className="font-display block break-words text-base font-bold leading-tight tabular-nums text-accent">{arriveTxt}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="label-mono mb-1.5 flex items-center justify-between gap-2 text-[9px] uppercase tracking-wider text-muted" dir="ltr">
                    <span className="min-w-0 truncate">◢ {localize(ROUTE_TX, lang)} · {earth.name} → {destName(d)} · {fmtKm(d.km)}</span>
                    <span className="shrink-0 tabular-nums text-accent">{pct} %</span>
                  </div>
                  <div className="flex items-center gap-2" dir="ltr">
                    <div className="flex w-14 shrink-0 flex-col items-center gap-0.5 sm:w-20">
                      <Thumb id="earth" size={36} color={earth.color} />
                      <span className="label-mono max-w-full truncate text-[9px] uppercase text-muted">{earth.name}</span>
                    </div>
                    <div className="relative h-12 min-w-0 flex-1">
                      <div
                        className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 border-r border-white/30"
                        style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.3) 0 1px, transparent 1px 10%)" }}
                      />
                      <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-white/25" />
                      <div
                        className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2"
                        style={{ width: prog * 100 + "%", background: "linear-gradient(90deg, rgba(var(--hud-accent),0.1), rgb(var(--hud-accent)))", boxShadow: "0 0 10px rgb(var(--hud-accent))" }}
                      />
                      {traveled > 0 && (
                        <div className="absolute top-0 -translate-x-1/2" style={{ left: Math.min(Math.max(prog * 100, 12), 88) + "%" }}>
                          <span className="label-mono block whitespace-nowrap border border-accent/60 bg-black/70 px-1 text-[9px] tabular-nums text-accent">{fmtKm(traveled)}</span>
                        </div>
                      )}
                      <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: prog * 100 + "%" }}>
                        <span
                          className={"block h-3 w-3 rotate-45 bg-accent " + (run ? "animate-pulse" : "")}
                          style={{ boxShadow: "0 0 14px 3px rgb(var(--hud-accent))" }}
                        />
                      </div>
                      <div className="label-mono absolute bottom-0 left-0 right-0 flex justify-between text-[8px] text-muted/70"><span>0</span><span>{fmtKm(d.km)}</span></div>
                    </div>
                    <div className="flex w-14 shrink-0 flex-col items-center gap-0.5 sm:w-20">
                      <Thumb id={d.id} size={36} color={d.color} />
                      <span className="label-mono max-w-full truncate text-[9px] uppercase text-muted">{destName(d)}</span>
                    </div>
                  </div>

                </div>

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={startStop}
                    disabled={!Number.isFinite(totalS)}
                    className="label-mono h-8 border border-accent bg-accent/20 px-3 text-[10px] uppercase tracking-wider text-foreground transition-colors hover:bg-accent/35 disabled:opacity-40"
                  >
                    {run ? "❚❚ " + localize(JOURNEY_TX.stop, lang) : "▶ " + localize(JOURNEY_TX.start, lang)}
                  </button>
                  <button
                    type="button"
                    onClick={resetTrip}
                    disabled={!started}
                    title={localize(JOURNEY_TX.reset, lang)}
                    aria-label={localize(JOURNEY_TX.reset, lang)}
                    className="label-mono h-8 border border-white/15 px-2.5 text-[11px] text-muted transition-colors hover:text-foreground disabled:opacity-30"
                  >
                    ↺
                  </button>
                  {arrived && (
                    <span className="font-display ml-auto text-sm font-bold uppercase tracking-wide text-accent" style={{ textShadow: "0 0 12px rgb(var(--hud-accent))" }}>
                      ✔ {localize(JOURNEY_TX.arrived, lang)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
