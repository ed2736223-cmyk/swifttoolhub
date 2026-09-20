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

  let body: { plan?: string; role?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id: params.id } });
  if (!target) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const data: { plan?: string; role?: string } = {};

  if (body.plan) {
    if (!["FREE", "PRO"].includes(body.plan)) {
      return NextResponse.json({ error: "plan must be FREE or PRO." }, { status: 400 });
    }
    data.plan = body.plan;
  }

  if (body.role) {
    if (!["USER", "ADMIN"].includes(body.role)) {
      return NextResponse.json({ error: "role must be USER or ADMIN." }, { status: 400 });
    }
    // Guard rail: an admin can never remove their own admin access this way —
    // avoids accidentally locking every admin out of the panel.
    if (target.id === session.user.id && body.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You can't remove your own admin access." },
        { status: 400 }
      );
    }
    data.role = body.role;
  }

  const updated = await prisma.user.update({
    where: { id: params.id },
    data,
    select: { id: true, name: true, email: true, plan: true, role: true },
  });

  return NextResponse.json({ ok: true, user: updated });
}
