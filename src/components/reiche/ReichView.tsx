import type { Metadata } from "next";
import Link from "next/link";
import type { Lang } from "@/contexts/LanguageContext";
import { REICHE_INDEX, dauer, type Reich, type ReichRef } from "@/lib/history/reiche";
import { reichNameL } from "@/lib/history/reicheNames";
import { eraIndex, fill, reichTexts } from "@/lib/history/reicheText";
import {
  BASE_URL,
  OG_LOCALE,
  formatAreaL,
  formatNumberL,
  formatYearL,
  hreflang,
  langPath,
  ogImage,
} from "@/lib/seoI18n";

/**
 * Seite eines Reichs in einer Sprache (Deutsch: /imperien/reich/x,
 * sonst /en/imperien/reich/x usw.). Nutzerwunsch 07.10.2026: mehr
 * Besucher — auch international.
 */
const LAND_KM2 = 148_940_000; // Landfläche der Erde

function nameOf(r: { en?: string; n?: string; de: string | null }, lang: Lang): string {
  return reichNameL(r.en ?? r.n ?? "", lang, r.de);
}

function vars(r: Reich, lang: Lang) {
  return {
    name: nameOf(r, lang),
    from: formatYearL(r.from, lang),
    to: r.to >= 2020 ? reichTexts(lang).today : formatYearL(r.to, lang),
    years: formatNumberL(dauer(r.from, r.to), lang),
    year: formatYearL(r.peakYear, lang),
    area: formatAreaL(r.peakArea, lang),
    share: formatNumberL(Math.max(0.1, Math.round((r.peakArea / LAND_KM2) * 1000) / 10), lang, 1),
  };
}

export function reichMetadata(r: Reich, lang: Lang): Metadata {
  const T = reichTexts(lang);
  const v = vars(r, lang);
  const title = `${v.name} — ${T.titleSuffix}`;
  const description = fill(T.metaDesc, v);
  const path = `/imperien/reich/${r.slug}`;
  const url = langPath(path, lang);
  const image = ogImage(r.peakYear, lang);
  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflang(path) },
    openGraph: {
      type: "article",
      siteName: "Centaurian",
      locale: OG_LOCALE[lang],
      url,
      title: `${title} | CENTAURIAN`,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: v.name }],
    },
    twitter: { card: "summary_large_image", title: `${title} | CENTAURIAN`, description, images: [image] },
  };
}

function RefList({ items, empty, lang }: { items: ReichRef[]; empty: string; lang: Lang }) {
  if (!items.length) return <p className="text-sm text-muted">{empty}</p>;
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((it) => {
        const label = nameOf(it, lang);
        return (
          <li key={it.n}>
            {it.s ? (
              <Link
                href={langPath(`/imperien/reich/${it.s}`, lang)}
                className="inline-block border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                {label}
              </Link>
            ) : (
              <span className="inline-block border border-border/50 px-3 py-1.5 text-sm text-muted">{label}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** Flächenverlauf als kleines Stufendiagramm (reines SVG). */
function AreaChart({ r, lang }: { r: Reich; lang: Lang }) {
  const T = reichTexts(lang);
  const s = r.series;
  if (s.length < 2) return null;
  const W = 600;
  const H = 140;
  const max = Math.max(...s.map((p) => p[1])) || 1;
  const span = Math.max(1, r.to - r.from);
  const pts = s.map(([y, a]) => [((y - r.from) / span) * W, H - (a / max) * (H - 10)] as const);
  let d = `M0 ${H}`;
  pts.forEach(([x, y], i) => {
    d += ` L${x.toFixed(1)} ${i === 0 ? y.toFixed(1) : pts[i - 1][1].toFixed(1)} L${x.toFixed(1)} ${y.toFixed(1)}`;
  });
  d += ` L${W} ${pts[pts.length - 1][1].toFixed(1)} L${W} ${H} Z`;
  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={fill(T.chartAria, { name: nameOf(r, lang) })}
        style={{ transform: lang === "ar" ? "scaleX(-1)" : undefined }}
      >
        <path d={d} fill="rgba(255,90,77,0.25)" stroke="#ff5a4d" strokeWidth="1.5" />
      </svg>
      <figcaption className="mt-1 flex justify-between gap-2 text-xs text-muted">
        <span>{formatYearL(r.from, lang)}</span>
        <span className="text-center">{fill(T.chartCaption, { area: formatAreaL(max, lang) })}</span>
        <span>{r.to >= 2020 ? T.today : formatYearL(r.to, lang)}</span>
      </figcaption>
    </figure>
  );
}

export default function ReichView({ r, lang }: { r: Reich; lang: Lang }) {
  const T = reichTexts(lang);
  const v = vars(r, lang);
  const name = v.name;
  const showEn = name !== r.en;
  const dir = lang === "ar" ? "rtl" : "ltr";
  const wikiLang = lang;
  const wikiQuery = lang === "de" ? (r.de ?? r.en) : name;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: `${name} — ${T.titleSuffix}`,
        url: BASE_URL + langPath(`/imperien/reich/${r.slug}`, lang),
        inLanguage: lang,
        about: { "@type": "Thing", name: r.en, alternateName: name !== r.en ? name : undefined },
        isPartOf: { "@type": "WebSite", name: "Centaurian", url: BASE_URL },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Centaurian", item: BASE_URL + langPath("/", lang) },
          { "@type": "ListItem", position: 2, name: T.crumbMap, item: BASE_URL + langPath("/imperien", lang) },
          { "@type": "ListItem", position: 3, name: T.crumbAll, item: BASE_URL + langPath("/imperien/reiche", lang) },
          { "@type": "ListItem", position: 4, name },
        ],
      },
    ],
  };

  const facts: [string, string][] = [
    [T.period, `${v.from} – ${v.to}`],
    [T.duration, fill(T.durationVal, v)],
    [T.peak, fill(T.peakVal, v)],
    [T.area, fill(T.areaVal, v)],
  ];

  return (
    <main lang={lang} dir={dir} className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="breadcrumb" className="label-mono mb-6 flex flex-wrap gap-x-2 text-xs uppercase text-muted">
        <Link href={langPath("/", lang)} className="hover:text-accent">{T.crumbHome}</Link>
        <span>/</span>
        <Link href={langPath("/imperien", lang)} className="hover:text-accent">{T.crumbMap}</Link>
        <span>/</span>
        <Link href={langPath("/imperien/reiche", lang)} className="hover:text-accent">{T.crumbAll}</Link>
      </nav>

      <p className="label-mono text-xs uppercase text-accent">// {T.eras[eraIndex(r.from)]}</p>
      <h1 className="font-display mt-2 text-2xl font-bold text-foreground sm:text-4xl">{name}</h1>
      {showEn && (
        <p className="mt-1 text-sm text-muted">
          {T.eng ? `${T.eng} ` : ""}
          <span lang="en">{r.en}</span>
        </p>
      )}

      <dl className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {facts.map(([k, val]) => (
          <div key={k} className="hud-card border border-border p-3">
            <dt className="label-mono text-[10px] uppercase text-muted">{k}</dt>
            <dd className="mt-1 text-sm text-foreground">{val}</dd>
          </div>
        ))}
      </dl>

      <figure className="hud-card mt-6 overflow-hidden border border-border">
        <svg viewBox={`0 0 ${r.map.w} ${r.map.h}`} className="block h-auto w-full" role="img" aria-label={fill(T.mapCaption, v)}>
          <rect width={r.map.w} height={r.map.h} fill="#071019" />
          <path d={r.map.land} fill="#1c2027" fillRule="evenodd" />
          <path d={r.map.shape} fill="rgba(255,90,77,0.5)" stroke="#ff5a4d" strokeWidth="2" strokeLinejoin="round" fillRule="evenodd" />
        </svg>
        <figcaption className="border-t border-border px-3 py-2 text-xs text-muted">{fill(T.mapCaption, v)}</figcaption>
      </figure>

      <Link
        href={`${langPath("/imperien", lang)}?jahr=${r.peakYear}`}
        className="mt-4 inline-block border border-accent px-4 py-2.5 text-sm uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-black"
      >
        ▶ {T.openMap}
      </Link>

      <section className="mt-10">
        <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">{T.h2Period}</h2>
        <p className="mt-3 leading-relaxed text-foreground/90">{fill(T.pPeriod, v)}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">{T.h2Peak}</h2>
        <p className="mt-3 leading-relaxed text-foreground/90">{fill(T.pPeak, v)}</p>
        <AreaChart r={r} lang={lang} />
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">{T.h2Rel}</h2>
        <p className="mt-3 text-sm text-muted">{T.pRel}</p>
        <h3 className="label-mono mt-4 text-xs uppercase text-accent">
          {fill(T.before, { year: formatYearL(r.from === 1 ? -1 : r.from - 1, lang) })}
        </h3>
        <div className="mt-2">
          <RefList items={r.pred} empty={T.noPred} lang={lang} />
        </div>
        <h3 className="label-mono mt-4 text-xs uppercase text-accent">{T.after}</h3>
        <div className="mt-2">
          <RefList items={r.succ} empty={T.noSucc} lang={lang} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">{fill(T.h2Neigh, v)}</h2>
        <p className="mt-3 text-sm text-muted">{T.pNeigh}</p>
        <div className="mt-3">
          <RefList items={r.cont} empty={T.noNeigh} lang={lang} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">{T.h2More}</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link href={`${langPath("/imperien", lang)}?jahr=${r.peakYear}`} className="text-accent hover:underline">
              {fill(T.moreMap, v)}
            </Link>{" "}
            {T.moreMapHint}
          </li>
          <li>
            <a
              href={`https://${wikiLang}.wikipedia.org/w/index.php?search=${encodeURIComponent(wikiQuery)}`}
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {fill(T.moreWiki, v)}
            </a>
          </li>
          <li>
            <Link href={langPath("/imperien/reiche", lang)} className="text-accent hover:underline">
              {fill(T.moreAll, { n: REICHE_INDEX.length })}
            </Link>
          </li>
        </ul>
      </section>

      <p className="mt-12 border-t border-border pt-4 text-xs text-muted">{T.footer}</p>
    </main>
  );
}
