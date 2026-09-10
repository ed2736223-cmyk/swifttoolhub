import { prisma } from "@/lib/prisma";
import { tools as staticTools, getTool as getStaticTool, getToolPrice, type Tool, type Tier } from "@/lib/tools";
import { resolveIcon } from "@/lib/iconMap";
import { getToolOverrides, type ToolOverride } from "@/lib/siteSettings";

export const TOOL_CATEGORIES = ["Convert", "Generate", "Check", "Develop"] as const;
export type ToolCategory = (typeof TOOL_CATEGORIES)[number];

export type DbToolRecord = {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  content: string;
  howTo: string | null;
  category: string;
  tier: string;
  price: number;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
};

function toTool(row: DbToolRecord): Tool {
  return {
    slug: row.slug,
    name: row.name,
    shortDesc: row.shortDesc,
    category: (TOOL_CATEGORIES as readonly string[]).includes(row.category)
      ? (row.category as ToolCategory)
      : "Convert",
    icon: resolveIcon(row.icon),
    tier: row.tier === "pro" ? "pro" : "free",
    price: row.price,
    dynamic: true,
  };
}

/**
 * Bakes an admin's ToolConfig override (set from /admin/tool-pricing) into a
 * tool — this is what lets an admin flip ANY tool (built-in or admin-added)
 * between free and pro from the backend, no code change needed. Every
 * reader of `getMergedTools`/`getAnyTool` below automatically sees the
 * effective tier and price, so the tool page gate, the Any-10 bundle
 * picker, the checkout/payment amount, and the listings never fall out of
 * sync with each other.
 *
 * tier and price are applied independently: an admin can override just the
 * price (leave tier untouched) or just the tier (price falls back to the
 * tool's own price / the flat default) or both together.
 */
function applyOverride(tool: Tool, overrides: Record<string, ToolOverride>): Tool {
  const override = overrides[tool.slug];
  if (!override) return tool;
  const tier: Tier = override.tier === "free" || override.tier === "pro" ? override.tier : tool.tier;
  const price =
    tier === "pro"
      ? typeof override.price === "number"
        ? override.price
        : getToolPrice({ tier, price: tool.price })
      : undefined;
  if (tier === tool.tier && price === tool.price) return tool;
  return { ...tool, tier, price };
}


/** Raw DB rows, admin-panel shape (used by the manage-tools UI). */
export async function listDbTools(): Promise<DbToolRecord[]> {
  return prisma.tool.findMany({ orderBy: { createdAt: "desc" } });
}

/** DB tools mapped into the same shape as the built-in `tools` array. */
export async function getDynamicTools(): Promise<Tool[]> {
  const [rows, overrides] = await Promise.all([
    prisma.tool.findMany({ orderBy: { createdAt: "desc" } }),
    getToolOverrides(),
  ]);
  return rows.map((r) => applyOverride(toTool(r), overrides));
}

/** Built-in + admin-added tools, ready to render in listings/dashboards. */
export async function getMergedTools(): Promise<Tool[]> {
  const overrides = await getToolOverrides();
  const built = staticTools.map((t) => applyOverride(t, overrides));
  const rows = await prisma.tool.findMany({ orderBy: { createdAt: "desc" } });
  const dynamic = rows.map((r) => applyOverride(toTool(r), overrides));
  return [...built, ...dynamic];
}

/**
 * Look up any tool by slug — checks the built-in list first (so a static
 * page always wins if a slug collides), then falls back to the DB. Either
 * way, an admin's tier/price override for this slug is applied.
 */
export async function getAnyTool(slug: string): Promise<Tool | null> {
  const overrides = await getToolOverrides();
  const built = getStaticTool(slug);
  if (built) return applyOverride(built, overrides);
  const row = await prisma.tool.findUnique({ where: { slug } });
  return row ? applyOverride(toTool(row), overrides) : null;
}

/** Full DB record for the dynamic tool page (needs `content`/`howTo` too). */
export async function getDbToolBySlug(slug: string): Promise<DbToolRecord | null> {
  return prisma.tool.findUnique({ where: { slug } });
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isValidCategory(value: string): value is ToolCategory {
  return (TOOL_CATEGORIES as readonly string[]).includes(value);
}

export function isValidTier(value: string): value is Tier {
  return value === "free" || value === "pro";
}
