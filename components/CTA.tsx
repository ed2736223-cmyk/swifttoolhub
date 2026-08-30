import { ArrowUpRight, Play, Star } from "lucide-react";
import Reveal from "./Reveal";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-hero-radial px-4 py-24">
      <div className="pointer-events-none absolute inset-0 checker text-white/5" />
      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Make Every Tool One Click Away
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/50">
            No installs, no accounts — just open a tool and get back to work.
          </p>
        </Reveal>

        <Reveal delay={1}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
        </Reveal>

        <Reveal delay={2}>
          <div className="mt-10 flex flex-col items-center gap-2 text-white/50 sm:flex-row sm:justify-center sm:gap-4">
            <span className="text-sm">Trusted by 10,000+ people every month</span>
            <span className="flex items-center gap-1 text-sm">
              <Star size={14} className="text-brand-light" fill="currentColor" />
              4.9 average rating
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
