import MusicView, { musicMetadata } from "@/components/MusicView";

export const metadata = musicMetadata("de");

export default function MusikPage() {
  return <MusicView lang="de" />;
}
