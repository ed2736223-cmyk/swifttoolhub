"use client";

import Link from "next/link";
import { Crown } from "lucide-react";
import { formatPrice } from "@/lib/pricing";
import { useSiteSettings } from "@/lib/useSiteSettings";

export default function UpgradeButton({ className = "" }: { className?: string }) {
  const { settings } = useSiteSettings();
  return (
    <Link
      href="/upgrade"
      className={`btn-glow flex items-center gap-2 whitespace-nowrap rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white ${className}`}
    >
      <Crown size={15} />
      All-Access — {formatPrice(settings.allAccessPrice)}
    </Link>
  );
}
