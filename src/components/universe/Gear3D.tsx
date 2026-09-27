"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Nutzerwunsch 27.09.2026 (nach dem "Google Gear"-Reel: "kannst auch ein
 * 3d zahnrad bauen?") — ein echtes 3D-Zahnrad (Three.js, kein Bild/GIF),
 * das sich langsam dreht. Thematisch passend neben UniverseAgeTicker
 * platziert: das virale Video zeigte eine extreme Untersetzungs-Getriebe-
 * kette ("bis sich dieses Rad bewegt, ist das Universum vorbei") — genau
 * das Bild, das die Uhr daneben in Zahlen ausdrückt.
 *
 * Die Zahnradform wird prozedural erzeugt (kein 3D-Modell nötig): ein
 * THREE.Shape mit alternierenden Außen-/Innenradien pro Zahn, dann per
 * ExtrudeGeometry zu einem echten 3D-Körper mit Dicke ausgezogen.
 */
interface Gear3DProps {
  className?: string;
}

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

export default function Gear3D({ className }: Gear3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 20);
    camera.position.set(0, 0.6, 4.4);
    camera.lookAt(0, 0, 0);

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
    resize();
    window.addEventListener("resize", resize);

    const group = new THREE.Group();
    scene.add(group);

    // Hauptzahnrad
    const shape = createGearShape(18, 1.35, 0.22, 0.45);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.42,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.03,
      bevelSegments: 2,
      curveSegments: 2,
    });
    geometry.center();
    const material = new THREE.MeshStandardMaterial({
      color: 0xff5a4d,
      metalness: 0.65,
      roughness: 0.35,
      emissive: 0x2a0e0a,
      emissiveIntensity: 0.4,
    });
    const gear = new THREE.Mesh(geometry, material);
    group.add(gear);

    // Kleines zweites Zahnrad, das sichtbar im Eingriff ist (nur Deko —
    // dreht sich schneller, um den Größen-/Übersetzungs-Kontrast zu zeigen).
    const smallShape = createGearShape(9, 0.62, 0.16, 0.2);
    const smallGeometry = new THREE.ExtrudeGeometry(smallShape, {
      depth: 0.36,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelSegments: 2,
      curveSegments: 2,
    });
    smallGeometry.center();
    const smallMaterial = new THREE.MeshStandardMaterial({
      color: 0xf4b8a8,
      metalness: 0.65,
      roughness: 0.35,
      emissive: 0x2a0e0a,
      emissiveIntensity: 0.25,
    });
    const smallGear = new THREE.Mesh(smallGeometry, smallMaterial);
    smallGear.position.set(1.35 + 0.62 + 0.04, 0.55, -0.03);
    group.add(smallGear);

    group.rotation.x = 0.35;

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(2, 3, 3);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xff5a4d, 0.6);
    rimLight.position.set(-2, -1, -2);
    scene.add(rimLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    let animationId = 0;
    let elapsed = 0;
    function animate() {
      elapsed += 0.016;
      // Bewusst langsam — das Hauptrad dreht sich gemächlich, das kleine
      // Rad deutlich schneller (grobe Analogie zur Übersetzung im Video).
      gear.rotation.z = elapsed * 0.18;
      smallGear.rotation.z = -elapsed * 0.62;
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      geometry.dispose();
      material.dispose();
      smallGeometry.dispose();
      smallMaterial.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
