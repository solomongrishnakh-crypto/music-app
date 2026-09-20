"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { TRANSLATIONS, type TranslationKey } from "@/lib/translations";

// Nutzerwunsch 20.09.2026: "füge mehr sprachen wie hindi, chinesich,
// koreanisch, japanisch, spanisch, französich, türkisch, russisch,
// portuguiesich, arabisch, griechischh" — 13 Sprachen insgesamt.
export const LANGUAGES = [
  { code: "de", flag: "🇩🇪", name: "Deutsch" },
  { code: "en", flag: "🇬🇧", name: "English" },
  { code: "es", flag: "🇪🇸", name: "Español" },
  { code: "fr", flag: "🇫🇷", name: "Français" },
  { code: "pt", flag: "🇵🇹", name: "Português" },
  { code: "tr", flag: "🇹🇷", name: "Türkçe" },
  { code: "ru", flag: "🇷🇺", name: "Русский" },
  { code: "el", flag: "🇬🇷", name: "Ελληνικά" },
  { code: "ar", flag: "🇸🇦", name: "العربية" },
  { code: "hi", flag: "🇮🇳", name: "हिन्दी" },
  { code: "zh", flag: "🇨🇳", name: "中文" },
  { code: "ja", flag: "🇯🇵", name: "日本語" },
  { code: "ko", flag: "🇰🇷", name: "한국어" },
] as const;

export type Lang = (typeof LANGUAGES)[number]["code"];

// Sprachen, die von rechts nach links geschrieben werden — Layout kippt
// entsprechend (dir="rtl" auf <html>).
const RTL_LANGS: Lang[] = ["ar"];

const STORAGE_KEY = "centaurian-lang";
const LANG_CODES = LANGUAGES.map((l) => l.code);

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Übersetzt einen bekannten UI-Textbaustein (Menüs, Buttons, Labels). */
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLang(value: string): value is Lang {
  return (LANG_CODES as string[]).includes(value);
}

function detectInitialLang(): Lang {
  if (typeof window === "undefined") return "de";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && isLang(stored)) return stored;
  } catch {
    // localStorage kann in seltenen Fällen (privater Modus etc.) fehlschlagen — dann einfach Gerätesprache nutzen.
  }
  const candidates = navigator.languages?.length ? navigator.languages : [navigator.language ?? "de"];
  for (const raw of candidates) {
    const short = raw.toLowerCase().split("-")[0];
    if (isLang(short)) return short;
  }
  return "en";
}

/**
 * Nutzerwunsch 20.09.2026: "die sprache von webseite soll keine mischung
 * sein sondern laut gerät oder adde spracheinstellung oder wählen in
 * webseite" — Sprache richtet sich standardmäßig nach der Gerätesprache
 * (navigator.language), ist aber über einen Umschalter (LanguageSwitcher)
 * manuell wählbar; die Wahl wird gemerkt.
 *
 * Übersetzt werden die kurzen UI-Bausteine (Menüs, Buttons, Überschriften)
 * über das TRANSLATIONS-Wörterbuch (alle 13 Sprachen vollständig). Lange,
 * individuelle Inhalte (Planetenbeschreibungen, Universum-Fakten) nutzen
 * stattdessen lib/i18n.ts (LocalizedText) — dort sind aktuell Deutsch und
 * Englisch vollständig, weitere Sprachen fallen bis zur Übersetzung auf
 * Englisch zurück statt gemischt/leer zu bleiben.
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
    document.documentElement.dir = RTL_LANGS.includes(lang) ? "rtl" : "ltr";
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
    (key: TranslationKey) => TRANSLATIONS[key]?.[lang] ?? TRANSLATIONS[key]?.en ?? TRANSLATIONS[key]?.de ?? key,
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
