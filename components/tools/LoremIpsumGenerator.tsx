"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";

const WORDS =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(" ");

function randomWords(n: number) {
  return Array.from({ length: n }, () => WORDS[Math.floor(Math.random() * WORDS.length)]);
}

function sentence() {
  const words = randomWords(6 + Math.floor(Math.random() * 8));
  const s = words.join(" ");
  return s.charAt(0).toUpperCase() + s.slice(1) + ".";
}

function paragraph() {
  const count = 3 + Math.floor(Math.random() * 4);
  return Array.from({ length: count }, sentence).join(" ");
}

export default function LoremIpsumGenerator() {
  const [type, setType] = useState<"Paragraphs" | "Sentences" | "Words">("Paragraphs");
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (type === "Words") setOutput(randomWords(count).join(" "));
    else if (type === "Sentences") setOutput(Array.from({ length: count }, sentence).join(" "));
    else setOutput(Array.from({ length: count }, paragraph).join("\n\n"));
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex gap-2">
          {(["Paragraphs", "Sentences", "Words"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
                type === t ? "bg-brand text-white" : "bg-white text-heading/60"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5">
          <label className="text-xs font-semibold text-heading/50">Count</label>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-14 bg-transparent text-sm outline-none"
          />
        </div>
        <button
          onClick={generate}
          className="btn-glow flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2 text-xs font-semibold text-white"
        >
          <RefreshCw size={13} /> Generate
        </button>
      </div>

      <div className="mt-4 rounded-2xl bg-white p-4">
        <div className="mb-2 flex justify-end">
          {output && (
            <button onClick={copy} className="flex items-center gap-1 text-xs font-semibold text-brand">
              {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>
        <p className="whitespace-pre-line text-sm leading-relaxed text-heading/80">
          {output || "Your generated placeholder text will appear here."}
        </p>
      </div>
    </div>
  );
}
