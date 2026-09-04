# Phase 11 — M5 Lifecycle Write Report

**Date:** 2026-09-04  
**Status:** M5 IMPLEMENTED — awaiting acceptance  
**Phase 11:** IN PROGRESS  
**P11-M1 / M2A / M2B / M3 / M4:** ACCEPTED / CLOSED  
**P11-M5:** IMPLEMENTED — awaiting acceptance  
**P11-M6+:** NOT STARTED / NOT AUTHORIZED

## Authoritative Platform lifecycle contract

Verified against `devlaunch-platform-api`:

- `docs/consumers/v1/integration-guide.md` §F
- `app/api/v1/admin/case_studies/lifecycle.py`
- `app/services/case_study_admin/lifecycle.py`
- `tests/api/test_admin_case_studies.py`

| Operation | Route | Method | Scope | Response |
|-----------|-------|--------|-------|----------|
| Publish | `/api/v1/admin/case-studies/{id}/publish` | POST | `content:write` | 200 `AdminCaseStudyDetail` |
| Unpublish | `/api/v1/admin/case-studies/{id}/unpublish` | POST | `content:write` | 200 `AdminCaseStudyDetail` |
| Archive | `/api/v1/admin/case-studies/{id}/archive` | POST | `content:archive` | 200 `AdminCaseStudyDetail` |

**Not available in Platform V1:**

- unarchive / restore
- hard delete case study
- sunset lifecycle value

### Platform lifecycle state model

Independent dimensions:

| Field | Values | Set by |
|-------|--------|--------|
| `publish_status` | `draft`, `published` | publish / unpublish |
| `lifecycle_status` | `active`, `completed`, `archived` | archive (and create default) |
| `archived_at` | timestamp or null | archive |
| `published_at` | timestamp or null | publish (preserved on unpublish) |

**Publish** sets `publish_status=published`; sets `published_at` if null; does not change `lifecycle_status` or `archived_at`.

**Unpublish** sets `publish_status=draft`; does not clear `published_at`; does not archive.

**Archive** sets `archived_at` and `lifecycle_status=archived`; does **not** change `publish_status`.

Operations are idempotent (repeated calls succeed).

### Public visibility (Platform authoritative)

Public reads require:

- `publish_status == published`
- `archived_at IS NULL`

(Source: `app/db/repositories/case_study_public_reads.py`)

Archived-but-published records are **not** publicly visible.

## Portfolio lifecycle inventory (pre-M5)

| Control | Path | Database behavior |
|---------|------|-------------------|
| Lifecycle status dropdown | `OverviewSection` → Save | Prisma `lifecycle_status` enum (`active`, `archived`, `sunset`) |
| Publish status dropdown | `OverviewSection` → Save | Prisma `publish_status` (`draft`, `published`) |
| Hard delete | `PortfolioList` → `deletePortfolioAction` | Prisma `portfolio.delete` cascade |
| Public visibility | `canViewProjectDetail` | `publishStatus === "published"` only |
| Lifecycle on public site | — | **Not used** for filtering/display |

No dedicated publish/unpublish/archive actions existed before M5.

## State-mapping matrix

| Portfolio state | Platform equivalent | Mapping | Public visible (Portfolio DB) | Public visible (Platform) | M5 platform-api UI |
|-----------------|---------------------|---------|----------------------------|---------------------------|-------------------|
| `publishStatus=draft` | `publish_status=draft` | Lossless | No | No | Unpublish N/A; Publish available |
| `publishStatus=published` | `publish_status=published` | Lossless | Yes | Yes if not archived | Publish N/A; Unpublish available |
| `lifecycleStatus=active` | `lifecycle_status=active` | Lossless | N/A (not filtered) | N/A | Read-only label |
| `lifecycleStatus=archived` | `lifecycle_status=archived` + `archived_at` | Lossless | N/A | No (archived_at gate) | Archive unavailable when archived |
| `lifecycleStatus=sunset` | **None** | Lossy / unsupported | N/A | Migrated to `active` historically | **Unavailable** — no transition |
| Hard delete | **None** | Unsupported | Removes row | N/A | **Blocked** — use Archive |

## M5 implementation

### Source routing

| Action | `database` | `platform-api` |
|--------|------------|----------------|
| Save project content | Prisma (includes lifecycle dropdowns) | Platform PATCH (lifecycle excluded — M3) |
| Publish | Dropdown via Save | `publishPortfolioProjectAction` → Platform POST publish |
| Unpublish | Dropdown via Save | `unpublishPortfolioProjectAction` → Platform POST unpublish |
| Archive | Dropdown via Save | `archivePortfolioProjectAction` → Platform POST archive |
| Hard delete | Prisma delete | **Rejected** with explicit message |
| Sunset transition | Dropdown via Save | **Unavailable** (no dropdown in platform-api mode) |

No dual-write. No Prisma fallback on Platform lifecycle failure.

### Identity resolution

```
portfolioLocalId (URL/admin)
  → Prisma bridge slug
  → resolvePlatformCaseStudyIdBySlug()
  → Platform case-study UUID
  → lifecycle POST endpoint
```

### Normal Save lifecycle neutrality

`buildPlatformCaseStudyPatchRequest` (M3) continues to omit `publish_status`, `lifecycle_status`, and `archived_at`. Regression tests in `platform-m5-save-neutrality.test.ts`.

### Admin UI

**Editor (`platform-api` mode):**

- Lifecycle dropdowns replaced with read-only `LifecycleControls` (Publish / Unpublish / Archive)
- Archive uses `ConfirmDialog` with irreversibility + public visibility note

**Admin list:**

- Delete replaced with **Archive** button in platform-api mode
- List does not display lifecycle badges (no stale-status display issue); Prisma rows remain for local UUID links only

### Sunset decision

**Platform-api mode:** sunset transition unavailable; no fabricated Platform field.

**Database mode:** existing sunset dropdown preserved.

Historical migration normalized `sunset` → `active` on Platform (documented Phase 10).

### Hard delete decision

**Platform-api mode:** hard delete blocked server-side; list shows Archive (not Delete).

**Database mode:** hard delete unchanged.

### Prisma snapshot / rollback

Platform lifecycle writes do not update local Prisma lifecycle columns. Rolling back `PROJECT_WRITE_SOURCE=database` may expose stale local lifecycle state (M9 concern).

### Deferred (not M5)

- Public cache invalidation (M7)
- Top-level project create migration
- Media migration (M6)
- Platform metric/milestone reorder (M4 correction — remains blocked)

## Files created

| File | Purpose |
|------|---------|
| `platform-lifecycle-policy.ts` | UI/policy helpers, presentation state |
| `platform-lifecycle-write.ts` | Platform lifecycle orchestration |
| `portfolio-lifecycle.ts` | Server actions |
| `LifecycleControls.tsx` | Editor lifecycle UI |
| `platform-lifecycle-client.test.ts` | Client contract tests |
| `platform-lifecycle-policy.test.ts` | Policy tests |
| `platform-lifecycle-source-routing.test.ts` | Routing guard tests |
| `platform-lifecycle-identity.test.ts` | Identity routing tests |
| `platform-m5-save-neutrality.test.ts` | Save vs lifecycle regression |

## Files modified

| File | Change |
|------|--------|
| `platform-api-admin-client.ts` | `publishCaseStudy`, `unpublishCaseStudy`, `archiveCaseStudy` |
| `platform-admin-types.ts` | `archived_at`, `published_at` on admin detail |
| `platform-admin-mapper.ts` | `platformLifecycleState` on editor load |
| `portfolio.ts` | Hard-delete message via policy constant |
| `OverviewSection.tsx` | Platform lifecycle controls vs database dropdowns |
| `ProjectEditor.tsx` | Pass lifecycle state |
| `admin/portfolio/[id]/page.tsx` | Pass `platformLifecycleState` |
| `PortfolioList.tsx` | Archive UX in platform-api mode |
| `admin/portfolio/page.tsx` | Enable platform archive |
| `platform-api-admin-client.test.ts` | Lifecycle surface + M5 client tests |
| `platform-admin-mapper.test.ts` | Lifecycle state assertions |

## Validation

| Check | Result |
|-------|--------|
| Lifecycle client/policy/identity/save-neutrality tests | 14 pass |
| M3/M4 regression tests | pass |
| Full test suite | 278 pass, 1 skip |
| ESLint | pass |
| `tsc --noEmit` | pass |
| `npm run build` | pass |
