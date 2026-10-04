import { LayoutGrid, MousePointerClick, Zap, BadgeCheck } from "lucide-react";
import Reveal from "./Reveal";

const facts = [
  { icon: LayoutGrid, title: "25+ utilities, still growing", desc: "Converters, generators, checkers and calculators in one place." },
  { icon: MousePointerClick, title: "No sign-up for core tools", desc: "Open a tool and start working straight away." },
  { icon: Zap, title: "Runs in your browser", desc: "Most processing happens on your device for speed and privacy." },
  { icon: BadgeCheck, title: "Free and paid plans", desc: "For higher limits, saved history or API access." },
];

export default function AboutIntro() {
  return (
    <section id="about" className="scroll-mt-24 bg-white px-4 py-24">
      <div className="mx-auto grid max-w-5xl items-start gap-12 lg:grid-cols-[1.15fr,1fr] lg:gap-16">
        <div>
          <Reveal>
            <h2 className="text-3xl font-bold sm:text-4xl">What is SwiftToolHub?</h2>
          </Reveal>
          <Reveal delay={1}>
            <div className="mt-6 max-w-prose space-y-5 text-[15px] leading-[1.8] text-heading/70">
              <p>
                SwiftToolHub is a free online toolkit offering 25+ (and growing) browser-based
                utilities for everyday work. It brings converters, generators, checkers, and
                calculators like a JSON formatter, QR code generator, password generator, and unit
                converter into one clean workspace.
              </p>
              <p>
                We work as a team to form a platform that requires no sign-up to use the core tools
                and most processes directly in your browser for speed and privacy. Free and paid
                plans (Plus and Team) are available for people who want higher limits, saved
                history, or API access.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={2}>
          <ul className="divide-y divide-heading/10 rounded-3xl border border-heading/10 bg-brand-softer">
            {facts.map((f) => (
              <li key={f.title} className="flex items-start gap-4 p-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-brand shadow-sm">
                  <f.icon size={18} />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-heading">{f.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-heading/60">{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
