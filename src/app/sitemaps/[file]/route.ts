import { SITEMAP_SECTIONS, XML_HEADERS, urlsetXml } from "@/lib/sitemapData";

/** Bereichs-Sitemaps: /sitemaps/imperien.xml, /sitemaps/sterne.xml … (Index: /sitemap.xml) */
export const revalidate = 86400;

export function generateStaticParams() {
  return Object.keys(SITEMAP_SECTIONS).map((name) => ({ file: `${name}.xml` }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const build = file.endsWith(".xml") ? SITEMAP_SECTIONS[file.slice(0, -4)] : undefined;
  if (!build) return new Response("Not found", { status: 404 });
  return new Response(urlsetXml(build()), { headers: XML_HEADERS });
}
