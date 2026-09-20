"use client";

import { useState } from "react";
import { Copy, Check, Hash } from "lucide-react";

export default function Sha256HashGenerator() {
  const [text, setText] = useState("");
  const [hash, setHash] = useState("");
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const generate = async () => {
    if (!text) return;
    setBusy(true);
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    const hex = Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    setHash(hex);
    setBusy(false);
  };

  const copy = async () => {
    if (!hash) return;
    await navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder="Type or paste text to hash…"
        className="w-full resize-y rounded-2xl border border-heading/10 bg-white p-4 text-sm text-heading outline-none focus:border-brand/50"
      />

      <button
        onClick={generate}
        disabled={busy || !text}
        className="btn-glow mt-4 flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        <Hash size={15} /> Generate SHA-256 Hash
      </button>

      {hash && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white p-4">
          <p className="flex-1 break-all font-mono text-xs text-heading">{hash}</p>
          <button
            onClick={copy}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-soft text-brand"
            aria-label="Copy hash"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
          </button>
        </div>
      )}
    </div>
  );
}
