import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { Mail, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the SwiftToolHub team — questions, feedback, or tool requests.",
};

export default function ContactPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-32">
        <Reveal className="text-center">
          <span className="inline-flex items-center rounded-full bg-brand-soft px-4 py-1.5 text-xs font-semibold text-brand">
            Contact
          </span>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Reach Out</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-heading/60">
            Something not working? Something missing? Tell us, and we will help you.it over.
          </p>
        </Reveal>

        <Reveal delay={1} className="mt-10 grid gap-4 sm:grid-cols-2">
          <a
            href="mailto:hello@swifttoolhub.com"
            className="flex items-center gap-3 rounded-2xl border border-heading/10 bg-white p-5"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
              <Mail size={17} />
            </span>
            <div>
              <p className="text-sm font-semibold text-heading">Email</p>
              <p className="text-xs text-heading/50">support@swifttoolhub.com</p>
            </div>
          </a>
          <div className="flex items-center gap-3 rounded-2xl border border-heading/10 bg-white p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
              <MessageSquare size={17} />
            </span>
            <div>
              <p className="text-sm font-semibold text-heading">Response Time</p>
              <p className="text-xs text-heading/50">Usually within 1–2 business days</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={2} className="mt-8">
          <ContactForm />
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
