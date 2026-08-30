import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import TextDiffChecker from "@/components/tools/TextDiffChecker";
import { getTool } from "@/lib/tools";

const tool = getTool("text-diff-checker")!;

export const metadata: Metadata = { title: tool.name, description: tool.shortDesc };

export default function Page() {
  return (
    <ToolShell
      tool={tool}
      howTo={[
        "Paste your original text on the left and the changed version on the right.",
        "Click \"Compare\".",
        "Removed lines show in red, added lines in green.",
      ]}
      faqs={[
        { q: "Does this compare word by word or line by line?", a: "Line by line — it's built for comparing paragraphs, config files, or code blocks rather than catching single-character edits." },
        { q: "Why does a line show as both removed and added?", a: "That happens when a line was edited — the old version is marked removed and the new version marked added, since they're no longer identical." },
        { q: "Can I use this for code?", a: "Yes, though for large codebases a dedicated diff tool in your editor or version control will give more context." },
      ]}
    >
      <TextDiffChecker />
    </ToolShell>
  );
}
