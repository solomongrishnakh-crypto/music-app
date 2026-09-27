"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Nutzerwunsch 27.09.2026 ("kannst ein timer hier oben hinzufüge. quasi wie
 * und des universum. sekunden,stundenjahre monate alles am weiter ticken")
 * — ein live weiterlaufender Zähler für das Alter des Universums direkt
 * über den "Universum in Zahlen"-Karten auf /universum, analog zu ähnlichen
 * "seit Ereignis X vergangene Zeit"-Countern.
 *
 * Ausgangswert: 13,797 Milliarden Jahre (Planck-2018-Messung, Mittelwert der
 * in UNIVERSE_FACTS zitierten ≈13,8 Mrd. Jahre). Da die tatsächliche
 * Messunsicherheit (± 20 Mio. Jahre) um Größenordnungen über dem liegt, was
 * eine Sekunde Echtzeit ausmacht, ist das reine "Weiterticken" natürlich
 * eine Spielerei/Visualisierung, keine neue Präzisionsmessung — das steht
 * auch als Fußnote dabei (kein falscher Anspruch auf Exaktheit).
 *
 * Die Umrechnung von Sekunden in Jahre/Monate/Tage/Stunden/Minuten/Sekunden
 * verwendet Kalender-Näherungswerte (365,25 Tage/Jahr, davon 1/12 pro
 * Monat) statt echter Kalendermonate mit unterschiedlicher Länge — bei
 * einer Zahl dieser Größenordnung (Milliarden Jahre) ist das die einzig
 * sinnvolle Definition von "Monat".
 */

const AGE_AT_EPOCH_SECONDS = 13_797_000_000 * 365.25 * 86400;
// Fixer Referenzzeitpunkt, ab dem obiger Wert gilt — ideally der Moment,
// in dem der Code geschrieben wurde; alles danach kommt on top drauf.
const EPOCH_MS = Date.UTC(2026, 8, 27, 0, 0, 0);

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_DAY = 86400;
const SECONDS_PER_MONTH = (365.25 / 12) * 86400;
const SECONDS_PER_YEAR = 365.25 * 86400;

interface AgeBreakdown {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeBreakdown(): AgeBreakdown {
  const elapsedSinceEpoch = (Date.now() - EPOCH_MS) / 1000;
  let remaining = AGE_AT_EPOCH_SECONDS + elapsedSinceEpoch;

  const years = Math.floor(remaining / SECONDS_PER_YEAR);
  remaining -= years * SECONDS_PER_YEAR;
  const months = Math.floor(remaining / SECONDS_PER_MONTH);
  remaining -= months * SECONDS_PER_MONTH;
  const days = Math.floor(remaining / SECONDS_PER_DAY);
  remaining -= days * SECONDS_PER_DAY;
  const hours = Math.floor(remaining / SECONDS_PER_HOUR);
  remaining -= hours * SECONDS_PER_HOUR;
  const minutes = Math.floor(remaining / SECONDS_PER_MINUTE);
  remaining -= minutes * SECONDS_PER_MINUTE;
  const seconds = Math.floor(remaining);

  return { years, months, days, hours, minutes, seconds };
}

function AgeUnit({ value, label, digits }: { value: number; label: string; digits: number }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center border border-border bg-surface-elevated/40 px-2 py-2 sm:px-3 sm:py-3">
      <span className="font-display tabular-nums text-sm font-bold text-accent sm:text-lg">
        {value.toLocaleString("en-US", { minimumIntegerDigits: digits, useGrouping: false })}
      </span>
      <span className="label-mono mt-1 truncate text-[9px] uppercase tracking-wide text-muted sm:text-[10px]">
        {label}
      </span>
    </div>
  );
}

export default function UniverseAgeTicker() {
  const { t } = useLanguage();
  const [breakdown, setBreakdown] = useState<AgeBreakdown | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    // Erst nach dem Mount berechnen (vermeidet Server/Client-Zeit-Mismatch-
    // Warnungen bei Next.js SSR) und danach im Sekundentakt aktualisieren.
    setBreakdown(computeBreakdown());
    const interval = setInterval(() => {
      setBreakdown(computeBreakdown());
    }, 1000);
    return () => {
      clearInterval(interval);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  if (!breakdown) {
    // Platzhalter mit fester Höhe, damit beim ersten Render (vor dem
    // useEffect) kein Layout-Sprung entsteht.
    return <div className="mb-10 h-[92px] sm:h-[104px]" />;
  }

  return (
    <div className="mb-10">
      <p className="label-mono mb-3 text-xs uppercase">{t("universeAgeTickerLabel")}</p>
      <div className="flex gap-1 sm:gap-2">
        <AgeUnit value={breakdown.years} label={t("ageYears")} digits={10} />
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
