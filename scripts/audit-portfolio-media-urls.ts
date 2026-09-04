/**
 * P11-M8 — read-only Portfolio media URL audit (Prisma + embedded portfolio fields).
 *
 * Performs SELECT-only operations. Does not mutate data.
 *
 * Usage:
 *   bun run scripts/audit-portfolio-media-urls.ts
 *   bun run scripts/audit-portfolio-media-urls.ts --json
 */

import "dotenv/config";

import { db } from "../src/lib/db/client";
import {
  auditMediaUrlRecords,
  buildMediaUrlNormalizationPlan,
  createMediaUrlAuditRecord,
  type MediaUrlAuditRecord,
} from "../src/lib/storage/media-url-audit";

import type { PortfolioGalleryItem } from "../src/lib/types/portfolio";

function parseGallery(value: unknown): PortfolioGalleryItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is PortfolioGalleryItem => {
      return Boolean(item && typeof item === "object" && "url" in item);
    })
    .map((item) => ({
      url: String(item.url ?? ""),
      alt: item.alt ? String(item.alt) : undefined,
      caption: item.caption ? String(item.caption) : undefined,
      mediaId: item.mediaId ? String(item.mediaId) : undefined,
    }));
}

function buildMediaAssetUsageSource(asset: {
  portfolioHeroFor: Array<{ id: string; slug: string | null }>;
  portfolioOgFor: Array<{ id: string; slug: string | null }>;
  articleCoversFor: Array<{ id: string; slug: string | null }>;
}): string {
  const usage: string[] = [];
  if (asset.portfolioHeroFor.length > 0) {
    usage.push(
      `portfolio-hero:${asset.portfolioHeroFor.map((item) => item.slug ?? item.id).join(",")}`
    );
  }
  if (asset.portfolioOgFor.length > 0) {
    usage.push(
      `portfolio-og:${asset.portfolioOgFor.map((item) => item.slug ?? item.id).join(",")}`
    );
  }
  if (asset.articleCoversFor.length > 0) {
    usage.push(
      `article-cover:${asset.articleCoversFor.map((item) => item.slug ?? item.id).join(",")}`
    );
  }

  return usage.length > 0 ? `prisma:media_asset:${usage.join(";")}` : "prisma:media_asset";
}

function buildPortfolioAuditRecords(
  portfolioItems: Array<{
    id: string;
    slug: string | null;
    img: string;
    gallery: unknown;
  }>
): MediaUrlAuditRecord[] {
  const records: MediaUrlAuditRecord[] = [];

  for (const item of portfolioItems) {
    records.push(
      createMediaUrlAuditRecord({
        id: `${item.id}:img`,
        source: `prisma:portfolio.img:${item.slug ?? item.id}`,
        publicUrl: item.img,
      })
    );

    for (const [index, galleryItem] of parseGallery(item.gallery).entries()) {
      records.push(
        createMediaUrlAuditRecord({
          id: `${item.id}:gallery:${index}`,
          source: `prisma:portfolio.gallery:${item.slug ?? item.id}`,
          publicUrl: galleryItem.url,
          storageKey: galleryItem.mediaId ?? null,
        })
      );
    }
  }

  return records;
}

function printAuditReport(
  output: {
    canonicalBase: string | null;
    summary: ReturnType<typeof auditMediaUrlRecords>;
    normalizationPlan: ReturnType<typeof buildMediaUrlNormalizationPlan>;
  }
) {
  const { summary, normalizationPlan: plan } = output;

  console.log("Portfolio media URL audit (read-only)");
  console.log(`Canonical base: ${output.canonicalBase ?? "(not configured)"}`);
  console.log(`Examined: ${summary.examined}`);
  console.log(`Canonical: ${summary.canonical}`);
  console.log(`Historical *.r2.dev: ${summary.historicalR2Dev}`);
  console.log(`Missing: ${summary.missing}`);
  console.log(`Malformed: ${summary.malformed}`);
  console.log(`Unexpected external: ${summary.unexpectedExternal}`);
  console.log(`Duplicate public_url groups: ${summary.duplicatePublicUrls}`);
  console.log(`Duplicate storage_key groups: ${summary.duplicateStorageKeys}`);
  console.log("");
  console.log("Normalization dry-run (zero writes):");
  console.log(`Would update: ${plan.eligibleHistorical}`);
  console.log(`Already canonical: ${plan.alreadyCanonical}`);
  console.log(`Skipped unexpected: ${plan.skippedUnexpected}`);
  console.log(`Skipped malformed: ${plan.skippedMalformed}`);
  console.log(`Skipped missing: ${plan.skippedMissing}`);

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

async function main() {
  const jsonOutput = process.argv.includes("--json");

  const [mediaAssets, portfolioItems] = await Promise.all([
    db.mediaAsset.findMany({
      select: {
        id: true,
        storageKey: true,
        publicUrl: true,
        portfolioHeroFor: { select: { id: true, slug: true } },
        portfolioOgFor: { select: { id: true, slug: true } },
        articleCoversFor: { select: { id: true, slug: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
    db.portfolio.findMany({
      select: {
        id: true,
        slug: true,
        img: true,
        gallery: true,
      },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const records: MediaUrlAuditRecord[] = [];

  for (const asset of mediaAssets) {
    records.push(
      createMediaUrlAuditRecord({
        id: asset.id,
        source: buildMediaAssetUsageSource(asset),
        publicUrl: asset.publicUrl,
        storageKey: asset.storageKey,
      })
    );
  }

  records.push(...buildPortfolioAuditRecords(portfolioItems));

  const summary = auditMediaUrlRecords(records);
  const plan = buildMediaUrlNormalizationPlan(records);

  const output = {
    scope: "portfolio-prisma-read-only",
    canonicalBase: process.env.S3_PUBLIC_URL_BASE ?? null,
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

  printAuditReport({
    canonicalBase: output.canonicalBase,
    summary,
    normalizationPlan: plan,
  });
}

main()
  .catch((error) => {
    console.error("Portfolio media URL audit failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
