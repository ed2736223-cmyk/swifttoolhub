import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Lets you become the first ADMIN without SSH/terminal or Prisma Studio
// access — handy on shared hosting like Hostinger's Node.js apps.
//
// Usage (once, right after you sign up a normal account):
//   curl -X POST https://yoursite.com/api/admin-setup \
//     -H "Content-Type: application/json" \
//     -d '{"email":"you@example.com","secret":"THE_ADMIN_SETUP_SECRET_FROM_.env"}'
//
// Safety:
// - Requires ADMIN_SETUP_SECRET to be set in the environment — if it's
//   missing, this route always refuses, so it's inert until you opt in.
// - Refuses once an ADMIN already exists, so it can't be reused by anyone
//   who later finds the secret in old logs/history.
// - After you've promoted your account, delete ADMIN_SETUP_SECRET from
//   your environment (or leave it — the "no admin yet" check keeps it safe).
export async function POST(req: Request) {
  const configuredSecret = process.env.ADMIN_SETUP_SECRET;
  if (!configuredSecret) {
    return NextResponse.json(
      { error: "ADMIN_SETUP_SECRET is not set on the server." },
      { status: 400 }
    );
  }

  let body: { email?: string; secret?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (body.secret !== configuredSecret) {
    return NextResponse.json({ error: "Invalid secret." }, { status: 401 });
  }

  const existingAdmin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (existingAdmin) {
    return NextResponse.json(
      { error: "An admin already exists — use /admin/users to promote anyone else from there instead." },
      { status: 409 }
    );
  }

  const email = body.email?.trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "email is required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json(
      { error: `No account found for ${email} — sign up first at /signup.` },
      { status: 404 }
    );
  }

  await prisma.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });

  return NextResponse.json({ ok: true, message: `${email} is now an ADMIN. Log in again and open /admin.` });
}
