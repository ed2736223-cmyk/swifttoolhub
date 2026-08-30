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
        "Upload a square source image (a logo works well).",
        "16×16, 32×32, 48×48 and 180×180 versions generate automatically.",
        "Download each size you need for your site's favicon files.",
      ]}
      faqs={[
        { q: "Why do I need multiple sizes?", a: "Different browsers, devices and bookmark bars request different favicon sizes — providing several ensures it looks sharp everywhere." },
        { q: "What is the 180×180 size for?", a: "That's the standard Apple touch icon size, used when someone adds your site to an iOS home screen." },
        { q: "Should my source image be square?", a: "Yes — non-square images will be stretched to fit, so a square logo or icon gives the cleanest result." },
      ]}
    >
      <FaviconGenerator />
    </ToolShell>
  );
}
