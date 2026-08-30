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
        "Type or paste the text you want to hash.",
        "Click \"Generate SHA-256 Hash\".",
        "Copy the resulting hex hash with one click.",
      ]}
      faqs={[
        { q: "What is SHA-256 used for?", a: "It's a one-way cryptographic hash commonly used to verify file integrity, store password hashes, and generate unique fingerprints for data." },
        { q: "Can I reverse a hash back to the original text?", a: "No — SHA-256 is designed to be one-way; there's no way to recover the original input from the hash alone." },
        { q: "Is this computed securely?", a: "Yes, it uses your browser's built-in Web Crypto API, so the text never leaves your device." },
      ]}
    >
      <Sha256HashGenerator />
    </ToolShell>
  );
}
