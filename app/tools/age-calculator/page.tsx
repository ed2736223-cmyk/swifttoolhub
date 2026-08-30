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
        "Select your date of birth.",
        "Your exact age in years, months and days appears instantly.",
        "The total number of days lived is shown underneath.",
      ]}
      faqs={[
        { q: "How is the age calculated?", a: "It compares your birth date to today's date, accounting for varying month lengths so the months and days are exact." },
        { q: "Does this account for leap years?", a: "Yes, the underlying date calculations handle leap years automatically." },
        { q: "Is my birth date stored anywhere?", a: "No — the calculation happens entirely in your browser and nothing is sent to a server." },
      ]}
    >
      <AgeCalculator />
    </ToolShell>
  );
}
