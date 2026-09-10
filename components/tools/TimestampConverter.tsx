"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState(String(Math.floor(Date.now() / 1000)));
  const [copied, setCopied] = useState<string | null>(null);

  const date = (() => {
    const num = Number(timestamp);
    if (isNaN(num)) return null;
    const ms = timestamp.length > 10 ? num : num * 1000;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  })();

  const copy = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const setNow = () => setTimestamp(String(Math.floor(Date.now() / 1000)));

  const rows = date
    ? [
        { label: "Local", value: date.toString() },
        { label: "UTC", value: date.toUTCString() },
        { label: "ISO 8601", value: date.toISOString() },
      ]
    : [];

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
          placeholder="e.g. 1735689600"
          className="w-full rounded-full border border-heading/10 bg-white px-4 py-3 font-mono text-sm outline-none focus:border-brand/50"
        />
        <button
          onClick={setNow}
          className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-heading"
        >
          <RefreshCw size={13} /> Now
        </button>
      </div>

      {!date && timestamp && <p className="mt-3 text-xs text-warn">Enter a valid Unix timestamp (seconds or milliseconds).</p>}

      <div className="mt-4 space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-3 rounded-xl bg-white p-3">
            <span className="w-20 shrink-0 text-xs font-semibold text-heading/50">{r.label}</span>
            <p className="flex-1 truncate font-mono text-xs text-heading">{r.value}</p>
            <button
              onClick={() => copy(r.label, r.value)}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand"
              aria-label={`Copy ${r.label}`}
            >
              {copied === r.label ? <Check size={13} /> : <Copy size={13} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
