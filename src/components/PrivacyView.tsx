import type { Metadata } from "next";
import Link from "next/link";
import { BASE_URL, langPath } from "@/lib/seoI18n";

/** Datenschutzerklärung (Deutsch; in allen anderen Sprachen Englisch). Stand 22.10.2026. */
type PL = "de" | "en";

const TEXT: Record<PL, { title: string; back: string; updated: string; intro: string; sections: [string, string[]][] }> = {
  de: {
    title: "Datenschutzerklärung",
    back: "Zur Startseite",
    updated: "Stand: 22. Oktober 2026",
    intro:
      "Centaurian (centaurianspace.com) ist ein privates, nicht-kommerzielles Hobby-Projekt. Es gibt keine Benutzerkonten, keine Werbung und keine Tracking-Cookies. Hier steht, welche Daten trotzdem anfallen und wofür.",
    sections: [
      ["Verantwortlicher und Kontakt", [
        "Verantwortlich ist der Betreiber der Webseite centaurianspace.com. Du erreichst ihn über die Kontakt-Links auf der Startseite (Telegram, X) oder über das Feedback-Formular. Anfragen zum Datenschutz beantworte ich dort.",
      ]],
      ["Hosting und Server-Logdateien", [
        "Die Seite wird bei Vercel Inc. (USA) gehostet. Beim Aufruf verarbeitet der Server technisch notwendige Daten: IP-Adresse, Datum und Uhrzeit, aufgerufene Adresse, Browser und Betriebssystem. Das ist nötig, um die Seite auszuliefern und vor Missbrauch zu schützen (Art. 6 Abs. 1 lit. f DSGVO). Vercel kann dabei Daten in die USA übermitteln; dafür gelten die Garantien nach Art. 46 DSGVO (z. B. Standardvertragsklauseln). Zur Reichweitenmessung kann Vercel Seitenaufrufe anonymisiert und ohne Cookies zählen.",
      ]],
      ["Feedback-Formular", [
        "Wenn du Feedback sendest, speichere ich: deinen Namen, die Nachricht, optional deine E-Mail-Adresse, die Seite und Sprache, von der du sendest, den Zeitpunkt und die Browser-Kennung. Die Daten liegen in einem privaten, nicht öffentlichen Speicher (Vercel Blob) und dienen nur dazu, dein Anliegen zu bearbeiten (Art. 6 Abs. 1 lit. a und f DSGVO). Du kannst jederzeit die Löschung verlangen.",
      ]],
      ["Speicher im Browser", [
        "Einstellungen wie Sprache, Favoriten oder zuletzt gesehene Objekte werden im lokalen Speicher deines Browsers abgelegt. Sie bleiben auf deinem Gerät und werden nicht an mich gesendet. Du kannst sie jederzeit in den Browser-Einstellungen löschen.",
      ]],
      ["Standort und Sensoren", [
        "Im Sternenhimmel wird dein Standort nur verwendet, wenn du „Mein Standort“ antippst und der Browser es erlaubt. Die Koordinaten werden nur im Browser für die Berechnung genutzt und nicht an mich gesendet. Dasselbe gilt für Kompass und Lagesensor. Bei der Ortssuche geht der eingegebene Suchbegriff an den Dienst Open-Meteo Geocoding.",
      ]],
      ["Externe Dienste", [
        "Je nach Nutzung lädt dein Browser Inhalte direkt von diesen Anbietern; dabei erhalten sie technisch deine IP-Adresse: YouTube (Google) und SoundCloud für Musik und Video-Player, Wikipedia, Wikidata und Wikimedia Commons für Texte und Bilder, NASA und ESO für Fotos, SIMBAD (CDS Straßburg) für Objektdaten, Open-Meteo für die Ortssuche, wheretheiss.at für die Position der ISS, Spaceflight News API und TechCrunch für Nachrichten, Esri/ArcGIS für Kartenkacheln und unpkg für Programmbibliotheken. Für deren Datenverarbeitung gelten die jeweiligen Datenschutzerklärungen. Die YouTube-Suche läuft über meinen Server: dein Suchbegriff wird dabei an Google übermittelt, nicht aber deine IP-Adresse.",
      ]],
      ["Deine Rechte", [
        "Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO). Außerdem kannst du dich bei einer Datenschutz-Aufsichtsbehörde beschweren. Melde dich dafür über die Kontakt-Links oder das Feedback-Formular.",
      ]],
      ["Änderungen", [
        "Wenn sich an der Seite etwas ändert, passe ich diese Erklärung an. Es gilt immer die hier veröffentlichte Fassung.",
      ]],
    ],
  },
  en: {
    title: "Privacy policy",
    back: "Back to home",
    updated: "Last updated: 22 October 2026",
    intro:
      "Centaurian (centaurianspace.com) is a private, non-commercial hobby project. There are no user accounts, no ads and no tracking cookies. This page explains which data is still processed and why.",
    sections: [
      ["Controller and contact", [
        "The controller is the operator of centaurianspace.com. You can reach them through the contact links on the home page (Telegram, X) or through the feedback form. Privacy requests are answered there.",
      ]],
      ["Hosting and server logs", [
        "The site is hosted by Vercel Inc. (USA). When you open a page, the server processes technically necessary data: IP address, date and time, requested address, browser and operating system. This is needed to deliver the site and protect it from abuse (Art. 6(1)(f) GDPR). Vercel may transfer data to the USA; safeguards under Art. 46 GDPR (e.g. standard contractual clauses) apply. Vercel may count page views anonymously and without cookies for traffic statistics.",
      ]],
      ["Feedback form", [
        "If you send feedback, I store your name, your message, optionally your email address, the page and language you sent it from, the time and your browser identifier. The data is kept in private (non-public) storage (Vercel Blob) and is only used to handle your request (Art. 6(1)(a) and (f) GDPR). You can ask for deletion at any time.",
      ]],
      ["Browser storage", [
        "Settings such as language, favourites or recently seen objects are kept in your browser's local storage. They stay on your device and are not sent to me. You can delete them any time in your browser settings.",
      ]],
      ["Location and sensors", [
        "In the night sky your location is only used if you tap “My location” and your browser allows it. The coordinates are used in the browser for the calculation only and are not sent to me. The same applies to compass and motion sensors. When you search for a place, the search term is sent to the Open-Meteo geocoding service.",
      ]],
      ["External services", [
        "Depending on what you use, your browser loads content directly from these providers, which technically receive your IP address: YouTube (Google) and SoundCloud for music and video players, Wikipedia, Wikidata and Wikimedia Commons for texts and images, NASA and ESO for photos, SIMBAD (CDS Strasbourg) for object data, Open-Meteo for place search, wheretheiss.at for the ISS position, Spaceflight News API and TechCrunch for news, Esri/ArcGIS for map tiles and unpkg for code libraries. Their own privacy policies apply. YouTube search runs through my server: your search term is sent to Google, but not your IP address.",
      ]],
      ["Your rights", [
        "You have the right of access, rectification, erasure, restriction of processing, data portability and objection (Art. 15–21 GDPR). You can also lodge a complaint with a data protection supervisory authority. Contact me through the contact links or the feedback form.",
      ]],
      ["Changes", [
        "If something changes on the site, I will update this policy. The version published here always applies.",
      ]],
    ],
  },
};

export function privacyMetadata(lang: PL): Metadata {
  const t = TEXT[lang];
  const path = "/datenschutz";
  return {
    title: { absolute: `${t.title} | CENTAURIAN` },
    description: t.intro,
    alternates: { canonical: langPath(path, lang), languages: { de: langPath(path, "de"), en: langPath(path, "en"), "x-default": langPath(path, "en") } },
    robots: { index: true, follow: true },
  };
}

export default function PrivacyView({ lang, urlLang }: { lang: PL; urlLang: Parameters<typeof langPath>[1] }) {
  const t = TEXT[lang];
  return (
    <main lang={lang} className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6">
      <nav className="label-mono mb-6 text-xs uppercase text-muted">
        <Link href={langPath("/", urlLang)} className="hover:text-accent">{t.back}</Link>
      </nav>
      <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">{t.title}</h1>
      <p className="mt-1 text-xs text-muted">{t.updated} · {BASE_URL.replace("https://", "")}</p>
      <p className="mt-5 leading-relaxed text-foreground/90">{t.intro}</p>
      {t.sections.map(([h, ps]) => (
        <section key={h} className="mt-8">
          <h2 className="font-display text-lg font-bold text-foreground">{h}</h2>
          {ps.map((p, i) => <p key={i} className="mt-2 text-sm leading-relaxed text-foreground/85">{p}</p>)}
        </section>
      ))}
    </main>
  );
}
