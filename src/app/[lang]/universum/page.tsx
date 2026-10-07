import type { Metadata } from "next";
import UniversumPage from "@/app/universum/page";
import { BASE_URL, OG_LOCALE, PAGE_SEO, hreflang, isPrefixedLang, langPath } from "@/lib/seoI18n";

/** Sonnensystem & Maschine der Ewigkeit in einer anderen Sprache. */
type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isPrefixedLang(lang)) return {};
  const { title, description } = PAGE_SEO.universum[lang];
  const url = langPath("/universum", lang);
  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflang("/universum") },
    openGraph: {
      type: "website",
      siteName: "Centaurian",
      locale: OG_LOCALE[lang],
      url,
      title: `${title} | CENTAURIAN`,
      description,
      images: [{ url: "/branding/og-image.jpg", width: 1200, height: 630, alt: "Centaurian" }],
    },
    twitter: { card: "summary_large_image", title: `${title} | CENTAURIAN`, description, images: ["/branding/og-image.jpg"] },
  };
}

export default async function LangUniversum({ params }: Props) {
  const { lang } = await params;
  const seo = isPrefixedLang(lang) ? PAGE_SEO.universum[lang] : PAGE_SEO.universum.en;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: seo.title,
    url: BASE_URL + langPath("/universum", isPrefixedLang(lang) ? lang : "en"),
    description: seo.description,
    inLanguage: lang,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    isPartOf: { "@type": "WebSite", name: "Centaurian", url: BASE_URL },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="sr-only">{seo.title}</h1>
      <p className="sr-only">{seo.description}</p>
      <UniversumPage />
    </>
  );
}
