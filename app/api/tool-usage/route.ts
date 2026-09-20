import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSiteSettings, getToolOverrides, effectiveUseLimit } from "@/lib/siteSettings";

// Called once per free-tool page load by ToolAccessGate for signed-in
// users (anonymous visitors are counted client-side in localStorage
// instead, since there's no user row to attach a count to). All-Access
// users skip this entirely — see ToolAccessGate.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    // Not signed in — caller falls back to the localStorage counter.
    return NextResponse.json({ count: 0, limited: false, tracked: false });
  }

  let body: { toolSlug?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const toolSlug = body.toolSlug?.trim();
  if (!toolSlug) {
    return NextResponse.json({ error: "Missing tool." }, { status: 400 });
  }

  const [settings, overrides] = await Promise.all([getSiteSettings(), getToolOverrides()]);
  const limit = effectiveUseLimit(overrides, toolSlug, settings.defaultFreeUseLimit);

  if (limit === -1) {
    // Unlimited for this tool (admin override) — don't even bother tracking.
    return NextResponse.json({ count: 0, limited: false, tracked: false });
  }

  const existing = await prisma.toolUsage.findUnique({
    where: { userId_toolSlug: { userId: session.user.id, toolSlug } },
  });

  // Already at the limit — don't increment further, just report it.
  if (existing && existing.count >= limit) {
    return NextResponse.json({ count: existing.count, limited: true, tracked: true });
  }

  const updated = await prisma.toolUsage.upsert({
    where: { userId_toolSlug: { userId: session.user.id, toolSlug } },
    create: { userId: session.user.id, toolSlug, count: 1 },
    update: { count: { increment: 1 } },
  });

  return NextResponse.json({
    count: updated.count,
    limited: updated.count >= limit,
    tracked: true,
  });
}
