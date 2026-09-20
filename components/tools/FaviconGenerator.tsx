"use client";

import { useState } from "react";
import { Upload, Download } from "lucide-react";

const SIZES = [16, 32, 48, 180];

export default function FaviconGenerator() {
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [previews, setPreviews] = useState<{ size: number; url: string }[]>([]);

  const onFile = async (file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSourceUrl(url);

    const img = new Image();
    img.src = url;
    await new Promise((res) => (img.onload = res));

    const results = SIZES.map((size) => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, size, size);
      return { size, url: canvas.toDataURL("image/png") };
    });
    setPreviews(results);
  };

  const download = (url: string, size: number) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `favicon-${size}x${size}.png`;
    a.click();
  };

  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand/30 bg-white px-6 py-10 text-center transition-colors hover:border-brand/60">
        <Upload size={22} className="text-brand" />
        <span className="text-sm font-medium text-heading">Click to upload a source image</span>
        <span className="text-xs text-heading/40">A square image works best</span>
        <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0] || null)} />
      </label>

      {previews.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {previews.map((p) => (
            <div key={p.size} className="rounded-2xl bg-white p-4 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={`${p.size}x${p.size} favicon`} className="mx-auto" style={{ width: Math.min(p.size, 64), height: Math.min(p.size, 64) }} />
              <p className="mt-2 text-[11px] text-heading/50">{p.size}×{p.size}</p>
              <button
                onClick={() => download(p.url, p.size)}
                className="mt-2 flex items-center gap-1 mx-auto rounded-full bg-brand-soft px-3 py-1.5 text-[11px] font-semibold text-brand"
              >
                <Download size={11} /> Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
