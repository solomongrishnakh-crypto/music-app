/**
 * Themenseiten zu den Botschaften der Raumsonden (Deutsch und Englisch):
 * Goldene Schallplatte der Voyager-Sonden und Pioneer-Plakette.
 */
export type TopicLang = "de" | "en";
export interface Topic {
  id: "golden-record" | "pioneer-plaque";
  path: string; // deutscher Pfad
  images: { f: string; c: Record<TopicLang, string> }[];
  probes: string[]; // IDs der Himmelsposition-Seiten
  de: TopicText;
  en: TopicText;
}
export interface TopicText {
  title: string;
  h1: string;
  desc: string;
  lead: string;
  sections: { h: string; p: string[] }[];
  facts: [string, string][];
}

export const TOPICS: Topic[] = [
  {
    id: "golden-record",
    path: "/goldene-schallplatte",
    probes: ["voyager1", "voyager2"],
    images: [
      { f: "The Sounds of Earth Record Cover - GPN-2000-001978.jpg", c: { de: "Hülle der Goldenen Schallplatte mit Abspielanleitung (NASA)", en: "Cover of the Golden Record with playing instructions (NASA)" } },
      { f: "Record is attached to Voyager 1.jpg", c: { de: "Die Schallplatte an Bord von Voyager 1 (NASA)", en: "The record mounted on Voyager 1 (NASA)" } },
    ],
    de: {
      title: "Goldene Schallplatte der Voyager-Sonden: Inhalt, Musik, Bilder & Grüße",
      h1: "Die Goldene Schallplatte der Voyager-Sonden",
      desc: "Was ist auf der Goldenen Schallplatte von Voyager 1 und 2? 115 Bilder, Grüße in 55 Sprachen, 90 Minuten Musik und Klänge der Erde – eine Botschaft an Außerirdische. Mit Position der Sonden.",
      lead: "An Bord von Voyager 1 und Voyager 2 ist je eine vergoldete Kupfer-Schallplatte befestigt, die „Golden Record“. Sie enthält Bilder, Töne und Musik von der Erde, als Botschaft an alle, die sie irgendwann finden, und die Sonden fliegen seit 1977 hinaus ins All.",
      sections: [
        {
          h: "Was ist auf der Goldenen Schallplatte?",
          p: [
            "115 Bilder, als analoge Signale gespeichert: Planeten des Sonnensystems, Landschaften, Tiere, Menschen bei der Arbeit, Essen, Architektur, dazu Diagramme zur Mathematik, Physik und zur Biologie des Menschen.",
            "Grüße in 55 Sprachen, vom 6.000 Jahre alten Sumerischen bis zum Chinesischen, dazu schriftliche Botschaften des US-Präsidenten Jimmy Carter und des UN-Generalsekretärs Kurt Waldheim.",
            "Rund 90 Minuten Musik aus aller Welt, 27 Stücke: unter anderem Bach, Beethoven, Mozart, Stravinsky, Louis Armstrong, Chuck Berry („Johnny B. Goode“), Blind Willie Johnson sowie Musik aus China, Indien, Peru, Japan und vielen weiteren Kulturen.",
            "Etwa 12 Minuten „Klänge der Erde“: Wind, Donner, Regen, Vögel, Wale, Herzschlag, Lachen, ein Kuss, ein Zug, eine Rakete. Auch aufgezeichnete Gehirnwellen und Herzschlag von Ann Druyan sind dabei.",
          ],
        },
        {
          h: "Wie spielt man die Platte ab?",
          p: [
            "Die Hülle aus Aluminium zeigt die Abspielanleitung in Symbolen: Eine Zeichnung erklärt, wie man Nadel und Platte benutzt, mit welcher Geschwindigkeit sie sich dreht (16⅔ Umdrehungen pro Minute) und wie die Bilder aus den Signalen zurückgewonnen werden. Eine Nadel und ein Tonabnehmer liegen bei.",
            "Auf der Hülle ist außerdem eine Pulsarkarte: 14 Pulsare zeigen, wo die Erde liegt. Ein Stück Uran-238 mit bekannter Halbwertszeit dient als „Uhr“, mit der man ausrechnen kann, wie viele Jahre seit dem Start vergangen sind.",
          ],
        },
        {
          h: "Wer hat sie gemacht?",
          p: [
            "Ein NASA-Komitee unter der Leitung des Astronomen Carl Sagan stellte den Inhalt zusammen, mit Timothy Ferris als Produzent und Ann Druyan, Jon Lomberg und Linda Salzman Sagan. Die Auswahl dauerte nur wenige Monate. Die Platte soll mehr als eine Milliarde Jahre halten.",
          ],
        },
        {
          h: "Wo sind die Sonden jetzt?",
          p: [
            "Voyager 1 ist seit 2012 im interstellaren Raum und das am weitesten entfernte von Menschen gebaute Objekt. In rund 40.000 Jahren fliegt sie in etwa 1,6 Lichtjahren Abstand an dem Stern Gliese 445 vorbei, Voyager 2 an Ross 248. Die aktuellen Positionen am Himmel findest du auf den Seiten unten.",
          ],
        },
      ],
      facts: [
        ["Start Voyager 1", "5. September 1977"],
        ["Start Voyager 2", "20. August 1977"],
        ["Material", "Kupfer, vergoldet, 30 cm"],
        ["Spieldauer Musik", "ca. 90 Minuten"],
        ["Bilder", "115"],
        ["Grüße", "55 Sprachen"],
      ],
    },
    en: {
      title: "Voyager Golden Record: contents, music, images & greetings",
      h1: "The Golden Record of the Voyager probes",
      desc: "What is on the Golden Record of Voyager 1 and 2? 115 images, greetings in 55 languages, 90 minutes of music and sounds of Earth – a message to extraterrestrials. With the probes' current positions.",
      lead: "Voyager 1 and Voyager 2 each carry a gold-plated copper phonograph record, the Golden Record. It holds pictures, sounds and music from Earth, a message for whoever may find it, and the probes have been heading out into space since 1977.",
      sections: [
        {
          h: "What is on the Golden Record?",
          p: [
            "115 images stored as analogue signals: planets of the Solar System, landscapes, animals, people at work, food, architecture, plus diagrams of mathematics, physics and human biology.",
            "Greetings in 55 languages, from 6,000-year-old Sumerian to Chinese, plus written messages from US President Jimmy Carter and UN Secretary-General Kurt Waldheim.",
            "About 90 minutes of music from around the world, 27 pieces, including Bach, Beethoven, Mozart, Stravinsky, Louis Armstrong, Chuck Berry (“Johnny B. Goode”), Blind Willie Johnson and music from China, India, Peru, Japan and many other cultures.",
            "About 12 minutes of “Sounds of Earth”: wind, thunder, rain, birds, whales, a heartbeat, laughter, a kiss, a train, a rocket. The recorded brain waves and heartbeat of Ann Druyan are also included.",
          ],
        },
        {
          h: "How do you play it?",
          p: [
            "The aluminium cover shows the playing instructions in symbols: a drawing explains how to use the stylus and record, the speed (16⅔ revolutions per minute) and how to turn the signals back into pictures. A cartridge and stylus are included.",
            "The cover also carries a pulsar map: 14 pulsars show where Earth is. A sample of uranium-238 with a known half-life works as a clock for working out how many years have passed since launch.",
          ],
        },
        {
          h: "Who made it?",
          p: [
            "A NASA committee chaired by astronomer Carl Sagan chose the content, with Timothy Ferris as producer and Ann Druyan, Jon Lomberg and Linda Salzman Sagan. The selection took only a few months. The record is expected to last more than a billion years.",
          ],
        },
        {
          h: "Where are the probes now?",
          p: [
            "Voyager 1 has been in interstellar space since 2012 and is the most distant human-made object. In about 40,000 years it will pass the star Gliese 445 at roughly 1.6 light-years, and Voyager 2 will pass Ross 248. You can find their current positions in the sky on the pages below.",
          ],
        },
      ],
      facts: [
        ["Voyager 1 launch", "September 5, 1977"],
        ["Voyager 2 launch", "August 20, 1977"],
        ["Material", "gold-plated copper, 30 cm"],
        ["Music length", "about 90 minutes"],
        ["Images", "115"],
        ["Greetings", "55 languages"],
      ],
    },
  },
  {
    id: "pioneer-plaque",
    path: "/pioneer-plakette",
    probes: ["pioneer10", "pioneer11"],
    images: [
      { f: "Pioneer10-plaque.jpg", c: { de: "Die Pioneer-Plakette (NASA)", en: "The Pioneer plaque (NASA)" } },
      { f: "Pioneer plaque mounted on the spacecraft.jpg", c: { de: "Die Plakette an der Antennenstrebe der Sonde (NASA)", en: "The plaque mounted on the probe's antenna strut (NASA)" } },
    ],
    de: {
      title: "Pioneer-Plakette: Bedeutung, Bild & Botschaft an Außerirdische",
      h1: "Die Pioneer-Plakette",
      desc: "Was zeigt die Pioneer-Plakette von Pioneer 10 und 11? Mann und Frau, Wasserstoff-Atom, Pulsarkarte und Sonnensystem – die erste Botschaft der Menschheit an Außerirdische. Mit Position der Sonden.",
      lead: "Pioneer 10 und Pioneer 11 tragen je eine 15 × 23 cm große, vergoldete Aluminiumplatte mit eingravierten Linien. Sie ist die erste von Menschen gebaute Botschaft, die ins All geschickt wurde – eine Zeichnung, kein Ton.",
      sections: [
        {
          h: "Was zeigt die Plakette?",
          p: [
            "Das Wasserstoff-Atom (oben links): zwei Atome beim „Umklappen“ des Elektronenspins. Dieser Übergang strahlt mit 21 cm Wellenlänge und dient als universelles Maß für Länge und Zeit.",
            "Mann und Frau in Originalgröße. Der Mann hebt die Hand zum Gruß. Dahinter ist die Sonde im Umriss, damit man die Körpergröße berechnen kann (die Frau ist 8 × 21 cm = 168 cm groß).",
            "Die Pulsarkarte (links): 14 Linien zeigen Richtung und Entfernung von der Sonne zu 14 Pulsaren. Die Zahlen sind binär und geben die Pulsperiode an. So lässt sich die Position der Sonne finden.",
            "Das Sonnensystem (unten): die Sonne und die Planeten mit relativer Entfernung, die Sonde mit Bahn, vorbei an Jupiter und hinaus aus dem Sonnensystem.",
          ],
        },
        {
          h: "Wer hat sie entworfen?",
          p: [
            "Carl Sagan und Frank Drake entwarfen die Plakette, die Zeichnung stammt von Linda Salzman Sagan. Sie entstand in nur etwa drei Wochen. Die nackten Figuren führten damals zu Kritik in der Presse.",
          ],
        },
        {
          h: "Unterschied zur Goldenen Schallplatte",
          p: [
            "Die Plakette ist ein Bild ohne Ton. Fünf Jahre später folgte die Goldene Schallplatte der Voyager-Sonden, die zusätzlich Musik, Grüße und 115 Bilder enthält.",
          ],
        },
        {
          h: "Wo sind die Sonden jetzt?",
          p: [
            "Pioneer 10 flog ab 1972 hinaus, Pioneer 11 ab 1973. Der Kontakt brach 2003 bzw. 1995 ab. Sie fliegen stumm weiter. Pioneer 10 in Richtung des Sterns Aldebaran, Pioneer 11 in Richtung des Sternbilds Adler. Die berechneten Positionen am Himmel findest du auf den Seiten unten.",
          ],
        },
      ],
      facts: [
        ["Start Pioneer 10", "2. März 1972"],
        ["Start Pioneer 11", "5. April 1973"],
        ["Größe", "15 × 23 cm"],
        ["Material", "vergoldetes Aluminium"],
        ["Pulsare", "14"],
        ["Entwurf", "Sagan, Drake, Salzman Sagan"],
      ],
    },
    en: {
      title: "Pioneer plaque: meaning, picture & message to extraterrestrials",
      h1: "The Pioneer plaque",
      desc: "What does the Pioneer plaque on Pioneer 10 and 11 show? Man and woman, hydrogen atom, pulsar map and the Solar System – humanity's first message to extraterrestrials. With the probes' positions.",
      lead: "Pioneer 10 and Pioneer 11 each carry a 15 × 23 cm gold-anodized aluminium plate with engraved lines. It is the first human-made message sent into space – a drawing, no sound.",
      sections: [
        {
          h: "What does the plaque show?",
          p: [
            "The hydrogen atom (top left): two atoms in the “spin-flip” transition. It radiates at 21 cm wavelength and serves as a universal unit of length and time.",
            "A man and a woman at true scale. The man raises a hand in greeting. The silhouette of the probe behind them lets anyone calculate their height (the woman is 8 × 21 cm = 168 cm).",
            "The pulsar map (left): 14 lines show direction and distance from the Sun to 14 pulsars. The numbers are binary and give each pulse period, which helps locate the Sun.",
            "The Solar System (bottom): the Sun and planets at relative distances, with the probe's path past Jupiter and out of the Solar System.",
          ],
        },
        {
          h: "Who designed it?",
          p: [
            "Carl Sagan and Frank Drake designed the plaque, and the artwork is by Linda Salzman Sagan. It was made in about three weeks. The nude figures drew criticism in the press at the time.",
          ],
        },
        {
          h: "How is it different from the Golden Record?",
          p: [
            "The plaque is a picture without sound. Five years later came the Voyager Golden Record, which also holds music, greetings and 115 images.",
          ],
        },
        {
          h: "Where are the probes now?",
          p: [
            "Pioneer 10 left in 1972 and Pioneer 11 in 1973. Contact was lost in 2003 and 1995. They keep flying silently: Pioneer 10 roughly toward the star Aldebaran, Pioneer 11 toward the constellation Aquila. Their calculated positions in the sky are on the pages below.",
          ],
        },
      ],
      facts: [
        ["Pioneer 10 launch", "March 2, 1972"],
        ["Pioneer 11 launch", "April 5, 1973"],
        ["Size", "15 × 23 cm"],
        ["Material", "gold-anodized aluminium"],
        ["Pulsars", "14"],
        ["Design", "Sagan, Drake, Salzman Sagan"],
      ],
    },
  },
];

export const findTopic = (id: string) => TOPICS.find((t) => t.id === id);
