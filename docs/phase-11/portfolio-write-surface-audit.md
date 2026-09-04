# Phase 11 — Engineering Portfolio Write-Surface Companion Audit

**Date:** 2026-09-04  
**Status:** AUDIT COMPLETE — **Phase 11 IN PROGRESS (M1 implemented)**  
**Phase 10:** ACCEPTED / CLOSED (2026-09-03) — public published project reads use Platform API  
**Platform API audit (external):** READY FOR PHASE 11 IMPLEMENTATION (dev/staging); production write cutover NOT ready

This document records **verified Portfolio repository evidence** reconciled against known Platform API Phase 11 constraints. It does not duplicate the full API audit.

---

## 1. Portfolio admin routes and write entry points

### Admin routes (UI)

| Surface | Path | File |
|---------|------|------|
| Admin shell / auth gate | `/admin/*` | `src/app/admin/layout.tsx` |
| Project list | `/admin/portfolio` | `src/app/admin/portfolio/page.tsx` |
| Create project | `/admin/portfolio/new` | `src/app/admin/portfolio/new/page.tsx` |
| Edit project | `/admin/portfolio/[id]` | `src/app/admin/portfolio/[id]/page.tsx` |
| Draft preview link | `/projects/{slug}?preview=1` | link from edit page → `src/app/projects/[slug]/page.tsx` |
| Media library | `/admin/media` | `src/app/admin/media/page.tsx` |

### Project editor component tree

| Concern | Component | File |
|---------|-----------|------|
| Main editor shell | `ProjectEditor` | `src/components/Admin/portfolio/ProjectEditor.tsx` |
| Overview (status, slug, dates, sort) | `OverviewSection` | `src/components/Admin/portfolio/sections/OverviewSection.tsx` |
| Hero + gallery | `MediaSection`, `GalleryEditor` | `sections/MediaSection.tsx`, `GalleryEditor.tsx` |
| Categories + legacy fields | `DetailsSection` | `sections/DetailsSection.tsx` |
| Story + features/responsibilities | `StorySection`, `StringListEditor` | `sections/StorySection.tsx`, `StringListEditor.tsx` |
| Platform capabilities | `PlatformShowcaseEditor` | `PlatformShowcaseEditor.tsx` |
| Links + SEO + OG | `LinksSeoSection` | `sections/LinksSeoSection.tsx` |
| Metrics (separate actions) | `MetricEditor`, `MetricRow` | `MetricEditor.tsx`, `MetricRow.tsx` |
| Milestones (separate actions) | `ProjectEvolutionEditor`, `ProjectEvolutionRow` | `ProjectEvolutionEditor.tsx`, `ProjectEvolutionRow.tsx` |
| List + hard delete | `PortfolioList` | `src/components/Admin/PortfolioList.tsx` |
| Media picker modal | `MediaPicker` | `src/components/Admin/media/MediaPicker.tsx` |

### Server actions (project domain)

| Operation | Action | File |
|-----------|--------|------|
| Create project | `createPortfolioAction` | `src/lib/actions/portfolio.ts` |
| Update project (scalars + collections) | `updatePortfolioAction` | `src/lib/actions/portfolio.ts` |
| Hard delete project | `deletePortfolioAction` | `src/lib/actions/portfolio.ts` |
| Metric CRUD + reorder | `create/update/delete/reorderPortfolioMetricAction` | `src/lib/actions/portfolio-metrics.ts` |
| Milestone CRUD + reorder | `create/update/delete/reorderProjectVersionAction` | `src/lib/actions/portfolio-versions.ts` |
| Media list / metadata / delete | `list/update/deleteMedia*Action` | `src/lib/actions/media.ts` |

### API routes (project-adjacent)

| Route | Purpose | File | Notes |
|-------|---------|------|-------|
| `POST /api/media/upload` | Server-buffered upload | `src/app/api/media/upload/route.ts` | **Used by UI** |
| `POST /api/media/presign` | Presigned PUT | `src/app/api/media/presign/route.ts` | Implemented, **not used by UI** |
| `POST /api/media/complete` | Register after presign | `src/app/api/media/complete/route.ts` | Implemented, **not used by UI** |
| `GET /api/portfolio` | All projects JSON | `src/app/api/portfolio/route.ts` | Includes drafts; DB-only |

### Data / service layer

| Layer | File |
|-------|------|
| Portfolio CRUD | `src/lib/data/portfolio.ts` |
| Metrics data | `src/lib/data/portfolio-metrics.ts` |
| Milestones data | `src/lib/data/project-versions.ts` |
| Metrics/milestones service | `src/lib/portfolio/portfolio.service.ts` |
| Slug assignment | `src/lib/portfolio/assign-slug.ts`, `src/lib/data/portfolio-slugs.ts` |
| Editor mapping | `src/lib/portfolio/project-editor.ts` |
| Media service | `src/lib/media/media.service.ts` |
| Storage | `src/lib/storage/*` |

### Operation exposure matrix

| Operation | UI | Server | DB field / table | Classification |
|-----------|----|--------|------------------|----------------|
| Project list | A | A | `portfolio` | Exposed |
| Create project | A | A | `portfolio` | Exposed |
| Edit scalars/story | A | A | `portfolio` columns + JSON | Exposed |
| Publish / unpublish | A | A | `publish_status` dropdown | Exposed (not separate actions) |
| Lifecycle status | A | A | `lifecycle_status` | Exposed |
| Archive (lifecycle) | A | A | `lifecycle_status=archived` | Exposed as enum value |
| Hard delete project | A | A | `portfolio` DELETE | Exposed |
| Restore / unarchive | — | — | — | **Not implemented** |
| Metrics | A | A | `portfolio_metrics` | Exposed |
| Milestones | A | A | `project_versions` | Exposed |
| Technologies | — | — | `highlights` (legacy string) | **Legacy field only**; public read maps API `technologies` |
| Categories | A | A | `category[]` | Exposed |
| Features | A | A | `features` JSON | Exposed |
| Responsibilities | A | A | `responsibilities` JSON | Exposed |
| Platform capabilities | A | A | `show_platform_section`, `platform_features[]` | Exposed |
| Links (live/github/docs) | A | A | `url`, `github`, `docs` | Exposed |
| Key features / role (legacy) | A | A | `key_features`, `role` | Exposed; **not on public API read path** |
| Consumer settings | — | — | — | **Not in Portfolio** |
| Hero image | A | A | `img`, `hero_media_id` | Exposed |
| OG image | A | A | `og_media_id` | Exposed |
| Gallery | A | A | `gallery` JSON | Exposed |
| SEO metadata | A | A | `seo_title`, `seo_description` | Exposed |
| Root sort order | A | A | `sort_order` | Exposed in admin; **public Platform read hardcodes `sortOrder: 0`** |
| Homepage featured | — | — | `HOME_FEATURED_SLUGS` | **E — Portfolio-local code** (`src/lib/portfolio/home-featured.ts`) |
| Draft preview | A | A | Prisma read path | Exposed |

---

## 2. Project-domain Prisma dependency graph

```
Portfolio (portfolio)
  ├── PortfolioMetric (portfolio_metrics)     ON DELETE CASCADE
  ├── ProjectVersion (project_versions)       ON DELETE CASCADE
  ├── heroMedia → MediaAsset (SetNull)
  └── ogMedia → MediaAsset (SetNull)

MediaAsset (media_assets)
  ├── portfolioHeroFor[] Portfolio
  ├── portfolioOgFor[] Portfolio
  └── articleCoversFor[] Article (SetNull)

User (users)
  ├── portfolio[] Portfolio                     ON DELETE CASCADE
  ├── articles[] Article                        ON DELETE CASCADE
  ├── reviews[] Review                          ON DELETE CASCADE
  └── mediaAssets[] MediaAsset                  ON DELETE CASCADE
```

### Portfolio-local domains referencing Project/Portfolio

| Domain | FK to `Portfolio`? | Evidence |
|--------|-------------------|----------|
| Articles | **NO** | `Article` has `coverMediaId → MediaAsset` only (`prisma/schema.prisma`) |
| Reviews | **NO** | No portfolio FK |
| Users / auth | **NO** (inverse) | `Portfolio.createdBy → User` |
| Homepage featured | **NO** | Slug list in code, not DB |
| SEO | **NO** | Columns on `Portfolio` |
| Media library | **Indirect** | `MediaAsset` referenced by portfolio hero/og/gallery JSON and article covers |
| Audit log | **NO** | `resourceId` string only, no FK |
| Analytics | **NO** | Not present |

**Conclusion:** No article/review/user FK requires Portfolio `portfolio` rows to stay live-synced with Platform writes. **MediaAsset** remains actively required for Portfolio-local article covers and current admin media workflow.

---

## 3. Write-path traces (summary)

### Project create

`ProjectEditor` submit → `createPortfolioAction` → `requireAdmin` → `createPortfolioItem` → Zod `PortfolioItemSchema` + `validatePortfolioExtendedInput` → `assignPortfolioSlug` → optional `resolveHeroMediaIdFromImg` → `db.portfolio.create` → `revalidatePath("/")` only.

### Project update (scalars + collections)

Same chain via `updatePortfolioAction` → `updatePortfolioItem` → single `db.portfolio.update` (slug reassignment if `extended.slug` provided; gallery/features/responsibilities as JSON replacement).

### Publish / unpublish

No dedicated action. `publishStatus` select in `OverviewSection` saved with main form update.

### Metrics / milestones

Separate client actions per row; each hits one Prisma mutation (reorder = two sequential updates). Revalidates `/admin/portfolio`, `/admin/portfolio/{id}`, `/`.

### Hard delete

`PortfolioList` → `deletePortfolioAction` → `db.portfolio.delete` (cascades metrics + versions). **Does not delete R2 objects or gallery media assets.**

### Media upload (current UI)

`MediaPicker` / `MediaLibraryUpload` → `POST /api/media/upload` → `requireAdmin` → `uploadMedia` → S3/local provider → `createMediaAsset`.

---

## 4. Slug behavior

| Question | Evidence |
|----------|----------|
| Editable in admin after create? | **YES** — `OverviewSection` slug `Input` (`register("slug")`) |
| Auto-generated? | **YES** on create if blank — `assignPortfolioSlug` |
| Server can mutate? | **YES** — `updatePortfolioItem` calls `assignPortfolioSlug` when `extended.slug` set |
| Public URLs | `/projects/{slug}` (`src/app/projects/[slug]/page.tsx`) |
| Redirect on slug change? | **NO** evidence in repo |
| Stable identity practice | Slugs are migrated 1:1 to Platform; editorial slug list is stable |

**Classification: YELLOW** — UI permits post-create edits, but production slugs are stable and Platform V1 is immutable. Phase 11 should disable slug field after create (or ignore PATCH) without blocking cutover.

---

## 5. Lifecycle / `sunset`

| Question | Evidence |
|----------|----------|
| Defined | `LIFECYCLE_STATUSES = ["active", "archived", "sunset"]` (`src/lib/types/portfolio.ts`) |
| Admin selectable? | **YES** — `OverviewSection` |
| Public UI uses lifecycle? | **NO** — only `publishStatus` gates public visibility (`src/lib/portfolio/public-project.ts`) |
| Filtering | **NO** lifecycle filter on public reads |
| Known `sunset` usage | Royal Canine in `portfolio-export-m1.json`; Phase 10 docs note API normalizes to `active` |
| vs `archived` | Both stored; neither affects public visibility independently of `publishStatus` |

**Recommendation: A** — Retire `sunset` in Portfolio editor; map existing `sunset` → `active` (or `archived` if editorial intent) when writing to Platform. Not visitor-visible today.

---

## 6. Delete / archive / unarchive

| Capability | Portfolio today | Platform API |
|------------|-----------------|--------------|
| Hard delete | **YES** — `deletePortfolioAction`, confirm dialog | No hard-delete case study |
| Archive | Lifecycle enum `archived` only | Dedicated archive endpoint |
| Unarchive / restore | **NO** | No unarchive endpoint |
| Draft delete | Hard delete or set `publishStatus=draft` | N/A |

Hard delete cascades `portfolio_metrics` and `project_versions` only. R2 objects and `media_assets` rows are untouched.

**Classification:** Hard delete → **ORANGE** (workflow must switch to Platform archive). Unarchive → **GREEN** (not required today). Lifecycle `archived` vs Platform archive → **YELLOW** (align semantics in M5).

---

## 7. Admin edit-state requirements

Editor load (`src/app/admin/portfolio/[id]/page.tsx`) fetches:

- Full `Portfolio` row via `getPortfolioItemById`
- OG URL via `getMediaAssetById(ogMediaId)`
- Metrics via `listMetricsForPortfolio`
- Milestones via `listVersionsForPortfolio`

**Required shape:** all scalar fields, JSON collections (gallery, features, responsibilities, platform features), publish/lifecycle, SEO, links, hero URL + `heroMediaId`, OG `ogMediaId`, metrics[], milestones[].

**Platform admin detail gap:** Known API limitation — `AdminCaseStudyDetail` lacks `media[]`.

**Current Portfolio dependency:** `MediaPicker` calls `listMediaAssetsAction` → **Portfolio `media_assets` table**, not project-scoped media. Hero/gallery/OG selection requires global media library list with `id` + `publicUrl`.

**Recommendation: B** — Add dedicated Platform admin media-list endpoint (or scoped list per case study). Extending `AdminCaseStudyDetail` with `media[]` alone is insufficient for picker UX (global library pattern). Option A (detail-only) could work only if UX is redesigned to embedded per-project media — **not current architecture**.

---

## 8. Media workflow (verified)

| Step | Implementation |
|------|----------------|
| File selection | Browser file input in `MediaPicker`, `MediaLibraryUpload` |
| Upload path in UI | `POST /api/media/upload` (file through Portfolio server) |
| Presign path | `POST /api/media/presign` + `complete` — **server-ready, UI-unused** |
| Object keys | `createMediaObjectKey` → `portfolio/projects/heroes/{timestamp}-{filename}` |
| Public URL | `S3StorageProvider.getPublicUrl` / `S3_PUBLIC_URL_BASE` |
| Hero | FK `heroMediaId` + denormalized `img` URL |
| OG | FK `ogMediaId` (URL resolved at load) |
| Gallery | JSON `[{ mediaId?, url, alt?, caption? }]` — append/remove, **no reorder** |
| Alt/caption | Gallery inline; library-level via `MediaMetadataForm` |
| Replacement | Pick new asset; old R2 object **not** auto-deleted |
| Delete | `deleteMedia` — blocks if referenced; deletes R2 + DB row |
| Role changes | FK reassignment only; no media-role PATCH |
| Dimensions/MIME/size | Captured on upload when provided; not extracted client-side |

---

## 9. Media security

| Variable | Exposure | File | Safe? |
|----------|----------|------|-------|
| `S3_ACCESS_KEY_ID` | Server only | `src/lib/storage/config.ts` | Safe |
| `S3_SECRET_ACCESS_KEY` | Server only | `src/lib/storage/config.ts` | Safe |
| `DATABASE_URL` | Server only | `src/lib/db/client.ts` | Safe |
| `AUTH_SECRET` | Server only | `src/lib/auth/env.ts` | Safe |
| `DEVLAUNCH_PLATFORM_API_URL` | Server only | `src/lib/project-read/config.ts` | Safe |
| `NEXT_PUBLIC_*` | — | **None in repo** | Safe |

Browser never receives long-lived storage credentials. Current upload sends bytes to Portfolio server, not direct R2.

**Phase 11 target flow** requires migration from server-buffered upload to Platform presign → browser PUT → Platform register.

---

## 10. R2 CORS

Current production UI path (`/api/media/upload`) does **not** require browser→R2 CORS.

Phase 11 presigned PUT flow **will** require R2 bucket CORS for Portfolio origins.

**OPERATOR ACTION — PHASE 11 PRE-CUTOVER:** Configure R2 CORS for production Portfolio origin (`https://www.claytoncripe.com` or deployed domain), local dev (`http://localhost:3000`), and preview origins if browser-direct upload is supported there.

---

## 11. Temporary Phase 10 media rewrite

| Item | Location |
|------|----------|
| Rewrite helper | `rewritePublicAssetUrlIfConfigured` — `src/lib/storage/public-asset-url.ts` |
| Callers | `src/lib/project-read/platform-api-mapper.ts` (hero + gallery URLs) |
| Tests | `tests/unit/storage/public-asset-url.test.ts`, `tests/unit/project-read/platform-api-mapper.test.ts` |
| `S3_PUBLIC_URL_BASE_EXTRA` | `next.config.ts`, `getPublicAssetRemotePatternsFromEnv` |
| Portfolio-local media | Uses storage provider URLs directly — **no rewrite** |

Removing rewrite after Platform canonical `public_url` normalization affects **read mapper + next/image extra host only** — not admin upload/write paths.

---

## 12. Cache invalidation

### Current behavior (Prisma writes)

| Mutation | `revalidatePath` targets |
|----------|-------------------------|
| `create/update/deletePortfolioAction` | `/` only |
| Metrics / milestones actions | `/admin/portfolio`, `/admin/portfolio/{id}`, `/` |
| Media metadata/delete | `/admin/media` only |
| **Project detail public route** | **Never invalidated** |
| `revalidateTag` / `unstable_cache` | **Not used** |

Admin editor reflects DB immediately via `router.refresh()` / server component reload. Public pages use Phase 10 Platform API fetch with `revalidate: 3600` — **writes do not invalidate Platform ISR cache today**.

### Phase 11 recommendation

After Platform writes, call at minimum:

- `revalidatePath("/")`
- `revalidatePath(`/projects/${slug}`)` for affected slug(s)

Consider `revalidateTag("project-read")` on Platform fetch + page segments for a single invalidation contract (requires adding tags to `platform-api-client.ts` and pages). `revalidatePath` alone is sufficient for M7 but tag-based is cleaner long-term.

---

## 13. Error / retry UX

- Pattern: `ActionResult<T>` (`src/lib/types/actions.ts`)
- Feedback: `sonner` toasts (`toast.success` / `toast.error`)
- Validation: Zod → joined message strings in actions
- Deletes: `ConfirmDialog` (metrics/media) or `window.confirm` (portfolio list)
- **No retry**, **no optimistic updates** for project saves
- Phase 11 needs thin adapter mapping Platform `401/403/404/409/422/429/5xx` → same `ActionResult` error strings

---

## 14. Authorization boundary

| Layer | Mechanism | File |
|-------|-----------|------|
| Middleware | `/admin/*` auth + admin role | `middleware.ts` |
| Admin layout | `requireAdminPage` | `src/app/admin/layout.tsx` |
| Server actions | `requireAdmin` | all `src/lib/actions/*` |
| API routes | `requireAdmin` | `src/app/api/media/*` |
| Draft preview | `requireAdminUser` on `?preview=1` | `src/app/projects/[slug]/page.tsx` |

**`DEVLAUNCH_PLATFORM_API_TOKEN` insertion point:** New server-only module parallel to read client, e.g. `src/lib/project-write/platform-api-admin-client.ts`, loaded from env in `src/lib/project-write/config.ts`. Never import from client components.

---

## 15. Transaction / atomicity

- **No** Prisma `$transaction` anywhere in project writes
- Project scalar + JSON collections: **single** `portfolio.update`
- Metric/version reorder: **two sequential** updates
- Metrics/milestones already separate HTTP-style operations from main form

**Classification:** Main form → **GREEN** (maps to Platform PATCH). Reorder → **YELLOW** (multi-call). No **ORANGE** atomicity requirements identified.

---

## 16. Identity / ID mapping

| ID | Admin usage today |
|----|-------------------|
| Portfolio UUID | Edit route `/admin/portfolio/[id]`, actions |
| Slug | Preview URL, public routes, `HOME_FEATURED_SLUGS` |
| Metric UUID | `MetricRow` actions |
| Milestone UUID | `ProjectEvolutionRow` actions |
| Media UUID | `MediaPicker`, `heroMediaId`, `ogMediaId`, gallery `mediaId` |

Phase 10 read path synthesizes stable UUIDs from slug for display only (`stablePortfolioId` in mapper) — **not valid for Platform writes**.

**Phase 11 bridge:** Use Platform case-study UUID as authoritative after first load; slug remains lookup key for preview URLs and featured config. Store Platform IDs in editor session/state (hidden fields or server-loaded context). No cross-DB mapping table required if admin routes transition to Platform ID or slug-based Platform admin GET.

---

## 17. Featured / root ordering

| Mechanism | Admin editable? | Public effect (Phase 10 Platform read) |
|-----------|-----------------|----------------------------------------|
| `HOME_FEATURED_SLUGS` | **NO** — code constant | Controls which 4 projects appear first |
| `sortOrder` | **YES** | **Ignored** — mapper sets `sortOrder: 0` |
| `projectType` | **YES** | From API `project_type`; DB sort helper not applied on API path |

**Classifications:** Featured slugs → **BLUE**. Root `sortOrder` → **ORANGE** if shared ordering is required on Platform (missing from API); currently masked by slug-based featured curation.

---

## 18. Draft preview

Route: `/projects/{slug}?preview=1`

1. Try Platform published read via `getProjectReadProvider()`
2. If missing and `preview=1`, `requireAdminUser()` then `getPortfolioItemBySlug` + DB metrics/versions
3. Renders shared `CaseStudyPage` with `ProjectPreviewBanner`

**Phase 11:** Preview for unpublished content must use **Platform admin GET** (not public read). Media required for faithful preview. Portfolio-local IDs in preview path must switch to Platform admin detail + media list.

---

## 19. Portfolio DB post-cutover role

| Table / domain | Post-cutover role |
|----------------|-------------------|
| `portfolio` | **A/B** — rollback snapshot; optional transitional read for preview until admin fully on Platform |
| `portfolio_metrics` | **A** — rollback snapshot after write cutover |
| `project_versions` | **A** — rollback snapshot |
| `media_assets` | **C** — still required for **article covers** and until article media migrates |
| `articles`, `reviews`, `users` | **C** — Portfolio-local domains |
| `audit_log` | **C** — Portfolio-local |

Disabling shared-domain Prisma writes without Platform parity would break: admin project editor, draft preview, media picker (DB list), `/api/portfolio`, and any operator rollback expectation. It would **not** break articles/reviews FK integrity.

---

## 20. Reconciliation matrix (Portfolio evidence)

| Operation | Class | Notes |
|-----------|-------|-------|
| Create | **GREEN** | Platform POST |
| Scalar edit | **GREEN** | Platform PATCH |
| Slug edit post-create | **YELLOW** | Disable in UI; Platform immutable |
| Publish | **GREEN** | Platform publish |
| Unpublish | **GREEN** | Platform unpublish |
| Archive | **YELLOW** | Map lifecycle + replace hard delete |
| Restore/unarchive | **GREEN** | Not used today |
| Hard delete | **ORANGE** | Must remove/replace with archive |
| Lifecycle `sunset` | **YELLOW** | Map to `active`/`archived` |
| Metrics | **GREEN** | Platform CRUD + order |
| Milestones | **GREEN** | Platform CRUD + order |
| Technologies | **YELLOW** | Portfolio `highlights` legacy; API uses structured technologies |
| Categories | **GREEN** | PATCH collections |
| Links | **GREEN** | PATCH collections |
| Features / responsibilities | **GREEN** | `content_items` |
| Platform capabilities | **GREEN** | `content_items` capability kind |
| Consumer settings | **BLUE** | Not in Portfolio |
| Admin load | **YELLOW** | Needs Platform media list |
| Draft preview | **YELLOW** | Admin GET + auth |
| Media list | **ORANGE** | Platform gap — required for picker |
| Media upload | **YELLOW** | Shift to Platform presign/register |
| Hero/OG | **YELLOW** | FK model differs; role via Platform media |
| Gallery | **YELLOW** | JSON today → Platform media roles |
| Media metadata | **GREEN** | Platform PATCH (no role change) |
| Media delete | **YELLOW** | Platform deletes metadata only; R2 orphan policy |
| Cache invalidation | **YELLOW** | Must add path/tag invalidation |
| Homepage featured | **BLUE** | Stays Portfolio-local |
| Root ordering | **ORANGE** | Not on Platform; low impact due to featured slugs |

---

## 21. Validated milestone sequence

API audit order remains valid with one adjustment: **admin media list (Platform) is a hard dependency before media picker migration (M6)** and should be coordinated with **M2 admin load**.

| Milestone | Objective | Portfolio surfaces | Platform change | Rollback boundary |
|-----------|-----------|-------------------|-----------------|-------------------|
| **M1** | Write client + `PROJECT_WRITE_SOURCE` flag (default DB) | `src/lib/project-write/*`, tests | None for flag-only | Flag off → existing Prisma |
| **M2** | Admin load from Platform admin GET | `admin/portfolio/[id]/page.tsx`, editor loaders | Media list endpoint **or** detail `media[]` + list | Flag per provider |
| **M3** | Scalar + collection PATCH | `portfolio.ts` actions, `ProjectEditor` | PATCH case study | DB provider fallback |
| **M4** | Metrics + milestones | metric/version actions | Child CRUD APIs | DB provider fallback |
| **M5** | Lifecycle + publish + archive (remove hard delete) | `OverviewSection`, `PortfolioList` | publish/unpublish/archive | DB provider fallback |
| **M6** | Media presign/register + picker | `MediaPicker`, media APIs | presign/register + list | Keep server upload path behind flag |
| **M7** | Cache invalidation | all write actions | none | N/A |
| **M8** | Remove Phase 10 read rewrite | `platform-api-mapper`, `public-asset-url` | canonical `public_url` | Keep rewrite behind env flag |
| **M9** | Production write cutover | env + operator | production token + CORS | `PROJECT_WRITE_SOURCE=database` |

---

## 22. Proposed M1 scope (smallest safe start)

**Objective:** Server-only Platform admin write client boundary with feature flag; **no production write migration**.

### Create

| File | Purpose |
|------|---------|
| `src/lib/project-write/config.ts` | `PROJECT_WRITE_SOURCE`, `DEVLAUNCH_PLATFORM_API_TOKEN`, `assertPlatformApiWriteConfigured`, timeout |
| `src/lib/project-write/errors.ts` | `PlatformApiAdminResponseError`, network/malformed types (mirror read client) |
| `src/lib/project-write/platform-api-admin-client.ts` | Authenticated fetch to `{base}/api/v1/admin/*`, scoped helpers stubbed or minimal (health/list only) |
| `src/lib/project-write/index.ts` | `getProjectWriteProvider()` factory, `resetProjectWriteProviderForTests()` |
| `tests/unit/project-write/config.test.ts` | Env isolation (same pattern as Phase 10) |
| `tests/unit/project-write/platform-api-admin-client.test.ts` | Mock fetch; auth header; error mapping |

### Do not change in M1

- `src/lib/actions/portfolio.ts` (or other mutations)
- Prisma schema
- Admin UI behavior
- `PROJECT_READ_SOURCE` behavior

### Config defaults

- `PROJECT_WRITE_SOURCE` unset / invalid → `database` (current Prisma path)
- `platform-api` without token → throw `ProjectWriteConfigurationError` at provider init (mirror read URL rule)

### Reuse from Phase 10

- `getPlatformApiBaseUrl`, timeout patterns from `src/lib/project-read/config.ts` (shared or imported — avoid duplicating URL normalization)

### `.env.example` (documentation only when implemented)

```
# PROJECT_WRITE_SOURCE=database
# PROJECT_WRITE_SOURCE=platform-api
# DEVLAUNCH_PLATFORM_API_TOKEN=
```

---

## 23. Blocker classification

| Item | Classification |
|------|----------------|
| Portfolio DB dependencies (articles) | **NON-BLOCKING** for project write cutover |
| Slug immutability | **PRE-CUTOVER** (UI/adapter); not M1 blocker |
| `sunset` lifecycle | **PRE-CUTOVER** mapping |
| Hard delete | **PRE-CUTOVER** — replace with archive |
| Unarchive | **NON-BLOCKING** |
| Admin media list | **PRE-CUTOVER** — **blocks M6 / full editor parity** |
| Service credential | **PRE-CUTOVER** for production; dev/staging for M2+ |
| R2 CORS | **PRE-CUTOVER** for presign UI |
| Cache invalidation | **PRE-CUTOVER** |
| Canonical media / rewrite removal | **NON-BLOCKING** (M8, after write cutover) |
| Media orphan cleanup | **NON-BLOCKING** |
| Error UX adapter | **PRE-CUTOVER** (can iterate during M3–M6) |
| Identity mapping | **PRE-CUTOVER** (M2+) |
| Transaction differences | **NON-BLOCKING** |
| Draft preview on Platform | **PRE-CUTOVER** (M2/M5) |
| Root `sortOrder` on Platform | **NON-BLOCKING** (featured slugs mitigate) |

**BLOCKER before M1:** None identified — M1 is client boundary only.

**BLOCKER before production write cutover:** Admin media list, hard-delete replacement, cache invalidation, service credential, R2 CORS (for presign), Platform production write readiness (external).

---

## 24. Final recommendation

### **READY TO AUTHORIZE PHASE 11 M1**

M1 (write client + feature flag + tests, defaulting safely to database) can begin without Platform API schema changes. Production write cutover remains **NOT READY** until pre-cutover items above are resolved in later milestones and the Platform API operator confirms production write readiness.

**Phase 11 status:** **NOT STARTED / NEXT**

**Phase 11 status:** **IN PROGRESS** — M1 implemented (see `docs/phase-11/m1-write-client-report.md`)

This audit document itself made no application changes; M1 implementation is documented separately.
