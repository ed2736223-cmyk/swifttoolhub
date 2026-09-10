"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { X, Crown, Sparkles } from "lucide-react";
import { usePaymentStatus } from "@/lib/usePaymentStatus";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { formatPrice } from "@/lib/pricing";

const DISMISS_KEY = "sth_bundle10_promo_dismissed";

/**
 * A small popup, anchored to the dashboard sidebar, nudging Free users
 * toward the Any-10 Tools bundle. Hidden for Pro users, for anyone with a
 * pending/approved Bundle-10 request already, and for the rest of the
 * browser session once the user closes it.
 */
export default function SidebarBundlePromo() {
  const { data: session, status } = useSession();
  const { request, loading: statusLoading } = usePaymentStatus({ kind: "BUNDLE10" });
  const { settings, loading: settingsLoading } = useSiteSettings();
  const [dismissed, setDismissed] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const t = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(t);
  }, [dismissed]);

  if (status !== "authenticated" || statusLoading || settingsLoading || dismissed) return null;
  if (session.user.plan === "PRO") return null;
  if (request && request.status !== "REJECTED") return null;

  const close = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  return (
    <div
      className={`pointer-events-none fixed bottom-5 left-3 z-40 hidden w-[15.5rem] transition-all duration-300 lg:block ${
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      <div className="pointer-events-auto relative rounded-2xl border border-brand/20 bg-white p-4 shadow-xl">
        <button
          onClick={close}
          className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full text-heading/30 hover:bg-heading/5 hover:text-heading/60"
          aria-label="Dismiss"
        >
          <X size={13} />
        </button>
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-gradient text-white">
          <Sparkles size={16} />
        </span>
        <p className="mt-2.5 pr-4 text-[13px] font-semibold text-heading">
          Pick Any {settings.bundle10Size} Tools
        </p>
        <p className="mt-1 text-[11.5px] leading-relaxed text-heading/55">
          Unlock any {settings.bundle10Size} paid tools of your choice for{" "}
          {formatPrice(settings.bundle10Price)} — unlimited use, no ads.
        </p>
        <Link
          href="/upgrade/bundle-10"
          className="btn-glow mt-3 flex items-center justify-center gap-1.5 rounded-full bg-brand-gradient px-4 py-2 text-[11.5px] font-semibold text-white"
        >
          <Crown size={12} /> Choose Your Tools
        </Link>
      </div>
    </div>
  );
}
