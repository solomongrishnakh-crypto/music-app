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
import SeamlessLoopVideo from "@/components/ui/SeamlessLoopVideo";

export default function AboutSiteSection() {
  return (
    <div className="mx-auto mt-16 w-full max-w-5xl sm:mt-20">
      <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
        <div className="relative aspect-video overflow-hidden bg-background opacity-90 sm:aspect-auto">
          <SeamlessLoopVideo
            src="/branding/about-video.mp4"
            ariaLabel="Centaurian — visuelle Identität"
          />
        </div>
        <div className="glass-card flex flex-col justify-center p-6 sm:p-10">
          <p className="label-mono mb-3 text-xs uppercase">// Über die Webseite</p>
          <p className="text-sm leading-relaxed text-muted sm:text-base">
            Centaurian ist ein privates, nicht-kommerzielles Hobby-Projekt —
            kein offizieller Dienst, ohne Werbe-Tracking-Schnickschnack und
            ohne aufgeblähtes Interface. Die Suche und Wiedergabe laufen
            ausschließlich über die offizielle YouTube Data API und den
            offiziellen YouTube-Player; es wird nichts heruntergeladen,
            kopiert oder auf dieser Seite gespeichert. Da nur öffentlich
            dokumentierte, offizielle Schnittstellen genutzt werden, ist die
            Nutzung dieser Seite legal.
          </p>
        </div>
      </div>
    </div>
  );
}
