"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useInView } from "@/hooks/useInView";
import { SIZE_PAGE } from "@/lib/sizePageText";

/**
 * Größenvergleich und Maschine der Ewigkeit auf der Startseite
 * (Nutzerwunsch 15.10.2026). Beide sind schwer (Canvas bzw. three.js) und
 * werden deshalb erst geladen, wenn man in ihre Nähe scrollt — die
 * Startseite bleibt schnell.
 */
const SizeComparison = dynamic(() => import("@/components/universe/SizeComparison"), { ssr: false });

function Lazy({ height, children }: { height: string; children: ReactNode }) {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "400px 0px", threshold: 0 });
  return (
    <div ref={ref} style={inView ? undefined : { minHeight: height }}>
      {inView ? children : null}
    </div>
  );
}

export default function HomeUniverse() {
  const { localePath, lang } = useLanguage();
  return (
    <div className="mx-auto mt-10 w-full max-w-6xl sm:mt-14">
      <Lazy height="26rem">
        <SizeComparison index="02" />
      </Lazy>
      <p className="mb-10 -mt-6 text-center">
        <Link
          href={localePath("/groessenvergleich")}
          className="label-mono inline-block border border-border px-3 py-1.5 text-[10px] uppercase tracking-wide text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          {(SIZE_PAGE[lang] ?? SIZE_PAGE.en).link} →
        </Link>
      </p>
    </div>
  );
}
