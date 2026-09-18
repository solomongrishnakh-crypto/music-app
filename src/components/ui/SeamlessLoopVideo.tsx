"use client";

import { useEffect, useRef } from "react";

interface SeamlessLoopVideoProps {
  src: string;
  ariaLabel?: string;
  /** Sekunden vor dem Ende, in denen sanft zum zweiten Video übergeblendet wird. */
  crossfadeSeconds?: number;
}

/**
 * Zwei übereinandergelegte, synchron laufende <video>-Elemente, die kurz vor
 * Ende ineinander übergeblendet werden (Nutzerwunsch 18.09.2026: "es gibt
 * ein pause zwischen video. mach es übergang so man niemand denkt es sei
 * ein video. man soll denken es ist lebendig. ohne lags").
 *
 * Der native `loop`-Neustart eines einzelnen <video>-Elements verursacht in
 * so gut wie jedem Browser einen kurzen sichtbaren Ruckler/Freeze, weil der
 * Decoder beim Zurückspringen auf Frame 0 kurz aussetzt. Statt dessen läuft
 * hier ein zweites, bereits vorgeladenes Video im Hintergrund mit und wird
 * per Opacity-Crossfade eingeblendet, sobald das sichtbare Video fast am
 * Ende ist — der Sprung selbst passiert komplett unsichtbar.
 */
export default function SeamlessLoopVideo({
  src,
  ariaLabel,
  crossfadeSeconds = 0.5,
}: SeamlessLoopVideoProps) {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const activeRef = useRef<"a" | "b">("a");
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const a = videoARef.current;
    const b = videoBRef.current;
    if (!a || !b) return;

    a.currentTime = 0;
    b.currentTime = 0;
    a.style.opacity = "1";
    b.style.opacity = "0";

    const playSafely = (v: HTMLVideoElement) => {
      v.play().catch(() => {});
    };
    playSafely(a);

    let switching = false;

    function tick() {
      const activeVideo = activeRef.current === "a" ? a : b;
      const idleVideo = activeRef.current === "a" ? b : a;
      if (!activeVideo || !idleVideo) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const dur = activeVideo.duration;
      if (
        !switching &&
        dur &&
        isFinite(dur) &&
        activeVideo.currentTime >= dur - crossfadeSeconds
      ) {
        switching = true;
        idleVideo.currentTime = 0;
        playSafely(idleVideo);
        idleVideo.style.transition = `opacity ${crossfadeSeconds}s linear`;
        activeVideo.style.transition = `opacity ${crossfadeSeconds}s linear`;
        idleVideo.style.opacity = "1";
        activeVideo.style.opacity = "0";

        window.setTimeout(() => {
          activeVideo.pause();
          activeVideo.currentTime = 0;
          activeRef.current = activeRef.current === "a" ? "b" : "a";
          switching = false;
        }, crossfadeSeconds * 1000);
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [crossfadeSeconds]);

  return (
    <>
      <video
        ref={videoARef}
        src={src}
        aria-label={ariaLabel}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        playsInline
        disablePictureInPicture
        preload="auto"
      />
      <video
        ref={videoBRef}
        src={src}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        muted
        playsInline
        disablePictureInPicture
        preload="auto"
        style={{ opacity: 0 }}
      />
    </>
  );
}
