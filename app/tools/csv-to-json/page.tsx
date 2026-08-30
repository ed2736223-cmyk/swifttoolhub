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
        "Paste your CSV content into the input box.",
        "Click Convert to JSON to process your CSV.",
        "Check the structured JSON output for accuracy.",
        "Copy the JSON and use it in your application, API, or project.",
      ]}
      faqs={[
        { q: "How do I convert CSV to JSON?", a: "Paste your CSV data into the converter and click Convert to JSON. The tool will turn your rows and columns into structured JSON." },
        { q: "Can I convert large CSV files to JSON?", a: "Yes, you can convert CSV data into JSON, subject to the tool's supported input limits." },
        { q: "Is the CSV to JSON Converter free?", a: "Yes, you can convert CSV data online for free without installing additional software. You can also get the pro features by signing up." },
      ]}
    >
      <CsvToJson />
    </ToolShell>
  );
}
