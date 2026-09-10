"use client";

import { useMemo, useState } from "react";

export default function WordFrequencyCounter() {
  const [text, setText] = useState("");

  const frequencies = useMemo(() => {
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(Boolean);

    const map = new Map<string, number>();
    words.forEach((w) => map.set(w, (map.get(w) || 0) + 1));

    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
  }, [text]);

  const max = frequencies[0]?.[1] || 1;

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={7}
        placeholder="Paste your text here…"
        className="w-full resize-y rounded-2xl border border-heading/10 bg-white p-4 text-sm text-heading outline-none focus:border-brand/50"
      />

      {frequencies.length > 0 && (
        <div className="mt-4 space-y-1.5 rounded-2xl bg-white p-4">
          {frequencies.map(([word, count]) => (
            <div key={word} className="flex items-center gap-3">
              <span className="w-24 shrink-0 truncate text-xs font-medium text-heading">{word}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-brand-soft">
                <div
                  className="h-full rounded-full bg-brand-gradient"
                  style={{ width: `${(count / max) * 100}%` }}
                />
              </div>
              <span className="w-6 shrink-0 text-right text-xs text-heading/50">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
