// Kepler-Sterne und -Planeten im Sternenhimmel (22.10.2026)
// Daten: NASA Exoplanet Archive (bestätigte Planeten, Entdeckung durch das Kepler-Weltraumteleskop), Stand 22.10.2026.
// - Sterne stehen an ihrer echten Position und erscheinen je nach Helligkeit erst beim Hineinzoomen.
// - Planeten findet man nur über die Suche; danach bleibt die Position des Systems markiert.
// - 3D-Ansicht: künstlerisch, aus echten Daten (Radius, Temperatur) berechnet – keine Fotografie.
(() => {
  const DE = LANG === "de";
  const T = DE ? {
    planets: "Planeten", exo: "Exoplanet", star: "Kepler-Stern", sys: "System", dist: "Entfernung", mag: "Helligkeit", nPl: "Planeten im System",
    starType: "Sterntyp", temp: "Oberfläche", rad: "Radius", mass: "Masse", ly: "Lichtjahre", suns: "Sonnen", earth: "Erde", days: "Tage", au: "AE",
    art: "Künstlerische 3D-Darstellung, berechnet aus echten Daten (Radius, Temperatur). Keine Fotografie – so sieht der Planet nicht zwingend aus.",
    src: "Daten: NASA Exoplanet Archive", open: "Im Archiv ansehen ↗", unknown: "unbekannt", drag: "Ziehen zum Drehen",
    rOrb: "Umlaufzeit", rA: "Abstand zum Stern", rT: "Gleichgewichtstemp.", rR: "Radius", rM: "Masse", rY: "Entdeckt", rType: "Typ",
    t_sub: "Kleiner Gesteinsplanet", t_earth: "Erdgroßer Planet", t_super: "Super-Erde", t_mini: "Mini-Neptun", t_nep: "Neptun-ähnlicher Planet", t_gas: "Gasriese", t_hot: "Heißer Jupiter",
    eye: "Teleskop nötig", cls: { O: "blauer Riese", B: "blauweißer Stern", A: "weißer Stern", F: "gelbweißer Stern", G: "gelber Stern (sonnenähnlich)", K: "orangefarbener Stern", M: "roter Zwerg" },
  } : {
    planets: "Planets", exo: "Exoplanet", star: "Kepler star", sys: "System", dist: "Distance", mag: "Brightness", nPl: "Planets in system",
    starType: "Star type", temp: "Surface", rad: "Radius", mass: "Mass", ly: "light-years", suns: "Suns", earth: "Earth", days: "days", au: "AU",
    art: "Artist's 3D view computed from real data (radius, temperature). Not a photograph – the planet does not necessarily look like this.",
    src: "Data: NASA Exoplanet Archive", open: "View in archive ↗", unknown: "unknown", drag: "Drag to rotate",
    rOrb: "Orbital period", rA: "Distance to star", rT: "Equilibrium temp.", rR: "Radius", rM: "Mass", rY: "Discovered", rType: "Type",
    t_sub: "Small rocky planet", t_earth: "Earth-sized planet", t_super: "Super-Earth", t_mini: "Mini-Neptune", t_nep: "Neptune-like planet", t_gas: "Gas giant", t_hot: "Hot Jupiter",
    eye: "Telescope needed", cls: { O: "blue giant", B: "blue-white star", A: "white star", F: "yellow-white star", G: "yellow star (Sun-like)", K: "orange star", M: "red dwarf" },
  };
  const FAMOUS = ["Kepler-452 b", "Kepler-22 b", "Kepler-186 f", "Kepler-62 f", "Kepler-442 b", "Kepler-16 b", "Kepler-1649 b", "Kepler-438 b", "Kepler-69 c", "Kepler-37 b", "Kepler-10 b", "Kepler-78 b", "Kepler-90 h", "Kepler-11 g", "Kepler-444 b", "Kepler-47 c", "Kepler-1520 b", "Kepler-138 b", "Kepler-296 e", "Kepler-1229 b", "Kepler-1b", "Kepler-7 b", "Kepler-12 b", "Kepler-17 b", "Kepler-20 e"];
  const WIKI_OK = new Set(FAMOUS.filter((n) => !n.endsWith("1b")));
  let HOSTS = [], SORTED = [], BY = new Map(), loading = false, ready = false;
  const vis = [];
  let frameNo = 0;
  const found = new Set();
  try { for (const k of JSON.parse(localStorage.getItem("kep-found") || "[]")) found.add(k); } catch (e) { /* ohne Speicher weiter */ }
  const saveFound = () => { try { localStorage.setItem("kep-found", JSON.stringify([...found].slice(-60))); } catch (e) { /* egal */ } };

  function tempRgb(k) { // Planck-Näherung (Tanner Helland) → "r,g,b"
    const t = Math.max(1000, Math.min(40000, k || 5500)) / 100; let r, g, b;
    r = t <= 66 ? 255 : 329.7 * Math.pow(t - 60, -0.1332);
    g = t <= 66 ? 99.47 * Math.log(t) - 161.1 : 288.1 * Math.pow(t - 60, -0.0755);
    b = t >= 66 ? 255 : t <= 19 ? 0 : 138.5 * Math.log(t - 10) - 305;
    const c = (x) => Math.max(0, Math.min(255, Math.round(x)));
    // zum Weißen hin mischen, damit schwache Punkte nicht zu bunt wirken
    return `${c(r * 0.8 + 51)},${c(g * 0.8 + 51)},${c(b * 0.8 + 51)}`;
  }
  const spClass = (T0) => (T0 >= 30000 ? "O" : T0 >= 10000 ? "B" : T0 >= 7500 ? "A" : T0 >= 6000 ? "F" : T0 >= 5200 ? "G" : T0 >= 3700 ? "K" : "M");

  function build(d) {
    HOSTS = d.map((r) => {
      const ra = r[2] * DEG, dec = r[3] * DEG;
      const h = { id: r[0], alias: r[1], ra, dec, sd: Math.sin(dec), cd: Math.cos(dec), pc: r[4], mag: r[5] != null ? r[5] : 15.2, magKnown: r[5] != null, teff: r[6], srad: r[7], smass: r[8], f: 0 };
      h.col = tempRgb(h.teff);
      h.pl = r[9].map((p) => ({ name: p[0], l: p[1], r: p[2], per: p[3], a: p[4], eqt: p[5], m: p[6], yr: p[7] }));
      return h;
    });
    BY = new Map(HOSTS.map((h) => [h.id, h]));
    SORTED = HOSTS.slice().sort((a, b) => a.mag - b.mag);
    ready = true;
  }
  function load() {
    if (ready || loading) return;
    loading = true;
    fetch("/kepler-data.json").then((r) => r.json()).then((d) => { build(d); loading = false; }).catch(() => { loading = false; });
  }
  setTimeout(load, 2500);

  const hit = (h, letter) => ({ type: "kep", id: h.id, ra: h.ra, dec: h.dec, mag: h.mag, name: h.id, kind: T.star, pl: letter || null, dsoFov: 0.45 * DEG });

  // ---- Himmel ----
  function limMag() { return 8.4 + 3.3 * Math.log10(72 / Math.max(S.fov / DEG, 0.06)); }
  function drawDot(h, fade, lim, sel) {
    eqToEnu(h.ra, h.sd, h.cd, tmpV);
    const under = S.atmo && tmpV[2] < 0;
    if (!project(tmpV, P)) return;
    if (P.x < -20 || P.y < -20 || P.x > W + 20 || P.y > H + 20) return;
    const bright = Math.max(0, lim - h.mag);
    const a = Math.min(1, 0.28 + bright * 0.2) * fade * (under ? 0.4 : 1);
    const r = Math.min(3.2, 0.8 + bright * 0.28);
    if (a > 0.02 && h.mag <= lim) {
      ctx.fillStyle = `rgba(${h.col},${a.toFixed(3)})`;
      ctx.beginPath(); ctx.arc(P.x, P.y, r, 0, 6.2832); ctx.fill();
    }
    vis.push({ h, x: P.x, y: P.y, found: found.has(h.id) || sel });
  }
  function draw(fade) {
    vis.length = 0;
    if (!ready || fade < 0.05) return;
    frameNo++;
    const lim = limMag();
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    for (const h of SORTED) { if (h.mag > lim) break; h.f = frameNo; drawDot(h, fade, lim, false); }
    ctx.restore();
    // gesuchte Systeme bleiben auf jeder Zoomstufe markiert
    const ids = new Set(found); if (S.sel && S.sel.type === "kep") ids.add(S.sel.id);
    for (const id of ids) {
      const h = BY.get(id); if (!h) continue;
      if (h.f !== frameNo) { ctx.save(); ctx.globalCompositeOperation = "lighter"; drawDot(h, fade, Math.max(lim, h.mag + 1), true); ctx.restore(); }
      const v = vis.find((q) => q.h === h); if (!v) continue;
      ctx.save(); ctx.strokeStyle = "rgba(125,220,255,.9)"; ctx.fillStyle = `rgba(${h.col},1)`; ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.arc(v.x, v.y, 2.6, 0, 6.2832); ctx.fill();
      ctx.beginPath(); ctx.arc(v.x, v.y, 9, 0, 6.2832); ctx.stroke();
      ctx.restore();
    }
  }
  function labels(free, fade) {
    if (!vis.length) return;
    ctx.font = "400 12px " + cssVar("--font-sans");
    const showAll = S.fov < 2.5 * DEG;
    let n = 0;
    for (const q of vis) {
      const h = q.h;
      if (!q.found && !(showAll && h.mag < limMag() - 0.5)) continue;
      if (!q.found && ++n > 40) break;
      const lab = h.id + (h.pl.length > 1 ? " · " + h.pl.length : "");
      const w = ctx.measureText(lab).width, y = q.y + 18;
      if (!free(q.x - w / 2, y - 7, w, 14)) continue;
      ctx.fillStyle = q.found ? `rgba(150,230,255,${0.95 * fade})` : `rgba(200,215,255,${0.75 * fade})`;
      haloText(lab, q.x, y);
      labelHits.push({ x0: q.x - w / 2 - 4, y0: y - 9, x1: q.x + w / 2 + 4, y1: y + 9, hit: hit(h) });
    }
  }
  function pick(x, y) {
    let best = null, bd = 18;
    for (const q of vis) { const d = Math.hypot(q.x - x, q.y - y); if (d < bd) { bd = d; best = q.h; } }
    return best ? hit(best) : null;
  }
  function screen(s) {
    const h = BY.get(s.id); if (!h) return null;
    eqToEnu(h.ra, h.sd, h.cd, tmpV);
    return project(tmpV, P) ? { x: P.x, y: P.y, r: 6 } : null;
  }

  // ---- Suche ----
  let idx = null;
  function index() {
    if (!ready) { load(); return []; }
    if (idx) return idx;
    const out = [];
    for (const h of HOSTS) for (const p of h.pl) {
      const nm = p.name, plain = nm.replace(/[-\s]/g, "");
      out.push({ label: nm, alt: nm.replace(/-/g, " ") + " " + plain + " " + h.alias + " exoplanet kepler", kind: T.exo + " · " + T.star, hit: { ...hit(h, p.l), name: nm }, fam: FAMOUS.indexOf(nm) });
    }
    out.sort((a, b) => (b.fam >= 0 ? 1000 - b.fam : 0) - (a.fam >= 0 ? 1000 - a.fam : 0));
    idx = out; return out;
  }
  function mark(h) { if (h && h.type === "kep") { found.add(h.id); saveFound(); } }

  // ---- Planeten-Eigenschaften ----
  function radiusOf(p) {
    if (p.r != null) return p.r;
    if (p.m != null) return p.m < 2 ? Math.pow(p.m, 0.3) : p.m < 130 ? Math.pow(p.m, 0.55) : 11;
    return null;
  }
  function typeOf(p) {
    const R = radiusOf(p); if (R == null) return null;
    if (R >= 6 && p.per != null && p.per < 10) return "t_hot";
    return R < 0.8 ? "t_sub" : R < 1.25 ? "t_earth" : R < 2 ? "t_super" : R < 4 ? "t_mini" : R < 6 ? "t_nep" : "t_gas";
  }
  const lum = (h) => (h.srad != null && h.teff != null ? h.srad * h.srad * Math.pow(h.teff / 5772, 4) : null);
  function fmt(v, d) { return v >= 100 ? nf0.format(v) : v >= 10 ? nf.format(v) : v.toLocaleString(LANG, { maximumFractionDigits: d == null ? 2 : d }); }
  function conOf(h) { return (typeof nearestConstellation === "function" && nearestConstellation(h.ra, h.dec)) || ""; }
  function describe(h, p) {
    const ly = h.pc != null ? h.pc * 3.26156 : null, con = conOf(h), R = radiusOf(p), out = [];
    const L = lum(h);
    if (DE) {
      out.push(`${p.name} ist ein Planet außerhalb unseres Sonnensystems (Exoplanet). Er kreist um den Stern ${h.id}${con ? " im Sternbild " + con : ""}${ly ? ", etwa " + nf0.format(Math.round(ly / (ly > 1000 ? 10 : 1)) * (ly > 1000 ? 10 : 1)) + " Lichtjahre von der Erde entfernt" : ""}.`);
      if (p.r != null) out.push(`Sein Radius beträgt ${fmt(p.r)} Erdradien (≈ ${nf0.format(p.r * 6371)} km)${p.r > 8 ? ", das sind ≈ " + fmt(p.r / 11.21) + " Jupiterradien" : ""}.`);
      if (p.m != null) out.push(`Seine Masse beträgt ≈ ${fmt(p.m)} Erdmassen${p.m > 100 ? " (≈ " + fmt(p.m / 317.8) + " Jupitermassen)" : ""}.`);
      if (p.per != null) {
        const near = p.a != null && p.a < 0.387 ? " – näher an seinem Stern als Merkur an der Sonne" : "";
        out.push(`Er umrundet seinen Stern in ${p.per < 2 ? fmt(p.per * 24, 1) + " Stunden" : fmt(p.per) + " Tagen"}${p.a != null ? " in " + fmt(p.a) + " AE Abstand (Erde–Sonne = 1 AE)" : ""}${near}.`);
      }
      if (p.eqt != null) out.push(`Die Gleichgewichtstemperatur (ohne Atmosphäre gerechnet) liegt bei etwa ${nf0.format(p.eqt - 273.15)} °C.`);
      if (L != null && p.a != null) {
        const lo = Math.sqrt(L / 1.1), hi = Math.sqrt(L / 0.36), lo2 = Math.sqrt(L / 1.78), hi2 = Math.sqrt(L / 0.32);
        if (p.a >= lo && p.a <= hi) out.push(`Er liegt in der habitablen Zone seines Sterns (berechnet ${fmt(lo)}–${fmt(hi)} AE): Dort wäre flüssiges Wasser auf der Oberfläche möglich. Ob es Wasser oder Leben gibt, ist nicht bekannt.`);
        else if (p.a >= lo2 && p.a <= hi2) out.push(`Er liegt am Rand der habitablen Zone seines Sterns (großzügig gerechnet ${fmt(lo2)}–${fmt(hi2)} AE). Ob es Wasser oder Leben gibt, ist nicht bekannt.`);
        else out.push(`Die habitable Zone seines Sterns liegt berechnet bei ${fmt(lo)}–${fmt(hi)} AE – der Planet ${p.a < lo ? "ist dafür zu nah am Stern" : "ist dafür zu weit entfernt"}.`);
      }
      out.push(`Entdeckt${p.yr ? " " + p.yr : ""} mit dem Kepler-Weltraumteleskop der NASA, das winzige Helligkeitsabfälle beim Vorbeiziehen von Planeten vor ihrem Stern misst. Der Planet ist bestätigt.`);
    } else {
      out.push(`${p.name} is a planet outside our Solar System (an exoplanet). It orbits the star ${h.id}${con ? " in the constellation " + con : ""}${ly ? ", about " + nf0.format(Math.round(ly / (ly > 1000 ? 10 : 1)) * (ly > 1000 ? 10 : 1)) + " light-years from Earth" : ""}.`);
      if (p.r != null) out.push(`Its radius is ${fmt(p.r)} Earth radii (≈ ${nf0.format(p.r * 6371)} km)${p.r > 8 ? ", about " + fmt(p.r / 11.21) + " Jupiter radii" : ""}.`);
      if (p.m != null) out.push(`Its mass is ≈ ${fmt(p.m)} Earth masses${p.m > 100 ? " (≈ " + fmt(p.m / 317.8) + " Jupiter masses)" : ""}.`);
      if (p.per != null) {
        const near = p.a != null && p.a < 0.387 ? " – closer to its star than Mercury is to the Sun" : "";
        out.push(`It orbits its star every ${p.per < 2 ? fmt(p.per * 24, 1) + " hours" : fmt(p.per) + " days"}${p.a != null ? " at a distance of " + fmt(p.a) + " AU (Earth–Sun = 1 AU)" : ""}${near}.`);
      }
      if (p.eqt != null) out.push(`Its equilibrium temperature (calculated without an atmosphere) is about ${nf0.format(p.eqt - 273.15)} °C.`);
      if (L != null && p.a != null) {
        const lo = Math.sqrt(L / 1.1), hi = Math.sqrt(L / 0.36), lo2 = Math.sqrt(L / 1.78), hi2 = Math.sqrt(L / 0.32);
        if (p.a >= lo && p.a <= hi) out.push(`It lies in the habitable zone of its star (calculated ${fmt(lo)}–${fmt(hi)} AU), where liquid water could exist on a surface. Whether it has water or life is unknown.`);
        else if (p.a >= lo2 && p.a <= hi2) out.push(`It lies at the edge of the habitable zone of its star (generous estimate ${fmt(lo2)}–${fmt(hi2)} AU). Whether it has water or life is unknown.`);
        else out.push(`The calculated habitable zone of its star is ${fmt(lo)}–${fmt(hi)} AU – the planet is ${p.a < lo ? "too close to the star" : "too far from the star"} for it.`);
      }
      out.push(`Discovered${p.yr ? " in " + p.yr : ""} by NASA's Kepler space telescope, which measures tiny dips in a star's brightness when a planet passes in front of it. The planet is confirmed.`);
    }
    return out;
  }

  // ---- Infofenster ----
  function info(s) {
    const h = BY.get(s.id);
    if (!h) return { name: s.name || s.id, kind: T.star, rows: [], v: eqToEnu(s.ra, Math.sin(s.dec), Math.cos(s.dec), [0, 0, 0]) };
    const rows = [], ly = h.pc != null ? h.pc * 3.26156 : null;
    const sp = h.teff ? spClass(h.teff) : null;
    if (ly) rows.push([T.dist, `≈ ${nf0.format(Math.round(ly / (ly > 1000 ? 10 : 1)) * (ly > 1000 ? 10 : 1))} ${T.ly}`]);
    rows.push([T.nPl, String(h.pl.length)]);
    if (sp) rows.push([T.starType, T.cls[sp]]);
    if (h.teff) rows.push([T.temp, `≈ ${nf0.format(Math.round((h.teff - 273) / 50) * 50)} °C`]);
    if (h.srad != null) rows.push([T.rad, `${fmt(h.srad)} ${T.suns}`]);
    if (h.smass != null) rows.push([T.mass, `${fmt(h.smass)} ${T.suns}`]);
    if (h.magKnown) rows.push([DE ? "Helligkeit" : "Brightness", `${nf.format(h.mag)} mag`]);
    rows.push([DE ? "Sichtbar mit" : "Visible with", h.mag <= 6 ? tr("eye") : h.mag <= 9.5 ? tr("binoculars") : tr("telescope")]);
    const con = conOf(h); if (con) rows.push([tr("constellation"), con]);
    const pl = h.pl.find((q) => q.l === s.pl);
    return { name: pl && s.pl ? pl.name : h.id, kind: (pl && s.pl ? T.exo + " · " : "") + T.star + (sp ? " · " + T.cls[sp] : ""), rows, v: eqToEnu(h.ra, h.sd, h.cd, [0, 0, 0]) };
  }

  // ---- 3D-Planet (künstlerisch, berechnet) ----
  const sm = (a, b, x) => { x = Math.max(0, Math.min(1, (x - a) / (b - a))); return x * x * (3 - 2 * x); };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  function hashStr(s) { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; }
  const TW = 384, TH = 192;
  function eqtOf(h, p) {
    if (p.eqt != null) return p.eqt;
    if (h && h.teff && h.srad && p.a) return h.teff * Math.sqrt(h.srad * 0.00465 / (2 * p.a)) * 0.9147;
    return p.a != null ? 280 / Math.sqrt(p.a) : 400;
  }
  function makeTex(h, p) {
    const R = radiusOf(p) || 2, eqt = eqtOf(h, p), seed = hashStr(p.name) % 9999;
    const tex = new Uint8ClampedArray(TW * TH * 4), glow = new Uint8ClampedArray(TW * TH); // glow: Eigenleuchten (Lava, heiße Riesen)
    let atm = [150, 190, 255], atmK = 0.0;
    const gas = R >= 6, nep = R >= 1.75 && R < 6;
    for (let j = 0; j < TH; j++) {
      const lat = (0.5 - (j + 0.5) / TH) * Math.PI, cl = Math.cos(lat), y = Math.sin(lat);
      for (let i = 0; i < TW; i++) {
        const lon = (i / TW) * 2 * Math.PI, x = cl * Math.cos(lon), z = cl * Math.sin(lon);
        let c, g = 0;
        if (!gas && !nep) {
          const n = mFbm(x * 2.2, y * 2.2, z * 2.2, seed, 5), n2 = mFbm(x * 6 + 9, y * 6, z * 6, seed + 3, 4), cl2 = mFbm(x * 3.2 + 4, y * 3.2, z * 3.2 + 1, seed + 7, 4);
          if (eqt > 1000) { // Lavawelt
            c = mix([34, 24, 22], [70, 48, 40], n2);
            const crack = sm(0.52, 0.62, Math.abs(n - 0.5) < 0.04 ? 0.6 : n2 > 0.64 ? 0.7 : 0);
            c = mix(c, [255, 120, 30], Math.max(crack, sm(0.6, 0.7, n) * 0.5)); g = Math.max(crack, sm(0.62, 0.72, n)) * 255; atm = [255, 120, 60]; atmK = 0.35;
          } else if (eqt > 600) { // verbrannter Fels
            c = mix([92, 70, 58], [150, 118, 92], n * 0.7 + n2 * 0.3); atm = [220, 160, 110]; atmK = 0.25;
          } else if (eqt > 330) { // dichte Wolken wie bei der Venus
            const b = 0.5 + 0.5 * Math.sin(y * 7 + n * 4); c = mix([196, 160, 100], [236, 212, 150], b); atm = [240, 210, 150]; atmK = 0.5;
          } else if (eqt > 215) { // gemäßigt: Ozeane, Land, Eis, Wolken
            const land = n > 0.52;
            if (land) { const h2 = sm(0.52, 0.75, n); c = mix([64, 118, 58], [134, 112, 80], h2 * 0.9 + (n2 - 0.5) * 0.4); } else c = mix([14, 44, 112], [30, 90, 160], sm(0.2, 0.52, n));
            const pole = sm(0.82, 0.92, Math.abs(y) + (n2 - 0.5) * 0.12); c = mix(c, [236, 242, 250], pole);
            const cloud = sm(0.5, 0.72, cl2); c = mix(c, [250, 250, 252], cloud * 0.75); atm = [110, 170, 255]; atmK = 0.55;
          } else { // Eiswelt
            c = mix([196, 214, 232], [240, 246, 252], n); c = mix(c, [120, 150, 180], sm(0.58, 0.64, Math.abs(n2 - 0.5) < 0.03 ? 0.7 : 0) * 0.8); atm = [170, 200, 240]; atmK = 0.3;
          }
        } else {
          const w = mFbm(x * 1.6, y * 1.6, z * 1.6, seed, 4), band = y * (gas ? 9 : 4) + (w - 0.5) * (gas ? 2.4 : 1.2), b = 0.5 + 0.5 * Math.sin(band * 3.1416), fine = mFbm(x * 3, y * 12, z * 3, seed + 5, 4);
          if (gas) {
            if (eqt > 1000) { c = mix([22, 14, 14], [58, 28, 24], b * 0.6 + fine * 0.4); g = sm(0.6, 0.8, fine) * 140; atm = [255, 110, 60]; atmK = 0.35; }
            else if (eqt > 500) { c = mix([120, 96, 76], [188, 156, 120], b * 0.6 + fine * 0.4); atm = [220, 170, 120]; atmK = 0.35; }
            else if (eqt > 150) { c = mix([176, 130, 96], [236, 218, 190], b * 0.65 + fine * 0.35); atm = [230, 200, 160]; atmK = 0.3; }
            else { c = mix([150, 190, 214], [214, 232, 240], b * 0.6 + fine * 0.4); atm = [170, 210, 240]; atmK = 0.4; }
          } else {
            if (eqt > 1200) { c = mix([40, 22, 36], [96, 40, 40], b * 0.5 + fine * 0.5); g = sm(0.6, 0.8, fine) * 120; atm = [255, 120, 80]; atmK = 0.3; }
            else if (eqt > 500) { c = mix([128, 118, 108], [190, 172, 150], b * 0.5 + fine * 0.5); atm = [220, 190, 150]; atmK = 0.35; }
            else { c = mix([48, 100, 200], [110, 170, 235], b * 0.45 + fine * 0.55); c = mix(c, [225, 240, 255], sm(0.72, 0.85, fine) * 0.35); atm = [110, 170, 255]; atmK = 0.5; }
          }
        }
        const k = (j * TW + i) * 4; tex[k] = c[0]; tex[k + 1] = c[1]; tex[k + 2] = c[2]; tex[k + 3] = 255; glow[j * TW + i] = g;
      }
    }
    return { tex, glow, atm, atmK };
  }
  function startSphere(cv, h, p) {
    const N = 240, ctx2 = cv.getContext("2d"); cv.width = N; cv.height = N;
    const T0 = makeTex(h, p), img = ctx2.createImageData(N, N), d = img.data;
    const tilt = 0.28, ct = Math.cos(tilt), st = Math.sin(tilt);
    let rot = 0, last = performance.now(), dragging = false, lx = 0;
    const L = (() => { const v = [-0.62, 0.3, 0.72], n = Math.hypot(...v); return v.map((x) => x / n); })();
    cv.onpointerdown = (e) => { dragging = true; lx = e.clientX; try { cv.setPointerCapture(e.pointerId); } catch (_) { /* egal */ } };
    cv.onpointermove = (e) => { if (dragging) { rot -= (e.clientX - lx) * 0.012; lx = e.clientX; } };
    cv.onpointerup = cv.onpointercancel = () => { dragging = false; };
    function frame(now) {
      if (!cv.isConnected) return;
      if (now - last > 30) {
        if (!dragging) rot += (now - last) * 0.00018; last = now;
        const R0 = N / 2 - 6, tex = T0.tex, gl = T0.glow, am = T0.atm, ak = T0.atmK;
        for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
          const nx = (x - N / 2 + 0.5) / R0, ny = -(y - N / 2 + 0.5) / R0, r2 = nx * nx + ny * ny, k = (y * N + x) * 4;
          if (r2 > 1.06) { d[k + 3] = 0; continue; }
          if (r2 > 1) { // dünner Atmosphärenrand außerhalb
            const e = (1.06 - r2) / 0.06, lit = Math.max(0, nx * L[0] + ny * L[1] + 0.35);
            d[k] = am[0]; d[k + 1] = am[1]; d[k + 2] = am[2]; d[k + 3] = e * e * 150 * ak * Math.min(1, lit); continue;
          }
          const nz = Math.sqrt(1 - r2);
          const px = nx, py = ny * ct + nz * st, pz = -ny * st + nz * ct; // Neigung der Drehachse
          const lat = Math.asin(py), lon = Math.atan2(pz, px) + rot;
          const u = (((lon / (2 * Math.PI)) % 1) + 1) % 1, v = 0.5 - lat / Math.PI;
          const fu = u * TW - 0.5, fv = Math.max(0, Math.min(TH - 1.001, v * TH - 0.5)), i0 = Math.floor(fu), j0 = Math.floor(fv), ax = fu - i0, ay = fv - j0;
          const ia = ((i0 % TW) + TW) % TW, ib = (ia + 1) % TW, k00 = (j0 * TW + ia) * 4, k10 = (j0 * TW + ib) * 4, k01 = ((j0 + 1) * TW + ia) * 4, k11 = ((j0 + 1) * TW + ib) * 4;
          const w00 = (1 - ax) * (1 - ay), w10 = ax * (1 - ay), w01 = (1 - ax) * ay, w11 = ax * ay;
          const tr0 = tex[k00] * w00 + tex[k10] * w10 + tex[k01] * w01 + tex[k11] * w11, tg0 = tex[k00 + 1] * w00 + tex[k10 + 1] * w10 + tex[k01 + 1] * w01 + tex[k11 + 1] * w11, tb0 = tex[k00 + 2] * w00 + tex[k10 + 2] * w10 + tex[k01 + 2] * w01 + tex[k11 + 2] * w11;
          const dif = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]), lit = 0.07 + 0.93 * Math.pow(dif, 0.85), g = gl[Math.round(fv) * TW + ia] / 255;
          const rim = Math.pow(1 - nz, 3) * ak * (0.25 + 0.75 * Math.min(1, dif + 0.15));
          let rr = tr0 * lit, gg = tg0 * lit, bb = tb0 * lit;
          rr = rr * (1 - rim) + am[0] * rim; gg = gg * (1 - rim) + am[1] * rim; bb = bb * (1 - rim) + am[2] * rim;
          rr += tr0 * g * 0.9 * (1 - lit); gg += tg0 * g * 0.5 * (1 - lit); bb += tb0 * g * 0.2 * (1 - lit);
          d[k] = rr > 255 ? 255 : rr; d[k + 1] = gg > 255 ? 255 : gg; d[k + 2] = bb > 255 ? 255 : bb; d[k + 3] = 255;
        }
        ctx2.putImageData(img, 0, 0);
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function box(s) {
    let el = document.getElementById("kepBox");
    if (!(s && s.type === "kep")) { if (el) el.remove(); return; }
    const h = BY.get(s.id); if (!h) return;
    const key = s.id + ":" + LANG + ":" + (s.pl || "");
    if (el && el.dataset.key === key) return;
    const host = document.getElementById("infoWiki");
    if (!host || !host.parentNode) return;
    if (el) el.remove();
    el = document.createElement("div"); el.id = "kepBox"; el.dataset.key = key; el.style.cssText = "margin:10px 0 12px";
    const head = document.createElement("div"); head.textContent = `${T.planets} (${h.pl.length})`; head.style.cssText = "font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.7;margin-bottom:6px";
    const chips = document.createElement("div"); chips.style.cssText = "display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px";
    const body = document.createElement("div");
    const show = (p) => {
      for (const c of chips.children) { const on = c.dataset.l === p.l; c.style.background = on ? "var(--accent,#ff5a4d)" : "rgba(255,255,255,.06)"; c.style.borderColor = on ? "var(--accent,#ff5a4d)" : "rgba(255,255,255,.25)"; }
      body.innerHTML = "";
      const R = radiusOf(p), cv = document.createElement("canvas");
      if (R != null) {
        cv.style.cssText = "display:block;width:220px;max-width:100%;aspect-ratio:1;margin:4px auto 2px;touch-action:pan-y;cursor:grab";
        body.appendChild(cv); startSphere(cv, h, p);
        const cp = document.createElement("div"); cp.textContent = T.drag + " · " + T.art; cp.style.cssText = "font-size:11px;opacity:.6;text-align:center;line-height:1.4;margin:2px 0 10px";
        body.appendChild(cp);
      }
      const ty = typeOf(p), grid = document.createElement("div"); grid.style.cssText = "display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:6px;margin-bottom:10px";
      const cell = (a, b) => { const c = document.createElement("div"); c.style.cssText = "background:rgba(255,255,255,.05);border-radius:8px;padding:6px 9px"; const sa = document.createElement("div"); sa.textContent = a; sa.style.cssText = "font-size:10.5px;opacity:.65"; const sb = document.createElement("div"); sb.textContent = b; sb.style.cssText = "font-size:14px;font-weight:600"; c.append(sa, sb); grid.appendChild(c); };
      if (ty) cell(T.rType, T[ty]);
      if (p.r != null) cell(T.rR, `${fmt(p.r)} ${T.earth}`);
      if (p.m != null) cell(T.rM, `${fmt(p.m)} ${T.earth}`);
      if (p.per != null) cell(T.rOrb, `${fmt(p.per)} ${T.days}`);
      if (p.a != null) cell(T.rA, `${fmt(p.a)} ${T.au}`);
      if (p.eqt != null) cell(T.rT, `${nf0.format(p.eqt - 273.15)} °C`);
      if (p.yr) cell(T.rY, String(p.yr));
      body.appendChild(grid);
      for (const t of describe(h, p)) { const pp = document.createElement("p"); pp.textContent = t; pp.style.cssText = "margin:0 0 8px;font-size:13.5px;line-height:1.5;opacity:.92"; body.appendChild(pp); }
      const a = document.createElement("a"); a.href = "https://exoplanetarchive.ipac.caltech.edu/overview/" + encodeURIComponent(p.name); a.target = "_blank"; a.rel = "noopener"; a.textContent = T.src + " · " + T.open; a.style.cssText = "font-size:12px;color:#9fc2ff";
      body.appendChild(a);
    };
    for (const p of h.pl) {
      const b = document.createElement("button"); b.type = "button"; b.dataset.l = p.l; b.textContent = p.l;
      b.style.cssText = "min-width:38px;padding:6px 12px;border-radius:999px;border:1px solid rgba(255,255,255,.25);color:#fff;font:inherit;font-size:14px;cursor:pointer";
      b.onclick = () => show(p); chips.appendChild(b);
    }
    el.append(head, chips, body); host.parentNode.insertBefore(el, host);
    show(h.pl.find((q) => q.l === s.pl) || h.pl[0]);
  }
  function wiki(s) {
    const h = BY.get(s.id); if (!h) return [];
    const p = h.pl.find((q) => q.l === s.pl) || h.pl.find((q) => WIKI_OK.has(q.name));
    if (p && WIKI_OK.has(p.name)) return [p.name.replace(/ ([a-z])$/, "$1"), h.id];
    return [];
  }
  window.KEP = { draw, labels, pick, screen, index, mark, info, box, wiki, load, isReady: () => ready };
})();
