/**
 * Effekte für den Größenvergleich (Nutzerwunsch 14.10.2026: realistischer und
 * lebendig): drehende Kugeln (Planeten, Monde, Sterne) mit Atmosphäre und
 * Wolken, Sternoberflächen mit Granulation/Sonnenflecken und
 * Schwarze Löcher mit rotierender Akkretionsscheibe, Gravitationslinse und
 * Doppler-Effekt. Alles wird selbst berechnet, keine zusätzlichen Bilder.
 */

export const ANIM = { t: 0, D: 1, reduce: false };

/* ---------- Rauschen ---------- */

function hash3(x: number, y: number, z: number): number {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(z, 2147483629)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function vnoise3(x: number, y: number, z: number): number {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  let fx = x - xi, fy = y - yi, fz = z - zi;
  fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy); fz = fz * fz * (3 - 2 * fz);
  const a = hash3(xi, yi, zi), b = hash3(xi + 1, yi, zi), c = hash3(xi, yi + 1, zi), d = hash3(xi + 1, yi + 1, zi);
  const e = hash3(xi, yi, zi + 1), f = hash3(xi + 1, yi, zi + 1), g = hash3(xi, yi + 1, zi + 1), h = hash3(xi + 1, yi + 1, zi + 1);
  const x1 = a + (b - a) * fx, x2 = c + (d - c) * fx, x3 = e + (f - e) * fx, x4 = g + (h - g) * fx;
  const y1 = x1 + (x2 - x1) * fy, y2 = x3 + (x4 - x3) * fy;
  return y1 + (y2 - y1) * fz;
}

function fbm3(x: number, y: number, z: number, oct: number): number {
  let sum = 0, amp = 0.5, f = 1, norm = 0;
  for (let i = 0; i < oct; i++) {
    sum += amp * vnoise3(x * f, y * f, z * f);
    norm += amp; amp *= 0.5; f *= 2.03;
  }
  return sum / norm;
}

/** 2D-Rauschen, in x periodisch (für Ringe: Winkel läuft rund). */
function vnoise2p(x: number, y: number, period: number): number {
  const xi = Math.floor(x), yi = Math.floor(y);
  let fx = x - xi, fy = y - yi;
  fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
  const w = (n: number) => ((n % period) + period) % period;
  const a = hash3(w(xi), yi, 7), b = hash3(w(xi + 1), yi, 7), c = hash3(w(xi), yi + 1, 7), d = hash3(w(xi + 1), yi + 1, 7);
  const x1 = a + (b - a) * fx, x2 = c + (d - c) * fx;
  return x1 + (x2 - x1) * fy;
}

function hexRgb(h: string): [number, number, number] {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/* ---------- Sternoberflächen ---------- */

export interface StarLook { cells: number; gain: number; big: number; spots: number; white: number; limb: [number, number, number] }

export function starLook(id: string): StarLook {
  switch (id) {
    case "sun": return { cells: 34, gain: 0.2, big: 0.08, spots: 5, white: 0.45, limb: [0.42, 0.62, 0.85] };
    case "proxima": return { cells: 16, gain: 0.3, big: 0.2, spots: 3, white: 0.15, limb: [0.35, 0.5, 0.7] };
    case "sirius":
    case "rigel": return { cells: 14, gain: 0.06, big: 0.04, spots: 0, white: 0.6, limb: [0.28, 0.33, 0.4] };
    case "arcturus": return { cells: 8, gain: 0.3, big: 0.28, spots: 0, white: 0.2, limb: [0.38, 0.55, 0.75] };
    case "betelgeuse":
    case "uyscuti":
    case "st218": return { cells: 2.6, gain: 0.55, big: 0.3, spots: 0, white: 0.1, limb: [0.32, 0.5, 0.7] };
    default: return { cells: 14, gain: 0.2, big: 0.1, spots: 0, white: 0.3, limb: [0.42, 0.62, 0.85] };
  }
}

export interface Tex { data: Uint8ClampedArray; tw: number; th: number }

export function makeStarTex(color: string, look: StarLook, seed: number): Tex {
  const tw = 512, th = 256, data = new Uint8ClampedArray(tw * th * 4);
  const [cr, cg, cb] = hexRgb(color);
  const br = cr + (255 - cr) * look.white, bg = cg + (255 - cg) * look.white, bb = cb + (255 - cb) * look.white;
  // Sonnenflecken: feste, zufällige Stellen
  const spots: { x: number; y: number; z: number; r: number }[] = [];
  let s = (seed * 7919) >>> 0;
  const rnd = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  for (let i = 0; i < look.spots; i++) {
    const lat = (6 + rnd() * 22) * (rnd() < 0.5 ? -1 : 1) * (Math.PI / 180), lon = rnd() * Math.PI * 2;
    spots.push({ x: Math.cos(lat) * Math.cos(lon), y: Math.sin(lat), z: Math.cos(lat) * Math.sin(lon), r: 0.035 + rnd() * 0.05 });
  }
  const o1 = seed * 13.1, o2 = seed * 5.7;
  for (let v = 0; v < th; v++) {
    const lat = (0.5 - (v + 0.5) / th) * Math.PI, cl = Math.cos(lat), sl = Math.sin(lat);
    for (let u = 0; u < tw; u++) {
      const lon = ((u + 0.5) / tw) * Math.PI * 2;
      const x = cl * Math.cos(lon), y = sl, z = cl * Math.sin(lon);
      const n1 = fbm3(x * look.cells + o1, y * look.cells, z * look.cells, 3);
      const n2 = fbm3(x * look.cells * 0.28 + o2, y * look.cells * 0.28, z * look.cells * 0.28, 2);
      let val = 0.95 + look.gain * (n1 * 1.8 - 0.9) + look.big * (n2 - 0.5) * 1.6;
      for (const sp of spots) {
        const dd = Math.acos(Math.max(-1, Math.min(1, x * sp.x + y * sp.y + z * sp.z)));
        if (dd < sp.r) val *= dd < sp.r * 0.5 ? 0.3 : 0.3 + 0.6 * ((dd - sp.r * 0.5) / (sp.r * 0.5));
        else if (dd < sp.r * 1.5) val *= 1 + 0.12 * (1 - (dd - sp.r) / (sp.r * 0.5)); // Fackeln
      }
      val = Math.max(0.3, Math.min(1.3, val));
      const k = (v * tw + u) * 4;
      data[k] = br * val; data[k + 1] = bg * val; data[k + 2] = bb * val; data[k + 3] = 255;
    }
  }
  return { data, tw, th };
}

export function texFromCanvas(c: CanvasImageSource, tw = 1024, th = 512): Tex {
  const cv = document.createElement("canvas");
  cv.width = tw; cv.height = th;
  const g = cv.getContext("2d")!;
  g.drawImage(c, 0, 0, tw, th);
  return { data: g.getImageData(0, 0, tw, th).data, tw, th };
}

/* ---------- Drehende Kugel ---------- */

export interface RotOpts {
  star?: boolean;
  limb?: [number, number, number];
  speed: number; // rad/s
  tilt?: number;
  atmo?: [number, number, number, number];
  clouds?: Tex;
  pluto?: boolean;
}

export interface Rot {
  S: number;
  lutU: Float32Array;
  lutV: Float32Array;
  sh: Float32Array;
  zl: Float32Array;
  rim: Float32Array;
  edge: Uint8ClampedArray;
  tex: Uint8ClampedArray;
  tw: number;
  th: number;
  clouds: Uint8ClampedArray | null;
  cw: number;
  ch: number;
  speed: number;
  star: boolean;
  limb: [number, number, number];
  atmo: [number, number, number, number] | null;
  pluto: boolean;
  cv: Map<number, { c: HTMLCanvasElement; g: CanvasRenderingContext2D; img: ImageData }>;
}

export function buildRot(tex: Tex, o: RotOpts): Rot {
  const S = 288, n = S * S;
  const lutU = new Float32Array(n), lutV = new Float32Array(n), sh = new Float32Array(n), zl = new Float32Array(n), rim = new Float32Array(n), edge = new Uint8ClampedArray(n);
  const tilt = o.tilt ?? 0.22, ct = Math.cos(tilt), st = Math.sin(tilt);
  const L = [-0.55, 0.45, 0.7], ll = Math.hypot(L[0], L[1], L[2]);
  const am = o.atmo;
  for (let y = 0; y < S; y++) {
    const ny = 1 - ((y + 0.5) / S) * 2;
    for (let x = 0; x < S; x++) {
      const nx = ((x + 0.5) / S) * 2 - 1, r2 = nx * nx + ny * ny, i = y * S + x;
      if (r2 > 1) continue;
      const z = Math.sqrt(1 - r2);
      const lat = Math.asin(Math.max(-1, Math.min(1, ny * ct + z * st)));
      const lon = Math.atan2(nx, z * ct - ny * st);
      lutU[i] = lon / (2 * Math.PI) + 0.5;
      lutV[i] = Math.max(0, Math.min(tex.th - 0.001, (0.5 - lat / Math.PI) * tex.th));
      const lam = Math.max(0, (nx * L[0] + ny * L[1] + z * L[2]) / ll);
      sh[i] = o.star ? 1 : 0.1 + 0.9 * Math.pow(lam, 0.8);
      zl[i] = z;
      if (am) rim[i] = am[3] * Math.pow(1 - z, 3.2) * (0.3 + 0.7 * lam);
      edge[i] = r2 > 0.985 ? 255 * (1 - (r2 - 0.985) / 0.015) : 255;
    }
  }
  return {
    S, lutU, lutV, sh, zl, rim, edge, tex: tex.data, tw: tex.tw, th: tex.th,
    clouds: o.clouds ? o.clouds.data : null, cw: o.clouds ? o.clouds.tw : 0, ch: o.clouds ? o.clouds.th : 0,
    speed: o.speed, star: !!o.star, limb: o.limb ?? [0.42, 0.62, 0.85], atmo: am ?? null, pluto: !!o.pluto, cv: new Map(),
  };
}

const SIZES = [72, 96, 144, 288];
export function pickSize(need: number): number {
  for (const s of SIZES) if (s >= need) return s;
  return 288;
}

export function renderRot(rot: Rot, angle: number, Sr: number): HTMLCanvasElement {
  let e = rot.cv.get(Sr);
  if (!e) {
    const c = document.createElement("canvas");
    c.width = c.height = Sr;
    const g = c.getContext("2d")!;
    e = { c, g, img: g.createImageData(Sr, Sr) };
    rot.cv.set(Sr, e);
  }
  const d = e.img.data, S = rot.S, stp = S / Sr, tw = rot.tw, tex = rot.tex;
  let shift = angle / (2 * Math.PI);
  shift -= Math.floor(shift);
  let cshift = shift * 1.35;
  cshift -= Math.floor(cshift);
  const bil = Sr >= 144, cl = rot.clouds, cw = rot.cw, am = rot.atmo, star = rot.star, pluto = rot.pluto;
  for (let y = 0; y < Sr; y++) {
    for (let x = 0; x < Sr; x++) {
      const i = y * stp * S + x * stp, o = (y * Sr + x) * 4, a = rot.edge[i];
      if (!a) { d[o + 3] = 0; continue; }
      let u = rot.lutU[i] - shift; u -= Math.floor(u);
      const vf = rot.lutV[i], v = vf | 0;
      let R: number, G: number, B: number;
      if (bil) {
        const fu = u * tw - 0.5, f0 = Math.floor(fu), tx = fu - f0, u0 = (f0 + tw) % tw, u1 = (u0 + 1) % tw;
        const fv = vf - 0.5, g0 = Math.floor(fv), ty = fv - g0, v0 = Math.max(0, g0), v1 = Math.min(rot.th - 1, Math.max(0, g0 + 1));
        const k00 = (v0 * tw + u0) * 4, k10 = (v0 * tw + u1) * 4, k01 = (v1 * tw + u0) * 4, k11 = (v1 * tw + u1) * 4;
        const w00 = (1 - tx) * (1 - ty), w10 = tx * (1 - ty), w01 = (1 - tx) * ty, w11 = tx * ty;
        R = tex[k00] * w00 + tex[k10] * w10 + tex[k01] * w01 + tex[k11] * w11;
        G = tex[k00 + 1] * w00 + tex[k10 + 1] * w10 + tex[k01 + 1] * w01 + tex[k11 + 1] * w11;
        B = tex[k00 + 2] * w00 + tex[k10 + 2] * w10 + tex[k01 + 2] * w01 + tex[k11 + 2] * w11;
      } else {
        const k = (v * tw + ((u * tw) | 0)) * 4;
        R = tex[k]; G = tex[k + 1]; B = tex[k + 2];
      }
      if (pluto && R + G + B < 60) { R = 176; G = 156; B = 132; }
      if (cl) {
        let cu = rot.lutU[i] - cshift; cu -= Math.floor(cu);
        const c = (cl[(v * cw + ((cu * cw) | 0)) * 4 + 3] / 255) * 0.9;
        R += (255 - R) * c; G += (255 - G) * c; B += (255 - B) * c;
      }
      if (star) {
        const dd = 1 - rot.zl[i];
        R *= 1 - rot.limb[0] * dd; G *= 1 - rot.limb[1] * dd; B *= 1 - rot.limb[2] * dd;
      } else {
        const s = rot.sh[i];
        R *= s; G *= s; B *= s;
        if (am) { const r = rot.rim[i]; R += am[0] * r; G += am[1] * r; B += am[2] * r; }
      }
      d[o] = R; d[o + 1] = G; d[o + 2] = B; d[o + 3] = a;
    }
  }
  e.g.putImageData(e.img, 0, 0);
  return e.c;
}

/* ---------- Schwarzes Loch ---------- */

const BH_N = 512, BH_RH = 70;
let diskTex: HTMLCanvasElement | null = null;

function diskTexture(): HTMLCanvasElement {
  if (diskTex) return diskTex;
  const N = 512, c = document.createElement("canvas");
  c.width = c.height = N;
  const g = c.getContext("2d")!;
  const img = g.createImageData(N, N), d = img.data;
  const ss = (a: number, b: number, x: number) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const dx = i + 0.5 - N / 2, dy = j + 0.5 - N / 2, rho = Math.hypot(dx, dy) / (N / 2);
      if (rho < 0.5 || rho > 1) continue;
      const th = Math.atan2(dy, dx) / (2 * Math.PI) + 0.5 + 0.3 * Math.log(rho * 2);
      const f0 = 0.55 * vnoise2p(th * 5, rho * 22, 5) + 0.3 * vnoise2p(th * 11, rho * 60, 11) + 0.2 * vnoise2p(th * 23, rho * 140, 23);
      const f = Math.max(0, Math.min(1, (f0 / 1.05 - 0.25) * 1.9));
      const I = Math.pow(0.5 / rho, 2);
      const b = I * (0.35 + 0.95 * f);
      const al = Math.max(0, Math.min(1, b * ss(0.5, 0.55, rho) * (1 - ss(0.85, 1, rho)) * 1.15));
      const t = (rho - 0.5) * 2;
      let R: number, G: number, B: number;
      if (t < 0.35) { const q = t / 0.35; R = 255; G = 246 - 46 * q; B = 224 - 104 * q; }
      else if (t < 0.7) { const q = (t - 0.35) / 0.35; R = 255 - 15 * q; G = 200 - 80 * q; B = 120 - 70 * q; }
      else { const q = (t - 0.7) / 0.3; R = 240 - 90 * q; G = 120 - 70 * q; B = 50 - 25 * q; }
      const m = 0.6 + 0.8 * f, k = (j * N + i) * 4;
      d[k] = R * m; d[k + 1] = G * m; d[k + 2] = B * m; d[k + 3] = al * 255;
    }
  }
  g.putImageData(img, 0, 0);
  diskTex = c;
  return c;
}

let bhBuf: HTMLCanvasElement | null = null;
let bhT = -1;

/** Ein gemeinsames Bild für alle Schwarzen Löcher pro Zeitpunkt. */
function bhFrame(t: number): HTMLCanvasElement {
  if (!bhBuf) { bhBuf = document.createElement("canvas"); bhBuf.width = bhBuf.height = BH_N; }
  if (bhT === t) return bhBuf;
  bhT = t;
  const g = bhBuf.getContext("2d")!, C = BH_N / 2, rh = BH_RH, tex = diskTexture();
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.globalCompositeOperation = "source-over";
  g.globalAlpha = 1;
  g.clearRect(0, 0, BH_N, BH_N);
  const ang = t * 0.5, pulse = 1 + 0.04 * Math.sin(t * 1.3);
  g.globalCompositeOperation = "lighter";
  const glow = g.createRadialGradient(C, C, rh, C, C, rh * 2.7);
  glow.addColorStop(0, "rgba(255,150,70," + 0.34 * pulse + ")");
  glow.addColorStop(0.4, "rgba(220,90,40,0.12)");
  glow.addColorStop(1, "rgba(200,70,30,0)");
  g.fillStyle = glow;
  g.fillRect(0, 0, BH_N, BH_N);
  g.globalCompositeOperation = "source-over";
  // Gravitationslinse: das Licht der Scheibe hinter dem Loch wird als Ring um den Schatten gebogen
  const ring = (r0: number, r1: number, alpha: number, topOnly: boolean) => {
    g.save();
    if (topOnly) { g.beginPath(); g.rect(0, 0, BH_N, C); g.clip(); }
    g.beginPath();
    g.arc(C, C, rh * r1, 0, Math.PI * 2);
    g.arc(C, C, rh * r0, 0, Math.PI * 2, true);
    g.clip();
    g.translate(C, C);
    g.rotate(ang * 0.8);
    g.globalAlpha = alpha;
    g.drawImage(tex, -rh * 2.06, -rh * 2.06, rh * 4.12, rh * 4.12);
    g.restore();
  };
  ring(1.0, 1.12, 1, false);
  ring(1.12, 1.3, 0.55, false);
  ring(1.0, 1.2, 0.5, true);
  const disk = (top: boolean) => {
    g.save();
    g.beginPath();
    g.rect(0, top ? 0 : C, BH_N, C);
    g.clip();
    g.translate(C, C);
    g.scale(1, 0.2);
    g.rotate(ang);
    g.drawImage(tex, -rh * 2.3, -rh * 2.3, rh * 4.6, rh * 4.6);
    g.restore();
  };
  disk(true);
  g.fillStyle = "#000";
  g.beginPath(); g.arc(C, C, rh, 0, Math.PI * 2); g.fill();
  g.save();
  g.shadowColor = "rgba(255,170,90,0.95)";
  g.shadowBlur = rh * 0.2;
  g.strokeStyle = "rgba(255,240,215,0.95)";
  g.lineWidth = rh * 0.045;
  g.beginPath(); g.arc(C, C, rh * 1.015, 0, Math.PI * 2); g.stroke();
  g.restore();
  disk(false);
  // Doppler-Effekt: die vom Betrachter weglaufende Seite ist dunkler
  g.globalCompositeOperation = "source-atop";
  const dop = g.createLinearGradient(C - rh * 2.4, 0, C + rh * 2.4, 0);
  dop.addColorStop(0, "rgba(0,0,0,0)");
  dop.addColorStop(0.45, "rgba(0,0,0,0.05)");
  dop.addColorStop(1, "rgba(0,0,0,0.7)");
  g.fillStyle = dop;
  g.fillRect(0, 0, BH_N, BH_N);
  g.globalCompositeOperation = "source-over";
  return bhBuf;
}

export function drawBH(g: CanvasRenderingContext2D, x: number, y: number, r: number) {
  if (r < 2) {
    g.fillStyle = "rgba(255,170,90,0.5)";
    g.beginPath(); g.arc(x, y, 3, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#000";
    g.beginPath(); g.arc(x, y, Math.max(0.8, r), 0, Math.PI * 2); g.fill();
    return;
  }
  const buf = bhFrame(Math.round(ANIM.t * 30) / 30), sc = r / BH_RH;
  g.save();
  g.translate(x, y);
  g.rotate(-0.1);
  g.imageSmoothingEnabled = true;
  g.drawImage(buf, -(BH_N / 2) * sc, -(BH_N / 2) * sc, BH_N * sc, BH_N * sc);
  g.restore();
}

/** Neutronenstern (Pulsar): Kern, Leuchten und zwei rotierende Strahlen. */
export function drawPulsar(g: CanvasRenderingContext2D, x: number, y: number, r: number) {
  const a = ANIM.t * 2.4, len = Math.min(r * 2.6 + 40, 240);
  const pulse = 0.75 + 0.25 * Math.sin(ANIM.t * 7);
  g.save();
  g.translate(x, y);
  g.rotate(a);
  for (const s of [1, -1]) {
    const gr = g.createLinearGradient(0, 0, s * len, 0);
    gr.addColorStop(0, "rgba(190,215,255,0.75)");
    gr.addColorStop(1, "rgba(120,170,255,0)");
    g.fillStyle = gr;
    g.beginPath();
    g.moveTo(0, -1.2);
    g.lineTo(s * len, -len * 0.09);
    g.lineTo(s * len, len * 0.09);
    g.lineTo(0, 1.2);
    g.closePath();
    g.fill();
  }
  g.restore();
  const R = Math.max(r, 2) + 22 * pulse;
  const gl = g.createRadialGradient(x, y, 0, x, y, R);
  gl.addColorStop(0, "rgba(235,245,255," + 0.95 * pulse + ")");
  gl.addColorStop(0.25, "rgba(150,190,255," + 0.45 * pulse + ")");
  gl.addColorStop(1, "rgba(100,150,255,0)");
  g.fillStyle = gl;
  g.beginPath(); g.arc(x, y, R, 0, Math.PI * 2); g.fill();
  const rr = Math.max(r, 1.6);
  const body = g.createRadialGradient(x - rr * 0.3, y - rr * 0.3, rr * 0.05, x, y, rr);
  body.addColorStop(0, "#ffffff");
  body.addColorStop(0.5, "#d3e2ff");
  body.addColorStop(1, "#5f86d6");
  g.fillStyle = body;
  g.beginPath(); g.arc(x, y, rr, 0, Math.PI * 2); g.fill();
}

/** Leuchten um einen Stern (Korona, leicht pulsierend). */
export function drawStarGlow(g: CanvasRenderingContext2D, x: number, y: number, r: number, c: string, id: string) {
  const [cr, cg, cb] = hexRgb(c);
  const pulse = 1 + 0.035 * Math.sin(ANIM.t * 1.1 + id.length);
  const gr = r + Math.min(r * 0.9, 70) * pulse;
  const glow = g.createRadialGradient(x, y, r * 0.92, x, y, gr);
  glow.addColorStop(0, "rgba(" + cr + "," + cg + "," + cb + ",0.55)");
  glow.addColorStop(0.35, "rgba(" + cr + "," + cg + "," + cb + ",0.2)");
  glow.addColorStop(1, "rgba(" + cr + "," + cg + "," + cb + ",0)");
  g.fillStyle = glow;
  g.beginPath(); g.arc(x, y, gr, 0, Math.PI * 2); g.fill();
}

/** Drehgeschwindigkeit in rad/s – bewusst langsam, aber sichtbar. */
export const ROT_SPEED: Record<string, number> = {
  mercury: 0.02, venus: -0.03, earth: 0.1, moon: 0.03, mars: 0.1, jupiter: 0.26, saturn: 0.23,
  uranus: -0.15, neptune: 0.14, pluto: 0.03, ceres: 0.1, sun: 0.05,
};

export const ATMO: Record<string, [number, number, number, number]> = {
  earth: [110, 170, 255, 1.0],
  venus: [255, 220, 150, 0.55],
  mars: [230, 160, 120, 0.2],
  neptune: [120, 160, 255, 0.6],
  uranus: [170, 235, 240, 0.55],
  jupiter: [240, 215, 170, 0.2],
  saturn: [240, 220, 170, 0.2],
};
