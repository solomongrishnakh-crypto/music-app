"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * ThreeBackground
 * ---------------------------------------------------------------------------
 * Echte 3D-Szene (Three.js, perspektivische Kamera) statt eines reinen
 * 2D-Canvas-Tricks — inspiriert vom Kamera-/Tiefe-Gefühl von Seiten wie
 * igloo.inc, aber mit einer generischen Partikelwolke statt eines
 * gescannten 3D-Modells (aus einem flachen Foto lässt sich keine echte
 * 3D-Geometrie rekonstruieren).
 *
 * - Mehrere hundert Punkte, in drei Tiefenebenen verteilt (echtes Z),
 *   verbunden durch dünne Linien zu ihren nächsten Nachbarn in derselben
 *   Ebene → Tiefenwirkung durch Perspektive, nicht nur Größe/Unschärfe.
 * - Ständige, unabhängige Bewegung: langsame Gruppenrotation + individuelles
 *   Auf-und-Ab-Schweben jedes Punktes (nie statisch).
 * - Kamera reagiert leicht auf Mausbewegung (Parallaxe) und driftet auch
 *   ohne Interaktion sanft — dadurch wirkt die Szene "lebendig".
 * - Das Originalbild bleibt als Ebene dahinter sichtbar (per CSS,
 *   siehe SiteBackground.tsx), diese Szene läuft transparent darüber.
 */
export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030303, 0.045);
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 9;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    // --- Partikelwolke -------------------------------------------------
    // Kompakte, symmetrische Kugelverteilung um das Zentrum (statt einer
    // zufälligen, gestreckten Box) — wirkt aufgeräumter und ausgewogener.
    const PARTICLE_COUNT = 750;
    const CLOUD_RADIUS = 13;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const basePositions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const phases = new Float32Array(PARTICLE_COUNT);

    const colorRed = new THREE.Color("#ff5a4d");
    const colorWhite = new THREE.Color("#fff2ee");

    // Innerer Radius, der von Partikeln frei bleibt — hier sitzt später das
    // zentrale Bild (Schwarzes Loch), damit es nicht von Punkten/Linien
    // verdeckt wird.
    const CENTER_CLEARANCE = 3.4;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Gleichverteilter Punkt innerhalb einer Kugelschale (symmetrisch in
      // alle Richtungen, mit freier Mitte), leicht abgeflacht in Z für mehr
      // Bildschirmfüllung.
      const u = Math.random();
      const radius =
        CENTER_CLEARANCE + (CLOUD_RADIUS - CENTER_CLEARANCE) * Math.cbrt(u);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta) * 0.72;
      const z = radius * Math.cos(phi) * 0.85 - 1;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      basePositions[i * 3] = x;
      basePositions[i * 3 + 1] = y;
      basePositions[i * 3 + 2] = z;
      phases[i] = Math.random() * Math.PI * 2;

      const mixed = colorRed.clone().lerp(colorWhite, Math.random() * 0.6);
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Weicher, kreisrunder Punkt-Sprite (weiche Kante per Radial-Gradient)
    // statt der harten, eckigen Standard-Quadrate von THREE.PointsMaterial.
    function createCircleTexture(): THREE.Texture {
      const size = 64;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      const gradient = ctx.createRadialGradient(
        size / 2, size / 2, 0,
        size / 2, size / 2, size / 2
      );
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.45, "rgba(255,255,255,0.75)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    }
    const circleTexture = createCircleTexture();

    const material = new THREE.PointsMaterial({
      size: 0.09,
      map: circleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // --- Statisches Staub-Partikelfeld im Hintergrund --------------------
    // Sehr viele, winzige Punkte, deutlich weiter entfernt/weiter verteilt
    // als die verbundene Partikelwolke, komplett ohne Linien und ohne
    // Eigenbewegung (echt "statisch") — wirkt wie feiner Sternenstaub
    // hinter der eigentlichen Szene. Zieht sich beim Scrollen aber genauso
    // wie der Rest zur Mitte zusammen.
    const DUST_COUNT = 2200;
    const dustPositions = new Float32Array(DUST_COUNT * 3);
    const dustBasePositions = new Float32Array(DUST_COUNT * 3);
    const dustColors = new Float32Array(DUST_COUNT * 3);
    const dustBaseShade = new Float32Array(DUST_COUNT);
    const dustPhase = new Float32Array(DUST_COUNT);
    const dustSpeed = new Float32Array(DUST_COUNT);
    const dustColor = new THREE.Color("#fff2ee");

    for (let i = 0; i < DUST_COUNT; i++) {
      const r = 11 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      const z = r * Math.cos(phi) * 0.7 - 1;
      dustPositions[i * 3] = x;
      dustPositions[i * 3 + 1] = y;
      dustPositions[i * 3 + 2] = z;
      dustBasePositions[i * 3] = x;
      dustBasePositions[i * 3 + 1] = y;
      dustBasePositions[i * 3 + 2] = z;

      const shade = 0.5 + Math.random() * 0.5;
      dustBaseShade[i] = shade;
      dustColors[i * 3] = dustColor.r * shade;
      dustColors[i * 3 + 1] = dustColor.g * shade;
      dustColors[i * 3 + 2] = dustColor.b * shade;

      // Zufällige Phase & Geschwindigkeit pro Partikel — sorgt dafür, dass
      // sich die winzigen Staubpartikel leicht und unregelmäßig bewegen
      // (kein synchrones Pulsieren) und ab und zu kurz "aufleuchten".
      dustPhase[i] = Math.random() * Math.PI * 2;
      dustSpeed[i] = 0.4 + Math.random() * 0.8;
    }

    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(dustPositions, 3)
    );
    dustGeometry.setAttribute("color", new THREE.BufferAttribute(dustColors, 3));

    const dustMaterial = new THREE.PointsMaterial({
      size: 0.022,
      map: circleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const dust = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dust);

    // --- Kleine Spiralgalaxie im Zentrum ---------------------------------
    // Echte 3D-Geometrie (keine Bild-/GIF-Textur): Partikel entlang
    // logarithmischer Spiralarme verteilt, heller/weißer Kern, der nach
    // außen zur Akzentfarbe hin ausblasst. Dreht sich langsam um sich
    // selbst — passt genau in die freie Mitte der äußeren Partikelwolke.
    const GALAXY_PARTICLE_COUNT = 1400;
    const GALAXY_RADIUS = 2.6;
    const GALAXY_ARMS = 3;
    const GALAXY_SPIN = 2.6;

    const galaxyPositions = new Float32Array(GALAXY_PARTICLE_COUNT * 3);
    const galaxyColors = new Float32Array(GALAXY_PARTICLE_COUNT * 3);

    const galaxyCore = new THREE.Color("#fff2ee");
    const galaxyMid = new THREE.Color("#ff5a4d");
    const galaxyOuter = new THREE.Color("#5c221d");

    for (let i = 0; i < GALAXY_PARTICLE_COUNT; i++) {
      const r = Math.pow(Math.random(), 1.5) * GALAXY_RADIUS;
      const armIndex = i % GALAXY_ARMS;
      const armAngleOffset = (armIndex / GALAXY_ARMS) * Math.PI * 2;
      const spinAngle = r * GALAXY_SPIN;

      // Zufällige Streuung um den Spiralarm herum (nimmt mit Radius leicht zu)
      const spread = 0.28 * (r / GALAXY_RADIUS) + 0.03;
      const randomX = (Math.random() - 0.5) * spread;
      const randomY = (Math.random() - 0.5) * spread * 0.4;
      const randomZ = (Math.random() - 0.5) * spread;

      const angle = armAngleOffset + spinAngle;
      const x = Math.cos(angle) * r + randomX;
      const y = randomY;
      const z = Math.sin(angle) * r + randomZ;

      galaxyPositions[i * 3] = x;
      galaxyPositions[i * 3 + 1] = y;
      galaxyPositions[i * 3 + 2] = z;

      const t = r / GALAXY_RADIUS;
      const mixed =
        t < 0.5
          ? galaxyCore.clone().lerp(galaxyMid, t * 2)
          : galaxyMid.clone().lerp(galaxyOuter, (t - 0.5) * 2);
      galaxyColors[i * 3] = mixed.r;
      galaxyColors[i * 3 + 1] = mixed.g;
      galaxyColors[i * 3 + 2] = mixed.b;
    }

    const galaxyGeometry = new THREE.BufferGeometry();
    galaxyGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(galaxyPositions, 3)
    );
    galaxyGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(galaxyColors, 3)
    );

    const galaxyMaterial = new THREE.PointsMaterial({
      size: 0.05,
      map: circleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
    galaxy.rotation.x = 0.35; // leichte Neigung für 3D-Perspektive
    scene.add(galaxy);

    // --- Bodenraster (Tron-artiges perspektivisches Grid für Tiefe) -----
    const grid = new THREE.GridHelper(60, 60, 0xff5a4d, 0x2a1512);
    grid.position.y = -5.5;
    (grid.material as THREE.Material & { transparent: boolean; opacity: number }).transparent = true;
    (grid.material as THREE.Material & { transparent: boolean; opacity: number }).opacity = 0.16;
    scene.add(grid);

    // --- Verbindungslinien zwischen nahen Partikeln (einmalig berechnet) ---
    // Zusätzlich wird für jeden Punkt gemerkt, mit welchen Nachbarn er
    // verbunden ist (adjacency) — die Partikel bewegen sich danach entlang
    // genau dieser Linien hin und her, statt frei im Raum zu schweben.
    const lineVertices: number[] = [];
    const adjacency: number[][] = Array.from({ length: PARTICLE_COUNT }, () => []);
    const MAX_LINK_DIST = 2.6;
    const MAX_LINKS_PER_POINT = 5;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      let links = 0;
      for (let j = i + 1; j < PARTICLE_COUNT && links < MAX_LINKS_PER_POINT; j++) {
        const dx = basePositions[i * 3] - basePositions[j * 3];
        const dy = basePositions[i * 3 + 1] - basePositions[j * 3 + 1];
        const dz = basePositions[i * 3 + 2] - basePositions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < MAX_LINK_DIST) {
          lineVertices.push(
            basePositions[i * 3], basePositions[i * 3 + 1], basePositions[i * 3 + 2],
            basePositions[j * 3], basePositions[j * 3 + 1], basePositions[j * 3 + 2]
          );
          adjacency[i].push(j);
          adjacency[j].push(i);
          links++;
        }
      }
    }

    // Freie Wanderung über das Liniennetz: statt einer festen Schiene
    // (immer zwischen denselben zwei Punkten hin und her) "läuft" jedes
    // Partikel von Knoten zu Knoten entlang der vorhandenen Linien — sobald
    // es einen Nachbarn erreicht, wird zufällig der nächste Nachbar dieses
    // Knotens als neues Ziel gewählt. So bewegen sich Partikel im Lauf der
    // Zeit frei über verschiedene Linien, statt ewig auf derselben zu pendeln.
    const railFrom = new Int32Array(PARTICLE_COUNT);
    const railTo = new Int32Array(PARTICLE_COUNT);
    const railT = new Float32Array(PARTICLE_COUNT);
    const railSpeed = new Float32Array(PARTICLE_COUNT);

    function pickNextNeighbor(node: number, avoid: number): number {
      const neighbors = adjacency[node];
      if (neighbors.length === 0) return node;
      if (neighbors.length === 1) return neighbors[0];
      // Möglichst nicht sofort zum selben Knoten zurück, damit die Bewegung
      // tatsächlich weiterwandert statt nur zwei Knoten zu pendeln.
      for (let attempt = 0; attempt < 4; attempt++) {
        const candidate = neighbors[Math.floor(Math.random() * neighbors.length)];
        if (candidate !== avoid) return candidate;
      }
      return neighbors[Math.floor(Math.random() * neighbors.length)];
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const neighbors = adjacency[i];
      railFrom[i] = i;
      railTo[i] =
        neighbors.length > 0
          ? neighbors[Math.floor(Math.random() * neighbors.length)]
          : i;
      railT[i] = Math.random(); // zufälliger Startfortschritt, damit nicht alle synchron laufen
      railSpeed[i] = 0.04 + Math.random() * 0.06;
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(lineVertices), 3)
    );
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xff8a75,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // --- Interaktion / Animation ---------------------------------------
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let mouseNormX = 0;
    let mouseNormY = 0;

    function handlePointerMove(e: PointerEvent) {
      mouseNormX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNormY = (e.clientY / window.innerHeight) * 2 - 1;
      targetRotY = mouseNormX * 0.25;
      targetRotX = -mouseNormY * 0.15;
    }
    window.addEventListener("pointermove", handlePointerMove);

    // --- Scroll-Kompression ----------------------------------------------
    // Beim Scrollen ziehen sich Partikelwolke und Verbindungsnetz langsam
    // zu einem kleineren, dichteren Cluster in der Mitte zusammen, statt
    // dass die Kamera durch die Szene fliegt (bleibt so immer sichtbar).
    let targetScrollProgress = 0;
    let currentScrollProgress = 0;

    function handleScroll() {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      targetScrollProgress =
        scrollableHeight > 0
          ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight))
          : 0;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", handleResize);

    let animationId: number;
    let elapsed = 0;

    function animate() {
      elapsed += 0.006;

      // Partikel wandern frei über das Liniennetz: von Knoten zu Knoten,
      // nicht ewig auf derselben festen Linie hin und her.
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const from = railFrom[i];
        const to = railTo[i];
        if (from === to) {
          posAttr.array[i * 3] = basePositions[from * 3];
          posAttr.array[i * 3 + 1] = basePositions[from * 3 + 1];
          posAttr.array[i * 3 + 2] = basePositions[from * 3 + 2];
          continue;
        }

        railT[i] += railSpeed[i] * 0.01;
        if (railT[i] >= 1) {
          railT[i] = 0;
          railFrom[i] = to;
          railTo[i] = pickNextNeighbor(to, from);
        }

        // Sanfte Beschleunigung/Abbremsung an den Enden (ease-in-out) statt
        // linearer Bewegung — wirkt organischer.
        const t = railT[i];
        const eased = t * t * (3 - 2 * t);

        posAttr.array[i * 3] =
          basePositions[from * 3] + (basePositions[to * 3] - basePositions[from * 3]) * eased;
        posAttr.array[i * 3 + 1] =
          basePositions[from * 3 + 1] +
          (basePositions[to * 3 + 1] - basePositions[from * 3 + 1]) * eased;
        posAttr.array[i * 3 + 2] =
          basePositions[from * 3 + 2] +
          (basePositions[to * 3 + 2] - basePositions[from * 3 + 2]) * eased;
      }
      posAttr.needsUpdate = true;

      // Staubfeld: leichtes, unregelmäßiges Driften um die Ausgangsposition
      // (kein Netz, keine Rail-Bewegung) plus kurzes, helles "Aufleuchten"
      // pro Partikel — wirkt wie funkelnder Sternenstaub statt statischer Punkte.
      const dustPosAttr = dustGeometry.attributes.position as THREE.BufferAttribute;
      const dustColorAttr = dustGeometry.attributes.color as THREE.BufferAttribute;
      for (let i = 0; i < DUST_COUNT; i++) {
        const t = elapsed * dustSpeed[i] + dustPhase[i];
        const driftX = Math.sin(t) * 0.18;
        const driftY = Math.cos(t * 0.8) * 0.18;
        const driftZ = Math.sin(t * 1.3) * 0.18;
        dustPosAttr.array[i * 3] = dustBasePositions[i * 3] + driftX;
        dustPosAttr.array[i * 3 + 1] = dustBasePositions[i * 3 + 1] + driftY;
        dustPosAttr.array[i * 3 + 2] = dustBasePositions[i * 3 + 2] + driftZ;

        // Kurzer, scharfer Helligkeits-Puls statt sanftem Pulsieren — wirkt
        // wie ein kurzes Aufblitzen, nicht wie gleichmäßiges Atmen.
        const twinkle = Math.pow(Math.max(0, Math.sin(t * 1.7)), 10);
        const shade = dustBaseShade[i] + twinkle * (1 - dustBaseShade[i]) * 1.4;
        dustColorAttr.array[i * 3] = dustColor.r * shade;
        dustColorAttr.array[i * 3 + 1] = dustColor.g * shade;
        dustColorAttr.array[i * 3 + 2] = dustColor.b * shade;
      }
      dustPosAttr.needsUpdate = true;
      dustColorAttr.needsUpdate = true;

      // langsame, endlose Gruppenrotation (immer in Bewegung) — dreht sich
      // beim Zusammenziehen durch Scrollen etwas schneller
      const spinBoost = 1 + currentScrollProgress * 2.5;
      points.rotation.y = elapsed * 0.05 * spinBoost;
      lines.rotation.y = elapsed * 0.05 * spinBoost;

      // Kleine Spiralgalaxie: sehr langsame, gleichmäßige Eigendrehung
      galaxy.rotation.y = elapsed * 0.05;

      // Bodenraster: sehr langsame, endlose Drift-Bewegung nach vorn
      grid.position.z = (elapsed * 0.6) % 2;

      // Kamera-Parallaxe: sanft zur Zielposition interpolieren + leichtes
      // autonomes Driften, damit auch ohne Mausbewegung Leben in der Szene ist
      currentRotX += (targetRotX - currentRotX) * 0.03;
      currentRotY += (targetRotY - currentRotY) * 0.03;
      currentScrollProgress +=
        (targetScrollProgress - currentScrollProgress) * 0.06;

      camera.position.x = currentRotY * 3 + Math.sin(elapsed * 0.15) * 0.6;
      camera.position.y = currentRotX * 3 + Math.cos(elapsed * 0.12) * 0.3;
      camera.position.z = 9;
      camera.lookAt(0, 0, 0);

      // Partikelwolke + Netz + Kristall ziehen sich beim Scrollen langsam
      // zu einem kleinen, dichten Cluster zusammen (und drehen sich dabei
      // etwas schneller — wirkt wie ein Kollaps zur Mitte)
      const compress = 1 - currentScrollProgress * 0.78;
      points.scale.setScalar(compress);
      lines.scale.setScalar(compress);
      dust.scale.setScalar(compress);
      galaxy.scale.setScalar(1 - currentScrollProgress * 0.4);
      grid.position.y = -5.5 + currentScrollProgress * 2.5;
      (grid.material as THREE.Material).opacity =
        0.16 * (1 - currentScrollProgress * 0.7);

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      geometry.dispose();
      material.dispose();
      circleTexture.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      galaxyGeometry.dispose();
      galaxyMaterial.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      grid.geometry.dispose();
      (grid.material as THREE.Material).dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none fixed inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
