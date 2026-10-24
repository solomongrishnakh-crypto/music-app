import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MusicView, { musicMetadata } from "@/components/MusicView";
import { isPrefixedLang } from "@/lib/seoI18n";

/** Musik-Seite in den anderen Sprachen (/en/music, /es/music …). */
type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return isPrefixedLang(lang) ? musicMetadata(lang) : {};
}

export default async function LangMusikPage({ params }: Props) {
  const { lang } = await params;
  if (!isPrefixedLang(lang)) notFound();
  return <MusicView lang={lang} />;
}
