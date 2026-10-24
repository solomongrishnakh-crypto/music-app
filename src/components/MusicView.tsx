import type { Metadata } from "next";
import MusicClient from "@/components/MusicClient";
import { MUSIC_TEXT } from "@/lib/musicPageText";
import { BASE_URL, OG_LOCALE, hreflang, langPath, type PrefixedLang } from "@/lib/seoI18n";

/** Musik-Seite (/musik, /en/music …): Musikplayer mit Suche und Hinweis auf die App. */
type Lang = "de" | PrefixedLang;
const PATH = "/musik";

export function musicMetadata(lang: Lang): Metadata {
  const T = MUSIC_TEXT[lang] ?? MUSIC_TEXT.en;
  const url = langPath(PATH, lang);
  return {
    title: { absolute: `${T.title} | CENTAURIAN` },
    description: T.desc,
    keywords: T.kw.split(", "),
    alternates: { canonical: url, languages: hreflang(PATH) },
    openGraph: { type: "website", siteName: "Centaurian", locale: OG_LOCALE[lang], url: BASE_URL + url, title: T.title, description: T.desc },
    robots: { index: true, follow: true },
  };
}

export default function MusicView({ lang }: { lang: Lang }) {
  const T = MUSIC_TEXT[lang] ?? MUSIC_TEXT.en;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: T.title,
            description: T.desc,
            inLanguage: lang,
            url: BASE_URL + langPath(PATH, lang),
            applicationCategory: "MusicApplication",
            operatingSystem: "Web, Android",
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
          }).replace(/</g, "\\u003c"),
        }}
      />
      <MusicClient lang={lang} />
    </>
  );
}
