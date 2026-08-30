"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Users,
  Wrench,
  Plus,
  ArrowLeftCircle,
  Code2,
  Settings,
  DollarSign,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/payments", label: "Payment Requests", icon: Receipt },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/tools/manage", label: "Manage Tools", icon: Plus },
  { href: "/admin/tool-pricing", label: "Tool Pricing & Limits", icon: DollarSign },
  { href: "/admin/tools", label: "Tool Usage", icon: Wrench, exact: true },
  { href: "/admin/settings", label: "Settings & Ads", icon: Settings },
];

export default function AdminSidebar({ pendingCount }: { pendingCount: number }) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-ink-950 lg:flex">
      <div className="flex items-center gap-2 px-6 py-6">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient text-white">
          <Code2 size={16} strokeWidth={2.5} />
        </span>
        <span className="font-display text-base font-bold text-white">
          SwiftToolHub <span className="text-white/40">Admin</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {links.map((l) => {
          const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors ${
                active ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white/80"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <l.icon size={16} />
                {l.label}
              </span>
              {l.href === "/admin/payments" && pendingCount > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-gradient px-1 text-[10px] font-bold text-white">
                  {pendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white/80"
        >
          <ArrowLeftCircle size={16} />
          Back to site
        </Link>
      </div>
    </aside>
  );
}
