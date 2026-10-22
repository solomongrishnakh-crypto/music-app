// Berühmte Einzelobjekte im Sternenhimmel (22.10.2026): Sagittarius A*, TON 618, UY Scuti, VY Canis Majoris,
// Eta Carinae, R136a1, Cygnus X-1, Proxima Centauri. Position, Entfernung und Kennzahlen nach den Veröffentlichungen
// (Wikipedia/Fachliteratur); Bilder stehen in der Galerie (echte Aufnahmen und klar markierte Künstlerbilder).
(() => {
  const DE = LANG === "de";
  const L = (de, en) => (DE ? de : en);
  const O = [
    {
      id: "sgra", ra: 266.41683, dec: -29.00781, mag: 16, ly: 26670, wiki: "Sagittarius A*", dsoFov: 1.5,
      name: L("Sagittarius A*", "Sagittarius A*"), alt: "sgr a* sagittarius a sgra schwarzes loch galaktisches zentrum milchstrasse milky way black hole galactic center",
      kind: L("Schwarzes Loch · Zentrum der Milchstraße", "Black hole · centre of the Milky Way"),
      rows: [[L("Entfernung", "Distance"), L("≈ 26.700 Lichtjahre", "≈ 26,700 light-years")], [L("Masse des Lochs", "Hole mass"), L("≈ 4,3 Mio. Sonnenmassen", "≈ 4.3 million solar masses")], [L("Ereignishorizont", "Event horizon"), L("≈ 25 Mio. km Durchmesser", "≈ 25 million km across")], [L("Sichtbar im", "Visible in"), L("Infrarot, Radio, Röntgen", "infrared, radio, X-ray")], [L("Helligkeit", "Brightness"), L("im sichtbaren Licht verdeckt", "hidden in visible light")]],
      text: L([
        "Sagittarius A* ist das supermassereiche Schwarze Loch im Zentrum unserer Milchstraße. Es hat etwa 4,3 Millionen Sonnenmassen und liegt rund 26.700 Lichtjahre von uns entfernt. Sein Ereignishorizont ist etwa 25 Millionen Kilometer groß, ungefähr 18 Sonnendurchmesser.",
        "Sterne wie S2 umkreisen es in nur etwa 16 Jahren. Die Vermessung dieser Bahnen brachte 2020 den Physik-Nobelpreis (Reinhard Genzel und Andrea Ghez, zusammen mit Roger Penrose).",
        "Im Mai 2022 veröffentlichte die Event-Horizon-Telescope-Kollaboration das erste Bild dieses Schwarzen Lochs. Es zeigt den leuchtenden Ring aus heißem Gas um den dunklen Schatten – das Loch selbst ist nicht zu sehen.",
        "Im sichtbaren Licht liegt das Zentrum der Milchstraße hinter dichten Staubwolken. Man beobachtet es im Infrarot, in Radiowellen und im Röntgenlicht. Am Himmel steht es im Sternbild Schütze.",
      ], [
        "Sagittarius A* is the supermassive black hole at the centre of our Milky Way. It has about 4.3 million solar masses and lies roughly 26,700 light-years away. Its event horizon is about 25 million kilometres across, around 18 Sun diameters.",
        "Stars such as S2 orbit it in only about 16 years. Measuring these orbits earned the 2020 Nobel Prize in Physics (Reinhard Genzel and Andrea Ghez, shared with Roger Penrose).",
        "In May 2022 the Event Horizon Telescope collaboration published the first image of this black hole. It shows the glowing ring of hot gas around the dark shadow – the hole itself cannot be seen.",
        "In visible light the Galactic Centre is hidden behind dense dust clouds. It is observed in infrared, radio waves and X-rays. In the sky it lies in the constellation Sagittarius.",
      ]),
    },
    {
      id: "ton618", ra: 187.10404, dec: 31.47714, mag: 15.9, ly: 10.4e9, wiki: "TON 618", dsoFov: 1,
      name: "TON 618", alt: "ton 618 ton618 quasar schwarzes loch black hole",
      kind: L("Quasar · Schwarzes Loch", "Quasar · black hole"),
      rows: [[L("Entfernung (Lichtlaufzeit)", "Distance (light travel)"), L("≈ 10,4 Mrd. Lichtjahre", "≈ 10.4 billion light-years")], [L("Rotverschiebung", "Redshift"), "z ≈ 2,22".replace(",", DE ? "," : ".")], [L("Masse des Schwarzen Lochs", "Black hole mass"), L("≈ 40–66 Mrd. Sonnenmassen", "≈ 40–66 billion solar masses")], [L("Horizont-Radius", "Horizon radius"), L("≈ 1.300 AE (Neptunbahn: 30 AE)", "≈ 1,300 AU (Neptune's orbit: 30 AU)")], [L("Leuchtkraft", "Luminosity"), L("≈ 140 Billionen Sonnen", "≈ 140 trillion Suns")], [L("Helligkeit", "Brightness"), "15,9 mag".replace(",", DE ? "," : ".")]],
      text: L([
        "TON 618 ist ein extrem leuchtkräftiger Quasar im Sternbild Jagdhunde. Sein Licht war rund 10,4 Milliarden Jahre unterwegs – wir sehen ihn so, wie er aussah, als das Universum erst gut 3 Milliarden Jahre alt war.",
        "Im Zentrum sitzt eines der massereichsten bekannten Schwarzen Löcher: je nach Messung etwa 40 bis 66 Milliarden Sonnenmassen. Sein Ereignishorizont hätte einen Radius von rund 1.300 Astronomischen Einheiten. Das ist mehr als das Vierzigfache der Neptunbahn, unser ganzes Sonnensystem würde darin verschwinden.",
        "Ein Quasar ist der extrem helle Kern einer jungen Galaxie: Gas fällt auf das Schwarze Loch, bildet eine heiße Scheibe und strahlt dabei heller als hunderte Billionen Sonnen.",
        "Am Himmel ist TON 618 nur ein einzelner, schwacher Punkt (15,9 mag) und braucht ein großes Teleskop. Von der Scheibe oder dem Schwarzen Loch selbst gibt es kein Foto: Die Bilder in der Galerie sind Künstlerdarstellungen und zeigen nicht TON 618 selbst.",
      ], [
        "TON 618 is an extremely luminous quasar in the constellation Canes Venatici. Its light travelled for about 10.4 billion years – we see it as it was when the universe was a little over 3 billion years old.",
        "At its centre sits one of the most massive known black holes: roughly 40 to 66 billion solar masses depending on the measurement. Its event horizon would have a radius of about 1,300 astronomical units – over forty times Neptune's orbit, big enough to swallow our whole Solar System.",
        "A quasar is the extremely bright core of a young galaxy: gas falls onto the black hole, forms a hot disc and radiates more brightly than hundreds of trillions of Suns.",
        "In the sky TON 618 is just a single faint point (15.9 mag) and needs a large telescope. There is no photograph of the disc or the black hole itself: the pictures in the gallery are artist's impressions and do not show TON 618 itself.",
      ]),
    },
    {
      id: "uyscuti", ra: 276.90208, dec: -12.44111, mag: 10.4, ly: 9500, wiki: "UY Scuti", dsoFov: 1, star: true,
      name: "UY Scuti", alt: "uy scuti uy sct roter ueberriese red supergiant",
      kind: L("Roter Überriese · veränderlicher Stern", "Red supergiant · variable star"),
      rows: [[L("Entfernung", "Distance"), L("≈ 9.500 Lichtjahre", "≈ 9,500 light-years")], [L("Sternradius", "Star radius"), L("≈ 900–1.200 Sonnenradien (unsicher)", "≈ 900–1,200 solar radii (uncertain)")], [L("Oberflächentemp.", "Surface temp."), "≈ 3.100 °C"], [L("Sternmasse", "Star mass"), L("≈ 7–10 Sonnenmassen", "≈ 7–10 solar masses")], [L("Helligkeit", "Brightness"), L("veränderlich, ≈ 8–11 mag", "variable, ≈ 8–11 mag")]],
      text: L([
        "UY Scuti ist ein roter Überriese im Sternbild Schild, etwa 9.500 Lichtjahre entfernt. Sein Radius wird auf rund 900 bis 1.200 Sonnenradien geschätzt. An der Stelle der Sonne würde seine Oberfläche bis etwa zur Jupiterbahn reichen.",
        "Der Stern pulsiert und ändert dabei unregelmäßig seine Helligkeit. Die Größenangaben sind unsicher, weil die Entfernung und die Oberfläche eines so aufgeblähten, staubumhüllten Sterns schwer zu messen sind. UY Scuti galt lange als der größte bekannte Stern; heute gelten andere Kandidaten wie Stephenson 2-18 als größer.",
        "Trotz seines Durchmessers ist er nicht besonders massereich (etwa 7 bis 10 Sonnenmassen): Seine Hülle ist extrem dünn. Er wird in absehbarer astronomischer Zeit als Supernova enden.",
      ], [
        "UY Scuti is a red supergiant in the constellation Scutum, about 9,500 light-years away. Its radius is estimated at roughly 900 to 1,200 solar radii. Placed where the Sun is, its surface would reach about as far as Jupiter's orbit.",
        "The star pulsates and changes brightness irregularly. Size figures are uncertain because the distance and surface of such a bloated, dust-shrouded star are hard to measure. UY Scuti was long considered the largest known star; other candidates such as Stephenson 2-18 are now thought to be larger.",
        "Despite its diameter it is not especially massive (about 7 to 10 solar masses): its envelope is extremely thin. It will end as a supernova on astronomical timescales.",
      ]),
    },
    {
      id: "vycma", ra: 110.74304, dec: -25.76756, mag: 7.9, ly: 3900, wiki: "VY Canis Majoris", dsoFov: 1.5, star: true,
      name: "VY Canis Majoris", alt: "vy canis majoris vy cma roter hyperriese red hypergiant grosser hund",
      kind: L("Roter Hyperriese", "Red hypergiant"),
      rows: [[L("Entfernung", "Distance"), L("≈ 3.900 Lichtjahre", "≈ 3,900 light-years")], [L("Sternradius", "Star radius"), L("≈ 1.400 Sonnenradien", "≈ 1,400 solar radii")], [L("Sternmasse", "Star mass"), L("≈ 17 Sonnenmassen", "≈ 17 solar masses")], [L("Helligkeit", "Brightness"), L("veränderlich, ≈ 6,5–9,6 mag", "variable, ≈ 6.5–9.6 mag")]],
      text: L([
        "VY Canis Majoris ist ein roter Hyperriese im Sternbild Großer Hund, rund 3.900 Lichtjahre entfernt. Sein Radius beträgt etwa 1.400 Sonnenradien; in der Sonne säße seine Oberfläche weit hinter der Jupiterbahn.",
        "Der Stern verliert massiv Material und ist von einer großen, unregelmäßigen Wolke aus ausgestoßenem Gas und Staub umgeben. Hubble und das Very Large Telescope haben diese Hülle fotografiert (siehe Galerie).",
        "Er ist instabil und wird vermutlich als Supernova oder Hypernova enden.",
      ], [
        "VY Canis Majoris is a red hypergiant in the constellation Canis Major, about 3,900 light-years away. Its radius is around 1,400 solar radii; placed in the Sun's position its surface would lie well beyond Jupiter's orbit.",
        "The star loses mass heavily and is surrounded by a large, irregular cloud of ejected gas and dust. Hubble and the Very Large Telescope have photographed this shell (see gallery).",
        "It is unstable and will probably end as a supernova or hypernova.",
      ]),
    },
    {
      id: "etacar", ra: 161.26479, dec: -59.68442, mag: 4.3, ly: 7500, wiki: "Eta Carinae", dsoFov: 1, star: true,
      name: "Eta Carinae", alt: "eta carinae eta car homunculus",
      kind: L("Massereiches Doppelsternsystem", "Massive binary star system"),
      rows: [[L("Entfernung", "Distance"), L("≈ 7.500 Lichtjahre", "≈ 7,500 light-years")], [L("Hauptstern", "Primary star"), L("≈ 100 Sonnenmassen", "≈ 100 solar masses")], [L("Umlaufzeit", "Orbital period"), L("≈ 5,5 Jahre", "≈ 5.5 years")], [L("Helligkeit", "Brightness"), "≈ 4,3 mag".replace(",", DE ? "," : ".")]],
      text: L([
        "Eta Carinae ist ein Doppelstern im Sternbild Kiel des Schiffs, etwa 7.500 Lichtjahre entfernt. Der Hauptstern hat rund 100 Sonnenmassen, ein heißerer Begleiter etwa 30. Beide umkreisen sich in rund 5,5 Jahren.",
        "In den 1840er-Jahren erlebte Eta Carinae einen gewaltigen Ausbruch (den „Großen Ausbruch“) und wurde zeitweise zum zweithellsten Stern am Himmel. Das ausgeschleuderte Material formt heute den Homunculus-Nebel, den Hubble detailliert fotografiert hat.",
        "Der Stern ist instabil und gilt als Kandidat für eine Supernova – wann, ist unklar.",
      ], [
        "Eta Carinae is a double star in the constellation Carina, about 7,500 light-years away. The primary has roughly 100 solar masses, a hotter companion about 30. They orbit each other in about 5.5 years.",
        "In the 1840s Eta Carinae went through a huge outburst (the \"Great Eruption\") and briefly became the second-brightest star in the sky. The ejected material now forms the Homunculus Nebula, which Hubble has photographed in detail.",
        "The star is unstable and a supernova candidate – when, nobody knows.",
      ]),
    },
    {
      id: "r136a1", ra: 84.67667, dec: -69.10083, mag: 12.2, ly: 163000, wiki: "R136a1", dsoFov: 0.5, star: true,
      name: "R136a1", alt: "r136a1 r136 tarantel tarantula",
      kind: L("Einer der massereichsten bekannten Sterne", "One of the most massive known stars"),
      rows: [[L("Entfernung", "Distance"), L("≈ 163.000 Lichtjahre", "≈ 163,000 light-years")], [L("Masse (heute)", "Mass (today)"), L("≈ 200 Sonnenmassen", "≈ 200 solar masses")], [L("Leuchtkraft", "Luminosity"), L("mehrere Mio. Sonnen", "several million Suns")], [L("Oberflächentemp.", "Surface temp."), "≈ 46.000 K"]],
      text: L([
        "R136a1 ist ein Stern im Sternhaufen R136 im Tarantelnebel der Großen Magellanschen Wolke, rund 163.000 Lichtjahre entfernt. Er gehört zu den massereichsten und leuchtstärksten bekannten Sternen.",
        "Seine heutige Masse liegt bei etwa 200 Sonnenmassen, bei der Geburt waren es wohl über 250. Er strahlt mit mehreren Millionen Sonnenleuchtkräften bei rund 46.000 Kelvin Oberflächentemperatur und ist ein Wolf-Rayet-Stern, der seine Hülle als starken Sternwind abstößt.",
        "Seine Lebensdauer ist mit wenigen Millionen Jahren winzig verglichen mit den rund 10 Milliarden Jahren der Sonne.",
      ], [
        "R136a1 is a star in the cluster R136 inside the Tarantula Nebula of the Large Magellanic Cloud, about 163,000 light-years away. It is among the most massive and luminous stars known.",
        "Its present mass is about 200 solar masses, and at birth it was probably over 250. It shines with several million solar luminosities at a surface temperature of around 46,000 kelvin and is a Wolf–Rayet star blowing off its envelope in a strong stellar wind.",
        "Its lifetime of a few million years is tiny compared with the Sun's roughly 10 billion.",
      ]),
    },
    {
      id: "cygx1", ra: 299.59032, dec: 35.20161, mag: 8.9, ly: 7200, wiki: "Cygnus X-1", dsoFov: 1, star: true,
      name: "Cygnus X-1", alt: "cygnus x-1 cyg x-1 cygx1 schwarzes loch black hole hde 226868",
      kind: L("Schwarzes Loch · Röntgenquelle", "Black hole · X-ray source"),
      rows: [[L("Entfernung", "Distance"), L("≈ 7.200 Lichtjahre", "≈ 7,200 light-years")], [L("Masse des Lochs", "Hole mass"), L("≈ 21 Sonnenmassen", "≈ 21 solar masses")], [L("Begleiter", "Companion"), "HDE 226868 (8,9 mag)".replace(",", DE ? "," : ".")], [L("Umlaufzeit", "Orbital period"), L("≈ 5,6 Tage", "≈ 5.6 days")]],
      text: L([
        "Cygnus X-1 ist eine starke Röntgenquelle im Sternbild Schwan und eines der ersten Objekte, die als Schwarzes Loch erkannt wurden. Es hat rund 21 Sonnenmassen und ist etwa 7.200 Lichtjahre entfernt.",
        "Das Schwarze Loch umkreist den blauen Überriesen HDE 226868 in 5,6 Tagen und zieht Gas von ihm ab. Dieses Gas heizt sich vor dem Sturz stark auf und sendet Röntgenstrahlung aus. Sichtbar im Fernglas ist nur der Begleitstern.",
        "1974 wetteten die Physiker Stephen Hawking und Kip Thorne darum, ob Cygnus X-1 ein Schwarzes Loch ist. Hawking wettete dagegen und gestand die Wette 1990 ein.",
      ], [
        "Cygnus X-1 is a strong X-ray source in the constellation Cygnus and one of the first objects recognised as a black hole. It has about 21 solar masses and lies roughly 7,200 light-years away.",
        "The black hole orbits the blue supergiant HDE 226868 every 5.6 days and pulls gas from it. This gas heats up strongly before falling in and emits X-rays. Only the companion star is visible in binoculars.",
        "In 1974 the physicists Stephen Hawking and Kip Thorne made a bet on whether Cygnus X-1 is a black hole. Hawking bet against it and conceded in 1990.",
      ]),
    },
    {
      id: "proxima", ra: 217.42894, dec: -62.67949, mag: 11.1, ly: 4.24, wiki: "Proxima Centauri", dsoFov: 1, star: true,
      name: "Proxima Centauri", alt: "proxima centauri proxima cen naechster stern nearest star",
      kind: L("Roter Zwerg · nächster Stern", "Red dwarf · nearest star"),
      rows: [[L("Entfernung", "Distance"), L("4,24 Lichtjahre", "4.24 light-years")], [L("Sternmasse", "Star mass"), L("≈ 0,12 Sonnenmassen", "≈ 0.12 solar masses")], [L("Helligkeit", "Brightness"), "11,1 mag".replace(",", DE ? "," : ".")], [L("Planeten", "Planets"), L("Proxima b, Proxima d", "Proxima b, Proxima d")]],
      text: L([
        "Proxima Centauri ist der der Sonne nächste bekannte Stern, nur 4,24 Lichtjahre entfernt. Er ist ein kleiner, kühler roter Zwerg mit etwa 12 % der Sonnenmasse und für das bloße Auge viel zu lichtschwach (11,1 mag).",
        "Er gehört zum Alpha-Centauri-System und umkreist die beiden hellen Sterne Alpha Centauri A und B in einer sehr weiten Bahn.",
        "Um Proxima Centauri kreisen mindestens zwei Planeten: Proxima b liegt in der habitablen Zone, wird aber von heftigen Flares des Sterns getroffen. Ob es dort Wasser oder Leben gibt, ist unbekannt.",
      ], [
        "Proxima Centauri is the nearest known star to the Sun, only 4.24 light-years away. It is a small, cool red dwarf with about 12 % of the Sun's mass and far too faint for the naked eye (11.1 mag).",
        "It belongs to the Alpha Centauri system and orbits the two bright stars Alpha Centauri A and B on a very wide path.",
        "At least two planets orbit Proxima Centauri: Proxima b lies in the habitable zone but is hit by violent flares from its star. Whether it has water or life is unknown.",
      ]),
    },
  ];
  for (const o of O) { o.rad = o.ra * DEG; o.decr = o.dec * DEG; o.sd = Math.sin(o.decr); o.cd = Math.cos(o.decr); }
  const BY = new Map(O.map((o) => [o.id, o]));
  const found = new Set();
  try { for (const k of JSON.parse(localStorage.getItem("fam-found") || "[]")) found.add(k); } catch (e) { /* ohne Speicher weiter */ }
  const save = () => { try { localStorage.setItem("fam-found", JSON.stringify([...found])); } catch (e) { /* egal */ } };
  const vis = [];
  const hit = (o) => ({ type: "fam", id: o.id, ra: o.rad, dec: o.decr, mag: o.mag, name: o.name, kind: o.kind, dsoFov: o.dsoFov * DEG });
  function fmtDist(ly) { return ly >= 1e9 ? nf.format(ly / 1e9) + (DE ? " Mrd. Lichtjahre" : " billion light-years") : ly >= 1e6 ? nf.format(ly / 1e6) + (DE ? " Mio. Lichtjahre" : " million light-years") : nf0.format(ly) + (DE ? " Lichtjahre" : " light-years"); }

  function draw(fade) {
    vis.length = 0;
    if (fade < 0.05) return;
    const lim = 8.4 + 3.3 * Math.log10(72 / Math.max(S.fov / DEG, 0.06));
    for (const o of O) {
      eqToEnu(o.rad, o.sd, o.cd, tmpV);
      const under = S.atmo && tmpV[2] < 0;
      if (!project(tmpV, P)) continue;
      if (P.x < -30 || P.y < -30 || P.x > W + 30 || P.y > H + 30) continue;
      const on = found.has(o.id) || (S.sel && S.sel.type === "fam" && S.sel.id === o.id);
      const x = P.x, y = P.y;
      vis.push({ o, x, y, on });
      if (o.mag <= lim) {
        const a = Math.min(1, 0.4 + (lim - o.mag) * 0.2) * fade * (under ? 0.4 : 1), r = Math.min(3.4, 1 + (lim - o.mag) * 0.3);
        ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.fillStyle = o.star ? `rgba(255,205,160,${a})` : `rgba(255,190,120,${a})`;
        ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill(); ctx.restore();
      }
      if (on || S.fov < 12 * DEG) {
        ctx.save(); ctx.lineWidth = 1.2;
        if (o.star) { ctx.strokeStyle = on ? "rgba(125,220,255,.9)" : "rgba(255,210,170,.45)"; ctx.beginPath(); ctx.arc(x, y, 9, 0, 6.2832); ctx.stroke(); }
        else { // Schwarzes Loch / Quasar: Raute
          ctx.strokeStyle = on ? "rgba(125,220,255,.95)" : "rgba(255,190,120,.6)"; ctx.beginPath(); ctx.moveTo(x, y - 10); ctx.lineTo(x + 10, y); ctx.lineTo(x, y + 10); ctx.lineTo(x - 10, y); ctx.closePath(); ctx.stroke();
        }
        ctx.restore();
      }
    }
  }
  function labels(free, fade) {
    ctx.font = "500 12px " + cssVar("--font-sans");
    for (const q of vis) {
      if (!q.on && S.fov >= 30 * DEG) continue;
      const w = ctx.measureText(q.o.name).width, y = q.y + 20;
      if (!free(q.x - w / 2, y - 7, w, 14)) continue;
      ctx.fillStyle = q.on ? `rgba(150,230,255,${0.95 * fade})` : `rgba(255,214,176,${0.85 * fade})`;
      haloText(q.o.name, q.x, y);
      labelHits.push({ x0: q.x - w / 2 - 4, y0: y - 9, x1: q.x + w / 2 + 4, y1: y + 9, hit: hit(q.o) });
    }
  }
  function pick(x, y) {
    let best = null, bd = 20;
    for (const q of vis) { const d = Math.hypot(q.x - x, q.y - y); if (d < bd) { bd = d; best = q.o; } }
    return best ? hit(best) : null;
  }
  function screen(s) {
    const o = BY.get(s.id); if (!o) return null;
    eqToEnu(o.rad, o.sd, o.cd, tmpV);
    return project(tmpV, P) ? { x: P.x, y: P.y, r: 8 } : null;
  }
  function index() {
    return O.map((o) => ({ label: o.name, alt: o.alt, kind: o.kind, hit: hit(o) }));
  }
  function mark(h) { if (h && h.type === "fam") { found.add(h.id); save(); } }
  function info(s) {
    const o = BY.get(s.id); if (!o) return { name: s.name, kind: s.kind || "", rows: [], v: eqToEnu(s.ra, Math.sin(s.dec), Math.cos(s.dec), [0, 0, 0]) };
    const rows = o.rows.slice();
    const con = (typeof nearestConstellation === "function" && nearestConstellation(o.rad, o.decr)) || "";
    if (con) rows.push([tr("constellation"), con]);
    return { name: o.name, kind: o.kind, rows, v: eqToEnu(o.rad, o.sd, o.cd, [0, 0, 0]) };
  }
  function box(s) {
    let el = document.getElementById("famBox");
    if (!(s && s.type === "fam")) { if (el) el.remove(); return; }
    const o = BY.get(s.id); if (!o) return;
    const key = s.id + ":" + LANG;
    if (el && el.dataset.key === key) return;
    const host = document.getElementById("infoWiki");
    if (!host || !host.parentNode) return;
    if (el) el.remove();
    el = document.createElement("div"); el.id = "famBox"; el.dataset.key = key; el.style.cssText = "margin:10px 0 12px";
    for (const t of o.text) { const p = document.createElement("p"); p.textContent = t; p.style.cssText = "margin:0 0 9px;font-size:13.5px;line-height:1.5;opacity:.93"; el.appendChild(p); }
    host.parentNode.insertBefore(el, host);
  }
  window.FAM = { draw, labels, pick, screen, index, mark, info, box, wiki: (s) => { const o = BY.get(s.id); return o && o.wiki ? [o.wiki] : []; }, has: (id) => BY.has(id) };
})();
