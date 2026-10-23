"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Kleiner "App herunterladen"-Knopf unter "Understand The Universe".
 * Führt auf die Download-Seite /app (Funktionen, Installation, Berechtigungen,
 * Sicherheit) — dort liegt der eigentliche Download (Nutzerwunsch 23.10.2026).
 */
export default function AppDownloadPill() {
  const { t, localePath } = useLanguage();
  return (
    <div className="mb-12 flex justify-center sm:mb-16">
      <Link href={localePath("/app")} title={t("appTopBtn") + " · Android"} className="dl-pill group cursor-pointer">
        <span className="dl-pill-ico" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}>
            <path d="M12 5v10m0 0-4-4m4 4 4-4M6 19h12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>{t("appTopBtn")}</span>
        <span className="dl-pill-meta">APK</span>
      </Link>
    </div>
  );
}
