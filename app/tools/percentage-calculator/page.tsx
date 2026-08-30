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
        "Enter the numbers you want to calculate.",
        "Choose the percentage calculation you need.",
        "Enter the percentage value or relevant numbers.",
        "Click Calculate to get your result.",
        "Review and copy the calculated percentage for your use.",
      ]}
      faqs={[
        { q: "What can I calculate with the Percentage Calculator?", a: "You can calculate percentages, percentage increases, and percentage decreases quickly and easily." },
        { q: "How do I calculate a percentage increase or decrease?", a: "Enter the original and new values, and the calculator will determine the percentage change for you." },
        { q: "Is the Percentage Calculator free to use?", a: "Yes, you can calculate percentages online for free without downloading additional software." },
      ]}
    >
      <PercentageCalculator />
    </ToolShell>
  );
}
