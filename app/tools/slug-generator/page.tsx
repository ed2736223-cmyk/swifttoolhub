import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import SlugGenerator from "@/components/tools/SlugGenerator";
import { getTool } from "@/lib/tools";
const tool = getTool("slug-generator")!;
export const metadata: Metadata = { title: tool.name, description: tool.shortDesc };
export default function Page() {
  return (
    <ToolShell
      tool={tool}
      howTo={[
        "Type or paste your page or article title into the input box.",
        "Click Generate Slug to convert your title.",
        "Check the generated URL-friendly slug.",
        "Copy it and use it in your website URL, blog post, or landing page.",
      ]}
      faqs={[
        { q: "What is a URL slug?", a: "A URL slug is the readable part of a web address that usually describes a page or post, such as best-seo-tools." },
        { q: "What makes a good URL slug?", a: "A good slug is short, descriptive, easy to read, and uses relevant keywords with words separated by hyphens." },
        { q: "Is the Slug Generator free to use?", a: "Yes, you can generate clean, URL-safe slugs online for free without downloading any software. For some advanced features, you may need a subscription to our premium plan." },
      ]}
    >
      <SlugGenerator />
    </ToolShell>
  );
}
