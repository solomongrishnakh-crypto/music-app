"use client";

import { useEffect, useState } from "react";
import { Song } from "@/types/music";
import SongCover from "@/components/ui/SongCover";
import { parseYoutubeListId, shuffled, usePlaylists, type Playlist } from "@/lib/history/playlists";
import { playlistText } from "@/lib/playlistText";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  favorites: Song[];
  activeSongId?: string;
  onPlay: (songs: Song[], start: number) => void;
  /** Wird gesetzt, wenn in der Suchleiste ein YouTube-Playlist-Link eingefügt wurde. */
  importRequest: { id: string; n: number } | null;
}

/** Playlists unter der Suchleiste — wie bei YouTube als Reihe von Karten. */
export default function PlaylistsSection({ favorites, activeSongId, onPlay, importRequest }: Props) {
  const { lang, t } = useLanguage();
  const pt = playlistText(lang);
  const { lists, create, remove, rename, addSong, removeSong } = usePlaylists();
  const [mode, setMode] = useState<"" | "new" | "yt">("");
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [confirmDel, setConfirmDel] = useState(false);

  async function doImport(listId: string) {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch(`/api/playlist?list=${encodeURIComponent(listId)}`);
      const d = await res.json();
      if (!res.ok || !Array.isArray(d.songs)) throw new Error("x");
      const pl = create(d.name || "YouTube", d.songs as Song[], listId);
      setMode("");
      setLink("");
      setOpenId(pl.id);
    } catch {
      setErr(pt.failed);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (importRequest) {
      setMode("yt");
      setLink("");
      doImport(importRequest.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importRequest?.n]);

  const open: Playlist | undefined = lists.find((p) => p.id === openId);
  useEffect(() => {
    if (!open) return;
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenId(null);
    }
    window.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", key);
      document.body.style.overflow = "";
    };
  }, [open]);

  const chip = "label-mono flex shrink-0 items-center gap-1.5 border border-border px-3 py-1.5 text-[11px] uppercase tracking-wide text-foreground transition-colors hover:border-accent hover:text-accent";

  return (
    <section className="mx-auto mt-6 w-full max-w-2xl" aria-label={pt.title}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="label-mono text-xs uppercase">{pt.title}</h2>
        <div className="flex gap-2">
          <button type="button" className={chip} onClick={() => { setMode(mode === "new" ? "" : "new"); setErr(""); }}>+ {pt.newPl}</button>
          <button type="button" className={chip} onClick={() => { setMode(mode === "yt" ? "" : "yt"); setErr(""); }}>▶ {pt.importYt}</button>
        </div>
      </div>

      {mode === "new" && (
        <form
          className="mb-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            const pl = create(name);
            setName("");
            setMode("");
            setOpenId(pl.id);
          }}
        >
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder={pt.namePh} autoFocus className="min-w-0 flex-1 border border-border bg-transparent px-3 py-2 text-sm text-foreground outline-none focus:border-accent" />
          <button type="submit" className="shrink-0 border border-accent px-4 text-xs uppercase text-accent">{pt.create}</button>
        </form>
      )}

      {mode === "yt" && (
        <form
          className="mb-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const id = parseYoutubeListId(link);
            if (!id) return setErr(pt.badLink);
            doImport(id);
          }}
        >
          <input value={link} onChange={(e) => { setLink(e.target.value); setErr(""); }} placeholder={pt.linkPh} autoFocus inputMode="url" className="min-w-0 flex-1 border border-border bg-transparent px-3 py-2 text-sm text-foreground outline-none focus:border-accent" />
          <button type="submit" disabled={busy} className="shrink-0 border border-accent px-4 text-xs uppercase text-accent disabled:opacity-50">{busy ? pt.loading : pt.importBtn}</button>
        </form>
      )}
      {mode !== "" && busy && !link && <p className="mb-2 text-xs text-muted">{pt.loading}</p>}
      {err && <p className="mb-2 text-xs text-accent">{err}</p>}

      {lists.length > 0 && (
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {lists.map((p) => (
            <div key={p.id} className="group w-36 shrink-0 sm:w-40">
              <button type="button" onClick={() => { setOpenId(p.id); setConfirmDel(false); }} className="relative block w-full text-left" aria-label={p.name}>
                {/* Gestapelte Ränder wie bei YouTube-Playlists */}
                <span className="absolute inset-x-3 -top-1.5 h-1.5 bg-foreground/15" aria-hidden="true" />
                <span className="absolute inset-x-1.5 -top-0.5 h-1 bg-foreground/25" aria-hidden="true" />
                <span className="relative block aspect-video w-full overflow-hidden border border-border bg-surface-elevated">
                  {p.songs[0] ? (
                    <SongCover alt={p.name} className="absolute inset-0 transition-transform duration-500 group-hover:scale-110" sizes="160px" coverUrl={p.songs[0].coverUrl} />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-2xl text-muted">♪</span>
                  )}
                  <span className="absolute inset-y-0 right-0 flex w-1/3 flex-col items-center justify-center gap-1 bg-black/70 text-white backdrop-blur-sm">
                    <span className="text-sm font-bold">{p.songs.length}</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M4 6h11M4 12h11M4 18h6M16 14l5 3-5 3z" /></svg>
                  </span>
                </span>
                <span className="mt-2 block truncate text-xs font-medium uppercase text-foreground">{p.name}</span>
                <span className="block text-[11px] text-muted">{p.songs.length} {pt.songs}{p.yt ? " · YouTube" : ""}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-8" onClick={() => setOpenId(null)}>
          <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden border border-border bg-background/95" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 border-b border-border px-4 py-3 sm:px-8">
              <button onClick={() => setOpenId(null)} className="label-mono flex shrink-0 items-center gap-1.5 border border-border px-3 py-1.5 text-xs uppercase text-foreground transition-colors hover:border-accent hover:text-accent" aria-label={t("back")}>
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                {t("back")}
              </button>
              <input
                key={open.id + open.name}
                defaultValue={open.name}
                maxLength={60}
                onBlur={(e) => rename(open.id, e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                className="min-w-0 flex-1 bg-transparent text-sm font-bold uppercase text-foreground outline-none focus:border-b focus:border-accent"
                aria-label={pt.namePh}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3 sm:px-8">
              <button disabled={open.songs.length === 0} onClick={() => { onPlay(open.songs, 0); setOpenId(null); }} className="flex items-center gap-1.5 border border-accent bg-accent px-3 py-1.5 text-[11px] font-bold uppercase text-black disabled:opacity-40">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>{pt.playAll}
              </button>
              <button disabled={open.songs.length === 0} onClick={() => { onPlay(shuffled(open.songs), 0); setOpenId(null); }} className={chip + " disabled:opacity-40"}>
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" /></svg>{pt.shuffle}
              </button>
              <span className="flex-1" />
              <span className="text-[11px] text-muted">{open.songs.length} {pt.songs}</span>
              {confirmDel ? (
                <button onClick={() => { remove(open.id); setOpenId(null); setConfirmDel(false); }} className="border border-accent px-3 py-1.5 text-[11px] uppercase text-accent">{pt.delSure}</button>
              ) : (
                <button onClick={() => setConfirmDel(true)} className="p-1.5 text-muted transition-colors hover:text-accent" aria-label={pt.del}>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>
                </button>
              )}
            </div>

            <div className="flex flex-col divide-y divide-border overflow-y-auto">
              {open.songs.length === 0 && <p className="px-4 py-6 text-xs leading-relaxed text-muted sm:px-8">{pt.emptyPl}</p>}
              {open.songs.map((song, i) => (
                <div key={song.id} className={"flex items-center gap-3 py-2 pl-4 pr-2 sm:pl-8 " + (song.id === activeSongId ? "bg-surface" : "hover:bg-surface")}>
                  <span className="w-5 shrink-0 text-center text-[10px] text-muted">{i + 1}</span>
                  <button onClick={() => { onPlay(open.songs, i); setOpenId(null); }} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-label={song.title}>
                    <SongCover alt={song.title} className="relative h-9 w-9 shrink-0" sizes="36px" coverUrl={song.coverUrl} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-medium uppercase text-foreground">{song.title}</span>
                      <span className="block truncate text-[11px] text-muted">{song.artist}</span>
                    </span>
                  </button>
                  <button onClick={() => removeSong(open.id, song.id)} className="shrink-0 p-1.5 text-muted transition-colors hover:text-accent" aria-label={pt.remove}>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" /></svg>
                  </button>
                </div>
              ))}

              {favorites.filter((f) => !open.songs.some((s) => s.id === f.id)).length > 0 && (
                <div className="px-4 py-3 sm:px-8">
                  <p className="label-mono mb-2 text-[10px] uppercase text-accent">{pt.addSaved}</p>
                  {favorites.filter((f) => !open.songs.some((s) => s.id === f.id)).slice(0, 20).map((song) => (
                    <button key={song.id} onClick={() => addSong(open.id, song)} className="flex w-full items-center gap-3 py-1.5 text-left transition-colors hover:bg-surface">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-border text-sm text-accent">+</span>
                      <span className="min-w-0 flex-1 truncate text-xs text-foreground">{song.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

