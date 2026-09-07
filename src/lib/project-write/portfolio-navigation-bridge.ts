import "server-only";

import { db } from "@/lib/db/client";
import { requireAdmin } from "@/lib/permissions";
import { portfolioItemSelect, mapPortfolioRecord } from "@/lib/types/portfolio";

import type { PortfolioItem, ProjectType } from "@/lib/types/portfolio";

/** Placeholder hero — bridge row only; authoritative media lives on Platform. */
const BRIDGE_PLACEHOLDER_IMG = "/";

/** Minimal list label — not authoritative shared content. */
const BRIDGE_PLACEHOLDER_DESCRIPTION =
  "Navigation bridge row. Shared project content is managed in Platform API.";

const BRIDGE_PLACEHOLDER_CATEGORY = "bridge";

export interface PortfolioNavigationBridgeInput {
  slug: string;
  title: string;
  projectType: ProjectType;
}

/**
 * Inserts the minimum Portfolio-local row required for /admin/portfolio/[id] routing.
 * Does not store authoritative shared project content.
 */
export async function createPortfolioNavigationBridge(
  input: PortfolioNavigationBridgeInput
): Promise<PortfolioItem> {
  const user = await requireAdmin();

  const item = await db.portfolio.create({
    data: {
      slug: input.slug,
      caption: input.title,
      projectType: input.projectType,
      img: BRIDGE_PLACEHOLDER_IMG,
      description: BRIDGE_PLACEHOLDER_DESCRIPTION,
      category: [BRIDGE_PLACEHOLDER_CATEGORY],
      publishStatus: "draft",
      lifecycleStatus: "active",
      createdBy: user.id,
    },
    select: portfolioItemSelect,
  });

  return mapPortfolioRecord(item);
}
