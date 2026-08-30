"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Lock, Crown, LogIn, UserPlus } from "lucide-react";
import { usePaymentStatus } from "@/lib/usePaymentStatus";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { formatPrice, REFERENCE_TOOL_PRICE } from "@/lib/pricing";

type GateInfo = { slug: string; name: string; tier: "free" | "pro"; price?: number };

export default function ToolAccessGate({ tool, children }: { tool: GateInfo; children: ReactNode }) {
  const { data: session, status } = useSession();
  const { loading: accessLoading, plan, unlockedTools } = usePaymentStatus({ kind: "PRO" });
  const { settings, loading: settingsLoading, effectivePrice, effectiveUseLimit } = useSiteSettings();
  const [checked, setChecked] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  const isLoggedIn = status === "authenticated";
  const isPro = plan === "PRO" || session?.user?.plan === "PRO";
  const toolUnlocked = isPro || unlockedTools.includes(tool.slug);
  const price = effectivePrice(tool.slug, typeof tool.price === "number" ? tool.price : REFERENCE_TOOL_PRICE);
  const useLimit = effectiveUseLimit(tool.slug); // -1 = unlimited

  useEffect(() => {
    if (status === "loading" || (isLoggedIn && accessLoading) || settingsLoading) return;
    if (tool.tier === "pro" || isPro || useLimit === -1) {
      setChecked(true);
      return;
    }

    async function trackUsage() {
      if (isLoggedIn) {
        // Signed-in — count server-side so it can't be reset by clearing
        // browser storage, and so it works across devices.
        try {
          const res = await fetch("/api/tool-usage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ toolSlug: tool.slug }),
          });
          const data = await res.json();
          setLimitReached(Boolean(data.limited));
        } catch {
          // Network hiccup — fail open rather than blocking a free tool.
        }
      } else {
        // Anonymous — no user row to attach a count to, so track in
        // localStorage instead, against this tool's own (possibly
        // admin-overridden) limit.
        const key = `sth_usage_${tool.slug}`;
        const count = Number(localStorage.getItem(key) || "0");
        if (count >= useLimit) {
          setLimitReached(true);
        } else {
          localStorage.setItem(key, String(count + 1));
        }
      }
      setChecked(true);
    }

    trackUsage();
  }, [status, isLoggedIn, isPro, accessLoading, settingsLoading, tool.slug, tool.tier, useLimit]);

  if (!checked) {
    return <div className="h-40 animate-pulse rounded-2xl bg-heading/5" />;
  }

  // Pro tool, not unlocked (neither All-Access nor part of a Bundle-10 purchase)
  if (tool.tier === "pro" && !toolUnlocked) {
    return (
      <div className="relative overflow-hidden rounded-2xl">
        <div className="pointer-events-none select-none blur-sm">{children}</div>
        <div className="absolute inset-0 grid place-items-center bg-white/70 backdrop-blur-sm">
          <div className="mx-4 max-w-xs rounded-2xl border border-brand/20 bg-white p-6 text-center shadow-xl">
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-brand-gradient text-white">
              <Crown size={18} />
            </span>
            <p className="mt-3 text-sm font-semibold text-heading">This is a Paid tool — {formatPrice(price)}</p>
            <p className="mt-1 text-[13px] text-heading/60">
              Unlock just this tool, pick it as part of the Any-{settings.bundle10Size} Tools bundle, or
              get every tool instantly on the All-Access plan.
            </p>
            <div className="mt-4 space-y-2">
              <Link
                href={isLoggedIn ? `/upgrade/tool/${tool.slug}` : `/signup?callbackUrl=/upgrade/tool/${tool.slug}`}
                className="btn-glow flex items-center justify-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-xs font-semibold text-white"
              >
                <Lock size={13} /> Unlock This Tool — {formatPrice(price)}
              </Link>
              <Link
                href={isLoggedIn ? "/upgrade/bundle-10" : `/signup?callbackUrl=/upgrade/bundle-10`}
                className="flex items-center justify-center gap-2 rounded-full bg-heading/5 px-5 py-2.5 text-xs font-semibold text-heading"
              >
                <Crown size={13} /> {isLoggedIn ? "Choose Any 10 Tools" : "Sign Up To Unlock"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Free tool, hit the use limit (bypassed entirely by the All-Access plan)
  if (limitReached && !isPro) {
    return (
      <div className="relative overflow-hidden rounded-2xl">
        <div className="pointer-events-none select-none blur-sm">{children}</div>
        <div className="absolute inset-0 grid place-items-center bg-white/70 backdrop-blur-sm">
          <div className="mx-4 max-w-xs rounded-2xl border border-brand/20 bg-white p-6 text-center shadow-xl">
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-brand-gradient text-white">
              <Lock size={18} />
            </span>
            <p className="mt-3 text-sm font-semibold text-heading">Free limit reached</p>
            <p className="mt-1 text-[13px] text-heading/60">
              You&apos;ve used this tool {useLimit} times.{" "}
              {isLoggedIn
                ? `Go unlimited and ad-free on every tool with All-Access.`
                : "Create a free account, or go unlimited and ad-free on every tool with All-Access."}
            </p>
            <div className="mt-4 flex gap-2">
              {!isLoggedIn && (
                <Link
                  href="/signup"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-heading/5 px-4 py-2.5 text-xs font-semibold text-heading"
                >
                  <UserPlus size={13} /> Sign Up
                </Link>
              )}
              <Link
                href="/upgrade"
                className="btn-glow flex flex-1 items-center justify-center gap-1.5 rounded-full bg-brand-gradient px-4 py-2.5 text-xs font-semibold text-white"
              >
                <Crown size={13} /> {formatPrice(settings.allAccessPrice)} All-Access
              </Link>
            </div>
            {!isLoggedIn && (
              <Link
                href="/login"
                className="mt-2 flex items-center justify-center gap-1.5 text-[12px] font-medium text-heading/50"
              >
                <LogIn size={11} /> or log in to an existing account
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
