import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import Sha256HashGenerator from "@/components/tools/Sha256HashGenerator";
import { getTool } from "@/lib/tools";
const tool = getTool("sha256-hash-generator")!;
export const metadata: Metadata = { title: tool.name, description: tool.shortDesc };
export default function Page() {
  return (
    <ToolShell
      tool={tool}
      howTo={[
        "Enter or paste your text into the input box.",
        "Click Generate Hash to process your text.",
        "Review the generated SHA-256 hash.",
        "Copy the hash to your clipboard.",
        "Use the hash for verification, comparison, or other supported purposes.",
      ]}
      faqs={[
        { q: "What is a SHA-256 hash?", a: "SHA-256 is a cryptographic hashing algorithm that converts data into a fixed-length 256-bit hash value." },
        { q: "Can I generate a SHA-256 hash from any text?", a: "Yes, you can enter or paste text into the tool to generate its corresponding SHA-256 hash." },
        { q: "Is the SHA-256 Hash Generator free to use?", a: "Yes, you can generate SHA-256 hashes online for free without installing additional software. Sign up to enjoy unlimited access to all features." },
      ]}
    >
      <Sha256HashGenerator />
    </ToolShell>
  );
}
