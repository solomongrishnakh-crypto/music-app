import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StarIndexView, starIndexMetadata } from "@/components/space/StarView";

/** Nur Englisch (/en/stars); andere Sprachen gibt es für diese Seiten noch nicht. */
type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return (await params).lang === "en" ? starIndexMetadata("en") : {};
}

export default async function LangSterne({ params }: Props) {
  if ((await params).lang !== "en") notFound();
  return <StarIndexView lang="en" />;
}
