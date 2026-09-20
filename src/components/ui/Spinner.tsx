// Nutzerwunsch 20.09.2026: "// Lädt..." durch ein drehendes Objekt ersetzen,
// damit klar sichtbar ist, dass gerade wirklich geladen wird (statischer
// Text wirkt schnell wie eingefroren/hängengeblieben). Reines CSS (kein
// zusätzliches Icon-Paket nötig) — ein sich drehender Ring in der
// Akzentfarbe, dazu weiterhin ein kurzes Label für Screenreader/Kontext.
export default function Spinner({
  label = "Lädt…",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`} role="status" aria-live="polite">
      <span
        className="h-4 w-4 flex-none animate-spin rounded-full border-2 border-border border-t-accent"
        aria-hidden="true"
      />
      <span className="label-mono text-xs uppercase text-muted">{label}</span>
    </div>
  );
}
