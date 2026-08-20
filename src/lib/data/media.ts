import { db } from "@/lib/db/client";
import { requireAdmin } from "@/lib/permissions";
import type { CreateMediaAssetInput, MediaAsset } from "@/lib/types/media";

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
