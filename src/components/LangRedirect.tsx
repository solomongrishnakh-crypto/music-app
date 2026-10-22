"use client";

import { useEffect } from "react";
import { LANGUAGES } from "@/contexts/LanguageContext";
import { toIntlSlugs } from "@/lib/slugs";

/**
 * Wer eine andere Sprache gewählt hat, soll NIE auf einer deutschen Seite
 * landen (Nutzerkorrektur 15.10.2026: "wieso ist es auf deutsch? ich habe
 * andere Sprache ausgewählt"). Die deutschen Einzelseiten (Reiche, Planeten,
 * Sternbilder …) werden auf dem Server fest in Deutsch erzeugt; steht im
 * Browser eine andere Sprache gespeichert, geht es hier zur Sprach-Adresse
 * (/en/…, /es/… usw.). Suchmaschinen haben nichts gespeichert und sehen
 * weiter die deutsche Seite.
 */
const GERMAN_DETAIL = /^\/(imperien\/reiche?|sonnensystem|sternbilder|himmel-heute|maschine-der-ewigkeit)(\/|$)/;

export default function LangRedirect() {
  // Besucher mit nicht-deutschem Browser auf einer deutschen Adresse: kleiner
  // Hinweis "In English ansehen" (kein Zwangs-Redirect, damit Google die deutsche
  // Seite weiter sauber sieht). Wunsch 22.10.2026: Amerikaner verstehen /sternenhimmel nicht.
  useEffect(() => {
    try {
      const { pathname, search, hash } = window.location;
      const stored = window.localStorage.getItem("centaurian-lang");
      const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
      const isGerman = pathname === "/" || toIntlSlugs(pathname) !== pathname;
      if ((!stored || stored === "de") && nav !== "de" && isGerman && !window.sessionStorage.getItem("centaurian-en-hint")) {
        const target = LANGUAGES.some((l) => l.code === nav) && nav !== "de" ? nav : "en";
        const href = `/${target}${pathname === "/" ? "" : toIntlSlugs(pathname)}${search}${hash}`;
        const bar = document.createElement("div");
        bar.setAttribute("role", "note");
        bar.style.cssText = "position:fixed;left:50%;bottom:76px;transform:translateX(-50%);z-index:9999;max-width:92vw;display:flex;gap:12px;align-items:center;padding:10px 14px;border-radius:999px;background:rgba(10,14,28,.92);border:1px solid rgba(120,160,255,.45);color:#fff;font:14px system-ui,sans-serif;backdrop-filter:blur(8px)";
        const a = document.createElement("a");
        a.href = href;
        a.textContent = "This page is in German – view in English →";
        a.style.cssText = "color:#9fc2ff;text-decoration:underline";
        const x = document.createElement("button");
        x.textContent = "✕";
        x.setAttribute("aria-label", "Close");
        x.style.cssText = "background:none;border:0;color:#fff;cursor:pointer;font-size:14px";
        x.onclick = () => { bar.remove(); try { window.sessionStorage.setItem("centaurian-en-hint", "1"); } catch {} };
        bar.append(a, x);
        document.body.appendChild(bar);
      }
    } catch { /* ignorieren */ }
  }, []);

  useEffect(() => {
    try {
      const { pathname, search, hash } = window.location;
      if (!GERMAN_DETAIL.test(pathname)) return;
      const stored = window.localStorage.getItem("centaurian-lang");
      if (!stored || stored === "de") return;
      if (!LANGUAGES.some((l) => l.code === stored)) return;
      window.location.replace(`/${stored}${toIntlSlugs(pathname)}${search}${hash}`);
    } catch {
      /* kein localStorage: bei der deutschen Seite bleiben */
    }
  }, []);
  return null;
}
