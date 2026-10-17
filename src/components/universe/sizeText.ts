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
  id: T("Cari objek …", "Tidak ditemukan", "Zoom", "Tampilkan semua", "Zoom: cubit atau roda mouse · Geser: seret · Skala di kiri bawah menunjukkan panjang sebenarnya."),
  fa: T("جستجوی جرم …", "چیزی یافت نشد", "بزرگ‌نمایی", "نمایش همه", "بزرگ‌نمایی: دو انگشت یا چرخ ماوس · جابه‌جایی: کشیدن · مقیاس پایین سمت چپ طول واقعی را نشان می‌دهد."),
};

/** Übersicht aller Objekte (Nutzerwunsch 15.10.2026: mehr Objekte gleichzeitig sehen). */
export interface UiText3 {
  all: string;
  allHint: string;
}

const T3 = (all: string, allHint: string): UiText3 => ({ all, allHint });

export const UI3: Record<Lang, UiText3> = {
  de: T3("Überblick", "Alle Objekte auf einen Blick. Die Größen sind hier stark gestaucht, damit alles auf einmal passt (nicht maßstabsgetreu) – die Reihenfolge stimmt. Antippen öffnet den maßstabsgetreuen Vergleich."),
  en: T3("Overview", "All objects at a glance. Sizes are strongly compressed so everything fits at once (not to scale) – the order is correct. Tap an object to open the true-scale comparison."),
  es: T3("Resumen", "Todos los objetos de un vistazo. Los tamaños están muy comprimidos para que quepan a la vez (sin escala real); el orden es correcto. Toca un objeto para abrir la comparación a escala real."),
  fr: T3("Aperçu", "Tous les objets en un coup d'œil. Les tailles sont très compressées pour tout afficher à la fois (pas à l'échelle) ; l'ordre est correct. Touche un objet pour ouvrir la comparaison à l'échelle réelle."),
  pt: T3("Visão geral", "Todos os objetos num relance. Os tamanhos estão muito comprimidos para caberem de uma vez (fora de escala); a ordem está correta. Toque num objeto para abrir a comparação em escala real."),
  tr: T3("Genel bakış", "Tüm nesneler tek bakışta. Hepsi sığsın diye boyutlar güçlü biçimde sıkıştırıldı (ölçekli değil); sıralama doğru. Gerçek ölçekli karşılaştırmayı açmak için bir nesneye dokun."),
  ru: T3("Обзор", "Все объекты сразу. Размеры сильно сжаты, чтобы всё поместилось (не в масштабе); порядок верный. Нажмите на объект, чтобы открыть сравнение в реальном масштабе."),
  el: T3("Επισκόπηση", "Όλα τα αντικείμενα με μια ματιά. Τα μεγέθη είναι έντονα συμπιεσμένα ώστε να χωράνε όλα (όχι υπό κλίμακα) · η σειρά είναι σωστή. Πάτα ένα αντικείμενο για τη σύγκριση σε πραγματική κλίμακα."),
  ar: T3("نظرة عامة", "كل الأجرام في لمحة. الأحجام مضغوطة بشدة لتتسع كلها (ليست بمقياس حقيقي) والترتيب صحيح. المس جرماً لفتح المقارنة بالمقياس الحقيقي."),
  hi: T3("अवलोकन", "सभी वस्तुएँ एक नज़र में। सब कुछ समा सके इसलिए आकार काफ़ी सिकोड़े गए हैं (असली पैमाने पर नहीं) – क्रम सही है। असली पैमाने की तुलना खोलने के लिए किसी वस्तु को छुएँ।"),
  zh: T3("总览", "所有天体一览。为了全部放下，大小被大幅压缩（并非真实比例），但顺序是正确的。点按任一天体即可打开真实比例的对比。"),
  ja: T3("一覧", "すべての天体を一覧表示。全部が収まるよう大きさを強く圧縮しています（実際の縮尺ではありません）が、順番は正しいです。天体をタップすると実寸の比較が開きます。"),
  ko: T3("한눈에", "모든 천체를 한눈에. 한꺼번에 들어가도록 크기를 크게 압축했습니다(실제 비율 아님). 순서는 정확합니다. 천체를 누르면 실제 비율 비교가 열립니다."),
  id: T3("Ikhtisar", "Semua objek sekilas. Ukuran dikompresi kuat agar semuanya muat sekaligus (bukan skala sebenarnya) – urutannya benar. Ketuk objek untuk membuka perbandingan skala sebenarnya."),
  fa: T3("نمای کلی", "همه اجرام یک‌جا. اندازه‌ها برای جا شدن همه‌چیز به‌شدت فشرده شده‌اند (نه در مقیاس واقعی) – ترتیب درست است. روی یک جرم بزنید تا مقایسه در مقیاس واقعی باز شود."),
};
