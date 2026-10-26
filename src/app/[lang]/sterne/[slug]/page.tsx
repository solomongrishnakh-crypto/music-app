import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StarView, findStar, starMetadata } from "@/components/space/StarView";
import { STARS } from "@/lib/starPages";

/** Nur Englisch (/en/stars/…); andere Sprachen gibt es für diese Seiten noch nicht. */
type Props = { params: Promise<{ lang: string; slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => STARS.map((s) => ({ slug: s[0] }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const s = findStar(slug);
  return s && lang === "en" ? starMetadata(s, "en") : {};
}

export default async function LangStern({ params }: Props) {
  const { lang, slug } = await params;
  const s = findStar(slug);
  if (!s || lang !== "en") notFound();
  return <StarView s={s} lang="en" />;
}
