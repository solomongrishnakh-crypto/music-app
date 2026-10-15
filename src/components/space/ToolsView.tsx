import type { Metadata } from "next";
import Link from "next/link";
import type { Lang } from "@/contexts/LanguageContext";
import { spaceTexts } from "@/lib/spaceText";
import { TOOLS_PAGE } from "@/lib/toolsPageText";
import { BASE_URL, OG_LOCALE, hreflang, langPath } from "@/lib/seoI18n";
import SpaceCalculators from "@/components/universe/SpaceCalculators";

/**
 * Eigene Seite für den Weltraum-Rechner (/weltraum-rechner, /en/weltraum-rechner …)
 * — Nutzerwunsch 16.10.2026: mehr Aufrufe über Suchmaschinen. Zu Suchen wie
 * "Gewicht auf dem Mond" oder "Flugzeit Mars". Der Rechner steht oben,
 * darunter Fragen und Antworten als lesbarer Text.
 */
export function toolsMetadata(lang: Lang): Metadata {
  const T = TOOLS_PAGE[lang];
  const url = langPath("/weltraum-rechner", lang);
  return {
    title: { absolute: `${T.title} | CENTAURIAN` },
    description: T.desc,
    keywords: T.keywords,
    alternates: { canonical: url, languages: hreflang("/weltraum-rechner") },
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

export default function ToolsView({ lang }: { lang: Lang }) {
  const T = TOOLS_PAGE[lang];
  const S = spaceTexts(lang);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: T.title,
        description: T.desc,
        url: BASE_URL + langPath("/weltraum-rechner", lang),
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
        <SpaceCalculators index="01" />
      </section>
      <section className="mt-10 max-w-3xl">
        <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">{T.h2Faq}</h2>
        <div className="mt-3 space-y-3">
          {T.faq.map(([q, a]) => (
            <details key={q} className="hud-card border border-border p-3" open>
              <summary className="cursor-pointer text-sm font-semibold text-foreground">{q}</summary>
              <p className="mt-2 text-sm leading-relaxed text-foreground/85">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
