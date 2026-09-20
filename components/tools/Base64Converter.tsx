"use client";

import { useState } from "react";
import { Copy, Check, ArrowLeftRight, AlertCircle } from "lucide-react";

export default function Base64Converter() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const run = (value: string, m: "encode" | "decode") => {
    try {
      setOutput(m === "encode" ? btoa(unescape(encodeURIComponent(value))) : decodeURIComponent(escape(atob(value))));
      setError(null);
    } catch {
      setError(m === "decode" ? "Invalid Base64 string" : "Could not encode this text");
      setOutput("");
    }
  };

  const onInput = (value: string) => {
    setInput(value);
    if (value) run(value, mode);
    else setOutput("");
  };

  const toggleMode = () => {
    const next = mode === "encode" ? "decode" : "encode";
    setMode(next);
    setInput(output);
    if (output) run(output, next);
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <span className={`rounded-full px-4 py-1.5 text-xs font-semibold ${mode === "encode" ? "bg-brand text-white" : "bg-white text-heading/60"}`}>
          Encode
        </span>
        <button onClick={toggleMode} className="grid h-8 w-8 place-items-center rounded-full bg-white text-brand" aria-label="Swap mode">
          <ArrowLeftRight size={14} />
        </button>
        <span className={`rounded-full px-4 py-1.5 text-xs font-semibold ${mode === "decode" ? "bg-brand text-white" : "bg-white text-heading/60"}`}>
          Decode
        </span>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <p className="mb-1.5 text-xs font-semibold text-heading/50">
            {mode === "encode" ? "PLAIN TEXT" : "BASE64"}
          </p>
          <textarea
            value={input}
            onChange={(e) => onInput(e.target.value)}
            rows={8}
            placeholder={mode === "encode" ? "Type text to encode…" : "Paste Base64 to decode…"}
            className="w-full resize-y rounded-2xl border border-heading/10 bg-white p-4 font-mono text-xs text-heading outline-none focus:border-brand/50"
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-xs font-semibold text-heading/50">
              {mode === "encode" ? "BASE64" : "PLAIN TEXT"}
            </p>
            {output && (
              <button onClick={copy} className="flex items-center gap-1 text-xs font-semibold text-brand">
                {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            rows={8}
            className="w-full resize-y rounded-2xl border border-heading/10 bg-white p-4 font-mono text-xs text-heading outline-none"
          />
        </div>
      </div>

      {error && (
        <p className="mt-3 flex items-center gap-2 rounded-xl bg-warn-soft px-4 py-2.5 text-xs font-medium text-warn">
          <AlertCircle size={14} /> {error}
        </p>
      )}
    </div>
  );
}
