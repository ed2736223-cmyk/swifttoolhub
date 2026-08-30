import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import RandomNumberGenerator from "@/components/tools/RandomNumberGenerator";
import { getTool } from "@/lib/tools";

const tool = getTool("random-number-generator")!;

export const metadata: Metadata = { title: tool.name, description: tool.shortDesc };

export default function Page() {
  return (
    <ToolShell
      tool={tool}
      howTo={[
        "Set your minimum and maximum values.",
        "Click \"Generate\" for a random number in that range.",
        "Your last 10 results are kept below for reference.",
      ]}
      faqs={[
        { q: "Is this truly random?", a: "It uses your browser's standard random number source, suitable for everyday use like raffles, picks, or sampling." },
        { q: "Can min be greater than max?", a: "Yes — the tool automatically sorts the range so it works either way." },
        { q: "Are duplicate numbers possible across generations?", a: "Yes, each generation is independent, so repeats can happen just like with real dice or draws." },
      ]}
    >
      <RandomNumberGenerator />
    </ToolShell>
  );
}
