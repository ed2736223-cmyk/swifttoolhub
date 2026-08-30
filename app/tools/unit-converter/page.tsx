import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import UnitConverter from "@/components/tools/UnitConverter";
import { getTool } from "@/lib/tools";

const tool = getTool("unit-converter")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.shortDesc,
};

export default function Page() {
  return (
    <ToolShell
      tool={tool}
      howTo={[
        "Choose a category: Length, Weight, or Temperature.",
        "Enter a value and pick the units to convert from and to.",
        "The result updates instantly — use the swap icon to flip direction.",
      ]}
      faqs={[
        {
          q: "How accurate are the conversions?",
          a: "Standard conversion factors are used throughout, accurate to four decimal places for length and weight.",
        },
        {
          q: "Why is temperature handled differently?",
          a: "Temperature scales don't share a common zero point, so conversions use fixed formulas rather than a simple multiplier.",
        },
        {
          q: "Can I add more unit categories?",
          a: "This tool currently covers the most common everyday conversions — length, weight and temperature.",
        },
      ]}
    >
      <UnitConverter />
    </ToolShell>
  );
}
