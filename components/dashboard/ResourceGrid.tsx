"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Crown, Lock, CheckCircle2 } from "lucide-react";
import { resolveIcon } from "@/lib/iconMap";
import { formatPrice } from "@/lib/pricing";

// Plain, serializable shape only — never pass a Tool's `icon` (a component/
// function) from a server component into this client component. Resolve it
// to a string name on the server (nameForIcon) and back to a component here
// (resolveIcon), so nothing but plain data crosses the server/client boundary.
export type ResourceTool = {
  slug: string;
  name: string;
  shortDesc: string;
  category: string;
  price: number;
  iconName: string;
};

export default function ResourceGrid({
  tools,
  isPro,
  unlockedSlugs,
}: {
  tools: ResourceTool[];
  isPro: boolean;
  unlockedSlugs: string[];
}) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tools;
    return tools.filter(
      (t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
    );
  }, [tools, query]);

  return (
    <div className="rounded-3xl border border-heading/10 bg-white p-5 sm:p-6">
      <div className="relative">
        <Search size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-heading/30" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search paid tools…"
          className="w-full rounded-full border border-heading/10 bg-brand-softer py-3 pl-11 pr-4 text-sm text-heading placeholder:text-heading/40 focus:border-brand/40 focus:outline-none"
        />
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 text-center text-sm text-heading/40">No paid tools match &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((t) => {
            const unlocked = isPro || unlockedSlugs.includes(t.slug);
            const Icon = resolveIcon(t.iconName);
            return (
              <div
                key={t.slug}
                className="flex flex-col items-center rounded-2xl border border-heading/10 p-5 text-center transition-colors hover:border-brand/30"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand">
                  <Icon size={20} />
                </span>
                <p className="mt-3 flex items-center gap-1 text-sm font-semibold text-heading">
                  {t.name}
                  <Crown size={11} className="text-brand" />
                </p>
                <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-heading/50">
                  {t.shortDesc}
                </p>
                <p className="mt-2 text-xs font-semibold text-brand">
                  {unlocked ? "Unlocked" : formatPrice(t.price)}
                </p>
                {unlocked ? (
                  <Link
                    href={`/tools/${t.slug}`}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-600"
                  >
                    <CheckCircle2 size={12} /> Access Tool
                  </Link>
                ) : (
                  <Link
                    href="/upgrade/bundle-10"
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-brand-gradient px-4 py-2 text-xs font-semibold text-white transition-colors"
                  >
                    <Lock size={11} /> Unlock for {formatPrice(t.price)}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
