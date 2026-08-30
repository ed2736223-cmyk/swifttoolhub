import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import MetaTagGenerator from "@/components/tools/MetaTagGenerator";
import { getTool } from "@/lib/tools";

const tool = getTool("meta-tag-generator")!;

export const metadata: Metadata = { title: tool.name, description: tool.shortDesc };

export default function Page() {
  return (
    <ToolShell
      tool={tool}
      howTo={[
        "Fill in your page title, description, and optional keywords/author.",
        "Ready-to-paste meta tags are generated automatically.",
        "Copy them straight into your page's <head> section.",
      ]}
      faqs={[
        { q: "How long should a meta description be?", a: "Roughly 150–160 characters is the common guideline so it doesn't get cut off in search results." },
        { q: "Are keyword meta tags still useful?", a: "Most major search engines no longer use the keywords tag for ranking, but some tools and internal search systems still read it." },
        { q: "What are the og: tags for?", a: "Open Graph tags control how your page looks when shared on social platforms like Facebook and LinkedIn." },
      ]}
    >
      <MetaTagGenerator />
    </ToolShell>
  );
}
