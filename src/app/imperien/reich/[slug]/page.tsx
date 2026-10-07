import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReichView, { reichMetadata } from "@/components/reiche/ReichView";
import { REICHE_INDEX, loadReich } from "@/lib/history/reiche";

/**
 * Deutsche Seite pro Reich, z. B. /imperien/reich/roemisches-reich
 * (Nutzerwunsch 07.10.2026). Die anderen 12 Sprachen liegen unter
 * /[lang]/imperien/reich/[slug] — Inhalt siehe components/reiche/ReichView.
 */
type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return REICHE_INDEX.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = await loadReich((await params).slug);
  return r ? reichMetadata(r, "de") : {};
}

export default async function ReichPage({ params }: Props) {
  const r = await loadReich((await params).slug);
  if (!r) notFound();
  return <ReichView r={r} lang="de" />;
}
