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
        "Choose Encode or Decode using the toggle.",
        "Paste your URL or text into the box.",
        "The result updates instantly — copy it with one click.",
      ]}
      faqs={[
        { q: "When do I need to encode a URL?", a: "Whenever a URL contains spaces or special characters — like in query parameters — encoding keeps it valid for browsers and servers." },
        { q: "What's the difference from Base64?", a: "URL encoding replaces unsafe characters with percent-codes for use in URLs; Base64 is a general binary-to-text encoding used well beyond URLs." },
        { q: "Does this handle full URLs or just parameters?", a: "It encodes/decodes any string you paste — for a full URL, typically only the query parameter values need encoding, not the whole address." },
      ]}
    >
      <UrlEncoderDecoder />
    </ToolShell>
  );
}
