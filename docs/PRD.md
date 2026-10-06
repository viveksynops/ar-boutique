# Product Requirements Document

**Product:** AR Boutique · **Version:** 1.1 (draft) · **Owner:** Vivek VR, Tech Lead (Synops Labs) · **Updated:** 6 Oct 2026

> PRD = WHAT we're building and WHY. How it works is in `ARCHITECTURE.md`.

## Product
AR Boutique: an online store for a women's wear brand selling to customers in the UAE.

- **Storefront** where shoppers browse, buy, track orders and request returns.
- **Admin dashboard** (`/admin`) where the store team runs everything day to day.

"AR" is the brand name. There is no augmented reality feature.

## Problem
The brand needs its own online store. UAE shoppers should be able to browse the collection, pay securely in AED, follow their order and return items easily. The team should be able to manage products, colours, sizes, stock, orders, returns, banners and blog posts without calling a developer.

## Target Users
| User | Who | What they need |
|---|---|---|
| Shopper | Women in the UAE shopping for women's wear, mostly on mobile (assumed) | Browse by category, pick a colour and a size, pay fast with card, Apple Pay or Google Pay, get a clear confirmation, return easily |
| Customer | A shopper with an account | Order history, invoices, return status |
| Store admin | The client's staff (how many: Q12) | One dashboard for catalogue, stock, orders, returns, refunds, banners and blog, on desktop or phone |

## Goal
Launch a fast, search-engine-ready store that sells the catalogue to UAE customers through Stripe, never oversells, handles returns and refunds professionally, and runs without a developer.

## Background
The client's proposal covers: a catalogue of 20 products with size and colour variants, cart and checkout, order confirmation emails to the customer and the store, a search-engine-ready structure, SSL and deployment, Stripe live and tested (Stripe's fees are paid by the client), and an admin backend for products, prices, images, stock, homepage banners, orders and blog posts.

Added during discovery: customer accounts, returns and refunds, admin 2FA and bilingual invoices. These go beyond the proposal, so confirm budget and timeline with the client.

The client shared a design reference on 6 Oct 2026. Its look is captured in `DESIGN.md`.

## Core Features
1. Catalogue: categories, products, colours and sizes (every colour + size is a SKU with its own stock)
2. Cart and checkout with Stripe
3. Customer accounts
4. Orders and order emails
5. Returns and refunds
6. Admin dashboard
7. Content: homepage banners, blog, policy pages
8. Search-engine-ready structure

## Colours, Sizes and SKUs
This is how the client sells clothes, and how the store models them:

- A **product** (for example "Satin Slip Dress") comes in one or more **colours**.
- Each colour comes in **its own sizes**. Black might come in S, M and L while Ivory only comes in M and L.
- Each colour + size is one **SKU** with a unique SKU number and its own stock. That's what the shopper buys and what the admin counts.
- **Photos belong to the colour.** The admin uploads photos once per colour, and every size of that colour uses them.
- Colour names and swatches, and size names and order, come from lists the admin manages, so they stay consistent across the store and its filters.

| Product | Colour (photos) | Size | SKU | Stock |
|---|---|---|---|---|
| Satin Slip Dress | Black (4 photos) | S | ST0012-BLK-S | 3 |
| | | M | ST0012-BLK-M | 0 (sold out) |
| | | L | ST0012-BLK-L | 5 |
| | Ivory (3 photos) | M | ST0012-IVR-M | 2 |
| | | L | ST0012-IVR-L | 1 |

## MVP

### Storefront
**Catalogue**
- CUS-01 Home page (layout in `DESIGN.md`): hero banner, shop by category, new arrivals, promo banner, latest blog posts
- CUS-02 Category pages and Shop all: product grid with colour swatches; filter by size and colour (only options that are in stock); sort by newest and price; a Sale view of products with a compare-at price (Q25); sold-out products show last with a Sold out badge
- CUS-03 Product page: pick a colour and the photos switch to that colour; pick a size from the sizes that colour comes in (sold-out sizes stay visible but disabled); price and compare-at price, "Only N left", Final sale label, delivery and returns summary, Add to cart. A link can open the product in a specific colour.
- CUS-04 Blog list and post pages
- CUS-05 Pages: About, Contact, Terms, Privacy, Returns & Refunds, Shipping & Delivery

**Cart and checkout**
- CUS-10 Cart saved in the browser (no login needed to shop); each line is one SKU and shows the colour's photo, the colour and the size; mini-cart drawer, change quantity, remove
- CUS-11 Delivery fee shown in the cart before checkout
- CUS-12 Check out signed in, or as a guest (Q1)
- CUS-13 Pay on Stripe's hosted page in AED: card, Apple Pay, Google Pay
- CUS-14 Confirmation page and confirmation email with an English/Arabic invoice PDF

**Account**
- CUS-20 Sign up, sign in, sign out, email verification, password reset
- CUS-21 My orders: list, detail, status (Paid → Packed → Delivered), invoice download
- CUS-22 Guest orders show up in the account after signing up with the same verified email

**Returns**
- CUS-30 Return button on eligible delivered orders
- CUS-31 Return form: items and quantity, a reason per item, comment, up to 5 photos
- CUS-32 Return number (e.g. RET-1042), status page, email updates, cancel until the item is received
- CUS-33 Refund email; the money goes back to the original payment method

### Admin Dashboard
**Access**
- ADM-01 Separate login at `/admin/login` with password + authenticator app (2FA); staff join by invite only
- ADM-02 Audit log of every admin change

**Dashboard**
- ADM-10 Orders and revenue (today, 7 days, 30 days), orders to pack, open returns, failed refunds, low-stock SKUs

**Catalogue**
- ADM-20 Categories: create, rename, reorder, hide, and a photo for the Shop by category circles
- ADM-21 Colours and sizes: the store's colour list (name, swatch colour, SKU code) and size list (label, SKU code, display order); create, rename, reorder, hide
- ADM-22 Products: add, edit, archive; price, compare-at price, category, final-sale flag, SEO fields, Draft or Published
- ADM-23 Product colours: add colours to a product, reorder, hide; upload each colour's photos (reorder, alt text, main photo), shared by all its sizes
- ADM-24 Sizes and SKUs: pick the sizes each colour comes in; each colour + size gets a unique SKU (suggested automatically, editable until it's first sold) and an optional price override
- ADM-25 Stock: a colours × sizes grid on each product, plus a Stock page listing every SKU (search, low stock, out of stock); every change needs a reason, and the history is kept
- ADM-26 Find products and order lines by SKU

**Orders**
- ADM-30 Orders list with search (order number, email, SKU) and filters; order detail with items (colour, size, SKU), customer, address and payment
- ADM-31 Mark Packed, then Delivered (this starts the return window); internal notes
- ADM-32 New-order email; download invoice; resend confirmation

**Returns and refunds**
- ADM-40 Returns queue with email alerts; detail with photos and the customer's past returns
- ADM-41 Approve with instructions, or reject with a reason
- ADM-42 Mark received and record each item's condition
- ADM-43 Refund through Stripe: amount prefilled from what was paid, can be lowered, never raised
- ADM-44 Close without refund, with a reason
- ADM-45 Restock shortcut for returned items, back to the same SKU (manual)

**Content and settings**
- ADM-50 Homepage banners: hero and promo, desktop and mobile image, small label, title, text, button, order, on/off
- ADM-51 Blog posts: rich text, cover image, SEO fields, Draft or Published
- ADM-52 Settings: store details, VAT, delivery fee, return window, announcement bar, notification emails, staff

### Emails
| Email | When | To |
|---|---|---|
| Order confirmation + invoice | Payment confirmed | Customer |
| New order | Payment confirmed | Admin |
| Return request received | Return submitted | Customer and admin |
| Return approved (instructions) or rejected (reason) | Admin decides | Customer |
| Refund issued (+ credit note if VAT-registered) | Stripe confirms the refund | Customer |
| Refund failed, payment dispute, order needs attention | Problem detected | Admin |
| Sign-up, verification, password reset | Account actions | Customer |
| Invite, password reset | Staff actions | Admin |

Order emails show each line's colour photo, colour, size and SKU.

## Business Rules
1. **Prices** are in AED. One price per product; a SKU can override it (Q10). If the business is VAT-registered, prices include 5% VAT (Q15).
2. **Colours and sizes:** a product has one or more colours, each colour comes in one or more sizes, and every colour + size is one SKU. Colour and size names come from the admin's lists.
3. **Photos** belong to a colour and are shared by all its sizes. Every visible colour needs at least one photo.
4. **SKUs** are unique across the store and use capital letters, digits and dashes. A SKU can be edited until it's first sold. After that it's locked, and it's never deleted or reused.
5. **Stock** is tracked per SKU. Starting checkout holds the items for about 30 minutes. Stock is deducted only when Stripe confirms payment. An abandoned checkout releases its hold automatically. Shoppers see "in stock", "only N left" or "sold out", never exact stock counts.
6. **Publishing:** a product goes live only when it has a price, at least one visible colour with a photo, and at least one active SKU.
7. **An order is paid** only when Stripe confirms it, never just because the customer reached the success page.
8. **Each order email** is sent exactly once.
9. **Fulfilment** is manual in v1: the admin marks orders Packed, then Delivered.
10. **Returns** are allowed when the order is Delivered, it's inside the return window counted from the Delivered date (Q2), and the item isn't final sale (Q3).
11. **Return reasons:** Too small, Too big, Doesn't match photos, Damaged, Wrong item, Changed my mind, Other. Photos are required for Damaged and Wrong item; a comment is required for Other.
12. **Refunds** happen after the item is received. The amount defaults to what the customer paid for those items (discounts and VAT included) and can be lowered, never raised.
13. **Restocking** after a return is manual, with a reason, back to the same SKU. Stock never goes back automatically.
14. **Return photos** are private: only admins can see them, and they're deleted 90 days after the return closes.
15. **Invoices** are in English and Arabic, and each line shows the colour, size and SKU. If VAT-registered, every refund gets a tax credit note within 14 days (issued automatically).
16. **History is kept:** products, colours and SKUs that appear in past orders are archived or hidden, never deleted. Past orders always show what the customer bought (product, colour, size, SKU) at the price they paid.
17. **Categories:** each product belongs to one category. The client hasn't chosen the list yet (Q11), so the admin manages it.

## Out of Scope (v1)
- Augmented reality or virtual try-on
- Arabic website or right-to-left layout (only invoices are bilingual)
- Cash on delivery, Tabby, Tamara, or any payment method outside Stripe Checkout
- Delivery partner integration, shipping labels, live tracking
- Shipping outside the UAE, currencies other than AED
- Exchanges (Q5), store credit, gift cards
- Discount codes (Q8)
- Wishlist, reviews, loyalty, newsletters (Q25)
- Site search (Q22)
- Instagram feed (Q25)
- Stock sync with a physical shop or Instagram (Q9)
- Mobile apps

## After Launch (not in MVP)
- Size guide per category (Q21)
- Google sign-in
- Customers list in admin
- Cancel an order before delivery with a full refund
- Shipped status with courier and tracking number (once a delivery partner is chosen)
- Delivered email with the return-by date (Q14)
- Banner scheduling (start and end dates)
- Editable policy pages in admin
- Low-stock email alerts

## Success Criteria
A **shopper** should be able to:
1. Open a category and filter by size and colour
2. Pick a colour, see that colour's photos, pick a size, add it to the cart and see the delivery fee
3. Pay with card, Apple Pay or Google Pay
4. Receive exactly one confirmation email with the invoice
5. Sign in later and see the order and its status
6. Request a return with photos and follow it through to the refund

An **admin** should be able to:
1. Log in with 2FA
2. Create a category and a product with two colours, photos for each colour, sizes and stock per SKU, and see it live straight away
3. Get the new-order email and move the order to Packed, then Delivered
4. Approve a return, mark it received, refund it, and restock the SKU manually
5. Change a homepage banner and publish a blog post without a developer

**Launch targets**
- 0 oversold orders
- 100% of paid orders get exactly one customer email and one admin email
- Core Web Vitals "good" on mobile: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1
- 0 developer requests for day-to-day content changes

## Assumptions
- The client is a UAE-registered business with its own UAE Stripe account (Q15).
- About 20 products at launch; the store must still work well with a few hundred.
- A typical product has 1 to 4 colours and 3 to 6 sizes per colour, so up to about 24 SKUs per product.
- Under about 100 orders a day at launch.
- The client provides product photos per colour (portrait 4:5, same framing for every colour), product copy, size charts and policy texts.

## Open Questions
Each question has a default. If there's no answer, build the default and record it in `DECISIONS.md`.

| ID | Question | Default |
|---|---|---|
| Q1 | Guest checkout, or sign-in required? | Allow guest checkout (ADR-020) |
| Q2 | How long is the return window? | 14 days from Delivered, editable in settings |
| Q3 | What counts as final sale? | A per-product flag set by the admin |
| Q4 | How do returns physically come back (drop-off, courier pickup, customer ships), and who pays? | Admin sends instructions with each approval |
| Q5 | Exchanges, or refunds only? | Refunds only |
| Q6 | Delivery fee: flat, free over a threshold, or always free? | Flat fee + optional free-delivery threshold, editable |
| Q7 | Is the delivery fee refunded on returns? | Only for Damaged or Wrong item |
| Q8 | Discount codes in v1? | No |
| Q9 | Is the same stock sold anywhere else (shop, Instagram, WhatsApp)? | The website is the source of truth; the admin logs offline sales as stock changes |
| Q10 | Can the price differ by colour or size? (Photos per colour is decided: ADR-024) | One price per product, with an optional override per SKU |
| Q11 | Which categories? One per product? Subcategories? | Admin-managed flat list, one category per product |
| Q12 | How many admins? Any limited roles? | One admin role for all staff |
| Q13 | Banner and blog details (slider, mobile images, authors)? | Hero slider and one promo banner, each with desktop and mobile images; simple posts |
| Q14 | Email customers when an order is Packed or Delivered? | Delivered email with the return-by date, after launch |
| Q15 | Is the business UAE-registered and VAT-registered (TRN)? | VAT off until confirmed |
| Q16 | Domain name and sender email address? | Needed before launch |
| Q17 | Design: the client's reference is in `DESIGN.md`. Does the client approve it, and when do we get the AR logo? Designs for other pages? | Needed now: logo (SVG). Other pages follow `DESIGN.md` |
| Q18 | Launch date? | TBD |
| Q19 | What replaces Cloudinary, and when? | Must support private files and signed links |
| Q20 | What's in the cropped top of the proposal? | Need the full proposal |
| Q21 | Size guide content? | Size chart per category, after launch |
| Q22 | Is site search needed? | No: category, size and colour filters cover 20 products (the reference's search icon is left out) |
| Q23 | Does the client already have SKU numbers (supplier, shop till or spreadsheet)? | Suggest `{style code}-{colour code}-{size code}`, e.g. `ST0012-BLK-M`; the admin can type the client's own until the SKU is first sold |
| Q24 | Which sizes and colours? Letter sizes (XS to XXL), numbers (UK 6 to 18), abaya lengths (52 to 60), One Size or Free Size? | Seed XS, S, M, L, XL, XXL and One Size; the admin edits both lists |
| Q25 | The reference also shows a Sale link, wishlist hearts, a search icon, a newsletter box and an Instagram gallery. Which are in v1? | Sale link yes (it uses the compare-at price, no new data). The rest stay out of v1 and are left off the page |
