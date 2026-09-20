import { Gauge, Zap, ShieldCheck, Layers, ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";

const items = [
  { icon: Gauge, title: "Instant Results", desc: "Every tool runs in the browser — no waiting, no queue." },
  { icon: Zap, title: "Zero Setup", desc: "No sign-up or install. Open a tool and start working." },
  { icon: Layers, title: "One Workspace", desc: "Converters, checkers and generators, organized in one place." },
  { icon: ShieldCheck, title: "Privacy First", desc: "Files process locally where possible — nothing kept longer than needed." },
];

export default function Solutions() {
  return (
    <section className="bg-brand-softer px-4 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <span className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-brand">
            Solutions
          </span>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
            How Does SwiftToolHub Improve Your Workflow?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-heading/60">
            SwiftToolHub gets you quick answers without accounts, ads, data concerns, or unnecessary
            steps. You can enjoy:
          </p>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-heading/10 bg-heading/10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={(i % 4) as 0 | 1 | 2 | 3}>
              <div className="group h-full bg-white p-6 text-left transition-colors hover:bg-brand-soft/40">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
                  <it.icon size={18} />
                </span>
                <h3 className="mt-4 font-semibold text-heading">{it.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-heading/60">{it.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more <ArrowUpRight size={12} />
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={2}>
          <a
            href="#how-it-works"
            className="btn-glow mt-10 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
          >
            See How It Works
            <ArrowUpRight size={15} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
