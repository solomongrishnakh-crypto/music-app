/** Berühmte Objekte (aus public/sky-famous.js übernommen) für die eigenen Seiten /objekte/… */
export type FamousObject = {
  id: string; ra: number; dec: number; mag: number; ly: number; wiki: string; star: boolean;
  imgs: { f: string; c: string; a: boolean }[];
  de: FamousText; en: FamousText;
};
export type FamousText = { name: string; kind: string; rows: [string, string][]; text: string[] };

export const FAMOUS: FamousObject[] = [
 {
  "id": "sgra",
  "ra": 266.41683,
  "dec": -29.00781,
  "mag": 16,
  "ly": 26670,
  "wiki": "Sagittarius A*",
  "star": false,
  "imgs": [
   {
    "f": "Sag A*.jpg",
    "c": "Sagittarius A*, image by the Event Horizon Telescope, 2022",
    "a": false
   },
   {
    "f": "Galactic Center (Chandra, Hubble, Spitzer) (2021-053-01FJHQEC71T0CF7KTRGDYAKBYJ).png",
    "c": "Galactic Centre in X-ray, visible and infrared (NASA)",
    "a": false
   },
   {
    "f": "Flaring Disk Around Milky Way's Black Hole (Artist's Concept) (2025-110).png",
    "c": "Artist's concept (NASA)",
    "a": true
   }
  ],
  "de": {
   "name": "Sagittarius A*",
   "kind": "Schwarzes Loch · Zentrum der Milchstraße",
   "rows": [
    [
     "Entfernung",
     "≈ 26.700 Lichtjahre"
    ],
    [
     "Masse des Lochs",
     "≈ 4,3 Mio. Sonnenmassen"
    ],
    [
     "Ereignishorizont",
     "≈ 25 Mio. km Durchmesser"
    ],
    [
     "Sichtbar im",
     "Infrarot, Radio, Röntgen"
    ],
    [
     "Helligkeit",
     "im sichtbaren Licht verdeckt"
    ]
   ],
   "text": [
    "Sagittarius A* ist das supermassereiche Schwarze Loch im Zentrum unserer Milchstraße. Es hat etwa 4,3 Millionen Sonnenmassen und liegt rund 26.700 Lichtjahre von uns entfernt. Sein Ereignishorizont ist etwa 25 Millionen Kilometer groß, ungefähr 18 Sonnendurchmesser.",
    "Sterne wie S2 umkreisen es in nur etwa 16 Jahren. Die Vermessung dieser Bahnen brachte 2020 den Physik-Nobelpreis (Reinhard Genzel und Andrea Ghez, zusammen mit Roger Penrose).",
    "Im Mai 2022 veröffentlichte die Event-Horizon-Telescope-Kollaboration das erste Bild dieses Schwarzen Lochs. Es zeigt den leuchtenden Ring aus heißem Gas um den dunklen Schatten – das Loch selbst ist nicht zu sehen.",
    "Im sichtbaren Licht liegt das Zentrum der Milchstraße hinter dichten Staubwolken. Man beobachtet es im Infrarot, in Radiowellen und im Röntgenlicht. Am Himmel steht es im Sternbild Schütze."
   ]
  },
  "en": {
   "name": "Sagittarius A*",
   "kind": "Black hole · centre of the Milky Way",
   "rows": [
    [
     "Distance",
     "≈ 26,700 light-years"
    ],
    [
     "Hole mass",
     "≈ 4.3 million solar masses"
    ],
    [
     "Event horizon",
     "≈ 25 million km across"
    ],
    [
     "Visible in",
     "infrared, radio, X-ray"
    ],
    [
     "Brightness",
     "hidden in visible light"
    ]
   ],
   "text": [
    "Sagittarius A* is the supermassive black hole at the centre of our Milky Way. It has about 4.3 million solar masses and lies roughly 26,700 light-years away. Its event horizon is about 25 million kilometres across, around 18 Sun diameters.",
    "Stars such as S2 orbit it in only about 16 years. Measuring these orbits earned the 2020 Nobel Prize in Physics (Reinhard Genzel and Andrea Ghez, shared with Roger Penrose).",
    "In May 2022 the Event Horizon Telescope collaboration published the first image of this black hole. It shows the glowing ring of hot gas around the dark shadow – the hole itself cannot be seen.",
    "In visible light the Galactic Centre is hidden behind dense dust clouds. It is observed in infrared, radio waves and X-rays. In the sky it lies in the constellation Sagittarius."
   ]
  }
 },
 {
  "id": "ton618",
  "ra": 187.10404,
  "dec": 31.47714,
  "mag": 15.9,
  "ly": 10400000000,
  "wiki": "TON 618",
  "star": false,
  "imgs": [
   {
    "f": "TON 618 PanSTARRS DR1 color.png",
    "c": "TON 618 in a Pan-STARRS survey image: just a single point",
    "a": false
   },
   {
    "f": "Black hole (NASA).jpg",
    "c": "Artist's impression of a black hole with accretion disc",
    "a": true
   },
   {
    "f": "Artist’s impression of the record-breaking quasar J0529-4351 (eso2402a).jpg",
    "c": "Artist's impression of a quasar (ESO) – not TON 618 itself",
    "a": true
   },
   {
    "f": "Artist’s impression of the quasar 3C 279.jpg",
    "c": "Artist's impression of a quasar (ESO) – not TON 618 itself",
    "a": true
   }
  ],
  "de": {
   "name": "TON 618",
   "kind": "Quasar · Schwarzes Loch",
   "rows": [
    [
     "Entfernung (Lichtlaufzeit)",
     "≈ 10,4 Mrd. Lichtjahre"
    ],
    [
     "Rotverschiebung",
     "z ≈ 2,22"
    ],
    [
     "Masse des Schwarzen Lochs",
     "≈ 40–66 Mrd. Sonnenmassen"
    ],
    [
     "Horizont-Radius",
     "≈ 1.300 AE (Neptunbahn: 30 AE)"
    ],
    [
     "Leuchtkraft",
     "≈ 140 Billionen Sonnen"
    ],
    [
     "Helligkeit",
     "15,9 mag"
    ]
   ],
   "text": [
    "TON 618 ist ein extrem leuchtkräftiger Quasar im Sternbild Jagdhunde. Sein Licht war rund 10,4 Milliarden Jahre unterwegs – wir sehen ihn so, wie er aussah, als das Universum erst gut 3 Milliarden Jahre alt war.",
    "Im Zentrum sitzt eines der massereichsten bekannten Schwarzen Löcher: je nach Messung etwa 40 bis 66 Milliarden Sonnenmassen. Sein Ereignishorizont hätte einen Radius von rund 1.300 Astronomischen Einheiten. Das ist mehr als das Vierzigfache der Neptunbahn, unser ganzes Sonnensystem würde darin verschwinden.",
    "Ein Quasar ist der extrem helle Kern einer jungen Galaxie: Gas fällt auf das Schwarze Loch, bildet eine heiße Scheibe und strahlt dabei heller als hunderte Billionen Sonnen.",
    "Am Himmel ist TON 618 nur ein einzelner, schwacher Punkt (15,9 mag) und braucht ein großes Teleskop. Von der Scheibe oder dem Schwarzen Loch selbst gibt es kein Foto: Die Bilder in der Galerie sind Künstlerdarstellungen und zeigen nicht TON 618 selbst."
   ]
  },
  "en": {
   "name": "TON 618",
   "kind": "Quasar · black hole",
   "rows": [
    [
     "Distance (light travel)",
     "≈ 10.4 billion light-years"
    ],
    [
     "Redshift",
     "z ≈ 2.22"
    ],
    [
     "Black hole mass",
     "≈ 40–66 billion solar masses"
    ],
    [
     "Horizon radius",
     "≈ 1,300 AU (Neptune's orbit: 30 AU)"
    ],
    [
     "Luminosity",
     "≈ 140 trillion Suns"
    ],
    [
     "Brightness",
     "15.9 mag"
    ]
   ],
   "text": [
    "TON 618 is an extremely luminous quasar in the constellation Canes Venatici. Its light travelled for about 10.4 billion years – we see it as it was when the universe was a little over 3 billion years old.",
    "At its centre sits one of the most massive known black holes: roughly 40 to 66 billion solar masses depending on the measurement. Its event horizon would have a radius of about 1,300 astronomical units – over forty times Neptune's orbit, big enough to swallow our whole Solar System.",
    "A quasar is the extremely bright core of a young galaxy: gas falls onto the black hole, forms a hot disc and radiates more brightly than hundreds of trillions of Suns.",
    "In the sky TON 618 is just a single faint point (15.9 mag) and needs a large telescope. There is no photograph of the disc or the black hole itself: the pictures in the gallery are artist's impressions and do not show TON 618 itself."
   ]
  }
 },
 {
  "id": "uyscuti",
  "ra": 276.90208,
  "dec": -12.44111,
  "mag": 10.4,
  "ly": 9500,
  "wiki": "UY Scuti",
  "star": true,
  "imgs": [
   {
    "f": "UY Scuti PanSTARRS DR1.png",
    "c": "UY Scuti (Pan-STARRS)",
    "a": false
   },
   {
    "f": "Size Comparison of UY Scuti and VY Canis Majoris.jpg",
    "c": "Size comparison (illustration)",
    "a": true
   }
  ],
  "de": {
   "name": "UY Scuti",
   "kind": "Roter Überriese · veränderlicher Stern",
   "rows": [
    [
     "Entfernung",
     "≈ 9.500 Lichtjahre"
    ],
    [
     "Sternradius",
     "≈ 900–1.200 Sonnenradien (unsicher)"
    ],
    [
     "Oberflächentemp.",
     "≈ 3.100 °C"
    ],
    [
     "Sternmasse",
     "≈ 7–10 Sonnenmassen"
    ],
    [
     "Helligkeit",
     "veränderlich, ≈ 8–11 mag"
    ]
   ],
   "text": [
    "UY Scuti ist ein roter Überriese im Sternbild Schild, etwa 9.500 Lichtjahre entfernt. Sein Radius wird auf rund 900 bis 1.200 Sonnenradien geschätzt. An der Stelle der Sonne würde seine Oberfläche bis etwa zur Jupiterbahn reichen.",
    "Der Stern pulsiert und ändert dabei unregelmäßig seine Helligkeit. Die Größenangaben sind unsicher, weil die Entfernung und die Oberfläche eines so aufgeblähten, staubumhüllten Sterns schwer zu messen sind. UY Scuti galt lange als der größte bekannte Stern; heute gelten andere Kandidaten wie Stephenson 2-18 als größer.",
    "Trotz seines Durchmessers ist er nicht besonders massereich (etwa 7 bis 10 Sonnenmassen): Seine Hülle ist extrem dünn. Er wird in absehbarer astronomischer Zeit als Supernova enden."
   ]
  },
  "en": {
   "name": "UY Scuti",
   "kind": "Red supergiant · variable star",
   "rows": [
    [
     "Distance",
     "≈ 9,500 light-years"
    ],
    [
     "Star radius",
     "≈ 900–1,200 solar radii (uncertain)"
    ],
    [
     "Surface temp.",
     "≈ 3.100 °C"
    ],
    [
     "Star mass",
     "≈ 7–10 solar masses"
    ],
    [
     "Brightness",
     "variable, ≈ 8–11 mag"
    ]
   ],
   "text": [
    "UY Scuti is a red supergiant in the constellation Scutum, about 9,500 light-years away. Its radius is estimated at roughly 900 to 1,200 solar radii. Placed where the Sun is, its surface would reach about as far as Jupiter's orbit.",
    "The star pulsates and changes brightness irregularly. Size figures are uncertain because the distance and surface of such a bloated, dust-shrouded star are hard to measure. UY Scuti was long considered the largest known star; other candidates such as Stephenson 2-18 are now thought to be larger.",
    "Despite its diameter it is not especially massive (about 7 to 10 solar masses): its envelope is extremely thin. It will end as a supernova on astronomical timescales."
   ]
  }
 },
 {
  "id": "vycma",
  "ra": 110.74304,
  "dec": -25.76756,
  "mag": 7.9,
  "ly": 3900,
  "wiki": "VY Canis Majoris",
  "star": true,
  "imgs": [
   {
    "f": "Massive star VY Canis Majoris - polarized light (opo0703c).tiff",
    "c": "VY Canis Majoris in polarised light (Hubble)",
    "a": false
   },
   {
    "f": "VLT image of the surroundings of VY Canis Majoris seen with SPHERE.jpg",
    "c": "VY Canis Majoris (ESO, VLT/SPHERE)",
    "a": false
   }
  ],
  "de": {
   "name": "VY Canis Majoris",
   "kind": "Roter Hyperriese",
   "rows": [
    [
     "Entfernung",
     "≈ 3.900 Lichtjahre"
    ],
    [
     "Sternradius",
     "≈ 1.400 Sonnenradien"
    ],
    [
     "Sternmasse",
     "≈ 17 Sonnenmassen"
    ],
    [
     "Helligkeit",
     "veränderlich, ≈ 6,5–9,6 mag"
    ]
   ],
   "text": [
    "VY Canis Majoris ist ein roter Hyperriese im Sternbild Großer Hund, rund 3.900 Lichtjahre entfernt. Sein Radius beträgt etwa 1.400 Sonnenradien; in der Sonne säße seine Oberfläche weit hinter der Jupiterbahn.",
    "Der Stern verliert massiv Material und ist von einer großen, unregelmäßigen Wolke aus ausgestoßenem Gas und Staub umgeben. Hubble und das Very Large Telescope haben diese Hülle fotografiert (siehe Galerie).",
    "Er ist instabil und wird vermutlich als Supernova oder Hypernova enden."
   ]
  },
  "en": {
   "name": "VY Canis Majoris",
   "kind": "Red hypergiant",
   "rows": [
    [
     "Distance",
     "≈ 3,900 light-years"
    ],
    [
     "Star radius",
     "≈ 1,400 solar radii"
    ],
    [
     "Star mass",
     "≈ 17 solar masses"
    ],
    [
     "Brightness",
     "variable, ≈ 6.5–9.6 mag"
    ]
   ],
   "text": [
    "VY Canis Majoris is a red hypergiant in the constellation Canis Major, about 3,900 light-years away. Its radius is around 1,400 solar radii; placed in the Sun's position its surface would lie well beyond Jupiter's orbit.",
    "The star loses mass heavily and is surrounded by a large, irregular cloud of ejected gas and dust. Hubble and the Very Large Telescope have photographed this shell (see gallery).",
    "It is unstable and will probably end as a supernova or hypernova."
   ]
  }
 },
 {
  "id": "etacar",
  "ra": 161.26479,
  "dec": -59.68442,
  "mag": 4.3,
  "ly": 7500,
  "wiki": "Eta Carinae",
  "star": true,
  "imgs": [
   {
    "f": "Eta Carinae (HST).jpg",
    "c": "Eta Carinae and the Homunculus Nebula (Hubble)",
    "a": false
   },
   {
    "f": "Eta Carinae (1991-10-43).jpg",
    "c": "Eta Carinae (Hubble)",
    "a": false
   }
  ],
  "de": {
   "name": "Eta Carinae",
   "kind": "Massereiches Doppelsternsystem",
   "rows": [
    [
     "Entfernung",
     "≈ 7.500 Lichtjahre"
    ],
    [
     "Hauptstern",
     "≈ 100 Sonnenmassen"
    ],
    [
     "Umlaufzeit",
     "≈ 5,5 Jahre"
    ],
    [
     "Helligkeit",
     "≈ 4,3 mag"
    ]
   ],
   "text": [
    "Eta Carinae ist ein Doppelstern im Sternbild Kiel des Schiffs, etwa 7.500 Lichtjahre entfernt. Der Hauptstern hat rund 100 Sonnenmassen, ein heißerer Begleiter etwa 30. Beide umkreisen sich in rund 5,5 Jahren.",
    "In den 1840er-Jahren erlebte Eta Carinae einen gewaltigen Ausbruch (den „Großen Ausbruch“) und wurde zeitweise zum zweithellsten Stern am Himmel. Das ausgeschleuderte Material formt heute den Homunculus-Nebel, den Hubble detailliert fotografiert hat.",
    "Der Stern ist instabil und gilt als Kandidat für eine Supernova – wann, ist unklar."
   ]
  },
  "en": {
   "name": "Eta Carinae",
   "kind": "Massive binary star system",
   "rows": [
    [
     "Distance",
     "≈ 7,500 light-years"
    ],
    [
     "Primary star",
     "≈ 100 solar masses"
    ],
    [
     "Orbital period",
     "≈ 5.5 years"
    ],
    [
     "Brightness",
     "≈ 4.3 mag"
    ]
   ],
   "text": [
    "Eta Carinae is a double star in the constellation Carina, about 7,500 light-years away. The primary has roughly 100 solar masses, a hotter companion about 30. They orbit each other in about 5.5 years.",
    "In the 1840s Eta Carinae went through a huge outburst (the \"Great Eruption\") and briefly became the second-brightest star in the sky. The ejected material now forms the Homunculus Nebula, which Hubble has photographed in detail.",
    "The star is unstable and a supernova candidate – when, nobody knows."
   ]
  }
 },
 {
  "id": "r136a1",
  "ra": 84.67667,
  "dec": -69.10083,
  "mag": 12.2,
  "ly": 163000,
  "wiki": "R136a1",
  "star": true,
  "imgs": [
   {
    "f": "Grand star-forming region R136 in NGC 2070 (captured by the Hubble Space Telescope).jpg",
    "c": "R136 in the Tarantula Nebula (Hubble)",
    "a": false
   },
   {
    "f": "Star Cluster R136 - Hubble.jpg",
    "c": "Star cluster R136 (Hubble)",
    "a": false
   }
  ],
  "de": {
   "name": "R136a1",
   "kind": "Einer der massereichsten bekannten Sterne",
   "rows": [
    [
     "Entfernung",
     "≈ 163.000 Lichtjahre"
    ],
    [
     "Masse (heute)",
     "≈ 200 Sonnenmassen"
    ],
    [
     "Leuchtkraft",
     "mehrere Mio. Sonnen"
    ],
    [
     "Oberflächentemp.",
     "≈ 46.000 K"
    ]
   ],
   "text": [
    "R136a1 ist ein Stern im Sternhaufen R136 im Tarantelnebel der Großen Magellanschen Wolke, rund 163.000 Lichtjahre entfernt. Er gehört zu den massereichsten und leuchtstärksten bekannten Sternen.",
    "Seine heutige Masse liegt bei etwa 200 Sonnenmassen, bei der Geburt waren es wohl über 250. Er strahlt mit mehreren Millionen Sonnenleuchtkräften bei rund 46.000 Kelvin Oberflächentemperatur und ist ein Wolf-Rayet-Stern, der seine Hülle als starken Sternwind abstößt.",
    "Seine Lebensdauer ist mit wenigen Millionen Jahren winzig verglichen mit den rund 10 Milliarden Jahren der Sonne."
   ]
  },
  "en": {
   "name": "R136a1",
   "kind": "One of the most massive known stars",
   "rows": [
    [
     "Distance",
     "≈ 163,000 light-years"
    ],
    [
     "Mass (today)",
     "≈ 200 solar masses"
    ],
    [
     "Luminosity",
     "several million Suns"
    ],
    [
     "Surface temp.",
     "≈ 46.000 K"
    ]
   ],
   "text": [
    "R136a1 is a star in the cluster R136 inside the Tarantula Nebula of the Large Magellanic Cloud, about 163,000 light-years away. It is among the most massive and luminous stars known.",
    "Its present mass is about 200 solar masses, and at birth it was probably over 250. It shines with several million solar luminosities at a surface temperature of around 46,000 kelvin and is a Wolf–Rayet star blowing off its envelope in a strong stellar wind.",
    "Its lifetime of a few million years is tiny compared with the Sun's roughly 10 billion."
   ]
  }
 },
 {
  "id": "cygx1",
  "ra": 299.59032,
  "dec": 35.20161,
  "mag": 8.9,
  "ly": 7200,
  "wiki": "Cygnus X-1",
  "star": true,
  "imgs": [
   {
    "f": "Artist's impression of Cygnus X-1.jpg",
    "c": "Artist's impression of Cygnus X-1",
    "a": true
   }
  ],
  "de": {
   "name": "Cygnus X-1",
   "kind": "Schwarzes Loch · Röntgenquelle",
   "rows": [
    [
     "Entfernung",
     "≈ 7.200 Lichtjahre"
    ],
    [
     "Masse des Lochs",
     "≈ 21 Sonnenmassen"
    ],
    [
     "Begleiter",
     "HDE 226868 (8,9 mag)"
    ],
    [
     "Umlaufzeit",
     "≈ 5,6 Tage"
    ]
   ],
   "text": [
    "Cygnus X-1 ist eine starke Röntgenquelle im Sternbild Schwan und eines der ersten Objekte, die als Schwarzes Loch erkannt wurden. Es hat rund 21 Sonnenmassen und ist etwa 7.200 Lichtjahre entfernt.",
    "Das Schwarze Loch umkreist den blauen Überriesen HDE 226868 in 5,6 Tagen und zieht Gas von ihm ab. Dieses Gas heizt sich vor dem Sturz stark auf und sendet Röntgenstrahlung aus. Sichtbar im Fernglas ist nur der Begleitstern.",
    "1974 wetteten die Physiker Stephen Hawking und Kip Thorne darum, ob Cygnus X-1 ein Schwarzes Loch ist. Hawking wettete dagegen und gestand die Wette 1990 ein."
   ]
  },
  "en": {
   "name": "Cygnus X-1",
   "kind": "Black hole · X-ray source",
   "rows": [
    [
     "Distance",
     "≈ 7,200 light-years"
    ],
    [
     "Hole mass",
     "≈ 21 solar masses"
    ],
    [
     "Companion",
     "HDE 226868 (8.9 mag)"
    ],
    [
     "Orbital period",
     "≈ 5.6 days"
    ]
   ],
   "text": [
    "Cygnus X-1 is a strong X-ray source in the constellation Cygnus and one of the first objects recognised as a black hole. It has about 21 solar masses and lies roughly 7,200 light-years away.",
    "The black hole orbits the blue supergiant HDE 226868 every 5.6 days and pulls gas from it. This gas heats up strongly before falling in and emits X-rays. Only the companion star is visible in binoculars.",
    "In 1974 the physicists Stephen Hawking and Kip Thorne made a bet on whether Cygnus X-1 is a black hole. Hawking bet against it and conceded in 1990."
   ]
  }
 },
 {
  "id": "proxima",
  "ra": 217.42894,
  "dec": -62.67949,
  "mag": 11.1,
  "ly": 4.24,
  "wiki": "Proxima Centauri",
  "star": true,
  "imgs": [
   {
    "f": "New shot of Proxima Centauri, our nearest neighbour.jpg",
    "c": "Proxima Centauri (Hubble)",
    "a": false
   },
   {
    "f": "Proxima Centauri b.jpg",
    "c": "Artist's impression of the planet Proxima b",
    "a": true
   }
  ],
  "de": {
   "name": "Proxima Centauri",
   "kind": "Roter Zwerg · nächster Stern",
   "rows": [
    [
     "Entfernung",
     "4,24 Lichtjahre"
    ],
    [
     "Sternmasse",
     "≈ 0,12 Sonnenmassen"
    ],
    [
     "Helligkeit",
     "11,1 mag"
    ],
    [
     "Planeten",
     "Proxima b, Proxima d"
    ]
   ],
   "text": [
    "Proxima Centauri ist der der Sonne nächste bekannte Stern, nur 4,24 Lichtjahre entfernt. Er ist ein kleiner, kühler roter Zwerg mit etwa 12 % der Sonnenmasse und für das bloße Auge viel zu lichtschwach (11,1 mag).",
    "Er gehört zum Alpha-Centauri-System und umkreist die beiden hellen Sterne Alpha Centauri A und B in einer sehr weiten Bahn.",
    "Um Proxima Centauri kreisen mindestens zwei Planeten: Proxima b liegt in der habitablen Zone, wird aber von heftigen Flares des Sterns getroffen. Ob es dort Wasser oder Leben gibt, ist unbekannt."
   ]
  },
  "en": {
   "name": "Proxima Centauri",
   "kind": "Red dwarf · nearest star",
   "rows": [
    [
     "Distance",
     "4.24 light-years"
    ],
    [
     "Star mass",
     "≈ 0.12 solar masses"
    ],
    [
     "Brightness",
     "11.1 mag"
    ],
    [
     "Planets",
     "Proxima b, Proxima d"
    ]
   ],
   "text": [
    "Proxima Centauri is the nearest known star to the Sun, only 4.24 light-years away. It is a small, cool red dwarf with about 12 % of the Sun's mass and far too faint for the naked eye (11.1 mag).",
    "It belongs to the Alpha Centauri system and orbits the two bright stars Alpha Centauri A and B on a very wide path.",
    "At least two planets orbit Proxima Centauri: Proxima b lies in the habitable zone but is hit by violent flares from its star. Whether it has water or life is unknown."
   ]
  }
 }
];
