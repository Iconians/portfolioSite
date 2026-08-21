import { db } from "@/lib/db/client";
import { requireAdmin } from "@/lib/permissions";
import type {
  CreateMediaAssetInput,
  MediaAsset,
  UpdateMediaMetadataInput,
} from "@/lib/types/media";

export async function createMediaAsset(
  input: CreateMediaAssetInput
): Promise<MediaAsset> {
  await requireAdmin();
  return db.mediaAsset.create({ data: input });
}

export async function getMediaAssetById(id: string): Promise<MediaAsset | null> {
  await requireAdmin();
  return db.mediaAsset.findUnique({ where: { id } });
}

export async function getMediaAssetByStorageKey(
  storageKey: string
): Promise<MediaAsset | null> {
  await requireAdmin();
  return db.mediaAsset.findUnique({ where: { storageKey } });
}

export async function listMediaAssets(): Promise<MediaAsset[]> {
  await requireAdmin();
  return db.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function updateMediaAsset(
  id: string,
  data: UpdateMediaMetadataInput
): Promise<MediaAsset> {
  await requireAdmin();
  return db.mediaAsset.update({
    where: { id },
    data,
  });
}

export async function deleteMediaAssetRecord(id: string): Promise<void> {
  await requireAdmin();
  await db.mediaAsset.delete({ where: { id } });
}

export async function countPortfolioImgReferences(
  publicUrl: string
): Promise<number> {
  await requireAdmin();
  return db.portfolio.count({
    where: { img: publicUrl },
  });
}

export async function getMediaPublicUrlById(id: string): Promise<string | null> {
  const asset = await db.mediaAsset.findUnique({
    where: { id },
    select: { publicUrl: true },
  });

  return asset?.publicUrl ?? null;
}

export async function countPortfolioMediaAssetReferences(
  mediaAssetId: string,
  publicUrl: string
): Promise<number> {
  await requireAdmin();
  const [imgCount, heroCount, ogCount, articleCoverCount, portfolios] =
    await Promise.all([
      db.portfolio.count({ where: { img: publicUrl } }),
      db.portfolio.count({ where: { heroMediaId: mediaAssetId } }),
      db.portfolio.count({ where: { ogMediaId: mediaAssetId } }),
      db.article.count({ where: { coverMediaId: mediaAssetId } }),
      db.portfolio.findMany({ select: { gallery: true } }),
    ]);

  let galleryCount = 0;
  for (const portfolio of portfolios) {
    if (!Array.isArray(portfolio.gallery)) {
      continue;
    }

    for (const item of portfolio.gallery) {
      if (
        item &&
        typeof item === "object" &&
        ("mediaId" in item || "url" in item)
      ) {
        const record = item as { mediaId?: string; url?: string };
        if (record.mediaId === mediaAssetId || record.url === publicUrl) {
          galleryCount += 1;
        }
      }
    }
  }

  return imgCount + heroCount + ogCount + articleCoverCount + galleryCount;
}
