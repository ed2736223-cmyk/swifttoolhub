"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";

export default function SlugGenerator() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [lowercase, setLowercase] = useState(true);
  const [separator, setSeparator] = useState("-");

  const generateSlug = (text: string) => {
    let slug = text
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^\w\s-]/g, "") // Remove non-word characters
      .replace(/\s+/g, separator); // Replace spaces with separator

    if (separator) {
      slug = slug.replace(new RegExp(`\\${separator}+`, "g"), separator); // Collapse duplicate separators
    }

    return lowercase ? slug.toLowerCase() : slug;
  };

  const slug = generateSlug(input);

  const handleCopy = () => {
    if (!slug) return;
    navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title-input" className="block text-sm font-medium text-slate-700">
          Page or Article Title
        </label>
        <input
          id="title-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., 10 Tips for Better SEO in 2026!"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 placeholder-slate-400 shadow-sm transition"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={lowercase}
              onChange={(e) => setLowercase(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            Lowercase
          </label>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Separator:</span>
            <select
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              aria-label="Slug separator"
              className="px-2 py-1 rounded border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="-">Hyphen (-)</option>
              <option value="_">Underscore (_)</option>
              <option value="">None</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setInput("")}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          Generated URL Slug
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 font-mono text-sm text-slate-800 overflow-x-auto select-all">
            {slug || <span className="text-slate-400 font-sans italic">Your slug will appear here...</span>}
          </div>
          <button
            onClick={handleCopy}
            disabled={!slug}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition shadow-sm ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
