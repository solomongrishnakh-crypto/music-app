"use client";

import { Song } from "@/types/music";
import SongCover from "@/components/ui/SongCover";

interface NowPlayingHeroProps {
  song: Song;
  onBack: () => void;
  isPlaying: boolean;
  onNext: () => void;
  onPrevious: () => void;
  hasPrevious: boolean;
}

/**
 * Großes, zentrales "Now Playing"-Titelbild. Ersetzt visuell den YouTube-
 * Player als Blickfang — der eigentliche (technisch weiterhin sichtbare)
 * YouTube-Player läuft minimiert in der unteren Leiste (YoutubePlayer.tsx).
 *
 * Der "Zurück"-Button verlässt nur diese Ansicht — der Song spielt in der
 * unteren Leiste einfach weiter, bis er dort explizit geschlossen wird.
 */
export default function NowPlayingHero({
  song,
  onBack,
  isPlaying,
  onNext,
  onPrevious,
  hasPrevious,
}: NowPlayingHeroProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center py-6 text-center sm:py-10">
      {/* Deutlich sichtbarer Zurück-Button mit Rahmen statt eines
          unauffälligen reinen Text-Links (Nutzerkorrektur 18.09.2026: "es
          gibt keine zurück button ... fühle ein zeichen für zurück"). */}
      <button
        onClick={onBack}
        className="label-mono mb-6 flex items-center gap-1.5 self-start border border-border px-3 py-1.5 text-xs uppercase text-foreground transition-colors hover:border-accent hover:text-accent"
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
        src="/branding/nowplaying-video.mp4"
        isPlaying={isPlaying}
      />
      <p className="font-display mt-5 truncate text-lg font-semibold uppercase tracking-tight text-foreground sm:text-xl">
        {song.title}
      </p>
      <p className="mt-1 truncate text-xs text-muted sm:text-sm">{song.artist}</p>

      {/* Vor/Zurück-Steuerung (Nutzerwunsch 18.09.2026: "ich brauche eine
          option hier das man nächstes music abspielen kann und letzte").
          Nutzerkorrektur 19.09.2026: Buttons größer und mittig, damit die
          Zeile mehr Gewicht bekommt. */}
      <div className="mt-6 flex w-full items-center justify-center gap-6">
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="flex h-14 w-14 items-center justify-center border border-border text-foreground transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-border disabled:hover:text-foreground"
          aria-label="Letzter Song"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
          </svg>
        </button>
        <button
          onClick={onNext}
          className="flex h-14 w-14 items-center justify-center border border-border text-foreground transition-colors hover:border-accent hover:text-accent"
          aria-label="Nächster Song"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 6h2v12h-2zM6 6l8.5 6L6 18z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
