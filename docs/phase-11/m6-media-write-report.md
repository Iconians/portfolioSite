# Phase 11 — M6 Media Write Report

**Date:** 2026-09-04  
**Status:** M6 IMPLEMENTED — awaiting acceptance (acceptance correction applied)  
**Phase 11:** IN PROGRESS  
**P11-M1 / M2A / M2B / M3 / M4 / M5:** ACCEPTED / CLOSED  
**P11-M6:** IMPLEMENTED — awaiting acceptance  
**P11-M7+:** NOT STARTED / NOT AUTHORIZED

## Authoritative Platform media contract

Verified against `devlaunch-platform-api`:

- `docs/consumers/v1/integration-guide.md` §G
- `app/api/v1/admin/media.py`
- `app/services/media_admin/*`
- `tests/api/test_admin_media.py`

| Operation | Route | Method | Scope | Response |
|-----------|-------|--------|-------|----------|
| Presign | `/api/v1/admin/case-studies/{id}/media/presign` | POST | `media:write` | 200 presign payload |
| Register | `/api/v1/admin/case-studies/{id}/media` | POST | `media:write` | 201 media record |
| PATCH | `/api/v1/admin/media/{mediaId}` | PATCH | `media:write` | 200 media record |
| DELETE | `/api/v1/admin/media/{mediaId}` | DELETE | `media:write` | 204 (metadata only) |
| List | `/api/v1/admin/media` | GET | `media:write` | paginated items |

**No batch/atomic gallery reorder endpoint exists.**

### Presign

**Request:** `filename`, `mime_type`, `size_bytes`, `role` (`hero` | `og` | `gallery` | `thumbnail`), optional `audience`.

**Response:** `media_id`, `storage_key`, `upload_url`, `upload_headers`, `public_url`, `expires_in`.

Platform generates `storage_key`; Portfolio must not invent keys.

### Register

**Request:** `storage_key` (+ optional `alt_text`, `caption`, `width`, `height`, `sort_order`).

Role is fixed at presign time. Singleton roles (`hero`, `og`, `thumbnail`) demote prior confirmed item with same role to `gallery`.

### PATCH (mutable fields only)

`alt_text`, `caption`, `sort_order`, `audience` — **role is immutable**.

Per-item `sort_order` PATCH is not atomic across multiple gallery items.

### DELETE

Removes Platform metadata only; does **not** delete R2 object.

## Project-media relationship contract

`CaseStudyPatchRequest` has **no** `hero_media_id`, `og_media_id`, or gallery fields.

| Question | Authoritative answer |
|----------|---------------------|
| A. Current hero | Confirmed `CaseStudyMedia` with `role=hero` |
| B. Current OG | Confirmed `CaseStudyMedia` with `role=og` |
| C. Promote gallery → hero | **No** — role immutable; presign/register new `role=hero` |
| D. Promote gallery → OG | **No** — same |
| E. Hero → OG | **No** |
| F. OG → hero | **No** |
| G. Clear hero to none | **No dedicated clear** — DELETE metadata removes hero record (not exposed in hero UI) |
| H. Clear OG to none | **No dedicated clear** — DELETE metadata removes OG record (not exposed in OG UI) |

**Replacement:** presign + register new media with desired singleton `role`; prior confirmed singleton demoted to `gallery`.

## Gallery reorder — pre-correction vs corrected

### Pre-correction

- **No gallery reorder UI** existed in `GalleryEditor` (append/remove/metadata only).
- `updateProjectPlatformMediaAction` accepted `sortOrder`, enabling unsafe sequential PATCH reorder if invoked directly.
- M6 report noted non-atomic `sort_order` PATCH risk.

### Corrected behavior

| Mode | Gallery reorder |
|------|-----------------|
| `database` | Unchanged (no reorder UI; append/remove via form Save) |
| `platform-api` | **Blocked** — `shouldDisableGalleryReorder`, server rejects `sortOrder` PATCH and `reorderProjectGalleryMediaAction` before Platform I/O |

Platform has no batch/atomic reorder contract. Future reorder requires Platform API support or explicit product decision (not assigned to M7).

## Hero / OG existing-media selection

### Pre-correction

- Hero/OG picker listed **all** project media (`role` filter omitted).
- Incompatible items showed toast on select but appeared selectable.
- Selecting matching-role singleton updated form only (no Platform mutation).

### Corrected behavior

- Platform `MediaPicker` lists **role-filtered** items only (`hero` picker → `role=hero`, etc.).
- Incompatible roles never appear for singleton pickers.
- Re-selecting current singleton is a **no-op** (closes picker; no dirty/mutation claim).
- **Upload replacement** is the authoritative mutation path for singleton changes.
- Help text documents replacement-only semantics.

## Clear-to-none semantics

- Platform has **no** explicit clear-to-none endpoint.
- `heroMediaId` / `ogMediaId` null in editor form does **not** persist to Platform (M3 Save is media-neutral).
- No clear buttons in platform-api hero/OG UI.
- Platform DELETE would remove metadata (leaving no hero/OG row) but Portfolio does **not** expose DELETE on hero/OG controls; gallery remove uses DELETE for `role=gallery` only.

## Singleton DELETE behavior

- Platform `DELETE /media/{id}` removes metadata for any role (tested).
- After hero DELETE: no confirmed `role=hero` row remains — safe, not ambiguous.
- Portfolio: DELETE exposed only via gallery **Remove** (gallery role items).
- Hero/OG DELETE not exposed in editor; replacement via upload is primary UX.

## Capability matrix (post-correction)

| Capability | database | platform-api | Authoritative operation |
|------------|----------|--------------|-------------------------|
| Upload new hero | supported | supported | presign(`role=hero`) → PUT → register |
| Upload new OG | supported | supported | presign(`role=og`) → PUT → register |
| Upload gallery | supported | supported | presign(`role=gallery`) → PUT → register |
| Select existing as hero | supported | current-item-only | No mutation; list filtered to `role=hero` |
| Select existing as OG | supported | current-item-only | No mutation; list filtered to `role=og` |
| Select existing gallery | supported | supported* | Form sync only; item already `role=gallery` on Platform |
| Clear hero | supported (Save) | **unsupported** | No Platform clear; no UI |
| Clear OG | supported (Save) | **unsupported** | No Platform clear; no UI |
| Remove gallery | supported (Save) | supported | DELETE metadata |
| Reorder gallery | unsupported (no UI) | **blocked** | No atomic contract |
| Edit alt/caption | supported | supported | PATCH |
| Delete media | supported | supported (gallery) | DELETE metadata only |

\*Selecting existing gallery adds to form state only; upload path registers new gallery media authoritatively.

## Upload flow (unchanged)

1. `presignProjectMediaAction` (server/Bearer)
2. Browser PUT R2
3. `registerProjectMediaAction` (server)
4. Platform media UUID authoritative

## Source routing

`PROJECT_WRITE_SOURCE=database` → Prisma/R2.  
`PROJECT_WRITE_SOURCE=platform-api` → Platform presign/register/PATCH/DELETE. **No dual-write. No Prisma fallback.**

## R2 CORS (operator)

Browser PUT requires R2 CORS for Portfolio admin origin. **Not configured by M6.**

## Files created (M6 + correction)

- `src/lib/project-write/platform-media-types.ts`
- `src/lib/project-write/platform-api-admin-media-client.ts`
- `src/lib/project-write/platform-media-mapper.ts`
- `src/lib/project-write/platform-media-policy.ts`
- `src/lib/project-write/platform-media-reorder-policy.ts`
- `src/lib/project-write/platform-media-write.ts`
- `src/lib/media/platform-media-upload-client.ts`
- `src/lib/actions/portfolio-media.ts`
- `src/components/Admin/media/media-picker-upload.ts`
- `src/components/Admin/portfolio/ProjectEditorTabList.tsx`
- M6 + correction tests under `tests/unit/`

## Remaining risks before M7

- R2 CORS operator configuration required for production browser upload.
- Orphan R2 objects if register fails after PUT.
- Gallery reorder deferred until atomic Platform contract.
- Optional OG clear-via-DELETE not exposed in UI.
- Local Prisma media snapshot may diverge (M9 rollback limitation).

## Operator action before production media cutover

1. Configure R2 bucket CORS for Portfolio admin origin.
2. Validate presign→PUT→register in staging.
3. Set `PROJECT_WRITE_SOURCE=platform-api` only after bridge + CORS verified.
