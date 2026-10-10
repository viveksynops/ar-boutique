---
trigger: always_on
---

# Backend
Applies to `src/services/**`, `src/lib/**`, `src/app/api/**`, `src/features/**/actions.ts`, `src/proxy.ts`, `src/instrumentation*.ts`, `src/sentry.*.config.ts` and `supabase/**`.

## Structure
- Database and third-party calls live in `src/services/*` with `import 'server-only'`.
- Every Server Action and Route Handler: check auth, then validate with Zod, then call a service, then return a typed result.
- Orders, stock, returns and refunds change only through Postgres functions that check the current state in one transaction.

## Auth
- Customers: `requireCustomer()` (Clerk `auth()`). Admins: `requireAdmin()` (`supabase.auth.getClaims()`, `aal2`, active admin).
- `proxy.ts` only routes. Never rely on it for security. Its matcher excludes the Sentry tunnel (`/sentry-tunnel`).
- Use the right Supabase client (see "Supabase Clients" in `docs/ARCHITECTURE.md`). The service client is only for webhooks, cron jobs and PDFs.

## Database
- RLS on every table, deny by default. Add pgTAP tests in `supabase/tests` for every new table or policy.
- Never use `auth.uid()` in a policy. Compare `auth.jwt()->>'sub'` as text. Admin checks use `is_admin()`.
- `security definer` functions set an explicit `search_path`.
- Add new migrations; never edit an applied one. Run `npm run db:types` after schema changes.
- Money is integer fils.

## Payments
- Card: only the signed Stripe webhook marks a card order paid (`mark_order_paid()` sets `confirmed` and payment `paid`).
- Re-price everything on the server. Never trust browser prices, totals, fees, payment method or stock.
- Use idempotency keys on Stripe writes, store webhook event IDs, and make handlers safe to replay.
- The Stripe Checkout Session is for the payment only: the address comes from our checkout form.
- Order statuses and payment statuses follow ADR-035. Never add a status without a new ADR.
- Never restock automatically.

## Cash on delivery
- COD orders are created only by `place_cod_order()`. It checks every rule again in one transaction (COD on, signed in, maximum order value, one open COD order, refusals per account and per phone, turned off per customer), re-prices, adds the fee and reserves stock in variant ID order. One idempotency key per cart.
- Stock is deducted at Shipped (`mark_shipped()`), not when the order is placed or confirmed.
- A COD order is paid only through `record_cod_delivery()` (admin with `aal2`), which also assigns the invoice number.
- Unconfirmed COD orders are cancelled by the reconciliation job after `confirm_by`, releasing their stock.
- Refused parcels: `mark_returned_to_sender()`; restocking stays manual ("COD refused").
- COD refunds are recorded bank transfers (amount, date, reference). Never store bank details.
- Every COD admin action needs `aal2` and writes `audit_log`.

## Media and email
- Media only through `src/services/media` (Cloudflare R2 + sharp, ADR-037); store keys, never URLs.
- Admin photos: original to the private bucket, then sharp makes the WebP copies (fixed widths per kind) into the public bucket with `Cache-Control: public, max-age=31536000, immutable`. Every upload gets a new key; never overwrite a file.
- After every upload, check size and type on the server and delete bad files (R2 links can't limit size).
- Return photos stay in the private bucket, re-saved with sharp to drop metadata, shown through 1-hour signed links.
- One-time emails write a unique `email_log` row before sending.

## Errors and monitoring
- Return typed errors to the UI. Never leak stack traces or internal details.
- Expected errors (validation, sold out, not allowed, upload row errors, COD not available) aren't reported to Sentry.
- Report unexpected errors with `Sentry.captureException`, tagged with IDs (`order_id`, `return_id`, `refund_id`, `import_id`, `job`). Never send names, emails, phone numbers or addresses.
- Wrap the reconciliation job in `Sentry.withMonitor()`. Every cron job writes a `job_runs` row.
