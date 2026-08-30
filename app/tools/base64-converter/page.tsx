import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Base64Converter from "@/components/tools/Base64Converter";
import { getTool } from "@/lib/tools";

const tool = getTool("base64-converter")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.shortDesc,
};

export default function Page() {
  return (
    <ToolShell
      tool={tool}
      howTo={[
        "Pick Encode or Decode using the toggle at the top.",
        "Type or paste your text into the left box.",
        "The converted result appears instantly on the right — copy it with one click.",
      ]}
      faqs={[
        {
          q: "What is Base64 used for?",
          a: "It's a way to represent binary or text data using only readable ASCII characters — commonly used in emails, data URLs, and APIs.",
        },
        {
          q: "Why does decoding sometimes fail?",
          a: "Decoding fails if the input isn't valid Base64 — check for missing characters or extra spaces copied in by accident.",
        },
        {
          q: "Does this support special characters and emoji?",
          a: "Yes, text is UTF-8 encoded before conversion, so accented letters and emoji round-trip correctly.",
        },
      ]}
    >
      <Base64Converter />
    </ToolShell>
  );
}
