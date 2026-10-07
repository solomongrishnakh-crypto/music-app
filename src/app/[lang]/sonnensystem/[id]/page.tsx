import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BodyView, { bodyMetadata } from "@/components/space/BodyView";
import { SPACE_BODIES, findBody } from "@/components/space/bodies";
import { isPrefixedLang } from "@/lib/seoI18n";

type Props = { params: Promise<{ lang: string; id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return SPACE_BODIES.map((b) => ({ id: b.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  const b = findBody(id);
  return b && isPrefixedLang(lang) ? bodyMetadata(b, lang) : {};
}

export default async function LangBodyPage({ params }: Props) {
  const { lang, id } = await params;
  const b = findBody(id);
  if (!b || !isPrefixedLang(lang)) notFound();
  return <BodyView b={b} lang={lang} />;
}
