"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";

const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ lower: true, upper: true, numbers: true, symbols: false });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const pool = Object.entries(opts)
      .filter(([, v]) => v)
      .map(([k]) => SETS[k as keyof typeof SETS])
      .join("");
    if (!pool) return;
    let out = "";
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    for (let i = 0; i < length; i++) out += pool[arr[i] % pool.length];
    setPassword(out);
  };

  const copy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const strength = (() => {
    const active = Object.values(opts).filter(Boolean).length;
    if (length >= 16 && active >= 3) return { label: "Strong", color: "bg-green-500", w: "100%" };
    if (length >= 10 && active >= 2) return { label: "Good", color: "bg-yellow-500", w: "66%" };
    return { label: "Weak", color: "bg-red-500", w: "33%" };
  })();

  return (
    <div>
      <div className="flex items-center gap-3 rounded-2xl bg-white p-4">
        <p className="flex-1 break-all font-mono text-base text-heading">
          {password || "Click Generate to create a password"}
        </p>
        <button
          onClick={copy}
          disabled={!password}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-soft text-brand disabled:opacity-40"
          aria-label="Copy password"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
        </button>
      </div>

      {password && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-heading/10">
          <div className={`h-full ${strength.color} transition-all`} style={{ width: strength.w }} />
        </div>
      )}

      <div className="mt-6 flex items-center justify-between text-sm">
        <span className="font-medium text-heading">Length: {length}</span>
        <input
          type="range"
          min={6}
          max={32}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-2/3 accent-brand"
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {Object.entries({
          lower: "a-z",
          upper: "A-Z",
          numbers: "0-9",
          symbols: "!@#",
        }).map(([key, label]) => (
          <label
            key={key}
            className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs font-medium text-heading"
          >
            <input
              type="checkbox"
              checked={opts[key as keyof typeof opts]}
              onChange={(e) => setOpts((p) => ({ ...p, [key]: e.target.checked }))}
              className="accent-brand"
            />
            {label}
          </label>
        ))}
      </div>

      <button
        onClick={generate}
        className="btn-glow mt-5 flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white"
      >
        <RefreshCw size={14} /> Generate Password
      </button>
    </div>
  );
}
