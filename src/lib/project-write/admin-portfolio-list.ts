import "server-only";

import {
  getAllPortfolioItems,
  listPortfolioBridgeRows,
} from "@/lib/data/portfolio";

import {
  mapPlatformAdminListItemToPortfolioListRow,
  sortAdminPortfolioListItems,
} from "./admin-portfolio-list-mapper";
import { getProjectWriteSource } from "./config";
import { listAllPlatformAdminCaseStudies } from "./platform-admin-list-pagination";
import { getProjectWriteProvider } from "./provider";

import type { PortfolioItem } from "@/lib/types/portfolio";

/**
 * Admin portfolio list authority:
 * - platform-api: Platform admin list (display) + Prisma bridge id (routing only)
 * - database: legacy Prisma list (rollback read path only)
 */
export async function loadAdminPortfolioListItems(): Promise<PortfolioItem[]> {
  if (getProjectWriteSource() !== "platform-api") {
    return getAllPortfolioItems();
  }

  const provider = getProjectWriteProvider();
  if (provider.source !== "platform-api") {
    return getAllPortfolioItems();
  }

  const platformItems = await listAllPlatformAdminCaseStudies(provider.client);
  const bridgeRows = await listPortfolioBridgeRows();
  const bridgeIdBySlug = new Map(
    bridgeRows
      .filter((row): row is { id: string; slug: string } => Boolean(row.slug?.trim()))
      .map((row) => [row.slug.trim(), row.id])
  );

  const items: PortfolioItem[] = [];
  for (const platformItem of platformItems) {
    const bridgeId = bridgeIdBySlug.get(platformItem.slug);
    if (!bridgeId) {
      continue;
    }

    items.push(
      mapPlatformAdminListItemToPortfolioListRow(platformItem, bridgeId)
    );
  }

  return sortAdminPortfolioListItems(items);
}
