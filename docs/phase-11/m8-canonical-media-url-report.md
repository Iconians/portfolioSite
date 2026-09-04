# Phase 11 — M8 Canonical Media URL Migration / Compatibility Retirement Readiness

**Date:** 2026-09-04  
**Status:** M8 IMPLEMENTED / READINESS COMPLETE — awaiting acceptance  
**Phase 11:** IN PROGRESS  
**P11-M1–M7:** ACCEPTED / CLOSED  
**P11-M8:** IMPLEMENTED / READINESS COMPLETE — awaiting acceptance  
**P11-M9+:** NOT STARTED / NOT AUTHORIZED  
**Production compatibility rewrite:** **RETAINED** pending operator Platform data normalization

---

## Compatibility rewrite purpose

`rewritePublicAssetUrlIfConfigured` (`src/lib/storage/public-asset-url.ts`) is a **Phase 10 temporary display-boundary helper**. It rewrites historical `*.r2.dev` public URLs to the configured `S3_PUBLIC_URL_BASE` origin while **preserving the object path**. Non-R2 hosts are returned unchanged.

Introduced because Phase 9 Platform migration persisted `public_url` values on the R2 dev hostname while production Portfolio `S3_PUBLIC_URL_BASE` targets `https://media.devlaunchsystems.com`, and `next/image` remotePatterns are derived from env configuration.

The rewrite does **not** mutate persisted records. It applies at read/render mapping boundaries only.

Additional helper responsibilities in the same module:

- `normalizePublicUrlBase` — protocol-less base normalization
- `getPublicAssetRemotePatternsFromEnv` — Next.js `images.remotePatterns` derivation
- `isR2PublicDevHostname` — hostname suffix check (`.r2.dev` only)

---

## Rewrite call sites

| Location | Data source | Surface | Rewrite |
|----------|-------------|---------|---------|
| `platform-api-mapper.ts` | Platform public `public_url` | Public | Hero, gallery |
| `platform-admin-mapper.ts` | Platform admin media | Admin | Media list, OG, editor img |
| `platform-media-mapper.ts` | Platform admin media | Admin | Editor fields, picker |
| `display-media-url.ts` | Prisma `PortfolioItem` | Admin list | img, gallery |
| `admin/portfolio/page.tsx` | Prisma list | Admin | via display helper |

**Not rewritten:** presign payload (`mapPresignResponseForBrowser`), article covers, database public read provider output, raw `getMediaPublicUrlById`.

---

## Chosen retirement option

**OPTION C now** (rewrite retained) → **OPTION B after operator Platform normalization** (remove Platform-path rewrite; retain local Prisma compatibility if needed).

Full OPTION A requires both Platform and Prisma data canonical — not evidenced.

---

## Repository ownership

Platform `public_url` normalization **apply** belongs in **DevLaunch Platform API repo** (Platform M8A). Portfolio provides read-only audit scripts and dry-run planning utilities only.

---

## Operator runbook

1. Confirm Platform `R2_PUBLIC_BASE_URL` and Portfolio `S3_PUBLIC_URL_BASE` are canonical
2. `npm run audit:platform-media-urls` (read-only)
3. Platform-side dry-run + operator-authorized apply (Platform repo)
4. Rerun audit — zero historical eligible
5. Verify API responses + images; handle ISR/ETag cache freshness (deploy/restart or wait 3600s)
6. `npm run audit:portfolio-media-urls` for Prisma rollback snapshot
7. Remove/narrow Platform mapper rewrite only when retirement criteria A–J pass
8. Portfolio validation + operator deploy

---

## Tooling

| Script | Purpose |
|--------|---------|
| `npm run audit:portfolio-media-urls` | Read-only Prisma + embedded portfolio URL audit |
| `npm run audit:platform-media-urls` | Read-only Platform admin media audit |

Classification module: `src/lib/storage/media-url-audit.ts`

---

## Tests

- `tests/unit/storage/media-url-audit.test.ts`
- `tests/unit/storage/public-asset-url.test.ts`
- `tests/unit/project-read/platform-api-mapper.test.ts`
- `tests/unit/project-write/platform-media-mapper.test.ts`

See full acceptance return in agent summary for complete inventory matrices.
