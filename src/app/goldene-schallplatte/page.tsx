import { notFound } from "next/navigation";
import ProbeTopicView, { topicMetadata } from "@/components/space/ProbeTopicView";
import { findTopic } from "@/lib/probeTopics";

const topic = findTopic("golden-record")!;
export const metadata = topicMetadata(topic, "de");
export const revalidate = false;

export default function Page() {
  if (!topic) notFound();
  return <ProbeTopicView t={topic} lang="de" />;
}
