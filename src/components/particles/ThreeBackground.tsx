"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createBlackHole } from "./blackHole";
import { createCellNetwork } from "./cellNetwork";

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

    // Nutzerkorrektur 03.10.2026 ("wieso springt der Hintergrund?"): am Handy
    // ändert sich die Fensterhöhe beim Scrollen, weil die Adressleiste ein-
    // und ausblendet → die Szene wurde jedes Mal neu skaliert und das Schwarze
    // Loch sprang. Jetzt: feste Höhe = größte Ansicht (100lvh), und nur bei
    // echter Größenänderung (Breite oder Drehen) neu berechnen.
    const probe = document.createElement("div");
    probe.style.cssText = "position:fixed;top:0;left:0;width:0;height:100lvh;visibility:hidden;pointer-events:none";
    document.body.appendChild(probe);
    const viewH = () => Math.max(probe.offsetHeight || 0, window.innerHeight);
    let viewW = window.innerWidth;
    let viewHt = viewH();

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030303, 0.045);
    const camera = new THREE.PerspectiveCamera(
      55,
      viewW / viewHt,
      0.1,
      100
    );
    camera.position.z = 9;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // Handy: höchstens 1,5-fache Pixeldichte statt bis zu 3-fach — weiche
    // Partikel sehen gleich aus, aber nur ein Viertel der Pixel muss jedes
    // Bild neu berechnet werden (Nutzerhinweis 07.10.2026: "laggy").
    const smallScreen = Math.min(window.innerWidth, window.innerHeight) < 820;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, smallScreen ? 1.5 : 2));
    renderer.setSize(viewW, viewHt);
    mount.appendChild(renderer.domElement);

    // --- Partikelwolke -------------------------------------------------
    // Kompakte, symmetrische Kugelverteilung um das Zentrum (statt einer
    // zufälligen, gestreckten Box) — wirkt aufgeräumter und ausgewogener.
    // Nutzerwunsch 19.09.2026: "bisschen mehr partikel über linien . und
    // bisschen schneller bewegen" — mehr Partikel (mehr Verkehr auf den
    // Verbindungslinien) und höheres Lauftempo (railSpeed unten).
    // Nutzerwunsch 29.09.2026: Zellen-Netz kompakter/futuristischer —
    // 2000 Netzknoten (viele kleine Zellen), darauf laufen 700 Energieströme.
    const NODE_COUNT = 2000;
    const MOVER_COUNT = 700;
    const CLOUD_RADIUS = 13;
    const positions = new Float32Array(MOVER_COUNT * 3);
    const basePositions = new Float32Array(NODE_COUNT * 3);
    const colors = new Float32Array(MOVER_COUNT * 3);

    const colorRed = new THREE.Color("#ff5a4d");
    const colorWhite = new THREE.Color("#fff2ee");

    // Innerer Radius, der von Partikeln frei bleibt — hier sitzt später das
    // zentrale Bild (Schwarzes Loch), damit es nicht von Punkten/Linien
    // verdeckt wird.
    const CENTER_CLEARANCE = 3.4;

    for (let i = 0; i < NODE_COUNT; i++) {
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

      basePositions[i * 3] = x;
      basePositions[i * 3 + 1] = y;
      basePositions[i * 3 + 2] = z;
    }
    // Energieströme: heller Kopf (fast weiß, leicht rötlich)
    for (let i = 0; i < MOVER_COUNT; i++) {
      const mixed = colorRed.clone().lerp(colorWhite, 0.7 + Math.random() * 0.3);
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
      // kleiner, kompakter Funke an der Spitze jedes Energiestroms
      size: 0.028,
      map: circleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 1,
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
      size: 0.032,
      map: circleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const dust = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dust);

    // --- Schwarzes Loch im Zentrum (Interstellar/Gargantua-Stil) ---------
    // Ersetzt die frühere Spiralgalaxie. Echte Lichtstrahl-Krümmung im
    // Shader (siehe blackHole.ts): Schatten, Photonenring, Akkretions-
    // scheibe und der über/unter dem Loch gebogene Scheibenbogen.
    const blackHole = createBlackHole(7);
    scene.add(blackHole.mesh);

    // --- Zellen-Netz (siehe cellNetwork.ts) -----------------------------
    // Viele kleine, geschlossene Zellen ohne Sackgassen; feine Leitungen.
    const network = createCellNetwork(basePositions, NODE_COUNT);
    const adjacency = network.adjacency;
    const lines = network.lines;
    scene.add(lines);

    // --- Energieströme: laufen endlos auf zufälligen Wegen durchs Netz ----
    // Gleichmäßiges Tempo (kein Abbremsen an Knoten); an jedem Knoten wird
    // zufällig eine neue Leitung gewählt, möglichst nicht direkt zurück.
    const railFrom = new Int32Array(MOVER_COUNT);
    const railTo = new Int32Array(MOVER_COUNT);
    const railT = new Float32Array(MOVER_COUNT);
    const railSpeed = new Float32Array(MOVER_COUNT);

    function pickNextNeighbor(node: number, avoid: number): number {
      const neighbors = adjacency[node];
      if (neighbors.length === 0) return node;
      if (neighbors.length === 1) return neighbors[0];
      for (let attempt = 0; attempt < 4; attempt++) {
        const candidate = neighbors[Math.floor(Math.random() * neighbors.length)];
        if (candidate !== avoid) return candidate;
      }
      return neighbors[Math.floor(Math.random() * neighbors.length)];
    }

    const linkedNodes: number[] = [];
    for (let i = 0; i < NODE_COUNT; i++) if (adjacency[i].length > 0) linkedNodes.push(i);
    for (let i = 0; i < MOVER_COUNT; i++) {
      const start = linkedNodes[Math.floor(Math.random() * linkedNodes.length)];
      railFrom[i] = start;
      railTo[i] = adjacency[start][Math.floor(Math.random() * adjacency[start].length)];
      railT[i] = Math.random();
      railSpeed[i] = 0.21 + Math.random() * 0.25; // Welteinheiten pro Sekunde
      for (let c = 0; c < 3; c++) {
        positions[i * 3 + c] =
          basePositions[railFrom[i] * 3 + c] +
          (basePositions[railTo[i] * 3 + c] - basePositions[railFrom[i] * 3 + c]) * railT[i];
      }
    }

    // Leuchtspur hinter jedem Strom: die letzten Positionen als kurze Linie,
    // vorne fast weiß, hinten rot verglühend (Nutzerwunsch: "wie Strom oder
    // helle Energie", Länge gekürzt, Kopf kompakt).
    const TRAIL_POINTS = 8;
    const TRAIL_STEP = 0.035;
    const trailHist = new Float32Array(MOVER_COUNT * TRAIL_POINTS * 3);
    for (let i = 0; i < MOVER_COUNT; i++) {
      for (let k = 0; k < TRAIL_POINTS; k++) {
        trailHist.set(positions.subarray(i * 3, i * 3 + 3), (i * TRAIL_POINTS + k) * 3);
      }
    }
    const trailPos = new Float32Array(MOVER_COUNT * TRAIL_POINTS * 6);
    const trailCol = new Float32Array(MOVER_COUNT * TRAIL_POINTS * 6);
    // Farbverlauf ist für alle Spuren gleich → einmal vorberechnen
    const HOT = [1.0, 0.93, 0.86];
    const EMBER = [1.0, 0.32, 0.24];
    for (let i = 0; i < MOVER_COUNT; i++) {
      for (let k = 0; k < TRAIL_POINTS; k++) {
        const o = (i * TRAIL_POINTS + k) * 6;
        const f0 = Math.pow(1 - k / TRAIL_POINTS, 1.6);
        const f1 = Math.pow(1 - (k + 1) / TRAIL_POINTS, 1.6);
        for (let c = 0; c < 3; c++) {
          trailCol[o + c] = (EMBER[c] + (HOT[c] - EMBER[c]) * f0 * f0) * f0;
          trailCol[o + 3 + c] = (EMBER[c] + (HOT[c] - EMBER[c]) * f1 * f1) * f1;
        }
      }
    }
    const trailGeometry = new THREE.BufferGeometry();
    trailGeometry.setAttribute("position", new THREE.BufferAttribute(trailPos, 3));
    trailGeometry.setAttribute("color", new THREE.BufferAttribute(trailCol, 3));
    const trailMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const trails = new THREE.LineSegments(trailGeometry, trailMaterial);
    scene.add(trails);

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
      const w = window.innerWidth;
      const h = viewH();
      // nur Adressleiste ein/aus (gleiche Breite, kleine Höhenänderung) → ignorieren
      if (w === viewW && Math.abs(h - viewHt) < 200) return;
      viewW = w;
      viewHt = h;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", handleResize);

    let animationId: number;
    let lastFrame = performance.now();
    let elapsed = 0;

    function animate() {
      // Vollbild-Sonnensystem offen → Hintergrund verdeckt, nicht rendern (Nutzer: "es laggt")
      const ds = document.documentElement.dataset;
      if (ds.overlay === "1" || ds.bgpause === "1") {
        lastFrame = performance.now();
        animationId = requestAnimationFrame(animate);
        return;
      }
      elapsed += 0.006;

      // Energieströme: gleichmäßig weiter auf zufälligem Weg, nie Pause
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastFrame) / 1000);
      lastFrame = now;
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const P = posAttr.array as Float32Array;
      for (let i = 0; i < MOVER_COUNT; i++) {
        let from = railFrom[i];
        let to = railTo[i];
        const dx = basePositions[to * 3] - basePositions[from * 3];
        const dy = basePositions[to * 3 + 1] - basePositions[from * 3 + 1];
        const dz = basePositions[to * 3 + 2] - basePositions[from * 3 + 2];
        const len = Math.max(0.05, Math.sqrt(dx * dx + dy * dy + dz * dz));
        railT[i] += (railSpeed[i] * dt) / len;
        while (railT[i] >= 1) {
          railT[i] -= 1;
          railFrom[i] = to;
          railTo[i] = pickNextNeighbor(to, from);
          from = railFrom[i];
          to = railTo[i];
        }
        const t = railT[i];
        for (let c = 0; c < 3; c++) {
          P[i * 3 + c] = basePositions[from * 3 + c] + (basePositions[to * 3 + c] - basePositions[from * 3 + c]) * t;
        }

        // Spur: neuen Punkt merken, sobald der Strom ein Stück weiter ist
        const h = i * TRAIL_POINTS * 3;
        const mx = P[i * 3] - trailHist[h];
        const my = P[i * 3 + 1] - trailHist[h + 1];
        const mz = P[i * 3 + 2] - trailHist[h + 2];
        if (mx * mx + my * my + mz * mz >= TRAIL_STEP * TRAIL_STEP) {
          trailHist.copyWithin(h + 3, h, h + (TRAIL_POINTS - 1) * 3);
          trailHist[h] = P[i * 3];
          trailHist[h + 1] = P[i * 3 + 1];
          trailHist[h + 2] = P[i * 3 + 2];
        }
        for (let k = 0; k < TRAIL_POINTS; k++) {
          const o = (i * TRAIL_POINTS + k) * 6;
          const a0 = k === 0 ? i * 3 : h + (k - 1) * 3;
          const src0 = k === 0 ? P : trailHist;
          trailPos[o] = src0[a0];
          trailPos[o + 1] = src0[a0 + 1];
          trailPos[o + 2] = src0[a0 + 2];
          trailPos[o + 3] = trailHist[h + k * 3];
          trailPos[o + 4] = trailHist[h + k * 3 + 1];
          trailPos[o + 5] = trailHist[h + k * 3 + 2];
        }
      }
      posAttr.needsUpdate = true;
      (trailGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;

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
      trails.rotation.y = points.rotation.y;

      // Kleine Spiralgalaxie: sehr langsame, gleichmäßige Eigendrehung

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
      trails.scale.setScalar(compress);
      dust.scale.setScalar(compress);
      // Am schmalen Handy-Bildschirm etwas kleiner, damit die Scheibe nicht
      // links/rechts abgeschnitten wird
      const fitScale = Math.min(1, camera.aspect * 1.4);
      blackHole.mesh.scale.setScalar(fitScale * (1 - currentScrollProgress * 0.4));
      // echte Zeit statt Bildzähler → gleich schnell auf 60-Hz- und 144-Hz-Monitoren
      blackHole.update((performance.now() / 1000) * 2.2, camera);

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      probe.remove();
      window.removeEventListener("scroll", handleScroll);
      geometry.dispose();
      material.dispose();
      circleTexture.dispose();
      network.dispose();
      trailGeometry.dispose();
      trailMaterial.dispose();
      blackHole.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none fixed inset-x-0 top-0 h-[100lvh] w-full"
      aria-hidden="true"
    />
  );
}
