"use client";

/**
 * Vorschau-Karte für /sternenhimmel (Nutzerwunsch 02.10.2026: "box
 * futuristischer machen und mehr Details, z. B. Sternbilder").
 *
 * Ein Canvas zeichnet ein HUD-Fenster in den Himmel: funkelndes Sternfeld,
 * gekrümmtes Koordinatennetz, ein rotierender Scan-Ring und nacheinander
 * vier bekannte Sternbilder mit echten Sternpositionen (RA/Dec, J2000),
 * deren Linien sich Strich für Strich aufbauen. Die Projektion ist
 * gnomonisch um den Mittelpunkt des jeweiligen Sternbilds.
 *
 * Läuft nur, solange die Karte sichtbar ist; bei "Bewegung reduzieren"
 * wird ein einzelnes ruhiges Bild gezeichnet.
 */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { localize, type LocalizedText } from "@/lib/i18n";

type Star = { n?: string; ra: number; dec: number; m: number };
type Constellation = { name: LocalizedText; stars: Star[]; lines: [number, number][] };

// RA in Stunden, Dec in Grad, m = scheinbare Helligkeit
const CONSTELLATIONS: Constellation[] = [
  {
    name: { de: "Orion", en: "Orion", hi: "मृग (ओरायन)", zh: "猎户座", ko: "오리온자리", ja: "オリオン座", es: "Orión", fr: "Orion", tr: "Avcı", ru: "Орион", pt: "Órion", ar: "الجبار", el: "Ωρίων" },
    stars: [
      { n: "Betelgeuse", ra: 5.919, dec: 7.41, m: 0.5 },
      { n: "Bellatrix", ra: 5.419, dec: 6.35, m: 1.6 },
      { ra: 5.679, dec: -1.94, m: 1.8 },
      { ra: 5.603, dec: -1.2, m: 1.7 },
      { ra: 5.533, dec: -0.3, m: 2.2 },
      { n: "Saiph", ra: 5.796, dec: -9.67, m: 2.1 },
      { n: "Rigel", ra: 5.242, dec: -8.2, m: 0.1 },
      { ra: 5.585, dec: 9.93, m: 3.4 },
    ],
    lines: [[7, 0], [7, 1], [0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6], [5, 6]],
  },
  {
    name: { de: "Großer Bär", en: "Ursa Major", hi: "सप्तर्षि", zh: "大熊座", ko: "큰곰자리", ja: "おおぐま座", es: "Osa Mayor", fr: "Grande Ourse", tr: "Büyük Ayı", ru: "Большая Медведица", pt: "Ursa Maior", ar: "الدب الأكبر", el: "Μεγάλη Άρκτος" },
    stars: [
      { n: "Dubhe", ra: 11.062, dec: 61.75, m: 1.8 },
      { n: "Merak", ra: 11.031, dec: 56.38, m: 2.4 },
      { ra: 11.897, dec: 53.69, m: 2.4 },
      { ra: 12.257, dec: 57.03, m: 3.3 },
      { n: "Alioth", ra: 12.9, dec: 55.96, m: 1.8 },
      { n: "Mizar", ra: 13.399, dec: 54.93, m: 2.2 },
      { n: "Alkaid", ra: 13.792, dec: 49.31, m: 1.9 },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]],
  },
  {
    name: { de: "Kassiopeia", en: "Cassiopeia", hi: "कैसियोपिया", zh: "仙后座", ko: "카시오페이아자리", ja: "カシオペヤ座", es: "Casiopea", fr: "Cassiopée", tr: "Kraliçe", ru: "Кассиопея", pt: "Cassiopeia", ar: "ذات الكرسي", el: "Κασσιόπη" },
    stars: [
      { n: "Caph", ra: 0.153, dec: 59.15, m: 2.3 },
      { n: "Schedar", ra: 0.675, dec: 56.54, m: 2.2 },
      { n: "Navi", ra: 0.945, dec: 60.72, m: 2.2 },
      { n: "Ruchbah", ra: 1.43, dec: 60.24, m: 2.7 },
      { ra: 1.907, dec: 63.67, m: 3.4 },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  {
    name: { de: "Schwan", en: "Cygnus", hi: "हंस", zh: "天鹅座", ko: "백조자리", ja: "はくちょう座", es: "Cisne", fr: "Cygne", tr: "Kuğu", ru: "Лебедь", pt: "Cisne", ar: "الدجاجة", el: "Κύκνος" },
    stars: [
      { n: "Deneb", ra: 20.69, dec: 45.28, m: 1.3 },
      { n: "Sadr", ra: 20.37, dec: 40.26, m: 2.2 },
      { n: "Albireo", ra: 19.512, dec: 27.96, m: 3.1 },
      { ra: 20.77, dec: 33.97, m: 2.5 },
      { ra: 19.75, dec: 45.13, m: 2.9 },
    ],
    lines: [[0, 1], [1, 2], [4, 1], [1, 3]],
  },
];

const HOLD = 6500; // ms pro Sternbild
const DEG = Math.PI / 180;

function fmtRa(h: number) {
  const t = Math.round(h * 60) % 1440, hh = Math.floor(t / 60), mm = t % 60;
  return `${String(hh).padStart(2, "0")}h ${String(mm).padStart(2, "0")}m`;
}
function fmtDec(d: number) {
  return `${d < 0 ? "−" : "+"}${String(Math.round(Math.abs(d))).padStart(2, "0")}°`;
}

// Mittelpunkt + gnomonische Projektion vorberechnen (Einheiten: Bogenmaß)
const PREPARED = CONSTELLATIONS.map((c) => {
  const vec = c.stars.map((s) => {
    const a = s.ra * 15 * DEG, d = s.dec * DEG;
    return [Math.cos(d) * Math.cos(a), Math.cos(d) * Math.sin(a), Math.sin(d)];
  });
  const m = [0, 0, 0];
  for (const v of vec) { m[0] += v[0]; m[1] += v[1]; m[2] += v[2]; }
  const len = Math.hypot(m[0], m[1], m[2]);
  const f = [m[0] / len, m[1] / len, m[2] / len];
  const ra0 = Math.atan2(f[1], f[0]), dec0 = Math.asin(f[2]);
  // Ost (RA steigt) nach links, wie am Himmel
  const e = [-Math.sin(ra0), Math.cos(ra0), 0];
  const n = [-Math.sin(dec0) * Math.cos(ra0), -Math.sin(dec0) * Math.sin(ra0), Math.cos(dec0)];
  const pts = vec.map((v) => {
    const z = v[0] * f[0] + v[1] * f[1] + v[2] * f[2];
    return { x: -(v[0] * e[0] + v[1] * e[1] + v[2] * e[2]) / z, y: -(v[0] * n[0] + v[1] * n[1] + v[2] * n[2]) / z };
  });
  const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
  return {
    pts: pts.map((p) => ({ x: (p.x - cx) / span, y: (p.y - cy) / span })),
    ra: ((ra0 / DEG / 15) + 24) % 24,
    dec: dec0 / DEG,
  };
});

export default function SkyPreviewCard({ label, title }: { label: string; title: string }) {
  const { lang } = useLanguage();
  const wrapRef = useRef<HTMLAnchorElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [idx, setIdx] = useState(0);
  const [clock, setClock] = useState("");
  const idxRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current, wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, dpr = 1;
    // Hintergrundsterne (fest, mit Funkeln)
    const bg = Array.from({ length: 140 }, (_, i) => {
      const r = (k: number) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
      return { x: r(1), y: r(2), s: 0.3 + r(3) * 1.1, p: r(4) * 6.28, w: 0.6 + r(5) * 2, c: r(6) };
    });
    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width; H = rect.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(wrap);

    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) loop(); }, { threshold: 0 });
    io.observe(wrap);

    const t0 = performance.now();
    let raf = 0, lastClock = "";

    function drawFrame(now: number) {
      if (!ctx) return;
      // rAF-Zeitstempel kann minimal vor t0 liegen → nie negativ werden lassen
      const el = Math.max(0, now - t0), t = el / 1000;
      const cycle = reduce ? 0 : Math.floor(el / HOLD);
      const k = reduce ? 1 : (el % HOLD) / HOLD; // 0 … 1 innerhalb eines Sternbilds
      const ci = cycle % PREPARED.length;
      if (ci !== idxRef.current) { idxRef.current = ci; setIdx(ci); }
      const c = CONSTELLATIONS[ci], P = PREPARED[ci];

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Tiefer Raum mit leichtem Milchstraßen-Schleier
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, "#03040d"); g.addColorStop(0.55, "#070b22"); g.addColorStop(1, "#0c0f2e");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const mw = ctx.createLinearGradient(W * 0.1, H, W * 0.9, 0);
      mw.addColorStop(0.3, "rgba(120,110,220,0)"); mw.addColorStop(0.5, "rgba(140,130,255,0.10)"); mw.addColorStop(0.7, "rgba(120,110,220,0)");
      ctx.fillStyle = mw; ctx.fillRect(0, 0, W, H);

      // Sternbild-Bereich: rechts (Desktop) bzw. oben mittig (schmal)
      const narrow = W < 520;
      const cx = narrow ? W * 0.5 : W * 0.68, cy = narrow ? H * 0.38 : H * 0.48;
      const size = narrow ? Math.min(W * 0.55, H * 0.52) : Math.min(W * 0.4, H * 0.78);

      // gekrümmtes Koordinatennetz, dreht sich langsam
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(reduce ? 0 : t * 0.02);
      ctx.strokeStyle = "rgba(140,160,255,0.07)"; ctx.lineWidth = 1;
      for (let r = size * 0.35; r < Math.hypot(W, H); r += size * 0.35) { ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke(); }
      for (let a = 0; a < 12; a++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a * Math.PI / 6) * W * 2, Math.sin(a * Math.PI / 6) * W * 2); ctx.stroke(); }
      ctx.restore();

      // Hintergrundsterne
      for (const s of bg) {
        const tw = reduce ? 0.7 : 0.55 + 0.45 * Math.sin(t * s.w + s.p);
        ctx.globalAlpha = tw * (0.35 + s.s * 0.45);
        ctx.fillStyle = s.c > 0.85 ? "#ffd9b0" : s.c < 0.15 ? "#b9c8ff" : "#ffffff";
        ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.s, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Scan-Ring mit Lichtkegel und Gradskala
      const R = size * 0.78;
      const sweep = reduce ? -0.8 : t * 0.9;
      ctx.save(); ctx.translate(cx, cy);
      ctx.strokeStyle = "rgba(255,90,77,0.35)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.stroke();
      for (let a = 0; a < 72; a++) {
        const L = a % 6 === 0 ? 7 : 3, ang = a * 5 * DEG;
        ctx.strokeStyle = a % 6 === 0 ? "rgba(255,90,77,0.55)" : "rgba(255,90,77,0.22)";
        ctx.beginPath(); ctx.moveTo(Math.cos(ang) * R, Math.sin(ang) * R); ctx.lineTo(Math.cos(ang) * (R - L), Math.sin(ang) * (R - L)); ctx.stroke();
      }
      const cone = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
      cone.addColorStop(0, "rgba(255,90,77,0)"); cone.addColorStop(1, "rgba(255,90,77,0.10)");
      ctx.fillStyle = cone; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, R, sweep - 0.5, sweep); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(255,120,105,0.6)"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(sweep) * R, Math.sin(sweep) * R); ctx.stroke();
      ctx.restore();

      // Ein-/Ausblenden pro Sternbild
      const fade = reduce ? 1 : Math.min(1, k / 0.08, (1 - k) / 0.08);
      const pts = P.pts.map((p) => ({ x: cx + p.x * size, y: cy + p.y * size }));

      // Linien bauen sich nacheinander auf
      const nL = c.lines.length;
      ctx.lineWidth = 1.2; ctx.lineCap = "round";
      c.lines.forEach(([a, b], i) => {
        const start = 0.06 + (i / nL) * 0.38, prog = reduce ? 1 : Math.max(0, Math.min(1, (k - start) / 0.06));
        if (prog <= 0) return;
        const A = pts[a], B = pts[b];
        ctx.strokeStyle = `rgba(150,185,255,${0.75 * fade})`;
        ctx.shadowColor = "rgba(120,160,255,0.8)"; ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(A.x + (B.x - A.x) * prog, A.y + (B.y - A.y) * prog); ctx.stroke();
      });
      ctx.shadowBlur = 0;

      // Sterne mit Leuchthof + Namen
      ctx.font = "500 10px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textBaseline = "middle";
      c.stars.forEach((s, i) => {
        const p = pts[i];
        const r = Math.max(1.4, 4.2 - s.m * 1.0);
        const pulse = reduce ? 1 : 0.85 + 0.15 * Math.sin(t * 3 + i);
        const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 5);
        halo.addColorStop(0, `rgba(200,215,255,${0.5 * fade})`); halo.addColorStop(1, "rgba(200,215,255,0)");
        ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(p.x, p.y, r * 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${fade})`; ctx.beginPath(); ctx.arc(p.x, p.y, r * pulse, 0, Math.PI * 2); ctx.fill();
        if (s.n && !narrow) {
          ctx.fillStyle = `rgba(210,220,255,${0.75 * fade * Math.min(1, Math.max(0, (k - 0.3) / 0.1))})`;
          ctx.fillText(s.n, p.x + r + 6, p.y);
        }
      });

      // Zielmarke auf dem hellsten Stern
      let bi = 0; c.stars.forEach((s, i) => { if (s.m < c.stars[bi].m) bi = i; });
      const bp = pts[bi], rr = 11 + (reduce ? 0 : Math.sin(t * 4) * 1.5);
      ctx.strokeStyle = `rgba(255,90,77,${0.85 * fade})`; ctx.lineWidth = 1;
      for (let q = 0; q < 4; q++) {
        const a0 = q * Math.PI / 2 + Math.PI / 4;
        ctx.beginPath(); ctx.arc(bp.x, bp.y, rr, a0 - 0.35, a0 + 0.35); ctx.stroke();
      }

      // Uhr nur sekündlich in den React-State
      const d = new Date();
      const s = d.toLocaleTimeString(lang, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      if (s !== lastClock) { lastClock = s; setClock(s); }
    }

    function loop() {
      cancelAnimationFrame(raf);
      const step = (now: number) => {
        if (!visible || document.hidden) return;
        drawFrame(now);
        if (!reduce) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }
    const onVis = () => { if (!document.hidden) loop(); };
    document.addEventListener("visibilitychange", onVis);
    loop();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, [lang]);

  const P = PREPARED[idx];
  return (
    <Link
      ref={wrapRef}
      href="/sternenhimmel"
      className="hud-card group relative block h-52 w-full overflow-hidden sm:h-64"
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />

      {/* HUD-Ecken */}
      <span aria-hidden="true" className="pointer-events-none absolute left-2 top-2 h-4 w-4 border-l border-t border-accent/70" />
      <span aria-hidden="true" className="pointer-events-none absolute right-2 top-2 h-4 w-4 border-r border-t border-accent/70" />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-2 left-2 h-4 w-4 border-b border-l border-accent/70" />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-2 right-2 h-4 w-4 border-b border-r border-accent/70" />

      {/* Statuszeile */}
      <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/70">
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          LIVE <span className="tabular-nums text-foreground/50">{clock}</span>
        </span>
        <span className="tabular-nums text-foreground/50">
          RA {fmtRa(P.ra)} · DEC {fmtDec(P.dec)}
        </span>
      </div>
      {/* aktuelles Sternbild */}
      <p key={idx} className="pointer-events-none absolute left-4 top-9 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/90">
        ◇ {localize(CONSTELLATIONS[idx].name, lang)}
        <span className="ml-2 font-normal tracking-[0.14em] text-foreground/40">{idx + 1}/{CONSTELLATIONS.length}</span>
      </p>

      {/* Text unten, mit Verlauf für Lesbarkeit */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-4 pt-10">
        <p className="label-mono text-xs uppercase text-accent">{label}</p>
        <p className="mt-1 flex max-w-xl items-center gap-2 text-sm font-semibold text-foreground">
          {title}
          <span className="transition-transform group-hover:translate-x-1">↗</span>
        </p>
      </div>
    </Link>
  );
}
