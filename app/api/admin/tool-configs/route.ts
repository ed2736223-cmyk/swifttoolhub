import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getMergedTools } from "@/lib/dynamicTools";
import { getSiteSettings, getToolOverrides, upsertToolOverride } from "@/lib/siteSettings";
import { getToolPrice } from "@/lib/tools";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: NextResponse.json({ error: "Not signed in." }, { status: 401 }) };
  if (session.user.role !== "ADMIN") return { error: NextResponse.json({ error: "Admins only." }, { status: 403 }) };
  return { session };
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const [tools, settings, overrides] = await Promise.all([
    getMergedTools(),
    getSiteSettings(),
    getToolOverrides(),
  ]);

  const rows = tools.map((t) => {
    const override = overrides[t.slug];
    return {
      slug: t.slug,
      name: t.name,
      tier: t.tier, // effective tier — admin override already applied by getMergedTools
      tierOverride: override?.tier ?? null,
      dynamic: Boolean(t.dynamic),
      basePrice: t.tier === "pro" ? getToolPrice(t) : null,
      priceOverride: override?.price ?? null,
      useLimitOverride: override?.useLimit ?? null,
      defaultUseLimit: settings.defaultFreeUseLimit,
      adsDisabled: override?.adsDisabled ?? false,
    };
  });

  return NextResponse.json({ tools: rows });
}

export async function PATCH(req: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  let body: {
    slug?: string;
    tier?: "free" | "pro" | null;
    price?: number | null;
    useLimit?: number | null;
    adsDisabled?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const slug = body.slug?.trim();
  if (!slug) {
    return NextResponse.json({ error: "Missing tool slug." }, { status: 400 });
  }

  const data: { tier?: "free" | "pro" | null; price?: number | null; useLimit?: number | null; adsDisabled?: boolean } = {};

  if (body.tier !== undefined) {
    if (body.tier !== null && body.tier !== "free" && body.tier !== "pro") {
      return NextResponse.json({ error: "tier must be 'free', 'pro', or null." }, { status: 400 });
    }
    data.tier = body.tier;
  }

  if (body.price !== undefined) {
    if (body.price !== null && (!Number.isFinite(body.price) || body.price <= 0)) {
      return NextResponse.json({ error: "Price must be a positive number, or null to clear the override." }, { status: 400 });
    }
    data.price = body.price;
  }

  if (body.useLimit !== undefined) {
    if (body.useLimit !== null && (!Number.isInteger(body.useLimit) || body.useLimit < -1)) {
      return NextResponse.json(
        { error: "Use limit must be -1 (unlimited), a whole number, or null to clear the override." },
        { status: 400 }
      );
    }
    data.useLimit = body.useLimit;
  }

  if (typeof body.adsDisabled === "boolean") {
    data.adsDisabled = body.adsDisabled;
  }

  const updated = await upsertToolOverride(slug, data);
  return NextResponse.json({ ok: true, config: updated });
}
