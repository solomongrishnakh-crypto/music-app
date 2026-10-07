import SolarIndexView, { solarMetadata } from "@/components/space/SolarIndexView";

/** Übersicht Sonnensystem (Deutsch). Andere Sprachen: /[lang]/sonnensystem */
export const metadata = solarMetadata("de");

export default function SonnensystemPage() {
  return <SolarIndexView lang="de" />;
}
