// Set NEXT_PUBLIC_SITE_URL in your host's environment variables once you
// have a real domain/subdomain (e.g. "https://tools.yourdomain.com") — this
// is the one place metadata, canonical tags and the sitemap read it from.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://swifttoolhub.com").replace(/\/$/, "");
