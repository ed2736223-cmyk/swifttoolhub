import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How SwiftToolHub collects, uses, and protects your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-32">
        <span className="inline-flex items-center rounded-full bg-brand-soft px-4 py-1.5 text-xs font-semibold text-brand">
          Legal
        </span>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-heading/50">Last updated: July 2026</p>

        <p className="mt-6 text-sm leading-relaxed text-heading/70">
          At SwiftToolHub, we know nobody actually loves reading a privacy policy. So we&apos;ll keep this short and say plainly what we do and don&apos;t do with your information.
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-heading/70">
          <section>
            <h2 className="text-lg font-semibold text-heading">1. What We Collect</h2>
            <p className="mt-2">
              We try to collect as little as possible.
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                <strong>Usage data:</strong> We use Google Analytics to see general stuff like which pages get visited and how people move around the site. This data is anonymous, we&apos;re not tracking you personally as just watching overall trends.
              </li>
              <li>
                <strong>What you put into our tools:</strong> Most of our tools run right in your browser. That means when you convert a file, generate a password, or format some JSON, it never actually leaves your device. Plus we don&apos;t see it, and we don&apos;t store it.
              </li>
              <li>
                <strong>Your contact info:</strong> If you email us or fill out a contact form or just sign up for tools, we&apos;ll have your name and email so we can actually reply to you. That&apos;s it.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-heading">2. About Our Tools Specifically</h2>
            <p className="mt-2">
              A lot of tools online quietly upload your files to a server somewhere. We try hard not to do that. Where a tool can run entirely in your browser, it does as your file stays on your device the whole time.
            </p>
            <p className="mt-2">
              For any tool that does need to briefly touch a server to work, we don&apos;t keep what you upload any longer than it takes to give you your result back.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-heading">3. Cookies</h2>
            <p className="mt-2">
              We use cookies but that&apos;s mainly to understand how people use the site so we can make it better for you guys. If you&apos;d rather not be tracked at all then you can just block cookies in your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-heading">4. Security</h2>
            <p className="mt-2">
              We take reasonable measures to keep your information secure. That said, nothing sent over the internet can ever be guaranteed 100% secure, so we can&apos;t make absolute promises, but we don&apos;t take this lightly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-heading">5. Do We Sell Your Data?</h2>
            <p className="mt-2">
              No. We don&apos;t sell your information to anyone, ever. That&apos;s not how we make money and it&apos;s not something we&apos;re interested in doing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-heading">6. Changes to This Policy</h2>
            <p className="mt-2">
              In case of any updates or changes in policy for our users, we&apos;ll update this page. We&apos;re a small team, so the changes here are usually small or just updates to tools. But the interesting fact is that we&apos;ll always keep this page current.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-heading">7. Questions?</h2>
            <p className="mt-2">
              If anything here is unclear, or you just want to ask us something directly, email us at{" "}
              <a href="mailto:info@swifttoolhub.com" className="text-brand underline">
                info@swifttoolhub.com
              </a>
              . A real person will read it and reply.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}