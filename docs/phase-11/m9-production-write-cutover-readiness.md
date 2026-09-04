# Phase 11 — M9 Production Write Cutover Readiness / Operator Handoff

**Date:** 2026-09-04  
**Status:** M9 IMPLEMENTED / READINESS COMPLETE — awaiting acceptance (acceptance correction applied)  
**Phase 11:** IN PROGRESS (not closed)  
**P11-M1–M8:** ACCEPTED / CLOSED  
**P11-M9:** IMPLEMENTED / READINESS COMPLETE — awaiting acceptance  
**Phase 12 / later closeout:** NOT STARTED / NOT AUTHORIZED

## Final recommendation

**P11-M9 READINESS COMPLETE / CUTOVER BLOCKED**

Code-side cutover gates are satisfied after M9 create-path blocking and source-coherence validation. Production cutover remains **operator-blocked** until external prerequisites complete (service credential, R2 CORS, canonical Platform `R2_PUBLIC_BASE_URL`, parity verification, optional Platform M8A).

---

## Acceptance correction (source coherence + archived bridge)

### Pre-correction unsafe path

Independent parsers allowed:

- `PROJECT_READ_SOURCE=platform-api` + unset/invalid `PROJECT_WRITE_SOURCE` → effective **platform-api/database** split ownership
- Invalid write typo (`platfrom-api`) silently fell back to database while read remained platform-api

### Post-correction policy

`src/lib/project-source/coherence.ts` enforces **matched steady states only**:

| Steady state | Allowed |
|--------------|---------|
| unset/unset → database/database | Yes (local dev default) |
| database/database | Yes |
| platform-api/platform-api (+ URL/token when used) | Yes |
| Any mixed or invalid pair | **Rejected** (`ProjectSourceConfigurationError`) |

`getProjectReadSource()` and `getProjectWriteSource()` both consult the shared coherent configuration cache.

**Mixed-source is no longer a supported transitional deployment state.** Operators must set both sources together in one Vercel env change + deploy.

### Archived identity bridge

- Endpoint: admin `GET /api/v1/admin/case-studies` via `listCaseStudies()`
- M5 contract: public reads exclude `archived_at IS NOT NULL`; admin archive returns detail with `lifecycle_status=archived`
- Portfolio fix: `resolvePlatformCaseStudyIdBySlug()` now **paginates** through admin list pages (not only first page)
- Result: **PROVEN SAFE in Portfolio code** for archived slugs present in admin list; **operator smoke test** still required to confirm production admin list includes archived case studies

---

## Write-surface inventory (summary)

| Capability | DB mode | Platform-api mode | Authoritative | Cache (platform) |
|------------|---------|-------------------|---------------|------------------|
| A. Create project | Prisma | **BLOCKED** (M9) | Prisma / N/A | N/A |
| B–H. Edit scalars/collections | Prisma | Platform PATCH | Platform | `content` |
| I–K. Metric CRUD | Prisma | Platform | Platform | `content` |
| L. Metric reorder | Prisma | **Blocked** | — | — |
| M–O. Milestone CRUD | Prisma | Platform | Platform | `content` |
| P. Milestone reorder | Prisma | **Blocked** | — | — |
| Q–S. Publish/unpublish/archive | Prisma dropdown | Platform POST | Platform | `membership` |
| T. Hard delete | Prisma | **Blocked** | — | — |
| U. Sunset | Prisma dropdown | **Unavailable** | — | — |
| V–Y. Hero upload/select | Prisma media | Platform presign/register | Platform | register/PATCH/DELETE |
| X/Z. Hero/OG clear | Prisma | **Unsupported** | — | — |
| AB–AD. Gallery upload/select/remove | Prisma | Platform | Platform | register/DELETE |
| AE. Gallery reorder | Prisma | **Blocked** | — | — |
| AF. Media alt/caption | Prisma | Platform PATCH | Platform | `content` |
| AG. Media delete | Prisma | Platform DELETE metadata | Platform | `content` |

No dual-write. No Prisma fallback on Platform write failure.

---

## Project create cutover decision

**OPTION B — CREATE MUST BE BLOCKED DURING CUTOVER**

Evidence (pre-M9): `createPortfolioAction` always called `createPortfolioItem` (Prisma) with no `PROJECT_WRITE_SOURCE` guard; UI exposed `/admin/portfolio/new`.

**M9 fix:**

- `platform-create-policy.ts` + server action rejects before Prisma I/O
- Admin list hides **Add Project** when `platform-api`
- `/admin/portfolio/new` shows explicit unavailable message (no editor)

**OPTION C** (Platform-backed create) remains a **separately authorized** future milestone.

---

## Read / write source matrix (effective, post-correction)

| READ (raw) | WRITE (raw) | Effective read | Effective write | Starts? | Writes enabled | Create exposed | Split ownership? |
|------------|-------------|----------------|-----------------|---------|----------------|----------------|------------------|
| unset | unset | database | database | Yes | Yes (Prisma) | Yes | No |
| database | database | database | database | Yes | Yes (Prisma) | Yes | No |
| platform-api | platform-api (+ URL/token) | platform-api | platform-api | Yes | Yes (Platform) | **No** (M9) | No |
| platform-api | unset | — | — | **No** | — | — | Would be yes (rejected) |
| platform-api | invalid | — | — | **No** | — | — | Would be yes (rejected) |
| platform-api | database | — | — | **No** | — | — | Would be yes (rejected) |
| database | platform-api | — | — | **No** | — | — | Would be yes (rejected) |
| invalid | platform-api | — | — | **No** | — | — | Would be yes (rejected) |
| invalid | database | — | — | **No** | — | — | N/A (rejected) |

**Supported steady states:** `database/database` (rollback/local default) and `platform-api/platform-api` (target production).

**Mixed-source:** **unsupported** — `ProjectSourceConfigurationError` at first read/write provider access. Do not deploy read/write separately.

---

## Target production configuration

```
PROJECT_READ_SOURCE=platform-api
PROJECT_WRITE_SOURCE=platform-api
DEVLAUNCH_PLATFORM_API_URL=<production API URL>   # required
DEVLAUNCH_PLATFORM_API_TOKEN=<server-only>        # required
S3_PUBLIC_URL_BASE=https://media.devlaunchsystems.com
```

Optional during transition: `S3_PUBLIC_URL_BASE_EXTRA` for `*.r2.dev` (database rollback / compatibility).

---

## Config fail-safe

| Setting | Unset/invalid | platform-api explicit |
|---------|---------------|------------------------|
| `PROJECT_WRITE_SOURCE` | → `database` | → `platform-api` |
| `PROJECT_READ_SOURCE` | → `database` | → `platform-api` |
| Invalid write source | **Error** (no silent database fallback when paired with platform read) |
| Missing URL/token in platform-api pair | `ProjectWriteConfigurationError` / `ProjectReadConfigurationError` |

**Risk mitigated:** typo on one source no longer creates platform-api/database split ownership.

---

## Service credential scope matrix

| Operation | Endpoint (conceptual) | Scope |
|-----------|-------------------------|-------|
| List/get case studies | GET admin case-studies | `content:read` |
| Update project (M3) | PATCH case-study | `content:write` |
| Publish/unpublish/archive | POST lifecycle | `content:write` + `content:archive` (archive) |
| Metric/milestone CRUD | POST/PATCH/DELETE | `content:write` |
| Media presign/register/PATCH | POST/PATCH | `media:write` |
| Media DELETE | DELETE | `media:write` |
| Media list | GET admin media | `media:write` |

Token: server-only (`DEVLAUNCH_PLATFORM_API_TOKEN`). Not in client bundle, presign payload, or logs.

---

## Platform production prerequisites (operator)

- [ ] Production API healthy (`/health`, `/ready`)
- [ ] Production DB migrated; shared data present
- [ ] Service credential with required scopes
- [ ] `R2_PUBLIC_BASE_URL=https://media.devlaunchsystems.com`
- [ ] R2 CORS for production Portfolio admin origin (browser PUT)
- [ ] Platform M8A disposition resolved (see below)
- [ ] Parity audit vs Portfolio bridge slugs

---

## M8A disposition

**Soft pre-retirement / not a hard write-cutover blocker** if:

- Compatibility rewrite remains active (M8)
- Operator confirms canonical `R2_PUBLIC_BASE_URL` for **new** registrations
- Operator accepts historical `public_url` may remain `r2.dev` until M8A

**Hard blocker for compatibility retirement**, not for enabling Platform writes on existing projects.

---

## R2 CORS disposition

**HARD GATE** for production media writes (presign → browser PUT → register).

Without CORS: scalar/child/lifecycle writes may work; media upload fails in browser.

Operator configures Cloudflare R2 CORS for production admin origin. Portfolio does not configure R2.

---

## Canonical media domain

New production rows must not rely on Portfolio display rewrite. Operator must confirm Platform `R2_PUBLIC_BASE_URL` before cutover. Historical rows protected by rewrite until M8A.

---

## Rollback snapshot

`PROJECT_WRITE_SOURCE=database` + `PROJECT_READ_SOURCE=database` restores Prisma-backed service. **Does not reconcile** Platform edits made while on platform-api. Prisma lifecycle/title/media fields may be stale. No reverse sync.

**Pre-cutover:** operator should capture Portfolio DB export + run `audit:platform-media-urls` / compare-project-read-providers.

---

## UUID bridge

```
portfolioLocalId → Prisma slug → resolvePlatformCaseStudyIdBySlug(admin list) → Platform UUID
```

Fails loudly if: missing Prisma row, missing slug, slug not in Platform list, ambiguous slug.

**Archived projects:** admin `listCaseStudies` (paginated) resolves slug → Platform UUID. M5 documents admin archive retains manageability; public list excludes archived. Operator smoke test: open archived project by local UUID after archive.

---

## Admin list staleness

Prisma-backed list shows **identity/navigation snapshot** (caption, description, img with display rewrite). No lifecycle badges. **Acceptable** — editor loads authoritative Platform state. Title/image on list may lag until operator refreshes page after external changes.

---

## Read/write sequencing (operator)

**Atomic cutover only** (mixed pairs are rejected):

1. Complete all pre-cutover prerequisites (credential, CORS, parity, snapshots)
2. In **one** Vercel env update, set **both** `PROJECT_READ_SOURCE=platform-api` and `PROJECT_WRITE_SOURCE=platform-api` (+ URL/token)
3. Deploy once through GitHub → Vercel
4. Run non-destructive smoke tests, then controlled write tests

Do **not** deploy read-first then write-later — incoherent pairs fail closed and a partial env state is not a supported steady state.

---

## Production cutover order (operator)

### Pre-cutover

1. Merge accepted Phase 11 code
2. Confirm Platform API version/contracts
3. Create service credential; store token in Vercel (server-only)
4. Confirm `R2_PUBLIC_BASE_URL` canonical
5. Configure/verify R2 CORS
6. Run parity audit (slugs, counts, lifecycle, media roles)
7. Run `npm run audit:platform-media-urls` (read-only)
8. Platform M8A if required by operator policy
9. Capture Portfolio DB export snapshot

### Cutover

10. In **one env change**, set `PROJECT_READ_SOURCE=platform-api` **and** `PROJECT_WRITE_SOURCE=platform-api` (+ token)
11. Deploy via GitHub → Vercel
12. Non-destructive smoke tests
13. Controlled write smoke tests
14. Verify M7 cache/read-after-write
15. Monitor logs

### Post-cutover

16. Document verification
17. Retain compatibility rewrite until M8 retirement criteria met

---

## Smoke tests (operator — do not run from Cursor)

### Non-destructive

1. Platform API health/ready
2. Public homepage + project detail
3. Admin portfolio list
4. Admin editor load (existing project)
5. Platform media list in editor
6. Image renders (canonical + rewrite)

### Controlled writes (existing non-critical project)

A. Reversible scalar text edit → admin refresh → public check if published → restore  
B. Temporary metric/milestone CRUD if acceptable  
C. Lifecycle only on dedicated draft/test record — **never archive production project casually**  
D. Media upload only after CORS — disposable gallery item; verify `media.devlaunchsystems.com` URL; DELETE metadata (R2 object may remain orphan)

### Destructive warnings

- Archive is **irreversible** in V1 (no unarchive)
- Hard delete unavailable in platform-api mode
- Media DELETE does not remove R2 binary

---

## Rollback triggers

- Broad Platform 401/403/5xx on admin load/write
- Identity bridge failures for existing slugs
- Public pages broken beyond ISR window
- Media upload fails with CORS confirmed correct
- Unexpected Prisma writes observed
- Create succeeds in platform-api mode (regression)

## Rollback procedure

1. Set `PROJECT_WRITE_SOURCE=database` (and `PROJECT_READ_SOURCE=database` if needed)
2. Redeploy via GitHub/Vercel
3. Verify database-mode admin/public
4. Accept Platform-side edits during cutover may not appear in Prisma snapshot

---

## Post-cutover monitoring

- Vercel function logs (admin actions, Platform errors)
- Platform/Render API logs
- Manual admin smoke (editor load, save, lifecycle, media)
- Rate-limit 429 responses (Retry-After)

---

## Compatibility rewrite status

**RETAINED** — `rewritePublicAssetUrlIfConfigured` unchanged. Safe for cutover; retirement requires M8A + verification.

---

## Readiness checklist

Repository-verified (code):

- [x] Code validation green (tests/lint/build)
- [x] Target read/write configuration defined
- [x] Create behavior coherent (Option B blocked)
- [x] Source coherence validation (acceptance correction)
- [x] Archived bridge pagination hardening
- [x] M3–M8 regression paths documented

Operator / external (unchecked):

- [ ] Platform API production healthy
- [ ] Production data parity verified
- [ ] Service credential created + scopes verified
- [ ] Token stored server-side in Vercel
- [ ] `R2_PUBLIC_BASE_URL` canonical confirmed
- [ ] R2 CORS verified
- [ ] M8A disposition executed if required by operator
- [ ] Historical media audit acceptable
- [ ] Smoke tests executed
- [ ] Rollback snapshot captured
- [ ] Operator sign-off

---

## M9 code changes

| File | Change |
|------|--------|
| `platform-create-policy.ts` | Create unavailable policy |
| `project-source/coherence.ts` | Matched read/write pair validation |
| `project-source/errors.ts` | `ProjectSourceConfigurationError` |
| `identity-bridge.ts` | Paginated admin slug resolution |
| `portfolio.ts` | Reject create before Prisma in platform-api |
| `project-read/config.ts` | Coherent `getProjectReadSource()` |
| `project-write/config.ts` | Coherent `getProjectWriteSource()` |
| `admin/portfolio/page.tsx` | Hide Add Project |
| `admin/portfolio/new/page.tsx` | Block create page |
| `platform-create-policy.test.ts` | Policy tests |
| `project-source/coherence.test.ts` | Config matrix tests |
| `platform-m9-create-cutover.test.ts` | Cutover gate tests |
| `identity-bridge.test.ts` | Archived + pagination tests |

---

## Remaining blockers before operator GO

1. **R2 CORS** (hard, media writes)
2. **Production credential + env** (hard)
3. **Parity verification** (hard)
4. **Platform M8A** (operator policy; soft for cutover, hard for rewrite retirement)
5. **Project create unavailable** until future Platform create milestone (accepted tradeoff)
