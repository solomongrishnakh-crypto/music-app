import { Song } from "@/types/music";

const STORAGE_KEY = "nova-music:favorites";
const MAX_ENTRIES = 50;

/**
 * "Gemerkte" Songs (Favoriten) — lokal im Browser des Besuchers gespeichert.
 * Unabhängig vom Wiedergabeverlauf: hier landet ein Song nur, wenn der
 * Nutzer ihn aktiv per Bookmark-Icon merkt.
 */
export function loadFavorites(): Song[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites: Song[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // localStorage evtl. nicht verfügbar — Favoriten dann nicht dauerhaft
  }
}

export function isFavorite(favorites: Song[], songId: string): boolean {
  return favorites.some((s) => s.id === songId);
}

/** Schaltet den Favoriten-Status eines Songs um und gibt die neue Liste zurück. */
export function toggleFavorite(favorites: Song[], song: Song): Song[] {
  const exists = isFavorite(favorites, song.id);
  const updated = exists
    ? favorites.filter((s) => s.id !== song.id)
    : [song, ...favorites].slice(0, MAX_ENTRIES);
  saveFavorites(updated);
  return updated;
}
