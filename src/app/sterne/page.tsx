import { StarIndexView, starIndexMetadata } from "@/components/space/StarView";

export const metadata = starIndexMetadata("de");

export default function SternePage() {
  return <StarIndexView lang="de" />;
}
