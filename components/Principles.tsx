import Link from "next/link";
import { Gauge, ShieldCheck, MessageSquarePlus, ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";

const pillars = [
  {
    icon: Gauge,
    bar: "bg-band-purple",
    title: "We Never Compromise on Speed At SwiftToolHub",
    body:
      "Speed matters when a task should only take a few seconds. Most tools on SwiftToolHub run directly in the browser rather than sending files to a distant server and waiting for a response, which means results appear almost instantly. No queue, no spinner, no page reload between tools. This browser-based approach also means many tools work offline-friendly and consistently.",
  },
  {
    icon: ShieldCheck,
    bar: "bg-band-green",
    title: "SwiftToolHub Built With Privacy in Mind",
    body:
      "Free tools often come with a hidden cost such as unclear handling of the files and text you upload. SwiftToolHub processes data locally in the browser wherever technically possible, so sensitive text, code, or images don't need to be sent anywhere to get a result. When server-side processing is unavoidable, files are removed shortly afterwards rather than stored indefinitely.",
    link: { href: "/privacy-policy", label: "Read the privacy policy" },
  },
  {
    icon: MessageSquarePlus,
    bar: "bg-band-orange",
    title: "A Growing Library That is Shaped by Real Requests",
    body:
      "New tools are added on a regular basis, and many of them come directly from user requests submitted through the contact page. The goal isn't to build every tool imaginable, but to build the ones people actually reach for such as free, fast, reliable, and ready the moment you need them. Contact us if you want to see a specific tool on SwiftToolHub or if you have an idea for a new tool that would be useful to the community.",
    link: { href: "/contact", label: "Suggest a tool" },
  },
];

export default function Principles() {
  return (
    <section className="bg-brand-softer px-4 py-24">
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
        {pillars.map((p, i) => (
          <Reveal key={p.title} delay={(i + 1) as 1 | 2 | 3}>
            <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-heading/5 bg-white">
              <div className={`h-1.5 ${p.bar}`} />
              <div className="flex flex-1 flex-col p-7">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-soft text-brand">
                  <p.icon size={20} />
                </span>
                <h2 className="mt-5 text-xl font-bold leading-snug">{p.title}</h2>
                <p className="mt-3 flex-1 text-[14px] leading-[1.75] text-heading/70">{p.body}</p>
                {p.link && (
                  <Link
                    href={p.link.href}
                    className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
                  >
                    {p.link.label}
                    <ArrowUpRight size={14} />
                  </Link>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
