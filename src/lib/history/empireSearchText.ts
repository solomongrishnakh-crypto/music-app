import type { Lang } from "@/contexts/LanguageContext";

/** Texte der Reichs-Suche (Nutzerwunsch 15.10.2026) in allen 13 Sprachen. */
export interface SearchText {
  found: string; // {n} = Anzahl
  hint: string;
  clear: string;
  info: string;
  none: string;
}

const T = (found: string, hint: string, clear: string, info: string, none: string): SearchText => ({ found, hint, clear, info, none });

export const SEARCH_TEXT: Record<Lang, SearchText> = {
  de: T("{n} Reiche gefunden – auf der Karte hervorgehoben", "Tippe ein Reich an, die Karte springt dorthin.", "Hervorhebung aufheben", "Info", "Kein Reich auf der Karte gefunden – Wikipedia-Info:"),
  en: T("{n} empires found – highlighted on the map", "Tap an empire and the map jumps there.", "Clear highlight", "Info", "No empire on the map found – Wikipedia info:"),
  es: T("{n} imperios encontrados, resaltados en el mapa", "Toca un imperio y el mapa salta allí.", "Quitar resaltado", "Info", "No hay imperio en el mapa – info de Wikipedia:"),
  fr: T("{n} empires trouvés, surlignés sur la carte", "Touche un empire, la carte s'y rend.", "Retirer la surbrillance", "Info", "Aucun empire sur la carte – info Wikipédia :"),
  pt: T("{n} impérios encontrados, destacados no mapa", "Toque num império e o mapa vai até lá.", "Remover destaque", "Info", "Nenhum império no mapa – info da Wikipédia:"),
  tr: T("{n} imparatorluk bulundu, haritada vurgulandı", "Bir imparatorluğa dokun, harita oraya gider.", "Vurguyu kaldır", "Bilgi", "Haritada imparatorluk bulunamadı – Vikipedi bilgisi:"),
  ru: T("Найдено империй: {n} – выделены на карте", "Нажмите на империю – карта перейдёт к ней.", "Снять выделение", "Инфо", "На карте не найдено – справка из Википедии:"),
  el: T("Βρέθηκαν {n} αυτοκρατορίες – επισημασμένες στον χάρτη", "Πάτα μια αυτοκρατορία και ο χάρτης πηγαίνει εκεί.", "Αφαίρεση επισήμανσης", "Πληροφορίες", "Δεν βρέθηκε στον χάρτη – πληροφορίες Βικιπαίδειας:"),
  ar: T("تم العثور على {n} إمبراطوريات – مميّزة على الخريطة", "المس إمبراطورية لتنتقل الخريطة إليها.", "إزالة التمييز", "معلومات", "لم يتم العثور عليها على الخريطة – معلومات ويكيبيديا:"),
  hi: T("{n} साम्राज्य मिले – नक्शे पर चिह्नित", "किसी साम्राज्य को छुएँ, नक्शा वहीं पहुँच जाएगा।", "चिह्न हटाएँ", "जानकारी", "नक्शे पर नहीं मिला – विकिपीडिया जानकारी:"),
  zh: T("找到 {n} 个帝国，已在地图上高亮", "点一个帝国，地图就会跳到那里。", "取消高亮", "信息", "地图上未找到，维基百科信息："),
  ja: T("{n} 件の帝国が見つかりました（地図で強調表示）", "帝国をタップすると地図がそこへ移動します。", "強調表示を解除", "情報", "地図に見つかりません。ウィキペディアの情報："),
  ko: T("제국 {n}개를 찾았습니다 – 지도에 강조 표시", "제국을 누르면 지도가 그곳으로 이동합니다.", "강조 해제", "정보", "지도에서 찾지 못했습니다 – 위키백과 정보:"),
  id: T("{n} kekaisaran ditemukan, disorot di peta", "Ketuk sebuah kekaisaran dan peta akan melompat ke sana.", "Hapus sorotan", "Info", "Tidak ada kekaisaran di peta – info Wikipedia:"),
  fa: T("{n} امپراتوری یافت شد – روی نقشه مشخص شد", "روی یک امپراتوری بزنید تا نقشه به آنجا برود.", "حذف برجسته‌سازی", "اطلاعات", "در نقشه یافت نشد – اطلاعات ویکی‌پدیا:"),
};
