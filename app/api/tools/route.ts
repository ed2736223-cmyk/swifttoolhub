import { NextResponse } from "next/server";
import { getMergedTools } from "@/lib/dynamicTools";

/**
 * Public, lightweight tool list for client components (e.g. the Navbar mega
 * menu) that can't call the database directly. Built-in + admin-added tools,
 * with any admin tier/price override already applied — the icon component
 * isn't serializable so it's left out; callers that need it should resolve
 * it locally by slug/category instead.
 */
export async function GET() {
  const tools = await getMergedTools();
  const data = tools.map((t) => ({
    slug: t.slug,
    name: t.name,
    category: t.category,
    tier: t.tier,
    price: t.price,
  }));
  return NextResponse.json({ tools: data });
}
