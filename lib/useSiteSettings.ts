"use client";

import { useEffect, useState } from "react";

export type SiteSettingsPublic = {
  bundle10Price: number;
  bundle10Size: number;
  allAccessPrice: number;
  defaultFreeUseLimit: number;
  adsEnabled: boolean;
  adsterraBannerKey: string | null;
  adsterraBannerSrc: string | null;
  toolOverrides: Record<string, { price: number | null; useLimit: number | null; adsDisabled: boolean }>;
};

const FALLBACK: SiteSettingsPublic = {
  bundle10Price: 15,
  bundle10Size: 10,
  allAccessPrice: 70,
  defaultFreeUseLimit: 4,
  adsEnabled: false,
  adsterraBannerKey: null,
  adsterraBannerSrc: null,
  toolOverrides: {},
};

let cache: SiteSettingsPublic | null = null;
let inflight: Promise<SiteSettingsPublic> | null = null;

async function load(): Promise<SiteSettingsPublic> {
  if (cache) return cache;
  if (!inflight) {
    inflight = (async (): Promise<SiteSettingsPublic> => {
      try {
        const res = await fetch("/api/site-settings");
        if (!res.ok) return FALLBACK;
        const data = await res.json();
        cache = { ...FALLBACK, ...data };
        return cache as SiteSettingsPublic;
      } catch {
        return FALLBACK;
      }
    })();
  }
  return inflight;
}

/** Live site settings + per-tool overrides, fetched once and cached for the session. */
export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettingsPublic>(cache ?? FALLBACK);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    let cancelled = false;
    load().then((data) => {
      if (!cancelled) {
        setSettings(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const effectivePrice = (slug: string, fallback: number) => {
    const override = settings.toolOverrides[slug]?.price;
    return typeof override === "number" ? override : fallback;
  };

  const effectiveUseLimit = (slug: string) => {
    const override = settings.toolOverrides[slug]?.useLimit;
    return typeof override === "number" ? override : settings.defaultFreeUseLimit;
  };

  const adsDisabledFor = (slug: string) => Boolean(settings.toolOverrides[slug]?.adsDisabled);

  return { settings, loading, effectivePrice, effectiveUseLimit, adsDisabledFor };
}