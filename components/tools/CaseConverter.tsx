"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const converters: Record<string, (s: string) => string> = {
  "UPPER CASE": (s) => s.toUpperCase(),
  "lower case": (s) => s.toLowerCase(),
  "Title Case": (s) =>
    s.replace(/\w\S*/g, (t) => t[0].toUpperCase() + t.slice(1).toLowerCase()),
  "Sentence case": (s) =>
    s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
  "aLtErNaTiNg CaSe": (s) =>
    s
      .split("")
      .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
      .join(""),
};

export default function CaseConverter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        placeholder="Type or paste your text…"
        className="w-full resize-y rounded-2xl border border-heading/10 bg-white p-4 text-sm text-heading outline-none focus:border-brand/50"
      />

      <div className="mt-4 space-y-2">
        {Object.entries(converters).map(([label, fn]) => {
          const result = text ? fn(text) : "";
          return (
            <div key={label} className="flex items-center gap-3 rounded-xl bg-white p-3">
              <span className="w-32 shrink-0 text-xs font-semibold text-heading/50">{label}</span>
              <p className="flex-1 truncate text-sm text-heading">{result || "—"}</p>
              <button
                onClick={() => copy(label, result)}
                disabled={!result}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand disabled:opacity-30"
                aria-label={`Copy ${label}`}
              >
                {copied === label ? <Check size={13} /> : <Copy size={13} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
