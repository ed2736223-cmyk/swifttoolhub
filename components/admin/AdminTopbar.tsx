"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Menu, X, Receipt, Users, LayoutDashboard, Wrench, ArrowLeftCircle } from "lucide-react";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/payments", label: "Payment Requests", icon: Receipt },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/tools", label: "Tool Usage", icon: Wrench },
];

export default function AdminTopbar({
  email,
  pendingCount,
}: {
  email: string;
  pendingCount: number;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="sticky top-0 z-20 border-b border-heading/10 bg-white/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3.5 sm:px-6">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-lg p-1.5 text-heading/60 hover:bg-heading/5 lg:hidden"
          aria-label="Toggle admin menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <span className="hidden text-sm font-medium text-heading/40 lg:block">
          Signed in as <span className="text-heading/70">{email}</span>
        </span>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/payments"
            className="relative rounded-full p-2 text-heading/50 hover:bg-heading/5"
            aria-label="Pending payment requests"
          >
            <Bell size={17} />
            {pendingCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-gradient px-1 text-[9px] font-bold text-white">
                {pendingCount}
              </span>
            )}
          </Link>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-soft text-[11px] font-bold text-brand">
            {email.slice(0, 2).toUpperCase()}
          </span>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-heading/10 bg-white px-3 py-2 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-heading/70 hover:bg-heading/5"
            >
              <l.icon size={16} /> {l.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-heading/70 hover:bg-heading/5"
          >
            <ArrowLeftCircle size={16} /> Back to site
          </Link>
        </div>
      )}
    </div>
  );
}
