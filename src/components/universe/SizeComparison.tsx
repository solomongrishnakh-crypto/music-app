"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage, type Lang } from "@/contexts/LanguageContext";
import { findBody } from "@/components/space/bodies";
import SectionHeading from "@/components/ui/SectionHeading";
import { cachedCanvas, earthCloudsCanvas, saturnRingCanvas, surfaceCanvas } from "@/components/universe/planetTextures";
import { ANIM, ATMO, ROT_SPEED, buildRot, drawBH, drawPulsar, drawStarGlow, makeStarTex, pickSize, renderRot, starLook, texFromCanvas, type Rot } from "./sizeFx";
import { UI2 } from "./sizeText";
import SizePicker, { type PickItem } from "./SizePicker";

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
  tex?: string; // Oberflächenkarte (equirektangular) für die Kugel
  photo?: [string, number, number[]?]; // echtes Foto, Bildbreite in Durchmessern, optional Ausschnitt [x, y, Breite, Winkel, Achsenverhältnis]
}

const N = (de: string, en: string, es: string, fr: string, pt: string, tr: string, ru: string, el: string, ar: string, hi: string, zh: string, ja: string, ko: string): Names =>
  ({ de, en, es, fr, pt, tr, ru, el, ar, hi, zh, ja, ko });

const OBJECTS: Obj[] = [
  { id: "ns", d: 20, kind: "ns", color: "#bcd4ff", approx: true, name: N("Neutronenstern", "Neutron star", "Estrella de neutrones", "Étoile à neutrons", "Estrela de nêutrons", "Nötron yıldızı", "Нейтронная звезда", "Αστέρας νετρονίων", "نجم نيوتروني", "न्यूट्रॉन तारा", "中子星", "中性子星", "중성자별") },
  { id: "sbh", d: 59, kind: "bh", color: "#ff9a4d", name: N("Schwarzes Loch (10 Sonnenmassen)", "Black hole (10 solar masses)", "Agujero negro (10 masas solares)", "Trou noir (10 masses solaires)", "Buraco negro (10 massas solares)", "Kara delik (10 Güneş kütlesi)", "Чёрная дыра (10 масс Солнца)", "Μαύρη τρύπα (10 ηλιακές μάζες)", "ثقب أسود (10 كتل شمسية)", "ब्लैक होल (10 सौर द्रव्यमान)", "黑洞（10 倍太阳质量）", "ブラックホール（太陽質量の10倍）", "블랙홀 (태양 질량 10배)") },
  { id: "ceres", d: 940, kind: "dwarf", color: "#8d877f", tex: "thumb/6/67/PIA19606-Ceres-Dawn-GlobalMap-Unannotated-20150728.jpg/1280px-PIA19606-Ceres-Dawn-GlobalMap-Unannotated-20150728.jpg" },
  { id: "pluto", d: 2377, kind: "dwarf", color: "#c9b49a", tex: "thumb/a/ad/Pluto_color_mapmosaic.jpg/1280px-Pluto_color_mapmosaic.jpg" },
  { id: "moon", d: 3475, kind: "moon", color: "#a9a9a6", tex: "2/26/Solarsystemscope_texture_2k_moon.jpg", name: N("Mond", "Moon", "Luna", "Lune", "Lua", "Ay", "Луна", "Σελήνη", "القمر", "चंद्रमा", "月球", "月", "달") },
  { id: "mercury", d: 4879, kind: "planet", color: "#9c9288", tex: "9/92/Solarsystemscope_texture_2k_mercury.jpg" },
  { id: "mars", d: 6779, kind: "planet", color: "#c1623f", tex: "4/46/Solarsystemscope_texture_2k_mars.jpg" },
  { id: "venus", d: 12104, kind: "planet", color: "#e3c58f", tex: "6/63/Solarsystemscope_texture_2k_venus_atmosphere.jpg" },
  { id: "earth", d: 12742, kind: "planet", color: "#3f7fd1", tex: "c/c3/Solarsystemscope_texture_2k_earth_daymap.jpg" },
  { id: "neptune", d: 49244, kind: "planet", color: "#3d5fd6", tex: "1/1e/Solarsystemscope_texture_2k_neptune.jpg" },
  { id: "uranus", d: 50724, kind: "planet", color: "#8fd3dc", tex: "9/95/Solarsystemscope_texture_2k_uranus.jpg" },
  { id: "saturn", d: 116460, kind: "planet", color: "#d9be86", ring: true, tex: "e/ea/Solarsystemscope_texture_2k_saturn.jpg" },
  { id: "jupiter", d: 139820, kind: "planet", color: "#c9a27c", tex: "b/be/Solarsystemscope_texture_2k_jupiter.jpg" },
  { id: "proxima", d: 214800, kind: "star", color: "#ff6b3d", name: "Proxima Centauri" },
  { id: "sun", d: 1392700, kind: "star", color: "#ffd166" },
  { id: "sirius", d: 2383000, kind: "star", color: "#dfe8ff", name: "Sirius A" },
  { id: "sgra", d: 25400000, kind: "bh", color: "#ff9a4d", name: "Sagittarius A*" },
  { id: "arcturus", d: 35400000, kind: "star", color: "#ffa95c", name: N("Arktur", "Arcturus", "Arturo", "Arcturus", "Arcturo", "Arcturus", "Арктур", "Αρκτούρος", "السماك الرامح", "स्वाति (आर्कटुरस)", "大角星", "アークトゥルス", "아르크투루스") },
  { id: "rigel", d: 110000000, kind: "star", color: "#a9c4ff", approx: true, name: N("Rigel", "Rigel", "Rigel", "Rigel", "Rigel", "Rigel", "Ригель", "Ρίγκελ", "رجل الجبار", "राइजेल", "参宿七", "リゲル", "리겔") },
  { id: "betelgeuse", d: 1060000000, kind: "star", color: "#ff5a3a", approx: true, name: N("Beteigeuze", "Betelgeuse", "Betelgeuse", "Bételgeuse", "Betelgeuse", "Betelgeuse", "Бетельгейзе", "Μπετελγκέζ", "منكب الجوزاء", "आर्द्रा (बेटेलगेयूज़)", "参宿四", "ベテルギウス", "베텔게우스") },
  { id: "uyscuti", d: 1270000000, kind: "star", color: "#ff7046", approx: true, name: "UY Scuti" },
  { id: "st218", d: 2990000000, kind: "star", color: "#ff4b2e", approx: true, name: "Stephenson 2-18" },
  { id: "neporbit", d: 9000000000, kind: "orbit", color: "#7fa8ff", name: N("Neptunbahn (Sonnensystem)", "Neptune's orbit (Solar System)", "Órbita de Neptuno (Sistema Solar)", "Orbite de Neptune (Système solaire)", "Órbita de Netuno (Sistema Solar)", "Neptün'ün yörüngesi (Güneş Sistemi)", "Орбита Нептуна (Солнечная система)", "Τροχιά του Ποσειδώνα (Ηλιακό σύστημα)", "مدار نبتون (المجموعة الشمسية)", "नेपच्यून की कक्षा (सौर मंडल)", "海王星轨道（太阳系）", "海王星の軌道（太陽系）", "해왕성 궤도 (태양계)") },
  { id: "m87", d: 38000000000, kind: "bh", color: "#ff9a4d", approx: true, name: "M87*" },
  { id: "ton618", d: 240000000000, kind: "bh", color: "#ff9a4d", approx: true, name: "TON 618" },
  { id: "orion", d: 2.27e14, kind: "nebula", color: "#ff7fb0", approx: true, photo: ["thumb/f/f3/Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg/960px-Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg", 1.05], name: N("Orionnebel", "Orion Nebula", "Nebulosa de Orión", "Nébuleuse d'Orion", "Nebulosa de Órion", "Orion Bulutsusu", "Туманность Ориона", "Νεφέλωμα του Ωρίωνα", "سديم الجبار", "ओरायन नीहारिका", "猎户座大星云", "オリオン大星雲", "오리온 대성운") },
  { id: "lmc", d: 3.0e17, kind: "galaxy", color: "#cfd8ff", approx: true, photo: ["9/94/Large.mc.arp.750pix.jpg", 1.7], name: N("Große Magellansche Wolke", "Large Magellanic Cloud", "Gran Nube de Magallanes", "Grand Nuage de Magellan", "Grande Nuvem de Magalhães", "Büyük Macellan Bulutu", "Большое Магелланово Облако", "Μεγάλο Νέφος του Μαγγελάνου", "سحابة ماجلان الكبرى", "बड़ा मैगेलैनिक बादल", "大麦哲伦云", "大マゼラン雲", "대마젤란은하") },
  { id: "milkyway", d: 9.46e17, kind: "galaxy", color: "#ffe2b0", approx: true, photo: ["thumb/8/82/Milky_Way_Galaxy.jpg/960px-Milky_Way_Galaxy.jpg", 1.1], name: N("Milchstraße", "Milky Way", "Vía Láctea", "Voie lactée", "Via Láctea", "Samanyolu", "Млечный Путь", "Γαλαξίας", "درب التبانة", "आकाशगंगा (मिल्की वे)", "银河系", "天の川銀河", "우리은하") },
  { id: "andromeda", d: 2.08e18, kind: "galaxy", color: "#ffd9c0", approx: true, photo: ["thumb/9/98/Andromeda_Galaxy_%28with_h-alpha%29.jpg/960px-Andromeda_Galaxy_%28with_h-alpha%29.jpg", 1.16, [0.49, 0.5, 0.36, 0.54, 0.4]], name: N("Andromeda-Galaxie", "Andromeda Galaxy", "Galaxia de Andrómeda", "Galaxie d'Andromède", "Galáxia de Andrômeda", "Andromeda Galaksisi", "Галактика Андромеды", "Γαλαξίας της Ανδρομέδας", "مجرة المرأة المسلسلة", "एंड्रोमेडा आकाशगंगा", "仙女座星系", "アンドロメダ銀河", "안드로메다은하") },
  { id: "ic1101", d: 3.8e19, kind: "galaxy", color: "#ffe8c8", approx: true, photo: ["4/46/IC_1101.jpg", 2.6], name: "IC 1101" },
  { id: "laniakea", d: 4.9e21, kind: "cluster", color: "#9fb8ff", approx: true, name: N("Laniakea-Superhaufen", "Laniakea Supercluster", "Supercúmulo Laniakea", "Superamas Laniakea", "Superaglomerado Laniakea", "Laniakea Üstkümesi", "Сверхскопление Ланиакея", "Υπερσμήνος Laniakea", "عنقود لانياكيا الفائق", "लानियाकेआ महागुच्छ", "拉尼亚凯亚超星系团", "ラニアケア超銀河団", "라니아케아 초은하단") },
  { id: "universe", d: 8.8e23, kind: "universe", color: "#6d8cff", approx: true, photo: ["thumb/e/e7/Observable_universe_logarithmic_illustration.png/960px-Observable_universe_logarithmic_illustration.png", 1.03], name: N("Beobachtbares Universum", "Observable universe", "Universo observable", "Univers observable", "Universo observável", "Gözlemlenebilir evren", "Наблюдаемая Вселенная", "Παρατηρήσιμο σύμπαν", "الكون المرئي", "अवलोकनीय ब्रह्मांड", "可观测宇宙", "観測可能な宇宙", "관측 가능한 우주") },
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
  zoom: string;
  compare: string;
  vol: string;
  tiny: string;
}

const K = (ns: string, bh: string, dwarf: string, moon: string, planet: string, star: string, orbit: string, nebula: string, galaxy: string, cluster: string, universe: string): Record<Kind, string> =>
  ({ ns, bh, dwarf, moon, planet, star, orbit, nebula, galaxy, cluster, universe });

const UI: Record<Lang, UiText> = {
  de: { title: "Größenvergleich", hint: "Ziehen, scrollen oder Regler: vom Neutronenstern bis zum ganzen beobachtbaren Universum.", diam: "Durchmesser", ratio: "≈ {n}× so groß wie {x}", ly: "Lichtjahre", note: "Echte Durchmesser, gerundet. Bei Riesensternen, Schwarzen Löchern und fernen Galaxien sind die Werte unsicher (ca.). Schwarze Löcher: Ereignishorizont.", approx: "ca.", kinds: K("Neutronenstern", "Schwarzes Loch", "Zwergplanet", "Mond", "Planet", "Stern", "Sonnensystem", "Nebel", "Galaxie", "Superhaufen", "Universum"), zoom: "Reise", compare: "Vergleichen", vol: "Volumen ≈ {n}× – so oft passt {x} hinein", tiny: "{x} ist hier kleiner als 1 Pixel" },
  en: { title: "Size comparison", hint: "Drag, scroll or use the slider: from a neutron star to the entire observable universe.", diam: "Diameter", ratio: "≈ {n}× the size of {x}", ly: "light-years", note: "Real diameters, rounded. For giant stars, black holes and distant galaxies the values are uncertain (approx.). Black holes: event horizon.", approx: "approx.", kinds: K("Neutron star", "Black hole", "Dwarf planet", "Moon", "Planet", "Star", "Solar System", "Nebula", "Galaxy", "Supercluster", "Universe"), zoom: "Journey", compare: "Compare", vol: "Volume ≈ {n}× – that's how many {x} fit inside", tiny: "{x} is smaller than 1 pixel here" },
  es: { title: "Comparación de tamaños", hint: "Arrastra, desplázate o usa el control: de una estrella de neutrones a todo el universo observable.", diam: "Diámetro", ratio: "≈ {n}× el tamaño de {x}", ly: "años luz", note: "Diámetros reales, redondeados. En estrellas gigantes, agujeros negros y galaxias lejanas los valores son inciertos (aprox.). Agujeros negros: horizonte de sucesos.", approx: "aprox.", kinds: K("Estrella de neutrones", "Agujero negro", "Planeta enano", "Luna", "Planeta", "Estrella", "Sistema Solar", "Nebulosa", "Galaxia", "Supercúmulo", "Universo"), zoom: "Viaje", compare: "Comparar", vol: "Volumen ≈ {n}× – tantas veces cabe {x} dentro", tiny: "{x} mide aquí menos de 1 píxel" },
  fr: { title: "Comparaison de tailles", hint: "Glisse, fais défiler ou utilise le curseur : d'une étoile à neutrons à tout l'univers observable.", diam: "Diamètre", ratio: "≈ {n}× la taille de {x}", ly: "années-lumière", note: "Diamètres réels, arrondis. Pour les étoiles géantes, les trous noirs et les galaxies lointaines, les valeurs sont incertaines (env.). Trous noirs : horizon des événements.", approx: "env.", kinds: K("Étoile à neutrons", "Trou noir", "Planète naine", "Lune", "Planète", "Étoile", "Système solaire", "Nébuleuse", "Galaxie", "Superamas", "Univers"), zoom: "Voyage", compare: "Comparer", vol: "Volume ≈ {n}× – autant de fois {x} y tient", tiny: "{x} fait ici moins d'1 pixel" },
  pt: { title: "Comparação de tamanhos", hint: "Arraste, role ou use o controlo: de uma estrela de nêutrons a todo o universo observável.", diam: "Diâmetro", ratio: "≈ {n}× o tamanho de {x}", ly: "anos-luz", note: "Diâmetros reais, arredondados. Para estrelas gigantes, buracos negros e galáxias distantes, os valores são incertos (aprox.). Buracos negros: horizonte de eventos.", approx: "aprox.", kinds: K("Estrela de nêutrons", "Buraco negro", "Planeta anão", "Lua", "Planeta", "Estrela", "Sistema Solar", "Nebulosa", "Galáxia", "Superaglomerado", "Universo"), zoom: "Viagem", compare: "Comparar", vol: "Volume ≈ {n}× – tantas vezes cabe {x} dentro", tiny: "{x} tem aqui menos de 1 pixel" },
  tr: { title: "Boyut karşılaştırması", hint: "Sürükle, kaydır veya kaydırıcıyı kullan: bir nötron yıldızından tüm gözlemlenebilir evrene.", diam: "Çap", ratio: "≈ {x} boyutunun {n} katı", ly: "ışık yılı", note: "Gerçek çaplar, yuvarlanmış. Dev yıldızlar, kara delikler ve uzak galaksiler için değerler belirsizdir (yakl.). Kara delikler: olay ufku.", approx: "yakl.", kinds: K("Nötron yıldızı", "Kara delik", "Cüce gezegen", "Uydu", "Gezegen", "Yıldız", "Güneş Sistemi", "Bulutsu", "Galaksi", "Üstküme", "Evren"), zoom: "Yolculuk", compare: "Karşılaştır", vol: "Hacim ≈ {n}× – içine bu kadar {x} sığar", tiny: "{x} burada 1 pikselden küçük" },
  ru: { title: "Сравнение размеров", hint: "Тяните, прокручивайте или используйте ползунок: от нейтронной звезды до всей наблюдаемой Вселенной.", diam: "Диаметр", ratio: "≈ в {n} раз больше, чем {x}", ly: "св. лет", note: "Реальные диаметры, округлены. Для звёзд-гигантов, чёрных дыр и далёких галактик значения неточны (ок.). Чёрные дыры: горизонт событий.", approx: "ок.", kinds: K("Нейтронная звезда", "Чёрная дыра", "Карликовая планета", "Спутник", "Планета", "Звезда", "Солнечная система", "Туманность", "Галактика", "Сверхскопление", "Вселенная"), zoom: "Путешествие", compare: "Сравнить", vol: "Объём ≈ {n}× – столько раз {x} поместится внутри", tiny: "{x} здесь меньше 1 пикселя" },
  el: { title: "Σύγκριση μεγεθών", hint: "Σύρετε, κυλήστε ή χρησιμοποιήστε τον ρυθμιστή: από ένα αστέρι νετρονίων μέχρι ολόκληρο το παρατηρήσιμο σύμπαν.", diam: "Διάμετρος", ratio: "≈ {n}× το μέγεθος: {x}", ly: "έτη φωτός", note: "Πραγματικές διάμετροι, στρογγυλεμένες. Για γιγάντια αστέρια, μαύρες τρύπες και μακρινούς γαλαξίες οι τιμές είναι αβέβαιες (περ.). Μαύρες τρύπες: ορίζοντας γεγονότων.", approx: "περ.", kinds: K("Αστέρας νετρονίων", "Μαύρη τρύπα", "Νάνος πλανήτης", "Δορυφόρος", "Πλανήτης", "Αστέρι", "Ηλιακό σύστημα", "Νεφέλωμα", "Γαλαξίας", "Υπερσμήνος", "Σύμπαν"), zoom: "Ταξίδι", compare: "Σύγκριση", vol: "Όγκος ≈ {n}× – τόσες φορές χωράει μέσα: {x}", tiny: "{x}: μικρότερο από 1 pixel εδώ" },
  ar: { title: "مقارنة الأحجام", hint: "اسحب أو مرّر أو استخدم الشريط: من نجم نيوتروني إلى الكون المرئي كله.", diam: "القطر", ratio: "≈ {n} ضعف حجم {x}", ly: "سنة ضوئية", note: "أقطار حقيقية مقرّبة. القيم غير مؤكدة للنجوم العملاقة والثقوب السوداء والمجرات البعيدة (تقريبًا). الثقوب السوداء: أفق الحدث.", approx: "تقريبًا", kinds: K("نجم نيوتروني", "ثقب أسود", "كوكب قزم", "قمر", "كوكب", "نجم", "المجموعة الشمسية", "سديم", "مجرة", "عنقود فائق", "الكون"), zoom: "رحلة", compare: "مقارنة", vol: "الحجم ≈ {n}× – هذا عدد مرات {x} التي تتسع بداخله", tiny: "{x} أصغر من بكسل واحد هنا" },
  hi: { title: "आकार तुलना", hint: "खींचें, स्क्रॉल करें या स्लाइडर का उपयोग करें: न्यूट्रॉन तारे से पूरे अवलोकनीय ब्रह्मांड तक।", diam: "व्यास", ratio: "≈ {x} से {n} गुना बड़ा", ly: "प्रकाश-वर्ष", note: "वास्तविक व्यास, गोल किए गए। विशाल तारों, ब्लैक होल और दूर की आकाशगंगाओं के मान अनिश्चित हैं (लगभग)। ब्लैक होल: घटना क्षितिज।", approx: "लगभग", kinds: K("न्यूट्रॉन तारा", "ब्लैक होल", "बौना ग्रह", "उपग्रह", "ग्रह", "तारा", "सौर मंडल", "नीहारिका", "आकाशगंगा", "महागुच्छ", "ब्रह्मांड"), zoom: "यात्रा", compare: "तुलना करें", vol: "आयतन ≈ {n}× – इतने {x} अंदर समा सकते हैं", tiny: "{x} यहाँ 1 पिक्सेल से छोटा है" },
  zh: { title: "大小比较", hint: "拖动、滚动或使用滑块：从中子星到整个可观测宇宙。", diam: "直径", ratio: "≈ {x} 的 {n} 倍", ly: "光年", note: "真实直径，已取整。巨星、黑洞和遥远星系的数值不确定（约）。黑洞：事件视界。", approx: "约", kinds: K("中子星", "黑洞", "矮行星", "卫星", "行星", "恒星", "太阳系", "星云", "星系", "超星系团", "宇宙"), zoom: "旅程", compare: "比较", vol: "体积 ≈ {n} 倍——可容纳这么多个{x}", tiny: "{x}在这里小于 1 像素" },
  ja: { title: "大きさ比較", hint: "ドラッグ、スクロール、またはスライダーで：中性子星から観測可能な宇宙全体まで。", diam: "直径", ratio: "≈ {x}の{n}倍", ly: "光年", note: "実際の直径（概数）。巨星、ブラックホール、遠方銀河の値は不確かです（約）。ブラックホール：事象の地平面。", approx: "約", kinds: K("中性子星", "ブラックホール", "準惑星", "衛星", "惑星", "恒星", "太陽系", "星雲", "銀河", "超銀河団", "宇宙"), zoom: "旅", compare: "比較", vol: "体積 ≈ {n}倍 — {x}がこれだけ入ります", tiny: "{x}はここでは1ピクセル未満です" },
  ko: { title: "크기 비교", hint: "드래그, 스크롤 또는 슬라이더로: 중성자별부터 관측 가능한 우주 전체까지.", diam: "지름", ratio: "≈ {x}의 {n}배", ly: "광년", note: "실제 지름(반올림). 거성, 블랙홀, 먼 은하의 값은 불확실합니다(약). 블랙홀: 사건의 지평선.", approx: "약", kinds: K("중성자별", "블랙홀", "왜행성", "위성", "행성", "항성", "태양계", "성운", "은하", "초은하단", "우주"), zoom: "여행", compare: "비교", vol: "부피 ≈ {n}배 – {x}이(가) 이만큼 들어갑니다", tiny: "{x}은(는) 여기서 1픽셀보다 작습니다" },
};

const LY_KM = 9.461e12;
const IMG_BASE = "https://upload.wikimedia.org/wikipedia/commons/";
const SPHERE = (k: Kind) => k === "planet" || k === "moon" || k === "dwarf" || k === "star" || k === "ns" || k === "bh";

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

function fmtFull(n: number, lang: Lang): string {
  try {
    const opt: Intl.NumberFormatOptions = n < 10 ? { maximumSignificantDigits: 3 } : n < 1e6 ? { maximumFractionDigits: 0 } : { maximumSignificantDigits: 5 };
    return new Intl.NumberFormat(lang, opt).format(n);
  } catch {
    return String(Math.round(n));
  }
}

function fmtLong(n: number, lang: Lang): string {
  try {
    return new Intl.NumberFormat(lang, { notation: "compact", compactDisplay: "long", maximumFractionDigits: 1 }).format(n);
  } catch {
    return fmt(n, lang);
  }
}

/** Genaue Größe: km (bzw. Lichtjahre) plus Vergleich mit Erde oder Sonne. */
function sizeLines(o: Obj, lang: Lang, ui: UiText): [string, string] {
  const pre = o.approx ? ui.approx + " " : "";
  if (o.d < 1e12) {
    const useEarth = o.id === "sun" || (o.d < 1e6 && o.id !== "earth");
    const ref = findBody(useEarth ? "earth" : "sun");
    const refD = useEarth ? 12742 : 1392700;
    const refName = ref ? ref.name[lang] ?? ref.name.en ?? ref.name.de : "";
    return [pre + fmtFull(o.d, lang) + " km", "≈ " + fmtFull(o.d / refD, lang) + " × " + refName];
  }
  return [pre + fmtFull(o.d / LY_KM, lang) + " " + ui.ly, "≈ " + fmtLong(o.d, lang) + " km"];
}

/* ---------- Bilder: echte Oberflächenkarten und Fotos ---------- */

function hexToRgb(h: string): [number, number, number] {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const rgba = (h: string, a: number) => {
  const [r, g, b] = hexToRgb(h);
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
};

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = IMG_BASE + src;
  });
}

/** Kugel aus einer Oberflächenkarte (orthografisch, Licht von links oben). */
function sphereSprite(img: CanvasImageSource, o: Obj): HTMLCanvasElement {
  const S = 360, tw = 1024, th = 512;
  const tc = document.createElement("canvas");
  tc.width = tw; tc.height = th;
  const tg = tc.getContext("2d")!;
  tg.drawImage(img, 0, 0, tw, th);
  const tex = tg.getImageData(0, 0, tw, th).data;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  const out = g.createImageData(S, S), d = out.data;
  const tilt = 0.22, ct = Math.cos(tilt), st = Math.sin(tilt);
  const L = [-0.55, 0.45, 0.7], ll = Math.hypot(L[0], L[1], L[2]);
  const pluto = o.id === "pluto";
  for (let y = 0; y < S; y++) {
    const ny = 1 - ((y + 0.5) / S) * 2;
    for (let x = 0; x < S; x++) {
      const nx = ((x + 0.5) / S) * 2 - 1, r2 = nx * nx + ny * ny, i = (y * S + x) * 4;
      if (r2 > 1) continue;
      const z = Math.sqrt(1 - r2);
      const lat = Math.asin(Math.max(-1, Math.min(1, ny * ct + z * st)));
      const lon = Math.atan2(nx, z * ct - ny * st);
      const u = Math.floor(((lon / (2 * Math.PI) + 0.5) % 1) * tw) % tw, v = Math.min(th - 1, Math.floor((0.5 - lat / Math.PI) * th));
      const k = (v * tw + u) * 4;
      let R = tex[k], G = tex[k + 1], Bc = tex[k + 2];
      if (pluto && R + G + Bc < 60) { R = 176; G = 156; Bc = 132; }
      const lam = Math.max(0, (nx * L[0] + ny * L[1] + z * L[2]) / ll);
      const sh = 0.12 + 0.88 * Math.pow(lam, 0.8);
      d[i] = R * sh; d[i + 1] = G * sh; d[i + 2] = Bc * sh;
      d[i + 3] = r2 > 0.985 ? 255 * (1 - (r2 - 0.985) / 0.015) : 255;
    }
  }
  g.putImageData(out, 0, 0);
  return c;
}

/** Foto (Galaxie, Nebel, Universum): Hintergrund wird durchsichtig, Ränder weich; optional Ausschnitt mit Ellipsenmaske. */
function photoSprite(img: HTMLImageElement, crop?: number[]): HTMLCanvasElement {
  const S = 640, c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  if (crop) {
    const sw = crop[2] * 2 * img.naturalWidth;
    g.drawImage(img, crop[0] * img.naturalWidth - sw / 2, crop[1] * img.naturalHeight - sw / 2, sw, sw, 0, 0, S, S);
  } else {
    const sc = S / img.naturalWidth, h = img.naturalHeight * sc;
    g.drawImage(img, 0, (S - h) / 2, S, h);
  }
  const data = g.getImageData(0, 0, S, S), d = data.data;
  const ca = crop ? Math.cos(crop[3]) : 1, sa = crop ? Math.sin(crop[3]) : 0;
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const i = (y * S + x) * 4;
      const m = Math.max(d[i], d[i + 1], d[i + 2]);
      let edge: number, al: number;
      if (crop) {
        const px = (x / S - 0.5), py = (y / S - 0.5);
        const u = px * ca + py * sa, w = -px * sa + py * ca;
        const e = Math.hypot(u / 0.46, w / (0.46 * crop[4]));
        edge = e < 0.78 ? 1 : Math.max(0, 1 - (e - 0.78) / 0.22);
        al = Math.max(0, Math.min(255, (m - 26) * 2.1));
      } else {
        const rr = Math.hypot(x - S / 2, y - S / 2) / (S / 2);
        edge = rr < 0.82 ? 1 : Math.max(0, 1 - (rr - 0.82) / 0.18);
        al = Math.min(255, m * 1.6);
      }
      d[i + 3] = al * edge;
    }
  }
  g.putImageData(data, 0, 0);
  return c;
}

const sprites = new Map<string, HTMLCanvasElement>();
const PROC = new Set(["mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "ceres"]);

/** Saturnringe aus dem Ringprofil der 3D-Ansicht (C-Ring, B-Ring, Cassini-Teilung, A-Ring). */
let ringSprite: HTMLCanvasElement | null = null;
function getRing(): HTMLCanvasElement | null {
  if (ringSprite) return ringSprite;
  try {
    const prof = cachedCanvas("saturn-ring", saturnRingCanvas);
    const pd = prof.getContext("2d")!.getImageData(0, 0, prof.width, 1).data;
    const S0 = 160, OUT = 2.27, IN = 1.24, N = Math.ceil(2 * OUT * S0);
    const c = document.createElement("canvas");
    c.width = c.height = N;
    const g = c.getContext("2d")!;
    const img = g.createImageData(N, N), d = img.data;
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const R = Math.hypot(x + 0.5 - N / 2, y + 0.5 - N / 2) / S0;
        if (R < IN || R > OUT) continue;
        const u = Math.min(prof.width - 1, Math.floor(((R - IN) / (OUT - IN)) * prof.width)) * 4, i = (y * N + x) * 4;
        d[i] = pd[u]; d[i + 1] = pd[u + 1]; d[i + 2] = pd[u + 2]; d[i + 3] = pd[u + 3];
      }
    }
    g.putImageData(img, 0, 0);
    ringSprite = c;
  } catch {
    ringSprite = null;
  }
  return ringSprite;
}
const pending = new Set<string>();
const rots = new Map<string, Rot>();

/** Drehende Kugel anlegen (Planeten/Monde aus Karte, Sterne aus selbst berechneter Oberfläche). */
function ensureRot(o: Obj, texSrc?: CanvasImageSource) {
  if (rots.has(o.id)) return;
  try {
    if (o.kind === "star") {
      const sp = o.id === "sun" ? ROT_SPEED.sun : 0.03 + (o.id.length % 4) * 0.008;
      rots.set(o.id, buildRot(makeStarTex(o.id === "sun" ? "#ffd27a" : o.color, starLook(o.id), o.id.length * 31 + 7), { star: true, limb: starLook(o.id).limb, speed: sp }));
    } else if (texSrc) {
      const clouds = o.id === "earth" ? texFromCanvas(cachedCanvas("earth-clouds", earthCloudsCanvas)) : undefined;
      rots.set(o.id, buildRot(texFromCanvas(texSrc), { speed: ROT_SPEED[o.id] ?? 0.05, atmo: ATMO[o.id], clouds, pluto: o.id === "pluto" }));
    }
  } catch {
    /* ohne Drehung weiter */
  }
}

// Körper, deren echte Karte nur eine Falschfarben-Höhenkarte ist: hier gilt
// immer die realistische eigene Oberfläche (Ceres, Nutzerkorrektur 15.10.2026).
const PROC_ONLY = new Set(["ceres"]);

function requestSprite(o: Obj, onReady: () => void) {
  if (o.kind === "star") { ensureRot(o); return; }
  if (sprites.has(o.id) || pending.has(o.id)) return;
  if (PROC_ONLY.has(o.id)) {
    try {
      const sc = cachedCanvas("surface-" + o.id, () => surfaceCanvas(o.id, o.color));
      sprites.set(o.id, sphereSprite(sc, o));
      ensureRot(o, sc);
      onReady();
    } catch {
      /* ohne Vorschau weiter */
    }
    return;
  }
  let job: Promise<HTMLCanvasElement> | null = null;
  if (o.tex) job = loadImg(o.tex).then((im) => { rots.delete(o.id); ensureRot(o, im); return sphereSprite(im, o); });
  else if (o.photo) job = loadImg(o.photo[0]).then((im) => photoSprite(im, o.photo ? o.photo[2] : undefined));
  if (!job) return;
  // Sofort: dieselben Oberflächen wie in der 3D-Ansicht des Sonnensystems;
  // sobald die echte Karte geladen ist, wird sie ersetzt.
  if (o.tex && PROC.has(o.id)) {
    try {
      const sc = cachedCanvas("surface-" + o.id, () => surfaceCanvas(o.id, o.color));
      sprites.set(o.id, sphereSprite(sc, o));
      ensureRot(o, sc);
    } catch {
      /* ohne Vorschau weiter */
    }
  }
  pending.add(o.id);
  job.then((c) => { sprites.set(o.id, c); onReady(); }).catch(() => undefined);
}

/* ---------- Zeichnen ---------- */

function drawRing(g: CanvasRenderingContext2D, x: number, y: number, r: number, c: string, front: boolean) {
  const R = r * 2.27, sq = 0.3;
  const ring = getRing();
  g.save();
  g.beginPath();
  if (front) g.rect(x - R - 2, y, R * 2 + 4, R * sq + 2); else g.rect(x - R - 2, y - R * sq - 2, R * 2 + 4, R * sq + 2);
  g.clip();
  if (ring) {
    g.drawImage(ring, x - R, y - R * sq, R * 2, R * 2 * sq);
  } else {
    g.translate(x, y);
    g.scale(1, sq);
    g.strokeStyle = rgba(c, 0.6);
    g.lineWidth = r * 0.8;
    g.beginPath(); g.arc(0, 0, r * 1.75, 0, Math.PI * 2); g.stroke();
  }
  g.restore();
}

function drawObj(g: CanvasRenderingContext2D, o: Obj, x: number, y: number, r: number, W: number, H: number) {
  // Riesige Objekte, die den ganzen Bildschirm füllen: nur den sichtbaren Rand als Fläche zeichnen.
  if (r > 3e4) {
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
  const sp = sprites.get(o.id);
  if (o.kind === "bh") { drawBH(g, x, y, r); return; }
  if (o.kind === "ns") { drawPulsar(g, x, y, r); return; }
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
  if (sp && o.photo) {
    const f = o.photo[1];
    g.drawImage(sp, x - r * f, y - r * f, r * f * 2, r * f * 2);
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
      const rnd = seeded(o.id.length * 977 + (o.d % 97));
      const n = o.kind === "cluster" ? 900 : o.kind === "galaxy" ? 160 : 220;
      for (let i = 0; i < n; i++) {
        let px: number, py: number;
        if (o.kind === "cluster") {
          // Galaxien liegen in Filamenten (kosmisches Netz)
          const a = Math.floor(rnd() * 7) * 0.9 + rnd() * 0.25, rr = Math.sqrt(rnd()) * r * 0.95;
          px = Math.cos(a) * rr + (rnd() - 0.5) * r * 0.08;
          py = Math.sin(a) * rr + (rnd() - 0.5) * r * 0.08;
        } else if (o.kind === "galaxy") {
          const arm = i % 2, t = rnd() * 3.2;
          const a = t * 1.7 + arm * Math.PI, rr = (0.12 + t / 3.6) * r;
          px = Math.cos(a) * rr + (rnd() - 0.5) * r * 0.12;
          py = Math.sin(a) * rr + (rnd() - 0.5) * r * 0.12;
        } else {
          const a = rnd() * Math.PI * 2, rr = Math.sqrt(rnd()) * r * 0.95;
          px = Math.cos(a) * rr; py = Math.sin(a) * rr;
        }
        g.fillStyle = "rgba(220,230,255," + (0.25 + rnd() * 0.55) + ")";
        g.fillRect(px, py, 1.2, 1.2);
      }
    }
    g.restore();
    return;
  }
  if (o.kind === "star") drawStarGlow(g, x, y, r, c, o.id);
  if (o.ring) drawRing(g, x, y, r, c, false);
  const rot = rots.get(o.id);
  if (rot) {
    g.drawImage(renderRot(rot, ANIM.reduce ? 0.6 : ANIM.t * rot.speed, pickSize(r * 2 * ANIM.D)), x - r, y - r, r * 2, r * 2);
  } else if (sp) {
    g.drawImage(sp, x - r, y - r, r * 2, r * 2);
  } else {
    const body = g.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.05, x, y, r);
    body.addColorStop(0, o.kind === "star" ? "#fffaf0" : "#ffffff");
    body.addColorStop(0.2, c);
    body.addColorStop(1, o.kind === "star" ? rgba(c, 0.9) : "#0b0b0b");
    g.fillStyle = body;
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  }
  if (o.ring) drawRing(g, x, y, r, c, true);
}

type Mode = "zoom" | "cmp";

interface CmpView {
  anchor: 0 | 1;
  xa: number; // Bildschirmposition (px) der Mitte des Ankerobjekts
  yc: number; // Bildschirmhöhe (px) der Objektmitten
  z: number; // Zoom relativ zur Gesamtansicht
}

const normS = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function SizeComparison({ index }: { index: string }) {
  const { lang } = useLanguage();
  const ui = UI[lang] ?? UI.en;
  const ui2 = UI2[lang] ?? UI2.en;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const START = OBJECTS.findIndex((o) => o.id === "earth");
  const target = useRef(START);
  const cur = useRef(START);
  const [shown, setShown] = useState(START);
  const [slider, setSlider] = useState(START);
  const [mode, setMode] = useState<Mode>("zoom");
  const [cmpA, setCmpA] = useState(OBJECTS.findIndex((o) => o.id === "sun"));
  const [cmpB, setCmpB] = useState(OBJECTS.findIndex((o) => o.id === "st218"));
  const [pick, setPick] = useState<0 | 1 | null>(null);
  const [zs, setZs] = useState(0);
  const [zx, setZx] = useState(1);
  const langRef = useRef(lang);
  const modeRef = useRef<Mode>("zoom");
  const cmpRef = useRef<[number, number]>([cmpA, cmpB]);
  const dirty = useRef(true);
  const view = useRef<CmpView>({ anchor: 0, xa: 0, yc: 0, z: 1 });
  const fit = useRef({ zmax: 12, kfit: 1, delta: 0, W: 0, H: 0, sx: -1, sy: 0 });
  const resetView = useRef(true);
  const api = useRef({ zoomBy: (_f: number) => {}, setZ: (_s: number) => {}, reset: () => {} });
  // Direktlink aus dem Sternenhimmel (#groessenvergleich): zur Sektion scrollen,
  // sobald die Seite aufgebaut ist.
  useEffect(() => {
    if (typeof window === "undefined" || window.location.hash !== "#groessenvergleich") return;
    const go = () => document.getElementById("groessenvergleich")?.scrollIntoView({ behavior: "smooth", block: "start" });
    const t1 = window.setTimeout(go, 700);
    const t2 = window.setTimeout(go, 1800);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    langRef.current = lang;
    modeRef.current = mode;
    cmpRef.current = [cmpA, cmpB];
    resetView.current = true;
    dirty.current = true;
  }, [lang, mode, cmpA, cmpB]);

  useEffect(() => {
    const cvs = canvasRef.current, wrap = wrapRef.current;
    if (!cvs || !wrap) return;
    const g = cvs.getContext("2d");
    if (!g) return;
    let raf = 0, W = 0, H = 0, D = 1, lastShown = -1, visible = true, lastDraw = 0, lastZs = -1;
    ANIM.reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    dirty.current = true;
    const last = OBJECTS.length - 1;
    const ready = () => { dirty.current = true; };

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      D = Math.min(2, window.devicePixelRatio || 1);
      W = r.width; H = r.height;
      cvs.width = Math.round(W * D); cvs.height = Math.round(H * D);
      fit.current.W = W; fit.current.H = H;
      resetView.current = true;
      dirty.current = true;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    const io = new IntersectionObserver((e) => { visible = e[0]?.isIntersecting ?? true; });
    io.observe(wrap);

    const label = (text: string, x: number, y: number, main: boolean, taken: [number, number, number][]) => {
      g.font = (main ? 600 : 400) + " 11px ui-monospace, monospace";
      const w = g.measureText(text).width, a = x - w / 2 - 4, b = x + w / 2 + 4;
      if (taken.some(([ta, tb, ty]) => a < tb && b > ta && Math.abs(ty - y) < 14)) return;
      taken.push([a, b, y]);
      g.fillStyle = main ? "#f2f2f0" : "rgba(242,242,240,0.6)";
      g.fillText(text, x, y);
    };

    const scaleText = (km: number) => {
      const l = langRef.current, u = UI[l] ?? UI.en;
      return km < 1e12 ? fmtFull(km, l) + " km" : fmtFull(km / LY_KM, l) + " " + u.ly;
    };

    const drawCompare = () => {
      const [ia, ib] = cmpRef.current;
      const A = OBJECTS[ia], B = OBJECTS[ib], lng = langRef.current;
      const dA = A.d, dB = B.d, gap = 0.08 * (dA + dB), Wd = dA + gap + dB;
      const big = Math.max(dA, dB), small = Math.min(dA, dB);
      const kfit = Math.min((H * 0.78) / big, (W * 0.9) / Wd);
      const cA = dA / 2, cB = dA + gap + dB / 2, delta = cB - cA;
      const v = view.current;
      const zmax = Math.max(12, Math.min(1e24, (W * 4) / (small * kfit)));
      fit.current.zmax = zmax; fit.current.kfit = kfit; fit.current.delta = delta;
      if (resetView.current) { v.z = 1; v.anchor = 0; resetView.current = false; }
      if (v.z <= 1.0000001) { v.z = 1; v.anchor = 0; v.xa = W / 2 + (cA - Wd / 2) * kfit; v.yc = H * 0.47; }
      v.z = Math.min(v.z, zmax);
      const k = kfit * v.z;
      const xA = v.anchor === 0 ? v.xa : v.xa - delta * k;
      const xB = v.anchor === 0 ? v.xa + delta * k : v.xa;
      // Anker = das Objekt, das der Bildmitte näher ist (hält die Rechnung auch bei extremem Zoom genau)
      const near: 0 | 1 = Math.abs(xA - W / 2) <= Math.abs(xB - W / 2) ? 0 : 1;
      if (near !== v.anchor) { v.anchor = near; v.xa = near === 0 ? xA : xB; }
      const cy = v.yc, ra = (dA * k) / 2, rb = (dB * k) / 2;
      fit.current.sx = dA <= dB ? xA : xB; fit.current.sy = cy;
      requestSprite(A, ready); requestSprite(B, ready);
      const taken: [number, number, number][] = [];
      g.textAlign = "center";
      g.textBaseline = "top";
      ([[A, xA, ra], [B, xB, rb]] as [Obj, number, number][]).forEach(([o, x, r]) => {
        const ext = r * (o.ring ? 2.3 : o.photo ? o.photo[1] : 1) + 80;
        if (x + ext < 0 || x - ext > W) return;
        if (r >= 0.5) drawObj(g, o, x, cy, r, W, H);
        else {
          // Zu klein für den Bildschirm: Markierung statt Punkt
          g.strokeStyle = "#ff5a4d";
          g.lineWidth = 1.2;
          g.beginPath(); g.arc(x, cy, 6, 0, Math.PI * 2); g.stroke();
          g.fillStyle = "#ff5a4d";
          g.fillRect(x - 0.5, cy - 0.5, 1, 1);
        }
        const lx = Math.max(60, Math.min(W - 60, x));
        label(objName(o, lng), lx, Math.max(8, Math.min(H - 50, cy + Math.max(r, 8) + 8)), true, taken);
      });
      // Maßstab (echte Länge)
      const want = (W * 0.26) / k, p10 = Math.pow(10, Math.floor(Math.log10(want))), m = want / p10;
      const nice = (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p10, px = nice * k, by = H - 12;
      g.strokeStyle = "rgba(242,242,240,0.85)";
      g.lineWidth = 1.5;
      g.beginPath();
      g.moveTo(12, by - 4); g.lineTo(12, by); g.lineTo(12 + px, by); g.lineTo(12 + px, by - 4);
      g.stroke();
      g.font = "400 10px ui-monospace, monospace";
      g.textAlign = "left";
      g.textBaseline = "bottom";
      g.fillStyle = "rgba(242,242,240,0.9)";
      g.fillText(scaleText(nice), 12, by - 6);
      g.textAlign = "center";
      g.textBaseline = "top";
      const zn = Math.log(v.z) / Math.log(zmax);
      if (Math.abs(zn - lastZs) > 0.002) { lastZs = zn; setZs(zn); setZx(v.z); }
    };

    const zoomAt = (px: number, py: number, f: number) => {
      const v = view.current, fi = fit.current;
      const nz = Math.max(1, Math.min(fi.zmax, v.z * f));
      if (nz === v.z) return;
      const k = fi.kfit * v.z;
      const xA = v.anchor === 0 ? v.xa : v.xa - fi.delta * k;
      const xB = v.anchor === 0 ? v.xa + fi.delta * k : v.xa;
      const near: 0 | 1 = Math.abs(xA - px) <= Math.abs(xB - px) ? 0 : 1;
      if (near !== v.anchor) { v.anchor = near; v.xa = near === 0 ? xA : xB; }
      const ratio = nz / v.z;
      v.xa = px + (v.xa - px) * ratio;
      v.yc = py + (v.yc - py) * ratio;
      v.z = nz;
      dirty.current = true;
    };
    api.current = {
      // Regler/Tasten zoomen auf das kleinere Objekt (wenn sichtbar), sonst auf die Bildmitte
      zoomBy: (f) => { const fi = fit.current, onS = fi.sx > 0 && fi.sx < W; zoomAt(onS ? fi.sx : W / 2, onS ? fi.sy : H / 2, f); },
      setZ: (s) => { const fi = fit.current, onS = fi.sx > 0 && fi.sx < W; zoomAt(onS ? fi.sx : W / 2, onS ? fi.sy : H / 2, Math.exp(s * Math.log(fi.zmax)) / view.current.z); },
      reset: () => { resetView.current = true; view.current.z = 1; dirty.current = true; },
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || W === 0) return;
      const diff = target.current - cur.current;
      const moving = modeRef.current === "zoom" && Math.abs(diff) >= 0.0005;
      if (!moving && !dirty.current && (ANIM.reduce || now - lastDraw < 30)) return;
      lastDraw = now;
      dirty.current = false;
      ANIM.t = now / 1000;
      ANIM.D = D;
      g.setTransform(D, 0, 0, D, 0, 0);
      g.clearRect(0, 0, W, H);
      if (modeRef.current === "cmp") { drawCompare(); return; }
      cur.current += Math.abs(diff) < 0.0005 ? diff : diff * 0.14;
      const t = Math.max(0, Math.min(last, cur.current));
      const i0 = Math.floor(t), i1 = Math.min(last, i0 + 1), f = t - i0;
      const focusD = Math.exp(Math.log(OBJECTS[i0].d) * (1 - f) + Math.log(OBJECTS[i1].d) * f);
      const k = Math.min(W * 0.42, H * 0.56) / focusD; // Pixel pro km
      const gap = W * 0.08;
      const rs = OBJECTS.map((o) => (o.d * k) / 2);
      const xs: number[] = [];
      const lr = rs.map((r, i) => r * (OBJECTS[i].ring || OBJECTS[i].kind === "bh" ? 2.3 : 1)); // Ringe/Scheiben brauchen Platz
      lr.forEach((r, i) => { xs.push(i === 0 ? 0 : xs[i - 1] + lr[i - 1] + gap + r); });
      const fx = xs[i0] * (1 - f) + xs[i1] * f;
      const off = W / 2 - fx, cy = H * 0.46;
      const lng = langRef.current;
      const focus = Math.round(t);
      const labels: { x: number; y: number; text: string; main: boolean }[] = [];
      for (let i = 0; i <= last; i++) {
        const o = OBJECTS[i], r = rs[i], x = xs[i] + off;
        const ext = r * (o.ring || o.kind === "bh" ? 2.3 : o.photo ? o.photo[1] : 1) + 90;
        if (r < 0.4 || x + ext < 0 || x - ext > W) continue;
        if (r > 1.5) requestSprite(o, ready);
        drawObj(g, o, x, cy, Math.max(r, 0.8), W, H);
        if (r >= 2.5 && r < H * 0.42) {
          const name = objName(o, lng);
          labels.push({ x, y: cy + Math.max(r, 6) * (o.kind === "galaxy" && !o.photo ? 0.55 : 1) + 8, text: name.length > 26 ? name.slice(0, 25) + "…" : name, main: i === focus });
        }
      }
      // Beschriftungen ohne Überlappung; das Objekt im Fokus hat Vorrang.
      labels.sort((a, b) => Number(b.main) - Number(a.main));
      const taken: [number, number, number][] = [];
      g.textAlign = "center";
      g.textBaseline = "top";
      for (const l of labels) label(l.text, l.x, l.y, l.main, taken);
      const s = Math.round(t);
      if (s !== lastShown) { lastShown = s; setShown(s); }
    };
    raf = requestAnimationFrame(frame);

    let drag: { x: number; t: number } | null = null;
    const ptrs = new Map<number, { x: number; y: number }>();
    let pinch = 0;
    const lp = (e: { clientX: number; clientY: number }) => {
      const r = cvs.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const down = (e: PointerEvent) => {
      if (modeRef.current === "zoom") {
        drag = { x: e.clientX, t: target.current };
        cvs.setPointerCapture(e.pointerId);
        return;
      }
      ptrs.set(e.pointerId, lp(e));
      cvs.setPointerCapture(e.pointerId);
      if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = Math.hypot(a.x - b.x, a.y - b.y); }
    };
    const move = (e: PointerEvent) => {
      if (modeRef.current === "zoom") {
        if (!drag) return;
        const v = Math.max(0, Math.min(last, drag.t - (e.clientX - drag.x) / (W * 0.35)));
        target.current = v; setSlider(v);
        return;
      }
      const p = ptrs.get(e.pointerId);
      if (!p) return;
      const n = lp(e);
      if (ptrs.size === 1 && view.current.z > 1) { view.current.xa += n.x - p.x; view.current.yc += n.y - p.y; }
      ptrs.set(e.pointerId, n);
      if (ptrs.size === 2) {
        const [a, b] = [...ptrs.values()], dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinch > 0) zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, dist / pinch);
        pinch = dist;
      }
      dirty.current = true;
    };
    const up = (e: PointerEvent) => { drag = null; ptrs.delete(e.pointerId); pinch = 0; };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      if (modeRef.current === "zoom") {
        const v = Math.max(0, Math.min(last, target.current + e.deltaY * 0.0025));
        target.current = v; setSlider(v);
        return;
      }
      const p = lp(e);
      zoomAt(p.x, p.y, Math.exp(-e.deltaY * 0.0016));
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

  const pickItems = useMemo<PickItem[]>(
    () => OBJECTS.map((x, i) => ({
      i,
      label: objName(x, lang),
      sub: ui.kinds[x.kind],
      hay: normS(objName(x, lang) + " " + objName(x, "en") + " " + objName(x, "de") + " " + x.id + " " + ui.kinds[x.kind]),
    })),
    [lang, ui],
  );

  const o = OBJECTS[shown];
  const prev = shown > 0 ? OBJECTS[shown - 1] : null;
  const ratioText = prev ? ui.ratio.replace("{n}", fmt(o.d / prev.d, lang)).replace("{x}", objName(prev, lang)) : "";
  const [l1, l2] = sizeLines(o, lang, ui);

  const A = OBJECTS[cmpA], B = OBJECTS[cmpB];
  const big = A.d >= B.d ? A : B, small = A.d >= B.d ? B : A;
  const cmpRatio = big.d / small.d;
  const cmpText = objName(big, lang) + ": " + ui.ratio.replace("{n}", fmt(cmpRatio, lang)).replace("{x}", objName(small, lang));
  const volText = SPHERE(big.kind) && SPHERE(small.kind) && cmpRatio > 1.05 ? ui.vol.replace("{n}", cmpRatio ** 3 < 1e6 ? fmtFull(cmpRatio ** 3, lang) : fmtLong(cmpRatio ** 3, lang)).replace("{x}", objName(small, lang)) : "";
  const tinyText = mode === "cmp" && cmpRatio > 600 && zx < 3 ? ui.tiny.replace("{x}", objName(small, lang)) : "";

  const tab = (m: Mode, label: string) => (
    <button
      type="button"
      onClick={() => setMode(m)}
      aria-pressed={mode === m}
      className={"label-mono border px-3 py-1.5 text-[10px] uppercase tracking-wide transition-colors " + (mode === m ? "border-accent text-accent" : "border-border text-muted hover:text-foreground")}
    >
      {label}
    </button>
  );
  const pickBtn = (n: 0 | 1, val: number) => (
    <button
      type="button"
      onClick={() => setPick(pick === n ? null : n)}
      aria-expanded={pick === n}
      className={"flex w-0 min-w-0 flex-1 items-center justify-between gap-1 border bg-background px-2 py-1.5 text-left text-xs text-foreground " + (pick === n ? "border-accent" : "border-border")}
    >
      <span className="truncate">{objName(OBJECTS[val], lang)}</span>
      <span aria-hidden="true" className="text-muted">⌕</span>
    </button>
  );
  const sbtn = "h-8 w-8 shrink-0 border border-border text-foreground transition-colors hover:border-accent hover:text-accent";

  return (
    <section id="groessenvergleich" className="mb-10 scroll-mt-4">
      <SectionHeading index={index} label={ui.title} />
    <div className="hud-card overflow-hidden p-3 sm:p-4">
      <div className="mb-2 flex gap-2">
        {tab("zoom", ui.zoom)}
        {tab("cmp", ui.compare)}
      </div>
      <div ref={wrapRef} className={"relative h-64 w-full select-none sm:h-80 " + (mode === "cmp" ? "touch-none" : "touch-pan-y")}>
        <canvas ref={canvasRef} className={"absolute inset-0 h-full w-full " + (mode === "zoom" ? "cursor-grab active:cursor-grabbing" : "cursor-move")} />
      </div>
      {mode === "zoom" ? (
        <>
          <div className="mt-2 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="label-mono text-[10px] uppercase text-accent">{ui.kinds[o.kind]}</p>
              <p className="font-display text-base font-bold uppercase tracking-wide text-foreground sm:text-lg">{objName(o, lang)}</p>
              <p className="text-xs text-muted">
                {ui.diam}: <span className="text-foreground">{l1}</span>
              </p>
              <p className="text-[11px] text-muted">{l2}</p>
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
        </>
      ) : (
        <div className="mt-2">
          <div className="flex items-center gap-2">
            {pickBtn(0, cmpA)}
            <span className="text-xs text-muted">vs</span>
            {pickBtn(1, cmpB)}
          </div>
          {pick !== null && (
            <SizePicker
              items={pickItems}
              current={pick === 0 ? cmpA : cmpB}
              placeholder={ui2.search}
              none={ui2.none}
              onClose={() => setPick(null)}
              onPick={(i) => { if (pick === 0) setCmpA(i); else setCmpB(i); setPick(null); }}
            />
          )}
          <div className="mt-2 flex items-center gap-2">
            <span className="label-mono shrink-0 text-[10px] uppercase text-muted">{ui2.zoomL} ×{fmt(zx, lang)}</span>
            <button type="button" className={sbtn} aria-label="−" onClick={() => api.current.zoomBy(1 / 1.8)}>−</button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={zs}
              onChange={(e) => { const s = parseFloat(e.target.value); setZs(s); api.current.setZ(s); }}
              className="w-0 min-w-0 flex-1 accent-[#ff5a4d]"
              aria-label={ui2.zoomL}
            />
            <button type="button" className={sbtn} aria-label="+" onClick={() => api.current.zoomBy(1.8)}>+</button>
            <button type="button" className="h-8 shrink-0 border border-border px-2 text-[10px] uppercase text-foreground transition-colors hover:border-accent hover:text-accent" onClick={() => api.current.reset()}>{ui2.reset}</button>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
            {[A, B].map((x, i) => {
              const [a1, a2] = sizeLines(x, lang, ui);
              return (
                <div key={i} className="min-w-0">
                  <p className="label-mono text-[10px] uppercase text-accent">{ui.kinds[x.kind]}</p>
                  <p className="truncate font-display text-sm font-bold uppercase text-foreground">{objName(x, lang)}</p>
                  <p className="text-muted">{ui.diam}: <span className="text-foreground">{a1}</span></p>
                  <p className="text-muted">{a2}</p>
                </div>
              );
            })}
          </div>
          {cmpRatio > 1.0001 && <p className="mt-2 text-xs text-foreground">{cmpText}</p>}
          {volText && <p className="mt-0.5 text-[11px] text-muted">{volText}</p>}
          {tinyText && <p className="mt-0.5 text-[11px] text-accent">{tinyText}</p>}
          <p className="mt-1 text-[10px] leading-snug text-muted">{ui2.zoomHint}</p>
        </div>
      )}
      <p className="mt-1 text-[10px] leading-snug text-muted/70">{ui.note}</p>
    </div>
    </section>
  );
}
