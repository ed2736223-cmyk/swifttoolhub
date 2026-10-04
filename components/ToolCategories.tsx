import Link from "next/link";
import {
  ArrowUpRight,
  RefreshCw,
  Wand2,
  CheckCircle2,
  Code2,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import Reveal from "./Reveal";
import { getMergedTools } from "@/lib/dynamicTools";

type Category = {
  name: "Convert" | "Generate" | "Check" | "Develop";
  icon: LucideIcon;
  tile: string;
  examples: string[];
};

const categories: Category[] = [
  {
    name: "Convert",
    icon: RefreshCw,
    tile: "bg-band-purple/50",
    examples: ["Image to PDF", "Unit conversion", "CSV to JSON", "Timestamp conversion", "Text case conversion"],
  },
  {
    name: "Generate",
    icon: Wand2,
    tile: "bg-band-orange/50",
    examples: ["QR codes", "Strong passwords", "Random numbers", "Favicons", "Meta tags"],
  },
  {
    name: "Check",
    icon: CheckCircle2,
    tile: "bg-band-green/50",
    examples: ["Word counters", "Percentage and BMI calculators", "Age calculators", "Text diff checkers"],
  },
  {
    name: "Develop",
    icon: Code2,
    tile: "bg-brand-soft",
    examples: [
      "JSON formatting and validation",
      "Base64 encoding and decoding",
      "Color conversion",
      "URL encoding",
      "SHA-256 hash generation",
    ],
  },
];

export default async function ToolCategories() {
  const tools = await getMergedTools();

  return (
    <section id="categories" className="scroll-mt-24 bg-brand-softer px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Use Free Online Converters, Generators and Checkers in One Place at SwiftToolHub
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <p className="mt-5 text-[15px] leading-[1.8] text-heading/70">
              Instead of searching for a different website every time you need to convert an image
              to PDF, generate a QR code, or check your website&apos;s meta tags, SwiftToolHub keeps
              everything under one roof. The tool library covers four core categories:
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {categories.map((c, i) => {
            const count = tools.filter((t) => t.category === c.name).length;
            return (
              <Reveal key={c.name} delay={((i % 2) + 1) as 1 | 2}>
                <Link
                  href="/tools"
                  className="group flex h-full flex-col rounded-3xl border border-heading/10 bg-white p-6 transition-colors hover:border-brand/40 sm:p-7"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className={`grid h-12 w-12 place-items-center rounded-2xl text-heading ${c.tile}`}>
                      <c.icon size={20} />
                    </span>
                    {count > 0 && (
                      <span className="rounded-full bg-brand-softer px-3 py-1 text-xs font-medium text-heading/60">
                        {count} {count === 1 ? "tool" : "tools"}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-heading">{c.name}</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {c.examples.map((ex) => (
                      <li
                        key={ex}
                        className="rounded-full border border-heading/10 bg-brand-softer px-3 py-1 text-xs text-heading/70"
                      >
                        {ex}
                      </li>
                    ))}
                    <li className="px-1 py-1 text-xs text-heading/40">and more</li>
                  </ul>
                  <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                    Browse {c.name.toLowerCase()} tools
                    <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            );
          })}

          <Reveal delay={3} className="sm:col-span-2">
            <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-ink-950 p-6 sm:flex-row sm:items-center sm:p-8">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-white">
                  <LayoutGrid size={20} />
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-white">More</h3>
                  <p className="mt-1 max-w-md text-[13px] leading-relaxed text-white/60">
                    Explore additional tools for everyday tasks, calculations, conversions,
                    formatting, and productivity.
                  </p>
                </div>
              </div>
              <Link
                href="/tools"
                className="btn-glow inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
              >
                View all {tools.length} tools
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
