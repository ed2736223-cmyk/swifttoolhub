import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import MarkdownPreviewer from "@/components/tools/MarkdownPreviewer";
import { getTool } from "@/lib/tools";
const tool = getTool("markdown-previewer")!;
export const metadata: Metadata = { title: tool.name, description: tool.shortDesc };
export default function Page() {
  return (
    <ToolShell
      tool={tool}
      howTo={[
        "Enter or paste your Markdown text into the editor.",
        "Add Markdown formatting such as headings, lists, links, or bold text.",
        "View the rendered preview as you write.",
        "Review the formatting and make any necessary changes.",
        "Copy the Markdown or use the rendered content in your project.",
      ]}
      faqs={[
        { q: "What is Markdown?", a: "Markdown is a lightweight formatting language used to create formatted text using simple symbols and syntax." },
        { q: "Can I preview Markdown in real time?", a: "Yes, the preview updates as you write or edit your Markdown content." },
        { q: "Is the Markdown Previewer free to use?", a: "Yes, you can write and preview Markdown online for free without installing additional software." },
      ]}
    >
      <MarkdownPreviewer />
    </ToolShell>
  );
}
