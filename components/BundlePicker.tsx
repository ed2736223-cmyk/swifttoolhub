"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import PaymentUpload from "@/components/PaymentUpload";
import PayoutMethods from "@/components/PayoutMethods";
import { formatPrice } from "@/lib/pricing";
import { resolveIcon } from "@/lib/iconMap";

type PickerTool = { slug: string; name: string; shortDesc: string; iconName: string; owned: boolean };

export default function BundlePicker({
  tools,
  bundleSize,
  bundlePrice,
}: {
  tools: PickerTool[];
  bundleSize: number;
  bundlePrice: number;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (slug: string) => {
    setSelected((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= bundleSize) return prev; // at the cap, ignore
      return [...prev, slug];
    });
  };

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-heading">
            Pick up to {bundleSize} tools ({selected.length}/{bundleSize} selected)
          </p>
        </div>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {tools.map((t) => {
            const Icon = resolveIcon(t.iconName);
            const checked = selected.includes(t.slug);
            const disabled = t.owned || (!checked && selected.length >= bundleSize);
            return (
              <button
                key={t.slug}
                type="button"
                disabled={disabled}
                onClick={() => toggle(t.slug)}
                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-colors ${
                  t.owned
                    ? "cursor-default border-emerald-200 bg-emerald-50"
                    : checked
                    ? "border-brand/40 bg-brand-softer"
                    : disabled
                    ? "cursor-not-allowed border-heading/10 bg-heading/[0.02] opacity-50"
                    : "border-heading/10 bg-white hover:border-brand/30"
                }`}
              >
                <span
                  className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                    checked || t.owned ? "bg-brand-gradient text-white" : "bg-brand-soft text-brand"
                  }`}
                >
                  {t.owned || checked ? <Check size={15} /> : <Icon size={15} />}
                </span>
                <span>
                  <span className="block text-[13px] font-semibold text-heading">{t.name}</span>
                  <span className="mt-0.5 block text-[11.5px] leading-snug text-heading/50">
                    {t.owned ? "Already unlocked" : t.shortDesc}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-6 lg:col-span-2">
        <div className="rounded-3xl border border-brand/20 bg-brand-softer p-6">
          <p className="text-sm font-semibold text-heading">Your bundle</p>
          {selected.length === 0 ? (
            <p className="mt-2 text-[13px] text-heading/50">Select tools from the list to build your bundle.</p>
          ) : (
            <ul className="mt-3 space-y-1.5">
              {selected.map((slug) => (
                <li key={slug} className="text-[13px] text-heading/70">
                  {tools.find((t) => t.slug === slug)?.name}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-5 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-heading">{formatPrice(bundlePrice)}</span>
            <span className="text-sm text-heading/40">flat, for up to {bundleSize} tools</span>
          </div>
        </div>

        <PayoutMethods />

        <PaymentUpload kind="BUNDLE10" toolSlugs={selected} price={bundlePrice} itemName={`Any ${bundleSize} Tools Bundle`} />
      </div>
    </div>
  );
}
