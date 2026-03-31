---
name: append warning fixes
overview: Append a final section to the existing alignment plan to address the runtime warnings from terminal output, only where actionable and worth fixing.
todos:
  - id: append-image-warning-task
    content: Append plan item to fix Next.js Image aspect-ratio warnings in About page.
    status: pending
  - id: append-db-ssl-warning-task
    content: Append plan item to track explicit PostgreSQL sslmode configuration decision and rollout checks.
    status: pending
isProject: false
---

# Add warning-fix appendix to alignment plan

## What to add at the end of the plan

- Append a new section after `Out of scope / decisions to confirm later` in [/Users/claytoncripe/Desktop/Personal projects/portfolioSite/.cursor/plans/align_codebase_with_rules.mdc_7c03405c.plan.md](/Users/claytoncripe/Desktop/Personal projects/portfolioSite/.cursor/plans/align_codebase_with_rules.mdc_7c03405c.plan.md).
- Add one actionable item for Next.js image warnings seen in terminal logs:
  - In [/Users/claytoncripe/Desktop/Personal projects/portfolioSite/src/app/About/page.tsx](/Users/claytoncripe/Desktop/Personal projects/portfolioSite/src/app/About/page.tsx), update shield/logo `Image` usage to keep aspect ratio when CSS changes only one dimension (set `style` with `height: "auto"` or `width: "auto"` as appropriate).
- Add one decision item for PostgreSQL SSL warning from connection parsing:
  - Document that the warning comes from DB connection string SSL mode aliasing.
  - Add a follow-up task to standardize DB URL SSL params (prefer explicit `sslmode=verify-full`, or choose libpq-compatible mode intentionally) in environment/config docs and deployment secrets.

## Why these belong in the plan

- The image warning is a direct UI/runtime correctness warning and is low-risk to fix.
- The SSL warning is environment/security configuration related; it should be tracked explicitly but implemented carefully per deployment constraints.

## Validation to include in that appended section

- Re-run `bun run dev` and navigate to `/About`; confirm no Next.js image aspect-ratio warnings.
- Re-run `bun run build`; confirm no new build/type errors.
- Verify DB connectivity remains functional after any SSL-mode change in non-local environments before rollout.

