import { NextResponse } from "next/server";
import { getSiteSettings, getToolOverrides } from "@/lib/siteSettings";

export async function GET() {
  const [settings, overrides] = await Promise.all([getSiteSettings(), getToolOverrides()]);
  return NextResponse.json({
    bundle10Price: settings.bundle10Price,
    bundle10Size: settings.bundle10Size,
    allAccessPrice: settings.allAccessPrice,
    defaultFreeUseLimit: settings.defaultFreeUseLimit,
    adsEnabled: settings.adsEnabled,
    adsterraBannerKey: settings.adsterraBannerKey,
    adsterraBannerSrc: settings.adsterraBannerSrc,
    toolOverrides: overrides,
  });
}
