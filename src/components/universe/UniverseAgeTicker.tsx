"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Nutzerwunsch 27.09.2026 ("kannst ein timer hier oben hinzufüge. quasi wie
 * und des universum. sekunden,stundenjahre monate alles am weiter ticken";
 * danach: "mach es moderner und wieso bewegt sich timer nicht es soll
 * quasi wie universumuhr laufen") — ein live weiterlaufender Zähler für das
 * Alter des Universums direkt über den "Universum in Zahlen"-Karten.
 *
 * BUG-FIX (wichtig, sonst tickt nichts): Das Alter in Sekunden liegt bei
 * ≈ 4,35 × 10^17 — weit über Number.MAX_SAFE_INTEGER (≈ 9 × 10^15).
 * JavaScript-Zahlen (IEEE-754 double) haben bei dieser Größenordnung nur
 * noch eine Auflösung von ~64 Sekunden — eine einzelne Sekunde draufzu-
 * addieren hatte schlicht KEINEN sichtbaren Effekt, der Zähler wirkte
 * eingefroren. Fix: die gesamte Berechnung läuft jetzt in BigInt
 * (beliebig genaue Ganzzahl-Arithmetik) statt in normalen Numbers — damit
 * ist jede einzelne Sekunde exakt darstellbar, ganz unabhängig von der
 * Gesamtgröße der Zahl.
 *
 * Ausgangswert: 13,797 Milliarden Jahre (Planck-2018-Messung, Mittelwert
 * der ≈13,8 Mrd. Jahre aus UNIVERSE_FACTS). Die Umrechnung von Sekunden in
 * Jahre/Monate/Tage/Stunden/Minuten/Sekunden verwendet Kalender-Näherungs-
 * werte (365,25 Tage/Jahr, 1/12 davon pro Monat — beides zufällig exakte
 * Ganzzahlen in Sekunden: 365,25 * 86400 = 31.557.600). Das reine
 * "Weiterticken" ist eine Visualisierung, keine neue Präzisionsmessung
 * (die echte Messunsicherheit liegt bei ± 20 Mio. Jahren) — daher die
 * Fußnote unter der Anzeige.
 */

// BigInt(...) statt "123n"-Literalen: die Literal-Schreibweise verlangt
// TypeScript-Compile-Target ES2020+, dieses Projekt zielt (noch) auf
// ES2017 — die Funktionsschreibweise ist davon unabhängig und erzeugt
// exakt denselben BigInt-Wert.
const SECONDS_PER_YEAR = BigInt(31_557_600); // 365,25 * 86400 (exakt, keine Rundung)
const SECONDS_PER_MONTH = SECONDS_PER_YEAR / BigInt(12); // 2.629.800 (exakt)
const SECONDS_PER_DAY = BigInt(86_400);
const SECONDS_PER_HOUR = BigInt(3_600);
const SECONDS_PER_MINUTE = BigInt(60);

const AGE_AT_EPOCH_SECONDS = BigInt(13_797_000_000) * SECONDS_PER_YEAR;
// Fixer Referenzzeitpunkt, ab dem obiger Wert gilt — alles danach kommt
// als (kleine, präzise darstellbare) Sekundenzahl on top drauf.
const EPOCH_MS = Date.UTC(2026, 8, 27, 0, 0, 0);

interface AgeBreakdown {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeBreakdown(): AgeBreakdown {
  const elapsedSeconds = BigInt(Math.max(0, Math.floor((Date.now() - EPOCH_MS) / 1000)));
  let remaining = AGE_AT_EPOCH_SECONDS + elapsedSeconds;

  const years = remaining / SECONDS_PER_YEAR;
  remaining %= SECONDS_PER_YEAR;
  const months = remaining / SECONDS_PER_MONTH;
  remaining %= SECONDS_PER_MONTH;
  const days = remaining / SECONDS_PER_DAY;
  remaining %= SECONDS_PER_DAY;
  const hours = remaining / SECONDS_PER_HOUR;
  remaining %= SECONDS_PER_HOUR;
  const minutes = remaining / SECONDS_PER_MINUTE;
  remaining %= SECONDS_PER_MINUTE;

  return {
    years: Number(years),
    months: Number(months),
    days: Number(days),
    hours: Number(hours),
    minutes: Number(minutes),
    seconds: Number(remaining),
  };
}

function AgeUnit({
  value,
  label,
  digits,
  grouped,
  wide,
}: {
  value: number;
  label: string;
  digits: number;
  grouped?: boolean;
  wide?: boolean;
}) {
  const formatted = grouped
    ? value.toLocaleString("en-US")
    : value.toLocaleString("en-US", { minimumIntegerDigits: digits, useGrouping: false });
  return (
    <div
      className={`relative flex min-w-0 flex-col items-center overflow-hidden border border-accent/25 bg-gradient-to-b from-surface-elevated/70 to-black/40 px-1.5 py-1.5 backdrop-blur-sm sm:px-2 sm:py-2 ${
        wide ? "flex-[2.4]" : "flex-1"
      }`}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
      <span
        className={`font-display tabular-nums font-bold leading-none text-accent drop-shadow-[0_0_8px_rgba(255,90,77,0.45)] ${
          wide ? "text-[11px] sm:text-lg" : "text-sm sm:text-xl"
        }`}
      >
        {formatted}
      </span>
      <span className="label-mono mt-1 truncate text-[7px] uppercase tracking-widest text-muted sm:text-[9px]">
        {label}
      </span>
    </div>
  );
}

export default function UniverseAgeTicker() {
  const { t } = useLanguage();
  const [breakdown, setBreakdown] = useState<AgeBreakdown | null>(null);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    // Erst nach dem Mount berechnen (vermeidet Server/Client-Zeit-Mismatch
    // bei SSR) und danach exakt im Sekundentakt aktualisieren.
    setBreakdown(computeBreakdown());
    const interval = setInterval(() => {
      setBreakdown(computeBreakdown());
      setPulse((p) => !p);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!breakdown) {
    // Platzhalter mit fester Höhe, damit beim ersten Render (vor dem
    // useEffect) kein Layout-Sprung entsteht.
    return <div className="mb-10 h-[78px] sm:h-[92px]" />;
  }

  return (
    <div className="relative mb-10 border border-border/60 bg-black/20 p-2.5 sm:p-3">
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`h-1.5 w-1.5 rounded-full bg-accent transition-opacity duration-300 ${
            pulse ? "opacity-100" : "opacity-40"
          }`}
          style={{ boxShadow: "0 0 6px 1px rgba(255,90,77,0.7)" }}
          aria-hidden
        />
        <p className="label-mono text-xs uppercase">{t("universeAgeTickerLabel")}</p>
      </div>
      <div className="flex gap-1 sm:gap-1.5">
        <AgeUnit value={breakdown.years} label={t("ageYears")} digits={10} grouped wide />
        <AgeUnit value={breakdown.months} label={t("ageMonths")} digits={2} />
        <AgeUnit value={breakdown.days} label={t("ageDays")} digits={2} />
        <AgeUnit value={breakdown.hours} label={t("ageHours")} digits={2} />
        <AgeUnit value={breakdown.minutes} label={t("ageMinutes")} digits={2} />
        <AgeUnit value={breakdown.seconds} label={t("ageSeconds")} digits={2} />
      </div>
      <p className="mt-2 text-[10px] leading-relaxed text-muted">
        {t("universeAgeTickerFootnote")}
      </p>
    </div>
  );
}
