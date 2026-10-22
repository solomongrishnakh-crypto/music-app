"use client";

import { useState } from "react";
import { useLanguage, type Lang } from "@/contexts/LanguageContext";
import { localize } from "@/lib/i18n";
import { CAL_EVENTS, CAL_TX } from "@/lib/toolsText";

/**
 * Kosmischer Kalender (Nutzerwunsch 15.10.2026): 13,8 Mrd. Jahre = 1 Jahr (365 Tage).
 * Skalen: ganzes Jahr, letzter Tag (31. Dez.), letzte Minute (23:59).
 */

const AGE = 13.8e9; // Jahre seit dem Urknall
const YEAR_S = 365 * 86400;
type Scale = "year" | "day" | "minute";
const SPAN: Record<Scale, number> = { year: YEAR_S, day: 86400, minute: 60 };

function when(ago: number, lang: Lang): string {
  if (ago === 0) {
    try {
      const d = new Intl.DateTimeFormat(lang, { month: "long", day: "numeric", timeZone: "UTC" }).format(Date.UTC(2001, 11, 31));
      return `${d}, 24:00`;
    } catch {
      return "31.12., 24:00";
    }
  }
  const t = YEAR_S * (1 - ago / AGE);
  const ms = Date.UTC(2001, 0, 1) + t * 1000;
  try {
    const date = new Intl.DateTimeFormat(lang, { month: "long", day: "numeric", timeZone: "UTC" }).format(ms);
    if (t < YEAR_S - 86400) return date;
    const fine = t >= YEAR_S - 60;
    const time = new Intl.DateTimeFormat(lang, {
      hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23", timeZone: "UTC",
      ...(fine ? { fractionalSecondDigits: 1 as const } : {}),
    }).format(ms);
    return `${date}, ${time}`;
  } catch {
    return new Date(ms).toISOString().slice(5, 19).replace("T", " ");
  }
}

function agoText(ago: number, lang: Lang): string {
  try {
    return new Intl.RelativeTimeFormat(lang, { numeric: "auto", style: "long" }).format(-ago, "year");
  } catch {
    return `-${ago}`;
  }
}

export default function CosmicCalendar({ index = "01", className = "mt-10" }: { index?: string; className?: string }) {
  const { lang } = useLanguage();
  const [scale, setScale] = useState<Scale>("year");
  const [open, setOpen] = useState(false);
  const L = SPAN[scale];
  const lifeS = (80 / AGE) * YEAR_S;
  const life = (() => {
    try {
      return new Intl.NumberFormat(lang, { maximumFractionDigits: 2 }).format(lifeS);
    } catch {
      return lifeS.toFixed(2);
    }
  })();

  const rows = [...CAL_EVENTS.map((e) => ({ ago: e.ago, name: localize(e.n, lang) })), { ago: 0, name: localize(CAL_TX.today, lang) }];

  return (
    <section className={className}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-3 rounded-xl border border-accent/40 bg-gradient-to-br from-accent/15 via-surface-elevated to-transparent shadow-[0_0_30px_-10px_var(--accent)] backdrop-blur transition-all hover:border-accent hover:shadow-[0_0_40px_-8px_var(--accent)] px-4 py-3 text-start"
      >
        <span className="min-w-0">
          <span className="label-mono block text-[10px] uppercase tracking-widest text-accent">{index} · {rows.length}</span>
          <span className="font-display mt-0.5 block truncate text-sm font-bold uppercase tracking-tight text-foreground sm:text-base">
            {localize(CAL_TX.title, lang)}
          </span>
        </span>
        <span
          aria-hidden="true"
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border text-accent transition-transform duration-300 group-hover:border-accent ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="mt-2 rounded-xl border border-border bg-surface-elevated/40 p-3 backdrop-blur sm:p-4">
          <p className="max-w-3xl text-[11px] leading-relaxed text-muted sm:text-xs">{localize(CAL_TX.intro, lang)}</p>

          <div className="mt-3 inline-flex overflow-hidden rounded-full border border-border">
            {(["year", "day", "minute"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setScale(s)}
                aria-pressed={scale === s}
                className={"label-mono px-3 py-1 text-[10px] uppercase tracking-wide transition-colors " + (scale === s ? "bg-accent/20 text-foreground" : "text-muted hover:text-foreground")}
              >
                {localize(CAL_TX[s], lang)}
              </button>
            ))}
          </div>

          <ul className="mt-3 grid gap-x-6 gap-y-1 md:grid-cols-2">
            {rows.map((r) => {
              const t = r.ago === 0 ? YEAR_S : YEAR_S * (1 - r.ago / AGE);
              const p = (t - (YEAR_S - L)) / L;
              const out = p < 0;
              const pct = Math.max(0, Math.min(1, p)) * 100;
              return (
                <li key={r.ago} className={"min-w-0 py-1.5 transition-opacity " + (out ? "opacity-35" : "")} title={r.ago > 0 ? agoText(r.ago, lang) : undefined}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-xs font-semibold text-foreground">{r.name}</span>
                    <span className="label-mono shrink-0 text-[10px] tabular-nums text-accent">{when(r.ago, lang)}</span>
                  </div>
                  <div className="relative mt-1 h-1 w-full overflow-hidden rounded-full bg-border/50" aria-hidden="true">
                    {!out && <div className="h-full rounded-full bg-accent/80 transition-[width] duration-500" style={{ width: pct + "%" }} />}
                  </div>
                </li>
              );
            })}
          </ul>

          <p className="mt-3 text-[11px] text-foreground">{localize(CAL_TX.life, lang).replace("{s}", life)}</p>
          <p className="mt-1 text-[10px] text-muted">{localize(CAL_TX.note, lang)}</p>
        </div>
      )}
    </section>
  );
}
