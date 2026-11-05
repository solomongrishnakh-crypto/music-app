import { SkyPosIndexView, skyPosIndexMetadata } from "@/components/space/SkyPosView";

/** Übersicht "Wo steht es am Himmel?" (Deutsch). Andere Sprachen: /[lang]/himmelsposition */
export const metadata = skyPosIndexMetadata("de");

export default function HimmelspositionPage() {
  return <SkyPosIndexView lang="de" />;
}
