import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToolAdSlot from "@/components/ToolAdSlot";
import Reveal from "@/components/Reveal";
import ScrollProgress from "@/components/ScrollProgress";
import ToolAccessGate from "@/components/ToolAccessGate";
import UpgradeBanner from "@/components/UpgradeBanner";
import JsonLd from "@/components/JsonLd";
import { tools, getToolPrice, type Tool } from "@/lib/tools";
import { SITE_URL } from "@/lib/site";
import { getToolOverrides, effectivePrice, effectiveTier } from "@/lib/siteSettings";
import Link from "next/link";
import { ArrowRight, Crown } from "lucide-react";
import type { ReactNode } from "react";

export default async function ToolShell({
  tool,
  children,
  howTo,
  faqs,
}: {
  tool: Tool;
  children: ReactNode;
  howTo: string[];
  faqs: { q: string; a: string }[];
}) {
  const overrides = await getToolOverrides();
  const related = tools
    .filter((t) => t.slug !== tool.slug)
    .slice(0, 3)
    .map((t) => ({ ...t, tier: effectiveTier(overrides, t.slug, t.tier) }));
  const price = effectivePrice(overrides, tool.slug, getToolPrice(tool));
  const tier = effectiveTier(overrides, tool.slug, tool.tier);

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.shortDesc,
    url: `${SITE_URL}/tools/${tool.slug}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (runs in browser)",
    offers: {
      "@type": "Offer",
      price: tier === "pro" ? String(price) : "0",
      priceCurrency: "USD",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` },
      { "@type": "ListItem", position: 3, name: tool.name, item: `${SITE_URL}/tools/${tool.slug}` },
    ],
  };

  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <>
      <JsonLd data={softwareSchema} />
      <JsonLd data={breadcrumbSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      <ScrollProgress />
      <Navbar />
      <main className="mx-auto grid max-w-6xl gap-10 px-4 pb-24 pt-32 lg:grid-cols-[1fr,300px]">
        <section>
          <Reveal>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-brand-soft px-4 py-1.5 text-xs font-semibold text-brand">
                {tool.category}
              </span>
              {tier === "pro" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-gradient px-3 py-1.5 text-xs font-semibold text-white">
                  <Crown size={11} /> Pro
                </span>
              )}
            </div>
            <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{tool.name}</h1>
            <p className="mt-2 max-w-xl text-sm text-heading/60">{tool.shortDesc}</p>
          </Reveal>

          <Reveal delay={1}>
            <div className="mt-8 rounded-3xl border border-heading/10 bg-brand-softer p-5 sm:p-8">
              <ToolAccessGate tool={{ slug: tool.slug, name: tool.name, tier, price }}>
                {children}
              </ToolAccessGate>
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div className="mt-8">
              <ToolAdSlot tool={{ slug: tool.slug, tier }} label="In-content ad" />
            </div>
          </Reveal>

          <Reveal delay={2} className="mt-10">
            <h2 className="text-lg font-semibold text-heading">How to use this tool</h2>
            <ol className="mt-4 space-y-3">
              {howTo.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-heading/70">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={3} className="mt-10">
            <h2 className="text-lg font-semibold text-heading">Frequently asked questions</h2>
            <div className="mt-4 space-y-4">
              {faqs.map((f) => (
                <div key={f.q} className="rounded-2xl border border-heading/10 bg-white p-4">
                  <p className="text-sm font-semibold text-heading">{f.q}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-heading/60">{f.a}</p>
                </div>
              ))}
            </div>
          </Reveal>
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
