"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { LANGUAGES, useLanguage, type Lang } from "@/contexts/LanguageContext";

/**
 * App-Modus (Nutzerwunsch 23.10.2026: "echte App ... simpel, drei Striche
 * (Menü), aufgeräumter als die Webseite, Design gleich").
 *
 * Aktiv nur in der installierten App (display-mode: standalone / Android-
 * App-Referrer) oder wenn die Adresse mit ?app=1 geöffnet wurde (zum
 * Testen im Handy-Browser; wird gemerkt, ?app=0 schaltet aus). Auf der
 * normalen Webseite bleibt alles wie es ist.
 */
const KEY = "cn_app_mode";

const GROUPS: { title: { de: string; en: string }; items: { path: string; de: string; en: string }[] }[] = [
  {
    title: { de: "Entdecken", en: "Explore" },
    items: [
      { path: "/universum", de: "Universum", en: "Universe" },
      { path: "/sternenhimmel", de: "Sternenhimmel", en: "Live sky" },
      { path: "/sonnensystem", de: "Sonnensystem", en: "Solar system" },
      { path: "/imperien", de: "Weltgeschichte", en: "World history" },
      { path: "/sternbilder", de: "Sternbilder", en: "Constellations" },
      { path: "/himmel-heute", de: "Himmel heute", en: "Sky today" },
    ],
  },
  {
    title: { de: "Werkzeuge", en: "Tools" },
    items: [
      { path: "/groessenvergleich", de: "Größenvergleich", en: "Size comparison" },
      { path: "/weltraum-rechner", de: "Rechner", en: "Calculator" },
      { path: "/reisezeit", de: "Reisezeit", en: "Travel time" },
      { path: "/geburtstag", de: "Geburtstag", en: "Birthday" },
      { path: "/maschine-der-ewigkeit", de: "Maschine der Ewigkeit", en: "Machine of eternity" },
    ],
  },
];

function detectApp(): boolean {
  try {
    const q = new URLSearchParams(window.location.search).get("app");
    if (q === "1") {
      localStorage.setItem(KEY, "1");
      return true;
    }
    if (q === "0") {
      localStorage.removeItem(KEY);
      return false;
    }
    if (localStorage.getItem(KEY) === "1") return true;
  } catch {
    // Speicher nicht verfügbar — dann nur die Erkennung unten
  }
  try {
    if (window.matchMedia("(display-mode: standalone)").matches) return true;
    if (document.referrer.startsWith("android-app://")) return true;
  } catch {
    // ignorieren
  }
  return false;
}

const TX = {
  settings: { de: "Einstellungen", en: "Settings" },
  language: { de: "Sprache", en: "Language" },
  feedback: { de: "Feedback", en: "Feedback" },
  feedbackBtn: { de: "Feedback senden", en: "Send feedback" },
  feedbackSub: { de: "Fehler melden oder Ideen schicken", en: "Report a bug or share an idea" },
  about: { de: "Über Centaurian", en: "About Centaurian" },
  contact: { de: "Kontakt", en: "Contact" },
  legal: { de: "Rechtliches", en: "Legal" },
  privacy: { de: "Datenschutzerklärung", en: "Privacy policy" },
  sources: { de: "Quellen & Lizenzen", en: "Sources & licenses" },
  sourcesNote: {
    de: "Alle Daten stammen aus offenen, öffentlich dokumentierten Quellen:",
    en: "All data comes from open, publicly documented sources:",
  },
  app: { de: "App", en: "App" },
  share: { de: "App teilen", en: "Share app" },
  shareSub: { de: "Link an Freunde schicken", en: "Send the link to friends" },
  clear: { de: "Zwischenspeicher leeren", en: "Clear cache" },
  clearSub: { de: "Gespeicherte Namen und Einstellungen löschen", en: "Delete saved names and settings" },
  clearDone: { de: "Gelöscht – App lädt neu …", en: "Cleared – reloading …" },
  version: { de: "Version", en: "Version" },
  back: { de: "Zurück", en: "Back" },
  copied: { de: "Link kopiert", en: "Link copied" },
};
const SOURCES = [
  ["Cliopatria (Seshat Global History Databank)", "CC BY 4.0"],
  ["Historical Basemaps (A. Ourednik)", "GPL-3.0"],
  ["Esri World Imagery", "Map tiles"],
  ["NASA JPL Horizons", "Positions"],
  ["NASA Exoplanet Archive", "Exoplanets"],
  ["Wikipedia & Wikimedia Commons", "CC BY-SA"],
];
const APP_VERSION = "1.0";

export default function AppShell() {
  const { lang, setLang, localePath, t } = useLanguage();
  const pathname = usePathname();
  const [app, setApp] = useState(false);
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [panel, setPanel] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const on = detectApp();
    setApp(on);
    document.documentElement.toggleAttribute("data-app", on);
  }, []);

  const close = useCallback(() => { setOpen(false); setLangOpen(false); }, []);

  const openSettings = useCallback(() => {
    setOpen(false);
    setPanel(true);
    try { window.history.pushState({ cnSettings: 1 }, ""); } catch { /* ignorieren */ }
  }, []);
  const closeSettings = useCallback(() => {
    setPanel(false);
    setLangOpen(false);
    try { if (window.history.state && window.history.state.cnSettings) window.history.back(); } catch { /* ignorieren */ }
  }, []);
  useEffect(() => {
    const onPop = () => { setPanel(false); setLangOpen(false); };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const note = (m: string) => { setToast(m); window.setTimeout(() => setToast(""), 2200); };
  const share = async () => {
    const url = "https://centaurianspace.com";
    try {
      if (navigator.share) { await navigator.share({ title: "Centaurian", url }); return; }
      await navigator.clipboard.writeText(url);
      note(L(TX.copied));
    } catch { /* abgebrochen */ }
  };
  const clearCache = () => {
    try {
      Object.keys(localStorage).filter((k) => k.startsWith("cn_names_")).forEach((k) => localStorage.removeItem(k));
    } catch { /* ignorieren */ }
    note(L(TX.clearDone));
    window.setTimeout(() => window.location.reload(), 900);
  };
  const openFeedback = () => {
    setPanel(false);
    try { if (window.history.state && window.history.state.cnSettings) window.history.back(); } catch { /* ignorieren */ }
    window.setTimeout(() => window.postMessage({ centaurianFeedback: true }, window.location.origin), 120);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!app) return null;
  const L = (o: { de: string; en: string }) => (lang === "de" ? o.de : o.en);
  const cur = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];
  let n = 0;

  return (
    <>
      <button type="button" className="app-fab" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span /><span /><span />
      </button>

      {open && <div className="app-scrim" onClick={close} />}
      <nav className={`app-drawer${open ? " app-drawer-open" : ""}`} aria-hidden={!open}>
        <div className="app-d-head">
          <Link href={localePath("/")} className="app-d-brand" onClick={close} tabIndex={open ? 0 : -1}>CENTAURIAN</Link>
          <button type="button" className="app-d-close" aria-label="Close" onClick={close} tabIndex={open ? 0 : -1}>×</button>
        </div>
        {GROUPS.map((g) => (
          <div key={g.title.en} className="app-d-group">
            <p className="app-d-title">{L(g.title)}</p>
            {g.items.map((it) => {
              n += 1;
              const href = localePath(it.path);
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link key={it.path} href={href} onClick={close} tabIndex={open ? 0 : -1} className={`app-d-item${active ? " on" : ""}`}>
                  <span className="app-d-n">{String(n).padStart(2, "0")}</span>
                  <span className="app-d-l">{L(it)}</span>
                </Link>
              );
            })}
          </div>
        ))}
        <div className="app-d-foot">
          <button type="button" className="app-d-set" onClick={openSettings} tabIndex={open ? 0 : -1}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <circle cx="12" cy="12" r="3.2" />
              <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7" />
            </svg>
            <span>{L(TX.settings)}</span>
            <span className="app-d-chev">›</span>
          </button>
        </div>
      </nav>

      {panel && (
        <section className="app-set" role="dialog" aria-label={L(TX.settings)}>
          <div className="app-set-head">
            <button type="button" className="app-set-back" onClick={closeSettings}>‹ {L(TX.back)}</button>
            <h2>{L(TX.settings)}</h2>
          </div>
          <div className="app-set-body">
            <p className="app-set-t">{L(TX.language)}</p>
            <div className="app-set-card">
              <button type="button" className="app-set-row" onClick={() => setLangOpen((o) => !o)}>
                <span>{cur.flag} {cur.name}</span><span className="app-d-chev">{langOpen ? "−" : "+"}</span>
              </button>
              {langOpen && (
                <div className="app-langs">
                  {LANGUAGES.map((l) => (
                    <button key={l.code} type="button" className={l.code === lang ? "on" : ""}
                      onClick={() => { setLang(l.code as Lang); setLangOpen(false); }}>
                      {l.flag} {l.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <p className="app-set-t">{L(TX.feedback)}</p>
            <div className="app-set-card">
              <button type="button" className="app-set-row app-set-two" onClick={openFeedback}>
                <span><b>{L(TX.feedbackBtn)}</b><i>{L(TX.feedbackSub)}</i></span><span className="app-d-chev">›</span>
              </button>
            </div>

            <p className="app-set-t">{L(TX.about)}</p>
            <div className="app-set-card app-set-text">
              <p>{t("aboutLead")}</p>
              <ul>
                {(["aboutF1", "aboutF2", "aboutF3", "aboutF4"] as const).map((k) => {
                  const [head, ...rest] = t(k).split(" — ");
                  return <li key={k}><b>{head}</b>{rest.length ? " — " + rest.join(" — ") : ""}</li>;
                })}
              </ul>
            </div>

            <p className="app-set-t">{L(TX.contact)}</p>
            <div className="app-set-card">
              <a className="app-set-row" href="https://t.me/Perseus641" target="_blank" rel="noopener noreferrer me"><span>Telegram</span><span className="app-d-chev">↗</span></a>
              <a className="app-set-row" href="https://x.com/capone_835" target="_blank" rel="noopener noreferrer me"><span>X</span><span className="app-d-chev">↗</span></a>
            </div>

            <p className="app-set-t">{L(TX.legal)}</p>
            <div className="app-set-card">
              <Link className="app-set-row" href={localePath("/datenschutz")} onClick={() => { setPanel(false); }}>
                <span>{L(TX.privacy)}</span><span className="app-d-chev">›</span>
              </Link>
              <p className="app-set-note">{t("aboutLegal")}</p>
            </div>

            <p className="app-set-t">{L(TX.sources)}</p>
            <div className="app-set-card app-set-text">
              <p>{L(TX.sourcesNote)}</p>
              <ul>
                {SOURCES.map(([n, l]) => <li key={n}><b>{n}</b> — {l}</li>)}
              </ul>
            </div>

            <p className="app-set-t">{L(TX.app)}</p>
            <div className="app-set-card">
              <button type="button" className="app-set-row app-set-two" onClick={share}>
                <span><b>{L(TX.share)}</b><i>{L(TX.shareSub)}</i></span><span className="app-d-chev">↗</span>
              </button>
              <button type="button" className="app-set-row app-set-two" onClick={clearCache}>
                <span><b>{L(TX.clear)}</b><i>{L(TX.clearSub)}</i></span><span className="app-d-chev">›</span>
              </button>
              <div className="app-set-row"><span>{L(TX.version)}</span><span className="app-set-ver">{APP_VERSION}</span></div>
            </div>
            <p className="app-set-foot">CENTAURIAN · centaurianspace.com</p>
          </div>
        </section>
      )}
      {toast && <div className="app-toast">{toast}</div>}
    </>
  );
}
