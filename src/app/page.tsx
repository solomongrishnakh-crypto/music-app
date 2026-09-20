"use client";

import { useEffect, useRef, useState } from "react";
import SiteBackground from "@/components/particles/SiteBackground";
import SearchBar from "@/components/search/SearchBar";
import SearchResults from "@/components/search/SearchResults";
import CompactSongList from "@/components/search/CompactSongList";
import FavoritesModal from "@/components/search/FavoritesModal";
import NowPlayingHero from "@/components/player/NowPlayingHero";
import FeaturesSection from "@/components/home/FeaturesSection";
import FactsSection from "@/components/home/FactsSection";
import AiNewsSection from "@/components/home/AiNewsSection";
import ContactSection from "@/components/home/ContactSection";
import AboutSiteSection from "@/components/home/AboutSiteSection";
import TypedWordmark from "@/components/ui/TypedWordmark";
import { Song } from "@/types/music";
import { usePlayer } from "@/contexts/PlayerContext";

/**
 * Der eigentliche Wiedergabe-Zustand (aktueller Song, Verlauf, Favoriten,
 * Play/Pause) lebt seit 18.09.2026 im globalen PlayerContext im Root-Layout,
 * nicht mehr hier — dadurch spielt Musik über Seitenwechsel hinweg einfach
 * weiter, statt beim Verlassen der Startseite abzubrechen. Diese Seite
 * kümmert sich nur noch um Suche + die eigene "Now Playing"-Ansicht.
 */
export default function Home() {
  const player = usePlayer();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHero, setShowHero] = useState(false);
  const [showAllFavorites, setShowAllFavorites] = useState(false);
  const requestIdRef = useRef(0);

  // Aktuelle Suchergebnisse laufend als "Weiter"-Warteschlange im globalen
  // Player hinterlegen, damit der Nächster-Button dieselbe Reihenfolge nutzt
  // wie vorher.
  useEffect(() => {
    if (results.length > 0) player.setQueue(results);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  // Meldet an den globalen PlayerContext, ob gerade die große Now-Playing-
  // Ansicht offen ist — dort zeigt die untere Leiste dann keine eigene
  // Bedienoberfläche mehr, weil dieselben Play/Pause/Seek-Regler jetzt
  // direkt in NowPlayingHero sitzen (Nutzerwunsch 19.09.2026).
  useEffect(() => {
    player.setHeroActive(showHero);
    return () => player.setHeroActive(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showHero]);

  async function handleSearch(q: string) {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      setErrorMessage(null);
      return;
    }

    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();

      // Veraltete Antworten ignorieren, falls der Nutzer schnell weitergetippt hat
      if (requestId !== requestIdRef.current) return;

      if (!res.ok) {
        setErrorMessage(data.error ?? "Suche fehlgeschlagen.");
        setResults([]);
      } else {
        setResults(data.songs ?? []);
      }
    } catch {
      if (requestId !== requestIdRef.current) return;
      setErrorMessage("Suche fehlgeschlagen. Bitte Internetverbindung prüfen.");
      setResults([]);
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  }

  function handlePlay(song: Song) {
    player.play(song, results.length > 0 ? results : undefined);
    setShowHero(true);
  }

  function handleShufflePlayFavorites() {
    player.playRandomFavorite();
    setShowHero(true);
  }

  function handleBackToHome() {
    setShowHero(false);
  }

  const showFavorites = !query.trim() && player.favorites.length > 0;

  return (
    <main className="relative min-h-screen">
      <SiteBackground />

      {/* Ecken-UI im igloo.inc-Stil: kurzer Info-Block oben rechts, dezenter
          Hinweis unten links. Die Wordmark oben links und die Menüleiste
          (Musik/AI News/Kontakte) wurden entfernt (Nutzerkorrektur
          18.09.2026: "diese centaurian text oben link und diese ganz
          obere leiste entfernen"). */}
      <div className="pointer-events-none fixed inset-0 z-10 hidden select-none p-6 sm:block sm:p-8">
        <div className="pointer-events-auto absolute right-6 top-6 max-w-[220px] text-right text-xs leading-relaxed sm:right-8 sm:top-8">
          <p className="label-mono mb-1 uppercase">// Info</p>
          <p className="text-muted">
            Musik, KI-News und mehr — alles auf einer Seite. Kein Login,
            kein Abo.
          </p>
        </div>
        <div className="pointer-events-none absolute bottom-24 left-6 max-w-[220px] text-xs text-muted sm:bottom-8 sm:left-8">
          <p className="label-mono uppercase">// Copyright {new Date().getFullYear()}</p>
          <p>Centaurian.</p>
        </div>
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-20 pt-24 sm:px-8 sm:pt-32">
        <div id="musik" className="scroll-mt-24" />

        {showHero && player.currentSong ? (
          <NowPlayingHero
            song={player.currentSong}
            onBack={handleBackToHome}
            isPlaying={player.isPlaying}
            onNext={player.next}
            onPrevious={player.previous}
            hasPrevious={player.hasPrevious}
            currentTime={player.currentTime}
            duration={player.duration}
            onTogglePlay={player.togglePlayback}
            onSeek={player.seekTo}
          />
        ) : (
          <header className="mb-10 text-center sm:mb-14">
            <h1 className="text-4xl font-bold uppercase tracking-tight sm:text-6xl">
              <TypedWordmark speed={90} />
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-xs text-muted sm:text-sm">
              // Song suchen und direkt hier abspielen.
            </p>
          </header>
        )}

        <div className="mx-auto w-full max-w-2xl">
          <SearchBar onSearch={handleSearch} />
        </div>

        {!showHero && (
          <div className="mx-auto mt-3 max-w-2xl space-y-1 text-center text-[11px] leading-relaxed text-muted">
            {/* Nutzerwunsch 19.09.2026: Hinweis muss auch auf dem Handy
                sichtbar sein, nicht nur in der Desktop-Ecken-UI. */}
            <p>
              Hinweis: Gemerkte Songs werden lokal in diesem Browser
              gespeichert — im privaten/Inkognito-Fenster gehen sie beim
              Schließen verloren.
            </p>
            {/* Nutzerwunsch 19.09.2026: "füge info das manche browser
                hintgrundabspiel blockiert" — manche Browser (v.a. iOS
                Safari) pausieren die Wiedergabe, sobald man die App
                verlässt/das Handy sperrt. */}
            <p>
              Manche Browser (z.B. Safari auf dem iPhone) pausieren die
              Wiedergabe im Hintergrund, wenn die Seite verlassen oder das
              Gerät gesperrt wird.
            </p>
          </div>
        )}

        {showFavorites && (
          <div className="glass-card mx-auto mt-4 flex w-full max-w-2xl items-center justify-between gap-3 px-4 py-3">
            <p className="label-mono text-xs uppercase">
              // Gemerkte Musics <span className="ml-1">🔀</span>
              <span className="ml-2 text-muted">({player.favorites.length})</span>
            </p>
            <button
              onClick={handleShufflePlayFavorites}
              className="flex shrink-0 items-center gap-1.5 border border-border px-3 py-1.5 text-[11px] uppercase tracking-wide text-foreground transition-colors hover:border-accent hover:text-accent"
              aria-label="Gemerkte Musics zufällig abspielen"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
              </svg>
              Zufällig abspielen
            </button>
          </div>
        )}

        {showFavorites && (
          <CompactSongList
            songs={player.favorites}
            title="// Gemerkt 🔀"
            onPlay={handlePlay}
            onToggleFavorite={player.toggleFavorite}
            activeSongId={player.currentSong?.id}
            limit={3}
            onShowMore={() => setShowAllFavorites(true)}
          />
        )}

        {showAllFavorites && (
          <FavoritesModal
            songs={player.favorites}
            activeSongId={player.currentSong?.id}
            onPlay={handlePlay}
            onShufflePlay={handleShufflePlayFavorites}
            onToggleFavorite={player.toggleFavorite}
            onClose={() => setShowAllFavorites(false)}
          />
        )}

        {query.trim() && (
          <SearchResults
            songs={results}
            query={query}
            isLoading={isLoading}
            errorMessage={errorMessage}
            onPlay={handlePlay}
            activeSongId={player.currentSong?.id}
            isFavorite={player.isFavorite}
            onToggleFavorite={player.toggleFavorite}
          />
        )}

        {!query.trim() && !showHero && (
          <>
            <FeaturesSection />
            <FactsSection />
            <AiNewsSection />
            <AboutSiteSection />
            <div id="kontakte" className="scroll-mt-24">
              <ContactSection />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
