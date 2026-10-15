// Futuristischer Lader (Nutzerwunsch 15.10.2026: "Text lädt entfernen und durch
// ein futuristisches Ladeobjekt ersetzen"): drei gegenläufige Ringe mit einem
// leuchtenden Kern. Reines CSS, kein sichtbarer Text; das Label bleibt nur
// für Screenreader.
export default function Spinner({
  label = "Lädt…",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center ${className}`} role="status" aria-live="polite">
      <span className="relative inline-block h-10 w-10 flex-none" aria-hidden="true">
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-accent border-r-accent/40 [animation-duration:1.1s]" />
        <span className="absolute inset-1.5 animate-spin rounded-full border-2 border-transparent border-b-foreground/80 border-l-foreground/30 [animation-direction:reverse] [animation-duration:1.6s]" />
        <span className="absolute inset-3 animate-spin rounded-full border border-transparent border-t-accent [animation-duration:0.7s]" />
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-accent shadow-[0_0_10px_2px_rgba(var(--hud-accent),0.9)]" />
      </span>
      <span className="sr-only">{label}</span>
    </div>
  );
}
