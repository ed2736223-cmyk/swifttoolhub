import type { Metadata } from "next";
import { getMergedTools } from "@/lib/dynamicTools";
import { getSiteSettings, getToolOverrides } from "@/lib/siteSettings";
import { getToolPrice } from "@/lib/tools";
import ToolPricingPanel from "@/components/admin/ToolPricingPanel";

export const metadata: Metadata = {
  title: "Admin — Tool Pricing & Limits",
  description: "Set each tool's price, usage limit, and ad visibility.",
};

export default async function ToolPricingPage() {
  const [tools, settings, overrides] = await Promise.all([
    getMergedTools(),
    getSiteSettings(),
    getToolOverrides(),
  ]);

  const rows = tools.map((t) => {
    const override = overrides[t.slug];
    return {
      slug: t.slug,
      name: t.name,
      tier: t.tier, // effective tier — admin override already applied
      tierOverride: override?.tier ?? null,
      basePrice: t.tier === "pro" ? getToolPrice(t) : null,
      priceOverride: override?.price ?? null,
      useLimitOverride: override?.useLimit ?? null,
      adsDisabled: override?.adsDisabled ?? false,
    };
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-heading">Tool Pricing &amp; Limits</h1>
      <p className="mt-1 max-w-xl text-sm text-heading/50">
        Every tool, built-in or admin-added. Switch any tool between Free and Pro, set a price
        override for a paid tool (unlock defaults to $5), a custom use-limit for a free tool (or
        unlimited), or turn ads off for one specific tool — leave a field blank to use the site
        default ({settings.defaultFreeUseLimit === -1 ? "unlimited" : settings.defaultFreeUseLimit}{" "}
        uses).
      </p>

      <div className="mt-6">
        <ToolPricingPanel initialTools={rows} defaultUseLimit={settings.defaultFreeUseLimit} />
      </div>
    </div>
  );
}
