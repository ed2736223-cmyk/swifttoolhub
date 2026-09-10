import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }

  let body: { action?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (body.action !== "approve" && body.action !== "reject") {
    return NextResponse.json({ error: "action must be 'approve' or 'reject'." }, { status: 400 });
  }

  const request = await prisma.paymentRequest.findUnique({ where: { id: params.id } });
  if (!request) {
    return NextResponse.json({ error: "Payment request not found." }, { status: 404 });
  }
  if (request.status !== "PENDING") {
    return NextResponse.json({ error: "This request has already been reviewed." }, { status: 409 });
  }

  const newStatus = body.action === "approve" ? "APPROVED" : "REJECTED";

  // Only a human-approved request ever grants access — and what it grants
  // depends on what was actually paid for. Using the callback form of
  // $transaction (not an array literal) here on purpose: an array mixing a
  // PaymentRequest update with N ToolPurchase upserts previously broke the
  // production build because TypeScript couldn't reconcile the different
  // Prisma result types in one tuple. The callback form has no such
  // literal-array type to infer.
  const updatedRequest = await prisma.$transaction(async (tx) => {
    const updated = await tx.paymentRequest.update({
      where: { id: request.id },
      data: { status: newStatus, reviewedAt: new Date(), reviewedById: session.user.id },
      include: { reviewedBy: { select: { id: true, name: true, email: true } } },
    });

    if (newStatus === "APPROVED" && request.kind === "BUNDLE10" && request.toolSlugs) {
      const slugs: string[] = JSON.parse(request.toolSlugs);
      for (const toolSlug of slugs) {
        await tx.toolPurchase.upsert({
          where: { userId_toolSlug: { userId: request.userId, toolSlug } },
          create: { userId: request.userId, toolSlug, amount: request.amount / slugs.length },
          update: {},
        });
      }
    } else if (newStatus === "APPROVED" && request.kind === "TOOL" && request.toolSlugs) {
      const [toolSlug] = JSON.parse(request.toolSlugs) as string[];
      if (toolSlug) {
        await tx.toolPurchase.upsert({
          where: { userId_toolSlug: { userId: request.userId, toolSlug } },
          create: { userId: request.userId, toolSlug, amount: request.amount },
          update: {},
        });
      }
    } else if (newStatus === "APPROVED") {
      await tx.user.update({ where: { id: request.userId }, data: { plan: "PRO" } });
    }

    return updated;
  });

  return NextResponse.json({ ok: true, request: updatedRequest });
}
