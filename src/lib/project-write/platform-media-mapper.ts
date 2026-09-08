import { rewritePublicAssetUrlIfConfigured } from "@/lib/storage/public-asset-url";

import type { PlatformApiAdminMediaListItem } from "./platform-admin-types";
import type {
  PlatformMediaPresignClientPayload,
  PlatformMediaPresignResponse,
} from "./platform-media-types";
import type { PortfolioGalleryItem } from "@/lib/types/portfolio";

export interface PlatformProjectMediaEditorFields {
  heroMediaId: string | null;
  ogMediaId: string | null;
  img: string;
  gallery: PortfolioGalleryItem[];
}

export function isConfirmedPlatformAdminMedia(
  item: Pick<PlatformApiAdminMediaListItem, "upload_status">
): boolean {
  return item.upload_status === "confirmed";
}

export function isPendingPlatformAdminMedia(
  item: Pick<PlatformApiAdminMediaListItem, "upload_status">
): boolean {
  return !isConfirmedPlatformAdminMedia(item);
}

export function pickConfirmedHeroMedia(
  media: PlatformApiAdminMediaListItem[]
): PlatformApiAdminMediaListItem | undefined {
  return media
    .filter(isConfirmedPlatformAdminMedia)
    .find((item) => item.role === "hero");
}

export function resolveConfirmedHeroDisplayUrl(
  media: PlatformApiAdminMediaListItem[]
): string {
  const hero = pickConfirmedHeroMedia(media);
  return hero?.public_url
    ? rewritePublicAssetUrlIfConfigured(hero.public_url)
    : "";
}

export function buildCaseStudyHeroDisplayUrlMap(
  mediaItems: PlatformApiAdminMediaListItem[]
): Map<string, string> {
  const map = new Map<string, string>();

  for (const item of mediaItems) {
    if (
      !isConfirmedPlatformAdminMedia(item) ||
      item.role !== "hero" ||
      !item.public_url?.trim()
    ) {
      continue;
    }

    if (!map.has(item.case_study_id)) {
      map.set(
        item.case_study_id,
        rewritePublicAssetUrlIfConfigured(item.public_url)
      );
    }
  }

  return map;
}

export function mapPlatformAdminMediaToEditorFields(
  media: PlatformApiAdminMediaListItem[]
): PlatformProjectMediaEditorFields {
  const confirmed = media.filter(isConfirmedPlatformAdminMedia);
  const hero = pickConfirmedHeroMedia(media);
  const og = confirmed.find((item) => item.role === "og");
  const gallery = confirmed
    .filter((item) => item.role === "gallery")
    .sort((left, right) => {
      const orderDiff = (left.sort_order ?? 0) - (right.sort_order ?? 0);
      if (orderDiff !== 0) {
        return orderDiff;
      }
      return left.id.localeCompare(right.id);
    })
    .map((item) => ({
      mediaId: item.id,
      url: rewritePublicAssetUrlIfConfigured(item.public_url),
      alt: item.alt_text ?? undefined,
      caption: item.caption ?? undefined,
    }));

  return {
    heroMediaId: hero?.id ?? null,
    ogMediaId: og?.id ?? null,
    img: resolveConfirmedHeroDisplayUrl(media),
    gallery,
  };
}

export function mapPresignResponseForBrowser(
  presign: PlatformMediaPresignResponse
): PlatformMediaPresignClientPayload {
  return {
    mediaId: presign.media_id,
    uploadUrl: presign.upload_url,
    uploadHeaders: presign.upload_headers,
    storageKey: presign.storage_key,
    publicUrl: presign.public_url,
    expiresIn: presign.expires_in,
  };
}

export function mapPlatformMediaRecordToPickerSelection(media: {
  id: string;
  public_url: string;
  alt_text?: string | null;
  role: string;
  upload_status?: string | null;
}) {
  return {
    id: media.id,
    publicUrl: rewritePublicAssetUrlIfConfigured(media.public_url),
    filename: media.public_url.split("/").pop() ?? media.id,
    altText: media.alt_text ?? null,
    role: media.role,
    uploadStatus: media.upload_status ?? "pending",
  };
}

export function filterConfirmedProjectPlatformMedia<
  T extends { uploadStatus: string },
>(items: T[]): T[] {
  return items.filter((item) => isConfirmedPlatformAdminMedia({
    upload_status: item.uploadStatus,
  }));
}

export function filterPendingProjectPlatformMedia<
  T extends { uploadStatus: string },
>(items: T[]): T[] {
  return items.filter((item) => isPendingPlatformAdminMedia({
    upload_status: item.uploadStatus,
  }));
}
