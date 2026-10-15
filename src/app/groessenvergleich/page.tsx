import SizeView, { sizeMetadata } from "@/components/space/SizeView";

/** Größenvergleich (Deutsch). Andere Sprachen: /[lang]/groessenvergleich */
export const metadata = sizeMetadata("de");

export default function GroessenvergleichPage() {
  return <SizeView lang="de" />;
}
