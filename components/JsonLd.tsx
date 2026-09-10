/**
 * Renders a JSON-LD <script> tag for structured data (schema.org). Used for
 * Organization/WebSite (site-wide), SoftwareApplication (tool pages),
 * FAQPage (homepage FAQ), and BreadcrumbList (tool pages) — all read by
 * Google to build rich results and to understand the site for AdSense/SEO
 * review.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify never produces "</script>" on its own from plain
      // data, but escaping defensively costs nothing and rules it out.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
