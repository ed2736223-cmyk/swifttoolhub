"use client";

import Link from "next/link";
import { ArrowUp, Instagram, Facebook, Twitter, Linkedin, Code2 } from "lucide-react";

const columns = [
  {
    heading: "Tools",
    links: [
      { label: "Convert", href: "/tools" },
      { label: "Generate", href: "/tools" },
      { label: "Check", href: "/tools" },
      { label: "Develop", href: "/tools" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "All Tools", href: "/tools" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "FAQ", href: "/#faq" },
      { label: "Contact Us", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink-950 px-4 pt-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 border-b border-white/10 pb-12 sm:grid-cols-[1.3fr,1fr,1fr,1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient text-white">
                <Code2 size={16} strokeWidth={2.5} />
              </span>
              <span className="font-display text-lg font-bold text-white">SwiftToolHub</span>
            </Link>
            <p className="mt-3 max-w-xs text-[13px] text-white/40">
              Get useful tool updates, new features, and productivity tips delivered straight to your inbox. 
            </p>
            <div className="mt-5">
              <p className="text-xs font-medium text-white/70">Join our newsletter</p>
              <p className="mt-1 max-w-xs text-[11.5px] text-white/40">
                Get useful tool updates, new features, and productivity tips delivered straight to your
                inbox.
              </p>
              <form className="mt-2 flex max-w-xs overflow-hidden rounded-full border border-white/10 bg-white/5">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-transparent px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none"
                />
                <button
                  type="submit"
                  className="whitespace-nowrap bg-white px-4 text-xs font-semibold text-heading"
                >
                  Subscribe
                </button>
              </form>
            </div>
            <div className="mt-5 flex gap-3">
              {[Instagram, Facebook, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-white/60 transition-colors hover:bg-brand hover:text-white"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/40">{col.heading}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[13px] text-white/60 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/40 sm:flex-row">
          <p>Copyright © {new Date().getFullYear()} SwiftToolHub. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms-of-service" className="hover:text-white">Terms of Service</Link>
            <span>·</span>
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="grid h-9 w-9 place-items-center rounded-full bg-brand-gradient text-white"
            aria-label="Back to top"
          >
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
}
