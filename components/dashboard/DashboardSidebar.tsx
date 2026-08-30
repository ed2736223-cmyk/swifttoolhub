"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Receipt,
  ShoppingCart,
  UserCog,
  LifeBuoy,
  HelpCircle,
  Download,
  LogOut,
  Code2,
  ArrowLeftCircle,
  ShieldCheck,
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/transactions", label: "Transaction History", icon: Receipt },
  { href: "/upgrade", label: "Subscribe/Renew", icon: ShoppingCart },
  { href: "/dashboard/account", label: "Account Settings", icon: UserCog },
  { href: "/dashboard/help", label: "Help Desk", icon: LifeBuoy },
  { href: "/dashboard/faqs", label: "FAQs", icon: HelpCircle },
];

export default function DashboardSidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-heading/10 bg-white lg:flex">
      <div className="flex items-center gap-2 px-6 py-6">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient text-white">
          <Code2 size={16} strokeWidth={2.5} />
        </span>
        <span className="font-display text-base font-bold text-heading">SwiftToolHub</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {links.map((l) => {
          const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors ${
                active
                  ? "bg-brand-gradient text-white"
                  : "text-heading/60 hover:bg-heading/5 hover:text-heading"
              }`}
            >
              <l.icon size={16} />
              {l.label}
            </Link>
          );
        })}

        <div className="!mt-4 border-t border-heading/10 pt-4">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wide text-heading/30">
            User Guide
          </p>
          <Link
            href="/dashboard/extension"
            className={`mt-1 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors ${
              pathname.startsWith("/dashboard/extension")
                ? "bg-brand-gradient text-white"
                : "text-heading/60 hover:bg-heading/5 hover:text-heading"
            }`}
          >
            <Download size={16} />
            Download Extension
          </Link>
        </div>
      </nav>

      <div className="space-y-1 border-t border-heading/10 p-3">
        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-heading/60 transition-colors hover:bg-heading/5 hover:text-heading"
          >
            <ShieldCheck size={16} />
            Admin Panel
          </Link>
        )}
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-heading/50 transition-colors hover:bg-heading/5 hover:text-heading"
        >
          <ArrowLeftCircle size={16} />
          Visit Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-red-500/80 transition-colors hover:bg-red-50"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
