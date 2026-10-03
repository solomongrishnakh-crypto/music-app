"use client";

import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Kleiner "App herunterladen"-Knopf unter "Understand The Universe"
 * (Nutzerwunsch 03.10.2026: "in der Mitte, kleiner, kompakter, moderner";
 * danach: Download-Kachel unten weg, der Knopf lädt die APK direkt).
 * Android-App = TWA, öffnet diese Webseite im Vollbild. Keystore bleibt privat.
 */
export default function AppDownloadPill() {
  const { t } = useLanguage();
  return (
    <div className="mb-12 flex justify-center sm:mb-16">
      <a
        href="/download/Centaurian.apk"
        download="Centaurian.apk"
        type="application/vnd.android.package-archive"
        title={t("appTopBtn") + " · Android · 4 MB"}
        className="dl-pill group"
      >
        <span className="dl-pill-ico" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}>
            <path d="M12 5v10m0 0-4-4m4 4 4-4M6 19h12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>{t("appTopBtn")}</span>
        <span className="dl-pill-meta">APK</span>
      </a>
    </div>
  );
}
