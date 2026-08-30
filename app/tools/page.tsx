import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Crown, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import AdSlot from "@/components/AdSlot";
import Reveal from "@/components/Reveal";
import { type Tool, getToolPrice } from "@/lib/tools";
import { getMergedTools } from "@/lib/dynamicTools";
import { formatPrice } from "@/lib/pricing";
import { getSiteSettings, getToolOverrides, effectivePrice } from "@/lib/siteSettings";

export const metadata: Metadata = {
  title: "All Tools",
  description: "Browse every SwiftToolHub tool — free tools with no sign-up, plus individually-priced Pro tools.",
};

export default async function ToolsPage() {
  const [tools, settings, overrides] = await Promise.all([
    getMergedTools(),
    getSiteSettings(),
    getToolOverrides(),
  ]);
  const freeTools = tools.filter((t) => t.tier === "free");
  const paidTools = tools.filter((t) => t.tier === "pro");

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-32">
        <Reveal className="text-center">
          <span className="inline-flex items-center rounded-full bg-brand-soft px-4 py-1.5 text-xs font-semibold text-brand">
            All Tools
          </span>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Every Tool In One Place</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-heading/60">
            {freeTools.length} free tools, no sign-up needed, plus {paidTools.length} Pro tools — each
            individually priced.
          </p>
        </Reveal>

        <Reveal delay={1} className="mt-10">
          <AdSlot label="In-feed ad" />
        </Reveal>

        {/* Free Tools */}
        <div className="mt-14">
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-heading">
                <Sparkles size={16} className="text-brand" /> Free Tools
              </h2>
              <Link
                href="/upgrade"
                className="flex items-center gap-1.5 rounded-full bg-brand-soft px-4 py-2 text-[12px] font-semibold text-brand"
              >
                Go unlimited &amp; ad-free for {formatPrice(settings.allAccessPrice)}
              </Link>
            </div>
            <p className="mt-1.5 text-[13px] text-heading/50">
              Free to use, capped at {settings.defaultFreeUseLimit === -1 ? "unlimited" : settings.defaultFreeUseLimit} uses
              per tool. Ads and limits disappear on the All-Access plan.
            </p>
          </Reveal>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {freeTools.map((t, i) => (
              <Reveal key={t.slug} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <ToolCard tool={t} overrides={overrides} />
              </Reveal>
            ))}
          </div>
        </div>

        {/* Paid Tools */}
        <div className="mt-14">
          <Reveal>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-heading">
              <Crown size={16} className="text-brand" /> Paid Tools
            </h2>
            <p className="mt-1.5 text-[13px] text-heading/50">
              Pick any {settings.bundle10Size} of these for {formatPrice(settings.bundle10Price)}, or
              unlock every tool (plus unlimited, ad-free free tools) with All-Access.
            </p>
          </Reveal>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paidTools.map((t, i) => (
              <Reveal key={t.slug} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <ToolCard tool={t} overrides={overrides} />
              </Reveal>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function ToolCard({
  tool,
  overrides,
}: {
  tool: Tool;
  overrides: Awaited<ReturnType<typeof getToolOverrides>>;
}) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex h-full flex-col rounded-2xl border border-heading/10 bg-white p-5 transition-all hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/10"
    >
      {tool.tier === "pro" && (
        <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-brand-gradient px-2.5 py-1 text-[10px] font-semibold text-white">
          <Crown size={10} /> {formatPrice(effectivePrice(overrides, tool.slug, getToolPrice(tool)))}
        </span>
      )}
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
        <tool.icon size={18} />
      </span>
      <h3 className="mt-4 font-semibold text-heading">{tool.name}</h3>
      <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-heading/60">{tool.shortDesc}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand opacity-0 transition-opacity group-hover:opacity-100">
        Open tool <ArrowUpRight size={12} />
      </span>
    </Link>
  );
}
