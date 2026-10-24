"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import TunnelBackground from "@/components/particles/TunnelBackground";
import SearchBar from "@/components/search/SearchBar";
import SearchResults from "@/components/search/SearchResults";
import { usePlayer } from "@/contexts/PlayerContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { langPath, type PrefixedLang } from "@/lib/seoI18n";
import { MUSIC_TEXT } from "@/lib/musicPageText";
import type { Song } from "@/types/music";

const APK_URL = "https://github.com/solomongrishnakh-crypto/music-app/releases/download/app-latest/Centaurian-web.apk";
const RTL = new Set(["ar", "fa"]);

/** Musik-Seite: Suchleiste nur für Musik, Player unten (globaler Player), Hinweis auf die App. */
export default function MusicClient({ lang }: { lang: "de" | PrefixedLang }) {
  const T = MUSIC_TEXT[lang] ?? MUSIC_TEXT.en;
  const player = usePlayer();
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const reqRef = useRef(0);

  useEffect(() => {
    if (results.length > 0) player.setQueue(results);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  async function handleSearch(q: string) {
    setQuery(q);
    const id = ++reqRef.current;
    if (!q.trim()) {
      setResults([]);
      setErr(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (id !== reqRef.current) return;
      if (!res.ok) {
        setErr(data.error ?? t("searchFailed"));
        setResults([]);
      } else setResults(data.songs ?? []);
    } catch {
      if (id !== reqRef.current) return;
      setErr(t("searchFailedConn"));
      setResults([]);
    } finally {
      if (id === reqRef.current) setLoading(false);
    }
  }

  return (
    <main lang={lang} dir={RTL.has(lang) ? "rtl" : "ltr"} className="relative min-h-screen">
      <div className="fixed inset-x-0 top-0 -z-10 h-[100lvh] overflow-hidden bg-background"><TunnelBackground /></div>
      <div className="mx-auto w-full max-w-3xl px-4 pb-28 pt-6 sm:px-6">
        <nav className="label-mono mb-6 text-xs uppercase text-muted">
          <Link href={langPath("/", lang)} className="hover:text-accent">← {T.back}</Link>
        </nav>

        <header className="relative">
          <p className="label-mono text-xs uppercase tracking-[0.3em] text-accent">{T.tag}</p>
          <h1 className="mt-3 font-display text-3xl font-bold uppercase leading-tight tracking-wide text-foreground sm:text-5xl">{T.title}</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground/85 sm:text-base">{T.sub}</p>
        </header>

        <div className="mt-8">
          <SearchBar onSearch={handleSearch} placeholder={T.ph} ariaLabel={T.ph} />
          {!query.trim() && <p className="label-mono mt-3 text-[11px] leading-relaxed text-muted">{T.hint}</p>}
        </div>

        {query.trim() && (
          <SearchResults
            songs={results}
            query={query}
            isLoading={loading}
            errorMessage={err}
            onPlay={(s) => player.play(s, results.length > 0 ? results : undefined)}
            activeSongId={player.currentSong?.id}
            isFavorite={player.isFavorite}
            onToggleFavorite={player.toggleFavorite}
          />
        )}

        <section className="hud-card relative mt-10 overflow-hidden border border-accent/40 p-5 sm:p-7" aria-labelledby="music-app-h">
          <div className="app-orbit" aria-hidden="true"><i /><i /><i /></div>
          <h2 id="music-app-h" className="relative font-display text-xl font-bold text-foreground sm:text-2xl">{T.appH}</h2>
          <p className="relative mt-3 max-w-xl text-sm leading-relaxed text-foreground/85">{T.appP}</p>
          <div className="relative mt-5 flex flex-wrap items-center gap-3">
            <a
              href={APK_URL}
              rel="noopener"
              className="inline-flex items-center gap-2 border border-accent bg-accent px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-black transition-opacity hover:opacity-90"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} className="h-4 w-4" aria-hidden="true">
                <path d="M12 5v10m0 0-4-4m4 4 4-4M6 19h12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {T.appBtn}
            </a>
            <Link href={langPath("/app", lang)} className="label-mono border border-border px-4 py-2.5 text-xs uppercase text-foreground transition-colors hover:border-accent hover:text-accent">
              {T.appMore} →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
