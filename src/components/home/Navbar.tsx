"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

/**
 * Eigenes Menü — springt zu den jeweiligen Bereichen der Seite (statt
 * separater Unterseiten, damit weiterhin alles auf einer einzigen,
 * schnell ladenden Seite bleibt). Macht klar: Musik ist nur EIN Bereich
 * der Seite, kein reiner Musikplayer.
 */
export default function Navbar() {
  const { t } = useLanguage();
  const MENU_ITEMS = [
    { label: t("navMusic"), id: "musik" },
    { label: t("navAiNews"), id: "ai-news" },
    { label: t("navContacts"), id: "kontakte" },
  ];

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav className="mx-auto mb-8 flex w-full max-w-5xl items-center justify-center gap-2 sm:mb-10">
      <div className="glass-card flex items-center gap-1 px-2 py-1.5">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="label-mono px-3 py-1.5 text-[11px] uppercase tracking-wide text-muted transition-colors hover:text-accent"
          >
            {item.label}
          </button>
        ))}
      </div>
      <LanguageSwitcher />
    </nav>
  );
}
