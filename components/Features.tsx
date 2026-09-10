import { Search, Bookmark, Command } from "lucide-react";
import Reveal from "./Reveal";

export default function Features() {
  return (
    <section className="bg-white px-4 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <span className="inline-flex items-center rounded-full bg-brand-soft px-4 py-1.5 text-xs font-semibold text-brand">
            Features
          </span>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
            Everything You Need, Nothing You Don&apos;t
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-heading/60">Sixty-Plus Tools, One Search Bar</p>
        </Reveal>

        <div className="mt-14 grid gap-5 text-left sm:grid-cols-2">
          <Reveal className="rounded-3xl bg-brand-soft p-6" delay={1}>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 rounded-lg border border-heading/10 px-3 py-2 text-xs text-heading/40">
                <Search size={13} />
                Search 60+ tools…
              </div>
              <div className="mt-3 space-y-2">
                {["JSON Formatter", "Color Picker", "Word Counter"].map((t) => (
                  <div key={t} className="flex items-center justify-between rounded-lg bg-brand-softer px-3 py-2 text-xs font-medium text-heading">
                    {t}
                    <span className="text-brand">→</span>
                  </div>
                ))}
              </div>
            </div>
            <h3 className="mt-5 font-semibold text-heading">Instant Search</h3>
            <p className="mt-1 text-[13px] text-heading/60">
              Find the exact tool you need in a couple of keystrokes.
            </p>
          </Reveal>

          <Reveal className="rounded-3xl bg-brand-soft p-6" delay={2}>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand text-white">
                  <Bookmark size={12} />
                </span>
                <span className="text-xs font-semibold text-heading">Pinned Tools</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {["QR", "PDF", "IMG", "SEO", "SSL", "API"].map((t) => (
                  <div key={t} className="grid h-12 place-items-center rounded-lg bg-brand-softer text-[11px] font-semibold text-brand">
                    {t}
                  </div>
                ))}
              </div>
            </div>
            <h3 className="mt-5 font-semibold text-heading">Save Your Favorites</h3>
            <p className="mt-1 text-[13px] text-heading/60">
              Pin the tools you use most for one-click access next time.
            </p>
          </Reveal>

          <Reveal className="sm:col-span-2 rounded-3xl bg-ink-950 p-6 sm:p-8" delay={3}>
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                  <Command size={12} /> Keyboard-first
                </span>
                <h3 className="mt-4 font-semibold text-white">Built For Speed</h3>
                <p className="mt-1 max-w-sm text-[13px] text-white/50">
                  Shortcuts, instant previews and no page reloads between tools.
                </p>
              </div>
              <div className="flex gap-2">
                {["⌘", "K"].map((k) => (
                  <span
                    key={k}
                    className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 font-mono text-sm text-white"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
