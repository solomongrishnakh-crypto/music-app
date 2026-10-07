import type { Metadata } from "next";
import { BASE_URL, OG_LOCALE, PAGE_SEO, hreflang, isPrefixedLang, langPath } from "@/lib/seoI18n";

/**
 * Sternenhimmel in einer anderen Sprache: dieselbe Ansicht
 * (public/sternenhimmel.html), aber mit fester Sprache über ?lang=.
 */
type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isPrefixedLang(lang)) return {};
  const { title, description } = PAGE_SEO.sternenhimmel[lang];
  const url = langPath("/sternenhimmel", lang);
  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflang("/sternenhimmel") },
    openGraph: {
      type: "website",
      siteName: "Centaurian",
      locale: OG_LOCALE[lang],
      url,
      title: `${title} | CENTAURIAN`,
      description,
      images: [{ url: "/og/sternenhimmel-en.jpg", width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title: `${title} | CENTAURIAN`, description, images: ["/og/sternenhimmel-en.jpg"] },
  };
}

export default async function LangSternenhimmel({ params }: Props) {
  const { lang } = await params;
  const l = isPrefixedLang(lang) ? lang : "en";
  const seo = PAGE_SEO.sternenhimmel[l];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: seo.title,
    url: BASE_URL + langPath("/sternenhimmel", l),
    description: seo.description,
    inLanguage: l,
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
      <iframe
        src={`/sternenhimmel.html?lang=${l}`}
        title={seo.title}
        allow="geolocation; accelerometer; gyroscope; magnetometer; fullscreen; autoplay; encrypted-media"
        className="fixed inset-0 z-[3000] h-[100dvh] w-full border-0 bg-[#06082a]"
      />
    </>
  );
}
