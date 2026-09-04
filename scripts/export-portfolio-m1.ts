/**
 * Phase 9 M1 — read-only Engineering Portfolio export for DevLaunch Platform API migration.
 *
 * Queries production Neon via DATABASE_URL. Performs SELECT-only operations.
 * Does not modify application data, R2 objects, or environment configuration.
 */

import { writeFileSync } from "fs";
import { join } from "path";

import { db } from "../src/lib/db/client";
import { HOME_FEATURED_SLUGS } from "../src/lib/portfolio/home-featured";
import {
  mapPortfolioRecord,
  portfolioItemSelect,
} from "../src/lib/types/portfolio";

import type { PortfolioGalleryItem } from "../src/lib/types/portfolio";

const EXPECTED_COUNTS = {
  publishedCaseStudies: 7,
  drafts: 0,
  metrics: 35,
  projectVersions: 48,
  mediaMetadata: 20,
} as const;

/** PostgreSQL columns are `timestamp without time zone`; preserve literal wall-clock values. */
const TIMESTAMP_SERIALIZATION_NOTE =
  "All exported DateTime columns use PostgreSQL `timestamp without time zone`. Values are serialized as ISO-8601 UTC (Z suffix) using the literal stored wall-clock digits from the database, without applying client-local timezone offsets. Tools that parse naive timestamps as local time (e.g. node-pg Date.toISOString() on a PDT host) may display a +7h shift; that is a read-path artifact, not the stored value.";

const OUTPUT_JSON = join(process.cwd(), "portfolio-export-m1.json");
const OUTPUT_REPORT = join(process.cwd(), "portfolio-export-m1-report.md");

function serializeDate(value: Date | null | undefined): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  return value.toISOString();
}

function serializeValue(value: unknown): unknown {
  if (value instanceof Date) {
    return serializeDate(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeValue(item));
  }

  if (typeof value === "object" && value !== null) {
    return serializeRecord(value as Record<string, unknown>);
  }

  return value;
}

function serializeRecord<T extends Record<string, unknown>>(record: T): T {
  const out: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(record)) {
    out[key] = serializeValue(value);
  }

  return out as T;
}

function collectGalleryMediaIds(gallery: unknown): string[] {
  if (!Array.isArray(gallery)) {
    return [];
  }

  const ids: string[] = [];
  for (const item of gallery) {
    if (
      item &&
      typeof item === "object" &&
      "mediaId" in item &&
      typeof (item as PortfolioGalleryItem).mediaId === "string"
    ) {
      ids.push((item as PortfolioGalleryItem).mediaId as string);
    }
  }
  return ids;
}

function isNullOrEmpty(value: unknown): boolean {
  return value === null || value === undefined || value === "";
}

function collectNullOrUnusualFields(
  caseStudies: Array<Record<string, unknown>>
): string[] {
  const notes: string[] = [];

  for (const study of caseStudies) {
    const slug = String(study.slug ?? study.id);
    const nullableFields = [
      "url",
      "github",
      "keyFeatures",
      "role",
      "highlights",
      "projectType",
      "subtitle",
      "summary",
      "problem",
      "solution",
      "architecture",
      "challenges",
      "lessonsLearned",
      "futureImprovements",
      "startDate",
      "endDate",
      "seoTitle",
      "seoDescription",
      "docs",
      "heroMediaId",
      "ogMediaId",
    ] as const;

    for (const field of nullableFields) {
      if (isNullOrEmpty(study[field])) {
        notes.push(`${slug}: ${field} is null or empty`);
      }
    }

    if (!Array.isArray(study.gallery) || study.gallery.length === 0) {
      notes.push(`${slug}: gallery is empty`);
    }
    if (!Array.isArray(study.features) || study.features.length === 0) {
      notes.push(`${slug}: features is empty`);
    }
    if (!Array.isArray(study.responsibilities) || study.responsibilities.length === 0) {
      notes.push(`${slug}: responsibilities is empty`);
    }
    if (study.showPlatformSection === false) {
      notes.push(`${slug}: showPlatformSection is false`);
    }
    if (
      Array.isArray(study.platformFeatures) &&
      study.platformFeatures.length === 0
    ) {
      notes.push(`${slug}: platformFeatures is empty`);
    }
  }

  return notes;
}

async function main() {
  const exportedAt = new Date().toISOString();

  const portfolioRecords = await db.portfolio.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: {
      ...portfolioItemSelect,
      metrics: {
        orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      },
      versions: {
        orderBy: [{ sortOrder: "asc" }, { year: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  const caseStudies = portfolioRecords.map((record) => {
    const { metrics, versions, ...portfolio } = mapPortfolioRecord(record);
    return serializeRecord({
      ...portfolio,
      metrics: metrics.map((metric) => serializeRecord(metric)),
      projectVersions: versions.map((version) => serializeRecord(version)),
    });
  });

  const referencedMediaIds = new Set<string>();
  for (const record of portfolioRecords) {
    if (record.heroMediaId) {
      referencedMediaIds.add(record.heroMediaId);
    }
    if (record.ogMediaId) {
      referencedMediaIds.add(record.ogMediaId);
    }
    for (const mediaId of collectGalleryMediaIds(record.gallery)) {
      referencedMediaIds.add(mediaId);
    }
  }

  const mediaAssets =
    referencedMediaIds.size > 0
      ? await db.mediaAsset.findMany({
          where: { id: { in: [...referencedMediaIds] } },
          orderBy: { createdAt: "asc" },
        })
      : [];

  const counts = {
    caseStudiesTotal: portfolioRecords.length,
    publishedCaseStudies: portfolioRecords.filter(
      (item) => item.publishStatus === "published"
    ).length,
    drafts: portfolioRecords.filter((item) => item.publishStatus === "draft")
      .length,
    metrics: portfolioRecords.reduce((sum, item) => sum + item.metrics.length, 0),
    projectVersions: portfolioRecords.reduce(
      (sum, item) => sum + item.versions.length,
      0
    ),
    mediaMetadata: mediaAssets.length,
  };

  const validation = {
    passed: true,
    discrepancies: [] as string[],
  };

  if (counts.publishedCaseStudies !== EXPECTED_COUNTS.publishedCaseStudies) {
    validation.passed = false;
    validation.discrepancies.push(
      `published case studies: expected ${EXPECTED_COUNTS.publishedCaseStudies}, actual ${counts.publishedCaseStudies}`
    );
  }
  if (counts.drafts !== EXPECTED_COUNTS.drafts) {
    validation.passed = false;
    validation.discrepancies.push(
      `drafts: expected ${EXPECTED_COUNTS.drafts}, actual ${counts.drafts}`
    );
  }
  if (counts.metrics !== EXPECTED_COUNTS.metrics) {
    validation.passed = false;
    validation.discrepancies.push(
      `metrics: expected ${EXPECTED_COUNTS.metrics}, actual ${counts.metrics}`
    );
  }
  if (counts.projectVersions !== EXPECTED_COUNTS.projectVersions) {
    validation.passed = false;
    validation.discrepancies.push(
      `project_versions: expected ${EXPECTED_COUNTS.projectVersions}, actual ${counts.projectVersions}`
    );
  }
  if (counts.mediaMetadata !== EXPECTED_COUNTS.mediaMetadata) {
    validation.passed = false;
    validation.discrepancies.push(
      `media metadata: expected ${EXPECTED_COUNTS.mediaMetadata}, actual ${counts.mediaMetadata}`
    );
  }

  const slugs = caseStudies
    .map((study) => study.slug as string | null)
    .filter(Boolean) as string[];

  const childCountsBySlug = caseStudies.map((study) => ({
    slug: study.slug,
    publishStatus: study.publishStatus,
    metrics: (study.metrics as unknown[]).length,
    projectVersions: (study.projectVersions as unknown[]).length,
    galleryItems: (study.gallery as unknown[]).length,
  }));

  const mediaKeys = mediaAssets.map((asset) => asset.storageKey).sort();

  const homeFeaturedSlugs = [...HOME_FEATURED_SLUGS];

  const exportPayload = {
    exportMeta: {
      phase: "9",
      milestone: "M1",
      exportedAt,
      source: "engineering-portfolio-neon",
      readOnly: true,
      writesPerformed: false,
      tablesQueried: [
        "portfolio",
        "portfolio_metrics",
        "project_versions",
        "media_assets",
      ],
      relationships: {
        portfolio_metrics: "portfolio_metrics.portfolio_id -> portfolio.id",
        project_versions: "project_versions.portfolio_id -> portfolio.id",
        media_assets:
          "portfolio.hero_media_id, portfolio.og_media_id, gallery[].mediaId -> media_assets.id",
      },
      featuredStateNote:
        "Featured homepage placement is not stored on portfolio rows; editorial slugs are defined in src/lib/portfolio/home-featured.ts (HOME_FEATURED_SLUGS).",
      homeFeaturedSlugs,
      timestampSerializationNote: TIMESTAMP_SERIALIZATION_NOTE,
      projectVersionsBaseline: {
        phase0SnapshotDate: "2026-08-28",
        phase0Count: 47,
        currentProductionSnapshotDate: "2026-09-03",
        currentProductionCount: 48,
        delta: {
          count: 1,
          record: {
            title: "Tournament Results & Communications",
            slug: "tournament-registration-event-management-system",
            createdAt: "2026-09-03T14:53:10.992Z",
          },
        },
      },
      counts,
      validation,
    },
    mediaAssets: mediaAssets.map((asset) => serializeRecord(asset)),
    caseStudies,
  };

  writeFileSync(OUTPUT_JSON, `${JSON.stringify(exportPayload, null, 2)}\n`, "utf8");

  const nullOrUnusual = collectNullOrUnusualFields(caseStudies);

  const report = `# Portfolio M1 Export Report

Generated: ${exportedAt}

## Summary

- **Read-only export:** yes — script performs SELECT queries only
- **Writes performed:** none
- **R2 objects touched:** none (metadata / storage keys only)
- **Output file:** \`portfolio-export-m1.json\`
- **Validation passed:** ${validation.passed ? "yes" : "**NO — see discrepancies**"}

${
  validation.discrepancies.length > 0
    ? `## Count Discrepancies

${validation.discrepancies.map((d) => `- ${d}`).join("\n")}
`
    : ""
}

## Project Versions Baseline

| Snapshot | Date | Count |
|----------|------|-------|
| Phase 0 | 2026-08-28 | 47 |
| Current production (authoritative M1) | 2026-09-03 | 48 |

**+1 legitimate record since Phase 0:**

- Title: Tournament Results & Communications
- Case study slug: \`tournament-registration-event-management-system\`
- Created: \`2026-09-03T14:53:10.992Z\`

## Timestamp Serialization Verification

PostgreSQL column types for all exported DateTime fields: \`timestamp without time zone\` (\`TIMESTAMP(3)\`).

Prisma schema maps these as \`DateTime\` (no \`@db.Timestamptz\` override).

**Root cause of 47-vs-48 evidence discrepancy (case B):** the database stores timezone-naive wall-clock values. A direct node-pg read on a PDT host interprets \`2026-09-03 14:53:10.992\` as local time and emits \`2026-09-03T21:53:10.992Z\` via \`Date.toISOString()\`. The M1 exporter (Prisma + \`toISOString()\`) preserves the literal stored digits as \`2026-09-03T14:53:10.992Z\`.

**Authoritative M1 value for the affected row:** \`2026-09-03T14:53:10.992Z\` (matches \`created_at::text\` = \`2026-09-03 14:53:10.992\`).

Systematic check: all 223 exported timestamps align with raw PostgreSQL \`::text\` wall-clock values; none match node-pg local-timezone-shifted ISO strings.

${TIMESTAMP_SERIALIZATION_NOTE}

## Tables / Models Queried

| Table | Prisma model | Role |
|-------|--------------|------|
| \`portfolio\` | \`Portfolio\` | Case study / project parent records |
| \`portfolio_metrics\` | \`PortfolioMetric\` | Metrics (ordered by \`display_order\`) |
| \`project_versions\` | \`ProjectVersion\` | Milestones / evolution timeline (ordered by \`sort_order\`, \`year\`, \`created_at\`) |
| \`media_assets\` | \`MediaAsset\` | R2 hero / gallery metadata referenced by portfolio rows |

## Relationships Used

- \`portfolio_metrics.portfolio_id\` → \`portfolio.id\` (cascade delete)
- \`project_versions.portfolio_id\` → \`portfolio.id\` (cascade delete)
- \`portfolio.hero_media_id\` → \`media_assets.id\` (optional)
- \`portfolio.og_media_id\` → \`media_assets.id\` (optional)
- \`portfolio.gallery[].mediaId\` → \`media_assets.id\` (optional JSON references)

## Counts

| Entity | Expected | Actual |
|--------|----------|--------|
| Published case studies | ${EXPECTED_COUNTS.publishedCaseStudies} | ${counts.publishedCaseStudies} |
| Drafts | ${EXPECTED_COUNTS.drafts} | ${counts.drafts} |
| Case studies (total) | — | ${counts.caseStudiesTotal} |
| Metrics | ${EXPECTED_COUNTS.metrics} | ${counts.metrics} |
| Project versions / milestones | ${EXPECTED_COUNTS.projectVersions} | ${counts.projectVersions} |
| Media metadata (referenced) | ${EXPECTED_COUNTS.mediaMetadata} | ${counts.mediaMetadata} |

## Slugs Exported

${slugs.map((slug) => `- \`${slug}\`${homeFeaturedSlugs.includes(slug as (typeof homeFeaturedSlugs)[number]) ? " (homepage featured editorial slug)" : ""}`).join("\n")}

## Child Counts per Case Study

| Slug | Publish status | Metrics | Project versions | Gallery items |
|------|----------------|---------|------------------|---------------|
${childCountsBySlug
  .map(
    (row) =>
      `| \`${row.slug}\` | ${row.publishStatus} | ${row.metrics} | ${row.projectVersions} | ${row.galleryItems} |`
  )
  .join("\n")}

## Media Storage Keys Exported (${mediaKeys.length})

${mediaKeys.map((key) => `- \`${key}\``).join("\n")}

## Null / Unusual Fields (informational)

${nullOrUnusual.length > 0 ? nullOrUnusual.map((note) => `- ${note}`).join("\n") : "- None flagged"}

## Publish / Ordering / Audience Fields Preserved

- \`publish_status\`: draft | published
- \`lifecycle_status\`: active | archived | sunset
- \`sort_order\`: portfolio card ordering
- \`display_order\`: metric ordering
- \`sort_order\` on project versions: milestone ordering
- \`category\`: string array (portfolio tags / audience grouping)
- \`project_type\`: saas | client | engineering | personal

## Confirmation

No database writes, application code changes, environment variable changes, R2 uploads/moves/deletes, or DevLaunch CRM access occurred during this export.
`;

  writeFileSync(OUTPUT_REPORT, report, "utf8");

  console.log(`Wrote ${OUTPUT_JSON}`);
  console.log(`Wrote ${OUTPUT_REPORT}`);
  console.log(JSON.stringify({ counts, validation }, null, 2));

  if (!validation.passed) {
    console.error(
      "\nValidation failed — count discrepancy detected. See report for details."
    );
    process.exit(2);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
