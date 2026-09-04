import { getPublishedPortfolioItemBySlug as getPublishedPortfolioItemBySlugFromDb , getPublishedPortfolioItems as getPublishedPortfolioItemsFromDb } from "@/lib/data/portfolio";
import { listPublicPortfolioMetrics } from "@/lib/data/portfolio-metrics";
import { listPublicProjectVersions } from "@/lib/data/project-versions";

import type { ProjectReadProvider, PublishedProjectDetail } from "./types";
import type { PortfolioItem } from "@/lib/types/portfolio";


export class DatabaseProjectReadProvider implements ProjectReadProvider {
  readonly source = "database" as const;

  getPublishedPortfolioItems(): Promise<PortfolioItem[]> {
    return getPublishedPortfolioItemsFromDb();
  }

  async getPublishedPortfolioItemBySlug(slug: string): Promise<PortfolioItem | null> {
    return getPublishedPortfolioItemBySlugFromDb(slug);
  }

  async getPublishedProjectDetail(slug: string): Promise<PublishedProjectDetail | null> {
    const project = await getPublishedPortfolioItemBySlugFromDb(slug);
    if (!project) {
      return null;
    }

    const [metrics, versions] = await Promise.all([
      listPublicPortfolioMetrics(project.id),
      listPublicProjectVersions(project.id),
    ]);

    return { project, metrics, versions };
  }
}
