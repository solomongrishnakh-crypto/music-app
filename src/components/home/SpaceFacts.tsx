"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import { useLanguage, type Lang } from "@/contexts/LanguageContext";

/** Weltraum-Fakten (Nutzerwunsch 15.10.2026: mehr Weltraum auf der Seite). */
type L13 = Record<Lang, string>;
interface Fact { icon: string; value: string; text: L13 }

const HEAD: L13 = {
  de: "Weltraum in Zahlen", en: "Space in numbers", es: "El espacio en cifras", fr: "L'espace en chiffres",
  pt: "O espaço em números", tr: "Rakamlarla uzay", ru: "Космос в цифрах", el: "Το διάστημα σε αριθμούς",
  ar: "الفضاء بالأرقام", hi: "अंतरिक्ष आँकड़ों में", zh: "数字里的太空", ja: "数字で見る宇宙", ko: "숫자로 보는 우주",
};

const FACTS: Fact[] = [
  { icon: "☀", value: "8 min 20 s", text: {
    de: "So lange braucht das Sonnenlicht bis zur Erde.", en: "Sunlight takes this long to reach Earth.",
    es: "Tiempo que tarda la luz del Sol en llegar a la Tierra.", fr: "Temps que met la lumière du Soleil pour atteindre la Terre.",
    pt: "Tempo que a luz do Sol leva para chegar à Terra.", tr: "Güneş ışığının Dünya'ya ulaşma süresi.",
    ru: "Столько света Солнца идёт до Земли.", el: "Τόσο χρειάζεται το φως του Ήλιου να φτάσει στη Γη.",
    ar: "الزمن الذي يستغرقه ضوء الشمس ليصل إلى الأرض.", hi: "सूरज की रोशनी को पृथ्वी तक पहुँचने में इतना समय लगता है।",
    zh: "阳光到达地球所需的时间。", ja: "太陽の光が地球に届くまでの時間。", ko: "햇빛이 지구에 닿는 데 걸리는 시간." } },
  { icon: "🛰", value: "> 165 AU", text: {
    de: "Voyager 1 ist so weit von der Sonne entfernt – das am weitesten entfernte menschengemachte Objekt.",
    en: "Voyager 1's distance from the Sun – the most distant human-made object.",
    es: "Distancia de Voyager 1 al Sol: el objeto humano más lejano.", fr: "Distance de Voyager 1 au Soleil : l'objet humain le plus lointain.",
    pt: "Distância da Voyager 1 ao Sol: o objeto humano mais distante.", tr: "Voyager 1'in Güneş'e uzaklığı – insan yapımı en uzak nesne.",
    ru: "Расстояние «Вояджера-1» от Солнца – самый далёкий рукотворный объект.", el: "Απόσταση του Voyager 1 από τον Ήλιο – το πιο μακρινό ανθρώπινο αντικείμενο.",
    ar: "بُعد فوياجر 1 عن الشمس – أبعد جسم صنعه الإنسان.", hi: "सूर्य से वॉयेजर 1 की दूरी – मानव-निर्मित सबसे दूर की वस्तु।",
    zh: "旅行者1号与太阳的距离——人造物体中最远的。", ja: "ボイジャー1号と太陽の距離。人工物で最も遠い。", ko: "보이저 1호와 태양의 거리 – 인류가 만든 가장 먼 물체." } },
  { icon: "✦", value: "100–400 Mrd.", text: {
    de: "Geschätzte Zahl der Sterne in unserer Milchstraße.", en: "Estimated billions of stars in our Milky Way.",
    es: "Miles de millones de estrellas estimadas en nuestra Vía Láctea.", fr: "Milliards d'étoiles estimées dans notre Voie lactée.",
    pt: "Bilhões de estrelas estimadas na nossa Via Láctea.", tr: "Samanyolu'ndaki tahmini yıldız sayısı (milyar).",
    ru: "Оценка числа звёзд (млрд) в нашем Млечном Пути.", el: "Εκτιμώμενα δισεκατομμύρια αστέρια στον Γαλαξία μας.",
    ar: "العدد التقديري (بالمليار) للنجوم في مجرتنا.", hi: "हमारी आकाशगंगा में तारों की अनुमानित संख्या (अरब)।",
    zh: "银河系恒星数量的估计值（十亿）。", ja: "天の川銀河の恒星数の推定値（十億）。", ko: "우리 은하의 추정 별 개수(십억)." } },
  { icon: "♀", value: "243 d > 225 d", text: {
    de: "Auf der Venus dauert ein Tag länger als ein Jahr.", en: "On Venus, a day lasts longer than a year.",
    es: "En Venus, un día dura más que un año.", fr: "Sur Vénus, un jour dure plus longtemps qu'une année.",
    pt: "Em Vênus, um dia dura mais que um ano.", tr: "Venüs'te bir gün, bir yıldan uzundur.",
    ru: "На Венере сутки длиннее года.", el: "Στην Αφροδίτη η μέρα διαρκεί περισσότερο από τον χρόνο.",
    ar: "على الزهرة، اليوم أطول من السنة.", hi: "शुक्र पर एक दिन एक साल से लंबा होता है।",
    zh: "在金星上，一天比一年还长。", ja: "金星では1日が1年より長い。", ko: "금성에서는 하루가 1년보다 길다." } },
  { icon: "◉", value: "≈ 1 Mrd. t", text: {
    de: "Ein Teelöffel Neutronenstern-Materie wiegt ungefähr so viel.", en: "A teaspoon of neutron-star matter weighs about this much.",
    es: "Una cucharadita de materia de estrella de neutrones pesa aproximadamente esto.", fr: "Une cuillère à café de matière d'étoile à neutrons pèse environ autant.",
    pt: "Uma colher de chá de matéria de estrela de nêutrons pesa cerca disto.", tr: "Bir çay kaşığı nötron yıldızı maddesi yaklaşık bu kadar gelir.",
    ru: "Примерно столько весит чайная ложка вещества нейтронной звезды.", el: "Ένα κουταλάκι ύλης αστέρα νετρονίων ζυγίζει περίπου τόσο.",
    ar: "ملعقة صغيرة من مادة نجم نيوتروني تزن تقريباً هذا القدر.", hi: "न्यूट्रॉन तारे के पदार्थ का एक चम्मच लगभग इतना भारी होता है।",
    zh: "一茶匙中子星物质大约有这么重。", ja: "中性子星の物質ひとさじの重さはおよそこれくらい。", ko: "중성자별 물질 한 티스푼의 대략적인 무게." } },
  { icon: "☼", value: "99,86 %", text: {
    de: "Anteil der Sonne an der Gesamtmasse des Sonnensystems.", en: "The Sun's share of the Solar System's total mass.",
    es: "Parte de la masa total del Sistema Solar que tiene el Sol.", fr: "Part de la masse totale du Système solaire qui revient au Soleil.",
    pt: "Parcela da massa total do Sistema Solar que pertence ao Sol.", tr: "Güneş'in Güneş Sistemi toplam kütlesindeki payı.",
    ru: "Доля Солнца в полной массе Солнечной системы.", el: "Το μερίδιο του Ήλιου στη συνολική μάζα του Ηλιακού Συστήματος.",
    ar: "حصة الشمس من الكتلة الكلية للنظام الشمسي.", hi: "सौरमंडल के कुल द्रव्यमान में सूर्य का हिस्सा।",
    zh: "太阳占太阳系总质量的比例。", ja: "太陽系の全質量に占める太陽の割合。", ko: "태양계 전체 질량에서 태양이 차지하는 비율." } },
  { icon: "▲", value: "≈ 22 km", text: {
    de: "Höhe des Olympus Mons auf dem Mars – etwa 2,5-mal der Mount Everest.", en: "Height of Olympus Mons on Mars – about 2.5 times Mount Everest.",
    es: "Altura del Monte Olimpo en Marte: unas 2,5 veces el Everest.", fr: "Hauteur d'Olympus Mons sur Mars : environ 2,5 fois l'Everest.",
    pt: "Altura do Monte Olimpo em Marte: cerca de 2,5 vezes o Everest.", tr: "Mars'taki Olympus Mons'un yüksekliği – Everest'in yaklaşık 2,5 katı.",
    ru: "Высота горы Олимп на Марсе – примерно 2,5 Эвереста.", el: "Ύψος του Όλυμπου στον Άρη – περίπου 2,5 φορές το Έβερεστ.",
    ar: "ارتفاع أوليمبوس مونس على المريخ – نحو 2.5 ضعف إيفرست.", hi: "मंगल पर ओलिंपस मॉन्स की ऊँचाई – एवरेस्ट से लगभग 2.5 गुना।",
    zh: "火星奥林帕斯山的高度——约为珠穆朗玛峰的2.5倍。", ja: "火星のオリンポス山の高さ。エベレストの約2.5倍。", ko: "화성 올림푸스 산의 높이 – 에베레스트의 약 2.5배." } },
  { icon: "☽", value: "3,8 cm / a", text: {
    de: "So viel entfernt sich der Mond jedes Jahr von der Erde.", en: "How far the Moon drifts away from Earth every year.",
    es: "Lo que se aleja la Luna de la Tierra cada año.", fr: "Distance dont la Lune s'éloigne de la Terre chaque année.",
    pt: "Quanto a Lua se afasta da Terra a cada ano.", tr: "Ay'ın her yıl Dünya'dan uzaklaştığı mesafe.",
    ru: "На столько Луна удаляется от Земли каждый год.", el: "Όσο απομακρύνεται η Σελήνη από τη Γη κάθε χρόνο.",
    ar: "مقدار ابتعاد القمر عن الأرض كل عام.", hi: "चंद्रमा हर साल पृथ्वी से इतना दूर होता जाता है।",
    zh: "月球每年远离地球的距离。", ja: "月が毎年地球から遠ざかる距離。", ko: "달이 매년 지구에서 멀어지는 거리." } },
];

export default function SpaceFacts({ index }: { index: string }) {
  const { lang } = useLanguage();
  return (
    <section className="mb-10">
      <SectionHeading index={index} label={HEAD[lang] ?? HEAD.en} />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {FACTS.map((f) => (
          <div key={f.value} className="hud-card flex items-start gap-3 p-3">
            <span aria-hidden="true" className="mt-0.5 text-xl text-accent">{f.icon}</span>
            <div className="min-w-0">
              <div className="font-display text-lg leading-none text-foreground">{f.value}</div>
              <p className="mt-1.5 text-[11px] leading-snug text-muted">{f.text[lang] ?? f.text.en}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
