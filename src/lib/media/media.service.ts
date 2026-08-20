import type { MediaStorageFolder } from "@/lib/media/storage-paths";
import {
  buildStorageKey,
  DEFAULT_MEDIA_STORAGE_FOLDER,
} from "@/lib/media/storage-paths";
import {
  createMediaAsset,
  getMediaAssetByStorageKey,
} from "@/lib/data/media";
import { getStorageProvider, getStorageProviderKind } from "@/lib/storage";
import type { MediaAsset } from "@/lib/types/media";
import { validateMediaUpload } from "@/lib/media/validate-upload";

export interface UploadMediaInput {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  createdBy: string;
  folder?: MediaStorageFolder;
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

function assertPresignedUploadSupported(): void {
  if (getStorageProviderKind() !== "s3") {
    throw new Error("Presigned uploads require STORAGE_PROVIDER=s3");
  }
}

export async function uploadMedia(input: UploadMediaInput): Promise<MediaAsset> {
  validateMediaUpload({
    filename: input.filename,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
  });

  const storageKey = buildStorageKey(
    input.filename,
    input.folder ?? DEFAULT_MEDIA_STORAGE_FOLDER
  );
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
  folder?: MediaStorageFolder;
}): Promise<PresignMediaResult> {
  validateMediaUpload(input);
  assertPresignedUploadSupported();

  const provider = getStorageProvider();
  if (!provider.getSignedUploadUrl) {
    throw new Error("Storage provider does not support presigned uploads");
  }

  const storageKey = buildStorageKey(
    input.filename,
    input.folder ?? DEFAULT_MEDIA_STORAGE_FOLDER
  );
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
