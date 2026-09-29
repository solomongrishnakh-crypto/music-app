import * as THREE from "three";

/**
 * Futuristisches Zellen-Netz für den Seitenhintergrund
 * (Nutzerwunsch 29.09.2026: "diese Zellen im Hintergrund kompakter und
 * futuristischer machen").
 *
 * Unterschied zum alten Netz:
 *  - kompakter: mehr Knoten, aber nur zu den nächsten Nachbarn verbunden
 *    und mit kürzerer Maximal-Länge → viele kleine, gleichmäßige Zellen
 *    statt großer, langer Dreiecke quer über den Bildschirm.
 *  - futuristischer: feine, gleichmäßige Leitungen wie auf einer Platine;
 *    weiter entfernte Linien werden dunkler (Tiefe). Leuchtpunkte laufen
 *    ständig in gleichmäßigem Tempo auf zufälligen Wegen durch das Netz
 *    (Bewegung in ThreeBackground.tsx; Nutzerwunsch: "sollen ständig
 *    durch Zellen laufen, random Pfad, langsamer, nicht verschwinden").
 */

export interface CellNetwork {
  lines: THREE.LineSegments;
  /** Nachbarn je Knoten — für die Partikel, die über das Netz wandern */
  adjacency: number[][];
  dispose: () => void;
}

const VERT = `
varying float vDepth;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

const FRAG = `
precision highp float;
uniform vec3 uBase;
varying float vDepth;
void main() {
  // feine, gleichmäßige Leitungen; weit hinten dunkler (Kamera bei z = 9)
  // Helligkeit 0.17 → 0.4 (Nutzerwunsch 29.09.2026: "Zellen fast unsichtbar",
  // v. a. auf dem Handy mit dünnen 1-px-Linien bei hoher Pixeldichte)
  float depthFade = clamp(1.4 - vDepth / 16.0, 0.35, 1.0);
  gl_FragColor = vec4(uBase * 0.4 * depthFade, 1.0);
}
`;

export function createCellNetwork(
  basePositions: Float32Array,
  count: number,
  opts: { maxDist?: number; neighbors?: number } = {}
): CellNetwork {
  const maxDist = opts.maxDist ?? 1.9;
  const k = opts.neighbors ?? 4;
  const maxD2 = maxDist * maxDist;

  const adjSet: Set<number>[] = Array.from({ length: count }, () => new Set<number>());
  function addEdge(a: number, b: number) {
    adjSet[a].add(b);
    adjSet[b].add(a);
  }

  // Für jeden Knoten die k nächsten Nachbarn innerhalb maxDist
  const sorted: number[][] = Array.from({ length: count }, () => []);
  const cand: { j: number; d: number }[] = [];
  for (let i = 0; i < count; i++) {
    cand.length = 0;
    const xi = basePositions[i * 3];
    const yi = basePositions[i * 3 + 1];
    const zi = basePositions[i * 3 + 2];
    for (let j = 0; j < count; j++) {
      if (j === i) continue;
      const dx = xi - basePositions[j * 3];
      const dy = yi - basePositions[j * 3 + 1];
      const dz = zi - basePositions[j * 3 + 2];
      const d = dx * dx + dy * dy + dz * dz;
      // etwas weiter suchen als maxDist, damit Endpunkte später noch
      // einen zweiten Anschluss bekommen können
      if (d < maxD2 * 2.25) cand.push({ j, d });
    }
    cand.sort((a, b) => a.d - b.d);
    sorted[i] = cand.map((c) => c.j);
    for (let n = 0; n < Math.min(k, cand.length); n++) {
      if (cand[n].d < maxD2) addEdge(i, cand[n].j);
    }
  }

  // Keine Sackgassen (Nutzerwunsch 29.09.2026: "manche Zellen haben ein
  // Ende"): 1) Knoten mit nur einer Leitung bekommen eine zweite zum
  // nächstgelegenen weiteren Nachbarn. 2) Was danach immer noch ein offenes
  // Ende hat, wird schrittweise entfernt — übrig bleiben nur geschlossene
  // Zellen, durch die die Punkte endlos weiterlaufen können.
  for (let i = 0; i < count; i++) {
    if (adjSet[i].size !== 1) continue;
    for (const j of sorted[i]) {
      if (!adjSet[i].has(j)) {
        addEdge(i, j);
        break;
      }
    }
  }
  const queue: number[] = [];
  for (let i = 0; i < count; i++) if (adjSet[i].size === 1) queue.push(i);
  while (queue.length) {
    const i = queue.pop()!;
    if (adjSet[i].size !== 1) continue;
    const j = adjSet[i].values().next().value as number;
    adjSet[i].delete(j);
    adjSet[j].delete(i);
    if (adjSet[j].size === 1) queue.push(j);
  }

  const pairs: [number, number][] = [];
  const adjacency: number[][] = adjSet.map((set) => Array.from(set));
  for (let i = 0; i < count; i++) for (const j of adjSet[i]) if (i < j) pairs.push([i, j]);

  const pos = new Float32Array(pairs.length * 6);
  pairs.forEach(([i, j], n) => {
    pos.set([basePositions[i * 3], basePositions[i * 3 + 1], basePositions[i * 3 + 2]], n * 6);
    pos.set([basePositions[j * 3], basePositions[j * 3 + 1], basePositions[j * 3 + 2]], n * 6 + 3);
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));

  const material = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      uBase: { value: new THREE.Color("#ff6a5a") },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const lines = new THREE.LineSegments(geometry, material);

  return {
    lines,
    adjacency,
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
