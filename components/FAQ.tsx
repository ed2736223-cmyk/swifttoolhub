"use client";

import { useState } from "react";
import { ChevronDown, Phone, Mail } from "lucide-react";
import Reveal from "./Reveal";
import JsonLd from "./JsonLd";

const faqs = [
  {
    q: "Do the tools work on mobile?",
    a: "Every tool is built to work on phones and tablets, and no separate app is needed.",
  },
  {
    q: "Is my data sold or shared with third parties?",
    a: "No. SwiftToolHub doesn't sell user data, and the privacy policy outlines exactly what is and isn't collected.",
  },
  {
    q: "Can I use these tools for commercial or client work?",
    a: "Yes. There are no restrictions on using results such as converted files, generated passwords, formatted code, and so on for personal, freelance, or business projects",
  },
  {
    q: "How often are new tools added?",
    a: "New tools are released regularly, usually based on what people request. If there's a converter, checker, or generator you wish existed here, you can suggest it directly from the contact page.",
  },
  
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="faq" className="scroll-mt-24 bg-brand-softer px-4 py-24">
      <JsonLd data={faqSchema} />
      <div className="mx-auto max-w-4xl">
        <Reveal className="text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Got Questions? We’ve Got Answers</h2>
          
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-[1.4fr,1fr]">
          <Reveal delay={1}>
            <div className="divide-y divide-heading/10 rounded-3xl bg-white p-2 shadow-sm">
              {faqs.map((f, i) => (
                <div key={f.q} className="p-4">
                  <button
                    className="flex w-full items-center justify-between gap-4 text-left"
                    onClick={() => setOpen(open === i ? null : i)}
                    aria-expanded={open === i}
                  >
                    <span className="text-sm font-semibold text-heading">{f.q}</span>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 text-brand transition-transform ${open === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${
                      open === i ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <p className="overflow-hidden text-[13px] leading-relaxed text-heading/60">{f.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div className="flex h-full flex-col items-center justify-center gap-4 rounded-3xl bg-white p-8 text-center shadow-sm">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-gradient text-white">
                <Mail size={18} />
              </span>
              <p className="text-sm font-semibold text-heading">
                Have more questions? <br /> Reach out any time
              </p>
              <a
                href="tel:+10000000000"
                className="btn-glow flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white"
              >
                <Phone size={14} /> Contact Support
              </a>
              <p className="text-xs text-heading/40">or email support@swifttoolhub.com</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
