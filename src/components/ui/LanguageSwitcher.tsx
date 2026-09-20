"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage, LANGUAGES } from "@/contexts/LanguageContext";

/**
 * Nutzerwunsch 20.09.2026: "alle kleinen menü mit sprache logo so das man
 * komplette inhalte übersetzen kann" — Dropdown mit Flagge + Name für alle
 * 13 Sprachen (zu viele für eine Reihe von Buttons wie zuvor bei nur 2).
 */
export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("languageMenuLabel")}
        className="glass-card flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] uppercase tracking-wide text-foreground transition-colors hover:text-accent"
      >
        <span className="text-sm leading-none">{current.flag}</span>
        <span className="label-mono">{current.code}</span>
        <svg
          className={`h-3 w-3 text-muted transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t("languageMenuLabel")}
          className="absolute right-0 top-full z-50 mt-1 max-h-80 w-44 overflow-y-auto border border-border bg-background/95 py-1 shadow-lg backdrop-blur-md"
        >
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              role="option"
              aria-selected={lang === l.code}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs transition-colors ${
                lang === l.code ? "bg-accent/15 text-accent" : "text-foreground hover:bg-white/5"
              }`}
            >
              <span className="text-sm leading-none">{l.flag}</span>
              <span className="flex-1">{l.name}</span>
              <span className="label-mono text-[9px] uppercase text-muted">{l.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
