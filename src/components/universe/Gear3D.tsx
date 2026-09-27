"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * Realistisches Stufengetriebe ("Google Gear"-Reel), Nutzerwunsch
 * 27.09.2026: "mach räder im vergleich zum box kompakter. adde mehr
 * räderdetails mach realistischer".
 *
 * Aufbau wie eine echte Untersetzungsmaschine:
 *   - Jede Achse trägt ein großes Rad (60 Zähne) und ein kleines Ritzel
 *     (10 Zähne) auf derselben Welle. Das Ritzel von Achse i treibt das
 *     große Rad von Achse i+1 an → exakt 6:1 Untersetzung pro Stufe.
 *   - Die Zähne greifen wirklich ineinander: gleiche Zahngröße bei Rad und
 *     Ritzel, Zahnphasen so ausgerichtet, dass Zahn in Lücke läuft, und die
 *     Drehzahlen folgen exakt dem Zähneverhältnis (Abrollbedingung).
 *   - Räder liegen auf drei Ebenen (zyklisch), damit sich nur die
 *     jeweiligen Partner berühren. Alle Achsen in EINER geraden Reihe
 *     (wie die Googol-/"Google Gear"-Maschine) – vorher Zickzack, das wirkte
 *     laut Nutzer "alles durcheinander". Kamera schaut schräg entlang der
 *     Reihe, sodass sie nach hinten wegläuft (kompakt durch Perspektive).
 *   - Details: Zahnkranz, dünnerer Steg mit 6 Aussparungen, Nabe,
 *     Stahlwelle mit Sechskantmutter, Messing-Lager, Grundplatte,
 *     Metall-Spiegelungen per Umgebungs-Map.
 *
 * Zeitlich gerechnet: Bei 6:1 pro Stufe und 23 Achsen ist das letzte Rad
 * 6^22 ≈ 1,3 × 10^17-mal langsamer als das erste. Die Drehzeit des ersten
 * Rads wird daraus so berechnet, dass das letzte exakt 13,797 Mrd. Jahre
 * (= Alter des Universums im Ticker) pro Umdrehung braucht → erstes Rad
 * ≈ 3,3 s. Zeitbasis ist die echte Uhr (performance.now), nicht die
 * Bildrate. Kamera steht still, bis der Nutzer zieht/zoomt.
 */
interface Gear3DProps {
  className?: string;
}

const AXLE_COUNT = 23;
const PINION_TEETH = 10;
const GEAR_TEETH = 60;
const RATIO = GEAR_TEETH / PINION_TEETH; // 6:1 pro Stufe

const M = 0.02; // Teilkreisradius pro Zahn
const ADDENDUM = 2 * M; // Zahnkopfhöhe
const DEDENDUM = 2.5 * M; // Zahnfußtiefe
const PRESSURE_ANGLE = (20 * Math.PI) / 180;

const GEAR_FACE = 0.22; // Breite großes Rad
const PINION_FACE = 0.26; // Breite Ritzel
const PLANE_GAP = 0.34; // Abstand der drei Ebenen

const SHAFT_R = 3.2 * M;
const HUB_R = 10 * M;
const PLATE_FRONT = -(PINION_FACE / 2) - 0.07;
const PLATE_DEPTH = 0.08;
const SHAFT_FRONT = 2 * PLANE_GAP + GEAR_FACE / 2 + 0.05;

const PERIOD_LAST_YEARS = 13_797_000_000; // = Alter des Universums (Ticker)
const SECONDS_PER_YEAR = 31_557_600; // 365,25 * 86400 (exakt)
const PERIOD_LAST_SECONDS = PERIOD_LAST_YEARS * SECONDS_PER_YEAR;
const PERIOD_FIRST_SECONDS = PERIOD_LAST_SECONDS / Math.pow(RATIO, AXLE_COUNT - 1); // ≈ 3,31 s

/** Zahnkranz-Kontur (trapezförmige Zähne mit 20°-Flanken) in `shape` zeichnen. */
function drawToothOutline(shape: THREE.Shape, teeth: number) {
  const pitchR = teeth * M;
  const tipR = pitchR + ADDENDUM;
  const rootR = pitchR - DEDENDUM;
  const step = (Math.PI * 2) / teeth;
  const halfPitchW = pitchR * (Math.PI / teeth) * 0.47; // etwas Flankenspiel
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

export default function Gear3D({ className }: Gear3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 200);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    mount.appendChild(renderer.domElement);

    // Umgebungs-Map für realistische Metall-Spiegelungen (Hintergrund bleibt transparent)
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    // --- Materialien ---
    const gearMat = new THREE.MeshStandardMaterial({ color: 0xd4473b, metalness: 0.75, roughness: 0.32 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0xc9ced6, metalness: 1, roughness: 0.25 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xc9a266, metalness: 1, roughness: 0.35 });
    const plateMat = new THREE.MeshStandardMaterial({ color: 0x141418, metalness: 0.5, roughness: 0.6 });
    const markerMat = new THREE.MeshStandardMaterial({
      color: 0xfff3c4,
      emissive: 0xfff3c4,
      emissiveIntensity: 1.2,
      metalness: 0.1,
      roughness: 0.4,
    });

    // --- Geteilte Geometrien (einmal bauen, für alle Achsen wiederverwenden) ---
    // Großes Rad: Zahnkranz (volle Breite) + dünner Steg mit 6 Aussparungen + Nabe
    const rimShape = new THREE.Shape();
    const { rootR: gearRootR, tipR: gearTipR } = drawToothOutline(rimShape, GEAR_TEETH);
    const rimInner = gearRootR - 6 * M;
    rimShape.holes.push(circlePath(rimInner));
    const rimGeo = extrudeCentered(rimShape, GEAR_FACE, 0.012);

    const webShape = new THREE.Shape();
    webShape.absarc(0, 0, rimInner + 2 * M, 0, Math.PI * 2, false);
    webShape.holes.push(circlePath(HUB_R * 0.9));
    const holeRingR = (HUB_R + rimInner) / 2;
    const holeR = ((rimInner - HUB_R) / 2) * 0.62;
    for (let h = 0; h < 6; h++) {
      const a = (h / 6) * Math.PI * 2 + Math.PI / 6;
      webShape.holes.push(circlePath(holeR, Math.cos(a) * holeRingR, Math.sin(a) * holeRingR));
    }
    const webGeo = extrudeCentered(webShape, GEAR_FACE * 0.4, 0.008);

    const hubGeo = new THREE.CylinderGeometry(HUB_R, HUB_R, GEAR_FACE + 0.07, 40);
    hubGeo.rotateX(Math.PI / 2);

    // Ritzel (massiv, mit Bohrung)
    const pinionShape = new THREE.Shape();
    drawToothOutline(pinionShape, PINION_TEETH);
    pinionShape.holes.push(circlePath(SHAFT_R));
    const pinionGeo = extrudeCentered(pinionShape, PINION_FACE, 0.01);

    // Welle, Mutter, Lager, Markierung
    const shaftLen = SHAFT_FRONT - PLATE_FRONT;
    const shaftGeo = new THREE.CylinderGeometry(SHAFT_R, SHAFT_R, shaftLen, 20);
    shaftGeo.rotateX(Math.PI / 2);
    const nutGeo = new THREE.CylinderGeometry(5 * M, 5 * M, 0.06, 6);
    nutGeo.rotateX(Math.PI / 2);
    const bushingGeo = new THREE.CylinderGeometry(6 * M, 6 * M, 0.04, 28);
    bushingGeo.rotateX(Math.PI / 2);
    const markerGeo = new THREE.SphereGeometry(2.4 * M, 12, 10);

    // --- Achsen-Positionen (gerade Reihe) & Zahnphasen ---
    const centerDist = (GEAR_TEETH + PINION_TEETH) * M;
    const thetas: number[] = [];
    const positions: THREE.Vector2[] = [new THREE.Vector2(0, 0)];
    for (let i = 0; i < AXLE_COUNT - 1; i++) {
      const theta = 0;
      thetas.push(theta);
      const p = positions[i];
      positions.push(new THREE.Vector2(p.x + Math.cos(theta) * centerDist, p.y + Math.sin(theta) * centerDist));
    }

    // Ritzel i: Zahn zeigt Richtung Achse i+1; Rad i+1: Lücke zeigt zurück.
    const gearStep = (Math.PI * 2) / GEAR_TEETH;
    const gearOffsets = new Array<number>(AXLE_COUNT).fill(0);
    const pinionOffsets = new Array<number>(AXLE_COUNT).fill(0);
    for (let i = 0; i < AXLE_COUNT - 1; i++) {
      pinionOffsets[i] = thetas[i];
      gearOffsets[i + 1] = thetas[i] + Math.PI - gearStep / 2;
    }

    // --- Aufbau ---
    const assembly = new THREE.Group();
    scene.add(assembly);
    const axles: THREE.Group[] = [];

    positions.forEach((pos, i) => {
      const axle = new THREE.Group();
      axle.position.set(pos.x, pos.y, 0);

      // Drei Ebenen zyklisch: Rad i auf Ebene i%3, Ritzel i auf (i+1)%3
      const gearZ = (i % 3) * PLANE_GAP;
      const pinionZ = ((i + 1) % 3) * PLANE_GAP;

      const gear = new THREE.Group();
      gear.position.z = gearZ;
      gear.rotation.z = gearOffsets[i];
      gear.add(new THREE.Mesh(rimGeo, gearMat));
      gear.add(new THREE.Mesh(webGeo, gearMat));
      gear.add(new THREE.Mesh(hubGeo, gearMat));

      // Markierung: kleiner Punkt am Zahnkranz, startet oben (12 Uhr)
      const markerAngle = Math.PI / 2 - gearOffsets[i];
      const markerR = (rimInner + gearRootR) / 2;
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.set(Math.cos(markerAngle) * markerR, Math.sin(markerAngle) * markerR, GEAR_FACE / 2 + 0.02);
      gear.add(marker);
      axle.add(gear);

      const pinion = new THREE.Mesh(pinionGeo, steelMat);
      pinion.position.z = pinionZ;
      pinion.rotation.z = pinionOffsets[i];
      axle.add(pinion);

      const shaft = new THREE.Mesh(shaftGeo, steelMat);
      shaft.position.z = (SHAFT_FRONT + PLATE_FRONT) / 2;
      axle.add(shaft);

      const nut = new THREE.Mesh(nutGeo, steelMat);
      nut.position.z = SHAFT_FRONT + 0.03;
      axle.add(nut);

      assembly.add(axle);
      axles.push(axle);

      // Lager auf der Grundplatte (steht still)
      const bushing = new THREE.Mesh(bushingGeo, brassMat);
      bushing.position.set(pos.x, pos.y, PLATE_FRONT + 0.02);
      assembly.add(bushing);
    });

    // Grundplatte (abgerundetes Rechteck hinter allen Rädern)
    const xs = positions.map((p) => p.x);
    const ys = positions.map((p) => p.y);
    const margin = gearTipR + 0.18;
    const x0 = Math.min(...xs) - margin;
    const x1 = Math.max(...xs) + margin;
    const y0 = Math.min(...ys) - margin;
    const y1 = Math.max(...ys) + margin;
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
    const plateGeo = new THREE.ExtrudeGeometry(plateShape, {
      depth: PLATE_DEPTH,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 2,
      curveSegments: 8,
    });
    plateGeo.translate(0, 0, PLATE_FRONT - PLATE_DEPTH);
    const plate = new THREE.Mesh(plateGeo, plateMat);
    assembly.add(plate);

    // Gesamte Baugruppe um den Ursprung zentrieren
    const bounds = new THREE.Box3().setFromObject(assembly);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    assembly.position.sub(center);

    // --- Licht (zusätzlich zur Umgebungs-Map) ---
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(3, 5, 6);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xff5a4d, 0.5);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));

    // --- Kamera: ganze Maschine mit Rand in die Box einpassen ---
    // Abstand per Projektion suchen: alle 8 Ecken der Baugruppe müssen aus
    // der aktuellen Blickrichtung mit Rand ins Bild passen (funktioniert
    // auch beim schrägen Blick entlang der Reihe mit Perspektive).
    const halfSize = size.clone().multiplyScalar(0.5);
    const corners: THREE.Vector3[] = [];
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
      corners.push(new THREE.Vector3(sx * halfSize.x, sy * halfSize.y, sz * halfSize.z));
    }
    const FIT = 0.84; // Anteil der Box, den die Maschine maximal füllt
    function fitsAt(dir: THREE.Vector3, dist: number): boolean {
      camera.position.copy(dir).multiplyScalar(dist);
      camera.lookAt(0, 0, 0);
      camera.updateMatrixWorld();
      const v = new THREE.Vector3();
      return corners.every((c) => {
        v.copy(c).applyMatrix4(camera.matrixWorldInverse);
        if (v.z > -camera.near) return false; // hinter der Kamera
        v.applyMatrix4(camera.projectionMatrix);
        return Math.abs(v.x) <= FIT && Math.abs(v.y) <= FIT;
      });
    }
    function fittedDistance(dir: THREE.Vector3): number {
      let lo = 0.1;
      let hi = 400;
      if (!fitsAt(dir, hi)) return hi;
      for (let k = 0; k < 40; k++) {
        const mid = (lo + hi) / 2;
        if (fitsAt(dir, mid)) hi = mid;
        else lo = mid;
      }
      return hi;
    }

    function resize() {
      if (!mount) return;
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      camera.aspect = mount.clientWidth / Math.max(mount.clientHeight, 1);
      camera.updateProjectionMatrix();
    }
    resize();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.autoRotate = false;
    controls.minPolarAngle = 0.35;
    controls.maxPolarAngle = Math.PI - 0.35;

    function refit() {
      const dir = camera.position.clone().sub(controls.target);
      if (dir.lengthSq() === 0) dir.set(0, 0, 1);
      dir.normalize();
      const dist = fittedDistance(dir);
      camera.position.copy(controls.target).addScaledVector(dir, dist);
      controls.minDistance = dist * 0.25;
      controls.maxDistance = dist * 2.2;
      controls.update();
    }

    // Startblick: schräg von vorne-links und leicht von oben, entlang der
    // Reihe – das schnelle erste Rad vorne, die Reihe läuft nach hinten weg.
    camera.position.setFromSphericalCoords(1, 1.15, -0.75);
    refit();

    // Nur bei echter Breitenänderung neu einpassen (mobile Adressleiste
    // löst sonst beim Scrollen ständig Resize aus und setzt den Zoom zurück)
    let lastWidth = mount.clientWidth;
    function handleResize() {
      resize();
      if (!mount || mount.clientWidth === lastWidth) return;
      lastWidth = mount.clientWidth;
      refit();
    }
    window.addEventListener("resize", handleResize);

    // --- Animation: exakte Winkelgeschwindigkeiten nach Zähneverhältnis ---
    const omegaFirst = (Math.PI * 2) / PERIOD_FIRST_SECONDS;
    const omegas = axles.map((_, i) => omegaFirst * Math.pow(-1 / RATIO, i));
    const startMs = performance.now();

    let animationId = 0;
    function animate() {
      const t = (performance.now() - startMs) / 1000;
      axles.forEach((axle, i) => {
        axle.rotation.z = omegas[i] * t;
      });
      controls.update();
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      [rimGeo, webGeo, hubGeo, pinionGeo, shaftGeo, nutGeo, bushingGeo, markerGeo, plateGeo].forEach((g) =>
        g.dispose()
      );
      [gearMat, steelMat, brassMat, plateMat, markerMat].forEach((m) => m.dispose());
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
