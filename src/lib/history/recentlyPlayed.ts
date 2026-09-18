import { Song } from "@/types/music";

const STORAGE_KEY = "nova-music:recently-played";
const MAX_ENTRIES = 20;

/**
 * Speichert den Wiedergabeverlauf lokal im Browser (localStorage) des
 * jeweiligen Besuchers. Kein Server-Speicher nötig, funktioniert ohne
 * Login — beim nächsten Besuch im selben Browser ist der Verlauf wieder da.
 */
export function loadRecentlyPlayed(): Song[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function addToRecentlyPlayed(song: Song): Song[] {
  const current = loadRecentlyPlayed().filter((s) => s.id !== song.id);
  const updated = [song, ...current].slice(0, MAX_ENTRIES);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage evtl. nicht verfügbar (Privatmodus etc.) — Verlauf wird
    // dann einfach nicht dauerhaft gespeichert, App bleibt aber funktional.
  }
  return updated;
}
