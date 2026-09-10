"use client";

import { useRef, useState } from "react";
import {
  Upload,
  ImageIcon,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { usePaymentStatus, type PaymentKind } from "@/lib/usePaymentStatus";
import { formatPrice } from "@/lib/pricing";

const MAX_FILE_BYTES = 3 * 1024 * 1024; // 3MB

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

export default function PaymentUpload({
  kind = "PRO",
  toolSlugs,
  price,
  itemName = "SwiftToolHub All-Access",
}: {
  kind?: PaymentKind;
  /** Required when kind === "BUNDLE10" — the tools the user picked. */
  toolSlugs?: string[];
  price: number;
  itemName?: string;
}) {
  const { loading, request, refresh, plan, unlockedTools } = usePaymentStatus({
    kind,
    toolSlug: kind === "TOOL" ? toolSlugs?.[0] : undefined,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const alreadyUnlocked =
    plan === "PRO" ||
    ((kind === "BUNDLE10" || kind === "TOOL") &&
      !!toolSlugs &&
      toolSlugs.length > 0 &&
      toolSlugs.every((s) => unlockedTools.includes(s)));

  const canSubmit = kind === "PRO" || (toolSlugs && toolSlugs.length > 0);

  const handleFile = async (file: File | undefined) => {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (PNG, JPG, or WEBP).");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError("That image is larger than 3MB — please upload a smaller screenshot.");
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setPreview(dataUrl);
  };

  const submit = async () => {
    if (!preview) {
      setError("Please attach your payment screenshot first.");
      return;
    }
    if (!canSubmit) {
      setError("Pick at least one tool first.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/payment-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ screenshot: preview, note, kind, toolSlugs }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setPreview(null);
      setNote("");
      await refresh();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="h-56 animate-pulse rounded-3xl bg-heading/5" />;
  }

  if (alreadyUnlocked) {
    return (
      <div className="flex items-center gap-3 rounded-3xl border border-heading/10 bg-white p-6">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white">
          <ShieldCheck size={20} />
        </span>
        <div>
          <p className="text-sm font-semibold text-heading">You already have access</p>
          <p className="mt-0.5 text-[13px] text-heading/60">
            {kind === "PRO"
              ? "Every tool on SwiftToolHub is unlocked, unlimited, and ad-free for you."
              : "The tools you picked are unlocked on your account."}
          </p>
        </div>
      </div>
    );
  }

  if (request?.status === "PENDING") {
    return (
      <div className="rounded-3xl border border-amber-300/40 bg-amber-50 p-6 text-center sm:p-8">
        <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-amber-400/20 text-amber-600">
          <Clock size={20} />
        </span>
        <p className="mt-3 text-sm font-semibold text-heading">Payment under review</p>
        <p className="mx-auto mt-1 max-w-sm text-[13px] text-heading/60">
          We&apos;ve got your screenshot for {itemName} ({formatPrice(request.amount)}). An admin will
          verify it and your account will update automatically — usually within a few hours.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-heading/10 bg-white p-6 sm:p-8">
      <p className="text-sm font-semibold text-heading">Upload your payment screenshot</p>
      <p className="mt-1 text-[13px] text-heading/60">
        After sending {formatPrice(price)} for {itemName} using the details above, upload a clear
        screenshot of the confirmation below. An admin will review it and unlock it on your account.
      </p>

      {request?.status === "REJECTED" && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
          <XCircle size={15} className="mt-0.5 shrink-0 text-red-500" />
          <p className="text-[13px] text-red-700">
            Your last screenshot couldn&apos;t be verified. Please double-check the payment and upload a
            new screenshot.
          </p>
        </div>
      )}

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-heading/15 bg-heading/[0.02] px-4 py-8 text-center transition-colors hover:border-brand/40"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Payment screenshot preview" className="max-h-48 rounded-lg object-contain" />
        ) : (
          <>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-soft text-brand">
              <ImageIcon size={18} />
            </span>
            <p className="text-[13px] font-medium text-heading">Click to choose a screenshot</p>
            <p className="text-[11px] text-heading/40">PNG, JPG, or WEBP — up to 3MB</p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional note (e.g. transaction ID, sender name)"
        rows={2}
        maxLength={300}
        className="mt-3 w-full resize-none rounded-xl border border-heading/10 px-3 py-2 text-[13px] text-heading placeholder:text-heading/40 focus:border-brand/40 focus:outline-none"
      />

      {error && <p className="mt-2 text-[13px] text-red-600">{error}</p>}

      <button
        onClick={submit}
        disabled={submitting || !preview || !canSubmit}
        className="btn-glow mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand-gradient px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        {submitting ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
        {submitting ? "Submitting…" : "Submit For Review"}
      </button>

      {request?.status === "REJECTED" && (
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-heading/40">
          <CheckCircle2 size={12} /> Resubmitting replaces your previous screenshot with this one.
        </p>
      )}
    </div>
  );
}
