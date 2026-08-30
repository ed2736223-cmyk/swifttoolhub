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
        "Enter your height in centimeters and weight in kilograms.",
        "Your BMI and category appear instantly.",
        "Use it as a general reference, not a medical diagnosis.",
      ]}
      faqs={[
        { q: "What are the standard BMI categories?", a: "Under 18.5 is underweight, 18.5–24.9 is normal, 25–29.9 is overweight, and 30+ is considered obese." },
        { q: "Is BMI accurate for everyone?", a: "It's a general population screening tool and doesn't account for muscle mass, bone density, age, or sex — athletes in particular can score higher than expected." },
        { q: "Should I make health decisions based on BMI alone?", a: "No — treat it as a starting reference point and speak with a healthcare professional for a fuller picture." },
      ]}
    >
      <BmiCalculator />
    </ToolShell>
  );
}
