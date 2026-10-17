"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Wie useState, merkt sich den Wert aber in der Sitzung und stellt ihn nur
 * beim Zurück-Gehen wieder her (Nutzerwunsch 17.10.2026). Frischer Besuch =
 * Startwert.
 */
export function usePersist<T>(key: string, init: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [v, setV] = useState<T>(init);
  const [hydrated, setHydrated] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      const back = Date.now() - ((window as unknown as { __skBackAt?: number }).__skBackAt ?? 0) < 4000;
      if (back) {
        try {
          const s = sessionStorage.getItem("ps:" + key);
          if (s !== null) setV(JSON.parse(s) as T);
        } catch {}
      }
      setHydrated(true);
    }
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem("ps:" + key, JSON.stringify(v));
    } catch {}
  }, [key, v, hydrated]);

  return [v, setV];
}
