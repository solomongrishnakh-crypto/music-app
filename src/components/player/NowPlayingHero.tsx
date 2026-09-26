"use client";

import { useState } from "react";
import { Song } from "@/types/music";
import SongCover from "@/components/ui/SongCover";
import EqualizerVisualizer from "@/components/ui/EqualizerVisualizer";
import { useLanguage } from "@/contexts/LanguageContext";

interface NowPlayingHeroProps {
  song: Song;
  onBack: () => void;
  isPlaying: boolean;
  onNext: () => void;
  onPrevious: () => void;
  hasPrevious: boolean;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onSeek: (seconds: number) => void;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Großes, zentrales "Now Playing"-Titelbild. Ersetzt visuell den YouTube-
 * Player als Blickfang — der eigentliche (technisch weiterhin sichtbare)
 * YouTube-Player läuft minimiert in einer winzigen Ecke (YoutubePlayer.tsx).
 *
 * Der "Zurück"-Button verlässt nur diese Ansicht — der Song spielt einfach
 * weiter, bis er explizit geschlossen wird.
 *
 * Nutzerwunsch 19.09.2026: "nimm diese steurung von unten (markierung) und
 * ersetze es auf diese markierte linie aber nur für diese fenster ansonsten
 * immer unten" — Play/Pause + Fortschrittsbalken (bisher nur in der unteren
 * Leiste) sitzen jetzt zusätzlich direkt hier bei Vor/Zurück. Die untere
 * Leiste blendet ihre eigene Bedienoberfläche währenddessen aus (siehe
 * YoutubePlayer.tsx/PlayerContext.tsx: heroActive) und zeigt sie auf allen
 * anderen Seiten/Ansichten weiterhin ganz normal an.
 */
export default function NowPlayingHero({
  song,
  onBack,
  isPlaying,
  onNext,
  onPrevious,
  hasPrevious,
  currentTime,
  duration,
  onTogglePlay,
  onSeek,
}: NowPlayingHeroProps) {
  const { t } = useLanguage();
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);

  const displayTime = isSeeking ? seekValue : currentTime;
  const progressPercent = duration > 0 ? (displayTime / duration) * 100 : 0;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center py-6 text-center sm:py-10">
      {/* Deutlich sichtbarer Zurück-Button mit Rahmen statt eines
          unauffälligen reinen Text-Links (Nutzerkorrektur 18.09.2026: "es
          gibt keine zurück button ... fühle ein zeichen für zurück"). */}
      <button
        onClick={onBack}
        className="label-mono mb-6 flex items-center gap-1.5 self-start border border-border px-3 py-1.5 text-xs uppercase text-foreground transition-colors hover:border-accent hover:text-accent"
        aria-label={t("backToHomeAria")}
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {t("back")}
      </button>
      <p className="label-mono mb-4 text-xs uppercase">{t("nowPlayingLabel")}</p>
      <SongCover
        alt={`Titelbild für ${song.title}`}
        className="relative aspect-square w-56 border border-border sm:w-72"
        sizes="(min-width: 640px) 288px, 224px"
        src="/branding/nowplaying-video.mp4"
        isPlaying={isPlaying}
      />

      {/* Musik-Visualizer (Nutzerwunsch 19.09.2026) — siehe
          EqualizerVisualizer.tsx für den Hinweis, warum das eine simulierte
          statt echte frequenzbasierte Animation ist. */}
      <EqualizerVisualizer isPlaying={isPlaying} className="mt-4" />

      <p className="font-display mt-3 w-full truncate px-2 text-lg font-semibold uppercase tracking-tight text-foreground sm:text-xl">
        {song.title}
      </p>
      <p className="mt-1 w-full truncate px-2 text-xs text-muted sm:text-sm">{song.artist}</p>

      {/* Vor/Play-Pause/Zurück-Steuerung (Nutzerwunsch 18.09.2026: "ich
          brauche eine option hier das man nächstes music abspielen kann und
          letzte"; 19.09.2026: Play/Pause zusätzlich hierher geholt). */}
      <div className="mt-6 flex w-full items-center justify-center gap-4">
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="flex h-14 w-14 items-center justify-center border border-border text-foreground transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-border disabled:hover:text-foreground"
          aria-label={t("lastSongAria")}
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
          </svg>
        </button>
        <button
          onClick={onTogglePlay}
          className="flex h-16 w-16 items-center justify-center border border-accent text-foreground transition-colors hover:bg-accent hover:text-background"
          aria-label={isPlaying ? t("playerPause") : t("playerPlay")}
        >
          {isPlaying ? (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
            </svg>
          ) : (
            <svg className="ml-1 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <button
          onClick={onNext}
          className="flex h-14 w-14 items-center justify-center border border-border text-foreground transition-colors hover:border-accent hover:text-accent"
          aria-label={t("nextSongAria")}
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 6h2v12h-2zM6 6l8.5 6L6 18z" />
          </svg>
        </button>
      </div>

      {/* Fortschrittsbalken — dieselbe Funktion wie in der unteren Leiste
          (dort während dieser Ansicht ausgeblendet), nur hier direkt unter
          Play/Pause/Vor/Zurück platziert. */}
      <div className="mt-5 flex w-full items-center gap-2">
        <span className="w-9 shrink-0 text-right text-[10px] tabular-nums text-muted">
          {formatTime(displayTime)}
        </span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(displayTime, duration || 0)}
          onChange={(e) => {
            setIsSeeking(true);
            setSeekValue(Number(e.target.value));
          }}
          onMouseUp={(e) => {
            onSeek(Number(e.currentTarget.value));
            setIsSeeking(false);
          }}
          onTouchEnd={(e) => {
            onSeek(Number(e.currentTarget.value));
            setIsSeeking(false);
          }}
          disabled={duration === 0}
          className="h-[3px] flex-1 cursor-pointer appearance-none bg-surface-elevated accent-accent disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(to right, #ff5a4d ${progressPercent}%, #232320 ${progressPercent}%)`,
          }}
          aria-label={t("playbackPositionAria")}
        />
        <span className="w-9 shrink-0 text-[10px] tabular-nums text-muted">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
