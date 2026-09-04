# Phase 11 — M1 Write Client Report

**Date:** 2026-09-04  
**Status:** M1 IMPLEMENTED — **acceptance review complete (identifier contract corrected)**  
**Phase 11:** IN PROGRESS  
**M2:** NOT STARTED / NOT AUTHORIZED

## Scope

M1 introduces the server-side Platform API administrative/write client boundary only.

No existing Portfolio project mutations were changed. All admin writes continue through Prisma unless a future milestone integrates the write provider.

## Files added

| File | Purpose |
|------|---------|
| `src/lib/project-write/config.ts` | `PROJECT_WRITE_SOURCE`, token loading, `assertPlatformApiWriteConfigured` |
| `src/lib/project-write/errors.ts` | Configuration, network, response, malformed errors |
| `src/lib/project-write/platform-api-admin-client.ts` | Bearer-authenticated admin client |
| `src/lib/project-write/provider.ts` | Write provider factory (testable without server-only) |
| `src/lib/project-write/index.ts` | Server-only public entry re-exports |
| `tests/unit/project-write/config.test.ts` | Configuration + read/write independence |
| `tests/unit/project-write/platform-api-admin-client.test.ts` | Admin client HTTP/error/token-leak tests |
| `tests/unit/project-write/provider-selection.test.ts` | Provider factory tests |

## Files modified

| File | Change |
|------|--------|
| `.env.example` | Document `PROJECT_WRITE_SOURCE` and `DEVLAUNCH_PLATFORM_API_TOKEN` |
| `package.json` / `package-lock.json` | Add `server-only` dependency for public entry guard |

## Validation (2026-09-04)

| Check | Result |
|-------|--------|
| `tests/unit/project-write/` | **31 pass** |
| `tests/unit/project-read/` | **pass** (unchanged) |
| Full suite | **198 pass, 1 skip, 0 fail** |
| ESLint | **PASS** |
| Production build | **PASS** |

## Configuration behavior

| `PROJECT_WRITE_SOURCE` | Result |
|------------------------|--------|
| unset | `database` |
| `database` | `database` |
| `platform-api` | `platform-api` (requires URL + token) |
| invalid | `database` |

Explicit `platform-api` with missing `DEVLAUNCH_PLATFORM_API_URL` or `DEVLAUNCH_PLATFORM_API_TOKEN` throws `ProjectWriteConfigurationError` — **no database fallback**.

`PROJECT_READ_SOURCE` and `PROJECT_WRITE_SOURCE` are independent.

Reused from Phase 10 read config:

- `getPlatformApiBaseUrl`
- `getPlatformApiTimeoutMs`

## Admin client (M1 surface)

- `listCaseStudies()` → `GET /api/v1/admin/case-studies`
- `getCaseStudyById(id)` → `GET /api/v1/admin/case-studies/{id}` where `{id}` is the **Platform case-study UUID** (not slug, not Portfolio-local UUID)

Shared request helper handles 2xx JSON, 204/205 no-content, 401/403/404/409/422/429/5xx, network/timeout, malformed JSON.

### Admin detail identifier contract (M1 acceptance)

Per the authoritative Pre-Phase 11 Platform API audit (external) and the Portfolio companion audit identity findings (`docs/phase-11/portfolio-write-surface-audit.md` §18): admin detail uses Platform UUID. Slug remains for public URLs, preview links, and `HOME_FEATURED_SLUGS` — not for admin detail path segments.

M1 initially documented `getCaseStudy(slug)` incorrectly; corrected to `getCaseStudyById(id)` during acceptance review.

## Provider factory

`getProjectWriteProvider()` returns:

- `{ source: "database" }` by default
- `{ source: "platform-api", client }` when configured

`resetProjectWriteProviderForTests()` clears memoized provider.

## Security

- `import "server-only"` on config, admin client, and index entry
- Token never returned from public APIs, never logged, never included in error messages
- Unit test regression: fake token must not appear in thrown errors

## Deferred (M2+)

- Wire server actions to write provider
- Admin load from Platform admin detail
- Mutation methods (create, patch, publish, archive, metrics, milestones, media)
- Cache invalidation after Platform writes
- Production service credential / R2 CORS

## Cross-reference

Pre-Phase 11 audit: `docs/phase-11/portfolio-write-surface-audit.md`

## Validation

Recorded at implementation time in agent return summary.

**No commit, push, deploy, or external infrastructure changes.**
