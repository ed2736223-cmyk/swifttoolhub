import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import PercentageCalculator from "@/components/tools/PercentageCalculator";
import { getTool } from "@/lib/tools";

const tool = getTool("percentage-calculator")!;

export const metadata: Metadata = { title: tool.name, description: tool.shortDesc };

export default function Page() {
  return (
    <ToolShell
      tool={tool}
      howTo={[
        "Pick the calculation you need: X% of Y, X as a % of Y, or % change.",
        "Enter your two values.",
        "The result updates instantly.",
      ]}
      faqs={[
        { q: "What's the difference between % of and % change?", a: "\"X% of Y\" finds a portion of a value; \"% change\" measures how much a value grew or shrank between two points." },
        { q: "Can I get a negative percentage change?", a: "Yes — a negative result means the value decreased from A to B." },
        { q: "Does this handle decimals?", a: "Yes, both fields accept decimal values for precise calculations." },
      ]}
    >
      <PercentageCalculator />
    </ToolShell>
  );
}
