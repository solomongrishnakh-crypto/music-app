"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
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

/**
 * Globaler Wiedergabe-Zustand — lebt im Root-Layout statt in der Startseite,
 * damit Musik beim Wechsel auf eine andere Seite (z.B. /imperien) einfach
 * weiterläuft statt abzubrechen (Nutzerwunsch 18.09.2026: "music soll auch
 * hier gespielt werden nicht abbrechen wenn ich die karte oder was anderes
 * in dieser seite öffne"). Der eigentliche YouTube-Player wird ebenfalls im
 * Root-Layout gemountet und bleibt so über Seitenwechsel hinweg bestehen.
 */
interface PlayerContextValue {
  currentSong: Song | null;
  isPlaying: boolean;
  recentlyPlayed: Song[];
  favorites: Song[];
  shuffleFavorites: boolean;
  hasPrevious: boolean;
  play: (song: Song, queue?: Song[]) => void;
  next: () => void;
  previous: () => void;
  playRandomFavorite: () => void;
  close: () => void;
  toggleFavorite: (song: Song) => void;
  isFavorite: (songId: string) => boolean;
  setQueue: (songs: Song[]) => void;
  setIsPlaying: (playing: boolean) => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [favorites, setFavorites] = useState<Song[]>([]);
  const [shuffleFavorites, setShuffleFavorites] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);

  useEffect(() => {
    setRecentlyPlayed(loadRecentlyPlayed());
    setFavorites(loadFavorites());
  }, []);

  function pickRandomSong(list: Song[], excludeId?: string): Song | undefined {
    const pool = list.length > 1 ? list.filter((s) => s.id !== excludeId) : list;
    if (pool.length === 0) return undefined;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function play(song: Song, songQueue?: Song[]) {
    setCurrentSong(song);
    setShuffleFavorites(false);
    setRecentlyPlayed(addToRecentlyPlayed(song));
    if (songQueue) setQueue(songQueue);
  }

  function playRandomFavorite() {
    const song = pickRandomSong(favorites);
    if (!song) return;
    setCurrentSong(song);
    setShuffleFavorites(true);
    setRecentlyPlayed(addToRecentlyPlayed(song));
  }

  function next() {
    if (!currentSong) return;

    if (shuffleFavorites) {
      const nextSong = pickRandomSong(favorites, currentSong.id);
      if (nextSong) {
        setCurrentSong(nextSong);
        setRecentlyPlayed(addToRecentlyPlayed(nextSong));
      }
      return;
    }

    const list = queue.length > 0 ? queue : recentlyPlayed;
    const idx = list.findIndex((s) => s.id === currentSong.id);
    const nextSong = idx >= 0 ? list[idx + 1] : undefined;
    if (nextSong) play(nextSong);
  }

  function previous() {
    if (recentlyPlayed.length < 2) return;
    const prev = recentlyPlayed[1];
    setCurrentSong(prev);
    setShuffleFavorites(false);
    setRecentlyPlayed(addToRecentlyPlayed(prev));
  }

  function close() {
    setCurrentSong(null);
  }

  function handleToggleFavorite(song: Song) {
    setFavorites((prev) => toggleFavorite(prev, song));
  }

  function handleIsFavorite(songId: string) {
    return checkIsFavorite(favorites, songId);
  }

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        recentlyPlayed,
        favorites,
        shuffleFavorites,
        hasPrevious: recentlyPlayed.length > 1,
        play,
        next,
        previous,
        playRandomFavorite,
        close,
        toggleFavorite: handleToggleFavorite,
        isFavorite: handleIsFavorite,
        setQueue,
        setIsPlaying,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer muss innerhalb von PlayerProvider genutzt werden");
  return ctx;
}
