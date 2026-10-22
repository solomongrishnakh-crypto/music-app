import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ObjectView, findObject, objectMetadata } from "@/components/space/ObjectView";
import { FAMOUS } from "@/lib/famousObjects";

/** Nur Englisch (/en/objects/…); andere Sprachen gibt es für diese Seiten noch nicht. */
type Props = { params: Promise<{ lang: string; slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => FAMOUS.map((o) => ({ slug: o.id }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const o = findObject(slug);
  return o && lang === "en" ? objectMetadata(o, "en") : {};
}

export default async function LangObjekt({ params }: Props) {
  const { lang, slug } = await params;
  const o = findObject(slug);
  if (!o || lang !== "en") notFound();
  return <ObjectView o={o} lang="en" />;
}
