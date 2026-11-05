import type { Lang } from "@/contexts/LanguageContext";
import { localize } from "@/lib/i18n";
import { SPACE_BODIES } from "@/components/space/bodies";
import { STARS } from "@/lib/starPages";
import DSO from "@/data/dsoSearch.json";

/**
 * Alle Objekte mit eigener Seite /himmelsposition/<id>: Sonne, Planeten und Raumsonden
 * (Position live aus Bahndaten), bekannte Sterne und Nebel/Galaxien (feste Koordinaten, J2000).
 */
export type SkyKind = "body" | "star" | "dso";
export interface SkyEntry {
  id: string;
  kind: SkyKind;
  /** feste Koordinaten (Grad, J2000) und Entfernung in Lichtjahren – nur bei star/dso */
  ra?: number;
  dec?: number;
  ly?: number;
  /** Raumsonde? */
  probe?: boolean;
  /** Messier-Nummer o. Ä. für den Sprung im Sternenhimmel (?d=M31) */
  dsoId?: string;
}

// [id, Rektaszension°, Deklination°, Entfernung in Lichtjahren]
const DSO_COORDS: [string, number, number, number][] = [
  ["M1", 83.6331, 22.0145, 6500],
  ["M8", 270.9042, -24.3833, 4100],
  ["M13", 250.4235, 36.4613, 22200],
  ["M16", 274.7, -13.8, 7000],
  ["M20", 270.6, -23.03, 5200],
  ["M27", 299.9016, 22.7211, 1360],
  ["M31", 10.6847, 41.269, 2537000],
  ["M33", 23.4621, 30.6599, 2730000],
  ["M42", 83.8221, -5.3911, 1344],
  ["M45", 56.75, 24.1167, 444],
  ["M51", 202.4696, 47.1952, 23000000],
  ["M57", 283.3963, 33.0292, 2300],
  ["M81", 148.8882, 69.0653, 11800000],
  ["M87", 187.7059, 12.3911, 53500000],
  ["M101", 210.8024, 54.3489, 20900000],
  ["M104", 189.9976, -11.6231, 29000000],
];

const DSO_BY_ID = new Map((DSO as unknown as { id: string; n: Record<string, string> }[]).map((d) => [d.id, d]));

export const SKY_ENTRIES: SkyEntry[] = [
  ...SPACE_BODIES.filter((b) => b.id !== "earth").map((b): SkyEntry => ({ id: b.id, kind: "body", probe: b.kind === "probe" })),
  ...STARS.map((s): SkyEntry => ({ id: s[0], kind: "star", ra: s[2], dec: s[3], ly: s[5] })),
  ...DSO_COORDS.map(([id, ra, dec, ly]): SkyEntry => ({ id: id.toLowerCase(), kind: "dso", ra, dec, ly, dsoId: id })),
];

export const findSkyEntry = (id: string) => SKY_ENTRIES.find((e) => e.id === id);

/** Name des Objekts in der Sprache lang. */
export function skyName(e: SkyEntry, lang: Lang): string {
  if (e.kind === "body") {
    const b = SPACE_BODIES.find((x) => x.id === e.id)!;
    return localize(b.name, lang);
  }
  if (e.kind === "star") return STARS.find((s) => s[0] === e.id)![1];
  const d = DSO_BY_ID.get(e.dsoId!);
  const n = d?.n as Record<string, string> | undefined;
  return n?.[lang] ?? n?.en ?? e.dsoId!;
}
