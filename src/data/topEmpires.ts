export interface EmpireFact {
  name: string;
  peak: string;
  text: string;
  details: string[];
  image: string;
}

/**
 * Ausgelagert aus FactsSection.tsx (19.09.2026), damit dieselbe "Große
 * Imperien der Geschichte"-Box sowohl auf der Startseite als auch unten auf
 * der /imperien-Kartenseite verwendet werden kann (Nutzerwunsch: "nimm diese
 * box mit großen imperien füge es in die seite unten wo karte ist").
 */
export const TOP_EMPIRES: EmpireFact[] = [
  {
    name: "Britisches Empire",
    peak: "Frühes 20. Jh.",
    text: "Größtes Imperium der Geschichte — zeitweise rund ein Viertel der Landfläche der Erde und ein Viertel der Weltbevölkerung.",
    details: [
      "Auf seinem Höhepunkt um 1920 erstreckte sich das Britische Empire über rund 35,5 Millionen km² auf allen bewohnten Kontinenten — geprägt vom geflügelten Ausdruck, dass 'die Sonne nie unterging'.",
      "Es entstand ab dem 16./17. Jahrhundert aus Handelskompanien und Kolonialbesitz und wuchs über See- und Wirtschaftsmacht, insbesondere während der industriellen Revolution.",
      "Die Kolonialherrschaft brachte tiefgreifende, bis heute nachwirkende Folgen für die betroffenen Regionen mit sich — wirtschaftliche Ausbeutung, Grenzziehungen ohne Rücksicht auf lokale Strukturen und gewaltsame Konflikte gehören ebenso zur historischen Bilanz wie Infrastruktur- und Verwaltungsaufbau.",
      "Nach dem Zweiten Weltkrieg begann die schrittweise Entkolonialisierung; aus dem Empire ging der Commonwealth of Nations hervor, dem heute 56 überwiegend unabhängige Staaten angehören.",
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Flag_of_Great_Britain_%281707%E2%80%931800%29.svg/1200px-Flag_of_Great_Britain_%281707%E2%80%931800%29.svg.png",
  },
  {
    name: "Mongolisches Reich",
    peak: "13. Jh.",
    text: "Größtes zusammenhängendes Landimperium aller Zeiten — von Ostasien bis Osteuropa, ca. 24 Mio. km².",
    details: [
      "Gegründet von Dschingis Khan ab 1206, wuchs das Mongolische Reich innerhalb weniger Jahrzehnte durch überlegene Reiterkriegsführung und Logistik zum größten zusammenhängenden Landreich der Geschichte.",
      "Auf seinem Höhepunkt reichte es von Korea und China im Osten bis nach Osteuropa und in den Nahen Osten — etwa 24 Millionen km², rund 16 % der gesamten Landfläche der Erde.",
      "Die Eroberungen forderten enorme menschliche Opfer und zerstörten zahlreiche Städte; gleichzeitig etablierten die Mongolen entlang der Seidenstraße relative Sicherheit für Handel und Reisende ('Pax Mongolica') sowie religiöse Toleranz innerhalb des Reiches.",
      "Nach dem Tod des Großkhans Möngke 1259 zerfiel das Reich zunehmend in einzelne Khanate, die sich kulturell und politisch immer weiter voneinander entfernten.",
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/3/35/YuanEmperorAlbumGenghisPortrait.jpg",
  },
  {
    name: "Römisches Reich",
    peak: "2. Jh. n. Chr.",
    text: "Höhepunkt unter Trajan: rund 5 Mio. km² und schätzungsweise 60–70 Mio. Einwohner rund ums Mittelmeer.",
    details: [
      "Unter Kaiser Trajan (98–117 n. Chr.) erreichte das Römische Reich seine größte Ausdehnung — von Britannien im Nordwesten bis Mesopotamien im Osten, rund 5 Millionen km².",
      "Es entwickelte ein für die Antike beispielloses Verwaltungs-, Rechts- und Infrastruktursystem: über 80.000 km gepflasterte Straßen, Aquädukte, ein einheitliches Rechtssystem und eine gemeinsame Verkehrssprache (Latein im Westen, Griechisch im Osten).",
      "Wie andere antike Imperien beruhte der römische Wohlstand teils auf Eroberungskriegen und weitverbreiteter Sklaverei, die einen erheblichen Teil der Wirtschaft trug.",
      "Das Weströmische Reich zerfiel 476 n. Chr.; das Oströmische (Byzantinische) Reich bestand mit Konstantinopel als Hauptstadt noch fast tausend Jahre länger, bis 1453.",
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/0/00/Roman_Empire_Trajan_117AD.png",
  },
  {
    name: "Perserreich (Achämeniden)",
    peak: "6.–4. Jh. v. Chr.",
    text: "Erstes echte 'Weltreich' — von Griechenland und Ägypten bis zum Industal, mit frühem Verwaltungs- und Straßensystem.",
    details: [
      "Gegründet von Kyros II. ab 550 v. Chr., wuchs das Achämenidenreich zum bis dahin größten Reich der Geschichte — von Teilen Griechenlands über Ägypten bis zum Industal in Südasien.",
      "Es gilt vielen Historikern als erstes echtes 'Weltreich': Es organisierte sein riesiges, multiethnisches Gebiet in Provinzen (Satrapien) mit einheitlicher Verwaltung, einem Kurierstraßennetz ('Königsstraße') und relativer religiöser Toleranz gegenüber unterworfenen Völkern.",
      "Unter Dareios I. und Xerxes I. kam es zu den bekannten Perserkriegen gegen die griechischen Stadtstaaten, die in der westlichen Überlieferung stark aus griechischer Perspektive geprägt sind.",
      "336 v. Chr. wurde das Reich von Alexander dem Großen erobert, dessen Verwaltung in weiten Teilen auf den bestehenden persischen Strukturen aufbaute.",
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Achaemenid_Empire_500_BCE.jpg",
  },
];
