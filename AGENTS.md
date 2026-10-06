Rules for AI coding agents working on AR Boutique. The full rulebook is `docs/RULES.md`. When a rule changes, update both.

## Project docs
Read the relevant ones before changing anything.
- What and why: `docs/PRD.md`
- How: `docs/ARCHITECTURE.md`
- Look and feel: `docs/DESIGN.md`
- Decisions (don't change without approval): `docs/DECISIONS.md`
- Current state: `docs/MEMORY.md`
- Tasks: `TASKS.md`
- Tests: `docs/TEST_PLAN.md`
- Security: `docs/SECURITY.md`

## Commands
- `npm run dev`: start the dev server
- `npm run typecheck`, `npm run lint`, `npm run check:tokens`: static checks
- `npm test`: unit tests (Vitest)
- `npm run test:db`: RLS and Postgres function tests (pgTAP)
- `npm run test:integration`: webhooks with local Supabase + Stripe CLI
- `npm run test:e2e`: end-to-end tests (Playwright)
- `npm run db:reset`, `npm run db:types`: reset the local database, regenerate types

## Always
- Read the relevant docs and inspect the existing code before changing anything.
- Work on one task from `TASKS.md` at a time. For large changes, write a plan and wait for approval.
- TypeScript strict. Reuse existing components, services and helpers. Don't duplicate logic.
- Keep functions small. Don't modify unrelated files.
- Don't add dependencies without asking (approved libraries: ADR-021, plus `@sentry/nextjs` from ADR-027).
- If the docs don't answer something, stop and ask. Never invent requirements.
- Never expose secrets. Only `NEXT_PUBLIC_*` values may reach the browser.
- Spell it `colour` in names and copy; `color` only where CSS or a library requires it.

## Frontend
Applies to `src/app/**/*.tsx`, `src/components/**/*.tsx` and `src/features/**/components/**/*.tsx`.
- Follow the tokens and components in `docs/DESIGN.md`. Don't invent colours, fonts or radii.
- Theme tokens only: `bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`, `bg-secondary`, `bg-accent`, `border-border`, `border-input`, `font-heading`, `font-sans`. No hex codes, arbitrary colour values or font names (`npm run check:tokens` fails on them).
- shadcn/ui first, reusable always: see Components below.
- Server Components by default. Add `"use client"` only for interaction.
- Components never call Supabase, Stripe, Resend or Cloudinary. Call Server Actions from `features/<domain>/actions.ts`.
- Forms use React Hook Form with the Zod schema from `features/<domain>/schemas.ts`.
- Product page: colour first (it swaps the photos), then size (it never changes the photos). Keep the colour in `?colour=`. Show only the sizes that colour comes in; sold-out sizes stay visible but disabled.
- Never show stock counts, only "Only N left" at 3 or fewer.
- Every screen is responsive (375 / 768 / 1440) and has loading, error and empty states.
- Accessibility: labels, `aria-describedby` for errors, keyboard support, visible focus, alt text on every image; pickers announce selected and sold-out options.
- Images use `next/image` with the Cloudinary loader. Pass media keys, never URLs.
- Prices always go through `formatAED()` from `src/lib/money.ts`. Never format money by hand.
- The cart lives in the Zustand store in `features/cart`, one line per SKU. Never calculate payment totals in the browser.
- Disable submit buttons and show a spinner while an action runs.

### Components
- Before creating a component, check in this order: `src/components/ui`, then the shadcn registry (`npx shadcn@latest add <name>`: card, badge, sheet, accordion, carousel, navigation-menu, separator, skeleton, table and so on), then our existing components. Build new only when nothing fits, and say why in the plan.
- Build on primitives: a product card is `Card` + `Badge` + `next/image`, not a new styled `div`. Restyle through `className` or `cva` variants in a wrapper. Never hand-edit `src/components/ui` or copy its markup.
- Adding a shadcn component needs no approval, unless it installs a new npm package (e.g. carousel adds Embla): ask first.
- Where components live:
  - `src/components/ui/`: shadcn only
  - `src/components/store/`: shared storefront pieces (`StoreButton`, `Container`, `SectionHeading`, `Price`)
  - `src/components/admin/`: shared admin pieces (`PageHeader`, `DataTable`, `StatusBadge`)
  - `src/features/<domain>/components/`: used by one domain only. Once a second domain needs it, move it to a shared folder.
- Pages (`src/app/**/page.tsx`) fetch data and compose components; no repeated markup in pages.
- One job per component, typed props, content passed in as props (never hard-coded copy or data). Split files over about 150 lines.
- Every plan lists the shadcn and existing components it reuses, and each new component with its reason.

## Backend
Applies to `src/services/**`, `src/lib/**`, `src/app/api/**`, `src/features/**/actions.ts`, `src/proxy.ts`, `src/instrumentation*.ts`, `src/sentry.*.config.ts` and `supabase/**`.

### Structure
- Database and third-party calls live in `src/services/*` with `import 'server-only'`.
- Every Server Action and Route Handler: check auth â†’ validate with Zod â†’ call a service â†’ return a typed result.
- Orders, stock, returns and refunds change only through Postgres functions that check the current state in one transaction.

### Auth
- Customers: `requireCustomer()` (Clerk `auth()`). Admins: `requireAdmin()` (`supabase.auth.getClaims()`, `aal2`, active admin).
- `proxy.ts` only routes. Never rely on it for security. Its matcher excludes the Sentry tunnel (`/sentry-tunnel`).
- Use the right Supabase client (see "Supabase Clients" in `docs/ARCHITECTURE.md`). The service client is only for webhooks, cron jobs and PDFs.

### Database
- RLS on every table, deny by default. Add pgTAP tests in `supabase/tests` for every new table or policy.
- Never use `auth.uid()` in a policy. Compare `auth.jwt()->>'sub'` as text. Admin checks use `is_admin()`.
- `security definer` functions set an explicit `search_path`.
- Add new migrations; never edit an applied one. Run `npm run db:types` after schema changes.
- Money is integer fils.

### Catalogue and stock
- One SKU = one colour in one size = one `product_variants` row. Cart lines, holds, order lines, returns and stock changes reference it.
- Stock lives in `stock_levels`. Visitors and customers never read it; they get statuses from `variant_availability()`.
- Lock `stock_levels` rows in variant ID order inside one transaction.
- SKUs are stored in capitals, unique regardless of case, and locked once `first_sold_at` is set. Deactivate, never delete or reuse.
- Colours, sizes, product colours and SKUs with history are hidden, never deleted.
- Photos belong to a product colour; product photo keys must sit inside `products/{productId}/{productColourId}/`.

### Payments
- Only the signed Stripe webhook marks orders paid.
- Re-price everything on the server. Never trust browser prices, totals or stock.
- Use idempotency keys on Stripe writes, store webhook event IDs, and make handlers safe to replay.
- Never restock automatically.

### Media and email
- Media only through `src/services/media`; store keys. Return photos are `authenticated` uploads shown through 1-hour signed links.
- One-time emails write a unique `email_log` row before sending.

### Errors and monitoring
- Return typed errors to the UI. Never leak stack traces or internal details.
- Expected errors (validation, sold out, not allowed) aren't reported to Sentry.
- Report unexpected errors with `Sentry.captureException`, tagged with IDs (`order_id`, `return_id`, `refund_id`, `job`). Never send names, emails, phone numbers or addresses.
- Wrap the reconciliation job in `Sentry.withMonitor()`. Every cron job writes a `job_runs` row.

## Testing
Applies to `tests/**`, `supabase/tests/**`, `**/*.test.ts`, `**/*.test.tsx` and `**/*.spec.ts`.
- `docs/TEST_PLAN.md` defines what each area must prove.
- Unit tests (Vitest) for pure logic: money, VAT, SKU suggestion and validation, return eligibility, cart rules.
- DB tests (pgTAP) for every RLS policy and Postgres function, including "customer A can't read customer B", "an admin without aal2 is denied", "visitors can't read stock counts", duplicate SKUs in any letter case, and a SKU pointing at another product's colour.
- Integration tests for webhooks with the Stripe CLI and local Supabase. Replaying an event must change nothing.
- E2E tests (Playwright) for each vertical slice, with axe checks on key pages. Cover colour switching (photos swap, sizes change) and sold-out sizes.
- Use the Stripe test cards in `docs/TEST_PLAN.md`. Never use live keys in tests.
- Sentry stays off in tests (no DSN). Never send test errors to the production environment.
- Keep tests deterministic: seeded data, no dependence on test order, controlled clocks for expiry tests.
- After implementing: `npm run typecheck`, `npm run lint`, `npm run check:tokens`, `npm test`, plus the relevant `test:db`, `test:integration` and `test:e2e`.
- Fix failing tests before continuing. Every bug fix adds a test that would have caught it.

## Git
- Never run `git add`, `git commit`, `git push`, `git reset`, `git rebase`, `git stash`, `git branch`, `git checkout -b` or `git switch -c` unless I ask for it in that message. When I ask for a commit message or a branch name, only write it.
- Never commit `.env*` files except `.env.example`.
- To write a commit message, read `git diff --staged`. If nothing is staged, use the unstaged changes and say so. If the changes mix unrelated work, suggest splitting them into small commits.

### Branch names
Format: `<prefix>/TASK-0xx-short-description`. Leave out the task ID only when there's no task.
- Prefixes: `feature/` (new feature), `bugfix/` (bug fix), `hotfix/` (urgent production fix), `design/` (UI or UX only), `refactor/` (structure, no behaviour change), `test/` (tests only), `doc/` (docs only).
- Lowercase except the task ID, words separated by hyphens, no spaces or underscores, ideally under 50 characters.
- Describe the main change. No generic words like `update`, `changes`, `stuff` or `misc`.
- One branch per task, created from the latest `main`. Suggest the name at the start of every task plan, so I can create it before any code is written.
- Examples: `feature/TASK-012-home-page`, `bugfix/TASK-031-stock-hold-expiry`, `design/TASK-014-mobile-header`, `doc/update-memory`.

### Commit messages
Format: `<type>(<scope>): <subject>`, a blank line, the body, a blank line, the footer.
- Header required, scope optional. No line over 100 characters.
- Types: `feat`, `fix`, `docs`, `style` (formatting only), `refactor`, `perf`, `test`, `chore` (build, tooling, dependencies).
- Scope: the area changed, e.g. `store`, `home`, `product`, `cart`, `checkout`, `admin`, `stock`, `returns`, `auth`, `db`, `ui`, `theme`, `env`, `docs`.
- Subject: imperative present tense ("add", not "added" or "adds"), lowercase first letter, no full stop at the end.
- Body: imperative too; say why the change was made and how it differs from before.
- Footer: `BREAKING CHANGE: <what breaks and how to migrate>`, `Closes #<issue>`, and the TASK-0xx it finishes.
- Revert: `revert: <header of the reverted commit>`, with the body `This reverts commit <hash>.`
- Example header: `feat(home): add hero banner and shop by category`

## After each task, report
1. Files changed
2. What was implemented
3. Tests executed
4. Remaining issues
5. A suggested commit message (don't commit)

Then mark the task done in `TASKS.md` and update `docs/MEMORY.md`.
