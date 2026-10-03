"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import { useLanguage } from "@/contexts/LanguageContext";

const CONTACTS = [
  {
    label: "Telegram",
    handle: "@Perseus641",
    href: "https://t.me/Perseus641",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21.05 3.5 2.85 10.6c-1.24.5-1.23 1.19-.23 1.5l4.66 1.45 1.8 5.5c.22.6.37.85.8.85.35 0 .5-.16.71-.36l1.72-1.65 4.75 3.5c.87.48 1.5.23 1.72-.8L21.98 4.7c.32-1.28-.49-1.84-1.93-1.2ZM7.9 13.9l9.2-5.8c.44-.27.84-.12.51.18l-7.8 7.05-.3 3.2-1.6-4.63Z" />
      </svg>
    ),
  },
  {
    label: "X",
    handle: "@capone_835",
    href: "https://x.com/capone_835",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.6 10.6 21 2h-2l-6.4 7.4L7.6 2H2l7.7 11.2L2 22h2l6.8-7.9L16.4 22H22l-8.4-11.4Zm-2.4 2.8-.8-1.1L4.2 3.5h2.6l5 7.2.8 1.1 6.6 9.5h-2.6l-5.4-7.9Z" />
      </svg>
    ),
  },
];

/**
 * Abschließender Kontakt-Bereich ganz unten auf der Seite — Logo plus
 * sichtbarer Name/Handle, öffnet Telegram bzw. X in einem neuen Tab.
 * 28.09.2026: vorher nur Logos ohne Text → Suchmaschinen und KI-Suchen
 * fanden keine Kontaktdaten. Jetzt steht der Handle als echter Text da.
 */
export default function ContactSection() {
  const { t } = useLanguage();
  return (
    <footer className="mx-auto mb-4 mt-16 w-full max-w-5xl sm:mt-24">
      <SectionHeading index="04" label={t("contactsLabel")} />
      {/* Nutzerwunsch 03.10.2026: Kontakte futuristischer — Kacheln mit
          Sechseck-Symbol, Status-Punkt und Scan-Licht beim Antippen */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
        {CONTACTS.map((contact) => (
          <a
            key={contact.label}
            href={contact.href}
            target="_blank"
            rel="noopener noreferrer me"
            title={contact.label + " " + contact.handle}
            className="hud-card contact-card group relative flex items-center gap-3.5 overflow-hidden p-3 pr-4"
          >
            <span className="contact-ico">
              <span className="h-5 w-5">{contact.icon}</span>
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="label-mono flex items-center gap-1.5 text-[10px] text-accent">
                <span className="contact-dot" aria-hidden="true" />
                {contact.label}
              </span>
              <span className="truncate text-sm font-semibold text-foreground">{contact.handle}</span>
            </span>
            <span className="feat-go ml-auto" aria-hidden="true">↗</span>
            <span className="contact-scan" aria-hidden="true" />
          </a>
        ))}
      </div>

      {/* Fußzeile: Info + Copyright (Nutzerwunsch 02.10.2026 "richtig sortieren" —
          vorher schwebten diese Texte fest in den Bildschirmecken) */}
      <div className="hud-card mt-6 flex flex-col gap-4 p-4 text-xs sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-md">
          <p className="label-mono mb-1 uppercase">{t("infoLabel")}</p>
          <p className="text-muted">{t("infoText")}</p>
        </div>
        <div className="sm:text-right">
          <p className="label-mono uppercase">{t("copyrightLabel")} {new Date().getFullYear()}</p>
          <p className="text-muted">Centaurian.</p>
        </div>
      </div>
    </footer>
  );
}
