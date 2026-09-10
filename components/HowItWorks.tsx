import { Search, MousePointerClick, Download } from "lucide-react";
import Reveal from "./Reveal";

const steps = [
  {
    n: "01",
    title: "Find Your Tool",
    desc: "Search or browse by category — converters, checkers, generators and more.",
    icon: Search,
    band: "bg-band-purple/40",
    text: "text-heading",
  },
  {
    n: "02",
    title: "Use It Instantly",
    desc: "No sign-up. Paste, upload or type your input and get results right away.",
    icon: MousePointerClick,
    band: "bg-band-orange/40",
    text: "text-heading",
  },
  {
    n: "03",
    title: "Export & Go",
    desc: "Copy, download or share your result, then move on with your day.",
    icon: Download,
    band: "bg-band-green/40",
    text: "text-heading",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-brand-softer px-4 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <span className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-brand">
            How It Works
          </span>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
            Get What You Need In Three Steps
          </h2>
        </Reveal>

        <div className="mt-14 space-y-6">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={(i + 1) as 1 | 2 | 3}>
              <div className={`overflow-hidden rounded-3xl ${s.band} p-8 text-left sm:p-10`}>
                <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-5">
                    <span className="font-display text-5xl font-extrabold text-white/70 sm:text-6xl">
                      {s.n}
                    </span>
                    <div>
                      <h3 className={`text-lg font-semibold ${s.text}`}>{s.title}</h3>
                      <p className="mt-1.5 max-w-sm text-sm text-heading/60">{s.desc}</p>
                    </div>
                  </div>
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-brand shadow-lg">
                    <s.icon size={22} />
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
