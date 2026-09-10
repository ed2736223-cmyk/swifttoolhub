import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isValidCategory, isValidTier } from "@/lib/dynamicTools";
import { ICON_NAMES } from "@/lib/iconMap";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }

  const target = await prisma.tool.findUnique({ where: { id: params.id } });
  if (!target) {
    return NextResponse.json({ error: "Tool not found." }, { status: 404 });
  }

  let body: {
    name?: string;
    shortDesc?: string;
    content?: string;
    howTo?: string;
    category?: string;
    tier?: string;
    price?: number;
    icon?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data: Record<string, string | number | null> = {};

  if (body.name !== undefined) {
    if (!body.name.trim()) return NextResponse.json({ error: "Name can't be empty." }, { status: 400 });
    data.name = body.name.trim();
  }
  if (body.shortDesc !== undefined) {
    if (!body.shortDesc.trim())
      return NextResponse.json({ error: "Short description can't be empty." }, { status: 400 });
    data.shortDesc = body.shortDesc.trim();
  }
  if (body.content !== undefined) {
    if (!body.content.trim())
      return NextResponse.json({ error: "Content can't be empty." }, { status: 400 });
    data.content = body.content.trim();
  }
  if (body.howTo !== undefined) {
    data.howTo = body.howTo.trim() || null;
  }
  if (body.category !== undefined) {
    if (!isValidCategory(body.category)) {
      return NextResponse.json({ error: "Invalid category." }, { status: 400 });
    }
    data.category = body.category;
  }
  if (body.tier !== undefined) {
    if (!isValidTier(body.tier)) {
      return NextResponse.json({ error: "Tier must be free or pro." }, { status: 400 });
    }
    data.tier = body.tier;
  }
  if (body.icon !== undefined) {
    if (!ICON_NAMES.includes(body.icon)) {
      return NextResponse.json({ error: "Invalid icon." }, { status: 400 });
    }
    data.icon = body.icon;
  }

  const resultingTier = (data.tier as string | undefined) ?? target.tier;
  if (body.price !== undefined) {
    const price = Number(body.price);
    if (resultingTier === "pro" && (!Number.isFinite(price) || price <= 0)) {
      return NextResponse.json(
        { error: "Pro tools need their own price greater than $0." },
        { status: 400 }
      );
    }
    data.price = resultingTier === "pro" ? price : 0;
  } else if (resultingTier !== target.tier) {
    // Tier just changed and no explicit price was sent — reset it sensibly.
    data.price = resultingTier === "pro" ? Math.max(target.price, 1) : 0;
  }

  const updated = await prisma.tool.update({ where: { id: params.id }, data });
  return NextResponse.json({ ok: true, tool: updated });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }

  const target = await prisma.tool.findUnique({ where: { id: params.id } });
  if (!target) {
    return NextResponse.json({ error: "Tool not found." }, { status: 404 });
  }

  await prisma.tool.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
