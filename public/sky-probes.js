// New Horizons, Pioneer 10 und Pioneer 11 im Sternenhimmel (23.10.2026).
// Positionen: JPL Horizons (heliozentrisch, Ekliptik J2000, Stand 29.09.2026), danach geradliniger Flug.
// Bilder: Wikimedia Commons (NASA, gemeinfrei bzw. CC). Texte: Deutsch und Englisch.
(() => {
  const AU = 149597870.7, J0 = 2461312.5, de = LANG === "de";
  const PR = [
    {
      n: "New Horizons", p: [20.84104038231505, -62.26142341019754, 2.28995203316894], v: [3.065525536096683e-3, -7.213339226210434e-3, 2.838786480056105e-4],
      status: de ? "aktiv – fliegt durch den Kuipergürtel" : "active – flying through the Kuiper Belt",
      ev: [["2006-01-19", "Start", "Launch"], ["2007-02-28", "Jupiter-Vorbeiflug (Schwerkraft-Schub)", "Jupiter flyby (gravity assist)"], ["2015-07-14", "Pluto-Vorbeiflug in ≈ 12.500 km", "Pluto flyby at ≈ 12,500 km"], ["2019-01-01", "Arrokoth-Vorbeiflug (damals „Ultima Thule“)", "Arrokoth flyby (then 'Ultima Thule')"]],
      facts: de
        ? ["Einzige Sonde, die Pluto besucht hat. Sie zeigte Berge aus Wassereis und das herzförmige Gebiet Sputnik Planitia.", "Arrokoth war beim Vorbeiflug der entfernteste Himmelskörper, der je aus der Nähe erkundet wurde.", "An Bord: ein Teil der Asche von Clyde Tombaugh, dem Entdecker des Pluto.", "Sie ist schneller als die Pioneers (≈ 13,6 km/s) und sendet noch Daten zur Erde."]
        : ["The only probe that has visited Pluto. It revealed mountains of water ice and the heart-shaped region Sputnik Planitia.", "At the time of the flyby Arrokoth was the most distant world ever explored up close.", "Aboard: some of the ashes of Clyde Tombaugh, who discovered Pluto.", "It is faster than the Pioneers (≈ 13.6 km/s) and still sends data to Earth."],
      imgs: [["New Horizons spacecraft model 1.png", "New Horizons (Modell)", "New Horizons (model)"], ["Nh-pluto charon color final.png", "Pluto und Charon, 2015", "Pluto and Charon, 2015"], ["Jupiter taken by New Horizons probe (2007-01-08).jpg", "Jupiter, 2007", "Jupiter, 2007"], ["UltimaThule CA06 color 20190516.png", "Arrokoth, 2019", "Arrokoth, 2019"], ["New Horizons encapsulation.jpg", "Vor dem Start", "Before launch"]],
    },
    {
      n: "Pioneer 10", p: [24.06964926989196, 139.6635488012244, 7.391724737317654], v: [7.086069642320345e-4, 6.798182713802539e-3, 3.482821106134572e-4],
      status: de ? "Kontakt verloren (letztes Signal 23.01.2003)" : "contact lost (last signal Jan 23, 2003)",
      ev: [["1972-03-02", "Start", "Launch"], ["1973-12-03", "Jupiter-Vorbeiflug in ≈ 130.000 km – erste Sonde am Jupiter", "Jupiter flyby at ≈ 130,000 km – first probe at Jupiter"], ["1983-06-13", "Überquert die Bahn des Neptun", "Crosses the orbit of Neptune"], ["2003-01-23", "Letztes schwaches Signal", "Last faint signal"]],
      facts: de
        ? ["Erste Sonde, die den Asteroidengürtel durchquerte, und die erste am Jupiter.", "Sie lieferte die ersten Nahaufnahmen von Jupiter und maß seine starke Strahlung.", "Flugrichtung: ungefähr zum Stern Aldebaran im Stier – in rund zwei Millionen Jahren.", "An Bord ist die Pioneer-Plakette, eine Botschaft von Carl Sagan, Frank Drake und Linda Salzman Sagan."]
        : ["The first probe to cross the asteroid belt and the first at Jupiter.", "It returned the first close-ups of Jupiter and measured its intense radiation.", "Heading roughly toward the star Aldebaran in Taurus – in about two million years.", "Aboard is the Pioneer plaque, a message by Carl Sagan, Frank Drake and Linda Salzman Sagan."],
      imgs: [["Pioneer 10-11 spacecraft.jpg", "Pioneer-Sonde (10 und 11 sind baugleich)", "Pioneer spacecraft (10 and 11 are identical)"], ["Pioneer10-plaque.jpg", "Die Pioneer-Plakette", "The Pioneer plaque"], ["Pioneer 10 Jupiter 1974 GPN-2000-001698.jpg", "Jupiter, aufgenommen von Pioneer 10", "Jupiter, taken by Pioneer 10"], ["Artist- Rick Guidice Pioneer (10) passing Jupiter (ARC-1973-AC73-4247).jpg", "Pioneer 10 bei Jupiter (Illustration)", "Pioneer 10 at Jupiter (illustration)"], ["An artist's impression of a Pioneer spacecraft on its way to interstellar space.jpg", "Auf dem Weg ins All (Illustration)", "On its way into interstellar space (illustration)"]],
    },
    {
      n: "Pioneer 11", p: [29.08234362620209, -110.7568172418941, 28.22640568707866], v: [2.331824354489246e-3, -5.830907467448025e-3, 1.404247187092030e-3],
      status: de ? "Kontakt verloren (Sept. 1995)" : "contact lost (Sept 1995)",
      ev: [["1973-04-06", "Start", "Launch"], ["1974-12-03", "Jupiter-Vorbeiflug in ≈ 43.000 km", "Jupiter flyby at ≈ 43,000 km"], ["1979-09-01", "Saturn-Vorbeiflug in ≈ 21.000 km – erste Sonde am Saturn", "Saturn flyby at ≈ 21,000 km – first probe at Saturn"], ["1995-09-30", "Letzter normaler Kontakt", "Last routine contact"]],
      facts: de
        ? ["Erste Sonde am Saturn. Sie entdeckte den dünnen F-Ring.", "Nach Jupiter schwenkte sie quer durch das Sonnensystem zum Saturn – nur dank Jupiters Schwerkraft.", "Flugrichtung: zum Sternbild Adler.", "Wie Pioneer 10 trägt sie eine Plakette mit einer Botschaft an mögliche Außerirdische."]
        : ["The first probe at Saturn. It discovered the thin F ring.", "After Jupiter it swung across the Solar System to Saturn – thanks to Jupiter's gravity alone.", "Heading toward the constellation Aquila.", "Like Pioneer 10 it carries a plaque with a message for possible extraterrestrials."],
      imgs: [["Pioneer 10-11 spacecraft.jpg", "Pioneer-Sonde (10 und 11 sind baugleich)", "Pioneer spacecraft (10 and 11 are identical)"], ["Pioneer 11 Image of Saturn and Its Moon Titan.jpg", "Saturn und Titan, 1979", "Saturn and Titan, 1979"], ["Pioneer11 Saturn rings.jpg", "Saturnringe, Pioneer 11", "Saturn's rings, Pioneer 11"], ["An artist's impression of the encounter between Pioneer 11 and Saturn.jpg", "Pioneer 11 bei Saturn (Illustration)", "Pioneer 11 at Saturn (illustration)"], ["Pioneer plaque mounted on the spacecraft.jpg", "Die Plakette an der Sonde", "The plaque mounted on the spacecraft"]],
    },
  ];
  PR[1].plaque = PR[2].plaque = true;
  const PLQ = de
    ? { h: "Die Pioneer-Plakette", intro: "Eine 15 × 23 cm große, vergoldete Aluminiumplatte mit eingravierten Linien – eine Botschaft für mögliche Außerirdische. Anders als bei der Goldenen Schallplatte von Voyager gibt es hier keinen Ton: nur eine Zeichnung. Entworfen von Carl Sagan, Frank Drake und Linda Salzman Sagan. Sie ist an beiden Sonden an der Antennenstrebe angebracht, geschützt vor Mikrometeoriten.", items: [["Wasserstoff-Atom (oben links)", "Zwei Wasserstoff-Atome beim „Umklappen“ des Elektronenspins. Dieser Übergang sendet Strahlung mit 21 cm Wellenlänge (Frequenz 1420 MHz) und dient als universelles Maß für Länge (21 cm) und Zeit (0,7 Nanosekunden)."], ["Mann und Frau", "Zwei Menschen in Originalgröße. Der Mann hebt die Hand zum Gruß. Neben ihnen steht die Sonde im Umriss – so lässt sich die Körpergröße berechnen (die Frau ist 8 × 21 cm = 168 cm groß)."], ["Pulsar-Karte (links)", "14 Linien zeigen die Richtung und Entfernung zu 14 Pulsaren vom Sonnensystem aus. Die Zahlen (in binär) geben ihre Pulsperiode an – so lässt sich die Position der Sonne finden und, weil Pulsare langsamer werden, auch das Alter der Sonde."], ["Das Sonnensystem (unten)", "Die Sonne und neun Planeten mit relativen Abständen in Binärzahlen. Der Flugweg der Sonde führt von der dritten Kugel (Erde) an Jupiter vorbei und aus dem System heraus."]] }
    : { h: "The Pioneer plaque", intro: "A 15 × 23 cm gold-anodized aluminium plate with engraved lines – a message for possible extraterrestrials. Unlike Voyager's Golden Record it has no sound, only a drawing. Designed by Carl Sagan, Frank Drake and Linda Salzman Sagan. It is mounted on the antenna struts of both probes, shielded from micrometeoroids.", items: [["Hydrogen atom (top left)", "Two hydrogen atoms in the 'spin-flip' transition. It emits radiation at 21 cm wavelength (1420 MHz) and serves as a universal unit of length (21 cm) and time (0.7 nanoseconds)."], ["Man and woman", "Two humans at true scale. The man raises a hand in greeting. The silhouette of the probe behind them lets anyone calculate their height (the woman is 8 × 21 cm = 168 cm)."], ["Pulsar map (left)", "14 lines show direction and distance from the Sun to 14 pulsars. The numbers (in binary) give their pulse periods – so one can locate the Sun and, since pulsars slow down, even work out the probe's age."], ["The Solar System (bottom)", "The Sun and nine planets with relative distances in binary numbers. The probe's path leads from the third planet (Earth) past Jupiter and out of the system."]] };
  const N = PR.length;
  const tx = de
    ? { kind: "Raumsonde", sun: "Abstand zur Sonne", earth: "Abstand zur Erde", spd: "Geschwindigkeit", sig: "Funksignal braucht", status: "Status", tl: "Stationen", facts: "Wissenswertes", pics: "Bilder", src: "Daten: NASA/JPL (Horizons) · Bilder: Wikimedia Commons (NASA, gemeinfrei/CC)", pos: "Position am Himmel", calc: "Position berechnet, nicht gemessen." }
    : { kind: "Space probe", sun: "Distance from the Sun", earth: "Distance from Earth", spd: "Speed", sig: "Radio signal takes", status: "Status", tl: "Milestones", facts: "Facts", pics: "Pictures", src: "Data: NASA/JPL (Horizons) · Images: Wikimedia Commons (NASA, public domain/CC)", pos: "Position in the sky", calc: "Position calculated, not measured." };
  const fp = (name, w) => "https://commons.wikimedia.org/wiki/Special:FilePath/" + encodeURIComponent(name) + (w ? "?width=" + w : "");
  const nf = (x, d) => { try { return new Intl.NumberFormat(LANG, { minimumFractionDigits: d, maximumFractionDigits: d }).format(x); } catch (e) { return x.toFixed(d); } };
  let dfmt = null; try { dfmt = new Intl.DateTimeFormat(LANG, { dateStyle: "long", timeZone: "UTC" }); } catch (e) { /* ohne */ }
  const ds = (iso) => (dfmt ? dfmt.format(new Date(iso + "T12:00:00Z")) : iso);
  function state(i, jd) {
    const g = PR[i], t = jd - J0, p = [g.p[0] + g.v[0] * t, g.p[1] + g.v[1] * t, g.p[2] + g.v[2] * t];
    const e = helio("earth", jd), d = [p[0] - e[0], p[1] - e[1], p[2] - e[2]], q = eclToRaDec(d[0], d[1], d[2]);
    return { r: Math.hypot(p[0], p[1], p[2]), de: Math.hypot(d[0], d[1], d[2]), ra: q.ra, dec: q.dec, spd: Math.hypot(g.v[0], g.v[1], g.v[2]) * AU / 86400 };
  }
  const st = document.createElement("style");
  st.textContent = "#prbChip{position:fixed;z-index:2;left:50%;bottom:calc(18px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);padding:11px 26px;border-radius:999px;border:1px solid var(--line);background:var(--glass);color:var(--ink);font:500 17px var(--font-sans);cursor:pointer;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);white-space:nowrap}#prbChip[hidden],#prbPanel[hidden],#prbLb[hidden]{display:none}#prbPanel{position:fixed;z-index:5;inset:0;overflow-y:auto;background:rgba(4,6,18,.97);color:var(--ink);-webkit-overflow-scrolling:touch}#prbPanel .w{max-width:760px;margin:0 auto;padding:calc(10px + env(safe-area-inset-top,0px)) 16px calc(48px + env(safe-area-inset-bottom,0px))}#prbPanel .top{display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:2;padding:8px 0;background:linear-gradient(rgba(4,6,18,.98),rgba(4,6,18,.85) 80%,rgba(4,6,18,0))}#prbPanel .k{font-size:11px;letter-spacing:.14em;text-transform:uppercase;opacity:.65}#prbPanel .x{width:40px;height:40px;border-radius:50%;border:1px solid var(--line);background:rgba(255,255,255,.06);color:var(--ink);font-size:22px;cursor:pointer}#prbPanel h2{font:600 28px var(--font-sans);margin:6px 0 14px}#prbPanel .g{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin-bottom:18px}#prbPanel .c{border:1px solid var(--line);border-radius:10px;padding:9px 11px;background:rgba(255,255,255,.04)}#prbPanel .c.wide{grid-column:1/-1}#prbPanel .c small{display:block;font-size:11px;opacity:.6;margin-bottom:2px}#prbPanel .c b{font-weight:600;font-size:15px}#prbPanel .s{font-size:11px;letter-spacing:.14em;text-transform:uppercase;opacity:.65;margin:18px 0 8px}#prbPanel ul.t{list-style:none;margin:0;padding:0 0 0 14px;border-left:1px solid var(--line)}#prbPanel ul.t li{margin:0 0 10px;font-size:14px;line-height:1.4}#prbPanel ul.t small{display:block;opacity:.6;font-size:11px}#prbPanel ul.f{margin:0;padding:0 0 0 18px;font-size:14px;line-height:1.55;opacity:.92}#prbPanel ul.f li{margin:0 0 8px}#prbPanel .gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}#prbPanel .gal a{display:block;color:inherit;text-decoration:none;font-size:11px;line-height:1.3;opacity:.9}#prbPanel .gal img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:8px;background:#000;display:block;margin-bottom:3px}#prbPanel .foot{font-size:11px;opacity:.55;margin-top:22px}#prbLb{position:fixed;z-index:9;inset:0;background:rgba(0,0,0,.94);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:16px;color:#fff;font-size:13px;text-align:center}#prbLb img{max-width:100%;max-height:80vh;object-fit:contain}";
  document.head.appendChild(st);
  const info = document.getElementById("info");
  const cv = document.createElement("canvas"); cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:1"; document.body.appendChild(cv);
  const cx = cv.getContext("2d");
  const chip = document.createElement("button"); chip.id = "prbChip"; chip.type = "button"; chip.hidden = true; document.body.appendChild(chip);
  const panel = document.createElement("div"); panel.id = "prbPanel"; panel.hidden = true; document.body.appendChild(panel);
  const lb = document.createElement("div"); lb.id = "prbLb"; lb.hidden = true; document.body.appendChild(lb); lb.onclick = () => { lb.hidden = true; lb.innerHTML = ""; };
  let sel = -1, live = null; const mk = new Array(N).fill(null);
  function el(tag, cls, txt) { const e = document.createElement(tag); if (cls) e.className = cls; if (txt !== undefined) e.textContent = txt; return e; }
  function loop() {
    requestAnimationFrame(loop);
    const dpr = Math.min(2, window.devicePixelRatio || 1), w = innerWidth, h = innerHeight;
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.clearRect(0, 0, w, h);
    let jd = 0; try { jd = simJd(); } catch (e) { return; }
    for (let i = 0; i < N; i++) {
      mk[i] = null; const s = state(i, jd), v = [0, 0, 0], o = {};
      eqToEnu(s.ra, Math.sin(s.dec), Math.cos(s.dec), v);
      if (!project(v, o) || o.z < -0.2 || o.x < -30 || o.x > w + 30 || o.y < -30 || o.y > h + 30) continue;
      mk[i] = { x: o.x, y: o.y };
      cx.save(); cx.globalAlpha = S.atmo && v[2] < 0 ? 0.35 : 1; cx.strokeStyle = "#ffd9a0"; cx.lineWidth = 1.5;
      cx.beginPath(); cx.moveTo(o.x, o.y - 9); cx.lineTo(o.x + 9, o.y); cx.lineTo(o.x, o.y + 9); cx.lineTo(o.x - 9, o.y); cx.closePath(); cx.stroke();
      cx.fillStyle = "#fff3dc"; cx.beginPath(); cx.arc(o.x, o.y, 2, 0, 6.2832); cx.fill();
      if (sel === i) { cx.beginPath(); cx.arc(o.x, o.y, 17, 0, 6.2832); cx.stroke(); }
      cx.font = "500 12px " + cssVar("--font-sans"); cx.textAlign = "left"; cx.textBaseline = "middle"; cx.fillStyle = "rgba(235,238,255,.92)"; cx.fillText(PR[i].n, o.x + 14, o.y);
      cx.restore();
    }
  }
  requestAnimationFrame(loop);
  function closeAll() { sel = -1; chip.hidden = true; panel.hidden = true; clearInterval(live); live = null; }
  function pick(i) {
    sel = i; try { S.sel = null; S.selConst = null; info.hidden = true; } catch (e) { /* egal */ }
    chip.textContent = PR[i].n; chip.hidden = false; panel.hidden = true;
    try { const s = state(i, simJd()); zoomTo({ type: "star", ra: s.ra, dec: s.dec, wide: true }); } catch (e) { /* egal */ }
  }
  let dn = null;
  addEventListener("pointerdown", (e) => { dn = [e.clientX, e.clientY]; }, true);
  addEventListener("pointerup", (e) => {
    if (!dn) return; const m = Math.hypot(e.clientX - dn[0], e.clientY - dn[1]); dn = null; if (m > 8) return;
    if (e.target.closest && e.target.closest("button,#info,#prbPanel,#voyPanel,.sheet,#searchSheet")) return;
    for (let i = 0; i < N; i++) { const k = mk[i]; if (k && Math.hypot(k.x - e.clientX, k.y - e.clientY) < 30) { setTimeout(() => pick(i), 0); return; } }
    if (sel >= 0) closeAll();
  }, false);
  setInterval(() => { if (sel >= 0 && S.sel) closeAll(); }, 250);
  chip.onclick = () => { chip.hidden = true; open(sel); };
  addEventListener("keydown", (e) => { if (e.key === "Escape") { if (!lb.hidden) lb.click(); else if (!panel.hidden) closeAll(); } });
  const qEl = document.getElementById("q"), resEl = document.getElementById("results");
  if (qEl && resEl) qEl.addEventListener("input", () => {
    const q = qEl.value.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    if (q.length < 2) return;
    for (let i = N - 1; i >= 0; i--) {
      const nm = PR[i].n.toLowerCase();
      if (!(nm.includes(q) || (q === "pioneer" && i > 0) || (q === "sonde" || q === "probe" || q === "raumsonde"))) continue;
      const li = document.createElement("li"), bt = document.createElement("button"); bt.innerHTML = "<b></b><span></span>";
      bt.firstChild.textContent = PR[i].n; bt.lastChild.textContent = tx.kind + " · " + PR[i].ev[0][0].slice(0, 4);
      bt.onclick = () => { try { openSheet(null); } catch (e) { /* egal */ } qEl.value = ""; resEl.innerHTML = ""; pick(i); chip.hidden = true; open(i); };
      li.appendChild(bt); resEl.insertBefore(li, resEl.firstChild);
    }
  });
  function showImg(list, j) {
    const im0 = list[j]; lb.innerHTML = "";
    const im = document.createElement("img"); im.referrerPolicy = "no-referrer"; im.alt = im0[0]; im.src = fp(im0[0], 1600); im.onclick = (e) => e.stopPropagation();
    const d = el("div", "", (de ? im0[1] : im0[2]) + " · " + (j + 1) + "/" + list.length + " · "); const a = document.createElement("a");
    a.href = "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(im0[0].replace(/ /g, "_")); a.target = "_blank"; a.rel = "noopener"; a.textContent = "Commons ↗"; a.style.color = "inherit"; a.onclick = (e) => e.stopPropagation();
    d.appendChild(a); lb.appendChild(im); lb.appendChild(d);
    if (list.length > 1) {
      const nx = el("button", "", "›"); nx.style.cssText = "position:absolute;right:10px;top:50%;font-size:34px;background:none;border:0;color:#fff;cursor:pointer;padding:14px"; nx.onclick = (e) => { e.stopPropagation(); showImg(list, (j + 1) % list.length); };
      const pv = el("button", "", "‹"); pv.style.cssText = "position:absolute;left:10px;top:50%;font-size:34px;background:none;border:0;color:#fff;cursor:pointer;padding:14px"; pv.onclick = (e) => { e.stopPropagation(); showImg(list, (j - 1 + list.length) % list.length); };
      lb.append(pv, nx);
    }
    lb.hidden = false;
  }
  function stat(label, id, wide) { const c = el("div", wide ? "c wide" : "c"); c.append(el("small", "", label)); const b = el("b"); b.id = id; c.append(b); return c; }
  function open(i) {
    const g = PR[i]; panel.innerHTML = ""; panel.hidden = false; panel.scrollTop = 0;
    const wrap = el("div", "w"), top = el("div", "top"), x = el("button", "x", "×"); x.type = "button"; x.onclick = closeAll;
    top.append(el("span", "k", tx.kind), x); wrap.append(top, el("h2", "", g.n));
    const grid = el("div", "g");
    grid.append(stat(tx.sun, "pSun", true), stat(tx.earth, "pEar"), stat(tx.spd, "pSpd"), stat(tx.sig, "pSig"));
    const stc = el("div", "c"); stc.append(el("small", "", tx.status)); stc.append(el("b", "", g.status)); stc.style.gridColumn = "1/-1"; grid.append(stc, stat(tx.pos, "pPos", true));
    wrap.append(grid);
    wrap.append(el("div", "s", tx.tl)); const tl = el("ul", "t");
    g.ev.forEach((e) => { const li = el("li"); li.append(el("small", "", ds(e[0])), el("b", "", de ? e[1] : e[2])); tl.appendChild(li); }); wrap.append(tl);
    wrap.append(el("div", "s", tx.facts)); const fl = el("ul", "f"); g.facts.forEach((t) => fl.appendChild(el("li", "", t))); wrap.append(fl);
    if (g.plaque) {
      wrap.append(el("div", "s", PLQ.h), el("p", "", PLQ.intro));
      wrap.lastChild.style.cssText = "font-size:14px;line-height:1.6;opacity:.92;margin:0 0 10px";
      const pi = document.createElement("img"); pi.src = fp("Pioneer10-plaque.jpg", 700); pi.alt = PLQ.h; pi.referrerPolicy = "no-referrer"; pi.style.cssText = "width:100%;max-width:460px;border-radius:8px;display:block;margin:0 auto 12px;cursor:zoom-in"; pi.onclick = () => showImg([["Pioneer10-plaque.jpg", PLQ.h, PLQ.h]], 0); pi.onerror = () => pi.remove(); wrap.append(pi);
      const pl = el("ul", "f"); PLQ.items.forEach((t) => { const li = el("li"); li.append(el("b", "", t[0] + ": "), document.createTextNode(t[1])); pl.appendChild(li); }); wrap.append(pl);
    }
    wrap.append(el("div", "s", tx.pics)); const gal = el("div", "gal");
    g.imgs.forEach((im0, j) => {
      const a = document.createElement("a"); a.href = "https://commons.wikimedia.org/wiki/File:" + encodeURIComponent(im0[0].replace(/ /g, "_")); a.target = "_blank"; a.rel = "noopener"; a.onclick = (e) => { e.preventDefault(); showImg(g.imgs, j); };
      const im = document.createElement("img"); im.src = fp(im0[0], 400); im.loading = "lazy"; im.referrerPolicy = "no-referrer"; im.alt = im0[0]; im.onerror = () => a.remove();
      a.append(im, el("span", "", de ? im0[1] : im0[2])); gal.appendChild(a);
    });
    wrap.append(gal, el("div", "foot", tx.calc + " " + tx.src));
    panel.appendChild(wrap);
    const upd = () => {
      if (panel.hidden || sel !== i) return; const s = state(i, simJd()), set = (id, t) => { const e = document.getElementById(id); if (e) e.textContent = t; };
      set("pSun", nf(s.r, 2) + " AU · " + nf(s.r * AU / 1e9, 2) + " × 10⁹ km"); set("pEar", nf(s.de, 2) + " AU"); set("pSpd", nf(s.spd, 2) + " km/s");
      const mins = s.de * 499.00478 / 60; set("pSig", Math.floor(mins / 60) + " h " + Math.round(mins % 60) + " min");
      const rh = ((s.ra * 12 / Math.PI) % 24 + 24) % 24; set("pPos", "RA " + Math.floor(rh) + "h " + Math.round((rh % 1) * 60) + "m · Dec " + nf(s.dec * 180 / Math.PI, 1) + "°");
    };
    upd(); clearInterval(live); live = setInterval(upd, 1000);
  }
})();
