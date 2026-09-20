"use client";

import { useEffect, useState } from "react";

interface TypewriterProps {
  text: string;
  active: boolean;
  speed?: number; // ms pro Zeichen
  delay?: number; // ms Verzögerung vor Start
  className?: string;
  showCursorWhileDone?: boolean;
  /** Wird einmalig aufgerufen, sobald der Text komplett "eingetippt" ist. */
  onDone?: () => void;
}

/**
 * Lässt einen Text Zeichen für Zeichen "eintippen", sobald `active` true
 * wird (z.B. ausgelöst durch useInView beim Scrollen). Ein blinkender
 * Block simuliert dabei einen Terminal-Cursor.
 */
export default function Typewriter({
  text,
  active,
  speed = 14,
  delay = 0,
  className,
  showCursorWhileDone = false,
  onDone,
}: TypewriterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i++;
        setCount(i);
        if (i >= text.length) {
          if (interval) clearInterval(interval);
          onDone?.();
        }
      }, speed);
    }, delay);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const done = count >= text.length;

  return (
    <span className={className}>
      {text.slice(0, count)}
      {active && (!done || showCursorWhileDone) && (
        <span className="ml-0.5 inline-block h-[0.9em] w-[0.5ch] translate-y-[0.1em] animate-pulse bg-accent align-middle" />
      )}
    </span>
  );
}
