import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let body: { name?: string; bio?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = (body.name || "").trim();
  if (!name) {
    return NextResponse.json({ error: "Name can't be empty." }, { status: 400 });
  }
  if (name.length > 60) {
    return NextResponse.json({ error: "Name is too long." }, { status: 400 });
  }

  const bio = typeof body.bio === "string" ? body.bio.trim().slice(0, 200) : undefined;

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: { name, ...(bio !== undefined ? { bio: bio || null } : {}) },
    select: { name: true, bio: true },
  });

  return NextResponse.json({ ok: true, name: updated.name, bio: updated.bio });
}
