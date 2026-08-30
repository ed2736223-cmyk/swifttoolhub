import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import JsonFormatter from "@/components/tools/JsonFormatter";
import { getTool } from "@/lib/tools";

const tool = getTool("json-formatter")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.shortDesc,
};

export default function Page() {
  return (
    <ToolShell
      tool={tool}
      howTo={[
        "Paste your JSON into the input box on the left.",
        "Click \"Format\" for readable, indented output, or \"Minify\" for a compact single line.",
        "If the JSON is invalid, the exact parsing error is shown so you can fix it.",
      ]}
      faqs={[
        {
          q: "Does this validate JSON or just format it?",
          a: "Both — formatting only succeeds on valid JSON, and any syntax error is shown immediately.",
        },
        {
          q: "Is my data sent to a server?",
          a: "No, parsing and formatting run entirely in your browser using standard JSON methods.",
        },
        {
          q: "What's the difference between Format and Minify?",
          a: "Format adds line breaks and indentation for readability; Minify strips all unnecessary whitespace to reduce file size.",
        },
      ]}
    >
      <JsonFormatter />
    </ToolShell>
  );
}
