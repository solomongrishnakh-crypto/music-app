"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage, type Lang } from "@/contexts/LanguageContext";
import { findBody } from "@/components/space/bodies";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * Größenvergleich im Universum (Nutzerwunsch 14.10.2026): echte Durchmesser
 * vom Neutronenstern bis zum beobachtbaren Universum, nebeneinander im
 * richtigen Verhältnis. Ziehen / Mausrad / Regler zoomt stufenlos.
 * Schwarze Löcher: Durchmesser des Ereignishorizonts (2 × Schwarzschild-Radius).
 */

type Kind = "ns" | "bh" | "dwarf" | "moon" | "planet" | "star" | "orbit" | "nebula" | "galaxy" | "cluster" | "universe";
type Names = Record<Lang, string>;

interface Obj {
  id: string;
  d: number; // Durchmesser in km
  kind: Kind;
  name?: Names | string; // fehlt → Name aus den Planetendaten
  color: string;
  approx?: boolean;
  ring?: boolean;
}

const N = (de: string, en: string, es: string, fr: string, pt: string, tr: string, ru: string, el: string, ar: string, hi: string, zh: string, ja: string, ko: string): Names =>
  ({ de, en, es, fr, pt, tr, ru, el, ar, hi, zh, ja, ko });

const OBJECTS: Obj[] = [
  { id: "ns", d: 20, kind: "ns", color: "#bcd4ff", approx: true, name: N("Neutronenstern", "Neutron star", "Estrella de neutrones", "Étoile à neutrons", "Estrela de nêutrons", "Nötron yıldızı", "Нейтронная звезда", "Αστέρας νετρονίων", "نجم نيوتروني", "न्यूट्रॉन तारा", "中子星", "中性子星", "중성자별") },
  { id: "sbh", d: 59, kind: "bh", color: "#ff9a4d", name: N("Schwarzes Loch (10 Sonnenmassen)", "Black hole (10 solar masses)", "Agujero negro (10 masas solares)", "Trou noir (10 masses solaires)", "Buraco negro (10 massas solares)", "Kara delik (10 Güneş kütlesi)", "Чёрная дыра (10 масс Солнца)", "Μαύρη τρύπα (10 ηλιακές μάζες)", "ثقب أسود (10 كتل شمسية)", "ब्लैक होल (10 सौर द्रव्यमान)", "黑洞（10 倍太阳质量）", "ブラックホール（太陽質量の10倍）", "블랙홀 (태양 질량 10배)") },
  { id: "ceres", d: 940, kind: "dwarf", color: "#8d877f" },
  { id: "pluto", d: 2377, kind: "dwarf", color: "#c9b49a" },
  { id: "moon", d: 3475, kind: "moon", color: "#a9a9a6", name: N("Mond", "Moon", "Luna", "Lune", "Lua", "Ay", "Луна", "Σελήνη", "القمر", "चंद्रमा", "月球", "月", "달") },
  { id: "mercury", d: 4879, kind: "planet", color: "#9c9288" },
  { id: "mars", d: 6779, kind: "planet", color: "#c1623f" },
  { id: "venus", d: 12104, kind: "planet", color: "#e3c58f" },
  { id: "earth", d: 12742, kind: "planet", color: "#3f7fd1" },
  { id: "neptune", d: 49244, kind: "planet", color: "#3d5fd6" },
  { id: "uranus", d: 50724, kind: "planet", color: "#8fd3dc" },
  { id: "saturn", d: 116460, kind: "planet", color: "#d9be86", ring: true },
  { id: "jupiter", d: 139820, kind: "planet", color: "#c9a27c" },
  { id: "proxima", d: 214800, kind: "star", color: "#ff6b3d", name: "Proxima Centauri" },
  { id: "sun", d: 1392700, kind: "star", color: "#ffd166" },
  { id: "sirius", d: 2383000, kind: "star", color: "#dfe8ff", name: "Sirius A" },
  { id: "sgra", d: 25400000, kind: "bh", color: "#ff9a4d", name: "Sagittarius A*" },
  { id: "arcturus", d: 35400000, kind: "star", color: "#ffa95c", name: N("Arktur", "Arcturus", "Arturo", "Arcturus", "Arcturo", "Arcturus", "Арктур", "Αρκτούρος", "السماك الرامح", "स्वाति (आर्कटुरस)", "大角星", "アークトゥルス", "아르크투루스") },
  { id: "rigel", d: 110000000, kind: "star", color: "#a9c4ff", approx: true, name: N("Rigel", "Rigel", "Rigel", "Rigel", "Rigel", "Rigel", "Ригель", "Ρίγκελ", "رجل الجبار", "राइजेल", "参宿七", "リゲル", "리겔") },
  { id: "betelgeuse", d: 1060000000, kind: "star", color: "#ff5a3a", approx: true, name: N("Beteigeuze", "Betelgeuse", "Betelgeuse", "Bételgeuse", "Betelgeuse", "Betelgeuse", "Бетельгейзе", "Μπετελγκέζ", "منكب الجوزاء", "आर्द्रा (बेटेलगेयूज़)", "参宿四", "ベテルギウス", "베텔게우스") },
  { id: "uyscuti", d: 1270000000, kind: "star", color: "#ff7046", approx: true, name: "UY Scuti" },
  { id: "neporbit", d: 9000000000, kind: "orbit", color: "#7fa8ff", name: N("Neptunbahn (Sonnensystem)", "Neptune's orbit (Solar System)", "Órbita de Neptuno (Sistema Solar)", "Orbite de Neptune (Système solaire)", "Órbita de Netuno (Sistema Solar)", "Neptün'ün yörüngesi (Güneş Sistemi)", "Орбита Нептуна (Солнечная система)", "Τροχιά του Ποσειδώνα (Ηλιακό σύστημα)", "مدار نبتون (المجموعة الشمسية)", "नेपच्यून की कक्षा (सौर मंडल)", "海王星轨道（太阳系）", "海王星の軌道（太陽系）", "해왕성 궤도 (태양계)") },
  { id: "m87", d: 38000000000, kind: "bh", color: "#ff9a4d", approx: true, name: "M87*" },
  { id: "ton618", d: 240000000000, kind: "bh", color: "#ff9a4d", approx: true, name: "TON 618" },
  { id: "orion", d: 2.27e14, kind: "nebula", color: "#ff7fb0", approx: true, name: N("Orionnebel", "Orion Nebula", "Nebulosa de Orión", "Nébuleuse d'Orion", "Nebulosa de Órion", "Orion Bulutsusu", "Туманность Ориона", "Νεφέλωμα του Ωρίωνα", "سديم الجبار", "ओरायन नीहारिका", "猎户座大星云", "オリオン大星雲", "오리온 대성운") },
  { id: "lmc", d: 3.0e17, kind: "galaxy", color: "#cfd8ff", approx: true, name: N("Große Magellansche Wolke", "Large Magellanic Cloud", "Gran Nube de Magallanes", "Grand Nuage de Magellan", "Grande Nuvem de Magalhães", "Büyük Macellan Bulutu", "Большое Магелланово Облако", "Μεγάλο Νέφος του Μαγγελάνου", "سحابة ماجلان الكبرى", "बड़ा मैगेलैनिक बादल", "大麦哲伦云", "大マゼラン雲", "대마젤란은하") },
  { id: "milkyway", d: 9.46e17, kind: "galaxy", color: "#ffe2b0", approx: true, name: N("Milchstraße", "Milky Way", "Vía Láctea", "Voie lactée", "Via Láctea", "Samanyolu", "Млечный Путь", "Γαλαξίας", "درب التبانة", "आकाशगंगा (मिल्की वे)", "银河系", "天の川銀河", "우리은하") },
  { id: "andromeda", d: 2.08e18, kind: "galaxy", color: "#ffd9c0", approx: true, name: N("Andromeda-Galaxie", "Andromeda Galaxy", "Galaxia de Andrómeda", "Galaxie d'Andromède", "Galáxia de Andrômeda", "Andromeda Galaksisi", "Галактика Андромеды", "Γαλαξίας της Ανδρομέδας", "مجرة المرأة المسلسلة", "एंड्रोमेडा आकाशगंगा", "仙女座星系", "アンドロメダ銀河", "안드로메다은하") },
  { id: "ic1101", d: 3.8e19, kind: "galaxy", color: "#ffe8c8", approx: true, name: "IC 1101" },
  { id: "laniakea", d: 4.9e21, kind: "cluster", color: "#9fb8ff", approx: true, name: N("Laniakea-Superhaufen", "Laniakea Supercluster", "Supercúmulo Laniakea", "Superamas Laniakea", "Superaglomerado Laniakea", "Laniakea Üstkümesi", "Сверхскопление Ланиакея", "Υπερσμήνος Laniakea", "عنقود لانياكيا الفائق", "लानियाकेआ महागुच्छ", "拉尼亚凯亚超星系团", "ラニアケア超銀河団", "라니아케아 초은하단") },
  { id: "universe", d: 8.8e23, kind: "universe", color: "#6d8cff", approx: true, name: N("Beobachtbares Universum", "Observable universe", "Universo observable", "Univers observable", "Universo observável", "Gözlemlenebilir evren", "Наблюдаемая Вселенная", "Παρατηρήσιμο σύμπαν", "الكون المرئي", "अवलोकनीय ब्रह्मांड", "可观测宇宙", "観測可能な宇宙", "관측 가능한 우주") },
];

interface UiText {
  title: string;
  hint: string;
  diam: string;
  ratio: string;
  ly: string;
  note: string;
  approx: string;
  kinds: Record<Kind, string>;
}

const K = (ns: string, bh: string, dwarf: string, moon: string, planet: string, star: string, orbit: string, nebula: string, galaxy: string, cluster: string, universe: string): Record<Kind, string> =>
  ({ ns, bh, dwarf, moon, planet, star, orbit, nebula, galaxy, cluster, universe });

const UI: Record<Lang, UiText> = {
  de: { title: "Größenvergleich", hint: "Ziehen, scrollen oder Regler: vom Neutronenstern bis zum ganzen beobachtbaren Universum.", diam: "Durchmesser", ratio: "≈ {n}× so groß wie {x}", ly: "Lichtjahre", note: "Echte Durchmesser, gerundet. Bei Riesensternen, Schwarzen Löchern und fernen Galaxien sind die Werte unsicher (ca.). Schwarze Löcher: Ereignishorizont.", approx: "ca.", kinds: K("Neutronenstern", "Schwarzes Loch", "Zwergplanet", "Mond", "Planet", "Stern", "Sonnensystem", "Nebel", "Galaxie", "Superhaufen", "Universum") },
  en: { title: "Size comparison", hint: "Drag, scroll or use the slider: from a neutron star to the entire observable universe.", diam: "Diameter", ratio: "≈ {n}× the size of {x}", ly: "light-years", note: "Real diameters, rounded. For giant stars, black holes and distant galaxies the values are uncertain (approx.). Black holes: event horizon.", approx: "approx.", kinds: K("Neutron star", "Black hole", "Dwarf planet", "Moon", "Planet", "Star", "Solar System", "Nebula", "Galaxy", "Supercluster", "Universe") },
  es: { title: "Comparación de tamaños", hint: "Arrastra, desplázate o usa el control: de una estrella de neutrones a todo el universo observable.", diam: "Diámetro", ratio: "≈ {n}× el tamaño de {x}", ly: "años luz", note: "Diámetros reales, redondeados. En estrellas gigantes, agujeros negros y galaxias lejanas los valores son inciertos (aprox.). Agujeros negros: horizonte de sucesos.", approx: "aprox.", kinds: K("Estrella de neutrones", "Agujero negro", "Planeta enano", "Luna", "Planeta", "Estrella", "Sistema Solar", "Nebulosa", "Galaxia", "Supercúmulo", "Universo") },
  fr: { title: "Comparaison de tailles", hint: "Glisse, fais défiler ou utilise le curseur : d'une étoile à neutrons à tout l'univers observable.", diam: "Diamètre", ratio: "≈ {n}× la taille de {x}", ly: "années-lumière", note: "Diamètres réels, arrondis. Pour les étoiles géantes, les trous noirs et les galaxies lointaines, les valeurs sont incertaines (env.). Trous noirs : horizon des événements.", approx: "env.", kinds: K("Étoile à neutrons", "Trou noir", "Planète naine", "Lune", "Planète", "Étoile", "Système solaire", "Nébuleuse", "Galaxie", "Superamas", "Univers") },
  pt: { title: "Comparação de tamanhos", hint: "Arraste, role ou use o controlo: de uma estrela de nêutrons a todo o universo observável.", diam: "Diâmetro", ratio: "≈ {n}× o tamanho de {x}", ly: "anos-luz", note: "Diâmetros reais, arredondados. Para estrelas gigantes, buracos negros e galáxias distantes, os valores são incertos (aprox.). Buracos negros: horizonte de eventos.", approx: "aprox.", kinds: K("Estrela de nêutrons", "Buraco negro", "Planeta anão", "Lua", "Planeta", "Estrela", "Sistema Solar", "Nebulosa", "Galáxia", "Superaglomerado", "Universo") },
  tr: { title: "Boyut karşılaştırması", hint: "Sürükle, kaydır veya kaydırıcıyı kullan: bir nötron yıldızından tüm gözlemlenebilir evrene.", diam: "Çap", ratio: "≈ {x} boyutunun {n} katı", ly: "ışık yılı", note: "Gerçek çaplar, yuvarlanmış. Dev yıldızlar, kara delikler ve uzak galaksiler için değerler belirsizdir (yakl.). Kara delikler: olay ufku.", approx: "yakl.", kinds: K("Nötron yıldızı", "Kara delik", "Cüce gezegen", "Uydu", "Gezegen", "Yıldız", "Güneş Sistemi", "Bulutsu", "Galaksi", "Üstküme", "Evren") },
  ru: { title: "Сравнение размеров", hint: "Тяните, прокручивайте или используйте ползунок: от нейтронной звезды до всей наблюдаемой Вселенной.", diam: "Диаметр", ratio: "≈ в {n} раз больше, чем {x}", ly: "св. лет", note: "Реальные диаметры, округлены. Для звёзд-гигантов, чёрных дыр и далёких галактик значения неточны (ок.). Чёрные дыры: горизонт событий.", approx: "ок.", kinds: K("Нейтронная звезда", "Чёрная дыра", "Карликовая планета", "Спутник", "Планета", "Звезда", "Солнечная система", "Туманность", "Галактика", "Сверхскопление", "Вселенная") },
  el: { title: "Σύγκριση μεγεθών", hint: "Σύρετε, κυλήστε ή χρησιμοποιήστε τον ρυθμιστή: από ένα αστέρι νετρονίων μέχρι ολόκληρο το παρατηρήσιμο σύμπαν.", diam: "Διάμετρος", ratio: "≈ {n}× το μέγεθος: {x}", ly: "έτη φωτός", note: "Πραγματικές διάμετροι, στρογγυλεμένες. Για γιγάντια αστέρια, μαύρες τρύπες και μακρινούς γαλαξίες οι τιμές είναι αβέβαιες (περ.). Μαύρες τρύπες: ορίζοντας γεγονότων.", approx: "περ.", kinds: K("Αστέρας νετρονίων", "Μαύρη τρύπα", "Νάνος πλανήτης", "Δορυφόρος", "Πλανήτης", "Αστέρι", "Ηλιακό σύστημα", "Νεφέλωμα", "Γαλαξίας", "Υπερσμήνος", "Σύμπαν") },
  ar: { title: "مقارنة الأحجام", hint: "اسحب أو مرّر أو استخدم الشريط: من نجم نيوتروني إلى الكون المرئي كله.", diam: "القطر", ratio: "≈ {n} ضعف حجم {x}", ly: "سنة ضوئية", note: "أقطار حقيقية مقرّبة. القيم غير مؤكدة للنجوم العملاقة والثقوب السوداء والمجرات البعيدة (تقريبًا). الثقوب السوداء: أفق الحدث.", approx: "تقريبًا", kinds: K("نجم نيوتروني", "ثقب أسود", "كوكب قزم", "قمر", "كوكب", "نجم", "المجموعة الشمسية", "سديم", "مجرة", "عنقود فائق", "الكون") },
  hi: { title: "आकार तुलना", hint: "खींचें, स्क्रॉल करें या स्लाइडर का उपयोग करें: न्यूट्रॉन तारे से पूरे अवलोकनीय ब्रह्मांड तक।", diam: "व्यास", ratio: "≈ {x} से {n} गुना बड़ा", ly: "प्रकाश-वर्ष", note: "वास्तविक व्यास, गोल किए गए। विशाल तारों, ब्लैक होल और दूर की आकाशगंगाओं के मान अनिश्चित हैं (लगभग)। ब्लैक होल: घटना क्षितिज।", approx: "लगभग", kinds: K("न्यूट्रॉन तारा", "ब्लैक होल", "बौना ग्रह", "उपग्रह", "ग्रह", "तारा", "सौर मंडल", "नीहारिका", "आकाशगंगा", "महागुच्छ", "ब्रह्मांड") },
  zh: { title: "大小比较", hint: "拖动、滚动或使用滑块：从中子星到整个可观测宇宙。", diam: "直径", ratio: "≈ {x} 的 {n} 倍", ly: "光年", note: "真实直径，已取整。巨星、黑洞和遥远星系的数值不确定（约）。黑洞：事件视界。", approx: "约", kinds: K("中子星", "黑洞", "矮行星", "卫星", "行星", "恒星", "太阳系", "星云", "星系", "超星系团", "宇宙") },
  ja: { title: "大きさ比較", hint: "ドラッグ、スクロール、またはスライダーで：中性子星から観測可能な宇宙全体まで。", diam: "直径", ratio: "≈ {x}の{n}倍", ly: "光年", note: "実際の直径（概数）。巨星、ブラックホール、遠方銀河の値は不確かです（約）。ブラックホール：事象の地平面。", approx: "約", kinds: K("中性子星", "ブラックホール", "準惑星", "衛星", "惑星", "恒星", "太陽系", "星雲", "銀河", "超銀河団", "宇宙") },
  ko: { title: "크기 비교", hint: "드래그, 스크롤 또는 슬라이더로: 중성자별부터 관측 가능한 우주 전체까지.", diam: "지름", ratio: "≈ {x}의 {n}배", ly: "광년", note: "실제 지름(반올림). 거성, 블랙홀, 먼 은하의 값은 불확실합니다(약). 블랙홀: 사건의 지평선.", approx: "약", kinds: K("중성자별", "블랙홀", "왜행성", "위성", "행성", "항성", "태양계", "성운", "은하", "초은하단", "우주") },
};

const LY_KM = 9.461e12;

function objName(o: Obj, lang: Lang): string {
  if (typeof o.name === "string") return o.name;
  if (o.name) return o.name[lang] ?? o.name.en;
  const b = findBody(o.id);
  return b ? b.name[lang] ?? b.name.en ?? b.name.de : o.id;
}

function fmt(n: number, lang: Lang): string {
  try {
    if (n < 1e6) return new Intl.NumberFormat(lang, { maximumFractionDigits: n < 10 ? 1 : 0 }).format(n);
    return new Intl.NumberFormat(lang, { notation: "compact", maximumFractionDigits: 1 }).format(n);
  } catch {
    return String(Math.round(n));
  }
}

function sizeText(o: Obj, lang: Lang, ui: UiText): string {
  const v = o.d < 1e12 ? `${fmt(o.d, lang)} km` : `${fmt(o.d / LY_KM, lang)} ${ui.ly}`;
  return o.approx ? `${ui.approx} ${v}` : v;
}

/* ---------- Zeichnen ---------- */

function hexToRgb(h: string): [number, number, number] {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const rgba = (h: string, a: number) => {
  const [r, g, b] = hexToRgb(h);
  return `rgba(${r},${g},${b},${a})`;
};

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function drawObj(g: CanvasRenderingContext2D, o: Obj, x: number, y: number, r: number, W: number, H: number) {
  // Riesige Objekte, die den ganzen Bildschirm füllen: nur den sichtbaren Rand als Fläche zeichnen.
  if (r > 4e5) {
    const left = x - r;
    const soft = o.kind === "galaxy" || o.kind === "cluster" || o.kind === "universe" || o.kind === "nebula";
    const grad = g.createLinearGradient(left, 0, left + W * 0.6, 0);
    grad.addColorStop(0, rgba(o.color, soft ? 0.28 : 0.55));
    grad.addColorStop(1, rgba(o.color, o.kind === "bh" || soft ? 0.04 : 0.18));
    g.fillStyle = o.kind === "bh" ? "#000" : grad;
    g.fillRect(Math.max(0, left), 0, W, H);
    if (o.kind === "bh") {
      g.fillStyle = grad;
      g.fillRect(Math.max(0, left), 0, 6, H);
    }
    return;
  }
  const c = o.color;
  if (o.kind === "bh") {
    const glow = g.createRadialGradient(x, y, r * 0.95, x, y, r * 1.7);
    glow.addColorStop(0, rgba(c, 0.9));
    glow.addColorStop(0.25, rgba(c, 0.35));
    glow.addColorStop(1, rgba(c, 0));
    g.fillStyle = glow;
    g.beginPath(); g.arc(x, y, r * 1.7, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#000";
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    return;
  }
  if (o.kind === "orbit") {
    g.strokeStyle = rgba(c, 0.7);
    g.lineWidth = 1.2;
    g.setLineDash([5, 5]);
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.stroke();
    g.setLineDash([]);
    g.fillStyle = "#ffd166";
    g.beginPath(); g.arc(x, y, Math.max(1.5, r * 0.0003), 0, Math.PI * 2); g.fill();
    return;
  }
  if (o.kind === "galaxy" || o.kind === "nebula" || o.kind === "cluster" || o.kind === "universe") {
    g.save();
    g.translate(x, y);
    if (o.kind === "galaxy") { g.rotate(-0.35); g.scale(1, o.id === "lmc" ? 0.7 : 0.42); }
    const grad = g.createRadialGradient(0, 0, 0, 0, 0, r);
    if (o.kind === "galaxy") {
      grad.addColorStop(0, "rgba(255,248,230,0.95)");
      grad.addColorStop(0.12, rgba(c, 0.75));
      grad.addColorStop(0.5, "rgba(140,170,255,0.25)");
      grad.addColorStop(1, "rgba(120,150,255,0)");
    } else if (o.kind === "universe") {
      grad.addColorStop(0, "rgba(60,80,170,0.35)");
      grad.addColorStop(0.85, "rgba(120,90,200,0.3)");
      grad.addColorStop(0.97, "rgba(255,150,90,0.45)");
      grad.addColorStop(1, "rgba(255,150,90,0)");
    } else {
      grad.addColorStop(0, rgba(c, 0.6));
      grad.addColorStop(0.6, rgba(c, 0.22));
      grad.addColorStop(1, rgba(c, 0));
    }
    g.fillStyle = grad;
    g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fill();
    if (r > 8 && o.kind !== "nebula") {
      const rnd = seeded(o.id.length * 977 + o.d % 97);
      const n = o.kind === "galaxy" ? 160 : 220;
      for (let i = 0; i < n; i++) {
        let px: number, py: number;
        if (o.kind === "galaxy" && o.id !== "lmc" && o.id !== "ic1101") {
          const arm = i % 2, t = rnd() * 3.2;
          const a = t * 1.7 + arm * Math.PI, rr = (0.12 + t / 3.6) * r;
          px = Math.cos(a) * rr + (rnd() - 0.5) * r * 0.12;
          py = Math.sin(a) * rr + (rnd() - 0.5) * r * 0.12;
        } else {
          const a = rnd() * Math.PI * 2, rr = Math.sqrt(rnd()) * r * 0.95;
          px = Math.cos(a) * rr; py = Math.sin(a) * rr;
        }
        g.fillStyle = `rgba(255,255,255,${0.25 + rnd() * 0.5})`;
        g.fillRect(px, py, 1.2, 1.2);
      }
    }
    g.restore();
    return;
  }
  // Kugeln: Sterne, Planeten, Monde, Zwergplaneten, Neutronenstern
  if (o.kind === "star" || o.kind === "ns") {
    const glow = g.createRadialGradient(x, y, r * 0.8, x, y, r * 1.6);
    glow.addColorStop(0, rgba(c, 0.45));
    glow.addColorStop(1, rgba(c, 0));
    g.fillStyle = glow;
    g.beginPath(); g.arc(x, y, r * 1.6, 0, Math.PI * 2); g.fill();
    const body = g.createRadialGradient(x, y, 0, x, y, r);
    body.addColorStop(0, "#fffaf0");
    body.addColorStop(0.55, c);
    body.addColorStop(1, rgba(c, 0.85));
    g.fillStyle = body;
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    return;
  }
  if (o.ring) {
    g.strokeStyle = rgba(c, 0.6);
    g.lineWidth = Math.max(1, r * 0.18);
    g.beginPath(); g.ellipse(x, y, r * 1.9, r * 0.45, -0.25, 0, Math.PI * 2); g.stroke();
  }
  const body = g.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.05, x, y, r);
  body.addColorStop(0, "#ffffff");
  body.addColorStop(0.15, c);
  body.addColorStop(1, "#0b0b0b");
  g.fillStyle = body;
  g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
}

export default function SizeComparison({ index }: { index: string }) {
  const { lang } = useLanguage();
  const ui = UI[lang] ?? UI.en;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const target = useRef(8); // Start: Erde
  const cur = useRef(8);
  const [shown, setShown] = useState(8);
  const [slider, setSlider] = useState(8);
  const langRef = useRef(lang);
  const dirty = useRef(true);
  useEffect(() => {
    langRef.current = lang;
    dirty.current = true;
  }, [lang]);

  useEffect(() => {
    const cvs = canvasRef.current, wrap = wrapRef.current;
    if (!cvs || !wrap) return;
    const g = cvs.getContext("2d");
    if (!g) return;
    let raf = 0, W = 0, H = 0, D = 1, lastShown = -1, visible = true;
    dirty.current = true;
    const last = OBJECTS.length - 1;

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      D = Math.min(2, window.devicePixelRatio || 1);
      W = r.width; H = r.height;
      cvs.width = Math.round(W * D); cvs.height = Math.round(H * D);
      dirty.current = true;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    const io = new IntersectionObserver((e) => { visible = e[0]?.isIntersecting ?? true; });
    io.observe(wrap);

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const diff = target.current - cur.current;
      if (!visible || W === 0 || (Math.abs(diff) < 0.0005 && !dirty.current)) return;
      dirty.current = false;
      cur.current += Math.abs(diff) < 0.0005 ? diff : diff * 0.14;
      const t = Math.max(0, Math.min(last, cur.current));
      const i0 = Math.floor(t), i1 = Math.min(last, i0 + 1), f = t - i0;
      const focusD = Math.exp(Math.log(OBJECTS[i0].d) * (1 - f) + Math.log(OBJECTS[i1].d) * f);
      const k = Math.min(W * 0.42, H * 0.56) / focusD; // Pixel pro km
      const gap = W * 0.08;
      const rs = OBJECTS.map((o) => (o.d * k) / 2);
      const xs: number[] = [];
      rs.forEach((r, i) => { xs.push(i === 0 ? 0 : xs[i - 1] + rs[i - 1] + gap + r); });
      const fx = xs[i0] * (1 - f) + xs[i1] * f;
      const off = W / 2 - fx, cy = H * 0.46;

      g.setTransform(D, 0, 0, D, 0, 0);
      g.clearRect(0, 0, W, H);
      const lng = langRef.current;
      const focus = Math.round(t);
      const labels: { x: number; y: number; text: string; main: boolean }[] = [];
      for (let i = 0; i <= last; i++) {
        const o = OBJECTS[i], r = rs[i], x = xs[i] + off;
        if (r < 0.4 || x + r * 1.8 < 0 || x - r * 1.8 > W) continue;
        drawObj(g, o, x, cy, Math.max(r, 0.8), W, H);
        if (r >= 2.5 && r < H * 0.42) {
          const name = objName(o, lng);
          labels.push({ x, y: cy + Math.max(r, 6) * (o.kind === "galaxy" ? 0.55 : 1) + 8, text: name.length > 26 ? name.slice(0, 25) + "…" : name, main: i === focus });
        }
      }
      // Beschriftungen ohne Überlappung; das Objekt im Fokus hat Vorrang.
      labels.sort((a, b) => Number(b.main) - Number(a.main));
      const taken: [number, number, number][] = [];
      g.textAlign = "center";
      g.textBaseline = "top";
      for (const l of labels) {
        g.font = `${l.main ? 600 : 400} 11px ui-monospace, monospace`;
        const w = g.measureText(l.text).width, a = l.x - w / 2 - 4, b = l.x + w / 2 + 4;
        if (taken.some(([ta, tb, ty]) => a < tb && b > ta && Math.abs(ty - l.y) < 14)) continue;
        taken.push([a, b, l.y]);
        g.fillStyle = l.main ? "#f2f2f0" : "rgba(242,242,240,0.6)";
        g.fillText(l.text, l.x, l.y);
      }
      const s = Math.round(t);
      if (s !== lastShown) { lastShown = s; setShown(s); }
    };
    raf = requestAnimationFrame(frame);

    let drag: { x: number; t: number } | null = null;
    const down = (e: PointerEvent) => { drag = { x: e.clientX, t: target.current }; cvs.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const v = Math.max(0, Math.min(last, drag.t - (e.clientX - drag.x) / (W * 0.35)));
      target.current = v; setSlider(v);
    };
    const up = () => { drag = null; };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const v = Math.max(0, Math.min(last, target.current + e.deltaY * 0.0025));
      target.current = v; setSlider(v);
    };
    cvs.addEventListener("pointerdown", down);
    cvs.addEventListener("pointermove", move);
    cvs.addEventListener("pointerup", up);
    cvs.addEventListener("pointercancel", up);
    cvs.addEventListener("wheel", wheel, { passive: false });
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      cvs.removeEventListener("pointerdown", down);
      cvs.removeEventListener("pointermove", move);
      cvs.removeEventListener("pointerup", up);
      cvs.removeEventListener("pointercancel", up);
      cvs.removeEventListener("wheel", wheel);
    };
  }, []);

  const go = (v: number) => {
    const c = Math.max(0, Math.min(OBJECTS.length - 1, v));
    target.current = c; setSlider(c);
  };

  const o = OBJECTS[shown];
  const prev = shown > 0 ? OBJECTS[shown - 1] : null;
  const ratio = prev ? o.d / prev.d : 0;
  const ratioText = prev ? ui.ratio.replace("{n}", fmt(ratio, lang)).replace("{x}", objName(prev, lang)) : "";

  return (
    <section className="mb-10">
      <SectionHeading index={index} label={ui.title} />
    <div className="hud-card overflow-hidden p-3 sm:p-4">
      <div ref={wrapRef} className="relative h-64 w-full touch-pan-y select-none sm:h-80">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing" />
      </div>
      <div className="mt-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="label-mono text-[10px] uppercase text-accent">{ui.kinds[o.kind]}</p>
          <p className="font-display text-base font-bold uppercase tracking-wide text-foreground sm:text-lg">{objName(o, lang)}</p>
          <p className="text-xs text-muted">
            {ui.diam}: <span className="text-foreground">{sizeText(o, lang, ui)}</span>
          </p>
          {prev && <p className="mt-0.5 text-[11px] text-muted">{ratioText}</p>}
        </div>
        <div className="flex shrink-0 gap-1.5">
          <button type="button" onClick={() => go(Math.round(slider) - 1)} className="h-9 w-9 border border-border text-foreground transition-colors hover:border-accent hover:text-accent" aria-label="‹">‹</button>
          <button type="button" onClick={() => go(Math.round(slider) + 1)} className="h-9 w-9 border border-border text-foreground transition-colors hover:border-accent hover:text-accent" aria-label="›">›</button>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={OBJECTS.length - 1}
        step={0.01}
        value={slider}
        onChange={(e) => go(parseFloat(e.target.value))}
        className="mt-3 w-full accent-[#ff5a4d]"
        aria-label={ui.title}
      />
      <p className="mt-2 text-[10px] leading-snug text-muted">{ui.hint}</p>
      <p className="mt-1 text-[10px] leading-snug text-muted/70">{ui.note}</p>
    </div>
    </section>
  );
}
