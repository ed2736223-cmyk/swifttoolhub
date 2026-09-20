"use client";

import { useState } from "react";
import { GitCompare } from "lucide-react";

type Row = { type: "same" | "added" | "removed"; text: string };

function diffLines(a: string, b: string): Row[] {
  const linesA = a.split("\n");
  const linesB = b.split("\n");
  const setB = new Set(linesB);
  const setA = new Set(linesA);
  const rows: Row[] = [];

  linesA.forEach((line) => {
    rows.push({ type: setB.has(line) ? "same" : "removed", text: line });
  });
  linesB.forEach((line) => {
    if (!setA.has(line)) rows.push({ type: "added", text: line });
  });

  return rows;
}

export default function TextDiffChecker() {
  const [a, setA] = useState("Hello world\nThis is line two\nUnchanged line");
  const [b, setB] = useState("Hello there\nThis is line two\nUnchanged line");
  const [rows, setRows] = useState<Row[]>([]);

  const compare = () => setRows(diffLines(a, b));

  const styles: Record<Row["type"], string> = {
    same: "bg-white text-heading/70",
    removed: "bg-red-50 text-red-600 line-through decoration-red-300",
    added: "bg-green-50 text-green-700",
  };

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-xs font-semibold text-heading/50">ORIGINAL</p>
          <textarea
            value={a}
            onChange={(e) => setA(e.target.value)}
            rows={7}
            className="w-full resize-y rounded-2xl border border-heading/10 bg-white p-4 font-mono text-xs text-heading outline-none focus:border-brand/50"
          />
        </div>
        <div>
          <p className="mb-1.5 text-xs font-semibold text-heading/50">CHANGED</p>
          <textarea
            value={b}
            onChange={(e) => setB(e.target.value)}
            rows={7}
            className="w-full resize-y rounded-2xl border border-heading/10 bg-white p-4 font-mono text-xs text-heading outline-none focus:border-brand/50"
          />
        </div>
      </div>

      <button
        onClick={compare}
        className="btn-glow mt-4 flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white"
      >
        <GitCompare size={15} /> Compare
      </button>

      {rows.length > 0 && (
        <div className="mt-4 space-y-0.5 rounded-2xl bg-white p-4 font-mono text-xs">
          {rows.map((r, i) => (
            <div key={i} className={`rounded px-2 py-1 ${styles[r.type]}`}>
              {r.type === "added" ? "+ " : r.type === "removed" ? "− " : "  "}
              {r.text || " "}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
