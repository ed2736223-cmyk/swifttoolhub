"use client";

import { useMemo, useState } from "react";
import { Copy, Trash2, Check } from "lucide-react";

export default function WordCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+/g) || [trimmed]).length : 0;
    const paragraphs = trimmed ? trimmed.split(/\n+/).filter(Boolean).length : 0;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { words, characters, charactersNoSpaces, sentences, paragraphs, readingTime };
  }, [text]);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here…"
        rows={10}
        className="w-full resize-y rounded-2xl border border-heading/10 bg-white p-4 text-sm text-heading outline-none focus:border-brand/50"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-full bg-brand-gradient px-4 py-2 text-xs font-semibold text-white"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy Text"}
        </button>
        <button
          onClick={() => setText("")}
          className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-heading"
        >
          <Trash2 size={13} /> Clear
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          { label: "Words", value: stats.words },
          { label: "Characters", value: stats.characters },
          { label: "No Spaces", value: stats.charactersNoSpaces },
          { label: "Sentences", value: stats.sentences },
          { label: "Paragraphs", value: stats.paragraphs },
          { label: "Read Time", value: `${stats.readingTime} min` },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-white p-3 text-center">
            <p className="text-xl font-bold text-brand">{s.value}</p>
            <p className="text-[11px] text-heading/50">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
