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
      
        "Paste a URL, text, or other information into the input box.",
        "Click Generate QR Code to create your code.",
        "Check that the generated code looks correct.",
        "Save the QR code to your device and use it wherever needed.",

      ]}
      faqs={[
        {
          q: "What can I use to create a QR code?",
          a: "You can create a QR code from a website link, text, or other supported information.",
        },
        {
          q: "Can I download the generated QR code?",
          a: "Yes, you can download your generated QR code and use it for websites, documents, marketing materials, or sharing information.",
        },
        {
          q: "Is the QR Code Generator free to use?",
          a: "Yes, you can generate QR codes online for free without installing additional software. To enjoy additional features, upgrade to a Pro account.
",
        },
      ]}
    >
      <QrCodeGenerator />
    </ToolShell>
  );
}
