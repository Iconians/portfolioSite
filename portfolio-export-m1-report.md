# Portfolio M1 Export Report

Generated: 2026-09-03T18:18:59.481Z

## Summary

- **Read-only export:** yes — script performs SELECT queries only
- **Writes performed:** none
- **R2 objects touched:** none (metadata / storage keys only)
- **Output file:** `portfolio-export-m1.json`
- **Validation passed:** yes



## Project Versions Baseline

| Snapshot | Date | Count |
|----------|------|-------|
| Phase 0 | 2026-08-28 | 47 |
| Current production (authoritative M1) | 2026-09-03 | 48 |

**+1 legitimate record since Phase 0:**

- Title: Tournament Results & Communications
- Case study slug: `tournament-registration-event-management-system`
- Created: `2026-09-03T14:53:10.992Z`

## Timestamp Serialization Verification

PostgreSQL column types for all exported DateTime fields: `timestamp without time zone` (`TIMESTAMP(3)`).

Prisma schema maps these as `DateTime` (no `@db.Timestamptz` override).

**Root cause of 47-vs-48 evidence discrepancy (case B):** the database stores timezone-naive wall-clock values. A direct node-pg read on a PDT host interprets `2026-09-03 14:53:10.992` as local time and emits `2026-09-03T21:53:10.992Z` via `Date.toISOString()`. The M1 exporter (Prisma + `toISOString()`) preserves the literal stored digits as `2026-09-03T14:53:10.992Z`.

**Authoritative M1 value for the affected row:** `2026-09-03T14:53:10.992Z` (matches `created_at::text` = `2026-09-03 14:53:10.992`).

Systematic check: all 223 exported timestamps align with raw PostgreSQL `::text` wall-clock values; none match node-pg local-timezone-shifted ISO strings.

All exported DateTime columns use PostgreSQL `timestamp without time zone`. Values are serialized as ISO-8601 UTC (Z suffix) using the literal stored wall-clock digits from the database, without applying client-local timezone offsets. Tools that parse naive timestamps as local time (e.g. node-pg Date.toISOString() on a PDT host) may display a +7h shift; that is a read-path artifact, not the stored value.

## Tables / Models Queried

| Table | Prisma model | Role |
|-------|--------------|------|
| `portfolio` | `Portfolio` | Case study / project parent records |
| `portfolio_metrics` | `PortfolioMetric` | Metrics (ordered by `display_order`) |
| `project_versions` | `ProjectVersion` | Milestones / evolution timeline (ordered by `sort_order`, `year`, `created_at`) |
| `media_assets` | `MediaAsset` | R2 hero / gallery metadata referenced by portfolio rows |

## Relationships Used

- `portfolio_metrics.portfolio_id` → `portfolio.id` (cascade delete)
- `project_versions.portfolio_id` → `portfolio.id` (cascade delete)
- `portfolio.hero_media_id` → `media_assets.id` (optional)
- `portfolio.og_media_id` → `media_assets.id` (optional)
- `portfolio.gallery[].mediaId` → `media_assets.id` (optional JSON references)

## Counts

| Entity | Expected | Actual |
|--------|----------|--------|
| Published case studies | 7 | 7 |
| Drafts | 0 | 0 |
| Case studies (total) | — | 7 |
| Metrics | 35 | 35 |
| Project versions / milestones | 48 | 48 |
| Media metadata (referenced) | 20 | 20 |

## Slugs Exported

- `the-royal-canine`
- `downriver-renovations`
- `ghost-mammoth-pickle-ball` (homepage featured editorial slug)
- `tournament-registration-event-management-system`
- `devlaunch-crm` (homepage featured editorial slug)
- `engineering-portfolio-management-system` (homepage featured editorial slug)
- `intellitaskpro` (homepage featured editorial slug)

## Child Counts per Case Study

| Slug | Publish status | Metrics | Project versions | Gallery items |
|------|----------------|---------|------------------|---------------|
| `the-royal-canine` | published | 4 | 3 | 0 |
| `downriver-renovations` | published | 4 | 3 | 0 |
| `ghost-mammoth-pickle-ball` | published | 5 | 6 | 0 |
| `tournament-registration-event-management-system` | published | 5 | 8 | 0 |
| `devlaunch-crm` | published | 5 | 11 | 8 |
| `engineering-portfolio-management-system` | published | 6 | 9 | 0 |
| `intellitaskpro` | published | 6 | 8 | 5 |

## Media Storage Keys Exported (20)

- `portfolio/projects/heroes/1787268458307-ai-powered.png`
- `portfolio/projects/heroes/1787281325478-clayton-cripe-engineering-hero.png`
- `portfolio/projects/heroes/1787326313189-ghostmammoth.png`
- `portfolio/projects/heroes/1787326346735-constructionsite.png`
- `portfolio/projects/heroes/1787326404679-devlaunch-systems-06-26-2026-12-57-pm.png`
- `portfolio/projects/heroes/1787326419855-admin-rusty-wedge-golf-scramble-07-29-2026-02-23-pm.png`
- `portfolio/projects/heroes/1787326480996-royalcaninepic.png`
- `portfolio/projects/heroes/1787330076809-admin-devlaunch-systems-08-21-2026-09-30-am.png`
- `portfolio/projects/heroes/1787330112031-clients-admin-devlaunch-systems-08-21-2026-09-31-am.png`
- `portfolio/projects/heroes/1787330192193-finance-admin-devlaunch-systems-08-21-2026-09-32-am.png`
- `portfolio/projects/heroes/1787330227676-growth-admin-devlaunch-systems-08-21-2026-09-29-am.png`
- `portfolio/projects/heroes/1787330260033-my-projects-admin-devlaunch-systems-08-21-2026-09-33-am.png`
- `portfolio/projects/heroes/1787330297537-projects-admin-devlaunch-systems-08-21-2026-09-33-am.png`
- `portfolio/projects/heroes/1787330539280-work-log-growth-admin-devlaunch-systems-08-21-2026-09-40-am.png`
- `portfolio/projects/heroes/1787330592535-reports-growth-admin-devlaunch-systems-08-21-2026-09-41-am.png`
- `portfolio/projects/heroes/1787336539092-intellitask-pro-08-21-2026-11-13-am.png`
- `portfolio/projects/heroes/1787336596784-intellitask-pro-08-21-2026-11-14-am.png`
- `portfolio/projects/heroes/1787336634369-intellitask-pro-08-21-2026-11-15-am.png`
- `portfolio/projects/heroes/1787336681507-intellitask-pro-08-21-2026-11-16-am.png`
- `portfolio/projects/heroes/1787336728468-intellitask-pro-08-21-2026-11-19-am.png`

## Null / Unusual Fields (informational)

- the-royal-canine: startDate is null or empty
- the-royal-canine: endDate is null or empty
- the-royal-canine: ogMediaId is null or empty
- the-royal-canine: gallery is empty
- the-royal-canine: showPlatformSection is false
- the-royal-canine: platformFeatures is empty
- downriver-renovations: startDate is null or empty
- downriver-renovations: endDate is null or empty
- downriver-renovations: ogMediaId is null or empty
- downriver-renovations: gallery is empty
- downriver-renovations: showPlatformSection is false
- downriver-renovations: platformFeatures is empty
- ghost-mammoth-pickle-ball: startDate is null or empty
- ghost-mammoth-pickle-ball: endDate is null or empty
- ghost-mammoth-pickle-ball: ogMediaId is null or empty
- ghost-mammoth-pickle-ball: gallery is empty
- tournament-registration-event-management-system: endDate is null or empty
- tournament-registration-event-management-system: ogMediaId is null or empty
- tournament-registration-event-management-system: gallery is empty
- devlaunch-crm: endDate is null or empty
- devlaunch-crm: ogMediaId is null or empty
- engineering-portfolio-management-system: endDate is null or empty
- engineering-portfolio-management-system: ogMediaId is null or empty
- engineering-portfolio-management-system: gallery is empty
- intellitaskpro: startDate is null or empty
- intellitaskpro: endDate is null or empty
- intellitaskpro: ogMediaId is null or empty

## Publish / Ordering / Audience Fields Preserved

- `publish_status`: draft | published
- `lifecycle_status`: active | archived | sunset
- `sort_order`: portfolio card ordering
- `display_order`: metric ordering
- `sort_order` on project versions: milestone ordering
- `category`: string array (portfolio tags / audience grouping)
- `project_type`: saas | client | engineering | personal

## Confirmation

No database writes, application code changes, environment variable changes, R2 uploads/moves/deletes, or DevLaunch CRM access occurred during this export.
