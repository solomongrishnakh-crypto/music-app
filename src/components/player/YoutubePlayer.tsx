"use client";

import { useEffect, useRef, useState } from "react";
import { Song } from "@/types/music";

/**
 * YoutubePlayer
 * ---------------------------------------------------------------------------
 * Nutzt die offizielle YouTube IFrame Player API, um Songs direkt im Browser
 * abzuspielen. Der Ton kommt aus dem echten, von YouTube gehosteten Player —
 * diese Komponente extrahiert oder speichert keinen Audio-Stream, sie
 * steuert nur den offiziellen Player fern (play/pause/laden/seek).
 *
 * Sichtbarkeit: YouTubes Nutzungsbedingungen verlangen einen sichtbaren
 * Player (kein display:none, kein Verstecken hinter anderen Elementen).
 * Deshalb bleibt hier eine winzige Ecke technisch sichtbar — den optischen
 * Fokus übernimmt stattdessen das große animierte Titelbild (siehe
 * `NowPlayingHero` in page.tsx).
 *
 * Doku: https://developers.google.com/youtube/iframe_api_reference
 */

interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  loadVideoById: (videoId: string) => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
}

interface YTNamespace {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      playerVars?: Record<string, number | string>;
      events?: {
        onReady?: () => void;
        onStateChange?: (e: { data: number }) => void;
      };
    }
  ) => YTPlayerInstance;
  PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiLoadPromise: Promise<void> | null = null;

function loadYoutubeIframeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (apiLoadPromise) return apiLoadPromise;

  apiLoadPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });

  return apiLoadPromise;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface YoutubePlayerProps {
  song: Song | null;
  onEnded?: () => void;
  onClose?: () => void;
}

export default function YoutubePlayer({ song, onEnded, onClose }: YoutubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  // Player einmalig initialisieren
  useEffect(() => {
    let cancelled = false;

    loadYoutubeIframeApi().then(() => {
      if (cancelled || !containerRef.current || !window.YT) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: song?.id ?? "",
        playerVars: { autoplay: 1, playsinline: 1 },
        events: {
          onReady: () => setIsReady(true),
          onStateChange: (e) => {
            if (!window.YT) return;
            setIsPlaying(e.data === window.YT.PlayerState.PLAYING);
            if (e.data === window.YT.PlayerState.ENDED) {
              onEndedRef.current?.();
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
    // Nur einmal beim Mount initialisieren; Songwechsel läuft über den Effect unten.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Bei Songwechsel neues Video laden
  useEffect(() => {
    if (isReady && song && playerRef.current) {
      playerRef.current.loadVideoById(song.id);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [song, isReady]);

  // Aktuelle Zeit/Dauer laufend abfragen (YT-API bietet keine Events dafür)
  useEffect(() => {
    if (!isReady) return;
    const interval = setInterval(() => {
      const player = playerRef.current;
      if (!player || isSeeking) return;
      const d = player.getDuration();
      if (d && Number.isFinite(d)) setDuration(d);
      setCurrentTime(player.getCurrentTime());
    }, 500);
    return () => clearInterval(interval);
  }, [isReady, isSeeking]);

  function togglePlayback() {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }

  function handleClose() {
    playerRef.current?.pauseVideo();
    onClose?.();
  }

  function handleSeekChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIsSeeking(true);
    setCurrentTime(Number(e.target.value));
  }

  function handleSeekCommit(e: React.ChangeEvent<HTMLInputElement>) {
    const seconds = Number(e.target.value);
    playerRef.current?.seekTo(seconds, true);
    setIsSeeking(false);
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/90 backdrop-blur-sm ${
        song ? "" : "hidden"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-2 sm:px-8">
        <div className="flex items-center gap-3">
          {/* Winziges, technisch sichtbares YouTube-Fenster (Pflicht laut
              YouTube-Richtlinien) — bewusst unauffällig in der Ecke. */}
          <div className="h-6 w-10 shrink-0 overflow-hidden bg-black opacity-90">
            <div ref={containerRef} className="h-full w-full" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium uppercase text-foreground">
              {song?.title ?? "Kein Song ausgewählt"}
            </p>
            <p className="truncate text-[11px] text-muted">{song?.artist ?? ""}</p>
          </div>

          <button
            onClick={togglePlayback}
            disabled={!song}
            className="flex h-8 w-8 shrink-0 items-center justify-center border border-foreground/30 text-white transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={isPlaying ? "Pause" : "Abspielen"}
          >
            {isPlaying ? (
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
              </svg>
            ) : (
              <svg className="ml-0.5 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            onClick={handleClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center text-muted transition-colors hover:text-accent"
            aria-label="Player schließen"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Fortschrittsbalken: an jede Stelle im Song springen */}
        <div className="flex items-center gap-2">
          <span className="w-9 shrink-0 text-right text-[10px] tabular-nums text-muted">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(currentTime, duration || 0)}
            onChange={handleSeekChange}
            onMouseUp={handleSeekCommit}
            onTouchEnd={handleSeekCommit}
            disabled={!song || duration === 0}
            className="h-[2px] flex-1 cursor-pointer appearance-none bg-surface-elevated accent-accent disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(to right, #ff5a4d ${progressPercent}%, #232320 ${progressPercent}%)`,
            }}
            aria-label="Wiedergabeposition"
          />
          <span className="w-9 shrink-0 text-[10px] tabular-nums text-muted">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}
