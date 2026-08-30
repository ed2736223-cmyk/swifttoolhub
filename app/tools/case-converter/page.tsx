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
        
        "Enter or paste your text into the input box.",
        "Choose a case option such as UPPERCASE, lowercase, Title Case, or Sentence case.",
        "Review the converted text instantly in the output box.",
        "Copy the result and use it wherever you need.",

      ]}
      faqs={[
        {
          q: "What is a Text Case Converter?",
          a: "A Text Case Converter changes your text into different formats, such as UPPERCASE, lowercase, Title Case, and Sentence case.",
        },
        {
          q: "Can I convert large amounts of text?",
          a: "Yes, you can paste longer blocks of text and quickly convert them into your preferred case.",
        },
        {
          q: " Is the Text Case Converter free to use?",
          a: "Yes, you can convert text online for free without installing any software. But you can also sign up for a paid account to unlock more features.",
        },
      ]}
    >
      <CaseConverter />
    </ToolShell>
  );
}
