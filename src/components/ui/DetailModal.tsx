"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DetailModalProps {
  eyebrow: string;
  title: string;
  meta?: string;
  paragraphs: string[];
  imageUrl?: string;
  imageAlt?: string;
  imageCredit?: string;
  onClose: () => void;
}

/**
 * Vollbild-Detailansicht für ein angeklicktes Fakten-Element (Universum
 * oder Imperium) — zeigt einen längeren, ausführlicheren Info-Text im
 * gleichen futuristischen Monospace-Stil.
 */
export default function DetailModal({
  eyebrow,
  title,
  meta,
  paragraphs,
  imageUrl,
  imageAlt,
  imageCredit,
  onClose,
}: DetailModalProps) {
  const { t } = useLanguage();
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <div
        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto border border-border bg-background/95 p-6 sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center border border-border text-muted transition-colors hover:border-accent hover:text-accent"
          aria-label={t("close")}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <p className="label-mono mb-2 text-xs uppercase">{eyebrow}</p>
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-4">
          <h3 className="font-display text-xl font-bold uppercase tracking-tight text-foreground sm:text-2xl">
            {title}
          </h3>
          {meta && (
            <p className="label-mono text-xs uppercase text-muted">{meta}</p>
          )}
        </div>

        {imageUrl && !imageFailed && (
          <div className="mb-6 overflow-hidden border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={imageAlt ?? title}
              className="aspect-video w-full object-cover"
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
            {imageCredit && (
              <p className="border-t border-border bg-surface px-3 py-1.5 text-[10px] text-muted">
                {imageCredit}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-muted sm:text-[15px]">
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
