import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import ColorConverter from "@/components/tools/ColorConverter";
import { getTool } from "@/lib/tools";
const tool = getTool("color-converter")!;
export const metadata: Metadata = {
  title: tool.name,
  description: tool.shortDesc,
};
export default function Page() {
  return (
    <ToolShell
      tool={tool}
      howTo={[
        "Enter a color value in HEX, RGB, or HSL format.",
        "Select the color format you want to convert from.",
        "Click Convert to generate the equivalent color values.",
        "Check the live color preview to see the selected color.",
        "Copy the converted color code and use it in your design or project.",
      ]}
      faqs={[
        {
          q: "What color formats can I convert?",
          a: "You can convert colors between HEX, RGB, and HSL formats.",
        },
        {
          q: "Can I preview the converted color?",
          a: "Yes, the tool provides a live preview so you can see the color as you convert it.",
        },
        {
          q: "Is the Color Converter free to use?",
          a: "Yes, you can convert colors online for free without installing additional software.",
        },
      ]}
    >
      <ColorConverter />
    </ToolShell>
  );
}
