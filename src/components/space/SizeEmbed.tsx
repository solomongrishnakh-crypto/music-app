"use client";

import dynamic from "next/dynamic";

/** Der Größenvergleich zeichnet auf ein Canvas und läuft deshalb nur im Browser. */
const SizeComparison = dynamic(() => import("@/components/universe/SizeComparison"), {
  ssr: false,
  loading: () => <div style={{ minHeight: "26rem" }} aria-hidden="true" />,
});

export default function SizeEmbed() {
  return <SizeComparison index="01" />;
}
