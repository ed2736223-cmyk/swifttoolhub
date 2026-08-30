
import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import SlugGenerator from "@/components/tools/SlugGenerator";
import { getTool } from "@/lib/tools";

const tool = getTool("slug-generator")!;

export const metadata: Metadata = { title: tool.name, description: tool.shortDesc };

export default function Page() {
  return (
    <ToolShell
      tool={tool}
      howTo={[
        "Type a title or phrase into the box.",
        "A clean, lowercase, hyphen-separated slug appears instantly.",
        "Copy it straight into your CMS or URL.",
      ]}
      faqs={[
        { q: "What counts as a 'clean' slug?", a: "Lowercase letters and numbers separated by hyphens, with punctuation, extra spaces, and special characters removed." },
        { q: "Does it handle accented characters?", a: "Basic punctuation and spacing are handled; heavily accented characters may need manual review depending on your target language." },
        { q: "Why use hyphens instead of underscores?", a: "Search engines generally treat hyphens as word separators in URLs, while underscores can be read as part of a single word." },
      ]}
    >
      <SlugGenerator />
    </ToolShell>
  );
}
