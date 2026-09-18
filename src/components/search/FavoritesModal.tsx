"use client";

import { useEffect } from "react";
import { Song } from "@/types/music";
import SongCover from "@/components/ui/SongCover";

interface FavoritesModalProps {
  songs: Song[];
  activeSongId?: string;
  onPlay: (song: Song) => void;
  onShufflePlay: () => void;
  onToggleFavorite: (song: Song) => void;
  onClose: () => void;
}

/**
 * Eigene, mit X schließbare Box für ALLE gemerkten Songs (die kompakte
 * Vorschau darunter/darüber zeigt nur die ersten paar). Enthält oben einen
 * Zufällig-abspielen-Button, jede Zeile hat außerdem einen eigenen Play-Button.
 */
export default function FavoritesModal({
  songs,
  activeSongId,
  onPlay,
  onShufflePlay,
  onToggleFavorite,
  onClose,
}: FavoritesModalProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden border border-border bg-background/95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-4 sm:px-10">
          {/* Deutlich sichtbarer "← Zurück"-Button statt nur eines reinen
              X-Icons (Nutzerkorrektur 18.09.2026: "fühle ein zeichen für
              zurück"). */}
          <button
            onClick={onClose}
            className="label-mono flex shrink-0 items-center gap-1.5 border border-border px-3 py-1.5 text-xs uppercase text-foreground transition-colors hover:border-accent hover:text-accent"
            aria-label="Zurück"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Zurück
          </button>
          <p className="label-mono text-xs uppercase">
            // Gemerkte Musics <span className="ml-1">🔀</span>
          </p>
          <button
            onClick={onShufflePlay}
            className="flex shrink-0 items-center gap-1.5 border border-border px-3 py-1.5 text-[11px] uppercase tracking-wide text-foreground transition-colors hover:border-accent hover:text-accent"
            aria-label="Zufällig abspielen"
          >
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Zufällig
          </button>
        </div>

        <div className="flex flex-col divide-y divide-border overflow-y-auto">
          {songs.map((song) => {
            const isActive = song.id === activeSongId;
            return (
              <div
                key={song.id}
                className={`group flex items-center gap-3 py-2 pl-4 pr-3 transition-colors sm:pl-8 ${
                  isActive ? "bg-surface" : "hover:bg-surface"
                }`}
              >
                <button
                  onClick={() => onPlay(song)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center border border-border text-foreground transition-colors hover:border-accent hover:text-accent"
                  aria-label={`${song.title} abspielen`}
                >
                  <svg className="ml-0.5 h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>

                <button
                  onClick={() => onPlay(song)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <SongCover
                    alt={`Titelbild für ${song.title}`}
                    className="relative h-9 w-9 shrink-0"
                    sizes="36px"
                    coverUrl={song.coverUrl}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-medium uppercase text-foreground">
                      {song.title}
                    </span>
                    <span className="block truncate text-[11px] text-muted">
                      {song.artist}
                    </span>
                  </span>
                </button>

                <button
                  onClick={() => onToggleFavorite(song)}
                  className="shrink-0 p-1.5 text-accent transition-transform hover:scale-110"
                  aria-label={`${song.title} nicht mehr merken`}
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 3a1 1 0 0 0-1 1v17l7-4.5 7 4.5V4a1 1 0 0 0-1-1H6z" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
