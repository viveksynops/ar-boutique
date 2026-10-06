# Architecture Decisions

> Permanent decisions and why we made them. Don't change one without approval: add a new ADR that replaces it.
> The current project state lives in `MEMORY.md`.

## ADR-001: One Next.js app for storefront and admin
**Status:** Accepted · 5 Oct 2026
**Decision:** Build the storefront and the admin dashboard in one Next.js App Router app. The admin lives under `/admin`.
**Reason:** One codebase, shared types and services, server rendering for SEO, and no separate backend to run.

## ADR-002: Supabase for the database and backend
**Status:** Accepted · 5 Oct 2026
**Decision:** Supabase PostgreSQL with Row Level Security and Postgres functions.
**Reason:** Managed Postgres, auth, RLS and backups without running our own infrastructure.

## ADR-003: Clerk for customer accounts
**Status:** Accepted · 5 Oct 2026
**Decision:** Customers sign up and sign in with Clerk, connected to Supabase as a third-party auth provider.
**Reason:** Ready-made, secure auth screens and flows; free up to 50,000 monthly retained users; native Supabase integration (Clerk's old JWT templates have been deprecated since 1 Apr 2025).

## ADR-004: Supabase Auth for admins, on a separate login
**Status:** Accepted · 5 Oct 2026
**Decision:** Admins log in with Supabase Auth at `/admin/login`. Invite only, TOTP 2FA required.
**Reason:** Keeps staff out of the customer user pool. Supabase's TOTP 2FA is free, so admins get 2FA without paying for Clerk Pro.

## ADR-005: RLS compares `sub` as text, never `auth.uid()`
**Status:** Accepted · 5 Oct 2026
**Decision:** Policies compare `auth.jwt()->>'sub'` as text. Admin checks use `is_admin()`.
**Reason:** Clerk IDs aren't UUIDs. `auth.uid()` casts to uuid and throws, and because policies are OR'd together, a single admin policy using it would break customer requests.

## ADR-006: Stripe Checkout hosted page only
**Status:** Accepted · 5 Oct 2026
**Decision:** Stripe Checkout hosted page in AED: cards, Apple Pay, Google Pay. No cash on delivery, no buy-now-pay-later.
**Reason:** The client's requirement. Card data never touches our servers, and wallets work out of the box.

## ADR-007: Hold stock at checkout, deduct on payment
**Status:** Accepted · 5 Oct 2026
**Decision:** Hold stock when checkout starts. The Stripe session expires after 31 minutes. Deduct on `checkout.session.completed`; release on expiry or cancel.
**Reason:** Prevents overselling without locking stock forever. Stripe needs a session to last at least 30 minutes after it's created.

## ADR-008: Only the Stripe webhook marks orders paid
**Status:** Accepted · 5 Oct 2026
**Decision:** Orders become Paid only in the signed webhook handler, never from the success page.
**Reason:** The success page can be skipped, refreshed or faked. Webhooks are signed, and Stripe retries them.

## ADR-009: Resend for transactional email
**Status:** Accepted · 5 Oct 2026
**Decision:** Resend + React Email for every store email, and as Supabase's SMTP server. Clerk sends its own auth emails.
**Reason:** Simple API and React templates. Supabase's built-in sender isn't meant for production (2 emails an hour, team members only).

## ADR-010: Cloudinary behind a media adapter
**Status:** Accepted · 5 Oct 2026
**Decision:** Cloudinary for images for now, used only through `src/services/media`. The database stores keys, not URLs.
**Reason:** Cloudinary will be replaced later (PRD Q19). Swapping providers should touch one module.

## ADR-011: Return photos as private Cloudinary uploads
**Status:** Accepted · 5 Oct 2026
**Decision:** Return photos are `authenticated` Cloudinary uploads in `returns/`, viewed through signed links that expire after 1 hour. Not Supabase Storage.
**Reason:** Team decision to keep all media with one provider. These photos must never be public.

## ADR-012: Manual restock after returns
**Status:** Accepted · 5 Oct 2026
**Decision:** Stock never goes back automatically. The admin adjusts it with a reason.
**Reason:** Client decision. A person checks the item's condition first.

## ADR-013: Manual fulfilment in v1
**Status:** Accepted · 5 Oct 2026
**Decision:** The admin sets Packed and Delivered by hand. No courier integration.
**Reason:** No delivery partner has been chosen yet.

## ADR-014: Money as integer fils
**Status:** Accepted · 5 Oct 2026
**Decision:** Store and calculate money in fils (1 AED = 100 fils).
**Reason:** Avoids floating point errors and matches Stripe's smallest-unit amounts.

## ADR-015: Categories as a table
**Status:** Accepted · 5 Oct 2026
**Decision:** A `categories` table plus `products.category_id`, one category per product, managed in the admin.
**Reason:** The client hasn't chosen the categories yet (PRD Q11). The admin can add or rename them without a developer.

## ADR-016: English website, bilingual invoices
**Status:** Accepted · 5 Oct 2026
**Decision:** The website is English only. Invoices and credit notes are in English and Arabic.
**Reason:** The client wants English only, but UAE rules require Arabic on invoices.

## ADR-017: Gapless invoice numbers
**Status:** Accepted · 5 Oct 2026
**Decision:** Invoice and credit note numbers come from a locked counter row.
**Reason:** Tax documents need sequential numbers, and Postgres sequences can skip.

## ADR-018: Snapshot prices on order lines
**Status:** Accepted · 5 Oct 2026
**Decision:** Copy the product name, variant, price, VAT and final-sale flag onto each order line.
**Reason:** Later edits must never change past orders, invoices or refunds.

## ADR-019: Vercel Pro hosting
**Status:** Accepted · 5 Oct 2026
**Decision:** Host on Vercel Pro.
**Reason:** First-class Next.js hosting with a preview deployment for every pull request. The Hobby plan is for non-commercial use only.

## ADR-020: Guest checkout
**Status:** Proposed, waiting on PRD Q1
**Decision:** Allow guest checkout. Link guest orders to an account when the customer signs up with the same verified email.
**Reason:** About 1 in 5 shoppers who abandon checkout do it because they're forced to create an account (Baymard).

## ADR-021: Supporting libraries
**Status:** Accepted · 5 Oct 2026
**Decision:** Zod (validation), React Hook Form (forms), Zustand (cart state), Tiptap (blog editor), Vitest, Playwright and pgTAP (testing).
**Reason:** Common, well-documented choices that fit Next.js and shadcn/ui. Stops the AI from adding alternatives.

## ADR-022: PDF engine for invoices
**Status:** Open, decided in TASK-062
**Decision:** TBD after a spike on Arabic text shaping and right-to-left layout.
**Reason:** Arabic must render correctly on every invoice and credit note.

## ADR-023: Colours and sizes, with one SKU per colour and size
**Status:** Accepted · 6 Oct 2026
**Decision:** Products have colours picked from a store-wide colour list. Each product colour comes in its own sizes, picked from a store-wide size list. Every colour + size is one `product_variants` row: a SKU with its own stock.
**Reason:** This is how the client stocks clothes: each colour can come in different sizes. Store-wide lists keep names, swatches, filters and SKU codes consistent. Holds, orders, returns and the stock ledger all point at one SKU row, which keeps them simple.

## ADR-024: Photos belong to a colour
**Status:** Accepted · 6 Oct 2026
**Decision:** `product_images` belong to a product colour. Every size of that colour uses the same photos.
**Reason:** Client decision. Photos are taken per colour, so the admin uploads them once, and switching colour swaps the gallery.

## ADR-025: SKU rules
**Status:** Accepted · 6 Oct 2026
**Decision:** SKUs are unique regardless of case and use capital letters, digits and dashes. The admin gets a suggestion, `{style code}-{colour code}-{size code}` (e.g. `ST0012-BLK-M`), and can type the client's own instead (PRD Q23). A SKU locks when it's first sold. SKUs with history are deactivated, never deleted or reused.
**Reason:** Orders, invoices, returns and the stock ledger reference SKUs. Renaming or reusing one would make the history wrong.

## ADR-026: Stock counts stay private
**Status:** Accepted · 6 Oct 2026
**Decision:** Stock lives in `stock_levels`, which visitors and customers can't read. The storefront gets a status per SKU from `variant_availability()`: in stock, low (with the number left at 3 or fewer) or sold out.
**Reason:** Public stock counts reveal sales volumes to anyone. A separate table also keeps the public catalogue reads simple.

## ADR-027: Sentry for monitoring, starting on the free plan
**Status:** Accepted · 6 Oct 2026
**Decision:** Sentry for errors, tracing, logs, session replay on errors, one cron monitor (reconcile checkouts) and one uptime monitor (`/api/health`), on the free Developer plan. This replaces Better Stack from the first draft of the docs.
**Reason:** One tool with a first-class Next.js SDK, and the free plan covers launch traffic. Its limits: one user, email alerts only, 5,000 errors, 50 replays, one cron monitor and one uptime monitor a month, and no pay-as-you-go. Move to Team ($26/mo billed annually) when a second person needs access or a limit is hit.

## ADR-028: Look from the client's reference, themed through shadcn tokens
**Status:** Accepted · 6 Oct 2026
**Decision:** The storefront follows the client's reference: warm off-white, sand panels, black buttons, square corners, Cormorant Garamond and Montserrat. Colours, radius and fonts are CSS variables set by a shadcn preset, and components only use the semantic tokens.
**Reason:** There's no designer yet (PRD Q17). The look can change later with `shadcn apply --only theme,font` without rewriting components.

---

## Template
```markdown
## ADR-0XX: Title
**Status:** Proposed / Accepted / Replaced by ADR-0YY · date
**Decision:** What we decided.
**Reason:** Why.
```
