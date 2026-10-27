import type { Metadata } from "next";
import Link from "next/link";
import { APP_TEXT } from "@/lib/appPageText";
import { ALL_LANGS, BASE_URL, hreflang, langPath, OG_LOCALE } from "@/lib/seoI18n";

/**
 * Download-Seite der Android-App (/app, /en/app, /es/app …).
 * Text pro Sprache als Liste aus src/lib/appPageText.ts, Reihenfolge siehe I.
 */
const APK_URL = "https://github.com/solomongrishnakh-crypto/music-app/releases/download/app-latest/Centaurian-web.apk";

const I = {
  title: 0, lead: 1, btn: 2, meta: 3,
  hFeat: 4, feat: 5, // 5 Paare ab Index 5
  hSteps: 15, steps: 16, // 5 Paare ab 16
  hPerm: 26, permIntro: 27, perm: 28, // 4 Paare ab 28
  hSafe: 36, safe: 37, // 3 ab 37
  hFaq: 40, faq: 41, // 3 Paare ab 41
  back: 47, note: 48,
  hHow: 49, how: 50, // 3 Paare ab 50
  kw: 56,
} as const;

type Lang = (typeof ALL_LANGS)[number];
const PRIVACY_LABEL: Record<string, string> = {
  de: "Datenschutzerklärung", en: "Privacy policy", es: "Política de privacidad", fr: "Politique de confidentialité", pt: "Política de privacidade",
  tr: "Gizlilik politikası", ru: "Политика конфиденциальности", el: "Πολιτική απορρήτου", ar: "سياسة الخصوصية", hi: "गोपनीयता नीति",
  zh: "隐私政策", ja: "プライバシーポリシー", ko: "개인정보 처리방침", id: "Kebijakan privasi", fa: "سیاست حریم خصوصی",
};
const RTL = new Set(["ar", "fa"]);
const tx = (lang: string) => APP_TEXT[lang] ?? APP_TEXT.en;
const pairs = (a: string[], from: number, n: number) => Array.from({ length: n }, (_, i) => [a[from + i * 2], a[from + i * 2 + 1]] as const);

export function appMetadata(lang: Lang): Metadata {
  const a = tx(lang);
  return {
    title: { absolute: `${a[I.title]} | CENTAURIAN` },
    description: a[I.lead],
    alternates: { canonical: langPath("/app", lang), languages: hreflang("/app") },
    openGraph: { title: a[I.title], description: a[I.lead], locale: OG_LOCALE[lang], url: BASE_URL + langPath("/app", lang), type: "website" },
    keywords: a[I.kw].split(", "),
    robots: { index: true, follow: true },
  };
}

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6 shrink-0 text-accent" aria-hidden="true">
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Reihenfolge der Funktionen: Sternenhimmel, Universum, Weltgeschichte, Musik, Werkzeuge
const FEAT_ORDER = [2, 1, 3, 0, 4];
const FEAT_ICONS = [
  "M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0c2.5 2.4 4 5.6 4 9s-1.5 6.6-4 9m0-18c-2.5 2.4-4 5.6-4 9s1.5 6.6 4 9M3 12h18",
  "M12 3l1.8 5.4H19l-4.4 3.2 1.7 5.4L12 13.8 7.7 17l1.7-5.4L5 8.4h5.2L12 3Z",
  "M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6",
  "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.2-.6-.6-2.2 2.2-2.6Z",
];

export default function AppView({ lang }: { lang: Lang }) {
  const a = tx(lang);
  const feats = pairs(a, I.feat, 5);
  const steps = pairs(a, I.steps, 5);
  const perms = pairs(a, I.perm, 4);
  const faqs = pairs(a, I.faq, 3);
  const safe = a.slice(I.safe, I.safe + 3);
  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MobileApplication",
          name: "Centaurian",
          operatingSystem: "Android 7.0+",
          applicationCategory: "MusicApplication",
          description: a[I.lead],
          inLanguage: lang,
          url: BASE_URL + langPath("/app", lang),
          downloadUrl: APK_URL,
          offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        }).replace(/</g, "\\u003c"),
      }}
    />
    <main lang={lang} dir={RTL.has(lang) ? "rtl" : "ltr"} className="mx-auto max-w-3xl px-4 pb-20 pt-6 sm:px-6">
      <nav className="label-mono mb-6 text-xs uppercase text-muted">
        <Link href={langPath("/", lang)} className="hover:text-accent">{a[I.back]}</Link>
      </nav>

      <header className="app-hero relative overflow-hidden border border-accent/40 bg-surface-elevated p-5 sm:p-8">
        <div className="app-orbit" aria-hidden="true"><i /><i /><i /></div>
        <p className="label-mono relative text-xs uppercase tracking-[0.3em] text-accent">Android · APK · 2026</p>
        <h1 className="relative mt-3 font-display text-3xl font-bold text-foreground sm:text-5xl">{a[I.title]}</h1>
        <p className="relative mt-4 max-w-xl text-sm leading-relaxed text-foreground/90 sm:text-base">{a[I.lead]}</p>
        <div className="relative mt-6 flex flex-wrap items-center gap-3">
          <a
            href={APK_URL}
            rel="noopener"
            className="app-cta inline-flex items-center gap-3 border border-accent bg-accent px-6 py-3 font-bold uppercase tracking-wide text-black transition-opacity hover:opacity-90"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} className="h-5 w-5" aria-hidden="true">
              <path d="M12 5v10m0 0-4-4m4 4 4-4M6 19h12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {a[I.btn]}
          </a>
          <span className="label-mono text-xs text-muted">{a[I.meta]}</span>
        </div>
      </header>

      <section className="mt-8">
        <h2 className="app-h font-display text-lg font-bold text-foreground">{a[I.hFeat]}</h2>
        <ul className="mt-3 grid grid-cols-2 gap-2">
          {FEAT_ORDER.map((k, n) => {
            const [h, p] = feats[k];
            return (
              <li key={h} className={"flex gap-2.5 border border-border bg-surface-elevated p-3" + (n === FEAT_ORDER.length - 1 ? " col-span-2" : "")}>
                <Icon d={FEAT_ICONS[k]} />
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-foreground">{h}</h3>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-foreground/75">{p}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="app-h font-display text-lg font-bold text-foreground">{a[I.hSteps]}</h2>
        <ol className="mt-3 space-y-2">
          {steps.slice(0, 3).map(([h, p], i) => (
            <li key={h} className="flex gap-3 border border-border bg-surface-elevated p-3">
              <span className="label-mono flex h-7 w-7 shrink-0 items-center justify-center border border-accent text-sm text-accent">{i + 1}</span>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-foreground">{h}</h3>
                <p className="mt-0.5 text-xs leading-snug text-foreground/75">{p}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-2 text-xs leading-relaxed text-muted">{a[I.note]}</p>
      </section>

      <div className="mt-8 space-y-2">
        <details className="app-fold border border-border bg-surface-elevated">
          <summary className="cursor-pointer select-none p-3 font-display text-sm font-bold text-foreground">{a[I.hPerm]}</summary>
          <div className="border-t border-border p-3">
            <p className="text-xs leading-relaxed text-foreground/85">{a[I.permIntro]}</p>
            <dl className="mt-3 divide-y divide-border">
              {perms.map(([h, p]) => (
                <div key={h} className="grid gap-0.5 py-2 sm:grid-cols-[10rem_1fr] sm:gap-4">
                  <dt className="text-sm font-bold text-accent">{h}</dt>
                  <dd className="text-xs leading-relaxed text-foreground/85">{p}</dd>
                </div>
              ))}
            </dl>
          </div>
        </details>

        <details className="app-fold border border-border bg-surface-elevated">
          <summary className="cursor-pointer select-none p-3 font-display text-sm font-bold text-foreground">{a[I.hSafe]}</summary>
          <div className="border-t border-border p-3">
            <ul className="space-y-2">
              {safe.map((t) => (
                <li key={t} className="flex gap-2.5 text-xs leading-relaxed text-foreground/85">
                  <span className="text-accent" aria-hidden="true">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs">
              <Link href={langPath("/datenschutz", lang)} className="text-accent underline underline-offset-4 hover:no-underline">
                {PRIVACY_LABEL[lang] ?? PRIVACY_LABEL.en}
              </Link>
            </p>
          </div>
        </details>

        <details className="app-fold border border-border bg-surface-elevated">
          <summary className="cursor-pointer select-none p-3 font-display text-sm font-bold text-foreground">{a[I.hFaq]}</summary>
          <div className="space-y-3 border-t border-border p-3">
            {faqs.map(([q, ans]) => (
              <div key={q}>
                <h3 className="text-sm font-bold text-foreground">{q}</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-foreground/80">{ans}</p>
              </div>
            ))}
          </div>
        </details>
      </div>

      <div className="mt-8 flex justify-center">
        <a
          href={APK_URL}
          rel="noopener"
          className="inline-flex items-center gap-3 border border-accent px-6 py-3 font-bold uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-black"
        >
          {a[I.btn]}
        </a>
      </div>
    </main>
    </>
  );
}
