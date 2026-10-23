"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { findBody } from "@/components/space/bodies";
import { useLanguage } from "@/contexts/LanguageContext";
import { localize } from "@/lib/i18n";
import { BIRTHDAY_TEXT } from "@/lib/birthdayText";
import { PLANET_TX } from "@/lib/toolsText";
import { skyTodayTexts, fill } from "@/lib/skyTodayText";
import { dateToJd } from "@/lib/astro/orbits";
import { moonInfo } from "@/lib/astro/ephemeris";
import { reichNameL } from "@/lib/history/reicheNames";
import INDEX from "@/data/reiche/index.json";

/**
 * Geburtstags-Rechner (/geburtstag): alles läuft nur im Browser.
 * Umlaufzeiten (Erdtage): NASA Planetary Fact Sheet.
 */
const WORLDS: { id: string; p: number }[] = [
  { id: "mercury", p: 87.969 },
  { id: "venus", p: 224.701 },
  { id: "mars", p: 686.98 },
  { id: "jupiter", p: 4332.589 },
  { id: "saturn", p: 10759.22 },
];
const PHASES = ["new", "waxCres", "firstQ", "waxGib", "full", "wanGib", "lastQ", "wanCres"];
const MOON_EMOJI = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];

type Entry = { slug: string; en: string; de: string | null; from: number; to: number; peakArea: number };
const EMPIRES = INDEX as unknown as Entry[];

const INPUT =
  "h-11 w-full max-w-xs border border-white/15 bg-black/40 px-3 text-base text-foreground outline-none transition-colors focus:border-accent";

export default function BirthdayClient() {
  const { lang, localePath } = useLanguage();
  const T = BIRTHDAY_TEXT[lang] ?? BIRTHDAY_TEXT.en;
  const S = skyTodayTexts(lang);
  const [val, setVal] = useState("");
  const [copied, setCopied] = useState(false);

  const nf = useMemo(() => {
    try { return new Intl.NumberFormat(lang, { maximumFractionDigits: 0 }); } catch { return new Intl.NumberFormat("en"); }
  }, [lang]);
  const nf1 = useMemo(() => {
    try { return new Intl.NumberFormat(lang, { maximumFractionDigits: 1 }); } catch { return new Intl.NumberFormat("en", { maximumFractionDigits: 1 }); }
  }, [lang]);

  const info = useMemo(() => {
    if (!val) return null;
    const d = new Date(`${val}T12:00:00`);
    const ms = Date.now() - d.getTime();
    if (!Number.isFinite(ms) || ms < 0 || d.getFullYear() < 1900) return null;
    const days = Math.floor(ms / 86400000);
    const secs = Math.floor(ms / 1000);
    const mi = moonInfo(dateToJd(d));
    const idx = Math.max(0, PHASES.indexOf(mi.phase));
    const y = d.getFullYear();
    const emp = EMPIRES.filter((e) => e.from <= y && y <= e.to).sort((a, b) => b.peakArea - a.peakArea).slice(0, 3);
    return { days, secs, idx, illum: Math.round(mi.illum * 100), y, emp };
  }, [val]);

  const today = new Date().toISOString().slice(0, 10);

  const copy = async () => {
    if (!info) return;
    const mars = nf1.format(info.days / 686.98);
    const text = fill(T.shareTxt, { d: nf.format(info.days), m: mars, url: typeof window !== "undefined" ? window.location.href.split("#")[0] : "" });
    try {
      // Am Handy zuerst das Teilen-Menü (WhatsApp usw.), sonst in die Zwischenablage
      if (typeof navigator.share === "function" && window.matchMedia("(pointer: coarse)").matches) {
        try { await navigator.share({ text }); return; } catch (e) { if ((e as Error)?.name === "AbortError") return; }
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Zwischenablage nicht verfügbar */
    }
  };

  return (
    <section className="mt-8" aria-label={T.h1}>
      <label className="label-mono mb-1.5 block text-[10px] uppercase tracking-wider text-muted" htmlFor="bd-date">
        {localize(PLANET_TX.birth, lang)}
      </label>
      <input id="bd-date" type="date" className={INPUT} value={val} min="1900-01-01" max={today} onChange={(e) => setVal(e.target.value)} />

      {info && (
        <div className="mt-6 space-y-6">
          <div className="hud-card border border-border p-4 text-center">
            <p className="font-display text-4xl font-bold text-accent sm:text-6xl">{nf.format(info.days)}</p>
            <p className="mt-1 text-sm text-foreground/85">{T.days}</p>
            <p className="mt-2 text-xs text-muted">{nf.format(info.secs)} {T.secs}</p>
          </div>

          <div>
            <SectionHeading index="02" label={T.planetsH} />
            <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
              {WORLDS.map((w) => {
                const b = findBody(w.id);
                return (
                  <li key={w.id} className="hud-card border border-border p-3 text-center last:col-span-2 sm:last:col-span-1">
                    <p className="text-xs text-muted">{b ? localize(b.name, lang) : w.id}</p>
                    <p className="mt-1 font-display text-2xl font-bold text-foreground">{nf1.format(info.days / w.p)}</p>
                    <p className="text-[11px] text-muted">{T.yrs}</p>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <SectionHeading index="03" label={T.moonH} />
            <p className="mt-3 text-lg text-foreground">
              <span aria-hidden="true" className="mr-2 text-3xl align-middle">{MOON_EMOJI[info.idx]}</span>
              {S.phases[info.idx]} · {info.illum} %
            </p>
          </div>

          <div>
            <SectionHeading index="04" label={`${T.empH} (${info.y})`} />
            {info.emp.length === 0 ? (
              <p className="mt-3 text-sm text-muted">{T.empNone}</p>
            ) : (
              <ul className="mt-3 flex flex-wrap gap-2">
                {info.emp.map((e) => (
                  <li key={e.slug}>
                    <Link
                      href={localePath(`/imperien/reich/${e.slug}`)}
                      className="label-mono inline-block border border-border px-3 py-1.5 text-xs text-foreground transition-colors hover:border-accent hover:text-accent"
                    >
                      {/* Der Datensatz führt Libyen 1969–2013 unter einem Eintrag; ab 1977 hieß der Staat Dschamahirija */}
                      {e.slug === "libyan-arab-republic" && info.y >= 1977
                        ? lang === "de" ? "Libysche Dschamahirija" : "Libyan Jamahiriya"
                        : reichNameL(e.en, lang, e.de)}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            onClick={copy}
            className="label-mono border border-accent px-4 py-2.5 text-sm uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-black"
          >
            {copied ? T.copied : T.share}
          </button>
        </div>
      )}
    </section>
  );
}
