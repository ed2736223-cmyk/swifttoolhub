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
        "Select paragraphs, sentences, or words.",
        "Choose how much placeholder text you need.",
        "Click Generate to create your Lorem Ipsum content.",
        "Copy the generated text and paste it into your design, website, or project.",
      ]}
      faqs={[
        {
          q: "What is Lorem Ipsum used for?",
          a: "Lorem Ipsum is placeholder text commonly used to preview layouts, designs, websites, and other content before the final copy is ready.",
        },
        {
          q: "Can I generate paragraphs, sentences, and words?",
          a: "Yes, you can choose the type and amount of placeholder text you need.",
        },
        {
          q: "Is the Lorem Ipsum Generator free to use?",
          a: "Yes, you can generate Lorem Ipsum text online for free without downloading any software.",
        },
      ]}
    >
      <LoremIpsumGenerator />
    </ToolShell>
  );
}
