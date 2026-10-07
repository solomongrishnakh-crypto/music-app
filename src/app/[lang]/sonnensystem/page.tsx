import type { Metadata } from "next";
import SolarIndexView, { solarMetadata } from "@/components/space/SolarIndexView";
import { isPrefixedLang } from "@/lib/seoI18n";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return isPrefixedLang(lang) ? solarMetadata(lang) : {};
}

export default async function LangSonnensystem({ params }: Props) {
  const { lang } = await params;
  return <SolarIndexView lang={isPrefixedLang(lang) ? lang : "en"} />;
}
