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
