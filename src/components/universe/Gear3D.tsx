"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Nutzerwunsch 27.09.2026 (nach dem "Google Gear"-Reel: "kannst auch ein
 * 3d zahnrad bauen?" → "wieso gibt es ein rad? ich dachte es wird hundeter
 * geben?" → "adde nach mehr räder mach es 3d und räder sollen sich
 * langsamer bewegen bis richtung der letzte genau wie räder. es bewegt
 * sich alle schnell aber es soll nicht so sein") — drei Korrekturen in
 * dieser Version:
 *   1. Mehr Räder (8 statt 5).
 *   2. Deutlich mehr sichtbare 3D-Tiefe (dickere Räder, steilerer
 *      Kamerawinkel) — vorher wirkten sie durch die dünne Extrusion und
 *      den flachen Blickwinkel fast wie 2D-Scheiben.
 *   3. WICHTIGSTER FIX: vorher drehten sich alle Räder ähnlich schnell,
 *      weil die Geschwindigkeit nur über das (moderate) Zähnezahl-
 *      verhältnis lief. Jetzt gibt es zusätzlich einen expliziten, harten
 *      Verlangsamungsfaktor pro Stufe (STAGE_SLOWDOWN), genau wie im
 *      Reel: Rad 1 dreht sich sichtbar schnell, jedes weitere Rad spürbar
 *      langsamer, das letzte Rad bewegt sich fast gar nicht mehr.
 *
 * Die Zahnradform wird prozedural erzeugt (kein 3D-Modell nötig): ein
 * THREE.Shape mit alternierenden Außen-/Innenradien pro Zahn, dann per
 * ExtrudeGeometry zu einem echten 3D-Körper mit Dicke ausgezogen.
 */
interface Gear3DProps {
  className?: string;
}

// Zähnezahl pro Rad, von links (schnell/klein) nach rechts (langsam/groß).
const GEAR_TEETH = [8, 10, 13, 17, 22, 29, 38, 50];
const MODULE = 0.052; // "Zahngröße" — bestimmt Radius aus Zähnezahl
const TOOTH_HEIGHT = 0.045;
const THICKNESS = 0.34; // deutlich dicker als vorher (0.18) für echte 3D-Tiefe

// Harter Verlangsamungsfaktor pro Stufe (unabhängig vom Zähnezahl-
// verhältnis) — sorgt dafür, dass der Unterschied zwischen erstem und
// letztem Rad klar SICHTBAR ist, statt nur rechnerisch vorhanden zu sein.
const STAGE_SLOWDOWN = 0.42;
const BASE_SPEED = 2.2; // rad/s, erstes (kleinstes) Rad

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
  const shape = createGearShape(teeth, radius, TOOTH_HEIGHT, Math.max(0.06, radius * 0.26));
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: THICKNESS,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.022,
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
  return { mesh: new THREE.Mesh(geometry, material), radius };
}

export default function Gear3D({ className }: Gear3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 40);

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
    // Rot (langsames, großes Rad) — macht die Reihenfolge/Größe auf den
    // ersten Blick lesbar.
    const colors = [0xffc9c0, 0xffb3a8, 0xff8a7a, 0xff5a4d, 0xe8483c, 0xd63f34, 0xb8302a, 0x8f221d];

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

    // Gesamtbreite der Kette zentrieren.
    const totalWidth = gears[gears.length - 1].mesh.position.x + gears[gears.length - 1].radius;
    group.position.x = -totalWidth / 2;
    // Steilerer Kippwinkel als vorher (0.3 → 0.55): zeigt spürbar mehr von
    // der Dicke/Seite der Räder statt einer fast frontalen, flachen
    // Ansicht — dadurch wirkt es klar dreidimensional statt wie Scheiben.
    group.rotation.x = 0.55;

    // Kamera so weit zurücksetzen, dass die gesamte Kette (Breite
    // totalWidth) horizontal ins Bild passt — robuste Fit-Formel mit
    // Absicherung gegen ungültige (NaN/Infinity) Zwischenwerte.
    function fitCamera() {
      if (!mount) return;
      const aspect = mount.clientWidth / Math.max(mount.clientHeight, 1);
      const vFovRad = (camera.fov * Math.PI) / 180;
      const halfWidthNeeded = totalWidth / 2 + 0.5;
      const rawDist = halfWidthNeeded / (Math.tan(vFovRad / 2) * Math.max(aspect, 0.5));
      const dist = Number.isFinite(rawDist) ? Math.max(rawDist * 1.15, totalWidth * 0.65) : totalWidth * 1.3;
      camera.position.set(0, 0.55, dist);
      camera.lookAt(0, 0, 0);
    }

    function handleResize() {
      resize();
      fitCamera();
    }

    resize();
    fitCamera();
    window.addEventListener("resize", handleResize);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(2, 3, 4);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xff5a4d, 0.55);
    rimLight.position.set(-2, -1, -3);
    scene.add(rimLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.38));

    // WICHTIGSTER FIX dieser Runde: harter Verlangsamungsfaktor pro Stufe
    // statt nur des (zu milden) Zähnezahlverhältnisses — Rad 1 dreht sich
    // klar sichtbar, jedes weitere Rad spürbar langsamer, das letzte Rad
    // bewegt sich fast gar nicht mehr (Periode > 1 Minute).
    const speeds = GEAR_TEETH.map(
      (_, i) => BASE_SPEED * Math.pow(STAGE_SLOWDOWN, i) * (i % 2 === 0 ? 1 : -1)
    );

    let animationId = 0;
    let elapsed = 0;
    function animate() {
      elapsed += 0.016;
      gears.forEach((g, i) => {
        g.mesh.rotation.z = elapsed * speeds[i];
      });
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    }
    animate();

    const geometries = gears.map((g) => g.mesh.geometry);
    const materials = gears.map((g) => g.mesh.material as THREE.Material);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
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
