import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import WordCounter from "@/components/tools/WordCounter";
import { getTool } from "@/lib/tools";

const tool = getTool("word-counter")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.shortDesc,
};

export default function Page() {
  return (
    <ToolShell
      tool={tool}
      howTo={[
        "Paste or type your text into the box.",
        "Word, character, sentence and paragraph counts update as you type.",
        "Use \"Copy Text\" to grab your text back out any time.",
      ]}
      faqs={[
        {
          q: "How is reading time calculated?",
          a: "It's estimated at roughly 200 words per minute, rounded up to the nearest minute.",
        },
        {
          q: "Does this tool store what I type?",
          a: "No — counting happens locally in your browser and nothing is sent anywhere.",
        },
        {
          q: "Why does my sentence count look off?",
          a: "Sentences are detected by punctuation (., !, ?), so abbreviations or unusual formatting can occasionally throw the count off by one or two.",
        },
      ]}
    >
      <WordCounter />
    </ToolShell>
  );
}
