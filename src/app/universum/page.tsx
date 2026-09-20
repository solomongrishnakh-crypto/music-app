"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import SiteBackground from "@/components/particles/SiteBackground";
import Typewriter from "@/components/ui/Typewriter";
import DetailModal from "@/components/ui/DetailModal";
import SpaceNewsSection from "@/components/home/SpaceNewsSection";
import SolarSystem from "@/components/universe/SolarSystem";
import SolarSystemModal from "@/components/universe/SolarSystemModal";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useInView } from "@/hooks/useInView";
import type { LocalizedText } from "@/lib/i18n";
import { localize } from "@/lib/i18n";

interface UniverseFact {
  label: LocalizedText;
  value: LocalizedText;
  details: [LocalizedText, LocalizedText, LocalizedText];
  image: string;
}

// Bild-URLs über Wikimedia Commons' "Special:FilePath"-Umleitung statt
// direkter upload.wikimedia.org-Pfade (Nutzerkorrektur 20.09.2026: "es
// fehlt hier noch bilder") — Special:FilePath/<Dateiname> löst IMMER
// zuverlässig zur echten Bild-URL auf, ganz ohne den MD5-Hash-Ordner
// (/a/ab/…) erraten zu müssen, der bei einigen der vorherigen Direkt-Links
// nicht (mehr) stimmte und die Bilder deshalb stumm nicht luden.
//
// Nutzerwunsch 20.09.2026: "alles soll auf anderen sprache sein also jedes
// text und details" — jedes Feld ist jetzt LocalizedText, vollständig in
// allen 13 Sprachen übersetzt (de, en, hi, zh, ko, ja, es, fr, tr, ru, pt,
// ar, el).
function commonsFile(filename: string): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=800`;
}

const UNIVERSE_FACTS: UniverseFact[] = [
  {
    label: {
      de: "Alter des Universums",
      en: "Age of the Universe",
      hi: "ब्रह्मांड की आयु",
      zh: "宇宙的年龄",
      ko: "우주의 나이",
      ja: "宇宙の年齢",
      es: "Edad del universo",
      fr: "Âge de l'univers",
      tr: "Evrenin Yaşı",
      ru: "Возраст Вселенной",
      pt: "Idade do universo",
      ar: "عمر الكون",
      el: "Ηλικία του σύμπαντος",
    },
    value: {
      de: "≈ 13,8 Mrd. Jahre",
      en: "≈ 13.8 billion years",
      hi: "≈ 13.8 अरब वर्ष",
      zh: "约138亿年",
      ko: "약 138억 년",
      ja: "約138億年",
      es: "≈ 13.800 millones de años",
      fr: "≈ 13,8 milliards d'années",
      tr: "≈ 13,8 milyar yıl",
      ru: "≈ 13,8 млрд лет",
      pt: "≈ 13,8 bilhões de anos",
      ar: "≈ 13.8 مليار سنة",
      el: "≈ 13,8 δισ. χρόνια",
    },
    details: [
      {
        de: "Das Alter von rund 13,8 Milliarden Jahren stammt aus Messungen des kosmischen Mikrowellenhintergrunds — der 'Nachglühen'-Strahlung des Urknalls, die den gesamten Himmel durchzieht.",
        en: "The age of roughly 13.8 billion years comes from measurements of the cosmic microwave background — the 'afterglow' radiation of the Big Bang that fills the entire sky.",
        hi: "लगभग 13.8 अरब वर्ष की आयु ब्रह्मांडीय सूक्ष्मतरंग पृष्ठभूमि के मापन से मिलती है — महाविस्फोट की 'बची हुई चमक' जो पूरे आकाश में फैली है।",
        zh: "约138亿年的年龄来自对宇宙微波背景辐射的测量——这是大爆炸留下的、遍布整个天空的'余辉'辐射。",
        ko: "약 138억 년이라는 나이는 우주 마이크로파 배경복사 측정에서 나왔다. 이는 온 하늘을 가득 채우는 빅뱅의 '잔광' 복사이다.",
        ja: "約138億年という年齢は、宇宙マイクロ波背景放射の測定から得られたものだ。これはビッグバンの「残光」であり、空全体を満たしている。",
        es: "La edad de unos 13.800 millones de años proviene de mediciones del fondo cósmico de microondas, la radiación 'resplandor' del Big Bang que llena todo el cielo.",
        fr: "L'âge d'environ 13,8 milliards d'années provient de mesures du fond diffus cosmologique — le rayonnement rémanent du Big Bang qui remplit tout le ciel.",
        tr: "Yaklaşık 13,8 milyar yıllık yaş, kozmik mikrodalga arka planının ölçümlerinden gelir — Büyük Patlama'nın tüm gökyüzünü kaplayan 'artık ışıma'sı.",
        ru: "Возраст около 13,8 млрд лет получен из измерений реликтового излучения — «послесвечения» Большого взрыва, заполняющего всё небо.",
        pt: "A idade de cerca de 13,8 bilhões de anos vem de medições da radiação cósmica de fundo — o 'brilho residual' do Big Bang que preenche todo o céu.",
        ar: "يُستمد عمر نحو 13.8 مليار سنة من قياسات الإشعاع الخلفي الكوني الميكروي — 'توهج' الانفجار العظيم المتبقي الذي يملأ السماء بأكملها.",
        el: "Η ηλικία των περίπου 13,8 δισ. ετών προκύπτει από μετρήσεις της κοσμικής μικροκυματικής ακτινοβολίας υποβάθρου — της «λάμψης» της Μεγάλης Έκρηξης που καλύπτει όλο τον ουρανό.",
      },
      {
        de: "Missionen wie WMAP und Planck haben diese Hintergrundstrahlung extrem präzise vermessen und daraus, zusammen mit der Ausdehnungsrate des Universums, das Alter berechnet.",
        en: "Missions such as WMAP and Planck measured this background radiation with extreme precision and, combined with the universe's expansion rate, calculated its age.",
        hi: "WMAP और प्लैंक जैसे मिशनों ने इस पृष्ठभूमि विकिरण को अत्यंत सटीकता से मापा और ब्रह्मांड की विस्तार दर के साथ मिलाकर इसकी आयु की गणना की।",
        zh: "WMAP和普朗克等探测任务对这种背景辐射进行了极其精确的测量,并结合宇宙的膨胀速率计算出了它的年龄。",
        ko: "WMAP와 플랑크 같은 임무들은 이 배경복사를 매우 정밀하게 측정했고, 우주의 팽창률과 결합해 나이를 계산했다.",
        ja: "WMAPやプランクなどのミッションがこの背景放射を極めて精密に測定し、宇宙の膨張率と組み合わせて年齢を算出した。",
        es: "Misiones como WMAP y Planck midieron esta radiación de fondo con extrema precisión y, junto con la tasa de expansión del universo, calcularon su edad.",
        fr: "Des missions comme WMAP et Planck ont mesuré ce rayonnement de fond avec une extrême précision et, combiné au taux d'expansion de l'univers, en ont déduit son âge.",
        tr: "WMAP ve Planck gibi görevler bu arka plan ışımasını son derece hassas ölçtü ve evrenin genişleme hızıyla birleştirerek yaşını hesapladı.",
        ru: "Миссии WMAP и «Планк» измерили это фоновое излучение с чрезвычайной точностью и вместе со скоростью расширения Вселенной вычислили её возраст.",
        pt: "Missões como WMAP e Planck mediram essa radiação de fundo com extrema precisão e, combinada com a taxa de expansão do universo, calcularam sua idade.",
        ar: "قاست مهمات مثل WMAP وبلانك هذا الإشعاع الخلفي بدقة فائقة، وبالجمع مع معدل تمدد الكون تم حساب عمره.",
        el: "Αποστολές όπως το WMAP και το Planck μέτρησαν αυτή την ακτινοβολία υποβάθρου με εξαιρετική ακρίβεια και, σε συνδυασμό με τον ρυθμό διαστολής του σύμπαντος, υπολόγισαν την ηλικία του.",
      },
      {
        de: "Zum Vergleich: Unser Sonnensystem existiert erst seit etwa 4,6 Milliarden Jahren — das Universum war also schon zwei Drittel seines bisherigen Lebens alt, bevor die Erde entstand.",
        en: "For comparison: our solar system has existed for only about 4.6 billion years — the universe was already two-thirds of its current age before Earth formed.",
        hi: "तुलना के लिए: हमारा सौरमंडल केवल लगभग 4.6 अरब वर्षों से अस्तित्व में है — पृथ्वी बनने से पहले ही ब्रह्मांड अपनी वर्तमान आयु का दो-तिहाई पूरा कर चुका था।",
        zh: "相比之下:我们的太阳系仅存在了约46亿年——在地球形成之前,宇宙就已经走过了其当前年龄的三分之二。",
        ko: "비교하자면 우리 태양계는 약 46억 년 전에야 생겨났다. 지구가 형성되기도 전에 우주는 이미 현재 나이의 3분의 2를 지나 있었다.",
        ja: "比較として、私たちの太陽系はまだ約46億年前に誕生したにすぎない。地球ができる前から、宇宙はすでに現在の年齢の3分の2を経ていたことになる。",
        es: "En comparación: nuestro sistema solar existe desde hace solo unos 4.600 millones de años; el universo ya tenía dos tercios de su edad actual antes de que se formara la Tierra.",
        fr: "À titre de comparaison, notre système solaire n'existe que depuis environ 4,6 milliards d'années — l'univers avait déjà les deux tiers de son âge actuel avant la formation de la Terre.",
        tr: "Karşılaştırma için: Güneş sistemimiz yalnızca yaklaşık 4,6 milyar yıldır var — Dünya oluşmadan önce evren şimdiki yaşının zaten üçte ikisine ulaşmıştı.",
        ru: "Для сравнения: наша Солнечная система существует лишь около 4,6 млрд лет — Вселенная уже прожила две трети своего нынешнего возраста, прежде чем образовалась Земля.",
        pt: "Para comparação: nosso sistema solar existe há apenas cerca de 4,6 bilhões de anos — o universo já tinha dois terços de sua idade atual antes de a Terra se formar.",
        ar: "للمقارنة: نظامنا الشمسي موجود منذ نحو 4.6 مليار سنة فقط — كان الكون قد بلغ بالفعل ثلثي عمره الحالي قبل تشكّل الأرض.",
        el: "Για σύγκριση: το ηλιακό μας σύστημα υπάρχει μόλις εδώ και περίπου 4,6 δισ. χρόνια — το σύμπαν είχε ήδη τα δύο τρίτα της σημερινής του ηλικίας πριν σχηματιστεί η Γη.",
      },
    ],
    image: commonsFile("Cosmic_Microwave_Background_(CMB).jpeg"),
  },
  {
    label: {
      de: "Beobachtbares Universum",
      en: "Observable Universe",
      hi: "अवलोकनीय ब्रह्मांड",
      zh: "可观测宇宙",
      ko: "관측 가능한 우주",
      ja: "観測可能な宇宙",
      es: "Universo observable",
      fr: "Univers observable",
      tr: "Gözlemlenebilir Evren",
      ru: "Наблюдаемая Вселенная",
      pt: "Universo observável",
      ar: "الكون المرئي",
      el: "Παρατηρήσιμο σύμπαν",
    },
    value: {
      de: "≈ 93 Mrd. Lichtjahre Ø",
      en: "≈ 93 billion light-years across",
      hi: "≈ 93 अरब प्रकाश-वर्ष व्यास",
      zh: "直径约930亿光年",
      ko: "지름 약 930억 광년",
      ja: "直径約930億光年",
      es: "≈ 93.000 millones de años luz de diámetro",
      fr: "≈ 93 milliards d'années-lumière de diamètre",
      tr: "≈ 93 milyar ışık yılı çapında",
      ru: "≈ 93 млрд световых лет в диаметре",
      pt: "≈ 93 bilhões de anos-luz de diâmetro",
      ar: "≈ 93 مليار سنة ضوئية قطرًا",
      el: "≈ 93 δισ. έτη φωτός διάμετρος",
    },
    details: [
      {
        de: "Das beobachtbare Universum ist die Kugel um uns herum, aus der Licht seit dem Urknall Zeit hatte, uns zu erreichen. Ihr Durchmesser beträgt etwa 93 Milliarden Lichtjahre.",
        en: "The observable universe is the sphere around us from which light has had time to reach us since the Big Bang. Its diameter is about 93 billion light-years.",
        hi: "अवलोकनीय ब्रह्मांड वह गोला है जिसके भीतर महाविस्फोट के बाद से प्रकाश को हम तक पहुँचने का समय मिला है। इसका व्यास लगभग 93 अरब प्रकाश-वर्ष है।",
        zh: "可观测宇宙是我们周围的一个球体,自大爆炸以来光线有时间到达我们。它的直径约为930亿光年。",
        ko: "관측 가능한 우주는 빅뱅 이후 빛이 우리에게 도달할 시간이 있었던 우리 주변의 구형 영역이다. 그 지름은 약 930억 광년이다.",
        ja: "観測可能な宇宙とは、ビッグバン以降、光が私たちに届くだけの時間があった球状の領域を指す。その直径は約930億光年である。",
        es: "El universo observable es la esfera a nuestro alrededor desde la cual la luz ha tenido tiempo de llegar hasta nosotros desde el Big Bang. Su diámetro es de unos 93.000 millones de años luz.",
        fr: "L'univers observable est la sphère qui nous entoure, d'où la lumière a eu le temps de nous parvenir depuis le Big Bang. Son diamètre est d'environ 93 milliards d'années-lumière.",
        tr: "Gözlemlenebilir evren, Büyük Patlama'dan bu yana ışığın bize ulaşacak zamanı bulduğu çevremizdeki küredir. Çapı yaklaşık 93 milyar ışık yılıdır.",
        ru: "Наблюдаемая Вселенная — это сфера вокруг нас, из которой свет успел дойти до нас со времён Большого взрыва. Её диаметр составляет около 93 млрд световых лет.",
        pt: "O universo observável é a esfera ao nosso redor da qual a luz teve tempo de chegar até nós desde o Big Bang. Seu diâmetro é de cerca de 93 bilhões de anos-luz.",
        ar: "الكون المرئي هو الكرة المحيطة بنا التي كان للضوء فيها متسع من الوقت للوصول إلينا منذ الانفجار العظيم. يبلغ قطرها نحو 93 مليار سنة ضوئية.",
        el: "Το παρατηρήσιμο σύμπαν είναι η σφαίρα γύρω μας από την οποία το φως είχε χρόνο να μας φτάσει από τη Μεγάλη Έκρηξη. Η διάμετρός της είναι περίπου 93 δισ. έτη φωτός.",
      },
      {
        de: "Das ist größer als '13,8 Milliarden Lichtjahre in jede Richtung', weil sich der Raum selbst seit dem Urknall ausgedehnt hat — weit entfernte Galaxien sind heute viel weiter weg, als es die reine Lichtlaufzeit vermuten lässt.",
        en: "That's larger than '13.8 billion light-years in every direction' because space itself has expanded since the Big Bang — distant galaxies are now much farther away than the light's travel time alone would suggest.",
        hi: "यह '13.8 अरब प्रकाश-वर्ष प्रत्येक दिशा में' से बड़ा है क्योंकि महाविस्फोट के बाद से अंतरिक्ष स्वयं फैल चुका है — दूर की आकाशगंगाएँ आज केवल प्रकाश की यात्रा-अवधि से कहीं अधिक दूर हैं।",
        zh: "这比'每个方向138亿光年'要大,因为自大爆炸以来空间本身一直在膨胀——遥远的星系如今比单纯光行时间所暗示的要远得多。",
        ko: "이는 '모든 방향으로 138억 광년'보다 크다. 빅뱅 이후 공간 자체가 팽창했기 때문에, 멀리 있는 은하들은 빛의 이동 시간만으로 추정하는 것보다 훨씬 더 멀리 있다.",
        ja: "これは「あらゆる方向に138億光年」よりも大きい。ビッグバン以降、空間そのものが膨張してきたため、遠方の銀河は光の到達時間だけから推測されるよりもはるかに遠くにあるからだ。",
        es: "Esto es mayor que '13.800 millones de años luz en cada dirección' porque el propio espacio se ha expandido desde el Big Bang: las galaxias lejanas están hoy mucho más lejos de lo que sugeriría solo el tiempo de viaje de la luz.",
        fr: "C'est plus que « 13,8 milliards d'années-lumière dans chaque direction », car l'espace lui-même s'est dilaté depuis le Big Bang — les galaxies lointaines sont aujourd'hui bien plus éloignées que ne le suggérerait le seul temps de parcours de la lumière.",
        tr: "Bu, 'her yönde 13,8 milyar ışık yılı'ndan daha büyüktür çünkü Büyük Patlama'dan bu yana uzayın kendisi genişlemiştir — uzak galaksiler bugün, yalnızca ışığın kat ettiği süreden çok daha uzaktadır.",
        ru: "Это больше, чем «13,8 млрд световых лет в каждом направлении», потому что само пространство расширялось со времён Большого взрыва — далёкие галактики сейчас намного дальше, чем можно предположить исходя из одного лишь времени полёта света.",
        pt: "Isso é maior que '13,8 bilhões de anos-luz em cada direção' porque o próprio espaço se expandiu desde o Big Bang — galáxias distantes estão hoje muito mais longe do que o tempo de viagem da luz por si só sugeriria.",
        ar: "هذا أكبر من '13.8 مليار سنة ضوئية في كل اتجاه' لأن الفضاء نفسه تمدد منذ الانفجار العظيم — فالمجرات البعيدة أصبحت الآن أبعد بكثير مما يوحي به زمن سفر الضوء وحده.",
        el: "Αυτό είναι μεγαλύτερο από «13,8 δισ. έτη φωτός προς κάθε κατεύθυνση», επειδή ο ίδιος ο χώρος έχει διασταλεί από τη Μεγάλη Έκρηξη — οι μακρινοί γαλαξίες βρίσκονται σήμερα πολύ πιο μακριά απ' όσο θα υπέδειχνε μόνο ο χρόνος διαδρομής του φωτός.",
      },
      {
        de: "Das gesamte Universum könnte deutlich größer sein oder sogar unendlich — wir sehen nur den Teil, aus dem uns bisher Licht erreicht hat.",
        en: "The universe as a whole could be far larger, or even infinite — we only see the part from which light has reached us so far.",
        hi: "समूचा ब्रह्मांड कहीं अधिक बड़ा या यहाँ तक कि अनंत भी हो सकता है — हम केवल उस हिस्से को देखते हैं जहाँ से अब तक हमें प्रकाश मिला है।",
        zh: "整个宇宙可能远比这大得多,甚至是无限的——我们只能看到迄今光线已经到达我们的那一部分。",
        ko: "우주 전체는 훨씬 더 크거나 심지어 무한할 수도 있다. 우리는 지금까지 빛이 도달한 부분만을 볼 수 있을 뿐이다.",
        ja: "宇宙全体ははるかに大きい、あるいは無限である可能性さえある。私たちはこれまでに光が届いた部分しか見ることができない。",
        es: "El universo en su totalidad podría ser mucho más grande, o incluso infinito; solo vemos la parte de la que la luz ha logrado llegar hasta nosotros.",
        fr: "L'univers dans son ensemble pourrait être bien plus grand, voire infini — nous ne voyons que la partie d'où la lumière a eu le temps de nous parvenir.",
        tr: "Evrenin tamamı çok daha büyük, hatta sonsuz olabilir — biz yalnızca şimdiye kadar ışığın bize ulaştığı kısmını görüyoruz.",
        ru: "Вся Вселенная в целом может быть гораздо больше или даже бесконечной — мы видим лишь ту часть, из которой к нам уже успел дойти свет.",
        pt: "O universo como um todo pode ser muito maior, ou até infinito — vemos apenas a parte da qual a luz já conseguiu chegar até nós.",
        ar: "قد يكون الكون بأكمله أكبر بكثير، أو حتى لانهائيًا — فنحن لا نرى سوى الجزء الذي وصلنا منه الضوء حتى الآن.",
        el: "Το σύμπαν στο σύνολό του θα μπορούσε να είναι πολύ μεγαλύτερο, ή ακόμη και άπειρο — βλέπουμε μόνο το τμήμα από το οποίο μας έχει φτάσει φως μέχρι στιγμής.",
      },
    ],
    image: commonsFile("Hubble_ultra_deep_field_high_rez.jpg"),
  },
  {
    label: {
      de: "Galaxien (geschätzt)",
      en: "Galaxies (estimated)",
      hi: "आकाशगंगाएँ (अनुमानित)",
      zh: "星系(估计)",
      ko: "은하 (추정치)",
      ja: "銀河(推定)",
      es: "Galaxias (estimado)",
      fr: "Galaxies (estimation)",
      tr: "Galaksiler (tahmini)",
      ru: "Галактики (оценка)",
      pt: "Galáxias (estimado)",
      ar: "المجرات (تقديري)",
      el: "Γαλαξίες (εκτίμηση)",
    },
    value: {
      de: "≈ 2 Billionen",
      en: "≈ 2 trillion",
      hi: "≈ 2 खरब",
      zh: "约2万亿",
      ko: "약 2조 개",
      ja: "約2兆個",
      es: "≈ 2 billones",
      fr: "≈ 2 000 milliards",
      tr: "≈ 2 trilyon",
      ru: "≈ 2 трлн",
      pt: "≈ 2 trilhões",
      ar: "≈ 2 تريليون",
      el: "≈ 2 τρισεκατομμύρια",
    },
    details: [
      {
        de: "Frühere Schätzungen aus Hubble-Daten gingen von etwa 200 Milliarden Galaxien aus; eine Analyse von 2016 kam nach Hochrechnung sehr schwacher, kleiner Galaxien auf bis zu 2 Billionen.",
        en: "Earlier estimates from Hubble data suggested around 200 billion galaxies; a 2016 analysis, extrapolating very faint, small galaxies, arrived at up to 2 trillion.",
        hi: "हबल के आँकड़ों से पहले के अनुमान लगभग 200 अरब आकाशगंगाओं के थे; 2016 के एक विश्लेषण ने बहुत धुंधली, छोटी आकाशगंगाओं का अनुमान लगाकर 2 खरब तक का आँकड़ा निकाला।",
        zh: "早期基于哈勃数据的估计约为2000亿个星系;2016年的一项分析通过对极其暗弱的小星系进行推算,得出的数字高达2万亿个。",
        ko: "허블 데이터에 근거한 초기 추정치는 약 2,000억 개의 은하였다. 2016년 분석은 매우 희미하고 작은 은하들을 외삽하여 최대 2조 개에 이른다는 결과를 내놓았다.",
        ja: "ハッブルのデータに基づく初期の推定では、銀河の数はおよそ2000億個とされていた。2016年の分析では、非常に暗く小さな銀河を外挿した結果、最大2兆個という数字が導かれた。",
        es: "Las estimaciones anteriores basadas en datos del Hubble sugerían unas 200.000 millones de galaxias; un análisis de 2016, extrapolando galaxias pequeñas y muy tenues, llegó hasta 2 billones.",
        fr: "Les estimations antérieures basées sur les données de Hubble suggéraient environ 200 milliards de galaxies ; une analyse de 2016, extrapolant à partir de galaxies très faibles et petites, est arrivée jusqu'à 2 000 milliards.",
        tr: "Hubble verilerine dayanan önceki tahminler yaklaşık 200 milyar galaksi öngörüyordu; 2016'daki bir analiz, çok sönük ve küçük galaksileri ekstrapolasyon yaparak 2 trilyona kadar ulaştı.",
        ru: "Более ранние оценки на основе данных «Хаббла» указывали примерно на 200 млрд галактик; анализ 2016 года, экстраполируя очень тусклые мелкие галактики, дал цифру до 2 трлн.",
        pt: "Estimativas anteriores com base em dados do Hubble sugeriam cerca de 200 bilhões de galáxias; uma análise de 2016, extrapolando galáxias pequenas e muito fracas, chegou a até 2 trilhões.",
        ar: "أشارت التقديرات السابقة المستندة إلى بيانات هابل إلى نحو 200 مليار مجرة؛ وتوصل تحليل عام 2016، باستقراء المجرات الصغيرة الخافتة جدًا، إلى رقم يصل إلى 2 تريليون.",
        el: "Παλαιότερες εκτιμήσεις από δεδομένα του Hubble υπολόγιζαν περίπου 200 δισ. γαλαξίες· μια ανάλυση του 2016, προεκτείνοντας πολύ αμυδρούς, μικρούς γαλαξίες, έφτασε έως και τα 2 τρισεκατομμύρια.",
      },
      {
        de: "Neuere Auswertungen mit dem James-Webb-Weltraumteleskop deuten inzwischen eher wieder auf niedrigere zweistellige Milliardenwerte hin — die genaue Zahl bleibt Gegenstand aktiver Forschung.",
        en: "More recent analyses using the James Webb Space Telescope now point back toward a lower, two-digit-billion figure — the exact number remains an active area of research.",
        hi: "जेम्स वेब स्पेस टेलीस्कोप के साथ नए विश्लेषण अब फिर से कम, दो अंकों की अरब संख्या की ओर इशारा करते हैं — सटीक संख्या अभी भी सक्रिय शोध का विषय है।",
        zh: "利用詹姆斯·韦伯太空望远镜进行的最新分析,现在又倾向于一个更低的、两位数十亿级别的数字——确切数字仍是活跃研究的课题。",
        ko: "제임스 웹 우주망원경을 이용한 최근 분석들은 다시 두 자릿수 억 단위의 더 낮은 숫자를 가리키고 있다. 정확한 수치는 여전히 활발한 연구 주제로 남아 있다.",
        ja: "ジェイムズ・ウェッブ宇宙望遠鏡を用いた最近の分析では、再びもっと低い、2桁台の十億のオーダーの数字が示されつつある。正確な数はいまも活発な研究対象である。",
        es: "Análisis más recientes con el telescopio espacial James Webb apuntan ahora de nuevo hacia una cifra menor, de decenas de miles de millones; el número exacto sigue siendo objeto de investigación activa.",
        fr: "Des analyses plus récentes utilisant le télescope spatial James-Webb indiquent désormais un chiffre plus bas, de l'ordre de quelques dizaines de milliards — le nombre exact reste un sujet de recherche actif.",
        tr: "James Webb Uzay Teleskobu ile yapılan daha yeni analizler şimdi yeniden iki haneli milyarlık daha düşük bir rakama işaret ediyor — kesin sayı hâlâ aktif araştırma konusu.",
        ru: "Более поздние анализы с использованием телескопа Джеймса Уэбба снова указывают на меньшую цифру порядка десятков миллиардов — точное число остаётся предметом активных исследований.",
        pt: "Análises mais recentes usando o telescópio espacial James Webb agora apontam novamente para um número menor, na casa das dezenas de bilhões — o número exato continua sendo objeto de pesquisa ativa.",
        ar: "تشير التحليلات الأحدث باستخدام تلسكوب جيمس ويب الفضائي الآن مجددًا إلى رقم أقل يقع في نطاق عشرات المليارات — ويبقى الرقم الدقيق موضوع بحث نشط.",
        el: "Νεότερες αναλύσεις με το διαστημικό τηλεσκόπιο James Webb δείχνουν τώρα ξανά προς έναν χαμηλότερο, διψήφιο αριθμό δισεκατομμυρίων — ο ακριβής αριθμός παραμένει αντικείμενο ενεργού έρευνας.",
      },
      {
        de: "Jede dieser Galaxien enthält selbst wieder Hunderte Millionen bis Billionen Sterne — die schiere Größenordnung ist für den Menschen kaum intuitiv greifbar.",
        en: "Each of these galaxies in turn contains hundreds of millions to trillions of stars — the sheer scale is barely intuitive for a human mind to grasp.",
        hi: "इनमें से प्रत्येक आकाशगंगा में स्वयं सैकड़ों करोड़ से खरबों तारे होते हैं — मानव मस्तिष्क के लिए इस विशालता को समझना लगभग असंभव है।",
        zh: "而这些星系中的每一个又包含着数亿到数万亿颗恒星——如此庞大的规模,人类几乎难以直观理解。",
        ko: "이 은하들 각각은 다시 수억에서 수조 개의 별을 품고 있다. 그 엄청난 규모는 인간이 직관적으로 파악하기 거의 불가능하다.",
        ja: "これらの銀河のそれぞれには、さらに数億から数兆個もの恒星が含まれている。そのあまりの規模の大きさは、人間の直感ではほとんど捉えきれない。",
        es: "Cada una de estas galaxias contiene, a su vez, entre cientos de millones y billones de estrellas: la magnitud es apenas intuitiva para la mente humana.",
        fr: "Chacune de ces galaxies contient à son tour des centaines de millions à des milliers de milliards d'étoiles — une échelle presque impossible à saisir intuitivement pour un esprit humain.",
        tr: "Bu galaksilerin her biri kendi içinde yüzlerce milyondan trilyonlarca yıldıza sahip — bu ölçek insan zihni için neredeyse kavranamaz.",
        ru: "Каждая из этих галактик, в свою очередь, содержит от сотен миллионов до триллионов звёзд — сам масштаб едва ли поддаётся интуитивному восприятию человеком.",
        pt: "Cada uma dessas galáxias, por sua vez, contém centenas de milhões a trilhões de estrelas — a escala é quase impossível de captar intuitivamente para a mente humana.",
        ar: "تحتوي كل مجرة من هذه المجرات بدورها على مئات الملايين إلى تريليونات النجوم — وهذا الحجم الهائل يصعب على العقل البشري إدراكه بشكل بديهي.",
        el: "Καθένας από αυτούς τους γαλαξίες περιέχει με τη σειρά του εκατοντάδες εκατομμύρια έως τρισεκατομμύρια αστέρια — η ίδια η κλίμακα είναι σχεδόν αδύνατο να γίνει διαισθητικά αντιληπτή από τον άνθρωπο.",
      },
    ],
    image: commonsFile("NGC_4414_(NASA-med).jpg"),
  },
  {
    label: {
      de: "Sterne in der Milchstraße",
      en: "Stars in the Milky Way",
      hi: "आकाशगंगा में तारे",
      zh: "银河系中的恒星",
      ko: "은하수의 별",
      ja: "天の川銀河の恒星数",
      es: "Estrellas en la Vía Láctea",
      fr: "Étoiles dans la Voie lactée",
      tr: "Samanyolu'ndaki Yıldızlar",
      ru: "Звёзды в Млечном Пути",
      pt: "Estrelas na Via Láctea",
      ar: "النجوم في مجرة درب التبانة",
      el: "Αστέρια στον Γαλαξία μας",
    },
    value: {
      de: "100–400 Mrd.",
      en: "100–400 billion",
      hi: "100–400 अरब",
      zh: "1000亿–4000亿",
      ko: "1,000억–4,000억",
      ja: "1000億〜4000億",
      es: "100.000–400.000 millones",
      fr: "100 à 400 milliards",
      tr: "100–400 milyar",
      ru: "100–400 млрд",
      pt: "100–400 bilhões",
      ar: "100–400 مليار",
      el: "100–400 δισ.",
    },
    details: [
      {
        de: "Unsere Heimatgalaxie, die Milchstraße, ist eine Balken-Spiralgalaxie mit einem Durchmesser von etwa 100.000 Lichtjahren.",
        en: "Our home galaxy, the Milky Way, is a barred spiral galaxy roughly 100,000 light-years across.",
        hi: "हमारी मूल आकाशगंगा, मिल्की वे, एक बार्ड सर्पिल आकाशगंगा है जिसका व्यास लगभग 1,00,000 प्रकाश-वर्ष है।",
        zh: "我们的家园星系——银河系,是一个棒旋星系,直径约为10万光年。",
        ko: "우리의 고향 은하인 은하수는 지름이 약 10만 광년에 이르는 막대나선은하이다.",
        ja: "私たちの故郷の銀河である天の川銀河は、直径がおよそ10万光年の棒渦巻銀河である。",
        es: "Nuestra galaxia natal, la Vía Láctea, es una galaxia espiral barrada de unos 100.000 años luz de diámetro.",
        fr: "Notre galaxie, la Voie lactée, est une galaxie spirale barrée d'environ 100 000 années-lumière de diamètre.",
        tr: "Ev galaksimiz Samanyolu, yaklaşık 100.000 ışık yılı çapında çubuklu sarmal bir galaksidir.",
        ru: "Наша родная галактика, Млечный Путь, — спиральная галактика с перемычкой диаметром около 100 000 световых лет.",
        pt: "Nossa galáxia natal, a Via Láctea, é uma galáxia espiral barrada com cerca de 100.000 anos-luz de diâmetro.",
        ar: "مجرتنا الأم، درب التبانة، هي مجرة حلزونية مقوسة يبلغ قطرها نحو 100 ألف سنة ضوئية.",
        el: "Ο δικός μας γαλαξίας, ο Γαλαξίας, είναι ραβδωτός σπειροειδής γαλαξίας με διάμετρο περίπου 100.000 έτη φωτός.",
      },
      {
        de: "Die Sonne befindet sich in einem ihrer Spiralarme, rund 26.000 Lichtjahre vom galaktischen Zentrum entfernt, und umkreist dieses Zentrum einmal in etwa 225–250 Millionen Jahren.",
        en: "The Sun sits in one of its spiral arms, about 26,000 light-years from the galactic center, and completes one orbit around it roughly every 225–250 million years.",
        hi: "सूर्य इसकी एक सर्पिल भुजा में स्थित है, आकाशगंगा के केंद्र से लगभग 26,000 प्रकाश-वर्ष दूर, और इसके चारों ओर एक परिक्रमा लगभग 22.5–25 करोड़ वर्षों में पूरी करता है।",
        zh: "太阳位于其中一条旋臂上,距离银河系中心约2.6万光年,大约每2.25亿至2.5亿年绕银心公转一周。",
        ko: "태양은 은하 중심에서 약 2만 6,000광년 떨어진 나선팔 중 하나에 위치해 있으며, 약 2억 2,500만~2억 5,000만 년마다 은하 중심을 한 바퀴 공전한다.",
        ja: "太陽は銀河中心から約2万6000光年離れた渦巻き腕の一つに位置し、およそ2億2500万〜2億5000万年かけて銀河中心を一周する。",
        es: "El Sol se encuentra en uno de sus brazos espirales, a unos 26.000 años luz del centro galáctico, y completa una órbita alrededor de él cada 225–250 millones de años aproximadamente.",
        fr: "Le Soleil se trouve dans l'un de ses bras spiraux, à environ 26 000 années-lumière du centre galactique, et effectue une orbite complète autour de celui-ci en environ 225 à 250 millions d'années.",
        tr: "Güneş, galaktik merkezden yaklaşık 26.000 ışık yılı uzaklıkta bir sarmal kolda yer alır ve merkez etrafındaki turunu yaklaşık 225–250 milyon yılda tamamlar.",
        ru: "Солнце находится в одном из спиральных рукавов, примерно в 26 000 световых лет от центра галактики, и совершает один оборот вокруг него примерно за 225–250 млн лет.",
        pt: "O Sol está localizado em um de seus braços espirais, a cerca de 26.000 anos-luz do centro galáctico, e completa uma órbita ao redor dele a cada 225–250 milhões de anos.",
        ar: "تقع الشمس في أحد أذرعها الحلزونية، على بعد نحو 26 ألف سنة ضوئية من مركز المجرة، وتكمل دورة واحدة حوله كل 225–250 مليون سنة تقريبًا.",
        el: "Ο Ήλιος βρίσκεται σε έναν από τους σπειροειδείς βραχίονές του, περίπου 26.000 έτη φωτός από το γαλαξιακό κέντρο, και ολοκληρώνει μία περιφορά γύρω του κάθε 225–250 εκατομμύρια χρόνια περίπου.",
      },
      {
        de: "Die Unsicherheit bei der Sternenzahl (100–400 Milliarden) liegt daran, dass viele kleine, lichtschwache Sterne von der Erde aus kaum direkt zu zählen sind.",
        en: "The uncertainty in the star count (100–400 billion) comes from the fact that many small, faint stars are extremely hard to count directly from Earth.",
        hi: "तारों की संख्या (100–400 अरब) में अनिश्चितता इसलिए है क्योंकि कई छोटे, धुंधले तारों को पृथ्वी से सीधे गिनना लगभग असंभव है।",
        zh: "恒星数量(1000亿–4000亿)之所以存在不确定性,是因为许多微小、暗淡的恒星极难从地球上直接计数。",
        ko: "별의 개수(1,000억~4,000억 개)에 불확실성이 있는 이유는, 작고 희미한 많은 별들을 지구에서 직접 세는 것이 극도로 어렵기 때문이다.",
        ja: "恒星数(1000億〜4000億個)に不確実性があるのは、多くの小さく暗い恒星を地球から直接数えるのが極めて難しいためである。",
        es: "La incertidumbre en el número de estrellas (100.000–400.000 millones) se debe a que muchas estrellas pequeñas y tenues son extremadamente difíciles de contar directamente desde la Tierra.",
        fr: "L'incertitude sur le nombre d'étoiles (100 à 400 milliards) vient du fait que de nombreuses petites étoiles faibles sont extrêmement difficiles à compter directement depuis la Terre.",
        tr: "Yıldız sayısındaki belirsizlik (100–400 milyar), pek çok küçük ve sönük yıldızın Dünya'dan doğrudan sayılmasının son derece zor olmasından kaynaklanır.",
        ru: "Неопределённость в подсчёте звёзд (100–400 млрд) связана с тем, что многие мелкие тусклые звёзды крайне трудно сосчитать напрямую с Земли.",
        pt: "A incerteza na contagem de estrelas (100–400 bilhões) vem do fato de que muitas estrelas pequenas e fracas são extremamente difíceis de contar diretamente da Terra.",
        ar: "يعود عدم اليقين في عدد النجوم (100–400 مليار) إلى صعوبة عد الكثير من النجوم الصغيرة الخافتة مباشرة من الأرض.",
        el: "Η αβεβαιότητα στον αριθμό των αστεριών (100–400 δισ.) οφείλεται στο ότι πολλά μικρά, αμυδρά αστέρια είναι εξαιρετικά δύσκολο να μετρηθούν απευθείας από τη Γη.",
      },
    ],
    image: commonsFile("ESO-VLT-Laser-phot-33a-07.jpg"),
  },
  {
    label: {
      de: "Lichtgeschwindigkeit",
      en: "Speed of Light",
      hi: "प्रकाश की गति",
      zh: "光速",
      ko: "빛의 속도",
      ja: "光の速度",
      es: "Velocidad de la luz",
      fr: "Vitesse de la lumière",
      tr: "Işık Hızı",
      ru: "Скорость света",
      pt: "Velocidade da luz",
      ar: "سرعة الضوء",
      el: "Ταχύτητα του φωτός",
    },
    value: {
      de: "299.792 km/s",
      en: "299,792 km/s",
      hi: "2,99,792 किमी/से",
      zh: "299,792 千米/秒",
      ko: "초속 299,792km",
      ja: "秒速29万9792km",
      es: "299.792 km/s",
      fr: "299 792 km/s",
      tr: "299.792 km/sn",
      ru: "299 792 км/с",
      pt: "299.792 km/s",
      ar: "299,792 كم/ث",
      el: "299.792 χλμ/δλ",
    },
    details: [
      {
        de: "Die Lichtgeschwindigkeit im Vakuum (exakt 299.792.458 m/s) ist eine fundamentale Naturkonstante — nichts, was Information oder Materie überträgt, kann sie überschreiten.",
        en: "The speed of light in a vacuum (exactly 299,792,458 m/s) is a fundamental constant of nature — nothing that carries information or matter can exceed it.",
        hi: "निर्वात में प्रकाश की गति (ठीक 29,97,92,458 मी/से) एक मौलिक प्राकृतिक नियतांक है — जो भी सूचना या पदार्थ ले जाता है, वह इसे पार नहीं कर सकता।",
        zh: "真空中的光速(精确为每秒299,792,458米)是一个基本自然常数——任何传递信息或物质的东西都无法超越它。",
        ko: "진공에서의 빛의 속도(정확히 초속 299,792,458m)는 자연의 근본 상수이다. 정보나 물질을 실어 나르는 그 무엇도 이 속도를 넘어설 수 없다.",
        ja: "真空中の光速(正確には秒速2億9979万2458メートル)は、自然界の基本定数である。情報や物質を運ぶいかなるものも、この速度を超えることはできない。",
        es: "La velocidad de la luz en el vacío (exactamente 299.792.458 m/s) es una constante fundamental de la naturaleza: nada que transporte información o materia puede superarla.",
        fr: "La vitesse de la lumière dans le vide (exactement 299 792 458 m/s) est une constante fondamentale de la nature — rien de ce qui transporte de l'information ou de la matière ne peut la dépasser.",
        tr: "Boşlukta ışık hızı (tam olarak saniyede 299.792.458 metre), temel bir doğa sabitidir — bilgi veya madde taşıyan hiçbir şey bunu aşamaz.",
        ru: "Скорость света в вакууме (точно 299 792 458 м/с) — фундаментальная константа природы: ничто, переносящее информацию или материю, не может её превысить.",
        pt: "A velocidade da luz no vácuo (exatamente 299.792.458 m/s) é uma constante fundamental da natureza — nada que transporte informação ou matéria pode superá-la.",
        ar: "سرعة الضوء في الفراغ (299,792,458 م/ث بالضبط) ثابت أساسي من ثوابت الطبيعة — ولا يمكن لأي شيء ينقل معلومات أو مادة أن يتجاوزها.",
        el: "Η ταχύτητα του φωτός στο κενό (ακριβώς 299.792.458 μ/δλ) είναι μια θεμελιώδης σταθερά της φύσης — τίποτα που μεταφέρει πληροφορία ή ύλη δεν μπορεί να την ξεπεράσει.",
      },
      {
        de: "Sie ist auch die Grundlage von Einsteins spezieller Relativitätstheorie: Raum und Zeit verhalten sich so, dass die Lichtgeschwindigkeit für alle Beobachter gleich bleibt.",
        en: "It is also the foundation of Einstein's special theory of relativity: space and time behave in such a way that the speed of light stays the same for every observer.",
        hi: "यह आइंस्टीन के विशेष सापेक्षता सिद्धांत का आधार भी है: स्थान और समय इस तरह व्यवहार करते हैं कि प्रकाश की गति हर प्रेक्षक के लिए समान रहती है।",
        zh: "它也是爱因斯坦狭义相对论的基础:空间和时间以这样一种方式运作,使得光速对所有观察者而言都保持不变。",
        ko: "이는 또한 아인슈타인의 특수상대성이론의 토대이기도 하다. 공간과 시간은 모든 관측자에게 빛의 속도가 동일하게 유지되도록 작동한다.",
        ja: "これはまた、アインシュタインの特殊相対性理論の基盤でもある。空間と時間は、どの観測者にとっても光速が一定であるように振る舞う。",
        es: "También es la base de la teoría especial de la relatividad de Einstein: el espacio y el tiempo se comportan de tal manera que la velocidad de la luz permanece igual para todo observador.",
        fr: "Elle est aussi le fondement de la théorie de la relativité restreinte d'Einstein : l'espace et le temps se comportent de telle sorte que la vitesse de la lumière reste identique pour tout observateur.",
        tr: "Aynı zamanda Einstein'ın özel görelilik kuramının temelidir: Uzay ve zaman, ışık hızının her gözlemci için aynı kalacağı şekilde davranır.",
        ru: "Она также лежит в основе специальной теории относительности Эйнштейна: пространство и время ведут себя так, что скорость света остаётся одинаковой для всех наблюдателей.",
        pt: "Também é a base da teoria da relatividade especial de Einstein: o espaço e o tempo se comportam de tal forma que a velocidade da luz permanece a mesma para todo observador.",
        ar: "وهي أيضًا أساس نظرية النسبية الخاصة لأينشتاين: يتصرف الفضاء والزمن بطريقة تجعل سرعة الضوء ثابتة بالنسبة لجميع المراقبين.",
        el: "Αποτελεί επίσης τη βάση της ειδικής θεωρίας της σχετικότητας του Αϊνστάιν: ο χώρος και ο χρόνος συμπεριφέρονται με τέτοιο τρόπο ώστε η ταχύτητα του φωτός να παραμένει ίδια για κάθε παρατηρητή.",
      },
      {
        de: "Weil Licht endlich schnell ist, blicken wir beim Blick ins All immer in die Vergangenheit — das Sonnenlicht, das uns gerade erreicht, ist rund 8 Minuten alt.",
        en: "Because light travels at a finite speed, looking into space always means looking into the past — the sunlight reaching us right now is about 8 minutes old.",
        hi: "क्योंकि प्रकाश की गति सीमित है, अंतरिक्ष में देखना हमेशा अतीत में झाँकना है — जो सूर्य का प्रकाश अभी हम तक पहुँच रहा है, वह लगभग 8 मिनट पुराना है।",
        zh: "由于光速是有限的,仰望太空总是意味着回望过去——此刻到达我们这里的阳光,已经有大约8分钟的'年龄'了。",
        ko: "빛의 속도가 유한하기 때문에, 우주를 바라보는 것은 언제나 과거를 들여다보는 일이다. 지금 우리에게 도달하는 햇빛은 약 8분 전의 것이다.",
        ja: "光の速さには限りがあるため、宇宙を見上げることは常に過去を覗き込むことを意味する。いま私たちに届いている太陽光は、約8分前に発せられたものである。",
        es: "Como la luz viaja a una velocidad finita, mirar al espacio siempre significa mirar al pasado: la luz solar que nos llega en este momento tiene unos 8 minutos de antigüedad.",
        fr: "Comme la lumière voyage à une vitesse finie, regarder l'espace revient toujours à regarder le passé — la lumière du Soleil qui nous parvient à l'instant a environ 8 minutes.",
        tr: "Işık sonlu bir hızla hareket ettiği için uzaya bakmak her zaman geçmişe bakmak anlamına gelir — şu anda bize ulaşan güneş ışığı yaklaşık 8 dakika önce yola çıkmıştır.",
        ru: "Поскольку скорость света конечна, взгляд в космос всегда означает взгляд в прошлое — солнечный свет, достигающий нас прямо сейчас, «возрастом» около 8 минут.",
        pt: "Como a luz viaja a uma velocidade finita, olhar para o espaço sempre significa olhar para o passado — a luz solar que chega até nós agora tem cerca de 8 minutos de idade.",
        ar: "لأن الضوء يسير بسرعة محدودة، فإن النظر إلى الفضاء يعني دائمًا النظر إلى الماضي — ضوء الشمس الذي يصلنا الآن عمره نحو 8 دقائق.",
        el: "Επειδή το φως ταξιδεύει με πεπερασμένη ταχύτητα, το να κοιτάμε στο διάστημα σημαίνει πάντα ότι κοιτάμε στο παρελθόν — το ηλιακό φως που μας φτάνει αυτή τη στιγμή είναι περίπου 8 λεπτών.",
      },
    ],
    image: commonsFile("Earth_to_Sun_-_en.png"),
  },
  {
    label: {
      de: "Nächster Stern (Alpha Centauri)",
      en: "Nearest Star (Alpha Centauri)",
      hi: "निकटतम तारा (अल्फा सेंटौरी)",
      zh: "最近的恒星(半人马座α星)",
      ko: "가장 가까운 별 (알파 센타우리)",
      ja: "最も近い恒星(ケンタウルス座アルファ星)",
      es: "Estrella más cercana (Alfa Centauri)",
      fr: "Étoile la plus proche (Alpha du Centaure)",
      tr: "En Yakın Yıldız (Alpha Centauri)",
      ru: "Ближайшая звезда (Альфа Центавра)",
      pt: "Estrela mais próxima (Alfa Centauri)",
      ar: "أقرب نجم (ألفا سنتوري)",
      el: "Πλησιέστερο αστέρι (Άλφα Κενταύρου)",
    },
    value: {
      de: "4,25 Lichtjahre",
      en: "4.25 light-years",
      hi: "4.25 प्रकाश-वर्ष",
      zh: "4.25光年",
      ko: "4.25광년",
      ja: "4.25光年",
      es: "4,25 años luz",
      fr: "4,25 années-lumière",
      tr: "4,25 ışık yılı",
      ru: "4,25 световых лет",
      pt: "4,25 anos-luz",
      ar: "4.25 سنة ضوئية",
      el: "4,25 έτη φωτός",
    },
    details: [
      {
        de: "Proxima Centauri, Teil des Alpha-Centauri-Dreifachsystems, ist mit 4,25 Lichtjahren Entfernung der sonnennächste bekannte Stern.",
        en: "Proxima Centauri, part of the Alpha Centauri triple star system, is the closest known star to the Sun at 4.25 light-years away.",
        hi: "प्रॉक्सिमा सेंटौरी, जो अल्फा सेंटौरी त्रि-तारा प्रणाली का हिस्सा है, 4.25 प्रकाश-वर्ष की दूरी पर सूर्य के सबसे निकट ज्ञात तारा है।",
        zh: "比邻星是半人马座α三星系统的一部分,距离太阳4.25光年,是已知距太阳最近的恒星。",
        ko: "알파 센타우리 삼중성계의 일부인 프록시마 센타우리는 태양에서 4.25광년 떨어진, 알려진 것 중 가장 가까운 별이다.",
        ja: "ケンタウルス座アルファ星の三重連星系の一部であるプロキシマ・ケンタウリは、太陽から4.25光年の距離にあり、知られている中で太陽に最も近い恒星である。",
        es: "Próxima Centauri, parte del sistema estelar triple Alfa Centauri, es la estrella conocida más cercana al Sol, a 4,25 años luz de distancia.",
        fr: "Proxima du Centaure, qui fait partie du système stellaire triple Alpha du Centaure, est l'étoile connue la plus proche du Soleil, à 4,25 années-lumière.",
        tr: "Alpha Centauri üçlü yıldız sisteminin bir parçası olan Proxima Centauri, 4,25 ışık yılı uzaklığıyla Güneş'e en yakın bilinen yıldızdır.",
        ru: "Проксима Центавра, часть тройной звёздной системы Альфа Центавра, — ближайшая к Солнцу известная звезда на расстоянии 4,25 световых лет.",
        pt: "Próxima Centauri, parte do sistema estelar triplo Alfa Centauri, é a estrela conhecida mais próxima do Sol, a 4,25 anos-luz de distância.",
        ar: "بروكسيما سنتوري، وهو جزء من نظام ألفا سنتوري الثلاثي النجوم، هو أقرب نجم معروف إلى الشمس على بعد 4.25 سنة ضوئية.",
        el: "Ο Πρόξιμος Κενταύρου, μέρος του τριπλού αστρικού συστήματος Άλφα Κενταύρου, είναι το πλησιέστερο γνωστό αστέρι στον Ήλιο, σε απόσταση 4,25 ετών φωτός.",
      },
      {
        de: "Mit heutiger Raumfahrttechnik (chemische Raketen) würde eine Reise dorthin viele Zehntausende Jahre dauern — selbst mit den schnellsten je gebauten Sonden wären es noch Jahrtausende.",
        en: "With today's spaceflight technology (chemical rockets), a journey there would take many tens of thousands of years — even the fastest probes ever built would need millennia.",
        hi: "आज की अंतरिक्ष यात्रा तकनीक (रासायनिक राकेट) से वहाँ पहुँचने में कई दसियों हज़ार वर्ष लगेंगे — अब तक बनी सबसे तेज़ जांचों से भी हज़ारों वर्ष लगेंगे।",
        zh: "以今天的航天技术(化学火箭)前往那里将需要数万年——即使是有史以来建造的最快探测器,也需要数千年。",
        ko: "오늘날의 우주비행 기술(화학 로켓)로는 그곳까지 가는 데 수만 년이 걸릴 것이다. 지금까지 만들어진 가장 빠른 탐사선으로도 수천 년이 필요할 것이다.",
        ja: "現在の宇宙飛行技術(化学ロケット)では、そこへ到達するのに数万年もかかるだろう。これまでに作られた最も高速な探査機を使っても、なお数千年を要する。",
        es: "Con la tecnología espacial actual (cohetes químicos), un viaje hasta allí tardaría muchas decenas de miles de años; incluso con las sondas más rápidas jamás construidas se necesitarían milenios.",
        fr: "Avec la technologie spatiale actuelle (fusées chimiques), un voyage jusque-là prendrait plusieurs dizaines de milliers d'années — même avec les sondes les plus rapides jamais construites, il faudrait encore des millénaires.",
        tr: "Günümüz uzay uçuş teknolojisiyle (kimyasal roketler) oraya bir yolculuk onlarca bin yıl sürerdi — bugüne kadar yapılmış en hızlı sondalarla bile binlerce yıl gerekirdi.",
        ru: "При современных технологиях космических полётов (химические ракеты) путешествие туда заняло бы много десятков тысяч лет — даже самым быстрым из когда-либо построенных зондов потребовались бы тысячелетия.",
        pt: "Com a tecnologia espacial atual (foguetes químicos), uma viagem até lá levaria muitas dezenas de milhares de anos — mesmo com as sondas mais rápidas já construídas, seriam necessários milênios.",
        ar: "بتقنية الطيران الفضائي الحالية (الصواريخ الكيميائية)، ستستغرق الرحلة إلى هناك عشرات الآلاف من السنين — وحتى أسرع المسبارات التي بُنيت على الإطلاق ستحتاج إلى آلاف السنين.",
        el: "Με τη σημερινή τεχνολογία διαστημικών πτήσεων (χημικοί πύραυλοι), ένα ταξίδι εκεί θα διαρκούσε πολλές δεκάδες χιλιάδες χρόνια — ακόμη και με τους ταχύτερους ανιχνευτές που έχουν κατασκευαστεί ποτέ, θα χρειάζονταν χιλιετίες.",
      },
      {
        de: "Um Proxima Centauri kreist mindestens ein erdgroßer Exoplanet in der sogenannten habitablen Zone, was ihn zu einem viel diskutierten Ziel für zukünftige interstellare Missionskonzepte macht.",
        en: "At least one Earth-sized exoplanet orbits Proxima Centauri within its so-called habitable zone, making it a much-discussed target for future interstellar mission concepts.",
        hi: "प्रॉक्सिमा सेंटौरी के चारों ओर तथाकथित 'रहने योग्य क्षेत्र' में कम से कम एक पृथ्वी के आकार का बाह्यग्रह परिक्रमा करता है, जो इसे भविष्य की अंतरतारकीय मिशन अवधारणाओं के लिए एक चर्चित लक्ष्य बनाता है।",
        zh: "至少有一颗与地球大小相近的系外行星在所谓的宜居带内绕比邻星运行,这使它成为未来星际任务构想中备受讨论的目标。",
        ko: "적어도 하나의 지구 크기 외계행성이 이른바 '생명체 거주 가능 영역' 내에서 프록시마 센타우리를 공전하고 있으며, 이는 미래의 성간 탐사 계획에서 많이 논의되는 목표가 되고 있다.",
        ja: "プロキシマ・ケンタウリの周りには、いわゆる「ハビタブルゾーン」内を公転する地球サイズの系外惑星が少なくとも1つ存在し、将来の恒星間探査構想における注目の対象となっている。",
        es: "Al menos un exoplaneta del tamaño de la Tierra orbita Próxima Centauri dentro de su llamada zona habitable, lo que lo convierte en un objetivo muy debatido para futuros conceptos de misiones interestelares.",
        fr: "Au moins une exoplanète de la taille de la Terre orbite autour de Proxima du Centaure dans sa zone dite habitable, ce qui en fait une cible très discutée pour de futurs concepts de missions interstellaires.",
        tr: "Proxima Centauri etrafında sözde yaşanabilir bölgede en az bir Dünya büyüklüğünde ötegezegen dolanmaktadır; bu da onu gelecekteki yıldızlararası görev konseptleri için çokça tartışılan bir hedef hâline getirir.",
        ru: "Вокруг Проксимы Центавра в так называемой обитаемой зоне вращается как минимум одна экзопланета размером с Землю, что делает её широко обсуждаемой целью для будущих концепций межзвёздных миссий.",
        pt: "Pelo menos um exoplaneta do tamanho da Terra orbita Próxima Centauri em sua chamada zona habitável, tornando-a um alvo muito discutido para futuros conceitos de missões interestelares.",
        ar: "يدور كوكب خارجي واحد على الأقل بحجم الأرض حول بروكسيما سنتوري ضمن ما يُعرف بالمنطقة الصالحة للحياة، مما يجعله هدفًا كثير النقاش لمفاهيم المهمات بين النجمية المستقبلية.",
        el: "Τουλάχιστον ένας εξωπλανήτης στο μέγεθος της Γης περιφέρεται γύρω από τον Πρόξιμο Κενταύρου εντός της λεγόμενης κατοικήσιμης ζώνης, γεγονός που τον καθιστά πολυσυζητημένο στόχο για μελλοντικές έννοιες διαστρικών αποστολών.",
      },
    ],
    image: commonsFile("New_shot_of_Proxima_Centauri,_our_nearest_neighbour.jpg"),
  },
  {
    label: {
      de: "Dunkle Materie",
      en: "Dark Matter",
      hi: "डार्क मैटर",
      zh: "暗物质",
      ko: "암흑물질",
      ja: "ダークマター",
      es: "Materia oscura",
      fr: "Matière noire",
      tr: "Karanlık Madde",
      ru: "Тёмная материя",
      pt: "Matéria escura",
      ar: "المادة المظلمة",
      el: "Σκοτεινή ύλη",
    },
    value: {
      de: "≈ 27 % des Universums",
      en: "≈ 27% of the universe",
      hi: "≈ ब्रह्मांड का 27%",
      zh: "约占宇宙27%",
      ko: "우주의 약 27%",
      ja: "宇宙の約27%",
      es: "≈ 27 % del universo",
      fr: "≈ 27 % de l'univers",
      tr: "Evrenin ≈ %27'si",
      ru: "≈ 27% Вселенной",
      pt: "≈ 27% do universo",
      ar: "≈ 27٪ من الكون",
      el: "≈ 27% του σύμπαντος",
    },
    details: [
      {
        de: "Dunkle Materie sendet kein Licht aus und lässt sich nicht direkt beobachten — ihre Existenz wird aus ihrer Schwerkraftwirkung geschlossen, etwa daraus, dass sich Galaxien viel schneller drehen, als ihre sichtbare Masse allein erklären könnte.",
        en: "Dark matter emits no light and cannot be observed directly — its existence is inferred from its gravitational effects, such as galaxies rotating far faster than their visible mass alone could explain.",
        hi: "डार्क मैटर कोई प्रकाश उत्सर्जित नहीं करता और सीधे देखा नहीं जा सकता — इसका अस्तित्व इसके गुरुत्वाकर्षण प्रभावों से निकाला जाता है, जैसे कि आकाशगंगाएँ अपने दृश्य द्रव्यमान से कहीं अधिक तेज़ घूमती हैं।",
        zh: "暗物质不发光,也无法被直接观测——它的存在是通过其引力效应推断出来的,比如星系旋转的速度远快于其可见质量所能解释的程度。",
        ko: "암흑물질은 빛을 방출하지 않으며 직접 관측할 수 없다. 그 존재는 중력 효과를 통해 추론되는데, 예를 들어 은하들이 보이는 질량만으로 설명할 수 있는 것보다 훨씬 빠르게 회전한다는 사실에서 드러난다.",
        ja: "ダークマターは光を放たず、直接観測することはできない。その存在は、銀河が目に見える質量だけでは説明できないほど速く回転していることなど、重力による影響から推測されている。",
        es: "La materia oscura no emite luz y no puede observarse directamente; su existencia se infiere de sus efectos gravitacionales, como el hecho de que las galaxias giran mucho más rápido de lo que su masa visible por sí sola podría explicar.",
        fr: "La matière noire n'émet aucune lumière et ne peut être observée directement — son existence est déduite de ses effets gravitationnels, comme le fait que les galaxies tournent bien plus vite que ne pourrait l'expliquer leur seule masse visible.",
        tr: "Karanlık madde ışık yaymaz ve doğrudan gözlemlenemez — varlığı, galaksilerin görünür kütlelerinin açıklayabileceğinden çok daha hızlı dönmesi gibi kütleçekimsel etkilerinden çıkarılır.",
        ru: "Тёмная материя не излучает света и не может наблюдаться напрямую — о её существовании судят по гравитационным эффектам, например по тому, что галактики вращаются намного быстрее, чем можно объяснить одной лишь видимой массой.",
        pt: "A matéria escura não emite luz e não pode ser observada diretamente — sua existência é inferida a partir de seus efeitos gravitacionais, como o fato de galáxias girarem muito mais rápido do que sua massa visível por si só poderia explicar.",
        ar: "لا تصدر المادة المظلمة أي ضوء ولا يمكن رصدها مباشرة — يُستدل على وجودها من تأثيراتها الجاذبية، مثل دوران المجرات بسرعة أكبر بكثير مما يمكن أن تفسره كتلتها المرئية وحدها.",
        el: "Η σκοτεινή ύλη δεν εκπέμπει φως και δεν μπορεί να παρατηρηθεί άμεσα — η ύπαρξή της συνάγεται από τις βαρυτικές της επιδράσεις, όπως το ότι οι γαλαξίες περιστρέφονται πολύ πιο γρήγορα απ' όσο θα μπορούσε να εξηγήσει η ορατή τους μάζα.",
      },
      {
        de: "Sie macht schätzungsweise rund 27 % des gesamten Energieinhalts des Universums aus — gewöhnliche (sichtbare) Materie dagegen nur etwa 5 %.",
        en: "It is estimated to make up around 27% of the universe's total energy content — ordinary (visible) matter, by contrast, only about 5%.",
        hi: "अनुमान है कि यह ब्रह्मांड की कुल ऊर्जा का लगभग 27% है — जबकि सामान्य (दृश्य) पदार्थ केवल लगभग 5% है।",
        zh: "据估计,它约占宇宙总能量含量的27%——相比之下,普通(可见)物质仅占约5%。",
        ko: "이는 우주 전체 에너지 함량의 약 27%를 차지하는 것으로 추정된다. 반면 일반(보이는) 물질은 약 5%에 불과하다.",
        ja: "宇宙の全エネルギー量の約27%を占めると推定されている。これに対し、通常の(目に見える)物質はわずか約5%にすぎない。",
        es: "Se estima que constituye alrededor del 27 % del contenido energético total del universo; la materia ordinaria (visible), en cambio, solo alrededor del 5 %.",
        fr: "Elle représenterait environ 27 % du contenu énergétique total de l'univers, contre seulement environ 5 % pour la matière ordinaire (visible).",
        tr: "Evrenin toplam enerji içeriğinin yaklaşık %27'sini oluşturduğu tahmin edilmektedir — buna karşın sıradan (görünür) madde yalnızca yaklaşık %5'tir.",
        ru: "По оценкам, она составляет около 27% всей энергии Вселенной — тогда как обычная (видимая) материя — лишь около 5%.",
        pt: "Estima-se que represente cerca de 27% do conteúdo energético total do universo — a matéria comum (visível), por outro lado, apenas cerca de 5%.",
        ar: "يُقدَّر أنها تشكل نحو 27٪ من إجمالي محتوى الطاقة في الكون — في حين لا تشكل المادة العادية (المرئية) سوى نحو 5٪.",
        el: "Εκτιμάται ότι αποτελεί περίπου το 27% του συνολικού ενεργειακού περιεχομένου του σύμπαντος — η συνήθης (ορατή) ύλη, αντίθετα, μόλις το 5% περίπου.",
      },
      {
        de: "Woraus Dunkle Materie tatsächlich besteht, ist bis heute ungeklärt — sie zählt zu den größten offenen Fragen der modernen Physik.",
        en: "What dark matter is actually made of remains unresolved to this day — it is one of the biggest open questions in modern physics.",
        hi: "डार्क मैटर वास्तव में किससे बना है, यह आज तक अनसुलझा है — यह आधुनिक भौतिकी के सबसे बड़े खुले प्रश्नों में से एक है।",
        zh: "暗物质究竟由什么构成,至今仍是未解之谜——它是现代物理学最大的悬而未决的问题之一。",
        ko: "암흑물질이 실제로 무엇으로 이루어져 있는지는 오늘날까지도 풀리지 않은 문제로 남아 있다. 이는 현대 물리학의 가장 큰 미해결 질문 중 하나이다.",
        ja: "ダークマターが実際に何でできているのかは、今日まで解明されていない。これは現代物理学における最大の未解決問題の一つである。",
        es: "De qué está hecha realmente la materia oscura sigue sin resolverse hasta hoy: es una de las mayores preguntas abiertas de la física moderna.",
        fr: "La composition exacte de la matière noire reste à ce jour un mystère — c'est l'une des plus grandes questions ouvertes de la physique moderne.",
        tr: "Karanlık maddenin gerçekte neden oluştuğu bugüne kadar çözülememiştir — modern fiziğin en büyük açık sorularından biridir.",
        ru: "Из чего на самом деле состоит тёмная материя, до сих пор неясно — это один из главных открытых вопросов современной физики.",
        pt: "Do que a matéria escura realmente é feita permanece sem resposta até hoje — é uma das maiores questões em aberto da física moderna.",
        ar: "ما تتكون منه المادة المظلمة فعليًا لا يزال غير محسوم حتى اليوم — وهو من أكبر الأسئلة المفتوحة في الفيزياء الحديثة.",
        el: "Το από τι αποτελείται πραγματικά η σκοτεινή ύλη παραμένει άλυτο μέχρι σήμερα — είναι ένα από τα μεγαλύτερα ανοιχτά ερωτήματα της σύγχρονης φυσικής.",
      },
    ],
    image: commonsFile("Bullet_cluster.jpg"),
  },
  {
    label: {
      de: "Dunkle Energie",
      en: "Dark Energy",
      hi: "डार्क एनर्जी",
      zh: "暗能量",
      ko: "암흑에너지",
      ja: "ダークエネルギー",
      es: "Energía oscura",
      fr: "Énergie noire",
      tr: "Karanlık Enerji",
      ru: "Тёмная энергия",
      pt: "Energia escura",
      ar: "الطاقة المظلمة",
      el: "Σκοτεινή ενέργεια",
    },
    value: {
      de: "≈ 68 % des Universums",
      en: "≈ 68% of the universe",
      hi: "≈ ब्रह्मांड का 68%",
      zh: "约占宇宙68%",
      ko: "우주의 약 68%",
      ja: "宇宙の約68%",
      es: "≈ 68 % del universo",
      fr: "≈ 68 % de l'univers",
      tr: "Evrenin ≈ %68'i",
      ru: "≈ 68% Вселенной",
      pt: "≈ 68% do universo",
      ar: "≈ 68٪ من الكون",
      el: "≈ 68% του σύμπαντος",
    },
    details: [
      {
        de: "Dunkle Energie ist der Name für das, was die beschleunigte Ausdehnung des Universums antreibt — sie macht mit rund 68 % den größten Anteil am gesamten Energieinhalt des Kosmos aus.",
        en: "Dark energy is the name for whatever drives the universe's accelerating expansion — at around 68%, it makes up the largest share of the cosmos's total energy content.",
        hi: "डार्क एनर्जी उस चीज़ का नाम है जो ब्रह्मांड के त्वरित विस्तार को संचालित करती है — लगभग 68% के साथ यह ब्रह्मांड की कुल ऊर्जा सामग्री का सबसे बड़ा हिस्सा है।",
        zh: "暗能量是驱动宇宙加速膨胀的力量的名称——约占68%,是宇宙总能量含量中占比最大的部分。",
        ko: "암흑에너지는 우주의 가속 팽창을 일으키는 무언가에 붙여진 이름이다. 약 68%로, 우주 전체 에너지 함량 중 가장 큰 비중을 차지한다.",
        ja: "ダークエネルギーとは、宇宙の加速膨張を引き起こしている何かを指す名称である。約68%を占め、宇宙の全エネルギー量の中で最大の割合を占める。",
        es: "La energía oscura es el nombre que se da a lo que impulsa la expansión acelerada del universo; con un 68 % aproximadamente, representa la mayor parte del contenido energético total del cosmos.",
        fr: "L'énergie noire est le nom donné à ce qui pousse l'expansion accélérée de l'univers — avec environ 68 %, elle représente la plus grande part du contenu énergétique total du cosmos.",
        tr: "Karanlık enerji, evrenin hızlanan genişlemesini yönlendiren şeye verilen addır — yaklaşık %68 ile kozmosun toplam enerji içeriğinin en büyük payını oluşturur.",
        ru: "Тёмная энергия — это название того, что движет ускоренным расширением Вселенной; составляя около 68%, она занимает наибольшую долю в общем энергетическом балансе космоса.",
        pt: "Energia escura é o nome dado a tudo o que impulsiona a expansão acelerada do universo — com cerca de 68%, ela representa a maior parcela do conteúdo energético total do cosmos.",
        ar: "الطاقة المظلمة هي اسم لما يدفع التمدد المتسارع للكون — وتشكل بنحو 68٪ أكبر حصة من إجمالي محتوى الطاقة في الكون.",
        el: "Σκοτεινή ενέργεια είναι το όνομα για ό,τι προκαλεί την επιταχυνόμενη διαστολή του σύμπαντος — με περίπου 68%, αποτελεί το μεγαλύτερο μερίδιο του συνολικού ενεργειακού περιεχομένου του σύμπαντος.",
      },
      {
        de: "Entdeckt wurde die beschleunigte Expansion Ende der 1990er durch Beobachtungen weit entfernter Supernovae, wofür 2011 der Physik-Nobelpreis vergeben wurde.",
        en: "The accelerating expansion was discovered in the late 1990s through observations of distant supernovae, work that was awarded the 2011 Nobel Prize in Physics.",
        hi: "त्वरित विस्तार की खोज 1990 के दशक के अंत में दूर की सुपरनोवाओं के अवलोकनों से हुई थी, जिसके लिए 2011 का भौतिकी नोबेल पुरस्कार दिया गया।",
        zh: "加速膨胀是在1990年代末通过对遥远超新星的观测发现的,这项工作获得了2011年诺贝尔物理学奖。",
        ko: "가속 팽창은 1990년대 후반 멀리 있는 초신성 관측을 통해 발견되었으며, 이 연구는 2011년 노벨 물리학상을 수상했다.",
        ja: "加速膨張は1990年代後半、遠方の超新星の観測によって発見され、この業績は2011年のノーベル物理学賞を受賞した。",
        es: "La expansión acelerada se descubrió a finales de la década de 1990 mediante observaciones de supernovas lejanas, trabajo que recibió el Premio Nobel de Física en 2011.",
        fr: "L'expansion accélérée a été découverte à la fin des années 1990 grâce à l'observation de supernovae lointaines, travaux récompensés par le prix Nobel de physique en 2011.",
        tr: "Hızlanan genişleme, 1990'ların sonlarında uzak süpernovaların gözlemlenmesiyle keşfedildi; bu çalışma 2011 Nobel Fizik Ödülü'ne layık görüldü.",
        ru: "Ускоренное расширение было открыто в конце 1990-х годов благодаря наблюдениям далёких сверхновых — за эту работу в 2011 году была присуждена Нобелевская премия по физике.",
        pt: "A expansão acelerada foi descoberta no final da década de 1990 por meio de observações de supernovas distantes, trabalho que recebeu o Prêmio Nobel de Física em 2011.",
        ar: "اكتُشف التمدد المتسارع في أواخر التسعينيات من خلال رصد مستعرات عظمى بعيدة، وهو العمل الذي مُنح جائزة نوبل في الفيزياء عام 2011.",
        el: "Η επιταχυνόμενη διαστολή ανακαλύφθηκε στα τέλη της δεκαετίας του 1990 μέσω παρατηρήσεων μακρινών υπερκαινοφανών αστέρων, έρευνα που τιμήθηκε με το Νόμπελ Φυσικής το 2011.",
      },
      {
        de: "Zusammen mit Dunkler Materie bedeutet das: Nur etwa 5 % des Universums bestehen aus der 'gewöhnlichen' Materie, aus der Sterne, Planeten und wir selbst gemacht sind.",
        en: "Together with dark matter, this means only about 5% of the universe consists of the 'ordinary' matter that stars, planets, and we ourselves are made of.",
        hi: "डार्क मैटर के साथ मिलाकर इसका अर्थ है: ब्रह्मांड का केवल लगभग 5% ही उस 'सामान्य' पदार्थ से बना है जिससे तारे, ग्रह और स्वयं हम बने हैं।",
        zh: "与暗物质合计,这意味着宇宙中只有约5%是由构成恒星、行星和我们自身的'普通'物质组成的。",
        ko: "암흑물질과 합쳐서 보면, 우주에서 별과 행성, 그리고 우리 자신을 이루는 '일반' 물질은 약 5%에 불과하다는 뜻이다.",
        ja: "ダークマターと合わせると、宇宙のうち恒星や惑星、そして私たち自身を構成する「通常の」物質はわずか約5%にすぎないことになる。",
        es: "Junto con la materia oscura, esto significa que solo alrededor del 5 % del universo está formado por la materia 'ordinaria' de la que están hechos las estrellas, los planetas y nosotros mismos.",
        fr: "Avec la matière noire, cela signifie que seuls environ 5 % de l'univers sont constitués de la matière « ordinaire » dont sont faits les étoiles, les planètes et nous-mêmes.",
        tr: "Karanlık madde ile birlikte bu, evrenin yalnızca yaklaşık %5'inin yıldızları, gezegenleri ve bizleri oluşturan 'sıradan' maddeden meydana geldiği anlamına gelir.",
        ru: "Вместе с тёмной материей это означает, что лишь около 5% Вселенной состоит из «обычной» материи, из которой сделаны звёзды, планеты и мы сами.",
        pt: "Junto com a matéria escura, isso significa que apenas cerca de 5% do universo consiste na matéria 'comum' da qual estrelas, planetas e nós mesmos somos feitos.",
        ar: "بالإضافة إلى المادة المظلمة، يعني هذا أن نحو 5٪ فقط من الكون يتكون من المادة 'العادية' التي تصنع منها النجوم والكواكب ونحن أنفسنا.",
        el: "Μαζί με τη σκοτεινή ύλη, αυτό σημαίνει ότι μόνο περίπου το 5% του σύμπαντος αποτελείται από τη «συνήθη» ύλη από την οποία είναι φτιαγμένα τα αστέρια, οι πλανήτες και εμείς οι ίδιοι.",
      },
    ],
    image: commonsFile("Universe_expansion-en.svg"),
  },
  {
    label: {
      de: "Schwarze Löcher",
      en: "Black Holes",
      hi: "ब्लैक होल",
      zh: "黑洞",
      ko: "블랙홀",
      ja: "ブラックホール",
      es: "Agujeros negros",
      fr: "Trous noirs",
      tr: "Kara Delikler",
      ru: "Чёрные дыры",
      pt: "Buracos negros",
      ar: "الثقوب السوداء",
      el: "Μαύρες τρύπες",
    },
    value: {
      de: "bis zu Milliarden Sonnenmassen",
      en: "up to billions of solar masses",
      hi: "सूर्य के अरबों गुना द्रव्यमान तक",
      zh: "最高可达数十亿倍太阳质量",
      ko: "최대 태양 질량의 수십억 배",
      ja: "最大で太陽質量の数十億倍",
      es: "hasta miles de millones de masas solares",
      fr: "jusqu'à des milliards de masses solaires",
      tr: "milyarlarca Güneş kütlesine kadar",
      ru: "до миллиардов солнечных масс",
      pt: "até bilhões de massas solares",
      ar: "حتى مليارات من كتلة الشمس",
      el: "έως δισεκατομμύρια ηλιακές μάζες",
    },
    details: [
      {
        de: "Ein Schwarzes Loch entsteht, wenn Masse so extrem konzentriert ist, dass selbst Licht seine Anziehungskraft nicht mehr überwinden kann — die Grenze dazu heißt Ereignishorizont.",
        en: "A black hole forms when mass is so extremely concentrated that not even light can escape its pull — the boundary is called the event horizon.",
        hi: "एक ब्लैक होल तब बनता है जब द्रव्यमान इतना अत्यधिक संकेंद्रित होता है कि प्रकाश भी इसके आकर्षण से बच नहीं सकता — इस सीमा को घटना क्षितिज कहा जाता है।",
        zh: "当质量极度集中到连光都无法逃脱其引力时,黑洞便形成了——这个边界被称为事件视界。",
        ko: "블랙홀은 질량이 너무 극단적으로 집중되어 빛조차 그 인력을 벗어날 수 없을 때 형성된다. 그 경계를 사건의 지평선이라고 부른다.",
        ja: "ブラックホールは、質量が極端に凝縮され、光さえもその重力から逃れられなくなったときに形成される。その境界線は事象の地平面と呼ばれる。",
        es: "Un agujero negro se forma cuando la masa está tan extremadamente concentrada que ni siquiera la luz puede escapar de su atracción; ese límite se llama horizonte de sucesos.",
        fr: "Un trou noir se forme lorsque la masse est si extrêmement concentrée que même la lumière ne peut échapper à son attraction — cette limite s'appelle l'horizon des événements.",
        tr: "Bir kara delik, kütle o kadar aşırı yoğunlaşır ki ışık bile onun çekiminden kaçamaz hale geldiğinde oluşur — bu sınıra olay ufku denir.",
        ru: "Чёрная дыра образуется, когда масса настолько сильно сконцентрирована, что даже свет не может преодолеть её притяжение — эта граница называется горизонтом событий.",
        pt: "Um buraco negro se forma quando a massa está tão extremamente concentrada que nem mesmo a luz consegue escapar de sua atração — esse limite é chamado de horizonte de eventos.",
        ar: "يتشكل الثقب الأسود عندما تكون الكتلة مركّزة بشكل شديد لدرجة أن حتى الضوء لا يستطيع الإفلات من جاذبيته — وتُسمى هذه الحدود أفق الحدث.",
        el: "Μια μαύρη τρύπα σχηματίζεται όταν η μάζα είναι τόσο εξαιρετικά συμπυκνωμένη που ούτε το φως δεν μπορεί να ξεφύγει από την έλξη της — το όριο αυτό ονομάζεται ορίζοντας γεγονότων.",
      },
      {
        de: "Im Zentrum fast jeder großen Galaxie sitzt vermutlich ein supermassereiches Schwarzes Loch; das der Milchstraße (Sagittarius A*) hat etwa 4 Millionen Sonnenmassen.",
        en: "A supermassive black hole is thought to sit at the center of almost every large galaxy; the Milky Way's (Sagittarius A*) has about 4 million solar masses.",
        hi: "लगभग हर बड़ी आकाशगंगा के केंद्र में एक सुपरमैसिव ब्लैक होल माना जाता है; मिल्की वे का (सैजिटेरियस A*) लगभग 40 लाख सौर द्रव्यमान का है।",
        zh: "几乎每个大型星系的中心都被认为潜藏着一个超大质量黑洞;银河系的黑洞(人马座A*)约有400万倍太阳质量。",
        ko: "거의 모든 대형 은하의 중심에는 초대질량 블랙홀이 자리 잡고 있는 것으로 여겨진다. 은하수의 블랙홀(궁수자리 A*)은 태양 질량의 약 400만 배에 달한다.",
        ja: "ほぼすべての大型銀河の中心には超大質量ブラックホールが存在すると考えられている。天の川銀河のもの(いて座A*)は、太陽質量の約400万倍である。",
        es: "Se cree que un agujero negro supermasivo se encuentra en el centro de casi todas las grandes galaxias; el de la Vía Láctea (Sagitario A*) tiene unas 4 millones de masas solares.",
        fr: "On pense qu'un trou noir supermassif se trouve au centre de presque toutes les grandes galaxies ; celui de la Voie lactée (Sagittarius A*) possède environ 4 millions de masses solaires.",
        tr: "Neredeyse her büyük galaksinin merkezinde bir süper kütleli kara deliğin bulunduğu düşünülmektedir; Samanyolu'ndaki (Sagittarius A*) yaklaşık 4 milyon Güneş kütlesine sahiptir.",
        ru: "Считается, что в центре почти каждой крупной галактики находится сверхмассивная чёрная дыра; чёрная дыра Млечного Пути (Стрелец A*) обладает массой около 4 миллионов солнечных масс.",
        pt: "Acredita-se que um buraco negro supermassivo esteja no centro de quase todas as grandes galáxias; o da Via Láctea (Sagitário A*) tem cerca de 4 milhões de massas solares.",
        ar: "يُعتقد أن ثقبًا أسود فائق الكتلة يقبع في مركز كل مجرة كبيرة تقريبًا؛ ويبلغ حجم الثقب الأسود في درب التبانة (Sagittarius A*) نحو 4 ملايين كتلة شمسية.",
        el: "Μια υπερμαζική μαύρη τρύπα πιστεύεται ότι βρίσκεται στο κέντρο σχεδόν κάθε μεγάλου γαλαξία· αυτή του Γαλαξία μας (Sagittarius A*) έχει περίπου 4 εκατομμύρια ηλιακές μάζες.",
      },
      {
        de: "2019 gelang mit dem Event Horizon Telescope die erste direkte Abbildung eines Schwarzen Lochs (in der Galaxie M87) — ein Meilenstein der Astronomie.",
        en: "In 2019, the Event Horizon Telescope produced the first direct image of a black hole (in the galaxy M87) — a milestone in astronomy.",
        hi: "2019 में इवेंट होराइज़न टेलिस्कोप के माध्यम से एक ब्लैक होल (आकाशगंगा M87 में) की पहली प्रत्यक्ष छवि प्राप्त हुई — खगोल विज्ञान का एक मील का पत्थर।",
        zh: "2019年,事件视界望远镜拍摄到了黑洞(位于M87星系)的首张直接图像——这是天文学的一个里程碑。",
        ko: "2019년 사건 지평선 망원경은 블랙홀(M87 은하 내)의 최초 직접 이미지를 만들어냈다. 이는 천문학의 이정표였다.",
        ja: "2019年、イベント・ホライズン・テレスコープによってブラックホール(M87銀河内)の初の直接撮影画像が得られた。これは天文学における画期的な出来事であった。",
        es: "En 2019, el Telescopio del Horizonte de Sucesos captó la primera imagen directa de un agujero negro (en la galaxia M87), un hito de la astronomía.",
        fr: "En 2019, l'Event Horizon Telescope a produit la première image directe d'un trou noir (dans la galaxie M87) — une étape marquante de l'astronomie.",
        tr: "2019'da Olay Ufku Teleskobu ile bir kara deliğin (M87 galaksisinde) ilk doğrudan görüntüsü elde edildi — astronomide bir dönüm noktası.",
        ru: "В 2019 году телескоп Event Horizon Telescope получил первое прямое изображение чёрной дыры (в галактике M87) — веха в истории астрономии.",
        pt: "Em 2019, o Event Horizon Telescope produziu a primeira imagem direta de um buraco negro (na galáxia M87) — um marco na astronomia.",
        ar: "في عام 2019، التقط تلسكوب أفق الحدث أول صورة مباشرة لثقب أسود (في مجرة M87) — وهو إنجاز بارز في علم الفلك.",
        el: "Το 2019, το Τηλεσκόπιο Ορίζοντα Γεγονότων παρήγαγε την πρώτη άμεση εικόνα μιας μαύρης τρύπας (στον γαλαξία M87) — ένα ορόσημο για την αστρονομία.",
      },
    ],
    image: commonsFile("Black_hole_-_Messier_87_crop_max_res.jpg"),
  },
  {
    label: {
      de: "Exoplaneten (bestätigt)",
      en: "Exoplanets (confirmed)",
      hi: "बाह्यग्रह (पुष्टि)",
      zh: "系外行星(已确认)",
      ko: "외계행성 (확인됨)",
      ja: "系外惑星(確認済み)",
      es: "Exoplanetas (confirmados)",
      fr: "Exoplanètes (confirmées)",
      tr: "Ötegezegenler (doğrulanmış)",
      ru: "Экзопланеты (подтверждённые)",
      pt: "Exoplanetas (confirmados)",
      ar: "الكواكب الخارجية (مؤكدة)",
      el: "Εξωπλανήτες (επιβεβαιωμένοι)",
    },
    value: {
      de: "über 5.800",
      en: "over 5,800",
      hi: "5,800 से अधिक",
      zh: "超过5800颗",
      ko: "5,800개 이상",
      ja: "5800個以上",
      es: "más de 5.800",
      fr: "plus de 5 800",
      tr: "5.800'den fazla",
      ru: "более 5800",
      pt: "mais de 5.800",
      ar: "أكثر من 5,800",
      el: "άνω των 5.800",
    },
    details: [
      {
        de: "Seit der ersten Bestätigung eines Exoplaneten um einen sonnenähnlichen Stern 1995 wurden über 5.800 weitere Planeten außerhalb unseres Sonnensystems nachgewiesen (Stand: NASA Exoplanet Archive).",
        en: "Since the first confirmed exoplanet around a Sun-like star in 1995, more than 5,800 additional planets outside our solar system have been confirmed (per the NASA Exoplanet Archive).",
        hi: "1995 में सूर्य जैसे तारे के चारों ओर पहले बाह्यग्रह की पुष्टि के बाद से, हमारे सौरमंडल के बाहर 5,800 से अधिक ग्रहों की पुष्टि की जा चुकी है (नासा एक्सोप्लैनेट आर्काइव के अनुसार)।",
        zh: "自1995年首次确认一颗类日恒星周围的系外行星以来,已有超过5800颗太阳系外的行星被确认(据NASA系外行星档案数据)。",
        ko: "1995년 태양과 비슷한 별 주위에서 처음으로 외계행성이 확인된 이래, 우리 태양계 밖에서 5,800개 이상의 추가 행성이 확인되었다(NASA 외계행성 아카이브 기준).",
        ja: "1995年に太陽に似た恒星の周りで初めて系外惑星が確認されて以来、私たちの太陽系の外にさらに5800個以上の惑星が確認されている(NASA系外惑星アーカイブによる)。",
        es: "Desde la primera confirmación de un exoplaneta alrededor de una estrella similar al Sol en 1995, se han confirmado más de 5.800 planetas adicionales fuera de nuestro sistema solar (según el Archivo de Exoplanetas de la NASA).",
        fr: "Depuis la première confirmation d'une exoplanète autour d'une étoile semblable au Soleil en 1995, plus de 5 800 planètes supplémentaires ont été confirmées en dehors de notre système solaire (selon l'archive des exoplanètes de la NASA).",
        tr: "1995'te Güneş benzeri bir yıldız etrafında ilk ötegezegenin doğrulanmasından bu yana, güneş sistemimiz dışında 5.800'den fazla gezegen daha doğrulandı (NASA Ötegezegen Arşivi'ne göre).",
        ru: "С момента первого подтверждения экзопланеты у звезды, похожей на Солнце, в 1995 году, за пределами нашей Солнечной системы было подтверждено более 5800 дополнительных планет (по данным архива экзопланет NASA).",
        pt: "Desde a primeira confirmação de um exoplaneta ao redor de uma estrela semelhante ao Sol em 1995, mais de 5.800 planetas adicionais fora do nosso sistema solar foram confirmados (segundo o Arquivo de Exoplanetas da NASA).",
        ar: "منذ التأكيد الأول لكوكب خارجي حول نجم شبيه بالشمس عام 1995، تم تأكيد أكثر من 5,800 كوكب إضافي خارج نظامنا الشمسي (وفقًا لأرشيف الكواكب الخارجية التابع لناسا).",
        el: "Από την πρώτη επιβεβαίωση ενός εξωπλανήτη γύρω από ένα αστέρι παρόμοιο με τον Ήλιο το 1995, έχουν επιβεβαιωθεί πάνω από 5.800 επιπλέον πλανήτες εκτός του ηλιακού μας συστήματος (σύμφωνα με το Αρχείο Εξωπλανητών της NASA).",
      },
      {
        de: "Die meisten wurden über die Transitmethode entdeckt — ein Planet zieht vor seinem Stern vorbei und dimmt dessen Licht minimal, was Weltraumteleskope wie Kepler und TESS registrieren.",
        en: "Most were discovered using the transit method — a planet passes in front of its star and dims its light very slightly, which space telescopes like Kepler and TESS can detect.",
        hi: "अधिकांश की खोज पारगमन विधि से हुई — एक ग्रह अपने तारे के आगे से गुज़रता है और उसकी रोशनी को थोड़ा मंद कर देता है, जिसे केप्लर और TESS जैसे अंतरिक्ष टेलीस्कोप पहचान सकते हैं।",
        zh: "大多数是通过凌日法发现的——一颗行星经过其恒星前方,使其光线略微变暗,开普勒和TESS等太空望远镜能够探测到这一变化。",
        ko: "대부분은 통과법(transit method)으로 발견되었다. 행성이 자신의 별 앞을 지나가며 별빛을 아주 약간 어둡게 만드는데, 케플러나 TESS 같은 우주망원경이 이를 감지할 수 있다.",
        ja: "そのほとんどはトランジット法によって発見された。惑星がその恒星の前を通過する際にわずかに光を暗くし、それをケプラーやTESSのような宇宙望遠鏡が検出するのである。",
        es: "La mayoría se descubrieron mediante el método de tránsito: un planeta pasa por delante de su estrella y atenúa ligeramente su luz, algo que telescopios espaciales como Kepler y TESS pueden detectar.",
        fr: "La plupart ont été découvertes grâce à la méthode des transits : une planète passe devant son étoile et en atténue légèrement la lumière, ce que des télescopes spatiaux comme Kepler et TESS peuvent détecter.",
        tr: "Çoğu geçiş yöntemiyle keşfedildi — bir gezegen yıldızının önünden geçerek ışığını çok az kısar, bunu Kepler ve TESS gibi uzay teleskopları algılayabilir.",
        ru: "Большинство были обнаружены транзитным методом: планета проходит перед своей звездой и слегка ослабляет её свет, что регистрируют такие космические телескопы, как «Кеплер» и TESS.",
        pt: "A maioria foi descoberta pelo método de trânsito — um planeta passa na frente de sua estrela e diminui ligeiramente seu brilho, algo que telescópios espaciais como Kepler e TESS conseguem detectar.",
        ar: "اكتُشف معظمها باستخدام طريقة العبور — حيث يمر الكوكب أمام نجمه فيخفت ضوءه قليلًا جدًا، وهو ما يمكن أن ترصده تلسكوبات فضائية مثل كيبلر و TESS.",
        el: "Οι περισσότεροι ανακαλύφθηκαν με τη μέθοδο της διέλευσης — ένας πλανήτης περνά μπροστά από το αστέρι του και μειώνει ελαφρώς τη φωτεινότητά του, κάτι που διαστημικά τηλεσκόπια όπως το Kepler και το TESS μπορούν να εντοπίσουν.",
      },
      {
        de: "Ein wichtiges Forschungsziel sind Planeten in der 'habitablen Zone' — mit Bedingungen, unter denen flüssiges Wasser an der Oberfläche möglich wäre.",
        en: "A key research goal is finding planets in the 'habitable zone' — with conditions that could allow liquid water on the surface.",
        hi: "एक महत्वपूर्ण शोध लक्ष्य 'रहने योग्य क्षेत्र' में ग्रह ढूँढना है — ऐसी परिस्थितियों के साथ जहाँ सतह पर तरल पानी संभव हो।",
        zh: "一个重要的研究目标是寻找位于'宜居带'的行星——即表面可能存在液态水的条件。",
        ko: "핵심 연구 목표 중 하나는 '생명체 거주 가능 영역'에 있는 행성을 찾는 것이다. 이는 표면에 액체 상태의 물이 존재할 수 있는 조건을 갖춘 곳이다.",
        ja: "重要な研究目標の一つは、「ハビタブルゾーン」にある惑星を見つけることである。それは表面に液体の水が存在しうる条件を備えた領域を意味する。",
        es: "Un objetivo de investigación clave es encontrar planetas en la 'zona habitable', con condiciones que permitirían la presencia de agua líquida en la superficie.",
        fr: "Un objectif de recherche important est de trouver des planètes dans la « zone habitable », où des conditions permettraient la présence d'eau liquide en surface.",
        tr: "Önemli bir araştırma hedefi, yüzeyinde sıvı su bulunmasına olanak tanıyacak koşullara sahip 'yaşanabilir bölge'deki gezegenleri bulmaktır.",
        ru: "Важная исследовательская цель — поиск планет в «обитаемой зоне», где условия допускают наличие жидкой воды на поверхности.",
        pt: "Um objetivo importante de pesquisa é encontrar planetas na 'zona habitável' — com condições que poderiam permitir água líquida na superfície.",
        ar: "من أهداف البحث الرئيسية إيجاد كواكب في 'المنطقة الصالحة للحياة' — بظروف قد تسمح بوجود ماء سائل على السطح.",
        el: "Ένας βασικός ερευνητικός στόχος είναι η εύρεση πλανητών στην «κατοικήσιμη ζώνη» — με συνθήκες που θα επέτρεπαν την ύπαρξη υγρού νερού στην επιφάνεια.",
      },
    ],
    image: commonsFile("Kepler186f-ArtistConcept-20140417.jpg"),
  },
  // Nutzerwunsch 20.09.2026 ("kannst du hier noch mehr boxen hinzufügen
  // also mehr infos mit bilder über universum") — sechs weitere Fakten.
  {
    label: {
      de: "Andromeda-Galaxie",
      en: "Andromeda Galaxy",
      hi: "एंड्रोमेडा आकाशगंगा",
      zh: "仙女座星系",
      ko: "안드로메다은하",
      ja: "アンドロメダ銀河",
      es: "Galaxia de Andrómeda",
      fr: "Galaxie d'Andromède",
      tr: "Andromeda Galaksisi",
      ru: "Галактика Андромеды",
      pt: "Galáxia de Andrômeda",
      ar: "مجرة أندروميدا",
      el: "Γαλαξίας της Ανδρομέδας",
    },
    value: {
      de: "≈ 2,5 Mio. Lichtjahre",
      en: "≈ 2.5 million light-years",
      hi: "≈ 25 लाख प्रकाश-वर्ष",
      zh: "约250万光年",
      ko: "약 250만 광년",
      ja: "約250万光年",
      es: "≈ 2,5 millones de años luz",
      fr: "≈ 2,5 millions d'années-lumière",
      tr: "≈ 2,5 milyon ışık yılı",
      ru: "≈ 2,5 млн световых лет",
      pt: "≈ 2,5 milhões de anos-luz",
      ar: "≈ 2.5 مليون سنة ضوئية",
      el: "≈ 2,5 εκατ. έτη φωτός",
    },
    details: [
      {
        de: "Andromeda ist die uns nächstgelegene große Spiralgalaxie und mit bloßem Auge als schwacher, länglicher Fleck am Nachthimmel sichtbar — das am weitesten entfernte Objekt, das Menschen ohne Hilfsmittel erkennen können.",
        en: "Andromeda is the nearest large spiral galaxy to us and is visible to the naked eye as a faint, elongated smudge in the night sky — the most distant object humans can see unaided.",
        hi: "एंड्रोमेडा हमारी सबसे निकटतम बड़ी सर्पिल आकाशगंगा है और रात के आकाश में एक धुंधले, लम्बे धब्बे के रूप में नंगी आँखों से दिखाई देती है — मनुष्य बिना किसी उपकरण के देख सकने वाली सबसे दूर की वस्तु।",
        zh: "仙女座星系是离我们最近的大型旋涡星系,肉眼可见为夜空中一个模糊、细长的光斑——是人类不借助工具能看到的最远天体。",
        ko: "안드로메다은하는 우리에게 가장 가까운 대형 나선은하이며, 밤하늘에서 희미하고 길쭉한 얼룩처럼 맨눈으로 볼 수 있다. 이는 인간이 도구 없이 볼 수 있는 가장 먼 천체이다.",
        ja: "アンドロメダ銀河は私たちに最も近い大型渦巻銀河であり、夜空にかすかな細長い染みのように肉眼で見ることができる。これは人間が何の道具も使わずに見ることのできる最も遠い天体である。",
        es: "Andrómeda es la gran galaxia espiral más cercana a nosotros y es visible a simple vista como una mancha tenue y alargada en el cielo nocturno: el objeto más distante que los humanos pueden ver sin ayuda.",
        fr: "Andromède est la grande galaxie spirale la plus proche de nous et est visible à l'œil nu comme une tache floue et allongée dans le ciel nocturne — l'objet le plus lointain que l'humain puisse voir sans instrument.",
        tr: "Andromeda, bize en yakın büyük sarmal galaksidir ve gece gökyüzünde çıplak gözle soluk, uzunlamasına bir leke olarak görülebilir — insanların araç kullanmadan görebildiği en uzak nesnedir.",
        ru: "Андромеда — ближайшая к нам крупная спиральная галактика, видимая невооружённым глазом как тусклое вытянутое пятно на ночном небе — самый удалённый объект, который человек может увидеть без приборов.",
        pt: "Andrômeda é a maior galáxia espiral mais próxima de nós e é visível a olho nu como uma mancha alongada e fraca no céu noturno — o objeto mais distante que os humanos conseguem ver sem auxílio.",
        ar: "أندروميدا هي أقرب مجرة حلزونية كبيرة إلينا، وتظهر للعين المجردة كبقعة خافتة ممدودة في سماء الليل — وهي أبعد جسم يمكن للبشر رؤيته دون أدوات مساعدة.",
        el: "Η Ανδρομέδα είναι ο πλησιέστερος σε εμάς μεγάλος σπειροειδής γαλαξίας και είναι ορατή με γυμνό μάτι ως ένα αμυδρό, επιμήκες στίγμα στον νυχτερινό ουρανό — το πιο μακρινό αντικείμενο που μπορεί να δει ο άνθρωπος χωρίς βοήθημα.",
      },
      {
        de: "Sie ist deutlich größer als die Milchstraße und enthält vermutlich rund eine Billion Sterne.",
        en: "It is noticeably larger than the Milky Way and is thought to contain around one trillion stars.",
        hi: "यह मिल्की वे से काफी बड़ी है और इसमें लगभग एक खरब तारे होने का अनुमान है।",
        zh: "它明显大于银河系,估计包含约一万亿颗恒星。",
        ko: "이는 은하수보다 눈에 띄게 크며, 약 1조 개의 별을 담고 있는 것으로 여겨진다.",
        ja: "天の川銀河よりも明らかに大きく、約1兆個の恒星を含むと考えられている。",
        es: "Es notablemente más grande que la Vía Láctea y se cree que contiene aproximadamente un billón de estrellas.",
        fr: "Elle est nettement plus grande que la Voie lactée et contiendrait environ mille milliards d'étoiles.",
        tr: "Samanyolu'ndan belirgin şekilde daha büyüktür ve yaklaşık bir trilyon yıldız içerdiği düşünülmektedir.",
        ru: "Она заметно больше Млечного Пути и, как полагают, содержит около триллиона звёзд.",
        pt: "É notavelmente maior que a Via Láctea e acredita-se que contenha cerca de um trilhão de estrelas.",
        ar: "وهي أكبر بشكل ملحوظ من درب التبانة، ويُعتقد أنها تحتوي على نحو تريليون نجم.",
        el: "Είναι αισθητά μεγαλύτερος από τον Γαλαξία μας και πιστεύεται ότι περιέχει περίπου ένα τρισεκατομμύριο αστέρια.",
      },
      {
        de: "Andromeda und die Milchstraße bewegen sich aufeinander zu und werden in etwa 4,5 Milliarden Jahren zu einer neuen, größeren Galaxie verschmelzen.",
        en: "Andromeda and the Milky Way are moving toward each other and will merge into a new, larger galaxy in about 4.5 billion years.",
        hi: "एंड्रोमेडा और मिल्की वे एक-दूसरे की ओर बढ़ रहे हैं और लगभग 4.5 अरब वर्षों में एक नई, बड़ी आकाशगंगा में विलीन हो जाएँगे।",
        zh: "仙女座星系和银河系正在相互靠近,大约45亿年后将合并成一个更大的新星系。",
        ko: "안드로메다은하와 은하수는 서로를 향해 다가가고 있으며, 약 45억 년 후에는 새로운 더 큰 은하로 합쳐질 것이다.",
        ja: "アンドロメダ銀河と天の川銀河は互いに近づいており、約45億年後には合体してより大きな新しい銀河になるだろう。",
        es: "Andrómeda y la Vía Láctea se están acercando entre sí y se fusionarán en una nueva y mayor galaxia dentro de unos 4.500 millones de años.",
        fr: "Andromède et la Voie lactée se rapprochent l'une de l'autre et fusionneront en une nouvelle galaxie plus grande dans environ 4,5 milliards d'années.",
        tr: "Andromeda ve Samanyolu birbirlerine doğru hareket ediyor ve yaklaşık 4,5 milyar yıl içinde yeni, daha büyük bir galakside birleşecekler.",
        ru: "Андромеда и Млечный Путь сближаются и примерно через 4,5 млрд лет сольются в новую, более крупную галактику.",
        pt: "Andrômeda e a Via Láctea estão se movendo uma em direção à outra e se fundirão em uma nova galáxia maior daqui a cerca de 4,5 bilhões de anos.",
        ar: "تتحرك أندروميدا ودرب التبانة نحو بعضهما البعض وستندمجان في مجرة جديدة أكبر خلال نحو 4.5 مليار سنة.",
        el: "Η Ανδρομέδα και ο Γαλαξίας μας κινούνται ο ένας προς τον άλλο και θα συγχωνευθούν σε έναν νέο, μεγαλύτερο γαλαξία σε περίπου 4,5 δισ. χρόνια.",
      },
    ],
    image: commonsFile("Andromeda_Galaxy_(with_h-alpha).jpg"),
  },
  {
    label: {
      de: "Die Sonne",
      en: "The Sun",
      hi: "सूर्य",
      zh: "太阳",
      ko: "태양",
      ja: "太陽",
      es: "El Sol",
      fr: "Le Soleil",
      tr: "Güneş",
      ru: "Солнце",
      pt: "O Sol",
      ar: "الشمس",
      el: "Ο Ήλιος",
    },
    value: {
      de: "≈ 1,39 Mio. km Durchmesser",
      en: "≈ 1.39 million km diameter",
      hi: "≈ 13.9 लाख किमी व्यास",
      zh: "直径约139万千米",
      ko: "지름 약 139만km",
      ja: "直径約139万km",
      es: "≈ 1,39 millones de km de diámetro",
      fr: "≈ 1,39 million de km de diamètre",
      tr: "≈ 1,39 milyon km çapında",
      ru: "≈ 1,39 млн км в диаметре",
      pt: "≈ 1,39 milhão de km de diâmetro",
      ar: "≈ 1.39 مليون كم قطرًا",
      el: "≈ 1,39 εκατ. χλμ διάμετρος",
    },
    details: [
      {
        de: "Die Sonne ist mit rund 1,39 Millionen Kilometern Durchmesser etwa 109-mal so breit wie die Erde und macht allein rund 99,86 % der Masse des gesamten Sonnensystems aus.",
        en: "At about 1.39 million kilometers across, the Sun is roughly 109 times wider than Earth and alone accounts for about 99.86% of the solar system's total mass.",
        hi: "लगभग 13.9 लाख किलोमीटर व्यास के साथ सूर्य पृथ्वी से लगभग 109 गुना चौड़ा है और अकेले पूरे सौरमंडल के द्रव्यमान का लगभग 99.86% हिस्सा है।",
        zh: "太阳直径约139万千米,约是地球宽度的109倍,仅其自身就占太阳系总质量的约99.86%。",
        ko: "지름 약 139만km인 태양은 지구보다 약 109배 넓으며, 혼자서 태양계 전체 질량의 약 99.86%를 차지한다.",
        ja: "直径約139万kmの太陽は地球のおよそ109倍の幅を持ち、単独で太陽系全体の質量の約99.86%を占めている。",
        es: "Con unos 1,39 millones de kilómetros de diámetro, el Sol es aproximadamente 109 veces más ancho que la Tierra y por sí solo representa alrededor del 99,86 % de la masa total del sistema solar.",
        fr: "Avec environ 1,39 million de kilomètres de diamètre, le Soleil est environ 109 fois plus large que la Terre et représente à lui seul environ 99,86 % de la masse totale du système solaire.",
        tr: "Yaklaşık 1,39 milyon kilometre çapıyla Güneş, Dünya'dan yaklaşık 109 kat daha geniştir ve tek başına güneş sisteminin toplam kütlesinin yaklaşık %99,86'sını oluşturur.",
        ru: "При диаметре около 1,39 млн км Солнце примерно в 109 раз шире Земли и в одиночку составляет около 99,86% всей массы Солнечной системы.",
        pt: "Com cerca de 1,39 milhão de quilômetros de diâmetro, o Sol é aproximadamente 109 vezes mais largo que a Terra e, sozinho, responde por cerca de 99,86% da massa total do sistema solar.",
        ar: "بقطر يبلغ نحو 1.39 مليون كيلومتر، تبلغ سعة الشمس نحو 109 أضعاف عرض الأرض، وتشكل وحدها نحو 99.86٪ من كتلة النظام الشمسي بأكمله.",
        el: "Με διάμετρο περίπου 1,39 εκατ. χιλιόμετρα, ο Ήλιος είναι περίπου 109 φορές πιο πλατύς από τη Γη και αντιπροσωπεύει μόνος του περίπου το 99,86% της συνολικής μάζας του ηλιακού συστήματος.",
      },
      {
        de: "An ihrer Oberfläche herrschen etwa 5.500 °C, im Kern durch Kernfusion sogar rund 15 Millionen °C.",
        en: "Its surface reaches about 5,500 °C, while nuclear fusion in its core drives the temperature up to around 15 million °C.",
        hi: "इसकी सतह पर लगभग 5,500 °C तापमान होता है, जबकि कोर में नाभिकीय संलयन के कारण यह लगभग 1.5 करोड़ °C तक पहुँच जाता है।",
        zh: "太阳表面温度约为5500摄氏度,而核心的核聚变反应使温度高达约1500万摄氏度。",
        ko: "표면 온도는 약 5,500℃에 이르며, 핵심부에서는 핵융합으로 인해 온도가 약 1,500만℃까지 치솟는다.",
        ja: "その表面は約5500℃に達し、核心部では核融合によって温度が約1500万℃にまで達する。",
        es: "Su superficie alcanza unos 5.500 °C, mientras que la fusión nuclear en su núcleo eleva la temperatura hasta unos 15 millones de °C.",
        fr: "Sa surface atteint environ 5 500 °C, tandis que la fusion nucléaire dans son noyau fait grimper la température à environ 15 millions de °C.",
        tr: "Yüzeyi yaklaşık 5.500 °C'ye ulaşırken, çekirdeğindeki nükleer füzyon sıcaklığı yaklaşık 15 milyon °C'ye çıkarır.",
        ru: "Температура на его поверхности достигает около 5500 °C, а в ядре за счёт термоядерного синтеза поднимается до примерно 15 миллионов °C.",
        pt: "Sua superfície atinge cerca de 5.500 °C, enquanto a fusão nuclear em seu núcleo eleva a temperatura a cerca de 15 milhões de °C.",
        ar: "تصل درجة حرارة سطحها إلى نحو 5,500 درجة مئوية، بينما يرفع الاندماج النووي في نواتها درجة الحرارة إلى نحو 15 مليون درجة مئوية.",
        el: "Η επιφάνειά του φτάνει τους 5.500 °C περίπου, ενώ η πυρηνική σύντηξη στον πυρήνα του ανεβάζει τη θερμοκρασία σε περίπου 15 εκατομμύρια °C.",
      },
      {
        de: "Sie ist mit etwa 4,6 Milliarden Jahren ungefähr in der Mitte ihrer Lebenszeit als sogenannter Hauptreihenstern.",
        en: "At about 4.6 billion years old, it is roughly halfway through its lifetime as a so-called main-sequence star.",
        hi: "लगभग 4.6 अरब वर्ष की आयु के साथ यह तथाकथित मुख्य अनुक्रम तारे के रूप में अपने जीवनकाल के लगभग आधे रास्ते में है।",
        zh: "太阳目前约有46亿岁,作为所谓的主序星,它大约走过了自己生命的一半历程。",
        ko: "약 46억 년의 나이로, 소위 주계열성으로서의 생애 중 대략 절반 정도를 지나고 있다.",
        ja: "約46億歳であり、いわゆる主系列星としての寿命のほぼ半分を過ぎたところにある。",
        es: "Con unos 4.600 millones de años, se encuentra aproximadamente a la mitad de su vida como la llamada estrella de secuencia principal.",
        fr: "Âgé d'environ 4,6 milliards d'années, il est environ à la moitié de sa vie en tant qu'étoile dite de la séquence principale.",
        tr: "Yaklaşık 4,6 milyar yaşında olan Güneş, sözde ana kol yıldızı olarak yaşam süresinin kabaca yarısındadır.",
        ru: "Возраст около 4,6 млрд лет означает, что оно находится примерно на середине своей жизни как звезда главной последовательности.",
        pt: "Com cerca de 4,6 bilhões de anos, ele está aproximadamente na metade de sua vida como uma chamada estrela da sequência principal.",
        ar: "بعمر نحو 4.6 مليار سنة، تقع الشمس في منتصف عمرها تقريبًا كنجم يُعرف بنجم التسلسل الرئيسي.",
        el: "Στα περίπου 4,6 δισ. χρόνια, βρίσκεται περίπου στη μέση της ζωής του ως λεγόμενος αστέρας κύριας ακολουθίας.",
      },
    ],
    image: commonsFile(
      "The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA's_Solar_Dynamics_Observatory_-_20100819.jpg"
    ),
  },
  {
    label: {
      de: "Jupiter",
      en: "Jupiter",
      hi: "बृहस्पति",
      zh: "木星",
      ko: "목성",
      ja: "木星",
      es: "Júpiter",
      fr: "Jupiter",
      tr: "Jüpiter",
      ru: "Юпитер",
      pt: "Júpiter",
      ar: "المشتري",
      el: "Δίας",
    },
    value: {
      de: "größter Planet",
      en: "largest planet",
      hi: "सबसे बड़ा ग्रह",
      zh: "最大的行星",
      ko: "가장 큰 행성",
      ja: "最大の惑星",
      es: "planeta más grande",
      fr: "plus grande planète",
      tr: "en büyük gezegen",
      ru: "самая большая планета",
      pt: "maior planeta",
      ar: "أكبر كوكب",
      el: "ο μεγαλύτερος πλανήτης",
    },
    details: [
      {
        de: "Jupiter ist mit rund 143.000 Kilometern Durchmesser der mit Abstand größte Planet im Sonnensystem — mehr als 1.300 Erden würden in sein Volumen passen.",
        en: "At about 143,000 kilometers across, Jupiter is by far the largest planet in the solar system — more than 1,300 Earths could fit inside its volume.",
        hi: "लगभग 1,43,000 किलोमीटर व्यास के साथ बृहस्पति सौरमंडल का अब तक का सबसे बड़ा ग्रह है — इसके आयतन में 1,300 से अधिक पृथ्वी समा सकती हैं।",
        zh: "木星直径约14.3万千米,是太阳系中迄今为止最大的行星——其体积足以容纳1300多个地球。",
        ko: "지름 약 14만 3,000km인 목성은 태양계에서 단연코 가장 큰 행성이다. 그 부피 안에는 지구 1,300개 이상이 들어갈 수 있다.",
        ja: "直径約14万3000kmの木星は、太陽系で群を抜いて最大の惑星である。その体積には地球が1300個以上も収まるほどだ。",
        es: "Con unos 143.000 kilómetros de diámetro, Júpiter es, con diferencia, el planeta más grande del sistema solar; más de 1.300 Tierras cabrían en su volumen.",
        fr: "Avec environ 143 000 kilomètres de diamètre, Jupiter est de loin la plus grande planète du système solaire — plus de 1 300 Terres pourraient tenir dans son volume.",
        tr: "Yaklaşık 143.000 kilometre çapıyla Jüpiter, güneş sistemindeki açık ara en büyük gezegendir — hacmine 1.300'den fazla Dünya sığabilir.",
        ru: "При диаметре около 143 000 км Юпитер — безусловно, крупнейшая планета Солнечной системы: в его объём поместилось бы более 1300 Земель.",
        pt: "Com cerca de 143.000 quilômetros de diâmetro, Júpiter é de longe o maior planeta do sistema solar — mais de 1.300 Terras caberiam em seu volume.",
        ar: "بقطر يبلغ نحو 143 ألف كيلومتر، يُعد المشتري أكبر كواكب النظام الشمسي بفارق كبير — إذ يمكن أن يستوعب حجمه أكثر من 1,300 كوكب بحجم الأرض.",
        el: "Με διάμετρο περίπου 143.000 χιλιόμετρα, ο Δίας είναι κατά πολύ ο μεγαλύτερος πλανήτης του ηλιακού συστήματος — περισσότερες από 1.300 Γη θα χωρούσαν στον όγκο του.",
      },
      {
        de: "Seine Masse ist mehr als doppelt so groß wie die aller anderen Planeten des Sonnensystems zusammen.",
        en: "Its mass is more than twice that of all the other planets in the solar system combined.",
        hi: "इसका द्रव्यमान सौरमंडल के अन्य सभी ग्रहों को मिलाकर उससे दोगुने से भी अधिक है।",
        zh: "它的质量超过了太阳系中所有其他行星质量总和的两倍。",
        ko: "그 질량은 태양계의 다른 모든 행성을 합친 것보다 두 배 이상 크다.",
        ja: "その質量は、太陽系の他のすべての惑星を合わせたものの2倍以上に及ぶ。",
        es: "Su masa es más del doble que la de todos los demás planetas del sistema solar juntos.",
        fr: "Sa masse est plus de deux fois supérieure à celle de toutes les autres planètes du système solaire réunies.",
        tr: "Kütlesi, güneş sistemindeki diğer tüm gezegenlerin toplamının iki katından fazladır.",
        ru: "Его масса более чем вдвое превышает суммарную массу всех остальных планет Солнечной системы.",
        pt: "Sua massa é mais do que o dobro da massa de todos os outros planetas do sistema solar juntos.",
        ar: "تبلغ كتلته أكثر من ضعف كتلة جميع كواكب النظام الشمسي الأخرى مجتمعة.",
        el: "Η μάζα του είναι πάνω από διπλάσια από αυτή όλων των υπόλοιπων πλανητών του ηλιακού συστήματος μαζί.",
      },
      {
        de: "Der berühmte 'Große Rote Fleck' ist ein gigantischer Sturm, größer als die Erde, der seit mindestens rund 150 Jahren beobachtet wird.",
        en: "The famous 'Great Red Spot' is a gigantic storm, larger than Earth, that has been observed for at least about 150 years.",
        hi: "प्रसिद्ध 'ग्रेट रेड स्पॉट' एक विशाल तूफान है, जो पृथ्वी से भी बड़ा है और कम से कम 150 वर्षों से देखा जा रहा है।",
        zh: "著名的'大红斑'是一场比地球还大的巨型风暴,人类已经观测它至少约150年了。",
        ko: "유명한 '대적점'은 지구보다 큰 거대한 폭풍으로, 적어도 약 150년 동안 관측되어 왔다.",
        ja: "有名な「大赤斑」は地球よりも大きな巨大な嵐であり、少なくとも約150年にわたって観測され続けている。",
        es: "La famosa 'Gran Mancha Roja' es una tormenta gigantesca, más grande que la Tierra, que se ha observado durante al menos unos 150 años.",
        fr: "La célèbre « Grande Tache rouge » est une tempête gigantesque, plus grande que la Terre, observée depuis au moins environ 150 ans.",
        tr: "Ünlü 'Büyük Kırmızı Leke', Dünya'dan bile büyük olan ve en az yaklaşık 150 yıldır gözlemlenen devasa bir fırtınadır.",
        ru: "Знаменитое «Большое красное пятно» — гигантский шторм крупнее Земли, наблюдаемый уже как минимум около 150 лет.",
        pt: "A famosa 'Grande Mancha Vermelha' é uma tempestade gigantesca, maior que a Terra, que vem sendo observada há pelo menos cerca de 150 anos.",
        ar: "'البقعة الحمراء العظيمة' الشهيرة هي عاصفة عملاقة أكبر من الأرض، تمت مراقبتها لمدة 150 عامًا تقريبًا على الأقل.",
        el: "Η διάσημη «Μεγάλη Κόκκινη Κηλίδα» είναι μια γιγαντιαία καταιγίδα, μεγαλύτερη από τη Γη, που παρατηρείται εδώ και τουλάχιστον περίπου 150 χρόνια.",
      },
    ],
    image: commonsFile("Jupiter_by_Cassini-Huygens.jpg"),
  },
  {
    label: {
      de: "Krebsnebel",
      en: "Crab Nebula",
      hi: "क्रैब नेबुला",
      zh: "蟹状星云",
      ko: "게성운",
      ja: "かに星雲",
      es: "Nebulosa del Cangrejo",
      fr: "Nébuleuse du Crabe",
      tr: "Yengeç Bulutsusu",
      ru: "Крабовидная туманность",
      pt: "Nebulosa do Caranguejo",
      ar: "سديم السرطان",
      el: "Νεφέλωμα του Καρκίνου",
    },
    value: {
      de: "Supernova von 1054",
      en: "Supernova of 1054",
      hi: "1054 का सुपरनोवा",
      zh: "1054年超新星",
      ko: "1054년 초신성",
      ja: "1054年の超新星",
      es: "Supernova de 1054",
      fr: "Supernova de 1054",
      tr: "1054 Süpernovası",
      ru: "Сверхновая 1054 года",
      pt: "Supernova de 1054",
      ar: "مستعر أعظم عام 1054",
      el: "Υπερκαινοφανής του 1054",
    },
    details: [
      {
        de: "Der Krebsnebel ist der Überrest einer Sternexplosion (Supernova), die chinesische und arabische Astronomen im Jahr 1054 n. Chr. beobachteten und aufzeichneten — sie war so hell, dass sie tagsüber sichtbar war.",
        en: "The Crab Nebula is the remnant of a stellar explosion (supernova) that Chinese and Arab astronomers observed and recorded in the year 1054 CE — it was so bright it was visible during daytime.",
        hi: "क्रैब नेबुला एक तारकीय विस्फोट (सुपरनोवा) का अवशेष है जिसे चीनी और अरब खगोलविदों ने 1054 ईस्वी में देखा और दर्ज किया था — यह इतना चमकीला था कि दिन में भी दिखाई देता था।",
        zh: "蟹状星云是一次恒星爆发(超新星)留下的遗迹,中国和阿拉伯的天文学家在公元1054年观测并记录了这次爆发——它是如此明亮,以至于白天都能看见。",
        ko: "게성운은 서기 1054년 중국과 아랍 천문학자들이 관측하고 기록한 별의 폭발(초신성)의 잔해이다. 이는 매우 밝아서 낮에도 보일 정도였다.",
        ja: "かに星雲は、西暦1054年に中国とアラブの天文学者たちが観測・記録した恒星の爆発(超新星)の残骸である。あまりに明るかったため、昼間でも見えたという。",
        es: "La Nebulosa del Cangrejo es el remanente de una explosión estelar (supernova) que astrónomos chinos y árabes observaron y registraron en el año 1054 d. C.; fue tan brillante que se veía de día.",
        fr: "La nébuleuse du Crabe est le vestige d'une explosion stellaire (supernova) observée et consignée par des astronomes chinois et arabes en l'an 1054 de notre ère — elle était si brillante qu'elle était visible en plein jour.",
        tr: "Yengeç Bulutsusu, Çinli ve Arap gökbilimcilerin MS 1054 yılında gözlemleyip kaydettiği bir yıldız patlamasının (süpernova) kalıntısıdır — o kadar parlaktı ki gündüz bile görülebiliyordu.",
        ru: "Крабовидная туманность — остаток звёздного взрыва (сверхновой), который китайские и арабские астрономы наблюдали и зафиксировали в 1054 году н.э. — он был настолько ярким, что был виден даже днём.",
        pt: "A Nebulosa do Caranguejo é o remanescente de uma explosão estelar (supernova) que astrônomos chineses e árabes observaram e registraram no ano de 1054 d.C. — era tão brilhante que era visível durante o dia.",
        ar: "سديم السرطان هو ما تبقى من انفجار نجمي (مستعر أعظم) رصده وسجّله علماء الفلك الصينيون والعرب عام 1054 ميلادي — وكان ساطعًا لدرجة أنه كان مرئيًا في وضح النهار.",
        el: "Το Νεφέλωμα του Καρκίνου είναι το κατάλοιπο μιας αστρικής έκρηξης (υπερκαινοφανής) που Κινέζοι και Άραβες αστρονόμοι παρατήρησαν και κατέγραψαν το έτος 1054 μ.Χ. — ήταν τόσο φωτεινή που ήταν ορατή τη μέρα.",
      },
      {
        de: "In seinem Zentrum rotiert heute ein Pulsar — ein extrem dichter, schnell rotierender Neutronenstern, der sich etwa 30-mal pro Sekunde dreht.",
        en: "At its center spins a pulsar today — an extremely dense, rapidly rotating neutron star that turns about 30 times per second.",
        hi: "इसके केंद्र में आज एक पल्सर घूमता है — एक अत्यंत घना, तेज़ी से घूमने वाला न्यूट्रॉन तारा जो प्रति सेकंड लगभग 30 बार घूमता है।",
        zh: "如今在它的中心旋转着一颗脉冲星——一颗极其致密、快速旋转的中子星,每秒自转约30圈。",
        ko: "오늘날 그 중심에는 펄서가 회전하고 있다. 이는 극도로 밀도가 높고 빠르게 회전하는 중성자별로, 초당 약 30번 회전한다.",
        ja: "現在、その中心にはパルサーが存在する。これは非常に密度が高く、急速に回転する中性子星で、1秒間に約30回も自転している。",
        es: "En su centro gira hoy un púlsar: una estrella de neutrones extremadamente densa y de rotación rápida que gira unas 30 veces por segundo.",
        fr: "En son centre tourne aujourd'hui un pulsar — une étoile à neutrons extrêmement dense et à rotation rapide qui tourne environ 30 fois par seconde.",
        tr: "Merkezinde bugün bir pulsar dönüyor — saniyede yaklaşık 30 kez dönen, son derece yoğun ve hızlı dönen bir nötron yıldızı.",
        ru: "В её центре сегодня вращается пульсар — чрезвычайно плотная, быстро вращающаяся нейтронная звезда, делающая около 30 оборотов в секунду.",
        pt: "Em seu centro gira hoje um pulsar — uma estrela de nêutrons extremamente densa e de rotação rápida que gira cerca de 30 vezes por segundo.",
        ar: "يدور في مركزه اليوم نجم نابض — نجم نيوتروني شديد الكثافة يدور بسرعة تصل إلى نحو 30 دورة في الثانية.",
        el: "Στο κέντρο του περιστρέφεται σήμερα ένας δυσδιάκριτος αστέρας (πάλσαρ) — ένα εξαιρετικά πυκνό, ταχέως περιστρεφόμενο αστέρι νετρονίων που γυρίζει περίπου 30 φορές το δευτερόλεπτο.",
      },
      {
        de: "Supernovae wie diese schleudern schwere Elemente ins All, aus denen später neue Sterne, Planeten und letztlich auch Leben entstehen können.",
        en: "Supernovae like this one scatter heavy elements into space, from which new stars, planets, and eventually life can later form.",
        hi: "इस तरह के सुपरनोवा भारी तत्वों को अंतरिक्ष में बिखेर देते हैं, जिनसे बाद में नए तारे, ग्रह और अंततः जीवन भी बन सकता है।",
        zh: "像这样的超新星将重元素抛洒到太空中,这些元素后来可以形成新的恒星、行星,乃至最终孕育出生命。",
        ko: "이런 초신성은 무거운 원소들을 우주로 흩뿌리는데, 이 원소들에서 훗날 새로운 별과 행성, 그리고 궁극적으로 생명까지 형성될 수 있다.",
        ja: "このような超新星は重元素を宇宙にまき散らし、それらはやがて新しい恒星や惑星、そして最終的には生命の形成へとつながっていく。",
        es: "Supernovas como esta dispersan elementos pesados por el espacio, a partir de los cuales más tarde pueden formarse nuevas estrellas, planetas e incluso vida.",
        fr: "Des supernovas comme celle-ci dispersent des éléments lourds dans l'espace, à partir desquels pourront se former plus tard de nouvelles étoiles, des planètes et, finalement, la vie.",
        tr: "Bunun gibi süpernovalar, ağır elementleri uzaya saçar; bunlardan daha sonra yeni yıldızlar, gezegenler ve nihayetinde yaşam bile oluşabilir.",
        ru: "Такие сверхновые разбрасывают тяжёлые элементы в космос, из которых позже могут образоваться новые звёзды, планеты и, в конечном счёте, жизнь.",
        pt: "Supernovas como essa espalham elementos pesados pelo espaço, a partir dos quais novas estrelas, planetas e, eventualmente, vida podem se formar mais tarde.",
        ar: "تنثر المستعرات العظمى مثل هذه عناصر ثقيلة في الفضاء، يمكن أن تتشكل منها لاحقًا نجوم وكواكب جديدة، وفي نهاية المطاف حياة أيضًا.",
        el: "Υπερκαινοφανείς σαν αυτόν διασκορπίζουν βαρέα στοιχεία στο διάστημα, από τα οποία αργότερα μπορούν να σχηματιστούν νέα αστέρια, πλανήτες και, τελικά, ζωή.",
      },
    ],
    image: commonsFile("Crab_Nebula.jpg"),
  },
  {
    label: {
      de: "Voyager 1",
      en: "Voyager 1",
      hi: "वॉयेजर 1",
      zh: "旅行者1号",
      ko: "보이저 1호",
      ja: "ボイジャー1号",
      es: "Voyager 1",
      fr: "Voyager 1",
      tr: "Voyager 1",
      ru: "Вояджер-1",
      pt: "Voyager 1",
      ar: "فوييجر 1",
      el: "Voyager 1",
    },
    value: {
      de: "seit 2012 im interstellaren Raum",
      en: "in interstellar space since 2012",
      hi: "2012 से अंतरतारकीय अंतरिक्ष में",
      zh: "自2012年起进入星际空间",
      ko: "2012년부터 성간 공간에 진입",
      ja: "2012年以降、恒星間空間に",
      es: "en el espacio interestelar desde 2012",
      fr: "dans l'espace interstellaire depuis 2012",
      tr: "2012'den beri yıldızlararası uzayda",
      ru: "в межзвёздном пространстве с 2012 года",
      pt: "no espaço interestelar desde 2012",
      ar: "في الفضاء بين النجمي منذ 2012",
      el: "στο διαστρικό διάστημα από το 2012",
    },
    details: [
      {
        de: "Voyager 1, gestartet 1977, ist das am weitesten von der Erde entfernte von Menschen gebaute Objekt — inzwischen mehr als 24 Milliarden Kilometer entfernt.",
        en: "Voyager 1, launched in 1977, is the most distant human-made object from Earth — now more than 24 billion kilometers away.",
        hi: "1977 में लॉन्च हुआ वॉयेजर 1, पृथ्वी से सबसे दूर मानव निर्मित वस्तु है — अब 24 अरब किलोमीटर से भी अधिक दूर।",
        zh: "1977年发射的旅行者1号,是距离地球最远的人造物体——如今已超过240亿千米之遥。",
        ko: "1977년 발사된 보이저 1호는 지구에서 가장 멀리 떨어진 인간이 만든 물체이다. 현재는 240억km 이상 떨어져 있다.",
        ja: "1977年に打ち上げられたボイジャー1号は、地球から最も遠くにある人工物である。現在では240億kmを超える距離にある。",
        es: "Voyager 1, lanzada en 1977, es el objeto hecho por el hombre más distante de la Tierra, actualmente a más de 24.000 millones de kilómetros.",
        fr: "Voyager 1, lancée en 1977, est l'objet fabriqué par l'homme le plus éloigné de la Terre — désormais à plus de 24 milliards de kilomètres.",
        tr: "1977'de fırlatılan Voyager 1, Dünya'dan en uzaktaki insan yapımı nesnedir — şu anda 24 milyar kilometreden daha uzakta.",
        ru: "«Вояджер-1», запущенный в 1977 году, — самый удалённый от Земли объект, созданный человеком: сейчас он находится на расстоянии более 24 миллиардов километров.",
        pt: "A Voyager 1, lançada em 1977, é o objeto feito pelo homem mais distante da Terra — atualmente a mais de 24 bilhões de quilômetros de distância.",
        ar: "فوييجر 1، الذي أُطلق عام 1977، هو أبعد جسم من صنع الإنسان عن الأرض — وهو الآن على بعد أكثر من 24 مليار كيلومتر.",
        el: "Το Voyager 1, που εκτοξεύτηκε το 1977, είναι το πιο απομακρυσμένο από τη Γη ανθρωπογενές αντικείμενο — πλέον σε απόσταση άνω των 24 δισ. χιλιομέτρων.",
      },
      {
        de: "2012 verließ die Sonde als erstes menschengemachtes Objekt die Heliosphäre und trat in den interstellaren Raum ein.",
        en: "In 2012, the probe became the first human-made object to leave the heliosphere and enter interstellar space.",
        hi: "2012 में यह जांच हेलियोस्फीयर छोड़ने वाली और अंतरतारकीय अंतरिक्ष में प्रवेश करने वाली पहली मानव निर्मित वस्तु बनी।",
        zh: "2012年,这枚探测器成为首个离开日球层、进入星际空间的人造物体。",
        ko: "2012년 이 탐사선은 헬리오스피어를 벗어나 성간 공간에 진입한 최초의 인간이 만든 물체가 되었다.",
        ja: "2012年、この探査機は太陽圏を離れ恒星間空間に入った最初の人工物となった。",
        es: "En 2012, la sonda se convirtió en el primer objeto hecho por el hombre en abandonar la heliosfera y entrar en el espacio interestelar.",
        fr: "En 2012, la sonde est devenue le premier objet fabriqué par l'homme à quitter l'héliosphère et à pénétrer dans l'espace interstellaire.",
        tr: "2012'de sonda, heliosferi terk edip yıldızlararası uzaya giren ilk insan yapımı nesne oldu.",
        ru: "В 2012 году зонд стал первым объектом, созданным человеком, который покинул гелиосферу и вошёл в межзвёздное пространство.",
        pt: "Em 2012, a sonda se tornou o primeiro objeto feito pelo homem a deixar a heliosfera e entrar no espaço interestelar.",
        ar: "في عام 2012، أصبح المسبار أول جسم من صنع الإنسان يغادر الغلاف الشمسي ويدخل الفضاء بين النجمي.",
        el: "Το 2012, ο ανιχνευτής έγινε το πρώτο ανθρωπογενές αντικείμενο που άφησε την ηλιόσφαιρα και εισήλθε στο διαστρικό διάστημα.",
      },
      {
        de: "An Bord trägt sie die 'Golden Record' — eine vergoldete Schallplatte mit Klängen, Musik und Grüßen der Erde, für den unwahrscheinlichen Fall, dass sie eines Tages von einer außerirdischen Zivilisation gefunden wird.",
        en: "On board it carries the 'Golden Record' — a gold-plated phonograph record with sounds, music, and greetings from Earth, in case it is ever found by an extraterrestrial civilization.",
        hi: "इसके साथ 'गोल्डन रिकॉर्ड' है — सोने की परत वाला एक ग्रामोफोन रिकॉर्ड जिसमें पृथ्वी की ध्वनियाँ, संगीत और अभिवादन हैं, इस दुर्लभ संभावना के लिए कि इसे कभी किसी अलौकिक सभ्यता द्वारा पाया जाए।",
        zh: "它携带着'金唱片'——一张镀金的黑胶唱片,记录着地球的声音、音乐和问候,以备有朝一日被外星文明发现。",
        ko: "탐사선에는 '골든 레코드'가 실려 있다. 이는 금으로 도금된 축음기 음반으로, 언젠가 외계 문명이 이를 발견할 경우를 대비해 지구의 소리와 음악, 인사말을 담고 있다.",
        ja: "その機内には「ゴールデンレコード」が積まれている。これは金メッキが施されたレコード盤で、地球の音や音楽、挨拶が収められており、いつか地球外文明に発見される万が一の可能性に備えたものである。",
        es: "A bordo lleva el 'Disco de Oro', un disco fonográfico chapado en oro con sonidos, música y saludos de la Tierra, por si alguna vez es encontrado por una civilización extraterrestre.",
        fr: "Elle transporte à son bord le « disque d'or » — un disque phonographique plaqué or contenant des sons, de la musique et des salutations de la Terre, au cas où elle serait un jour découverte par une civilisation extraterrestre.",
        tr: "Sonda, günün birinde bir uzaylı medeniyeti tarafından bulunma ihtimaline karşı, Dünya'dan sesler, müzik ve selamlar içeren altın kaplama bir plak olan 'Altın Plak'ı taşıyor.",
        ru: "На борту зонд несёт «Золотую пластинку» — позолоченную грампластинку со звуками, музыкой и приветствиями Земли, на случай, если её когда-нибудь найдёт внеземная цивилизация.",
        pt: "A bordo, ela carrega o 'Disco de Ouro' — um disco fonográfico banhado a ouro com sons, música e saudações da Terra, para o caso improvável de ser encontrado um dia por uma civilização extraterrestre.",
        ar: "يحمل المسبار على متنه 'السجل الذهبي' — أسطوانة مطلية بالذهب تحتوي على أصوات وموسيقى وتحيات من الأرض، تحسبًا لاحتمال بعيد أن تجده حضارة خارج كوكب الأرض يومًا ما.",
        el: "Φέρει επάνω του τον «Χρυσό Δίσκο» — έναν επίχρυσο δίσκο γραμμοφώνου με ήχους, μουσική και χαιρετισμούς από τη Γη, για την απίθανη περίπτωση που κάποια εξωγήινη πολιτισμός τον βρει κάποια μέρα.",
      },
    ],
    image: commonsFile("Pale_Blue_Dot.png"),
  },
  {
    label: {
      de: "James-Webb-Weltraumteleskop",
      en: "James Webb Space Telescope",
      hi: "जेम्स वेब स्पेस टेलीस्कोप",
      zh: "詹姆斯·韦伯太空望远镜",
      ko: "제임스 웹 우주망원경",
      ja: "ジェイムズ・ウェッブ宇宙望遠鏡",
      es: "Telescopio Espacial James Webb",
      fr: "Télescope spatial James-Webb",
      tr: "James Webb Uzay Teleskobu",
      ru: "Космический телескоп Джеймса Уэбба",
      pt: "Telescópio Espacial James Webb",
      ar: "تلسكوب جيمس ويب الفضائي",
      el: "Διαστημικό Τηλεσκόπιο James Webb",
    },
    value: {
      de: "aktiv seit 2022",
      en: "active since 2022",
      hi: "2022 से सक्रिय",
      zh: "自2022年起投入使用",
      ko: "2022년부터 가동 중",
      ja: "2022年より稼働中",
      es: "activo desde 2022",
      fr: "actif depuis 2022",
      tr: "2022'den beri aktif",
      ru: "работает с 2022 года",
      pt: "ativo desde 2022",
      ar: "نشط منذ 2022",
      el: "ενεργό από το 2022",
    },
    details: [
      {
        de: "Das James-Webb-Weltraumteleskop (JWST) ist das bisher leistungsfähigste Weltraumteleskop und beobachtet vor allem im Infrarotbereich — dadurch kann es durch Staubwolken hindurchblicken und extrem weit entfernte, junge Galaxien sichtbar machen.",
        en: "The James Webb Space Telescope (JWST) is the most powerful space telescope to date and observes primarily in infrared — letting it peer through dust clouds and reveal extremely distant, young galaxies.",
        hi: "जेम्स वेब स्पेस टेलीस्कोप (JWST) अब तक का सबसे शक्तिशाली स्पेस टेलीस्कोप है और मुख्यतः इन्फ्रारेड में अवलोकन करता है — जिससे यह धूल के बादलों के पार देख सकता है और अत्यंत दूर की युवा आकाशगंगाओं को दृश्यमान बना सकता है।",
        zh: "詹姆斯·韦伯太空望远镜(JWST)是迄今为止最强大的太空望远镜,主要以红外波段进行观测——这使它能够穿透尘云,揭示极其遥远的年轻星系。",
        ko: "제임스 웹 우주망원경(JWST)은 현재까지 가장 강력한 우주망원경으로, 주로 적외선 영역에서 관측을 수행한다. 이를 통해 먼지 구름을 투과해 매우 먼 거리의 젊은 은하들을 드러낼 수 있다.",
        ja: "ジェイムズ・ウェッブ宇宙望遠鏡(JWST)は、これまでで最も強力な宇宙望遠鏡であり、主に赤外線領域で観測を行う。これによりチリの雲を透過して見ることができ、極めて遠方にある若い銀河を捉えることが可能となる。",
        es: "El Telescopio Espacial James Webb (JWST) es el telescopio espacial más potente hasta la fecha y observa principalmente en infrarrojo, lo que le permite ver a través de nubes de polvo y revelar galaxias jóvenes extremadamente lejanas.",
        fr: "Le télescope spatial James-Webb (JWST) est le télescope spatial le plus puissant à ce jour et observe principalement dans l'infrarouge — ce qui lui permet de voir à travers les nuages de poussière et de révéler des galaxies jeunes extrêmement lointaines.",
        tr: "James Webb Uzay Teleskobu (JWST), bugüne kadarki en güçlü uzay teleskobudur ve öncelikle kızılötesi bölgede gözlem yapar — bu sayede toz bulutlarının içini görebilir ve son derece uzak, genç galaksileri gözler önüne serebilir.",
        ru: "Космический телескоп Джеймса Уэбба (JWST) — самый мощный космический телескоп на сегодняшний день, наблюдающий преимущественно в инфракрасном диапазоне, что позволяет ему заглядывать сквозь пылевые облака и обнаруживать чрезвычайно далёкие молодые галактики.",
        pt: "O Telescópio Espacial James Webb (JWST) é o telescópio espacial mais poderoso até hoje e observa principalmente na faixa do infravermelho — o que permite enxergar através de nuvens de poeira e revelar galáxias jovens extremamente distantes.",
        ar: "تلسكوب جيمس ويب الفضائي (JWST) هو أقوى تلسكوب فضائي حتى الآن، ويرصد بشكل أساسي في نطاق الأشعة تحت الحمراء — مما يتيح له النظر عبر سحب الغبار وكشف مجرات فتية بعيدة للغاية.",
        el: "Το Διαστημικό Τηλεσκόπιο James Webb (JWST) είναι το πιο ισχυρό διαστημικό τηλεσκόπιο μέχρι σήμερα και παρατηρεί κυρίως στο υπέρυθρο φάσμα — γεγονός που του επιτρέπει να βλέπει μέσα από νέφη σκόνης και να αποκαλύπτει εξαιρετικά μακρινούς, νεαρούς γαλαξίες.",
      },
      {
        de: "Es befindet sich rund 1,5 Millionen Kilometer von der Erde entfernt am Lagrange-Punkt L2, ständig von der Sonne abgeschirmt durch einen tennisplatzgroßen Sonnenschutz.",
        en: "It sits about 1.5 million kilometers from Earth at the L2 Lagrange point, permanently shielded from the Sun by a tennis-court-sized sunshield.",
        hi: "यह पृथ्वी से लगभग 15 लाख किलोमीटर दूर लैग्रेंज बिंदु L2 पर स्थित है, जो एक टेनिस कोर्ट के आकार की सन-शील्ड से सूर्य से स्थायी रूप से सुरक्षित है।",
        zh: "它位于距地球约150万千米的拉格朗日L2点,由一个网球场大小的遮阳板持续遮挡阳光。",
        ko: "이는 지구에서 약 150만km 떨어진 라그랑주점 L2에 위치해 있으며, 테니스 코트 크기의 차양막으로 태양으로부터 영구적으로 가려져 있다.",
        ja: "地球から約150万km離れたラグランジュ点L2に位置し、テニスコートほどの大きさの日よけによって常に太陽から遮蔽されている。",
        es: "Se encuentra a unos 1,5 millones de kilómetros de la Tierra, en el punto de Lagrange L2, protegido permanentemente del Sol por un parasol del tamaño de una cancha de tenis.",
        fr: "Il se trouve à environ 1,5 million de kilomètres de la Terre, au point de Lagrange L2, en permanence protégé du Soleil par un bouclier thermique de la taille d'un court de tennis.",
        tr: "Dünya'dan yaklaşık 1,5 milyon kilometre uzaklıkta, L2 Lagrange noktasında bulunur ve tenis kortu büyüklüğündeki bir güneş kalkanıyla Güneş'ten sürekli korunur.",
        ru: "Он находится примерно в 1,5 миллиона километров от Земли в точке Лагранжа L2, постоянно защищённый от Солнца теплозащитным экраном размером с теннисный корт.",
        pt: "Ele está localizado a cerca de 1,5 milhão de quilômetros da Terra, no ponto de Lagrange L2, permanentemente protegido do Sol por um escudo solar do tamanho de uma quadra de tênis.",
        ar: "يقع على بعد نحو 1.5 مليون كيلومتر من الأرض عند نقطة لاغرانج L2، محميًا بشكل دائم من الشمس بدرع شمسي بحجم ملعب تنس.",
        el: "Βρίσκεται περίπου 1,5 εκατομμύριο χιλιόμετρα από τη Γη, στο σημείο Λαγκράνζ L2, μόνιμα προστατευμένο από τον Ήλιο με μια ηλιακή ασπίδα στο μέγεθος γηπέδου τένις.",
      },
      {
        de: "Seit Beginn seiner wissenschaftlichen Beobachtungen 2022 hat es unter anderem Atmosphären von Exoplaneten untersucht und einige der ältesten bekannten Galaxien entdeckt.",
        en: "Since starting scientific observations in 2022, it has studied exoplanet atmospheres and discovered some of the oldest known galaxies, among other findings.",
        hi: "2022 में अपने वैज्ञानिक अवलोकन शुरू करने के बाद से, इसने बाह्यग्रहों के वायुमंडल का अध्ययन किया है और अब तक ज्ञात कुछ सबसे पुरानी आकाशगंगाओं की खोज की है।",
        zh: "自2022年开始科学观测以来,它已经研究了系外行星的大气层,并发现了一些已知最古老的星系等重要成果。",
        ko: "2022년 과학 관측을 시작한 이래로, 외계행성의 대기를 연구하고 알려진 것 중 가장 오래된 은하 중 일부를 발견하는 등 여러 성과를 거두었다.",
        ja: "2022年に科学観測を開始して以来、系外惑星の大気を調べ、既知の中で最も古い銀河のいくつかを発見するなど、数々の成果を挙げてきた。",
        es: "Desde el inicio de sus observaciones científicas en 2022, ha estudiado las atmósferas de exoplanetas y descubierto algunas de las galaxias más antiguas conocidas, entre otros hallazgos.",
        fr: "Depuis le début de ses observations scientifiques en 2022, il a notamment étudié les atmosphères d'exoplanètes et découvert certaines des galaxies les plus anciennes connues.",
        tr: "2022'de bilimsel gözlemlerine başladığından bu yana, ötegezegen atmosferlerini inceledi ve bilinen en eski galaksilerden bazılarını keşfetti.",
        ru: "С начала научных наблюдений в 2022 году он, среди прочего, изучал атмосферы экзопланет и обнаружил одни из самых старых известных галактик.",
        pt: "Desde o início de suas observações científicas em 2022, ele estudou atmosferas de exoplanetas e descobriu algumas das galáxias mais antigas já conhecidas, entre outras descobertas.",
        ar: "منذ بدء ملاحظاته العلمية عام 2022، درس أغلفة جوية لكواكب خارجية واكتشف بعضًا من أقدم المجرات المعروفة، من بين اكتشافات أخرى.",
        el: "Από την έναρξη των επιστημονικών παρατηρήσεών του το 2022, έχει μελετήσει ατμόσφαιρες εξωπλανητών και έχει ανακαλύψει μερικούς από τους παλαιότερους γνωστούς γαλαξίες, μεταξύ άλλων ευρημάτων.",
      },
    ],
    image: commonsFile("James_Webb_Space_Telescope_2009_top.jpg"),
  },
];

interface RevealCardProps {
  children: (inView: boolean) => ReactNode;
  className?: string;
  onClick?: () => void;
}

function RevealCard({ children, className, onClick }: RevealCardProps) {
  const { ref, inView } = useInView<HTMLButtonElement>();
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`group text-left transition-colors ${className ?? ""}`}
    >
      {children(inView)}
    </button>
  );
}

// Nutzerkorrektur 20.09.2026: "mach es bitte klein also die boxen klein
// das bild daneben auch klein (box soll futuristisch sein)" — statt eines
// großen 16:9-Bilds über der ganzen Kartenbreite jetzt ein kleines
// quadratisches Vorschaubild SEITLICH neben dem Text, mit einer dünnen
// Akzent-Ecke (HUD-artiger Rahmen) für den futuristischen Look. Blendet
// sich unsichtbar aus, falls ein Bild mal nicht lädt.
function FactThumbnail({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) return null;
  return (
    <div className="relative h-14 w-14 flex-none overflow-hidden border border-border bg-surface-elevated sm:h-16 sm:w-16">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
        onError={() => setFailed(true)}
      />
      <span className="pointer-events-none absolute inset-0 border border-accent/0 transition-colors group-hover:border-accent/60" />
    </div>
  );
}

/**
 * "Universum kennenlernen" — eigene Seite (Nutzerwunsch 20.09.2026: "kannst
 * ganze space news und universum in zahlen in einer anderen seite tun wie
 * weltgeschichte entdecken? aber fülle mehr infos über universum hinein"),
 * analog zu /imperien für die Weltgeschichte-Karte. Enthält die vorher auf
 * der Startseite liegende "Universum in Zahlen"-Fakten-Sektion (jetzt mit
 * mehr Einträgen: Dunkle Materie, Dunkle Energie, Schwarze Löcher,
 * Exoplaneten) sowie die Space-News-Sektion, statt beides auf der
 * Startseite unterzubringen.
 */
export default function UniversumPage() {
  const [selectedFact, setSelectedFact] = useState<number | null>(null);
  const [showSolarSystem, setShowSolarSystem] = useState(false);
  const { t, lang } = useLanguage();

  return (
    <main className="relative min-h-screen">
      <SiteBackground />

      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-20 pt-10 sm:px-8 sm:pt-14">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="label-mono inline-flex w-fit items-center gap-2 text-xs uppercase text-muted transition-colors hover:text-accent"
          >
            ← {t("back")}
          </Link>
          <LanguageSwitcher />
        </div>

        <header className="mb-8 border-b border-border pb-6">
          <p className="label-mono text-xs uppercase text-muted">{t("universeLabel")}</p>
          <h1 className="font-display mt-2 text-2xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
            {t("universeTitle")}
          </h1>
          <p className="mt-3 max-w-2xl text-xs leading-relaxed text-muted sm:text-sm">
            {t("universeIntro")}
          </p>
        </header>

        {/* Nutzerwunsch 20.09.2026: "erstelle so ein box mit solarsystem
            oben. wenn ich auf dem box drücke dann soll was ähnliches
            kommen aber mit vollbildbfenster mit X button" — kleine
            animierte Vorschau, öffnet per Klick die interaktive
            Vollbild-Ansicht (SolarSystemModal). */}
        <button
          type="button"
          onClick={() => setShowSolarSystem(true)}
          className="group relative mb-10 h-64 w-full overflow-hidden border border-border bg-background text-left transition-colors hover:border-accent sm:h-80"
        >
          <SolarSystem mode="compact" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-4">
            <p className="label-mono text-xs uppercase text-accent">{t("solarSystemLabel")}</p>
            <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-foreground">
              {t("liveExplore")}
              <span className="transition-transform group-hover:translate-x-1">↗</span>
            </p>
          </div>
        </button>

        <div className="mb-10">
          <p className="label-mono text-xs uppercase">{t("universeInNumbers")}</p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {UNIVERSE_FACTS.map((fact, i) => {
            const value = localize(fact.value, lang);
            const label = localize(fact.label, lang);
            return (
              <RevealCard
                key={value + label}
                className="glass-card flex items-center gap-3 p-3"
                onClick={() => setSelectedFact(i)}
              >
                {(inView) => (
                  <>
                    <FactThumbnail src={fact.image} alt={label} />
                    <div className="min-w-0 flex-1">
                      <p className="font-display min-h-[1.3em] text-sm font-bold text-accent sm:text-base">
                        <Typewriter text={value} active={inView} speed={12} />
                      </p>
                      <p className="mt-1 min-h-[1.2em] text-[10px] uppercase leading-snug tracking-wide text-muted">
                        <Typewriter
                          text={label}
                          active={inView}
                          speed={10}
                          delay={value.length * 12 + 150}
                        />
                      </p>
                    </div>
                  </>
                )}
              </RevealCard>
            );
          })}
        </div>

        <SpaceNewsSection />

        {selectedFact !== null && (
          <DetailModal
            eyebrow={t("universeInNumbers")}
            title={localize(UNIVERSE_FACTS[selectedFact].label, lang)}
            meta={localize(UNIVERSE_FACTS[selectedFact].value, lang)}
            paragraphs={UNIVERSE_FACTS[selectedFact].details.map((d) => localize(d, lang))}
            imageUrl={UNIVERSE_FACTS[selectedFact].image}
            imageAlt={localize(UNIVERSE_FACTS[selectedFact].label, lang)}
            imageCredit="Bild: Wikimedia Commons"
            onClose={() => setSelectedFact(null)}
          />
        )}

        {showSolarSystem && (
          <SolarSystemModal onClose={() => setShowSolarSystem(false)} />
        )}
      </div>
    </main>
  );
}
