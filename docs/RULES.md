# Development Rules

> The AI rulebook for this project. Cursor gets the same rules split by area in `.cursor/rules/`. When a rule changes, update both.

## General
- Use TypeScript in strict mode. No `any` without a comment explaining why.
- Reuse existing components, services and helpers before writing new ones.
- Do not duplicate logic.
- Keep functions small and single-purpose.
- Do not modify unrelated files.
- Do not add dependencies without asking. Use the libraries in ADR-021 (plus `@sentry/nextjs`, ADR-027).
- Do not change a decision in `DECISIONS.md` without approval. Propose a new ADR instead.
- If the docs don't answer a question, stop and ask. Never invent requirements.
- Work on one task from `TASKS.md` at a time.
- Spell it `colour` everywhere we name things (tables, columns, params, components, copy). Use `color` only where CSS or a library requires it.

## Before Coding
- Read `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, `docs/RULES.md`, `docs/DECISIONS.md`, `docs/MEMORY.md` and `TASKS.md`.
- Inspect the existing implementation.
- Reuse existing functionality where possible.
- For large changes, write a plan and wait for approval.
- Confirm the task's acceptance criteria and the tests you'll add.

## Architecture
- UI components never call Supabase, Stripe, Resend or Cloudinary directly.
- Database and third-party calls live in `src/services/*` (server only).
- Every Server Action and Route Handler: check auth → validate input with Zod → call a service → return a typed result.
- Orders, stock, returns and refunds change only through Postgres functions.
- Server Components by default. Add `"use client"` only when needed.
- Keep business logic out of components.

## Data and Auth
- Customers: `requireCustomer()` (Clerk `auth()`). Admins: `requireAdmin()` (Supabase `getClaims()`, `aal2`, active admin).
- Never use `auth.uid()` in RLS policies. Compare `auth.jwt()->>'sub'` as text.
- Every new table gets RLS, policies and tests in `supabase/tests`.
- The secret (service-role) key is only for webhooks, cron jobs and PDF generation.
- Add new migrations; never edit an applied one.
- Regenerate database types after schema changes (`npm run db:types`).

## Catalogue, Payments and Stock
- A product has colours; each colour has sizes; each colour + size is one SKU (`product_variants` row). Cart lines, holds, order lines, returns and stock changes always reference the SKU.
- Photos belong to a product colour. Never attach photos to a size or directly to a product.
- SKUs: capitals, unique regardless of case, suggested by `src/lib/sku.ts`, locked once sold. Deactivate SKUs with history; never delete or reuse them.
- Never send stock counts to the browser. Use `variant_availability()` statuses.
- Never mark an order paid outside the Stripe webhook.
- Never trust prices, totals or stock from the browser.
- Money is integer fils. Format it only in the UI with `formatAED()`.
- Use idempotency keys for Stripe writes. Webhooks must be safe to replay.
- Never restock automatically.

## Media
- Use `src/services/media` only. Store keys, never URLs.
- Product photos are uploaded into the colour's folder (`products/{productId}/{productColourId}/`).
- Return photos are `authenticated` uploads, shown only through short-lived signed links.

## UI
- Follow `DESIGN.md`. Use shadcn/ui primitives from `src/components/ui`.
- Use theme tokens only: `bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`, `bg-secondary`, `bg-accent`, `border-border`, `border-input`, `font-heading`, `font-sans`. No hex codes, arbitrary colour values or font names in components (`npm run check:tokens` fails on them).
- Never hand-edit files in `src/components/ui/`. Compose or wrap them in our own components, because a preset apply can reinstall them.
- Keep every screen responsive (375 / 768 / 1440).
- Include loading, error and empty states.
- Make it accessible: labels, keyboard support, visible focus, alt text.
- Use `next/image` with the Cloudinary loader.

## Errors and Monitoring
- Return expected errors (validation, sold out, not allowed) to the UI as typed results. Don't report them to Sentry.
- Report unexpected errors to Sentry with IDs as tags (`order_id`, `return_id`, `refund_id`, `job`), never names, emails, phone numbers or addresses.
- Use `Sentry.logger` for key business events. Never `console.log` personal data.
- Never show stack traces or internal details to users.

## Security
- Never expose API keys. Only `NEXT_PUBLIC_*` values may reach the browser.
- Validate all user input with Zod.
- Verify authorization on the server, every time.
- Follow `SECURITY.md` for uploads, webhooks, headers and monitoring.

## Testing
- Add tests for important functionality (see `TEST_PLAN.md`).
- After implementing, run `npm run typecheck`, `npm run lint`, `npm run check:tokens`, `npm test` and the relevant DB, integration or E2E tests.
- Fix failing tests before continuing.
- Every bug fix gets a test that would have caught it.

## Git
- One branch per task: `feature/TASK-0xx-short-name` or `fix/short-name`.
- Make small commits with descriptive messages: `feat:`, `fix:`, `test:`, `docs:`, `chore:`.
- Never commit `.env*` files except `.env.example`.

## After Each Task
Report:
1. Files changed
2. What was implemented
3. Tests executed
4. Remaining issues

Then mark the task done in `TASKS.md` and update `docs/MEMORY.md`.
