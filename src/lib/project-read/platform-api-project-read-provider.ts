import { PROJECT_TYPE_ORDER } from "@/lib/types/portfolio";


import {
  PlatformApiMalformedResponseError,
  PlatformApiNetworkError,
  type PlatformApiReadClient,
  PlatformApiResponseError,
} from "./platform-api-client";
import {
  mapPlatformApiDetail,
  mapPlatformApiDetailToPortfolioItem,
  mapPlatformApiListItemToPortfolioItem,
} from "./platform-api-mapper";

import type {
  PlatformApiCaseStudyDetail,
  PlatformApiListItem,
} from "./platform-api-types";
import type { ProjectReadProvider, PublishedProjectDetail } from "./types";
import type { PortfolioItem } from "@/lib/types/portfolio";

function sortPortfolioItems(items: PortfolioItem[]): PortfolioItem[] {
  return [...items].sort((a, b) => {
    const typeOrder = (type: string | null | undefined) => {
      const normalized = type?.toLowerCase?.() ?? type ?? "";
      if (!normalized) {
        return PROJECT_TYPE_ORDER.length;
      }
      const index = PROJECT_TYPE_ORDER.indexOf(
        normalized as (typeof PROJECT_TYPE_ORDER)[number]
      );
      return index === -1 ? PROJECT_TYPE_ORDER.length : index;
    };

    const orderA = typeOrder(a.projectType);
    const orderB = typeOrder(b.projectType);
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export class PlatformApiProjectReadProvider implements ProjectReadProvider {
  readonly source = "platform-api" as const;

  private readonly client: PlatformApiReadClient;
  private readonly detailBodies = new Map<string, PlatformApiCaseStudyDetail>();
  private readonly detailEtags = new Map<string, string>();
  private lastListItems: PlatformApiListItem[] = [];
  private listEtag: string | undefined;

  constructor(client: PlatformApiReadClient) {
    this.client = client;
  }

  private async fetchDetail(slug: string): Promise<PlatformApiCaseStudyDetail | null> {
    const cached = this.detailBodies.get(slug);
    const result = await this.client.getCaseStudyBySlug(slug, {
      ifNoneMatch: this.detailEtags.get(slug),
    });

    if (result.status === "not_modified") {
      return cached ?? null;
    }

    this.detailBodies.set(slug, result.data);
    if (result.etag) {
      this.detailEtags.set(slug, result.etag);
    }
    return result.data;
  }

  async getPublishedPortfolioItems(): Promise<PortfolioItem[]> {
    const result = await this.client.listCaseStudies({
      limit: 50,
      ifNoneMatch: this.listEtag,
    });

    if (result.status === "ok") {
      this.lastListItems = result.data.items;
      if (result.etag) {
        this.listEtag = result.etag;
      }
    }

    const listItems = this.lastListItems;
    const details = await Promise.all(
      listItems.map(async (item) => {
        try {
          const detail = await this.fetchDetail(item.slug);
          return detail
            ? mapPlatformApiDetailToPortfolioItem(detail)
            : mapPlatformApiListItemToPortfolioItem(item);
        } catch (error) {
          if (
            error instanceof PlatformApiResponseError &&
            error.status === 404
          ) {
            return null;
          }
          throw error;
        }
      })
    );

    return sortPortfolioItems(
      details.filter((item): item is PortfolioItem => item !== null)
    );
  }

  async getPublishedPortfolioItemBySlug(slug: string): Promise<PortfolioItem | null> {
    try {
      const detail = await this.fetchDetail(slug);
      return detail ? mapPlatformApiDetailToPortfolioItem(detail) : null;
    } catch (error) {
      if (error instanceof PlatformApiResponseError && error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async getPublishedProjectDetail(slug: string): Promise<PublishedProjectDetail | null> {
    try {
      const detail = await this.fetchDetail(slug);
      return detail ? mapPlatformApiDetail(detail) : null;
    } catch (error) {
      if (error instanceof PlatformApiResponseError && error.status === 404) {
        return null;
      }
      throw error;
    }
  }
}

export {
  PlatformApiMalformedResponseError,
  PlatformApiNetworkError,
  PlatformApiResponseError,
};
