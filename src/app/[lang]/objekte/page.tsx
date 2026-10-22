import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ObjectIndexView, objectIndexMetadata } from "@/components/space/ObjectView";

/** Nur Englisch (/en/objects); andere Sprachen gibt es für diese Seiten noch nicht. */
type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return (await params).lang === "en" ? objectIndexMetadata("en") : {};
}

export default async function LangObjekte({ params }: Props) {
  if ((await params).lang !== "en") notFound();
  return <ObjectIndexView lang="en" />;
}
