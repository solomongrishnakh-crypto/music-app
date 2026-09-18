"use client";

import { useState } from "react";
import DetailModal from "@/components/ui/DetailModal";
import { useInView } from "@/hooks/useInView";
import Typewriter from "@/components/ui/Typewriter";

const CONSCIOUSNESS_PARAGRAPHS: string[] = [
  "Bewusstsein ist die Fähigkeit, überhaupt eine subjektive Erfahrung zu haben — dass es sich 'irgendwie anfühlt', man selbst zu sein. Philosophen nennen das die 'Qualia': das Rot eines Sonnenuntergangs, der Schmerz eines Schnitts, der Geschmack von Kaffee. Diese Erfahrung lässt sich von außen messen (Hirnaktivität, Verhalten), aber die Erfahrung selbst bleibt streng privat.",
  "Der Philosoph David Chalmers unterscheidet das 'leichte Problem' des Bewusstseins (wie verarbeitet das Gehirn Reize, steuert Aufmerksamkeit, erzeugt Verhalten?) vom 'harten Problem': warum geht mit all dieser Informationsverarbeitung überhaupt ein subjektives Erleben einher — und nicht einfach nur unbewusste, 'dunkle' Verarbeitung wie bei einem Computer? Bis heute gibt es keine allgemein akzeptierte Antwort darauf.",
  "Die Neurowissenschaft sucht nach den 'neuronalen Korrelaten des Bewusstseins' — den minimalen Hirnprozessen, die für eine bestimmte bewusste Erfahrung notwendig sind. Wichtige Kandidaten sind Aktivität im Thalamus und Kortex, insbesondere weiträumige, synchronisierte Feuermuster zwischen verschiedenen Hirnregionen, die als 'Bindung' unterschiedlicher Sinneseindrücke zu einem einheitlichen Erleben gedeutet werden.",
  "Die 'Global Workspace Theory' (Bernard Baars, weiterentwickelt von Stanislas Dehaene) beschreibt Bewusstsein als eine Art internes Rundfunksystem: Viele Hirnprozesse laufen parallel und unbewusst ab, aber sobald Information in einen zentralen 'globalen Arbeitsbereich' gelangt, wird sie weiträumig im Gehirn verfügbar gemacht — das erleben wir als bewussten Gedanken.",
  "Die 'Integrated Information Theory' (Giulio Tononi) verfolgt einen anderen Ansatz: Bewusstsein entsteht demnach aus der Menge an integrierter, nicht auf Einzelteile reduzierbarer Information (bezeichnet als Phi), die ein System erzeugt. Je mehr ein System als vernetztes Ganzes 'mehr ist als die Summe seiner Teile', desto höher sein postulierter Bewusstseinsgrad — eine Idee, die theoretisch auch einfachen Systemen ein gewisses Maß an Erleben zuschreiben würde.",
  "Bewusstsein ist zudem kein Alles-oder-Nichts-Zustand: Tiefschlaf, Traumschlaf, Narkose, Meditation, psychedelische Zustände und Nahtoderfahrungen zeigen ein ganzes Spektrum veränderter Bewusstseinszustände — mit messbar unterschiedlichen Mustern an Hirnaktivität und -konnektivität, die Forscher zunehmend zur Unterscheidung nutzen (etwa mittels EEG-basierter 'Bewusstseins-Indizes' bei Koma-Patienten).",
  "Ein besonders kontrovers diskutiertes Thema ist maschinelles bzw. künstliches Bewusstsein: Selbst hochentwickelte KI-Systeme verarbeiten Information, ohne dass es dafür einen wissenschaftlichen Konsens gibt, ob damit auch nur ansatzweise subjektives Erleben verbunden ist. Die meisten Forscher gehen aktuell davon aus, dass reine Informationsverarbeitung allein nicht automatisch Bewusstsein erzeugt — sicher beweisen oder widerlegen kann das aber bislang niemand.",
  "Am Rand der Theorie steht der Panpsychismus: die Idee, dass Bewusstsein (in sehr rudimentärer Form) eine fundamentale Eigenschaft der Materie selbst sein könnte, ähnlich wie Masse oder Ladung — anstatt erst ab einer bestimmten Komplexität 'emergent' zu entstehen. Die Mehrheit der Wissenschaft steht dem skeptisch gegenüber, doch ernstzunehmende Philosophen und Physiker diskutieren die Idee weiterhin ernsthaft, gerade weil das harte Problem sonst ungelöst bleibt.",
  "Unterm Strich: Bewusstsein ist eines der letzten großen ungelösten Rätsel der Wissenschaft — irgendwo zwischen Neurobiologie, Physik und Philosophie. Wir wissen erstaunlich viel darüber, welche Hirnprozesse mit welchen Erfahrungen einhergehen, aber so gut wie nichts darüber, warum aus Elektrochemie überhaupt Erleben wird.",
];

/**
 * Einzelne, große Zeile ganz unten auf der Seite — bewusst anders als die
 * Karten-Grids darüber, um als eigener, abschließender Abschnitt zu wirken.
 * Klick öffnet die ausführliche Erklärung im DetailModal.
 */
export default function ConsciousnessSection() {
  const [open, setOpen] = useState(false);
  const { ref, inView } = useInView<HTMLButtonElement>();

  return (
    <div className="mx-auto mb-20 mt-20 w-full max-w-5xl sm:mt-28">
      <div className="mb-10 border-b border-border pb-4">
        <p className="label-mono text-xs uppercase">// Bewusstsein</p>
      </div>

      <button
        ref={ref}
        onClick={() => setOpen(true)}
        className="glass-card group flex w-full flex-col items-stretch overflow-hidden text-left transition-colors sm:flex-row"
      >
        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden sm:aspect-square sm:w-64">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/branding/consciousness.png"
            alt="Zwei Gestalten aus leuchtenden neuronalen Netzwerken berühren sich mit dem Finger"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col justify-center p-6 sm:p-10">
          <p className="font-display min-h-[1.75em] text-lg font-bold text-accent sm:text-2xl">
            <Typewriter text="Wie entsteht Bewusstsein?" active={inView} speed={14} />
          </p>
          <p className="mt-3 max-w-xl text-xs leading-relaxed text-muted sm:text-sm">
            Vom harten Problem des Bewusstseins über neuronale Korrelate bis zu
            Global Workspace Theory, Integrated Information Theory und
            künstlichem Bewusstsein — ein Überblick über eines der letzten
            großen ungelösten Rätsel der Wissenschaft.
          </p>
          <p className="label-mono mt-4 text-[10px] uppercase opacity-0 transition-opacity group-hover:opacity-100">
            // mehr erfahren
          </p>
        </div>
      </button>

      {open && (
        <DetailModal
          eyebrow="// Bewusstsein"
          title="Wie entsteht Bewusstsein?"
          paragraphs={CONSCIOUSNESS_PARAGRAPHS}
          imageUrl="/branding/consciousness.png"
          imageAlt="Zwei Gestalten aus leuchtenden neuronalen Netzwerken berühren sich mit dem Finger"
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
