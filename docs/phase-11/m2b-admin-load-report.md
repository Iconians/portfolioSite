# Phase 11 — M2B Admin Load Integration Report

**Date:** 2026-09-04  
**Status:** M2B IMPLEMENTED — awaiting acceptance  
**Phase 11:** IN PROGRESS  
**P11-M1:** ACCEPTED / CLOSED — 2026-09-04  
**P11-M2A:** ACCEPTED / CLOSED — 2026-09-04  
**P11-M2B:** IMPLEMENTED — awaiting acceptance  
**P11-M3:** NOT STARTED / NOT AUTHORIZED

## Scope

M2B migrates **admin project READ/LOAD** from Portfolio Prisma to the DevLaunch Platform API administrative read contract when `PROJECT_WRITE_SOURCE=platform-api`.

**Writes remain Prisma-backed.** No Platform mutation methods were added.

Transitional architecture after M2B:

| Surface | Source |
|---------|--------|
| Public project reads | Platform API (Phase 10) |
| Admin project loads | Platform API (M2B, when configured) |
| Admin project writes | Portfolio Prisma (unchanged until M3+) |

## Files created

| File | Purpose |
|------|---------|
| `src/lib/project-write/platform-admin-types.ts` | Platform admin list/detail/media types |
| `src/lib/project-write/identity-bridge.ts` | Slug → Platform UUID resolution |
| `src/lib/project-write/platform-admin-mapper.ts` | Platform admin → ProjectEditor load shape |
| `src/lib/project-write/admin-project-load.ts` | Admin load orchestration (database vs platform-api) |
| `src/lib/project-write/admin-project-load-error.ts` | Controlled admin load errors |
| `src/components/Admin/portfolio/AdminProjectLoadErrorState.tsx` | Admin error UI (no silent DB fallback) |
| `tests/unit/project-write/identity-bridge.test.ts` | Identity bridge tests |
| `tests/unit/project-write/platform-admin-mapper.test.ts` | Mapper + media ID separation tests |
| `tests/unit/project-write/admin-preview-policy.test.ts` | Preview fallback policy tests |

## Files modified

| File | Change |
|------|--------|
| `src/lib/project-write/platform-api-admin-client.ts` | Added `listMedia()`; admin types from `platform-admin-types` |
| `src/lib/project-write/index.ts` | Export admin load functions and errors |
| `src/app/admin/portfolio/[id]/page.tsx` | Platform admin load via `loadAdminProjectEditorState` |
| `src/app/projects/[slug]/page.tsx` | Draft preview uses Platform admin read when configured |
| `tests/unit/project-write/platform-api-admin-client.test.ts` | `listMedia` tests; updated surface guard |

## Admin surfaces migrated

| Surface | M2B behavior |
|---------|----------------|
| `/admin/portfolio/[id]` (edit) | Platform admin detail + media when `PROJECT_WRITE_SOURCE=platform-api` |
| `/projects/{slug}?preview=1` (draft) | Platform admin detail when write source is `platform-api` |
| `/admin/portfolio` (list) | **Retained Prisma list** — edit links require Portfolio-local UUIDs |

## Identity bridge design

Route `/admin/portfolio/[id]` keeps Portfolio-local UUID in the URL.

When `PROJECT_WRITE_SOURCE=platform-api`:

1. Load Portfolio row by local UUID (**bridge only** — slug lookup, not authoritative content).
2. `listCaseStudies()` → match by slug.
3. `getCaseStudyById(platformUuid)` + `listMedia({ caseStudyId })`.
4. Map Platform data into `ProjectEditor` initial state.

`resolvePlatformCaseStudyIdBySlug()` in `identity-bridge.ts` enforces:

- Portfolio-local UUID is never passed to Platform detail endpoint.
- Missing slug match → `AdminProjectLoadError`.
- Duplicate slug match → `AdminProjectLoadError`.

## Platform vs Portfolio IDs

| Identity | Used for |
|----------|----------|
| `portfolioLocalId` | Prisma writes, editor `portfolioId` prop, URL `[id]` |
| `platformCaseStudyId` | Platform admin reads (carried in load result for future milestones) |

Mapper sets `portfolioLocalId` on all metrics/milestones for Prisma write compatibility. Platform metric/milestone IDs are synthetic until M4.

## Media behavior

**Option B (transitional):** Platform media is used for **display** (hero image URL, OG preview URL). Mutation-bound fields `heroMediaId`, `ogMediaId`, and gallery `mediaId` values are preserved from the Portfolio bridge row via `mutationCompat` so unrelated Prisma saves do not clear local relationships. Platform media UUIDs are never submitted to Prisma.

`MediaPicker` remains **Portfolio Prisma-backed** (`listMediaAssetsAction`) for mutation-bound selections. Article media workflows are unchanged.

`listMedia()` is available on the admin client for project-scoped Platform media reads during admin load.

## Draft preview behavior

| Condition | Behavior |
|-----------|----------|
| Published project | Public Platform read (Phase 10, unchanged) |
| `preview=1` + admin auth + `platform-api` | `loadAdminProjectPreviewBySlug` → Platform admin detail |
| `preview=1` + admin auth + `database` | Prisma draft fallback (unchanged) |
| `preview=1` + no admin auth | No draft exposure |
| `platform-api` + Platform load failure | No Prisma content fallback |

## Admin failure / fallback policy

When `PROJECT_WRITE_SOURCE=platform-api`:

- Platform timeout, 401, 403, 404, 429, 5xx, malformed response → controlled error UI (`AdminProjectLoadErrorState`).
- **No silent Portfolio Prisma content fallback** for project editor state.
- Portfolio row lookup for slug bridge is permitted (not authoritative content fallback).

## `PROJECT_WRITE_SOURCE` semantics after M2B

```
PROJECT_WRITE_SOURCE=database
  → Prisma admin load + Prisma writes

PROJECT_WRITE_SOURCE=platform-api
  → Platform admin load + Prisma writes (transitional asymmetry)
```

`PROJECT_READ_SOURCE` remains independent (Phase 10).

## Prisma mutations

Unchanged. `createPortfolioAction`, `updatePortfolioAction`, `deletePortfolioAction`, metric/milestone mutations, and media upload actions remain Prisma-backed.

## Transitional data-integrity note

Loading authoritative Platform content and saving via Prisma can overwrite local scalar fields
if datasets diverge. M2B does not auto-sync. User-initiated saves only. Media FK relationships
and metric/milestone child IDs are preserved via `mutationCompat` and Prisma child loads (see
Transitional Prisma Write Safety above).

## Tests added/changed

| File | Coverage |
|------|----------|
| `identity-bridge.test.ts` | Slug resolution, no local UUID confusion, ambiguity |
| `platform-admin-mapper.test.ts` | Editor load mapping, media ID stripping, lifecycle, R2 rewrite |
| `admin-preview-policy.test.ts` | Write-source preview fallback policy |
| `platform-api-admin-client.test.ts` | `listMedia` auth, filters, validation, no mutations |

## Transitional Prisma Write Safety

### Pre-review defects (resolved)

Before this acceptance review, Platform-backed admin load set `heroMediaId` and `ogMediaId`
to `null` in editor initial values. Because `splitProjectEditorPayload` always includes those
fields and `buildExtendedWriteData` writes them when present, an unrelated scalar save would
have cleared existing Portfolio-local media relationships. Gallery items loaded from Platform
also omitted local `mediaId` values, which would have replaced Prisma gallery JSON and
stripped mutation-bound references. Metric and milestone tabs used Platform synthetic IDs that
do not exist in Prisma, causing update/delete/reorder to target non-existent rows.

### Media ID strategy

| Field | Display source | Mutation source |
|-------|----------------|-----------------|
| `img` (hero URL) | Platform admin media | N/A (URL in legacy payload) |
| `initialOgImageUrl` | Platform admin media | N/A (display only) |
| `heroMediaId` | — | Portfolio bridge row (`mutationCompat`) |
| `ogMediaId` | — | Portfolio bridge row (`mutationCompat`) |
| `gallery` URLs in form | Local bridge gallery (transitional) | Portfolio bridge row (`mutationCompat`) |

Platform media UUIDs are never placed in Prisma FK fields. Local `heroMediaId`, `ogMediaId`,
and gallery `mediaId` values come from the existing Portfolio row loaded as an identity bridge
only. They are not authoritative project content.

Gallery display in the editor uses the local bridge gallery until M6 migrates mutation-bound
media selection to Platform. Hero/OG preview URLs remain Platform-authoritative.

### Metric / milestone ID strategy

When `PROJECT_WRITE_SOURCE=platform-api`, `initialMetrics` and `initialVersions` are loaded
from Portfolio Prisma (`listMetricsForPortfolio`, `listVersionsForPortfolio`), not from
Platform synthetic IDs. Metric and milestone **content** on those tabs reflects the local
Prisma child rows (expected aligned post-Phase 9). CRUD actions receive valid Portfolio-local
child UUIDs.

No metric/milestone controls were disabled.

### Identity classification (platform-api mode)

**Platform identities (authoritative read/display):**

- `platformCaseStudyId`
- Scalar project content fields in `initialValues` (caption, story, SEO, features, etc.)
- Platform-sourced hero/OG display URLs (`img`, `initialOgImageUrl`)

**Portfolio mutation identities (write compatibility only):**

- `portfolioLocalId` (editor `portfolioId`, Prisma update target)
- `mutationCompat.heroMediaId`
- `mutationCompat.ogMediaId`
- `mutationCompat.gallery[].mediaId`
- `initialMetrics[].id` (Prisma)
- `initialVersions[].id` (Prisma)

### Regression coverage

- `tests/unit/project-write/platform-admin-transitional-write-safety.test.ts` — unrelated scalar
  save preserves local media IDs; Platform UUIDs never enter Prisma FK fields
- `tests/unit/project-write/platform-admin-mapper.test.ts` — `mutationCompat` overlay behavior

## Post-acceptance regression — historical R2 media URL compatibility

An admin smoke test on `GET /admin/portfolio` exposed a raw `*.r2.dev` hero URL reaching
`next/image` in `PortfolioList`. The escaped path was:

`getAllPortfolioItems()` → `admin/portfolio/page.tsx` → `PortfolioList` → `Image src={item.img}`

M2B Platform admin mapper already rewrote Platform media URLs server-side, but the admin list
page (intentionally Prisma-backed in M2B) never applied the Phase 10 display rewrite before
`next/image`. The ProjectEditor media tabs use plain `<img>` and did not surface the failure.

**Correction:**

- Added `rewritePortfolioItemDisplayMedia` (`src/lib/portfolio/display-media-url.ts`) reusing
  `rewritePublicAssetUrlIfConfigured`
- Applied on the admin portfolio list server page before passing props to `PortfolioList`
- Added explicit hero display rewrite in `platform-admin-mapper` for Platform-backed editor load

**Regression tests:** `tests/unit/portfolio/display-media-url.test.ts`

Canonical production media normalization remains deferred to P11-M8. The temporary rewrite
remains required until then.

## Deferred (M3+)

- Platform admin writes (create/update/publish/archive)
- MediaPicker migration to Platform media list for mutation-bound IDs (M6)
- Admin list page migration to Platform
- Slug immutability enforcement on write
- Public cache invalidation (M7)
- Removal of Phase 10 R2 URL rewrite (M8)
- Cross-authority metric/milestone write alignment (M4)

## Schema / external actions

- No Prisma schema changes
- No migrations
- No Platform mutation endpoints added
- No commit, push, deploy, or production credential changes
