import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import FaviconGenerator from "@/components/tools/FaviconGenerator";
import { getTool } from "@/lib/tools";
const tool = getTool("favicon-generator")!;
export const metadata: Metadata = { title: tool.name, description: tool.shortDesc };
export default function Page() {
  return (
    <ToolShell
      tool={tool}
      howTo={[
        "Upload your image in a supported format.",
        "Choose the favicon size or sizes you need.",
        "Click Generate to create your favicon files.",
        "Check the generated favicon sizes and preview the result.",
        "Download the favicon files and add them to your website.",
      ]}
      faqs={[
        { q: "What is a favicon?", a: "A favicon is a small icon that represents a website and appears in browser tabs, bookmarks, and other browser interfaces." },
        { q: "What image can I use to create a favicon?", a: "You can use a supported image format, preferably a clear and simple image that remains recognizable at a small size." },
        { q: "Is the Favicon Generator free to use?", a: "Yes, you can generate favicon files online for free without installing additional software. You can simply sign up to get the additional features." },
      ]}
    >
      <FaviconGenerator />
    </ToolShell>
  );
}
