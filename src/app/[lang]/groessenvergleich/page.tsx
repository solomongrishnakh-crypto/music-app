import type { Metadata } from "next";
import SizeView, { sizeMetadata } from "@/components/space/SizeView";
import { isPrefixedLang } from "@/lib/seoI18n";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return isPrefixedLang(lang) ? sizeMetadata(lang) : {};
}

export default async function LangGroessenvergleich({ params }: Props) {
  const { lang } = await params;
  return <SizeView lang={isPrefixedLang(lang) ? lang : "en"} />;
}
