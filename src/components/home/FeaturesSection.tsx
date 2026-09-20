import Link from "next/link";
import UniverseTypewriter from "./UniverseTypewriter";
import TwinkleStars from "@/components/ui/TwinkleStars";
import SmallClock from "@/components/ui/SmallClock";

// Nutzerwunsch 20.09.2026: "diese 3 titeln sollen weg oder bearbeitet werden
// weil meine seite ist nicht nur für music gedacht auch für universum
// entdecken oder besserkennenlernen" — die drei Karten beschrieben bisher
// nur den Musik-Suchablauf (Suchen/Hören/Merken). Jetzt spiegeln sie die
// drei Bereiche der ganzen Seite wider: Musik, Universum, Geschichte.
const FEATURES = [
  {
    index: "01",
    title: "Musik",
    text: "Song suchen und direkt hier hören — über den offiziellen YouTube-Katalog, kein Login, kein Download.",
  },
  {
    index: "02",
    title: "Universum",
    text: "Zahlen, Fakten und ein interaktives Sonnensystem zum Erkunden — vom Urknall bis zu Voyager 1.",
  },
  {
    index: "03",
    title: "Geschichte",
    text: "Große Reiche auf einer Zeitleiste von der Antike bis heute, mit Jahres-Regler zum Durchspielen.",
  },
];

/**
 * Zusätzliche Info-/Bild-Sektion unterhalb der Suche — füllt die Seite mit
 * Inhalt im gleichen futuristischen Monospace-Stil wie der Rest der Seite,
 * statt nur Suchleiste + leerer Fläche zu zeigen.
 */
export default function FeaturesSection() {
  return (
    <div className="mx-auto mt-20 w-full max-w-5xl sm:mt-28">
      {/* Nutzerwunsch 20.09.2026: "minimiere es" — die Schritte 01-03 nehmen
          jetzt deutlich weniger Platz ein (kleinere Karten, engere
          Abstände) statt einer großen, hohen Kartenreihe. */}
      <div className="mb-4 flex items-end justify-between border-b border-border pb-3">
        <p className="label-mono text-xs uppercase">// Was dich erwartet</p>
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

      {/* Nutzerwunsch 20.09.2026: "lösche diesen box über das projekt" —
          die Bild+Text-Box ("Über das Projekt") ist entfernt. */}
      <UniverseTypewriter />

      {/* Nutzerwunsch 20.09.2026: "kannst ganze space news und universum in
          zahlen in einer anderen seite tun wie weltgeschichte entdecken?" —
          Verweis auf die neue eigene Seite /universum (Fakten zum Kosmos +
          Space News), statt beides direkt auf der Startseite zu zeigen. */}
      <Link
        href="/universum"
        className="group relative mt-16 flex flex-col items-start justify-between gap-4 overflow-hidden border border-border bg-surface-elevated p-6 transition-colors hover:border-accent sm:flex-row sm:items-center sm:p-10"
      >
        {/* Nutzerwunsch 20.09.2026: "füge im box 'universum kennenlernen'
            statische sterne die blinken dann dunkeler werden" */}
        <TwinkleStars count={22} />
        <div className="relative">
          <p className="font-display text-lg font-bold text-accent sm:text-2xl">
            Universum kennenlernen
          </p>
          <p className="mt-3 max-w-xl text-xs leading-relaxed text-muted sm:text-sm">
            Zahlen und Fakten zum Kosmos — vom Alter des Universums über
            Dunkle Materie bis zu Schwarzen Löchern, dazu aktuelle
            Live-News aus der Raumfahrt.
          </p>
        </div>
        <p className="label-mono relative inline-flex shrink-0 items-center gap-2 text-xs uppercase text-foreground transition-colors group-hover:text-accent">
          Entdecken ↗
        </p>
      </Link>

      {/* Nutzerwunsch 20.09.2026: "bring die box (Die welt Durch die
          jahrhunderte) nach oben unter understand the universe. änder box
          name auf welt geschichte entdecken" — Verweis auf die interaktive
          Karten-Seite /imperien, umgezogen von FactsSection direkt hierher
          und umbenannt. */}
      <Link
        href="/imperien"
        className="group mt-6 flex flex-col items-start justify-between gap-4 border border-border bg-surface-elevated p-6 transition-colors hover:border-accent sm:flex-row sm:items-center sm:p-10"
      >
        <div className="flex items-center gap-4">
          <div>
            <p className="font-display text-lg font-bold text-accent sm:text-2xl">
              Weltgeschichte entdecken
            </p>
            <p className="mt-3 max-w-xl text-xs leading-relaxed text-muted sm:text-sm">
              Historische Weltkarte mit Jahres-Regler — von der Antike bis
              heute, große Reiche wie Rom, die Mongolen oder das British
              Empire farblich hervorgehoben.
            </p>
          </div>
          {/* Nutzerkorrektur 20.09.2026: "bring die uhr auf rechte seite" —
              die kleine tickende Uhr steht jetzt rechts vom Text statt
              links davor. */}
          <SmallClock />
        </div>
        <p className="label-mono inline-flex shrink-0 items-center gap-2 text-xs uppercase text-foreground transition-colors group-hover:text-accent">
          Karte ansehen ↗
        </p>
      </Link>
    </div>
  );
}
