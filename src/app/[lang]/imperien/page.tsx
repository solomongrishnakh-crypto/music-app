import type { Metadata } from "next";
import ImperienClient from "@/app/imperien/ImperienClient";
import { BASE_URL, OG_LOCALE, PAGE_SEO, YEAR_SHARE, formatYearL, hreflang, isPrefixedLang, langPath, ogImage } from "@/lib/seoI18n";

/**
 * Weltgeschichte-Karte in einer anderen Sprache. Geteilte Links wie
 * /en/imperien?jahr=1200 bekommen eine eigene Vorschau ("The World in AD 1200").
 */
type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ jahr?: string | string[] }>;
};

function parseYear(raw: string | string[] | undefined): number | null {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v === undefined || v.trim() === "") return null;
  const y = Math.round(Number(v));
  return Number.isFinite(y) ? Math.min(2024, Math.max(-3400, y)) : null;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isPrefixedLang(lang)) return {};
  const year = parseYear((await searchParams).jahr);
  const url = langPath("/imperien", lang);
  const base = PAGE_SEO.imperien[lang];
  const title = year === null ? base.title : YEAR_SHARE[lang].title(formatYearL(year, lang));
  const description = year === null ? base.description : YEAR_SHARE[lang].description(formatYearL(year, lang));
  const image = ogImage(year ?? 1200, lang);
  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflang("/imperien") },
    openGraph: {
      type: "website",
      siteName: "Centaurian",
      locale: OG_LOCALE[lang],
      url: year === null ? url : `${url}?jahr=${year}`,
      title: `${title} | CENTAURIAN`,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title: `${title} | CENTAURIAN`, description, images: [image] },
  };
}

export default async function LangImperien({ params }: Props) {
  const { lang } = await params;
  const l = isPrefixedLang(lang) ? lang : "en";
  const seo = PAGE_SEO.imperien[l];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: seo.title,
    url: BASE_URL + langPath("/imperien", l),
    description: seo.description,
    inLanguage: l,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    temporalCoverage: "-3400/2024",
    isPartOf: { "@type": "WebSite", name: "Centaurian", url: BASE_URL },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ImperienClient />
    </>
  );
}
