"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ALL_BODIES, SUN, type PlanetData } from "@/data/solarSystem";
import { useLanguage } from "@/contexts/LanguageContext";
import { localize } from "@/lib/i18n";
import {
  EPOCH_JD,
  ORBITS,
  bodyPosition,
  dateToJd,
  distanceAu,
  jdToDate,
  nextClosestApproach,
  orbitPath,
  type Vec3,
} from "@/lib/astro/orbits";
import { earthCloudsCanvas, glowCanvas, saturnRingCanvas, sunCanvas, surfaceCanvas } from "./planetTextures";

/**
 * Echte 3D-Ansicht des Sonnensystems (three.js + OrbitControls).
 *
 * Nutzerwunsch 01.10.2026: "kannst du Zoomen und Drehen realistischer
 * machen … so wie ein 3D-Objekt dreht oder zoomt". Die alte 2D-Canvas-
 * Ansicht hatte eine nur vorgetäuschte Neigung und eine orthografische
 * Kamera — daher das "gesperrte" Gefühl. Jetzt:
 *  - echte Perspektive, die Kamera kreist frei um den Blickpunkt
 *    (wie Sketchfab / Google Earth / 3D-Programme), mit sanftem Auslaufen
 *  - Zoom auf den Mauszeiger bzw. die Fingermitte, weich animiert
 *  - Doppelklick / Doppeltippen auf einen Planeten fliegt zu ihm hin,
 *    ein Klick zentriert ihn und die Kamera fliegt mit
 *  - Kugeln mit Beleuchtung durch die Sonne (Tag-/Nachtseite), echte
 *    Achsneigungen und Rotationsperioden, Saturnringe, Atmosphärensaum
 *
 * Positionen/Bahnen: unverändert aus lib/astro/orbits.ts (NASA/JPL-
 * Horizons-Bahnelemente). "Echter Maßstab": 1 Einheit = 1 AE, Sonne und
 * Planeten in echter Größe (zu kleine werden als Mindest-Punkt
 * gezeichnet). "Kompakt": Abstände gestaucht wie in der 2D-Ansicht.
 */

interface Props {
  onSelectPlanet?: (planet: PlanetData | null) => void;
  selectedId?: string | null;
  className?: string;
  /** Wird aufgerufen, wenn WebGL nicht verfügbar ist (→ 2D-Ansicht). */
  onWebglError?: () => void;
}

type ScaleMode = "compact" | "real";

const LIVE = 1 / 86400;
const SPEEDS = [0, LIVE, 1, 10, 100, 1000] as const;
const DEFAULT_SPEED_INDEX = 1;
const KM_PER_AU = 149597870.7;
const LIGHT_KM_PER_MIN = 299792.458 * 60;
const SUN_KM = 1392700;
const DEG = Math.PI / 180;

// Rotationsperioden (Stunden, negativ = rückläufig) und Achsneigungen (°)
// — NASA Planetary Fact Sheet / IAU. Die Richtung, in die die Achse
// geneigt ist, ist vereinfacht (alle um dieselbe Achse gekippt); der
// Neigungs-WINKEL ist echt.
const ROT_HOURS: Record<string, number> = {
  sun: 609.12,
  mercury: 1407.6,
  venus: -5832.5,
  earth: 23.934,
  mars: 24.623,
  jupiter: 9.925,
  saturn: 10.656,
  uranus: -17.24,
  neptune: 16.11,
  pluto: -153.3,
  ceres: 9.07,
  haumea: 3.92,
  makemake: 22.83,
  eris: 25.9,
};
const TILT_DEG: Record<string, number> = {
  sun: 7.25,
  mercury: 0.03,
  venus: 177.4,
  earth: 23.44,
  mars: 25.19,
  jupiter: 3.13,
  saturn: 26.73,
  uranus: 97.77,
  neptune: 28.32,
  pluto: 122.5,
  ceres: 4,
};
const ATMOSPHERE: Record<string, [number, number, number]> = {
  earth: [0.45, 0.7, 1.0],
  venus: [1.0, 0.9, 0.65],
  mars: [1.0, 0.6, 0.45],
  jupiter: [1.0, 0.86, 0.68],
  saturn: [1.0, 0.9, 0.7],
  uranus: [0.65, 0.92, 0.95],
  neptune: [0.45, 0.6, 1.0],
};

// --- Kompakt-Skala (wie in der 2D-Ansicht): innen Wurzel, jenseits Neptun linear ---
const NEPTUNE_AU = 30.05;
const MIN_AU_SQRT = Math.sqrt(0.3);
const INNER_FRACTION = 0.42;
const OUTER_MAX_AU = 175;
const C_SUN_R = 0.6;
const C_INNER = C_SUN_R * 2 + 0.5;
const C_OUTER = 50;
function compactRadius(rAu: number): number {
  let t: number;
  if (rAu <= NEPTUNE_AU) {
    t = (Math.max(0, Math.sqrt(rAu) - MIN_AU_SQRT) / (Math.sqrt(NEPTUNE_AU) - MIN_AU_SQRT)) * INNER_FRACTION;
  } else {
    t = INNER_FRACTION + ((rAu - NEPTUNE_AU) / (OUTER_MAX_AU - NEPTUNE_AU)) * (1 - INNER_FRACTION);
  }
  return C_INNER + t * (C_OUTER - C_INNER);
}
function toDisplay(p: Vec3, real: boolean, out: THREE.Vector3): THREE.Vector3 {
  if (real) return out.set(p[0], p[1], p[2]);
  const r = Math.hypot(p[0], p[1], p[2]);
  if (r < 1e-12) return out.set(0, 0, 0);
  const k = compactRadius(r) / r;
  return out.set(p[0] * k, p[1] * k, p[2] * k);
}

/** Exzentrische Anomalie zum Datum (für die "Spur" hinter dem Planeten). */
function eccentricAnomaly(id: string, jd: number): number | null {
  const o = ORBITS[id];
  if (!o) return null;
  let M = ((o.ma + o.n * (jd - EPOCH_JD)) % 360) * DEG;
  if (M < 0) M += Math.PI * 2;
  let E = o.e < 0.8 ? M : Math.PI;
  for (let k = 0; k < 12; k++) {
    const d = (E - o.e * Math.sin(E) - M) / (1 - o.e * Math.cos(E));
    E -= d;
    if (Math.abs(d) < 1e-10) break;
  }
  return E;
}

/** Körper-Radius in Szenen-Einheiten (ohne Mindestgröße). */
function baseRadius(b: PlanetData, real: boolean): number {
  const km = b.id === "sun" ? SUN_KM : b.diameterKm;
  return real ? km / 2 / KM_PER_AU : (C_SUN_R * km) / SUN_KM;
}

const ORBIT_VERT = /* glsl */ `
  attribute float aPhase;
  varying float vPhase;
  void main() {
    vPhase = aPhase;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const ORBIT_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPhase;
  uniform float uBase;
  uniform float uTrail;
  varying float vPhase;
  void main() {
    float d = fract(uPhase - vPhase); // 0 = beim Planeten, wächst nach hinten
    float a = uBase + uTrail * exp(-d * 7.0);
    gl_FragColor = vec4(uColor, a);
  }
`;
const ATMO_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vPos = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;
const ATMO_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uSunView;
  uniform float uStrength;
  varying vec3 vNormal;
  varying vec3 vPos;
  void main() {
    vec3 n = normalize(vNormal);
    vec3 viewDir = normalize(-vPos);
    float fres = pow(1.0 - max(dot(n, viewDir), 0.0), 2.6);
    float light = clamp(dot(n, normalize(uSunView - vPos)) * 0.9 + 0.25, 0.0, 1.0);
    gl_FragColor = vec4(uColor * fres * light * uStrength, 1.0);
  }
`;
const SUN_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPos;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vPos = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;
const SUN_FRAG = /* glsl */ `
  uniform sampler2D uMap;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPos;
  void main() {
    float mu = max(dot(normalize(vNormal), normalize(-vPos)), 0.0);
    float limb = mix(0.62, 1.0, pow(mu, 0.45)); // Randverdunklung
    gl_FragColor = vec4(texture2D(uMap, vUv).rgb * limb, 1.0);
  }
`;
const STAR_VERT = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  uniform float uDpr;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    gl_PointSize = aSize * uDpr;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const STAR_FRAG = /* glsl */ `
  varying vec3 vColor;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float a = smoothstep(0.5, 0.1, length(c));
    gl_FragColor = vec4(vColor * a, 1.0);
  }
`;

interface BodyObj {
  data: PlanetData;
  group: THREE.Group; // Position
  tilt: THREE.Group; // Achsneigung
  mesh: THREE.Mesh; // dreht sich
  materials: THREE.Material[];
  clouds?: THREE.Mesh;
  atmo?: THREE.Mesh;
  ring?: THREE.Mesh;
  orbit?: THREE.Line;
  orbitMat?: THREE.ShaderMaterial;
  pos: THREE.Vector3; // aktuelle Darstellungs-Position
  visR: number; // aktuell gezeichneter Radius (inkl. Mindestgröße)
  pxR: number; // Radius auf dem Bildschirm (px)
  spin: number;
  minPx: number;
}

export default function SolarSystem3D({ onSelectPlanet, selectedId, className = "", onWebglError }: Props) {
  const { lang, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const labelCanvasRef = useRef<HTMLCanvasElement>(null);
  const dateLabelRef = useRef<HTMLSpanElement>(null);

  const jdRef = useRef(dateToJd(new Date()));
  const [scaleMode, setScaleMode] = useState<ScaleMode>("compact");
  const scaleModeRef = useRef<ScaleMode>("compact");
  const [speedIndex, setSpeedIndex] = useState(DEFAULT_SPEED_INDEX);
  const speedRef = useRef<number>(SPEEDS[DEFAULT_SPEED_INDEX]);
  useEffect(() => {
    speedRef.current = SPEEDS[speedIndex];
  }, [speedIndex]);

  const langRef = useRef(lang);
  langRef.current = lang;
  const onSelectRef = useRef(onSelectPlanet);
  onSelectRef.current = onSelectPlanet;
  const selectedRef = useRef<string | null>(selectedId ?? null);

  // Brücke zwischen React (Buttons, Auswahl) und der Render-Schleife
  const apiRef = useRef<{
    focus: (id: string, close: boolean) => void;
    zoomBy: (factor: number) => void;
    setScale: (m: ScaleMode) => void;
    unfollow: () => void;
  } | null>(null);

  // ---------------- Abstände / Annäherungen (wie 2D-Ansicht) ----------------
  const [showDistances, setShowDistances] = useState(false);
  const [dateInput, setDateInput] = useState("");
  const approachCacheRef = useRef<{ jd: number; map: Map<string, { jd: number; au: number } | null> } | null>(null);
  function jumpTo(jd: number, planet?: PlanetData) {
    jdRef.current = jd;
    approachCacheRef.current = null;
    setSpeedIndex(0);
    const d = jdToDate(jd);
    const pad = (n: number) => String(n).padStart(2, "0");
    setDateInput(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
    if (planet) onSelectPlanet?.(planet);
  }
  const [distanceRows, setDistanceRows] = useState<
    { planet: PlanetData; nowKm: number; next: { jd: number; au: number } | null }[]
  >([]);
  useEffect(() => {
    if (!showDistances) return;
    function update() {
      const jd = jdRef.current;
      let cache = approachCacheRef.current;
      if (!cache || Math.abs(cache.jd - jd) > 1) {
        const map = new Map<string, { jd: number; au: number } | null>();
        for (const b of ALL_BODIES) {
          if (b.id !== "earth") map.set(b.id, b.kind === "probe" ? null : nextClosestApproach(b.id, jd));
        }
        cache = { jd, map };
        approachCacheRef.current = cache;
      }
      const rows = ALL_BODIES.filter((b) => b.id !== "earth").map((planet) => {
        const au = distanceAu(planet.id, "earth", jd) ?? 0;
        const next = cache!.map.get(planet.id) ?? null;
        return { planet, nowKm: au * KM_PER_AU, next: next && next.jd >= jd ? next : null };
      });
      setDistanceRows(rows);
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [showDistances]);
  const numFmt = useMemo(() => new Intl.NumberFormat(lang, { maximumFractionDigits: 1, minimumFractionDigits: 1 }), [lang]);
  const lightFmt = useMemo(() => new Intl.NumberFormat(lang, { maximumFractionDigits: 1 }), [lang]);
  const shortDateFmt = useMemo(
    () => new Intl.DateTimeFormat(lang, { year: "numeric", month: "short", day: "numeric" }),
    [lang]
  );

  // Auswahl von außen (Klick, Tabelle) → Kamera zentriert den Körper
  useEffect(() => {
    selectedRef.current = selectedId ?? null;
    if (selectedId) apiRef.current?.focus(selectedId, false);
    else apiRef.current?.unfollow();
  }, [selectedId]);

  useEffect(() => {
    scaleModeRef.current = scaleMode;
    apiRef.current?.setScale(scaleMode);
  }, [scaleMode]);

  // ======================= Szene (einmalig) =======================
  useEffect(() => {
    const container = containerRef.current;
    const canvas = glCanvasRef.current;
    const labelCanvas = labelCanvasRef.current;
    if (!container || !canvas || !labelCanvas) return;
    const lctx = labelCanvas.getContext("2d");
    if (!lctx) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    } catch {
      onWebglError?.();
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 1);

    const scene = new THREE.Scene();
    const bgScene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 1000);
    camera.up.set(0, 0, 1); // Ekliptik-Nordpol = oben (vor OrbitControls setzen!)
    const bgCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);

    const disposables: { dispose: () => void }[] = [];
    const tex = (c: HTMLCanvasElement, srgb = true) => {
      const tx = new THREE.CanvasTexture(c);
      if (srgb) tx.colorSpace = THREE.SRGBColorSpace;
      tx.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      disposables.push(tx);
      return tx;
    };

    // --- Licht: Punktlicht in der Sonne, sehr schwaches Umgebungslicht ---
    const sunLight = new THREE.PointLight(0xffffff, 3.4, 0, 0);
    scene.add(sunLight);
    scene.add(new THREE.AmbientLight(0xffffff, 0.06));

    // --- Sternenhimmel (eigene Szene, folgt nur der Blickrichtung) ---
    {
      const N = 2600;
      const pos = new Float32Array(N * 3);
      const col = new Float32Array(N * 3);
      const size = new Float32Array(N);
      const tints: [number, number, number][] = [
        [1, 1, 1],
        [0.78, 0.86, 1],
        [1, 0.93, 0.82],
        [1, 0.84, 0.74],
      ];
      // Milchstraße: Großkreis, ~60° gegen die Ekliptik geneigt (wie echt)
      const gal = new THREE.Matrix4().makeRotationX(60.2 * DEG).multiply(new THREE.Matrix4().makeRotationZ(-1.6));
      const v = new THREE.Vector3();
      for (let i = 0; i < N; i++) {
        const inBand = i % 5 < 2;
        const lon = Math.random() * Math.PI * 2;
        let lat: number;
        if (inBand) lat = (Math.random() + Math.random() + Math.random() - 1.5) * 0.16;
        else lat = Math.asin(Math.random() * 2 - 1);
        v.set(Math.cos(lat) * Math.cos(lon), Math.cos(lat) * Math.sin(lon), Math.sin(lat));
        if (inBand) v.applyMatrix4(gal);
        v.multiplyScalar(50);
        pos.set([v.x, v.y, v.z], i * 3);
        const tnt = tints[Math.floor(Math.random() * tints.length)];
        const b = Math.random() < 0.9 ? 0.25 + Math.random() * 0.45 : 0.7 + Math.random() * 0.3;
        col.set([tnt[0] * b, tnt[1] * b, tnt[2] * b], i * 3);
        size[i] = Math.random() < 0.92 ? 1.2 + Math.random() * 1.0 : 2.2 + Math.random() * 1.6;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      g.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
      g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
      const m = new THREE.ShaderMaterial({
        vertexShader: STAR_VERT,
        fragmentShader: STAR_FRAG,
        uniforms: { uDpr: { value: dpr } },
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
      });
      bgScene.add(new THREE.Points(g, m));
      disposables.push(g, m);
    }

    // --- Körper ---
    const sphereGeo = new THREE.SphereGeometry(1, 64, 32);
    sphereGeo.rotateX(Math.PI / 2); // Pole auf die z-Achse
    const lowSphereGeo = new THREE.SphereGeometry(1, 24, 12);
    lowSphereGeo.rotateX(Math.PI / 2);
    disposables.push(sphereGeo, lowSphereGeo);
    const atmoUniformSun = { value: new THREE.Vector3() };

    const bodies: BodyObj[] = [];
    const allBodies: PlanetData[] = [SUN, ...ALL_BODIES];
    for (const data of allBodies) {
      const group = new THREE.Group();
      const tilt = new THREE.Group();
      tilt.rotation.x = -(TILT_DEG[data.id] ?? 0) * DEG;
      group.add(tilt);
      const materials: THREE.Material[] = [];
      let mesh: THREE.Mesh;
      const obj: Partial<BodyObj> = {};

      if (data.id === "sun") {
        const m = new THREE.ShaderMaterial({
          vertexShader: SUN_VERT,
          fragmentShader: SUN_FRAG,
          uniforms: { uMap: { value: tex(sunCanvas(), false) } },
        });
        mesh = new THREE.Mesh(sphereGeo, m);
        materials.push(m);
        // Lichthof: zwei additive Sprites (innen kräftig, außen weit und schwach)
        const glowTex = tex(glowCanvas("rgba(255,246,225,0.9)", "rgba(255,190,110,0.18)"));
        for (const [scale, opacity] of [
          [5, 0.85],
          [14, 0.3],
        ] as const) {
          const sm = new THREE.SpriteMaterial({
            map: glowTex,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true,
            opacity,
          });
          const sp = new THREE.Sprite(sm);
          sp.scale.setScalar(scale);
          sp.userData.glowScale = scale;
          group.add(sp);
          materials.push(sm);
        }
      } else if (data.kind === "probe") {
        const m = new THREE.MeshBasicMaterial({ color: data.color });
        const geo = new THREE.OctahedronGeometry(1);
        disposables.push(geo);
        mesh = new THREE.Mesh(geo, m);
        materials.push(m);
      } else {
        const big = data.kind !== "dwarf";
        const m = new THREE.MeshStandardMaterial({
          map: tex(surfaceCanvas(data.id, data.color)),
          roughness: 0.95,
          metalness: 0,
          emissive: new THREE.Color(data.color),
          emissiveIntensity: 0,
        });
        mesh = new THREE.Mesh(big ? sphereGeo : lowSphereGeo, m);
        materials.push(m);
        if (data.id === "haumea") mesh.scale.set(1, 0.73, 0.44); // stark abgeplattet (echt ~2100×1680×1074 km)

        if (data.id === "earth") {
          const cm = new THREE.MeshStandardMaterial({
            map: tex(earthCloudsCanvas()),
            transparent: true,
            depthWrite: false,
            roughness: 1,
          });
          obj.clouds = new THREE.Mesh(sphereGeo, cm);
          obj.clouds.scale.setScalar(1.012);
          mesh.add(obj.clouds);
          materials.push(cm);
        }
        const atmoCol = ATMOSPHERE[data.id];
        if (atmoCol) {
          const am = new THREE.ShaderMaterial({
            vertexShader: ATMO_VERT,
            fragmentShader: ATMO_FRAG,
            uniforms: {
              uColor: { value: new THREE.Vector3(...atmoCol) },
              uSunView: atmoUniformSun,
              uStrength: { value: data.id === "earth" ? 1.3 : 0.8 },
            },
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false,
          });
          obj.atmo = new THREE.Mesh(sphereGeo, am);
          obj.atmo.scale.setScalar(data.id === "earth" ? 1.035 : 1.025);
          tilt.add(obj.atmo);
          materials.push(am);
        }
        if (data.id === "saturn") {
          const inner = 1.24;
          const outer = 2.27;
          const rg = new THREE.RingGeometry(inner, outer, 160, 1);
          const p = rg.attributes.position;
          const uv = rg.attributes.uv;
          for (let i = 0; i < p.count; i++) {
            const r = Math.hypot(p.getX(i), p.getY(i));
            uv.setXY(i, (r - inner) / (outer - inner), 0.5);
          }
          const rm = new THREE.MeshStandardMaterial({
            map: tex(saturnRingCanvas()),
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            roughness: 1,
          });
          obj.ring = new THREE.Mesh(rg, rm);
          tilt.add(obj.ring);
          disposables.push(rg);
          materials.push(rm);
        }
      }
      tilt.add(mesh);
      scene.add(group);
      const minPx = data.id === "sun" ? 4 : data.kind === "dwarf" ? 1.6 : data.kind === "probe" ? 2.6 : 2.4;
      bodies.push({
        data,
        group,
        tilt,
        mesh,
        materials,
        clouds: obj.clouds,
        atmo: obj.atmo,
        ring: obj.ring,
        pos: new THREE.Vector3(),
        visR: 1,
        pxR: 0,
        spin: Math.random() * Math.PI * 2,
        minPx,
      });
    }
    const byId = new Map(bodies.map((b) => [b.data.id, b]));

    // --- Bahnlinien (pro Maßstab neu aufgebaut) ---
    function buildOrbits(real: boolean) {
      for (const b of bodies) {
        if (b.orbit) {
          scene.remove(b.orbit);
          b.orbit.geometry.dispose();
          b.orbitMat?.dispose();
          b.orbit = undefined;
        }
        if (!ORBITS[b.data.id]) continue;
        const SEG = 1024;
        const pts = orbitPath(b.data.id, SEG);
        const pos = new Float32Array(pts.length * 3);
        const phase = new Float32Array(pts.length);
        const v = new THREE.Vector3();
        pts.forEach((p, i) => {
          toDisplay(p, real, v);
          pos.set([v.x, v.y, v.z], i * 3);
          phase[i] = i / SEG;
        });
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        g.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
        const c = new THREE.Color(b.data.color);
        const dwarf = b.data.kind === "dwarf";
        const m = new THREE.ShaderMaterial({
          vertexShader: ORBIT_VERT,
          fragmentShader: ORBIT_FRAG,
          uniforms: {
            uColor: { value: new THREE.Vector3(c.r, c.g, c.b) },
            uPhase: { value: 0 },
            uBase: { value: dwarf ? 0.1 : 0.16 },
            uTrail: { value: dwarf ? 0.35 : 0.6 },
          },
          transparent: true,
          depthWrite: false,
        });
        const line = new THREE.Line(g, m);
        line.frustumCulled = false;
        scene.add(line);
        b.orbit = line;
        b.orbitMat = m;
      }
    }

    // Voyager: gestrichelte Linie von der Sonne (zeigt, wie weit draußen sie ist)
    const voyLineGeo = new THREE.BufferGeometry();
    voyLineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
    const voyLineMat = new THREE.LineDashedMaterial({ color: 0xffffff, transparent: true, opacity: 0.22, dashSize: 1, gapSize: 1 });
    const voyLine = new THREE.Line(voyLineGeo, voyLineMat);
    voyLine.frustumCulled = false;
    scene.add(voyLine);
    disposables.push(voyLineGeo, voyLineMat);

    // --- Kamera-Steuerung ---
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.rotateSpeed = 0.55;
    controls.panSpeed = 0.9;
    controls.zoomSpeed = 1; // Pinch 1:1 — der Inhalt folgt genau den Fingern
    controls.screenSpacePanning = true;
    controls.zoomToCursor = true;
    controls.minPolarAngle = 0.001;
    controls.maxPolarAngle = Math.PI - 0.001;
    controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
    // 2 Finger macht der eigene Handler unten (Pinch-Zoom + Verschieben +
    // Drehen gleichzeitig). Der eingebaute 2-Finger-Zoom von OrbitControls
    // mischt pageX/pageY mit clientX/Y — auf einer gescrollten Seite zoomte
    // er dadurch auf einen falschen Punkt und die Ansicht sprang wild herum
    // (Nutzer-Video 01.10.2026: "alles durcheinander mit Zoomen").
    controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: null };

    let width = 1;
    let height = 1;
    let real = scaleModeRef.current === "real";
    let defaultDist = 1;
    let followId: string | null = selectedRef.current;
    let flight: {
      id: string;
      t0: number;
      dur: number;
      fromTarget: THREE.Vector3;
      fromDist: number;
      toDist: number;
      dir: THREE.Vector3;
    } | null = null;
    let zoomGoal: { dist: number; x: number; y: number; center: boolean } | null = null;
    const lastFollow = new THREE.Vector3();

    function fitDistance(radius: number) {
      const vHalf = (camera.fov * DEG) / 2;
      const hHalf = Math.atan(Math.tan(vHalf) * Math.max(0.2, camera.aspect));
      return radius / Math.tan(Math.min(vHalf, hHalf));
    }
    function resetView() {
      // Neptun-Bahn (kompakt ≈ 22 Einheiten, echt 30 AE) passt ins Bild
      defaultDist = fitDistance(real ? 33 : 25) * 0.95;
      const el = 32 * DEG;
      controls.target.set(0, 0, 0);
      camera.position.set(0, -defaultDist * Math.cos(el), defaultDist * Math.sin(el));
      controls.maxDistance = real ? 1200 : 220;
      controls.update();
    }

    function setScale(m: ScaleMode) {
      const nextReal = m === "real";
      if (nextReal === real && bodies[0].orbit) return;
      real = nextReal;
      buildOrbits(real);
      flight = null;
      zoomGoal = null;
      resetView();
      updatePositions(jdRef.current);
      if (followId) {
        const b = byId.get(followId);
        if (b) {
          controls.target.copy(b.pos);
          camera.position.add(b.pos);
          lastFollow.copy(b.pos);
        }
      }
    }

    function updatePositions(jd: number) {
      for (const b of bodies) {
        if (b.data.id === "sun") {
          b.pos.set(0, 0, 0);
        } else {
          const p = bodyPosition(b.data.id, jd);
          if (p) toDisplay(p, real, b.pos);
        }
        b.group.position.copy(b.pos);
      }
    }

    function enlargeFactor() {
      if (real) return 1;
      // Kompakt: in der Gesamtansicht Planeten ×3 gegenüber der Sonne,
      // beim Reinzoomen bis 3× Zoom zurück auf das echte Verhältnis.
      const d = camera.position.distanceTo(controls.target);
      return Math.min(3, Math.max(1, (3 * d) / defaultDist));
    }

    function focus(id: string, close: boolean) {
      const b = byId.get(id);
      if (!b) return;
      // schon unterwegs dorthin (z. B. Doppelklick → danach kommt noch die Auswahl)
      if (flight && flight.id === id && !close) return;
      const curDist = camera.position.distanceTo(controls.target);
      let toDist = curDist;
      const r = baseRadius(b.data, real);
      if (close) toDist = Math.max(r * (b.data.id === "sun" ? 4 : 7), 1e-6);
      // sehr weit weg ausgewählt (z. B. Eris im echten Maßstab): nicht weiter rauszoomen
      const dir = camera.position.clone().sub(controls.target).normalize();
      flight = {
        id,
        t0: performance.now(),
        dur: close ? 1400 : 900,
        fromTarget: controls.target.clone(),
        fromDist: curDist,
        toDist,
        dir,
      };
      followId = id;
      zoomGoal = null;
    }

    function zoomBy(factor: number) {
      const base = zoomGoal ? zoomGoal.dist : camera.position.distanceTo(controls.target);
      zoomGoal = { dist: base / factor, x: width / 2, y: height / 2, center: true };
    }

    apiRef.current = {
      focus,
      zoomBy,
      setScale,
      unfollow: () => {
        followId = null;
      },
    };

    // Benutzer greift ein → laufenden Kameraflug abbrechen
    controls.addEventListener("start", () => {
      if (flight) {
        // Flug abbrechen; Mitfliegen ab jetzt relativ zur aktuellen Lage
        const fb = byId.get(flight.id);
        if (fb) lastFollow.copy(fb.pos);
        flight = null;
      }
      zoomGoal = null;
    });

    // --- Mausrad: eigener, weich animierter Zoom (statt der ruckartigen Stufen) ---
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      e.stopPropagation();
      let dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 16;
      else if (e.deltaMode === 2) dy *= 400;
      const k = e.ctrlKey ? 0.01 : 0.0016;
      const factor = Math.exp(Math.max(-150, Math.min(150, dy)) * k);
      const base = zoomGoal ? zoomGoal.dist : camera.position.distanceTo(controls.target);
      const rect = canvas!.getBoundingClientRect();
      zoomGoal = { dist: base * factor, x: e.clientX - rect.left, y: e.clientY - rect.top, center: false };
      if (flight) flight = null;
    }
    // Capture am Container: kommt vor dem Wheel-Handler von OrbitControls an
    container.addEventListener("wheel", onWheel, { passive: false, capture: true });

    // --- Klick / Doppelklick (Auswahl bzw. Hinfliegen) ---
    let down: { x: number; y: number; t: number; id: number } | null = null;
    let lastTap: { t: number; x: number; y: number } | null = null;
    let activePointers = 0;
    function onPointerDown(e: PointerEvent) {
      activePointers++;
      down = activePointers === 1 ? { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId } : null;
      canvas!.style.cursor = "grabbing";
    }
    function onPointerUp(e: PointerEvent) {
      activePointers = Math.max(0, activePointers - 1);
      if (activePointers === 0) canvas!.style.cursor = "grab";
      if (!down || down.id !== e.pointerId) return;
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      const dt = performance.now() - down.t;
      down = null;
      if (moved > 6 || dt > 500) return;
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const hit = pick(x, y);
      const now = performance.now();
      const isDouble = lastTap && now - lastTap.t < 330 && Math.hypot(lastTap.x - x, lastTap.y - y) < 30;
      lastTap = isDouble ? null : { t: now, x, y };
      if (isDouble) {
        if (hit) {
          focus(hit.data.id, true);
          if (selectedRef.current !== hit.data.id) onSelectRef.current?.(hit.data);
        } else {
          const base = camera.position.distanceTo(controls.target);
          zoomGoal = { dist: base / 2.5, x, y, center: false };
        }
        return;
      }
      if (hit) {
        if (selectedRef.current === hit.data.id) focus(hit.data.id, false); // erneut zentrieren
        else onSelectRef.current?.(hit.data);
      } else onSelectRef.current?.(null);
    }
    function onPointerCancel() {
      activePointers = Math.max(0, activePointers - 1);
      down = null;
    }
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerCancel);
    const onContext = (e: Event) => e.preventDefault();
    canvas.addEventListener("contextmenu", onContext);

    const projV = new THREE.Vector3();
    function project(p: THREE.Vector3): [number, number, boolean] {
      projV.copy(p).project(camera);
      return [(projV.x * 0.5 + 0.5) * width, (-projV.y * 0.5 + 0.5) * height, projV.z < 1 && projV.z > -1];
    }
    function pick(x: number, y: number): BodyObj | null {
      let best: BodyObj | null = null;
      let bestD = Infinity;
      let bestCam = Infinity;
      for (const b of bodies) {
        const [sx, sy, front] = project(b.pos);
        if (!front) continue;
        const d = Math.hypot(sx - x, sy - y);
        const hitR = Math.max(b.pxR, 5) + 9;
        if (d > hitR) continue;
        const camD = camera.position.distanceTo(b.pos);
        // vorne liegende Körper gewinnen, sonst der nächste zum Klickpunkt
        if (d < bestD - 2 || (Math.abs(d - bestD) <= 2 && camD < bestCam)) {
          best = b;
          bestD = d;
          bestCam = camD;
        }
      }
      return best;
    }

    // --- Tastatur wie in Spielen: WASD/Pfeile verschieben, Q/E drehen, R/F neigen, +/− zoomen ---
    const keys = new Set<string>();
    const KEYS = new Set(["w", "a", "s", "d", "q", "e", "r", "f", "+", "-", "=", "arrowup", "arrowdown", "arrowleft", "arrowright"]);
    function onKeyDown(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      const k = e.key.toLowerCase();
      if (!KEYS.has(k)) return;
      keys.add(k);
      e.preventDefault();
    }
    function onKeyUp(e: KeyboardEvent) {
      keys.delete(e.key.toLowerCase());
    }
    function clearKeys() {
      keys.clear();
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clearKeys);

    const tmp = new THREE.Vector3();
    const tmp2 = new THREE.Vector3();
    const offset = new THREE.Vector3();
    function orbitBy(dAz: number, dEl: number) {
      offset.copy(camera.position).sub(controls.target);
      const r = offset.length();
      let az = Math.atan2(offset.y, offset.x);
      let el = Math.asin(Math.max(-1, Math.min(1, offset.z / r)));
      az += dAz;
      el = Math.max(-1.56, Math.min(1.56, el + dEl));
      offset.set(Math.cos(el) * Math.cos(az), Math.cos(el) * Math.sin(az), Math.sin(el)).multiplyScalar(r);
      camera.position.copy(controls.target).add(offset);
    }
    function panPixels(dx: number, dy: number, keepFollow = false) {
      const dist = camera.position.distanceTo(controls.target);
      const perPx = (2 * dist * Math.tan((camera.fov * DEG) / 2)) / height;
      tmp.setFromMatrixColumn(camera.matrix, 0).multiplyScalar(-dx * perPx);
      tmp2.setFromMatrixColumn(camera.matrix, 1).multiplyScalar(dy * perPx);
      tmp.add(tmp2);
      controls.target.add(tmp);
      camera.position.add(tmp);
      if (!keepFollow) followId = null;
    }

    // --- 2 Finger (Handy): Pinch = Zoom auf die Fingermitte, gemeinsam
    // bewegen = verschieben, Finger drehen = Ansicht drehen ---
    const touchPts = new Map<number, { x: number; y: number }>();
    let pinch: { dist: number; cx: number; cy: number; ang: number } | null = null;
    function pinchState() {
      const [a, b] = Array.from(touchPts.values());
      return {
        dist: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)),
        cx: (a.x + b.x) / 2,
        cy: (a.y + b.y) / 2,
        ang: Math.atan2(b.y - a.y, b.x - a.x),
      };
    }
    function touchXY(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function onTouchDown(e: PointerEvent) {
      if (e.pointerType !== "touch") return;
      touchPts.set(e.pointerId, touchXY(e));
      if (touchPts.size === 2) {
        pinch = pinchState();
        flight = null;
        zoomGoal = null;
      }
    }
    function onTouchMove(e: PointerEvent) {
      if (e.pointerType !== "touch" || !touchPts.has(e.pointerId)) return;
      touchPts.set(e.pointerId, touchXY(e));
      if (touchPts.size !== 2 || !pinch) return;
      const st = pinchState();
      const followed = followId ? (byId.get(followId) ?? null) : null;
      // 1) verschieben (beim Mitfliegen erst ab deutlicher Bewegung beendet)
      if (!followed) panPixels(st.cx - pinch.cx, st.cy - pinch.cy, true);
      // 2) drehen um den Blickpunkt
      let dAng = st.ang - pinch.ang;
      if (dAng > Math.PI) dAng -= Math.PI * 2;
      if (dAng < -Math.PI) dAng += Math.PI * 2;
      if (Math.abs(dAng) > 0.002) orbitBy(dAng, 0);
      // 3) zoomen: Inhalt folgt genau den Fingern (1:1)
      const r = camera.position.distanceTo(controls.target);
      const newR = Math.min(controls.maxDistance, Math.max(minDistFor(followed), (r * pinch.dist) / st.dist));
      camera.updateMatrixWorld();
      dollyTo(newR, st.cx, st.cy, !!followed);
      pinch = st;
    }
    function onTouchUp(e: PointerEvent) {
      if (!touchPts.delete(e.pointerId)) return;
      if (touchPts.size < 2) pinch = null;
      if (touchPts.size === 2) pinch = pinchState();
    }
    canvas.addEventListener("pointerdown", onTouchDown);
    canvas.addEventListener("pointermove", onTouchMove);
    window.addEventListener("pointerup", onTouchUp);
    window.addEventListener("pointercancel", onTouchUp);
    function stepKeys(dt: number) {
      if (keys.size === 0) return;
      const p = 0.5 * dt;
      let dx = 0;
      let dy = 0;
      if (keys.has("w") || keys.has("arrowup")) dy += p;
      if (keys.has("s") || keys.has("arrowdown")) dy -= p;
      if (keys.has("a") || keys.has("arrowleft")) dx -= p;
      if (keys.has("d") || keys.has("arrowright")) dx += p;
      if (dx || dy) panPixels(dx, dy);
      const rot = 0.0013 * dt;
      if (keys.has("q")) orbitBy(-rot, 0);
      if (keys.has("e")) orbitBy(rot, 0);
      if (keys.has("r")) orbitBy(0, rot);
      if (keys.has("f")) orbitBy(0, -rot);
      if (keys.has("+") || keys.has("=") || keys.has("-")) {
        const f = Math.exp((keys.has("-") ? 1 : -1) * 0.0018 * dt);
        const d = camera.position.distanceTo(controls.target);
        zoomGoal = { dist: d * f, x: width / 2, y: height / 2, center: true };
      }
    }

    function minDistFor(followed: BodyObj | null) {
      if (followed) return followed.visR * (followed.data.id === "saturn" ? 3 : 2);
      return real ? 2e-6 : 1e-3;
    }

    const ray = new THREE.Vector3();
    const fwd = new THREE.Vector3();
    /** Kamera-Abstand auf newR setzen; der Punkt unter (x, y) bleibt stehen (bzw. die Mitte). */
    function dollyTo(newR: number, x: number, y: number, center: boolean) {
      const r = camera.position.distanceTo(controls.target);
      if (center) {
        // gerade auf den Blickpunkt zu (der verfolgte Körper bleibt in der Mitte)
        ray.copy(controls.target).sub(camera.position).normalize();
        camera.position.addScaledVector(ray, r - newR);
      } else {
        // auf den Mauszeiger zu: der Punkt unter dem Zeiger bleibt stehen
        ray.set((x / width) * 2 - 1, -(y / height) * 2 + 1, 0.5).unproject(camera).sub(camera.position).normalize();
        camera.getWorldDirection(fwd);
        const cosA = Math.max(0.2, ray.dot(fwd));
        camera.position.addScaledVector(ray, (r - newR) / cosA);
        controls.target.copy(camera.position).addScaledVector(fwd, newR);
      }
    }
    function stepZoom(dt: number) {
      const g = zoomGoal;
      if (!g) return;
      const followed = followId ? (byId.get(followId) ?? null) : null;
      const minD = minDistFor(followed);
      g.dist = Math.min(controls.maxDistance, Math.max(minD, g.dist));
      const r = camera.position.distanceTo(controls.target);
      const f = 1 - Math.exp(-dt / 85);
      const newR = r * Math.pow(g.dist / r, f);
      dollyTo(newR, g.x, g.y, !!followed || g.center);
      if (Math.abs(Math.log(g.dist / newR)) < 0.002) zoomGoal = null;
    }

    function resize() {
      const rect = container!.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      bgCamera.aspect = width / height;
      bgCamera.updateProjectionMatrix();
      const ldpr = Math.min(window.devicePixelRatio || 1, 2);
      labelCanvas!.width = Math.round(width * ldpr);
      labelCanvas!.height = Math.round(height * ldpr);
      lctx!.setTransform(ldpr, 0, 0, ldpr, 0, 0);
    }
    const ro = new ResizeObserver(() => resize());
    ro.observe(container);
    resize();

    buildOrbits(real);
    resetView();
    updatePositions(jdRef.current);
    if (followId) {
      const b = byId.get(followId);
      if (b) {
        controls.target.copy(b.pos);
        camera.position.add(b.pos);
      }
    }
    lastFollow.set(NaN, NaN, NaN);

    // --- Datumsanzeige ---
    let lastDateKey = "";
    let dateFmtLang = "";
    let dateFmt: Intl.DateTimeFormat | null = null;
    let dateTimeFmt: Intl.DateTimeFormat | null = null;

    // --- Render-Schleife ---
    let raf = 0;
    let last = performance.now();
    const sunView = new THREE.Vector3();
    const labelRects: [number, number, number, number][] = [];

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(100, now - last);
      last = now;

      // Zeit
      const speed = speedRef.current;
      const prevJd = jdRef.current;
      if (speed === LIVE) jdRef.current = dateToJd(new Date());
      else jdRef.current += (speed * dt) / 1000;
      const jd = jdRef.current;
      updatePositions(jd);

      // Eigenrotation: echt bei Live/langsam; bei schnellem Zeitraffer
      // gebremst (sonst nur noch Flimmern durch zu schnelles Drehen)
      const simDays = jd - prevJd;
      const visDays = Math.sign(simDays) * Math.min(Math.abs(simDays), (dt / 1000) * 0.25);
      for (const b of bodies) {
        const per = ROT_HOURS[b.data.id];
        if (per) b.spin += ((visDays * 24) / per) * Math.PI * 2;
        b.mesh.rotation.z = b.spin;
        if (b.clouds) b.clouds.rotation.z = visDays * 0.3 + b.clouds.rotation.z; // Wolken ziehen leicht mit
      }

      stepKeys(dt);

      // Kameraflug / Mitfliegen
      const followed = followId ? (byId.get(followId) ?? null) : null;
      if (flight) {
        const fb = byId.get(flight.id);
        if (!fb) flight = null;
        else {
          const tt = Math.min(1, (now - flight.t0) / flight.dur);
          const e = tt < 0.5 ? 4 * tt * tt * tt : 1 - Math.pow(-2 * tt + 2, 3) / 2;
          controls.target.lerpVectors(flight.fromTarget, fb.pos, e);
          const d = Math.exp(Math.log(flight.fromDist) + (Math.log(flight.toDist) - Math.log(flight.fromDist)) * e);
          camera.position.copy(controls.target).addScaledVector(flight.dir, d);
          if (tt >= 1) {
            flight = null;
            lastFollow.copy(fb.pos);
          }
        }
      } else if (followed) {
        if (Number.isFinite(lastFollow.x)) {
          tmp.copy(followed.pos).sub(lastFollow);
          controls.target.add(tmp);
          camera.position.add(tmp);
        } else {
          tmp.copy(followed.pos).sub(controls.target);
          controls.target.add(tmp);
          camera.position.add(tmp);
        }
        lastFollow.copy(followed.pos);
      } else {
        lastFollow.set(NaN, NaN, NaN);
      }

      stepZoom(dt);

      controls.minDistance = minDistFor(flight ? null : followed);
      controls.zoomToCursor = !followed; // beim Mitfliegen Pinch genau auf den Körper
      controls.update();

      // Deutlich verschoben (Rechtsklick/2 Finger/WASD) → Mitfliegen
      // beenden. Kleine Abweichungen (z. B. beim Pinchen) bleiben einfach
      // als Versatz bestehen, der Körper fliegt trotzdem mit.
      if (!flight && followed) {
        const dist = camera.position.distanceTo(controls.target);
        if (controls.target.distanceTo(followed.pos) > dist * 0.15) followId = null;
      }

      // Nicht in Planeten hineinfliegen
      for (const b of bodies) {
        const d = camera.position.distanceTo(b.pos);
        const minD = b.visR * 1.08;
        if (d < minD && b.visR > 0) {
          tmp.copy(camera.position).sub(b.pos).normalize();
          camera.position.copy(b.pos).addScaledVector(tmp, minD);
        }
      }

      // Clipping-Ebenen passend zum Abstand (riesiger Wertebereich: Erde
      // aus der Nähe bis Voyager in 170 AE)
      const camDist = camera.position.distanceTo(controls.target);
      let minSurf = camDist;
      for (const b of bodies) minSurf = Math.min(minSurf, Math.max(0, camera.position.distanceTo(b.pos) - b.visR));
      camera.near = Math.max(camDist * 1e-4, minSurf * 0.1);
      camera.far = camera.position.length() + (real ? 400 : 120);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();

      // Größen: echte Radien, aber mindestens ein paar Pixel groß
      const tanHalf = Math.tan((camera.fov * DEG) / 2);
      const enlarge = enlargeFactor();
      for (const b of bodies) {
        const dObj = Math.max(1e-12, camera.position.distanceTo(b.pos));
        const pxPerUnit = height / 2 / (dObj * tanHalf);
        const r = b.data.kind === "probe" ? 0 : baseRadius(b.data, real) * (b.data.id === "sun" ? 1 : enlarge);
        const px = r * pxPerUnit;
        const floored = px < b.minPx;
        b.visR = floored ? b.minPx / pxPerUnit : r;
        b.pxR = Math.max(px, b.minPx);
        b.mesh.scale.setScalar(b.visR);
        if (b.data.id === "haumea") b.mesh.scale.set(b.visR, b.visR * 0.73, b.visR * 0.44);
        if (b.atmo) {
          b.atmo.scale.setScalar(b.visR * (b.data.id === "earth" ? 1.035 : 1.025));
          b.atmo.visible = !floored && px > 6;
        }
        if (b.ring) b.ring.scale.setScalar(b.visR);
        if (b.data.id === "sun") {
          for (const c of b.group.children) {
            if (c instanceof THREE.Sprite) c.scale.setScalar(b.visR * (c.userData.glowScale as number));
          }
        }
        // winzige Punkte leicht selbstleuchtend, damit man sie findet
        const mat = b.materials[0];
        if (mat instanceof THREE.MeshStandardMaterial) mat.emissiveIntensity = floored ? 0.55 : 0;
      }

      // Bahnen: helle Spur hinter dem Planeten
      const sel = selectedRef.current;
      for (const b of bodies) {
        if (!b.orbitMat) continue;
        const E = eccentricAnomaly(b.data.id, jd);
        if (E !== null) b.orbitMat.uniforms.uPhase.value = (((E / (Math.PI * 2)) % 1) + 1) % 1;
        const dwarf = b.data.kind === "dwarf";
        b.orbitMat.uniforms.uBase.value = sel === b.data.id ? 0.35 : dwarf ? 0.09 : 0.15;
      }

      // Voyager-Linie
      const voy = byId.get("voyager1");
      if (voy) {
        const arr = voyLineGeo.attributes.position.array as Float32Array;
        arr[3] = voy.pos.x;
        arr[4] = voy.pos.y;
        arr[5] = voy.pos.z;
        voyLineGeo.attributes.position.needsUpdate = true;
        voyLine.computeLineDistances();
        const dash = Math.max(1e-6, camDist * 0.012);
        voyLineMat.dashSize = dash;
        voyLineMat.gapSize = dash * 1.3;
      }

      sunView.set(0, 0, 0).applyMatrix4(camera.matrixWorldInverse);
      atmoUniformSun.value.copy(sunView);

      // Rendern: erst Sterne (eigene Kamera, nur Blickrichtung), dann Szene
      bgCamera.quaternion.copy(camera.quaternion);
      bgCamera.fov = camera.fov;
      bgCamera.updateMatrixWorld();
      renderer.clear();
      renderer.render(bgScene, bgCamera);
      renderer.clearDepth();
      renderer.render(scene, camera);

      drawLabels(now);

      // Datum
      const dl = dateLabelRef.current;
      if (dl) {
        const lng = langRef.current;
        if (lng !== dateFmtLang || !dateFmt || !dateTimeFmt) {
          dateFmtLang = lng;
          dateFmt = new Intl.DateTimeFormat(lng, { year: "numeric", month: "short", day: "numeric" });
          dateTimeFmt = new Intl.DateTimeFormat(lng, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
          lastDateKey = "";
        }
        const live = speed === LIVE;
        const key = live ? Math.floor(jd * 86400).toString() : Math.floor(jd).toString();
        if (key !== lastDateKey) {
          lastDateKey = key;
          dl.textContent = (live ? dateTimeFmt : dateFmt).format(jdToDate(jd));
        }
      }
    }

    function drawLabels(now: number) {
      const ctx = lctx!;
      ctx.clearRect(0, 0, width, height);
      labelRects.length = 0;
      const sel = selectedRef.current;
      const small = width < 420;
      const order = [...bodies].sort((a, b) => rank(a) - rank(b));
      function rank(b: BodyObj) {
        if (b.data.id === sel) return 0;
        if (b.data.id === "sun") return 1;
        if (b.data.id === "earth") return 1.5;
        if (!b.data.kind || b.data.kind === "planet") return 2;
        if (b.data.kind === "probe") return 3;
        return 4;
      }
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      for (const b of order) {
        const [x, y, front] = project(b.pos);
        if (!front || x < -50 || y < -50 || x > width + 50 || y > height + 50) continue;
        const isSel = b.data.id === sel;
        if (isSel && b.pxR < Math.min(width, height) * 0.4) {
          const pulse = 0.5 + 0.5 * Math.sin(now / 320);
          ctx.beginPath();
          ctx.arc(x, y, b.pxR + 6 + pulse * 2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255,90,77,${0.55 + pulse * 0.35})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        const name = localize(b.data.name, langRef.current);
        const dwarf = b.data.kind === "dwarf";
        ctx.font = `${small ? 9 : 10}px var(--font-mono, ui-monospace, monospace)`;
        const tw = ctx.measureText(name).width;
        const ly = y - Math.min(b.pxR, height / 3) - (isSel ? 10 : 6);
        const rect: [number, number, number, number] = [x - tw / 2 - 3, ly - 12, x + tw / 2 + 3, ly + 1];
        if (!isSel && labelRects.some((r) => !(rect[2] < r[0] || rect[0] > r[2] || rect[3] < r[1] || rect[1] > r[3]))) continue;
        labelRects.push(rect);
        ctx.fillStyle = isSel ? "#ff5a4d" : dwarf ? "rgba(242,242,240,0.5)" : "rgba(242,242,240,0.82)";
        ctx.shadowColor = "rgba(0,0,0,0.9)";
        ctx.shadowBlur = 3;
        ctx.fillText(name, x, ly);
        ctx.shadowBlur = 0;
      }
    }

    // Nur für automatisierte Tests (Flag wird im Browser nie gesetzt)
    const dbgWin = window as unknown as { __SS3D_DEBUG?: boolean; __ss3d?: unknown };
    if (dbgWin.__SS3D_DEBUG) {
      dbgWin.__ss3d = {
        camera,
        controls,
        screen: (id: string) => {
          const b = byId.get(id);
          return b ? [...project(b.pos), b.pxR] : null;
        },
        follow: () => followId,
        info: (id: string) => {
          const b = byId.get(id);
          return b ? { visR: b.visR, dist: camera.position.distanceTo(b.pos), tdist: camera.position.distanceTo(controls.target), minD: controls.minDistance } : null;
        },
      };
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      container.removeEventListener("wheel", onWheel, { capture: true });
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerdown", onTouchDown);
      canvas.removeEventListener("pointermove", onTouchMove);
      window.removeEventListener("pointerup", onTouchUp);
      window.removeEventListener("pointercancel", onTouchUp);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
      canvas.removeEventListener("contextmenu", onContext);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clearKeys);
      controls.dispose();
      for (const b of bodies) {
        for (const m of b.materials) m.dispose();
        b.orbit?.geometry.dispose();
        b.orbitMat?.dispose();
      }
      for (const d of disposables) d.dispose();
      renderer.dispose();
      apiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className={`relative h-full w-full overflow-hidden bg-black ${className}`}>
      <canvas ref={glCanvasRef} className="absolute inset-0 h-full w-full cursor-grab touch-none" aria-label={t("solarSystemVisAria")} />
      <canvas ref={labelCanvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />
      {showDistances && (
        <div className="absolute inset-x-2 top-2 z-10 max-h-[55%] overflow-y-auto border border-border bg-background/90 p-3 backdrop-blur-sm sm:left-auto sm:right-3 sm:top-3 sm:w-[25rem]">
          <p className="label-mono text-[10px] uppercase text-accent">{t("solarDistances")}</p>
          <table className="mt-2 w-full border-collapse text-left text-[11px]">
            <thead>
              <tr className="label-mono text-[9px] uppercase text-muted">
                <th className="pb-1 pr-2 font-normal" />
                <th className="pb-1 pr-2 font-normal">{t("solarNow")}</th>
                <th className="pb-1 font-normal">{t("solarNextClosest")}</th>
              </tr>
            </thead>
            <tbody>
              {distanceRows.map((row) => (
                <tr
                  key={row.planet.id}
                  className={`cursor-pointer border-t border-border/60 align-top hover:bg-accent/10 ${
                    selectedId === row.planet.id ? "text-accent" : "text-foreground"
                  }`}
                  onClick={() => onSelectPlanet?.(row.planet)}
                >
                  <td className="py-1 pr-2">
                    <span className="mr-1.5 inline-block h-2 w-2 rounded-full" style={{ background: row.planet.color }} />
                    {localize(row.planet.name, lang)}
                  </td>
                  <td className="py-1 pr-2 tabular-nums">
                    {numFmt.format(row.nowKm / 1e6)} {t("solarMillionKm")}
                    <span className="block text-[9px] text-muted">
                      {lightFmt.format(row.nowKm / LIGHT_KM_PER_MIN)} {t("solarLightMinutes")}
                    </span>
                  </td>
                  <td className="py-1 tabular-nums">
                    {row.next ? (
                      <button
                        type="button"
                        title={t("solarJumpToDate")}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (row.next) jumpTo(row.next.jd, row.planet);
                        }}
                        className="text-left underline decoration-dotted underline-offset-2 hover:text-accent"
                      >
                        {shortDateFmt.format(jdToDate(row.next.jd))}
                        <span className="block text-[9px] text-muted no-underline">
                          {numFmt.format((row.next.au * KM_PER_AU) / 1e6)} {t("solarMillionKm")}
                        </span>
                      </button>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-[9px] text-muted">{t("solarDistanceNote")}</p>
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-2 p-2 sm:p-3">
        <div className="label-mono text-[10px] uppercase text-muted">
          <span ref={dateLabelRef} className="text-foreground" />
          <span className="block text-[9px] normal-case text-accent">
            {SPEEDS[speedIndex] === LIVE || SPEEDS[speedIndex] === 0 ? t("solarRealMotionLive") : t("solarRealMotionFast")}
          </span>
          <span className="block text-[9px] normal-case opacity-70">
            {scaleMode === "real" ? t("solarScaleRealNote") : t("solarScaleCompactNote")}
          </span>
        </div>
        <div className="pointer-events-auto flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => apiRef.current?.zoomBy(1 / 1.8)}
            aria-label="−"
            className="label-mono border border-border bg-background/80 whitespace-nowrap px-2 py-1 text-[10px] uppercase text-muted transition-colors hover:border-accent hover:text-accent"
          >
            −
          </button>
          <button
            type="button"
            onClick={() => apiRef.current?.zoomBy(1.8)}
            aria-label="+"
            className="label-mono border border-border bg-background/80 whitespace-nowrap px-2 py-1 text-[10px] uppercase text-muted transition-colors hover:border-accent hover:text-accent"
          >
            +
          </button>
          <input
            type="date"
            min="1900-01-01"
            max="2100-12-31"
            value={dateInput}
            aria-label={t("solarGoToDate")}
            title={t("solarGoToDate")}
            onChange={(e) => {
              setDateInput(e.target.value);
              const d = new Date(`${e.target.value}T12:00:00`);
              if (!Number.isNaN(d.getTime())) jumpTo(dateToJd(d));
            }}
            className="label-mono border border-border bg-background/80 px-2 py-1 text-[10px] uppercase text-muted [color-scheme:dark] hover:border-accent focus:border-accent focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setSpeedIndex((i) => (i + 1) % SPEEDS.length)}
            className="label-mono border border-border bg-background/80 whitespace-nowrap px-2 py-1 text-[10px] uppercase text-muted transition-colors hover:border-accent hover:text-accent"
          >
            {SPEEDS[speedIndex] === 0
              ? "❚❚"
              : SPEEDS[speedIndex] === LIVE
                ? `● ${t("solarLive")}`
                : `${SPEEDS[speedIndex]} ${t("solarDaysPerSecond")}`}
          </button>
          <button
            type="button"
            onClick={() => setShowDistances((v) => !v)}
            aria-pressed={showDistances}
            className={`label-mono border whitespace-nowrap px-2 py-1 text-[10px] uppercase transition-colors ${
              showDistances
                ? "border-accent bg-accent/15 text-accent"
                : "border-border bg-background/80 text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {t("solarDistances")}
          </button>
          <button
            type="button"
            onClick={() => setScaleMode((m) => (m === "real" ? "compact" : "real"))}
            aria-pressed={scaleMode === "real"}
            className={`label-mono border whitespace-nowrap px-2 py-1 text-[10px] uppercase transition-colors ${
              scaleMode === "real"
                ? "border-accent bg-accent/15 text-accent"
                : "border-border bg-background/80 text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {scaleMode === "real" ? t("solarScaleCompact") : t("solarScaleReal")}
          </button>
        </div>
      </div>
    </div>
  );
}
