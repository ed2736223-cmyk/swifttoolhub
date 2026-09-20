"use client";

import { useState } from "react";

export default function PercentageCalculator() {
  const [mode, setMode] = useState<0 | 1 | 2>(0);
  const [a, setA] = useState("10");
  const [b, setB] = useState("50");

  const numA = parseFloat(a);
  const numB = parseFloat(b);

  const results = [
    { label: `What is ${a || 0}% of ${b || 0}?`, value: !isNaN(numA) && !isNaN(numB) ? ((numA / 100) * numB).toFixed(2) : "—" },
    { label: `${a || 0} is what % of ${b || 0}?`, value: !isNaN(numA) && !isNaN(numB) && numB !== 0 ? ((numA / numB) * 100).toFixed(2) + "%" : "—" },
    { label: `% change from ${a || 0} to ${b || 0}`, value: !isNaN(numA) && !isNaN(numB) && numA !== 0 ? (((numB - numA) / numA) * 100).toFixed(2) + "%" : "—" },
  ];

  const modes = ["X% of Y", "X is % of Y", "% Change"];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {modes.map((m, i) => (
          <button
            key={m}
            onClick={() => setMode(i as 0 | 1 | 2)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold ${mode === i ? "bg-brand text-white" : "bg-white text-heading/60"}`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-heading/50">Value A</label>
          <input
            type="number"
            value={a}
            onChange={(e) => setA(e.target.value)}
            className="mt-1 w-full rounded-xl border border-heading/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand/50"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-heading/50">Value B</label>
          <input
            type="number"
            value={b}
            onChange={(e) => setB(e.target.value)}
            className="mt-1 w-full rounded-xl border border-heading/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand/50"
          />
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-white p-6 text-center">
        <p className="text-xs text-heading/50">{results[mode].label}</p>
        <p className="mt-2 text-3xl font-bold text-brand">{results[mode].value}</p>
      </div>
    </div>
  );
}
