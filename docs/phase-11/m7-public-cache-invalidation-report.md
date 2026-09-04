# Phase 11 — M7 Public Cache Invalidation Report

**Date:** 2026-09-04  
**Status:** M7 IMPLEMENTED — awaiting acceptance  
**Phase 11:** IN PROGRESS  
**P11-M1–M6:** ACCEPTED / CLOSED  
**P11-M7:** IMPLEMENTED — awaiting acceptance  
**P11-M8+:** NOT STARTED / NOT AUTHORIZED

## Public read/cache inventory

| Surface | Route | Data source | ISR |
|---------|-------|-------------|-----|
| Homepage portfolio section | `/` | `getPublishedPortfolioItems()` | `revalidate = 3600` |
| Project detail | `/projects/{slug}` | `getPublishedProjectDetail(slug)` | `revalidate = 3600` |
| Public project index | — | **No dedicated route** | — |

Platform public fetches (`PlatformApiReadClient`) use `next: { revalidate: 3600 }` via `getPlatformApiFetchCacheOptions()`.

Admin Platform reads use `cache: "no-store"` (M2A).

## ETag behavior

`PlatformApiProjectReadProvider` stores per-slug response bodies and ETags in a process-singleton provider. Conditional requests use `If-None-Match`. After M7 invalidation, detail/list ETag maps for the mutated slug are cleared so the next read cannot serve a stale 304 body from the in-memory provider cache.

Next.js ISR invalidation (`revalidatePath`) clears the framework page/fetch cache independently.

## Application-level stale fallback

The Platform read provider singleton holds in-memory detail/list ETag state (not a separate Redis/file cache). M7 clears this on successful platform-api writes via `invalidateProjectReadProviderCache(slug)`.

No other application-level stale fallback layer exists beyond Next ISR + provider ETag maps.

## Pre-M7 invalidation inventory

| Write path | Pre-M7 behavior |
|------------|-----------------|
| M3 platform project save | `revalidatePath("/")` + admin paths — **no project detail** |
| M4 metrics/milestones (platform) | `revalidatePath("/")` + admin — **no detail** |
| M5 lifecycle | `revalidatePath("/")` + admin — **no detail** |
| M6 media register/PATCH/DELETE | **admin only** — no public invalidation |
| M6 presign | none (correct) |
| Database writes | `revalidatePath("/")` (unchanged) |

**Broad invalidation found:** `revalidatePath("/")` on platform writes without `/projects/{slug}`.

## Chosen invalidation architecture

Modules:

- `public-project-cache-policy.ts` — pure path plan (testable)
- `public-project-cache.ts` — `revalidatePath` + provider cache clear (server-only)

```typescript
invalidatePublicProjectCache(slug, reason)
revalidateAfterPlatformProjectWrite(portfolioId, slug, reason)
invalidatePublicProjectCacheForPortfolioId(portfolioId, reason)
```

**Reasons:**

- `content` — M3/M4/M6 content changes; homepage only if slug ∈ `HOME_FEATURED_SLUGS`
- `membership` — M5 publish/unpublish/archive; always invalidates homepage `/`

**Paths used:** `/projects/{slug}` and conditionally `/`. No cache tags (not present in current architecture).

## Featured-project policy

Homepage invalidation for content writes is **conditional** on `HOME_FEATURED_SLUGS`. Lifecycle membership writes always invalidate homepage because publish/unpublish/archive can change public list membership.

## Transitional invalidation removed

| Removed | Replaced with |
|---------|---------------|
| Platform M3 `revalidatePath("/")` alone | `revalidateAfterPlatformProjectWrite(..., "content")` |
| Platform M4/M5 `revalidatePath("/")` in shared helper | Policy-driven public + admin split |
| M6 missing public invalidation | `revalidatePublicProjectMediaPaths` after register/PATCH/DELETE |

Database mode retains `revalidatePath("/")` via `revalidateDatabasePortfolioPaths`.

## Mutation success gate

Invalidation runs **after** successful Platform mutation only. Failed writes return errors without calling invalidation helpers.

## Presign / PUT rule

- Presign success → **zero** public invalidation
- Browser PUT → **zero** public invalidation (no server action)
- Register/PATCH/DELETE success → public invalidation per policy

## Invalidation error behavior

`revalidatePath` is synchronous framework-side. Successful Platform mutations are not rolled back if revalidation fails (not observed in normal operation). Invalidation is best-effort after authoritative mutation success.

## Tests

- `public-project-cache-policy.test.ts`
- `platform-api-project-read-provider-cache.test.ts`
- `platform-m7-invalidation.test.ts`

## Remaining risks before M8

- Mixed `PROJECT_READ_SOURCE=database` + `PROJECT_WRITE_SOURCE=platform-api` during cutover: public pages may not reflect Platform writes until read source switches.
- Operator must still configure R2 CORS (M6) before media cutover.
- No `/projects` index route to invalidate.

## Operator action

No new M7 operator action. Production write/read source cutover remains operator-owned.
