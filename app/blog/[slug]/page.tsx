import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import Reveal from "@/components/Reveal";
import AdSlot from "@/components/AdSlot";
import { posts, getPost } from "@/lib/blog";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 pb-24 pt-32">
        <Reveal>
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
        </Reveal>

        <Reveal delay={1} className="mt-8 space-y-5 text-sm leading-relaxed text-heading/70">
          {post.content.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </Reveal>

        <Reveal delay={2} className="mt-10">
          <AdSlot label="In-content ad" />
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
