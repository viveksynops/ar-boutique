# AR Boutique

Online store for AR Boutique, a women's wear brand selling to customers in the UAE. One Next.js app with a customer storefront and an admin dashboard at `/admin`.

## Project Docs
| File | Answers | Stage |
|---|---|---|
| `docs/PRD.md` | What are we building, and why? | Planning |
| `docs/ARCHITECTURE.md` | How will we build it? | Planning |
| `docs/DESIGN.md` | How should it look? | Planning |
| `docs/RULES.md` + `.cursor/rules/` | How should the AI code? | Planning |
| `TASKS.md` | What do we build next? | Development |
| `docs/DECISIONS.md` | Why did we decide this? | Development |
| `docs/MEMORY.md` | Where is the project right now? | Development |
| `docs/TEST_PLAN.md` | How do we verify it? | Testing |
| `docs/SECURITY.md` | How do we protect it? | Development |
| `.env.example` | What configuration is needed? | Setup |

## Tech Stack
Next.js 16 · TypeScript · Tailwind CSS · shadcn/ui · Supabase · Clerk · Stripe · Resend · Cloudflare R2 + sharp · Sentry · Vercel

## Prerequisites
Required:
1. Cursor or VS Code
2. Git and a GitHub account
3. Node.js 24 LTS and npm
4. Docker (runs Supabase locally)
5. Supabase CLI
6. Stripe CLI

Optional: Vercel CLI, GitHub CLI, a database client.

Check your setup:
```bash
node --version
npm --version
git --version
supabase --version
stripe --version
```

## Getting Started
```bash
git clone <repo-url> ar-boutique
cd ar-boutique
npm install
cp .env.example .env.local      # fill in the test keys from the tech lead
supabase start                  # local Postgres + Auth (needs Docker)
npm run db:reset                # migrations + seed data
npm run db:types                # TypeScript types from the database
stripe listen --forward-to localhost:3000/api/webhooks/stripe   # put the signing secret in .env.local
npm run dev
```
- Storefront: http://localhost:3000
- Admin: http://localhost:3000/admin (local admin from `supabase/seed.sql`)
- Sentry stays off locally unless `NEXT_PUBLIC_SENTRY_DSN` is set in `.env.local`.

## Scripts
| Script | Does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm run check:tokens` | Fails if a component hard-codes a colour or a font (see `docs/DESIGN.md`) |
| `npm test` | Unit tests (Vitest) |
| `npm run test:db` | RLS and Postgres function tests (`supabase test db`) |
| `npm run test:integration` | Integration tests (local Supabase + Stripe CLI) |
| `npm run test:e2e` | End-to-end tests (Playwright) |
| `npm run db:reset` | Reset the local database with migrations and seed data |
| `npm run db:types` | Generate TypeScript types from the database |

## Changing the Look
The storefront's colours, radius and fonts are shadcn theme tokens (`docs/DESIGN.md`, ADR-028). To re-theme:
```bash
npx shadcn@latest apply --preset <code> --only theme,font   # colours, radius and fonts; keeps components
npx shadcn@latest apply --preset <code>                     # full preset: also reinstalls src/components/ui
```
Build presets on ui.shadcn.com/create. Never hand-edit `src/components/ui/`, and update `docs/DESIGN.md` after a change.

## Working With AI

### 1. Start every session with
```text
Read the following files before making any changes:
docs/PRD.md
docs/ARCHITECTURE.md
docs/DESIGN.md
docs/RULES.md
docs/DECISIONS.md
docs/MEMORY.md
TASKS.md

Do not modify anything yet.

First:
1. Understand the product.
2. Understand the architecture.
3. Review the design system.
4. Review the development rules.
5. Review the current task in TASKS.md and MEMORY.md.
6. Identify missing information.
7. Explain the implementation plan for the current task.

Do not write code yet.
```

### 2. Then give one task at a time
```text
CONTEXT
We are building AR Boutique. Read docs/PRD.md, docs/ARCHITECTURE.md, docs/RULES.md and docs/SECURITY.md.

TASK
TASK-052: Postgres functions create_pending_order(), mark_order_paid() and release_order().

FILES
supabase/migrations/
supabase/tests/
src/services/db/orders.ts

CONSTRAINTS
- Follow "Checkout and stock hold" in docs/ARCHITECTURE.md exactly.
- Hold stock atomically per SKU and lock stock_levels rows in variant ID order.
- Do not create a second database layer.
- Do not modify unrelated files.

ACCEPTANCE CRITERIA
- Two holds racing for the last unit of a SKU: exactly one succeeds.
- release_order() frees the hold.
- mark_order_paid() deducts stock once, even if it's called twice.
- Customers can read only their own orders.

TESTING
Add pgTAP tests. Run npm run typecheck, npm run lint and npm run test:db.

After implementation, report:
1. Files changed
2. What was implemented
3. Tests executed
4. Remaining issues
```

### 3. Review before merging
```text
Review the implementation against docs/PRD.md, docs/ARCHITECTURE.md, docs/DESIGN.md, docs/RULES.md, docs/TEST_PLAN.md and docs/SECURITY.md.

Check:
- Correctness
- Architecture
- Security
- Error handling
- Accessibility
- Responsive design
- Performance
- Code duplication

Do not modify anything yet. Report all issues first.
```
Then fix the issues one by one.

### 4. When something breaks
```text
ERROR
[paste the error]

EXPECTED BEHAVIOR
[what should happen]

ACTUAL BEHAVIOR
[what happens]

STEPS TO REPRODUCE
1.
2.

CONSTRAINT
Do not change the database schema.

Do not modify code yet. Find the root cause and explain:
1. What is failing?
2. Why is it failing?
3. Which file is responsible?
4. What is the smallest fix?
5. How will we test the fix?
```
Then: "Implement the smallest fix. Do not refactor unrelated code. Run the relevant tests."

## The Loop
```text
READ → UNDERSTAND → PLAN → IMPLEMENT → TEST → REVIEW → FIX → COMMIT → UPDATE DOCS
```
After each task, update `TASKS.md` and `docs/MEMORY.md`, and `docs/DECISIONS.md` if a decision changed.

## Git
```text
main
├── feature/TASK-030-admin-categories
├── feature/TASK-052-checkout-functions
└── fix/mobile-cart-drawer
```
Commit messages: `feat: add admin categories`, `fix: release hold on cancel`, `test: cover webhook replay`, `docs: update memory`.

## Deployment
```text
LOCAL → PREVIEW (every pull request) → QA → PRODUCTION (merge to main)
```
- Every environment has its own keys (see Environments in `docs/ARCHITECTURE.md`).
- Run "Before Deployment" in `docs/TEST_PLAN.md` first, and "Production QA" after every release.
