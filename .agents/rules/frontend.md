---
trigger: always_on
---

# Frontend
Applies to `src/app/**/*.tsx`, `src/components/**/*.tsx` and `src/features/**/components/**/*.tsx`.

## Pages and components
- Follow `docs/DESIGN.md`: theme tokens only (`bg-primary`, `text-muted-foreground`, `border-input`, `font-heading` and the rest listed there). No hex codes, arbitrary colour values, font names or invented radii (`npm run check:tokens` fails on them).
- shadcn/ui first, reusable always: see Components below.
- Server Components by default. Add `"use client"` only for interaction.
- Components never call Supabase, Stripe, Resend or R2. Call Server Actions from `features/<domain>/actions.ts`.
- Forms use React Hook Form with the Zod schema from `features/<domain>/schemas.ts`.
- Every screen is responsive (375 / 768 / 1440) and has loading, error and empty states.
- Accessibility: labels, `aria-describedby` for errors, keyboard support, visible focus, alt text on every image; pickers announce selected and sold-out options.
- Images use `next/image` with our media loader (`src/lib/media-loader.ts`). Pass media keys, never URLs. Files in `public/` (logo, icons) use `unoptimized`.
- Prices always go through `formatAED()` from `src/lib/money.ts`. Never format money by hand.
- The cart lives in the Zustand store in `features/cart`, one line per SKU. Never calculate payment totals in the browser.
- Disable submit buttons and show a spinner while an action runs.

## Product page and catalogue UI
- Colour first (it swaps the photos and Details), then size (it never changes the photos). Keep the colour in `?colour=`.
- Show the colour picker only when the product has more than one visible colourway, and the size picker only when the colourway has more than one active SKU. A single option is selected automatically.
- Show only the sizes that colour comes in; sold-out sizes stay visible but disabled.
- Never show stock counts, only "Only N left" at 3 or fewer.
- Show the client's values (SKU, style code, colour and size names, details, description) exactly as stored. Never change their case or spelling, in code or with CSS (`uppercase`, `capitalize`). Hide only empty and `-` values, with the helper in `features/catalog/details.ts`.
- Product cards show "From AED ..." when a product's SKUs have different prices.
- Admin SKU fields are never prefilled or suggested. The admin types the client's SKU and style code.

## Checkout UI
- One delivery details form for both payment methods, then the payment choice (`docs/DESIGN.md`, Checkout page).
- Whether cash on delivery is offered comes from the server (`getCodEligibility()`). When it isn't, show the option disabled with the reason. Never decide eligibility, fees or totals in the browser.

## Components
- Before creating a component, check in this order: `src/components/ui`, then the shadcn registry (`npx shadcn@latest add <name>`: card, badge, sheet, carousel, table and so on), then our existing components. Build new only when nothing fits. Every plan lists the components it reuses and each new one with its reason.
- Build on primitives: a product card is `Card` + `Badge` + `next/image`, not a new styled `div`. Restyle through `className` or `cva` variants in a wrapper. Never hand-edit `src/components/ui` or copy its markup.
- Adding a shadcn component needs no approval, unless it installs a new npm package (e.g. carousel adds Embla): ask first.
- Where components live:
  - `src/components/ui/`: shadcn only
  - `src/components/store/`: shared storefront pieces (`StoreButton`, `Container`, `SectionHeading`, `Price`)
  - `src/components/admin/`: shared admin pieces (`PageHeader`, `DataTable`, `StatusBadge`)
  - `src/features/<domain>/components/`: used by one domain only. Once a second domain needs it, move it to a shared folder.
- Pages (`src/app/**/page.tsx`) fetch data and compose components; no repeated markup in pages.
- One job per component, typed props, content passed in as props (never hard-coded copy or data). Split files over about 150 lines.
