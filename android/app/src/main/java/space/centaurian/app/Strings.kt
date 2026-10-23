package space.centaurian.app

/** Uebersetzungen der App-Texte. Schluessel = englischer Text, Werte in der Reihenfolge ORDER. */
object Tr {
    private val ORDER = listOf("es", "fr", "pt", "tr", "ru", "el", "ar", "hi", "zh", "ja", "ko", "id", "fa")

    private val M: Map<String, List<String>> = mapOf(
        "Privacy" to listOf("Privacidad", "Confidentialité", "Privacidade", "Gizlilik", "Конфиденциальность", "Απόρρητο", "الخصوصية", "गोपनीयता", "隐私", "プライバシー", "개인정보", "Privasi", "حریم خصوصی"),
        "Update available" to listOf("Actualización disponible", "Mise à jour disponible", "Atualização disponível", "Güncelleme mevcut", "Доступно обновление", "Διαθέσιμη ενημέρωση", "تحديث متاح", "अपडेट उपलब्ध है", "有可用更新", "アップデートがあります", "업데이트 가능", "Pembaruan tersedia", "به‌روزرسانی موجود است"),
        "New version " to listOf("Nueva versión ", "Nouvelle version ", "Nova versão ", "Yeni sürüm ", "Новая версия ", "Νέα έκδοση ", "إصدار جديد ", "नया संस्करण ", "新版本 ", "新バージョン ", "새 버전 ", "Versi baru ", "نسخه جدید "),
        ". The app downloads the update and starts the installation." to listOf(". La app descarga la actualización e inicia la instalación.", ". L'app télécharge la mise à jour et lance l'installation.", ". O app baixa a atualização e inicia a instalação.", ". Uygulama güncellemeyi indirir ve kurulumu başlatır.", ". Приложение загрузит обновление и начнёт установку.", ". Η εφαρμογή κατεβάζει την ενημέρωση και ξεκινά την εγκατάσταση.", ". سيقوم التطبيق بتنزيل التحديث وبدء التثبيت.", ". ऐप अपडेट डाउनलोड करेगा और इंस्टॉलेशन शुरू करेगा।", "。应用将下载更新并开始安装。", "。アプリがアップデートをダウンロードし、インストールを開始します。", ". 앱이 업데이트를 다운로드하고 설치를 시작합니다.", ". Aplikasi mengunduh pembaruan dan memulai instalasi.", ". برنامه به‌روزرسانی را دانلود و نصب را شروع می‌کند."),
        "Download failed. Try again." to listOf("La descarga falló. Inténtalo de nuevo.", "Échec du téléchargement. Réessaie.", "O download falhou. Tente novamente.", "İndirme başarısız. Tekrar dene.", "Не удалось загрузить. Попробуй ещё раз.", "Η λήψη απέτυχε. Δοκίμασε ξανά.", "فشل التنزيل. حاول مرة أخرى.", "डाउनलोड विफल रहा। फिर कोशिश करें।", "下载失败，请重试。", "ダウンロードに失敗しました。もう一度お試しください。", "다운로드에 실패했습니다. 다시 시도하세요.", "Unduhan gagal. Coba lagi.", "دانلود ناموفق بود. دوباره تلاش کن."),
        "UPDATE NOW" to listOf("ACTUALIZAR AHORA", "METTRE À JOUR", "ATUALIZAR AGORA", "ŞİMDİ GÜNCELLE", "ОБНОВИТЬ", "ΕΝΗΜΕΡΩΣΗ ΤΩΡΑ", "حدّث الآن", "अभी अपडेट करें", "立即更新", "今すぐ更新", "지금 업데이트", "PERBARUI SEKARANG", "همین حالا به‌روزرسانی"),
        "LATER" to listOf("MÁS TARDE", "PLUS TARD", "DEPOIS", "SONRA", "ПОЗЖЕ", "ΑΡΓΟΤΕΡΑ", "لاحقًا", "बाद में", "稍后", "後で", "나중에", "NANTI", "بعداً"),
        "No connection" to listOf("Sin conexión", "Pas de connexion", "Sem conexão", "Bağlantı yok", "Нет соединения", "Χωρίς σύνδεση", "لا يوجد اتصال", "कनेक्शन नहीं है", "无网络连接", "接続なし", "연결 없음", "Tidak ada koneksi", "بدون اتصال"),
        "Retry" to listOf("Reintentar", "Réessayer", "Tentar de novo", "Tekrar dene", "Повторить", "Επανάληψη", "إعادة المحاولة", "फिर कोशिश करें", "重试", "再試行", "다시 시도", "Coba lagi", "تلاش دوباره"),
        "Universe & world history" to listOf("Universo e historia mundial", "Univers et histoire du monde", "Universo e história mundial", "Evren ve dünya tarihi", "Вселенная и мировая история", "Σύμπαν και παγκόσμια ιστορία", "الكون وتاريخ العالم", "ब्रह्मांड और विश्व इतिहास", "宇宙与世界历史", "宇宙と世界史", "우주와 세계사", "Alam semesta & sejarah dunia", "جهان و تاریخ جهان"),
        "Search…" to listOf("Buscar…", "Rechercher…", "Pesquisar…", "Ara…", "Поиск…", "Αναζήτηση…", "بحث…", "खोजें…", "搜索…", "検索…", "검색…", "Cari…", "جستجو…"),
        "Nothing found" to listOf("No se encontró nada", "Aucun résultat", "Nada encontrado", "Bir şey bulunamadı", "Ничего не найдено", "Δεν βρέθηκε τίποτα", "لم يتم العثور على شيء", "कुछ नहीं मिला", "没有找到结果", "見つかりませんでした", "결과 없음", "Tidak ditemukan", "چیزی پیدا نشد"),
        "Explore" to listOf("Explorar", "Explorer", "Explorar", "Keşfet", "Исследовать", "Εξερεύνηση", "استكشف", "खोजें", "探索", "探索", "탐색", "Jelajahi", "کاوش"),
        "Tools" to listOf("Herramientas", "Outils", "Ferramentas", "Araçlar", "Инструменты", "Εργαλεία", "الأدوات", "उपकरण", "工具", "ツール", "도구", "Alat", "ابزارها"),
        "Planets, songs, empires…" to listOf("Planetas, canciones, imperios…", "Planètes, chansons, empires…", "Planetas, músicas, impérios…", "Gezegenler, şarkılar, imparatorluklar…", "Планеты, песни, империи…", "Πλανήτες, τραγούδια, αυτοκρατορίες…", "كواكب، أغانٍ، إمبراطوريات…", "ग्रह, गाने, साम्राज्य…", "行星、歌曲、帝国…", "惑星、曲、帝国…", "행성, 노래, 제국…", "Planet, lagu, kekaisaran…", "سیاره‌ها، آهنگ‌ها، امپراتوری‌ها…"),
        "Universe & sky" to listOf("Universo y cielo", "Univers et ciel", "Universo e céu", "Evren ve gökyüzü", "Вселенная и небо", "Σύμπαν και ουρανός", "الكون والسماء", "ब्रह्मांड और आकाश", "宇宙与天空", "宇宙と空", "우주와 하늘", "Alam semesta & langit", "جهان و آسمان"),
        "History" to listOf("Historia", "Histoire", "História", "Tarih", "История", "Ιστορία", "التاريخ", "इतिहास", "历史", "歴史", "역사", "Sejarah", "تاریخ"),
        "About" to listOf("Info", "À propos", "Sobre", "Hakkında", "О приложении", "Σχετικά", "حول", "जानकारी", "关于", "情報", "정보", "Tentang", "درباره"),
        "Settings" to listOf("Ajustes", "Paramètres", "Configurações", "Ayarlar", "Настройки", "Ρυθμίσεις", "الإعدادات", "सेटिंग्स", "设置", "設定", "설정", "Pengaturan", "تنظیمات"),
        "Please check your internet and try again." to listOf("Comprueba tu internet e inténtalo de nuevo.", "Vérifie ta connexion internet et réessaie.", "Verifique sua internet e tente novamente.", "İnternetini kontrol edip tekrar dene.", "Проверь интернет и попробуй снова.", "Έλεγξε το internet σου και δοκίμασε ξανά.", "تحقق من الإنترنت وحاول مرة أخرى.", "इंटरनेट जाँचें और फिर कोशिश करें।", "请检查网络后重试。", "インターネット接続を確認して、もう一度お試しください。", "인터넷을 확인하고 다시 시도하세요.", "Periksa internetmu lalu coba lagi.", "اینترنت خود را بررسی کن و دوباره تلاش کن."),
        "About Centaurian" to listOf("Acerca de Centaurian", "À propos de Centaurian", "Sobre o Centaurian", "Centaurian hakkında", "О Centaurian", "Σχετικά με το Centaurian", "حول Centaurian", "Centaurian के बारे में", "关于 Centaurian", "Centaurianについて", "Centaurian 소개", "Tentang Centaurian", "درباره Centaurian"),
        "General" to listOf("General", "Général", "Geral", "Genel", "Общие", "Γενικά", "عام", "सामान्य", "通用", "一般", "일반", "Umum", "عمومی"),
        "Language" to listOf("Idioma", "Langue", "Idioma", "Dil", "Язык", "Γλώσσα", "اللغة", "भाषा", "语言", "言語", "언어", "Bahasa", "زبان"),
        "Keep screen on" to listOf("Mantener pantalla encendida", "Garder l'écran allumé", "Manter tela ligada", "Ekranı açık tut", "Не гасить экран", "Οθόνη πάντα ενεργή", "إبقاء الشاشة مضاءة", "स्क्रीन चालू रखें", "保持屏幕常亮", "画面をつけたままにする", "화면 켜 두기", "Biarkan layar menyala", "روشن نگه داشتن صفحه"),
        "The display stays on while the app is open" to listOf("La pantalla no se apaga mientras la app está abierta", "L'écran reste allumé tant que l'app est ouverte", "A tela não apaga enquanto o app está aberto", "Uygulama açıkken ekran kapanmaz", "Экран не гаснет, пока приложение открыто", "Η οθόνη δεν σβήνει όσο η εφαρμογή είναι ανοιχτή", "تبقى الشاشة مضاءة أثناء فتح التطبيق", "ऐप खुला होने पर स्क्रीन बंद नहीं होती", "应用打开时屏幕不会熄灭", "アプリを開いている間は画面が消えません", "앱이 열려 있는 동안 화면이 꺼지지 않습니다", "Layar tetap menyala saat aplikasi terbuka", "تا زمانی که برنامه باز است صفحه خاموش نمی‌شود"),
        "Bass reaction in cover" to listOf("Reacción al bajo en la portada", "Réaction aux basses sur la pochette", "Reação ao grave na capa", "Kapakta bas tepkisi", "Реакция обложки на бас", "Αντίδραση στο μπάσο στο εξώφυλλο", "تفاعل الغلاف مع الجهير", "कवर में बास प्रतिक्रिया", "封面低音反应", "カバーのベース反応", "커버 베이스 반응", "Reaksi bass di sampul", "واکنش به بیس در کاور"),
        "Particles react to the music (needs audio permission, records nothing)" to listOf("Las partículas reaccionan a la música (necesita permiso de audio, no graba nada)", "Les particules réagissent à la musique (nécessite l'autorisation audio, n'enregistre rien)", "As partículas reagem à música (precisa de permissão de áudio, não grava nada)", "Parçacıklar müziğe tepki verir (ses izni gerekir, hiçbir şey kaydetmez)", "Частицы реагируют на музыку (нужно разрешение на аудио, ничего не записывается)", "Τα σωματίδια αντιδρούν στη μουσική (χρειάζεται άδεια ήχου, δεν ηχογραφεί τίποτα)", "تتفاعل الجسيمات مع الموسيقى (يتطلب إذن الصوت، لا يسجّل شيئًا)", "कण संगीत पर प्रतिक्रिया देते हैं (ऑडियो अनुमति चाहिए, कुछ रिकॉर्ड नहीं होता)", "粒子随音乐变化（需要音频权限，不会录音）", "パーティクルが音楽に反応します（音声の許可が必要、録音はしません）", "입자가 음악에 반응합니다 (오디오 권한 필요, 녹음하지 않음)", "Partikel bereaksi pada musik (butuh izin audio, tidak merekam apa pun)", "ذرات به موسیقی واکنش نشان می‌دهند (نیاز به مجوز صدا، چیزی ضبط نمی‌شود)"),
        "Check for updates" to listOf("Buscar actualizaciones", "Rechercher des mises à jour", "Verificar atualizações", "Güncellemeleri denetle", "Проверить обновления", "Έλεγχος ενημερώσεων", "التحقق من التحديثات", "अपडेट जाँचें", "检查更新", "アップデートを確認", "업데이트 확인", "Periksa pembaruan", "بررسی به‌روزرسانی"),
        "Checking …" to listOf("Comprobando …", "Vérification …", "Verificando …", "Denetleniyor …", "Проверка …", "Έλεγχος …", "جارٍ التحقق …", "जाँच हो रही है …", "检查中 …", "確認中 …", "확인 중 …", "Memeriksa …", "در حال بررسی …"),
        "You have the latest version" to listOf("Tienes la última versión", "Tu as la dernière version", "Você está na versão mais recente", "En son sürümdesin", "У тебя последняя версия", "Έχεις την τελευταία έκδοση", "لديك أحدث إصدار", "आपके पास नवीनतम संस्करण है", "已是最新版本", "最新バージョンです", "최신 버전입니다", "Kamu memakai versi terbaru", "نسخه شما به‌روز است"),
        "Share app" to listOf("Compartir app", "Partager l'app", "Compartilhar app", "Uygulamayı paylaş", "Поделиться приложением", "Κοινοποίηση εφαρμογής", "مشاركة التطبيق", "ऐप शेयर करें", "分享应用", "アプリを共有", "앱 공유", "Bagikan aplikasi", "اشتراک‌گذاری برنامه"),
        "Send the link to friends" to listOf("Envía el enlace a tus amigos", "Envoie le lien à tes amis", "Envie o link para amigos", "Bağlantıyı arkadaşlarına gönder", "Отправь ссылку друзьям", "Στείλε τον σύνδεσμο σε φίλους", "أرسل الرابط لأصدقائك", "दोस्तों को लिंक भेजें", "把链接发给朋友", "友達にリンクを送る", "친구에게 링크 보내기", "Kirim tautan ke teman", "پیوند را برای دوستان بفرست"),
        "Clear cache" to listOf("Borrar caché", "Vider le cache", "Limpar cache", "Önbelleği temizle", "Очистить кэш", "Εκκαθάριση cache", "مسح ذاكرة التخزين المؤقت", "कैश साफ़ करें", "清除缓存", "キャッシュを消去", "캐시 지우기", "Hapus cache", "پاک کردن حافظه نهان"),
        "Delete saved data of the views" to listOf("Eliminar los datos guardados de las vistas", "Supprimer les données enregistrées des vues", "Excluir dados salvos das telas", "Görünümlerin kayıtlı verilerini sil", "Удалить сохранённые данные экранов", "Διαγραφή αποθηκευμένων δεδομένων των προβολών", "حذف البيانات المحفوظة للعروض", "व्यूज़ का सहेजा गया डेटा हटाएँ", "删除页面的已保存数据", "画面の保存データを削除", "화면의 저장된 데이터 삭제", "Hapus data tersimpan dari tampilan", "حذف داده‌های ذخیره‌شده نماها"),
        "Cleared" to listOf("Borrado", "Supprimé", "Limpo", "Silindi", "Очищено", "Διαγράφηκε", "تم المسح", "साफ़ हो गया", "已清除", "消去しました", "삭제됨", "Terhapus", "پاک شد"),
        "Permissions" to listOf("Permisos", "Autorisations", "Permissões", "İzinler", "Разрешения", "Άδειες", "الأذونات", "अनुमतियाँ", "权限", "権限", "권한", "Izin", "مجوزها"),
        "Location and notifications in Android" to listOf("Ubicación y notificaciones en Android", "Position et notifications dans Android", "Localização e notificações no Android", "Android'de konum ve bildirimler", "Геолокация и уведомления в Android", "Τοποθεσία και ειδοποιήσεις στο Android", "الموقع والإشعارات في Android", "Android में लोकेशन और नोटिफ़िकेशन", "Android 中的位置和通知", "Androidの位置情報と通知", "Android의 위치 및 알림", "Lokasi dan notifikasi di Android", "مکان و اعلان‌ها در Android"),
        "Send feedback" to listOf("Enviar comentarios", "Envoyer un avis", "Enviar feedback", "Geri bildirim gönder", "Отправить отзыв", "Αποστολή σχολίων", "إرسال ملاحظات", "फ़ीडबैक भेजें", "发送反馈", "フィードバックを送る", "의견 보내기", "Kirim masukan", "ارسال بازخورد"),
        "Report a bug or share an idea" to listOf("Informa de un error o comparte una idea", "Signale un bug ou partage une idée", "Relate um erro ou compartilhe uma ideia", "Hata bildir veya fikir paylaş", "Сообщи об ошибке или поделись идеей", "Αναφορά σφάλματος ή κοινοποίηση ιδέας", "بلّغ عن خطأ أو شارك فكرة", "बग बताएँ या आइडिया शेयर करें", "报告问题或分享想法", "不具合の報告やアイデアの共有", "버그 신고 또는 아이디어 공유", "Laporkan bug atau bagikan ide", "اشکال را گزارش کن یا ایده‌ای بفرست"),
        "About the app" to listOf("Acerca de la app", "À propos de l'app", "Sobre o app", "Uygulama hakkında", "О приложении", "Σχετικά με την εφαρμογή", "حول التطبيق", "ऐप के बारे में", "关于本应用", "アプリについて", "앱 정보", "Tentang aplikasi", "درباره برنامه"),
        "What to expect here" to listOf("Qué te espera aquí", "Ce qui t'attend ici", "O que esperar aqui", "Burada seni ne bekliyor", "Что тебя ждёт", "Τι να περιμένεις εδώ", "ما الذي ينتظرك هنا", "यहाँ क्या मिलेगा", "你可以期待什么", "ここでできること", "여기서 만날 수 있는 것", "Apa yang menantimu", "اینجا چه چیزی در انتظار توست"),
        "Contact" to listOf("Contacto", "Contact", "Contato", "İletişim", "Контакты", "Επικοινωνία", "تواصل", "संपर्क", "联系", "連絡先", "연락처", "Kontak", "تماس"),
        "Legal" to listOf("Legal", "Mentions légales", "Legal", "Yasal", "Правовая информация", "Νομικά", "قانوني", "कानूनी", "法律信息", "法的情報", "법적 고지", "Hukum", "حقوقی"),
        "Privacy policy" to listOf("Política de privacidad", "Politique de confidentialité", "Política de privacidade", "Gizlilik politikası", "Политика конфиденциальности", "Πολιτική απορρήτου", "سياسة الخصوصية", "गोपनीयता नीति", "隐私政策", "プライバシーポリシー", "개인정보 처리방침", "Kebijakan privasi", "سیاست حریم خصوصی"),
        "Sources & licenses" to listOf("Fuentes y licencias", "Sources et licences", "Fontes e licenças", "Kaynaklar ve lisanslar", "Источники и лицензии", "Πηγές και άδειες", "المصادر والتراخيص", "स्रोत और लाइसेंस", "来源与许可", "出典とライセンス", "출처 및 라이선스", "Sumber & lisensi", "منابع و مجوزها"),
    )

    private val PRIV: Map<String, List<String>> = mapOf(
        "en" to listOf(
            "Centaurian is a private, non-commercial hobby app. There are no accounts, no ads and no tracking.",
            "CONTENT AND SERVER\nThe app loads its content from centaurianspace.com (hosted by Vercel Inc., USA). The server processes technically necessary data: IP address, date and time, requested address.",
            "MUSIC\nMusic plays through the YouTube player. YouTube (Google) may process data while a song plays.",
            "PERMISSIONS\nLocation is used only for the sky view and only if you allow it. Notifications show the music controls. The audio permission only measures the bass for the cover animation. Nothing is recorded or stored.",
            "ON YOUR DEVICE\nSaved songs and settings stay on your device. You can delete them with Clear cache in Settings.",
            "UPDATES\nWhen you check for updates, the app contacts GitHub, which sees your IP address.",
            "CONTACT\nUse the contact links (Telegram, X) or Send feedback in Settings.",
            "Last updated: 23 October 2026"
        ),
        "de" to listOf(
            "Centaurian ist eine private, nicht-kommerzielle Hobby-App. Es gibt keine Konten, keine Werbung und kein Tracking.",
            "INHALTE UND SERVER\nDie App lädt ihre Inhalte von centaurianspace.com (gehostet bei Vercel Inc., USA). Der Server verarbeitet technisch nötige Daten: IP-Adresse, Datum und Uhrzeit, angeforderte Adresse.",
            "MUSIK\nMusik läuft über den YouTube-Player. YouTube (Google) kann beim Abspielen Daten verarbeiten.",
            "BERECHTIGUNGEN\nDer Standort wird nur für die Sternenhimmel-Ansicht genutzt, und nur wenn du es erlaubst. Benachrichtigungen zeigen die Musiksteuerung. Die Audio-Erlaubnis misst nur den Bass für die Cover-Animation. Es wird nichts aufgenommen oder gespeichert.",
            "AUF DEINEM GERÄT\nGespeicherte Songs und Einstellungen bleiben auf deinem Gerät. Du kannst sie in den Einstellungen mit „Zwischenspeicher leeren“ löschen.",
            "UPDATES\nBeim Suchen nach Updates verbindet sich die App mit GitHub. GitHub sieht dabei deine IP-Adresse.",
            "KONTAKT\nNutze die Kontakt-Links (Telegram, X) oder „Feedback senden“ in den Einstellungen.",
            "Stand: 23. Oktober 2026"
        ),
        "es" to listOf(
            "Centaurian es una app de hobby privada y sin fines comerciales. No hay cuentas, anuncios ni seguimiento.",
            "CONTENIDO Y SERVIDOR\nLa app carga su contenido desde centaurianspace.com (alojado en Vercel Inc., EE. UU.). El servidor procesa datos técnicamente necesarios: dirección IP, fecha y hora, dirección solicitada.",
            "MÚSICA\nLa música se reproduce con el reproductor de YouTube. YouTube (Google) puede procesar datos mientras suena una canción.",
            "PERMISOS\nLa ubicación solo se usa para la vista del cielo y solo si lo permites. Las notificaciones muestran los controles de música. El permiso de audio solo mide los graves para la animación de la portada. No se graba ni se guarda nada.",
            "EN TU DISPOSITIVO\nLas canciones guardadas y los ajustes se quedan en tu dispositivo. Puedes borrarlos con «Borrar caché» en Ajustes.",
            "ACTUALIZACIONES\nAl buscar actualizaciones, la app se conecta a GitHub, que ve tu dirección IP.",
            "CONTACTO\nUsa los enlaces de contacto (Telegram, X) o «Enviar comentarios» en Ajustes.",
            "Última actualización: 23 de octubre de 2026"
        ),
        "fr" to listOf(
            "Centaurian est une app de loisir privée et non commerciale. Il n'y a ni comptes, ni publicités, ni suivi.",
            "CONTENU ET SERVEUR\nL'app charge son contenu depuis centaurianspace.com (hébergé par Vercel Inc., États-Unis). Le serveur traite les données techniquement nécessaires : adresse IP, date et heure, adresse demandée.",
            "MUSIQUE\nLa musique passe par le lecteur YouTube. YouTube (Google) peut traiter des données pendant la lecture.",
            "AUTORISATIONS\nLa position sert uniquement à la vue du ciel, et seulement si tu l'autorises. Les notifications affichent les commandes musicales. L'autorisation audio mesure seulement les basses pour l'animation de la pochette. Rien n'est enregistré ni stocké.",
            "SUR TON APPAREIL\nLes titres enregistrés et les réglages restent sur ton appareil. Tu peux les supprimer avec « Vider le cache » dans les paramètres.",
            "MISES À JOUR\nQuand tu cherches des mises à jour, l'app se connecte à GitHub, qui voit ton adresse IP.",
            "CONTACT\nUtilise les liens de contact (Telegram, X) ou « Envoyer un avis » dans les paramètres.",
            "Dernière mise à jour : 23 octobre 2026"
        ),
        "pt" to listOf(
            "Centaurian é um app de hobby privado e sem fins comerciais. Não há contas, anúncios nem rastreamento.",
            "CONTEÚDO E SERVIDOR\nO app carrega seu conteúdo de centaurianspace.com (hospedado na Vercel Inc., EUA). O servidor processa dados tecnicamente necessários: endereço IP, data e hora, endereço solicitado.",
            "MÚSICA\nA música toca pelo player do YouTube. O YouTube (Google) pode processar dados enquanto uma música toca.",
            "PERMISSÕES\nA localização é usada apenas para a vista do céu e somente se você permitir. As notificações mostram os controles de música. A permissão de áudio só mede os graves para a animação da capa. Nada é gravado ou armazenado.",
            "NO SEU DISPOSITIVO\nMúsicas salvas e configurações ficam no seu dispositivo. Você pode apagá-las com «Limpar cache» nas configurações.",
            "ATUALIZAÇÕES\nAo verificar atualizações, o app se conecta ao GitHub, que vê seu endereço IP.",
            "CONTATO\nUse os links de contato (Telegram, X) ou «Enviar feedback» nas configurações.",
            "Última atualização: 23 de outubro de 2026"
        ),
        "tr" to listOf(
            "Centaurian özel, ticari olmayan bir hobi uygulamasıdır. Hesap, reklam ve takip yoktur.",
            "İÇERİK VE SUNUCU\nUygulama içeriğini centaurianspace.com adresinden yükler (Vercel Inc., ABD tarafından barındırılır). Sunucu teknik olarak gerekli verileri işler: IP adresi, tarih ve saat, istenen adres.",
            "MÜZİK\nMüzik YouTube oynatıcısı üzerinden çalar. Bir şarkı çalarken YouTube (Google) veri işleyebilir.",
            "İZİNLER\nKonum yalnızca gökyüzü görünümü için ve sadece izin verirsen kullanılır. Bildirimler müzik kontrollerini gösterir. Ses izni yalnızca kapak animasyonu için basları ölçer. Hiçbir şey kaydedilmez veya saklanmaz.",
            "CİHAZINDA\nKaydedilen şarkılar ve ayarlar cihazında kalır. Ayarlar'daki «Önbelleği temizle» ile silebilirsin.",
            "GÜNCELLEMELER\nGüncelleme ararken uygulama GitHub'a bağlanır; GitHub IP adresini görür.",
            "İLETİŞİM\nİletişim bağlantılarını (Telegram, X) veya Ayarlar'daki «Geri bildirim gönder» seçeneğini kullan.",
            "Son güncelleme: 23 Ekim 2026"
        ),
        "ru" to listOf(
            "Centaurian — частное некоммерческое хобби-приложение. Здесь нет аккаунтов, рекламы и отслеживания.",
            "КОНТЕНТ И СЕРВЕР\nПриложение загружает контент с centaurianspace.com (хостинг Vercel Inc., США). Сервер обрабатывает технически необходимые данные: IP-адрес, дату и время, запрошенный адрес.",
            "МУЗЫКА\nМузыка воспроизводится через плеер YouTube. YouTube (Google) может обрабатывать данные во время воспроизведения.",
            "РАЗРЕШЕНИЯ\nГеолокация используется только для вида неба и только с твоего разрешения. Уведомления показывают управление музыкой. Разрешение на аудио нужно только для измерения баса в анимации обложки. Ничего не записывается и не сохраняется.",
            "НА ТВОЁМ УСТРОЙСТВЕ\nСохранённые песни и настройки остаются на устройстве. Их можно удалить через «Очистить кэш» в настройках.",
            "ОБНОВЛЕНИЯ\nПри проверке обновлений приложение обращается к GitHub, который видит твой IP-адрес.",
            "КОНТАКТЫ\nИспользуй ссылки для связи (Telegram, X) или «Отправить отзыв» в настройках.",
            "Обновлено: 23 октября 2026"
        ),
        "el" to listOf(
            "Το Centaurian είναι μια ιδιωτική, μη εμπορική εφαρμογή χόμπι. Δεν υπάρχουν λογαριασμοί, διαφημίσεις ή παρακολούθηση.",
            "ΠΕΡΙΕΧΟΜΕΝΟ ΚΑΙ ΔΙΑΚΟΜΙΣΤΗΣ\nΗ εφαρμογή φορτώνει το περιεχόμενό της από το centaurianspace.com (φιλοξενία Vercel Inc., ΗΠΑ). Ο διακομιστής επεξεργάζεται τεχνικά απαραίτητα δεδομένα: διεύθυνση IP, ημερομηνία και ώρα, ζητούμενη διεύθυνση.",
            "ΜΟΥΣΙΚΗ\nΗ μουσική παίζει μέσω του player του YouTube. Το YouTube (Google) μπορεί να επεξεργάζεται δεδομένα κατά την αναπαραγωγή.",
            "ΑΔΕΙΕΣ\nΗ τοποθεσία χρησιμοποιείται μόνο για την προβολή του ουρανού και μόνο αν το επιτρέψεις. Οι ειδοποιήσεις δείχνουν τα χειριστήρια μουσικής. Η άδεια ήχου μετρά μόνο τα μπάσα για το animation του εξωφύλλου. Τίποτα δεν ηχογραφείται ή αποθηκεύεται.",
            "ΣΤΗ ΣΥΣΚΕΥΗ ΣΟΥ\nΤα αποθηκευμένα τραγούδια και οι ρυθμίσεις μένουν στη συσκευή σου. Μπορείς να τα διαγράψεις με «Εκκαθάριση cache» στις ρυθμίσεις.",
            "ΕΝΗΜΕΡΩΣΕΙΣ\nΌταν ελέγχεις για ενημερώσεις, η εφαρμογή συνδέεται στο GitHub, που βλέπει τη διεύθυνση IP σου.",
            "ΕΠΙΚΟΙΝΩΝΙΑ\nΧρησιμοποίησε τους συνδέσμους επικοινωνίας (Telegram, X) ή «Αποστολή σχολίων» στις ρυθμίσεις.",
            "Τελευταία ενημέρωση: 23 Οκτωβρίου 2026"
        ),
        "ar" to listOf(
            "Centaurian تطبيق هواية خاص وغير تجاري. لا توجد حسابات ولا إعلانات ولا تتبّع.",
            "المحتوى والخادم\nيحمّل التطبيق محتواه من centaurianspace.com (مستضاف لدى Vercel Inc.، الولايات المتحدة). يعالج الخادم البيانات اللازمة تقنيًا: عنوان IP والتاريخ والوقت والعنوان المطلوب.",
            "الموسيقى\nتُشغَّل الموسيقى عبر مشغّل YouTube. قد يعالج YouTube (Google) بيانات أثناء تشغيل الأغنية.",
            "الأذونات\nيُستخدم الموقع فقط لعرض السماء وفقط إذا سمحت به. تعرض الإشعارات أدوات التحكم بالموسيقى. إذن الصوت يقيس الجهير فقط لحركة الغلاف. لا يتم تسجيل أي شيء أو تخزينه.",
            "على جهازك\nتبقى الأغاني المحفوظة والإعدادات على جهازك. يمكنك حذفها عبر «مسح ذاكرة التخزين المؤقت» في الإعدادات.",
            "التحديثات\nعند التحقق من التحديثات يتصل التطبيق بـ GitHub الذي يرى عنوان IP الخاص بك.",
            "التواصل\nاستخدم روابط التواصل (Telegram، X) أو «إرسال ملاحظات» في الإعدادات.",
            "آخر تحديث: 23 أكتوبر 2026"
        ),
        "hi" to listOf(
            "Centaurian एक निजी, गैर-व्यावसायिक हॉबी ऐप है। कोई खाते, विज्ञापन या ट्रैकिंग नहीं हैं।",
            "सामग्री और सर्वर\nऐप अपनी सामग्री centaurianspace.com से लोड करता है (Vercel Inc., अमेरिका पर होस्ट)। सर्वर तकनीकी रूप से ज़रूरी डेटा प्रोसेस करता है: IP पता, तारीख और समय, माँगा गया पता।",
            "संगीत\nसंगीत YouTube प्लेयर से चलता है। गाना चलने के दौरान YouTube (Google) डेटा प्रोसेस कर सकता है।",
            "अनुमतियाँ\nलोकेशन सिर्फ़ आकाश दृश्य के लिए और केवल तुम्हारी अनुमति से इस्तेमाल होती है। नोटिफ़िकेशन संगीत नियंत्रण दिखाते हैं। ऑडियो अनुमति सिर्फ़ कवर एनिमेशन के लिए बास मापती है। कुछ भी रिकॉर्ड या सहेजा नहीं जाता।",
            "तुम्हारे डिवाइस पर\nसहेजे गाने और सेटिंग्स तुम्हारे डिवाइस पर रहती हैं। सेटिंग्स में «कैश साफ़ करें» से इन्हें हटा सकते हो।",
            "अपडेट\nअपडेट जाँचते समय ऐप GitHub से जुड़ता है, जो तुम्हारा IP पता देखता है।",
            "संपर्क\nसंपर्क लिंक (Telegram, X) या सेटिंग्स में «फ़ीडबैक भेजें» इस्तेमाल करो।",
            "आख़िरी अपडेट: 23 अक्टूबर 2026"
        ),
        "zh" to listOf(
            "Centaurian 是一款私人、非商业的兴趣应用。没有账号、没有广告、没有追踪。",
            "内容与服务器\n应用从 centaurianspace.com 加载内容（由美国 Vercel Inc. 托管）。服务器会处理技术上必需的数据：IP 地址、日期和时间、请求的地址。",
            "音乐\n音乐通过 YouTube 播放器播放。播放歌曲时，YouTube（Google）可能会处理数据。",
            "权限\n位置信息仅用于星空视图，且仅在你允许时使用。通知用于显示音乐控制。音频权限只用于测量低音以驱动封面动画，不会录制或存储任何内容。",
            "在你的设备上\n已保存的歌曲和设置保存在你的设备上。你可以在设置中通过“清除缓存”删除它们。",
            "更新\n检查更新时，应用会连接 GitHub，GitHub 会看到你的 IP 地址。",
            "联系\n请使用联系链接（Telegram、X）或设置中的“发送反馈”。",
            "最后更新：2026 年 10 月 23 日"
        ),
        "ja" to listOf(
            "Centaurian は個人運営の非営利の趣味アプリです。アカウント、広告、トラッキングはありません。",
            "コンテンツとサーバー\nアプリは centaurianspace.com（米国 Vercel Inc. がホスティング）からコンテンツを読み込みます。サーバーは技術的に必要なデータ（IPアドレス、日時、リクエストされたアドレス）を処理します。",
            "音楽\n音楽は YouTube プレーヤーで再生されます。再生中、YouTube（Google）がデータを処理する場合があります。",
            "権限\n位置情報は星空ビューにのみ、許可した場合だけ使われます。通知は音楽の操作を表示します。音声の権限はカバーのアニメーション用に低音を測るだけで、何も録音・保存しません。",
            "お使いの端末上\n保存した曲と設定は端末に残ります。設定の「キャッシュを消去」で削除できます。",
            "アップデート\nアップデートを確認すると、アプリは GitHub に接続し、GitHub はあなたの IP アドレスを確認します。",
            "連絡先\n連絡先リンク（Telegram、X）または設定の「フィードバックを送る」をご利用ください。",
            "最終更新：2026年10月23日"
        ),
        "ko" to listOf(
            "Centaurian은 개인이 운영하는 비영리 취미 앱입니다. 계정, 광고, 추적이 없습니다.",
            "콘텐츠와 서버\n앱은 centaurianspace.com(미국 Vercel Inc. 호스팅)에서 콘텐츠를 불러옵니다. 서버는 기술적으로 필요한 데이터(IP 주소, 날짜와 시간, 요청한 주소)를 처리합니다.",
            "음악\n음악은 YouTube 플레이어로 재생됩니다. 재생 중 YouTube(Google)가 데이터를 처리할 수 있습니다.",
            "권한\n위치는 별 하늘 보기에만, 허용한 경우에만 사용됩니다. 알림은 음악 컨트롤을 보여줍니다. 오디오 권한은 커버 애니메이션을 위해 베이스만 측정하며, 아무것도 녹음하거나 저장하지 않습니다.",
            "내 기기에서\n저장한 노래와 설정은 기기에 남습니다. 설정의 '캐시 지우기'로 삭제할 수 있습니다.",
            "업데이트\n업데이트를 확인하면 앱이 GitHub에 연결되며, GitHub는 IP 주소를 볼 수 있습니다.",
            "연락처\n연락 링크(Telegram, X) 또는 설정의 '의견 보내기'를 이용하세요.",
            "마지막 업데이트: 2026년 10월 23일"
        ),
        "id" to listOf(
            "Centaurian adalah aplikasi hobi pribadi non-komersial. Tidak ada akun, iklan, atau pelacakan.",
            "KONTEN DAN SERVER\nAplikasi memuat kontennya dari centaurianspace.com (dihosting oleh Vercel Inc., AS). Server memproses data yang diperlukan secara teknis: alamat IP, tanggal dan waktu, alamat yang diminta.",
            "MUSIK\nMusik diputar lewat pemutar YouTube. YouTube (Google) dapat memproses data saat lagu diputar.",
            "IZIN\nLokasi hanya dipakai untuk tampilan langit dan hanya jika kamu mengizinkan. Notifikasi menampilkan kontrol musik. Izin audio hanya mengukur bass untuk animasi sampul. Tidak ada yang direkam atau disimpan.",
            "DI PERANGKATMU\nLagu tersimpan dan pengaturan tetap di perangkatmu. Kamu bisa menghapusnya dengan «Hapus cache» di Pengaturan.",
            "PEMBARUAN\nSaat memeriksa pembaruan, aplikasi terhubung ke GitHub, yang melihat alamat IP-mu.",
            "KONTAK\nGunakan tautan kontak (Telegram, X) atau «Kirim masukan» di Pengaturan.",
            "Terakhir diperbarui: 23 Oktober 2026"
        ),
        "fa" to listOf(
            "Centaurian یک برنامه سرگرمی شخصی و غیرتجاری است. حساب کاربری، تبلیغات و ردیابی وجود ندارد.",
            "محتوا و سرور\nبرنامه محتوای خود را از centaurianspace.com بارگیری می‌کند (میزبانی در Vercel Inc.، آمریکا). سرور داده‌های لازم از نظر فنی را پردازش می‌کند: نشانی IP، تاریخ و زمان، نشانی درخواستی.",
            "موسیقی\nموسیقی از طریق پخش‌کننده YouTube پخش می‌شود. YouTube (Google) ممکن است هنگام پخش آهنگ داده‌ها را پردازش کند.",
            "مجوزها\nمکان فقط برای نمای آسمان و فقط در صورت اجازه شما استفاده می‌شود. اعلان‌ها کنترل‌های موسیقی را نشان می‌دهند. مجوز صدا فقط بیس را برای انیمیشن کاور اندازه می‌گیرد. چیزی ضبط یا ذخیره نمی‌شود.",
            "روی دستگاه شما\nآهنگ‌های ذخیره‌شده و تنظیمات روی دستگاه شما می‌مانند. می‌توانید با «پاک کردن حافظه نهان» در تنظیمات آن‌ها را حذف کنید.",
            "به‌روزرسانی‌ها\nهنگام بررسی به‌روزرسانی، برنامه به GitHub وصل می‌شود و GitHub نشانی IP شما را می‌بیند.",
            "تماس\nاز پیوندهای تماس (Telegram، X) یا «ارسال بازخورد» در تنظیمات استفاده کنید.",
            "آخرین به‌روزرسانی: ۲۳ اکتبر ۲۰۲۶"
        ),
    )

    /** Datenschutzerklaerung der App (nicht der Webseite). */
    fun privacy(lang: String): String = (PRIV[lang] ?: PRIV["en"]!!).let { l -> l.dropLast(1).joinToString("\n\n") + "\n\n" + l.last() }

    fun t(lang: String, en: String): String {
        if (lang == "en" || lang == "de") return en
        val i = ORDER.indexOf(lang)
        val l = M[en] ?: return en
        return if (i in l.indices) l[i] else en
    }
}
