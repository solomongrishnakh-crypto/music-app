"use client";

// Feedback-Box (Nutzerwunsch 17.10.2026): schwebender Button, Formular ohne Anmeldung.
// Texte in allen 15 Sprachen (id/fa selbst uebersetzt, nicht muttersprachlich geprueft).
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage, type Lang } from "@/contexts/LanguageContext";

// Reihenfolge: 0 Button, 1 Titel, 2 Bug, 3 Idee, 4 Sonstiges, 5 Platzhalter,
// 6 E-Mail, 7 Senden, 8 Danke, 9 Fehler, 10 Hinweis, 11 Schliessen, 12 Name
const TXT: Record<Lang, string[]> = {
  de: ["Feedback", "Dein Feedback", "Bug", "Idee", "Sonstiges", "Was klappt nicht oder was wünschst du dir?", "E-Mail (optional, für Rückfragen)", "Senden", "Danke! Dein Feedback ist angekommen.", "Senden fehlgeschlagen. Bitte später erneut versuchen.", "Ohne Anmeldung · wird nur von mir gelesen", "Schließen", "Dein Name"],
  en: ["Feedback", "Your feedback", "Bug", "Idea", "Other", "What isn't working, or what would you like to see?", "Email (optional, for follow-up)", "Send", "Thanks! Your feedback arrived.", "Sending failed. Please try again later.", "No sign-up needed · only I read it", "Close", "Your name"],
  es: ["Opinión", "Tu opinión", "Error", "Idea", "Otro", "¿Qué no funciona o qué te gustaría ver?", "Correo (opcional, para consultas)", "Enviar", "¡Gracias! Tu mensaje llegó.", "Error al enviar. Inténtalo más tarde.", "Sin registro · solo yo lo leo", "Cerrar", "Tu nombre"],
  fr: ["Avis", "Votre avis", "Bug", "Idée", "Autre", "Qu'est-ce qui ne marche pas, ou que souhaitez-vous voir ?", "E-mail (facultatif, pour vous répondre)", "Envoyer", "Merci ! Votre message est bien arrivé.", "Échec de l'envoi. Réessayez plus tard.", "Sans inscription · lu uniquement par moi", "Fermer", "Votre nom"],
  pt: ["Opinião", "Sua opinião", "Bug", "Ideia", "Outro", "O que não funciona ou o que você gostaria de ver?", "E-mail (opcional, para retorno)", "Enviar", "Obrigado! Sua mensagem chegou.", "Falha ao enviar. Tente novamente mais tarde.", "Sem cadastro · só eu leio", "Fechar", "Seu nome"],
  tr: ["Geri bildirim", "Geri bildirimin", "Hata", "Fikir", "Diğer", "Neyin çalışmadığını veya ne görmek istediğini yaz.", "E-posta (isteğe bağlı, geri dönüş için)", "Gönder", "Teşekkürler! Mesajın ulaştı.", "Gönderilemedi. Lütfen daha sonra tekrar dene.", "Üyelik yok · yalnızca ben okurum", "Kapat", "Adın"],
  ru: ["Отзыв", "Ваш отзыв", "Ошибка", "Идея", "Другое", "Что не работает или что бы вы хотели увидеть?", "E-mail (необязательно, для ответа)", "Отправить", "Спасибо! Ваше сообщение получено.", "Не удалось отправить. Попробуйте позже.", "Без регистрации · читаю только я", "Закрыть", "Ваше имя"],
  el: ["Σχόλια", "Τα σχόλιά σου", "Σφάλμα", "Ιδέα", "Άλλο", "Τι δεν λειτουργεί ή τι θα ήθελες να δεις;", "Email (προαιρετικό, για απάντηση)", "Αποστολή", "Ευχαριστούμε! Το μήνυμά σου έφτασε.", "Η αποστολή απέτυχε. Δοκίμασε ξανά αργότερα.", "Χωρίς εγγραφή · το διαβάζω μόνο εγώ", "Κλείσιμο", "Το όνομά σου"],
  ar: ["ملاحظات", "ملاحظاتك", "خطأ", "فكرة", "أخرى", "ما الذي لا يعمل، أو ماذا تتمنى أن ترى؟", "البريد الإلكتروني (اختياري، للرد)", "إرسال", "شكرًا! وصلت رسالتك.", "فشل الإرسال. حاول لاحقًا.", "بدون تسجيل · أقرأه أنا فقط", "إغلاق", "اسمك"],
  hi: ["प्रतिक्रिया", "आपकी प्रतिक्रिया", "बग", "सुझाव", "अन्य", "क्या काम नहीं कर रहा, या आप क्या देखना चाहेंगे?", "ईमेल (वैकल्पिक, जवाब के लिए)", "भेजें", "धन्यवाद! आपका संदेश मिल गया।", "भेजना विफल रहा। बाद में फिर कोशिश करें।", "साइन-अप नहीं · केवल मैं पढ़ता हूँ", "बंद करें", "आपका नाम"],
  zh: ["反馈", "你的反馈", "错误", "建议", "其他", "哪里有问题,或者你希望增加什么?", "邮箱(可选,用于回复)", "发送", "谢谢!已收到你的反馈。", "发送失败,请稍后重试。", "无需注册 · 仅我本人阅读", "关闭", "你的名字"],
  ja: ["ご意見", "ご意見・ご感想", "不具合", "アイデア", "その他", "うまく動かない点や、ほしい機能を教えてください。", "メール(任意・返信用)", "送信", "ありがとうございます!届きました。", "送信に失敗しました。後でもう一度お試しください。", "登録不要・私だけが読みます", "閉じる", "お名前"],
  ko: ["의견", "의견 보내기", "버그", "아이디어", "기타", "작동하지 않는 점이나 원하는 기능을 알려주세요.", "이메일(선택, 답변용)", "보내기", "감사합니다! 의견이 전달되었습니다.", "전송에 실패했습니다. 나중에 다시 시도해 주세요.", "가입 불필요 · 저만 읽습니다", "닫기", "이름"],
  id: ["Masukan", "Masukanmu", "Bug", "Ide", "Lainnya", "Apa yang tidak berfungsi, atau apa yang kamu inginkan?", "Email (opsional, untuk balasan)", "Kirim", "Terima kasih! Masukanmu sudah diterima.", "Gagal mengirim. Coba lagi nanti.", "Tanpa daftar · hanya saya yang membaca", "Tutup", "Namamu"],
  fa: ["بازخورد", "بازخورد شما", "باگ", "ایده", "سایر", "چه چیزی کار نمی‌کند یا چه چیزی می‌خواهید ببینید؟", "ایمیل (اختیاری، برای پاسخ)", "ارسال", "ممنون! پیام شما دریافت شد.", "ارسال ناموفق بود. بعداً دوباره تلاش کنید.", "بدون ثبت‌نام · فقط من می‌خوانم", "بستن", "نام شما"],
};

const TYPES = ["bug", "idea", "other"] as const;

export default function FeedbackBox() {
  const { lang } = useLanguage();
  const pathname = usePathname() || "";
  const tx = TXT[lang] ?? TXT.en;
  const rtl = lang === "ar" || lang === "fa";
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<(typeof TYPES)[number]>("bug");
  const [name, setName] = useState("");
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

  const ready = name.trim().length >= 2 && msg.trim().length >= 5;

  async function send() {
    if (!ready || state === "sending") return;
    setState("sending");
    try {
      const r = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          name,
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
    "w-full rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white placeholder-white/35 outline-none transition focus:border-accent/80 focus:bg-white/10";
  const pos = { bottom: "calc(env(safe-area-inset-bottom, 0px) + 84px)" } as const;
  // Sternenhimmel-Seite: Button links neben dem Menue-Knopf, damit er das Menue nicht verdeckt
  const sky = /\/sternenhimmel\/?$/.test(pathname);
  const posBtn = sky ? ({ bottom: "calc(env(safe-area-inset-bottom, 0px) + 18px)", right: 72 } as const) : pos;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setState("idle");
          setOpen(true);
        }}
        aria-label={tx[0]}
        className="fixed right-3 z-[3100] flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/85 shadow-[0_4px_24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-xl transition hover:border-accent/70 hover:bg-white/15 hover:text-white"
        style={posBtn}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
          <path d="M8.5 11h7M8.5 14h4" />
        </svg>
        <span className="absolute right-0.5 top-0.5 h-2 w-2 animate-pulse rounded-full bg-accent" />
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label={tx[1]}
      dir={rtl ? "rtl" : "ltr"}
      className="fixed right-3 z-[3200] w-[min(270px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-white/20 bg-white/[0.08] text-white shadow-[0_8px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-2xl backdrop-saturate-150"
      style={pos}
    >
      <div className="h-px w-full bg-gradient-to-r from-transparent via-accent to-transparent" />
      <div className="flex items-center justify-between px-3 pt-2.5">
        <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          {tx[1]}
        </span>
        <button type="button" onClick={() => setOpen(false)} aria-label={tx[11]} className="px-1 text-lg leading-none text-white/50 hover:text-white">
          ×
        </button>
      </div>
      {state === "ok" ? (
        <div className="space-y-3 px-3 pb-3 pt-3 text-center">
          <p className="text-xs text-white/90">{tx[8]}</p>
          <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-white/20 px-3 py-1.5 text-xs hover:border-accent/70">
            {tx[11]}
          </button>
        </div>
      ) : (
        <div className="space-y-2 px-3 pb-3 pt-2.5">
          <div className="flex gap-1.5">
            {TYPES.map((k, i) => (
              <button
                key={k}
                type="button"
                onClick={() => setType(k)}
                className={"flex-1 rounded-md border px-1 py-1 text-[11px] transition " + (type === k ? "border-accent bg-accent/20 text-white" : "border-white/10 text-white/60 hover:text-white")}
              >
                {tx[2 + i]}
              </button>
            ))}
          </div>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} placeholder={tx[12] + " *"} autoComplete="name" className={field} />
          <textarea value={msg} onChange={(e) => setMsg(e.target.value)} maxLength={2000} rows={3} placeholder={tx[5]} className={field + " resize-none"} />
          <input type="email" value={mail} onChange={(e) => setMail(e.target.value)} maxLength={120} placeholder={tx[6]} autoComplete="off" className={field} />
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
          {state === "err" && <p className="text-[11px] text-red-400">{tx[9]}</p>}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <span className="text-[10px] leading-tight text-white/40">{tx[10]}</span>
            <button
              type="button"
              onClick={() => void send()}
              disabled={!ready || state === "sending"}
              className="shrink-0 rounded-md bg-accent px-3 py-1.5 text-xs font-bold text-black transition disabled:opacity-35"
            >
              {tx[7]} ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
