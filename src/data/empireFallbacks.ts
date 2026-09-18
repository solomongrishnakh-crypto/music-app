/**
 * Redaktionelle Kurzbeschreibungen fuer bedeutende historische Reiche/
 * Staaten, zu denen die automatische Wikipedia-Suche in
 * /api/empires/info (noch) keinen passenden Artikel findet — meist weil
 * der Name im Geodatenset ("historical-basemaps") vom tatsaechlichen
 * Wikipedia-Artikeltitel abweicht (z.B. Sonderzeichen wie "Kievan Rus'",
 * britische vs. amerikanische Schreibweise, oder Sammelbezeichnungen wie
 * "Han"/"Jin" fuer eine chinesische Dynastie).
 *
 * Nutzerwunsch 18.09.2026: "schau mal alle imperien durch weil fast 70%
 * davon haben keine infos ... füge es selbst ein wenn du keine infos bei
 * imperien nicht findest".
 *
 * WICHTIG (Nutzerpräferenz: Antworten müssen geprüft/korrekt sein): hier
 * stehen nur Eintraege zu gut dokumentierten, bekannten historischen
 * Reichen/Kulturen, zu denen ich als Sprachmodell verlaessliches Wissen
 * habe — selbst verfasst, NICHT von Wikipedia kopiert. Die riesige
 * Mehrheit der ~3000 im Datenset vorkommenden Namen sind sehr kleine,
 * kaum dokumentierte indigene Voelker/Staemme (v.a. Nord-/Suedamerika,
 * Australien) — dazu selbst erfundene "Beschreibungen" zu schreiben waere
 * unseriöses Raten, deshalb bleiben die unangetastet und zeigen weiter
 * "keine Beschreibung gefunden".
 *
 * Schluessel = exakter "NAME"-Wert aus dem Geodatenset (Gross-/
 * Kleinschreibung und Sonderzeichen muessen exakt passen).
 */

export interface EmpireFallbackEntry {
  title: string;
  extract: string;
  language: string | null;
}

const HAN_EXTRACT =
  "Die Han-Dynastie (206 v. Chr. – 220 n. Chr.) war die zweite Kaiserdynastie Chinas und wird oft als goldenes Zeitalter betrachtet, das die chinesische Kultur und Identität nachhaltig praegte — bis heute nennen sich die Han-Chinesen nach ihr. Sie folgte auf die kurzlebige Qin-Dynastie und dehnte das Reich nach Zentralasien und Korea aus.";

const JIN_EXTRACT =
  "Als \"Jin\" werden im Chinesischen mehrere Dynastien bezeichnet: die Jin-Dynastie (265–420 n. Chr.), die nach den Drei Reichen kurzzeitig ganz China vereinte, sowie die spaetere von den Jurchen gegruendete Jin-Dynastie (1115–1234), die Nordchina beherrschte, bis sie von den Mongolen erobert wurde.";

const FALLBACKS: Record<string, EmpireFallbackEntry> = {
  "Achaemenid Empire": {
    title: "Achämenidenreich",
    extract:
      "Das Achämenidenreich (ca. 550–330 v. Chr.), gegruendet von Kyros dem Grossen, war das erste persische Grossreich und erstreckte sich zeitweise vom Balkan bis zum Indus — damit eines der flaechenmaessig groessten Reiche der Antike. Es endete mit der Eroberung durch Alexander den Grossen.",
    language: "Altpersisch, Aramäisch (Verwaltungssprache), Elamisch",
  },
  "British Raj": {
    title: "Britisch-Indien (British Raj)",
    extract:
      "Der British Raj bezeichnet die direkte britische Kronherrschaft ueber den indischen Subkontinent von 1858 bis 1947, nach dem Ende der Herrschaft der Britischen Ostindien-Kompanie. Er endete mit der Unabhaengigkeit und der Teilung in Indien und Pakistan.",
    language: "Englisch (Verwaltung), Hindi, Urdu und zahlreiche Regionalsprachen",
  },
  "Buwayhid Emirates": {
    title: "Buyiden (Buwayhiden)",
    extract:
      "Die Buyiden waren eine schiitisch-iranische Dynastie, die von 934 bis 1062 grosse Teile des Irak und Irans beherrschte und dabei formal die Oberhoheit des sunnitischen Abbasiden-Kalifen in Bagdad anerkannte, tatsaechlich aber die politische Macht ausuebte.",
    language: "Persisch, Arabisch",
  },
  "Chagatai Khanate": {
    title: "Tschagatai-Khanat",
    extract:
      "Das Tschagatai-Khanat entstand aus dem Erbteil Tschagatais, eines Sohnes Dschingis Khans, und beherrschte vom 13. bis ins 14. Jahrhundert weite Teile Zentralasiens (Transoxanien und das Tarimbecken).",
    language: "Mongolisch, später Tschagataisch (Turksprache)",
  },
  "Cuman Khanates": {
    title: "Kumanen-Khanate",
    extract:
      "Die Kumanen (auch Kiptschak genannt) waren ein Turkvolk, dessen lose verbuendete Khanate vom 11. Jahrhundert bis zur mongolischen Eroberung in den 1230er-Jahren die Steppe zwischen Schwarzem und Kaspischem Meer beherrschten.",
    language: "Kumanisch (Turksprache)",
  },
  "Cuman-Kipchak confederation": {
    title: "Kumanisch-Kiptschakischer Bund",
    extract:
      "Der kumanisch-kiptschakische Stammesbund vereinte turksprachige Nomadengruppen, die vom 11. bis 13. Jahrhundert die eurasische Steppe von Ungarn bis Kasachstan dominierten, bevor sie in das Mongolenreich (Goldene Horde) eingegliedert wurden.",
    language: "Kumanisch/Kiptschakisch (Turksprache)",
  },
  "Eastern Roman Empire": {
    title: "Oströmisches Reich (Byzantinisches Reich)",
    extract:
      "Das Oströmische Reich, besser bekannt als Byzantinisches Reich, war die Fortsetzung des Römischen Reichs im Osten mit der Hauptstadt Konstantinopel. Es ueberdauerte den Untergang Westroms im 5. Jahrhundert um fast tausend Jahre, bis zur osmanischen Eroberung 1453.",
    language: "Griechisch (ab dem 7. Jh.), zuvor Latein",
  },
  Elam: {
    title: "Elam",
    extract:
      "Elam war eine antike Zivilisation im heutigen suedwestlichen Iran mit dem Zentrum Susa, eine der fruehesten Hochkulturen der Menschheit. Sie bestand von etwa 3200 v. Chr. bis zu ihrer Eroberung durch die Achämeniden.",
    language: "Elamisch",
  },
  "Empire of Alexander": {
    title: "Reich Alexanders des Grossen",
    extract:
      "Zwischen 336 und 323 v. Chr. eroberte Alexander der Grosse von Makedonien das persische Achämenidenreich und schuf ein Grossreich, das von Griechenland bis in den Nordwesten Indiens reichte. Nach seinem Tod zerfiel es rasch in die hellenistischen Diadochenreiche.",
    language: "Griechisch (Koine)",
  },
  "Fatimid Caliphate": {
    title: "Fatimiden-Kalifat",
    extract:
      "Das Fatimiden-Kalifat war ein schiitisch-ismailitisches Kalifat, das von 909 bis 1171 Nordafrika und spaeter auch Ägypten und die Levante beherrschte. Es gruendete 969 die Stadt Kairo als seine Hauptstadt.",
    language: "Arabisch",
  },
  "Grand Duchy of Moscow": {
    title: "Grossfürstentum Moskau",
    extract:
      "Das Grossfürstentum Moskau war ein mittelalterliches russisches Fürstentum, das ab dem 14. Jahrhundert an Macht gewann, weite Teile der nordöstlichen Rus vereinte und zum Kern des spaeteren Zarentums Russland wurde.",
    language: "Altostslawisch / Russisch",
  },
  "Great Khanate": {
    title: "Grosskhanat (Yuan-Dynastie)",
    extract:
      "Als \"Grosskhanat\" wird das direkt vom Grosskhan regierte Kernland des Mongolenreichs bezeichnet — nach der Aufteilung des Reichs in mehrere Khanate im 13. Jahrhundert entsprach es vor allem China unter der von Kublai Khan gegruendeten Yuan-Dynastie.",
    language: "Mongolisch",
  },
  "Gupta Empire": {
    title: "Gupta-Reich",
    extract:
      "Das Gupta-Reich (ca. 320–550 n. Chr.) umfasste weite Teile des indischen Subkontinents und gilt als goldenes Zeitalter indischer Kunst, Wissenschaft und Literatur.",
    language: "Sanskrit",
  },
  Göktürks: {
    title: "Göktürken",
    extract:
      "Die Göktürken waren das erste turksprachige Volk, das den Namen \"Türk\" als politische Bezeichnung fuehrte. Ihr Göktürk-Khaganat war vom 6. bis 8. Jahrhundert ein grosses Steppenreich in Zentralasien.",
    language: "Alttürkisch",
  },
  Han: {
    title: "Han-Dynastie",
    extract: HAN_EXTRACT,
    language: "Altchinesisch",
  },
  "Han Empire": {
    title: "Han-Dynastie",
    extract: HAN_EXTRACT,
    language: "Altchinesisch",
  },
  "Hurrian Kingdoms": {
    title: "Hurritische Reiche",
    extract:
      "Die Hurriter gruendeten mehrere Bronzezeit-Königreiche im nördlichen Mesopotamien und Syrien, deren maechtigstes Mitanni (ca. 1500–1300 v. Chr.) war — ein bedeutender Rivale Ägyptens und der Hethiter.",
    language: "Hurritisch",
  },
  Ilkhanate: {
    title: "Ilkhanat",
    extract:
      "Das Ilkhanat war ein von Hülegü Khan gegruendetes mongolisches Khanat, das von 1256 bis 1335 Persien, den Irak sowie Teile des Kaukasus und Anatoliens beherrschte.",
    language: "Mongolisch, Persisch",
  },
  "Inca Empire": {
    title: "Inkareich",
    extract:
      "Das Inkareich war das groesste Reich im vorkolumbischen Amerika, mit dem Zentrum Cusco in den Anden. Auf seinem Höhepunkt Anfang des 16. Jahrhunderts erstreckte es sich entlang der Pazifikkueste Suedamerikas, bevor es in den 1530er-Jahren von Spanien erobert wurde.",
    language: "Quechua",
  },
  "Indus valley civilization": {
    title: "Indus-Kultur",
    extract:
      "Die Indus-Kultur (ca. 3300–1300 v. Chr.) im Flusstal des Indus (heutiges Pakistan/Nordwestindien) war eine der fruehesten Stadtkulturen der Welt, bekannt fuer die fortschrittliche Stadtplanung von Fundorten wie Mohenjo-Daro und Harappa. Ihre Schrift ist bis heute nicht entziffert.",
    language: "unbekannt (Indus-Schrift nicht entziffert)",
  },
  Jin: {
    title: "Jin-Dynastie(n)",
    extract: JIN_EXTRACT,
    language: "Chinesisch",
  },
  "Kara Khitai Khaganate": {
    title: "Kara Khitai (Westliches Liao)",
    extract:
      "Die Kara Khitai (auch Westliches Liao) wurden von Fluechtlingen der untergegangenen chinesischen Liao-Dynastie gegruendet und beherrschten von 1124 bis 1218 weite Teile Zentralasiens, bevor sie im Mongolenreich aufgingen.",
    language: "Khitanisch, Chinesisch, Persisch (Verwaltung)",
  },
  Kerma: {
    title: "Kerma-Kultur",
    extract:
      "Kerma war das Zentrum einer fruehen nubischen Zivilisation im heutigen Sudan und eines der aeltesten staedtischen Zentren Afrikas. Sie bluehte von etwa 2500 bis 1500 v. Chr., bevor sie vom pharaonischen Ägypten unterworfen wurde.",
    language: "unbekannt (vor-meroitisches Nubisch)",
  },
  "Khanate of the Golden Horde": {
    title: "Goldene Horde",
    extract:
      "Die Goldene Horde war ein von Batu Khan in den 1240er-Jahren gegruendetes mongolisches Khanat, das ueber zwei Jahrhunderte weite Teile Russlands, der Ukraine und des Kaukasus beherrschte und die russische Geschichte massgeblich praegte (\"mongolisches Joch\").",
    language: "Kiptschakisch (Turksprache), Mongolisch",
  },
  Khazars: {
    title: "Chasaren",
    extract:
      "Die Chasaren waren ein teilnomadisches Turkvolk, dessen Khaganat vom 7. bis 10. Jahrhundert eine bedeutende Macht auf der Steppe zwischen Schwarzem und Kaspischem Meer war — bekannt auch dafuer, dass die Herrschaftselite zum Judentum konvertierte.",
    language: "Chasarisch (Turksprache)",
  },
  "Kievan Rus": {
    title: "Kiewer Rus",
    extract:
      "Die Kiewer Rus (9.–13. Jahrhundert) war ein mittelalterliches ostslawisches Reich mit dem Zentrum Kiew und gilt als gemeinsamer Ursprungsstaat Russlands, der Ukraine und Weissrusslands. Sie zerfiel nach den Mongoleneinfaellen im 13. Jahrhundert.",
    language: "Altostslawisch",
  },
  "Kimek-Kipchak khaganate": {
    title: "Kimek-Khaganat",
    extract:
      "Das Kimek-Khaganat war ein turkischer Stammesbund, der vom 9. bis 11. Jahrhundert die Steppen West-Sibiriens und Nordkasachstans beherrschte, bevor die von den Kiptschaken/Kumanen dominierte Nachfolgestruktur entstand.",
    language: "Turksprachen",
  },
  "Kushan Empire": {
    title: "Kuschana-Reich",
    extract:
      "Das Kuschana-Reich wurde von den Yuezhi in Zentralasien und Nordindien gegruendet (1.–3. Jh. n. Chr.) und war ein zentraler Knotenpunkt der Seidenstrasse, der Rom, Persien, Indien und China miteinander verband.",
    language: "Baktrisch",
  },
  "Mamluke Sultanate": {
    title: "Mamluken-Sultanat",
    extract:
      "Das Mamluken-Sultanat wurde von ehemaligen Sklavensoldaten (Mamluken) regiert, hatte seine Hauptstadt in Kairo (1250–1517), besiegte sowohl die Mongolen als auch die Kreuzfahrer und beherrschte Ägypten, die Levante und den Hedschas, bis es von den Osmanen erobert wurde.",
    language: "Arabisch",
  },
  "Manchu Empire": {
    title: "Qing-Dynastie (Mandschu-Reich)",
    extract:
      "Als \"Mandschu-Reich\" wird die Qing-Dynastie (1644–1912) bezeichnet, die von den Mandschu gegruendet wurde und die letzte Kaiserdynastie Chinas war.",
    language: "Mandschurisch, Chinesisch",
  },
  Maratha: {
    title: "Marathen-Konföderation",
    extract:
      "Die Marathen-Konföderation, im 17. Jahrhundert von Shivaji gegruendet, war ein Bund Hindu-Herrscher, der bis ins 18. Jahrhundert weite Teile des indischen Subkontinents kontrollierte, bevor er von der Britischen Ostindien-Kompanie besiegt wurde.",
    language: "Marathi",
  },
  "Maratha Confederacy": {
    title: "Marathen-Konföderation",
    extract:
      "Die Marathen-Konföderation, im 17. Jahrhundert von Shivaji gegruendet, war ein Bund Hindu-Herrscher, der bis ins 18. Jahrhundert weite Teile des indischen Subkontinents kontrollierte, bevor er von der Britischen Ostindien-Kompanie besiegt wurde.",
    language: "Marathi",
  },
  "Mauryan Empire": {
    title: "Maurya-Reich",
    extract:
      "Das Maurya-Reich (322–185 v. Chr.), gegruendet von Chandragupta Maurya, umfasste unter Ashoka fast den gesamten indischen Subkontinent und ist besonders fuer Ashokas Verbreitung des Buddhismus bekannt.",
    language: "Sanskrit, Prakrit",
  },
  "Ming Chinese Empire": {
    title: "Ming-Dynastie",
    extract:
      "Die Ming-Dynastie (1368–1644) folgte auf die mongolische Yuan-Dynastie und ist bekannt fuer die Verbotene Stadt in Peking sowie die grossen Flottenexpeditionen des Admirals Zheng He.",
    language: "Mittelchinesisch",
  },
  "Ming Empire": {
    title: "Ming-Dynastie",
    extract:
      "Die Ming-Dynastie (1368–1644) folgte auf die mongolische Yuan-Dynastie und ist bekannt fuer die Verbotene Stadt in Peking sowie die grossen Flottenexpeditionen des Admirals Zheng He.",
    language: "Mittelchinesisch",
  },
  "Mughal Empire": {
    title: "Mogulreich",
    extract:
      "Das Mogulreich beherrschte vom 16. bis ins 18./19. Jahrhundert weite Teile des indischen Subkontinents. Gegruendet von Babur, verband es persisch-islamische mit indischen Traditionen — bekanntestes Bauwerk ist das Taj Mahal.",
    language: "Persisch (Hofsprache), Tschagataisch, später Urdu",
  },
  "Norte Chico": {
    title: "Norte-Chico-Kultur",
    extract:
      "Die Norte-Chico-Kultur an der Nordkueste Perus gilt als eine der aeltesten bekannten Zivilisationen Amerikas (ca. 3500–1800 v. Chr.) — sie entstand bemerkenswerterweise noch vor der Einfuehrung von Keramik in der Region.",
    language: "unbekannt",
  },
  Oghuz: {
    title: "Oghusen",
    extract:
      "Die Oghusen waren ein westtürkischer Stammesbund Zentralasiens, aus dem unter anderem die Seldschuken und die Osmanen sowie die heutigen Turkvölker Anatoliens, Aserbaidschans und Turkmenistans hervorgingen — vom 8. bis 11. Jahrhundert von grosser Bedeutung.",
    language: "Oghusisch (Turksprache)",
  },
  "Oghuz Turks": {
    title: "Oghusen",
    extract:
      "Die Oghusen waren ein westtürkischer Stammesbund Zentralasiens, aus dem unter anderem die Seldschuken und die Osmanen sowie die heutigen Turkvölker Anatoliens, Aserbaidschans und Turkmenistans hervorgingen — vom 8. bis 11. Jahrhundert von grosser Bedeutung.",
    language: "Oghusisch (Turksprache)",
  },
  "Parthian Empire": {
    title: "Partherreich",
    extract:
      "Das Partherreich (247 v. Chr. – 224 n. Chr.) war eine bedeutende iranische Macht und langjaehriger Rivale Roms, das Persien und Mesopotamien beherrschte, bevor es vom Sassanidenreich abgelöst wurde.",
    language: "Parthisch",
  },
  "Qing Empire": {
    title: "Qing-Dynastie",
    extract:
      "Die Qing-Dynastie (1644–1912), gegruendet von den Mandschu, war die letzte Kaiserdynastie Chinas.",
    language: "Mandschurisch, Chinesisch",
  },
  Ruanruan: {
    title: "Rouran-Khaganat",
    extract:
      "Das Rouran-Khaganat (auch Ruanruan) war ein Nomadenreich, das vom spaeten 4. bis Mitte des 6. Jahrhunderts die Mongolei und die östliche Steppe beherrschte, bis es von den Göktürken gestuerzt wurde.",
    language: "unklar, vermutlich mongolisch/para-mongolisch",
  },
  "Safavid Empire": {
    title: "Safawidenreich",
    extract:
      "Das Safawidenreich (1501–1736) machte den schiitischen Islam zur Staatsreligion Persiens und war eine bedeutende Rivalin des Osmanischen Reichs.",
    language: "Persisch, Aserbaidschanisch-Türkisch (Hof)",
  },
  "Sasanian Empire": {
    title: "Sassanidenreich",
    extract:
      "Das Sassanidenreich (224–651 n. Chr.) war das letzte vorislamische persische Grossreich und ein bedeutender Rivale Roms bzw. Byzanz'. Es endete mit der arabisch-muslimischen Eroberung.",
    language: "Mittelpersisch",
  },
  "Sasanian dependencies": {
    title: "Sassanidische Nebenstaaten",
    extract:
      "Neben dem sassanidischen Kernreich standen mehrere abhaengige Fuerstentuemer und Vasallenstaaten unter dessen Oberhoheit — Teil des sassanidischen Herrschaftssystems (224–651 n. Chr.).",
    language: "Mittelpersisch",
  },
  Scythians: {
    title: "Skythen",
    extract:
      "Die Skythen waren iranischsprachige Reiternomaden, die vom 9. Jahrhundert v. Chr. bis ins 4. Jahrhundert n. Chr. die Steppe zwischen Schwarzem und Kaspischem Meer dominierten, beruehmt fuer ihre Reitkunst und kunstvolle Goldschmiedekunst.",
    language: "Skythisch (iranische Sprache)",
  },
  "Seleucid Kingdom": {
    title: "Seleukidenreich",
    extract:
      "Das Seleukidenreich (312–63 v. Chr.) war eines der hellenistischen Nachfolgereiche Alexanders des Grossen, gegruendet von Seleukos I., und erstreckte sich auf seinem Höhepunkt von Anatolien bis Indien, bevor es schrittweise von Rom und den Parthern zurueckgedraengt wurde.",
    language: "Griechisch (Amtssprache), Aramäisch",
  },
  "Southern Xiongnu": {
    title: "Südliche Xiongnu",
    extract:
      "Die suedlichen Xiongnu spalteten sich im 1. Jahrhundert n. Chr. von der Xiongnu-Konföderation ab und liessen sich als Vasallen innerhalb der Grenzen des Han-Reichs nieder — spaeter trugen sie zur Gruendung mehrerer nordchinesischer Dynastien bei.",
    language: "Xiongnu (nicht sicher klassifiziert)",
  },
  "Sui Empire": {
    title: "Sui-Dynastie",
    extract:
      "Die kurzlebige, aber einflussreiche Sui-Dynastie (581–618 n. Chr.) einte China nach Jahrhunderten der Zersplitterung wieder und liess den Kaiserkanal errichten.",
    language: "Mittelchinesisch",
  },
  "Sultanate of Delhi": {
    title: "Sultanat von Delhi",
    extract:
      "Das Sultanat von Delhi bezeichnet eine Reihe muslimischer Dynastien, die von 1206 bis 1526 von Delhi aus grosse Teile des indischen Subkontinents beherrschten, bevor sie vom Mogulreich abgelöst wurden.",
    language: "Persisch (Hof), Hindavi",
  },
  "Tang Empire": {
    title: "Tang-Dynastie",
    extract:
      "Die Tang-Dynastie (618–907 n. Chr.) gilt als einer der Höhepunkte der chinesischen Zivilisation; ihre Hauptstadt Chang'an zaehlte zu den groessten Staedten der damaligen Welt.",
    language: "Mittelchinesisch",
  },
  "Tibetan Empire": {
    title: "Tibetisches Reich",
    extract:
      "Das Tibetische Reich (7.–9. Jahrhundert) hatte sein Zentrum auf dem Tibetischen Hochland und war zeitweise eine bedeutende zentralasiatische Macht, die mit dem Tang-China rivalisierte, bevor es nach 842 zerfiel.",
    language: "Alttibetisch",
  },
  "Timurid Emirates": {
    title: "Timuridenreich",
    extract:
      "Das Timuridenreich wurde 1370 vom Eroberer Timur (Tamerlan) gegruendet und beherrschte Zentralasien, Persien sowie Teile Indiens und Anatoliens. In seiner spaeteren Phase wurde es unter Herrschern wie Ulugh Beg zu einem Zentrum islamischer Kunst und Wissenschaft (\"timuridische Renaissance\").",
    language: "Persisch (Kultur/Verwaltung), Tschagataisch",
  },
  "Timurid Empire": {
    title: "Timuridenreich",
    extract:
      "Das Timuridenreich wurde 1370 vom Eroberer Timur (Tamerlan) gegruendet und beherrschte Zentralasien, Persien sowie Teile Indiens und Anatoliens. In seiner spaeteren Phase wurde es unter Herrschern wie Ulugh Beg zu einem Zentrum islamischer Kunst und Wissenschaft (\"timuridische Renaissance\").",
    language: "Persisch (Kultur/Verwaltung), Tschagataisch",
  },
  "Tsardom of Muscovy": {
    title: "Zarentum Russland",
    extract:
      "Das Zarentum Russland (1547–1721), auch Moskauer Reich genannt, begann mit der Krönung Iwans des Schrecklichen zum ersten Zaren und war der Vorlaeufer des Russischen Kaiserreichs.",
    language: "Russisch",
  },
  Ubaid: {
    title: "Ubaid-Kultur",
    extract:
      "Die Ubaid-Kultur (ca. 6500–3800 v. Chr.) war eine praehistorische Kultur Mesopotamiens vor den Sumerern und markiert den Übergang zu den ersten staedtischen Siedlungen der Region.",
    language: "unbekannt (vor-sumerisch)",
  },
  "Umayyad Caliphate": {
    title: "Umayyaden-Kalifat",
    extract:
      "Das Umayyaden-Kalifat (661–750 n. Chr.) war das erste erbliche islamische Kalifat mit Hauptstadt Damaskus und dehnte die muslimische Herrschaft von Spanien bis nach Zentralasien aus — das damals groesste Reich der Weltgeschichte.",
    language: "Arabisch",
  },
  Ur: {
    title: "Ur",
    extract:
      "Ur war eine antike sumerische Stadt in Mesopotamien, die vor allem waehrend der 3. Dynastie von Ur (ca. 2112–2004 v. Chr.) grosse Macht besass — eine der fruehesten Stadtkulturen der Menschheit, in der Überlieferung auch als Heimat Abrahams genannt.",
    language: "Sumerisch",
  },
  Uyghurs: {
    title: "Uiguren",
    extract:
      "Die Uiguren, ein Turkvolk, gruendeten das Uigurische Khaganat (744–840 n. Chr.) auf der mongolischen Steppe und siedelten nach dessen Zusammenbruch verstaerkt im Tarimbecken (heutiges Xinjiang).",
    language: "Alt-Uigurisch (Turksprache)",
  },
  Valdivia: {
    title: "Valdivia-Kultur",
    extract:
      "Die Valdivia-Kultur an der Kueste Ecuadors (ca. 3500–1800 v. Chr.) gehört zu den aeltesten bekannten sesshaften Kulturen Amerikas und ist fuer ihre fruehe Keramikherstellung bekannt.",
    language: "unbekannt",
  },
  "Western Gokturk Khaganate": {
    title: "Westliches Göktürken-Khaganat",
    extract:
      "Nach der Teilung des Göktürken-Khaganats im 6. Jahrhundert kontrollierte dessen westlicher Teil die zentralasiatischen Steppen und den Handel entlang der Seidenstrasse, bis er im 7./8. Jahrhundert von Tang-China und den Türgesch aufgesogen wurde.",
    language: "Alttürkisch",
  },
  "Western Roman Empire": {
    title: "Weströmisches Reich",
    extract:
      "Das Weströmische Reich entstand aus der Verwaltungsteilung des Römischen Reichs im 4. Jahrhundert und endete 476 n. Chr. mit der Absetzung des letzten weströmischen Kaisers.",
    language: "Latein",
  },
  Xiongnu: {
    title: "Xiongnu",
    extract:
      "Die Xiongnu waren ein Nomadenbund, der vom 3. Jahrhundert v. Chr. bis ins 1. Jahrhundert n. Chr. die östliche eurasische Steppe beherrschte und ein bedeutender Rivale des kaiserlichen China war.",
    language: "Xiongnu (nicht sicher klassifiziert)",
  },
  Yuezhi: {
    title: "Yuezhi",
    extract:
      "Die Yuezhi waren ein indoeuropaeisch-sprachiges Nomadenvolk aus dem heutigen Westchina. Von den Xiongnu nach Westen vertrieben, gruendete einer ihrer Zweige — die Kuschan — spaeter das Kuschana-Reich in Zentralasien und Nordindien.",
    language: "vermutlich Tocharisch (indoeuropäisch)",
  },
  "Zhou states": {
    title: "Staaten der Zhou-Zeit",
    extract:
      "Die \"Zhou-Staaten\" bezeichnen die zahlreichen rivalisierenden Fuerstentuemer Chinas waehrend der Zhou-Dynastie (1046–256 v. Chr.), insbesondere in der zersplitterten Fruehlings-und-Herbst- sowie Streitenden-Reiche-Periode, vor der Einigung durch Qin.",
    language: "Altchinesisch",
  },
  "Tuʻi Tonga Empire": {
    title: "Tuʻi-Tonga-Reich",
    extract:
      "Das Tuʻi-Tonga-Reich war ein polynesisches Seereich mit Zentrum auf Tonga, das auf seinem Höhepunkt (13.–15. Jahrhundert) Einfluss auf Teile des Pazifiks, darunter Samoa und Fidschi, ausuebte — eines der wenigen vorkolonialen \"Reiche\" im Pazifik.",
    language: "Tongaisch",
  },
};

export function getEmpireFallback(name: string): EmpireFallbackEntry | null {
  return FALLBACKS[name] ?? null;
}
