import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  REICHE_INDEX,
  dauer,
  epoche,
  formatFlaeche,
  formatJahr,
  loadReich,
  ogBildJahr,
  reichName,
  vergleichDeutschland,
  type Reich,
  type ReichRef,
} from "@/lib/history/reiche";

/**
 * Eigene Seite pro Reich, z. B. /imperien/reich/roemisches-reich
 * (Nutzerwunsch 07.10.2026: mehr Besucher über Google). Alle 300 Seiten
 * werden beim Build fest erzeugt; Daten siehe src/lib/history/reiche.ts.
 */
type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return REICHE_INDEX.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = await loadReich((await params).slug);
  if (!r) return {};
  const name = reichName(r);
  const title = `${name} — Karte, Ausdehnung & Zeitraum`;
  const description = `${name}${r.de && r.de !== r.en ? ` (${r.en})` : ""} auf der Karte: ${formatJahr(r.from)} bis ${formatJahr(r.to)}, größte Ausdehnung um ${formatJahr(r.peakYear)} mit ca. ${formatFlaeche(r.peakArea)}. Mit Vorgängern, Nachfolgern und interaktiver Weltgeschichte-Karte.`;
  const url = `/imperien/reich/${r.slug}`;
  const image = `/og/imperien/${ogBildJahr(r.peakYear)}.jpg`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: "Centaurian",
      url,
      title: `${title} | CENTAURIAN`,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: `Weltkarte um ${formatJahr(r.peakYear)}` }],
    },
    twitter: { card: "summary_large_image", title: `${title} | CENTAURIAN`, description, images: [image] },
  };
}

function RefList({ items, empty }: { items: ReichRef[]; empty: string }) {
  if (!items.length) return <p className="text-sm text-muted">{empty}</p>;
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((it) => {
        const label = reichName(it);
        return (
          <li key={it.n}>
            {it.s ? (
              <Link
                href={`/imperien/reich/${it.s}`}
                className="inline-block border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                {label}
              </Link>
            ) : (
              <span className="inline-block border border-border/50 px-3 py-1.5 text-sm text-muted">
                {label}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** Flächenverlauf als kleines Balkendiagramm (reines SVG, kein JavaScript). */
function FlaechenVerlauf({ r }: { r: Reich }) {
  const s = r.series;
  if (s.length < 2) return null;
  const W = 600;
  const H = 140;
  const max = Math.max(...s.map((p) => p[1])) || 1;
  const x0 = r.from;
  const span = Math.max(1, r.to - r.from);
  const pts = s.map(([y, a]) => [((y - x0) / span) * W, H - (a / max) * (H - 10)] as const);
  // Stufenlinie: jede Fläche gilt bis zum nächsten Kartenstand
  let d = `M0 ${H}`;
  pts.forEach(([x, y], i) => {
    d += ` L${x.toFixed(1)} ${i === 0 ? y.toFixed(1) : pts[i - 1][1].toFixed(1)} L${x.toFixed(1)} ${y.toFixed(1)}`;
  });
  d += ` L${W} ${pts[pts.length - 1][1].toFixed(1)} L${W} ${H} Z`;
  return (
    <figure className="mt-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Fläche von ${reichName(r)} im Lauf der Zeit`}>
        <path d={d} fill="rgba(255,90,77,0.25)" stroke="#ff5a4d" strokeWidth="1.5" />
      </svg>
      <figcaption className="mt-1 flex justify-between text-xs text-muted">
        <span>{formatJahr(r.from)}</span>
        <span>Fläche laut Kartendaten (max. {formatFlaeche(max)})</span>
        <span>{formatJahr(r.to)}</span>
      </figcaption>
    </figure>
  );
}

export default async function ReichPage({ params }: Props) {
  const r = await loadReich((await params).slug);
  if (!r) notFound();
  const name = reichName(r);
  const hasDe = r.de && r.de !== r.en;
  const jahre = dauer(r.from, r.to);
  const vergleich = vergleichDeutschland(r.peakArea);
  const ende = r.to >= 2020 ? "bis heute" : `bis ${formatJahr(r.to)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: `${name} — Karte, Ausdehnung & Zeitraum`,
        url: `https://centaurian.vercel.app/imperien/reich/${r.slug}`,
        inLanguage: "de",
        about: { "@type": "Thing", name: r.en, alternateName: r.de ?? undefined },
        isPartOf: { "@type": "WebSite", name: "Centaurian", url: "https://centaurian.vercel.app" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Centaurian", item: "https://centaurian.vercel.app/" },
          { "@type": "ListItem", position: 2, name: "Weltgeschichte Karte", item: "https://centaurian.vercel.app/imperien" },
          { "@type": "ListItem", position: 3, name: "Alle Reiche", item: "https://centaurian.vercel.app/imperien/reiche" },
          { "@type": "ListItem", position: 4, name },
        ],
      },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Brotkrümel" className="label-mono mb-6 flex flex-wrap gap-x-2 text-xs uppercase text-muted">
        <Link href="/" className="hover:text-accent">Centaurian</Link>
        <span>/</span>
        <Link href="/imperien" className="hover:text-accent">Weltgeschichte-Karte</Link>
        <span>/</span>
        <Link href="/imperien/reiche" className="hover:text-accent">Alle Reiche</Link>
      </nav>

      <p className="label-mono text-xs uppercase text-accent">// {epoche(r.from)}</p>
      <h1 className="font-display mt-2 text-2xl font-bold text-foreground sm:text-4xl">{name}</h1>
      {hasDe && <p className="mt-1 text-sm text-muted">englisch: {r.en}</p>}

      <dl className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          ["Zeitraum", `${formatJahr(r.from)} – ${r.to >= 2020 ? "heute" : formatJahr(r.to)}`],
          ["Dauer", `ca. ${jahre.toLocaleString("de-DE")} Jahre`],
          ["Größte Ausdehnung", `um ${formatJahr(r.peakYear)}`],
          ["Fläche (max.)", `ca. ${formatFlaeche(r.peakArea)}`],
        ].map(([k, v]) => (
          <div key={k} className="hud-card border border-border p-3">
            <dt className="label-mono text-[10px] uppercase text-muted">{k}</dt>
            <dd className="mt-1 text-sm text-foreground">{v}</dd>
          </div>
        ))}
      </dl>

      <figure className="hud-card mt-6 overflow-hidden border border-border">
        <svg
          viewBox={`0 0 ${r.map.w} ${r.map.h}`}
          className="block h-auto w-full"
          role="img"
          aria-label={`Karte: ${name} um ${formatJahr(r.peakYear)}`}
        >
          <rect width={r.map.w} height={r.map.h} fill="#071019" />
          <path d={r.map.land} fill="#1c2027" fillRule="evenodd" />
          <path d={r.map.shape} fill="rgba(255,90,77,0.5)" stroke="#ff5a4d" strokeWidth="2" strokeLinejoin="round" fillRule="evenodd" />
        </svg>
        <figcaption className="border-t border-border px-3 py-2 text-xs text-muted">
          {name} zur Zeit der größten Ausdehnung (um {formatJahr(r.peakYear)}) · Grenzen: Cliopatria
        </figcaption>
      </figure>

      <Link
        href={`/imperien?jahr=${r.peakYear}`}
        className="mt-4 inline-block border border-accent px-4 py-2.5 text-sm uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-black"
      >
        ▶ Auf der interaktiven Karte ansehen
      </Link>

      <section className="mt-10">
        <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">Zeitraum und Dauer</h2>
        <p className="mt-3 leading-relaxed text-foreground/90">
          {name} — laut den Kartendaten von {formatJahr(r.from)} {ende}, also rund{" "}
          {jahre.toLocaleString("de-DE")} Jahre. Die Jahreszahlen beziehen sich auf die Zeit, in der das
          Reich als eigenes Gebiet auf der Weltkarte eingezeichnet ist; Gründung und Ende werden in der
          Geschichtsschreibung teils anders datiert.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">Größte Ausdehnung</h2>
        <p className="mt-3 leading-relaxed text-foreground/90">
          {name} — größte Ausdehnung um {formatJahr(r.peakYear)}: Die eingezeichneten Grenzen umfassen
          dann etwa {formatFlaeche(r.peakArea)}
          {vergleich ? ` — ${vergleich}` : ""}. Die Fläche ist aus den Grenzlinien der Karte berechnet
          und daher ein Näherungswert.
        </p>
        <FlaechenVerlauf r={r} />
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">Vorgänger und Nachfolger</h2>
        <p className="mt-3 text-sm text-muted">
          Reiche, die dasselbe Gebiet direkt davor bzw. danach beherrschten:
        </p>
        <h3 className="label-mono mt-4 text-xs uppercase text-accent">Davor ({formatJahr(r.from === 1 ? -1 : r.from - 1)})</h3>
        <div className="mt-2">
          <RefList items={r.pred} empty="Keine Vorgänger in den Kartendaten." />
        </div>
        <h3 className="label-mono mt-4 text-xs uppercase text-accent">Danach</h3>
        <div className="mt-2">
          <RefList items={r.succ} empty={r.to >= 2020 ? "Besteht bis heute." : "Keine Nachfolger in den Kartendaten."} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">
          Nachbarn um {formatJahr(r.peakYear)}
        </h2>
        <p className="mt-3 text-sm text-muted">Die größten Reiche in der Umgebung zur selben Zeit:</p>
        <div className="mt-3">
          <RefList items={r.cont} empty="Keine Nachbarreiche in den Kartendaten." />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">Mehr erfahren</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link href={`/imperien?jahr=${r.peakYear}`} className="text-accent hover:underline">
              Weltkarte im Jahr {formatJahr(r.peakYear)} öffnen
            </Link>{" "}
            — Reich antippen für die ausführliche Beschreibung
          </li>
          <li>
            <a
              href={`https://de.wikipedia.org/w/index.php?search=${encodeURIComponent(r.de ?? r.en)}`}
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {name} auf Wikipedia
            </a>
          </li>
          <li>
            <Link href="/imperien/reiche" className="text-accent hover:underline">
              Alle {REICHE_INDEX.length} Reiche im Überblick
            </Link>
          </li>
        </ul>
      </section>

      <p className="mt-12 border-t border-border pt-4 text-xs text-muted">
        Grenzen und Zeiträume: Cliopatria / Seshat Global History Databank (CC BY 4.0). Küsten: Natural Earth.
        Deutsche Namen und Texte: Centaurian.
      </p>
    </main>
  );
}
