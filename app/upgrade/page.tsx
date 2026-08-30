import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import PaymentUpload from "@/components/PaymentUpload";
import PayoutMethods from "@/components/PayoutMethods";
import { PRO_BUNDLE_NAME, formatPrice } from "@/lib/pricing";
import { getSiteSettings } from "@/lib/siteSettings";
import {
  Check,
  Crown,
  Send,
  Camera,
  BadgeCheck,
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: "Upgrade to All-Access",
    description: `Send payment and upload your screenshot to unlock every paid tool, unlimited and ad-free, for ${formatPrice(settings.allAccessPrice)}.`,
  };
}

const proPerks = [
  "Every paid tool, current and future — unlocked",
  "Unlimited use on every tool, free or paid",
  "No ads anywhere on the site",
  "Priority support",
];

const faqs = [
  {
    q: "How long does approval take?",
    a: "Usually within a few hours. You'll see \"Payment under review\" on your dashboard until then.",
  },
  {
    q: "What if my screenshot is rejected?",
    a: "You can send payment again and upload a new screenshot — there's no limit on attempts.",
  },
  {
    q: "Is my payment info safe?",
    a: "Only your screenshot and an optional note are stored, and only admins can view them.",
  },
];

export default async function UpgradePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login?callbackUrl=/upgrade");
  }

  const settings = await getSiteSettings();

  const steps = [
    { icon: Send, title: "Send payment", desc: `Use any method on this page to send ${formatPrice(settings.allAccessPrice)}.` },
    { icon: Camera, title: "Upload screenshot", desc: "Attach a clear screenshot of the confirmation." },
    { icon: BadgeCheck, title: "Get verified", desc: "An admin reviews it and your account goes Pro." },
  ];

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-32">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-4 py-1.5 text-xs font-semibold text-brand">
            <Crown size={13} /> Go Pro
          </span>
          <h1 className="mx-auto mt-4 max-w-xl text-3xl font-bold text-heading sm:text-4xl">
            Unlock everything, unlimited, ad-free — for {formatPrice(settings.allAccessPrice)}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-heading/60">
            Send payment using any method below, then upload a screenshot — an admin verifies it and
            switches your account to All-Access.
          </p>
          <p className="mx-auto mt-2 max-w-md text-[12.5px] text-heading/40">
            Only need a handful of tools?{" "}
            <Link href="/upgrade/bundle-10" className="font-semibold text-brand">
              Pick any {settings.bundle10Size} for {formatPrice(settings.bundle10Price)}
            </Link>{" "}
            instead.
          </p>
        </div>

        {/* 3-step timeline */}
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
          {/* Left: what you get + how to pay */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl border border-brand/20 bg-brand-softer p-6">
              <p className="flex items-center gap-2 text-sm font-semibold text-heading">
                <Crown size={15} className="text-brand" /> What&apos;s included
              </p>
              <ul className="mt-4 space-y-2.5">
                {proPerks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-[13px] text-heading/70">
                    <Check size={14} className="mt-0.5 shrink-0 text-brand" />
                    {perk}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-heading">{formatPrice(settings.allAccessPrice)}</span>
                <span className="text-sm text-heading/40">one time</span>
              </div>
            </div>

            <PayoutMethods />
          </div>

          {/* Right: upload / status */}
          <div className="lg:col-span-3">
            <PaymentUpload kind="PRO" price={settings.allAccessPrice} itemName={PRO_BUNDLE_NAME} />
          </div>
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-16 max-w-2xl">
          <h2 className="text-center text-lg font-semibold text-heading">Common questions</h2>
          <div className="mt-5 space-y-3">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-heading/10 bg-white p-4">
                <p className="text-[13px] font-semibold text-heading">{f.q}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-heading/60">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
