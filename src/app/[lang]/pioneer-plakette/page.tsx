import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProbeTopicView, { topicMetadata } from "@/components/space/ProbeTopicView";
import { findTopic } from "@/lib/probeTopics";

/** Nur Englisch (/en/pioneer-plaque); andere Sprachen gibt es für diese Seite noch nicht. */
const topic = findTopic("pioneer-plaque")!;
type Props = { params: Promise<{ lang: string }> };
export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return lang === "en" ? topicMetadata(topic, "en") : {};
}

export default async function LangPage({ params }: Props) {
  const { lang } = await params;
  if (lang !== "en") notFound();
  return <ProbeTopicView t={topic} lang="en" />;
}
