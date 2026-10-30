import type { Metadata } from "next";
import Link from "next/link";
import type { Lang } from "@/contexts/LanguageContext";
import ReligionMap from "@/app/religionen/ReligionMap";
import { BASE_URL, OG_LOCALE, hreflang, langPath } from "@/lib/seoI18n";
import { REL_KEYS, REL_SLUG, relDetailLabels, relInfo, relLong, relNames, relUi, type RelKey } from "@/lib/religion/text";

/** Religionskarte (/religionen) und Religions-Seiten (/religionen/christentum …). */

const dirOf = (l: Lang) => (l === "ar" || l === "fa" ? "rtl" : "ltr");
const MAP = "/religionen";
const detailPath = (k: RelKey) => `${MAP}/${REL_SLUG[k]}`;
const ogImages = [{ url: "/og/imperien/-1000.jpg", width: 1200, height: 630, alt: "Centaurian" }];

export function mapMetadata(lang: Lang): Metadata {
  const U = relUi(lang);
  const url = langPath(MAP, lang);
  return {
    title: { absolute: `${U.metaTitle} | CENTAURIAN` },
    description: U.metaDesc,
    alternates: { canonical: url, languages: hreflang(MAP) },
    openGraph: { type: "website", siteName: "Centaurian", locale: OG_LOCALE[lang], url, title: U.metaTitle, description: U.metaDesc, images: ogImages },
    twitter: { card: "summary_large_image", title: U.metaTitle, description: U.metaDesc, images: [ogImages[0].url] },
  };
}

export function MapView({ lang }: { lang: Lang }) {
  const U = relUi(lang);
  const N = relNames(lang);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: U.metaTitle,
    description: U.metaDesc,
    url: BASE_URL + langPath(MAP, lang),
    inLanguage: lang,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    isPartOf: { "@type": "WebSite", name: "Centaurian", url: BASE_URL },
  };
  return (
    <main lang={lang} dir={dirOf(lang)} className="pb-16 pt-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="breadcrumb" className="label-mono mx-auto flex max-w-[900px] flex-wrap gap-x-2 px-4 text-xs uppercase text-muted">
        <Link href={langPath("/", lang)} className="hover:text-accent">{U.home}</Link>
        <span>/</span>
        <Link href={langPath("/imperien", lang)} className="hover:text-accent">{U.history}</Link>
      </nav>
      <ReligionMap lang={lang} />
      <section className="mx-auto mt-10 max-w-[900px] px-4">
        <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">{U.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/85">{U.metaDesc}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {REL_KEYS.map((k, i) => (
            <li key={k}>
              <Link href={langPath(detailPath(k), lang)} className="label-mono inline-block border border-border px-3 py-1.5 text-xs uppercase tracking-wide text-foreground transition-colors hover:border-accent hover:text-accent">
                {N[i]}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export function detailMetadata(key: RelKey, lang: Lang): Metadata {
  const name = relNames(lang)[REL_KEYS.indexOf(key)];
  const L = relLong(lang)[key];
  const en = lang !== "de";
  const title = en ? `${name}: origin, beliefs and spread` : `${name}: Entstehung, Glaube und Ausbreitung`;
  const desc = L.origin.length > 150 ? L.origin.slice(0, L.origin.lastIndexOf(" ", 150)) + " …" : L.origin;
  const path = detailPath(key);
  const url = langPath(path, lang);
  return {
    title: { absolute: `${title} | CENTAURIAN` },
    description: desc,
    alternates: { canonical: url, languages: hreflang(path) },
    openGraph: { type: "article", siteName: "Centaurian", locale: OG_LOCALE[lang], url, title, description: desc, images: ogImages },
    twitter: { card: "summary_large_image", title, description: desc, images: [ogImages[0].url] },
  };
}

export function DetailView({ keyId, lang }: { keyId: RelKey; lang: Lang }) {
  const U = relUi(lang);
  const D = relDetailLabels(lang);
  const names = relNames(lang);
  const name = names[REL_KEYS.indexOf(keyId)];
  const I = relInfo(lang)[keyId];
  const L = relLong(lang)[keyId];
  const en = lang !== "de";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: name,
    description: L.origin,
    inLanguage: en ? "en" : "de",
    mainEntityOfPage: BASE_URL + langPath(detailPath(keyId), lang),
    author: { "@type": "Organization", name: "Centaurian" },
    publisher: { "@type": "Organization", name: "Centaurian" },
    isPartOf: { "@type": "WebSite", name: "Centaurian", url: BASE_URL },
  };
  const sec = (h: string, t: string) => (
    <section className="mt-8">
      <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">{h}</h2>
      <p className="mt-3 leading-relaxed text-foreground/90">{t}</p>
    </section>
  );
  return (
    <main lang={en ? "en" : "de"} dir="ltr" className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="breadcrumb" className="label-mono mb-6 flex flex-wrap gap-x-2 text-xs uppercase text-muted">
        <Link href={langPath("/", lang)} className="hover:text-accent">{U.home}</Link>
        <span>/</span>
        <Link href={langPath(MAP, lang)} className="hover:text-accent">{U.boxTitle}</Link>
      </nav>
      <h1 className="font-display text-3xl font-bold text-foreground sm:text-5xl">{name}</h1>
      <dl className="hud-card mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 border border-border p-4 text-sm">
        <dt className="text-muted">{en ? "Origin" : "Entstanden"}</dt><dd>{I.when}</dd>
        <dt className="text-muted">{en ? "Sacred text" : "Heilige Schrift"}</dt><dd>{I.book}</dd>
        <dt className="text-muted">{en ? "Followers today" : "Anhänger heute"}</dt><dd>{I.fol}</dd>
      </dl>
      <p className="mt-6 text-lg leading-relaxed text-foreground/90">{I.txt}</p>
      {sec(D.origin, L.origin)}
      {sec(D.beliefs, L.beliefs)}
      {sec(D.spread, L.spread)}
      {sec(D.today, L.today)}
      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">{D.facts}</h2>
        <ul className="mt-3 list-disc space-y-1 ps-5 text-foreground/90">
          {L.facts.map((f) => <li key={f}>{f}</li>)}
        </ul>
      </section>
      <p className="mt-6 text-xs text-muted">{D.note}</p>
      <Link
        href={`${langPath(MAP, lang)}?r=${keyId}`}
        className="mt-6 inline-block border border-accent px-4 py-2.5 text-sm uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-black"
      >
        ▶ {D.onMap}
      </Link>
      <section className="mt-10 border-t border-border pt-6">
        <h2 className="font-display text-base font-bold text-foreground">{D.others}</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {REL_KEYS.filter((k) => k !== keyId).map((k) => (
            <li key={k}>
              <Link href={langPath(detailPath(k), lang)} className="label-mono inline-block border border-border px-3 py-1.5 text-xs uppercase tracking-wide text-foreground transition-colors hover:border-accent hover:text-accent">
                {names[REL_KEYS.indexOf(k)]}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
