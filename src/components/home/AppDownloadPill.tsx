"use client";

import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Kleiner "App herunterladen"-Knopf unter "Understand The Universe"
 * (Nutzerwunsch 03.10.2026: "in der Mitte, kleiner, kompakter, moderner").
 * Scrollt weich zur Download-Kachel bei den Kontakten und lässt sie kurz
 * aufleuchten.
 */
export default function AppDownloadPill() {
  const { t } = useLanguage();
  const go = () => {
    const el = document.getElementById("app-download");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.remove("dl-flash");
    window.setTimeout(() => el.classList.add("dl-flash"), 600);
    window.setTimeout(() => el.classList.remove("dl-flash"), 2600);
  };
  return (
    <div className="mb-12 flex justify-center sm:mb-16">
      <button type="button" onClick={go} className="dl-pill group">
        <span className="dl-pill-ico" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}>
            <path d="M12 5v10m0 0-4-4m4 4 4-4M6 19h12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>{t("appTopBtn")}</span>
        <span className="dl-pill-meta">APK</span>
      </button>
    </div>
  );
}
