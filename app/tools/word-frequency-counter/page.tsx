import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import WordFrequencyCounter from "@/components/tools/WordFrequencyCounter";
import { getTool } from "@/lib/tools";

const tool = getTool("word-frequency-counter")!;

export const metadata: Metadata = { title: tool.name, description: tool.shortDesc };

export default function Page() {
  return (
    <ToolShell
      tool={tool}
      howTo={[
        "Paste your text into the box.",
        "The top 20 most frequent words appear automatically, ranked by count.",
        "Bar length shows relative frequency at a glance.",
      ]}
      faqs={[
        { q: "Are common words like 'the' and 'and' filtered out?", a: "No, all words are counted as-is — useful for raw frequency analysis, though you may want to mentally skip common stopwords." },
        { q: "Is capitalization ignored?", a: "Yes, text is lowercased before counting so 'Word' and 'word' are treated as the same term." },
        { q: "What's this useful for?", a: "Spotting repetition in writing, doing quick keyword analysis, or checking for overused words before publishing." },
      ]}
    >
      <WordFrequencyCounter />
    </ToolShell>
  );
}
