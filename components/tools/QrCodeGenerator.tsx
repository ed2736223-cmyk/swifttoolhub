"use client";

import { useState } from "react";
import { Download, Loader2, QrCode as QrIcon } from "lucide-react";

export default function QrCodeGenerator() {
  const [text, setText] = useState("");
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const generate = async () => {
    if (!text.trim()) return;
    setBusy(true);
    try {
      const QRCode = (await import("qrcode")).default;
      const url = await QRCode.toDataURL(text, {
        width: 320,
        margin: 1,
        color: { dark: "#241242", light: "#FFFFFF" },
      });
      setDataUrl(url);
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "swifttoolhub-qr-code.png";
    a.click();
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
          placeholder="Enter a URL or text…"
          className="w-full rounded-full border border-heading/10 bg-white px-4 py-3 text-sm outline-none focus:border-brand/50"
        />
        <button
          onClick={generate}
          disabled={busy || !text.trim()}
          className="btn-glow flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : <QrIcon size={15} />}
          Generate
        </button>
      </div>

      <div className="mt-6 flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-2xl bg-white p-6">
        {dataUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dataUrl} alt="Generated QR code" className="h-56 w-56 rounded-xl" />
            <button
              onClick={download}
              className="flex items-center gap-2 rounded-full bg-heading px-5 py-2.5 text-xs font-semibold text-white"
            >
              <Download size={14} /> Download PNG
            </button>
          </>
        ) : (
          <p className="text-sm text-heading/40">Your QR code will appear here</p>
        )}
      </div>
    </div>
  );
}
