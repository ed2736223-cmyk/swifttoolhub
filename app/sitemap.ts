import type { MetadataRoute } from "next";
import { getMergedTools } from "@/lib/dynamicTools";
import { posts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";
import { getToolComponent } from "@/lib/toolRegistry";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL;
  const tools = await getMergedTools();

  const staticPages = ["", "/tools", "/about", "/contact", "/blog", "/privacy-policy", "/terms-of-service"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
    })
  );

  const toolPages = tools
    // Admin-added tools stay out of the sitemap (and noindex, see
    // app/tools/[slug]/page.tsx) until a developer registers a real
    // component for them in lib/toolRegistry.ts.
    .filter((t) => !t.dynamic || Boolean(getToolComponent(t.slug)))
    .map((t) => ({
      url: `${base}/tools/${t.slug}`,
      lastModified: new Date(),
    }));

  const blogPages = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.date),
  }));

  return [...staticPages, ...toolPages, ...blogPages];
}
