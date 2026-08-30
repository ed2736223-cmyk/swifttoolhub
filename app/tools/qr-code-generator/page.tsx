import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import QrCodeGenerator from "@/components/tools/QrCodeGenerator";
import { getTool } from "@/lib/tools";

const tool = getTool("qr-code-generator")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.shortDesc,
};

export default function Page() {
  return (
    <ToolShell
      tool={tool}
      howTo={[
        "Type or paste a link, phone number, or any text into the field.",
        "Click \"Generate\" to create the QR code.",
        "Download it as a PNG to print or share.",
      ]}
      faqs={[
        {
          q: "Do these QR codes expire?",
          a: "No. The code is a direct encoding of the text you entered, so it works for as long as that link or content stays valid.",
        },
        {
          q: "Can I scan it directly from the screen?",
          a: "Yes, most phone cameras can scan it right off your screen — downloading is only needed if you want to print or share the image.",
        },
        {
          q: "Is there a size limit for what I can encode?",
          a: "Very long text will still generate a code, but it becomes denser and can be harder for some scanners to read — shorter links work best.",
        },
      ]}
    >
      <QrCodeGenerator />
    </ToolShell>
  );
}
