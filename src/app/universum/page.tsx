"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import SiteBackground from "@/components/particles/SiteBackground";
import Typewriter from "@/components/ui/Typewriter";
import DetailModal from "@/components/ui/DetailModal";
import SpaceNewsSection from "@/components/home/SpaceNewsSection";
import { useInView } from "@/hooks/useInView";

interface UniverseFact {
  label: string;
  value: string;
  details: string[];
  image: string;
}

// Direkte, echte Bild-URLs (Wikimedia Commons / Wikipedia-Artikelbilder,
// über die Wikipedia-API verifiziert — kein KI-generiertes Bild).
//
// Nutzerwunsch 20.09.2026: "Universum in Zahlen" + Space News auf eine
// eigene Seite auslagern (wie "Weltgeschichte entdecken" für die Imperien-
// Karte) und dabei mit MEHR Infos übers Universum füllen — die ursprünglich
// 6 Fakten (aus der alten FactsSection auf der Startseite) sind hier um
// weitere ergänzt.
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
  {
    label: "Dunkle Materie",
    value: "≈ 27 % des Universums",
    details: [
      "Dunkle Materie sendet kein Licht aus und lässt sich nicht direkt beobachten — ihre Existenz wird aus ihrer Schwerkraftwirkung geschlossen, etwa daraus, dass sich Galaxien viel schneller drehen, als ihre sichtbare Masse allein erklären könnte.",
      "Sie macht schätzungsweise rund 27 % des gesamten Energieinhalts des Universums aus — gewöhnliche (sichtbare) Materie dagegen nur etwa 5 %.",
      "Woraus Dunkle Materie tatsächlich besteht, ist bis heute ungeklärt — sie zählt zu den größten offenen Fragen der modernen Physik.",
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Bullet_cluster.jpg/1280px-Bullet_cluster.jpg",
  },
  {
    label: "Dunkle Energie",
    value: "≈ 68 % des Universums",
    details: [
      "Dunkle Energie ist der Name für das, was die beschleunigte Ausdehnung des Universums antreibt — sie macht mit rund 68 % den größten Anteil am gesamten Energieinhalt des Kosmos aus.",
      "Entdeckt wurde die beschleunigte Expansion Ende der 1990er durch Beobachtungen weit entfernter Supernovae, wofür 2011 der Physik-Nobelpreis vergeben wurde.",
      "Zusammen mit Dunkler Materie bedeutet das: Nur etwa 5 % des Universums bestehen aus der 'gewöhnlichen' Materie, aus der Sterne, Planeten und wir selbst gemacht sind.",
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Universe_expansion2.png/1024px-Universe_expansion2.png",
  },
  {
    label: "Schwarze Löcher",
    value: "bis zu Milliarden Sonnenmassen",
    details: [
      "Ein Schwarzes Loch entsteht, wenn Masse so extrem konzentriert ist, dass selbst Licht seine Anziehungskraft nicht mehr überwinden kann — die Grenze dazu heißt Ereignishorizont.",
      "Im Zentrum fast jeder großen Galaxie sitzt vermutlich ein supermassereiches Schwarzes Loch; das der Milchstraße (Sagittarius A*) hat etwa 4 Millionen Sonnenmassen.",
      "2019 gelang mit dem Event Horizon Telescope die erste direkte Abbildung eines Schwarzen Lochs (in der Galaxie M87) — ein Meilenstein der Astronomie.",
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Black_hole_-_Messier_87_crop_max_res.jpg/1280px-Black_hole_-_Messier_87_crop_max_res.jpg",
  },
  {
    label: "Exoplaneten (bestätigt)",
    value: "über 5.800",
    details: [
      "Seit der ersten Bestätigung eines Exoplaneten um einen sonnenähnlichen Stern 1995 wurden über 5.800 weitere Planeten außerhalb unseres Sonnensystems nachgewiesen (Stand: NASA Exoplanet Archive).",
      "Die meisten wurden über die Transitmethode entdeckt — ein Planet zieht vor seinem Stern vorbei und dimmt dessen Licht minimal, was Weltraumteleskope wie Kepler und TESS registrieren.",
      "Ein wichtiges Forschungsziel sind Planeten in der 'habitablen Zone' — mit Bedingungen, unter denen flüssiges Wasser an der Oberfläche möglich wäre.",
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Kepler-186f_artist_concept.jpg/1280px-Kepler-186f_artist_concept.jpg",
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

// Nutzerwunsch 20.09.2026: "füge auch kleine bilder hinzu das es zu dem
// titel passt" — kleines Vorschaubild oben in jeder Fakten-Karte (dasselbe
// Bild, das vorher nur in der Detailansicht auftauchte). Blendet sich
// unsichtbar aus, falls ein Bild mal nicht lädt, statt kaputt auszusehen
// (gleiches Muster wie CardThumbnail in SpaceNewsSection).
function FactThumbnail({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) return null;
  return (
    <div className="-mx-6 -mt-6 mb-4 aspect-[16/9] overflow-hidden bg-surface-elevated">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover opacity-85 transition-opacity group-hover:opacity-100"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

/**
 * "Universum kennenlernen" — eigene Seite (Nutzerwunsch 20.09.2026: "kannst
 * ganze space news und universum in zahlen in einer anderen seite tun wie
 * weltgeschichte entdecken? aber fülle mehr infos über universum hinein"),
 * analog zu /imperien für die Weltgeschichte-Karte. Enthält die vorher auf
 * der Startseite liegende "Universum in Zahlen"-Fakten-Sektion (jetzt mit
 * mehr Einträgen: Dunkle Materie, Dunkle Energie, Schwarze Löcher,
 * Exoplaneten) sowie die Space-News-Sektion, statt beides auf der
 * Startseite unterzubringen.
 */
export default function UniversumPage() {
  const [selectedFact, setSelectedFact] = useState<number | null>(null);

  return (
    <main className="relative min-h-screen">
      <SiteBackground />

      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-20 pt-10 sm:px-8 sm:pt-14">
        <Link
          href="/"
          className="label-mono mb-8 inline-flex w-fit items-center gap-2 text-xs uppercase text-muted transition-colors hover:text-accent"
        >
          ← Zurück
        </Link>

        <header className="mb-8 border-b border-border pb-6">
          <p className="label-mono text-xs uppercase text-muted">// Universum</p>
          <h1 className="font-display mt-2 text-2xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
            Universum kennenlernen
          </h1>
          <p className="mt-3 max-w-2xl text-xs leading-relaxed text-muted sm:text-sm">
            Zahlen und Fakten zum Kosmos — vom Alter des Universums über
            Dunkle Materie bis zu Schwarzen Löchern. Auf eine Karte klicken
            für eine ausführlichere Erklärung. Dazu aktuelle Live-News aus
            der Raumfahrt.
          </p>
        </header>

        <div className="mb-10">
          <p className="label-mono text-xs uppercase">// Universum in Zahlen</p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {UNIVERSE_FACTS.map((fact, i) => (
            <RevealCard
              key={fact.label}
              className="glass-card p-6"
              onClick={() => setSelectedFact(i)}
            >
              {(inView) => (
                <>
                  <FactThumbnail src={fact.image} alt={fact.label} />
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

        <SpaceNewsSection />

        {selectedFact !== null && (
          <DetailModal
            eyebrow="// Universum in Zahlen"
            title={UNIVERSE_FACTS[selectedFact].label}
            meta={UNIVERSE_FACTS[selectedFact].value}
            paragraphs={UNIVERSE_FACTS[selectedFact].details}
            imageUrl={UNIVERSE_FACTS[selectedFact].image}
            imageAlt={UNIVERSE_FACTS[selectedFact].label}
            imageCredit="Bild: Wikimedia Commons"
            onClose={() => setSelectedFact(null)}
          />
        )}
      </div>
    </main>
  );
}
