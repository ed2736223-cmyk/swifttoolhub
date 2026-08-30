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
        "Enter or paste your text or Base64 string into the input box.",
        "Choose Encode or Decode, depending on what you need.",
        "Click Convert to process your input.",
        "Review the encoded or decoded result.",
        "Copy the result and use it wherever you need.",
      ]}
      faqs={[
        {
          q: "What is Base64 encoding?",
          a: "Base64 is a method of converting data into a text format using a set of letters, numbers, and special characters.",
        },
        {
          q: "Can I decode Base64 back into text?",
          a: "Yes, paste a valid Base64 string into the tool and select Decode to convert it back into its original text.",
        },
        {
          q: "Is the Base64 Encoder / Decoder free to use?",
          a: "Yes, you can encode and decode Base64 online for free without installing additional software.",
        },
      ]}
    >
      <Base64Converter />
    </ToolShell>
  );
}
