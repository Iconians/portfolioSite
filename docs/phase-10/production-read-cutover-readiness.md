# Phase 10 — Production Read Cutover Readiness Review

**Date:** 2026-09-03  
**Status:** REVIEW COMPLETE — **NO CUTOVER PERFORMED**  
**Production Platform API:** `https://api.devlaunchsystems.com`  
**Phase 9 production migration:** complete (reconciliation + idempotency passed)

---

## 1. Current Production Provider Selection

### Implementation (`src/lib/project-read/config.ts`)

```typescript
if (nodeEnv === "production") {
  return "database";
}
```

**Actual behavior today:**

| Aspect | Behavior |
|--------|----------|
| Production (`NODE_ENV=production`) | **Always `database`** — hardcoded lock; ignores `PROJECT_READ_SOURCE` |
| Non-production | `PROJECT_READ_SOURCE=platform-api` + `DEVLAUNCH_PLATFORM_API_URL` enables API provider |
| Missing/invalid env | Falls back to `database` |
| API URL alone | Does **not** enable API reads |

### Factory (`src/lib/project-read/index.ts`)

- Singleton `cachedProvider` resolved at **runtime** on first `getProjectReadProvider()` call
- Not build-time selected — env read when server handles request
- Vercel env changes require **redeploy** for new values to load; no rebuild of static project data at edge without redeploy + ISR expiry

### Routes using provider

| Route | Provider | Notes |
|-------|----------|-------|
| `src/app/page.tsx` | `getPublishedPortfolioItems()` | Homepage list |
| `src/app/projects/[slug]/page.tsx` | `getProjectReadProvider().getPublishedProjectDetail()` | Published path |
| Same route `generateMetadata` | Same load path | SEO/OG |
| Draft preview `?preview=1` | **DB direct** (`getPortfolioItemBySlug`) | Admin only |
| `src/app/api/portfolio/route.ts` | **DB direct** (`getAllPortfolioItems`) | Includes drafts |
| Admin pages | **DB direct** | List/editor |

### Client-side Platform API access

**None.** All Platform API calls are server-side via `PlatformApiReadClient` (`fetch` in Node/server components).

### Bypass summary

Admin, draft preview, `/api/portfolio`, and all writes bypass the provider by design.

---

## 2. Live Production API Parity (2026-09-03)

### Platform API probes

| Check | Result |
|-------|--------|
| `GET /health` | `200` `{"status":"ok"}` |
| `GET /ready` | `200` `{"status":"ready"}` |
| `GET /api/v1/case-studies?consumer=engineering_portfolio&audience=engineering` | `200`, **total: 7** |

**Slugs returned:** `devlaunch-crm`, `downriver-renovations`, `engineering-portfolio-management-system`, `ghost-mammoth-pickle-ball`, `intellitaskpro`, `the-royal-canine`, `tournament-registration-event-management-system`

### Aggregate comparison (Portfolio Neon DB vs live production API, mapped)

| Metric | DB | API | Match |
|--------|----|-----|-------|
| Published projects | 7 | 7 | ✓ |
| Metrics | 35 | 35 | ✓ |
| Milestones | 48 | 48 | ✓ |

### Per-project summary

| Slug | Metrics | Milestones | Caption | Summary | Hero img | Gallery | Categories | Features |
|------|---------|------------|---------|---------|----------|---------|------------|----------|
| downriver-renovations | 4/4 | 3/3 | ✓ | ✓ | ✓ | 0/0 | ✓ | ✓ |
| devlaunch-crm | 5/5 | 11/11 | ✓ | ✓ | ✓ | 8/8 | ✓ | ✓ |
| ghost-mammoth-pickle-ball | 5/5 | 6/6 | ✓ | ✓ | ✓ | 0/0 | ✓ | ✓ |
| intellitaskpro | 6/6 | 8/8 | ✓ | ✓ | ✓ | 5/5 | ✓ | ✓ |
| the-royal-canine | 4/4 | 3/3 | ✓ | ✓ | ✓ | 0/0 | ✓ | ✓ |
| tournament-registration-event-management-system | 5/5 | 8/8 | ✓ | ✓ | ✓ | 0/0 | ✓ | ✓ |
| engineering-portfolio-management-system | 6/6 | 9/9 | ✓ | ✓ | ✓ | 0/0 | ✓ | ✓ |

### Field-level differences (non-blocking unless noted)

| Field | Pattern | Impact |
|-------|---------|--------|
| `lifecycle_status` | `the-royal-canine`: DB `sunset`, API `active` | See §6 — **no public UI consumption** |
| `highlights` | 4 projects: API `technologies[]` richer than DB `highlights` split | **Not rendered on public pages** |
| `github` / `url` | DB `#` placeholder → API `null` | **Equivalent UI** (`isValidProjectLink` rejects `#`) |
| `sortOrder` | DB 0–3, API mapped `0` | May affect **non-featured** homepage card order only |
| `keyFeatures`, `role` | DB populated, API `null` | **Admin-only fields; not public UI** |
| `heroMediaId`, `ogMediaId` | DB UUIDs, API `null` | Hero `img` URL matches; OG falls back to `img` |
| Legacy `description` | DB long text vs API `summary`-derived | **No impact** — UI uses `summary` via `getProjectCardSummary` |

---

## 3. Mapping Gap Classification

| Gap | Classification | Rationale |
|-----|----------------|-----------|
| `keyFeatures` | **C — Not used by current UI** | Admin editor only; no public component reads it |
| `role` | **C — Not used by current UI** | Admin editor only |
| `heroMediaId` / `ogMediaId` | **B — Acceptable difference** | Public pages use `img` URL; `resolveOgImageUrl` falls back to `img` when `ogMediaId` null |
| `sortOrder` | **B — Acceptable difference** | Featured 4 projects use `HOME_FEATURED_SLUGS`; remaining 3 may reorder by project-type/createdAt |
| Homepage featured ordering | **E — Intentionally Portfolio-local** | `HOME_FEATURED_SLUGS` editorial constant; API `is_featured` not used |
| `highlights` enrichment | **B — Acceptable difference** | Not displayed on public pages today |
| `the-royal-canine` lifecycle | **B — Acceptable for cutover** (see §6) | `lifecycleStatus` not displayed or used for filtering on public site |
| `github` `#` normalization | **B — Acceptable difference** | Same link visibility as DB |
| Production hard lock (`NODE_ENV`) | **D — Fix before cutover** | Code change required to allow API provider in production |

**Cutover blockers from mapping gaps alone:** none for current public UI.

**Execution blocker:** production provider lock must be lifted in an authorized code change.

---

## 4. Homepage Featured Behavior

**Source:** `src/lib/portfolio/home-featured.ts`

- Featured 4 cards: `HOME_FEATURED_SLUGS` order (editorial, Portfolio-owned)
- `pickHomeFeaturedProjects()` filters provider list by slug — missing slug → card omitted (safe)
- API `is_featured` / consumer sort **not consulted**
- After cutover: same 4 slugs if all 7 exist in API response (confirmed)

**Recommendation:** Keep homepage editorial ordering **Portfolio-local** (Option E). Do not bind homepage curation to Platform API consumer settings without explicit product decision.

---

## 5. Royal Canine Lifecycle Decision

### Current state

| Source | `lifecycle_status` |
|--------|-------------------|
| Portfolio Neon | `sunset` |
| Production Platform API | `active` |
| M1 export | `sunset` |

### Public UI usage audit

- `lifecycleStatus` is **not referenced** in any public Portfolio component (`CaseStudyPage`, hero, summary, story, metrics, evolution, gallery, links)
- Used only in **admin editor** (`OverviewSection.tsx`)
- Does not affect publish visibility (both providers return published)
- No badges/styling tied to lifecycle on public pages

### Options

| Option | Description | Recommendation |
|--------|-------------|----------------|
| **A** | Accept `active` as V1 normalization for read cutover | **Recommended** — smallest change; zero visitor-visible impact |
| **B** | Extend Platform API `sunset` enum before cutover | Only if lifecycle becomes shared contract requirement |
| **C** | Portfolio-local presentation override | Unnecessary — field not shown publicly |

**Recommendation: Option A** — accept V1 normalization. Track Platform API lifecycle enum extension as a future enhancement if admin/write cutover (Phase 11) needs parity.

---

## 6. Rendering / Cache / Build Implications

| Aspect | Current behavior |
|--------|------------------|
| Rendering | **SSR** (dynamic routes `ƒ`) — not SSG/`generateStaticParams` for projects |
| Revalidation | `export const revalidate = 3600` on homepage + project pages (ISR, 1 hour) |
| Provider selection | Runtime env + code lock |
| Platform API ETags | In-memory per provider instance only; **not durable across Vercel serverless invocations** |
| Fetch cache | `cache: "no-store"` on API client |
| Stale DB content after cutover | Up to **3600s** until ISR revalidation unless on-demand revalidate or redeploy |

### Cutover operational steps (when authorized)

1. **Code:** Remove or gate the `NODE_ENV === "production"` database lock (authorized PR)
2. **Vercel env:** Set `PROJECT_READ_SOURCE=platform-api`, `DEVLAUNCH_PLATFORM_API_URL=https://api.devlaunchsystems.com`
3. **Redeploy** Portfolio production
4. **Verify** immediately (see §9)
5. **Optional:** Trigger revalidation or wait ≤1h for ISR expiry

### Rollback operational steps

1. **Code:** Restore production database lock **OR** set `PROJECT_READ_SOURCE=database`
2. **Redeploy**
3. **Verify** homepage + 7 project pages
4. Portfolio Neon data **unchanged** during API-read operation (reads only)

**Rollback time:** One Vercel redeploy (~minutes) + ISR window.

---

## 7. Failure Behavior Assessment

Phase 10 design: **no silent DB fallback** when API provider selected.

| Failure | Behavior |
|---------|----------|
| Timeout | `PlatformApiNetworkError` → page/error boundary |
| 429 | `PlatformApiResponseError` + `retryAfterSeconds` |
| 500 | `PlatformApiResponseError` |
| Malformed JSON | `PlatformApiMalformedResponseError` |
| 404 detail | Returns `null` → `notFound()` |
| Network failure | `PlatformApiNetworkError` |
| Stale cache | ISR may serve prior successful render up to 1h; no cross-provider stale cache |
| No stale cache on first request | Hard failure visible |

**Assessment:** Remains correct for production API mode. Operator accepts availability coupling to Platform API. Do **not** add silent DB fallback without architectural review (dual authority risk).

---

## 8. Service Credentials

- Production public reads: **anonymous** `GET /api/v1/case-studies` — **no bearer token**
- `service_credentials = 0` is expected for read cutover
- **Do not create** credentials for read cutover
- Credentials required only for future **Phase 11** admin/write integration (`content:*`, `media:write`)

---

## 9. Post-Cutover Validation Checklist

### Platform API

- [ ] `GET https://api.devlaunchsystems.com/health` → 200
- [ ] `GET https://api.devlaunchsystems.com/ready` → ready
- [ ] `GET .../case-studies?consumer=engineering_portfolio&audience=engineering` → total **7**

### Homepage

- [ ] Loads 200
- [ ] Featured 4 projects present (CRM, IntelliTaskPro, Ghost Mammoth, Engineering Portfolio)
- [ ] Hero images render
- [ ] "View all projects" expands remaining 3

### Project detail pages (all 200)

- [ ] `/projects/downriver-renovations`
- [ ] `/projects/devlaunch-crm` — 5 metrics, 11 milestones, 8 gallery images
- [ ] `/projects/ghost-mammoth-pickle-ball`
- [ ] `/projects/intellitaskpro` — 6 metrics, 8 milestones, 5 gallery
- [ ] `/projects/the-royal-canine`
- [ ] `/projects/tournament-registration-event-management-system` — 5 metrics, 8 milestones
- [ ] `/projects/engineering-portfolio-management-system` — 6 metrics, 9 milestones

### Per page

- [ ] Title/caption correct
- [ ] Summary/story content present
- [ ] Metrics section renders
- [ ] Evolution/milestones render
- [ ] Technology badges (categories) render
- [ ] Hero + gallery media load
- [ ] Live/github/docs links behave correctly
- [ ] No hydration/runtime errors in Vercel logs

### Operational

- [ ] No API error spike
- [ ] No unexpected 429 under normal traffic
- [ ] No broken R2/CDN asset URLs

---

## 10. Phase 11+ Protection

This review does **not** authorize:

- Platform API writes
- Service credential creation
- Admin/editor provider switch
- Draft management via API
- DevLaunch CRM changes

---

## 11. Remaining Blockers

| # | Blocker | Type |
|---|---------|------|
| 1 | Production `NODE_ENV` hard lock prevents API provider | **Execution prerequisite** (authorized code change) |
| 2 | Explicit operator authorization for cutover | **Governance** |
| 3 | Vercel env + redeploy | **Operational** |
| 4 | ISR up-to-1h stale window | **Operational awareness** |

**Data/parity blockers:** none for current public UI.

---

## 12. Recommendation

### **READY FOR PRODUCTION READ CUTOVER** (data + integration perspective)

Conditions:

- Live production API matches Portfolio Neon on all visitor-visible dimensions (7/35/48, slugs, captions, summaries, metrics, milestones, media URLs, story fields)
- Known gaps are acceptable or Portfolio-local
- Royal Canine lifecycle: accept Option A (no visitor impact)
- Cutover requires **authorized code change** to lift production database lock + Vercel env + redeploy
- No service credential needed for reads

### **NOT AUTHORIZED by this document**

Production read cutover remains **blocked until explicit operator authorization** and execution of the cutover procedure in §6.

---

## Platform API Plan Status Note

Production Platform API data migration (Phase 9) is **complete**. Engineering Portfolio production read-cutover readiness review is **complete**. Production read cutover is **not executed**.
