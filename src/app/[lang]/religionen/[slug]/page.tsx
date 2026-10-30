import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailView, detailMetadata } from "@/components/religion/ReligionViews";
import { isPrefixedLang } from "@/lib/seoI18n";
import { slugToKey } from "@/lib/religion/text";

type Props = { params: Promise<{ lang: string; slug: string }> };

export const dynamicParams = true;
export const revalidate = false;
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const k = slugToKey(slug);
  return k && isPrefixedLang(lang) ? detailMetadata(k, lang) : {};
}

export default async function LangReligion({ params }: Props) {
  const { lang, slug } = await params;
  const k = slugToKey(slug);
  if (!k || !isPrefixedLang(lang)) notFound();
  return <DetailView keyId={k} lang={lang} />;
}
