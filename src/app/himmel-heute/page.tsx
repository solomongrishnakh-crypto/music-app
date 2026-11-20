import SkyTodayView, { skyTodayMetadata } from "@/components/space/SkyTodayView";

/** Himmel heute (Deutsch). Andere Sprachen: /[lang]/himmel-heute. Täglich neu erzeugt. */
export const revalidate = 86400;
export const metadata = skyTodayMetadata("de");

export default function HimmelHeutePage() {
  return <SkyTodayView lang="de" />;
}
