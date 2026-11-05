import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SkyPosIndexView, skyPosIndexMetadata } from "@/components/space/SkyPosView";
import { isPrefixedLang } from "@/lib/seoI18n";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return isPrefixedLang(lang) ? skyPosIndexMetadata(lang) : {};
}

export default async function LangHimmelspositionPage({ params }: Props) {
  const { lang } = await params;
  if (!isPrefixedLang(lang)) notFound();
  return <SkyPosIndexView lang={lang} />;
}
