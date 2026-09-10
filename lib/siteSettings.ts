import { prisma } from "@/lib/prisma";
import {
  BUNDLE10_PRICE,
  BUNDLE10_SIZE,
  PRO_BUNDLE_PRICE,
  FREE_TOOL_USE_LIMIT,
} from "@/lib/pricing";

export type SiteSettingsData = {
  bundle10Price: number;
  bundle10Size: number;
  allAccessPrice: number;
  defaultFreeUseLimit: number;
  adsEnabled: boolean;
  adsterraBannerKey: string | null;
  adsterraBannerSrc: string | null;
  adsterraSitewideSrc: string | null;
};

export type ToolOverride = {
  tier: "free" | "pro" | null;
  price: number | null;
  useLimit: number | null;
  adsDisabled: boolean;
};

/** The one settings row, created on first read if it doesn't exist yet. */
export async function getSiteSettings(): Promise<SiteSettingsData> {
  const row = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      bundle10Price: BUNDLE10_PRICE,
      bundle10Size: BUNDLE10_SIZE,
      allAccessPrice: PRO_BUNDLE_PRICE,
      defaultFreeUseLimit: FREE_TOOL_USE_LIMIT,
    },
    update: {},
  });
  return row;
}

export async function updateSiteSettings(data: Partial<SiteSettingsData>) {
  return prisma.siteSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...data },
    update: data,
  });
}

/** Every per-tool override row, keyed by slug — small table, fine to load whole. */
export async function getToolOverrides(): Promise<Record<string, ToolOverride>> {
  const rows = await prisma.toolConfig.findMany();
  const map: Record<string, ToolOverride> = {};
  for (const row of rows) {
    map[row.slug] = {
      tier: row.tier === "pro" || row.tier === "free" ? row.tier : null,
      price: row.price,
      useLimit: row.useLimit,
      adsDisabled: row.adsDisabled,
    };
  }
  return map;
}

export async function upsertToolOverride(
  slug: string,
  data: { tier?: "free" | "pro" | null; price?: number | null; useLimit?: number | null; adsDisabled?: boolean }
) {
  return prisma.toolConfig.upsert({
    where: { slug },
    create: { slug, ...data },
    update: data,
  });
}

/** Effective tier for a tool: admin override, else the tool's own built-in/DB tier. */
export function effectiveTier(
  overrides: Record<string, ToolOverride>,
  slug: string,
  fallback: "free" | "pro"
): "free" | "pro" {
  const override = overrides[slug]?.tier;
  return override === "free" || override === "pro" ? override : fallback;
}

/** Effective price for a Pro tool: admin override, else the tool's own price, else fallback. */
export function effectivePrice(
  overrides: Record<string, ToolOverride>,
  slug: string,
  fallback: number
): number {
  const override = overrides[slug]?.price;
  return typeof override === "number" ? override : fallback;
}

/** Effective free-use limit for a tool: admin override, else the site default. -1 means unlimited. */
export function effectiveUseLimit(
  overrides: Record<string, ToolOverride>,
  slug: string,
  siteDefault: number
): number {
  const override = overrides[slug]?.useLimit;
  return typeof override === "number" ? override : siteDefault;
}

export function adsDisabledFor(overrides: Record<string, ToolOverride>, slug: string): boolean {
  return Boolean(overrides[slug]?.adsDisabled);
}
