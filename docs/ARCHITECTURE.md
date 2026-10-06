# Architecture

> ARCHITECTURE = HOW the app works. What and why are in `PRD.md`; the reasons behind each choice are in `DECISIONS.md`.

## Stack
| Layer | Choice |
|---|---|
| Frontend | Next.js 16 App Router (version ≥ 16.3.8) + React |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui, themed by a shadcn preset (tokens and fonts in `DESIGN.md`) |
| Backend | Next.js Server Components, Server Actions and Route Handlers |
| Database | Supabase PostgreSQL with Row Level Security and Postgres functions |
| Customer auth | Clerk, connected to Supabase as a third-party auth provider |
| Admin auth | Supabase Auth: email + password + TOTP 2FA, invite only |
| Payments | Stripe Checkout hosted page, AED |
| Email | Resend + React Email |
| Media | Cloudinary behind `src/services/media` (to be replaced later) |
| PDFs | English/Arabic invoices and credit notes (engine picked in TASK-062) |
| Forms and validation | React Hook Form + Zod |
| Client state | Zustand (cart only) |
| Blog editor | Tiptap |
| Testing | Vitest, Playwright, pgTAP |
| Analytics | GA4 + GTM (per Pranav's SOP "GA4 + GTM Ecommerce Analytics Setup (Next.js Client Stores)"), PostHog |
| Monitoring | Sentry: errors, tracing, logs, one cron monitor and one uptime monitor (free Developer plan) |
| Deployment | Vercel Pro |

## How It Works
```text
User (shopper or admin)
↓
Next.js UI (Server Components; client components only where needed)
↓
Server Action / Route Handler (check auth → validate with Zod)
↓
Service (src/services/*)
↓
Supabase (Postgres functions + RLS)
↓
PostgreSQL
```

```text
Next.js     → Stripe       create Checkout Sessions and refunds
Stripe      → Next.js      webhooks: payment, expiry, refunds, disputes
Clerk       → Next.js      webhooks: user created, updated, deleted
Next.js     → Resend       order, return and refund emails
Next.js     → Cloudinary   signed uploads, image delivery, private links
Next.js     → Sentry       errors, traces, logs, cron check-ins
Sentry      → Next.js      uptime check on /api/health
Vercel Cron → Next.js      reconcile checkouts, expire returns, purge photos
```

## Folder Structure
```text
src/
├── app/
│   ├── (store)/                 # storefront: own root layout with ClerkProvider
│   │   ├── page.tsx             # home
│   │   ├── shop/                # Shop all + [category]
│   │   ├── products/[slug]/
│   │   ├── cart/
│   │   ├── checkout/            # success, cancelled
│   │   ├── account/             # orders, returns (Clerk session required)
│   │   ├── blog/
│   │   ├── policies/[slug]/
│   │   ├── sign-in/[[...sign-in]]/
│   │   └── sign-up/[[...sign-up]]/
│   ├── (admin)/admin/           # admin: own root layout, no Clerk
│   │   ├── login/
│   │   ├── mfa/
│   │   └── (protected)/         # everything else, needs an aal2 admin session
│   ├── api/
│   │   ├── webhooks/            # stripe, clerk
│   │   ├── cron/                # reconcile-checkouts, expire-returns, purge-return-photos
│   │   ├── health/              # uptime check for Sentry
│   │   ├── invoices/[orderId]/
│   │   └── credit-notes/[id]/
│   ├── global-error.tsx         # reports render errors to Sentry
│   └── globals.css              # shadcn theme tokens (owned by the shadcn CLI)
├── components/
│   ├── ui/                      # shadcn/ui primitives (never hand-edited)
│   ├── store/                   # shared storefront components
│   └── admin/                   # shared admin components
├── features/                    # one folder per domain
│   ├── catalog/                 # products, colours, sizes, SKUs, photos, stock
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   ├── returns/
│   ├── refunds/
│   ├── content/                 # banners, blog, pages
│   ├── dashboard/
│   ├── settings/
│   └── staff/
├── services/                    # server only: data access + integrations
│   ├── db/                      # Supabase queries and RPC calls, one file per domain
│   ├── stripe/
│   ├── email/                   # Resend client + React Email templates
│   ├── media/                   # media adapter (Cloudinary today)
│   ├── pdf/                     # invoices, credit notes
│   └── analytics/
├── lib/
│   ├── supabase/                # public, customer, admin, browser and service clients
│   ├── auth/                    # requireCustomer(), requireAdmin()
│   ├── env.ts                   # validated environment variables
│   ├── fonts.ts                 # next/font: --font-sans and --font-heading
│   ├── money.ts                 # fils, formatAED(), VAT split
│   └── sku.ts                   # SKU suggestion and validation
├── styles/
│   └── brand.css                # our extra tokens (success, warning); presets never touch it
├── types/                       # shared types + generated database types
├── utils/
├── instrumentation.ts           # loads the Sentry server and edge config; exports onRequestError
├── instrumentation-client.ts    # Sentry in the browser
├── sentry.server.config.ts
├── sentry.edge.config.ts
└── proxy.ts                     # Clerk on storefront routes, Supabase session on /admin
supabase/
├── migrations/
├── tests/                       # RLS and function tests (pgTAP)
└── seed.sql
tests/
├── unit/
├── integration/
└── e2e/
```

Each domain folder follows the same shape:
```text
features/<domain>/
├── components/     # domain UI
├── actions.ts      # Server Actions: auth → Zod → service
├── schemas.ts      # Zod schemas shared by forms and actions
└── types.ts
```

## Architectural Rules
- UI components never call Supabase, Stripe, Resend or Cloudinary directly.
- Database and third-party calls live in `src/services/*`, marked `import 'server-only'`.
- Every Server Action and Route Handler: check auth → validate input with Zod → call a service → return a typed result.
- Orders, stock, returns and refunds change only through Postgres functions that check the current state inside one transaction.
- Stock is per SKU. Cart lines, holds, order lines, returns and stock changes always point at a SKU (`product_variants.id`).
- Photos belong to a product colour, never to a size or directly to a product.
- Business logic stays out of components.
- Reusable UI goes in `components/`; domain UI goes in `features/<domain>/components/`.
- Server Components by default; add `"use client"` only for interaction.
- Components use theme tokens only (see `DESIGN.md`). No hard-coded colours or fonts.
- Money is integer fils everywhere; format it only in the UI with `formatAED()`.
- All media goes through the media adapter; store keys, never URLs.
- Never trust the browser for prices, totals, stock or return eligibility.
- Unexpected errors go to Sentry. Expected ones (validation, sold out, not allowed) go back to the UI as typed results.

## Supabase Clients
| Client | Key | Session | Use for |
|---|---|---|---|
| `createPublicClient()` | publishable | none | Cached catalogue, banner and blog reads (`'use cache'` can't read cookies), and live availability through `variant_availability()` |
| `createCustomerClient()` | publishable | Clerk token | Customer orders, invoices and returns |
| `createAdminClient()` | publishable | Supabase auth cookies | Admin pages and actions |
| `createBrowserClient()` | publishable | Supabase auth cookies | Admin login and 2FA screens only |
| `createServiceClient()` | secret (bypasses RLS) | none | Webhooks, cron jobs and PDFs only |

## Authentication

### Customers (Clerk)
- Turn on Clerk's Supabase integration and add Clerk as a third-party auth provider in Supabase.
- `createCustomerClient()` passes the Clerk session token: `accessToken: async () => (await auth()).getToken()`.
- RLS reads the Clerk user ID from `auth.jwt()->>'sub'`. Clerk IDs look like `user_2abc...`, so customer ID columns are `text`.
- Clerk webhooks keep `customers` in sync and link guest orders by verified email.

### Admins (Supabase Auth)
- Email + password. Public sign-ups are disabled; staff are invited.
- TOTP (authenticator app) is required. Admin access needs an `aal2` session.
- A Custom Access Token Hook adds `user_role: 'admin'` for active rows in `admin_users`.
- Supabase Auth emails go through Resend SMTP (the built-in sender only allows 2 emails an hour, and only to your own team).

### proxy.ts
- Storefront routes run `clerkMiddleware()`.
- `/admin/*` refreshes the Supabase session, sends users with no session to `/admin/login` and users without 2FA to `/admin/mfa`.
- The matcher excludes `_next/static`, `_next/image`, static files and the Sentry tunnel (`/sentry-tunnel`), so error reports are never redirected.
- The proxy only routes. Every Server Action and Route Handler checks auth again: `requireCustomer()` (Clerk `auth()`) or `requireAdmin()` (`supabase.auth.getClaims()` + `aal2` + active admin).

## Database Access (RLS)
1. RLS is on for every table, deny by default.
2. **Never use `auth.uid()` in a policy.** Policies are OR'd together, so admin policies also run on Clerk requests, and `auth.uid()` throws on non-UUID Clerk IDs. Compare `auth.jwt()->>'sub'` as text.
3. `is_admin()` (SQL, `security definer`, fixed `search_path`): the issuer is our Supabase project, `user_role = 'admin'`, `aal = 'aal2'`, and an active `admin_users` row matches `sub` (text compare). The expected issuer is stored per environment in a private config table.
4. Browsers never write to tables directly; writes go through Server Actions.
5. The secret (service-role) key is used only by webhooks, cron jobs and PDF generation.
6. Visitors and customers never read stock counts. `variant_availability(product_ids)` (`security definer`, fixed `search_path`) returns only a status per SKU: `in_stock`, `low` (with the number left when it's 3 or fewer) or `sold_out` (ADR-026).

| Data | Visitor | Customer | Admin | Server only |
|---|---|---|---|---|
| Active categories, colours and sizes; published products with their visible colours, photos and active SKUs; banners; posts | Read | Read | Full | |
| Stock levels | | | Read; change via functions | Holds and sales via functions |
| Orders, order items, returns | | Read own | Read; update via functions | Create, mark paid |
| Stock ledger, audit log, Stripe events, email log, job runs | | | Read | Write |
| Settings | | | Read, write | Read (checkout, emails) |
| Admin users | | | Read | Write (invites) |

## Data Model
Money columns are integer fils (1 AED = 100 fils).

| Table | Key columns |
|---|---|
| `customers` | `clerk_user_id` (text, PK), email, first and last name, phone, `deleted_at` |
| `admin_users` | `user_id` (uuid, from `auth.users`), email, role, `is_active`, `invited_by` |
| `categories` | name, slug (unique), description, `image_key` (the Shop by category photo), sort, `is_active`, SEO title and description |
| `colours` | Store-wide list: name (unique), slug (unique, for `?colour=` links), `code` (unique, 2 to 4 capital letters used in SKUs, e.g. `BLK`), `swatch_hex`, sort, `is_active` |
| `sizes` | Store-wide list: label (unique, e.g. `S`, `One Size`, `54`), `code` (unique, used in SKUs, e.g. `S`, `OS`, `54`), sort (display order: XS before S before M), `is_active` |
| `products` | slug, name, description, `style_code` (unique, generated as ST0001, ST0002 and so on; the SKU prefix), **`category_id`** (FK to `categories`, nullable until the client confirms the list), `price_fils`, `compare_at_fils`, `is_final_sale`, status (draft, published, archived), SEO fields, `published_at` |
| `product_colours` | One colour of one product: `product_id`, `colour_id`, sort (the first visible colour is the default), `is_active` (visible on the storefront); unique (product, colour) |
| `product_images` | Photos of one product colour: `product_colour_id`, `media_key`, alt, sort (first = main photo), width, height. Every size of that colour uses them |
| `product_variants` | One row per SKU (one colour in one size): `product_id`, `product_colour_id`, `size_id`, `sku` (unique, stored in capitals), `price_override_fils`, `is_active`, `first_sold_at` (the SKU locks once set); unique (product colour, size); composite FK (`product_colour_id`, `product_id`) → `product_colours (id, product_id)`, so a SKU can't point at another product's colour |
| `stock_levels` | One row per SKU: `variant_id` (PK), `on_hand`, `reserved`, `updated_at`; checks: on hand ≥ 0, reserved ≥ 0, reserved ≤ on hand. No visitor or customer access |
| `stock_reservations` | `order_id`, `variant_id`, qty, status (active, consumed, released), `expires_at` |
| `inventory_adjustments` | Stock ledger: `variant_id`, delta, reason (opening stock, restock, correction, return restock, offline sale, damaged, sale), note, `order_id` or `return_id`, actor, `created_at` (system sales included) |
| `orders` | `order_number` (AR-10001), `clerk_user_id` (null for guests), email, name, phone, delivery address, status, `payment_status`, subtotal, discount, delivery, VAT and total, VAT rate, Stripe session and PaymentIntent IDs, `cart_id`, `hold_expires_at`, `paid_at`, `packed_at`, `delivered_at`, `needs_attention`, internal notes |
| `order_items` | Snapshot: product, product colour and variant IDs, product name, colour name, size label, SKU, image key (the colour's main photo), unit price, qty, discount, VAT, line total, `is_final_sale` |
| `order_events` | order, type, from and to status, actor, data |
| `invoices` | order, `invoice_number` (gapless), `issued_at` |
| `refunds` | order, return, amount, reason, Stripe refund ID, status (pending, succeeded, failed), failure reason, admin |
| `credit_notes` | refund, `credit_note_number` (gapless), amount, VAT, `issued_at` |
| `return_requests` | `return_number` (RET-1001), order, customer, status, comment, admin instructions, rejection or close reason, timestamps, `photos_purge_after` |
| `return_items` | return, order item, qty, reason, condition, refund amount |
| `return_photos` | return, `media_key` (authenticated), `deleted_at` |
| `return_events` | return, type, from and to status, actor, note |
| `banners` | placement (`hero` or `promo`), eyebrow (small label above the title), title, subtitle, button label and link, desktop and mobile image keys, sort, active, start and end |
| `blog_posts` | slug, title, excerpt, body (Tiptap JSON), cover image key, status, `published_at`, SEO fields, author |
| `settings` | One row: store details, TRN, VAT flag and rate, delivery fee and free-delivery threshold, return window, return expiry, low-stock threshold, announcement bar text, notification emails, return instructions template |
| `stripe_events` | event ID (PK), type, received and processed timestamps |
| `email_log` | template, recipient, entity ID, Resend message ID, status; unique (template, entity) for one-time emails |
| `audit_log` | admin, action, entity, before, after, timestamp |
| `job_runs` | job, started and finished timestamps, status, summary; the reconciliation job reads it to spot stale daily jobs |

- Prices, VAT and the final-sale flag are copied onto each order line, so later edits never change past orders, invoices or refunds.
- Invoice and credit note numbers come from a locked counter row, so they never skip (Postgres sequences can).
- Categories: one per product via `products.category_id`; the list is admin-managed. If products later need several groupings ("New in", seasonal edits), add `collections` + `product_collections`.
- **Price of a SKU:** `coalesce(price_override_fils, products.price_fils)`, always worked out on the server.
- **SKU rules (ADR-025):** stored in capitals and unique regardless of case (unique index on `upper(sku)`), pattern `^[A-Z0-9][A-Z0-9-]{2,31}$`. `src/lib/sku.ts` suggests `{style_code}-{colour code}-{size code}`, e.g. `ST0012-BLK-M`. Editable until `first_sold_at` is set by `mark_order_paid()`, then locked. A SKU with history is deactivated, never deleted, and never reused.
- **Hide, don't delete:** colours, sizes, product colours and SKUs that appear in orders, holds or the stock ledger can only be hidden (`is_active = false`). Unused ones can be deleted.

## Key Flows

### Product page (colour → size → SKU)
1. The cached product read returns its visible colours in order. Each colour carries its photos and its active SKUs (size label, SKU, price) in size order.
2. Availability is read live (never cached) with `variant_availability()` and streamed into the size picker.
3. The starting colour is `?colour=<slug>` when it's valid, otherwise the first colour with stock, otherwise the first colour. The server renders it, so shared links show the right photos.
4. Choosing a colour swaps the gallery and the size list without a reload and updates `?colour=`. Choosing a size never changes the photos.
5. Add to cart needs one SKU. A colour with a single size (One Size) selects it automatically.
6. The canonical URL drops `?colour=`.

### Shop pages and filters
The product list comes from the cached catalogue. Live availability for its SKUs is read on each request and merged on the server, so size and colour filters only match SKUs that are in stock, and fully sold-out products go last with a Sold out badge. This stays fast for a few hundred products; revisit past about 1,000.

### Admin: product with colours and sizes
1. Save the details → a Draft product with a generated `style_code`.
2. Add colours from the store's colour list (or create one inline).
3. Per colour, upload photos: the server signs uploads into `products/{productId}/{productColourId}/`, and on save it checks every key is inside that folder.
4. Per colour, tick sizes → one SKU each, with a suggested SKU and stock 0.
5. Enter opening stock in the colours × sizes grid. Every change goes through `adjust_stock()` with a reason.
6. Publish → the server checks the publishing rules (a price, a visible colour with a photo, an active SKU) → `updateTag()`.

### Checkout and stock hold
Per SKU: `available = stock_levels.on_hand - stock_levels.reserved`.

1. `startCheckout` validates the cart and re-prices it from the database. If the same cart already has a pending order, release its hold and expire its Stripe session first.
2. `create_pending_order()` runs in one transaction:
   - For each line, sorted by variant ID (avoids deadlocks): check the SKU is active, its colour is visible and the product is published, then `UPDATE stock_levels SET reserved = reserved + qty WHERE variant_id = $1 AND on_hand - reserved >= qty`. If any line updates zero rows, roll back and report that line.
   - Insert the order (`pending_payment`, provisional `hold_expires_at`), the `order_items` snapshot (with colour, size and SKU) and the `stock_reservations`.
3. Create the Stripe Checkout Session: `ui_mode: 'hosted_page'` (API versions from 2026-03; older versions call it `hosted`), currency `aed`, line items from the snapshot (named like "Satin Slip Dress, Black / M", with the SKU and variant ID in metadata), `expires_at` = now + 31 min (Stripe needs at least 30 min after creation), shipping address limited to `AE`, phone required, email prefilled for signed-in customers, delivery fee as a shipping option, `metadata.order_id`, idempotency key = order ID. Copy Stripe's `expires_at` into `hold_expires_at`, save the session ID and redirect. If Stripe fails, release the hold.
4. `checkout.session.completed` with `payment_status = 'paid'` → verify signature → skip if the event ID is already stored → `mark_order_paid()`: order Paid, reservations consumed, `on_hand` and `reserved` both reduced, `first_sold_at` set on each SKU, ledger rows written, invoice number assigned, Stripe IDs, amounts, customer details and address saved → send emails, each guarded by a unique `email_log` row.
5. `checkout.session.expired`, or the customer uses Stripe's back link (the cancel page expires the session) → `release_order()`: reservations released, order Expired.
6. Every 15 min the reconciliation job checks pending orders more than 10 min past their hold (including ones that never got a session) against Stripe and fixes them.
7. Paid but the hold was already released → deduct again if possible; if stock is short, set `needs_attention` and alert the admin.

### Refund
1. The admin clicks Refund on a Received return. The server checks `aal2`, the return status and the refundable balance.
2. Insert a `refunds` row (pending), then create the Stripe refund on the order's PaymentIntent with idempotency key = refund ID.
3. `refund.created` or `refund.updated` with status `succeeded` → refund Succeeded → return Refunded → order payment status updated → credit note (if VAT is on) → refund email.
4. `refund.failed` → refund Failed → admin alert; the return stays Received.
5. Stripe keeps its processing fee; refunds take 5 to 10 business days to reach the customer.

### Return photo upload
1. The return form creates a draft ID in the browser.
2. A Server Action signs Cloudinary upload params only if the customer owns the order and it's eligible: `type: 'authenticated'`, `folder: returns/{orderId}/{draftId}`, allowed formats, timestamp.
3. The browser compresses each photo and uploads it straight to Cloudinary (never through Vercel, which caps request bodies at 4.5 MB).
4. On submit, the server checks every photo key is inside that folder, then `submit_return()` creates the return.
5. Admins see photos through `private_download_url` links that expire after 1 hour.
6. A daily job deletes photos 90 days after the return closes.

### Catalogue change
Admin saves → Server Action → service → `updateTag('products')` (plus `product:{slug}`, `categories`, `colours`, `sizes`, and so on) → the storefront shows the change on the next load. Stock changes need no cache update because availability is never cached.

### Guest order linking
Clerk `user.created` / `user.updated` webhook (and the first account page load) → attach orders where `clerk_user_id` is null and the email matches a **verified** Clerk email.

## Statuses

### Order
| Status | Meaning | Set by | Next |
|---|---|---|---|
| `pending_payment` | Stock held, waiting for Stripe | Checkout | `paid`, `expired` |
| `paid` | Payment confirmed | Stripe webhook | `packed` |
| `packed` | Packed, ready to go | Admin | `delivered` |
| `delivered` | Delivered; return window running | Admin | final |
| `expired` | Checkout abandoned, hold released | Stripe webhook or job | final |

After launch: `cancelled` (admin cancels before delivery with a full refund) and `shipped`.

### Payment
`unpaid` → `paid` → `partially_refunded` → `refunded`. `needs_attention` is a flag, not a status.

### Return
| Status | Meaning | Next |
|---|---|---|
| `requested` | Customer submitted | `approved`, `rejected`, `cancelled` |
| `approved` | Instructions sent to the customer | `received`, `cancelled`, `expired` |
| `rejected` | Declined with a reason | final |
| `received` | Items back, condition recorded | `refunded`, `closed_no_refund` |
| `refunded` | Stripe confirmed the refund | final |
| `closed_no_refund` | Received, not refunded (reason logged) | final |
| `cancelled` | Customer cancelled | final |
| `expired` | Approved but never received | final |

### Refund
`pending` → `succeeded` or `failed`.

## Integrations

### Stripe (`/api/webhooks/stripe`)
Raw body + signature check; event IDs stored in `stripe_events`; API version pinned in code.

| Event | Action |
|---|---|
| `checkout.session.completed` | Mark paid, deduct stock, send emails |
| `checkout.session.expired` | Release the hold, set the order to Expired |
| `refund.created`, `refund.updated` | Update refund status; on success finish the return, issue the credit note, email the customer |
| `refund.failed` | Mark failed, alert the admin |
| `charge.dispute.created` | Alert the admin (chargeback) |

### Clerk (`/api/webhooks/clerk`)
Verified with `verifyWebhook()`. `user.created` and `user.updated` upsert `customers` and link guest orders. `user.deleted` anonymises the profile and keeps orders.

### Cloudinary
| Folder | Type | Uploaded by | Delivery |
|---|---|---|---|
| `products/{productId}/{productColourId}/` | upload (public) | Admin | CDN, resized through the loader |
| `categories/` | upload (public) | Admin | CDN |
| `banners/` | upload (public) | Admin | CDN |
| `blog/` | upload (public) | Admin | CDN |
| `returns/` | authenticated (private) | Customer | `private_download_url`, 1 hour |

All uploads are signed by the server. Media adapter API: `imageUrl(key, options)`, `signUpload(kind, context)`, `privateUrl(key, ttl)`, `remove(key)`. The replacement provider must support resized public delivery, private files, signed uploads and signed time-limited links (e.g. R2 or S3 presigned URLs).

### Resend
React Email templates live in `src/services/email/templates`. The sender uses the client's domain with SPF, DKIM and DMARC. Every one-time email writes a unique `email_log` row first. The Free plan caps at 100 emails a day; switch to Pro ($20/mo) before any promotion.

### Sentry
Free Developer plan (ADR-027): one user, email alerts only, 5,000 errors, 5M spans, 50 replays, 5 GB of logs, one cron monitor and one uptime monitor a month, 30 days of history. There's no pay-as-you-go on this plan: going over a limit means upgrading.

| Area | Setup |
|---|---|
| SDK | `@sentry/nextjs`, installed with `npx @sentry/wizard@latest -i nextjs`. `src/instrumentation-client.ts` runs in the browser. `src/instrumentation.ts` loads `sentry.server.config.ts` or `sentry.edge.config.ts` and exports `onRequestError = Sentry.captureRequestError` (Server Components, Route Handlers, Server Actions, proxy). `src/app/global-error.tsx` reports render errors |
| What gets reported | Unexpected errors only. Webhook, refund and job failures are captured with tags (`order_id`, `return_id`, `refund_id`, `job`) |
| Tracing | `tracesSampleRate`: 1.0 in development, 0.1 in production |
| Logs | `enableLogs: true`; `Sentry.logger` for key events (order paid, refund failed, job summary) |
| Session Replay | Storefront only, on errors only: `replaysSessionSampleRate: 0`, `replaysOnErrorSampleRate: 1.0`, `maskAllText`, `blockAllMedia` |
| Privacy | `sendDefaultPii: false`; `beforeSend` and `beforeSendLog` strip emails, phone numbers, addresses, cookies, auth headers and tokens |
| Tunnel | `tunnelRoute: '/sentry-tunnel'` so ad blockers don't drop events; the `proxy.ts` matcher excludes it |
| Releases and source maps | `withSentryConfig` uploads source maps during Vercel builds (`SENTRY_AUTH_TOKEN`) and deletes them afterwards; release = git commit SHA; environment = `development`, `preview` or `production` |
| Cron monitor | `Sentry.withMonitor('reconcile-checkouts', job, { schedule: { type: 'crontab', value: '*/15 * * * *' }, checkinMargin: 5, maxRuntime: 5 })`. Leave automatic Vercel cron monitoring off: it creates a monitor per cron job, and the free plan includes one |
| Uptime monitor | `GET /api/health`: 200 `{ "status": "ok" }` when the app can query Supabase, 503 `{ "status": "degraded" }` otherwise |
| Alerts (email) | New issue in production, regression, more than 10 events of one issue in an hour, cron check-in missed or failed, uptime down |
| Noise and quota | Inbound filters on (browser extensions, localhost, web crawlers) and spike protection on. Sentry is off locally and in tests unless `NEXT_PUBLIC_SENTRY_DSN` is set |

## Background Jobs
Vercel Cron, protected by `CRON_SECRET`. Every run writes a `job_runs` row.

| Job | Route | Runs | Does | Watched by |
|---|---|---|---|---|
| Reconcile checkouts | `/api/cron/reconcile-checkouts` | Every 15 min | Checks stale pending orders against Stripe and fixes them | Sentry cron monitor |
| Expire returns | `/api/cron/expire-returns` | Daily | Approved returns not received in N days become Expired | The reconciliation job reports an error to Sentry if there's no successful run in 26 hours |
| Purge return photos | `/api/cron/purge-return-photos` | Daily | Deletes photos 90 days after the return closes | Same |

## Caching
- Enable `cacheComponents`. Catalogue, banner and blog reads use `'use cache'` + `cacheTag` (`categories`, `colours`, `sizes`, `products`, `product:{slug}`, `banners`, `blog`, `post:{slug}`) through `createPublicClient()`.
- Admin Server Actions call `updateTag()`. Webhooks and jobs use `revalidateTag(tag, { expire: 0 })`.
- Never cached: availability (`variant_availability()`), cart, checkout, account and admin pages.
- Images use a custom `next/image` loader for Cloudinary; `images.remotePatterns` is limited to our Cloudinary account.

## Routes
- **Storefront:** `/`, `/shop` (filters as query params: `?size=`, `?colour=`, `?sort=`, `?sale=1`), `/shop/[category]`, `/products/[slug]` (`?colour=<slug>` opens a colour), `/cart`, `/checkout/success`, `/checkout/cancelled`, `/sign-in`, `/sign-up`, `/account/orders`, `/account/orders/[orderNumber]`, `/account/orders/[orderNumber]/return`, `/account/returns/[returnNumber]`, `/blog`, `/blog/[slug]`, `/about`, `/contact`, `/policies/[slug]`
- **Admin:** `/admin/login`, `/admin/mfa`, `/admin`, `/admin/categories`, `/admin/colours`, `/admin/sizes`, `/admin/products`, `/admin/products/[id]`, `/admin/stock`, `/admin/orders`, `/admin/orders/[id]`, `/admin/returns`, `/admin/returns/[id]`, `/admin/banners`, `/admin/blog`, `/admin/blog/[id]`, `/admin/settings`, `/admin/staff`, `/admin/audit`
- **API:** `/api/webhooks/stripe`, `/api/webhooks/clerk`, `/api/invoices/[orderId]`, `/api/credit-notes/[id]`, `/api/cron/reconcile-checkouts`, `/api/cron/expire-returns`, `/api/cron/purge-return-photos`, `/api/health`, `/sentry-tunnel` (added by the Sentry SDK)

## Environments
| Service | Local | Preview / Staging | Production |
|---|---|---|---|
| Hosting | `localhost:3000` | Vercel preview deployments | Vercel production |
| Supabase | Local (Supabase CLI + Docker) | Staging project | Production project |
| Clerk | Development instance | Development instance | Production instance on the client's domain |
| Stripe | Test mode + Stripe CLI | Test mode | Live mode |
| Resend | Test API key | Test API key | Live key, verified domain |
| Cloudinary | `dev/` folders | `staging/` folders | Production folders |
| Sentry | Off (no DSN) unless testing Sentry itself | One project, environment `preview` | Same project, environment `production` |

## External Services and Costs
| Service | Plan | Monthly | Notes |
|---|---|---|---|
| Vercel | Pro | From $20 + usage | Hobby is non-commercial only |
| Supabase | Pro | $25 + usage | Daily backups |
| Clerk | Hobby | $0 up to 50k monthly retained users | Pro ($25/mo) removes Clerk branding |
| Resend | Free, then Pro | $0, then $20 | Free is capped at 100 emails a day |
| Cloudinary | Free to start | $0 | Temporary; usage-based beyond the free allowance |
| PostHog | Free tier | $0 | |
| Sentry | Developer (free) | $0 | One user, email alerts only; limits under "Sentry" above. Team ($26/mo billed annually) adds people, Slack and higher limits |
| Stripe | Pay as you go | 2.9% + AED 1 per domestic card | Paid by the client; the fee isn't returned on refunds |

Fixed cost: about $45 to $90 a month, plus Stripe fees.
