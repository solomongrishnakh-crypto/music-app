"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { useLanguage } from "@/contexts/LanguageContext";
import { useInView } from "@/hooks/useInView";

/**
 * Größenvergleich und Maschine der Ewigkeit auf der Startseite
 * (Nutzerwunsch 15.10.2026). Beide sind schwer (Canvas bzw. three.js) und
 * werden deshalb erst geladen, wenn man in ihre Nähe scrollt — die
 * Startseite bleibt schnell.
 */
const SizeComparison = dynamic(() => import("@/components/universe/SizeComparison"), { ssr: false });
const Gear3D = dynamic(() => import("@/components/universe/Gear3D"), { ssr: false });

function Lazy({ height, children }: { height: string; children: ReactNode }) {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "400px 0px", threshold: 0 });
  return (
    <div ref={ref} style={inView ? undefined : { minHeight: height }}>
      {inView ? children : null}
    </div>
  );
}

export default function HomeUniverse() {
  const { t, localePath } = useLanguage();
  return (
    <div className="mx-auto mt-10 w-full max-w-5xl sm:mt-14">
      <Lazy height="26rem">
        <SizeComparison index="02" />
      </Lazy>
      <Lazy height="22rem">
        <section className="mb-10">
          <SectionHeading index="03" label={t("gearLabel")} />
          <div className="hud-card flex flex-col items-center overflow-hidden p-3">
            <Gear3D className="h-60 w-full sm:h-72" />
            <p className="mt-2 max-w-md text-center text-[10px] leading-snug text-muted">{t("gearCaption")}</p>
            <Link
              href={localePath("/maschine-der-ewigkeit")}
              className="label-mono mt-3 inline-block border border-border px-3 py-1.5 text-[10px] uppercase tracking-wide text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              {t("linkMachine")} →
            </Link>
          </div>
        </section>
      </Lazy>
    </div>
  );
}
