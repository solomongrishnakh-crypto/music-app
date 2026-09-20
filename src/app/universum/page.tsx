"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import SiteBackground from "@/components/particles/SiteBackground";
import Typewriter from "@/components/ui/Typewriter";
import DetailModal from "@/components/ui/DetailModal";
import SpaceNewsSection from "@/components/home/SpaceNewsSection";
import SolarSystem from "@/components/universe/SolarSystem";
import SolarSystemModal from "@/components/universe/SolarSystemModal";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useInView } from "@/hooks/useInView";
import type { LocalizedText } from "@/lib/i18n";
import { localize } from "@/lib/i18n";

interface UniverseFact {
  label: LocalizedText;
  value: LocalizedText;
  details: [LocalizedText, LocalizedText, LocalizedText];
  image: string;
}

// Bild-URLs über Wikimedia Commons' "Special:FilePath"-Umleitung statt
// direkter upload.wikimedia.org-Pfade (Nutzerkorrektur 20.09.2026: "es
// fehlt hier noch bilder") — Special:FilePath/<Dateiname> löst IMMER
// zuverlässig zur echten Bild-URL auf, ganz ohne den MD5-Hash-Ordner
// (/a/ab/…) erraten zu müssen, der bei einigen der vorherigen Direkt-Links
// nicht (mehr) stimmte und die Bilder deshalb stumm nicht luden.
//
// Nutzerwunsch 20.09.2026: "alles soll auf anderen sprache sein also jedes
// text und details" — jedes Feld ist jetzt LocalizedText (de + en vollständig
// übersetzt; weitere Sprachen fallen bis zur Übersetzung auf Englisch zurück).
function commonsFile(filename: string): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=800`;
}

const UNIVERSE_FACTS: UniverseFact[] = [
  {
    label: { de: "Alter des Universums", en: "Age of the Universe" },
    value: { de: "≈ 13,8 Mrd. Jahre", en: "≈ 13.8 billion years" },
    details: [
      {
        de: "Das Alter von rund 13,8 Milliarden Jahren stammt aus Messungen des kosmischen Mikrowellenhintergrunds — der 'Nachglühen'-Strahlung des Urknalls, die den gesamten Himmel durchzieht.",
        en: "The age of roughly 13.8 billion years comes from measurements of the cosmic microwave background — the 'afterglow' radiation of the Big Bang that fills the entire sky.",
      },
      {
        de: "Missionen wie WMAP und Planck haben diese Hintergrundstrahlung extrem präzise vermessen und daraus, zusammen mit der Ausdehnungsrate des Universums, das Alter berechnet.",
        en: "Missions such as WMAP and Planck measured this background radiation with extreme precision and, combined with the universe's expansion rate, calculated its age.",
      },
      {
        de: "Zum Vergleich: Unser Sonnensystem existiert erst seit etwa 4,6 Milliarden Jahren — das Universum war also schon zwei Drittel seines bisherigen Lebens alt, bevor die Erde entstand.",
        en: "For comparison: our solar system has existed for only about 4.6 billion years — the universe was already two-thirds of its current age before Earth formed.",
      },
    ],
    image: commonsFile("Cosmic_Microwave_Background_(CMB).jpeg"),
  },
  {
    label: { de: "Beobachtbares Universum", en: "Observable Universe" },
    value: { de: "≈ 93 Mrd. Lichtjahre Ø", en: "≈ 93 billion light-years across" },
    details: [
      {
        de: "Das beobachtbare Universum ist die Kugel um uns herum, aus der Licht seit dem Urknall Zeit hatte, uns zu erreichen. Ihr Durchmesser beträgt etwa 93 Milliarden Lichtjahre.",
        en: "The observable universe is the sphere around us from which light has had time to reach us since the Big Bang. Its diameter is about 93 billion light-years.",
      },
      {
        de: "Das ist größer als '13,8 Milliarden Lichtjahre in jede Richtung', weil sich der Raum selbst seit dem Urknall ausgedehnt hat — weit entfernte Galaxien sind heute viel weiter weg, als es die reine Lichtlaufzeit vermuten lässt.",
        en: "That's larger than '13.8 billion light-years in every direction' because space itself has expanded since the Big Bang — distant galaxies are now much farther away than the light's travel time alone would suggest.",
      },
      {
        de: "Das gesamte Universum könnte deutlich größer sein oder sogar unendlich — wir sehen nur den Teil, aus dem uns bisher Licht erreicht hat.",
        en: "The universe as a whole could be far larger, or even infinite — we only see the part from which light has reached us so far.",
      },
    ],
    image: commonsFile("Hubble_ultra_deep_field_high_rez.jpg"),
  },
  {
    label: { de: "Galaxien (geschätzt)", en: "Galaxies (estimated)" },
    value: { de: "≈ 2 Billionen", en: "≈ 2 trillion" },
    details: [
      {
        de: "Frühere Schätzungen aus Hubble-Daten gingen von etwa 200 Milliarden Galaxien aus; eine Analyse von 2016 kam nach Hochrechnung sehr schwacher, kleiner Galaxien auf bis zu 2 Billionen.",
        en: "Earlier estimates from Hubble data suggested around 200 billion galaxies; a 2016 analysis, extrapolating very faint, small galaxies, arrived at up to 2 trillion.",
      },
      {
        de: "Neuere Auswertungen mit dem James-Webb-Weltraumteleskop deuten inzwischen eher wieder auf niedrigere zweistellige Milliardenwerte hin — die genaue Zahl bleibt Gegenstand aktiver Forschung.",
        en: "More recent analyses using the James Webb Space Telescope now point back toward a lower, two-digit-billion figure — the exact number remains an active area of research.",
      },
      {
        de: "Jede dieser Galaxien enthält selbst wieder Hunderte Millionen bis Billionen Sterne — die schiere Größenordnung ist für den Menschen kaum intuitiv greifbar.",
        en: "Each of these galaxies in turn contains hundreds of millions to trillions of stars — the sheer scale is barely intuitive for a human mind to grasp.",
      },
    ],
    image: commonsFile("NGC_4414_(NASA-med).jpg"),
  },
  {
    label: { de: "Sterne in der Milchstraße", en: "Stars in the Milky Way" },
    value: { de: "100–400 Mrd.", en: "100–400 billion" },
    details: [
      {
        de: "Unsere Heimatgalaxie, die Milchstraße, ist eine Balken-Spiralgalaxie mit einem Durchmesser von etwa 100.000 Lichtjahren.",
        en: "Our home galaxy, the Milky Way, is a barred spiral galaxy roughly 100,000 light-years across.",
      },
      {
        de: "Die Sonne befindet sich in einem ihrer Spiralarme, rund 26.000 Lichtjahre vom galaktischen Zentrum entfernt, und umkreist dieses Zentrum einmal in etwa 225–250 Millionen Jahren.",
        en: "The Sun sits in one of its spiral arms, about 26,000 light-years from the galactic center, and completes one orbit around it roughly every 225–250 million years.",
      },
      {
        de: "Die Unsicherheit bei der Sternenzahl (100–400 Milliarden) liegt daran, dass viele kleine, lichtschwache Sterne von der Erde aus kaum direkt zu zählen sind.",
        en: "The uncertainty in the star count (100–400 billion) comes from the fact that many small, faint stars are extremely hard to count directly from Earth.",
      },
    ],
    image: commonsFile("ESO-VLT-Laser-phot-33a-07.jpg"),
  },
  {
    label: { de: "Lichtgeschwindigkeit", en: "Speed of Light" },
    value: { de: "299.792 km/s", en: "299,792 km/s" },
    details: [
      {
        de: "Die Lichtgeschwindigkeit im Vakuum (exakt 299.792.458 m/s) ist eine fundamentale Naturkonstante — nichts, was Information oder Materie überträgt, kann sie überschreiten.",
        en: "The speed of light in a vacuum (exactly 299,792,458 m/s) is a fundamental constant of nature — nothing that carries information or matter can exceed it.",
      },
      {
        de: "Sie ist auch die Grundlage von Einsteins spezieller Relativitätstheorie: Raum und Zeit verhalten sich so, dass die Lichtgeschwindigkeit für alle Beobachter gleich bleibt.",
        en: "It is also the foundation of Einstein's special theory of relativity: space and time behave in such a way that the speed of light stays the same for every observer.",
      },
      {
        de: "Weil Licht endlich schnell ist, blicken wir beim Blick ins All immer in die Vergangenheit — das Sonnenlicht, das uns gerade erreicht, ist rund 8 Minuten alt.",
        en: "Because light travels at a finite speed, looking into space always means looking into the past — the sunlight reaching us right now is about 8 minutes old.",
      },
    ],
    image: commonsFile("Earth_to_Sun_-_en.png"),
  },
  {
    label: { de: "Nächster Stern (Alpha Centauri)", en: "Nearest Star (Alpha Centauri)" },
    value: { de: "4,25 Lichtjahre", en: "4.25 light-years" },
    details: [
      {
        de: "Proxima Centauri, Teil des Alpha-Centauri-Dreifachsystems, ist mit 4,25 Lichtjahren Entfernung der sonnennächste bekannte Stern.",
        en: "Proxima Centauri, part of the Alpha Centauri triple star system, is the closest known star to the Sun at 4.25 light-years away.",
      },
      {
        de: "Mit heutiger Raumfahrttechnik (chemische Raketen) würde eine Reise dorthin viele Zehntausende Jahre dauern — selbst mit den schnellsten je gebauten Sonden wären es noch Jahrtausende.",
        en: "With today's spaceflight technology (chemical rockets), a journey there would take many tens of thousands of years — even the fastest probes ever built would need millennia.",
      },
      {
        de: "Um Proxima Centauri kreist mindestens ein erdgroßer Exoplanet in der sogenannten habitablen Zone, was ihn zu einem viel diskutierten Ziel für zukünftige interstellare Missionskonzepte macht.",
        en: "At least one Earth-sized exoplanet orbits Proxima Centauri within its so-called habitable zone, making it a much-discussed target for future interstellar mission concepts.",
      },
    ],
    image: commonsFile("New_shot_of_Proxima_Centauri,_our_nearest_neighbour.jpg"),
  },
  {
    label: { de: "Dunkle Materie", en: "Dark Matter" },
    value: { de: "≈ 27 % des Universums", en: "≈ 27% of the universe" },
    details: [
      {
        de: "Dunkle Materie sendet kein Licht aus und lässt sich nicht direkt beobachten — ihre Existenz wird aus ihrer Schwerkraftwirkung geschlossen, etwa daraus, dass sich Galaxien viel schneller drehen, als ihre sichtbare Masse allein erklären könnte.",
        en: "Dark matter emits no light and cannot be observed directly — its existence is inferred from its gravitational effects, such as galaxies rotating far faster than their visible mass alone could explain.",
      },
      {
        de: "Sie macht schätzungsweise rund 27 % des gesamten Energieinhalts des Universums aus — gewöhnliche (sichtbare) Materie dagegen nur etwa 5 %.",
        en: "It is estimated to make up around 27% of the universe's total energy content — ordinary (visible) matter, by contrast, only about 5%.",
      },
      {
        de: "Woraus Dunkle Materie tatsächlich besteht, ist bis heute ungeklärt — sie zählt zu den größten offenen Fragen der modernen Physik.",
        en: "What dark matter is actually made of remains unresolved to this day — it is one of the biggest open questions in modern physics.",
      },
    ],
    image: commonsFile("Bullet_cluster.jpg"),
  },
  {
    label: { de: "Dunkle Energie", en: "Dark Energy" },
    value: { de: "≈ 68 % des Universums", en: "≈ 68% of the universe" },
    details: [
      {
        de: "Dunkle Energie ist der Name für das, was die beschleunigte Ausdehnung des Universums antreibt — sie macht mit rund 68 % den größten Anteil am gesamten Energieinhalt des Kosmos aus.",
        en: "Dark energy is the name for whatever drives the universe's accelerating expansion — at around 68%, it makes up the largest share of the cosmos's total energy content.",
      },
      {
        de: "Entdeckt wurde die beschleunigte Expansion Ende der 1990er durch Beobachtungen weit entfernter Supernovae, wofür 2011 der Physik-Nobelpreis vergeben wurde.",
        en: "The accelerating expansion was discovered in the late 1990s through observations of distant supernovae, work that was awarded the 2011 Nobel Prize in Physics.",
      },
      {
        de: "Zusammen mit Dunkler Materie bedeutet das: Nur etwa 5 % des Universums bestehen aus der 'gewöhnlichen' Materie, aus der Sterne, Planeten und wir selbst gemacht sind.",
        en: "Together with dark matter, this means only about 5% of the universe consists of the 'ordinary' matter that stars, planets, and we ourselves are made of.",
      },
    ],
    image: commonsFile("Universe_expansion-en.svg"),
  },
  {
    label: { de: "Schwarze Löcher", en: "Black Holes" },
    value: { de: "bis zu Milliarden Sonnenmassen", en: "up to billions of solar masses" },
    details: [
      {
        de: "Ein Schwarzes Loch entsteht, wenn Masse so extrem konzentriert ist, dass selbst Licht seine Anziehungskraft nicht mehr überwinden kann — die Grenze dazu heißt Ereignishorizont.",
        en: "A black hole forms when mass is so extremely concentrated that not even light can escape its pull — the boundary is called the event horizon.",
      },
      {
        de: "Im Zentrum fast jeder großen Galaxie sitzt vermutlich ein supermassereiches Schwarzes Loch; das der Milchstraße (Sagittarius A*) hat etwa 4 Millionen Sonnenmassen.",
        en: "A supermassive black hole is thought to sit at the center of almost every large galaxy; the Milky Way's (Sagittarius A*) has about 4 million solar masses.",
      },
      {
        de: "2019 gelang mit dem Event Horizon Telescope die erste direkte Abbildung eines Schwarzen Lochs (in der Galaxie M87) — ein Meilenstein der Astronomie.",
        en: "In 2019, the Event Horizon Telescope produced the first direct image of a black hole (in the galaxy M87) — a milestone in astronomy.",
      },
    ],
    image: commonsFile("Black_hole_-_Messier_87_crop_max_res.jpg"),
  },
  {
    label: { de: "Exoplaneten (bestätigt)", en: "Exoplanets (confirmed)" },
    value: { de: "über 5.800", en: "over 5,800" },
    details: [
      {
        de: "Seit der ersten Bestätigung eines Exoplaneten um einen sonnenähnlichen Stern 1995 wurden über 5.800 weitere Planeten außerhalb unseres Sonnensystems nachgewiesen (Stand: NASA Exoplanet Archive).",
        en: "Since the first confirmed exoplanet around a Sun-like star in 1995, more than 5,800 additional planets outside our solar system have been confirmed (per the NASA Exoplanet Archive).",
      },
      {
        de: "Die meisten wurden über die Transitmethode entdeckt — ein Planet zieht vor seinem Stern vorbei und dimmt dessen Licht minimal, was Weltraumteleskope wie Kepler und TESS registrieren.",
        en: "Most were discovered using the transit method — a planet passes in front of its star and dims its light very slightly, which space telescopes like Kepler and TESS can detect.",
      },
      {
        de: "Ein wichtiges Forschungsziel sind Planeten in der 'habitablen Zone' — mit Bedingungen, unter denen flüssiges Wasser an der Oberfläche möglich wäre.",
        en: "A key research goal is finding planets in the 'habitable zone' — with conditions that could allow liquid water on the surface.",
      },
    ],
    image: commonsFile("Kepler186f-ArtistConcept-20140417.jpg"),
  },
  // Nutzerwunsch 20.09.2026 ("kannst du hier noch mehr boxen hinzufügen
  // also mehr infos mit bilder über universum") — sechs weitere Fakten.
  {
    label: { de: "Andromeda-Galaxie", en: "Andromeda Galaxy" },
    value: { de: "≈ 2,5 Mio. Lichtjahre", en: "≈ 2.5 million light-years" },
    details: [
      {
        de: "Andromeda ist die uns nächstgelegene große Spiralgalaxie und mit bloßem Auge als schwacher, länglicher Fleck am Nachthimmel sichtbar — das am weitesten entfernte Objekt, das Menschen ohne Hilfsmittel erkennen können.",
        en: "Andromeda is the nearest large spiral galaxy to us and is visible to the naked eye as a faint, elongated smudge in the night sky — the most distant object humans can see unaided.",
      },
      {
        de: "Sie ist deutlich größer als die Milchstraße und enthält vermutlich rund eine Billion Sterne.",
        en: "It is noticeably larger than the Milky Way and is thought to contain around one trillion stars.",
      },
      {
        de: "Andromeda und die Milchstraße bewegen sich aufeinander zu und werden in etwa 4,5 Milliarden Jahren zu einer neuen, größeren Galaxie verschmelzen.",
        en: "Andromeda and the Milky Way are moving toward each other and will merge into a new, larger galaxy in about 4.5 billion years.",
      },
    ],
    image: commonsFile("Andromeda_Galaxy_(with_h-alpha).jpg"),
  },
  {
    label: { de: "Die Sonne", en: "The Sun" },
    value: { de: "≈ 1,39 Mio. km Durchmesser", en: "≈ 1.39 million km diameter" },
    details: [
      {
        de: "Die Sonne ist mit rund 1,39 Millionen Kilometern Durchmesser etwa 109-mal so breit wie die Erde und macht allein rund 99,86 % der Masse des gesamten Sonnensystems aus.",
        en: "At about 1.39 million kilometers across, the Sun is roughly 109 times wider than Earth and alone accounts for about 99.86% of the solar system's total mass.",
      },
      {
        de: "An ihrer Oberfläche herrschen etwa 5.500 °C, im Kern durch Kernfusion sogar rund 15 Millionen °C.",
        en: "Its surface reaches about 5,500 °C, while nuclear fusion in its core drives the temperature up to around 15 million °C.",
      },
      {
        de: "Sie ist mit etwa 4,6 Milliarden Jahren ungefähr in der Mitte ihrer Lebenszeit als sogenannter Hauptreihenstern.",
        en: "At about 4.6 billion years old, it is roughly halfway through its lifetime as a so-called main-sequence star.",
      },
    ],
    image: commonsFile(
      "The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA's_Solar_Dynamics_Observatory_-_20100819.jpg"
    ),
  },
  {
    label: { de: "Jupiter", en: "Jupiter" },
    value: { de: "größter Planet", en: "largest planet" },
    details: [
      {
        de: "Jupiter ist mit rund 143.000 Kilometern Durchmesser der mit Abstand größte Planet im Sonnensystem — mehr als 1.300 Erden würden in sein Volumen passen.",
        en: "At about 143,000 kilometers across, Jupiter is by far the largest planet in the solar system — more than 1,300 Earths could fit inside its volume.",
      },
      {
        de: "Seine Masse ist mehr als doppelt so groß wie die aller anderen Planeten des Sonnensystems zusammen.",
        en: "Its mass is more than twice that of all the other planets in the solar system combined.",
      },
      {
        de: "Der berühmte 'Große Rote Fleck' ist ein gigantischer Sturm, größer als die Erde, der seit mindestens rund 150 Jahren beobachtet wird.",
        en: "The famous 'Great Red Spot' is a gigantic storm, larger than Earth, that has been observed for at least about 150 years.",
      },
    ],
    image: commonsFile("Jupiter_by_Cassini-Huygens.jpg"),
  },
  {
    label: { de: "Krebsnebel", en: "Crab Nebula" },
    value: { de: "Supernova von 1054", en: "Supernova of 1054" },
    details: [
      {
        de: "Der Krebsnebel ist der Überrest einer Sternexplosion (Supernova), die chinesische und arabische Astronomen im Jahr 1054 n. Chr. beobachteten und aufzeichneten — sie war so hell, dass sie tagsüber sichtbar war.",
        en: "The Crab Nebula is the remnant of a stellar explosion (supernova) that Chinese and Arab astronomers observed and recorded in the year 1054 CE — it was so bright it was visible during daytime.",
      },
      {
        de: "In seinem Zentrum rotiert heute ein Pulsar — ein extrem dichter, schnell rotierender Neutronenstern, der sich etwa 30-mal pro Sekunde dreht.",
        en: "At its center spins a pulsar today — an extremely dense, rapidly rotating neutron star that turns about 30 times per second.",
      },
      {
        de: "Supernovae wie diese schleudern schwere Elemente ins All, aus denen später neue Sterne, Planeten und letztlich auch Leben entstehen können.",
        en: "Supernovae like this one scatter heavy elements into space, from which new stars, planets, and eventually life can later form.",
      },
    ],
    image: commonsFile("Crab_Nebula.jpg"),
  },
  {
    label: { de: "Voyager 1", en: "Voyager 1" },
    value: { de: "seit 2012 im interstellaren Raum", en: "in interstellar space since 2012" },
    details: [
      {
        de: "Voyager 1, gestartet 1977, ist das am weitesten von der Erde entfernte von Menschen gebaute Objekt — inzwischen mehr als 24 Milliarden Kilometer entfernt.",
        en: "Voyager 1, launched in 1977, is the most distant human-made object from Earth — now more than 24 billion kilometers away.",
      },
      {
        de: "2012 verließ die Sonde als erstes menschengemachtes Objekt die Heliosphäre und trat in den interstellaren Raum ein.",
        en: "In 2012, the probe became the first human-made object to leave the heliosphere and enter interstellar space.",
      },
      {
        de: "An Bord trägt sie die 'Golden Record' — eine vergoldete Schallplatte mit Klängen, Musik und Grüßen der Erde, für den unwahrscheinlichen Fall, dass sie eines Tages von einer außerirdischen Zivilisation gefunden wird.",
        en: "On board it carries the 'Golden Record' — a gold-plated phonograph record with sounds, music, and greetings from Earth, in case it is ever found by an extraterrestrial civilization.",
      },
    ],
    image: commonsFile("Pale_Blue_Dot.png"),
  },
  {
    label: { de: "James-Webb-Weltraumteleskop", en: "James Webb Space Telescope" },
    value: { de: "aktiv seit 2022", en: "active since 2022" },
    details: [
      {
        de: "Das James-Webb-Weltraumteleskop (JWST) ist das bisher leistungsfähigste Weltraumteleskop und beobachtet vor allem im Infrarotbereich — dadurch kann es durch Staubwolken hindurchblicken und extrem weit entfernte, junge Galaxien sichtbar machen.",
        en: "The James Webb Space Telescope (JWST) is the most powerful space telescope to date and observes primarily in infrared — letting it peer through dust clouds and reveal extremely distant, young galaxies.",
      },
      {
        de: "Es befindet sich rund 1,5 Millionen Kilometer von der Erde entfernt am Lagrange-Punkt L2, ständig von der Sonne abgeschirmt durch einen tennisplatzgroßen Sonnenschutz.",
        en: "It sits about 1.5 million kilometers from Earth at the L2 Lagrange point, permanently shielded from the Sun by a tennis-court-sized sunshield.",
      },
      {
        de: "Seit Beginn seiner wissenschaftlichen Beobachtungen 2022 hat es unter anderem Atmosphären von Exoplaneten untersucht und einige der ältesten bekannten Galaxien entdeckt.",
        en: "Since starting scientific observations in 2022, it has studied exoplanet atmospheres and discovered some of the oldest known galaxies, among other findings.",
      },
    ],
    image: commonsFile("James_Webb_Space_Telescope_2009_top.jpg"),
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
  const [showSolarSystem, setShowSolarSystem] = useState(false);
  const { t, lang } = useLanguage();

  return (
    <main className="relative min-h-screen">
      <SiteBackground />

      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-20 pt-10 sm:px-8 sm:pt-14">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="label-mono inline-flex w-fit items-center gap-2 text-xs uppercase text-muted transition-colors hover:text-accent"
          >
            ← {t("back")}
          </Link>
          <LanguageSwitcher />
        </div>

        <header className="mb-8 border-b border-border pb-6">
          <p className="label-mono text-xs uppercase text-muted">{t("universeLabel")}</p>
          <h1 className="font-display mt-2 text-2xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
            {t("universeTitle")}
          </h1>
          <p className="mt-3 max-w-2xl text-xs leading-relaxed text-muted sm:text-sm">
            {t("universeIntro")}
          </p>
        </header>

        {/* Nutzerwunsch 20.09.2026: "erstelle so ein box mit solarsystem
            oben. wenn ich auf dem box drücke dann soll was ähnliches
            kommen aber mit vollbildbfenster mit X button" — kleine
            animierte Vorschau, öffnet per Klick die interaktive
            Vollbild-Ansicht (SolarSystemModal). */}
        <button
          type="button"
          onClick={() => setShowSolarSystem(true)}
          className="group relative mb-10 h-64 w-full overflow-hidden border border-border bg-background text-left transition-colors hover:border-accent sm:h-80"
        >
          <SolarSystem mode="compact" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-4">
            <p className="label-mono text-xs uppercase text-accent">{t("solarSystemLabel")}</p>
            <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-foreground">
              {t("liveExplore")}
              <span className="transition-transform group-hover:translate-x-1">↗</span>
            </p>
          </div>
        </button>

        <div className="mb-10">
          <p className="label-mono text-xs uppercase">{t("universeInNumbers")}</p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {UNIVERSE_FACTS.map((fact, i) => {
            const value = localize(fact.value, lang);
            const label = localize(fact.label, lang);
            return (
              <RevealCard
                key={value + label}
                className="glass-card flex items-center gap-3 p-3"
                onClick={() => setSelectedFact(i)}
              >
                {(inView) => (
                  <>
                    <FactThumbnail src={fact.image} alt={label} />
                    <div className="min-w-0 flex-1">
                      <p className="font-display min-h-[1.3em] text-sm font-bold text-accent sm:text-base">
                        <Typewriter text={value} active={inView} speed={12} />
                      </p>
                      <p className="mt-1 min-h-[1.2em] text-[10px] uppercase leading-snug tracking-wide text-muted">
                        <Typewriter
                          text={label}
                          active={inView}
                          speed={10}
                          delay={value.length * 12 + 150}
                        />
                      </p>
                    </div>
                  </>
                )}
              </RevealCard>
            );
          })}
        </div>

        <SpaceNewsSection />

        {selectedFact !== null && (
          <DetailModal
            eyebrow={t("universeInNumbers")}
            title={localize(UNIVERSE_FACTS[selectedFact].label, lang)}
            meta={localize(UNIVERSE_FACTS[selectedFact].value, lang)}
            paragraphs={UNIVERSE_FACTS[selectedFact].details.map((d) => localize(d, lang))}
            imageUrl={UNIVERSE_FACTS[selectedFact].image}
            imageAlt={localize(UNIVERSE_FACTS[selectedFact].label, lang)}
            imageCredit="Bild: Wikimedia Commons"
            onClose={() => setSelectedFact(null)}
          />
        )}

        {showSolarSystem && (
          <SolarSystemModal onClose={() => setShowSolarSystem(false)} />
        )}
      </div>
    </main>
  );
}
