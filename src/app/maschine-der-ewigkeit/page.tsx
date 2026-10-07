import MachineView, { machineMetadata } from "@/components/space/MachineView";

/** Maschine der Ewigkeit (Deutsch). Andere Sprachen: /[lang]/maschine-der-ewigkeit */
export const metadata = machineMetadata("de");

export default function MaschinePage() {
  return <MachineView lang="de" />;
}
