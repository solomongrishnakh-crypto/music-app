import type { Metadata } from "next";
import type { Lang } from "@/contexts/LanguageContext";
import { toolTexts } from "@/lib/history/toolsText";
import { OG_LOCALE, hreflang, langPath, ogImage } from "@/lib/seoI18n";
import GeschichtsWerkzeuge from "./GeschichtsWerkzeuge";

/** Geschichts-Werkzeuge (Vergleich, Rekorde, Welt im Jahr, Quiz) in einer Sprache. */
export function toolsMetadata(lang: Lang): Metadata {
  const { seoTitle: title, seoDesc: description } = toolTexts(lang);
  const url = langPath("/imperien/werkzeuge", lang);
  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflang("/imperien/werkzeuge") },
    openGraph: {
      type: "website",
      siteName: "Centaurian",
      locale: OG_LOCALE[lang],
      url,
      title: `${title} | CENTAURIAN`,
      description,
      images: [{ url: ogImage(1200, lang), width: 1200, height: 630, alt: title }],
    },
  };
}

export default function ToolsView({ lang }: { lang: Lang }) {
  return <GeschichtsWerkzeuge lang={lang} />;
}
