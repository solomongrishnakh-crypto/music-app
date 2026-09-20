"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { TRANSLATIONS, type TranslationKey } from "@/lib/translations";

export type Lang = "de" | "en";

const STORAGE_KEY = "centaurian-lang";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Übersetzt einen bekannten UI-Textbaustein (Menüs, Buttons, Labels). */
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function detectInitialLang(): Lang {
  if (typeof window === "undefined") return "de";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "de" || stored === "en") return stored;
  } catch {
    // localStorage kann in seltenen Fällen (privater Modus etc.) fehlschlagen — dann einfach Gerätesprache nutzen.
  }
  const nav = navigator.languages?.[0] ?? navigator.language ?? "de";
  return nav.toLowerCase().startsWith("de") ? "de" : "en";
}

/**
 * Nutzerwunsch 20.09.2026: "die sprache von webseite soll keine mischung
 * sein sondern laut gerät oder adde spracheinstellung oder wählen in
 * webseite" — Sprache richtet sich standardmäßig nach der Gerätesprache
 * (navigator.language), ist aber über einen Umschalter in der Navbar
 * (LanguageSwitcher.tsx) manuell wählbar; die Wahl wird gemerkt.
 *
 * Übersetzt werden die wiederkehrenden UI-Bausteine (Menüs, Buttons,
 * Überschriften, Hinweistexte) über das TRANSLATIONS-Wörterbuch. Lange
 * Inhalte (Planetenbeschreibungen, Universum-Fakten, Imperien-Namen)
 * bleiben bewusst deutsch, da eine vollständige Übersetzung aller Inhalte
 * ein deutlich größerer, separater Umbau wäre.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("de");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLangState(detectInitialLang());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof document === "undefined") return;
    document.documentElement.lang = lang;
  }, [lang, hydrated]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignorieren — Sprache gilt dann nur für die aktuelle Sitzung
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey) => TRANSLATIONS[key]?.[lang] ?? TRANSLATIONS[key]?.de ?? key,
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage muss innerhalb von LanguageProvider verwendet werden");
  return ctx;
}
