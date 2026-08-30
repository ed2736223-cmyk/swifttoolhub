import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import Reveal from "@/components/Reveal";
import AdSlot from "@/components/AdSlot";
import { posts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Guides and tips on IT tools, productivity, and everyday tech tasks.",
};

export default function BlogIndexPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-32">
        <Reveal className="text-center">
          <span className="inline-flex items-center rounded-full bg-brand-soft px-4 py-1.5 text-xs font-semibold text-brand">
            Blog
          </span>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Guides & Tips</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-heading/60">
            Short, practical reads on tools, security, and everyday productivity.
          </p>
        </Reveal>

        <Reveal delay={1} className="mt-10">
          <AdSlot label="In-feed ad" />
        </Reveal>

        <div className="mt-8 space-y-5">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block rounded-2xl border border-heading/10 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/10"
              >
                <div className="flex items-center gap-3 text-xs text-heading/40">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {post.readTime}
                  </span>
                </div>
                <h2 className="mt-2 text-lg font-semibold text-heading">{post.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-heading/60">{post.excerpt}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand opacity-0 transition-opacity group-hover:opacity-100">
                  Read more <ArrowUpRight size={12} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
