import {
  backfillPortfolioHeroMediaIds,
  backfillPortfolioSlugs,
} from "../src/lib/data/portfolio-backfill";
import { db } from "../src/lib/db/client";

async function main() {
  const slugCount = await backfillPortfolioSlugs();
  const heroCount = await backfillPortfolioHeroMediaIds();

  console.log(
    `Backfill complete: ${slugCount} slug(s), ${heroCount} hero media link(s).`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
