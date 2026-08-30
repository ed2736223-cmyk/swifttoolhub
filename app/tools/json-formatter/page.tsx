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
        "Paste or enter your JSON data into the input box.",
        "Choose whether you want to format, validate, or minify the JSON.",
        "Click Format, Validate, or Minify to process your data.",
        "Review the formatted output or validation results.",
        "Copy the processed JSON and use it in your project or application.",
      ]}
      faqs={[
        {
          q: "What does a JSON Formatter & Validator do?",
          a: "It formats JSON for better readability, checks for syntax errors, and minifies JSON by removing unnecessary spaces and line breaks.",
        },
        {
          q: "How can I check if my JSON is valid?",
          a: "Paste your JSON into the tool and select Validate to check whether it follows valid JSON syntax.",
        },
        {
          q: "Is the JSON Formatter & Validator free to use?",
          a: "Yes, you can format, validate, and minify JSON online for free without installing additional software.",
        },
      ]}
    >
      <JsonFormatter />
    </ToolShell>
  );
}
