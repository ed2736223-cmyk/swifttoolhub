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
        "Select the JPG or PNG files you want to convert.",
        "Reorder them if needed to set the correct page sequence.",
        "Click Convert to PDF to combine your images.",
        "Check that all images appear correctly and in the desired order.",
        "Save the finished PDF to your device.",

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
