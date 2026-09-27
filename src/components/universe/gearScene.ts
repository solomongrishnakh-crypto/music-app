import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

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

const AXLE_COUNT = 23;
const PINION_TEETH = 10;
const GEAR_TEETH = 60;
const RATIO = GEAR_TEETH / PINION_TEETH; // 6:1 pro Stufe

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

const PERIOD_LAST_YEARS = 13_797_000_000;
const SECONDS_PER_YEAR = 31_557_600; // 365,25 * 86400
const PERIOD_LAST_SECONDS = PERIOD_LAST_YEARS * SECONDS_PER_YEAR;
export const PERIOD_FIRST_SECONDS = PERIOD_LAST_SECONDS / Math.pow(RATIO, AXLE_COUNT - 1); // ≈ 3,31 s

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
  const gearMat = track(new THREE.MeshStandardMaterial({ color: 0xd4473b, metalness: 0.75, roughness: 0.32 }));
  const steelMat = track(new THREE.MeshStandardMaterial({ color: 0xc9ced6, metalness: 1, roughness: 0.25 }));
  const brushedMat = track(new THREE.MeshStandardMaterial({ color: 0xb4b9c0, metalness: 1, roughness: 0.42 }));
  const brassMat = track(new THREE.MeshStandardMaterial({ color: 0xc9a266, metalness: 1, roughness: 0.35 }));
  const copperMat = track(new THREE.MeshStandardMaterial({ color: 0xc27a4a, metalness: 1, roughness: 0.3 }));
  const plateMat = track(new THREE.MeshStandardMaterial({ color: 0x141418, metalness: 0.5, roughness: 0.6 }));
  const blackPlasticMat = track(new THREE.MeshStandardMaterial({ color: 0x0d0d0f, metalness: 0, roughness: 0.55 }));
  const labelMat = track(new THREE.MeshStandardMaterial({ color: 0x1c1c22, metalness: 0.2, roughness: 0.5 }));
  const redWireMat = track(new THREE.MeshStandardMaterial({ color: 0xc0231a, metalness: 0, roughness: 0.45 }));
  const blackWireMat = track(new THREE.MeshStandardMaterial({ color: 0x151515, metalness: 0, roughness: 0.45 }));
  const markerMat = track(
    new THREE.MeshStandardMaterial({
      color: 0xfff3c4,
      emissive: 0xfff3c4,
      emissiveIntensity: 1.2,
      metalness: 0.1,
      roughness: 0.4,
    })
  );

  // --- Geteilte Geometrien ---
  const rimShape = new THREE.Shape();
  const { rootR: gearRootR, tipR: gearTipR } = drawToothOutline(rimShape, GEAR_TEETH);
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
  const bushingGeo = track(zCylinder(6 * M, PLATE_FRONT, PLATE_FRONT + 0.04, 28));
  const markerGeo = track(new THREE.SphereGeometry(2.4 * M, 12, 10));

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
    gear.add(new THREE.Mesh(webGeo, gearMat));
    gear.add(new THREE.Mesh(hubGeo, gearMat));
    // Markierung am Zahnkranz, startet oben (12 Uhr)
    const markerAngle = Math.PI / 2 - gearOffset;
    const markerR = (rimInner + gearRootR) / 2;
    const marker = new THREE.Mesh(markerGeo, markerMat);
    marker.position.set(Math.cos(markerAngle) * markerR, Math.sin(markerAngle) * markerR, GEAR_FACE / 2 + 0.02);
    gear.add(marker);
    axle.add(gear);

    const pinion = new THREE.Mesh(pinionGeo, steelMat);
    pinion.position.z = ((i + 1) % 3) * PLANE_GAP;
    axle.add(pinion);
    axle.add(new THREE.Mesh(shaftGeo, steelMat));
    axle.add(new THREE.Mesh(nutGeo, steelMat));

    assembly.add(axle);
    axles.push(axle);

    const bushing = new THREE.Mesh(bushingGeo, brassMat);
    bushing.position.set(pos.x, pos.y, 0);
    assembly.add(bushing);
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
    const head = new THREE.Mesh(screwHeadGeo, steelMat);
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
    const s = new THREE.Mesh(standoffGeo, brassMat);
    s.position.set(sx, sy, 0);
    motorBody.add(s);
  }
  // Kabel (rot/schwarz) von den Anschlüssen nach unten links zur Platte
  const wireGeos = terminalPoints.map((p, idx) => {
    const off = idx === 0 ? 0.04 : -0.04;
    const curve = new THREE.CatmullRomCurve3([
      p,
      new THREE.Vector3(-0.05, p.y * 0.6, p.z + 0.18),
      new THREE.Vector3(-0.35, -0.2 + off, p.z + 0.05),
      new THREE.Vector3(-0.55, -0.45 + off, 0.5),
      new THREE.Vector3(-0.6, -0.62 + off, PLATE_FRONT + 0.03),
    ]);
    return track(new THREE.TubeGeometry(curve, 40, 0.018, 8, false));
  });
  motorBody.add(new THREE.Mesh(wireGeos[0], redWireMat));
  motorBody.add(new THREE.Mesh(wireGeos[1], blackWireMat));
  assembly.add(motorBody);

  // --- Grundplatte ---
  const xs = [...positions.map((p) => p.x), motorPos.x];
  const margin = gearTipR + 0.18;
  const x0 = Math.min(...xs) - margin;
  const x1 = Math.max(...xs) + margin;
  const y0 = -margin;
  const y1 = margin;
  const cr = 0.25;
  const plateShape = new THREE.Shape();
  plateShape.moveTo(x0 + cr, y0);
  plateShape.lineTo(x1 - cr, y0);
  plateShape.quadraticCurveTo(x1, y0, x1, y0 + cr);
  plateShape.lineTo(x1, y1 - cr);
  plateShape.quadraticCurveTo(x1, y1, x1 - cr, y1);
  plateShape.lineTo(x0 + cr, y1);
  plateShape.quadraticCurveTo(x0, y1, x0, y1 - cr);
  plateShape.lineTo(x0, y0 + cr);
  plateShape.quadraticCurveTo(x0, y0, x0 + cr, y0);
  const plateGeo = track(
    new THREE.ExtrudeGeometry(plateShape, {
      depth: PLATE_DEPTH,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 2,
      curveSegments: 8,
    })
  );
  plateGeo.translate(0, 0, PLATE_FRONT - PLATE_DEPTH);
  assembly.add(new THREE.Mesh(plateGeo, plateMat));

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

  function resize() {
    const w = Math.max(mount.clientWidth, 1);
    const h = Math.max(mount.clientHeight, 1);
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
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
  function refit() {
    const { dist, target } = fit(startDir);
    controls.target.copy(target);
    camera.position.copy(target).addScaledVector(startDir, dist);
    camera.lookAt(target);
    controls.minDistance = dist * 0.2;
    controls.maxDistance = dist * 2.2;
    controls.update();
  }
  refit();

  let lastWidth = mount.clientWidth;
  function handleResize() {
    resize();
    if (mount.clientWidth === lastWidth) return;
    lastWidth = mount.clientWidth;
    startDir = viewDirection();
    refit();
  }
  window.addEventListener("resize", handleResize);

  // --- Animation ---
  const omegaFirst = (Math.PI * 2) / PERIOD_FIRST_SECONDS;
  const omegas = axles.map((_, i) => omegaFirst * Math.pow(-1 / RATIO, i));
  const omegaMotor = -omegaFirst * RATIO; // Motorritzel treibt Rad 1 an
  const startMs = performance.now();
  let animationId = 0;
  function animate() {
    const t = (performance.now() - startMs) / 1000;
    axles.forEach((axle, i) => {
      axle.rotation.z = omegas[i] * t;
    });
    motorRotor.rotation.z = omegaMotor * t;
    controls.update();
    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  }
  animate();

  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener("resize", handleResize);
    controls.dispose();
    disposables.forEach((d) => d.dispose());
    renderer.dispose();
    if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
  };
}
