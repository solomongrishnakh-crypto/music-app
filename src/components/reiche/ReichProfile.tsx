// Profil eines Reichs: Stärke, berühmte Persönlichkeiten, Kriege, Sprachen.
// Reine Anzeige ohne Hooks - funktioniert in Server- und Client-Komponenten.
import type { Lang } from "@/contexts/LanguageContext";
import { PROFILE_LABELS, getProfile, langName, pick } from "@/lib/history/reichProfiles";

function Chips({ items, tone }: { items: string[]; tone?: string }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-1.5">
      {items.map((s) => (
        <li key={s} className={"rounded-full border px-2.5 py-1 text-xs " + (tone ?? "border-border text-foreground/90")}>
          {s}
        </li>
      ))}
    </ul>
  );
}

function Wars({ title, items, dot, lang, compact }: { title: string; items: string[]; dot: string; lang: Lang; compact?: boolean }) {
  if (!items.length) return null;
  return (
    <div>
      <h4 className="label-mono text-[10px] uppercase tracking-wide text-muted">{title}</h4>
      <ul className="mt-1.5 space-y-1">
        {items.map((s) => (
          <li key={s} className={"flex gap-2 text-foreground/90 " + (compact ? "text-xs" : "text-sm")}>
            <span aria-hidden="true" className={"mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full " + dot} />
            <span>{pick(s, lang)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ReichProfile({ slug, lang, compact }: { slug: string; lang: Lang; compact?: boolean }) {
  const p = getProfile(slug);
  const L = PROFILE_LABELS[lang] ?? PROFILE_LABELS.en;
  if (!p) return compact ? <p className="mt-4 text-xs text-muted">{L[6]}</p> : null;
  const label = "label-mono text-[10px] uppercase tracking-wide text-muted";
  const langs = p.g.map((c) => langName(c, lang));
  return (
    <div className={compact ? "mt-4 space-y-4" : "mt-4 space-y-5"}>
      <div className="border-s-2 border-accent bg-accent/5 px-3 py-2">
        <h4 className={label}>{L[0]}</h4>
        <p className={"mt-1 leading-relaxed text-foreground/90 " + (compact ? "text-xs" : "text-sm")}>{pick(p.s, lang)}</p>
      </div>
      <div>
        <h4 className={label}>{L[1]}</h4>
        <Chips items={p.f.map((s) => pick(s, lang))} />
      </div>
      <div className={compact ? "space-y-3" : "grid gap-4 sm:grid-cols-2"}>
        <Wars title={L[2]} items={p.w} dot="bg-green-400" lang={lang} compact={compact} />
        <Wars title={L[3]} items={p.l} dot="bg-red-400" lang={lang} compact={compact} />
        {p.d && <Wars title={L[4]} items={p.d} dot="bg-amber-400" lang={lang} compact={compact} />}
      </div>
      <div>
        <h4 className={label}>{L[5]}</h4>
        {langs.length > 0 && <Chips items={langs} tone="border-accent/40 text-accent" />}
        {p.gn && <p className="mt-1.5 text-xs text-muted">{pick(p.gn, lang)}</p>}
      </div>
    </div>
  );
}
