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
        "Paste a Unix timestamp (seconds or milliseconds) into the field.",
        "Click \"Now\" to grab the current timestamp instead.",
        "Local, UTC and ISO 8601 formats all appear below, ready to copy.",
      ]}
      faqs={[
        { q: "What's the difference between seconds and milliseconds?", a: "Unix timestamps in seconds are 10 digits (as of 2026); in milliseconds they're 13 digits — this tool detects which one you've entered." },
        { q: "What is ISO 8601?", a: "A standardized date-time format (e.g. 2026-07-30T12:00:00.000Z) widely used in APIs and logs for unambiguous timestamps." },
        { q: "Does this account for time zones?", a: "The Local row uses your browser's time zone; UTC and ISO 8601 are always in Coordinated Universal Time." },
      ]}
    >
      <TimestampConverter />
    </ToolShell>
  );
}
