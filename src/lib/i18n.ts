/**
 * Sprach-Infrastruktur für lange, individuelle Inhalte (Planetenbeschrei-
 * bungen, Universum-Fakten) — getrennt von den kurzen UI-Textbausteinen in
 * translations.ts. Aktuell sind Deutsch und Englisch vollständig gepflegt;
 * die übrigen 11 Sprachen fallen bis zur weiteren Übersetzung automatisch
 * auf Englisch zurück (nie auf einen rohen Schlüssel oder Leerstring).
 */
import type { Lang } from "@/contexts/LanguageContext";

/** Ein Text, der je Sprache hinterlegt sein kann — "de" ist Pflicht. */
export type LocalizedText = Partial<Record<Lang, string>> & { de: string };

export function localize(text: LocalizedText, lang: Lang): string {
  return text[lang] ?? text.en ?? text.de;
}
