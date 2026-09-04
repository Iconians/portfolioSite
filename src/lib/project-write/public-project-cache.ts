import "server-only";

import { revalidatePath } from "next/cache";

import { getPortfolioItemById } from "@/lib/data/portfolio";
import { invalidateProjectReadProviderCache } from "@/lib/project-read";
import { getProjectWriteSource } from "@/lib/project-write/config";

import {
  collectPublicProjectCachePaths,
  type PublicProjectCacheInvalidationReason,
} from "./public-project-cache-policy";

export type RevalidatePathFn = (path: string) => void;

let revalidatePathImpl: RevalidatePathFn = revalidatePath;

export function setRevalidatePathForTests(fn: RevalidatePathFn | null): void {
  revalidatePathImpl = fn ?? revalidatePath;
}

export function revalidateAdminProjectPaths(portfolioId: string): void {
  revalidatePathImpl("/admin/portfolio");
  revalidatePathImpl(`/admin/portfolio/${portfolioId}`);
}

export function invalidatePublicProjectCache(
  slug: string,
  reason: PublicProjectCacheInvalidationReason
): void {
  if (getProjectWriteSource() !== "platform-api") {
    return;
  }

  const paths = collectPublicProjectCachePaths(slug, reason);
  for (const path of paths) {
    revalidatePathImpl(path);
  }
  invalidateProjectReadProviderCache(slug);
}

export async function invalidatePublicProjectCacheForPortfolioId(
  portfolioId: string,
  reason: PublicProjectCacheInvalidationReason
): Promise<void> {
  if (getProjectWriteSource() !== "platform-api") {
    return;
  }

  const bridge = await getPortfolioItemById(portfolioId);
  if (!bridge?.slug?.trim()) {
    return;
  }

  invalidatePublicProjectCache(bridge.slug, reason);
}

export function revalidateAfterPlatformProjectWrite(
  portfolioId: string,
  slug: string,
  reason: PublicProjectCacheInvalidationReason
): void {
  revalidateAdminProjectPaths(portfolioId);
  invalidatePublicProjectCache(slug, reason);
}
