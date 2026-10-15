import type { Metadata } from "next";
import Link from "next/link";
import type { Lang } from "@/contexts/LanguageContext";
import { spaceTexts } from "@/lib/spaceText";
import { SIZE_PAGE } from "@/lib/sizePageText";
import { BASE_URL, OG_LOCALE, hreflang, langPath } from "@/lib/seoI18n";
import { SizeTable } from "@/components/universe/SizeComparison";
import SizeEmbed from "./SizeEmbed";

/**
 * Eigene Seite für den Größenvergleich (/groessenvergleich, /en/groessenvergleich …)
 * — Nutzerwunsch 15.10.2026: bei Google zu Suchen wie "Größenvergleich Planeten"
 * gefunden werden. Das interaktive Canvas steht oben, darunter stehen
 * Einleitung, Durchmesser-Tabelle und FAQ als lesbarer Text.
 */
const TABLE_IDS = ["ns", "moon", "mercury", "mars", "venus", "earth", "neptune", "uranus", "saturn", "jupiter", "sun", "sirius", "betelgeuse", "uyscuti", "st218", "sgra"];

export function sizeMetadata(lang: Lang): Metadata {
  const T = SIZE_PAGE[lang];
  const url = langPath("/groessenvergleich", lang);
  return {
    title: { absolute: `${T.title} | CENTAURIAN` },
    description: T.desc,
    keywords: T.keywords,
    alternates: { canonical: url, languages: hreflang("/groessenvergleich") },
    openGraph: {
      type: "website",
      siteName: "Centaurian",
      locale: OG_LOCALE[lang],
      url,
      title: T.title,
      description: T.desc,
      images: [{ url: "/branding/og-image.jpg", width: 1200, height: 630, alt: T.h1 }],
    },
    twitter: { card: "summary_large_image", title: T.title, description: T.desc, images: ["/branding/og-image.jpg"] },
  };
}

export default function SizeView({ lang }: { lang: Lang }) {
  const T = SIZE_PAGE[lang];
  const S = spaceTexts(lang);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: T.title,
        description: T.desc,
        url: BASE_URL + langPath("/groessenvergleich", lang),
        inLanguage: lang,
        keywords: T.keywords.join(", "),
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        isPartOf: { "@type": "WebSite", name: "Centaurian", url: BASE_URL },
      },
      {
        "@type": "FAQPage",
        mainEntity: T.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      },
    ],
  };
  return (
    <main lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="breadcrumb" className="label-mono mb-6 flex flex-wrap gap-x-2 text-xs uppercase text-muted">
        <Link href={langPath("/", lang)} className="hover:text-accent">{S.crumbHome}</Link>
      </nav>
      <h1 className="font-display text-3xl font-bold text-foreground sm:text-5xl">{T.h1}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-foreground/90">{T.intro}</p>
      <section className="mt-8" aria-label={T.h2Tool}>
        <h2 className="sr-only">{T.h2Tool}</h2>
        <SizeEmbed />
      </section>
      <section className="mt-10 max-w-3xl">
        <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">{T.h2Table}</h2>
        <SizeTable ids={TABLE_IDS} labels={{ obj: T.colObj, diam: T.colDiam, ratio: T.colRatio }} />
        <p className="mt-3 text-xs leading-relaxed text-muted">{T.note}</p>
      </section>
      <section className="mt-10 max-w-3xl">
        <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">{T.h2Faq}</h2>
        <div className="mt-3 space-y-3">
          {T.faq.map(([q, a]) => (
            <details key={q} className="hud-card border border-border p-3">
              <summary className="cursor-pointer text-sm font-semibold text-foreground">{q}</summary>
              <p className="mt-2 text-sm leading-relaxed text-foreground/85">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
