import * as THREE from "three";

/**
 * Schwarzes Loch im Stil von "Gargantua" aus Interstellar (Nutzerwunsch
 * 27.09.2026: "diese Galaxie im Hintergrund durch ein schwarzes Loch
 * ersetzen … realistisch wie in Interstellar").
 *
 * Kein Bild, sondern echte Lichtstrahl-Verfolgung im Shader: Für jeden
 * Bildpunkt wird ein Lichtstrahl von einer virtuellen Kamera aus rückwärts
 * verfolgt und von der Schwerkraft gekrümmt (Schwarzschild-Metrik,
 * Näherung a = −1,5 · h² · r⃗ / r⁵ mit Schwarzschild-Radius 1). Dadurch
 * entstehen automatisch die typischen Effekte:
 *   - der schwarze Schatten (Strahlen, die ins Loch fallen),
 *   - der helle Bogen über und unter dem Loch — das ist die Rückseite der
 *     Akkretionsscheibe, deren Licht um das Loch herumgebogen wird,
 *   - ein dünner Photonenring am Rand des Schattens.
 * Die Scheibe dreht sich (innen schneller als außen, Kepler) und ist auf
 * der auf uns zukommenden Seite etwas heller (Doppler-Effekt, bewusst
 * mild wie im Film).
 *
 * Wird als Billboard-Fläche in die bestehende 3D-Szene gesetzt; der Rest
 * der Szene (Partikel, Linien, Sternenstaub) bleibt unverändert.
 */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uIncl;   // Blickwinkel über der Scheibe (Radiant)
  uniform float uYaw;    // leichte seitliche Drehung (Parallaxe)

  const float R_IN = 3.0;    // innerste stabile Umlaufbahn (3 Schwarzschild-Radien)
  const float R_OUT = 11.0;  // Außenrand der Scheibe
  const float CAM_DIST = 26.0;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }

  // Scheibenstruktur an Radius r und (mitgedrehtem) Winkel a:
  // x = großflächige Gas-Wolken, y = feine, entlang der Umlaufbahn
  // gestreckte Filamente. Über cos/sin nahtlos (keine Kante bei ±π).
  vec2 diskTex(float r, float a, float seed) {
    vec2 q = vec2(cos(a), sin(a));
    float clumps = fbm(q * 3.2 + vec2(r * 1.1 + seed, -r * 0.5));
    float fil = fbm(vec2(r * 8.0 + seed, 0.0) + q * 4.5);
    return vec2(clumps, fil);
  }

  // Farbe + Deckkraft der Scheibe an einem Treffpunkt
  vec4 diskSample(vec3 hit, vec3 rayDir) {
    float r = length(hit.xz);
    if (r < R_IN || r > R_OUT) return vec4(0.0);
    float t = (r - R_IN) / (R_OUT - R_IN);

    // Kepler-Rotation: innen schneller als außen (deutlich sichtbar).
    // Damit sich die Struktur durch die ungleiche Drehung nicht über die
    // Zeit zu feinen Ringen "aufwickelt", laufen zwei Muster-Schichten mit
    // versetzter Zeit und werden weich überblendet (Flow-Map-Technik).
    float ang = atan(hit.z, hit.x);
    float omega = 2.0 / pow(r, 1.5); // innen ~1 Umdrehung / 8 s
    const float PERIOD = 16.0;
    float ph0 = fract(uTime / PERIOD);
    float ph1 = fract(uTime / PERIOD + 0.5);
    float w0 = 1.0 - abs(2.0 * ph0 - 1.0);
    float w1 = 1.0 - w0;
    vec2 layer0 = diskTex(r, ang + omega * ph0 * PERIOD, 0.0);
    vec2 layer1 = diskTex(r, ang + omega * ph1 * PERIOD, 17.3);
    vec2 tex = layer0 * w0 + layer1 * w1;
    float n = tex.x;
    float streaks = 0.55 + 0.45 * tex.y;

    // Temperaturverlauf: innen hell-rosé, dann Akzentrot (#ff5a4d), außen tiefrot
    vec3 hot = vec3(1.0, 0.8, 0.7);
    vec3 warm = vec3(1.0, 0.36, 0.26);
    vec3 cool = vec3(0.55, 0.06, 0.05);
    vec3 col = mix(hot, warm, smoothstep(0.0, 0.35, t));
    col = mix(col, cool, smoothstep(0.35, 1.0, t));
    float intensity = (3.2 * pow(1.0 - t, 1.8) + 0.2) * (0.55 + 0.8 * n) * streaks;

    // Doppler-Aufhellung der auf uns zukommenden Seite (mild)
    vec3 orbitDir = normalize(vec3(-sin(ang), 0.0, cos(ang)));
    float beta = sqrt(0.5 / r) * 0.75;
    float g = 1.0 / (1.0 + beta * dot(orbitDir, rayDir));
    intensity *= pow(g, 2.2);

    float edge = smoothstep(R_IN, R_IN + 0.5, r) * (1.0 - smoothstep(R_OUT - 3.5, R_OUT, r));
    // Dichtes Gas ist undurchsichtig: innen voll deckend, erst der äußere
    // Rand wird dünner und franst wolkig aus
    float thin = smoothstep(0.55, 1.0, t);
    float alpha = clamp(edge * mix(1.0, 0.35 + 0.65 * n, thin), 0.0, 1.0);
    return vec4(col * intensity, alpha);
  }

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;

    // virtuelle Kamera, leicht über der Scheibenebene
    vec3 camPos = vec3(sin(uYaw) * cos(uIncl), sin(uIncl), -cos(uYaw) * cos(uIncl)) * CAM_DIST;
    vec3 fwd = normalize(-camPos);
    vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), fwd));
    vec3 up = cross(fwd, right);
    vec3 dir = normalize(fwd + (p.x * right + p.y * up) * 0.56);

    vec3 pos = camPos;
    vec3 vel = dir;
    float h2 = dot(cross(pos, vel), cross(pos, vel));

    vec3 color = vec3(0.0);
    float alpha = 0.0;
    float minR = 1e9;
    bool captured = false;

    for (int i = 0; i < 140; i++) {
      float r2 = dot(pos, pos);
      float r = sqrt(r2);
      minR = min(minR, r);
      if (r < 1.0) { captured = true; break; }
      if (r > CAM_DIST + 6.0 && dot(pos, vel) > 0.0) break;

      // Schrittweite: nah am Loch fein, weit weg grob
      float dt = clamp(0.06 * r, 0.03, 1.2);
      vec3 acc = -1.5 * h2 * pos / pow(r2, 2.5);
      vec3 nextVel = vel + acc * dt;
      vec3 nextPos = pos + nextVel * dt;

      // Durchgang durch die Scheibenebene (y = 0)?
      if (pos.y * nextPos.y < 0.0) {
        float k = pos.y / (pos.y - nextPos.y);
        vec3 hit = mix(pos, nextPos, k);
        vec4 d = diskSample(hit, normalize(nextVel));
        color += (1.0 - alpha) * d.rgb * d.a;
        alpha += (1.0 - alpha) * d.a;
        if (alpha > 0.98) break;
      }
      pos = nextPos;
      vel = nextVel;
    }

    // Photonenring / Glühen am Rand des Schattens
    // (nur für Strahlen, die knapp am Loch vorbeigehen — der Schatten selbst bleibt schwarz)
    float glow = captured ? 0.0 : exp(-max(minR - 1.5, 0.0) * 3.0) * 0.9;
    color += (1.0 - alpha) * vec3(1.0, 0.58, 0.48) * glow;
    // schwacher roter Lichthof um das ganze Loch (wie Streulicht der Scheibe)
    float halo = captured ? 0.0 : exp(-max(minR - 2.0, 0.0) * 0.45) * 0.12;
    color += (1.0 - alpha) * vec3(1.0, 0.3, 0.22) * halo;
    glow += halo;
    float outAlpha = alpha + (1.0 - alpha) * clamp(glow, 0.0, 1.0);
    if (captured) outAlpha = 1.0; // Schatten: deckend schwarz

    // weicher Rand der Fläche, damit kein Quadrat sichtbar ist
    float fade = 1.0 - smoothstep(0.78, 1.0, max(abs(p.x), abs(p.y)));
    color *= fade;
    outAlpha *= fade;

    // filmische Tonwertkurve
    color = vec3(1.0) - exp(-color * 1.25);
    gl_FragColor = vec4(color, outAlpha); // vormultipliert
  }
`;

export interface BlackHole {
  mesh: THREE.Mesh;
  /** pro Bild aufrufen: Zeit in Sekunden, Kamera für Billboard + Parallaxe */
  update: (timeSeconds: number, camera: THREE.Camera) => void;
  dispose: () => void;
}

export function createBlackHole(size: number): BlackHole {
  const geometry = new THREE.PlaneGeometry(size, size);
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uIncl: { value: 0.12 },
      uYaw: { value: 0 },
    },
    transparent: true,
    premultipliedAlpha: true,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = 1; // nach den Partikeln zeichnen → Schatten verdeckt, was dahinter liegt

  const camDir = new THREE.Vector3();
  function update(timeSeconds: number, camera: THREE.Camera) {
    material.uniforms.uTime.value = timeSeconds;
    // Billboard: Fläche immer zur Kamera ausrichten
    mesh.quaternion.copy(camera.quaternion);
    // Parallaxe: Blickwinkel folgt leicht der Kameraposition
    camDir.copy(camera.position).sub(mesh.position).normalize();
    material.uniforms.uIncl.value = 0.12 + camDir.y * 0.35;
    material.uniforms.uYaw.value = camDir.x * 0.4;
  }

  function dispose() {
    geometry.dispose();
    material.dispose();
  }

  return { mesh, update, dispose };
}
