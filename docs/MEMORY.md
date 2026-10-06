# Project Memory

> The project's current state. Update it after every task. Permanent decisions go in `DECISIONS.md`.

## Current Status
Phase 1 Setup and parts of Phase 11 (Home Page) are underway. Next.js scaffolded, folder structure created, and shadcn/ui installed. Design tokens, icons (Lucide), and fonts configured to match the new Sylvie mockup (Newsreader, Inter, Plum/Cream theme). The storefront layout and home page components have been built and styled.

## Completed
- Research: stack, payments, auth, media, UAE compliance
- Requirements interview with the tech lead
- Project docs: PRD, ARCHITECTURE, DESIGN, RULES, TASKS, DECISIONS, TEST_PLAN, SECURITY, README, `.env.example`, Cursor rules
- Docs update: colours → sizes → SKU model, photos per colour, private stock counts, Sentry instead of Better Stack, design tokens and fonts from the client's reference (ADR-023 to ADR-028)
- Scaffold Next.js project (TASK-001)
- Strict TypeScript, Prettier, path alias (TASK-002)
- Folder structure setup (TASK-003)
- shadcn/ui init with Lyra style and design tokens (TASK-004)
- Home page components and layout according to the new Sylvie design system (TASK-091)

## Current Task
TASK-005 src/lib/env.ts: validate every environment variable with Zod

## Waiting On
- Client answers to Q1 to Q25 in `PRD.md`. Most urgent: Q1 guest checkout, Q2 return window, Q6 delivery fee, Q11 categories, Q15 VAT, Q23 existing SKUs, Q24 sizes and colours
- Product photos per colour (4:5 portrait)
- Commercial sign-off for customer accounts, returns and bilingual invoices (beyond the original proposal)

## Known Issues
- Next.js: another critical security fix is pending upstream. Upgrade as soon as it ships.
- Arabic PDF engine not chosen yet (TASK-062, ADR-022).
- Resend Free caps at 100 emails a day. Switch to Pro before any promotion.
- Sentry free plan: one user, email alerts only, one cron monitor and one uptime monitor, 5,000 errors a month. Upgrade to Team when a second person needs access or a limit is hit.

## Next Step
Implement Zod environment variable validation (TASK-005).

## Log
- 5 Oct 2026: project docs created
- 6 Oct 2026: colour and size variants with unique SKUs, photos per colour, Sentry monitoring, design system from the client's reference; tasks renumbered (112)
- 6 Oct 2026: project scaffolded (Next.js, TS, Tailwind v4, shadcn/ui Lyra preset) and design tokens applied
- 6 Oct 2026: Implemented the storefront home page and updated global typography and theme to match the new Sylvie mockup and plum/gold logo.
