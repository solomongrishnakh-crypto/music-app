import type { Lang } from "@/contexts/LanguageContext";

/**
 * Texte der Reich-Seiten in allen 13 Sprachen (Nutzerwunsch 07.10.2026:
 * internationale Besucher). {name}, {from}, {to}, {years}, {year}, {area},
 * {share} werden eingesetzt — die Sätze sind bewusst so gebaut, dass sie
 * ohne Artikel/Geschlecht des Reichsnamens funktionieren.
 */
export interface ReichTexts {
  crumbHome: string;
  crumbMap: string;
  crumbAll: string;
  eng: string; // "englisch:"
  period: string;
  duration: string;
  durationVal: string; // {years}
  peak: string;
  peakVal: string; // {year}
  area: string;
  areaVal: string; // {area}
  today: string;
  mapCaption: string; // {name} {year}
  openMap: string;
  h2Period: string;
  pPeriod: string; // {name} {from} {to} {years}
  h2Peak: string;
  pPeak: string; // {name} {year} {area} {share}
  chartCaption: string; // {area}
  chartAria: string; // {name}
  h2Rel: string;
  pRel: string;
  before: string; // {year}
  after: string;
  noPred: string;
  noSucc: string;
  h2Neigh: string; // {year}
  pNeigh: string;
  noNeigh: string;
  h2More: string;
  moreMap: string; // {year}
  moreMapHint: string;
  moreWiki: string; // {name}
  moreAll: string; // {n}
  footer: string;
  titleSuffix: string; // "Karte, Ausdehnung & Zeitraum"
  metaDesc: string; // {name} {from} {to} {year} {area}
  eras: [string, string, string, string];
  erasRange: [string, string, string, string];
  indexH1: string;
  indexIntro: string; // {n}
  indexToMap: string;
  indexLargest: string; // {name} {area}
}

const T: Record<Lang, ReichTexts> = {
  de: {
    crumbHome: "Centaurian", crumbMap: "Weltgeschichte-Karte", crumbAll: "Alle Reiche", eng: "englisch:",
    period: "Zeitraum", duration: "Dauer", durationVal: "ca. {years} Jahre", peak: "Größte Ausdehnung", peakVal: "um {year}",
    area: "Fläche (max.)", areaVal: "ca. {area}", today: "heute",
    mapCaption: "{name} zur Zeit der größten Ausdehnung (um {year}) · Grenzen: Cliopatria",
    openMap: "Auf der interaktiven Karte ansehen",
    h2Period: "Zeitraum und Dauer",
    pPeriod: "{name} — laut den Kartendaten von {from} bis {to}, also rund {years} Jahre. Die Jahreszahlen beziehen sich auf die Zeit, in der das Reich als eigenes Gebiet auf der Weltkarte eingezeichnet ist; Gründung und Ende werden in der Geschichtsschreibung teils anders datiert.",
    h2Peak: "Größte Ausdehnung",
    pPeak: "{name} — größte Ausdehnung um {year}: Die eingezeichneten Grenzen umfassen dann etwa {area}, rund {share} % der Landfläche der Erde. Die Fläche ist aus den Grenzlinien der Karte berechnet und daher ein Näherungswert.",
    chartCaption: "Fläche laut Kartendaten (max. {area})", chartAria: "Fläche von {name} im Lauf der Zeit",
    h2Rel: "Vorgänger und Nachfolger", pRel: "Reiche, die dasselbe Gebiet direkt davor bzw. danach beherrschten:",
    before: "Davor ({year})", after: "Danach", noPred: "Keine Vorgänger in den Kartendaten.", noSucc: "Keine Nachfolger in den Kartendaten.",
    h2Neigh: "Nachbarn um {year}", pNeigh: "Die größten Reiche in der Umgebung zur selben Zeit:", noNeigh: "Keine Nachbarreiche in den Kartendaten.",
    h2More: "Mehr erfahren", moreMap: "Weltkarte im Jahr {year} öffnen", moreMapHint: "— Reich antippen für die ausführliche Beschreibung",
    moreWiki: "{name} auf Wikipedia", moreAll: "Alle {n} Reiche im Überblick",
    footer: "Grenzen und Zeiträume: Cliopatria / Seshat Global History Databank (CC BY 4.0). Küsten: Natural Earth. Texte: Centaurian.",
    titleSuffix: "Karte, Ausdehnung & Zeitraum",
    metaDesc: "{name} auf der Karte: {from} bis {to}, größte Ausdehnung um {year} mit ca. {area}. Mit Vorgängern, Nachfolgern und interaktiver Weltgeschichte-Karte.",
    eras: ["Altertum", "Mittelalter", "Frühe Neuzeit", "Moderne"], erasRange: ["bis 500", "500 – 1500", "1500 – 1800", "ab 1800"],
    indexH1: "Alle Reiche & Imperien", indexIntro: "Die {n} größten und langlebigsten Reiche aus unserer Weltgeschichte-Karte — jeweils mit Zeitraum, größter Ausdehnung, Karte, Vorgängern und Nachfolgern.",
    indexToMap: "Zur interaktiven Karte →", indexLargest: "Größtes Reich der Liste: {name} (ca. {area}).",
  },
  en: {
    crumbHome: "Centaurian", crumbMap: "World history map", crumbAll: "All empires", eng: "",
    period: "Period", duration: "Duration", durationVal: "approx. {years} years", peak: "Greatest extent", peakVal: "around {year}",
    area: "Area (max.)", areaVal: "approx. {area}", today: "today",
    mapCaption: "{name} at its greatest extent (around {year}) · Borders: Cliopatria",
    openMap: "View on the interactive map",
    h2Period: "Period and duration",
    pPeriod: "{name} — according to the map data from {from} to {to}, roughly {years} years. The dates refer to the time the empire is drawn as its own territory on the world map; historians sometimes date its founding and end differently.",
    h2Peak: "Greatest extent",
    pPeak: "{name} — greatest extent around {year}: the mapped borders then cover about {area}, roughly {share}% of Earth's land area. The area is calculated from the border lines of the map and is therefore an approximation.",
    chartCaption: "Area according to the map data (max. {area})", chartAria: "Area of {name} over time",
    h2Rel: "Predecessors and successors", pRel: "States that ruled the same territory directly before and after:",
    before: "Before ({year})", after: "After", noPred: "No predecessors in the map data.", noSucc: "No successors in the map data.",
    h2Neigh: "Neighbours around {year}", pNeigh: "The largest states in the region at the same time:", noNeigh: "No neighbouring states in the map data.",
    h2More: "Learn more", moreMap: "Open the world map in {year}", moreMapHint: "— tap the empire for a detailed description",
    moreWiki: "{name} on Wikipedia", moreAll: "All {n} empires at a glance",
    footer: "Borders and dates: Cliopatria / Seshat Global History Databank (CC BY 4.0). Coastlines: Natural Earth. Text: Centaurian.",
    titleSuffix: "Map, Size & Timeline",
    metaDesc: "{name} on the map: {from} to {to}, greatest extent around {year} with about {area}. With predecessors, successors and an interactive world history map.",
    eras: ["Antiquity", "Middle Ages", "Early modern period", "Modern era"], erasRange: ["until 500", "500 – 1500", "1500 – 1800", "since 1800"],
    indexH1: "All empires in history", indexIntro: "The {n} largest and longest-lasting empires from our world history map — each with dates, greatest extent, a map, predecessors and successors.",
    indexToMap: "Open the interactive map →", indexLargest: "Largest empire on the list: {name} (approx. {area}).",
  },
  es: {
    crumbHome: "Centaurian", crumbMap: "Mapa de la historia", crumbAll: "Todos los imperios", eng: "en inglés:",
    period: "Periodo", duration: "Duración", durationVal: "aprox. {years} años", peak: "Máxima extensión", peakVal: "hacia {year}",
    area: "Superficie (máx.)", areaVal: "aprox. {area}", today: "hoy",
    mapCaption: "{name} en su máxima extensión (hacia {year}) · Fronteras: Cliopatria",
    openMap: "Ver en el mapa interactivo",
    h2Period: "Periodo y duración",
    pPeriod: "{name}: según los datos del mapa, de {from} a {to}, unos {years} años. Las fechas se refieren al tiempo en que el imperio aparece como territorio propio en el mapa; los historiadores a veces fechan su fundación y su fin de otra manera.",
    h2Peak: "Máxima extensión",
    pPeak: "{name}: máxima extensión hacia {year}. Las fronteras del mapa abarcan entonces unos {area}, aproximadamente el {share} % de la superficie terrestre. La superficie se calcula a partir de las fronteras del mapa y es una aproximación.",
    chartCaption: "Superficie según los datos del mapa (máx. {area})", chartAria: "Superficie de {name} a lo largo del tiempo",
    h2Rel: "Predecesores y sucesores", pRel: "Estados que gobernaron el mismo territorio justo antes y después:",
    before: "Antes ({year})", after: "Después", noPred: "Sin predecesores en los datos del mapa.", noSucc: "Sin sucesores en los datos del mapa.",
    h2Neigh: "Vecinos hacia {year}", pNeigh: "Los estados más grandes de la región en la misma época:", noNeigh: "Sin estados vecinos en los datos del mapa.",
    h2More: "Más información", moreMap: "Abrir el mapa del mundo en {year}", moreMapHint: "— toca el imperio para ver una descripción detallada",
    moreWiki: "{name} en Wikipedia", moreAll: "Los {n} imperios de un vistazo",
    footer: "Fronteras y fechas: Cliopatria / Seshat Global History Databank (CC BY 4.0). Costas: Natural Earth. Textos: Centaurian.",
    titleSuffix: "Mapa, extensión y cronología",
    metaDesc: "{name} en el mapa: de {from} a {to}, máxima extensión hacia {year} con unos {area}. Con predecesores, sucesores y un mapa interactivo de la historia.",
    eras: ["Antigüedad", "Edad Media", "Edad Moderna", "Época contemporánea"], erasRange: ["hasta 500", "500 – 1500", "1500 – 1800", "desde 1800"],
    indexH1: "Todos los imperios de la historia", indexIntro: "Los {n} imperios más grandes y duraderos de nuestro mapa de la historia, cada uno con fechas, máxima extensión, mapa, predecesores y sucesores.",
    indexToMap: "Abrir el mapa interactivo →", indexLargest: "El imperio más grande de la lista: {name} (aprox. {area}).",
  },
  fr: {
    crumbHome: "Centaurian", crumbMap: "Carte de l'histoire", crumbAll: "Tous les empires", eng: "en anglais :",
    period: "Période", duration: "Durée", durationVal: "env. {years} ans", peak: "Extension maximale", peakVal: "vers {year}",
    area: "Superficie (max.)", areaVal: "env. {area}", today: "aujourd'hui",
    mapCaption: "{name} à son extension maximale (vers {year}) · Frontières : Cliopatria",
    openMap: "Voir sur la carte interactive",
    h2Period: "Période et durée",
    pPeriod: "{name} — d'après les données de la carte, de {from} à {to}, soit environ {years} ans. Les dates correspondent à la période où l'empire figure comme territoire propre sur la carte ; les historiens datent parfois autrement sa fondation et sa fin.",
    h2Peak: "Extension maximale",
    pPeak: "{name} — extension maximale vers {year} : les frontières de la carte couvrent alors environ {area}, soit environ {share} % des terres émergées. La superficie est calculée à partir des frontières de la carte et reste une approximation.",
    chartCaption: "Superficie selon les données de la carte (max. {area})", chartAria: "Superficie de {name} au fil du temps",
    h2Rel: "Prédécesseurs et successeurs", pRel: "États qui ont dominé le même territoire juste avant et juste après :",
    before: "Avant ({year})", after: "Après", noPred: "Aucun prédécesseur dans les données.", noSucc: "Aucun successeur dans les données.",
    h2Neigh: "Voisins vers {year}", pNeigh: "Les plus grands États de la région à la même époque :", noNeigh: "Aucun État voisin dans les données.",
    h2More: "En savoir plus", moreMap: "Ouvrir la carte du monde en {year}", moreMapHint: "— touche l'empire pour une description détaillée",
    moreWiki: "{name} sur Wikipédia", moreAll: "Les {n} empires en un coup d'œil",
    footer: "Frontières et dates : Cliopatria / Seshat Global History Databank (CC BY 4.0). Côtes : Natural Earth. Textes : Centaurian.",
    titleSuffix: "Carte, superficie et chronologie",
    metaDesc: "{name} sur la carte : de {from} à {to}, extension maximale vers {year} avec environ {area}. Avec prédécesseurs, successeurs et carte interactive de l'histoire.",
    eras: ["Antiquité", "Moyen Âge", "Époque moderne", "Époque contemporaine"], erasRange: ["jusqu'en 500", "500 – 1500", "1500 – 1800", "depuis 1800"],
    indexH1: "Tous les empires de l'histoire", indexIntro: "Les {n} empires les plus vastes et les plus durables de notre carte de l'histoire, avec dates, extension maximale, carte, prédécesseurs et successeurs.",
    indexToMap: "Ouvrir la carte interactive →", indexLargest: "Plus grand empire de la liste : {name} (env. {area}).",
  },
  pt: {
    crumbHome: "Centaurian", crumbMap: "Mapa da história", crumbAll: "Todos os impérios", eng: "em inglês:",
    period: "Período", duration: "Duração", durationVal: "cerca de {years} anos", peak: "Extensão máxima", peakVal: "por volta de {year}",
    area: "Área (máx.)", areaVal: "cerca de {area}", today: "hoje",
    mapCaption: "{name} em sua extensão máxima (por volta de {year}) · Fronteiras: Cliopatria",
    openMap: "Ver no mapa interativo",
    h2Period: "Período e duração",
    pPeriod: "{name} — segundo os dados do mapa, de {from} a {to}, cerca de {years} anos. As datas referem-se ao período em que o império aparece como território próprio no mapa; historiadores às vezes datam sua fundação e seu fim de outra forma.",
    h2Peak: "Extensão máxima",
    pPeak: "{name} — extensão máxima por volta de {year}: as fronteiras do mapa abrangem então cerca de {area}, aproximadamente {share}% da área terrestre do planeta. A área é calculada a partir das fronteiras do mapa e é uma aproximação.",
    chartCaption: "Área segundo os dados do mapa (máx. {area})", chartAria: "Área de {name} ao longo do tempo",
    h2Rel: "Antecessores e sucessores", pRel: "Estados que governaram o mesmo território imediatamente antes e depois:",
    before: "Antes ({year})", after: "Depois", noPred: "Sem antecessores nos dados do mapa.", noSucc: "Sem sucessores nos dados do mapa.",
    h2Neigh: "Vizinhos por volta de {year}", pNeigh: "Os maiores estados da região na mesma época:", noNeigh: "Sem estados vizinhos nos dados do mapa.",
    h2More: "Saiba mais", moreMap: "Abrir o mapa-múndi em {year}", moreMapHint: "— toque no império para uma descrição detalhada",
    moreWiki: "{name} na Wikipédia", moreAll: "Todos os {n} impérios",
    footer: "Fronteiras e datas: Cliopatria / Seshat Global History Databank (CC BY 4.0). Costas: Natural Earth. Textos: Centaurian.",
    titleSuffix: "Mapa, extensão e cronologia",
    metaDesc: "{name} no mapa: de {from} a {to}, extensão máxima por volta de {year} com cerca de {area}. Com antecessores, sucessores e mapa interativo da história.",
    eras: ["Antiguidade", "Idade Média", "Idade Moderna", "Idade Contemporânea"], erasRange: ["até 500", "500 – 1500", "1500 – 1800", "desde 1800"],
    indexH1: "Todos os impérios da história", indexIntro: "Os {n} maiores e mais duradouros impérios do nosso mapa da história, cada um com datas, extensão máxima, mapa, antecessores e sucessores.",
    indexToMap: "Abrir o mapa interativo →", indexLargest: "Maior império da lista: {name} (cerca de {area}).",
  },
  tr: {
    crumbHome: "Centaurian", crumbMap: "Dünya tarihi haritası", crumbAll: "Tüm imparatorluklar", eng: "İngilizce:",
    period: "Dönem", duration: "Süre", durationVal: "yaklaşık {years} yıl", peak: "En geniş sınırlar", peakVal: "yaklaşık {year}",
    area: "Yüzölçümü (en fazla)", areaVal: "yaklaşık {area}", today: "bugün",
    mapCaption: "{name}, en geniş sınırlarında ({year} civarı) · Sınırlar: Cliopatria",
    openMap: "Etkileşimli haritada gör",
    h2Period: "Dönem ve süre",
    pPeriod: "{name} — harita verilerine göre {from} ile {to} arası, yaklaşık {years} yıl. Tarihler, devletin haritada ayrı bir bölge olarak gösterildiği dönemi ifade eder; tarihçiler kuruluşu ve sonu bazen farklı tarihlendirir.",
    h2Peak: "En geniş sınırlar",
    pPeak: "{name} — en geniş sınırlar {year} civarı: haritadaki sınırlar yaklaşık {area} alanı kapsar, bu, Dünya'nın kara yüzeyinin yaklaşık %{share} kadarıdır. Alan, harita sınırlarından hesaplanmıştır ve yaklaşık bir değerdir.",
    chartCaption: "Harita verilerine göre alan (en fazla {area})", chartAria: "{name} alanının zaman içindeki değişimi",
    h2Rel: "Öncüller ve ardıllar", pRel: "Aynı bölgeyi hemen önce ve hemen sonra yöneten devletler:",
    before: "Önce ({year})", after: "Sonra", noPred: "Harita verilerinde öncül yok.", noSucc: "Harita verilerinde ardıl yok.",
    h2Neigh: "{year} civarında komşular", pNeigh: "Aynı dönemde bölgedeki en büyük devletler:", noNeigh: "Harita verilerinde komşu devlet yok.",
    h2More: "Daha fazla bilgi", moreMap: "{year} yılının dünya haritasını aç", moreMapHint: "— ayrıntılı açıklama için imparatorluğa dokun",
    moreWiki: "Vikipedi'de {name}", moreAll: "Tüm {n} imparatorluk",
    footer: "Sınırlar ve tarihler: Cliopatria / Seshat Global History Databank (CC BY 4.0). Kıyılar: Natural Earth. Metinler: Centaurian.",
    titleSuffix: "Harita, yüzölçümü ve tarihçe",
    metaDesc: "Haritada {name}: {from} – {to}, en geniş sınırlar {year} civarı, yaklaşık {area}. Öncüller, ardıllar ve etkileşimli dünya tarihi haritası ile.",
    eras: ["İlk Çağ", "Orta Çağ", "Yeni Çağ", "Yakın Çağ"], erasRange: ["500'e kadar", "500 – 1500", "1500 – 1800", "1800'den itibaren"],
    indexH1: "Tarihteki tüm imparatorluklar", indexIntro: "Dünya tarihi haritamızdaki en büyük ve en uzun ömürlü {n} imparatorluk; her biri tarihleri, en geniş sınırları, haritası, öncülleri ve ardıllarıyla.",
    indexToMap: "Etkileşimli haritayı aç →", indexLargest: "Listedeki en büyük imparatorluk: {name} (yaklaşık {area}).",
  },
  ru: {
    crumbHome: "Centaurian", crumbMap: "Карта мировой истории", crumbAll: "Все державы", eng: "по-английски:",
    period: "Период", duration: "Длительность", durationVal: "около {years} лет", peak: "Наибольшая территория", peakVal: "около {year}",
    area: "Площадь (макс.)", areaVal: "около {area}", today: "сегодня",
    mapCaption: "{name} в период наибольшего расширения (около {year}) · Границы: Cliopatria",
    openMap: "Смотреть на интерактивной карте",
    h2Period: "Период и длительность",
    pPeriod: "{name} — по данным карты с {from} по {to}, примерно {years} лет. Даты относятся к периоду, когда государство отмечено на карте как отдельная территория; историки иногда датируют его возникновение и конец иначе.",
    h2Peak: "Наибольшая территория",
    pPeak: "{name} — наибольшая территория около {year}: границы на карте охватывают около {area}, это примерно {share} % суши Земли. Площадь рассчитана по границам карты и является приблизительной.",
    chartCaption: "Площадь по данным карты (макс. {area})", chartAria: "Площадь: {name} во времени",
    h2Rel: "Предшественники и преемники", pRel: "Государства, правившие той же территорией непосредственно до и после:",
    before: "До ({year})", after: "После", noPred: "Нет предшественников в данных карты.", noSucc: "Нет преемников в данных карты.",
    h2Neigh: "Соседи около {year}", pNeigh: "Крупнейшие государства региона в то же время:", noNeigh: "Нет соседних государств в данных карты.",
    h2More: "Узнать больше", moreMap: "Открыть карту мира: {year}", moreMapHint: "— коснись державы, чтобы прочитать подробное описание",
    moreWiki: "{name} в Википедии", moreAll: "Все {n} держав",
    footer: "Границы и даты: Cliopatria / Seshat Global History Databank (CC BY 4.0). Берега: Natural Earth. Тексты: Centaurian.",
    titleSuffix: "карта, площадь и хронология",
    metaDesc: "{name} на карте: {from} – {to}, наибольшая территория около {year}, около {area}. С предшественниками, преемниками и интерактивной картой истории.",
    eras: ["Древность", "Средние века", "Раннее Новое время", "Новое и новейшее время"], erasRange: ["до 500", "500 – 1500", "1500 – 1800", "с 1800"],
    indexH1: "Все империи в истории", indexIntro: "{n} крупнейших и самых долговечных держав с нашей карты мировой истории — с датами, наибольшей территорией, картой, предшественниками и преемниками.",
    indexToMap: "Открыть интерактивную карту →", indexLargest: "Крупнейшая держава в списке: {name} (около {area}).",
  },
  el: {
    crumbHome: "Centaurian", crumbMap: "Χάρτης παγκόσμιας ιστορίας", crumbAll: "Όλες οι αυτοκρατορίες", eng: "στα αγγλικά:",
    period: "Περίοδος", duration: "Διάρκεια", durationVal: "περίπου {years} χρόνια", peak: "Μέγιστη έκταση", peakVal: "γύρω στο {year}",
    area: "Έκταση (μέγ.)", areaVal: "περίπου {area}", today: "σήμερα",
    mapCaption: "{name} στη μέγιστη έκτασή της (γύρω στο {year}) · Σύνορα: Cliopatria",
    openMap: "Δες στον διαδραστικό χάρτη",
    h2Period: "Περίοδος και διάρκεια",
    pPeriod: "{name} — σύμφωνα με τα δεδομένα του χάρτη από {from} έως {to}, περίπου {years} χρόνια. Οι χρονολογίες αφορούν την περίοδο που το κράτος εμφανίζεται ως ξεχωριστή περιοχή στον χάρτη· οι ιστορικοί μερικές φορές χρονολογούν διαφορετικά την ίδρυση και το τέλος του.",
    h2Peak: "Μέγιστη έκταση",
    pPeak: "{name} — μέγιστη έκταση γύρω στο {year}: τα σύνορα του χάρτη καλύπτουν τότε περίπου {area}, δηλαδή περίπου το {share}% της ξηράς της Γης. Η έκταση υπολογίζεται από τα σύνορα του χάρτη και είναι κατά προσέγγιση.",
    chartCaption: "Έκταση σύμφωνα με τα δεδομένα του χάρτη (μέγ. {area})", chartAria: "Έκταση: {name} στον χρόνο",
    h2Rel: "Προκάτοχοι και διάδοχοι", pRel: "Κράτη που κυβέρνησαν την ίδια περιοχή αμέσως πριν και μετά:",
    before: "Πριν ({year})", after: "Μετά", noPred: "Δεν υπάρχουν προκάτοχοι στα δεδομένα.", noSucc: "Δεν υπάρχουν διάδοχοι στα δεδομένα.",
    h2Neigh: "Γείτονες γύρω στο {year}", pNeigh: "Τα μεγαλύτερα κράτη της περιοχής την ίδια εποχή:", noNeigh: "Δεν υπάρχουν γειτονικά κράτη στα δεδομένα.",
    h2More: "Μάθε περισσότερα", moreMap: "Άνοιξε τον παγκόσμιο χάρτη: {year}", moreMapHint: "— πάτησε την αυτοκρατορία για αναλυτική περιγραφή",
    moreWiki: "{name} στη Βικιπαίδεια", moreAll: "Όλες οι {n} αυτοκρατορίες",
    footer: "Σύνορα και χρονολογίες: Cliopatria / Seshat Global History Databank (CC BY 4.0). Ακτές: Natural Earth. Κείμενα: Centaurian.",
    titleSuffix: "Χάρτης, έκταση και χρονολόγιο",
    metaDesc: "{name} στον χάρτη: {from} – {to}, μέγιστη έκταση γύρω στο {year} με περίπου {area}. Με προκατόχους, διαδόχους και διαδραστικό χάρτη ιστορίας.",
    eras: ["Αρχαιότητα", "Μεσαίωνας", "Πρώιμοι νεότεροι χρόνοι", "Νεότεροι χρόνοι"], erasRange: ["έως 500", "500 – 1500", "1500 – 1800", "από 1800"],
    indexH1: "Όλες οι αυτοκρατορίες της ιστορίας", indexIntro: "Οι {n} μεγαλύτερες και μακροβιότερες αυτοκρατορίες του χάρτη μας, με χρονολογίες, μέγιστη έκταση, χάρτη, προκατόχους και διαδόχους.",
    indexToMap: "Άνοιξε τον διαδραστικό χάρτη →", indexLargest: "Η μεγαλύτερη αυτοκρατορία της λίστας: {name} (περίπου {area}).",
  },
  ar: {
    crumbHome: "Centaurian", crumbMap: "خريطة تاريخ العالم", crumbAll: "كل الإمبراطوريات", eng: "بالإنجليزية:",
    period: "الفترة", duration: "المدة", durationVal: "حوالي {years} سنة", peak: "أقصى امتداد", peakVal: "حوالي {year}",
    area: "المساحة (القصوى)", areaVal: "حوالي {area}", today: "اليوم",
    mapCaption: "{name} في أقصى امتداد لها (حوالي {year}) · الحدود: Cliopatria",
    openMap: "عرض على الخريطة التفاعلية",
    h2Period: "الفترة والمدة",
    pPeriod: "{name} — وفق بيانات الخريطة من {from} إلى {to}، أي نحو {years} سنة. تشير التواريخ إلى الفترة التي تظهر فيها الدولة كإقليم مستقل على الخريطة؛ وقد يؤرخ المؤرخون نشأتها ونهايتها بشكل مختلف.",
    h2Peak: "أقصى امتداد",
    pPeak: "{name} — أقصى امتداد حوالي {year}: تغطي الحدود على الخريطة حينها نحو {area}، أي قرابة {share}٪ من مساحة اليابسة على الأرض. المساحة محسوبة من حدود الخريطة وهي قيمة تقريبية.",
    chartCaption: "المساحة وفق بيانات الخريطة (القصوى {area})", chartAria: "مساحة {name} عبر الزمن",
    h2Rel: "الأسلاف والخلفاء", pRel: "الدول التي حكمت الإقليم نفسه مباشرةً قبلها وبعدها:",
    before: "قبلها ({year})", after: "بعدها", noPred: "لا أسلاف في بيانات الخريطة.", noSucc: "لا خلفاء في بيانات الخريطة.",
    h2Neigh: "الجيران حوالي {year}", pNeigh: "أكبر الدول في المنطقة في الفترة نفسها:", noNeigh: "لا دول مجاورة في بيانات الخريطة.",
    h2More: "اعرف المزيد", moreMap: "افتح خريطة العالم في {year}", moreMapHint: "— المس الإمبراطورية لقراءة وصف مفصل",
    moreWiki: "{name} في ويكيبيديا", moreAll: "كل الإمبراطوريات الـ{n}",
    footer: "الحدود والتواريخ: Cliopatria / Seshat Global History Databank (CC BY 4.0). السواحل: Natural Earth. النصوص: Centaurian.",
    titleSuffix: "الخريطة والمساحة والتاريخ",
    metaDesc: "{name} على الخريطة: من {from} إلى {to}، أقصى امتداد حوالي {year} بنحو {area}. مع الأسلاف والخلفاء وخريطة تفاعلية لتاريخ العالم.",
    eras: ["العصور القديمة", "العصور الوسطى", "بداية العصر الحديث", "العصر الحديث"], erasRange: ["حتى 500", "500 – 1500", "1500 – 1800", "منذ 1800"],
    indexH1: "كل إمبراطوريات التاريخ", indexIntro: "أكبر {n} إمبراطورية وأطولها عمراً من خريطتنا لتاريخ العالم، لكل منها التواريخ وأقصى امتداد وخريطة والأسلاف والخلفاء.",
    indexToMap: "افتح الخريطة التفاعلية ←", indexLargest: "أكبر إمبراطورية في القائمة: {name} (حوالي {area}).",
  },
  hi: {
    crumbHome: "Centaurian", crumbMap: "विश्व इतिहास नक्शा", crumbAll: "सभी साम्राज्य", eng: "अंग्रेज़ी में:",
    period: "अवधि", duration: "कुल समय", durationVal: "लगभग {years} वर्ष", peak: "सबसे बड़ा विस्तार", peakVal: "लगभग {year}",
    area: "क्षेत्रफल (अधिकतम)", areaVal: "लगभग {area}", today: "आज",
    mapCaption: "{name} अपने सबसे बड़े विस्तार पर (लगभग {year}) · सीमाएँ: Cliopatria",
    openMap: "इंटरैक्टिव नक्शे पर देखें",
    h2Period: "अवधि और कुल समय",
    pPeriod: "{name} — नक्शे के आँकड़ों के अनुसार {from} से {to} तक, यानी लगभग {years} वर्ष। ये तिथियाँ उस समय की हैं जब यह राज्य नक्शे पर एक अलग क्षेत्र के रूप में दिखाया गया है; इतिहासकार इसकी शुरुआत और अंत कभी-कभी अलग बताते हैं।",
    h2Peak: "सबसे बड़ा विस्तार",
    pPeak: "{name} — सबसे बड़ा विस्तार लगभग {year}: तब नक्शे की सीमाएँ लगभग {area} में फैली थीं, यानी पृथ्वी के स्थल क्षेत्र का लगभग {share}%। क्षेत्रफल नक्शे की सीमाओं से निकाला गया है और अनुमानित है।",
    chartCaption: "नक्शे के आँकड़ों के अनुसार क्षेत्रफल (अधिकतम {area})", chartAria: "समय के साथ {name} का क्षेत्रफल",
    h2Rel: "पूर्ववर्ती और उत्तराधिकारी", pRel: "वे राज्य जिन्होंने ठीक पहले और ठीक बाद इसी क्षेत्र पर शासन किया:",
    before: "पहले ({year})", after: "बाद में", noPred: "नक्शे के आँकड़ों में कोई पूर्ववर्ती नहीं।", noSucc: "नक्शे के आँकड़ों में कोई उत्तराधिकारी नहीं।",
    h2Neigh: "लगभग {year} के पड़ोसी", pNeigh: "उसी समय क्षेत्र के सबसे बड़े राज्य:", noNeigh: "नक्शे के आँकड़ों में कोई पड़ोसी राज्य नहीं।",
    h2More: "और जानें", moreMap: "{year} का विश्व नक्शा खोलें", moreMapHint: "— विस्तृत विवरण के लिए साम्राज्य को छुएँ",
    moreWiki: "विकिपीडिया पर {name}", moreAll: "सभी {n} साम्राज्य",
    footer: "सीमाएँ और तिथियाँ: Cliopatria / Seshat Global History Databank (CC BY 4.0)। तट: Natural Earth। पाठ: Centaurian।",
    titleSuffix: "नक्शा, क्षेत्रफल और समयरेखा",
    metaDesc: "नक्शे पर {name}: {from} से {to} तक, सबसे बड़ा विस्तार लगभग {year} में, लगभग {area}। पूर्ववर्तियों, उत्तराधिकारियों और इंटरैक्टिव विश्व इतिहास नक्शे के साथ।",
    eras: ["प्राचीन काल", "मध्यकाल", "प्रारंभिक आधुनिक काल", "आधुनिक काल"], erasRange: ["500 तक", "500 – 1500", "1500 – 1800", "1800 से"],
    indexH1: "इतिहास के सभी साम्राज्य", indexIntro: "हमारे विश्व इतिहास नक्शे के {n} सबसे बड़े और सबसे लंबे समय तक चले साम्राज्य — हर एक की तिथियाँ, सबसे बड़ा विस्तार, नक्शा, पूर्ववर्ती और उत्तराधिकारी।",
    indexToMap: "इंटरैक्टिव नक्शा खोलें →", indexLargest: "सूची का सबसे बड़ा साम्राज्य: {name} (लगभग {area})।",
  },
  zh: {
    crumbHome: "Centaurian", crumbMap: "世界历史地图", crumbAll: "所有帝国", eng: "英文：",
    period: "时期", duration: "持续时间", durationVal: "约{years}年", peak: "最大疆域", peakVal: "约{year}",
    area: "面积（最大）", areaVal: "约{area}", today: "今天",
    mapCaption: "{name}最大疆域（约{year}）· 疆界：Cliopatria",
    openMap: "在互动地图上查看",
    h2Period: "时期与持续时间",
    pPeriod: "{name}——根据地图数据，从{from}到{to}，约{years}年。年代指该政权在世界地图上作为独立疆域出现的时间；史学界对其建立和终结的年代有时有不同说法。",
    h2Peak: "最大疆域",
    pPeak: "{name}——约{year}达到最大疆域：地图上的疆界约覆盖{area}，约占地球陆地面积的{share}%。面积根据地图疆界计算，为近似值。",
    chartCaption: "地图数据中的面积（最大{area}）", chartAria: "{name}面积随时间的变化",
    h2Rel: "前身与继承者", pRel: "在其之前和之后统治同一地区的政权：",
    before: "之前（{year}）", after: "之后", noPred: "地图数据中没有前身。", noSucc: "地图数据中没有继承者。",
    h2Neigh: "约{year}的邻国", pNeigh: "同一时期该地区最大的政权：", noNeigh: "地图数据中没有邻国。",
    h2More: "了解更多", moreMap: "打开{year}的世界地图", moreMapHint: "——点击帝国查看详细介绍",
    moreWiki: "维基百科上的{name}", moreAll: "全部{n}个帝国一览",
    footer: "疆界与年代：Cliopatria / Seshat Global History Databank（CC BY 4.0）。海岸线：Natural Earth。文字：Centaurian。",
    titleSuffix: "地图、疆域与年代",
    metaDesc: "地图上的{name}：{from}至{to}，约{year}达到最大疆域，约{area}。附前身、继承者和互动世界历史地图。",
    eras: ["古代", "中世纪", "近代早期", "近现代"], erasRange: ["至500年", "500 – 1500", "1500 – 1800", "1800年起"],
    indexH1: "历史上所有的帝国", indexIntro: "我们世界历史地图中最大、最持久的{n}个帝国——每个都有年代、最大疆域、地图、前身与继承者。",
    indexToMap: "打开互动地图 →", indexLargest: "列表中最大的帝国：{name}（约{area}）。",
  },
  ja: {
    crumbHome: "Centaurian", crumbMap: "世界史地図", crumbAll: "すべての帝国", eng: "英語：",
    period: "期間", duration: "存続期間", durationVal: "約{years}年", peak: "最大版図", peakVal: "{year}頃",
    area: "面積（最大）", areaVal: "約{area}", today: "現在",
    mapCaption: "最大版図の{name}（{year}頃）· 国境：Cliopatria",
    openMap: "インタラクティブ地図で見る",
    h2Period: "期間と存続期間",
    pPeriod: "{name}——地図データによると{from}から{to}まで、約{years}年。年代は、その国家が世界地図上で独立した領域として描かれている期間を示します。建国や滅亡の年は歴史家によって異なる場合があります。",
    h2Peak: "最大版図",
    pPeak: "{name}——{year}頃に最大版図：地図上の国境はおよそ{area}に及び、地球の陸地面積の約{share}%にあたります。面積は地図の国境線から計算した概算値です。",
    chartCaption: "地図データによる面積（最大{area}）", chartAria: "{name}の面積の推移",
    h2Rel: "前身と後継国家", pRel: "同じ地域を直前と直後に支配した国家：",
    before: "以前（{year}）", after: "以後", noPred: "地図データに前身はありません。", noSucc: "地図データに後継国家はありません。",
    h2Neigh: "{year}頃の近隣国", pNeigh: "同時代の周辺地域で最大の国家：", noNeigh: "地図データに近隣国はありません。",
    h2More: "さらに詳しく", moreMap: "{year}の世界地図を開く", moreMapHint: "——帝国をタップすると詳しい説明が表示されます",
    moreWiki: "Wikipediaで{name}を見る", moreAll: "全{n}帝国の一覧",
    footer: "国境と年代：Cliopatria / Seshat Global History Databank（CC BY 4.0）。海岸線：Natural Earth。文章：Centaurian。",
    titleSuffix: "地図・版図・年表",
    metaDesc: "地図で見る{name}：{from}〜{to}、{year}頃に最大版図（約{area}）。前身・後継国家とインタラクティブ世界史地図付き。",
    eras: ["古代", "中世", "近世", "近現代"], erasRange: ["500年まで", "500 – 1500", "1500 – 1800", "1800年以降"],
    indexH1: "歴史上すべての帝国", indexIntro: "世界史地図から、最も大きく長く続いた{n}の帝国——それぞれ年代、最大版図、地図、前身と後継国家付き。",
    indexToMap: "インタラクティブ地図を開く →", indexLargest: "リスト中最大の帝国：{name}（約{area}）。",
  },
  ko: {
    crumbHome: "Centaurian", crumbMap: "세계사 지도", crumbAll: "모든 제국", eng: "영어:",
    period: "기간", duration: "존속 기간", durationVal: "약 {years}년", peak: "최대 영토", peakVal: "{year}경",
    area: "면적(최대)", areaVal: "약 {area}", today: "오늘",
    mapCaption: "최대 영토 시기의 {name} ({year}경) · 국경: Cliopatria",
    openMap: "인터랙티브 지도에서 보기",
    h2Period: "기간과 존속 기간",
    pPeriod: "{name} — 지도 데이터에 따르면 {from}부터 {to}까지, 약 {years}년. 연대는 해당 국가가 세계 지도에 독립된 영역으로 표시된 기간을 뜻하며, 역사가에 따라 건국과 멸망 시기를 다르게 보기도 합니다.",
    h2Peak: "최대 영토",
    pPeak: "{name} — {year}경 최대 영토: 지도상의 국경은 약 {area}에 이르며, 이는 지구 육지 면적의 약 {share}%입니다. 면적은 지도의 국경선으로 계산한 근사값입니다.",
    chartCaption: "지도 데이터 기준 면적(최대 {area})", chartAria: "시간에 따른 {name}의 면적",
    h2Rel: "이전 국가와 후계 국가", pRel: "같은 지역을 바로 이전과 이후에 지배한 국가:",
    before: "이전 ({year})", after: "이후", noPred: "지도 데이터에 이전 국가가 없습니다.", noSucc: "지도 데이터에 후계 국가가 없습니다.",
    h2Neigh: "{year}경의 이웃 국가", pNeigh: "같은 시기 주변 지역의 가장 큰 국가:", noNeigh: "지도 데이터에 이웃 국가가 없습니다.",
    h2More: "더 알아보기", moreMap: "{year} 세계 지도 열기", moreMapHint: "— 제국을 누르면 자세한 설명이 나옵니다",
    moreWiki: "위키백과의 {name}", moreAll: "전체 {n}개 제국 보기",
    footer: "국경과 연대: Cliopatria / Seshat Global History Databank (CC BY 4.0). 해안선: Natural Earth. 글: Centaurian.",
    titleSuffix: "지도, 영토, 연대",
    metaDesc: "지도로 보는 {name}: {from}–{to}, {year}경 최대 영토 약 {area}. 이전·후계 국가와 인터랙티브 세계사 지도 포함.",
    eras: ["고대", "중세", "근세", "근현대"], erasRange: ["500년까지", "500 – 1500", "1500 – 1800", "1800년 이후"],
    indexH1: "역사 속 모든 제국", indexIntro: "세계사 지도에서 가장 크고 오래 지속된 {n}개 제국 — 각각 연대, 최대 영토, 지도, 이전·후계 국가 포함.",
    indexToMap: "인터랙티브 지도 열기 →", indexLargest: "목록에서 가장 큰 제국: {name} (약 {area}).",
  },
};

export function reichTexts(lang: Lang): ReichTexts {
  return T[lang];
}

/** Platzhalter {x} ersetzen */
export function fill(tpl: string, vars: Record<string, string | number>): string {
  return tpl.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`));
}

/** Epochen-Index 0–3 */
export function eraIndex(year: number): 0 | 1 | 2 | 3 {
  if (year < 500) return 0;
  if (year < 1500) return 1;
  if (year < 1800) return 2;
  return 3;
}
