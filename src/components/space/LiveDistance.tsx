"use client";

import { useEffect, useState } from "react";
import { bodyPosition, dateToJd } from "@/lib/astro/orbits";

/**
 * Abstand Erde ↔ Himmelskörper, live aus den Bahndaten berechnet
 * (dieselbe Rechnung wie im 3D-Sonnensystem). Läuft nur im Browser, damit
 * immer der aktuelle Wert erscheint.
 */
const KM_PER_AU = 149_597_870.7;

export default function LiveDistance({
  id,
  locale,
  auLabel,
  millionKmLabel,
}: {
  id: string;
  locale: string;
  auLabel: string;
  millionKmLabel: string;
}) {
  const [au, setAu] = useState<number | null>(null);
  useEffect(() => {
    const calc = () => {
      const jd = dateToJd(new Date());
      const e = bodyPosition("earth", jd);
      const b = id === "sun" ? ([0, 0, 0] as [number, number, number]) : bodyPosition(id, jd);
      if (!e || !b) return;
      setAu(Math.hypot(b[0] - e[0], b[1] - e[1], b[2] - e[2]));
    };
    calc();
    const t = setInterval(calc, 60_000);
    return () => clearInterval(t);
  }, [id]);
  if (au === null) return <span className="text-muted">…</span>;
  const mkm = (au * KM_PER_AU) / 1e6;
  return (
    <span>
      {au.toLocaleString(locale, { maximumFractionDigits: au < 10 ? 3 : 1 })} {auLabel}
      <span className="text-muted">
        {" "}
        (≈ {mkm.toLocaleString(locale, { maximumFractionDigits: mkm < 1000 ? 1 : 0 })} {millionKmLabel})
      </span>
    </span>
  );
}
