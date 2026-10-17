import type { Lang } from "@/contexts/LanguageContext";

/**
 * Texte der Startseite mit Schwerpunkt Universum + Geschichte (Nutzerwunsch
 * 14.10.2026): Musik ist nur noch ein kleiner Teil, die Suche findet auch
 * Planeten, Sterne, Sternbilder und Imperien. Alle 13 Sprachen.
 */
export interface HomeText {
  subtitle: string;
  placeholder: string;
  aria: string;
  musicBtn: string;
  musicChip: string;
  planet: string;
  dwarf: string;
  sun: string;
  probe: string;
  constellation: string;
  star: string;
  empire: string;
  ly: string;
  inConst: string;
  moreSky: string;
  moreHistory: string;
  noHits: string;
}

const HT: Record<Lang, HomeText> = {
  de: {
    subtitle: "Planeten, Sterne, Imperien — das Universum und die Geschichte der Menschheit.",
    placeholder: "Planeten, Sterne, Imperien oder Songs suchen …",
    aria: "Suche",
    musicBtn: "🎵 Auch nach Musik suchen",
    musicChip: "🎵 Nebenbei: Musik — einfach in der Suche einen Song eingeben.",
    planet: "Planet", dwarf: "Zwergplanet", sun: "Stern", probe: "Raumsonde", constellation: "Sternbild", star: "Stern", empire: "Imperium",
    ly: "Lichtjahre", inConst: "im Sternbild", moreSky: "Sternenhimmel", moreHistory: "Imperien", noHits: "Nichts gefunden.",
  },
  en: {
    subtitle: "Planets, stars, empires — the universe and the history of humankind.",
    placeholder: "Search planets, stars, empires or songs …",
    aria: "Search",
    musicBtn: "🎵 Search music too",
    musicChip: "🎵 On the side: music — just type a song into the search.",
    planet: "Planet", dwarf: "Dwarf planet", sun: "Star", probe: "Space probe", constellation: "Constellation", star: "Star", empire: "Empire",
    ly: "light-years", inConst: "in the constellation", moreSky: "Night sky", moreHistory: "Empires", noHits: "Nothing found.",
  },
  es: {
    subtitle: "Planetas, estrellas, imperios: el universo y la historia de la humanidad.",
    placeholder: "Busca planetas, estrellas, imperios o canciones …",
    aria: "Buscar",
    musicBtn: "🎵 Buscar también música",
    musicChip: "🎵 De paso: música — escribe una canción en el buscador.",
    planet: "Planeta", dwarf: "Planeta enano", sun: "Estrella", probe: "Sonda espacial", constellation: "Constelación", star: "Estrella", empire: "Imperio",
    ly: "años luz", inConst: "en la constelación", moreSky: "Cielo estrellado", moreHistory: "Imperios", noHits: "No se encontró nada.",
  },
  fr: {
    subtitle: "Planètes, étoiles, empires — l'univers et l'histoire de l'humanité.",
    placeholder: "Rechercher planètes, étoiles, empires ou titres …",
    aria: "Recherche",
    musicBtn: "🎵 Chercher aussi de la musique",
    musicChip: "🎵 En passant : musique — tape simplement un titre dans la recherche.",
    planet: "Planète", dwarf: "Planète naine", sun: "Étoile", probe: "Sonde spatiale", constellation: "Constellation", star: "Étoile", empire: "Empire",
    ly: "années-lumière", inConst: "dans la constellation", moreSky: "Ciel étoilé", moreHistory: "Empires", noHits: "Aucun résultat.",
  },
  pt: {
    subtitle: "Planetas, estrelas, impérios — o universo e a história da humanidade.",
    placeholder: "Procure planetas, estrelas, impérios ou músicas …",
    aria: "Pesquisar",
    musicBtn: "🎵 Procurar também música",
    musicChip: "🎵 De passagem: música — basta escrever uma música na pesquisa.",
    planet: "Planeta", dwarf: "Planeta anão", sun: "Estrela", probe: "Sonda espacial", constellation: "Constelação", star: "Estrela", empire: "Império",
    ly: "anos-luz", inConst: "na constelação", moreSky: "Céu estrelado", moreHistory: "Impérios", noHits: "Nada encontrado.",
  },
  tr: {
    subtitle: "Gezegenler, yıldızlar, imparatorluklar — evren ve insanlık tarihi.",
    placeholder: "Gezegen, yıldız, imparatorluk veya şarkı ara …",
    aria: "Ara",
    musicBtn: "🎵 Müzik de ara",
    musicChip: "🎵 Bir de müzik — aramaya bir şarkı adı yazman yeterli.",
    planet: "Gezegen", dwarf: "Cüce gezegen", sun: "Yıldız", probe: "Uzay sondası", constellation: "Takımyıldızı", star: "Yıldız", empire: "İmparatorluk",
    ly: "ışık yılı", inConst: "takımyıldızı:", moreSky: "Yıldızlı gökyüzü", moreHistory: "İmparatorluklar", noHits: "Hiçbir şey bulunamadı.",
  },
  ru: {
    subtitle: "Планеты, звёзды, империи — Вселенная и история человечества.",
    placeholder: "Поиск планет, звёзд, империй или песен …",
    aria: "Поиск",
    musicBtn: "🎵 Искать и музыку",
    musicChip: "🎵 Заодно музыка — просто введите песню в поиск.",
    planet: "Планета", dwarf: "Карликовая планета", sun: "Звезда", probe: "Космический зонд", constellation: "Созвездие", star: "Звезда", empire: "Империя",
    ly: "св. лет", inConst: "в созвездии", moreSky: "Звёздное небо", moreHistory: "Империи", noHits: "Ничего не найдено.",
  },
  el: {
    subtitle: "Πλανήτες, αστέρια, αυτοκρατορίες — το σύμπαν και η ιστορία της ανθρωπότητας.",
    placeholder: "Αναζήτηση πλανητών, αστεριών, αυτοκρατοριών ή τραγουδιών …",
    aria: "Αναζήτηση",
    musicBtn: "🎵 Αναζήτηση και μουσικής",
    musicChip: "🎵 Παρεμπιπτόντως: μουσική — γράψτε απλώς ένα τραγούδι στην αναζήτηση.",
    planet: "Πλανήτης", dwarf: "Νάνος πλανήτης", sun: "Αστέρι", probe: "Διαστημικό σκάφος", constellation: "Αστερισμός", star: "Αστέρι", empire: "Αυτοκρατορία",
    ly: "έτη φωτός", inConst: "στον αστερισμό", moreSky: "Έναστρος ουρανός", moreHistory: "Αυτοκρατορίες", noHits: "Δεν βρέθηκε τίποτα.",
  },
  ar: {
    subtitle: "كواكب ونجوم وإمبراطوريات — الكون وتاريخ البشرية.",
    placeholder: "ابحث عن كواكب أو نجوم أو إمبراطوريات أو أغانٍ …",
    aria: "بحث",
    musicBtn: "🎵 ابحث في الموسيقى أيضًا",
    musicChip: "🎵 وبالمناسبة: الموسيقى — اكتب اسم أغنية في البحث.",
    planet: "كوكب", dwarf: "كوكب قزم", sun: "نجم", probe: "مسبار فضائي", constellation: "كوكبة", star: "نجم", empire: "إمبراطورية",
    ly: "سنة ضوئية", inConst: "في كوكبة", moreSky: "سماء النجوم", moreHistory: "الإمبراطوريات", noHits: "لم يتم العثور على شيء.",
  },
  hi: {
    subtitle: "ग्रह, तारे, साम्राज्य — ब्रह्मांड और मानव इतिहास।",
    placeholder: "ग्रह, तारे, साम्राज्य या गाने खोजें …",
    aria: "खोज",
    musicBtn: "🎵 संगीत भी खोजें",
    musicChip: "🎵 साथ में: संगीत — खोज में बस कोई गाना लिखें।",
    planet: "ग्रह", dwarf: "बौना ग्रह", sun: "तारा", probe: "अंतरिक्ष यान", constellation: "तारामंडल", star: "तारा", empire: "साम्राज्य",
    ly: "प्रकाश-वर्ष", inConst: "तारामंडल में", moreSky: "तारों भरा आकाश", moreHistory: "साम्राज्य", noHits: "कुछ नहीं मिला।",
  },
  zh: {
    subtitle: "行星、恒星、帝国——宇宙与人类的历史。",
    placeholder: "搜索行星、恒星、帝国或歌曲…",
    aria: "搜索",
    musicBtn: "🎵 也搜索音乐",
    musicChip: "🎵 顺便一提：音乐——在搜索中输入歌名即可。",
    planet: "行星", dwarf: "矮行星", sun: "恒星", probe: "航天探测器", constellation: "星座", star: "恒星", empire: "帝国",
    ly: "光年", inConst: "所在星座：", moreSky: "星空", moreHistory: "帝国", noHits: "未找到结果。",
  },
  ja: {
    subtitle: "惑星、恒星、帝国 — 宇宙と人類の歴史。",
    placeholder: "惑星、恒星、帝国、曲を検索…",
    aria: "検索",
    musicBtn: "🎵 音楽も検索",
    musicChip: "🎵 ついでに音楽 — 検索に曲名を入力するだけ。",
    planet: "惑星", dwarf: "準惑星", sun: "恒星", probe: "宇宙探査機", constellation: "星座", star: "恒星", empire: "帝国",
    ly: "光年", inConst: "所属星座：", moreSky: "星空", moreHistory: "帝国", noHits: "見つかりませんでした。",
  },
  ko: {
    subtitle: "행성, 별, 제국 — 우주와 인류의 역사.",
    placeholder: "행성, 별, 제국 또는 곡 검색…",
    aria: "검색",
    musicBtn: "🎵 음악도 검색",
    musicChip: "🎵 덤으로 음악 — 검색창에 곡 이름만 입력하세요.",
    planet: "행성", dwarf: "왜행성", sun: "항성", probe: "우주 탐사선", constellation: "별자리", star: "별", empire: "제국",
    ly: "광년", inConst: "별자리:", moreSky: "별하늘", moreHistory: "제국", noHits: "결과가 없습니다.",
  },
  id: {
    subtitle: "Planet, bintang, kekaisaran — alam semesta dan sejarah umat manusia.",
    placeholder: "Cari planet, bintang, kekaisaran, atau lagu …",
    aria: "Cari",
    musicBtn: "🎵 Cari musik juga",
    musicChip: "🎵 Sampingan: musik — cukup ketik lagu di kolom pencarian.",
    planet: "Planet", dwarf: "Planet kerdil", sun: "Bintang", probe: "Wahana antariksa", constellation: "Rasi bintang", star: "Bintang", empire: "Kekaisaran",
    ly: "tahun cahaya", inConst: "di rasi", moreSky: "Langit malam", moreHistory: "Kekaisaran", noHits: "Tidak ditemukan.",
  },
  fa: {
    subtitle: "سیارات، ستارگان، امپراتوری‌ها — کیهان و تاریخ بشر.",
    placeholder: "جستجوی سیاره، ستاره، امپراتوری یا آهنگ …",
    aria: "جستجو",
    musicBtn: "🎵 موسیقی هم جستجو کن",
    musicChip: "🎵 در کنار آن: موسیقی — فقط نام آهنگ را در جستجو بنویسید.",
    planet: "سیاره", dwarf: "سیارهٔ کوتوله", sun: "ستاره", probe: "کاوشگر فضایی", constellation: "صورت فلکی", star: "ستاره", empire: "امپراتوری",
    ly: "سال نوری", inConst: "در صورت فلکی", moreSky: "آسمان شب", moreHistory: "امپراتوری‌ها", noHits: "چیزی یافت نشد.",
  },
};

export function homeText(lang: Lang): HomeText {
  return HT[lang] ?? HT.en;
}
