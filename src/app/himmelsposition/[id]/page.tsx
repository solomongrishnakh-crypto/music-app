import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SkyPosView, { skyPosMetadata } from "@/components/space/SkyPosView";
import { SKY_ENTRIES, findSkyEntry } from "@/lib/skyPosData";

/** "Wo steht … am Himmel?" pro Objekt (Deutsch), z. B. /himmelsposition/voyager1 */
type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;
// Positionen von Planeten und Sonden stündlich neu berechnen
export const revalidate = 3600;

export function generateStaticParams() {
  return SKY_ENTRIES.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = findSkyEntry((await params).id);
  return e ? skyPosMetadata(e, "de") : {};
}

export default async function SkyPosPage({ params }: Props) {
  const e = findSkyEntry((await params).id);
  if (!e) notFound();
  return <SkyPosView e={e} lang="de" />;
}
