import type { Lang } from "@/contexts/LanguageContext";

/**
 * Zusatzinhalte der Seite "Maschine der Ewigkeit" (Nutzerwunsch 09.10.2026:
 * "diese Maschine soll für jeden kommen, wenn jemand nach ähnlichen Sachen
 * sucht, z. B. dass ein Rad das andere langsamer bewegt") — Erklärung der
 * Untersetzung, Rechner, ähnliche berühmte Maschinen und Fragen & Antworten
 * in 13 Sprachen. Fakten zu Arthur Gansons "Machine with Concrete"
 * (12 Stufen à 1:50, Motor 200 U/min, letztes Rad in Beton) und zur
 * "Clock of the Long Now" (10.000 Jahre) sind öffentlich dokumentiert.
 */
export interface MachineTexts {
  h2Reduction: string;
  pReduction: string;
  formula: string;
  h2Calc: string;
  pCalc: string;
  calcFirst: string;
  calcRatio: string;
  calcGears: string;
  calcLast: string;
  calcTotal: string;
  calcAgeOfUniverse: string; // {x}
  h2Similar: string;
  pGanson: string;
  pLongNow: string;
  h2Faq: string;
  faq: [string, string][];
  keywords: string[];
}

const T: Record<Lang, MachineTexts> = {
  de: {
    h2Reduction: "Wie ein Zahnrad das nächste langsamer macht",
    pReduction: "Treibt ein kleines Zahnrad (Ritzel) mit 10 Zähnen ein großes mit 60 Zähnen an, muss sich das kleine sechsmal drehen, bis das große einmal herum ist — das große Rad läuft also sechsmal langsamer, dafür mit sechsfacher Kraft. Das nennt man Untersetzung. Sitzt auf derselben Achse wieder ein kleines Ritzel, das das nächste große Rad antreibt, multipliziert sich die Untersetzung: 6 · 6 = 36, dann 216, 1.296 … Nach 22 Stufen ist das Verhältnis 6²² ≈ 131 Billiarden zu 1.",
    formula: "Umdrehungszeit von Rad n = Umdrehungszeit von Rad 1 × 6^(n − 1)",
    h2Calc: "Rechner: Wie langsam wird dein Getriebe?",
    pCalc: "Gib ein, wie schnell das erste Rad dreht, wie stark jede Stufe untersetzt und wie viele Räder es gibt.",
    calcFirst: "Erstes Rad: eine Umdrehung in (Sekunden)", calcRatio: "Untersetzung pro Stufe (z. B. 6 = 60:10 Zähne)", calcGears: "Anzahl der Zahnräder",
    calcLast: "Letztes Rad: eine Umdrehung in", calcTotal: "Gesamtübersetzung", calcAgeOfUniverse: "= {x} × das Alter des Universums",
    h2Similar: "Ähnliche Maschinen",
    pGanson: "Die bekannteste Verwandte ist „Machine with Concrete“ des US-Künstlers Arthur Ganson: zwölf Zahnradpaare mit je 1:50 Untersetzung, angetrieben von einem Motor mit 200 Umdrehungen pro Minute. Das letzte Rad würde für eine Umdrehung über 2 Billionen Jahre brauchen — Ganson hat es einfach in Beton gegossen.",
    pLongNow: "Die „Clock of the Long Now“ ist eine echte mechanische Uhr, die 10.000 Jahre lang laufen soll. Die Maschine der Ewigkeit geht noch weiter: Sie ist so berechnet, dass ihr letztes Rad genau das Alter des Universums für eine Umdrehung braucht — und sie läuft live für alle Besucher gleich.",
    h2Faq: "Fragen & Antworten",
    faq: [
      ["Dreht sich das letzte Zahnrad wirklich?", "Ja — rechnerisch exakt. Seit dem Urknall hat es genau eine Umdrehung geschafft; heute bewegt es sich so langsam, dass niemand es je sehen wird. Die Stellung jedes Rads wird aus der aktuellen Uhrzeit berechnet und ist für alle Besucher gleich."],
      ["Warum gerade Faktor 6?", "Mit 60 Zähnen am großen und 10 am kleinen Rad entsteht 1:6. So reichen 23 Räder, um vom 3-Sekunden-Rad bis zu 13,8 Milliarden Jahren zu kommen."],
      ["Wie viel Kraft bräuchte man?", "Umgekehrt: Untersetzung vervielfacht die Kraft. Am letzten Rad wäre das Drehmoment theoretisch 6²²-mal so groß wie am ersten Rad — in der Realität würden Reibung und Material das begrenzen."],
    ],
    keywords: ["Maschine der Ewigkeit", "Zahnrad 13,8 Milliarden Jahre", "langsamstes Zahnrad", "Zahnrad Untersetzung", "Übersetzungsverhältnis berechnen", "Getriebe Rechner", "Zahnradkette", "Machine with Concrete", "ein Rad dreht das andere langsamer"],
  },
  en: {
    h2Reduction: "How one gear makes the next one slower",
    pReduction: "When a small gear (pinion) with 10 teeth drives a large gear with 60 teeth, the small one has to turn six times before the large one completes a single turn — the large gear runs six times slower, but with six times the force. This is called gear reduction. Put another small pinion on the same axle to drive the next large gear and the reduction multiplies: 6 × 6 = 36, then 216, 1,296… After 22 stages the ratio is 6²² ≈ 131 quadrillion to 1.",
    formula: "Time per turn of gear n = time per turn of gear 1 × 6^(n − 1)",
    h2Calc: "Calculator: how slow does your gear train get?",
    pCalc: "Enter how fast the first gear turns, the reduction per stage and the number of gears.",
    calcFirst: "First gear: one turn in (seconds)", calcRatio: "Reduction per stage (e.g. 6 = 60:10 teeth)", calcGears: "Number of gears",
    calcLast: "Last gear: one turn in", calcTotal: "Total gear ratio", calcAgeOfUniverse: "= {x} × the age of the universe",
    h2Similar: "Similar machines",
    pGanson: "The most famous relative is “Machine with Concrete” by the American artist Arthur Ganson: twelve gear pairs, each reducing 1:50, driven by a motor at 200 revolutions per minute. The last gear would need more than 2 trillion years for a single turn — so Ganson simply set it in concrete.",
    pLongNow: "The “Clock of the Long Now” is a real mechanical clock designed to run for 10,000 years. The eternity machine goes further: it is calculated so that its last gear needs exactly the age of the universe for one turn — and it runs live, identical for every visitor.",
    h2Faq: "Questions & answers",
    faq: [
      ["Does the last gear really turn?", "Yes — mathematically exactly. Since the Big Bang it has completed exactly one turn; today it moves so slowly that nobody will ever see it move. Every gear's position is calculated from the current time and is the same for all visitors."],
      ["Why a ratio of 6?", "60 teeth on the large gear and 10 on the small one give 1:6. That way 23 gears are enough to go from a 3-second gear to 13.8 billion years."],
      ["How much force would it have?", "Reduction multiplies force: in theory the last gear would have 6²² times the torque of the first gear — in reality friction and materials would limit that."],
    ],
    keywords: ["eternity machine", "gear that turns once every 13.8 billion years", "slowest gear in the world", "gear reduction", "gear ratio calculator", "gear train", "machine with concrete", "gear turning another gear slower"],
  },
  es: {
    h2Reduction: "Cómo un engranaje hace más lento al siguiente",
    pReduction: "Cuando un piñón de 10 dientes mueve una rueda de 60 dientes, el piñón debe girar seis veces para que la rueda grande dé una vuelta: la rueda grande gira seis veces más lento, pero con seis veces más fuerza. Esto se llama reducción. Si en el mismo eje va otro piñón que mueve la siguiente rueda, la reducción se multiplica: 6 × 6 = 36, luego 216, 1296… Tras 22 etapas la relación es 6²² ≈ 131 000 billones a 1.",
    formula: "Tiempo por vuelta del engranaje n = tiempo del engranaje 1 × 6^(n − 1)",
    h2Calc: "Calculadora: ¿cuánto se ralentiza tu tren de engranajes?",
    pCalc: "Introduce lo rápido que gira el primer engranaje, la reducción por etapa y el número de engranajes.",
    calcFirst: "Primer engranaje: una vuelta en (segundos)", calcRatio: "Reducción por etapa (p. ej. 6 = 60:10 dientes)", calcGears: "Número de engranajes",
    calcLast: "Último engranaje: una vuelta en", calcTotal: "Relación total", calcAgeOfUniverse: "= {x} × la edad del universo",
    h2Similar: "Máquinas similares",
    pGanson: "La pariente más famosa es «Machine with Concrete» del artista estadounidense Arthur Ganson: doce pares de engranajes con reducción 1:50 cada uno, movidos por un motor a 200 revoluciones por minuto. El último engranaje necesitaría más de 2 billones de años para una vuelta, así que Ganson lo dejó empotrado en hormigón.",
    pLongNow: "El «Clock of the Long Now» es un reloj mecánico real diseñado para funcionar 10 000 años. La máquina de la eternidad va más allá: su último engranaje necesita exactamente la edad del universo para una vuelta, y funciona en vivo, igual para todos los visitantes.",
    h2Faq: "Preguntas y respuestas",
    faq: [
      ["¿De verdad gira el último engranaje?", "Sí, con exactitud matemática. Desde el Big Bang ha dado exactamente una vuelta; hoy se mueve tan despacio que nadie lo verá moverse. La posición de cada engranaje se calcula con la hora actual y es la misma para todos."],
      ["¿Por qué una relación de 6?", "60 dientes en la rueda grande y 10 en la pequeña dan 1:6. Así bastan 23 engranajes para pasar de 3 segundos a 13 800 millones de años."],
      ["¿Cuánta fuerza tendría?", "La reducción multiplica la fuerza: en teoría el último engranaje tendría 6²² veces el par del primero; en la realidad la fricción y los materiales lo limitarían."],
    ],
    keywords: ["máquina de la eternidad", "engranaje 13 800 millones de años", "engranaje más lento del mundo", "reducción de engranajes", "calculadora relación de transmisión", "tren de engranajes"],
  },
  fr: {
    h2Reduction: "Comment un engrenage ralentit le suivant",
    pReduction: "Quand un pignon de 10 dents entraîne une roue de 60 dents, le pignon doit faire six tours pour que la grande roue en fasse un : elle tourne six fois plus lentement, mais avec six fois plus de force. C'est la démultiplication. Si un autre pignon sur le même axe entraîne la roue suivante, la réduction se multiplie : 6 × 6 = 36, puis 216, 1 296… Après 22 étages, le rapport vaut 6²² ≈ 131 millions de milliards pour 1.",
    formula: "Durée d'un tour de la roue n = durée d'un tour de la roue 1 × 6^(n − 1)",
    h2Calc: "Calculateur : jusqu'où ralentit ton train d'engrenages ?",
    pCalc: "Indique la vitesse du premier engrenage, la réduction par étage et le nombre de roues.",
    calcFirst: "Première roue : un tour en (secondes)", calcRatio: "Réduction par étage (ex. 6 = 60:10 dents)", calcGears: "Nombre de roues",
    calcLast: "Dernière roue : un tour en", calcTotal: "Rapport total", calcAgeOfUniverse: "= {x} × l'âge de l'univers",
    h2Similar: "Machines semblables",
    pGanson: "La parente la plus célèbre est « Machine with Concrete » de l'artiste américain Arthur Ganson : douze paires d'engrenages réduisant chacune 1:50, entraînées par un moteur à 200 tours par minute. La dernière roue mettrait plus de 2 000 milliards d'années pour un tour — Ganson l'a donc simplement coulée dans le béton.",
    pLongNow: "La « Clock of the Long Now » est une vraie horloge mécanique conçue pour fonctionner 10 000 ans. La machine de l'éternité va plus loin : sa dernière roue met exactement l'âge de l'univers pour un tour, et elle tourne en direct, identique pour tous.",
    h2Faq: "Questions et réponses",
    faq: [
      ["La dernière roue tourne-t-elle vraiment ?", "Oui, avec une exactitude mathématique. Depuis le Big Bang, elle a fait exactement un tour ; aujourd'hui elle bouge si lentement que personne ne la verra jamais bouger. La position de chaque roue est calculée à partir de l'heure actuelle."],
      ["Pourquoi un rapport de 6 ?", "60 dents sur la grande roue et 10 sur la petite donnent 1:6. Ainsi, 23 roues suffisent pour passer de 3 secondes à 13,8 milliards d'années."],
      ["Quelle force aurait-elle ?", "La démultiplication multiplie la force : en théorie, la dernière roue aurait 6²² fois le couple de la première ; en réalité, frottements et matériaux le limiteraient."],
    ],
    keywords: ["machine de l'éternité", "engrenage 13,8 milliards d'années", "engrenage le plus lent du monde", "démultiplication engrenage", "calcul rapport de réduction", "train d'engrenages"],
  },
  pt: {
    h2Reduction: "Como uma engrenagem deixa a próxima mais lenta",
    pReduction: "Quando um pinhão de 10 dentes move uma roda de 60 dentes, o pinhão precisa girar seis vezes para a roda grande dar uma volta: ela gira seis vezes mais devagar, mas com seis vezes mais força. Isso se chama redução. Se outro pinhão no mesmo eixo move a roda seguinte, a redução se multiplica: 6 × 6 = 36, depois 216, 1.296… Após 22 estágios a relação é 6²² ≈ 131 quatrilhões para 1.",
    formula: "Tempo de uma volta da engrenagem n = tempo da engrenagem 1 × 6^(n − 1)",
    h2Calc: "Calculadora: quão lento fica o seu trem de engrenagens?",
    pCalc: "Informe a velocidade da primeira engrenagem, a redução por estágio e o número de engrenagens.",
    calcFirst: "Primeira engrenagem: uma volta em (segundos)", calcRatio: "Redução por estágio (ex. 6 = 60:10 dentes)", calcGears: "Número de engrenagens",
    calcLast: "Última engrenagem: uma volta em", calcTotal: "Relação total", calcAgeOfUniverse: "= {x} × a idade do universo",
    h2Similar: "Máquinas semelhantes",
    pGanson: "A parente mais famosa é a «Machine with Concrete», do artista americano Arthur Ganson: doze pares de engrenagens com redução de 1:50 cada, movidos por um motor a 200 rotações por minuto. A última engrenagem levaria mais de 2 trilhões de anos para uma volta — por isso Ganson simplesmente a concretou.",
    pLongNow: "O «Clock of the Long Now» é um relógio mecânico real projetado para funcionar por 10.000 anos. A máquina da eternidade vai além: sua última engrenagem leva exatamente a idade do universo para uma volta, e ela funciona ao vivo, igual para todos.",
    h2Faq: "Perguntas e respostas",
    faq: [
      ["A última engrenagem realmente gira?", "Sim, com exatidão matemática. Desde o Big Bang ela deu exatamente uma volta; hoje se move tão devagar que ninguém a verá se mexer. A posição de cada engrenagem é calculada a partir da hora atual."],
      ["Por que relação 6?", "60 dentes na roda grande e 10 na pequena dão 1:6. Assim, 23 engrenagens bastam para ir de 3 segundos a 13,8 bilhões de anos."],
      ["Quanta força ela teria?", "A redução multiplica a força: em teoria a última engrenagem teria 6²² vezes o torque da primeira; na prática, atrito e materiais limitariam isso."],
    ],
    keywords: ["máquina da eternidade", "engrenagem 13,8 bilhões de anos", "engrenagem mais lenta do mundo", "redução de engrenagens", "calculadora de relação de transmissão", "trem de engrenagens"],
  },
  tr: {
    h2Reduction: "Bir dişli bir sonrakini nasıl yavaşlatır",
    pReduction: "10 dişli küçük bir pinyon 60 dişli büyük bir çarkı döndürdüğünde, büyük çark bir tur atana kadar küçük olanın altı tur atması gerekir: büyük çark altı kat yavaş ama altı kat güçlü döner. Buna redüksiyon (dişli küçültme) denir. Aynı mile takılan başka bir pinyon sonraki çarkı döndürürse oran çarpılır: 6 × 6 = 36, sonra 216, 1.296… 22 kademeden sonra oran 6²² ≈ 131 katrilyona 1'dir.",
    formula: "n. dişlinin tur süresi = 1. dişlinin tur süresi × 6^(n − 1)",
    h2Calc: "Hesaplayıcı: dişli dizin ne kadar yavaşlar?",
    pCalc: "İlk dişlinin ne kadar hızlı döndüğünü, kademe başına oranı ve dişli sayısını gir.",
    calcFirst: "İlk dişli: bir tur (saniye)", calcRatio: "Kademe başına oran (ör. 6 = 60:10 diş)", calcGears: "Dişli sayısı",
    calcLast: "Son dişli: bir tur", calcTotal: "Toplam oran", calcAgeOfUniverse: "= evrenin yaşının {x} katı",
    h2Similar: "Benzer makineler",
    pGanson: "En ünlü benzeri, ABD'li sanatçı Arthur Ganson'ın „Machine with Concrete“ eseridir: her biri 1:50 oranında 12 dişli çifti, dakikada 200 devirle dönen bir motorla çalışır. Son dişli tek bir tur için 2 trilyon yıldan fazla süreye ihtiyaç duyardı — Ganson onu doğrudan betona gömdü.",
    pLongNow: "„Clock of the Long Now“, 10.000 yıl çalışması için tasarlanmış gerçek bir mekanik saattir. Sonsuzluk makinesi daha da ileri gider: son dişlisi bir tur için tam olarak evrenin yaşı kadar süreye ihtiyaç duyar ve herkes için aynı şekilde canlı çalışır.",
    h2Faq: "Sorular ve cevaplar",
    faq: [
      ["Son dişli gerçekten dönüyor mu?", "Evet, matematiksel olarak tam doğrulukla. Büyük Patlama'dan beri tam bir tur attı; bugün o kadar yavaş hareket ediyor ki kimse onun döndüğünü göremeyecek. Her dişlinin konumu güncel saatten hesaplanır."],
      ["Neden 6 oranı?", "Büyük çarkta 60, küçükte 10 diş 1:6 oranını verir. Böylece 3 saniyelik dişliden 13,8 milyar yıla ulaşmak için 23 dişli yeterlidir."],
      ["Ne kadar güçlü olurdu?", "Redüksiyon kuvveti çarpar: teoride son dişli ilk dişlinin torkunun 6²² katına sahip olurdu; gerçekte sürtünme ve malzeme bunu sınırlardı."],
    ],
    keywords: ["sonsuzluk makinesi", "13,8 milyar yılda dönen dişli", "dünyanın en yavaş dişlisi", "dişli redüksiyonu", "dişli oranı hesaplama", "dişli dizisi"],
  },
  ru: {
    h2Reduction: "Как одна шестерня замедляет другую",
    pReduction: "Когда маленькая шестерня с 10 зубьями вращает большую с 60 зубьями, маленькой нужно сделать шесть оборотов, чтобы большая сделала один: большая вращается в шесть раз медленнее, но с шестикратной силой. Это называется понижающей передачей (редукцией). Если на той же оси сидит ещё одна маленькая шестерня, вращающая следующую большую, передаточные числа перемножаются: 6 × 6 = 36, затем 216, 1296… После 22 ступеней отношение равно 6²² ≈ 131 квадриллион к 1.",
    formula: "Время оборота шестерни n = время оборота шестерни 1 × 6^(n − 1)",
    h2Calc: "Калькулятор: насколько медленной станет твоя передача?",
    pCalc: "Введи, как быстро вращается первая шестерня, передаточное число ступени и количество шестерней.",
    calcFirst: "Первая шестерня: один оборот за (секунд)", calcRatio: "Передаточное число ступени (напр. 6 = 60:10 зубьев)", calcGears: "Количество шестерней",
    calcLast: "Последняя шестерня: один оборот за", calcTotal: "Общее передаточное число", calcAgeOfUniverse: "= {x} × возраст Вселенной",
    h2Similar: "Похожие машины",
    pGanson: "Самая известная родственница — «Machine with Concrete» американского художника Артура Гансона: двенадцать пар шестерней с понижением 1:50 каждая и мотор на 200 оборотов в минуту. Последней шестерне понадобилось бы больше 2 триллионов лет на один оборот — поэтому Гансон просто залил её бетоном.",
    pLongNow: "«Clock of the Long Now» — настоящие механические часы, рассчитанные на 10 000 лет работы. Машина вечности идёт дальше: её последней шестерне нужен ровно возраст Вселенной на один оборот, и она работает вживую, одинаково для всех.",
    h2Faq: "Вопросы и ответы",
    faq: [
      ["Последняя шестерня действительно вращается?", "Да, с математической точностью. С Большого взрыва она сделала ровно один оборот; сегодня она движется так медленно, что никто никогда не увидит её движения. Положение каждой шестерни вычисляется по текущему времени."],
      ["Почему именно 6?", "60 зубьев на большой и 10 на маленькой дают 1:6. Так 23 шестерней хватает, чтобы пройти от 3 секунд до 13,8 млрд лет."],
      ["Какая у неё была бы сила?", "Понижающая передача умножает силу: теоретически момент на последней шестерне в 6²² раз больше, чем на первой; в реальности это ограничили бы трение и материалы."],
    ],
    keywords: ["машина вечности", "шестерня 13,8 миллиарда лет", "самая медленная шестерня в мире", "понижающая передача", "калькулятор передаточного числа", "зубчатая передача"],
  },
  el: {
    h2Reduction: "Πώς ένα γρανάζι επιβραδύνει το επόμενο",
    pReduction: "Όταν ένα μικρό γρανάζι με 10 δόντια κινεί ένα μεγάλο με 60 δόντια, το μικρό πρέπει να κάνει έξι στροφές για να κάνει το μεγάλο μία: το μεγάλο γυρίζει έξι φορές πιο αργά, αλλά με εξαπλάσια δύναμη. Αυτό λέγεται υποπολλαπλασιασμός. Αν ένα άλλο μικρό γρανάζι στον ίδιο άξονα κινεί το επόμενο, οι λόγοι πολλαπλασιάζονται: 6 × 6 = 36, μετά 216, 1.296… Μετά από 22 βαθμίδες ο λόγος είναι 6²² ≈ 1,3 × 10¹⁷ προς 1.",
    formula: "Χρόνος στροφής του γραναζιού n = χρόνος του γραναζιού 1 × 6^(n − 1)",
    h2Calc: "Υπολογιστής: πόσο αργό γίνεται το γρανάζωμά σου;",
    pCalc: "Δώσε πόσο γρήγορα γυρίζει το πρώτο γρανάζι, τον λόγο ανά βαθμίδα και τον αριθμό των γραναζιών.",
    calcFirst: "Πρώτο γρανάζι: μία στροφή σε (δευτερόλεπτα)", calcRatio: "Λόγος ανά βαθμίδα (π.χ. 6 = 60:10 δόντια)", calcGears: "Αριθμός γραναζιών",
    calcLast: "Τελευταίο γρανάζι: μία στροφή σε", calcTotal: "Συνολικός λόγος", calcAgeOfUniverse: "= {x} × η ηλικία του σύμπαντος",
    h2Similar: "Παρόμοιες μηχανές",
    pGanson: "Η πιο διάσημη συγγενής είναι η «Machine with Concrete» του Αμερικανού καλλιτέχνη Arthur Ganson: δώδεκα ζεύγη γραναζιών με λόγο 1:50 το καθένα, με μοτέρ 200 στροφών το λεπτό. Το τελευταίο γρανάζι θα χρειαζόταν πάνω από 2 τρισεκατομμύρια χρόνια για μία στροφή — γι' αυτό ο Ganson το έχτισε απλώς σε τσιμέντο.",
    pLongNow: "Το «Clock of the Long Now» είναι ένα πραγματικό μηχανικό ρολόι σχεδιασμένο να λειτουργεί 10.000 χρόνια. Η μηχανή της αιωνιότητας πάει πιο πέρα: το τελευταίο της γρανάζι χρειάζεται ακριβώς την ηλικία του σύμπαντος για μία στροφή, και λειτουργεί ζωντανά, ίδια για όλους.",
    h2Faq: "Ερωτήσεις και απαντήσεις",
    faq: [
      ["Γυρίζει πραγματικά το τελευταίο γρανάζι;", "Ναι, με μαθηματική ακρίβεια. Από τη Μεγάλη Έκρηξη έχει κάνει ακριβώς μία στροφή· σήμερα κινείται τόσο αργά που κανείς δεν θα το δει να κινείται. Η θέση κάθε γραναζιού υπολογίζεται από την τρέχουσα ώρα."],
      ["Γιατί λόγος 6;", "60 δόντια στο μεγάλο και 10 στο μικρό δίνουν 1:6. Έτσι αρκούν 23 γρανάζια για να φτάσουμε από τα 3 δευτερόλεπτα στα 13,8 δισ. χρόνια."],
      ["Πόση δύναμη θα είχε;", "Ο υποπολλαπλασιασμός πολλαπλασιάζει τη δύναμη: θεωρητικά το τελευταίο γρανάζι θα είχε 6²² φορές τη ροπή του πρώτου· στην πράξη θα το περιόριζαν τριβή και υλικά."],
    ],
    keywords: ["μηχανή της αιωνιότητας", "γρανάζι 13,8 δισ. χρόνια", "το πιο αργό γρανάζι", "υποπολλαπλασιασμός γραναζιών", "υπολογισμός λόγου μετάδοσης"],
  },
  ar: {
    h2Reduction: "كيف يجعل ترسٌ الترسَ التالي أبطأ",
    pReduction: "عندما يدير ترس صغير من 10 أسنان ترساً كبيراً من 60 سناً، يجب أن يدور الصغير ست مرات ليكمل الكبير دورة واحدة: فيدور الكبير أبطأ بست مرات لكن بقوة أكبر بست مرات. يسمى هذا تخفيض السرعة. وإذا وُضع ترس صغير آخر على المحور نفسه ليدير الترس التالي، تتضاعف النسبة: 6 × 6 = 36، ثم 216، ثم 1296… وبعد 22 مرحلة تصبح النسبة 6²² ≈ 131 كوادريليون إلى 1.",
    formula: "زمن دورة الترس n = زمن دورة الترس 1 × 6^(n − 1)",
    h2Calc: "حاسبة: إلى أي حد تصبح سلسلة تروسك بطيئة؟",
    pCalc: "أدخل سرعة دوران الترس الأول ونسبة التخفيض لكل مرحلة وعدد التروس.",
    calcFirst: "الترس الأول: دورة واحدة في (ثوانٍ)", calcRatio: "التخفيض لكل مرحلة (مثلاً 6 = أسنان 60:10)", calcGears: "عدد التروس",
    calcLast: "الترس الأخير: دورة واحدة في", calcTotal: "النسبة الكلية", calcAgeOfUniverse: "= {x} × عمر الكون",
    h2Similar: "آلات مشابهة",
    pGanson: "أشهر قريباتها «Machine with Concrete» للفنان الأمريكي آرثر غانسون: اثنا عشر زوجاً من التروس بنسبة تخفيض 1:50 لكل منها، يديرها محرك بسرعة 200 دورة في الدقيقة. سيحتاج الترس الأخير أكثر من تريليوني سنة لدورة واحدة، لذلك ثبّته غانسون ببساطة في الخرسانة.",
    pLongNow: "«Clock of the Long Now» ساعة ميكانيكية حقيقية مصممة لتعمل 10 آلاف سنة. وآلة الأبدية تذهب أبعد: يحتاج ترسها الأخير بالضبط عمر الكون لدورة واحدة، وهي تعمل مباشرة وبالشكل نفسه لكل الزوار.",
    h2Faq: "أسئلة وأجوبة",
    faq: [
      ["هل يدور الترس الأخير فعلاً؟", "نعم، بدقة رياضية. منذ الانفجار العظيم أكمل دورة واحدة بالضبط؛ واليوم يتحرك ببطء شديد لن يراه أحد يتحرك أبداً. يُحسب موضع كل ترس من الوقت الحالي."],
      ["لماذا النسبة 6؟", "60 سناً في الترس الكبير و10 في الصغير تعطي 1:6، فيكفي 23 ترساً للانتقال من 3 ثوانٍ إلى 13.8 مليار سنة."],
      ["ما مقدار القوة؟", "التخفيض يضاعف القوة: نظرياً يكون عزم الترس الأخير 6²² ضعف عزم الترس الأول، أما في الواقع فالاحتكاك والمواد يحدّان من ذلك."],
    ],
    keywords: ["آلة الأبدية", "ترس يدور كل 13.8 مليار سنة", "أبطأ ترس في العالم", "تخفيض التروس", "حاسبة نسبة التروس"],
  },
  hi: {
    h2Reduction: "एक गियर अगले को धीमा कैसे करता है",
    pReduction: "जब 10 दाँतों वाला छोटा गियर 60 दाँतों वाले बड़े गियर को घुमाता है, तो बड़े के एक चक्कर के लिए छोटे को छह चक्कर लगाने पड़ते हैं: बड़ा गियर छह गुना धीमा पर छह गुना ज़्यादा ताक़त से घूमता है। इसे गियर रिडक्शन कहते हैं। उसी धुरी पर लगा दूसरा छोटा गियर अगले बड़े गियर को घुमाए तो अनुपात गुणा होता जाता है: 6 × 6 = 36, फिर 216, 1,296… 22 चरणों के बाद अनुपात 6²² ≈ 131 क्वाड्रिलियन : 1 है।",
    formula: "गियर n का एक चक्कर = गियर 1 का एक चक्कर × 6^(n − 1)",
    h2Calc: "कैलकुलेटर: आपकी गियर-श्रृंखला कितनी धीमी होगी?",
    pCalc: "पहले गियर की गति, हर चरण का अनुपात और गियरों की संख्या डालें।",
    calcFirst: "पहला गियर: एक चक्कर (सेकंड)", calcRatio: "हर चरण का अनुपात (जैसे 6 = 60:10 दाँत)", calcGears: "गियरों की संख्या",
    calcLast: "आख़िरी गियर: एक चक्कर", calcTotal: "कुल अनुपात", calcAgeOfUniverse: "= ब्रह्मांड की उम्र का {x} गुना",
    h2Similar: "मिलती-जुलती मशीनें",
    pGanson: "सबसे प्रसिद्ध रिश्तेदार अमेरिकी कलाकार आर्थर गैंसन की „Machine with Concrete“ है: 1:50 अनुपात वाले बारह गियर-जोड़े, जिन्हें 200 चक्कर प्रति मिनट वाली मोटर चलाती है। आख़िरी गियर को एक चक्कर में 2 ट्रिलियन वर्ष से ज़्यादा लगेंगे — इसलिए गैंसन ने उसे कंक्रीट में ही जड़ दिया।",
    pLongNow: "„Clock of the Long Now“ एक असली यांत्रिक घड़ी है जिसे 10,000 वर्ष चलने के लिए बनाया जा रहा है। अनंत काल की मशीन इससे भी आगे है: इसके आख़िरी गियर को एक चक्कर में ठीक ब्रह्मांड की उम्र जितना समय लगता है, और यह सभी के लिए एक जैसी लाइव चलती है।",
    h2Faq: "सवाल और जवाब",
    faq: [
      ["क्या आख़िरी गियर सच में घूमता है?", "हाँ, गणितीय रूप से बिल्कुल सही। बिग बैंग से अब तक इसने ठीक एक चक्कर पूरा किया है; आज यह इतना धीमा है कि कोई इसे हिलते नहीं देखेगा। हर गियर की स्थिति मौजूदा समय से गणना की जाती है।"],
      ["अनुपात 6 ही क्यों?", "बड़े गियर में 60 और छोटे में 10 दाँत 1:6 देते हैं। इस तरह 3 सेकंड से 13.8 अरब वर्ष तक पहुँचने के लिए 23 गियर काफ़ी हैं।"],
      ["इसमें कितनी ताक़त होती?", "रिडक्शन ताक़त को गुणा करता है: सिद्धांत में आख़िरी गियर पर पहले गियर का 6²² गुना टॉर्क होगा; असल में घर्षण और सामग्री इसे सीमित करेंगे।"],
    ],
    keywords: ["अनंत काल की मशीन", "13.8 अरब साल में घूमने वाला गियर", "दुनिया का सबसे धीमा गियर", "गियर रिडक्शन", "गियर अनुपात कैलकुलेटर"],
  },
  zh: {
    h2Reduction: "一个齿轮如何让下一个变慢",
    pReduction: "当10齿的小齿轮带动60齿的大齿轮时，小齿轮要转六圈，大齿轮才转一圈：大齿轮慢六倍，但力量大六倍。这叫减速传动。如果同一根轴上再装一个小齿轮去带动下一个大齿轮，减速比就会相乘：6 × 6 = 36，然后是216、1296……经过22级后，传动比为6²² ≈ 13.1亿亿比1。",
    formula: "第n个齿轮转一圈的时间 = 第1个齿轮转一圈的时间 × 6^(n − 1)",
    h2Calc: "计算器：你的齿轮组能变得多慢？",
    pCalc: "输入第一个齿轮的转速、每级减速比和齿轮数量。",
    calcFirst: "第一个齿轮：转一圈需要（秒）", calcRatio: "每级减速比（例如 6 = 60:10齿）", calcGears: "齿轮数量",
    calcLast: "最后一个齿轮：转一圈需要", calcTotal: "总传动比", calcAgeOfUniverse: "= 宇宙年龄的{x}倍",
    h2Similar: "类似的机器",
    pGanson: "最著名的“亲戚”是美国艺术家亚瑟·甘森的《Machine with Concrete》（混凝土机器）：十二对齿轮，每对减速1:50，由每分钟200转的电机驱动。最后一个齿轮转一圈需要超过2万亿年——于是甘森干脆把它浇筑在混凝土里。",
    pLongNow: "“恒今钟”（Clock of the Long Now）是一座设计运行一万年的真实机械钟。永恒机器走得更远：它最后一个齿轮转一圈恰好需要宇宙的年龄，而且对所有访客实时同步运转。",
    h2Faq: "问与答",
    faq: [
      ["最后一个齿轮真的在转吗？", "是的，数学上完全精确。自大爆炸以来它恰好转了一圈；如今它慢到任何人都看不到它在动。每个齿轮的位置都根据当前时间计算。"],
      ["为什么是6倍？", "大齿轮60齿、小齿轮10齿，得到1:6。这样23个齿轮就足以从3秒一圈达到138亿年一圈。"],
      ["它会有多大的力？", "减速会放大力矩：理论上最后一个齿轮的扭矩是第一个齿轮的6²²倍；现实中摩擦和材料会限制这一点。"],
    ],
    keywords: ["永恒机器", "138亿年转一圈的齿轮", "世界上最慢的齿轮", "齿轮减速", "齿轮传动比计算器", "齿轮组"],
  },
  ja: {
    h2Reduction: "歯車が次の歯車を遅くする仕組み",
    pReduction: "歯数10の小さな歯車（ピニオン）が歯数60の大きな歯車を回すと、大きな歯車が一回転する間に小さな歯車は6回転します。大きな歯車は6倍遅く、その代わり6倍の力で回ります。これが減速です。同じ軸に別のピニオンを付けて次の歯車を回すと、減速比は掛け算で増えます：6 × 6 = 36、216、1,296……22段で6²² ≈ 13京1000兆対1になります。",
    formula: "歯車nの一回転の時間 = 歯車1の一回転の時間 × 6^(n − 1)",
    h2Calc: "計算機：あなたの歯車列はどこまで遅くなる？",
    pCalc: "最初の歯車の速さ、1段あたりの減速比、歯車の数を入力してください。",
    calcFirst: "最初の歯車：一回転（秒）", calcRatio: "1段あたりの減速比（例：6 = 60:10歯）", calcGears: "歯車の数",
    calcLast: "最後の歯車：一回転", calcTotal: "総減速比", calcAgeOfUniverse: "= 宇宙の年齢の{x}倍",
    h2Similar: "似た機械",
    pGanson: "最も有名な仲間は、アメリカの芸術家アーサー・ガンソンの「Machine with Concrete（コンクリートの機械）」です。1:50の歯車対が12組、毎分200回転のモーターで回ります。最後の歯車が一回転するには2兆年以上かかるため、ガンソンはそれをコンクリートに埋め込みました。",
    pLongNow: "「Clock of the Long Now（ロング・ナウ時計）」は1万年動くよう設計された本物の機械時計です。永遠のマシンはさらに先へ。最後の歯車の一回転にちょうど宇宙の年齢がかかるよう計算され、すべての訪問者に同じ状態でリアルタイムに動いています。",
    h2Faq: "よくある質問",
    faq: [
      ["最後の歯車は本当に回っているの？", "はい、数学的に正確に。ビッグバン以来ちょうど一回転しました。今は動きが遅すぎて誰にも見えません。各歯車の位置は現在時刻から計算されます。"],
      ["なぜ6倍？", "大きい歯車60歯・小さい歯車10歯で1:6。これなら23個の歯車で3秒から138億年まで届きます。"],
      ["どれくらいの力になる？", "減速は力を増やします。理論上、最後の歯車のトルクは最初の歯車の6²²倍。実際には摩擦や材料で制限されます。"],
    ],
    keywords: ["永遠のマシン", "138億年に一回転する歯車", "世界一遅い歯車", "歯車 減速", "減速比 計算", "歯車列"],
  },
  ko: {
    h2Reduction: "톱니바퀴가 다음 톱니바퀴를 느리게 만드는 원리",
    pReduction: "톱니 10개짜리 작은 기어(피니언)가 톱니 60개짜리 큰 기어를 돌리면, 큰 기어가 한 바퀴 도는 동안 작은 기어는 여섯 바퀴를 돌아야 합니다. 큰 기어는 6배 느리지만 6배 큰 힘으로 돕니다. 이것을 감속이라고 합니다. 같은 축에 또 다른 피니언을 달아 다음 기어를 돌리면 감속비가 곱해집니다: 6 × 6 = 36, 216, 1,296… 22단 뒤에는 6²² ≈ 13경 대 1이 됩니다.",
    formula: "n번째 기어의 한 바퀴 시간 = 첫 번째 기어의 한 바퀴 시간 × 6^(n − 1)",
    h2Calc: "계산기: 내 기어열은 얼마나 느려질까?",
    pCalc: "첫 기어의 속도, 단당 감속비, 기어 개수를 입력하세요.",
    calcFirst: "첫 기어: 한 바퀴(초)", calcRatio: "단당 감속비 (예: 6 = 60:10 톱니)", calcGears: "기어 개수",
    calcLast: "마지막 기어: 한 바퀴", calcTotal: "전체 감속비", calcAgeOfUniverse: "= 우주 나이의 {x}배",
    h2Similar: "비슷한 기계",
    pGanson: "가장 유명한 친척은 미국 예술가 아서 갠슨의 「Machine with Concrete」입니다. 1:50 감속 기어 12쌍을 분당 200회전 모터가 돌립니다. 마지막 기어가 한 바퀴 도는 데 2조 년 이상 걸리기 때문에 갠슨은 그것을 콘크리트에 박아 버렸습니다.",
    pLongNow: "「Clock of the Long Now」는 1만 년 동안 작동하도록 설계된 실제 기계식 시계입니다. 영원의 기계는 한 걸음 더 나아가, 마지막 기어가 한 바퀴 도는 데 정확히 우주의 나이가 걸리도록 계산되어 모든 방문자에게 똑같이 실시간으로 돌아갑니다.",
    h2Faq: "자주 묻는 질문",
    faq: [
      ["마지막 기어가 정말 도나요?", "네, 수학적으로 정확하게. 빅뱅 이후 정확히 한 바퀴를 돌았고, 지금은 너무 느려서 아무도 움직임을 볼 수 없습니다. 각 기어의 위치는 현재 시각으로 계산됩니다."],
      ["왜 6배인가요?", "큰 기어 60톱니, 작은 기어 10톱니로 1:6이 됩니다. 그래서 기어 23개면 3초에서 138억 년까지 갈 수 있습니다."],
      ["힘은 얼마나 될까요?", "감속은 힘을 키웁니다. 이론상 마지막 기어의 토크는 첫 기어의 6²²배지만, 실제로는 마찰과 재료가 이를 제한합니다."],
    ],
    keywords: ["영원의 기계", "138억 년에 한 바퀴 도는 기어", "세상에서 가장 느린 기어", "기어 감속", "기어비 계산기", "기어열"],
  },
};

export function machineTexts(lang: Lang): MachineTexts {
  return T[lang];
}
