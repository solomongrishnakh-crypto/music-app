import type { Lang } from "@/contexts/LanguageContext";

/**
 * Texte der eigenen Weltraum-Rechner-Seite (/weltraum-rechner) in allen 13
 * Sprachen — Nutzerwunsch 16.10.2026: mehr Aufrufe über Suchmaschinen.
 * Der Rechner ist interaktiv (Google liest nur Text), deshalb stehen Titel,
 * Einleitung und FAQ als echter Text da. Zahlen: Schwerkraft Mond 1,62 m/s²
 * (16,5 % der Erde 9,8), Mars 3,7 (38 %), Jupiter 23,1 (2,4×); 70 kg → 12 / 26 /
 * 165 kg. Mars: geringster Abstand ≈ 54,6 Mio. km (Licht 3 min, Auto 100 km/h
 * ≈ 62 Jahre, Flugzeug 900 km/h ≈ 6,9 Jahre), größter ≈ 400 Mio. km (Licht 22 min).
 */
export interface ToolsPageText {
  title: string;
  desc: string;
  h1: string;
  intro: string;
  h2Tool: string;
  h2Faq: string;
  faq: [string, string][];
  keywords: string[];
  link: string;
}

export const TOOLS_PAGE: Record<Lang, ToolsPageText> = {
  de: {
    title: "Gewicht auf anderen Planeten & Reisezeit ins All berechnen",
    desc: "Rechne aus, wie viel du auf dem Mond, Mars oder Jupiter wiegst, wie alt du auf anderen Planeten bist und wie lange ein Flug zu Planeten, Sternen und Schwarzen Löchern dauert.",
    h1: "Weltraum-Rechner: Gewicht, Alter und Reisezeit im All",
    intro: "Wie viel würdest du auf dem Mond wiegen, wie alt wärst du auf dem Mars und wie lange dauert ein Flug zu den Sternen? Gib dein Gewicht und dein Geburtsdatum ein oder wähle ein Reiseziel und ein Tempo – der Rechner zeigt dir sofort Gewicht, Alter, Reisedauer und Ankunftsdatum. Die Entfernungen zu Mond und Planeten werden live aus den Bahndaten berechnet.",
    h2Tool: "Weltraum-Rechner",
    h2Faq: "Häufige Fragen",
    faq: [
      ["Wie viel wiege ich auf dem Mond, auf dem Mars und auf dem Jupiter?", "Auf dem Mond wiegst du nur etwa 16,5 % deines Gewichts, auf dem Mars etwa 38 % und auf dem Jupiter rund das 2,4-Fache. Mit 70 kg wären das etwa 12 kg auf dem Mond, 26 kg auf dem Mars und 165 kg auf dem Jupiter. Deine Masse bleibt gleich – nur die Schwerkraft ändert, was eine Waage anzeigt."],
      ["Wie lange dauert ein Flug zum Mars?", "Bei der kleinsten Entfernung von rund 55 Millionen km braucht Licht etwa 3 Minuten, bei der größten (rund 400 Millionen km) etwa 22 Minuten. Mit 100 km/h wie im Auto dauert es über 60 Jahre, mit einem Verkehrsflugzeug (900 km/h) knapp 7 Jahre. Echte Raumsonden fliegen etwa 6 bis 9 Monate."],
      ["Stimmen die Entfernungen im Rechner?", "Mond, Sonne und Planeten werden live aus den Bahndaten berechnet. Bei Sternen, Neutronenstern und Schwarzem Loch sind es gerundete Entfernungen der nächsten bekannten Beispiele (Sirius, PSR J0437, Gaia BH1). Die Reise ist eine Gerade bei konstantem Tempo – ohne Beschleunigen, Bremsen oder Umwege."],
    ],
    keywords: ["Gewicht auf anderen Planeten", "Gewicht auf dem Mond", "Alter auf dem Mars", "Flugzeit Mars", "Reisezeit Weltraum"],
    link: "Weltraum-Rechner",
  },
  en: {
    title: "Weight on Other Planets & Space Travel Time Calculator",
    desc: "Find out how much you weigh on the Moon, Mars or Jupiter, how old you are on other planets and how long a trip to planets, stars and black holes would take.",
    h1: "Space calculator: weight, age and travel time in space",
    intro: "How much would you weigh on the Moon, how old would you be on Mars and how long would it take to reach the stars? Enter your weight and date of birth, or pick a destination and a speed – the calculator instantly shows your weight, age, travel time and arrival date. Distances to the Moon and planets are calculated live from orbital data.",
    h2Tool: "Space calculator",
    h2Faq: "Frequently asked questions",
    faq: [
      ["How much would I weigh on the Moon, Mars and Jupiter?", "On the Moon you would weigh only about 16.5% of your Earth weight, on Mars about 38% and on Jupiter about 2.4 times as much. At 70 kg that is roughly 12 kg on the Moon, 26 kg on Mars and 165 kg on Jupiter. Your mass stays the same – only gravity changes what a scale shows."],
      ["How long does it take to travel to Mars?", "At the closest distance of about 55 million km, light needs about 3 minutes; at the farthest (about 400 million km) about 22 minutes. At 100 km/h, like a car, it would take over 60 years, and in an airliner (900 km/h) almost 7 years. Real spacecraft take about 6 to 9 months."],
      ["Are the distances in the calculator accurate?", "The Moon, Sun and planets are calculated live from orbital data. For stars, the neutron star and the black hole the distances are rounded values for the nearest known examples (Sirius, PSR J0437, Gaia BH1). The trip is a straight line at constant speed – no acceleration, braking or detours."],
    ],
    keywords: ["weight on other planets", "weight on the Moon", "age on Mars", "travel time to Mars", "space travel calculator"],
    link: "Space calculator",
  },
  es: {
    title: "Peso en otros planetas y calculadora de viajes espaciales",
    desc: "Calcula cuánto pesas en la Luna, Marte o Júpiter, qué edad tendrías en otros planetas y cuánto tardarías en llegar a planetas, estrellas y agujeros negros.",
    h1: "Calculadora espacial: peso, edad y tiempo de viaje",
    intro: "¿Cuánto pesarías en la Luna, qué edad tendrías en Marte y cuánto se tardaría en llegar a las estrellas? Introduce tu peso y tu fecha de nacimiento, o elige un destino y una velocidad: la calculadora muestra al instante tu peso, tu edad, la duración del viaje y la fecha de llegada. Las distancias a la Luna y los planetas se calculan en vivo con datos orbitales.",
    h2Tool: "Calculadora espacial",
    h2Faq: "Preguntas frecuentes",
    faq: [
      ["¿Cuánto pesaría en la Luna, en Marte y en Júpiter?", "En la Luna pesarías solo un 16,5 % de tu peso, en Marte un 38 % y en Júpiter unas 2,4 veces más. Con 70 kg serían unos 12 kg en la Luna, 26 kg en Marte y 165 kg en Júpiter. Tu masa no cambia: solo la gravedad cambia lo que marca una báscula."],
      ["¿Cuánto se tarda en viajar a Marte?", "A la distancia mínima, de unos 55 millones de km, la luz tarda unos 3 minutos; a la máxima (unos 400 millones de km), unos 22 minutos. A 100 km/h, como un coche, serían más de 60 años; en un avión comercial (900 km/h), casi 7 años. Las sondas reales tardan de 6 a 9 meses."],
      ["¿Son exactas las distancias de la calculadora?", "La Luna, el Sol y los planetas se calculan en vivo con datos orbitales. En las estrellas, la estrella de neutrones y el agujero negro son distancias redondeadas de los ejemplos conocidos más cercanos (Sirio, PSR J0437, Gaia BH1). El viaje es una línea recta a velocidad constante, sin aceleración, frenado ni desvíos."],
    ],
    keywords: ["peso en otros planetas", "peso en la Luna", "edad en Marte", "tiempo de viaje a Marte", "calculadora espacial"],
    link: "Calculadora espacial",
  },
  fr: {
    title: "Poids sur les autres planètes et calculateur de voyage spatial",
    desc: "Calcule ton poids sur la Lune, Mars ou Jupiter, ton âge sur les autres planètes et la durée d’un voyage vers les planètes, les étoiles et les trous noirs.",
    h1: "Calculateur spatial : poids, âge et durée du voyage",
    intro: "Combien pèserais-tu sur la Lune, quel âge aurais-tu sur Mars et combien de temps faudrait-il pour atteindre les étoiles ? Saisis ton poids et ta date de naissance, ou choisis une destination et une vitesse : le calculateur affiche aussitôt ton poids, ton âge, la durée du voyage et la date d’arrivée. Les distances vers la Lune et les planètes sont calculées en direct à partir des données orbitales.",
    h2Tool: "Calculateur spatial",
    h2Faq: "Questions fréquentes",
    faq: [
      ["Combien pèserais-je sur la Lune, sur Mars et sur Jupiter ?", "Sur la Lune, tu ne pèserais qu’environ 16,5 % de ton poids, sur Mars environ 38 % et sur Jupiter environ 2,4 fois plus. Avec 70 kg, cela ferait environ 12 kg sur la Lune, 26 kg sur Mars et 165 kg sur Jupiter. Ta masse reste la même : seule la gravité change ce qu’indique une balance."],
      ["Combien de temps dure un voyage vers Mars ?", "À la distance minimale, d’environ 55 millions de km, la lumière met environ 3 minutes ; à la distance maximale (environ 400 millions de km), environ 22 minutes. À 100 km/h, comme une voiture, il faudrait plus de 60 ans ; en avion de ligne (900 km/h), presque 7 ans. Les vraies sondes mettent de 6 à 9 mois."],
      ["Les distances du calculateur sont-elles exactes ?", "La Lune, le Soleil et les planètes sont calculés en direct à partir des données orbitales. Pour les étoiles, l’étoile à neutrons et le trou noir, ce sont des distances arrondies des exemples connus les plus proches (Sirius, PSR J0437, Gaia BH1). Le trajet est une ligne droite à vitesse constante, sans accélération, freinage ni détour."],
    ],
    keywords: ["poids sur les autres planètes", "poids sur la Lune", "âge sur Mars", "durée du voyage vers Mars", "calculateur spatial"],
    link: "Calculateur spatial",
  },
  pt: {
    title: "Peso em outros planetas e calculadora de viagem espacial",
    desc: "Calcule quanto você pesa na Lua, em Marte ou em Júpiter, que idade teria em outros planetas e quanto tempo levaria uma viagem a planetas, estrelas e buracos negros.",
    h1: "Calculadora espacial: peso, idade e tempo de viagem",
    intro: "Quanto você pesaria na Lua, que idade teria em Marte e quanto tempo levaria para chegar às estrelas? Digite seu peso e sua data de nascimento, ou escolha um destino e uma velocidade: a calculadora mostra na hora seu peso, sua idade, a duração da viagem e a data de chegada. As distâncias até a Lua e os planetas são calculadas ao vivo a partir de dados orbitais.",
    h2Tool: "Calculadora espacial",
    h2Faq: "Perguntas frequentes",
    faq: [
      ["Quanto eu pesaria na Lua, em Marte e em Júpiter?", "Na Lua você pesaria apenas cerca de 16,5 % do seu peso, em Marte cerca de 38 % e em Júpiter cerca de 2,4 vezes mais. Com 70 kg, seriam aproximadamente 12 kg na Lua, 26 kg em Marte e 165 kg em Júpiter. Sua massa continua a mesma: só a gravidade muda o que a balança mostra."],
      ["Quanto tempo leva uma viagem a Marte?", "Na menor distância, de cerca de 55 milhões de km, a luz leva uns 3 minutos; na maior (cerca de 400 milhões de km), uns 22 minutos. A 100 km/h, como um carro, seriam mais de 60 anos; num avião comercial (900 km/h), quase 7 anos. Sondas reais levam de 6 a 9 meses."],
      ["As distâncias da calculadora são exatas?", "A Lua, o Sol e os planetas são calculados ao vivo com dados orbitais. Para estrelas, estrela de nêutrons e buraco negro, são distâncias arredondadas dos exemplos conhecidos mais próximos (Sirius, PSR J0437, Gaia BH1). A viagem é uma linha reta em velocidade constante, sem aceleração, frenagem ou desvios."],
    ],
    keywords: ["peso em outros planetas", "peso na Lua", "idade em Marte", "tempo de viagem a Marte", "calculadora espacial"],
    link: "Calculadora espacial",
  },
  tr: {
    title: "Diğer gezegenlerde kilo ve uzay yolculuğu süresi hesaplayıcı",
    desc: "Ay’da, Mars’ta veya Jüpiter’de kaç kilo geleceğini, diğer gezegenlerde kaç yaşında olacağını ve gezegenlere, yıldızlara ve kara deliklere yolculuğun ne kadar süreceğini hesapla.",
    h1: "Uzay hesaplayıcı: kilo, yaş ve yolculuk süresi",
    intro: "Ay’da kaç kilo gelirdin, Mars’ta kaç yaşında olurdun ve yıldızlara ulaşmak ne kadar sürerdi? Kilonu ve doğum tarihini gir ya da bir hedef ve bir hız seç: hesaplayıcı kilonu, yaşını, yolculuk süresini ve varış tarihini hemen gösterir. Ay’a ve gezegenlere olan uzaklıklar yörünge verilerinden canlı hesaplanır.",
    h2Tool: "Uzay hesaplayıcı",
    h2Faq: "Sık sorulan sorular",
    faq: [
      ["Ay’da, Mars’ta ve Jüpiter’de kaç kilo gelirim?", "Ay’da kilonun yalnızca yaklaşık %16,5’i kadar, Mars’ta yaklaşık %38’i kadar, Jüpiter’de ise yaklaşık 2,4 katı kadar gelirsin. 70 kg için bu, Ay’da yaklaşık 12 kg, Mars’ta 26 kg ve Jüpiter’de 165 kg eder. Kütlen değişmez; terazinin gösterdiğini yalnızca yer çekimi değiştirir."],
      ["Mars’a yolculuk ne kadar sürer?", "Yaklaşık 55 milyon km’lik en kısa mesafede ışık yaklaşık 3 dakikada, en uzak mesafede (yaklaşık 400 milyon km) yaklaşık 22 dakikada ulaşır. Bir araba gibi 100 km/sa ile 60 yıldan fazla, bir yolcu uçağıyla (900 km/sa) yaklaşık 7 yıl sürer. Gerçek uzay araçları 6 ila 9 ayda gider."],
      ["Hesaplayıcıdaki uzaklıklar doğru mu?", "Ay, Güneş ve gezegenler yörünge verilerinden canlı hesaplanır. Yıldızlar, nötron yıldızı ve kara delik için bilinen en yakın örneklerin (Sirius, PSR J0437, Gaia BH1) yuvarlanmış uzaklıkları kullanılır. Yolculuk sabit hızda düz bir çizgidir; hızlanma, frenleme veya dolambaç yoktur."],
    ],
    keywords: ["diğer gezegenlerde kilo", "Ay’da kilo", "Mars’ta yaş", "Mars’a yolculuk süresi", "uzay hesaplayıcı"],
    link: "Uzay hesaplayıcı",
  },
  ru: {
    title: "Вес на других планетах и калькулятор космических полётов",
    desc: "Узнай, сколько ты весишь на Луне, Марсе или Юпитере, сколько тебе лет на других планетах и сколько длится полёт к планетам, звёздам и чёрным дырам.",
    h1: "Космический калькулятор: вес, возраст и время полёта",
    intro: "Сколько ты весил бы на Луне, сколько тебе было бы лет на Марсе и как долго лететь до звёзд? Введи свой вес и дату рождения или выбери цель и скорость — калькулятор сразу покажет вес, возраст, время в пути и дату прибытия. Расстояния до Луны и планет считаются в реальном времени по орбитальным данным.",
    h2Tool: "Космический калькулятор",
    h2Faq: "Частые вопросы",
    faq: [
      ["Сколько я буду весить на Луне, Марсе и Юпитере?", "На Луне ты весил бы всего около 16,5 % своего веса, на Марсе около 38 %, а на Юпитере примерно в 2,4 раза больше. При 70 кг это около 12 кг на Луне, 26 кг на Марсе и 165 кг на Юпитере. Твоя масса не меняется — меняется только сила тяжести, а с ней и показания весов."],
      ["Сколько лететь до Марса?", "При наименьшем расстоянии около 55 млн км свет идёт примерно 3 минуты, при наибольшем (около 400 млн км) — примерно 22 минуты. Со скоростью 100 км/ч, как у автомобиля, это больше 60 лет, на пассажирском самолёте (900 км/ч) — почти 7 лет. Настоящие космические аппараты летят от 6 до 9 месяцев."],
      ["Насколько точны расстояния в калькуляторе?", "Луна, Солнце и планеты считаются в реальном времени по орбитальным данным. Для звёзд, нейтронной звезды и чёрной дыры взяты округлённые расстояния до ближайших известных примеров (Сириус, PSR J0437, Gaia BH1). Полёт идёт по прямой с постоянной скоростью — без разгона, торможения и обходов."],
    ],
    keywords: ["вес на других планетах", "вес на Луне", "возраст на Марсе", "время полёта до Марса", "космический калькулятор"],
    link: "Космический калькулятор",
  },
  el: {
    title: "Βάρος σε άλλους πλανήτες & υπολογιστής διαστημικού ταξιδιού",
    desc: "Υπολόγισε πόσο ζυγίζεις στη Σελήνη, στον Άρη ή στον Δία, πόσο χρονών θα ήσουν σε άλλους πλανήτες και πόσο διαρκεί ένα ταξίδι σε πλανήτες, άστρα και μαύρες τρύπες.",
    h1: "Διαστημικός υπολογιστής: βάρος, ηλικία και διάρκεια ταξιδιού",
    intro: "Πόσο θα ζύγιζες στη Σελήνη, πόσο χρονών θα ήσουν στον Άρη και πόσο θα κρατούσε ένα ταξίδι ως τα άστρα; Γράψε το βάρος και την ημερομηνία γέννησής σου ή διάλεξε προορισμό και ταχύτητα: ο υπολογιστής δείχνει αμέσως βάρος, ηλικία, διάρκεια ταξιδιού και ημερομηνία άφιξης. Οι αποστάσεις προς τη Σελήνη και τους πλανήτες υπολογίζονται ζωντανά από τροχιακά δεδομένα.",
    h2Tool: "Διαστημικός υπολογιστής",
    h2Faq: "Συχνές ερωτήσεις",
    faq: [
      ["Πόσο θα ζύγιζα στη Σελήνη, στον Άρη και στον Δία;", "Στη Σελήνη θα ζύγιζες μόνο περίπου το 16,5 % του βάρους σου, στον Άρη περίπου το 38 % και στον Δία περίπου 2,4 φορές περισσότερο. Με 70 κιλά αυτό κάνει περίπου 12 κιλά στη Σελήνη, 26 στον Άρη και 165 στον Δία. Η μάζα σου μένει ίδια· μόνο η βαρύτητα αλλάζει όσα δείχνει η ζυγαριά."],
      ["Πόσο διαρκεί ένα ταξίδι στον Άρη;", "Στην ελάχιστη απόσταση, περίπου 55 εκατ. χλμ., το φως χρειάζεται περίπου 3 λεπτά· στη μέγιστη (περίπου 400 εκατ. χλμ.) περίπου 22 λεπτά. Με 100 χλμ./ώρα, όπως ένα αυτοκίνητο, θα χρειαζόταν πάνω από 60 χρόνια, με επιβατικό αεροπλάνο (900 χλμ./ώρα) σχεδόν 7 χρόνια. Τα πραγματικά διαστημικά σκάφη χρειάζονται 6 έως 9 μήνες."],
      ["Είναι ακριβείς οι αποστάσεις του υπολογιστή;", "Η Σελήνη, ο Ήλιος και οι πλανήτες υπολογίζονται ζωντανά από τροχιακά δεδομένα. Για τα άστρα, τον αστέρα νετρονίων και τη μαύρη τρύπα χρησιμοποιούνται στρογγυλεμένες αποστάσεις των κοντινότερων γνωστών παραδειγμάτων (Σείριος, PSR J0437, Gaia BH1). Το ταξίδι είναι ευθεία με σταθερή ταχύτητα, χωρίς επιτάχυνση, πέδηση ή παρακάμψεις."],
    ],
    keywords: ["βάρος σε άλλους πλανήτες", "βάρος στη Σελήνη", "ηλικία στον Άρη", "διάρκεια ταξιδιού στον Άρη", "διαστημικός υπολογιστής"],
    link: "Διαστημικός υπολογιστής",
  },
  ar: {
    title: "حاسبة الوزن على الكواكب الأخرى ومدة الرحلات الفضائية",
    desc: "احسب وزنك على القمر أو المريخ أو المشتري، وعمرك على الكواكب الأخرى، والمدة التي تستغرقها رحلة إلى الكواكب والنجوم والثقوب السوداء.",
    h1: "حاسبة الفضاء: الوزن والعمر ومدة الرحلة",
    intro: "كم سيكون وزنك على القمر، وكم سيكون عمرك على المريخ، وكم تستغرق الرحلة إلى النجوم؟ أدخل وزنك وتاريخ ميلادك، أو اختر وجهة وسرعة، وستعرض الحاسبة فورًا وزنك وعمرك ومدة الرحلة وتاريخ الوصول. تُحسب المسافات إلى القمر والكواكب مباشرةً من بيانات المدارات.",
    h2Tool: "حاسبة الفضاء",
    h2Faq: "أسئلة شائعة",
    faq: [
      ["كم سيكون وزني على القمر والمريخ والمشتري؟", "على القمر سيكون وزنك نحو 16.5% فقط من وزنك على الأرض، وعلى المريخ نحو 38%، وعلى المشتري نحو 2.4 ضعف. فبوزن 70 كغ يصبح وزنك نحو 12 كغ على القمر و26 كغ على المريخ و165 كغ على المشتري. كتلتك لا تتغير، والجاذبية وحدها تغيّر ما يُظهره الميزان."],
      ["كم تستغرق الرحلة إلى المريخ؟", "عند أقصر مسافة، نحو 55 مليون كم، يحتاج الضوء نحو 3 دقائق، وعند أبعد مسافة (نحو 400 مليون كم) نحو 22 دقيقة. بسرعة 100 كم/س مثل السيارة تستغرق أكثر من 60 عامًا، وبطائرة ركاب (900 كم/س) نحو 7 أعوام. أما المركبات الفضائية الحقيقية فتستغرق من 6 إلى 9 أشهر."],
      ["هل المسافات في الحاسبة دقيقة؟", "تُحسب مسافات القمر والشمس والكواكب مباشرةً من بيانات المدارات. أما النجوم والنجم النيوتروني والثقب الأسود فتُستخدم فيها مسافات تقريبية لأقرب الأمثلة المعروفة (الشعرى، PSR J0437، Gaia BH1). والرحلة خط مستقيم بسرعة ثابتة، دون تسارع أو فرملة أو التفاف."],
    ],
    keywords: ["الوزن على الكواكب الأخرى", "الوزن على القمر", "العمر على المريخ", "مدة الرحلة إلى المريخ", "حاسبة الفضاء"],
    link: "حاسبة الفضاء",
  },
  hi: {
    title: "दूसरे ग्रहों पर वज़न और अंतरिक्ष यात्रा समय कैलकुलेटर",
    desc: "जानिए चंद्रमा, मंगल या बृहस्पति पर आपका वज़न कितना होगा, दूसरे ग्रहों पर आपकी उम्र क्या होगी और ग्रहों, तारों व ब्लैक होल तक यात्रा में कितना समय लगेगा।",
    h1: "अंतरिक्ष कैलकुलेटर: वज़न, उम्र और यात्रा का समय",
    intro: "चंद्रमा पर आपका वज़न कितना होगा, मंगल पर आपकी उम्र क्या होगी और तारों तक पहुँचने में कितना समय लगेगा? अपना वज़न और जन्मतिथि डालें, या कोई गंतव्य और गति चुनें – कैलकुलेटर तुरंत वज़न, उम्र, यात्रा की अवधि और पहुँचने की तारीख़ दिखाता है। चंद्रमा और ग्रहों की दूरी कक्षीय आँकड़ों से लाइव निकाली जाती है।",
    h2Tool: "अंतरिक्ष कैलकुलेटर",
    h2Faq: "अक्सर पूछे जाने वाले सवाल",
    faq: [
      ["चंद्रमा, मंगल और बृहस्पति पर मेरा वज़न कितना होगा?", "चंद्रमा पर आपका वज़न लगभग 16.5%, मंगल पर लगभग 38% और बृहस्पति पर लगभग 2.4 गुना होगा। 70 किलो वज़न पर यह चंद्रमा पर करीब 12 किलो, मंगल पर 26 किलो और बृहस्पति पर 165 किलो बैठता है। आपका द्रव्यमान वही रहता है – केवल गुरुत्वाकर्षण बदलता है, जिससे तराज़ू का पाठ बदलता है।"],
      ["मंगल तक यात्रा में कितना समय लगता है?", "लगभग 5.5 करोड़ किमी की सबसे कम दूरी पर प्रकाश को करीब 3 मिनट लगते हैं, सबसे अधिक दूरी (लगभग 40 करोड़ किमी) पर करीब 22 मिनट। कार की तरह 100 किमी/घंटा पर 60 साल से ज़्यादा और यात्री विमान (900 किमी/घंटा) से लगभग 7 साल लगेंगे। असली अंतरिक्ष यान 6 से 9 महीने में पहुँचते हैं।"],
      ["क्या कैलकुलेटर की दूरियाँ सही हैं?", "चंद्रमा, सूर्य और ग्रहों की दूरी कक्षीय आँकड़ों से लाइव निकाली जाती है। तारों, न्यूट्रॉन तारे और ब्लैक होल के लिए निकटतम ज्ञात उदाहरणों (सिरियस, PSR J0437, Gaia BH1) की मोटी दूरियाँ ली गई हैं। यात्रा स्थिर गति से सीधी रेखा में मानी गई है – बिना तेज़ करने, रुकने या मोड़ के।"],
    ],
    keywords: ["दूसरे ग्रहों पर वज़न", "चंद्रमा पर वज़न", "मंगल पर उम्र", "मंगल यात्रा समय", "अंतरिक्ष कैलकुलेटर"],
    link: "अंतरिक्ष कैलकुलेटर",
  },
  zh: {
    title: "其他行星上的体重与太空旅行时间计算器",
    desc: "计算你在月球、火星或木星上的体重，在其他行星上的年龄，以及前往行星、恒星和黑洞需要多长时间。",
    h1: "太空计算器：体重、年龄与旅行时间",
    intro: "你在月球上有多重，在火星上几岁，飞到恒星要多久？输入你的体重和出生日期，或选择目的地和速度，计算器会立刻显示体重、年龄、旅行时长和到达日期。月球和行星的距离根据轨道数据实时计算。",
    h2Tool: "太空计算器",
    h2Faq: "常见问题",
    faq: [
      ["我在月球、火星和木星上有多重？", "在月球上你的体重只有约 16.5%，在火星上约 38%，在木星上约为 2.4 倍。以 70 公斤为例，月球上约 12 公斤，火星上约 26 公斤，木星上约 165 公斤。你的质量不变，只是重力改变了秤上的读数。"],
      ["飞往火星需要多久？", "在约 5500 万公里的最近距离时，光约需 3 分钟；在最远距离（约 4 亿公里）时约需 22 分钟。以汽车般的 100 公里/小时需要 60 多年，乘坐客机（900 公里/小时）将近 7 年。真实的航天探测器需要 6 到 9 个月。"],
      ["计算器里的距离准确吗？", "月球、太阳和行星的距离根据轨道数据实时计算。恒星、中子星和黑洞使用的是最近已知例子（天狼星、PSR J0437、Gaia BH1）的近似距离。旅程按恒定速度走直线，不含加速、减速或绕行。"],
    ],
    keywords: ["其他行星上的体重", "月球上的体重", "火星上的年龄", "飞往火星需要多久", "太空计算器"],
    link: "太空计算器",
  },
  ja: {
    title: "他の惑星での体重と宇宙旅行時間の計算ツール",
    desc: "月・火星・木星での体重、他の惑星での年齢、惑星や恒星、ブラックホールまでの所要時間を計算できます。",
    h1: "宇宙計算ツール：体重・年齢・旅行時間",
    intro: "月では体重はどれくらい？火星では何歳？星まではどれくらいかかる？体重と生年月日を入力するか、行き先と速さを選ぶと、体重・年齢・所要時間・到着日がすぐにわかります。月や惑星までの距離は軌道データからリアルタイムで計算されます。",
    h2Tool: "宇宙計算ツール",
    h2Faq: "よくある質問",
    faq: [
      ["月・火星・木星での体重はどれくらい？", "月では体重は約16.5％、火星では約38％、木星では約2.4倍になります。70kgの場合、月で約12kg、火星で約26kg、木星で約165kgです。質量は変わらず、重力の違いで体重計の表示が変わります。"],
      ["火星までどれくらいかかる？", "最も近い約5500万kmのとき、光で約3分、最も遠い約4億kmのときは約22分です。車のような時速100kmなら60年以上、旅客機（時速900km）で約7年かかります。実際の探査機は6〜9か月ほどです。"],
      ["計算ツールの距離は正確？", "月・太陽・惑星の距離は軌道データからリアルタイムで計算しています。恒星・中性子星・ブラックホールは、最も近い既知の例（シリウス、PSR J0437、Gaia BH1）のおおよその距離です。旅は一定の速さでの直線で、加速・減速・寄り道は考慮していません。"],
    ],
    keywords: ["他の惑星での体重", "月での体重", "火星での年齢", "火星までの所要時間", "宇宙計算ツール"],
    link: "宇宙計算ツール",
  },
  ko: {
    title: "다른 행성에서의 몸무게와 우주여행 시간 계산기",
    desc: "달, 화성, 목성에서의 몸무게와 다른 행성에서의 나이, 행성·별·블랙홀까지 가는 데 걸리는 시간을 계산해 보세요.",
    h1: "우주 계산기: 몸무게, 나이, 여행 시간",
    intro: "달에서는 몸무게가 얼마일까, 화성에서는 몇 살일까, 별까지 가려면 얼마나 걸릴까? 몸무게와 생년월일을 입력하거나 목적지와 속도를 고르면 몸무게, 나이, 여행 시간, 도착 날짜를 바로 보여 줍니다. 달과 행성까지의 거리는 궤도 데이터로 실시간 계산됩니다.",
    h2Tool: "우주 계산기",
    h2Faq: "자주 묻는 질문",
    faq: [
      ["달, 화성, 목성에서 내 몸무게는 얼마일까요?", "달에서는 몸무게가 약 16.5%, 화성에서는 약 38%, 목성에서는 약 2.4배가 됩니다. 70kg이라면 달에서 약 12kg, 화성에서 약 26kg, 목성에서 약 165kg입니다. 질량은 그대로이고 중력만 달라져 저울 눈금이 바뀝니다."],
      ["화성까지 가는 데 얼마나 걸리나요?", "가장 가까운 약 5500만 km일 때 빛은 약 3분, 가장 먼 약 4억 km일 때는 약 22분 걸립니다. 자동차처럼 시속 100km면 60년이 넘고, 여객기(시속 900km)로는 약 7년이 걸립니다. 실제 탐사선은 6~9개월 걸립니다."],
      ["계산기의 거리는 정확한가요?", "달, 태양, 행성의 거리는 궤도 데이터로 실시간 계산합니다. 별, 중성자별, 블랙홀은 가장 가까운 알려진 사례(시리우스, PSR J0437, Gaia BH1)의 대략적인 거리입니다. 여행은 일정한 속도의 직선이며 가속, 감속, 우회는 고려하지 않습니다."],
    ],
    keywords: ["다른 행성 몸무게", "달에서의 몸무게", "화성에서의 나이", "화성 여행 시간", "우주 계산기"],
    link: "우주 계산기",
  },
};
