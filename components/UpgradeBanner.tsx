"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Crown, UserPlus, ShieldCheck, Clock, XCircle } from "lucide-react";
import UpgradeButton from "./UpgradeButton";
import { usePaymentStatus } from "@/lib/usePaymentStatus";

export default function UpgradeBanner() {
  const { data: session, status } = useSession();
  const { request, loading } = usePaymentStatus();

  if (status === "loading") return null;

  if (session?.user.plan === "PRO") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-heading/10 bg-white p-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
          <ShieldCheck size={16} />
        </span>
        <p className="text-xs text-heading/60">You&apos;re on the Pro plan — every tool is unlocked.</p>
      </div>
    );
  }

  if (session && !loading && request?.status === "PENDING") {
    return (
      <div className="rounded-2xl border border-amber-300/40 bg-amber-50 p-5">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-400/20 text-amber-600">
          <Clock size={16} />
        </span>
        <p className="mt-3 text-sm font-semibold text-heading">Payment under review</p>
        <p className="mt-1 text-[12px] leading-relaxed text-heading/60">
          We&apos;re verifying your payment screenshot. This usually takes a few hours.
        </p>
      </div>
    );
  }

  if (session) {
    return (
      <div className="rounded-2xl border border-brand/20 bg-brand-softer p-5">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-gradient text-white">
          <Crown size={16} />
        </span>
        <p className="mt-3 text-sm font-semibold text-heading">Go Pro</p>
        <p className="mt-1 text-[12px] leading-relaxed text-heading/60">
          {request?.status === "REJECTED"
            ? "Your last screenshot couldn't be verified — send payment and try again."
            : "Unlock every Pro tool, remove usage limits for good, and skip the ads."}
        </p>
        {request?.status === "REJECTED" && (
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-red-500">
            <XCircle size={12} /> Last screenshot rejected
          </p>
        )}
        <UpgradeButton className="mt-3 w-full !px-4 !py-2 text-xs" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-brand/20 bg-brand-softer p-5">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-gradient text-white">
        <UserPlus size={16} />
      </span>
      <p className="mt-3 text-sm font-semibold text-heading">Create A Free Account</p>
      <p className="mt-1 text-[12px] leading-relaxed text-heading/60">
        Remove the 4-use limit on every free tool and unlock Pro tools when you upgrade.
      </p>
      <Link
        href="/signup"
        className="btn-glow mt-3 flex items-center justify-center gap-1.5 rounded-full bg-brand-gradient px-4 py-2.5 text-xs font-semibold text-white"
      >
        <UserPlus size={13} /> Sign Up Free
      </Link>
    </div>
  );
}
