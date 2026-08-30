"use client";

import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";

export default function MetaTagGenerator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [author, setAuthor] = useState("");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    const lines = [
      title && `<title>${title}</title>`,
      description && `<meta name="description" content="${description}" />`,
      keywords && `<meta name="keywords" content="${keywords}" />`,
      author && `<meta name="author" content="${author}" />`,
      title && `<meta property="og:title" content="${title}" />`,
      description && `<meta property="og:description" content="${description}" />`,
    ].filter(Boolean);
    return lines.join("\n");
  }, [title, description, keywords, author]);

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Page title"
          className="rounded-xl border border-heading/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand/50"
        />
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author (optional)"
          className="rounded-xl border border-heading/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand/50"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Meta description"
          rows={2}
          className="sm:col-span-2 rounded-xl border border-heading/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand/50"
        />
        <input
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="Keywords, comma separated"
          className="sm:col-span-2 rounded-xl border border-heading/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand/50"
        />
      </div>

      <div className="mt-4 rounded-2xl bg-white p-4">
        <div className="mb-2 flex justify-end">
          {output && (
            <button onClick={copy} className="flex items-center gap-1 text-xs font-semibold text-brand">
              {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs text-heading/80">
          {output || "Your meta tags will appear here."}
        </pre>
      </div>
    </div>
  );
}
