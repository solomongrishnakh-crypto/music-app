"use client";

import Link from "next/link";
import UniverseTypewriter from "./UniverseTypewriter";
import TwinkleStars from "@/components/ui/TwinkleStars";
import SmallClock from "@/components/ui/SmallClock";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Zusätzliche Info-/Bild-Sektion unterhalb der Suche — füllt die Seite mit
 * Inhalt im gleichen futuristischen Monospace-Stil wie der Rest der Seite,
 * statt nur Suchleiste + leerer Fläche zu zeigen.
 *
 * Nutzerwunsch 20.09.2026 ("alles soll auf anderen sprache sein also jedes
 * text und details"): alle sichtbaren Texte hier laufen jetzt über t().
 */
export default function FeaturesSection() {
  const { t } = useLanguage();

  const FEATURES = [
    { index: "01", title: t("featureMusicTitle"), text: t("featureMusicText") },
    { index: "02", title: t("featureUniverseTitle"), text: t("featureUniverseText") },
    { index: "03", title: t("featureHistoryTitle"), text: t("featureHistoryText") },
  ];

  return (
    <div className="mx-auto mt-20 w-full max-w-5xl sm:mt-28">
      <div className="mb-4 flex items-end justify-between border-b border-border pb-3">
        <p className="label-mono text-xs uppercase">{t("featuresLabel")}</p>
        <p className="label-mono hidden text-xs uppercase sm:block">
          Centaurian, {new Date().getFullYear()}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.index} className="glass-card flex items-center gap-3 p-3">
            <p className="font-display text-lg font-bold text-accent">{f.index}</p>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
                {f.title}
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-muted">{f.text}</p>
            </div>
          </div>
        ))}
      </div>

      <UniverseTypewriter />

      <Link
        href="/universum"
        className="group relative mt-16 flex flex-col items-start justify-between gap-4 overflow-hidden border border-border bg-surface-elevated p-6 transition-colors hover:border-accent sm:flex-row sm:items-center sm:p-10"
      >
        <TwinkleStars count={22} />
        <div className="relative">
          <p className="font-display text-lg font-bold text-accent sm:text-2xl">
            {t("universeTitle")}
          </p>
          <p className="mt-3 max-w-xl text-xs leading-relaxed text-muted sm:text-sm">
            {t("discoverUniverseText")}
          </p>
        </div>
        <p className="label-mono relative inline-flex shrink-0 items-center gap-2 text-xs uppercase text-foreground transition-colors group-hover:text-accent">
          {t("discoverCta")} ↗
        </p>
      </Link>

      <Link
        href="/imperien"
        className="group mt-6 flex flex-col items-start justify-between gap-4 border border-border bg-surface-elevated p-6 transition-colors hover:border-accent sm:flex-row sm:items-center sm:p-10"
      >
        <div className="flex items-center gap-4">
          <div>
            <p className="font-display text-lg font-bold text-accent sm:text-2xl">
              {t("historyTitle")}
            </p>
            <p className="mt-3 max-w-xl text-xs leading-relaxed text-muted sm:text-sm">
              {t("historyText")}
            </p>
          </div>
          <SmallClock />
        </div>
        <p className="label-mono inline-flex shrink-0 items-center gap-2 text-xs uppercase text-foreground transition-colors group-hover:text-accent">
          {t("viewMapCta")} ↗
        </p>
      </Link>
    </div>
  );
}
