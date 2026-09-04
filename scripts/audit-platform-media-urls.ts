/**
 * P11-M8 — read-only Platform API media URL audit.
 *
 * Performs GET-only Platform admin API calls. Does not mutate data.
 * Authoritative Platform normalization must occur in the Platform API repo.
 *
 * Usage:
 *   bun run scripts/audit-platform-media-urls.ts
 *   bun run scripts/audit-platform-media-urls.ts --json
 */

import "dotenv/config";

import { PlatformApiAdminClient } from "../src/lib/project-write/platform-api-admin-client";
import {
  auditMediaUrlRecords,
  buildMediaUrlNormalizationPlan,
  createMediaUrlAuditRecord,
  type MediaUrlAuditRecord,
} from "../src/lib/storage/media-url-audit";

async function main() {
  const jsonOutput = process.argv.includes("--json");
  const client = PlatformApiAdminClient.fromEnvironment();
  if (!client) {
    console.error(
      "DEVLAUNCH_PLATFORM_API_URL and DEVLAUNCH_PLATFORM_API_ADMIN_TOKEN are required."
    );
    process.exit(1);
  }

  const records: MediaUrlAuditRecord[] = [];
  const list = await client.listCaseStudies({ limit: 200 });

  for (const caseStudy of list.items) {
    const media = await client.listMedia({ caseStudyId: caseStudy.id });
    for (const item of media.items) {
      records.push(
        createMediaUrlAuditRecord({
          id: item.id,
          source: `platform:media:${caseStudy.slug ?? caseStudy.id}`,
          publicUrl: item.public_url,
          storageKey: item.storage_key,
        })
      );
    }
  }

  const summary = auditMediaUrlRecords(records);
  const plan = buildMediaUrlNormalizationPlan(records);

  const output = {
    scope: "platform-api-read-only",
    canonicalBase: process.env.S3_PUBLIC_URL_BASE ?? null,
    platformR2PublicBaseUrlNote:
      "Platform presign/register canonicality depends on Platform R2_PUBLIC_BASE_URL (Platform repo env). Portfolio S3_PUBLIC_URL_BASE is the display/normalization target.",
    summary,
    normalizationPlan: {
      examined: plan.examined,
      alreadyCanonical: plan.alreadyCanonical,
      eligibleHistorical: plan.eligibleHistorical,
      skippedUnexpected: plan.skippedUnexpected,
      skippedMalformed: plan.skippedMalformed,
      skippedMissing: plan.skippedMissing,
      wouldUpdate: plan.items,
    },
    records,
  };

  if (jsonOutput) {
    console.log(JSON.stringify(output, null, 2));
    return;
  }

  console.log("Platform media URL audit (read-only)");
  console.log(`Canonical target (Portfolio env): ${output.canonicalBase ?? "(not configured)"}`);
  console.log(`Examined: ${summary.examined}`);
  console.log(`Canonical: ${summary.canonical}`);
  console.log(`Historical *.r2.dev: ${summary.historicalR2Dev}`);
  console.log(`Missing: ${summary.missing}`);
  console.log(`Malformed: ${summary.malformed}`);
  console.log(`Unexpected external: ${summary.unexpectedExternal}`);
  console.log("");
  console.log("Normalization dry-run (zero writes; apply belongs in Platform API repo):");
  console.log(`Would update: ${plan.eligibleHistorical}`);
  console.log(`Already canonical: ${plan.alreadyCanonical}`);
  console.log(`Skipped unexpected: ${plan.skippedUnexpected}`);

  if (plan.items.length > 0) {
    console.log("");
    console.log("Eligible historical updates:");
    for (const item of plan.items) {
      console.log(`- ${item.id} (${item.source})`);
      console.log(`  storage_key: ${item.storageKey}`);
      console.log(`  old: ${item.currentPublicUrl}`);
      console.log(`  new: ${item.proposedPublicUrl}`);
    }
  }
}

main().catch((error) => {
  console.error("Platform media URL audit failed:", error);
  process.exit(1);
});
