// Reich-Profile (Nutzerwunsch 17.10.2026): berühmte Persönlichkeiten, Stärke,
// gewonnene/verlorene Kriege und Sprachen für die bekanntesten Reiche.
// Texte: "de|en" (nur Deutsch und Englisch; andere Sprachen zeigen Englisch).
// Eigennamen ohne "|" gelten in allen Sprachen. Zahlen sind gerundete Schätzungen.
import type { Lang } from "@/contexts/LanguageContext";

export interface Profile {
  f: string[]; // berühmte Persönlichkeiten
  s: string; // Stärke
  w: string[]; // gewonnene Kriege/Schlachten
  l: string[]; // verlorene Kriege/Schlachten
  d?: string[]; // unentschieden / umstritten
  g: string[]; // Sprachen (ISO-Codes)
  gn?: string; // Hinweis zur Sprache
}

const P: Record<string, Profile> = {
  "roemisches-reich": {
    f: ["Augustus", "Trajan", "Hadrian", "Mark Aurel|Marcus Aurelius", "Konstantin der Große|Constantine the Great"],
    s: "Rund 30 Legionen (etwa 150.000 Legionäre) plus Hilfstruppen ähnlicher Größe; Straßen- und Festungsbau gaben einen dauerhaften Vorteil.|Around 30 legions (about 150,000 legionaries) plus auxiliaries of similar size; road and fort building gave a lasting edge.",
    w: ["Dakerkriege (101–106)|Dacian Wars (101–106)", "Eroberung Britanniens (ab 43)|Conquest of Britain (from AD 43)", "Erster Jüdischer Krieg (66–73)|First Jewish–Roman War (66–73)"],
    l: ["Schlacht im Teutoburger Wald (9)|Battle of the Teutoburg Forest (AD 9)", "Schlacht von Adrianopel (378)|Battle of Adrianople (378)"],
    g: ["la", "grc"],
  },
  "mongolisches-reich": {
    f: ["Dschingis Khan|Genghis Khan", "Ögedei Khan", "Möngke Khan", "Kublai Khan", "Subutai"],
    s: "Reiterheere von meist 20.000–100.000 Kriegern; schnelle Bogenschützen und ein Zehnersystem machten sie lange fast unschlagbar.|Mounted armies of usually 20,000–100,000 warriors; fast archers and a decimal unit system made them nearly unbeatable for generations.",
    w: ["Eroberung von Choresmien (1219–21)|Conquest of Khwarezm (1219–21)", "Einfall in die Rus (1237–40)|Invasion of the Rus (1237–40)", "Schlacht bei Muhi (1241)|Battle of Mohi (1241)", "Fall von Bagdad (1258)|Fall of Baghdad (1258)"],
    l: ["Schlacht bei Ain Dschalut (1260)|Battle of Ain Jalut (1260)", "Invasionen Japans (1274, 1281)|Invasions of Japan (1274, 1281)"],
    g: ["mn", "fa", "zh"],
  },
  "osmanisches-reich": {
    f: ["Osman I.|Osman I", "Mehmed II. (der Eroberer)|Mehmed II (the Conqueror)", "Selim I.|Selim I", "Süleyman der Prächtige|Suleiman the Magnificent", "Hayreddin Barbarossa"],
    s: "Stehendes Janitscharen-Heer, frühe Feuerwaffen und starke Artillerie; auf dem Höhepunkt Feldheere von rund 100.000 Mann.|Standing Janissary army with early firearms and strong artillery; field armies of about 100,000 at the peak.",
    w: ["Eroberung Konstantinopels (1453)|Conquest of Constantinople (1453)", "Schlacht bei Tschaldiran (1514)|Battle of Chaldiran (1514)", "Schlacht bei Mohács (1526)|Battle of Mohács (1526)"],
    l: ["Seeschlacht von Lepanto (1571)|Battle of Lepanto (1571)", "Belagerung Wiens (1683)|Siege of Vienna (1683)", "Erster Weltkrieg (1914–18)|First World War (1914–18)"],
    g: ["ota", "ar", "fa"],
  },
  "achaemenidenreich": {
    f: ["Kyros II. (der Große)|Cyrus the Great", "Kambyses II.|Cambyses II", "Dareios I.|Darius I", "Xerxes I.|Xerxes I", "Artaxerxes II.|Artaxerxes II"],
    s: "Vielvölkerheer mit der Elitetruppe der „Unsterblichen“ (10.000 Mann); die Königsstraße (über 2.500 km) hielt das Reich zusammen.|A multi-ethnic army with the elite 'Immortals' (10,000 men); the Royal Road (over 2,500 km) tied the empire together.",
    w: ["Eroberung Babylons (539 v. Chr.)|Conquest of Babylon (539 BC)", "Eroberung Ägyptens (525 v. Chr.)|Conquest of Egypt (525 BC)", "Niederschlagung des Ionischen Aufstands (494 v. Chr.)|Suppression of the Ionian Revolt (494 BC)"],
    l: ["Schlacht von Marathon (490 v. Chr.)|Battle of Marathon (490 BC)", "Seeschlacht bei Salamis (480 v. Chr.)|Battle of Salamis (480 BC)", "Schlacht von Gaugamela (331 v. Chr.)|Battle of Gaugamela (331 BC)"],
    g: ["peo", "arc", "elx"],
  },
  "makedonisches-reich": {
    f: ["Philipp II.|Philip II", "Alexander der Große|Alexander the Great", "Parmenion", "Ptolemaios I.|Ptolemy I", "Seleukos I.|Seleucus I"],
    s: "Sarissen-Phalanx plus schwere Reiterei (Hetairoi); Alexanders Heer zählte rund 40.000 Mann.|Sarissa phalanx plus heavy cavalry (Companions); Alexander's army numbered about 40,000.",
    w: ["Schlacht bei Chaironeia (338 v. Chr.)|Battle of Chaeronea (338 BC)", "Schlacht am Granikos (334 v. Chr.)|Battle of the Granicus (334 BC)", "Schlacht bei Issos (333 v. Chr.)|Battle of Issus (333 BC)", "Schlacht von Gaugamela (331 v. Chr.)|Battle of Gaugamela (331 BC)", "Schlacht am Hydaspes (326 v. Chr.)|Battle of the Hydaspes (326 BC)"],
    l: ["Diadochenkriege (ab 323 v. Chr.): das Reich zerfiel|Wars of the Diadochi (from 323 BC): the empire broke apart"],
    g: ["grc"],
  },
  "han-dynastie": {
    f: ["Liu Bang (Kaiser Gaozu)|Liu Bang (Emperor Gaozu)", "Kaiser Wu|Emperor Wu", "Wei Qing", "Huo Qubing", "Ban Chao"],
    s: "Wehrpflicht, Armbrusttruppen und große Reiterheere; unter Kaiser Wu zogen Heere von über 100.000 Mann gegen die Xiongnu.|Conscription, crossbow units and large cavalry armies; under Emperor Wu, armies of over 100,000 marched against the Xiongnu.",
    w: ["Han–Xiongnu-Krieg (133 v. Chr.–89 n. Chr.)|Han–Xiongnu War (133 BC–AD 89)", "Eroberung von Nanyue (111 v. Chr.)|Conquest of Nanyue (111 BC)", "Eroberung von Gojoseon (108 v. Chr.)|Conquest of Gojoseon (108 BC)"],
    l: ["Schlacht von Baideng (200 v. Chr.)|Battle of Baideng (200 BC)", "Aufstand der Gelben Turbane (184) schwächt den Staat|Yellow Turban Rebellion (184) weakens the state"],
    g: ["lzh"],
  },
  "tang-dynastie": {
    f: ["Kaiser Taizong|Emperor Taizong", "Li Jing", "Wu Zetian", "Kaiser Xuanzong|Emperor Xuanzong", "Guo Ziyi"],
    s: "Berufsheer und Milizen (Fubing), starke Reiterei; die Hauptstadt Chang'an mit rund einer Million Einwohnern gehörte zu den größten Städten der Welt.|Professional troops and militias (fubing), strong cavalry; the capital Chang'an, with about a million people, was among the largest cities in the world.",
    w: ["Sieg über die Östlichen Türken (630)|Defeat of the Eastern Turks (630)", "Eroberung von Goguryeo (668)|Conquest of Goguryeo (668)"],
    l: ["Schlacht am Talas (751)|Battle of Talas (751)", "An-Lushan-Aufstand (755–763)|An Lushan Rebellion (755–763)", "Tibeter besetzen Chang'an (763)|Tibetans occupy Chang'an (763)"],
    g: ["ltc"],
  },
  "yuan-dynastie": {
    f: ["Kublai Khan", "Bayan von Baarin|Bayan of the Baarin", "Temür Khan", "Toghon Temür"],
    s: "Mongolische Reiterheere, kombiniert mit chinesischer Infanterie und Flotten aus Hunderten Schiffen.|Mongol cavalry combined with Chinese infantry and fleets of hundreds of ships.",
    w: ["Eroberung der Südlichen Song (1279)|Conquest of the Southern Song (1279)"],
    l: ["Invasionen Japans (1274, 1281)|Invasions of Japan (1274, 1281)", "Schlacht am Bạch Đằng (1288)|Battle of Bạch Đằng (1288)", "Aufstand der Roten Turbane, Sturz 1368|Red Turban Rebellion, fall in 1368"],
    g: ["mn", "zh", "fa"],
  },
  "ming-dynastie": {
    f: ["Hongwu-Kaiser (Zhu Yuanzhang)|Hongwu Emperor (Zhu Yuanzhang)", "Yongle-Kaiser|Yongle Emperor", "Zheng He", "Qi Jiguang", "Wang Yangming"],
    s: "Großes stehendes Heer und Schießpulverwaffen; Zheng Hes Schatzflotten (1405–33) mit Hunderten Schiffen waren die größten ihrer Zeit.|Large standing army and gunpowder weapons; Zheng He's treasure fleets (1405–33), with hundreds of ships, were the largest of their time.",
    w: ["Vertreibung der Mongolen (1368)|Expulsion of the Mongols (1368)", "Imjin-Krieg: Verteidigung Koreas (1592–98)|Imjin War: defence of Korea (1592–98)"],
    l: ["Tumu-Krise (1449)|Tumu Crisis (1449)", "Schlacht von Sarhu (1619)|Battle of Sarhu (1619)", "Eroberung durch die Qing (1644)|Conquest by the Qing (1644)"],
    g: ["zh"],
  },
  "qing-dynastie": {
    f: ["Nurhaci", "Kangxi-Kaiser|Kangxi Emperor", "Qianlong-Kaiser|Qianlong Emperor", "Zeng Guofan", "Kaiserinwitwe Cixi|Empress Dowager Cixi"],
    s: "Banner-Armeen (Mandschu, Mongolen, Han) eroberten Zentralasien; im 19. Jahrhundert fiel das Heer technisch hinter die europäischen Mächte zurück.|Banner armies (Manchu, Mongol, Han) conquered Central Asia; in the 19th century the army fell technologically behind the European powers.",
    w: ["Niederschlagung der Drei Feudalfürsten (1673–81)|Defeat of the Three Feudatories (1673–81)", "Eroberung des Dsungarenreichs (1755–57)|Conquest of the Dzungar Khanate (1755–57)"],
    l: ["Erster Opiumkrieg (1839–42)|First Opium War (1839–42)", "Zweiter Opiumkrieg (1856–60)|Second Opium War (1856–60)", "Chinesisch-Japanischer Krieg (1894–95)|First Sino-Japanese War (1894–95)"],
    g: ["zh", "mnc", "mn", "bo"],
  },
  "britisches-weltreich": {
    f: ["Königin Victoria|Queen Victoria", "Admiral Nelson", "Herzog von Wellington|Duke of Wellington", "Robert Clive", "Winston Churchill"],
    s: "Die Royal Navy war über Jahrhunderte die stärkste Flotte der Welt; um 1920 reichte das Reich über rund ein Viertel der Landfläche und der Weltbevölkerung.|The Royal Navy was the strongest fleet in the world for centuries; around 1920 the empire covered roughly a quarter of the world's land and population.",
    w: ["Siebenjähriger Krieg (1756–63)|Seven Years' War (1756–63)", "Napoleonische Kriege (1803–15)|Napoleonic Wars (1803–15)", "Erster Weltkrieg (1914–18, mit Verbündeten)|First World War (1914–18, with allies)", "Zweiter Weltkrieg (1939–45, mit Verbündeten)|Second World War (1939–45, with allies)"],
    l: ["Amerikanischer Unabhängigkeitskrieg (1775–83)|American War of Independence (1775–83)", "Erster Afghanistankrieg (1839–42)|First Anglo-Afghan War (1839–42)", "Sueskrise (1956)|Suez Crisis (1956)"],
    g: ["en", "hi"],
  },
  "spanisches-kolonialreich": {
    f: ["Karl V.|Charles V", "Philipp II.|Philip II", "Hernán Cortés", "Francisco Pizarro", "Herzog von Alba|Duke of Alba"],
    s: "Gefürchtete Tercios-Infanterie; Silber aus Amerika finanzierte Heere in ganz Europa.|Feared tercio infantry; silver from the Americas financed armies across Europe.",
    w: ["Eroberung des Aztekenreichs (1519–21)|Conquest of the Aztec Empire (1519–21)", "Eroberung des Inkareichs (1532–33)|Conquest of the Inca Empire (1532–33)", "Schlacht bei Pavia (1525)|Battle of Pavia (1525)", "Seeschlacht von Lepanto (1571, mit Verbündeten)|Battle of Lepanto (1571, with allies)"],
    l: ["Untergang der Armada (1588)|Defeat of the Armada (1588)", "Achtzigjähriger Krieg: Niederlande unabhängig (1648)|Eighty Years' War: Dutch independence (1648)", "Unabhängigkeitskriege Lateinamerikas (1810–25)|Latin American wars of independence (1810–25)", "Spanisch-Amerikanischer Krieg (1898)|Spanish–American War (1898)"],
    g: ["es", "qu", "nah"],
  },
  "portugiesisches-kolonialreich": {
    f: ["Heinrich der Seefahrer|Henry the Navigator", "Vasco da Gama", "Pedro Álvares Cabral", "Afonso de Albuquerque", "Manuel I.|Manuel I"],
    s: "Überlegene Schiffe und Kanonen sicherten Stützpunkte von Brasilien bis Macau, dennoch blieb das Mutterland klein.|Superior ships and guns secured bases from Brazil to Macau, yet the home country stayed small.",
    w: ["Eroberung von Ceuta (1415)|Conquest of Ceuta (1415)", "Seeschlacht bei Diu (1509)|Battle of Diu (1509)", "Eroberung von Goa (1510) und Malakka (1511)|Conquest of Goa (1510) and Malacca (1511)"],
    l: ["Schlacht von Alcácer-Quibir (1578)|Battle of Alcácer Quibir (1578)", "Verlust vieler Stützpunkte an die Niederländer (17. Jh.)|Loss of many bases to the Dutch (17th century)", "Unabhängigkeit Brasiliens (1822)|Independence of Brazil (1822)"],
    g: ["pt"],
  },
  "russisches-kaiserreich": {
    f: ["Peter der Große|Peter the Great", "Katharina die Große|Catherine the Great", "Alexander I.|Alexander I", "Michail Kutusow|Mikhail Kutuzov", "Alexander Suworow|Alexander Suvorov"],
    s: "Eines der größten Heere Europas (im 19. Jahrhundert über eine Million Mann auf dem Papier), aber oft schlecht ausgerüstet.|One of Europe's largest armies (over a million men on paper in the 19th century), but often poorly equipped.",
    w: ["Großer Nordischer Krieg (1700–21)|Great Northern War (1700–21)", "Russisch-Türkische Kriege (18. Jh.)|Russo-Turkish Wars (18th century)", "Abwehr Napoleons (1812)|Defeat of Napoleon's invasion (1812)"],
    l: ["Krimkrieg (1853–56)|Crimean War (1853–56)", "Russisch-Japanischer Krieg (1904–05)|Russo-Japanese War (1904–05)", "Erster Weltkrieg und Revolution (1917)|First World War and revolution (1917)"],
    g: ["ru"],
  },
  "sowjetunion": {
    f: ["Lenin", "Josef Stalin|Joseph Stalin", "Georgi Schukow|Georgy Zhukov", "Nikita Chruschtschow|Nikita Khrushchev", "Juri Gagarin|Yuri Gagarin"],
    s: "Eine von zwei Supermächten: Millionenheer, Atomwaffen (ab 1949) und Weltraumprogramm.|One of two superpowers: an army of millions, nuclear weapons (from 1949) and a space programme.",
    w: ["Schlacht von Stalingrad (1942–43)|Battle of Stalingrad (1942–43)", "Schlacht um Berlin (1945)|Battle of Berlin (1945)"],
    l: ["Sowjetisch-Afghanischer Krieg (1979–89)|Soviet–Afghan War (1979–89)", "Kalter Krieg und Auflösung (1991)|Cold War and dissolution (1991)"],
    g: ["ru"],
  },
  "umayyaden-kalifat": {
    f: ["Muawiya I.|Muawiya I", "Abd al-Malik", "al-Walid I.|al-Walid I", "Tariq ibn Ziyad", "Umar II.|Umar II"],
    s: "Arabische Reiterheere und Flotten dehnten das Reich vom Atlantik bis zum Indus aus.|Arab cavalry armies and fleets stretched the empire from the Atlantic to the Indus.",
    w: ["Eroberung Hispaniens (711)|Conquest of Hispania (711)", "Eroberung von Sindh (711)|Conquest of Sindh (711)"],
    l: ["Belagerung Konstantinopels (717–18)|Siege of Constantinople (717–18)", "Schlacht von Tours und Poitiers (732)|Battle of Tours (732)", "Abbasidenrevolution (750)|Abbasid Revolution (750)"],
    g: ["ar", "el"],
  },
  "abbasiden-kalifat": {
    f: ["al-Mansur", "Harun ar-Raschid|Harun al-Rashid", "al-Mamun|al-Ma'mun", "al-Mutasim|al-Mu'tasim"],
    s: "Berufsarmee mit türkischen Militärsklaven (Mamluken); Bagdad war um 800 eine der größten Städte der Welt.|Professional army with Turkic slave soldiers (mamluks); Baghdad was among the largest cities in the world around 800.",
    w: ["Schlacht am Talas (751)|Battle of Talas (751)", "Eroberung von Amorion (838)|Capture of Amorium (838)", "Niederschlagung des Zandsch-Aufstands (869–883)|Suppression of the Zanj Rebellion (869–883)"],
    l: ["Verlust von Provinzen an Teildynastien (ab 9. Jh.)|Loss of provinces to breakaway dynasties (from the 9th century)", "Mongolensturm auf Bagdad (1258)|Mongol sack of Baghdad (1258)"],
    g: ["ar", "fa"],
  },
  "kalifat-der-raschidun": {
    f: ["Abu Bakr", "Umar ibn al-Chattab|Umar ibn al-Khattab", "Uthman", "Ali ibn Abi Talib", "Khalid ibn al-Walid"],
    s: "Schnelle Kamel- und Reiterverbände eroberten in nur rund 30 Jahren Persien, Syrien und Ägypten.|Fast camel and cavalry forces conquered Persia, Syria and Egypt in only about 30 years.",
    w: ["Schlacht am Jarmuk (636)|Battle of Yarmouk (636)", "Schlacht von al-Qadisiyya (636)|Battle of al-Qadisiyyah (636)", "Eroberung Ägyptens (639–642)|Conquest of Egypt (639–642)", "Schlacht von Nehawend (642)|Battle of Nahavand (642)"],
    l: [],
    d: ["Erster Bürgerkrieg (656–661): Ende des Kalifats der Rechtgeleiteten|First Fitna civil war (656–661): end of the Rashidun caliphate"],
    g: ["ar"],
  },
  "mogulreich": {
    f: ["Babur", "Humayun", "Akbar", "Shah Jahan", "Aurangzeb"],
    s: "Pulverwaffen, Artillerie und Kriegselefanten; Schätzungen für Akbars Streitkräfte reichen bis zu mehreren Hunderttausend Mann.|Gunpowder weapons, artillery and war elephants; estimates for Akbar's forces run to several hundred thousand men.",
    w: ["Erste Schlacht bei Panipat (1526)|First Battle of Panipat (1526)", "Schlacht bei Khanwa (1527)|Battle of Khanwa (1527)", "Zweite Schlacht bei Panipat (1556)|Second Battle of Panipat (1556)"],
    l: ["Schlacht bei Chausa (1539, Humayun)|Battle of Chausa (1539, Humayun)", "Plünderung Delhis durch Nadir Schah (1739)|Sack of Delhi by Nader Shah (1739)", "Schlacht bei Buxar (1764)|Battle of Buxar (1764)"],
    g: ["fa", "ur", "chg"],
  },
  "sassanidenreich": {
    f: ["Ardaschir I.|Ardashir I", "Schapur I.|Shapur I", "Schapur II.|Shapur II", "Chosrau I.|Khosrow I", "Chosrau II.|Khosrow II"],
    s: "Gepanzerte Kataphrakt-Reiter und Kriegselefanten; über vier Jahrhunderte der Erzrivale Roms und Byzanz'.|Armoured cataphract cavalry and war elephants; the arch-rival of Rome and Byzantium for four centuries.",
    w: ["Schlacht von Edessa (260): Kaiser Valerian gefangen|Battle of Edessa (260): Emperor Valerian captured", "Eroberung Jerusalems (614)|Conquest of Jerusalem (614)"],
    l: ["Schlacht von Ninive (627)|Battle of Nineveh (627)", "Schlacht von al-Qadisiyya (636)|Battle of al-Qadisiyyah (636)", "Schlacht von Nehawend (642)|Battle of Nahavand (642)"],
    g: ["pal", "arc"],
  },
  "partherreich": {
    f: ["Arsakes I.|Arsaces I", "Mithridates I.|Mithridates I", "Mithridates II.|Mithridates II", "Surena", "Orodes II.|Orodes II"],
    s: "Berittene Bogenschützen und schwere Kataphrakte; der „Parthische Schuss“ war berüchtigt.|Horse archers and heavy cataphracts; the 'Parthian shot' became famous.",
    w: ["Schlacht bei Karrhai (53 v. Chr.)|Battle of Carrhae (53 BC)", "Abwehr von Antonius' Feldzug (36 v. Chr.)|Repelling Mark Antony's campaign (36 BC)"],
    l: ["Trajans Feldzug: Ktesiphon erobert (116)|Trajan's campaign: Ctesiphon taken (116)", "Sturz durch die Sassaniden (224–226)|Overthrown by the Sasanians (224–226)"],
    g: ["xpr", "el", "arc"],
  },
  "maurya-reich": {
    f: ["Chandragupta Maurya", "Chanakya", "Bindusara", "Ashoka"],
    s: "Eines der größten Heere der Antike: antike Quellen nennen Hunderttausende Fußsoldaten und tausende Kriegselefanten.|One of the largest armies of antiquity: ancient sources report hundreds of thousands of infantry and thousands of war elephants.",
    w: ["Seleukidisch-Maurya-Krieg (305–303 v. Chr.)|Seleucid–Mauryan War (305–303 BC)", "Kalinga-Krieg (261 v. Chr.)|Kalinga War (261 BC)"],
    l: [],
    d: ["Zerfall nach Ashoka, Sturz durch Pushyamitra (um 185 v. Chr.)|Decline after Ashoka, overthrown by Pushyamitra (c. 185 BC)"],
    g: ["pra", "sa"],
  },
  "gupta-reich": {
    f: ["Chandragupta I.|Chandragupta I", "Samudragupta", "Chandragupta II.|Chandragupta II", "Kumaragupta I.|Kumaragupta I", "Skandagupta"],
    s: "Starke Reiterei und Elefanten; eine Blütezeit der Wissenschaft, Mathematik und Kunst.|Strong cavalry and elephants; a golden age of science, mathematics and art.",
    w: ["Feldzüge Samudraguptas (um 335–375)|Samudragupta's campaigns (c. 335–375)", "Sieg über die Westlichen Satrapen (um 400)|Defeat of the Western Satraps (c. 400)", "Skandagupta wehrt die Hunas ab (um 455)|Skandagupta repels the Hunas (c. 455)"],
    l: ["Einfälle der Hunas (späte 5.–6. Jh.)|Huna invasions (late 5th–6th century)"],
    g: ["sa", "pra"],
  },
  "kuschana-reich": {
    f: ["Kujula Kadphises", "Vima Kadphises", "Kanishka I.|Kanishka I", "Huvishka", "Vasudeva I.|Vasudeva I"],
    s: "Kontrollierte die Seidenstraße zwischen Rom, Persien, Indien und China; berittene Bogenschützen und schwere Reiter.|Controlled the Silk Road between Rome, Persia, India and China; horse archers and heavy cavalry.",
    w: ["Eroberung von Baktrien und Gandhara (1. Jh.)|Conquest of Bactria and Gandhara (1st century)", "Feldzüge ins Tarimbecken (2. Jh.)|Campaigns into the Tarim Basin (2nd century)"],
    l: ["Niederlage gegen Ban Chao (90)|Defeat by Ban Chao (90)", "Sassanidische Eroberung der Westgebiete (um 230–250)|Sasanian conquest of the western territories (c. 230–250)"],
    g: ["xbc", "sa"],
  },
  "byzantinisches-reich": {
    f: ["Justinian I.|Justinian I", "Belisar|Belisarius", "Herakleios|Heraclius", "Basileios II.|Basil II", "Alexios I. Komnenos|Alexios I Komnenos"],
    s: "Disziplinierte Berufsheere, Kataphrakten und das „Griechische Feuer“; Konstantinopels Mauern hielten Angreifer fast 1.000 Jahre ab.|Disciplined professional armies, cataphracts and 'Greek fire'; the walls of Constantinople held off attackers for almost 1,000 years.",
    w: ["Vandalenkrieg (533–534)|Vandalic War (533–534)", "Gotenkrieg (535–554)|Gothic War (535–554)", "Perserkrieg des Herakleios (622–628)|Heraclius' Persian War (622–628)", "Schlacht bei Kleidion (1014)|Battle of Kleidion (1014)"],
    l: ["Schlacht am Jarmuk (636)|Battle of Yarmouk (636)", "Schlacht von Manzikert (1071)|Battle of Manzikert (1071)", "Plünderung Konstantinopels (1204)|Sack of Constantinople (1204)", "Fall Konstantinopels (1453)|Fall of Constantinople (1453)"],
    g: ["el", "la"],
  },
  "inkareich": {
    f: ["Pachacútec", "Túpac Yupanqui", "Huayna Cápac|Huayna Capac", "Atahualpa", "Túpac Amaru"],
    s: "Straßennetz von rund 40.000 km und effiziente Verwaltung; Heere ohne Eisen und ohne Pferde.|A road network of about 40,000 km and efficient administration; armies without iron or horses.",
    w: ["Sieg über die Chanka (um 1438)|Victory over the Chanka (c. 1438)", "Eroberung des Chimú-Reichs (um 1470)|Conquest of the Chimú kingdom (c. 1470)"],
    l: ["Inka-Bürgerkrieg (1529–32)|Inca civil war (1529–32)", "Spanische Eroberung (1532–33)|Spanish conquest (1532–33)"],
    g: ["qu", "ay"],
  },
  "karolingerreich": {
    f: ["Karl Martell|Charles Martel", "Pippin der Jüngere|Pepin the Short", "Karl der Große|Charlemagne", "Ludwig der Fromme|Louis the Pious", "Karl der Kahle|Charles the Bald"],
    s: "Gepanzerte Reiterei und Lehnswesen; Karl der Große führte fast jedes Jahr Feldzüge.|Armoured cavalry and the feudal system; Charlemagne campaigned almost every year.",
    w: ["Schlacht bei Tours und Poitiers (732)|Battle of Tours (732)", "Eroberung des Langobardenreichs (774)|Conquest of the Lombard kingdom (774)", "Sachsenkriege (772–804)|Saxon Wars (772–804)"],
    l: ["Schlacht von Roncesvalles (778)|Battle of Roncevaux Pass (778)", "Wikingerüberfälle (ab 793)|Viking raids (from 793)", "Vertrag von Verdun: Teilung (843)|Treaty of Verdun: partition (843)"],
    g: ["la", "goh"],
  },
  "heiliges-roemisches-reich": {
    f: ["Otto I. der Große|Otto the Great", "Friedrich I. Barbarossa|Frederick I Barbarossa", "Friedrich II.|Frederick II", "Karl V.|Charles V", "Maximilian I.|Maximilian I"],
    s: "Kein Einheitsheer: Fürsten stellten Truppen, die Macht hing von Bündnissen ab; im 16. Jahrhundert Söldnerheere (Landsknechte).|No single army: princes supplied troops and power depended on alliances; mercenary armies (Landsknechte) in the 16th century.",
    w: ["Schlacht auf dem Lechfeld (955)|Battle of the Lechfeld (955)", "Schlacht bei Mühlberg (1547)|Battle of Mühlberg (1547)"],
    l: ["Schlacht von Legnano (1176)|Battle of Legnano (1176)", "Schlacht bei Bouvines (1214)|Battle of Bouvines (1214)", "Dreißigjähriger Krieg: Macht des Kaisers schwindet (1648)|Thirty Years' War: imperial power declines (1648)", "Auflösung nach Austerlitz (1806)|Dissolved after Austerlitz (1806)"],
    g: ["de", "la", "cs"],
  },
  "mali-reich": {
    f: ["Sundiata Keita", "Mansa Musa", "Mansa Sulayman"],
    s: "Reichtum aus Gold- und Salzhandel; Mansa Musa gilt als einer der reichsten Menschen der Geschichte.|Wealth from the gold and salt trade; Mansa Musa is often named one of the richest people in history.",
    w: ["Schlacht von Kirina (um 1235)|Battle of Kirina (c. 1235)"],
    l: ["Verlust Timbuktus an die Tuareg (1433)|Loss of Timbuktu to the Tuareg (1433)", "Niedergang gegen das Songhai-Reich (15.–16. Jh.)|Decline against the Songhai Empire (15th–16th century)"],
    g: ["mnk", "ar"],
  },
  "songhai-reich": {
    f: ["Sonni Ali", "Askia Mohammed I.|Askia Muhammad I", "Askia Daoud"],
    s: "Flussflotte auf dem Niger und Reiterheer; Timbuktu war Zentrum von Handel und Gelehrsamkeit.|River fleet on the Niger and cavalry; Timbuktu was a centre of trade and scholarship.",
    w: ["Einnahme von Timbuktu (1468)|Capture of Timbuktu (1468)", "Einnahme von Djenné (1473)|Capture of Djenné (1473)"],
    l: ["Schlacht von Tondibi gegen Marokko (1591)|Battle of Tondibi against Morocco (1591)"],
    g: ["son", "ar"],
  },
  "kaiserreich-abessinien": {
    f: ["Zara Yaqob", "Tewodros II.|Tewodros II", "Menelik II.|Menelik II", "Haile Selassie"],
    s: "Eines von nur zwei afrikanischen Ländern, die nie dauerhaft kolonisiert wurden; Menelik II. besiegte 1896 ein europäisches Heer.|One of only two African countries never permanently colonised; Menelik II defeated a European army in 1896.",
    w: ["Schlacht von Gundet (1875)|Battle of Gundet (1875)", "Schlacht von Adwa (1896)|Battle of Adwa (1896)"],
    l: ["Schlacht von Magdala (1868)|Battle of Magdala (1868)", "Italienische Besetzung (1936)|Italian occupation (1936)"],
    g: ["am", "gez", "om", "ti"],
  },
  "khmer-reich": {
    f: ["Jayavarman II.|Jayavarman II", "Suryavarman II.|Suryavarman II", "Jayavarman VII.|Jayavarman VII"],
    s: "Kriegselefanten und Flussflotten; Erbauer von Angkor Wat, dem größten religiösen Bauwerk der Welt.|War elephants and river fleets; builders of Angkor Wat, the largest religious monument in the world.",
    w: ["Rückeroberung Angkors und Sieg über die Cham (1177–81)|Recapture of Angkor and defeat of the Cham (1177–81)", "Eroberung von Champa (1190er)|Conquest of Champa (1190s)"],
    l: ["Plünderung Angkors durch die Cham (1177)|Sack of Angkor by the Cham (1177)", "Plünderung Angkors durch Ayutthaya (1431)|Sack of Angkor by Ayutthaya (1431)"],
    g: ["km", "sa"],
  },
  "neuassyrisches-reich": {
    f: ["Tiglat-Pileser III.|Tiglath-Pileser III", "Sargon II.|Sargon II", "Sanherib|Sennacherib", "Asarhaddon|Esarhaddon", "Assurbanipal|Ashurbanipal"],
    s: "Eisenwaffen, ausgefeilte Belagerungstechnik und ein stehendes Heer; berüchtigt für Härte.|Iron weapons, advanced siege engineering and a standing army; infamous for harshness.",
    w: ["Eroberung Israels (722 v. Chr.)|Conquest of Israel (722 BC)", "Belagerung von Lachisch (701 v. Chr.)|Siege of Lachish (701 BC)", "Eroberung Ägyptens (671 v. Chr.)|Conquest of Egypt (671 BC)"],
    l: ["Belagerung Jerusalems scheitert (701 v. Chr.)|Siege of Jerusalem fails (701 BC)", "Fall Ninives (612 v. Chr.)|Fall of Nineveh (612 BC)"],
    g: ["akk", "arc"],
  },
  "neubabylonisches-reich": {
    f: ["Nabopolassar", "Nebukadnezar II.|Nebuchadnezzar II", "Nabonid|Nabonidus"],
    s: "Kurzlebig, aber glanzvoll: Babylon mit dem Ischtar-Tor und (der Überlieferung nach) den Hängenden Gärten.|Short-lived but brilliant: Babylon with the Ishtar Gate and (reportedly) the Hanging Gardens.",
    w: ["Schlacht von Karkemisch (605 v. Chr.)|Battle of Carchemish (605 BC)", "Eroberung Jerusalems (597/587 v. Chr.)|Capture of Jerusalem (597/587 BC)"],
    l: ["Fall Babylons an Kyros (539 v. Chr.)|Fall of Babylon to Cyrus (539 BC)"],
    g: ["akk", "arc"],
  },
  "karthago": {
    f: ["Hamilkar Barkas|Hamilcar Barca", "Hannibal", "Hasdrubal", "Hanno der Seefahrer|Hanno the Navigator"],
    s: "Führende Seemacht des westlichen Mittelmeers mit Söldnerheeren und Kriegselefanten.|The leading naval power of the western Mediterranean, with mercenary armies and war elephants.",
    w: ["Schlacht bei Cannae (216 v. Chr.)|Battle of Cannae (216 BC)", "Schlacht am Trasimenischen See (217 v. Chr.)|Battle of Lake Trasimene (217 BC)"],
    l: ["Erster Punischer Krieg (264–241 v. Chr.)|First Punic War (264–241 BC)", "Schlacht bei Zama (202 v. Chr.)|Battle of Zama (202 BC)", "Zerstörung Karthagos (146 v. Chr.)|Destruction of Carthage (146 BC)"],
    g: ["xpu", "phn"],
  },
  "hethiterreich": {
    f: ["Suppiluliuma I.|Suppiluliuma I", "Mursili II.|Mursili II", "Muwatalli II.|Muwatalli II", "Hattusili III.|Hattusili III"],
    s: "Frühe Streitwagen-Großmacht, möglicherweise unter den Ersten mit Eisenverarbeitung (umstritten).|An early chariot-warfare great power, possibly among the first to work iron (debated).",
    w: ["Eroberung von Mitanni (um 1340 v. Chr.)|Conquest of Mitanni (c. 1340 BC)"],
    l: ["Zusammenbruch der Bronzezeit (um 1180 v. Chr.)|Bronze Age collapse (c. 1180 BC)"],
    d: ["Schlacht bei Kadesch (um 1274 v. Chr.)|Battle of Kadesh (c. 1274 BC)"],
    g: ["hit", "xlu"],
  },
  "neues-reich-aegypten": {
    f: ["Hatschepsut|Hatshepsut", "Thutmosis III.|Thutmose III", "Echnaton|Akhenaten", "Tutanchamun|Tutankhamun", "Ramses II.|Ramesses II"],
    s: "Streitwagen und Bogenschützen; unter Thutmosis III. und Ramses II. die stärkste Macht Vorderasiens.|Chariots and archers; under Thutmose III and Ramesses II the strongest power in the Near East.",
    w: ["Schlacht von Megiddo (um 1457 v. Chr.)|Battle of Megiddo (c. 1457 BC)", "Abwehr der Seevölker (um 1177 v. Chr.)|Repelling the Sea Peoples (c. 1177 BC)"],
    l: [],
    d: ["Schlacht bei Kadesch (um 1274 v. Chr.)|Battle of Kadesh (c. 1274 BC)"],
    g: ["egy"],
  },
  "deutsches-kaiserreich": {
    f: ["Wilhelm I.|Wilhelm I", "Otto von Bismarck", "Wilhelm II.|Wilhelm II", "Paul von Hindenburg", "Erich Ludendorff"],
    s: "Modernes Massenheer mit Wehrpflicht und eine der stärksten Industrien Europas; 1914 wurden fast 4 Millionen Soldaten mobilisiert.|A modern conscript army and one of Europe's strongest industries; nearly 4 million soldiers were mobilised in 1914.",
    w: ["Deutsch-Französischer Krieg (1870–71)|Franco-Prussian War (1870–71)", "Schlacht bei Tannenberg (1914)|Battle of Tannenberg (1914)"],
    l: ["Erster Weltkrieg (1914–18)|First World War (1914–18)", "Schlacht an der Marne (1914)|First Battle of the Marne (1914)"],
    g: ["de"],
  },
  "oesterreich-ungarn": {
    f: ["Franz Joseph I.|Franz Joseph I", "Franz Ferdinand", "Franz Conrad von Hötzendorf", "Karl I.|Charles I"],
    s: "Vielvölkerstaat mit rund 50 Millionen Einwohnern, aber Heer und Industrie schwächer als die der Nachbarn.|A multi-ethnic state of about 50 million people, but with an army and industry weaker than its neighbours'.",
    w: ["Durchbruch von Karfreit (1917, mit Deutschland)|Breakthrough at Caporetto (1917, with Germany)"],
    l: ["Erster Weltkrieg (1914–18)|First World War (1914–18)", "Schlacht von Lemberg (1914)|Battle of Lemberg (1914)"],
    g: ["de", "hu", "cs", "pl"],
  },
  "japanisches-kaiserreich": {
    f: ["Meiji-Kaiser|Emperor Meiji", "Tōgō Heihachirō", "Yamagata Aritomo", "Yamamoto Isoroku", "Hirohito"],
    s: "Binnen weniger Jahrzehnte vom Feudalstaat zur Großmacht mit moderner Flotte und Armee.|In a few decades from a feudal state to a great power with a modern navy and army.",
    w: ["Chinesisch-Japanischer Krieg (1894–95)|First Sino-Japanese War (1894–95)", "Russisch-Japanischer Krieg (1904–05)|Russo-Japanese War (1904–05)", "Seeschlacht von Tsushima (1905)|Battle of Tsushima (1905)"],
    l: ["Schlacht um Midway (1942)|Battle of Midway (1942)", "Zweiter Weltkrieg: Kapitulation (1945)|Second World War: surrender (1945)"],
    g: ["ja"],
  },
  "goektuerk-khaganat": {
    f: ["Bumin Qaghan", "Istämi Qaghan", "Muqan Qaghan", "Tonyukuk"],
    s: "Berittene Nomadenkrieger; der erste Staat, der sich „Türk“ nannte.|Mounted nomad warriors; the first state to call itself 'Türk'.",
    w: ["Sieg über die Rouran (552)|Defeat of the Rouran (552)", "Bündnis mit den Sassaniden gegen die Hephthaliten (um 560)|Alliance with the Sasanians against the Hephthalites (c. 560)"],
    l: ["Spaltung in Ost und West (581–603)|Split into East and West (581–603)", "Unterwerfung durch die Tang (630)|Conquest by the Tang (630)"],
    g: ["otk", "sog"],
  },
  "xiongnu": {
    f: ["Touman", "Modu Chanyu", "Laoshang Chanyu", "Huhanye", "Zhizhi"],
    s: "Reiternomaden-Konföderation mit berittenen Bogenschützen; zwang China jahrzehntelang zu Tributzahlungen.|A nomad cavalry confederation of mounted archers; forced China to pay tribute for decades.",
    w: ["Schlacht von Baideng (200 v. Chr.)|Battle of Baideng (200 BC)", "Unterwerfung der Donghu und Yuezhi (um 209–174 v. Chr.)|Subjugation of the Donghu and Yuezhi (c. 209–174 BC)"],
    l: ["Han–Xiongnu-Krieg (133 v. Chr.–89 n. Chr.)|Han–Xiongnu War (133 BC–AD 89)", "Schlacht bei Zhizhi (36 v. Chr.)|Battle of Zhizhi (36 BC)"],
    g: [],
    gn: "Sprache unsicher (türkisch, mongolisch oder jenisseisch diskutiert)|Language uncertain (Turkic, Mongolic or Yeniseian debated)",
  },
  "hunnenreich": {
    f: ["Rua", "Bleda", "Attila"],
    s: "Reiternomaden mit Kompositbögen; Attila erpresste Tribute vom Oströmischen Reich.|Mounted nomads with composite bows; Attila extracted tribute from the Eastern Roman Empire.",
    w: ["Feldzüge auf dem Balkan (441–447)|Balkan campaigns (441–447)", "Einfälle in Gallien und Italien (451–452)|Invasions of Gaul and Italy (451–452)"],
    l: ["Schlacht auf den Katalaunischen Feldern (451)|Battle of the Catalaunian Plains (451)", "Schlacht am Nedao (454)|Battle of Nedao (454)"],
    g: ["got", "la"],
    gn: "Hunnisch kaum belegt|Hunnic is barely attested",
  },
  "timuridenreich": {
    f: ["Timur (Tamerlan)|Timur (Tamerlane)", "Schah Ruch|Shah Rukh", "Ulugh Beg", "Husain Baiqara|Husayn Bayqara"],
    s: "Timurs Heere (bis zu rund 100.000 Mann) zogen von Delhi bis Anatolien; Samarkand wurde Prachtmetropole.|Timur's armies (up to about 100,000) marched from Delhi to Anatolia; Samarkand became a showpiece capital.",
    w: ["Plünderung Delhis (1398)|Sack of Delhi (1398)", "Schlacht bei Ankara (1402)|Battle of Ankara (1402)"],
    l: ["Zerfall nach Timurs Tod (1405)|Fragmentation after Timur's death (1405)", "Eroberung Herats durch die Schaibaniden (1507)|Capture of Herat by the Shaybanids (1507)"],
    g: ["chg", "fa"],
  },
  "safawidenreich": {
    f: ["Ismail I.|Ismail I", "Tahmasp I.|Tahmasp I", "Abbas der Große|Abbas the Great", "Safi I.|Safi I"],
    s: "Schiitische Qizilbasch-Reiter, unter Abbas später Musketiere und Artillerie nach europäischem Vorbild.|Shia Qizilbash cavalry, later musketeers and artillery on a European model under Abbas.",
    w: ["Schlacht von Schirwan (1500)|Battle of Shirvan (1500)", "Rückeroberung Bagdads (1623)|Recapture of Baghdad (1623)"],
    l: ["Schlacht bei Tschaldiran (1514)|Battle of Chaldiran (1514)", "Verlust Bagdads an die Osmanen (1638)|Loss of Baghdad to the Ottomans (1638)", "Schlacht von Gulnabad (1722)|Battle of Gulnabad (1722)"],
    g: ["fa", "az"],
  },
  "grossseldschukenreich": {
    f: ["Tughril Beg", "Alp Arslan", "Malik Schah I.|Malik-Shah I", "Nizam al-Mulk", "Sandschar|Sanjar"],
    s: "Turkmenische Reiterkrieger; unter Alp Arslan besiegten sie das Byzantinische Reich.|Turkmen cavalry warriors; under Alp Arslan they defeated the Byzantine Empire.",
    w: ["Schlacht von Dandanqan (1040)|Battle of Dandanaqan (1040)", "Schlacht von Manzikert (1071)|Battle of Manzikert (1071)"],
    l: ["Schlacht von Qatwan (1141)|Battle of Qatwan (1141)", "Zerfall in Teilreiche (12. Jh.)|Fragmentation into successor states (12th century)"],
    g: ["fa", "tr", "ar"],
  },
  "goldene-horde": {
    f: ["Batu Khan", "Berke", "Usbek Khan|Uzbeg Khan", "Toktamisch|Tokhtamysh", "Mamai"],
    s: "Mongolisch-türkische Reiterheere; die russischen Fürstentümer zahlten über 200 Jahre Tribut.|Mongol-Turkic cavalry armies; the Russian principalities paid tribute for over 200 years.",
    w: ["Einfall in die Rus (1237–40)|Invasion of the Rus (1237–40)", "Plünderung Moskaus (1382)|Sack of Moscow (1382)"],
    l: ["Schlacht auf dem Kulikowo Pole (1380)|Battle of Kulikovo (1380)", "Niederlage gegen Timur am Terek (1395)|Defeat by Timur at the Terek (1395)", "Das Stehen an der Ugra (1480)|The Great Stand on the Ugra (1480)"],
    g: ["kipchak"],
  },
  "ilchanat": {
    f: ["Hülegü|Hulagu", "Abaqa", "Ghazan", "Öljeitü"],
    s: "Mongolische Reiter mit persischer Verwaltung; Ghazan führte den Islam als Staatsreligion ein.|Mongol cavalry with Persian administration; Ghazan made Islam the state religion.",
    w: ["Fall von Bagdad (1258)|Fall of Baghdad (1258)", "Schlacht bei Homs (1299)|Battle of Homs (1299)"],
    l: ["Schlacht bei Ain Dschalut (1260)|Battle of Ain Jalut (1260)", "Zweite Schlacht bei Homs (1281)|Second Battle of Homs (1281)"],
    g: ["fa", "mn", "ar"],
  },
  "koenigreich-frankreich": {
    f: ["Philipp II. August|Philip II Augustus", "Jeanne d'Arc|Joan of Arc", "Franz I.|Francis I", "Heinrich IV.|Henry IV", "Ludwig XIV.|Louis XIV"],
    s: "Zentralisierter Staat mit Europas größtem Heer unter Ludwig XIV. (bis zu rund 400.000 Mann).|A centralised state with Europe's largest army under Louis XIV (up to about 400,000 men).",
    w: ["Schlacht bei Bouvines (1214)|Battle of Bouvines (1214)", "Hundertjähriger Krieg (1337–1453)|Hundred Years' War (1337–1453)"],
    l: ["Schlacht von Azincourt (1415)|Battle of Agincourt (1415)", "Schlacht bei Pavia (1525)|Battle of Pavia (1525)", "Siebenjähriger Krieg (1756–63)|Seven Years' War (1756–63)"],
    g: ["fr", "oc"],
  },
  "schwedisches-grossreich": {
    f: ["Gustav II. Adolf|Gustavus Adolphus", "Axel Oxenstierna", "Karl X. Gustav|Charles X Gustav", "Karl XII.|Charles XII"],
    s: "Kleine Bevölkerung, aber das modernste Heer seiner Zeit; der „Löwe aus Mitternacht“.|Small population but the most modern army of its time; the 'Lion of the North'.",
    w: ["Schlacht bei Breitenfeld (1631)|Battle of Breitenfeld (1631)", "Schlacht bei Narva (1700)|Battle of Narva (1700)"],
    l: ["Schlacht bei Poltawa (1709)|Battle of Poltava (1709)", "Großer Nordischer Krieg (1700–21)|Great Northern War (1700–21)"],
    g: ["sv", "fi"],
  },
  "polen-litauen": {
    f: ["Stephan Báthory|Stephen Báthory", "Sigismund III. Wasa|Sigismund III Vasa", "Stanisław Żółkiewski", "Jan III. Sobieski|John III Sobieski"],
    s: "Berühmte geflügelte Husaren (Panzerreiter); um 1600 einer der größten Staaten Europas.|The famous winged hussars (armoured cavalry); one of the largest states in Europe around 1600.",
    w: ["Schlacht bei Kluschino (1610)|Battle of Klushino (1610)", "Entsatz von Wien (1683)|Relief of Vienna (1683)"],
    l: ["Die Sintflut: schwedische und russische Invasion (1655–60)|The Deluge: Swedish and Russian invasions (1655–60)", "Teilungen Polens (1772–95)|Partitions of Poland (1772–95)"],
    g: ["pl", "lt", "la"],
  },
  "habsburgermonarchie": {
    f: ["Maximilian I.|Maximilian I", "Ferdinand II.|Ferdinand II", "Prinz Eugen von Savoyen|Prince Eugene of Savoy", "Maria Theresia|Maria Theresa", "Joseph II.|Joseph II"],
    s: "Vielvölkerreich mit multiethnischem Heer; Prinz Eugen besiegte Osmanen und Franzosen.|A multi-ethnic realm with a multi-ethnic army; Prince Eugene defeated Ottomans and French.",
    w: ["Schlacht bei Zenta (1697)|Battle of Zenta (1697)", "Entsatz von Wien (1683, mit Polen)|Relief of Vienna (1683, with Poland)"],
    l: ["Verlust Schlesiens (1742/48)|Loss of Silesia (1742/48)", "Schlacht bei Austerlitz (1805)|Battle of Austerlitz (1805)"],
    g: ["de", "hu", "la"],
  },
  "republik-der-sieben-vereinigten-provinzen": {
    f: ["Wilhelm von Oranien|William the Silent", "Moritz von Oranien|Maurice of Nassau", "Michiel de Ruyter", "Johan de Witt", "Piet Hein"],
    s: "Größte Handelsflotte Europas und moderne Kriegsflotte; reich durch den Handel (VOC).|Europe's largest merchant fleet and a modern navy; wealthy through trade (VOC).",
    w: ["Unabhängigkeit von Spanien (1648)|Independence from Spain (1648)", "Überfall auf die Medway (1667)|Raid on the Medway (1667)"],
    l: ["Vierter Englisch-Niederländischer Krieg (1780–84)|Fourth Anglo-Dutch War (1780–84)", "Besetzung durch Frankreich (1795)|French occupation (1795)"],
    d: ["Katastrophenjahr 1672: Invasion, die Republik überlebt|Disaster Year 1672: invasion, the Republic survives"],
    g: ["nl"],
  },
  "chola-reich": {
    f: ["Vijayalaya", "Rajaraja I.|Rajaraja I", "Rajendra I.|Rajendra I", "Kulothunga I.|Kulothunga I"],
    s: "Stärkste Kriegsflotte des Indischen Ozeans ihrer Zeit; Feldzüge bis nach Südostasien.|The strongest navy in the Indian Ocean of its time; campaigns as far as Southeast Asia.",
    w: ["Eroberung von Nord-Sri-Lanka (um 993)|Conquest of northern Sri Lanka (c. 993)", "Seezug gegen Srivijaya (1025)|Naval expedition against Srivijaya (1025)"],
    l: ["Schlacht von Takkolam (949)|Battle of Takkolam (949)", "Pandya-Wiedererstarken und Ende (1279)|Pandya resurgence and end (1279)"],
    g: ["ta", "sa"],
  },
  "vijayanagar-reich": {
    f: ["Harihara I.|Harihara I", "Bukka I.|Bukka I", "Krishnadevaraya", "Rama Raya"],
    s: "Reiterei, Elefanten und Musketen; die Hauptstadt Vijayanagara gehörte um 1500 zu den größten Städten der Welt.|Cavalry, elephants and muskets; the capital Vijayanagara was among the largest cities in the world around 1500.",
    w: ["Einnahme von Raichur (1520)|Capture of Raichur (1520)"],
    l: ["Schlacht von Talikota (1565)|Battle of Talikota (1565)"],
    g: ["te", "kn", "ta"],
  },
  "marathenreich": {
    f: ["Shivaji", "Sambhaji", "Baji Rao I.|Baji Rao I", "Tarabai"],
    s: "Schnelle Reiterei, Guerillataktik und Bergfestungen; Shivaji baute auch eine Marine auf.|Fast cavalry, guerrilla tactics and hill forts; Shivaji also built a navy.",
    w: ["Schlacht von Pratapgad (1659)|Battle of Pratapgad (1659)", "Schlacht von Palkhed (1728)|Battle of Palkhed (1728)"],
    l: ["Dritte Schlacht bei Panipat (1761)|Third Battle of Panipat (1761)", "Dritter Anglo-Marathen-Krieg (1817–18)|Third Anglo-Maratha War (1817–18)"],
    g: ["mr", "sa", "fa"],
  },
  "sultanat-von-delhi": {
    f: ["Qutb ud-Din Aibak", "Iltutmisch|Iltutmish", "Razia Sultana", "Alauddin Khalji", "Muhammad ibn Tughluq"],
    s: "Türkische Reiterheere und Kriegselefanten; wehrten wiederholt Mongolen ab.|Turkic cavalry armies and war elephants; repeatedly repelled Mongol invasions.",
    w: ["Abwehr der Mongolen bei Kili (1299)|Repelling the Mongols at Kili (1299)"],
    l: ["Plünderung Delhis durch Timur (1398)|Sack of Delhi by Timur (1398)", "Schlacht bei Panipat (1526)|Battle of Panipat (1526)"],
    g: ["fa", "ur"],
  },
  "ptolemaeerreich": {
    f: ["Ptolemaios I.|Ptolemy I", "Ptolemaios II.|Ptolemy II", "Arsinoë II.|Arsinoë II", "Kleopatra VII.|Cleopatra VII"],
    s: "Griechisch-makedonische Söldnerheere und eine starke Flotte; Alexandria mit Bibliothek und Leuchtturm.|Greek-Macedonian mercenary armies and a strong fleet; Alexandria with its library and lighthouse.",
    w: ["Schlacht bei Raphia (217 v. Chr.)|Battle of Raphia (217 BC)", "Dritter Syrischer Krieg (246–241 v. Chr.)|Third Syrian War (246–241 BC)"],
    l: ["Schlacht bei Paneion (200 v. Chr.)|Battle of Panium (200 BC)", "Seeschlacht bei Actium (31 v. Chr.)|Battle of Actium (31 BC)", "Annexion durch Rom (30 v. Chr.)|Annexation by Rome (30 BC)"],
    g: ["el", "egy"],
  },
  "seleukidenreich": {
    f: ["Seleukos I.|Seleucus I", "Antiochos III. der Große|Antiochus III the Great", "Antiochos IV.|Antiochus IV"],
    s: "Riesiges Reich mit Elefantenheer; Seleukos erhielt 500 Elefanten von den Maurya.|A huge empire with an elephant corps; Seleucus obtained 500 elephants from the Mauryans.",
    w: ["Schlacht bei Ipsos (301 v. Chr.)|Battle of Ipsus (301 BC)", "Schlacht bei Paneion (200 v. Chr.)|Battle of Panium (200 BC)"],
    l: ["Schlacht bei Magnesia (190 v. Chr.)|Battle of Magnesia (190 BC)", "Makkabäeraufstand (ab 167 v. Chr.)|Maccabean Revolt (from 167 BC)", "Verlust des Ostens an die Parther|Loss of the east to the Parthians"],
    g: ["el", "arc"],
  },
  // 27.10.2026: weitere Reiche mit gut belegten Eckdaten (nur Fakten, die in der Forschung unstrittig sind)
  "zarentum-russland": {
    f: ["Iwan IV. der Schreckliche|Ivan the Terrible", "Boris Godunow|Boris Godunov", "Michael I. Romanow|Michael I Romanov", "Alexei I.|Alexis I", "Peter der Große|Peter the Great"],
    s: "Schützenregimenter mit Musketen (Strelizen) und Kosakenheere; mit ihnen drang Russland in nur wenigen Jahrzehnten bis tief nach Sibirien vor.|Musket regiments (the Streltsy) and Cossack hosts; with them Russia pushed deep into Siberia within a few decades.",
    w: ["Eroberung von Kasan (1552)|Conquest of Kazan (1552)", "Eroberung des Khanats Sibir (ab 1582)|Conquest of the Khanate of Sibir (from 1582)", "Russisch-Polnischer Krieg (1654–67): Smolensk und Kiew gewonnen|Russo-Polish War (1654–67): Smolensk and Kyiv gained"],
    l: ["Livländischer Krieg (1558–83)|Livonian War (1558–83)", "Besetzung Moskaus durch polnische Truppen (1610–12)|Polish occupation of Moscow (1610–12)"],
    g: ["ru"],
  },
  "britisch-indien": {
    f: ["Königin Viktoria|Queen Victoria", "Lord Curzon", "Mahatma Gandhi|Mahatma Gandhi", "Lord Mountbatten"],
    s: "Die Indian Army: im Zweiten Weltkrieg dienten rund 2,5 Millionen Freiwillige. Dazu ein dichtes Netz aus Eisenbahnen und Verwaltung.|The Indian Army: about 2.5 million volunteers served in the Second World War. Added to that came a dense network of railways and administration.",
    w: ["Dritter Anglo-Birmanischer Krieg (1885)|Third Anglo-Burmese War (1885)", "Beitrag zum Sieg im Ersten Weltkrieg|Contribution to victory in the First World War"],
    l: ["Verlust der Herrschaft: Unabhängigkeit Indiens und Pakistans (1947)|Loss of rule: independence of India and Pakistan (1947)"],
    d: ["Dritter Anglo-Afghanischer Krieg (1919)|Third Anglo-Afghan War (1919)"],
    g: ["en", "hi", "ur", "bn"],
  },
  "kaiserreich-brasilien": {
    f: ["Pedro I.|Pedro I", "Pedro II.|Pedro II", "Prinzessin Isabel (Lei Áurea, 1888)|Princess Isabel (Golden Law, 1888)"],
    s: "Ein einziges, großes und überwiegend einheitlich regiertes Gebiet; stabile Monarchie, während die Nachbarn oft zerfielen.|One huge, largely unified territory; a stable monarchy while its neighbours often fell apart.",
    w: ["Unabhängigkeitskrieg gegen Portugal (1822–24)|War of independence against Portugal (1822–24)", "Paraguayischer Krieg (1864–70) mit Argentinien und Uruguay|Paraguayan War (1864–70) with Argentina and Uruguay"],
    l: ["Cisplatinakrieg (1825–28): Verlust des heutigen Uruguay|Cisplatine War (1825–28): loss of today's Uruguay"],
    g: ["pt"],
  },
  "grosskolumbien": {
    f: ["Simón Bolívar", "Francisco de Paula Santander", "Antonio José de Sucre"],
    s: "Befreiungsheere unter Bolívar und Sucre, die die spanische Herrschaft in mehreren Ländern beendeten.|Liberation armies under Bolívar and Sucre that ended Spanish rule in several countries.",
    w: ["Schlacht von Boyacá (1819)|Battle of Boyacá (1819)", "Schlacht von Carabobo (1821)|Battle of Carabobo (1821)", "Schlacht von Pichincha (1822)|Battle of Pichincha (1822)", "Schlacht von Tarqui (1829)|Battle of Tarqui (1829)"],
    l: ["Zerfall in Kolumbien, Venezuela und Ecuador (1830)|Break-up into Colombia, Venezuela and Ecuador (1830)"],
    g: ["es"],
  },
  "choresmier-reich": {
    f: ["Ala ad-Din Muhammad II.|Ala ad-Din Muhammad II", "Dschalal ad-Din Mingburnu|Jalal ad-Din Mingburnu"],
    s: "Türkische Reiterheere; das Reich beherrschte zeitweise Persien und Zentralasien.|Turkic cavalry armies; at times the empire ruled Persia and Central Asia.",
    w: ["Sieg über die Ghuriden (um 1215)|Victory over the Ghurids (c. 1215)", "Schlacht von Parwan (1221): seltener Sieg über die Mongolen|Battle of Parwan (1221): a rare victory over the Mongols"],
    l: ["Mongolensturm (1219–21): Fall von Buchara, Samarkand und Urgentsch|Mongol invasion (1219–21): fall of Bukhara, Samarkand and Urgench", "Schlacht am Indus (1221)|Battle of the Indus (1221)"],
    g: ["fa"],
  },
  "tibetisches-reich": {
    f: ["Songtsen Gampo", "Trisong Detsen", "Ralpachan", "Langdarma"],
    s: "Starke Bergkrieger und Hochland-Kavallerie; das Reich war zeitweise Großmacht neben Tang-China und dem Abbasidenreich.|Tough highland warriors and cavalry; at times the empire was a great power alongside Tang China and the Abbasid Caliphate.",
    w: ["Sieg über die Tang am Dafei-Fluss (670)|Victory over the Tang at the Dafei River (670)", "Einnahme der Tang-Hauptstadt Chang'an (763)|Capture of the Tang capital Chang'an (763)"],
    l: ["Zerfall nach der Ermordung Langdarmas (842)|Collapse after the murder of Langdarma (842)"],
    g: ["bo"],
  },
  "afschariden-reich": {
    f: ["Nader Schah|Nader Shah", "Schahrokh Schah|Shahrokh Shah"],
    s: "Ein schlagkräftiges Heer unter dem Feldherrn Nader, der Persien nach Jahren des Verfalls neu einte.|A powerful army under the general Nader, who reunited Persia after years of decline.",
    w: ["Schlacht von Karnal (1739) und Plünderung Delhis|Battle of Karnal (1739) and the sack of Delhi", "Sieg über die Osmanen bei Baghavard (1735)|Victory over the Ottomans at Baghavard (1735)"],
    l: ["Zerfall nach Nader Schahs Ermordung (1747)|Collapse after Nader Shah's assassination (1747)"],
    g: ["fa"],
  },
  "dsungarisches-khanat": {
    f: ["Galdan Boschugtu Khan|Galdan Boshugtu Khan", "Tsewang Rabtan", "Amursana"],
    s: "Das letzte große Nomadenreich der Steppe, mit Feuerwaffen und Kanonen ausgerüstet.|The last great nomad empire of the steppe, equipped with firearms and cannon.",
    w: ["Sieg über die Khalkha-Mongolen (1688)|Victory over the Khalkha Mongols (1688)", "Eroberung Ostturkestans (1680)|Conquest of Eastern Turkestan (1680)"],
    l: ["Eroberung durch die Qing (1755–58)|Conquest by the Qing (1755–58)"],
    g: ["mn"],
  },
  "noerdliche-yuan-dynastie": {
    f: ["Toghon Temür", "Esen Taischi|Esen Tayisi", "Dayan Khan", "Ligdan Khan"],
    s: "Das Mongolenreich lebte nach der Vertreibung aus China in der Steppe weiter und blieb ein ständiger Gegner der Ming.|The Mongol state lived on in the steppe after being driven out of China and remained a constant opponent of the Ming.",
    w: ["Schlacht von Tumu (1449): Gefangennahme des Ming-Kaisers|Battle of Tumu (1449): capture of the Ming emperor"],
    l: ["Niederlage gegen die Ming am Buir Nor (1388)|Defeat by the Ming at Buir Nor (1388)", "Niederlage gegen die späteren Jin / Mandschu (1634)|Defeat by the Later Jin / Manchus (1634)"],
    g: ["mn"],
  },
  "uigurisches-khaganat": {
    f: ["Moyanchur (Bayanchur Khan)", "Bögü Khan|Bögü Khan"],
    s: "Nomadenreiter in der Steppe; das Reich stützte die Tang-Kaiser im Kampf gegen den An-Lushan-Aufstand.|Nomad horsemen of the steppe; the empire backed the Tang emperors against the An Lushan rebellion.",
    w: ["Sieg über die Göktürken (744)|Victory over the Göktürks (744)", "Hilfe für die Tang im An-Lushan-Aufstand (757)|Help for the Tang in the An Lushan rebellion (757)"],
    l: ["Zerstörung durch die Kirgisen (840)|Destruction by the Kyrgyz (840)"],
    g: ["ug"],
  },
  "xin-dynastie": {
    f: ["Wang Mang"],
    s: "Eine kurzlebige Dynastie, die nur ihr Gründer Wang Mang regierte. Er versuchte, Land und Geld gründlich zu reformieren.|A short-lived dynasty ruled only by its founder Wang Mang, who tried to reform land and money thoroughly.",
    w: [],
    l: ["Aufstand der Roten Augenbrauen (ab 18)|Red Eyebrows rebellion (from AD 18)", "Schlacht von Kunyang (23)|Battle of Kunyang (AD 23)"],
    g: ["zh"],
  },
  "westliche-jin-dynastie": {
    f: ["Sima Yan (Kaiser Wu)|Sima Yan (Emperor Wu)", "Sima Zhong"],
    s: "Die Dynastie einte China nach der Zeit der Drei Reiche wieder, verfiel aber schnell durch Machtkämpfe.|The dynasty reunified China after the Three Kingdoms period but declined quickly through power struggles.",
    w: ["Eroberung des Reichs Wu (280): Wiedervereinigung Chinas|Conquest of Wu (280): reunification of China"],
    l: ["Krieg der Acht Prinzen (291–306)|War of the Eight Princes (291–306)", "Fall von Luoyang (311)|Fall of Luoyang (311)"],
    g: ["zh"],
  },
};

export function getProfile(slug: string): Profile | undefined {
  return P[slug];
}

/** "de|en"-Text für die Sprache auswählen (alle außer Deutsch zeigen Englisch). */
export function pick(s: string, lang: Lang): string {
  const i = s.indexOf("|");
  if (i < 0) return s;
  return lang === "de" ? s.slice(0, i) : s.slice(i + 1);
}

// Eigene Namen für Sprachen, die Intl.DisplayNames evtl. nicht kennt
const LANG_FB: Record<string, string> = {
  ota: "Osmanisch-Türkisch|Ottoman Turkish",
  peo: "Altpersisch|Old Persian",
  elx: "Elamisch|Elamite",
  grc: "Altgriechisch|Ancient Greek",
  lzh: "Klassisches Chinesisch|Classical Chinese",
  ltc: "Mittelchinesisch|Middle Chinese",
  mnc: "Mandschu|Manchu",
  pal: "Mittelpersisch|Middle Persian",
  xpr: "Parthisch|Parthian",
  pra: "Prakrit|Prakrit",
  xbc: "Baktrisch|Bactrian",
  chg: "Tschagataisch|Chagatai",
  goh: "Althochdeutsch|Old High German",
  otk: "Alttürkisch|Old Turkic",
  sog: "Sogdisch|Sogdian",
  kipchak: "Kiptschak-Türkisch|Kipchak Turkic",
  xpu: "Punisch|Punic",
  hit: "Hethitisch|Hittite",
  xlu: "Luwisch|Luwian",
  egy: "Altägyptisch|Ancient Egyptian",
  akk: "Akkadisch|Akkadian",
  gez: "Altäthiopisch (Geez)|Ge'ez",
  mnk: "Mandinka|Mandinka",
  son: "Songhai|Songhay",
};

/** Sprachname in der Sprache der Seite (Intl, sonst eigene Liste). */
export function langName(code: string, lang: Lang): string {
  const special = ["ota", "peo", "elx", "lzh", "ltc", "mnc", "pal", "xpr", "pra", "xbc", "chg", "goh", "otk", "sog", "kipchak", "xpu", "xlu", "egy", "akk", "gez", "hit"];
  if (!special.includes(code)) {
    try {
      const n = new Intl.DisplayNames([lang], { type: "language", fallback: "none" }).of(code);
      if (n) return n.charAt(0).toLocaleUpperCase(lang) + n.slice(1);
    } catch {
      /* eigener Name unten */
    }
  }
  const fb = LANG_FB[code];
  return fb ? pick(fb, lang) : code;
}

// 0 Stärke, 1 Persönlichkeiten, 2 gewonnen, 3 verloren, 4 unentschieden, 5 Sprachen, 6 kein Profil, 7 Profil
export const PROFILE_LABELS: Record<Lang, string[]> = {
  de: ["Stärke", "Berühmte Persönlichkeiten", "Gewonnene Kriege & Schlachten", "Verlorene Kriege & Schlachten", "Unentschieden / umstritten", "Sprachen", "Für dieses Reich gibt es noch kein Profil.", "Profil"],
  en: ["Strength", "Famous figures", "Wars & battles won", "Wars & battles lost", "Draw / disputed", "Languages", "No profile for this empire yet.", "Profile"],
  es: ["Fuerza", "Personajes famosos", "Guerras y batallas ganadas", "Guerras y batallas perdidas", "Empate / disputado", "Idiomas", "Aún no hay perfil de este imperio.", "Perfil"],
  fr: ["Puissance", "Personnages célèbres", "Guerres et batailles gagnées", "Guerres et batailles perdues", "Nul / contesté", "Langues", "Pas encore de profil pour cet empire.", "Profil"],
  pt: ["Força", "Personagens famosos", "Guerras e batalhas vencidas", "Guerras e batalhas perdidas", "Empate / disputado", "Idiomas", "Ainda não há perfil deste império.", "Perfil"],
  tr: ["Güç", "Ünlü isimler", "Kazanılan savaşlar", "Kaybedilen savaşlar", "Berabere / tartışmalı", "Diller", "Bu imparatorluk için henüz profil yok.", "Profil"],
  ru: ["Мощь", "Известные личности", "Выигранные войны и битвы", "Проигранные войны и битвы", "Ничья / спорно", "Языки", "Для этой империи пока нет профиля.", "Профиль"],
  el: ["Ισχύς", "Διάσημες προσωπικότητες", "Πόλεμοι και μάχες που κερδήθηκαν", "Πόλεμοι και μάχες που χάθηκαν", "Ισοπαλία / αμφισβητούμενο", "Γλώσσες", "Δεν υπάρχει ακόμη προφίλ για αυτή την αυτοκρατορία.", "Προφίλ"],
  ar: ["القوة", "شخصيات مشهورة", "حروب ومعارك منتصرة", "حروب ومعارك خاسرة", "تعادل / محل خلاف", "اللغات", "لا يوجد ملف لهذه الإمبراطورية بعد.", "الملف"],
  hi: ["शक्ति", "प्रसिद्ध व्यक्ति", "जीते गए युद्ध और लड़ाइयाँ", "हारे गए युद्ध और लड़ाइयाँ", "अनिर्णीत / विवादित", "भाषाएँ", "इस साम्राज्य की प्रोफ़ाइल अभी उपलब्ध नहीं है।", "प्रोफ़ाइल"],
  zh: ["实力", "著名人物", "获胜的战争与战役", "失败的战争与战役", "平局 / 存在争议", "语言", "该帝国暂无详细档案。", "概览"],
  ja: ["国力", "著名な人物", "勝利した戦争・戦い", "敗北した戦争・戦い", "引き分け・議論あり", "言語", "この帝国のプロフィールはまだありません。", "プロフィール"],
  ko: ["국력", "유명 인물", "승리한 전쟁·전투", "패배한 전쟁·전투", "무승부 / 논쟁 중", "언어", "이 제국의 프로필은 아직 없습니다.", "프로필"],
  id: ["Kekuatan", "Tokoh terkenal", "Perang & pertempuran yang dimenangkan", "Perang & pertempuran yang dikalahkan", "Seri / diperdebatkan", "Bahasa", "Belum ada profil untuk kekaisaran ini.", "Profil"],
  fa: ["قدرت", "شخصیت‌های مشهور", "جنگ‌ها و نبردهای پیروزمندانه", "جنگ‌ها و نبردهای ازدست‌رفته", "مساوی / مورد مناقشه", "زبان‌ها", "برای این امپراتوری هنوز پروفایلی وجود ندارد.", "پروفایل"],
};
