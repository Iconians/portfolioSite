# M7 — Engineering Portfolio management completion report

**Status:** IMPLEMENTATION COMPLETE / PENDING PRODUCTION E2E  
**Date:** 2026-09-07  
**Scope:** Repository-side management completion (M7). Operator production smoke required before final acceptance.

---

## Summary

M7 moves the Engineering Portfolio **admin project list** to Platform-backed authority while retaining the minimal Prisma navigation bridge for `/admin/portfolio/[id]` routing only.

Platform remains authoritative for shared project/case-study content, presentation, lifecycle, and public reads.

---

## Admin list architecture

### Before M7

- `/admin/portfolio` loaded `getAllPortfolioItems()` from Prisma
- List display fields (title, summary, categories, publish status) came from bridge/legacy Prisma rows
- Bridge placeholder content could appear in admin cards

### After M7

- `/admin/portfolio` and admin dashboard count use `loadAdminPortfolioListItems()`
- **Display authority:** Platform admin `GET /api/v1/admin/case-studies` (paginated)
- **Routing authority:** Prisma bridge `{ id, slug }` only — edit links remain `/admin/portfolio/[bridgeId]`
- Platform list items without a matching bridge slug are skipped (no editor route)

---

## Prisma bridge audit

| Use | Category | Notes |
|-----|----------|-------|
| `createPortfolioNavigationBridge` (M2 create) | **Required temporarily** | Minimal row for `/admin/portfolio/[id]` routing |
| `listPortfolioBridgeRows` (M7 list join) | **Required temporarily** | Slug → bridge id map only |
| `getPortfolioItemById` (editor load, writes) | **Required temporarily** | Resolve slug for Platform identity |
| `resolvePlatformCaseStudyIdBySlug` | **Required temporarily** | Slug → Platform UUID |
| Shared content fields on bridge row | **Not authoritative** | Placeholder values only |
| `getAllPortfolioItems` for admin list | **Retired** | Replaced by Platform-backed loader in platform-api mode |
| `createPortfolioItem` / `updatePortfolioItem` for shared content | **Frozen (M17)** | Not used in platform-api write path |

---

## Platform authority confirmation

| Domain | Authority |
|--------|-----------|
| Shared case-study content | Platform API |
| Presentation (`consumer_settings`, business/engineering scalars) | Platform API |
| Metrics / milestones / media | Platform API |
| Lifecycle (publish/unpublish/archive) | Platform API |
| Engineering public reads | Platform API (`consumer=engineering_portfolio`) |
| DevLaunch public reads | Platform API (`consumer=devlaunch`) — no CRM dependency from Portfolio |
| Admin list display | Platform API (M7) |
| Admin editor routing id | Prisma bridge uuid (transitional) |

---

## Cache / revalidation

Unchanged from M5/M6:

- Platform-api content writes revalidate project detail + homepage (ISR 3600s)
- Membership (publish/unpublish/archive) always revalidates homepage
- No cross-service invalidation added

---

## Validation evidence (local)

- `bun test`: see CI run in plan update
- `npm run lint`: pass
- `npm run ci`: pass (TypeScript, Prisma, production build, static generation)

**Not locally proven:** Cloudflare/R2 production media upload/register behavior — requires deployed operator smoke.

---

## Production smoke checklist (operator — after deployment)

Use the real DevLaunch Platform API project. Do **not** skip deployed verification.

1. Create a project through Engineering Portfolio admin (**Add Project**).
2. Open the newly created editor from the admin list.
3. Add/edit shared project content (title, summary, story fields, categories, links).
4. Add/edit/reorder metrics (including `show_on_business` toggle).
5. Add/edit/reorder milestones (evolution).
6. Upload/manage gallery media through production Cloudflare/R2 (presign → upload → register).
7. Verify gallery ordering on save/reload.
8. Configure **Engineering Portfolio** presentation:
   - Visible on Engineering Portfolio
   - Featured on Engineering Portfolio
   - Display order on Engineering Portfolio
   - Engineering summary override
9. Configure **DevLaunch** presentation:
   - Visible on DevLaunch
   - Featured on DevLaunch
   - Display order on DevLaunch
   - Badge, best for, business outcome, business context note, results narrative
   - Business summary/problem/solution overrides
10. Save and reload admin — confirm values persist from Platform.
11. Publish the project.
12. Verify **Engineering Portfolio** public project page (`/projects/[slug]`).
13. Verify **Engineering Portfolio homepage** featured section and order (after cache/revalidation).
14. Verify **DevLaunch** `/projects` list membership and ordering.
15. Verify **DevLaunch homepage** featured/recent work after normal cache revalidation.
16. Verify public case-study presentation on both consumers (engineering + business projections).
17. Confirm Platform remains authoritative (no Prisma shared-content edits required).
18. Confirm **no CRM source edit/deploy** was required for presentation changes.
19. Confirm **no shared project content** was written to Prisma (bridge row only).
20. Optionally archive the smoke project if appropriate.

---

## M7 implementation files

- `src/lib/project-write/admin-portfolio-list.ts`
- `src/lib/project-write/admin-portfolio-list-mapper.ts`
- `src/lib/project-write/platform-admin-list-pagination.ts`
- `src/lib/project-write/identity-bridge.ts` (shared pagination)
- `src/lib/data/portfolio.ts` (`listPortfolioBridgeRows`)
- `src/app/admin/portfolio/page.tsx`
- `src/app/admin/page.tsx`
- `tests/unit/project-write/platform-m7-admin-list.test.ts`
- `tests/unit/project-write/platform-m7-management-completion.test.ts`

---

## Pending production acceptance

Management-completion **code work** is ready to close pending operator production smoke (steps above), especially Cloudflare/R2 media and cross-site presentation verification.

Do **not** mark the master plan final ACCEPTED/CLOSED until operator production E2E passes.
