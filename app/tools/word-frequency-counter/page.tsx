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
        "Enter or paste your text into the input box.",
        "Click Analyze to process your text.",
        "Review the list of words and their frequency counts.",
        "Identify the words that appear most often in your content.",
        "Use the results to improve, edit, or analyze your text.",
      ]}
      faqs={[
        { q: "What does the Word Frequency Counter do?", a: "It analyzes your text and shows how many times each word appears." },
        { q: "Can I use it to analyze long-form content?", a: "Yes, you can paste articles, essays, or other text to identify frequently used words." },
        { q: "Is the Word Frequency Counter free to use?", a: "Yes, you can analyze word frequency online for free without installing additional software. You can also use the premium version to access additional features." },
      ]}
    >
      <WordFrequencyCounter />
    </ToolShell>
  );
}
