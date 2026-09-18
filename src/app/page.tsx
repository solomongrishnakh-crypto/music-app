"use client";

import { useEffect, useRef, useState } from "react";
import SiteBackground from "@/components/particles/SiteBackground";
import SearchBar from "@/components/search/SearchBar";
import SearchResults from "@/components/search/SearchResults";
import CompactSongList from "@/components/search/CompactSongList";
import FavoritesModal from "@/components/search/FavoritesModal";
import YoutubePlayer from "@/components/player/YoutubePlayer";
import NowPlayingHero from "@/components/player/NowPlayingHero";
import FeaturesSection from "@/components/home/FeaturesSection";
import FactsSection from "@/components/home/FactsSection";
import SpaceNewsSection from "@/components/home/SpaceNewsSection";
import ConsciousnessSection from "@/components/home/ConsciousnessSection";
import ContactSection from "@/components/home/ContactSection";
import TypedWordmark from "@/components/ui/TypedWordmark";
import { Song } from "@/types/music";
import {
  addToRecentlyPlayed,
  loadRecentlyPlayed,
} from "@/lib/history/recentlyPlayed";
import {
  isFavorite as checkIsFavorite,
  loadFavorites,
  toggleFavorite,
} from "@/lib/history/favorites";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [showHero, setShowHero] = useState(false);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [favorites, setFavorites] = useState<Song[]>([]);
  const [shuffleFavorites, setShuffleFavorites] = useState(false);
  const [showAllFavorites, setShowAllFavorites] = useState(false);
  const requestIdRef = useRef(0);

  // Verlauf & gemerkte Songs beim ersten Laden aus dem Browser des Besuchers holen
  useEffect(() => {
    setRecentlyPlayed(loadRecentlyPlayed());
    setFavorites(loadFavorites());
  }, []);

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
    setCurrentSong(song);
    setShowHero(true);
    setShuffleFavorites(false);
    setRecentlyPlayed(addToRecentlyPlayed(song));
  }

  function pickRandomSong(list: Song[], excludeId?: string): Song | undefined {
    const pool = list.length > 1 ? list.filter((s) => s.id !== excludeId) : list;
    if (pool.length === 0) return undefined;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function handleShufflePlayFavorites() {
    const song = pickRandomSong(favorites);
    if (!song) return;
    setCurrentSong(song);
    setShowHero(true);
    setShuffleFavorites(true);
    setRecentlyPlayed(addToRecentlyPlayed(song));
  }

  function handleBackToHome() {
    setShowHero(false);
  }

  function handleClosePlayer() {
    setCurrentSong(null);
    setShowHero(false);
  }

  function handleToggleFavorite(song: Song) {
    setFavorites((prev) => toggleFavorite(prev, song));
  }

  function handleEnded() {
    if (!currentSong) return;

    // Im Zufalls-Modus (gemerkte Songs) geht es mit einem weiteren
    // zufälligen gemerkten Song weiter, statt der normalen Listenreihenfolge.
    if (shuffleFavorites) {
      const next = pickRandomSong(favorites, currentSong.id);
      if (next) {
        setCurrentSong(next);
        setRecentlyPlayed(addToRecentlyPlayed(next));
      }
      return;
    }

    // Sonst: nächsten Song aus der aktuellen Ergebnisliste spielen, falls vorhanden.
    const list = results.length > 0 ? results : recentlyPlayed;
    const idx = list.findIndex((s) => s.id === currentSong.id);
    const next = idx >= 0 ? list[idx + 1] : undefined;
    if (next) handlePlay(next);
  }

  const showFavorites = !query.trim() && favorites.length > 0;

  return (
    <main className="relative min-h-screen">
      <SiteBackground />

      {/* Ecken-UI im igloo.inc-Stil: schmale Wordmark oben links, kurzer
          Info-Block oben rechts, dezenter Hinweis unten links. */}
      <div className="pointer-events-none fixed inset-0 z-10 hidden select-none p-6 sm:block sm:p-8">
        <div className="pointer-events-auto absolute left-6 top-6 sm:left-8 sm:top-8">
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-foreground">
            <TypedWordmark speed={60} />
          </p>
        </div>
        <div className="pointer-events-auto absolute right-6 top-6 max-w-[220px] text-right text-xs leading-relaxed sm:right-8 sm:top-8">
          <p className="label-mono mb-1 uppercase">// Info</p>
          <p className="text-muted">
            Songs suchen und direkt im Browser hören. Kein Login, kein Abo.
          </p>
        </div>
        <div className="pointer-events-none absolute bottom-24 left-6 text-xs text-muted sm:bottom-8 sm:left-8">
          <p className="label-mono uppercase">// Copyright {new Date().getFullYear()}</p>
          <p>Centaurian.</p>
        </div>
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-28 pt-24 sm:px-8 sm:pt-32">
        {showHero && currentSong ? (
          <NowPlayingHero song={currentSong} onBack={handleBackToHome} />
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

        {showFavorites && (
          <div className="glass-card mx-auto mt-4 flex w-full max-w-2xl items-center justify-between gap-3 px-4 py-3">
            <p className="label-mono text-xs uppercase">
              // Gemerkte Musics <span className="ml-1">🔀</span>
              <span className="ml-2 text-muted">({favorites.length})</span>
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
            songs={favorites}
            title="// Gemerkt 🔀"
            onPlay={handlePlay}
            onToggleFavorite={handleToggleFavorite}
            activeSongId={currentSong?.id}
            limit={3}
            onShowMore={() => setShowAllFavorites(true)}
          />
        )}

        {showAllFavorites && (
          <FavoritesModal
            songs={favorites}
            activeSongId={currentSong?.id}
            onPlay={handlePlay}
            onShufflePlay={handleShufflePlayFavorites}
            onToggleFavorite={handleToggleFavorite}
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
            activeSongId={currentSong?.id}
            isFavorite={(songId) => checkIsFavorite(favorites, songId)}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {!query.trim() && !showHero && (
          <>
            <FeaturesSection />
            <FactsSection />
            <SpaceNewsSection />
            <ConsciousnessSection />
            <ContactSection />
          </>
        )}
      </div>

      <YoutubePlayer
        song={currentSong}
        onEnded={handleEnded}
        onClose={handleClosePlayer}
      />
    </main>
  );
}
