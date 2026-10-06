# Test Plan

> Defines what "working" means. Every task adds or updates the tests for its area.

## Tools and Commands
| Level | Tool | Command |
|---|---|---|
| Type check | TypeScript | `npm run typecheck` |
| Lint | ESLint | `npm run lint` |
| Design tokens | Script (fails on hard-coded colours or font names in components) | `npm run check:tokens` |
| Unit | Vitest | `npm test` |
| Database (RLS, functions) | pgTAP through the Supabase CLI | `npm run test:db` |
| Integration | Vitest + local Supabase + Stripe CLI | `npm run test:integration` |
| E2E | Playwright | `npm run test:e2e` |
| Build | Next.js | `npm run build` |

After every task: typecheck → lint → tokens → unit → DB → integration → E2E (affected flows) → build.

## Test Data
- Seed: 3 categories; colours Black, Ivory and Sand; sizes XS to XL and One Size; 6 products (one in 3 colours with different sizes per colour, one One Size, one single colour); SKUs with stock 0, 1 and 5; one final-sale product; one local admin.
- Stripe test cards:
  - `4242 4242 4242 4242`: payment succeeds
  - `4000 0025 0000 3155`: needs 3D Secure
  - `4000 0000 0000 9995`: declined (insufficient funds)
  - `4000 0000 0000 5126`: refund fails
- Local webhooks: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

## Customer Accounts
- Customer can sign up, verify their email and sign in
- Wrong password shows an error
- Logged-out users can't open `/account/*`
- Customer A can't see customer B's orders, invoices or returns (UI, API and RLS)

## Admin Access
- Admin can log in with a password and an authenticator code
- An admin without 2FA is sent to `/admin/mfa` and can't load any data
- A Clerk customer can't open any `/admin` page or read admin data
- An invited admin can set a password; a deactivated admin is blocked immediately
- Public sign-up is impossible

## Catalogue
- Admin creates a category, colours, sizes and a product with two colours, photos per colour, sizes and stock; the product appears on the storefront on the next load
- A product can't be published without a price, a visible colour with a photo and an active SKU
- Draft and archived products, hidden colours and inactive SKUs never show on the storefront or in the sitemap
- Choosing a colour shows that colour's photos for every size; choosing a size never changes the photos
- `?colour=ivory` renders the Ivory photos in the server HTML; an unknown colour falls back to the default colour
- Only the sizes the chosen colour comes in are shown; sold-out sizes are visible but can't be selected
- Stock is per SKU: selling Black M changes only Black M
- "Only N left" shows at 3 or fewer; availability updates without a redeploy
- A duplicate SKU is rejected in any letter case (form and database)
- A sold SKU can't be renamed or deleted, only deactivated; a used colour or size can only be hidden
- A SKU can't point at another product's colour (database constraint)
- Visitors and customers can't read stock counts, only statuses (pgTAP)
- Size and colour filters only match in-stock SKUs; sold-out products show last with a badge
- A category that still has products can't be deleted
- Every stock change needs a reason and shows in the history

## Cart
- The cart survives a reload; quantities are capped at the SKU's stock and at 5 per line
- The same product in two sizes makes two lines
- A price change, deactivated SKU, hidden colour or unpublished product is flagged and fixed in the cart
- The delivery fee is visible before checkout

## Checkout and Stock
- Successful payment: order Paid, stock deducted, one customer email, one admin email, invoice attached
- Two shoppers, last unit of a SKU: only one gets the hold; the other sees sold out before paying
- Abandoned checkout: the hold is released when the Stripe session expires (test by expiring the session through the API)
- Stripe's back link: the session is expired and the hold released straight away
- Starting checkout twice from the same cart leaves only one hold
- Webhook replay: no double deduction, no duplicate emails
- A price edited in the browser is ignored; Stripe charges the database price
- A declined card leaves the order pending until it expires; no emails are sent
- The success page never marks an order paid by itself
- The reconciliation job fixes a pending order whose webhook was missed

## Orders
- Admin moves an order Paid → Packed → Delivered; the timeline shows each change and who made it
- The customer sees the same status in My orders
- Order lines show colour, size and SKU in the admin, My orders, emails and the invoice
- A guest order appears in the account after signing up with the same verified email, and not with an unverified one
- Invoice PDFs download only for the owner and admins; Arabic text renders correctly

## Returns
- The Return button shows only on Delivered orders inside the window with returnable items
- Final-sale items, undelivered orders and expired windows are blocked, including through direct API calls
- Photos are required for Damaged and Wrong item; a comment is required for Other
- Photos upload to Cloudinary as private files; no public URL works
- A customer can't get an upload signature for someone else's order
- A return number is created and the confirmation and admin alert emails are sent
- The customer can cancel while Requested or Approved, not after Received
- Approve and reject emails include the instructions or the reason
- Approved returns not received within N days expire
- Photos are deleted 90 days after the return closes

## Refunds
- The refund is prefilled with what was paid for those items; it can be lowered with a reason and can't exceed the refundable balance
- The return only changes to Refunded after Stripe confirms
- A failed refund (`4000 0000 0000 5126`) alerts the admin and keeps the return Received
- A credit note is created when VAT is on, and not when VAT is off
- Stock doesn't change after a refund until the admin adjusts it, and the restock goes to the returned SKU

## Content and SEO
- Banner and blog changes show straight away; drafts stay hidden
- Every page has a unique title, description and canonical URL; product canonicals drop `?colour=`
- `sitemap.xml` lists published products, categories, posts and pages; `robots.txt` blocks admin, account, cart and checkout
- Product structured data (ProductGroup with one Product per SKU) passes Google's Rich Results Test

## Monitoring (Sentry)
- A test error from the browser, a Server Component, a Server Action and a Route Handler each reach Sentry with a readable stack trace, the right environment and the release
- Validation errors and sold-out messages aren't reported
- No personal data in events, logs or replays: emails, phone numbers, addresses, cookies and tokens are scrubbed; Replay masks text and inputs and never records `/admin`
- Events still arrive with an ad blocker on (tunnel route), and `proxy.ts` never redirects the tunnel
- The reconciliation job shows OK check-ins; a forced failure sends an alert email
- `/api/health` returns 200, and 503 when the database is unreachable; the uptime monitor alerts
- A daily job with no successful run in 26 hours raises an alert
- Sentry stays off in unit and E2E tests (no DSN)

## Design System
- `npm run check:tokens` passes: no hex colours, arbitrary colour values or font names in components
- The storefront matches `docs/DESIGN.md` at 375px, 768px and 1440px
- Applying another preset with `--only theme,font` re-themes the storefront and admin without code changes (checked once in TASK-004)

## Responsive
Test every page, storefront and admin, at:
- 375px
- 768px
- 1440px

## Accessibility
- Keyboard only: browse, pick a colour and size, add to cart, start checkout, return form, admin forms
- Visible focus, labelled inputs, errors announced, AA contrast
- Colour and size pickers announce the selected and sold-out options to screen readers
- Automated axe checks in Playwright on key pages

## Performance
- Core Web Vitals "good" on mobile for home, category and product pages: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1

## Before Deployment
**Functionality**
- [ ] Customer sign-up, sign-in, sign-out; admin login with 2FA
- [ ] Browse, pick colour and size, cart, checkout, webhook, emails, invoice
- [ ] Admin: categories, colours, sizes, products, colour photos, SKUs, stock, banners, posts
- [ ] Orders, returns and refunds end to end
- [ ] Forms, error handling, loading states, empty states

**UI**
- [ ] Mobile, tablet, desktop
- [ ] Accessibility and keyboard navigation

**Security**
- [ ] Everything in the `SECURITY.md` checklist

**Monitoring**
- [ ] A test error and a test alert reach Sentry from this environment

**Code**
- [ ] Typecheck, lint, tokens, unit, DB, integration and E2E tests pass
- [ ] Production build passes

## Preview QA (every pull request)
- Vercel preview deployment with staging services
- E2E smoke suite against the preview URL
- Manual check of the changed flow on a real phone

## Production QA (after every production deploy)
Live URL → sign up → sign in → browse → pick a colour and size → add to cart → pay → order emails → admin marks Packed and Delivered → return → refund.

Also test:
- Refreshing pages and opening direct URLs (including `?colour=` links)
- Logged-out access to account and admin pages
- Invalid inputs and wrong credentials
- Slow network (browser throttling)
- Empty states (new customer with no orders or returns)
