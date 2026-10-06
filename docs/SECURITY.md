# Security Requirements

> Security is part of every task, not something added just before launch.

## Authentication
- Customers sign in with Clerk. Admins sign in with Supabase Auth plus TOTP 2FA (`aal2`); they're invite only and public sign-up is disabled.
- `/account/*` requires a Clerk session. `/admin/*` (except `/admin/login` and `/admin/mfa`) requires an `aal2` admin session.
- `proxy.ts` only redirects. Every Server Action and Route Handler checks auth itself with `requireCustomer()` or `requireAdmin()`.
- On the server, verify admin sessions with `supabase.auth.getClaims()`; never trust `getSession()`.

## Authorization
- Customers can only read their own orders, invoices and returns (RLS on `auth.jwt()->>'sub'`).
- Admin data and actions require `is_admin()`: Supabase issuer, `user_role = 'admin'`, `aal2`, active `admin_users` row.
- Deactivated admins lose access immediately (checked inside `is_admin()`).
- Refunds can never exceed the refundable balance. Every admin change is written to `audit_log`.
- Invoice and credit note downloads check ownership (customer) or admin access.
- Visitors and customers can never read stock counts. The storefront gets statuses from `variant_availability()` (ADR-026).

## Secrets
- Never expose secrets to client-side code. Only `NEXT_PUBLIC_*` values reach the browser, and they must be safe to publish.
- Server-only modules start with `import 'server-only'`.
- Real values live in `.env.local` (local) and Vercel environment variables (preview, production), with separate keys per environment.
- `.env*` files are git-ignored except `.env.example`. That includes `.env.sentry-build-plugin`, which the Sentry wizard creates.
- The Sentry DSN is public by design. `SENTRY_AUTH_TOKEN` is build-only and never gets a `NEXT_PUBLIC_` prefix.
- If a key leaks, rotate it immediately and record it in `MEMORY.md`.

## Database
- RLS on every table, deny by default, with tests in `supabase/tests`.
- Never use `auth.uid()` in a policy (ADR-005).
- Orders, stock, returns and refunds change only through Postgres functions that check the current state.
- SKU uniqueness, one SKU per colour and size, and a SKU's link to its own product's colour are database constraints, not just form checks.
- `security definer` functions set an explicit `search_path`.
- The secret key is used only in webhooks, cron jobs and PDF generation.

## Payments
- Card details never touch our servers (Stripe hosted Checkout).
- Prices, totals, delivery fee and VAT are always calculated on the server from the database.
- Only the signed Stripe webhook can mark an order paid.
- Webhooks: verify the signature on the raw body, store event IDs, ignore duplicates.
- Idempotency keys on Checkout Session creation (order ID) and refunds (refund ID).

## Input
- Validate every Server Action and Route Handler input with Zod: types, lengths, enums, quantities.
- Never trust IDs from the browser: reload the record and check ownership and status. A cart line's SKU is re-checked on the server (active, colour visible, product published, in stock).
- Limit text lengths (for example, return comments to 1,000 characters).
- Blog content is stored as Tiptap JSON and rendered with an allow-list. Never render raw HTML.

## APIs
- Stripe and Clerk webhooks reject requests without a valid signature.
- Cron routes require `Authorization: Bearer <CRON_SECRET>`.
- Validate request bodies and parameters. Return only the fields the caller needs, and never stack traces.
- `/api/health` returns only `ok` or `degraded`, never internal details.
- The Sentry tunnel (`/sentry-tunnel`) only forwards to our own Sentry project, and `proxy.ts` excludes it.
- Rate limit checkout start (so bots can't hold stock), return submission and upload signing. Supabase rate-limits admin login.

## File Uploads
Validate:
- **File type:** images only (JPEG, PNG, WebP). Test iPhone photo uploads in QA.
- **File size:** reject originals over 10 MB; compress in the browser to about 2 MB before upload.
- **Filename:** never use the client's filename; public IDs are generated on the server.

Also:
- Uploads go straight from the browser to Cloudinary with server-signed params. No unsigned upload presets.
- Product photos are signed for admins only, into `products/{productId}/{productColourId}/`. On save, the server checks every key is inside that folder.
- Return photos: `authenticated` type, `returns/{orderId}/{draftId}` folder, max 5, signed only for the order's owner on an eligible order.
- Admins view return photos only through signed links that expire after 1 hour. Photos are deleted 90 days after the return closes.
- Category, banner and blog uploads are signed for admins only.

## Platform
- HTTPS everywhere (Vercel) with HSTS.
- Security headers: Content Security Policy (allow Stripe, Clerk, Cloudinary, GTM and PostHog; Sentry events go through our own tunnel, and Sentry Replay needs `worker-src 'self' blob:`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `frame-ancestors 'none'`.
- Next.js ≥ 16.3.8. Upgrade within days of any critical advisory (another critical fix is pending upstream).
- `images.remotePatterns` is limited to our Cloudinary account.
- Dependabot and `npm audit` run in CI.

## Personal Data
- Collect only what orders need: name, email, phone, address.
- No card data is stored.
- Account deletion anonymises the profile and keeps orders and invoices for tax records.
- PostHog masks inputs. Never send personal data to analytics.
- Sentry: `sendDefaultPii` off; `beforeSend` and `beforeSendLog` strip emails, phone numbers, addresses, cookies, auth headers and tokens. Tag events with order, return or refund IDs, never names or emails.
- Sentry Replay masks all text and inputs, blocks media, records only when an error happens, and never runs on `/admin`.
- Pick Sentry's data region (EU or US) when creating the organisation. It can't be changed later.
- The client's adviser confirms UAE data-protection duties, including where Sentry stores data.

## Security Checklist (before every production deploy)
- [ ] No secrets in Git (secret scanning on)
- [ ] Every new action and route checks auth on the server
- [ ] Authorization verified: customer A can't read customer B; admin needs `aal2`
- [ ] RLS on for every table; RLS tests pass; stock counts not readable by visitors or customers
- [ ] Input validated on every new action and route
- [ ] Webhooks verified and safe to replay
- [ ] Upload rules enforced: type, size, ownership, folder
- [ ] No personal data in Sentry events, logs or replays
- [ ] Dependencies patched; Next.js advisories checked
