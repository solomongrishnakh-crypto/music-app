"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Nutzerwunsch 27.09.2026, weitere Korrekturrunde: "hä nur das erste rad
 * bewegt sich. alle anderen sind still und es ist auch nicht 3d man kann
 * kamera nicht bewegen. adde mal mehr räder und mach hintergrund
 * verschwomener"
 *
 * Drei Korrekturen gegenüber der Vorversion:
 *
 *   1. NUR-RAD-1-BEWEGT-SICH-BUG: Die vorherige Version nutzte EINEN
 *      konstanten Verlangsamungsfaktor (~140x) pro Stufe, gleichmäßig auf
 *      alle Übergänge verteilt. Rechnerisch war das korrekt (Rad 9 kam auf
 *      exakt 13,797 Mrd. Jahre), aber schon Rad 2 hatte dadurch eine
 *      Umlaufzeit von ~7 Minuten — in den paar Sekunden, die man auf die
 *      Seite schaut, ist das komplett unsichtbar, es *wirkt* also, als
 *      stünde alles außer Rad 1 still. Fix: zweistufige Berechnung.
 *      Die ersten EARLY_STAGES Übergänge nutzen einen viel kleineren,
 *      "sichtbaren" Faktor (jedes Rad ca. 3,2x langsamer als das davor —
 *      man sieht mehrere Räder gleichzeitig, klar unterschiedlich schnell,
 *      rotieren). Der Rest der Kette holt den fehlenden Faktor exakt
 *      rechnerisch auf, sodass das LETZTE Rad weiterhin genau
 *      PERIOD_LAST_YEARS (13,797 Mrd. Jahre — identisch zum Alter des
 *      Universums im Ticker daneben) für eine Umdrehung braucht. Beide
 *      Formeln schließen an der Nahtstelle exakt bündig an (keine Sprünge).
 *   2. "Nicht 3D, Kamera nicht bewegbar": echte OrbitControls (three.js) —
 *      man kann jetzt per Ziehen die Kamera um die Zahnradkette drehen und
 *      per Scrollen/Pinch zoomen, dadurch wird die reale 3D-Tiefe der
 *      Räder (Bevel + Extrusion) sichtbar. Nutzerwunsch danach ("die
 *      räder drehen sich wie 3d ohne das ich es steuere mach es
 *      statisch"): keine automatische Kamera-Rotation mehr — die Kamera
 *      steht still, bis der Nutzer selbst zieht/zoomt.
 *   3. Mehr Räder (12 statt 9), moderates Größenwachstum bleibt kompakt.
 *
 * "Hintergrund verschwommener" wurde in universum/page.tsx gelöst (mehr
 * backdrop-blur auf der Box), nicht hier in der Komponente.
 */
interface Gear3DProps {
  className?: string;
}

// Zähnezahl pro Rad, von links (schnell/klein) nach rechts (langsam/groß).
const GEAR_TEETH = [8, 9, 10, 12, 14, 17, 20, 24, 29, 35, 42, 50];
const MODULE = 0.04;
const TOOTH_HEIGHT = 0.036;
const THICKNESS = 0.42; // Dicke der Extrusion — sichtbare 3D-Tiefe

// --- Zweistufige, exakt berechnete Drehzahlen (siehe Kommentar oben) ---
const PERIOD_FIRST_SECONDS = 2; // Rad 1: eine Umdrehung alle 2 Sekunden
const EARLY_STAGES = 5; // Anzahl "schneller" Übergänge mit sichtbarem Tempo
const EARLY_STAGE_RATIO = 3.2; // jedes Rad in dieser Phase ~3,2x langsamer

const PERIOD_LAST_YEARS = 13_797_000_000; // = Alter des Universums (Ticker)
const SECONDS_PER_YEAR = 31_557_600; // 365,25 * 86400 (exakt)
const PERIOD_LAST_SECONDS = PERIOD_LAST_YEARS * SECONDS_PER_YEAR;

function createGearShape(teeth: number, radius: number, toothHeight: number, holeRadius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a0 = i * step;
    const a1 = a0 + step * 0.28;
    const a2 = a0 + step * 0.5;
    const a3 = a0 + step * 0.78;
    const outer = radius + toothHeight;
    if (i === 0) {
      shape.moveTo(Math.cos(a0) * radius, Math.sin(a0) * radius);
    }
    shape.lineTo(Math.cos(a0) * outer, Math.sin(a0) * outer);
    shape.lineTo(Math.cos(a1) * outer, Math.sin(a1) * outer);
    shape.lineTo(Math.cos(a2) * radius, Math.sin(a2) * radius);
    shape.lineTo(Math.cos(a3) * radius, Math.sin(a3) * radius);
  }
  shape.closePath();
  const hole = new THREE.Path();
  hole.absarc(0, 0, holeRadius, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  return shape;
}

function makeGearMesh(teeth: number, colorHex: number): { mesh: THREE.Mesh; radius: number } {
  const radius = teeth * MODULE;
  const shape = createGearShape(teeth, radius, TOOTH_HEIGHT, Math.max(0.045, radius * 0.26));
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: THICKNESS,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelSegments: 2,
    curveSegments: 2,
  });
  geometry.center();
  const material = new THREE.MeshStandardMaterial({
    color: colorHex,
    metalness: 0.7,
    roughness: 0.3,
    emissive: 0x2a0e0a,
    emissiveIntensity: 0.28,
  });
  const mesh = new THREE.Mesh(geometry, material);

  // Nutzerwunsch 27.09.2026: "markierung soll nur am rand des rades (oben)
  // sein" — der vorherige Strich ging quer über das ganze Rad und wirkte
  // wie ein Fremdkörper. Jetzt: nur ein kleiner heller Punkt direkt am
  // Zahnkranz-Rand, oben (12-Uhr-Position), fest mit dem Rad verbunden
  // (rotiert mit) — reicht als Referenzpunkt, um eine Drehung zu erkennen.
  const markerMaterial = new THREE.MeshStandardMaterial({
    color: 0xfff3c4,
    emissive: 0xfff3c4,
    emissiveIntensity: 0.9,
    metalness: 0.1,
    roughness: 0.4,
  });
  const marker = new THREE.Mesh(new THREE.SphereGeometry(Math.max(radius * 0.16, 0.035), 10, 8), markerMaterial);
  marker.position.set(0, radius + TOOTH_HEIGHT * 0.4, THICKNESS / 2 + 0.02);
  mesh.add(marker);

  return { mesh, radius };
}

export default function Gear3D({ className }: Gear3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 50);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    function resize() {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    const group = new THREE.Group();
    scene.add(group);

    // Farbverlauf von hellem Akzent (schnelles, kleines Rad) zu dunklerem
    // Rot (langsames, großes Rad).
    const colors = [
      0xffd9d1, 0xffc9c0, 0xffb3a8, 0xff9d8f, 0xff8474, 0xff6a58, 0xf05646, 0xe8483c, 0xd63f34,
      0xc03730, 0xa42a24, 0x8f221d,
    ];

    const gears: { mesh: THREE.Mesh; radius: number; teeth: number }[] = [];
    let cursorX = 0;
    GEAR_TEETH.forEach((teeth, i) => {
      const { mesh, radius } = makeGearMesh(teeth, colors[i] ?? colors[colors.length - 1]);
      if (i === 0) {
        cursorX = 0;
      } else {
        cursorX += gears[i - 1].radius + radius;
      }
      mesh.position.x = cursorX;
      group.add(mesh);
      gears.push({ mesh, radius, teeth });
    });

    const totalWidth = gears[gears.length - 1].mesh.position.x + gears[gears.length - 1].radius;
    group.position.x = -totalWidth / 2;

    // Zweistufige, exakt berechnete Umlaufzeiten (siehe Kommentar oben):
    // Übergänge 0..EARLY_STAGES sichtbar-langsam (Faktor 3,2), danach holt
    // ein exakt errechneter zweiter Faktor den Rest auf, sodass das letzte
    // Rad genau PERIOD_LAST_SECONDS (13,797 Mrd. Jahre) erreicht.
    const stageCountTotal = GEAR_TEETH.length - 1;
    const lateStages = stageCountTotal - EARLY_STAGES;
    const periodAtEarlyEnd = PERIOD_FIRST_SECONDS * Math.pow(EARLY_STAGE_RATIO, EARLY_STAGES);
    const lateStageRatio = Math.pow(PERIOD_LAST_SECONDS / periodAtEarlyEnd, 1 / lateStages);

    const periods = GEAR_TEETH.map((_, i) => {
      if (i <= EARLY_STAGES) {
        return PERIOD_FIRST_SECONDS * Math.pow(EARLY_STAGE_RATIO, i);
      }
      const lateIndex = i - EARLY_STAGES;
      return periodAtEarlyEnd * Math.pow(lateStageRatio, lateIndex);
    });
    const speeds = periods.map((p, i) => ((2 * Math.PI) / p) * (i % 2 === 0 ? 1 : -1));

    // Kamera + OrbitControls: echtes Drehen (Ziehen) und Zoomen (Scroll /
    // Pinch), damit die 3D-Tiefe der Räder sichtbar/erfahrbar wird.
    function fittedDistance(): number {
      if (!mount) return totalWidth * 1.3;
      const aspect = mount.clientWidth / Math.max(mount.clientHeight, 1);
      const vFovRad = (camera.fov * Math.PI) / 180;
      const halfWidthNeeded = totalWidth / 2 + 0.6;
      const rawDist = halfWidthNeeded / (Math.tan(vFovRad / 2) * Math.max(aspect, 0.5));
      return Number.isFinite(rawDist) ? Math.max(rawDist * 1.25, totalWidth * 0.75) : totalWidth * 1.4;
    }

    const initialDist = fittedDistance();
    // Startposition: erhöht und leicht seitlich versetzt ("Profil"-artiger
    // Blick), von dort aus kann frei weitergedreht werden.
    const startSpherical = new THREE.Spherical(initialDist, 1.15, 0.55);
    camera.position.setFromSpherical(startSpherical);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = initialDist * 0.35;
    controls.maxDistance = initialDist * 2.4;
    controls.minPolarAngle = 0.35;
    controls.maxPolarAngle = Math.PI - 0.35;
    controls.autoRotate = false;
    controls.update();

    function handleResize() {
      resize();
      const dist = fittedDistance();
      controls.minDistance = dist * 0.35;
      controls.maxDistance = dist * 2.4;
    }

    resize();
    window.addEventListener("resize", handleResize);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(2, 3, 4);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xff5a4d, 0.55);
    rimLight.position.set(-2, -1, -3);
    scene.add(rimLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.38));

    let animationId = 0;
    let elapsed = 0;
    function animate() {
      elapsed += 0.016;
      gears.forEach((g, i) => {
        g.mesh.rotation.z = elapsed * speeds[i];
      });
      controls.update();
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    }
    animate();

    // Auch die Marker (Strich + Punkt) sind Kind-Objekte jedes Rads und
    // müssen beim Aufräumen mit entsorgt werden, nicht nur das Hauptmesh.
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    gears.forEach((g) => {
      g.mesh.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          geometries.push(obj.geometry);
          materials.push(obj.material as THREE.Material);
        }
      });
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
