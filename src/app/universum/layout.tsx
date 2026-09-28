import type { Metadata } from "next";

// Eigene Suchmaschinen-Angaben für /universum (die Seite selbst ist eine
// Client-Komponente und kann deshalb kein metadata exportieren).
export const metadata: Metadata = {
  title: "Universum",
  description:
    "Das Universum interaktiv entdecken: Alter des Universums live, ein interaktives Sonnensystem und die Maschine der Ewigkeit — ein Zahnrad dreht sich erst in 13,8 Milliarden Jahren einmal.",
  alternates: { canonical: "/universum" },
  openGraph: { url: "/universum", title: "Universum | CENTAURIAN" },
};

export default function UniversumLayout({ children }: { children: React.ReactNode }) {
  return children;
}
