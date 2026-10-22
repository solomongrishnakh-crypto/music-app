import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PrivacyView, { privacyMetadata } from "@/components/PrivacyView";
import { isPrefixedLang, type PrefixedLang } from "@/lib/seoI18n";

/** Datenschutz in allen anderen Sprachen: englischer Text (/en/privacy, /fr/privacy …). */
type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return lang === "en" ? privacyMetadata("en") : { robots: { index: false, follow: true } };
}

export default async function LangDatenschutz({ params }: Props) {
  const { lang } = await params;
  if (!isPrefixedLang(lang)) notFound();
  return <PrivacyView lang="en" urlLang={lang as PrefixedLang} />;
}
