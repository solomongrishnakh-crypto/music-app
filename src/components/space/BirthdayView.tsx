import type { Metadata } from "next";
import Link from "next/link";
import type { Lang } from "@/contexts/LanguageContext";
import { spaceTexts } from "@/lib/spaceText";
import { BIRTHDAY_TEXT } from "@/lib/birthdayText";
import { BASE_URL, OG_LOCALE, hreflang, langPath } from "@/lib/seoI18n";
import BirthdayClient from "./BirthdayClient";
import CosmicCalendar from "@/components/history/CosmicCalendar";

/**
 * Seite "Dein Geburtstag im Universum" (/geburtstag, /en/geburtstag …).
 * Nutzerwunsch 16.10.2026: einfach, teilbar, gut für Suchen wie "Alter auf dem Mars".
 */
export function birthdayMetadata(lang: Lang): Metadata {
  const T = BIRTHDAY_TEXT[lang];
  const url = langPath("/geburtstag", lang);
  return {
    title: { absolute: `${T.title} | CENTAURIAN` },
    description: T.desc,
    alternates: { canonical: url, languages: hreflang("/geburtstag") },
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

export default function BirthdayView({ lang }: { lang: Lang }) {
  const T = BIRTHDAY_TEXT[lang];
  const S = spaceTexts(lang);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: T.title,
        description: T.desc,
        url: BASE_URL + langPath("/geburtstag", lang),
        inLanguage: lang,
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
    <main lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} className="mx-auto max-w-4xl px-4 pb-16 pt-6 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="breadcrumb" className="label-mono mb-6 flex flex-wrap gap-x-2 text-xs uppercase text-muted">
        <Link href={langPath("/", lang)} className="hover:text-accent">{S.crumbHome}</Link>
      </nav>
      <h1 className="font-display text-3xl font-bold text-foreground sm:text-5xl">{T.h1}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-foreground/90">{T.intro}</p>
      <BirthdayClient />
      <div className="mt-12">
        <CosmicCalendar index="05" />
      </div>
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
