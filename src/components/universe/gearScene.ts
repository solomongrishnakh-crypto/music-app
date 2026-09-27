import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { AXLE_COUNT, machineAngles, preciseNow } from "./machineTime";

/**
 * Reine three.js-Logik der Zahnrad-Maschine (ohne React), damit sie auch
 * außerhalb von Next.js getestet werden kann. Wird von Gear3D.tsx genutzt.
 *
 * Aufbau wie eine echte Untersetzungsmaschine ("Google Gear"/Googol-Maschine):
 *   - Ein Elektromotor (Getriebemotor mit Flansch, Abstandsbolzen, Kabeln)
 *     treibt über sein Ritzel das erste große Rad an.
 *   - Jede Achse trägt ein großes Rad (60 Zähne) und ein Ritzel (10 Zähne).
 *     Ritzel i treibt Rad i+1 → exakt 6:1 pro Stufe. Zähne greifen korrekt
 *     ineinander (gleiche Zahngröße, ausgerichtete Zahnphasen, Drehzahlen
 *     exakt nach Zähneverhältnis).
 *   - Alle Achsen in einer geraden Reihe, Räder zyklisch auf drei Ebenen,
 *     sodass sich nur die jeweiligen Partner berühren (nachgerechnet).
 *
 * Zeitlich gerechnet: 23 Achsen → letztes Rad 6^22-mal langsamer als das
 * erste. Erstes Rad ≈3,3 s pro Umdrehung, letztes exakt 13,797 Mrd. Jahre
 * (= Alter des Universums im Ticker). Zeitbasis: echte Uhr.
 */

const PINION_TEETH = 10;
const GEAR_TEETH = 60;

const M = 0.02; // Teilkreisradius pro Zahn
const ADDENDUM = 2 * M;
const DEDENDUM = 2.5 * M;
const PRESSURE_ANGLE = (20 * Math.PI) / 180;

const GEAR_FACE = 0.22;
const PINION_FACE = 0.26;
const PLANE_GAP = 0.34;

const SHAFT_R = 3.2 * M;
const HUB_R = 10 * M;
const PLATE_FRONT = -(PINION_FACE / 2) - 0.07;
const PLATE_DEPTH = 0.08;
const SHAFT_FRONT = 2 * PLANE_GAP + GEAR_FACE / 2 + 0.05;


/** Punkte (Radius, Winkel) der Zahnkontur für Zahn k, gegen den Uhrzeigersinn. */
function toothProfile(teeth: number, k: number): [number, number][] {
  const pitchR = teeth * M;
  const tipR = pitchR + ADDENDUM;
  const rootR = pitchR - DEDENDUM;
  const step = (Math.PI * 2) / teeth;
  const halfPitchW = pitchR * (Math.PI / teeth) * 0.47;
  const halfTipW = Math.max(halfPitchW - ADDENDUM * Math.tan(PRESSURE_ANGLE), halfPitchW * 0.3);
  const halfRootW = halfPitchW + DEDENDUM * Math.tan(PRESSURE_ANGLE) * 0.2;
  const aPitch = halfPitchW / pitchR;
  const aTip = halfTipW / tipR;
  const aRoot = Math.min(halfRootW / rootR, step * 0.48);
  const c = k * step;
  return [
    [rootR, c - aRoot],
    [pitchR, c - aPitch],
    [tipR, c - aTip],
    [tipR, c + aTip],
    [pitchR, c + aPitch],
    [rootR, c + aRoot],
    [rootR, c + step / 2],
  ];
}

/**
 * Dünne Lackschicht auf der Außenkante eines Zahnrads: folgt der Zahnkontur
 * über `toothCount` Zähne (um Zahn 0 zentriert), um `offset` nach außen
 * versetzt, von z = −zHalf bis +zHalf. UV: u entlang der Radachse (Strich-
 * richtung der Textur), v entlang der Kontur (Strichbreite).
 */
function createEdgePaintGeometry(teeth: number, toothCount: number, zHalf: number, offset: number): THREE.BufferGeometry {
  const first = -Math.floor(toothCount / 2);
  const raw: THREE.Vector2[] = [];
  for (let k = first; k < first + toothCount; k++) {
    const pts = toothProfile(teeth, k);
    const last = k === first + toothCount - 1 ? 6 : 7; // am Ende nicht in die nächste Lücke laufen
    for (let j = 0; j < last; j++) {
      const [r, a] = pts[j];
      raw.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r));
    }
  }
  // Segmente unterteilen, damit der Lack sauber der Form folgt
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i < raw.length - 1; i++) {
    for (let s = 0; s < 4; s++) pts.push(raw[i].clone().lerp(raw[i + 1], s / 4));
  }
  pts.push(raw[raw.length - 1].clone());
  // Außen-Normalen (Kontur läuft gegen den Uhrzeigersinn → Normale = (dy, −dx))
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i < pts.length; i++) {
    const prev = pts[Math.max(i - 1, 0)];
    const next = pts[Math.min(i + 1, pts.length - 1)];
    const t = next.clone().sub(prev).normalize();
    const n = new THREE.Vector2(t.y, -t.x);
    const p = pts[i].clone().addScaledVector(n, offset);
    const v = i / (pts.length - 1);
    positions.push(p.x, p.y, -zHalf, p.x, p.y, zHalf);
    uvs.push(0, v, 1, v);
    if (i < pts.length - 1) {
      const a = i * 2;
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Lack auf der Vorderseite der Zähne im selben Winkelbereich wie
 * createEdgePaintGeometry — so läuft der Strich wie ein echter
 * Lackstift-Wisch über die Kante auf die Stirnseite. UV: u radial
 * (innen 0 → Zahnspitze 1), v entlang des Winkels.
 */
function createFacePaintGeometry(teeth: number, toothCount: number, depthInto: number): THREE.BufferGeometry {
  const first = -Math.floor(toothCount / 2);
  const outer: THREE.Vector2[] = [];
  for (let k = first; k < first + toothCount; k++) {
    const pts = toothProfile(teeth, k);
    const last = k === first + toothCount - 1 ? 6 : 7;
    for (let j = 0; j < last; j++) {
      const [r, a] = pts[j];
      outer.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r));
    }
  }
  const aStart = Math.atan2(outer[0].y, outer[0].x);
  const aEnd = Math.atan2(outer[outer.length - 1].y, outer[outer.length - 1].x);
  const rootR = teeth * M - DEDENDUM;
  const tipR = teeth * M + ADDENDUM;
  const rInner = rootR - depthInto;
  const shape = new THREE.Shape();
  shape.moveTo(Math.cos(aStart) * rInner, Math.sin(aStart) * rInner);
  outer.forEach((p) => shape.lineTo(p.x, p.y));
  shape.lineTo(Math.cos(aEnd) * rInner, Math.sin(aEnd) * rInner);
  shape.absarc(0, 0, rInner, aEnd, aStart, true);
  const geo = new THREE.ShapeGeometry(shape, 24);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const uv = geo.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const r = Math.hypot(x, y);
    const a = Math.atan2(y, x);
    uv.setXY(i, (r - rInner) / (tipR - rInner), (a - aStart) / (aEnd - aStart));
  }
  uv.needsUpdate = true;
  return geo;
}

function drawToothOutline(shape: THREE.Shape, teeth: number) {
  const pitchR = teeth * M;
  const tipR = pitchR + ADDENDUM;
  const rootR = pitchR - DEDENDUM;
  const step = (Math.PI * 2) / teeth;
  const halfPitchW = pitchR * (Math.PI / teeth) * 0.47;
  const halfTipW = Math.max(halfPitchW - ADDENDUM * Math.tan(PRESSURE_ANGLE), halfPitchW * 0.3);
  const halfRootW = halfPitchW + DEDENDUM * Math.tan(PRESSURE_ANGLE) * 0.2;
  const aPitch = halfPitchW / pitchR;
  const aTip = halfTipW / tipR;
  const aRoot = Math.min(halfRootW / rootR, step * 0.48);
  for (let k = 0; k < teeth; k++) {
    const c = k * step;
    const pts: [number, number][] = [
      [rootR, c - aRoot],
      [pitchR, c - aPitch],
      [tipR, c - aTip],
      [tipR, c + aTip],
      [pitchR, c + aPitch],
      [rootR, c + aRoot],
      [rootR, c + step / 2],
    ];
    pts.forEach(([r, a], j) => {
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (k === 0 && j === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    });
  }
  shape.closePath();
  return { pitchR, tipR, rootR };
}

function circlePath(r: number, cx = 0, cy = 0): THREE.Path {
  const p = new THREE.Path();
  p.absarc(cx, cy, r, 0, Math.PI * 2, true);
  return p;
}

function extrudeCentered(shape: THREE.Shape, depth: number, bevel: number): THREE.ExtrudeGeometry {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel * 0.7,
    bevelSegments: 2,
    curveSegments: 40,
  });
  geo.translate(0, 0, -depth / 2);
  return geo;
}

/** Zylinder entlang der z-Achse, von z0 bis z1. */
function zCylinder(r: number, z0: number, z1: number, segments = 32, rTop = r): THREE.CylinderGeometry {
  const g = new THREE.CylinderGeometry(rTop, r, z1 - z0, segments);
  g.rotateX(Math.PI / 2);
  g.translate(0, 0, (z0 + z1) / 2);
  return g;
}

/**
 * Genfer Streifenschliff ("Côtes de Genève") als Textur: parallele,
 * leicht schräge Bänder mit weichem Glanzverlauf — typische Verzierung
 * der Platinen in Luxusuhren.
 */
function createGenevaStripesTexture(
  edge = "#131318",
  highlight = "#34343d",
  mid = "#2a2a32",
  repeat = 0.9
): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = edge;
    ctx.fillRect(0, 0, size, size);
    const band = size / 4;
    for (let b = 0; b < 4; b++) {
      const x0 = b * band;
      const g = ctx.createLinearGradient(x0, 0, x0 + band, 0);
      g.addColorStop(0, edge);
      g.addColorStop(0.45, highlight);
      g.addColorStop(0.55, mid);
      g.addColorStop(1, edge);
      ctx.fillStyle = g;
      ctx.fillRect(x0, 0, band, size);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat); // UVs sind Welteinheiten
  tex.rotation = 0.35;
  tex.anisotropy = 4;
  return tex;
}

/**
 * Pinselstrich in rotem Lack (Alpha-Textur): mehrere leicht versetzte,
 * halbtransparente Tupfer ergeben unregelmäßige Ränder und leicht
 * ungleichmäßige Deckkraft — wirkt wie von Hand aufgemalt.
 */
function createPaintStrokeTexture(): THREE.CanvasTexture {
  const w = 256;
  const h = 128;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    // Deterministischer Zufall, damit der Strich bei allen Besuchern gleich aussieht
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    ctx.clearRect(0, 0, w, h);
    for (let k = 0; k < 140; k++) {
      const t = k / 139;
      const x = 18 + t * (w - 36) + (rand() - 0.5) * 6;
      const y = h / 2 + Math.sin(t * 3.2) * 4 + (rand() - 0.5) * 8;
      const taper = Math.min(1, t * 5, (1 - t) * 4); // Anfang/Ende dünner
      const ry = (h * 0.3 + rand() * h * 0.08) * (0.55 + 0.45 * taper);
      const rx = 10 + rand() * 8;
      const shade = 195 + Math.floor(rand() * 45);
      const g = Math.floor(10 + rand() * 18);
      const bl = Math.floor(18 + rand() * 18);
      ctx.fillStyle = "rgba(" + shade + ", " + g + ", " + bl + ", " + (0.35 + rand() * 0.3) + ")";
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, (rand() - 0.5) * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    // feine Pinselspuren in Strichrichtung
    for (let k = 0; k < 18; k++) {
      const y = h / 2 + (rand() - 0.5) * h * 0.5;
      ctx.strokeStyle = "rgba(120, 0, 10, " + (0.12 + rand() * 0.12) + ")";
      ctx.lineWidth = 1 + rand() * 1.5;
      ctx.beginPath();
      ctx.moveTo(26 + rand() * 20, y);
      ctx.lineTo(w - 26 - rand() * 20, y + (rand() - 0.5) * 6);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export interface GearSceneOptions {
  /** Wie viel der Box die Maschine maximal füllt (0..1). */
  fill?: number;
}

export function createGearScene(mount: HTMLElement, opts: GearSceneOptions = {}): () => void {
  const fill = opts.fill ?? 0.95;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 300);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  mount.appendChild(renderer.domElement);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTexture;

  const disposables: { dispose: () => void }[] = [envTexture, pmrem];
  const track = <T extends { dispose: () => void }>(x: T): T => {
    disposables.push(x);
    return x;
  };

  // --- Materialien ---
  // Luxus-Uhrwerk-Look (Nutzerwunsch "bisschen luxuriöser"): polierte
  // Goldräder mit Klarlack, gebürsteter Gold-Steg, hochglanzpolierte
  // Stahlritzel, gebläute Schrauben, Rubin-Lagersteine in Goldfassungen,
  // dunkle Platte mit Genfer Streifenschliff ("Côtes de Genève").
  const gearMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xe2b15b,
      metalness: 1,
      roughness: 0.14,
      clearcoat: 0.6,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.25,
    })
  );
  const gearWebMat = track(
    new THREE.MeshPhysicalMaterial({ color: 0xcf9e4e, metalness: 1, roughness: 0.32, envMapIntensity: 1.1 })
  );
  const steelMat = track(
    new THREE.MeshPhysicalMaterial({ color: 0xdde2ea, metalness: 1, roughness: 0.08, envMapIntensity: 1.3 })
  );
  const blueSteelMat = track(
    new THREE.MeshPhysicalMaterial({ color: 0x2447b8, metalness: 1, roughness: 0.18, clearcoat: 0.5, envMapIntensity: 1.2 })
  );
  const rubyMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xc0102c,
      metalness: 0,
      roughness: 0.04,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      emissive: 0x3a0008,
      emissiveIntensity: 0.6,
      envMapIntensity: 1.5,
    })
  );
  const brushedMat = track(new THREE.MeshStandardMaterial({ color: 0xb4b9c0, metalness: 1, roughness: 0.42 }));
  const copperMat = track(new THREE.MeshStandardMaterial({ color: 0xc27a4a, metalness: 1, roughness: 0.3 }));
  // Rhodinierte Brücke mit Genfer Streifenschliff (hell, wie in Luxusuhren)
  const stripesTexture = track(createGenevaStripesTexture("#8c929b", "#e6e9ee", "#c9ced6", 2.2));
  const plateMat = track(
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      map: stripesTexture,
      metalness: 1,
      roughness: 0.22,
      clearcoat: 0.4,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.2,
    })
  );
  const blackPlasticMat = track(new THREE.MeshStandardMaterial({ color: 0x0d0d0f, metalness: 0, roughness: 0.55 }));
  const labelMat = track(new THREE.MeshStandardMaterial({ color: 0x1c1c22, metalness: 0.2, roughness: 0.5 }));
  const redWireMat = track(new THREE.MeshStandardMaterial({ color: 0xc0231a, metalness: 0, roughness: 0.45 }));
  const blackWireMat = track(new THREE.MeshStandardMaterial({ color: 0x151515, metalness: 0, roughness: 0.45 }));
  // Markierung wie von Hand mit rotem Lackstift auf das Metall gemalt:
  // matter Lack (kein Metallglanz) mit unregelmäßigen Pinselrändern als
  // flacher Aufkleber direkt auf dem Radkranz.
  const paintTexture = track(createPaintStrokeTexture());
  const markerMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: paintTexture,
      transparent: true,
      alphaTest: 0.05,
      metalness: 0,
      roughness: 0.55,
      emissive: 0x7a000c,
      emissiveIntensity: 0.5,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4,
    })
  );

  // --- Geteilte Geometrien ---
  const rimShape = new THREE.Shape();
  const { rootR: gearRootR } = drawToothOutline(rimShape, GEAR_TEETH);
  const rimInner = gearRootR - 6 * M;
  rimShape.holes.push(circlePath(rimInner));
  const rimGeo = track(extrudeCentered(rimShape, GEAR_FACE, 0.012));

  const webShape = new THREE.Shape();
  webShape.absarc(0, 0, rimInner + 2 * M, 0, Math.PI * 2, false);
  webShape.holes.push(circlePath(HUB_R * 0.9));
  const holeRingR = (HUB_R + rimInner) / 2;
  const holeR = ((rimInner - HUB_R) / 2) * 0.62;
  for (let h = 0; h < 6; h++) {
    const a = (h / 6) * Math.PI * 2 + Math.PI / 6;
    webShape.holes.push(circlePath(holeR, Math.cos(a) * holeRingR, Math.sin(a) * holeRingR));
  }
  const webGeo = track(extrudeCentered(webShape, GEAR_FACE * 0.4, 0.008));
  const hubGeo = track(zCylinder(HUB_R, -(GEAR_FACE + 0.07) / 2, (GEAR_FACE + 0.07) / 2, 40));

  const pinionShape = new THREE.Shape();
  drawToothOutline(pinionShape, PINION_TEETH);
  pinionShape.holes.push(circlePath(SHAFT_R));
  const pinionGeo = track(extrudeCentered(pinionShape, PINION_FACE, 0.01));

  const shaftGeo = track(zCylinder(SHAFT_R, PLATE_FRONT, SHAFT_FRONT, 20));
  const nutGeo = track(zCylinder(5 * M, SHAFT_FRONT, SHAFT_FRONT + 0.06, 6));
  const bushingGeo = track(zCylinder(6.5 * M, PLATE_FRONT, PLATE_FRONT + 0.035, 36));
  const jewelGeo = track(zCylinder(4.6 * M, PLATE_FRONT + 0.035, PLATE_FRONT + 0.05, 32, 4.2 * M));
  // Lackstrich über die Zahnkante (wie die gemalten Striche an der
  // Googol-Maschine von Daniel de Bruin, nur in Rot): eine hauchdünne
  // Lackschicht, die exakt der Zahnform folgt — über Spitzen, Flanken und
  // Lücken von 5 Zähnen, quer über die ganze Radbreite — und läuft wie ein
  // echter Lackstift-Wisch über die Kante auf die Vorderseite der Zähne.
  const PAINT_TEETH = 5;
  const markerGeo = track(createEdgePaintGeometry(GEAR_TEETH, PAINT_TEETH, GEAR_FACE / 2 - 0.004, 0.012 * 0.7 + 0.0025));
  const markerFaceGeo = track(createFacePaintGeometry(GEAR_TEETH, PAINT_TEETH, 3.5 * M));

  // --- Achsen in gerader Reihe, Motor links davon ---
  const centerDist = (GEAR_TEETH + PINION_TEETH) * M;
  const positions: THREE.Vector2[] = [];
  for (let i = 0; i < AXLE_COUNT; i++) positions.push(new THREE.Vector2(i * centerDist, 0));
  const motorPos = new THREE.Vector2(-centerDist, 0);

  // Zahnphasen: Treiber-Ritzel zeigt mit einem Zahn zum Rad (Richtung +x),
  // das angetriebene Rad zeigt mit einer Lücke zurück (Richtung −x).
  const gearStep = (Math.PI * 2) / GEAR_TEETH;
  const gearOffset = Math.PI - gearStep / 2;

  const assembly = new THREE.Group();
  scene.add(assembly);
  const axles: THREE.Group[] = [];

  positions.forEach((pos, i) => {
    const axle = new THREE.Group();
    axle.position.set(pos.x, pos.y, 0);

    const gear = new THREE.Group();
    gear.position.z = (i % 3) * PLANE_GAP;
    gear.rotation.z = gearOffset;
    gear.add(new THREE.Mesh(rimGeo, gearMat));
    gear.add(new THREE.Mesh(webGeo, gearWebMat));
    gear.add(new THREE.Mesh(hubGeo, gearMat));
    // Lackstrich über die Zahnkante (liegt auf Zahn 0 und seinen Nachbarn)
    gear.add(new THREE.Mesh(markerGeo, markerMat));
    const facePaint = new THREE.Mesh(markerFaceGeo, markerMat);
    facePaint.position.z = GEAR_FACE / 2 + 0.012 + 0.0015; // auf der Stirnfläche (inkl. Fase)
    gear.add(facePaint);
    axle.add(gear);

    const pinion = new THREE.Mesh(pinionGeo, steelMat);
    pinion.position.z = ((i + 1) % 3) * PLANE_GAP;
    axle.add(pinion);
    axle.add(new THREE.Mesh(shaftGeo, steelMat));
    axle.add(new THREE.Mesh(nutGeo, blueSteelMat));

    assembly.add(axle);
    axles.push(axle);

    // Goldfassung (Chaton) mit Rubin-Lagerstein
    const chaton = new THREE.Mesh(bushingGeo, gearMat);
    chaton.position.set(pos.x, pos.y, 0);
    assembly.add(chaton);
    const jewel = new THREE.Mesh(jewelGeo, rubyMat);
    jewel.position.set(pos.x, pos.y, 0);
    assembly.add(jewel);
  });

  // --- Elektromotor (Getriebemotor) als Antrieb ---
  // Ritzel auf Ebene 0 greift ins erste Rad. Motor sitzt davor (Richtung
  // Betrachter), gehalten von einem Flansch mit drei Abstandsbolzen zur
  // Grundplatte. Maße so gewählt, dass nichts das erste Rad berührt.
  const FLANGE_Z0 = 0.3;
  const FLANGE_Z1 = 0.36;
  const CAN_R = 0.27;
  const CAN_Z1 = 1.12;

  const motorRotor = new THREE.Group(); // dreht sich (Welle + Ritzel)
  motorRotor.position.set(motorPos.x, motorPos.y, 0);
  const motorPinion = new THREE.Mesh(pinionGeo, steelMat);
  motorRotor.add(motorPinion);
  motorRotor.add(new THREE.Mesh(track(zCylinder(SHAFT_R, -PINION_FACE / 2, FLANGE_Z0, 20)), steelMat));
  assembly.add(motorRotor);

  const motorBody = new THREE.Group(); // steht still
  motorBody.position.set(motorPos.x, motorPos.y, 0);
  // Getriebekopf / Flansch (quadratisch, abgerundet) mit 4 Schrauben
  const flangeShape = new THREE.Shape();
  const fh = 0.31;
  const fr = 0.06;
  flangeShape.moveTo(-fh + fr, -fh);
  flangeShape.lineTo(fh - fr, -fh);
  flangeShape.quadraticCurveTo(fh, -fh, fh, -fh + fr);
  flangeShape.lineTo(fh, fh - fr);
  flangeShape.quadraticCurveTo(fh, fh, fh - fr, fh);
  flangeShape.lineTo(-fh + fr, fh);
  flangeShape.quadraticCurveTo(-fh, fh, -fh, fh - fr);
  flangeShape.lineTo(-fh, -fh + fr);
  flangeShape.quadraticCurveTo(-fh, -fh, -fh + fr, -fh);
  flangeShape.holes.push(circlePath(SHAFT_R * 1.6));
  const flangeGeo = track(extrudeCentered(flangeShape, FLANGE_Z1 - FLANGE_Z0, 0.008));
  const flange = new THREE.Mesh(flangeGeo, brushedMat);
  flange.position.z = (FLANGE_Z0 + FLANGE_Z1) / 2;
  motorBody.add(flange);
  const screwHeadGeo = track(zCylinder(0.03, FLANGE_Z1, FLANGE_Z1 + 0.02, 16));
  for (const [sx, sy] of [
    [0.22, 0.22],
    [-0.22, 0.22],
    [0.22, -0.22],
    [-0.22, -0.22],
  ]) {
    const head = new THREE.Mesh(screwHeadGeo, blueSteelMat);
    head.position.set(sx, sy, 0);
    motorBody.add(head);
  }
  // Getriebegehäuse (kurzer Zylinder) + Motorbecher mit Kühlrippen
  motorBody.add(new THREE.Mesh(track(zCylinder(CAN_R * 0.95, FLANGE_Z1, FLANGE_Z1 + 0.16, 40)), brushedMat));
  motorBody.add(new THREE.Mesh(track(zCylinder(CAN_R, FLANGE_Z1 + 0.16, CAN_Z1, 48)), steelMat));
  const ribGeo = track(zCylinder(CAN_R + 0.012, 0, 0.018, 48));
  for (let r = 0; r < 6; r++) {
    const rib = new THREE.Mesh(ribGeo, brushedMat);
    rib.position.z = FLANGE_Z1 + 0.24 + r * 0.075;
    motorBody.add(rib);
  }
  // Etikett-Band
  motorBody.add(new THREE.Mesh(track(zCylinder(CAN_R + 0.004, CAN_Z1 - 0.3, CAN_Z1 - 0.12, 48)), labelMat));
  // Endkappe aus Kunststoff + Anschlussfahnen
  motorBody.add(new THREE.Mesh(track(zCylinder(CAN_R * 0.9, CAN_Z1, CAN_Z1 + 0.07, 40, CAN_R * 0.82)), blackPlasticMat));
  const terminalGeo = track(new THREE.BoxGeometry(0.05, 0.012, 0.09));
  const terminalPoints: THREE.Vector3[] = [];
  for (const sy of [0.11, -0.11]) {
    const t = new THREE.Mesh(terminalGeo, copperMat);
    t.position.set(0, sy, CAN_Z1 + 0.11);
    motorBody.add(t);
    terminalPoints.push(new THREE.Vector3(0, sy, CAN_Z1 + 0.14));
  }
  // Abstandsbolzen zur Grundplatte — außerhalb des Motorritzels (r 0,24)
  // und weg vom ersten Rad platziert (nachgerechnet, keine Berührung)
  const standoffGeo = track(zCylinder(0.035, PLATE_FRONT, FLANGE_Z0, 16));
  for (const [sx, sy] of [
    [-0.22, 0.22],
    [-0.22, -0.22],
    [0, 0.3],
    [0, -0.3],
  ]) {
    const s = new THREE.Mesh(standoffGeo, gearMat);
    s.position.set(sx, sy, 0);
    motorBody.add(s);
  }
  // Kabel (rot/schwarz) von den Anschlüssen nach hinten weg
  const wireGeos = terminalPoints.map((p, idx) => {
    const off = idx === 0 ? 0.04 : -0.04;
    const curve = new THREE.CatmullRomCurve3([
      p,
      new THREE.Vector3(-0.05, p.y * 0.6, p.z + 0.18),
      new THREE.Vector3(-0.35, -0.2 + off, p.z + 0.05),
      new THREE.Vector3(-0.5, -0.42 + off, 0.45),
      new THREE.Vector3(-0.52, -0.5 + off, PLATE_FRONT - 0.1),
      new THREE.Vector3(-0.5, -0.5 + off, PLATE_FRONT - 0.6),
    ]);
    return track(new THREE.TubeGeometry(curve, 40, 0.018, 8, false));
  });
  motorBody.add(new THREE.Mesh(wireGeos[0], redWireMat));
  motorBody.add(new THREE.Mesh(wireGeos[1], blackWireMat));
  assembly.add(motorBody);

  // --- Brücke statt Brett (Nutzerwunsch: "ohne dieses Brett oder
  // luxuriöser, was echt scheint") ---
  // Schlanke, rhodinierte Brücke wie in einem Skelett-Uhrwerk: trägt nur
  // die Lagersteine entlang der Achsreihe, polierte Fasen (Anglage) an den
  // Kanten, gebläute Schrauben in den Lücken. Rundherum ist nichts — der
  // Seitenhintergrund scheint durch.
  const BRIDGE_HALF = 0.2;
  const bridgeX0 = motorPos.x - 0.1;
  const bridgeX1 = positions[positions.length - 1].x + BRIDGE_HALF + 0.08;
  const bridgeShape = new THREE.Shape();
  bridgeShape.moveTo(bridgeX0, -BRIDGE_HALF);
  bridgeShape.lineTo(bridgeX1 - BRIDGE_HALF, -BRIDGE_HALF);
  bridgeShape.absarc(bridgeX1 - BRIDGE_HALF, 0, BRIDGE_HALF, -Math.PI / 2, Math.PI / 2, false);
  bridgeShape.lineTo(bridgeX0, BRIDGE_HALF);
  bridgeShape.lineTo(bridgeX0, -BRIDGE_HALF);
  const bridgeGeo = track(
    new THREE.ExtrudeGeometry(bridgeShape, {
      depth: PLATE_DEPTH,
      bevelEnabled: true,
      bevelThickness: 0.018,
      bevelSize: 0.018,
      bevelSegments: 3,
      curveSegments: 24,
    })
  );
  bridgeGeo.translate(0, 0, PLATE_FRONT - PLATE_DEPTH - 0.018);
  assembly.add(new THREE.Mesh(bridgeGeo, plateMat));

  // Runder Motorsockel (hält die Abstandsbolzen des Motors)
  const MOTOR_BASE_R = 0.42;
  const baseShape = new THREE.Shape();
  baseShape.absarc(0, 0, MOTOR_BASE_R, 0, Math.PI * 2, false);
  const baseGeo = track(
    new THREE.ExtrudeGeometry(baseShape, {
      depth: PLATE_DEPTH,
      bevelEnabled: true,
      bevelThickness: 0.018,
      bevelSize: 0.018,
      bevelSegments: 3,
      curveSegments: 48,
    })
  );
  baseGeo.translate(motorPos.x, motorPos.y, PLATE_FRONT - PLATE_DEPTH - 0.016);
  assembly.add(new THREE.Mesh(baseGeo, plateMat));

  // Gebläute Schrauben auf der Brücke, jeweils mittig zwischen zwei Achsen
  const bridgeScrewGeo = track(zCylinder(0.035, PLATE_FRONT, PLATE_FRONT + 0.018, 20));
  const slotGeo = track(new THREE.BoxGeometry(0.06, 0.009, 0.006));
  for (let i = 0; i < positions.length - 1; i++) {
    const x = (positions[i].x + positions[i + 1].x) / 2;
    for (const y of [0.12, -0.12]) {
      const screw = new THREE.Mesh(bridgeScrewGeo, blueSteelMat);
      screw.position.set(x, y, 0);
      assembly.add(screw);
      const slot = new THREE.Mesh(slotGeo, blackPlasticMat);
      slot.position.set(x, y, PLATE_FRONT + 0.019);
      slot.rotation.z = (i * 0.9 + y * 7) % Math.PI; // Schlitze unterschiedlich ausgerichtet
      assembly.add(slot);
    }
  }

  // Baugruppe zentrieren
  const bounds = new THREE.Box3().setFromObject(assembly);
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  assembly.position.sub(center);

  // --- Licht ---
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
  keyLight.position.set(-4, 5, 6);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0xff5a4d, 0.5);
  rimLight.position.set(4, -2, -3);
  scene.add(rimLight);
  scene.add(new THREE.AmbientLight(0xffffff, 0.2));

  // --- Kamera: schräg entlang der Reihe, Motor vorne ---
  // Einpassung per Projektion: für eine Blickrichtung wird per
  // Binärsuche der kleinste Abstand gesucht, bei dem alle Ecken der
  // Maschine ins Bild passen. Bei jedem Abstand wird der Blickpunkt so
  // verschoben, dass die Maschine im Bild zentriert ist (bei schrägem
  // Blick ist die Perspektive asymmetrisch — ohne Zentrierung bleibt
  // eine Seite der Box leer und die Maschine wird unnötig klein).
  const half = size.clone().multiplyScalar(0.5);
  const corners: THREE.Vector3[] = [];
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
    corners.push(new THREE.Vector3(sx * half.x, sy * half.y, sz * half.z));
  }
  const tmp = new THREE.Vector3();
  const right = new THREE.Vector3();
  const up = new THREE.Vector3();

  type Extent = { minX: number; maxX: number; minY: number; maxY: number };
  function evaluate(dir: THREE.Vector3, dist: number): { ok: boolean; target: THREE.Vector3 } {
    const target = new THREE.Vector3();
    function measure(): Extent | null {
      camera.position.copy(target).addScaledVector(dir, dist);
      camera.lookAt(target);
      camera.updateMatrixWorld();
      const e: Extent = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
      for (const c of corners) {
        tmp.copy(c).applyMatrix4(camera.matrixWorldInverse);
        if (tmp.z > -camera.near * 4) return null; // Ecke hinter der Kamera
        tmp.applyMatrix4(camera.projectionMatrix);
        e.minX = Math.min(e.minX, tmp.x);
        e.maxX = Math.max(e.maxX, tmp.x);
        e.minY = Math.min(e.minY, tmp.y);
        e.maxY = Math.max(e.maxY, tmp.y);
      }
      return e;
    }
    // Blickpunkt schrittweise so verschieben, dass die Maschine mittig sitzt
    for (let it = 0; it < 12; it++) {
      const e = measure();
      if (!e) return { ok: false, target };
      const halfH = dist * Math.tan((camera.fov * Math.PI) / 360);
      const halfW = halfH * camera.aspect;
      right.setFromMatrixColumn(camera.matrixWorld, 0);
      up.setFromMatrixColumn(camera.matrixWorld, 1);
      target
        .addScaledVector(right, ((e.minX + e.maxX) / 2) * halfW * 0.8)
        .addScaledVector(up, ((e.minY + e.maxY) / 2) * halfH * 0.8);
    }
    const e = measure();
    if (!e) return { ok: false, target };
    return { ok: e.minX >= -fill && e.maxX <= fill && e.minY >= -fill && e.maxY <= fill, target };
  }

  function fit(dir: THREE.Vector3): { dist: number; target: THREE.Vector3 } {
    let lo = 0.3;
    let hi = 400;
    for (let k = 0; k < 32; k++) {
      const mid = (lo + hi) / 2;
      if (evaluate(dir, mid).ok) hi = mid;
      else lo = mid;
    }
    return { dist: hi, target: evaluate(dir, hi).target };
  }

  // Canvas füllt immer exakt die Box (CSS), die Pixelgröße folgt per
  // ResizeObserver. Vorher wurde nur beim Fenster-Resize nachgemessen —
  // hatte die Box beim ersten Rendern noch eine andere Größe (Layout noch
  // nicht fertig), saß die Maschine verschoben und abgeschnitten in der Box.
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  function resize() {
    const w = Math.max(mount.clientWidth, 1);
    const h = Math.max(mount.clientHeight, 1);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  // Zoom übernimmt eine eigene Funktion (siehe zoomAt unten): Der
  // Standard-Zoom von OrbitControls verkleinert nur den Abstand zum
  // Drehpunkt und stoppt am Mindestabstand — weit hinten liegende Stellen
  // und Ecken waren so nicht erreichbar. Verschieben: Rechtsklick-Ziehen
  // bzw. zwei Finger.
  controls.enableZoom = false;
  controls.touches.TWO = THREE.TOUCH.PAN;
  controls.minDistance = 0;
  controls.maxDistance = Infinity;
  controls.enablePan = true;
  controls.screenSpacePanning = true;
  controls.autoRotate = false;
  controls.minPolarAngle = 0.35;
  controls.maxPolarAngle = Math.PI - 0.35;

  // Blickwinkel je nach Box-Form (im Browser getestet): breite Desktop-Box
  // → flacherer Blick, der die Breite nutzt; schmale Handy-Box → stärker
  // schräg entlang der Reihe, sodass sie perspektivisch nach hinten
  // wegläuft und die vorderen Räder groß bleiben.
  function viewDirection(): THREE.Vector3 {
    const t = Math.min(Math.max((camera.aspect - 1.3) / (3.3 - 1.3), 0), 1);
    const azimuth = -1.15 + t * (1.15 - 0.8);
    const polar = 1.3 + t * (1.38 - 1.3);
    return new THREE.Vector3().setFromSphericalCoords(1, polar, azimuth);
  }
  let startDir = viewDirection();
  let maxZoomOutDistance = 100;
  function refit() {
    const { dist, target } = fit(startDir);
    controls.target.copy(target);
    camera.position.copy(target).addScaledVector(startDir, dist);
    camera.lookAt(target);
    maxZoomOutDistance = dist * 2.5;
    controls.update();
  }
  refit();

  // Neu einpassen, sobald sich die Box-Größe ändert. Nur kleine
  // Höhenänderungen (mobile Adressleiste) lösen kein Neu-Einpassen aus,
  // damit der Zoom beim Scrollen nicht zurückspringt.
  let lastW = mount.clientWidth;
  let lastH = mount.clientHeight;
  function handleResize() {
    const w = mount.clientWidth;
    const h = mount.clientHeight;
    if (w === lastW && Math.abs(h - lastH) < 40) return;
    lastW = w;
    lastH = h;
    resize();
    startDir = viewDirection();
    refit();
  }
  const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(handleResize) : null;
  resizeObserver?.observe(mount);
  window.addEventListener("resize", handleResize);

  // --- Zoom auf beliebigen Punkt (Mausrad / Zwei-Finger-Pinch) ---
  // Nutzerwunsch: "man kann nicht in die Ecken zoomen oder überall wo man
  // es will". Der Punkt unter Maus/Fingern wird per Raycast auf der
  // Maschine bestimmt (sonst auf der Ebene durch den Drehpunkt). Kamera und
  // Drehpunkt werden dann gemeinsam auf diesen Punkt zu skaliert — der
  // Punkt bleibt dabei exakt unter dem Zeiger, und man kann beliebig nah an
  // jede Stelle heran (Motor, einzelne Zähne, letztes Rad).
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const viewPlane = new THREE.Plane();
  const planeHit = new THREE.Vector3();
  const MIN_ZOOM_DIST = 0.12;

  function zoomAt(clientX: number, clientY: number, factor: number) {
    const rect = renderer.domElement.getBoundingClientRect();
    ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObject(assembly, true);
    let point: THREE.Vector3 | null = hits.length > 0 ? hits[0].point.clone() : null;
    if (!point) {
      const viewDir = camera.getWorldDirection(new THREE.Vector3());
      viewPlane.setFromNormalAndCoplanarPoint(viewDir, controls.target);
      point = raycaster.ray.intersectPlane(viewPlane, planeHit) ? planeHit.clone() : null;
    }
    if (!point) return;
    const toCam = camera.position.clone().sub(point);
    const newDist = toCam.length() * factor;
    if (factor < 1 && newDist < MIN_ZOOM_DIST) return;
    const newCam = point.clone().addScaledVector(toCam, factor);
    if (factor > 1 && newCam.length() > maxZoomOutDistance) return;
    camera.position.copy(newCam);
    controls.target.sub(point).multiplyScalar(factor).add(point);
    controls.update();
  }

  // Zoom per Mausrad erst nach einem Klick in die Box: Sonst hat das
  // Scrollen der Seite (Mauszeiger fährt dabei über die Box) die Ansicht
  // verstellt und die Maschine verschoben/abgeschnitten. Verlässt die Maus
  // die Box, scrollt das Mausrad wieder ganz normal die Seite.
  let wheelActive = false;
  function handleWheel(event: WheelEvent) {
    if (!wheelActive) return; // Seite normal scrollen lassen
    event.preventDefault();
    const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
    const factor = Math.min(Math.max(Math.exp(delta * 0.0015), 0.5), 2);
    zoomAt(event.clientX, event.clientY, factor);
  }

  const touchPoints = new Map<number, { x: number; y: number }>();
  let lastPinchDist = 0;
  function pinchState() {
    const [a, b] = [...touchPoints.values()];
    return { dist: Math.hypot(a.x - b.x, a.y - b.y), cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 };
  }
  function handlePointerDown(event: PointerEvent) {
    wheelActive = true;
    if (event.pointerType !== "touch") return;
    touchPoints.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (touchPoints.size === 2) lastPinchDist = pinchState().dist;
  }
  function handlePointerMove(event: PointerEvent) {
    if (!touchPoints.has(event.pointerId)) return;
    touchPoints.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (touchPoints.size !== 2) return;
    const { dist, cx, cy } = pinchState();
    if (lastPinchDist > 0 && dist > 0) zoomAt(cx, cy, lastPinchDist / dist);
    lastPinchDist = dist;
  }
  function handlePointerUp(event: PointerEvent) {
    touchPoints.delete(event.pointerId);
    lastPinchDist = touchPoints.size === 2 ? pinchState().dist : 0;
  }
  const el = renderer.domElement;
  el.addEventListener("wheel", handleWheel, { passive: false });
  el.addEventListener("pointerdown", handlePointerDown);
  el.addEventListener("pointermove", handlePointerMove);
  el.addEventListener("pointerup", handlePointerUp);
  el.addEventListener("pointercancel", handlePointerUp);
  function handlePointerLeave() {
    wheelActive = false;
  }
  // Doppelklick: Ansicht auf die Startposition zurücksetzen
  function handleDoubleClick() {
    startDir = viewDirection();
    refit();
  }
  el.addEventListener("pointerleave", handlePointerLeave);
  el.addEventListener("dblclick", handleDoubleClick);

  // --- Animation: ewige Maschine, Stellung aus der absoluten Uhrzeit ---
  // (siehe machineTime.ts) — für alle Besucher gleich, startet nie neu.
  let animationId = 0;
  function animate() {
    const { axles: axleAngles, motor } = machineAngles(preciseNow());
    axles.forEach((axle, i) => {
      axle.rotation.z = axleAngles[i];
    });
    motorRotor.rotation.z = motor;
    controls.update();
    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  }
  animate();

  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener("resize", handleResize);
    resizeObserver?.disconnect();
    el.removeEventListener("wheel", handleWheel);
    el.removeEventListener("pointerdown", handlePointerDown);
    el.removeEventListener("pointermove", handlePointerMove);
    el.removeEventListener("pointerup", handlePointerUp);
    el.removeEventListener("pointercancel", handlePointerUp);
    el.removeEventListener("pointerleave", handlePointerLeave);
    el.removeEventListener("dblclick", handleDoubleClick);
    controls.dispose();
    disposables.forEach((d) => d.dispose());
    renderer.dispose();
    if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
  };
}
