"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Kleiner "App herunterladen"-Knopf unter "Understand The Universe"
 * (Nutzerwunsch 03.10.2026: "in der Mitte, kleiner, kompakter, moderner";
 * danach: Download-Kachel unten weg, der Knopf lädt die APK direkt).
 * Android-App = TWA, öffnet diese Webseite im Vollbild. Keystore bleibt privat.
 *
 * 22.10.2026: Vor dem Download erscheint ein Hinweis-Fenster: keine echte App
 * aus dem Play Store, sondern die Webseite im App-Gewand (Nutzerwunsch).
 */
const TXT: Record<string, { title: string; lines: string[]; ok: string; cancel: string }> = {
  de: {
    title: "Das ist keine echte App",
    lines: [
      "Die Android-Datei ist nur ein Rahmen, der diese Webseite im Vollbild öffnet. Alles läuft weiter über das Internet, genau wie im Browser. Die Seite funktioniert genauso ohne Download.",
      "Sie kommt nicht aus dem Play Store. Android fragt deshalb eventuell, ob du Apps aus dieser Quelle installieren willst. Das musst du dann erlauben.",
      "Die Datei ist ca. 4 MB groß und nur für Android.",
    ],
    ok: "Trotzdem herunterladen",
    cancel: "Abbrechen",
  },
  en: {
    title: "This is not a real app",
    lines: [
      "The Android file is just a frame that opens this website in full screen. Everything still runs over the internet, exactly like in the browser. The site works the same without the download.",
      "It does not come from the Play Store. Android may therefore ask whether you want to allow installing apps from this source. You will need to allow that.",
      "The file is about 4 MB and Android only.",
    ],
    ok: "Download anyway",
    cancel: "Cancel",
  },
  fa: {
    title: "این یک اپلیکیشن واقعی نیست",
    lines: [
      "این فایل اندروید فقط یک قاب است که همین وب‌سایت را تمام‌صفحه باز می‌کند. همه‌چیز مثل مرورگر از طریق اینترنت اجرا می‌شود. سایت بدون دانلود هم دقیقاً همین‌طور کار می‌کند.",
      "این فایل از گوگل‌پلی نیست. ممکن است اندروید بپرسد که نصب برنامه از این منبع را اجازه می‌دهید یا نه؛ باید اجازه بدهید.",
      "حجم فایل حدود ۴ مگابایت است و فقط برای اندروید.",
    ],
    ok: "با این حال دانلود کن",
    cancel: "لغو",
  },
};

export default function AppDownloadPill() {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const okRef = useRef<HTMLAnchorElement>(null);
  const x = TXT[lang] ?? TXT.en;

  useEffect(() => {
    if (!open) return;
    okRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="mb-12 flex justify-center sm:mb-16">
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={t("appTopBtn") + " · Android · 4 MB"}
        className="dl-pill group cursor-pointer"
      >
        <span className="dl-pill-ico" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}>
            <path d="M12 5v10m0 0-4-4m4 4 4-4M6 19h12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>{t("appTopBtn")}</span>
        <span className="dl-pill-meta">APK</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="apk-title"
          dir={lang === "fa" || lang === "ar" ? "rtl" : "ltr"}
          className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="w-full max-w-md border border-accent/50 bg-[#05071a] p-5 shadow-[0_0_40px_-10px_var(--accent)] sm:p-6">
            <h2 id="apk-title" className="font-display text-xl font-bold text-foreground">{x.title}</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/85">
              {x.lines.map((l, i) => <p key={i}>{l}</p>)}
            </div>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="border border-border px-4 py-2.5 text-sm uppercase tracking-wide text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                {x.cancel}
              </button>
              <a
                ref={okRef}
                href="/download/Centaurian.apk"
                download="Centaurian.apk"
                type="application/vnd.android.package-archive"
                onClick={() => setTimeout(() => setOpen(false), 400)}
                className="border border-accent bg-accent/10 px-4 py-2.5 text-sm uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-black"
              >
                {x.ok}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
