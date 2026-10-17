"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Nutzerwunsch 17.10.2026: "wenn ich zurück gehe soll da sein bevor ich geklickt
 * habe". Merkt sich auf jeder Seite die Scrollposition und stellt sie beim
 * Zurück-Gehen (auch wenn der Inhalt erst nach dem Laden erscheint) wieder her.
 */
declare global {
  interface Window {
    __skBackAt?: number;
  }
}

const KEY = (p: string) => "sk:" + p;

export default function ScrollKeeper() {
  const path = usePathname();

  // Zurück-/Vorwärts-Navigation erkennen (einmalig, bleibt über Seitenwechsel aktiv).
  useEffect(() => {
    try {
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    } catch {}
    const onPop = () => {
      window.__skBackAt = Date.now();
    };
    window.addEventListener("popstate", onPop);
    try {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      if (nav && (nav.type === "back_forward" || nav.type === "reload")) window.__skBackAt = Date.now();
    } catch {}
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Pro Seite: Position speichern und ggf. wiederherstellen.
  useEffect(() => {
    const key = KEY(location.pathname + location.search);
    const k = () => key;
    const isBack = Date.now() - (window.__skBackAt ?? 0) < 4000;
    let timer: number | undefined;
    let stop = () => {};

    if (isBack) {
      let y = 0;
      try {
        y = Number(sessionStorage.getItem(k()) || 0);
      } catch {}
      if (y > 0) {
        let n = 0;
        const id = window.setInterval(() => {
          n++;
          window.scrollTo(0, y);
          if (Math.abs(window.scrollY - y) < 4 || n > 30) window.clearInterval(id);
        }, 100);
        stop = () => window.clearInterval(id);
        window.addEventListener("wheel", stop, { once: true, passive: true });
        window.addEventListener("touchstart", stop, { once: true, passive: true });
      }
    } else {
      try {
        sessionStorage.removeItem(k());
      } catch {}
    }

    const save = () => {
      if (timer) return;
      timer = window.setTimeout(() => {
        timer = undefined;
        try {
          sessionStorage.setItem(k(), String(Math.round(window.scrollY)));
        } catch {}
      }, 120);
    };
    const saveNow = () => {
      try {
        sessionStorage.setItem(k(), String(Math.round(window.scrollY)));
      } catch {}
    };
    window.addEventListener("scroll", save, { passive: true });
    document.addEventListener("click", saveNow, true);
    return () => {
      stop();
      if (timer) window.clearTimeout(timer);
      window.removeEventListener("scroll", save);
      document.removeEventListener("click", saveNow, true);
    };
  }, [path]);

  return null;
}
