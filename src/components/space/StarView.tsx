import type { Metadata } from "next";
import Link from "next/link";
import { STARS, type StarRow } from "@/lib/starPages";
import { BASE_URL, langPath } from "@/lib/seoI18n";

/**
 * Eigene Seite pro bekanntem Stern (Sirius, Beteigeuze, Rigel …), Deutsch und
 * Englisch. Alle Zahlen stammen aus dem Sternenhimmel-Katalog; Leuchtkraft und
 * Sichtbarkeit werden daraus berechnet (Näherung, im sichtbaren Licht).
 */
export type SLang = "de" | "en";
export const findStar = (slug: string) => STARS.find((s) => s[0] === slug);

const MONTHS = {
  de: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
} as const;

const COLORS = {
  de: { O: "blauer", B: "blauer", A: "blauweißer", F: "gelblich-weißer", G: "gelber", K: "oranger", M: "roter", W: "blauer" },
  en: { O: "blue", B: "blue", A: "blue-white", F: "yellow-white", G: "yellow", K: "orange", M: "red", W: "blue" },
} as const;
const COLOR_NOUN = {
  de: { O: "Blau", B: "Blau", A: "Blauweiß", F: "Gelblich-weiß", G: "Gelb", K: "Orange", M: "Rot", W: "Blau" },
  en: { O: "Blue", B: "Blue", A: "Blue-white", F: "Yellow-white", G: "Yellow", K: "Orange", M: "Red", W: "Blue" },
} as const;

type Kind = "wr" | "super" | "bright" | "giant" | "sub" | "main" | "star";
function kindOf(sp: string): { letter: keyof typeof COLORS.de; kind: Kind } {
  const m = /^(WC|WN|[OBAFGKM])[0-9.]*(.*)$/.exec(sp);
  const l = (m ? m[1][0] : "A") as keyof typeof COLORS.de;
  const s = m ? m[2] : "";
  if (m && m[1][0] === "W") return { letter: "W", kind: "wr" };
  const kind: Kind = s.startsWith("III") ? "giant" : s.startsWith("IV") ? "sub" : s.startsWith("II") ? "bright" : s.startsWith("I") ? "super" : s.startsWith("V") ? "main" : "star";
  return { letter: l, kind };
}
const KIND = {
  de: { wr: "Wolf-Rayet-Stern", super: "Überriese", bright: "heller Riese", giant: "Riese", sub: "Unterriese", main: "Hauptreihenstern", star: "Stern" },
  en: { wr: "Wolf-Rayet star", super: "supergiant", bright: "bright giant", giant: "giant", sub: "subgiant", main: "main-sequence star", star: "star" },
} as const;

const fmt = (n: number, lang: SLang, d = 0) => n.toLocaleString(lang === "de" ? "de-DE" : "en-US", { maximumFractionDigits: d });
const lumOf = (s: StarRow) => {
  const M = s[4] - 5 * Math.log10(s[5] / 3.26156 / 10);
  return Math.pow(10, (4.83 - M) / 2.5);
};
const hm = (ra: number, lang: SLang) => {
  const h = ra / 15, hh = Math.floor(h), mm = Math.round((h - hh) * 60);
  return lang === "de" ? `${hh} h ${mm} min` : `${hh}h ${mm}m`;
};

function bestMonth(ra: number, lang: SLang) {
  // Opposition zur Sonne: Sonne hat am 21. März RA 0°; ein Stern mit RA culminiert um Mitternacht, wenn die Sonne bei RA-180° steht
  const days = (((ra - 180) % 360) + 360) % 360 / 360 * 365.25;
  const d = new Date(Date.UTC(2001, 2, 21) + days * 86400000);
  return MONTHS[lang][d.getUTCMonth()];
}

function texts(s: StarRow, lang: SLang) {
  const [, name, ra, dec, mag, ly, sp] = s;
  const { letter, kind } = kindOf(sp);
  const lum = lumOf(s);
  const lumTxt = lum >= 10 ? fmt(Math.round(lum / (lum > 1000 ? 100 : 10)) * (lum > 1000 ? 100 : 10), lang) : fmt(lum, lang, 1);
  const bright =
    lang === "de"
      ? mag < 0.5 ? "einer der hellsten Sterne am ganzen Himmel" : mag < 2 ? "ein sehr heller, auffälliger Stern" : mag < 3.5 ? "auch in der Stadt gut zu sehen" : mag < 4.5 ? "bei dunklem Himmel gut mit bloßem Auge zu sehen" : "nur bei dunklem Himmel mit bloßem Auge zu sehen"
      : mag < 0.5 ? "one of the brightest stars in the whole sky" : mag < 2 ? "a very bright, conspicuous star" : mag < 3.5 ? "easy to see even from a city" : mag < 4.5 ? "easy to see with the naked eye under a dark sky" : "visible to the naked eye only under a dark sky";
  const vis =
    lang === "de"
      ? dec > 38 ? "Von Deutschland aus (52° Nord) geht er nie unter: er steht das ganze Jahr über dem Horizont." : dec < -38 ? "Von Deutschland aus ist er nie zu sehen, er liegt zu weit im Süden." : `Von Deutschland aus (52° Nord) geht er auf und unter; am besten zu sehen ist er abends im ${bestMonth(ra, lang)}.`
      : dec > 38 ? "From Germany (52° N) it never sets: it stays above the horizon all year." : dec < -38 ? "It is never visible from Germany, as it lies too far south." : `From Germany (52° N) it rises and sets; it is best seen in the evening in ${bestMonth(ra, lang)}.`;
  const p1 =
    lang === "de"
      ? `${name} ist ein ${COLORS.de[letter]} ${KIND.de[kind]} (Spektraltyp ${sp}) in etwa ${fmt(ly, lang, ly < 20 ? 1 : 0)} Lichtjahren Entfernung. Mit einer scheinbaren Helligkeit von ${fmt(mag, lang, 2)} mag ist er ${bright}.`
      : `${name} is a ${COLORS.en[letter]} ${KIND.en[kind]} (spectral type ${sp}) about ${fmt(ly, lang, ly < 20 ? 1 : 0)} light-years away. With an apparent magnitude of ${fmt(mag, lang, 2)} it is ${bright}.`;
  const p2 =
    lang === "de"
      ? `Sein Licht ist rund ${lumTxt}-mal so stark wie das der Sonne (grobe Näherung im sichtbaren Licht, aus Helligkeit und Entfernung berechnet).`
      : `Its light output is roughly ${lumTxt} times that of the Sun (a rough estimate in visible light, calculated from brightness and distance).`;
  const special = lang === "de" ? s[7] : s[8];
  const rows: [string, string][] =
    lang === "de"
      ? [
          ["Entfernung", `≈ ${fmt(ly, lang, ly < 20 ? 1 : 0)} Lichtjahre`],
          ["Spektraltyp", `${sp} (${KIND.de[kind]})`],
          ["Farbe", COLOR_NOUN.de[letter]],
          ["Scheinbare Helligkeit", `${fmt(mag, lang, 2)} mag`],
          ["Leuchtkraft", `≈ ${lumTxt} × Sonne`],
          ["Position", `Rektaszension ${hm(ra, lang)}, Deklination ${fmt(dec, lang, 1)}°`],
        ]
      : [
          ["Distance", `≈ ${fmt(ly, lang, ly < 20 ? 1 : 0)} light-years`],
          ["Spectral type", `${sp} (${KIND.en[kind]})`],
          ["Colour", COLOR_NOUN.en[letter]],
          ["Apparent magnitude", `${fmt(mag, lang, 2)} mag`],
          ["Luminosity", `≈ ${lumTxt} × Sun`],
          ["Position", `Right ascension ${hm(ra, lang)}, declination ${fmt(dec, lang, 1)}°`],
        ];
  return { p: [p1, ...(special ? [special] : []), p2, vis], rows, kindText: KIND[lang][kind], p1 };
}

const T = {
  de: {
    home: "Start", index: "Sterne", open: "Sternenhimmel öffnen", facts: "Kennzahlen", more: "Weitere bekannte Sterne",
    title: (n: string, k: string) => `${n} – ${k}: Entfernung, Größe, Helligkeit & Fakten`,
    idxTitle: "Die bekanntesten Sterne: Sirius, Beteigeuze, Rigel, Polarstern & mehr",
    idxDesc: "165 bekannte Sterne mit Entfernung, Spektraltyp, Farbe, Helligkeit und Sichtbarkeit – von Sirius bis zum Polarstern.",
    idxIntro: "Alle hellen und bekannten Sterne am Himmel: Entfernung in Lichtjahren, Farbe, Spektraltyp, Helligkeit und wann du sie sehen kannst.",
    credit: "Daten: Hipparcos-/HYG-Katalog (CC BY-SA 4.0). Leuchtkraft und Sichtbarkeit sind berechnete Näherungen.",
    more2: "Mehr Objekte", objects: "Berühmte Objekte im Universum",
  },
  en: {
    home: "Home", index: "Stars", open: "Open the night sky", facts: "Key facts", more: "More well-known stars",
    title: (n: string, k: string) => `${n} – ${k}: distance, size, brightness & facts`,
    idxTitle: "The best-known stars: Sirius, Betelgeuse, Rigel, Polaris & more",
    idxDesc: "165 well-known stars with distance, spectral type, colour, brightness and visibility – from Sirius to Polaris.",
    idxIntro: "All the bright and famous stars in the sky: distance in light-years, colour, spectral type, brightness and when you can see them.",
    credit: "Data: Hipparcos / HYG catalogue (CC BY-SA 4.0). Luminosity and visibility are calculated estimates.",
    more2: "More objects", objects: "Famous objects in the universe",
  },
} as const;

const langs = (path: string) => ({ de: langPath(path, "de"), en: langPath(path, "en"), "x-default": langPath(path, "en") });
const ogOf = (lang: SLang) => (lang === "de" ? "/og/sternenhimmel.jpg" : "/og/sternenhimmel-en.jpg");

export function starMetadata(s: StarRow, lang: SLang): Metadata {
  const t = T[lang], x = texts(s, lang);
  const path = `/sterne/${s[0]}`;
  const url = langPath(path, lang);
  const title = t.title(s[1], x.kindText);
  const description = x.p1 + " " + (lang === "de" ? "Fakten, Sichtbarkeit und Position am Himmel." : "Facts, visibility and position in the sky.");
  return {
    title: { absolute: `${title} | CENTAURIAN` },
    description,
    alternates: { canonical: url, languages: langs(path) },
    openGraph: { type: "article", siteName: "Centaurian", locale: lang === "de" ? "de_DE" : "en_US", url, title, description, images: [{ url: ogOf(lang), width: 1200, height: 630, alt: s[1] }] },
    twitter: { card: "summary_large_image", title, description, images: [ogOf(lang)] },
  };
}

export function starIndexMetadata(lang: SLang): Metadata {
  const t = T[lang];
  const url = langPath("/sterne", lang);
  return {
    title: { absolute: `${t.idxTitle} | CENTAURIAN` },
    description: t.idxDesc,
    alternates: { canonical: url, languages: langs("/sterne") },
    openGraph: { type: "website", siteName: "Centaurian", locale: lang === "de" ? "de_DE" : "en_US", url, title: t.idxTitle, description: t.idxDesc, images: [{ url: ogOf(lang), width: 1200, height: 630, alt: t.index }] },
    twitter: { card: "summary_large_image", title: t.idxTitle, description: t.idxDesc, images: [ogOf(lang)] },
  };
}

const card = "hud-card border border-border p-3";
const linkCls = "inline-block border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent";

export function StarView({ s, lang }: { s: StarRow; lang: SLang }) {
  const t = T[lang], x = texts(s, lang);
  const path = `/sterne/${s[0]}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${s[1]} – ${x.kindText}`,
    description: x.p1,
    inLanguage: lang,
    url: BASE_URL + langPath(path, lang),
    about: { "@type": "Thing", name: s[1] },
    publisher: { "@type": "Organization", name: "Centaurian", url: BASE_URL },
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.home, item: BASE_URL + langPath("/", lang) },
      { "@type": "ListItem", position: 2, name: t.index, item: BASE_URL + langPath("/sterne", lang) },
      { "@type": "ListItem", position: 3, name: s[1], item: BASE_URL + langPath(path, lang) },
    ],
  };
  const near = STARS.filter((o) => o[0] !== s[0]).sort((a, b) => Math.abs(a[4] - s[4]) - Math.abs(b[4] - s[4])).slice(0, 16);
  return (
    <main lang={lang} className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <nav aria-label="breadcrumb" className="label-mono mb-6 flex flex-wrap gap-x-2 text-xs uppercase text-muted">
        <Link href={langPath("/", lang)} className="hover:text-accent">{t.home}</Link>
        <span>/</span>
        <Link href={langPath("/sterne", lang)} className="hover:text-accent">{t.index}</Link>
      </nav>
      <p className="label-mono text-xs uppercase text-accent">{x.kindText} · {s[6]}</p>
      <h1 className="font-display mt-2 text-3xl font-bold text-foreground sm:text-5xl">{s[1]}</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-foreground/90">
        {x.p.map((p, i) => <p key={i}>{p}</p>)}
      </div>
      <Link href={langPath("/sternenhimmel", lang)} className="mt-6 inline-block border border-accent px-4 py-2.5 text-sm uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-black">
        ▶ {t.open}
      </Link>
      <section className="mt-10">
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
      <section className="mt-10">
        <h2 className="font-display text-lg font-bold text-foreground">{t.more}</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {near.map((o) => (
            <li key={o[0]}><Link href={langPath(`/sterne/${o[0]}`, lang)} className={linkCls}>{o[1]}</Link></li>
          ))}
          <li><Link href={langPath("/sterne", lang)} className={linkCls}>{t.index} →</Link></li>
          <li><Link href={langPath("/objekte", lang)} className={linkCls}>{t.objects}</Link></li>
        </ul>
      </section>
      <p className="mt-12 border-t border-border pt-4 text-xs text-muted">{t.credit}</p>
    </main>
  );
}

export function StarIndexView({ lang }: { lang: SLang }) {
  const t = T[lang];
  const list = [...STARS].sort((a, b) => a[4] - b[4]);
  return (
    <main lang={lang} className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6">
      <nav aria-label="breadcrumb" className="label-mono mb-6 text-xs uppercase text-muted">
        <Link href={langPath("/", lang)} className="hover:text-accent">{t.home}</Link>
      </nav>
      <h1 className="font-display text-3xl font-bold text-foreground sm:text-5xl">{t.index}</h1>
      <p className="mt-4 leading-relaxed text-foreground/90">{t.idxIntro}</p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {list.map((o) => {
          const { kind } = kindOf(o[6]);
          return (
            <li key={o[0]}>
              <Link href={langPath(`/sterne/${o[0]}`, lang)} className="hud-card block h-full border border-border p-4 transition-colors hover:border-accent">
                <span className="label-mono text-[10px] uppercase text-accent">{KIND[lang][kind]} · {o[6]}</span>
                <span className="font-display mt-1 block text-xl font-bold text-foreground">{o[1]}</span>
                <span className="mt-2 block text-sm text-muted">{fmt(o[5], lang, o[5] < 20 ? 1 : 0)} {lang === "de" ? "Lichtjahre" : "light-years"} · {fmt(o[4], lang, 2)} mag</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
