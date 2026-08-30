"use client";

import { useState } from "react";
import { Copy, Check, ArrowLeftRight } from "lucide-react";

export default function UrlEncoderDecoder() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const output = (() => {
    try {
      return mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input);
    } catch {
      return "Invalid input for decoding";
    }
  })();

  const copy = async () => {
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
        <button
          onClick={() => setMode(mode === "encode" ? "decode" : "encode")}
          className="grid h-8 w-8 place-items-center rounded-full bg-white text-brand"
          aria-label="Swap mode"
        >
          <ArrowLeftRight size={14} />
        </button>
        <span className={`rounded-full px-4 py-1.5 text-xs font-semibold ${mode === "decode" ? "bg-brand text-white" : "bg-white text-heading/60"}`}>
          Decode
        </span>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={5}
        placeholder={mode === "encode" ? "Paste a URL or text to encode…" : "Paste an encoded URL to decode…"}
        className="mt-4 w-full resize-y rounded-2xl border border-heading/10 bg-white p-4 font-mono text-xs text-heading outline-none focus:border-brand/50"
      />

      <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white p-4">
        <p className="flex-1 break-all font-mono text-xs text-heading">{output || "Result will appear here"}</p>
        <button
          onClick={copy}
          disabled={!output}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand disabled:opacity-40"
          aria-label="Copy result"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </button>
      </div>
    </div>
  );
}
