---
trigger: always_on
---

# Catalogue, stock and the client's data
Applies to `src/features/catalog/**`, `src/services/db/catalog*`, `src/services/sheets/**`, `src/lib/sku.ts` and the catalogue migrations in `supabase/**`.

## The client's data (ADR-029)
- The client's stock sheet is the source. SKUs, style codes, product names, colour and size names, details, descriptions and prices are stored and shown exactly as written.
- Never generate, suggest, tidy or fix them: no trimming, no case changes, no spelling fixes, no merging of similar names, no rounding, no default SKUs or style codes.
- If a value looks wrong, return an error or a warning with the row and the reason. Never change the value.
- Only our own values are made by code: IDs, slugs, fils (AED x 100) and the stock ledger.

## Model
- Product, then colourway (`product_colours`), then SKU (`product_variants`), then stock (`stock_levels`). One SKU = one colourway in one size, or with no size.
- Every colourway has the client's style code (required, not unique) and `details` (JSON keyed by the sheet's detail headers, checked by `colourwayDetailsSchema`).
- Price and compare-at price live on the SKU. Products have no price.
- Cart lines, holds, order lines, returns and stock changes reference the SKU.
- Photos belong to a product colour; product photo keys must sit inside `products/{productId}/{productColourId}/`.

## SKUs (ADR-025)
- The client's SKU exactly as written, unique ignoring letter case. `src/lib/sku.ts` only checks (not blank, at most 64 characters, no space at the start or end, no line breaks). It never generates or suggests.
- Locked once `first_sold_at` is set. Deactivate, never delete or reuse.
- Colours, sizes, product colours and SKUs with history are hidden, never deleted.

## Stock
- Stock lives in `stock_levels`. Visitors and customers never read it; they get statuses from `variant_availability()`.
- Lock `stock_levels` rows in variant ID order inside one transaction.
- Every change goes through `adjust_stock()` or a Postgres function, with a reason and a ledger row.

## Stock sheet upload (ADR-032)
- Read the client's own sheet; find columns by their exact header names, in any order. Ignore unknown columns and list them as not used.
- Row checks live in `features/catalog/import/validate.ts` (pure functions, unit tested). The errors and warnings are listed in `docs/ARCHITECTURE.md`, "Stock sheet upload".
- The preview never writes catalogue data. `apply_catalogue_import()` re-checks everything and applies all rows or none.
- Rows match on SKU ignoring letter case. An empty cell changes nothing. SKUs missing from the sheet are listed, never deleted or set to zero. The same file twice changes nothing.
- Rows that disagree are an error naming both rows. Never pick one.
- Export writes the same headers with every value as stored, as text cells. Export, then upload, changes nothing.
