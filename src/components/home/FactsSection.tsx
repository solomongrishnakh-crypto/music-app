"use client";

import { useState, type ReactNode } from "react";
import Typewriter from "@/components/ui/Typewriter";
import DetailModal from "@/components/ui/DetailModal";
import { useInView } from "@/hooks/useInView";

interface UniverseFact {
  label: string;
  value: string;
  details: string[];
  image: string;
}

interface EmpireFact {
  name: string;
  peak: string;
  text: string;
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

const EMPIRE_FACTS: EmpireFact[] = [
  {
    name: "Britisches Empire",
    peak: "Frühes 20. Jh.",
    text: "Größtes Imperium der Geschichte — zeitweise rund ein Viertel der Landfläche der Erde und ein Viertel der Weltbevölkerung.",
    details: [
      "Auf seinem Höhepunkt um 1920 erstreckte sich das Britische Empire über rund 35,5 Millionen km² auf allen bewohnten Kontinenten — geprägt vom geflügelten Ausdruck, dass 'die Sonne nie unterging'.",
      "Es entstand ab dem 16./17. Jahrhundert aus Handelskompanien und Kolonialbesitz und wuchs über See- und Wirtschaftsmacht, insbesondere während der industriellen Revolution.",
      "Die Kolonialherrschaft brachte tiefgreifende, bis heute nachwirkende Folgen für die betroffenen Regionen mit sich — wirtschaftliche Ausbeutung, Grenzziehungen ohne Rücksicht auf lokale Strukturen und gewaltsame Konflikte gehören ebenso zur historischen Bilanz wie Infrastruktur- und Verwaltungsaufbau.",
      "Nach dem Zweiten Weltkrieg begann die schrittweise Entkolonialisierung; aus dem Empire ging der Commonwealth of Nations hervor, dem heute 56 überwiegend unabhängige Staaten angehören.",
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Flag_of_Great_Britain_%281707%E2%80%931800%29.svg/1200px-Flag_of_Great_Britain_%281707%E2%80%931800%29.svg.png",
  },
  {
    name: "Mongolisches Reich",
    peak: "13. Jh.",
    text: "Größtes zusammenhängendes Landimperium aller Zeiten — von Ostasien bis Osteuropa, ca. 24 Mio. km².",
    details: [
      "Gegründet von Dschingis Khan ab 1206, wuchs das Mongolische Reich innerhalb weniger Jahrzehnte durch überlegene Reiterkriegsführung und Logistik zum größten zusammenhängenden Landreich der Geschichte.",
      "Auf seinem Höhepunkt reichte es von Korea und China im Osten bis nach Osteuropa und in den Nahen Osten — etwa 24 Millionen km², rund 16 % der gesamten Landfläche der Erde.",
      "Die Eroberungen forderten enorme menschliche Opfer und zerstörten zahlreiche Städte; gleichzeitig etablierten die Mongolen entlang der Seidenstraße relative Sicherheit für Handel und Reisende ('Pax Mongolica') sowie religiöse Toleranz innerhalb des Reiches.",
      "Nach dem Tod des Großkhans Möngke 1259 zerfiel das Reich zunehmend in einzelne Khanate, die sich kulturell und politisch immer weiter voneinander entfernten.",
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/3/35/YuanEmperorAlbumGenghisPortrait.jpg",
  },
  {
    name: "Römisches Reich",
    peak: "2. Jh. n. Chr.",
    text: "Höhepunkt unter Trajan: rund 5 Mio. km² und schätzungsweise 60–70 Mio. Einwohner rund ums Mittelmeer.",
    details: [
      "Unter Kaiser Trajan (98–117 n. Chr.) erreichte das Römische Reich seine größte Ausdehnung — von Britannien im Nordwesten bis Mesopotamien im Osten, rund 5 Millionen km².",
      "Es entwickelte ein für die Antike beispielloses Verwaltungs-, Rechts- und Infrastruktursystem: über 80.000 km gepflasterte Straßen, Aquädukte, ein einheitliches Rechtssystem und eine gemeinsame Verkehrssprache (Latein im Westen, Griechisch im Osten).",
      "Wie andere antike Imperien beruhte der römische Wohlstand teils auf Eroberungskriegen und weitverbreiteter Sklaverei, die einen erheblichen Teil der Wirtschaft trug.",
      "Das Weströmische Reich zerfiel 476 n. Chr.; das Oströmische (Byzantinische) Reich bestand mit Konstantinopel als Hauptstadt noch fast tausend Jahre länger, bis 1453.",
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/0/00/Roman_Empire_Trajan_117AD.png",
  },
  {
    name: "Perserreich (Achämeniden)",
    peak: "6.–4. Jh. v. Chr.",
    text: "Erstes echte 'Weltreich' — von Griechenland und Ägypten bis zum Industal, mit frühem Verwaltungs- und Straßensystem.",
    details: [
      "Gegründet von Kyros II. ab 550 v. Chr., wuchs das Achämenidenreich zum bis dahin größten Reich der Geschichte — von Teilen Griechenlands über Ägypten bis zum Industal in Südasien.",
      "Es gilt vielen Historikern als erstes echtes 'Weltreich': Es organisierte sein riesiges, multiethnisches Gebiet in Provinzen (Satrapien) mit einheitlicher Verwaltung, einem Kurierstraßennetz ('Königsstraße') und relativer religiöser Toleranz gegenüber unterworfenen Völkern.",
      "Unter Dareios I. und Xerxes I. kam es zu den bekannten Perserkriegen gegen die griechischen Stadtstaaten, die in der westlichen Überlieferung stark aus griechischer Perspektive geprägt sind.",
      "336 v. Chr. wurde das Reich von Alexander dem Großen erobert, dessen Verwaltung in weiten Teilen auf den bestehenden persischen Strukturen aufbaute.",
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Achaemenid_Empire_500_BCE.jpg",
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
    | { type: "universe"; index: number }
    | { type: "empire"; index: number }
    | null
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

      <div className="mb-10 mt-20 border-b border-border pb-4">
        <p className="label-mono text-xs uppercase">// Große Imperien der Geschichte</p>
      </div>

      <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
        {EMPIRE_FACTS.map((empire, i) => (
          <RevealCard
            key={empire.name}
            className="glass-card p-6"
            onClick={() => setSelected({ type: "empire", index: i })}
          >
            {(inView) => (
              <>
                <div className="mb-3 flex items-baseline justify-between">
                  <p className="font-display text-2xl font-bold text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="label-mono text-[11px] uppercase">{empire.peak}</p>
                </div>
                <p className="min-h-[1.4em] text-sm font-semibold uppercase tracking-wide text-foreground">
                  <Typewriter text={empire.name} active={inView} speed={16} />
                </p>
                <p className="mt-2 min-h-[3.5em] text-xs leading-relaxed text-muted">
                  <Typewriter
                    text={empire.text}
                    active={inView}
                    speed={5}
                    delay={empire.name.length * 16 + 200}
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

      {selected?.type === "empire" && (
        <DetailModal
          eyebrow="// Große Imperien der Geschichte"
          title={EMPIRE_FACTS[selected.index].name}
          meta={EMPIRE_FACTS[selected.index].peak}
          paragraphs={EMPIRE_FACTS[selected.index].details}
          imageUrl={EMPIRE_FACTS[selected.index].image}
          imageAlt={EMPIRE_FACTS[selected.index].name}
          imageCredit="Bild: Wikimedia Commons"
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
