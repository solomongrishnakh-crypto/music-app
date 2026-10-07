import { ConstIndexView, constIndexMetadata } from "@/components/space/ConstView";

/** Alle 88 Sternbilder (Deutsch). Andere Sprachen: /[lang]/sternbilder */
export const metadata = constIndexMetadata("de");

export default function SternbilderPage() {
  return <ConstIndexView lang="de" />;
}
