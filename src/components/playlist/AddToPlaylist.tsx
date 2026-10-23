"use client";

import { useState } from "react";
import { Song } from "@/types/music";
import { usePlaylists } from "@/lib/history/playlists";
import { playlistText } from "@/lib/playlistText";
import { useLanguage } from "@/contexts/LanguageContext";

/** "+"-Knopf: Song zu einer Playlist hinzufügen oder in eine neue Playlist legen. */
export default function AddToPlaylist({ song, className = "" }: { song: Song; className?: string }) {
  const { lang } = useLanguage();
  const pt = playlistText(lang);
  const { lists, create, addSong, removeSong } = usePlaylists();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className={className || "shrink-0 p-1.5 text-muted transition-colors hover:text-accent"}
        aria-label={pt.addTo}
        aria-expanded={open}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h11M4 12h11M4 18h6M18 12v6m-3-3h6" />
        </svg>
      </button>
      {open && (
        <>
          <span className="fixed inset-0 z-[60]" onClick={(e) => { e.stopPropagation(); setOpen(false); }} aria-hidden="true" />
          <span
            className="fixed inset-x-3 bottom-3 z-[70] mx-auto flex w-auto max-w-sm flex-col gap-1 border border-accent/50 bg-background p-3 text-left shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="label-mono px-1 text-[10px] uppercase text-accent">{pt.addTo}</span>
            {lists.length === 0 && <span className="px-1 py-1 text-[11px] text-muted">{pt.noPl}</span>}
            <span className="flex max-h-44 flex-col overflow-y-auto">
              {lists.map((p) => {
                const has = p.songs.some((s) => s.id === song.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => (has ? removeSong(p.id, song.id) : addSong(p.id, song))}
                    className="flex items-center gap-2 px-1 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-surface"
                  >
                    <span className={"flex h-4 w-4 shrink-0 items-center justify-center border text-[10px] " + (has ? "border-accent bg-accent text-black" : "border-border")}>{has ? "✓" : ""}</span>
                    <span className="min-w-0 flex-1 truncate">{p.name}</span>
                  </button>
                );
              })}
            </span>
            <form
              className="mt-1 flex gap-1 border-t border-border pt-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!name.trim()) return;
                create(name, [song]);
                setName("");
                setOpen(false);
              }}
            >
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                placeholder={pt.namePh}
                className="min-w-0 flex-1 border border-border bg-transparent px-2 py-1 text-xs text-foreground outline-none focus:border-accent"
              />
              <button type="submit" className="shrink-0 border border-accent px-2 text-xs text-accent" aria-label={pt.create}>+</button>
            </form>
          </span>
        </>
      )}
    </span>
  );
}
