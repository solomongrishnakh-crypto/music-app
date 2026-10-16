import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TravelView, { travelMetadata } from "@/components/space/TravelView";
import { DESTS, VEHICLES, isDest, isVehicle } from "@/lib/travelTime";

/** Reisezeit-Seite (Deutsch), z. B. /reisezeit/saturn/auto */
type Props = { params: Promise<{ ziel: string; fahrzeug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return DESTS.flatMap((ziel) => VEHICLES.map((fahrzeug) => ({ ziel, fahrzeug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ziel, fahrzeug } = await params;
  return isDest(ziel) && isVehicle(fahrzeug) ? travelMetadata(ziel, fahrzeug, "de") : {};
}

export default async function ReisezeitPage({ params }: Props) {
  const { ziel, fahrzeug } = await params;
  if (!isDest(ziel) || !isVehicle(fahrzeug)) notFound();
  return <TravelView d={ziel} v={fahrzeug} lang="de" />;
}
