---
trigger: always_on
---

# Git
- Never run `git add`, `git commit`, `git push`, `git reset`, `git rebase`, `git stash`, `git branch`, `git checkout -b`, `git switch -c` or `gh pr create` unless I ask for it in that message. When I ask for a commit message or a branch name, only write it.
- Never commit `.env*` files except `.env.example`.
- For a commit message, read `git diff --staged` (if nothing is staged, the unstaged changes, and say so). If it mixes unrelated work, suggest splitting it.

## Branch names
Format: `<prefix>/TASK-0xx-short-description`. Leave out the task ID only when there's no task.
- Prefixes: `feature/`, `bugfix/`, `hotfix/` (urgent production fix), `design/` (UI or UX only), `refactor/` (no behaviour change), `test/` (tests only), `doc/` (docs only).
- Lowercase words joined by hyphens (the task ID stays in capitals), no spaces or underscores, under about 50 characters.
- Describe the main change. No generic words like `update`, `changes`, `stuff` or `misc`.
- One branch per task, from the latest `main`. Suggest its name at the start of every task plan.
- Examples: `feature/TASK-012-home-page`, `bugfix/TASK-031-stock-hold-expiry`.

## Commit messages
Format: `<type>(<scope>): <subject>`, a blank line, the body, a blank line, the footer.
- Header required, scope optional. No line over 100 characters.
- Types: `feat`, `fix`, `docs`, `style` (formatting only), `refactor`, `perf`, `test`, `chore` (build, tooling, dependencies).
- Scope: the area changed, e.g. `home`, `cart`, `checkout`, `admin`, `stock`, `db`, `theme`.
- Subject: imperative ("add", not "added" or "adds"), lowercase first letter, no full stop.
- Body: imperative; why the change was made and how it differs from before.
- Footer: `BREAKING CHANGE: <what breaks and how to migrate>`, `Closes #<issue>`, and the TASK-0xx it finishes.
- Revert: `revert: <header of the reverted commit>`, with the body `This reverts commit <hash>.`

## Pull requests
- Only when I say "raise pull request": push the current branch and open a PR into `main` with `gh pr create`. Never merge, close or approve a PR, and never push to `main`.
- First check: everything is committed, the branch is up to date with `main`, and the checks from Testing pass. If not, don't raise it; tell me what's wrong.
- Title: the commit header format (`feat(home): add hero banner`). Body: the headings in `.github/pull_request_template.md` (What, Why, How, Testing, Screenshots, Anything else) in short, explicit sentences. Explain the change before linking the TASK; never just "see TASK-012".
- Testing: commands run with results, manual checks, and untested edge cases with their risk. UI changes: screenshots at 375, 768 and 1440.
- One task per PR; past about 400 changed lines (excluding generated files and lockfiles), suggest splitting. No secrets, keys or customer data anywhere in a PR.
- If `gh` isn't set up, give me the title and body to paste; otherwise reply with the PR link.
