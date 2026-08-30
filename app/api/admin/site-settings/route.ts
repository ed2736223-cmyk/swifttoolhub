import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSiteSettings, updateSiteSettings } from "@/lib/siteSettings";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: NextResponse.json({ error: "Not signed in." }, { status: 401 }) };
  if (session.user.role !== "ADMIN") return { error: NextResponse.json({ error: "Admins only." }, { status: 403 }) };
  return { session };
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(req: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data: Record<string, number | boolean | string | null> = {};

  for (const key of ["bundle10Price", "allAccessPrice"] as const) {
    if (body[key] !== undefined) {
      const n = Number(body[key]);
      if (!Number.isFinite(n) || n <= 0) {
        return NextResponse.json({ error: `${key} must be a positive number.` }, { status: 400 });
      }
      data[key] = n;
    }
  }

  if (body.bundle10Size !== undefined) {
    const n = Number(body.bundle10Size);
    if (!Number.isInteger(n) || n <= 0) {
      return NextResponse.json({ error: "bundle10Size must be a positive whole number." }, { status: 400 });
    }
    data.bundle10Size = n;
  }

  if (body.defaultFreeUseLimit !== undefined) {
    const n = Number(body.defaultFreeUseLimit);
    if (!Number.isInteger(n) || n < -1) {
      return NextResponse.json({ error: "defaultFreeUseLimit must be -1 (unlimited) or a whole number." }, { status: 400 });
    }
    data.defaultFreeUseLimit = n;
  }

  if (typeof body.adsEnabled === "boolean") {
    data.adsEnabled = body.adsEnabled;
  }

  for (const key of ["adsterraBannerKey", "adsterraBannerSrc", "adsterraSitewideSrc"] as const) {
    if (body[key] !== undefined) {
      data[key] = typeof body[key] === "string" && body[key] ? (body[key] as string) : null;
    }
  }

  const updated = await updateSiteSettings(data);
  return NextResponse.json({ settings: updated });
}
