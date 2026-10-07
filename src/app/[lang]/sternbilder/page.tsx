import type { Metadata } from "next";
import { ConstIndexView, constIndexMetadata } from "@/components/space/ConstView";
import { isPrefixedLang } from "@/lib/seoI18n";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return isPrefixedLang(lang) ? constIndexMetadata(lang) : {};
}

export default async function LangSternbilder({ params }: Props) {
  const { lang } = await params;
  return <ConstIndexView lang={isPrefixedLang(lang) ? lang : "en"} />;
}
