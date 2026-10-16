import type { Metadata } from "next";
import Link from "next/link";
import type { Lang } from "@/contexts/LanguageContext";
import { spaceTexts } from "@/lib/spaceText";
import { TOOLS_PAGE } from "@/lib/toolsPageText";
import { BASE_URL, OG_LOCALE, hreflang, langPath } from "@/lib/seoI18n";
import {
  DESTS, DEST_DATA, VEHICLES, type DestId, type VehicleId,
  capFirst, fmtDist, fmtDuration, fmtLy, fmtSpeed, tpl, travelHours, travelPath,
} from "@/lib/travelTime";
import { TRAVEL_TEXT } from "@/lib/travelTimeText";

/**
 * Reisezeit-Seite /reisezeit/[ziel]/[fahrzeug] (+ /en/… usw.) — beantwortet
 * Suchen wie "Wie lange dauert es mit dem Auto zum Saturn?" direkt im Titel
 * und im ersten Satz, darunter Rechenweg, Vergleich, Wissenswertes und eine
 * Tabelle mit allen Fahrzeugen (Nutzerwunsch 16.10.2026).
 */
function texts(d: DestId, v: VehicleId, lang: Lang) {
  const T = TRAVEL_TEXT[lang];
  const D = DEST_DATA[d];
  const by = T.vehicles[v].by;
  const vars = {
    by,
    By: capFirst(by, lang),
    to: T.dests[d].to,
    about: T.about,
    dur: fmtDuration(travelHours(D.mean, v), lang),
    speed: fmtSpeed(v, lang),
  };
  const distPhrase = tpl(D.min ? T.distMean : T.distFixed, { dist: fmtDist(D.mean, lang) });
  const title = tpl(T.title, vars);
  const question = tpl(T.question, vars);
  const lead = tpl(T.lead, { ...vars, distPhrase });
  const range = D.min && D.max
    ? tpl(T.range, { min: fmtDuration(travelHours(D.min, v), lang), max: fmtDuration(travelHours(D.max, v), lang) })
    : "";
  return { T, D, vars, title, question, lead, range };
}

export function travelMetadata(d: DestId, v: VehicleId, lang: Lang): Metadata {
  const { T, title, question, lead } = texts(d, v, lang);
  const path = travelPath(d, v);
  const url = langPath(path, lang);
  return {
    title: { absolute: `${title} | CENTAURIAN` },
    description: lead,
    keywords: [question, `${T.dests[d].name} ${T.vehicles[v].name}`, T.dests[d].name, T.vehicles[v].name],
    alternates: { canonical: url, languages: hreflang(path) },
    openGraph: {
      type: "article",
      siteName: "Centaurian",
      locale: OG_LOCALE[lang],
      url,
      title,
      description: lead,
      images: [{ url: "/branding/og-image.jpg", width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description: lead, images: ["/branding/og-image.jpg"] },
  };
}

const card = "hud-card border border-border p-3";

export default function TravelView({ d, v, lang }: { d: DestId; v: VehicleId; lang: Lang }) {
  const { T, D, vars, title, question, lead, range } = texts(d, v, lang);
  const S = spaceTexts(lang);
  const tools = TOOLS_PAGE[lang];
  const dest = T.dests[d];
  const cmp = dest.cmp[VEHICLES.indexOf(v)];
  const url = BASE_URL + langPath(travelPath(d, v), lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: title,
        description: lead,
        url,
        inLanguage: lang,
        about: { "@type": "Thing", name: dest.name },
        isPartOf: { "@type": "WebSite", name: "Centaurian", url: BASE_URL },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: [lead, range, cmp].filter(Boolean).join(" ") },
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: S.crumbHome, item: BASE_URL + langPath("/", lang) },
          { "@type": "ListItem", position: 2, name: tools.link, item: BASE_URL + langPath("/weltraum-rechner", lang) },
          { "@type": "ListItem", position: 3, name: title, item: url },
        ],
      },
    ],
  };

  const distRows: [string, number][] = D.min && D.max
    ? [[T.lMin, D.min], [T.lMean, D.mean], [T.lMax, D.max]]
    : [[T.lDist, D.mean]];

  return (
    <main lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="breadcrumb" className="label-mono mb-6 flex flex-wrap gap-x-2 text-xs uppercase text-muted">
        <Link href={langPath("/", lang)} className="hover:text-accent">{S.crumbHome}</Link>
        <span>/</span>
        <Link href={langPath("/weltraum-rechner", lang)} className="hover:text-accent">{tools.link}</Link>
      </nav>

      <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">{title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-foreground/90">{lead}</p>
      {range && <p className="mt-2 leading-relaxed text-foreground/80">{range}</p>}

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-foreground">{T.h2Cmp}</h2>
        <p className="hud-card mt-3 border border-accent/60 p-4 leading-relaxed text-foreground">{cmp}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-foreground">{T.h2Calc}</h2>
        <dl className="mt-3 grid gap-2 sm:grid-cols-2">
          {distRows.map(([label, km]) => (
            <div key={label} className={card}>
              <dt className="label-mono text-[10px] uppercase text-muted">{label}</dt>
              <dd className="mt-1 text-sm text-foreground">
                {fmtDist(km, lang)}
                {D.ly && <span className="text-muted"> ({fmtLy(D.ly, lang)})</span>}
              </dd>
            </div>
          ))}
          <div className={card}>
            <dt className="label-mono text-[10px] uppercase text-muted">{T.lSpeed}</dt>
            <dd className="mt-1 text-sm text-foreground">
              {vars.speed}
              {v === "rakete" && <span className="text-muted"> ({T.rocketNote})</span>}
            </dd>
          </div>
          <div className={card}>
            <dt className="label-mono text-[10px] uppercase text-muted">{T.lFormula}</dt>
            <dd className="mt-1 text-sm text-foreground">{T.formula}</dd>
          </div>
          <div className={`${card} sm:col-span-2`}>
            <dt className="label-mono text-[10px] uppercase text-muted">{T.lResult}</dt>
            <dd className="mt-1 text-sm text-foreground">
              {fmtDist(D.mean, lang)} ÷ {vars.speed} ≈ <strong className="text-accent">{vars.dur}</strong>
            </dd>
          </div>
        </dl>
        <p className="mt-3 text-xs leading-relaxed text-muted">{T.note}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-foreground">{tpl(T.h2About, { name: dest.name })}</h2>
        <p className="mt-3 leading-relaxed text-foreground/90">{dest.info}</p>
        {D.bodyId && (
          <Link
            href={langPath(`/sonnensystem/${D.bodyId}`, lang)}
            className="mt-3 inline-block text-sm text-accent hover:underline"
          >
            → {tpl(T.bodyLink, { name: dest.name })}
          </Link>
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-foreground">{tpl(T.h2Table, { name: dest.name })}</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr className="label-mono text-left text-[10px] uppercase text-muted">
                <th className="border-b border-border p-2 text-start">{T.colVehicle}</th>
                <th className="border-b border-border p-2 text-start">{T.colSpeed}</th>
                <th className="border-b border-border p-2 text-start">{T.colTime}</th>
                {D.min && <th className="border-b border-border p-2 text-start">{T.colRange}</th>}
              </tr>
            </thead>
            <tbody>
              {VEHICLES.map((o) => {
                const current = o === v;
                return (
                  <tr key={o} className={current ? "bg-accent/10" : undefined}>
                    <td className="border-b border-border p-2">
                      {current ? (
                        <span className="font-semibold text-accent">{T.vehicles[o].name}</span>
                      ) : (
                        <Link href={langPath(travelPath(d, o), lang)} className="text-foreground underline decoration-border hover:text-accent">
                          {T.vehicles[o].name}
                        </Link>
                      )}
                    </td>
                    <td className="border-b border-border p-2 text-foreground/80">{fmtSpeed(o, lang)}</td>
                    <td className="border-b border-border p-2 text-foreground">{fmtDuration(travelHours(D.mean, o), lang)}</td>
                    {D.min && D.max && (
                      <td className="border-b border-border p-2 text-foreground/80">
                        {fmtDuration(travelHours(D.min, o), lang)} – {fmtDuration(travelHours(D.max, o), lang)}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-foreground">{tpl(T.h2Other, vars)}</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {DESTS.filter((o) => o !== d).map((o) => (
            <li key={o}>
              <Link
                href={langPath(travelPath(o, v), lang)}
                className="inline-block border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                {T.dests[o].name}: {fmtDuration(travelHours(DEST_DATA[o].mean, v), lang)}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10">
        <Link
          href={langPath("/weltraum-rechner", lang)}
          className="inline-block border border-accent px-4 py-2.5 text-sm uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-black"
        >
          ▶ {tools.link}
        </Link>
      </div>
    </main>
  );
}

/** Übersicht aller Reisezeit-Seiten (für den Weltraum-Rechner): Ziel × Fahrzeug */
export function TravelHub({ lang }: { lang: Lang }) {
  const T = TRAVEL_TEXT[lang];
  return (
    <section className="mt-10">
      <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">{T.hubTitle}</h2>
      <p className="mt-1 text-sm text-muted">{T.hubIntro}</p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="label-mono text-[10px] uppercase text-muted">
              <th className="border-b border-border p-2" />
              {VEHICLES.map((v) => (
                <th key={v} className="border-b border-border p-2 text-start">{T.vehicles[v].name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DESTS.map((d) => (
              <tr key={d}>
                <th scope="row" className="border-b border-border p-2 text-start font-semibold text-foreground">
                  {T.dests[d].name}
                </th>
                {VEHICLES.map((v) => (
                  <td key={v} className="border-b border-border p-2">
                    <Link href={langPath(travelPath(d, v), lang)} className="text-foreground underline decoration-border hover:text-accent">
                      {fmtDuration(travelHours(DEST_DATA[d].mean, v), lang)}
                    </Link>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
