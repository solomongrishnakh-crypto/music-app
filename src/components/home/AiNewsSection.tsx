"use client";

import { useEffect, useState } from "react";
import Spinner from "@/components/ui/Spinner";

interface AiNewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  imageUrl: string;
  source: string;
  publishedAt: string;
  author: string;
  categories: string[];
}

const REFRESH_INTERVAL_MS = 10 * 60 * 1000; // 10 Minuten — deckt sich mit dem
// serverseitigen Cache in /api/ai-news (revalidate: 600), damit ein
// erneuter Abruf hier auch wirklich frischere Daten treffen kann.

function formatDate(iso: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

interface CardThumbnailProps {
  src: string;
  alt: string;
}

function CardThumbnail({ src, alt }: CardThumbnailProps) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) return null;
  return (
    <div className="h-24 w-24 shrink-0 overflow-hidden bg-surface-elevated sm:h-auto sm:w-full sm:aspect-[16/9]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

/**
 * KI-News direkt auf der Startseite, zum Auf-/Zuklappen (Nutzerwunsch
 * 18.09.2026, siehe frühere Änderung: "man sollte alles unter ai news sehen
 * mit home seite ... aufklappen ... zuklappen. nicht in eigenen seite.").
 *
 * Update 18.09.2026 ("news soll wie space news automatisch gelöscht und
 * durch neue erstetzt werden"): solange die Box aufgeklappt ist, wird alle
 * REFRESH_INTERVAL_MS neu von /api/ai-news geladen — der komplette
 * News-Zustand wird dabei durch die neue Antwort ERSETZT (kein Anhängen),
 * ältere Meldungen, die aus dem Feed rausgefallen sind, verschwinden also
 * automatisch, neue tauchen auf. Gleiches Prinzip wie SpaceNewsSection.tsx.
 * Beim Zuklappen wird der Timer gestoppt (kein unnötiger Hintergrund-
 * Traffic), beim erneuten Aufklappen wird sofort neu geladen statt alte,
 * evtl. veraltete Daten weiter anzuzeigen.
 *
 * item.author/item.categories kommen direkt aus /api/ai-news (RSS
 * dc:creator / category-Tags) — defensiv mit `?? ""` / `?? []` behandelt,
 * falls ein Artikel diese Felder mal nicht liefert.
 */
export default function AiNewsSection() {
  const [expanded, setExpanded] = useState(false);
  const [news, setNews] = useState<AiNewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!expanded) return;

    let cancelled = false;

    function fetchNews() {
      setIsLoading(true);
      fetch("/api/ai-news")
        .then((res) => res.json())
        .then((data) => {
          if (cancelled) return;
          if (data.error) {
            setErrorMessage(data.error);
          } else {
            setNews(data.news ?? []);
            setErrorMessage(null);
          }
        })
        .catch(() => {
          if (!cancelled) setErrorMessage("KI-News konnten nicht geladen werden.");
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    }

    fetchNews();
    const interval = setInterval(fetchNews, REFRESH_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [expanded]);

  function toggle() {
    setExpanded((prev) => !prev);
  }

  return (
    <div id="ai-news" className="mx-auto mt-20 w-full max-w-5xl scroll-mt-24 sm:mt-28">
      <div className="mb-10 border-b border-border pb-4">
        <p className="label-mono text-xs uppercase">// AI News</p>
      </div>

      <button
        onClick={toggle}
        aria-expanded={expanded}
        className="flex w-full flex-col items-stretch overflow-hidden border border-border bg-surface-elevated text-left transition-colors hover:border-accent sm:flex-row"
      >
        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-black sm:aspect-square sm:w-64">
          {/* Nutzerkorrektur 19.09.2026: "dieses titel bild ... sieht man auf
              handy kaum also nicht das gesamtes bild" — auf Handy wird das
              Bild jetzt komplett angezeigt (object-contain), statt es per
              object-cover anzuschneiden. Ab sm: wieder object-cover, da dort
              genug Fläche vorhanden ist. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/branding/consciousness.png"
            alt="Zwei Gestalten aus leuchtenden neuronalen Netzwerken berühren sich mit dem Finger"
            className="h-full w-full object-contain sm:object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col justify-center p-6 sm:p-10">
          <p className="font-display text-lg font-bold text-accent sm:text-2xl">
            Was gerade in der KI passiert
          </p>
          <p className="mt-3 max-w-xl text-xs leading-relaxed text-muted sm:text-sm">
            Aktuelle Schlagzeilen rund um künstliche Intelligenz — live
            geladen, keine erfundenen Meldungen.
          </p>
          <p className="label-mono mt-4 inline-flex items-center gap-2 text-xs uppercase text-foreground">
            {expanded ? "Einklappen" : "Alle News anzeigen"}
            <span aria-hidden className={`transition-transform ${expanded ? "rotate-180" : ""}`}>
              ▾
            </span>
          </p>
        </div>
      </button>

      <div
        className={`grid transition-all duration-500 ease-in-out ${
          expanded ? "mt-6 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          {isLoading && news.length === 0 && <Spinner />}

          {errorMessage && <p className="text-xs text-muted">{errorMessage}</p>}

          {news.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {news.map((item) => {
                const categories = item.categories ?? [];
                const author = item.author ?? "";
                return (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-row overflow-hidden border border-border bg-surface-elevated transition-colors hover:border-accent sm:flex-col"
                  >
                    <CardThumbnail src={item.imageUrl} alt={item.title} />
                    {/* Kompaktere Karte auf Handy (Nutzerkorrektur 19.09.2026:
                        "mach ki news klein es nimmt unnötige platz") — kleines
                        Vorschaubild links, Zusammenfassung/Kategorien nur ab
                        sm: sichtbar, damit auf dem Handy mehr News ohne
                        endloses Scrollen passen. */}
                    <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
                      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                        <p className="label-mono truncate text-[10px] uppercase text-accent">
                          // {item.source}
                          {author ? ` · ${author}` : ""}
                        </p>
                        <p className="label-mono hidden text-[10px] uppercase text-muted sm:block">
                          {formatDate(item.publishedAt)}
                        </p>
                      </div>
                      <h3 className="font-display mt-2 text-xs font-bold uppercase leading-snug text-foreground sm:mt-3 sm:text-base">
                        {item.title}
                      </h3>
                      {categories.length > 0 && (
                        <div className="mt-2 hidden flex-wrap gap-1.5 sm:flex">
                          {categories.map((cat) => (
                            <span
                              key={cat}
                              className="label-mono border border-border px-1.5 py-0.5 text-[9px] uppercase text-muted"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="mt-2 hidden flex-1 text-xs leading-relaxed text-muted sm:mt-3 sm:block sm:text-sm">
                        {item.summary}
                      </p>
                      <p className="label-mono mt-2 hidden items-center gap-2 text-xs uppercase text-foreground transition-colors group-hover:text-accent sm:mt-4 sm:inline-flex">
                        Artikel lesen ↗
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          )}

          {!isLoading && news.length === 0 && !errorMessage && (
            <p className="label-mono text-xs uppercase text-muted">
              // Aktuell keine News verfügbar
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
