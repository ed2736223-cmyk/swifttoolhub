import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMergedTools } from "@/lib/dynamicTools";
import { nameForIcon } from "@/lib/iconMap";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import BundlePicker from "@/components/BundlePicker";
import { formatPrice } from "@/lib/pricing";
import { getSiteSettings } from "@/lib/siteSettings";
import { Crown } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Any ${settings.bundle10Size} Tools Bundle`,
    description: `Pick any ${settings.bundle10Size} paid tools of your choice and unlock them for ${formatPrice(settings.bundle10Price)}.`,
  };
}

export default async function Bundle10Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login?callbackUrl=/upgrade/bundle-10");
  }

  if (session.user.plan === "PRO") {
    redirect("/dashboard");
  }

  const [tools, owned, settings] = await Promise.all([
    getMergedTools(),
    prisma.toolPurchase.findMany({ where: { userId: session.user.id }, select: { toolSlug: true } }),
    getSiteSettings(),
  ]);

  const ownedSlugs = new Set(owned.map((o) => o.toolSlug));
  const paidTools = tools
    .filter((t) => t.tier === "pro")
    .map((t) => ({
      slug: t.slug,
      name: t.name,
      shortDesc: t.shortDesc,
      iconName: nameForIcon(t.icon),
      owned: ownedSlugs.has(t.slug),
    }));

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-32">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-4 py-1.5 text-xs font-semibold text-brand">
            <Crown size={13} /> Any {settings.bundle10Size} Tools Bundle
          </span>
          <h1 className="mx-auto mt-4 max-w-xl text-3xl font-bold text-heading sm:text-4xl">
            Pick any {settings.bundle10Size} tools for {formatPrice(settings.bundle10Price)}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-heading/60">
            Choose exactly the paid tools you actually use — they become unlimited-use and ad-free once
            approved.
          </p>
          <p className="mx-auto mt-2 max-w-md text-[12.5px] text-heading/40">
            Want everything, including future tools?{" "}
            <Link href="/upgrade" className="font-semibold text-brand">
              See the All-Access plan
            </Link>
            .
          </p>
        </div>

        <BundlePicker tools={paidTools} bundleSize={settings.bundle10Size} bundlePrice={settings.bundle10Price} />
      </main>
      <Footer />
    </>
  );
}
