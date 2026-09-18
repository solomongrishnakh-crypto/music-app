"use client";

import { Song } from "@/types/music";
import SongCover from "@/components/ui/SongCover";

interface SongCardProps {
  song: Song;
  onPlay: (song: Song) => void;
  isActive?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (song: Song) => void;
}

export default function SongCard({
  song,
  onPlay,
  isActive,
  isFavorite,
  onToggleFavorite,
}: SongCardProps) {
  return (
    <div
      className={`group flex flex-col overflow-hidden bg-background transition-shadow ${
        isActive ? "shadow-[inset_0_0_0_1px_var(--tw-shadow-color)] shadow-accent" : ""
      }`}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-surface-elevated">
        <SongCover
          alt={`Titelbild für ${song.title}`}
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
          sizes="(min-width: 1024px) 220px, (min-width: 640px) 33vw, 50vw"
          coverUrl={song.coverUrl}
        />
        <button
          onClick={() => onPlay(song)}
          className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/40 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
          aria-label={`${song.title} von ${song.artist} abspielen`}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-foreground/30 bg-black/60 text-white transition-transform hover:scale-110 hover:border-accent">
            <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>

        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(song);
            }}
            className={`absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center bg-black/60 backdrop-blur-sm transition-colors ${
              isFavorite ? "text-accent" : "text-white/70 hover:text-white"
            }`}
            aria-label={isFavorite ? `${song.title} nicht mehr merken` : `${song.title} merken`}
          >
            <svg
              className="h-3.5 w-3.5"
              fill={isFavorite ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 3a1 1 0 0 0-1 1v17l7-4.5 7 4.5V4a1 1 0 0 0-1-1H6z"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-0.5 p-3">
        <p className="truncate text-xs font-medium text-foreground">
          {song.title}
        </p>
        <p className="truncate text-[11px] text-muted">{song.artist}</p>
      </div>
    </div>
  );
}
