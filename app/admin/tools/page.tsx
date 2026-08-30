import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { tools } from "@/lib/tools";
import { Crown, Wrench, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin — Tool Usage",
  description: "See which tools are actually being used.",
};

export default async function AdminToolsPage() {
  const usage = await prisma.toolUsage.groupBy({
    by: ["toolSlug"],
    _sum: { count: true },
    _count: { userId: true },
  });

  const usageBySlug = new Map(usage.map((u) => [u.toolSlug, u]));

  const rows = tools
    .map((t) => {
      const u = usageBySlug.get(t.slug);
      return {
        ...t,
        runs: u?._sum.count ?? 0,
        users: u?._count.userId ?? 0,
      };
    })
    .sort((a, b) => b.runs - a.runs);

  const totalRuns = rows.reduce((sum, r) => sum + r.runs, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading">Tool Usage</h1>
      <p className="mt-1 text-sm text-heading/50">
        Real usage counts recorded in <code className="text-[12px]">ToolUsage</code>, across all{" "}
        {tools.length} tools.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-md">
        <div className="rounded-2xl border border-heading/10 bg-white p-4">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-400/15 text-emerald-600">
            <TrendingUp size={14} />
          </span>
          <p className="mt-2 text-xl font-bold text-heading">{totalRuns}</p>
          <p className="text-[11px] text-heading/50">Total runs logged</p>
        </div>
        <div className="rounded-2xl border border-heading/10 bg-white p-4">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-soft text-brand">
            <Wrench size={14} />
          </span>
          <p className="mt-2 text-xl font-bold text-heading">{tools.length}</p>
          <p className="text-[11px] text-heading/50">Tools live</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-heading/10 bg-white">
        <div className="hidden grid-cols-12 gap-2 border-b border-heading/10 bg-heading/[0.02] px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-heading/40 sm:grid">
          <div className="col-span-6">Tool</div>
          <div className="col-span-2 text-center">Tier</div>
          <div className="col-span-2 text-center">Users</div>
          <div className="col-span-2 text-center">Runs</div>
        </div>

        {rows.map((r) => (
          <div
            key={r.slug}
            className="grid grid-cols-2 items-center gap-2 border-b border-heading/5 px-5 py-3.5 last:border-0 sm:grid-cols-12"
          >
            <div className="col-span-2 flex items-center gap-2.5 sm:col-span-6">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-heading/5 text-heading/60">
                <r.icon size={15} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-heading">{r.name}</p>
                <p className="truncate text-[11px] text-heading/40">{r.category}</p>
              </div>
            </div>
            <div className="hidden justify-center sm:col-span-2 sm:flex">
              {r.tier === "pro" ? (
                <span className="flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand">
                  <Crown size={10} /> Pro
                </span>
              ) : (
                <span className="rounded-full bg-heading/5 px-2.5 py-1 text-[11px] font-semibold text-heading/50">
                  Free
                </span>
              )}
            </div>
            <div className="hidden text-center text-[13px] text-heading/60 sm:col-span-2 sm:block">
              {r.users}
            </div>
            <div className="hidden text-center text-[13px] font-semibold text-heading sm:col-span-2 sm:block">
              {r.runs}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
