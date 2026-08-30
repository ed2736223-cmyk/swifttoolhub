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
        "Set the lowest number in your range.",
        "Set the highest number in your range.",
        "Select how many random numbers you want to generate, if available.",
        "Click Generate to get your random numbers.",
        "Copy the generated numbers for your project or task.",
      ]}
      faqs={[
        { q: "How does the Random Number Generator work?", a: "Enter a minimum and maximum value, and the tool generates random numbers within that range." },
        { q: "Can I generate multiple random numbers?", a: "Yes, if the tool supports multiple results, you can generate several random numbers at once." },
        { q: "Is the Random Number Generator free to use?", a: "Yes, you can generate random numbers online for free without downloading any software." },
      ]}
    >
      <RandomNumberGenerator />
    </ToolShell>
  );
}
