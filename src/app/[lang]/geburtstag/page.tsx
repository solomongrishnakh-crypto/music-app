import type { Metadata } from "next";
import BirthdayView, { birthdayMetadata } from "@/components/space/BirthdayView";
import { isPrefixedLang } from "@/lib/seoI18n";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return isPrefixedLang(lang) ? birthdayMetadata(lang) : {};
}

export default async function LangGeburtstag({ params }: Props) {
  const { lang } = await params;
  return <BirthdayView lang={isPrefixedLang(lang) ? lang : "en"} />;
}
