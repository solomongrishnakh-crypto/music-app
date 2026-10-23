import AppView, { appMetadata } from "@/components/AppView";

export const metadata = appMetadata("de");

export default function AppPage() {
  return <AppView lang="de" />;
}
