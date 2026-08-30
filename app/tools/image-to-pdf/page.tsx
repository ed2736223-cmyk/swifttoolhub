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
          q: " How do I convert an image to PDF?",
          a: "Upload your JPG or PNG images, arrange them in your preferred order, and click Convert to PDF to create a single PDF.",
        },
        {
          q: " Can I convert multiple images into one PDF?",
          a: "Yes. You can combine multiple JPG or PNG images into a single PDF, with each image appearing as a separate page.",
        },
        {
          q: " Is the Image to PDF Converter free?",
          a: "Yes, you can use the Image to PDF Converter for free without downloading additional software. You can also sign up for a free account to access additional features.",
        },
      ]}
    >
      <ImageToPdf />
    </ToolShell>
  );
}
