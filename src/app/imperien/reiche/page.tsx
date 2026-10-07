import ReicheIndexView, { reicheMetadata } from "@/components/reiche/ReicheIndexView";

/** Übersicht aller Reiche (Deutsch). Andere Sprachen: /[lang]/imperien/reiche */
export const metadata = reicheMetadata("de");

export default function ReichePage() {
  return <ReicheIndexView lang="de" />;
}
