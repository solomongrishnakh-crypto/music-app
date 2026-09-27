"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Nutzerwunsch 27.09.2026, letzte Korrekturrunde: "mach es von profil,
 * bisschen grösser, und rechne mal die zahlen bei einzelnen rad so das
 * der letzte milliarden jahre braucht um zu drehen. vlt kannst du mehr
 * räder hinzufügen alles kompakt und zeitlich gerechnet"
 *
 * Drei Änderungen gegenüber der vorherigen Version:
 *   1. ECHTE Berechnung statt Pi-mal-Daumen-Faktor: Rad 1 dreht sich exakt
 *      alle PERIOD_FIRST_SECONDS Sekunden einmal um die eigene Achse; der
 *      Verlangsamungsfaktor pro Stufe wird so berechnet, dass das LETZTE
 *      Rad rechnerisch genau PERIOD_LAST_YEARS Jahre für eine Umdrehung
 *      braucht (STAGE_RATIO = (PERIOD_LAST/PERIOD_FIRST)^(1/(Anzahl-1))).
 *      PERIOD_LAST_YEARS = 13,797 Mrd. Jahre — bewusst identisch mit dem
 *      Universums-Alter im UniverseAgeTicker daneben, als Anspielung auf
 *      das Reel ("bis sich dieses Rad bewegt, ist das Universum vorbei").
 *   2. Mehr Räder (9 statt 8), aber moderateres Größenwachstum pro Stufe,
 *      damit die Kette trotzdem kompakt bleibt.
 *   3. "Von profil": steilerer Kamerawinkel + leichter Gier-Winkel (Yaw),
 *      sodass die Kette perspektivisch nach hinten verjüngt und die
 *      Dicke/Tiefe der Räder klar sichtbar ist (statt einer fast
 *      frontalen Scheiben-Ansicht wie zuvor) — ähnlich der Reel-Perspektive.
 */
interface Gear3DProps {
  className?: string;
}

// Zähnezahl pro Rad, von links (schnell/klein) nach rechts (langsam/groß)
// — moderates Wachstum (~x1.25 pro Stufe) für eine kompakte Kette.
const GEAR_TEETH = [8, 9, 11, 13, 16, 20, 25, 31, 39];
const MODULE = 0.046; // "Zahngröße" — bestimmt Radius aus Zähnezahl
const TOOTH_HEIGHT = 0.04;
const THICKNESS = 0.4; // Dicke der Extrusion — bestimmt die sichtbare 3D-Tiefe

// Echte Berechnung der Drehzahlen (siehe Kommentar oben): Rad 1 dreht sich
// alle 3 Sekunden einmal, Rad 9 (letztes) rechnerisch alle 13,797 Mrd.
// Jahre einmal — exakt derselbe Zahlenwert wie im UniverseAgeTicker.
const PERIOD_FIRST_SECONDS = 3;
const PERIOD_LAST_YEARS = 13_797_000_000;
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
  const shape = createGearShape(teeth, radius, TOOTH_HEIGHT, Math.max(0.05, radius * 0.26));
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
      0xffd4cc, 0xffc0b5, 0xffa89a, 0xff8a7a, 0xff6a58, 0xe8483c, 0xd63f34, 0xb8302a, 0x8f221d,
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
    // "Von profil": steiler Kippwinkel + leichter Gier-Winkel, damit man
    // die Dicke der Räder und die perspektivische Verjüngung der Reihe
    // sieht statt einer fast frontalen Scheiben-Ansicht.
    group.rotation.x = 0.78;
    group.rotation.y = 0.22;

    function fitCamera() {
      if (!mount) return;
      const aspect = mount.clientWidth / Math.max(mount.clientHeight, 1);
      const vFovRad = (camera.fov * Math.PI) / 180;
      const halfWidthNeeded = totalWidth / 2 + 0.6;
      const rawDist = halfWidthNeeded / (Math.tan(vFovRad / 2) * Math.max(aspect, 0.5));
      const dist = Number.isFinite(rawDist) ? Math.max(rawDist * 1.2, totalWidth * 0.7) : totalWidth * 1.4;
      camera.position.set(totalWidth * 0.08, 0.7, dist);
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

    // Echte Berechnung (siehe Kommentar oben am Datei-Anfang): Stufenfaktor
    // so bestimmt, dass Rad 1 alle PERIOD_FIRST_SECONDS Sekunden und das
    // letzte Rad rechnerisch alle PERIOD_LAST_SECONDS (13,797 Mrd. Jahre)
    // eine Umdrehung macht.
    const stageCount = GEAR_TEETH.length - 1;
    const stageRatio = Math.pow(PERIOD_LAST_SECONDS / PERIOD_FIRST_SECONDS, 1 / stageCount);
    const baseSpeed = (2 * Math.PI) / PERIOD_FIRST_SECONDS; // rad/s, Rad 1
    const speeds = GEAR_TEETH.map(
      (_, i) => (baseSpeed / Math.pow(stageRatio, i)) * (i % 2 === 0 ? 1 : -1)
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
