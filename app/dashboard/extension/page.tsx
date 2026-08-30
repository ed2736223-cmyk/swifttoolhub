import type { Metadata } from "next";
import { Chrome, Download, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Download Extension",
  description: "Get the SwiftToolHub browser extension.",
};

export default function ExtensionPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-bold text-heading">Download Extension</h1>
      <p className="mt-1 text-sm text-heading/50">Use SwiftToolHub tools without leaving your browser.</p>

      <div className="mt-6 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-heading/15 bg-white p-10 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand">
          <Chrome size={26} />
        </span>
        <div>
          <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-heading">
            <Sparkles size={13} className="text-brand" /> Coming soon
          </p>
          <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-heading/55">
            The SwiftToolHub browser extension is in the works. Once it&apos;s published, you&apos;ll be
            able to grab it right from here.
          </p>
        </div>
        <button
          disabled
          className="flex cursor-not-allowed items-center gap-2 rounded-full bg-heading/10 px-5 py-2.5 text-sm font-semibold text-heading/40"
        >
          <Download size={14} /> Not available yet
        </button>
      </div>
    </div>
  );
}
