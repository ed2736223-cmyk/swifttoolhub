import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import CsvToJson from "@/components/tools/CsvToJson";
import { getTool } from "@/lib/tools";

const tool = getTool("csv-to-json")!;

export const metadata: Metadata = { title: tool.name, description: tool.shortDesc };

export default function Page() {
  return (
    <ToolShell
      tool={tool}
      howTo={[
        "Paste CSV data with a header row into the left box.",
        "Click \"Convert to JSON\".",
        "Copy the structured JSON output on the right.",
      ]}
      faqs={[
        { q: "Does this support quoted fields with commas inside them?", a: "Not currently — this handles standard comma-separated values without embedded commas in quotes." },
        { q: "What if my CSV uses semicolons instead of commas?", a: "Replace semicolons with commas first, or this conversion won't split columns correctly." },
        { q: "Is there a row limit?", a: "No hard limit, though very large files will take longer since everything runs in your browser." },
      ]}
    >
      <CsvToJson />
    </ToolShell>
  );
}
