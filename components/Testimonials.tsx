import { Star } from "lucide-react";
import Reveal from "./Reveal";

const testimonials = [
  { name: "Ayesha Khan", role: "Frontend Developer", quote: "The JSON formatter alone saves me a bookmark folder full of sketchy sites. Clean and fast.", tag: "Developer" },
  { name: "Daniel Cole", role: "SEO Consultant", quote: "I check meta tags for every client site here now. No ads fighting for space, just the result.", tag: "SEO" },
  { name: "Meera Patel", role: "Product Designer", quote: "Color picker and unit converter live in a pinned tab. Genuinely faster than anything else I tried.", tag: "Design" },
  { name: "Tom Bennett", role: "Support Engineer", quote: "QR generator and password tool cover half my daily tickets. It just works, every time.", tag: "Support" },
];

export default function Testimonials() {
  return (
    <section className="bg-brand-softer px-4 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <span className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-brand">
            Testimonials
          </span>
        </Reveal>
        <Reveal delay={1}>
          <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
            How People Use SwiftToolHub Daily
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={((i % 4) + 1) as 1 | 2 | 3 | 4} className="text-left">
              <div className="h-full rounded-2xl border border-heading/5 bg-white p-6 shadow-[0_10px_40px_-24px_rgba(36,18,66,0.3)]">
                <div className="flex gap-0.5 text-brand">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={13} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-heading/70">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-heading">{t.name}</p>
                    <p className="text-xs text-heading/50">{t.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
