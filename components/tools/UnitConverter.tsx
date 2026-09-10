"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";

const categories = {
  Length: {
    units: { Meters: 1, Kilometers: 1000, Centimeters: 0.01, Miles: 1609.34, Feet: 0.3048, Inches: 0.0254 },
  },
  Weight: {
    units: { Kilograms: 1, Grams: 0.001, Pounds: 0.453592, Ounces: 0.0283495 },
  },
  Temperature: {
    units: { Celsius: "c", Fahrenheit: "f", Kelvin: "k" },
  },
} as const;

type Category = keyof typeof categories;

function convertTemp(value: number, from: string, to: string) {
  let celsius = value;
  if (from === "Fahrenheit") celsius = (value - 32) * (5 / 9);
  if (from === "Kelvin") celsius = value - 273.15;

  if (to === "Celsius") return celsius;
  if (to === "Fahrenheit") return celsius * (9 / 5) + 32;
  return celsius + 273.15;
}

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>("Length");
  const units = Object.keys(categories[category].units);
  const [from, setFrom] = useState(units[0]);
  const [to, setTo] = useState(units[1]);
  const [value, setValue] = useState("1");

  const result = useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num)) return "";
    if (category === "Temperature") return convertTemp(num, from, to).toFixed(2);
    const map = categories[category].units as Record<string, number>;
    return ((num * map[from]) / map[to]).toFixed(4).replace(/\.?0+$/, "");
  }, [value, from, to, category]);

  const changeCategory = (c: Category) => {
    setCategory(c);
    const u = Object.keys(categories[c].units);
    setFrom(u[0]);
    setTo(u[1]);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(categories) as Category[]).map((c) => (
          <button
            key={c}
            onClick={() => changeCategory(c)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
              category === c ? "bg-brand text-white" : "bg-white text-heading/60"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-5 grid items-end gap-3 sm:grid-cols-[1fr,auto,1fr]">
        <div className="rounded-2xl bg-white p-4">
          <label className="text-xs font-semibold text-heading/50">From</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mt-1 w-full bg-transparent text-lg font-semibold text-heading outline-none"
          />
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="mt-2 w-full rounded-lg border border-heading/10 bg-brand-softer px-2 py-1.5 text-xs"
          >
            {units.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
        </div>

        <button
          onClick={swap}
          className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-brand-soft text-brand"
          aria-label="Swap units"
        >
          <ArrowLeftRight size={16} />
        </button>

        <div className="rounded-2xl bg-white p-4">
          <label className="text-xs font-semibold text-heading/50">To</label>
          <p className="mt-1 truncate text-lg font-semibold text-brand">{result || "—"}</p>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mt-2 w-full rounded-lg border border-heading/10 bg-brand-softer px-2 py-1.5 text-xs"
          >
            {units.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
