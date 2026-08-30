import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAnyTool } from "@/lib/dynamicTools";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import PaymentUpload from "@/components/PaymentUpload";
import PayoutMethods from "@/components/PayoutMethods";
import { formatPrice } from "@/lib/pricing";
import { getToolPrice } from "@/lib/tools";
import { getSiteSettings } from "@/lib/siteSettings";
import { Lock, Crown, Send, Camera, BadgeCheck } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const tool = await getAnyTool(params.slug);
  if (!tool || tool.tier !== "pro") {
    return { title: "Unlock Tool" };
  }
  return {
    title: `Unlock ${tool.name}`,
    description: `Send payment and upload your screenshot to unlock ${tool.name} for ${formatPrice(getToolPrice(tool))}.`,
  };
}

export default async function UnlockToolPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`/login?callbackUrl=/upgrade/tool/${params.slug}`);
  }

  const tool = await getAnyTool(params.slug);
  if (!tool || tool.tier !== "pro") {
    notFound();
  }

  if (session.user.plan === "PRO") {
    redirect(`/tools/${params.slug}`);
  }

  const owned = await prisma.toolPurchase.findUnique({
    where: { userId_toolSlug: { userId: session.user.id, toolSlug: params.slug } },
  });
  if (owned) {
    redirect(`/tools/${params.slug}`);
  }

  const price = getToolPrice(tool);
  const settings = await getSiteSettings();

  const steps = [
    { icon: Send, title: "Send payment", desc: `Use any method on this page to send ${formatPrice(price)}.` },
    { icon: Camera, title: "Upload screenshot", desc: "Attach a clear screenshot of the confirmation." },
    { icon: BadgeCheck, title: "Get unlocked", desc: "An admin reviews it and this tool unlocks on your account." },
  ];

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-32">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-4 py-1.5 text-xs font-semibold text-brand">
            <Lock size={13} /> Unlock This Tool
          </span>
          <h1 className="mx-auto mt-4 max-w-xl text-3xl font-bold text-heading sm:text-4xl">
            Unlock {tool.name} for {formatPrice(price)}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-heading/60">
            Send payment using any method below, then upload a screenshot — an admin verifies it and
            unlocks just this tool on your account, unlimited and ad-free.
          </p>
          <p className="mx-auto mt-2 max-w-md text-[12.5px] text-heading/40">
            Need more than one tool?{" "}
            <Link href="/upgrade/bundle-10" className="font-semibold text-brand">
              Pick any {settings.bundle10Size} for {formatPrice(settings.bundle10Price)}
            </Link>{" "}
            or{" "}
            <Link href="/upgrade" className="font-semibold text-brand">
              go All-Access
            </Link>
            .
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="relative rounded-2xl border border-heading/10 bg-white p-5 text-center"
            >
              <span className="absolute -top-3 left-1/2 grid h-6 w-6 -translate-x-1/2 place-items-center rounded-full bg-brand-gradient text-[11px] font-bold text-white">
                {i + 1}
              </span>
              <span className="mx-auto mt-2 grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
                <s.icon size={18} />
              </span>
              <p className="mt-3 text-[13px] font-semibold text-heading">{s.title}</p>
              <p className="mt-1 text-[12px] text-heading/50">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl border border-brand/20 bg-brand-softer p-6">
              <p className="flex items-center gap-2 text-sm font-semibold text-heading">
                <Crown size={15} className="text-brand" /> {tool.name}
              </p>
              <p className="mt-2 text-[13px] text-heading/60">{tool.shortDesc}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-heading">{formatPrice(price)}</span>
                <span className="text-sm text-heading/40">one time</span>
              </div>
            </div>
            <PayoutMethods />
          </div>

          <div className="lg:col-span-3">
            <PaymentUpload kind="TOOL" toolSlugs={[tool.slug]} price={price} itemName={tool.name} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
