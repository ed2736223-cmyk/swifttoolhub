import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of SwiftToolHub.",
};

export default function TermsPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-32">
        <span className="inline-flex items-center rounded-full bg-brand-soft px-4 py-1.5 text-xs font-semibold text-brand">
          Legal
        </span>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Terms of Service</h1>
        <p className="mt-2 text-sm text-heading/50">Last updated: July 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-heading/70">
          <p className="italic">
            Welcome to SwiftToolHub. By using our site and tools, you&apos;re agreeing to the terms detailed in the below sections. We&apos;ve kept this as plain as we could, no legal padding, just what you actually need to know.
          </p>

          <section>
            <h2 className="text-lg font-semibold text-heading">1. Using Our Tools</h2>
            <p className="mt-2">
              SwiftToolHub gives you free access to a set of everyday tools for your daily use. But keep in mind that some of our tools have usage limits on the free plan; then after you hit those, you&apos;ll be prompted to upgrade to PRO. In PRO plans, if you want higher limits or priority support you can just see and buy the plans that match your budget and needs well. You&apos;re never required to upgrade to use the core tools as the free tier stays free.
            </p>
            <p className="mt-2 font-medium text-heading">By using the site, you agree to:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Only use SwiftToolHub for lawful purposes</li>
              <li>Not use our tools to create or spread harmful, illegal, or malicious content</li>
              <li>Not try to break, overload, scrape, or interfere with the site or its tools</li>
              <li>Not resell, redistribute, or repackage our tools as your own product</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-heading">2. Accuracy of Online Tools&apos; Results</h2>
            <p className="mt-2">
              Our tools are built to be fast and reliable but we can&apos;t guarantee that every result is 100% accurate in every situation. Things like conversions, generated passwords, or formatted output should be checked before you use them somewhere important. Use your own judgement as we&apos;re just providing a tool, not a guarantee.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-heading">3. Free and Paid Plans</h2>
            <p className="mt-2">
              <strong>Free</strong> gives you access to our core tools with standard limits.
            </p>
            <p className="mt-1">
              <strong>Plus and Team plans</strong> unlock higher limits, no ads, saved history, and extra features like API access, for a monthly fee shown on our pricing page.
            </p>
            <p className="mt-2">
              You can cancel a paid plan anytime. You&apos;ll keep access until the end of your current billing period, we don&apos;t do partial refunds for unused time unless required by law.
            </p>
            <p className="mt-2">
              Prices and plan features may change. If they do, we&apos;ll update the pricing page as we won&apos;t spring surprise charges on you.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-heading">4. Your Files and Content on This Site</h2>
            <p className="mt-2">
              Anything you upload or type into a tool is yours. We don&apos;t claim ownership over it. Where a tool needs to briefly process something on a server, we don&apos;t keep it around longer than needed to give you your result, see our Privacy Policy for the full details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-heading">5. What We&apos;re Not Responsible For</h2>
            <p className="mt-2">
              SwiftToolHub is provided &quot;as is.&quot; We work hard to keep things running smoothly, but we can&apos;t promise it&apos;ll be available 24/7 error-free or perfect for every use case. Issues can happen and if you hit one, just reach out and we&apos;ll help. We&apos;re not liable for any loss or damage that comes from using or being unable to use our tools.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-heading">6. Changes to the Site or These Terms Can Happen</h2>
            <p className="mt-2">
              We&apos;re a small team and things evolve. We may update tools, add new ones, or change these terms as we grow. Whenever we do, our team at SwiftToolHub will make sure to keep you updated, usually by posting the change here and updating the date at the top of this page. Continuing to use the site after a change means you&apos;re okay with the update.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-heading">7. Governing Law for Fraud and Disputes</h2>
            <p className="mt-2">
              These terms are governed by the laws of Delaware, and any disputes will be handled under Delaware jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-heading">8. Questions?</h2>
            <p className="mt-2">
              Reach out anytime at{" "}
              <a href="mailto:support@swifttoolhub.com" className="text-brand underline">
                support@swifttoolhub.com
              </a>{" "}
              as we read everything ourselves.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}