"use client";

import { useState } from "react";
import { Loader2, Check, Crown, Sparkles, Search } from "lucide-react";

type ToolRow = {
  slug: string;
  name: string;
  tier: "free" | "pro"; // effective tier (override applied, if any)
  tierOverride: "free" | "pro" | null; // null = following the tool's own default
  basePrice: number | null;
  priceOverride: number | null;
  useLimitOverride: number | null;
  adsDisabled: boolean;
};

export default function ToolPricingPanel({
  initialTools,
  defaultUseLimit,
}: {
  initialTools: ToolRow[];
  defaultUseLimit: number;
}) {
  const [tools, setTools] = useState(initialTools);
  const [query, setQuery] = useState("");
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);

  const visible = tools.filter((t) => t.name.toLowerCase().includes(query.trim().toLowerCase()));

  const update = (slug: string, patch: Partial<ToolRow>) => {
    setTools((prev) => prev.map((t) => (t.slug === slug ? { ...t, ...patch } : t)));
  };

  const save = async (row: ToolRow) => {
    setSavingSlug(row.slug);
    try {
      const res = await fetch("/api/admin/tool-configs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: row.slug,
          tier: row.tierOverride,
          price: row.priceOverride,
          useLimit: row.useLimitOverride,
          adsDisabled: row.adsDisabled,
        }),
      });
      if (res.ok) {
        setSavedSlug(row.slug);
        setTimeout(() => setSavedSlug(null), 2000);
      }
    } finally {
      setSavingSlug(null);
    }
  };

  return (
    <div className="rounded-3xl border border-heading/10 bg-white">
      <div className="border-b border-heading/10 p-4">
        <div className="relative max-w-xs">
          <Search size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-heading/30" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools…"
            className="w-full rounded-full border border-heading/10 py-2 pl-9 pr-4 text-xs focus:border-brand/40 focus:outline-none"
          />
        </div>
      </div>

      <div className="divide-y divide-heading/5">
        {visible.map((t) => (
          <div key={t.slug} className="flex flex-wrap items-center gap-3 p-4 sm:flex-nowrap">
            <div className="flex min-w-[160px] items-center gap-2">
              {t.tier === "pro" ? (
                <Crown size={14} className="shrink-0 text-brand" />
              ) : (
                <Sparkles size={14} className="shrink-0 text-heading/30" />
              )}
              <span className="truncate text-[13px] font-semibold text-heading">{t.name}</span>
            </div>

            <div className="flex items-center gap-1 rounded-full bg-heading/5 p-0.5">
              {(["free", "pro"] as const).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => update(t.slug, { tier, tierOverride: tier })}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize transition-colors ${
                    t.tier === tier ? "bg-white text-heading shadow-sm" : "text-heading/40"
                  }`}
                >
                  {tier === "pro" && <Crown size={10} />}
                  {tier}
                </button>
              ))}
            </div>

            {t.tier === "pro" ? (
              <label className="flex items-center gap-1.5 text-[11.5px] text-heading/50">
                Price
                <input
                  type="number"
                  min={0.5}
                  step="0.5"
                  placeholder={String(t.basePrice)}
                  value={t.priceOverride ?? ""}
                  onChange={(e) =>
                    update(t.slug, { priceOverride: e.target.value === "" ? null : Number(e.target.value) })
                  }
                  className="w-20 rounded-lg border border-heading/10 px-2 py-1.5 text-[12px] focus:border-brand/40 focus:outline-none"
                />
              </label>
            ) : (
              <label className="flex items-center gap-1.5 text-[11.5px] text-heading/50">
                Use limit
                <input
                  type="number"
                  min={-1}
                  placeholder={String(defaultUseLimit)}
                  value={t.useLimitOverride ?? ""}
                  onChange={(e) =>
                    update(t.slug, { useLimitOverride: e.target.value === "" ? null : Number(e.target.value) })
                  }
                  className="w-20 rounded-lg border border-heading/10 px-2 py-1.5 text-[12px] focus:border-brand/40 focus:outline-none"
                />
                <span className="text-heading/30">(-1 = unlimited)</span>
              </label>
            )}

            <label className="flex items-center gap-1.5 text-[11.5px] text-heading/50">
              <input
                type="checkbox"
                checked={t.adsDisabled}
                onChange={(e) => update(t.slug, { adsDisabled: e.target.checked })}
                className="h-3.5 w-3.5 rounded border-heading/20"
              />
              No ads on this tool
            </label>

            <button
              onClick={() => save(t)}
              disabled={savingSlug === t.slug}
              className="ml-auto flex items-center gap-1.5 rounded-full bg-brand-soft px-3.5 py-1.5 text-[11.5px] font-semibold text-brand disabled:opacity-50"
            >
              {savingSlug === t.slug ? (
                <Loader2 size={12} className="animate-spin" />
              ) : savedSlug === t.slug ? (
                <Check size={12} />
              ) : null}
              {savedSlug === t.slug ? "Saved" : "Save"}
            </button>
          </div>
        ))}
        {visible.length === 0 && (
          <p className="p-8 text-center text-sm text-heading/40">No tools match &ldquo;{query}&rdquo;.</p>
        )}
      </div>
    </div>
  );
}
