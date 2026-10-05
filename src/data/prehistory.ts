/**
 * Urzeit & Steinzeit auf der Geschichts-Karte (Nutzerwunsch 05.10.2026:
 * "bei Geschichte-Map Urzivilisationen oder Steinzeiten, Leben, Kulturen
 * hinzufügen").
 *
 * Cliopatria (Grenzen der Reiche) beginnt erst 3400 v. Chr. — davor gibt
 * es keine Staaten mit Grenzen. Darum hier eine kleine, handverlesene Liste
 * bekannter Menschenarten, Steinzeit-Kulturen und früher Siedlungen mit
 * ungefährem Verbreitungsgebiet (Mittelpunkt + Ausdehnung in Grad) und
 * Zeitraum nach dem Stand der Forschung (Werte wie in den jeweiligen
 * Wikipedia-Artikeln; Datierungen sind naturgemäß ungefähr). Die Gebiete
 * werden bewusst als weiche, gestrichelte Flächen gezeichnet, nicht als
 * scharfe Grenzen. Beschreibungstexte kommen live aus Wikipedia (Artikel
 * `wiki` = englischer Titel, per Sprachlink in die eingestellte Sprache).
 *
 * Namen-Reihenfolge in `n`: de, en, hi, zh, ko, ja, es, fr, tr, ru, pt, ar, el
 */

export type PrehistKind = "human" | "paleo" | "neo" | "early";

export interface PrehistCulture {
  id: string;
  wiki: string;
  from: number; // Jahr (negativ = v. Chr.)
  to: number;
  lat: number;
  lng: number;
  rx: number; // halbe Breite in Grad (Ost-West)
  ry: number; // halbe Höhe in Grad (Nord-Süd)
  kind: PrehistKind;
  n: string[];
}

export const PREHIST_LANGS = ["de", "en", "hi", "zh", "ko", "ja", "es", "fr", "tr", "ru", "pt", "ar", "el"];

export const PREHIST_COLORS: Record<PrehistKind, string> = {
  human: "#f2b45a", // Menschenarten
  paleo: "#e07a4f", // Altsteinzeit
  neo: "#7fcf7a", // Jungsteinzeit (erste Bauern)
  early: "#5ec8d8", // Kupferzeit / frühe Städte
};

export const PREHIST_CULTURES: PrehistCulture[] = [
  // ---- Menschenarten ----
  { id: "sapiens", wiki: "Early modern human", from: -300000, to: -12000, lat: 4, lng: 22, rx: 26, ry: 24, kind: "human",
    n: ["Homo sapiens (Afrika)", "Homo sapiens (Africa)", "होमो सेपियन्स (अफ्रीका)", "智人（非洲）", "호모 사피엔스 (아프리카)", "ホモ・サピエンス（アフリカ）", "Homo sapiens (África)", "Homo sapiens (Afrique)", "Homo sapiens (Afrika)", "Homo sapiens (Африка)", "Homo sapiens (África)", "الإنسان العاقل (أفريقيا)", "Homo sapiens (Αφρική)"] },
  { id: "neanderthal", wiki: "Neanderthal", from: -400000, to: -40000, lat: 43, lng: 28, rx: 27, ry: 9, kind: "human",
    n: ["Neandertaler", "Neanderthals", "निएंडरथल", "尼安德特人", "네안데르탈인", "ネアンデルタール人", "Neandertales", "Néandertaliens", "Neandertaller", "Неандертальцы", "Neandertais", "إنسان نياندرتال", "Νεάντερταλ"] },
  { id: "denisovan", wiki: "Denisovan", from: -300000, to: -50000, lat: 44, lng: 92, rx: 20, ry: 11, kind: "human",
    n: ["Denisova-Mensch", "Denisovans", "डेनिसोवन", "丹尼索瓦人", "데니소바인", "デニソワ人", "Denisovanos", "Dénisoviens", "Denisova insanı", "Денисовский человек", "Denisovanos", "إنسان دينيسوفا", "Ντενίσοβα"] },
  { id: "erectus", wiki: "Homo erectus", from: -300000, to: -110000, lat: 8, lng: 108, rx: 14, ry: 14, kind: "human",
    n: ["Homo erectus (Asien)", "Homo erectus (Asia)", "होमो इरेक्टस (एशिया)", "直立人（亚洲）", "호모 에렉투스 (아시아)", "ホモ・エレクトス（アジア）", "Homo erectus (Asia)", "Homo erectus (Asie)", "Homo erectus (Asya)", "Человек прямоходящий (Азия)", "Homo erectus (Ásia)", "الإنسان المنتصب (آسيا)", "Homo erectus (Ασία)"] },
  { id: "outofafrica", wiki: "Recent African origin of modern humans", from: -70000, to: -45000, lat: 22, lng: 46, rx: 14, ry: 9, kind: "human",
    n: ["Aufbruch aus Afrika", "Out of Africa", "अफ्रीका से बाहर प्रवास", "走出非洲", "아프리카 기원설 (이주)", "出アフリカ", "Salida de África", "Sortie d'Afrique", "Afrika'dan çıkış", "Выход из Африки", "Saída de África", "الخروج من أفريقيا", "Έξοδος από την Αφρική"] },
  { id: "australia", wiki: "Aboriginal Australians", from: -65000, to: 1788, lat: -24, lng: 134, rx: 16, ry: 11, kind: "human",
    n: ["Erste Australier", "First Australians", "प्रथम ऑस्ट्रेलियाई", "澳大利亚原住民", "오스트레일리아 원주민", "アボリジニ", "Primeros australianos", "Premiers Australiens", "İlk Avustralyalılar", "Первые австралийцы", "Primeiros australianos", "سكان أستراليا الأصليون", "Πρώτοι Αυστραλοί"] },
  // ---- Altsteinzeit (Jäger und Sammler, Höhlenkunst) ----
  { id: "aurignacian", wiki: "Aurignacian", from: -43000, to: -26000, lat: 49, lng: 3, rx: 11, ry: 5, kind: "paleo",
    n: ["Aurignacien", "Aurignacian", "ऑरिग्नेशियन संस्कृति", "奥瑞纳文化", "오리냐크 문화", "オーリニャック文化", "Auriñaciense", "Aurignacien", "Orinyak kültürü", "Ориньякская культура", "Aurignacense", "الثقافة الأورينياسية", "Ωρινιάκιος πολιτισμός"] },
  { id: "gravettian", wiki: "Gravettian", from: -33000, to: -21000, lat: 49, lng: 22, rx: 18, ry: 6, kind: "paleo",
    n: ["Gravettien", "Gravettian", "ग्रेवेटियन संस्कृति", "格拉维特文化", "그라베트 문화", "グラヴェット文化", "Gravetiense", "Gravettien", "Gravet kültürü", "Граветтская культура", "Gravettense", "الثقافة الغرافيتية", "Γκραβέτιος πολιτισμός"] },
  { id: "magdalenian", wiki: "Magdalenian", from: -17000, to: -12000, lat: 45, lng: 2, rx: 9, ry: 5, kind: "paleo",
    n: ["Magdalénien (Lascaux)", "Magdalenian (Lascaux)", "मैग्डेलेनियन (लास्को)", "马格德林文化（拉斯科）", "막달레니안 (라스코)", "マドレーヌ文化（ラスコー）", "Magdaleniense (Lascaux)", "Magdalénien (Lascaux)", "Magdalen kültürü (Lascaux)", "Мадленская культура (Ласко)", "Magdalenense (Lascaux)", "الثقافة المجدلية (لاسكو)", "Μαγδαλήνιος (Λασκώ)"] },
  { id: "jomon", wiki: "Jōmon period", from: -14000, to: -300, lat: 36.5, lng: 138, rx: 6, ry: 5, kind: "paleo",
    n: ["Jōmon-Kultur", "Jōmon culture", "जोमोन संस्कृति", "绳文文化", "조몬 문화", "縄文文化", "Cultura Jōmon", "Culture Jōmon", "Jōmon kültürü", "Культура Дзёмон", "Cultura Jōmon", "ثقافة جومون", "Πολιτισμός Τζόμον"] },
  { id: "clovis", wiki: "Clovis culture", from: -11500, to: -10800, lat: 37, lng: -100, rx: 18, ry: 10, kind: "paleo",
    n: ["Clovis-Kultur", "Clovis culture", "क्लोविस संस्कृति", "克洛维斯文化", "클로비스 문화", "クローヴィス文化", "Cultura Clovis", "Culture Clovis", "Clovis kültürü", "Культура Кловис", "Cultura Clovis", "ثقافة كلوفيس", "Πολιτισμός Κλόβις"] },
  { id: "natufian", wiki: "Natufian culture", from: -13000, to: -9500, lat: 32.5, lng: 35.6, rx: 3, ry: 3, kind: "paleo",
    n: ["Natufien", "Natufian culture", "नातूफ़ियन संस्कृति", "纳图夫文化", "나투프 문화", "ナトゥーフ文化", "Cultura natufiense", "Natoufien", "Natuf kültürü", "Натуфийская культура", "Cultura natufiana", "الثقافة النطوفية", "Νατούφιος πολιτισμός"] },
  { id: "maglemosian", wiki: "Maglemosian culture", from: -9000, to: -6400, lat: 55, lng: 10, rx: 8, ry: 3, kind: "paleo",
    n: ["Maglemose-Kultur", "Maglemosian culture", "मैग्लेमोसियन संस्कृति", "马格勒莫斯文化", "마글레모세 문화", "マグレモーゼ文化", "Cultura maglemosiense", "Culture maglemosienne", "Maglemose kültürü", "Маглемозе", "Cultura maglemosiana", "ثقافة ماغلموز", "Πολιτισμός Μάγκλεμοζε"] },
  // ---- Jungsteinzeit: erste Bauern, Tempel, Dörfer ----
  { id: "gobekli", wiki: "Göbekli Tepe", from: -9600, to: -8000, lat: 37.22, lng: 38.92, rx: 2, ry: 1.6, kind: "neo",
    n: ["Göbekli Tepe", "Göbekli Tepe", "गोबेक्ली टेपे", "哥贝克力石阵", "괴베클리 테페", "ギョベクリ・テペ", "Göbekli Tepe", "Göbekli Tepe", "Göbekli Tepe", "Гёбекли-Тепе", "Göbekli Tepe", "غوبكلي تبه", "Γκιομπεκλί Τεπέ"] },
  { id: "ppn", wiki: "Pre-Pottery Neolithic", from: -9500, to: -6500, lat: 34, lng: 39, rx: 7, ry: 5, kind: "neo",
    n: ["Erste Bauern (Fruchtbarer Halbmond)", "First farmers (Fertile Crescent)", "प्रथम किसान (उपजाऊ अर्धचंद्र)", "最早的农民（新月沃土）", "최초의 농경민 (비옥한 초승달)", "最初の農耕民（肥沃な三日月地帯）", "Primeros agricultores (Creciente Fértil)", "Premiers agriculteurs (Croissant fertile)", "İlk çiftçiler (Bereketli Hilal)", "Первые земледельцы (Плодородный полумесяц)", "Primeiros agricultores (Crescente Fértil)", "أوائل المزارعين (الهلال الخصيب)", "Πρώτοι γεωργοί (Εύφορη Ημισέληνος)"] },
  { id: "sahara", wiki: "African humid period", from: -9000, to: -4000, lat: 21, lng: 12, rx: 24, ry: 7, kind: "neo",
    n: ["Grüne Sahara (Felsbilder)", "Green Sahara (rock art)", "हरा सहारा (शैलचित्र)", "绿色撒哈拉（岩画）", "녹색 사하라 (암각화)", "緑のサハラ（岩絵）", "Sahara verde (arte rupestre)", "Sahara vert (art rupestre)", "Yeşil Sahra (kaya resimleri)", "Зелёная Сахара (наскальные рисунки)", "Saara verde (arte rupestre)", "الصحراء الخضراء (الفن الصخري)", "Πράσινη Σαχάρα (βραχογραφίες)"] },
  { id: "nabta", wiki: "Nabta Playa", from: -7500, to: -3400, lat: 22.5, lng: 30.7, rx: 1.5, ry: 1.5, kind: "neo",
    n: ["Nabta Playa", "Nabta Playa", "नब्ता प्लाया", "纳布塔沙漠盆地", "나브타 플라야", "ナブタ・プラヤ", "Nabta Playa", "Nabta Playa", "Nabta Playa", "Набта-Плайя", "Nabta Playa", "نبتة بلايا", "Νάμπτα Πλάγια"] },
  { id: "catalhoyuk", wiki: "Çatalhöyük", from: -7400, to: -6000, lat: 37.67, lng: 32.83, rx: 2, ry: 1.5, kind: "neo",
    n: ["Çatalhöyük", "Çatalhöyük", "चाटलहोयुक", "加泰土丘", "차탈회위크", "チャタル・ヒュユク", "Çatalhöyük", "Çatal Höyük", "Çatalhöyük", "Чатал-Хююк", "Çatalhöyük", "تشاتالهويوك", "Τσατάλ Χουγιούκ"] },
  { id: "mehrgarh", wiki: "Mehrgarh", from: -7000, to: -2500, lat: 29.4, lng: 67.6, rx: 4, ry: 3, kind: "neo",
    n: ["Mehrgarh", "Mehrgarh", "मेहरगढ़", "梅赫尔格尔", "메르가르", "メヘルガル", "Mehrgarh", "Mehrgarh", "Mehrgarh", "Мергарх", "Mehrgarh", "مهرغره", "Μεργκάρ"] },
  { id: "jiahu", wiki: "Jiahu", from: -7000, to: -5700, lat: 33.6, lng: 113.7, rx: 3, ry: 2, kind: "neo",
    n: ["Jiahu", "Jiahu", "जियाहू", "贾湖遗址", "자후 유적", "賈湖遺跡", "Jiahu", "Jiahu", "Jiahu", "Цзяху", "Jiahu", "جياهو", "Τζιαχού"] },
  { id: "halaf", wiki: "Halaf culture", from: -6100, to: -5100, lat: 36.5, lng: 41, rx: 6, ry: 3, kind: "neo",
    n: ["Halaf-Kultur", "Halaf culture", "हलाफ़ संस्कृति", "哈拉夫文化", "할라프 문화", "ハラフ文化", "Cultura Halaf", "Culture de Halaf", "Halaf kültürü", "Халафская культура", "Cultura Halaf", "ثقافة حلف", "Πολιτισμός Χαλάφ"] },
  { id: "lbk", wiki: "Linear Pottery culture", from: -5500, to: -4500, lat: 50, lng: 14, rx: 12, ry: 4, kind: "neo",
    n: ["Bandkeramik", "Linear Pottery culture", "रेखीय मृद्भांड संस्कृति", "线纹陶文化", "선형 토기 문화", "線帯文土器文化", "Cultura de la cerámica de bandas", "Culture rubanée", "Çizgisel Çanak Çömlek kültürü", "Культура линейно-ленточной керамики", "Cultura da cerâmica linear", "ثقافة الفخار الخطي", "Πολιτισμός Γραμμικής Κεραμικής"] },
  { id: "vinca", wiki: "Vinča culture", from: -5700, to: -4500, lat: 44.5, lng: 21, rx: 4, ry: 3, kind: "neo",
    n: ["Vinča-Kultur", "Vinča culture", "विंचा संस्कृति", "温查文化", "빈차 문화", "ヴィンチャ文化", "Cultura Vinča", "Culture de Vinča", "Vinča kültürü", "Культура Винча", "Cultura Vinča", "ثقافة فينتشا", "Πολιτισμός Βίντσα"] },
  { id: "yangshao", wiki: "Yangshao culture", from: -5000, to: -3000, lat: 34.8, lng: 109, rx: 6, ry: 3.5, kind: "neo",
    n: ["Yangshao-Kultur", "Yangshao culture", "यांगशाओ संस्कृति", "仰韶文化", "양사오 문화", "仰韶文化", "Cultura Yangshao", "Culture de Yangshao", "Yangshao kültürü", "Культура Яншао", "Cultura Yangshao", "ثقافة يانغشاو", "Πολιτισμός Γιανγκσάο"] },
  { id: "hongshan", wiki: "Hongshan culture", from: -4700, to: -2900, lat: 42, lng: 120, rx: 4, ry: 3, kind: "neo",
    n: ["Hongshan-Kultur", "Hongshan culture", "होंगशान संस्कृति", "红山文化", "홍산 문화", "紅山文化", "Cultura Hongshan", "Culture de Hongshan", "Hongshan kültürü", "Культура Хуншань", "Cultura Hongshan", "ثقافة هونغشان", "Πολιτισμός Χονγκσάν"] },
  { id: "funnelbeaker", wiki: "Funnelbeaker culture", from: -4300, to: -2800, lat: 54, lng: 12, rx: 9, ry: 4, kind: "neo",
    n: ["Trichterbecherkultur", "Funnelbeaker culture", "फ़नलबीकर संस्कृति", "漏斗颈陶文化", "깔때기 비커 문화", "漏斗状杯文化", "Cultura de los vasos de embudo", "Culture des vases à entonnoir", "Huni Kadeh kültürü", "Культура воронковидных кубков", "Cultura dos vasos de funil", "ثقافة الكأس القمعي", "Πολιτισμός Χωνοειδών Κυπέλλων"] },
  // ---- Kupferzeit & erste Städte (bis zu den Reichen der Karte) ----
  { id: "ubaid", wiki: "Ubaid period", from: -6500, to: -3800, lat: 31.5, lng: 46, rx: 5, ry: 3, kind: "early",
    n: ["Obed-Zeit (Mesopotamien)", "Ubaid period (Mesopotamia)", "उबैद काल (मेसोपोटामिया)", "欧贝德文化（美索不达米亚）", "우바이드 시대 (메소포타미아)", "ウバイド文化（メソポタミア）", "Período de El Obeid", "Période d'Obeïd", "Ubeyd dönemi", "Убейдский период", "Período Ubaid", "فترة العبيد", "Περίοδος Ουμπαΐντ"] },
  { id: "cucuteni", wiki: "Cucuteni–Trypillia culture", from: -5500, to: -2750, lat: 47.5, lng: 28, rx: 5, ry: 3, kind: "early",
    n: ["Cucuteni-Tripolje-Kultur", "Cucuteni–Trypillia culture", "कुकुटेनी–त्रिपिल्या संस्कृति", "库库特尼-特里波里文化", "쿠쿠테니-트리필리아 문화", "ククテニ・トリピリャ文化", "Cultura Cucuteni-Trypillia", "Culture de Cucuteni-Trypillia", "Cucuteni-Trypillia kültürü", "Трипольская культура", "Cultura Cucuteni-Trypillia", "ثقافة كوكوتيني-تريبيليا", "Πολιτισμός Κουκουτένι-Τρυπίλια"] },
  { id: "varna", wiki: "Varna culture", from: -4400, to: -4100, lat: 43.2, lng: 27.9, rx: 1.5, ry: 1.2, kind: "early",
    n: ["Warna-Kultur (ältestes Gold)", "Varna culture (oldest gold)", "वर्ना संस्कृति (सबसे पुराना सोना)", "瓦尔纳文化（最古老的黄金）", "바르나 문화 (가장 오래된 금)", "ヴァルナ文化（最古の金）", "Cultura de Varna (oro más antiguo)", "Culture de Varna (plus vieil or)", "Varna kültürü (en eski altın)", "Варненская культура (древнейшее золото)", "Cultura de Varna (ouro mais antigo)", "ثقافة فارنا (أقدم ذهب)", "Πολιτισμός Βάρνας (αρχαιότερος χρυσός)"] },
  { id: "naqada", wiki: "Naqada culture", from: -4000, to: -3000, lat: 26, lng: 32.7, rx: 2, ry: 4, kind: "early",
    n: ["Naqada-Kultur (Ägypten)", "Naqada culture (Egypt)", "नक़ादा संस्कृति (मिस्र)", "涅伽达文化（埃及）", "나카다 문화 (이집트)", "ナカダ文化（エジプト）", "Cultura de Naqada (Egipto)", "Culture de Nagada (Égypte)", "Nakada kültürü (Mısır)", "Культура Негада (Египет)", "Cultura de Naqada (Egito)", "ثقافة نقادة (مصر)", "Πολιτισμός Ναγκάντα (Αίγυπτος)"] },
  { id: "botai", wiki: "Botai culture", from: -3700, to: -3100, lat: 53.2, lng: 67, rx: 4, ry: 2.5, kind: "early",
    n: ["Botai-Kultur (erste Pferde)", "Botai culture (early horses)", "बोटाई संस्कृति (प्रारंभिक घोड़े)", "博泰文化（早期驯马）", "보타이 문화 (초기 말)", "ボタイ文化（初期の馬）", "Cultura Botai (primeros caballos)", "Culture de Botaï (premiers chevaux)", "Botay kültürü (ilk atlar)", "Ботайская культура (первые лошади)", "Cultura Botai (primeiros cavalos)", "ثقافة بوتاي (أوائل الخيول)", "Πολιτισμός Μποτάι (πρώτα άλογα)"] },
  { id: "caral", wiki: "Norte Chico civilization", from: -3500, to: -1800, lat: -10.9, lng: -77.5, rx: 2, ry: 3, kind: "early",
    n: ["Caral-Kultur (Peru)", "Caral civilization (Peru)", "कराल सभ्यता (पेरू)", "卡拉尔文明（秘鲁）", "카랄 문명 (페루)", "カラル文明（ペルー）", "Civilización Caral (Perú)", "Civilisation de Caral (Pérou)", "Caral uygarlığı (Peru)", "Цивилизация Караль (Перу)", "Civilização Caral (Peru)", "حضارة كارال (بيرو)", "Πολιτισμός Καράλ (Περού)"] },
  { id: "valdivia", wiki: "Valdivia culture", from: -3800, to: -1500, lat: -1.8, lng: -80.5, rx: 1.5, ry: 2, kind: "early",
    n: ["Valdivia-Kultur (Ecuador)", "Valdivia culture (Ecuador)", "वाल्दीविया संस्कृति (इक्वाडोर)", "巴尔迪维亚文化（厄瓜多尔）", "발디비아 문화 (에콰도르)", "バルディビア文化（エクアドル）", "Cultura Valdivia (Ecuador)", "Culture Valdivia (Équateur)", "Valdivia kültürü (Ekvador)", "Культура Вальдивия (Эквадор)", "Cultura Valdivia (Equador)", "ثقافة فالديفيا (الإكوادور)", "Πολιτισμός Βαλντίβια (Ισημερινός)"] },
  { id: "yamnaya", wiki: "Yamnaya culture", from: -3300, to: -2600, lat: 47.5, lng: 42, rx: 12, ry: 4, kind: "early",
    n: ["Jamnaja-Kultur", "Yamnaya culture", "यमनाया संस्कृति", "颜那亚文化", "얌나야 문화", "ヤムナ文化", "Cultura Yamna", "Culture Yamna", "Yamnaya kültürü", "Ямная культура", "Cultura Yamna", "ثقافة يامنايا", "Πολιτισμός Γιάμνα"] },
  { id: "skarabrae", wiki: "Skara Brae", from: -3180, to: -2500, lat: 59.05, lng: -3.34, rx: 1.2, ry: 0.8, kind: "early",
    n: ["Skara Brae", "Skara Brae", "स्कारा ब्रे", "斯卡拉布雷", "스카라 브레", "スカラ・ブレイ", "Skara Brae", "Skara Brae", "Skara Brae", "Скара-Брей", "Skara Brae", "سكارا براي", "Σκάρα Μπρέι"] },
  { id: "stonehenge", wiki: "Stonehenge", from: -3000, to: -1500, lat: 51.18, lng: -1.83, rx: 2.5, ry: 1.8, kind: "early",
    n: ["Stonehenge", "Stonehenge", "स्टोनहेंज", "巨石阵", "스톤헨지", "ストーンヘンジ", "Stonehenge", "Stonehenge", "Stonehenge", "Стоунхендж", "Stonehenge", "ستونهنج", "Στόουνχεντζ"] },
  { id: "cordedware", wiki: "Corded Ware culture", from: -3000, to: -2350, lat: 52, lng: 22, rx: 12, ry: 5, kind: "early",
    n: ["Schnurkeramik", "Corded Ware culture", "रस्सी-छाप मृद्भांड संस्कृति", "绳纹陶文化", "끈무늬 토기 문화", "縄目文土器文化", "Cultura de la cerámica cordada", "Culture de la céramique cordée", "İpli Çanak Çömlek kültürü", "Культура шнуровой керамики", "Cultura da cerâmica cordada", "ثقافة الفخار المحزز", "Πολιτισμός Σχοινοειδούς Κεραμικής"] },
  { id: "longshan", wiki: "Longshan culture", from: -3000, to: -1900, lat: 35.5, lng: 116, rx: 5, ry: 3, kind: "early",
    n: ["Longshan-Kultur", "Longshan culture", "लोंगशान संस्कृति", "龙山文化", "룽산 문화", "龍山文化", "Cultura Longshan", "Culture de Longshan", "Longshan kültürü", "Культура Луншань", "Cultura Longshan", "ثقافة لونغشان", "Πολιτισμός Λονγκσάν"] },
  { id: "bellbeaker", wiki: "Bell Beaker culture", from: -2800, to: -1800, lat: 46, lng: 1, rx: 12, ry: 7, kind: "early",
    n: ["Glockenbecherkultur", "Bell Beaker culture", "बेल बीकर संस्कृति", "钟形杯文化", "종형 비커 문화", "鐘状ビーカー文化", "Cultura del vaso campaniforme", "Culture campaniforme", "Çan Kadeh kültürü", "Культура колоколовидных кубков", "Cultura do vaso campaniforme", "ثقافة الكأس الجرسية", "Πολιτισμός Κωδωνόσχημων Κυπέλλων"] },
  { id: "lapita", wiki: "Lapita culture", from: -1600, to: -500, lat: -15, lng: 170, rx: 15, ry: 6, kind: "early",
    n: ["Lapita-Kultur (Pazifik)", "Lapita culture (Pacific)", "लापिटा संस्कृति (प्रशांत)", "拉皮塔文化（太平洋）", "라피타 문화 (태평양)", "ラピタ文化（太平洋）", "Cultura lapita (Pacífico)", "Culture lapita (Pacifique)", "Lapita kültürü (Pasifik)", "Культура лапита (Тихий океан)", "Cultura lapita (Pacífico)", "ثقافة لابيتا (المحيط الهادئ)", "Πολιτισμός Λαπίτα (Ειρηνικός)"] },
];

/** Zeitpunkte für die Urzeit-Leiste (Jahr + Kurztitel in 13 Sprachen). */
export interface PrehistEra {
  year: number;
  n: string[];
}

export const PREHIST_ERAS: PrehistEra[] = [
  { year: -300000, n: ["Erste Homo sapiens", "First Homo sapiens", "पहले होमो सेपियन्स", "最早的智人", "최초의 호모 사피엔스", "最初のホモ・サピエンス", "Primeros Homo sapiens", "Premiers Homo sapiens", "İlk Homo sapiens", "Первые Homo sapiens", "Primeiros Homo sapiens", "أول إنسان عاقل", "Πρώτοι Homo sapiens"] },
  { year: -60000, n: ["Aufbruch aus Afrika", "Out of Africa", "अफ्रीका से बाहर", "走出非洲", "아프리카 밖으로", "出アフリカ", "Salida de África", "Sortie d'Afrique", "Afrika'dan çıkış", "Выход из Африки", "Saída de África", "الخروج من أفريقيا", "Έξοδος από την Αφρική"] },
  { year: -42000, n: ["Höhlenkunst & Neandertaler", "Cave art & Neanderthals", "गुफा कला और निएंडरथल", "洞穴艺术与尼安德特人", "동굴 벽화와 네안데르탈인", "洞窟壁画とネアンデルタール人", "Arte rupestre y neandertales", "Art pariétal et Néandertaliens", "Mağara sanatı ve Neandertaller", "Пещерное искусство и неандертальцы", "Arte rupestre e neandertais", "الفن الكهفي وإنسان نياندرتال", "Σπηλαιογραφίες και Νεάντερταλ"] },
  { year: -25000, n: ["Eiszeit-Jäger", "Ice Age hunters", "हिमयुग के शिकारी", "冰河时代的猎人", "빙하기의 사냥꾼", "氷河期の狩人", "Cazadores de la Edad de Hielo", "Chasseurs de l'ère glaciaire", "Buzul Çağı avcıları", "Охотники ледникового периода", "Caçadores da Era do Gelo", "صيادو العصر الجليدي", "Κυνηγοί της Εποχής των Παγετώνων"] },
  { year: -15000, n: ["Lascaux & Jōmon", "Lascaux & Jōmon", "लास्को और जोमोन", "拉斯科与绳文", "라스코와 조몬", "ラスコーと縄文", "Lascaux y Jōmon", "Lascaux et Jōmon", "Lascaux ve Jōmon", "Ласко и Дзёмон", "Lascaux e Jōmon", "لاسكو وجومون", "Λασκώ και Τζόμον"] },
  { year: -11000, n: ["Ende der Eiszeit", "End of the Ice Age", "हिमयुग का अंत", "冰河时代末期", "빙하기의 끝", "氷河期の終わり", "Fin de la Edad de Hielo", "Fin de l'ère glaciaire", "Buzul Çağı'nın sonu", "Конец ледникового периода", "Fim da Era do Gelo", "نهاية العصر الجليدي", "Τέλος της Εποχής των Παγετώνων"] },
  { year: -9000, n: ["Göbekli Tepe & erste Bauern", "Göbekli Tepe & first farmers", "गोबेक्ली टेपे और प्रथम किसान", "哥贝克力石阵与最早的农民", "괴베클리 테페와 최초의 농부", "ギョベクリ・テペと最初の農民", "Göbekli Tepe y primeros agricultores", "Göbekli Tepe et premiers agriculteurs", "Göbekli Tepe ve ilk çiftçiler", "Гёбекли-Тепе и первые земледельцы", "Göbekli Tepe e primeiros agricultores", "غوبكلي تبه وأوائل المزارعين", "Γκιομπεκλί Τεπέ και πρώτοι γεωργοί"] },
  { year: -6800, n: ["Erste Dörfer", "First villages", "पहले गाँव", "最早的村落", "최초의 마을", "最初の村", "Primeras aldeas", "Premiers villages", "İlk köyler", "Первые деревни", "Primeiras aldeias", "أولى القرى", "Πρώτα χωριά"] },
  { year: -4900, n: ["Jungsteinzeit in Europa & China", "Neolithic Europe & China", "यूरोप और चीन में नवपाषाण", "欧洲与中国的新石器时代", "유럽과 중국의 신석기", "ヨーロッパと中国の新石器時代", "Neolítico en Europa y China", "Néolithique en Europe et en Chine", "Avrupa ve Çin'de Neolitik", "Неолит Европы и Китая", "Neolítico na Europa e China", "العصر الحجري الحديث في أوروبا والصين", "Νεολιθική Ευρώπη και Κίνα"] },
  { year: -4200, n: ["Kupferzeit & erstes Gold", "Copper Age & first gold", "ताम्र युग और पहला सोना", "铜石并用时代与最早的黄金", "동기 시대와 최초의 금", "銅器時代と最初の金", "Edad del Cobre y primer oro", "Âge du cuivre et premier or", "Bakır Çağı ve ilk altın", "Медный век и первое золото", "Idade do Cobre e primeiro ouro", "العصر النحاسي وأول ذهب", "Χαλκολιθική εποχή και πρώτος χρυσός"] },
  { year: -3500, n: ["Vor den ersten Reichen", "Before the first empires", "पहले साम्राज्यों से पहले", "最早的帝国之前", "최초의 제국 이전", "最初の帝国の前", "Antes de los primeros imperios", "Avant les premiers empires", "İlk imparatorluklardan önce", "До первых империй", "Antes dos primeiros impérios", "قبل أولى الإمبراطوريات", "Πριν από τις πρώτες αυτοκρατορίες"] },
];

export function prehistName(names: string[], lang: string): string {
  const i = PREHIST_LANGS.indexOf(lang);
  return names[i >= 0 ? i : 1] || names[1];
}

export function prehistActive(year: number): PrehistCulture[] {
  return PREHIST_CULTURES.filter((c) => c.from <= year && year <= c.to);
}

/** Weiche, leicht unregelmäßige Fläche (kein scharfes Staatsgebiet). */
export function prehistBlob(c: PrehistCulture): [number, number][] {
  let h = 2166136261;
  for (const ch of c.id) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const ph = [(h >>> 0) % 628, (h >>> 8) % 628, (h >>> 16) % 628].map((v) => v / 100);
  const pts: [number, number][] = [];
  for (let k = 0; k < 48; k++) {
    const a = (k / 48) * Math.PI * 2;
    const f = 1 + 0.12 * Math.sin(3 * a + ph[0]) + 0.08 * Math.sin(5 * a + ph[1]) + 0.05 * Math.sin(7 * a + ph[2]);
    pts.push([c.lat + Math.sin(a) * c.ry * f, c.lng + Math.cos(a) * c.rx * f]);
  }
  return pts;
}

/**
 * Wikipedia-Kurzinfo zu einer Kultur: englischer Artikel → per Sprachlink
 * der Artikel in der eingestellten Sprache; gibt es ihn nicht, Englisch.
 */
export async function fetchPrehistInfo(enTitle: string, lang: string) {
  const summary = async (l: string, title: string) => {
    const r = await fetch(`https://${l}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`);
    if (!r.ok) return null;
    const d = await r.json();
    if (!d?.extract || d.type === "disambiguation") return null;
    return {
      found: true as const,
      title: d.title as string,
      extract: d.extract as string,
      thumbnail: (d.thumbnail?.source as string) ?? null,
      pageUrl: (d.content_urls?.desktop?.page as string) ?? null,
      language: null,
      lang: l,
      source: "wikipedia" as const,
    };
  };
  try {
    if (lang !== "en" && PREHIST_LANGS.includes(lang)) {
      const r = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(enTitle)}&prop=langlinks&lllang=${lang}&redirects=1&format=json&origin=*`
      );
      const d = await r.json();
      const page = Object.values(d?.query?.pages ?? {})[0] as { langlinks?: { "*": string }[] } | undefined;
      const local = page?.langlinks?.[0]?.["*"];
      if (local) {
        const s = await summary(lang, local);
        if (s) return s;
      }
    }
    return (await summary("en", enTitle)) ?? { found: false as const };
  } catch {
    return { found: false as const };
  }
}
