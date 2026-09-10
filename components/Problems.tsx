import { AlertTriangle } from "lucide-react";
import Reveal from "./Reveal";

const problems = [
  {
    title: "Too Many Tabs Open",
    points: [
      "A different site for every small task",
      "Half of them are slow or full of pop-ups",
      "You lose the tool you liked last week",
    ],
  },
  {
    title: "Clunky, Outdated Tools",
    points: [
      "Interfaces built a decade ago",
      "Results buried behind three clicks",
      "No dark mode, no mobile support",
    ],
  },
  {
    title: "Privacy Left To Chance",
    points: [
      "Files uploaded to unknown servers",
      "No clarity on what's stored or shared",
      "Ads and trackers on every page",
    ],
  },
];

export default function Problems() {
  return (
    <section className="bg-white px-4 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <span className="inline-flex items-center rounded-full bg-brand-soft px-4 py-1.5 text-xs font-semibold text-brand">
            Problems
          </span>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
            What&apos;s Slowing Your Work Down?
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 text-left sm:grid-cols-3">
          {problems.map((p, i) => (
            <Reveal key={p.title} delay={(i + 1) as 1 | 2 | 3}>
              <div className="h-full rounded-2xl border border-heading/5 bg-white p-6 shadow-[0_10px_40px_-20px_rgba(36,18,66,0.25)]">
                <h3 className="font-semibold text-heading">{p.title}</h3>
                <ul className="mt-4 space-y-3 rounded-xl bg-warn-soft p-4">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-[13px] text-heading/70">
                      <AlertTriangle size={14} className="mt-0.5 shrink-0 text-warn" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
