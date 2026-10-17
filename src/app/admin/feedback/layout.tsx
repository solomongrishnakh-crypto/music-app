import type { Metadata } from "next";

// Admin-Seite fuer das Feedback: nicht in Suchmaschinen aufnehmen
export const metadata: Metadata = {
  title: "Feedback (Admin)",
  robots: { index: false, follow: false },
};

export default function FeedbackAdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
