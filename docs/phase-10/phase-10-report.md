# Phase 10 — Engineering Portfolio Read Integration (Pre-Cutover)

**Status:** PRE-CUTOVER IMPLEMENTATION COMPLETE — **FINAL LOCAL PARITY VALIDATED**  
**Date:** 2026-09-03  
**Production cutover:** NOT AUTHORIZED

## 1. Read-Surface Audit

### Shared project / case-study reads (in scope)

| Surface | Path | Previous data access | Phase 10 change |
|---------|------|----------------------|-----------------|
| Homepage featured/list | `src/app/page.tsx` | `getPublishedPortfolioItems()` | Uses `project-read` provider (default DB) |
| Project detail page | `src/app/projects/[slug]/page.tsx` | slug lookup + metrics + versions | Published path via provider bundle; draft preview stays DB |
| Project SEO metadata | `src/app/projects/[slug]/page.tsx` `generateMetadata` | same load path | via provider for published |
| Homepage featured selection | `src/lib/portfolio/home-featured.ts` | client-side slug curation | unchanged (editorial constant) |
| Public portfolio API route | `src/app/api/portfolio/route.ts` | `getAllPortfolioItems()` | **unchanged — DB** (includes drafts) |

### Admin / editor reads (remain database-backed)

| Surface | Path | Reason |
|---------|------|--------|
| Admin dashboard counts | `src/app/admin/page.tsx` | includes drafts + write consistency |
| Admin portfolio list | `src/app/admin/portfolio/page.tsx` | editor must match write source |
| Admin project editor | `src/app/admin/portfolio/[id]/page.tsx` | metrics/versions for editing |
| Portfolio service reads | `src/lib/portfolio/portfolio.service.ts` | admin mutations + reorder flows |

### Portfolio-specific reads (out of scope — unchanged)

| Domain | Paths |
|--------|-------|
| Articles | `src/lib/data/articles.ts`, `src/app/blogs/**`, `src/app/api/articles/**` |
| Reviews | `src/lib/data/reviews.ts`, `src/app/api/reviews/route.ts` |
| Auth/users | `src/lib/auth/**`, `prisma User` |
| Media library (admin) | `src/lib/data/media.ts`, `src/lib/actions/media.ts` |
| Search | `src/app/api/search/articles/route.ts` |

### Not present

- No sitemap / `generateStaticParams` for projects
- No production shadow-read comparison

## 2. Migration Boundary

Phase 10 covers **shared project/case-study public reads only**.

Portfolio Neon remains authoritative for:

- All writes (create/edit/publish/metrics/milestones/media)
- Admin/editor reads
- Articles, reviews, users, and other Portfolio-owned models

## 3. Provider Architecture

```
Public page / metadata
  → getProjectReadProvider()
      → database (default) → existing Prisma data layer
      → platform-api (dev opt-in) → PlatformApiReadClient → mapper → Portfolio domain types
```

**Files:**

- `src/lib/project-read/config.ts` — provider selection
- `src/lib/project-read/types.ts` — `ProjectReadProvider` interface
- `src/lib/project-read/database-project-read-provider.ts`
- `src/lib/project-read/platform-api-client.ts` — read-only V1 client
- `src/lib/project-read/platform-api-mapper.ts` — API → `PortfolioItem` / children
- `src/lib/project-read/platform-api-project-read-provider.ts`
- `src/lib/project-read/index.ts` — factory + convenience exports

## 4. Configuration / Feature Flag

| Variable | Purpose | Default |
|----------|---------|---------|
| `PROJECT_READ_SOURCE` | `database` or `platform-api` | `database` |
| `DEVLAUNCH_PLATFORM_API_URL` | Platform API base URL | unset |
| `DEVLAUNCH_PLATFORM_API_TIMEOUT_MS` | request timeout | `5000` |

**Safety rules:**

- `NODE_ENV=production` **always** resolves to `database`
- Missing/invalid `PROJECT_READ_SOURCE` → `database`
- `platform-api` requires explicit `PROJECT_READ_SOURCE=platform-api` **and** `DEVLAUNCH_PLATFORM_API_URL`
- Presence of API URL alone does **not** enable API reads

Documented in `.env.example` (comments only — no production env changes).

## 5. Platform API Client (Read-Only)

- Server-side `fetch` with `AbortSignal.timeout`
- Engineering projection: `consumer=engineering_portfolio`, `audience=engineering`
- Handles `ETag` / `If-None-Match` → `304`
- Handles `404`, `429` + `Retry-After`, network errors, malformed JSON
- **No write/admin methods exposed**

## 6. DTO / Domain Mapping

Platform API engineering detail → existing `PortfolioItem`, `PortfolioMetric`, `ProjectVersion`.

| Platform API | Portfolio domain |
|--------------|------------------|
| `title` | `caption` |
| `summary` / `problem` | `summary` / `description` |
| `categories[].name` | `category[]` |
| `technologies[]` | `highlights` (joined) |
| `content_items.feature` | `features` |
| `content_items.responsibility` | `responsibilities` |
| `content_items.capability` | `platformFeatures` |
| `links.live/github/docs` | `url/github/docs` |
| `media.hero` | `img` |
| `media.gallery` | `gallery[]` |
| `metrics` / `milestones` | `PortfolioMetric` / `ProjectVersion` (synthetic stable IDs) |

**Documented gaps (not silently discarded — absent from API public contract):**

- `keyFeatures`, `role` — not in engineering public projection
- `heroMediaId`, `ogMediaId` — API uses `media[]` URLs; IDs nulled
- `sortOrder` — API consumer settings not mapped to list card order yet (uses type/sort fallback)
- Homepage featured order — still from `HOME_FEATURED_SLUGS` editorial constant

## 7. Caching

- API client uses `next: { revalidate: 3600 }` on fetch (aligned with page ISR)
- Respects API `Cache-Control` and `ETag` headers in client result metadata
- In-memory per-provider ETag cache for list/detail during a server request lifecycle
- No Redis or competing application cache added
- DB provider uses existing Prisma path (page `revalidate = 3600` unchanged)

## 8. Fallback / Provider Selection

- **No automatic DB fallback when API is selected** — avoids dual-authority ambiguity
- Explicit provider selection only
- Production locked to database

## 9. Admin / Editor Decision

**Admin/editor surfaces remain database-backed** to prevent stale reads after writes (Phase 11 not started).

## 10. Write-Path Protection

Unchanged:

- `src/lib/actions/portfolio.ts`
- `src/lib/actions/portfolio-metrics.ts`
- `src/lib/actions/portfolio-versions.ts`
- `src/lib/data/portfolio.ts` mutations
- Media mutations

No dual-write, no Platform API writes introduced.

## 11. Local Validation Evidence

### 11a. Historical context (initial Phase 10 run)

Before the reconciled Phase 9 dataset was loaded into the local Platform API, the comparison harness returned:

| Source | Published | Metrics | Milestones |
|--------|-----------|---------|------------|
| Portfolio Neon (DB) | 7 | 35 | 48 |
| Local Platform API | 0 | 0 | 0 |

This confirmed client wiring but blocked parity. **That blocker is now resolved.**

### 11b. Final local parity validation (populated reconciled dataset)

**Local configuration used:**

```bash
PROJECT_READ_SOURCE=platform-api
DEVLAUNCH_PLATFORM_API_URL=http://127.0.0.1:8000
```

**Platform API direct probes:**

| Check | Result |
|-------|--------|
| `GET /api/v1/case-studies` (engineering) | `200`, `total: 7` |
| `devlaunch-crm` milestones | 11 |
| `tournament-registration-event-management-system` milestones | 8 |
| `devlaunch-crm` media | 9 |
| `tournament-registration-event-management-system` media | 1 |
| Unknown slug | `404` |
| Conditional GET (`If-None-Match`) | `304 Not Modified` |
| `internal_notes` in public detail | **not present** |

**Comparison harness** (`scripts/compare-project-read-providers.ts`):

| Source | Published | Metrics | Milestones | Slug parity |
|--------|-----------|---------|------------|-------------|
| Portfolio Neon (DB) | 7 | 35 | 48 | — |
| Local Platform API (mapped) | 7 | 35 | 48 | **true** |

All 7 canonical slugs present in both providers:

- `downriver-renovations`
- `devlaunch-crm`
- `ghost-mammoth-pickle-ball`
- `intellitaskpro`
- `the-royal-canine`
- `tournament-registration-event-management-system`
- `engineering-portfolio-management-system`

### 11c. Per-project reconciliation

| Slug | Metrics (DB/API) | Milestones (DB/API) | Media* (DB/API) | Caption | Summary | Features/Resp/Cap |
|------|------------------|---------------------|-----------------|---------|---------|-------------------|
| downriver-renovations | 4 / 4 | 3 / 3 | 1 / 1 | ✓ | ✓ | ✓ |
| devlaunch-crm | 5 / 5 | 11 / 11 | 9 / 9 | ✓ | ✓ | ✓ |
| ghost-mammoth-pickle-ball | 5 / 5 | 6 / 6 | 1 / 1 | ✓ | ✓ | ✓ |
| intellitaskpro | 6 / 6 | 8 / 8 | 6 / 6 | ✓ | ✓ | ✓ |
| the-royal-canine | 4 / 4 | 3 / 3 | 1 / 1 | ✓ | ✓ | ✓ |
| tournament-registration-event-management-system | 5 / 5 | 8 / 8 | 1 / 1 | ✓ | ✓ | ✓ |
| engineering-portfolio-management-system | 6 / 6 | 9 / 9 | 1 / 1 | ✓ | ✓ | ✓ |

\*Media counts use mapped Portfolio shape: hero `img` + `gallery[]` items. Provider does not expose separate `media_assets` rows; aggregate hero+gallery references reconcile to **20** across all projects.

### 11d. Public page validation (API read mode, `localhost:3010`)

| Page | HTTP | Notes |
|------|------|-------|
| `/` (homepage) | 200 | Featured section renders |
| `/projects/downriver-renovations` | 200 | |
| `/projects/devlaunch-crm` | 200 | Metrics + evolution sections present |
| `/projects/ghost-mammoth-pickle-ball` | 200 | |
| `/projects/intellitaskpro` | 200 | |
| `/projects/the-royal-canine` | 200 | Portfolio-only project accessible |
| `/projects/tournament-registration-event-management-system` | 200 | |
| `/projects/engineering-portfolio-management-system` | 200 | |
| `/projects/does-not-exist` | 404 | No draft leak |

SEO metadata path uses the same published provider load as page content. No page copy or design changes were made.

### 11e. Expected mapping gaps (classified)

| Gap | Classification | Notes |
|-----|----------------|-------|
| `keyFeatures`, `role` null on API path | **Expected / acceptable pre-cutover** | Not in engineering public projection; absent from Platform API contract |
| `heroMediaId`, `ogMediaId` null on API path | **Expected / acceptable pre-cutover** | API supplies `media[]` URLs; hero `img` matches |
| `sortOrder` differs (API path uses `0`) | **Expected / acceptable pre-cutover** | Consumer `sort_order` not mapped; list uses project-type fallback |
| Homepage featured order via `HOME_FEATURED_SLUGS` | **Expected / acceptable pre-cutover** | Editorial constant, not API `is_featured` |
| Legacy `description` vs `summary` | **Expected representation difference** | `summary` matches on all 7; API maps `description` from `summary`, DB retains legacy `description` column text |
| `github` / `url` `#` → `null` | **Expected representation difference** | Migration normalizes placeholder `#` links out of API |
| `highlights` expanded on 4 projects | **Defer / Platform API contract review** | API `technologies[]` includes additional entries vs DB `highlights` split (e.g. categories merged into technologies during Phase 9 import). Does not affect counts or page render. |
| `the-royal-canine` `lifecycle_status`: DB `sunset` vs API `active` | **Actual data discrepancy — pre-cutover blocker for production** | M1 export has `sunset`; local Platform API serves `active`. Requires Platform API dataset reconciliation before production cutover. Not a Portfolio Phase 10 code defect. |

### 11f. Failure / recovery behavior

| Mode | Behavior | Verified |
|------|----------|----------|
| `PROJECT_READ_SOURCE=platform-api` + API down | `PlatformApiNetworkError` (visible failure) | ✓ |
| `PROJECT_READ_SOURCE=database` (default) | 7 published projects from Neon | ✓ |
| `NODE_ENV=production` + `platform-api` env | Forces `database` | ✓ |
| Silent DB fallback when API selected | **Not implemented** (by design) | ✓ |

### 11g. Admin / write / Portfolio-specific protection (reconfirmed)

While public reads use Platform API locally:

- Admin list/editor → `src/lib/data/portfolio.ts` (DB)
- Draft preview → DB (`getPortfolioItemBySlug`)
- `/api/portfolio` → DB (`getAllPortfolioItems`)
- All writes → unchanged DB actions
- Articles, reviews, auth, media admin, search → untouched

No mixed-write behavior introduced.

## 12. Regression Results

| Check | Result |
|-------|--------|
| Project-read unit tests | **16 pass / 0 fail** |
| Full unit tests (`bun test`) | **147 pass / 0 fail / 0 skipped** |
| Production build (`npm run build`) | **pass** |
| ESLint (Phase 10 files) | pass |
| ESLint (full repo) | 4 pre-existing issues in `scripts/export-portfolio-m1.ts` (Phase 9 artifact) |

## 13. Production Constraints Confirmed

- Production still uses Portfolio Neon for all reads and writes
- No production environment variables changed
- No Platform API production dependency introduced
- Phase 11+ not started

## 14. Remaining Prerequisites for Cutover

1. Platform API production deployment
2. Production Platform Neon + schema migration
3. Authoritative data migration + reconciliation
4. Production engineering projection validation (7 / 35 / 48 / 20)
5. Failure/recovery validation
6. Explicit operator authorization for read cutover

## 15. Recommendation

**Recommend acceptance of Phase 10 pre-cutover implementation.**

Evidence:

- DB provider works (7 / 35 / 48 / 20 media refs)
- API provider works against reconciled local data (7 / 35 / 48, slug parity true)
- All 7 canonical projects accounted for with matching child counts
- Public pages render under `PROJECT_READ_SOURCE=platform-api`
- Admin/editor/writes remain DB-backed
- Portfolio-specific Neon data untouched
- Production forced to `database`
- Tests/build pass
- Phase 11+ not started

**Pre-cutover data note:** Resolve `the-royal-canine` `lifecycle_status` (`sunset` in Neon/M1 vs `active` in local Platform API) before production read cutover. This is a Platform API reconciliation item, not a Portfolio integration defect.

**Does NOT authorize production read cutover.**

---

## 16. Production Read Cutover Readiness (2026-09-03)

A separate operator review was completed after Phase 9 production migration finished.

**Document:** `docs/phase-10/production-read-cutover-readiness.md`

**Summary:**

- Live `https://api.devlaunchsystems.com` matches Portfolio Neon: **7 / 35 / 48**, all slugs present
- Production still hard-locked to `database` via `NODE_ENV` in `config.ts`
- No service credential required for public reads
- Royal Canine `sunset` → `active`: **Option A recommended** (no public UI impact)
- **Recommendation: READY FOR PRODUCTION READ CUTOVER** (data/integration) pending operator authorization + code/env/deploy steps
- **Cutover not performed**

---

## 17. Code Preparation Audit (2026-09-04)

**Status:** **PRODUCTION READ CUTOVER — CODE READY / OPERATOR DEPLOYMENT PENDING**

Repository-side preparation is complete:

- Production `NODE_ENV` database lock removed (`src/lib/project-read/config.ts`)
- 22 project-read unit tests pass; full suite 153 pass; build pass
- Incorrect `vercel.json` env injection from prior agent attempt reverted locally (operator must not use tracked config for production env)
- Operator configures `PROJECT_READ_SOURCE`, `DEVLAUNCH_PLATFORM_API_URL`, and `S3_PUBLIC_URL_BASE` in Vercel dashboard
- Deployment via GitHub → Vercel only; agent does not deploy

See `docs/phase-10/production-read-cutover-readiness.md` §0 for operator procedure.

---

## 18. Production Build Cache Fix (2026-09-04)

**Status:** **PRODUCTION READ CUTOVER — CODE READY / OPERATOR DEPLOYMENT PENDING**

### Failure observed (Vercel production build)

Prerender of `/` failed with `PlatformApiNetworkError`, masking:

```
DYNAMIC_SERVER_USAGE — Route / couldn't be rendered statically because it used
revalidate: 0 fetch [Platform API]/api/v1/case-studies?...
```

### Root cause

`PlatformApiReadClient.request()` used `cache: "no-store"`, which Next.js treats as
`revalidate: 0` fetch. That opts the route out of static/ISR prerendering while
homepage/project pages declare `revalidate = 3600`.

The generic `catch` wrapped the framework `DynamicServerError` in
`PlatformApiNetworkError`, obscuring the real signal in build logs.

### Fix

1. **`src/lib/project-read/config.ts`** — `PROJECT_READ_ISR_REVALIDATE_SECONDS = 3600` and
   `getPlatformApiFetchCacheOptions()` shared by pages and API client
2. **`platform-api-client.ts`** — `next: { revalidate: 3600 }` instead of `cache: "no-store"`;
   `unstable_rethrow(error)` before wrapping network failures
3. **`page.tsx` / `projects/[slug]/page.tsx`** — import shared revalidate constant

### ETag implications

In-memory ETags remain useful within a single server invocation (list + N detail fetches).
Across ISR cache hits, Next.js Data Cache serves responses without hitting the API until
revalidation. ETags still apply on cache miss/revalidate cycles. No redesign required.

### Local validation

Reproduced failure with `PROJECT_READ_SOURCE=platform-api` before fix; build passes after.

**No deployment performed by agent.**

---

## 19. Production Media URL Fix (2026-09-04)

**Status:** **PRODUCTION READ CUTOVER — CODE READY / OPERATOR DEPLOYMENT PENDING**

### Failure observed

Project images broken after Platform API read cutover. Platform API `public_url`
values still use `*.r2.dev` hostnames while production `S3_PUBLIC_URL_BASE` targets
`https://media.devlaunchsystems.com`.

### Root causes

1. **`next.config.ts` remotePatterns** — derived only from `S3_PUBLIC_URL_BASE` at build
   time. Values without `https://` failed URL parsing silently, producing **no** image host
   allowlist entry.
2. **Hostname mismatch** — Platform API returns `pub-….r2.dev` URLs; production env
   configured for `media.devlaunchsystems.com` only. `next/image` rejected the API host.
3. **No production hard-coded `.r2.dev` validation** in application code — only docs/tests
   used R2 examples.

### Fix

- `src/lib/storage/public-asset-url.ts` — normalize base URL (add `https://` when
  omitted), parse remotePatterns, optional `S3_PUBLIC_URL_BASE_EXTRA`, rewrite `*.r2.dev`
  URLs to configured base (path-preserving)
- `next.config.ts` — use shared remote pattern helper
- `src/lib/storage/config.ts` — normalize `S3_PUBLIC_URL_BASE` for uploads
- `platform-api-mapper.ts` — rewrite hero/gallery `public_url` values through configured base

### Validation

Local tests cover custom domain acceptance, R2 rewrite, extra host allowlist, and mapper
integration. Production build passes with Platform API + media env configuration.

**No deployment performed by agent.**

### Temporary compatibility boundary (not long-term ownership)

The Portfolio mapper rewrite of historical `*.r2.dev` URLs onto `S3_PUBLIC_URL_BASE` is a
**Phase 10 migration/cutover compatibility layer only**. It is not the intended long-term
shared-media ownership model.

**Intended long-term architecture:**

```
Engineering Portfolio (management/editor UI)
  → READ + WRITE client (Phase 11+)
  → DevLaunch Platform API (authoritative shared project/case-study + media metadata)
  → Platform database + Platform-managed media location
  → Cloudflare R2 / https://media.devlaunchsystems.com
```

- **Phase 10:** public shared project **reads** move to Platform API; Portfolio admin/write
  paths remain Portfolio-local; mapper rewrite bridges historical API `public_url` values.
- **Phase 11 (not started):** shared project/case-study **writes** and media operations move
  through Platform API; Portfolio remains the editor UI; Platform API owns authoritative
  shared state and canonical media information.

`S3_PUBLIC_URL_BASE_EXTRA` is **optional** and intended for development/transitional hosts.
It is **not** required for normal production operation when the mapper rewrite and
`S3_PUBLIC_URL_BASE=https://media.devlaunchsystems.com` are configured correctly.

### Future Platform API media contract (document only — decide in Platform API repo)

Before removing the Portfolio compatibility rewrite, the Platform API media contract
should be reviewed. Options to evaluate there (not chosen in this repository):

- **Option A:** persist canonical public URLs such as `https://media.devlaunchsystems.com/<key>`
- **Option B (preferred if consistent with schema):** persist authoritative object identity/key
  and construct/expose canonical URLs via Platform configuration
  (`R2_PUBLIC_BASE_URL=https://media.devlaunchsystems.com`)

Goal: consumers receive canonical media information directly from Platform API rather than
each consumer independently translating storage-specific historical URLs.

---

## 20. Test Isolation Cleanup (2026-09-04)

### Failures reproduced

| Test | Root cause | Classification |
|------|------------|----------------|
| `resolveProjectReadSource > defaults to database when unset` | Test passed `{ projectReadSource: undefined }`, but implementation uses `options?.projectReadSource ?? process.env.PROJECT_READ_SOURCE`; `undefined` falls through to developer `.env` where `PROJECT_READ_SOURCE=platform-api` was set | Test isolation defect — not a production bug |
| `Article Data Access > should get all published articles` | Integration test hit `DATABASE_URL` from `.env` without opt-in; fails with Prisma `P1001` when database is unreachable (sandbox/network) or when run without explicit test DB configuration | Test isolation defect — not article production behavior |

Developer `.env` values leaked into tests. Provider singleton caching did **not** contribute
to either failure (`resetProjectReadProviderForTests()` was already used in provider-selection
tests; config test does not use the singleton).

### Fixes

- `tests/unit/project-read/config.test.ts` — save/restore `PROJECT_READ_SOURCE`; call
  `resolveProjectReadSource()` without options for the unset case; add explicit env-read test.
- `src/__tests__/data/articles.test.ts` — opt-in via `TEST_DATABASE_URL`; skip integration
  test when unset; restore `DATABASE_URL` after run.

**No production behavior changed during test cleanup.**

**No Phase 11 implementation occurred during this task.**
