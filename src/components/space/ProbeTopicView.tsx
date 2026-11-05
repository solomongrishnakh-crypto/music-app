import type { Metadata } from "next";
import Link from "next/link";
import type { Topic, TopicLang } from "@/lib/probeTopics";
import { TOPICS } from "@/lib/probeTopics";
import { findSkyEntry, skyName } from "@/lib/skyPosData";
import { BASE_URL, langPath } from "@/lib/seoI18n";

/** Themenseite zu einer Sonden-Botschaft (/goldene-schallplatte, /pioneer-plakette), Deutsch und Englisch. */
const img = (f: string, w: number) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(f)}?width=${w}`;
const langs = (path: string) => ({ de: langPath(path, "de"), en: langPath(path, "en"), "x-default": langPath(path, "en") });

const UI = {
  de: { home: "Start", pos: "Wo ist die Sonde jetzt am Himmel?", others: "Mehr zu den Sonden", credit: "Bilder: NASA, gemeinfrei (Wikimedia Commons)." },
  en: { home: "Home", pos: "Where is the probe in the sky now?", others: "More about the probes", credit: "Images: NASA, public domain (Wikimedia Commons)." },
} as const;

export function topicMetadata(t: Topic, lang: TopicLang): Metadata {
  const x = t[lang];
  const url = langPath(t.path, lang);
  return {
    title: { absolute: `${x.title} | CENTAURIAN` },
    description: x.desc,
    alternates: { canonical: url, languages: langs(t.path) },
    openGraph: {
      type: "article", siteName: "Centaurian", locale: lang === "de" ? "de_DE" : "en_US", url, title: x.title, description: x.desc,
      images: [{ url: img(t.images[0].f, 1200), alt: x.h1 }],
    },
    twitter: { card: "summary_large_image", title: x.title, description: x.desc, images: [img(t.images[0].f, 1200)] },
  };
}

export default function ProbeTopicView({ t, lang }: { t: Topic; lang: TopicLang }) {
  const x = t[lang];
  const U = UI[lang];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: x.h1,
    description: x.desc,
    inLanguage: lang,
    url: BASE_URL + langPath(t.path, lang),
    image: img(t.images[0].f, 1200),
    publisher: { "@type": "Organization", name: "Centaurian", url: BASE_URL },
  };
  return (
    <main lang={lang} className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="breadcrumb" className="label-mono mb-6 flex flex-wrap gap-x-2 text-xs uppercase text-muted">
        <Link href={langPath("/", lang)} className="hover:text-accent">{U.home}</Link>
        <span>/</span>
        <span>{x.h1}</span>
      </nav>
      <h1 className="font-display text-3xl font-bold text-foreground sm:text-5xl">{x.h1}</h1>
      <p className="mt-5 text-lg leading-relaxed text-foreground">{x.lead}</p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {t.images.map((im) => (
          <li key={im.f}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img(im.f, 700)} alt={im.c[lang]} loading={im === t.images[0] ? "eager" : "lazy"} className="hud-card aspect-square w-full border border-border bg-black object-contain" />
            <span className="mt-1 block text-[11px] leading-snug text-muted">{im.c[lang]}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {x.facts.map(([l, v]) => (
          <div key={l} className="hud-card border border-border p-3">
            <dt className="label-mono text-[10px] uppercase text-muted">{l}</dt>
            <dd className="mt-1 text-sm text-foreground">{v}</dd>
          </div>
        ))}
      </dl>

      {x.sections.map((s) => (
        <section key={s.h} className="mt-8">
          <h2 className="font-display text-lg font-bold text-foreground">{s.h}</h2>
          {s.p.map((p) => (
            <p key={p.slice(0, 24)} className="mt-2 leading-relaxed text-foreground/90">{p}</p>
          ))}
        </section>
      ))}

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-foreground">{U.pos}</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {t.probes.map((id) => {
            const e = findSkyEntry(id);
            return e ? (
              <li key={id}>
                <Link href={langPath(`/himmelsposition/${id}`, lang)} className="inline-block border border-accent px-4 py-2 text-sm text-accent transition-colors hover:bg-accent hover:text-black">
                  {skyName(e, lang)} →
                </Link>
              </li>
            ) : null;
          })}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-foreground">{U.others}</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {TOPICS.filter((o) => o.id !== t.id).map((o) => (
            <li key={o.id}>
              <Link href={langPath(o.path, lang)} className="inline-block border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent">{o[lang].h1}</Link>
            </li>
          ))}
          {t.probes.map((id) => (
            <li key={id}>
              <Link href={langPath(`/sonnensystem/${id}`, lang)} className="inline-block border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent">
                {skyName(findSkyEntry(id)!, lang)}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <p className="mt-12 border-t border-border pt-4 text-xs text-muted">{U.credit}</p>
    </main>
  );
}
