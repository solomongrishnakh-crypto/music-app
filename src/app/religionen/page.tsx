import { MapView, mapMetadata } from "@/components/religion/ReligionViews";

/** Religionskarte (Deutsch). Andere Sprachen: /[lang]/religionen */
export const metadata = mapMetadata("de");

export default function ReligionenPage() {
  return <MapView lang="de" />;
}
