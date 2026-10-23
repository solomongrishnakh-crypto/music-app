import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AppView, { appMetadata } from "@/components/AppView";
import { isPrefixedLang } from "@/lib/seoI18n";

/** Download-Seite der App in allen anderen Sprachen (/en/app, /es/app …). */
type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return isPrefixedLang(lang) ? appMetadata(lang) : {};
}

export default async function LangAppPage({ params }: Props) {
  const { lang } = await params;
  if (!isPrefixedLang(lang)) notFound();
  return <AppView lang={lang} />;
}
