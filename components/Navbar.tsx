"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  ChevronDown,
  Menu,
  X,
  Code2,
  ArrowRight,
  Crown,
  Sparkles,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { formatPrice } from "@/lib/pricing";
import { useSiteSettings } from "@/lib/useSiteSettings";

// Matches Tool["category"] in lib/tools.ts.
const CATEGORY_ORDER = ["Convert", "Generate", "Check", "Develop"] as const;

type MenuTool = { slug: string; name: string; category: string; tier: "free" | "pro"; price?: number };

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { data: session, status } = useSession();
  const { settings } = useSiteSettings();
  const [menuTools, setMenuTools] = useState<MenuTool[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/tools")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setMenuTools(data.tools || []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const freeTools = menuTools.filter((t) => t.tier === "free");
  const paidTools = menuTools.filter((t) => t.tier === "pro");
  const freeToolsByCategory = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: freeTools.filter((t) => t.category === cat),
  })).filter((g) => g.items.length > 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-300 ${
          scrolled
            ? "border-white/10 bg-ink-950/90 shadow-xl shadow-black/20 backdrop-blur-xl"
            : "border-white/10 bg-ink-950/70 backdrop-blur-lg"
        }`}
      >
        <Link href="/" className="flex items-center gap-2 pl-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient text-white">
            <Code2 size={16} strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-bold text-white">SwiftToolHub</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <Link href="/" className="rounded-full px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10">
            Home
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <button
              className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10"
              aria-expanded={megaOpen}
            >
              Tools
              <ChevronDown size={15} className={`transition-transform ${megaOpen ? "rotate-180" : ""}`} />
            </button>

            <div
              className={`absolute left-1/2 top-full w-[600px] -translate-x-1/2 pt-4 transition-all duration-200 ${
                megaOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
              }`}
            >
              <div className="grid grid-cols-2 gap-6 rounded-3xl border border-black/5 bg-white p-6 shadow-2xl shadow-black/20">
                {/* Free Tools — grouped by category */}
                <div>
                  <div className="mb-3 flex items-center justify-between gap-2 text-heading">
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      <Sparkles size={15} className="text-brand" /> Free Tools
                    </span>
                  </div>
                  <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
                    {freeToolsByCategory.map((group) => (
                      <div key={group.category}>
                        <p className="text-[10.5px] font-semibold uppercase tracking-wide text-heading/35">
                          {group.category}
                        </p>
                        <ul className="mt-1 space-y-1.5">
                          {group.items.map((t) => (
                            <li key={t.slug}>
                              <Link
                                href={`/tools/${t.slug}`}
                                className="flex items-center gap-1.5 text-[13px] leading-snug text-ink-900/60 transition-colors hover:text-brand"
                              >
                                {t.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/upgrade"
                    className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-brand-softer px-3 py-2.5 text-[12px] font-medium text-heading/70 transition-colors hover:text-brand"
                  >
                    Unlimited &amp; ad-free, everywhere
                    <span className="font-semibold text-brand">{formatPrice(settings.allAccessPrice)}</span>
                  </Link>
                </div>

                {/* Paid Tools */}
                <div>
                  <div className="mb-3 flex items-center gap-2 text-heading">
                    <Crown size={15} className="text-brand" />
                    <span className="text-sm font-semibold">Paid Tools</span>
                  </div>
                  <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
                    {paidTools.map((t) => (
                      <li key={t.slug}>
                        <Link
                          href={`/tools/${t.slug}`}
                          className="flex items-center justify-between gap-2 text-[13px] leading-snug text-ink-900/60 transition-colors hover:text-brand"
                        >
                          <span className="truncate">{t.name}</span>
                          <span className="shrink-0 text-[11px] font-semibold text-brand">
                            {formatPrice(t.price ?? 5)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/upgrade/bundle-10"
                    className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-brand-softer px-3 py-2.5 text-[12px] font-medium text-heading/70 transition-colors hover:text-brand"
                  >
                    Pick any 10 tools
                    <span className="font-semibold text-brand">{formatPrice(settings.bundle10Price)}</span>
                  </Link>
                </div>

                <div className="col-span-2 mt-1 flex items-center justify-between rounded-2xl bg-brand-softer px-4 py-3">
                  <span className="text-[13px] text-heading/70">Can&apos;t find a tool? Browse the full library.</span>
                  <Link href="/tools" className="flex items-center gap-1 text-[13px] font-semibold text-brand">
                    View all tools <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Link href="/about" className="rounded-full px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10">
            About Us
          </Link>
          <Link href="/blog" className="rounded-full px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10">
            Blog
          </Link>
          <Link href="/contact" className="rounded-full px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {status === "authenticated" ? (
            <div
              className="relative hidden sm:block"
              onMouseEnter={() => setAccountOpen(true)}
              onMouseLeave={() => setAccountOpen(false)}
            >
              <button className="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2.5 text-sm font-medium text-white">
                {session.user.plan === "PRO" && <Crown size={13} className="text-brand-light" />}
                {session.user.name || session.user.email?.split("@")[0]}
                {session.user.role === "ADMIN" && (
                  <span className="rounded-full bg-brand-gradient px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Admin
                  </span>
                )}
                <ChevronDown size={14} />
              </button>
              <div
                className={`absolute right-0 top-full w-52 pt-2 transition-all duration-150 ${
                  accountOpen ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <div className="overflow-hidden rounded-2xl border border-black/5 bg-white p-1.5 shadow-2xl">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-heading/80 hover:bg-brand-soft"
                  >
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                  {session.user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-heading/80 hover:bg-brand-soft"
                    >
                      <ShieldCheck size={15} /> Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-heading/80 hover:bg-brand-soft"
                  >
                    <LogOut size={15} /> Log Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-full px-4 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10 sm:flex"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="btn-glow hidden items-center gap-1.5 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03] sm:flex"
              >
                Sign Up Free
                <ArrowRight size={14} />
              </Link>
            </>
          )}
          <button
            className="rounded-full p-2 text-white lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="absolute inset-x-4 top-[72px] z-40 rounded-3xl border border-white/10 bg-ink-950/95 p-5 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-1">
            {[
              { label: "Home", href: "/" },
              { label: "All Tools", href: "/tools" },
              { label: "About Us", href: "/about" },
              { label: "Blog", href: "/blog" },
              { label: "Contact", href: "/contact" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-white/10 pt-2">
              {status === "authenticated" ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                  {session?.user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10"
                      onClick={() => setMobileOpen(false)}
                    >
                      <ShieldCheck size={15} /> Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-white/90 hover:bg-white/10"
                  >
                    <LogOut size={15} /> Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10"
                    onClick={() => setMobileOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="mt-1 flex items-center justify-center gap-1.5 rounded-full bg-brand-gradient px-4 py-2.5 text-sm font-semibold text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign Up Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
