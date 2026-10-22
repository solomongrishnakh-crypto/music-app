import { ObjectIndexView, objectIndexMetadata } from "@/components/space/ObjectView";

export const metadata = objectIndexMetadata("de");

export default function ObjektePage() {
  return <ObjectIndexView lang="de" />;
}
