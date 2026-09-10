"use client";

import { useMemo, useState } from "react";

export default function BmiCalculator() {
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("70");

  const { bmi, category, color } = useMemo(() => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (!h || !w) return { bmi: null, category: "", color: "" };
    const value = w / (h * h);
    let category = "Normal";
    let color = "text-green-600";
    if (value < 18.5) { category = "Underweight"; color = "text-yellow-600"; }
    else if (value >= 25 && value < 30) { category = "Overweight"; color = "text-yellow-600"; }
    else if (value >= 30) { category = "Obese"; color = "text-warn"; }
    return { bmi: value.toFixed(1), category, color };
  }, [height, weight]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-heading/50">Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="mt-1 w-full rounded-xl border border-heading/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand/50"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-heading/50">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="mt-1 w-full rounded-xl border border-heading/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand/50"
          />
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-white p-6 text-center">
        <p className="text-xs text-heading/50">Your BMI</p>
        <p className="mt-2 text-4xl font-bold text-brand">{bmi ?? "—"}</p>
        {category && <p className={`mt-1 text-sm font-semibold ${color}`}>{category}</p>}
      </div>
      <p className="mt-3 text-[11px] text-heading/40">
        BMI is a general screening measure and doesn&apos;t account for muscle mass, age, or body composition.
      </p>
    </div>
  );
}
