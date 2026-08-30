import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTool } from "@/lib/tools";
import { isValidCategory, isValidTier, slugify } from "@/lib/dynamicTools";
import { ICON_NAMES } from "@/lib/iconMap";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }

  const dbTools = await prisma.tool.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ tools: dbTools, iconOptions: ICON_NAMES });
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
    name?: string;
    slug?: string;
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

  const name = (body.name || "").trim();
  const shortDesc = (body.shortDesc || "").trim();
  const content = (body.content || "").trim();
  const category = (body.category || "Convert").trim();
  const tier = (body.tier || "free").trim();
  const icon = (body.icon || "Wrench").trim();
  const slug = slugify(body.slug || name);

  if (!name || !shortDesc || !content) {
    return NextResponse.json(
      { error: "Name, short description and content are required." },
      { status: 400 }
    );
  }
  if (!slug) {
    return NextResponse.json({ error: "Couldn't derive a valid slug from that name." }, { status: 400 });
  }
  if (!isValidCategory(category)) {
    return NextResponse.json({ error: "Invalid category." }, { status: 400 });
  }
  if (!isValidTier(tier)) {
    return NextResponse.json({ error: "Tier must be free or pro." }, { status: 400 });
  }
  if (!ICON_NAMES.includes(icon)) {
    return NextResponse.json({ error: "Invalid icon." }, { status: 400 });
  }
  const price = tier === "pro" ? Number(body.price) : 0;
  if (tier === "pro" && (!Number.isFinite(price) || price <= 0)) {
    return NextResponse.json(
      { error: "Pro tools need their own price greater than $0." },
      { status: 400 }
    );
  }
  if (getTool(slug)) {
    return NextResponse.json(
      { error: `"${slug}" is already a built-in tool slug — pick another name.` },
      { status: 409 }
    );
  }

  const existing = await prisma.tool.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: `A tool with slug "${slug}" already exists.` }, { status: 409 });
  }

  const created = await prisma.tool.create({
    data: {
      slug,
      name,
      shortDesc,
      content,
      howTo: body.howTo?.trim() || null,
      category,
      tier,
      price,
      icon,
    },
  });

  return NextResponse.json({ ok: true, tool: created });
}
