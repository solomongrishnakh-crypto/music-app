"use client";

/**
 * SongCover
 * ---------------------------------------------------------------------------
 * Einheitliches Titelbild für ALLE Songs (statt individueller YouTube-
 * Thumbnails). Nutzt ein einziges, lokal gehostetes, nahtlos loopendes
 * Video (Ping-Pong-Loop: läuft vorwärts, dann rückwärts — Start- und
 * Endbild sind identisch, dadurch kein sichtbarer Schnitt beim Wiederholen).
 */
interface SongCoverProps {
  alt: string;
  className?: string;
  sizes?: string;
  /** @deprecated Partikel-Overlay wurde entfernt, Prop bleibt für Kompatibilität ohne Wirkung */
  withParticles?: boolean;
}

export default function SongCover({ alt, className = "" }: SongCoverProps) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <video
        src="/branding/project-video.mp4"
        aria-label={alt}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
      />
    </div>
  );
}
