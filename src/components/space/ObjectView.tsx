import type { Metadata } from "next";
import Link from "next/link";
import { FAMOUS, type FamousObject } from "@/lib/famousObjects";
import { BASE_URL, langPath } from "@/lib/seoI18n";

/**
 * Eigene Seite pro berühmtem Objekt (Sagittarius A*, TON 618, UY Scuti …),
 * Deutsch und Englisch. Texte und Bilder kommen aus derselben Quelle wie
 * die Sternenhimmel-Ansicht (src/lib/famousObjects.ts).
 */
export type OLang = "de" | "en";
export const findObject = (slug: string) => FAMOUS.find((o) => o.id === slug);

const T = {
  de: {
    home: "Start", index: "Berühmte Objekte", open: "Im Sternenhimmel zeigen", more: "Weitere berühmte Objekte",
    facts: "Kennzahlen", photos: "Bilder", art: "Künstlerbild", credit: "Bilder: NASA, ESA, ESO, Event Horizon Telescope, Wikimedia Commons. Künstlerbilder sind als solche markiert. Zahlen nach Fachveröffentlichungen, gerundet.",
    title: (n: string, k: string) => `${n} – ${k}: Fakten, Größe, Entfernung & Bilder`,
    desc: (n: string, k: string, t: string) => `${n} (${k}): ${t.slice(0, 120).replace(/\s+\S*$/, "")} … Fakten, Bilder und Position am Sternenhimmel.`,
    idxTitle: "Berühmte Objekte im Universum: Schwarze Löcher, Riesensterne, Nebel",
    idxDesc: "Sagittarius A*, TON 618, UY Scuti, VY Canis Majoris, Eta Carinae, R136a1, Cygnus X-1 und Proxima Centauri: Fakten, Größe, Entfernung und Bilder.",
    idxIntro: "Die bekanntesten und extremsten Objekte des Universums: das Schwarze Loch in unserer Milchstraße, ein Quasar mit Milliarden Sonnenmassen, die größten Sterne und unser nächster Nachbar. Jede Seite zeigt echte Fotos, Zahlen und die Position am Himmel.",
    ly: "Lichtjahre",
  },
  en: {
    home: "Home", index: "Famous objects", open: "Show in the night sky", more: "More famous objects",
    facts: "Key facts", photos: "Images", art: "Artist's impression", credit: "Images: NASA, ESA, ESO, Event Horizon Telescope, Wikimedia Commons. Artist's impressions are labelled as such. Figures from published research, rounded.",
    title: (n: string, k: string) => `${n} – ${k}: facts, size, distance & images`,
    desc: (n: string, k: string, t: string) => `${n} (${k}): ${t.slice(0, 120).replace(/\s+\S*$/, "")} … Facts, images and its position in the night sky.`,
    idxTitle: "Famous objects in the universe: black holes, giant stars, nebulae",
    idxDesc: "Sagittarius A*, TON 618, UY Scuti, VY Canis Majoris, Eta Carinae, R136a1, Cygnus X-1 and Proxima Centauri: facts, size, distance and images.",
    idxIntro: "The best-known and most extreme objects in the universe: the black hole in our Milky Way, a quasar with billions of solar masses, the largest stars and our nearest neighbour. Each page shows real photos, figures and the position in the sky.",
    ly: "light-years",
  },
} as const;

const img = (f: string, w: number) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(f)}?width=${w}`;
const langs = (path: string) => ({ de: langPath(path, "de"), en: langPath(path, "en"), "x-default": langPath(path, "en") });

export function objectMetadata(o: FamousObject, lang: OLang): Metadata {
  const t = T[lang], x = o[lang];
  const path = `/objekte/${o.id}`;
  const url = langPath(path, lang);
  const title = t.title(x.name, x.kind.split("·")[0].trim());
  const description = t.desc(x.name, x.kind.split("·")[0].trim(), x.text[0]);
  const image = o.imgs[0] ? img(o.imgs[0].f, 1200) : lang === "de" ? "/og/sternenhimmel.jpg" : "/og/sternenhimmel-en.jpg";
  return {
    title: { absolute: `${title} | CENTAURIAN` },
    description,
    alternates: { canonical: url, languages: langs(path) },
    openGraph: { type: "article", siteName: "Centaurian", locale: lang === "de" ? "de_DE" : "en_US", url, title, description, images: [{ url: image, alt: x.name }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export function objectIndexMetadata(lang: OLang): Metadata {
  const t = T[lang];
  const url = langPath("/objekte", lang);
  return {
    title: { absolute: `${t.idxTitle} | CENTAURIAN` },
    description: t.idxDesc,
    alternates: { canonical: url, languages: langs("/objekte") },
    openGraph: { type: "website", siteName: "Centaurian", locale: lang === "de" ? "de_DE" : "en_US", url, title: t.idxTitle, description: t.idxDesc, images: [{ url: lang === "de" ? "/og/sternenhimmel.jpg" : "/og/sternenhimmel-en.jpg", width: 1200, height: 630 }] },
  };
}

const card = "hud-card border border-border p-3";
const linkCls = "inline-block border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent";

export function ObjectView({ o, lang }: { o: FamousObject; lang: OLang }) {
  const t = T[lang], x = o[lang];
  const path = `/objekte/${o.id}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: x.name + " – " + x.kind,
    description: x.text[0],
    inLanguage: lang,
    url: BASE_URL + langPath(path, lang),
    image: o.imgs[0] ? img(o.imgs[0].f, 1200) : undefined,
    about: { "@type": "Thing", name: x.name, sameAs: `https://en.wikipedia.org/wiki/${encodeURIComponent(o.wiki.replace(/ /g, "_"))}` },
    publisher: { "@type": "Organization", name: "Centaurian", url: BASE_URL },
  };
  return (
    <main lang={lang} className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="breadcrumb" className="label-mono mb-6 flex flex-wrap gap-x-2 text-xs uppercase text-muted">
        <Link href={langPath("/", lang)} className="hover:text-accent">{t.home}</Link>
        <span>/</span>
        <Link href={langPath("/objekte", lang)} className="hover:text-accent">{t.index}</Link>
      </nav>
      <p className="label-mono text-xs uppercase text-accent">{x.kind}</p>
      <h1 className="font-display mt-2 text-3xl font-bold text-foreground sm:text-5xl">{x.name}</h1>

      {o.imgs[0] && (
        <figure className="hud-card mt-6 overflow-hidden border border-border bg-[#05071a]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img(o.imgs[0].f, 1000)} alt={o.imgs[0].c} loading="eager" className="block h-auto w-full" />
          <figcaption className="border-t border-border px-3 py-2 text-xs text-muted">{o.imgs[0].a ? `${t.art}: ` : ""}{o.imgs[0].c}</figcaption>
        </figure>
      )}

      <Link href={`${langPath("/sternenhimmel", lang)}?d=${o.id}`} className="mt-5 inline-block border border-accent px-4 py-2.5 text-sm uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-black">
        ▶ {t.open}
      </Link>

      <div className="mt-8 space-y-4 leading-relaxed text-foreground/90">
        {x.text.map((p, i) => <p key={i}>{p}</p>)}
      </div>

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">{t.facts}</h2>
        <dl className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {x.rows.map(([k, v]) => (
            <div key={k} className={card}>
              <dt className="label-mono text-[10px] uppercase text-muted">{k}</dt>
              <dd className="mt-1 text-sm text-foreground">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {o.imgs.length > 1 && (
        <section className="mt-10">
          <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">{t.photos}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {o.imgs.slice(1).map((im) => (
              <figure key={im.f} className="hud-card overflow-hidden border border-border bg-[#05071a]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(im.f, 600)} alt={im.c} loading="lazy" className="block h-auto w-full" />
                <figcaption className="border-t border-border px-3 py-2 text-xs text-muted">{im.a ? `${t.art}: ` : ""}{im.c}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="font-display text-lg font-bold text-foreground">{t.more}</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {FAMOUS.filter((f) => f.id !== o.id).map((f) => (
            <li key={f.id}><Link href={langPath(`/objekte/${f.id}`, lang)} className={linkCls}>{f[lang].name}</Link></li>
          ))}
        </ul>
      </section>
      <p className="mt-12 border-t border-border pt-4 text-xs text-muted">{t.credit}</p>
    </main>
  );
}

export function ObjectIndexView({ lang }: { lang: OLang }) {
  const t = T[lang];
  return (
    <main lang={lang} className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6">
      <nav aria-label="breadcrumb" className="label-mono mb-6 text-xs uppercase text-muted">
        <Link href={langPath("/", lang)} className="hover:text-accent">{t.home}</Link>
      </nav>
      <h1 className="font-display text-3xl font-bold text-foreground sm:text-5xl">{t.index}</h1>
      <p className="mt-4 leading-relaxed text-foreground/90">{t.idxIntro}</p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {FAMOUS.map((f) => (
          <li key={f.id}>
            <Link href={langPath(`/objekte/${f.id}`, lang)} className="hud-card block h-full border border-border p-4 transition-colors hover:border-accent">
              <span className="label-mono text-[10px] uppercase text-accent">{f[lang].kind}</span>
              <span className="font-display mt-1 block text-xl font-bold text-foreground">{f[lang].name}</span>
              <span className="mt-2 block text-sm text-muted">{f[lang].text[0].slice(0, 140).replace(/\s+\S*$/, "")} …</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
