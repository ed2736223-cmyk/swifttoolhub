import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import ImageCompressor from "@/components/tools/ImageCompressor";
import { getTool } from "@/lib/tools";
const tool = getTool("image-compressor")!;
export const metadata: Metadata = { title: tool.name, description: tool.shortDesc };
export default function Page() {
  return (
    <ToolShell
      tool={tool}
      howTo={[
        "Select the image you want to compress.",
        "Adjust the quality or compression level if available.",
        "Click Compress Image to reduce the file size.",
        "Check the compressed image and its new file size.",
        "Save the compressed version to your device.",
      ]}
      faqs={[
        { q: "How does an image compressor reduce file size?", a: "It reduces the amount of data stored in an image while keeping the visual quality as close to the original as possible." },
        { q: "Will compressing an image reduce its quality?", a: "Compression can slightly affect image quality, depending on the compression level. Using moderate compression helps maintain a good balance between quality and file size." },
      ]}
    >
      <ImageCompressor />
    </ToolShell>
  );
}
