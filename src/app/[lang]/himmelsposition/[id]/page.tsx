import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SkyPosView, { skyPosMetadata } from "@/components/space/SkyPosView";
import { findSkyEntry } from "@/lib/skyPosData";
import { isPrefixedLang } from "@/lib/seoI18n";

type Props = { params: Promise<{ lang: string; id: string }> };

// 14 Sprachen × viele Objekte: erst beim ersten Aufruf erzeugen, dann stündlich auffrischen
export const dynamicParams = true;
export const revalidate = 3600;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  const e = findSkyEntry(id);
  return e && isPrefixedLang(lang) ? skyPosMetadata(e, lang) : {};
}

export default async function LangSkyPosPage({ params }: Props) {
  const { lang, id } = await params;
  const e = findSkyEntry(id);
  if (!e || !isPrefixedLang(lang)) notFound();
  return <SkyPosView e={e} lang={lang} />;
}
