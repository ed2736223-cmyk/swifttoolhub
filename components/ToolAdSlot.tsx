"use client";

import AdSlot from "@/components/AdSlot";
import { usePaymentStatus } from "@/lib/usePaymentStatus";
import { useSiteSettings } from "@/lib/useSiteSettings";

/**
 * Same as AdSlot, but hides itself once there's no reason to show an ad:
 *  - Paid tool the visitor has unlocked (via a Bundle-10 purchase or the
 *    All-Access plan) — paid tools show no ads once unlocked.
 *  - Any tool, free or paid, once the visitor is on the All-Access plan —
 *    that plan removes ads everywhere on the site.
 *  - Any tool an admin has explicitly turned ads off for (Admin → Tool
 *    Settings), regardless of plan.
 */
export default function ToolAdSlot({
  tool,
  label,
  className,
}: {
  tool: { slug: string; tier: "free" | "pro" };
  label?: string;
  className?: string;
}) {
  const { loading, plan, unlockedTools } = usePaymentStatus({ kind: "PRO" });
  const { adsDisabledFor } = useSiteSettings();

  if (loading) return null; // avoid a flash of an ad that then disappears

  const isPro = plan === "PRO";
  const adFreeForThisTool =
    isPro || (tool.tier === "pro" && unlockedTools.includes(tool.slug)) || adsDisabledFor(tool.slug);

  if (adFreeForThisTool) return null;

  return <AdSlot label={label} className={className} />;
}
