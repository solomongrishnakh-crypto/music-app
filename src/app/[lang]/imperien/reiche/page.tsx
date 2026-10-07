import type { Metadata } from "next";
import ReicheIndexView, { reicheMetadata } from "@/components/reiche/ReicheIndexView";
import { isPrefixedLang } from "@/lib/seoI18n";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return isPrefixedLang(lang) ? reicheMetadata(lang) : {};
}

export default async function LangReiche({ params }: Props) {
  const { lang } = await params;
  return <ReicheIndexView lang={isPrefixedLang(lang) ? lang : "en"} />;
}
