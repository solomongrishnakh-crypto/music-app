"use client";

import Link from "next/link";
import UniverseTypewriter from "./UniverseTypewriter";
import TwinkleStars from "@/components/ui/TwinkleStars";
import SmallClock from "@/components/ui/SmallClock";
import SectionHeading from "@/components/ui/SectionHeading";
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

  // Nutzerwunsch 02.10.2026 (neues HUD-Design, "richtig sortieren"): die drei
  // kleinen Kästchen und die zwei großen Teaser sind jetzt EINE Reihe aus drei
  // großen Karten — jede führt direkt zu ihrem Bereich.
  const CARDS = [
    { ...FEATURES[0], href: "#musik", cta: t("navMusic"), visual: "eq" as const },
    { ...FEATURES[1], href: "/universum", cta: t("discoverCta"), visual: "stars" as const },
    { ...FEATURES[2], href: "/imperien", cta: t("viewMapCta"), visual: "clock" as const },
  ];

  return (
    <section className="mx-auto w-full max-w-5xl">
      {/* Nutzerwunsch 03.10.2026: Schriftzug genau mittig zwischen Suchleiste und "Was dich erwartet" (gleicher Abstand oben/unten) */}
      <UniverseTypewriter className="mb-14 mt-10 sm:mb-20 sm:mt-16" />
      <SectionHeading index="01" label={t("featuresLabel")} />

      {/* Nutzerwunsch 03.10.2026: "Boxen kleiner, kompakter und moderner" —
          am Handy flache Zeilen (Symbol · Titel · Pfeil), am PC drei Kacheln */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
        {CARDS.map((c) => (
          <Link
            key={c.index}
            href={c.href}
            className="hud-card group relative flex items-center gap-3.5 overflow-hidden p-3 sm:flex-col sm:items-start sm:gap-3 sm:p-4"
          >
            {c.visual === "stars" && <TwinkleStars count={10} className="opacity-60" />}
            <span className="feat-ico relative">
              {c.visual === "clock" && <SmallClock className="!h-8 !w-8 sm:!h-8 sm:!w-8" />}
              {c.visual === "eq" && (
                <span aria-hidden="true" className="flex h-5 items-end gap-[2px]">
                  {[40, 75, 55, 90, 60].map((h, i) => (
                    <span key={i} className="eq-bar w-[3px] bg-accent/80" style={{ height: `${h}%`, animationDelay: `${i * 0.12}s` }} />
                  ))}
                </span>
              )}
              {c.visual === "stars" && (
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden="true">
                  <circle cx="12" cy="12" r="3.2" />
                  <ellipse cx="12" cy="12" rx="9.5" ry="3.6" transform="rotate(-24 12 12)" />
                </svg>
              )}
            </span>
            <span className="relative min-w-0 flex-1">
              <span className="label-mono block text-[10px] text-accent/90">{c.index}</span>
              <span className="block font-display text-sm font-bold uppercase tracking-wide text-foreground sm:text-base">
                {c.title}
              </span>
              <span className="mt-0.5 line-clamp-2 block text-[11px] leading-snug text-muted sm:text-xs">{c.text}</span>
            </span>
            <span className="feat-go relative sm:absolute sm:right-4 sm:top-4" aria-hidden="true">↗</span>
            <span className="sr-only">{c.cta}</span>
          </Link>
        ))}
      </div>

    </section>
  );
}
