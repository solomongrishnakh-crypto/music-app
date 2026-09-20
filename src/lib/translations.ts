/**
 * Wörterbuch der wiederkehrenden UI-Textbausteine (Menüs, Buttons,
 * Überschriften, Hinweistexte, aria-labels). Lange, individuelle Inhalte
 * (Planetenbeschreibungen, Universum-Fakten, Imperien-/Songnamen) werden
 * bewusst NICHT hier übersetzt — siehe LanguageContext.tsx.
 */
export const TRANSLATIONS = {
  // Navbar
  navMusic: { de: "Musik", en: "Music" },
  navAiNews: { de: "AI News", en: "AI News" },
  navContacts: { de: "Kontakte", en: "Contact" },

  // Allgemein
  back: { de: "Zurück", en: "Back" },
  close: { de: "Schließen", en: "Close" },

  // Suche
  searchPlaceholder: { de: "Künstler, Songs oder Alben suchen …", en: "Search artists, songs or albums …" },
  searchAriaLabel: { de: "Musiksuche", en: "Music search" },

  // Player
  playerPlay: { de: "Abspielen", en: "Play" },
  playerPause: { de: "Pause", en: "Pause" },
  playerNext: { de: "Nächster Titel", en: "Next track" },
  playerPrevious: { de: "Vorheriger Titel", en: "Previous track" },

  // Universum-Seite
  universeLabel: { de: "// Universum", en: "// Universe" },
  universeTitle: { de: "Universum kennenlernen", en: "Explore the Universe" },
  universeInNumbers: { de: "// Universum in Zahlen", en: "// Universe in Numbers" },
  solarSystemLabel: { de: "// Sonnensystem", en: "// Solar System" },
  liveExplore: { de: "Live erkunden", en: "Explore live" },

  // Sonnensystem-Modal
  solarSystemTapHint: { de: "Planet tippen für Details", en: "Tap a planet for details" },
  solarSystemDragHint: {
    de: "Ziehen: drehen & neigen · Scrollen: zoomen",
    en: "Drag: rotate & tilt · Scroll: zoom",
  },
  kindStar: { de: "Stern", en: "Star" },
  kindDwarf: { de: "Zwergplanet", en: "Dwarf planet" },
  kindProbe: { de: "Raumsonde", en: "Probe" },
  kindPlanet: { de: "Planet", en: "Planet" },
  distanceToSun: { de: "Abstand zur Sonne", en: "Distance from Sun" },
  orbitalPeriod: { de: "Umlaufzeit", en: "Orbital period" },
  diameter: { de: "Durchmesser", en: "Diameter" },
  moons: { de: "Monde", en: "Moons" },
  closeInfo: { de: "Info schließen", en: "Close info" },

  // Imperien-Karte
  empiresBack: { de: "Zurück", en: "Back" },
  empiresPlay: { de: "Durch die Jahre abspielen", en: "Play through the years" },
  empiresPause: { de: "Pause", en: "Pause" },
  empiresJumpStart: { de: "Zum Anfang springen", en: "Jump to start" },
  empiresJumpEnd: { de: "Zum Ende springen", en: "Jump to end" },
  empiresSpeed: { de: "Abspielgeschwindigkeit ändern", en: "Change playback speed" },
  empiresYearInput: { de: "Jahr eingeben", en: "Enter year" },
  empiresYearSelect: { de: "Jahr auswählen", en: "Select year" },
  navEmpiresLabel: { de: "Große Imperien", en: "Great Empires" },
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS;
