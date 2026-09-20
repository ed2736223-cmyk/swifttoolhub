"use client";

import { ArrowUpRight, Play, Sparkles } from "lucide-react";
import { useMemo } from "react";

function Stars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 3,
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s) => (
        <span
          key={s.id}
          className="star animate-twinkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-hero-radial pb-28 pt-36">
      <Stars />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-brand/40 blur-[120px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <div className="mx-auto mb-6 inline-flex animate-fade-in items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/80 backdrop-blur">
          <Sparkles size={13} className="text-brand-light" />
          Join 10,000+ people using free tools daily
        </div>

        <h1 className="animate-fade-up text-[2.6rem] font-bold leading-[1.08] text-white sm:text-6xl">
          Free Online{" "}
          <span className="bg-gradient-to-r from-brand-light via-fuchsia-300 to-brand-light bg-clip-text text-transparent">
            IT Tools 
          </span>{" "}
          to Get Everything Done
        </h1>

        <p
          className="mx-auto mt-5 max-w-xl animate-fade-up text-[15px] text-white/60 sm:text-base"
          style={{ animationDelay: "0.15s" }}
        >
          SwiftToolHub is a complete online toolkit for quick answers, with no downloads, 
          buffering, sign-ups, or unnecessary waiting. 
        </p>

        <div
          className="mt-8 flex animate-fade-up flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ animationDelay: "0.3s" }}
        >
          <a
            href="/tools"
            className="btn-glow flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
          >
            Browse All Tools
            <ArrowUpRight size={16} />
          </a>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-heading transition-transform hover:scale-[1.03]"
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-brand/10 text-brand">
              <Play size={10} fill="currentColor" />
            </span>
            See How It Works
          </a>
        </div>

        <p
          className="mt-5 animate-fade-up text-xs text-white/40"
          style={{ animationDelay: "0.4s" }}
        >
          Free forever for core tools ·{" "}
          <a href="/signup" className="font-semibold text-brand-light hover:underline">
            Create a free account
          </a>{" "}
          to remove usage limits
        </p>
      </div>

      <div className="relative mx-auto mt-16 max-w-4xl px-6">
        <a
          href="/dashboard"
          className="btn-glow absolute -top-4 right-6 z-10 hidden items-center gap-1.5 rounded-full bg-brand-gradient px-4 py-2 text-xs font-semibold text-white shadow-lg sm:flex"
        >
          <Sparkles size={12} /> 10 Paid tools inside
        </a>
        <div className="animate-float rounded-2xl border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="flex items-center gap-1.5 px-2 pb-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          </div>
          <div className="grid gap-3 rounded-xl bg-white p-4 sm:grid-cols-3">
            {[
              { name: "JSON Formatter", pro: false },
              { name: "QR Generator", pro: false },
              { name: "Image Compressor", pro: true },
            ].map((t) => (
              <div
                key={t.name}
                className="relative rounded-lg border border-heading/5 bg-brand-softer p-4 text-left"
              >
                {t.pro && (
                  <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-brand-gradient px-2 py-0.5 text-[9px] font-semibold text-white">
                    Pro
                  </span>
                )}
                <div className="mb-3 h-2 w-10 rounded-full bg-brand/30" />
                <p className="text-sm font-semibold text-heading">{t.name}</p>
                <div className="mt-3 space-y-1.5">
                  <div className="h-1.5 w-full rounded-full bg-heading/10" />
                  <div className="h-1.5 w-2/3 rounded-full bg-heading/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="checker absolute -bottom-1 left-0 h-6 w-24 text-white" />
      <div className="checker absolute -bottom-1 right-0 h-6 w-24 text-white" />
    </section>
  );
}
