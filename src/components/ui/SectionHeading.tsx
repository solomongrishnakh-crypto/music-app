/**
 * Nummerierter Abschnitts-Kopf im HUD-Stil ("01 ── MUSIK ─────").
 * Nutzerwunsch 02.10.2026: neues, einheitliches Design für die ganze Seite.
 * Ein führendes "// " aus den Übersetzungen wird entfernt.
 */
export default function SectionHeading({ index, label, className = "" }: { index: string; label: string; className?: string }) {
  return (
    <div className={`hud-head ${className}`}>
      <span className="hud-idx">{index}</span>
      <span className="hud-head-label">{label.replace(/^\/\/\s*/, "")}</span>
      <span aria-hidden="true" className="hud-rule" />
    </div>
  );
}
