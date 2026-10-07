import type { Metadata } from "next";
import Link from "next/link";
import type { Lang } from "@/contexts/LanguageContext";
import DATA from "@/data/sternbilder.json";
import { constTexts, formatLat } from "@/lib/constText";
import { fill } from "@/lib/history/reicheText";
import { BASE_URL, OG_LOCALE, hreflang, langPath } from "@/lib/seoI18n";

/**
 * Seite pro Sternbild (/sternbilder/orion, /en/sternbilder/orion …) —
 * Nutzerwunsch 07.10.2026. Daten: src/data/sternbilder.json (aus denselben
 * Quellen wie der Sternenhimmel: HYG-Sterne, IAU-Grenzen, Sternbildlinien).
 */
export interface Constellation {
  abbr: string;
  slug: string;
  la: string;
  names: Partial<Record<Lang, string>>;
  ra: number;
  dec: number;
  dmin: number;
  dmax: number;
  nstars: number;
  fig: { b: string; l: string; s: [number, number, number][] };
  top: { d: string; n: string; m: number; ly: number }[];
  rank: number;
}

export const CONSTELLATIONS = DATA as unknown as Constellation[];

export function findConst(slug: string): Constellation | undefined {
  return CONSTELLATIONS.find((c) => c.slug === slug);
}

const NUM_LOCALE: Record<Lang, string> = {
  de: "de-DE", en: "en-US", es: "es-ES", fr: "fr-FR", pt: "pt-BR", tr: "tr-TR", ru: "ru-RU",
  el: "el-GR", ar: "ar", hi: "hi-IN", zh: "zh-CN", ja: "ja-JP", ko: "ko-KR",
};

export function constName(c: Constellation, lang: Lang): string {
  // Englisch: international gesucht wird nach dem lateinischen Namen ("Aquila")
  if (lang === "en") return c.la;
  return c.names[lang] ?? c.la;
}

/** Zweitname unter der Überschrift (lateinisch bzw. englische Bedeutung) */
function subName(c: Constellation, lang: Lang): string | null {
  if (lang === "en") return c.names.en && c.names.en !== c.la ? `“${c.names.en}”` : null;
  return constName(c, lang) !== c.la ? c.la : null;
}

/** Monat, in dem das Sternbild gegen 21 Uhr am höchsten steht. */
function bestMonth(c: Constellation, lang: Lang): string {
  const days = (((c.ra / 15 + 3) / 24) * 365.25) % 365.25;
  const d = new Date(Date.UTC(2026, 8, 21) + days * 86_400_000);
  return new Intl.DateTimeFormat(NUM_LOCALE[lang], { month: "long", timeZone: "UTC" }).format(d);
}

function latRange(c: Constellation, lang: Lang): { north: string; south: string } {
  const north = Math.min(90, 90 + c.dmin);
  const south = Math.max(-90, c.dmax - 90);
  return { north: formatLat(north, lang), south: formatLat(south, lang) };
}

function starLabel(s: Constellation["top"][number]): string {
  return s.n || s.d;
}

function vars(c: Constellation, lang: Lang) {
  const top = c.top[0];
  const nf = (n: number, d = 0) => n.toLocaleString(NUM_LOCALE[lang], { maximumFractionDigits: d });
  return {
    name: constName(c, lang),
    la: constName(c, lang) === c.la ? "" : c.la,
    month: bestMonth(c, lang),
    ...latRange(c, lang),
    star: top ? starLabel(top) : "—",
    mag: top ? nf(top.m, 2) : "—",
    ly: top && top.ly ? nf(top.ly) : "—",
  };
}

export function constMetadata(c: Constellation, lang: Lang): Metadata {
  const T = constTexts(lang);
  const v = vars(c, lang);
  const title = fill(T.title, v);
  const description = fill(T.desc, v);
  const path = `/sternbilder/${c.slug}`;
  const url = langPath(path, lang);
  const image = lang === "de" ? "/og/sternenhimmel.jpg" : "/og/sternenhimmel-en.jpg";
  return {
    title: { absolute: `${title} | CENTAURIAN` },
    description,
    alternates: { canonical: url, languages: hreflang(path) },
    openGraph: {
      type: "article",
      siteName: "Centaurian",
      locale: OG_LOCALE[lang],
      url,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: v.name }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default function ConstView({ c, lang }: { c: Constellation; lang: Lang }) {
  const T = constTexts(lang);
  const v = vars(c, lang);
  const nf = (n: number, d = 0) => n.toLocaleString(NUM_LOCALE[lang], { maximumFractionDigits: d });
  const facts: [string, string][] = [
    [T.latin, `${c.la} (${c.abbr})`],
    [T.best, fill(T.bestVal, v)],
    [T.visible, `${v.north} – ${v.south}`],
    [T.nakedEye, nf(c.nstars)],
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: fill(T.title, v),
    url: BASE_URL + langPath(`/sternbilder/${c.slug}`, lang),
    inLanguage: lang,
    about: { "@type": "Thing", name: c.la, alternateName: v.name },
    isPartOf: { "@type": "WebSite", name: "Centaurian", url: BASE_URL },
  };
  return (
    <main lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="breadcrumb" className="label-mono mb-6 flex flex-wrap gap-x-2 text-xs uppercase text-muted">
        <Link href={langPath("/", lang)} className="hover:text-accent">{T.crumbHome}</Link>
        <span>/</span>
        <Link href={langPath("/sternbilder", lang)} className="hover:text-accent">{T.crumbSky}</Link>
      </nav>
      <p className="label-mono text-xs uppercase text-accent">// {T.kind}</p>
      <h1 className="font-display mt-2 text-3xl font-bold text-foreground sm:text-5xl">{v.name}</h1>
      {subName(c, lang) && <p className="mt-1 text-sm text-muted">{subName(c, lang)}</p>}

      <figure className="hud-card mt-6 overflow-hidden border border-border bg-[#05071a]">
        <svg viewBox="0 0 600 600" className="block h-auto w-full" role="img" aria-label={fill(T.figCaption, v)}>
          <path d={c.fig.b} fill="none" stroke="rgba(255,90,77,0.35)" strokeWidth="1.2" strokeDasharray="4 5" />
          <path d={c.fig.l} fill="none" stroke="rgba(140,180,255,0.75)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          {c.fig.s.map(([x, y, m], i) => (
            <circle key={i} cx={x} cy={y} r={Math.max(0.8, 5.2 - m * 0.85)} fill="#fff" opacity={m < 3 ? 1 : 0.8} />
          ))}
        </svg>
        <figcaption className="border-t border-border px-3 py-2 text-xs text-muted">{fill(T.figCaption, v)}</figcaption>
      </figure>

      <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {facts.map(([k, val]) => (
          <div key={k} className="hud-card border border-border p-3">
            <dt className="label-mono text-[10px] uppercase text-muted">{k}</dt>
            <dd className="mt-1 text-sm text-foreground">{val}</dd>
          </div>
        ))}
      </dl>

      <Link
        href={`${langPath("/sternenhimmel", lang)}?c=${c.abbr}`}
        className="mt-5 inline-block border border-accent px-4 py-2.5 text-sm uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-black"
      >
        ▶ {T.openSky}
      </Link>

      <p className="mt-8 leading-relaxed text-foreground/90">
        {fill(T.intro, v).replace(/\s*[(（]\s*[)）]/, "")} {c.top[0] && fill(T.introStar, v)}
      </p>

      {c.top.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">{T.starsH2}</h2>
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="label-mono border-b border-border text-start text-[10px] uppercase text-muted">
                <th className="py-2 pe-3 text-start">{T.colStar}</th>
                <th className="py-2 pe-3 text-start">{T.colDes}</th>
                <th className="py-2 pe-3 text-start">{T.colMag}</th>
                <th className="py-2 text-start">{T.colDist}</th>
              </tr>
            </thead>
            <tbody>
              {c.top.map((s, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-1.5 pe-3 text-foreground">{s.n || "—"}</td>
                  <td className="py-1.5 pe-3 text-muted">{s.d || "—"}</td>
                  <td className="py-1.5 pe-3 text-foreground">{nf(s.m, 2)}</td>
                  <td className="py-1.5 text-foreground">{s.ly ? `${nf(s.ly)} ${T.ly}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section className="mt-10">
        <h2 className="font-display text-lg font-bold text-foreground">{T.others}</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {CONSTELLATIONS.filter((o) => o.rank <= 1 && o.slug !== c.slug).map((o) => (
            <li key={o.slug}>
              <Link
                href={langPath(`/sternbilder/${o.slug}`, lang)}
                className="inline-block border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                {constName(o, lang)}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <p className="mt-12 border-t border-border pt-4 text-xs text-muted">{T.credit}</p>
    </main>
  );
}

export function constIndexMetadata(lang: Lang): Metadata {
  const T = constTexts(lang);
  const url = langPath("/sternbilder", lang);
  const image = lang === "de" ? "/og/sternenhimmel.jpg" : "/og/sternenhimmel-en.jpg";
  return {
    title: { absolute: `${T.indexTitle} | CENTAURIAN` },
    description: T.indexDesc,
    alternates: { canonical: url, languages: hreflang("/sternbilder") },
    openGraph: { type: "website", siteName: "Centaurian", locale: OG_LOCALE[lang], url, title: T.indexTitle, description: T.indexDesc, images: [{ url: image, width: 1200, height: 630, alt: T.indexTitle }] },
  };
}

export function ConstIndexView({ lang }: { lang: Lang }) {
  const T = constTexts(lang);
  const collator = new Intl.Collator(lang);
  const list = [...CONSTELLATIONS].sort((a, b) => collator.compare(constName(a, lang), constName(b, lang)));
  return (
    <main lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} className="mx-auto max-w-4xl px-4 pb-16 pt-6 sm:px-6">
      <nav aria-label="breadcrumb" className="label-mono mb-6 flex flex-wrap gap-x-2 text-xs uppercase text-muted">
        <Link href={langPath("/", lang)} className="hover:text-accent">{T.crumbHome}</Link>
      </nav>
      <h1 className="font-display text-2xl font-bold text-foreground sm:text-4xl">{T.indexTitle}</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-foreground/90">{T.indexIntro}</p>
      <ul className="mt-8 grid gap-x-6 gap-y-1 sm:grid-cols-2">
        {list.map((c) => (
          <li key={c.slug} className="flex items-baseline justify-between gap-2 border-b border-border/60 py-1.5">
            <Link href={langPath(`/sternbilder/${c.slug}`, lang)} className="text-sm text-foreground hover:text-accent">
              {constName(c, lang)}
            </Link>
            <span className="label-mono shrink-0 text-[10px] text-muted">{c.la}</span>
          </li>
        ))}
      </ul>
      <Link
        href={langPath("/sternenhimmel", lang)}
        className="mt-8 inline-block border border-accent px-4 py-2.5 text-sm uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-black"
      >
        ▶ {T.openSky}
      </Link>
      <p className="mt-12 border-t border-border pt-4 text-xs text-muted">{T.credit}</p>
    </main>
  );
}
