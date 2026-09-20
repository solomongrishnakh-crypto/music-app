"use client";

import { useEffect, useRef, useState } from "react";
import { Song } from "@/types/music";
import { usePlayer } from "@/contexts/PlayerContext";
import { useLanguage } from "@/contexts/LanguageContext";

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
  setPlaybackQuality: (quality: string) => void;
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
  onPlayingChange?: (isPlaying: boolean) => void;
  /** Nächster/vorheriger Song — auch für die Media-Session-Steuerung
   * (Sperrbildschirm/Benachrichtigung) genutzt. */
  onNext?: () => void;
  onPrevious?: () => void;
  hasPrevious?: boolean;
}

export default function YoutubePlayer({
  song,
  onEnded,
  onClose,
  onPlayingChange,
  onNext,
  onPrevious,
  hasPrevious,
}: YoutubePlayerProps) {
  const { reportProgress, registerControls, heroActive } = usePlayer();
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;
  const onPlayingChangeRef = useRef(onPlayingChange);
  onPlayingChangeRef.current = onPlayingChange;

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
          onReady: () => {
            setIsReady(true);
          },
          onStateChange: (e) => {
            if (!window.YT) return;
            const playing = e.data === window.YT.PlayerState.PLAYING;
            setIsPlaying(playing);
            onPlayingChangeRef.current?.(playing);
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
      const nextDuration = d && Number.isFinite(d) ? d : duration;
      if (d && Number.isFinite(d)) setDuration(d);
      const time = player.getCurrentTime();
      setCurrentTime(time);
      // An den globalen PlayerContext melden, damit die große Now-Playing-
      // Ansicht (NowPlayingHero.tsx) dieselbe Fortschrittsanzeige zeigen
      // kann (Nutzerwunsch 19.09.2026).
      reportProgress(time, nextDuration);
    }, 500);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, isSeeking]);

  function togglePlayback() {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }

  // Die Now-Playing-Ansicht ruft Play/Pause und Seek über den PlayerContext
  // auf (registerControls), da der eigentliche YouTube-Player hier im
  // global gemounteten YoutubePlayer lebt, nicht in NowPlayingHero.tsx.
  useEffect(() => {
    registerControls({
      toggle: togglePlayback,
      seek: (seconds: number) => {
        playerRef.current?.seekTo(seconds, true);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  function handleClose() {
    playerRef.current?.pauseVideo();
    onClose?.();
  }

  // Media Session API: zeigt Titel/Künstler/Cover in der System-Medien-
  // steuerung (Sperrbildschirm, Benachrichtigung, Kopfhörer-Tasten) und
  // erlaubt Play/Pause/Weiter/Zurück von dort aus — auch wenn der Browser-
  // Tab im Hintergrund ist oder das Handy gesperrt wurde (Nutzerwunsch
  // 18.09.2026: "falls jemand aus browser(handy) raus geht sollte man auch
  // nächste spielen können. also music soll auch im hintergrund spielen
  // können").
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    if (!song) {
      navigator.mediaSession.metadata = null;
      return;
    }
    if (typeof MediaMetadata !== "undefined") {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artist,
        artwork: song.coverUrl
          ? [
              { src: song.coverUrl, sizes: "96x96", type: "image/jpeg" },
              { src: song.coverUrl, sizes: "256x256", type: "image/jpeg" },
              { src: song.coverUrl, sizes: "512x512", type: "image/jpeg" },
            ]
          : [],
      });
    }
  }, [song]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    navigator.mediaSession.setActionHandler("play", () => playerRef.current?.playVideo());
    navigator.mediaSession.setActionHandler("pause", () => playerRef.current?.pauseVideo());
    navigator.mediaSession.setActionHandler(
      "previoustrack",
      onPrevious ? () => onPrevious() : null
    );
    navigator.mediaSession.setActionHandler("nexttrack", onNext ? () => onNext() : null);
    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("previoustrack", null);
      navigator.mediaSession.setActionHandler("nexttrack", null);
    };
  }, [onNext, onPrevious]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }, [isPlaying]);

  function handleSeekChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIsSeeking(true);
    setCurrentTime(Number(e.target.value));
  }

  // React.SyntheticEvent statt ChangeEvent, weil diese Funktion sowohl an
  // onMouseUp (MouseEvent) als auch onTouchEnd (TouchEvent) gebunden wird —
  // ChangeEvent passt nur zu onChange und ließ den strengen Produktions-
  // Build von Vercel fehlschlagen ("Type error: ... not assignable").
  function handleSeekCommit(e: React.SyntheticEvent<HTMLInputElement>) {
    const seconds = Number(e.currentTarget.value);
    playerRef.current?.seekTo(seconds, true);
    setIsSeeking(false);
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Winziges, technisch sichtbares YouTube-Fenster (Pflicht laut
          YouTube-Richtlinien) — IMMER gerendert (auch wenn die untere
          Leiste in der Now-Playing-Ansicht ausgeblendet ist), damit der
          Player nie unsichtbar (display:none) wird und der DOM-Knoten, an
          den die YouTube-API gebunden ist, erhalten bleibt. Nutzerwunsch
          19.09.2026: "nur für dieses Fenster [Now Playing], ansonsten immer
          unten" — die volle Leiste unten bleibt für alle anderen Ansichten
          unverändert. */}
      <div
        className={`fixed bottom-1 right-1 z-10 h-6 w-10 overflow-hidden bg-black opacity-90 ${
          song ? "" : "hidden"
        }`}
      >
        <div ref={containerRef} className="h-full w-full" />
      </div>

      {!heroActive && (
      <div
        className={`fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/90 backdrop-blur-sm ${
          song ? "" : "hidden"
        }`}
      >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-2 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium uppercase text-foreground">
              {song?.title ?? t("noSongSelected")}
            </p>
            <p className="truncate text-[11px] text-muted">{song?.artist ?? ""}</p>
          </div>

          {/* Vor/Zurück auch in der überall sichtbaren Mini-Leiste, nicht
              nur im großen Now-Playing-Bereich — funktioniert dadurch auch
              auf anderen Seiten (z.B. /imperien). */}
          <button
            onClick={onPrevious}
            disabled={!song || !hasPrevious}
            className="flex h-8 w-8 shrink-0 items-center justify-center text-white transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
            aria-label={t("lastSongAria")}
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
            </svg>
          </button>

          <button
            onClick={togglePlayback}
            disabled={!song}
            className="flex h-8 w-8 shrink-0 items-center justify-center border border-foreground/30 text-white transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={isPlaying ? t("playerPause") : t("playerPlay")}
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
            onClick={onNext}
            disabled={!song}
            className="flex h-8 w-8 shrink-0 items-center justify-center text-white transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
            aria-label={t("nextSongAria")}
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 6h2v12h-2zM6 6l8.5 6L6 18z" />
            </svg>
          </button>

          <button
            onClick={handleClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center text-muted transition-colors hover:text-accent"
            aria-label={t("playerCloseAria")}
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
            aria-label={t("playbackPositionAria")}
          />
          <span className="w-9 shrink-0 text-[10px] tabular-nums text-muted">
            {formatTime(duration)}
          </span>
        </div>
      </div>
      </div>
      )}
    </>
  );
}
