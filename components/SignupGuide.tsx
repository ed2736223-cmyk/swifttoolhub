import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";

const steps = [
  "Visit SwiftToolHub and browse or search for the tool you need.",
  "Select a tool to open its dedicated page.",
  "Enter or upload your data as required by the tool.",
  "Click the relevant action button to process your input.",
  "View or download your result instantly.",
  "Create a free account only if needed for extras like saved history or higher usage limits.",
];

export default function SignupGuide() {
  return (
    <section id="no-signup" className="scroll-mt-24 bg-brand-softer px-4 py-24">
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1fr,1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <h2 className="text-3xl font-bold sm:text-4xl">How to Sign Up on SwiftToolHub for Tools?</h2>
          </Reveal>
          <Reveal delay={1}>
            <p className="mt-5 max-w-md text-[15px] leading-[1.8] text-heading/70">
              One of the most common frustrations with free online tools is being asked to create an
              account before you can even see the results. You can instantly do the following:
            </p>
            <Link
              href="/tools"
              className="btn-glow mt-8 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
            >
              Browse All Tools
              <ArrowUpRight size={15} />
            </Link>
          </Reveal>
        </div>

        <Reveal delay={2}>
          <ol>
            {steps.map((s, i) => {
              const optional = i === steps.length - 1;
              return (
                <li key={s} className="flex gap-4 pb-4 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold ${
                        optional
                          ? "border border-dashed border-brand/60 bg-white text-brand"
                          : "bg-brand-gradient text-white"
                      }`}
                    >
                      {i + 1}
                    </span>
                    {!optional && <span className="mt-2 w-px flex-1 bg-brand/20" />}
                  </div>
                  <div
                    className={`flex-1 rounded-2xl bg-white p-4 text-sm leading-relaxed text-heading/75 ${
                      optional ? "border border-dashed border-brand/40" : "border border-heading/5"
                    }`}
                  >
                    {optional && (
                      <span className="mb-1.5 inline-block rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-semibold text-brand">
                        Optional
                      </span>
                    )}
                    <p>{s}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
