import type { Metadata } from "next";
import SkyTodayView, { skyTodayMetadata } from "@/components/space/SkyTodayView";
import { isPrefixedLang } from "@/lib/seoI18n";

/** Himmel heute in den anderen Sprachen (/en/himmel-heute …). Stündlich neu erzeugt. */
export const revalidate = 3600;

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return isPrefixedLang(lang) ? skyTodayMetadata(lang) : {};
}

export default async function LangHimmelHeute({ params }: Props) {
  const { lang } = await params;
  return <SkyTodayView lang={isPrefixedLang(lang) ? lang : "en"} />;
}
