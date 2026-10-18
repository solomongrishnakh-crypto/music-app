import type { Lang } from "@/contexts/LanguageContext";

/**
 * Suche über Himmelskörper, Sternbilder, benannte Sterne und Imperien
 * (Nutzerwunsch 14.10.2026). Läuft komplett im Browser über die vorhandenen
 * Datensätze; die großen Daten werden erst bei der ersten Suche geladen.
 */
export type CosmosKind = "planet" | "dwarf" | "sun" | "probe" | "constellation" | "star" | "empire" | "dso" | "fact";

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
  /** Untertitel für Galaxien/Nebel (Katalogname + Helligkeit) und Fakten-Karten (Wert) */
  sub?: string;
  score: number;
}

/** Normalisieren: Groß/Klein, Akzente, Umlaute (ä/ae), ß, arabische/persische Varianten. */
const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f\u064b-\u065f\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/[ىيئ]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[ةۀ]/g, "ه")
    .replace(/ae|oe|ue/g, (m) => m[0])
    .replace(/[^\p{L}\p{N}\s\-'’]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Edit-Distanz (Damerau, begrenzt): gibt max+1 zurück, wenn größer als max. */
function dist(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const m = a.length, n = b.length;
  let p2: number[] = [];
  let p1 = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= n; j++) {
      let v = Math.min(p1[j] + 1, cur[j - 1] + 1, p1[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, p2[j - 2] + 1);
      cur[j] = v;
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    p2 = p1;
    p1 = cur;
  }
  return p1[n];
}

const tol = (len: number) => (len <= 3 ? 0 : len <= 6 ? 1 : 2);

/** Wert eines einzelnen Suchworts gegen ein Wort des Namens (0 = kein Treffer). */
function wordScore(t: string, w: string): number {
  if (w === t) return 70;
  if (w.startsWith(t)) return 60;
  if (t.length >= 3 && w.includes(t)) return 35;
  const k = tol(t.length);
  if (!k) return 0;
  const d1 = dist(t, w, k);
  if (d1 <= k) return 55 - d1 * 8;
  const d2 = dist(t, w.slice(0, t.length), k);
  if (d2 <= k) return 48 - d2 * 8;
  return 0;
}

function score(q: string, names: string[]): number {
  const toks = q.split(/[\s\-'’]+/).filter(Boolean);
  let best = 0;
  for (const n of names) {
    const x = norm(n);
    if (!x) continue;
    if (x === q) return 100;
    if (x.startsWith(q)) { best = Math.max(best, 80); continue; }
    const words = x.split(/[\s\-'’]+/).filter(Boolean);
    if (words.some((w) => w.startsWith(q))) { best = Math.max(best, 60); continue; }
    if (q.length >= 3 && x.includes(q)) best = Math.max(best, q.length >= 5 ? 40 : 30);
    // Wortweise (Reihenfolge egal, Tippfehler erlaubt): jedes Suchwort muss ein Namenswort treffen
    if (toks.length) {
      let sum = 0;
      for (const t of toks) {
        let m = 0;
        for (const w of words) m = Math.max(m, wordScore(t, w));
        if (!m) { sum = 0; break; }
        sum += m;
      }
      if (sum) best = Math.max(best, Math.min(58, (sum / toks.length) * 0.85));
    }
    // ganzer Name mit Tippfehler (z. B. „jupitr“)
    const k = tol(q.length);
    if (k && dist(q, x, k) <= k) best = Math.max(best, 50);
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
  const [bodies, consts, reiche, names, dsoMod, factMod] = await Promise.all([
    import("@/components/space/bodies"),
    import("@/data/sternbilder.json"),
    import("@/data/reiche/index.json"),
    import("@/lib/history/reicheNames"),
    import("@/data/dsoSearch.json"),
    import("@/data/factsSearch.json"),
  ]);
  return {
    bodies: bodies.SPACE_BODIES,
    consts: (consts.default as unknown as ConstRow[]),
    reiche: reiche.default as unknown as { slug: string; en: string; de: string | null; from: number; to: number; peakArea: number }[],
    reichNameL: names.reichNameL,
    dso: dsoMod.default as unknown as { id: string; m: number; f?: number; n?: Record<string, string> }[],
    facts: factMod.default as unknown as { i: number; l: Record<string, string>; v: Record<string, string> }[],
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
    hits.push({ key: "b:" + b.id, kind, title: b.name[lang] ?? b.name.en ?? b.name.de, href: "/sonnensystem/" + b.id, score: s + 5 + (kind === "sun" ? 10 : kind === "planet" ? 8 : 0) });
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

  // Galaxien, Nebel, Sternhaufen (Nutzerwunsch 18.10.2026: Suche verstärken) — Namen in allen Sprachen
  for (const o of d.dso) {
    const s = score(q, [...Object.values(o.n ?? {}), o.id]);
    if (!s) continue;
    hits.push({
      key: "d:" + o.id,
      kind: "dso",
      title: (o.n && (o.n[lang] ?? o.n.en)) || o.id,
      href: "/sternenhimmel?d=" + encodeURIComponent(o.id),
      sub: `${o.id} · ${o.m.toFixed(1)} mag`,
      score: s + (o.f ? 6 : 0) - 2,
    });
  }

  // Fakten-Karten aus "Universum in Zahlen"
  for (const f of d.facts) {
    const s = score(q, Object.values(f.l));
    if (!s) continue;
    hits.push({ key: "f:" + f.i, kind: "fact", title: f.l[lang] ?? f.l.en, href: "/universum?fact=" + f.i, sub: f.v[lang] ?? f.v.en, score: s - 3 });
  }

  hits.sort((a, b) => b.score - a.score);
  const per: Partial<Record<CosmosKind, number>> = {};
  const out: CosmosHit[] = [];
  for (const h of hits) {
    const lim = h.kind === "star" ? 4 : h.kind === "empire" ? 6 : h.kind === "fact" ? 3 : 5;
    per[h.kind] = (per[h.kind] ?? 0) + 1;
    if (per[h.kind]! > lim) continue;
    out.push(h);
    if (out.length >= 12) break;
  }
  return out;
}
