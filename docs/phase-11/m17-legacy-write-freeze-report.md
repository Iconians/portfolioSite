# Phase 11 — M17 Legacy Portfolio Shared-Content Write Freeze

**Date:** 2026-09-05  
**Status:** M17 IMPLEMENTED — READY FOR OPERATOR ACCEPTANCE  
**P11-M1–M16:** ACCEPTED / CLOSED (per operator authorization record)  
**P11-M17:** IMPLEMENTED — awaiting operator acceptance  
**M18:** NOT AUTHORIZED  
**V1 closure:** NOT AUTHORIZED  
**Legacy data deletion:** NOT PERFORMED

---

## Purpose

M17 freezes **legacy Prisma writes** for shared project/case-study content now canonically owned by DevLaunch Platform API.

M17 is **not**:

- deletion of legacy Portfolio data
- removal of the Portfolio database
- removal of database **read** rollback
- freeze of Portfolio-local content (articles, reviews, auth)
- M18 or V1 closure

After M17:

```
Engineering Portfolio admin
        ↓
Platform admin API
        ↓
canonical shared project/case-study content
```

Legacy Portfolio project rows remain a **read-only snapshot** for rollback and reconciliation.

---

## Write-path classification (pre-change inventory)

| Path | Class | M17 outcome |
|------|-------|---------------|
| `updatePortfolioAction` (scalars/collections) | A — SHARED | Platform PATCH only; Prisma branch removed |
| `createPortfolioAction` | D — DEFERRED | Remains blocked (no Platform create) |
| `deletePortfolioAction` (hard delete) | C — ALREADY DISABLED | Remains blocked |
| Metric CRUD (`portfolio-metrics.ts`) | A — SHARED | Platform only; Prisma branch removed |
| Metric reorder | D — DEFERRED | Remains blocked in platform mode |
| Milestone CRUD (`portfolio-versions.ts`) | A — SHARED | Platform only; Prisma branch removed |
| Milestone reorder | D — DEFERRED | Remains blocked |
| Lifecycle publish/unpublish/archive | A — SHARED | Platform only (was already platform-gated) |
| Platform media presign/register/PATCH/DELETE | A — SHARED | Platform only (was already platform-gated) |
| Gallery reorder | D — DEFERRED | Remains blocked |
| Admin editor load (`admin-project-load.ts`) | A — SHARED read for edit | Platform admin load only; Prisma editor branch removed |
| Prisma `data/portfolio.ts` writers | A — LEGACY | Retained in codebase but **unreachable** from server actions |
| Articles (`articles.ts`) | B — PORTFOLIO-LOCAL | **Unchanged** |
| Reviews (`reviews.ts`) | B — PORTFOLIO-LOCAL | **Unchanged** |
| Media library (`media.ts`, `/api/media/*`) | B — PORTFOLIO-LOCAL | **Unchanged** |
| Auth/session | B — PORTFOLIO-LOCAL | **Unchanged** |

---

## Platform replacements confirmed

All frozen Category A paths have accepted Phase 11 Platform replacements:

| Capability | Platform path |
|------------|---------------|
| Project scalars/collections | `PATCH /api/v1/admin/case-studies/{id}` |
| Metrics | POST/PATCH/DELETE admin metric routes |
| Milestones | POST/PATCH/DELETE admin milestone routes |
| Publish/unpublish/archive | POST lifecycle routes |
| Media | presign → register → PATCH/DELETE |

Project **create** remains deferred (M9 Option B preserved).

---

## Configuration behavior after M17

### Write source (frozen)

| `PROJECT_WRITE_SOURCE` | Result |
|------------------------|--------|
| `platform-api` | **Required** — only supported write source |
| unset | **Rejected** — `ProjectSourceConfigurationError` |
| `database` | **Rejected** — legacy write frozen |
| invalid | **Rejected** |

### Read source (rollback retained)

| `PROJECT_READ_SOURCE` | Result |
|-----------------------|--------|
| unset | `database` (local default / snapshot read) |
| `database` | **Allowed** — read rollback from frozen Neon snapshot |
| `platform-api` | **Allowed** — canonical public/admin read via API |
| invalid | **Rejected** |

### Supported steady states

| Read | Write | Use |
|------|-------|-----|
| `platform-api` | `platform-api` | Normal production |
| `database` | `platform-api` | Public read rollback while writes stay canonical on Platform |
| unset | `platform-api` | Local dev (read defaults to database snapshot) |

**No** `database/database` pair. **No** silent Prisma write fallback.

---

## Code changes

| File | Change |
|------|--------|
| `src/lib/project-source/coherence.ts` | M17 policy: write must be `platform-api`; read independent |
| `src/lib/project-write/platform-write-freeze-policy.ts` | Freeze constants/helpers |
| `src/lib/project-write/provider.ts` | Remove database write provider branch |
| `src/lib/actions/portfolio.ts` | Platform update only; create/delete remain blocked |
| `src/lib/actions/portfolio-metrics.ts` | Platform metric writes only |
| `src/lib/actions/portfolio-versions.ts` | Platform milestone writes only |
| `src/lib/actions/portfolio-lifecycle.ts` | Platform lifecycle only |
| `src/lib/actions/portfolio-media.ts` | Platform media only (simplified guards) |
| `src/lib/project-write/admin-project-load.ts` | Platform admin editor load only |
| `src/lib/project-write/platform-create-policy.ts` | Updated unavailable message |
| `.env.example` | Documents frozen write requirement |
| `tests/unit/project-source/coherence.test.ts` | M17 matrix |
| `tests/unit/project-write/platform-m17-write-freeze.test.ts` | Freeze invariants |
| Updated routing/M7/M9/admin-preview tests | Reflect frozen writes |

**Not deleted:** Prisma models, `data/portfolio.ts`, portfolio service helpers — retained as read/rollback infrastructure only.

---

## Portfolio-local writes confirmed unaffected

- Article CRUD/publish (`src/lib/actions/articles.ts`)
- Review CRUD (`src/lib/actions/reviews.ts`)
- Portfolio media library (`src/lib/actions/media.ts`, `/api/media/presign`, `/api/media/complete`)
- Auth/session persistence

No global Prisma write disable was introduced.

---

## Validation results

| Check | Result |
|-------|--------|
| `bun test` | **360 pass**, 1 skip, 0 fail |
| `npm run lint` | **Clean** |
| `npx tsc --noEmit` | **Clean** |
| `npm run build` | **Pass** with `PROJECT_READ_SOURCE=database` + `PROJECT_WRITE_SOURCE=platform-api` |

---

## Rollback / recovery implications

**To restore legacy Prisma shared writes:** requires a **code rollback** to pre-M17 (reverting freeze policy and action branches). Setting `PROJECT_WRITE_SOURCE=database` alone is **no longer sufficient** — M17 rejects it at configuration resolution.

**Read rollback without write rollback:** set `PROJECT_READ_SOURCE=database` while keeping `PROJECT_WRITE_SOURCE=platform-api`. Public pages read frozen Neon snapshot; admin edits continue to Platform API. Snapshot will diverge from Platform over time (expected).

**No legacy rows were deleted.** Neon portfolio tables remain intact.

---

## Operator follow-up

- Review diff and validation evidence before marking M17 **ACCEPTED/CLOSED**
- Update authoritative Platform API acceptance record from Platform API repo (per operator process)
- **M18** requires separate explicit operator authorization

---

## Final recommendation

**M17 STATUS: READY FOR OPERATOR ACCEPTANCE**

No code/architecture blockers identified. Deferred capabilities (Platform create, child reorder) remain intentionally unavailable.
