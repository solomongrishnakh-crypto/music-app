import Image from "next/image";
import Link from "next/link";
import UniverseTypewriter from "./UniverseTypewriter";

const FEATURES = [
  {
    index: "01",
    title: "Suchen",
    text: "Zugriff auf den kompletten YouTube-Musikkatalog, direkt über die offizielle Data API — kein Login nötig.",
  },
  {
    index: "02",
    title: "Hören",
    text: "Wiedergabe läuft direkt im Browser über den offiziellen YouTube-Player. Kein Download, kein Stream-Ripping.",
  },
  {
    index: "03",
    title: "Merken",
    text: "Dein Verlauf bleibt lokal in deinem Browser gespeichert — beim nächsten Besuch sofort wieder da.",
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
        <p className="label-mono text-xs uppercase">// Wie es funktioniert</p>
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

      <div className="mt-16 grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
        <div className="relative aspect-video overflow-hidden bg-background sm:aspect-auto">
          <Image
            src="/branding/default-cover.jpg"
            alt="Centaurian — visuelle Identität"
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover opacity-90"
          />
        </div>
        <div className="glass-card flex flex-col justify-center p-6 sm:p-10">
          <p className="label-mono mb-3 text-xs uppercase">// Über das Projekt</p>
          <p className="text-sm leading-relaxed text-muted sm:text-base">
            Centaurian ist ein schlankes Frontend zum Entdecken und Anhören
            von Musik — ohne Werbe-Tracking-Schnickschnack, ohne
            aufgeblähtes Interface. Die Wiedergabe läuft ausschließlich über
            offizielle, dokumentierte Schnittstellen.
          </p>
        </div>
      </div>

      <UniverseTypewriter />

      {/* Nutzerwunsch 20.09.2026: "bring die box (Die welt Durch die
          jahrhunderte) nach oben unter understand the universe. änder box
          name auf welt geschichte entdecken" — Verweis auf die interaktive
          Karten-Seite /imperien, umgezogen von FactsSection direkt hierher
          und umbenannt. */}
      <Link
        href="/imperien"
        className="group mt-16 flex flex-col items-start justify-between gap-4 border border-border bg-surface-elevated p-6 transition-colors hover:border-accent sm:flex-row sm:items-center sm:p-10"
      >
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
        <p className="label-mono inline-flex shrink-0 items-center gap-2 text-xs uppercase text-foreground transition-colors group-hover:text-accent">
          Karte ansehen ↗
        </p>
      </Link>
    </div>
  );
}
