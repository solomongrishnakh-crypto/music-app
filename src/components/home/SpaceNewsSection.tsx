"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import Spinner from "@/components/ui/Spinner";

interface SpaceNewsArticle {
  id: number;
  title: string;
  summary: string;
  url: string;
  imageUrl: string;
  newsSite: string;
  publishedAt: string;
  authors: string[];
  launch: string | null;
  event: string | null;
}

interface RevealCardProps {
  children: (inView: boolean) => ReactNode;
  className?: string;
  onClick?: () => void;
}

function RevealCard({ children, className, onClick }: RevealCardProps) {
  const { ref, inView } = useInView<HTMLButtonElement>();
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`group text-left transition-colors ${className ?? ""}`}
    >
      {children(inView)}
    </button>
  );
}

interface CardThumbnailProps {
  src: string;
  alt: string;
}

/** Kleines Vorschaubild oben in der Karte — blendet sich unsichtbar aus,
 * falls ein Bild mal nicht lädt, statt kaputt auszusehen. */
function CardThumbnail({ src, alt }: CardThumbnailProps) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) return null;
  return (
    <div className="-mx-3 -mt-3 mb-2 aspect-[4/3] overflow-hidden bg-surface-elevated">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover opacity-85 transition-opacity group-hover:opacity-100"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function formatDate(iso: string): string {
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

/**
 * Space-News-Sektion — echte Live-News über die Spaceflight News API
 * (aktuelle Artikel von echten Raumfahrt-Nachrichtenseiten, kein
 * statischer/erfundener Inhalt). Kleine, kompakte Kachel-Boxen.
 */
export default function SpaceNewsSection() {
  const [news, setNews] = useState<SpaceNewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/space-news")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setErrorMessage(data.error);
        } else {
          setNews(data.news ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) setErrorMessage("Space News konnten nicht geladen werden.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!isLoading && news.length === 0 && !errorMessage) return null;

  return (
    <div className="mx-auto mt-20 w-full max-w-5xl sm:mt-28">
      <div className="mb-10 flex items-end justify-between border-b border-border pb-4">
        <p className="label-mono text-xs uppercase">// Space News</p>
        <p className="label-mono text-[10px] uppercase text-muted">Live</p>
      </div>

      {isLoading && <Spinner />}

      {errorMessage && (
        <p className="text-xs text-muted">{errorMessage}</p>
      )}

      {!isLoading && news.length > 0 && (
        <div className="grid grid-cols-4 gap-px bg-border sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-9">
          {news.map((item, i) => (
            <RevealCard
              key={item.id}
              className="glass-card p-2"
              onClick={() => setSelected(i)}
            >
              {() => (
                <>
                  <CardThumbnail src={item.imageUrl} alt={item.title} />
                  <p className="label-mono text-[7px] uppercase text-muted">
                    {formatDate(item.publishedAt)}
                  </p>
                  <p className="mt-1 line-clamp-3 min-h-[2.6em] text-[9px] font-semibold uppercase leading-snug tracking-wide text-foreground">
                    {item.title}
                  </p>
                </>
              )}
            </RevealCard>
          ))}
        </div>
      )}

      {selected !== null && news[selected] && (
        <NewsDetailModal
          article={news[selected]}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

interface NewsDetailModalProps {
  article: SpaceNewsArticle;
  onClose: () => void;
}

/** Eigenes, reichhaltigeres Detail-Fenster für News — mit echtem klickbarem
 * Artikel-Link, Autoren und Quelle, statt eines reinen Textblocks. */
function NewsDetailModal({ article, onClose }: NewsDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto border border-border bg-background p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Schließen"
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center border border-border text-muted transition-colors hover:border-accent hover:text-accent"
        >
          ✕
        </button>

        {article.imageUrl && (
          <div className="-mx-6 -mt-6 mb-4 aspect-[16/9] overflow-hidden bg-surface-elevated">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.imageUrl}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <p className="label-mono text-xs uppercase text-accent">
          // {article.newsSite}
        </p>
        <h3 className="font-display mt-2 text-base font-bold uppercase leading-snug text-foreground sm:text-lg">
          {article.title}
        </h3>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] uppercase tracking-wide text-muted">
          <span>{formatDate(article.publishedAt)}</span>
          {article.authors.length > 0 && (
            <span>Von {article.authors.join(", ")}</span>
          )}
          {article.launch && <span>Mission: {article.launch}</span>}
          {article.event && <span>Event: {article.event}</span>}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted">
          {article.summary}
        </p>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="label-mono mt-6 inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          Artikel lesen ↗
        </a>
      </div>
    </div>
  );
}
