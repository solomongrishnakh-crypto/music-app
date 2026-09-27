"use client";

import { useEffect, useRef, useState } from "react";
import { createGearScene, type GearSceneController } from "./gearScene";
import { AXLE_COUNT, angleDecimals, gearAngleText, gearPeriodSeconds } from "./machineTime";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * 3D-Untersetzungsmaschine ("Google Gear"/Googol-Maschine) auf der
 * Universum-Seite. Die three.js-Logik steckt in gearScene.ts, die exakte
 * Zeitrechnung in machineTime.ts.
 *
 * Rad-für-Rad-Navigation (Nutzerwunsch: "ich kann schlecht das letzte Rad
 * sehen … das ich swipen kann für letztes Rad"): Wischen in der Box oder
 * ◀ ▶ in der Leiste fliegt zum nächsten/vorherigen Rad. Die Leiste zeigt
 * Radnummer, Umdrehungszeit und die live weiterlaufende Stellung — beim
 * letzten Rad tickt dort sichtbar die 16. Nachkommastelle.
 */
interface Gear3DProps {
  className?: string;
}

/** Umdrehungszeit in der passenden Einheit, lokalisiert über Intl. */
function formatPeriod(seconds: number, lang: string): string {
  const year = 31_557_600;
  const pick: [number, string, number][] = [
    [60, "second", 1],
    [3600, "minute", 60],
    [86_400, "hour", 3600],
    [2 * year, "day", 86_400],
  ];
  for (const [limit, unit, div] of pick) {
    if (seconds < limit) {
      return new Intl.NumberFormat(lang, { style: "unit", unit, unitDisplay: "long", maximumFractionDigits: 1 }).format(
        seconds / div
      );
    }
  }
  const years = seconds / year;
  return new Intl.NumberFormat(lang, {
    style: "unit",
    unit: "year",
    unitDisplay: "long",
    ...(years >= 1e6 ? { notation: "compact", compactDisplay: "long", maximumSignificantDigits: 5 } : { maximumFractionDigits: 0 }),
  } as Intl.NumberFormatOptions).format(years);
}

export default function Gear3D({ className }: Gear3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<GearSceneController | null>(null);
  const [focus, setFocus] = useState<number | null>(null);
  const [angle, setAngle] = useState("");
  const { lang, t } = useLanguage();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const controller = createGearScene(mount, { onFocusChange: setFocus });
    controllerRef.current = controller;
    return () => {
      controller.dispose();
      controllerRef.current = null;
    };
  }, []);

  // Stellung des gewählten Rads live anzeigen
  useEffect(() => {
    if (focus === null) return;
    const decimals = angleDecimals(focus);
    const sep = (1.5).toLocaleString(lang).charAt(1) || ".";
    const update = () => setAngle(gearAngleText(focus, Date.now(), decimals, sep) + "°");
    update();
    const id = setInterval(update, 200);
    return () => clearInterval(id);
  }, [focus, lang]);

  const btn =
    "flex h-9 w-9 shrink-0 items-center justify-center border border-border/60 bg-black/40 text-sm text-foreground transition-colors hover:border-accent/60 hover:text-accent focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent disabled:opacity-30";

  return (
    <div className={`flex w-full flex-col ${className ?? ""}`}>
      <div className="relative min-h-0 w-full flex-1">
        <div ref={mountRef} className="h-full w-full" aria-hidden="true" />
        {focus !== null && (
          <button
            type="button"
            className="absolute right-2 top-2 border border-border/60 bg-black/60 px-2 py-1 text-[10px] uppercase tracking-wide text-foreground backdrop-blur-sm transition-colors hover:border-accent/60 hover:text-accent"
            onClick={() => controllerRef.current?.overview()}
          >
            {t("gearNavOverview")}
          </button>
        )}
      </div>
      {/* Am Handy eng: drei kurze Zeilen statt einer langen, nichts wird abgeschnitten */}
      <div className="mt-2 flex items-center gap-2">
        <button type="button" className={btn} onClick={() => controllerRef.current?.prev()} aria-label={t("gearNavPrev")}>
          ◀
        </button>
        <div className="min-w-0 flex-1 text-center" aria-live="polite">
          {focus === null ? (
            <p className="label-mono text-[10px] uppercase leading-snug tracking-wide text-muted">{t("gearNavHint")}</p>
          ) : (
            <>
              <p className="label-mono text-[11px] uppercase leading-snug tracking-wide text-foreground">
                {t("gearNavGear").replace("{n}", String(focus + 1)).replace("{total}", String(AXLE_COUNT))}
              </p>
              <p className="text-[10px] leading-snug text-muted">
                {t("gearNavPeriod").replace("{t}", formatPeriod(gearPeriodSeconds(focus), lang))}
              </p>
              <p className="break-all font-mono text-[10px] leading-snug tabular-nums text-accent">
                {t("gearNavAngle")}: {angle}
              </p>
            </>
          )}
        </div>
        <button
          type="button"
          className={btn}
          onClick={() => controllerRef.current?.next()}
          disabled={focus === AXLE_COUNT - 1}
          aria-label={t("gearNavNext")}
        >
          ▶
        </button>
      </div>
    </div>
  );
}
