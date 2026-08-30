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
        "Enter or paste your text into the input box.",
        "Start typing or editing your content.",
        "Check the live word, character, sentence, and reading-time counts.",
        "Review the counts to meet your content or writing requirements.",
        "Copy your text and use it wherever you need.",
      ]}
      faqs={[
        {
          q: "What does the Word & Character Counter measure?",
          a: "It counts the number of words, characters, sentences, and estimated reading time in your text.",
        },
        {
          q: "Can I use it for long-form content?",
          a: "Yes, you can paste articles, essays, blog posts, or other long-form content to check their length.",
        },
        {
          q: "Is the Word & Character Counter free to use?",
          a: "Yes, you can count words, characters, sentences, and reading time online for free without installing additional software.",
        },
      ]}
    >
      <WordCounter />
    </ToolShell>
  );
}
