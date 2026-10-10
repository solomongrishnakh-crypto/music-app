import type { Metadata } from "next";
import Link from "next/link";
import type { Lang } from "@/contexts/LanguageContext";
import { localize } from "@/lib/i18n";
import { BASE_URL, OG_LOCALE, hreflang, langPath } from "@/lib/seoI18n";
import { PLANET_IDS, type PlanetId, jdOf, moonPhases, msOf } from "@/lib/astro/ephemeris";
import { fill, skyTodayTexts } from "@/lib/skyTodayText";
import { spaceTexts } from "@/lib/spaceText";
import { TRANSLATIONS } from "@/lib/translations";
import { PLANETS } from "@/data/solarSystem";
import BOUNDS from "@/data/eclipticBounds.json";
import { CONSTELLATIONS, constName } from "./ConstView";
import SkyTodayClient, { type ConstRef } from "./SkyTodayClient";

/**
 * „Himmel heute“ (/himmel-heute, /en/himmel-heute …): Mondphase, sichtbare
 * Planeten, Zeiten für den eigenen Ort, nächste Himmelsereignisse.
 * Wird stündlich neu erzeugt (revalidate in den Routen). Nutzerwunsch 09.10.2026.
 */
const PATH = "/himmel-heute";

const LOCALE: Record<Lang, string> = {
  de: "de-DE", en: "en-US", es: "es-ES", fr: "fr-FR", pt: "pt-BR", tr: "tr-TR", ru: "ru-RU",
  el: "el-GR", ar: "ar", hi: "hi-IN", zh: "zh-CN", ja: "ja-JP", ko: "ko-KR",
};

export function skyTodayMetadata(lang: Lang): Metadata {
  const T = skyTodayTexts(lang);
  const url = langPath(PATH, lang);
  const img = lang === "de" ? "/og/sternenhimmel.jpg" : "/og/sternenhimmel-en.jpg";
  return {
    title: { absolute: `${T.title} | CENTAURIAN` },
    description: T.desc,
    keywords: T.keywords,
    alternates: { canonical: url, languages: hreflang(PATH) },
    openGraph: {
      type: "website", siteName: "Centaurian", locale: OG_LOCALE[lang], url,
      title: T.title, description: T.desc,
      images: [{ url: img, width: 1200, height: 630, alt: T.h1 }],
    },
    twitter: { card: "summary_large_image", title: T.title, description: T.desc, images: [img] },
  };
}

function planetNames(lang: Lang): Record<PlanetId, string> {
  const out = {} as Record<PlanetId, string>;
  for (const id of PLANET_IDS) {
    const p = PLANETS.find((x) => x.id === id);
    out[id] = p ? localize(p.name, lang) : id;
  }
  return out;
}

function constRefs(lang: Lang): Record<string, ConstRef> {
  const out: Record<string, ConstRef> = {};
  for (const [abbr] of BOUNDS as unknown as [string, unknown][]) {
    const c = CONSTELLATIONS.find((x) => x.abbr === abbr);
    if (c) out[abbr] = { name: constName(c, lang), slug: c.slug };
  }
  return out;
}

export default function SkyTodayView({ lang }: { lang: Lang }) {
  const T = skyTodayTexts(lang);
  const S = spaceTexts(lang);
  const now = Date.now();
  const locale = LOCALE[lang];

  // für die FAQ (Google): nächster Vollmond als Datum (UTC)
  const full = moonPhases(jdOf(now), 35).find((p) => p.kind === "full");
  const fullDate = full
    ? new Intl.DateTimeFormat(locale, { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" }).format(new Date(msOf(full.jd)))
    : "";
  const faq = T.faq.map((f) => ({ q: f.q, a: fill(f.a, { date: fullDate }) }));
  const url = BASE_URL + langPath(PATH, lang);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage", name: T.title, description: T.desc, url, inLanguage: lang,
        dateModified: new Date(now).toISOString(),
        isPartOf: { "@type": "WebSite", name: "Centaurian", url: BASE_URL },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };
  const skyHref = langPath("/sternenhimmel", lang);

  return (
    <main lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} className="mx-auto max-w-4xl px-4 pb-16 pt-6 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="breadcrumb" className="label-mono mb-6 flex flex-wrap gap-x-2 text-xs uppercase text-muted">
        <Link href={langPath("/", lang)} className="hover:text-accent">{S.crumbHome}</Link>
        <span aria-hidden="true">/</span>
        <span>{T.h1}</span>
      </nav>
      <h1 className="font-display text-2xl font-bold text-foreground sm:text-4xl">{T.title}</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-foreground/90">{T.intro}</p>
      <a
        href={skyHref}
        className="mt-5 inline-block border border-accent px-4 py-2.5 text-sm uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-black"
      >
        ▶ {T.liveCta}
      </a>

      <SkyTodayClient
        lang={lang}
        locale={locale}
        serverNow={now}
        T={T}
        planetNames={planetNames(lang)}
        consts={constRefs(lang)}
        skyHref={skyHref}
        constBase={langPath("/sternbilder", lang)}
      />

      <section aria-labelledby="h-faq" className="mt-12">
        <h2 id="h-faq" className="font-display text-xl font-bold text-foreground sm:text-2xl">{T.h2Faq}</h2>
        <div className="mt-3 space-y-2">
          {faq.map((f) => (
            <details key={f.q} className="hud-card border border-border p-3">
              <summary className="cursor-pointer text-sm text-foreground">{f.q}</summary>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <nav className="mt-10 flex flex-wrap gap-2">
        <a href={skyHref} className="border border-accent px-3 py-2 text-xs uppercase tracking-wide text-accent hover:bg-accent hover:text-black">▶ {T.liveCta}</a>
        <Link href={langPath("/sternbilder", lang)} className="border border-border px-3 py-2 text-xs uppercase tracking-wide text-foreground hover:border-accent hover:text-accent">{localize(TRANSLATIONS.linkConstellations as unknown as Record<Lang, string>, lang)}</Link>
        <Link href={langPath("/sonnensystem", lang)} className="border border-border px-3 py-2 text-xs uppercase tracking-wide text-foreground hover:border-accent hover:text-accent">{localize(TRANSLATIONS.linkAllPlanets as unknown as Record<Lang, string>, lang)}</Link>
      </nav>

      <p className="mt-12 border-t border-border pt-4 text-xs text-muted">{T.credit}</p>
    </main>
  );
}
