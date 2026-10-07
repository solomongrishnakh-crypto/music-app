import type { Metadata } from "next";
import Home from "@/app/page";
import { BASE_URL, OG_LOCALE, PAGE_SEO, hreflang, isPrefixedLang, langPath } from "@/lib/seoI18n";

/** Startseite in einer anderen Sprache (/en, /es, …). */
type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isPrefixedLang(lang)) return {};
  const { title, description } = PAGE_SEO.home[lang];
  const url = langPath("/", lang);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url, languages: hreflang("/") },
    openGraph: {
      type: "website",
      siteName: "Centaurian",
      locale: OG_LOCALE[lang],
      url,
      title,
      description,
      images: [{ url: "/branding/og-image.jpg", width: 1200, height: 630, alt: "Centaurian" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/branding/og-image.jpg"] },
  };
}

export default async function LangHome({ params }: Props) {
  const { lang } = await params;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Centaurian",
    url: BASE_URL + langPath("/", isPrefixedLang(lang) ? lang : "en"),
    inLanguage: lang,
    description: isPrefixedLang(lang) ? PAGE_SEO.home[lang].description : undefined,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Home />
    </>
  );
}
