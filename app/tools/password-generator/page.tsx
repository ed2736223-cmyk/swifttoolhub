import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import PasswordGenerator from "@/components/tools/PasswordGenerator";
import { getTool } from "@/lib/tools";

const tool = getTool("password-generator")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.shortDesc,
};

export default function Page() {
  return (
    <ToolShell
      tool={tool}
      howTo={[
        "Set your preferred password length using the slider.",
        "Choose which character types to include — lowercase, uppercase, numbers, symbols.",
        "Click \"Generate Password\" and copy it with one tap.",
      ]}
      faqs={[
        {
          q: "Are these passwords random and secure?",
          a: "Yes — generation uses your browser's cryptographic random number source, not a predictable pattern.",
        },
        {
          q: "Is my password sent anywhere or logged?",
          a: "No. Everything happens locally in your browser; nothing is transmitted or stored.",
        },
        {
          q: "What length should I use?",
          a: "16 characters or more with a mix of character types is a solid baseline for most accounts.",
        },
      ]}
    >
      <PasswordGenerator />
    </ToolShell>
  );
}
