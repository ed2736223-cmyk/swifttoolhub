"use client";

import { useMemo, useState } from "react";

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");

  const age = useMemo(() => {
    if (!birthDate) return null;
    const start = new Date(birthDate);
    const now = new Date();
    if (isNaN(start.getTime()) || start > now) return null;

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();

    if (days < 0) {
      months -= 1;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    return { years, months, days, totalDays };
  }, [birthDate]);

  return (
    <div>
      <label className="text-xs font-semibold text-heading/50">Date of birth</label>
      <input
        type="date"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        max={new Date().toISOString().split("T")[0]}
        className="mt-1.5 w-full rounded-xl border border-heading/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand/50"
      />

      {age && (
        <>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            {[
              { label: "Years", value: age.years },
              { label: "Months", value: age.months },
              { label: "Days", value: age.days },
            ].map((r) => (
              <div key={r.label} className="rounded-2xl bg-white p-4">
                <p className="text-2xl font-bold text-brand">{r.value}</p>
                <p className="text-[11px] text-heading/50">{r.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-heading/50">
            That&apos;s {age.totalDays.toLocaleString()} days total.
          </p>
        </>
      )}
    </div>
  );
}
