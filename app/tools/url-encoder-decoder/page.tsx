import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import UrlEncoderDecoder from "@/components/tools/UrlEncoderDecoder";
import { getTool } from "@/lib/tools";
const tool = getTool("url-encoder-decoder")!;
export const metadata: Metadata = { title: tool.name, description: tool.shortDesc };
export default function Page() {
  return (
    <ToolShell
      tool={tool}
      howTo={[
        "Enter or paste your URL or query string into the input box.",
        "Choose Encode or Decode, depending on what you need.",
        "Click Convert to process your URL.",
        "Review the encoded or decoded result.",
        "Copy the result and use it in your website, application, or project.",
      ]}
      faqs={[
        { q: "What is URL encoding?", a: "URL encoding converts special characters into a format that can be safely used in web addresses and query strings." },
        { q: "When should I decode a URL?", a: "You can decode an encoded URL to turn its encoded characters back into a more readable format." },
        { q: "Is the URL Encoder / Decoder free to use?", a: "Yes, you can encode and decode URLs online for free without installing additional software." },
      ]}
    >
      <UrlEncoderDecoder />
    </ToolShell>
  );
}
