"use client";

import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(full, 16);
  if (full.length !== 6 || isNaN(num)) return null;
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorConverter() {
  const [hex, setHex] = useState("#7C3AED");
  const [copied, setCopied] = useState<string | null>(null);

  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const hsl = useMemo(() => (rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null), [rgb]);

  const copy = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const rows = rgb && hsl
    ? [
        { label: "HEX", value: hex.toUpperCase() },
        { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
        { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
      ]
    : [];

  return (
    <div>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div
          className="h-24 w-24 shrink-0 rounded-2xl border border-heading/10 shadow-inner"
          style={{ backgroundColor: rgb ? hex : "#ffffff" }}
        />
        <div className="flex w-full items-center gap-3">
          <input
            type="color"
            value={rgb ? hex : "#7C3AED"}
            onChange={(e) => setHex(e.target.value)}
            className="h-11 w-11 cursor-pointer rounded-lg border border-heading/10 bg-white p-1"
          />
          <input
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            placeholder="#7C3AED"
            className="w-full rounded-full border border-heading/10 bg-white px-4 py-2.5 font-mono text-sm outline-none focus:border-brand/50"
          />
        </div>
      </div>

      {!rgb && <p className="mt-3 text-xs text-warn">Enter a valid hex color, e.g. #7C3AED</p>}

      <div className="mt-5 space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-3 rounded-xl bg-white p-3">
            <span className="w-14 shrink-0 text-xs font-semibold text-heading/50">{r.label}</span>
            <p className="flex-1 truncate font-mono text-sm text-heading">{r.value}</p>
            <button
              onClick={() => copy(r.label, r.value)}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand"
              aria-label={`Copy ${r.label}`}
            >
              {copied === r.label ? <Check size={13} /> : <Copy size={13} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
