import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import LoremIpsumGenerator from "@/components/tools/LoremIpsumGenerator";
import { getTool } from "@/lib/tools";

const tool = getTool("lorem-ipsum-generator")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.shortDesc,
};

export default function Page() {
  return (
    <ToolShell
      tool={tool}
      howTo={[
        "Choose whether you want Paragraphs, Sentences, or Words.",
        "Set how many you need.",
        "Click \"Generate\" and copy the placeholder text.",
      ]}
      faqs={[
        {
          q: "What is Lorem Ipsum actually for?",
          a: "It's standard placeholder text used by designers and developers to preview layouts before real content is ready.",
        },
        {
          q: "Is the text randomized each time?",
          a: "Yes, word order and sentence length vary slightly on every generation for a more natural-looking layout preview.",
        },
        {
          q: "Can I generate a specific character count instead?",
          a: "This tool generates by paragraph, sentence, or word count — for an exact character count you'd need to trim the output manually.",
        },
      ]}
    >
      <LoremIpsumGenerator />
    </ToolShell>
  );
}
