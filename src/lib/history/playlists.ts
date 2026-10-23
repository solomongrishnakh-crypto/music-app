"use client";

import { useCallback, useEffect, useState } from "react";
import { Song } from "@/types/music";

const KEY = "nova-music:playlists";
const EVENT = "nova-playlists-changed";
const MAX_LISTS = 30;
const MAX_SONGS = 300;

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
  /** Gesetzt, wenn die Liste aus einer YouTube-Playlist importiert wurde. */
  yt?: string;
}

function load(): Playlist[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const p = raw ? JSON.parse(raw) : [];
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
}

function save(lists: Playlist[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(lists));
  } catch {
    // Speicher evtl. nicht verfügbar
  }
  window.dispatchEvent(new Event(EVENT));
}

const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);

/** Eigene Playlists — lokal im Browser (bzw. in der App) gespeichert. */
export function usePlaylists() {
  const [lists, setLists] = useState<Playlist[]>([]);

  useEffect(() => {
    const sync = () => setLists(load());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const create = useCallback((name: string, songs: Song[] = [], yt?: string): Playlist => {
    const pl: Playlist = { id: uid(), name: name.trim().slice(0, 60) || "Playlist", songs: songs.slice(0, MAX_SONGS), ...(yt ? { yt } : {}) };
    save([pl, ...load()].slice(0, MAX_LISTS));
    return pl;
  }, []);

  const update = useCallback((id: string, fn: (p: Playlist) => Playlist) => {
    save(load().map((p) => (p.id === id ? fn(p) : p)));
  }, []);

  const remove = useCallback((id: string) => save(load().filter((p) => p.id !== id)), []);

  const rename = useCallback((id: string, name: string) => update(id, (p) => ({ ...p, name: name.trim().slice(0, 60) || p.name })), [update]);

  const addSong = useCallback(
    (id: string, song: Song) =>
      update(id, (p) => (p.songs.some((s) => s.id === song.id) || p.songs.length >= MAX_SONGS ? p : { ...p, songs: [...p.songs, song] })),
    [update],
  );

  const removeSong = useCallback((id: string, songId: string) => update(id, (p) => ({ ...p, songs: p.songs.filter((s) => s.id !== songId) })), [update]);

  return { lists, create, remove, rename, addSong, removeSong };
}

/** Zieht die Listen-ID aus einem YouTube-Link (…?list=PL…). */
export function parseYoutubeListId(text: string): string | null {
  const m = text.trim().match(/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?(?:youtube\.com|youtu\.be)\/\S*[?&]list=([A-Za-z0-9_-]{10,60})/i);
  return m ? m[1] : null;
}

export function shuffled<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}
