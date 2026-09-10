import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UpgradeButton from "@/components/UpgradeButton";
import ResourceGrid from "@/components/dashboard/ResourceGrid";
import { CheckCircle2, Clock, XCircle, Crown } from "lucide-react";
import { getMergedTools } from "@/lib/dynamicTools";
import { getToolPrice } from "@/lib/tools";
import { nameForIcon } from "@/lib/iconMap";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/pricing";
import { getSiteSettings, getToolOverrides, effectivePrice } from "@/lib/siteSettings";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your SwiftToolHub account, paid tools and plan.",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const [tools, settings, overrides] = await Promise.all([
    getMergedTools(),
    getSiteSettings(),
    getToolOverrides(),
  ]);

  // The dashboard is a paid-tools portal — free tools are already open to
  // everyone from the public tools listing, so only paid tools show up here.
  const paidTools = tools.filter((t) => t.tier === "pro");

  // Icon *components* can't be passed from this server component into the
  // "use client" ResourceGrid below — only plain, serializable data can
  // cross that boundary. Resolve each tool's icon to a string name here.
  const resourceTools = paidTools.map((t) => ({
    slug: t.slug,
    name: t.name,
    shortDesc: t.shortDesc,
    category: t.category,
    price: effectivePrice(overrides, t.slug, getToolPrice(t)),
    iconName: nameForIcon(t.icon),
  }));

  const isPro = session?.user.plan === "PRO";

  const [latestRequest, purchases] = session?.user?.id
    ? await Promise.all([
        !isPro
          ? prisma.paymentRequest.findFirst({
              where: { userId: session.user.id, kind: "PRO" },
              orderBy: { createdAt: "desc" },
              select: { status: true },
            })
          : Promise.resolve(null),
        prisma.toolPurchase.findMany({
          where: { userId: session.user.id },
          select: { toolSlug: true },
        }),
      ])
    : [null, []];

  const unlockedSlugs = purchases.map((p) => p.toolSlug);
  const unlockedCount = isPro ? paidTools.length : unlockedSlugs.length;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Plan status */}
      <h1 className="text-xl font-bold text-heading">Your Plan</h1>
      <div className="mt-4 rounded-3xl border border-heading/10 bg-white p-5 sm:p-6">
        {isPro ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3.5">
            <span className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <Crown size={15} /> All-Access — Unlimited & Ad-Free
            </span>
            <CheckCircle2 size={16} className="text-emerald-600" />
          </div>
        ) : latestRequest?.status === "PENDING" ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5">
            <span className="flex items-center gap-2 text-sm font-semibold text-amber-700">
              <Clock size={15} /> All-Access — payment under review
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-heading/10 bg-heading/[0.02] px-5 py-3.5">
            <div>
              <p className="text-sm font-semibold text-heading">
                {unlockedSlugs.length > 0 ? "On the free plan" : "No active plan"}
              </p>
              <p className="mt-0.5 text-[12px] text-heading/50">
                {unlockedSlugs.length > 0
                  ? `${unlockedSlugs.length} paid tool${unlockedSlugs.length > 1 ? "s" : ""} unlocked via a Bundle-${settings.bundle10Size} purchase.`
                  : `Pick any ${settings.bundle10Size} paid tools for ${formatPrice(settings.bundle10Price)}, or go unlimited everywhere with All-Access.`}
              </p>
              {latestRequest?.status === "REJECTED" && (
                <p className="mt-1 flex items-center gap-1.5 text-[12px] text-red-500">
                  <XCircle size={11} /> Your last payment screenshot couldn&apos;t be verified.
                </p>
              )}
            </div>
            <UpgradeButton />
          </div>
        )}
      </div>

      {/* Paid Tools */}
      <h2 className="mt-10 text-xl font-bold text-heading">Paid Tools</h2>
      <p className="mt-1 text-sm text-heading/50">
        {isPro
          ? "You have access to every paid tool below, unlimited."
          : `${unlockedCount} of ${paidTools.length} unlocked — pick any ${settings.bundle10Size} for ${formatPrice(settings.bundle10Price)}, or get All-Access for everything.`}
      </p>
      <div className="mt-4">
        <ResourceGrid tools={resourceTools} isPro={isPro} unlockedSlugs={unlockedSlugs} />
      </div>
    </div>
  );
}
