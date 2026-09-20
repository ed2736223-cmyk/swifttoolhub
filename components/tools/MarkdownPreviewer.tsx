"use client";

import { useMemo, useState } from "react";

function renderMarkdown(md: string) {
  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  let html = escape(md);

  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/`(.*?)`/g, "<code>$1</code>");
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  html = html.replace(/^- (.*$)/gim, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>)/gims, "<ul>$1</ul>");
  html = html.replace(/\n{2,}/g, "</p><p>");
  html = html.replace(/\n/g, "<br/>");

  return `<p>${html}</p>`;
}

const SAMPLE = "# Hello World\n\nThis is **bold**, this is *italic*, and this is `inline code`.\n\n- First item\n- Second item\n\n[A link](https://example.com)";

export default function MarkdownPreviewer() {
  const [md, setMd] = useState(SAMPLE);
  const html = useMemo(() => renderMarkdown(md), [md]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div>
        <p className="mb-1.5 text-xs font-semibold text-heading/50">MARKDOWN</p>
        <textarea
          value={md}
          onChange={(e) => setMd(e.target.value)}
          rows={12}
          className="w-full resize-y rounded-2xl border border-heading/10 bg-white p-4 font-mono text-xs text-heading outline-none focus:border-brand/50"
        />
      </div>
      <div>
        <p className="mb-1.5 text-xs font-semibold text-heading/50">PREVIEW</p>
        <div
          className="prose prose-sm h-[264px] max-w-none overflow-y-auto rounded-2xl border border-heading/10 bg-white p-4 text-sm text-heading [&_a]:text-brand [&_code]:rounded [&_code]:bg-brand-soft [&_code]:px-1 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-bold [&_h3]:text-base [&_h3]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_p]:mb-2"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
