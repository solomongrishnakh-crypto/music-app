"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import Typewriter from "@/components/ui/Typewriter";
import DetailModal from "@/components/ui/DetailModal";
import SpaceNewsSection from "@/components/home/SpaceNewsSection";
import TopEmpiresGrid from "@/components/home/TopEmpiresGrid";
import { useInView } from "@/hooks/useInView";

interface UniverseFact {
  label: string;
  value: string;
  details: string[];
  image: string;
}

// Direkte, echte Bild-URLs (Wikimedia Commons / Wikipedia-Artikelbilder,
// über die Wikipedia-API verifiziert — kein KI-generiertes Bild).

const UNIVERSE_FACTS: UniverseFact[] = [
  {
    label: "Alter des Universums",
    value: "≈ 13,8 Mrd. Jahre",
    details: [
      "Das Alter von rund 13,8 Milliarden Jahren stammt aus Messungen des kosmischen Mikrowellenhintergrunds — der 'Nachglühen'-Strahlung des Urknalls, die den gesamten Himmel durchzieht.",
      "Missionen wie WMAP und Planck haben diese Hintergrundstrahlung extrem präzise vermessen und daraus, zusammen mit der Ausdehnungsrate des Universums, das Alter berechnet.",
      "Zum Vergleich: Unser Sonnensystem existiert erst seit etwa 4,6 Milliarden Jahren — das Universum war also schon zwei Drittel seines bisherigen Lebens alt, bevor die Erde entstand.",
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/0/04/Cosmic_Microwave_Background_%28CMB%29.jpeg",
  },
  {
    label: "Beobachtbares Universum",
    value: "≈ 93 Mrd. Lichtjahre Ø",
    details: [
      "Das beobachtbare Universum ist die Kugel um uns herum, aus der Licht seit dem Urknall Zeit hatte, uns zu erreichen. Ihr Durchmesser beträgt etwa 93 Milliarden Lichtjahre.",
      "Das ist größer als '13,8 Milliarden Lichtjahre in jede Richtung', weil sich der Raum selbst seit dem Urknall ausgedehnt hat — weit entfernte Galaxien sind heute viel weiter weg, als es die reine Lichtlaufzeit vermuten lässt.",
      "Das gesamte Universum könnte deutlich größer sein oder sogar unendlich — wir sehen nur den Teil, aus dem uns bisher Licht erreicht hat.",
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Hubble_ultra_deep_field_high_rez_edit1.jpg/1600px-Hubble_ultra_deep_field_high_rez_edit1.jpg",
  },
  {
    label: "Galaxien (geschätzt)",
    value: "≈ 2 Billionen",
    details: [
      "Frühere Schätzungen aus Hubble-Daten gingen von etwa 200 Milliarden Galaxien aus; eine Analyse von 2016 kam nach Hochrechnung sehr schwacher, kleiner Galaxien auf bis zu 2 Billionen.",
      "Neuere Auswertungen mit dem James-Webb-Weltraumteleskop deuten inzwischen eher wieder auf niedrigere zweistellige Milliardenwerte hin — die genaue Zahl bleibt Gegenstand aktiver Forschung.",
      "Jede dieser Galaxien enthält selbst wieder Hunderte Millionen bis Billionen Sterne — die schiere Größenordnung ist für den Menschen kaum intuitiv greifbar.",
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/c/c3/NGC_4414_%28NASA-med%29.jpg",
  },
  {
    label: "Sterne in der Milchstraße",
    value: "100–400 Mrd.",
    details: [
      "Unsere Heimatgalaxie, die Milchstraße, ist eine Balken-Spiralgalaxie mit einem Durchmesser von etwa 100.000 Lichtjahren.",
      "Die Sonne befindet sich in einem ihrer Spiralarme, rund 26.000 Lichtjahre vom galaktischen Zentrum entfernt, und umkreist dieses Zentrum einmal in etwa 225–250 Millionen Jahren.",
      "Die Unsicherheit bei der Sternenzahl (100–400 Milliarden) liegt daran, dass viele kleine, lichtschwache Sterne von der Erde aus kaum direkt zu zählen sind.",
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/ESO-VLT-Laser-phot-33a-07.jpg/1600px-ESO-VLT-Laser-phot-33a-07.jpg",
  },
  {
    label: "Lichtgeschwindigkeit",
    value: "299.792 km/s",
    details: [
      "Die Lichtgeschwindigkeit im Vakuum (exakt 299.792.458 m/s) ist eine fundamentale Naturkonstante — nichts, was Information oder Materie überträgt, kann sie überschreiten.",
      "Sie ist auch die Grundlage von Einsteins spezieller Relativitätstheorie: Raum und Zeit verhalten sich so, dass die Lichtgeschwindigkeit für alle Beobachter gleich bleibt.",
      "Weil Licht endlich schnell ist, blicken wir beim Blick ins All immer in die Vergangenheit — das Sonnenlicht, das uns gerade erreicht, ist rund 8 Minuten alt.",
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Earth_to_Sun_-_en.png",
  },
  {
    label: "Nächster Stern (Alpha Centauri)",
    value: "4,25 Lichtjahre",
    details: [
      "Proxima Centauri, Teil des Alpha-Centauri-Dreifachsystems, ist mit 4,25 Lichtjahren Entfernung der sonnennächste bekannte Stern.",
      "Mit heutiger Raumfahrttechnik (chemische Raketen) würde eine Reise dorthin viele Zehntausende Jahre dauern — selbst mit den schnellsten je gebauten Sonden wären es noch Jahrtausende.",
      "Um Proxima Centauri kreist mindestens ein erdgroßer Exoplanet in der sogenannten habitablen Zone, was ihn zu einem viel diskutierten Ziel für zukünftige interstellare Missionskonzepte macht.",
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/9/95/New_shot_of_Proxima_Centauri%2C_our_nearest_neighbour.jpg",
  },
];

interface RevealCardProps {
  children: (inView: boolean) => ReactNode;
  className?: string;
  onClick?: () => void;
}

function RevealCard({ children, className, onClick }: RevealCardProps) {
  const { ref, inView } = useInView<HTMLButtonElement>();
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`group text-left transition-colors ${className ?? ""}`}
    >
      {children(inView)}
    </button>
  );
}

/**
 * Zusätzliche Fakten-Sektion — Texte "tippen" sich beim Scrollen ins
 * Blickfeld selbst ein (Typewriter-Effekt), und jede Karte lässt sich
 * anklicken für eine ausführlichere Detailansicht zum jeweiligen Thema.
 */
export default function FactsSection() {
  const [selected, setSelected] = useState<
    { type: "universe"; index: number } | null
  >(null);

  return (
    <div className="mx-auto mt-20 w-full max-w-5xl sm:mt-28">
      <div className="mb-10 border-b border-border pb-4">
        <p className="label-mono text-xs uppercase">// Universum in Zahlen</p>
      </div>

      <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {UNIVERSE_FACTS.map((fact, i) => (
          <RevealCard
            key={fact.label}
            className="glass-card p-6"
            onClick={() => setSelected({ type: "universe", index: i })}
          >
            {(inView) => (
              <>
                <p className="font-display min-h-[1.75em] text-lg font-bold text-accent sm:text-xl">
                  <Typewriter text={fact.value} active={inView} speed={12} />
                </p>
                <p className="mt-2 min-h-[1.5em] text-xs uppercase tracking-wide text-muted">
                  <Typewriter
                    text={fact.label}
                    active={inView}
                    speed={10}
                    delay={fact.value.length * 12 + 150}
                  />
                </p>
                <p className="label-mono mt-3 text-[10px] uppercase opacity-0 transition-opacity group-hover:opacity-100">
                  // mehr erfahren
                </p>
              </>
            )}
          </RevealCard>
        ))}
      </div>

      {/* Space News direkt unter "Universum in Zahlen" (Nutzerwunsch
          18.09.2026: "bring diese box mit space news unter universum in
          zahlen"), statt weiter unten nach den Imperien. */}
      <SpaceNewsSection />

      <div className="mb-10 mt-20 border-b border-border pb-4">
        <p className="label-mono text-xs uppercase">// Große Imperien der Geschichte</p>
      </div>

      {/* Verweis auf die interaktive Karten-Seite /imperien, direkt unter
          der Überschrift "Große Imperien der Geschichte" statt in einem
          eigenen, separat beschrifteten Abschnitt (Nutzerkorrektur
          18.09.2026: "mach diese zeile(ganze box) mit 'große imperien der
          geschichte' in einem zeil unter 'die welt durch die
          Jahrhunderte'" — ein Titel/eine Zeile statt zwei getrennter). */}
      <Link
        href="/imperien"
        className="group mb-10 flex flex-col items-start justify-between gap-4 border border-border bg-surface-elevated p-6 transition-colors hover:border-accent sm:flex-row sm:items-center sm:p-10"
      >
        <div>
          <p className="font-display text-lg font-bold text-accent sm:text-2xl">
            Die Welt durch die Jahrhunderte
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

      <TopEmpiresGrid />

      {selected?.type === "universe" && (
        <DetailModal
          eyebrow="// Universum in Zahlen"
          title={UNIVERSE_FACTS[selected.index].label}
          meta={UNIVERSE_FACTS[selected.index].value}
          paragraphs={UNIVERSE_FACTS[selected.index].details}
          imageUrl={UNIVERSE_FACTS[selected.index].image}
          imageAlt={UNIVERSE_FACTS[selected.index].label}
          imageCredit="Bild: Wikimedia Commons"
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
