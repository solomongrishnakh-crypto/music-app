import type { Metadata } from "next";

// Eigene Suchmaschinen-Angaben für /imperien (Client-Seite → metadata hier).
export const metadata: Metadata = {
  title: "Imperien",
  description:
    "Große Imperien der Geschichte auf einer Zeitleiste — von der Antike bis heute, mit Jahres-Schieberegler zum Durchspielen.",
  alternates: { canonical: "/imperien" },
  openGraph: { url: "/imperien", title: "Imperien | CENTAURIAN" },
};

export default function ImperienLayout({ children }: { children: React.ReactNode }) {
  return children;
}
