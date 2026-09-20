/**
 * "Über die Webseite" — bewusst kein offizielles Impressum mit echtem
 * Namen/Adresse (Nutzerentscheidung: keine offizielle/gewerbliche Seite,
 * nur ein privates Hobby-Projekt). Erklärt statt formaler Pflichtangaben,
 * warum die Nutzung legal ist: es werden ausschließlich offizielle,
 * öffentlich dokumentierte Schnittstellen genutzt, nichts wird
 * heruntergeladen oder gehostet. Bewusst ganz unten platziert, direkt vor
 * dem Kontakt-Bereich (Nutzerwunsch 18.09.2026).
 *
 * Statt eines statischen Bilds läuft hier ein Endlos-Video (Nutzerwunsch
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

import SeamlessLoopVideo from "@/components/ui/SeamlessLoopVideo";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutSiteSection() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto mt-16 w-full max-w-5xl sm:mt-20">
      <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
        <div className="relative aspect-video overflow-hidden bg-background opacity-90 sm:aspect-auto">
          {/* Nutzerkorrektur 20.09.2026: "man sieht immer noch kling ai
              kannst vlt das video bisschen kleiner schneiden so das man es
              nicht sieht" — der Verlaufs-Fade-Versuch hat das eingebrannte
              "KlingAI"-Wasserzeichen unten rechts nicht zuverlässig
              abgedeckt. Jetzt stattdessen die Videodatei selbst unten
              beschnitten (der Streifen mit dem Wasserzeichen ist komplett
              herausgeschnitten) — sauberer als jede CSS-Abdeckung. */}
          <SeamlessLoopVideo
            src="/branding/about-video.mp4"
            ariaLabel="Centaurian — visuelle Identität"
          />
        </div>
        <div className="glass-card flex flex-col justify-center p-6 sm:p-10">
          <p className="label-mono mb-3 text-xs uppercase">{t("aboutLabel")}</p>
          <p className="text-sm leading-relaxed text-muted sm:text-base">
            {t("aboutText")}
          </p>
        </div>
      </div>
    </div>
  );
}
