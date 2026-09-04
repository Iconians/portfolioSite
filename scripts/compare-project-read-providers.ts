/**
 * Local/test-only harness to compare database vs Platform API read providers.
 */

import "dotenv/config";

import { DatabaseProjectReadProvider } from "../src/lib/project-read/database-project-read-provider";
import { PlatformApiReadClient } from "../src/lib/project-read/platform-api-client";
import { PlatformApiProjectReadProvider } from "../src/lib/project-read/platform-api-project-read-provider";

import type { ProjectReadProvider } from "../src/lib/project-read/types";

const EXPECTED = {
  published: 7,
  metrics: 35,
  milestones: 48,
};

async function countChildTotals(
  provider: ProjectReadProvider,
  slugs: Array<string | null>
) {
  let metrics = 0;
  let milestones = 0;

  for (const slug of slugs) {
    if (!slug) {
      continue;
    }
    const detail = await provider.getPublishedProjectDetail(slug);
    metrics += detail?.metrics.length ?? 0;
    milestones += detail?.versions.length ?? 0;
  }

  return { metrics, milestones };
}

async function main() {
  const db = new DatabaseProjectReadProvider();
  const client = PlatformApiReadClient.fromEnvironment();
  if (!client) {
    console.error("DEVLAUNCH_PLATFORM_API_URL is required for API comparison.");
    process.exit(1);
  }
  const api = new PlatformApiProjectReadProvider(client);

  const [dbItems, apiItems] = await Promise.all([
    db.getPublishedPortfolioItems(),
    api.getPublishedPortfolioItems(),
  ]);

  const dbSlugs = dbItems.map((item) => item.slug).sort();
  const apiSlugs = apiItems.map((item) => item.slug).sort();
  const [dbTotals, apiTotals] = await Promise.all([
    countChildTotals(db, dbSlugs),
    countChildTotals(api, apiSlugs),
  ]);

  const tournament = await api.getPublishedProjectDetail(
    "tournament-registration-event-management-system"
  );
  const devlaunch = await api.getPublishedProjectDetail("devlaunch-crm");

  console.log(
    JSON.stringify(
      {
        db: {
          published: dbItems.length,
          slugs: dbSlugs,
          ...dbTotals,
        },
        api: {
          published: apiItems.length,
          slugs: apiSlugs,
          ...apiTotals,
          tournamentMilestones: tournament?.versions.length ?? 0,
          devlaunchMilestones: devlaunch?.versions.length ?? 0,
        },
        expected: EXPECTED,
        slugParity: dbSlugs.join(",") === apiSlugs.join(","),
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
