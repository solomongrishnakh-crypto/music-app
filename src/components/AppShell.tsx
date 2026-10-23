"use client";

import Link from "next/link";
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

const ITEMS: { path: string; de: string; en: string }[] = [
  { path: "/", de: "Start", en: "Home" },
  { path: "/universum", de: "Universum", en: "Universe" },
  { path: "/sternenhimmel", de: "Sternenhimmel live", en: "Live sky" },
  { path: "/sonnensystem", de: "Sonnensystem", en: "Solar system" },
  { path: "/imperien", de: "Weltgeschichte & Imperien", en: "World history & empires" },
  { path: "/sternbilder", de: "Sternbilder", en: "Constellations" },
  { path: "/himmel-heute", de: "Himmel heute", en: "Sky today" },
  { path: "/groessenvergleich", de: "Größenvergleich", en: "Size comparison" },
  { path: "/weltraum-rechner", de: "Weltraum-Rechner", en: "Space calculator" },
  { path: "/reisezeit", de: "Reisezeit", en: "Travel time" },
  { path: "/geburtstag", de: "Geburtstag im All", en: "Birthday in space" },
  { path: "/maschine-der-ewigkeit", de: "Maschine der Ewigkeit", en: "Machine of eternity" },
  { path: "/datenschutz", de: "Datenschutz", en: "Privacy" },
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
  const [app, setApp] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = detectApp();
    setApp(on);
    document.documentElement.toggleAttribute("data-app", on);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!app) return null;
  const label = (it: (typeof ITEMS)[number]) => (lang === "de" ? it.de : it.en);

  return (
    <>
      <header className="app-bar">
        <button type="button" className="app-burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span /><span /><span />
        </button>
        <Link href={localePath("/")} className="app-title" onClick={close}>CENTAURIAN</Link>
        <span className="app-bar-spacer" />
      </header>

      {open && <div className="app-scrim" onClick={close} />}
      <nav className={`app-drawer${open ? " app-drawer-open" : ""}`} aria-hidden={!open}>
        <ul>
          {ITEMS.map((it) => (
            <li key={it.path}>
              <Link href={localePath(it.path)} onClick={close} tabIndex={open ? 0 : -1}>
                {label(it)}
              </Link>
            </li>
          ))}
        </ul>
        <div className="app-langs">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              className={l.code === lang ? "on" : ""}
              onClick={() => { setLang(l.code as Lang); close(); }}
              tabIndex={open ? 0 : -1}
            >
              {l.flag} {l.name}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
