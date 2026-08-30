"use client";

import { useState } from "react";
import { Upload, Download, Loader2 } from "lucide-react";

export default function ImageCompressor() {
  const [original, setOriginal] = useState<{ url: string; size: number } | null>(null);
  const [compressed, setCompressed] = useState<{ url: string; size: number } | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [busy, setBusy] = useState(false);

  const onFile = (file: File | null) => {
    if (!file) return;
    setOriginal({ url: URL.createObjectURL(file), size: file.size });
    setCompressed(null);
  };

  const compress = async () => {
    if (!original) return;
    setBusy(true);
    const img = new Image();
    img.src = original.url;
    await new Promise((res) => (img.onload = res));

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    const size = Math.round((dataUrl.length * 3) / 4);
    setCompressed({ url: dataUrl, size });
    setBusy(false);
  };

  const download = () => {
    if (!compressed) return;
    const a = document.createElement("a");
    a.href = compressed.url;
    a.download = "compressed.jpg";
    a.click();
  };

  const kb = (n: number) => (n / 1024).toFixed(0) + " KB";

  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand/30 bg-white px-6 py-10 text-center transition-colors hover:border-brand/60">
        <Upload size={22} className="text-brand" />
        <span className="text-sm font-medium text-heading">Click to upload an image</span>
        <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0] || null)} />
      </label>

      {original && (
        <>
          <div className="mt-5 flex items-center justify-between text-sm">
            <span className="font-medium text-heading">Quality: {Math.round(quality * 100)}%</span>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-1/2 accent-brand"
            />
          </div>

          <button
            onClick={compress}
            disabled={busy}
            className="btn-glow mt-4 flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {busy ? <Loader2 size={15} className="animate-spin" /> : null}
            {busy ? "Compressing…" : "Compress Image"}
          </button>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-4 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={original.url} alt="Original" className="mx-auto max-h-40 rounded-lg object-contain" />
              <p className="mt-2 text-xs text-heading/50">Original — {kb(original.size)}</p>
            </div>
            <div className="rounded-2xl bg-white p-4 text-center">
              {compressed ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={compressed.url} alt="Compressed" className="mx-auto max-h-40 rounded-lg object-contain" />
                  <p className="mt-2 text-xs text-heading/50">Compressed — {kb(compressed.size)}</p>
                  <button
                    onClick={download}
                    className="mt-3 flex items-center gap-1.5 mx-auto rounded-full bg-heading px-4 py-2 text-xs font-semibold text-white"
                  >
                    <Download size={13} /> Download
                  </button>
                </>
              ) : (
                <p className="flex h-40 items-center justify-center text-xs text-heading/40">
                  Compressed preview appears here
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
