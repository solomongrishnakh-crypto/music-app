import type { Metadata } from "next";
import ToolsView, { toolsMetadata } from "@/components/space/ToolsView";
import { isPrefixedLang } from "@/lib/seoI18n";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return isPrefixedLang(lang) ? toolsMetadata(lang) : {};
}

export default async function LangWeltraumRechner({ params }: Props) {
  const { lang } = await params;
  return <ToolsView lang={isPrefixedLang(lang) ? lang : "en"} />;
}
