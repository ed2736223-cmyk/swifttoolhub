import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import CaseConverter from "@/components/tools/CaseConverter";
import { getTool } from "@/lib/tools";

const tool = getTool("case-converter")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.shortDesc,
};

export default function Page() {
  return (
    <ToolShell
      tool={tool}
      howTo={[
        "Type or paste your text into the box.",
        "All five case styles update at once below it.",
        "Copy whichever version you need with its copy button.",
      ]}
      faqs={[
        {
          q: "What's the difference between Title Case and Sentence case?",
          a: "Title Case capitalizes the first letter of every word; Sentence case only capitalizes the first letter of each sentence.",
        },
        {
          q: "Can I use this for code variable names?",
          a: "This tool is built for regular prose casing — for camelCase or snake_case variable naming you'd want a dedicated code-casing tool.",
        },
        {
          q: "Does it work on long paragraphs?",
          a: "Yes, there's no practical length limit — everything is processed instantly in your browser.",
        },
      ]}
    >
      <CaseConverter />
    </ToolShell>
  );
}
