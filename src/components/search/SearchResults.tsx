"use client";

import { Song } from "@/types/music";
import SongCard from "./SongCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchResultsProps {
  songs: Song[];
  query: string;
  title?: string;
  isLoading?: boolean;
  errorMessage?: string | null;
  onPlay: (song: Song) => void;
  activeSongId?: string;
  isFavorite?: (songId: string) => boolean;
  onToggleFavorite?: (song: Song) => void;
}

export default function SearchResults({
  songs,
  query,
  title,
  isLoading,
  errorMessage,
  onPlay,
  activeSongId,
  isFavorite,
  onToggleFavorite,
}: SearchResultsProps) {
  const { t } = useLanguage();
  if (errorMessage) {
    return (
      <div className="mt-10 border border-border p-8 text-center text-xs text-muted">
        {errorMessage}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mt-10 grid grid-cols-2 gap-px bg-border sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="aspect-square animate-pulse bg-surface" />
        ))}
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="mt-10 border border-border p-8 text-center text-xs text-muted">
        {query ? `${t("noResultsFor")} „${query}".` : t("searchPrompt")}
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="label-mono mb-4 text-xs uppercase">
        {title ?? (query ? `${t("resultsFor")} „${query}"` : t("resultsLabel"))}
      </h2>
      <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {songs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            onPlay={onPlay}
            isActive={song.id === activeSongId}
            isFavorite={isFavorite ? isFavorite(song.id) : undefined}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}
