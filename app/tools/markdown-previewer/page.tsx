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
        "Type or paste Markdown into the left panel.",
        "The rendered preview updates live on the right.",
        "Supports headings, bold, italics, inline code, links and lists.",
      ]}
      faqs={[
        { q: "What Markdown syntax is supported?", a: "Headings (#, ##, ###), bold, italics, inline code, links, and bullet lists — the most common formatting used in READMEs and comments." },
        { q: "Can I export the rendered HTML?", a: "This tool is built for quick previewing; copy the preview text manually if you need the rendered output elsewhere." },
        { q: "Does it support tables or images?", a: "Not currently — this covers the core everyday Markdown syntax rather than the full specification." },
      ]}
    >
      <MarkdownPreviewer />
    </ToolShell>
  );
}
