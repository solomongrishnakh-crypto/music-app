import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ConstView, { CONSTELLATIONS, constMetadata, findConst } from "@/components/space/ConstView";

/** Seite pro Sternbild (Deutsch), z. B. /sternbilder/orion */
type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return CONSTELLATIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = findConst((await params).slug);
  return c ? constMetadata(c, "de") : {};
}

export default async function SternbildPage({ params }: Props) {
  const c = findConst((await params).slug);
  if (!c) notFound();
  return <ConstView c={c} lang="de" />;
}
