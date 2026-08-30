import Link from "next/link";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";
import Reveal from "@/components/Reveal";
import type { Section } from "@/lib/pageSections";

export default function SectionRenderer({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((s, i) => {
        const delay = ((i % 4) + 1) as 1 | 2 | 3 | 4;
        switch (s.type) {
          case "hero":
            return (
              <Reveal key={s.id} className="text-center">
                {s.data.badge && (
                  <span className="inline-flex items-center rounded-full bg-brand-soft px-4 py-1.5 text-xs font-semibold text-brand">
                    {s.data.badge}
                  </span>
                )}
                <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{s.data.heading}</h1>
                {s.data.subheading && (
                  <p className="mx-auto mt-3 max-w-xl text-sm text-heading/60">{s.data.subheading}</p>
                )}
                {s.data.ctaLabel && s.data.ctaHref && (
                  <Link
                    href={s.data.ctaHref}
                    className="btn-glow mt-6 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    {s.data.ctaLabel} <ArrowRight size={14} />
                  </Link>
                )}
              </Reveal>
            );

          case "richtext":
            return (
              <Reveal key={s.id} delay={delay} className="mt-10 space-y-4 text-sm leading-relaxed text-heading/70">
                {s.data.heading && <h2 className="text-xl font-bold text-heading">{s.data.heading}</h2>}
                {s.data.body
                  .split("\n")
                  .filter((p) => p.trim())
                  .map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
              </Reveal>
            );

          case "features":
            return (
              <Reveal key={s.id} delay={delay} className="mt-12">
                {s.data.heading && <h2 className="mb-5 text-xl font-bold text-heading">{s.data.heading}</h2>}
                <div className="grid gap-4 sm:grid-cols-3">
                  {s.data.items.map((f, j) => (
                    <div key={j} className="rounded-2xl border border-heading/10 bg-white p-5 text-left">
                      <h3 className="text-sm font-semibold text-heading">{f.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-heading/60">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            );

          case "faq":
            return (
              <Reveal key={s.id} delay={delay} className="mt-12">
                {s.data.heading && <h2 className="mb-5 text-xl font-bold text-heading">{s.data.heading}</h2>}
                <div className="space-y-3">
                  {s.data.items.map((f, j) => (
                    <div key={j} className="rounded-2xl border border-heading/10 bg-white p-5 text-left">
                      <p className="text-sm font-semibold text-heading">{f.question}</p>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-heading/60">{f.answer}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            );

          case "cta":
            return (
              <Reveal key={s.id} delay={delay} className="mt-12 rounded-3xl bg-hero-radial p-8 text-center sm:p-10">
                <h2 className="text-xl font-bold text-white sm:text-2xl">{s.data.heading}</h2>
                {s.data.subheading && <p className="mx-auto mt-2 max-w-md text-sm text-white/60">{s.data.subheading}</p>}
                <Link
                  href={s.data.buttonHref}
                  className="btn-glow mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-heading"
                >
                  {s.data.buttonLabel} <ArrowRight size={14} />
                </Link>
              </Reveal>
            );

          case "contactInfo":
            return (
              <Reveal key={s.id} delay={delay} className="mt-12">
                {s.data.heading && <h2 className="mb-5 text-xl font-bold text-heading">{s.data.heading}</h2>}
                <div className="grid gap-3 sm:grid-cols-2">
                  {s.data.email && (
                    <div className="flex items-center gap-3 rounded-2xl border border-heading/10 bg-white p-4">
                      <Mail size={16} className="text-brand" />
                      <span className="text-sm text-heading/70">{s.data.email}</span>
                    </div>
                  )}
                  {s.data.phone && (
                    <div className="flex items-center gap-3 rounded-2xl border border-heading/10 bg-white p-4">
                      <Phone size={16} className="text-brand" />
                      <span className="text-sm text-heading/70">{s.data.phone}</span>
                    </div>
                  )}
                  {s.data.address && (
                    <div className="flex items-center gap-3 rounded-2xl border border-heading/10 bg-white p-4 sm:col-span-2">
                      <MapPin size={16} className="text-brand" />
                      <span className="text-sm text-heading/70">{s.data.address}</span>
                    </div>
                  )}
                </div>
                {s.data.note && <p className="mt-3 text-xs text-heading/50">{s.data.note}</p>}
              </Reveal>
            );

          default:
            return null;
        }
      })}
    </>
  );
}
