import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPost } from "@/lib/blog";
import { slugify, estimateReadTime } from "@/lib/dynamicBlog";
import {
  serializeBlocks,
  blocksToPlainText,
  isBlockEmpty,
  type ContentBlock,
} from "@/lib/blogBlocks";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // ~4MB data URL

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }

  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }

  let body: {
    title?: string;
    slug?: string;
    excerpt?: string;
    blocks?: ContentBlock[];
    metaTitle?: string;
    metaDescription?: string;
    coverImage?: string;
    coverImageAlt?: string;
    published?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const title = (body.title || "").trim();
  const excerpt = (body.excerpt || "").trim();
  const blocks = (Array.isArray(body.blocks) ? body.blocks : []).filter((b) => !isBlockEmpty(b));
  const slug = slugify(body.slug || title);

  // No word/character limit on content — as many or as few blocks as the
  // admin wants. The only requirement is that there's *something* to publish.
  if (!title || !excerpt || blocks.length === 0) {
    return NextResponse.json(
      { error: "Title, excerpt and at least one content block are required." },
      { status: 400 }
    );
  }
  if (!slug) {
    return NextResponse.json({ error: "Couldn't derive a valid slug from that title." }, { status: 400 });
  }
  if (body.coverImage && body.coverImage.length > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "Cover image is too large — please use a smaller file." }, { status: 400 });
  }
  if (getPost(slug)) {
    return NextResponse.json(
      { error: `"${slug}" is already a built-in blog slug — pick another title.` },
      { status: 409 }
    );
  }
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: `A blog post with slug "${slug}" already exists.` }, { status: 409 });
  }

  const plainText = blocksToPlainText(blocks);

  const created = await prisma.blogPost.create({
    data: {
      slug,
      title,
      excerpt,
      content: serializeBlocks(blocks),
      metaTitle: (body.metaTitle || "").trim() || null,
      metaDescription: (body.metaDescription || "").trim() || null,
      coverImage: body.coverImage || null,
      coverImageAlt: (body.coverImageAlt || "").trim() || null,
      readTime: estimateReadTime(plainText),
      published: body.published ?? true,
    },
  });

  return NextResponse.json({ ok: true, post: created });
}
