"use client";

import { useEffect, useRef, useState } from "react";

/**
 * SongCover
 * ---------------------------------------------------------------------------
 * Zeigt standardmäßig das ECHTE Titelbild des Songs (YouTube-Thumbnail via
 * `coverUrl`) als normales Bild — Nutzerkorrektur 18.09.2026: "hier soll
 * echte titel bilder sein", vorher liefen ÜBERALL nur der immergleiche
 * "Centaurian"-Platzhaltervideo, egal welcher Song.
 *
 * Das animierte Titelbild-Video ("alte titelvideo mit sternen") bleibt
 * ausschließlich dort erhalten, wo bewusst KEIN `coverUrl` übergeben wird —
 * aktuell nur im "Now Playing"-Bereich (NowPlayingHero), wenn ein Song
 * tatsächlich abgespielt wird (Nutzerwunsch: "wenn ich ... spiele dann soll
 * diese alte titelvideo mit sternen bleiben").
 */
interface SongCoverProps {
  alt: string;
  className?: string;
  sizes?: string;
  /** Echtes Titelbild (z.B. YouTube-Thumbnail). Wenn gesetzt, wird dieses
   * Bild angezeigt statt des Video-Platzhalters. */
  coverUrl?: string;
  src?: string;
  /** Wenn gesetzt: Video folgt dem echten Wiedergabestatus (Play/Pause)
   * statt einfach endlos durchzulaufen. Wird ignoriert, wenn `coverUrl`
   * gesetzt ist (dann gibt es kein Video). */
  isPlaying?: boolean;
  /** @deprecated Partikel-Overlay wurde entfernt, Prop bleibt für Kompatibilität ohne Wirkung */
  withParticles?: boolean;
}

export default function SongCover({
  alt,
  className = "",
  src = "/branding/project-video.mp4",
  coverUrl,
  isPlaying,
}: SongCoverProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isControlled = isPlaying !== undefined;
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    if (!isControlled || coverUrl) return;
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isControlled, isPlaying, coverUrl]);

  // Echtes Titelbild vorhanden (und bisher nicht fehlgeschlagen) — normales
  // Bild statt Platzhalter-Video zeigen.
  if (coverUrl && !imgFailed) {
    return (
      <div className={`overflow-hidden bg-surface-elevated ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverUrl}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setImgFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        src={src}
        aria-label={alt}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay={!isControlled}
        muted
        loop
        playsInline
        disablePictureInPicture
      />
    </div>
  );
}
