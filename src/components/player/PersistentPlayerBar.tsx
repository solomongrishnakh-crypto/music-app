"use client";

import YoutubePlayer from "@/components/player/YoutubePlayer";
import { usePlayer } from "@/contexts/PlayerContext";

/**
 * Verbindet den global im Root-Layout gemounteten YouTube-Player mit dem
 * PlayerContext — dadurch bleibt die Musik über Seitenwechsel hinweg
 * bestehen (Nutzerwunsch 18.09.2026, siehe PlayerContext.tsx).
 */
export default function PersistentPlayerBar() {
  const player = usePlayer();

  return (
    <YoutubePlayer
      song={player.currentSong}
      onEnded={player.next}
      onClose={player.close}
      onPlayingChange={player.setIsPlaying}
      onNext={player.next}
      onPrevious={player.previous}
      hasPrevious={player.hasPrevious}
    />
  );
}
