"use client";

import { useState } from "react";
import { Dices, Copy, Check } from "lucide-react";

export default function RandomNumberGenerator() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [history, setHistory] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const lo = Math.min(min, max);
    const hi = Math.max(min, max);
    const n = Math.floor(Math.random() * (hi - lo + 1)) + lo;
    setHistory((h) => [n, ...h].slice(0, 10));
  };

  const copy = async () => {
    if (history.length === 0) return;
    await navigator.clipboard.writeText(String(history[0]));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="text-xs font-semibold text-heading/50">Min</label>
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
            className="mt-1 block w-24 rounded-xl border border-heading/10 bg-white px-3 py-2 text-sm outline-none focus:border-brand/50"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-heading/50">Max</label>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
            className="mt-1 block w-24 rounded-xl border border-heading/10 bg-white px-3 py-2 text-sm outline-none focus:border-brand/50"
          />
        </div>
        <button
          onClick={generate}
          className="btn-glow flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white"
        >
          <Dices size={15} /> Generate
        </button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3 rounded-2xl bg-white p-8">
        <p className="text-5xl font-bold text-brand">{history[0] ?? "—"}</p>
        {history.length > 0 && (
          <button
            onClick={copy}
            className="grid h-9 w-9 place-items-center rounded-full bg-brand-soft text-brand"
            aria-label="Copy number"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
          </button>
        )}
      </div>

      {history.length > 1 && (
        <div className="mt-4">
          <p className="text-xs font-semibold text-heading/50">Recent</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {history.slice(1).map((n, i) => (
              <span key={i} className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-heading/60">
                {n}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
