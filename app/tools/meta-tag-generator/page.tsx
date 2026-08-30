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
        "Add your page title, description, and relevant information.",
        "Enter relevant keywords if the tool provides a keyword field.",
        "Click Generate to create your SEO-ready tags.",
        "Check the generated title, description, and other meta tags.",
        "Copy the code and add it to your webpage's <head> section.",
      ]}
      faqs={[
        { q: "What are meta tags?", a: "Meta tags provide information about a webpage to search engines and browsers, including its title and description." },
        { q: "What should I include in a meta description?", a: "A good meta description should clearly summarize the page, naturally include relevant keywords, and encourage users to click." },
        { q: "Is the Meta Tag Generator free to use?", a: "Yes, you can generate SEO-ready meta tags online for free without installing additional software." },
      ]}
    >
      <MetaTagGenerator />
    </ToolShell>
  );
}
