"use client";

import { useEffect, useRef, useState } from "react";
import TunnelBackground from "@/components/particles/TunnelBackground";
import SearchBar from "@/components/search/SearchBar";
import SearchResults from "@/components/search/SearchResults";
import CompactSongList from "@/components/search/CompactSongList";
import FavoritesModal from "@/components/search/FavoritesModal";
import NowPlayingHero from "@/components/player/NowPlayingHero";
import FeaturesSection from "@/components/home/FeaturesSection";
import CosmosResults from "@/components/search/CosmosResults";
import { searchCosmos, type CosmosHit } from "@/lib/cosmosSearch";
import { homeText } from "@/lib/homeText";
import ContactSection from "@/components/home/ContactSection";
import AboutSiteSection from "@/components/home/AboutSiteSection";
import TypedWordmark from "@/components/ui/TypedWordmark";
import InfoHint from "@/components/ui/InfoHint";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { Song } from "@/types/music";
import { usePlayer } from "@/contexts/PlayerContext";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Der eigentliche Wiedergabe-Zustand (aktueller Song, Verlauf, Favoriten,
 * Play/Pause) lebt seit 18.09.2026 im globalen PlayerContext im Root-Layout,
 * nicht mehr hier — dadurch spielt Musik über Seitenwechsel hinweg einfach
 * weiter, statt beim Verlassen der Startseite abzubrechen. Diese Seite
 * kümmert sich nur noch um Suche + die eigene "Now Playing"-Ansicht.
 */
export default function Home() {
  const player = usePlayer();
  const { t, lang } = useLanguage();
  const ht = homeText(lang);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cosmos, setCosmos] = useState<CosmosHit[]>([]);
  const [musicAsked, setMusicAsked] = useState(false);
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

  // Nutzerwunsch 18.10.2026: Beim Antippen eines Songs bleibt das Now-Playing-
  // Fenster oben im Blick (die Seite springt nach oben), und ein Tipp auf die
  // untere Player-Leiste öffnet es wieder.
  function scrollToTop() {
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 60);
  }

  useEffect(() => {
    if (player.heroRequested && player.currentSong) {
      setShowHero(true);
      player.clearHeroRequest();
      scrollToTop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.heroRequested, player.currentSong]);

  // Suche: zuerst Planeten, Sterne, Sternbilder und Imperien (sofort, lokal).
  // Musik wird nur gesucht, wenn nichts Kosmisches passt oder der Nutzer den
  // kleinen "Auch nach Musik suchen"-Knopf drückt (Nutzerwunsch 14.10.2026:
  // Musik nur noch ein kleiner Teil).
  async function fetchSongs(q: string, requestId: number) {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();

      // Veraltete Antworten ignorieren, falls der Nutzer schnell weitergetippt hat
      if (requestId !== requestIdRef.current) return;

      if (!res.ok) {
        setErrorMessage(data.error ?? t("searchFailed"));
        setResults([]);
      } else {
        setResults(data.songs ?? []);
      }
    } catch {
      if (requestId !== requestIdRef.current) return;
      setErrorMessage(t("searchFailedConn"));
      setResults([]);
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  }

  async function handleSearch(q: string) {
    setQuery(q);
    setMusicAsked(false);
    if (!q.trim()) {
      requestIdRef.current++;
      setResults([]);
      setCosmos([]);
      setErrorMessage(null);
      setIsLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    let hits: CosmosHit[] = [];
    try {
      hits = await searchCosmos(q, lang);
    } catch {
      hits = [];
    }
    if (requestId !== requestIdRef.current) return;
    setCosmos(hits);
    if (hits.length === 0) {
      await fetchSongs(q, requestId);
    } else {
      setResults([]);
      setErrorMessage(null);
      setIsLoading(false);
    }
  }

  function handleAskMusic() {
    setMusicAsked(true);
    fetchSongs(query, ++requestIdRef.current);
  }

  function handlePlay(song: Song) {
    player.play(song, results.length > 0 ? results : undefined);
    setShowHero(true);
    scrollToTop();
  }

  function handleShufflePlayFavorites() {
    player.playRandomFavorite();
    setShowHero(true);
    scrollToTop();
  }

  function handleBackToHome() {
    setShowHero(false);
  }

  const showFavorites = !query.trim() && player.favorites.length > 0;

  return (
    <main className="relative min-h-screen">
      <div className="fixed inset-x-0 top-0 -z-10 h-[100lvh] overflow-hidden bg-background"><TunnelBackground /></div>

      {/* Ecken-UI im igloo.inc-Stil: kurzer Info-Block oben rechts, dezenter
          Hinweis unten links. Die Wordmark oben links und die Menüleiste
          (Musik/AI News/Kontakte) wurden entfernt (Nutzerkorrektur
          18.09.2026: "diese centaurian text oben link und diese ganz
          obere leiste entfernen"). */}
      <div className="fixed right-4 top-4 z-20 sm:right-8 sm:top-8">
        <LanguageSwitcher />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-12 sm:px-8 sm:pt-20">
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
              <span className="sr-only">Centaurian</span>
              <span aria-hidden="true"><TypedWordmark speed={90} /></span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-xs text-muted sm:text-sm">
              {ht.subtitle}
            </p>
          </header>
        )}

        <div className="mx-auto w-full max-w-2xl">
          <SearchBar onSearch={handleSearch} placeholder={ht.placeholder} ariaLabel={ht.aria} />
        </div>

        {!showHero && (
          // Nutzerwunsch 20.09.2026: "tu diese kleine text mit hinweis
          // alles in einem kleinen info logo" — die beiden Hinweistexte
          // stehen nicht mehr offen auf der Seite, sondern hinter einem
          // kleinen (i)-Symbol zum Antippen.
          <div className="mx-auto mt-3 flex justify-center">
            <InfoHint>
              <p>{t("infoHintNote1")}</p>
              <p>{t("infoHintNote2")}</p>
            </InfoHint>
          </div>
        )}

        {showFavorites && (
          <div className="glass-card mx-auto mt-4 flex w-full max-w-2xl items-center justify-between gap-3 px-4 py-3">
            <p className="label-mono text-xs uppercase">
              {t("favoritesLabel")} <span className="ml-1">🔀</span>
              <span className="ml-2 text-muted">({player.favorites.length})</span>
            </p>
            <button
              onClick={handleShufflePlayFavorites}
              className="flex shrink-0 items-center gap-1.5 border border-border px-3 py-1.5 text-[11px] uppercase tracking-wide text-foreground transition-colors hover:border-accent hover:text-accent"
              aria-label={t("shufflePlayAria")}
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
              </svg>
              {t("shufflePlay")}
            </button>
          </div>
        )}

        {showFavorites && (
          <CompactSongList
            songs={player.favorites}
            title={`${t("favoritesCompactLabel")} 🔀`}
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

        {query.trim() && <CosmosResults hits={cosmos} />}

        {query.trim() && cosmos.length > 0 && !musicAsked && (
          <div className="mx-auto mt-4 flex justify-center">
            <button
              onClick={handleAskMusic}
              className="border border-border px-3 py-1.5 text-[11px] uppercase tracking-wide text-muted transition-colors hover:border-accent hover:text-accent"
            >
              {ht.musicBtn}
            </button>
          </div>
        )}

        {query.trim() && (cosmos.length === 0 || musicAsked) && (
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
            {/* Nutzerwunsch 15.10.2026 "kompakter, alles durcheinander": Startseite = Wegweiser.
                Größenvergleich, Maschine, News und Zahlen liegen auf der Universum-Seite. */}
            <FeaturesSection />
            <div id="kontakte" className="scroll-mt-24">
              <AboutSiteSection />
            </div>
            <ContactSection />
          </>
        )}
      </div>
    </main>
  );
}
