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
        "Upload an image.",
        "Adjust the quality slider to balance size versus clarity.",
        "Click \"Compress Image\" and download the result.",
      ]}
      faqs={[
        { q: "What format does the compressed image use?", a: "Output is saved as JPEG, which supports adjustable quality-based compression." },
        { q: "Is my image uploaded anywhere?", a: "No, compression happens entirely in your browser using the Canvas API — nothing is sent to a server." },
        { q: "Why did the file size not shrink much?", a: "Already-compressed images (like existing JPEGs) or very simple images may not shrink much further at high quality settings — try lowering quality more." },
      ]}
    >
      <ImageCompressor />
    </ToolShell>
  );
}
