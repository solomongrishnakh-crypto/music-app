/**
 * Prozedurale Oberflächen-Texturen für die 3D-Ansicht des Sonnensystems
 * (SolarSystem3D.tsx). Bewusst ohne Bilddateien: nichts muss geladen
 * werden, keine Lizenzfragen, kein Warten auf das Netz.
 *
 * Die Muster sind angelehnt an das echte Aussehen (Wolkenbänder und
 * Großer Roter Fleck bei Jupiter, Kontinente/Wolken/Polkappen bei der
 * Erde, dunkle Albedo-Gebiete und Polkappen beim Mars, Plutos helles
 * "Herz" usw.), aber KEINE echten Karten — die Kontinente der Erde sind
 * z. B. nur angedeutet.
 *
 * Alle Texturen sind equirektangulär (u = Länge 0…1, v = Breite oben→unten).
 */

type Rgb = [number, number, number];

// Nutzerkorrektur 03.10.2026 ("hängt ca. 5 Sekunden, bevor das Fenster
// aufgeht"): die Texturen werden Pixel für Pixel berechnet — hex() pro
// Pixel neu zu parsen und Millionen echter Math.sin-Aufrufe kosteten ~5 s.
// Jetzt: Farb-Cache + Sinus-Tabelle (für Texturen genau genug).
const HEX_CACHE = new Map<string, Rgb>();
function hex(h: string): Rgb {
  let c = HEX_CACHE.get(h);
  if (!c) {
    const n = parseInt(h.replace("#", ""), 16);
    c = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    HEX_CACHE.set(h, c);
  }
  return c;
}

const SIN_N = 4096;
const SIN_TAB = new Float32Array(SIN_N + 1);
for (let i = 0; i <= SIN_N; i++) SIN_TAB[i] = Math.sin((i / SIN_N) * Math.PI * 2);
const INV_TAU_N = SIN_N / (Math.PI * 2);
/** Schneller Sinus per Tabelle mit linearer Interpolation (Fehler < 1e-6). */
function fsin(x: number): number {
  let f = x * INV_TAU_N;
  f -= Math.floor(f / SIN_N) * SIN_N;
  const i = f | 0;
  const t = f - i;
  return SIN_TAB[i] + (SIN_TAB[i + 1] - SIN_TAB[i]) * t;
}

function mix(a: Rgb, b: Rgb, t: number): Rgb {
  const k = Math.min(1, Math.max(0, t));
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
}

function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * Glattes "Rauschen" aus überlagerten Sinuswellen. Die Frequenzen in
 * u-Richtung sind ganzzahlig → nahtlos um den Planeten herum (keine Kante
 * bei Länge 0°/360°). Ergebnis ungefähr im Bereich −1…1.
 */
function waveNoise(seed: number, terms = 14, maxFreq = 9): (u: number, v: number) => number {
  const r = rng(seed);
  const waves: { fu: number; fv: number; ph: number; a: number }[] = [];
  let norm = 0;
  for (let i = 0; i < terms; i++) {
    const fu = 1 + Math.floor(r() * maxFreq);
    const fv = (r() - 0.5) * maxFreq * 2;
    const a = 1 / Math.sqrt(fu + Math.abs(fv) * 0.5);
    waves.push({ fu, fv, ph: r() * Math.PI * 2, a });
    norm += a;
  }
  // flache Arrays statt Objekt-Schleife → deutlich schneller pro Pixel
  const n = waves.length;
  const KU = new Float64Array(n), KV = new Float64Array(n), PH = new Float64Array(n), A = new Float64Array(n);
  waves.forEach((w, i) => {
    KU[i] = Math.PI * 2 * w.fu;
    KV[i] = Math.PI * w.fv;
    PH[i] = w.ph;
    A[i] = w.a;
  });
  const scale = 2.2 / norm;
  return (u, v) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += A[i] * fsin(KU[i] * u + KV[i] * v + PH[i]);
    return s * scale;
  };
}

function paint(
  w: number,
  h: number,
  fn: (u: number, v: number, lat: number) => [number, number, number, number?]
): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  const img = ctx.createImageData(w, h);
  const d = img.data;
  for (let y = 0; y < h; y++) {
    const v = (y + 0.5) / h;
    const lat = (0.5 - v) * Math.PI; // +π/2 = Nordpol
    for (let x = 0; x < w; x++) {
      const u = (x + 0.5) / w;
      const [r, g, b, a] = fn(u, v, lat);
      const i = (y * w + x) * 4;
      d[i] = r;
      d[i + 1] = g;
      d[i + 2] = b;
      d[i + 3] = a ?? 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

/** Krater als dunkle Mulden mit hellem Rand (Merkur, Ceres). */
function craters(c: HTMLCanvasElement, seed: number, count: number, maxR: number) {
  const ctx = c.getContext("2d");
  if (!ctx) return;
  const r = rng(seed);
  for (let i = 0; i < count; i++) {
    const x = r() * c.width;
    const y = c.height * (0.12 + r() * 0.76);
    const rad = 1 + Math.pow(r(), 2.5) * maxR;
    ctx.beginPath();
    ctx.ellipse(x, y, rad, rad * 0.9, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(40,36,32,0.28)";
    ctx.fill();
    ctx.lineWidth = Math.max(0.6, rad * 0.18);
    ctx.strokeStyle = "rgba(235,228,215,0.22)";
    ctx.stroke();
  }
}

/**
 * Krater mit Licht von links oben: dunkler Boden, heller Rand auf der
 * Lichtseite, Schatten auf der Gegenseite; Breitenverzerrung nahe der Pole
 * und Wiederholung über die Kartennaht (Ceres).
 */
function shadedCraters(c: HTMLCanvasElement, seed: number, count: number, maxR: number, minR: number) {
  const ctx = c.getContext("2d");
  if (!ctx) return;
  const W = c.width;
  const H = c.height;
  const r = rng(seed);
  for (let i = 0; i < count; i++) {
    const x = r() * W;
    const y = H * (0.06 + r() * 0.88);
    const lat = (0.5 - y / H) * Math.PI;
    const rad = minR + Math.pow(r(), 3) * (maxR - minR);
    const sx = 1 / Math.max(0.3, Math.cos(lat));
    for (const dx of [-W, 0, W]) {
      const cx = x + dx;
      if (cx + rad * sx < 0 || cx - rad * sx > W) continue;
      ctx.save();
      ctx.translate(cx, y);
      ctx.scale(sx, 1);
      const gr = ctx.createRadialGradient(0, 0, rad * 0.15, 0, 0, rad);
      gr.addColorStop(0, "rgba(30,28,26,0.34)");
      gr.addColorStop(0.7, "rgba(50,47,43,0.20)");
      gr.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.arc(0, 0, rad, 0, Math.PI * 2);
      ctx.fill();
      // große Krater: dünner, weicher Rand — sonst wirken sie wie Ringe
      const soft = rad > 12 ? 0.45 : 1;
      ctx.lineWidth = Math.max(0.6, rad * (rad > 12 ? 0.06 : 0.13));
      ctx.strokeStyle = `rgba(222,217,207,${0.34 * soft})`;
      ctx.beginPath();
      ctx.arc(0, 0, rad * 0.93, Math.PI * 0.75, Math.PI * 1.75);
      ctx.stroke();
      ctx.strokeStyle = `rgba(18,16,14,${0.30 * soft})`;
      ctx.beginPath();
      ctx.arc(0, 0, rad * 0.93, -Math.PI * 0.25, Math.PI * 0.75);
      ctx.stroke();
      ctx.restore();
    }
  }
}

/** Occator-Krater (≈ 20° N, 239° O) mit den hellen Salzflecken der Cerealia Facula. */
function occatorSpots(c: HTMLCanvasElement) {
  const ctx = c.getContext("2d");
  if (!ctx) return;
  const W = c.width;
  const H = c.height;
  const x = (239.3 / 360) * W;
  const y = (0.5 - 19.8 / 180) * H;
  const sx = 1 / Math.cos((19.8 * Math.PI) / 180);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(sx, 1);
  const floor = ctx.createRadialGradient(0, 0, 3, 0, 0, 24);
  floor.addColorStop(0, "rgba(200,196,188,0.6)");
  floor.addColorStop(1, "rgba(40,38,35,0)");
  ctx.fillStyle = floor;
  ctx.beginPath();
  ctx.arc(0, 0, 24, 0, Math.PI * 2);
  ctx.fill();
  const spots: [number, number, number, number][] = [
    [0, 0, 8, 1],
    [9, 4, 3.4, 0.85],
    [-8, 6, 2.8, 0.75],
    [4, -9, 2.5, 0.7],
    [-4, -5, 2, 0.6],
  ];
  for (const [dx, dy, rr, a] of spots) {
    const sg = ctx.createRadialGradient(dx, dy, 0, dx, dy, rr);
    sg.addColorStop(0, `rgba(252,250,244,${a})`);
    sg.addColorStop(0.55, `rgba(235,232,224,${a * 0.6})`);
    sg.addColorStop(1, "rgba(235,232,224,0)");
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.arc(dx, dy, rr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** Oberflächen-Textur eines Körpers (null = einfarbig nach `fallback`). */
const CANVAS_CACHE = new Map<string, HTMLCanvasElement>();
/** Einmal berechnen, danach aus dem Speicher (zweites Öffnen sofort). */
export function cachedCanvas(key: string, make: () => HTMLCanvasElement): HTMLCanvasElement {
  let c = CANVAS_CACHE.get(key);
  if (!c) {
    c = make();
    CANVAS_CACHE.set(key, c);
  }
  return c;
}

/**
 * Echte Oberflächenkarte aus dem Netz laden (22.10.2026, Nutzerwunsch: "eine Seite von Pluto sieht
 * realistisch aus, die andere nicht"). Beispiel: NASA-Weltkarte von New Horizons über Wikimedia
 * Commons (gemeinfrei). Ersetzt die rechnerische Textur, sobald sie da ist; bis dahin (oder ohne
 * Netz) bleibt die berechnete Textur sichtbar. `post` darf Lücken im Bild füllen.
 */
export function loadRealSurface(
  key: string,
  url: string,
  width: number,
  post?: (c: HTMLCanvasElement) => void
): Promise<HTMLCanvasElement | null> {
  return new Promise((resolve) => {
    if (typeof Image === "undefined") return resolve(null);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.referrerPolicy = "no-referrer";
    img.onload = () => {
      try {
        const c = document.createElement("canvas");
        c.width = width;
        c.height = Math.round(width / 2);
        const ctx = c.getContext("2d");
        if (!ctx) return resolve(null);
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, c.width, c.height);
        post?.(c);
        CANVAS_CACHE.set(key, c);
        resolve(c);
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

/**
 * Karte von Pluto: Der Südpol lag bei der Vorbeiflug im Dunkeln (nie fotografiert) → schwarzer
 * Streifen unten. Hier wird er spaltenweise mit der Farbe des letzten bekannten Randes gefüllt und
 * nach unten zu einem dunklen Rotbraun abgetönt (leicht gekörnt), damit keine harte Kante bleibt.
 */
export function fillUnlitSouth(c: HTMLCanvasElement) {
  const ctx = c.getContext("2d");
  if (!ctx) return;
  const w = c.width, h = c.height;
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  const lum = (x: number, y: number) => {
    const i = (y * w + x) * 4;
    return d[i] + d[i + 1] + d[i + 2];
  };
  // letzte helle Zeile je Spalte (von oben); danach beginnt das Unbekannte
  const last = new Float32Array(w);
  for (let x = 0; x < w; x++) {
    let y = h - 1;
    while (y > h * 0.25 && lum(x, y) < 40) y--;
    last[x] = y;
  }
  // glätten (Ränder sind zackig) und leicht nach oben ziehen, um Randpixel zu verschlucken
  const sm = new Float32Array(w);
  const R = 5;
  for (let x = 0; x < w; x++) {
    let m = Infinity;
    for (let k = -R; k <= R; k++) m = Math.min(m, last[(x + k + w) % w]);
    sm[x] = m - 3;
  }
  const dark: [number, number, number] = [74, 52, 44];
  let seed = 7;
  const rnd = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let x = 0; x < w; x++) {
    const y0 = Math.max(1, Math.floor(sm[x]));
    // Randfarbe: Mittel der 6 Zeilen darüber
    let r = 0, g = 0, b = 0;
    for (let k = 1; k <= 6; k++) {
      const i = ((y0 - k) * w + x) * 4;
      r += d[i]; g += d[i + 1]; b += d[i + 2];
    }
    r /= 6; g /= 6; b /= 6;
    for (let y = y0; y < h; y++) {
      const t = Math.min(1, (y - y0) / Math.max(8, (h - y0) * 0.85));
      const k = t * t * (3 - 2 * t);
      const n = (rnd() - 0.5) * 14;
      const i = (y * w + x) * 4;
      d[i] = r + (dark[0] - r) * k + n;
      d[i + 1] = g + (dark[1] - g) * k + n * 0.8;
      d[i + 2] = b + (dark[2] - b) * k + n * 0.7;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

export function hasCachedCanvas(key: string): boolean {
  return CANVAS_CACHE.has(key);
}

export function surfaceCanvas(id: string, fallback: string): HTMLCanvasElement {
  switch (id) {
    case "mercury": {
      const n = waveNoise(11, 16, 14);
      const c = paint(512, 256, (u, v) => {
        const k = n(u, v);
        const col = mix(hex("#6f6a64"), hex("#b9b2a8"), 0.5 + k * 0.35);
        return [col[0], col[1], col[2]];
      });
      craters(c, 12, 260, 9);
      return c;
    }
    case "venus": {
      const n = waveNoise(21, 12, 6);
      return paint(512, 256, (u, v, lat) => {
        const k = n(u * 1 + Math.sin(lat * 3) * 0.08, v) * 0.6 + Math.sin(lat * 9 + n(u, v) * 2) * 0.25;
        const col = mix(hex("#c9a76a"), hex("#f3e2b8"), 0.55 + k * 0.3);
        return [col[0], col[1], col[2]];
      });
    }
    case "earth": {
      const land = waveNoise(31, 18, 7);
      const detail = waveNoise(32, 18, 22);
      return paint(1024, 512, (u, v, lat) => {
        const a = Math.abs(lat);
        const dd = detail(u, v);
        const h = land(u, v) + dd * 0.35;
        // Eis: Polkappen mit unregelmäßigem Rand (Antarktis größer als Arktis)
        const capEdge = (lat < 0 ? 1.12 : 1.22) + dd * 0.05;
        if (a > capEdge) {
          const ice = mix(hex("#cfd8e0"), hex("#f4f7fa"), 0.5 + dd * 0.5);
          return [ice[0], ice[1], ice[2]];
        }
        if (h > 0.18) {
          // Land: Wüstengürtel um ±25°, sonst grün, Gebirge heller
          const desert = Math.exp(-Math.pow((a - 0.42) / 0.16, 2));
          let col = mix(hex("#3f6b33"), hex("#c2a36b"), desert * 0.85 + dd * 0.15);
          if (h > 0.55) col = mix(col, hex("#8d7f6c"), (h - 0.55) * 1.8);
          return [col[0], col[1], col[2]];
        }
        // Ozean: flach (heller) an Küsten, tief weiter draußen
        const col = mix(hex("#0d2f63"), hex("#21609e"), 0.5 + h * 1.2);
        return [col[0], col[1], col[2]];
      });
    }
    case "mars": {
      const n = waveNoise(41, 16, 9);
      const fine = waveNoise(42, 14, 20);
      return paint(512, 256, (u, v, lat) => {
        const a = Math.abs(lat);
        const ff = fine(u, v);
        if (a > 1.32 + ff * 0.05) return [238, 232, 226];
        const k = n(u, v) + ff * 0.3;
        let col = mix(hex("#c4623a"), hex("#dd8a5a"), 0.5 + ff * 0.4);
        if (k > 0.25) col = mix(col, hex("#6e3a26"), Math.min(1, (k - 0.25) * 2));
        return [col[0], col[1], col[2]];
      });
    }
    case "jupiter": {
      const turb = waveNoise(51, 16, 18);
      const bands: [number, string][] = [
        [-1.0, "#9a8774"], [-0.62, "#c7b49a"], [-0.42, "#e9dcc4"], [-0.3, "#b77c55"],
        [-0.16, "#efe2c8"], [0.02, "#e6d2b0"], [0.12, "#a9694a"], [0.3, "#efe0c4"],
        [0.45, "#c49a74"], [0.62, "#e2d3bb"], [1.0, "#9c8a78"],
      ];
      return paint(1024, 512, (u, v, lat) => {
        const y = Math.sin(lat) + turb(u, v) * 0.035;
        let col = hex(bands[0][1]);
        for (let i = 0; i < bands.length - 1; i++) {
          if (y >= bands[i][0] && y <= bands[i + 1][0]) {
            const t = (y - bands[i][0]) / (bands[i + 1][0] - bands[i][0]);
            col = mix(hex(bands[i][1]), hex(bands[i + 1][1]), t * t * (3 - 2 * t));
          }
        }
        // Großer Roter Fleck: ~22° Süd
        const dx = (u - 0.3) * 2 * Math.PI * Math.cos(lat);
        const dy = lat + 0.38;
        const e = (dx * dx) / 0.022 + (dy * dy) / 0.006;
        if (e < 1) col = mix(col, hex("#c0603c"), (1 - e) * 1.4);
        return [col[0], col[1], col[2]];
      });
    }
    case "saturn": {
      const turb = waveNoise(61, 10, 10);
      return paint(512, 256, (u, v, lat) => {
        const y = Math.sin(lat) + turb(u, v) * 0.02;
        const k = Math.sin(y * 18) * 0.5 + Math.sin(y * 7 + 1) * 0.5;
        let col = mix(hex("#c9ae7c"), hex("#ecdcb4"), 0.55 + k * 0.25);
        if (Math.abs(lat) > 1.25) col = mix(col, hex("#9fa79a"), 0.5);
        return [col[0], col[1], col[2]];
      });
    }
    case "uranus":
      return paint(256, 128, (_u, _v, lat) => {
        const col = mix(hex("#9ad3dd"), hex("#c3eef2"), 0.5 + Math.sin(lat * 6) * 0.12);
        return [col[0], col[1], col[2]];
      });
    case "neptune": {
      const turb = waveNoise(71, 10, 10);
      return paint(512, 256, (u, v, lat) => {
        const y = Math.sin(lat) + turb(u, v) * 0.03;
        let col = mix(hex("#2f4fc4"), hex("#5a7ff0"), 0.5 + Math.sin(y * 10) * 0.25);
        const dx = (u - 0.62) * 2 * Math.PI * Math.cos(lat);
        const dy = lat + 0.35;
        const e = (dx * dx) / 0.03 + (dy * dy) / 0.008;
        if (e < 1) col = mix(col, hex("#1a2a7a"), (1 - e) * 1.2);
        return [col[0], col[1], col[2]];
      });
    }
    case "pluto": {
      const n = waveNoise(81, 14, 9);
      return paint(512, 256, (u, v, lat) => {
        let col = mix(hex("#a88a6e"), hex("#d9c4a6"), 0.5 + n(u, v) * 0.4);
        // dunkler Äquatorgürtel ("Cthulhu") + helles Herz (Tombaugh Regio)
        if (Math.abs(lat) < 0.35 && n(u * 1.3, v) > 0.0) col = mix(col, hex("#5a3a2a"), 0.65);
        const dx = (u - 0.55) * 2 * Math.PI;
        const dy = lat - 0.25;
        const heart = (dx * dx) / 0.16 + (dy * dy) / 0.12;
        if (heart < 1) col = mix(col, hex("#f2e8d8"), (1 - heart) * 1.6);
        return [col[0], col[1], col[2]];
      });
    }
    case "ceres": {
      // Realistischer als die frühere Falschfarben-Höhenkarte (Nutzerkorrektur
      // 15.10.2026): Ceres ist sehr dunkel, neutral grau und von Kratern in
      // allen Größen übersät; nur im Occator-Krater (≈ 20° N) liegen helle
      // Salzflecken (Cerealia Facula).
      const n = waveNoise(91, 14, 12);
      const g = waveNoise(137, 12, 46);
      const c = paint(1024, 512, (u, v) => {
        const big = n(u, v);
        const grain = g(u, v);
        const col = mix(hex("#55534f"), hex("#8c8983"), 0.5 + big * 0.3 + grain * 0.12);
        return [col[0], col[1], col[2]];
      });
      shadedCraters(c, 92, 22, 38, 9);
      shadedCraters(c, 93, 380, 11, 3);
      shadedCraters(c, 94, 1800, 3.2, 0.8);
      occatorSpots(c);
      return c;
    }
    default: {
      // Haumea, Makemake, Eris & Co.: Grundfarbe mit leichter Struktur
      const n = waveNoise(id.length * 17 + 3, 12, 10);
      const base = hex(fallback);
      return paint(256, 128, (u, v) => {
        const col = mix(mix(base, [0, 0, 0], 0.25), mix(base, [255, 255, 255], 0.25), 0.5 + n(u, v) * 0.4);
        return [col[0], col[1], col[2]];
      });
    }
  }
}

/** Wolkenschicht der Erde (weiß mit Alpha). */
export function earthCloudsCanvas(): HTMLCanvasElement {
  const n = waveNoise(301, 22, 14);
  const m = waveNoise(302, 22, 34);
  return paint(1024, 512, (u, v, lat) => {
    // Wolken häufiger in mittleren Breiten und am Äquator (ITCZ)
    const belt = 0.25 + 0.35 * Math.exp(-Math.pow((Math.abs(lat) - 0.95) / 0.3, 2)) + 0.2 * Math.exp(-Math.pow(lat / 0.12, 2));
    const k = n(u, v) * 0.55 + m(u, v) * m(u * 2 % 1, v) * 0.9 + belt - 0.5;
    const a = Math.max(0, Math.min(1, k * 2.2));
    return [255, 255, 255, Math.round(a * 230)];
  });
}

/** Sonnenoberfläche: Granulation, leicht fleckig. */
export function sunCanvas(): HTMLCanvasElement {
  const n = waveNoise(401, 22, 40);
  const m = waveNoise(402, 12, 8);
  return paint(512, 256, (u, v) => {
    const k = n(u, v) * 0.6 + m(u, v) * 0.4;
    const col = mix(hex("#ffe2a6"), hex("#fffaf0"), 0.6 + k * 0.35);
    return [col[0], col[1], col[2]];
  });
}

/**
 * Saturnringe als radialer Verlauf (u = innen→außen, 1,24…2,27
 * Saturnradien): C-Ring schwach, B-Ring hell, Cassini-Teilung (Lücke),
 * A-Ring mit Encke-Lücke.
 */
export function saturnRingCanvas(): HTMLCanvasElement {
  const inner = 1.24;
  const outer = 2.27;
  const r = rng(501);
  const jitter = Array.from({ length: 512 }, () => r());
  return paint(512, 4, (u) => {
    const R = inner + u * (outer - inner);
    let a = 0;
    let col: Rgb = hex("#d8c8a8");
    if (R < 1.53) {
      a = 0.18 + (R - 1.24) * 0.5; // C-Ring
      col = hex("#9c8e78");
    } else if (R < 1.95) {
      a = 0.85; // B-Ring
      col = hex("#e6d7b8");
    } else if (R < 2.03) {
      a = 0.06; // Cassini-Teilung
    } else if (R < 2.27) {
      a = R > 2.205 && R < 2.215 ? 0.08 : 0.6; // A-Ring mit Encke-Lücke
      col = hex("#cfc0a2");
    }
    a *= 0.8 + jitter[Math.floor(u * 511)] * 0.35;
    return [col[0], col[1], col[2], Math.round(Math.min(1, a) * 255)];
  });
}

/** Weicher, runder Lichthof (für Sonnen-Glow und Sterne). */
export function glowCanvas(inner: string, outer: string): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, inner);
  g.addColorStop(0.18, inner);
  g.addColorStop(0.45, outer);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return c;
}
