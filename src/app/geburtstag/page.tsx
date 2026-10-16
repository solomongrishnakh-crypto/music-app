import BirthdayView, { birthdayMetadata } from "@/components/space/BirthdayView";

/** Dein Geburtstag im Universum (Deutsch). Andere Sprachen: /[lang]/geburtstag */
export const metadata = birthdayMetadata("de");

export default function GeburtstagPage() {
  return <BirthdayView lang="de" />;
}
