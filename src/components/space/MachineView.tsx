import type { Metadata } from "next";
import Link from "next/link";
import type { Lang } from "@/contexts/LanguageContext";
import { AXLE_COUNT, gearPeriodSeconds } from "@/components/universe/machineTime";
import { spaceTexts, type SpaceTexts } from "@/lib/spaceText";
import { machineTexts } from "@/lib/machineText";
import GearCalculator from "./GearCalculator";
import { BASE_URL, OG_LOCALE, hreflang, langPath } from "@/lib/seoI18n";

/**
 * Eigene Seite für die Maschine der Ewigkeit (/maschine-der-ewigkeit,
 * /en/maschine-der-ewigkeit …) — Nutzerwunsch 07.10.2026. Die Tabelle wird
 * aus denselben Werten berechnet wie die 3D-Maschine (machineTime.ts).
 */
const NUM_LOCALE: Record<Lang, string> = {
  de: "de-DE", en: "en-US", es: "es-ES", fr: "fr-FR", pt: "pt-BR", tr: "tr-TR", ru: "ru-RU",
  el: "el-GR", ar: "ar", hi: "hi-IN", zh: "zh-CN", ja: "ja-JP", ko: "ko-KR",
};

function duration(sec: number, T: SpaceTexts, lang: Lang): string {
  const f = (n: number) => n.toLocaleString(NUM_LOCALE[lang], { maximumFractionDigits: n < 10 ? 1 : 0 });
  const y = sec / 31_557_600;
  if (sec < 120) return `${f(sec)} ${T.sec}`;
  if (sec < 7200) return `${f(sec / 60)} ${T.min}`;
  if (sec < 172_800) return `${f(sec / 3600)} ${T.hours}`;
  if (y < 2) return `${f(sec / 86400)} ${T.days}`;
  if (y < 10_000) return `${f(y)} ${T.years}`;
  if (y < 1e6) return `${f(y / 1000)} ${T.thousandYears}`;
  if (y < 1e9) return `${f(y / 1e6)} ${T.millionYears}`;
  return `${(y / 1e9).toLocaleString(NUM_LOCALE[lang], { maximumFractionDigits: 3 })} ${T.billionYears}`;
}

export function machineMetadata(lang: Lang): Metadata {
  const T = spaceTexts(lang);
  const url = langPath("/maschine-der-ewigkeit", lang);
  return {
    title: { absolute: `${T.machineTitle} | CENTAURIAN` },
    description: T.machineDesc,
    keywords: machineTexts(lang).keywords,
    alternates: { canonical: url, languages: hreflang("/maschine-der-ewigkeit") },
    openGraph: {
      type: "article",
      siteName: "Centaurian",
      locale: OG_LOCALE[lang],
      url,
      title: T.machineTitle,
      description: T.machineDesc,
      images: [{ url: "/og/maschine.jpg", width: 1200, height: 630, alt: T.machineH1 }],
    },
    twitter: { card: "summary_large_image", title: T.machineTitle, description: T.machineDesc, images: ["/og/maschine.jpg"] },
  };
}

export default function MachineView({ lang }: { lang: Lang }) {
  const T = spaceTexts(lang);
  const rows = Array.from({ length: AXLE_COUNT }, (_, i) => ({ n: i + 1, sec: gearPeriodSeconds(i) }));
  const M = machineTexts(lang);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: T.machineTitle,
        description: T.machineDesc,
        url: BASE_URL + langPath("/maschine-der-ewigkeit", lang),
        inLanguage: lang,
        keywords: M.keywords.join(", "),
        image: BASE_URL + "/og/maschine.jpg",
        isPartOf: { "@type": "WebSite", name: "Centaurian", url: BASE_URL },
      },
      {
        "@type": "FAQPage",
        mainEntity: M.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      },
    ],
  };
  return (
    <main lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="breadcrumb" className="label-mono mb-6 flex flex-wrap gap-x-2 text-xs uppercase text-muted">
        <Link href={langPath("/", lang)} className="hover:text-accent">{T.crumbHome}</Link>
      </nav>
      <h1 className="font-display text-3xl font-bold text-foreground sm:text-5xl">{T.machineH1}</h1>
      <p className="mt-4 text-lg leading-relaxed text-foreground/90">{T.machineIntro}</p>
      <Link
        href={langPath("/universum", lang)}
        className="mt-6 inline-block border border-accent px-4 py-2.5 text-sm uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-black"
      >
        ▶ {T.machineOpen}
      </Link>
      <section className="mt-10">
        <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">{T.machineHow}</h2>
        <p className="mt-3 leading-relaxed text-foreground/90">{T.machineHowText}</p>
        <p className="hud-card mt-4 border border-accent/60 p-3 text-sm text-foreground">{T.machineFact}</p>
      </section>
      <section className="mt-10">
        <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">{M.h2Reduction}</h2>
        <p className="mt-3 leading-relaxed text-foreground/90">{M.pReduction}</p>
        <p className="label-mono mt-3 border-s-2 border-accent ps-3 text-sm text-foreground">{M.formula}</p>
      </section>
      <section className="mt-10">
        <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">{M.h2Calc}</h2>
        <p className="mt-3 text-sm text-muted">{M.pCalc}</p>
        <GearCalculator
          locale={NUM_LOCALE[lang]}
          labels={{
            first: M.calcFirst,
            ratio: M.calcRatio,
            gears: M.calcGears,
            last: M.calcLast,
            total: M.calcTotal,
            ageOfUniverse: M.calcAgeOfUniverse,
            units: {
              sec: T.sec, min: T.min, hours: T.hours, days: T.days, years: T.years,
              thousandYears: T.thousandYears, millionYears: T.millionYears, billionYears: T.billionYears,
            },
          }}
        />
      </section>
      <section className="mt-10">
        <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">{T.machineTable}</h2>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="label-mono border-b border-border text-left text-[10px] uppercase text-muted">
              <th className="py-2 pe-4">{T.gear}</th>
              <th className="py-2">{T.oneTurn}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.n} className="border-b border-border/50">
                <td className="py-1.5 pe-4 text-muted">#{r.n}</td>
                <td className={`py-1.5 ${r.n === AXLE_COUNT ? "text-accent" : "text-foreground"}`}>{duration(r.sec, T, lang)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="mt-10">
        <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">{M.h2Similar}</h2>
        <p className="mt-3 leading-relaxed text-foreground/90">{M.pGanson}</p>
        <p className="mt-3 leading-relaxed text-foreground/90">{M.pLongNow}</p>
      </section>
      <section className="mt-10">
        <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">{M.h2Faq}</h2>
        <div className="mt-3 space-y-3">
          {M.faq.map(([q, a]) => (
            <details key={q} className="hud-card border border-border p-3" open>
              <summary className="cursor-pointer text-sm font-semibold text-foreground">{q}</summary>
              <p className="mt-2 text-sm leading-relaxed text-foreground/85">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
