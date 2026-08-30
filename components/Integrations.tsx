import Link from "next/link";
import { ArrowUpRight, Crown } from "lucide-react";
import Reveal from "./Reveal";
import { tools } from "@/lib/tools";

export default function Integrations() {
  const preview = tools.slice(0, 9);

  return (
    <section id="tools" className="scroll-mt-24 bg-white px-4 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <span className="inline-flex items-center rounded-full bg-brand-soft px-4 py-1.5 text-xs font-semibold text-brand">
            Tools
          </span>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
            One Place. Every Everyday Tool.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-heading/60">
            {tools.length} tools and counting, spanning conversion, generation, checking and formatting.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((t, i) => (
            <Reveal key={t.slug} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <Link
                href={`/tools/${t.slug}`}
                className="group relative flex h-full flex-col items-start rounded-2xl border border-heading/10 bg-brand-softer p-5 text-left transition-all hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/10"
              >
                {t.tier === "pro" && (
                  <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-brand-gradient px-2.5 py-1 text-[10px] font-semibold text-white">
                    <Crown size={10} /> Pro
                  </span>
                )}
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-brand shadow-sm">
                  <t.icon size={18} />
                </span>
                <h3 className="mt-3 text-sm font-semibold text-heading">{t.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-heading/55">{t.shortDesc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand opacity-0 transition-opacity group-hover:opacity-100">
                  Open tool <ArrowUpRight size={11} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={2}>
          <Link
            href="/tools"
            className="btn-glow mt-10 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
          >
            View All {tools.length} Tools
            <ArrowUpRight size={15} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
