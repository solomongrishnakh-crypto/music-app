import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StarView, findStar, starMetadata } from "@/components/space/StarView";
import { STARS } from "@/lib/starPages";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => STARS.map((s) => ({ slug: s[0] }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = findStar((await params).slug);
  return s ? starMetadata(s, "de") : {};
}

export default async function SternPage({ params }: Props) {
  const s = findStar((await params).slug);
  if (!s) notFound();
  return <StarView s={s} lang="de" />;
}
