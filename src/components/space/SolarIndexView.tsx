import type { Metadata } from "next";
import Link from "next/link";
import type { Lang } from "@/contexts/LanguageContext";
import { localize } from "@/lib/i18n";
import { spaceTexts } from "@/lib/spaceText";
import { OG_LOCALE, hreflang, langPath } from "@/lib/seoI18n";
import { SPACE_BODIES } from "./bodies";

/** Übersicht aller Himmelskörper-Seiten (/sonnensystem, /en/sonnensystem …). */
export function solarMetadata(lang: Lang): Metadata {
  const T = spaceTexts(lang);
  const url = langPath("/sonnensystem", lang);
  return {
    title: { absolute: `${T.solarTitle} | CENTAURIAN` },
    description: T.solarDesc,
    alternates: { canonical: url, languages: hreflang("/sonnensystem") },
    openGraph: {
      type: "website",
      siteName: "Centaurian",
      locale: OG_LOCALE[lang],
      url,
      title: T.solarTitle,
      description: T.solarDesc,
      images: [{ url: "/branding/og-image.jpg", width: 1200, height: 630, alt: "Centaurian" }],
    },
  };
}

export default function SolarIndexView({ lang }: { lang: Lang }) {
  const T = spaceTexts(lang);
  return (
    <main lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} className="mx-auto max-w-4xl px-4 pb-16 pt-6 sm:px-6">
      <nav aria-label="breadcrumb" className="label-mono mb-6 flex flex-wrap gap-x-2 text-xs uppercase text-muted">
        <Link href={langPath("/", lang)} className="hover:text-accent">{T.crumbHome}</Link>
      </nav>
      <h1 className="font-display text-2xl font-bold text-foreground sm:text-4xl">{T.solarTitle}</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-foreground/90">{T.solarIntro}</p>
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {SPACE_BODIES.map((b) => (
          <li key={b.id}>
            <Link
              href={langPath(`/sonnensystem/${b.id}`, lang)}
              className="hud-card group block border border-border p-3 transition-colors hover:border-accent"
            >
              {b.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.image} alt="" loading="lazy" className="aspect-square w-full bg-black object-cover" />
              )}
              <span className="mt-2 block text-sm text-foreground group-hover:text-accent">{localize(b.name, lang)}</span>
              <span className="block text-[11px] text-muted">{localize(b.facts.diameter, lang)}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={langPath("/universum", lang)}
        className="mt-8 inline-block border border-accent px-4 py-2.5 text-sm uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-black"
      >
        ▶ {T.open3d}
      </Link>
      <p className="mt-12 border-t border-border pt-4 text-xs text-muted">{T.credit}</p>
    </main>
  );
}
