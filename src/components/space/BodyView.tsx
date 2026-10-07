import type { Metadata } from "next";
import Link from "next/link";
import type { Lang } from "@/contexts/LanguageContext";
import type { PlanetData } from "@/data/solarSystem";
import { localize } from "@/lib/i18n";
import { TRANSLATIONS } from "@/lib/translations";
import { spaceTexts } from "@/lib/spaceText";
import { fill } from "@/lib/history/reicheText";
import { BASE_URL, OG_LOCALE, hreflang, langPath } from "@/lib/seoI18n";
import LiveDistance from "./LiveDistance";
import { SPACE_BODIES } from "./bodies";

/**
 * Eigene Seite pro Himmelskörper, z. B. /sonnensystem/mars oder
 * /en/sonnensystem/mars (Nutzerwunsch 07.10.2026: auch Sonnensystem soll
 * international gefunden werden). Inhalte aus data/solarSystem.ts (13 Sprachen).
 */
const NUM_LOCALE: Record<Lang, string> = {
  de: "de-DE", en: "en-US", es: "es-ES", fr: "fr-FR", pt: "pt-BR", tr: "tr-TR", ru: "ru-RU",
  el: "el-GR", ar: "ar", hi: "hi-IN", zh: "zh-CN", ja: "ja-JP", ko: "ko-KR",
};

function tr(key: "distanceToSun" | "orbitalPeriod" | "diameter" | "moons" | "kindStar" | "kindDwarf" | "kindProbe" | "kindPlanet", lang: Lang): string {
  const e = TRANSLATIONS[key] as unknown as Record<string, string>;
  return e[lang] ?? e.en;
}

function kindLabel(b: PlanetData, lang: Lang): string {
  if (b.kind === "star") return tr("kindStar", lang);
  if (b.kind === "dwarf") return tr("kindDwarf", lang);
  if (b.kind === "probe") return tr("kindProbe", lang);
  return tr("kindPlanet", lang);
}

export function bodyMetadata(b: PlanetData, lang: Lang): Metadata {
  const T = spaceTexts(lang);
  const name = localize(b.name, lang);
  const title = fill(T.bodyTitle, { name });
  // Sonne/Voyager haben eigene Kennzahlen (factLabels) — dann diese nennen
  const description = b.factLabels
    ? `${name}: ${[b.facts.distance, b.facts.period, b.facts.diameter]
        .map((v, i) => `${localize(b.factLabels![i], lang)} ${localize(v, lang)}`)
        .join(" · ")}. ${T.solarIntro}`
    : fill(T.bodyDesc, {
        name,
        diameter: localize(b.facts.diameter, lang),
        distance: localize(b.facts.distance, lang),
      });
  const path = `/sonnensystem/${b.id}`;
  const url = langPath(path, lang);
  const images = b.image ? [{ url: b.image.replace("width=700", "width=1200"), alt: name }] : undefined;
  return {
    title: { absolute: `${title} | CENTAURIAN` },
    description,
    alternates: { canonical: url, languages: hreflang(path) },
    openGraph: { type: "article", siteName: "Centaurian", locale: OG_LOCALE[lang], url, title, description, images },
    twitter: { card: "summary_large_image", title, description, images: images?.map((i) => i.url) },
  };
}

export default function BodyView({ b, lang }: { b: PlanetData; lang: Lang }) {
  const T = spaceTexts(lang);
  const name = localize(b.name, lang);
  const labels = b.factLabels
    ? b.factLabels.map((l) => localize(l, lang))
    : [tr("distanceToSun", lang), tr("orbitalPeriod", lang), tr("diameter", lang), tr("moons", lang)];
  const values = [b.facts.distance, b.facts.period, b.facts.diameter, b.facts.moons].map((v) => localize(v, lang));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: fill(T.bodyTitle, { name }),
    url: BASE_URL + langPath(`/sonnensystem/${b.id}`, lang),
    inLanguage: lang,
    about: { "@type": "Thing", name },
    isPartOf: { "@type": "WebSite", name: "Centaurian", url: BASE_URL },
  };
  return (
    <main lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="breadcrumb" className="label-mono mb-6 flex flex-wrap gap-x-2 text-xs uppercase text-muted">
        <Link href={langPath("/", lang)} className="hover:text-accent">{T.crumbHome}</Link>
        <span>/</span>
        <Link href={langPath("/sonnensystem", lang)} className="hover:text-accent">{T.crumbSolar}</Link>
      </nav>
      <p className="label-mono text-xs uppercase text-accent">// {kindLabel(b, lang)}</p>
      <h1 className="font-display mt-2 text-3xl font-bold text-foreground sm:text-5xl">{name}</h1>

      <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_1.2fr]">
        {b.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={b.image}
            alt={name}
            loading="eager"
            className="hud-card aspect-square w-full border border-border bg-black object-cover"
          />
        )}
        <div>
          <div className="hud-card border border-accent/60 p-4">
            <p className="label-mono text-[10px] uppercase text-accent">{T.liveDist}</p>
            <p className="mt-1 text-lg text-foreground">
              <LiveDistance id={b.id} locale={NUM_LOCALE[lang]} auLabel={T.au} millionKmLabel={T.millionKm} />
            </p>
            <p className="mt-1 text-[11px] text-muted">{T.liveHint}</p>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-2">
            {labels.map((l, i) => (
              <div key={l} className="hud-card border border-border p-3">
                <dt className="label-mono text-[10px] uppercase text-muted">{l}</dt>
                <dd className="mt-1 text-sm text-foreground">{values[i]}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <p className="mt-8 leading-relaxed text-foreground/90">{localize(b.description, lang)}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={langPath("/universum", lang)}
          className="inline-block border border-accent px-4 py-2.5 text-sm uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-black"
        >
          ▶ {T.open3d}
        </Link>
        <a
          href={`https://${lang}.wikipedia.org/w/index.php?search=${encodeURIComponent(name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border border-border px-4 py-2.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          {fill(T.wiki, { name })}
        </a>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-lg font-bold text-foreground">{T.others}</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {SPACE_BODIES.filter((o) => o.id !== b.id).map((o) => (
            <li key={o.id}>
              <Link
                href={langPath(`/sonnensystem/${o.id}`, lang)}
                className="inline-block border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                {localize(o.name, lang)}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <p className="mt-12 border-t border-border pt-4 text-xs text-muted">{T.credit}</p>
    </main>
  );
}
