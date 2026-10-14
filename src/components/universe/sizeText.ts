import type { Lang } from "@/contexts/LanguageContext";

export interface UiText2 {
  search: string;
  none: string;
  zoomL: string;
  reset: string;
  zoomHint: string;
}

const T = (search: string, none: string, zoomL: string, reset: string, zoomHint: string): UiText2 => ({ search, none, zoomL, reset, zoomHint });

export const UI2: Record<Lang, UiText2> = {
  de: T("Objekt suchen …", "Nichts gefunden", "Zoom", "Alles zeigen", "Zoomen: zwei Finger oder Mausrad · Verschieben: ziehen · Der Maßstab unten links zeigt die echte Länge."),
  en: T("Search object …", "Nothing found", "Zoom", "Fit all", "Zoom: pinch or mouse wheel · Move: drag · The scale bar at the bottom left shows the real length."),
  es: T("Buscar objeto …", "Sin resultados", "Zoom", "Ver todo", "Zoom: pellizca o rueda del ratón · Mover: arrastra · La escala abajo a la izquierda muestra la longitud real."),
  fr: T("Rechercher un objet …", "Aucun résultat", "Zoom", "Tout voir", "Zoom : pincer ou molette · Déplacer : glisser · L'échelle en bas à gauche montre la longueur réelle."),
  pt: T("Buscar objeto …", "Nada encontrado", "Zoom", "Ver tudo", "Zoom: pinça ou roda do rato · Mover: arraste · A escala em baixo à esquerda mostra o comprimento real."),
  tr: T("Nesne ara …", "Sonuç yok", "Yakınlaştır", "Tümünü göster", "Yakınlaştır: iki parmak veya fare tekerleği · Kaydır: sürükle · Sol alttaki ölçek gerçek uzunluğu gösterir."),
  ru: T("Найти объект …", "Ничего не найдено", "Масштаб", "Показать всё", "Масштаб: щипок или колёсико · Сдвиг: перетаскивание · Шкала слева внизу показывает реальную длину."),
  el: T("Αναζήτηση αντικειμένου …", "Δεν βρέθηκε τίποτα", "Ζουμ", "Εμφάνιση όλων", "Ζουμ: τσίμπημα ή ροδέλα · Μετακίνηση: σύρετε · Η κλίμακα κάτω αριστερά δείχνει το πραγματικό μήκος."),
  ar: T("ابحث عن جرم …", "لا توجد نتائج", "تكبير", "عرض الكل", "التكبير: القرص بإصبعين أو عجلة الفأرة · التحريك: اسحب · المقياس أسفل اليسار يبيّن الطول الحقيقي."),
  hi: T("वस्तु खोजें …", "कुछ नहीं मिला", "ज़ूम", "सब दिखाएँ", "ज़ूम: दो उँगलियाँ या माउस व्हील · खिसकाएँ: खींचें · नीचे बाईं ओर का पैमाना असली लंबाई दिखाता है।"),
  zh: T("搜索天体 …", "没有结果", "缩放", "显示全部", "缩放：双指或鼠标滚轮 · 移动：拖动 · 左下角的比例尺显示真实长度。"),
  ja: T("天体を検索 …", "見つかりません", "ズーム", "全体表示", "ズーム：ピンチまたはマウスホイール · 移動：ドラッグ · 左下のスケールバーが実際の長さです。"),
  ko: T("천체 검색 …", "결과 없음", "확대", "전체 보기", "확대: 두 손가락 또는 마우스 휠 · 이동: 드래그 · 왼쪽 아래 축척이 실제 길이를 보여 줍니다."),
};
