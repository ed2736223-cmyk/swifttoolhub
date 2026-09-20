import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Calendar, Clock, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import Reveal from "@/components/Reveal";
import AdSlot from "@/components/AdSlot";
import { getMergedPosts } from "@/lib/dynamicBlog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Guides and tips on IT tools, productivity, and everyday tech tasks.",
};

const BANDS = ["from-brand-light to-brand-dark", "from-band-orange to-brand", "from-band-green to-brand-dark"];

function bandFor(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return BANDS[hash % BANDS.length];
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function BlogIndexPage() {
  const posts = await getMergedPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-32">
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

        {!posts.length ? (
          <p className="mt-16 text-center text-sm text-heading/40">No posts yet — check back soon.</p>
        ) : (
          <>
            {featured && (
              <Reveal delay={1} className="mt-10">
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group grid overflow-hidden rounded-3xl border border-heading/10 bg-white transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/10 sm:grid-cols-2"
                >
                  <div
                    className={`relative aspect-[16/10] overflow-hidden sm:aspect-auto ${
                      featured.coverImage ? "" : `bg-gradient-to-br ${bandFor(featured.slug)}`
                    }`}
                  >
                    {featured.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={featured.coverImage}
                        alt={featured.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center p-8">
                        <Sparkles className="h-10 w-10 text-white/70" />
                      </div>
                    )}
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-heading backdrop-blur">
                      Latest
                    </span>
                  </div>
                  <div className="flex flex-col justify-center p-6 sm:p-8">
                    <div className="flex items-center gap-3 text-xs text-heading/40">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(featured.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {featured.readTime}
                      </span>
                    </div>
                    <h2 className="mt-2 text-xl font-bold text-heading sm:text-2xl">{featured.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-heading/60">{featured.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand">
                      Read more{" "}
                      <ArrowUpRight
                        size={12}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </div>
                </Link>
              </Reveal>
            )}

            {rest.length > 0 && (
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {rest.map((post, i) => (
                  <Reveal key={post.slug} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-heading/10 bg-white transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/10"
                    >
                      <div
                        className={`relative aspect-[16/9] overflow-hidden ${
                          post.coverImage ? "" : `bg-gradient-to-br ${bandFor(post.slug)}`
                        }`}
                      >
                        {post.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Sparkles className="h-7 w-7 text-white/70" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex items-center gap-3 text-xs text-heading/40">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {formatDate(post.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {post.readTime}
                          </span>
                        </div>
                        <h3 className="mt-2 text-lg font-semibold text-heading">{post.title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-heading/60">{post.excerpt}</p>
                        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand opacity-0 transition-opacity group-hover:opacity-100">
                          Read more <ArrowUpRight size={12} />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
