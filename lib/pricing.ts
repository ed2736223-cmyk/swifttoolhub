// Central place for every price/limit shown on the site, so the navbar,
// dashboard, tool pages and payment flow never drift out of sync.
//
// There are exactly 3 plans:
//   1. Free       — free tools, each capped at FREE_TOOL_USE_LIMIT uses, ads shown.
//   2. Bundle-10   — $15, one-time. Pick any BUNDLE10_SIZE paid tools of your
//                    choice; those tools become unlimited-use and ad-free.
//   3. All-Access  — $70, one-time. Every tool (current and future,
//                    including free ones) becomes unlimited-use and
//                    completely ad-free.

export const FREE_TOOL_USE_LIMIT = 4;

export const BUNDLE10_SIZE = 10;
export const BUNDLE10_PRICE = 15;
export const BUNDLE10_NAME = "Any 10 Tools Bundle";

export const PRO_BUNDLE_PRICE = 70;
export const PRO_BUNDLE_NAME = "All-Access — Unlimited";

// Reference price used only for messaging ("worth $X individually") — there
// is no standalone single-tool purchase anymore, only the two bundles above.
export const REFERENCE_TOOL_PRICE = 5;

export function formatPrice(amount: number): string {
  return `$${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
}
