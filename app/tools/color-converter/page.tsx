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
        "Use the color picker or type a HEX code directly.",
        "The preview swatch updates live as you change the value.",
        "Copy the HEX, RGB, or HSL value you need with one click.",
      ]}
      faqs={[
        {
          q: "What's the difference between RGB and HSL?",
          a: "RGB defines a color by red, green and blue light levels; HSL defines it by hue, saturation and lightness — often easier for adjusting shades.",
        },
        {
          q: "Can I enter a 3-digit HEX code?",
          a: "Yes, shorthand codes like #fff are automatically expanded to their full 6-digit equivalent.",
        },
        {
          q: "Will this match colors exactly across screens?",
          a: "Values are calculated precisely, though actual on-screen appearance can vary slightly by monitor calibration.",
        },
      ]}
    >
      <ColorConverter />
    </ToolShell>
  );
}
