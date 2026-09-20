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

// Bild-URLs über Wikimedia Commons' "Special:FilePath"-Umleitung statt
// direkter upload.wikimedia.org-Pfade (Nutzerkorrektur 20.09.2026: "es
// fehlt hier noch bilder") — Special:FilePath/<Dateiname> löst IMMER
// zuverlässig zur echten Bild-URL auf, ganz ohne den MD5-Hash-Ordner
// (/a/ab/…) erraten zu müssen, der bei einigen der vorherigen Direkt-Links
// nicht (mehr) stimmte und die Bilder deshalb stumm nicht luden.
//
// Nutzerwunsch 20.09.2026: "Universum in Zahlen" + Space News auf eine
// eigene Seite auslagern (wie "Weltgeschichte entdecken" für die Imperien-
// Karte) und dabei mit MEHR Infos übers Universum füllen — die ursprünglich
// 6 Fakten (aus der alten FactsSection auf der Startseite) sind hier um
// weitere ergänzt.
function commonsFile(filename: string): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=800`;
}
const UNIVERSE_FACTS: UniverseFact[] = [
  {
    label: "Alter des Universums",
    value: "≈ 13,8 Mrd. Jahre",
    details: [
      "Das Alter von rund 13,8 Milliarden Jahren stammt aus Messungen des kosmischen Mikrowellenhintergrunds — der 'Nachglühen'-Strahlung des Urknalls, die den gesamten Himmel durchzieht.",
      "Missionen wie WMAP und Planck haben diese Hintergrundstrahlung extrem präzise vermessen und daraus, zusammen mit der Ausdehnungsrate des Universums, das Alter berechnet.",
      "Zum Vergleich: Unser Sonnensystem existiert erst seit etwa 4,6 Milliarden Jahren — das Universum war also schon zwei Drittel seines bisherigen Lebens alt, bevor die Erde entstand.",
    ],
    image: commonsFile("Cosmic_Microwave_Background_(CMB).jpeg"),
  },
  {
    label: "Beobachtbares Universum",
    value: "≈ 93 Mrd. Lichtjahre Ø",
    details: [
      "Das beobachtbare Universum ist die Kugel um uns herum, aus der Licht seit dem Urknall Zeit hatte, uns zu erreichen. Ihr Durchmesser beträgt etwa 93 Milliarden Lichtjahre.",
      "Das ist größer als '13,8 Milliarden Lichtjahre in jede Richtung', weil sich der Raum selbst seit dem Urknall ausgedehnt hat — weit entfernte Galaxien sind heute viel weiter weg, als es die reine Lichtlaufzeit vermuten lässt.",
      "Das gesamte Universum könnte deutlich größer sein oder sogar unendlich — wir sehen nur den Teil, aus dem uns bisher Licht erreicht hat.",
    ],
    image: commonsFile("Hubble_ultra_deep_field_high_rez.jpg"),
  },
  {
    label: "Galaxien (geschätzt)",
    value: "≈ 2 Billionen",
    details: [
      "Frühere Schätzungen aus Hubble-Daten gingen von etwa 200 Milliarden Galaxien aus; eine Analyse von 2016 kam nach Hochrechnung sehr schwacher, kleiner Galaxien auf bis zu 2 Billionen.",
      "Neuere Auswertungen mit dem James-Webb-Weltraumteleskop deuten inzwischen eher wieder auf niedrigere zweistellige Milliardenwerte hin — die genaue Zahl bleibt Gegenstand aktiver Forschung.",
      "Jede dieser Galaxien enthält selbst wieder Hunderte Millionen bis Billionen Sterne — die schiere Größenordnung ist für den Menschen kaum intuitiv greifbar.",
    ],
    image: commonsFile("NGC_4414_(NASA-med).jpg"),
  },
  {
    label: "Sterne in der Milchstraße",
    value: "100–400 Mrd.",
    details: [
      "Unsere Heimatgalaxie, die Milchstraße, ist eine Balken-Spiralgalaxie mit einem Durchmesser von etwa 100.000 Lichtjahren.",
      "Die Sonne befindet sich in einem ihrer Spiralarme, rund 26.000 Lichtjahre vom galaktischen Zentrum entfernt, und umkreist dieses Zentrum einmal in etwa 225–250 Millionen Jahren.",
      "Die Unsicherheit bei der Sternenzahl (100–400 Milliarden) liegt daran, dass viele kleine, lichtschwache Sterne von der Erde aus kaum direkt zu zählen sind.",
    ],
    image: commonsFile("ESO-VLT-Laser-phot-33a-07.jpg"),
  },
  {
    label: "Lichtgeschwindigkeit",
    value: "299.792 km/s",
    details: [
      "Die Lichtgeschwindigkeit im Vakuum (exakt 299.792.458 m/s) ist eine fundamentale Naturkonstante — nichts, was Information oder Materie überträgt, kann sie überschreiten.",
      "Sie ist auch die Grundlage von Einsteins spezieller Relativitätstheorie: Raum und Zeit verhalten sich so, dass die Lichtgeschwindigkeit für alle Beobachter gleich bleibt.",
      "Weil Licht endlich schnell ist, blicken wir beim Blick ins All immer in die Vergangenheit — das Sonnenlicht, das uns gerade erreicht, ist rund 8 Minuten alt.",
    ],
    image: commonsFile("Earth_to_Sun_-_en.png"),
  },
  {
    label: "Nächster Stern (Alpha Centauri)",
    value: "4,25 Lichtjahre",
    details: [
      "Proxima Centauri, Teil des Alpha-Centauri-Dreifachsystems, ist mit 4,25 Lichtjahren Entfernung der sonnennächste bekannte Stern.",
      "Mit heutiger Raumfahrttechnik (chemische Raketen) würde eine Reise dorthin viele Zehntausende Jahre dauern — selbst mit den schnellsten je gebauten Sonden wären es noch Jahrtausende.",
      "Um Proxima Centauri kreist mindestens ein erdgroßer Exoplanet in der sogenannten habitablen Zone, was ihn zu einem viel diskutierten Ziel für zukünftige interstellare Missionskonzepte macht.",
    ],
    image: commonsFile("New_shot_of_Proxima_Centauri,_our_nearest_neighbour.jpg"),
  },
  {
    label: "Dunkle Materie",
    value: "≈ 27 % des Universums",
    details: [
      "Dunkle Materie sendet kein Licht aus und lässt sich nicht direkt beobachten — ihre Existenz wird aus ihrer Schwerkraftwirkung geschlossen, etwa daraus, dass sich Galaxien viel schneller drehen, als ihre sichtbare Masse allein erklären könnte.",
      "Sie macht schätzungsweise rund 27 % des gesamten Energieinhalts des Universums aus — gewöhnliche (sichtbare) Materie dagegen nur etwa 5 %.",
      "Woraus Dunkle Materie tatsächlich besteht, ist bis heute ungeklärt — sie zählt zu den größten offenen Fragen der modernen Physik.",
    ],
    image: commonsFile("Bullet_cluster.jpg"),
  },
  {
    label: "Dunkle Energie",
    value: "≈ 68 % des Universums",
    details: [
      "Dunkle Energie ist der Name für das, was die beschleunigte Ausdehnung des Universums antreibt — sie macht mit rund 68 % den größten Anteil am gesamten Energieinhalt des Kosmos aus.",
      "Entdeckt wurde die beschleunigte Expansion Ende der 1990er durch Beobachtungen weit entfernter Supernovae, wofür 2011 der Physik-Nobelpreis vergeben wurde.",
      "Zusammen mit Dunkler Materie bedeutet das: Nur etwa 5 % des Universums bestehen aus der 'gewöhnlichen' Materie, aus der Sterne, Planeten und wir selbst gemacht sind.",
    ],
    image: commonsFile("Universe_expansion-en.svg"),
  },
  {
    label: "Schwarze Löcher",
    value: "bis zu Milliarden Sonnenmassen",
    details: [
      "Ein Schwarzes Loch entsteht, wenn Masse so extrem konzentriert ist, dass selbst Licht seine Anziehungskraft nicht mehr überwinden kann — die Grenze dazu heißt Ereignishorizont.",
      "Im Zentrum fast jeder großen Galaxie sitzt vermutlich ein supermassereiches Schwarzes Loch; das der Milchstraße (Sagittarius A*) hat etwa 4 Millionen Sonnenmassen.",
      "2019 gelang mit dem Event Horizon Telescope die erste direkte Abbildung eines Schwarzen Lochs (in der Galaxie M87) — ein Meilenstein der Astronomie.",
    ],
    image: commonsFile("Black_hole_-_Messier_87_crop_max_res.jpg"),
  },
  {
    label: "Exoplaneten (bestätigt)",
    value: "über 5.800",
    details: [
      "Seit der ersten Bestätigung eines Exoplaneten um einen sonnenähnlichen Stern 1995 wurden über 5.800 weitere Planeten außerhalb unseres Sonnensystems nachgewiesen (Stand: NASA Exoplanet Archive).",
      "Die meisten wurden über die Transitmethode entdeckt — ein Planet zieht vor seinem Stern vorbei und dimmt dessen Licht minimal, was Weltraumteleskope wie Kepler und TESS registrieren.",
      "Ein wichtiges Forschungsziel sind Planeten in der 'habitablen Zone' — mit Bedingungen, unter denen flüssiges Wasser an der Oberfläche möglich wäre.",
    ],
    image: commonsFile("Kepler186f-ArtistConcept-20140417.jpg"),
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

// Nutzerkorrektur 20.09.2026: "mach es bitte klein also die boxen klein
// das bild daneben auch klein (box soll futuristisch sein)" — statt eines
// großen 16:9-Bilds über der ganzen Kartenbreite jetzt ein kleines
// quadratisches Vorschaubild SEITLICH neben dem Text, mit einer dünnen
// Akzent-Ecke (HUD-artiger Rahmen) für den futuristischen Look. Blendet
// sich unsichtbar aus, falls ein Bild mal nicht lädt.
function FactThumbnail({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) return null;
  return (
    <div className="relative h-14 w-14 flex-none overflow-hidden border border-border bg-surface-elevated sm:h-16 sm:w-16">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
        onError={() => setFailed(true)}
      />
      <span className="pointer-events-none absolute inset-0 border border-accent/0 transition-colors group-hover:border-accent/60" />
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
              className="glass-card flex items-center gap-3 p-3"
              onClick={() => setSelectedFact(i)}
            >
              {(inView) => (
                <>
                  <FactThumbnail src={fact.image} alt={fact.label} />
                  <div className="min-w-0 flex-1">
                    <p className="font-display min-h-[1.3em] text-sm font-bold text-accent sm:text-base">
                      <Typewriter text={fact.value} active={inView} speed={12} />
                    </p>
                    <p className="mt-1 min-h-[1.2em] text-[10px] uppercase leading-snug tracking-wide text-muted">
                      <Typewriter
                        text={fact.label}
                        active={inView}
                        speed={10}
                        delay={fact.value.length * 12 + 150}
                      />
                    </p>
                  </div>
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
