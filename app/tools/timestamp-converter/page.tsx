import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import TimestampConverter from "@/components/tools/TimestampConverter";
import { getTool } from "@/lib/tools";
const tool = getTool("timestamp-converter")!;
export const metadata: Metadata = { title: tool.name, description: tool.shortDesc };
export default function Page() {
  return (
    <ToolShell
      tool={tool}
      howTo={[
        "Select Unix timestamp to date or date to Unix timestamp.",
        "Add the timestamp or readable date you want to convert.",
        "Choose the appropriate date or timestamp format if required.",
        "Click Convert to generate the result.",
        "Use the converted timestamp or date wherever you need it.",
      ]}
      faqs={[
        { q: "What is a Unix timestamp?", a: "A Unix timestamp represents a specific date and time as the number of seconds elapsed since January 1, 1970." },
        { q: "Can I convert a date into a Unix timestamp?", a: "Yes. Enter a readable date and the converter will generate its corresponding Unix timestamp." },
        { q: "Is the Timestamp Converter free to use?", a: "Yes, you can convert timestamps and dates online for free without installing additional software. You can upgrade to a paid plan for more advanced features." },
      ]}
    >
      <TimestampConverter />
    </ToolShell>
  );
}
