import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Crown, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToolAdSlot from "@/components/ToolAdSlot";
import Reveal from "@/components/Reveal";
import ScrollProgress from "@/components/ScrollProgress";
import ToolAccessGate from "@/components/ToolAccessGate";
import UpgradeBanner from "@/components/UpgradeBanner";
import { tools as staticTools } from "@/lib/tools";
import { getDbToolBySlug, getDynamicTools } from "@/lib/dynamicTools";
import { resolveIcon } from "@/lib/iconMap";
import { getToolOverrides, effectivePrice, effectiveTier } from "@/lib/siteSettings";
import { getToolComponent } from "@/lib/toolRegistry";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const tool = await getDbToolBySlug(params.slug);
  if (!tool) return {};
  const hasRealComponent = Boolean(getToolComponent(params.slug));
  return {
    title: tool.name,
    description: tool.shortDesc,
    // Admin-added tools without a real component yet show a "coming soon"
    // placeholder — that's thin content, so it stays out of search/AdSense
    // review until a developer registers a real component for it (see
    // lib/toolRegistry.ts), at which point it becomes indexable.
    robots: { index: hasRealComponent, follow: true },
  };
}

export default async function DynamicToolPage({ params }: { params: { slug: string } }) {
  const tool = await getDbToolBySlug(params.slug);
  if (!tool) notFound();

  const Icon = resolveIcon(tool.icon);
  const howToSteps = (tool.howTo || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const contentParagraphs = tool.content
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);

  const [dynamicTools, overrides] = await Promise.all([getDynamicTools(), getToolOverrides()]);
  const related = [...staticTools, ...dynamicTools]
    .filter((t) => t.slug !== tool.slug)
    .slice(0, 3)
    .map((t) => ({ ...t, tier: effectiveTier(overrides, t.slug, t.tier) }));
  const price = effectivePrice(overrides, tool.slug, tool.price);
  const tier = effectiveTier(overrides, tool.slug, tool.tier === "pro" ? "pro" : "free");
  const RealComponent = getToolComponent(tool.slug);

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="mx-auto grid max-w-6xl gap-10 px-4 pb-24 pt-32 lg:grid-cols-[1fr,300px]">
        <section>
          <Reveal>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-brand-soft px-4 py-1.5 text-xs font-semibold text-brand">
                {tool.category}
              </span>
              {tool.tier === "pro" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-gradient px-3 py-1.5 text-xs font-semibold text-white">
                  <Crown size={11} /> Pro
                </span>
              )}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
                <Icon size={22} />
              </span>
              <h1 className="text-3xl font-bold sm:text-4xl">{tool.name}</h1>
            </div>
            <p className="mt-3 max-w-xl text-sm text-heading/60">{tool.shortDesc}</p>
          </Reveal>

          <Reveal delay={1}>
            <div className="mt-8 rounded-3xl border border-heading/10 bg-brand-softer p-5 sm:p-8">
              <ToolAccessGate tool={{ slug: tool.slug, name: tool.name, tier, price }}>
                {RealComponent ? (
                  <RealComponent />
                ) : (
                  <div className="space-y-4">
                    {contentParagraphs.map((p, i) => (
                      <p key={i} className="text-sm leading-relaxed text-heading/70">
                        {p}
                      </p>
                    ))}
                    <div className="flex items-center gap-2.5 rounded-2xl border border-dashed border-brand/30 bg-white p-4">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                        <Sparkles size={14} />
                      </span>
                      <p className="text-[13px] text-heading/60">
                        This tool&apos;s interactive engine is being finalized and will go live here soon.
                      </p>
                    </div>
                  </div>
                )}
              </ToolAccessGate>
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div className="mt-8">
              <ToolAdSlot tool={{ slug: tool.slug, tier }} label="In-content ad" />
            </div>
          </Reveal>

          {howToSteps.length > 0 && (
            <Reveal delay={2} className="mt-10">
              <h2 className="text-lg font-semibold text-heading">How to use this tool</h2>
              <ol className="mt-4 space-y-3">
                {howToSteps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-heading/70">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </Reveal>
          )}
        </section>

        <aside className="lg:sticky lg:top-28 lg:h-fit lg:space-y-6">
          <UpgradeBanner />

          <ToolAdSlot tool={{ slug: tool.slug, tier }} label="Sidebar ad" className="min-h-[250px]" />

          <div className="rounded-2xl border border-heading/10 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-heading/40">
              More tools
            </p>
            <div className="mt-3 space-y-1">
              {related.map((t) => (
                <Link
                  key={t.slug}
                  href={`/tools/${t.slug}`}
                  className="flex items-center justify-between gap-2 rounded-xl px-2 py-2.5 text-sm text-heading/70 transition-colors hover:bg-brand-soft hover:text-brand"
                >
                  <span className="flex items-center gap-1.5">
                    {t.name}
                    {t.tier === "pro" && <Crown size={11} className="text-brand" />}
                  </span>
                  <ArrowRight size={13} className="shrink-0" />
                </Link>
              ))}
            </div>
            <Link
              href="/tools"
              className="mt-3 flex items-center justify-center gap-1 rounded-full bg-brand-soft px-4 py-2 text-xs font-semibold text-brand"
            >
              View all tools <ArrowRight size={12} />
            </Link>
          </div>
        </aside>
      </main>
      <Footer />
    </>
  );
}
