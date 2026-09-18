"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useAudioReactivity
 * ---------------------------------------------------------------------------
 * Schnittstelle für die SPÄTERE Kopplung des Partikel-Hintergrunds an aktuell
 * gespielte Musik (siehe Projektziel: "Partikel sollen auf die aktuell
 * gespielte Musik reagieren").
 *
 * WICHTIG: Diese Web-App extrahiert und analysiert KEINEN Audio-Stream aus
 * der YouTube-Music/ReVanced-App (das wird laut Vorgabe bewusst NICHT
 * gemacht). Sobald eine dokumentierte, legitime Quelle für Wiedergabe-Level
 * existiert — z. B. eine lokale <audio>/<video>-Quelle via Web Audio API
 * (AnalyserNode), oder Metadaten, die eine Android-Companion-App aktiv an
 * diese Seite sendet (z. B. via WebSocket/postMessage) — kann dieser Hook
 * daran angeschlossen werden, ohne die Partikel-Komponente selbst ändern zu
 * müssen.
 *
 * Bis dahin liefert der Hook einen sanft schwankenden Platzhalterwert, damit
 * sich der Hintergrund unabhängig von echter Musik "lebendig" anfühlt.
 */

export interface AudioReactivityState {
  /** Normalisierter Gesamtpegel 0..1 (Platzhalter, bis echte Quelle existiert) */
  level: number;
  /** Ob gerade eine echte Audioquelle angebunden ist */
  isConnected: boolean;
}

export function useAudioReactivity(): AudioReactivityState {
  const [level, setLevel] = useState(0.35);
  const rafRef = useRef<number | undefined>(undefined);
  const tRef = useRef(0);

  useEffect(() => {
    const tick = () => {
      tRef.current += 0.015;
      // Platzhalter-"Atmen" bis eine echte Audioquelle (AnalyserNode o.ä.)
      // angebunden wird. Bewusst NICHT von ReVanced-Audio abgeleitet.
      const value = 0.3 + Math.sin(tRef.current) * 0.15 + 0.1 * Math.sin(tRef.current * 2.7);
      setLevel(Math.max(0, Math.min(1, value)));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { level, isConnected: false };
}
