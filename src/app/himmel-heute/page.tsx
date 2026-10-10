import SkyTodayView, { skyTodayMetadata } from "@/components/space/SkyTodayView";

/** Himmel heute (Deutsch). Andere Sprachen: /[lang]/himmel-heute. Stündlich neu erzeugt. */
export const revalidate = 3600;
export const metadata = skyTodayMetadata("de");

export default function HimmelHeutePage() {
  return <SkyTodayView lang="de" />;
}
