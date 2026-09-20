"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Kleines Info-Symbol (ⓘ) statt sichtbarem Fließtext auf der Startseite
 * (Nutzerwunsch 20.09.2026: "tu diese kleine text mit hinweis alles in
 * einem kleinen info logo"). Beim Antippen/Klicken öffnet sich eine kleine
 * Box mit den Hinweisen; erneutes Antippen oder ein Klick daneben schließt
 * sie wieder.
 */
export default function InfoHint({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("infoHintAriaLabel")}
        aria-expanded={open}
        className="flex h-5 w-5 items-center justify-center rounded-full border border-border text-[11px] text-muted transition-colors hover:border-accent hover:text-accent"
      >
        i
      </button>

      {open && (
        <>
          {/* Unsichtbare Fläche, die die Box beim Klick daneben schließt. */}
          <span
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <span className="absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 space-y-2 border border-border bg-background/95 p-3 text-left text-[11px] leading-relaxed text-muted shadow-lg backdrop-blur-sm sm:w-72">
            {children}
          </span>
        </>
      )}
    </span>
  );
}
