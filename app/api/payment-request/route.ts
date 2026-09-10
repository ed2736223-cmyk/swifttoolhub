import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAnyTool } from "@/lib/dynamicTools";
import { getSiteSettings } from "@/lib/siteSettings";
import { getToolPrice } from "@/lib/tools";

const MAX_BASE64_LENGTH = 4_000_000; // ~3MB decoded, generous for a screenshot
const ALLOWED_MIME = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const VALID_KINDS = ["PRO", "BUNDLE10", "TOOL"] as const;
type Kind = (typeof VALID_KINDS)[number];

// GET: the signed-in user's access status, plus their most recent matching
// payment request for the given kind — so the UI can show "pending review"
// instead of the upload form.
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const kindParam = searchParams.get("kind");
  const kind: Kind = kindParam && (VALID_KINDS as readonly string[]).includes(kindParam)
    ? (kindParam as Kind)
    : "PRO";
  const toolSlug = searchParams.get("toolSlug")?.trim() || null;

  const [candidates, purchases] = await Promise.all([
    kind === "TOOL"
      ? prisma.paymentRequest.findMany({
          where: { userId: session.user.id, kind },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            status: true,
            note: true,
            createdAt: true,
            reviewedAt: true,
            kind: true,
            toolSlugs: true,
            amount: true,
          },
        })
      : prisma.paymentRequest.findFirst({
          where: { userId: session.user.id, kind },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            status: true,
            note: true,
            createdAt: true,
            reviewedAt: true,
            kind: true,
            toolSlugs: true,
            amount: true,
          },
        }).then((r) => (r ? [r] : [])),
    prisma.toolPurchase.findMany({
      where: { userId: session.user.id },
      select: { toolSlug: true },
    }),
  ]);

  // For a single-tool purchase, each tool has its own independent history —
  // find the most recent request that was specifically for this slug.
  const latest =
    kind === "TOOL" && toolSlug
      ? candidates.find((r) => {
          const slugs: string[] = r.toolSlugs ? JSON.parse(r.toolSlugs) : [];
          return slugs.includes(toolSlug);
        }) ?? null
      : candidates[0] ?? null;

  return NextResponse.json({
    plan: session.user.plan,
    unlockedTools: purchases.map((p) => p.toolSlug),
    request: latest
      ? { ...latest, toolSlugs: latest.toolSlugs ? JSON.parse(latest.toolSlugs) : [] }
      : null,
  });
}

// POST: submit a payment screenshot for admin review. Never grants access
// itself — only the admin approve route (app/api/admin/payment-requests)
// does that, after a human has actually looked at the screenshot.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: { screenshot?: string; note?: string; kind?: string; toolSlugs?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const kind: Kind = body.kind && (VALID_KINDS as readonly string[]).includes(body.kind)
    ? (body.kind as Kind)
    : "PRO";

  const settings = await getSiteSettings();

  let amount: number;
  let toolSlugsJson: string | null = null;

  if (kind === "PRO") {
    if (session.user.plan === "PRO") {
      return NextResponse.json({ error: "You're already on the All-Access plan." }, { status: 400 });
    }
    amount = settings.allAccessPrice;
  } else if (kind === "TOOL") {
    if (session.user.plan === "PRO") {
      return NextResponse.json(
        { error: "You're already on the All-Access plan — every tool is unlocked." },
        { status: 400 }
      );
    }
    const requested = Array.from(new Set((body.toolSlugs || []).map((s) => s.trim()).filter(Boolean)));
    if (requested.length !== 1) {
      return NextResponse.json({ error: "Pick exactly one tool to unlock." }, { status: 400 });
    }
    const [slug] = requested;
    const tool = await getAnyTool(slug);
    if (!tool || tool.tier !== "pro") {
      return NextResponse.json({ error: `"${slug}" isn't a paid tool.` }, { status: 400 });
    }
    const alreadyOwned = await prisma.toolPurchase.findUnique({
      where: { userId_toolSlug: { userId: session.user.id, toolSlug: slug } },
    });
    if (alreadyOwned) {
      return NextResponse.json({ error: "You already own this tool." }, { status: 400 });
    }
    amount = getToolPrice(tool); // getAnyTool already applies any admin price override
    toolSlugsJson = JSON.stringify(requested);
  } else {
    if (session.user.plan === "PRO") {
      return NextResponse.json(
        { error: "You're already on the All-Access plan — every tool is unlocked." },
        { status: 400 }
      );
    }
    const requested = Array.from(new Set((body.toolSlugs || []).map((s) => s.trim()).filter(Boolean)));
    if (requested.length === 0) {
      return NextResponse.json({ error: "Pick at least one tool." }, { status: 400 });
    }
    if (requested.length > settings.bundle10Size) {
      return NextResponse.json({ error: `Pick at most ${settings.bundle10Size} tools.` }, { status: 400 });
    }
    for (const slug of requested) {
      const tool = await getAnyTool(slug);
      if (!tool || tool.tier !== "pro") {
        return NextResponse.json({ error: `"${slug}" isn't a paid tool.` }, { status: 400 });
      }
    }
    const alreadyOwned = await prisma.toolPurchase.findMany({
      where: { userId: session.user.id, toolSlug: { in: requested } },
      select: { toolSlug: true },
    });
    if (alreadyOwned.length > 0) {
      return NextResponse.json(
        { error: `You already own: ${alreadyOwned.map((p) => p.toolSlug).join(", ")}.` },
        { status: 400 }
      );
    }
    amount = settings.bundle10Price;
    toolSlugsJson = JSON.stringify(requested);
  }

  // For a single-tool unlock, a pending request for tool A shouldn't block
  // starting one for tool B — scope the "already pending" check to the
  // specific tool being requested.
  const existingPending =
    kind === "TOOL"
      ? (
          await prisma.paymentRequest.findMany({
            where: { userId: session.user.id, kind: "TOOL", status: "PENDING" },
            select: { toolSlugs: true },
          })
        ).some((r) => (r.toolSlugs ? JSON.parse(r.toolSlugs) : []).includes(body.toolSlugs?.[0]))
      : Boolean(
          await prisma.paymentRequest.findFirst({
            where: { userId: session.user.id, kind, status: "PENDING" },
          })
        );
  if (existingPending) {
    return NextResponse.json(
      { error: "You already have a payment screenshot awaiting review for this." },
      { status: 409 }
    );
  }

  const { screenshot, note } = body;

  if (!screenshot || typeof screenshot !== "string" || !screenshot.startsWith("data:")) {
    return NextResponse.json({ error: "A payment screenshot is required." }, { status: 400 });
  }

  const match = /^data:([^;]+);base64,(.+)$/.exec(screenshot);
  if (!match) {
    return NextResponse.json({ error: "Screenshot must be a valid image file." }, { status: 400 });
  }

  const [, mime, data] = match;
  if (!ALLOWED_MIME.includes(mime.toLowerCase())) {
    return NextResponse.json(
      { error: "Screenshot must be a PNG, JPG, or WEBP image." },
      { status: 400 }
    );
  }
  if (data.length > MAX_BASE64_LENGTH) {
    return NextResponse.json(
      { error: "Screenshot is too large. Please upload an image under 3MB." },
      { status: 400 }
    );
  }

  const created = await prisma.paymentRequest.create({
    data: {
      userId: session.user.id,
      kind,
      toolSlugs: toolSlugsJson,
      amount,
      screenshot,
      note: typeof note === "string" ? note.slice(0, 300) : null,
      status: "PENDING",
    },
    select: { id: true, status: true, createdAt: true, kind: true, toolSlugs: true, amount: true },
  });

  return NextResponse.json({ ok: true, request: created });
}
