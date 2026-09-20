import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, Clock, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import AdSlot from "@/components/AdSlot";
import BlogBlocksRenderer, { buildFaqJsonLd } from "@/components/blog/BlogBlocksRenderer";
import { getAnyPost } from "@/lib/dynamicBlog";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const BANDS = ["from-brand-light to-brand-dark", "from-band-orange to-brand", "from-band-green to-brand-dark"];

function bandFor(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return BANDS[hash % BANDS.length];
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getAnyPost(params.slug);
  if (!post) return {};
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url,
      type: "article",
      images: post.coverImage ? [post.coverImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.metaDescription,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getAnyPost(params.slug);
  if (!post) notFound();

  const faqJsonLd = buildFaqJsonLd(post.blocks);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    dateModified: post.date,
    ...(post.coverImage ? { image: [post.coverImage] } : {}),
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
      <ScrollProgress />
      <Navbar />
      <main className="pb-24 pt-32">
        <div className="mx-auto max-w-2xl px-4">
          <div className="flex items-center gap-3 text-xs text-heading/40">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {post.readTime}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{post.title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-heading/60">{post.excerpt}</p>
        </div>

        <div className="relative mx-auto mt-8 aspect-[16/8] max-w-4xl overflow-hidden rounded-3xl px-4 sm:aspect-[16/6]">
          <div
            className={`h-full w-full overflow-hidden rounded-3xl ${
              post.coverImage ? "" : `bg-gradient-to-br ${bandFor(post.slug)}`
            }`}
          >
            {post.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.coverImage}
                alt={post.coverImageAlt || post.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Sparkles className="h-10 w-10 text-white/70" />
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-4">
          {/* Real article content is never wrapped in a scroll-triggered
              reveal — it must always be visible immediately, with no
              dependency on JS/IntersectionObserver firing correctly. */}
          <div className="mt-10">
            <BlogBlocksRenderer blocks={post.blocks} />
          </div>

          <div className="mt-10">
            <AdSlot label="In-content ad" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
