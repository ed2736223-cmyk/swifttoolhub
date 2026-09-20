# SwiftToolHub — Complete Next.js Site (with Auth + Backend)

Full IT-tools website built with Next.js 14 (App Router) + TypeScript +
Tailwind CSS, plus a real authentication backend (NextAuth + Prisma +
SQLite). Same design language as the original reference — content is real,
not placeholder.

## 1. Setup

Requires Node.js 18+.

```bash
npm install
cp .env.example .env
```

Open `.env` and set `NEXTAUTH_SECRET` to a random string:
```bash
openssl rand -base64 32
```
(paste the output as the value). `DATABASE_URL` is already set to a local
SQLite file — no external database needed.

Then create the database:
```bash
npm run db:migrate
```

Run it:
```bash
npm run dev
```

Open http://localhost:3000

## 2. What's included

**Homepage** — Hero (with a Pro-tool teaser + "Create free account" nudge),
Problems, Solutions, Features, How It Works, Tools preview, Pricing,
Testimonials, Security, FAQ, CTA, Footer.

**25 fully working tools** at `/tools/<slug>` — 19 free, 6 Pro (see
`lib/tools.ts` for the full list and each tool's `tier`). Every tool runs
client-side — nothing is uploaded to a server except where a tool page says
otherwise.

**Accounts & access control:**
- `/signup`, `/login` — real accounts (NextAuth credentials + Prisma +
  bcrypt password hashing)
- `/dashboard` — user portal: plan status, Pro tools list, upgrade CTA,
  premium integrations showcase
- **Anonymous usage limit**: every free tool allows 4 uses (tracked in the
  visitor's browser via `localStorage`), then a signup/login prompt blocks
  further use — see `components/ToolAccessGate.tsx`
- **Pro tools**: locked behind a blurred overlay for anyone not on the Pro
  plan, logged in or not — see the same file
- **Sidebar upgrade banner** on every tool page — different message for
  anonymous / free / Pro visitors — `components/UpgradeBanner.tsx`
- **"Upgrade to Pro" button** — links to `/upgrade`, where the user sends
  payment and uploads a screenshot for an admin to approve (see the
  payments section below for how the review flow works)

**Premium integrations showcase** (`components/PremiumIntegrations.tsx`) —
Semrush / Canva / Grammarly "Connect Account" cards for the dashboard. On
click, they explain that a real OAuth connection would happen in
production. Deliberately **does not** show a fake password-entry form for
these brands — that pattern looks like phishing and risks trademark
issues, so it's left as a safe "Connect Account" placeholder for you to
wire up to each service's real OAuth flow.

**AdSense-ready pages:** `/tools`, `/about`, `/contact`, `/blog` (+ 3
articles), `/privacy-policy`, `/terms-of-service`, `/sitemap.xml`, `ads.txt`.

## 3. How Pro upgrades work (manual screenshot approval)

There's no payment gateway wired in — instead, upgrading to Pro is a
manual review flow:

1. A signed-in user goes to `/upgrade`, sends payment via one of the
   methods shown (JazzCash/EasyPaisa/bank — edit the placeholders in
   `app/upgrade/page.tsx`), and uploads a screenshot of the confirmation.
2. That creates a `PaymentRequest` row with `status = "PENDING"`
   (`app/api/payment-request/route.ts`). **Nothing is upgraded yet.**
3. An admin opens `/admin` (a standalone sidebar dashboard — separate from
   the public site nav), sees the screenshot under **Payment Requests**,
   and clicks Approve or Reject
   (`app/api/admin/payment-requests/[id]/route.ts`). Approving is
   the *only* code path that ever sets a user's `plan` to `"PRO"`. Every
   decision records which admin made it and when (`reviewedBy`/
   `reviewedAt`), shown right on the card.
4. The user's dashboard/upgrade page automatically shows "Payment under
   review" while pending, and unlocks Pro tools the moment it's approved.

**The admin dashboard (`/admin`)** has its own dark sidebar layout with
four sections:
- **Overview** (`/admin`) — stat cards (tools/users/runs/Pro users),
  a merged recent-activity feed (signups + payment submissions), quick
  actions, and a system alerts panel for pending reviews.
- **Payment Requests** (`/admin/payments`) — the approve/reject queue
  described above, with a search bar and full-screenshot lightbox.
- **Users** (`/admin/users`) — every account with its plan and role;
  flip a user's plan or promote/demote `ADMIN` directly. An admin can
  never remove their own admin access from here, to avoid locking every
  admin out.
- **Tool Usage** (`/admin/tools`) — real per-tool usage counts pulled
  from the `ToolUsage` table (runs + unique users per tool).

**To make yourself an admin:** there's no seed script — after signing up,
open Prisma Studio (`npm run db:studio`) and set your user's `role`
column to `ADMIN`, or run:

```sql
UPDATE User SET role = 'ADMIN' WHERE email = 'you@example.com';
```

**No SSH/terminal access on your host (e.g. Hostinger shared Node.js
hosting)?** Use `/api/admin-setup` instead:

1. Set `ADMIN_SETUP_SECRET` to any random string in your host's environment
   variables and redeploy.
2. Sign up a normal account at `/signup`.
3. Call the route once (from your own computer's terminal, or any
   REST-client app):
   ```bash
   curl -X POST https://yoursite.com/api/admin-setup \
     -H "Content-Type: application/json" \
     -d '{"email":"you@example.com","secret":"THE_ADMIN_SETUP_SECRET_YOU_SET"}'
   ```
4. Log out and back in, then open `/admin`.

This route refuses to run if `ADMIN_SETUP_SECRET` isn't set, and refuses
again once any admin already exists — so it can't be used a second time by
anyone who finds the secret later.

**Note on screenshot storage:** screenshots are stored as base64 data
directly in the `PaymentRequest.screenshot` column — fine for SQLite/dev
and small volume. Before scaling up, swap this for uploading to S3/
Cloudinary and storing just the URL instead.

If you'd rather take real card payments than review screenshots, swap
`/upgrade` and `app/api/payment-request/route.ts` for a Stripe Checkout
Session + a `/api/stripe/webhook` route that sets `plan = "PRO"` on
`checkout.session.completed` — never trust the client to confirm its own
payment.

## 4. Project structure

```
app/
  layout.tsx              → fonts, metadata, AdSense script, AuthProvider
  page.tsx                 → homepage
  sitemap.ts               → auto-generated sitemap
  login/, signup/           → auth pages
  dashboard/                → user portal (protected by middleware.ts)
  upgrade/page.tsx            → payment instructions + screenshot upload
  admin/layout.tsx              → admin-only sidebar dashboard shell (role check + nav)
  admin/page.tsx                 → Overview: stat cards, activity feed, quick actions, alerts
  admin/payments/page.tsx          → payment request review queue
  admin/users/page.tsx              → manage every user's plan + role
  admin/tools/page.tsx                → real per-tool usage stats
  tools/page.tsx             → tools index
  tools/<slug>/page.tsx       → one folder per tool (25 total)
  blog/, about/, contact/, privacy-policy/, terms-of-service/
  api/auth/[...nextauth]/      → NextAuth handler
  api/auth/signup/              → registration endpoint
  api/payment-request/           → user submits/checks a Pro payment screenshot
  api/admin/payment-requests/     → admin lists + approves/rejects requests
  api/admin/users/                 → admin lists + edits any user's plan/role
components/
  Navbar.tsx (auth-aware, shows an Admin badge + link) — Hero.tsx, ... → homepage sections
  ToolShell.tsx              → shared layout wrapper for every tool page
  ToolAccessGate.tsx          → usage-limit + Pro-tier gating logic
  UpgradeBanner.tsx, UpgradeButton.tsx → link into /upgrade
  PaymentUpload.tsx             → screenshot upload + status widget
  admin/AdminSidebar.tsx, admin/AdminTopbar.tsx → dark sidebar dashboard shell
  admin/AdminPaymentRequests.tsx  → tabbed approve/reject table + audit trail
  admin/UsersTable.tsx             → searchable plan/role editor
  PremiumIntegrations.tsx      → Semrush/Canva/Grammarly showcase
  auth/LoginForm.tsx, auth/SignupForm.tsx
  tools/*.tsx                   → the 25 interactive tool components
lib/
  tools.ts    → tool registry (name, slug, tier, category, icon)
  blog.ts     → blog post content
  auth.ts     → NextAuth config (now carries `role` too)
  prisma.ts   → Prisma client singleton
  usePaymentStatus.ts → client hook: current plan + latest payment request
prisma/
  schema.prisma → User (+ role), ToolUsage, PaymentRequest (+ reviewedBy) models (SQLite)
middleware.ts   → protects /dashboard (any signed-in user) and /admin (ADMIN role only)
```

## 5. Add a 26th tool

1. Add an entry to `lib/tools.ts` (slug, name, description, category, icon,
   `tier: "free" | "pro"`).
2. Build the interactive part in `components/tools/YourTool.tsx`.
3. Create `app/tools/your-slug/page.tsx` — copy an existing one (e.g.
   `app/tools/word-counter/page.tsx`).

It appears automatically in the nav, homepage preview, `/tools` index,
sitemap, and gets usage-limit/Pro gating for free — no extra wiring.

## 6. AdSense setup (after Google approves the site)

1. In `app/layout.tsx`, set `ADSENSE_ENABLED = true` and replace
   `ca-pub-XXXXXXXXXXXXXXXX` with your real publisher id.
2. Do the same in `components/AdSlot.tsx` (`data-ad-client`).
3. Replace `pub-0000000000000000` in `public/ads.txt` with your publisher
   id.
4. Create ad units in AdSense and pass slot ids: `<AdSlot slotId="..." />`.

## 7. Deploy (Vercel, free)

The database is Postgres by default now (`prisma/schema.prisma`), so it
works on serverless hosts like Vercel out of the box — no persistent disk
needed.

1. **Free Postgres database** — create one at [neon.tech](https://neon.tech)
   (or Supabase). Copy its connection string.
2. **Create the tables** — on your own computer, put that connection string
   into `.env` as `DATABASE_URL`, then run:
   ```bash
   npx prisma db push
   ```
   This creates every table (User, Page, PaymentRequest, ToolPurchase, etc.)
   in the cloud database, once.
3. **Push this project to GitHub** (a plain repo — Vercel deploys straight
   from Git, not from a zip).
4. **Import the repo in Vercel** → Add New Project → pick the repo.
5. **Environment variables** (Vercel → Project → Settings → Environment
   Variables) — set all of these:
   - `DATABASE_URL` — same Neon/Supabase connection string as step 2
   - `NEXTAUTH_SECRET` — random string, e.g. from `openssl rand -base64 32`
   - `NEXTAUTH_URL` — your Vercel URL, e.g. `https://your-app.vercel.app`
   - `ADMIN_SETUP_SECRET` — random string, used once to promote your first
     admin (see section 3)
6. **Deploy.** Vercel runs `npm run build` (which runs `prisma generate`
   automatically via `postinstall`) and gives you a free `*.vercel.app`
   domain immediately. A custom domain can be attached later from Project →
   Settings → Domains, free of charge on Vercel's side (you only pay your
   domain registrar).

Any other Next.js host (Railway, Render, a VPS, Hostinger) works the same
way with this Postgres setup too — nothing above is Vercel-specific except
step 4.

## Notes

- Colors live in `tailwind.config.ts` under `brand`, `ink`, `heading`,
  `warn`, `band`.
- `jspdf`, `qrcode` — used by two tools. `next-auth`, `@prisma/client`,
  `bcryptjs` — the auth backend. Everything else is zero-dependency
  browser JS.
- I could not run `npm install` or a build in the environment that wrote
  this code (no network access), so please run a build locally and open an
  issue in your own tracking if anything doesn't compile — the code was
  written and syntax-checked carefully, but wasn't executed end-to-end
  before delivery.
