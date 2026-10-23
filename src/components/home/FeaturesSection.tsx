"use client";

import Link from "next/link";
import UniverseTypewriter from "./UniverseTypewriter";
import AppDownloadPill from "./AppDownloadPill";
import TwinkleStars from "@/components/ui/TwinkleStars";
import SectionHeading from "@/components/ui/SectionHeading";
import SkyPreviewCard from "@/components/universe/SkyPreviewCard";
import { homeText } from "@/lib/homeText";
import { SIZE_PAGE } from "@/lib/sizePageText";
import { TOOLS_PAGE } from "@/lib/toolsPageText";
import { BIRTHDAY_TEXT } from "@/lib/birthdayText";
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
  const { t, localePath, lang } = useLanguage();
  const ht = homeText(lang);
  const sz = SIZE_PAGE[lang] ?? SIZE_PAGE.en;

  // Nutzerwunsch 14.10.2026: Schwerpunkt Universum + Geschichte — zwei große
  // Karten; Musik ist nur noch eine kleine Zeile darunter.
  const CARDS = [
    { index: "01", title: t("featureUniverseTitle"), text: t("featureUniverseText"), href: localePath("/universum"), cta: t("discoverCta"), visual: "stars" as const },
    { index: "02", title: t("featureHistoryTitle"), text: t("featureHistoryText"), href: localePath("/imperien"), cta: t("viewMapCta"), visual: "history" as const },
    // Nutzerwunsch 15.10.2026 (Startseite aufräumen): Größenvergleich als dritte Karte statt großem Widget
    { index: "03", title: sz.cardTitle, text: sz.card, href: localePath("/groessenvergleich"), cta: sz.link, visual: "size" as const },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl">
      {/* Nutzerwunsch 03.10.2026: Schriftzug genau mittig zwischen Suchleiste und "Was dich erwartet" (gleicher Abstand oben/unten) */}
      <UniverseTypewriter className="mb-5 mt-6 sm:mb-6 sm:mt-12" />
      <div className="app-hide"><AppDownloadPill /></div>
      <SectionHeading index="01" label={t("featuresLabel")} />

      {/* Nutzerwunsch 03.10.2026: "Boxen kleiner, kompakter und moderner" —
          am Handy flache Zeilen (Symbol · Titel · Pfeil), am PC drei Kacheln */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {CARDS.map((c) => (
          <Link
            key={c.index}
            href={c.href}
            className="hud-card feat-card group relative flex items-center gap-4 overflow-hidden p-4 sm:flex-col sm:items-start sm:gap-4 sm:p-6"
          >
            {c.visual === "stars" && <TwinkleStars count={10} className="opacity-60" />}
            {c.visual === "history" && (
              <>
                {/* Weltkarte mit echten Reichen aus unseren Daten (Rom 117, Mongolen 1260,
                    Achämeniden −500, Inka 1527) + Zeitleiste mit wanderndem Jahr-Marker */}
                <span aria-hidden="true" className="hist-map" />
                <span aria-hidden="true" className="hist-ruler"><span className="hist-mark" /></span>
              </>
            )}
            <span className="feat-ico relative">
              {c.visual === "history" && (
                // Schriftrolle statt Uhr (Nutzerwunsch 15.10.2026: "so man weiß, es geht um Geschichte")
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 4h11.5A2.5 2.5 0 0 1 20 6.5V7h-3.5" />
                  <path d="M16.5 6.5V17a3 3 0 0 1-3 3H6.5A2.5 2.5 0 0 1 4 17.5V17h9.5" />
                  <path d="M6 4a2 2 0 0 0-2 2v11" />
                  <path d="M8 9h5.5M8 12h5.5M8 15h3.5" />
                </svg>
              )}
              {c.visual === "size" && (
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden="true">
                  <circle cx="5" cy="15" r="1.6" />
                  <circle cx="10.5" cy="13.5" r="3.1" />
                  <circle cx="18" cy="11" r="5.3" />
                </svg>
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
              <span className="block font-display text-base font-bold uppercase tracking-wide text-foreground sm:text-xl">
                {c.title}
              </span>
              <span className="mt-0.5 mt-1 block text-xs leading-snug text-muted sm:text-sm">{c.text}</span>
            </span>
            <span className="feat-go relative sm:absolute sm:right-4 sm:top-4" aria-hidden="true">↗</span>
            <span className="sr-only">{c.cta}</span>
          </Link>
        ))}
      </div>

      <div className="mt-3 sm:mt-4">
        <SkyPreviewCard label={t("skyLinkLabel")} title={t("skyLinkTitle")} />
      </div>

      <p className="mt-4 text-center">
        <Link
          href={localePath("/weltraum-rechner")}
          className="label-mono inline-block border border-border px-3 py-1.5 text-[10px] uppercase tracking-wide text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          {(TOOLS_PAGE[lang] ?? TOOLS_PAGE.en).link} →
        </Link>
        <Link
          href={localePath("/geburtstag")}
          className="label-mono ml-2 inline-block border border-border px-3 py-1.5 text-[10px] uppercase tracking-wide text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          {BIRTHDAY_TEXT[lang].link} →
        </Link>
      </p>

      <p className="mt-6 text-center text-[11px] leading-snug text-muted/80">{ht.musicChip}</p>
    </section>
  );
}
