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

function isConfirmedMedia(item: PlatformApiAdminMediaListItem): boolean {
  return item.upload_status === "confirmed";
}

export function mapPlatformAdminMediaToEditorFields(
  media: PlatformApiAdminMediaListItem[]
): PlatformProjectMediaEditorFields {
  const confirmed = media.filter(isConfirmedMedia);
  const hero = confirmed.find((item) => item.role === "hero");
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

  const heroUrl = hero?.public_url
    ? rewritePublicAssetUrlIfConfigured(hero.public_url)
    : "";

  return {
    heroMediaId: hero?.id ?? null,
    ogMediaId: og?.id ?? null,
    img: heroUrl,
    gallery,
  };
}

export function mapPresignResponseForBrowser(
  presign: PlatformMediaPresignResponse
): PlatformMediaPresignClientPayload {
  return {
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
}) {
  return {
    id: media.id,
    publicUrl: rewritePublicAssetUrlIfConfigured(media.public_url),
    filename: media.public_url.split("/").pop() ?? media.id,
    altText: media.alt_text ?? null,
    role: media.role,
  };
}
