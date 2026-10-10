---
trigger: always_on
---

# Testing
Applies to `tests/**`, `supabase/tests/**` and `*.test.ts(x)` / `*.spec.ts` files.
- `docs/TEST_PLAN.md` defines what each area must prove.
- Unit tests (Vitest) for pure logic: money, VAT, SKU checks, stock sheet row checks, COD eligibility, return eligibility, cart rules.
- DB tests (pgTAP) for every RLS policy and Postgres function, including "customer A can't read customer B", "an admin without aal2 is denied", "visitors can't read stock counts", duplicate SKUs in any letter case, a SKU pointing at another product's colour, `apply_catalogue_import()` all or nothing, and `place_cod_order()` rejecting every rule even when called directly.
- Integration tests for webhooks with the Stripe CLI and local Supabase. Replaying an event must change nothing.
- E2E tests (Playwright) for each vertical slice, with axe checks on key pages. Cover colour switching (photos swap, sizes change), sold-out sizes, the four product shapes, a stock sheet upload and a COD order end to end.
- Stock sheet tests use the fixtures in `tests/fixtures/`, including the client's sheet as sent. Assert that values come back exactly as written.
- Use the Stripe test cards in `docs/TEST_PLAN.md`. Never use live keys in tests.
- Media tests use a mocked S3 client or the dev buckets, never staging or production.
- Sentry stays off in tests (no DSN). Never send test errors to the production environment.
- Keep tests deterministic: seeded data, no dependence on test order, controlled clocks for expiry tests (holds, COD deadlines).
- After implementing: `npm run typecheck`, `npm run lint`, `npm run check:tokens`, `npm test`, plus the relevant `test:db`, `test:integration` and `test:e2e`.
- Fix failing tests before continuing. Every bug fix adds a test that would have caught it.
