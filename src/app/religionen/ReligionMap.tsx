"use client";
/* eslint-disable */
// Die Karte arbeitet direkt mit dem DOM (SVG, Zoom, Zeitregler); sie wurde als eigenständige
// Vorschau getestet und hier eins zu eins übernommen.
import { useEffect, useRef } from "react";
import type { Lang } from "@/contexts/LanguageContext";
import { DATA, ISO2, CONV } from "@/lib/religion/data";
import { REL_KEYS, REL_SLUG, relEra, relFacts, relInfo, relNames, relUi } from "@/lib/religion/text";
import { langPath } from "@/lib/seoI18n";

const YEARS = [-5000, -3000, -2000, -1000, -500, 0, 300, 600, 800, 1000, 1200, 1500, 1700, 1900, 2020];
const COLORS: Record<string, string> = { c: "#5b8def", m: "#3fb68b", h: "#ff9f43", b: "#f2d04b", j: "#f4f4f6", s: "#a3e635", z: "#d9534f", a: "#c8a165", n: "#4fd1c5", t: "#ff8fb8", f: "#b07cf0", u: "#8b9099" };

const CSS = `
.rmap{--bg:#060203;--panel:#120a0c;--line:rgba(255,90,77,.35);--fg:#fff2ee;--mut:#b9a39f;--acc:#ff5a4d;--nodata:#1d2530;--sea:#060d18;color:var(--fg);max-width:900px;margin:0 auto;padding:8px 16px;font-family:inherit}
.rmap .wrap{display:flex;flex-direction:column;gap:10px;height:calc(100svh - 110px);min-height:560px}
.rmap h1{font:600 13px/1 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.32em;text-transform:uppercase;color:var(--acc);margin:6px 0 0}
.rmap .sub{font-size:12px;color:var(--mut);margin:4px 0 0}
.rmap .chips{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px}.rmap .chips::-webkit-scrollbar{display:none}
.rmap .chip{flex:none;white-space:nowrap;border:1px solid var(--line);background:rgba(255,90,77,.06);color:var(--fg);border-radius:999px;padding:5px 10px;font-size:11.5px;display:flex;align-items:center;gap:6px;cursor:pointer;font-family:inherit}
.rmap .chip i{width:9px;height:9px;border-radius:50%;display:block}
.rmap .chip.off{opacity:.38}
.rmap .map{position:relative;flex:1;min-height:260px;border:1px solid var(--line);border-radius:14px;background:radial-gradient(130% 90% at 50% 40%,#0d2038,var(--sea) 70%);overflow:hidden;touch-action:none;direction:ltr}
.rmap svg{width:100%;height:100%;display:block}
.rmap .grat line{stroke:rgba(140,170,220,.10);stroke-width:.6;vector-effect:non-scaling-stroke}.rmap .ov{pointer-events:none;stroke:none;fill:none;opacity:.6}.rmap .c{stroke:rgba(5,8,14,.85);stroke-width:.5;vector-effect:non-scaling-stroke;cursor:pointer;transition:fill .5s,opacity .25s}
.rmap .c.dim{opacity:.16}.rmap .c.sel{stroke:#fff;stroke-width:1.6}
.rmap .ld{position:absolute;inset:0;display:grid;place-items:center;font-size:12px;color:var(--mut)}
.rmap .zb{position:absolute;right:8px;top:8px;display:flex;flex-direction:column;gap:6px}
.rmap .zb button{width:34px;height:34px;border-radius:50%;border:1px solid var(--line);background:rgba(10,5,6,.8);color:var(--fg);font-size:18px;line-height:1;cursor:pointer}
.rmap .ctl{display:flex;flex-direction:column;gap:6px;border:1px solid var(--line);border-radius:14px;padding:10px 12px;background:var(--panel)}
.rmap .row{display:flex;align-items:center;gap:10px;direction:ltr}
.rmap .play{width:36px;height:36px;flex:none;border-radius:50%;border:1px solid var(--acc);background:var(--acc);color:#0a0a0a;font-size:14px;cursor:pointer}
.rmap input[type=range]{flex:1;accent-color:var(--acc);min-width:0}
.rmap .ticks{display:flex;justify-content:space-between;font:10px ui-monospace,Menlo,Consolas,monospace;color:var(--mut);padding:0 96px 0 40px;align-items:center;direction:ltr}
.rmap .era{font-size:12.5px;line-height:18px;height:91px;overflow-y:auto;color:var(--fg);margin:0}
.rmap .yr{font:600 15px/1.1 ui-monospace,Menlo,Consolas,monospace;color:var(--acc);min-width:92px;text-align:right}
.rmap .sheet{position:fixed;left:max(8px,env(safe-area-inset-left,0px));right:max(8px,env(safe-area-inset-right,0px));bottom:calc(8px + env(safe-area-inset-bottom,0px));max-width:640px;margin:0 auto;background:rgba(18,10,12,.97);border:1px solid var(--acc);border-radius:16px;padding:14px 14px 12px;box-shadow:0 0 28px rgba(255,90,77,.25),0 10px 30px rgba(0,0,0,.6);transform:translateY(130%);transition:transform .3s;z-index:60;max-height:72vh;overflow:auto;visibility:hidden}
.rmap .sheet.on{transform:none;visibility:visible}.rmap .sheet h2{margin:0 36px 2px 0;font-size:19px;letter-spacing:.02em}
.rmap .sheet .x{position:absolute;right:10px;top:10px;width:32px;height:32px;border-radius:50%;border:1px solid var(--line);background:rgba(255,90,77,.08);color:var(--fg);font-size:17px;cursor:pointer}
.rmap .bar{display:flex;height:12px;border-radius:6px;overflow:hidden;margin:10px 0 8px;background:var(--nodata)}
.rmap .bar span{display:block;height:100%}
.rmap .li{display:flex;align-items:center;gap:8px;font-size:13px;padding:2px 0}
.rmap .li i{width:9px;height:9px;border-radius:50%}
.rmap .li b{margin-left:auto;font-variant-numeric:tabular-nums}
.rmap .note{font-size:11px;color:var(--mut);margin:8px 0 0;line-height:1.4}
.rmap .big{font-size:14px;margin:6px 0 0}.rmap .fact{font-size:12.5px;line-height:1.45;margin:10px 0 0;padding:8px 10px;border-left:3px solid var(--acc);background:rgba(255,90,77,.07);border-radius:4px}
.rmap .kv{display:grid;grid-template-columns:auto 1fr;gap:4px 10px;font-size:12.5px;margin:8px 0 0}.rmap .kv span:nth-child(odd){color:var(--mut)}.rmap .txt{font-size:13px;line-height:1.5;margin:8px 0 0}
.rmap .more{display:inline-block;margin-top:10px;border:1px solid var(--acc);color:var(--acc);padding:7px 12px;font-size:12px;border-radius:999px;text-decoration:none}
`;

function init(root: HTMLElement, lang: Lang): () => void {
  const UI = relUi(lang);
  const NAMES = relNames(lang);
  const INFO = relInfo(lang);
  const ERA = relEra(lang);
  const FACT = relFacts(lang);
  const R = REL_KEYS.map((k, i) => ({ k, n: NAMES[i], v: COLORS[k], i }));
  const IDX: Record<string, number> = {};
  R.forEach((r, i) => (IDX[r.k] = i));
  const LAST = YEARS.length - 1;
  const $ = (s: string) => root.querySelector(s) as HTMLElement;
  // Bei doppeltem Start (React Strict Mode) alles Erzeugte zuerst entfernen
  root.querySelectorAll("#rm-svg defs, #rm-svg .grat, #rm-g > *, #rm-chips > *, #rm-ticks > *").forEach((n) => n.remove());
  const ylab = (y: number) => (y === 2020 ? UI.today : y < 0 ? UI.bce.replace("{y}", String(-y)) : y === 0 ? UI.y0 : String(y));

  let dn: Intl.DisplayNames | null = null;
  try { dn = new Intl.DisplayNames([lang], { type: "region" }); } catch (e) { dn = null; }
  const nameOf = (f: any) => { try { const c = (ISO2 as any)[f.id]; if (c && dn) { const r = dn.of(c); if (r && r !== c) return r; } } catch (e) {} return f.n; };

  const NS = "http://www.w3.org/2000/svg";
  const svg = $("#rm-svg") as unknown as SVGSVGElement;
  const g = svg.querySelector("#rm-g") as SVGGElement;
  const mapEl = $("#rm-map");
  const sheet = $("#rm-sheet");
  const sb = $("#rm-sb");
  const rng = $("#rm-rng") as HTMLInputElement;
  const play = $("#rm-play");
  const sx = $("#rm-sx");
  let alive = true;
  let timer: any = null;

  // Muster für die Mischfarben
  const defs = document.createElementNS(NS, "defs");
  svg.insertBefore(defs, g);
  R.forEach((r) => {
    const pt = document.createElementNS(NS, "pattern");
    pt.setAttribute("id", "rmhat-" + r.k); pt.setAttribute("width", "5"); pt.setAttribute("height", "5");
    pt.setAttribute("patternUnits", "userSpaceOnUse"); pt.setAttribute("patternTransform", "rotate(45)");
    const l = document.createElementNS(NS, "rect");
    l.setAttribute("width", "1.6"); l.setAttribute("height", "5"); l.setAttribute("fill", r.v);
    pt.appendChild(l); defs.appendChild(pt);
  });
  const grat = document.createElementNS(NS, "g");
  grat.setAttribute("class", "grat");
  svg.insertBefore(grat, g);
  const mY = (lat: number) => { lat = Math.max(-80, Math.min(84, lat)); return (-(1.25 * Math.log(Math.tan(Math.PI / 4 + (0.4 * lat * Math.PI) / 180))) / (2 * Math.PI)) * 1000; };
  for (let lo = -180; lo <= 180; lo += 30) { const l = document.createElementNS(NS, "line"); const x = ((lo + 180) / 360) * 1000; l.setAttribute("x1", String(x)); l.setAttribute("x2", String(x)); l.setAttribute("y1", String(mY(84))); l.setAttribute("y2", String(mY(-80))); grat.appendChild(l); }
  for (let la = -60; la <= 80; la += 20) { const l = document.createElementNS(NS, "line"); const y = mY(la); l.setAttribute("x1", "0"); l.setAttribute("x2", "1000"); l.setAttribute("y1", String(y)); l.setAttribute("y2", String(y)); grat.appendChild(l); }

  // Modell
  const sig = (x: number) => 1 / (1 + Math.exp(-x));
  function modelAt(id: string, yr: number): number[] {
    const v = new Array(R.length).fill(0); v[IDX.f] = 1;
    const cs = CONV.filter((c) => c[4].includes(id)).sort((x, y) => x[1] - y[1]);
    for (const [r, mid, w, cap] of cs) {
      const p = cap * sig((yr - mid) / w); const k = IDX[r]; const o = 1 - v[k]; if (o <= 0) continue;
      for (let i = 0; i < v.length; i++) if (i !== k) v[i] *= 1 - p;
      v[k] = v[k] + p * o;
    }
    return v;
  }
  function stateAt(id: string, si: number): number[] {
    const yr = YEARS[si];
    const raw = (DATA as any)[id] as number[] | undefined;
    const fin = raw ? (() => { const s = raw.reduce((a, b) => a + b, 0) || 1; return raw.map((x) => x / s); })() : null;
    if (yr >= 2020 && fin) return fin;
    const m = modelAt(id, Math.min(yr, 1900));
    if (yr > 1900 && fin) { const w = (yr - 1900) / 120; return m.map((x, i) => x * (1 - w) + fin[i] * w); }
    return m;
  }
  const top2 = (v: number[]) => { let a = -1, b = -1; v.forEach((x, i) => { if (a < 0 || x > v[a]) { b = a; a = i; } else if (b < 0 || x > v[b]) b = i; }); return [a, b]; };

  let FEATS: any[] = [];
  let STATE: Record<string, number[]>[] = [];
  const paths: Record<string, SVGPathElement[]> = {};
  let si = LAST; let sel: string | null = null; let filter: string | null = null;
  try { const q = new URLSearchParams(window.location.search).get("r"); if (q && IDX[q] !== undefined) filter = q; } catch (e) {}
  const dom = (id: string, s: number) => { const v = STATE[s][id]; return v ? R[top2(v)[0]].k : null; };
  const link = (k: string) => '<a class="more" href="' + langPath("/religionen/" + REL_SLUG[k as keyof typeof REL_SLUG], lang) + '">' + UI.more.replace("{name}", R[IDX[k]].n) + " →</a>";

  function paint() {
    if (!STATE.length) return;
    FEATS.forEach((f) => {
      const v = STATE[si][f.id]; const ps = paths[f.id]; if (!v) return;
      const [a, b] = top2(v); const k = R[a].k; const col = R[a].v; const st = v[a];
      const op = Math.max(0.42, Math.min(1, 0.3 + st * 0.85)); const hat = v[b] >= 0.28 && st < 0.75;
      ps.forEach((p: any) => {
        p.style.fill = col; p.style.fillOpacity = String(op);
        p.classList.toggle("dim", !!(filter && k !== filter && !(filter === R[b].k && hat)));
        p.classList.toggle("sel", f.id === sel);
        const o = p._ov; if (o) o.style.fill = hat ? "url(#rmhat-" + R[b].k + ")" : "none";
      });
    });
    $("#rm-yr").textContent = ylab(YEARS[si]); $("#rm-era").textContent = ERA[si];
    root.querySelectorAll(".chip").forEach((c: any) => c.classList.toggle("off", !!(filter && c.dataset.k !== filter)));
    if (sel) showInfo(sel); else if (filter) showRel(filter);
  }

  const chips = $("#rm-chips");
  R.forEach((r) => {
    const b = document.createElement("button"); b.className = "chip"; b.dataset.k = r.k;
    b.innerHTML = '<i style="background:' + r.v + '"></i>' + r.n;
    b.onclick = () => { if (filter === r.k) { filter = null; sel = null; sheet.classList.remove("on"); paint(); } else { filter = r.k; sel = null; paint(); } };
    chips.appendChild(b);
  });
  const ticks = $("#rm-ticks");
  YEARS.forEach((y, i) => { const s = document.createElement("span"); s.textContent = i === 0 ? ylab(y) : i === LAST ? UI.today : "·"; ticks.appendChild(s); });

  function showRel(k: string) {
    const r = R[IDX[k]]; const I = (INFO as any)[k]; let n = 0;
    FEATS.forEach((f) => { if (dom(f.id, si) === k) n++; });
    const h = '<h2><i style="display:inline-block;width:11px;height:11px;border-radius:50%;background:' + r.v + ';margin-right:8px"></i>' + r.n + "</h2>" +
      '<div class="kv"><span>' + UI.lWhen + "</span><span>" + I.when + "</span><span>" + UI.lBook + "</span><span>" + I.book + "</span><span>" + UI.lFol + "</span><span>" + I.fol + "</span><span>" + UI.lEpoch + "</span><span>" + UI.epochVal.replace("{n}", String(n)).replace("{y}", ylab(YEARS[si])) + "</span></div>" +
      '<p class="txt">' + I.txt + "</p>" + link(k);
    sb.innerHTML = h; sheet.classList.add("on");
  }
  function showInfo(id: string) {
    const f = FEATS.find((x) => x.id === id); if (!f) return;
    let h = "<h2>" + nameOf(f) + "</h2>";
    const v = STATE[si][id];
    if (v) {
      const pc = v.map((x) => x * 100); const [a] = top2(v);
      h += '<p class="big">' + UI.biggest.replace("{y}", ylab(YEARS[si])).replace("{r}", "<b>" + R[a].n + "</b>").replace("{p}", String(Math.round(pc[a]))) + '</p><div class="bar">' + pc.map((x, i) => (x > 0 ? '<span style="width:' + x + "%;background:" + R[i].v + '"></span>' : "")).join("") + "</div>";
      pc.map((x, i) => [x, i]).sort((p, q) => q[0] - p[0]).filter((p) => p[0] >= 1).forEach(([x, i]) => { h += '<div class="li"><i style="background:' + R[i].v + '"></i>' + R[i].n + "<b>" + Math.round(x) + " %</b></div>"; });
      h += '<p class="txt">' + (INFO as any)[R[a].k].txt + "</p>";
      h += '<p class="note">' + (si === LAST ? UI.noteNow : UI.noteModel) + "</p>";
      if ((FACT as any)[id]) h += '<p class="fact">' + (FACT as any)[id] + "</p>";
      h += link(R[a].k);
    } else if ((FACT as any)[id]) h += '<p class="fact">' + (FACT as any)[id] + "</p>";
    sb.innerHTML = h; sheet.classList.add("on");
  }
  function closeInfo() { sel = null; filter = null; sheet.classList.remove("on"); paint(); }
  sx.onclick = closeInfo;
  rng.oninput = () => { si = +rng.value; paint(); };
  play.onclick = () => {
    if (timer) { clearInterval(timer); timer = null; play.textContent = "▶"; return; }
    si = 0; rng.value = "0"; paint(); play.textContent = "❚❚";
    timer = setInterval(() => { if (si >= LAST) { clearInterval(timer); timer = null; play.textContent = "▶"; return; } si++; rng.value = String(si); paint(); }, 2400);
  };

  // Verschieben / Zoom
  const vb = { x: 400, y: -215, w: 560 }; let cw = 1, ch = 1; let first = true;
  function apply() {
    vb.w = Math.max(70, Math.min(1000, vb.w)); const hh = (vb.w * ch) / cw;
    vb.x = Math.max(-20, Math.min(1020 - vb.w, vb.x));
    const lo = -330, hi = 190 - hh; vb.y = hi < lo ? (lo + hi) / 2 : Math.max(lo, Math.min(hi, vb.y));
    svg.setAttribute("viewBox", vb.x + " " + vb.y + " " + vb.w + " " + hh);
  }
  function size() {
    const r = mapEl.getBoundingClientRect(); if (!r.width || !r.height) return;
    if (first) { cw = r.width; ch = r.height; first = false; vb.y = -40 - (vb.w * ch) / cw / 2; apply(); return; }
    if (Math.abs(r.width - cw) < 1 && Math.abs(r.height - ch) < 1) return;
    const cx = vb.x + vb.w / 2, cy = vb.y + (vb.w * ch) / cw / 2; cw = r.width; ch = r.height;
    vb.x = cx - vb.w / 2; vb.y = cy - (vb.w * ch) / cw / 2; apply();
  }
  function zoom(f: number, cx: number, cy: number) {
    const h = (vb.w * ch) / cw; const px = vb.x + cx * vb.w, py = vb.y + cy * h;
    vb.w = Math.max(70, Math.min(1000, vb.w * f)); const h2 = (vb.w * ch) / cw; vb.x = px - cx * vb.w; vb.y = py - cy * h2; apply();
  }
  const onResize = () => size();
  const onOrient = () => setTimeout(size, 250);
  window.addEventListener("resize", onResize); window.addEventListener("orientationchange", onOrient);
  let ro: ResizeObserver | null = null;
  if (typeof ResizeObserver !== "undefined") { ro = new ResizeObserver(size); ro.observe(mapEl); }
  $("#rm-zi").onclick = () => zoom(0.7, 0.5, 0.5);
  $("#rm-zo").onclick = () => zoom(1 / 0.7, 0.5, 0.5);
  mapEl.addEventListener("wheel", (e: WheelEvent) => { e.preventDefault(); const r = mapEl.getBoundingClientRect(); zoom(e.deltaY < 0 ? 0.85 : 1 / 0.85, (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height); }, { passive: false });
  const P = new Map<number, { x: number; y: number }>(); let moved = 0, pd = 0; let startT: any = null;
  mapEl.addEventListener("pointerdown", (e: PointerEvent) => {
    if ((e.target as HTMLElement).closest(".zb")) return;
    mapEl.setPointerCapture(e.pointerId); P.set(e.pointerId, { x: e.clientX, y: e.clientY }); moved = 0; startT = e.target;
    if (P.size === 2) { const a = [...P.values()]; pd = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y); }
  });
  mapEl.addEventListener("pointermove", (e: PointerEvent) => {
    const p = P.get(e.pointerId); if (!p) return; const dx = e.clientX - p.x, dy = e.clientY - p.y;
    if (P.size === 1) { moved += Math.abs(dx) + Math.abs(dy); vb.x -= (dx * vb.w) / cw; vb.y -= (dy * vb.w) / cw; apply(); }
    p.x = e.clientX; p.y = e.clientY;
    if (P.size === 2) {
      const a = [...P.values()]; const d = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
      if (pd) { const r = mapEl.getBoundingClientRect(); zoom(pd / d, ((a[0].x + a[1].x) / 2 - r.left) / r.width, ((a[0].y + a[1].y) / 2 - r.top) / r.height); }
      pd = d; moved += 10;
    }
  });
  mapEl.addEventListener("pointerup", (e: PointerEvent) => {
    const was = P.size === 1 && moved < 8; P.delete(e.pointerId);
    if (was && startT && startT.dataset && startT.dataset.id) { sel = startT.dataset.id; paint(); }
    else if (was && sheet.classList.contains("on") && !(startT && startT.dataset && startT.dataset.id)) closeInfo();
  });
  mapEl.addEventListener("pointercancel", (e: PointerEvent) => P.delete(e.pointerId));

  size();

  fetch("/data/religion-feats-v1.json")
    .then((r) => r.json())
    .then((feats: any[]) => {
      if (!alive) return;
      FEATS = feats;
      feats.forEach((f) => {
        const p = document.createElementNS(NS, "path") as any; p.setAttribute("d", f.d); p.setAttribute("class", "c"); p.dataset.id = f.id; g.appendChild(p);
        (paths[f.id] = paths[f.id] || []).push(p);
        const o = document.createElementNS(NS, "path"); o.setAttribute("d", f.d); o.setAttribute("class", "ov"); g.appendChild(o); p._ov = o;
      });
      STATE = YEARS.map((y, s) => { const o: Record<string, number[]> = {}; feats.forEach((f) => { if (!o[f.id]) o[f.id] = stateAt(f.id, s); }); return o; });
      const ld = root.querySelector(".ld"); if (ld) ld.remove();
      size(); paint();
    })
    .catch(() => {});

  return () => {
    alive = false;
    if (timer) clearInterval(timer);
    window.removeEventListener("resize", onResize); window.removeEventListener("orientationchange", onOrient);
    if (ro) ro.disconnect();
  };
}

export default function ReligionMap({ lang }: { lang: Lang }) {
  const ref = useRef<HTMLDivElement>(null);
  const ui = relUi(lang);
  useEffect(() => {
    if (!ref.current) return;
    return init(ref.current, lang);
  }, [lang]);
  return (
    <div className="rmap" ref={ref} dir={lang === "ar" || lang === "fa" ? "rtl" : "ltr"} lang={lang}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="wrap">
        <div>
          <h1>{ui.title}</h1>
          <p className="sub">{ui.sub}</p>
        </div>
        <div className="chips" id="rm-chips" />
        <div className="map" id="rm-map">
          <svg id="rm-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={ui.title}>
            <g id="rm-g" />
          </svg>
          <div className="ld">{ui.loading}</div>
          <div className="zb">
            <button id="rm-zi" aria-label={ui.zin}>+</button>
            <button id="rm-zo" aria-label={ui.zout}>−</button>
          </div>
        </div>
        <div className="ctl">
          <div className="row">
            <button className="play" id="rm-play" aria-label={ui.play}>▶</button>
            <input type="range" id="rm-rng" min={0} max={14} step={1} defaultValue={14} aria-label={ui.title} />
            <span className="yr" id="rm-yr">{ui.today}</span>
          </div>
          <div className="ticks" id="rm-ticks" />
          <p className="era" id="rm-era" />
        </div>
      </div>
      <div className="sheet" id="rm-sheet" role="dialog" aria-live="polite">
        <button className="x" id="rm-sx" aria-label={ui.close}>✕</button>
        <div id="rm-sb" />
      </div>
    </div>
  );
}
