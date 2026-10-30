import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailView, detailMetadata } from "@/components/religion/ReligionViews";
import { REL_KEYS, REL_SLUG, slugToKey } from "@/lib/religion/text";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return REL_KEYS.map((k) => ({ slug: REL_SLUG[k] }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const k = slugToKey((await params).slug);
  return k ? detailMetadata(k, "de") : {};
}

export default async function ReligionDe({ params }: Props) {
  const k = slugToKey((await params).slug);
  if (!k) notFound();
  return <DetailView keyId={k} lang="de" />;
}
