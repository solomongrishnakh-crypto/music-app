"use client";

import { Song } from "@/types/music";
import SongCover from "@/components/ui/SongCover";

interface NowPlayingHeroProps {
  song: Song;
  onBack: () => void;
}

/**
 * Großes, zentrales "Now Playing"-Titelbild. Ersetzt visuell den YouTube-
 * Player als Blickfang — der eigentliche (technisch weiterhin sichtbare)
 * YouTube-Player läuft minimiert in der unteren Leiste (YoutubePlayer.tsx).
 *
 * Der "Zurück"-Button verlässt nur diese Ansicht — der Song spielt in der
 * unteren Leiste einfach weiter, bis er dort explizit geschlossen wird.
 */
export default function NowPlayingHero({ song, onBack }: NowPlayingHeroProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center py-6 text-center sm:py-10">
      <button
        onClick={onBack}
        className="label-mono mb-6 flex items-center gap-1.5 self-start text-xs uppercase text-muted transition-colors hover:text-foreground"
        aria-label="Zurück zur Startseite"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Zurück
      </button>
      <p className="label-mono mb-4 text-xs uppercase">// Now Playing</p>
      <SongCover
        alt={`Titelbild für ${song.title}`}
        className="relative aspect-square w-56 border border-border sm:w-72"
        sizes="(min-width: 640px) 288px, 224px"
      />
      <p className="font-display mt-5 truncate text-lg font-semibold uppercase tracking-tight text-foreground sm:text-xl">
        {song.title}
      </p>
      <p className="mt-1 truncate text-xs text-muted sm:text-sm">{song.artist}</p>
    </div>
  );
}
