"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Menu,
  X,
  LayoutDashboard,
  Receipt,
  ShoppingCart,
  UserCog,
  LifeBuoy,
  HelpCircle,
  Download,
  LogOut,
  Power,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/transactions", label: "Transaction History", icon: Receipt },
  { href: "/upgrade", label: "Subscribe/Renew", icon: ShoppingCart },
  { href: "/dashboard/account", label: "Account Settings", icon: UserCog },
  { href: "/dashboard/help", label: "Help Desk", icon: LifeBuoy },
  { href: "/dashboard/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/dashboard/extension", label: "Download Extension", icon: Download },
];

export default function DashboardTopbar({ name, isAdmin = false }: { name: string; isAdmin?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-20 border-b border-heading/10 bg-white/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3.5 sm:px-6">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-lg p-1.5 text-heading/60 hover:bg-heading/5 lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <span className="hidden text-sm text-heading/50 lg:block">
          Hello, <span className="font-semibold text-heading">{name}</span>
        </span>

        <div className="relative ml-auto">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-heading/5"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-gradient text-[11px] font-bold text-white">
              {name.slice(0, 2).toUpperCase()}
            </span>
            <span className="text-sm font-medium text-heading lg:hidden">{name}</span>
            <ChevronDown size={14} className="text-heading/40" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-11 w-44 rounded-2xl border border-heading/10 bg-white p-1.5 shadow-lg">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium text-red-500 hover:bg-red-50"
              >
                <Power size={14} /> Logout
              </button>
            </div>
          )}
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
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-heading/70 hover:bg-heading/5"
            >
              <ShieldCheck size={16} /> Admin Panel
            </Link>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
