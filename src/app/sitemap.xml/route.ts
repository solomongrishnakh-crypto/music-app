import { XML_HEADERS, indexXml } from "@/lib/sitemapData";

/**
 * sitemap.xml — Index über alle Bereichs-Sitemaps (/sitemaps/<bereich>.xml).
 * Die Seiten selbst stehen in src/lib/sitemapData.ts.
 */
export const revalidate = 86400;

export function GET() {
  return new Response(indexXml(), { headers: XML_HEADERS });
}
