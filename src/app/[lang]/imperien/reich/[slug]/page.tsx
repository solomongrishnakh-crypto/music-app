import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReichView, { reichMetadata } from "@/components/reiche/ReichView";
import { loadReich } from "@/lib/history/reiche";
import { isPrefixedLang } from "@/lib/seoI18n";

/**
 * Reich-Seite in einer anderen Sprache (/en/imperien/reich/roemisches-reich).
 * 300 Reiche × 12 Sprachen wären zu viele Seiten für einen Build — sie
 * werden beim ersten Aufruf erzeugt und danach dauerhaft zwischengespeichert.
 */
type Props = { params: Promise<{ lang: string; slug: string }> };

export const dynamicParams = true;
export const revalidate = false;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const r = await loadReich(slug);
  return r && isPrefixedLang(lang) ? reichMetadata(r, lang) : {};
}

export default async function LangReichPage({ params }: Props) {
  const { lang, slug } = await params;
  const r = await loadReich(slug);
  if (!r || !isPrefixedLang(lang)) notFound();
  return <ReichView r={r} lang={lang} />;
}
