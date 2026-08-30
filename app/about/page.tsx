import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import Reveal from "@/components/Reveal";
import AdSlot from "@/components/AdSlot";
import { ShieldCheck, FolderLock, Zap, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Why SwiftToolHub exists, how the tools are built, and what we're working on next.",
};

export default function AboutPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-32">
        <Reveal className="text-center">
          <span className="inline-flex items-center rounded-full bg-brand-soft px-4 py-1.5 text-xs font-semibold text-brand">
            About Us
          </span>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
            We built SwiftToolHub because we were sick of our own bookmarks folder. 
          </h1>
        </Reveal>

        {/* The Story */}
        <Reveal delay={1} className="mt-12">
          <h2 className="text-xl font-bold text-heading">The Story</h2>
          <div className="mt-4 space-y-5 text-sm leading-relaxed text-heading/70">
            <p>
              It started with something small and annoying, like one of us needed to convert a JPG to
              PDF for the tenth time that week. But the only problem we were all facing was that the
              site we always used had three pop-up ads. A fake &ldquo;Download&rdquo; button that was
              actually an ad and a 15-second countdown before the real download even showed up.
            </p>
            <p>
              We just closed the tab and then we opened another sketchy converter site. But on that day
              someone in our group chat just said, &ldquo;This is ridiculous; we could build something
              better in a weekend like these online tools.&rdquo;
            </p>
            <p>
              That question eventually turned into a running list. Every time one of us got stuck with a
              slow, outdated or ad-filled tool online we&apos;d add it to the list. A JSON formatter that
              timed out on files over 200 lines, a password generator that asked for your email before
              generating a password, or a color picker hidden behind &ldquo;Watch this ad to
              continue&rdquo; — it all went into our group chat. Over time, the list kept growing until
              we stopped complaining about these tools and decided to build our own.
            </p>
            <p>
              That&apos;s really all SwiftToolHub is: a small team building the tools we personally
              wished existed, for people who just want to get something done and move on with their day.
            </p>
          </div>
        </Reveal>

        {/* Our Mission */}
        <Reveal delay={2} className="mt-12">
          <h2 className="text-xl font-bold text-heading">Our Mission</h2>
          <p className="mt-4 text-sm leading-relaxed text-heading/70">
            We&apos;re people, not a huge company with a mission statement written by committee. So we
            try to keep things simple and hold ourselves to a few basics:
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: Lock,
                title: "No Account Walls",
                desc: "You shouldn't need to sign up just to use a simple tool. Everything here works the moment you open it — no email, no password, for free tools.",
              },
              {
                icon: FolderLock,
                title: "Your Files Are Your Files",
                desc: "Where we can process something right in your browser instead of on a server, we do. Anything that has to touch a server gets cleared out shortly after — we don't want to be holding onto your stuff any longer than we have to.",
              },
              {
                icon: Zap,
                title: "Fast Means Fast",
                desc: "No spinners for things that shouldn't need one. No three-click detours to get to a result that should take one click.",
              },
              {
                icon: ShieldCheck,
                title: "Sign Up For Paid Tools Only",
                desc: "For some advanced tools, we require users to sign up and create an account to access them.",
              },
            ].map((v) => (
              <div key={v.title} className="rounded-2xl border border-heading/10 bg-white p-5 text-left">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-soft text-brand">
                  <v.icon size={16} />
                </span>
                <h3 className="mt-3 text-sm font-semibold text-heading">{v.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-heading/60">{v.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-heading/70">
            We split the work the way a small team does: someone&apos;s usually heads-down on the next
            tool, someone else is answering the emails and reading every bit of feedback that comes in,
            and we all argue in the group chat about what to build next.
          </p>
        </Reveal>

        {/* Where Are We Now */}
        <Reveal delay={3} className="mt-12">
          <h2 className="text-xl font-bold text-heading">Where Are We Now And Our Future Plans?</h2>
          <div className="mt-4 space-y-5 text-sm leading-relaxed text-heading/70">
            <p>
              We&apos;re looking to expand and help more people around the world with our online tool
              services. The team at SwiftToolHub keep adding new tools based on what people actually ask
              for, not just what looks good on a features page.
            </p>
            <p>
              We also offer paid tools with premium features, no ads, and a smoother experience. So if
              you&apos;ve ever used a tool that made you want to throw your laptop, just let us know.
            </p>
            <p>
              There&apos;s a good chance it&apos;s next on our list on this platform. You can simply
              contact us through our support email at{" "}
              <a href="mailto:info@swifttoolhub.com" className="font-semibold text-brand">
                info@swifttoolhub.com
              </a>{" "}
              or just get updates straight to your inbox by{" "}
              <Link href="/contact" className="font-semibold text-brand">
                signing up for our newsletter
              </Link>
              .
            </p>
            <p>Thanks for stopping by. We hope you find the tool you need and get back to your day.</p>
          </div>
        </Reveal>

        <Reveal delay={4} className="mt-12">
          <AdSlot label="In-content ad" />
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
