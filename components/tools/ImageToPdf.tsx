"use client";

import { useState } from "react";
import { Upload, Download, X, Loader2 } from "lucide-react";

type Img = { file: File; url: string };

export default function ImageToPdf() {
  const [images, setImages] = useState<Img[]>([]);
  const [busy, setBusy] = useState(false);

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const next: Img[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setImages((prev) => [...prev, ...next]);
  };

  const remove = (i: number) => setImages((prev) => prev.filter((_, idx) => idx !== i));

  const convert = async () => {
    if (images.length === 0) return;
    setBusy(true);
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ unit: "pt" });

      for (let i = 0; i < images.length; i++) {
        const dataUrl = await fileToDataUrl(images[i].file);
        const dims = await imageDims(dataUrl);

        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();
        const ratio = Math.min(pageW / dims.w, pageH / dims.h);
        const w = dims.w * ratio;
        const h = dims.h * ratio;
        const x = (pageW - w) / 2;
        const y = (pageH - h) / 2;

        if (i > 0) pdf.addPage();
        pdf.addImage(dataUrl, "JPEG", x, y, w, h);
      }

      pdf.save("swifttoolhub-images.pdf");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand/30 bg-white px-6 py-10 text-center transition-colors hover:border-brand/60">
        <Upload size={22} className="text-brand" />
        <span className="text-sm font-medium text-heading">Click to upload images</span>
        <span className="text-xs text-heading/40">JPG or PNG, multiple files supported</span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
      </label>

      {images.length > 0 && (
        <>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {images.map((img, i) => (
              <div key={i} className="group relative aspect-square overflow-hidden rounded-xl bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="h-full w-full object-cover" />
                <button
                  onClick={() => remove(i)}
                  className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={convert}
            disabled={busy}
            className="btn-glow mt-5 flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
            {busy ? "Building PDF…" : `Convert ${images.length} Image${images.length > 1 ? "s" : ""} to PDF`}
          </button>
        </>
      )}
    </div>
  );
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function imageDims(dataUrl: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.width, h: img.height });
    img.src = dataUrl;
  });
}
