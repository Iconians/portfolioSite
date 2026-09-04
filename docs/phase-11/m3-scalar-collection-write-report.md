# Phase 11 — M3 Scalar & Collection Write Report

**Date:** 2026-09-04  
**Status:** M3 IMPLEMENTED — awaiting acceptance  
**Phase 11:** IN PROGRESS  
**P11-M1 / M2A / M2B:** ACCEPTED / CLOSED  
**P11-M3:** IMPLEMENTED — awaiting acceptance  
**P11-M4+:** NOT STARTED / NOT AUTHORIZED

## Authoritative PATCH contract verified

Verified against `devlaunch-platform-api`:

- `app/schemas/admin.py` — `CaseStudyPatchRequest`
- `app/services/case_study_admin/patch.py` — scalar partial update + collection replace
- `docs/consumers/v1/integration-guide.md` — PATCH semantics
- `docs/phase-11/pre-phase-11-write-readiness-audit.md` — admin route table

**Route:** `PATCH /api/v1/admin/case-studies/{id}` (Platform UUID)  
**Scope:** `content:write`  
**Response:** `AdminCaseStudyDetail` (200)  
**Semantics:** scalars partial; collections full replace (`technologies`, `categories`, `links`, `consumer_settings`); `content_items` + `content_item_kinds_to_replace` explicit replacement; unknown fields → 422

## Field-classification matrix

| Portfolio field | Platform field | M3 write? | Semantics | Deferred |
|-----------------|----------------|-----------|-----------|----------|
| caption | `title` | Yes | scalar | — |
| subtitle | `subtitle` | Yes | scalar | — |
| summary / description | `summary` | Yes | scalar (summary preferred) | — |
| problem–futureImprovements | story scalars | Yes | scalar null clears | — |
| projectType | `project_type` | Yes | scalar | — |
| startDate / endDate | `start_date` / `end_date` | Yes | ISO date | — |
| seoTitle / seoDescription | `seo_title` / `seo_description` | Yes | scalar | — |
| category[] | `categories[]` | Yes | full replace | — |
| highlights | `technologies[]` | Yes | full replace | — |
| url / github / docs | `links[]` | Yes | full replace | — |
| features / responsibilities / platformFeatures | `content_items` + `content_item_kinds_to_replace` | Yes | explicit replace by kind (`engineering` audience) | — |
| slug | — | **No** | immutable | UI read-only + server reject |
| publishStatus | — | **No** | — | M5 publish/unpublish |
| lifecycleStatus | — | **No** (omitted) | — | M5 lifecycle/archive |
| sortOrder | — | **No** | — | consumer_settings (not in editor) |
| img / heroMediaId / ogMediaId / gallery | — | **No** | — | M6 media |
| keyFeatures / role | — | **No** | not in PATCH contract | — |
| metrics / milestones | — | **No** | separate endpoints | M4 |

## Files created

| File | Purpose |
|------|---------|
| `src/lib/project-write/platform-admin-patch-types.ts` | PATCH request types |
| `src/lib/project-write/platform-update-mapper.ts` | Whitelisted Portfolio → PATCH mapper |
| `src/lib/project-write/platform-update-errors.ts` | Slug immutability error |
| `src/lib/project-write/platform-action-errors.ts` | User-facing Platform write errors |
| `src/lib/project-write/platform-project-update.ts` | Server-side Platform update orchestration |
| `tests/unit/project-write/platform-update-mapper.test.ts` | PATCH mapping tests |
| `tests/unit/project-write/platform-m3-write-payload-safety.test.ts` | M3 PATCH payload safety |
| `tests/unit/project-write/platform-action-errors.test.ts` | Error adapter tests |
| `tests/unit/project-write/platform-update-source-routing.test.ts` | Write-source routing tests |

## Files modified

| File | Change |
|------|---------|
| `src/lib/project-write/platform-api-admin-client.ts` | `updateCaseStudy()` PATCH method |
| `src/lib/actions/portfolio.ts` | Route update/delete by `PROJECT_WRITE_SOURCE` |
| `src/components/Admin/portfolio/ProjectEditor.tsx` | `writeSource` prop |
| `src/components/Admin/portfolio/sections/OverviewSection.tsx` | Read-only slug in platform-api mode |
| `src/components/Admin/PortfolioList.tsx` | Disable delete in platform-api mode |
| `src/app/admin/portfolio/[id]/page.tsx` | Pass `writeSource` to editor |
| `src/app/admin/portfolio/page.tsx` | Pass `disableDelete` to list |
| `tests/unit/project-write/platform-api-admin-client.test.ts` | PATCH client tests |

## Identity resolution

```
portfolioLocalId (URL)
  → Prisma bridge row (slug only)
  → listCaseStudies + slug match
  → platformCaseStudyId
  → PATCH
```

Portfolio UUID and slug are never used as Platform PATCH `{id}`.

## No dual-write

`PROJECT_WRITE_SOURCE=platform-api` → Platform PATCH only for M3 fields.  
`PROJECT_WRITE_SOURCE=database` → existing Prisma `updatePortfolioItem`.  
No Prisma project row mutation on Platform update path.

## Slug behavior

Slug input read-only when editing with `platform-api` write source. Server rejects slug changes via `PlatformSlugImmutableError`.

## Lifecycle / publish

Omitted from PATCH payload. Editor controls remain visible but values are not written to Platform in M3 (M5 owns specialized transitions).

## Media / metrics / milestones

Unchanged M2B boundary: Platform display URLs; Portfolio `mutationCompat` IDs untouched. Metric/milestone actions remain Prisma-backed.

## Create / delete

- **Create:** remains Prisma-backed (`createPortfolioAction` unchanged).
- **Delete:** disabled in platform-api mode (action error + UI disabled button). Avoids deleting local bridge while Platform project remains.

## Read-after-write / public cache

Admin paths revalidated after Platform save. Public ISR unchanged until M7.

## Content items — explicit replacement (API blocker resolved)

Platform API now supports `content_item_kinds_to_replace` on `CaseStudyPatchRequest`.

Portfolio M3 mapper sends:

```json
{
  "content_item_kinds_to_replace": ["feature", "responsibility", "capability"],
  "content_items": [ /* mapped non-empty items */ ]
}
```

### Editor payload presence

`splitProjectEditorPayload()` **always** includes all three collection fields as arrays (possibly empty). Therefore every normal M3 editor save explicitly replaces all three kinds.

### Omitted vs empty

| Portfolio extended field | Mapper behavior |
|--------------------------|-----------------|
| field **absent** (`undefined`) | kind **not** listed → Platform kind unchanged |
| field **present** as `[]` | kind listed → Platform kind **cleared** |
| field **present** with items | kind listed → Platform kind **replaced** |

### Clear examples

- `features=[]` → `"feature"` in `content_item_kinds_to_replace`, no feature items → clears Platform features
- `responsibilities=[]` → clears responsibilities
- `platformFeatures=[]` → clears capabilities
- all three `[]` → all three kinds listed, `content_items=[]` → clears all three

Unsupported Platform kinds (`business_deliverable`, `platform_capability`) are never emitted by the M3 mapper.

## Production cutover

`PROJECT_WRITE_SOURCE` production value unchanged. M9 owns cutover.

## Tests added/changed

| File | Coverage |
|------|----------|
| `platform-update-mapper.test.ts` | Scalar/collection mapping, explicit content-item replacement, slug rejection |
| `platform-m3-write-payload-safety.test.ts` | Editor → PATCH excludes deferred domains; mutationCompat preserved |
| `platform-action-errors.test.ts` | User-facing Platform write error mapping |
| `platform-update-source-routing.test.ts` | Write-source selection |
| `platform-api-admin-client.test.ts` | PATCH method, 422, surface guard |

## Validation

| Check | Result |
|-------|--------|
| `bun test tests/unit/project-write/` | 67 pass |
| Full test suite | 236 pass, 1 skip |
| ESLint | pass |
| `tsc --noEmit` | pass |
| `npm run build` | pass |
