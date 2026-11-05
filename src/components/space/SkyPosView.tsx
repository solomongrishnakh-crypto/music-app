import type { Metadata } from "next";
import Link from "next/link";
import type { Lang } from "@/contexts/LanguageContext";
import { fill } from "@/lib/history/reicheText";
import { spaceTexts } from "@/lib/spaceText";
import { BASE_URL, OG_LOCALE, hreflang, langPath } from "@/lib/seoI18n";
import { SKYPOS } from "@/lib/skyPosText";
import { SKY_ENTRIES, skyName, type SkyEntry } from "@/lib/skyPosData";
import { bodySkyPos, constellationAtEq, fmtDec, fmtRa, maxAltitude } from "@/lib/astro/skyPos";
import CONST from "@/data/sternbilder.json";
import { SPACE_BODIES } from "./bodies";

/**
 * "Wo steht X am Himmel?" – eine Seite pro Planet, Raumsonde, bekanntem Stern und Nebel/Galaxie
 * (/himmelsposition/<id>, in 15 Sprachen). Raumsonden und Planeten: Position aus den Bahndaten,
 * Seite wird stündlich neu berechnet.
 */
const NUM_LOCALE: Record<Lang, string> = {
  de: "de-DE", en: "en-US", es: "es-ES", fr: "fr-FR", pt: "pt-BR", tr: "tr-TR", ru: "ru-RU",
  el: "el-GR", ar: "ar", hi: "hi-IN", zh: "zh-CN", ja: "ja-JP", ko: "ko-KR", id: "id-ID", fa: "fa-IR",
};
const PLANET_JUMP = /^(mercury|venus|mars|jupiter|saturn|uranus|neptune)$/;

type ConstRow = { abbr: string; la: string; names: Record<string, string> };
const CONSTS = CONST as unknown as ConstRow[];

function conName(abbr: string | null, lang: Lang): string {
  const c = CONSTS.find((x) => x.abbr === abbr);
  if (!c) return "–";
  return c.names[lang] ?? c.names.en ?? c.la;
}

interface Computed {
  name: string;
  con: string;
  ra: string;
  dec: string;
  dist: string;
  distLabel: string;
  alt: number;
  moving: boolean;
  decDeg: number;
  date: string;
}

function compute(e: SkyEntry, lang: Lang): Computed | null {
  const T = spaceTexts(lang);
  const S = SKYPOS[lang];
  const name = skyName(e, lang);
  let raDeg: number, decDeg: number, dist: string;
  const nf = (v: number, d: number) => v.toLocaleString(NUM_LOCALE[lang], { maximumFractionDigits: d });
  const now = new Date();
  if (e.kind === "body") {
    const p = bodySkyPos(e.id, now);
    if (!p || p.au === undefined || !(p.au > 0)) return null;
    raDeg = p.raDeg;
    decDeg = p.decDeg;
    const mkm = (p.au * 149_597_870.7) / 1e6;
    dist = `${nf(p.au, p.au < 10 ? 2 : 1)} ${T.au} (≈ ${nf(mkm, mkm < 1000 ? 1 : 0)} ${T.millionKm})`;
  } else {
    raDeg = e.ra!;
    decDeg = e.dec!;
    dist = `${nf(e.ly!, e.ly! < 100 ? 1 : 0)} ${S.ly}`;
  }
  const date = new Intl.DateTimeFormat(NUM_LOCALE[lang], { dateStyle: "long", timeStyle: "short", timeZone: "UTC" }).format(now);
  return {
    name,
    con: conName(constellationAtEq(raDeg, decDeg), lang),
    ra: fmtRa(raDeg),
    dec: fmtDec(decDeg),
    dist,
    distLabel: S.labDist,
    alt: maxAltitude(decDeg),
    moving: e.kind === "body",
    decDeg,
    date,
  };
}

export function skyPosMetadata(e: SkyEntry, lang: Lang): Metadata {
  const S = SKYPOS[lang];
  const c = compute(e, lang);
  const name = skyName(e, lang);
  const title = fill(S.title, { name });
  const description = c
    ? fill(c.moving ? S.descMoving : S.descFixed, { name, con: c.con, ra: c.ra, dec: c.dec, dist: c.dist })
    : fill(S.h1, { name });
  const path = `/himmelsposition/${e.id}`;
  const url = langPath(path, lang);
  return {
    title: { absolute: `${title} | CENTAURIAN` },
    description,
    alternates: { canonical: url, languages: hreflang(path) },
    openGraph: { type: "article", siteName: "Centaurian", locale: OG_LOCALE[lang], url, title, description },
    twitter: { card: "summary", title, description },
  };
}

export function skyPosIndexMetadata(lang: Lang): Metadata {
  const S = SKYPOS[lang];
  const path = "/himmelsposition";
  const url = langPath(path, lang);
  return {
    title: { absolute: `${S.idxTitle} | CENTAURIAN` },
    description: S.idxDesc,
    alternates: { canonical: url, languages: hreflang(path) },
    openGraph: { type: "website", siteName: "Centaurian", locale: OG_LOCALE[lang], url, title: S.idxTitle, description: S.idxDesc },
    twitter: { card: "summary", title: S.idxTitle, description: S.idxDesc },
  };
}

function skyLink(e: SkyEntry, lang: Lang): string {
  const base = langPath("/sternenhimmel", lang);
  if (e.kind === "body" && PLANET_JUMP.test(e.id)) return `${base}?p=${e.id}`;
  if (e.kind === "dso") return `${base}?d=${e.dsoId}`;
  return base;
}

const dir = (lang: Lang) => (lang === "ar" || lang === "fa" ? "rtl" : "ltr");

export default function SkyPosView({ e, lang }: { e: SkyEntry; lang: Lang }) {
  const T = spaceTexts(lang);
  const S = SKYPOS[lang];
  const c = compute(e, lang);
  if (!c) return null;
  const vars = { name: c.name, con: c.con, ra: c.ra, dec: c.dec, dist: c.dist, date: c.date, alt: c.alt };
  const answer = fill(c.moving ? S.ansMoving : S.ansFixed, vars);
  const body = e.kind === "body" ? SPACE_BODIES.find((b) => b.id === e.id) : undefined;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: fill(S.title, vars),
      url: BASE_URL + langPath(`/himmelsposition/${e.id}`, lang),
      inLanguage: lang,
      isPartOf: { "@type": "WebSite", name: "Centaurian", url: BASE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: lang,
      mainEntity: [
        { "@type": "Question", name: fill(S.h1, vars), acceptedAnswer: { "@type": "Answer", text: answer } },
      ],
    },
  ];
  const groups: { title: string; items: SkyEntry[] }[] = [
    { title: S.gBodies, items: SKY_ENTRIES.filter((x) => x.kind === "body") },
    { title: S.gDso, items: SKY_ENTRIES.filter((x) => x.kind === "dso") },
  ];
  const facts: [string, string][] = [
    [S.labCon, c.con],
    [S.labRa, c.ra],
    [S.labDec, c.dec],
    [S.labDist, c.dist],
  ];
  return (
    <main lang={lang} dir={dir(lang)} className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6">
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
      <nav aria-label="breadcrumb" className="label-mono mb-6 flex flex-wrap gap-x-2 text-xs uppercase text-muted">
        <Link href={langPath("/", lang)} className="hover:text-accent">{T.crumbHome}</Link>
        <span>/</span>
        <Link href={langPath("/himmelsposition", lang)} className="hover:text-accent">{S.crumbSky}</Link>
      </nav>
      <h1 className="font-display text-3xl font-bold text-foreground sm:text-5xl">{fill(S.h1, vars)}</h1>
      <p className="mt-5 text-lg leading-relaxed text-foreground">{answer}</p>

      <dl className="mt-6 grid grid-cols-2 gap-2">
        {facts.map(([l, v]) => (
          <div key={l} className="hud-card border border-border p-3">
            <dt className="label-mono text-[10px] uppercase text-muted">{l}</dt>
            <dd className="mt-1 text-sm text-foreground">{v}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-foreground">{S.howH}</h2>
        <p className="mt-2 leading-relaxed text-foreground/90">
          {fill(c.alt > 0 ? S.how1 : S.howNever, vars)} {S.howSky}
        </p>
        {e.probe && <p className="mt-3 leading-relaxed text-foreground/90">{fill(S.probeNote, vars)}</p>}
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={skyLink(e, lang)}
          className="inline-block border border-accent px-4 py-2.5 text-sm uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-black"
        >
          ▶ {S.cta}
        </Link>
        {body && (
          <Link
            href={langPath(`/sonnensystem/${body.id}`, lang)}
            className="inline-block border border-border px-4 py-2.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            {c.name}
          </Link>
        )}
        {e.kind === "star" && (
          <Link
            href={langPath(`/sterne/${e.id}`, lang === "de" ? "de" : "en")}
            className="inline-block border border-border px-4 py-2.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            {c.name}
          </Link>
        )}
      </div>

      <section className="mt-10">
        <h2 className="font-display text-lg font-bold text-foreground">{S.more}</h2>
        {groups.map((g) => (
          <div key={g.title} className="mt-3">
            <p className="label-mono text-[10px] uppercase text-muted">{g.title}</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {g.items.filter((o) => o.id !== e.id).map((o) => (
                <li key={o.id}>
                  <Link
                    href={langPath(`/himmelsposition/${o.id}`, lang)}
                    className="inline-block border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    {skyName(o, lang)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="mt-3">
          <Link href={langPath("/himmelsposition", lang)} className="text-sm text-accent hover:underline">
            {S.idxTitle} →
          </Link>
        </p>
      </section>
      <p className="mt-12 border-t border-border pt-4 text-xs text-muted">{S.credit}</p>
    </main>
  );
}

export function SkyPosIndexView({ lang }: { lang: Lang }) {
  const T = spaceTexts(lang);
  const S = SKYPOS[lang];
  const groups: { title: string; items: SkyEntry[] }[] = [
    { title: S.gBodies, items: SKY_ENTRIES.filter((x) => x.kind === "body") },
    { title: S.gStars, items: SKY_ENTRIES.filter((x) => x.kind === "star") },
    { title: S.gDso, items: SKY_ENTRIES.filter((x) => x.kind === "dso") },
  ];
  return (
    <main lang={lang} dir={dir(lang)} className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6">
      <nav aria-label="breadcrumb" className="label-mono mb-6 flex flex-wrap gap-x-2 text-xs uppercase text-muted">
        <Link href={langPath("/", lang)} className="hover:text-accent">{T.crumbHome}</Link>
        <span>/</span>
        <span>{S.crumbSky}</span>
      </nav>
      <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">{S.idxTitle}</h1>
      <p className="mt-4 leading-relaxed text-foreground/90">{S.idxIntro}</p>
      {groups.map((g) => (
        <section key={g.title} className="mt-8">
          <h2 className="font-display text-lg font-bold text-foreground">{g.title}</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {g.items.map((o) => (
              <li key={o.id}>
                <Link
                  href={langPath(`/himmelsposition/${o.id}`, lang)}
                  className="inline-block border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  {skyName(o, lang)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="mt-12 border-t border-border pt-4 text-xs text-muted">{S.credit}</p>
    </main>
  );
}
