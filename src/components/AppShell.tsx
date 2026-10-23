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

export default function AppShell() {
  const { lang, setLang, localePath } = useLanguage();
  const pathname = usePathname();
  const [app, setApp] = useState(false);
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const on = detectApp();
    setApp(on);
    document.documentElement.toggleAttribute("data-app", on);
  }, []);

  const close = useCallback(() => { setOpen(false); setLangOpen(false); }, []);

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
          <button type="button" className="app-d-lang" onClick={() => setLangOpen((o) => !o)} tabIndex={open ? 0 : -1}>
            <span>{cur.flag} {cur.name}</span><span>{langOpen ? "−" : "+"}</span>
          </button>
          {langOpen && (
            <div className="app-langs">
              {LANGUAGES.map((l) => (
                <button key={l.code} type="button" className={l.code === lang ? "on" : ""}
                  onClick={() => { setLang(l.code as Lang); close(); }}>
                  {l.flag} {l.name}
                </button>
              ))}
            </div>
          )}
          <Link href={localePath("/datenschutz")} className="app-d-priv" onClick={close} tabIndex={open ? 0 : -1}>
            {lang === "de" ? "Datenschutz" : "Privacy"}
          </Link>
        </div>
      </nav>
    </>
  );
}
