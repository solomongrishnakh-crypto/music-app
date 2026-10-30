import type { Metadata } from "next";
import { MapView, mapMetadata } from "@/components/religion/ReligionViews";
import { isPrefixedLang } from "@/lib/seoI18n";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return isPrefixedLang(lang) ? mapMetadata(lang) : {};
}

export default async function LangReligionen({ params }: Props) {
  const { lang } = await params;
  return <MapView lang={isPrefixedLang(lang) ? lang : "en"} />;
}
