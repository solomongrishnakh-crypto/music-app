import type { Lang } from "@/contexts/LanguageContext";

/**
 * Texte der Weltraum-Seiten (Planeten, Maschine der Ewigkeit) in allen 13
 * Sprachen — Nutzerwunsch 07.10.2026: "auch über Maschine der Ewigkeit und
 * Sternenhimmel und Sonnensystem" (international gefunden werden).
 */
export interface SpaceTexts {
  crumbHome: string;
  crumbSolar: string;
  bodyTitle: string; // {name}
  bodyDesc: string; // {name} {diameter} {distance}
  liveDist: string;
  liveHint: string;
  open3d: string;
  wiki: string; // {name}
  others: string;
  solarTitle: string;
  solarDesc: string;
  solarIntro: string;
  credit: string;
  au: string;
  millionKm: string;
  machineTitle: string;
  machineDesc: string;
  machineH1: string;
  machineIntro: string;
  machineHow: string;
  machineHowText: string;
  machineTable: string;
  gear: string;
  oneTurn: string;
  machineFact: string;
  machineOpen: string;
  sec: string;
  min: string;
  hours: string;
  days: string;
  years: string;
  thousandYears: string;
  millionYears: string;
  billionYears: string;
}

const T: Record<Lang, SpaceTexts> = {
  de: {
    crumbHome: "Centaurian", crumbSolar: "Sonnensystem", bodyTitle: "{name} — Fakten, Größe & Abstand zur Erde heute",
    bodyDesc: "{name}: Durchmesser {diameter}, Abstand zur Sonne {distance}, Umlaufzeit, Monde und der Abstand zur Erde live — mit interaktivem 3D-Sonnensystem.",
    liveDist: "Abstand zur Erde jetzt", liveHint: "live berechnet aus den Bahndaten (NASA/JPL)", open3d: "Im 3D-Sonnensystem ansehen", wiki: "{name} auf Wikipedia",
    others: "Weitere Himmelskörper", solarTitle: "Sonnensystem — alle Planeten & Zwergplaneten mit Fakten",
    solarDesc: "Alle Planeten, Zwergplaneten, die Sonne und Voyager 1: Größe, Abstand, Umlaufzeit, Monde und der aktuelle Abstand zur Erde — dazu ein interaktives 3D-Sonnensystem.",
    solarIntro: "Alle Himmelskörper aus unserem interaktiven 3D-Sonnensystem — mit echten Werten und dem Abstand zur Erde, live berechnet.",
    credit: "Bahndaten: NASA/JPL Horizons. Fotos: Wikimedia Commons.", au: "AE", millionKm: "Mio. km",
    machineTitle: "Maschine der Ewigkeit — das Zahnrad, das sich in 13,8 Milliarden Jahren einmal dreht",
    machineDesc: "Eine Kette aus Zahnrädern, jedes sechsmal langsamer als das vorige: das erste dreht sich in 3 Sekunden, das letzte braucht 13,8 Milliarden Jahre — so alt ist das Universum. Live in 3D.",
    machineH1: "Maschine der Ewigkeit",
    machineIntro: "Eine 3D-Maschine aus Zahnrädern, die symbolisch seit dem Urknall läuft. Jedes Rad treibt das nächste an — aber sechsmal langsamer. Das erste dreht sich in etwa 3 Sekunden, das letzte braucht für eine einzige Umdrehung 13,8 Milliarden Jahre: so lange, wie das Universum existiert.",
    machineHow: "Wie funktioniert sie?", machineHowText: "Jedes Zahnrad hat sechsmal so viele Zähne wie das vorige Ritzel. Dadurch wird jede Stufe sechsmal langsamer — nach wenigen Stufen dreht sich ein Rad schon so langsam, dass man über ein ganzes Menschenleben keine Bewegung sieht. Eine rote Markierung zeigt, wie weit sich jedes Rad seit dem Urknall gedreht hat.",
    machineTable: "Wie lange jedes Zahnrad für eine Umdrehung braucht", gear: "Zahnrad", oneTurn: "Eine Umdrehung",
    machineFact: "Ab Zahnrad 18 dauert eine einzige Umdrehung länger, als es den Homo sapiens gibt (rund 300.000 Jahre).", machineOpen: "Maschine live in 3D ansehen",
    sec: "Sekunden", min: "Minuten", hours: "Stunden", days: "Tage", years: "Jahre", thousandYears: "Tsd. Jahre", millionYears: "Mio. Jahre", billionYears: "Mrd. Jahre",
  },
  en: {
    crumbHome: "Centaurian", crumbSolar: "Solar system", bodyTitle: "{name} — Facts, Size & Distance from Earth Today",
    bodyDesc: "{name}: diameter {diameter}, distance from the Sun {distance}, orbital period, moons and its live distance from Earth — with an interactive 3D solar system.",
    liveDist: "Distance from Earth right now", liveHint: "calculated live from orbital data (NASA/JPL)", open3d: "View in the 3D solar system", wiki: "{name} on Wikipedia",
    others: "More celestial bodies", solarTitle: "Solar System — All Planets & Dwarf Planets with Facts",
    solarDesc: "All planets, dwarf planets, the Sun and Voyager 1: size, distance, orbital period, moons and the current distance from Earth — plus an interactive 3D solar system.",
    solarIntro: "Every body in our interactive 3D solar system — with real values and the distance from Earth, calculated live.",
    credit: "Orbital data: NASA/JPL Horizons. Photos: Wikimedia Commons.", au: "AU", millionKm: "million km",
    machineTitle: "The Eternity Machine — a Gear That Turns Once in 13.8 Billion Years",
    machineDesc: "A chain of gears, each six times slower than the one before: the first turns in 3 seconds, the last needs 13.8 billion years — the age of the universe. Live in 3D.",
    machineH1: "The Eternity Machine",
    machineIntro: "A 3D machine of gears that has symbolically been running since the Big Bang. Each gear drives the next one — but six times slower. The first turns in about 3 seconds; the last needs 13.8 billion years for a single turn: as long as the universe has existed.",
    machineHow: "How does it work?", machineHowText: "Every gear has six times as many teeth as the pinion before it, so each stage turns six times slower. After only a few stages a gear moves so slowly that you would see no motion in a whole human lifetime. A red marker shows how far each gear has turned since the Big Bang.",
    machineTable: "How long each gear takes for one turn", gear: "Gear", oneTurn: "One turn",
    machineFact: "From gear 18 on, a single turn takes longer than Homo sapiens has existed (about 300,000 years).", machineOpen: "Watch the machine live in 3D",
    sec: "seconds", min: "minutes", hours: "hours", days: "days", years: "years", thousandYears: "thousand years", millionYears: "million years", billionYears: "billion years",
  },
  es: {
    crumbHome: "Centaurian", crumbSolar: "Sistema solar", bodyTitle: "{name}: datos, tamaño y distancia a la Tierra hoy",
    bodyDesc: "{name}: diámetro {diameter}, distancia al Sol {distance}, período orbital, lunas y su distancia a la Tierra en vivo, con un sistema solar 3D interactivo.",
    liveDist: "Distancia a la Tierra ahora", liveHint: "calculada en vivo con datos orbitales (NASA/JPL)", open3d: "Ver en el sistema solar 3D", wiki: "{name} en Wikipedia",
    others: "Más cuerpos celestes", solarTitle: "Sistema solar: todos los planetas y planetas enanos",
    solarDesc: "Todos los planetas, planetas enanos, el Sol y la Voyager 1: tamaño, distancia, período orbital, lunas y distancia actual a la Tierra, con un sistema solar 3D interactivo.",
    solarIntro: "Todos los cuerpos de nuestro sistema solar 3D interactivo, con valores reales y la distancia a la Tierra calculada en vivo.",
    credit: "Datos orbitales: NASA/JPL Horizons. Fotos: Wikimedia Commons.", au: "UA", millionKm: "millones de km",
    machineTitle: "La máquina de la eternidad: un engranaje que gira una vez cada 13 800 millones de años",
    machineDesc: "Una cadena de engranajes, cada uno seis veces más lento que el anterior: el primero gira en 3 segundos y el último tarda 13 800 millones de años, la edad del universo. En vivo y en 3D.",
    machineH1: "La máquina de la eternidad",
    machineIntro: "Una máquina 3D de engranajes que funciona simbólicamente desde el Big Bang. Cada engranaje mueve al siguiente, pero seis veces más lento. El primero gira en unos 3 segundos; el último necesita 13 800 millones de años para una sola vuelta: lo que lleva existiendo el universo.",
    machineHow: "¿Cómo funciona?", machineHowText: "Cada engranaje tiene seis veces más dientes que el piñón anterior, así que cada etapa gira seis veces más lento. Tras pocas etapas, un engranaje se mueve tan despacio que no verías movimiento en toda una vida. Una marca roja muestra cuánto ha girado cada engranaje desde el Big Bang.",
    machineTable: "Cuánto tarda cada engranaje en dar una vuelta", gear: "Engranaje", oneTurn: "Una vuelta",
    machineFact: "A partir del engranaje 18, una sola vuelta dura más de lo que existe el Homo sapiens (unos 300 000 años).", machineOpen: "Ver la máquina en vivo en 3D",
    sec: "segundos", min: "minutos", hours: "horas", days: "días", years: "años", thousandYears: "mil años", millionYears: "millones de años", billionYears: "mil millones de años",
  },
  fr: {
    crumbHome: "Centaurian", crumbSolar: "Système solaire", bodyTitle: "{name} : faits, taille et distance à la Terre aujourd'hui",
    bodyDesc: "{name} : diamètre {diameter}, distance au Soleil {distance}, période orbitale, lunes et distance à la Terre en direct — avec un système solaire 3D interactif.",
    liveDist: "Distance à la Terre maintenant", liveHint: "calculée en direct à partir des données orbitales (NASA/JPL)", open3d: "Voir dans le système solaire 3D", wiki: "{name} sur Wikipédia",
    others: "Autres corps célestes", solarTitle: "Système solaire : toutes les planètes et planètes naines",
    solarDesc: "Toutes les planètes, les planètes naines, le Soleil et Voyager 1 : taille, distance, période orbitale, lunes et distance actuelle à la Terre — avec un système solaire 3D interactif.",
    solarIntro: "Tous les corps de notre système solaire 3D interactif — avec de vraies valeurs et la distance à la Terre calculée en direct.",
    credit: "Données orbitales : NASA/JPL Horizons. Photos : Wikimedia Commons.", au: "ua", millionKm: "millions de km",
    machineTitle: "La machine de l'éternité : un engrenage qui fait un tour en 13,8 milliards d'années",
    machineDesc: "Une chaîne d'engrenages, chacun six fois plus lent que le précédent : le premier tourne en 3 secondes, le dernier met 13,8 milliards d'années — l'âge de l'univers. En direct, en 3D.",
    machineH1: "La machine de l'éternité",
    machineIntro: "Une machine 3D d'engrenages qui tourne symboliquement depuis le Big Bang. Chaque engrenage entraîne le suivant — mais six fois plus lentement. Le premier tourne en environ 3 secondes ; le dernier met 13,8 milliards d'années pour un seul tour : l'âge de l'univers.",
    machineHow: "Comment ça marche ?", machineHowText: "Chaque engrenage a six fois plus de dents que le pignon précédent : chaque étage tourne donc six fois plus lentement. Après quelques étages, une roue bouge si lentement qu'on ne verrait aucun mouvement en une vie entière. Un repère rouge montre de combien chaque roue a tourné depuis le Big Bang.",
    machineTable: "Durée d'un tour pour chaque engrenage", gear: "Engrenage", oneTurn: "Un tour",
    machineFact: "À partir de l'engrenage 18, un seul tour dure plus longtemps que l'existence d'Homo sapiens (environ 300 000 ans).", machineOpen: "Voir la machine en direct en 3D",
    sec: "secondes", min: "minutes", hours: "heures", days: "jours", years: "ans", thousandYears: "mille ans", millionYears: "millions d'années", billionYears: "milliards d'années",
  },
  pt: {
    crumbHome: "Centaurian", crumbSolar: "Sistema solar", bodyTitle: "{name}: fatos, tamanho e distância da Terra hoje",
    bodyDesc: "{name}: diâmetro {diameter}, distância ao Sol {distance}, período orbital, luas e sua distância da Terra ao vivo — com um sistema solar 3D interativo.",
    liveDist: "Distância da Terra agora", liveHint: "calculada ao vivo com dados orbitais (NASA/JPL)", open3d: "Ver no sistema solar 3D", wiki: "{name} na Wikipédia",
    others: "Mais corpos celestes", solarTitle: "Sistema solar: todos os planetas e planetas anões",
    solarDesc: "Todos os planetas, planetas anões, o Sol e a Voyager 1: tamanho, distância, período orbital, luas e a distância atual da Terra — com um sistema solar 3D interativo.",
    solarIntro: "Todos os corpos do nosso sistema solar 3D interativo — com valores reais e a distância da Terra calculada ao vivo.",
    credit: "Dados orbitais: NASA/JPL Horizons. Fotos: Wikimedia Commons.", au: "UA", millionKm: "milhões de km",
    machineTitle: "A máquina da eternidade: uma engrenagem que gira uma vez a cada 13,8 bilhões de anos",
    machineDesc: "Uma cadeia de engrenagens, cada uma seis vezes mais lenta que a anterior: a primeira gira em 3 segundos, a última leva 13,8 bilhões de anos — a idade do universo. Ao vivo em 3D.",
    machineH1: "A máquina da eternidade",
    machineIntro: "Uma máquina 3D de engrenagens que funciona simbolicamente desde o Big Bang. Cada engrenagem move a próxima — mas seis vezes mais devagar. A primeira gira em cerca de 3 segundos; a última precisa de 13,8 bilhões de anos para uma única volta: a idade do universo.",
    machineHow: "Como funciona?", machineHowText: "Cada engrenagem tem seis vezes mais dentes que o pinhão anterior, então cada estágio gira seis vezes mais devagar. Depois de poucos estágios, uma roda se move tão devagar que não se veria movimento numa vida inteira. Uma marca vermelha mostra quanto cada roda girou desde o Big Bang.",
    machineTable: "Quanto tempo cada engrenagem leva para dar uma volta", gear: "Engrenagem", oneTurn: "Uma volta",
    machineFact: "A partir da engrenagem 18, uma única volta dura mais do que a existência do Homo sapiens (cerca de 300 mil anos).", machineOpen: "Ver a máquina ao vivo em 3D",
    sec: "segundos", min: "minutos", hours: "horas", days: "dias", years: "anos", thousandYears: "mil anos", millionYears: "milhões de anos", billionYears: "bilhões de anos",
  },
  tr: {
    crumbHome: "Centaurian", crumbSolar: "Güneş sistemi", bodyTitle: "{name}: bilgiler, büyüklük ve bugün Dünya'ya uzaklık",
    bodyDesc: "{name}: çap {diameter}, Güneş'e uzaklık {distance}, yörünge süresi, uydular ve Dünya'ya canlı uzaklık — etkileşimli 3B güneş sistemi ile.",
    liveDist: "Şu an Dünya'ya uzaklık", liveHint: "yörünge verilerinden canlı hesaplanır (NASA/JPL)", open3d: "3B güneş sisteminde gör", wiki: "Vikipedi'de {name}",
    others: "Diğer gök cisimleri", solarTitle: "Güneş sistemi: tüm gezegenler ve cüce gezegenler",
    solarDesc: "Tüm gezegenler, cüce gezegenler, Güneş ve Voyager 1: büyüklük, uzaklık, yörünge süresi, uydular ve Dünya'ya güncel uzaklık — etkileşimli 3B güneş sistemi ile.",
    solarIntro: "Etkileşimli 3B güneş sistemimizdeki tüm gök cisimleri — gerçek değerler ve canlı hesaplanan Dünya'ya uzaklık ile.",
    credit: "Yörünge verileri: NASA/JPL Horizons. Fotoğraflar: Wikimedia Commons.", au: "AB", millionKm: "milyon km",
    machineTitle: "Sonsuzluk Makinesi: 13,8 milyar yılda bir dönen dişli",
    machineDesc: "Her biri bir öncekinden altı kat yavaş dönen dişlilerden oluşan bir zincir: ilki 3 saniyede döner, sonuncusu 13,8 milyar yıl sürer — evrenin yaşı. Canlı ve 3B.",
    machineH1: "Sonsuzluk Makinesi",
    machineIntro: "Sembolik olarak Büyük Patlama'dan beri çalışan 3B bir dişli makinesi. Her dişli bir sonrakini döndürür — ama altı kat daha yavaş. İlki yaklaşık 3 saniyede döner; sonuncusu tek bir tur için 13,8 milyar yıl ister: evren bu kadar zamandır var.",
    machineHow: "Nasıl çalışır?", machineHowText: "Her dişlinin diş sayısı önceki pinyonun altı katıdır; bu yüzden her kademe altı kat yavaş döner. Birkaç kademe sonra bir dişli o kadar yavaşlar ki bir insan ömrü boyunca hiç hareket görmezsin. Kırmızı bir işaret, her dişlinin Büyük Patlama'dan beri ne kadar döndüğünü gösterir.",
    machineTable: "Her dişlinin bir tur için gereken süresi", gear: "Dişli", oneTurn: "Bir tur",
    machineFact: "18. dişliden itibaren tek bir tur, Homo sapiens'in var olduğu süreden (yaklaşık 300.000 yıl) daha uzun sürer.", machineOpen: "Makineyi canlı 3B izle",
    sec: "saniye", min: "dakika", hours: "saat", days: "gün", years: "yıl", thousandYears: "bin yıl", millionYears: "milyon yıl", billionYears: "milyar yıl",
  },
  ru: {
    crumbHome: "Centaurian", crumbSolar: "Солнечная система", bodyTitle: "{name}: факты, размер и расстояние до Земли сегодня",
    bodyDesc: "{name}: диаметр {diameter}, расстояние до Солнца {distance}, период обращения, спутники и расстояние до Земли в реальном времени — с интерактивной 3D-моделью Солнечной системы.",
    liveDist: "Расстояние до Земли сейчас", liveHint: "рассчитано в реальном времени по орбитальным данным (NASA/JPL)", open3d: "Смотреть в 3D Солнечной системе", wiki: "{name} в Википедии",
    others: "Другие небесные тела", solarTitle: "Солнечная система: все планеты и карликовые планеты",
    solarDesc: "Все планеты, карликовые планеты, Солнце и «Вояджер-1»: размер, расстояние, период обращения, спутники и текущее расстояние до Земли — и интерактивная 3D-модель.",
    solarIntro: "Все тела нашей интерактивной 3D-модели Солнечной системы — с реальными значениями и расстоянием до Земли в реальном времени.",
    credit: "Орбитальные данные: NASA/JPL Horizons. Фото: Wikimedia Commons.", au: "а.е.", millionKm: "млн км",
    machineTitle: "Машина вечности — шестерня, делающая один оборот за 13,8 млрд лет",
    machineDesc: "Цепочка шестерней, каждая в шесть раз медленнее предыдущей: первая оборачивается за 3 секунды, последняя — за 13,8 млрд лет, возраст Вселенной. Вживую в 3D.",
    machineH1: "Машина вечности",
    machineIntro: "3D-машина из шестерней, символически работающая со времён Большого взрыва. Каждая шестерня вращает следующую — но в шесть раз медленнее. Первая делает оборот примерно за 3 секунды; последней нужно 13,8 млрд лет на один оборот — столько существует Вселенная.",
    machineHow: "Как это работает?", machineHowText: "У каждой шестерни в шесть раз больше зубьев, чем у предыдущей, поэтому каждая ступень вращается в шесть раз медленнее. Уже через несколько ступеней колесо движется так медленно, что за всю жизнь не заметишь движения. Красная метка показывает, насколько повернулась каждая шестерня с Большого взрыва.",
    machineTable: "Сколько времени нужно каждой шестерне на один оборот", gear: "Шестерня", oneTurn: "Один оборот",
    machineFact: "Начиная с 18-й шестерни один оборот длится дольше, чем существует Homo sapiens (около 300 000 лет).", machineOpen: "Смотреть машину вживую в 3D",
    sec: "секунд", min: "минут", hours: "часов", days: "дней", years: "лет", thousandYears: "тыс. лет", millionYears: "млн лет", billionYears: "млрд лет",
  },
  el: {
    crumbHome: "Centaurian", crumbSolar: "Ηλιακό σύστημα", bodyTitle: "{name}: στοιχεία, μέγεθος και απόσταση από τη Γη σήμερα",
    bodyDesc: "{name}: διάμετρος {diameter}, απόσταση από τον Ήλιο {distance}, περίοδος περιφοράς, δορυφόροι και ζωντανή απόσταση από τη Γη — με διαδραστικό ηλιακό σύστημα 3D.",
    liveDist: "Απόσταση από τη Γη τώρα", liveHint: "υπολογίζεται ζωντανά από τροχιακά δεδομένα (NASA/JPL)", open3d: "Δες στο ηλιακό σύστημα 3D", wiki: "{name} στη Βικιπαίδεια",
    others: "Άλλα ουράνια σώματα", solarTitle: "Ηλιακό σύστημα: όλοι οι πλανήτες και οι νάνοι πλανήτες",
    solarDesc: "Όλοι οι πλανήτες, οι νάνοι πλανήτες, ο Ήλιος και το Voyager 1: μέγεθος, απόσταση, περίοδος, δορυφόροι και τρέχουσα απόσταση από τη Γη — με διαδραστικό ηλιακό σύστημα 3D.",
    solarIntro: "Όλα τα σώματα του διαδραστικού ηλιακού μας συστήματος 3D — με πραγματικές τιμές και ζωντανή απόσταση από τη Γη.",
    credit: "Τροχιακά δεδομένα: NASA/JPL Horizons. Φωτογραφίες: Wikimedia Commons.", au: "ΑΜ", millionKm: "εκατ. km",
    machineTitle: "Η Μηχανή της Αιωνιότητας — ένα γρανάζι που κάνει μία στροφή σε 13,8 δισ. χρόνια",
    machineDesc: "Μια αλυσίδα γραναζιών, το καθένα έξι φορές πιο αργό από το προηγούμενο: το πρώτο γυρίζει σε 3 δευτερόλεπτα, το τελευταίο χρειάζεται 13,8 δισ. χρόνια — την ηλικία του σύμπαντος. Ζωντανά σε 3D.",
    machineH1: "Η Μηχανή της Αιωνιότητας",
    machineIntro: "Μια μηχανή γραναζιών 3D που λειτουργεί συμβολικά από τη Μεγάλη Έκρηξη. Κάθε γρανάζι κινεί το επόμενο — αλλά έξι φορές πιο αργά. Το πρώτο γυρίζει σε περίπου 3 δευτερόλεπτα· το τελευταίο χρειάζεται 13,8 δισ. χρόνια για μία στροφή: όσο υπάρχει το σύμπαν.",
    machineHow: "Πώς λειτουργεί;", machineHowText: "Κάθε γρανάζι έχει έξι φορές περισσότερα δόντια από το προηγούμενο, οπότε κάθε βαθμίδα γυρίζει έξι φορές πιο αργά. Μετά από λίγες βαθμίδες ένας τροχός κινείται τόσο αργά που δεν θα έβλεπες κίνηση σε μια ολόκληρη ζωή. Ένα κόκκινο σημάδι δείχνει πόσο έχει γυρίσει κάθε γρανάζι από τη Μεγάλη Έκρηξη.",
    machineTable: "Πόσο χρειάζεται κάθε γρανάζι για μία στροφή", gear: "Γρανάζι", oneTurn: "Μία στροφή",
    machineFact: "Από το 18ο γρανάζι και μετά, μία μόνο στροφή διαρκεί περισσότερο απ’ όσο υπάρχει ο Homo sapiens (περίπου 300.000 χρόνια).", machineOpen: "Δες τη μηχανή ζωντανά σε 3D",
    sec: "δευτερόλεπτα", min: "λεπτά", hours: "ώρες", days: "ημέρες", years: "χρόνια", thousandYears: "χιλ. χρόνια", millionYears: "εκατ. χρόνια", billionYears: "δισ. χρόνια",
  },
  ar: {
    crumbHome: "Centaurian", crumbSolar: "المجموعة الشمسية", bodyTitle: "{name} — حقائق والحجم والمسافة من الأرض اليوم",
    bodyDesc: "{name}: القطر {diameter}، المسافة من الشمس {distance}، الفترة المدارية، الأقمار والمسافة من الأرض مباشرة — مع مجموعة شمسية تفاعلية ثلاثية الأبعاد.",
    liveDist: "المسافة من الأرض الآن", liveHint: "محسوبة مباشرة من البيانات المدارية (ناسا/JPL)", open3d: "عرض في المجموعة الشمسية ثلاثية الأبعاد", wiki: "{name} في ويكيبيديا",
    others: "أجرام سماوية أخرى", solarTitle: "المجموعة الشمسية — كل الكواكب والكواكب القزمة",
    solarDesc: "كل الكواكب والكواكب القزمة والشمس وفوييجر 1: الحجم والمسافة والفترة المدارية والأقمار والمسافة الحالية من الأرض — مع مجموعة شمسية تفاعلية ثلاثية الأبعاد.",
    solarIntro: "كل أجرام مجموعتنا الشمسية التفاعلية ثلاثية الأبعاد — بقيم حقيقية ومسافة من الأرض محسوبة مباشرة.",
    credit: "البيانات المدارية: NASA/JPL Horizons. الصور: Wikimedia Commons.", au: "و.ف", millionKm: "مليون كم",
    machineTitle: "آلة الأبدية — ترس يدور مرة واحدة كل 13.8 مليار سنة",
    machineDesc: "سلسلة من التروس، كل واحد أبطأ ست مرات من سابقه: الأول يدور في 3 ثوانٍ، والأخير يحتاج 13.8 مليار سنة — عمر الكون. مباشرة وبالأبعاد الثلاثية.",
    machineH1: "آلة الأبدية",
    machineIntro: "آلة تروس ثلاثية الأبعاد تعمل رمزياً منذ الانفجار العظيم. كل ترس يحرّك التالي — لكن أبطأ ست مرات. الأول يدور في نحو 3 ثوانٍ، والأخير يحتاج 13.8 مليار سنة لدورة واحدة: عمر الكون.",
    machineHow: "كيف تعمل؟", machineHowText: "لكل ترس ستة أضعاف عدد أسنان الترس الذي قبله، لذا تدور كل مرحلة أبطأ ست مرات. بعد مراحل قليلة يصبح الترس بطيئاً لدرجة أنك لن ترى أي حركة طوال حياتك. تُظهر علامة حمراء مقدار دوران كل ترس منذ الانفجار العظيم.",
    machineTable: "الوقت الذي يحتاجه كل ترس لدورة واحدة", gear: "الترس", oneTurn: "دورة واحدة",
    machineFact: "ابتداءً من الترس 18، تستغرق دورة واحدة وقتاً أطول من عمر الإنسان العاقل (نحو 300 ألف سنة).", machineOpen: "شاهد الآلة مباشرة بالأبعاد الثلاثية",
    sec: "ثانية", min: "دقيقة", hours: "ساعة", days: "يوم", years: "سنة", thousandYears: "ألف سنة", millionYears: "مليون سنة", billionYears: "مليار سنة",
  },
  hi: {
    crumbHome: "Centaurian", crumbSolar: "सौरमंडल", bodyTitle: "{name} — तथ्य, आकार और आज पृथ्वी से दूरी",
    bodyDesc: "{name}: व्यास {diameter}, सूर्य से दूरी {distance}, परिक्रमा अवधि, उपग्रह और पृथ्वी से लाइव दूरी — इंटरैक्टिव 3D सौरमंडल के साथ।",
    liveDist: "अभी पृथ्वी से दूरी", liveHint: "कक्षा के आँकड़ों से लाइव गणना (NASA/JPL)", open3d: "3D सौरमंडल में देखें", wiki: "विकिपीडिया पर {name}",
    others: "अन्य खगोलीय पिंड", solarTitle: "सौरमंडल — सभी ग्रह और बौने ग्रह",
    solarDesc: "सभी ग्रह, बौने ग्रह, सूर्य और वॉयजर 1: आकार, दूरी, परिक्रमा अवधि, उपग्रह और पृथ्वी से मौजूदा दूरी — इंटरैक्टिव 3D सौरमंडल के साथ।",
    solarIntro: "हमारे इंटरैक्टिव 3D सौरमंडल के सभी पिंड — असली मानों और लाइव गणना की गई पृथ्वी से दूरी के साथ।",
    credit: "कक्षा डेटा: NASA/JPL Horizons। तस्वीरें: Wikimedia Commons।", au: "AU", millionKm: "मिलियन किमी",
    machineTitle: "अनंत काल की मशीन — 13.8 अरब साल में एक बार घूमने वाला गियर",
    machineDesc: "गियरों की एक श्रृंखला, हर एक पिछले से छह गुना धीमा: पहला 3 सेकंड में घूमता है, आख़िरी को 13.8 अरब साल लगते हैं — ब्रह्मांड की उम्र। लाइव 3D में।",
    machineH1: "अनंत काल की मशीन",
    machineIntro: "गियरों की एक 3D मशीन जो प्रतीकात्मक रूप से बिग बैंग से चल रही है। हर गियर अगले को घुमाता है — पर छह गुना धीमा। पहला लगभग 3 सेकंड में घूमता है; आख़िरी को एक चक्कर के लिए 13.8 अरब साल चाहिए: जितना पुराना ब्रह्मांड है।",
    machineHow: "यह कैसे काम करती है?", machineHowText: "हर गियर में पिछले पिनियन से छह गुना ज़्यादा दाँत हैं, इसलिए हर चरण छह गुना धीमा घूमता है। कुछ ही चरणों के बाद गियर इतना धीमा हो जाता है कि पूरी ज़िंदगी में कोई हरकत नहीं दिखेगी। एक लाल निशान दिखाता है कि बिग बैंग से हर गियर कितना घूमा है।",
    machineTable: "हर गियर को एक चक्कर में कितना समय लगता है", gear: "गियर", oneTurn: "एक चक्कर",
    machineFact: "गियर 18 से आगे, एक ही चक्कर में होमो सेपियन्स के अस्तित्व (लगभग 3 लाख वर्ष) से ज़्यादा समय लगता है।", machineOpen: "मशीन को लाइव 3D में देखें",
    sec: "सेकंड", min: "मिनट", hours: "घंटे", days: "दिन", years: "वर्ष", thousandYears: "हज़ार वर्ष", millionYears: "मिलियन वर्ष", billionYears: "अरब वर्ष",
  },
  zh: {
    crumbHome: "Centaurian", crumbSolar: "太阳系", bodyTitle: "{name}——资料、大小与今天和地球的距离",
    bodyDesc: "{name}：直径{diameter}，与太阳的距离{distance}，公转周期、卫星以及与地球的实时距离——附互动3D太阳系。",
    liveDist: "此刻与地球的距离", liveHint: "根据轨道数据实时计算（NASA/JPL）", open3d: "在3D太阳系中查看", wiki: "维基百科上的{name}",
    others: "更多天体", solarTitle: "太阳系——所有行星与矮行星资料",
    solarDesc: "所有行星、矮行星、太阳和旅行者1号：大小、距离、公转周期、卫星以及目前与地球的距离——附互动3D太阳系。",
    solarIntro: "我们互动3D太阳系中的所有天体——真实数据，并实时计算与地球的距离。",
    credit: "轨道数据：NASA/JPL Horizons。照片：Wikimedia Commons。", au: "天文单位", millionKm: "百万公里",
    machineTitle: "永恒机器——138亿年才转一圈的齿轮",
    machineDesc: "一串齿轮，每个都比前一个慢六倍：第一个3秒转一圈，最后一个需要138亿年——宇宙的年龄。实时3D呈现。",
    machineH1: "永恒机器",
    machineIntro: "一台象征性地自大爆炸以来一直运转的3D齿轮机器。每个齿轮带动下一个，但慢六倍。第一个约3秒转一圈；最后一个转一圈需要138亿年——宇宙存在的时间。",
    machineHow: "它是如何运作的？", machineHowText: "每个齿轮的齿数是前一个小齿轮的六倍，因此每一级都慢六倍。只需几级，齿轮就慢到一生都看不出转动。红色标记显示每个齿轮自大爆炸以来转了多少。",
    machineTable: "每个齿轮转一圈需要多长时间", gear: "齿轮", oneTurn: "转一圈",
    machineFact: "从第18个齿轮开始，转一圈的时间就超过了智人存在的历史（约30万年）。", machineOpen: "观看实时3D机器",
    sec: "秒", min: "分钟", hours: "小时", days: "天", years: "年", thousandYears: "千年", millionYears: "百万年", billionYears: "十亿年",
  },
  ja: {
    crumbHome: "Centaurian", crumbSolar: "太陽系", bodyTitle: "{name}——データ・大きさ・今日の地球からの距離",
    bodyDesc: "{name}：直径{diameter}、太陽からの距離{distance}、公転周期、衛星、そして地球からのリアルタイム距離——インタラクティブな3D太陽系付き。",
    liveDist: "現在の地球からの距離", liveHint: "軌道データからリアルタイム計算（NASA/JPL）", open3d: "3D太陽系で見る", wiki: "Wikipediaで{name}を見る",
    others: "ほかの天体", solarTitle: "太陽系——すべての惑星と準惑星のデータ",
    solarDesc: "すべての惑星、準惑星、太陽、ボイジャー1号：大きさ、距離、公転周期、衛星、そして現在の地球からの距離——インタラクティブな3D太陽系付き。",
    solarIntro: "インタラクティブ3D太陽系のすべての天体——実際の数値と、リアルタイムで計算した地球からの距離。",
    credit: "軌道データ：NASA/JPL Horizons。写真：Wikimedia Commons。", au: "AU", millionKm: "百万km",
    machineTitle: "永遠のマシン——138億年に一回転する歯車",
    machineDesc: "歯車の連なり。一つ前より6倍ゆっくり回り、最初は3秒で一回転、最後は138億年——宇宙の年齢。リアルタイム3Dで。",
    machineH1: "永遠のマシン",
    machineIntro: "ビッグバン以来、象徴的に動き続ける3Dの歯車マシン。各歯車は次の歯車を回しますが、6倍ゆっくり。最初は約3秒で一回転、最後の歯車は一回転に138億年——宇宙が存在してきた時間です。",
    machineHow: "仕組み", machineHowText: "各歯車は前のピニオンの6倍の歯を持つため、段ごとに6倍ゆっくり回ります。数段で、人の一生では動きが見えないほど遅くなります。赤い印は、ビッグバン以来それぞれの歯車がどれだけ回ったかを示します。",
    machineTable: "各歯車が一回転するのにかかる時間", gear: "歯車", oneTurn: "一回転",
    machineFact: "18番目以降の歯車は、一回転にホモ・サピエンスの歴史（約30万年）より長い時間がかかります。", machineOpen: "マシンをリアルタイム3Dで見る",
    sec: "秒", min: "分", hours: "時間", days: "日", years: "年", thousandYears: "千年", millionYears: "百万年", billionYears: "十億年",
  },
  ko: {
    crumbHome: "Centaurian", crumbSolar: "태양계", bodyTitle: "{name} — 정보, 크기, 오늘 지구와의 거리",
    bodyDesc: "{name}: 지름 {diameter}, 태양과의 거리 {distance}, 공전 주기, 위성, 지구와의 실시간 거리 — 인터랙티브 3D 태양계와 함께.",
    liveDist: "지금 지구와의 거리", liveHint: "궤도 데이터로 실시간 계산 (NASA/JPL)", open3d: "3D 태양계에서 보기", wiki: "위키백과의 {name}",
    others: "다른 천체", solarTitle: "태양계 — 모든 행성과 왜소행성 정보",
    solarDesc: "모든 행성, 왜소행성, 태양, 보이저 1호: 크기, 거리, 공전 주기, 위성, 현재 지구와의 거리 — 인터랙티브 3D 태양계와 함께.",
    solarIntro: "인터랙티브 3D 태양계의 모든 천체 — 실제 값과 실시간으로 계산한 지구와의 거리.",
    credit: "궤도 데이터: NASA/JPL Horizons. 사진: Wikimedia Commons.", au: "AU", millionKm: "백만 km",
    machineTitle: "영원의 기계 — 138억 년에 한 번 도는 톱니바퀴",
    machineDesc: "앞의 것보다 6배씩 느린 톱니바퀴 사슬: 첫 번째는 3초에 한 바퀴, 마지막은 138억 년 — 우주의 나이. 실시간 3D로.",
    machineH1: "영원의 기계",
    machineIntro: "상징적으로 빅뱅 이후 계속 돌아가는 3D 톱니바퀴 기계. 각 톱니바퀴가 다음 것을 돌리지만 6배 느리게. 첫 번째는 약 3초에 한 바퀴, 마지막은 한 바퀴에 138억 년이 걸립니다: 우주가 존재해 온 시간입니다.",
    machineHow: "어떻게 작동하나요?", machineHowText: "각 톱니바퀴는 앞 피니언보다 톱니가 6배 많아서, 단계마다 6배씩 느려집니다. 몇 단계만 지나도 평생 움직임을 볼 수 없을 만큼 느려집니다. 빨간 표시는 빅뱅 이후 각 톱니바퀴가 얼마나 돌았는지 보여줍니다.",
    machineTable: "각 톱니바퀴가 한 바퀴 도는 데 걸리는 시간", gear: "톱니바퀴", oneTurn: "한 바퀴",
    machineFact: "18번째 톱니바퀴부터는 한 바퀴에 호모 사피엔스가 존재해 온 기간(약 30만 년)보다 더 오래 걸립니다.", machineOpen: "기계를 실시간 3D로 보기",
    sec: "초", min: "분", hours: "시간", days: "일", years: "년", thousandYears: "천 년", millionYears: "백만 년", billionYears: "십억 년",
  },
};

export function spaceTexts(lang: Lang): SpaceTexts {
  return T[lang];
}
