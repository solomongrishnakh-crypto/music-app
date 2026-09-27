"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Nutzerwunsch 27.09.2026 (nach dem "Google Gear"-Reel: "kannst auch ein
 * 3d zahnrad bauen?", dann Nutzerkorrektur: "wieso gibt es ein rad? ich
 * dachte es wird hundeter geben?") — das virale Video zeigte eine ganze
 * KETTE ineinandergreifender Zahnräder (eine extreme Untersetzungs-Getriebe-
 * kette), nicht nur ein einzelnes Rad. Diese Version zeigt jetzt fünf
 * echte, ineinandergreifende 3D-Zahnräder in Reihe, deren Größe (und
 * Zähnezahl) von links nach rechts wächst — jedes folgende Rad dreht sich
 * dadurch spürbar langsamer als das vorherige, exakt die Idee aus dem
 * Reel ("bis sich das letzte Rad bewegt, ist das Universum vorbei").
 *
 * Die Zahnradform wird prozedural erzeugt (kein 3D-Modell nötig): ein
 * THREE.Shape mit alternierenden Außen-/Innenradien pro Zahn, dann per
 * ExtrudeGeometry zu einem echten 3D-Körper mit Dicke ausgezogen.
 */
interface Gear3DProps {
  className?: string;
}

// Zähnezahl pro Rad, von links (schnell) nach rechts (langsam) — jede
// Stufe hat spürbar mehr Zähne als die vorherige, daher die sichtbar
// wachsende Untersetzung.
const GEAR_TEETH = [8, 11, 16, 24, 36];
const MODULE = 0.145; // "Zahngröße" — bestimmt Radius aus Zähnezahl
const TOOTH_HEIGHT = 0.11;
const THICKNESS = 0.32;

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
  const shape = createGearShape(teeth, radius, TOOTH_HEIGHT, Math.max(0.08, radius * 0.28));
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: THICKNESS,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.02,
    bevelSegments: 2,
    curveSegments: 2,
  });
  geometry.center();
  const material = new THREE.MeshStandardMaterial({
    color: colorHex,
    metalness: 0.65,
    roughness: 0.35,
    emissive: 0x2a0e0a,
    emissiveIntensity: 0.3,
  });
  return { mesh: new THREE.Mesh(geometry, material), radius };
}

export default function Gear3D({ className }: Gear3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 30);

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
    const colors = [0xffb3a8, 0xff8a7a, 0xff5a4d, 0xd63f34, 0xa8281f];

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

    // Gesamtbreite der Kette zentrieren und Kamera so platzieren, dass
    // alle Räder ins Bild passen.
    const totalWidth = gears[gears.length - 1].mesh.position.x + gears[gears.length - 1].radius;
    group.position.x = -totalWidth / 2;
    group.rotation.x = 0.3;

    function fitCamera() {
      const span = totalWidth + 0.6;
      const dist = span / (2 * Math.tan((camera.fov * Math.PI) / 360) * (mount!.clientWidth / mount!.clientHeight <= 1 ? mount!.clientWidth / mount!.clientHeight : 1));
      camera.position.set(0, 0.5, Math.max(dist, span * 0.9));
      camera.lookAt(0, 0, 0);
    }

    resize();
    fitCamera();
    window.addEventListener("resize", () => {
      resize();
      fitCamera();
    });

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(2, 3, 4);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xff5a4d, 0.5);
    rimLight.position.set(-2, -1, -3);
    scene.add(rimLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    // Jedes Rad dreht sich (grob) proportional zur Zähnezahl des ersten
    // Rads geteilt durch die eigene — genau wie bei echten ineinander-
    // greifenden Zahnrädern (ω ∝ 1/Zähnezahl), plus alternierende
    // Richtung, weil benachbarte Zahnräder sich immer gegenläufig drehen.
    const baseSpeed = 0.9;
    const speeds = GEAR_TEETH.map((teeth, i) => (baseSpeed * GEAR_TEETH[0]) / teeth * (i % 2 === 0 ? 1 : -1));

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
      window.removeEventListener("resize", resize);
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
