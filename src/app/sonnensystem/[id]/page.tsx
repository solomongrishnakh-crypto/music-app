import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BodyView, { bodyMetadata } from "@/components/space/BodyView";
import { SPACE_BODIES, findBody } from "@/components/space/bodies";

/** Seite pro Himmelskörper (Deutsch), z. B. /sonnensystem/mars */
type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return SPACE_BODIES.map((b) => ({ id: b.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = findBody((await params).id);
  return b ? bodyMetadata(b, "de") : {};
}

export default async function BodyPage({ params }: Props) {
  const b = findBody((await params).id);
  if (!b) notFound();
  return <BodyView b={b} lang="de" />;
}
