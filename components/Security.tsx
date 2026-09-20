import { ShieldCheck, Lock, Cookie, Eye, FileCheck } from "lucide-react";
import Reveal from "./Reveal";

const badges = [
  { icon: Lock, label: "HTTPS Everywhere" },
  { icon: Eye, label: "No Data Selling" },
  { icon: FileCheck, label: "Clear Privacy Policy" },
  { icon: Cookie, label: "Minimal Cookies" },
  { icon: ShieldCheck, label: "GDPR Aware" },
];

export default function Security() {
  return (
    <section className="bg-white px-4 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <span className="inline-flex items-center rounded-full bg-brand-soft px-4 py-1.5 text-xs font-semibold text-brand">
            Trust
          </span>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
            Built To Respect Your Data
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-heading/60">
            Tools you can run without wondering where your files end up.
          </p>
        </Reveal>

        <Reveal delay={2}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
            {badges.map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-2">
                <span className="grid h-14 w-14 place-items-center rounded-2xl border border-heading/10 bg-brand-softer text-brand">
                  <b.icon size={20} />
                </span>
                <span className="max-w-[80px] text-[11px] font-medium leading-tight text-heading/60">
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
