"use client";

import { useState } from "react";
import { Copy, Check, AlertCircle } from "lucide-react";

export default function CsvToJson() {
  const [csv, setCsv] = useState("name,age,city\nAlex,29,Lahore\nSara,34,Karachi");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const convert = () => {
    try {
      const lines = csv.trim().split("\n").filter(Boolean);
      if (lines.length < 2) throw new Error("Add a header row plus at least one data row.");
      const headers = lines[0].split(",").map((h) => h.trim());
      const rows = lines.slice(1).map((line) => {
        const cells = line.split(",").map((c) => c.trim());
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => (obj[h] = cells[i] ?? ""));
        return obj;
      });
      setOutput(JSON.stringify(rows, null, 2));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <p className="mb-1.5 text-xs font-semibold text-heading/50">CSV</p>
          <textarea
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            rows={10}
            className="w-full resize-y rounded-2xl border border-heading/10 bg-white p-4 font-mono text-xs text-heading outline-none focus:border-brand/50"
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-xs font-semibold text-heading/50">JSON</p>
            {output && (
              <button onClick={copy} className="flex items-center gap-1 text-xs font-semibold text-brand">
                {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            rows={10}
            className="w-full resize-y rounded-2xl border border-heading/10 bg-white p-4 font-mono text-xs text-heading outline-none"
          />
        </div>
      </div>

      {error && (
        <p className="mt-3 flex items-center gap-2 rounded-xl bg-warn-soft px-4 py-2.5 text-xs font-medium text-warn">
          <AlertCircle size={14} /> {error}
        </p>
      )}

      <button
        onClick={convert}
        className="btn-glow mt-4 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white"
      >
        Convert to JSON
      </button>
      <p className="mt-2 text-[11px] text-heading/40">Assumes comma-separated values with a header row. Quoted fields with embedded commas aren&apos;t supported.</p>
    </div>
  );
}
