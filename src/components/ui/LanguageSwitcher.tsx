"use client";

import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Nutzerwunsch 20.09.2026: manuelle Sprachwahl in der Webseite, zusätzlich
 * zur automatischen Erkennung anhand der Gerätesprache. DE/EN-Umschalter,
 * platziert neben dem Hauptmenü.
 */
export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className="glass-card flex items-center gap-0.5 px-1 py-1"
      role="group"
      aria-label="Sprache / Language"
    >
      {(["de", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`label-mono rounded-sm px-2 py-1 text-[10px] uppercase tracking-wide transition-colors ${
            lang === code ? "bg-accent/20 text-accent" : "text-muted hover:text-foreground"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
