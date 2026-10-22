import PrivacyView, { privacyMetadata } from "@/components/PrivacyView";

export const metadata = privacyMetadata("de");

export default function DatenschutzPage() {
  return <PrivacyView lang="de" urlLang="de" />;
}
