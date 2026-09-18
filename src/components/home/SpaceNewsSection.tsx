"use client";

import { useState, type ReactNode } from "react";
import Typewriter from "@/components/ui/Typewriter";
import DetailModal from "@/components/ui/DetailModal";
import { useInView } from "@/hooks/useInView";

interface SpaceNewsItem {
  title: string;
  date: string;
  status: "Abgeschlossen" | "Geplant";
  summary: string;
  details: string[];
  image: string;
}

// Reale, recherchierte Ereignisse aus der Raumfahrt 2026 (Stand: September
// 2026) — keine erfundenen Missionen oder Daten.
const SPACE_NEWS: SpaceNewsItem[] = [
  {
    title: "Artemis II — bemannter Mondvorbeiflug",
    date: "1.–6. April 2026",
    status: "Abgeschlossen",
    summary: "NASA schickte erstmals seit Apollo 17 (1972) wieder Menschen über die niedrige Erdumlaufbahn hinaus.",
    details: [
      "Vier Astronauten umrundeten an Bord der Orion-Raumkapsel den Mond auf einer rund zehntägigen Mission — die erste bemannte Mission jenseits der niedrigen Erdumlaufbahn seit Apollo 17 im Jahr 1972.",
      "Am 6. April erreichte die Besatzung mit ihrer Position den bis dahin am weitesten von der Erde entfernten Punkt, den je Menschen in einem Raumschiff erreicht haben.",
      "Artemis II war ein reiner Vorbeiflug ohne Landung — sie diente als Test der Orion-Kapsel und ihrer Lebenserhaltungssysteme vor der geplanten Mondlandung von Artemis III.",
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Earthset_%28art002e009288%29.jpg/1600px-Earthset_%28art002e009288%29.jpg",
  },
  {
    title: "Nancy Grace Roman Space Telescope",
    date: "Start: 30. August 2026",
    status: "Abgeschlossen",
    summary: "NASAs neues Infrarot-Teleskop mit einem etwa 100-mal größeren Sichtfeld als Hubble.",
    details: [
      "Das Nancy Grace Roman Space Telescope startete am 30. August 2026 und wurde zum Lagrange-Punkt L2 zwischen Erde und Sonne gebracht — demselben Beobachtungspunkt wie das James-Webb-Teleskop.",
      "Sein Hauptinstrument hat ein Sichtfeld, das etwa 100-mal größer ist als das von Hubble, bei vergleichbarer Bildschärfe — dadurch kann es riesige Himmelsareale gleichzeitig kartieren.",
      "Zu den Hauptzielen zählen die Erforschung Dunkler Energie und Dunkler Materie sowie die Suche nach Exoplaneten mittels Gravitationslinsen-Effekten.",
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/ROMANNewModelV8RomanStill00049.png/1600px-ROMANNewModelV8RomanStill00049.png",
  },
  {
    title: "BepiColombo erreicht den Merkur",
    date: "November 2026 (geplant)",
    status: "Geplant",
    summary: "Die gemeinsame ESA/JAXA-Sonde schwenkt nach acht Jahren Reise in den Merkur-Orbit ein.",
    details: [
      "BepiColombo ist eine gemeinsame Mission der europäischen (ESA) und japanischen (JAXA) Raumfahrtagenturen und befindet sich seit ihrem Start 2018 auf dem Weg zum sonnennächsten Planeten.",
      "Nach acht Jahren Reisezeit und mehreren Vorbeiflügen an Erde, Venus und Merkur selbst soll die Sonde im November 2026 endgültig in den Orbit um Merkur einschwenken.",
      "Ziel ist die detaillierte Erforschung von Merkurs Oberfläche, Magnetfeld und innerem Aufbau — Fragen, die die vorherige NASA-Mission MESSENGER nicht vollständig klären konnte.",
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/4/46/BepiColombo_stack_cropped.jpg",
  },
  {
    title: "Tianwen-2 erreicht Asteroid Kamoʻoalewa",
    date: "4.–7. Juli 2026",
    status: "Abgeschlossen",
    summary: "Chinas Sonde sammelte Proben vom erdnahen Asteroiden Kamoʻoalewa, einem möglichen Mondbruchstück.",
    details: [
      "Die chinesische Raumsonde Tianwen-2 erreichte im Juli 2026 den kleinen erdnahen Asteroiden Kamoʻoalewa, um Proben von seiner Oberfläche zu sammeln.",
      "Kamoʻoalewa gilt als sogenannter Quasi-Mond der Erde und wird von manchen Forschenden als mögliches Bruchstück des Erdmonds diskutiert, das bei einem alten Einschlag herausgeschlagen wurde.",
      "Die gesammelten Proben sollen zur Erde zurückgebracht werden, während die Sonde anschließend zu einem zweiten Ziel weiterfliegt, dem Hauptgürtel-Kometen 311P.",
    ],
    image: "https://upload.wikimedia.org/wikipedia/en/0/0c/First_look_at_Kamo%CA%BBoalewa_from_Tianwen-2.jpg",
  },
  {
    title: "Hera erreicht das Didymos-System",
    date: "November 2026 (geplant)",
    status: "Geplant",
    summary: "ESA-Sonde untersucht die Folgen des DART-Einschlags auf dem Asteroidenmond Dimorphos.",
    details: [
      "Die ESA-Mission Hera soll im November 2026 beim Doppelasteroiden-System Didymos/Dimorphos ankommen.",
      "2022 hatte die NASA-Sonde DART den kleineren Begleitasteroiden Dimorphos absichtlich gerammt, um zu testen, ob sich die Umlaufbahn eines Asteroiden durch einen gezielten Einschlag verändern lässt — mit Erfolg.",
      "Hera soll nun die Einschlagstelle und die Struktur beider Himmelskörper im Detail vermessen und liefert damit wichtige Daten für zukünftige Asteroiden-Abwehrmissionen.",
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/5/50/Hera_in_orbit.jpg",
  },
  {
    title: "Crew-12 bringt ISS auf volle Besatzung",
    date: "Start: 13. Februar 2026",
    status: "Abgeschlossen",
    summary: "Vier neue Astronauten stellten die reguläre Sieben-Personen-Besatzung der ISS wieder her.",
    details: [
      "Mit der Crew-12-Mission brachte NASA im Februar 2026 vier weitere Astronauten zur Internationalen Raumstation und stellte damit die normale Besatzungsstärke von sieben Personen wieder her.",
      "Die ISS ist seit über zwei Jahrzehnten durchgehend bewohnt und dient als Forschungslabor in der Schwerelosigkeit für Experimente aus Medizin, Materialwissenschaft und Biologie.",
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/The_station_pictured_from_the_SpaceX_Crew_Dragon_5.jpg/1600px-The_station_pictured_from_the_SpaceX_Crew_Dragon_5.jpg",
  },
  {
    title: "China gelingt erste Booster-Bergung per Netz",
    date: "10. Juli 2026",
    status: "Abgeschlossen",
    summary: "Mit der Long March 10B wurde China zur zweiten Nation, die eine Raketenstufe nach Orbitalflug erfolgreich zurückgewinnt.",
    details: [
      "Am 10. Juli 2026 gelang China mit der Rakete Long March 10B erstmals die Bergung einer Raketen-Erststufe nach einem Orbitalflug — per Auffangnetz auf See, statt einer Landung wie bei SpaceX.",
      "Damit wurde China nach den USA zur zweiten Nation, die eine wiederverwendbare Raketenstufe nach einem echten Orbitalstart erfolgreich zurückgewinnen konnte.",
      "Wiederverwendbare Raketenstufen gelten als Schlüsseltechnologie, um Weltraumstarts langfristig deutlich günstiger zu machen.",
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Long_March_10_mockup_-_NMC.jpg/1600px-Long_March_10_mockup_-_NMC.jpg",
  },
  {
    title: "Spectrum: erster Orbitalstart von Westeuropa aus",
    date: "5. September 2026",
    status: "Abgeschlossen",
    summary: "Das deutsche Start-up Isar Aerospace erreichte mit seiner Rakete Spectrum von Norwegen aus den Orbit.",
    details: [
      "Die Rakete Spectrum des deutschen Raumfahrt-Start-ups Isar Aerospace startete am 5. September 2026 vom norwegischen Weltraumbahnhof Andøya aus.",
      "Es war der erste erfolgreiche Orbitalstart, der jemals von westeuropäischem Boden aus gelang — bisherige europäische Starts liefen meist über das Weltraumzentrum Kourou in Französisch-Guayana.",
      "Der Erfolg gilt als wichtiger Schritt für eine unabhängigere europäische Trägerraketen-Industrie neben Ariane.",
    ],
    image: "https://upload.wikimedia.org/wikipedia/en/d/d7/Spectrum_rocket.jpg",
  },
  {
    title: "Chang'e 7: Mission zum Mondsüdpol",
    date: "2. Halbjahr 2026 (geplant)",
    status: "Geplant",
    summary: "Chinesische Mission mit Lander, Rover und Hüpfer zur Erkundung von Wassereis am Mondsüdpol.",
    details: [
      "Chang'e 7 ist Chinas nächste große Mondmission und soll aus einem Orbiter, einem Lander, einem Rover und einem kleinen Hüpf-Fahrzeug bestehen.",
      "Ziel ist die Region um den Mondsüdpol, in permanent beschatteten Kratern, in denen Wassereis vermutet wird — eine Schlüsselressource für künftige bemannte Mondbasen.",
      "Die Mission ist Teil des chinesischen Fahrplans zu einer geplanten internationalen Mondforschungsstation gemeinsam mit Russland.",
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Artist_view_of_Chang%27e_7_lunar_mission_post_launch_01.png",
  },
  {
    title: "Pandora-Weltraumteleskop gestartet",
    date: "11. Januar 2026",
    status: "Abgeschlossen",
    summary: "Kleines NASA-Teleskop zur Untersuchung von Exoplaneten-Atmosphären, gestartet mit einer Falcon 9.",
    details: [
      "Das kompakte NASA-Teleskop Pandora startete am 11. Januar 2026 an Bord einer SpaceX-Falcon-9-Rakete, zusammen mit den Kleinsatelliten SPARCS und BlackCAT.",
      "Pandora ist auf die Untersuchung von Exoplaneten-Atmosphären spezialisiert — es soll helfen, störende Signale der Muttersterne von echten Atmosphären-Signaturen der Planeten zu unterscheiden.",
      "Als vergleichsweise kleine, kostengünstige Mission ergänzt Pandora größere Teleskope wie James Webb bei der Exoplaneten-Forschung.",
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/NASA%E2%80%99s_Pandora_Satellite_to_Explore_Exoplanets_and_Stars_%28SVS14945_-_Graphic_No_Text%29.jpg/1600px-NASA%E2%80%99s_Pandora_Satellite_to_Explore_Exoplanets_and_Stars_%28SVS14945_-_Graphic_No_Text%29.jpg",
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

interface CardThumbnailProps {
  src: string;
  alt: string;
}

/** Kleines Vorschaubild oben in der Karte — blendet sich unsichtbar aus,
 * falls die Wikimedia-Datei mal nicht lädt, statt kaputt auszusehen. */
function CardThumbnail({ src, alt }: CardThumbnailProps) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <div className="-mx-4 -mt-4 mb-3 aspect-[16/9] overflow-hidden bg-surface-elevated">
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
 * Space-News-Sektion — reale, recherchierte Ereignisse aus der Raumfahrt
 * 2026 (keine erfundenen Missionen). Gleiches Muster wie FactsSection:
 * Scroll-Typewriter + anklickbare Detailansicht mit echtem Bild.
 */
export default function SpaceNewsSection() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="mx-auto mt-20 w-full max-w-5xl sm:mt-28">
      <div className="mb-10 border-b border-border pb-4">
        <p className="label-mono text-xs uppercase">// Space News 2026</p>
      </div>

      <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-4">
        {SPACE_NEWS.map((item, i) => (
          <RevealCard
            key={item.title}
            className="glass-card p-4"
            onClick={() => setSelected(i)}
          >
            {(inView) => (
              <>
                <CardThumbnail
                  src={item.image}
                  alt={item.title}
                />
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="label-mono text-[9px] uppercase">{item.date}</p>
                  <span
                    className={`label-mono border px-1 py-0.5 text-[8px] uppercase ${
                      item.status === "Geplant"
                        ? "border-accent text-accent"
                        : "border-border text-muted"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="min-h-[2.6em] text-[11px] font-semibold uppercase leading-snug tracking-wide text-foreground">
                  <Typewriter text={item.title} active={inView} speed={7} />
                </p>
                <p className="label-mono mt-2 text-[9px] uppercase opacity-0 transition-opacity group-hover:opacity-100">
                  // mehr erfahren
                </p>
              </>
            )}
          </RevealCard>
        ))}
      </div>

      {selected !== null && (
        <DetailModal
          eyebrow="// Space News 2026"
          title={SPACE_NEWS[selected].title}
          meta={SPACE_NEWS[selected].date}
          paragraphs={SPACE_NEWS[selected].details}
          imageUrl={SPACE_NEWS[selected].image}
          imageAlt={SPACE_NEWS[selected].title}
          imageCredit="Bild: Wikimedia Commons"
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
