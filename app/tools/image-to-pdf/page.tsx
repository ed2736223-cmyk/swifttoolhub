import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import ImageToPdf from "@/components/tools/ImageToPdf";
import { getTool } from "@/lib/tools";

const tool = getTool("image-to-pdf")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.shortDesc,
};

export default function Page() {
  return (
    <ToolShell
      tool={tool}
      howTo={[
        "Click the upload area and select one or more JPG or PNG images.",
        "Reorder is done by upload order — remove any image with the small × button if needed.",
        "Click \"Convert to PDF\" to build the file in your browser.",
        "The PDF downloads automatically once it's ready.",
      ]}
      faqs={[
        {
          q: "Are my images uploaded to a server?",
          a: "No. The conversion runs entirely in your browser, so your images never leave your device.",
        },
        {
          q: "Is there a limit on how many images I can add?",
          a: "There's no hard limit, but very large batches will take longer since everything is processed on your device.",
        },
        {
          q: "What page size does the PDF use?",
          a: "Each image is placed on a standard page and scaled to fit while keeping its original proportions.",
        },
      ]}
    >
      <ImageToPdf />
    </ToolShell>
  );
}
