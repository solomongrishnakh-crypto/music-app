import ToolsView, { toolsMetadata } from "@/components/space/ToolsView";

/** Weltraum-Rechner (Deutsch). Andere Sprachen: /[lang]/weltraum-rechner */
export const metadata = toolsMetadata("de");

export default function WeltraumRechnerPage() {
  return <ToolsView lang="de" />;
}
