import type { Metadata } from "next";
import Link from "next/link";
import type { Lang } from "@/contexts/LanguageContext";
import { REICHE_INDEX } from "@/lib/history/reiche";
import { reichNameL } from "@/lib/history/reicheNames";
import { eraIndex, fill, reichTexts } from "@/lib/history/reicheText";
import { OG_LOCALE, PAGE_SEO, formatAreaL, formatYearL, hreflang, langPath, ogImage } from "@/lib/seoI18n";

/** Übersicht aller Reich-Seiten in einer Sprache (verlinkt jede Einzelseite). */
export function reicheMetadata(lang: Lang): Metadata {
  const { title, description } = PAGE_SEO.reiche[lang];
  const url = langPath("/imperien/reiche", lang);
  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflang("/imperien/reiche") },
    openGraph: {
      type: "website",
      siteName: "Centaurian",
      locale: OG_LOCALE[lang],
      url,
      title: `${title} | CENTAURIAN`,
      description,
      images: [{ url: ogImage(1200, lang), width: 1200, height: 630, alt: title }],
    },
  };
}

export default function ReicheIndexView({ lang }: { lang: Lang }) {
  const T = reichTexts(lang);
  const name = (r: (typeof REICHE_INDEX)[number]) => reichNameL(r.en, lang, r.de);
  const collator = new Intl.Collator(lang);
  const groups = [0, 1, 2, 3].map((e) => ({
    e,
    items: REICHE_INDEX.filter((r) => eraIndex(r.from) === e).sort((a, b) => collator.compare(name(a), name(b))),
  }));
  const largest = REICHE_INDEX.reduce((a, b) => (b.peakArea > a.peakArea ? b : a));
  return (
    <main lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} className="mx-auto max-w-4xl px-4 pb-16 pt-6 sm:px-6">
      <nav aria-label="breadcrumb" className="label-mono mb-6 flex flex-wrap gap-x-2 text-xs uppercase text-muted">
        <Link href={langPath("/", lang)} className="hover:text-accent">{T.crumbHome}</Link>
        <span>/</span>
        <Link href={langPath("/imperien", lang)} className="hover:text-accent">{T.crumbMap}</Link>
      </nav>
      <h1 className="font-display text-2xl font-bold text-foreground sm:text-4xl">{T.indexH1}</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-foreground/90">
        {fill(T.indexIntro, { n: REICHE_INDEX.length })}{" "}
        <Link href={langPath("/imperien", lang)} className="text-accent hover:underline">
          {T.indexToMap}
        </Link>
      </p>
      {groups.map(({ e, items }) => (
        <section key={e} className="mt-10">
          <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">
            {T.eras[e]}{" "}
            <span className="label-mono text-xs font-normal text-muted">
              ({T.erasRange[e]} · {items.length})
            </span>
          </h2>
          <ul className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-2">
            {items.map((r) => (
              <li key={r.slug} className="flex items-baseline justify-between gap-2 border-b border-border/60 py-1.5">
                <Link href={langPath(`/imperien/reich/${r.slug}`, lang)} className="text-sm text-foreground hover:text-accent">
                  {name(r)}
                </Link>
                <span className="label-mono shrink-0 text-[10px] text-muted">
                  {formatYearL(r.from, lang)} – {r.to >= 2020 ? T.today : formatYearL(r.to, lang)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="mt-12 border-t border-border pt-4 text-xs text-muted">
        {fill(T.indexLargest, { name: name(largest), area: formatAreaL(largest.peakArea, lang) })} {T.footer}
      </p>
    </main>
  );
}
