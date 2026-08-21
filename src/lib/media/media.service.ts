import {
  createMediaAsset,
  deleteMediaAssetRecord,
  countPortfolioMediaAssetReferences,
  getMediaAssetById,
  getMediaAssetByStorageKey,
  updateMediaAsset,
} from "@/lib/data/media";
import {
  createMediaObjectKey,
  DEFAULT_MEDIA_OBJECT_KEY_DESCRIPTOR,
  isAllowedMediaObjectKey,
  type MediaObjectKeyDescriptor,
} from "@/lib/media/object-keys";
import { validateMediaUpload } from "@/lib/media/validate-upload";
import { getStorageProvider, getStorageProviderKind } from "@/lib/storage";
import { UpdateMediaMetadataSchema } from "@/lib/types/media";

import type { MediaAsset, UpdateMediaMetadataInput } from "@/lib/types/media";

export interface UploadMediaInput {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  createdBy: string;
  objectKey?: MediaObjectKeyDescriptor;
  width?: number;
  height?: number;
}

export interface PresignMediaResult {
  storageKey: string;
  publicUrl: string;
  upload: {
    url: string;
    method: string;
    headers?: Record<string, string>;
  };
}

export interface CompleteMediaUploadInput {
  storageKey: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  createdBy: string;
  width?: number;
  height?: number;
}

function resolveObjectKeyInput(
  input?: MediaObjectKeyDescriptor
): MediaObjectKeyDescriptor {
  return input ?? DEFAULT_MEDIA_OBJECT_KEY_DESCRIPTOR;
}

function buildStorageKey(
  filename: string,
  objectKey?: MediaObjectKeyDescriptor
): string {
  return createMediaObjectKey({
    ...resolveObjectKeyInput(objectKey),
    filename,
  });
}

function assertPresignedUploadSupported(): void {
  if (getStorageProviderKind() !== "s3") {
    throw new Error("Presigned uploads require STORAGE_PROVIDER=s3");
  }
}

function assertAllowedStorageKey(storageKey: string): void {
  if (!isAllowedMediaObjectKey(storageKey)) {
    throw new Error("Invalid storage key for media upload");
  }
}

export async function uploadMedia(input: UploadMediaInput): Promise<MediaAsset> {
  validateMediaUpload({
    filename: input.filename,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
  });

  const storageKey = buildStorageKey(input.filename, input.objectKey);
  const provider = getStorageProvider();
  const stored = await provider.upload({
    key: storageKey,
    body: input.buffer,
    mimeType: input.mimeType,
  });

  return createMediaAsset({
    filename: input.filename,
    storageKey: stored.key,
    publicUrl: stored.publicUrl,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
    width: input.width ?? null,
    height: input.height ?? null,
    storageProvider: provider.kind,
    createdBy: input.createdBy,
  });
}

export async function createPresignedMediaUpload(input: {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  objectKey?: MediaObjectKeyDescriptor;
}): Promise<PresignMediaResult> {
  validateMediaUpload(input);
  assertPresignedUploadSupported();

  const provider = getStorageProvider();
  if (!provider.getSignedUploadUrl) {
    throw new Error("Storage provider does not support presigned uploads");
  }

  const storageKey = buildStorageKey(input.filename, input.objectKey);
  const signed = await provider.getSignedUploadUrl({
    key: storageKey,
    mimeType: input.mimeType,
  });

  return {
    storageKey,
    publicUrl: provider.getPublicUrl(storageKey),
    upload: {
      url: signed.url,
      method: signed.method,
      headers: signed.headers,
    },
  };
}

export async function completePresignedMediaUpload(
  input: CompleteMediaUploadInput
): Promise<MediaAsset> {
  validateMediaUpload({
    filename: input.filename,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
  });
  assertPresignedUploadSupported();
  assertAllowedStorageKey(input.storageKey);

  const existing = await getMediaAssetByStorageKey(input.storageKey);
  if (existing) {
    throw new Error("Media asset already registered for this storage key");
  }

  const provider = getStorageProvider();

  return createMediaAsset({
    filename: input.filename,
    storageKey: input.storageKey,
    publicUrl: provider.getPublicUrl(input.storageKey),
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
    width: input.width ?? null,
    height: input.height ?? null,
    storageProvider: provider.kind,
    createdBy: input.createdBy,
  });
}

export async function updateMediaMetadata(
  id: string,
  input: UpdateMediaMetadataInput
): Promise<MediaAsset> {
  const data = UpdateMediaMetadataSchema.parse(input);
  const existing = await getMediaAssetById(id);
  if (!existing) {
    throw new Error("Media asset not found");
  }
  return updateMediaAsset(id, data);
}

export async function deleteMedia(id: string): Promise<void> {
  const asset = await getMediaAssetById(id);
  if (!asset) {
    throw new Error("Media asset not found");
  }

  const usageCount = await countPortfolioMediaAssetReferences(
    asset.id,
    asset.publicUrl
  );
  if (usageCount > 0) {
    throw new Error(
      `Cannot delete media used by ${usageCount} portfolio, gallery, or article reference(s)`
    );
  }

  const provider = getStorageProvider();
  await provider.delete(asset.storageKey);
  await deleteMediaAssetRecord(id);
}
