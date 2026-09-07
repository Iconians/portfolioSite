import type { PlatformApiAdminMediaListItem } from "./platform-admin-types";

export const PLATFORM_ADMIN_LIST_PAGE_SIZE = 200;

export interface PlatformAdminListClient<TItem> {
  listCaseStudies: (options?: {
    page?: number;
    limit?: number;
  }) => Promise<{
    items: TItem[];
    total?: number;
    page?: number;
    limit?: number;
  }>;
}

export async function listAllPlatformAdminCaseStudies<TItem>(
  client: PlatformAdminListClient<TItem>,
  pageSize = PLATFORM_ADMIN_LIST_PAGE_SIZE
): Promise<TItem[]> {
  const items: TItem[] = [];
  let page = 1;

  while (true) {
    const response = await client.listCaseStudies({
      page,
      limit: pageSize,
    });
    items.push(...response.items);

    const total = response.total ?? items.length;
    if (items.length >= total || response.items.length === 0) {
      break;
    }

    page += 1;
  }

  return items;
}

export interface PlatformAdminMediaListClient {
  listMedia: (options?: {
    caseStudyId?: string;
    role?: string;
    uploadStatus?: string;
    page?: number;
    limit?: number;
  }) => Promise<{
    items: PlatformApiAdminMediaListItem[];
    total?: number;
    page?: number;
    limit?: number;
  }>;
}

export async function listAllPlatformAdminHeroMedia(
  client: PlatformAdminMediaListClient,
  pageSize = PLATFORM_ADMIN_LIST_PAGE_SIZE
): Promise<PlatformApiAdminMediaListItem[]> {
  const items: PlatformApiAdminMediaListItem[] = [];
  let page = 1;

  while (true) {
    const response = await client.listMedia({
      role: "hero",
      uploadStatus: "confirmed",
      page,
      limit: pageSize,
    });
    items.push(...response.items);

    const total = response.total ?? items.length;
    if (items.length >= total || response.items.length === 0) {
      break;
    }

    page += 1;
  }

  return items;
}
