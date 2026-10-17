"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Lang } from "@/contexts/LanguageContext";
import INDEX from "@/data/reiche/index.json";
import { reichNameL } from "@/lib/history/reicheNames";
import { eraIndex, fill, reichTexts } from "@/lib/history/reicheText";
import { toolTexts } from "@/lib/history/toolsText";
import { usePersist } from "@/lib/usePersist";
import ReichProfile from "@/components/reiche/ReichProfile";
import { formatAreaL, formatYearL, langPath } from "@/lib/seoI18n";

/**
 * Geschichts-Werkzeuge (Nutzerwunsch 17.10.2026): Reiche vergleichen,
 * Rekorde, "Welt im Jahr X" und Quiz — alles aus den vorhandenen 300 Reichen
 * (index.json + Flächenverlauf aus series.json). Läuft komplett im Browser.
 */
interface E {
  slug: string;
  en: string;
  de: string | null;
  from: number;
  to: number;
  peakYear: number;
  peakArea: number;
}
type Series = Record<string, [number, number][]>;

const ALL = INDEX as unknown as E[];
const MIN_YEAR = -3200;
const MAX_YEAR = 2013;
const COLORS = ["#ff5a4d", "#5ad1ff", "#ffd75a"];

/** Dauer in Jahren (es gibt kein Jahr 0). */
const dur = (e: E) => e.to - e.from - (e.from < 0 && e.to > 0 ? 1 : 0);

function areaAt(s: [number, number][] | undefined, y: number): number {
  if (!s || !s.length) return 0;
  if (y <= s[0][0]) return s[0][1];
  for (let i = 1; i < s.length; i++) {
    if (y <= s[i][0]) {
      const [y0, a0] = s[i - 1];
      const [y1, a1] = s[i];
      return a0 + ((a1 - a0) * (y - y0)) / Math.max(1, y1 - y0);
    }
  }
  return s[s.length - 1][1];
}

const shuffle = <T,>(a: T[]): T[] => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};

type Tab = "compare" | "records" | "year" | "quiz";

export default function GeschichtsWerkzeuge({ lang }: { lang: Lang }) {
  const T = toolTexts(lang);
  const R = reichTexts(lang);
  const rtl = lang === "ar" || lang === "fa";
  const name = (e: E) => reichNameL(e.en, lang, e.de);
  const collator = useMemo(() => new Intl.Collator(lang), [lang]);
  const sorted = useMemo(() => [...ALL].sort((a, b) => collator.compare(name(a), name(b))), [collator, lang]); // eslint-disable-line react-hooks/exhaustive-deps
  const bySlug = useMemo(() => new Map(ALL.map((e) => [e.slug, e])), []);
  const [tab, setTab] = usePersist<Tab>("gw:tab", "compare");
  const [series, setSeries] = useState<Series | null>(null);
  useEffect(() => {
    if (series || (tab !== "compare" && tab !== "year")) return;
    let alive = true;
    import("@/data/reiche/series.json").then((m) => alive && setSeries(m.default as unknown as Series));
    return () => {
      alive = false;
    };
  }, [tab, series]);

  const num = (n: number, d = 1) => n.toLocaleString(lang, { minimumFractionDigits: d, maximumFractionDigits: d });
  const yearsTxt = (e: E) => fill(T.cmpYears, { n: dur(e).toLocaleString(lang) });
  const period = (e: E) => `${formatYearL(e.from, lang)} – ${e.to >= 2013 ? R.today : formatYearL(e.to, lang)}`;
  const link = (e: E, cls = "") => (
    <Link href={langPath(`/imperien/reich/${e.slug}`, lang)} className={`hover:text-accent ${cls}`}>
      {name(e)}
    </Link>
  );

  const tabs: [Tab, string][] = [
    ["compare", T.tCompare],
    ["records", T.tRecords],
    ["year", T.tYear],
    ["quiz", T.tQuiz],
  ];

  return (
    <main lang={lang} dir={rtl ? "rtl" : "ltr"} className="mx-auto max-w-4xl px-4 pb-16 pt-6 sm:px-6">
      <nav aria-label="breadcrumb" className="label-mono mb-6 flex flex-wrap gap-x-2 text-xs uppercase text-muted">
        <Link href={langPath("/", lang)} className="hover:text-accent">{R.crumbHome}</Link>
        <span>/</span>
        <Link href={langPath("/imperien", lang)} className="hover:text-accent">{R.crumbMap}</Link>
      </nav>
      <h1 className="font-display text-2xl font-bold text-foreground sm:text-4xl">{T.h1}</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-foreground/90">{fill(T.intro, { n: ALL.length })}</p>

      <div role="tablist" className="mt-8 flex flex-wrap gap-2">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`label-mono border px-4 py-2 text-xs uppercase tracking-wide transition-colors ${
              tab === id ? "border-accent text-accent" : "border-border text-foreground hover:border-accent hover:text-accent"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "compare" && (
          <Compare T={T} sorted={sorted} bySlug={bySlug} series={series} lang={lang} name={name} period={period} yearsTxt={yearsTxt} link={link} num={num} eras={R.eras} />
        )}
        {tab === "records" && <Records T={T} lang={lang} name={name} period={period} yearsTxt={yearsTxt} link={link} eras={R.eras} />}
        {tab === "year" && <YearView T={T} lang={lang} series={series} name={name} period={period} link={link} />}
        {tab === "quiz" && <Quiz T={T} lang={lang} name={name} period={period} yearsTxt={yearsTxt} />}
      </div>

      <p className="mt-12 border-t border-border pt-4 text-xs text-muted">{R.footer}</p>
    </main>
  );
}

type Common = {
  T: ReturnType<typeof toolTexts>;
  lang: Lang;
  name: (e: E) => string;
  period: (e: E) => string;
};

/* ------------------------------------------------------------------ Vergleich */

function Compare({
  T, sorted, bySlug, series, lang, name, period, yearsTxt, link, num, eras,
}: Common & {
  sorted: E[];
  bySlug: Map<string, E>;
  series: Series | null;
  yearsTxt: (e: E) => string;
  link: (e: E, cls?: string) => React.ReactNode;
  num: (n: number, d?: number) => string;
  eras: string[];
}) {
  const [sel, setSel] = usePersist<string[]>("gw:sel", ["roemisches-reich", "mongolisches-reich", ""]);
  const items = sel.map((s) => bySlug.get(s)).filter(Boolean) as E[];
  const maxArea = Math.max(...items.map((e) => e.peakArea), 1);
  const maxDur = Math.max(...items.map((e) => dur(e)), 1);
  const sentences: string[] = [];
  if (items.length >= 2) {
    const [a, b] = [...items].sort((x, y) => y.peakArea - x.peakArea);
    const xa = a.peakArea / b.peakArea;
    if (xa >= 1.1) sentences.push(fill(T.cmpLarger, { a: name(a), b: name(b), x: num(xa) }));
    const [c, d] = [...items].sort((x, y) => dur(y) - dur(x));
    const xd = dur(c) / Math.max(1, dur(d));
    if (xd >= 1.1) sentences.push(fill(T.cmpLonger, { a: name(c), b: name(d), x: num(xd) }));
  }
  return (
    <section>
      <div className="grid gap-3 sm:grid-cols-3">
        {sel.map((v, i) => (
          <label key={i} className="block text-xs text-muted">
            {T.cmpPick} {i + 1}
            <select
              value={v}
              onChange={(ev) => setSel(sel.map((x, j) => (j === i ? ev.target.value : x)))}
              className="mt-1 w-full border border-border bg-background px-2 py-2 text-sm text-foreground"
            >
              {i === 2 && <option value="">–</option>}
              {sorted.map((e) => (
                <option key={e.slug} value={e.slug}>
                  {name(e)}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      {items.length > 0 && (
        <div className={"mt-6 grid gap-4 " + (items.length === 2 ? "md:grid-cols-2" : items.length === 3 ? "md:grid-cols-2 lg:grid-cols-3" : "")}>
          {items.map((e, i) => (
            <article key={e.slug} className="hud-card border border-border p-4" style={{ borderTop: "3px solid " + COLORS[i] }}>
              <p className="label-mono text-[10px] uppercase text-muted">{eras[eraIndex(e.from)]}</p>
              <h3 className="font-display mt-1 text-xl font-bold" style={{ color: COLORS[i] }}>
                {link(e, "text-inherit")}
              </h3>
              <p className="mt-1 text-xs text-muted">{period(e)}</p>
              <div className="mt-4 space-y-3">
                <Bar label={T.cmpPeakArea} value={formatAreaL(e.peakArea, lang)} frac={e.peakArea / maxArea} color={COLORS[i]} />
                <Bar label={T.cmpDuration} value={yearsTxt(e)} frac={dur(e) / maxDur} color={COLORS[i]} />
              </div>
              <p className="mt-2 text-xs text-muted">
                {T.cmpPeakYear}: {formatYearL(e.peakYear, lang)}
              </p>
              <ReichProfile slug={e.slug} lang={lang} compact />
            </article>
          ))}
        </div>
      )}
      {sentences.length > 0 && (
        <ul className="mt-5 space-y-1 text-foreground/90">
          {sentences.map((s) => (
            <li key={s}>• {s}</li>
          ))}
        </ul>
      )}
      {items.length > 0 && <CompareChart T={T} lang={lang} items={items} series={series} name={name} />}
    </section>
  );
}

function Bar({ label, value, frac, color }: { label: string; value: string; frac: number; color: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="text-muted">{label}</span>
        <span className="font-medium text-foreground">{value}</span>
      </div>
      <div className="mt-1 h-1.5 bg-border/50">
        <div className="h-1.5" style={{ width: Math.max(3, frac * 100) + "%", background: color }} />
      </div>
    </div>
  );
}

function CompareChart({ T, lang, items, series, name }: Pick<Common, "T" | "lang" | "name"> & { items: E[]; series: Series | null }) {
  if (!series) return null;
  const W = 640, H = 200, P = 6;
  const x0 = Math.min(...items.map((e) => e.from));
  const x1 = Math.max(...items.map((e) => e.to));
  const max = Math.max(...items.flatMap((e) => series[e.slug]?.map((p) => p[1]) ?? [0])) || 1;
  const X = (y: number) => P + ((y - x0) / Math.max(1, x1 - x0)) * (W - 2 * P);
  const Y = (a: number) => H - P - (a / max) * (H - 2 * P);
  return (
    <figure className="mt-8" dir="ltr">
      <figcaption className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
        <span className="label-mono uppercase">{T.cmpChart}</span>
        {items.map((e, i) => (
          <span key={e.slug} className="inline-flex items-center gap-1">
            <i className="inline-block h-0.5 w-4" style={{ background: COLORS[i] }} />
            {name(e)}
          </span>
        ))}
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full border border-border/60" role="img" aria-label={T.cmpChart}>
        {items.map((e, i) => {
          const pts = (series[e.slug] ?? []).map(([y, a]) => `${X(y).toFixed(1)},${Y(a).toFixed(1)}`);
          return <polyline key={e.slug} points={pts.join(" ")} fill="none" stroke={COLORS[i]} strokeWidth="1.8" strokeLinejoin="round" />;
        })}
      </svg>
      <div className="mt-1 flex justify-between text-xs text-muted">
        <span>{formatYearL(x0, lang)}</span>
        <span>{formatAreaL(max, lang)}</span>
        <span>{x1 >= 2013 ? reichTexts(lang).today : formatYearL(x1, lang)}</span>
      </div>
    </figure>
  );
}

/* --------------------------------------------------------------------- Rekorde */

function Records({
  T, lang, name, period, yearsTxt, link, eras,
}: Common & { yearsTxt: (e: E) => string; link: (e: E, cls?: string) => React.ReactNode; eras: string[] }) {
  const [by, setBy] = usePersist<"area" | "dur" | "old">("gw:by", "area");
  const [era, setEra] = usePersist("gw:era", -1);
  const list = useMemo(() => {
    const l = ALL.filter((e) => era < 0 || eraIndex(e.from) === era);
    const key = by === "area" ? (e: E) => -e.peakArea : by === "dur" ? (e: E) => -dur(e) : (e: E) => e.from;
    return l.sort((a, b) => key(a) - key(b)).slice(0, 25);
  }, [by, era]);
  const best = (f: (e: E) => number) => ALL.reduce((a, b) => (f(b) > f(a) ? b : a));
  const cards: [string, E, string][] = [
    [T.recBiggest, best((e) => e.peakArea), ""],
    [T.recLongest, best(dur), ""],
    [T.recOldest, best((e) => -e.from), ""],
  ];
  const cardVal = (i: number, e: E) => (i === 0 ? formatAreaL(e.peakArea, lang) : i === 1 ? yearsTxt(e) : formatYearL(e.from, lang));
  const val = (e: E) => (by === "area" ? e.peakArea : by === "dur" ? dur(e) : 0);
  const top = list.length ? Math.max(...list.map(val)) || 1 : 1;
  return (
    <section>
      <div className="grid gap-3 sm:grid-cols-3">
        {cards.map(([label, e], i) => (
          <div key={label} className="border border-border p-4">
            <div className="label-mono text-[10px] uppercase tracking-wide text-muted">{label}</div>
            <div className="mt-1 font-display text-lg font-bold text-foreground">{link(e)}</div>
            <div className="mt-1 text-sm text-accent">{cardVal(i, e)}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <label className="block text-xs text-muted">
          {T.recSort}
          <select value={by} onChange={(e) => setBy(e.target.value as typeof by)} className="mt-1 w-full border border-border bg-background px-2 py-2 text-sm text-foreground">
            <option value="area">{T.recArea}</option>
            <option value="dur">{T.recDur}</option>
            <option value="old">{T.recOld}</option>
          </select>
        </label>
        <label className="block text-xs text-muted">
          {T.recEra}
          <select value={era} onChange={(e) => setEra(Number(e.target.value))} className="mt-1 w-full border border-border bg-background px-2 py-2 text-sm text-foreground">
            <option value={-1}>{T.recAll}</option>
            {eras.map((n, i) => (
              <option key={i} value={i}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>
      <ol className="mt-4">
        {list.map((e, i) => (
          <li key={e.slug} className="border-b border-border/60 py-2">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm text-foreground">
                <span className="label-mono me-2 text-xs text-muted">{i + 1}.</span>
                {link(e)}
              </span>
              <span className="label-mono shrink-0 text-xs text-accent">
                {by === "area" ? formatAreaL(e.peakArea, lang) : by === "dur" ? yearsTxt(e) : formatYearL(e.from, lang)}
              </span>
            </div>
            {by !== "old" && (
              <div className="mt-1 h-1 bg-border/50">
                <div className="h-1 bg-accent" style={{ width: `${Math.max(2, (val(e) / top) * 100)}%` }} />
              </div>
            )}
            <div className="mt-1 text-[11px] text-muted">{period(e)}</div>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-muted">{T.recNote}</p>
    </section>
  );
}

/* ------------------------------------------------------------------ Welt im Jahr */

function YearView({ T, lang, series, name, period, link }: Common & { series: Series | null; link: (e: E, cls?: string) => React.ReactNode }) {
  const [year, setYear] = usePersist("gw:year", 100);
  const y = year === 0 ? 1 : year;
  const rows = useMemo(() => {
    if (!series) return [];
    return ALL.filter((e) => e.from <= y && e.to >= y)
      .map((e) => ({ e, a: areaAt(series[e.slug], y) }))
      .sort((p, q) => q.a - p.a);
  }, [series, y]);
  const top = rows[0]?.a || 1;
  const clamp = (v: number) => Math.max(MIN_YEAR, Math.min(MAX_YEAR, Math.round(v) || 0));
  return (
    <section>
      <label className="block text-xs text-muted">
        {T.yrLabel}
        <div className="mt-1 flex items-center gap-3" dir="ltr">
          <input type="range" min={MIN_YEAR} max={MAX_YEAR} value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full accent-[#ff5a4d]" aria-label={T.yrLabel} />
          <input type="number" min={MIN_YEAR} max={MAX_YEAR} value={year} onChange={(e) => setYear(clamp(Number(e.target.value)))} className="w-24 shrink-0 border border-border bg-background px-2 py-2 text-sm text-foreground" />
        </div>
      </label>
      <p className="mt-3 font-display text-xl font-bold text-accent">{formatYearL(y, lang)}</p>
      {series && (
        <>
          <p className="mt-2 text-foreground/90">
            {rows.length ? fill(T.yrCount, { n: rows.length, t: ALL.length, year: formatYearL(y, lang) }).replace(/\.\.$/, ".") : T.yrNone}
            {rows.length > 0 && <> {fill(T.yrBiggest, { name: name(rows[0].e), area: formatAreaL(rows[0].a, lang) })}</>}
          </p>
          <Link href={`${langPath("/imperien", lang)}?jahr=${y}`} className="label-mono mt-3 inline-block border border-border px-4 py-2 text-xs uppercase tracking-wide text-foreground transition-colors hover:border-accent hover:text-accent">
            {T.yrMap} →
          </Link>
          <ul className="mt-4">
            {rows.slice(0, 40).map(({ e, a }) => (
              <li key={e.slug} className="border-b border-border/60 py-2">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-foreground">{link(e)}</span>
                  <span className="label-mono shrink-0 text-xs text-accent">{formatAreaL(a, lang)}</span>
                </div>
                <div className="mt-1 h-1 bg-border/50">
                  <div className="h-1 bg-accent" style={{ width: `${Math.max(2, (a / top) * 100)}%` }} />
                </div>
                <div className="mt-1 text-[11px] text-muted">
                  {period(e)} · {T.yrThen}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------------- Quiz */

type Q = { kind: "larger" | "longer" | "first" | "existed"; year?: number; options: E[]; answer: string };
const N_Q = 10;

function makeQuestion(): Q {
  const kinds = ["larger", "longer", "first", "existed"] as const;
  for (let tries = 0; tries < 200; tries++) {
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    if (kind === "existed") {
      const year = Math.round(-2500 + Math.random() * 4300);
      const y = year === 0 ? 1 : year;
      const ok = ALL.filter((e) => e.from + 20 <= y && e.to - 20 >= y);
      const no = ALL.filter((e) => e.to + 50 < y || e.from - 50 > y);
      if (!ok.length || no.length < 3) continue;
      const right = ok[Math.floor(Math.random() * ok.length)];
      const wrong = shuffle(no).slice(0, 3);
      return { kind, year: y, options: shuffle([right, ...wrong]), answer: right.slug };
    }
    const a = ALL[Math.floor(Math.random() * ALL.length)];
    const b = ALL[Math.floor(Math.random() * ALL.length)];
    if (a === b) continue;
    const ok =
      kind === "larger"
        ? Math.max(a.peakArea, b.peakArea) / Math.min(a.peakArea, b.peakArea) >= 1.4
        : kind === "longer"
          ? Math.min(dur(a), dur(b)) >= 10 && Math.max(dur(a), dur(b)) / Math.min(dur(a), dur(b)) >= 1.5
          : Math.abs(a.from - b.from) >= 100;
    if (!ok) continue;
    const win =
      kind === "larger" ? (a.peakArea > b.peakArea ? a : b) : kind === "longer" ? (dur(a) > dur(b) ? a : b) : a.from < b.from ? a : b;
    return { kind, options: [a, b], answer: win.slug };
  }
  const [a, b] = [ALL[0], ALL[1]];
  return { kind: "larger", options: [a, b], answer: a.peakArea > b.peakArea ? a.slug : b.slug };
}

function Quiz({ T, lang, name, period, yearsTxt }: Common & { yearsTxt: (e: E) => string }) {
  const [qs, setQs] = usePersist<Q[] | null>("gw:qs", null);
  const [i, setI] = usePersist("gw:qi", 0);
  const [picked, setPicked] = usePersist<string | null>("gw:qp", null);
  const [score, setScore] = usePersist("gw:qscore", 0);
  const start = () => {
    setQs(Array.from({ length: N_Q }, makeQuestion));
    setI(0);
    setPicked(null);
    setScore(0);
  };
  if (!qs) {
    return (
      <button onClick={start} className="label-mono border border-accent px-5 py-3 text-sm uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-black">
        {T.qStart}
      </button>
    );
  }
  if (i >= qs.length) {
    return (
      <div>
        <p className="font-display text-2xl font-bold text-accent">{fill(T.qScore, { s: score, n: qs.length })}</p>
        <button onClick={start} className="label-mono mt-4 border border-accent px-5 py-3 text-sm uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-black">
          {T.qAgain}
        </button>
      </div>
    );
  }
  const q = qs[i];
  const title =
    q.kind === "larger" ? T.qLarger : q.kind === "longer" ? T.qLonger : q.kind === "first" ? T.qFirst : fill(T.qExisted, { year: formatYearL(q.year!, lang) });
  const detail = (e: E) =>
    q.kind === "larger" ? formatAreaL(e.peakArea, lang) : q.kind === "longer" ? yearsTxt(e) : period(e);
  const done = picked !== null;
  const choose = (slug: string) => {
    if (done) return;
    setPicked(slug);
    if (slug === q.answer) setScore((s) => s + 1);
  };
  return (
    <div>
      <div className="label-mono text-xs uppercase text-muted">
        {fill(T.qOf, { i: i + 1, n: qs.length })}
      </div>
      <h2 className="mt-2 font-display text-xl font-bold text-foreground">{title}</h2>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {q.options.map((e) => {
          const right = e.slug === q.answer;
          const cls = !done
            ? "border-border hover:border-accent hover:text-accent"
            : right
              ? "border-green-500 text-green-400"
              : e.slug === picked
                ? "border-red-500 text-red-400"
                : "border-border/50 text-muted";
          return (
            <button key={e.slug} onClick={() => choose(e.slug)} disabled={done} className={`border px-4 py-3 text-start text-sm transition-colors ${cls}`}>
              <span className="block font-medium">{name(e)}</span>
              {done && <span className="mt-1 block text-xs opacity-80">{detail(e)}</span>}
            </button>
          );
        })}
      </div>
      {done && (
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <span className={picked === q.answer ? "text-green-400" : "text-red-400"}>{picked === q.answer ? T.qRight : T.qWrong}</span>
          <button
            onClick={() => {
              setI(i + 1);
              setPicked(null);
            }}
            className="label-mono border border-accent px-4 py-2 text-xs uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-black"
          >
            {i + 1 >= qs.length ? T.qFinish : T.qNext}
          </button>
        </div>
      )}
    </div>
  );
}
