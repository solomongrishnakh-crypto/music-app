# Centaurian — Web-Musikplayer

Musik-Website mit React/Next.js: dunkles, futuristisches UI, animierter
Partikel-Hintergrund, Songsuche über die echte YouTube Data API, Wiedergabe
**direkt im Browser** über den offiziellen YouTube-Player, „zuletzt
gehört"-Verlauf wird im Browser des jeweiligen Besuchers gespeichert.

## Setup

```bash
npm install
cp .env.local.example .env.local
# YOUTUBE_API_KEY in .env.local eintragen (siehe unten)
npm run dev
```

Danach: `http://localhost:3000`

> Hinweis: In der Umgebung, in der dieses Gerüst erstellt wurde, war
> npm-Registry-Zugriff gesperrt. Die Dateien wurden von Hand geschrieben
> (entspricht `create-next-app --typescript --tailwind --app --src-dir`).
> `npm install` bei dir lokal sollte normal funktionieren.

## Kostenlosen YouTube Data API Key erstellen

1. https://console.cloud.google.com öffnen, Projekt anlegen (kostenlos).
2. „APIs & Dienste" → „Bibliothek" → „YouTube Data API v3" suchen und aktivieren.
3. „Anmeldedaten" → „Anmeldedaten erstellen" → „API-Schlüssel".
4. Den erzeugten Key in `.env.local` als `YOUTUBE_API_KEY` eintragen.
5. Empfehlung: den Key in der Cloud Console auf „HTTP-Referrer" oder
   „IP-Adressen" einschränken, sobald die Seite live ist.

Das kostenlose Standardkontingent (10.000 Einheiten/Tag) reicht für
moderaten Suchverkehr; eine Suche kostet ca. 100 Einheiten.

## Wie die Wiedergabe funktioniert

- **Suche:** Der Browser ruft `/api/search?q=...` auf (eigene Next.js
  API-Route). Diese Route ruft serverseitig die YouTube Data API auf — der
  API-Key steht nur in der Server-Umgebungsvariable und wird nie an den
  Browser ausgeliefert.
- **Wiedergabe:** Klick auf einen Song lädt ihn in den offiziellen
  **YouTube-IFrame-Player** (`src/components/player/YoutubePlayer.tsx`).
  Der Ton läuft über YouTubes eigenen, echten Player — die Website
  extrahiert oder speichert nie einen eigenen Audio-Stream.
- **Werbung:** YouTube entscheidet pro Video, ob Werbung eingeblendet wird.
  Das lässt sich von der Website aus nicht beeinflussen oder entfernen.
- **Verlauf:** `src/lib/history/recentlyPlayed.ts` speichert die zuletzt
  gespielten Songs im `localStorage` des Besuchers. Kein Login, kein
  Server-Speicher nötig — beim nächsten Besuch im selben Browser ist der
  Verlauf wieder da (bis zu 20 Einträge).

## Struktur

```
src/
  app/
    api/search/route.ts        Server-Route: ruft YouTube Data API auf (Key bleibt geheim)
    layout.tsx                  Root-Layout, dunkles Theme
    page.tsx                     Startseite: Suche, Ergebnisse, Verlauf, Player-Bar
    globals.css                  Tailwind + Theme-Utilities
  components/
    particles/ParticleBackground.tsx   Canvas-2D-Partikelsystem (ständig animiert)
    search/
      SearchBar.tsx               Große Suchleiste
      SearchResults.tsx           Ergebnis-Grid (Suche + „Zuletzt gehört")
      SongCard.tsx                 Einzelne Karte (Cover/Titel/Künstler)
    player/YoutubePlayer.tsx       Player-Bar unten, steuert YouTube-IFrame-Player
  lib/
    youtube/search.ts              YouTube-Data-API-Anbindung (nur serverseitig genutzt)
    history/recentlyPlayed.ts     „Zuletzt gehört"-Speicherung (localStorage)
    audio/useAudioReactivity.ts   Hook-Schnittstelle für künftige Partikel-Musikreaktivität
  types/music.ts                   Song-Datentyp
```

## Rechtlicher Hintergrund (wichtig)

Diese Version spielt Musik für **beliebige Besucher** direkt auf der
Website ab. Das geht nur legal über eine autorisierte Quelle — hier den
offiziellen, eingebetteten YouTube-Player. Es gibt bewusst **keine**
Anbindung an eine modifizierte/ReVanced-App oder sonstige
Stream-Extraktion: Das wäre unlizenzierte Wiedergabe fremder,
urheberrechtlich geschützter Musik und damit nicht zulässig, egal wie die
Web-App das technisch verstecken würde.

## Offene Erweiterungspunkte

- **Musikreaktive Partikel:** `useAudioReactivity()` liefert aktuell einen
  simulierten Pegel. Eine echte Kopplung an den YouTube-Player ist möglich
  (z. B. über Web Audio API auf das `<video>`-Element im IFrame, sofern
  YouTube das zulässt) — noch nicht umgesetzt.
- **Eigener Server-Verlauf statt nur localStorage:** Für einen Verlauf, der
  geräteübergreifend erhalten bleibt, wäre ein Login + Datenbank nötig.
