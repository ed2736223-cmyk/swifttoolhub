"use client";

import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function SlugGenerator() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const slug = useMemo(() => slugify(text), [text]);

  const copy = async () => {
    if (!slug) return;
    await navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g. My Awesome Blog Post Title!"
        className="w-full rounded-full border border-heading/10 bg-white px-4 py-3 text-sm outline-none focus:border-brand/50"
      />

      <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white p-4">
        <p className="flex-1 break-all font-mono text-sm text-brand">{slug || "your-slug-will-appear-here"}</p>
        <button
          onClick={copy}
          disabled={!slug}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-soft text-brand disabled:opacity-40"
          aria-label="Copy slug"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
        </button>
      </div>
    </div>
  );
}
