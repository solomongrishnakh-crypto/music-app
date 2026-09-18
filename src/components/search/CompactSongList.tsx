"use client";

import { Song } from "@/types/music";
import SongCover from "@/components/ui/SongCover";

interface CompactSongListProps {
  songs: Song[];
  title: string;
  onPlay: (song: Song) => void;
  onToggleFavorite: (song: Song) => void;
  activeSongId?: string;
  /** Zeigt nur die ersten `limit` Songs, mit einem "Mehr"-Button für den Rest. */
  limit?: number;
  onShowMore?: () => void;
}

/**
 * Kompakte, futuristische Listendarstellung — kleine Zeilen statt großer
 * Karten-Kacheln. Für die "// Gemerkt"-Liste (Favoriten) auf der Startseite.
 */
export default function CompactSongList({
  songs,
  title,
  onPlay,
  onToggleFavorite,
  activeSongId,
  limit,
  onShowMore,
}: CompactSongListProps) {
  if (songs.length === 0) return null;

  const visibleSongs = limit ? songs.slice(0, limit) : songs;
  const remaining = songs.length - visibleSongs.length;

  return (
    <div className="mt-10 w-full">
      <h2 className="label-mono mb-3 text-xs uppercase">{title}</h2>
      <div className="flex flex-col divide-y divide-border border-y border-border">
        {visibleSongs.map((song) => {
          const isActive = song.id === activeSongId;
          return (
            <div
              key={song.id}
              className={`group flex items-center gap-3 py-2 pl-3 pr-2 transition-colors ${
                isActive ? "bg-surface" : "hover:bg-surface"
              }`}
            >
              <button
                onClick={() => onPlay(song)}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
                aria-label={`${song.title} von ${song.artist} abspielen`}
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

      {remaining > 0 && onShowMore && (
        <button
          onClick={onShowMore}
          className="label-mono mt-2 w-full border-b border-border py-2 text-center text-[11px] uppercase text-muted transition-colors hover:text-accent"
        >
          + {remaining} mehr anzeigen
        </button>
      )}
    </div>
  );
}
