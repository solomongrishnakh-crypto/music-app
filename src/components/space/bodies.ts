import { DWARF_PLANETS, PLANETS, SUN, VOYAGER1, VOYAGER2, NEWHORIZONS, PIONEER10, PIONEER11, type PlanetData } from "@/data/solarSystem";

/** Alle Himmelskörper mit eigener Seite (Sonne, Planeten, Zwergplaneten, Voyager 1 und 2). */
export const SPACE_BODIES: PlanetData[] = [SUN, ...PLANETS, ...DWARF_PLANETS, VOYAGER1, VOYAGER2, NEWHORIZONS, PIONEER10, PIONEER11];

export function findBody(id: string): PlanetData | undefined {
  return SPACE_BODIES.find((b) => b.id === id);
}
