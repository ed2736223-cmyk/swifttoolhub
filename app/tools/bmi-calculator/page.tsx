import type { Metadata } from "next";
import ToolShell from "@/components/ToolShell";
import BmiCalculator from "@/components/tools/BmiCalculator";
import { getTool } from "@/lib/tools";
const tool = getTool("bmi-calculator")!;
export const metadata: Metadata = { title: tool.name, description: tool.shortDesc };
export default function Page() {
  return (
    <ToolShell
      tool={tool}
      howTo={[
        "Enter your height in the required unit.",
        "Enter your weight in the required unit.",
        "Click Calculate to calculate your BMI.",
        "Review your BMI result and corresponding category.",
        "Use the result as a general reference for understanding your BMI.",
      ]}
      faqs={[
        { q: "What is BMI?", a: "BMI (Body Mass Index) is a calculation based on height and weight that provides a general measure of body size." },
        { q: "How is BMI calculated?", a: "BMI is calculated using a person's weight and height, with the exact formula depending on the measurement units used." },
        { q: "Is the BMI Calculator free to use?", a: "Yes, you can calculate your BMI online for free without downloading additional software." },
      ]}
    >
      <BmiCalculator />
    </ToolShell>
  );
}
