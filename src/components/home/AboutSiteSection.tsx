/**
 * "Über die Webseite" — bewusst kein offizielles Impressum mit echtem
 * Namen/Adresse (Nutzerentscheidung: keine offizielle/gewerbliche Seite,
 * nur ein privates Hobby-Projekt). Erklärt statt formaler Pflichtangaben,
 * warum die Nutzung legal ist: es werden ausschließlich offizielle,
 * öffentlich dokumentierte Schnittstellen genutzt, nichts wird
 * heruntergeladen oder gehostet. Bewusst ganz unten platziert, direkt vor
 * dem Kontakt-Bereich (Nutzerwunsch 18.09.2026).
 *
 * 28.09.2026: Das Video wurde durch ein lebendiges Partikel-Porträt
 * ersetzt (SmokePortrait). Frühere Historie zum Video:
 * Statt eines statischen Bilds lief hier ein Endlos-Video (Nutzerwunsch
 * 18.09.2026: "nimm dieses video mach es lupt (ohne ende) und erstzt das
 * bild mit 'über webseite' mit dem video").
 *
 * Der native `loop`-Neustart eines einzelnen <video>-Tags hatte einen
 * sichtbaren kurzen Ruckler beim Zurückspringen (Nutzerkorrektur
 * 18.09.2026: "es gibt ein pause zwischen video. mach es übergang so man
 * niemand denkt es sei ein video. man soll denken es ist lebendig. ohne
 * lags") — daher jetzt `SeamlessLoopVideo`, das per Crossfade zwischen
 * zwei synchronisierten Videos den Loop-Sprung unsichtbar macht.
 */
"use client";

import SmokePortrait from "@/components/home/SmokePortrait";
import SectionHeading from "@/components/ui/SectionHeading";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutSiteSection() {
  const { t } = useLanguage();
  return (
    <section className="mx-auto mt-16 w-full max-w-5xl sm:mt-24">
      <SectionHeading index="03" label={t("aboutLabel")} />
      {/* Nutzerwunsch 03.10.2026: Beschreibung verbessert — kurzer Einstieg,
          die vier Bereiche als Liste, Rechtliches als kleine Notiz */}
      <div className="hud-card grid grid-cols-1 overflow-hidden sm:grid-cols-[2fr_3fr]">
        <div className="relative h-56 overflow-hidden bg-black sm:h-auto sm:min-h-[22rem]">
          <SmokePortrait src="/branding/about-portrait.jpg" alt="Centaurian — visuelle Identität" />
        </div>
        <div className="flex flex-col justify-center gap-4 p-5 sm:p-7">
          <p className="text-sm leading-relaxed text-foreground/90">{t("aboutLead")}</p>
          <ul className="grid gap-2">
            {(["aboutF1", "aboutF2", "aboutF3", "aboutF4"] as const).map((k, i) => {
              const [head, ...rest] = t(k).split(" — ");
              return (
                <li key={k} className="about-row">
                  <span className="about-idx">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-xs leading-snug text-muted">
                    <span className="font-semibold uppercase tracking-wide text-foreground">{head}</span>
                    {rest.length ? " — " + rest.join(" — ") : ""}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="flex items-start gap-2 border-t border-border pt-3 text-[11px] leading-relaxed text-muted">
            <svg viewBox="0 0 24 24" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z" />
              <path d="m8.8 12.2 2.2 2.2 4.2-4.4" />
            </svg>
            <span>{t("aboutLegal")}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
