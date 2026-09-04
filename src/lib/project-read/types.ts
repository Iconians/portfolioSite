import type { ProjectReadSource } from "./config";
import type {
  PortfolioItem,
  PortfolioMetric,
  ProjectVersion,
} from "@/lib/types/portfolio";

export interface PublishedProjectDetail {
  project: PortfolioItem;
  metrics: PortfolioMetric[];
  versions: ProjectVersion[];
}

/** Narrow read boundary for shared project / case-study public data. */
export interface ProjectReadProvider {
  readonly source: ProjectReadSource;
  getPublishedPortfolioItems(): Promise<PortfolioItem[]>;
  getPublishedPortfolioItemBySlug(slug: string): Promise<PortfolioItem | null>;
  getPublishedProjectDetail(slug: string): Promise<PublishedProjectDetail | null>;
  /** Clears in-process Platform read cache for one project (platform-api provider only). */
  invalidateProject?(slug: string): void;
}
