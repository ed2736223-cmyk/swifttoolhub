import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import UnitConverter from "@/components/tools/UnitConverter";
import { getTool } from "@/lib/tools";

const tool = getTool("unit-converter")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.shortDesc,
};

export default function Page() {
  return (
    <ToolShell
      tool={tool}
      howTo={[
        
        "Choose length, weight, or temperature.",
        "Type the number you want to convert.",
        "Select the unit you’re converting from and the unit you want to convert to.",
        "Your converted value will be displayed instantly.",
        "Use the converted value wherever you need it.",

      ]}
      faqs={[
        {
          q: "What units can I convert?",
          a: "You can convert common units for length, weight, and temperature, including meters, feet, kilograms, pounds, Celsius, and Fahrenheit.",
        },
        {
          q: "Is the Unit Converter accurate?",
          a: "Yes. The converter uses standard conversion formulas to provide accurate results.",
        },
        {
          q: "Is the Unit Converter free to use?",
          a: "Yes, you can use the Unit Converter online for free without downloading software. But you can sign up to enjoy more advanced features.",
        },
      ]}
    >
      <UnitConverter />
    </ToolShell>
  );
}
