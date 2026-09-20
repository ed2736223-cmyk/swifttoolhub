import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { estimateReadTime } from "@/lib/dynamicBlog";
import { serializeBlocks, blocksToPlainText, isBlockEmpty, type ContentBlock } from "@/lib/blogBlocks";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // ~4MB data URL

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }

  const target = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!target) {
    return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
  }

  let body: {
    title?: string;
    excerpt?: string;
    blocks?: ContentBlock[];
    metaTitle?: string | null;
    metaDescription?: string | null;
    coverImage?: string | null;
    coverImageAlt?: string | null;
    published?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data: Record<string, string | boolean | null> = {};

  if (body.title !== undefined) {
    if (!body.title.trim()) return NextResponse.json({ error: "Title can't be empty." }, { status: 400 });
    data.title = body.title.trim();
  }
  if (body.excerpt !== undefined) {
    if (!body.excerpt.trim())
      return NextResponse.json({ error: "Excerpt can't be empty." }, { status: 400 });
    data.excerpt = body.excerpt.trim();
  }
  if (body.blocks !== undefined) {
    // No word/character limit on content — any number of blocks is fine, as
    // long as at least one of them actually has something in it.
    const blocks = (Array.isArray(body.blocks) ? body.blocks : []).filter((b) => !isBlockEmpty(b));
    if (blocks.length === 0) {
      return NextResponse.json({ error: "Add at least one content block." }, { status: 400 });
    }
    data.content = serializeBlocks(blocks);
    data.readTime = estimateReadTime(blocksToPlainText(blocks));
  }
  if (body.metaTitle !== undefined) {
    data.metaTitle = (body.metaTitle || "").trim() || null;
  }
  if (body.metaDescription !== undefined) {
    data.metaDescription = (body.metaDescription || "").trim() || null;
  }
  if (body.coverImage !== undefined) {
    if (body.coverImage && body.coverImage.length > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Cover image is too large — please use a smaller file." }, { status: 400 });
    }
    data.coverImage = body.coverImage || null;
  }
  if (body.coverImageAlt !== undefined) {
    data.coverImageAlt = (body.coverImageAlt || "").trim() || null;
  }
  if (body.published !== undefined) {
    data.published = body.published;
  }

  const updated = await prisma.blogPost.update({ where: { id: params.id }, data });
  return NextResponse.json({ ok: true, post: updated });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }

  const target = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!target) {
    return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
  }

  await prisma.blogPost.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
