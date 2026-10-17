"use client";

// Feedback-Box (Nutzerwunsch 17.10.2026): schwebender Button, Formular ohne Anmeldung.
// Texte in allen 15 Sprachen (id/fa selbst uebersetzt, nicht muttersprachlich geprueft).
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage, type Lang } from "@/contexts/LanguageContext";

// Reihenfolge: 0 Button, 1 Titel, 2 Bug, 3 Idee, 4 Sonstiges, 5 Platzhalter,
// 6 E-Mail, 7 Senden, 8 Danke, 9 Fehler, 10 Hinweis, 11 Schliessen
const TXT: Record<Lang, string[]> = {
  de: ["Feedback", "Dein Feedback", "Bug", "Idee", "Sonstiges", "Was klappt nicht oder was wünschst du dir?", "E-Mail (optional, für Rückfragen)", "Senden", "Danke! Dein Feedback ist angekommen.", "Senden fehlgeschlagen. Bitte später erneut versuchen.", "Ohne Anmeldung · wird nur von mir gelesen", "Schließen"],
  en: ["Feedback", "Your feedback", "Bug", "Idea", "Other", "What isn't working, or what would you like to see?", "Email (optional, for follow-up)", "Send", "Thanks! Your feedback arrived.", "Sending failed. Please try again later.", "No sign-up needed · only I read it", "Close"],
  es: ["Opinión", "Tu opinión", "Error", "Idea", "Otro", "¿Qué no funciona o qué te gustaría ver?", "Correo (opcional, para consultas)", "Enviar", "¡Gracias! Tu mensaje llegó.", "Error al enviar. Inténtalo más tarde.", "Sin registro · solo yo lo leo", "Cerrar"],
  fr: ["Avis", "Votre avis", "Bug", "Idée", "Autre", "Qu'est-ce qui ne marche pas, ou que souhaitez-vous voir ?", "E-mail (facultatif, pour vous répondre)", "Envoyer", "Merci ! Votre message est bien arrivé.", "Échec de l'envoi. Réessayez plus tard.", "Sans inscription · lu uniquement par moi", "Fermer"],
  pt: ["Opinião", "Sua opinião", "Bug", "Ideia", "Outro", "O que não funciona ou o que você gostaria de ver?", "E-mail (opcional, para retorno)", "Enviar", "Obrigado! Sua mensagem chegou.", "Falha ao enviar. Tente novamente mais tarde.", "Sem cadastro · só eu leio", "Fechar"],
  tr: ["Geri bildirim", "Geri bildirimin", "Hata", "Fikir", "Diğer", "Neyin çalışmadığını veya ne görmek istediğini yaz.", "E-posta (isteğe bağlı, geri dönüş için)", "Gönder", "Teşekkürler! Mesajın ulaştı.", "Gönderilemedi. Lütfen daha sonra tekrar dene.", "Üyelik yok · yalnızca ben okurum", "Kapat"],
  ru: ["Отзыв", "Ваш отзыв", "Ошибка", "Идея", "Другое", "Что не работает или что бы вы хотели увидеть?", "E-mail (необязательно, для ответа)", "Отправить", "Спасибо! Ваше сообщение получено.", "Не удалось отправить. Попробуйте позже.", "Без регистрации · читаю только я", "Закрыть"],
  el: ["Σχόλια", "Τα σχόλιά σου", "Σφάλμα", "Ιδέα", "Άλλο", "Τι δεν λειτουργεί ή τι θα ήθελες να δεις;", "Email (προαιρετικό, για απάντηση)", "Αποστολή", "Ευχαριστούμε! Το μήνυμά σου έφτασε.", "Η αποστολή απέτυχε. Δοκίμασε ξανά αργότερα.", "Χωρίς εγγραφή · το διαβάζω μόνο εγώ", "Κλείσιμο"],
  ar: ["ملاحظات", "ملاحظاتك", "خطأ", "فكرة", "أخرى", "ما الذي لا يعمل، أو ماذا تتمنى أن ترى؟", "البريد الإلكتروني (اختياري، للرد)", "إرسال", "شكرًا! وصلت رسالتك.", "فشل الإرسال. حاول لاحقًا.", "بدون تسجيل · أقرأه أنا فقط", "إغلاق"],
  hi: ["प्रतिक्रिया", "आपकी प्रतिक्रिया", "बग", "सुझाव", "अन्य", "क्या काम नहीं कर रहा, या आप क्या देखना चाहेंगे?", "ईमेल (वैकल्पिक, जवाब के लिए)", "भेजें", "धन्यवाद! आपका संदेश मिल गया।", "भेजना विफल रहा। बाद में फिर कोशिश करें।", "साइन-अप नहीं · केवल मैं पढ़ता हूँ", "बंद करें"],
  zh: ["反馈", "你的反馈", "错误", "建议", "其他", "哪里有问题,或者你希望增加什么?", "邮箱(可选,用于回复)", "发送", "谢谢!已收到你的反馈。", "发送失败,请稍后重试。", "无需注册 · 仅我本人阅读", "关闭"],
  ja: ["ご意見", "ご意見・ご感想", "不具合", "アイデア", "その他", "うまく動かない点や、ほしい機能を教えてください。", "メール(任意・返信用)", "送信", "ありがとうございます!届きました。", "送信に失敗しました。後でもう一度お試しください。", "登録不要・私だけが読みます", "閉じる"],
  ko: ["의견", "의견 보내기", "버그", "아이디어", "기타", "작동하지 않는 점이나 원하는 기능을 알려주세요.", "이메일(선택, 답변용)", "보내기", "감사합니다! 의견이 전달되었습니다.", "전송에 실패했습니다. 나중에 다시 시도해 주세요.", "가입 불필요 · 저만 읽습니다", "닫기"],
  id: ["Masukan", "Masukanmu", "Bug", "Ide", "Lainnya", "Apa yang tidak berfungsi, atau apa yang kamu inginkan?", "Email (opsional, untuk balasan)", "Kirim", "Terima kasih! Masukanmu sudah diterima.", "Gagal mengirim. Coba lagi nanti.", "Tanpa daftar · hanya saya yang membaca", "Tutup"],
  fa: ["بازخورد", "بازخورد شما", "باگ", "ایده", "سایر", "چه چیزی کار نمی‌کند یا چه چیزی می‌خواهید ببینید؟", "ایمیل (اختیاری، برای پاسخ)", "ارسال", "ممنون! پیام شما دریافت شد.", "ارسال ناموفق بود. بعداً دوباره تلاش کنید.", "بدون ثبت‌نام · فقط من می‌خوانم", "بستن"],
};

const TYPES = ["bug", "idea", "other"] as const;

export default function FeedbackBox() {
  const { lang } = useLanguage();
  const pathname = usePathname() || "";
  const tx = TXT[lang] ?? TXT.en;
  const rtl = lang === "ar" || lang === "fa";
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<(typeof TYPES)[number]>("bug");
  const [msg, setMsg] = useState("");
  const [mail, setMail] = useState("");
  const [hp, setHp] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const t0 = useRef(0);

  useEffect(() => {
    if (open) t0.current = Date.now();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open]);

  // Nicht in eingebetteten Ansichten und nicht auf der Admin-Seite
  if (pathname.includes("embed") || pathname.startsWith("/admin")) return null;

  async function send() {
    if (msg.trim().length < 5 || state === "sending") return;
    setState("sending");
    try {
      const r = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          message: msg,
          email: mail,
          page: window.location.pathname,
          lang,
          hp,
          t: Date.now() - t0.current,
        }),
      });
      if (r.ok) {
        setState("ok");
        setMsg("");
        setMail("");
      } else {
        setState("err");
      }
    } catch {
      setState("err");
    }
  }

  const field =
    "w-full rounded-lg border border-white/15 bg-black/60 px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-accent/70";

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setState("idle");
          setOpen(true);
        }}
        aria-label={tx[0]}
        className="fixed left-3 z-40 rounded-full border border-white/20 bg-black/70 px-3 py-2 text-xs text-white/80 backdrop-blur transition hover:border-accent/70 hover:text-white"
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 84px)" }}
      >
        {"💬 " + tx[0]}
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-3 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={tx[1]}
            dir={rtl ? "rtl" : "ltr"}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-white/15 bg-[#07070f]/95 p-4 text-white shadow-2xl backdrop-blur"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold">{tx[1]}</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label={tx[11]} className="px-2 text-xl leading-none text-white/60 hover:text-white">
                ×
              </button>
            </div>
            {state === "ok" ? (
              <div className="space-y-4 py-4 text-center">
                <p className="text-sm">{tx[8]}</p>
                <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:border-accent/70">
                  {tx[11]}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">
                  {TYPES.map((k, i) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setType(k)}
                      className={"flex-1 rounded-lg border px-2 py-1.5 text-xs " + (type === k ? "border-accent bg-accent/20 text-white" : "border-white/15 text-white/70")}
                    >
                      {tx[2 + i]}
                    </button>
                  ))}
                </div>
                <textarea
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  maxLength={2000}
                  rows={5}
                  placeholder={tx[5]}
                  className={field + " resize-none"}
                />
                <input
                  type="email"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                  maxLength={120}
                  placeholder={tx[6]}
                  autoComplete="off"
                  className={field}
                />
                {/* Honeypot: fuer Menschen unsichtbar, Bots fuellen es aus */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                />
                {state === "err" && <p className="text-xs text-red-400">{tx[9]}</p>}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] text-white/45">{tx[10]}</span>
                  <button
                    type="button"
                    onClick={() => void send()}
                    disabled={msg.trim().length < 5 || state === "sending"}
                    className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-black disabled:opacity-40"
                  >
                    {tx[7]}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
