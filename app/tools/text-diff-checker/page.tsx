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
        "Paste the first block of text into the first input box.",
        "Paste the second block of text into the second input box.",
        "Click Compare to analyze both texts.",
        "Review the highlighted differences between the two versions.",
        "Copy or update your text based on the comparison.",
      ]}
      faqs={[
        { q: "What does the Text Diff Checker compare?", a: "It compares two blocks of text and highlights differences, including added, removed, or changed content." },
        { q: "Can I compare long blocks of text?", a: "Yes, you can compare articles, documents, code, or other text to identify differences quickly." },
        { q: "Is the Text Diff Checker free to use?", a: "Yes, you can compare text online for free without downloading additional software. You can also buy premium access to unlock extra features." },
      ]}
    >
      <TextDiffChecker />
    </ToolShell>
  );
}
