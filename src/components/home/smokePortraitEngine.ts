/**
 * Animations-Logik für SmokePortrait (ohne React, damit sie einzeln
 * testbar ist). Gibt eine Aufräum-Funktion zurück.
 *
 * Zwei Ebenen:
 *  1. WebGL-Fließen: Das Bild selbst "strömt". Haar- und Lichtfäden werden
 *     per Flow-Map-Technik laufend nach hinten (links, weg vom Gesicht)
 *     verschoben — zwei zeitversetzte, verschobene Kopien des Bildes werden
 *     weich überblendet, dadurch sieht es aus wie eine endlose Strömung ohne
 *     Sprung. Das Gesicht (rechts) bleibt ruhig und scharf; je weiter nach
 *     hinten, desto stärker fließt es. Eine Rauschtextur lässt die Strömung
 *     leicht wabern wie Rauch.
 *  2. 2D-Partikel: Funken lösen sich aus hellen Bildpunkten, fliegen mit
 *     kurzer Leuchtspur nach hinten, verwirbeln und verglühen; dazu weiche
 *     rötliche Rauchschwaden.
 *
 * Ohne WebGL läuft nur Ebene 2 über dem Standbild.
 */
interface Emitter {
  x: number; // 0..1 im Bild
  y: number;
  r: number;
  g: number;
  b: number;
}

interface Particle {
  x: number; // Pixel im Canvas
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
  r: number;
  g: number;
  b: number;
  smoke: boolean;
  seed: number;
}

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;      // Canvasgröße in Pixeln
uniform vec4 uRect;     // Bildrechteck im Canvas: x, y, Breite, Höhe (0..1, y von oben)
uniform float uTime;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) { float v = 0.0; float a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; } return v; }

void main() {
  vec2 s = gl_FragCoord.xy / uRes;
  s.y = 1.0 - s.y;
  vec2 uv = (s - uRect.xy) / uRect.zw; // Bildkoordinaten (0..1, y nach unten)

  // Stärke: Gesicht rechts ruhig, nach hinten (links) immer stärker
  float m = smoothstep(0.80, 0.25, uv.x);

  // Strömungsrichtung: nach links, oben leicht nach oben, unten leicht nach unten,
  // dazu Rauch-Wabern aus Rauschen
  float n = fbm(uv * vec2(3.0, 5.0) + vec2(uTime * 0.07, uTime * 0.03));
  vec2 dir = vec2(1.0, (0.45 - uv.y) * -0.7 + (n - 0.5) * 1.4);

  const float PERIOD = 3.2;
  float ph0 = fract(uTime / PERIOD);
  float ph1 = fract(uTime / PERIOD + 0.5);
  float w0 = 1.0 - abs(2.0 * ph0 - 1.0);
  float strength = 0.045 * m;
  // Weiter rechts im Bild abtasten = Inhalt wandert nach links
  vec3 c0 = texture2D(uTex, uv + dir * ph0 * strength).rgb;
  vec3 c1 = texture2D(uTex, uv + dir * ph1 * strength).rgb;
  vec3 col = c0 * w0 + c1 * (1.0 - w0);

  // leichtes Glimmen, das durch die Fäden wandert
  float glow = fbm(uv * vec2(4.0, 7.0) + vec2(uTime * 0.25, 0.0));
  col *= 1.0 + m * (glow - 0.45) * 0.35;

  // außerhalb des Bildes schwarz
  float inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
  gl_FragColor = vec4(col * inside, 1.0);
}
`;

function makeGL(canvas: HTMLCanvasElement, img: HTMLImageElement) {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: false, antialias: false, alpha: false });
  if (!gl) return null;
  const compile = (type: number, srcCode: string) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, srcCode);
    gl.compileShader(sh);
    return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);

  const uRes = gl.getUniformLocation(prog, "uRes");
  const uRect = gl.getUniformLocation(prog, "uRect");
  const uTime = gl.getUniformLocation(prog, "uTime");

  return {
    draw(w: number, h: number, rect: [number, number, number, number], t: number) {
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
      gl.uniform4f(uRect, rect[0], rect[1], rect[2], rect[3]);
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    dispose() {
      gl.deleteTexture(tex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    },
  };
}

export function startSmokePortrait(
  wrap: HTMLElement,
  glCanvas: HTMLCanvasElement,
  canvas: HTMLCanvasElement,
  src: string,
  focusX: number,
  focusY: number,
  onGLReady?: () => void
): () => void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let disposed = false;
  let raf = 0;
  let visible = true;
  let emitters: Emitter[] = [];
  let imgW = 1;
  let imgH = 1;
  const particles: Particle[] = [];
  let glLayer: ReturnType<typeof makeGL> = null;
  let glShown = false;

  // Canvas-Größe + object-cover-Abbildung (identisch zum <img>)
  let W = 0;
  let H = 0;
  let dpr = 1;
  let scale = 1;
  let offX = 0;
  let offY = 0;
  function resize() {
    const rect = wrap.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, rect.width);
    H = Math.max(1, rect.height);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    glCanvas.width = canvas.width;
    glCanvas.height = canvas.height;
    scale = Math.max(W / imgW, H / imgH);
    offX = (W - imgW * scale) * focusX;
    offY = (H - imgH * scale) * focusY;
  }

  // Weicher, leicht rötlicher Leucht-/Rauch-Sprite
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = 64;
  const sctx = sprite.getContext("2d")!;
  const grad = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,200,190,1)");
  grad.addColorStop(0.4, "rgba(255,140,125,0.35)");
  grad.addColorStop(1, "rgba(255,90,77,0)");
  sctx.fillStyle = grad;
  sctx.fillRect(0, 0, 64, 64);

  function spawn(smoke: boolean): Particle | null {
    if (emitters.length === 0) return null;
    const e = emitters[(Math.random() * emitters.length) | 0];
    const px = offX + e.x * imgW * scale;
    const py = offY + e.y * imgH * scale;
    if (px < -20 || px > W + 20 || py < -20 || py > H + 20) return null;
    const unit = Math.min(W, H) / 400; // Tempo passend zur Boxgröße
    // "nach hinten": nach links; oben leicht nach oben, unten leicht nach unten
    const spread = (e.y - 0.45) * 0.9;
    const speed = (smoke ? 14 + Math.random() * 18 : 26 + Math.random() * 44) * unit;
    return {
      x: px,
      y: py,
      vx: -speed,
      vy: speed * (spread + (Math.random() - 0.5) * 0.5),
      age: 0,
      life: smoke ? 4 + Math.random() * 3.5 : 2.2 + Math.random() * 3,
      size: smoke ? (9 + Math.random() * 14) * unit : (0.7 + Math.random() * 1.5) * Math.max(unit, 0.8),
      r: e.r,
      g: e.g,
      b: e.b,
      smoke,
      seed: Math.random() * 1000,
    };
  }

  const isSmall = () => W < 500;
  const start = performance.now();
  let last = start;
  let spawnAccP = 0;
  let spawnAccS = 0;

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!visible) return;
    const t = (now - start) / 1000;

    if (glLayer) {
      const dw = imgW * scale;
      const dh = imgH * scale;
      glLayer.draw(glCanvas.width, glCanvas.height, [offX / W, offY / H, dw / W, dh / H], t);
      if (!glShown) {
        // erst nach dem ersten gezeichneten Bild umschalten → kein schwarzes Aufblitzen
        glShown = true;
        onGLReady?.();
      }
    }

    // Nachschub: feine Funken + weiche Rauchschwaden
    const maxP = isSmall() ? 320 : 600;
    const maxS = isSmall() ? 40 : 70;
    spawnAccP += dt * (isSmall() ? 100 : 180);
    spawnAccS += dt * (isSmall() ? 8 : 13);
    let nP = 0;
    let nS = 0;
    for (const p of particles) {
      if (p.smoke) nS++;
      else nP++;
    }
    while (spawnAccP >= 1) {
      spawnAccP -= 1;
      if (nP < maxP) {
        const p = spawn(false);
        if (p) {
          particles.push(p);
          nP++;
        }
      }
    }
    while (spawnAccS >= 1) {
      spawnAccS -= 1;
      if (nS < maxS) {
        const p = spawn(true);
        if (p) {
          particles.push(p);
          nS++;
        }
      }
    }

    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.clearRect(0, 0, W, H);
    ctx!.globalCompositeOperation = "lighter";

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.age += dt;
      if (p.age >= p.life) {
        particles.splice(i, 1);
        continue;
      }
      // Verwirbelung wie Rauch: sanfte, ortsabhängige Seitwärtsbewegung
      const swirl = Math.sin(p.y * 0.035 + t * 1.3 + p.seed) + Math.cos(p.x * 0.028 - t * 0.9 + p.seed * 0.5);
      p.vy += swirl * (p.smoke ? 6 : 10) * dt;
      p.vx *= 1 - 0.15 * dt; // langsam abbremsen
      p.vy *= 1 - 0.4 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      const k = p.age / p.life;
      // schnell einblenden, lang ausklingen
      const fade = Math.min(1, k * 6) * Math.pow(1 - k, 1.6);
      if (p.smoke) {
        const s = p.size * (1 + k * 2.5); // Rauch dehnt sich aus
        ctx!.globalAlpha = fade * 0.14;
        ctx!.drawImage(sprite, p.x - s, p.y - s, s * 2, s * 2);
      } else {
        const col = "rgb(" + p.r + "," + p.g + "," + p.b + ")";
        const w = p.size * (1 - k * 0.5);
        // kurze Leuchtspur entgegen der Flugrichtung → man sieht die Bewegung
        ctx!.globalAlpha = fade * 0.55;
        ctx!.strokeStyle = col;
        ctx!.lineWidth = w;
        ctx!.lineCap = "round";
        ctx!.beginPath();
        ctx!.moveTo(p.x, p.y);
        ctx!.lineTo(p.x - p.vx * 0.07, p.y - p.vy * 0.07);
        ctx!.stroke();
        // heller Kopf mit weichem Schein
        ctx!.globalAlpha = fade;
        ctx!.fillStyle = col;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, w, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.globalAlpha = fade * 0.18;
        ctx!.drawImage(sprite, p.x - w * 5, p.y - w * 5, w * 10, w * 10);
      }
    }
    ctx!.globalAlpha = 1;
    ctx!.globalCompositeOperation = "source-over";
  }

  // Bild laden: Textur für WebGL + helle Bildpunkte als Partikel-Startpunkte
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  img.onload = () => {
    if (disposed) return;
    imgW = img.naturalWidth;
    imgH = img.naturalHeight;
    const sw = 180;
    const sh = Math.round((sw * imgH) / imgW);
    const off = document.createElement("canvas");
    off.width = sw;
    off.height = sh;
    const octx = off.getContext("2d");
    if (octx) {
      octx.drawImage(img, 0, 0, sw, sh);
      try {
        const data = octx.getImageData(0, 0, sw, sh).data;
        const list: Emitter[] = [];
        for (let y = 0; y < sh; y++) {
          for (let x = 0; x < sw; x++) {
            const i = (y * sw + x) * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // helle Fäden (rot oder weiß); das Gesicht (rechts) seltener,
            // damit die meisten Funken aus Haar und Körper kommen
            if (Math.max(r, g, b) > 130 && 0.3 * r + 0.59 * g + 0.11 * b > 55) {
              if (x / sw > 0.72 && Math.random() < 0.7) continue;
              list.push({
                x: (x + Math.random()) / sw,
                y: (y + Math.random()) / sh,
                r: Math.min(255, r + 40),
                g: Math.min(255, g + 30),
                b: Math.min(255, b + 30),
              });
            }
          }
        }
        emitters = list;
      } catch {
        // gleiche Domain → sollte nie passieren; dann eben ohne Funken
      }
    }
    resize();
    glLayer = makeGL(glCanvas, img);
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  const ro = new ResizeObserver(() => resize());
  ro.observe(wrap);
  const io = new IntersectionObserver(
    (entries) => {
      visible = entries[0]?.isIntersecting ?? true;
    },
    { rootMargin: "100px" }
  );
  io.observe(wrap);

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    glLayer?.dispose();
  };
}
