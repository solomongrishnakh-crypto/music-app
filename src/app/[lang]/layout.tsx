import { notFound } from "next/navigation";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { PREFIXED_LANGS, isPrefixedLang } from "@/lib/seoI18n";

/**
 * Sprach-Adressen /en, /es, /fr … (Nutzerwunsch 07.10.2026: "fokus liegt an
 * internationale zuschauer"). Alle Tools gibt es hier ein zweites Mal mit
 * fest eingestellter Sprache — schon im Server-HTML, damit Google jede
 * Sprachversion findet. Deutsch bleibt ohne Präfix (/imperien usw.).
 */
type Props = { children: React.ReactNode; params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return PREFIXED_LANGS.map((lang) => ({ lang }));
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isPrefixedLang(lang)) notFound();
  return <LanguageProvider forcedLang={lang}>{children}</LanguageProvider>;
}
