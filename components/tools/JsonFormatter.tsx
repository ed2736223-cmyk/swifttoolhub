"use client";

import { useState } from "react";
import { Copy, Check, AlertCircle, CheckCircle2 } from "lucide-react";

export default function JsonFormatter() {
  const [input, setInput] = useState('{\n  "name": "SwiftToolHub",\n  "free": true\n}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const format = (minify = false) => {
    try {
      const parsed = JSON.parse(input);
      setOutput(minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2));
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
          <p className="mb-1.5 text-xs font-semibold text-heading/50">INPUT</p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={12}
            className="w-full resize-y rounded-2xl border border-heading/10 bg-white p-4 font-mono text-xs text-heading outline-none focus:border-brand/50"
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-xs font-semibold text-heading/50">OUTPUT</p>
            {output && (
              <button onClick={copy} className="flex items-center gap-1 text-xs font-semibold text-brand">
                {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            rows={12}
            className="w-full resize-y rounded-2xl border border-heading/10 bg-white p-4 font-mono text-xs text-heading outline-none"
          />
        </div>
      </div>

      {error && (
        <p className="mt-3 flex items-center gap-2 rounded-xl bg-warn-soft px-4 py-2.5 text-xs font-medium text-warn">
          <AlertCircle size={14} /> {error}
        </p>
      )}
      {output && !error && (
        <p className="mt-3 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2.5 text-xs font-medium text-green-600">
          <CheckCircle2 size={14} /> Valid JSON
        </p>
      )}

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => format(false)}
          className="btn-glow rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white"
        >
          Format
        </button>
        <button
          onClick={() => format(true)}
          className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-heading"
        >
          Minify
        </button>
      </div>
    </div>
  );
}
