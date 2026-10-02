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
    <section className="mx-auto mt-20 w-full max-w-5xl sm:mt-28">
      <SectionHeading index="01" label={t("featuresLabel")} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {CARDS.map((c) => (
          <Link
            key={c.index}
            href={c.href}
            className="hud-card group flex min-h-[14rem] flex-col overflow-hidden p-5 sm:p-6"
          >
            {c.visual === "stars" && <TwinkleStars count={18} />}
            <div className="relative flex items-start justify-between">
              <p className="font-display text-3xl font-bold text-accent/90">{c.index}</p>
              {c.visual === "clock" && <SmallClock />}
              {c.visual === "eq" && (
                <div aria-hidden="true" className="flex h-8 items-end gap-[3px]">
                  {[40, 75, 55, 90, 60, 80, 45].map((h, i) => (
                    <span key={i} className="w-[3px] bg-accent/70" style={{ height: `${h}%` }} />
                  ))}
                </div>
              )}
            </div>
            <p className="relative mt-6 font-display text-lg font-bold uppercase tracking-wide text-foreground">
              {c.title}
            </p>
            <p className="relative mt-2 flex-1 text-xs leading-relaxed text-muted">{c.text}</p>
            <p className="label-mono relative mt-5 inline-flex items-center gap-2 text-[11px] uppercase text-foreground transition-colors group-hover:text-accent">
              {c.cta} <span className="transition-transform group-hover:translate-x-1">↗</span>
            </p>
          </Link>
        ))}
      </div>

      <UniverseTypewriter />
    </section>
  );
}
