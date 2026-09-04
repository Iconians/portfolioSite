# Phase 11 — M4 Metric & Milestone Write Report

**Date:** 2026-09-04  
**Status:** M4 IMPLEMENTED — awaiting acceptance (reorder correction applied)  
**Phase 11:** IN PROGRESS  
**P11-M1 / M2A / M2B / M3:** ACCEPTED / CLOSED  
**P11-M4:** IMPLEMENTED — awaiting acceptance  
**P11-M5+:** NOT STARTED / NOT AUTHORIZED

## Authoritative API contract verified

Verified against `devlaunch-platform-api`:

- `docs/consumers/v1/integration-guide.md`
- `app/schemas/admin.py` — `MetricCreateRequest`, `MetricUpdateRequest`, `MilestoneCreateRequest`, `MilestoneUpdateRequest`, `AdminMetric`, `AdminMilestone`
- `tests/api/test_admin_case_studies.py` — CRUD round trips

### Metrics

| Operation | Route | Method | Response |
|-----------|-------|--------|----------|
| Create | `/api/v1/admin/case-studies/{caseStudyId}/metrics` | POST | 201 `AdminMetric` |
| Update | `/api/v1/admin/metrics/{metricId}` | PATCH | 200 `AdminMetric` |
| Delete | `/api/v1/admin/metrics/{metricId}` | DELETE | 204 |

### Milestones (Portfolio project versions)

| Operation | Route | Method | Response |
|-----------|-------|--------|----------|
| Create | `/api/v1/admin/case-studies/{caseStudyId}/milestones` | POST | 201 `AdminMilestone` |
| Update | `/api/v1/admin/milestones/{milestoneId}` | PATCH | 200 `AdminMilestone` |
| Delete | `/api/v1/admin/milestones/{milestoneId}` | DELETE | 204 |

**Scope:** `content:write` for all mutations.

### Reorder — Platform API contract

**No atomic/batch reorder endpoint exists.**

Verified contract exposes only per-child PATCH with optional `sort_order`. There is no:

- batch reorder endpoint
- transaction-like reorder operation
- atomic swap endpoint

## Portfolio child CRUD inventory

| UI | Server action | Database mode | Platform-api mode |
|----|---------------|---------------|-------------------|
| MetricEditor add | `createPortfolioMetricAction` | Prisma create | Platform POST metric |
| MetricRow save | `updatePortfolioMetricAction` | Prisma update | Platform PATCH metric |
| MetricRow delete | `deletePortfolioMetricAction` | Prisma delete | Platform DELETE metric |
| MetricRow reorder | `reorderPortfolioMetricAction` | Prisma swap `displayOrder` | **Blocked — unavailable** |
| Evolution add | `createProjectVersionAction` | Prisma create | Platform POST milestone |
| EvolutionRow save | `updateProjectVersionAction` | Prisma update | Platform PATCH milestone |
| EvolutionRow delete | `deleteProjectVersionAction` | Prisma delete | Platform DELETE milestone |
| EvolutionRow reorder | `reorderProjectVersionAction` | Prisma swap `sortOrder` | **Blocked — unavailable** |

## Field mapping

### Metric

| Portfolio | Platform create/update |
|-----------|------------------------|
| `label` | `label` |
| `value` | `value` |
| `description` | `description` (null when empty) |
| `displayOrder` | `sort_order` |
| — | `show_on_business: true` on create (see below) |

### Milestone / ProjectVersion

| Portfolio | Platform create/update |
|-----------|------------------------|
| `year` | `year` |
| `version` | `version` |
| `title` | `title` |
| `description` | `description` (null when empty) |
| `sortOrder` | `sort_order` |

## Identity model

```
portfolioLocalId
  → Prisma bridge slug
  → Platform case-study UUID (parent)
  → Platform metric/milestone UUID (child)
```

- Admin load uses Platform admin detail `metrics[]` / `milestones[]` with real UUIDs
- Public read mapper still uses synthetic IDs (unchanged)
- Child update/delete verifies child belongs to server-resolved parent case study

## Admin load changes (M2B correction)

`PROJECT_WRITE_SOURCE=platform-api`:

- Metrics/milestones loaded from Platform admin detail (not Prisma)
- Real Platform child UUIDs preserved through mapper → ProjectEditor

`PROJECT_WRITE_SOURCE=database`:

- Unchanged Prisma load

Media `mutationCompat` unchanged (M6).

## No dual-write

Platform-api child writes do not touch Prisma metric/project-version tables.

## Prisma snapshot / rollback risk

Existing Prisma child rows remain as rollback snapshot data but are **not updated** in platform-api mode. Rolling back `PROJECT_WRITE_SOURCE=database` after Platform child writes may expose stale local metrics/milestones. Documented for M9 cutover operations.

## Reorder decision (acceptance correction)

### Pre-correction behavior (rejected)

**Metrics** (`reorderPortfolioMetricViaPlatform`):

1. Load Platform case-study detail; map metrics; select current + adjacent via `getMetricReorderPair`
2. PATCH current metric `sort_order` → adjacent value
3. PATCH adjacent metric `sort_order` → current value
4. If PATCH 1 succeeded and PATCH 2 failed → duplicate/conflicting `sort_order` values (partial failure)

**Milestones** (`reorderProjectVersionViaPlatform`): identical two-PATCH swap pattern.

This sequential HTTP swap was **rejected** because M4 authorization required reorder to be deferred/blocked when safe atomic or batch semantics are unavailable. Partial-failure risk is **not** equivalent to Prisma: Prisma swaps run in application code against a single database; Platform has no compensating transaction.

### Corrected behavior

| Mode | Metric reorder | Milestone reorder |
|------|----------------|-------------------|
| `database` | Prisma swap `displayOrder` (unchanged) | Prisma swap `sortOrder` (unchanged) |
| `platform-api` | **Unavailable** — no PATCH, no Prisma | **Unavailable** — no PATCH, no Prisma |

**Server guard:** `assertPlatformChildReorderAllowed()` runs at the start of `reorderPortfolioMetricAction` / `reorderProjectVersionAction` before any Platform or Prisma mutation.

**User message:** `"Reordering is temporarily unavailable while Platform write migration is in progress."`

**UI guard:** `shouldDisableChildReorder(writeSource)` hides Move up/down controls in `MetricRow` and `ProjectEvolutionRow` when `writeSource === "platform-api"`.

### Future reorder capability (deferred — not assigned to M5)

Reorder remains a bounded remaining capability requiring one of:

- atomic/batch Platform reorder contract (new API design — report only, not implemented here)
- explicit product decision that ordering is no longer editable in platform-api mode
- later authorized implementation milestone

This does **not** block metric/milestone CRUD migration.

## show_on_business investigation

**Conclusion: A — Intentional domain invariant**

| Evidence | Finding |
|----------|---------|
| Portfolio Prisma schema | No `show_on_business` column on `portfolio_metrics` |
| Portfolio admin UI | No field to toggle business visibility |
| Platform `MetricCreateRequest` | `show_on_business` optional, defaults to `True` in API schema |
| Platform migration semantics | Portfolio-sourced metrics are business-visible by default |
| Engineering vs business projection | Engineering projection shows all metrics; business projection filters `show_on_business=True` |
| Mapper | `buildPlatformMetricCreateRequest` sets `show_on_business: true` explicitly |

Portfolio-created metrics are always intended to appear on the business-facing case study. Explicit `true` matches Platform default and preserves correct behavior if the API default ever changes. **No UI scope added; value unchanged.**

## Public cache

Admin revalidation after child mutations. Public ISR unchanged until M7.

## Files created

| File | Purpose |
|------|---------|
| `platform-metric-types.ts` | Metric request/response types |
| `platform-metric-mapper.ts` | Metric mapping |
| `platform-metric-write.ts` | Metric Platform orchestration (CRUD only) |
| `platform-milestone-types.ts` | Milestone request/response types |
| `platform-milestone-mapper.ts` | Milestone ↔ ProjectVersion mapping |
| `platform-milestone-write.ts` | Milestone Platform orchestration (CRUD only) |
| `platform-parent-context.ts` | Trusted parent resolution |
| `platform-api-admin-request.ts` | Shared admin HTTP transport |
| `platform-api-admin-child-client.ts` | Metric/milestone HTTP methods |
| `platform-child-reorder-policy.ts` | Reorder guard + UI disable helper |
| `tests/unit/project-write/platform-metric-mapper.test.ts` | Metric mapper tests |
| `tests/unit/project-write/platform-milestone-mapper.test.ts` | Milestone mapper tests |
| `tests/unit/project-write/platform-child-write-source-routing.test.ts` | Source routing tests |
| `tests/unit/project-write/platform-child-reorder-policy.test.ts` | Reorder policy tests |

## Files modified

| File | Change |
|------|--------|
| `platform-admin-types.ts` | Admin metric/milestone types with IDs |
| `platform-admin-mapper.ts` | Real Platform child ID mapping |
| `admin-project-load.ts` | Remove Prisma child load in platform-api mode |
| `platform-api-admin-client.ts` | Child CRUD methods |
| `platform-action-errors.ts` | Map reorder-unavailable error |
| `portfolio-metrics.ts` | Source routing; reorder guard |
| `portfolio-versions.ts` | Source routing; reorder guard |
| `MetricRow.tsx`, `MetricEditor.tsx` | `disableReorder` prop; parent-scoped update |
| `ProjectEvolutionRow.tsx`, `ProjectEvolutionEditor.tsx` | `disableReorder` prop; parent-scoped update |
| `ProjectEditor.tsx` | Pass `disableReorder` from `writeSource` |
| `platform-admin-mapper.test.ts` | Platform child ID assertions |
| `platform-api-admin-client.test.ts` | Child client tests |
| `platform-action-errors.test.ts` | Reorder error mapping |

## Production cutover

`PROJECT_WRITE_SOURCE` production value unchanged. M9 owns cutover.

## Validation

| Check | Result |
|-------|--------|
| `bun test tests/unit/project-write/` | 95 pass |
| Reorder / child-write / M3 regression tests | 49 pass (targeted) |
| Full test suite | 264 pass, 1 skip |
| ESLint | pass |
| `tsc --noEmit` | pass |
| `npm run build` | pass |
