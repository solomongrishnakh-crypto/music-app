import type { Metadata } from "next";
import MachineView, { machineMetadata } from "@/components/space/MachineView";
import { isPrefixedLang } from "@/lib/seoI18n";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return isPrefixedLang(lang) ? machineMetadata(lang) : {};
}

export default async function LangMaschine({ params }: Props) {
  const { lang } = await params;
  return <MachineView lang={isPrefixedLang(lang) ? lang : "en"} />;
}
