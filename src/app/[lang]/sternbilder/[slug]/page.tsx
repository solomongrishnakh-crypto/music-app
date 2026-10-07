import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ConstView, { CONSTELLATIONS, constMetadata, findConst } from "@/components/space/ConstView";
import { isPrefixedLang } from "@/lib/seoI18n";

/** Sternbild-Seite in einer anderen Sprache (/en/sternbilder/orion …). */
type Props = { params: Promise<{ lang: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return CONSTELLATIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const c = findConst(slug);
  return c && isPrefixedLang(lang) ? constMetadata(c, lang) : {};
}

export default async function LangSternbild({ params }: Props) {
  const { lang, slug } = await params;
  const c = findConst(slug);
  if (!c || !isPrefixedLang(lang)) notFound();
  return <ConstView c={c} lang={lang} />;
}
