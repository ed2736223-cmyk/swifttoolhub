import Link from "next/link";
import { Check, Sparkles, Crown, Zap } from "lucide-react";
import Reveal from "./Reveal";
import { formatPrice } from "@/lib/pricing";
import { getSiteSettings } from "@/lib/siteSettings";

export default async function Pricing() {
  const settings = await getSiteSettings();

  const plans = [
    {
      name: "Free",
      icon: Sparkles,
      price: "$0",
      period: "to use",
      features: [
        "Every free tool, no sign-up needed",
        `${settings.defaultFreeUseLimit === -1 ? "Unlimited" : settings.defaultFreeUseLimit} uses per tool, then it resets on a paid plan`,
        "Light ads on tool pages",
      ],
      cta: "Browse Free Tools",
      href: "/tools",
      highlight: false,
    },
    {
      name: `Any ${settings.bundle10Size} Tools`,
      icon: Zap,
      price: formatPrice(settings.bundle10Price),
      period: "one time",
      features: [
        `Pick any ${settings.bundle10Size} paid tools yourself`,
        "Those tools go unlimited-use, ad-free",
        "Cheaper than buying tools separately",
      ],
      cta: `Choose Your ${settings.bundle10Size} Tools`,
      href: "/upgrade/bundle-10",
      highlight: true,
      badge: "Most Popular",
    },
    {
      name: "All-Access",
      icon: Crown,
      price: formatPrice(settings.allAccessPrice),
      period: "one time",
      features: [
        "Every current and future paid tool",
        "Unlimited use on every tool, free or paid",
        "No ads anywhere on the site",
      ],
      cta: "Get All-Access",
      href: "/upgrade",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="scroll-mt-24 relative overflow-hidden bg-hero-radial px-4 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white">
            Pricing
          </span>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
            Free Tools That Grow With You
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/50">
            Start for free and upgrade only when you need more speed, features, or usage.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={(i + 1) as 1 | 2 | 3}>
              <div
                className={`relative flex h-full flex-col rounded-3xl border p-6 text-left ${
                  p.highlight
                    ? "border-brand-light/50 bg-white/[0.07] shadow-2xl shadow-brand/20"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                {p.badge && (
                  <span className="absolute -top-3 right-6 rounded-full bg-brand-gradient px-3 py-1 text-[11px] font-semibold text-white">
                    {p.badge}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-sm font-medium text-white/60">
                  <p.icon size={14} /> {p.name}
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{p.price}</span>
                  <span className="text-sm text-white/40">{p.period}</span>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-white/70">
                      <Check size={14} className="mt-0.5 shrink-0 text-brand-light" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={p.href}
                  className={`mt-6 flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.02] ${
                    p.highlight ? "btn-glow bg-brand-gradient text-white" : "bg-white text-heading"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
