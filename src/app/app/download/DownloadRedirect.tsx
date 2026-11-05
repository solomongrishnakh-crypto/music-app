"use client";

import { useEffect } from "react";

const APK_URL = "https://github.com/solomongrishnakh-crypto/music-app/releases/download/app-latest/Centaurian-web.apk";

export default function DownloadRedirect() {
  useEffect(() => {
    // kurz warten, damit die Web-Analyse den Aufruf noch zählen kann
    const t = setTimeout(() => window.location.replace(APK_URL), 900);
    return () => clearTimeout(t);
  }, []);
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-5 px-4 text-center">
      <p className="label-mono text-xs uppercase tracking-[0.3em] text-accent">Centaurian · Android</p>
      <h1 className="font-display text-2xl font-bold text-foreground">Download …</h1>
      <p className="text-sm text-foreground/80">Der Download startet gleich. / The download starts in a moment.</p>
      <a
        href={APK_URL}
        rel="noopener"
        className="inline-flex items-center gap-2 border border-accent px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-black"
      >
        Centaurian.apk
      </a>
    </main>
  );
}
