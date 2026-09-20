import { prisma } from "@/lib/prisma";
import { posts as staticPosts, getPost as getStaticPost, type Post } from "@/lib/blog";
import { parseBlocks, blocksToPlainText, wordCount, estimateReadTime, type ContentBlock } from "@/lib/blogBlocks";

export type DbBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  coverImage: string | null;
  coverImageAlt: string | null;
  readTime: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

/** A post ready to render — blocks already parsed, SEO tags already resolved with fallbacks. */
export type RenderablePost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  blocks: ContentBlock[];
  metaTitle: string;
  metaDescription: string;
  coverImage?: string | null;
  coverImageAlt?: string | null;
  dynamic?: boolean;
};

function toPost(row: DbBlogPost): RenderablePost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    date: row.createdAt.toISOString().slice(0, 10),
    readTime: row.readTime,
    blocks: parseBlocks(row.content),
    metaTitle: row.metaTitle?.trim() || row.title,
    metaDescription: row.metaDescription?.trim() || row.excerpt,
    coverImage: row.coverImage,
    coverImageAlt: row.coverImageAlt,
    dynamic: true,
  };
}

/** Built-in posts (lib/blog.ts) normalized to the same renderable shape. */
function staticToPost(p: Post): RenderablePost {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.date,
    readTime: p.readTime,
    blocks: p.content.map((text) => ({
      id: `static_${p.slug}_${text.slice(0, 8)}`,
      type: "paragraph" as const,
      data: { text },
    })),
    metaTitle: p.title,
    metaDescription: p.excerpt,
    dynamic: false,
  };
}

/** Raw DB rows, admin-panel shape (used by the manage-blog UI). */
export async function listDbPosts(): Promise<DbBlogPost[]> {
  return prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
}

/** Built-in + admin-added posts that are published, newest first. */
export async function getMergedPosts(): Promise<RenderablePost[]> {
  const rows = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  const dynamic = rows.map(toPost);
  return [...dynamic, ...staticPosts.map(staticToPost)].sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Every published post (built-in + admin-added) — used for the sitemap. */
export async function getAllPublishedPosts(): Promise<RenderablePost[]> {
  return getMergedPosts();
}

/** Look up any post by slug — checks admin-added posts first, then the built-in list. */
export async function getAnyPost(slug: string): Promise<RenderablePost | null> {
  const row = await prisma.blogPost.findUnique({ where: { slug } });
  if (row) return toPost(row);
  const built = getStaticPost(slug);
  return built ? staticToPost(built) : null;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export { wordCount, estimateReadTime, blocksToPlainText };
