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
    <section className="mx-auto mt-20 w-full max-w-5xl sm:mt-28">
      <SectionHeading index="03" label={t("aboutLabel")} />
      <div className="hud-card grid grid-cols-1 overflow-hidden sm:grid-cols-2">
        <div className="relative aspect-square overflow-hidden bg-black sm:aspect-auto sm:min-h-[26rem]">
          {/* Nutzerwunsch 28.09.2026: Video durch das Partikel-Porträt
              ersetzt; Partikel lösen sich aus den hellen Fäden, driften nach
              hinten und verwehen wie Rauch. */}
          <SmokePortrait src="/branding/about-portrait.jpg" alt="Centaurian — visuelle Identität" />
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-10">
          <p className="text-sm leading-relaxed text-muted sm:text-base">
            {t("aboutText")}
          </p>
        </div>
      </div>
    </section>
  );
}
