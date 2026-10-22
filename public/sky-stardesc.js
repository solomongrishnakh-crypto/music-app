// Automatische Beschreibung für alle Sterne (22.10.2026, Nutzerwunsch: "wieso haben HIP-Sterne keine Beschreibung").
// Der Text entsteht aus den echten Daten des Sterns (Helligkeit, Farbe, Spektraltyp, Entfernung, Größe, Sternbild);
// allgemeine Sätze zur Sternart sind Lehrbuchwissen. Deutsch und Englisch (andere Sprachen: Englisch).
(() => {
  const DE = () => LANG === "de";
  const L = (de, en) => (DE() ? de : en);
  const fmt = (n, d = 0) => n.toLocaleString(DE() ? "de-DE" : "en-US", { maximumFractionDigits: d });
  const fx = (v) => (v >= 1000 ? fmt(Math.round(v / 100) * 100) : v >= 100 ? fmt(Math.round(v / 10) * 10) : v >= 10 ? fmt(Math.round(v)) : v >= 1 ? fmt(v, 1) : fmt(v, 2));
  const COL = { O: ["blauer", "blue"], B: ["blauweißer", "blue-white"], A: ["weißer", "white"], F: ["gelblich-weißer", "yellow-white"], G: ["gelber", "yellow"], K: ["orangefarbener", "orange"], M: ["roter", "red"] };
  const letterOf = (sp, Tk) => {
    const l = sp && /^[OBAFGKM]/.test(sp) ? sp[0] : null;
    if (l) return l;
    if (!Tk) return null;
    return Tk >= 30000 ? "O" : Tk >= 10000 ? "B" : Tk >= 7500 ? "A" : Tk >= 6000 ? "F" : Tk >= 5200 ? "G" : Tk >= 3900 ? "K" : "M";
  };
  // Leuchtkraftklasse: aus dem Spektraltyp, sonst grob aus dem berechneten Radius
  const lumOf = (sp, R) => {
    const m = sp && sp.match(/^[OBAFGKM][\d.]*\s*(Iab|Ia|Ib|III|II|IV|V|I)?/);
    const c = m && m[1];
    if (c) return { Ia: "S", Iab: "S", Ib: "S", I: "S", II: "BG", III: "G", IV: "SG", V: "MS" }[c];
    if (R) return R >= 100 ? "S" : R >= 8 ? "G" : R < 2.5 ? "MS" : null;
    return null;
  };
  const NOUN = {
    S: ["Überriese", "supergiant"], BG: ["heller Riesenstern", "bright giant"], G: ["Riesenstern", "giant star"],
    SG: ["Unterriese", "subgiant"], MS: ["Hauptreihenstern", "main-sequence star"], N: ["Stern", "star"],
  };
  const ORB = [[1118, "Jupiter", "Jupiter"], [328, "Mars", "Mars"], [215, "Erde", "Earth"], [155, "Venus", "Venus"], [83, "Merkur", "Mercury"]];

  const LORE = {
    LS: () => L("Überriesen gehören zu den größten und hellsten Sternen überhaupt. Sie leben nur einige Millionen Jahre und enden meist als Supernova.", "Supergiants are among the largest and most luminous stars. They live only a few million years and usually end as supernovae."),
    LBG: () => L("Helle Riesen sind massereiche Sterne am Ende ihres Lebens: Sie haben den Wasserstoff im Kern verbraucht und sich stark aufgebläht.", "Bright giants are massive stars late in life: they have used up the hydrogen in their core and swollen up greatly."),
    LG: () => L("Riesensterne haben den Wasserstoff in ihrem Kern verbraucht und sich aufgebläht. Auch unsere Sonne wird in etwa 5 Milliarden Jahren zu einem Roten Riesen.", "Giants have used up the hydrogen in their core and swollen up. Our Sun will also become a red giant in about 5 billion years."),
    LSG: () => L("Ein Unterriese hat den Wasserstoff im Kern verbraucht und beginnt, sich zu einem Riesen aufzublähen.", "A subgiant has used up the hydrogen in its core and is starting to swell into a giant."),
    O: () => L("Solche heißen, massereichen Sterne verbrennen ihren Brennstoff in nur wenigen Millionen Jahren und enden meist als Supernova.", "Such hot, massive stars burn through their fuel in just a few million years and usually end as supernovae."),
    B: () => L("Blauweiße Sterne dieser Art sind viel heißer und massereicher als die Sonne und leben nur einige Millionen bis wenige hundert Millionen Jahre.", "Blue-white stars like this are much hotter and more massive than the Sun and live only some millions to a few hundred million years."),
    A: () => L("Weiße Sterne dieser Art sind heißer und größer als die Sonne. Sie leben etwa einige hundert Millionen bis zwei Milliarden Jahre.", "White stars like this are hotter and larger than the Sun. They live roughly a few hundred million to two billion years."),
    F: () => L("Gelblich-weiße Sterne sind etwas heißer und heller als die Sonne und leben einige Milliarden Jahre.", "Yellow-white stars are somewhat hotter and brighter than the Sun and live a few billion years."),
    G: () => L("Sterne dieses Typs sind der Sonne ähnlich (die Sonne ist ein G2-Stern) und leben viele Milliarden Jahre.", "Stars of this type resemble the Sun (the Sun is a G2 star) and live many billions of years."),
    K: () => L("Orangefarbene Sterne sind kühler und schwächer als die Sonne. Sie leben sehr lange, oft länger als die Sonne.", "Orange stars are cooler and fainter than the Sun. They live very long, often longer than the Sun."),
    M: () => L("Rote Zwerge sind die häufigsten Sterne der Milchstraße. Sie sind so lichtschwach, dass man keinen einzigen mit bloßem Auge sieht, und sie leben Billionen Jahre.", "Red dwarfs are the most common stars in the Milky Way. They are so faint that not a single one is visible to the naked eye, and they live for trillions of years."),
  };

  // c: { name, hip, mag, con, ly, sp, Tk, phys:{L,R}, sim:{rv}, vr:[a,b] }
  window.describeStar = (c) => {
    const out = [];
    const letter = letterOf(c.sp, c.Tk);
    const R = c.phys && c.phys.R;
    const lum = lumOf(c.sp, R);
    // 1. Was für ein Stern
    if (letter) {
      const col = COL[letter][DE() ? 0 : 1];
      const noun = NOUN[lum || "N"][DE() ? 0 : 1];
      const nm = c.name || L("Dieser Stern", "This star");
      if (DE()) out.push(`${nm} ist ein ${col} ${noun}${c.con ? " im Sternbild " + c.con : ""}.`);
      else out.push(`${nm} is ${letter === "K" ? "an" : "a"} ${col} ${noun}${c.con ? " in the constellation " + c.con : ""}.`);
    } else if (c.con) {
      out.push(L(`${c.name || "Dieser Stern"} steht im Sternbild ${c.con}.`, `${c.name || "This star"} lies in the constellation ${c.con}.`));
    }
    // 2. Physik
    if (c.Tk) out.push(L(`Seine Oberfläche ist etwa ${fmt(Math.round((c.Tk - 273) / 100) * 100)} °C heiß.`, `Its surface is about ${fmt(Math.round((c.Tk - 273) / 100) * 100)} °C hot.`));
    if (c.phys && c.phys.L) {
      const Lm = c.phys.L;
      const sz = R ? (R > 0.9 && R < 1.12 ? L(" und ist etwa so groß wie die Sonne", " and is about as big as the Sun") : L(` und hat etwa das ${fx(R)}-Fache des Sonnenradius`, ` and has about ${fx(R)} times the Sun's radius`)) : "";
      out.push(L(`Er leuchtet etwa ${fx(Lm)}-mal so hell wie die Sonne${sz}.`, `It shines about ${fx(Lm)} times as brightly as the Sun${sz}.`));
    }
    if (R) {
      const o = ORB.find(([r]) => R >= r);
      if (o) out.push(L(`Würde man ihn an die Stelle der Sonne setzen, reichte er bis über die ${o[1]}bahn hinaus.`, `Placed where the Sun is, it would reach beyond the orbit of ${o[2]}.`));
    }
    // 3. Entfernung, Licht, Sichtbarkeit
    if (c.ly > 0) {
      const lyTxt = c.ly < 20 ? fmt(c.ly, 1) : fmt(c.ly < 1000 ? Math.round(c.ly) : Math.round(c.ly / 10) * 10);
      const yr = Math.round(new Date().getFullYear() - c.ly);
      const when = yr > 0 ? L(`um das Jahr ${yr}`, `around the year ${yr}`) : L(`vor etwa ${fmt(Math.round(c.ly))} Jahren`, `about ${fmt(Math.round(c.ly))} years ago`);
      out.push(L(`Er ist rund ${lyTxt} Lichtjahre entfernt. Das Licht, das du jetzt siehst, hat ihn ${when} verlassen.`, `It is about ${lyTxt} light-years away. The light you see now left the star ${when}.`) + (c.ly > 1500 ? L(" Bei so fernen Sternen ist die Entfernung nur grob bekannt.", " At such distances the value is only roughly known.") : ""));
    }
    if (typeof c.mag === "number") {
      const vis = c.mag <= 6 ? L("ist er unter dunklem Himmel mit bloßem Auge sichtbar", "is visible to the naked eye under a dark sky") : c.mag <= 9.5 ? L("braucht man ein Fernglas", "needs binoculars") : L("braucht man ein Teleskop", "needs a telescope");
      out.push(L(`Mit ${fmt(c.mag, 1)} mag ${vis}.`, `At ${fmt(c.mag, 1)} mag it ${vis}.`));
    }
    if (c.vr && c.vr[1] - c.vr[0] >= 0.25) out.push(L(`Seine Helligkeit schwankt zwischen ${fmt(c.vr[0], 1)} und ${fmt(c.vr[1], 1)} mag.`, `Its brightness varies between ${fmt(c.vr[0], 1)} and ${fmt(c.vr[1], 1)} mag.`));
    if (c.sim && c.sim.rv != null && Math.abs(c.sim.rv) >= 1) out.push(L(`Er bewegt sich mit etwa ${fmt(Math.abs(c.sim.rv))} km/s ${c.sim.rv < 0 ? "auf uns zu" : "von uns weg"}.`, `It is moving ${c.sim.rv < 0 ? "towards us" : "away from us"} at about ${fmt(Math.abs(c.sim.rv))} km/s.`));
    // 4. Sternart (Lehrbuchwissen)
    const lore = lum === "MS" ? LORE[letter] : lum ? LORE["L" + lum] : null; // ohne Leuchtkraftklasse keine Aussage zur Sternart
    if (lore) out.push(lore());
    // 5. Was bedeutet HIP
    if (c.hip) out.push(L("„HIP“ steht für den Hipparcos-Katalog: Der ESA-Satellit Hipparcos hat von 1989 bis 1993 Position und Helligkeit von rund 118.000 Sternen sehr genau vermessen.", "“HIP” refers to the Hipparcos catalogue: from 1989 to 1993 ESA's Hipparcos satellite measured the position and brightness of about 118,000 stars very precisely."));
    return out.join("\n\n");
  };
})();
