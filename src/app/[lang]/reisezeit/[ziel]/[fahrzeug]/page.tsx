import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TravelView, { travelMetadata } from "@/components/space/TravelView";
import { DESTS, VEHICLES, isDest, isVehicle } from "@/lib/travelTime";
import { isPrefixedLang } from "@/lib/seoI18n";

type Props = { params: Promise<{ lang: string; ziel: string; fahrzeug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return DESTS.flatMap((ziel) => VEHICLES.map((fahrzeug) => ({ ziel, fahrzeug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, ziel, fahrzeug } = await params;
  return isPrefixedLang(lang) && isDest(ziel) && isVehicle(fahrzeug) ? travelMetadata(ziel, fahrzeug, lang) : {};
}

export default async function LangReisezeitPage({ params }: Props) {
  const { lang, ziel, fahrzeug } = await params;
  if (!isPrefixedLang(lang) || !isDest(ziel) || !isVehicle(fahrzeug)) notFound();
  return <TravelView d={ziel} v={fahrzeug} lang={lang} />;
}
