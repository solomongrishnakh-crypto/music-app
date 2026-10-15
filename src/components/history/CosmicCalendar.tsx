"use client";

import { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
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

export default function CosmicCalendar({ index = "01" }: { index?: string }) {
  const { lang } = useLanguage();
  const [scale, setScale] = useState<Scale>("year");
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
    <section className="mt-12">
      <SectionHeading index={index} label={localize(CAL_TX.title, lang)} />
      <div className="hud-card p-4 sm:p-5">
        <p className="max-w-3xl text-xs leading-relaxed text-muted sm:text-sm">{localize(CAL_TX.intro, lang)}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {(["year", "day", "minute"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setScale(s)}
              aria-pressed={scale === s}
              className={`label-mono border px-3 py-1.5 text-[10px] uppercase tracking-wide transition-colors ${
                scale === s ? "border-accent bg-accent/15 text-foreground" : "border-border text-muted hover:border-accent hover:text-foreground"
              }`}
            >
              {localize(CAL_TX[s], lang)}
            </button>
          ))}
        </div>

        <ul className="mt-4 divide-y divide-border/60">
          {rows.map((r) => {
            const t = r.ago === 0 ? YEAR_S : YEAR_S * (1 - r.ago / AGE);
            const p = (t - (YEAR_S - L)) / L;
            const out = p < 0;
            const pct = Math.max(0, Math.min(1, p)) * 100;
            return (
              <li key={r.ago} className={`py-2.5 transition-opacity ${out ? "opacity-40" : ""}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                  <span className="text-sm font-semibold text-foreground">{r.name}</span>
                  <span className="label-mono text-[11px] tabular-nums text-accent">{when(r.ago, lang)}</span>
                </div>
                {r.ago > 0 && <p className="text-[10px] text-muted">{agoText(r.ago, lang)}</p>}
                <div className="relative mt-1.5 h-1.5 w-full bg-border/50" aria-hidden="true">
                  {!out && (
                    <div className="relative h-full bg-accent/70 transition-[width] duration-500" style={{ width: `${pct}%` }}>
                      <span className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-accent" style={{ insetInlineEnd: -5 }} />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 text-xs text-foreground">{localize(CAL_TX.life, lang).replace("{s}", life)}</p>
        <p className="mt-2 text-[10px] text-muted">{localize(CAL_TX.note, lang)}</p>
      </div>
    </section>
  );
}
