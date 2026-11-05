import type { Metadata } from "next";
import DownloadRedirect from "./DownloadRedirect";

/**
 * Zwischenseite für den APK-Download: zählt in der Web-Analyse als Seitenaufruf
 * (/app/download) und leitet dann zur Datei weiter. So sieht man, wie viele
 * Menschen wirklich auf „Herunterladen“ tippen.
 */
export const metadata: Metadata = {
  title: "Download – CENTAURIAN",
  robots: { index: false, follow: false },
};

export default function DownloadPage() {
  return <DownloadRedirect />;
}
