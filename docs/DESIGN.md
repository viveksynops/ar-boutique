# Design System

> DESIGN = how it should look and feel.
> **Source:** the client's reference mockup (shared 6 Oct 2026). We copy its look, not its brand: the logo, name, copy and photos are AR Boutique's own.
> **The theme lives in tokens.** Colours, radius and fonts are CSS variables set by a shadcn preset. Components use the semantic tokens below and never hard-code a colour or a font, so the look can change later without touching components (ADR-028).

## How Theming Works
| Layer | Lives in | Changed by |
|---|---|---|
| Theme tokens (colours, radius) | `src/app/globals.css` (`:root`) | A shadcn preset, or a hand edit |
| Fonts | `src/lib/fonts.ts` (`next/font`) → `--font-sans`, `--font-heading` | A shadcn preset, or one import |
| Our extra tokens (`success`, `warning`) | `src/styles/brand.css` | Hand edit; presets never touch it |
| Primitives (Button, Input, Sheet and so on) | `src/components/ui/` | `shadcn add` or `shadcn apply` only. Never hand-edit |
| Layouts (hero, category circles, product card, pickers) | `src/components/store/`, `src/features/*/components/` | Code. A preset never changes layout |

**Changing the look later**
1. Build a preset on ui.shadcn.com/create and copy its code.
2. `npx shadcn@latest apply --preset <code> --only theme,font` swaps colours, radius and fonts and keeps our components.
3. A full `npx shadcn@latest apply --preset <code>` also reinstalls everything in `src/components/ui/`. That's why those files are never hand-edited.
4. Re-check contrast (WCAG AA), update the tables below and record the new preset code.

**Preset code:** recorded in TASK-004.

## Style
- **Storefront:** warm, minimal, editorial. Off-white page, sand-toned panels, black buttons, square corners, serif headings, small uppercase sans labels with wide letter spacing. Photography does the talking.
- **Admin:** the same tokens with the sans font only. shadcn/ui components, dense and practical.

## Typography
| Role | Font | Token | Weights |
|---|---|---|---|
| Headings, section titles | Cormorant Garamond | `--font-heading` (`font-heading`) | 500, 600 |
| Body, UI, navigation, buttons, prices | Montserrat | `--font-sans` (`font-sans`) | 400, 500, 600 |

These are the closest free Google Fonts to the reference (a classic Garamond-style serif and a wide geometric sans). Both load through `next/font` in `src/lib/fonts.ts`, so swapping one is a one-line change (or `--only font` with a preset).

| Style | Desktop | Mobile | Font | Details |
|---|---|---|---|---|
| Hero title | 64px, line height 1.05 | 40px, 1.1 | Heading 500 | Sentence case, two short lines |
| Promo title | 44px, 1.1 | 32px, 1.15 | Heading 500 | |
| Page title (h1) | 40px, 1.15 | 32px, 1.2 | Heading 500 | Product name uses 32px / 28px |
| Section title | 24px | 20px | Heading 500 | Uppercase, letter spacing 0.08em ("SHOP BY CATEGORY") |
| Body | 16px, 1.6 | 15px, 1.6 | Sans 400 | |
| Small | 13px, 1.5 | 13px | Sans 400 | Footer links, helper text |
| Product name and price | 14px | 13px | Sans 400 (price 500) | |
| Label, eyebrow, navigation, button | 12px | 12px | Sans 500 to 600 | Uppercase, letter spacing 0.1em to 0.14em |

Sizes were measured on the reference and scaled to a 1440px-wide layout. Adjust during the build if something looks off.

## Colours
Sampled from the reference, then adjusted where needed to pass WCAG AA. Paired tokens (`card-foreground`, `secondary-foreground`, `accent-foreground` and so on) use `foreground`.

| Token | Hex | OKLCH | Use |
|---|---|---|---|
| `background` | #FCFBF9 | oklch(0.988 0.003 84.6) | Page |
| `foreground` | #1A1918 | oklch(0.214 0.002 67.7) | Text |
| `card`, `popover` | #FFFFFF | oklch(1 0 0) | Cards, inputs, drawers, menus |
| `primary` | #1A1918 | oklch(0.214 0.002 67.7) | Solid buttons, announcement bar, cart count |
| `primary-foreground` | #FFFFFF | oklch(1 0 0) | Text on `primary` (17.6:1) |
| `secondary`, `muted` | #F5F1ED | oklch(0.960 0.007 67.7) | Trust strip, footer, soft panels, image placeholders, skeletons |
| `muted-foreground` | #6B645E | oklch(0.508 0.013 63.2) | Secondary text: 5.6:1 on the page, 4.6:1 on sand |
| `accent` | #EBE2DB | oklch(0.918 0.014 60.6) | Sand: hero and promo text panels, hover fills |
| `border` | #E3DCD5 | oklch(0.898 0.012 67.7) | Decorative dividers |
| `input` | #8C847D | oklch(0.618 0.014 63.8) | Input, size chip and outline button borders (3.7:1 on white) |
| `ring` | #1A1918 | oklch(0.214 0.002 67.7) | Focus ring |
| `destructive` | #B42318 | oklch(0.500 0.182 29.5) | Errors, reject |
| `success` (brand.css) | #1F7A4D | oklch(0.515 0.110 156.8) | Paid, delivered, refunded |
| `warning` (brand.css) | #8F5B0A | oklch(0.517 0.108 69.9) | Pending, needs attention |

- **Radius:** `--radius: 0`. Square corners everywhere, like the reference.
- Status colours sit on `background` or `card` only (they drop below 4.5:1 on sand).
- No dark mode in v1.

## Layout
- Mobile first. Tailwind breakpoints: `sm` 640, `md` 768, `lg` 1024, `xl` 1280. Test at 375px, 768px and 1440px.
- Container: max width 1280px; side padding 16px on mobile, 24px on tablet, 32px on desktop. The hero runs full width.
- Sections: 48px apart on mobile, 80px on desktop.
- Product grid: 2 columns on mobile, 3 on tablet, 4 on desktop; gap 12px on mobile, 32px on desktop.

## Home Page (from the reference)
| # | Block | What we build |
|---|---|---|
| 1 | Announcement bar | `primary` strip, white uppercase 12px text, centred. Text comes from settings and must match the real policy (e.g. "FREE DELIVERY OVER AED 300 · EASY RETURNS WITHIN 14 DAYS"; Q2, Q6) |
| 2 | Header | Logo left; menu in the centre (New in, the categories, Sale); account and cart with a count on the right. Mobile: menu button, centred logo, cart. No search or wishlist icons in v1 (Q22, Q25) |
| 3 | Hero banner | Full-width photo with the text on its plain side: eyebrow, two-line title, one line of text, primary button. Mobile: photo first, text below. From `banners` (placement hero) |
| 4 | Shop by category | Section title, round category photos (160px on desktop, 96px on mobile) with uppercase labels; up to 6 in a row, swipe on mobile. A Sale circle can link to `/shop?sale=1` (Q25) |
| 5 | New arrivals | The 8 newest products in the product grid, then an outline "View all" button |
| 6 | Trust strip | `secondary` band with 4 line icons: free delivery and easy returns (both from settings), secure payment, and one more line from the client |
| 7 | Promo banner | Photo with the text on an `accent` panel: eyebrow, title, text, button. From `banners` (placement promo) |
| 8 | From the journal | The 3 latest blog posts, in place of the reference's Instagram gallery (Q25) |
| 9 | Footer | `secondary` background: logo, a short brand line, social icons; columns Shop (categories), Customer care (Shipping & delivery, Returns, Contact), About (About, Blog), Legal (Terms, Privacy, Returns & refunds); payment icons for Visa, Mastercard, Apple Pay and Google Pay only (no PayPal: we take Stripe only) |

Left out from the reference: wishlist hearts, the search icon, the newsletter box and the Instagram gallery (out of scope, Q25). Prices are always AED.

## Components

### Buttons
| Variant | Look | Use |
|---|---|---|
| Primary | Solid `primary`, white uppercase 12px label, letter spacing 0.12em | Add to cart, Checkout, Shop now |
| Outline | 1px `input` border, `foreground` label | View all, secondary actions |
| Ghost / Link | Text only, underline on hover | Tertiary actions |
| Destructive | Solid `destructive` (admin only) | Reject, archive, confirm refund |

Storefront buttons are 48px tall (touch targets never below 44px). While submitting, show a spinner and disable the button.

### Product card
Photo (4:5, `muted` placeholder while it loads) → name → price (compare-at price struck through in `muted-foreground`) → colour swatches → badges. The photo is the default colour's main photo; on desktop, hovering shows that colour's second photo. Swatches show which colours exist (up to 4, then "+2"); they aren't separate links, so the whole card stays one link. No wishlist heart in v1.

### Colour picker
Round swatches filled with the colour's `swatch_hex`: 14px on cards, 32px on the product page, with a 1px `border` ring so white and ivory stay visible. Selected: a 2px `foreground` ring with a 2px gap. The colour name always shows next to the picker ("Colour: Black"). A colour with every size sold out stays visible with a diagonal line through it.

### Size picker
Square chips, at least 48 × 48, with a 1px `input` border; selected is solid `primary`. Only the sizes the selected colour comes in, in size order. Sold-out sizes stay visible, greyed and struck through, and can't be selected. "Only N left" shows under the picker when the selected SKU has 3 or fewer. The selected state never relies on colour alone.

### Product page
Not in the reference; it follows the same style.
- **Desktop:** gallery on the left (4:5 main photo and thumbnails), details on the right: name, price, colour picker, size picker, Add to cart (full width), delivery and returns summary, then description and care in an accordion.
- **Mobile:** swipeable gallery with dots, details below, sticky Add to cart bar.
- Changing colour swaps the gallery and the size list. Changing size never changes the photos. If the new colour doesn't come in the chosen size, clear the size and say so.

### Badges
New, Sale, Sold out, Final sale: uppercase 11px on `background` with a 1px `border`, top left of the photo. Order and return statuses use `success`, `warning`, `destructive` and `muted`.

### Forms
Inputs are 48px tall on the storefront and 40px in the admin, with a white `card` background, a 1px `input` border and square corners. Label above the field, helper text below, error text in `destructive` under the field. Mark optional fields, not required ones. Validate on blur and on submit.

### Feedback
- Toasts for admin saves.
- A confirm dialog before destructive admin actions: refund, reject, archive, deactivate staff.
- Skeletons while lists and product grids load.

### Admin tables
shadcn data table: sticky header, search, filters, pagination (25 rows), status badges, and clicking a row opens the detail page. SKUs show in capitals in `font-mono`.

### Admin stock grid
Colours down, sizes across. Each cell shows the SKU, on hand, held and available; low stock in `warning`, zero in `destructive`. Editing a number asks for a reason. On mobile it becomes a list grouped by colour.

## Imagery
- **Product photos:** portrait 4:5, at least 1600 × 2000, plain light backdrop, the same framing for every colour. At least 1 photo per colour, ideally 4 to 6 (front, back, side, detail). Uploaded once per colour; every size of that colour uses them.
- **Category photos:** square 1:1, at least 600 × 600, subject centred (shown as circles).
- **Hero banner:** desktop 8:3 (at least 2400 × 900) with a plain side for the text; mobile 4:5 (at least 1080 × 1350).
- **Promo banner:** desktop 4:1 (at least 2400 × 600) with a plain side for the text; mobile 4:5.
- Always served through the Cloudinary loader with automatic format and quality. The hero image loads with priority; everything else lazy-loads.
- Alt text is required for every image (e.g. "Satin slip dress in black, front").
- Never reuse the reference's photos; they aren't ours.

## UX Requirements
- Mobile responsive everywhere, storefront and admin.
- Loading states: skeletons for content and spinners on buttons. Never a blank screen.
- Empty states: empty cart, no orders, no returns, no products in a category, no products for the chosen filters, empty admin lists. Short copy plus one action.
- Error states: inline field errors, friendly page errors with a retry, custom 404 and 500 pages.
- Accessible forms: labels, `aria-describedby` for errors, keyboard friendly, visible focus.
- Product page on mobile: sticky Add to cart bar.
- Delivery fee and returns information visible before checkout.
- Never lose the cart on an error.
- Show "Only N left" when a SKU has 3 or fewer in stock. Never show exact stock above that.
- Keep the chosen colour in the URL (`?colour=`) so links and the back button work.

## Content and Formatting
- Prices: `AED 1,250`, with 2 decimals only when needed (`AED 249.50`). Always use `formatAED()`.
- Dates: `5 Oct 2026`. Times: `4:30 PM`, shown in UAE time (Asia/Dubai).
- Phone numbers: `+971 50 123 4567`.
- Order numbers `AR-10001`; return numbers `RET-1001`; SKUs like `ST0012-BLK-M`.
- Line items read "Satin Slip Dress, Black / M".
- Tone: warm, short and confident. No jargon.

## Emails
Simple branded layout: logo, `background` colour, black text, one primary button, an order summary table where each line shows the colour's photo, the colour, the size and the SKU, and a footer with contact and policy links. Mobile friendly, 600px max width. Email clients can't read CSS variables or load our fonts reliably, so use the hex values above, Georgia for headings and Arial for body text.

## Still Needed From the Client (Q17)
- AR Boutique logo (SVG, dark and light versions) and a favicon
- The client's OK on this look, and any brand colour they'd like instead of black
- Product, category and banner photos in the sizes above
- Designs for other pages are optional; until they arrive, those pages follow this file
