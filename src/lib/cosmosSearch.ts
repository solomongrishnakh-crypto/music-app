import type { Lang } from "@/contexts/LanguageContext";

/**
 * Suche über Himmelskörper, Sternbilder, benannte Sterne und Imperien
 * (Nutzerwunsch 14.10.2026). Läuft komplett im Browser über die vorhandenen
 * Datensätze; die großen Daten werden erst bei der ersten Suche geladen.
 */
export type CosmosKind = "planet" | "dwarf" | "sun" | "probe" | "constellation" | "star" | "empire";

export interface CosmosHit {
  key: string;
  kind: CosmosKind;
  title: string;
  href: string;
  mag?: number;
  ly?: number;
  inConst?: string;
  from?: number;
  to?: number;
  score: number;
}

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

function score(q: string, names: string[]): number {
  let best = 0;
  for (const n of names) {
    const x = norm(n);
    if (!x) continue;
    if (x === q) return 100;
    if (x.startsWith(q)) best = Math.max(best, 80);
    else if (x.split(/[\s\-'’]/).some((w) => w.startsWith(q))) best = Math.max(best, 60);
    else if (q.length >= 5 && x.includes(q)) best = Math.max(best, 40);
  }
  return best;
}

interface ConstRow {
  abbr: string;
  slug: string;
  la: string;
  names: Record<string, string>;
  top: { d: string; n: string; m: number; ly: number }[];
}

async function load() {
  const [bodies, consts, reiche, names] = await Promise.all([
    import("@/components/space/bodies"),
    import("@/data/sternbilder.json"),
    import("@/data/reiche/index.json"),
    import("@/lib/history/reicheNames"),
  ]);
  return {
    bodies: bodies.SPACE_BODIES,
    consts: (consts.default as unknown as ConstRow[]),
    reiche: reiche.default as unknown as { slug: string; en: string; de: string | null; from: number; to: number; peakArea: number }[],
    reichNameL: names.reichNameL,
  };
}

let cache: ReturnType<typeof load> | null = null;

export async function searchCosmos(query: string, lang: Lang): Promise<CosmosHit[]> {
  const q = norm(query);
  if (q.length < 2) return [];
  if (!cache) cache = load();
  const d = await cache;
  const hits: CosmosHit[] = [];

  for (const b of d.bodies) {
    const names = [...(Object.values(b.name) as string[]), b.id];
    const s = score(q, names);
    if (!s) continue;
    const kind: CosmosKind = b.kind === "star" ? "sun" : b.kind === "dwarf" ? "dwarf" : b.kind === "probe" ? "probe" : "planet";
    hits.push({ key: "b:" + b.id, kind, title: b.name[lang] ?? b.name.en ?? b.name.de, href: "/sonnensystem/" + b.id, score: s + 5 });
  }

  for (const c of d.consts) {
    const cname = c.names[lang] ?? c.names.en ?? c.la;
    const s = score(q, [...Object.values(c.names), c.la, c.abbr]);
    if (s) hits.push({ key: "c:" + c.slug, kind: "constellation", title: cname, href: "/sternbilder/" + c.slug, score: s });
    for (const st of c.top ?? []) {
      const ss = score(q, [st.n, st.d]);
      if (ss && st.n) hits.push({ key: "s:" + c.slug + st.d, kind: "star", title: st.n, href: "/sternbilder/" + c.slug, mag: st.m, ly: st.ly, inConst: cname, score: ss - 2 - st.m * 0.5 });
    }
  }

  for (const r of d.reiche) {
    const title = d.reichNameL(r.en, lang, r.de);
    const s = score(q, [r.en, r.de ?? "", title]);
    if (s) hits.push({ key: "e:" + r.slug, kind: "empire", title, href: "/imperien/reich/" + r.slug, from: r.from, to: r.to, score: s - 1 + Math.min(1, (r.peakArea ?? 0) / 3e7) });
  }

  hits.sort((a, b) => b.score - a.score);
  const per: Partial<Record<CosmosKind, number>> = {};
  const out: CosmosHit[] = [];
  for (const h of hits) {
    const lim = h.kind === "star" ? 4 : h.kind === "empire" ? 6 : 5;
    per[h.kind] = (per[h.kind] ?? 0) + 1;
    if (per[h.kind]! > lim) continue;
    out.push(h);
    if (out.length >= 12) break;
  }
  return out;
}
