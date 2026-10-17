import ToolsView, { toolsMetadata } from "@/components/reiche/ToolsView";

/** Geschichts-Werkzeuge (Deutsch). Andere Sprachen: /[lang]/imperien/werkzeuge */
export const metadata = toolsMetadata("de");

export default function WerkzeugePage() {
  return <ToolsView lang="de" />;
}
