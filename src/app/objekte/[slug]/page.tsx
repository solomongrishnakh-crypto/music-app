import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ObjectView, findObject, objectMetadata } from "@/components/space/ObjectView";
import { FAMOUS } from "@/lib/famousObjects";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => FAMOUS.map((o) => ({ slug: o.id }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const o = findObject((await params).slug);
  return o ? objectMetadata(o, "de") : {};
}

export default async function ObjektPage({ params }: Props) {
  const o = findObject((await params).slug);
  if (!o) notFound();
  return <ObjectView o={o} lang="de" />;
}
