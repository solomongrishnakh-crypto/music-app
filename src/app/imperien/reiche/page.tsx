import type { Metadata } from "next";
import Link from "next/link";
import { REICHE_INDEX, epoche, formatFlaeche, formatJahr, reichName } from "@/lib/history/reiche";

/**
 * Übersicht aller Reich-Seiten (Nutzerwunsch 07.10.2026: mehr Besucher).
 * Verlinkt jede Einzelseite — wichtig, damit Google sie findet.
 */
const TITLE = "Alle Reiche & Imperien der Weltgeschichte — Liste mit Karten";
const DESCRIPTION = `${REICHE_INDEX.length} historische Reiche und Imperien von der Antike bis zur Moderne: Zeitraum, größte Ausdehnung und Karte — vom Römischen Reich über das Mongolische Reich bis zum Britischen Weltreich.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/imperien/reiche" },
  openGraph: {
    type: "website",
    siteName: "Centaurian",
    url: "/imperien/reiche",
    title: `${TITLE} | CENTAURIAN`,
    description: DESCRIPTION,
    images: [{ url: "/og/imperien/1200.jpg", width: 1200, height: 630, alt: "Weltkarte der Reiche" }],
  },
};

const EPOCHEN = ["Altertum", "Mittelalter", "Frühe Neuzeit", "Moderne"] as const;
const EPOCHEN_TEXT: Record<(typeof EPOCHEN)[number], string> = {
  Altertum: "bis 500 n. Chr.",
  Mittelalter: "500 – 1500",
  "Frühe Neuzeit": "1500 – 1800",
  Moderne: "ab 1800",
};

export default function ReichePage() {
  const groups = EPOCHEN.map((e) => ({
    e,
    items: REICHE_INDEX.filter((r) => epoche(r.from) === e).sort((a, b) =>
      reichName(a).localeCompare(reichName(b), "de")
    ),
  }));
  return (
    <main className="mx-auto max-w-4xl px-4 pb-16 pt-6 sm:px-6">
      <nav aria-label="Brotkrümel" className="label-mono mb-6 flex flex-wrap gap-x-2 text-xs uppercase text-muted">
        <Link href="/" className="hover:text-accent">Centaurian</Link>
        <span>/</span>
        <Link href="/imperien" className="hover:text-accent">Weltgeschichte-Karte</Link>
      </nav>
      <h1 className="font-display text-2xl font-bold text-foreground sm:text-4xl">Alle Reiche & Imperien</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-foreground/90">
        Die {REICHE_INDEX.length} größten und langlebigsten Reiche aus unserer Weltgeschichte-Karte — jeweils mit
        Zeitraum, größter Ausdehnung, Karte, Vorgängern und Nachfolgern.{" "}
        <Link href="/imperien" className="text-accent hover:underline">
          Zur interaktiven Karte →
        </Link>
      </p>
      {groups.map(({ e, items }) => (
        <section key={e} className="mt-10">
          <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">
            {e} <span className="label-mono text-xs font-normal text-muted">({EPOCHEN_TEXT[e]} · {items.length})</span>
          </h2>
          <ul className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-2">
            {items.map((r) => (
              <li key={r.slug} className="flex items-baseline justify-between gap-2 border-b border-border/60 py-1.5">
                <Link href={`/imperien/reich/${r.slug}`} className="text-sm text-foreground hover:text-accent">
                  {reichName(r)}
                </Link>
                <span className="label-mono shrink-0 text-[10px] text-muted">
                  {formatJahr(r.from)} – {formatJahr(r.to)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="mt-12 border-t border-border pt-4 text-xs text-muted">
        Größtes Reich der Liste: {reichName(REICHE_INDEX.reduce((a, b) => (b.peakArea > a.peakArea ? b : a)))} (ca.{" "}
        {formatFlaeche(Math.max(...REICHE_INDEX.map((r) => r.peakArea)))}). Daten: Cliopatria / Seshat Global History
        Databank (CC BY 4.0).
      </p>
    </main>
  );
}
