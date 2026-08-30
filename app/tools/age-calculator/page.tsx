import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import AgeCalculator from "@/components/tools/AgeCalculator";
import { getTool } from "@/lib/tools";
const tool = getTool("age-calculator")!;
export const metadata: Metadata = { title: tool.name, description: tool.shortDesc };
export default function Page() {
  return (
    <ToolShell
      tool={tool}
      howTo={[
        "Enter your date of birth.",
        "Select the date you want to calculate your age up to.",
        "Click Calculate to calculate your exact age.",
        "Review your age in years, months, and days.",
        "Copy or use the result wherever you need it.",
      ]}
      faqs={[
        { q: "How does the Age Calculator work?", a: "It calculates the difference between your date of birth and a selected date to determine your exact age." },
        { q: "Can I calculate my age on a specific date?", a: "Yes, you can enter a specific date to find out exactly how old you will be on that day." },
        { q: "Is the Age Calculator free to use?", a: "Yes, you can calculate your age online for free without downloading additional software." },
      ]}
    >
      <AgeCalculator />
    </ToolShell>
  );
}
